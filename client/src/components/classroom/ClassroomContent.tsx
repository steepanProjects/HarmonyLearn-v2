import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BookOpen, 
  Play, 
  Clock, 
  Users, 
  TrendingUp, 
  Award,
  Calendar,
  MessageSquare,
  Target,
  Brain
} from "lucide-react";

type Role = "master" | "staff" | "student";

interface ClassroomContentProps {
  role: Role;
  activeTab: string;
  classroomId: string;
}

export const ClassroomContent = ({ role, activeTab, classroomId }: ClassroomContentProps) => {
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Advanced Piano Techniques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Master advanced piano playing techniques and musical expression through structured lessons and practice.
          </p>
          <div className="flex items-center gap-4">
            <Badge>Advanced Level</Badge>
            <Badge variant="secondary">Piano</Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              24 students
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {role === "student" ? "Your Progress" : "Class Progress"}
                </p>
                <p className="text-2xl font-bold">75%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <Progress value={75} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Next Class</p>
                <p className="text-lg font-semibold">Tomorrow 2:00 PM</p>
              </div>
              <Clock className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {role === "student" ? "XP Points" : "Active Students"}
                </p>
                <p className="text-2xl font-bold">
                  {role === "student" ? "1,250" : "18"}
                </p>
              </div>
              {role === "student" ? (
                <Award className="h-8 w-8 text-accent" />
              ) : (
                <Users className="h-8 w-8 text-accent" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "Completed Lesson 8: Advanced Harmonies", time: "2 hours ago", type: "lesson" },
              { action: "New assignment posted: Chopin Etude Analysis", time: "1 day ago", type: "assignment" },
              { action: "Live class recording available", time: "2 days ago", type: "recording" }
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className={`p-2 rounded-full ${
                  activity.type === "lesson" ? "bg-primary/10" :
                  activity.type === "assignment" ? "bg-secondary/10" : "bg-accent/10"
                }`}>
                  {activity.type === "lesson" && <BookOpen className="h-4 w-4" />}
                  {activity.type === "assignment" && <Target className="h-4 w-4" />}
                  {activity.type === "recording" && <Play className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLessons = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Course Lessons</h2>
        {role !== "student" && (
          <Button>Add New Lesson</Button>
        )}
      </div>
      
      <div className="grid gap-4">
        {Array.from({ length: 5 }, (_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Lesson {i + 1}: Advanced Chord Progressions</CardTitle>
                <Badge variant={i < 3 ? "default" : "secondary"}>
                  {i < 3 ? "Completed" : "Locked"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Learn complex chord progressions and how to use them in different musical contexts.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    45 min
                  </div>
                  <div className="flex items-center gap-1">
                    <Play className="h-4 w-4" />
                    Video + Practice
                  </div>
                </div>
                <Button variant={i < 3 ? "outline" : "default"} disabled={i >= 3}>
                  {i < 3 ? "Review" : "Start Lesson"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "lessons":
        return renderLessons();
      case "schedule":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Class Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Schedule component coming soon...</p>
            </CardContent>
          </Card>
        );
      case "discussions":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Discussions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Discussion forum coming soon...</p>
            </CardContent>
          </Card>
        );
      case "progress":
        return (
          <Card>
            <CardHeader>
              <CardTitle>My Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Progress tracking coming soon...</p>
            </CardContent>
          </Card>
        );
      case "assignments":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Assignments list coming soon...</p>
            </CardContent>
          </Card>
        );
      case "students":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Students Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Student management coming soon...</p>
            </CardContent>
          </Card>
        );
      case "analytics":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
            </CardContent>
          </Card>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="flex-1">
      {renderContent()}
    </div>
  );
};