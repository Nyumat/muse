import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "OMG A SUPER SECRET";

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token: string | undefined) => {
  if (!token) throw new Error("Token is missing.");
  return jwt.verify(token, JWT_SECRET);
};
