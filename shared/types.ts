import { z } from "zod";

// Basic user schema for client-side validation
export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  role: z.string().default("student"),
  isMaster: z.boolean().default(false),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  xp: z.number().default(0),
  level: z.number().default(1),
});

export const insertCourseSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  category: z.string(),
  level: z.string(),
  price: z.number().optional(),
  duration: z.number().optional(),
  mentorId: z.number().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  status: z.string().default("draft"),
  approvedBy: z.number().optional(),
  adminNotes: z.string().optional(),
  syllabus: z.string().optional(),
  prerequisites: z.array(z.string()).default([]),
  learningObjectives: z.array(z.string()).default([]),
  targetAudience: z.string().optional(),
  difficulty: z.number().default(1),
  estimatedWeeks: z.number().optional(),
  maxStudents: z.number().default(100),
  currentEnrollments: z.number().default(0),
  tags: z.array(z.string()).default([]),
});

export const insertClassroomSchema = z.object({
  title: z.string(),
  subject: z.string(),
  level: z.string(),
  description: z.string().optional(),
  masterId: z.number().optional(),
  maxStudents: z.number().default(50),
  isActive: z.boolean().default(true),
  academyName: z.string().optional(),
  about: z.string().optional(),
  instruments: z.array(z.string()).default([]),
  curriculum: z.string().optional(),
  heroImage: z.string().optional(),
  logoImage: z.string().optional(),
  aboutImage: z.string().optional(),
  primaryColor: z.string().default("#3B82F6"),
  secondaryColor: z.string().default("#10B981"),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  website: z.string().optional(),
  socialLinks: z.string().optional(),
  features: z.array(z.string()).default([]),
  testimonials: z.string().optional(),
  pricing: z.string().optional(),
  schedule: z.string().optional(),
  address: z.string().optional(),
  isPublic: z.boolean().default(true),
  customSlug: z.string().optional(),
});

// Basic types for client-side usage
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertClassroom = z.infer<typeof insertClassroomSchema>;

// Common types used by client
export type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  isMaster: boolean;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  xp: number;
  level: number;
  createdAt: Date;
};

export type Course = {
  id: number;
  title: string;
  description?: string;
  category: string;
  level: string;
  price?: number;
  duration?: number;
  mentorId?: number;
  imageUrl?: string;
  isActive: boolean;
  status: string;
  tags: string[];
  createdAt: Date;
};

export type Classroom = {
  id: number;
  title: string;
  subject: string;
  level: string;
  description?: string;
  masterId?: number;
  maxStudents: number;
  isActive: boolean;
  academyName?: string;
  about?: string;
  instruments: string[];
  heroImage?: string;
  logoImage?: string;
  primaryColor: string;
  secondaryColor: string;
  contactEmail?: string;
  website?: string;
  address?: string;
  customSlug?: string;
  createdAt: Date;
};