import { Timer, Volume2, Music2, Zap, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const PracticeTools = () => {
  const tools = [
    {
      icon: Timer,
      name: "Metronome",
      description: "Keep perfect time with our advanced metronome",
      features: ["Variable BPM", "Time Signatures", "Accent Patterns"],
      color: "text-blue-500"
    },
    {
      icon: Volume2,
      name: "Tuner",
      description: "Precise tuning for all instruments",
      features: ["Auto-detection", "Custom Tunings", "Visual Feedback"],
      color: "text-green-500"
    },
    {
      icon: Music2,
      name: "Scale Trainer",
      description: "Master scales and arpeggios",
      features: ["All Modes", "Custom Exercises", "Progress Tracking"],
      color: "text-purple-500"
    },
    {
      icon: Zap,
      name: "Rhythm Trainer",
      description: "Develop your rhythmic skills",
      features: ["Pattern Recognition", "Tap Exercises", "Difficulty Levels"],
      color: "text-yellow-500"
    },
    {
      icon: Target,
      name: "Practice Planner",
      description: "Organize effective practice sessions",
      features: ["Session Goals", "Time Tracking", "Progress Reports"],
      color: "text-red-500"
    },
    {
      icon: TrendingUp,
      name: "Progress Analytics",
      description: "Track your musical growth",
      features: ["Performance Metrics", "Goal Setting", "Achievement Badges"],
      color: "text-indigo-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Professional Practice Tools
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Enhance your practice sessions with our comprehensive suite of tools 
            designed to accelerate your musical development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <Card key={tool.name} className="p-6 group hover:shadow-musical transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg bg-muted/50 ${tool.color} mr-4`}>
                  <tool.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">{tool.name}</h3>
              </div>
              
              <p className="text-muted-foreground mb-4">{tool.description}</p>
              
              <ul className="space-y-2 mb-6">
                {tool.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                variant="outline" 
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
              >
                Try {tool.name}
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="hero" size="lg">
            Access All Practice Tools
          </Button>
        </div>
      </div>
    </section>
  );
};