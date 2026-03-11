import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface BlogForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  source_url: string;
  is_published: boolean;
  published_at: string;
}

const emptyForm: BlogForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  image_url: '',
  source_url: '',
  is_published: true,
  published_at: new Date().toISOString().slice(0, 10),
};

const makeSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const db = supabase as any;

const AdminBlogs = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogForm>(emptyForm);

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: async () => {
      const { data, error } = await db.from('blogs').select('*').order('published_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title.trim(),
        slug: (form.slug || makeSlug(form.title)).trim(),
        excerpt: form.excerpt.trim() || null,
        content: form.content.trim() || null,
        image_url: form.image_url.trim() || null,
        source_url: form.source_url.trim() || null,
        is_published: form.is_published,
        published_at: new Date(form.published_at).toISOString(),
      };

      if (!payload.title) throw new Error('Title is required');
      if (!payload.slug) throw new Error('Slug is required');

      if (editingId) {
        const { error } = await db.from('blogs').update(payload).eq('id', editingId);
        if (error) throw error;
        return;
      }

      const { error } = await db.from('blogs').insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast({ title: `Blog ${editingId ? 'updated' : 'created'}` });
      setOpen(false);
      setEditingId(null);
      setForm(emptyForm);
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to save blog', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from('blogs').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast({ title: 'Blog deleted' });
    },
    onError: (error: Error) => {
      toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    },
  });

  const importMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('sync-gia-blogs', {
        body: { limit: 20 },
      });

      if (error) throw new Error(error.message);
      if (!data?.success) throw new Error(data?.error || 'Import failed');

      return data;
    },
    onSuccess: (data: { imported?: number }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast({ title: 'GIA blogs imported', description: `${data.imported ?? 0} posts synced` });
    },
    onError: (error: Error) => {
      toast({ title: 'Import failed', description: error.message, variant: 'destructive' });
    },
  });

  const orderedBlogs = useMemo(() => blogs, [blogs]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (blog: any) => {
    setEditingId(blog.id);
    setForm({
      title: blog.title || '',
      slug: blog.slug || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      image_url: blog.image_url || '',
      source_url: blog.source_url || '',
      is_published: !!blog.is_published,
      published_at: new Date(blog.published_at).toISOString().slice(0, 10),
    });
    setOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-serif font-bold">Blog Management</h1>
            <p className="text-sm text-muted-foreground">Create, edit, publish, and sync blog content dynamically.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => importMutation.mutate()} disabled={importMutation.isPending}>
              <RefreshCw className={`h-4 w-4 mr-2 ${importMutation.isPending ? 'animate-spin' : ''}`} />
              Sync GIA Blogs
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Blog
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingId ? 'Edit Blog' : 'Create Blog'}</DialogTitle>
                  <DialogDescription>
                    Manage blog content that appears on your website and blog listing page.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input
                      value={form.title}
                      onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value, slug: prev.slug || makeSlug(e.target.value) }))}
                      placeholder="Blog title"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Slug *</Label>
                      <Input value={form.slug} onChange={(e) => setForm((prev) => ({ ...prev, slug: makeSlug(e.target.value) }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Published Date</Label>
                      <Input type="date" value={form.published_at} onChange={(e) => setForm((prev) => ({ ...prev, published_at: e.target.value }))} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Excerpt</Label>
                    <Textarea value={form.excerpt} onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))} rows={3} />
                  </div>

                  <div className="space-y-2">
                    <Label>Content</Label>
                    <Textarea value={form.content} onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))} rows={8} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Image URL</Label>
                      <Input value={form.image_url} onChange={(e) => setForm((prev) => ({ ...prev, image_url: e.target.value }))} placeholder="https://..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Source URL</Label>
                      <Input value={form.source_url} onChange={(e) => setForm((prev) => ({ ...prev, source_url: e.target.value }))} placeholder="https://..." />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="rounded border-input"
                      checked={form.is_published}
                      onChange={(e) => setForm((prev) => ({ ...prev, is_published: e.target.checked }))}
                    />
                    Publish immediately
                  </label>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
                      {saveMutation.isPending ? 'Saving...' : editingId ? 'Update Blog' : 'Create Blog'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Loading...</TableCell>
                </TableRow>
              ) : orderedBlogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No blog posts yet</TableCell>
                </TableRow>
              ) : (
                orderedBlogs.map((blog: any) => (
                  <TableRow key={blog.id}>
                    <TableCell>
                      <div className="font-medium">{blog.title}</div>
                      <div className="text-xs text-muted-foreground">/{blog.slug}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={blog.is_published ? 'default' : 'secondary'}>
                        {blog.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(blog.published_at), 'dd MMM yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="outline" onClick={() => openEdit(blog)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => deleteMutation.mutate(blog.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBlogs;
