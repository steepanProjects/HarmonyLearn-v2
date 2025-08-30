import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RoleSelector } from "@/components/classroom/RoleSelector";
import { ManagementTabs } from "@/components/classroom/ManagementTabs";

type Role = "master" | "staff" | "student";

const ClassroomManage = () => {
  const [currentRole, setCurrentRole] = useState<Role>("master");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Role Selector */}
        <div className="mb-8">
          <RoleSelector currentRole={currentRole} onRoleChange={setCurrentRole} />
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Classroom Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage classrooms, students, content, and analytics
          </p>
        </div>

        {/* Management Interface */}
        <ManagementTabs role={currentRole} />
      </main>

      <Footer />
    </div>
  );
};

export default ClassroomManage;