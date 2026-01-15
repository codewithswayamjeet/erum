import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

const PAYPAL_CLIENT_ID = 'AVsM0g_vTXa2G4VcgmG69pd7Fn3WDyhuSq0wxqiamVqtkk2iXO6OKHfVzLXZzu2S0gRQINUFrfODcsHa';

const PayPalButton = ({ amount, onSuccess, onError, disabled }: PayPalButtonProps) => {
  const { toast } = useToast();

  const createOrder = async () => {
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

      return data.orderId;
    } catch (err) {
      console.error('Create order error:', err);
      toast({
        title: 'Payment Error',
        description: 'Could not initiate PayPal payment. Please try again.',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const onApprove = async (data: { orderID: string }) => {
    try {
      const { data: captureData, error: captureError } = await supabase.functions.invoke(
        'capture-paypal-order',
        {
          body: { paypalOrderId: data.orderID },
        }
      );

      if (captureError) {
        throw new Error(captureError.message || 'Payment capture failed');
      }

      if (captureData?.success && captureData?.status === 'COMPLETED') {
        onSuccess({
          orderId: data.orderID,
          status: captureData.status,
          payer: {
            email: captureData.payerEmail || '',
            name: '',
          },
        });
        
        toast({
          title: 'Payment Successful',
          description: 'Your PayPal payment has been processed.',
        });
      } else {
        throw new Error('Payment was not completed');
      }
    } catch (err) {
      console.error('Capture error:', err);
      onError?.(err as Error);
      toast({
        title: 'Payment Failed',
        description: 'Unable to complete the PayPal payment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const onCancelHandler = () => {
    toast({
      title: 'Payment Cancelled',
      description: 'You cancelled the PayPal payment.',
      variant: 'default',
    });
  };

  const onErrorHandler = (err: Record<string, unknown>) => {
    console.error('PayPal error:', err);
    onError?.(new Error('PayPal encountered an error'));
    toast({
      title: 'Payment Error',
      description: 'PayPal encountered an error. Please try again.',
      variant: 'destructive',
    });
  };

  if (disabled) {
    return (
      <div className="w-full opacity-50 pointer-events-none">
        <div className="w-full h-12 bg-[#ffc439] rounded flex items-center justify-center text-black font-semibold">
          Pay with PayPal
        </div>
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: PAYPAL_CLIENT_ID,
        currency: 'USD',
        intent: 'capture',
      }}
    >
      <PayPalButtons
        style={{
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
          height: 48,
        }}
        createOrder={createOrder}
        onApprove={onApprove}
        onCancel={onCancelHandler}
        onError={onErrorHandler}
        disabled={disabled}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
