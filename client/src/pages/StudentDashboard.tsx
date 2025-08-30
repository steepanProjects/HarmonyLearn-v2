import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Footer } from "@/components/Footer";
import { StudentNavigation } from "@/components/student/StudentNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  BookOpen, 
  Star, 
  Trophy, 
  TrendingUp, 
  Clock, 
  Play,
  Plus,
  Video,
  FileText,
  Award,
  Settings,
  Users,
  Target,
  Headphones,
  Music
} from "lucide-react";

interface StudentStats {
  coursesEnrolled: number;
  coursesCompleted: number;
  totalStudyHours: number;
  averageProgress: number;
  certificatesEarned: number;
  currentStreak: number;
}

interface EnrolledCourse {
  id: number;
  title: string;
  instructor: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  nextLesson: string;
  category: string;
  rating: number;
  thumbnail: string;
}

interface UpcomingSession {
  id: number;
  title: string;
  instructor: string;
  date: string;
  time: string;
  type: 'live' | 'practice' | 'assessment';
  status: 'scheduled' | 'ongoing' | 'completed';
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  earnedDate: string;
  category: 'progress' | 'skill' | 'participation';
}

const StudentDashboard = () => {
  // Get current user from localStorage
  const [currentUser] = useState(() => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  });

  // Fetch student enrollments
  const { data: enrollments = [] } = useQuery<any[]>({
    queryKey: ['/api/enrollments', { student: currentUser?.id }],
    enabled: !!currentUser?.id
  });

  // Fetch student courses
  const { data: studentCourses = [] } = useQuery<any[]>({
    queryKey: ['/api/courses', { enrolled: currentUser?.id }],
    enabled: !!currentUser?.id
  });

  // Fetch upcoming sessions
  const { data: upcomingSessions = [] } = useQuery<any[]>({
    queryKey: ['/api/live-sessions', { student: currentUser?.id, upcoming: true }],
    enabled: !!currentUser?.id
  });

  // Calculate student stats from real data
  const stats: StudentStats = {
    coursesEnrolled: enrollments.length,
    coursesCompleted: enrollments.filter((e: any) => e.completionPercentage === 100).length,
    totalStudyHours: enrollments.reduce((total: number, e: any) => total + (e.studyHours || 0), 0),
    averageProgress: enrollments.length > 0 ? 
      enrollments.reduce((total: number, e: any) => total + (e.completionPercentage || 0), 0) / enrollments.length : 0,
    certificatesEarned: enrollments.filter((e: any) => e.certificateEarned).length,
    currentStreak: 7 // This would come from actual tracking
  };

  // Transform enrollment data into course cards
  const enrolledCourses: EnrolledCourse[] = enrollments.map((enrollment: any) => ({
    id: enrollment.courseId,
    title: enrollment.courseTitle || 'Course Title',
    instructor: enrollment.instructorName || 'Instructor',
    progress: enrollment.completionPercentage || 0,
    totalLessons: enrollment.totalLessons || 10,
    completedLessons: enrollment.completedLessons || 0,
    nextLesson: enrollment.nextLesson || 'Introduction',
    category: enrollment.category || 'Music',
    rating: enrollment.courseRating || 4.5,
    thumbnail: enrollment.thumbnail || ''
  }));

  // Sample achievements - in real app would come from API
  const [achievements] = useState<Achievement[]>([
    {
      id: 1,
      title: "First Course Started",
      description: "Enrolled in your first music course",
      icon: "🎵",
      earnedDate: "2025-01-15",
      category: 'progress'
    },
    {
      id: 2,
      title: "Week Warrior",
      description: "Practiced for 7 consecutive days",
      icon: "🔥",
      earnedDate: "2025-01-20",
      category: 'participation'
    },
    {
      id: 3,
      title: "Scale Master",
      description: "Completed all basic scale exercises",
      icon: "🎼",
      earnedDate: "2025-01-25",
      category: 'skill'
    }
  ]);

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 20) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'piano': return <Music className="h-4 w-4" />;
      case 'guitar': return <Music className="h-4 w-4" />;
      case 'violin': return <Music className="h-4 w-4" />;
      case 'drums': return <Music className="h-4 w-4" />;
      case 'vocals': return <Headphones className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Navigation */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-0 h-screen">
          <StudentNavigation currentUser={currentUser} className="h-full" />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 min-w-0">
      
      {/* Welcome Section */}
      <section className="py-8 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" />
                <AvatarFallback className="text-lg font-bold">
                  {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Welcome back, {currentUser?.firstName}!
                </h1>
                <p className="text-white/80">Ready to continue your musical journey?</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                className="gap-2"
                onClick={() => window.location.href = '/student-achievements'}
              >
                <Trophy className="h-4 w-4" />
                Achievements
              </Button>
              <Button 
                variant="outline" 
                className="gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={() => window.location.href = '/community'}
              >
                <Users className="h-4 w-4" />
                Community
              </Button>
              <Button 
                variant="outline" 
                className="gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={() => window.location.href = '/tools'}
              >
                <Music className="h-4 w-4" />
                Practice Tools
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.coursesEnrolled}</p>
                  <p className="text-xs text-muted-foreground">Courses Enrolled</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.coursesCompleted}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <Trophy className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{Math.round(stats.averageProgress)}%</p>
                  <p className="text-xs text-muted-foreground">Avg Progress</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.totalStudyHours}h</p>
                  <p className="text-xs text-muted-foreground">Study Hours</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.certificatesEarned}</p>
                  <p className="text-xs text-muted-foreground">Certificates</p>
                </div>
                <Award className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.currentStreak}</p>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
                <Target className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/student-courses'}>
              <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                <h3 className="font-semibold mb-2">My Courses</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Continue learning and browse new courses
                </p>
                <Badge variant="secondary">{stats.coursesEnrolled} enrolled</Badge>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/student-sessions'}>
              <CardContent className="p-6 text-center">
                <Video className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h3 className="font-semibold mb-2">Live Sessions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Join live classes and book sessions
                </p>
                <Badge variant="secondary">{upcomingSessions.length} upcoming</Badge>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/student-progress'}>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                <h3 className="font-semibold mb-2">Progress</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Track your learning journey
                </p>
                <Badge variant="secondary">{Math.round(stats.averageProgress)}% complete</Badge>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/community'}>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-orange-500" />
                <h3 className="font-semibold mb-2">Community</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect with other students
                </p>
                <Badge variant="secondary">Join discussions</Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Recent Activity</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Continue Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                {enrolledCourses.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">No courses enrolled yet</p>
                    <Button size="sm" onClick={() => window.location.href = '/student-courses'}>
                      Browse Courses
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {enrolledCourses.slice(0, 3).map((course) => (
                      <div key={course.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="p-2 rounded bg-blue-100 dark:bg-blue-900">
                          {getCategoryIcon(course.category)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{course.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={course.progress} className="h-1 flex-1" />
                            <span className="text-xs text-muted-foreground">{course.progress}%</span>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Play className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    {enrolledCourses.length > 3 && (
                      <div className="text-center pt-2">
                        <Button variant="outline" size="sm" onClick={() => window.location.href = '/student-courses'}>
                          View All Courses
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingSessions.length === 0 ? (
                  <div className="text-center py-8">
                    <Video className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">No upcoming sessions</p>
                    <Button size="sm" onClick={() => window.location.href = '/student-sessions'}>
                      Book Session
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingSessions.slice(0, 3).map((session: any) => (
                      <div key={session.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="p-2 rounded bg-green-100 dark:bg-green-900">
                          <Video className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{session.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {session.date} at {session.time}
                          </p>
                        </div>
                        <Button size="sm" variant="ghost">
                          Join
                        </Button>
                      </div>
                    ))}
                    {upcomingSessions.length > 3 && (
                      <div className="text-center pt-2">
                        <Button variant="outline" size="sm" onClick={() => window.location.href = '/student-sessions'}>
                          View All Sessions
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

        <Footer />
      </div>
    </div>
  );
};

export default StudentDashboard;