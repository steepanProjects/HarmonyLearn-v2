import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Clock, User, MessageSquare, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ResignationRequest {
  id: number;
  mentorId: number;
  classroomId: number;
  reason: string;
  status: string;
  reviewedBy: number | null;
  reviewedAt: string | null;
  masterNotes: string | null;
  createdAt: string;
}

interface ResignationRequestManagerProps {
  classroomId: number;
  masterId: number;
}

export default function ResignationRequestManager({ classroomId, masterId }: ResignationRequestManagerProps) {
  const [selectedRequest, setSelectedRequest] = useState<ResignationRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: resignationRequests = [], isLoading } = useQuery({
    queryKey: ["/api/resignation-requests", { classroomId }],
    queryFn: () => apiRequest(`/api/resignation-requests?classroomId=${classroomId}`),
  });

  const { data: mentors = [] } = useQuery({
    queryKey: ["/api/users", { role: "mentor" }],
    queryFn: () => apiRequest("/api/users?role=mentor"),
  });

  const reviewMutation = useMutation({
    mutationFn: ({ requestId, status, masterNotes }: { requestId: number; status: string; masterNotes?: string }) =>
      apiRequest(`/api/resignation-requests/${requestId}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status,
          masterNotes,
          reviewedBy: masterId,
        }),
      }),
    onSuccess: (_, { status }) => {
      toast({
        title: "Resignation Request Reviewed",
        description: `The resignation request has been ${status}.`,
      });
      setReviewDialogOpen(false);
      setReviewNotes("");
      setSelectedRequest(null);
      queryClient.invalidateQueries({ queryKey: ["/api/resignation-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/classroom-memberships"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to review resignation request",
        variant: "destructive",
      });
    },
  });

  const getMentorName = (mentorId: number) => {
    const mentor = mentors.find((m: any) => m.id === mentorId);
    return mentor ? `${mentor.firstName} ${mentor.lastName}` : "Unknown Mentor";
  };

  const handleReview = (request: ResignationRequest) => {
    setSelectedRequest(request);
    setReviewNotes("");
    setReviewDialogOpen(true);
  };

  const submitReview = (status: "approved" | "rejected") => {
    if (!selectedRequest) return;
    
    reviewMutation.mutate({
      requestId: selectedRequest.id,
      status,
      masterNotes: reviewNotes.trim() !== "" ? reviewNotes : undefined,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="border-yellow-300 text-yellow-700 bg-yellow-50"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="border-red-300 text-red-700 bg-red-50"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Staff Resignation Requests</CardTitle>
          <CardDescription>Loading resignation requests...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const pendingRequests = resignationRequests.filter((r: ResignationRequest) => r.status === "pending");
  const reviewedRequests = resignationRequests.filter((r: ResignationRequest) => r.status !== "pending");

  return (
    <div className="space-y-6">
      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Pending Resignation Requests ({pendingRequests.length})
            </CardTitle>
            <CardDescription>
              Staff members requesting to leave your academy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingRequests.map((request: ResignationRequest) => (
              <div key={request.id} className="border rounded-lg p-4 bg-amber-50/50 border-amber-200">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{getMentorName(request.mentorId)}</span>
                    {getStatusBadge(request.status)}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="mb-3">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Reason for Resignation:
                  </label>
                  <p className="text-sm text-gray-600 bg-white p-3 rounded border">
                    {request.reason}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleReview(request)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Review Request
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Reviewed Requests History */}
      {reviewedRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resignation Request History</CardTitle>
            <CardDescription>Previously reviewed resignation requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {reviewedRequests.map((request: ResignationRequest) => (
              <div key={request.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{getMentorName(request.mentorId)}</span>
                    {getStatusBadge(request.status)}
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>Submitted: {new Date(request.createdAt).toLocaleDateString()}</div>
                    {request.reviewedAt && (
                      <div>Reviewed: {new Date(request.reviewedAt).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>
                {request.masterNotes && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                    <strong>Master Notes:</strong> {request.masterNotes}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {resignationRequests.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Staff Resignation Requests</CardTitle>
            <CardDescription>No resignation requests for your academy</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-500 py-8">
              All your staff members are happy and engaged! No resignation requests at this time.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Review Resignation Request</DialogTitle>
            <DialogDescription>
              {selectedRequest && (
                <>Review resignation request from {getMentorName(selectedRequest.mentorId)}</>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Resignation Reason:</label>
                <div className="p-3 bg-gray-50 rounded border text-sm">
                  {selectedRequest.reason}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Master Notes (Optional):</label>
                <Textarea
                  placeholder="Add notes about your decision (optional)..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Approving</strong> this request will immediately remove the mentor from your academy staff. 
                  They can then apply to join other academies.
                </AlertDescription>
              </Alert>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setReviewDialogOpen(false)}
                  disabled={reviewMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => submitReview("rejected")}
                  disabled={reviewMutation.isPending}
                >
                  {reviewMutation.isPending ? "Processing..." : "Reject"}
                </Button>
                <Button
                  onClick={() => submitReview("approved")}
                  disabled={reviewMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {reviewMutation.isPending ? "Processing..." : "Approve Resignation"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}