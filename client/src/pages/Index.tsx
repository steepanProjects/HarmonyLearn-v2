import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CourseCategories } from "@/components/CourseCategories";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { MentorSection } from "@/components/MentorSection";
import { StatsSection } from "@/components/StatsSection";
import { TestimonialSection } from "@/components/TestimonialSection";
import { CTASection } from "@/components/CTASection";
import { AboutInfo } from "@/components/AboutInfo";
import { Footer } from "@/components/Footer";
const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <Header />
      <Hero />
      <CourseCategories />
      <FeaturesGrid />
      <MentorSection />
      <StatsSection />
      <TestimonialSection />
      <AboutInfo />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
