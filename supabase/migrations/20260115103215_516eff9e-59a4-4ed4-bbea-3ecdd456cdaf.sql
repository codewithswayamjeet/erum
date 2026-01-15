-- Create submissions table for contact form and bespoke requests
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  design_image_url TEXT,
  submission_type TEXT NOT NULL DEFAULT 'contact',
  status TEXT NOT NULL DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access (admins can view/update all)
CREATE POLICY "Admins can view all submissions" 
ON public.submissions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update submissions" 
ON public.submissions 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete submissions" 
ON public.submissions 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Allow anyone to create submissions (public form)
CREATE POLICY "Anyone can create submissions" 
ON public.submissions 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_submissions_updated_at
BEFORE UPDATE ON public.submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for design uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('designs', 'designs', true);

-- Storage policies for design uploads
CREATE POLICY "Anyone can upload designs" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'designs');

CREATE POLICY "Anyone can view designs" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'designs');