import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PageCategory {
  id: string;
  category: string;
  sub_category: string;
  thumbnail_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const usePageCategories = (category?: string) => {
  const [categories, setCategories] = useState<PageCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [category]);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);

    let query = supabase
      .from('page_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (category) {
      query = query.ilike('category', category);
    }

    const { data, error } = await query;

    if (error) {
      setError(error.message);
      setCategories([]);
    } else {
      setCategories(data || []);
    }
    setIsLoading(false);
  };

  return { categories, isLoading, error, refetch: fetchCategories };
};

export const useAllPageCategories = () => {
  const [categories, setCategories] = useState<PageCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('page_categories')
      .select('*')
      .order('category', { ascending: true })
      .order('display_order', { ascending: true });

    if (error) {
      setError(error.message);
      setCategories([]);
    } else {
      setCategories(data || []);
    }
    setIsLoading(false);
  };

  const addCategory = async (category: string, subCategory: string, thumbnailUrl?: string) => {
    const { data, error } = await supabase
      .from('page_categories')
      .insert({
        category,
        sub_category: subCategory,
        thumbnail_url: thumbnailUrl,
        display_order: categories.filter(c => c.category === category).length + 1,
      })
      .select()
      .single();

    if (!error && data) {
      await fetchCategories();
      return data;
    }
    throw error;
  };

  const updateCategory = async (id: string, updates: Partial<PageCategory>) => {
    const { error } = await supabase
      .from('page_categories')
      .update(updates)
      .eq('id', id);

    if (!error) {
      await fetchCategories();
    }
    return !error;
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase
      .from('page_categories')
      .delete()
      .eq('id', id);

    if (!error) {
      await fetchCategories();
    }
    return !error;
  };

  return { 
    categories, 
    isLoading, 
    error, 
    refetch: fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory
  };
};
