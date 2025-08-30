import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  BookOpen, 
  Users, 
  MessageCircle, 
  Calendar,
  Settings,
  LogOut,
  Crown,
  UserCheck,
  GraduationCap,
  Search
} from "lucide-react";
import { getCurrentUser, isMaster, onAuthStateChange } from "@/lib/auth";

interface MentorNavigationProps {
  currentUser: any;
  className?: string;
}

export const MentorNavigation = ({ currentUser, className = "" }: MentorNavigationProps) => {
  const [location] = useLocation();
  const [authUser, setAuthUser] = useState(getCurrentUser());

  // Listen for user authentication state changes
  useEffect(() => {
    const cleanup = onAuthStateChange((user) => {
      setAuthUser(user);
    });
    return cleanup;
  }, []);

  const baseNavigationItems = [
    {
      label: "Dashboard",
      href: "/mentor-dashboard",
      icon: BarChart3,
      active: location === "/mentor-dashboard"
    },
    {
      label: "My Students",
      href: "/mentor-students",
      icon: GraduationCap,
      active: location === "/mentor-students"
    },
    {
      label: "Requests",
      href: "/mentor-requests",
      icon: UserCheck,
      active: location === "/mentor-requests"
    },
    {
      label: "Interactions",
      href: "/mentor-interactions",
      icon: MessageCircle,
      active: location === "/mentor-interactions"
    },
    {
      label: "Sessions",
      href: "/mentor-sessions",
      icon: Calendar,
      active: location === "/mentor-sessions"
    },
    {
      label: "My Classroom",
      href: "/staff-classroom",
      icon: BookOpen,
      active: location === "/staff-classroom",
      hideForMaster: true
    },
    {
      label: "Discover Academies",
      href: "/classroom-discovery",
      hideForMaster: true,
      icon: Search,
      active: location === "/classroom-discovery"
    }
  ];

  // For masters, only add master dashboard navigation (classrooms managed within master dashboard)
  const masterNavigationItems = [
    ...baseNavigationItems,
    {
      label: "Master Dashboard",
      href: "/master-dashboard",
      icon: Crown,
      active: location === "/master-dashboard"
    }
  ];

  // Filter navigation items based on user role
  const getFilteredNavigationItems = () => {
    const isUserMaster = authUser?.role === 'mentor' && authUser?.isMaster === true;
    const items = isUserMaster ? masterNavigationItems : baseNavigationItems;
    
    // Filter out items that should be hidden for masters
    if (isUserMaster) {
      return items.filter(item => !item.hideForMaster);
    }
    
    return items;
  };

  const navigationItems = getFilteredNavigationItems();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("mentorId");
    window.location.href = "/";
  };

  return (
    <nav className={`w-64 min-w-64 bg-card border-r flex-shrink-0 ${className}`}>
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">
              {currentUser?.firstName} {currentUser?.lastName}
            </p>
            <div className="flex items-center gap-1">
              <p className="text-xs text-muted-foreground truncate">
                Mentor Portal
              </p>
              {(authUser?.role === 'mentor' && authUser?.isMaster === true) && (
                <Crown className="h-3 w-3 text-yellow-500" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={item.active ? "default" : "ghost"}
                className="w-full justify-start gap-3"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.label === "Master Dashboard" && (
                  <Crown className="h-3 w-3 ml-auto text-yellow-500" />
                )}
              </Button>
            </Link>
          ))}
        </div>

        <div className="mt-8 pt-4 border-t space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};