import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, Star, BookOpen, Video, Calendar, MessageSquare, Award, 
  TrendingUp, Clock, Crown, Shield, ExternalLink, Play, FileText,
  Music, GraduationCap, Target, Sparkles, CheckCircle, AlertCircle
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

interface AcademyMembership {
  id: number;
  classroomId: number;
  role: string;
  status: string;
  joinedAt: string;
  progress: number;
  classroomTitle: string;
  classroomDescription: string;
  masterName: string;
  academyName: string;
  subject: string;
  level: string;
  instruments: string[];
  currentStudents: number;
  maxStudents: number;
  heroImage: string;
  primaryColor: string;
  secondaryColor: string;
  customSlug: string;
}

export default function MyAcademies() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  // Fetch user's academy memberships
  const { data: memberships = [], isLoading: membershipsLoading } = useQuery({
    queryKey: ["/api/classroom-memberships", user?.id],
    queryFn: () => apiRequest(`/api/classroom-memberships?userId=${user?.id}`),
    enabled: !!user?.id,
  });

  // Fetch detailed academy information for each membership
  const { data: academyDetails = [] } = useQuery({
    queryKey: ["/api/academies", "details", memberships],
    queryFn: async () => {
      if (memberships.length === 0) return [];
      
      const details = await Promise.all(
        memberships.map(async (membership: any) => {
          try {
            const classroom = await apiRequest(`/api/classrooms/${membership.classroomId}`);
            return { ...membership, ...classroom };
          } catch (error) {
            return membership;
          }
        })
      );
      return details;
    },
    enabled: memberships.length > 0,
  });

  // Fetch user's upcoming sessions
  const { data: upcomingSessions = [] } = useQuery({
    queryKey: ["/api/live-sessions", "upcoming", user?.id],
    queryFn: () => apiRequest(`/api/live-sessions?student=${user?.id}&upcoming=true`),
    enabled: !!user?.id,
  });

  // Separate memberships by status
  const activeMemberships = academyDetails.filter((m: AcademyMembership) => m.status === 'active');
  const pendingMemberships = academyDetails.filter((m: AcademyMembership) => m.status === 'pending');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'removed': return 'bg-red-100 text-red-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'Active Member';
      case 'pending': return 'Request Pending';
      case 'removed': return 'Access Removed';
      case 'rejected': return 'Request Rejected';
      default: return status;
    }
  };

  const getInstrumentIcon = (instrument: string) => {
    switch (instrument.toLowerCase()) {
      case 'piano': return '🎹';
      case 'guitar': return '🎸';
      case 'drums': return '🥁';
      case 'vocals': return '🎤';
      case 'violin': return '🎻';
      default: return '🎵';
    }
  };

  if (membershipsLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading your academies...</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Academies</h1>
              <p className="text-muted-foreground">
                Track your learning journey across all joined academies
              </p>
            </div>
            <Link href="/academy-discovery">
              <Button>
                <Sparkles className="h-4 w-4 mr-2" />
                Discover More
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Crown className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{activeMemberships.length}</p>
                  <p className="text-sm text-muted-foreground">Active Academies</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{pendingMemberships.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Video className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{upcomingSessions.length}</p>
                  <p className="text-sm text-muted-foreground">Upcoming Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {activeMemberships.length > 0 ? 
                      Math.round(activeMemberships.reduce((sum: number, m: AcademyMembership) => sum + (m.progress || 0), 0) / activeMemberships.length) : 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Active Academies ({activeMemberships.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Applications ({pendingMemberships.length})
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Upcoming Sessions ({upcomingSessions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {activeMemberships.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeMemberships.map((membership: AcademyMembership) => (
                  <Card key={membership.id} className="overflow-hidden">
                    {/* Academy Header */}
                    <div 
                      className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative"
                      style={{ 
                        background: membership.heroImage ? `url(${membership.heroImage})` : 
                                   `linear-gradient(to right, ${membership.primaryColor || '#3B82F6'}, ${membership.secondaryColor || '#8B5CF6'})`
                      }}
                    >
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          <Crown className="h-3 w-3 mr-1" />
                          {membership.academyName || membership.classroomTitle}
                        </Badge>
                        <Badge className={getStatusColor(membership.status)}>
                          {getStatusText(membership.status)}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-lg font-bold text-white">
                          {membership.subject}
                        </h3>
                        <p className="text-white/80 text-sm">
                          Master: {membership.masterName}
                        </p>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Progress */}
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium">Your Progress</span>
                            <span>{membership.progress || 0}%</span>
                          </div>
                          <Progress value={membership.progress || 0} className="h-2" />
                        </div>

                        {/* Instruments */}
                        {membership.instruments?.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Instruments</h4>
                            <div className="flex flex-wrap gap-2">
                              {membership.instruments.map((instrument, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <span className="mr-1">{getInstrumentIcon(instrument)}</span>
                                  {instrument}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Academy Stats */}
                        <div className="grid grid-cols-3 gap-4 text-center text-sm">
                          <div>
                            <div className="font-medium">{membership.level}</div>
                            <div className="text-muted-foreground">Level</div>
                          </div>
                          <div>
                            <div className="font-medium">{membership.currentStudents || 0}</div>
                            <div className="text-muted-foreground">Students</div>
                          </div>
                          <div>
                            <div className="font-medium">
                              {new Date(membership.joinedAt).toLocaleDateString()}
                            </div>
                            <div className="text-muted-foreground">Joined</div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-4 border-t">
                          <Button variant="outline" size="sm" className="flex-1">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Continue Learning
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(`/academy/${membership.customSlug || membership.academyName?.toLowerCase().replace(/\s+/g, '-')}`, '_blank')}
                            title="View Landing Page"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Crown className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No Active Academies</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't joined any academies yet. Discover amazing academies to start your learning journey.
                </p>
                <Link href="/academy-discovery">
                  <Button>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Discover Academies
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            {pendingMemberships.length > 0 ? (
              <div className="space-y-4">
                {pendingMemberships.map((membership: AcademyMembership) => (
                  <Card key={membership.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                            <Crown className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{membership.academyName || membership.classroomTitle}</h3>
                            <p className="text-sm text-muted-foreground">
                              Master: {membership.masterName} • {membership.subject}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(membership.status)}>
                            <Clock className="h-3 w-3 mr-1" />
                            Pending Review
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            Applied {new Date(membership.joinedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No Pending Applications</h3>
                <p className="text-muted-foreground">
                  All your academy applications have been processed.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            {upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {upcomingSessions.map((session: any) => (
                  <Card key={session.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <Video className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{session.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {session.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-medium">
                              {new Date(session.scheduledAt).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(session.scheduledAt).toLocaleTimeString()}
                            </div>
                          </div>
                          <Button size="sm">
                            <Play className="h-4 w-4 mr-2" />
                            Join
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No Upcoming Sessions</h3>
                <p className="text-muted-foreground">
                  Check back later for scheduled academy sessions.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}