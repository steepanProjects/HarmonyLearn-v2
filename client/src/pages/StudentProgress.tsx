import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Footer } from "@/components/Footer";
import { StudentNavigation } from "@/components/student/StudentNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Award, 
  Clock, 
  Target,
  Calendar,
  BookOpen,
  Star,
  Trophy,
  Activity,
  BarChart3,
  CheckCircle,
  Music
} from "lucide-react";

interface ProgressData {
  overallProgress: number;
  coursesCompleted: number;
  totalCourses: number;
  studyHours: number;
  currentStreak: number;
  achievements: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

interface CourseProgress {
  id: number;
  title: string;
  category: string;
  progress: number;
  timeSpent: number;
  lastActivity: string;
  nextMilestone: string;
}

interface WeeklyActivity {
  day: string;
  hours: number;
  completed: boolean;
}

const StudentProgress = () => {
  const [currentUser] = useState(() => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  });

  // Fetch student progress data
  const { data: enrollments = [] } = useQuery<any[]>({
    queryKey: ['/api/enrollments', { student: currentUser?.id }],
    enabled: !!currentUser?.id
  });

  // Calculate progress metrics
  const progressData: ProgressData = {
    overallProgress: enrollments.length > 0 ? 
      enrollments.reduce((total: number, e: any) => total + (e.completionPercentage || 0), 0) / enrollments.length : 0,
    coursesCompleted: enrollments.filter((e: any) => e.completionPercentage === 100).length,
    totalCourses: enrollments.length,
    studyHours: enrollments.reduce((total: number, e: any) => total + (e.studyHours || 0), 0),
    currentStreak: 7, // Would come from actual tracking
    achievements: 12, // Would come from achievements system
    weeklyGoal: 10, // Hours per week
    weeklyProgress: 8.5 // Current week progress
  };

  // Transform enrollment data
  const courseProgress: CourseProgress[] = enrollments.map((enrollment: any) => ({
    id: enrollment.courseId,
    title: enrollment.courseTitle || 'Course Title',
    category: enrollment.category || 'Music',
    progress: enrollment.completionPercentage || 0,
    timeSpent: enrollment.studyHours || 0,
    lastActivity: enrollment.lastActivity || '2 days ago',
    nextMilestone: enrollment.nextMilestone || 'Complete Module 3'
  }));

  // Sample weekly activity data
  const weeklyActivity: WeeklyActivity[] = [
    { day: 'Mon', hours: 1.5, completed: true },
    { day: 'Tue', hours: 2.0, completed: true },
    { day: 'Wed', hours: 1.0, completed: true },
    { day: 'Thu', hours: 2.5, completed: true },
    { day: 'Fri', hours: 1.5, completed: true },
    { day: 'Sat', hours: 0, completed: false },
    { day: 'Sun', hours: 0, completed: false }
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 20) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'piano': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'guitar': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'violin': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'drums': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'vocals': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'theory': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    };
    return colors[category.toLowerCase()] || colors['theory'];
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
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Learning Progress</h1>
          <p className="text-muted-foreground">
            Track your musical journey and celebrate your achievements
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{Math.round(progressData.overallProgress)}%</p>
                  <p className="text-sm text-muted-foreground">Overall Progress</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
              <Progress value={progressData.overallProgress} className="mt-3" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{progressData.coursesCompleted}/{progressData.totalCourses}</p>
                  <p className="text-sm text-muted-foreground">Courses Completed</p>
                </div>
                <Trophy className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{progressData.studyHours}h</p>
                  <p className="text-sm text-muted-foreground">Total Study Time</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{progressData.currentStreak}</p>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </div>
                <Target className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Course Progress</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    This Week's Progress
                  </CardTitle>
                  <CardDescription>
                    {progressData.weeklyProgress} / {progressData.weeklyGoal} hours completed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress 
                      value={(progressData.weeklyProgress / progressData.weeklyGoal) * 100} 
                      className="h-3"
                    />
                    <div className="grid grid-cols-7 gap-2">
                      {weeklyActivity.map((day) => (
                        <div key={day.day} className="text-center">
                          <div className={`w-full h-8 rounded text-xs flex items-center justify-center mb-1 ${
                            day.completed ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                            'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                          }`}>
                            {day.hours > 0 ? `${day.hours}h` : '-'}
                          </div>
                          <span className="text-xs text-muted-foreground">{day.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Recent Achievements
                  </CardTitle>
                  <CardDescription>
                    {progressData.achievements} total achievements earned
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                        🎵
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">First Course Completed</p>
                        <p className="text-xs text-muted-foreground">2 days ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                        🔥
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">7-Day Streak</p>
                        <p className="text-xs text-muted-foreground">1 week ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">
                        🎼
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Scale Master</p>
                        <p className="text-xs text-muted-foreground">2 weeks ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Course Progress Tab */}
          <TabsContent value="courses">
            <div className="space-y-4">
              {courseProgress.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No courses enrolled</h3>
                    <p className="text-muted-foreground">
                      Start learning by enrolling in your first course!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                courseProgress.map((course) => (
                  <Card key={course.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                            <Music className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{course.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className={getCategoryColor(course.category)}>
                                {course.category}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                Last activity: {course.lastActivity}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{course.progress}%</p>
                          <p className="text-sm text-muted-foreground">{course.timeSpent}h spent</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Progress value={course.progress} className="h-2" />
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Next milestone:</span>
                          <span className="font-medium">{course.nextMilestone}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Learning Activity
                </CardTitle>
                <CardDescription>
                  Your practice and study patterns over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Activity Chart</h3>
                  <p className="text-muted-foreground">
                    Detailed activity tracking and analytics coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Weekly Goal
                  </CardTitle>
                  <CardDescription>
                    Practice at least {progressData.weeklyGoal} hours per week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Progress this week</span>
                      <span className="font-semibold">
                        {progressData.weeklyProgress} / {progressData.weeklyGoal} hours
                      </span>
                    </div>
                    <Progress 
                      value={(progressData.weeklyProgress / progressData.weeklyGoal) * 100} 
                      className="h-3"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>
                        {Math.round(((progressData.weeklyProgress / progressData.weeklyGoal) * 100))}% complete
                      </span>
                      <span>
                        {Math.max(0, progressData.weeklyGoal - progressData.weeklyProgress).toFixed(1)} hours remaining
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Monthly Targets
                  </CardTitle>
                  <CardDescription>
                    Goals to achieve this month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="line-through text-muted-foreground">Complete 1 course</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                      <span>Practice 40 hours total</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                      <span>Earn 3 new achievements</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                      <span>Maintain 15-day streak</span>
                    </div>
                  </div>
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

export default StudentProgress;