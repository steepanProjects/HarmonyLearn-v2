import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Music, Guitar, Piano, Mic, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { MentorProfile } from "@shared/schema";
import { MentorCardSkeleton } from "@/components/LoadingSkeletons";

export const MentorSection = () => {
  const { data: mentors, isLoading } = useQuery<MentorProfile[]>({
    queryKey: ['/api/mentors'],
  });

  // Show top 3 mentors for homepage
  const featuredMentors = mentors?.slice(0, 3) || [];

  const mentorBenefits = [
  {
    title: "Personalized Learning",
    description: "Get customized lessons tailored to your skill level and musical goals"
  },
  {
    title: "Real-time Feedback", 
    description: "Receive immediate guidance and corrections during live practice sessions"
  },
  {
    title: "Professional Network",
    description: "Connect with industry professionals and expand your musical connections"
  },
  {
    title: "Flexible Scheduling",
    description: "Book sessions that fit your schedule with mentors in different time zones"
  }
];

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            Learn from Expert Mentors
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with professional musicians and experienced teachers who will guide you 
            on your musical journey with personalized instruction and expert feedback.
          </p>
        </div>

        {/* Featured Mentors */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {isLoading ? (
            Array.from({ length: 3 }, (_, i) => (
              <MentorCardSkeleton key={i} />
            ))
          ) : featuredMentors.length > 0 ? (
            featuredMentors.map((mentor, index) => (
              <Card key={index} className="group hover:shadow-musical transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarFallback className="text-lg">
                      {mentor.firstName?.[0]}{mentor.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <CardTitle className="text-xl">{mentor.firstName} {mentor.lastName}</CardTitle>
                  <CardDescription className="flex items-center justify-center gap-2">
                    <Music className="h-4 w-4" />
                    Music Mentor
                  </CardDescription>
                  
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Star className="h-4 w-4 fill-secondary text-secondary" />
                    <span className="text-sm font-medium">{mentor.rating || 'New'}</span>
                    <span className="text-sm text-muted-foreground">({mentor.totalStudents || 0} students)</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {mentor.bio && (
                    <p className="text-sm text-muted-foreground mb-4 text-center">
                      {mentor.bio}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {mentor.specializations && mentor.specializations.length > 0 ? (
                      mentor.specializations.map((specialty, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Music Teacher
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    <div>${mentor.hourlyRate || 50}/hour</div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-muted-foreground">
                Amazing mentors are joining our platform. Check back soon!
              </p>
            </div>
          )}
        </div>

        {/* Mentor Benefits */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {mentorBenefits.map((benefit, index) => (
            <Card key={index} className="text-center border-accent/20 bg-gradient-to-b from-accent/5 to-transparent">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 text-accent">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" className="shadow-musical hover:shadow-glow transition-all" asChild>
            <Link to="/mentors">
              Find Your Perfect Mentor
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Over 500+ verified mentors • Free consultation available
          </p>
        </div>
      </div>
    </section>
  );
};