import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  original_price: number | null;
  category: string;
  sub_category: string | null;
  material: string | null;
  stone: string | null;
  weight: string | null;
  images: string[];
  is_featured: boolean | null;
  is_bestseller: boolean | null;
  stock: number | null;
  created_at: string;
}

interface UseProductsOptions {
  category?: string;
  subCategory?: string;
  featured?: boolean;
  bestseller?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  material?: string;
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [options.category, options.subCategory, options.featured, options.bestseller, options.search, options.minPrice, options.maxPrice, options.material]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (options.category) {
      query = query.ilike('category', options.category);
    }
    if (options.subCategory) {
      query = query.ilike('sub_category', `%${options.subCategory}%`);
    }
      query = query.eq('is_featured', true);
    }
    if (options.bestseller) {
      query = query.eq('is_bestseller', true);
    }
    if (options.search) {
      query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`);
    }
    if (options.minPrice !== undefined) {
      query = query.gte('price', options.minPrice);
    }
    if (options.maxPrice !== undefined) {
      query = query.lte('price', options.maxPrice);
    }
    if (options.material) {
      query = query.ilike('material', `%${options.material}%`);
    }

    const { data, error } = await query;

    if (error) {
      setError(error.message);
      setProducts([]);
    } else {
      setProducts(data || []);
    }
    setIsLoading(false);
  };

  return { products, isLoading, error, refetch: fetchProducts };
};

export const useProduct = (idOrSlug: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (idOrSlug) {
      fetchProduct();
    }
  }, [idOrSlug]);

  const fetchProduct = async () => {
    setIsLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
      .single();

    if (error) {
      setError(error.message);
      setProduct(null);
    } else {
      setProduct(data);
    }
    setIsLoading(false);
  };

  return { product, isLoading, error, refetch: fetchProduct };
};
