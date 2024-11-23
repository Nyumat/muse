"use client";

import { useEffect, useState } from "react";

export default function TracksPage() {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const fetchTracks = async () => {
      const res = await fetch("/api/tracks", {
        method: "GET",
      });

      const data = await res.json();
      if (!data.error) {
        setTracks(data);
      }
    };

    fetchTracks();
  }, []);

  return (
    <div>
      <h1>Your Tracks</h1>
      {tracks.map((track: { id: string; title: string; file_url: string }) => (
        <div key={track.id}>
          <h2>{track.title}</h2>
          <audio controls>
            <source src={track.file_url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ))}
    </div>
  );
}
