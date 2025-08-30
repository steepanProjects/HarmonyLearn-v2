import { useState } from "react";
import { Calendar, Clock, Users, Star, Video, MessageCircle, Heart, Mic, MicOff, VideoOff, Settings, Share, PhoneCall, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import type { LiveSession } from "@shared/schema";
import { EmptyState } from "@/components/EmptyState";
import { LiveSessionSkeleton, LoadingGrid } from "@/components/LoadingSkeletons";

// Interactive Demo Component for Live Session Interface
const LiveSessionDemo = ({ session, isLive = false }: { session: any, isLive?: boolean }) => {
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(true);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { user: "Sarah M.", message: "Great technique on that chord progression!", time: "2:34" },
    { user: "Marcus J.", message: "Thanks! Let's try it together now", time: "2:35", isMentor: true },
    { user: "Alex R.", message: "Can you show that fingering again?", time: "2:36" },
  ]);
  const { toast } = useToast();

  const handleJoinSession = () => {
    setIsJoined(true);
    toast({
      title: "Joined Session!",
      description: `Welcome to ${session.title}`,
    });
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setChatMessages([...chatMessages, {
        user: "You",
        message: chatMessage,
        time: new Date().toLocaleTimeString().slice(0, 5)
      }]);
      setChatMessage("");
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const sessionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (sessionDate.getTime() === today.getTime()) {
      return "Today";
    } else if (sessionDate.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatTime = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  if (!isJoined) {
    return (
      <Card className={`p-6 ${isLive ? 'border-red-200 bg-red-50/50 dark:bg-red-950/20' : ''} hover:shadow-glow transition-all duration-300`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{session.title}</h3>
            <p className="text-muted-foreground mb-2">Mentor ID: {session.mentorId}</p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              {isLive ? (
                <>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>Live now</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(session.duration || 60)}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(session.scheduledAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(session.scheduledAt)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          {isLive && (
            <Badge className="bg-red-100 text-red-800 border-red-200 animate-pulse">
              LIVE
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm">
            <Users className="h-4 w-4" />
            <span>{session.maxParticipants} max participants</span>
          </div>
          <Button onClick={handleJoinSession} className={isLive ? "bg-red-600 hover:bg-red-700" : ""}>
            <Video className="mr-2 h-4 w-4" />
            {isLive ? "Join Live" : "Join Session"}
          </Button>
        </div>
        {session.description && (
          <div className="mt-4 text-sm text-muted-foreground">
            {session.description}
          </div>
        )}
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Video Area */}
      <div className="lg:col-span-3">
        <Card className="p-0 overflow-hidden">
          <div className="relative bg-gray-900 aspect-video flex items-center justify-center">
            <div className="text-center text-white">
              <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Live Session in Progress</p>
              <p className="text-sm opacity-75">Session Demo - Interactive Features Available</p>
            </div>
          </div>
          
          {/* Video Controls */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center space-x-2">
              <Button
                variant={isMuted ? "default" : "outline"}
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button
                variant={isVideoOff ? "default" : "outline"}
                size="sm"
                onClick={() => setIsVideoOff(!isVideoOff)}
              >
                {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="sm">
                <PhoneCall className="h-4 w-4" />
                Leave
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Chat Panel */}
      <div className="lg:col-span-1">
        <Card className="h-96 flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-medium">Live Chat</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, index) => (
              <div key={index} className="text-sm">
                <span className={`font-medium ${msg.isMentor ? 'text-primary' : 'text-foreground'}`}>
                  {msg.user}
                </span>
                <span className="text-muted-foreground text-xs ml-2">{msg.time}</span>
                <p className="text-muted-foreground mt-1">{msg.message}</p>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                placeholder="Type a message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button size="sm" onClick={handleSendMessage}>
                Send
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export const LiveSessions = () => {
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);
  
  const { data: allSessions, isLoading, error } = useQuery<LiveSession[]>({
    queryKey: ['/api/live-sessions'],
  });

  const { data: liveSessions } = useQuery<LiveSession[]>({
    queryKey: ['/api/live-sessions', { status: 'live' }],
  });

  const { data: upcomingSessions } = useQuery<LiveSession[]>({
    queryKey: ['/api/live-sessions', { status: 'scheduled' }],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              Live Music Sessions
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Join live interactive sessions with expert musicians. Learn in real-time, 
              ask questions, and connect with fellow music enthusiasts.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" variant="secondary" className="shadow-warm" disabled>
                <Video className="mr-2 h-5 w-5" />
                Join Live Session
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20" disabled>
                Schedule Session
              </Button>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          {/* Loading Content */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Loading Sessions...</h2>
            <LoadingGrid count={4} className="grid md:grid-cols-2 gap-6">
              <LiveSessionSkeleton />
            </LoadingGrid>
          </section>
        </div>

        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <EmptyState
            icon={Video}
            title="Unable to Load Sessions"
            description="We're having trouble loading live sessions. Please check your connection and try again."
            actionText="Retry"
            onAction={() => window.location.reload()}
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Live Music Sessions
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Join live interactive sessions with expert musicians. Learn in real-time, 
            ask questions, and connect with fellow music enthusiasts.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="secondary" className="shadow-warm">
              <Video className="mr-2 h-5 w-5" />
              Join Live Session
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              Schedule Session
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Live Now Section */}
        {liveSessions && liveSessions.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h2 className="text-3xl font-bold">Live Now</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {liveSessions.map((session) => (
                <LiveSessionDemo 
                  key={session.id} 
                  session={session} 
                  isLive={true}
                />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Sessions */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Upcoming Sessions</h2>
          
          {upcomingSessions && upcomingSessions.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingSessions.map((session) => (
                <LiveSessionDemo 
                  key={session.id} 
                  session={session} 
                  isLive={false}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Play}
              title="No Upcoming Sessions"
              description="There are no live sessions scheduled at the moment. Our expert musicians regularly host interactive sessions covering various instruments and techniques. Check back soon or explore our on-demand courses while you wait."
              actionText="Explore Courses"
              onAction={() => window.location.href = '/courses'}
            />
          )}
        </section>

        {/* Session Demo */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Experience Interactive Learning</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our live sessions look like. Click "Join Live" on any session above to try our interactive demo.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-muted/30 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How Live Sessions Work</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 px-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Book Your Spot</h3>
              <p className="text-muted-foreground">
                Browse upcoming sessions and reserve your place. Sessions are limited to ensure quality interaction.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Join & Learn</h3>
              <p className="text-muted-foreground">
                Connect via video call, see the instructor's hands, and follow along with provided materials.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-cool rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interact & Ask</h3>
              <p className="text-muted-foreground">
                Use chat, raise your hand, and get real-time feedback from instructors and peers.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};