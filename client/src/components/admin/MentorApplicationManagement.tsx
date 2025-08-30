import { useState, useEffect } from "react";
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
  GraduationCap, Search, Filter, Eye, CheckCircle, X, Clock, 
  Award, User, Calendar, FileText, MessageSquare
} from "lucide-react";

interface MentorApplication {
  id: number;
  userId: number;
  name: string;
  email: string;
  specialization: string;
  experience: string;
  bio: string;
  credentials: string;
  portfolio?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  reviewedBy?: number;
  reviewedAt?: string;
  createdAt: string;
}

export const MentorApplicationManagement = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<MentorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<MentorApplication | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/mentor-applications');
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch mentor applications",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to fetch applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleReviewApplication = async (applicationId: number, status: 'approved' | 'rejected') => {
    setIsReviewing(true);
    
    try {
      const response = await fetch(`/api/mentor-applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          adminNotes: reviewNotes,
          reviewedBy: 1 // TODO: Get actual admin user ID
        }),
      });

      if (response.ok) {
        toast({
          title: "Application Updated",
          description: `Application ${status} successfully`,
        });
        
        // Refresh applications
        await fetchApplications();
        setSelectedApplication(null);
        setReviewNotes("");
      } else {
        const data = await response.json();
        toast({
          title: "Update Failed",
          description: data.error || "Failed to update application",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to update application",
        variant: "destructive",
      });
    } finally {
      setIsReviewing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><X className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-6 h-6 text-secondary" />
          <h2 className="text-2xl font-bold">Mentor Applications</h2>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading applications...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-6 h-6 text-secondary" />
          <h2 className="text-2xl font-bold">Mentor Applications</h2>
          <Badge variant="secondary">{applications.length} Total</Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="w-8 h-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">{applications.filter(a => a.status === 'pending').length}</p>
              <p className="text-xs text-muted-foreground">Pending Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">{applications.filter(a => a.status === 'approved').length}</p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <X className="w-8 h-8 text-red-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">{applications.filter(a => a.status === 'rejected').length}</p>
              <p className="text-xs text-muted-foreground">Rejected</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Award className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">{applications.length}</p>
              <p className="text-xs text-muted-foreground">Total Applications</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Applications ({filteredApplications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <User className="w-8 h-8 text-gray-400" />
                      <div>
                        <div className="font-medium">{application.name || 'Unknown User'}</div>
                        <div className="text-sm text-muted-foreground">{application.email || 'No email'}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{application.specialization}</TableCell>
                  <TableCell className="max-w-xs truncate">{application.experience}</TableCell>
                  <TableCell>{getStatusBadge(application.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(application.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedApplication(application)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Review Mentor Application</DialogTitle>
                        </DialogHeader>
                        {selectedApplication && (
                          <div className="space-y-6">
                            {/* Applicant Info */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Applicant Name</Label>
                                <p className="mt-1">{selectedApplication.name || 'Unknown User'}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Email</Label>
                                <p className="mt-1">{selectedApplication.email || 'No email'}</p>
                              </div>
                            </div>

                            {/* Application Details */}
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium">Specialization</Label>
                                <p className="mt-1">{selectedApplication.specialization}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Experience</Label>
                                <p className="mt-1">{selectedApplication.experience}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Bio</Label>
                                <p className="mt-1">{selectedApplication.bio}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Credentials</Label>
                                <p className="mt-1">{selectedApplication.credentials}</p>
                              </div>
                            </div>

                            {/* Review Notes */}
                            <div>
                              <Label htmlFor="reviewNotes" className="text-sm font-medium">Admin Notes</Label>
                              <Textarea
                                id="reviewNotes"
                                placeholder="Add notes about this application..."
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                className="mt-1"
                                rows={3}
                              />
                            </div>

                            {/* Action Buttons */}
                            {selectedApplication.status === 'pending' && (
                              <div className="flex gap-3 pt-4">
                                <Button
                                  onClick={() => handleReviewApplication(selectedApplication.id, 'approved')}
                                  disabled={isReviewing}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve Application
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleReviewApplication(selectedApplication.id, 'rejected')}
                                  disabled={isReviewing}
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Reject Application
                                </Button>
                              </div>
                            )}

                            {/* Existing Review Info */}
                            {selectedApplication.status !== 'pending' && (
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <MessageSquare className="w-4 h-4" />
                                  <span className="font-medium">Review Status: {getStatusBadge(selectedApplication.status)}</span>
                                </div>
                                {selectedApplication.adminNotes && (
                                  <div>
                                    <p className="text-sm font-medium">Admin Notes:</p>
                                    <p className="text-sm text-muted-foreground mt-1">{selectedApplication.adminNotes}</p>
                                  </div>
                                )}
                                {selectedApplication.reviewedAt && (
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Reviewed on {formatDate(selectedApplication.reviewedAt)}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-500">No mentor applications match your current filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};