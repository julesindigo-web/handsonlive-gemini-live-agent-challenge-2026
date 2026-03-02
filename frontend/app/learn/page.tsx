'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Mic, MicOff, VideoOff, Play, StopCircle, Sparkles, MessageSquare, ArrowLeft, ChefHat, Wrench, Leaf, Palette } from 'lucide-react';
import { useMediaStream } from '@/hooks/use-media-stream';
import { useWebSocket } from '@/hooks/use-websocket';
import { useAudioRecorder } from '@/hooks/use-audio-recorder';
import { motion, AnimatePresence } from 'framer-motion';

export default function LearnPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('cooking');
  const [language, setLanguage] = useState('id');
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

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
    sendAudioChunk,
  } = useWebSocket('ws://localhost:3001');

  const {
    isRecording,
    startRecording,
    stopRecording,
    getLatestChunk,
    clearChunks,
  } = useAudioRecorder();

  const skills = [
    { id: 'cooking', name: 'Cooking', icon: ChefHat, description: 'Master culinary arts', color: 'bg-orange-500', lightColor: 'bg-orange-50 text-orange-600' },
    { id: 'repair', name: 'Repair', icon: Wrench, description: 'Electronics & machinery', color: 'bg-blue-500', lightColor: 'bg-blue-50 text-blue-600' },
    { id: 'farming', name: 'Farming', icon: Leaf, description: 'Hydroponics & agriculture', color: 'bg-green-500', lightColor: 'bg-green-50 text-green-600' },
    { id: 'crafts', name: 'Crafts', icon: Palette, description: 'Batik, woodwork & more', color: 'bg-purple-500', lightColor: 'bg-purple-50 text-purple-600' },
  ];

  const languages = [
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
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

      const videoInterval = setInterval(() => {
        const frameData = captureVideoFrame();
        if (frameData) {
          sendVideoFrame(frameData);
        }
      }, 100);

      await startRecording();
      const audioInterval = setInterval(async () => {
        const audioData = await getLatestChunk();
        if (audioData) {
          sendAudioChunk(audioData);
          clearChunks();
        }
      }, 500);

      return () => {
        clearInterval(videoInterval);
        clearInterval(audioInterval);
        stopRecording();
      };
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };

  const handleStopSession = () => {
    disconnectWs();
    stopRecording();
    clearChunks();
    setSessionId('');
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </Link>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900 text-lg">HandsOnLive</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isWsConnected ? 'bg-green-50 border-green-200' : 'bg-slate-100 border-slate-200'}`}>
              <div className={`w-2 h-2 rounded-full ${isWsConnected ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
              <span className={`text-sm font-medium ${isWsConnected ? 'text-green-700' : 'text-slate-600'}`}>
                {isWsConnected ? 'AI Connected' : 'Ready'}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Learning Session</h1>
            <p className="text-slate-600">Practice your skills with real-time AI feedback</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Panel: Video Stream */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <Card className="overflow-hidden border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 bg-white pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                        <Video className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <CardTitle className="text-slate-900 text-lg">Video Stream</CardTitle>
                        <CardDescription className="text-slate-500">
                          Your camera feed with AI coaching
                        </CardDescription>
                      </div>
                    </div>
                    {isWsConnected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-green-700 text-sm font-medium">LIVE</span>
                      </motion.div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Video Player */}
                  <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden mb-6 relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <AnimatePresence>
                      {!stream && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center bg-slate-800"
                        >
                          <div className="text-center">
                            <VideoOff className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                            <p className="text-slate-400 font-medium">Camera not active</p>
                            <p className="text-slate-500 text-sm mt-1">Click "Start Camera" to begin</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {isWsConnected && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur text-white"
                      >
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-xs font-medium">{isRecording ? 'Recording' : 'Connected'}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Error Messages */}
                  <AnimatePresence>
                    {mediaError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
                      >
                        <p className="text-red-600 text-sm flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          {mediaError}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Control Buttons */}
                  <div className="flex gap-3 mb-4">
                    <Button
                      onClick={() => (stream ? handleStopCamera() : handleStartCamera())}
                      variant={stream ? 'destructive' : 'default'}
                      className={`flex-1 py-6 text-base font-medium ${
                        stream
                          ? 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {stream ? (
                        <>
                          <StopCircle className="w-5 h-5 mr-2" />
                          Stop Camera
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 mr-2" />
                          Start Camera
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={toggleVideo}
                      variant="outline"
                      disabled={!stream}
                      className={`px-4 py-6 border-slate-300 ${
                        isVideoEnabled ? 'bg-slate-100 text-slate-900' : 'bg-white text-slate-400'
                      }`}
                    >
                      {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </Button>

                    <Button
                      onClick={toggleAudio}
                      variant="outline"
                      disabled={!stream}
                      className={`px-4 py-6 border-slate-300 ${
                        isAudioEnabled ? 'bg-slate-100 text-slate-900' : 'bg-white text-slate-400'
                      }`}
                    >
                      {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </Button>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleStartSession}
                      disabled={!stream || !!sessionId}
                      className="flex-1 py-6 text-base font-medium bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Start AI Coaching
                    </Button>

                    <Button
                      onClick={handleStopSession}
                      disabled={!sessionId}
                      variant="outline"
                      className="flex-1 py-6 text-base font-medium border-slate-300 text-slate-700 disabled:opacity-50"
                    >
                      <StopCircle className="w-5 h-5 mr-2" />
                      Stop Session
                    </Button>
                  </div>

                  <AnimatePresence>
                    {wsError && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4"
                      >
                        <p className="text-red-600 text-sm">{wsError}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Panel: Controls & Feedback */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Skill Selection */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <CardTitle className="text-slate-900 text-base">Select Skill</CardTitle>
                      <CardDescription className="text-slate-500 text-xs">Choose what to learn</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {skills.map((skill) => {
                      const Icon = skill.icon;
                      return (
                        <motion.button
                          key={skill.id}
                          onClick={() => setSelectedSkill(skill.id)}
                          disabled={!!sessionId}
                          whileHover={{ scale: sessionId ? 1 : 1.02 }}
                          whileTap={{ scale: sessionId ? 1 : 0.98 }}
                          className={`p-3 rounded-xl border transition-all text-left ${
                            selectedSkill === skill.id
                              ? `${skill.lightColor} border-current`
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                          } ${sessionId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <Icon className="w-5 h-5 mb-2" />
                          <div className="font-semibold text-sm">{skill.name}</div>
                          <div className="text-xs opacity-70 mt-0.5">{skill.description}</div>
                        </motion.button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Language Selection */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-slate-900 text-base">Language</CardTitle>
                  <CardDescription className="text-slate-500 text-xs">Select preferred language</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {languages.map((lang) => (
                      <motion.button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        disabled={!!sessionId}
                        whileHover={{ scale: sessionId ? 1 : 1.05 }}
                        whileTap={{ scale: sessionId ? 1 : 0.95 }}
                        className={`p-3 rounded-xl border transition-all text-center ${
                          language === lang.code
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        } ${sessionId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="text-2xl mb-1">{lang.flag}</div>
                        <div className="text-xs">{lang.name}</div>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Feedback */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-violet-600" />
                    </div>
                    <div>
                      <CardTitle className="text-slate-900 text-base">AI Feedback</CardTitle>
                      <CardDescription className="text-slate-500 text-xs">Real-time guidance</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-50 rounded-xl p-4 min-h-[120px] border border-slate-200">
                    {agentResponse ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{agentResponse}</p>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <Sparkles className="w-8 h-8 text-slate-300 mb-2" />
                        <p className="text-sm text-slate-500">Start a session to receive AI feedback...</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Session Info */}
              <AnimatePresence>
                {sessionId && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card className="bg-emerald-50 border-emerald-200 shadow-sm">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <CardTitle className="text-emerald-900 text-base">Session Active</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-emerald-700">Skill:</span>
                            <span className="text-emerald-900 font-medium">{skills.find((s) => s.id === selectedSkill)?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-emerald-700">Language:</span>
                            <span className="text-emerald-900 font-medium">{languages.find((l) => l.code === language)?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-emerald-700">Status:</span>
                            <span className={`font-medium ${isWsConnected ? 'text-emerald-600' : 'text-emerald-400'}`}>
                              {isWsConnected ? 'Connected' : 'Disconnected'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
