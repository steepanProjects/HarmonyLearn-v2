import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Footer } from "@/components/Footer";
import { StudentNavigation } from "@/components/student/StudentNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Star, 
  Clock, 
  Play,
  Search,
  Filter,
  Plus,
  Music,
  Users,
  Award,
  CheckCircle,
  Headphones
} from "lucide-react";

interface Course {
  id: number;
  title: string;
  instructor: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  rating: number;
  studentsCount: number;
  price: number;
  thumbnail: string;
  description: string;
  isEnrolled?: boolean;
  progress?: number;
  completedLessons?: number;
  totalLessons?: number;
}

const StudentCourses = () => {
  const [, setLocation] = useLocation();
  const [currentUser] = useState(() => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  const handleCourseClick = (courseId: number) => {
    setLocation(`/courses/${courseId}`);
  };

  // Fetch enrolled courses
  const { data: enrollments = [] } = useQuery<any[]>({
    queryKey: ['/api/enrollments', { student: currentUser?.id }],
    enabled: !!currentUser?.id
  });

  // Fetch all available courses
  const { data: allCourses = [] } = useQuery<any[]>({
    queryKey: ['/api/courses'],
  });

  // Transform data into Course interface
  const enrolledCourses: Course[] = enrollments.map((enrollment: any) => ({
    id: enrollment.courseId,
    title: enrollment.courseTitle || 'Course Title',
    instructor: enrollment.instructorName || 'Instructor',
    category: enrollment.category || 'Music',
    level: enrollment.level || 'beginner',
    duration: enrollment.duration || '8 weeks',
    rating: enrollment.courseRating || 4.5,
    studentsCount: enrollment.studentsCount || 100,
    price: parseFloat(enrollment.price) || 99,
    thumbnail: enrollment.thumbnail || '',
    description: enrollment.description || 'Course description',
    isEnrolled: true,
    progress: enrollment.completionPercentage || 0,
    completedLessons: enrollment.completedLessons || 0,
    totalLessons: enrollment.totalLessons || 10
  }));

  const availableCourses: Course[] = allCourses
    .filter((course: any) => !enrollments.some((e: any) => e.courseId === course.id))
    .map((course: any) => ({
      id: course.id,
      title: course.title,
      instructor: course.mentorName || 'Instructor',
      category: course.category,
      level: course.level || 'beginner',
      duration: course.duration || '8 weeks',
      rating: course.averageRating || 4.5,
      studentsCount: course.enrolledCount || 0,
      price: parseFloat(course.price) || 99,
      thumbnail: course.thumbnail || '',
      description: course.description,
      isEnrolled: false
    }));

  // Filter functions
  const filterCourses = (courses: Course[]) => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || course.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesLevel = levelFilter === "all" || course.level === levelFilter;
      return matchesSearch && matchesCategory && matchesLevel;
    });
  };

  const filteredEnrolledCourses = filterCourses(enrolledCourses);
  const filteredAvailableCourses = filterCourses(availableCourses);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
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

  const CourseCard = ({ course, showProgress = false }: { course: Course; showProgress?: boolean }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleCourseClick(course.id)}>
      <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative">
        <div className="absolute inset-0 flex items-center justify-center text-white">
          {getCategoryIcon(course.category)}
        </div>
        <Badge className="absolute top-2 left-2" variant="secondary">
          {course.category}
        </Badge>
        <Badge className={`absolute top-2 right-2 ${getLevelColor(course.level)}`}>
          {course.level}
        </Badge>
        {showProgress && course.progress !== undefined && (
          <Badge className="absolute bottom-2 right-2 bg-white/90 text-black">
            {course.progress}% Complete
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold line-clamp-2 mb-1">{course.title}</h3>
            <p className="text-sm text-muted-foreground">by {course.instructor}</p>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{course.rating}</span>
              <span className="text-muted-foreground">({course.studentsCount})</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{course.duration}</span>
            </div>
          </div>
          
          {showProgress && course.isEnrolled && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
              <div className="text-sm text-muted-foreground">
                {course.completedLessons}/{course.totalLessons} lessons completed
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-bold">
              {course.isEnrolled ? 'Enrolled' : `$${course.price}`}
            </span>
            <Button size="sm" className="gap-2">
              {course.isEnrolled ? (
                <>
                  <Play className="h-4 w-4" />
                  Continue
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Enroll
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
          <h1 className="text-3xl font-bold mb-2">My Courses</h1>
          <p className="text-muted-foreground">
            Continue your learning journey or explore new courses
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="piano">Piano</SelectItem>
                  <SelectItem value="guitar">Guitar</SelectItem>
                  <SelectItem value="violin">Violin</SelectItem>
                  <SelectItem value="drums">Drums</SelectItem>
                  <SelectItem value="vocals">Vocals</SelectItem>
                  <SelectItem value="theory">Music Theory</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Course Tabs */}
        <Tabs defaultValue="enrolled" className="space-y-6">
          <TabsList>
            <TabsTrigger value="enrolled" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              My Courses ({filteredEnrolledCourses.length})
            </TabsTrigger>
            <TabsTrigger value="available" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Available Courses ({filteredAvailableCourses.length})
            </TabsTrigger>
          </TabsList>

          {/* Enrolled Courses */}
          <TabsContent value="enrolled">
            {filteredEnrolledCourses.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No enrolled courses found</h3>
                  <p className="text-muted-foreground mb-4">
                    {enrolledCourses.length === 0 
                      ? "You haven't enrolled in any courses yet. Start learning today!"
                      : "No courses match your current search criteria."
                    }
                  </p>
                  <Button>Browse Available Courses</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEnrolledCourses.map((course) => (
                  <CourseCard key={course.id} course={course} showProgress={true} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Available Courses */}
          <TabsContent value="available">
            {filteredAvailableCourses.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                  <p className="text-muted-foreground">
                    No courses match your current search criteria. Try adjusting your filters.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAvailableCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

        <Footer />
      </div>
    </div>
  );
};

export default StudentCourses;