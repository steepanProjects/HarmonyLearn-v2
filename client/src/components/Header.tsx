import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Music, Search, Bell, User, BookOpen, Users, Settings, Video, Shield, GraduationCap, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getCurrentUser, canCreateClassrooms, onAuthStateChange } from "@/lib/auth";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const [location] = useLocation();
  const currentPath = location;
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const canAccessClassrooms = canCreateClassrooms();

  const isActive = (path: string) => currentPath === path;

  // Listen for user authentication state changes
  useEffect(() => {
    const cleanup = onAuthStateChange((user) => {
      setCurrentUser(user);
    });
    return cleanup;
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-hero rounded-lg shadow-glow">
            <Music className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            HarmonyLearn
          </h1>
        </Link>

        {/* Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="space-x-2">
            <NavigationMenuItem>
              <NavigationMenuTrigger className={`${navigationMenuTriggerStyle()} group hover:bg-primary/10 transition-all duration-300`}>
                <GraduationCap className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                Learn
              </NavigationMenuTrigger>
              <NavigationMenuContent className="animate-fade-in">
                <div className="grid gap-3 p-6 w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <div className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        to="/courses"
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-hero p-6 no-underline outline-none focus:shadow-md hover:shadow-glow transition-all duration-300 transform hover:scale-[1.02] group"
                      >
                        <Music className="h-6 w-6 text-primary-foreground group-hover:animate-pulse" />
                        <div className="mb-2 mt-4 text-lg font-medium text-primary-foreground">
                          All Courses
                        </div>
                        <p className="text-sm leading-tight text-primary-foreground/80">
                          Browse our complete collection of music courses
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                  <NavigationMenuLink asChild>
                    <Link to="/learning-paths" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-105 hover:shadow-md group">
                      <div className="text-sm font-medium leading-none flex items-center">
                        Learning Paths
                        <div className="ml-2 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground group-hover:text-accent-foreground/80 transition-colors">
                        Structured journeys for mastering instruments
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link to="/mentors" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-105 hover:shadow-md group">
                      <div className="text-sm font-medium leading-none flex items-center">
                        Find Mentors
                        <div className="ml-2 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground group-hover:text-accent-foreground/80 transition-colors">
                        Connect with experienced music teachers
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link 
                  to="/live-sessions" 
                  className={`${navigationMenuTriggerStyle()} flex items-center space-x-2 group hover:bg-primary/10 transition-all duration-300`}
                >
                  <Video className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span>Live Sessions</span>
                  <Badge className="bg-accent text-accent-foreground text-xs px-1 ml-1 animate-pulse">LIVE</Badge>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className={`${navigationMenuTriggerStyle()} group hover:bg-primary/10 transition-all duration-300`}>
                <Lightbulb className="mr-2 h-4 w-4 transition-transform group-hover:scale-110 group-hover:rotate-12" />
                Resources
              </NavigationMenuTrigger>
              <NavigationMenuContent className="animate-fade-in">
                <div className="w-[350px] p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <NavigationMenuLink asChild>
                      <Link to="/tools" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-105 hover:shadow-md group">
                        <div className="text-sm font-medium leading-none flex items-center">
                          Practice Tools
                          <div className="ml-2 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground group-hover:text-accent-foreground/80 transition-colors">
                          Tuners, metronomes, and more
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="/community" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-105 hover:shadow-md group">
                        <div className="text-sm font-medium leading-none flex items-center">
                          Community
                          <div className="ml-2 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground group-hover:text-accent-foreground/80 transition-colors">
                          Join our vibrant music community
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {canAccessClassrooms && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    to="/classroom" 
                    className={`${navigationMenuTriggerStyle()} flex items-center space-x-2 group hover:bg-primary/10 transition-all duration-300`}
                  >
                    <Users className="h-4 w-4 transition-transform group-hover:scale-110" />
                    <span>Classroom</span>
                    <Badge className="bg-secondary text-secondary-foreground text-xs px-1 ml-1">MASTER</Badge>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link 
                  to="/about" 
                  className={`${navigationMenuTriggerStyle()} transition-all duration-300 hover:bg-primary/10 hover:scale-105`}
                >
                  About Us
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Search Bar - moved to right side */}
        <div className="hidden lg:flex items-center flex-1 justify-end mr-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-muted/50 border-border/50"
            />
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/get-started" className="flex items-center w-full">
                  <User className="mr-2 h-4 w-4" />
                  Get Started
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/student-signin" className="flex items-center w-full">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Student Sign In
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/mentor-signin" className="flex items-center w-full">
                  <Users className="mr-2 h-4 w-4" />
                  Mentor Sign In
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin-signin" className="flex items-center w-full">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Sign In
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard" className="flex items-center w-full">
                  <BookOpen className="mr-2 h-4 w-4" />
                  My Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/community" className="flex items-center w-full">
                  <Users className="mr-2 h-4 w-4" />
                  Community
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/mentor-mode" className="flex items-center w-full">
                  Switch to Mentor Mode
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin" className="flex items-center w-full">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Panel
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="hero" size="sm" asChild>
            <Link to="/get-started">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};