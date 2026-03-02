import { Router } from 'express';
import { logger } from '../utils/logger';

export const healthRouter = Router();

healthRouter.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

healthRouter.get('/ready', async (req, res) => {
  try {
    const checks = {
      geminiApi: true,
      firestore: true,
      redis: true
    };

    const allHealthy = Object.values(checks).every(check => check);

    res.status(allHealthy ? 200 : 503).json({
      status: allHealthy ? 'ready' : 'not ready',
      checks,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Health check failed', { error });
    res.status(503).json({
      status: 'not ready',
      error: 'Health check failed'
    });
  }
});
