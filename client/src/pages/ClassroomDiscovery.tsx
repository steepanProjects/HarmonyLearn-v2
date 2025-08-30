import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { 
  Music, 
  Users, 
  Star, 
  ExternalLink,
  Search,
  Filter,
  MapPin,
  Calendar,
  Heart,
  Send,
  BookOpen,
  Clock,
  CheckCircle,
  X,
  UserPlus
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { MentorNavigation } from "@/components/mentor/MentorNavigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertStaffRequestSchema, type Classroom, type StaffRequest } from "@shared/schema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const apiRequest = async (url: string, options?: { method: string; body?: string }) => {
  const response = await fetch(url, {
    method: options?.method || "GET",
    headers: {
      'Content-Type': 'application/json',
    },
    body: options?.body,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

const staffRequestFormSchema = insertStaffRequestSchema.extend({
  message: z.string().min(10, "Please provide a brief message").max(500, "Message too long"),
});

type StaffRequestFormData = z.infer<typeof staffRequestFormSchema>;

export default function ClassroomDiscovery() {
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInstrument, setSelectedInstrument] = useState<string>("all");
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const form = useForm<StaffRequestFormData>({
    resolver: zodResolver(staffRequestFormSchema),
    defaultValues: {
      mentorId: 0,
      classroomId: 0,
      message: "",
    },
  });

  // Update mentorId when user is available
  useEffect(() => {
    if (user?.id) {
      form.setValue("mentorId", user.id);
    }
  }, [user, form]);

  // Fetch all public classrooms for discovery
  const { data: publicClassrooms, isLoading: publicLoading } = useQuery({
    queryKey: ["/api/classrooms/public"],
  });

  // Fetch all classrooms for staff applications
  const { data: allClassrooms, isLoading: allLoading } = useQuery({
    queryKey: ["/api/classrooms"],
  });

  // Fetch mentor's staff requests
  const { data: staffRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ["/api/mentors", user?.id, "staff-requests"],
    queryFn: () => apiRequest(`/api/mentors/${user?.id}/staff-requests`),
    enabled: !!user?.id,
  });

  // Submit staff request mutation
  const submitRequestMutation = useMutation({
    mutationFn: (data: StaffRequestFormData) =>
      apiRequest("/api/staff-requests", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mentors", user?.id, "staff-requests"] });
      setRequestDialogOpen(false);
      setSelectedClassroom(null);
      form.reset();
      toast({
        title: "Success",
        description: "Staff request submitted successfully!",
      });
    },
    onError: (error: any) => {
      console.error('Staff request error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Get unique instruments for filtering
  const allInstruments = Array.isArray(publicClassrooms) 
    ? publicClassrooms.reduce((acc: string[], classroom: Classroom) => {
        if (classroom.instruments) {
          classroom.instruments.forEach((instrument: string) => {
            if (!acc.includes(instrument)) {
              acc.push(instrument);
            }
          });
        }
        return acc;
      }, []) 
    : [];

  // Filter classrooms based on search and instrument
  const filterClassrooms = (classrooms: Classroom[]) => {
    return classrooms.filter((classroom: Classroom) => {
      const matchesSearch = classroom.academyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           classroom.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           classroom.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesInstrument = selectedInstrument === "all" || 
                               classroom.instruments?.includes(selectedInstrument);
      return matchesSearch && matchesInstrument;
    });
  };

  const filteredPublicClassrooms = Array.isArray(publicClassrooms) ? filterClassrooms(publicClassrooms) : [];
  const filteredAllClassrooms = Array.isArray(allClassrooms) ? filterClassrooms(allClassrooms) : [];

  const handleStaffRequest = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    form.setValue("classroomId", classroom.id);
    setRequestDialogOpen(true);
  };

  const onSubmit = (data: StaffRequestFormData) => {
    if (selectedClassroom) {
      const requestData = {
        ...data,
        mentorId: user?.id || 0,
        classroomId: selectedClassroom.id,
      };
      
      console.log('Submitting staff request data:', requestData);
      console.log('Current user:', user);
      console.log('Selected classroom:', selectedClassroom);
      
      submitRequestMutation.mutate(requestData);
    }
  };

  const getRequestStatus = (classroomId: number) => {
    const requests = staffRequests as StaffRequest[] || [];
    return requests.find(r => r.classroomId === classroomId);
  };

  const renderClassroomCard = (classroom: Classroom, showStaffOption: boolean = false) => {
    const existingRequest = getRequestStatus(classroom.id);
    
    return (
      <Card key={classroom.id} className="group hover:shadow-lg transition-all duration-200">
        <CardContent className="p-0">
          {/* Hero Section */}
          <div 
            className="h-40 relative rounded-t-lg"
            style={{
              backgroundColor: classroom.primaryColor || '#3B82F6',
              backgroundImage: classroom.heroImage ? `url(${classroom.heroImage})` : 
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/20 rounded-t-lg" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-3">
                {classroom.logoImage && (
                  <Avatar className="h-10 w-10 border-2 border-white">
                    <AvatarImage src={classroom.logoImage} alt={classroom.academyName || classroom.title} />
                    <AvatarFallback className="text-xs">
                      {(classroom.academyName || classroom.title)?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">
                    {classroom.academyName || classroom.title}
                  </h3>
                  <p className="text-xs text-white/90 truncate">
                    {classroom.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* About */}
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {classroom.about || classroom.description || "Discover your musical potential with expert guidance and personalized instruction."}
            </p>

            {/* Instruments & Subject */}
            <div className="flex flex-wrap gap-1 mb-4">
              {classroom.subject && (
                <Badge variant="default" className="text-xs">
                  {classroom.subject}
                </Badge>
              )}
              {classroom.instruments?.slice(0, 2).map((instrument: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {instrument}
                </Badge>
              ))}
              {classroom.instruments && classroom.instruments.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{classroom.instruments.length - 2} more
                </Badge>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>Max {classroom.maxStudents}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{classroom.isActive ? "Active" : "Inactive"}</span>
              </div>
              {classroom.level && (
                <div className="text-xs">
                  Level: {classroom.level}
                </div>
              )}
            </div>

            {/* Location */}
            {classroom.address && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{classroom.address}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button asChild size="sm" className="flex-1">
                <Link href={`/academy/${classroom.customSlug || classroom.id}`}>
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Visit Academy
                </Link>
              </Button>
              
              {showStaffOption && (
                <>
                  {existingRequest ? (
                    <Badge 
                      variant={
                        existingRequest.status === 'approved' ? 'default' : 
                        existingRequest.status === 'rejected' ? 'destructive' : 'secondary'
                      }
                      className="px-3 py-1 text-xs"
                    >
                      {existingRequest.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {existingRequest.status === 'rejected' && <X className="h-3 w-3 mr-1" />}
                      {existingRequest.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                      {existingRequest.status}
                    </Badge>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStaffRequest(classroom)}
                      disabled={!classroom.isActive}
                    >
                      <UserPlus className="h-3 w-3 mr-1" />
                      Join Staff
                    </Button>
                  )}
                </>
              )}
              
              <Button variant="outline" size="sm">
                <Heart className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <MentorNavigation currentUser={user} />
        
        <main className="flex-1 min-w-0 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Discover Music Academies</h1>
              <p className="text-muted-foreground">
                Explore amazing music academies - visit as a guest or apply to join as staff
              </p>
            </div>

            {/* Filters */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search academies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Select value={selectedInstrument} onValueChange={setSelectedInstrument}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by instrument" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Instruments</SelectItem>
                      {allInstruments.map((instrument: string) => (
                        <SelectItem key={instrument} value={instrument}>
                          {instrument}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Tabs defaultValue="discover" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="discover" className="text-sm font-medium">Discover Academies</TabsTrigger>
                <TabsTrigger value="staff" className="text-sm font-medium">Staff Opportunities</TabsTrigger>
              </TabsList>
              
              <TabsContent value="discover" className="space-y-6 mt-0">
                {/* Loading State */}
                {publicLoading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                          <div className="h-20 bg-muted rounded mb-4"></div>
                          <div className="flex gap-2 mb-4">
                            <div className="h-6 bg-muted rounded w-16"></div>
                            <div className="h-6 bg-muted rounded w-20"></div>
                          </div>
                          <div className="h-8 bg-muted rounded"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Academies Grid */}
                {!publicLoading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPublicClassrooms.map((classroom: Classroom) => 
                      renderClassroomCard(classroom, false)
                    )}
                  </div>
                )}

                {/* Empty State */}
                {!publicLoading && filteredPublicClassrooms.length === 0 && (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No Academies Found</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchTerm || selectedInstrument !== "all" 
                          ? "Try adjusting your search filters" 
                          : "Be the first to create an academy!"}
                      </p>
                      {searchTerm || selectedInstrument !== "all" ? (
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSearchTerm("");
                            setSelectedInstrument("all");
                          }}
                        >
                          Clear Filters
                        </Button>
                      ) : null}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="staff" className="space-y-6 mt-0">
                {/* Current Requests Section */}
                {staffRequests && (staffRequests as StaffRequest[]).length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Your Staff Requests</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                      {(staffRequests as StaffRequest[]).map((request: StaffRequest) => {
                        const classroom = (allClassrooms as Classroom[])?.find(c => c.id === request.classroomId);
                        return (
                          <Card key={request.id} className="border-l-4 border-l-blue-500">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg flex items-center justify-between">
                                {classroom?.title}
                                <Badge 
                                  variant={
                                    request.status === 'approved' ? 'default' : 
                                    request.status === 'rejected' ? 'destructive' : 'secondary'
                                  }
                                >
                                  {request.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                                  {request.status === 'rejected' && <X className="h-3 w-3 mr-1" />}
                                  {request.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                                  {request.status}
                                </Badge>
                              </CardTitle>
                              <CardDescription>
                                Submitted: {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "Unknown"}
                              </CardDescription>
                            </CardHeader>
                            {request.adminNotes && (
                              <CardContent>
                                <div className="text-sm bg-muted p-3 rounded-md">
                                  <strong>Notes: </strong>{request.adminNotes}
                                </div>
                              </CardContent>
                            )}
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Staff Opportunities */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Staff Opportunities</h2>
                  
                  {allLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                          <CardContent className="p-6">
                            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                            <div className="h-20 bg-muted rounded mb-4"></div>
                            <div className="h-8 bg-muted rounded"></div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {!allLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredAllClassrooms.map((classroom: Classroom) => 
                        renderClassroomCard(classroom, true)
                      )}
                    </div>
                  )}

                  {!allLoading && filteredAllClassrooms.length === 0 && (
                    <Card className="text-center py-12">
                      <CardContent>
                        <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">No Staff Opportunities Found</h3>
                        <p className="text-muted-foreground mb-4">
                          {searchTerm || selectedInstrument !== "all" 
                            ? "Try adjusting your search filters" 
                            : "There are currently no classrooms accepting staff requests"}
                        </p>
                        {searchTerm || selectedInstrument !== "all" ? (
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setSearchTerm("");
                              setSelectedInstrument("all");
                            }}
                          >
                            Clear Filters
                          </Button>
                        ) : null}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Request Dialog */}
            <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Request to Join Staff</DialogTitle>
                  <DialogDescription>
                    Send a request to join "{selectedClassroom?.title}" as a staff member
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message to Master</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Please explain why you'd like to join this classroom as staff and what you can contribute..."
                              {...field} 
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setRequestDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={submitRequestMutation.isPending}>
                        {submitRequestMutation.isPending ? "Submitting..." : "Submit Request"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
}