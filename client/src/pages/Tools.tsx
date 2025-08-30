import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuthDialog } from "@/components/AuthDialog";
import { getCurrentUser, isAuthenticated, onAuthStateChange } from "@/lib/auth";
import { 
  Music, 
  Timer,
  Target,
  Zap,
  BookOpen,
  TrendingUp
} from "lucide-react";

const Tools = () => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState("");
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  // Listen for auth state changes
  useEffect(() => {
    const cleanup = onAuthStateChange((user) => {
      setCurrentUser(user);
    });
    
    return cleanup;
  }, []);

  const handleToolClick = (tool: any) => {
    // Always show sign-in dialog for demo - this is a preview page
    setSelectedFeature(tool.title);
    setAuthDialogOpen(true);
  };
  const tools = [
    {
      category: "Practice Essentials",
      items: [
        {
          title: "Metronome",
          description: "Professional metronome with customizable beats and subdivisions",
          icon: Timer,
          color: "bg-blue-500",
          featured: true,
          href: "/tools/metronome"
        },
        {
          title: "Chromatic Tuner",
          description: "Accurate tuning for all instruments with visual feedback",
          icon: Target,
          color: "bg-green-500",
          featured: true,
          href: "/tools/tuner"
        },
        {
          title: "Scale Trainer",
          description: "Practice scales and modes with audio playback",
          icon: Music,
          color: "bg-purple-500",
          featured: true,
          href: "/tools/scale-trainer"
        }
      ]
    },
    {
      category: "Theory & Training",
      items: [
        {
          title: "Rhythm Trainer",
          description: "Master complex rhythms with visual and audio cues",
          icon: Zap,
          color: "bg-yellow-500",
          featured: false,
          href: "/tools/rhythm-trainer"
        },
        {
          title: "Practice Planner",
          description: "Organize effective practice sessions with goals and timing",
          icon: BookOpen,
          color: "bg-red-500",
          featured: false,
          href: "/tools/practice-planner"
        },
        {
          title: "Progress Analytics",
          description: "Track your musical growth with detailed performance metrics",
          icon: TrendingUp,
          color: "bg-indigo-500",
          featured: false,
          href: "/tools/progress-analytics"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="mb-8">
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Music className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold bg-gradient-hero bg-clip-text text-transparent">
                  Professional Practice Tools
                </h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Enhance your musical journey with our comprehensive suite of practice tools. From metronomes to ear training, everything you need to excel.
              </p>
              <Button onClick={() => handleToolClick({ title: "practice tools" })} className="bg-gradient-hero hover:opacity-90">
                Start Practicing
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Practice Tools Grid with Overlay */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent z-20 pointer-events-none" />
          <div className="space-y-12 relative">
            {tools.map((category) => (
              <div key={category.category}>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  {category.category}
                  <Badge variant="outline" className="text-xs">
                    {category.items.length} tools
                  </Badge>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((tool) => (
                    <Card 
                      key={tool.title} 
                      className="group hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                      onClick={() => handleToolClick(tool)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className={`p-3 rounded-lg ${tool.color} text-white mr-4 group-hover:scale-110 transition-transform`}>
                            <tool.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{tool.title}</h3>
                            {tool.featured && (
                              <Badge variant="default" className="text-xs mt-1">Featured</Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                          {tool.description}
                        </p>
                        
                        <Button 
                          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                          variant="outline"
                        >
                          Open {tool.title}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
      
      <AuthDialog 
        open={authDialogOpen} 
        onOpenChange={setAuthDialogOpen}
        featureName={selectedFeature}
      />
    </div>
  );
};

export default Tools;