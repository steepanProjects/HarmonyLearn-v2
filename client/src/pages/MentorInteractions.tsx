import { useState, useEffect } from "react";
import { MessageCircle, Calendar, Clock, User, Send, Check, CheckCheck, Video, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { MentorNavigation } from "@/components/mentor/MentorNavigation";
import { getCurrentUser } from "@/lib/auth";

// API function
const apiRequest = async (url: string, options: { method: string; body?: any }) => {
  const response = await fetch(url, {
    method: options.method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

interface MentorshipRequest {
  id: number;
  studentId: number;
  mentorId: number;
  message: string;
  status: string;
  acceptedAt: string | null;
  rejectedAt: string | null;
  mentorResponse: string | null;
  createdAt: string;
}

interface MentorConversation {
  id: number;
  mentorshipRequestId: number;
  senderId: number;
  message: string;
  messageType: string;
  attachmentUrl: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

interface MentorshipSession {
  id: number;
  mentorshipRequestId: number;
  title: string;
  description: string | null;
  scheduledAt: string;
  duration: number;
  status: string;
  meetingLink: string | null;
  recordingUrl: string | null;
  mentorNotes: string | null;
  studentNotes: string | null;
  sessionFeedback: string | null;
  rating: number | null;
  createdAt: string;
}

export const MentorInteractions = () => {
  const currentUser = getCurrentUser();
  
  const [selectedRequest, setSelectedRequest] = useState<MentorshipRequest | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect if not authenticated
  useEffect(() => {
    if (!currentUser) {
      window.location.href = '/student-signin';
      return;
    }
  }, [currentUser]);

  // Fetch mentorship requests for the current user
  const { data: requests = [], isLoading: requestsLoading } = useQuery<MentorshipRequest[]>({
    queryKey: ['/api/mentorship-requests', { 
      [currentUser?.role === 'mentor' ? 'mentorId' : 'studentId']: currentUser?.id 
    }],
    enabled: !!currentUser,
  });

  // Fetch conversations for the selected request
  const { data: conversations = [], isLoading: conversationsLoading } = useQuery<MentorConversation[]>({
    queryKey: ['/api/mentorship-requests', selectedRequest?.id, 'conversations'],
    enabled: !!selectedRequest,
  });

  // Fetch sessions for the selected request
  const { data: sessions = [], isLoading: sessionsLoading } = useQuery<MentorshipSession[]>({
    queryKey: ['/api/mentorship-requests', selectedRequest?.id, 'sessions'],
    enabled: !!selectedRequest,
  });

  // Mutation for sending messages
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { message: string }) => {
      if (!selectedRequest) throw new Error("No request selected");
      return apiRequest(`/api/mentorship-requests/${selectedRequest.id}/conversations`, {
        method: "POST",
        body: {
          senderId: currentUser.id,
          message: data.message,
          messageType: 'text',
        },
      });
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ 
        queryKey: ['/api/mentorship-requests', selectedRequest?.id, 'conversations'] 
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });

  // Mutation for accepting/rejecting requests (mentor only)
  const updateRequestMutation = useMutation({
    mutationFn: async (data: { status: string; mentorResponse?: string }) => {
      if (!selectedRequest) throw new Error("No request selected");
      return apiRequest(`/api/mentorship-requests/${selectedRequest.id}/status`, {
        method: "PATCH",
        body: data,
      });
    },
    onSuccess: () => {
      toast({
        title: "Request Updated",
        description: "The mentorship request has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/mentorship-requests'] });
      queryClient.invalidateQueries({ 
        queryKey: ['/api/mentorship-requests', selectedRequest?.id, 'conversations'] 
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update request",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedRequest) return;
    sendMessageMutation.mutate({ message: newMessage });
  };

  const handleAcceptRequest = () => {
    updateRequestMutation.mutate({ 
      status: 'accepted',
      mentorResponse: 'I would be happy to mentor you! Let\'s start our journey together.'
    });
  };

  const handleRejectRequest = () => {
    updateRequestMutation.mutate({ 
      status: 'rejected',
      mentorResponse: 'Thank you for your interest. Unfortunately, I\'m not available for new students at this time.'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  if (!currentUser) return null;

  if (requestsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mentor Interactions</h1>
        <div className="text-center py-8">Loading your interactions...</div>
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
        <h1 className="text-3xl font-bold mb-8">
          {currentUser.role === 'mentor' ? 'Student Requests' : 'My Mentorship Requests'}
        </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {currentUser.role === 'mentor' ? 'Incoming Requests' : 'Your Requests'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                {requests.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    {currentUser.role === 'mentor' 
                      ? 'No student requests yet' 
                      : 'No mentorship requests sent yet'
                    }
                  </div>
                ) : (
                  requests.map((request) => (
                    <div
                      key={request.id}
                      className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                        selectedRequest?.id === request.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => setSelectedRequest(request)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">
                          {currentUser.role === 'mentor' ? 'Student Request' : 'Mentor Request'}
                        </h3>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {request.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {request.createdAt ? format(new Date(request.createdAt), 'MMM d, yyyy') : 'Recently'}
                      </p>
                    </div>
                  ))
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Chat and Sessions */}
        <div className="lg:col-span-2">
          {selectedRequest ? (
            <Tabs defaultValue="chat" className="h-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="sessions" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Sessions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Conversation
                      </CardTitle>
                      {currentUser.role === 'mentor' && selectedRequest.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleAcceptRequest}
                            disabled={updateRequestMutation.isPending}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleRejectRequest}
                            disabled={updateRequestMutation.isPending}
                          >
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Initial Request Message */}
                    <div className="mb-4 p-3 bg-muted rounded-lg">
                      <div className="text-sm font-medium mb-1">Initial Request:</div>
                      <div className="text-sm">{selectedRequest.message}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {selectedRequest.createdAt ? format(new Date(selectedRequest.createdAt), 'MMM d, yyyy HH:mm') : 'Recently'}
                      </div>
                    </div>

                    {/* Mentor Response */}
                    {selectedRequest.mentorResponse && (
                      <div className="mb-4 p-3 bg-primary/10 rounded-lg">
                        <div className="text-sm font-medium mb-1">Mentor Response:</div>
                        <div className="text-sm">{selectedRequest.mentorResponse}</div>
                      </div>
                    )}

                    {/* Conversations */}
                    <ScrollArea className="h-[300px] mb-4">
                      {conversations.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                          {selectedRequest.status === 'accepted' 
                            ? 'Start the conversation!'
                            : 'Waiting for mentor response...'
                          }
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {conversations.map((conversation) => (
                            <div
                              key={conversation.id}
                              className={`flex ${
                                conversation.senderId === currentUser.id ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <div
                                className={`max-w-[70%] p-3 rounded-lg ${
                                  conversation.senderId === currentUser.id
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                <div className="text-sm">{conversation.message}</div>
                                <div className="flex items-center gap-1 mt-1 justify-end">
                                  <span className="text-xs opacity-70">
                                    {conversation.createdAt ? format(new Date(conversation.createdAt), 'HH:mm') : 'Now'}
                                  </span>
                                  {conversation.senderId === currentUser.id && (
                                    conversation.isRead ? (
                                      <CheckCheck className="h-3 w-3 opacity-70" />
                                    ) : (
                                      <Check className="h-3 w-3 opacity-70" />
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>

                    {/* Message Input */}
                    {selectedRequest.status === 'accepted' && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || sendMessageMutation.isPending}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sessions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Mentorship Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {sessions.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        No sessions scheduled yet
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {sessions.map((session) => (
                          <div key={session.id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">{session.title}</h3>
                              <Badge variant="outline">{session.status}</Badge>
                            </div>
                            {session.description && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {session.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {session.scheduledAt ? format(new Date(session.scheduledAt), 'MMM d, yyyy HH:mm') : 'TBD'}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {session.duration} minutes
                              </div>
                            </div>
                            {session.meetingLink && (
                              <div className="mt-2">
                                <Button size="sm" variant="outline" asChild>
                                  <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                                    <Video className="h-4 w-4 mr-2" />
                                    Join Meeting
                                  </a>
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">
                  Select a mentorship request to view the conversation and sessions
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default MentorInteractions;