import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AuthDialog } from "@/components/AuthDialog";
import { getCurrentUser, isAuthenticated, onAuthStateChange } from "@/lib/auth";
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  Download, 
  Share2, 
  Heart,
  ChevronLeft,
  CheckCircle,
  PlayCircle,
  Trophy,
  Award,
  MessageCircle
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Course } from "@shared/schema";

const CourseDetail = () => {
  const params = useParams();
  const [, setLocation] = useLocation();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const cleanup = onAuthStateChange((user) => {
      setCurrentUser(user);
    });
    
    return cleanup;
  }, []);

  const courseId = params.id;

  const { data: courses } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  const course = courses?.find(c => c.id.toString() === courseId);

  const handleEnrollClick = () => {
    const user = getCurrentUser();
    if (user && user.role === 'student') {
      setIsEnrolled(true);
      // In a real app, make API call to enroll user
      console.log("Enrolling user in course:", course?.title);
    } else if (!user) {
      setAuthDialogOpen(true);
    } else {
      // User is authenticated but not a student
      alert("Only student accounts can enroll in courses. Please sign in with a student account.");
    }
  };

  const handleStartLearning = () => {
    const user = getCurrentUser();
    if (user && user.role === 'student') {
      // Navigate to lesson or learning interface
      console.log("Starting course:", course?.title);
    } else if (!user) {
      setAuthDialogOpen(true);
    } else {
      // User is authenticated but not a student
      alert("Only student accounts can access course content. Please sign in with a student account.");
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <p className="text-muted-foreground mb-8">The course you're looking for doesn't exist.</p>
          <Link to="/courses">
            <Button>Browse All Courses</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Mock data for demo purposes - in real app would come from API
  const lessons = [
    { id: 1, title: "Introduction to Fundamentals", duration: "15 min", isCompleted: false, isLocked: false },
    { id: 2, title: "Basic Techniques", duration: "22 min", isCompleted: false, isLocked: !isEnrolled },
    { id: 3, title: "Practice Exercises", duration: "18 min", isCompleted: false, isLocked: !isEnrolled },
    { id: 4, title: "Advanced Concepts", duration: "25 min", isCompleted: false, isLocked: !isEnrolled },
    { id: 5, title: "Final Project", duration: "30 min", isCompleted: false, isLocked: !isEnrolled },
  ];

  const reviews = [
    { id: 1, name: "Sarah Johnson", rating: 5, comment: "Excellent course! The instructor explains everything clearly and the practice exercises are very helpful.", date: "2 weeks ago" },
    { id: 2, name: "Mike Chen", rating: 4, comment: "Great content and structure. I learned a lot from this course.", date: "1 month ago" },
    { id: 3, name: "Emma Davis", rating: 5, comment: "Perfect for beginners. The pace is just right and the examples are practical.", date: "3 weeks ago" },
  ];

  const instructor = {
    name: `Instructor ${course.mentorId || 'TBD'}`,
    bio: "Expert musician with over 10 years of teaching experience",
    rating: 4.9,
    students: 15000,
    courses: 12
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Course Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/courses">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Courses
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{course.category}</Badge>
                <Badge className="bg-green-100 text-green-800">{course.level}</Badge>
              </div>
              
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">
                {course.description || "Master the fundamentals with expert guidance and hands-on practice."}
              </p>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-foreground">4.8</span>
                  <span>(1,234 reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>2,456 students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration || 30}h total</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{lessons.length} lessons</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-primary">
                  {course.price || "Free"}
                </span>
                {course.price && course.price !== "Free" && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${(parseInt(course.price.replace('$', '')) * 1.5).toFixed(0)}
                  </span>
                )}
              </div>
            </div>
            
            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="relative z-10 rounded-full w-16 h-16"
                      onClick={handleStartLearning}
                    >
                      <Play className="h-8 w-8" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEnrolled ? (
                    <>
                      <Button 
                        className="w-full gap-2" 
                        size="lg"
                        onClick={handleStartLearning}
                      >
                        <PlayCircle className="h-5 w-5" />
                        Continue Learning
                      </Button>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>15%</span>
                        </div>
                        <Progress value={15} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          1 of {lessons.length} lessons completed
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Button 
                        className="w-full gap-2" 
                        size="lg"
                        onClick={handleEnrollClick}
                      >
                        Enroll Now
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        30-day money-back guarantee
                      </p>
                    </>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Heart className="h-4 w-4" />
                      Save
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6 mt-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4">What you'll learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Master fundamental techniques",
                      "Develop proper practice habits", 
                      "Build a strong musical foundation",
                      "Learn essential theory concepts",
                      "Play your first complete pieces",
                      "Gain confidence in performance"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-4">Course Description</h3>
                  <div className="prose prose-gray max-w-none">
                    <p>
                      This comprehensive course is designed for absolute beginners who want to start their musical journey. 
                      You'll learn fundamental techniques, proper form, and essential theory that will serve as the foundation 
                      for your musical development.
                    </p>
                    <p>
                      Through a combination of video lessons, practice exercises, and real-world examples, you'll develop 
                      the skills and confidence needed to continue your musical education. No prior experience is required.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-4">Requirements</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• No prior musical experience required</li>
                    <li>• Access to the relevant instrument</li>
                    <li>• Willingness to practice regularly</li>
                    <li>• Computer or mobile device for online access</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="curriculum" className="space-y-4 mt-6">
                <h3 className="text-2xl font-bold mb-4">Course Curriculum</h3>
                <div className="space-y-3">
                  {lessons.map((lesson) => (
                    <Card key={lesson.id} className={lesson.isLocked ? "opacity-60" : ""}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            {lesson.isCompleted ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : lesson.isLocked ? (
                              <div className="w-3 h-3 bg-muted-foreground rounded-full" />
                            ) : (
                              <PlayCircle className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">{lesson.title}</h4>
                            <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                          </div>
                        </div>
                        {lesson.isLocked && (
                          <Badge variant="outline">Locked</Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="instructor" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                        {instructor.name.charAt(0)}
                      </div>
                      <div>
                        <CardTitle>{instructor.name}</CardTitle>
                        <p className="text-muted-foreground">{instructor.bio}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">{instructor.rating}</div>
                        <div className="text-sm text-muted-foreground">Rating</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{instructor.students.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Students</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{instructor.courses}</div>
                        <div className="text-sm text-muted-foreground">Courses</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="space-y-6 mt-6">
                <div className="flex items-center gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold">4.8</div>
                    <div className="flex items-center gap-1 justify-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">Course rating</div>
                  </div>
                  <div className="flex-1">
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-sm">{stars}</span>
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          </div>
                          <Progress 
                            value={stars === 5 ? 75 : stars === 4 ? 20 : 5} 
                            className="flex-1 h-2" 
                          />
                          <span className="text-sm text-muted-foreground">
                            {stars === 5 ? '75%' : stars === 4 ? '20%' : '5%'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {review.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{review.name}</h4>
                              <div className="flex items-center gap-1">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">{review.date}</span>
                            </div>
                            <p className="text-muted-foreground">{review.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Course Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: PlayCircle, text: "On-demand video lessons" },
                  { icon: Download, text: "Downloadable resources" },
                  { icon: Award, text: "Certificate of completion" },
                  { icon: MessageCircle, text: "Q&A support" },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <feature.icon className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature.text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Related Courses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {courses?.slice(0, 3).filter(c => c.id !== course.id).map((relatedCourse) => (
                  <Link key={relatedCourse.id} to={`/courses/${relatedCourse.id}`}>
                    <div className="flex gap-3 hover:bg-muted/50 p-2 rounded-lg transition-colors cursor-pointer">
                      <div className="w-16 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex-shrink-0"></div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2">{relatedCourse.title}</h4>
                        <p className="text-xs text-muted-foreground">{relatedCourse.price || "Free"}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
      
      <AuthDialog 
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
      />
    </div>
  );
};

export default CourseDetail;