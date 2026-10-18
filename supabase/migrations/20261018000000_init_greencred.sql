-- ============================================================================
-- GreenCred Database Schema & Security Definition
-- Tagline: Every Green Action Counts
-- ============================================================================

-- Enable pgcrypto for UUID generation if not already active
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    college_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    avatar_url TEXT,
    public_alias TEXT,
    show_on_leaderboard BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for leaderboard and college lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_college ON public.profiles(college_name);

-- ----------------------------------------------------------------------------
-- 2. ACTIVITY CREDIT RULES (Configurable Platform Rules)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activity_credit_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_type TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    default_credits INTEGER NOT NULL CHECK (default_credits > 0),
    co2_savings_kg NUMERIC(6, 2) NOT NULL DEFAULT 0.00 CHECK (co2_savings_kg >= 0),
    icon TEXT NOT NULL DEFAULT 'leaf',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. ACTIVITIES (Submitted Student Eco-actions)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL REFERENCES public.activity_credit_rules(activity_type) ON UPDATE CASCADE,
    description TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    evidence_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    credits_awarded INTEGER NOT NULL DEFAULT 0 CHECK (credits_awarded >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activities_student ON public.activities(student_id);
CREATE INDEX IF NOT EXISTS idx_activities_status ON public.activities(status);
CREATE INDEX IF NOT EXISTS idx_activities_type ON public.activities(activity_type);

-- ----------------------------------------------------------------------------
-- 4. CREDIT TRANSACTIONS (Immutable Ledger)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL, -- Positive for awards/bonuses, negative for redemptions
    transaction_type TEXT NOT NULL CHECK (
        transaction_type IN ('activity_award', 'reward_redemption', 'challenge_bonus', 'admin_adjustment')
    ),
    reference_id UUID, -- References activity_id, redemption_id, etc.
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_user ON public.credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON public.credit_transactions(transaction_type);

-- ----------------------------------------------------------------------------
-- 5. REWARDS CATALOG
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Campus & Lifestyle',
    image_url TEXT NOT NULL,
    credit_cost INTEGER NOT NULL CHECK (credit_cost > 0),
    initial_stock INTEGER NOT NULL CHECK (initial_stock >= 0),
    available_stock INTEGER NOT NULL CHECK (available_stock >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rewards_active ON public.rewards(is_active);

-- ----------------------------------------------------------------------------
-- 6. REDEMPTIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reward_id UUID NOT NULL REFERENCES public.rewards(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    credits_spent INTEGER NOT NULL CHECK (credits_spent > 0),
    redemption_code TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'redeemed' CHECK (status IN ('redeemed', 'collected', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_redemptions_user ON public.redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_code ON public.redemptions(redemption_code);

-- ----------------------------------------------------------------------------
-- 7. CHALLENGES & PARTICIPATION
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    activity_type TEXT REFERENCES public.activity_credit_rules(activity_type) ON UPDATE CASCADE ON DELETE SET NULL,
    target_count INTEGER NOT NULL DEFAULT 5 CHECK (target_count > 0),
    credit_reward INTEGER NOT NULL DEFAULT 50 CHECK (credit_reward > 0),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.challenge_participation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    current_progress INTEGER NOT NULL DEFAULT 0 CHECK (current_progress >= 0),
    completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_challenge_user UNIQUE (challenge_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_challenge_part_user ON public.challenge_participation(user_id);

-- ----------------------------------------------------------------------------
-- 8. CONTACT MESSAGES (From Landing Page)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    organization TEXT,
    enquiry_type TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'responded')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- HELPER FUNCTIONS & STORED PROCEDURES
-- ============================================================================

-- Check if current requesting user is an administrator (SECURITY DEFINER avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = p_user_id AND role = 'admin'
    );
$$;

-- Get user's verified Green Credit balance from immutable ledger
CREATE OR REPLACE FUNCTION public.get_user_credit_balance(p_user_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
AS $$
    SELECT COALESCE(SUM(amount), 0)::INTEGER
    FROM public.credit_transactions
    WHERE user_id = p_user_id;
$$;

-- Atomic Activity Approval with Ledger Insertion and Challenge Progress
CREATE OR REPLACE FUNCTION public.approve_activity(
    p_activity_id UUID,
    p_credits INTEGER,
    p_reviewer_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_activity RECORD;
    v_is_admin BOOLEAN;
    v_tx_id UUID;
    v_part RECORD;
BEGIN
    -- Verify reviewer is administrator
    v_is_admin := public.is_admin(p_reviewer_id);
    IF NOT v_is_admin THEN
        RAISE EXCEPTION 'Unauthorized: Only platform administrators can approve activities.';
    END IF;

    -- Lock the activity row to prevent concurrent race conditions
    SELECT * INTO v_activity
    FROM public.activities
    WHERE id = p_activity_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Activity not found.';
    END IF;

    IF v_activity.status <> 'pending' THEN
        RAISE EXCEPTION 'Activity has already been reviewed (status: %).', v_activity.status;
    END IF;

    IF p_credits <= 0 THEN
        RAISE EXCEPTION 'Awarded credits must be greater than zero.';
    END IF;

    -- Update activity record
    UPDATE public.activities
    SET status = 'approved',
        credits_awarded = p_credits,
        reviewed_by = p_reviewer_id,
        reviewed_at = NOW()
    WHERE id = p_activity_id;

    -- Insert ledger entry exactly once
    INSERT INTO public.credit_transactions (
        user_id,
        amount,
        transaction_type,
        reference_id,
        description
    ) VALUES (
        v_activity.student_id,
        p_credits,
        'activity_award',
        p_activity_id,
        'Credits awarded for verified activity: ' || v_activity.activity_type
    ) RETURNING id INTO v_tx_id;

    -- Update any active challenge participation
    FOR v_part IN
        SELECT cp.id, cp.challenge_id, cp.current_progress, c.target_count, c.credit_reward, c.title
        FROM public.challenge_participation cp
        JOIN public.challenges c ON cp.challenge_id = c.id
        WHERE cp.user_id = v_activity.student_id
          AND c.activity_type = v_activity.activity_type
          AND c.is_active = true
          AND cp.completed = false
          AND CURRENT_DATE BETWEEN c.start_date AND c.end_date
    LOOP
        IF (v_part.current_progress + 1) >= v_part.target_count THEN
            UPDATE public.challenge_participation
            SET current_progress = v_part.target_count,
                completed = true,
                completed_at = NOW()
            WHERE id = v_part.id;

            -- Award challenge completion bonus in ledger
            INSERT INTO public.credit_transactions (
                user_id,
                amount,
                transaction_type,
                reference_id,
                description
            ) VALUES (
                v_activity.student_id,
                v_part.credit_reward,
                'challenge_bonus',
                v_part.challenge_id,
                'Bonus for completing challenge: ' || v_part.title
            );
        ELSE
            UPDATE public.challenge_participation
            SET current_progress = current_progress + 1
            WHERE id = v_part.id;
        END IF;
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'activity_id', p_activity_id,
        'credits_awarded', p_credits,
        'transaction_id', v_tx_id
    );
END;
$$;

-- Atomic Activity Rejection
CREATE OR REPLACE FUNCTION public.reject_activity(
    p_activity_id UUID,
    p_reason TEXT,
    p_reviewer_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_is_admin BOOLEAN;
    v_current_status TEXT;
BEGIN
    v_is_admin := public.is_admin(p_reviewer_id);
    IF NOT v_is_admin THEN
        RAISE EXCEPTION 'Unauthorized: Only platform administrators can reject activities.';
    END IF;

    IF NULLIF(TRIM(p_reason), '') IS NULL THEN
        RAISE EXCEPTION 'A rejection reason is required.';
    END IF;

    SELECT status INTO v_current_status
    FROM public.activities
    WHERE id = p_activity_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Activity not found.';
    END IF;

    IF v_current_status <> 'pending' THEN
        RAISE EXCEPTION 'Activity has already been reviewed (status: %).', v_current_status;
    END IF;

    UPDATE public.activities
    SET status = 'rejected',
        rejection_reason = p_reason,
        reviewed_by = p_reviewer_id,
        reviewed_at = NOW(),
        credits_awarded = 0
    WHERE id = p_activity_id;

    RETURN jsonb_build_object('success', true, 'activity_id', p_activity_id);
END;
$$;

-- Atomic Reward Redemption with Stock and Balance Verification
CREATE OR REPLACE FUNCTION public.redeem_reward(
    p_reward_id UUID,
    p_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_reward RECORD;
    v_balance INTEGER;
    v_code TEXT;
    v_redemption_id UUID;
BEGIN
    -- Check user balance from ledger
    v_balance := public.get_user_credit_balance(p_user_id);

    -- Lock reward row for update to prevent concurrent oversubscription
    SELECT * INTO v_reward
    FROM public.rewards
    WHERE id = p_reward_id AND is_active = true
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Reward not found or is currently inactive.';
    END IF;

    IF v_reward.available_stock <= 0 THEN
        RAISE EXCEPTION 'Reward is out of stock.';
    END IF;

    IF v_balance < v_reward.credit_cost THEN
        RAISE EXCEPTION 'Insufficient Green Credits. You have % credits, but % credits are required.', v_balance, v_reward.credit_cost;
    END IF;

    -- Generate random voucher code (e.g. GC-9F42-88B1)
    v_code := 'GC-' || UPPER(SUBSTRING(MD5(gen_random_uuid()::TEXT) FROM 1 FOR 4)) || '-' || UPPER(SUBSTRING(MD5(gen_random_uuid()::TEXT) FROM 5 FOR 4));

    -- Decrement available stock
    UPDATE public.rewards
    SET available_stock = available_stock - 1,
        updated_at = NOW()
    WHERE id = p_reward_id;

    -- Create redemption voucher
    INSERT INTO public.redemptions (
        reward_id,
        user_id,
        credits_spent,
        redemption_code,
        status
    ) VALUES (
        p_reward_id,
        p_user_id,
        v_reward.credit_cost,
        v_code,
        'redeemed'
    ) RETURNING id INTO v_redemption_id;

    -- Insert negative transaction into credit ledger
    INSERT INTO public.credit_transactions (
        user_id,
        amount,
        transaction_type,
        reference_id,
        description
    ) VALUES (
        p_user_id,
        -v_reward.credit_cost,
        'reward_redemption',
        v_redemption_id,
        'Redeemed: ' || v_reward.title
    );

    RETURN jsonb_build_object(
        'success', true,
        'redemption_id', v_redemption_id,
        'redemption_code', v_code,
        'credits_spent', v_reward.credit_cost,
        'reward_title', v_reward.title
    );
END;
$$;

-- Trigger to create profile when auth.users row is inserted
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        full_name,
        college_name,
        role,
        avatar_url,
        public_alias
    ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Campus Member'),
        COALESCE(NEW.raw_user_meta_data->>'college_name', 'GreenCred Partner Campus'),
        CASE 
            WHEN NEW.raw_user_meta_data->>'role' = 'admin' AND NEW.raw_user_meta_data->>'admin_secret' = 'GREEN_ADMIN_2026' THEN 'admin'
            ELSE 'student'
        END,
        NEW.raw_user_meta_data->>'avatar_url',
        COALESCE(NEW.raw_user_meta_data->>'public_alias', SPLIT_PART(NEW.email, '@', 1))
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_credit_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_participation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 1. Profiles RLS
CREATE POLICY "Public profiles are viewable by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update own profile fields"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

-- 2. Activity Credit Rules RLS
CREATE POLICY "Credit rules are viewable by anyone"
    ON public.activity_credit_rules FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY "Only admins can modify credit rules"
    ON public.activity_credit_rules FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- 3. Activities RLS
CREATE POLICY "Students can view their own activities"
    ON public.activities FOR SELECT
    TO authenticated
    USING (auth.uid() = student_id OR public.is_admin(auth.uid()));

CREATE POLICY "Students can create their own activity submissions"
    ON public.activities FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = student_id AND status = 'pending' AND credits_awarded = 0);

CREATE POLICY "Only admins can update activity status"
    ON public.activities FOR UPDATE
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- 4. Credit Transactions RLS
CREATE POLICY "Users can view their own credit transactions"
    ON public.credit_transactions FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- 5. Rewards RLS
CREATE POLICY "Anyone can view active rewards"
    ON public.rewards FOR SELECT
    TO authenticated, anon
    USING (is_active = true OR public.is_admin(auth.uid()));

CREATE POLICY "Only admins can manage rewards"
    ON public.rewards FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- 6. Redemptions RLS
CREATE POLICY "Users can view their own redemptions"
    ON public.redemptions FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- 7. Challenges RLS
CREATE POLICY "Challenges viewable by authenticated users"
    ON public.challenges FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY "Only admins can manage challenges"
    ON public.challenges FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- 8. Challenge Participation RLS
CREATE POLICY "Users can view their challenge participation"
    ON public.challenge_participation FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can join challenges"
    ON public.challenge_participation FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users and admins can update challenge participation"
    ON public.challenge_participation FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- 9. Contact Messages RLS
CREATE POLICY "Anyone can submit contact messages"
    ON public.contact_messages FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Only admins can view and manage contact messages"
    ON public.contact_messages FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));
