import { BUCKET_NAME, getPresignedUrl } from "@/lib/cloudflare";
import { authMiddleware } from "@/lib/middleware";
import Playlist from "@/models/playlist";
import Song from "@/models/song";
import { convertToObjectId } from "@/util/urlValidator";
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
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ message: "Invalid input" });
    }

    const userId = convertToObjectId(id.trim());

    const user = await User.findById(userId).select("-password").populate("songs");

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

async function getTotalNumberOfDownloads(userId: string) {
    return await Song.countDocuments({ createdBy: userId });
}

async function storageUsedByDownloads(userId: string) {
    const songs = await Song.find({ createdBy: userId });
    if (!songs) return 0;

    const contentUrls = await Promise.all(songs.map((song) => getPresignedUrl({
        key: song?.r2Key || "",
        bucket: BUCKET_NAME,
        expiresIn: 60,
    })));

    const sizes = await Promise.all(contentUrls?.map(async (url) => {
        const res = await fetch(url);
        const size = res.headers.get("content-length");
        return size ? parseInt(size, 10) : 0;
    }));

    return sizes.reduce((acc, size) => acc + size, 0);
}

async function getTotalNumberOfPllaylists(userId: string) {
    return await Playlist.countDocuments({ createdBy: userId });
}

async function getTotalListeningTime(userId: string) {
    const songs = await Song.find({ createdBy: userId });
    return songs.reduce((acc, song) => acc + (song.listeningTime || 0), 0);
}

const userStatistics = async (req: Request, res: Response) => {
    const userId = req.auth?._id;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const totalDownloads = await getTotalNumberOfDownloads(userId);
    const storageUsed = await storageUsedByDownloads(userId);
    const totalPlaylists = await getTotalNumberOfPllaylists(userId);
    const totalListeningTime = await getTotalListeningTime(userId);

    const storageUsedMB = Number(storageUsed) / (1024 * 1024);
    const totalListeningTimeHours = totalListeningTime / 3600;

    res.json({
        totalDownloads,
        storageUsed: storageUsedMB.toFixed(2),
        totalPlaylists,
        totalListeningTime: totalListeningTimeHours.toFixed(2),
    });
};

router.get("/", authMiddleware, getUsers);
router.get("/:id", authMiddleware, getUser);
router.delete("/:id", authMiddleware, deleteUser);
router.get("/data/stats", authMiddleware, userStatistics);

export default router;
