import { useState, useEffect } from "react";
import { StudentNavigation } from "@/components/student/StudentNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Music, Play, Pause, Settings, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { getCurrentUser, isAuthenticated } from "@/lib/auth";

export default function MetronomePage() {
  const [currentUser] = useState(getCurrentUser());
  const [, setLocation] = useLocation();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation('/');
    }
  }, [setLocation]);

  const [bpm, setBpm] = useState<number[]>([120]);
  const [timeSignature, setTimeSignature] = useState("4/4");
  const [isPlaying, setIsPlaying] = useState(false);
  const [accentPattern, setAccentPattern] = useState("strong-weak");
  const [volume, setVolume] = useState<number[]>([80]);

  // Audio context and scheduling
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [nextNoteTime, setNextNoteTime] = useState(0);
  const [currentBeat, setCurrentBeat] = useState(0);

  useEffect(() => {
    if (isPlaying && !audioContext) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(ctx);
      setNextNoteTime(ctx.currentTime);
    }
  }, [isPlaying, audioContext]);

  const playClick = (isAccent: boolean = false) => {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = isAccent ? 1000 : 800;
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume[0] / 100, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const scheduleNote = () => {
    if (!audioContext) return;

    const secondsPerBeat = 60.0 / bpm[0];
    const beatsPerMeasure = parseInt(timeSignature.split('/')[0]);

    while (nextNoteTime < audioContext.currentTime + 0.1) {
      const isAccent = currentBeat === 0;
      playClick(isAccent);
      
      setCurrentBeat((prev) => (prev + 1) % beatsPerMeasure);
      setNextNoteTime(nextNoteTime + secondsPerBeat);
    }
  };

  useEffect(() => {
    if (isPlaying && audioContext) {
      const timer = setInterval(scheduleNote, 25);
      return () => clearInterval(timer);
    }
  }, [isPlaying, audioContext, nextNoteTime, currentBeat, bpm, timeSignature]);

  const toggleMetronome = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setCurrentBeat(0);
    }
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
              <Badge variant="secondary">Practice Essential</Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Music className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              Professional Metronome
            </h1>
            <p className="text-muted-foreground">
              Keep perfect time with our advanced metronome featuring customizable beats and accent patterns
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Metronome Control */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <div className="text-center mb-8">
                  {/* BPM Display */}
                  <div className="bg-muted/30 rounded-2xl p-8 mb-6">
                    <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {bpm[0]}
                    </div>
                    <div className="text-lg text-muted-foreground">BPM • {timeSignature}</div>
                    
                    {/* Beat Indicator */}
                    <div className="flex justify-center gap-2 mt-4">
                      {Array.from({ length: parseInt(timeSignature.split('/')[0]) }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-4 h-4 rounded-full transition-all duration-100 ${
                            isPlaying && currentBeat === i
                              ? 'bg-blue-600 scale-125'
                              : 'bg-muted-foreground/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Play/Pause Button */}
                  <Button
                    size="lg"
                    onClick={toggleMetronome}
                    className="w-20 h-20 rounded-full text-2xl"
                  >
                    {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                  </Button>
                </div>

                {/* BPM Control */}
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-3 block">Tempo (BPM)</label>
                    <Slider
                      value={bpm}
                      onValueChange={setBpm}
                      max={200}
                      min={40}
                      step={1}
                      className="mb-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>40</span>
                      <span>120</span>
                      <span>200</span>
                    </div>
                  </div>

                  {/* Quick BPM Buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    {[60, 80, 100, 120, 140, 160, 180, 200].map((tempo) => (
                      <Button
                        key={tempo}
                        variant={bpm[0] === tempo ? "default" : "outline"}
                        size="sm"
                        onClick={() => setBpm([tempo])}
                      >
                        {tempo}
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Settings Panel */}
            <div className="space-y-6">
              {/* Time Signature */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Time Signature</label>
                    <Select value={timeSignature} onValueChange={setTimeSignature}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2/4">2/4</SelectItem>
                        <SelectItem value="3/4">3/4</SelectItem>
                        <SelectItem value="4/4">4/4</SelectItem>
                        <SelectItem value="5/4">5/4</SelectItem>
                        <SelectItem value="6/8">6/8</SelectItem>
                        <SelectItem value="7/8">7/8</SelectItem>
                        <SelectItem value="9/8">9/8</SelectItem>
                        <SelectItem value="12/8">12/8</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Accent Pattern</label>
                    <Select value={accentPattern} onValueChange={setAccentPattern}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strong-weak">Strong-Weak</SelectItem>
                        <SelectItem value="all-strong">All Strong</SelectItem>
                        <SelectItem value="no-accent">No Accent</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">Volume</label>
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={100}
                      min={0}
                      step={5}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Tempo Markings Reference */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg">Tempo Guide</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Largo</span>
                    <span>40-60 BPM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Adagio</span>
                    <span>66-76 BPM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Andante</span>
                    <span>76-108 BPM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Moderato</span>
                    <span>108-120 BPM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Allegro</span>
                    <span>120-168 BPM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Presto</span>
                    <span>168-200 BPM</span>
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