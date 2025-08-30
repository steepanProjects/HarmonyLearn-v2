import { prisma } from './prisma.js';
import { 
  insertUserSchema, 
  insertCourseSchema, 
  insertClassroomSchema,
  type InsertUser,
  type InsertCourse,
  type InsertClassroom
} from '../shared/types.ts';

// User operations
export const getUsers = async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });
};

export const getUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      mentorProfiles: true,
      courses: true,
      enrollments: {
        include: {
          course: true
        }
      }
    }
  });
};

export const getUserByUsername = async (username: string) => {
  return prisma.user.findUnique({
    where: { username }
  });
};

export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email }
  });
};

export const createUser = async (userData: InsertUser) => {
  const validatedData = insertUserSchema.parse(userData);
  return prisma.user.create({
    data: validatedData
  });
};

export const updateUser = async (id: number, userData: Partial<InsertUser>) => {
  return prisma.user.update({
    where: { id },
    data: userData
  });
};

export const deleteUser = async (id: number) => {
  return prisma.user.delete({
    where: { id }
  });
};

// Course operations
export const getCourses = async () => {
  return prisma.course.findMany({
    include: {
      mentor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      enrollments: true,
      _count: {
        select: { enrollments: true, reviews: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const getCourseById = async (id: number) => {
  return prisma.course.findUnique({
    where: { id },
    include: {
      mentor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      enrollments: {
        include: {
          user: {
            select: { id: true, username: true, firstName: true, lastName: true }
          }
        }
      },
      reviews: {
        include: {
          user: {
            select: { id: true, username: true, firstName: true, lastName: true }
          }
        }
      },
      lessons: {
        orderBy: { sortOrder: 'asc' }
      }
    }
  });
};

export const createCourse = async (courseData: InsertCourse) => {
  const validatedData = insertCourseSchema.parse(courseData);
  return prisma.course.create({
    data: validatedData,
    include: {
      mentor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      }
    }
  });
};

export const updateCourse = async (id: number, courseData: Partial<InsertCourse>) => {
  return prisma.course.update({
    where: { id },
    data: courseData,
    include: {
      mentor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      }
    }
  });
};

export const deleteCourse = async (id: number) => {
  return prisma.course.delete({
    where: { id }
  });
};

// Classroom operations
export const getClassrooms = async () => {
  return prisma.classroom.findMany({
    include: {
      master: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      memberships: {
        include: {
          user: {
            select: { id: true, username: true, firstName: true, lastName: true, role: true }
          }
        }
      },
      _count: {
        select: { memberships: true, liveSessions: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const getClassroomById = async (id: number) => {
  return prisma.classroom.findUnique({
    where: { id },
    include: {
      master: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      memberships: {
        include: {
          user: {
            select: { id: true, username: true, firstName: true, lastName: true, role: true }
          }
        }
      },
      liveSessions: {
        include: {
          mentor: {
            select: { id: true, username: true, firstName: true, lastName: true }
          }
        },
        orderBy: { scheduledAt: 'desc' }
      },
      schedules: {
        include: {
          instructor: {
            select: { id: true, username: true, firstName: true, lastName: true }
          }
        },
        orderBy: { dayOfWeek: 'asc' }
      }
    }
  });
};

export const createClassroom = async (classroomData: InsertClassroom) => {
  const validatedData = insertClassroomSchema.parse(classroomData);
  return prisma.classroom.create({
    data: validatedData,
    include: {
      master: {
        select: { id: true, username: true, firstName: true, lastName: true }
      }
    }
  });
};

export const updateClassroom = async (id: number, classroomData: Partial<InsertClassroom>) => {
  return prisma.classroom.update({
    where: { id },
    data: classroomData,
    include: {
      master: {
        select: { id: true, username: true, firstName: true, lastName: true }
      }
    }
  });
};

export const deleteClassroom = async (id: number) => {
  return prisma.classroom.delete({
    where: { id }
  });
};

// Enrollment operations
export const getEnrollments = async () => {
  return prisma.enrollment.findMany({
    include: {
      user: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      course: {
        select: { id: true, title: true, category: true, level: true }
      }
    },
    orderBy: { enrolledAt: 'desc' }
  });
};

export const getEnrollmentsByUserId = async (userId: number) => {
  return prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          mentor: {
            select: { id: true, username: true, firstName: true, lastName: true }
          }
        }
      }
    },
    orderBy: { enrolledAt: 'desc' }
  });
};

export const getEnrollmentsByCourseId = async (courseId: number) => {
  return prisma.enrollment.findMany({
    where: { courseId },
    include: {
      user: {
        select: { id: true, username: true, firstName: true, lastName: true }
      }
    },
    orderBy: { enrolledAt: 'desc' }
  });
};

export const createEnrollment = async (userId: number, courseId: number) => {
  return prisma.enrollment.create({
    data: {
      userId,
      courseId
    },
    include: {
      user: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      course: {
        select: { id: true, title: true, category: true, level: true }
      }
    }
  });
};

export const updateEnrollment = async (id: number, data: { progress?: number; status?: string }) => {
  return prisma.enrollment.update({
    where: { id },
    data,
    include: {
      user: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      course: {
        select: { id: true, title: true, category: true, level: true }
      }
    }
  });
};

export const deleteEnrollment = async (id: number) => {
  return prisma.enrollment.delete({
    where: { id }
  });
};

// Classroom membership operations
export const getClassroomMemberships = async (classroomId?: number, role?: string) => {
  const where: any = {};
  if (classroomId) where.classroomId = classroomId;
  if (role) where.role = role;

  return prisma.classroomMembership.findMany({
    where,
    include: {
      user: {
        select: { id: true, username: true, firstName: true, lastName: true, role: true }
      },
      classroom: {
        select: { id: true, title: true, academyName: true }
      }
    },
    orderBy: { joinedAt: 'desc' }
  });
};

export const createClassroomMembership = async (userId: number, classroomId: number, role: string = "student") => {
  return prisma.classroomMembership.create({
    data: {
      userId,
      classroomId,
      role
    },
    include: {
      user: {
        select: { id: true, username: true, firstName: true, lastName: true, role: true }
      },
      classroom: {
        select: { id: true, title: true, academyName: true }
      }
    }
  });
};

export const updateClassroomMembership = async (id: number, data: { role?: string; status?: string }) => {
  return prisma.classroomMembership.update({
    where: { id },
    data,
    include: {
      user: {
        select: { id: true, username: true, firstName: true, lastName: true, role: true }
      },
      classroom: {
        select: { id: true, title: true, academyName: true }
      }
    }
  });
};

export const deleteClassroomMembership = async (id: number) => {
  return prisma.classroomMembership.delete({
    where: { id }
  });
};

// Live session operations
export const getLiveSessions = async (classroomId?: number, mentorId?: number) => {
  const where: any = {};
  if (classroomId) where.classroomId = classroomId;
  if (mentorId) where.mentorId = mentorId;

  return prisma.liveSession.findMany({
    where,
    include: {
      mentor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      classroom: {
        select: { id: true, title: true, academyName: true }
      }
    },
    orderBy: { scheduledAt: 'desc' }
  });
};

export const getLiveSessionById = async (id: number) => {
  return prisma.liveSession.findUnique({
    where: { id },
    include: {
      mentor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      classroom: {
        select: { id: true, title: true, academyName: true }
      }
    }
  });
};

export const createLiveSession = async (sessionData: {
  title: string;
  description?: string;
  mentorId: number;
  classroomId?: number;
  scheduledAt: Date;
  duration?: number;
  maxParticipants?: number;
}) => {
  return prisma.liveSession.create({
    data: sessionData,
    include: {
      mentor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      classroom: {
        select: { id: true, title: true, academyName: true }
      }
    }
  });
};

export const updateLiveSession = async (id: number, sessionData: {
  title?: string;
  description?: string;
  scheduledAt?: Date;
  duration?: number;
  status?: string;
  recordingUrl?: string;
}) => {
  return prisma.liveSession.update({
    where: { id },
    data: sessionData,
    include: {
      mentor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      classroom: {
        select: { id: true, title: true, academyName: true }
      }
    }
  });
};

export const deleteLiveSession = async (id: number) => {
  return prisma.liveSession.delete({
    where: { id }
  });
};

// Mentor profiles operations
export const getMentorProfiles = async () => {
  return prisma.mentorProfile.findMany({
    include: {
      user: {
        select: { id: true, username: true, firstName: true, lastName: true, role: true }
      }
    },
    orderBy: { averageRating: 'desc' }
  });
};

export const getMentorProfileById = async (id: number) => {
  return prisma.mentorProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, username: true, firstName: true, lastName: true, role: true }
      }
    }
  });
};

