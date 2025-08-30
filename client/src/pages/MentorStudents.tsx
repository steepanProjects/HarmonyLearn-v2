import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  MessageCircle, 
  User, 
  Star, 
  Clock, 
  BookOpen,
  Video,
  Send,
  Plus,
  Target,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from "@/components/EmptyState";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MentorNavigation } from "@/components/mentor/MentorNavigation";
import { getCurrentUser } from "@/lib/auth";

const sessionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().optional(),
  scheduledAt: z.string().min(1, "Please select a date and time"),
  duration: z.number().min(30).max(180).default(60),
});

type SessionForm = z.infer<typeof sessionSchema>;

interface Student {
  id: number;
  mentorshipRequestId: number;
  firstName: string;
  lastName: string;
  email: string;
  acceptedAt: Date;
  totalSessions: number;
  completedSessions: number;
  nextSession?: {
    id: number;
    title: string;
    scheduledAt: Date;
  };
  recentActivity?: {
    type: string;
    message: string;
    date: Date;
  }[];
}

interface MentorshipSession {
  id: number;
  mentorshipRequestId: number;
  title: string;
  description: string;
  scheduledAt: Date;
  duration: number;
  status: string;
  rating?: number;
  studentNotes?: string;
  mentorNotes?: string;
}

const apiRequest = async (url: string, options: { method: string; body?: any }) => {
  const response = await fetch(url, {
    method: options.method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export const MentorStudents = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current mentor from localStorage
  const currentUser = getCurrentUser();

  // Fetch accepted mentorship requests (current students)
  const { data: students = [], isLoading, error } = useQuery<Student[]>({
    queryKey: ['/api/mentorship-requests', { mentorId: currentUser?.id, status: 'accepted' }],
    enabled: !!currentUser?.id
  });

  // Fetch mentor sessions
  const { data: sessions = [] } = useQuery<MentorshipSession[]>({
    queryKey: [`/api/mentorship-sessions?mentorId=${currentUser?.id}`],
    enabled: !!currentUser?.id
  });

  // Form for scheduling sessions
  const form = useForm<SessionForm>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      title: "",
      description: "",
      scheduledAt: "",
      duration: 60,
    },
  });

  // Mutation for creating sessions
  const createSessionMutation = useMutation({
    mutationFn: async (data: SessionForm & { mentorshipRequestId: number }) => {
      return apiRequest('/api/mentorship-sessions', {
        method: "POST",
        body: {
          ...data,
          scheduledAt: new Date(data.scheduledAt).toISOString(),
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "Session Scheduled",
        description: "The mentorship session has been scheduled successfully.",
      });
      setSessionDialogOpen(false);
      form.reset();
      setSelectedStudent(null);
      queryClient.invalidateQueries({ queryKey: ['/api/mentorship-sessions'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to schedule session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleScheduleSession = (student: Student) => {
    setSelectedStudent(student);
    setSessionDialogOpen(true);
    form.setValue('title', `Mentorship Session with ${student.firstName}`);
  };

  const onSubmitSession = async (data: SessionForm) => {
    if (!selectedStudent) return;
    
    createSessionMutation.mutate({
      ...data,
      mentorshipRequestId: selectedStudent.mentorshipRequestId,
    });
  };

  const filteredStudents = students.filter(student => 
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const upcomingSessions = sessions.filter(session => 
    session.status === 'scheduled' && new Date(session.scheduledAt) > new Date()
  ).slice(0, 3);

  const recentSessions = sessions.filter(session => 
    session.status === 'completed'
  ).slice(0, 5);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Students</h1>
          <p className="text-muted-foreground">Loading your students...</p>
        </div>
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-20">
          <div className="text-lg text-red-600">Error loading students. Please try again later.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Navigation */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-0 h-screen">
          <MentorNavigation currentUser={currentUser} className="h-full" />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 min-w-0 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Students</h1>
          <p className="text-muted-foreground">
            Manage your mentorship relationships and track student progress
          </p>
        </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Students</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming Sessions</p>
                <p className="text-2xl font-bold">{upcomingSessions.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">{sessions.length}</p>
              </div>
              <Video className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">
                  {sessions.length > 0 ? Math.round((recentSessions.length / sessions.length) * 100) : 0}%
                </p>
              </div>
              <Target className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Sessions ({upcomingSessions.length})</TabsTrigger>
          <TabsTrigger value="recent">Recent Sessions ({recentSessions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-6">
          {/* Search */}
          <div className="flex gap-4">
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {/* Students Grid */}
          {filteredStudents.length > 0 ? (
            <div className="grid gap-6">
              {filteredStudents.map((student) => (
                <Card key={student.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="bg-gradient-hero text-white text-lg">
                            {student.firstName?.[0] || 'S'}{student.lastName?.[0] || 'T'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-semibold">
                            {student.firstName} {student.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-1">
                            {student.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Student since {new Date(student.acceptedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Active Student
                      </Badge>
                    </div>

                    {/* Progress Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{student.totalSessions}</div>
                        <div className="text-xs text-muted-foreground">Total Sessions</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{student.completedSessions}</div>
                        <div className="text-xs text-muted-foreground">Completed</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {student.totalSessions > 0 ? Math.round((student.completedSessions / student.totalSessions) * 100) : 0}%
                        </div>
                        <div className="text-xs text-muted-foreground">Progress</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Learning Progress</span>
                        <span>{student.totalSessions > 0 ? Math.round((student.completedSessions / student.totalSessions) * 100) : 0}%</span>
                      </div>
                      <Progress 
                        value={student.totalSessions > 0 ? (student.completedSessions / student.totalSessions) * 100 : 0}
                        className="h-2"
                      />
                    </div>

                    {/* Next Session */}
                    {student.nextSession && (
                      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Next Session</span>
                        </div>
                        <p className="text-sm">{student.nextSession.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(student.nextSession.scheduledAt).toLocaleString()}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleScheduleSession(student)}
                        className="flex-1"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Session
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <BookOpen className="w-4 h-4 mr-2" />
                        View Progress
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={User}
              title="No Students Yet"
              description="You don't have any active students at the moment. Accept mentorship requests to start mentoring!"
            />
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingSessions.length > 0 ? (
            upcomingSessions.map((session) => (
              <Card key={session.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{session.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {session.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(session.scheduledAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(session.scheduledAt).toLocaleTimeString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Video className="h-4 w-4" />
                          {session.duration} minutes
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">Reschedule</Button>
                      <Button>Join Session</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <EmptyState
              icon={Calendar}
              title="No Upcoming Sessions"
              description="You don't have any upcoming sessions scheduled."
            />
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          {recentSessions.length > 0 ? (
            recentSessions.map((session) => (
              <Card key={session.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{session.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Completed on {new Date(session.scheduledAt).toLocaleDateString()}
                      </p>
                      {session.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <span className="text-sm font-medium">{session.rating}/5</span>
                        </div>
                      )}
                    </div>
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  </div>
                  
                  {session.studentNotes && (
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <h4 className="text-sm font-medium mb-1">Student Notes:</h4>
                      <p className="text-sm text-muted-foreground">{session.studentNotes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <EmptyState
              icon={BookOpen}
              title="No Recent Sessions"
              description="You haven't completed any sessions yet."
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Schedule Session Dialog */}
      <Dialog open={sessionDialogOpen} onOpenChange={setSessionDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule Mentorship Session</DialogTitle>
            <DialogDescription>
              Create a new session with {selectedStudent?.firstName} {selectedStudent?.lastName}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitSession)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Guitar Technique Review" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What will you cover in this session?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="scheduledAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date & Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        min={new Date().toISOString().slice(0, 16)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={30}
                        max={180}
                        step={15}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSessionDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createSessionMutation.isPending}
                >
                  {createSessionMutation.isPending ? "Scheduling..." : "Schedule Session"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
};

export default MentorStudents;