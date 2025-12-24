import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', pincode: '', cardNumber: '', expiry: '', cvv: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Order Placed Successfully', description: 'Thank you for your purchase. You will receive a confirmation email shortly.' });
    clearCart();
    navigate('/');
  };

  if (cartItems.length === 0) {
    return <Layout><section className="pt-32 pb-20 min-h-[70vh] flex items-center justify-center"><p>Your cart is empty.</p></section></Layout>;
  }

  return (
    <Layout>
      <section className="pt-32 pb-20 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-3xl md:text-4xl mb-12 text-center">Secure Checkout</motion.h1>
          <div className="grid lg:grid-cols-2 gap-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h2 className="font-serif text-xl mb-6">Shipping Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="First Name" className="px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none" />
                  <input name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Last Name" className="px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none" />
                  <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="Email" className="px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none" />
                  <input name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone" className="px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none" />
                </div>
                <input name="address" value={formData.address} onChange={handleChange} required placeholder="Address" className="w-full mt-4 px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none" />
                <div className="grid sm:grid-cols-3 gap-4 mt-4">
                  <input name="city" value={formData.city} onChange={handleChange} required placeholder="City" className="px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none" />
                  <input name="state" value={formData.state} onChange={handleChange} required placeholder="State" className="px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none" />
                  <input name="pincode" value={formData.pincode} onChange={handleChange} required placeholder="PIN Code" className="px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none" />
                </div>
              </div>
              <div>
                <h2 className="font-serif text-xl mb-6">Payment Details</h2>
                <input name="cardNumber" value={formData.cardNumber} onChange={handleChange} required placeholder="Card Number" className="w-full px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  <input name="expiry" value={formData.expiry} onChange={handleChange} required placeholder="MM/YY" className="px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none" />
                  <input name="cvv" value={formData.cvv} onChange={handleChange} required placeholder="CVV" className="px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none" />
                </div>
              </div>
              <button type="submit" className="btn-luxury-primary w-full flex items-center justify-center gap-2"><Lock className="w-4 h-4" /> Place Order Securely</button>
              <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2"><Shield className="w-4 h-4" /> Your payment is encrypted and secure</p>
            </form>
            <div>
              <div className="bg-secondary border border-border p-8 sticky top-32">
                <h2 className="font-serif text-xl mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
                      <div className="flex-1"><p className="font-medium">{item.name}</p><p className="text-sm text-muted-foreground">Qty: {item.quantity}</p></div>
                      <p className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-primary">Complimentary</span></div>
                </div>
                <div className="flex justify-between text-lg font-medium"><span>Total</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
