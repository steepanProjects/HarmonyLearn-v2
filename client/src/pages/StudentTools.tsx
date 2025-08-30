import { useState, useEffect } from "react";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Music, 
  Timer, 
  Target, 
  Radio, 
  Play, 
  Pause, 
  Volume2, 
  Settings, 
  Headphones, 
  RotateCcw,
  Zap,
  Clock,
  BookOpen,
  Mic,
  Circle,
  Square,
  Download
} from "lucide-react";

export default function StudentTools() {
  // State for all tools
  const [bpm, setBpm] = useState<number[]>([120]);
  const [timeSignature, setTimeSignature] = useState("4/4");
  const [metronomeActive, setMetronomeActive] = useState(false);
  
  const [practiceTime, setPracticeTime] = useState(25);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);
  
  const [selectedScale, setSelectedScale] = useState("C Major");
  const [scaleMode, setScaleMode] = useState("ascending");
  
  const [tunerNote, setTunerNote] = useState("A4");
  const [tunerFrequency] = useState("440 Hz");

  const [selectedKey, setSelectedKey] = useState("C");
  const [selectedChordProgression, setSelectedChordProgression] = useState("I-V-vi-IV");
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining]);

  // Recording timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(time => time + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Sample data
  const practiceStats = {
    todayTime: 25,
    averageSession: 32,
    streakDays: 7
  };

  const chordProgressions = [
    { name: "I-V-vi-IV", chords: ["C", "G", "Am", "F"], description: "Pop progression" },
    { name: "ii-V-I", chords: ["Dm", "G", "C"], description: "Jazz standard" },
    { name: "I-vi-ii-V", chords: ["C", "Am", "Dm", "G"], description: "Circle progression" },
    { name: "I-IV-V", chords: ["C", "F", "G"], description: "Blues progression" }
  ];

  const recentSessions = [
    { id: 1, tool: "Metronome", duration: 15, exercises: 3, date: "Today" },
    { id: 2, tool: "Scale Trainer", duration: 20, exercises: 5, date: "Yesterday" },
    { id: 3, tool: "Tuner", duration: 8, exercises: 2, date: "2 days ago" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <StudentSidebar />
        
        <div className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Practice Tools</h1>
              <p className="text-muted-foreground">Professional tools to enhance your practice sessions</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{practiceStats.todayTime}m</p>
                      <p className="text-xs text-muted-foreground">Today's Practice</p>
                    </div>
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{practiceStats.averageSession}m</p>
                      <p className="text-xs text-muted-foreground">Average Session</p>
                    </div>
                    <Timer className="h-6 w-6 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{practiceStats.streakDays}</p>
                      <p className="text-xs text-muted-foreground">Day Streak</p>
                    </div>
                    <Zap className="h-6 w-6 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Practice Essentials */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Practice Essentials</h2>
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Metronome Tool */}
                <Card className="border-blue-200 dark:border-blue-800 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Music className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      Metronome
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* BPM Display */}
                    <div className="text-center bg-muted/30 rounded-lg p-4">
                      <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                        {bpm[0]}
                      </div>
                      <div className="text-sm text-muted-foreground">BPM • {timeSignature}</div>
                    </div>

                    {/* BPM Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>40</span>
                        <span>220</span>
                      </div>
                      <Slider
                        value={bpm}
                        onValueChange={setBpm}
                        max={220}
                        min={40}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2">
                      <Select value={timeSignature} onValueChange={setTimeSignature}>
                        <SelectTrigger className="w-16 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4/4">4/4</SelectItem>
                          <SelectItem value="3/4">3/4</SelectItem>
                          <SelectItem value="2/4">2/4</SelectItem>
                          <SelectItem value="6/8">6/8</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        size="sm"
                        onClick={() => setMetronomeActive(!metronomeActive)}
                        className="flex-1"
                      >
                        {metronomeActive ? (
                          <>
                            <Pause className="h-4 w-4 mr-1" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            Start
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Chromatic Tuner */}
                <Card className="border-green-200 dark:border-green-800 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      Chromatic Tuner
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Tuner Display */}
                    <div className="text-center bg-muted/30 rounded-lg p-4">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                        {tunerNote}
                      </div>
                      <div className="text-sm text-muted-foreground">{tunerFrequency}</div>
                    </div>
                    
                    {/* Tuning indicator */}
                    <div className="w-full">
                      <div className="h-4 bg-muted rounded-full relative">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-green-600 rounded-full"></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>♭</span>
                        <span>Perfect</span>
                        <span>♯</span>
                      </div>
                    </div>

                    {/* Note Selection */}
                    <div className="grid grid-cols-7 gap-1">
                      {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((note) => (
                        <Button
                          key={note}
                          variant={tunerNote.startsWith(note) ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTunerNote(`${note}4`)}
                          className="h-8 text-xs"
                        >
                          {note}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Scale Trainer */}
                <Card className="border-purple-200 dark:border-purple-800 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                        <Music className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      Scale Trainer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">Scale</Label>
                        <Select value={selectedScale} onValueChange={setSelectedScale}>
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="C Major">C Major</SelectItem>
                            <SelectItem value="G Major">G Major</SelectItem>
                            <SelectItem value="D Major">D Major</SelectItem>
                            <SelectItem value="A Major">A Major</SelectItem>
                            <SelectItem value="A minor">A minor</SelectItem>
                            <SelectItem value="E minor">E minor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-xs">Mode</Label>
                        <Select value={scaleMode} onValueChange={setScaleMode}>
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ascending">Ascending</SelectItem>
                            <SelectItem value="descending">Descending</SelectItem>
                            <SelectItem value="both">Both</SelectItem>
                            <SelectItem value="random">Random</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Note sequence */}
                    <div className="flex justify-center gap-1">
                      {['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'].map((note, index) => (
                        <div key={index} className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                          {note}
                        </div>
                      ))}
                    </div>

                    <Button size="sm" className="w-full">
                      <Play className="h-4 w-4 mr-1" />
                      Play Scale
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Theory & Training Tools */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Theory & Training</h2>
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Practice Timer */}
                <Card className="border-orange-200 dark:border-orange-800 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                        <Timer className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      Practice Timer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center bg-muted/30 rounded-lg p-4">
                      <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                        {formatTime(timeRemaining)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {timerActive ? "Active" : "Ready"}
                      </div>
                      <div className="w-full bg-muted rounded-full h-1 mt-2">
                        <div 
                          className="bg-orange-500 h-1 rounded-full transition-all" 
                          style={{ width: `${((practiceTime * 60 - timeRemaining) / (practiceTime * 60)) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-1">
                      {[15, 25, 45, 60].map((minutes) => (
                        <Button
                          key={minutes}
                          variant={practiceTime === minutes ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setPracticeTime(minutes);
                            setTimeRemaining(minutes * 60);
                          }}
                          className="h-8 text-xs"
                        >
                          {minutes}m
                        </Button>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => setTimerActive(!timerActive)}
                        className="flex-1"
                      >
                        {timerActive ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                        {timerActive ? "Pause" : "Start"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setTimerActive(false);
                          setTimeRemaining(practiceTime * 60);
                        }}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Interval Trainer */}
                <Card className="border-yellow-200 dark:border-yellow-800 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                        <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      Interval Trainer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center bg-muted/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                        Perfect 5th
                      </div>
                      <div className="text-sm text-muted-foreground">C - G</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4 mr-1" />
                        Play
                      </Button>
                      <Button size="sm" variant="outline">
                        <Volume2 className="h-4 w-4 mr-1" />
                        Together
                      </Button>
                    </div>

                    <Button size="sm" className="w-full">
                      Next Interval
                    </Button>
                  </CardContent>
                </Card>

                {/* Chord Progressions */}
                <Card className="border-indigo-200 dark:border-indigo-800 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                        <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      Chord Progressions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-xs">Key</Label>
                      <Select value={selectedKey} onValueChange={setSelectedKey}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="C">C Major</SelectItem>
                          <SelectItem value="G">G Major</SelectItem>
                          <SelectItem value="D">D Major</SelectItem>
                          <SelectItem value="A">A Major</SelectItem>
                          <SelectItem value="Am">A minor</SelectItem>
                          <SelectItem value="Em">E minor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs">Progression</Label>
                      <Select value={selectedChordProgression} onValueChange={setSelectedChordProgression}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {chordProgressions.map((prog) => (
                            <SelectItem key={prog.name} value={prog.name}>{prog.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="text-center bg-muted/30 rounded-lg p-3">
                      <div className="text-sm font-medium mb-1">
                        {chordProgressions.find(p => p.name === selectedChordProgression)?.chords.join(" - ") || "C - G - Am - F"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {chordProgressions.find(p => p.name === selectedChordProgression)?.description || "Pop progression"}
                      </div>
                    </div>

                    <Button size="sm" className="w-full">
                      <Play className="h-4 w-4 mr-1" />
                      Play Progression
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recording & Analysis Tools */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Recording & Analysis</h2>
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Practice Recorder */}
                <Card className="border-pink-200 dark:border-pink-800 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-lg">
                        <Mic className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                      </div>
                      Practice Recorder
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center bg-muted/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-1">
                        {formatTime(recordingTime)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isRecording ? "Recording..." : "Ready to Record"}
                      </div>
                      {isRecording && (
                        <div className="flex justify-center mt-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>

                    <Button
                      size="sm"
                      onClick={() => setIsRecording(!isRecording)}
                      className="w-full"
                      variant={isRecording ? "destructive" : "default"}
                    >
                      {isRecording ? (
                        <>
                          <Square className="h-4 w-4 mr-1" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Circle className="h-4 w-4 mr-1" />
                          Start Recording
                        </>
                      )}
                    </Button>

                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Recent recordings will appear here</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Rhythm Trainer */}
                <Card className="border-red-200 dark:border-red-800 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                        <Circle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      Rhythm Trainer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center bg-muted/30 rounded-lg p-4">
                      <div className="text-lg font-bold text-red-600 dark:text-red-400 mb-1">
                        4/4 Pattern
                      </div>
                      <div className="text-sm text-muted-foreground">♩ ♪♪ ♩ ♪♪</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4 mr-1" />
                        Play
                      </Button>
                      <Button size="sm" variant="outline">
                        Practice
                      </Button>
                    </div>

                    <Button size="sm" className="w-full">
                      Next Pattern
                    </Button>
                  </CardContent>
                </Card>

                {/* Pitch Analyzer */}
                <Card className="border-teal-200 dark:border-teal-800 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg">
                        <Volume2 className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                      </div>
                      Pitch Analyzer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center bg-muted/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-1">
                        A4
                      </div>
                      <div className="text-sm text-muted-foreground">442 Hz (+4¢)</div>
                    </div>

                    <div className="w-full h-16 bg-muted/30 rounded-lg flex items-center justify-center">
                      <div className="text-sm text-muted-foreground">Pitch visualization</div>
                    </div>

                    <Button size="sm" className="w-full">
                      <Mic className="h-4 w-4 mr-1" />
                      Start Analysis
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recent Practice Sidebar */}
            <div className="grid lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Recent Practice</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentSessions.map((session) => (
                        <div key={session.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-sm">{session.tool}</h4>
                            <span className="text-xs text-muted-foreground">{session.date}</span>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{session.duration} min</span>
                            <span>{session.exercises} exercises</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}