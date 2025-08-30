import { Guitar, Piano, Drum, Mic, Music4, Music } from "lucide-react";
import { useLocation } from "wouter";
import { CourseCard } from "./CourseCard";
import { useQuery } from "@tanstack/react-query";
import type { Course } from "@shared/schema";
import { CourseCardSkeleton } from "./LoadingSkeletons";

interface CourseCategoriesProps {
  onCourseClick?: (courseId: number, courseName: string) => void;
}

export const CourseCategories = ({ onCourseClick }: CourseCategoriesProps = {}) => {
  const [, setLocation] = useLocation();
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  const handleCourseClick = (courseId: number, courseName: string) => {
    if (onCourseClick) {
      onCourseClick(courseId, courseName);
    } else {
      // Default behavior: navigate to course detail page
      setLocation(`/courses/${courseId}`);
    }
  };

  const categories = [
    { icon: Piano, name: "Piano", count: courses?.filter(c => c.category === "piano").length || 0, color: "text-blue-500" },
    { icon: Guitar, name: "Guitar", count: courses?.filter(c => c.category === "guitar").length || 0, color: "text-green-500" },
    { icon: Music4, name: "Violin", count: courses?.filter(c => c.category === "violin").length || 0, color: "text-purple-500" },
    { icon: Drum, name: "Drums", count: courses?.filter(c => c.category === "drums").length || 0, color: "text-red-500" },
    { icon: Mic, name: "Vocals", count: courses?.filter(c => c.category === "vocals").length || 0, color: "text-yellow-500" },
    { icon: Music, name: "Theory", count: courses?.filter(c => c.category === "theory").length || 0, color: "text-indigo-500" }
  ];

  // Show top 4 courses for homepage (first 4 as featured)
  const featuredCourses = courses?.slice(0, 4) || [];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Categories */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Learn Any Instrument
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Choose from our wide selection of instrument courses taught by world-class musicians
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <div
                key={category.name}
                className="group p-6 bg-card rounded-xl shadow-musical hover:shadow-glow transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <div className={`p-4 rounded-lg bg-muted/50 mb-4 ${category.color} mx-auto w-fit group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300`}>
                  <category.icon className="h-8 w-8" />
                </div>
                <h3 className="font-semibold mb-2">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.count} courses</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Courses */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold mb-8 text-center">Featured Courses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 4 }, (_, i) => (
                <CourseCardSkeleton key={i} />
              ))
            ) : featuredCourses.length > 0 ? (
              featuredCourses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  title={course.title}
                  instructor={`Mentor ID: ${course.mentorId || 'TBD'}`}
                  rating={4.5}
                  students={Math.floor(Math.random() * 1000) + 100}
                  duration={`${course.duration || 30}h`}
                  level={course.level as any}
                  price={course.price || "Free"}
                  image={course.imageUrl || ""}
                  category={course.category}
                  onClick={() => handleCourseClick(course.id, course.title)}
                />
              ))
            ) : (
              <div className="col-span-4 text-center py-8">
                <p className="text-muted-foreground">
                  Featured courses coming soon! Check out our course catalog for amazing learning opportunities.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};