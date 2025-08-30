import { Music, Users, Video, BookOpen, Trophy, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: BookOpen,
    title: "Interactive Lessons",
    description: "Learn with hands-on lessons designed by professional musicians and educators.",
  },
  {
    icon: Users,
    title: "Expert Mentors",
    description: "Connect with experienced musicians who will guide your musical journey.",
  },
  {
    icon: Video,
    title: "Live Sessions",
    description: "Join real-time practice sessions and workshops with other learners.",
  },
  {
    icon: Music,
    title: "Practice Tools",
    description: "Access metronomes, tuners, and other essential practice equipment.",
  },
  {
    icon: Trophy,
    title: "Progress Tracking",
    description: "Monitor your improvement with detailed analytics and achievements.",
  },
  {
    icon: Star,
    title: "Community Support",
    description: "Share your progress and get feedback from fellow music enthusiasts.",
  },
];

export const FeaturesGrid = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            Everything You Need to Master Music
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From beginner to professional, our platform provides all the tools and support you need
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-musical transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};