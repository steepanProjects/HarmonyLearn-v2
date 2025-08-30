import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Music, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export const CTASection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <Card className="bg-gradient-hero border-none shadow-musical">
          <CardContent className="p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/20 rounded-full">
                  <Music className="h-12 w-12 text-white" />
                </div>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Start Your Musical Journey?
              </h2>
              
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of musicians who have transformed their skills with HarmonyLearn. 
                Start learning today with our expert instructors and interactive platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="text-lg px-8 py-4 shadow-warm hover:shadow-lg transition-all"
                  asChild
                >
                  <Link to="/courses">
                    Browse Courses
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
                  asChild
                >
                  <Link to="/mentors">Find a Mentor</Link>
                </Button>
              </div>
              
              <p className="text-white/70 mt-6 text-sm">
                Free trial • No credit card required • Cancel anytime
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};