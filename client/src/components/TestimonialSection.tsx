import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Piano Student",
    avatar: "/placeholder.svg",
    rating: 5,
    text: "HarmonyLearn transformed my piano skills. The interactive lessons and mentor support helped me progress faster than I ever imagined!",
  },
  {
    name: "Mike Chen",
    role: "Guitar Enthusiast",
    avatar: "/placeholder.svg", 
    rating: 5,
    text: "The live sessions are incredible. Playing with other musicians online feels just like being in a real jam session.",
  },
  {
    name: "Emily Davis",
    role: "Voice Coach",
    avatar: "/placeholder.svg",
    rating: 5,
    text: "As a mentor on this platform, I love how easy it is to connect with students and track their progress. The tools are fantastic!",
  },
];

export const TestimonialSection = () => {
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">What Our Musicians Say</h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of musicians who have transformed their skills with HarmonyLearn
          </p>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="bg-card/80 backdrop-blur border-border/50 hover:shadow-warm transition-all duration-300 h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                        ))}
                      </div>
                      
                      <p className="text-foreground mb-6 italic">
                        "{testimonial.text}"
                      </p>
                      
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                          <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};