import { authMiddleware } from "@/lib/middleware";
import { Request, Response, Router } from "express";
import User from "../models/user";

const router = Router();

const getUsers = (req: Request, res: Response) => {
  User.find()
    .select("-password")
    .populate("songs")
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      res.status(500).json({ message: "Internal server error", error });
    });
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

const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

router.get("/", authMiddleware, getUsers);
router.get("/:id", authMiddleware, getUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;
