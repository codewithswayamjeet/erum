import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Video, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const AdminVideos = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['admin-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!videoFile || !title) throw new Error('Title and video file required');
      setUploading(true);

      const ext = videoFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, videoFile, { contentType: videoFile.type });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('videos').getPublicUrl(fileName);

      const { error: insertError } = await supabase.from('videos').insert({
        title,
        description,
        video_url: urlData.publicUrl,
        display_order: videos.length,
      });
      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      toast({ title: 'Video uploaded successfully!' });
      setTitle('');
      setDescription('');
      setVideoFile(null);
      setDialogOpen(false);
      setUploading(false);
    },
    onError: (error: Error) => {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
      setUploading(false);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from('videos').update({ is_active }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      toast({ title: 'Video updated' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('videos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      toast({ title: 'Video deleted' });
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold">Video Management</h1>
            <p className="text-muted-foreground text-sm">Upload and manage showcase videos</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" />Upload Video</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Upload New Video</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Video title" value={title} onChange={e => setTitle(e.target.value)} />
                <Textarea placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
                <Input
                  type="file"
                  accept="video/*"
                  onChange={e => setVideoFile(e.target.files?.[0] || null)}
                />
                {videoFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(1)} MB)
                  </p>
                )}
                <Button
                  onClick={() => uploadMutation.mutate()}
                  disabled={!title || !videoFile || uploading}
                  className="w-full gap-2"
                >
                  <Video className="h-4 w-4" />
                  {uploading ? 'Uploading...' : 'Upload Video'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Videos</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold flex items-center gap-2"><Video className="h-5 w-5 text-primary" />{videos.length}</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Active</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-green-600">{videos.filter(v => v.is_active).length}</p></CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <p className="p-6 text-center text-muted-foreground">Loading...</p>
            ) : videos.length === 0 ? (
              <p className="p-6 text-center text-muted-foreground">No videos uploaded yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Preview</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {videos.map(video => (
                    <TableRow key={video.id}>
                      <TableCell>
                        <video src={video.video_url} className="w-24 h-14 object-cover rounded" muted />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>
                          <p>{video.title}</p>
                          {video.description && <p className="text-xs text-muted-foreground">{video.description}</p>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={video.is_active ? 'default' : 'secondary'}>
                          {video.is_active ? 'Active' : 'Hidden'}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(video.created_at), 'dd MMM yyyy')}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => toggleMutation.mutate({ id: video.id, is_active: !video.is_active })}
                          title={video.is_active ? 'Hide' : 'Show'}
                        >
                          {video.is_active ? <Eye className="h-4 w-4 text-green-600" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(video.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminVideos;
