-- Create a stored procedure to safely fetch profiles without triggering recursive policies
CREATE OR REPLACE FUNCTION public.get_profiles_safe(role_filter text DEFAULT NULL)
RETURNS SETOF profiles
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF role_filter IS NULL THEN
    RETURN QUERY SELECT * FROM profiles ORDER BY created_at DESC;
  ELSE
    RETURN QUERY SELECT * FROM profiles WHERE role = role_filter ORDER BY created_at DESC;
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_profiles_safe TO authenticated;
