import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();

  const [, , , , , id, userId] = request.url.split("/");

  if (!userId) {
    return NextResponse.json(
      { error: "Missing required fields `userId`" },
      { status: 400 }
    );
  }

  if (!id) {
    return NextResponse.json(
      { error: "Missing required fields `id`" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching playlists:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }

  return NextResponse.json(data);
}
