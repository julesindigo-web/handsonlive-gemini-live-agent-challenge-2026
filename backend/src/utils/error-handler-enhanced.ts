import { logger } from '../utils/logger';

export interface ErrorContext {
  sessionId?: string;
  userId?: string;
  skill?: string;
  action?: string;
  timestamp?: number;
}

export class ErrorHandler {
  private static instance: ErrorHandler;

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  handleError(error: Error, context: ErrorContext): void {
    logger.error('Error occurred', { error: error.message, context });

    // Categorize error
    const errorType = this.categorizeError(error);

    // Send appropriate response based on error type
    switch (errorType) {
      case 'network':
        this.handleNetworkError(error, context);
        break;
      case 'validation':
        this.handleValidationError(error, context);
        break;
      case 'auth':
        this.handleAuthError(error, context);
        break;
      case 'rate_limit':
        this.handleRateLimitError(error, context);
        break;
      default:
        this.handleGenericError(error, context);
    }
  }

  private categorizeError(error: Error): string {
    const message = error.message.toLowerCase();

    if (message.includes('network') || message.includes('timeout') || message.includes('econnrefused')) {
      return 'network';
    }
    if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
      return 'validation';
    }
    if (message.includes('auth') || message.includes('unauthorized') || message.includes('forbidden')) {
      return 'auth';
    }
    if (message.includes('rate limit') || message.includes('too many requests')) {
      return 'rate_limit';
    }

    return 'generic';
  }

  private handleNetworkError(_error: Error, context: ErrorContext): void {
    logger.warn('Network error - retrying', { context });
    // Implement retry logic
  }

  private handleValidationError(_error: Error, context: ErrorContext): void {
    logger.warn('Validation error', { context });
    // Return validation error to user
  }

  private handleAuthError(_error: Error, context: ErrorContext): void {
    logger.error('Authentication error', { context });
    // Handle auth failure
  }

  private handleRateLimitError(_error: Error, context: ErrorContext): void {
    logger.warn('Rate limit exceeded', { context });
    // Implement rate limiting
  }

  private handleGenericError(error: Error, context: ErrorContext): void {
    logger.error('Generic error', { error: error.message, context });
    // Handle generic error
  }

  createErrorResponse(error: Error, _context: ErrorContext): {
    success: false;
    error: string;
    type: string;
    retryable: boolean;
  } {
    const errorType = this.categorizeError(error);

    return {
      success: false,
      error: error.message,
      type: errorType,
      retryable: ['network', 'rate_limit'].includes(errorType),
    };
  }
}

export const errorHandler = ErrorHandler.getInstance();