export const getMentorProfileByUserId = async (userId: number) => {
  return prisma.mentorProfile.findFirst({
    where: { userId },
    include: {
      user: {
        select: { id: true, username: true, firstName: true, lastName: true, role: true }
      }
    }
  });
};

export const createMentorProfile = async (profileData: {
  userId: number;
  specialization?: string;
  experience?: string;
  hourlyRate?: string;
  location?: string;
  languages?: string[];
  badges?: string[];
  bio?: string;
  availability?: string;
}) => {
  return prisma.mentorProfile.create({
    data: profileData,
    include: {
      user: {
        select: { id: true, username: true, firstName: true, lastName: true, role: true }
      }
    }
  });
};

export const updateMentorProfile = async (id: number, profileData: {
  specialization?: string;
  experience?: string;
  hourlyRate?: string;
  location?: string;
  languages?: string[];
  badges?: string[];
  bio?: string;
  availability?: string;
  totalStudents?: number;
  totalReviews?: number;
  averageRating?: number;
  isVerified?: boolean;
}) => {
  return prisma.mentorProfile.update({
    where: { id },
    data: profileData,
    include: {
      user: {
        select: { id: true, username: true, firstName: true, lastName: true, role: true }
      }
    }
  });
};

export const deleteMentorProfile = async (id: number) => {
  return prisma.mentorProfile.delete({
    where: { id }
  });
};

