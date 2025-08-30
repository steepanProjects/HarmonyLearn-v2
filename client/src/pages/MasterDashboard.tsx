import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Users, Settings, Calendar, BookOpen, UserCheck, Clock, AlertCircle, Crown, Music, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser } from "@/lib/auth";
import { AcademyCreationForm } from "@/components/classroom/AcademyCreationForm";
import ResignationRequestManager from "@/components/ResignationRequestManager";
import { type Classroom, type StaffRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

export default function MasterDashboard() {
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  // Fetch master's classrooms
  const { data: classrooms, isLoading: classroomsLoading } = useQuery({
    queryKey: ["/api/classrooms", { master: user?.id }],
    queryFn: () => apiRequest(`/api/classrooms?master=${user?.id}`),
    enabled: !!user?.id,
  });

  // Fetch pending staff requests for master's classrooms
  const { data: staffRequests, isLoading: staffRequestsLoading } = useQuery({
    queryKey: ["/api/staff-requests", "pending"],
    queryFn: () => apiRequest("/api/staff-requests?status=pending"),
    enabled: !!user?.id,
  });

  // Approve staff request mutation
  const approveStaffRequestMutation = useMutation({
    mutationFn: (requestId: number) => 
      apiRequest(`/api/staff-requests/${requestId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ 
          status: "approved",
          reviewedBy: user?.id 
        }),
      }),
    onSuccess: () => {
      toast({
        title: "Request Approved",
        description: "The staff request has been approved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/staff-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/classrooms"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve request",
        variant: "destructive",
      });
    },
  });

  // Reject staff request mutation
  const rejectStaffRequestMutation = useMutation({
    mutationFn: ({ requestId, notes }: { requestId: number; notes?: string }) => 
      apiRequest(`/api/staff-requests/${requestId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ 
          status: "rejected",
          reviewedBy: user?.id,
          adminNotes: notes 
        }),
      }),
    onSuccess: () => {
      toast({
        title: "Request Rejected",
        description: "The staff request has been rejected.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/staff-requests"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject request",
        variant: "destructive",
      });
    },
  });

  const handleAcademyCreated = () => {
    setCreateDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ["/api/classrooms"] });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Crown className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold">Master Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your music academies and review staff applications
          </p>
        </div>

        <Tabs defaultValue="academies" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-lg">
            <TabsTrigger value="academies">My Academies</TabsTrigger>
            <TabsTrigger value="staff">Staff Requests</TabsTrigger>
            <TabsTrigger value="resignations">Resignations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* My Academies Tab */}
          <TabsContent value="academies" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold">Your Music Academy</h2>
                <p className="text-muted-foreground">Create and manage your personalized music academy</p>
              </div>
              {(!classrooms || classrooms.length === 0) && (
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Create Academy
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create Your Music Academy</DialogTitle>
                      <DialogDescription>
                        Set up your personalized music academy with custom branding and curriculum
                      </DialogDescription>
                    </DialogHeader>
                    <AcademyCreationForm onSuccess={handleAcademyCreated} />
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Academies Grid */}
            {classroomsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
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
            ) : classrooms && classrooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classrooms.map((classroom: Classroom) => (
                  <Card key={classroom.id} className="group hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-0">
                      {/* Hero Section */}
                      <div 
                        className="h-32 relative rounded-t-lg"
                        style={{
                          backgroundColor: classroom.primaryColor || '#3B82F6',
                          backgroundImage: classroom.heroImage ? `url(${classroom.heroImage})` : 
                            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                        <div className="absolute inset-0 bg-black/20 rounded-t-lg" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="font-semibold text-white text-lg">
                            {classroom.academyName}
                          </h3>
                          <p className="text-xs text-white/90 truncate">
                            {classroom.description}
                          </p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        {/* Instruments */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {classroom.instruments?.slice(0, 3).map((instrument: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {instrument}
                            </Badge>
                          ))}
                          {classroom.instruments && classroom.instruments.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{classroom.instruments.length - 3} more
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
                            <Calendar className="h-3 w-3" />
                            <span>Est. {classroom.createdAt ? new Date(classroom.createdAt).getFullYear() : 'N/A'}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button asChild size="sm" className="flex-1">
                            <Link href={`/classroom-management/${classroom.id}`}>
                              <Crown className="h-3 w-3 mr-1" />
                              Manage
                            </Link>
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/academy/${classroom.customSlug}`}>
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/academy/${classroom.customSlug}?edit=true`}>
                              <Settings className="h-3 w-3 mr-1" />
                              Edit
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Academy Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your music academy to start building your teaching community
                  </p>
                  <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your Academy
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Staff Requests Tab */}
          <TabsContent value="staff" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Staff Applications</h2>
              <p className="text-muted-foreground">Review and manage mentor applications to join your academies</p>
            </div>

            {staffRequestsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-3/4 mb-4"></div>
                      <div className="h-16 bg-muted rounded mb-4"></div>
                      <div className="flex gap-2">
                        <div className="h-8 bg-muted rounded w-20"></div>
                        <div className="h-8 bg-muted rounded w-20"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : staffRequests && staffRequests.length > 0 ? (
              <div className="space-y-4">
                {staffRequests.map((request: StaffRequest) => (
                  <Card key={request.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold">Staff Application</h3>
                          <p className="text-sm text-muted-foreground">
                            Application submitted {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <Badge variant={
                          request.status === 'pending' ? 'default' :
                          request.status === 'approved' ? 'default' : 'destructive'
                        }>
                          <Clock className="h-3 w-3 mr-1" />
                          {request.status}
                        </Badge>
                      </div>
                      
                      {request.message && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Message:</h4>
                          <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                            {request.message}
                          </p>
                        </div>
                      )}
                      
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            onClick={() => approveStaffRequestMutation.mutate(request.id)}
                            disabled={approveStaffRequestMutation.isPending}
                          >
                            <UserCheck className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => rejectStaffRequestMutation.mutate({ requestId: request.id })}
                            disabled={rejectStaffRequestMutation.isPending}
                          >
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <UserCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Staff Applications</h3>
                  <p className="text-muted-foreground">
                    No mentors have applied to join your academies yet
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Resignations Tab */}
          <TabsContent value="resignations" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Staff Resignations</h2>
              <p className="text-muted-foreground">Review and manage staff resignation requests from your academies</p>
            </div>

            {classrooms && classrooms.length > 0 ? (
              <div className="space-y-6">
                {classrooms.map((classroom: Classroom) => (
                  <ResignationRequestManager 
                    key={classroom.id}
                    classroomId={classroom.id}
                    masterId={user?.id}
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Academies</h3>
                  <p className="text-muted-foreground">
                    Create an academy first to manage staff resignations
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Academy Analytics</h2>
              <p className="text-muted-foreground">Track performance and growth of your academies</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Academy Status</p>
                      <p className="text-2xl font-bold">{classrooms?.length > 0 ? 'Active' : 'Not Created'}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Applications</p>
                      <p className="text-2xl font-bold">{staffRequests?.filter((r: StaffRequest) => r.status === 'pending').length || 0}</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Staff</p>
                      <p className="text-2xl font-bold">{staffRequests?.filter((r: StaffRequest) => r.status === 'approved').length || 0}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">This Month</p>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                    <Calendar className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>
                  Detailed analytics and insights will be available soon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We're working on comprehensive analytics to help you track student progress, engagement, and academy growth.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}