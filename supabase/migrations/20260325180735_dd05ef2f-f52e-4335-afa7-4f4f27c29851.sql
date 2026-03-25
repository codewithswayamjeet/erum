CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site settings" ON public.site_settings FOR SELECT TO public USING (true);
CREATE POLICY "Admins can update site settings" ON public.site_settings FOR UPDATE TO public USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert site settings" ON public.site_settings FOR INSERT TO public WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete site settings" ON public.site_settings FOR DELETE TO public USING (public.has_role(auth.uid(), 'admin'));
