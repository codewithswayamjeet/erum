import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('subscribers').insert({ email: email.trim().toLowerCase() });

      if (error) {
        if (error.code === '23505') {
          toast({ title: 'Already subscribed!', description: 'This email is already in our list.' });
        } else {
          throw error;
        }
      } else {
        toast({ title: 'Welcome to our inner circle!', description: 'You\'ll receive our latest updates.' });
        setEmail('');
      }
    } catch {
      toast({ title: 'Something went wrong', description: 'Please try again later.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-background border-t border-border">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h3 className="font-serif text-2xl md:text-3xl mb-4">Join Our Inner Circle</h3>
          <p className="text-muted-foreground mb-8">Be the first to discover new collections, exclusive events, and timeless inspirations.</p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 px-6 py-4 bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <button type="submit" disabled={loading} className="btn-luxury-primary">
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
