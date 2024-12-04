import Song from "@/models/song";
import User from "@/models/user";
import mongoose from "mongoose";

import { config } from "dotenv";

config({ path: ".env.local" });

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const users = await User.find();
    for (const user of users) {
      const userSongs = await Song.find({ createdBy: user._id });
      user.songs = userSongs.map((song) => song._id);
      await user.save();
    }
    console.log("Backfill complete.");
    process.exit(0);
  } catch (err) {
    console.error("Error during backfill:", err);
    process.exit(1);
  }
})();
