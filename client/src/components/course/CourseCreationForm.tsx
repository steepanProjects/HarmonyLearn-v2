import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { BookOpen, Plus, X, Upload, Save, Eye, Send } from "lucide-react";

const courseFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  level: z.string().min(1, "Please select a level"),
  price: z.string().min(1, "Please enter a price"),
  duration: z.string().min(1, "Please enter duration in minutes"),
  targetAudience: z.string().min(10, "Please describe the target audience"),
  syllabus: z.string().min(50, "Please provide a detailed syllabus"),
  prerequisites: z.string().optional(),
  learningObjectives: z.string().min(20, "Please list learning objectives"),
  difficulty: z.string().min(1, "Please select difficulty level"),
  estimatedWeeks: z.string().min(1, "Please enter estimated weeks"),
  maxStudents: z.string().min(1, "Please enter maximum students"),
  tags: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal(""))
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

interface CourseCreationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CourseCreationForm = ({ onSuccess, onCancel }: CourseCreationFormProps) => {
  const [prerequisites, setPrerequisites] = useState<string[]>([]);
  const [objectives, setObjectives] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newPrerequisite, setNewPrerequisite] = useState("");
  const [newObjective, setNewObjective] = useState("");
  const [newTag, setNewTag] = useState("");
  const [courseStatus, setCourseStatus] = useState<"draft" | "pending">("draft");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const currentUser = getCurrentUser();

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      level: "",
      price: "",
      duration: "",
      targetAudience: "",
      syllabus: "",
      prerequisites: "",
      learningObjectives: "",
      difficulty: "1",
      estimatedWeeks: "",
      maxStudents: "100",
      tags: "",
      imageUrl: ""
    }
  });

  const createCourseMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/courses', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      toast({
        title: "Course Created Successfully",
        description: courseStatus === "draft" ? 
          "Your course has been saved as a draft." :
          "Your course has been submitted for review.",
      });
      form.reset();
      setPrerequisites([]);
      setObjectives([]);
      setTags([]);
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (values: CourseFormValues) => {
    const courseData = {
      ...values,
      price: parseFloat(values.price),
      duration: parseInt(values.duration),
      difficulty: parseInt(values.difficulty),
      estimatedWeeks: parseInt(values.estimatedWeeks),
      maxStudents: parseInt(values.maxStudents),
      mentorId: currentUser?.id,
      prerequisites,
      learningObjectives: objectives,
      tags,
      status: courseStatus,
      isActive: true
    };

    createCourseMutation.mutate(courseData);
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim() && !prerequisites.includes(newPrerequisite.trim())) {
      setPrerequisites([...prerequisites, newPrerequisite.trim()]);
      setNewPrerequisite("");
    }
  };

  const removePrerequisite = (index: number) => {
    setPrerequisites(prerequisites.filter((_, i) => i !== index));
  };

  const addObjective = () => {
    if (newObjective.trim() && !objectives.includes(newObjective.trim())) {
      setObjectives([...objectives, newObjective.trim()]);
      setNewObjective("");
    }
  };

  const removeObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const categories = [
    "piano", "guitar", "violin", "drums", "vocals", "theory", "composition", "production"
  ];

  const levels = [
    "beginner", "intermediate", "advanced"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl">Create New Course</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Share your musical expertise with students around the world
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Advanced Jazz Piano Techniques" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide a compelling description of your course..."
                            className="min-h-24"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category.charAt(0).toUpperCase() + category.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {levels.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level.charAt(0).toUpperCase() + level.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Course Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Course Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="99.99" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (minutes)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="480" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="estimatedWeeks"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Weeks</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="8" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxStudents"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Students</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="100" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty (1-10)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString()}>
                                {i + 1} - {i < 3 ? "Easy" : i < 7 ? "Medium" : "Hard"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Course Content */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Course Content</h3>
                
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe who this course is for..."
                          className="min-h-20"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="syllabus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Syllabus</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide a detailed course syllabus with lessons and topics..."
                          className="min-h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Prerequisites */}
                <div className="space-y-2">
                  <FormLabel>Prerequisites</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a prerequisite..."
                      value={newPrerequisite}
                      onChange={(e) => setNewPrerequisite(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPrerequisite())}
                    />
                    <Button type="button" onClick={addPrerequisite} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {prerequisites.map((prereq, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {prereq}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removePrerequisite(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Learning Objectives */}
                <div className="space-y-2">
                  <FormLabel>Learning Objectives</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a learning objective..."
                      value={newObjective}
                      onChange={(e) => setNewObjective(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addObjective())}
                    />
                    <Button type="button" onClick={addObjective} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {objectives.map((objective, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {objective}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeObjective(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <FormLabel>Tags</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} className="flex items-center gap-1">
                        {tag}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeTag(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/course-image.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        Provide a URL to an image that represents your course
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCourseStatus("draft");
                    form.handleSubmit(onSubmit)();
                  }}
                  disabled={createCourseMutation.isPending}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
                
                <Button
                  type="button"
                  onClick={() => {
                    setCourseStatus("pending");
                    form.handleSubmit(onSubmit)();
                  }}
                  disabled={createCourseMutation.isPending}
                  className="flex-1"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit for Review
                </Button>

                {onCancel && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    disabled={createCourseMutation.isPending}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseCreationForm;