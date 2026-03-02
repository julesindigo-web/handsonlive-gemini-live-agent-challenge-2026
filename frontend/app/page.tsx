'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Brain, Globe, Zap, Sparkles, Play, ChevronRight, Wand2, Cpu, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const floatVariants = {
  animate: {
    y: [0, -20, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
  }
};

const glowVariants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
  }
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left - rect.width / 2) / 20,
          y: (e.clientY - rect.top - rect.height / 2) / 20
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: Video,
      title: 'Real-Time Vision',
      description: 'AI sees your hands and provides instant feedback on your technique with sub-200ms latency',
      color: 'from-cyan-400 via-blue-500 to-indigo-600',
      bgGlow: 'bg-cyan-500/30'
    },
    {
      icon: Brain,
      title: 'Adaptive Learning',
      description: 'AI adapts to your skill level and learning pace with personalized guidance',
      color: 'from-violet-400 via-purple-500 to-fuchsia-600',
      bgGlow: 'bg-purple-500/30'
    },
    {
      icon: Globe,
      title: 'Multi-Language',
      description: 'Learn in Indonesian, English, or Spanish with real-time AI translation',
      color: 'from-emerald-400 via-teal-500 to-cyan-600',
      bgGlow: 'bg-emerald-500/30'
    },
    {
      icon: Zap,
      title: 'Instant Feedback',
      description: 'Get corrections in under 200ms - faster than human reaction time',
      color: 'from-amber-400 via-orange-500 to-rose-600',
      bgGlow: 'bg-orange-500/30'
    }
  ];

  const skills = [
    { name: 'Cooking', emoji: '🍳', desc: 'Master culinary arts with AI guidance', color: 'from-orange-400 to-red-500' },
    { name: 'Repair', emoji: '🔧', desc: 'Fix electronics & machinery', color: 'from-blue-400 to-indigo-500' },
    { name: 'Farming', emoji: '🌱', desc: 'Learn hydroponics & agriculture', color: 'from-green-400 to-emerald-500' },
    { name: 'Crafts', emoji: '🎨', desc: 'Create batik, woodwork & more', color: 'from-purple-400 to-pink-500' }
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden relative">
      {/* Animated Mesh Gradient Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0a0a0f] to-[#0a0a0f]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(99,102,241,0.15)_0%,_transparent_50%)]" />
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-full blur-[120px]"
          variants={floatVariants}
          animate="animate"
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-full blur-[100px]"
          variants={floatVariants}
          animate="animate"
          style={{ animationDelay: '2s' }}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
      </div>

      {/* Floating Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(${99 + i * 20},${102 + i * 10},${241 - i * 30},0.3) 0%, transparent 70%)`,
              left: `${15 + i * 18}%`,
              top: `${20 + i * 12}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      {/* Grid Lines */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <motion.div 
          ref={heroRef}
          className="text-center mb-24 pt-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-[0_0_40px_rgba(99,102,241,0.3)]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-amber-400" />
              </motion.div>
              <span className="text-sm font-medium bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Gemini Live Agent Challenge 2026
              </span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.div variants={itemVariants} className="mb-8 relative">
            <motion.h1 
              className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tight mb-4"
              style={{
                transform: `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              <span className="bg-gradient-to-r from-white via-indigo-200 to-white bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(99,102,241,0.5)]">
                HandsOnLive
              </span>
            </motion.h1>
            <motion.div
              className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl -z-10"
              variants={glowVariants}
              animate="animate"
            />
          </motion.div>

          {/* Subtitle */}
          <motion.p 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-light mb-6 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent"
          >
            Real-Time Vision AI Skills Mentor
          </motion.p>

          <motion.p 
            variants={itemVariants}
            className="text-xl text-white/60 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Transform your smartphone into a personal AI coach. Learn practical skills 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-semibold"> with instant feedback </span>
            powered by Gemini Live API.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/learn">
              <Button 
                size="lg" 
                className="group relative px-10 py-7 text-lg font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 border-0 overflow-hidden shadow-[0_0_40px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_rgba(99,102,241,0.7)] transition-all duration-300"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Play className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                Start Learning
              </Button>
            </Link>
            <Link href="/about">
              <Button 
                size="lg" 
                variant="outline" 
                className="px-10 py-7 text-lg font-medium bg-white/5 backdrop-blur-xl border-white/20 hover:bg-white/10 hover:border-white/30 transition-all group"
              >
                Explore Features
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="group relative h-full bg-white/[0.03] backdrop-blur-xl border-white/10 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-500 overflow-hidden">
                <div className={`absolute inset-0 ${feature.bgGlow} opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-500`} />
                <CardHeader className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white/90 group-hover:text-white transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-white/50 group-hover:text-white/70 transition-colors leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Skills Section */}
        <motion.div 
          className="mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                Master New Skills
              </span>
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Choose from our curated collection of practical skills powered by AI
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="group relative h-full bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl border-white/10 hover:border-white/20 overflow-hidden cursor-pointer">
                  <div className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="relative z-10">
                    <div className="text-5xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                      {skill.emoji}
                    </div>
                    <CardTitle className="text-2xl text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-indigo-200 transition-all">
                      {skill.name}
                    </CardTitle>
                    <CardDescription className="text-white/50 group-hover:text-white/70">
                      {skill.desc}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {[
            { value: '<200ms', label: 'Response Time', icon: Zap },
            { value: '99.9%', label: 'Uptime', icon: Cpu },
            { value: '4', label: 'Languages', icon: Globe },
            { value: '50M+', label: 'Target Users', icon: Layers }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center p-6 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/10"
            >
              <stat.icon className="w-6 h-6 text-indigo-400 mx-auto mb-3" />
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-white/50">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="text-center pt-12 border-t border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Wand2 className="w-5 h-5 text-purple-400" />
            </motion.div>
            <span className="text-white/70">
              Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-semibold">Gemini Live Agent Challenge 2026</span>
            </span>
            <span className="text-white/30">|</span>
            <span className="text-white/70">Powered by <span className="text-blue-400 font-semibold">Google Cloud</span></span>
          </div>
        </motion.div>
      </div>

      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 z-[100] pointer-events-none opacity-[0.015] mix-blend-overlay">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />
      </div>
    </main>
  );
}
