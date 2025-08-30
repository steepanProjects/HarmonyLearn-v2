import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { getCurrentUser, isAuthenticated, User, isMaster } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Home, LogIn } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'student' | 'mentor' | 'admin';
  requireAuth?: boolean;
  allowedRoles?: ('student' | 'mentor' | 'admin')[];
  redirectTo?: string;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  requireAuth = true, 
  allowedRoles,
  redirectTo = "/" 
}: ProtectedRouteProps) => {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      
      // If authentication is required but user is not authenticated
      if (requireAuth && !currentUser) {
        setError("authentication_required");
        setIsLoading(false);
        return;
      }

      // If specific role is required
      if (requiredRole && (!currentUser || currentUser.role !== requiredRole)) {
        setError("insufficient_permissions");
        setIsLoading(false);
        return;
      }

      // If user role must be in allowed roles list
      if (allowedRoles && (!currentUser || !allowedRoles.includes(currentUser.role))) {
        setError("insufficient_permissions");
        setIsLoading(false);
        return;
      }

      // All checks passed
      setError(null);
      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth state changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'currentUser') {
        checkAuth();
      }
    };

    const handleAuthStateChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('user-login', handleAuthStateChange);
    window.addEventListener('user-logout', handleAuthStateChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('user-login', handleAuthStateChange);
      window.removeEventListener('user-logout', handleAuthStateChange);
    };
  }, [requireAuth, requiredRole, allowedRoles]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
              <p className="text-muted-foreground">Verifying access permissions...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error === "authentication_required") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="text-center p-8">
            <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground mb-6">
              You need to sign in to access this page.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setLocation("/get-started")} className="gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
              <Button variant="outline" onClick={() => setLocation("/")} className="gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error === "insufficient_permissions") {
    const userRoleText = user?.role ? ` as ${user.role}` : '';
    const requiredText = requiredRole 
      ? `This page requires ${requiredRole} access.`
      : allowedRoles 
        ? `This page requires one of the following roles: ${allowedRoles.join(', ')}.`
        : 'You do not have permission to access this page.';

    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="text-center p-8">
            <Shield className="h-16 w-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-2">
              You are currently signed in{userRoleText}.
            </p>
            <p className="text-muted-foreground mb-6">
              {requiredText}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setLocation(redirectTo)} className="gap-2">
                <Home className="h-4 w-4" />
                Go Back
              </Button>
              {user?.role === 'student' && (
                <Button variant="outline" onClick={() => setLocation("/student-dashboard")}>
                  Student Dashboard
                </Button>
              )}
              {user?.role === 'mentor' && (
                <Button variant="outline" onClick={() => setLocation("/mentor-dashboard")}>
                  Mentor Dashboard
                </Button>
              )}
              {user?.role === 'admin' && (
                <Button variant="outline" onClick={() => setLocation("/admin")}>
                  Admin Panel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // All checks passed, render the protected content
  return <>{children}</>;
};

// Convenience components for specific roles
export const StudentRoute = ({ children, ...props }: Omit<ProtectedRouteProps, 'requiredRole'>) => (
  <ProtectedRoute requiredRole="student" redirectTo="/student-dashboard" {...props}>
    {children}
  </ProtectedRoute>
);

export const MentorRoute = ({ children, ...props }: Omit<ProtectedRouteProps, 'requiredRole'>) => (
  <ProtectedRoute requiredRole="mentor" redirectTo="/mentor-dashboard" {...props}>
    {children}
  </ProtectedRoute>
);

export const AdminRoute = ({ children, ...props }: Omit<ProtectedRouteProps, 'requiredRole'>) => {
  const user = getCurrentUser();
  
  // If no user or not admin, redirect to admin sign-in
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="text-center p-8">
            <Shield className="h-16 w-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-2">Admin Access Required</h2>
            <p className="text-muted-foreground mb-6">
              You need to sign in as an administrator to access this panel.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => window.location.href = "/admin-signin"} className="gap-2 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700">
                <Shield className="h-4 w-4" />
                Admin Sign In
              </Button>
              <Button variant="outline" onClick={() => window.location.href = "/"} className="gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin" redirectTo="/admin-signin" {...props}>
      {children}
    </ProtectedRoute>
  );
};

export const AuthenticatedRoute = ({ children, ...props }: Omit<ProtectedRouteProps, 'requireAuth'>) => (
  <ProtectedRoute requireAuth={true} {...props}>
    {children}
  </ProtectedRoute>
);

// Master route for mentors with master status
export const MasterRoute = ({ children, ...props }: Omit<ProtectedRouteProps, 'requiredRole'>) => {
  const user = getCurrentUser();
  
  // Check if user is authenticated and has mentor role with master status
  if (!user || user.role !== 'mentor' || !isMaster()) {
    return (
      <ProtectedRoute 
        requiredRole="mentor" 
        redirectTo="/mentor-dashboard"
        {...props}
      >
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="w-96">
            <CardContent className="text-center p-8">
              <Shield className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
              <h2 className="text-2xl font-bold mb-2">Master Access Required</h2>
              <p className="text-muted-foreground mb-6">
                This feature is only available to mentors with master status. Please apply for master role from your mentor dashboard.
              </p>
              <Button onClick={() => window.location.href = "/mentor-dashboard"} className="gap-2">
                <Home className="h-4 w-4" />
                Back to Mentor Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="mentor" redirectTo="/mentor-dashboard" {...props}>
      {children}
    </ProtectedRoute>
  );
};