import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getCurrentUser, isMaster } from "@/lib/auth";
import ClassroomCreationForm from "@/components/master/ClassroomCreationForm";
import EnrollmentRequestManager from "@/components/master/EnrollmentRequestManager";
import { Crown, Users, BookOpen, Plus, Calendar, TrendingUp, Star, UserCheck } from "lucide-react";

interface Classroom {
  id: number;
  title: string;
  description: string;
  subject: string;
  level: string;
  masterId: number;
  maxStudents: number;
  isActive: boolean;
  createdAt: Date;
}

export default function MasterDashboard() {
  const currentUser = getCurrentUser();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: classrooms, isLoading: loadingClassrooms } = useQuery({
    queryKey: [`/api/classrooms/master/${currentUser?.id}`],
    enabled: !!currentUser?.id && isMaster(),
  });

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: [`/api/master/${currentUser?.id}/stats`],
    enabled: !!currentUser?.id && isMaster(),
  });

  if (!isMaster()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Master Access Required</CardTitle>
            <CardDescription className="text-lg">
              You need master status to access this dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Apply for master status from your mentor dashboard to create and manage classrooms.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const classroomList = Array.isArray(classrooms) ? classrooms as Classroom[] : [];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Crown className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold">Master Dashboard</h1>
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
              Master
            </Badge>
          </div>
          <p className="text-lg text-muted-foreground">
            Manage your classrooms and student progress
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Classroom
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Classroom</DialogTitle>
            </DialogHeader>
            <ClassroomCreationForm
              onSuccess={() => setShowCreateDialog(false)}
              onCancel={() => setShowCreateDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Classrooms
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classroomList.length}</div>
            <p className="text-xs text-muted-foreground">Active classrooms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Students
              </CardTitle>
              <BookOpen className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingStats ? "..." : ((stats as any)?.totalStudents || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all classrooms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Live Sessions
              </CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingStats ? "..." : ((stats as any)?.liveSessions || 0)}
            </div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Rating
              </CardTitle>
              <Star className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingStats ? "..." : ((stats as any)?.averageRating || "4.8")}
            </div>
            <p className="text-xs text-muted-foreground">Student feedback</p>
          </CardContent>
        </Card>
      </div>

      {/* Classrooms Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Your Classrooms
          </CardTitle>
          <CardDescription>
            Manage and monitor your active classrooms
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingClassrooms ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : classroomList.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Classrooms Yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first classroom to start teaching and managing students.
              </p>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Classroom
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {classroomList.map((classroom) => (
                <div key={classroom.id} className="border rounded-lg p-6 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{classroom.title}</h3>
                        <Badge variant="secondary">{classroom.subject}</Badge>
                        <Badge variant="outline">{classroom.level}</Badge>
                      </div>
                      <p className="text-muted-foreground">{classroom.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          0/{classroom.maxStudents} students
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Created {new Date(classroom.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                      <Button size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Performance Analytics
            </CardTitle>
            <CardDescription>
              Track your teaching performance and student progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              View Analytics
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule Management
            </CardTitle>
            <CardDescription>
              Manage live sessions and classroom schedules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Manage Schedule
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Enrollment Request Management */}
      {classroomList.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <UserCheck className="h-6 w-6" />
            Student Enrollment Requests
          </h2>
          {classroomList.map((classroom) => (
            <EnrollmentRequestManager
              key={classroom.id}
              classroomId={classroom.id}
              academyName={classroom.title}
            />
          ))}
        </div>
      )}
    </div>
  );
}