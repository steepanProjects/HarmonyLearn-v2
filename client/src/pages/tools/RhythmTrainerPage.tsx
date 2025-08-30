import { useState, useEffect } from "react";
import { StudentNavigation } from "@/components/student/StudentNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Zap, ArrowLeft, Play, Pause, RotateCcw, Target, Volume2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { getCurrentUser, isAuthenticated } from "@/lib/auth";

export default function RhythmTrainerPage() {
  const [currentUser] = useState(getCurrentUser());
  const [, setLocation] = useLocation();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation('/');
    }
  }, [setLocation]);

  const [selectedPattern, setSelectedPattern] = useState("basic-4-4");
  const [difficulty, setDifficulty] = useState("beginner");
  const [tempo, setTempo] = useState("100");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [exerciseMode, setExerciseMode] = useState("listen");
  const [userTaps, setUserTaps] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  const rhythmPatterns = {
    "basic-4-4": {
      name: "Basic 4/4",
      pattern: [1, 0, 1, 0, 1, 0, 1, 0],
      timeSignature: "4/4",
      description: "Quarter notes on the beat"
    },
    "syncopated": {
      name: "Syncopated",
      pattern: [1, 0, 0, 1, 0, 1, 0, 0],
      timeSignature: "4/4", 
      description: "Off-beat emphasis"
    },
    "triplets": {
      name: "Triplets",
      pattern: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0],
      timeSignature: "4/4",
      description: "Eighth note triplets"
    },
    "dotted": {
      name: "Dotted Rhythms",
      pattern: [1, 0, 0, 1, 0, 1, 0, 0],
      timeSignature: "4/4",
      description: "Dotted quarter and eighth notes"
    },
    "complex": {
      name: "Complex Pattern",
      pattern: [1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0],
      timeSignature: "4/4",
      description: "Mixed note values"
    }
  };

  const currentPattern = rhythmPatterns[selectedPattern as keyof typeof rhythmPatterns];

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setCurrentBeat(0);
      setUserTaps([]);
    }
  };

  const resetExercise = () => {
    setIsPlaying(false);
    setCurrentBeat(0);
    setUserTaps([]);
    setScore(0);
  };

  const handleTap = () => {
    if (exerciseMode === "tap") {
      const tapTime = Date.now();
      setUserTaps(prev => [...prev, tapTime]);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentBeat(prev => (prev + 1) % currentPattern.pattern.length);
      }, (60 / parseInt(tempo)) * 1000 / (currentPattern.pattern.length / 4));

      return () => clearInterval(interval);
    }
  }, [isPlaying, tempo, currentPattern]);

  const exerciseStats = {
    accuracy: 87,
    patternsCompleted: 23,
    practiceTime: "18 min",
    bestStreak: 12
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
              <Badge variant="secondary">Theory & Training</Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Zap className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              Rhythm Trainer
            </h1>
            <p className="text-muted-foreground">
              Develop your rhythmic skills with pattern recognition and tap exercises
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Rhythm Display */}
            <div className="lg:col-span-2 space-y-6">
              {/* Rhythm Pattern Visualizer */}
              <Card className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">{currentPattern.name}</h2>
                  <div className="flex justify-center gap-2 mb-4">
                    <Badge variant="outline">{currentPattern.timeSignature}</Badge>
                    <Badge variant="outline">{tempo} BPM</Badge>
                  </div>
                  <p className="text-muted-foreground mb-6">{currentPattern.description}</p>
                  
                  {/* Rhythm Visual */}
                  <div className="bg-muted/30 rounded-2xl p-6 mb-6">
                    <div className="flex justify-center gap-2 flex-wrap mb-4">
                      {currentPattern.pattern.map((beat, index) => (
                        <div
                          key={index}
                          className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 ${
                            isPlaying && currentBeat === index
                              ? 'bg-yellow-600 text-white scale-110 shadow-lg'
                              : beat === 1
                              ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 border-2 border-yellow-300'
                              : 'bg-muted border-2 border-muted-foreground/20'
                          }`}
                        >
                          {beat === 1 && (
                            <div className={`w-3 h-3 rounded-full ${
                              isPlaying && currentBeat === index ? 'bg-white' : 'bg-yellow-600 dark:bg-yellow-400'
                            }`} />
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Beat Counter */}
                    <div className="text-sm text-muted-foreground mb-4">
                      Beat {Math.floor(currentBeat / (currentPattern.pattern.length / 4)) + 1} of 4
                    </div>
                    
                    {/* Progress Bar */}
                    <Progress 
                      value={(currentBeat / currentPattern.pattern.length) * 100} 
                      className="h-2"
                    />
                  </div>

                  {/* Control Buttons */}
                  <div className="flex justify-center gap-4 mb-6">
                    <Button
                      size="lg"
                      onClick={togglePlayback}
                      className="w-20 h-20 rounded-full"
                    >
                      {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={resetExercise}
                      className="w-20 h-20 rounded-full"
                    >
                      <RotateCcw className="h-6 w-6" />
                    </Button>
                  </div>

                  {/* Tap Area (for tap exercises) */}
                  {exerciseMode === "tap" && (
                    <div className="mt-6">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full h-24 text-xl"
                        onClick={handleTap}
                        disabled={!isPlaying}
                      >
                        TAP HERE
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        Tap along with the rhythm pattern
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Exercise Stats */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg">Session Progress</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{exerciseStats.accuracy}%</div>
                      <div className="text-xs text-muted-foreground">Accuracy</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{exerciseStats.patternsCompleted}</div>
                      <div className="text-xs text-muted-foreground">Patterns Done</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{exerciseStats.practiceTime}</div>
                      <div className="text-xs text-muted-foreground">Practice Time</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{exerciseStats.bestStreak}</div>
                      <div className="text-xs text-muted-foreground">Best Streak</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Settings & Pattern Library */}
            <div className="space-y-6">
              {/* Exercise Settings */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg">Exercise Settings</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Pattern</label>
                    <Select value={selectedPattern} onValueChange={setSelectedPattern}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic-4-4">Basic 4/4</SelectItem>
                        <SelectItem value="syncopated">Syncopated</SelectItem>
                        <SelectItem value="triplets">Triplets</SelectItem>
                        <SelectItem value="dotted">Dotted Rhythms</SelectItem>
                        <SelectItem value="complex">Complex Pattern</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Exercise Mode</label>
                    <Select value={exerciseMode} onValueChange={setExerciseMode}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="listen">Listen Mode</SelectItem>
                        <SelectItem value="tap">Tap Along</SelectItem>
                        <SelectItem value="quiz">Rhythm Quiz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Difficulty</label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Tempo (BPM)</label>
                    <Select value={tempo} onValueChange={setTempo}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="60">60 BPM (Very Slow)</SelectItem>
                        <SelectItem value="80">80 BPM (Slow)</SelectItem>
                        <SelectItem value="100">100 BPM (Medium)</SelectItem>
                        <SelectItem value="120">120 BPM (Moderate)</SelectItem>
                        <SelectItem value="140">140 BPM (Fast)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <CardContent className="p-0 space-y-3">
                  <Button variant="outline" className="w-full gap-2">
                    <Volume2 className="h-4 w-4" />
                    Play Pattern
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Target className="h-4 w-4" />
                    Random Pattern
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Zap className="h-4 w-4" />
                    Challenge Mode
                  </Button>
                </CardContent>
              </Card>

              {/* Pattern Info */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg">Pattern Details</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Name:</span> {currentPattern.name}
                  </div>
                  <div>
                    <span className="font-medium">Time Signature:</span> {currentPattern.timeSignature}
                  </div>
                  <div>
                    <span className="font-medium">Beats:</span> {currentPattern.pattern.filter(b => b === 1).length}
                  </div>
                  <div>
                    <span className="font-medium">Total Length:</span> {currentPattern.pattern.length} subdivisions
                  </div>
                  <div className="pt-2">
                    <Badge variant="outline" className="text-xs">
                      {difficulty} level
                    </Badge>
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