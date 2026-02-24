import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Home, Users, Boxes, FileBarChart, MessageSquare, Menu, Lock, ScanSearch, Settings2, Mail, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: ReactNode;
}

const ADMIN_PASSWORD = 'admin@erum';
const ADMIN_SESSION_KEY = 'erum_admin_verified';

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Check if admin is already verified in this session
    const verified = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (verified === 'true') {
      setIsVerified(true);
    } else {
      setShowPasswordDialog(true);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      setIsVerified(true);
      setShowPasswordDialog(false);
      setPassword('');
      setPasswordError('');
      toast({
        title: 'Access Granted',
        description: 'Welcome to the Admin Panel.',
      });
    } else {
      setPasswordError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleDialogClose = () => {
    // If not verified, redirect to home
    if (!isVerified) {
      navigate('/');
    }
  };

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/admin/inventory', icon: Boxes, label: 'Inventory' },
    { path: '/admin/customers', icon: Users, label: 'Customers' },
    { path: '/admin/submissions', icon: MessageSquare, label: 'Submissions' },
    { path: '/admin/page-controls', icon: Settings2, label: 'Page Controls' },
    { path: '/admin/subscriptions', icon: Mail, label: 'Email Subscriptions' },
    { path: '/admin/videos', icon: Video, label: 'Videos' },
    { path: '/admin/images', icon: ScanSearch, label: 'Image Scanner' },
    { path: '/admin/reports', icon: FileBarChart, label: 'Reports' },
  ];

  const NavContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      <div className="p-4 md:p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-serif font-bold text-primary">ÉRUM</span>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Admin</span>
        </Link>
      </div>
      
      <nav className="p-2 md:p-4 space-y-1 md:space-y-2 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onItemClick}
            className={cn(
              "flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg transition-colors text-sm md:text-base",
              location.pathname === item.path
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-2 md:p-4 border-t border-border">
        <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/')}>
          <Home className="h-4 w-4 mr-2" />
          Back to Site
        </Button>
      </div>
    </>
  );

  // Password Dialog
  if (!isVerified) {
    return (
      <Dialog open={showPasswordDialog} onOpenChange={(open) => {
        if (!open) handleDialogClose();
      }}>
        <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Admin Access Required
            </DialogTitle>
            <DialogDescription>
              Please enter the admin password to access this area.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                className="w-full"
                autoFocus
              />
              {passwordError && (
                <p className="text-destructive text-sm mt-2">{passwordError}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => navigate('/')} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Unlock
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-card border-b border-border z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 flex flex-col">
              <NavContent onItemClick={() => setIsMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="text-lg font-serif font-bold text-primary">ÉRUM Admin</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <Home className="h-5 w-5" />
        </Button>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-card border-r border-border fixed h-full">
        <NavContent />
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-14 lg:pt-0 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
