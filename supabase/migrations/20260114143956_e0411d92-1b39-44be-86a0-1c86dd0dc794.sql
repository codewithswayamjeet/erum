-- Drop existing restrictive policies on product-images bucket
DROP POLICY IF EXISTS "Allow authenticated users to upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to view product images" ON storage.objects;

-- Create permissive policies for product-images bucket
CREATE POLICY "Allow anyone to upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow anyone to update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images');

CREATE POLICY "Allow anyone to delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');

CREATE POLICY "Allow public to view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');