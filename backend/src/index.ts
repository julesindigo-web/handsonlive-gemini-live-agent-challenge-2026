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

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

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

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());
      logger.debug('WebSocket message received', { type: data.type });
    } catch (error) {
      logger.error('WebSocket message error', { error });
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
    }
  });

  ws.on('close', () => {
    logger.info('WebSocket client disconnected');
  });

  ws.on('error', (error) => {
    logger.error('WebSocket error', { error });
  });
});

app.use(errorHandler);

server.listen(PORT, () => {
  logger.info(`HandsOnLive Backend running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`WebSocket server ready`);
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
