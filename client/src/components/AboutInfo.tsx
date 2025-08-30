import { Users, Target, Award, Heart } from "lucide-react";

export const AboutInfo = () => {
  const features = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To make quality music education accessible to everyone, everywhere, at any skill level."
    },
    {
      icon: Users,
      title: "Expert Instructors",
      description: "Learn from world-class musicians and certified music educators with years of experience."
    },
    {
      icon: Award,
      title: "Proven Results",
      description: "95% of our students achieve their musical goals within 6 months of starting their journey."
    },
    {
      icon: Heart,
      title: "Passionate Community",
      description: "Join a supportive community of music lovers who share your passion for learning and growth."
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why Choose HarmonyLearn?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're more than just an online music school. We're a community dedicated to 
            nurturing musical talent and helping you achieve your dreams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 bg-card rounded-xl shadow-musical hover:shadow-glow transition-all duration-300"
            >
              <div className="p-4 rounded-lg bg-primary/10 mb-4 mx-auto w-fit">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};