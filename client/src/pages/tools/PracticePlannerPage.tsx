import { useState, useEffect } from "react";
import { StudentNavigation } from "@/components/student/StudentNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Target, ArrowLeft, Plus, Clock, Play, Pause, CheckCircle, Circle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { getCurrentUser, isAuthenticated } from "@/lib/auth";

export default function PracticePlannerPage() {
  const [currentUser] = useState(getCurrentUser());
  const [, setLocation] = useLocation();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation('/');
    }
  }, [setLocation]);

  const [sessionGoal, setSessionGoal] = useState("");
  const [sessionDuration, setSessionDuration] = useState("30");
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60);
  const [currentActivity, setCurrentActivity] = useState(0);

  const [practiceActivities, setPracticeActivities] = useState([
    {
      id: 1,
      name: "Warm-up Scales",
      duration: 8,
      category: "technique",
      completed: false,
      notes: "Focus on evenness and tempo"
    },
    {
      id: 2,
      name: "Song Practice: Moonlight Sonata",
      duration: 15,
      category: "repertoire",
      completed: false,
      notes: "Work on measures 20-35, slow practice"
    },
    {
      id: 3,
      name: "Sight Reading",
      duration: 5,
      category: "reading",
      completed: false,
      notes: "Bach Chorales, Book 1"
    },
    {
      id: 4,
      name: "Cool Down",
      duration: 2,
      category: "other",
      completed: false,
      notes: "Light stretching and reflection"
    }
  ]);

  const totalPlannedTime = practiceActivities.reduce((sum, activity) => sum + activity.duration, 0);
  const completedActivities = practiceActivities.filter(a => a.completed).length;
  const sessionProgress = (completedActivities / practiceActivities.length) * 100;

  const toggleSession = () => {
    setIsSessionActive(!isSessionActive);
    if (!isSessionActive) {
      setTimeRemaining(parseInt(sessionDuration) * 60);
    }
  };

  const toggleActivityComplete = (activityId: number) => {
    setPracticeActivities(prev =>
      prev.map(activity =>
        activity.id === activityId
          ? { ...activity, completed: !activity.completed }
          : activity
      )
    );
  };

  const addActivity = () => {
    const newActivity = {
      id: Date.now(),
      name: "New Activity",
      duration: 5,
      category: "other",
      completed: false,
      notes: ""
    };
    setPracticeActivities(prev => [...prev, newActivity]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const practiceStats = {
    weeklyGoal: 150,
    weeklyCompleted: 98,
    sessionsThisWeek: 5,
    averageSessionLength: 28
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Navigation */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-0 h-screen">
          <StudentNavigation currentUser={currentUser} className="h-full" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/tools">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Tools
                </Button>
              </Link>
              <Badge variant="secondary">Organization</Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                <Target className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              Practice Planner
            </h1>
            <p className="text-muted-foreground">
              Organize effective practice sessions with goals, timing, and progress tracking
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Session Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Session Timer & Control */}
              <Card className="p-8">
                <div className="text-center mb-6">
                  {/* Session Timer */}
                  <div className="bg-muted/30 rounded-2xl p-6 mb-6">
                    <div className="text-5xl font-bold text-red-600 dark:text-red-400 mb-2">
                      {formatTime(timeRemaining)}
                    </div>
                    <div className="text-lg text-muted-foreground mb-4">
                      {isSessionActive ? 'Practice Session Active' : 'Ready to Start'}
                    </div>
                    
                    {/* Progress Circle */}
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-muted-foreground/30"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - sessionProgress / 100)}`}
                          className="text-red-600 dark:text-red-400 transition-all duration-300"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-semibold">{Math.round(sessionProgress)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex justify-center gap-4">
                    <Button
                      size="lg"
                      onClick={toggleSession}
                      className="w-24 h-16"
                    >
                      {isSessionActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                  </div>
                </div>

                {/* Session Goal */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">Today's Practice Goal</label>
                  <Input
                    value={sessionGoal}
                    onChange={(e) => setSessionGoal(e.target.value)}
                    placeholder="What do you want to accomplish today?"
                    className="text-center"
                  />
                </div>
              </Card>

              {/* Practice Activities */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Practice Activities</CardTitle>
                    <Button variant="outline" size="sm" onClick={addActivity} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Activity
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0 space-y-3">
                  {practiceActivities.map((activity, index) => (
                    <div 
                      key={activity.id} 
                      className={`p-4 border rounded-lg transition-all ${
                        activity.completed ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                        isSessionActive && currentActivity === index ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' :
                        'bg-muted/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleActivityComplete(activity.id)}
                          className="p-1 h-6 w-6"
                        >
                          {activity.completed ? 
                            <CheckCircle className="h-4 w-4 text-green-600" /> : 
                            <Circle className="h-4 w-4" />
                          }
                        </Button>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className={`font-medium ${activity.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {activity.name}
                            </h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {activity.category}
                              </Badge>
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {activity.duration}min
                              </span>
                            </div>
                          </div>
                          {activity.notes && (
                            <p className="text-sm text-muted-foreground">{activity.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-between items-center pt-4 border-t text-sm">
                    <span className="text-muted-foreground">Total planned time:</span>
                    <span className="font-medium">{totalPlannedTime} minutes</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Settings & Stats */}
            <div className="space-y-6">
              {/* Session Settings */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg">Session Settings</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Session Duration</label>
                    <Select value={sessionDuration} onValueChange={setSessionDuration}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Progress */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg">Weekly Progress</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Practice Time</span>
                      <span className="text-sm font-medium">
                        {practiceStats.weeklyCompleted}/{practiceStats.weeklyGoal} min
                      </span>
                    </div>
                    <Progress value={(practiceStats.weeklyCompleted / practiceStats.weeklyGoal) * 100} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{practiceStats.sessionsThisWeek}</div>
                      <div className="text-xs text-muted-foreground">Sessions</div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{practiceStats.averageSessionLength}min</div>
                      <div className="text-xs text-muted-foreground">Avg Length</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Practice Templates */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg">Quick Templates</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-2">
                  <Button variant="outline" className="w-full justify-start text-sm">
                    🎹 Piano Practice (30min)
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    🎸 Guitar Technique (45min)
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    🎵 Music Theory Study (20min)
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    📖 Sight Reading (15min)
                  </Button>
                </CardContent>
              </Card>

              {/* Practice Tips */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg">Practice Tips</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <strong>Warm Up:</strong> Always start with scales or technical exercises
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <strong>Slow Practice:</strong> Focus on accuracy before speed
                  </div>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <strong>Break Time:</strong> Take 5-10 minute breaks every 30 minutes
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}