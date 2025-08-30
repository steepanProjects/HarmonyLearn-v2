import { Star, MapPin, Clock, Video, Calendar, MessageCircle, Award, TrendingUp, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import type { MentorProfile } from "@shared/schema";
import { EmptyState } from "@/components/EmptyState";
import { MentorCardSkeleton, LoadingGrid } from "@/components/LoadingSkeletons";

export const MentorPage = () => {
  // Check if user is a mentor and redirect to dashboard
  const currentUser = localStorage.getItem("currentUser");
  const user = currentUser ? JSON.parse(currentUser) : null;
  if (user?.role === "mentor") {
    window.location.href = "/mentor-dashboard";
    return null;
  }

  const { data: mentors, isLoading, error } = useQuery<MentorProfile[]>({
    queryKey: ['/api/mentors'],
  });

  // Function to handle mentor interaction (contact, book session, etc.)
  const handleMentorInteraction = (action: string) => {
    window.location.href = '/get-started';
  };

  const mentorStats = [
    { label: "Total Students Taught", value: "12,547", icon: TrendingUp },
    { label: "Live Sessions This Month", value: "89", icon: Video },
    { label: "Average Rating", value: "4.8", icon: Star },
    { label: "Success Rate", value: "96%", icon: Award }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Learn from Expert Musicians
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Loading our amazing community of professional musicians and teachers...
            </p>
          </div>

          {/* Stats Section */}
          <section className="mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {mentorStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index} className="p-6 text-center">
                    <IconComponent className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Loading Mentors */}
          <section>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Our Expert Mentors</h2>
              <div className="flex gap-2">
                <Button variant="outline" disabled>Filter by Instrument</Button>
                <Button variant="outline" disabled>Sort by Rating</Button>
              </div>
            </div>
            <LoadingGrid count={6} className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              <MentorCardSkeleton />
            </LoadingGrid>
          </section>
        </div>

        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="text-lg text-red-600">Error loading mentors. Please try again later.</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Learn from Expert Musicians
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with professional musicians and experienced teachers from around the world. 
            Get personalized guidance to accelerate your musical journey.
          </p>
        </div>

        {/* Stats Section */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {mentorStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="p-6 text-center hover:shadow-musical transition-all duration-300">
                  <IconComponent className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-xl p-6 mb-8 border border-primary/20">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Connect with Professional Musicians</h3>
            <p className="text-lg text-muted-foreground mb-4">
              Get personalized lessons and guidance from expert instructors. Join to unlock one-on-one mentorship.
            </p>
            <Button 
              onClick={() => handleMentorInteraction('join')}
              className="bg-gradient-hero text-white shadow-glow hover:shadow-glow-lg transition-all"
            >
              Start Learning with a Mentor
            </Button>
          </div>
        </div>

        {/* Mentors Grid with Overlay */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent z-20 pointer-events-none" />
          
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Our Expert Mentors</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleMentorInteraction('filter')}>Filter by Instrument</Button>
              <Button variant="outline" onClick={() => handleMentorInteraction('sort')}>Sort by Rating</Button>
            </div>
          </div>

          {mentors && mentors.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {mentors.map((mentor) => (
                <Card key={mentor.id} className="group hover:shadow-musical transition-all duration-300 hover:-translate-y-1">
                  <div className="p-6">
                    {/* Mentor Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-lg font-semibold">
                          M{mentor.id}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                          Music Mentor #{mentor.id}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="h-4 w-4 fill-secondary text-secondary" />
                          <span className="font-medium">4.8</span>
                          <span className="text-muted-foreground text-sm">
                            ({Math.floor(Math.random() * 500) + 50} students)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Specialization & Experience */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {mentor.specialization ? (
                          <Badge variant="secondary" className="text-xs">
                            {mentor.specialization}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            General Music
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    {mentor.bio && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {mentor.bio}
                      </p>
                    )}

                    {/* Pricing & Action */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-lg font-bold text-primary">
                        ${mentor.hourlyRate || 50}/hour
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleMentorInteraction('message')}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          className="shadow-musical"
                          onClick={() => handleMentorInteraction('book')}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Book Session
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={UserCheck}
              title="No Mentors Available"
              description="We're building an amazing community of expert musicians and teachers. Our mentors will offer personalized guidance, live sessions, and structured learning paths. Stay tuned as we onboard talented instructors from around the world."
              actionText="Join as Mentor"
              onAction={() => window.location.href = '/mentor-signup'}
            />
          )}
        </section>

        {/* How It Works */}
        <section className="py-16 mt-16 bg-muted/30 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How Mentorship Works</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 px-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Mentor</h3>
              <p className="text-muted-foreground">
                Browse profiles, read reviews, and select a mentor that matches your learning goals and style.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Schedule Sessions</h3>
              <p className="text-muted-foreground">
                Book one-on-one video sessions at times that work for both you and your mentor.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-cool rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-muted-foreground">
                Get personalized feedback, practice plans, and watch your skills improve week by week.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};