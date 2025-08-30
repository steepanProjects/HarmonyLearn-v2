import { useState } from "react";
import { useParams } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ClassroomSidebar } from "@/components/classroom/ClassroomSidebar";
import { ClassroomContent } from "@/components/classroom/ClassroomContent";
import { RoleSelector } from "@/components/classroom/RoleSelector";

type Role = "master" | "staff" | "student";

const ClassroomDashboard = () => {
  const { id } = useParams();
  const [currentRole, setCurrentRole] = useState<Role>("student");
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Role Selector */}
        <div className="mb-6">
          <RoleSelector currentRole={currentRole} onRoleChange={setCurrentRole} />
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <ClassroomSidebar 
            role={currentRole} 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            classroomId={id || ""}
          />

          {/* Main Content */}
          <div className="flex-1">
            <ClassroomContent 
              role={currentRole} 
              activeTab={activeTab}
              classroomId={id || ""}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ClassroomDashboard;