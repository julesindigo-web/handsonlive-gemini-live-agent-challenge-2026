import { FirestoreService } from './firestore-service';
import { logger } from '../utils/logger';

export interface SessionMemory {
  sessionId: string;
  userId: string;
  skill: string;
  language: string;
  messages: {
    role: 'user' | 'agent';
    content: string;
    timestamp: number;
  }[];
  feedback: {
    helpful: number;
    accuracy: number;
    clarity: number;
  }[];
  createdAt: number;
  updatedAt: number;
}

export class AgentMemoryService {
  constructor(private firestore: FirestoreService) {}

  async saveMessage(
    sessionId: string,
    role: 'user' | 'agent',
    content: string
  ): Promise<void> {
    try {
      const session = await this.getSession(sessionId);
      
      if (!session) {
        logger.warn('Session not found for message save', { sessionId });
        return;
      }

      session.messages.push({
        role,
        content,
        timestamp: Date.now(),
      });

      session.updatedAt = Date.now();

      await this.firestore.updateSession(sessionId, {
        messages: session.messages,
        updatedAt: session.updatedAt,
      });

      logger.debug('Message saved to session memory', { sessionId, role });
    } catch (error) {
      logger.error('Failed to save message', { error, sessionId });
    }
  }

  async getSession(sessionId: string): Promise<SessionMemory | null> {
    try {
      const session = await this.firestore.getSession(sessionId);
      
      if (!session) return null;

      return {
        sessionId: session.id,
        userId: session.userId,
        skill: session.skill,
        language: session.language,
        messages: session.messages || [],
        feedback: session.feedback || [],
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      };
    } catch (error) {
      logger.error('Failed to get session memory', { error, sessionId });
      return null;
    }
  }

  async getRecentContext(
    sessionId: string,
    limit: number = 5
  ): Promise<string> {
    const session = await this.getSession(sessionId);
    
    if (!session || session.messages.length === 0) {
      return '';
    }

    const recentMessages = session.messages.slice(-limit * 2);
    
    return recentMessages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join('\n');
  }

  async saveFeedback(
    sessionId: string,
    feedback: { helpful: number; accuracy: number; clarity: number }
  ): Promise<void> {
    try {
      const session = await this.getSession(sessionId);
      
      if (!session) {
        logger.warn('Session not found for feedback save', { sessionId });
        return;
      }

      session.feedback.push(feedback);
      session.updatedAt = Date.now();

      await this.firestore.updateSession(sessionId, {
        feedback: session.feedback,
        updatedAt: session.updatedAt,
      });

      logger.debug('Feedback saved to session memory', { sessionId });
    } catch (error) {
      logger.error('Failed to save feedback', { error, sessionId });
    }
  }

  async getUserHistory(userId: string, skill: string): Promise<SessionMemory[]> {
    try {
      const sessions = await this.firestore.getUserSessions(userId);
      
      return sessions
        .filter((session: any) => session.skill === skill)
        .map((session: any) => ({
          sessionId: session.id,
          userId: session.userId,
          skill: session.skill,
          language: session.language,
          messages: session.messages || [],
          feedback: session.feedback || [],
          createdAt: session.createdAt,
          updatedAt: session.updatedAt,
        }));
    } catch (error) {
      logger.error('Failed to get user history', { error, userId, skill });
      return [];
    }
  }

  async getAverageFeedback(sessionId: string): Promise<{
    helpful: number;
    accuracy: number;
    clarity: number;
  } | null> {
    const session = await this.getSession(sessionId);
    
    if (!session || session.feedback.length === 0) {
      return null;
    }

    const feedback = session.feedback;
    const helpful = feedback.reduce((sum, f) => sum + f.helpful, 0) / feedback.length;
    const accuracy = feedback.reduce((sum, f) => sum + f.accuracy, 0) / feedback.length;
    const clarity = feedback.reduce((sum, f) => sum + f.clarity, 0) / feedback.length;

    return { helpful, accuracy, clarity };
  }
}
