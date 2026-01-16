import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const countries = [
  { code: '+91', name: 'India', flag: '🇮🇳' },
  { code: '+1', name: 'United States', flag: '🇺🇸' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+971', name: 'UAE', flag: '🇦🇪' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: '+33', name: 'France', flag: '🇫🇷' },
  { code: '+39', name: 'Italy', flag: '🇮🇹' },
  { code: '+86', name: 'China', flag: '🇨🇳' },
  { code: '+7', name: 'Russia', flag: '🇷🇺' },
  { code: '+55', name: 'Brazil', flag: '🇧🇷' },
  { code: '+27', name: 'South Africa', flag: '🇿🇦' },
  { code: '+82', name: 'South Korea', flag: '🇰🇷' },
  { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+974', name: 'Qatar', flag: '🇶🇦' },
  { code: '+973', name: 'Bahrain', flag: '🇧🇭' },
  { code: '+968', name: 'Oman', flag: '🇴🇲' },
  { code: '+965', name: 'Kuwait', flag: '🇰🇼' },
];

interface PhoneInputWithCountryProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

const PhoneInputWithCountry = ({
  value,
  onChange,
  placeholder = 'Phone number',
  className = '',
  required = false,
}: PhoneInputWithCountryProps) => {
  const [countryCode, setCountryCode] = useState('+91');
  
  // Parse the value to extract country code and number
  const phoneNumber = value.startsWith('+') 
    ? value.replace(/^\+\d+\s?/, '') 
    : value;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const number = e.target.value.replace(/[^\d]/g, '');
    onChange(`${countryCode} ${number}`);
  };

  const handleCountryChange = (code: string) => {
    setCountryCode(code);
    const currentNumber = value.replace(/^\+\d+\s?/, '');
    onChange(`${code} ${currentNumber}`);
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Select value={countryCode} onValueChange={handleCountryChange}>
        <SelectTrigger className="w-[110px] bg-muted/30 border-border focus:border-primary">
          <SelectValue>
            {countries.find(c => c.code === countryCode)?.flag} {countryCode}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {countries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <span className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span>{country.name}</span>
                <span className="text-muted-foreground">{country.code}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneChange}
        placeholder={placeholder}
        required={required}
        className="flex-1 bg-muted/30 border-border focus:border-primary"
      />
    </div>
  );
};

export default PhoneInputWithCountry;
