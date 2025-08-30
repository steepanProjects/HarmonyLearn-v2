import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Shield, GraduationCap } from "lucide-react";

type Role = "master" | "staff" | "student";

interface RoleSelectorProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

const roleConfig = {
  master: {
    label: "Master",
    description: "Classroom Owner & Manager",
    icon: Crown,
    color: "bg-gradient-to-r from-yellow-500 to-orange-500",
    textColor: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20"
  },
  staff: {
    label: "Staff",
    description: "Assistant & Content Manager", 
    icon: Shield,
    color: "bg-gradient-to-r from-blue-500 to-indigo-500",
    textColor: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20"
  },
  student: {
    label: "Student",
    description: "Learner & Participant",
    icon: GraduationCap,
    color: "bg-gradient-to-r from-green-500 to-emerald-500",
    textColor: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/20"
  }
};

export const RoleSelector = ({ currentRole, onRoleChange }: RoleSelectorProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-1">Testing Mode - Switch Roles</h3>
            <p className="text-sm text-muted-foreground">
              Switch between different roles to test the classroom experience
            </p>
          </div>
          
          <div className="flex gap-2">
            {Object.entries(roleConfig).map(([role, config]) => {
              const Icon = config.icon;
              const isActive = currentRole === role;
              
              return (
                <Button
                  key={role}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => onRoleChange(role as Role)}
                  className={`flex items-center gap-2 ${
                    isActive ? config.color : ""
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {config.label}
                </Button>
              );
            })}
          </div>
        </div>
        
        {/* Current Role Display */}
        <div className={`mt-4 p-3 rounded-lg ${roleConfig[currentRole].bgColor}`}>
          <div className="flex items-center gap-2">
            {(() => {
              const CurrentIcon = roleConfig[currentRole].icon;
              return <CurrentIcon className={`h-5 w-5 ${roleConfig[currentRole].textColor}`} />;
            })()}
            <span className="font-medium">Current Role: {roleConfig[currentRole].label}</span>
            <Badge variant="secondary" className="text-xs">
              {roleConfig[currentRole].description}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};