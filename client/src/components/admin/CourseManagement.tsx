import { useState } from "react";
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
  BookOpen, Search, Plus, Edit, Trash2, Eye, Play, Users, 
  Star, DollarSign, Calendar, Clock, Award, TrendingUp
} from "lucide-react";

interface Course {
  id: number;
  title: string;
  instructor: string;
  category: string;
  price: number;
  duration: string;
  students: number;
  rating: number;
  status: 'Published' | 'Draft' | 'Review' | 'Archived';
  createdDate: string;
  lastUpdated: string;
  revenue: number;
  completion: number;
  thumbnail: string;
}

export const CourseManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const courses: Course[] = [
    {
      id: 1,
      title: "Advanced Jazz Piano Techniques",
      instructor: "Marcus Johnson",
      category: "Piano",
      price: 199.99,
      duration: "12 hours",
      students: 892,
      rating: 4.9,
      status: "Published",
      createdDate: "2024-01-15",
      lastUpdated: "2024-12-10",
      revenue: 178668,
      completion: 87,
      thumbnail: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Guitar Fundamentals for Beginners",
      instructor: "Sarah Chen",
      category: "Guitar",
      price: 89.99,
      duration: "8 hours",
      students: 1245,
      rating: 4.8,
      status: "Published",
      createdDate: "2023-11-20",
      lastUpdated: "2024-12-05",
      revenue: 112043,
      completion: 92,
      thumbnail: "/placeholder.svg"
    },
    {
      id: 3,
      title: "Classical Violin Masterclass",
      instructor: "Elena Volkov",
      category: "Violin",
      price: 299.99,
      duration: "16 hours",
      students: 234,
      rating: 4.7,
      status: "Review",
      createdDate: "2024-12-01",
      lastUpdated: "2024-12-18",
      revenue: 70197,
      completion: 45,
      thumbnail: "/placeholder.svg"
    },
    {
      id: 4,
      title: "Modern Drum Techniques",
      instructor: "Alex Rodriguez",
      category: "Drums",
      price: 149.99,
      duration: "10 hours",
      students: 567,
      rating: 4.6,
      status: "Draft",
      createdDate: "2024-10-12",
      lastUpdated: "2024-12-15",
      revenue: 85043,
      completion: 78,
      thumbnail: "/placeholder.svg"
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || course.status.toLowerCase() === statusFilter;
    const matchesCategory = categoryFilter === "all" || course.category.toLowerCase() === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleCourseAction = (action: string, courseId: number) => {
    toast({
      title: `Course ${action}`,
      description: `Course has been ${action.toLowerCase()} successfully.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'default';
      case 'Draft': return 'secondary';
      case 'Review': return 'outline';
      case 'Archived': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Course Management</h2>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <TrendingUp className="mr-2 h-4 w-4" />
            Course Analytics
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="courseTitle">Course Title</Label>
                  <Input id="courseTitle" placeholder="Enter course title" />
                </div>
                <div>
                  <Label htmlFor="instructor">Instructor</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select instructor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marcus">Marcus Johnson</SelectItem>
                      <SelectItem value="sarah">Sarah Chen</SelectItem>
                      <SelectItem value="elena">Elena Volkov</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="piano">Piano</SelectItem>
                      <SelectItem value="guitar">Guitar</SelectItem>
                      <SelectItem value="violin">Violin</SelectItem>
                      <SelectItem value="drums">Drums</SelectItem>
                      <SelectItem value="vocals">Vocals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" type="number" placeholder="0.00" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Course Description</Label>
                  <Textarea id="description" placeholder="Enter course description" />
                </div>
                <div className="col-span-2 flex justify-end space-x-2">
                  <Button variant="outline">Save as Draft</Button>
                  <Button>Create Course</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Courses</p>
                <p className="text-2xl font-bold">{courses.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold text-green-600">
                  {courses.filter(c => c.status === 'Published').length}
                </p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${courses.reduce((sum, course) => sum + course.revenue, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {(courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
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
                  placeholder="Search courses..."
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
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="piano">Piano</SelectItem>
                <SelectItem value="guitar">Guitar</SelectItem>
                <SelectItem value="violin">Violin</SelectItem>
                <SelectItem value="drums">Drums</SelectItem>
                <SelectItem value="vocals">Vocals</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-8 bg-primary/10 rounded flex items-center justify-center">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{course.title}</p>
                        <p className="text-sm text-muted-foreground">{course.duration}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{course.category}</Badge>
                  </TableCell>
                  <TableCell>${course.price}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{course.students}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-green-600 font-medium">
                    ${course.revenue.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(course.status)}>
                      {course.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="ghost" onClick={() => setSelectedCourse(course)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Course Details</DialogTitle>
                          </DialogHeader>
                          {selectedCourse && (
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                                  <p className="text-sm">{selectedCourse.title}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Instructor</Label>
                                  <p className="text-sm">{selectedCourse.instructor}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                                  <Badge variant="outline">{selectedCourse.category}</Badge>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Duration</Label>
                                  <p className="text-sm">{selectedCourse.duration}</p>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Price</Label>
                                  <p className="text-sm">${selectedCourse.price}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Students Enrolled</Label>
                                  <p className="text-sm">{selectedCourse.students}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Rating</Label>
                                  <div className="flex items-center space-x-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm">{selectedCourse.rating}</span>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Total Revenue</Label>
                                  <p className="text-sm text-green-600 font-medium">${selectedCourse.revenue.toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleCourseAction('Preview', course.id)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleCourseAction('Deleted', course.id)}
                      >
                        <Trash2 className="h-4 w-4" />
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