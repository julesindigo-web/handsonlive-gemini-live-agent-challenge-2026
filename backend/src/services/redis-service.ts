import { createClient, RedisClientType } from 'redis';
import { logger } from '../utils/logger';

export class RedisService {
  private client: RedisClientType;
  private isConnected: boolean = false;

  constructor() {
    this.client = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379')
      }
    });

    this.client.on('error', (err) => {
      logger.error('Redis client error', { error: err });
      this.isConnected = false;
    });

    this.client.on('connect', () => {
      logger.info('Redis client connected');
      this.isConnected = true;
    });

    this.connect();
  }

  private async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      logger.error('Failed to connect to Redis', { error });
    }
  }

  async cacheSession(sessionId: string, session: any, ttl: number = 3600): Promise<void> {
    if (!this.isConnected) {
      logger.warn('Redis not connected, skipping cache');
      return;
    }

    try {
      await this.client.setEx(
        `session:${sessionId}`,
        ttl,
        JSON.stringify(session)
      );
      logger.debug('Session cached in Redis', { sessionId });
    } catch (error) {
      logger.error('Failed to cache session in Redis', { error, sessionId });
    }
  }

  async getSession(sessionId: string): Promise<any> {
    if (!this.isConnected) {
      return null;
    }

    try {
      const data = await this.client.get(`session:${sessionId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Failed to get session from Redis', { error, sessionId });
      return null;
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await this.client.del(`session:${sessionId}`);
      logger.debug('Session deleted from Redis', { sessionId });
    } catch (error) {
      logger.error('Failed to delete session from Redis', { error, sessionId });
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
      logger.info('Redis client disconnected');
    }
  }
}
