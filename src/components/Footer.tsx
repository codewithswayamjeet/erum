import { Link } from 'react-router-dom';
import { Instagram, Facebook, MapPin, Phone, Mail } from 'lucide-react';
import erumLogo from '@/assets/erum-logo.jpg';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary border-t border-border">
      {/* Main Footer */}
      <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <img
                src={erumLogo}
                alt="ERUM - The Jewellery Studio"
                className="h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Crafting timeless elegance since 2010. Every piece tells a story of 
              exceptional artistry and enduring beauty.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6">Shop</h4>
            <ul className="space-y-3">
              {['All Collections', 'Rings', 'Necklaces', 'Earrings', 'Bracelets', 'New Arrivals'].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to={item === 'All Collections' ? '/collections' : `/collections/${item.toLowerCase()}`}
                      className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* About Column */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6">About</h4>
            <ul className="space-y-3">
              {['Our Story', 'Craftsmanship', 'Sustainability', 'Press', 'Careers'].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to="/about"
                      className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  42 Jewellers Lane, Heritage District<br />
                  Mumbai, Maharashtra 400001
                </span>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>+91 98765 43210</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@erum.studio"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span>hello@erum.studio</span>
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <Link
                to="/contact"
                className="text-sm font-medium tracking-luxury uppercase text-primary hover:text-foreground transition-colors"
              >
                Book an Appointment →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {currentYear} ERUM – The Jewellery Studio. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="#" className="hover:text-primary transition-colors">
                Shipping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
