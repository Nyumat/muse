import { generateToken } from "@/lib/jwt";
import { authMiddleware } from "@/lib/middleware";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { Request, Response, Router } from "express";
import { Error } from "mongoose";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const { email, password, name, username } = req.body;

  if (!email || !password || !name || !username) {
    return res
      .status(400)
      .json({ error: "Email, password, name, and username are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      username,
    });
    await newUser.save();

    const token = generateToken({
      _id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      username: newUser.username,
    });

    res.status(201).json({ message: "User created successfully", token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Server error. Please try again later." });
      console.log(error);
    }
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      name: user.name,
      username: user.username,
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

router.get("/checkAuth", authMiddleware, (req, res) => {
  const user = req.auth;
  res.status(200).json({ message: "Authorized access", user });
});

router.get("/user", authMiddleware, (req, res) => {
  const user = req.auth;
  if (!user) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
  res.status(200).json(user);
});

export default router;
