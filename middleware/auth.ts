import { Request, Response, NextFunction } from "express";

// Middleware otorisasi sederhana (simulasi)
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  // Simulasi token check
  if (!token || token !== "Bearer mysecrettoken") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
};
