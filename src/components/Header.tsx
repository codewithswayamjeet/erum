import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, Search, Heart, User, LogOut, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useShopifyCartStore } from '@/stores/shopifyCartStore';
import { ShopifyCartDrawer } from '@/components/ShopifyCartDrawer';
import erumLogo from '@/assets/erum-logo.jpg';
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    cartItems
  } = useCart();
  const {
    user,
    isAdmin,
    signOut
  } = useAuth();
  const {
    wishlistIds
  } = useWishlist();
  const shopifyCartItems = useShopifyCartStore(state => state.items);
  const shopifyCartCount = shopifyCartItems.reduce((sum, item) => sum + item.quantity, 0);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  const navLinks = [{
    name: 'Collections',
    href: '/collections'
  }, {
    name: 'Rings',
    href: '/collections/rings'
  }, {
    name: 'Necklaces',
    href: '/collections/necklaces'
  }, {
    name: 'Earrings',
    href: '/collections/earrings'
  }, {
    name: 'Bracelets',
    href: '/collections/bracelets'
  }, {
    name: 'About',
    href: '/about'
  }, {
    name: 'Contact',
    href: '/contact'
  }];
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  return <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-background/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 text-foreground hover:text-primary transition-colors" aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </button>

            <Link to="/" className="flex-shrink-0">
              <img alt="ERUM - The Jewellery Studio" src="/lovable-uploads/228cc8d9-9fb2-47a6-a48d-06ff14811609.png" className="h-12 md:h-14 w-auto border-none object-fill shadow-lg opacity-100 rounded-none" />
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => <Link key={link.name} to={link.href} className={`luxury-link text-sm font-medium tracking-luxury uppercase transition-colors duration-300 ${location.pathname === link.href ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
                  {link.name}
                </Link>)}
            </nav>

            <div className="flex items-center gap-3">
              <Link to="/search" className="p-2 text-foreground hover:text-primary transition-colors" aria-label="Search">
                <Search className="h-5 w-5" />
              </Link>
              
              {user && <Link to="/wishlist" className="relative p-2 text-foreground hover:text-primary transition-colors" aria-label="Wishlist">
                  <Heart className="h-5 w-5" />
                  {wishlistIds.length > 0 && <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">{wishlistIds.length}</span>}
                </Link>}
              
              <Link to="/cart" className="relative p-2 text-foreground hover:text-primary transition-colors" aria-label="Shopping cart">
                <ShoppingBag className="h-5 w-5" />
                {cartItemCount + shopifyCartCount > 0 && <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">{cartItemCount + shopifyCartCount}</span>}
              </Link>
              
              <ShopifyCartDrawer />

              {user ? <div className="hidden sm:flex items-center gap-2">
                  <Link to="/orders" className="p-2 text-foreground hover:text-primary transition-colors" aria-label="Order History">
                    <Package className="h-5 w-5" />
                  </Link>
                  {isAdmin && <Link to="/admin" className="p-2 text-foreground hover:text-primary transition-colors" aria-label="Admin">
                      <User className="h-5 w-5" />
                    </Link>}
                  <button onClick={handleSignOut} className="p-2 text-foreground hover:text-primary transition-colors" aria-label="Sign out">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div> : <Link to="/auth" className="hidden sm:block p-2 text-foreground hover:text-primary transition-colors" aria-label="Sign in">
                  <User className="h-5 w-5" />
                </Link>}
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && <>
            <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} transition={{
          duration: 0.3
        }} className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div initial={{
          x: '-100%'
        }} animate={{
          x: 0
        }} exit={{
          x: '-100%'
        }} transition={{
          type: 'tween',
          duration: 0.4,
          ease: 'easeInOut'
        }} className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-background z-50 shadow-luxury">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <img src={erumLogo} alt="ERUM" className="h-10 w-auto object-contain" />
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-foreground hover:text-primary transition-colors" aria-label="Close menu">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <nav className="flex-1 py-8 px-6">
                  <ul className="space-y-6">
                    {navLinks.map((link, index) => <motion.li key={link.name} initial={{
                  opacity: 0,
                  x: -20
                }} animate={{
                  opacity: 1,
                  x: 0
                }} transition={{
                  delay: index * 0.1
                }}>
                        <Link to={link.href} className={`block text-lg font-medium tracking-wide transition-colors ${location.pathname === link.href ? 'text-primary' : 'text-foreground hover:text-primary'}`}>{link.name}</Link>
                      </motion.li>)}
                    <motion.li initial={{
                  opacity: 0,
                  x: -20
                }} animate={{
                  opacity: 1,
                  x: 0
                }} transition={{
                  delay: 0.7
                }}>
                      <Link to={user ? '/wishlist' : '/auth'} className="block text-lg font-medium tracking-wide text-foreground hover:text-primary">{user ? 'Wishlist' : 'Sign In'}</Link>
                    </motion.li>
                    {isAdmin && <motion.li initial={{
                  opacity: 0,
                  x: -20
                }} animate={{
                  opacity: 1,
                  x: 0
                }} transition={{
                  delay: 0.8
                }}>
                        <Link to="/admin" className="block text-lg font-medium tracking-wide text-foreground hover:text-primary">Admin</Link>
                      </motion.li>}
                  </ul>
                </nav>
                <div className="p-6 border-t border-border">
                  {user ? <button onClick={handleSignOut} className="btn-luxury w-full text-center">Sign Out</button> : <Link to="/auth" className="btn-luxury-primary w-full text-center block">Sign In</Link>}
                </div>
              </div>
            </motion.div>
          </>}
      </AnimatePresence>
    </>;
};
export default Header;