// Post operations
export const getPosts = async () => {
  return prisma.post.findMany({
    include: {
      user: {
        select: { id: true, username: true, firstName: true, lastName: true, avatar: true }
      },
      postComments: {
        include: {
          post: {
            select: { id: true, username: true, firstName: true, lastName: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const getPostById = async (id: number) => {
  return prisma.post.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, username: true, firstName: true, lastName: true, avatar: true }
      },
      postComments: {
        include: {
          post: {
            select: { id: true, username: true, firstName: true, lastName: true }
          }
        }
      }
    }
  });
};

export const createPost = async (postData: {
  userId: number;
  title?: string;
  content: string;
  type?: string;
  audioFile?: string;
  tags?: string[];
}) => {
  return prisma.post.create({
    data: postData,
    include: {
      user: {
        select: { id: true, username: true, firstName: true, lastName: true, avatar: true }
      }
    }
  });
};

export const updatePost = async (id: number, postData: {
  title?: string;
  content?: string;
  likes?: number;
  comments?: number;
  shares?: number;
}) => {
  return prisma.post.update({
    where: { id },
    data: postData,
    include: {
      user: {
        select: { id: true, username: true, firstName: true, lastName: true, avatar: true }
      }
    }
  });
};

export const deletePost = async (id: number) => {
  return prisma.post.delete({
    where: { id }
  });
};

// Staff request operations
export const getStaffRequests = async (classroomId?: number, status?: string) => {
  const where: any = {};
  if (classroomId) where.classroomId = classroomId;
  if (status) where.status = status;

  return prisma.staffRequest.findMany({
    where,
    include: {
      mentor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      classroom: {
        select: { id: true, title: true, academyName: true }
      },
      reviewer: {
        select: { id: true, username: true, firstName: true, lastName: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const getStaffRequestById = async (id: number) => {
  return prisma.staffRequest.findUnique({
    where: { id },
    include: {
      mentor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      classroom: {
        select: { id: true, title: true, academyName: true }
      },
      reviewer: {
        select: { id: true, username: true, firstName: true, lastName: true }
      }
    }
  });
};

export const createStaffRequest = async (requestData: {
  mentorId: number;
  classroomId: number;
  message?: string;
}) => {
  return prisma.staffRequest.create({
    data: requestData,
    include: {
      mentor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      classroom: {
        select: { id: true, title: true, academyName: true }
      }
    }
  });
};

export const updateStaffRequest = async (id: number, requestData: {
  status?: string;
  reviewedBy?: number;
  adminNotes?: string;
}) => {
  const updateData: any = { ...requestData };
  if (requestData.status && requestData.reviewedBy) {
    updateData.reviewedAt = new Date();
  }

  return prisma.staffRequest.update({
    where: { id },
    data: updateData,
    include: {
      mentor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      classroom: {
        select: { id: true, title: true, academyName: true }
      },
      reviewer: {
        select: { id: true, username: true, firstName: true, lastName: true }
      }
    }
  });
};

export const deleteStaffRequest = async (id: number) => {
  return prisma.staffRequest.delete({
    where: { id }
  });
};

// Master role request operations
export const getMasterRoleRequests = async (status?: string) => {
  const where: any = {};
  if (status) where.status = status;

  return prisma.masterRoleRequest.findMany({
    where,
    include: {
      mentor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      reviewer: {
        select: { id: true, username: true, firstName: true, lastName: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const getMasterRoleRequestById = async (id: number) => {
  return prisma.masterRoleRequest.findUnique({
    where: { id },
    include: {
      mentor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      reviewer: {
        select: { id: true, username: true, firstName: true, lastName: true }
      }
    }
  });
};

export const createMasterRoleRequest = async (requestData: {
  mentorId: number;
  experience: string;
  qualifications: string;
  motivation: string;
  portfolio?: string;
}) => {
  return prisma.masterRoleRequest.create({
    data: requestData,
    include: {
      mentor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      }
    }
  });
};

export const updateMasterRoleRequest = async (id: number, requestData: {
  status?: string;
  reviewedBy?: number;
  adminNotes?: string;
}) => {
  const updateData: any = { ...requestData };
  if (requestData.status === 'approved') {
    updateData.approvedAt = new Date();
  } else if (requestData.status === 'rejected') {
    updateData.rejectedAt = new Date();
  }
  if (requestData.reviewedBy) {
    updateData.reviewedAt = new Date();
  }

  return prisma.masterRoleRequest.update({
    where: { id },
    data: updateData,
    include: {
      mentor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      reviewer: {
        select: { id: true, username: true, firstName: true, lastName: true }
      }
    }
  });
};

export const deleteMasterRoleRequest = async (id: number) => {
  return prisma.masterRoleRequest.delete({
    where: { id }
  });
};

// Mentorship request operations
export const getMentorshipRequests = async (studentId?: number, mentorId?: number, status?: string) => {
  const where: any = {};
  if (studentId) where.studentId = studentId;
  if (mentorId) where.mentorId = mentorId;
  if (status) where.status = status;

  return prisma.mentorshipRequest.findMany({
    where,
    include: {
      student: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      mentor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const getMentorshipRequestById = async (id: number) => {
  return prisma.mentorshipRequest.findUnique({
    where: { id },
    include: {
      student: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      mentor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      conversations: {
        include: {
          sender: {
            select: { id: true, username: true, firstName: true, lastName: true }
          }
        },
        orderBy: { createdAt: 'asc' }
      },
      sessions: {
        orderBy: { scheduledAt: 'desc' }
      }
    }
  });
};

export const createMentorshipRequest = async (requestData: {
  studentId: number;
  mentorId: number;
  message?: string;
  subject?: string;
  experienceLevel?: string;
  goals?: string;
  timeCommitment?: string;
  preferredSchedule?: string;
}) => {
  return prisma.mentorshipRequest.create({
    data: requestData,
    include: {
      student: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      mentor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      }
    }
  });
};

export const updateMentorshipRequest = async (id: number, requestData: {
  status?: string;
  mentorResponse?: string;
}) => {
  return prisma.mentorshipRequest.update({
    where: { id },
    data: requestData,
    include: {
      student: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      mentor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      }
    }
  });
};

export const deleteMentorshipRequest = async (id: number) => {
  return prisma.mentorshipRequest.delete({
    where: { id }
  });
};

// Mentor conversation operations
export const getMentorConversations = async (mentorshipRequestId: number) => {
  return prisma.mentorConversation.findMany({
    where: { mentorshipRequestId },
    include: {
      sender: {
        select: { id: true, username: true, firstName: true, lastName: true }
      }
    },
    orderBy: { createdAt: 'asc' }
  });
};

export const createMentorConversation = async (conversationData: {
  mentorshipRequestId: number;
  senderId: number;
  message: string;
  messageType?: string;
  attachmentUrl?: string;
}) => {
  return prisma.mentorConversation.create({
    data: conversationData,
    include: {
      sender: {
        select: { id: true, username: true, firstName: true, lastName: true }
      }
    }
  });
};

export const updateMentorConversation = async (id: number, data: { isRead?: boolean }) => {
  return prisma.mentorConversation.update({
    where: { id },
    data,
    include: {
      sender: {
        select: { id: true, username: true, firstName: true, lastName: true }
      }
    }
  });
};

// Schedule operations
export const getSchedules = async (classroomId?: number, instructorId?: number) => {
  const where: any = {};
  if (classroomId) where.classroomId = classroomId;
  if (instructorId) where.instructorId = instructorId;

  return prisma.schedule.findMany({
    where,
    include: {
      classroom: {
        select: { id: true, title: true, academyName: true }
      },
      instructor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      enrollments: {
        include: {
          student: {
            select: { id: true, username: true, firstName: true, lastName: true }
          }
        }
      }
    },
    orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }]
  });
};

export const getScheduleById = async (id: number) => {
  return prisma.schedule.findUnique({
    where: { id },
    include: {
      classroom: {
        select: { id: true, title: true, academyName: true }
      },
      instructor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      enrollments: {
        include: {
          student: {
            select: { id: true, username: true, firstName: true, lastName: true }
          }
        }
      }
    }
  });
};

export const createSchedule = async (scheduleData: {
  classroomId: number;
  title: string;
  description?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  instructorId: number;
  subject?: string;
  sessionType?: string;
  maxStudents?: number;
  isRecurring?: boolean;
}) => {
  return prisma.schedule.create({
    data: scheduleData,
    include: {
      classroom: {
        select: { id: true, title: true, academyName: true }
      },
      instructor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      }
    }
  });
};

export const updateSchedule = async (id: number, scheduleData: {
  title?: string;
  description?: string;
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  instructorId?: number;
  subject?: string;
  sessionType?: string;
  maxStudents?: number;
  isRecurring?: boolean;
  isActive?: boolean;
}) => {
  const updateData: any = { ...scheduleData, updatedAt: new Date() };

  return prisma.schedule.update({
    where: { id },
    data: updateData,
    include: {
      classroom: {
        select: { id: true, title: true, academyName: true }
      },
      instructor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      }
    }
  });
};

export const deleteSchedule = async (id: number) => {
  return prisma.schedule.delete({
    where: { id }
  });
};

// Resignation request operations
export const getResignationRequests = async (classroomId?: number, mentorId?: number, status?: string) => {
  const where: any = {};
  if (classroomId) where.classroomId = classroomId;
  if (mentorId) where.mentorId = mentorId;
  if (status) where.status = status;

  return prisma.resignationRequest.findMany({
    where,
    include: {
      mentor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      reviewer: {
        select: { id: true, username: true, firstName: true, lastName: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const getResignationRequestById = async (id: number) => {
  return prisma.resignationRequest.findUnique({
    where: { id },
    include: {
      mentor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      reviewer: {
        select: { id: true, username: true, firstName: true, lastName: true }
      }
    }
  });
};

export const createResignationRequest = async (requestData: {
  mentorId: number;
  classroomId: number;
  reason: string;
  lastWorkDate: Date;
}) => {
  return prisma.resignationRequest.create({
    data: requestData,
    include: {
      mentor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      }
    }
  });
};

export const updateResignationRequest = async (id: number, requestData: {
  status?: string;
  reviewedBy?: number;
  masterNotes?: string;
}) => {
  const updateData: any = { ...requestData };
  if (requestData.reviewedBy) {
    updateData.reviewedAt = new Date();
  }

  return prisma.resignationRequest.update({
    where: { id },
    data: updateData,
    include: {
      mentor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      reviewer: {
        select: { id: true, username: true, firstName: true, lastName: true }
      }
    }
  });
};

// Mentorship session operations
export const getMentorshipSessions = async (mentorId?: number, studentId?: number, status?: string) => {
  const where: any = {};
  if (mentorId) where.mentorId = mentorId;
  if (studentId) where.studentId = studentId;
  if (status) where.status = status;

  return prisma.mentorshipSession.findMany({
    where,
    include: {
      mentor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      student: {
        select: { id: true, username: true, firstName: true, lastName: true }
      }
    },
    orderBy: { scheduledAt: 'desc' }
  });
};

export const getMentorshipSessionById = async (id: number) => {
  return prisma.mentorshipSession.findUnique({
    where: { id },
    include: {
      mentor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      student: {
        select: { id: true, username: true, firstName: true, lastName: true }
      }
    }
  });
};

export const createMentorshipSession = async (sessionData: {
  mentorshipRequestId: number;
  mentorId: number;
  studentId: number;
  scheduledAt: Date;
  duration?: number;
  title?: string;
  description?: string;
  status?: string;
}) => {
  return prisma.mentorshipSession.create({
    data: sessionData,
    include: {
      mentor: {
        select: { id: true, username: true, firstName: true, lastName: true }
      },
      student: {
        select: { id: true, username: true, firstName: true, lastName: true }
      }
    }
  });
};

// Staff classroom info for mentors
export const getStaffClassroomInfo = async (mentorId: number) => {
  // Find classroom where mentor is staff
  const membership = await prisma.classroomMembership.findFirst({
    where: {
      userId: mentorId,
      role: "staff",
      status: "active"
    },
    include: {
      classroom: {
        include: {
          master: {
            select: { id: true, username: true, firstName: true, lastName: true }
          }
        }
      }
    }
  });

  if (!membership) {
    return null;
  }

  return {
    classroomId: membership.classroom.id,
    classroomTitle: membership.classroom.title,
    academyName: membership.classroom.academyName,
    master: membership.classroom.master,
    joinedAt: membership.joinedAt,
    role: membership.role
  };
};

// Export all for backward compatibility
export * from '@prisma/client';