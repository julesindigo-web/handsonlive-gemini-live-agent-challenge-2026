import { Firestore } from '@google-cloud/firestore';
import { logger } from '../utils/logger';

export class FirestoreService {
  private db: Firestore;

  constructor() {
    this.db = new Firestore({
      projectId: process.env.GOOGLE_CLOUD_PROJECT,
      databaseId: process.env.FIRESTORE_DATABASE || '(default)'
    });
  }

  async saveSession(session: any): Promise<void> {
    try {
      await this.db.collection('sessions').doc(session.id).set({
        ...session,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      logger.debug('Session saved to Firestore', { sessionId: session.id });
    } catch (error) {
      logger.error('Failed to save session to Firestore', { error, sessionId: session.id });
      throw error;
    }
  }

  async updateSession(sessionId: string, updates: any): Promise<void> {
    try {
      await this.db.collection('sessions').doc(sessionId).update({
        ...updates,
        updatedAt: new Date()
      });
      logger.debug('Session updated in Firestore', { sessionId });
    } catch (error) {
      logger.error('Failed to update session in Firestore', { error, sessionId });
      throw error;
    }
  }

  async getSession(sessionId: string): Promise<any> {
    try {
      const doc = await this.db.collection('sessions').doc(sessionId).get();
      if (!doc.exists) {
        return null;
      }
      return doc.data();
    } catch (error) {
      logger.error('Failed to get session from Firestore', { error, sessionId });
      throw error;
    }
  }

  async saveFeedback(sessionId: string, feedback: any): Promise<void> {
    try {
      await this.db.collection('feedback').add({
        sessionId,
        feedback,
        createdAt: new Date()
      });
      logger.debug('Feedback saved to Firestore', { sessionId });
    } catch (error) {
      logger.error('Failed to save feedback to Firestore', { error, sessionId });
      throw error;
    }
  }

  async saveUserProgress(userId: string, skill: string, progress: any): Promise<void> {
    try {
      await this.db.collection('user_progress').doc(`${userId}_${skill}`).set({
        userId,
        skill,
        progress,
        updatedAt: new Date()
      }, { merge: true });
      logger.debug('User progress saved', { userId, skill });
    } catch (error) {
      logger.error('Failed to save user progress', { error, userId, skill });
      throw error;
    }
  }

  async getUserProgress(userId: string, skill: string): Promise<any> {
    try {
      const doc = await this.db.collection('user_progress').doc(`${userId}_${skill}`).get();
      return doc.exists ? doc.data() : null;
    } catch (error) {
      logger.error('Failed to get user progress', { error, userId, skill });
      throw error;
    }
  }
}
