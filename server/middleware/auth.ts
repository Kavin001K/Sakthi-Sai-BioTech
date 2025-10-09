import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { storage } from "../storage";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || "fallback_secret_key";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
    email: string;
    name: string;
  };
}

export function generateToken(user: { id: string; username: string; role: string; email: string; name: string }) {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      role: user.role, 
      email: user.email, 
      name: user.name 
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
}

export async function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.id);
    
    if (!user) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
      name: user.name,
    };
    
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

export function authorizeRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    next();
  };
}
