import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HandsOnLive - Real-Time Vision AI Skills Mentor',
  description: 'Learn practical skills with real-time AI coaching powered by Gemini Live API',
  keywords: ['AI', 'education', 'vocational training', 'Gemini', 'real-time coaching'],
  authors: [{ name: 'Jules Indigo' }],
  openGraph: {
    title: 'HandsOnLive - Real-Time Vision AI Skills Mentor',
    description: 'Learn practical skills with real-time AI coaching',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
