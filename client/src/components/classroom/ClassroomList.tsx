import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  BookOpen, 
  Clock, 
  Play, 
  Settings, 
  TrendingUp,
  Calendar,
  Bell
} from "lucide-react";
import { Link } from "wouter";

type Role = "master" | "staff" | "student";

interface ClassroomListProps {
  role: Role;
}

const mockClassrooms = [
  {
    id: "1",
    title: "Advanced Piano Techniques",
    description: "Master advanced piano playing techniques and musical expression",
    subject: "Piano",
    students: 24,
    lessons: 12,
    progress: 75,
    nextClass: "Tomorrow 2:00 PM",
    instructor: "Dr. Sarah Williams",
    status: "active",
    level: "Advanced",
    xp: 1200
  },
  {
    id: "2", 
    title: "Guitar Fundamentals",
    description: "Learn the basics of guitar playing from chords to scales",
    subject: "Guitar",
    students: 18,
    lessons: 8,
    progress: 45,
    nextClass: "Friday 4:00 PM",
    instructor: "Marcus Johnson",
    status: "active",
    level: "Beginner",
    xp: 650
  },
  {
    id: "3",
    title: "Vocal Performance Mastery",
    description: "Develop your voice and stage presence for performances",
    subject: "Vocals",
    students: 15,
    lessons: 10,
    progress: 90,
    nextClass: "Monday 6:00 PM",
    instructor: "Elena Rodriguez",
    status: "active",
    level: "Intermediate",
    xp: 980
  }
];

export const ClassroomList = ({ role }: ClassroomListProps) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {mockClassrooms.map((classroom) => (
          <Card key={classroom.id} className="group hover:shadow-musical transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-xl">{classroom.title}</CardTitle>
                    <Badge variant="secondary">{classroom.level}</Badge>
                    <Badge variant="outline">{classroom.subject}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">{classroom.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {classroom.students} students
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {classroom.lessons} lessons
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {classroom.nextClass}
                    </div>
                    {role === "student" && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        {classroom.xp} XP
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{classroom.instructor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm text-muted-foreground text-right">
                    {classroom.instructor}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Progress Bar for Students */}
              {role === "student" && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{classroom.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                      style={{ width: `${classroom.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button asChild>
                    <Link to={`/classroom/dashboard/${classroom.id}`}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Enter Classroom
                    </Link>
                  </Button>
                  
                  {role !== "student" && (
                    <Button variant="outline" asChild>
                      <Link to={`/classroom/manage?id=${classroom.id}`}>
                        <Settings className="h-4 w-4 mr-2" />
                        Manage
                      </Link>
                    </Button>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Calendar className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Bell className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Join Live
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {mockClassrooms.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {role === "student" ? "No Classrooms Enrolled" : "No Classrooms Created"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {role === "student" 
                ? "Explore and join classrooms to start your learning journey"
                : "Create your first classroom to start teaching"
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};