import Playlist from "@/models/playlist";
import Song from "@/models/song";
import User from "@/models/user";
import mongoose from "mongoose";

import { connectToUri } from "@/lib/database";
import { config } from "dotenv";

config();

const MONGODB_LOCAL_URI = process.env.MONGODB_URI_LOCAL;
const MONGODB_PROD_URI = process.env.MONGODB_URI_PROD;

async function syncUserData(userId: string) {
    try {
        let user = await User.findById(userId)
            .populate('songs')
            .populate('playlists');

        if (!user) {
            throw new Error('User not found');
        }

        const playlists = await Playlist.find({ createdBy: user._id });
        const songs = await Song.find({ createdBy: user._id });

        const userData = user.toObject();
        const songsData = songs.map(song => song.toObject());
        const playlistsData = playlists.map(playlist => playlist.toObject());

        return {
            user: userData,
            songs: songsData,
            playlists: playlistsData,
        };
    } catch (error) {
        console.error('Error in syncUserData:', error);
        throw error;
    }
}

async function main(userId: string) {
    try {
        if (!MONGODB_LOCAL_URI) {
            throw new Error('Local URI not found');
        }

        if (!MONGODB_PROD_URI) {
            throw new Error('Prod URI not found');
        }

        await connectToUri(MONGODB_LOCAL_URI);

        const syncedData = await syncUserData(userId);

        await mongoose.connection.close();
        await connectToUri(MONGODB_PROD_URI);

        await User.findOneAndReplace(
            { _id: syncedData.user._id },
            syncedData.user,
            { upsert: true }
        );

        for (const song of syncedData.songs) {
            await Song.findOneAndReplace(
                { _id: song._id },
                song,
                { upsert: true }
            );
        }

        for (const playlist of syncedData.playlists) {
            await Playlist.findOneAndReplace(
                { _id: playlist._id },
                playlist,
                { upsert: true }
            );
        }

        console.log('Sync completed successfully');
    } catch (error) {
        console.error('Sync failed:', error);
    } finally {
        await mongoose.connection.close();
    }
}

(async () => {
    const userId = process.argv[2];
    if (!userId) {
        console.error('UserID is required');
        process.exit(1);
    }
    await main(userId);
})();