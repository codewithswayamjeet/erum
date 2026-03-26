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
          <img src={razorpayLogo} alt="Razorpay" className="h-6 w-6 mr-2" />
          Pay with Razorpay
        </>
      )}
    </Button>
  );
};

export default RazorpayButton;
