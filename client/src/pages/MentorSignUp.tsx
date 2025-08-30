import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GraduationCap, Award, Users, Star, Loader2 } from "lucide-react";

const MentorSignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    experience: "",
    specialization: "",
    bio: "",
    acceptTerms: false,
    verifyCredentials: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.experience || !formData.specialization) {
      toast({
        title: "Complete profile",
        description: "Please fill in your experience and specialization.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.acceptTerms || !formData.verifyCredentials) {
      toast({
        title: "Accept agreements",
        description: "Please accept all terms and verify your credentials.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // First, register the mentor user
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.email, // Use email as username for simplicity
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: 'mentor'
        }),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        toast({
          title: "Registration Failed",
          description: registerData.error || "Unable to create account. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Then create the mentor application
      const applicationResponse = await fetch('/api/mentor-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: registerData.user.id,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          specialization: formData.specialization,
          experience: formData.experience,
          bio: formData.bio,
          credentials: "Credentials to be verified"
        }),
      });

      if (applicationResponse.ok) {
        toast({
          title: "Application Submitted!",
          description: `Thank you ${formData.firstName} ${formData.lastName}! We'll review your mentor application and get back to you soon.`,
        });
        setLocation("/mentor-signin");
      } else {
        toast({
          title: "Application Error",
          description: "Account created but application submission failed. Please contact support.",
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

  const handleSocialSignUp = (provider: string) => {
    toast({
      title: `${provider} Sign Up`,
      description: `${provider} registration would be integrated here.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Mentor-specific branding */}
          <div className="text-center mb-8 animate-slide-up">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-warm rounded-full mb-4 shadow-warm animate-pulse-glow">
              <GraduationCap className="w-8 h-8 text-secondary-foreground" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-warm bg-clip-text text-transparent">
              Become a Mentor
            </h1>
            <p className="text-muted-foreground mt-2">Share your musical expertise with eager students</p>
          </div>

          <Card className="shadow-musical border-0 bg-card/80 backdrop-blur-sm animate-slide-up">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl text-center font-semibold">Apply to Teach</CardTitle>
              <CardDescription className="text-center">
                Join our community of expert music mentors
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Social Sign Up Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="transition-rhythm hover:shadow-warm hover:border-secondary"
                  onClick={() => handleSocialSignUp("Google")}
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
                  onClick={() => handleSocialSignUp("LinkedIn")}
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

              {/* Professional Application Form */}
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="transition-rhythm focus:shadow-warm focus:border-secondary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="transition-rhythm focus:shadow-warm focus:border-secondary"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Professional Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="mentor@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="transition-rhythm focus:shadow-warm focus:border-secondary"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-sm font-medium">Experience</Label>
                    <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                      <SelectTrigger className="transition-rhythm focus:shadow-warm focus:border-secondary">
                        <SelectValue placeholder="Years" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2">1-2 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="specialization" className="text-sm font-medium">Specialization</Label>
                    <Select value={formData.specialization} onValueChange={(value) => handleInputChange("specialization", value)}>
                      <SelectTrigger className="transition-rhythm focus:shadow-warm focus:border-secondary">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="piano">Piano</SelectItem>
                        <SelectItem value="guitar">Guitar</SelectItem>
                        <SelectItem value="violin">Violin</SelectItem>
                        <SelectItem value="drums">Drums</SelectItem>
                        <SelectItem value="vocal">Vocal Training</SelectItem>
                        <SelectItem value="theory">Music Theory</SelectItem>
                        <SelectItem value="production">Music Production</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-medium">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about your musical background, teaching experience, and what makes you passionate about mentoring..."
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    className="transition-rhythm focus:shadow-warm focus:border-secondary min-h-[80px]"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="transition-rhythm focus:shadow-warm focus:border-secondary"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="transition-rhythm focus:shadow-warm focus:border-secondary"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="credentials" 
                      checked={formData.verifyCredentials}
                      onCheckedChange={(checked) => handleInputChange("verifyCredentials", checked)}
                    />
                    <Label htmlFor="credentials" className="text-sm text-muted-foreground">
                      I verify that my credentials and experience are accurate
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => handleInputChange("acceptTerms", checked)}
                    />
                    <Label htmlFor="terms" className="text-sm text-muted-foreground">
                      I agree to the{" "}
                      <Link to="#" className="text-secondary hover:text-secondary/80 transition-beat">
                        Mentor Agreement
                      </Link>{" "}
                      and{" "}
                      <Link to="#" className="text-secondary hover:text-secondary/80 transition-beat">
                        Code of Conduct
                      </Link>
                    </Label>
                  </div>
                </div>
                
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-warm hover:opacity-90 transition-rhythm shadow-warm font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              </form>

              {/* Mentor Benefits */}
              <div className="bg-secondary/10 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-secondary">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-medium">Why Teach With Us?</span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Competitive hourly rates</li>
                  <li>• Flexible scheduling</li>
                  <li>• Global student reach</li>
                  <li>• Professional development support</li>
                </ul>
              </div>

              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  Already a mentor?{" "}
                  <Link 
                    to="/mentor-signin" 
                    className="text-secondary hover:text-secondary/80 transition-beat font-medium"
                  >
                    Sign in
                  </Link>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Want to learn instead?{" "}
                  <Link 
                    to="/student-signup" 
                    className="text-primary hover:text-primary-glow transition-beat font-medium"
                  >
                    Join as student
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

export default MentorSignUp;