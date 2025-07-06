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

// Get wallet balance
router.get("/balance", async (req: Request, res: Response) => {
  try {
    // Mock wallet balance - replace with actual blockchain/database query
    const balance = {
      available: "1250.00",
      pending: "50.00",
      total: "1300.00",
      currency: "USD",
      lastUpdated: new Date().toISOString(),
    };

    res.json({ balance });
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    res.status(500).json({ error: "Failed to fetch wallet balance" });
  }
});

// Get destination accounts
router.get("/accounts", async (req: Request, res: Response) => {
  try {
    // Mock destination accounts - replace with actual database query
    const accounts = [
      {
        id: "acc_1",
        type: "bank_account",
        name: "Chase Checking",
        accountNumber: "123456789",
        routingNumber: "021000021",
        bankName: "Chase Bank",
        isVerified: true,
        isActive: true,
        currency: "USD",
        fees: {
          fixed: "0.25",
          percentage: "0.1"
        }
      },
      {
        id: "acc_2",
        type: "ewallet",
        name: "John Doe",
        accountNumber: "john.doe@email.com",
        ewalletType: "paypal",
        isVerified: true,
        isActive: true,
        currency: "USD",
        fees: {
          percentage: "2.0"
        }
      },
      {
        id: "acc_3",
        type: "bank_account",
        name: "Wells Fargo Savings",
        accountNumber: "987654321",
        routingNumber: "121000248",
        bankName: "Wells Fargo",
        isVerified: false,
        isActive: false,
        currency: "USD"
      }
    ];

    res.json({ accounts });
  } catch (error) {
    console.error("Error fetching destination accounts:", error);
    res.status(500).json({ error: "Failed to fetch destination accounts" });
  }
});

// Add destination account
router.post("/accounts", async (req: Request, res: Response) => {
  try {
    const { type, name, accountNumber, routingNumber, bankName, ewalletType } = req.body;

    // Validate required fields
    if (!type || !name || !accountNumber) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (type === "bank_account" && !routingNumber) {
      return res.status(400).json({ error: "Routing number is required for bank accounts" });
    }

    if (type === "ewallet" && !ewalletType) {
      return res.status(400).json({ error: "eWallet type is required for eWallet accounts" });
    }

    // Mock account creation - replace with actual database insertion
    const newAccount = {
      id: `acc_${Date.now()}`,
      type,
      name,
      accountNumber,
      routingNumber,
      bankName,
      ewalletType,
      isVerified: false, // New accounts start unverified
      isActive: true,
      currency: "USD",
      createdAt: new Date().toISOString(),
    };

    res.status(201).json({ 
      account: newAccount,
      message: "Destination account added successfully" 
    });
  } catch (error) {
    console.error("Error adding destination account:", error);
    res.status(500).json({ error: "Failed to add destination account" });
  }
});

// Remove destination account
router.delete("/accounts/:accountId", async (req: Request, res: Response) => {
  try {
    const { accountId } = req.params;

    if (!accountId) {
      return res.status(400).json({ error: "Account ID is required" });
    }

    // Mock account deletion - replace with actual database deletion
    res.json({ message: "Destination account removed successfully" });
  } catch (error) {
    console.error("Error removing destination account:", error);
    res.status(500).json({ error: "Failed to remove destination account" });
  }
});

// Verify destination account
router.post("/accounts/:accountId/verify", async (req: Request, res: Response) => {
  try {
    const { accountId } = req.params;

    if (!accountId) {
      return res.status(400).json({ error: "Account ID is required" });
    }

    // Mock account verification - replace with actual verification logic
    res.json({ 
      message: "Account verification initiated",
      verificationId: `ver_${Date.now()}`,
      estimatedTime: "1-2 business days"
    });
  } catch (error) {
    console.error("Error verifying destination account:", error);
    res.status(500).json({ error: "Failed to verify destination account" });
  }
});

// Get withdraw limits
router.get("/withdraw-limits", async (req: Request, res: Response) => {
  try {
    // Mock withdraw limits - replace with actual database query
    const limits = {
      dailyLimit: "5000.00",
      weeklyLimit: "25000.00",
      monthlyLimit: "100000.00",
      dailyUsed: "750.00",
      weeklyUsed: "2500.00",
      monthlyUsed: "8750.00",
      currency: "USD",
    };

    res.json({ limits });
  } catch (error) {
    console.error("Error fetching withdraw limits:", error);
    res.status(500).json({ error: "Failed to fetch withdraw limits" });
  }
});

