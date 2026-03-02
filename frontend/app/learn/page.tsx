'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Mic, MicOff, VideoOff, Play, StopCircle } from 'lucide-react';

export default function LearnPage() {
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('cooking');
  const [language, setLanguage] = useState('id');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [agentResponse, setAgentResponse] = useState('');
  const [sessionId, setSessionId] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const skills = [
    { id: 'cooking', name: 'Cooking', description: 'Learn to cook Nasi Goreng and other dishes' },
    { id: 'repair', name: 'Repair', description: 'Motorcycle and electronics repair' },
    { id: 'farming', name: 'Farming', description: 'Hydroponics and agricultural skills' },
    { id: 'crafts', name: 'Crafts', description: 'Batik, woodwork, and traditional crafts' },
  ];

  const languages = [
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
  ];

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      mediaStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsStreamActive(true);
      console.log('Camera started successfully');
    } catch (error) {
      console.error('Error starting camera:', error);
      alert('Failed to access camera and microphone. Please ensure permissions are granted.');
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsStreamActive(false);
    console.log('Camera stopped');
  };

  const toggleAudio = () => {
    if (mediaStreamRef.current) {
      const audioTracks = mediaStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    if (mediaStreamRef.current) {
      const videoTracks = mediaStreamRef.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const startSession = async () => {
    try {
      const response = await fetch('/api/gemini-live/session/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'demo-user',
          skill: selectedSkill,
          language,
        }),
      });

      const data = await response.json();
      setSessionId(data.data.id);
      console.log('Session started:', data.data);
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const stopSession = async () => {
    if (!sessionId) return;

    try {
      await fetch(`/api/gemini-live/session/${sessionId}/stop`, {
        method: 'POST',
      });
      console.log('Session stopped');
    } catch (error) {
      console.error('Error stopping session:', error);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Learn with HandsOnLive</h1>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Panel: Video Stream */}
            <Card>
              <CardHeader>
                <CardTitle>Live Video Stream</CardTitle>
                <CardDescription>Your camera feed with AI coaching</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4 relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {!isStreamActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <p className="text-white text-lg">Camera not active</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mb-4">
                  <Button
                    onClick={() => (isStreamActive ? stopCamera() : startCamera())}
                    variant={isStreamActive ? 'destructive' : 'default'}
                    className="flex-1"
                  >
                    {isStreamActive ? (
                      <>
                        <StopCircle className="w-4 h-4 mr-2" />
                        Stop Camera
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Camera
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={toggleVideo}
                    variant={isVideoEnabled ? 'default' : 'outline'}
                    disabled={!isStreamActive}
                  >
                    {isVideoEnabled ? (
                      <Video className="w-4 h-4" />
                    ) : (
                      <VideoOff className="w-4 h-4" />
                    )}
                  </Button>

                  <Button
                    onClick={toggleAudio}
                    variant={isAudioEnabled ? 'default' : 'outline'}
                    disabled={!isStreamActive}
                  >
                    {isAudioEnabled ? (
                      <Mic className="w-4 h-4" />
                    ) : (
                      <MicOff className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={startSession}
                    disabled={!isStreamActive || !!sessionId}
                    className="flex-1"
                  >
                    Start AI Coaching
                  </Button>

                  <Button
                    onClick={stopSession}
                    disabled={!sessionId}
                    variant="destructive"
                    className="flex-1"
                  >
                    Stop AI Coaching
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Right Panel: Controls & Feedback */}
            <div className="space-y-6">
              {/* Skill Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Skill</CardTitle>
                  <CardDescription>Choose what you want to learn</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {skills.map((skill) => (
                      <Button
                        key={skill.id}
                        variant={selectedSkill === skill.id ? 'default' : 'outline'}
                        onClick={() => setSelectedSkill(skill.id)}
                        className="h-auto py-4 flex flex-col items-start"
                        disabled={!!sessionId}
                      >
                        <div className="font-semibold">{skill.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {skill.description}
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Language Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Language</CardTitle>
                  <CardDescription>Select your preferred language</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {languages.map((lang) => (
                      <Button
                        key={lang.code}
                        variant={language === lang.code ? 'default' : 'outline'}
                        onClick={() => setLanguage(lang.code)}
                        disabled={!!sessionId}
                      >
                        {lang.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Feedback */}
              <Card>
                <CardHeader>
                  <CardTitle>AI Feedback</CardTitle>
                  <CardDescription>Real-time guidance from your AI mentor</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 min-h-32">
                    {agentResponse ? (
                      <p className="text-sm">{agentResponse}</p>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Start a session to receive AI feedback...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Session Info */}
              {sessionId && (
                <Card>
                  <CardHeader>
                    <CardTitle>Session Active</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      <strong>Session ID:</strong> {sessionId}
                    </p>
                    <p className="text-sm mt-2">
                      <strong>Skill:</strong> {skills.find((s) => s.id === selectedSkill)?.name}
                    </p>
                    <p className="text-sm mt-2">
                      <strong>Language:</strong> {languages.find((l) => l.code === language)?.name}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
