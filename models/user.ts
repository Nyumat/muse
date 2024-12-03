import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: false },
    pfp: { type: String, required: false },
    bio: { type: String, required: false },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
