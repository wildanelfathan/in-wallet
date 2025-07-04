import { Router } from "express";
const router = Router();

// Simulasi login
router.post("/login", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  // Di versi nyata nanti: validasi dengan Privy SDK
  res.json({ message: `User ${email} logged in (simulasi)` });
});

router.get("/me", async (req, res) => {
  // Simulasi ambil info user
  res.json({
    user: {
      id: "user123",
      email: "user@email.com",
      walletAddress: "0x123456789abcdef...",
    },
  });
});

export default router;
