import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import i18next from "./lib/i18n";
import middleware from "i18next-http-middleware";

import authRoutes from "./routes/auth";
import walletRoutes from "./routes/wallet";
import merchantRoutes from "./routes/merchant";
import adminRoutes from "./routes/admin";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Add i18n middleware
app.use(middleware.handle(i18next));

app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/merchant", merchantRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(i18next.t('server.running', { port: PORT }));
});
