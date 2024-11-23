"use server";

import { exec } from "child_process";
import crypto from "crypto";
import fs from "fs/promises";
import { IPicture, parseBuffer } from "music-metadata";
import { revalidatePath } from "next/cache";
import path from "path";
import { createClient } from "./lib/supabase/server";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Downloads a YouTube video or Sound Cloud track as MP3 using yt-dlp and uploads it to Supabase.
 * @param {string} url - The URL of the YouTube video.
 * @param {string} outputDir - The directory where the MP3 file will be saved.
 */
export async function downloadAudio(
  url: string,
  outputDir: string = "./downloads"
) {
  const supabase = await createClient();
  if (!url) {
    console.error("URL is required.");
    return;
  }

  const auth = await supabase.auth.getUser();
  const userId = auth.data.user?.id;

  if (!userId) {
    throw new Error("User ID not found.");
  }

  try {
    await fs.access(outputDir);
  } catch {
    await fs.mkdir(outputDir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    exec(`yt-dlp --rm-cache-dir`, (error: any, stdout: any, stderr: any) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(`stdout: ${stdout}`);
    });

    const command = `yt-dlp -x --audio-format mp3 --add-metadata --embed-thumbnail --output "${outputDir}/%(title)s.%(ext)s" "${url}"`;

    exec(command, async (error: any, stdout: any, stderr: any) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(`stdout: ${stdout}`);

      try {
        const files = await fs.readdir(outputDir);
        const mp3Files = files.filter(
          (file) => path.extname(file).toLowerCase() === ".mp3"
        );

        for (const file of mp3Files) {
          const filePath = path.join(outputDir, file);

          try {
            const fileBuffer = await retryOperation(
              () => fs.readFile(filePath),
              3,
              1000
            );

            const fileId = crypto.randomUUID();
            const { data, error: uploadError } = await retryOperation(
              () =>
                supabase.storage
                  .from("audio")
                  .upload(`${userId}/${fileId}.mp3`, fileBuffer, {
                    cacheControl: "3600",
                    upsert: true,
                    contentType: "audio/mpeg",
                  }),
              3,
              1000
            );

            if (uploadError) {
              console.error(
                "Error uploading file to Supabase:",
                uploadError.message
              );
              continue;
            }

            console.log("File uploaded successfully:", data);
            await delay(500);

            const metadata = await parseBuffer(fileBuffer, {
              mimeType: "audio/mpeg",
            });

            const cover = selectCover(metadata.common.picture as IPicture[]);
            const songData = {
              title: metadata.common.title || path.parse(file).name,
              artist: metadata.common.artist || "Unknown Artist",
              album: metadata.common.album || "Unknown Album",
              duration: Math.round(metadata.format.duration || 0),
              image: undefined as string | undefined,
            };

            if (cover?.data) {
              const imageId = crypto.randomUUID();
              const imageFormat = cover.format.split("/")[1] || "jpeg";
              const { data: coverData, error: coverError } =
                await retryOperation(
                  () =>
                    supabase.storage
                      .from("track_images")
                      .upload(
                        `${userId}/${imageId}.${imageFormat}`,
                        cover.data,
                        {
                          cacheControl: "3600",
                          upsert: true,
                          contentType: cover.format,
                        }
                      ),
                  3,
                  1000
                );

              if (coverError) {
                console.error(
                  "Error uploading cover image:",
                  coverError.message
                );
              } else {
                console.log("Cover image uploaded successfully:", coverData);
                songData.image = coverData?.path;
              }
            }

            await delay(500);

            const { data: song, error: insertError } = await supabase
              .from("tracks")
              .insert([
                {
                  id: fileId,
                  user_id: userId,
                  title: songData.title,
                  file_url: data.path,
                  created_at: new Date(),
                  album: songData.album,
                  artist: songData.artist,
                  duration: songData.duration,
                  image_url: songData.image || null,
                },
              ]);

            if (insertError) {
              console.error(
                "Error inserting track into database:",
                insertError
              );
            } else {
              console.log("Track inserted successfully:", song);
            }

            await delay(500);

            try {
              await fs.unlink(filePath);
              console.log("Cleaned up temporary file:", filePath);
            } catch (unlinkError) {
              console.error("Error cleaning up file:", unlinkError);
            }
          } catch (processError) {
            console.error(`Error processing file ${file}:`, processError);
          }
        }
        revalidatePath("/platform");
        resolve(true);
      } catch (error) {
        console.error("Error processing files:", error);
        reject(error);
      }
    });
  });
}

/**
 * Retries an async operation with exponential backoff
 */
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number,
  baseDelay: number
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      const delayTime = baseDelay * Math.pow(2, i);
      console.log(`Retry attempt ${i + 1} after ${delayTime}ms`);
      await delay(delayTime);
    }
  }
  throw new Error("Max retries exceeded");
}

/**
 * Selects the best quality cover art from available pictures
 */
function selectCover(pictures: IPicture[] | undefined): IPicture | undefined {
  if (!pictures || pictures.length === 0) return undefined;
  const frontCover = pictures.find((pic) => pic.type === "Cover (front)");
  if (frontCover) return frontCover;
  return pictures[0];
}

/**
 * Processes all MP3 files in the specified directory, extracts metadata, and prints it.
 * @param {string} tracksDir - The directory containing the MP3 files.
 */
async function processDownloadedAudio(tracksDir: string) {
  try {
    const files = await fs.readdir(tracksDir);
    for (const file of files.filter(
      (file) => path.extname(file).toLowerCase() === ".mp3"
    )) {
      const filePath = path.join(tracksDir, file);
      const buffer = await fs.readFile(filePath);
      const metadata = await parseBuffer(buffer, { mimeType: "audio/mpeg" });

      const songData = {
        name: metadata.common.title || path.parse(file).name,
        artist: metadata.common.artist || "Unknown Artist",
        album: metadata.common.album || "Unknown Album",
        duration: Math.round(metadata.format.duration || 0),
        genre: metadata.common.genre?.[0] || "Unknown Genre",
        bpm: metadata.common.bpm ? Math.round(metadata.common.bpm) : null,
        key: metadata.common.key || null,
      };

      console.log(`Metadata for "${file}":`, songData);
    }
  } catch (error) {
    console.error("Error processing MP3 files:", error);
  }
}
