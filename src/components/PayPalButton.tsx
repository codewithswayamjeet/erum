import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Component, ReactNode, ErrorInfo } from 'react';
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

// Error boundary to catch PayPal SDK crashes
class PayPalErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('PayPal component error:', error, info);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

const PAYPAL_CLIENT_ID = 'AVsM0g_vTXa2G4VcgmG69pd7Fn3WDyhuSq0wxqiamVqtkk2iXO6OKHfVzLXZzu2S0gRQINUFrfODcsHa';

// Inner component that waits for SDK to load before rendering buttons
const PayPalButtonsWrapper = ({ amount, onSuccess, onError, disabled }: PayPalButtonProps) => {
  const { toast } = useToast();
  const [{ isPending, isResolved, isRejected }] = usePayPalScriptReducer();

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

  if (isPending) {
    return (
      <div className="w-full h-12 flex items-center justify-center gap-2 bg-[#ffc439] rounded text-black font-semibold">
        <Loader2 className="w-5 h-5 animate-spin" />
        Loading PayPal...
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="w-full p-4 text-center border border-destructive/30 rounded bg-destructive/5">
        <p className="text-sm text-destructive">PayPal failed to load. Please refresh and try again, or use another payment method.</p>
      </div>
    );
  }

  if (!isResolved) {
    return null;
  }

  return (
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
  );
};

const PayPalButton = ({ amount, onSuccess, onError, disabled }: PayPalButtonProps) => {
  if (disabled) {
    return (
      <div className="w-full opacity-50 pointer-events-none">
        <div className="w-full h-12 bg-[#ffc439] rounded flex items-center justify-center text-black font-semibold">
          Pay with PayPal
        </div>
      </div>
    );
  }

  const fallback = (
    <div className="w-full p-4 text-center border border-destructive/30 rounded bg-destructive/5">
      <p className="text-sm text-destructive">PayPal failed to load. Please try again or use another payment method.</p>
    </div>
  );

  return (
    <PayPalErrorBoundary fallback={fallback}>
      <PayPalScriptProvider
        options={{
          clientId: PAYPAL_CLIENT_ID,
          currency: 'USD',
          intent: 'capture',
          components: 'buttons',
        }}
      >
        <PayPalButtonsWrapper
          amount={amount}
          onSuccess={onSuccess}
          onError={onError}
          disabled={disabled}
        />
      </PayPalScriptProvider>
    </PayPalErrorBoundary>
  );
};

export default PayPalButton;
