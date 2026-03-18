import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface RequireAdminProps {
  children: ReactNode;
}

const RequireAdmin = ({ children }: RequireAdminProps) => {
  const location = useLocation();
  const { user, isAdmin, isLoading, isRoleLoading } = useAuth();

  if (isLoading || isRoleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium text-foreground">Checking admin access</p>
            <p className="text-sm text-muted-foreground">Please wait a moment.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    const redirectTo = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={`/auth?redirect=${encodeURIComponent(redirectTo)}`} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RequireAdmin;
