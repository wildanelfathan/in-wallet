export type ReceiptData = {
  type: 'transfer' | 'bill_payment' | 'merchant_payment';
  amount: number;
  currency: string;
  timestamp: string;
  // Transfer specific
  fromAccount?: string;
  toAccount?: string;
  // Bill payment specific
  provider?: string;
  accountNumber?: string;
  customerFields?: Record<string, string>;
  // Merchant payment specific
  merchantName?: string;
  merchantId?: string;
  orderId?: string;
};

/**
 * Generate a receipt URL for a transaction
 * In a real implementation, this would generate a PDF and store it in cloud storage
 */
export async function generateReceipt(data: ReceiptData): Promise<string> {
  // This is a mock implementation
  // In production, this would:
  // 1. Generate a PDF using a template
  // 2. Upload to cloud storage
  // 3. Return the URL
  
  const receiptId = Math.random().toString(36).substring(2, 15);
  return `https://api.example.com/receipts/${receiptId}.pdf`;
}

/**
 * Downloads a transaction receipt as a file (platform specific implementation)
 * @param transaction The transaction to download a receipt for
 * @returns A promise that resolves when the download is complete
 */
export const downloadReceipt = async (transaction: any): Promise<void> => {
  const receiptText = await generateReceipt(transaction);
  
  // This is a placeholder for platform-specific file download implementation
  // On mobile, this would typically use React Native's file system APIs
  // and share functionality
  
  console.log('Receipt download requested:', receiptText);
  
  // In a real implementation, you would:
  // 1. Create a file with the receipt text
  // 2. Save it to the device's download folder or documents directory
  // 3. Return the file path or trigger the device's share functionality
  
  return Promise.resolve();
}; 