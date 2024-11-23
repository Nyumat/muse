import { SkeletonLayout } from "@/components/skeleton";
import { createClient } from "@/lib/supabase/server";
import { Playlist } from "@/lib/utils";

async function fetchTracks() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("tracks").select("*");

  if (!data)
    throw new Error(
      "An error occurred while fetching tracks. Please try again"
    );

  if (error) {
    console.error("Error fetching tracks:", error);
    throw new Error(error);
  }

  for (const track of data) {
    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from("audio")
        .createSignedUrl(track.file_url, 60 * 60 * 24);

    if (signedUrlError) {
      console.error("Error creating signed URL:", signedUrlError);
      throw new Error(signedUrlError.message);
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
      throw new Error(signedUrlError.message);
    }
    track.image_url = signedUrlData.signedUrl;
  }

  return data;
}

async function fetchPlaylists(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", userId);

  if (!data)
    throw new Error(
      "An error occurred while fetching playlists. Please try again"
    );

  if (error) {
    console.error("Error fetching playlists:", error);
    throw new Error(error);
  }

  return data as Playlist[];
}

export default async function Page() {
  const supabase = await createClient();
  const session = await supabase.auth.getUser();
  const userId = session.data.user?.id;
  if (!session) throw new Error("You must be logged in to view this page");
  if (!userId) throw new Error("User ID not found");
  const playlists = await fetchPlaylists(userId);
  const tracks = await fetchTracks();
  return (
    <SkeletonLayout
      playlists={playlists}
      tracks={tracks}
      userId={userId}
    />
  );
}
