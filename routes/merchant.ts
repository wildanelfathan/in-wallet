import { Router } from "express";
const router = Router();

// Register merchant (simulasi)
router.post("/register", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Nama merchant wajib diisi" });

  res.json({ message: `Merchant ${name} berhasil didaftarkan (simulasi)` });
});

// Dashboard merchant (simulasi)
router.get("/dashboard", async (req, res) => {
  res.json({
    merchant: "Toko Kopi Crypto",
    totalSales: "1500.00 USDC",
    transactions: 35,
  });
});

export default router;
