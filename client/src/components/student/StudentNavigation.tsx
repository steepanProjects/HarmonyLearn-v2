import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Video, 
  Trophy, 
  Users, 
  Calendar,
  Settings,
  TrendingUp,
  User,
  LogOut,
  Music,
  Target,
  Award,
  BarChart3,
  MessageCircle,
  Crown,
  Sparkles
} from "lucide-react";

interface StudentNavigationProps {
  currentUser?: any;
  className?: string;
}

export const StudentNavigation = ({ currentUser, className = "" }: StudentNavigationProps) => {
  const [location] = useLocation();

  const navigationItems = [
    {
      label: "Dashboard",
      href: "/student-dashboard",
      icon: BarChart3,
      active: location === "/student-dashboard"
    },
    {
      label: "My Courses",
      href: "/student-courses",
      icon: BookOpen,
      active: location === "/student-courses"
    },
    {
      label: "Live Sessions",
      href: "/student-sessions",
      icon: Video,
      active: location === "/student-sessions"
    },
    {
      label: "Progress",
      href: "/student-progress",
      icon: TrendingUp,
      active: location === "/student-progress"
    },
    {
      label: "Achievements",
      href: "/student-achievements",
      icon: Trophy,
      active: location === "/student-achievements"
    },
    {
      label: "Find Mentors",
      href: "/student-mentors",
      icon: User,
      active: location === "/student-mentors"
    },
    {
      label: "My Academies",
      href: "/my-academies",
      icon: Crown,
      active: location === "/my-academies"
    },
    {
      label: "Discover Academies",
      href: "/academy-discovery",
      icon: Sparkles,
      active: location === "/academy-discovery"
    },
    {
      label: "Mentor Chat",
      href: "/mentor-interactions",
      icon: MessageCircle,
      active: location === "/mentor-interactions"
    },
    {
      label: "Community",
      href: "/student-community",
      icon: Users,
      active: location === "/student-community"
    },
    {
      label: "Practice Tools",
      href: "/student-tools",
      icon: Music,
      active: location === "/student-tools"
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("currentUser");
    window.location.href = "/";
  };

  return (
    <nav className={`bg-card border-r ${className}`}>
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">
              {currentUser?.firstName} {currentUser?.lastName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              Student Portal
            </p>
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