import { pgTable, text, serial, integer, boolean, timestamp, numeric, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table with role-based access
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("student"), // student, mentor, admin
  isMaster: boolean("is_master").default(false), // true if mentor has been promoted to master
  firstName: text("first_name"),
  lastName: text("last_name"),
  avatar: text("avatar"),
  bio: text("bio"),
  xp: integer("xp").default(0),
  level: integer("level").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// Courses table
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // piano, guitar, vocals, etc.
  level: text("level").notNull(), // beginner, intermediate, advanced
  price: numeric("price", { precision: 10, scale: 2 }),
  duration: integer("duration"), // in minutes
  mentorId: integer("mentor_id").references(() => users.id),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  // Enhanced course management fields
  status: text("status").default("draft"), // draft, pending, approved, rejected, published, archived
  approvedBy: integer("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  rejectedAt: timestamp("rejected_at"),
  adminNotes: text("admin_notes"),
  syllabus: text("syllabus"), // Detailed course syllabus
  prerequisites: text("prerequisites").array(), // Array of prerequisites
  learningObjectives: text("learning_objectives").array(), // Array of learning objectives
  targetAudience: text("target_audience"),
  difficulty: integer("difficulty").default(1), // 1-10 difficulty scale
  estimatedWeeks: integer("estimated_weeks"), // Course duration in weeks
  maxStudents: integer("max_students").default(100), // Maximum enrollment
  currentEnrollments: integer("current_enrollments").default(0),
  averageRating: numeric("average_rating", { precision: 3, scale: 2 }).default("0.00"),
  totalRatings: integer("total_ratings").default(0),
  totalRevenue: numeric("total_revenue", { precision: 12, scale: 2 }).default("0.00"),
  tags: text("tags").array(), // Course tags for better searchability
  createdAt: timestamp("created_at").defaultNow(),
});

// Classrooms table - enhanced for academy-style customizable classrooms
export const classrooms = pgTable("classrooms", {
  id: serial("id").primaryKey(),
  // Legacy required fields for backwards compatibility
  title: text("title").notNull(), // Required legacy field
  subject: text("subject").notNull(), // Required legacy field
  level: text("level").notNull(), // Required legacy field
  description: text("description"),
  masterId: integer("master_id").references(() => users.id),
  maxStudents: integer("max_students").default(50),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  // New academy fields
  academyName: text("academy_name"), // Name of the academy/classroom
  about: text("about"), // Detailed about section for landing page
  instruments: text("instruments").array(), // Array of instruments taught
  curriculum: text("curriculum"), // Detailed curriculum description
  // Landing page customization
  heroImage: text("hero_image"), // Main image for landing page
  logoImage: text("logo_image"), // Academy logo
  aboutImage: text("about_image"), // Image for about section
  primaryColor: text("primary_color").default("#3B82F6"), // Theme color
  secondaryColor: text("secondary_color").default("#10B981"), // Secondary theme color
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  website: text("website"),
  socialLinks: text("social_links"), // JSON string of social media links
  features: text("features").array(), // Array of key features/highlights
  testimonials: text("testimonials"), // JSON string of student testimonials
  pricing: text("pricing"), // JSON string of pricing tiers
  schedule: text("schedule"), // JSON string of class schedules
  address: text("address"), // Physical address if applicable
  isPublic: boolean("is_public").default(true), // Whether landing page is publicly accessible
  customSlug: text("custom_slug").unique(), // Custom URL slug for sharing
});

