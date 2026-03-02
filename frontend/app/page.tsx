import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Brain, Globe, Zap } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            HandsOnLive
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Real-Time Vision AI Skills Mentor
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Transform your smartphone into a personal AI coach. Learn practical skills with instant feedback powered by Gemini Live API.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/learn">
              <Button size="lg" className="text-lg px-8">
                Start Learning
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Video className="w-12 h-12 text-blue-600 mb-2" />
              <CardTitle>Real-Time Vision</CardTitle>
              <CardDescription>
                AI sees your hands and provides instant feedback on your technique
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Brain className="w-12 h-12 text-purple-600 mb-2" />
              <CardTitle>Adaptive Learning</CardTitle>
              <CardDescription>
                AI adapts to your skill level and learning pace
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Globe className="w-12 h-12 text-green-600 mb-2" />
              <CardTitle>Multi-Language</CardTitle>
              <CardDescription>
                Learn in Indonesian, English, or Spanish with real-time translation
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="w-12 h-12 text-yellow-600 mb-2" />
              <CardTitle>Instant Feedback</CardTitle>
              <CardDescription>
                Get corrections in under 200ms - faster than human reaction
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Available Skills</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Cooking', 'Repair', 'Farming', 'Crafts'].map((skill) => (
              <Card key={skill} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-center">{skill}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Learn hands-on {skill.toLowerCase()} skills with AI guidance
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Built for Gemini Live Agent Challenge 2026 | Powered by Google Cloud
          </p>
        </div>
      </div>
    </main>
  );
}
