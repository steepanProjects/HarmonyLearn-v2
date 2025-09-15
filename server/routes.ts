import type { Express } from "express";
import { createServer, type Server } from "http";
import * as storage from "./storage";
import { 
  insertUserSchema, 
  insertCourseSchema, 
  insertClassroomSchema,
  type InsertUser,
  type InsertCourse,
  type InsertClassroom
} from "../shared/types";
import { z } from "zod";
import bcrypt from "bcrypt";
import { config } from "./env";

// Helper function to hash passwords
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// Helper function to verify passwords
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Lightweight health check endpoint for container orchestration
  app.get("/health", (req, res) => {
    const healthStatus = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: config.app.environment,
      version: config.app.version,
      uptime: process.uptime(),
      memory: {
        used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
        total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100
      }
    };
    
    res.status(200).json(healthStatus);
  });

  // Readiness check for container orchestration
  app.get("/ready", async (req, res) => {
    try {
      // Quick database connectivity check
      await storage.getUsers();
      res.status(200).json({ status: "ready" });
    } catch (error) {
      res.status(503).json({ status: "not ready" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUserById(parseInt(req.params.id));
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid user data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { role, ...userData } = req.body;
      
      // Validate input data
      const validatedData = insertUserSchema.parse({
        ...userData,
        role: role || "student"
      });

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(409).json({ error: "User already exists with this email" });
      }

      // Hash password
      const hashedPassword = await hashPassword(validatedData.password);
      
      // Create user
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword
      });
      
      // Remove password from response
      const { password, ...userResponse } = user;
      
      res.status(201).json({ 
        message: "User registered successfully", 
        user: userResponse 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid registration data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Verify password
      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Remove password from response
      const { password: _, ...userResponse } = user;
      
      res.json({ 
        message: "Login successful", 
        user: userResponse 
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourseById(parseInt(req.params.id));
      if (!course) return res.status(404).json({ error: "Course not found" });
      res.json(course);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/courses", async (req, res) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid course data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/courses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const courseData = req.body;
      const course = await storage.updateCourse(id, courseData);
      res.json(course);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/courses/:id", async (req, res) => {
    try {
      await storage.deleteCourse(parseInt(req.params.id));
      res.json({ message: "Course deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Classroom routes
  app.get("/api/classrooms", async (req, res) => {
    try {
      const classrooms = await storage.getClassrooms();
      res.json(classrooms);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/classrooms/slug/:slug", async (req, res) => {
    try {
      const classroom = await storage.getClassroomBySlug(req.params.slug);
      if (!classroom) return res.status(404).json({ error: "Academy not found" });
      res.json(classroom);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/classrooms/:id", async (req, res) => {
    try {
      const classroom = await storage.getClassroomById(parseInt(req.params.id));
      if (!classroom) return res.status(404).json({ error: "Classroom not found" });
      res.json(classroom);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/classrooms", async (req, res) => {
    try {
      const classroomData = insertClassroomSchema.parse(req.body);
      const classroom = await storage.createClassroom(classroomData);
      res.status(201).json(classroom);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid classroom data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/classrooms/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const classroomData = req.body;
      const classroom = await storage.updateClassroom(id, classroomData);
      res.json(classroom);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/classrooms/:id", async (req, res) => {
    try {
      await storage.deleteClassroom(parseInt(req.params.id));
      res.json({ message: "Classroom deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Classroom members route
  app.get("/api/classrooms/:id/members", async (req, res) => {
    try {
      const classroomId = parseInt(req.params.id);
      const members = await storage.getClassroomMemberships(classroomId);
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Classroom analytics route
  app.get("/api/classrooms/:id/analytics", async (req, res) => {
    try {
      const classroomId = parseInt(req.params.id);
      // Basic analytics - you can expand this later
      const analytics = {
        totalStudents: 0,
        totalSessions: 0,
        averageAttendance: 0,
        recentActivity: []
      };
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Enrollment routes
  app.get("/api/enrollments", async (req, res) => {
    try {
      const enrollments = await storage.getEnrollments();
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/enrollments/user/:userId", async (req, res) => {
    try {
      const enrollments = await storage.getEnrollmentsByUserId(parseInt(req.params.userId));
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/enrollments/course/:courseId", async (req, res) => {
    try {
      const enrollments = await storage.getEnrollmentsByCourseId(parseInt(req.params.courseId));
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/enrollments", async (req, res) => {
    try {
      const { userId, courseId } = req.body;
      const enrollment = await storage.createEnrollment(userId, courseId);
      res.status(201).json(enrollment);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Classroom membership routes
  app.get("/api/classroom-memberships", async (req, res) => {
    try {
      const { classroomId, role } = req.query;
      const memberships = await storage.getClassroomMemberships(
        classroomId ? parseInt(classroomId as string) : undefined,
        role as string
      );
      res.json(memberships);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/classroom-memberships", async (req, res) => {
    try {
      const { userId, classroomId, role } = req.body;
      const membership = await storage.createClassroomMembership(userId, classroomId, role);
      res.status(201).json(membership);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Live session routes
  app.get("/api/live-sessions", async (req, res) => {
    try {
      const { classroomId, mentorId } = req.query;
      const sessions = await storage.getLiveSessions(
        classroomId ? parseInt(classroomId as string) : undefined,
        mentorId ? parseInt(mentorId as string) : undefined
      );
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/live-sessions/:id", async (req, res) => {
    try {
      const session = await storage.getLiveSessionById(parseInt(req.params.id));
      if (!session) return res.status(404).json({ error: "Live session not found" });
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/live-sessions", async (req, res) => {
    try {
      const sessionData = req.body;
      const session = await storage.createLiveSession({
        ...sessionData,
        scheduledAt: new Date(sessionData.scheduledAt)
      });
      res.status(201).json(session);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Mentor profiles routes
  app.get("/api/mentors", async (req, res) => {
    try {
      const mentorProfiles = await storage.getMentorProfiles();
      res.json(mentorProfiles);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/mentors/:id", async (req, res) => {
    try {
      const mentorProfile = await storage.getMentorProfileById(parseInt(req.params.id));
      if (!mentorProfile) return res.status(404).json({ error: "Mentor profile not found" });
      res.json(mentorProfile);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/mentors/user/:userId", async (req, res) => {
    try {
      const mentorProfile = await storage.getMentorProfileByUserId(parseInt(req.params.userId));
      if (!mentorProfile) return res.status(404).json({ error: "Mentor profile not found" });
      res.json(mentorProfile);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/mentors", async (req, res) => {
    try {
      const profileData = req.body;
      const mentorProfile = await storage.createMentorProfile(profileData);
      res.status(201).json(mentorProfile);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Posts routes
  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/posts/:id", async (req, res) => {
    try {
      const post = await storage.getPostById(parseInt(req.params.id));
      if (!post) return res.status(404).json({ error: "Post not found" });
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/posts", async (req, res) => {
    try {
      const postData = req.body;
      const post = await storage.createPost(postData);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Staff request routes
  app.get("/api/staff-requests", async (req, res) => {
    try {
      const { classroomId, status } = req.query;
      const requests = await storage.getStaffRequests(
        classroomId ? parseInt(classroomId as string) : undefined,
        status as string
      );
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/staff-requests/:id", async (req, res) => {
    try {
      const request = await storage.getStaffRequestById(parseInt(req.params.id));
      if (!request) return res.status(404).json({ error: "Staff request not found" });
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/staff-requests", async (req, res) => {
    try {
      const requestData = req.body;
      const request = await storage.createStaffRequest(requestData);
      res.status(201).json(request);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/staff-requests/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, reviewedBy, adminNotes } = req.body;
      const request = await storage.updateStaffRequest(id, { status, reviewedBy, adminNotes });
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Master role request routes
  app.get("/api/master-role-requests", async (req, res) => {
    try {
      const { status } = req.query;
      const requests = await storage.getMasterRoleRequests(status as string);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/master-role-requests/:id", async (req, res) => {
    try {
      const request = await storage.getMasterRoleRequestById(parseInt(req.params.id));
      if (!request) return res.status(404).json({ error: "Master role request not found" });
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/master-role-requests", async (req, res) => {
    try {
      const requestData = req.body;
      
      // Check if we're receiving the wrong field names and return helpful error
      if (requestData.reason || requestData.plannedClassrooms || requestData.additionalQualifications) {
        return res.status(400).json({ 
          error: "Invalid field names. Expected: mentorId, experience, qualifications, motivation. Received fields that belong to different request types." 
        });
      }
      
      // Validate that we have the required fields for master role request
      if (!requestData.mentorId || !requestData.experience || !requestData.qualifications || !requestData.motivation) {
        return res.status(400).json({ 
          error: "Missing required fields: mentorId, experience, qualifications, motivation" 
        });
      }
      
      // Extract only the valid fields for master role request
      const validRequestData = {
        mentorId: requestData.mentorId,
        experience: requestData.experience,
        qualifications: requestData.qualifications,
        motivation: requestData.motivation,
        portfolio: requestData.portfolio
      };
      
      const request = await storage.createMasterRoleRequest(validRequestData);
      res.status(201).json(request);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/master-role-requests/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, reviewedBy, adminNotes } = req.body;
      const request = await storage.updateMasterRoleRequest(id, { status, reviewedBy, adminNotes });
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Mentorship request routes
  app.get("/api/mentorship-requests", async (req, res) => {
    try {
      const { studentId, mentorId, status } = req.query;
      const requests = await storage.getMentorshipRequests(
        studentId ? parseInt(studentId as string) : undefined,
        mentorId ? parseInt(mentorId as string) : undefined,
        status as string
      );
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/mentorship-requests/:id", async (req, res) => {
    try {
      const request = await storage.getMentorshipRequestById(parseInt(req.params.id));
      if (!request) return res.status(404).json({ error: "Mentorship request not found" });
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/mentorship-requests", async (req, res) => {
    try {
      const requestData = req.body;
      const request = await storage.createMentorshipRequest(requestData);
      res.status(201).json(request);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/mentorship-requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const request = await storage.updateMentorshipRequest(id, updateData);
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Mentorship session routes
  app.get("/api/mentorship-sessions", async (req, res) => {
    try {
      const { mentorId, studentId, status } = req.query;
      const sessions = await storage.getMentorshipSessions(
        mentorId ? parseInt(mentorId as string) : undefined,
        studentId ? parseInt(studentId as string) : undefined,
        status as string
      );
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/mentorship-sessions/:id", async (req, res) => {
    try {
      const session = await storage.getMentorshipSessionById(parseInt(req.params.id));
      if (!session) return res.status(404).json({ error: "Mentorship session not found" });
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/mentorship-sessions", async (req, res) => {
    try {
      const sessionData = req.body;
      const session = await storage.createMentorshipSession({
        ...sessionData,
        scheduledAt: new Date(sessionData.scheduledAt)
      });
      res.status(201).json(session);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Mentor profile routes (add missing endpoint)
  app.get("/api/mentor-profiles", async (req, res) => {
    try {
      const mentorProfiles = await storage.getMentorProfiles();
      res.json(mentorProfiles);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Mentor conversation routes
  app.get("/api/mentor-conversations/:requestId", async (req, res) => {
    try {
      const conversations = await storage.getMentorConversations(parseInt(req.params.requestId));
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/mentor-conversations", async (req, res) => {
    try {
      const conversationData = req.body;
      const conversation = await storage.createMentorConversation(conversationData);
      res.status(201).json(conversation);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Resignation request routes
  app.get("/api/resignation-requests", async (req, res) => {
    try {
      const { classroomId, mentorId, status } = req.query;
      const requests = await storage.getResignationRequests(
        classroomId ? parseInt(classroomId as string) : undefined,
        mentorId ? parseInt(mentorId as string) : undefined,
        status as string
      );
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/mentors/:mentorId/resignation-requests", async (req, res) => {
    try {
      const mentorId = parseInt(req.params.mentorId);
      if (isNaN(mentorId)) {
        return res.status(400).json({ error: "Invalid mentor ID" });
      }
      const requests = await storage.getResignationRequests(undefined, mentorId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/resignation-requests/:id", async (req, res) => {
    try {
      const request = await storage.getResignationRequestById(parseInt(req.params.id));
      if (!request) return res.status(404).json({ error: "Resignation request not found" });
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/resignation-requests", async (req, res) => {
    try {
      const requestData = req.body;
      const request = await storage.createResignationRequest({
        ...requestData,
        lastWorkDate: new Date(requestData.lastWorkDate)
      });
      res.status(201).json(request);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/resignation-requests/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, reviewedBy, masterNotes } = req.body;
      const request = await storage.updateResignationRequest(id, { status, reviewedBy, masterNotes });
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Staff classroom routes
  app.get("/api/mentors/:mentorId/staff-classroom", async (req, res) => {
    try {
      const mentorId = parseInt(req.params.mentorId);
      if (isNaN(mentorId)) {
        return res.status(400).json({ error: "Invalid mentor ID" });
      }
      const classroomInfo = await storage.getStaffClassroomInfo(mentorId);
      if (!classroomInfo) {
        return res.status(404).json({ error: "No staff classroom found for this mentor" });
      }
      res.json(classroomInfo);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Schedule routes
  app.get("/api/schedules", async (req, res) => {
    try {
      const { classroomId, instructorId } = req.query;
      const schedules = await storage.getSchedules(
        classroomId ? parseInt(classroomId as string) : undefined,
        instructorId ? parseInt(instructorId as string) : undefined
      );
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/schedules/:id", async (req, res) => {
    try {
      const schedule = await storage.getScheduleById(parseInt(req.params.id));
      if (!schedule) return res.status(404).json({ error: "Schedule not found" });
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/schedules", async (req, res) => {
    try {
      const scheduleData = req.body;
      const schedule = await storage.createSchedule(scheduleData);
      res.status(201).json(schedule);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/schedules/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const scheduleData = req.body;
      const schedule = await storage.updateSchedule(id, scheduleData);
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/schedules/:id", async (req, res) => {
    try {
      await storage.deleteSchedule(parseInt(req.params.id));
      res.json({ message: "Schedule deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}