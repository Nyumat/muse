import { authMiddleware } from "@/lib/middleware";
import { Request, Response, Router } from "express";
import User from "../models/user";
import { MuseResponse } from "../util/types";

const router = Router();

const getUsers = (req: Request, res: Response) => {
  res.json({ message: "GET /users" });
};

// TODO: Send less info back to the client
const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const user = await User.findById(id).select("-password").populate("songs");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

const createUser = async (
  req: Request,
  res: Response
): Promise<MuseResponse> => {
  const { username, email, password, name, pfp, bio } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const newUser = await User.create({
      username,
      email,
      password,
      name,
      pfp,
      bio,
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

const updateUser = (req: Request, res: Response) => {
  res.json({ message: "PUT /users/:id" });
};

const deleteUser = async (
  req: Request,
  res: Response
): Promise<MuseResponse> => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Invalid input" });
  }
};

router.get("/", getUsers);
router.get("/:id", authMiddleware, getUser);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
