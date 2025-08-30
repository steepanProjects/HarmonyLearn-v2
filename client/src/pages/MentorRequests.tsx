import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  User, 
  MessageCircle, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Star,
  Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from "@/components/EmptyState";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MentorNavigation } from "@/components/mentor/MentorNavigation";
import { getCurrentUser } from "@/lib/auth";

const responseSchema = z.object({
  response: z.string().min(10, "Please provide a detailed response").max(500, "Response too long"),
});

type ResponseForm = z.infer<typeof responseSchema>;

interface MentorshipRequest {
  id: number;
  studentId: number;
  mentorId: number;
  message: string;
  status: string;
  acceptedAt: Date | null;
  rejectedAt: Date | null;
  mentorResponse: string | null;
  createdAt: Date;
  studentInfo?: {
    firstName: string;
    lastName: string;
    email: string;
  };
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

export const MentorRequests = () => {
  const [selectedRequest, setSelectedRequest] = useState<MentorshipRequest | null>(null);
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'reject'>('accept');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current mentor from localStorage
  const currentUser = getCurrentUser();

  // Fetch mentorship requests for this mentor
  const { data: requests = [], isLoading, error } = useQuery<MentorshipRequest[]>({
    queryKey: ['/api/mentorship-requests', { mentorId: currentUser?.id }],
    enabled: !!currentUser?.id
  });

  // Form for mentor response
  const form = useForm<ResponseForm>({
    resolver: zodResolver(responseSchema),
    defaultValues: {
      response: "",
    },
  });

  // Mutation for updating request status
  const updateRequestMutation = useMutation({
    mutationFn: async ({ requestId, status, mentorResponse }: { 
      requestId: number; 
      status: string; 
      mentorResponse?: string 
    }) => {
      return apiRequest(`/api/mentorship-requests/${requestId}/status`, {
        method: "PATCH",
        body: { status, mentorResponse },
      });
    },
    onSuccess: () => {
      toast({
        title: "Request Updated",
        description: `Mentorship request has been ${actionType === 'accept' ? 'accepted' : 'rejected'} successfully.`,
      });
      setResponseDialogOpen(false);
      form.reset();
      setSelectedRequest(null);
      queryClient.invalidateQueries({ queryKey: ['/api/mentorship-requests'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleRequestAction = (request: MentorshipRequest, action: 'accept' | 'reject') => {
    setSelectedRequest(request);
    setActionType(action);
    setResponseDialogOpen(true);
    
    // Pre-fill response for acceptance
    if (action === 'accept') {
      form.setValue('response', `Hi! I'm excited to work with you as your mentor. Let's schedule our first session to discuss your goals and create a learning plan.`);
    } else {
      form.setValue('response', '');
    }
  };

  const onSubmitResponse = async (data: ResponseForm) => {
    if (!selectedRequest) return;
    
    updateRequestMutation.mutate({
      requestId: selectedRequest.id,
      status: actionType === 'accept' ? 'accepted' : 'rejected',
      mentorResponse: data.response,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'accepted':
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const acceptedRequests = requests.filter(req => req.status === 'accepted');
  const rejectedRequests = requests.filter(req => req.status === 'rejected');

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mentorship Requests</h1>
          <p className="text-muted-foreground">Loading your mentorship requests...</p>
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
          <div className="text-lg text-red-600">Error loading requests. Please try again later.</div>
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
          <h1 className="text-3xl font-bold mb-2">Mentorship Requests</h1>
          <p className="text-muted-foreground">
            Manage incoming mentorship requests from students
          </p>
        </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Accepted ({acceptedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingRequests.length > 0 ? (
            pendingRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-hero text-white">
                          {request.studentInfo?.firstName?.[0] || 'S'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {request.studentInfo?.firstName && request.studentInfo?.lastName
                            ? `${request.studentInfo.firstName} ${request.studentInfo.lastName}`
                            : 'Student'
                          }
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {request.studentInfo?.email || 'No email provided'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Requested {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Student's Message:</h4>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                      {request.message}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleRequestAction(request, 'accept')}
                      className="flex-1"
                      disabled={updateRequestMutation.isPending}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accept
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleRequestAction(request, 'reject')}
                      className="flex-1"
                      disabled={updateRequestMutation.isPending}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Decline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <EmptyState
              icon={MessageCircle}
              title="No Pending Requests"
              description="You don't have any pending mentorship requests at the moment."
            />
          )}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          {acceptedRequests.length > 0 ? (
            acceptedRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-green-600 text-white">
                          {request.studentInfo?.firstName?.[0] || 'S'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {request.studentInfo?.firstName && request.studentInfo?.lastName
                            ? `${request.studentInfo.firstName} ${request.studentInfo.lastName}`
                            : 'Student'
                          }
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Accepted {new Date(request.acceptedAt!).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  {request.mentorResponse && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Your Response:</h4>
                      <p className="text-sm text-muted-foreground bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                        {request.mentorResponse}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button className="flex-1" variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Session
                    </Button>
                    <Button className="flex-1" variant="outline">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message Student
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <EmptyState
              icon={CheckCircle}
              title="No Accepted Requests"
              description="You haven't accepted any mentorship requests yet."
            />
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedRequests.length > 0 ? (
            rejectedRequests.map((request) => (
              <Card key={request.id} className="opacity-75">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gray-500 text-white">
                          {request.studentInfo?.firstName?.[0] || 'S'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {request.studentInfo?.firstName && request.studentInfo?.lastName
                            ? `${request.studentInfo.firstName} ${request.studentInfo.lastName}`
                            : 'Student'
                          }
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Rejected {new Date(request.rejectedAt!).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  {request.mentorResponse && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Your Response:</h4>
                      <p className="text-sm text-muted-foreground bg-red-50 dark:bg-red-950 p-3 rounded-lg">
                        {request.mentorResponse}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <EmptyState
              icon={XCircle}
              title="No Rejected Requests"
              description="You haven't rejected any mentorship requests."
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Response Dialog */}
      <Dialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'accept' ? 'Accept' : 'Decline'} Mentorship Request
            </DialogTitle>
            <DialogDescription>
              {actionType === 'accept' 
                ? 'Send a welcoming message to your new student.'
                : 'Please provide a polite reason for declining this request.'
              }
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitResponse)} className="space-y-4">
              <FormField
                control={form.control}
                name="response"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {actionType === 'accept' ? 'Welcome Message' : 'Decline Reason'}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={actionType === 'accept' 
                          ? "Welcome them and outline next steps..."
                          : "Explain your reason for declining politely..."
                        }
                        className="min-h-[120px]"
                        {...field}
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
                  onClick={() => setResponseDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateRequestMutation.isPending}
                  className={actionType === 'accept' ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  {updateRequestMutation.isPending ? "Sending..." : 
                   actionType === 'accept' ? 'Accept Request' : 'Decline Request'}
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

export default MentorRequests;