import { Router, Request, Response } from "express";
const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: req.t('auth.emailRequired') });
    return;
  }

  res.json({ message: req.t('auth.loginSuccess', { email }) });
});

router.get("/me", async (req: Request, res: Response) => {
  res.json({
    user: {
      id: "user123",
      email: "user@email.com",
      walletAddress: "0x123456789abcdef...",
    },
    message: req.t('auth.userInfo'),
  });
});

export default router;
