import { Play, Users, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import heroImage from "@/assets/hero-music.jpg";
import heroStudio from "@/assets/hero-studio.jpg";
import heroConcert from "@/assets/hero-concert.jpg";
export const Hero = () => {
  const backgroundImages = [heroImage, heroStudio, heroConcert];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % backgroundImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);
  return <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => <div key={index} className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`} style={{
        backgroundImage: `url(${image})`
      }} />)}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-background/5"></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            Master Music with{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              HarmonyLearn
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-slide-up">
            Learn instruments, master techniques, and connect with a global community 
            of music enthusiasts. From beginner to virtuoso, your musical journey starts here.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-slide-up">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4" asChild>
              <Link to="/live-sessions">
                <Play className="mr-2 h-5 w-5" />
                Start Learning Now
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4" asChild>
              <Link to="/mentors">
                Browse Courses
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up">
            <div className="text-center p-4 bg-card/80 backdrop-blur rounded-lg shadow-musical">
              <div className="text-2xl font-bold text-primary mb-1">50K+</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center">
                <Users className="mr-1 h-4 w-4" />
                Students
              </div>
            </div>
            <div className="text-center p-4 bg-card/80 backdrop-blur rounded-lg shadow-musical">
              <div className="text-2xl font-bold text-primary mb-1">1.2K+</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center">
                <Play className="mr-1 h-4 w-4" />
                Courses
              </div>
            </div>
            <div className="text-center p-4 bg-card/80 backdrop-blur rounded-lg shadow-musical">
              <div className="text-2xl font-bold text-primary mb-1">800+</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center">
                <Award className="mr-1 h-4 w-4" />
                Mentors
              </div>
            </div>
            <div className="text-center p-4 bg-card/80 backdrop-blur rounded-lg shadow-musical">
              <div className="text-2xl font-bold text-primary mb-1">95%</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center">
                <TrendingUp className="mr-1 h-4 w-4" />
                Success Rate
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced floating elements with more musical symbols */}
      <div className="absolute top-20 left-20 opacity-20 animate-float">
        <div className="text-6xl">🎸</div>
      </div>
      <div className="absolute bottom-20 left-32 opacity-20 animate-float" style={{
        animationDelay: '1.5s'
      }}>
        <div className="text-5xl">♪</div>
      </div>
      <div className="absolute top-32 right-20 opacity-15 animate-float" style={{
        animationDelay: '3s'
      }}>
        <div className="text-4xl">🎹</div>
      </div>
      <div className="absolute bottom-32 right-32 opacity-20 animate-float" style={{
        animationDelay: '0.5s'
      }}>
        <div className="text-5xl">♫</div>
      </div>
    </section>;
};