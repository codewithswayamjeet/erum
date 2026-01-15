import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import PayPalButton from '@/components/PayPalButton';


const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    phone: '', 
    address: '', 
    city: '', 
    state: '', 
    pincode: '',
  });
  const [submitting, setSubmitting] = useState(false);
  

  useEffect(() => {
    if (!isLoading && !user && cartItems.length > 0) {
      navigate('/auth?redirect=/checkout');
    }
  }, [user, isLoading, cartItems.length, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const isFormValid = () => {
    return formData.firstName && formData.lastName && formData.email && 
           formData.phone && formData.address && formData.city && 
           formData.state && formData.pincode;
  };

  const createOrder = async (paymentStatus: string, paymentDetails?: { orderId?: string; payer?: { email: string; name: string } }) => {
    if (!user) return null;

    const orderData = {
      user_id: user.id,
      customer_name: `${formData.firstName} ${formData.lastName}`,
      customer_email: formData.email || user.email,
      customer_phone: formData.phone,
      shipping_address: formData.address,
      shipping_city: formData.city,
      shipping_state: formData.state,
      shipping_pincode: formData.pincode,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal: cartTotal,
      total: cartTotal,
      status: 'pending',
      payment_status: paymentStatus,
      notes: paymentDetails?.orderId ? `PayPal Order ID: ${paymentDetails.orderId}` : undefined,
    };

    const { data, error } = await supabase.from('orders').insert([orderData]).select().single();
    return { data, error };
  };

  const handlePayPalSuccess = async (details: { orderId: string; status: string; payer: { email: string; name: string } }) => {
    setSubmitting(true);
    
    const result = await createOrder('paid', details);

    if (result?.error) {
      toast({ title: 'Order Failed', description: 'Payment received but order creation failed. Please contact support.', variant: 'destructive' });
      setSubmitting(false);
      return;
    }

    toast({ 
      title: 'Payment Successful!', 
      description: `Thank you for your purchase! Your PayPal order ID: ${details.orderId}` 
    });
    clearCart();
    navigate('/order-history');
    setSubmitting(false);
  };


  if (cartItems.length === 0) {
    return (
      <Layout>
        <section className="pt-32 pb-20 min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl mb-4">Your cart is empty.</p>
            <Link to="/collections" className="btn-luxury-primary">Continue Shopping</Link>
          </div>
        </section>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <section className="pt-32 pb-20 min-h-[70vh] flex items-center justify-center flex-col gap-4">
          <p>Please sign in to checkout</p>
          <Link to="/auth?redirect=/checkout" className="btn-luxury-primary">Sign In</Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-32 pb-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="font-serif text-3xl md:text-4xl mb-8 md:mb-12 text-center"
          >
            Secure Checkout
          </motion.h1>
          
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Form */}
            <div className="space-y-8">
              {/* Shipping Information */}
              <div className="bg-card border border-border p-6 md:p-8">
                <h2 className="font-serif text-xl mb-6">Shipping Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    required 
                    placeholder="First Name *" 
                    className="px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none rounded-sm" 
                  />
                  <input 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange} 
                    required 
                    placeholder="Last Name *" 
                    className="px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none rounded-sm" 
                  />
                  <input 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    placeholder="Email *" 
                    className="px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none rounded-sm" 
                  />
                  <input 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    required 
                    placeholder="Phone *" 
                    className="px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none rounded-sm" 
                  />
                </div>
                <input 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  required 
                  placeholder="Full Address *" 
                  className="w-full mt-4 px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none rounded-sm" 
                />
                <div className="grid sm:grid-cols-3 gap-4 mt-4">
                  <input 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange} 
                    required 
                    placeholder="City *" 
                    className="px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none rounded-sm" 
                  />
                  <input 
                    name="state" 
                    value={formData.state} 
                    onChange={handleChange} 
                    required 
                    placeholder="State *" 
                    className="px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none rounded-sm" 
                  />
                  <input 
                    name="pincode" 
                    value={formData.pincode} 
                    onChange={handleChange} 
                    required 
                    placeholder="PIN Code *" 
                    className="px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none rounded-sm" 
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card border border-border p-6 md:p-8">
                <h2 className="font-serif text-xl mb-6">Payment Method</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 border border-primary bg-primary/5 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 fill-[#0070ba]">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.768.768 0 0 1 .757-.646h6.31c2.855 0 4.842 1.087 5.393 3.347.189.781.19 1.643-.017 2.559-.698 3.081-3.103 4.788-6.384 4.788H8.986a.768.768 0 0 0-.757.647l-.847 5.259a.641.641 0 0 1-.633.539l-.673.124Z" />
                      <path d="m19.938 9.237-.012.064c-.698 3.081-3.103 4.788-6.384 4.788h-2.017a.768.768 0 0 0-.757.647l-1.287 7.966a.543.543 0 0 0 .535.625h3.274a.675.675 0 0 0 .666-.568l.027-.14.529-3.354.034-.185a.675.675 0 0 1 .666-.568h.42c2.714 0 4.84-1.102 5.462-4.288.26-1.331.125-2.443-.561-3.225a2.701 2.701 0 0 0-.773-.577c.036.272.047.556.028.852l.15-.037Z" />
                    </svg>
                    <div>
                      <p className="font-medium">PayPal</p>
                      <p className="text-sm text-muted-foreground">Pay securely with PayPal or credit/debit card</p>
                    </div>
                  </div>
                  <PayPalButton
                    amount={cartTotal}
                    onSuccess={handlePayPalSuccess}
                    disabled={!isFormValid() || submitting}
                  />
                </div>
              </div>

              <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" /> Your payment is encrypted and secure
              </p>
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <div className="bg-secondary border border-border p-6 md:p-8 sticky top-32">
                <h2 className="font-serif text-xl mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6 pb-6 border-b border-border max-h-[300px] overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium whitespace-nowrap">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-primary">Complimentary</span>
                  </div>
                </div>
                <div className="flex justify-between text-lg font-medium">
                  <span>Total</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
