import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayButtonProps {
  amount: number;
  currency?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess: (details: { orderId: string; paymentId: string }) => void;
  disabled?: boolean;
}

const RazorpayButton = ({
  amount,
  currency = 'USD',
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  disabled = false,
}: RazorpayButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load Razorpay script
    if (!document.getElementById('razorpay-script')) {
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, []);

  const handlePayment = async () => {
    if (!scriptLoaded || !window.Razorpay) {
      toast({
        title: 'Payment Error',
        description: 'Payment gateway is loading. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Create order via edge function
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount, currency },
      });

      if (error || !data?.orderId) {
        throw new Error(error?.message || 'Failed to create order');
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Erum Jewellery',
        description: 'Purchase from Erum Jewellery',
        order_id: data.orderId,
        handler: async function (response: any) {
          // Verify payment
          const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
            'verify-razorpay-payment',
            {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            }
          );

          if (verifyError || !verifyData?.verified) {
            toast({
              title: 'Payment Verification Failed',
              description: 'Please contact support if amount was deducted.',
              variant: 'destructive',
            });
            setLoading(false);
            return;
          }

          onSuccess({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
          });
          setLoading(false);
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme: {
          color: '#D4AF37',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response: any) {
        toast({
          title: 'Payment Failed',
          description: response.error?.description || 'Payment was not completed',
          variant: 'destructive',
        });
        setLoading(false);
      });

      razorpay.open();
    } catch (error: any) {
      console.error('Razorpay error:', error);
      toast({
        title: 'Payment Error',
        description: error.message || 'Failed to initiate payment',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || loading || !scriptLoaded}
      className="w-full bg-[#528FF0] hover:bg-[#3d7bdc] text-white py-6 text-lg"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" className="w-6 h-6 mr-2" fill="currentColor">
            <path d="M22.436 0H1.564C.7 0 0 .7 0 1.564v20.872C0 23.3.7 24 1.564 24h20.872c.864 0 1.564-.7 1.564-1.564V1.564C24 .7 23.3 0 22.436 0zM7.2 20.4H3.6V9.6h3.6v10.8zM5.4 8.1c-1.152 0-2.088-.936-2.088-2.088S4.248 3.924 5.4 3.924s2.088.936 2.088 2.088S6.552 8.1 5.4 8.1zm15 12.3h-3.6v-5.4c0-1.284 0-2.94-1.8-2.94s-2.088 1.404-2.088 2.844v5.496H9.6V9.6h3.456v1.476h.048c.48-.912 1.656-1.872 3.408-1.872 3.648 0 4.32 2.4 4.32 5.52v5.676h-.432z"/>
          </svg>
          Pay with Razorpay
        </>
      )}
    </Button>
  );
};

export default RazorpayButton;
