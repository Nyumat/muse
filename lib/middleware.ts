import { verifyToken } from "@/lib/jwt";
import { NextFunction, Request, Response } from "express";

type JWTDecoded = {
  _id: string;
  email: string;
  name: string;
  username: string;
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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
    };
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};
