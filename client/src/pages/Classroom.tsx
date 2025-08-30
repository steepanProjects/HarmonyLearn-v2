import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RoleSelector } from "@/components/classroom/RoleSelector";
import { ClassroomList } from "@/components/classroom/ClassroomList";
import { CreateClassroomButton } from "@/components/classroom/CreateClassroomButton";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, Clock, Star } from "lucide-react";

type Role = "master" | "staff" | "student";

const Classroom = () => {
  const [currentRole, setCurrentRole] = useState<Role>("student");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Role Selector */}
        <div className="mb-8">
          <RoleSelector currentRole={currentRole} onRoleChange={setCurrentRole} />
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Classroom Hub
              </h1>
              <p className="text-muted-foreground mt-2">
                {currentRole === "master" && "Manage your classrooms and track student progress"}
                {currentRole === "staff" && "Assist in classroom management and content delivery"}
                {currentRole === "student" && "Join classrooms and continue your learning journey"}
              </p>
            </div>
            
            {(currentRole === "master" || currentRole === "staff") && (
              <CreateClassroomButton role={currentRole} />
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-lg p-6 border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-muted-foreground">
                    {currentRole === "student" ? "Enrolled" : "Students"}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <BookOpen className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-sm text-muted-foreground">
                    {currentRole === "student" ? "Courses" : "Classrooms"}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold">24</div>
                  <div className="text-sm text-muted-foreground">Hours Learned</div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">850</div>
                  <div className="text-sm text-muted-foreground">XP Points</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Classroom List */}
        <ClassroomList role={currentRole} />
      </main>

      <Footer />
    </div>
  );
};

export default Classroom;