import { useState, useEffect } from "react";
import { StudentNavigation } from "@/components/student/StudentNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, ArrowLeft, Calendar, Award, Target, Clock, BarChart3 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { getCurrentUser, isAuthenticated } from "@/lib/auth";

export default function ProgressAnalyticsPage() {
  const [currentUser] = useState(getCurrentUser());
  const [, setLocation] = useLocation();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation('/');
    }
  }, [setLocation]);

  const [timeRange, setTimeRange] = useState("week");
  const [selectedMetric, setSelectedMetric] = useState("practice-time");

  const analyticsData = {
    week: {
      practiceTime: 180,
      sessionsCompleted: 8,
      averageSessionLength: 22.5,
      goalCompletion: 85,
      improvement: 12
    },
    month: {
      practiceTime: 720,
      sessionsCompleted: 28,
      averageSessionLength: 25.7,
      goalCompletion: 78,
      improvement: 24
    },
    year: {
      practiceTime: 8640,
      sessionsCompleted: 312,
      averageSessionLength: 27.7,
      goalCompletion: 82,
      improvement: 156
    }
  };

  const currentData = analyticsData[timeRange as keyof typeof analyticsData];

  const skillProgress = [
    { skill: "Scales & Arpeggios", current: 85, previous: 78, category: "Technique" },
    { skill: "Sight Reading", current: 72, previous: 65, category: "Reading" },
    { skill: "Rhythm Recognition", current: 90, previous: 88, category: "Theory" },
    { skill: "Chord Progressions", current: 68, previous: 58, category: "Theory" },
    { skill: "Improvisation", current: 55, previous: 45, category: "Creative" },
    { skill: "Performance", current: 75, previous: 70, category: "Expression" }
  ];

  const practiceHistory = [
    { date: "Mon", minutes: 35, sessions: 2, focus: "Scales" },
    { date: "Tue", minutes: 45, sessions: 2, focus: "Repertoire" },
    { date: "Wed", minutes: 20, sessions: 1, focus: "Theory" },
    { date: "Thu", minutes: 40, sessions: 2, focus: "Technique" },
    { date: "Fri", minutes: 25, sessions: 1, focus: "Sight Reading" },
    { date: "Sat", minutes: 60, sessions: 3, focus: "Performance" },
    { date: "Sun", minutes: 30, sessions: 1, focus: "Review" }
  ];

  const achievements = [
    { 
      name: "Practice Streak", 
      description: "7 days consecutive practice", 
      earned: true, 
      date: "2024-01-15",
      icon: "🔥"
    },
    { 
      name: "Scale Master", 
      description: "Completed all major scales", 
      earned: true, 
      date: "2024-01-10",
      icon: "🎵"
    },
    { 
      name: "Theory Scholar", 
      description: "100% on music theory quiz", 
      earned: false, 
      progress: 75,
      icon: "📚"
    },
    { 
      name: "Rhythm Expert", 
      description: "Master complex rhythms", 
      earned: false, 
      progress: 45,
      icon: "🥁"
    }
  ];

  const getSkillTrend = (current: number, previous: number) => {
    const change = current - previous;
    return {
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      value: Math.abs(change),
      color: change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-muted-foreground'
    };
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
              <Badge variant="secondary">Analytics</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  Progress Analytics
                </h1>
                <p className="text-muted-foreground">
                  Track your musical growth with detailed performance metrics and insights
                </p>
              </div>
              <div className="flex gap-4">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-blue-600">{currentData.practiceTime}</div>
              <div className="text-sm text-muted-foreground">Minutes Practiced</div>
              <div className="text-xs text-green-600 mt-1">+{currentData.improvement}% vs last {timeRange}</div>
            </Card>

            <Card className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-8 w-8 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-green-600">{currentData.sessionsCompleted}</div>
              <div className="text-sm text-muted-foreground">Sessions</div>
              <div className="text-xs text-green-600 mt-1">On track</div>
            </Card>

            <Card className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-purple-600">{currentData.averageSessionLength}</div>
              <div className="text-sm text-muted-foreground">Avg Session (min)</div>
              <div className="text-xs text-green-600 mt-1">+2.3 min</div>
            </Card>

            <Card className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Award className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold text-yellow-600">{currentData.goalCompletion}%</div>
              <div className="text-sm text-muted-foreground">Goal Completion</div>
              <div className="text-xs text-green-600 mt-1">Excellent!</div>
            </Card>

            <Card className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-8 w-8 text-indigo-500" />
              </div>
              <div className="text-3xl font-bold text-indigo-600">A+</div>
              <div className="text-sm text-muted-foreground">Overall Grade</div>
              <div className="text-xs text-green-600 mt-1">Keep it up!</div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Skill Progress */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-xl">Skill Development</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  {skillProgress.map((skill) => {
                    const trend = getSkillTrend(skill.current, skill.previous);
                    return (
                      <div key={skill.skill} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">{skill.skill}</span>
                            <Badge variant="outline" className="ml-2 text-xs">{skill.category}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{skill.current}%</span>
                            <span className={`text-xs ${trend.color}`}>
                              {trend.direction === 'up' && '↗'}
                              {trend.direction === 'down' && '↘'}
                              {trend.direction === 'stable' && '→'}
                              {trend.value > 0 && trend.value}
                            </span>
                          </div>
                        </div>
                        <Progress value={skill.current} className="h-2" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Practice History Chart */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-xl">Weekly Practice Overview</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-4">
                    {practiceHistory.map((day) => (
                      <div key={day.date} className="flex items-center gap-4">
                        <div className="w-12 text-sm font-medium text-center">{day.date}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">{day.focus}</span>
                            <span className="text-sm text-muted-foreground">{day.minutes}min</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                              style={{ width: `${(day.minutes / 60) * 100}%` }}
                            />
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">{day.sessions}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Achievements & Goals */}
            <div className="space-y-6">
              {/* Achievements */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-3">
                  {achievements.map((achievement) => (
                    <div 
                      key={achievement.name}
                      className={`p-3 rounded-lg border ${
                        achievement.earned ? 
                        'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                        'bg-muted/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{achievement.name}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                          {achievement.earned ? (
                            <Badge variant="default" className="text-xs">
                              Earned {achievement.date}
                            </Badge>
                          ) : (
                            <div className="space-y-1">
                              <Progress value={achievement.progress} className="h-1" />
                              <span className="text-xs text-muted-foreground">{achievement.progress}% complete</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Current Goals */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Current Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">Practice 150 min/week</span>
                      <span className="text-sm">{currentData.practiceTime}/150</span>
                    </div>
                    <Progress value={(currentData.practiceTime / 150) * 100} className="h-2" />
                  </div>
                  
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">Complete Scale Training</span>
                      <span className="text-sm">8/12</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">Master 3 New Songs</span>
                      <span className="text-sm">1/3</span>
                    </div>
                    <Progress value={33} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Insights */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg">Insights</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-3 text-sm">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <strong>🎯 Great consistency!</strong> You've maintained a steady practice schedule this week.
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <strong>📈 Improving fast!</strong> Your rhythm recognition skills have improved significantly.
                  </div>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <strong>💡 Focus area:</strong> Consider more sight reading practice to balance your skills.
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