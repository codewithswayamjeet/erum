import { useCurrency } from '@/contexts/CurrencyContext';

const CurrencyToggle = () => {
  const { currency, toggleCurrency } = useCurrency();

  return (
    <button
      onClick={toggleCurrency}
      className="p-2 text-xs font-medium tracking-wider text-foreground hover:text-primary transition-colors border border-border rounded-sm px-3 py-1.5"
      aria-label="Toggle currency"
    >
      {currency === 'USD' ? '$ USD' : '₹ INR'}
    </button>
  );
};

export default CurrencyToggle;
