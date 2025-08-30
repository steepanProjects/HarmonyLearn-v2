import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertCourseSchema, 
  insertClassroomSchema, 
  insertPostSchema,
  insertLearningPathSchema,
  insertLiveSessionSchema,
  insertPracticeGroupSchema,
  insertForumCategorySchema,
  insertForumTopicSchema,
  insertEventSchema,
  insertMentorProfileSchema,
  insertCourseReviewSchema,
  insertUserAchievementSchema,
  insertMentorApplicationSchema,
  insertMentorshipRequestSchema,
  insertMentorConversationSchema,
  insertMentorshipSessionSchema,
  insertMasterRoleRequestSchema,
  insertStaffRequestSchema,
  insertResignationRequestSchema,
  insertScheduleSchema,
  insertScheduleEnrollmentSchema,
  insertScheduleNotificationSchema,
  insertEnrollmentSchema,
  insertCourseWaitlistSchema,
  insertCourseAnalyticsSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/users", async (req, res) => {
    try {
      const { role } = req.query;
      const users = await storage.getAllUsers(role as string);
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
      const hashedPassword = await storage.hashPassword(validatedData.password);
      
      // Create user
      const user = await storage.registerUser(validatedData, hashedPassword);
      
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
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      
      const user = await storage.authenticateUser(email, password);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Remove password from response
      const { password: _, ...userResponse } = user;
      
      res.json({ 
        message: "Login successful", 
        user: userResponse 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const { category, mentor } = req.query;
      let courses;
      
      if (category) {
        courses = await storage.getCoursesByCategory(category as string);
      } else if (mentor) {
        courses = await storage.getCoursesByMentor(parseInt(mentor as string));
      } else {
        courses = await storage.getCourses();
      }
      
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourse(parseInt(req.params.id));
      if (!course) return res.status(404).json({ error: "Course not found" });
      res.json(course);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/courses", async (req, res) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      // Set default status for new courses
      if (!courseData.status) {
        courseData.status = "draft";
      }
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid course data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Update course
  app.put("/api/courses/:id", async (req, res) => {
    try {
      const courseData = insertCourseSchema.partial().parse(req.body);
      const course = await storage.updateCourse(parseInt(req.params.id), courseData);
      if (!course) return res.status(404).json({ error: "Course not found" });
      res.json(course);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid course data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Delete course (soft delete)
  app.delete("/api/courses/:id", async (req, res) => {
    try {
      const success = await storage.deleteCourse(parseInt(req.params.id));
      if (!success) return res.status(404).json({ error: "Course not found" });
      res.json({ message: "Course deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get courses by status
  app.get("/api/courses/status/:status", async (req, res) => {
    try {
      const courses = await storage.getCoursesByStatus(req.params.status);
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get courses for approval (admin only)
  app.get("/api/courses/pending-approval", async (req, res) => {
    try {
      const courses = await storage.getCoursesForApproval();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get published courses
  app.get("/api/courses/published", async (req, res) => {
    try {
      const courses = await storage.getPublishedCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Approve course (admin only)
  app.post("/api/courses/:id/approve", async (req, res) => {
    try {
      const { adminNotes } = req.body;
      const adminId = 1; // TODO: Get from authenticated user session
      const course = await storage.approveCourse(parseInt(req.params.id), adminId, adminNotes);
      if (!course) return res.status(404).json({ error: "Course not found" });
      res.json(course);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Reject course (admin only)
  app.post("/api/courses/:id/reject", async (req, res) => {
    try {
      const { adminNotes } = req.body;
      const adminId = 1; // TODO: Get from authenticated user session
      const course = await storage.rejectCourse(parseInt(req.params.id), adminId, adminNotes);
      if (!course) return res.status(404).json({ error: "Course not found" });
      res.json(course);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Publish course (admin only)
  app.post("/api/courses/:id/publish", async (req, res) => {
    try {
      const { adminNotes } = req.body;
      const adminId = 1; // TODO: Get from authenticated user session
      const course = await storage.updateCourseStatus(parseInt(req.params.id), "published", adminNotes, adminId);
      if (!course) return res.status(404).json({ error: "Course not found" });
      res.json(course);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Classroom routes
  app.get("/api/classrooms", async (req, res) => {
    try {
      const { master } = req.query;
      let classrooms;
      
      if (master) {
        classrooms = await storage.getClassroomsByMaster(parseInt(master as string));
      } else {
        classrooms = await storage.getClassrooms();
      }
      
      res.json(classrooms);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get public classrooms for browsing
  app.get("/api/classrooms/public", async (req, res) => {
    try {
      const classrooms = await storage.getPublicClassrooms();
      res.json(classrooms);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get classroom by custom slug
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
      const classroom = await storage.getClassroom(parseInt(req.params.id));
      if (!classroom) return res.status(404).json({ error: "Classroom not found" });
      res.json(classroom);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/classrooms", async (req, res) => {
    try {
      console.log("Received classroom data:", JSON.stringify(req.body, null, 2));
      const classroomData = insertClassroomSchema.parse(req.body);
      console.log("Parsed classroom data:", JSON.stringify(classroomData, null, 2));
      const classroom = await storage.createClassroom(classroomData);
      res.status(201).json(classroom);
    } catch (error) {
      console.error("Classroom creation error:", error);
      if (error instanceof z.ZodError) {
        console.error("Zod validation errors:", error.errors);
        return res.status(400).json({ error: "Invalid classroom data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error", details: error instanceof Error ? error.message : String(error) });
    }
  });

  // Update classroom route
  app.put("/api/classrooms/:id", async (req, res) => {
    try {
      const classroomId = parseInt(req.params.id);
      console.log("Updating classroom:", classroomId, "with data:", JSON.stringify(req.body, null, 2));
      
      // Validate the data using a partial schema for updates
      const updateData = insertClassroomSchema.partial().parse(req.body);
      console.log("Parsed update data:", JSON.stringify(updateData, null, 2));
      
      const updatedClassroom = await storage.updateClassroom(classroomId, updateData);
      if (!updatedClassroom) {
        return res.status(404).json({ error: "Classroom not found" });
      }
      
      res.json(updatedClassroom);
    } catch (error) {
      console.error("Classroom update error:", error);
      if (error instanceof z.ZodError) {
        console.error("Zod validation errors:", error.errors);
        return res.status(400).json({ error: "Invalid classroom data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error", details: error instanceof Error ? error.message : String(error) });
    }
  });

  // Join classroom route
  app.post("/api/classrooms/:id/join", async (req, res) => {
    try {
      const classroomId = parseInt(req.params.id);
      const { userId, message, experience } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      
      // Check if user already has a membership for this classroom
      const existingMembership = await storage.getClassroomMembership(userId, classroomId);
      if (existingMembership) {
        return res.status(400).json({ error: "You already have a request for this academy" });
      }
      
      // Create classroom membership with pending status
      const membership = await storage.createClassroomMembership({
        userId,
        classroomId,
        role: "student",
        status: "pending"
      });
      
      res.status(201).json({ 
        message: "Join request sent successfully",
        membership 
      });
    } catch (error) {
      console.error("Join classroom error:", error);
      res.status(500).json({ error: "Failed to send join request" });
    }
  });

  // Get pending enrollment requests for a classroom (for masters)
  app.get("/api/classrooms/:id/requests", async (req, res) => {
    try {
      const classroomId = parseInt(req.params.id);
      const { status } = req.query;
      
      const requests = await storage.getClassroomMembershipRequests(classroomId, status as string);
      res.json(requests);
    } catch (error) {
      console.error("Get enrollment requests error:", error);
      res.status(500).json({ error: "Failed to fetch enrollment requests" });
    }
  });

  // Approve or reject enrollment request
  app.patch("/api/classroom-memberships/:id/status", async (req, res) => {
    try {
      const membershipId = parseInt(req.params.id);
      const { status, reviewedBy } = req.body;
      
      if (!['active', 'rejected'].includes(status)) {
        return res.status(400).json({ error: "Invalid status. Use 'active' or 'rejected'" });
      }
      
      const updatedMembership = await storage.updateClassroomMembershipStatus(membershipId, status, reviewedBy);
      
      res.json({ 
        message: `Request ${status === 'active' ? 'approved' : 'rejected'} successfully`,
        membership: updatedMembership 
      });
    } catch (error) {
      console.error("Update membership status error:", error);
      res.status(500).json({ error: "Failed to update request status" });
    }
  });

  // Classroom memberships routes
  app.get("/api/classroom-memberships", async (req, res) => {
    try {
      const { classroomId, role } = req.query;
      let memberships: any[] = [];
      
      if (classroomId && role) {
        // Get memberships for a specific classroom and role
        memberships = await storage.getClassroomMembershipsByClassroomAndRole(parseInt(classroomId as string), role as string);
      } else if (classroomId) {
        // Get all memberships for a specific classroom
        memberships = await storage.getClassroomMembershipsByClassroom(parseInt(classroomId as string));
      } else {
        // Return empty array if no classroomId provided
        memberships = [];
      }
      
      res.json(memberships);
    } catch (error) {
      console.error("Classroom memberships error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Classroom members route (alias for memberships with user details)
  app.get("/api/classrooms/:id/members", async (req, res) => {
    try {
      const classroomId = parseInt(req.params.id);
      const members = await storage.getClassroomMembershipsByClassroom(classroomId);
      res.json(members || []);
    } catch (error) {
      console.error("Classroom members error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Classroom analytics route
  app.get("/api/classrooms/:id/analytics", async (req, res) => {
    try {
      const classroomId = parseInt(req.params.id);
      
      // Get basic classroom data
      const classroom = await storage.getClassroom(classroomId);
      if (!classroom) {
        return res.status(404).json({ error: "Classroom not found" });
      }

      // Get members for analytics
      const members = await storage.getClassroomMembershipsByClassroom(classroomId) || [];
      const students = members.filter((m: any) => m.role === 'student');
      const staff = members.filter((m: any) => m.role === 'staff');

      // Calculate analytics
      const analytics = {
        totalStudents: students.length,
        totalStaff: staff.length,
        averageProgress: students.length > 0 ? 
          students.reduce((sum: number, s: any) => sum + (s.progress || 0), 0) / students.length : 0,
        completionRate: students.length > 0 ?
          (students.filter((s: any) => s.progress >= 100).length / students.length) * 100 : 0,
        staffEfficiency: 85, // Placeholder - would be calculated from actual data
        satisfaction: 92, // Placeholder - would come from reviews/feedback
        teachingQuality: 4.8, // Placeholder - would come from student ratings
        engagement: 89, // Placeholder - would come from participation metrics
        recentActivities: [] // Placeholder - would come from activity logs
      };

      res.json(analytics);
    } catch (error) {
      console.error("Classroom analytics error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/classroom-memberships", async (req, res) => {
    try {
      const membershipData = {
        userId: req.body.userId,
        classroomId: req.body.classroomId,
        role: req.body.role || "student",
        status: req.body.status || "active"
      };
      
      const membership = await storage.createClassroomMembership(membershipData);
      res.status(201).json(membership);
    } catch (error) {
      console.error("Create classroom membership error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Live sessions routes
  app.get("/api/live-sessions", async (req, res) => {
    try {
      const { mentor, classroom } = req.query;
      let sessions;
      
      if (mentor) {
        sessions = await storage.getLiveSessionsByMentor(parseInt(mentor as string));
      } else if (classroom) {
        sessions = await storage.getLiveSessionsByClassroom(parseInt(classroom as string));
      } else {
        sessions = await storage.getLiveSessions();
      }
      
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Community posts routes
  app.get("/api/posts", async (req, res) => {
    try {
      const { user } = req.query;
      let posts;
      
      if (user) {
        posts = await storage.getPostsByUser(parseInt(user as string));
      } else {
        posts = await storage.getPosts();
      }
      
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/posts", async (req, res) => {
    try {
      const postData = insertPostSchema.parse(req.body);
      const post = await storage.createPost(postData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid post data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Enhanced enrollment routes
  app.get("/api/enrollments/user/:userId", async (req, res) => {
    try {
      const enrollments = await storage.getEnrollmentsByUser(parseInt(req.params.userId));
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/enrollments/course/:courseId", async (req, res) => {
    try {
      const enrollments = await storage.getEnrollmentsByCourse(parseInt(req.params.courseId));
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/enrollments/status/:status", async (req, res) => {
    try {
      const enrollments = await storage.getEnrollmentsByStatus(req.params.status);
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/enrollments", async (req, res) => {
    try {
      const enrollmentData = insertEnrollmentSchema.parse(req.body);
      const enrollment = await storage.createEnrollment(enrollmentData);
      res.status(201).json(enrollment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid enrollment data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/enrollments/:id/progress", async (req, res) => {
    try {
      const { progress } = req.body;
      const enrollment = await storage.updateEnrollmentProgress(parseInt(req.params.id), progress);
      if (!enrollment) return res.status(404).json({ error: "Enrollment not found" });
      res.json(enrollment);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/enrollments/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const enrollment = await storage.updateEnrollmentStatus(parseInt(req.params.id), status);
      if (!enrollment) return res.status(404).json({ error: "Enrollment not found" });
      res.json(enrollment);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/enrollments/:id/complete", async (req, res) => {
    try {
      const enrollment = await storage.completeEnrollment(parseInt(req.params.id));
      if (!enrollment) return res.status(404).json({ error: "Enrollment not found" });
      res.json(enrollment);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Course waitlist routes
  app.get("/api/courses/:id/waitlist", async (req, res) => {
    try {
      const waitlist = await storage.getCourseWaitlist(parseInt(req.params.id));
      res.json(waitlist);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/waitlist/user/:userId", async (req, res) => {
    try {
      const waitlistEntries = await storage.getUserWaitlistEntries(parseInt(req.params.userId));
      res.json(waitlistEntries);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/courses/:id/waitlist", async (req, res) => {
    try {
      const { userId } = req.body;
      const waitlistEntry = await storage.addToWaitlist({
        userId,
        courseId: parseInt(req.params.id),
        priority: 1,
        status: "waiting"
      });
      res.status(201).json(waitlistEntry);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/courses/:courseId/waitlist/:userId", async (req, res) => {
    try {
      const success = await storage.removeFromWaitlist(parseInt(req.params.userId), parseInt(req.params.courseId));
      if (!success) return res.status(404).json({ error: "Waitlist entry not found" });
      res.json({ message: "Removed from waitlist successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/courses/:id/waitlist/notify", async (req, res) => {
    try {
      const { count = 1 } = req.body;
      const notifiedUsers = await storage.notifyWaitlistUsers(parseInt(req.params.id), count);
      res.json({ 
        message: `Notified ${notifiedUsers.length} users from waitlist`,
        notifiedUsers 
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Course analytics routes
  app.get("/api/courses/:id/analytics", async (req, res) => {
    try {
      const analytics = await storage.getCourseAnalytics(parseInt(req.params.id));
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/courses/:id/analytics/summary", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const summary = await storage.getCourseAnalyticsSummary(
        parseInt(req.params.id),
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/courses/:id/analytics", async (req, res) => {
    try {
      const analyticsData = insertCourseAnalyticsSchema.parse(req.body);
      analyticsData.courseId = parseInt(req.params.id);
      const analytics = await storage.createCourseAnalytics(analyticsData);
      res.status(201).json(analytics);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid analytics data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Live sessions routes
  app.get("/api/live-sessions", async (req, res) => {
    try {
      const { mentor, classroom, status } = req.query;
      let sessions;
      
      if (mentor) {
        sessions = await storage.getLiveSessionsByMentor(parseInt(mentor as string));
      } else if (classroom) {
        sessions = await storage.getLiveSessionsByClassroom(parseInt(classroom as string));
      } else {
        sessions = await storage.getLiveSessions();
      }
      
      // Filter by status if provided
      if (status && sessions) {
        sessions = sessions.filter(session => session.status === status);
      }
      
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/live-sessions/:id", async (req, res) => {
    try {
      const session = await storage.getLiveSession(parseInt(req.params.id));
      if (!session) return res.status(404).json({ error: "Live session not found" });
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/live-sessions", async (req, res) => {
    try {
      const sessionData = insertLiveSessionSchema.parse(req.body);
      const session = await storage.createLiveSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid live session data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Learning path routes
  app.get("/api/learning-paths", async (req, res) => {
    try {
      const { instructor } = req.query;
      let paths;
      
      if (instructor) {
        paths = await storage.getLearningPathsByInstructor(parseInt(instructor as string));
      } else {
        paths = await storage.getLearningPaths();
      }
      
      res.json(paths);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/learning-paths/:id", async (req, res) => {
    try {
      const path = await storage.getLearningPath(parseInt(req.params.id));
      if (!path) return res.status(404).json({ error: "Learning path not found" });
      res.json(path);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/learning-paths", async (req, res) => {
    try {
      const pathData = insertLearningPathSchema.parse(req.body);
      const path = await storage.createLearningPath(pathData);
      res.status(201).json(path);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid learning path data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Mentor profiles routes
  app.get("/api/mentor-profiles", async (req, res) => {
    try {
      const { specialization } = req.query;
      let profiles;
      
      if (specialization) {
        profiles = await storage.getMentorProfilesBySpecialization(specialization as string);
      } else {
        profiles = await storage.getMentorProfiles();
      }
      
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/mentor-profiles/:userId", async (req, res) => {
    try {
      const profile = await storage.getMentorProfile(parseInt(req.params.userId));
      if (!profile) return res.status(404).json({ error: "Mentor profile not found" });
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/mentor-profiles", async (req, res) => {
    try {
      const profileData = insertMentorProfileSchema.parse(req.body);
      const profile = await storage.createMentorProfile(profileData);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid mentor profile data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Mentor application routes
  app.get("/api/mentor-applications", async (req, res) => {
    try {
      const { status } = req.query;
      let applications;
      
      if (status) {
        applications = await storage.getMentorApplicationsByStatus(status as string);
      } else {
        applications = await storage.getMentorApplications();
      }
      
      res.json(applications);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/mentor-applications/:id", async (req, res) => {
    try {
      const application = await storage.getMentorApplication(parseInt(req.params.id));
      if (!application) return res.status(404).json({ error: "Mentor application not found" });
      res.json(application);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/mentor-applications", async (req, res) => {
    try {
      const applicationData = insertMentorApplicationSchema.parse(req.body);
      const application = await storage.createMentorApplication(applicationData);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid mentor application data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/mentor-applications/:id/status", async (req, res) => {
    try {
      const { status, adminNotes, reviewedBy } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }

      const application = await storage.updateMentorApplicationStatus(
        parseInt(req.params.id),
        status,
        adminNotes,
        reviewedBy
      );
      
      if (!application) {
        return res.status(404).json({ error: "Mentor application not found" });
      }
      
      res.json(application);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Mentorship request routes
  app.get("/api/mentorship-requests", async (req, res) => {
    try {
      const { studentId, mentorId, status } = req.query;
      let requests;
      
      if (studentId) {
        requests = await storage.getMentorshipRequestsByStudent(parseInt(studentId as string));
      } else if (mentorId) {
        requests = await storage.getMentorshipRequestsByMentor(parseInt(mentorId as string));
      } else if (status) {
        requests = await storage.getMentorshipRequestsByStatus(status as string);
      } else {
        requests = await storage.getMentorshipRequests();
      }
      
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/mentorship-requests/:id", async (req, res) => {
    try {
      const request = await storage.getMentorshipRequest(parseInt(req.params.id));
      if (!request) return res.status(404).json({ error: "Mentorship request not found" });
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/mentorship-requests", async (req, res) => {
    try {
      const requestData = insertMentorshipRequestSchema.parse(req.body);
      const request = await storage.createMentorshipRequest(requestData);
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid mentorship request data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/mentorship-requests/:id/status", async (req, res) => {
    try {
      const { status, mentorResponse } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }

      const request = await storage.updateMentorshipRequestStatus(
        parseInt(req.params.id),
        status,
        mentorResponse
      );
      
      if (!request) {
        return res.status(404).json({ error: "Mentorship request not found" });
      }
      
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Mentor conversation routes
  app.get("/api/mentorship-requests/:id/conversations", async (req, res) => {
    try {
      const conversations = await storage.getMentorConversations(parseInt(req.params.id));
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/mentorship-requests/:id/conversations", async (req, res) => {
    try {
      const conversationData = insertMentorConversationSchema.parse({
        ...req.body,
        mentorshipRequestId: parseInt(req.params.id)
      });
      const conversation = await storage.createMentorConversation(conversationData);
      res.status(201).json(conversation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid conversation data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/conversations/:id/read", async (req, res) => {
    try {
      const conversation = await storage.markMessageAsRead(parseInt(req.params.id));
      if (!conversation) return res.status(404).json({ error: "Conversation not found" });
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Mentorship session routes
  app.get("/api/mentorship-requests/:id/sessions", async (req, res) => {
    try {
      const sessions = await storage.getMentorshipSessions(parseInt(req.params.id));
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/mentorship-sessions/:id", async (req, res) => {
    try {
      const session = await storage.getMentorshipSession(parseInt(req.params.id));
      if (!session) return res.status(404).json({ error: "Session not found" });
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/mentorship-sessions", async (req, res) => {
    try {
      const { mentorId, studentId } = req.query;
      let sessions;
      
      if (mentorId) {
        sessions = await storage.getMentorshipSessionsByMentor(parseInt(mentorId as string));
      } else if (studentId) {
        sessions = await storage.getMentorshipSessionsByStudent(parseInt(studentId as string));
      } else {
        return res.status(400).json({ error: "mentorId or studentId query parameter is required" });
      }
      
      res.json(sessions);
    } catch (error) {
      console.error('Error fetching mentorship sessions:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/mentorship-sessions", async (req, res) => {
    try {
      const sessionData = insertMentorshipSessionSchema.parse({
        ...req.body,
        status: 'scheduled'
      });
      const session = await storage.createMentorshipSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid session data", details: error.errors });
      }
      console.error('Error creating mentorship session:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/mentorship-sessions", async (req, res) => {
    try {
      const sessionData = insertMentorshipSessionSchema.parse(req.body);
      const session = await storage.createMentorshipSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid session data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/mentorship-sessions/:id", async (req, res) => {
    try {
      const session = await storage.updateMentorshipSession(
        parseInt(req.params.id),
        req.body
      );
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Master role request routes
  app.get("/api/master-role-requests", async (req, res) => {
    try {
      const status = req.query.status as string;
      let requests;
      
      if (status) {
        requests = await storage.getMasterRoleRequestsByStatus(status);
      } else {
        requests = await storage.getMasterRoleRequests();
      }
      
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/master-role-requests/:id", async (req, res) => {
    try {
      const request = await storage.getMasterRoleRequest(parseInt(req.params.id));
      if (!request) return res.status(404).json({ error: "Master role request not found" });
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/mentors/:mentorId/master-role-requests", async (req, res) => {
    try {
      const requests = await storage.getMasterRoleRequestsByMentor(parseInt(req.params.mentorId));
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/master-role-requests", async (req, res) => {
    try {
      const requestData = insertMasterRoleRequestSchema.parse(req.body);
      
      // Check if mentor already has a pending request
      const existingRequests = await storage.getMasterRoleRequestsByMentor(requestData.mentorId);
      const pendingRequest = existingRequests.find(r => r.status === 'pending');
      
      if (pendingRequest) {
        return res.status(409).json({ error: "You already have a pending master role request" });
      }
      
      const request = await storage.createMasterRoleRequest(requestData);
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/master-role-requests/:id/status", async (req, res) => {
    try {
      const { status, adminNotes, reviewedBy } = req.body;
      
      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: "Status must be 'approved' or 'rejected'" });
      }
      
      const request = await storage.updateMasterRoleRequestStatus(
        parseInt(req.params.id),
        status,
        adminNotes,
        reviewedBy
      );
      
      if (!request) {
        return res.status(404).json({ error: "Master role request not found" });
      }
      
      // If approved, promote the mentor to master
      if (status === 'approved') {
        await storage.promoteMentorToMaster(request.mentorId);
      }
      
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Staff request routes
  app.get("/api/staff-requests", async (req, res) => {
    try {
      const status = req.query.status as string;
      let requests;
      
      if (status) {
        requests = await storage.getStaffRequestsByStatus(status);
      } else {
        requests = await storage.getStaffRequests();
      }
      
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/staff-requests/:id", async (req, res) => {
    try {
      const request = await storage.getStaffRequest(parseInt(req.params.id));
      if (!request) return res.status(404).json({ error: "Staff request not found" });
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/mentors/:mentorId/staff-requests", async (req, res) => {
    try {
      const requests = await storage.getStaffRequestsByMentor(parseInt(req.params.mentorId));
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/classrooms/:classroomId/staff-requests", async (req, res) => {
    try {
      const requests = await storage.getStaffRequestsByClassroom(parseInt(req.params.classroomId));
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/staff-requests", async (req, res) => {
    try {
      const requestData = insertStaffRequestSchema.parse(req.body);
      
      // Check if mentor already has a pending request for this classroom
      const existingRequests = await storage.getStaffRequestsByMentor(requestData.mentorId);
      const pendingRequest = existingRequests.find(r => 
        r.classroomId === requestData.classroomId && r.status === 'pending'
      );
      
      if (pendingRequest) {
        return res.status(409).json({ error: "You already have a pending staff request for this classroom" });
      }
      
      const request = await storage.createStaffRequest(requestData);
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/staff-requests/:id/status", async (req, res) => {
    try {
      const { status, adminNotes, reviewedBy } = req.body;
      
      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: "Status must be 'approved' or 'rejected'" });
      }
      
      const request = await storage.updateStaffRequestStatus(
        parseInt(req.params.id),
        status,
        adminNotes,
        reviewedBy
      );
      
      if (!request) {
        return res.status(404).json({ error: "Staff request not found" });
      }
      
      // If approved, add mentor as staff to the classroom
      if (status === 'approved') {
        try {
          await storage.addStaffToClassroom(request.mentorId, request.classroomId);
        } catch (staffError: any) {
          return res.status(409).json({ error: staffError.message });
        }
      }
      
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get mentor's staff classroom
  app.get("/api/mentors/:id/staff-classroom", async (req, res) => {
    try {
      const classroom = await storage.getStaffClassroomByMentor(parseInt(req.params.id));
      if (!classroom) {
        return res.status(404).json({ error: "No staff classroom found for this mentor" });
      }
      res.json(classroom);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Resignation request routes
  app.get("/api/resignation-requests", async (req, res) => {
    try {
      const { status, classroomId } = req.query;
      
      let requests;
      if (status) {
        requests = await storage.getResignationRequestsByStatus(status as string);
      } else if (classroomId) {
        requests = await storage.getResignationRequestsByClassroom(parseInt(classroomId as string));
      } else {
        requests = await storage.getResignationRequests();
      }
      
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/mentors/:id/resignation-requests", async (req, res) => {
    try {
      const requests = await storage.getResignationRequestsByMentor(parseInt(req.params.id));
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/resignation-requests", async (req, res) => {
    try {
      const requestData = insertResignationRequestSchema.parse(req.body);
      
      // Check if mentor already has a pending resignation request
      const existingRequests = await storage.getResignationRequestsByMentor(requestData.mentorId);
      const pendingRequest = existingRequests.find(r => r.status === 'pending');
      
      if (pendingRequest) {
        return res.status(409).json({ error: "You already have a pending resignation request" });
      }
      
      const request = await storage.createResignationRequest(requestData);
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/resignation-requests/:id/status", async (req, res) => {
    try {
      const { status, masterNotes, reviewedBy } = req.body;
      
      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: "Status must be 'approved' or 'rejected'" });
      }
      
      const request = await storage.updateResignationRequestStatus(
        parseInt(req.params.id),
        status,
        masterNotes,
        reviewedBy
      );
      
      if (!request) {
        return res.status(404).json({ error: "Resignation request not found" });
      }
      
      // If approved, remove mentor from classroom staff
      if (status === 'approved') {
        try {
          await storage.removeStaffFromClassroom(request.mentorId, request.classroomId);
        } catch (removalError: any) {
          return res.status(500).json({ error: "Failed to remove staff from classroom" });
        }
      }
      
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Practice group routes
  app.get("/api/practice-groups", async (req, res) => {
    try {
      const groups = await storage.getPracticeGroups();
      res.json(groups);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/practice-groups/:id", async (req, res) => {
    try {
      const group = await storage.getPracticeGroup(parseInt(req.params.id));
      if (!group) return res.status(404).json({ error: "Practice group not found" });
      res.json(group);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/practice-groups", async (req, res) => {
    try {
      const groupData = insertPracticeGroupSchema.parse(req.body);
      const group = await storage.createPracticeGroup(groupData);
      res.status(201).json(group);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid practice group data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Forum routes
  app.get("/api/forum/categories", async (req, res) => {
    try {
      const categories = await storage.getForumCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/forum/topics", async (req, res) => {
    try {
      const { category } = req.query;
      let topics;
      
      if (category) {
        topics = await storage.getForumTopicsByCategory(parseInt(category as string));
      } else {
        topics = await storage.getForumTopics();
      }
      
      res.json(topics);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/forum/categories", async (req, res) => {
    try {
      const categoryData = insertForumCategorySchema.parse(req.body);
      const category = await storage.createForumCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid forum category data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/forum/topics", async (req, res) => {
    try {
      const topicData = insertForumTopicSchema.parse(req.body);
      const topic = await storage.createForumTopic(topicData);
      res.status(201).json(topic);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid forum topic data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Event routes
  app.get("/api/events", async (req, res) => {
    try {
      const { instructor, upcoming } = req.query;
      let events;
      
      if (instructor) {
        events = await storage.getEventsByInstructor(parseInt(instructor as string));
      } else if (upcoming === 'true') {
        events = await storage.getUpcomingEvents();
      } else {
        events = await storage.getEvents();
      }
      
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(parseInt(req.params.id));
      if (!event) return res.status(404).json({ error: "Event not found" });
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid event data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Mentor profile routes
  app.get("/api/mentors", async (req, res) => {
    try {
      const { specialization } = req.query;
      let mentors;
      
      if (specialization) {
        mentors = await storage.getMentorProfilesBySpecialization(specialization as string);
      } else {
        mentors = await storage.getMentorProfiles();
      }
      
      res.json(mentors);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/mentors", async (req, res) => {
    try {
      const mentors = await storage.getMentorProfiles();
      res.json(mentors);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/mentors/:userId", async (req, res) => {
    try {
      const mentor = await storage.getMentorProfile(parseInt(req.params.userId));
      if (!mentor) return res.status(404).json({ error: "Mentor profile not found" });
      res.json(mentor);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/mentors", async (req, res) => {
    try {
      const mentorData = insertMentorProfileSchema.parse(req.body);
      const mentor = await storage.createMentorProfile(mentorData);
      res.status(201).json(mentor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid mentor profile data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Course review routes
  app.get("/api/courses/:courseId/reviews", async (req, res) => {
    try {
      const reviews = await storage.getCourseReviews(parseInt(req.params.courseId));
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/course-reviews", async (req, res) => {
    try {
      const reviewData = insertCourseReviewSchema.parse(req.body);
      const review = await storage.createCourseReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid course review data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Achievement routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/users/:userId/achievements", async (req, res) => {
    try {
      const achievements = await storage.getUserAchievements(parseInt(req.params.userId));
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/user-achievements", async (req, res) => {
    try {
      const achievementData = insertUserAchievementSchema.parse(req.body);
      const achievement = await storage.createUserAchievement(achievementData);
      res.status(201).json(achievement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid user achievement data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Schedule/Timetable routes
  app.get("/api/schedules", async (req, res) => {
    try {
      const { classroomId, instructorId, dayOfWeek } = req.query;
      
      if (classroomId) {
        const schedules = await storage.getSchedulesByClassroom(parseInt(classroomId as string));
        res.json(schedules);
      } else if (instructorId) {
        const schedules = await storage.getSchedulesByInstructor(parseInt(instructorId as string));
        res.json(schedules);
      } else if (dayOfWeek) {
        const schedules = await storage.getSchedulesByDay(parseInt(dayOfWeek as string));
        res.json(schedules);
      } else {
        const schedules = await storage.getSchedules();
        res.json(schedules);
      }
    } catch (error) {
      console.error("Get schedules error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/schedules", async (req, res) => {
    try {
      const scheduleData = insertScheduleSchema.parse(req.body);
      const schedule = await storage.createSchedule(scheduleData);
      res.status(201).json(schedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid schedule data", details: error.errors });
      }
      if (error instanceof Error && error.message.includes('conflict')) {
        return res.status(409).json({ error: error.message });
      }
      console.error("Create schedule error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/schedules/check-availability", async (req, res) => {
    try {
      const { instructorId, dayOfWeek, startTime, endTime, excludeScheduleId } = req.body;
      
      const isAvailable = await storage.checkInstructorAvailability(
        instructorId,
        dayOfWeek,
        startTime,
        endTime,
        excludeScheduleId
      );
      
      res.json({ available: isAvailable });
    } catch (error) {
      console.error("Check availability error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/schedule-enrollments", async (req, res) => {
    try {
      const enrollmentData = insertScheduleEnrollmentSchema.parse(req.body);
      const enrollment = await storage.enrollStudentInSchedule(enrollmentData);
      res.status(201).json(enrollment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid enrollment data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
