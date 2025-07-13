-- Create process_wallet_topup function for handling wallet top-ups
CREATE OR REPLACE FUNCTION process_wallet_topup(
    user_id TEXT,
    topup_amount NUMERIC,
    payment_method TEXT,
    payment_reference TEXT,
    wallet_currency TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    wallet_id UUID;
    transaction_id UUID;
    new_balance NUMERIC;
BEGIN
    -- Input validation
    IF topup_amount <= 0 THEN
        RAISE EXCEPTION 'Top-up amount must be positive';
    END IF;

    -- Start transaction
    BEGIN
        -- Get or create wallet
        INSERT INTO wallets (id, user_id, balance, currency)
        VALUES (
            uuid_generate_v4(),
            user_id,
            0,
            wallet_currency
        )
        ON CONFLICT (user_id, currency)
        DO UPDATE SET updated_at = NOW()
        RETURNING id INTO wallet_id;

        -- Update wallet balance
        UPDATE wallets
        SET balance = balance + topup_amount,
            updated_at = NOW()
        WHERE id = wallet_id
        RETURNING balance INTO new_balance;

        -- Create transaction record
        INSERT INTO transactions (
            id,
            sender_id,
            receiver_id,
            amount,
            type,
            status,
            created_at,
            updated_at,
            metadata
        )
        VALUES (
            uuid_generate_v4(),
            user_id, -- sender is the same as receiver for top-ups
            user_id,
            topup_amount,
            'topup',
            'completed',
            NOW(),
            NOW(),
            jsonb_build_object(
                'payment_method', payment_method,
                'payment_reference', payment_reference,
                'wallet_currency', wallet_currency
            )
        )
        RETURNING id INTO transaction_id;

        -- Return success response
        RETURN jsonb_build_object(
            'success', true,
            'id', transaction_id,
            'new_balance', new_balance,
            'wallet_id', wallet_id
        );

    EXCEPTION
        WHEN OTHERS THEN
            -- Rollback transaction on any error
            RAISE;
    END;
END;
$$; 