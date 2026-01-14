-- Drop existing admin-only policies on products
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;

-- Create open policies for products (since admin is public)
CREATE POLICY "Anyone can insert products"
ON public.products FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update products"
ON public.products FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete products"
ON public.products FOR DELETE
USING (true);

-- Drop existing admin-only policies on orders
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

-- Create open policies for orders
CREATE POLICY "Anyone can view orders"
ON public.orders FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert orders"
ON public.orders FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update orders"
ON public.orders FOR UPDATE
USING (true);