import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Music, Users, Award, Star, Play, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import teamCollaboration from "@/assets/team-collaboration.jpg";
import teamMember1 from "@/assets/team-member-1.jpg";
import teamMember2 from "@/assets/team-member-2.jpg";
import teamMember3 from "@/assets/team-member-3.jpg";

const About = () => {
  const stats = [
    { icon: Users, value: "50,000+", label: "Happy Students" },
    { icon: BookOpen, value: "1,200+", label: "Courses Available" },
    { icon: Award, value: "800+", label: "Expert Instructors" },
    { icon: Star, value: "4.9/5", label: "Average Rating" }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      description: "Former Berklee graduate with 15+ years in music education",
      image: teamMember1
    },
    {
      name: "Marcus Rodriguez",
      role: "Head of Curriculum",
      description: "Grammy-nominated musician and pedagogy expert",
      image: teamMember2
    },
    {
      name: "Elena Chen",
      role: "Technology Director",
      description: "EdTech innovator passionate about accessible learning",
      image: teamMember3
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About <span className="bg-gradient-hero bg-clip-text text-transparent">HarmonyLearn</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Founded in 2018, HarmonyLearn has revolutionized music education by making 
            world-class instruction accessible to everyone, anywhere in the world.
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/courses">
              <Play className="mr-2 h-5 w-5" />
              Start Your Journey
            </Link>
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="p-4 rounded-lg bg-primary/10 mb-4 mx-auto w-fit">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section with Image */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8">Our Story</h2>
              <div className="prose prose-lg text-muted-foreground">
                <p className="text-lg leading-relaxed mb-6">
                  HarmonyLearn was born from a simple belief: everyone deserves access to quality music education, 
                  regardless of their location, schedule, or budget. Our founder, Sarah Johnson, experienced 
                  firsthand the transformative power of music education but also witnessed the barriers that 
                  prevented many from accessing it.
                </p>
                <p className="text-lg leading-relaxed mb-6">
                  What started as a small online platform with just 10 courses has grown into a global 
                  community of over 50,000 students and 800+ expert instructors. We've maintained our 
                  commitment to quality while continuously innovating to make learning more engaging, 
                  effective, and accessible.
                </p>
                <p className="text-lg leading-relaxed">
                  Today, HarmonyLearn offers everything from beginner-friendly tutorials to masterclasses 
                  with Grammy-winning artists. Our mission remains unchanged: to nurture musical talent 
                  and help every student find their unique voice.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src={teamCollaboration} 
                alt="Team collaboration at HarmonyLearn" 
                className="rounded-xl shadow-musical w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center p-6 bg-card rounded-xl shadow-musical">
                <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-4 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-muted-foreground">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;