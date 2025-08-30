import { useState, useEffect } from "react";
import { StudentNavigation } from "@/components/student/StudentNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Music2, ArrowLeft, Play, Pause, Volume2, RotateCcw, Target } from "lucide-react";
import { Link, useLocation } from "wouter";
import { getCurrentUser, isAuthenticated } from "@/lib/auth";

export default function ScaleTrainerPage() {
  const [currentUser] = useState(getCurrentUser());
  const [, setLocation] = useLocation();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation('/');
    }
  }, [setLocation]);

  const [selectedScale, setSelectedScale] = useState("C-major");
  const [scaleMode, setScaleMode] = useState("ascending");
  const [tempo, setTempo] = useState("120");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNote, setCurrentNote] = useState(0);
  const [exerciseType, setExerciseType] = useState("practice");

  const scales = {
    "C-major": { name: "C Major", notes: ["C", "D", "E", "F", "G", "A", "B", "C"], mode: "Ionian" },
    "C-minor": { name: "C Minor", notes: ["C", "D", "Eb", "F", "G", "Ab", "Bb", "C"], mode: "Natural Minor" },
    "C-pentatonic": { name: "C Pentatonic", notes: ["C", "D", "E", "G", "A", "C"], mode: "Pentatonic" },
    "C-blues": { name: "C Blues", notes: ["C", "Eb", "F", "Gb", "G", "Bb", "C"], mode: "Blues" },
    "G-major": { name: "G Major", notes: ["G", "A", "B", "C", "D", "E", "F#", "G"], mode: "Ionian" },
    "D-dorian": { name: "D Dorian", notes: ["D", "E", "F", "G", "A", "B", "C", "D"], mode: "Dorian" },
    "E-phrygian": { name: "E Phrygian", notes: ["E", "F", "G", "A", "B", "C", "D", "E"], mode: "Phrygian" },
    "F-lydian": { name: "F Lydian", notes: ["F", "G", "A", "B", "C", "D", "E", "F"], mode: "Lydian" },
    "A-mixolydian": { name: "A Mixolydian", notes: ["A", "B", "C#", "D", "E", "F#", "G", "A"], mode: "Mixolydian" }
  };

  const currentScale = scales[selectedScale as keyof typeof scales];
  const displayNotes = scaleMode === "descending" ? [...currentScale.notes].reverse() : currentScale.notes;

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setCurrentNote(0);
    }
  };

  const resetExercise = () => {
    setIsPlaying(false);
    setCurrentNote(0);
  };

  const exerciseStats = {
    accuracy: 92,
    completedScales: 15,
    practiceTime: "12 min",
    streak: 5
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
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Music2 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              Scale Trainer
            </h1>
            <p className="text-muted-foreground">
              Master scales and modes with interactive exercises and audio playback
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Scale Display */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Scale */}
              <Card className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold mb-2">{currentScale.name}</h2>
                  <Badge variant="outline" className="mb-4">{currentScale.mode}</Badge>
                  
                  {/* Scale Notes Visual */}
                  <div className="bg-muted/30 rounded-2xl p-6 mb-6">
                    <div className="flex justify-center gap-3 flex-wrap">
                      {displayNotes.map((note, index) => (
                        <div
                          key={index}
                          className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                            isPlaying && currentNote === index
                              ? 'bg-purple-600 text-white scale-110 shadow-lg'
                              : index === 0 || index === displayNotes.length - 1
                              ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'
                              : 'bg-muted border-2 border-muted-foreground/30'
                          }`}
                        >
                          {note}
                        </div>
                      ))}
                    </div>
                    
                    {/* Progress Bar */}
                    {isPlaying && (
                      <div className="mt-4">
                        <Progress 
                          value={(currentNote / (displayNotes.length - 1)) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}
                  </div>

                  {/* Control Buttons */}
                  <div className="flex justify-center gap-4">
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
                </div>
              </Card>

              {/* Exercise Stats */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg">Today's Progress</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{exerciseStats.accuracy}%</div>
                      <div className="text-xs text-muted-foreground">Accuracy</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{exerciseStats.completedScales}</div>
                      <div className="text-xs text-muted-foreground">Scales Practiced</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{exerciseStats.practiceTime}</div>
                      <div className="text-xs text-muted-foreground">Practice Time</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{exerciseStats.streak}</div>
                      <div className="text-xs text-muted-foreground">Day Streak</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Settings & Scale Library */}
            <div className="space-y-6">
              {/* Exercise Settings */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg">Exercise Settings</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Scale</label>
                    <Select value={selectedScale} onValueChange={setSelectedScale}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="C-major">C Major</SelectItem>
                        <SelectItem value="C-minor">C Minor</SelectItem>
                        <SelectItem value="C-pentatonic">C Pentatonic</SelectItem>
                        <SelectItem value="C-blues">C Blues</SelectItem>
                        <SelectItem value="G-major">G Major</SelectItem>
                        <SelectItem value="D-dorian">D Dorian</SelectItem>
                        <SelectItem value="E-phrygian">E Phrygian</SelectItem>
                        <SelectItem value="F-lydian">F Lydian</SelectItem>
                        <SelectItem value="A-mixolydian">A Mixolydian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Direction</label>
                    <Select value={scaleMode} onValueChange={setScaleMode}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ascending">Ascending</SelectItem>
                        <SelectItem value="descending">Descending</SelectItem>
                        <SelectItem value="both">Both Directions</SelectItem>
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
                        <SelectItem value="60">60 BPM (Slow)</SelectItem>
                        <SelectItem value="80">80 BPM</SelectItem>
                        <SelectItem value="100">100 BPM</SelectItem>
                        <SelectItem value="120">120 BPM (Medium)</SelectItem>
                        <SelectItem value="140">140 BPM</SelectItem>
                        <SelectItem value="160">160 BPM (Fast)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Exercise Type</label>
                    <Select value={exerciseType} onValueChange={setExerciseType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="practice">Practice Mode</SelectItem>
                        <SelectItem value="quiz">Scale Quiz</SelectItem>
                        <SelectItem value="ear-training">Ear Training</SelectItem>
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
                    Play Scale
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Target className="h-4 w-4" />
                    Random Scale
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Music2 className="h-4 w-4" />
                    Practice Arpeggios
                  </Button>
                </CardContent>
              </Card>

              {/* Scale Theory */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg">Scale Information</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Mode:</span> {currentScale.mode}
                  </div>
                  <div>
                    <span className="font-medium">Pattern:</span> {
                      selectedScale.includes('major') ? 'W-W-H-W-W-W-H' :
                      selectedScale.includes('minor') ? 'W-H-W-W-H-W-W' :
                      selectedScale.includes('pentatonic') ? 'W-W-W+H-W-W+H' :
                      selectedScale.includes('blues') ? 'W+H-W-H-H-W+H-W' :
                      'Various patterns'
                    }
                  </div>
                  <div>
                    <span className="font-medium">Notes:</span> {currentScale.notes.join(' - ')}
                  </div>
                  <div className="pt-2">
                    <Badge variant="outline" className="text-xs">
                      {currentScale.notes.length} notes
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