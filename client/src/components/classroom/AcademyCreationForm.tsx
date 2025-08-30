import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Music, 
  Plus, 
  X, 
  Palette, 
  Globe, 
  MapPin,
  Phone,
  Mail,
  Star,
  DollarSign,
  Calendar,
  Image,
  Settings
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertClassroomSchema } from "@shared/schema";

// Create a simplified schema for frontend form validation
const academyCreationSchema = z.object({
  academyName: z.string().min(3, "Academy name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  about: z.string().min(20, "About section must be at least 20 characters"),
  curriculum: z.string().min(20, "Curriculum must be at least 20 characters"),
  customSlug: z.string()
    .min(3, "URL slug must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "URL slug can only contain lowercase letters, numbers, and hyphens"),
  instruments: z.array(z.string()).min(1, "Select at least one instrument"),
  features: z.array(z.string()).min(1, "Add at least one feature"),
  maxStudents: z.number().min(1, "Must allow at least 1 student").max(1000, "Cannot exceed 1000 students"),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color"),
  contactEmail: z.string().email("Must be a valid email").optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  address: z.string().optional(),
  isPublic: z.boolean().default(true),
});

type AcademyCreationFormData = z.infer<typeof academyCreationSchema>;

const instrumentOptions = [
  "Piano", "Keyboard", "Acoustic Guitar", "Electric Guitar", "Bass Guitar",
  "Violin", "Viola", "Cello", "Double Bass", "Flute", "Clarinet", "Saxophone",
  "Trumpet", "Trombone", "French Horn", "Drums", "Percussion", "Voice",
  "Ukulele", "Mandolin", "Banjo", "Harmonica", "Accordion"
];

const defaultFeatures = [
  "Expert Instructors", "Flexible Scheduling", "Small Class Sizes", 
  "Performance Opportunities", "Practice Rooms", "Recording Studio",
  "Music Theory Classes", "Ensemble Playing", "Individual Lessons",
  "Group Classes", "Online Learning", "Student Recitals"
];

interface AcademyCreationFormProps {
  onSuccess?: () => void;
}

export function AcademyCreationForm({ onSuccess }: AcademyCreationFormProps) {
  const [user, setUser] = useState<any>(null);
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [customFeature, setCustomFeature] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const form = useForm<AcademyCreationFormData>({
    resolver: zodResolver(academyCreationSchema),
    defaultValues: {
      academyName: "",
      description: "",
      about: "",
      curriculum: "",
      customSlug: "",
      instruments: [],
      features: [],
      maxStudents: 50,
      primaryColor: "#3B82F6",
      contactEmail: "",
      contactPhone: "",
      website: "",
      address: "",
      isPublic: true,
    },
  });

  // No need for masterId in form since it's handled in submission

  // Update form instruments and features when selected arrays change
  useEffect(() => {
    form.setValue("instruments", selectedInstruments);
  }, [selectedInstruments, form]);

  useEffect(() => {
    form.setValue("features", selectedFeatures);
  }, [selectedFeatures, form]);

  const createAcademyMutation = useMutation({
    mutationFn: (data: AcademyCreationFormData) => 
      apiRequest("/api/classrooms", {
        method: "POST",
        body: JSON.stringify({
          // Required legacy fields for database compatibility
          title: data.academyName,
          subject: selectedInstruments.join(', ') || "Music",
          level: "All Levels",
          description: data.description,
          masterId: parseInt(user?.id?.toString() || "0"),
          maxStudents: data.maxStudents,
          isActive: true,
          // New academy fields (using camelCase for schema validation)
          academyName: data.academyName,
          about: data.about,
          curriculum: data.curriculum,
          customSlug: data.customSlug,
          instruments: selectedInstruments,
          features: selectedFeatures,
          primaryColor: data.primaryColor,
          contactEmail: data.contactEmail || null,
          contactPhone: data.contactPhone || null,
          website: data.website || null,
          address: data.address || null,
          isPublic: data.isPublic,
        }),
      }),
    onSuccess: () => {
      toast({
        title: "Academy Created!",
        description: "Your music academy has been successfully created and is now live.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/classrooms"] });
      form.reset();
      setSelectedInstruments([]);
      setSelectedFeatures([]);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create academy",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: AcademyCreationFormData) => {
    createAcademyMutation.mutate(data);
  };

  const addInstrument = (instrument: string) => {
    if (!selectedInstruments.includes(instrument)) {
      setSelectedInstruments([...selectedInstruments, instrument]);
    }
  };

  const removeInstrument = (instrument: string) => {
    setSelectedInstruments(selectedInstruments.filter(i => i !== instrument));
  };

  const addFeature = (feature: string) => {
    if (!selectedFeatures.includes(feature) && feature.trim()) {
      setSelectedFeatures([...selectedFeatures, feature.trim()]);
    }
  };

  const removeFeature = (feature: string) => {
    setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Create Your Music Academy</h2>
        <p className="text-muted-foreground">
          Set up your personalized music academy with custom branding and curriculum
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Tell us about your music academy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="academyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Academy Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Harmony Music Academy"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            form.setValue("customSlug", generateSlug(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customSlug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Slug</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <span className="text-sm text-muted-foreground mr-1">harmonylearn.com/academy/</span>
                          <Input placeholder="harmony-music-academy" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Brief description for academy listings"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About Your Academy</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detailed description of your academy, teaching philosophy, and what makes you unique..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="curriculum"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Curriculum & Teaching Approach</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your curriculum, teaching methods, and learning progression..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Instruments */}
          <Card>
            <CardHeader>
              <CardTitle>Instruments Taught</CardTitle>
              <CardDescription>
                Select the instruments you teach at your academy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select onValueChange={addInstrument}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add an instrument" />
                  </SelectTrigger>
                  <SelectContent>
                    {instrumentOptions
                      .filter(instrument => !selectedInstruments.includes(instrument))
                      .map((instrument) => (
                      <SelectItem key={instrument} value={instrument}>
                        {instrument}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex flex-wrap gap-2">
                  {selectedInstruments.map((instrument) => (
                    <Badge key={instrument} variant="outline" className="text-sm py-2 px-3">
                      {instrument}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-auto p-0"
                        onClick={() => removeInstrument(instrument)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Academy Features</CardTitle>
              <CardDescription>
                Highlight what makes your academy special
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {defaultFeatures
                    .filter(feature => !selectedFeatures.includes(feature))
                    .map((feature) => (
                    <Button
                      key={feature}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addFeature(feature)}
                      className="justify-start"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {feature}
                    </Button>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom feature..."
                    value={customFeature}
                    onChange={(e) => setCustomFeature(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addFeature(customFeature);
                        setCustomFeature("");
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      addFeature(customFeature);
                      setCustomFeature("");
                    }}
                  >
                    Add
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {selectedFeatures.map((feature) => (
                    <Badge key={feature} className="text-sm py-2 px-3">
                      {feature}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-auto p-0 text-primary-foreground"
                        onClick={() => removeFeature(feature)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Academy Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="maxStudents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Students</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Primary Color
                      </FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input type="color" {...field} className="w-16" />
                          <Input {...field} placeholder="#3B82F6" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div>
                      <FormLabel>Public Academy</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Allow your academy to be discovered and listed publicly
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                How students and mentors can reach you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Contact Email
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="academy@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Website
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.yourwebsite.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="123 Music St, City, State 12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Submit */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-end gap-4">
                <Button 
                  type="submit" 
                  size="lg"
                  disabled={createAcademyMutation.isPending || selectedInstruments.length === 0 || selectedFeatures.length === 0}
                  className="min-w-32"
                >
                  {createAcademyMutation.isPending ? "Creating..." : "Create Academy"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}