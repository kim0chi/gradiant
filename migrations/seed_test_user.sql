-- Insert a test user for development
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'test@gradiant.edu',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Test User", "role": "teacher"}'
)
ON CONFLICT (email) DO NOTHING;

-- Get the user ID we just created
DO $$
DECLARE
  user_id uuid;
BEGIN
  SELECT id INTO user_id FROM auth.users WHERE email = 'test@gradiant.edu';
  
  -- Insert the user profile
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    created_at,
    updated_at
  ) VALUES (
    user_id,
    'test@gradiant.edu',
    'Test User',
    'teacher',
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;
END $$;
