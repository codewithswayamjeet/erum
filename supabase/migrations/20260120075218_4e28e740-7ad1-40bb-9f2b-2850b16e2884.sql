-- Add new product fields for metal type, karat, and size
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS metal_type text,
ADD COLUMN IF NOT EXISTS karat text,
ADD COLUMN IF NOT EXISTS size text;