"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/balance", async (req, res) => {
    res.json({
        address: "0x123456789abcdef...",
        balance: "100.00 USDC",
    });
});
router.post("/send", async (req, res) => {
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
exports.default = router;
