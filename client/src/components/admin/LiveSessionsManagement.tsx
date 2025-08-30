import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Video, Search, Plus, Edit, Trash2, Eye, Play, Users, 
  Calendar, Clock, CircleDot, Square, Pause, Settings,
  MessageCircle, Share2, Download
} from "lucide-react";

interface LiveSession {
  id: number;
  title: string;
  instructor: string;
  instructorAvatar: string;
  topic: string;
  category: string;
  scheduledDate: string;
  duration: number;
  maxParticipants: number;
  currentParticipants: number;
  status: 'Scheduled' | 'Live' | 'Completed' | 'Cancelled';
  price: number;
  description: string;
  recordingAvailable: boolean;
  chatEnabled: boolean;
  qnaEnabled: boolean;
}

export const LiveSessionsManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);

  const liveSessions: LiveSession[] = [
    {
      id: 1,
      title: "Advanced Jazz Improvisation Workshop",
      instructor: "Marcus Johnson",
      instructorAvatar: "/placeholder.svg",
      topic: "Jazz Piano Techniques",
      category: "Piano",
      scheduledDate: "2024-12-25T15:00:00Z",
      duration: 90,
      maxParticipants: 50,
      currentParticipants: 42,
      status: "Scheduled",
      price: 49.99,
      description: "Deep dive into jazz improvisation techniques with practical exercises.",
      recordingAvailable: true,
      chatEnabled: true,
      qnaEnabled: true
    },
    {
      id: 2,
      title: "Guitar Fingerpicking Masterclass",
      instructor: "Sarah Chen",
      instructorAvatar: "/placeholder.svg",
      topic: "Acoustic Guitar Techniques",
      category: "Guitar",
      scheduledDate: "2024-12-22T18:00:00Z",
      duration: 120,
      maxParticipants: 30,
      currentParticipants: 28,
      status: "Live",
      price: 39.99,
      description: "Learn advanced fingerpicking patterns and techniques.",
      recordingAvailable: true,
      chatEnabled: true,
      qnaEnabled: true
    },
    {
      id: 3,
      title: "Classical Music Theory Fundamentals",
      instructor: "Elena Volkov",
      instructorAvatar: "/placeholder.svg",
      topic: "Music Theory",
      category: "Theory",
      scheduledDate: "2024-12-20T14:00:00Z",
      duration: 60,
      maxParticipants: 100,
      currentParticipants: 85,
      status: "Completed",
      price: 29.99,
      description: "Essential music theory concepts for classical musicians.",
      recordingAvailable: true,
      chatEnabled: false,
      qnaEnabled: true
    },
    {
      id: 4,
      title: "Drum Solo Techniques",
      instructor: "Alex Rodriguez",
      instructorAvatar: "/placeholder.svg",
      topic: "Advanced Drumming",
      category: "Drums",
      scheduledDate: "2024-12-28T16:00:00Z",
      duration: 75,
      maxParticipants: 25,
      currentParticipants: 0,
      status: "Cancelled",
      price: 44.99,
      description: "Master complex drum solo patterns and fills.",
      recordingAvailable: false,
      chatEnabled: true,
      qnaEnabled: true
    }
  ];

  const filteredSessions = liveSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || session.status.toLowerCase() === statusFilter;
    const matchesCategory = categoryFilter === "all" || session.category.toLowerCase() === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleSessionAction = (action: string, sessionId: number) => {
    toast({
      title: `Session ${action}`,
      description: `Live session has been ${action.toLowerCase()} successfully.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live': return 'destructive';
      case 'Scheduled': return 'default';
      case 'Completed': return 'secondary';
      case 'Cancelled': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Live': return <CircleDot className="h-4 w-4 text-red-500" />;
      case 'Scheduled': return <Calendar className="h-4 w-4" />;
      case 'Completed': return <Square className="h-4 w-4" />;
      case 'Cancelled': return <Pause className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const liveSessionsCount = liveSessions.filter(s => s.status === 'Live').length;
  const scheduledCount = liveSessions.filter(s => s.status === 'Scheduled').length;
  const totalParticipants = liveSessions.reduce((sum, session) => sum + session.currentParticipants, 0);
  const totalRevenue = liveSessions
    .filter(s => s.status === 'Completed' || s.status === 'Live')
    .reduce((sum, session) => sum + (session.price * session.currentParticipants), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Video className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Live Sessions Management</h2>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Stream Settings
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Session
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Live Session</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTitle">Session Title</Label>
                  <Input id="sessionTitle" placeholder="Enter session title" />
                </div>
                <div>
                  <Label htmlFor="instructor">Instructor</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select instructor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marcus">Marcus Johnson</SelectItem>
                      <SelectItem value="sarah">Sarah Chen</SelectItem>
                      <SelectItem value="elena">Elena Volkov</SelectItem>
                      <SelectItem value="alex">Alex Rodriguez</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="piano">Piano</SelectItem>
                      <SelectItem value="guitar">Guitar</SelectItem>
                      <SelectItem value="violin">Violin</SelectItem>
                      <SelectItem value="drums">Drums</SelectItem>
                      <SelectItem value="theory">Theory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" type="number" placeholder="0.00" />
                </div>
                <div>
                  <Label htmlFor="scheduledDate">Date & Time</Label>
                  <Input id="scheduledDate" type="datetime-local" />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input id="duration" type="number" placeholder="60" />
                </div>
                <div>
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input id="maxParticipants" type="number" placeholder="50" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter session description" />
                </div>
                <div className="col-span-2 flex justify-end space-x-2">
                  <Button variant="outline">Save as Draft</Button>
                  <Button>Schedule Session</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Live Now</p>
                <p className="text-2xl font-bold text-red-600">{liveSessionsCount}</p>
              </div>
              <CircleDot className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">{scheduledCount}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Participants</p>
                <p className="text-2xl font-bold">{totalParticipants}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Session Revenue</p>
                <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
              </div>
              <Video className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="piano">Piano</SelectItem>
                <SelectItem value="guitar">Guitar</SelectItem>
                <SelectItem value="violin">Violin</SelectItem>
                <SelectItem value="drums">Drums</SelectItem>
                <SelectItem value="theory">Theory</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sessions Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-6 bg-primary/10 rounded flex items-center justify-center">
                        <Video className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{session.title}</p>
                        <p className="text-sm text-muted-foreground">{session.topic}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{session.instructor}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{session.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{new Date(session.scheduledDate).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.scheduledDate).toLocaleTimeString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{session.currentParticipants}/{session.maxParticipants}</span>
                    </div>
                  </TableCell>
                  <TableCell>${session.price}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(session.status)}
                      <Badge variant={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="ghost" onClick={() => setSelectedSession(session)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Session Details</DialogTitle>
                          </DialogHeader>
                          {selectedSession && (
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                                  <p className="text-sm">{selectedSession.title}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Instructor</Label>
                                  <p className="text-sm">{selectedSession.instructor}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                                  <Badge variant="outline">{selectedSession.category}</Badge>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Duration</Label>
                                  <p className="text-sm">{selectedSession.duration} minutes</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                                  <p className="text-sm">{selectedSession.description}</p>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Scheduled Date</Label>
                                  <p className="text-sm">{new Date(selectedSession.scheduledDate).toLocaleString()}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Participants</Label>
                                  <p className="text-sm">{selectedSession.currentParticipants} / {selectedSession.maxParticipants}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Price</Label>
                                  <p className="text-sm">${selectedSession.price}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Features</Label>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedSession.recordingAvailable && <Badge variant="secondary">Recording</Badge>}
                                    {selectedSession.chatEnabled && <Badge variant="secondary">Chat</Badge>}
                                    {selectedSession.qnaEnabled && <Badge variant="secondary">Q&A</Badge>}
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                                  <Badge variant={getStatusColor(selectedSession.status)}>{selectedSession.status}</Badge>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      {session.status === 'Scheduled' && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleSessionAction('Started', session.id)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      {session.status === 'Live' && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleSessionAction('Monitored', session.id)}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {session.status === 'Completed' && session.recordingAvailable && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleSessionAction('Downloaded', session.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleSessionAction('Deleted', session.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};