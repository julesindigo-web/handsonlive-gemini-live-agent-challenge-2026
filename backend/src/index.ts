import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { geminiLiveRouter } from './routes/gemini-live';
import { healthRouter } from './routes/health';
import { errorHandler } from './utils/error-handler';
import { LiveHandler } from './websocket/live-handler';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
const liveHandler = new LiveHandler();

const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/health', healthRouter);
app.use('/api/gemini-live', geminiLiveRouter);

wss.on('connection', (ws, req) => {
  logger.info('WebSocket client connected', { url: req.url });

  // Parse query parameters
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const userId = url.searchParams.get('userId') || 'anonymous';
  const skill = url.searchParams.get('skill') || 'cooking';
  const language = url.searchParams.get('language') || 'id';

  // Handle live session
  liveHandler.handleConnection(ws, userId, skill, language).catch((error) => {
    logger.error('Failed to create live session', { error });
    ws.send(JSON.stringify({ type: 'error', message: 'Failed to create session' }));
  });
});

app.use(errorHandler);

server.listen(PORT, () => {
  logger.info(`HandsOnLive Backend running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`WebSocket server ready`);
  logger.info(`Active sessions: ${liveHandler.getActiveSessionCount()}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});
