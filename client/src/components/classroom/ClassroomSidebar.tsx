import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard,
  BookOpen,
  Users,
  Calendar,
  MessageSquare,
  BarChart3,
  Settings,
  Play,
  HelpCircle,
  Award,
  Target,
  Brain
} from "lucide-react";

type Role = "master" | "staff" | "student";

interface ClassroomSidebarProps {
  role: Role;
  activeTab: string;
  onTabChange: (tab: string) => void;
  classroomId: string;
}

const getTabsForRole = (role: Role) => {
  const commonTabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "lessons", label: "Lessons", icon: BookOpen },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "discussions", label: "Discussions", icon: MessageSquare },
  ];

  const studentTabs = [
    ...commonTabs,
    { id: "progress", label: "My Progress", icon: BarChart3 },
    { id: "assignments", label: "Assignments", icon: Target },
    { id: "ai-feedback", label: "AI Feedback", icon: Brain },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "doubts", label: "Ask Doubts", icon: HelpCircle },
  ];

  const mentorTabs = [
    ...commonTabs,
    { id: "students", label: "Students", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "content", label: "Content", icon: BookOpen },
    { id: "live-sessions", label: "Live Sessions", icon: Play },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return role === "student" ? studentTabs : mentorTabs;
};

export const ClassroomSidebar = ({ role, activeTab, onTabChange, classroomId }: ClassroomSidebarProps) => {
  const tabs = getTabsForRole(role);

  return (
    <Card className="w-64 h-fit">
      <CardContent className="p-4">
        <div className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant={isActive ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onTabChange(tab.id)}
              >
                <Icon className="h-4 w-4 mr-3" />
                {tab.label}
                {tab.id === "doubts" && role === "student" && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    3
                  </Badge>
                )}
                {tab.id === "assignments" && role === "student" && (
                  <Badge variant="destructive" className="ml-auto text-xs">
                    2
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="text-sm font-medium mb-3">Quick Actions</h4>
          <div className="space-y-2">
            {role === "student" ? (
              <>
                <Button variant="outline" size="sm" className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Practice Mode
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Ask Question
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Start Live Class
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Announcement
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Classroom Info */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Classroom Info</h4>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>24 students enrolled</div>
            <div>12 lessons completed</div>
            <div>Next class: Tomorrow 2:00 PM</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};