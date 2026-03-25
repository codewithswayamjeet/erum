import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, Mail } from 'lucide-react';

interface CheckoutOTPProps {
  email: string;
  onVerified: () => void;
}

const CheckoutOTP = ({ email, onVerified }: CheckoutOTPProps) => {
  const [step, setStep] = useState<'idle' | 'sent' | 'verified'>('idle');
  const [otp, setOtp] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const { toast } = useToast();

  const handleSendOTP = async () => {
    if (!email) {
      toast({ title: 'Email required', description: 'Please enter your email first.', variant: 'destructive' });
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-checkout-otp', {
        body: { email, action: 'send' },
      });

      if (error || !data?.success) {
        throw new Error(error?.message || 'Failed to send OTP');
      }

      setStep('sent');
      toast({ title: 'Code Sent', description: `A verification code has been sent to ${email}` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to send verification code.', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({ title: 'Invalid Code', description: 'Please enter the 6-digit code.', variant: 'destructive' });
      return;
    }

    setVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-checkout-otp', {
        body: { email, action: 'verify', code: otp },
      });

      if (error) throw new Error(error.message);

      if (data?.verified) {
        setStep('verified');
        toast({ title: 'Email Verified', description: 'You can now proceed with payment.' });
        onVerified();
      } else {
        toast({ title: 'Invalid Code', description: data?.error || 'The code is invalid or expired.', variant: 'destructive' });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Verification failed.', variant: 'destructive' });
    } finally {
      setVerifying(false);
    }
  };

  if (step === 'verified') {
    return (
      <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-sm">
        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
        <div>
          <p className="font-medium text-sm">Email Verified</p>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>
      </div>
    );
  }

  if (step === 'sent') {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code sent to <span className="font-medium text-foreground">{email}</span>
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            className="flex-1 px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none text-center text-lg tracking-[0.5em] font-mono rounded-sm"
          />
          <button
            type="button"
            onClick={handleVerifyOTP}
            disabled={verifying || otp.length !== 6}
            className="btn-luxury-primary px-6 disabled:opacity-50"
          >
            {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
          </button>
        </div>
        <button
          type="button"
          onClick={handleSendOTP}
          disabled={sending}
          className="text-sm text-primary hover:underline"
        >
          {sending ? 'Resending...' : 'Resend Code'}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleSendOTP}
      disabled={sending || !email}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-primary text-primary hover:bg-primary/5 transition-colors rounded-sm disabled:opacity-50"
    >
      {sending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Mail className="w-4 h-4" />
      )}
      {sending ? 'Sending...' : 'Verify Email with OTP'}
    </button>
  );
};

export default CheckoutOTP;
