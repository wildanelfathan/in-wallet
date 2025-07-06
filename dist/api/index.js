"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// api/index.ts
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../routes/auth"));
const wallet_1 = __importDefault(require("../routes/wallet"));
const merchant_1 = __importDefault(require("../routes/merchant"));
const admin_1 = __importDefault(require("../routes/admin"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/auth", auth_1.default);
app.use("/api/wallet", wallet_1.default);
app.use("/api/merchant", merchant_1.default);
app.use("/api/admin", admin_1.default);
exports.default = app;
