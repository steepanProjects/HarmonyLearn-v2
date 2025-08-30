import { useState } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CourseManagementDashboard } from "@/components/course/CourseManagementDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { getCurrentUser, hasRole } from "@/lib/auth";

const CourseManagement = () => {
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
                You need to be a mentor or admin to manage courses.
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/courses")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Button>

          {(isMentor || isAdmin) && (
            <Button
              onClick={() => setLocation("/course-creation")}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create New Course
            </Button>
          )}
        </div>

        <CourseManagementDashboard />
      </div>

      <Footer />
    </div>
  );
};

export default CourseManagement;