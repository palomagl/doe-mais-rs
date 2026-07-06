CREATE OR REPLACE FUNCTION public.record_donation(_location text DEFAULT 'Hemocentro RS'::text, _date date DEFAULT CURRENT_DATE)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _uid uuid := auth.uid();
  _count integer;
  _last_date date;
  _sex text;
  _min_interval integer;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Date bounds
  IF _date > CURRENT_DATE THEN
    RAISE EXCEPTION 'Donation date cannot be in the future';
  END IF;
  IF _date < CURRENT_DATE - INTERVAL '1 year' THEN
    RAISE EXCEPTION 'Donation date is implausibly old';
  END IF;

  -- Interval enforcement based on sex
  SELECT sex, last_donation INTO _sex, _last_date
    FROM public.profiles WHERE user_id = _uid FOR UPDATE;

  _min_interval := CASE WHEN _sex = 'Feminino' THEN 60 ELSE 90 END;

  IF _last_date IS NOT NULL AND (_date - _last_date) < _min_interval THEN
    RAISE EXCEPTION 'Donation interval not elapsed (min % days)', _min_interval;
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
$function$;