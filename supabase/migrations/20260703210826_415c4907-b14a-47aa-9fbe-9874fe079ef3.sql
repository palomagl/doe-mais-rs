
-- 1. Catalog tables (source of truth for costs / requirements)
CREATE TABLE public.rewards_catalog (
  id text PRIMARY KEY,
  points_cost integer NOT NULL CHECK (points_cost >= 0)
);
GRANT SELECT ON public.rewards_catalog TO authenticated;
GRANT ALL ON public.rewards_catalog TO service_role;
ALTER TABLE public.rewards_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone signed in can read rewards catalog"
  ON public.rewards_catalog FOR SELECT TO authenticated USING (true);

INSERT INTO public.rewards_catalog (id, points_cost) VALUES
  ('1', 200), ('2', 300), ('3', 450), ('4', 250), ('5', 150), ('6', 500);

CREATE TABLE public.badges_catalog (
  id text PRIMARY KEY,
  requirement integer NOT NULL CHECK (requirement > 0)
);
GRANT SELECT ON public.badges_catalog TO authenticated;
GRANT ALL ON public.badges_catalog TO service_role;
ALTER TABLE public.badges_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone signed in can read badges catalog"
  ON public.badges_catalog FOR SELECT TO authenticated USING (true);

INSERT INTO public.badges_catalog (id, requirement) VALUES
  ('first_drop', 1), ('bronze', 3), ('silver', 5),
  ('gold', 10), ('hero', 20), ('legend', 50);

-- 2. Lock down profiles UPDATE to safe columns only
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (name, sex, blood_type, city, cpf, birth_date, card_photo_url)
  ON public.profiles TO authenticated;

-- 3. Remove client INSERT policies on badges + redemptions and revoke privilege
DROP POLICY IF EXISTS "Users can insert own badges" ON public.user_badges;
REVOKE INSERT ON public.user_badges FROM authenticated;

DROP POLICY IF EXISTS "Users can insert own redeemed rewards" ON public.redeemed_rewards;
REVOKE INSERT ON public.redeemed_rewards FROM authenticated;

-- 4. Server-side donation recorder: inserts donation, recomputes points,
--    updates last_donation, unlocks eligible badges.
CREATE OR REPLACE FUNCTION public.record_donation(
  _location text DEFAULT 'Hemocentro RS',
  _date date DEFAULT CURRENT_DATE
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _count integer;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  INSERT INTO public.donations (user_id, date, location)
  VALUES (_uid, _date, COALESCE(NULLIF(_location, ''), 'Hemocentro RS'));

  SELECT COUNT(*) INTO _count FROM public.donations WHERE user_id = _uid;

  UPDATE public.profiles
     SET reward_points = _count * 150,
         last_donation = (SELECT MAX(date) FROM public.donations WHERE user_id = _uid)
   WHERE user_id = _uid;

  INSERT INTO public.user_badges (user_id, badge_id)
  SELECT _uid, bc.id
    FROM public.badges_catalog bc
   WHERE bc.requirement <= _count
     AND NOT EXISTS (
       SELECT 1 FROM public.user_badges ub
        WHERE ub.user_id = _uid AND ub.badge_id = bc.id
     );
END;
$$;

REVOKE ALL ON FUNCTION public.record_donation(text, date) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.record_donation(text, date) TO authenticated;

-- 5. Server-side reward redemption: verifies balance, deducts, records.
CREATE OR REPLACE FUNCTION public.redeem_reward(_reward_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _cost integer;
  _balance integer;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT points_cost INTO _cost FROM public.rewards_catalog WHERE id = _reward_id;
  IF _cost IS NULL THEN
    RAISE EXCEPTION 'Unknown reward';
  END IF;

  SELECT reward_points INTO _balance FROM public.profiles WHERE user_id = _uid FOR UPDATE;
  IF _balance IS NULL OR _balance < _cost THEN
    RAISE EXCEPTION 'Insufficient points';
  END IF;

  UPDATE public.profiles SET reward_points = _balance - _cost WHERE user_id = _uid;
  INSERT INTO public.redeemed_rewards (user_id, reward_id) VALUES (_uid, _reward_id);
END;
$$;

REVOKE ALL ON FUNCTION public.redeem_reward(text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.redeem_reward(text) TO authenticated;
