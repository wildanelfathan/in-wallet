"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/login", async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ error: "Email is required" });
        return;
    }
    res.json({ message: `User ${email} logged in (simulasi)` });
});
router.get("/me", async (req, res) => {
    res.json({
        user: {
            id: "user123",
            email: "user@email.com",
            walletAddress: "0x123456789abcdef...",
        },
    });
});
exports.default = router;
