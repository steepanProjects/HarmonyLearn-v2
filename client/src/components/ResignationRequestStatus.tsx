import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
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

interface ResignationRequestStatusProps {
  mentorId: number;
}

export default function ResignationRequestStatus({ mentorId }: ResignationRequestStatusProps) {
  const { data: resignationRequests = [], isLoading } = useQuery({
    queryKey: ["/api/mentors", mentorId, "resignation-requests"],
    queryFn: () => apiRequest(`/api/mentors/${mentorId}/resignation-requests`),
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="border-yellow-300 text-yellow-700 bg-yellow-50"><Clock className="h-3 w-3 mr-1" />Pending Review</Badge>;
      case "approved":
        return <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="border-red-300 text-red-700 bg-red-50"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "pending":
        return "Your resignation request is being reviewed by the master teacher.";
      case "approved":
        return "Your resignation has been approved. You have been removed from the academy.";
      case "rejected":
        return "Your resignation request was not approved. Please contact the master teacher for more information.";
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resignation Status</CardTitle>
          <CardDescription>Loading resignation request status...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (resignationRequests.length === 0) {
    return null; // Don't show anything if there are no resignation requests
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Resignation Request Status
        </CardTitle>
        <CardDescription>
          Track the status of your resignation requests
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {resignationRequests.map((request: ResignationRequest) => (
          <div key={request.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                {getStatusBadge(request.status)}
              </div>
              <div className="text-right text-sm text-gray-500">
                <div>Submitted: {new Date(request.createdAt).toLocaleDateString()}</div>
                {request.reviewedAt && (
                  <div>Reviewed: {new Date(request.reviewedAt).toLocaleDateString()}</div>
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              {getStatusMessage(request.status)}
            </p>
            
            {request.masterNotes && (
              <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                <p className="text-sm font-medium text-blue-900 mb-1">Master Teacher Notes:</p>
                <p className="text-sm text-blue-800">{request.masterNotes}</p>
              </div>
            )}
            
            {request.status === "pending" && (
              <div className="mt-3 p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                <p className="text-sm text-yellow-800">
                  Please wait for the master teacher to review your request. You will be notified once a decision is made.
                </p>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}