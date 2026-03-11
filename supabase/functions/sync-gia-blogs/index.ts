import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const decodeHtml = (value: string) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();

const stripHtml = (value: string) =>
  decodeHtml(value.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' '));

const getTagContent = (xml: string, tag: string) => {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  return regex.exec(xml)?.[1]?.trim() || '';
};

const getImageFromItem = (xml: string) => {
  const mediaMatch = xml.match(/<media:content[^>]*url=["']([^"']+)["']/i);
  if (mediaMatch?.[1]) return mediaMatch[1];

  const enclosureMatch = xml.match(/<enclosure[^>]*url=["']([^"']+)["']/i);
  if (enclosureMatch?.[1]) return enclosureMatch[1];

  const imgMatch = xml.match(/<img[^>]*src=["']([^"']+)["']/i);
  if (imgMatch?.[1]) return imgMatch[1];

  return null;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing backend configuration');
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: isAdmin, error: roleError } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin',
    });

    if (roleError || !isAdmin) {
      return new Response(JSON.stringify({ success: false, error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { limit = 20 } = await req.json().catch(() => ({ limit: 20 }));

    const feedRes = await fetch('https://4cs.gia.edu/en-us/blog/feed/');
    if (!feedRes.ok) {
      throw new Error(`Failed to fetch GIA feed (${feedRes.status})`);
    }

    const feedXml = await feedRes.text();
    const items = [...feedXml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((m) => m[1]);

    if (items.length === 0) {
      return new Response(JSON.stringify({ success: true, imported: 0, message: 'No items found in feed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const parsed = items
      .slice(0, Math.max(1, Math.min(Number(limit) || 20, 50)))
      .map((itemXml) => {
        const titleRaw = getTagContent(itemXml, 'title');
        const sourceUrl = getTagContent(itemXml, 'link');
        const descriptionRaw = getTagContent(itemXml, 'description');
        const contentRaw = getTagContent(itemXml, 'content:encoded') || descriptionRaw;
        const pubDateRaw = getTagContent(itemXml, 'pubDate');

        const title = stripHtml(titleRaw);
        const excerpt = stripHtml(descriptionRaw).slice(0, 260);
        const content = stripHtml(contentRaw).slice(0, 12000);
        const imageUrl = getImageFromItem(itemXml);
        const publishedAt = pubDateRaw ? new Date(pubDateRaw).toISOString() : new Date().toISOString();

        if (!title || !sourceUrl) return null;

        return {
          title,
          slug: slugify(title),
          excerpt: excerpt || null,
          content: content || null,
          image_url: imageUrl,
          source_url: sourceUrl,
          is_published: true,
          published_at: publishedAt,
        };
      })
      .filter(Boolean);

    if (parsed.length === 0) {
      return new Response(JSON.stringify({ success: true, imported: 0, message: 'No valid posts parsed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { error: upsertError } = await supabase.from('blogs').upsert(parsed, {
      onConflict: 'source_url',
      ignoreDuplicates: false,
    });

    if (upsertError) throw upsertError;

    return new Response(JSON.stringify({ success: true, imported: parsed.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('sync-gia-blogs error:', message);
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
