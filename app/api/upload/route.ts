import { createClient } from "@/lib/supabase/server";
import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

import { YtDlp, YtDlpConfig } from "@yemreak/yt-dlp";

const config: YtDlpConfig = { workdir: "./downloads" };
const ytDlp = new YtDlp(config);

export async function POST(request: Request) {
  const supabase = await createClient();
  const { userId, videoUrl, title } = await request.json();

  if (!userId || !videoUrl || !title) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const videoUrls = await ytDlp.download({
      url: videoUrl,
      format: "ba",
    });

    const output = path.join(__dirname, "downloads", `${title}.mp3`);
    const fileBuffer = fs.readFileSync(output);
    const { data, error } = await supabase.storage
      .from("audio")
      .upload(`${userId}/${title}.mp3`, fileBuffer, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    fs.unlinkSync(output);

    if (error) throw error;

    const fileUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/audio/${userId}/${title}.mp3`;

    const { error: dbError } = await supabase
      .from("tracks")
      .insert([{ user_id: userId, title, file_url: fileUrl }]);

    if (dbError) throw dbError;

    return NextResponse.json({
      message: "Track uploaded successfully!",
      fileUrl,
    });
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
