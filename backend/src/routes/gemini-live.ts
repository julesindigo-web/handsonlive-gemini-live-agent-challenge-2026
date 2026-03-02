import { Router } from 'express';
import { GeminiLiveService } from '../services/gemini-live-service';
import { logger } from '../utils/logger';
import { AppError } from '../utils/error-handler';

export const geminiLiveRouter = Router();
const geminiLiveService = new GeminiLiveService();

geminiLiveRouter.post('/session/start', async (req, res, next) => {
  try {
    const { userId, skill, language = 'id' } = req.body;

    if (!userId || !skill) {
      throw new AppError(400, 'userId and skill are required');
    }

    const session = await geminiLiveService.startSession(userId, skill, language);

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

    await geminiLiveService.stopSession(sessionId);

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

    const status = await geminiLiveService.getSessionStatus(sessionId);

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

    await geminiLiveService.submitFeedback(sessionId, feedback);

    res.json({
      status: 'success',
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    next(error);
  }
});
