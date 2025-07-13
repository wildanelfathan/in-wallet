-- Create enum for supported networks
CREATE TYPE crypto_network AS ENUM ('ethereum', 'polygon', 'bsc');

-- Create crypto wallets table
CREATE TABLE crypto_wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES auth.users(id),
    address TEXT NOT NULL,
    private_key TEXT NOT NULL,
    network crypto_network NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_wallet_address UNIQUE (address, network)
);

-- Create crypto transactions table
CREATE TABLE crypto_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES auth.users(id),
    from_address TEXT NOT NULL,
    to_address TEXT NOT NULL,
    amount TEXT NOT NULL,
    token_symbol TEXT NOT NULL,
    network crypto_network NOT NULL,
    transaction_hash TEXT NOT NULL,
    block_number BIGINT,
    gas_used TEXT,
    status TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_transaction_hash UNIQUE (transaction_hash, network)
);

-- Create indexes
CREATE INDEX idx_crypto_wallets_user_id ON crypto_wallets(user_id);
CREATE INDEX idx_crypto_wallets_address ON crypto_wallets(address);
CREATE INDEX idx_crypto_transactions_user_id ON crypto_transactions(user_id);
CREATE INDEX idx_crypto_transactions_from_address ON crypto_transactions(from_address);
CREATE INDEX idx_crypto_transactions_to_address ON crypto_transactions(to_address);
CREATE INDEX idx_crypto_transactions_created_at ON crypto_transactions(created_at);

-- Enable RLS
ALTER TABLE crypto_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own crypto wallets"
    ON crypto_wallets FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Service role can manage crypto wallets"
    ON crypto_wallets FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Users can view own crypto transactions"
    ON crypto_transactions FOR SELECT
    USING (
        auth.uid()::text = user_id OR
        EXISTS (
            SELECT 1 FROM crypto_wallets
            WHERE crypto_wallets.user_id = auth.uid()::text
            AND (
                crypto_wallets.address = crypto_transactions.from_address OR
                crypto_wallets.address = crypto_transactions.to_address
            )
        )
    );

CREATE POLICY "Service role can manage crypto transactions"
    ON crypto_transactions FOR ALL
    USING (auth.role() = 'service_role');

-- Add updated_at trigger
CREATE TRIGGER update_crypto_wallets_updated_at
    BEFORE UPDATE ON crypto_wallets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crypto_transactions_updated_at
    BEFORE UPDATE ON crypto_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE crypto_wallets IS 'Stores user crypto wallet information';
COMMENT ON TABLE crypto_transactions IS 'Records all cryptocurrency transactions';
COMMENT ON COLUMN crypto_wallets.private_key IS 'Encrypted private key - should be handled with care';
COMMENT ON COLUMN crypto_transactions.amount IS 'Amount in base units (wei, satoshi, etc.)'; 