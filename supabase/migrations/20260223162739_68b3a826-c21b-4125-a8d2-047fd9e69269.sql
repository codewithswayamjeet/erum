
-- Create subscribers table for newsletter
CREATE TABLE public.subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  is_subscribed BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe (insert)
CREATE POLICY "Anyone can subscribe"
ON public.subscribers
FOR INSERT
WITH CHECK (true);

-- Admins can view all subscribers
CREATE POLICY "Admins can view subscribers"
ON public.subscribers
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'::app_role
));

-- Admins can update subscribers
CREATE POLICY "Admins can update subscribers"
ON public.subscribers
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'::app_role
));

-- Admins can delete subscribers
CREATE POLICY "Admins can delete subscribers"
ON public.subscribers
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'::app_role
));

-- Trigger for updated_at
CREATE TRIGGER update_subscribers_updated_at
BEFORE UPDATE ON public.subscribers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
