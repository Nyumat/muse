import { COVERS_BUCKET_NAME, getPresignedUrl, R2 } from "@/lib/cloudflare";
import { authMiddleware } from "@/lib/middleware";
import Playlist from "@/models/playlist";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import { Request, Response, Router } from "express";
import multer from "multer";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Invalid file type"));
      return;
    }
    cb(null, true);
  },
});

router.post(
  "/playlists",
  authMiddleware,
  upload.single("cover"),
  async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;
      const user = req.auth;
      let coverUrl = null;

      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (req.file) {
        const fileExtension = req.file.originalname.split(".").pop();
        const key = `covers/${crypto.randomUUID()}.${fileExtension}`;
        await R2.send(
          new PutObjectCommand({
            Bucket: COVERS_BUCKET_NAME,
            Key: key,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
          })
        );
        coverUrl = await getPresignedUrl(
          key,
          60 * 60 * 24 * 7,
          COVERS_BUCKET_NAME
        );
      }

      const newPlaylist = new Playlist({
        name,
        description,
        createdBy: user._id,
        coverImage: coverUrl,
        songs: [],
      });

      await newPlaylist.save();
      res.status(201).json(newPlaylist);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Failed to create playlist" });
    }
  }
);

router.get(
  "/playlists",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const user = req.auth;
      if (!user) return res.status(401).json({ error: "Unauthorized" });

      const playlists = await Playlist.find({
        $or: [{ createdBy: user._id }, { isPublic: true }],
      })
        .populate("createdBy")
        .populate("songs");

      res.json(playlists);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch playlists" });
    }
  }
);

router.get(
  "/playlists/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = req.auth;
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      const playlist = await Playlist.findById(id).populate({
        path: "createdBy",
        select: "username _id",
      }).populate("songs");
        

      if (!playlist) {
        return res.status(404).json({ error: "Playlist not found" });
      }

        // TODO: Check if the playlist is public or if the user is the creator

      res.json(playlist);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch playlist" });
    }
  }
);

router.put(
  "/playlists/:id",
  authMiddleware,
  upload.single("cover"),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = req.auth;
      if (!user) return res.status(401).json({ error: "Unauthorized" });

      const playlist = await Playlist.findById(id);
      if (!playlist) {
        return res.status(404).json({ error: "Playlist not found" });
      }

      if (playlist.createdBy.toString() !== user._id.toString()) {
        return res.status(403).json({ error: "Access denied" });
      }

      const updates: any = {
        name: req.body.name,
        description: req.body.description,
        isPublic: req.body.isPublic === "true",
      };

      if (req.file) {
        const fileExtension = req.file.originalname.split(".").pop();
        const key = `covers/${crypto.randomUUID()}.${fileExtension}`;
        await R2.send(
          new PutObjectCommand({
            Bucket: COVERS_BUCKET_NAME,
            Key: key,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
          })
        );
        updates.coverUrl = await getPresignedUrl(
          key,
          60 * 60 * 24 * 7,
          COVERS_BUCKET_NAME
        );
      }

      const updatedPlaylist = await Playlist.findByIdAndUpdate(id, updates, {
        new: true,
      })
        .populate("createdBy")
        .populate("songs");

      res.json(updatedPlaylist);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Failed to update playlist" });
    }
  }
);

router.post(
  "/playlists/:id/songs",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { songId } = req.body;
      const user = req.auth;

      if (!user) return res.status(401).json({ error: "Unauthorized" });

      const playlist = await Playlist.findById(id);
      if (!playlist) {
        return res.status(404).json({ error: "Playlist not found" });
      }

      if (playlist.createdBy.toString() !== user._id.toString()) {
        return res.status(403).json({ error: "Access denied" });
      }

      if (!playlist.songs.includes(songId)) {
        playlist.songs.push(songId);
        await playlist.save();
      }

      const updatedPlaylist = await Playlist.findById(id)
        .populate("createdBy")
        .populate("songs");
      res.json(updatedPlaylist);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Failed to add song to playlist" });
    }
  }
);

router.delete(
  "/playlists/:id/songs/:songId",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { id, songId } = req.params;
      const user = req.auth;

      if (!user) return res.status(401).json({ error: "Unauthorized" });

      const playlist = await Playlist.findById(id);
      if (!playlist) {
        return res.status(404).json({ error: "Playlist not found" });
      }

      if (playlist.createdBy.toString() !== user._id.toString()) {
        return res.status(403).json({ error: "Access denied" });
      }

      playlist.songs = playlist.songs.filter(
        (song) => song.toString() !== songId
      );
      await playlist.save();

      const updatedPlaylist = await Playlist.findById(id)
        .populate("createdBy")
        .populate("songs");
      res.json(updatedPlaylist);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Failed to remove song from playlist" });
    }
  }
);

router.delete(
  "/playlists/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = req.auth;

      if (!user) return res.status(401).json({ error: "Unauthorized" });

      const playlist = await Playlist.findById(id);
      if (!playlist) {
        return res.status(404).json({ error: "Playlist not found" });
      }

      if (playlist.createdBy.toString() !== user._id.toString()) {
        return res.status(403).json({ error: "Access denied" });
      }

      if (playlist.coverImage) {
        const key = playlist.coverImage.split("/").pop();
        await R2.send(
          new DeleteObjectCommand({
            Bucket: COVERS_BUCKET_NAME,
            Key: key,
          })
        );
      }

      await Playlist.findByIdAndDelete(id);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete playlist" });
    }
  }
);

export default router;
