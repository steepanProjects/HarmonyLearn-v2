import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Calendar, Users, BookOpen, MessageSquare, Settings, PlusCircle, Video, FileText, 
  Crown, Shield, TrendingUp, Clock, Award, Target, BarChart3, Search, Filter, 
  UserCheck, UserX, AlertCircle, CheckCircle, ExternalLink, Mail, Phone,
  GraduationCap, Activity, Star, Zap, Brain, Trophy, Sparkles, UserPlus, Eye
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ResignationRequestForm from "@/components/ResignationRequestForm";
import ResignationRequestStatus from "@/components/ResignationRequestStatus";

export default function StaffClassroom() {
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  // Fetch mentor's staff classroom
  const { data: classroom, isLoading: classroomLoading, error } = useQuery({
    queryKey: ["/api/mentors", user?.id, "staff-classroom"],
    queryFn: () => apiRequest(`/api/mentors/${user?.id}/staff-classroom`),
    enabled: !!user?.id,
  });

  // Fetch classroom students and staff
  const { data: classroomMembers, isLoading: membersLoading } = useQuery({
    queryKey: ["/api/classrooms", classroom?.classroomId, "members"],
    queryFn: () => apiRequest(`/api/classrooms/${classroom?.classroomId}/members`),
    enabled: !!classroom?.classroomId,
  });

  // Fetch resignation requests for oversight
  const { data: resignationRequests } = useQuery({
    queryKey: ["/api/resignation-requests", classroom?.classroomId],
    queryFn: () => apiRequest(`/api/resignation-requests?classroomId=${classroom?.classroomId}`),
    enabled: !!classroom?.classroomId,
  });

  // Fetch live sessions
  const { data: liveSessions } = useQuery({
    queryKey: ["/api/live-sessions", classroom?.classroomId],
    queryFn: () => apiRequest(`/api/live-sessions?classroomId=${classroom?.classroomId}`),
    enabled: !!classroom?.classroomId,
  });

  // Fetch classroom analytics
  const { data: analytics } = useQuery({
    queryKey: ["/api/classrooms", classroom?.classroomId, "analytics"],
    queryFn: () => apiRequest(`/api/classrooms/${classroom?.classroomId}/analytics`),
    enabled: !!classroom?.classroomId,
  });

  // Handle student progress update
  const updateStudentProgress = useMutation({
    mutationFn: (data: { studentId: number, progress: number }) => 
      apiRequest(`/api/students/${data.studentId}/progress`, {
        method: "PATCH",
        body: JSON.stringify({ progress: data.progress })
      }),
    onSuccess: () => {
      toast({ title: "Student progress updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/classrooms", classroom?.classroomId, "members"] });
    }
  });

  // Filter members based on search and filters
  const filteredMembers = classroomMembers?.filter((member: any) => {
    const matchesSearch = member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || member.role === filterRole;
    const matchesStatus = filterStatus === "all" || member.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  }) || [];

  // If no staff classroom found, show not authorized message
  if (error && error.message?.includes("404")) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-semibold mb-2">No Staff Access</h1>
            <p className="text-muted-foreground mb-6">
              You are not currently a staff member of any classroom. Apply to join academies through the discovery page.
            </p>
            <Button onClick={() => window.location.href = "/mentor-portal/classroom-discovery"}>
              Discover Academies
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (classroomLoading || membersLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading your classroom...</p>
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
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{classroom?.classroomTitle}</h1>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                  <Shield className="h-3 w-3 mr-1" />
                  Staff Member
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{classroom?.classroomSubject}</span>
                </div>
                <div className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  <span>{classroom?.classroomLevel}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Crown className="h-4 w-4" />
                  <span>Master: {classroom?.masterName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(classroom?.joinedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <p className="text-muted-foreground mt-2">{classroom?.classroomDescription}</p>
            </div>
            <div className="flex items-center gap-3">
              <ResignationRequestForm 
                mentorId={user?.id}
                classroomId={classroom?.classroomId}
                classroomTitle={classroom?.classroomTitle}
              />
            </div>
          </div>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{classroomMembers?.filter((m: any) => m.role === 'student')?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{classroomMembers?.filter((m: any) => m.role === 'staff')?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Staff</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Video className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{liveSessions?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Live Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{analytics?.averageProgress || 0}%</p>
                  <p className="text-sm text-muted-foreground">Avg Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{resignationRequests?.filter((r: any) => r.status === 'pending')?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Pending Issues</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="student-management">Student Management</TabsTrigger>
            <TabsTrigger value="staff-oversight">Staff Oversight</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="administration">Administration</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <ResignationRequestStatus mentorId={user?.id} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Master's Classroom Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Classroom Performance
                  </CardTitle>
                  <CardDescription>Overall classroom metrics and progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Student Completion Rate</span>
                      <span className="text-sm text-muted-foreground">{analytics?.completionRate || 0}%</span>
                    </div>
                    <Progress value={analytics?.completionRate || 0} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Staff Efficiency</span>
                      <span className="text-sm text-muted-foreground">{analytics?.staffEfficiency || 0}%</span>
                    </div>
                    <Progress value={analytics?.staffEfficiency || 85} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Student Satisfaction</span>
                      <span className="text-sm text-muted-foreground">{analytics?.satisfaction || 0}%</span>
                    </div>
                    <Progress value={analytics?.satisfaction || 92} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions for Master Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Staff management tools and actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                      <UserPlus className="h-5 w-5" />
                      <span className="text-sm">Add Student</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                      <Video className="h-5 w-5" />
                      <span className="text-sm">Schedule Session</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      <span className="text-sm">Award Achievement</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      <span className="text-sm">Send Announcement</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics?.recentActivities?.length ? analytics.recentActivities.map((activity: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="flex-shrink-0">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No recent activities</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Alerts & Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {resignationRequests?.filter((r: any) => r.status === 'pending')?.map((request: any) => (
                      <div key={request.id} className="flex items-center gap-3 p-3 border border-orange-200 rounded-lg bg-orange-50">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Resignation Request</p>
                          <p className="text-xs text-muted-foreground">Staff member requesting to leave</p>
                        </div>
                        <Button size="sm" variant="outline">Review</Button>
                      </div>
                    ))}
                    {(!resignationRequests || resignationRequests.length === 0) && (
                      <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50 text-green-500" />
                        <p>All good! No pending alerts</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="student-management" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Student Management</h2>
                <p className="text-muted-foreground">Oversee student progress and engagement</p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Student Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredMembers?.filter((m: any) => m.role === 'student')?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMembers.filter((m: any) => m.role === 'student').map((student: any) => (
                        <TableRow key={student.id}>
                          <TableCell className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={student.avatar} />
                              <AvatarFallback>{student.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-muted-foreground">{student.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={student.progress || 0} className="w-16 h-2" />
                              <span className="text-sm">{student.progress || 0}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {student.lastActive ? new Date(student.lastActive).toLocaleDateString() : 'Never'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={student.performance === 'excellent' ? 'default' : 
                                          student.performance === 'good' ? 'secondary' : 'outline'}>
                              {student.performance || 'Average'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Mail className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No Students Found</h3>
                    <p>No students match your current search and filter criteria.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff-oversight" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Staff Oversight</h2>
                <p className="text-muted-foreground">Monitor and manage teaching staff</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Staff Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {classroomMembers?.filter((m: any) => m.role === 'staff')?.length > 0 ? (
                    <div className="space-y-3">
                      {classroomMembers.filter((m: any) => m.role === 'staff').map((staff: any) => (
                        <div key={staff.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={staff.avatar} />
                              <AvatarFallback>{staff.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{staff.name}</p>
                              <p className="text-sm text-muted-foreground">{staff.specialization || 'Staff Member'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              <Shield className="h-3 w-3 mr-1" />
                              Staff
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No other staff members</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Staff Requests & Issues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {resignationRequests?.length > 0 ? (
                    <div className="space-y-3">
                      {resignationRequests.map((request: any) => (
                        <div key={request.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Resignation Request</span>
                            <Badge variant={request.status === 'pending' ? 'outline' : 
                                          request.status === 'approved' ? 'default' : 'secondary'}>
                              {request.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{request.reason}</p>
                          <p className="text-xs text-muted-foreground">
                            Submitted: {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50 text-green-500" />
                      <p>No pending staff issues</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Performance Analytics</h2>
                <p className="text-muted-foreground">Detailed classroom and staff performance metrics</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Student Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {analytics?.averageProgress || 0}%
                    </div>
                    <p className="text-sm text-muted-foreground">Average completion</p>
                    <Progress value={analytics?.averageProgress || 0} className="mt-3" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Teaching Quality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {analytics?.teachingQuality || 4.8}
                    </div>
                    <p className="text-sm text-muted-foreground">Average rating</p>
                    <div className="flex justify-center mt-3">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(analytics?.teachingQuality || 4.8) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {analytics?.engagement || 89}%
                    </div>
                    <p className="text-sm text-muted-foreground">Active participation</p>
                    <Progress value={analytics?.engagement || 89} className="mt-3" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Live Sessions</h2>
                <p className="text-muted-foreground">Schedule and manage teaching sessions</p>
              </div>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Schedule Session
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-6">
                {liveSessions?.length > 0 ? (
                  <div className="space-y-4">
                    {liveSessions.map((session: any) => (
                      <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Video className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium">{session.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(session.scheduledAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant={session.status === 'scheduled' ? 'outline' : 
                                      session.status === 'live' ? 'default' : 'secondary'}>
                          {session.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Video className="h-12 w-12 mx-auto mb-2" />
                    <p>No sessions scheduled</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="administration" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Administration</h2>
                <p className="text-muted-foreground">Classroom settings and administrative tools</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Master Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Crown className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-medium">{classroom?.masterName}</p>
                        <p className="text-sm text-muted-foreground">Master Teacher</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Subject</p>
                        <p className="font-medium">{classroom?.classroomSubject}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Level</p>
                        <p className="font-medium">{classroom?.classroomLevel}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Max Students</p>
                        <p className="font-medium">{classroom?.classroomMaxStudents}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Created</p>
                        <p className="font-medium">{new Date(classroom?.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Staff Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Teaching Guidelines
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Classroom Policies
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Master
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Trophy className="h-4 w-4 mr-2" />
                      Achievement System
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}