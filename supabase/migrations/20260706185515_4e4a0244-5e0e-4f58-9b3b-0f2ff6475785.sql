REVOKE EXECUTE ON FUNCTION public.record_donation(text, date) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.redeem_reward(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_donation(text, date) TO service_role;
GRANT EXECUTE ON FUNCTION public.redeem_reward(text) TO service_role;