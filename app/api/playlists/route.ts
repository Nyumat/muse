import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { userId, name } = await request.json();

  if (!userId || !name) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.from("playlists").insert([
    {
      user_id: userId,
      name,
      created_at: new Date(),
      updated_at: new Date(),
      running_time: 0,
    },
  ]);

  if (error) {
    console.error("Error creating playlist:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const userId = new URL(request.url).searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching playlists:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { playlistId } = await request.json();

  if (!playlistId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("playlists")
    .delete()
    .eq("id", playlistId);

  if (error) {
    console.error("Error deleting playlist:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const { playlistId, name } = await request.json();

  if (!playlistId || !name) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("playlists")
    .update({ name })
    .eq("id", playlistId);

  if (error) {
    console.error("Error updating playlist:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { playlistId, trackId } = await request.json();

  if (trackId && playlistId) {
    const { data, error } = await supabase
      .from("playlist_tracks")
      .insert([{ playlist_id: playlistId, track_id: trackId }]);

    if (error) {
      console.error("Error adding track to playlist:", error);
      return NextResponse.json({ error: error }, { status: 500 });
    }

    return NextResponse.json(data);
  }

  return NextResponse.json(
    { error: "Missing required fields" },
    { status: 400 }
  );
}
