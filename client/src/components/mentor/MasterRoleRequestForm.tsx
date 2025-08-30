import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser } from "@/lib/auth";
import { Crown, Users, BookOpen, Award } from "lucide-react";

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

const masterRoleRequestSchema = z.object({
  reason: z.string().min(50, "Please provide at least 50 characters explaining why you want to become a master"),
  experience: z.string().min(30, "Please describe your teaching/classroom management experience (minimum 30 characters)"),
  plannedClassrooms: z.string().min(30, "Please describe your planned classrooms (minimum 30 characters)"),
  additionalQualifications: z.string().optional(),
});

type MasterRoleRequestFormData = z.infer<typeof masterRoleRequestSchema>;

interface MasterRoleRequestFormProps {
  onSuccess?: () => void;
}

export default function MasterRoleRequestForm({ onSuccess }: MasterRoleRequestFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const currentUser = getCurrentUser();

  const form = useForm<MasterRoleRequestFormData>({
    resolver: zodResolver(masterRoleRequestSchema),
    defaultValues: {
      reason: "",
      experience: "",
      plannedClassrooms: "",
      additionalQualifications: "",
    },
  });

  const submitRequest = useMutation({
    mutationFn: async (data: MasterRoleRequestFormData) => {
      return apiRequest(`/api/master-role-requests`, {
        method: "POST",
        body: JSON.stringify({
          ...data,
          mentorId: parseInt(currentUser?.id || "0"),
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Master Role Request Submitted",
        description: "Your request has been submitted successfully. You'll be notified when it's reviewed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/master-role-requests"] });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit master role request",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: MasterRoleRequestFormData) => {
    submitRequest.mutate(data);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold">Request Master Role</CardTitle>
        <CardDescription className="text-lg">
          Apply to become a master and unlock classroom creation and management features
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-blue-800 dark:text-blue-300">Create Classrooms</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400">Build and manage your own virtual classrooms</p>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-800 dark:text-green-300">Advanced Tools</h3>
            <p className="text-sm text-green-600 dark:text-green-400">Access advanced teaching and management tools</p>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
            <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-purple-800 dark:text-purple-300">Enhanced Status</h3>
            <p className="text-sm text-purple-600 dark:text-purple-400">Gain recognition as a master educator</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Why do you want to become a master? *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain your motivation for becoming a master, your goals for classroom management, and how it aligns with your teaching philosophy..."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Teaching & Classroom Management Experience *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your experience in teaching, managing students, curriculum development, or any relevant educational background..."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="plannedClassrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Planned Classrooms & Teaching Approach *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the type of classrooms you plan to create, your teaching methodology, subject areas, and how you'll engage students..."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalQualifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Additional Qualifications (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List any additional certifications, awards, publications, or relevant qualifications that support your application..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={submitRequest.isPending}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                {submitRequest.isPending ? "Submitting..." : "Submit Master Request"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}