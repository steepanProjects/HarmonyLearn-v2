import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Search, Filter, MapPin, Users, Star, Clock, BookOpen, Music, 
  GraduationCap, Award, Heart, ExternalLink, ChevronRight, 
  Piano, Guitar, Drum, Mic, Video, Calendar, Crown, Shield,
  TrendingUp, Sparkles, Target, Trophy, MessageSquare, Eye,
  CheckCircle
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Academy {
  id: number;
  title: string;
  academyName: string;
  description: string;
  about: string;
  masterName: string;
  masterId: number;
  subject: string;
  level: string;
  instruments: string[];
  features: string[];
  heroImage: string;
  logoImage: string;
  primaryColor: string;
  secondaryColor: string;
  currentStudents: number;
  maxStudents: number;
  rating: number;
  totalReviews: number;
  contactEmail: string;
  contactPhone: string;
  website: string;
  address: string;
  pricing: string;
  customSlug: string;
  slug: string;
  isPublic: boolean;
  staffCount: number;
  sessionCount: number;
  graduationRate: number;
}

export default function AcademyDiscovery() {
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInstrument, setSelectedInstrument] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedAcademy, setSelectedAcademy] = useState<Academy | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  // Fetch public academies
  const { data: academies = [], isLoading: academiesLoading } = useQuery({
    queryKey: ["/api/classrooms", "public"],
    queryFn: () => apiRequest("/api/classrooms?public=true"),
  });

  // Fetch user's academy memberships to show joined status
  const { data: userMemberships = [] } = useQuery({
    queryKey: ["/api/classroom-memberships", user?.id],
    queryFn: () => apiRequest(`/api/classroom-memberships?userId=${user?.id}`),
    enabled: !!user?.id,
  });

  // Join academy mutation
  const joinAcademyMutation = useMutation({
    mutationFn: (academyId: number) => 
      apiRequest(`/api/classrooms/${academyId}/join`, {
        method: "POST",
        body: JSON.stringify({ 
          userId: user?.id,
          message: "Requesting to join this academy as a student",
          experience: "Beginner to intermediate level"
        })
      }),
    onSuccess: () => {
      toast({ 
        title: "Join Request Submitted!", 
        description: "Your request to join this academy has been sent to the master for review. You'll be notified once it's approved."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/classroom-memberships"] });
    },
    onError: () => {
      toast({ 
        title: "Failed to send join request", 
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive" 
      });
    }
  });

  // Filter and sort academies
  const filteredAcademies = academies
    .filter((academy: Academy) => {
      const matchesSearch = academy.academyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           academy.masterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           academy.subject?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesInstrument = selectedInstrument === "all" || 
                               academy.instruments?.includes(selectedInstrument);
      const matchesLevel = selectedLevel === "all" || academy.level === selectedLevel;
      return matchesSearch && matchesInstrument && matchesLevel;
    })
    .sort((a: Academy, b: Academy) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "students":
          return (b.currentStudents || 0) - (a.currentStudents || 0);
        case "newest":
          return (b.id || 0) - (a.id || 0);
        default:
          return 0;
      }
    });

  const getInstrumentIcon = (instrument: string) => {
    switch (instrument.toLowerCase()) {
      case 'piano': return <Piano className="h-4 w-4" />;
      case 'guitar': return <Guitar className="h-4 w-4" />;
      case 'drums': return <Drum className="h-4 w-4" />;
      case 'vocals': return <Mic className="h-4 w-4" />;
      default: return <Music className="h-4 w-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserMembershipStatus = (academyId: number) => {
    const membership = userMemberships.find((m: any) => m.classroomId === academyId);
    return membership?.status || null;
  };

  const isUserJoined = (academyId: number) => {
    return getUserMembershipStatus(academyId) === "active";
  };

  const hasUserRequested = (academyId: number) => {
    return getUserMembershipStatus(academyId) === "pending";
  };

  if (academiesLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Discovering amazing academies...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Discover Music Academies</h1>
              <p className="text-muted-foreground">
                Find the perfect music academy to enhance your learning journey
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                Grid
              </Button>
              <Button 
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search academies, masters, or instruments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedInstrument} onValueChange={setSelectedInstrument}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select instrument" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Instruments</SelectItem>
                <SelectItem value="Piano">Piano</SelectItem>
                <SelectItem value="Guitar">Guitar</SelectItem>
                <SelectItem value="Drums">Drums</SelectItem>
                <SelectItem value="Vocals">Vocals</SelectItem>
                <SelectItem value="Violin">Violin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="students">Most Students</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{filteredAcademies.length}</div>
                <div className="text-sm text-muted-foreground">Academies Available</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredAcademies.reduce((sum: number, a: Academy) => sum + (a.currentStudents || 0), 0)}
                </div>
                <div className="text-sm text-muted-foreground">Active Students</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {filteredAcademies.filter((a: Academy) => a.rating >= 4.5).length}
                </div>
                <div className="text-sm text-muted-foreground">Top Rated</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {new Set(filteredAcademies.flatMap((a: Academy) => a.instruments || [])).size}
                </div>
                <div className="text-sm text-muted-foreground">Instruments Taught</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Academies Grid/List */}
        {filteredAcademies.length > 0 ? (
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
            {filteredAcademies.map((academy: Academy) => (
              <Card key={academy.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Academy Image/Header */}
                <div 
                  className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative"
                  style={{ 
                    background: academy.heroImage ? `url(${academy.heroImage})` : 
                               `linear-gradient(to right, ${academy.primaryColor || '#3B82F6'}, ${academy.secondaryColor || '#8B5CF6'})`
                  }}
                >
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {academy.logoImage ? (
                        <img src={academy.logoImage} alt="Logo" className="w-10 h-10 rounded-full bg-white p-1" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Music className="h-5 w-5 text-white" />
                        </div>
                      )}
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        <Crown className="h-3 w-3 mr-1" />
                        Master Academy
                      </Badge>
                    </div>
                    <Badge className={getLevelColor(academy.level)}>
                      {academy.level}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {academy.academyName || academy.title}
                    </h3>
                    <p className="text-white/80 text-sm">
                      by {academy.masterName}
                    </p>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Academy Info */}
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {academy.about || academy.description}
                    </p>

                    {/* Instruments */}
                    <div className="flex flex-wrap gap-2">
                      {academy.instruments?.slice(0, 3).map((instrument, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {getInstrumentIcon(instrument)}
                          <span className="ml-1">{instrument}</span>
                        </Badge>
                      ))}
                      {academy.instruments?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{academy.instruments.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="flex items-center justify-center gap-1 text-sm font-medium">
                          <Users className="h-4 w-4" />
                          {academy.currentStudents || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">Students</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1 text-sm font-medium">
                          <Star className="h-4 w-4 text-yellow-500" />
                          {academy.rating || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">Rating</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1 text-sm font-medium">
                          <Shield className="h-4 w-4" />
                          {academy.staffCount || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">Staff</div>
                      </div>
                    </div>

                    {/* Progress Bar for Capacity */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Capacity</span>
                        <span>{academy.currentStudents || 0}/{academy.maxStudents || 50}</span>
                      </div>
                      <Progress 
                        value={((academy.currentStudents || 0) / (academy.maxStudents || 50)) * 100} 
                        className="h-2"
                      />
                    </div>

                    {/* Features */}
                    {academy.features?.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Key Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {academy.features.slice(0, 2).map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      {isUserJoined(academy.id) ? (
                        <Button disabled className="flex-1 bg-green-100 text-green-800 hover:bg-green-100">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Member
                        </Button>
                      ) : hasUserRequested(academy.id) ? (
                        <Button disabled className="flex-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                          <Clock className="h-4 w-4 mr-2" />
                          Request Pending
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => joinAcademyMutation.mutate(academy.id)}
                          disabled={joinAcademyMutation.isPending}
                          className="flex-1"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Request to Join
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(`/academy/${academy.customSlug || academy.academyName?.toLowerCase().replace(/\s+/g, '-')}`, '_blank')}
                        title="View Landing Page"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedAcademy(academy)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Music className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Academies Found</h3>
            <p className="text-muted-foreground">Try adjusting your search filters to find more academies.</p>
          </div>
        )}

        {/* Academy Detail Modal */}
        {selectedAcademy && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">
                      {selectedAcademy.academyName || selectedAcademy.title}
                    </CardTitle>
                    <CardDescription>
                      Master: {selectedAcademy.masterName}
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedAcademy(null)}
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                    <TabsTrigger value="staff">Staff</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">About the Academy</h3>
                      <p className="text-muted-foreground">
                        {selectedAcademy.about || selectedAcademy.description}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-1">Level</h4>
                        <Badge className={getLevelColor(selectedAcademy.level)}>
                          {selectedAcademy.level}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Subject</h4>
                        <p className="text-sm">{selectedAcademy.subject}</p>
                      </div>
                    </div>

                    {selectedAcademy.features?.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Features</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedAcademy.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <Sparkles className="h-4 w-4 text-yellow-500" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="curriculum">
                    <div>
                      <h3 className="font-semibold mb-2">Instruments Taught</h3>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {selectedAcademy.instruments?.map((instrument, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 border rounded">
                            {getInstrumentIcon(instrument)}
                            <span>{instrument}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="staff">
                    <div className="text-center py-8">
                      <Shield className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">Staff information will be available after joining.</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="contact">
                    <div className="space-y-4">
                      {selectedAcademy.contactEmail && (
                        <div>
                          <h4 className="font-medium mb-1">Email</h4>
                          <p className="text-sm">{selectedAcademy.contactEmail}</p>
                        </div>
                      )}
                      {selectedAcademy.contactPhone && (
                        <div>
                          <h4 className="font-medium mb-1">Phone</h4>
                          <p className="text-sm">{selectedAcademy.contactPhone}</p>
                        </div>
                      )}
                      {selectedAcademy.address && (
                        <div>
                          <h4 className="font-medium mb-1">Address</h4>
                          <p className="text-sm">{selectedAcademy.address}</p>
                        </div>
                      )}
                      {selectedAcademy.website && (
                        <div>
                          <h4 className="font-medium mb-1">Website</h4>
                          <a 
                            href={selectedAcademy.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {selectedAcademy.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-2 pt-4 border-t">
                  {isUserJoined(selectedAcademy.id) ? (
                    <Button disabled className="flex-1">
                      <Users className="h-4 w-4 mr-2" />
                      Already Joined
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => {
                        joinAcademyMutation.mutate(selectedAcademy.id);
                        setSelectedAcademy(null);
                      }}
                      disabled={joinAcademyMutation.isPending}
                      className="flex-1"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Join This Academy
                    </Button>
                  )}
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedAcademy(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}