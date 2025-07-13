# InWallet API Endpoints

This document provides an overview of all the API endpoints implemented for the InWallet application.

## Authentication

All endpoints require an `x-user-id` header to identify the user making the request.

## Fiat Wallet Endpoints

### GET /api/wallet/fiat/balance
- **Description**: Get the user's fiat wallet balance
- **Response**: Returns the wallet balance and currency
- **Status**: ✅ Implemented

### POST /api/wallet/fiat/send
- **Description**: Send money from the user's fiat wallet
- **Request Body**: 
  - `toUserId`: Recipient user ID
  - `amount`: Amount to send
  - `currency`: Currency code
  - `description`: Optional transaction description
- **Status**: ✅ Implemented

### POST /api/fiat/topup
- **Description**: Top up the user's fiat wallet
- **Request Body**:
  - `amount`: Amount to top up
  - `currency`: Currency code
  - `paymentMethod`: Payment method to use
- **Status**: ✅ Implemented

## Crypto Wallet Endpoints

### GET /api/crypto/balance
- **Description**: Get the user's crypto wallet balance
- **Response**: Returns the wallet address, native token balance, and ERC20 token balances
- **Status**: ✅ Implemented

### POST /api/crypto/send
- **Description**: Send crypto from the user's wallet
- **Request Body**:
  - `fromAddress`: Sender's wallet address
  - `toAddress`: Recipient's wallet address
  - `amount`: Amount to send
  - `token`: (Optional) Token details for ERC20 transfers
  - `network`: Blockchain network
- **Status**: ✅ Implemented

### POST /api/crypto/topup
- **Description**: Top up the user's crypto wallet
- **Request Body**:
  - `amount`: Amount to top up
  - `currency`: Currency/token code
  - `paymentMethod`: Payment method to use
- **Status**: ✅ Implemented

## Transaction Endpoints

### GET /api/transactions
- **Description**: Get the user's transaction history
- **Query Parameters**:
  - `type`: Filter by transaction type
  - `status`: Filter by transaction status
  - `startDate`: Filter by start date
  - `endDate`: Filter by end date
  - `limit`: Number of transactions to return (default: 20)
  - `offset`: Pagination offset (default: 0)
  - `sortBy`: Field to sort by (default: created_at)
  - `sortOrder`: Sort order (asc/desc, default: desc)
- **Status**: ✅ Implemented

## Merchant Endpoints

### POST /api/merchant/qr
- **Description**: Generate a QR code for merchant payments
- **Request Body**:
  - `amount`: Payment amount
  - `currency`: Currency code
  - `description`: (Optional) Payment description
  - `expiresIn`: (Optional) Expiry time in minutes
- **Status**: ✅ Implemented

### GET /api/merchant/sales
- **Description**: Get merchant sales history
- **Query Parameters**:
  - `startDate`: Filter by start date
  - `endDate`: Filter by end date
  - `status`: Filter by transaction status
  - `limit`: Number of transactions to return (default: 20)
  - `offset`: Pagination offset (default: 0)
- **Status**: ✅ Implemented

### POST /api/merchant/withdraw
- **Description**: Withdraw merchant funds to a bank account
- **Request Body**:
  - `amount`: Amount to withdraw
  - `bankAccountId`: ID of the bank account to withdraw to
  - `description`: (Optional) Withdrawal description
- **Status**: ✅ Implemented

## Bill Payment Endpoints

### GET /api/bills/providers
- **Description**: Get list of bill providers
- **Query Parameters**:
  - `category`: Filter by provider category
  - `country`: Filter by country
  - `search`: Search by provider name
- **Status**: ✅ Implemented

### POST /api/bills/pay
- **Description**: Pay a bill
- **Request Body**:
  - `providerId`: ID of the bill provider
  - `amount`: Payment amount
  - `currency`: Currency code
  - `accountNumber`: Account/subscriber number
  - `customerFields`: Additional fields required by the provider
  - `walletId`: ID of the wallet to pay from
- **Status**: ✅ Implemented

## User Endpoints

### GET /api/user/profile
- **Description**: Get user profile information
- **Response**: Returns user details, profile data, merchant status, and wallet information
- **Status**: ✅ Implemented

## QR Code Endpoints

### POST /api/qr/scan
- **Description**: Scan and decode a QR code
- **Request Body**:
  - `qrData`: QR code data (string or object)
- **Response**: Returns decoded QR code data based on the QR type
- **Status**: ✅ Implemented

## Environment Variables

The following environment variables are required for the API to function properly:

- `EXPO_PUBLIC_SUPABASE_URL`: Supabase project URL
- `EXPO_PUBLIC_SUPABASE_KEY`: Supabase public API key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (for server-side operations)
- `NEXT_PUBLIC_RPC_URL`: Blockchain RPC URL (e.g., Infura endpoint)
- `PRIVATE_KEY`: Private key for crypto operations
- `DIGIFLAZZ_API_KEY`: (Optional) DigiFlazz API key for bill payments
- `XENDIT_API_KEY`: (Optional) Xendit API key for payment processing 