import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronDown, ChevronUp, Calendar, MapPin } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  payment_status: string;
  total: number;
  subtotal: number;
  shipping_cost: number | null;
  items: OrderItem[];
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
}

const OrderHistory = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const typedOrders = data.map(order => ({
        ...order,
        items: (order.items as unknown as OrderItem[]) || []
      }));
      setOrders(typedOrders);
    }
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-amber-100 text-amber-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Layout>
      <div className="pt-32 pb-20 min-h-screen bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Order History</h1>
            <p className="text-muted-foreground mb-12">Track and view your past orders</p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="font-serif text-2xl text-foreground mb-4">No orders yet</h2>
              <p className="text-muted-foreground mb-8">Start shopping to see your orders here</p>
              <Link to="/collections" className="btn-luxury-primary">
                Browse Collections
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-lg overflow-hidden"
                >
                  <div
                    className="p-6 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {formatDate(order.created_at)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <span className="font-serif text-lg text-foreground">
                          ${order.total.toLocaleString('en-US')}
                        </span>
                        {expandedOrder === order.id ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </div>

                  {expandedOrder === order.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-border"
                    >
                      <div className="p-6 space-y-6">
                        <div>
                          <h3 className="font-medium text-foreground mb-4">Items</h3>
                          <div className="space-y-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-4">
                                <div className="h-16 w-16 bg-muted rounded-lg overflow-hidden">
                                  {item.image ? (
                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                      <Package className="h-6 w-6" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-foreground">{item.name}</p>
                                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-medium text-foreground">${(item.price * item.quantity).toLocaleString('en-US')}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Shipping Address
                            </h3>
                            <p className="text-muted-foreground">
                              {order.shipping_address}<br />
                              {order.shipping_city}, {order.shipping_state}<br />
                              {order.shipping_pincode}
                            </p>
                          </div>
                          
                          <div>
                            <h3 className="font-medium text-foreground mb-2">Order Summary</h3>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>${order.subtotal.toLocaleString('en-US')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span>{order.shipping_cost ? `$${order.shipping_cost}` : 'Free'}</span>
                              </div>
                              <div className="flex justify-between font-medium text-foreground pt-2 border-t border-border">
                                <span>Total</span>
                                <span>${order.total.toLocaleString('en-US')}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">Payment Status:</span>
                          <span className={`px-2 py-0.5 rounded capitalize ${order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                            {order.payment_status}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrderHistory;
