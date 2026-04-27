import { Link } from 'react-router-dom';
import { Instagram, Facebook, Linkedin, MapPin, Phone, Mail, Twitter } from 'lucide-react';
import footerLogo from '@/assets/erum-logo-footer.png';

const jewelryLinks = [
  { name: 'Rings', href: '/collections/rings' },
  { name: 'Necklaces & Pendants', href: '/collections/necklaces' },
  { name: 'Earrings & Studs', href: '/collections/earrings' },
  { name: 'Bracelets & Bangles', href: '/collections/bracelets' },
  { name: 'Platinum Jewelry', href: '/platinum-jewelry' },
  { name: 'Hip Hop Jewelry', href: '/hip-hop-jewelry' },
];

const houseLinks = [
  { name: 'Our Heritage', href: '/about' },
  { name: 'Meet the Designer', href: '/meet-the-designer' },
  { name: 'Bespoke Services', href: '/bespoke-services' },
  { name: 'Ring Size Guide', href: '/ring-size-guide' },
  { name: 'Blog', href: '/blogs' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div>
            <Link to="/" className="inline-block mb-6">
              <img src={footerLogo} alt="ERUM - The Jewellery Studio" className="h-14 md:h-16 w-auto object-contain" />
            </Link>
            <p className="text-background/70 text-sm leading-relaxed mb-6">
              Where precious becomes priceless. Crafting masterpieces with the passion for jewellery and gems since establishment.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/erumjewellery" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-background/20 flex items-center justify-center text-background/60 hover:text-primary hover:border-primary transition-colors duration-300" aria-label="Instagram"><Instagram className="h-4 w-4" /></a>
              <a href="https://www.facebook.com/erumjewellery/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-background/20 flex items-center justify-center text-background/60 hover:text-primary hover:border-primary transition-colors duration-300" aria-label="Facebook"><Facebook className="h-4 w-4" /></a>
              <a href="https://www.linkedin.com/company/erumjewellery" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-background/20 flex items-center justify-center text-background/60 hover:text-primary hover:border-primary transition-colors duration-300" aria-label="LinkedIn"><Linkedin className="h-4 w-4" /></a>
              <a href="https://x.com/erumjewellery" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-background/20 flex items-center justify-center text-background/60 hover:text-primary hover:border-primary transition-colors duration-300" aria-label="X (Twitter)"><Twitter className="h-4 w-4" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg font-medium mb-6">High Jewelry</h4>
            <ul className="space-y-3">
              {jewelryLinks.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-background/60 hover:text-primary transition-colors duration-300 text-sm">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-medium mb-6">The House</h4>
            <ul className="space-y-3">
              {houseLinks.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-background/60 hover:text-primary transition-colors duration-300 text-sm">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-medium mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-background/60"><MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" /><span>F 3/4, Golden Plaza<br />Near Kirtistambh, Palanpur<br />Gujarat 385001 (India)</span></li>
              <li><a href="tel:+919974555440" className="flex items-center gap-3 text-sm text-background/60 hover:text-primary transition-colors"><Phone className="h-4 w-4 flex-shrink-0 text-primary" /><span>+91 9974555440</span></a></li>
              <li><a href="mailto:Contact@erum.in" className="flex items-center gap-3 text-sm text-background/60 hover:text-primary transition-colors"><Mail className="h-4 w-4 flex-shrink-0 text-primary" /><span>Contact@erum.in</span></a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="container mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/50">
          <p>© {currentYear} ERUM – The Jewellery Studio. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <Link to="/refund-policy" className="hover:text-primary transition-colors">Refund & Return</Link>
            <Link to="/cancellation-policy" className="hover:text-primary transition-colors">Cancellation</Link>
            <Link to="/shipping-policy" className="hover:text-primary transition-colors">Shipping</Link>
            <Link to="/terms-conditions" className="hover:text-primary transition-colors">Terms & Conditions</Link>
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
