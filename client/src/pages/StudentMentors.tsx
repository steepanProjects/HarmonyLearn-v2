import { useState } from "react";
import { Star, MapPin, Clock, Video, Calendar, MessageCircle, Award, TrendingUp, UserCheck, Filter, Search, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
// Create apiRequest function inline since it doesn't exist yet
const apiRequest = async (url: string, options: { method: string; body: any }) => {
  const response = await fetch(url, {
    method: options.method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options.body),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('API Error:', response.status, errorData);
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};
// Define extended mentor type with user data
interface MentorWithUser {
  id: number;
  userId: number | null;
  firstName: string | null;
  lastName: string | null;
  specialization: string | null;
  experience: string | null;
  hourlyRate: string | null;
  location: string | null;
  languages: string[] | null;
  badges: any;
  bio: string | null;
  availability: any;
  totalStudents: number | null;
  totalReviews: number | null;
  averageRating: string | null;
  nextAvailableSession: any;
  isVerified: boolean | null;
  createdAt: Date | null;
}
import { EmptyState } from "@/components/EmptyState";
import { MentorCardSkeleton, LoadingGrid } from "@/components/LoadingSkeletons";

// Form schema for mentorship request
const mentorshipRequestSchema = z.object({
  message: z.string().min(10, "Please provide a detailed message (at least 10 characters)").max(500, "Message too long"),
});

type MentorshipRequestForm = z.infer<typeof mentorshipRequestSchema>;

export const StudentMentors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [selectedMentor, setSelectedMentor] = useState<MentorWithUser | null>(null);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user from localStorage
  const [currentUser] = useState(() => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  });

  const { data: mentors, isLoading, error } = useQuery<MentorWithUser[]>({
    queryKey: ['/api/mentors'],
  });

  // Form for mentorship request
  const form = useForm<MentorshipRequestForm>({
    resolver: zodResolver(mentorshipRequestSchema),
    defaultValues: {
      message: "",
    },
  });

  // Mutation for creating mentorship request
  const createRequestMutation = useMutation({
    mutationFn: async (data: { mentorId: number; studentId: number; message: string }) => {
      console.log('API Request data:', data);
      return apiRequest(`/api/mentorship-requests`, {
        method: "POST",
        body: data,
      });
    },
    onSuccess: () => {
      toast({
        title: "Request Sent!",
        description: "Your mentorship request has been sent successfully. The mentor will be notified.",
      });
      setRequestDialogOpen(false);
      form.reset();
      setSelectedMentor(null);
      // Optionally refetch mentorship requests
      queryClient.invalidateQueries({ queryKey: ['/api/mentorship-requests'] });
    },
    onError: (error: any) => {
      console.error('Mentorship request error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send mentorship request. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Filter and sort mentors based on search and filters
  const filteredMentors = mentors?.filter(mentor => {
    const matchesSearch = mentor.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = selectedSpecialization === "all" || 
                                 mentor.specialization?.toLowerCase().includes(selectedSpecialization.toLowerCase());
    return matchesSearch && matchesSpecialization;
  }).sort((a, b) => {
    if (sortBy === "rating") return (parseFloat(b.averageRating || "0") - parseFloat(a.averageRating || "0"));
    if (sortBy === "price") return (parseFloat(a.hourlyRate || "0") - parseFloat(b.hourlyRate || "0"));
    if (sortBy === "experience") return (b.totalStudents || 0) - (a.totalStudents || 0);
    return 0;
  });

  const specializations = ["Piano", "Guitar", "Violin", "Drums", "Voice", "Jazz", "Classical"];

  const handleRequestMentorship = (mentor: MentorWithUser) => {
    if (!currentUser) {
      toast({
        title: "Please Sign In",
        description: "You need to be signed in to request mentorship.",
        variant: "destructive",
      });
      return;
    }
    setSelectedMentor(mentor);
    setRequestDialogOpen(true);
  };

  const handleSendMessage = (mentorId: number) => {
    if (!currentUser) {
      toast({
        title: "Please Sign In",
        description: "You need to be signed in to message mentors.",
        variant: "destructive",
      });
      return;
    }
    // Navigate to mentor interactions page
    window.location.href = `/mentor-interactions`;
  };

  const onSubmitRequest = async (data: MentorshipRequestForm) => {
    if (!currentUser || !selectedMentor) {
      console.error('Missing user or mentor data');
      return;
    }
    
    if (!selectedMentor.userId) {
      console.error('Selected mentor missing userId');
      toast({
        title: "Error",
        description: "Invalid mentor data. Please try selecting the mentor again.",
        variant: "destructive",
      });
      return;
    }
    
    const requestData = {
      mentorId: selectedMentor.userId,
      studentId: typeof currentUser.id === 'string' ? parseInt(currentUser.id) : currentUser.id,
      message: data.message,
    };
    
    console.log('Submitting mentorship request:', {
      ...requestData,
      selectedMentor
    });
    
    createRequestMutation.mutate(requestData);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Your Perfect Mentor</h1>
          <p className="text-muted-foreground">
            Loading expert musicians and teachers...
          </p>
        </div>
        <LoadingGrid count={6} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MentorCardSkeleton />
        </LoadingGrid>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-20">
          <div className="text-lg text-red-600">Error loading mentors. Please try again later.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Your Perfect Mentor</h1>
        <p className="text-muted-foreground">
          Connect with expert musicians for personalized lessons and guidance
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by instrument, style, or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Instruments</SelectItem>
                {specializations.map(spec => (
                  <SelectItem key={spec} value={spec.toLowerCase()}>{spec}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price">Lowest Price</SelectItem>
                <SelectItem value="experience">Most Experienced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Mentors Grid */}
      {filteredMentors && filteredMentors.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <Card key={mentor.id} className="group hover:shadow-musical transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                {/* Mentor Header */}
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg font-semibold bg-gradient-hero text-white">
                      {mentor.specialization?.charAt(0) || "M"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {mentor.firstName && mentor.lastName 
                        ? `${mentor.firstName} ${mentor.lastName}`
                        : `${mentor.specialization?.split(',')[0]?.trim() || 'Music'} Mentor`
                      }
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="h-4 w-4 fill-secondary text-secondary" />
                      <span className="font-medium">{mentor.averageRating || "4.8"}</span>
                      <span className="text-muted-foreground text-sm">
                        ({mentor.totalReviews || 0} reviews)
                      </span>
                    </div>
                    {mentor.location && (
                      <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {mentor.location}
                      </div>
                    )}
                  </div>
                </div>

                {/* Specialization Tags */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {mentor.specialization?.split(',').map((spec, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {spec.trim()}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    {mentor.totalStudents || 0} students taught
                  </div>
                </div>

                {/* Bio */}
                {mentor.bio && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {mentor.bio}
                  </p>
                )}

                {/* Experience & Languages */}
                <div className="space-y-2 mb-4 text-sm">
                  {mentor.experience && (
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      <span>{mentor.experience}</span>
                    </div>
                  )}
                  {mentor.languages && mentor.languages.length > 0 && (
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-primary" />
                      <span>Speaks: {mentor.languages.join(', ')}</span>
                    </div>
                  )}
                </div>

                {/* Pricing & Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-lg font-bold text-primary">
                    ${mentor.hourlyRate || 50}/hour
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSendMessage(mentor.id)}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      className="shadow-musical"
                      onClick={() => handleRequestMentorship(mentor)}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Request
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={UserCheck}
          title="No Mentors Found"
          description="Try adjusting your search terms or filters to find the perfect mentor for your musical journey."
          actionText="Clear Filters"
          onAction={() => {
            setSearchTerm("");
            setSelectedSpecialization("all");
            setSortBy("rating");
          }}
        />
      )}

      {/* Stats Section */}
      {filteredMentors && filteredMentors.length > 0 && (
        <div className="mt-12 p-6 bg-muted/30 rounded-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{filteredMentors.length}</div>
              <div className="text-sm text-muted-foreground">Expert Mentors</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {filteredMentors.reduce((sum, mentor) => sum + (mentor.totalStudents || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Students Taught</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {(filteredMentors.reduce((sum, mentor) => sum + parseFloat(mentor.averageRating || "0"), 0) / filteredMentors.length).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Support Available</div>
            </div>
          </div>
        </div>
      )}

      {/* Mentorship Request Dialog */}
      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request Mentorship</DialogTitle>
            <DialogDescription>
              Send a mentorship request to {selectedMentor?.firstName && selectedMentor?.lastName 
                ? `${selectedMentor.firstName} ${selectedMentor.lastName}`
                : 'this mentor'
              }. Tell them about your musical goals and why you'd like their guidance.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitRequest)} className="space-y-4">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Hi! I'm interested in learning [instrument/skill] and would love to have you as my mentor. My current level is... My goals are..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Introduce yourself and explain what you hope to achieve through mentorship.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRequestDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createRequestMutation.isPending}
                  className="shadow-musical"
                >
                  {createRequestMutation.isPending ? "Sending..." : "Send Request"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentMentors;