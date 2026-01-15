import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, Mail, Phone, Calendar, MessageSquare, Image, Filter, Download, RefreshCw, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  design_image_url: string | null;
  submission_type: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_OPTIONS = ['new', 'in_progress', 'responded', 'completed', 'archived'];

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();

    // Real-time subscription
    const channel = supabase
      .channel('submissions-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'submissions' },
        () => fetchSubmissions()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching submissions:', error);
      toast({ title: 'Error', description: 'Failed to load submissions', variant: 'destructive' });
    } else {
      setSubmissions(data || []);
    }
    setIsLoading(false);
  };

  const updateSubmissionStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('submissions')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    } else {
      toast({ title: 'Status Updated', description: `Submission marked as ${status}` });
    }
  };

  const updateSubmissionNotes = async (id: string, newNotes: string) => {
    const { error } = await supabase
      .from('submissions')
      .update({ notes: newNotes })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to save notes', variant: 'destructive' });
    } else {
      toast({ title: 'Notes Saved', description: 'Your notes have been saved' });
      setSelectedSubmission(prev => prev ? { ...prev, notes: newNotes } : null);
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    
    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to delete submission', variant: 'destructive' });
    } else {
      toast({ title: 'Deleted', description: 'Submission deleted successfully' });
      setIsDetailsOpen(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-500/10 text-blue-600',
      in_progress: 'bg-yellow-500/10 text-yellow-600',
      responded: 'bg-purple-500/10 text-purple-600',
      completed: 'bg-green-500/10 text-green-600',
      archived: 'bg-gray-500/10 text-gray-600',
    };
    return colors[status] || 'bg-gray-500/10 text-gray-600';
  };

  const getTypeColor = (type: string) => {
    return type === 'bespoke' 
      ? 'bg-primary/10 text-primary' 
      : 'bg-muted text-muted-foreground';
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.message?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || sub.submission_type === typeFilter;
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const exportToCSV = () => {
    const headers = ['Date', 'Name', 'Email', 'Phone', 'Type', 'Status', 'Message'];
    const csvData = filteredSubmissions.map(sub => [
      format(new Date(sub.created_at), 'yyyy-MM-dd HH:mm'),
      sub.name,
      sub.email,
      sub.phone || '',
      sub.submission_type,
      sub.status,
      sub.message?.replace(/"/g, '""') || '',
    ]);

    const csv = [headers.join(','), ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const stats = {
    total: submissions.length,
    new: submissions.filter(s => s.status === 'new').length,
    bespoke: submissions.filter(s => s.submission_type === 'bespoke').length,
    contact: submissions.filter(s => s.submission_type === 'contact').length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Submissions</h1>
            <p className="text-muted-foreground mt-1">Manage contact and bespoke requests</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchSubmissions}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total Submissions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
              <p className="text-sm text-muted-foreground">New (Unread)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{stats.bespoke}</div>
              <p className="text-sm text-muted-foreground">Bespoke Requests</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.contact}</div>
              <p className="text-sm text-muted-foreground">Contact Messages</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="contact">Contact</SelectItem>
                    <SelectItem value="bespoke">Bespoke</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {STATUS_OPTIONS.map(status => (
                      <SelectItem key={status} value={status}>
                        {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submissions Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading submissions...</div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No submissions found</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="hidden md:table-cell">Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Message Preview</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="whitespace-nowrap">
                          <div className="text-sm">
                            {format(new Date(submission.created_at), 'MMM dd')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(submission.created_at), 'HH:mm')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{submission.name}</div>
                          <div className="text-sm text-muted-foreground">{submission.email}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline" className={getTypeColor(submission.submission_type)}>
                            {submission.submission_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={submission.status}
                            onValueChange={(value) => updateSubmissionStatus(submission.id, value)}
                          >
                            <SelectTrigger className="w-[120px] h-8">
                              <Badge variant="outline" className={getStatusColor(submission.status)}>
                                {submission.status.replace('_', ' ')}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_OPTIONS.map(status => (
                                <SelectItem key={status} value={status}>
                                  {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell max-w-[200px]">
                          <p className="text-sm text-muted-foreground truncate">
                            {submission.message || 'No message'}
                          </p>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setNotes(submission.notes || '');
                              setIsDetailsOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedSubmission && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <DialogTitle className="text-xl">{selectedSubmission.name}</DialogTitle>
                      <DialogDescription>
                        {format(new Date(selectedSubmission.created_at), 'MMMM dd, yyyy at HH:mm')}
                      </DialogDescription>
                    </div>
                    <Badge className={getTypeColor(selectedSubmission.submission_type)}>
                      {selectedSubmission.submission_type}
                    </Badge>
                  </div>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <a href={`mailto:${selectedSubmission.email}`} className="text-sm hover:text-primary">
                          {selectedSubmission.email}
                        </a>
                      </div>
                    </div>
                    {selectedSubmission.phone && (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Phone className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <a href={`tel:${selectedSubmission.phone}`} className="text-sm hover:text-primary">
                            {selectedSubmission.phone}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Message</span>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="whitespace-pre-wrap text-sm">
                        {selectedSubmission.message || 'No message provided'}
                      </p>
                    </div>
                  </div>

                  {/* Design Image */}
                  {selectedSubmission.design_image_url && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Image className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Design Image</span>
                      </div>
                      <div className="border rounded-lg overflow-hidden">
                        <img
                          src={selectedSubmission.design_image_url}
                          alt="Design"
                          className="w-full max-h-[300px] object-contain bg-muted/50"
                        />
                      </div>
                      <a
                        href={selectedSubmission.design_image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline mt-2 inline-block"
                      >
                        Open full image →
                      </a>
                    </div>
                  )}

                  {/* Admin Notes */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Admin Notes</label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes about this submission..."
                      rows={3}
                    />
                    <Button
                      size="sm"
                      className="mt-2"
                      onClick={() => updateSubmissionNotes(selectedSubmission.id, notes)}
                    >
                      Save Notes
                    </Button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteSubmission(selectedSubmission.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                    <div className="flex gap-2">
                      <a href={`mailto:${selectedSubmission.email}`}>
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4 mr-2" />
                          Reply via Email
                        </Button>
                      </a>
                      {selectedSubmission.phone && (
                        <a href={`tel:${selectedSubmission.phone}`}>
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4 mr-2" />
                            Call
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminSubmissions;
