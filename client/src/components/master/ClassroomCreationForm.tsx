import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser } from "@/lib/auth";
import { Users, BookOpen, Globe } from "lucide-react";

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

const classroomSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title too long"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description too long"),
  subject: z.string().min(1, "Subject is required"),
  level: z.string().min(1, "Level is required"),
  maxStudents: z.number().min(1, "Must allow at least 1 student").max(500, "Too many students"),
});

type ClassroomFormData = z.infer<typeof classroomSchema>;

interface ClassroomCreationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const subjects = [
  "Piano",
  "Guitar", 
  "Violin",
  "Vocals",
  "Drums",
  "Bass",
  "Music Theory",
  "Composition",
  "Music Production",
  "General Music"
];

const levels = [
  "Beginner",
  "Intermediate", 
  "Advanced",
  "All Levels"
];

export default function ClassroomCreationForm({ onSuccess, onCancel }: ClassroomCreationFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const currentUser = getCurrentUser();

  const form = useForm<ClassroomFormData>({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      title: "",
      description: "",
      subject: "",
      level: "",
      maxStudents: 30,
    },
  });

  const createClassroom = useMutation({
    mutationFn: async (data: ClassroomFormData) => {
      return apiRequest('/api/classrooms', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          masterId: parseInt(currentUser?.id || '0'),
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Classroom Created",
        description: "Your classroom has been created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/classrooms'] });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create classroom",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ClassroomFormData) => {
    createClassroom.mutate(data);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Users className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold">Create New Classroom</CardTitle>
        <CardDescription className="text-lg">
          Set up a new classroom to teach and manage your students
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Feature highlights */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <h4 className="font-medium text-blue-800 dark:text-blue-300 text-sm">Course Management</h4>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <Users className="w-6 h-6 text-green-600 mx-auto mb-1" />
            <h4 className="font-medium text-green-800 dark:text-green-300 text-sm">Student Tracking</h4>
          </div>
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
            <Globe className="w-6 h-6 text-purple-600 mx-auto mb-1" />
            <h4 className="font-medium text-purple-800 dark:text-purple-300 text-sm">Live Sessions</h4>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Classroom Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Advanced Piano Techniques, Guitar Fundamentals..."
                      {...field}
                    />
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
                  <FormLabel className="text-base font-semibold">Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what students will learn in this classroom, teaching methods, expectations..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Subject *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
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
                    <FormLabel className="text-base font-semibold">Level *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {levels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="maxStudents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Maximum Students</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={500}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 pt-4">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={createClassroom.isPending}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {createClassroom.isPending ? "Creating..." : "Create Classroom"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}