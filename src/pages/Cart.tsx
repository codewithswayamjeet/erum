import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, X, Shield, Truck } from 'lucide-react';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <Layout>
        <section className="pt-32 pb-20 min-h-[70vh] flex items-center">
          <div className="container mx-auto px-6 lg:px-12 text-center">
            <h1 className="font-serif text-3xl md:text-4xl mb-6">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">Discover our exquisite collections and find your perfect piece.</p>
            <Link to="/collections" className="btn-luxury-primary">Explore Collections</Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-32 pb-20 bg-background min-h-screen">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-3xl md:text-4xl mb-12 text-center">
            Shopping Cart
          </motion.h1>
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item, index) => (
                <motion.div key={`${item.id}-${item.size || index}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6 p-6 bg-secondary border border-border">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-serif text-lg">{item.name}</h3>
                        {item.size && <p className="text-sm text-primary font-medium">Size: {item.size}</p>}
                      </div>
                      <button onClick={() => removeFromCart(item.id, item.size)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">${item.price.toLocaleString('en-US')}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2"><Minus className="w-4 h-4" /></button>
                        <span className="w-10 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2"><Plus className="w-4 h-4" /></button>
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toLocaleString('en-US')}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-secondary border border-border p-8 sticky top-32">
                <h2 className="font-serif text-xl mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${cartTotal.toLocaleString('en-US')}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-primary">Complimentary</span></div>
                </div>
                <div className="flex justify-between text-lg font-medium mb-8"><span>Total</span><span>${cartTotal.toLocaleString('en-US')}</span></div>
                <Link to="/checkout" className="btn-luxury-primary w-full text-center block mb-6">Proceed to Checkout</Link>
                <div className="flex items-center justify-center gap-6 text-muted-foreground text-sm">
                  <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Secure</span>
                  <span className="flex items-center gap-2"><Truck className="w-4 h-4" /> Insured</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Cart;
