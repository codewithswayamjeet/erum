import { Link } from 'react-router-dom';
import { Instagram, Facebook, Linkedin, MapPin, Phone, Mail } from 'lucide-react';
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <img src="/lovable-uploads/228cc8d9-9fb2-47a6-a48d-06ff14811609.png" alt="ERUM - The Jewellery Studio" className="h-12 w-auto object-contain brightness-0 invert border-primary" />
            </Link>
            <p className="text-background/70 text-sm leading-relaxed mb-6">
              Where precious becomes priceless. Crafting masterpieces with the passion for jewellery and gems since establishment.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/erumjewellery" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-background/20 flex items-center justify-center text-background/60 hover:text-primary hover:border-primary transition-colors duration-300" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://www.facebook.com/erumjewellery/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-background/20 flex items-center justify-center text-background/60 hover:text-primary hover:border-primary transition-colors duration-300" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://www.linkedin.com/company/erumjewellery" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-background/20 flex items-center justify-center text-background/60 hover:text-primary hover:border-primary transition-colors duration-300" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="https://x.com/erumjewellery" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-background/20 flex items-center justify-center text-background/60 hover:text-primary hover:border-primary transition-colors duration-300" aria-label="Twitter/X">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* High Jewelry Column */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6 text-background">High Jewelry</h4>
            <ul className="space-y-3">
              {[{
              name: 'Rings',
              href: '/collections/rings'
            }, {
              name: 'Necklaces & Pendants',
              href: '/collections/necklaces'
            }, {
              name: 'Earrings & Studs',
              href: '/collections/earrings'
            }, {
              name: 'Bracelets & Bangles',
              href: '/collections/bracelets'
            }, {
              name: 'Platinum Jewelry',
              href: '/platinum-jewelry'
            }, {
              name: 'Hip Hop Jewelry',
              href: '/hip-hop-jewelry'
            }].map(item => <li key={item.name}>
                  <Link to={item.href} className="text-background/60 hover:text-primary transition-colors duration-300 text-sm">
                    {item.name}
                  </Link>
                </li>)}
            </ul>
          </div>

          {/* About Column */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6 text-background">The House</h4>
            <ul className="space-y-3">
              {[{
              name: 'Our Heritage',
              href: '/about'
            }, {
              name: 'Meet the Designer',
              href: '/meet-the-designer'
            }, {
              name: 'Bespoke Services',
              href: '/bespoke-services'
            }, {
              name: 'Ring Size Guide',
              href: '/ring-size-guide'
            }, {
              name: 'GIA Retailer Lookup',
              href: 'https://www.gia.edu/retailer-lookup'
            }].map(item => <li key={item.name}>
                  {item.href.startsWith('http') ? <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-background/60 hover:text-primary transition-colors duration-300 text-sm">
                      {item.name}
                    </a> : <Link to={item.href} className="text-background/60 hover:text-primary transition-colors duration-300 text-sm">
                      {item.name}
                    </Link>}
                </li>)}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6 text-background">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-background/60">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                <span>
                  F 3/4, Golden Plaza<br />
                  Near Kirtistambh, Palanpur<br />
                  Gujarat 385001 (India)
                </span>
              </li>
              <li>
                <a href="tel:+919974555440" className="flex items-center gap-3 text-sm text-background/60 hover:text-primary transition-colors">
                  <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                  <span>+91 9974555440</span>
                </a>
              </li>
              <li>
                <a href="mailto:Contact@erum.in" className="flex items-center gap-3 text-sm text-background/60 hover:text-primary transition-colors">
                  <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                  <span>Contact@erum.in</span>
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <Link to="/contact" className="inline-block text-sm font-medium tracking-luxury uppercase text-primary hover:text-background transition-colors">
                Book an Appointment →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-background/40">
            <span>GIA Certified</span>
            <span className="hidden sm:inline">•</span>
            <span>IGI Certified</span>
            <span className="hidden sm:inline">•</span>
            <span>BIS Hallmarked</span>
            <span className="hidden sm:inline">•</span>
            <span>GJEPC Member</span>
            <span className="hidden sm:inline">•</span>
            <span>IBJA Member</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/50">
            <p>© {currentYear} ERUM – The Jewellery Studio. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/shipping" className="hover:text-primary transition-colors">
                Delivery & Returns
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;