// Enrollments table (many-to-many between users and courses)
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  courseId: integer("course_id").references(() => courses.id),
  progress: integer("progress").default(0), // percentage 0-100
  completedAt: timestamp("completed_at"),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  // Enhanced enrollment tracking
  status: text("status").default("active"), // active, paused, completed, dropped
  lastAccessedAt: timestamp("last_accessed_at"),
  totalTimeSpent: integer("total_time_spent").default(0), // in minutes
  currentLesson: integer("current_lesson").default(1),
  completedLessons: integer("completed_lessons").default(0),
  certificateIssued: boolean("certificate_issued").default(false),
  certificateIssuedAt: timestamp("certificate_issued_at"),
  enrollmentNotes: text("enrollment_notes"), // Student or mentor notes
  paymentStatus: text("payment_status").default("pending"), // pending, paid, refunded
  paymentAmount: numeric("payment_amount", { precision: 10, scale: 2 }),
  refundAmount: numeric("refund_amount", { precision: 10, scale: 2 }),
});

// Classroom memberships (many-to-many between users and classrooms)
export const classroomMemberships = pgTable("classroom_memberships", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  classroomId: integer("classroom_id").references(() => classrooms.id),
  role: text("role").notNull().default("student"), // master, staff, student
  status: text("status").default("active"), // active, pending, removed
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Staff requests for classrooms (mentors requesting to join as staff)
export const staffRequests = pgTable("staff_requests", {
  id: serial("id").primaryKey(),
  mentorId: integer("mentor_id").references(() => users.id).notNull(),
  classroomId: integer("classroom_id").references(() => classrooms.id).notNull(),
  message: text("message"), // optional message from mentor
  status: text("status").default("pending"), // pending, approved, rejected
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  adminNotes: text("admin_notes"), // notes from master during review
  createdAt: timestamp("created_at").defaultNow(),
});

export const resignationRequests = pgTable("resignation_requests", {
  id: serial("id").primaryKey(),
  mentorId: integer("mentor_id").references(() => users.id).notNull(),
  classroomId: integer("classroom_id").references(() => classrooms.id).notNull(),
  reason: text("reason"), // reason for resignation
  status: text("status").default("pending"), // pending, approved, rejected
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  masterNotes: text("master_notes"), // notes from master during review
  createdAt: timestamp("created_at").defaultNow(),
});

// Course Waitlist - for courses that are full or not yet available
export const courseWaitlist = pgTable("course_waitlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  priority: integer("priority").default(1), // 1 = highest priority
  status: text("status").default("waiting"), // waiting, notified, enrolled, expired
  notifiedAt: timestamp("notified_at"),
  expiresAt: timestamp("expires_at"),
  joinedWaitlistAt: timestamp("joined_waitlist_at").defaultNow(),
});

// Course Analytics - for tracking course performance and engagement
export const courseAnalytics = pgTable("course_analytics", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  date: timestamp("date").defaultNow(),
  // Daily metrics
  newEnrollments: integer("new_enrollments").default(0),
  completions: integer("completions").default(0),
  dropouts: integer("dropouts").default(0),
  totalActiveStudents: integer("total_active_students").default(0),
  averageSessionDuration: integer("average_session_duration").default(0), // in minutes
  totalRevenue: numeric("total_revenue", { precision: 10, scale: 2 }).default("0.00"),
  // Engagement metrics
  forumPosts: integer("forum_posts").default(0),
  questionsAsked: integer("questions_asked").default(0),
  lessonsCompleted: integer("lessons_completed").default(0),
  averageRating: numeric("average_rating", { precision: 3, scale: 2 }).default("0.00"),
});

// Live sessions table
export const liveSessions = pgTable("live_sessions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  mentorId: integer("mentor_id").references(() => users.id),
  classroomId: integer("classroom_id").references(() => classrooms.id),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").default(60), // in minutes
  maxParticipants: integer("max_participants").default(20),
  status: text("status").default("scheduled"), // scheduled, live, completed, cancelled
  recordingUrl: text("recording_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Community posts table
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title"),
  content: text("content").notNull(),
  type: text("type").default("general"), // general, achievement, question, showcase
  audioFile: text("audio_file"), // for audio recordings
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  tags: text("tags").array(), // array of tags
  createdAt: timestamp("created_at").defaultNow(),
});

