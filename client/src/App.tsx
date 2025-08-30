import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router, Route, Switch } from "wouter";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import { LearningPaths } from "./pages/LearningPaths";
import NotFound from "./pages/NotFound";
import { MentorPage } from "./pages/MentorPage";
import { LiveSessions } from "./pages/LiveSessions";
import { AdminPanel } from "./pages/AdminPanel";
import Community from "./pages/Community";
import Tools from "./pages/Tools";
import About from "./pages/About";
import GetStarted from "./pages/GetStarted";
import StudentSignIn from "./pages/StudentSignIn";
import StudentSignUp from "./pages/StudentSignUp";
import MentorSignIn from "./pages/MentorSignIn";
import MentorSignUp from "./pages/MentorSignUp";
import AdminSignIn from "./pages/AdminSignIn";
import Classroom from "./pages/Classroom";
import ClassroomDashboard from "./pages/ClassroomDashboard";
import ClassroomManage from "./pages/ClassroomManage";
import LiveClass from "./pages/LiveClass";
import MentorDashboard from "./pages/MentorDashboard";
import MasterDashboard from "./pages/MasterDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentCourses from "./pages/StudentCourses";
import StudentProgress from "./pages/StudentProgress";
import StudentSessions from "./pages/StudentSessions";
import StudentAchievements from "./pages/StudentAchievements";
import StudentCommunity from "./pages/StudentCommunity";
import StudentTools from "./pages/StudentTools";
import StudentMentors from "./pages/StudentMentors";
import AcademyDiscovery from "./pages/AcademyDiscovery";
import MyAcademies from "./pages/MyAcademies";
import MentorInteractions from "./pages/MentorInteractions";
import MentorRequests from "./pages/MentorRequests";
import MentorStudents from "./pages/MentorStudents";
import ClassroomDiscovery from "./pages/ClassroomDiscovery";
import ClassroomLanding from "./pages/ClassroomLanding";
import StaffClassroom from "./pages/StaffClassroom";
import ClassroomManagement from "./pages/ClassroomManagement";
import CourseDetail from "./pages/CourseDetail";
import CourseCreation from "./pages/CourseCreation";
import CourseManagement from "./pages/CourseManagement";
import MetronomePage from "./pages/tools/MetronomePage";
import TunerPage from "./pages/tools/TunerPage";
import ScaleTrainerPage from "./pages/tools/ScaleTrainerPage";
import RhythmTrainerPage from "./pages/tools/RhythmTrainerPage";
import PracticePlannerPage from "./pages/tools/PracticePlannerPage";
import ProgressAnalyticsPage from "./pages/tools/ProgressAnalyticsPage";
import { ProtectedRoute, StudentRoute, MentorRoute, AdminRoute, AuthenticatedRoute, MasterRoute } from "./components/ProtectedRoute";
import { checkPortalNavigation } from "./lib/auth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const url = Array.isArray(queryKey) ? queryKey[0] : queryKey;
        const response = await fetch(url as string);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      },
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  // Monitor navigation and automatically logout users who leave their portal
  React.useEffect(() => {
    const handleRouteChange = () => {
      // Small delay to ensure the route has changed
      setTimeout(() => {
        checkPortalNavigation();
      }, 100);
    };

    // Listen for route changes via popstate (back/forward buttons)
    window.addEventListener('popstate', handleRouteChange);
    
    // Listen for programmatic navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      handleRouteChange();
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      handleRouteChange();
    };

    // Check on initial load
    handleRouteChange();

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
          <Switch>
            <Route path="/" component={Index} />
            <Route path="/get-started" component={GetStarted} />
            <Route path="/sign-in" component={StudentSignIn} />
            <Route path="/sign-up" component={StudentSignUp} />
            <Route path="/student-signin" component={StudentSignIn} />
            <Route path="/student-signup" component={StudentSignUp} />
            <Route path="/mentor-signin" component={MentorSignIn} />
            <Route path="/mentor-signup" component={MentorSignUp} />
            <Route path="/admin-signin" component={AdminSignIn} />
            <Route path="/courses" component={Courses} />
            <Route path="/courses/:id" component={CourseDetail} />
            <Route path="/course-creation" component={() => <AuthenticatedRoute><CourseCreation /></AuthenticatedRoute>} />
            <Route path="/course-management" component={() => <AuthenticatedRoute><CourseManagement /></AuthenticatedRoute>} />
            <Route path="/learning-paths" component={LearningPaths} />
            <Route path="/mentors" component={MentorPage} />
            <Route path="/live-sessions" component={LiveSessions} />
            <Route path="/community" component={Community} />
            <Route path="/tools" component={Tools} />
            <Route path="/about" component={About} />
            <Route path="/admin" component={() => <AdminRoute><AdminPanel /></AdminRoute>} />
            <Route path="/classroom" component={() => <AuthenticatedRoute><Classroom /></AuthenticatedRoute>} />
            <Route path="/classroom/dashboard/:id" component={() => <AuthenticatedRoute><ClassroomDashboard /></AuthenticatedRoute>} />
            <Route path="/classroom/manage" component={() => <MentorRoute><ClassroomManage /></MentorRoute>} />
            <Route path="/classroom/live/:id" component={() => <AuthenticatedRoute><LiveClass /></AuthenticatedRoute>} />
            <Route path="/mentor-dashboard" component={() => <MentorRoute><MentorDashboard /></MentorRoute>} />
            <Route path="/master-dashboard" component={() => <MasterRoute><MasterDashboard /></MasterRoute>} />
            <Route path="/student-dashboard" component={() => <StudentRoute><StudentDashboard /></StudentRoute>} />
            <Route path="/student-courses" component={() => <StudentRoute><StudentCourses /></StudentRoute>} />
            <Route path="/student-progress" component={() => <StudentRoute><StudentProgress /></StudentRoute>} />
            <Route path="/student-sessions" component={() => <StudentRoute><StudentSessions /></StudentRoute>} />
            <Route path="/student-achievements" component={() => <StudentRoute><StudentAchievements /></StudentRoute>} />
            <Route path="/student-community" component={() => <StudentRoute><StudentCommunity /></StudentRoute>} />
            <Route path="/student-tools" component={() => <StudentRoute><StudentTools /></StudentRoute>} />
            <Route path="/student-mentors" component={() => <StudentRoute><StudentMentors /></StudentRoute>} />
            <Route path="/academy-discovery" component={() => <StudentRoute><AcademyDiscovery /></StudentRoute>} />
            <Route path="/my-academies" component={() => <StudentRoute><MyAcademies /></StudentRoute>} />
            <Route path="/mentor-interactions" component={() => <AuthenticatedRoute><MentorInteractions /></AuthenticatedRoute>} />
            <Route path="/mentor-requests" component={() => <MentorRoute><MentorRequests /></MentorRoute>} />
            <Route path="/mentor-students" component={() => <MentorRoute><MentorStudents /></MentorRoute>} />
            <Route path="/staff-classroom" component={() => <MentorRoute><StaffClassroom /></MentorRoute>} />
            <Route path="/classroom-discovery" component={() => <MentorRoute><ClassroomDiscovery /></MentorRoute>} />
            <Route path="/classroom-management/:classroomId" component={() => <MasterRoute><ClassroomManagement /></MasterRoute>} />
            {/* Legacy redirects for old conflicting routes */}
            <Route path="/classroom-staff" component={() => <MentorRoute><ClassroomDiscovery /></MentorRoute>} />
            <Route path="/classroom-browser" component={() => <MentorRoute><ClassroomDiscovery /></MentorRoute>} />
            <Route path="/academy/:slug" component={ClassroomLanding} />
            <Route path="/tools/metronome" component={() => <StudentRoute><MetronomePage /></StudentRoute>} />
            <Route path="/tools/tuner" component={() => <StudentRoute><TunerPage /></StudentRoute>} />
            <Route path="/tools/scale-trainer" component={() => <StudentRoute><ScaleTrainerPage /></StudentRoute>} />
            <Route path="/tools/rhythm-trainer" component={() => <StudentRoute><RhythmTrainerPage /></StudentRoute>} />
            <Route path="/tools/practice-planner" component={() => <StudentRoute><PracticePlannerPage /></StudentRoute>} />
            <Route path="/tools/progress-analytics" component={() => <StudentRoute><ProgressAnalyticsPage /></StudentRoute>} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
  );
};

export default App;
