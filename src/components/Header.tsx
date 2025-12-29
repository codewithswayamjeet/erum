import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, Search, Heart, User, LogOut, Package, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useShopifyCartStore } from '@/stores/shopifyCartStore';
import { ShopifyCartDrawer } from '@/components/ShopifyCartDrawer';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const { wishlistIds } = useWishlist();
  const shopifyCartItems = useShopifyCartStore(state => state.items);
  const shopifyCartCount = shopifyCartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const megaMenuItems = {
    'High Jewelry': {
      sections: [
        {
          title: 'Rings',
          links: [
            { name: 'Engagement Rings', href: '/collections/rings?type=engagement' },
            { name: 'Wedding Bands', href: '/collections/rings?type=wedding' },
            { name: 'Eternity Rings', href: '/collections/rings?type=eternity' },
            { name: 'All Rings', href: '/collections/rings' },
          ]
        },
        {
          title: 'Earrings & Studs',
          links: [
            { name: 'Diamond Studs', href: '/collections/earrings?type=studs' },
            { name: 'Drop Earrings', href: '/collections/earrings?type=drop' },
            { name: 'All Earrings', href: '/collections/earrings' },
          ]
        },
        {
          title: 'Bracelets & Bangles',
          links: [
            { name: 'Tennis Bracelets', href: '/collections/bracelets?type=tennis' },
            { name: 'Bangles', href: '/collections/bracelets?type=bangles' },
            { name: 'All Bracelets', href: '/collections/bracelets' },
          ]
        },
        {
          title: 'Necklaces & Pendants',
          links: [
            { name: 'Tennis Necklaces', href: '/collections/necklaces?type=tennis' },
            { name: 'Pendants', href: '/collections/necklaces?type=pendants' },
            { name: 'All Necklaces', href: '/collections/necklaces' },
          ]
        }
      ]
    },
    'About Us': {
      sections: [
        {
          title: 'The House',
          links: [
            { name: 'Meet the Designer', href: '/about#designer' },
            { name: 'Brand Promises', href: '/about#promises' },
            { name: 'Our Heritage', href: '/about' },
          ]
        }
      ]
    }
  };

  const simpleLinks = [
    { name: 'Hip Hop Jewelry', href: '/collections/hip-hop' },
    { name: 'Bespoke Services', href: '/contact?service=bespoke' },
  ];

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-background/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 text-foreground hover:text-primary transition-colors" aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 absolute left-1/2 -translate-x-1/2 lg:relative lg:left-0 lg:translate-x-0">
              <img alt="ERUM - The Jewellery Studio" src="/lovable-uploads/228cc8d9-9fb2-47a6-a48d-06ff14811609.png" className="h-10 md:h-12 w-auto object-contain" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {/* High Jewelry Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('High Jewelry')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className={`flex items-center gap-1 text-xs font-medium tracking-luxury uppercase transition-colors duration-300 ${activeDropdown === 'High Jewelry' ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
                  High Jewelry
                  <ChevronDown className="h-3 w-3" />
                </button>
                <AnimatePresence>
                  {activeDropdown === 'High Jewelry' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
                    >
                      <div className="bg-background border border-border shadow-luxury p-8 min-w-[600px]">
                        <div className="grid grid-cols-4 gap-8">
                          {megaMenuItems['High Jewelry'].sections.map((section) => (
                            <div key={section.title}>
                              <h4 className="font-serif text-sm font-medium mb-4 text-foreground">{section.title}</h4>
                              <ul className="space-y-2">
                                {section.links.map((link) => (
                                  <li key={link.name}>
                                    <Link to={link.href} className="text-xs text-muted-foreground hover:text-primary transition-colors">{link.name}</Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Simple Links */}
              {simpleLinks.map(link => (
                <Link key={link.name} to={link.href} className="text-xs font-medium tracking-luxury uppercase text-foreground hover:text-primary transition-colors duration-300">
                  {link.name}
                </Link>
              ))}

              {/* About Us Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('About Us')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className={`flex items-center gap-1 text-xs font-medium tracking-luxury uppercase transition-colors duration-300 ${activeDropdown === 'About Us' ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
                  About Us
                  <ChevronDown className="h-3 w-3" />
                </button>
                <AnimatePresence>
                  {activeDropdown === 'About Us' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 pt-4"
                    >
                      <div className="bg-background border border-border shadow-luxury p-6 min-w-[200px]">
                        <ul className="space-y-3">
                          {megaMenuItems['About Us'].sections[0].links.map((link) => (
                            <li key={link.name}>
                              <Link to={link.href} className="text-xs text-muted-foreground hover:text-primary transition-colors block">{link.name}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Book Appointment */}
              <Link to="/contact" className="text-xs font-medium tracking-luxury uppercase text-primary hover:text-foreground transition-colors duration-300">
                Book Appointment
              </Link>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-2 md:gap-3">
              <Link to="/search" className="p-2 text-foreground hover:text-primary transition-colors" aria-label="Search">
                <Search className="h-5 w-5" />
              </Link>
              
              {user && (
                <Link to="/wishlist" className="relative p-2 text-foreground hover:text-primary transition-colors" aria-label="Wishlist">
                  <Heart className="h-5 w-5" />
                  {wishlistIds.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">{wishlistIds.length}</span>
                  )}
                </Link>
              )}
              
              <Link to="/cart" className="relative p-2 text-foreground hover:text-primary transition-colors" aria-label="Shopping cart">
                <ShoppingBag className="h-5 w-5" />
                {cartItemCount + shopifyCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">{cartItemCount + shopifyCartCount}</span>
                )}
              </Link>
              
              <ShopifyCartDrawer />

              {user ? (
                <div className="hidden sm:flex items-center gap-1">
                  <Link to="/orders" className="p-2 text-foreground hover:text-primary transition-colors" aria-label="Order History">
                    <Package className="h-5 w-5" />
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="p-2 text-foreground hover:text-primary transition-colors" aria-label="Admin">
                      <User className="h-5 w-5" />
                    </Link>
                  )}
                  <button onClick={handleSignOut} className="p-2 text-foreground hover:text-primary transition-colors" aria-label="Sign out">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Link to="/auth" className="hidden sm:block p-2 text-foreground hover:text-primary transition-colors" aria-label="Sign in">
                  <User className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.4, ease: 'easeInOut' }}
              className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-background z-50 shadow-luxury overflow-y-auto"
            >
              <div className="flex flex-col min-h-full">
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <img src="/lovable-uploads/228cc8d9-9fb2-47a6-a48d-06ff14811609.png" alt="ERUM" className="h-8 w-auto object-contain" />
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-foreground hover:text-primary transition-colors" aria-label="Close menu">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <nav className="flex-1 py-6 px-6">
                  {/* High Jewelry Section */}
                  <div className="mb-6">
                    <h4 className="text-xs font-medium tracking-luxury uppercase text-muted-foreground mb-4">High Jewelry</h4>
                    {megaMenuItems['High Jewelry'].sections.map((section) => (
                      <div key={section.title} className="mb-4">
                        <h5 className="font-serif text-sm font-medium mb-2">{section.title}</h5>
                        <ul className="space-y-2 pl-4">
                          {section.links.map((link) => (
                            <li key={link.name}>
                              <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.name}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Other Links */}
                  <div className="border-t border-border pt-6 space-y-4">
                    {simpleLinks.map((link) => (
                      <Link key={link.name} to={link.href} className="block text-sm font-medium text-foreground hover:text-primary">{link.name}</Link>
                    ))}
                    <Link to="/about" className="block text-sm font-medium text-foreground hover:text-primary">About Us</Link>
                    <Link to="/contact" className="block text-sm font-medium text-primary">Book Appointment</Link>
                  </div>

                  {/* User Links */}
                  <div className="border-t border-border pt-6 mt-6 space-y-3">
                    {user && (
                      <>
                        <Link to="/wishlist" className="block text-sm text-foreground hover:text-primary">Wishlist</Link>
                        <Link to="/orders" className="block text-sm text-foreground hover:text-primary">Order History</Link>
                      </>
                    )}
                    {isAdmin && (
                      <Link to="/admin" className="block text-sm text-foreground hover:text-primary">Admin</Link>
                    )}
                  </div>
                </nav>

                <div className="p-6 border-t border-border">
                  {user ? (
                    <button onClick={handleSignOut} className="btn-luxury w-full text-center">Sign Out</button>
                  ) : (
                    <Link to="/auth" className="btn-luxury-primary w-full text-center block">Sign In</Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;