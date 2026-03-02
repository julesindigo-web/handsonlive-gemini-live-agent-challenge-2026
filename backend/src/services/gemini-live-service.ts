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
  private genAI: GoogleGenerativeAI;
  private firestoreService: FirestoreService;
  private redisService: RedisService;
  private activeSessions: Map<string, any>;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.firestoreService = new FirestoreService();
    this.redisService = new RedisService();
    this.activeSessions = new Map();
  }

  async startSession(userId: string, skill: string, language: string): Promise<Session> {
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const session: Session = {
        id: sessionId,
        userId,
        skill,
        language,
        startedAt: new Date(),
        status: 'active'
      };

      await this.firestoreService.saveSession(session);
      await this.redisService.cacheSession(sessionId, session);

      const systemPrompt = this.buildSystemPrompt(skill, language);
      
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
        systemInstruction: systemPrompt
      });

      this.activeSessions.set(sessionId, {
        model,
        session,
        history: []
      });

      logger.info('Gemini Live session initialized', { sessionId, skill, language });

      return session;
    } catch (error) {
      logger.error('Failed to start Gemini Live session', { error, userId, skill });
      throw new AppError(500, 'Failed to start session');
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