// Process withdrawal
router.post("/withdraw", async (req: Request, res: Response) => {
  try {
    const { amount, destinationAccountId, currency, note } = req.body;

    // Validate required fields
    if (!amount || !destinationAccountId) {
      return res.status(400).json({ 
        error: "Amount and destination account are required" 
      });
    }

    // Validate amount
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      return res.status(400).json({ 
        error: "Invalid withdrawal amount" 
      });
    }

    // Check minimum withdrawal amount
    if (withdrawAmount < 1) {
      return res.status(400).json({ 
        error: "Minimum withdrawal amount is $1.00" 
      });
    }

    // Mock balance check - replace with actual balance query
    const currentBalance = 1250.00; // Mock available balance
    if (withdrawAmount > currentBalance) {
      return res.status(400).json({ 
        error: "Insufficient funds" 
      });
    }

    // Mock destination account validation - replace with actual database query
    const validAccountIds = ["acc_1", "acc_2", "acc_3"];
    if (!validAccountIds.includes(destinationAccountId)) {
      return res.status(400).json({ 
        error: "Invalid destination account" 
      });
    }

    // Calculate fees (mock logic - replace with actual fee calculation)
    let fee = 0;
    let estimatedArrival = "1-3 business days";
    
    if (destinationAccountId === "acc_1") { // Bank account
      fee = Math.max(0.25, withdrawAmount * 0.001); // $0.25 or 0.1%
      estimatedArrival = "1-3 business days";
    } else if (destinationAccountId === "acc_2") { // eWallet
      fee = withdrawAmount * 0.02; // 2%
      estimatedArrival = "Within 24 hours";
    }

    const netAmount = withdrawAmount - fee;

    // Mock withdrawal processing - replace with actual payment processing
    const transactionId = `wd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create withdrawal record (mock - replace with actual database insertion)
    const withdrawal = {
      transactionId,
      amount: withdrawAmount.toFixed(2),
      fee: fee.toFixed(2),
      netAmount: netAmount.toFixed(2),
      currency: currency || "USD",
      destinationAccountId,
      note: note || null,
      status: "processing",
      estimatedArrival,
      createdAt: new Date().toISOString(),
    };

    // Simulate processing delay (remove in production)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return success response
    res.json({
      success: true,
      transactionId: withdrawal.transactionId,
      amount: withdrawal.amount,
      fee: withdrawal.fee,
      netAmount: withdrawal.netAmount,
      estimatedArrival: withdrawal.estimatedArrival,
      status: withdrawal.status,
      message: "Withdrawal initiated successfully"
    });

  } catch (error) {
    console.error("Error processing withdrawal:", error);
    res.status(500).json({ 
      error: "Failed to process withdrawal. Please try again." 
    });
  }
});

// Get withdrawal history
router.get("/withdrawals", async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Mock withdrawal history - replace with actual database query
    const withdrawals = [
      {
        transactionId: "wd_1698765432_abc123",
        amount: "500.00",
        fee: "1.00",
        netAmount: "499.00",
        currency: "USD",
        destinationAccount: "Chase Checking ****6789",
        status: "completed",
        estimatedArrival: "1-3 business days",
        actualArrival: "2023-10-30T10:30:00.000Z",
        createdAt: "2023-10-28T14:20:00.000Z",
        note: "Monthly transfer"
      },
      {
        transactionId: "wd_1698679032_def456",
        amount: "250.00",
        fee: "5.00",
        netAmount: "245.00",
        currency: "USD",
        destinationAccount: "PAYPAL - John Doe",
        status: "completed",
        estimatedArrival: "Within 24 hours",
        actualArrival: "2023-10-29T08:15:00.000Z",
        createdAt: "2023-10-28T20:45:00.000Z",
        note: null
      }
    ];

    res.json({
      withdrawals,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: withdrawals.length,
        totalPages: 1
      }
    });
  } catch (error) {
    console.error("Error fetching withdrawal history:", error);
    res.status(500).json({ error: "Failed to fetch withdrawal history" });
  }
});

// Get specific withdrawal details
router.get("/withdrawals/:transactionId", async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;

    if (!transactionId) {
      return res.status(400).json({ error: "Transaction ID is required" });
    }

    // Mock withdrawal details - replace with actual database query
    const withdrawal = {
      transactionId,
      amount: "500.00",
      fee: "1.00",
      netAmount: "499.00",
      currency: "USD",
      destinationAccount: {
        id: "acc_1",
        type: "bank_account",
        name: "Chase Checking",
        accountNumber: "****6789",
        bankName: "Chase Bank"
      },
      status: "completed",
      estimatedArrival: "1-3 business days",
      actualArrival: "2023-10-30T10:30:00.000Z",
      createdAt: "2023-10-28T14:20:00.000Z",
      note: "Monthly transfer",
      statusHistory: [
        {
          status: "initiated",
          timestamp: "2023-10-28T14:20:00.000Z",
          description: "Withdrawal request received"
        },
        {
          status: "processing",
          timestamp: "2023-10-28T14:22:00.000Z",
          description: "Payment processing started"
        },
        {
          status: "completed",
          timestamp: "2023-10-30T10:30:00.000Z",
          description: "Funds transferred successfully"
        }
      ]
    };

    res.json({ withdrawal });
  } catch (error) {
    console.error("Error fetching withdrawal details:", error);
    res.status(500).json({ error: "Failed to fetch withdrawal details" });
  }
});

export default router;
