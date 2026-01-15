import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart, DollarSign, Users, TrendingUp, TrendingDown, Eye, ArrowRight, RefreshCw, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
  items: OrderItem[];
}

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  is_featured: boolean;
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
  orders: {
    label: "Orders",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    todayRevenue: 0,
    todayOrders: 0,
    lowStockProducts: 0,
    conversionRate: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [revenueData, setRevenueData] = useState<{ date: string; revenue: number; orders: number }[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([]);
  const [statusData, setStatusData] = useState<{ status: string; count: number }[]>([]);
  const [topProducts, setTopProducts] = useState<{ name: string; sales: number; revenue: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();

    // Real-time subscription for orders
    const channel = supabase
      .channel('dashboard-orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    
    const [productsRes, ordersRes] = await Promise.all([
      supabase.from('products').select('*'),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
    ]);

    const products: Product[] = productsRes.data || [];
    const orders: Order[] = (ordersRes.data || []).map(order => ({
      ...order,
      items: (Array.isArray(order.items) ? order.items : []) as unknown as OrderItem[],
    }));

    // Calculate stats
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const lowStockProducts = products.filter(p => p.stock < 5).length;

    // Today's stats
    const today = new Date();
    const todayOrders = orders.filter(o => {
      const orderDate = new Date(o.created_at);
      return orderDate >= startOfDay(today) && orderDate <= endOfDay(today);
    });
    const todayRevenue = todayOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);

    setStats({
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders,
      todayRevenue,
      todayOrders: todayOrders.length,
      lowStockProducts,
      conversionRate: orders.length > 0 ? Math.round((orders.filter(o => o.status === 'delivered').length / orders.length) * 100) : 0,
    });

    // Recent orders
    setRecentOrders(orders.slice(0, 5));

    // Revenue chart data (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, 6 - i);
      const dayOrders = orders.filter(o => {
        const orderDate = new Date(o.created_at);
        return orderDate >= startOfDay(date) && orderDate <= endOfDay(date);
      });
      return {
        date: format(date, 'MMM dd'),
        revenue: dayOrders.reduce((sum, o) => sum + Number(o.total || 0), 0),
        orders: dayOrders.length,
      };
    });
    setRevenueData(last7Days);

    // Category distribution
    const categoryCount: Record<string, number> = {};
    products.forEach(p => {
      categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
    });
    setCategoryData(Object.entries(categoryCount).map(([name, value]) => ({ name, value })));

    // Order status distribution
    const statusCount: Record<string, number> = {};
    orders.forEach(o => {
      statusCount[o.status] = (statusCount[o.status] || 0) + 1;
    });
    setStatusData(Object.entries(statusCount).map(([status, count]) => ({ status, count })));

    // Top selling products (from order items)
    const productSales: Record<string, { name: string; sales: number; revenue: number }> = {};
    orders.forEach(order => {
      order.items?.forEach(item => {
        if (!productSales[item.name]) {
          productSales[item.name] = { name: item.name, sales: 0, revenue: 0 };
        }
        productSales[item.name].sales += item.quantity;
        productSales[item.name].revenue += item.price * item.quantity;
      });
    });
    setTopProducts(
      Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
    );

    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/10 text-yellow-600',
      confirmed: 'bg-blue-500/10 text-blue-600',
      processing: 'bg-purple-500/10 text-purple-600',
      shipped: 'bg-indigo-500/10 text-indigo-600',
      delivered: 'bg-green-500/10 text-green-600',
      cancelled: 'bg-red-500/10 text-red-600',
    };
    return colors[status] || 'bg-gray-500/10 text-gray-600';
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString('en-US')}`,
      icon: DollarSign,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      change: '+12.5%',
      changeType: 'up' as const,
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      change: `${stats.todayOrders} today`,
      changeType: 'neutral' as const,
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      change: `${stats.lowStockProducts} low stock`,
      changeType: stats.lowStockProducts > 0 ? 'down' as const : 'neutral' as const,
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Users,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      change: 'Needs attention',
      changeType: stats.pendingOrders > 0 ? 'down' as const : 'neutral' as const,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here's your business overview.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live updates
            </div>
            <Button variant="outline" size="sm" onClick={fetchDashboardData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-20 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat) => (
                <Card key={stat.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="flex items-center gap-1 mt-1">
                      {stat.changeType === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                      {stat.changeType === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                      <span className={`text-xs ${
                        stat.changeType === 'up' ? 'text-green-500' : 
                        stat.changeType === 'down' ? 'text-red-500' : 
                        'text-muted-foreground'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Revenue (Last 7 Days)
                  </CardTitle>
                  <CardDescription>Daily revenue and order count</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
                      <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="hsl(var(--primary))" 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Order Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Status Distribution</CardTitle>
                  <CardDescription>Breakdown of orders by status</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <BarChart data={statusData} layout="vertical">
                      <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} />
                      <YAxis type="category" dataKey="status" tickLine={false} axisLine={false} fontSize={12} width={80} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Second Row: Category & Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Categories</CardTitle>
                  <CardDescription>Distribution by category</CardDescription>
                </CardHeader>
                <CardContent>
                  {categoryData.length > 0 ? (
                    <ChartContainer config={chartConfig} className="h-[250px]">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ChartContainer>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                      No products yet
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    {categoryData.map((cat, index) => (
                      <Badge key={cat.name} variant="outline" className="text-xs">
                        <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                        {cat.name}: {cat.value}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Top Selling Products</CardTitle>
                    <CardDescription>Best performers by revenue</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {topProducts.length > 0 ? (
                    <div className="space-y-4">
                      {topProducts.map((product, index) => (
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
                            <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${product.revenue.toLocaleString('en-US')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                      No sales data yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest orders from customers</CardDescription>
                </div>
                <Link to="/admin/orders">
                  <Button variant="outline" size="sm">
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <ShoppingCart className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{order.customer_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(order.created_at), 'MMM dd, yyyy • hh:mm a')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <span className="font-semibold">${order.total.toLocaleString('en-US')}</span>
                          <Link to="/admin/orders">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No orders yet. Orders will appear here when customers make purchases.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link to="/admin/products" className="block">
                <Card className="hover:shadow-lg transition-all hover:border-primary cursor-pointer">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-purple-500/10">
                      <Package className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Manage Products</h3>
                      <p className="text-sm text-muted-foreground">Add, edit, or remove products</p>
                    </div>
                    <ArrowRight className="h-5 w-5 ml-auto text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
              <Link to="/admin/orders" className="block">
                <Card className="hover:shadow-lg transition-all hover:border-primary cursor-pointer">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-blue-500/10">
                      <ShoppingCart className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">View Orders</h3>
                      <p className="text-sm text-muted-foreground">Track and manage orders</p>
                    </div>
                    <ArrowRight className="h-5 w-5 ml-auto text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
              <Link to="/" className="block">
                <Card className="hover:shadow-lg transition-all hover:border-primary cursor-pointer">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-emerald-500/10">
                      <Eye className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">View Store</h3>
                      <p className="text-sm text-muted-foreground">See your live website</p>
                    </div>
                    <ArrowRight className="h-5 w-5 ml-auto text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
