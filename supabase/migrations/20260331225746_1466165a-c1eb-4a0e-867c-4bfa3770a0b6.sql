
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  sex TEXT NOT NULL DEFAULT '',
  blood_type TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  last_donation DATE,
  reward_points INTEGER NOT NULL DEFAULT 0,
  is_existing_donor BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Donations table
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  location TEXT NOT NULL DEFAULT 'Hemocentro RS',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own donations" ON public.donations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own donations" ON public.donations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Redeemed rewards table
CREATE TABLE public.redeemed_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reward_id TEXT NOT NULL,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.redeemed_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own redeemed rewards" ON public.redeemed_rewards FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own redeemed rewards" ON public.redeemed_rewards FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