// Learning paths table
export const learningPaths = pgTable("learning_paths", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  duration: text("duration"), // e.g., "6 months"
  lessonsCount: integer("lessons_count").default(0),
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced, all-levels
  price: text("price").default("Free"), // e.g., "$29/month", "Free"
  rating: numeric("rating", { precision: 3, scale: 2 }).default("0"),
  enrolledCount: integer("enrolled_count").default(0),
  instructorId: integer("instructor_id").references(() => users.id),
  imageUrl: text("image_url"),
  skills: text("skills").array(), // array of skills learned
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Practice groups table
export const practiceGroups = pgTable("practice_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  instrument: text("instrument"), // Mixed, Piano, Guitar, etc.
  membersCount: integer("members_count").default(0),
  maxMembers: integer("max_members").default(50),
  nextSession: timestamp("next_session"),
  createdById: integer("created_by_id").references(() => users.id),
  imageEmoji: text("image_emoji").default("🎵"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Practice group memberships
export const practiceGroupMemberships = pgTable("practice_group_memberships", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  groupId: integer("group_id").references(() => practiceGroups.id),
  role: text("role").default("member"), // member, moderator, admin
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Forum categories and topics
export const forumCategories = pgTable("forum_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon").default("🎵"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
});

export const forumTopics = pgTable("forum_topics", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => forumCategories.id),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon").default("🎵"),
  postsCount: integer("posts_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Events table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // workshop, masterclass, concert, community-event
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  location: text("location"), // online, venue name, etc.
  maxAttendees: integer("max_attendees"),
  currentAttendees: integer("current_attendees").default(0),
  price: numeric("price", { precision: 10, scale: 2 }),
  instructorId: integer("instructor_id").references(() => users.id),
  imageUrl: text("image_url"),
  isOnline: boolean("is_online").default(true),
  meetingLink: text("meeting_link"),
  status: text("status").default("upcoming"), // upcoming, live, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

// Event registrations
export const eventRegistrations = pgTable("event_registrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  eventId: integer("event_id").references(() => events.id),
  status: text("status").default("registered"), // registered, attended, cancelled
  registeredAt: timestamp("registered_at").defaultNow(),
});

// Course reviews and ratings
export const courseReviews = pgTable("course_reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  courseId: integer("course_id").references(() => courses.id),
  rating: integer("rating").notNull(), // 1-5 stars
  title: text("title"),
  content: text("content"),
  isVerified: boolean("is_verified").default(false), // verified purchase
  helpfulVotes: integer("helpful_votes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Mentor profiles (extended user data for mentors)
export const mentorProfiles = pgTable("mentor_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  specialization: text("specialization"),
  experience: text("experience"), // e.g., "15+ years"
  hourlyRate: text("hourly_rate"), // e.g., "$75"
  location: text("location"),
  languages: text("languages").array(),
  badges: text("badges").array(),
  bio: text("bio"),
  availability: text("availability").default("Available"), // Available, Busy, Offline
  totalStudents: integer("total_students").default(0),
  totalReviews: integer("total_reviews").default(0),
  averageRating: numeric("average_rating", { precision: 3, scale: 2 }).default("0"),
  nextAvailableSession: timestamp("next_available_session"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Achievements and badges
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon").default("🏆"),
  category: text("category"), // skill, progress, social, special
  requirements: text("requirements"), // JSON string describing requirements
  xpReward: integer("xp_reward").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User achievements
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  achievementId: integer("achievement_id").references(() => achievements.id),
  earnedAt: timestamp("earned_at").defaultNow(),
});

// Course lessons (for detailed course structure)
export const courseLessons = pgTable("course_lessons", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id),
  title: text("title").notNull(),
  description: text("description"),
  videoUrl: text("video_url"),
  duration: integer("duration"), // in minutes
  sortOrder: integer("sort_order").default(0),
  isPreview: boolean("is_preview").default(false),
  resources: text("resources").array(), // array of resource URLs
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User lesson progress
export const lessonProgress = pgTable("lesson_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  lessonId: integer("lesson_id").references(() => courseLessons.id),
  isCompleted: boolean("is_completed").default(false),
  watchTime: integer("watch_time").default(0), // in seconds
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Post comments
export const postComments = pgTable("post_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => posts.id),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  parentCommentId: integer("parent_comment_id"), // self-reference for nested comments
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// User follows (for social features)
export const userFollows = pgTable("user_follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").references(() => users.id),
  followedId: integer("followed_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Mentor applications (for mentor verification process)
export const mentorApplications = pgTable("mentor_applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  specialization: text("specialization").notNull(),
  experience: text("experience").notNull(),
  bio: text("bio").notNull(),
  credentials: text("credentials"), // education, certifications
  portfolio: text("portfolio"), // links to work samples
  status: text("status").default("pending"), // pending, approved, rejected
  adminNotes: text("admin_notes"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Mentorship requests (student-mentor connection requests)
export const mentorshipRequests = pgTable("mentorship_requests", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => users.id).notNull(),
  mentorId: integer("mentor_id").references(() => users.id).notNull(),
  message: text("message"), // initial request message from student
  status: text("status").default("pending"), // pending, accepted, rejected, cancelled
  acceptedAt: timestamp("accepted_at"),
  rejectedAt: timestamp("rejected_at"),
  mentorResponse: text("mentor_response"), // response message from mentor
  createdAt: timestamp("created_at").defaultNow(),
});

// Mentor-student conversations (chat messages)
export const mentorConversations = pgTable("mentor_conversations", {
  id: serial("id").primaryKey(),
  mentorshipRequestId: integer("mentorship_request_id").references(() => mentorshipRequests.id).notNull(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  messageType: text("message_type").default("text"), // text, image, audio, file
  attachmentUrl: text("attachment_url"), // for file/image/audio messages
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Mentorship sessions (scheduled 1-on-1 sessions)
export const mentorshipSessions = pgTable("mentorship_sessions", {
  id: serial("id").primaryKey(),
  mentorshipRequestId: integer("mentorship_request_id").references(() => mentorshipRequests.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").default(60), // in minutes
  status: text("status").default("scheduled"), // scheduled, completed, cancelled, no-show
  meetingLink: text("meeting_link"),
  recordingUrl: text("recording_url"),
  mentorNotes: text("mentor_notes"), // private notes for mentor
  studentNotes: text("student_notes"), // private notes for student
  sessionFeedback: text("session_feedback"), // post-session feedback
  rating: integer("rating"), // 1-5 stars from student
  createdAt: timestamp("created_at").defaultNow(),
});

// Master role requests (mentor requests to become master)
export const masterRoleRequests = pgTable("master_role_requests", {
  id: serial("id").primaryKey(),
  mentorId: integer("mentor_id").references(() => users.id).notNull(),
  reason: text("reason").notNull(), // why they want to become a master
  experience: text("experience").notNull(), // teaching/classroom management experience
  plannedClassrooms: text("planned_classrooms"), // description of planned classrooms
  additionalQualifications: text("additional_qualifications"), // extra credentials or experience
  status: text("status").default("pending"), // pending, approved, rejected
  adminNotes: text("admin_notes"), // notes from admin during review
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  approvedAt: timestamp("approved_at"),
  rejectedAt: timestamp("rejected_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  courses: many(courses),
  enrollments: many(enrollments),
  classrooms: many(classrooms),
  classroomMemberships: many(classroomMemberships),
  liveSessions: many(liveSessions),
  posts: many(posts),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  mentor: one(users, {
    fields: [courses.mentorId],
    references: [users.id],
  }),
  approver: one(users, {
    fields: [courses.approvedBy],
    references: [users.id],
  }),
  enrollments: many(enrollments),
  reviews: many(courseReviews),
  waitlist: many(courseWaitlist),
  analytics: many(courseAnalytics),
}));

export const courseWaitlistRelations = relations(courseWaitlist, ({ one }) => ({
  user: one(users, {
    fields: [courseWaitlist.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [courseWaitlist.courseId],
    references: [courses.id],
  }),
}));

export const courseAnalyticsRelations = relations(courseAnalytics, ({ one }) => ({
  course: one(courses, {
    fields: [courseAnalytics.courseId],
    references: [courses.id],
  }),
}));

export const classroomsRelations = relations(classrooms, ({ one, many }) => ({
  master: one(users, {
    fields: [classrooms.masterId],
    references: [users.id],
  }),
  memberships: many(classroomMemberships),
  liveSessions: many(liveSessions),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, {
    fields: [enrollments.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));

export const classroomMembershipsRelations = relations(classroomMemberships, ({ one }) => ({
  user: one(users, {
    fields: [classroomMemberships.userId],
    references: [users.id],
  }),
  classroom: one(classrooms, {
    fields: [classroomMemberships.classroomId],
    references: [classrooms.id],
  }),
}));

export const liveSessionsRelations = relations(liveSessions, ({ one }) => ({
  mentor: one(users, {
    fields: [liveSessions.mentorId],
    references: [users.id],
  }),
  classroom: one(classrooms, {
    fields: [liveSessions.classroomId],
    references: [classrooms.id],
  }),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}));

export const masterRoleRequestsRelations = relations(masterRoleRequests, ({ one }) => ({
  mentor: one(users, {
    fields: [masterRoleRequests.mentorId],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [masterRoleRequests.reviewedBy],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
});

export const insertClassroomSchema = createInsertSchema(classrooms).omit({
  id: true,
  createdAt: true,
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  enrolledAt: true,
});

export const insertClassroomMembershipSchema = createInsertSchema(classroomMemberships).omit({
  id: true,
  joinedAt: true,
});

export const insertLiveSessionSchema = createInsertSchema(liveSessions).omit({
  id: true,
  createdAt: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
});

export const insertMasterRoleRequestSchema = createInsertSchema(masterRoleRequests).omit({
  id: true,
  createdAt: true,
  reviewedBy: true,
  reviewedAt: true,
  approvedAt: true,
  rejectedAt: true,
  adminNotes: true,
});

export const insertStaffRequestSchema = createInsertSchema(staffRequests).omit({
  id: true,
  createdAt: true,
  reviewedBy: true,
  reviewedAt: true,
  adminNotes: true,
});

export const insertResignationRequestSchema = createInsertSchema(resignationRequests).omit({
  id: true,
  createdAt: true,
  reviewedBy: true,
  reviewedAt: true,
  masterNotes: true,
});

export const insertCourseWaitlistSchema = createInsertSchema(courseWaitlist).omit({
  id: true,
  joinedWaitlistAt: true,
  notifiedAt: true,
});

export const insertCourseAnalyticsSchema = createInsertSchema(courseAnalytics).omit({
  id: true,
  date: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Enrollment = typeof enrollments.$inferSelect;
export type InsertCourseWaitlist = z.infer<typeof insertCourseWaitlistSchema>;
export type CourseWaitlist = typeof courseWaitlist.$inferSelect;
export type InsertCourseAnalytics = z.infer<typeof insertCourseAnalyticsSchema>;
export type CourseAnalytics = typeof courseAnalytics.$inferSelect;
export type InsertMasterRoleRequest = z.infer<typeof insertMasterRoleRequestSchema>;
export type MasterRoleRequest = typeof masterRoleRequests.$inferSelect;
export type InsertStaffRequest = z.infer<typeof insertStaffRequestSchema>;
export type StaffRequest = typeof staffRequests.$inferSelect;
export type InsertResignationRequest = z.infer<typeof insertResignationRequestSchema>;
export type ResignationRequest = typeof resignationRequests.$inferSelect;

// Timetable/Schedule tables
export const schedules = pgTable("schedules", {
  id: serial("id").primaryKey(),
  classroomId: integer("classroom_id").references(() => classrooms.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  dayOfWeek: integer("day_of_week").notNull(), // 0=Sunday, 1=Monday, etc.
  startTime: text("start_time").notNull(), // HH:MM format
  endTime: text("end_time").notNull(), // HH:MM format
  instructorId: integer("instructor_id").references(() => users.id).notNull(),
  subject: text("subject"),
  sessionType: text("session_type").default("class"), // class, practice, exam, etc.
  maxStudents: integer("max_students").default(50),
  isRecurring: boolean("is_recurring").default(true),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const scheduleEnrollments = pgTable("schedule_enrollments", {
  id: serial("id").primaryKey(),
  scheduleId: integer("schedule_id").references(() => schedules.id).notNull(),
  studentId: integer("student_id").references(() => users.id).notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  status: text("status").default("active"), // active, dropped, completed
});

export const scheduleNotifications = pgTable("schedule_notifications", {
  id: serial("id").primaryKey(),
  scheduleId: integer("schedule_id").references(() => schedules.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  notificationType: text("notification_type").notNull(), // upcoming_session, session_changed, etc.
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  sentAt: timestamp("sent_at").defaultNow(),
});

// Schedule conflicts tracking
export const scheduleConflicts = pgTable("schedule_conflicts", {
  id: serial("id").primaryKey(),
  instructorId: integer("instructor_id").references(() => users.id).notNull(),
  scheduleId1: integer("schedule_id_1").references(() => schedules.id).notNull(),
  scheduleId2: integer("schedule_id_2").references(() => schedules.id).notNull(),
  conflictType: text("conflict_type").notNull(), // time_overlap, double_booking
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas for timetable tables
export const insertScheduleSchema = createInsertSchema(schedules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertScheduleEnrollmentSchema = createInsertSchema(scheduleEnrollments).omit({
  id: true,
  enrolledAt: true,
});

export const insertScheduleNotificationSchema = createInsertSchema(scheduleNotifications).omit({
  id: true,
  sentAt: true,
});

export const insertScheduleConflictSchema = createInsertSchema(scheduleConflicts).omit({
  id: true,
  createdAt: true,
});

// Types for timetable tables
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;
export type Schedule = typeof schedules.$inferSelect;

export type InsertScheduleEnrollment = z.infer<typeof insertScheduleEnrollmentSchema>;
export type ScheduleEnrollment = typeof scheduleEnrollments.$inferSelect;

export type InsertScheduleNotification = z.infer<typeof insertScheduleNotificationSchema>;
export type ScheduleNotification = typeof scheduleNotifications.$inferSelect;

export type InsertScheduleConflict = z.infer<typeof insertScheduleConflictSchema>;
export type ScheduleConflict = typeof scheduleConflicts.$inferSelect;

export type InsertClassroom = z.infer<typeof insertClassroomSchema>;
export type Classroom = typeof classrooms.$inferSelect;

export type InsertClassroomMembership = z.infer<typeof insertClassroomMembershipSchema>;
export type ClassroomMembership = typeof classroomMemberships.$inferSelect;

export type InsertLiveSession = z.infer<typeof insertLiveSessionSchema>;
export type LiveSession = typeof liveSessions.$inferSelect;

export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;

// Additional insert schemas for new tables
export const insertLearningPathSchema = createInsertSchema(learningPaths).omit({
  id: true,
  createdAt: true,
});

export const insertPracticeGroupSchema = createInsertSchema(practiceGroups).omit({
  id: true,
  createdAt: true,
});

export const insertPracticeGroupMembershipSchema = createInsertSchema(practiceGroupMemberships).omit({
  id: true,
  joinedAt: true,
});

export const insertForumCategorySchema = createInsertSchema(forumCategories).omit({
  id: true,
});

export const insertForumTopicSchema = createInsertSchema(forumTopics).omit({
  id: true,
  createdAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
});

export const insertEventRegistrationSchema = createInsertSchema(eventRegistrations).omit({
  id: true,
  registeredAt: true,
});

export const insertCourseReviewSchema = createInsertSchema(courseReviews).omit({
  id: true,
  createdAt: true,
});

export const insertMentorProfileSchema = createInsertSchema(mentorProfiles).omit({
  id: true,
  createdAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  earnedAt: true,
});

export const insertCourseLessonSchema = createInsertSchema(courseLessons).omit({
  id: true,
  createdAt: true,
});

export const insertLessonProgressSchema = createInsertSchema(lessonProgress).omit({
  id: true,
  createdAt: true,
});

export const insertPostCommentSchema = createInsertSchema(postComments).omit({
  id: true,
  createdAt: true,
});

export const insertUserFollowSchema = createInsertSchema(userFollows).omit({
  id: true,
  createdAt: true,
});

export const insertMentorApplicationSchema = createInsertSchema(mentorApplications).omit({
  id: true,
  createdAt: true,
  reviewedAt: true,
});

export const insertMentorshipRequestSchema = createInsertSchema(mentorshipRequests).omit({
  id: true,
  createdAt: true,
  acceptedAt: true,
  rejectedAt: true,
});

export const insertMentorConversationSchema = createInsertSchema(mentorConversations).omit({
  id: true,
  createdAt: true,
  readAt: true,
});

export const insertMentorshipSessionSchema = createInsertSchema(mentorshipSessions).omit({
  id: true,
  createdAt: true,
});

// Additional types for new tables
export type InsertLearningPath = z.infer<typeof insertLearningPathSchema>;
export type LearningPath = typeof learningPaths.$inferSelect;

export type InsertPracticeGroup = z.infer<typeof insertPracticeGroupSchema>;
export type PracticeGroup = typeof practiceGroups.$inferSelect;

export type InsertPracticeGroupMembership = z.infer<typeof insertPracticeGroupMembershipSchema>;
export type PracticeGroupMembership = typeof practiceGroupMemberships.$inferSelect;

export type InsertForumCategory = z.infer<typeof insertForumCategorySchema>;
export type ForumCategory = typeof forumCategories.$inferSelect;

export type InsertForumTopic = z.infer<typeof insertForumTopicSchema>;
export type ForumTopic = typeof forumTopics.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export type InsertEventRegistration = z.infer<typeof insertEventRegistrationSchema>;
export type EventRegistration = typeof eventRegistrations.$inferSelect;

export type InsertCourseReview = z.infer<typeof insertCourseReviewSchema>;
export type CourseReview = typeof courseReviews.$inferSelect;

export type InsertMentorProfile = z.infer<typeof insertMentorProfileSchema>;
export type MentorProfile = typeof mentorProfiles.$inferSelect;

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;

export type InsertCourseLesson = z.infer<typeof insertCourseLessonSchema>;
export type CourseLesson = typeof courseLessons.$inferSelect;

export type InsertLessonProgress = z.infer<typeof insertLessonProgressSchema>;
export type LessonProgress = typeof lessonProgress.$inferSelect;

export type InsertPostComment = z.infer<typeof insertPostCommentSchema>;
export type PostComment = typeof postComments.$inferSelect;

export type InsertUserFollow = z.infer<typeof insertUserFollowSchema>;
export type UserFollow = typeof userFollows.$inferSelect;

export type InsertMentorApplication = z.infer<typeof insertMentorApplicationSchema>;
export type MentorApplication = typeof mentorApplications.$inferSelect;

export type InsertMentorshipRequest = z.infer<typeof insertMentorshipRequestSchema>;
export type MentorshipRequest = typeof mentorshipRequests.$inferSelect;

export type InsertMentorConversation = z.infer<typeof insertMentorConversationSchema>;
export type MentorConversation = typeof mentorConversations.$inferSelect;

export type InsertMentorshipSession = z.infer<typeof insertMentorshipSessionSchema>;
export type MentorshipSession = typeof mentorshipSessions.$inferSelect;
