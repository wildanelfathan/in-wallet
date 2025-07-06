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
    return res.status(404).json({ error: req.t('wallet.notFound') });
  }

  return res.json({ 
    walletId, 
    balance: wallet.balance, 
    message: req.t('wallet.balanceRetrieved') 
  });
});

// ✅ POST send funds
router.post("/send", async (req: Request, res: Response) => {
  const { fromWalletId, toWalletId, amount } = req.body;

  const parsedAmount = parseFloat(amount);
  if (!fromWalletId || !toWalletId || isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ error: req.t('wallet.invalidInput') });
  }

  const sender = await prisma.wallet.findUnique({ where: { id: fromWalletId } });
  const receiver = await prisma.wallet.findUnique({ where: { id: toWalletId } });

  if (!sender || !receiver) {
    return res.status(404).json({ error: req.t('wallet.walletNotFound') });
  }

  if (sender.balance < parsedAmount) {
    return res.status(400).json({ error: req.t('wallet.insufficientBalance') });
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

  return res.json({ 
    message: req.t('wallet.transactionSuccess'), 
    transaction 
  });
});

// ✅ GET received transactions
router.get("/received/:walletId", async (req: Request, res: Response) => {
  const { walletId } = req.params;

  const transactions = await prisma.transaction.findMany({
    where: { toWalletId: walletId },
    orderBy: { createdAt: "desc" },
  });

  return res.json({ 
    walletId, 
    received: transactions, 
    message: req.t('wallet.receivedTransactions') 
  });
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

  return res.json({ 
    walletId, 
    history: transactions, 
    message: req.t('wallet.transactionHistory') 
  });
});

export default router;
