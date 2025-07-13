-- Create bill category enum
CREATE TYPE bill_category AS ENUM (
    'utility',
    'mobile',
    'internet',
    'streaming',
    'insurance',
    'credit_card',
    'loan',
    'other'
);

-- Create bill status enum
CREATE TYPE bill_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed'
);

-- Create bill providers table
CREATE TABLE bill_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category bill_category NOT NULL,
    country TEXT NOT NULL,
    logo_url TEXT,
    fields JSONB NOT NULL, -- Array of required fields
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_provider_name_country UNIQUE (name, country)
);

-- Create bill payments table
CREATE TABLE bill_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES auth.users(id),
    provider_id UUID NOT NULL REFERENCES bill_providers(id),
    wallet_id UUID NOT NULL REFERENCES wallets(id),
    amount NUMERIC NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL,
    account_number TEXT NOT NULL,
    customer_fields JSONB NOT NULL,
    status bill_status NOT NULL DEFAULT 'pending',
    provider_reference TEXT,
    receipt_url TEXT,
    error_message TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_bill_providers_category ON bill_providers(category);
CREATE INDEX idx_bill_providers_country ON bill_providers(country);
CREATE INDEX idx_bill_payments_user_id ON bill_payments(user_id);
CREATE INDEX idx_bill_payments_provider_id ON bill_payments(provider_id);
CREATE INDEX idx_bill_payments_status ON bill_payments(status);
CREATE INDEX idx_bill_payments_created_at ON bill_payments(created_at);

-- Enable RLS
ALTER TABLE bill_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active bill providers"
    ON bill_providers FOR SELECT
    USING (is_active = true);

CREATE POLICY "Service role can manage bill providers"
    ON bill_providers FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Users can view own bill payments"
    ON bill_payments FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Service role can manage bill payments"
    ON bill_payments FOR ALL
    USING (auth.role() = 'service_role');

-- Add updated_at triggers
CREATE TRIGGER update_bill_providers_updated_at
    BEFORE UPDATE ON bill_providers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bill_payments_updated_at
    BEFORE UPDATE ON bill_payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE bill_providers IS 'Available bill payment providers';
COMMENT ON TABLE bill_payments IS 'User bill payment transactions';
COMMENT ON COLUMN bill_providers.fields IS 'JSON array of required fields for bill payment';
COMMENT ON COLUMN bill_payments.customer_fields IS 'Customer-provided values for required fields';

-- Insert some sample providers
INSERT INTO bill_providers (name, category, country, fields, is_active) VALUES
(
    'PLN Electricity',
    'utility',
    'ID',
    '[
        {"key": "meter_number", "label": "Meter Number", "type": "text", "required": true},
        {"key": "customer_name", "label": "Customer Name", "type": "text", "required": true}
    ]'::jsonb,
    true
),
(
    'Telkomsel',
    'mobile',
    'ID',
    '[
        {"key": "phone_number", "label": "Phone Number", "type": "text", "required": true, "validation": "^\\\\+?[0-9]{10,13}$"}
    ]'::jsonb,
    true
),
(
    'First Media',
    'internet',
    'ID',
    '[
        {"key": "customer_id", "label": "Customer ID", "type": "text", "required": true},
        {"key": "bill_number", "label": "Bill Number", "type": "text", "required": true}
    ]'::jsonb,
    true
); 