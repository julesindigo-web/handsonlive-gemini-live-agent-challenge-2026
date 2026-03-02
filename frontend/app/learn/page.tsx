'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Mic, MicOff, VideoOff, Play, StopCircle, Sparkles, Activity, Settings, MessageSquare, Radio, Wifi } from 'lucide-react';
import { useMediaStream } from '@/hooks/use-media-stream';
import { useWebSocket } from '@/hooks/use-websocket';
import { useAudioRecorder } from '@/hooks/use-audio-recorder';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

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
    { id: 'cooking', name: 'Cooking', emoji: '🍳', description: 'Master culinary arts', color: 'from-orange-400 to-red-500', bg: 'bg-orange-500/20' },
    { id: 'repair', name: 'Repair', emoji: '🔧', description: 'Electronics & machinery', color: 'from-blue-400 to-indigo-500', bg: 'bg-blue-500/20' },
    { id: 'farming', name: 'Farming', emoji: '🌱', description: 'Hydroponics & agriculture', color: 'from-green-400 to-emerald-500', bg: 'bg-green-500/20' },
    { id: 'crafts', name: 'Crafts', emoji: '🎨', description: 'Batik, woodwork & more', color: 'from-purple-400 to-pink-500', bg: 'bg-purple-500/20' },
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

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-[#0a0a0f] to-[#0a0a0f]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-l from-violet-600/10 to-transparent rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-r from-cyan-600/10 to-transparent rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* Floating Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-48 h-48 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(${99 + i * 30},${102 + i * 20},${241 - i * 20},0.15) 0%, transparent 70%)`,
              right: `${10 + i * 15}%`,
              top: `${15 + i * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-10 h-10 text-amber-400" />
              </motion.div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                  Learn with HandsOnLive
                </h1>
                <p className="text-white/50 mt-1">Real-time AI-powered skill coaching</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/10">
              <div className={`w-2 h-2 rounded-full ${isWsConnected ? 'bg-green-400 animate-pulse' : 'bg-white/30'}`} />
              <span className="text-sm text-white/70">
                {isWsConnected ? 'AI Connected' : 'Ready'}
              </span>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Left Panel: Video Stream */}
            <motion.div variants={itemVariants} className="lg:col-span-3">
              <Card className="bg-white/[0.03] backdrop-blur-xl border-white/10 overflow-hidden shadow-2xl shadow-black/50">
                <CardHeader className="border-b border-white/10 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Video className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">Live Video Stream</CardTitle>
                        <CardDescription className="text-white/50">
                          Your camera feed with AI coaching
                        </CardDescription>
                      </div>
                    </div>
                    {isWsConnected && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30"
                      >
                        <Radio className="w-4 h-4 text-green-400 animate-pulse" />
                        <span className="text-green-400 text-sm font-medium">LIVE</span>
                      </motion.div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="aspect-video bg-black rounded-xl overflow-hidden mb-5 relative border border-white/10 shadow-inner">
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
                          className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        >
                          <div className="text-center">
                            <motion.div
                              animate={{ y: [0, -10, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <VideoOff className="w-20 h-20 text-white/30 mx-auto mb-4" />
                            </motion.div>
                            <p className="text-white/50 text-lg font-medium">Camera not active</p>
                            <p className="text-white/30 text-sm mt-2">Click "Start Camera" to begin</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {isWsConnected && (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20"
                      >
                        <Wifi className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-xs font-medium">{isRecording ? 'Recording Audio' : 'Connected'}</span>
                      </motion.div>
                    )}
                  </div>

                  <AnimatePresence>
                    {mediaError && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-lg p-4 mb-5"
                      >
                        <p className="text-red-400 text-sm flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
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
                      className={`flex-1 py-6 text-base font-medium transition-all ${
                        stream 
                          ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30' 
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border-0 shadow-lg shadow-indigo-500/25'
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
                      className={`px-4 py-6 border-white/20 backdrop-blur-sm transition-all ${
                        isVideoEnabled ? 'bg-white/10 text-white' : 'bg-white/5 text-white/50'
                      }`}
                    >
                      {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </Button>

                    <Button
                      onClick={toggleAudio}
                      variant="outline"
                      disabled={!stream}
                      className={`px-4 py-6 border-white/20 backdrop-blur-sm transition-all ${
                        isAudioEnabled ? 'bg-white/10 text-white' : 'bg-white/5 text-white/50'
                      }`}
                    >
                      {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </Button>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleStartSession}
                      disabled={!stream || !!sessionId}
                      className="flex-1 py-6 text-base font-medium bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 border-0 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Start AI Coaching
                    </Button>

                    <Button
                      onClick={handleStopSession}
                      disabled={!sessionId}
                      className="flex-1 py-6 text-base font-medium bg-white/5 hover:bg-white/10 border border-white/20 text-white/70 disabled:opacity-30 transition-all"
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
                        className="mt-4 bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-lg p-4"
                      >
                        <p className="text-red-400 text-sm">{wsError}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Panel: Controls & Feedback */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-5">
              {/* Skill Selection */}
              <Card className="bg-white/[0.03] backdrop-blur-xl border-white/10">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <Settings className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-base">Select Skill</CardTitle>
                      <CardDescription className="text-white/50 text-xs">Choose what to learn</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {skills.map((skill) => (
                      <motion.button
                        key={skill.id}
                        onClick={() => setSelectedSkill(skill.id)}
                        disabled={!!sessionId}
                        whileHover={{ scale: sessionId ? 1 : 1.02 }}
                        whileTap={{ scale: sessionId ? 1 : 0.98 }}
                        className={`p-3 rounded-xl border transition-all text-left ${
                          selectedSkill === skill.id
                            ? `${skill.bg} border-white/30`
                            : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                        } ${sessionId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="text-2xl mb-1">{skill.emoji}</div>
                        <div className="font-semibold text-white text-sm">{skill.name}</div>
                        <div className="text-xs text-white/40 mt-0.5">{skill.description}</div>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Language Selection */}
              <Card className="bg-white/[0.03] backdrop-blur-xl border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-base">Language</CardTitle>
                  <CardDescription className="text-white/50 text-xs">Select preferred language</CardDescription>
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
                            ? 'bg-white/10 border-white/30'
                            : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                        } ${sessionId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="text-2xl mb-1">{lang.flag}</div>
                        <div className="text-xs text-white/70">{lang.name}</div>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Feedback */}
              <Card className="bg-white/[0.03] backdrop-blur-xl border-white/10">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-base">AI Feedback</CardTitle>
                      <CardDescription className="text-white/50 text-xs">Real-time guidance</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 min-h-[120px] border border-white/10">
                    {agentResponse ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-sm text-white/90 leading-relaxed">{agentResponse}</p>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <Sparkles className="w-8 h-8 text-white/20 mb-2" />
                        <p className="text-sm text-white/40">Start a session to receive AI feedback...</p>
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
                    <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl border-emerald-500/30">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                            <Activity className="w-4 h-4 text-white" />
                          </div>
                          <CardTitle className="text-white text-base">Session Active</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-white/50">Skill:</span>
                            <span className="text-white font-medium">{skills.find((s) => s.id === selectedSkill)?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/50">Language:</span>
                            <span className="text-white font-medium">{languages.find((l) => l.code === language)?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/50">Status:</span>
                            <span className={`font-medium ${isWsConnected ? 'text-emerald-400' : 'text-white/50'}`}>
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
        </motion.div>
      </div>

      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 z-[100] pointer-events-none opacity-[0.015] mix-blend-overlay">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />
      </div>
    </div>
  );
}
