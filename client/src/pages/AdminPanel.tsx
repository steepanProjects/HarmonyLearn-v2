import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, BookOpen, Video, Settings, BarChart3, Shield, 
  Edit, Trash2, Plus, Eye, AlertCircle, TrendingUp,
  Calendar, MessageCircle, Award, Star, Database,
  FileText, CreditCard, Globe, Mail, Lock, Server, GraduationCap, Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserManagement } from "@/components/admin/UserManagement";
import { ContentModeration } from "@/components/admin/ContentModeration";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { CourseManagement } from "@/components/admin/CourseManagement";
import { PaymentManagement } from "@/components/admin/PaymentManagement";
import { LiveSessionsManagement } from "@/components/admin/LiveSessionsManagement";
import { MentorApplicationManagement } from "@/components/admin/MentorApplicationManagement";
import MasterRoleRequestManager from "@/components/admin/MasterRoleRequestManager";

export const AdminPanel = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  const handleQuickAction = (action: string) => {
    const actionMap: { [key: string]: string } = {
      'users': 'users',
      'courses': 'courses',
      'livesessions': 'livesessions',
      'payments': 'payments',
      'community': 'moderation',
      'database': 'system'
    };
    
    const tabValue = actionMap[action] || action;
    setActiveTab(tabValue);
    
    toast({
      title: "Navigation",
      description: `Switched to ${action.charAt(0).toUpperCase() + action.slice(1)} management.`,
    });
  };

  const handleHeaderAction = (action: string) => {
    if (action === 'settings') {
      setActiveTab('settings');
    } else if (action === 'reports') {
      setActiveTab('analytics');
    }
    
    toast({
      title: action === 'settings' ? "Quick Settings" : "Reports",
      description: `Opened ${action === 'settings' ? 'system settings' : 'analytics dashboard'}.`,
    });
  };
  const dashboardStats = [
    { label: "Total Students", value: "52,847", change: "+12%", icon: Users, color: "text-blue-500" },
    { label: "Active Mentors", value: "1,240", change: "+8%", icon: Award, color: "text-green-500" },
    { label: "Total Courses", value: "3,156", change: "+15%", icon: BookOpen, color: "text-purple-500" },
    { label: "Live Sessions", value: "89", change: "+23%", icon: Video, color: "text-red-500" },
    { label: "Monthly Revenue", value: "$89,450", change: "+18%", icon: TrendingUp, color: "text-yellow-500" },
    { label: "Community Posts", value: "12,456", change: "+6%", icon: MessageCircle, color: "text-indigo-500" }
  ];

  const recentUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Student", joinDate: "2024-12-20", status: "Active" },
    { id: 2, name: "Sarah Johnson", email: "sarah@example.com", role: "Mentor", joinDate: "2024-12-19", status: "Pending" },
    { id: 3, name: "Mike Chen", email: "mike@example.com", role: "Student", joinDate: "2024-12-18", status: "Active" },
    { id: 4, name: "Elena Rodriguez", email: "elena@example.com", role: "Mentor", joinDate: "2024-12-17", status: "Active" }
  ];

  const recentCourses = [
    { id: 1, title: "Advanced Jazz Piano", instructor: "Marcus Johnson", students: 145, rating: 4.9, status: "Published" },
    { id: 2, title: "Guitar for Beginners", instructor: "Sarah Chen", students: 892, rating: 4.8, status: "Published" },
    { id: 3, title: "Violin Masterclass", instructor: "Elena Volkov", students: 67, rating: 4.7, status: "Draft" },
    { id: 4, title: "Drum Fundamentals", instructor: "Alex Rodriguez", students: 234, rating: 4.6, status: "Review" }
  ];

  const systemAlerts = [
    { id: 1, type: "warning", message: "High server load detected", time: "2 hours ago" },
    { id: 2, type: "info", message: "Scheduled maintenance tomorrow", time: "5 hours ago" },
    { id: 3, type: "success", message: "Payment system updated successfully", time: "1 day ago" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Shield className="mr-3 h-8 w-8 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Complete platform management and control center
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => handleHeaderAction('settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Quick Settings
            </Button>
            <Button variant="hero" onClick={() => handleHeaderAction('reports')}>
              <TrendingUp className="mr-2 h-4 w-4" />
              View Reports
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-11">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="mentor-applications" className="flex items-center space-x-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Mentors</span>
            </TabsTrigger>
            <TabsTrigger value="master-requests" className="flex items-center space-x-2">
              <Crown className="h-4 w-4" />
              <span className="hidden sm:inline">Masters</span>
            </TabsTrigger>
            <TabsTrigger value="moderation" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Moderation</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Courses</span>
            </TabsTrigger>
            <TabsTrigger value="livesessions" className="flex items-center space-x-2">
              <Video className="h-4 w-4" />
              <span className="hidden sm:inline">Live</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center space-x-2">
              <Server className="h-4 w-4" />
              <span className="hidden sm:inline">System</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardStats.map((stat) => (
                <Card key={stat.label} className="p-6 hover:shadow-musical transition-shadow duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-green-600">{stat.change} from last month</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </Card>
              ))}
            </div>

            {/* System Alerts */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-yellow-500" />
                System Alerts
              </h3>
              <div className="space-y-3">
                {systemAlerts.map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                    alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                    alert.type === 'info' ? 'bg-blue-50 border-blue-400' :
                    'bg-green-50 border-green-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Users */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Recent Users</h3>
                  <Button size="sm" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'Mentor' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>

              {/* Recent Courses */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Course Management</h3>
                  <Button size="sm" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Course
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {recentCourses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{course.title}</h4>
                        <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                          <span>{course.students} students</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{course.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          course.status === 'Published' ? 'default' :
                          course.status === 'Draft' ? 'secondary' : 'outline'
                        }>
                          {course.status}
                        </Badge>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Admin Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => handleQuickAction('users')}
              >
                <Users className="h-6 w-6" />
                <span className="text-sm">Manage Users</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => handleQuickAction('courses')}
              >
                <BookOpen className="h-6 w-6" />
                <span className="text-sm">Course Library</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => handleQuickAction('livesessions')}
              >
                <Video className="h-6 w-6" />
                <span className="text-sm">Live Sessions</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => handleQuickAction('community')}
              >
                <MessageCircle className="h-6 w-6" />
                <span className="text-sm">Community</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => handleQuickAction('payments')}
              >
                <CreditCard className="h-6 w-6" />
                <span className="text-sm">Payments</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => handleQuickAction('database')}
              >
                <Database className="h-6 w-6" />
                <span className="text-sm">Database</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="mentor-applications">
            <MentorApplicationManagement />
          </TabsContent>

          <TabsContent value="master-requests">
            <MasterRoleRequestManager />
          </TabsContent>

          <TabsContent value="courses">
            <CourseManagement />
          </TabsContent>

          <TabsContent value="livesessions">
            <LiveSessionsManagement />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentManagement />
          </TabsContent>

          <TabsContent value="moderation">
            <ContentModeration />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="settings">
            <SystemSettings />
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Database className="h-8 w-8 text-blue-500" />
                  <div>
                    <h3 className="font-semibold">Database Management</h3>
                    <p className="text-sm text-muted-foreground">Backup, restore, and optimize</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Create Backup
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    View Logs
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Server className="h-8 w-8 text-green-500" />
                  <div>
                    <h3 className="font-semibold">Server Status</h3>
                    <p className="text-sm text-muted-foreground">Monitor performance</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">CPU Usage</span>
                    <Badge variant="default">45%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Memory</span>
                    <Badge variant="secondary">62%</Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Lock className="h-8 w-8 text-red-500" />
                  <div>
                    <h3 className="font-semibold">Security Center</h3>
                    <p className="text-sm text-muted-foreground">Security monitoring</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Security Scan
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Access Logs
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};