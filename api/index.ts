// api/index.ts
import express from "express";
import { createServer } from "@vercel/node";
import authRoutes from "../routes/auth";
import walletRoutes from "../routes/wallet";
import merchantRoutes from "../routes/merchant";
import adminRoutes from "../routes/admin";

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/merchant", merchantRoutes);
app.use("/api/admin", adminRoutes);

export default createServer(app);
