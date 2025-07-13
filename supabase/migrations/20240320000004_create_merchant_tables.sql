-- Create payment type enum
CREATE TYPE payment_type AS ENUM ('fiat', 'crypto');

-- Create payment status enum
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'expired', 'failed');

-- Create merchant payments table
CREATE TABLE merchant_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id TEXT NOT NULL REFERENCES auth.users(id),
    amount NUMERIC NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL,
    type payment_type NOT NULL,
    status payment_status NOT NULL DEFAULT 'pending',
    reference TEXT,
    description TEXT,
    expiry TIMESTAMP WITH TIME ZONE,
    qr_data TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create merchant payment transactions table
CREATE TABLE merchant_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID NOT NULL REFERENCES merchant_payments(id),
    customer_id TEXT NOT NULL REFERENCES auth.users(id),
    transaction_id UUID NOT NULL, -- References either fiat or crypto transaction
    type payment_type NOT NULL,
    status payment_status NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_payment_transaction UNIQUE (payment_id, customer_id)
);

-- Create indexes
CREATE INDEX idx_merchant_payments_merchant_id ON merchant_payments(merchant_id);
CREATE INDEX idx_merchant_payments_status ON merchant_payments(status);
CREATE INDEX idx_merchant_payments_created_at ON merchant_payments(created_at);
CREATE INDEX idx_merchant_transactions_payment_id ON merchant_transactions(payment_id);
CREATE INDEX idx_merchant_transactions_customer_id ON merchant_transactions(customer_id);
CREATE INDEX idx_merchant_transactions_created_at ON merchant_transactions(created_at);

-- Enable RLS
ALTER TABLE merchant_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Merchants can view own payments"
    ON merchant_payments FOR SELECT
    USING (auth.uid()::text = merchant_id);

CREATE POLICY "Service role can manage merchant payments"
    ON merchant_payments FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Users can view their transactions"
    ON merchant_transactions FOR SELECT
    USING (
        auth.uid()::text = customer_id OR
        EXISTS (
            SELECT 1 FROM merchant_payments
            WHERE merchant_payments.id = merchant_transactions.payment_id
            AND merchant_payments.merchant_id = auth.uid()::text
        )
    );

CREATE POLICY "Service role can manage merchant transactions"
    ON merchant_transactions FOR ALL
    USING (auth.role() = 'service_role');

-- Add updated_at triggers
CREATE TRIGGER update_merchant_payments_updated_at
    BEFORE UPDATE ON merchant_payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_merchant_transactions_updated_at
    BEFORE UPDATE ON merchant_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE merchant_payments IS 'Stores merchant payment QR codes and their status';
COMMENT ON TABLE merchant_transactions IS 'Records customer payments to merchants';
COMMENT ON COLUMN merchant_payments.qr_data IS 'Encoded payment data for QR code generation';
COMMENT ON COLUMN merchant_transactions.transaction_id IS 'References either fiat_transactions or crypto_transactions'; 