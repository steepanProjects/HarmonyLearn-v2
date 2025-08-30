import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Save, 
  Upload, 
  Image as ImageIcon, 
  Palette, 
  Type, 
  Star,
  Plus,
  X,
  Eye,
  Settings,
  Globe,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  DollarSign
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type Classroom } from "@shared/schema";

interface AcademyEditorProps {
  classroom: Classroom;
  isOpen: boolean;
  onClose: () => void;
}

const academyEditorSchema = z.object({
  academyName: z.string().min(1, "Academy name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  about: z.string().optional(),
  curriculum: z.string().optional(),
  heroImage: z.string().url().optional().or(z.literal("")),
  logoImage: z.string().url().optional().or(z.literal("")),
  aboutImage: z.string().url().optional().or(z.literal("")),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  features: z.array(z.string()).optional(),
  instruments: z.array(z.string()).optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  address: z.string().optional(),
  socialLinks: z.object({
    instagram: z.string().url().optional().or(z.literal("")),
    facebook: z.string().url().optional().or(z.literal("")),
    twitter: z.string().url().optional().or(z.literal("")),
    youtube: z.string().url().optional().or(z.literal("")),
  }).optional(),
  pricing: z.array(z.object({
    name: z.string(),
    price: z.string(),
    description: z.string().optional(),
    features: z.array(z.string()).optional(),
  })).optional(),
  testimonials: z.array(z.object({
    name: z.string(),
    text: z.string(),
    rating: z.number().min(1).max(5).optional(),
    role: z.string().optional(),
    avatar: z.string().url().optional().or(z.literal("")),
  })).optional(),
});

type AcademyEditorFormData = z.infer<typeof academyEditorSchema>;

export function AcademyEditor({ classroom, isOpen, onClose }: AcademyEditorProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'design' | 'content' | 'contact' | 'pricing'>('general');
  const [newFeature, setNewFeature] = useState("");
  const [newInstrument, setNewInstrument] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Safe JSON parsing with comprehensive error handling
  const safeJsonParse = (jsonString: string | null | undefined, fallback: any) => {
    if (!jsonString || jsonString.trim() === '' || jsonString === 'null' || jsonString === 'undefined') {
      return fallback;
    }
    
    // Check for malformed JSON patterns
    if (jsonString.includes('<!DOCTYPE') || jsonString.includes('<html')) {
      console.warn('Received HTML instead of JSON:', jsonString.substring(0, 100));
      return fallback;
    }
    
    try {
      const parsed = JSON.parse(jsonString);
      return parsed;
    } catch (error) {
      console.warn('Failed to parse JSON in AcademyEditor:', {
        input: jsonString.substring(0, 200) + (jsonString.length > 200 ? '...' : ''),
        error: error instanceof Error ? error.message : String(error)
      });
      return fallback;
    }
  };

  const parsedSocialLinks = safeJsonParse(classroom?.socialLinks, {});
  const parsedPricing = safeJsonParse(classroom?.pricing, []);
  const parsedTestimonials = safeJsonParse(classroom?.testimonials, []);

  const form = useForm<AcademyEditorFormData>({
    resolver: zodResolver(academyEditorSchema),
    defaultValues: {
      academyName: classroom.academyName || "",
      description: classroom.description || "",
      about: classroom.about || "",
      curriculum: classroom.curriculum || "",
      heroImage: classroom.heroImage || "",
      logoImage: classroom.logoImage || "",
      aboutImage: classroom.aboutImage || "",
      primaryColor: classroom.primaryColor || "#3B82F6",
      secondaryColor: classroom.secondaryColor || "#10B981",
      features: classroom.features || [],
      instruments: classroom.instruments || [],
      contactEmail: classroom.contactEmail || "",
      contactPhone: classroom.contactPhone || "",
      website: classroom.website || "",
      address: classroom.address || "",
      socialLinks: parsedSocialLinks,
      pricing: parsedPricing,
      testimonials: parsedTestimonials,
    },
  });

  const updateAcademyMutation = useMutation({
    mutationFn: (data: AcademyEditorFormData) => {
      try {
        // Clean and prepare the data for JSON serialization
        const cleanData = {
          ...data,
          // Remove any undefined values that might cause JSON issues
          academyName: data.academyName || "",
          description: data.description || "",
          about: data.about || "",
          curriculum: data.curriculum || "",
          heroImage: data.heroImage || "",
          logoImage: data.logoImage || "",
          aboutImage: data.aboutImage || "",
          primaryColor: data.primaryColor || "#3B82F6",
          secondaryColor: data.secondaryColor || "#10B981",
          features: data.features || [],
          instruments: data.instruments || [],
          contactEmail: data.contactEmail || "",
          contactPhone: data.contactPhone || "",
          website: data.website || "",
          address: data.address || "",
        };

        // Safely stringify JSON fields
        const requestBody = {
          ...cleanData,
          socialLinks: JSON.stringify(data.socialLinks || {}),
          pricing: JSON.stringify(data.pricing || []),
          testimonials: JSON.stringify(data.testimonials || []),
        };

        console.log('Sending update request with data:', requestBody);
        
        return apiRequest(`/api/classrooms/${classroom.id}`, {
          method: "PUT",
          body: JSON.stringify(requestBody),
        });
      } catch (error) {
        console.error('Error preparing academy data for update:', error);
        console.error('Form data causing error:', data);
        throw new Error(`Failed to prepare data: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
    onSuccess: () => {
      toast({
        title: "Academy Updated!",
        description: "Your academy landing page has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/classrooms"] });
      queryClient.invalidateQueries({ queryKey: ["/api/classrooms/slug", classroom.customSlug] });
      onClose();
    },
    onError: (error: any) => {
      console.error('Academy update error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update academy",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: AcademyEditorFormData) => {
    updateAcademyMutation.mutate(data);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      const currentFeatures = form.getValues("features") || [];
      form.setValue("features", [...currentFeatures, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues("features") || [];
    form.setValue("features", currentFeatures.filter((_, i) => i !== index));
  };

  const addInstrument = () => {
    if (newInstrument.trim()) {
      const currentInstruments = form.getValues("instruments") || [];
      form.setValue("instruments", [...currentInstruments, newInstrument.trim()]);
      setNewInstrument("");
    }
  };

  const removeInstrument = (index: number) => {
    const currentInstruments = form.getValues("instruments") || [];
    form.setValue("instruments", currentInstruments.filter((_, i) => i !== index));
  };

  const addPricingPlan = () => {
    const currentPricing = form.getValues("pricing") || [];
    form.setValue("pricing", [...currentPricing, {
      name: "New Plan",
      price: "$0",
      description: "",
      features: [],
    }]);
  };

  const removePricingPlan = (index: number) => {
    const currentPricing = form.getValues("pricing") || [];
    form.setValue("pricing", currentPricing.filter((_, i) => i !== index));
  };

  const addTestimonial = () => {
    const currentTestimonials = form.getValues("testimonials") || [];
    form.setValue("testimonials", [...currentTestimonials, {
      name: "Student Name",
      text: "Amazing academy! Highly recommended.",
      rating: 5,
      role: "Student",
      avatar: "",
    }]);
  };

  const removeTestimonial = (index: number) => {
    const currentTestimonials = form.getValues("testimonials") || [];
    form.setValue("testimonials", currentTestimonials.filter((_, i) => i !== index));
  };

  const tabs = [
    { id: 'general' as const, label: 'General', icon: Settings },
    { id: 'design' as const, label: 'Design', icon: Palette },
    { id: 'content' as const, label: 'Content', icon: Type },
    { id: 'contact' as const, label: 'Contact', icon: Phone },
    { id: 'pricing' as const, label: 'Pricing', icon: DollarSign },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Edit Academy Landing Page
          </DialogTitle>
          <DialogDescription>
            Customize your academy's landing page to attract and engage students
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-48 border-r bg-muted/30">
            <div className="p-4 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-[70vh]">
              <div className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    
                    {/* General Tab */}
                    {activeTab === 'general' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="academyName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Academy Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your Academy Name" {...field} />
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
                                <FormLabel>Short Description</FormLabel>
                                <FormControl>
                                  <Input placeholder="Brief description of your academy" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="about"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>About Your Academy</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Tell students about your academy's mission, teaching philosophy, and what makes it special..."
                                  className="min-h-[120px]"
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
                              <FormLabel>Curriculum Overview</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Describe your teaching approach, curriculum structure, and learning outcomes..."
                                  className="min-h-[100px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Instruments */}
                        <div>
                          <FormLabel>Instruments Taught</FormLabel>
                          <div className="mt-2 space-y-3">
                            <div className="flex flex-wrap gap-2">
                              {(form.watch("instruments") || []).map((instrument, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                  {instrument}
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-0 ml-1"
                                    onClick={() => removeInstrument(index)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add instrument (e.g., Piano, Guitar)"
                                value={newInstrument}
                                onChange={(e) => setNewInstrument(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInstrument())}
                              />
                              <Button type="button" onClick={addInstrument}>
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Design Tab */}
                    {activeTab === 'design' && (
                      <div className="space-y-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <ImageIcon className="h-5 w-5" />
                              Images
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <FormField
                              control={form.control}
                              name="logoImage"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Academy Logo</FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://example.com/logo.png" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="heroImage"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Hero Background Image</FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://example.com/hero.jpg" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="aboutImage"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>About Section Image</FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://example.com/about.jpg" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Palette className="h-5 w-5" />
                              Colors
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="primaryColor"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Primary Color</FormLabel>
                                    <FormControl>
                                      <div className="flex gap-2">
                                        <Input type="color" className="w-16 h-10" {...field} />
                                        <Input placeholder="#3B82F6" {...field} />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="secondaryColor"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Secondary Color</FormLabel>
                                    <FormControl>
                                      <div className="flex gap-2">
                                        <Input type="color" className="w-16 h-10" {...field} />
                                        <Input placeholder="#10B981" {...field} />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {/* Content Tab */}
                    {activeTab === 'content' && (
                      <div className="space-y-6">
                        {/* Features */}
                        <Card>
                          <CardHeader>
                            <CardTitle>Academy Features</CardTitle>
                            <CardDescription>Highlight what makes your academy special</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                              {(form.watch("features") || []).map((feature, index) => (
                                <Badge key={index} variant="outline" className="flex items-center gap-1">
                                  {feature}
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-0 ml-1"
                                    onClick={() => removeFeature(index)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add feature (e.g., One-on-one lessons)"
                                value={newFeature}
                                onChange={(e) => setNewFeature(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                              />
                              <Button type="button" onClick={addFeature}>
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Testimonials */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              <span>Student Testimonials</span>
                              <Button type="button" size="sm" onClick={addTestimonial}>
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                              </Button>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {(form.watch("testimonials") || []).map((testimonial, index) => (
                              <div key={index} className="border rounded-lg p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                  <h4 className="font-medium">Testimonial {index + 1}</h4>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeTestimonial(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <Input
                                    placeholder="Student Name"
                                    value={testimonial.name}
                                    onChange={(e) => {
                                      const testimonials = form.getValues("testimonials") || [];
                                      testimonials[index].name = e.target.value;
                                      form.setValue("testimonials", testimonials);
                                    }}
                                  />
                                  <Input
                                    placeholder="Role (e.g., Piano Student)"
                                    value={testimonial.role || ""}
                                    onChange={(e) => {
                                      const testimonials = form.getValues("testimonials") || [];
                                      testimonials[index].role = e.target.value;
                                      form.setValue("testimonials", testimonials);
                                    }}
                                  />
                                </div>
                                <Textarea
                                  placeholder="What did they say about your academy?"
                                  value={testimonial.text}
                                  onChange={(e) => {
                                    const testimonials = form.getValues("testimonials") || [];
                                    testimonials[index].text = e.target.value;
                                    form.setValue("testimonials", testimonials);
                                  }}
                                />
                                <div className="grid grid-cols-2 gap-3">
                                  <Input
                                    type="number"
                                    min="1"
                                    max="5"
                                    placeholder="Rating (1-5)"
                                    value={testimonial.rating || 5}
                                    onChange={(e) => {
                                      const testimonials = form.getValues("testimonials") || [];
                                      testimonials[index].rating = parseInt(e.target.value);
                                      form.setValue("testimonials", testimonials);
                                    }}
                                  />
                                  <Input
                                    placeholder="Avatar URL (optional)"
                                    value={testimonial.avatar || ""}
                                    onChange={(e) => {
                                      const testimonials = form.getValues("testimonials") || [];
                                      testimonials[index].avatar = e.target.value;
                                      form.setValue("testimonials", testimonials);
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {/* Contact Tab */}
                    {activeTab === 'contact' && (
                      <div className="space-y-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
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
                                      Email
                                    </FormLabel>
                                    <FormControl>
                                      <Input placeholder="contact@academy.com" {...field} />
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
                                      Phone
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
                                    <Input placeholder="https://www.academy.com" {...field} />
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
                                    <Textarea placeholder="123 Music Street, City, State 12345" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle>Social Media Links</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <FormField
                              control={form.control}
                              name="socialLinks.instagram"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Instagram className="h-4 w-4" />
                                    Instagram
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://instagram.com/youracademy" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="socialLinks.facebook"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Facebook className="h-4 w-4" />
                                    Facebook
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://facebook.com/youracademy" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="socialLinks.twitter"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Twitter className="h-4 w-4" />
                                    Twitter
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://twitter.com/youracademy" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="socialLinks.youtube"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Youtube className="h-4 w-4" />
                                    YouTube
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://youtube.com/youracademy" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {/* Pricing Tab */}
                    {activeTab === 'pricing' && (
                      <div className="space-y-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              <span>Pricing Plans</span>
                              <Button type="button" size="sm" onClick={addPricingPlan}>
                                <Plus className="h-4 w-4 mr-1" />
                                Add Plan
                              </Button>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            {(form.watch("pricing") || []).map((plan, index) => (
                              <div key={index} className="border rounded-lg p-4 space-y-4">
                                <div className="flex justify-between items-start">
                                  <h4 className="font-medium">Plan {index + 1}</h4>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removePricingPlan(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <Input
                                    placeholder="Plan Name"
                                    value={plan.name}
                                    onChange={(e) => {
                                      const pricing = form.getValues("pricing") || [];
                                      pricing[index].name = e.target.value;
                                      form.setValue("pricing", pricing);
                                    }}
                                  />
                                  <Input
                                    placeholder="Price (e.g., $50/month)"
                                    value={plan.price}
                                    onChange={(e) => {
                                      const pricing = form.getValues("pricing") || [];
                                      pricing[index].price = e.target.value;
                                      form.setValue("pricing", pricing);
                                    }}
                                  />
                                </div>
                                <Textarea
                                  placeholder="Plan description"
                                  value={plan.description || ""}
                                  onChange={(e) => {
                                    const pricing = form.getValues("pricing") || [];
                                    pricing[index].description = e.target.value;
                                    form.setValue("pricing", pricing);
                                  }}
                                />
                              </div>
                            ))}
                            {(form.watch("pricing") || []).length === 0 && (
                              <div className="text-center py-8 text-muted-foreground">
                                <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>No pricing plans yet. Add your first plan above.</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    <Separator />

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-4">
                      <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => window.open(`/academy/${classroom.customSlug}`, '_blank')}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button type="submit" disabled={updateAcademyMutation.isPending}>
                          <Save className="h-4 w-4 mr-2" />
                          {updateAcademyMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}