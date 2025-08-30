import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Clock, CheckCircle, XCircle, Search, Mail, Calendar,
  UserCheck, UserX, AlertCircle, Users, Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getCurrentUser } from "@/lib/auth";

interface EnrollmentRequest {
  id: number;
  userId: number;
  classroomId: number;
  role: string;
  status: string;
  joinedAt: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
}

interface EnrollmentRequestManagerProps {
  classroomId: number;
  academyName: string;
}

export default function EnrollmentRequestManager({ classroomId, academyName }: EnrollmentRequestManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("pending");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const user = getCurrentUser();

  // Fetch enrollment requests
  const { data: allRequests = [], isLoading } = useQuery({
    queryKey: ["/api/classrooms", classroomId, "requests"],
    queryFn: () => apiRequest(`/api/classrooms/${classroomId}/requests`),
    enabled: !!classroomId,
  });

  // Filter requests by status and search
  const pendingRequests = allRequests.filter((req: EnrollmentRequest) => req.status === 'pending');
  const approvedRequests = allRequests.filter((req: EnrollmentRequest) => req.status === 'active');
  const rejectedRequests = allRequests.filter((req: EnrollmentRequest) => req.status === 'rejected');

  const filteredRequests = {
    pending: pendingRequests.filter((req: EnrollmentRequest) => 
      req.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    approved: approvedRequests.filter((req: EnrollmentRequest) => 
      req.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    rejected: rejectedRequests.filter((req: EnrollmentRequest) => 
      req.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  };

  // Approve request mutation
  const approveRequestMutation = useMutation({
    mutationFn: (requestId: number) => 
      apiRequest(`/api/classroom-memberships/${requestId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ 
          status: "active",
          reviewedBy: user?.id 
        })
      }),
    onSuccess: () => {
      toast({ 
        title: "Request Approved!", 
        description: "The student has been accepted into your academy."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/classrooms", classroomId, "requests"] });
    },
    onError: () => {
      toast({ 
        title: "Failed to approve request", 
        description: "There was an error approving the request. Please try again.",
        variant: "destructive" 
      });
    }
  });

  // Reject request mutation
  const rejectRequestMutation = useMutation({
    mutationFn: (requestId: number) => 
      apiRequest(`/api/classroom-memberships/${requestId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ 
          status: "rejected",
          reviewedBy: user?.id 
        })
      }),
    onSuccess: () => {
      toast({ 
        title: "Request Rejected", 
        description: "The enrollment request has been declined."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/classrooms", classroomId, "requests"] });
    },
    onError: () => {
      toast({ 
        title: "Failed to reject request", 
        description: "There was an error rejecting the request. Please try again.",
        variant: "destructive" 
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const renderRequestsTable = (requests: EnrollmentRequest[], showActions = false) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Request Date</TableHead>
          <TableHead>Status</TableHead>
          {showActions && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.length === 0 ? (
          <TableRow>
            <TableCell colSpan={showActions ? 5 : 4} className="text-center py-8 text-muted-foreground">
              No {selectedTab} requests found
            </TableCell>
          </TableRow>
        ) : (
          requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={request.avatar} />
                    <AvatarFallback>
                      {request.firstName?.[0]}{request.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {request.firstName && request.lastName ? 
                        `${request.firstName} ${request.lastName}` : 
                        request.username}
                    </div>
                    <div className="text-sm text-muted-foreground">@{request.username}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {request.email}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {new Date(request.joinedAt).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(request.status)}>
                  {getStatusIcon(request.status)}
                  <span className="ml-1 capitalize">{request.status}</span>
                </Badge>
              </TableCell>
              {showActions && (
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => approveRequestMutation.mutate(request.id)}
                      disabled={approveRequestMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => rejectRequestMutation.mutate(request.id)}
                      disabled={rejectRequestMutation.isPending}
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading enrollment requests...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Enrollment Requests
        </CardTitle>
        <CardDescription>
          Manage student enrollment requests for {academyName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, username, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">{pendingRequests.length}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{approvedRequests.length}</div>
                  <div className="text-sm text-muted-foreground">Approved</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <div>
                  <div className="text-2xl font-bold">{rejectedRequests.length}</div>
                  <div className="text-sm text-muted-foreground">Rejected</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Approved ({approvedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Rejected ({rejectedRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            {renderRequestsTable(filteredRequests.pending, true)}
          </TabsContent>

          <TabsContent value="approved" className="mt-6">
            {renderRequestsTable(filteredRequests.approved, false)}
          </TabsContent>

          <TabsContent value="rejected" className="mt-6">
            {renderRequestsTable(filteredRequests.rejected, false)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}