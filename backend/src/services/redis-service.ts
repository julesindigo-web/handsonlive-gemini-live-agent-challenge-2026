import { createClient } from 'redis';
import { logger } from '../utils/logger';

export class RedisService {
  private client: ReturnType<typeof createClient> | null = null;
  private isConnected: boolean = false;

  constructor() {
    try {
      this.client = createClient({
        socket: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
        },
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        logger.info('Redis client connected');
      });

      this.client.on('error', (error: Error) => {
        this.isConnected = false;
        logger.warn('Redis client error - running without Redis caching', { error });
      });

      this.client.connect().catch((error) => {
        logger.warn('Failed to connect to Redis - running without caching', { error });
        this.client = null;
      });
    } catch (error) {
      logger.warn('Failed to initialize Redis client - running without caching', { error });
      this.client = null;
    }
  }

  async cacheSession(sessionId: string, session: any): Promise<void> {
    if (!this.client || !this.isConnected) {
      logger.debug('Redis not available - skipping cache');
      return;
    }

    try {
      await this.client.setEx(
        `session:${sessionId}`,
        3600, // 1 hour TTL
        JSON.stringify(session)
      );
      logger.debug('Session cached in Redis', { sessionId });
    } catch (error) {
      logger.warn('Failed to cache session in Redis', { error, sessionId });
    }
  }

  async getSession(sessionId: string): Promise<any> {
    if (!this.client || !this.isConnected) {
      logger.debug('Redis not available - returning null');
      return null;
    }

    try {
      const data = await this.client.get(`session:${sessionId}`);
      return data ? JSON.parse(data as string) : null;
    } catch (error) {
      logger.warn('Failed to get session from cache', { error, sessionId });
      return null;
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    if (!this.client || !this.isConnected) {
      logger.debug('Redis not available - skipping delete');
      return;
    }

    try {
      await this.client.del(`session:${sessionId}`);
      logger.debug('Session deleted from Redis', { sessionId });
    } catch (error) {
      logger.warn('Failed to delete session from cache', { error, sessionId });
    }
  }

  async disconnect(): Promise<void> {
    if (this.client && this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
      logger.info('Redis client disconnected');
    }
  }
}
