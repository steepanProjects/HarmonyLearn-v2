import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Users, 
  BookOpen, 
  Star, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  MessageCircle,
  Plus,
  Edit,
  Video,
  FileText,
  Award,
  Settings,
  User,
  Crown,
  Music,
  GraduationCap,
  BarChart3
} from "lucide-react";
import { getCurrentUser, isMaster } from "@/lib/auth";
import MasterRoleRequestForm from "@/components/mentor/MasterRoleRequestForm";
import MasterRoleRequestStatus from "@/components/mentor/MasterRoleRequestStatus";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MentorNavigation } from "@/components/mentor/MentorNavigation";

interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalEarnings: number;
  avgRating: number;
  upcomingSessions: number;
  completedSessions: number;
}

interface Course {
  id: number;
  title: string;
  students: number;
  rating: number;
  earnings: number;
  status: 'active' | 'draft' | 'completed';
}

interface Session {
  id: number;
  title: string;
  student: string;
  date: string;
  time: string;
  type: 'one-on-one' | 'group' | 'webinar';
  status: 'scheduled' | 'completed' | 'cancelled';
}

const MentorDashboard = () => {
  const currentUser = getCurrentUser();
  const [showMasterRequestDialog, setShowMasterRequestDialog] = useState(false);

  // Fetch mentor profile data
  const { data: mentorProfile } = useQuery({
    queryKey: ['/api/mentor-profiles', currentUser?.id],
    enabled: !!currentUser?.id
  });

  // Fetch mentor courses
  const { data: mentorCourses = [] } = useQuery<any[]>({
    queryKey: ['/api/courses', { mentor: currentUser?.id }],
    enabled: !!currentUser?.id
  });

  // Fetch mentor live sessions
  const { data: mentorSessions = [] } = useQuery<any[]>({
    queryKey: ['/api/live-sessions', { mentor: currentUser?.id }],
    enabled: !!currentUser?.id
  });

  // Calculate real stats from API data
  const stats: DashboardStats = {
    totalStudents: Array.isArray(mentorCourses) ? mentorCourses.reduce((total: number, course: any) => total + (course.enrolledCount || 0), 0) : 0,
    totalCourses: Array.isArray(mentorCourses) ? mentorCourses.length : 0,
    totalEarnings: Array.isArray(mentorCourses) ? mentorCourses.reduce((total: number, course: any) => total + (parseFloat(course.price) || 0), 0) : 0,
    avgRating: (mentorProfile as any)?.averageRating || 0,
    upcomingSessions: Array.isArray(mentorSessions) ? mentorSessions.filter((session: any) => session.status === 'scheduled').length : 0,
    completedSessions: Array.isArray(mentorSessions) ? mentorSessions.filter((session: any) => session.status === 'completed').length : 0
  };

  // Use real courses data from API
  const courses: Course[] = Array.isArray(mentorCourses) ? mentorCourses.map((course: any) => ({
    id: course.id,
    title: course.title,
    students: course.enrolledCount || 0,
    rating: course.averageRating || 0,
    earnings: parseFloat(course.price) || 0,
    status: course.isActive ? 'active' : 'draft'
  })) : [];

  const [upcomingSessions] = useState<Session[]>([
    {
      id: 1,
      title: "Guitar Technique Review",
      student: "Sarah Johnson",
      date: "Today",
      time: "2:00 PM",
      type: 'one-on-one',
      status: 'scheduled'
    },
    {
      id: 2,
      title: "Chord Progression Workshop",
      student: "Group Session",
      date: "Tomorrow",
      time: "4:00 PM",
      type: 'group',
      status: 'scheduled'
    },
    {
      id: 3,
      title: "Music Theory Q&A",
      student: "Mike Chen",
      date: "Oct 15",
      time: "3:30 PM",
      type: 'one-on-one',
      status: 'scheduled'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'one-on-one': return <Users className="h-4 w-4" />;
      case 'group': return <Users className="h-4 w-4" />;
      case 'webinar': return <Video className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Navigation */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-0 h-screen">
          <MentorNavigation currentUser={currentUser} className="h-full" />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-hero">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl font-bold">
                  {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-white">{currentUser?.firstName} {currentUser?.lastName}</h1>
                  <Badge className="bg-green-500 text-white">
                    <Award className="h-3 w-3 mr-1" />
                    Verified Mentor
                  </Badge>
                </div>
                <p className="text-white/90 text-lg mb-1">{(mentorProfile as any)?.specialization || 'Music Instructor'}</p>
                <p className="text-white/70">{(mentorProfile as any)?.experience || 'Professional Experience'} • {currentUser?.email}</p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="secondary" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Profile Settings
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
                  onClick={() => {
                    localStorage.removeItem("userRole");
                    localStorage.removeItem("mentorId");
                    window.location.href = "/";
                  }}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{stats.totalStudents}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Courses</p>
                  <p className="text-2xl font-bold">{stats.totalCourses}</p>
                </div>
                <BookOpen className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold">${stats.totalEarnings.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                  <div className="flex items-center gap-1">
                    <p className="text-2xl font-bold">{stats.avgRating}</p>
                    <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Button variant="outline" className="h-24 flex flex-col gap-2" asChild>
            <Link href="/mentor-requests">
              <MessageCircle className="h-8 w-8 text-blue-500" />
              <span className="font-semibold">Mentorship Requests</span>
              <span className="text-xs text-muted-foreground">Review & respond</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col gap-2" asChild>
            <Link href="/mentor-students">
              <User className="h-8 w-8 text-green-500" />
              <span className="font-semibold">My Students</span>
              <span className="text-xs text-muted-foreground">Manage mentorships</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col gap-2" asChild>
            <Link href="/mentor-interactions">
              <MessageCircle className="h-8 w-8 text-purple-500" />
              <span className="font-semibold">Messages</span>
              <span className="text-xs text-muted-foreground">Chat with students</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col gap-2">
            <Calendar className="h-8 w-8 text-orange-500" />
            <span className="font-semibold">Schedule</span>
            <span className="text-xs text-muted-foreground">Manage sessions</span> 
          </Button>
          {isMaster() && (
            <Button variant="outline" className="h-24 flex flex-col gap-2" asChild>
              <Link href="/classroom/manage">
                <Users className="h-8 w-8 text-indigo-500" />
                <span className="font-semibold">My Classrooms</span>
                <span className="text-xs text-muted-foreground">Create & manage</span>
              </Link>
            </Button>
          )}
        </div>

        {/* Master Role Section - Only show for non-masters */}
        {!isMaster() && (
          <>
            <div className="mb-8">
              <MasterRoleRequestStatus />
            </div>

            {/* Master Role Actions */}
            <div className="mb-8">
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Crown className="w-6 h-6 text-yellow-600" />
                    <div>
                      <CardTitle className="text-yellow-800 dark:text-yellow-300">Become a Master</CardTitle>
                      <CardDescription className="text-yellow-700 dark:text-yellow-400">
                        Unlock classroom creation and advanced teaching features
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-yellow-800 dark:text-yellow-300">Master mentors can:</p>
                      <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                        <li>• Create and manage classrooms</li>
                        <li>• Access advanced teaching tools</li>
                        <li>• Enhanced mentor status</li>
                      </ul>
                    </div>
                    <Dialog open={showMasterRequestDialog} onOpenChange={setShowMasterRequestDialog}>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                          <Crown className="w-4 h-4 mr-2" />
                          Apply for Master Role
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Master Role Application</DialogTitle>
                        </DialogHeader>
                        <MasterRoleRequestForm onSuccess={() => setShowMasterRequestDialog(false)} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Master Dashboard Quick Link */}
        {isMaster() && (
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">Master Dashboard</h3>
                      <p className="text-blue-700 dark:text-blue-400">Manage your classrooms and advanced features</p>
                    </div>
                  </div>
                  <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Link href="/master-dashboard">
                      <Crown className="w-4 h-4 mr-2" />
                      Open Master Dashboard
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className={`grid w-full ${isMaster() ? 'grid-cols-6' : 'grid-cols-5'}`}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            {isMaster() && <TabsTrigger value="classrooms">Classrooms</TabsTrigger>}
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage your teaching activities</CardDescription>
                </CardHeader>
                <CardContent className={`grid ${isMaster() ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}>
                  <Button className="h-20 flex flex-col gap-2">
                    <Plus className="h-6 w-6" />
                    Create Course
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Calendar className="h-6 w-6" />
                    Schedule Session
                  </Button>
                  {isMaster() && (
                    <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                      <Link href="/classroom/manage">
                        <Users className="h-6 w-6" />
                        Create Classroom
                      </Link>
                    </Button>
                  )}
                  <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                    <Link href="/mentor-interactions">
                      <MessageCircle className="h-6 w-6" />
                      Message Students
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    View Reports
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest teaching activities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New student enrolled in Guitar Fundamentals</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Session completed with Sarah Johnson</p>
                      <p className="text-xs text-muted-foreground">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New 5-star review received</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>Your next scheduled teaching sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                          {getTypeIcon(session.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{session.title}</h4>
                          <p className="text-sm text-muted-foreground">with {session.student}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{session.date}</p>
                        <p className="text-sm text-muted-foreground">{session.time}</p>
                      </div>
                      <Button size="sm">Join Session</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">My Courses</h2>
                <p className="text-muted-foreground">Manage and track your course performance</p>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create New Course
              </Button>
            </div>

            <div className="grid gap-6">
              {courses.map((course) => (
                <Card key={course.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{course.title}</h3>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-muted-foreground">
                            {course.students} students
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span className="text-sm font-medium">{course.rating}</span>
                          </div>
                          <span className="text-sm font-medium text-green-600">
                            ${course.earnings.toLocaleString()} earned
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(course.status)}>
                          {course.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Progress value={(course.students / 50) * 100} className="mb-2" />
                    <p className="text-xs text-muted-foreground">
                      {course.students}/50 enrollment capacity
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sessions">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Session Management</h2>
                <p className="text-muted-foreground">Schedule and manage your teaching sessions</p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Session Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Completed Sessions</span>
                      <span className="font-bold">{stats.completedSessions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Upcoming Sessions</span>
                      <span className="font-bold">{stats.upcomingSessions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Session Rating</span>
                      <span className="font-bold">{stats.avgRating}/5</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Schedule</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full gap-2">
                      <Plus className="h-4 w-4" />
                      Schedule New Session
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
                      <Calendar className="h-4 w-4" />
                      View Calendar
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
                      <Clock className="h-4 w-4" />
                      Set Availability
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Student Management</h2>
                <p className="text-muted-foreground">Track and communicate with your students</p>
              </div>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Student Management</h3>
                  <p className="text-muted-foreground mb-4">
                    Advanced student tracking and communication features will be available here.
                  </p>
                  <Button variant="outline">Coming Soon</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {isMaster() && (
            <TabsContent value="classrooms">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Crown className="h-6 w-6 text-yellow-600" />
                      Classroom Management
                    </h2>
                    <p className="text-muted-foreground">Create and manage your learning classrooms</p>
                  </div>
                  <Button asChild className="gap-2">
                    <Link href="/classroom/manage">
                      <Plus className="h-4 w-4" />
                      Create New Classroom
                    </Link>
                  </Button>
                </div>
                
                <div className="grid gap-6">
                  {/* Classroom Stats */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                        <p className="text-2xl font-bold">3</p>
                        <p className="text-sm text-muted-foreground">Active Classrooms</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <GraduationCap className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        <p className="text-2xl font-bold">47</p>
                        <p className="text-sm text-muted-foreground">Total Students</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                        <p className="text-2xl font-bold">89%</p>
                        <p className="text-sm text-muted-foreground">Completion Rate</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Classrooms */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Classrooms</CardTitle>
                      <CardDescription>Manage your active learning environments</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <Music className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Advanced Piano Techniques</h4>
                            <p className="text-sm text-muted-foreground">15 students • Active</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Manage</Button>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                            <Music className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Guitar Fundamentals</h4>
                            <p className="text-sm text-muted-foreground">22 students • Active</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Manage</Button>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                            <Music className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Music Theory Basics</h4>
                            <p className="text-sm text-muted-foreground">10 students • Active</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Manage</Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Classroom Tools */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Master Tools</CardTitle>
                      <CardDescription>Advanced classroom management features</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                      <Button variant="outline" className="h-20 flex flex-col gap-2">
                        <BarChart3 className="h-6 w-6" />
                        <span>Classroom Analytics</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col gap-2">
                        <Settings className="h-6 w-6" />
                        <span>Bulk Management</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col gap-2">
                        <FileText className="h-6 w-6" />
                        <span>Progress Reports</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col gap-2">
                        <Calendar className="h-6 w-6" />
                        <span>Schedule Overview</span>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          )}

          <TabsContent value="analytics">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Performance Analytics</h2>
                <p className="text-muted-foreground">Track your teaching performance and earnings</p>
              </div>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                  <p className="text-muted-foreground mb-4">
                    Detailed analytics and reporting features will be available here.
                  </p>
                  <Button variant="outline">Coming Soon</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default MentorDashboard;