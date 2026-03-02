import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger';
import { AppError } from '../utils/error-handler';
import { FirestoreService } from './firestore-service';
import { RedisService } from './redis-service';

interface Session {
  id: string;
  userId: string;
  skill: string;
  language: string;
  startedAt: Date;
  status: 'active' | 'paused' | 'completed';
}

export class GeminiLiveService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any | null = null;
  private apiKey: string;
  private firestoreService: FirestoreService;
  private redisService: RedisService;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    
    if (!this.apiKey) {
      logger.warn('GEMINI_API_KEY not configured - service will run in demo mode');
    } else {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    }

    this.firestoreService = new FirestoreService();
    this.redisService = new RedisService();
  }

  private activeSessions = new Map();

  async startSession(userId: string, skill: string, language: string): Promise<Session> {
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const session: Session = {
        id: sessionId,
        userId,
        skill,
        language,
        status: 'active',
        startedAt: new Date(),
      };

      // Only initialize model if API key is available
      if (this.genAI) {
        const systemPrompt = this.buildSystemPrompt(skill, language);
        this.model = this.genAI.getGenerativeModel({
          model: 'gemini-2.0-flash-exp',
          systemInstruction: systemPrompt,
        });
      }

      // Save to Firestore
      await this.firestoreService.saveSession(session);

      // Cache in Redis
      await this.redisService.cacheSession(session.id, session);

      logger.info('Gemini Live session created', { sessionId: session.id, userId, skill });
      return session;
    } catch (error) {
      logger.error('Failed to create session', { error });
      throw new AppError(500, 'Failed to create session');
    }
  }

  async stopSession(sessionId: string): Promise<void> {
    try {
      const sessionData = this.activeSessions.get(sessionId);
      if (!sessionData) {
        throw new AppError(404, 'Session not found');
      }

      sessionData.session.status = 'completed';
      await this.firestoreService.updateSession(sessionId, { status: 'completed' });
      await this.redisService.deleteSession(sessionId);

      this.activeSessions.delete(sessionId);

      logger.info('Gemini Live session stopped', { sessionId });
    } catch (error) {
      logger.error('Failed to stop session', { error, sessionId });
      throw error;
    }
  }

  async getSessionStatus(sessionId: string): Promise<any> {
    try {
      const cached = await this.redisService.getSession(sessionId);
      if (cached) {
        return cached;
      }

      const session = await this.firestoreService.getSession(sessionId);
      if (!session) {
        throw new AppError(404, 'Session not found');
      }

      return session;
    } catch (error) {
      logger.error('Failed to get session status', { error, sessionId });
      throw error;
    }
  }

  async processVideoFrame(sessionId: string, frameData: Buffer): Promise<string> {
    if (!this.genAI || !this.model) {
      logger.warn('Demo mode: Returning mock response');
      return 'Good technique! Keep the knife at a 15-degree angle for better control.';
    }

    try {
      const prompt = {
        text: 'Analyze this video frame and provide feedback on the technique shown.',
        inlineData: {
          data: frameData.toString('base64'),
          mimeType: 'image/jpeg',
        },
      };

      const result = await this.model.generateContent([prompt]);
      const response = result.response.text();

      return response;
    } catch (error) {
      logger.error('Failed to process video frame', { error, sessionId });
      throw new AppError(500, 'Failed to process video frame');
    }
  }

  async processAudioChunk(sessionId: string, audioData: Buffer): Promise<string> {
    if (!this.genAI || !this.model) {
      logger.warn('Demo mode: Returning mock response');
      return 'I hear you! Please continue with what you were doing.';
    }

    try {
      const prompt = {
        text: 'The user is speaking. Listen and respond naturally.',
        inlineData: {
          data: audioData.toString('base64'),
          mimeType: 'audio/wav',
        },
      };

      const result = await this.model.generateContent([prompt]);
      const response = result.response.text();

      return response;
    } catch (error) {
      logger.error('Failed to process audio chunk', { error, sessionId });
      throw new AppError(500, 'Failed to process audio chunk');
    }
  }

  async submitFeedback(sessionId: string, feedback: any): Promise<void> {
    try {
      await this.firestoreService.saveFeedback(sessionId, feedback);
      logger.info('Feedback submitted', { sessionId });
    } catch (error) {
      logger.error('Failed to submit feedback', { error, sessionId });
      throw new AppError(500, 'Failed to submit feedback');
    }
  }

  private buildSystemPrompt(skill: string, language: string): string {
    const languageMap: Record<string, string> = {
      'id': 'Indonesian (Bahasa Indonesia)',
      'en': 'English',
      'es': 'Spanish'
    };

    const lang = languageMap[language] || 'English';

    return `You are HandsOnLive, a patient and expert AI mentor specializing in hands-on practical skills.

Your role:
- You are teaching ${skill} to a learner
- You can see what the learner is doing through their camera
- Provide real-time, constructive feedback in ${lang}
- Be encouraging and patient
- Correct mistakes immediately but kindly
- Adapt to the learner's skill level
- Use simple, clear language
- Provide step-by-step guidance

Communication style:
- Speak naturally and conversationally
- Use short, clear sentences
- Be supportive and motivating
- Acknowledge good technique
- Gently correct errors with specific guidance (e.g., "Cut at a 15-degree angle, not straight down")

Vision capabilities:
- Analyze hand positions and movements
- Identify objects and ingredients
- Detect common mistakes
- Provide spatial guidance (left, right, higher, lower)

Remember:
- You are a mentor, not just an instructor
- Build confidence while ensuring correct technique
- Celebrate small wins
- Make learning enjoyable and accessible`;
  }
}
