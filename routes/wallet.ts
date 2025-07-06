// routes/wallet.ts
import express, { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const router: Router = express.Router();
const prisma = new PrismaClient();

// ✅ GET balance by walletId
router.get("/balance/:walletId", async (req: Request, res: Response) => {
  const { walletId } = req.params;

  const wallet = await prisma.wallet.findUnique({
    where: { id: walletId },
  });

  if (!wallet) {
    return res.status(404).json({ error: "Wallet not found" });
  }

  return res.json({ walletId, balance: wallet.balance });
});

// ✅ POST send funds
router.post("/send", async (req: Request, res: Response) => {
  const { fromWalletId, toWalletId, amount } = req.body;

  const parsedAmount = parseFloat(amount);
  if (!fromWalletId || !toWalletId || isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const sender = await prisma.wallet.findUnique({ where: { id: fromWalletId } });
  const receiver = await prisma.wallet.findUnique({ where: { id: toWalletId } });

  if (!sender || !receiver) {
    return res.status(404).json({ error: "Sender or receiver wallet not found" });
  }

  if (sender.balance < parsedAmount) {
    return res.status(400).json({ error: "Insufficient balance" });
  }

  await prisma.wallet.update({
    where: { id: fromWalletId },
    data: { balance: { decrement: parsedAmount } },
  });

  await prisma.wallet.update({
    where: { id: toWalletId },
    data: { balance: { increment: parsedAmount } },
  });

  const transaction = await prisma.transaction.create({
    data: {
      fromWalletId,
      toWalletId,
      amount: parsedAmount,
    },
  });

  return res.json({ message: "Transaction successful", transaction });
});

// ✅ GET received transactions
router.get("/received/:walletId", async (req: Request, res: Response) => {
  const { walletId } = req.params;

  const transactions = await prisma.transaction.findMany({
    where: { toWalletId: walletId },
    orderBy: { createdAt: "desc" },
  });

  return res.json({ walletId, received: transactions });
});

// ✅ GET full transaction history
router.get("/history/:walletId", async (req: Request, res: Response) => {
  const { walletId } = req.params;

  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        { fromWalletId: walletId },
        { toWalletId: walletId },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  return res.json({ walletId, history: transactions });
});

export default router;
