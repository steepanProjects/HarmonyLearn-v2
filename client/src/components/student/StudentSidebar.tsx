import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { logout } from "@/lib/auth";
import { 
  BookOpen, 
  Video, 
  Trophy, 
  Users, 
  Calendar,
  Settings,
  Music,
  Headphones,
  Target,
  MessageCircle,
  FileText,
  Star,
  TrendingUp,
  User,
  LogOut,
  Crown,
  Sparkles
} from "lucide-react";

interface StudentSidebarProps {
  currentUser?: any;
  onLogout?: () => void;
}

export const StudentSidebar = ({ currentUser, onLogout }: StudentSidebarProps) => {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navigationItems = [
    {
      label: "Dashboard",
      href: "/student-dashboard",
      icon: TrendingUp,
      active: location === "/student-dashboard"
    },
    {
      label: "My Courses",
      href: "/student-courses",
      icon: BookOpen,
      active: location === "/student-courses",
      badge: "3" // Number of active courses
    },
    {
      label: "Live Sessions",
      href: "/student-sessions",
      icon: Video,
      active: location === "/student-sessions",
      badge: "2" // Number of upcoming sessions
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
      label: "Practice Tools",
      href: "/tools",
      icon: Music,
      active: location === "/tools"
    },
    {
      label: "Achievements",
      href: "/student-achievements",
      icon: Trophy,
      active: location === "/student-achievements"
    },
    {
      label: "Community",
      href: "/community",
      icon: Users,
      active: location === "/community"
    },
    {
      label: "Messages",
      href: "/student-messages",
      icon: MessageCircle,
      active: location === "/student-messages"
    },
    {
      label: "Progress",
      href: "/student-progress",
      icon: Target,
      active: location === "/student-progress"
    }
  ];

  const quickStats = [
    { label: "Courses", value: "5", icon: BookOpen },
    { label: "Hours", value: "48", icon: Headphones },
    { label: "Streak", value: "7d", icon: Target }
  ];

  return (
    <div className={`bg-card border-r transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} flex flex-col h-full`}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Music className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-sm">Student Portal</h2>
                <p className="text-xs text-muted-foreground">HarmonyLearn</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 p-0"
          >
            <div className={`transition-transform ${collapsed ? 'rotate-180' : ''}`}>
              →
            </div>
          </Button>
        </div>
      </div>

      {/* User Profile */}
      {!collapsed && currentUser && (
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
                {currentUser?.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {!collapsed && (
        <div className="p-4 border-b">
          <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Quick Stats
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {quickStats.map((stat) => (
              <Card key={stat.label} className="bg-muted/50">
                <CardContent className="p-2 text-center">
                  <stat.icon className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-sm font-semibold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={item.active ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${collapsed ? 'px-2' : 'px-3'}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t space-y-2">
        <Link href="/student-settings">
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 ${collapsed ? 'px-2' : 'px-3'}`}
            title={collapsed ? "Settings" : undefined}
          >
            <Settings className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>Settings</span>}
          </Button>
        </Link>
        
        <Button
          variant="ghost"
          className={`w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 ${collapsed ? 'px-2' : 'px-3'}`}
          onClick={() => {
            logout();
            if (onLogout) onLogout();
          }}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
};