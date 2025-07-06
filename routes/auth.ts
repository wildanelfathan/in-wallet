import { Router, Request, Response } from "express";
import { loginUser, getCurrentUser, logoutUser, getUserFromAuthHeader } from "../lib/auth";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  const { accessToken } = req.body;
  
  if (!accessToken) {
    res.status(400).json({ error: "Access token is required" });
    return;
  }

  const result = await loginUser(accessToken);
  
  if (result.success) {
    res.json({ 
      message: "Login successful",
      user: result.user 
    });
  } else {
    res.status(401).json({ error: result.error });
  }
});

router.get("/me", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    res.status(401).json({ error: "Authorization header is required" });
    return;
  }

  const user = await getUserFromAuthHeader(authHeader);
  
  if (user) {
    res.json({ user });
  } else {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

router.post("/logout", async (req: Request, res: Response) => {
  const { userId } = req.body;
  
  const result = await logoutUser(userId);
  
  if (result.success) {
    res.json({ message: "Logout successful" });
  } else {
    res.status(500).json({ error: result.error });
  }
});

export default router;
