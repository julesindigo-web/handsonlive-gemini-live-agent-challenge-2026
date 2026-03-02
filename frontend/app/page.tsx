'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Video, Brain, Globe, Zap, Sparkles, Play, ArrowRight, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: Video,
      title: 'Real-Time Vision AI',
      description: 'Camera analyzes your technique instantly with sub-200ms response time',
    },
    {
      icon: Brain,
      title: 'Adaptive Learning',
      description: 'AI personalizes guidance based on your skill level and progress',
    },
    {
      icon: Globe,
      title: 'Multi-Language',
      description: 'Learn in Bahasa Indonesia, English, or Spanish with native AI fluency',
    },
    {
      icon: Zap,
      title: 'Instant Feedback',
      description: 'Get immediate corrections and tips while you practice',
    },
  ];

  const skills = [
    { name: 'Cooking', emoji: '🍳', desc: 'Culinary arts & traditional recipes' },
    { name: 'Repair', emoji: '🔧', desc: 'Electronics & machinery maintenance' },
    { name: 'Farming', emoji: '🌱', desc: 'Hydroponics & modern agriculture' },
    { name: 'Crafts', emoji: '🎨', desc: 'Batik, woodwork & handmade goods' },
  ];

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">HandsOnLive</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/about" className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
              About
            </Link>
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/learn">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-5">
                Start Learning
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full mb-6">
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                <span className="text-indigo-700 text-sm font-medium">Gemini Live Agent Challenge 2026</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Learn Real Skills with{' '}
                <span className="text-indigo-600">AI Vision</span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
                Transform your smartphone into a personal AI coach. Get instant feedback on cooking, 
                repairs, farming, and crafts powered by Gemini Live API.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/learn">
                  <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 h-14 text-base font-semibold group">
                    <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Start Learning Now
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base font-semibold border-slate-300 hover:bg-slate-50">
                    Learn More
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12 pt-8 border-t border-slate-200">
                <div>
                  <div className="text-3xl font-bold text-slate-900">&lt;200ms</div>
                  <div className="text-sm text-slate-500">Response Time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">4</div>
                  <div className="text-sm text-slate-500">Skills Available</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">3</div>
                  <div className="text-sm text-slate-500">Languages</div>
                </div>
              </div>
            </motion.div>

            {/* Right - Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative mx-auto w-[280px] h-[580px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl shadow-indigo-500/20">
                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2.5rem] overflow-hidden relative">
                  {/* Screen Content */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20" />
                  
                  {/* Mock Video Feed */}
                  <div className="absolute top-12 left-4 right-4 aspect-video bg-slate-700 rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-600 to-slate-700" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Video className="w-8 h-8 text-slate-500" />
                    </div>
                    <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 rounded-md flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      <span className="text-white text-[10px] font-medium">LIVE</span>
                    </div>
                  </div>

                  {/* AI Feedback Bubble */}
                  <div className="absolute bottom-24 left-4 right-4 bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 mb-1">AI Coach</div>
                        <div className="text-xs text-slate-600">Great cutting technique! Try to keep your fingers tucked for safety.</div>
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="absolute bottom-6 left-4 right-4 flex justify-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Video className="w-5 h-5 text-white" />
                    </div>
                    <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-sm" />
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Powered by Advanced AI
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Experience the future of skill learning with real-time AI vision technology
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10 transition-all group"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                  <feature.icon className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Learn Practical Skills
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Choose from our curated collection of hands-on skills with AI-powered guidance
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all h-full">
                  <div className="text-4xl mb-4">{skill.emoji}</div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {skill.name}
                  </h3>
                  <p className="text-sm text-slate-600">{skill.desc}</p>
                  <div className="mt-4 flex items-center text-indigo-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Start Learning
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Join thousands of learners mastering real-world skills with AI guidance. 
              No expensive equipment needed—just your smartphone.
            </p>
            <Link href="/learn">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-10 h-14 text-base font-semibold">
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started for Free
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="font-semibold text-slate-900">HandsOnLive</span>
            </div>
            <div className="text-sm text-slate-500">
              Built for Gemini Live Agent Challenge 2026 • Powered by Google Cloud
            </div>
            <div className="flex items-center gap-6">
              <Link href="/about" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                About
              </Link>
              <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
