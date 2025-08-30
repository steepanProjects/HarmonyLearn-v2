import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EmptyState } from "@/components/EmptyState";
import { AuthDialog } from "@/components/AuthDialog";
import { getCurrentUser, isAuthenticated, onAuthStateChange, hasRole } from "@/lib/auth";
import { Search, Filter, Clock, Star, Users, BookOpen, TrendingUp, Award, Target, Zap, Guitar, Piano, Drum, Mic, Music4, Music, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CourseCard } from "@/components/CourseCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CourseCardSkeleton, LoadingGrid } from "@/components/LoadingSkeletons";

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  price: number;
  duration: number;
  mentorId: number;
  status: string;
  currentEnrollments: number;
  maxStudents: number;
  averageRating: number;
  totalRatings: number;
  estimatedWeeks: number;
  difficulty: number;
  tags: string[];
  prerequisites: string[];
  imageUrl?: string;
  mentorName?: string;
}

const Courses = () => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState("");
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [, setLocation] = useLocation();

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Listen for auth state changes
  useEffect(() => {
    const cleanup = onAuthStateChange((user) => {
      setCurrentUser(user);
    });
    
    return cleanup;
  }, []);

  // Fetch published courses
  const { data: courses = [], isLoading: coursesLoading, error } = useQuery<Course[]>({
    queryKey: ['/api/courses/published'],
    queryFn: () => apiRequest('/api/courses/published')
  });

  // Enrollment mutation
  const enrollMutation = useMutation({
    mutationFn: async (courseId: number) => {
      if (!currentUser) {
        throw new Error("Please sign in to enroll");
      }
      return apiRequest('/api/enrollments', {
        method: 'POST',
        body: JSON.stringify({
          userId: currentUser.id,
          courseId,
          status: 'active',
          enrolledAt: new Date().toISOString()
        })
      });
    },
    onSuccess: () => {
      toast({
        title: "Enrolled Successfully",
        description: "You have been enrolled in the course!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/enrollments'] });
    },
    onError: (error: any) => {
      toast({
        title: "Enrollment Failed",
        description: error.message || "Failed to enroll in course.",
        variant: "destructive",
      });
    }
  });

  const handleCourseEnroll = (courseId: number) => {
    if (!isAuthenticated()) {
      setAuthDialogOpen(true);
      return;
    }
    enrollMutation.mutate(courseId);
  };

  const handleCourseDetails = (courseId: number) => {
    setLocation(`/courses/${courseId}`);
  };

  const handleCourseManage = (courseId: number) => {
    setLocation(`/course-management/${courseId}`);
  };

  const handleFeatureClick = (feature: string) => {
    setSelectedFeature(feature);
    setAuthDialogOpen(true);
  };

  // Filter and sort courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
    const matchesLevel = levelFilter === "all" || course.level === levelFilter;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.averageRating - a.averageRating;
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
        return b.id - a.id;
      default: // popular
        return b.currentEnrollments - a.currentEnrollments;
    }
  });

  const categories = [
    { icon: Piano, name: "Piano", key: "piano", count: courses.filter(c => c.category === "piano").length, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { icon: Guitar, name: "Guitar", key: "guitar", count: courses.filter(c => c.category === "guitar").length, color: "text-green-500", bgColor: "bg-green-500/10" },
    { icon: Music4, name: "Violin", key: "violin", count: courses.filter(c => c.category === "violin").length, color: "text-purple-500", bgColor: "bg-purple-500/10" },
    { icon: Drum, name: "Drums", key: "drums", count: courses.filter(c => c.category === "drums").length, color: "text-red-500", bgColor: "bg-red-500/10" },
    { icon: Mic, name: "Vocals", key: "vocals", count: courses.filter(c => c.category === "vocals").length, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
    { icon: Music, name: "Theory", key: "theory", count: courses.filter(c => c.category === "theory").length, color: "text-indigo-500", bgColor: "bg-indigo-500/10" }
  ];

  const featuredCourses = sortedCourses.filter(course => course.averageRating >= 4.5).slice(0, 4);
  const popularCourses = sortedCourses.slice(0, 8);
  const beginnerCourses = sortedCourses.filter(course => course.level === "beginner");

  if (coursesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <div className="relative bg-gradient-hero overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 py-20 text-center">
            <div className="max-w-4xl mx-auto">
              <Badge className="mb-6 bg-white/20 text-white border-white/30">
                <Award className="mr-2 h-4 w-4" />
                Loading Courses...
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                Learn Music
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-red-300">
                  Your Way
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                Master any instrument with world-class instructors, interactive lessons, and a supportive community
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <LoadingGrid>
            <CourseCardSkeleton />
          </LoadingGrid>
        </div>
        
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <EmptyState
            icon={BookOpen}
            title="Unable to Load Courses"
            description="We're having trouble loading courses right now. Please try again later."
            actionText="Retry"
            onAction={() => window.location.reload()}
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              <Award className="mr-2 h-4 w-4" />
              {courses.length} Expert-Led Courses
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Learn Music
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-red-300">
                Your Way
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Master any instrument with world-class instructors, interactive lessons, and a supportive community
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search courses, instructors, or instruments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg bg-white/95 backdrop-blur border-white/20 focus:bg-white"
                />
              </div>
            </div>

            {/* Quick Actions for Mentors/Admins */}
            {(hasRole("mentor") || hasRole("admin")) && (
              <div className="mt-6">
                <Button
                  size="lg"
                  onClick={() => setLocation("/course-creation")}
                  className="bg-primary/20 backdrop-blur border border-primary/30 hover:bg-primary/30"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create Course
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Categories Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Explore by Instrument</h2>
            <p className="text-muted-foreground text-lg">Find your perfect musical journey</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Card 
                  key={category.key}
                  className={`cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 ${category.bgColor} border-0`}
                  onClick={() => setCategoryFilter(category.key)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`${category.color} mb-3 flex justify-center`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} courses</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.key} value={cat.key}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={levelFilter} onValueChange={setLevelFilter}>
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
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Course Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Discover Courses</h2>
              <p className="text-muted-foreground">Curated collections for every learning path</p>
            </div>
            <TabsList className="grid w-full md:w-auto grid-cols-4 mt-4 md:mt-0">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                All ({sortedCourses.length})
              </TabsTrigger>
              <TabsTrigger value="featured" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Featured ({featuredCourses.length})
              </TabsTrigger>
              <TabsTrigger value="popular" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Popular ({popularCourses.length})
              </TabsTrigger>
              <TabsTrigger value="beginner" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Beginner ({beginnerCourses.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="space-y-6">
            {sortedCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedCourses.map((course) => (
                  <CourseCard 
                    key={course.id} 
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    mentorName={course.mentorName || `Mentor ${course.mentorId}`}
                    duration={course.duration}
                    level={course.level}
                    category={course.category}
                    price={course.price}
                    averageRating={course.averageRating}
                    currentEnrollments={course.currentEnrollments}
                    maxStudents={course.maxStudents}
                    estimatedWeeks={course.estimatedWeeks}
                    difficulty={course.difficulty}
                    totalRatings={course.totalRatings}
                    tags={course.tags}
                    prerequisites={course.prerequisites}
                    imageUrl={course.imageUrl}
                    status={course.status}
                    onEnroll={handleCourseEnroll}
                    onViewDetails={handleCourseDetails}
                    onManage={hasRole("mentor") || hasRole("admin") ? handleCourseManage : undefined}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Search}
                title="No Courses Found"
                description="Try adjusting your search criteria or filters to find more courses."
                actionText="Clear Filters"
                onAction={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setLevelFilter("all");
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="featured" className="space-y-6">
            {featuredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredCourses.map((course) => (
                  <CourseCard 
                    key={course.id} 
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    mentorName={course.mentorName || `Mentor ${course.mentorId}`}
                    duration={course.duration}
                    level={course.level}
                    category={course.category}
                    price={course.price}
                    averageRating={course.averageRating}
                    currentEnrollments={course.currentEnrollments}
                    maxStudents={course.maxStudents}
                    estimatedWeeks={course.estimatedWeeks}
                    difficulty={course.difficulty}
                    totalRatings={course.totalRatings}
                    tags={course.tags}
                    prerequisites={course.prerequisites}
                    imageUrl={course.imageUrl}
                    status={course.status}
                    onEnroll={handleCourseEnroll}
                    onViewDetails={handleCourseDetails}
                    onManage={hasRole("mentor") || hasRole("admin") ? handleCourseManage : undefined}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Star}
                title="No Featured Courses Yet"
                description="We're curating amazing featured courses from our expert instructors. Check back soon!"
                actionText="View All Courses"
                onAction={() => {/* Switch to all tab */}}
              />
            )}
          </TabsContent>

          <TabsContent value="popular" className="space-y-6">
            {popularCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {popularCourses.map((course) => (
                  <CourseCard 
                    key={course.id} 
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    mentorName={course.mentorName || `Mentor ${course.mentorId}`}
                    duration={course.duration}
                    level={course.level}
                    category={course.category}
                    price={course.price}
                    averageRating={course.averageRating}
                    currentEnrollments={course.currentEnrollments}
                    maxStudents={course.maxStudents}
                    estimatedWeeks={course.estimatedWeeks}
                    difficulty={course.difficulty}
                    totalRatings={course.totalRatings}
                    tags={course.tags}
                    prerequisites={course.prerequisites}
                    imageUrl={course.imageUrl}
                    status={course.status}
                    onEnroll={handleCourseEnroll}
                    onViewDetails={handleCourseDetails}
                    onManage={hasRole("mentor") || hasRole("admin") ? handleCourseManage : undefined}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={TrendingUp}
                title="No Popular Courses Yet"
                description="Popular courses will appear here as students start enrolling."
                actionText="View All Courses"
                onAction={() => {/* Switch to all tab */}}
              />
            )}
          </TabsContent>

          <TabsContent value="beginner" className="space-y-6">
            {beginnerCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {beginnerCourses.map((course) => (
                  <CourseCard 
                    key={course.id} 
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    mentorName={course.mentorName || `Mentor ${course.mentorId}`}
                    duration={course.duration}
                    level={course.level}
                    category={course.category}
                    price={course.price}
                    averageRating={course.averageRating}
                    currentEnrollments={course.currentEnrollments}
                    maxStudents={course.maxStudents}
                    estimatedWeeks={course.estimatedWeeks}
                    difficulty={course.difficulty}
                    totalRatings={course.totalRatings}
                    tags={course.tags}
                    prerequisites={course.prerequisites}
                    imageUrl={course.imageUrl}
                    status={course.status}
                    onEnroll={handleCourseEnroll}
                    onViewDetails={handleCourseDetails}
                    onManage={hasRole("mentor") || hasRole("admin") ? handleCourseManage : undefined}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Target}
                title="No Beginner Courses Yet"
                description="Beginner-friendly courses will appear here as they become available."
                actionText="View All Courses"
                onAction={() => {/* Switch to all tab */}}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />

      <AuthDialog 
        open={authDialogOpen} 
        onOpenChange={setAuthDialogOpen}
      />
    </div>
  );
};

export default Courses;