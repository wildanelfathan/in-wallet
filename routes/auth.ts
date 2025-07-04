import { Router, Request, Response } from "express";
const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: "Email is required" });
    return;
  }

  res.json({ message: `User ${email} logged in (simulasi)` });
});

router.get("/me", async (req: Request, res: Response) => {
  res.json({
    user: {
      id: "user123",
      email: "user@email.com",
      walletAddress: "0x123456789abcdef...",
    },
  });
});

export default router;
