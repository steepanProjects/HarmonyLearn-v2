import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Shield, Search, Flag, CheckCircle, X, Eye, MessageCircle, 
  FileText, Video, AlertTriangle, Calendar, User 
} from "lucide-react";

interface Report {
  id: number;
  type: 'Course' | 'Comment' | 'Message' | 'Profile' | 'Live Session';
  title: string;
  reportedBy: string;
  reportedUser: string;
  reason: string;
  description: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Under Review';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  reportDate: string;
  lastUpdated: string;
}

export const ContentModeration = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

  const reports: Report[] = [
    {
      id: 1,
      type: 'Course',
      title: 'Advanced Piano Techniques',
      reportedBy: 'student123@email.com',
      reportedUser: 'pianist_pro',
      reason: 'Inappropriate Content',
      description: 'Course contains copyrighted material without permission',
      status: 'Pending',
      severity: 'High',
      reportDate: '2024-12-20',
      lastUpdated: '2024-12-20'
    },
    {
      id: 2,
      type: 'Comment',
      title: 'Comment on "Guitar Basics"',
      reportedBy: 'user456@email.com',
      reportedUser: 'guitar_master',
      reason: 'Harassment',
      description: 'User made inappropriate comments about other students',
      status: 'Under Review',
      severity: 'Medium',
      reportDate: '2024-12-19',
      lastUpdated: '2024-12-20'
    },
    {
      id: 3,
      type: 'Profile',
      title: 'User Profile: musiclover99',
      reportedBy: 'mentor@email.com',
      reportedUser: 'musiclover99',
      reason: 'Fake Profile',
      description: 'Profile appears to be using stolen images and credentials',
      status: 'Approved',
      severity: 'High',
      reportDate: '2024-12-18',
      lastUpdated: '2024-12-19'
    }
  ];

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reportedUser.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || report.status.toLowerCase().replace(' ', '') === statusFilter;
    const matchesType = typeFilter === "all" || report.type.toLowerCase() === typeFilter;
    const matchesSeverity = severityFilter === "all" || report.severity.toLowerCase() === severityFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesSeverity;
  });

  const handleReportAction = (action: string, reportId: number) => {
    toast({
      title: `Report ${action}`,
      description: `Report has been ${action.toLowerCase()} successfully.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'secondary';
      case 'Under Review': return 'default';
      case 'Approved': return 'destructive';
      case 'Rejected': return 'outline';
      default: return 'secondary';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'destructive';
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Course': return <FileText className="h-4 w-4" />;
      case 'Comment': return <MessageCircle className="h-4 w-4" />;
      case 'Message': return <MessageCircle className="h-4 w-4" />;
      case 'Profile': return <User className="h-4 w-4" />;
      case 'Live Session': return <Video className="h-4 w-4" />;
      default: return <Flag className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Content Moderation</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="destructive">
            <AlertTriangle className="mr-1 h-3 w-3" />
            {reports.filter(r => r.status === 'Pending').length} Pending
          </Badge>
          <Badge variant="default">
            <Eye className="mr-1 h-3 w-3" />
            {reports.filter(r => r.status === 'Under Review').length} Under Review
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold">{reports.length}</p>
              </div>
              <Flag className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {reports.filter(r => r.status === 'Pending').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Under Review</p>
                <p className="text-2xl font-bold text-blue-600">
                  {reports.filter(r => r.status === 'Under Review').length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-red-600">
                  {reports.filter(r => r.severity === 'High' || r.severity === 'Critical').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
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
                  placeholder="Search reports..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="underreview">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="course">Course</SelectItem>
                <SelectItem value="comment">Comment</SelectItem>
                <SelectItem value="message">Message</SelectItem>
                <SelectItem value="profile">Profile</SelectItem>
                <SelectItem value="live session">Live Session</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Content</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Reported User</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{report.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Reported by: {report.reportedBy}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(report.type)}
                      <span>{report.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>{report.reportedUser}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{report.reason}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {report.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getSeverityColor(report.severity)}>
                      {report.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{report.reportDate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleReportAction('Approved', report.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleReportAction('Rejected', report.id)}
                      >
                        <X className="h-4 w-4" />
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