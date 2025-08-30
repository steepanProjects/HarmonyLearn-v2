import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogOut, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";

const resignationFormSchema = z.object({
  mentorId: z.number(),
  classroomId: z.number(),
  reason: z.string().min(10, "Please provide a detailed reason (at least 10 characters)"),
});

type ResignationFormData = z.infer<typeof resignationFormSchema>;

interface ResignationRequestFormProps {
  mentorId: number;
  classroomId: number;
  classroomTitle: string;
}

export default function ResignationRequestForm({ mentorId, classroomId, classroomTitle }: ResignationRequestFormProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ResignationFormData>({
    resolver: zodResolver(resignationFormSchema),
    defaultValues: {
      mentorId,
      classroomId,
      reason: "",
    },
  });

  const resignationMutation = useMutation({
    mutationFn: (data: ResignationFormData) =>
      apiRequest("/api/resignation-requests", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({
        title: "Resignation Request Submitted",
        description: "Your resignation request has been sent to the master teacher for review.",
      });
      setOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/mentors", mentorId, "resignation-requests"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit resignation request",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ResignationFormData) => {
    resignationMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50">
          <LogOut className="h-4 w-4 mr-2" />
          Request Resignation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Request Resignation from {classroomTitle}
          </DialogTitle>
          <DialogDescription>
            This will send a resignation request to the master teacher. Once approved, you'll be removed from the classroom staff and can join another academy.
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> After resignation is approved, you'll lose access to all classroom materials and student interactions. This action cannot be undone.
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Resignation</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Please explain why you wish to resign from this classroom. This will help the master teacher understand your decision."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={resignationMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={resignationMutation.isPending}
              >
                {resignationMutation.isPending ? "Submitting..." : "Submit Resignation Request"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}