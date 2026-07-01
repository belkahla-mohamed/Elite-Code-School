CREATE TABLE IF NOT EXISTS public.app_settings (
  id BIGINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  auto_accept_inscriptions BOOLEAN NOT NULL DEFAULT false,
  email_validation BOOLEAN NOT NULL DEFAULT true,
  public_portfolios_default BOOLEAN NOT NULL DEFAULT true,
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  session_duration_hours INTEGER NOT NULL DEFAULT 8,
  min_password_length INTEGER NOT NULL DEFAULT 6,
  contact_email TEXT NOT NULL DEFAULT 'contact@elitecode.ma',
  email_from TEXT NOT NULL DEFAULT 'Elite Code School <onboarding@resend.dev>',
  admin_email TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on app_settings"
  ON public.app_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO public.app_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
