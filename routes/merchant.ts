import { Router, Request, Response } from "express";
const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ error: "Nama merchant wajib diisi" });
    return;
  }

  res.json({ message: `Merchant ${name} berhasil didaftarkan (simulasi)` });
});

router.get("/dashboard", async (req: Request, res: Response) => {
  res.json({
    merchant: "Toko Kopi Crypto",
    totalSales: "1500.00 USDC",
    transactions: 35,
  });
});

export default router;
