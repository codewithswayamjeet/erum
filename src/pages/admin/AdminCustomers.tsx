import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Users, ShoppingCart, DollarSign, RefreshCw, Download, Mail, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Customer {
  email: string;
  name: string;
  phone: string | null;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
}

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    const { data: orders, error } = await supabase
      .from('orders')
      .select('customer_email, customer_name, customer_phone, total, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    // Aggregate customer data
    const customerMap = new Map<string, Customer>();
    
    orders?.forEach(order => {
      const existing = customerMap.get(order.customer_email);
      if (existing) {
        existing.totalOrders += 1;
        existing.totalSpent += Number(order.total);
        if (!existing.lastOrderDate || new Date(order.created_at) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = order.created_at;
        }
      } else {
        customerMap.set(order.customer_email, {
          email: order.customer_email,
          name: order.customer_name,
          phone: order.customer_phone,
          totalOrders: 1,
          totalSpent: Number(order.total),
          lastOrderDate: order.created_at,
        });
      }
    });

    setCustomers(Array.from(customerMap.values()));
    setIsLoading(false);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Total Orders', 'Total Spent', 'Last Order'];
    const rows = customers.map(c => [
      c.name,
      c.email,
      c.phone || 'N/A',
      c.totalOrders,
      c.totalSpent,
      c.lastOrderDate ? format(new Date(c.lastOrderDate), 'yyyy-MM-dd') : 'N/A'
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({ title: 'Export Complete', description: 'Customer data exported to CSV' });
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalCustomers: customers.length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    avgOrderValue: customers.length > 0 
      ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.totalOrders, 0)
      : 0,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Customers</h1>
            <p className="text-muted-foreground mt-1">View and manage your customer base</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchCustomers}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
              <Users className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <DollarSign className="h-5 w-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString('en-US')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Order Value</CardTitle>
              <ShoppingCart className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${Math.round(stats.avgOrderValue).toLocaleString('en-US')}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Customers Table */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No customers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.email}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              {customer.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {customer.email}
                          </div>
                          {customer.phone && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {customer.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{customer.totalOrders} orders</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${customer.totalSpent.toLocaleString('en-US')}
                      </TableCell>
                      <TableCell>
                        {customer.lastOrderDate 
                          ? format(new Date(customer.lastOrderDate), 'MMM dd, yyyy')
                          : 'N/A'
                        }
                      </TableCell>
                      <TableCell>
                        <Badge className={customer.totalOrders >= 3 
                          ? 'bg-amber-500/10 text-amber-600' 
                          : 'bg-blue-500/10 text-blue-600'
                        }>
                          {customer.totalOrders >= 3 ? 'VIP' : 'Regular'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;
