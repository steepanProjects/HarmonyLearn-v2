import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Footer } from "@/components/Footer";
import { StudentNavigation } from "@/components/student/StudentNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Award, 
  Trophy, 
  Star,
  Target,
  Calendar,
  BookOpen,
  Music,
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  Lock
} from "lucide-react";

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  earnedDate?: string;
  category: 'progress' | 'skill' | 'participation' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  isEarned: boolean;
  progress?: number;
  requirement?: string;
}

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  earnedDate: string;
  category: string;
}

interface Goal {
  id: number;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline?: string;
  category: string;
  isCompleted: boolean;
}

const StudentAchievements = () => {
  const [currentUser] = useState(() => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  });

  // Fetch student achievements data
  const { data: enrollments = [] } = useQuery<any[]>({
    queryKey: ['/api/enrollments', { student: currentUser?.id }],
    enabled: !!currentUser?.id
  });

  // Sample achievements data - in real app would come from API
  const [achievements] = useState<Achievement[]>([
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first lesson",
      icon: "🎵",
      earnedDate: "2025-01-15",
      category: 'progress',
      rarity: 'common',
      points: 10,
      isEarned: true
    },
    {
      id: 2,
      title: "Week Warrior",
      description: "Practice for 7 consecutive days",
      icon: "🔥",
      earnedDate: "2025-01-20",
      category: 'participation',
      rarity: 'rare',
      points: 50,
      isEarned: true
    },
    {
      id: 3,
      title: "Scale Master",
      description: "Master all basic scales",
      icon: "🎼",
      earnedDate: "2025-01-25",
      category: 'skill',
      rarity: 'epic',
      points: 100,
      isEarned: true
    },
    {
      id: 4,
      title: "Course Crusher",
      description: "Complete 5 courses",
      icon: "📚",
      category: 'milestone',
      rarity: 'epic',
      points: 200,
      isEarned: false,
      progress: 60,
      requirement: "Complete 3 more courses"
    },
    {
      id: 5,
      title: "Perfect Pitch",
      description: "Score 100% on a theory test",
      icon: "🎯",
      category: 'skill',
      rarity: 'legendary',
      points: 500,
      isEarned: false,
      progress: 0,
      requirement: "Take a theory assessment"
    },
    {
      id: 6,
      title: "Social Butterfly",
      description: "Join 10 community discussions",
      icon: "🦋",
      category: 'participation',
      rarity: 'rare',
      points: 75,
      isEarned: false,
      progress: 30,
      requirement: "Join 7 more discussions"
    }
  ]);

  const [badges] = useState<Badge[]>([
    {
      id: 1,
      name: "Piano Pioneer",
      description: "Started your piano journey",
      icon: "🎹",
      earnedDate: "2025-01-15",
      category: "Instrument"
    },
    {
      id: 2,
      name: "Theory Enthusiast",
      description: "Completed music theory basics",
      icon: "📖",
      earnedDate: "2025-01-22",
      category: "Knowledge"
    }
  ]);

  const [goals] = useState<Goal[]>([
    {
      id: 1,
      title: "Weekly Practice Goal",
      description: "Practice at least 10 hours this week",
      target: 10,
      current: 7.5,
      unit: "hours",
      deadline: "2025-02-02",
      category: "Practice",
      isCompleted: false
    },
    {
      id: 2,
      title: "Course Completion",
      description: "Finish Piano Fundamentals course",
      target: 100,
      current: 85,
      unit: "%",
      deadline: "2025-02-15",
      category: "Learning",
      isCompleted: false
    },
    {
      id: 3,
      title: "January Challenge",
      description: "Practice every day in January",
      target: 31,
      current: 31,
      unit: "days",
      category: "Challenge",
      isCompleted: true
    }
  ]);

  const earnedAchievements = achievements.filter(a => a.isEarned);
  const unlockedAchievements = achievements.filter(a => !a.isEarned);
  const totalPoints = earnedAchievements.reduce((sum, a) => sum + a.points, 0);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'progress': return <TrendingUp className="h-4 w-4" />;
      case 'skill': return <Star className="h-4 w-4" />;
      case 'participation': return <Users className="h-4 w-4" />;
      case 'milestone': return <Trophy className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  const AchievementCard = ({ achievement }: { achievement: Achievement }) => (
    <Card className={`overflow-hidden transition-all duration-300 ${
      achievement.isEarned 
        ? 'hover:shadow-lg cursor-pointer' 
        : 'opacity-60 hover:opacity-80'
    }`}>
      <CardContent className="p-6 relative">
        {!achievement.isEarned && (
          <div className="absolute top-2 right-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
        
        <div className="text-center space-y-3">
          <div className="text-4xl">{achievement.icon}</div>
          <div>
            <h3 className="font-semibold">{achievement.title}</h3>
            <p className="text-sm text-muted-foreground">{achievement.description}</p>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
              {achievement.rarity}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {getCategoryIcon(achievement.category)}
              <span className="ml-1">{achievement.category}</span>
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{achievement.points} points</span>
            {achievement.isEarned && achievement.earnedDate && (
              <span className="text-muted-foreground">
                {new Date(achievement.earnedDate).toLocaleDateString()}
              </span>
            )}
          </div>
          
          {!achievement.isEarned && achievement.progress !== undefined && (
            <div className="space-y-2">
              <Progress value={achievement.progress} className="h-2" />
              <p className="text-xs text-muted-foreground">{achievement.requirement}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

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
          <h1 className="text-3xl font-bold mb-2">Achievements & Progress</h1>
          <p className="text-muted-foreground">
            Track your learning milestones and celebrate your successes
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">{earnedAchievements.length}</p>
              <p className="text-sm text-muted-foreground">Achievements Earned</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{totalPoints}</p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{goals.filter(g => g.isCompleted).length}/{goals.length}</p>
              <p className="text-sm text-muted-foreground">Goals Completed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">{badges.length}</p>
              <p className="text-sm text-muted-foreground">Badges Collected</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="achievements" className="space-y-6">
          <TabsList>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <div className="space-y-6">
              {/* Earned Achievements */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Earned Achievements ({earnedAchievements.length})</h2>
                {earnedAchievements.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No achievements yet</h3>
                      <p className="text-muted-foreground">
                        Start learning to unlock your first achievements!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {earnedAchievements.map((achievement) => (
                      <AchievementCard key={achievement.id} achievement={achievement} />
                    ))}
                  </div>
                )}
              </div>

              {/* Available Achievements */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Available Achievements ({unlockedAchievements.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unlockedAchievements.map((achievement) => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges">
            <div className="space-y-4">
              {badges.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No badges earned yet</h3>
                    <p className="text-muted-foreground">
                      Complete courses and activities to earn badges!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {badges.map((badge) => (
                    <Card key={badge.id} className="text-center">
                      <CardContent className="p-6">
                        <div className="text-4xl mb-3">{badge.icon}</div>
                        <h3 className="font-semibold mb-1">{badge.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{badge.description}</p>
                        <Badge variant="outline">{badge.category}</Badge>
                        <p className="text-xs text-muted-foreground mt-2">
                          Earned {new Date(badge.earnedDate).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals">
            <div className="space-y-4">
              {goals.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No goals set</h3>
                    <p className="text-muted-foreground mb-4">
                      Set learning goals to track your progress!
                    </p>
                    <Button>Set Your First Goal</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <Card key={goal.id} className={goal.isCompleted ? 'border-green-200 bg-green-50 dark:bg-green-900/20' : ''}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {goal.isCompleted ? (
                              <CheckCircle className="h-6 w-6 text-green-500" />
                            ) : (
                              <Target className="h-6 w-6 text-blue-500" />
                            )}
                            <div>
                              <h3 className="font-semibold">{goal.title}</h3>
                              <p className="text-sm text-muted-foreground">{goal.description}</p>
                            </div>
                          </div>
                          <Badge variant="outline">{goal.category}</Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{goal.current} / {goal.target} {goal.unit}</span>
                          </div>
                          <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                          {goal.deadline && !goal.isCompleted && (
                            <p className="text-xs text-muted-foreground">
                              Due: {new Date(goal.deadline).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

        <Footer />
      </div>
    </div>
  );
};

export default StudentAchievements;