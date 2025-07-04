"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/register", async (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400).json({ error: "Nama merchant wajib diisi" });
        return;
    }
    res.json({ message: `Merchant ${name} berhasil didaftarkan (simulasi)` });
});
router.get("/dashboard", async (req, res) => {
    res.json({
        merchant: "Toko Kopi Crypto",
        totalSales: "1500.00 USDC",
        transactions: 35,
    });
});
exports.default = router;
