import { useState, useEffect, useRef } from "react";
import { StudentNavigation } from "@/components/student/StudentNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Target, ArrowLeft, Mic, Volume2, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";
import { getCurrentUser, isAuthenticated } from "@/lib/auth";

export default function TunerPage() {
  const [currentUser] = useState(getCurrentUser());
  const [, setLocation] = useLocation();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation('/');
    }
  }, [setLocation]);

  const [isListening, setIsListening] = useState(false);
  const [detectedNote, setDetectedNote] = useState("A");
  const [detectedOctave, setDetectedOctave] = useState("4");
  const [cents, setCents] = useState(0);
  const [frequency, setFrequency] = useState(440.0);
  const [targetNote, setTargetNote] = useState("A4");
  const [tuningMode, setTuningMode] = useState("chromatic");
  const [instrument, setInstrument] = useState("guitar");

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const noteFrequencies = {
    'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
    'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
    'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
  };

  const instrumentTunings = {
    guitar: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
    bass: ['E1', 'A1', 'D2', 'G2'],
    violin: ['G3', 'D4', 'A4', 'E5'],
    ukulele: ['G4', 'C4', 'E4', 'A4']
  };

  const startTuner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      microphoneRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 4096;
      
      setIsListening(true);
      updatePitch();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopTuner = () => {
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsListening(false);
  };

  const updatePitch = () => {
    if (!analyserRef.current || !isListening) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    analyserRef.current.getFloatFrequencyData(dataArray);

    // Simplified pitch detection (in real implementation, use autocorrelation)
    const detectedFreq = 440 + (Math.random() - 0.5) * 20; // Mock detection
    setFrequency(detectedFreq);
    
    // Calculate closest note and cents deviation
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const A4 = 440;
    const C0 = A4 * Math.pow(2, -4.75);
    
    const h = Math.round(12 * Math.log2(detectedFreq / C0));
    const octave = Math.floor(h / 12);
    const n = h % 12;
    const noteName = noteNames[n];
    
    setDetectedNote(noteName);
    setDetectedOctave(String(octave));
    
    // Calculate cents
    const expectedFreq = C0 * Math.pow(2, h / 12);
    const centDeviation = 1200 * Math.log2(detectedFreq / expectedFreq);
    setCents(Math.round(centDeviation));

    if (isListening) {
      requestAnimationFrame(updatePitch);
    }
  };

  const getTuningStatus = () => {
    if (Math.abs(cents) < 5) return { status: 'perfect', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900' };
    if (Math.abs(cents) < 15) return { status: 'close', color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900' };
    return { status: 'off', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900' };
  };

  const tuningStatus = getTuningStatus();

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
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              Chromatic Tuner
            </h1>
            <p className="text-muted-foreground">
              Precise tuning for all instruments with real-time visual feedback and custom tunings
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Tuner Display */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <div className="text-center mb-8">
                  {/* Note Display */}
                  <div className={`rounded-2xl p-8 mb-6 ${tuningStatus.bg}`}>
                    <div className={`text-6xl font-bold mb-2 ${tuningStatus.color}`}>
                      {detectedNote}<sub className="text-3xl">{detectedOctave}</sub>
                    </div>
                    <div className="text-lg text-muted-foreground mb-4">
                      {frequency.toFixed(1)} Hz
                    </div>
                    
                    {/* Cents Indicator */}
                    <div className="space-y-3">
                      <div className={`text-2xl font-semibold ${tuningStatus.color}`}>
                        {cents > 0 ? '+' : ''}{cents} cents
                      </div>
                      
                      {/* Visual Tuning Meter */}
                      <div className="relative w-full max-w-md mx-auto">
                        <div className="h-6 bg-muted/30 rounded-full relative overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-0.5 h-full bg-foreground/50"></div>
                          </div>
                          <div 
                            className={`h-full rounded-full transition-all duration-200 ${
                              Math.abs(cents) < 5 ? 'bg-green-500' :
                              Math.abs(cents) < 15 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{
                              width: `${Math.min(Math.abs(cents) / 50 * 50, 50)}%`,
                              marginLeft: cents < 0 ? 'auto' : '0',
                              marginRight: cents < 0 ? '0' : 'auto'
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>-50¢</span>
                          <span>0¢</span>
                          <span>+50¢</span>
                        </div>
                      </div>
                    </div>

                    {/* Tuning Status */}
                    <div className="mt-4">
                      <Badge variant={tuningStatus.status === 'perfect' ? 'default' : 'secondary'} className="text-sm">
                        {tuningStatus.status === 'perfect' && 'Perfect Pitch!'}
                        {tuningStatus.status === 'close' && 'Almost There'}
                        {tuningStatus.status === 'off' && (cents > 0 ? 'Too High' : 'Too Low')}
                      </Badge>
                    </div>
                  </div>

                  {/* Start/Stop Button */}
                  <Button
                    size="lg"
                    onClick={isListening ? stopTuner : startTuner}
                    className="w-32 h-16 text-lg"
                    variant={isListening ? "destructive" : "default"}
                  >
                    <Mic className="h-6 w-6 mr-2" />
                    {isListening ? 'Stop' : 'Start'}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Settings & Instrument Tunings */}
            <div className="space-y-6">
              {/* Settings */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tuning Mode</label>
                    <Select value={tuningMode} onValueChange={setTuningMode}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chromatic">Chromatic</SelectItem>
                        <SelectItem value="instrument">Instrument Specific</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Instrument</label>
                    <Select value={instrument} onValueChange={setInstrument}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="guitar">Guitar</SelectItem>
                        <SelectItem value="bass">Bass Guitar</SelectItem>
                        <SelectItem value="violin">Violin</SelectItem>
                        <SelectItem value="ukulele">Ukulele</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Reference Pitch</label>
                    <Select value="440" onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="440">A4 = 440 Hz</SelectItem>
                        <SelectItem value="442">A4 = 442 Hz</SelectItem>
                        <SelectItem value="443">A4 = 443 Hz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Instrument Tuning Guide */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg capitalize">{instrument} Tuning</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-3">
                  {instrumentTunings[instrument as keyof typeof instrumentTunings].map((note, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <span className="font-medium">String {index + 1}</span>
                      <Badge variant="outline" className="font-mono">
                        {note}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <CardContent className="p-0 space-y-3">
                  <Button variant="outline" className="w-full gap-2">
                    <Volume2 className="h-4 w-4" />
                    Play Reference Tone
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Target className="h-4 w-4" />
                    Auto-Tune Mode
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}