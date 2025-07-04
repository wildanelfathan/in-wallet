import { Router, Request, Response } from "express";
const router = Router();

router.get("/balance", async (req: Request, res: Response) => {
  res.json({
    address: "0x123456789abcdef...",
    balance: "100.00 USDC",
  });
});

router.post("/send", async (req: Request, res: Response) => {
  const { to, amount } = req.body;
  if (!to || !amount) {
    res.status(400).json({ error: "Tujuan dan jumlah harus diisi" });
    return;
  }

  res.json({
    success: true,
    message: `Mengirim ${amount} ke ${to} (simulasi)`,
  });
});

export default router;
