-- 1. Add new columns to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS cpf TEXT,
  ADD COLUMN IF NOT EXISTS birth_date DATE,
  ADD COLUMN IF NOT EXISTS card_photo_url TEXT;

-- 2. Create user_badges table
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  badge_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own badges"
  ON public.user_badges FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges"
  ON public.user_badges FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 3. Create private storage bucket for donor card photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('donor-cards', 'donor-cards', false)
ON CONFLICT (id) DO NOTHING;

-- 4. Storage policies: each user can only access their own folder
CREATE POLICY "Users can view own donor card"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'donor-cards' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload own donor card"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'donor-cards' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own donor card"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'donor-cards' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own donor card"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'donor-cards' AND auth.uid()::text = (storage.foldername(name))[1]);