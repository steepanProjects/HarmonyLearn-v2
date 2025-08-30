import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { 
  Star, 
  Users, 
  Clock, 
  Award, 
  Music, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Share2,
  Heart,
  CheckCircle,
  PlayCircle,
  Calendar,
  DollarSign,
  Play,
  Edit,
  Eye,
  Settings,
  TrendingUp,
  BookOpen,
  Video,
  Trophy,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Quote,
  Shield,
  Sparkles,
  GraduationCap,
  Headphones,
  Image as ImageIcon
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type Classroom } from "@shared/schema";
import { AcademyEditor } from "@/components/classroom/AcademyEditor";

const joinRequestSchema = z.object({
  message: z.string().min(10, "Please provide a brief message about why you'd like to join"),
  experience: z.string().optional(),
});

type JoinRequestFormData = z.infer<typeof joinRequestSchema>;

export default function ClassroomLanding() {
  const { slug } = useParams<{ slug: string }>();
  const [user, setUser] = useState<any>(null);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const form = useForm<JoinRequestFormData>({
    resolver: zodResolver(joinRequestSchema),
    defaultValues: {
      message: "",
      experience: "",
    },
  });

  // Fetch classroom by slug
  const { data: classroom, isLoading: classroomLoading } = useQuery({
    queryKey: ["/api/classrooms/slug", slug],
    queryFn: () => apiRequest(`/api/classrooms/slug/${slug}`),
    enabled: !!slug,
  });

  // Check if edit mode is requested via URL parameter when classroom data is loaded
  useEffect(() => {
    if (classroom && user) {
      const urlParams = new URLSearchParams(window.location.search);
      const editParam = urlParams.get('edit');
      const isMaster = parseInt(user.id) === classroom.masterId;
      
      if (editParam === 'true' && isMaster) {
        setEditorOpen(true);
        // Remove the edit parameter from URL to clean up
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [classroom, user]);

  // Fetch master profile
  const { data: masterProfile } = useQuery({
    queryKey: ["/api/users", classroom?.masterId],
    queryFn: () => apiRequest(`/api/users/${classroom?.masterId}`),
    enabled: !!classroom?.masterId,
  });

  // Join classroom mutation
  const joinClassroomMutation = useMutation({
    mutationFn: (data: JoinRequestFormData) => 
      apiRequest(`/api/classrooms/${classroom?.id}/join`, {
        method: "POST",
        body: JSON.stringify({
          userId: user?.id,
          message: data.message,
          experience: data.experience,
        }),
      }),
    onSuccess: () => {
      toast({
        title: "Join Request Sent!",
        description: "Your request to join this academy has been sent to the master for review.",
      });
      setJoinDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send join request",
        variant: "destructive",
      });
    },
  });

  const handleJoinSubmit = (data: JoinRequestFormData) => {
    joinClassroomMutation.mutate(data);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Link Copied!",
        description: "Classroom link has been copied to your clipboard.",
      });
    });
  };

  if (classroomLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Music className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading academy...</p>
        </div>
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="text-center p-8">
            <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Academy Not Found</h3>
            <p className="text-muted-foreground">The academy you're looking for doesn't exist or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Safe JSON parsing with comprehensive error handling
  const safeJsonParse = (jsonString: string | null | undefined, fallback: any) => {
    if (!jsonString || jsonString.trim() === '' || jsonString === 'null' || jsonString === 'undefined') {
      return fallback;
    }
    
    // Check for malformed JSON patterns
    if (jsonString.includes('<!DOCTYPE') || jsonString.includes('<html')) {
      console.warn('Received HTML instead of JSON:', jsonString.substring(0, 100));
      return fallback;
    }
    
    try {
      const parsed = JSON.parse(jsonString);
      return parsed;
    } catch (error) {
      console.warn('Failed to parse JSON:', {
        input: jsonString.substring(0, 200) + (jsonString.length > 200 ? '...' : ''),
        error: error instanceof Error ? error.message : String(error)
      });
      return fallback;
    }
  };

  const parsedSocialLinks = safeJsonParse(classroom?.socialLinks, {});
  const parsedTestimonials = safeJsonParse(classroom?.testimonials, []);
  const parsedPricing = safeJsonParse(classroom?.pricing, []);
  const parsedSchedule = safeJsonParse(classroom?.schedule, []);

  // Check if current user is the master of this academy
  const isMaster = user?.id && classroom?.masterId && parseInt(user.id) === classroom.masterId;

  return (
    <div className="min-h-screen bg-background relative">
      {/* Master Controls */}
      {isMaster && !previewMode && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <Button
            onClick={() => setPreviewMode(true)}
            variant="outline"
            size="sm"
            className="shadow-lg bg-background/80 backdrop-blur"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            onClick={() => setEditorOpen(true)}
            variant="outline"
            size="sm"
            className="shadow-lg bg-background/80 backdrop-blur"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Page
          </Button>
        </div>
      )}

      {/* Preview Mode Banner */}
      {isMaster && previewMode && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground px-4 py-2">
          <div className="flex items-center justify-between container mx-auto">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span className="text-sm font-medium">Preview Mode - This is how visitors see your academy</span>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setEditorOpen(true)}
                variant="secondary"
                size="sm"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={() => setPreviewMode(false)}
                variant="secondary"
                size="sm"
              >
                Exit Preview
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Academy Editor Dialog */}
      {classroom && isMaster && (
        <AcademyEditor
          classroom={classroom}
          isOpen={editorOpen}
          onClose={() => setEditorOpen(false)}
        />
      )}

      {/* Navigation Header */}
      <header className={`border-b bg-background/95 backdrop-blur sticky z-40 ${previewMode ? 'top-12' : 'top-0'}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {classroom.logoImage && (
                <Avatar className="h-10 w-10">
                  <AvatarImage src={classroom.logoImage} alt={classroom.academyName} />
                  <AvatarFallback>{classroom.academyName.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div>
                <h2 className="font-semibold text-lg">{classroom.academyName}</h2>
                <p className="text-sm text-muted-foreground">{classroom.subject} Academy</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              {(!isMaster || previewMode) && (
                <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Heart className="h-4 w-4 mr-2" />
                      Join Academy
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Join {classroom.academyName}</DialogTitle>
                      <DialogDescription>
                        Send a request to join this academy. The master will review your application.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleJoinSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                          <FormItem>
                            <FormLabel>Why would you like to join?</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us about your musical goals and why you're interested in this academy..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Musical Experience (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Beginner, 2 years piano, etc."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex gap-2">
                        <Button type="submit" disabled={joinClassroomMutation.isPending}>
                          {joinClassroomMutation.isPending ? "Sending..." : "Send Request"}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setJoinDialogOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="relative min-h-[85vh] flex items-center overflow-hidden"
        style={{
          background: classroom.heroImage 
            ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url(${classroom.heroImage})`
            : `linear-gradient(135deg, ${classroom.primaryColor || '#3B82F6'}, ${classroom.secondaryColor || '#10B981'})`
        }}
      >
        {/* Background Image */}
        {classroom.heroImage && (
          <div className="absolute inset-0">
            <img 
              src={classroom.heroImage} 
              alt="Academy Hero" 
              className="w-full h-full object-cover"
            />
            <div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${classroom.primaryColor || '#3B82F6'}60, ${classroom.secondaryColor || '#10B981'}60)`
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 text-center text-white">
          <div className="max-w-4xl mx-auto">
            {/* Academy Logo */}
            {classroom.logoImage && (
              <div className="mb-8">
                <Avatar className="h-24 w-24 mx-auto border-4 border-white/20 shadow-2xl">
                  <AvatarImage src={classroom.logoImage} alt={classroom.academyName} />
                  <AvatarFallback className="text-3xl bg-white/20 text-white backdrop-blur">
                    {(classroom.academyName || classroom.title).charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}

            <Badge 
              variant="outline" 
              className="mb-6 text-sm border-white/30 bg-white/10 text-white backdrop-blur"
            >
              {classroom.level} • {classroom.subject} Academy
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg animate-slide-up">
              {classroom.academyName || classroom.title}
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto drop-shadow animate-slide-up">
              {classroom.description || `Master ${classroom.subject} with expert guidance and personalized instruction`}
            </p>

            {/* Instruments Display */}
            {classroom.instruments && classroom.instruments.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 mb-12 animate-slide-up">
                {classroom.instruments.map((instrument: string, index: number) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-base py-2 px-4 bg-white/20 text-white border-white/20 backdrop-blur"
                  >
                    {instrument}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              {(!isMaster || previewMode) && (
                <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="lg" 
                      className="text-lg px-8 py-6 shadow-2xl transition-transform hover:scale-105"
                      style={{ backgroundColor: classroom.secondaryColor || '#10B981' }}
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      Start Your Musical Journey
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Join {classroom.academyName || classroom.title}</DialogTitle>
                      <DialogDescription>
                        Send a request to join this academy. The master will review your application.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleJoinSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Why would you like to join?</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell us about your musical goals and why you're interested in this academy..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="experience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Musical Experience (Optional)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., Beginner, 2 years piano, etc."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex gap-2">
                          <Button type="submit" disabled={joinClassroomMutation.isPending}>
                            {joinClassroomMutation.isPending ? "Sending..." : "Send Request"}
                          </Button>
                          <Button type="button" variant="outline" onClick={() => setJoinDialogOpen(false)}>
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              )}
              <Button variant="outline" size="lg" className="text-lg px-8 py-4" onClick={handleShare}>
                <Share2 className="mr-2 h-5 w-5" />
                Share Academy
              </Button>
              {isMaster && !previewMode && (
                <Link to="/master-dashboard">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                    <Settings className="mr-2 h-5 w-5" />
                    Manage Academy
                  </Button>
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up">
              <div className="text-center p-4 bg-card/80 backdrop-blur rounded-lg shadow-lg">
                <div className="text-2xl font-bold text-primary mb-1">{classroom.maxStudents || 50}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center">
                  <Users className="mr-1 h-4 w-4" />
                  Max Students
                </div>
              </div>
              <div className="text-center p-4 bg-card/80 backdrop-blur rounded-lg shadow-lg">
                <div className="text-2xl font-bold text-primary mb-1">{classroom.instruments?.length || 0}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center">
                  <Music className="mr-1 h-4 w-4" />
                  Instruments
                </div>
              </div>
              <div className="text-center p-4 bg-card/80 backdrop-blur rounded-lg shadow-lg">
                <div className="text-2xl font-bold text-primary mb-1">{classroom.level || 'All'}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center">
                  <Award className="mr-1 h-4 w-4" />
                  Level
                </div>
              </div>
              <div className="text-center p-4 bg-card/80 backdrop-blur rounded-lg shadow-lg">
                <div className="text-2xl font-bold text-primary mb-1">{new Date(classroom.createdAt).getFullYear()}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  Established
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {classroom.features && classroom.features.length > 0 ? 
                `Everything You Need to Master ${classroom.subject}` : 
                "Your Academy Features"
              }
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {classroom.features && classroom.features.length > 0 ? 
                "Our academy provides all the tools and support you need for your musical journey" :
                "Highlight what makes your academy special. Add features in the editor to showcase your offerings."
              }
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classroom.features && classroom.features.length > 0 ? (
              classroom.features.map((feature: string, index: number) => {
                const icons = [BookOpen, Users, Video, Music, Trophy, Star, Headphones, GraduationCap];
                const Icon = icons[index % icons.length];
                return (
                  <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{feature}</CardTitle>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })
            ) : (
              // Placeholder features
              [
                { name: "One-on-One Instruction", icon: Users },
                { name: "Group Classes", icon: BookOpen },
                { name: "Performance Opportunities", icon: Trophy },
                { name: "Music Theory Integration", icon: Music },
                { name: "Online Learning Support", icon: Video },
                { name: "Professional Equipment", icon: Headphones }
              ].map((feature, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 opacity-60">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg text-muted-foreground">{feature.name}</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground italic mt-2">
                      Add your academy features in the editor
                    </p>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                About {classroom.academyName || (
                  <span className="text-muted-foreground italic">Your Academy Name</span>
                )}
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                {classroom.about || classroom.description || (
                  <span className="italic">
                    Add your academy's story here. Tell students about your mission, teaching philosophy, and what makes your academy special. Click "Edit Page" to customize this content.
                  </span>
                )}
              </p>
              {classroom.curriculum ? (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Our Curriculum</h3>
                  <p className="text-muted-foreground">{classroom.curriculum}</p>
                </div>
              ) : (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-muted-foreground">Your Curriculum</h3>
                  <p className="text-muted-foreground italic">
                    Describe your teaching approach, curriculum structure, and learning outcomes here.
                  </p>
                </div>
              )}
              
              {/* Academy Founder */}
              <div className="flex items-center gap-4 mb-6">
                {masterProfile && (
                  <>
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={masterProfile.avatar} />
                      <AvatarFallback>
                        {masterProfile.firstName?.charAt(0)}{masterProfile.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{masterProfile.firstName} {masterProfile.lastName}</p>
                      <p className="text-sm text-muted-foreground">Academy Founder</p>
                    </div>
                  </>
                )}
              </div>

              {/* Academy Staff Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Our Teaching Staff</h3>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground italic">
                    Your academy teaching staff will be displayed here when mentors join your team.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              {classroom.aboutImage ? (
                <img 
                  src={classroom.aboutImage} 
                  alt="About our academy" 
                  className="rounded-lg shadow-2xl w-full h-96 object-cover"
                />
              ) : (
                <div className="bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-lg h-96 flex flex-col items-center justify-center text-center p-6">
                  <ImageIcon className="h-16 w-16 text-primary/40 mb-4" />
                  <p className="text-muted-foreground italic">
                    Add an image showcasing your academy, studio, or teaching environment here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-muted/50 to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              {parsedTestimonials.length > 0 ? "What Our Students Say" : "Student Testimonials"}
            </h2>
            <p className="text-xl text-muted-foreground">
              {parsedTestimonials.length > 0 ? 
                "Join the musicians who have transformed their skills with us" :
                "Student testimonials will appear here. Add them in the editor to showcase your success stories."
              }
            </p>
          </div>
          
          {parsedTestimonials.length > 0 ? (
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-6xl mx-auto"
            >
              <CarouselContent>
                {parsedTestimonials.map((testimonial: any, index: number) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card className="bg-card/80 backdrop-blur border-border/50 hover:shadow-lg transition-all duration-300 h-full">
                        <CardContent className="p-6">
                          <div className="flex items-center mb-4">
                            {[...Array(testimonial.rating || 5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <Quote className="h-8 w-8 text-primary/20 mb-4" />
                          <p className="text-muted-foreground mb-6 leading-relaxed">
                            {testimonial.text}
                          </p>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={testimonial.avatar} />
                              <AvatarFallback>
                                {testimonial.name.split(' ').map((n: string) => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{testimonial.name}</p>
                              <p className="text-sm text-muted-foreground">{testimonial.role || 'Student'}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((index) => (
                  <Card key={index} className="bg-card/80 backdrop-blur border-border/50 opacity-60">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <Quote className="h-8 w-8 text-primary/20 mb-4" />
                      <p className="text-muted-foreground mb-6 leading-relaxed italic">
                        "Add student testimonials here to showcase success stories and build trust with potential students."
                      </p>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>?</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-muted-foreground">Student Name</p>
                          <p className="text-sm text-muted-foreground">Student Role</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact and Pricing Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Contact Information</CardTitle>
                <CardDescription>Get in touch with our academy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {classroom.contactEmail && (
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <a href={`mailto:${classroom.contactEmail}`} className="text-primary hover:underline text-lg">
                        {classroom.contactEmail}
                      </a>
                    </div>
                  </div>
                )}
                {classroom.contactPhone && (
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <a href={`tel:${classroom.contactPhone}`} className="text-primary hover:underline text-lg">
                        {classroom.contactPhone}
                      </a>
                    </div>
                  </div>
                )}
                {classroom.website && (
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Website</p>
                      <a href={classroom.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-lg">
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
                {classroom.address && (
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">{classroom.address}</p>
                    </div>
                  </div>
                )}

                {/* Social Links */}
                {Object.keys(parsedSocialLinks).length > 0 && (
                  <div className="pt-6 border-t">
                    <p className="font-medium mb-4">Follow Us</p>
                    <div className="flex gap-3">
                      {parsedSocialLinks.instagram && (
                        <a href={parsedSocialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                          <Instagram className="h-5 w-5 text-primary" />
                        </a>
                      )}
                      {parsedSocialLinks.facebook && (
                        <a href={parsedSocialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                          <Facebook className="h-5 w-5 text-primary" />
                        </a>
                      )}
                      {parsedSocialLinks.twitter && (
                        <a href={parsedSocialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                          <Twitter className="h-5 w-5 text-primary" />
                        </a>
                      )}
                      {parsedSocialLinks.youtube && (
                        <a href={parsedSocialLinks.youtube} target="_blank" rel="noopener noreferrer" className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                          <Youtube className="h-5 w-5 text-primary" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <DollarSign className="h-6 w-6" />
                  Pricing Plans
                </CardTitle>
                <CardDescription>Choose the best plan for your musical journey</CardDescription>
              </CardHeader>
              <CardContent>
                {parsedPricing.length > 0 ? (
                  <div className="space-y-4">
                    {parsedPricing.map((price: any, index: number) => (
                      <div key={index} className="border rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-semibold">{price.name}</h3>
                            <p className="text-muted-foreground">{price.description}</p>
                          </div>
                          <Badge variant="outline" className="text-lg px-3 py-1">{price.price}</Badge>
                        </div>
                        {price.features && (
                          <ul className="space-y-2 mt-4">
                            {price.features.map((feature: string, featureIndex: number) => (
                              <li key={featureIndex} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[
                      { name: "Basic Plan", price: "$XX/month", description: "Perfect for beginners" },
                      { name: "Premium Plan", price: "$XX/month", description: "For serious students" },
                      { name: "Professional Plan", price: "$XX/month", description: "Advanced instruction" }
                    ].map((plan, index) => (
                      <div key={index} className="border rounded-xl p-6 opacity-60">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-semibold text-muted-foreground">{plan.name}</h3>
                            <p className="text-muted-foreground italic">{plan.description}</p>
                          </div>
                          <Badge variant="outline" className="text-lg px-3 py-1 text-muted-foreground">{plan.price}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground italic mt-4">
                          Add your pricing plans in the editor to show students your lesson options and rates.
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Musical Journey?</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join {classroom.academyName} today and transform your musical skills with personalized instruction from expert masters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isMaster && (
              <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                    <Heart className="mr-2 h-5 w-5" />
                    Join Academy Now
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Join {classroom.academyName}</DialogTitle>
                    <DialogDescription>
                      Send a request to join this academy. The master will review your application.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleJoinSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Why would you like to join?</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us about your musical goals and why you're interested in this academy..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Musical Experience (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Beginner, 2 years piano, etc."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex gap-2">
                        <Button type="submit" disabled={joinClassroomMutation.isPending}>
                          {joinClassroomMutation.isPending ? "Sending..." : "Send Request"}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setJoinDialogOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10" onClick={handleShare}>
              <Share2 className="mr-2 h-5 w-5" />
              Share Academy
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              {classroom.logoImage && (
                <Avatar className="h-12 w-12">
                  <AvatarImage src={classroom.logoImage} alt={classroom.academyName} />
                  <AvatarFallback>{classroom.academyName.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div>
                <h3 className="text-xl font-semibold">{classroom.academyName}</h3>
                <p className="text-muted-foreground">{classroom.subject} Academy</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {classroom.description || `Empowering musicians to reach their full potential through expert guidance and personalized instruction.`}
            </p>
            <div className="flex justify-center items-center gap-6 text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} {classroom.academyName}. All rights reserved.</p>
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                <span>Powered by HarmonyLearn</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}