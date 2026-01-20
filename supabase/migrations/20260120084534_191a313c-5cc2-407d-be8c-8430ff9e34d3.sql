-- Create page_categories table for dynamic page control
CREATE TABLE public.page_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  sub_category TEXT NOT NULL,
  thumbnail_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(category, sub_category)
);

-- Enable RLS
ALTER TABLE public.page_categories ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view page categories (public data)
CREATE POLICY "Anyone can view page categories"
  ON public.page_categories FOR SELECT
  USING (true);

-- Only admins can manage page categories
CREATE POLICY "Admins can insert page categories"
  ON public.page_categories FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  ));

CREATE POLICY "Admins can update page categories"
  ON public.page_categories FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  ));

CREATE POLICY "Admins can delete page categories"
  ON public.page_categories FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  ));

-- Add trigger for updated_at
CREATE TRIGGER update_page_categories_updated_at
  BEFORE UPDATE ON public.page_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories
INSERT INTO public.page_categories (category, sub_category, display_order) VALUES
  ('Rings', 'Engagement Rings', 1),
  ('Rings', 'Wedding Bands', 2),
  ('Rings', 'Eternity Rings', 3),
  ('Earrings & Studs', 'Diamond Studs', 1),
  ('Earrings & Studs', 'Drop Earrings', 2),
  ('Bracelets & Bangles', 'Tennis Bracelets', 1),
  ('Bracelets & Bangles', 'Bangles', 2),
  ('Necklaces', 'Pendants', 1),
  ('Necklaces', 'Chains', 2),
  ('Necklaces', 'Chokers', 3),
  ('Necklaces', 'Layered', 4),
  ('Necklaces', 'Statement', 5),
  ('Pendants', 'Solitaire', 1),
  ('Pendants', 'Halo', 2),
  ('Pendants', 'Cluster', 3),
  ('Pendants', 'Heart', 4),
  ('Pendants', 'Cross', 5),
  ('Hip Hop', 'Cuban Links', 1),
  ('Hip Hop', 'Pendants', 2),
  ('Hip Hop', 'Chains', 3),
  ('Hip Hop', 'Rings', 4),
  ('Platinum', 'Rings', 1),
  ('Platinum', 'Necklaces', 2),
  ('Platinum', 'Earrings', 3),
  ('Platinum', 'Bracelets', 4);