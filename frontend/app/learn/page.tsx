'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Mic, MicOff, VideoOff, Play, StopCircle } from 'lucide-react';
import { useMediaStream } from '@/hooks/use-media-stream';
import { useWebSocket } from '@/hooks/use-websocket';

export default function LearnPage() {
  const [selectedSkill, setSelectedSkill] = useState('cooking');
  const [language, setLanguage] = useState('id');
  const [sessionId, setSessionId] = useState('');

  const {
    stream,
    videoRef,
    error: mediaError,
    isVideoEnabled,
    isAudioEnabled,
    startCamera,
    stopCamera,
    toggleVideo,
    toggleAudio,
    captureVideoFrame,
  } = useMediaStream();

  const {
    isConnected: isWsConnected,
    agentResponse,
    error: wsError,
    connect: connectWs,
    disconnect: disconnectWs,
    sendVideoFrame,
  } = useWebSocket('ws://localhost:3001');

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

  const handleStartCamera = async () => {
    await startCamera();
  };

  const handleStopCamera = () => {
    stopCamera();
    disconnectWs();
    setSessionId('');
  };

  const handleStartSession = async () => {
    if (!stream) return;

    try {
      await connectWs('demo-user', selectedSkill, language);
      setSessionId('session_' + Date.now());

      // Start sending video frames
      const interval = setInterval(() => {
        const frameData = captureVideoFrame();
        if (frameData) {
          sendVideoFrame(frameData);
        }
      }, 100); // Send frame every 100ms

      // Clear interval when session stops
      return () => clearInterval(interval);
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };

  const handleStopSession = () => {
    disconnectWs();
    setSessionId('');
  };

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
                  {!stream && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <p className="text-white text-lg">Camera not active</p>
                    </div>
                  )}
                </div>

                {mediaError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                    <p className="text-red-600 dark:text-red-400 text-sm">{mediaError}</p>
                  </div>
                )}

                <div className="flex gap-2 mb-4">
                  <Button
                    onClick={() => (stream ? handleStopCamera() : handleStartCamera())}
                    variant={stream ? 'destructive' : 'default'}
                    className="flex-1"
                  >
                    {stream ? (
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
                    disabled={!stream}
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
                    disabled={!stream}
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
                    onClick={handleStartSession}
                    disabled={!stream || !!sessionId}
                    className="flex-1"
                  >
                    Start AI Coaching
                  </Button>

                  <Button
                    onClick={handleStopSession}
                    disabled={!sessionId}
                    variant="destructive"
                    className="flex-1"
                  >
                    Stop AI Coaching
                  </Button>
                </div>

                {isWsConnected && (
                  <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <p className="text-green-600 dark:text-green-400 text-sm">
                      ✓ Connected to AI Coach
                    </p>
                  </div>
                )}

                {wsError && (
                  <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-red-600 dark:text-red-400 text-sm">{wsError}</p>
                  </div>
                )}
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
                    <p className="text-sm mt-2">
                      <strong>Status:</strong> {isWsConnected ? 'Connected' : 'Disconnected'}
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
