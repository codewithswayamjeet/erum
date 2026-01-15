import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PayPalButtonProps {
  amount: number;
  onSuccess: (details: PayPalOrderDetails) => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
}

interface PayPalOrderDetails {
  orderId: string;
  status: string;
  payer: {
    email: string;
    name: string;
  };
}

const PayPalButton = ({ amount, onSuccess, onError, disabled }: PayPalButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayPalPayment = async () => {
    setIsLoading(true);

    try {
      // Create PayPal order - Convert INR to USD (approximate rate)
      const amountInUSD = Number(amount) / 83; // Approximate INR to USD conversion
      
      const { data: createData, error: createError } = await supabase.functions.invoke(
        'create-paypal-order',
        {
          body: {
            amount: amountInUSD,
            currency: 'USD',
          },
        }
      );

      if (createError || !createData?.id) {
        throw new Error(createError?.message || 'Failed to create PayPal order');
      }

      const orderId = createData.id;
      const approvalUrl = createData.links?.find((link: { rel: string; href: string }) => link.rel === 'approve')?.href;

      if (!approvalUrl) {
        throw new Error('No approval URL found');
      }

      // Open PayPal in a popup window
      const paypalWindow = window.open(
        approvalUrl,
        'PayPal Checkout',
        'width=500,height=700,scrollbars=yes'
      );

      // Poll for window close and capture the order
      const checkPayment = setInterval(async () => {
        if (paypalWindow?.closed) {
          clearInterval(checkPayment);
          
          try {
            // Capture the payment
            const { data: captureData, error: captureError } = await supabase.functions.invoke(
              'capture-paypal-order',
              {
                body: { orderId },
              }
            );

            if (captureError) {
              throw new Error(captureError.message || 'Payment capture failed');
            }

            if (captureData?.status === 'COMPLETED') {
              onSuccess({
                orderId: captureData.id,
                status: captureData.status,
                payer: {
                  email: captureData.payer?.email_address || '',
                  name: `${captureData.payer?.name?.given_name || ''} ${captureData.payer?.name?.surname || ''}`.trim(),
                },
              });
            } else if (captureData?.status === 'CANCELLED') {
              toast({
                title: 'Payment Cancelled',
                description: 'You cancelled the PayPal payment.',
                variant: 'default',
              });
            } else {
              throw new Error('Payment was not completed');
            }
          } catch (captureErr) {
            console.error('Payment capture error:', captureErr);
            onError?.(captureErr as Error);
            toast({
              title: 'Payment Failed',
              description: 'Unable to complete the PayPal payment. Please try again.',
              variant: 'destructive',
            });
          }
          
          setIsLoading(false);
        }
      }, 500);

      // Timeout after 10 minutes
      setTimeout(() => {
        clearInterval(checkPayment);
        if (!paypalWindow?.closed) {
          paypalWindow?.close();
          setIsLoading(false);
          toast({
            title: 'Payment Timeout',
            description: 'Payment window timed out. Please try again.',
            variant: 'destructive',
          });
        }
      }, 600000);

    } catch (error) {
      console.error('PayPal error:', error);
      setIsLoading(false);
      onError?.(error as Error);
      toast({
        title: 'Payment Error',
        description: 'Could not initiate PayPal payment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button
      type="button"
      onClick={handlePayPalPayment}
      disabled={disabled || isLoading}
      className="w-full bg-[#0070ba] hover:bg-[#003087] text-white flex items-center justify-center gap-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-5 h-5 fill-current"
          >
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.768.768 0 0 1 .757-.646h6.31c2.855 0 4.842 1.087 5.393 3.347.189.781.19 1.643-.017 2.559-.698 3.081-3.103 4.788-6.384 4.788H8.986a.768.768 0 0 0-.757.647l-.847 5.259a.641.641 0 0 1-.633.539l-.673.124Z" />
            <path d="m19.938 9.237-.012.064c-.698 3.081-3.103 4.788-6.384 4.788h-2.017a.768.768 0 0 0-.757.647l-1.287 7.966a.543.543 0 0 0 .535.625h3.274a.675.675 0 0 0 .666-.568l.027-.14.529-3.354.034-.185a.675.675 0 0 1 .666-.568h.42c2.714 0 4.84-1.102 5.462-4.288.26-1.331.125-2.443-.561-3.225a2.701 2.701 0 0 0-.773-.577c.036.272.047.556.028.852l.15-.037Z" />
          </svg>
          Pay with PayPal
        </>
      )}
    </Button>
  );
};

export default PayPalButton;
