import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star, CheckCircle, PlayCircle, BookOpen, Trophy, ArrowRight, GraduationCap } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { LearningPath } from "@shared/schema";
import { EmptyState } from "@/components/EmptyState";
import { CourseCardSkeleton, LoadingGrid } from "@/components/LoadingSkeletons";

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "beginner":
      return "bg-green-100 text-green-800 border-green-200";
    case "intermediate":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "advanced":
      return "bg-red-100 text-red-800 border-red-200";
    case "all-levels":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const LearningPaths = () => {
  const { data: learningPaths, isLoading, error } = useQuery<LearningPath[]>({
    queryKey: ['/api/learning-paths'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              Structured Learning Paths
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Follow carefully designed learning journeys created by expert musicians. 
              Each path takes you from where you are to where you want to be, step by step.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" variant="secondary" className="shadow-warm" disabled>
                <PlayCircle className="mr-2 h-5 w-5" />
                Start Learning Today
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20" disabled>
                View All Paths
              </Button>
            </div>
          </div>
        </section>

        {/* Loading Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Choose Your Musical Journey</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Loading available learning paths...
              </p>
            </div>
            <LoadingGrid count={6}>
              <CourseCardSkeleton />
            </LoadingGrid>
          </div>
        </section>
        
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="text-lg text-red-600">Error loading learning paths. Please try again later.</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Structured Learning Paths
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Follow carefully designed learning journeys created by expert musicians. 
            Each path takes you from where you are to where you want to be, step by step.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="secondary" className="shadow-warm">
              <PlayCircle className="mr-2 h-5 w-5" />
              Start Learning Today
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              View All Paths
            </Button>
          </div>
        </div>
      </section>

      {/* Learning Paths Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose Your Musical Journey</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Each learning path is designed to take you from beginner to proficient, 
              with clear milestones and expert guidance along the way.
            </p>
          </div>

          {/* Learning Paths Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {learningPaths && learningPaths.length > 0 ? (
              learningPaths.map((path) => (
                <Card key={path.id} className="group hover:shadow-musical transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={getDifficultyColor(path.difficulty)}>
                        {path.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-secondary text-secondary" />
                        <span className="text-sm font-medium">{path.rating || '0'}</span>
                      </div>
                    </div>
                    
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {path.title}
                    </CardTitle>
                    
                    <CardDescription className="text-base">
                      {path.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Course Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{path.duration || 'TBD'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{path.lessonsCount || 0} lessons</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{path.enrolledCount || 0} students</span>
                      </div>
                    </div>

                    {/* Skills */}
                    {path.skills && path.skills.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">You'll learn:</p>
                        <div className="flex flex-wrap gap-1">
                          {path.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Instructor ID (would need to fetch instructor name separately) */}
                    <div className="text-sm text-muted-foreground mb-4">
                      Instructor ID: <span className="font-medium text-foreground">{path.instructorId || 'TBD'}</span>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-primary">
                        {path.price || 'Free'}
                      </div>
                      <Button className="shadow-musical" asChild>
                        <Link to={`/learning-paths/${path.id}`}>
                          Start Path
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full">
                <EmptyState
                  icon={GraduationCap}
                  title="No Learning Paths Yet"
                  description="We're working on creating amazing structured learning paths for you. Check back soon for comprehensive guided learning journeys!"
                  actionText="Browse Courses"
                  onAction={() => window.location.href = '/courses'}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Structured Learning?</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-none bg-transparent">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Clear Progression</h3>
                <p className="text-muted-foreground">
                  Follow a proven path with clear milestones and achievements to track your progress.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-none bg-transparent">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Guidance</h3>
                <p className="text-muted-foreground">
                  Learn from professional musicians who have designed each step for maximum effectiveness.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-none bg-transparent">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-cool rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community Support</h3>
                <p className="text-muted-foreground">
                  Connect with fellow learners on the same path and share your musical journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};