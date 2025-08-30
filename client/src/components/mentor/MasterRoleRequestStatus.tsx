import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getCurrentUser, refreshUserData } from "@/lib/auth";
import { Crown, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";

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

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case 'approved':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'rejected':
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return <AlertCircle className="w-4 h-4 text-gray-500" />;
  }
};

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

export default function MasterRoleRequestStatus() {
  const currentUser = getCurrentUser();

  const { data: requests, isLoading } = useQuery({
    queryKey: [`/api/mentors/${currentUser?.id}/master-role-requests`],
    enabled: !!currentUser?.id,
  });

  // Refresh user data when master role request is approved
  useEffect(() => {
    if (requests && Array.isArray(requests) && requests.length > 0) {
      const latestRequest = requests[0] as MasterRoleRequest;
      if (latestRequest.status === 'approved' && !currentUser?.isMaster) {
        // If the request is approved but user data doesn't reflect master status yet
        refreshUserData().then(() => {
          console.log('User data refreshed after master role approval');
        });
      }
    }
  }, [requests, currentUser?.isMaster]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!requests || !Array.isArray(requests) || requests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            Master Role Status
          </CardTitle>
          <CardDescription>
            You haven't submitted a master role request yet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              To become a master and create classrooms, you need to submit a master role request for admin approval.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const latestRequest = (requests as MasterRoleRequest[])[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-500" />
          Master Role Request Status
        </CardTitle>
        <CardDescription>
          Track your master role application progress
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(latestRequest.status)}
            <span className="font-medium">Current Status:</span>
            <Badge className={getStatusColor(latestRequest.status)}>
              {latestRequest.status.charAt(0).toUpperCase() + latestRequest.status.slice(1)}
            </Badge>
          </div>
          <span className="text-sm text-muted-foreground">
            Submitted: {format(new Date(latestRequest.createdAt), "MMM d, yyyy")}
          </span>
        </div>

        {latestRequest.status === 'pending' && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Your master role request is being reviewed by our admin team. You'll be notified once a decision is made.
            </AlertDescription>
          </Alert>
        )}

        {latestRequest.status === 'approved' && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 dark:text-green-300">
              Congratulations! Your master role request has been approved. You can now create and manage classrooms.
              {latestRequest.approvedAt && (
                <span className="block mt-1 text-sm">
                  Approved on: {format(new Date(latestRequest.approvedAt), "MMM d, yyyy 'at' h:mm a")}
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {latestRequest.status === 'rejected' && (
          <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700 dark:text-red-300">
              Your master role request was not approved at this time.
              {latestRequest.rejectedAt && (
                <span className="block mt-1 text-sm">
                  Reviewed on: {format(new Date(latestRequest.rejectedAt), "MMM d, yyyy 'at' h:mm a")}
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {latestRequest.adminNotes && (
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Admin Notes:</h4>
            <p className="text-sm text-muted-foreground">{latestRequest.adminNotes}</p>
          </div>
        )}

        <div className="grid gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-1">Your Application Summary:</h4>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Reason:</strong> {latestRequest.reason.slice(0, 100)}...</p>
              <p><strong>Experience:</strong> {latestRequest.experience.slice(0, 100)}...</p>
              <p><strong>Planned Classrooms:</strong> {latestRequest.plannedClassrooms.slice(0, 100)}...</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}