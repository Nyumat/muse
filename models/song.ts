import mongoose, { Schema } from "mongoose";

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

export default Song;
