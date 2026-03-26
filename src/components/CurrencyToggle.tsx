import { useCurrency } from '@/contexts/CurrencyContext';

const CurrencyToggle = () => {
  const { currency, toggleCurrency } = useCurrency();

  return (
    <button
      onClick={toggleCurrency}
      className="text-[10px] md:text-xs font-medium tracking-wider text-foreground hover:text-primary transition-colors border border-border rounded-sm px-1.5 py-1 md:px-3 md:py-1.5"
      aria-label="Toggle currency"
    >
      {currency === 'USD' ? '$ USD' : '₹ INR'}
    </button>
  );
};

export default CurrencyToggle;
