import { Router } from 'express';
import { GeminiLiveService } from '../services/gemini-live-service';
import { logger } from '../utils/logger';
import { AppError } from '../utils/error-handler';

export const geminiLiveRouter = Router();
let geminiLiveService: GeminiLiveService | null = null;

function getService() {
  if (!geminiLiveService) {
    geminiLiveService = new GeminiLiveService();
  }
  return geminiLiveService;
}

geminiLiveRouter.post('/session/start', async (req, res, next) => {
  try {
    const { userId, skill, language = 'id' } = req.body;

    if (!userId || !skill) {
      throw new AppError(400, 'userId and skill are required');
    }

    const service = getService();
    const session = await service.startSession(userId, skill, language);

    logger.info('Gemini Live session started', { userId, skill, sessionId: session.id });

    res.json({
      status: 'success',
      data: session
    });
  } catch (error) {
    next(error);
  }
});

geminiLiveRouter.post('/session/:sessionId/stop', async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const service = getService();
    await service.stopSession(sessionId);

    logger.info('Gemini Live session stopped', { sessionId });

    res.json({
      status: 'success',
      message: 'Session stopped successfully'
    });
  } catch (error) {
    next(error);
  }
});

geminiLiveRouter.get('/session/:sessionId/status', async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const service = getService();
    const status = await service.getSessionStatus(sessionId);

    res.json({
      status: 'success',
      data: status
    });
  } catch (error) {
    next(error);
  }
});

geminiLiveRouter.post('/feedback', async (req, res, next) => {
  try {
    const { sessionId, feedback } = req.body;

    if (!sessionId || !feedback) {
      throw new AppError(400, 'sessionId and feedback are required');
    }

    const service = getService();
    await service.submitFeedback(sessionId, feedback);

    res.json({
      status: 'success',
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    next(error);
  }
});
