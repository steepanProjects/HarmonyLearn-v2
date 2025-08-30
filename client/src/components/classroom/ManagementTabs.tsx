import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Play,
  Calendar,
  MessageSquare,
  Award
} from "lucide-react";

type Role = "master" | "staff" | "student";

interface ManagementTabsProps {
  role: Role;
}

export const ManagementTabs = ({ role }: ManagementTabsProps) => {
  const [activeTab, setActiveTab] = useState("classrooms");

  if (role === "student") {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
          <p className="text-muted-foreground">
            This management area is only available for mentors and staff members.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="classrooms">Classrooms</TabsTrigger>
        <TabsTrigger value="students">Students</TabsTrigger>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="classrooms" className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Classroom Management
              </CardTitle>
              <Button>
                <Play className="h-4 w-4 mr-2" />
                Create New Classroom
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {[
                { name: "Advanced Piano Techniques", students: 24, status: "active" },
                { name: "Guitar Fundamentals", students: 18, status: "active" },
                { name: "Vocal Performance", students: 15, status: "draft" }
              ].map((classroom, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{classroom.name}</h4>
                    <p className="text-sm text-muted-foreground">{classroom.students} students enrolled</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={classroom.status === "active" ? "default" : "secondary"}>
                      {classroom.status}
                    </Badge>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="students" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Student Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {[
                { name: "Alice Johnson", email: "alice@example.com", classrooms: 2, progress: 85 },
                { name: "Bob Smith", email: "bob@example.com", classrooms: 1, progress: 92 },
                { name: "Carol Davis", email: "carol@example.com", classrooms: 3, progress: 78 }
              ].map((student, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{student.name}</h4>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                      {student.classrooms} classrooms
                    </div>
                    <div className="text-sm">
                      {student.progress}% avg progress
                    </div>
                    <Button variant="outline" size="sm">View Profile</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="content" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Content Library
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Content Management</h3>
              <p className="text-muted-foreground mb-4">
                Manage lessons, assignments, and learning materials
              </p>
              <Button>
                Add New Content
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 border rounded-lg">
                <div className="text-3xl font-bold text-primary">47</div>
                <div className="text-sm text-muted-foreground">Total Students</div>
              </div>
              <div className="text-center p-6 border rounded-lg">
                <div className="text-3xl font-bold text-secondary">89%</div>
                <div className="text-sm text-muted-foreground">Avg Completion</div>
              </div>
              <div className="text-center p-6 border rounded-lg">
                <div className="text-3xl font-bold text-accent">4.8</div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Platform Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Notification Preferences</h4>
                <p className="text-sm text-muted-foreground">
                  Configure how you receive notifications about student activity
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Classroom Defaults</h4>
                <p className="text-sm text-muted-foreground">
                  Set default settings for new classrooms
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Integration Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Configure external tools and integrations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};