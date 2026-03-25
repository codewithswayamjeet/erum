import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Currency = 'USD' | 'INR';

interface CurrencyContextType {
  currency: Currency;
  toggleCurrency: () => void;
  setCurrency: (c: Currency) => void;
  conversionRate: number;
  formatPrice: (usdPrice: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>(() => {
    return (localStorage.getItem('erum_currency') as Currency) || 'USD';
  });
  const [conversionRate, setConversionRate] = useState(94.25);

  useEffect(() => {
    const fetchRate = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'usd_to_inr_rate')
        .single();
      if (data?.value) {
        setConversionRate(parseFloat(data.value));
      }
    };
    fetchRate();
  }, []);

  const toggleCurrency = useCallback(() => {
    setCurrency(prev => {
      const next = prev === 'USD' ? 'INR' : 'USD';
      localStorage.setItem('erum_currency', next);
      return next;
    });
  }, []);

  const handleSetCurrency = useCallback((c: Currency) => {
    setCurrency(c);
    localStorage.setItem('erum_currency', c);
  }, []);

  const formatPrice = useCallback((usdPrice: number) => {
    if (currency === 'INR') {
      const inrPrice = Math.round(usdPrice * conversionRate);
      return `₹${inrPrice.toLocaleString('en-IN')}`;
    }
    return `$${usdPrice.toLocaleString('en-US')}`;
  }, [currency, conversionRate]);

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, setCurrency: handleSetCurrency, conversionRate, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
};
