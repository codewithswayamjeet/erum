import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface PayPalButtonProps {
  amount: number;
  onSuccess: (details: PayPalOrderDetails) => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
}

export interface PayPalOrderDetails {
  orderId: string;
  status: string;
  payer: {
    email: string;
    name: string;
  };
}

const PayPalButton = ({ amount, onSuccess, onError, disabled }: PayPalButtonProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handlePayPalClick = async () => {
    if (disabled || loading) return;
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-paypal-order', {
        body: {
          amount: Number(amount),
          currency: 'USD',
        },
      });

      if (error || !data?.orderId) {
        throw new Error(error?.message || 'Failed to create PayPal order');
      }

      // Store order info in sessionStorage so we can retrieve it on return
      sessionStorage.setItem('paypal_order_id', data.orderId);

      // Find the approve link and redirect user to PayPal
      const approveLink = data.links?.find((link: { rel: string; href: string }) => link.rel === 'approve');
      if (approveLink?.href) {
        window.location.href = approveLink.href;
      } else {
        throw new Error('No PayPal approval URL found');
      }
    } catch (err) {
      console.error('PayPal error:', err);
      setLoading(false);
      onError?.(err as Error);
      toast({
        title: 'Payment Error',
        description: 'Could not initiate PayPal payment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <button
      onClick={handlePayPalClick}
      disabled={disabled || loading}
      className="w-full h-12 bg-[#ffc439] hover:bg-[#f0b72d] rounded flex items-center justify-center gap-2 text-black font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Redirecting to PayPal...
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 fill-[#003087]">
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.768.768 0 0 1 .757-.646h6.31c2.855 0 4.842 1.087 5.393 3.347.189.781.19 1.643-.017 2.559-.698 3.081-3.103 4.788-6.384 4.788H8.986a.768.768 0 0 0-.757.647l-.847 5.259a.641.641 0 0 1-.633.539l-.673.124Z" />
            <path d="m19.938 9.237-.012.064c-.698 3.081-3.103 4.788-6.384 4.788h-2.017a.768.768 0 0 0-.757.647l-1.287 7.966a.543.543 0 0 0 .535.625h3.274a.675.675 0 0 0 .666-.568l.027-.14.529-3.354.034-.185a.675.675 0 0 1 .666-.568h.42c2.714 0 4.84-1.102 5.462-4.288.26-1.331.125-2.443-.561-3.225a2.701 2.701 0 0 0-.773-.577c.036.272.047.556.028.852l.15-.037Z" />
          </svg>
          Pay with PayPal
        </>
      )}
    </button>
  );
};

export default PayPalButton;
