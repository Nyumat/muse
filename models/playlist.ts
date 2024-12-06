import { Schema, model } from "mongoose";
import { z } from "zod";
import { songZodSchema } from "./song";

const playlistSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    coverImage: { type: String, required: false },
    visibility: {
      type: String,
      enum: ["public", "private", "friends"],
      default: "private",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    songs: [{ type: Schema.Types.ObjectId, ref: "Song" }],
  },
  { timestamps: true }
);

const Playlist = model("Playlist", playlistSchema);

export const playlistZodSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  createdBy: z.string(),
  songs: z.array(songZodSchema).optional(),
  coverImage: z.string().optional(),
  visibility: z.enum(["public", "private", "friends"]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type PlaylistModel = z.infer<typeof playlistZodSchema>;

export default Playlist;
