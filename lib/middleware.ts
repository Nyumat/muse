import { generateToken, verifyToken } from "@/lib/jwt";
import User from "@/models/user";
import { NextFunction, Request, Response } from "express";

type JWTDecoded = {
    _id: string;
    email: string;
    name: string;
    username: string;
    pfp?: string;
};

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (req.url === "/health") {
        next();
        return;
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Authorization token missing or invalid." });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = verifyToken(token) as JWTDecoded;
        req.token = token;
        req.auth = {
            _id: decoded._id,
            email: decoded.email,
            name: decoded.name,
            username: decoded.username,
            pfp: decoded.pfp,
        };
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid or expired token." });
    }
};

export const refreshTokenMiddleware = async (
    req: Request,
    res: Response
): Promise<string | undefined> => {
    const token = req.token;
    try {
        const decoded = verifyToken(token) as JWTDecoded;
        const user = await User.findById(decoded._id);

        const newToken = generateToken({
            _id: decoded._id,
            email: user?.email,
            name: user?.name,
            username: user?.username,
            pfp: user?.pfp,
        });

        return newToken;
    } catch (error) {
        res.status(401).json({ error: "Invalid or expired token." });
    }
};
