import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  source_url: string | null;
  is_published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

const db = supabase as any;

export const usePublishedBlogs = (limit?: number) => {
  return useQuery<BlogPost[]>({
    queryKey: ['blogs', 'published', limit],
    queryFn: async () => {
      let query = db
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (limit) query = query.limit(limit);

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as BlogPost[];
    },
  });
};

export const useBlogBySlug = (slug?: string) => {
  return useQuery<BlogPost | null>({
    queryKey: ['blogs', 'slug', slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await db
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (error) throw error;
      return (data || null) as BlogPost | null;
    },
  });
};
