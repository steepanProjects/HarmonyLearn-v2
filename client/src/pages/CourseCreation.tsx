import { useState } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CourseCreationForm } from "@/components/course/CourseCreationForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { getCurrentUser, hasRole } from "@/lib/auth";

const CourseCreation = () => {
  const [, setLocation] = useLocation();
  const currentUser = getCurrentUser();
  const isMentor = hasRole("mentor");
  const isAdmin = hasRole("admin");

  // Redirect if not authorized
  if (!currentUser || (!isMentor && !isAdmin)) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You need to be a mentor or admin to create courses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setLocation("/courses")} className="w-full">
                Back to Courses
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSuccess = () => {
    setLocation("/course-management");
  };

  const handleCancel = () => {
    setLocation("/courses");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/courses")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Button>
        </div>

        <CourseCreationForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>

      <Footer />
    </div>
  );
};

export default CourseCreation;