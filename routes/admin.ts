import { Router } from "express";
const router = Router();

// Lihat semua user (simulasi)
router.get("/users", async (req, res) => {
  res.json({
    users: [
      { id: "user1", email: "user1@example.com" },
      { id: "user2", email: "user2@example.com" },
    ],
  });
});

// Lihat semua transaksi (simulasi)
router.get("/transactions", async (req, res) => {
  res.json({
    transactions: [
      { from: "0xabc", to: "0xdef", amount: 20 },
      { from: "0x123", to: "0x456", amount: 50 },
    ],
  });
});

export default router;
