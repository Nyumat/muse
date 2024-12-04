import mongoose, { Schema } from "mongoose";
import { z } from 'zod';

const SongSchema = new Schema(
  {
    title: String,
    duration: Number,
    mediaUrl: String,
    r2Key: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    upload_date: String,
    view_count: Number,
    thumbnail: String,
    tags: [String],
    original_url: String,
    stream_url: {
      type: String,
      required: false,
    },
    extractor: String,
    duration_string: String,
    ytdlp_id: String,
    uploader: String,
  },
  {
    timestamps: true,
  }
);

const Song = mongoose.model("Song", SongSchema);

export const songZodSchema = z.object({
    title: z.string(),
    duration: z.number(),
    mediaUrl: z.string(),
    r2Key: z.string(),
    createdBy: z.string(),
    upload_date: z.string(),
    view_count: z.number(),
    thumbnail: z.string(),
    tags: z.array(z.string()),
    original_url: z.string(),
    stream_url: z.string().optional(),
    extractor: z.string(),
    duration_string: z.string(),
    ytdlp_id: z.string(),
    uploader: z.string(),
});

export type SongModel = z.infer<typeof songZodSchema>;

export default Song;
