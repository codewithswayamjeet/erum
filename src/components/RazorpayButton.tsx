import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import razorpayLogo from '@/assets/razorpay-logo.png';
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
          <svg viewBox="0 0 122 28" className="w-24 h-6 mr-2" fill="none">
            <path d="M11.5 2L2 26h6.5L13 16.5h9L18.5 26H25L15.5 2h-4zm1 10l2.5-7h.5l2.5 7h-5.5z" fill="#fff"/>
            <path d="M33 8h-4.5L24 26h5l1.5-6h5L37 26h5L38 8h-5zm-.5 8l1.5-5h.5l1 5h-3z" fill="#fff"/>
            <path d="M45 8l-3 18h18l1-4H50l.5-3h9l.5-4h-9l.5-3h10l1-4H45z" fill="#fff"/>
            <path d="M64 8l-3 18h5l1-6h3c4 0 7-2.5 7.5-7S75 8 71 8h-7zm5 8l.5-4h2c1.5 0 2.5.5 2 3s-2 1-3 1h-1.5z" fill="#fff"/>
            <path d="M82 8l-1 4h4l-2.5 14h5L90 12h4l1-4H82z" fill="#3395FF"/>
            <path d="M93 8l-3 18h5l3-18h-5z" fill="#3395FF"/>
            <path d="M110 8h-8l-3 18h5l1-6h3c4 0 7-2.5 7.5-7S114 8 110 8zm-2 8l.5-4h2c1.5 0 2.5.5 2 3s-2 1-3 1h-1.5z" fill="#3395FF"/>
          </svg>
          Pay with Razorpay
        </>
      )}
    </Button>
  );
};

export default RazorpayButton;
