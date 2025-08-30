import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    number: "50,000+",
    label: "Active Students",
    description: "Musicians learning daily",
  },
  {
    number: "500+",
    label: "Expert Mentors",
    description: "Professional instructors",
  },
  {
    number: "1,000+", 
    label: "Courses Available",
    description: "Across all instruments",
  },
  {
    number: "98%",
    label: "Success Rate",
    description: "Students achieve their goals",
  },
];

export const StatsSection = () => {
  return (
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Join Our Growing Community</h2>
          <p className="text-xl text-muted-foreground">
            See why musicians worldwide choose HarmonyLearn for their musical journey
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-none bg-transparent">
              <CardContent className="p-6">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2 animate-pulse-glow">
                  {stat.number}
                </div>
                <h3 className="text-lg font-semibold mb-1">{stat.label}</h3>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};