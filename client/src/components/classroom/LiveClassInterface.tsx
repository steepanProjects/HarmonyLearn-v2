import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Users, 
  MessageSquare, 
  Share, 
  Settings,
  Hand,
  PhoneOff,
  Monitor,
  FileText,
  Music,
  Send
} from "lucide-react";

type Role = "master" | "staff" | "student";

interface LiveClassInterfaceProps {
  role: Role;
  classId: string;
}

export const LiveClassInterface = ({ role, classId }: LiveClassInterfaceProps) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [participants, setParticipants] = useState(24);
  const [chatMessages, setChatMessages] = useState([
    { user: "Alice M.", message: "Great explanation of the chord progression!", time: "14:32", role: "student" },
    { user: "Prof. Williams", message: "Thank you! Now let's practice together", time: "14:33", role: "instructor" },
    { user: "Bob K.", message: "Could you slow down the tempo please?", time: "14:34", role: "student" },
    { user: "Charlie S.", message: "The audio quality is excellent today!", time: "14:35", role: "student" },
  ]);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setChatMessages(prev => [...prev, {
        user: "You",
        message: chatMessage,
        time: new Date().toLocaleTimeString().slice(0, 5),
        role: role === "master" ? "instructor" : "student"
      }]);
      setChatMessage("");
      toast({
        title: "Message sent!",
        description: "Your message has been posted to the class chat.",
      });
    }
  };

  const handleToggleMic = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Microphone unmuted" : "Microphone muted",
      description: isMuted ? "You can now speak in the class" : "Your microphone is now muted",
    });
  };

  const handleToggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    toast({
      title: isVideoOff ? "Camera turned on" : "Camera turned off",
      description: isVideoOff ? "Your video is now visible to the class" : "Your camera is now off",
    });
  };

  const handleRaiseHand = () => {
    setIsHandRaised(!isHandRaised);
    toast({
      title: isHandRaised ? "Hand lowered" : "Hand raised",
      description: isHandRaised ? "You've lowered your hand" : "The instructor will see your raised hand",
    });
  };

  const handleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast({
      title: isScreenSharing ? "Screen sharing stopped" : "Screen sharing started",
      description: isScreenSharing ? "You've stopped sharing your screen" : "You're now sharing your screen",
    });
  };
  return (
    <div className="space-y-6">
      {/* Class Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Advanced Piano Techniques - Live Session Demo
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="destructive" className="animate-pulse">🔴 LIVE DEMO</Badge>
                <span className="text-sm text-muted-foreground">{participants} participants</span>
                <Badge variant="secondary">Interactive Demo</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => toast({ title: "Link copied!", description: "Class link copied to clipboard" })}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="destructive" size="sm" onClick={() => toast({ title: "Left class", description: "You have left the live session" })}>
                <PhoneOff className="h-4 w-4 mr-2" />
                Leave
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Video Area */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-black rounded-t-lg flex items-center justify-center relative overflow-hidden">
                {/* Simulated Video Feed */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-4">🎹</div>
                    <h3 className="text-2xl font-semibold mb-2">Prof. Sarah Williams</h3>
                    <p className="text-lg opacity-75">Teaching Advanced Chord Progressions</p>
                    {isScreenSharing && (
                      <div className="mt-4 p-3 bg-white/10 rounded-lg">
                        <FileText className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Sharing: Music Theory Notes</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Your Video (Picture-in-Picture) */}
                <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-lg border-2 border-white/20 flex items-center justify-center">
                  {isVideoOff ? (
                    <div className="text-white text-xs text-center">
                      <VideoOff className="h-6 w-6 mx-auto mb-1" />
                      Camera Off
                    </div>
                  ) : (
                    <div className="text-white text-xs text-center">
                      <div className="text-2xl mb-1">👤</div>
                      You
                    </div>
                  )}
                </div>

                {/* Live Indicators */}
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <div className="flex items-center space-x-1 bg-red-500 px-2 py-1 rounded text-white text-xs">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    LIVE DEMO
                  </div>
                  <div className="bg-black/50 px-2 py-1 rounded text-white text-xs">
                    {participants} participants
                  </div>
                </div>

                {/* Hand Raised Indicator */}
                {isHandRaised && (
                  <div className="absolute top-4 right-4 bg-yellow-500 px-2 py-1 rounded text-white text-xs flex items-center">
                    <Hand className="h-3 w-3 mr-1" />
                    Hand Raised
                  </div>
                )}
              </div>
              
              {/* Enhanced Controls */}
              <div className="p-4 flex items-center justify-between bg-card border-t">
                <div className="flex gap-2">
                  <Button 
                    variant={isMuted ? "destructive" : "outline"} 
                    size="sm"
                    onClick={handleToggleMic}
                  >
                    {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant={isVideoOff ? "destructive" : "outline"} 
                    size="sm"
                    onClick={handleToggleVideo}
                  >
                    {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                  </Button>
                  {role === "student" && (
                    <Button 
                      variant={isHandRaised ? "secondary" : "outline"} 
                      size="sm"
                      onClick={handleRaiseHand}
                    >
                      <Hand className="h-4 w-4" />
                    </Button>
                  )}
                  {(role === "master" || role === "staff") && (
                    <Button 
                      variant={isScreenSharing ? "secondary" : "outline"} 
                      size="sm"
                      onClick={handleScreenShare}
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Music className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Sidebar */}
        <div className="space-y-4">
          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4" />
                Participants ({participants})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <div className="flex items-center justify-between text-sm p-2 bg-primary/10 rounded">
                  <span className="font-medium">Prof. Sarah Williams</span>
                  <Badge variant="secondary" className="text-xs">Host</Badge>
                </div>
                {[
                  { name: "Alice M.", status: "speaking" },
                  { name: "Bob K.", status: "muted" },
                  { name: "Charlie S.", status: "hand-raised" },
                  { name: "Diana R.", status: "normal" },
                  { name: "Eve T.", status: "normal" },
                  { name: "Frank W.", status: "muted" },
                  { name: "Grace L.", status: "normal" },
                  { name: "You", status: isHandRaised ? "hand-raised" : isMuted ? "muted" : "normal" }
                ].map((participant, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className={participant.name === "You" ? "font-medium" : ""}>
                      {participant.name}
                    </span>
                    <div className="flex gap-1">
                      {participant.status === "muted" && <MicOff className="h-3 w-3 text-muted-foreground" />}
                      {participant.status === "hand-raised" && <Hand className="h-3 w-3 text-yellow-500" />}
                      {participant.status === "speaking" && <Mic className="h-3 w-3 text-green-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Chat */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Live Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2 max-h-64 overflow-y-auto mb-3">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`text-xs p-2 rounded ${
                    msg.role === "instructor" ? "bg-primary/10 border-l-2 border-primary" : "bg-muted"
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{msg.user}</span>
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                    </div>
                    <p>{msg.message}</p>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="text-sm"
                />
                <Button size="sm" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};