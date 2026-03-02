import { WebSocket } from 'ws';
import { logger } from '../utils/logger';
import { GeminiLiveAgent } from '../agents/gemini-live-agent';
import { FirestoreService } from '../services/firestore-service';
import { RedisService } from '../services/redis-service';
import { RAGService } from '../services/rag-service';
import { AgentMemoryService } from '../services/agent-memory-service';

export interface LiveSession {
  sessionId: string;
  userId: string;
  skill: string;
  language: string;
  ws: WebSocket;
  agent: GeminiLiveAgent;
  startTime: Date;
  lastActivity: Date;
}

export class LiveHandler {
  private sessions: Map<string, LiveSession> = new Map();
  private firestoreService: FirestoreService;
  private redisService: RedisService;
  private ragService: RAGService;
  private memoryService: AgentMemoryService;

  constructor() {
    this.firestoreService = new FirestoreService();
    this.redisService = new RedisService();
    this.ragService = new RAGService();
    this.memoryService = new AgentMemoryService(this.firestoreService);
  }

  async handleConnection(ws: WebSocket, userId: string, skill: string, language: string) {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const agent = new GeminiLiveAgent(
      skill,
      language,
      this.ragService,
      this.memoryService
    );

    const session: LiveSession = {
      sessionId,
      userId,
      skill,
      language,
      ws,
      agent,
      startTime: new Date(),
      lastActivity: new Date(),
    };

    this.sessions.set(sessionId, session);

    // Initialize agent
    await agent.startSession(userId, skill, language);

    // Save session to Firestore
    await this.firestoreService.saveSession({
      id: sessionId,
      userId,
      skill,
      language,
      startedAt: new Date(),
      status: 'active',
    });

    // Cache session in Redis
    await this.redisService.cacheSession(sessionId, session);

    logger.info('Live session created', { sessionId, userId, skill });

    // Send session created message
    ws.send(JSON.stringify({
      type: 'session_created',
      data: { sessionId, skill, language },
    }));

    // Setup message handler
    this.setupMessageHandler(session);

    // Setup cleanup on disconnect
    ws.on('close', () => this.handleDisconnect(sessionId));
  }

  private setupMessageHandler(session: LiveSession) {
    session.ws.on('message', async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        session.lastActivity = new Date();

        logger.debug('Message received', { type: message.type, sessionId: session.sessionId });

        switch (message.type) {
          case 'video_frame':
            await this.handleVideoFrame(session, message.data);
            break;

          case 'audio_chunk':
            await this.handleAudioChunk(session, message.data);
            break;

          case 'interruption':
            await this.handleInterruption(session, message.data);
            break;

          case 'ping':
            session.ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
            break;

          default:
            logger.warn('Unknown message type', { type: message.type });
        }
      } catch (error) {
        logger.error('Error handling message', { error, sessionId: session.sessionId });
        session.ws.send(JSON.stringify({
          type: 'error',
          message: 'Failed to process message',
        }));
      }
    });
  }

  private async handleVideoFrame(session: LiveSession, frameData: string) {
    try {
      const response = await session.agent.processVideoFrame({
        data: Buffer.from(frameData, 'base64'),
        timestamp: Date.now(),
      });

      if (response.text) {
        session.ws.send(JSON.stringify({
          type: 'agent_response',
          data: {
            text: response.text,
            timestamp: Date.now(),
          },
        }));
      }

      // Update session activity
      await this.updateSessionActivity(session.sessionId);
    } catch (error) {
      logger.error('Error processing video frame', { error, sessionId: session.sessionId });
    }
  }

  private async handleAudioChunk(session: LiveSession, audioData: string) {
    try {
      const response = await session.agent.processAudioChunk({
        data: Buffer.from(audioData, 'base64'),
        timestamp: Date.now(),
      });

      if (response.text) {
        session.ws.send(JSON.stringify({
          type: 'agent_response',
          data: {
            text: response.text,
            timestamp: Date.now(),
          },
        }));
      }

      // Update session activity
      await this.updateSessionActivity(session.sessionId);
    } catch (error) {
      logger.error('Error processing audio chunk', { error, sessionId: session.sessionId });
    }
  }

  private async handleInterruption(session: LiveSession, userMessage: string) {
    try {
      const response = await session.agent.handleInterruption(userMessage);

      if (response.text) {
        session.ws.send(JSON.stringify({
          type: 'agent_response',
          data: {
            text: response.text,
            timestamp: Date.now(),
          },
        }));
      }

      // Update session activity
      await this.updateSessionActivity(session.sessionId);
    } catch (error) {
      logger.error('Error handling interruption', { error, sessionId: session.sessionId });
    }
  }

  private async handleDisconnect(sessionId: string) {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) return;

      logger.info('Session disconnected', { sessionId });

      // Stop agent
      await session.agent.stopSession();

      // Update Firestore
      await this.firestoreService.updateSession(sessionId, {
        status: 'completed',
        endedAt: new Date(),
      });

      // Remove from Redis
      await this.redisService.deleteSession(sessionId);

      // Remove from memory
      this.sessions.delete(sessionId);
    } catch (error) {
      logger.error('Error handling disconnect', { error, sessionId });
    }
  }

  private async updateSessionActivity(sessionId: string) {
    try {
      await this.firestoreService.updateSession(sessionId, {
        lastActivity: new Date(),
      });
    } catch (error) {
      logger.error('Error updating session activity', { error, sessionId });
    }
  }

  getActiveSessionCount(): number {
    return this.sessions.size;
  }

  getSession(sessionId: string): LiveSession | undefined {
    return this.sessions.get(sessionId);
  }
}
