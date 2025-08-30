import { useState } from "react";
import { useParams } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RoleSelector } from "@/components/classroom/RoleSelector";
import { LiveClassInterface } from "@/components/classroom/LiveClassInterface";

type Role = "master" | "staff" | "student";

const LiveClass = () => {
  const { id } = useParams();
  const [currentRole, setCurrentRole] = useState<Role>("student");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Role Selector */}
        <div className="mb-6">
          <RoleSelector currentRole={currentRole} onRoleChange={setCurrentRole} />
        </div>

        {/* Live Class Interface */}
        <LiveClassInterface role={currentRole} classId={id || ""} />
      </main>

      <Footer />
    </div>
  );
};

export default LiveClass;