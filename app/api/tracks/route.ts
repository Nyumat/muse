import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("tracks").select("*");

  if (!data)
    return NextResponse.json({ error: "No tracks found" }, { status: 404 });

  if (error) {
    console.error("Error fetching tracks:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }

  for (const track of data) {
    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from("audio")
        .createSignedUrl(track.file_url, 60 * 60 * 24);

    if (signedUrlError) {
      console.error("Error creating signed URL:", signedUrlError);
      return NextResponse.json(
        { error: signedUrlError.message },
        { status: 500 }
      );
    }

    track.file_url = signedUrlData.signedUrl;
  }

  for (const track of data) {
    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from("track_images")
        .createSignedUrl(track.image_url, 60 * 60 * 24);
    if (signedUrlError) {
      console.error("Error creating signed URL:", signedUrlError);
      return NextResponse.json(
        { error: signedUrlError.message },
        { status: 500 }
      );
    }
    track.image_url = signedUrlData.signedUrl;
  }

  return NextResponse.json(data);
}
