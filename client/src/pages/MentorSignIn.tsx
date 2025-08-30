import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GraduationCap, Users, Award, Loader2 } from "lucide-react";

const MentorSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Check if user is actually a mentor
        if (data.user.role !== 'mentor') {
          toast({
            title: "Access Denied",
            description: "This is the mentor portal. Please use the student portal to sign in.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Welcome Mentor!",
          description: "Redirecting to your mentor dashboard...",
        });
        
        // Store mentor session data using centralized auth utility
        const userData = {
          id: data.user.id.toString(),
          username: data.user.username,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
          role: data.user.role as 'mentor',
          isMaster: data.user.isMaster || false
        };
        
        // Store in centralized auth system
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Dispatch login event for other components
        window.dispatchEvent(new CustomEvent('user-login', { detail: userData }));
        
        // Redirect to mentor dashboard
        setLocation("/mentor-dashboard");
      } else {
        toast({
          title: "Sign In Failed",
          description: data.error || "Please check your email and password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: `${provider} Login`,
      description: `${provider} authentication would be integrated here.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Mentor-specific branding */}
          <div className="text-center mb-8 animate-slide-up">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-warm rounded-full mb-4 shadow-warm">
              <GraduationCap className="w-8 h-8 text-secondary-foreground" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-warm bg-clip-text text-transparent">
              Mentor Portal
            </h1>
            <p className="text-muted-foreground mt-2">Shape the next generation of musicians</p>
          </div>

          <Card className="shadow-musical border-0 bg-card/80 backdrop-blur-sm animate-slide-up">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl text-center font-semibold">Welcome Back</CardTitle>
              <CardDescription className="text-center">
                Continue inspiring and teaching music
                <br />
                <span className="text-xs mt-2 block text-primary">
                  Demo: Use mentor@harmonylearn.com / mentor123
                </span>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="transition-rhythm hover:shadow-warm hover:border-secondary"
                  onClick={() => handleSocialLogin("Google")}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <Button 
                  variant="outline" 
                  className="transition-rhythm hover:shadow-warm hover:border-secondary"
                  onClick={() => handleSocialLogin("LinkedIn")}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <Separator className="flex-1" />
                <span className="text-muted-foreground text-sm">or continue with email</span>
                <Separator className="flex-1" />
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="mentor@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="transition-rhythm focus:shadow-warm focus:border-secondary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <Link 
                      to="#" 
                      className="text-sm text-secondary hover:text-secondary/80 transition-beat"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="transition-rhythm focus:shadow-warm focus:border-secondary"
                    required
                  />
                </div>
                
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-warm hover:opacity-90 transition-rhythm shadow-warm font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      Sign In to Teach
                    </>
                  )}
                </Button>
              </form>

              {/* Professional Features Highlight */}
              <div className="bg-secondary/10 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-secondary">
                  <Award className="w-4 h-4" />
                  <span className="text-sm font-medium">Mentor Benefits</span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Advanced student analytics</li>
                  <li>• Professional scheduling tools</li>
                  <li>• Earnings dashboard</li>
                </ul>
              </div>

              {/* Additional Professional Options */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 transition-rhythm hover:border-secondary"
                    onClick={() => handleSocialLogin("Apple")}
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Apple
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 transition-rhythm hover:border-secondary"
                    onClick={() => handleSocialLogin("Microsoft")}
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
                    </svg>
                    Microsoft
                  </Button>
                </div>
              </div>

              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  New mentor?{" "}
                  <Link 
                    to="/mentor-signup" 
                    className="text-secondary hover:text-secondary/80 transition-beat font-medium"
                  >
                    Apply to teach
                  </Link>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Are you a student?{" "}
                  <Link 
                    to="/student-signin" 
                    className="text-primary hover:text-primary-glow transition-beat font-medium"
                  >
                    Student sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MentorSignIn;