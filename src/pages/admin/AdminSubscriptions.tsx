import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Mail, Users, Send, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { format } from 'date-fns';

const AdminSubscriptions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sendDialogOpen, setSendDialogOpen] = useState(false);

  const { data: subscribers = [], isLoading } = useQuery({
    queryKey: ['subscribers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_subscribed }: { id: string; is_subscribed: boolean }) => {
      const { error } = await supabase
        .from('subscribers')
        .update({ is_subscribed })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      toast({ title: 'Subscriber updated' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('subscribers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      toast({ title: 'Subscriber removed' });
    },
  });

  const sendNewsletter = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-newsletter`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ subject, body }),
        }
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: (data) => {
      toast({
        title: 'Newsletter Sent!',
        description: `Sent to ${data.sent} subscribers${data.failed ? `, ${data.failed} failed` : ''}`,
      });
      setSubject('');
      setBody('');
      setSendDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to send', description: error.message, variant: 'destructive' });
    },
  });

  const activeCount = subscribers.filter(s => s.is_subscribed).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold">Email Subscriptions</h1>
            <p className="text-muted-foreground text-sm">Manage newsletter subscribers</p>
          </div>
          <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Send className="h-4 w-4" />
                Send Newsletter
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Send Newsletter to {activeCount} Subscribers</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Subject"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                />
                <Textarea
                  placeholder="Email body (HTML supported)"
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  rows={8}
                />
                <Button
                  onClick={() => sendNewsletter.mutate()}
                  disabled={!subject || !body || sendNewsletter.isPending}
                  className="w-full gap-2"
                >
                  <Mail className="h-4 w-4" />
                  {sendNewsletter.isPending ? 'Sending...' : `Send to ${activeCount} Subscribers`}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold flex items-center gap-2"><Users className="h-5 w-5 text-primary" />{subscribers.length}</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Active</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-green-600">{activeCount}</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Unsubscribed</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-muted-foreground">{subscribers.length - activeCount}</p></CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <p className="p-6 text-center text-muted-foreground">Loading...</p>
            ) : subscribers.length === 0 ? (
              <p className="p-6 text-center text-muted-foreground">No subscribers yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Subscribed On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map(sub => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">{sub.email}</TableCell>
                      <TableCell>
                        <Badge variant={sub.is_subscribed ? 'default' : 'secondary'}>
                          {sub.is_subscribed ? 'Active' : 'Unsubscribed'}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(sub.created_at), 'dd MMM yyyy')}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => toggleMutation.mutate({ id: sub.id, is_subscribed: !sub.is_subscribed })}
                          title={sub.is_subscribed ? 'Unsubscribe' : 'Resubscribe'}
                        >
                          {sub.is_subscribed ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteMutation.mutate(sub.id)}
                        >
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

export default AdminSubscriptions;
