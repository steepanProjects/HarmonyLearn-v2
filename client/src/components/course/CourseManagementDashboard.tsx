import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser, hasRole } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Clock, 
  Star, 
  DollarSign,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Send,
  FileText,
  BarChart3,
  UserCheck
} from "lucide-react";

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  price: number;
  duration: number;
  mentorId: number;
  status: string;
  currentEnrollments: number;
  maxStudents: number;
  averageRating: number;
  totalRatings: number;
  totalRevenue: number;
  estimatedWeeks: number;
  difficulty: number;
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  adminNotes?: string;
}

interface CourseAnalytics {
  totalEnrollments: number;
  totalCompletions: number;
  totalRevenue: number;
  averageRating: number;
  totalLessonsCompleted: number;
}

export const CourseManagementDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [showAnalytics, setShowAnalytics] = useState<number | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const currentUser = getCurrentUser();
  const isAdmin = hasRole("admin");
  const isMentor = hasRole("mentor");

  // Fetch courses based on user role
  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses', currentUser?.role, currentUser?.id],
    queryFn: async () => {
      if (isAdmin) {
        return apiRequest('/api/courses');
      } else if (isMentor) {
        return apiRequest(`/api/courses?mentor=${currentUser?.id}`);
      }
      return [];
    }
  });

  // Fetch course analytics for selected course
  const { data: analytics } = useQuery<CourseAnalytics>({
    queryKey: ['/api/courses', showAnalytics, 'analytics/summary'],
    queryFn: () => apiRequest(`/api/courses/${showAnalytics}/analytics/summary`),
    enabled: !!showAnalytics
  });

  // Course approval mutation
  const approveMutation = useMutation({
    mutationFn: async ({ courseId, notes }: { courseId: number; notes: string }) => {
      return apiRequest(`/api/courses/${courseId}/approve`, {
        method: 'POST',
        body: JSON.stringify({ adminNotes: notes })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      toast({
        title: "Course Approved",
        description: "Course has been approved successfully.",
      });
      setSelectedCourse(null);
      setAdminNotes("");
    }
  });

  // Course rejection mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ courseId, notes }: { courseId: number; notes: string }) => {
      return apiRequest(`/api/courses/${courseId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ adminNotes: notes })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      toast({
        title: "Course Rejected",
        description: "Course has been rejected.",
        variant: "destructive"
      });
      setSelectedCourse(null);
      setAdminNotes("");
    }
  });

  // Course publication mutation
  const publishMutation = useMutation({
    mutationFn: async ({ courseId, notes }: { courseId: number; notes: string }) => {
      return apiRequest(`/api/courses/${courseId}/publish`, {
        method: 'POST',
        body: JSON.stringify({ adminNotes: notes })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      toast({
        title: "Course Published",
        description: "Course is now live and available to students.",
      });
      setSelectedCourse(null);
      setAdminNotes("");
    }
  });

  // Course deletion mutation
  const deleteMutation = useMutation({
    mutationFn: async (courseId: number) => {
      return apiRequest(`/api/courses/${courseId}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      toast({
        title: "Course Deleted",
        description: "Course has been archived successfully.",
      });
    }
  });

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || course.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "approved": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "published": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "archived": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published": return <CheckCircle className="h-4 w-4" />;
      case "rejected": return <XCircle className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const categories = ["piano", "guitar", "violin", "drums", "vocals", "theory"];
  const statuses = ["draft", "pending", "approved", "published", "rejected", "archived"];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {isAdmin ? "Course Management" : "My Courses"}
            </h1>
            <p className="text-muted-foreground">
              {isAdmin ? "Review and manage all courses" : "Manage your courses and track performance"}
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </div>
                  <Badge className={`ml-2 ${getStatusColor(course.status)} flex items-center gap-1`}>
                    {getStatusIcon(course.status)}
                    {course.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Course Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{course.currentEnrollments}/{course.maxStudents}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{course.averageRating.toFixed(1)} ({course.totalRatings})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span>${course.totalRevenue.toFixed(0)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>{course.estimatedWeeks}w</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowAnalytics(course.id)}
                    >
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Analytics
                    </Button>

                    {isAdmin && course.status === "pending" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => setSelectedCourse(course)}>
                            <UserCheck className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Review Course: {course.title}</DialogTitle>
                            <DialogDescription>
                              Review and approve or reject this course submission.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">Course Details</h4>
                              <p className="text-sm text-muted-foreground mb-2">{course.description}</p>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <span><strong>Category:</strong> {course.category}</span>
                                <span><strong>Level:</strong> {course.level}</span>
                                <span><strong>Price:</strong> ${course.price}</span>
                                <span><strong>Duration:</strong> {course.duration}min</span>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Admin Notes (Optional)
                              </label>
                              <Textarea
                                placeholder="Add any notes or feedback..."
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => approveMutation.mutate({ 
                                  courseId: course.id, 
                                  notes: adminNotes 
                                })}
                                disabled={approveMutation.isPending}
                                className="flex-1"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => rejectMutation.mutate({ 
                                  courseId: course.id, 
                                  notes: adminNotes 
                                })}
                                disabled={rejectMutation.isPending}
                                className="flex-1"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

                    {isAdmin && course.status === "approved" && (
                      <Button
                        size="sm"
                        onClick={() => publishMutation.mutate({ 
                          courseId: course.id, 
                          notes: "" 
                        })}
                        disabled={publishMutation.isPending}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Publish
                      </Button>
                    )}

                    {(isAdmin || (isMentor && course.mentorId === currentUser?.id)) && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(course.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>

                  {/* Admin Notes Display */}
                  {course.adminNotes && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <h5 className="font-semibold text-sm mb-1">Admin Notes:</h5>
                      <p className="text-sm text-muted-foreground">{course.adminNotes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                  ? "Try adjusting your filters to see more courses."
                  : "Create your first course to get started."}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Analytics Modal */}
        {showAnalytics && analytics && (
          <Dialog open={!!showAnalytics} onOpenChange={() => setShowAnalytics(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Course Analytics</DialogTitle>
                <DialogDescription>
                  Performance metrics for the selected course
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{analytics.totalEnrollments}</div>
                  <div className="text-sm text-muted-foreground">Total Enrollments</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{analytics.totalCompletions}</div>
                  <div className="text-sm text-muted-foreground">Completions</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">${analytics.totalRevenue.toFixed(0)}</div>
                  <div className="text-sm text-muted-foreground">Total Revenue</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{analytics.averageRating.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <BookOpen className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{analytics.totalLessonsCompleted}</div>
                  <div className="text-sm text-muted-foreground">Lessons Completed</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Users className="h-8 w-8 text-indigo-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {analytics.totalEnrollments > 0 ? 
                      Math.round((analytics.totalCompletions / analytics.totalEnrollments) * 100) : 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Completion Rate</div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default CourseManagementDashboard;