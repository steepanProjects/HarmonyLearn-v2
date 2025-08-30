import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, Users, BookOpen, DollarSign, Video, Calendar, 
  Download, Filter, RefreshCw, Eye, Clock, Star, Award
} from "lucide-react";

export const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [metric, setMetric] = useState("overview");

  // Sample data - in real app this would come from API
  const revenueData = [
    { month: 'Jan', revenue: 12500, students: 245, courses: 15 },
    { month: 'Feb', revenue: 15200, students: 298, courses: 18 },
    { month: 'Mar', revenue: 18900, students: 356, courses: 22 },
    { month: 'Apr', revenue: 22100, students: 412, courses: 25 },
    { month: 'May', revenue: 26800, students: 478, courses: 28 },
    { month: 'Jun', revenue: 31200, students: 534, courses: 32 },
  ];

  const userActivityData = [
    { day: 'Mon', active: 1240, new: 45, returning: 890 },
    { day: 'Tue', active: 1350, new: 52, returning: 920 },
    { day: 'Wed', active: 1180, new: 38, returning: 850 },
    { day: 'Thu', active: 1420, new: 68, returning: 980 },
    { day: 'Fri', active: 1580, new: 85, returning: 1100 },
    { day: 'Sat', active: 980, new: 32, returning: 720 },
    { day: 'Sun', active: 1120, new: 41, returning: 810 },
  ];

  const coursePopularityData = [
    { name: 'Piano Basics', students: 892, revenue: 26760, rating: 4.8 },
    { name: 'Guitar Mastery', students: 756, revenue: 37800, rating: 4.9 },
    { name: 'Vocal Training', students: 634, revenue: 31700, rating: 4.7 },
    { name: 'Drum Fundamentals', students: 523, revenue: 15690, rating: 4.6 },
    { name: 'Music Theory', students: 445, revenue: 22250, rating: 4.5 },
  ];

  const deviceData = [
    { name: 'Desktop', value: 45, color: '#8884d8' },
    { name: 'Mobile', value: 35, color: '#82ca9d' },
    { name: 'Tablet', value: 20, color: '#ffc658' },
  ];

  const topMetrics = [
    { 
      title: "Total Revenue", 
      value: "$89,450", 
      change: "+18.2%", 
      changeType: "increase", 
      icon: DollarSign,
      description: "This month"
    },
    { 
      title: "Active Students", 
      value: "52,847", 
      change: "+12.5%", 
      changeType: "increase", 
      icon: Users,
      description: "Total registered"
    },
    { 
      title: "Course Completions", 
      value: "3,247", 
      change: "+8.1%", 
      changeType: "increase", 
      icon: Award,
      description: "This month"
    },
    { 
      title: "Avg. Session Time", 
      value: "45m", 
      change: "-2.3%", 
      changeType: "decrease", 
      icon: Clock,
      description: "Per user"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {topMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={metric.changeType === 'increase' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {metric.change}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{metric.description}</span>
                  </div>
                </div>
                <metric.icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Activity */}
        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="new" fill="#82ca9d" name="New Users" />
                <Bar dataKey="returning" fill="#8884d8" name="Returning Users" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Device Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {coursePopularityData.map((course, index) => (
                <div key={course.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{course.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{course.students} students</span>
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{course.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${course.revenue.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Video className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">1,234</p>
              <p className="text-sm text-muted-foreground">Live Sessions</p>
              <Badge variant="default" className="mt-2">+23% this week</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">3,156</p>
              <p className="text-sm text-muted-foreground">Total Courses</p>
              <Badge variant="default" className="mt-2">+15% this month</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Award className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">1,240</p>
              <p className="text-sm text-muted-foreground">Active Mentors</p>
              <Badge variant="default" className="mt-2">+8% this month</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};