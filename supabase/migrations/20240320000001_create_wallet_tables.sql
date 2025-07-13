-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create wallets table
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    balance NUMERIC NOT NULL DEFAULT 0 CHECK (balance >= 0),
    currency TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_currency UNIQUE (user_id, currency)
);

-- Create transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id TEXT NOT NULL,
    receiver_id TEXT NOT NULL,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_wallets_created_at ON wallets(created_at);
CREATE INDEX idx_transactions_sender_id ON transactions(sender_id);
CREATE INDEX idx_transactions_receiver_id ON transactions(receiver_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- Enable Row Level Security
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create a trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_wallets_updated_at
    BEFORE UPDATE ON wallets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create policies for wallets table
-- Users can view their own wallets
CREATE POLICY "Users can view own wallets"
    ON wallets
    FOR SELECT
    USING (auth.uid()::text = user_id);

-- Only service role can insert/update wallets
CREATE POLICY "Service role can manage wallets"
    ON wallets
    FOR ALL
    USING (auth.role() = 'service_role');

-- Create policies for transactions table
-- Users can view transactions they're involved in
CREATE POLICY "Users can view own transactions"
    ON transactions
    FOR SELECT
    USING (
        auth.uid()::text = sender_id OR 
        auth.uid()::text = receiver_id
    );

-- Only service role can insert/update transactions
CREATE POLICY "Service role can manage transactions"
    ON transactions
    FOR ALL
    USING (auth.role() = 'service_role');

-- Create an enum type for transaction types
CREATE TYPE transaction_type AS ENUM ('transfer', 'deposit', 'withdrawal');

-- Add type constraint to transactions table
ALTER TABLE transactions
    ADD CONSTRAINT valid_transaction_type 
    CHECK (type::transaction_type IS NOT NULL);

-- Add foreign key constraints
ALTER TABLE transactions
    ADD CONSTRAINT fk_sender_wallet
    FOREIGN KEY (sender_id)
    REFERENCES auth.users(id)
    ON DELETE RESTRICT;

ALTER TABLE transactions
    ADD CONSTRAINT fk_receiver_wallet
    FOREIGN KEY (receiver_id)
    REFERENCES auth.users(id)
    ON DELETE RESTRICT;

ALTER TABLE wallets
    ADD CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE RESTRICT;

-- Comments for documentation
COMMENT ON TABLE wallets IS 'Stores user wallet information with balance and currency';
COMMENT ON TABLE transactions IS 'Records all financial transactions between users';
COMMENT ON COLUMN wallets.balance IS 'Current balance in the specified currency';
COMMENT ON COLUMN wallets.currency IS 'Currency code (e.g., USD, EUR)';
COMMENT ON COLUMN transactions.type IS 'Type of transaction: transfer, deposit, or withdrawal'; 