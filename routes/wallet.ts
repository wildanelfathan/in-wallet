// routes/wallet.ts
import express, { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { getUserFromAuthHeader } from "../lib/auth";

const router: Router = express.Router();
const prisma = new PrismaClient();

// Auth middleware for wallet operations
const authMiddleware = async (req: Request, res: Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header required" });
  }

  const user = await getUserFromAuthHeader(authHeader);
  
  if (!user) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // Add user to request for use in route handlers
  (req as any).user = user;
  next();
};

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

// ✅ POST send funds (with authentication)
router.post("/send", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId, amount } = req.body;

    // Input validation
    if (!senderId || typeof senderId !== 'string') {
      return res.status(400).json({ 
        error: "Invalid senderId", 
        details: "senderId is required and must be a string" 
      });
    }

    if (!receiverId || typeof receiverId !== 'string') {
      return res.status(400).json({ 
        error: "Invalid receiverId", 
        details: "receiverId is required and must be a string" 
      });
    }

    if (senderId === receiverId) {
      return res.status(400).json({ 
        error: "Invalid transaction", 
        details: "Cannot send funds to the same wallet" 
      });
    }

    // Amount validation
    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ 
        error: "Invalid amount", 
        details: "Amount must be a positive number greater than 0" 
      });
    }

    // Check for reasonable amount limits (prevent accidental large transfers)
    const MAX_TRANSACTION_AMOUNT = 1000000; // $1M limit
    if (parsedAmount > MAX_TRANSACTION_AMOUNT) {
      return res.status(400).json({ 
        error: "Amount too large", 
        details: `Maximum transaction amount is ${MAX_TRANSACTION_AMOUNT}` 
      });
    }

    // Minimum transaction amount (prevent spam with tiny amounts)
    const MIN_TRANSACTION_AMOUNT = 0.01;
    if (parsedAmount < MIN_TRANSACTION_AMOUNT) {
      return res.status(400).json({ 
        error: "Amount too small", 
        details: `Minimum transaction amount is ${MIN_TRANSACTION_AMOUNT}` 
      });
    }

    // Fetch sender and receiver wallets
    const [sender, receiver] = await Promise.all([
      prisma.wallet.findUnique({ where: { id: senderId } }),
      prisma.wallet.findUnique({ where: { id: receiverId } })
    ]);

    if (!sender) {
      return res.status(404).json({ 
        error: "Sender wallet not found", 
        details: `Wallet with ID ${senderId} does not exist` 
      });
    }

    if (!receiver) {
      return res.status(404).json({ 
        error: "Receiver wallet not found", 
        details: `Wallet with ID ${receiverId} does not exist` 
      });
    }

    // Check sender's balance
    if (sender.balance < parsedAmount) {
      return res.status(400).json({ 
        error: "Insufficient balance", 
        details: `Available balance: ${sender.balance}, Required: ${parsedAmount}`,
        availableBalance: sender.balance,
        requestedAmount: parsedAmount
      });
    }

    // Use database transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Update sender's balance (subtract amount)
      const updatedSender = await tx.wallet.update({
        where: { id: senderId },
        data: { balance: { decrement: parsedAmount } },
      });

      // Update receiver's balance (add amount)
      const updatedReceiver = await tx.wallet.update({
        where: { id: receiverId },
        data: { balance: { increment: parsedAmount } },
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          fromWalletId: senderId,
          toWalletId: receiverId,
          amount: parsedAmount,
        },
      });

      return {
        transaction,
        senderNewBalance: updatedSender.balance,
        receiverNewBalance: updatedReceiver.balance,
      };
    });

    // Log successful transaction
    console.log(`✅ Transaction completed: ${senderId} -> ${receiverId} (${parsedAmount})`);

    return res.status(200).json({
      success: true,
      message: "Transaction completed successfully",
      data: {
        transactionId: result.transaction.id,
        amount: parsedAmount,
        senderId,
        receiverId,
        senderNewBalance: result.senderNewBalance,
        receiverNewBalance: result.receiverNewBalance,
        timestamp: result.transaction.createdAt,
        status: 'completed'
      }
    });

  } catch (error: any) {
    console.error('❌ Transaction failed:', error);
    
    // Handle Prisma-specific errors
    if (error?.code === 'P2025') {
      return res.status(404).json({ 
        error: "Wallet not found", 
        details: "One or both wallets do not exist" 
      });
    }

    // Handle other database errors
    if (error?.code && error.code.startsWith('P')) {
      return res.status(500).json({ 
        error: "Database error", 
        details: "A database error occurred during the transaction" 
      });
    }

    // Generic error handler
    return res.status(500).json({ 
      error: "Transaction failed", 
      details: "An unexpected error occurred while processing the transaction" 
    });
  }
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
