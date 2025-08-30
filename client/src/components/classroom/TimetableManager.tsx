import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Calendar, Clock, Plus, User, AlertTriangle, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useToast } from "@/hooks/use-toast";

const scheduleFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  instructorId: z.number().min(1, "Instructor is required"),
  maxStudents: z.number().min(1).max(50).default(20),
  description: z.string().optional()
});

type ScheduleFormData = z.infer<typeof scheduleFormSchema>;

interface Schedule {
  id: number;
  classroomId: number;
  title: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  instructorId: number;
  maxStudents: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

interface Instructor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface TimetableManagerProps {
  classroomId: number;
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

export default function TimetableManager({ classroomId }: TimetableManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availabilityChecks, setAvailabilityChecks] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      title: "",
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "10:00",
      maxStudents: 20,
      description: ""
    }
  });

  // Fetch classroom schedules
  const { data: schedules = [], isLoading: schedulesLoading } = useQuery({
    queryKey: ['/api/schedules', classroomId],
    queryFn: async () => {
      const response = await fetch(`/api/schedules?classroomId=${classroomId}`);
      if (!response.ok) throw new Error('Failed to fetch schedules');
      return response.json();
    }
  });

  // Fetch available instructors (staff members)
  const { data: instructors = [], isLoading: instructorsLoading } = useQuery({
    queryKey: ['/api/classrooms', classroomId, 'members'],
    queryFn: async () => {
      const response = await fetch(`/api/classrooms/${classroomId}/members`);
      if (!response.ok) throw new Error('Failed to fetch classroom members');
      const members = await response.json();
      return members.filter((member: any) => member.role === 'staff' || member.role === 'master');
    }
  });

  // Create schedule mutation
  const createScheduleMutation = useMutation({
    mutationFn: async (data: ScheduleFormData) => {
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, classroomId })
      });
      if (!response.ok) throw new Error('Failed to create schedule');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedules', classroomId] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Schedule Created",
        description: "New class session has been added to the timetable."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating Schedule",
        description: error.message || "Failed to create schedule",
        variant: "destructive"
      });
    }
  });

  // Check instructor availability
  const checkAvailabilityMutation = useMutation({
    mutationFn: async ({ instructorId, dayOfWeek, startTime, endTime }: any) => {
      const response = await fetch('/api/schedules/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructorId, dayOfWeek, startTime, endTime })
      });
      if (!response.ok) throw new Error('Failed to check availability');
      return response.json();
    },
    onSuccess: (data, variables) => {
      const key = `${variables.instructorId}-${variables.dayOfWeek}-${variables.startTime}-${variables.endTime}`;
      setAvailabilityChecks(prev => ({ ...prev, [key]: data.available }));
    }
  });

  // Watch form values to check availability
  const watchedValues = form.watch(['instructorId', 'dayOfWeek', 'startTime', 'endTime']);
  
  useEffect(() => {
    const [instructorId, dayOfWeek, startTime, endTime] = watchedValues;
    
    if (instructorId && dayOfWeek !== undefined && startTime && endTime) {
      checkAvailabilityMutation.mutate({ instructorId, dayOfWeek, startTime, endTime });
    }
  }, [watchedValues]);

  const onSubmit = (data: ScheduleFormData) => {
    const availabilityKey = `${data.instructorId}-${data.dayOfWeek}-${data.startTime}-${data.endTime}`;
    
    if (availabilityChecks[availabilityKey] === false) {
      toast({
        title: "Scheduling Conflict",
        description: "The selected instructor is not available at this time.",
        variant: "destructive"
      });
      return;
    }

    createScheduleMutation.mutate(data);
  };

  const handleQuickCreate = (dayOfWeek: number, timeSlot: string) => {
    setSelectedDay(dayOfWeek);
    setSelectedTime(timeSlot);
    form.setValue('dayOfWeek', dayOfWeek);
    form.setValue('startTime', timeSlot);
    const endHour = parseInt(timeSlot.split(':')[0]) + 1;
    form.setValue('endTime', `${endHour.toString().padStart(2, '0')}:00`);
    setIsDialogOpen(true);
  };

  // Create weekly grid
  const renderWeeklyGrid = () => {
    const grid = [];
    
    // Header with day names
    grid.push(
      <div key="header" className="grid grid-cols-8 gap-2 mb-4">
        <div className="text-sm font-medium text-muted-foreground p-2">Time</div>
        {dayNames.slice(1, 6).map(day => (
          <div key={day} className="text-sm font-medium text-center p-2 bg-muted rounded">
            {day}
          </div>
        ))}
        <div className="text-sm font-medium text-center p-2 bg-muted rounded">Weekend</div>
      </div>
    );

    // Time slots (9 AM to 6 PM for main grid)
    const workingHours = timeSlots.slice(9, 18);
    
    workingHours.forEach(timeSlot => {
      const row = [
        <div key={`time-${timeSlot}`} className="text-sm text-muted-foreground p-2 font-medium">
          {timeSlot}
        </div>
      ];

      // Weekdays (Monday-Friday)
      for (let day = 1; day <= 5; day++) {
        const daySchedules = schedules.filter(
          (schedule: Schedule) => schedule.dayOfWeek === day && schedule.startTime === timeSlot
        );

        if (daySchedules.length > 0) {
          row.push(
            <div key={`${day}-${timeSlot}`} className="p-1">
              {daySchedules.map((schedule: Schedule) => {
                const instructor = instructors.find((inst: Instructor) => inst.id === schedule.instructorId);
                return (
                  <div
                    key={schedule.id}
                    className="bg-primary/10 border border-primary/20 rounded p-2 text-xs hover:bg-primary/20 cursor-pointer transition-colors"
                  >
                    <div className="font-medium truncate">{schedule.title}</div>
                    <div className="text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {instructor ? `${instructor.firstName} ${instructor.lastName}` : 'Unassigned'}
                    </div>
                    <div className="text-muted-foreground">
                      {schedule.startTime} - {schedule.endTime}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        } else {
          row.push(
            <div
              key={`${day}-${timeSlot}`}
              className="p-1 min-h-16 border border-dashed border-muted-foreground/20 rounded hover:border-primary/40 cursor-pointer transition-colors group"
              onClick={() => handleQuickCreate(day, timeSlot)}
            >
              <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          );
        }
      }

      // Weekend column (Saturday + Sunday combined)
      const weekendSchedules = [
        ...schedules.filter((schedule: Schedule) => schedule.dayOfWeek === 6 && schedule.startTime === timeSlot),
        ...schedules.filter((schedule: Schedule) => schedule.dayOfWeek === 0 && schedule.startTime === timeSlot)
      ];

      if (weekendSchedules.length > 0) {
        row.push(
          <div key={`weekend-${timeSlot}`} className="p-1">
            {weekendSchedules.map((schedule: Schedule) => {
              const instructor = instructors.find((inst: Instructor) => inst.id === schedule.instructorId);
              const dayName = schedule.dayOfWeek === 0 ? 'Sun' : 'Sat';
              return (
                <div
                  key={schedule.id}
                  className="bg-accent/10 border border-accent/20 rounded p-2 text-xs hover:bg-accent/20 cursor-pointer transition-colors mb-1"
                >
                  <div className="font-medium truncate">{schedule.title} ({dayName})</div>
                  <div className="text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {instructor ? `${instructor.firstName} ${instructor.lastName}` : 'Unassigned'}
                  </div>
                </div>
              );
            })}
          </div>
        );
      } else {
        row.push(
          <div key={`weekend-${timeSlot}`} className="p-1 min-h-16 border border-dashed border-muted-foreground/20 rounded">
          </div>
        );
      }

      grid.push(
        <div key={`row-${timeSlot}`} className="grid grid-cols-8 gap-2 mb-2">
          {row}
        </div>
      );
    });

    return grid;
  };

  const currentAvailabilityKey = `${form.watch('instructorId')}-${form.watch('dayOfWeek')}-${form.watch('startTime')}-${form.watch('endTime')}`;
  const isCurrentTimeAvailable = availabilityChecks[currentAvailabilityKey];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Weekly Timetable</h3>
          <p className="text-sm text-muted-foreground">
            Manage class schedules and assign instructors
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Class Session
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Class Session</DialogTitle>
              <DialogDescription>
                Schedule a new class and assign an instructor
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Piano Basics, Guitar Intermediate" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dayOfWeek"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Day</FormLabel>
                        <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {dayNames.map((day, index) => (
                              <SelectItem key={day} value={index.toString()}>
                                {day}
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
                    name="maxStudents"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Students</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="50" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Start time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeSlots.map(time => (
                              <SelectItem key={time} value={time}>
                                {time}
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
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="End time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeSlots.map(time => (
                              <SelectItem key={time} value={time}>
                                {time}
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
                  name="instructorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instructor</FormLabel>
                      <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select instructor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {instructors.map((instructor: Instructor) => (
                            <SelectItem key={instructor.id} value={instructor.id.toString()}>
                              {instructor.firstName} {instructor.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Availability indicator */}
                {form.watch('instructorId') && form.watch('startTime') && form.watch('endTime') && (
                  <div className="flex items-center gap-2 p-3 rounded-lg border">
                    {checkAvailabilityMutation.isPending ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                        Checking availability...
                      </div>
                    ) : isCurrentTimeAvailable === true ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <Check className="h-4 w-4" />
                        Instructor is available
                      </div>
                    ) : isCurrentTimeAvailable === false ? (
                      <div className="flex items-center gap-2 text-red-600">
                        <X className="h-4 w-4" />
                        Scheduling conflict detected
                      </div>
                    ) : null}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Additional details about this class..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    disabled={createScheduleMutation.isPending || isCurrentTimeAvailable === false}
                    className="flex-1"
                  >
                    {createScheduleMutation.isPending ? "Creating..." : "Create Session"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Timetable Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <Calendar className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-muted-foreground">Total Sessions</p>
              <p className="text-2xl font-bold">{schedules.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <Clock className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-2xl font-bold">
                {schedules.filter((s: Schedule) => s.dayOfWeek >= 1 && s.dayOfWeek <= 5).length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <User className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-muted-foreground">Instructors</p>
              <p className="text-2xl font-bold">{instructors.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <AlertTriangle className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm text-muted-foreground">Weekend Classes</p>
              <p className="text-2xl font-bold">
                {schedules.filter((s: Schedule) => s.dayOfWeek === 0 || s.dayOfWeek === 6).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Timetable Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Schedule
          </CardTitle>
          <CardDescription>
            Click on empty time slots to quickly add new sessions. Hover over existing sessions for details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {schedulesLoading || instructorsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading timetable...</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {renderWeeklyGrid()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common scheduling operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Copy Last Week
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Set Recurring Sessions
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Manage Instructor Availability
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}