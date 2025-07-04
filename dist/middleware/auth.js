"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
// Middleware otorisasi sederhana (simulasi)
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    // Simulasi token check
    if (!token || token !== "Bearer mysecrettoken") {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
};
exports.authMiddleware = authMiddleware;
