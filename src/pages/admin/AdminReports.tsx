import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileSpreadsheet, FileText, Calendar, TrendingUp, Package, ShoppingCart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, subDays, startOfMonth, endOfMonth, startOfYear, subMonths } from 'date-fns';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, LineChart, Line } from 'recharts';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface ReportData {
  salesByMonth: { month: string; revenue: number; orders: number }[];
  salesByCategory: { category: string; revenue: number; quantity: number }[];
  topProducts: { name: string; quantity: number; revenue: number }[];
  summary: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    totalProducts: number;
  };
}

const chartConfig = {
  revenue: { label: "Revenue", color: "hsl(var(--primary))" },
  orders: { label: "Orders", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const AdminReports = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('last30');
  const { toast } = useToast();

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const getDateRange = () => {
    const now = new Date();
    switch (dateRange) {
      case 'last7':
        return { start: subDays(now, 7), end: now };
      case 'last30':
        return { start: subDays(now, 30), end: now };
      case 'thisMonth':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case 'lastMonth':
        const lastMonth = subMonths(now, 1);
        return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
      case 'thisYear':
        return { start: startOfYear(now), end: now };
      default:
        return { start: subDays(now, 30), end: now };
    }
  };

  const fetchReportData = async () => {
    setIsLoading(true);
    const { start, end } = getDateRange();

    const [ordersRes, productsRes] = await Promise.all([
      supabase
        .from('orders')
        .select('*')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString()),
      supabase.from('products').select('*'),
    ]);

    if (ordersRes.error || productsRes.error) {
      toast({ title: 'Error', description: 'Failed to fetch report data', variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    const orders = ordersRes.data || [];
    const products = productsRes.data || [];

    // Sales by month
    const monthlyData: Record<string, { revenue: number; orders: number }> = {};
    orders.forEach(order => {
      const month = format(new Date(order.created_at), 'MMM yyyy');
      if (!monthlyData[month]) {
        monthlyData[month] = { revenue: 0, orders: 0 };
      }
      monthlyData[month].revenue += Number(order.total);
      monthlyData[month].orders += 1;
    });

    const salesByMonth = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      orders: data.orders,
    }));

    // Sales by category
    const categoryData: Record<string, { revenue: number; quantity: number }> = {};
    orders.forEach(order => {
      const items = (Array.isArray(order.items) ? order.items : []) as unknown as OrderItem[];
      items.forEach(item => {
        const product = products.find(p => p.name === item.name);
        const category = product?.category || 'Unknown';
        if (!categoryData[category]) {
          categoryData[category] = { revenue: 0, quantity: 0 };
        }
        categoryData[category].revenue += item.price * item.quantity;
        categoryData[category].quantity += item.quantity;
      });
    });

    const salesByCategory = Object.entries(categoryData).map(([category, data]) => ({
      category,
      revenue: data.revenue,
      quantity: data.quantity,
    })).sort((a, b) => b.revenue - a.revenue);

    // Top products
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
    orders.forEach(order => {
      const items = (Array.isArray(order.items) ? order.items : []) as unknown as OrderItem[];
      items.forEach(item => {
        if (!productSales[item.name]) {
          productSales[item.name] = { name: item.name, quantity: 0, revenue: 0 };
        }
        productSales[item.name].quantity += item.quantity;
        productSales[item.name].revenue += item.price * item.quantity;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Summary
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
    const totalOrders = orders.length;

    setReportData({
      salesByMonth,
      salesByCategory,
      topProducts,
      summary: {
        totalRevenue,
        totalOrders,
        avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        totalProducts: products.length,
      },
    });

    setIsLoading(false);
  };

  const exportSalesReport = () => {
    if (!reportData) return;

    const headers = ['Product', 'Quantity Sold', 'Revenue'];
    const rows = reportData.topProducts.map(p => [p.name, p.quantity, p.revenue]);
    
    const csvContent = [
      ['Sales Report', format(new Date(), 'yyyy-MM-dd')],
      [],
      ['Summary'],
      ['Total Revenue', reportData.summary.totalRevenue],
      ['Total Orders', reportData.summary.totalOrders],
      ['Avg Order Value', Math.round(reportData.summary.avgOrderValue)],
      [],
      headers,
      ...rows
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({ title: 'Export Complete', description: 'Sales report exported to CSV' });
  };

  const exportInventoryReport = async () => {
    const { data: products } = await supabase
      .from('products')
      .select('name, category, stock, price')
      .order('stock', { ascending: true });

    if (!products) return;

    const headers = ['Product', 'Category', 'Stock', 'Price', 'Stock Value'];
    const rows = products.map(p => [
      p.name,
      p.category,
      p.stock,
      p.price,
      p.stock * p.price
    ]);

    const csvContent = [
      ['Inventory Report', format(new Date(), 'yyyy-MM-dd')],
      [],
      headers,
      ...rows
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({ title: 'Export Complete', description: 'Inventory report exported to CSV' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground mt-1">Analytics and business insights</p>
          </div>
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7">Last 7 days</SelectItem>
                <SelectItem value="last30">Last 30 days</SelectItem>
                <SelectItem value="thisMonth">This month</SelectItem>
                <SelectItem value="lastMonth">Last month</SelectItem>
                <SelectItem value="thisYear">This year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : reportData && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{reportData.summary.totalRevenue.toLocaleString('en-IN')}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                  <ShoppingCart className="h-5 w-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.summary.totalOrders}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg Order Value</CardTitle>
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{Math.round(reportData.summary.avgOrderValue).toLocaleString('en-IN')}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
                  <Package className="h-5 w-5 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.summary.totalProducts}</div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue by Month */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {reportData.salesByMonth.length > 0 ? (
                    <ChartContainer config={chartConfig} className="h-[300px]">
                      <LineChart data={reportData.salesByMonth}>
                        <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                        <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                      </LineChart>
                    </ChartContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      No data available for selected period
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Sales by Category */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                  <CardDescription>Revenue distribution by category</CardDescription>
                </CardHeader>
                <CardContent>
                  {reportData.salesByCategory.length > 0 ? (
                    <ChartContainer config={chartConfig} className="h-[300px]">
                      <BarChart data={reportData.salesByCategory} layout="vertical">
                        <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                        <YAxis type="category" dataKey="category" tickLine={false} axisLine={false} fontSize={12} width={80} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ChartContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      No data available for selected period
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Best performing products by revenue</CardDescription>
              </CardHeader>
              <CardContent>
                {reportData.topProducts.length > 0 ? (
                  <div className="space-y-4">
                    {reportData.topProducts.map((product, index) => (
                      <div key={product.name} className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500/20 text-yellow-600' :
                          index === 1 ? 'bg-gray-400/20 text-gray-600' :
                          index === 2 ? 'bg-amber-600/20 text-amber-700' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.quantity} units sold</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{product.revenue.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No sales data available for selected period
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle>Export Reports</CardTitle>
                <CardDescription>Download reports in CSV format</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto py-4" onClick={exportSalesReport}>
                    <div className="flex flex-col items-center gap-2">
                      <FileSpreadsheet className="h-8 w-8 text-green-600" />
                      <span>Sales Report</span>
                      <span className="text-xs text-muted-foreground">Products, revenue, orders</span>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto py-4" onClick={exportInventoryReport}>
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-8 w-8 text-blue-600" />
                      <span>Inventory Report</span>
                      <span className="text-xs text-muted-foreground">Stock levels, values</span>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto py-4" onClick={() => {
                    toast({ title: 'Coming Soon', description: 'Customer report will be available soon' });
                  }}>
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-8 w-8 text-purple-600" />
                      <span>Customer Report</span>
                      <span className="text-xs text-muted-foreground">Customer insights</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
