import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser } from "@/lib/auth";
import { Crown, Eye, CheckCircle, XCircle, Clock, User } from "lucide-react";
import { format } from "date-fns";

const apiRequest = async (url: string, options: { method: string; body?: string }) => {
  const response = await fetch(url, {
    method: options.method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: options.body,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

interface MasterRoleRequest {
  id: number;
  mentorId: number;
  reason: string;
  experience: string;
  plannedClassrooms: string;
  additionalQualifications?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  reviewedBy?: number;
  reviewedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  createdAt: Date;
}

const reviewSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  adminNotes: z.string().optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'approved':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="w-4 h-4" />;
    case 'approved':
      return <CheckCircle className="w-4 h-4" />;
    case 'rejected':
      return <XCircle className="w-4 h-4" />;
    default:
      return <User className="w-4 h-4" />;
  }
};

interface RequestDetailsDialogProps {
  request: MasterRoleRequest;
  onReview: (requestId: number, data: ReviewFormData) => void;
  isReviewing: boolean;
}

function RequestDetailsDialog({ request, onReview, isReviewing }: RequestDetailsDialogProps) {
  const [open, setOpen] = useState(false);
  
  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      adminNotes: "",
    },
  });

  const onSubmit = (data: ReviewFormData) => {
    onReview(request.id, data);
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          Review
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            Master Role Request Details
          </DialogTitle>
          <DialogDescription>
            Review and approve or reject this master role request
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Request Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(request.status)}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Submitted: {format(new Date(request.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </span>
            </div>

            <div className="grid gap-4">
              <div>
                <h4 className="font-semibold mb-2">Why they want to become a master:</h4>
                <p className="text-sm bg-muted p-3 rounded-lg">{request.reason}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Teaching & Classroom Management Experience:</h4>
                <p className="text-sm bg-muted p-3 rounded-lg">{request.experience}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Planned Classrooms & Teaching Approach:</h4>
                <p className="text-sm bg-muted p-3 rounded-lg">{request.plannedClassrooms}</p>
              </div>

              {request.additionalQualifications && (
                <div>
                  <h4 className="font-semibold mb-2">Additional Qualifications:</h4>
                  <p className="text-sm bg-muted p-3 rounded-lg">{request.additionalQualifications}</p>
                </div>
              )}
            </div>
          </div>

          {/* Review Form - Only show if pending */}
          {request.status === 'pending' && (
            <div className="border-t pt-6">
              <h4 className="font-semibold mb-4">Review Decision</h4>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Decision</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select decision" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="approved">Approve Request</SelectItem>
                            <SelectItem value="rejected">Reject Request</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="adminNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add notes about your decision..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={isReviewing || !form.watch('status')}
                    >
                      {isReviewing ? "Processing..." : "Submit Review"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}

          {/* Previous Review Info */}
          {request.status !== 'pending' && (
            <div className="border-t pt-6">
              <h4 className="font-semibold mb-2">Review Information</h4>
              <div className="text-sm space-y-1">
                <p><strong>Status:</strong> {request.status.charAt(0).toUpperCase() + request.status.slice(1)}</p>
                {request.reviewedAt && (
                  <p><strong>Reviewed:</strong> {format(new Date(request.reviewedAt), "MMM d, yyyy 'at' h:mm a")}</p>
                )}
                {request.adminNotes && (
                  <div className="mt-2">
                    <strong>Admin Notes:</strong>
                    <p className="bg-muted p-2 rounded mt-1">{request.adminNotes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function MasterRoleRequestManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const currentUser = getCurrentUser();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: requests, isLoading } = useQuery({
    queryKey: ['/api/master-role-requests', statusFilter],
    queryFn: async () => {
      const url = statusFilter === 'all' 
        ? '/api/master-role-requests' 
        : `/api/master-role-requests?status=${statusFilter}`;
      return fetch(url).then(res => res.json());
    },
  });

  // Fetch all mentors to get names
  const { data: mentors } = useQuery({
    queryKey: ['/api/users', 'mentors'],
    queryFn: async () => {
      return fetch('/api/users?role=mentor').then(res => res.json());
    },
  });

  const getMentorName = (mentorId: number) => {
    const mentor = mentors?.find((m: any) => m.id === mentorId);
    return mentor ? `${mentor.firstName || ''} ${mentor.lastName || ''}`.trim() || mentor.username : `Mentor ${mentorId}`;
  };

  const reviewRequest = useMutation({
    mutationFn: async ({ requestId, data }: { requestId: number; data: ReviewFormData }) => {
      return apiRequest(`/api/master-role-requests/${requestId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          ...data,
          reviewedBy: parseInt(currentUser?.id || '0'),
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Request Reviewed",
        description: "The master role request has been reviewed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/master-role-requests'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to review request",
        variant: "destructive",
      });
    },
  });

  const handleReview = (requestId: number, data: ReviewFormData) => {
    reviewRequest.mutate({ requestId, data });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const requestList = Array.isArray(requests) ? requests as MasterRoleRequest[] : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-500" />
          Master Role Requests
        </CardTitle>
        <CardDescription>
          Review and approve mentor applications for master status
        </CardDescription>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {requestList.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No master role requests found.
          </div>
        ) : (
          <div className="space-y-4">
            {requestList.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(request.status)}
                    <div>
                      <p className="font-medium">{getMentorName(request.mentorId)}</p>
                      <p className="text-sm text-muted-foreground">
                        Submitted {format(new Date(request.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(request.status)}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                    <RequestDetailsDialog
                      request={request}
                      onReview={handleReview}
                      isReviewing={reviewRequest.isPending}
                    />
                  </div>
                </div>
                
                <div className="text-sm">
                  <p className="line-clamp-2">{request.reason}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}