-- Add sub_category and certification columns to products table
ALTER TABLE public.products 
ADD COLUMN sub_category text,
ADD COLUMN certification_type text,
ADD COLUMN certification_number text;

-- Add comments for documentation
COMMENT ON COLUMN public.products.sub_category IS 'Sub-category like Engagement, Wedding, Tennis, etc.';
COMMENT ON COLUMN public.products.certification_type IS 'GIA or IGI certification type';
COMMENT ON COLUMN public.products.certification_number IS 'Certificate number for verification';