-- Create transfer_fiat function for atomic fiat transfers between users
CREATE OR REPLACE FUNCTION transfer_fiat(
    sender_id TEXT,
    receiver_id TEXT,
    transfer_amount NUMERIC
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Run with elevated privileges
AS $$
DECLARE
    sender_balance NUMERIC;
    transfer_id UUID;
BEGIN
    -- Input validation
    IF transfer_amount <= 0 THEN
        RAISE EXCEPTION 'Transfer amount must be positive';
    END IF;

    IF sender_id = receiver_id THEN
        RAISE EXCEPTION 'Cannot transfer to self';
    END IF;

    -- Start transaction
    BEGIN
        -- Lock sender's wallet row for update
        SELECT balance INTO sender_balance
        FROM wallets
        WHERE user_id = sender_id AND type = 'fiat'
        FOR UPDATE;

        -- Check if sender wallet exists
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Sender wallet not found';
        END IF;

        -- Check sufficient balance
        IF sender_balance < transfer_amount THEN
            RAISE EXCEPTION 'Insufficient balance';
        END IF;

        -- Check if receiver wallet exists
        IF NOT EXISTS (
            SELECT 1 FROM wallets 
            WHERE user_id = receiver_id AND type = 'fiat'
        ) THEN
            RAISE EXCEPTION 'Receiver wallet not found';
        END IF;

        -- Update sender balance
        UPDATE wallets
        SET balance = balance - transfer_amount,
            updated_at = NOW()
        WHERE user_id = sender_id AND type = 'fiat';

        -- Update receiver balance
        UPDATE wallets
        SET balance = balance + transfer_amount,
            updated_at = NOW()
        WHERE user_id = receiver_id AND type = 'fiat';

        -- Create transaction record
        INSERT INTO transactions (
            id,
            sender_id,
            receiver_id,
            amount,
            type,
            status,
            created_at,
            updated_at
        )
        VALUES (
            gen_random_uuid(),
            sender_id,
            receiver_id,
            transfer_amount,
            'transfer',
            'completed',
            NOW(),
            NOW()
        )
        RETURNING id INTO transfer_id;

        -- Return success response
        RETURN jsonb_build_object(
            'success', true,
            'transfer_id', transfer_id,
            'amount', transfer_amount,
            'sender_id', sender_id,
            'receiver_id', receiver_id
        );

    EXCEPTION
        WHEN OTHERS THEN
            -- Rollback transaction on any error
            RAISE;
    END;
END;
$$; 