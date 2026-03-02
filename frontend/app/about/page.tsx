import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Video, Globe, Zap, Shield, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-8 text-center">About HandsOnLive</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                HandsOnLive transforms smartphones into personal AI coaches, enabling millions to learn practical skills through real-time vision guidance. We bridge the gap between video tutorials and hands-on practice with instant, personalized feedback.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Video className="w-8 h-8 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">1. Point Your Camera</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Show your hands and workspace to the AI through your phone camera
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Brain className="w-8 h-8 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">2. Get Real-Time Feedback</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      AI analyzes your technique and provides instant corrections in under 200ms
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Zap className="w-8 h-8 text-yellow-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">3. Learn Faster</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Practice with confidence knowing you're doing it correctly
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Technology</CardTitle>
              <CardDescription>Built with Google's most advanced AI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">AI & Vision</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Gemini 2.0 Live API</li>
                    <li>• Real-time vision analysis</li>
                    <li>• MediaPipe Hands tracking</li>
                    <li>• Imagen 3 for AR overlays</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Infrastructure</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Google Cloud Platform</li>
                    <li>• Cloud Run for deployment</li>
                    <li>• Firestore for data</li>
                    <li>• Redis for caching</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Competition Entry</CardTitle>
              <CardDescription>Gemini Live Agent Challenge 2026</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                HandsOnLive is our entry for the Google Gemini Live Agent Challenge 2026, competing for the Grand Prize of $25,000.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">Innovation</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">40% of score</p>
                </div>
                <div className="text-center">
                  <Brain className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">Technical</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">30% of score</p>
                </div>
                <div className="text-center">
                  <Video className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">Demo</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">30% of score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Vocational Education</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Making practical skills training accessible to millions in Indonesia and beyond
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Economic Empowerment</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enabling people to learn income-generating skills without expensive training
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Cultural Preservation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Digitizing traditional skills like batik, woodwork, and crafts
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Language Access</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Multi-language support removes barriers to learning
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">
                HandsOnLive is developed by <strong>Jules Indigo</strong> as part of the Gemini Live Agent Challenge 2026.
              </p>
              <div className="mt-4 flex gap-4">
                <a
                  href="https://github.com/julesindigo-web/handsonlive-gemini-live-agent-challenge-2026"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  GitHub Repository
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
