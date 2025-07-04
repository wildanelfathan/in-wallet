import { Router } from "express";
const router = Router();

// Cek saldo wallet (simulasi)
router.get("/balance", async (req, res) => {
  res.json({
    address: "0x123456789abcdef...",
    balance: "100.00 USDC",
  });
});

// Kirim dana (simulasi)
router.post("/send", async (req, res) => {
  const { to, amount } = req.body;
  if (!to || !amount) {
    return res.status(400).json({ error: "Tujuan dan jumlah harus diisi" });
  }

  // Di versi nyata: transaksi on-chain
  res.json({
    success: true,
    message: `Mengirim ${amount} ke ${to} (simulasi)`,
  });
});

export default router;
