import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Footer } from "@/components/Footer";
import { StudentNavigation } from "@/components/student/StudentNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Video, 
  Calendar, 
  Clock, 
  Users,
  Plus,
  Play,
  User,
  BookOpen,
  MessageCircle,
  Star,
  Phone,
  Settings
} from "lucide-react";

interface LiveSession {
  id: number;
  title: string;
  instructor: string;
  instructorAvatar?: string;
  date: string;
  time: string;
  duration: number;
  type: 'one-on-one' | 'group' | 'masterclass';
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  participantCount?: number;
  maxParticipants?: number;
  description: string;
  meetingLink?: string;
  category: string;
}

const StudentSessions = () => {
  const [currentUser] = useState(() => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  });

  // Fetch student's live sessions
  const { data: sessions = [] } = useQuery<any[]>({
    queryKey: ['/api/live-sessions', { student: currentUser?.id }],
    enabled: !!currentUser?.id
  });

  // Transform API data to LiveSession interface
  const liveSessions: LiveSession[] = sessions.map((session: any) => ({
    id: session.id,
    title: session.title,
    instructor: session.mentorName || 'Instructor',
    instructorAvatar: session.mentorAvatar || '',
    date: new Date(session.scheduledDate).toLocaleDateString(),
    time: new Date(session.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    duration: session.durationMinutes || 60,
    type: session.type || 'one-on-one',
    status: session.status,
    participantCount: session.participantCount || 1,
    maxParticipants: session.maxParticipants || 1,
    description: session.description || 'Live learning session',
    meetingLink: session.meetingLink,
    category: session.category || 'Music'
  }));

  // Separate sessions by status
  const upcomingSessions = liveSessions.filter(s => s.status === 'scheduled');
  const ongoingSessions = liveSessions.filter(s => s.status === 'ongoing');
  const completedSessions = liveSessions.filter(s => s.status === 'completed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'ongoing': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'one-on-one': return <User className="h-4 w-4" />;
      case 'group': return <Users className="h-4 w-4" />;
      case 'masterclass': return <BookOpen className="h-4 w-4" />;
      default: return <Video className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'one-on-one': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'group': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'masterclass': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const SessionCard = ({ session }: { session: LiveSession }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
              <Video className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">{session.title}</h3>
              <p className="text-sm text-muted-foreground">with {session.instructor}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className={getStatusColor(session.status)}>
              {session.status}
            </Badge>
            <Badge variant="outline" className={getTypeColor(session.type)}>
              <span className="flex items-center gap-1">
                {getTypeIcon(session.type)}
                {session.type}
              </span>
            </Badge>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{session.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{session.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{session.time} ({session.duration}min)</span>
          </div>
        </div>

        {session.type !== 'one-on-one' && (
          <div className="flex items-center gap-2 text-sm mb-4">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{session.participantCount}/{session.maxParticipants} participants</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {session.status === 'ongoing' && (
            <Button className="flex-1 gap-2">
              <Play className="h-4 w-4" />
              Join Now
            </Button>
          )}
          {session.status === 'scheduled' && (
            <>
              <Button className="flex-1 gap-2">
                <Calendar className="h-4 w-4" />
                Join Session
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </>
          )}
          {session.status === 'completed' && (
            <Button variant="outline" className="flex-1 gap-2">
              <Play className="h-4 w-4" />
              Watch Recording
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Navigation */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-0 h-screen">
          <StudentNavigation currentUser={currentUser} className="h-full" />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 min-w-0">
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Live Sessions</h1>
            <p className="text-muted-foreground">
              Join live learning sessions with expert instructors
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Book Session
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{upcomingSessions.length}</p>
                  <p className="text-xs text-muted-foreground">Upcoming</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{ongoingSessions.length}</p>
                  <p className="text-xs text-muted-foreground">Live Now</p>
                </div>
                <Video className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{completedSessions.length}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{liveSessions.length}</p>
                  <p className="text-xs text-muted-foreground">Total Sessions</p>
                </div>
                <BookOpen className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sessions Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming" className="gap-2">
              <Calendar className="h-4 w-4" />
              Upcoming ({upcomingSessions.length})
            </TabsTrigger>
            <TabsTrigger value="live" className="gap-2">
              <Video className="h-4 w-4" />
              Live Now ({ongoingSessions.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-2">
              <Users className="h-4 w-4" />
              Completed ({completedSessions.length})
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Sessions */}
          <TabsContent value="upcoming">
            {upcomingSessions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No upcoming sessions</h3>
                  <p className="text-muted-foreground mb-4">
                    Book a live session with your instructor to accelerate your learning!
                  </p>
                  <Button>Book a Session</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {upcomingSessions.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Live Sessions */}
          <TabsContent value="live">
            {ongoingSessions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No live sessions</h3>
                  <p className="text-muted-foreground">
                    No sessions are currently live. Check back for upcoming sessions!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {ongoingSessions.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Completed Sessions */}
          <TabsContent value="completed">
            {completedSessions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No completed sessions</h3>
                  <p className="text-muted-foreground">
                    Your completed sessions and recordings will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {completedSessions.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Session Preferences
            </CardTitle>
            <CardDescription>
              Manage your session settings and availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                Set Availability
              </Button>
              <Button variant="outline" className="gap-2">
                <Phone className="h-4 w-4" />
                Test Audio/Video
              </Button>
              <Button variant="outline" className="gap-2">
                <Star className="h-4 w-4" />
                Rate Instructors
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

        <Footer />
      </div>
    </div>
  );
};

export default StudentSessions;