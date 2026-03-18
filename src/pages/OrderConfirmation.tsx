import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { CheckCircle2, Calendar, MapPin, ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { resolveImageUrl } from '@/lib/imageUtils';

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
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  customer_name: string;
  customer_email: string;
  items: OrderItem[];
}

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user || !orderId) return;

      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setOrder({
          ...data,
          items: (data.items as unknown as OrderItem[]) || [],
        });
      }

      setIsLoading(false);
    };

    fetchOrder();
  }, [orderId, user]);

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="h-12 w-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/auth?redirect=/orders" replace />;
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="h-12 w-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <section className="pt-32 pb-20 min-h-screen bg-background">
          <div className="container mx-auto px-6 lg:px-12 max-w-3xl text-center space-y-6">
            <h1 className="font-serif text-4xl text-foreground">Order not found</h1>
            <p className="text-muted-foreground">We couldn't load your confirmation details, but your account order history is still available.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/orders" className="btn-luxury-primary">View Orders</Link>
              <Link to="/collections" className="btn-luxury-secondary">Continue Shopping</Link>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-28 pb-20 bg-background min-h-screen">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl space-y-10">
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <p className="text-xs tracking-luxury uppercase text-muted-foreground">Payment completed</p>
              <h1 className="font-serif text-4xl md:text-5xl text-foreground">Order Confirmed</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Thank you, {order.customer_name}. Your order has been received and a confirmation email is being prepared.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Order number</p>
                  <p className="text-xl font-semibold text-foreground">#{order.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  {new Date(order.created_at).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="font-serif text-2xl text-foreground">Items</h2>
                {order.items.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex gap-4 rounded-xl border border-border p-4">
                    <div className="h-20 w-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                      <img src={resolveImageUrl(item.image)} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-foreground whitespace-nowrap">
                      ${(item.price * item.quantity).toLocaleString('en-US')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h2 className="font-serif text-2xl text-foreground">Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${order.subtotal.toLocaleString('en-US')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">{order.shipping_cost ? `$${order.shipping_cost}` : 'Free'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Payment status</span>
                    <span className="capitalize text-primary font-medium">{order.payment_status}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-3 text-base font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">${order.total.toLocaleString('en-US')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h2 className="font-serif text-2xl">Shipping</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {order.customer_name}
                  <br />
                  {order.shipping_address}
                  <br />
                  {order.shipping_city}, {order.shipping_state} {order.shipping_pincode}
                  <br />
                  {order.customer_email}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link to="/orders" className="btn-luxury-primary text-center inline-flex items-center justify-center gap-2">
                  View Order History
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/collections" className="btn-luxury-secondary text-center">Continue Shopping</Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default OrderConfirmation;
