import { logger } from './logger';

export interface ErrorAnalyticsEvent {
  errorType: string;
  message: string;
  timestamp: number;
  componentName?: string;
  userId?: string;
  metadata?: Record<string, any>;
  stackTrace?: string;
}

class ErrorAnalytics {
  private static instance: ErrorAnalytics;
  private events: ErrorAnalyticsEvent[] = [];
  private readonly MAX_STORED_EVENTS = 100;
  private readonly BATCH_SEND_THRESHOLD = 10;

  private constructor() {}

  static getInstance(): ErrorAnalytics {
    if (!ErrorAnalytics.instance) {
      ErrorAnalytics.instance = new ErrorAnalytics();
    }
    return ErrorAnalytics.instance;
  }

  trackError(event: Omit<ErrorAnalyticsEvent, 'timestamp'>): void {
    const fullEvent: ErrorAnalyticsEvent = {
      ...event,
      timestamp: Date.now(),
    };

    this.events.push(fullEvent);
    logger.error('Error tracked:', fullEvent);

    if (this.events.length >= this.BATCH_SEND_THRESHOLD) {
      this.sendBatch();
    }

    // Keep only the latest events
    if (this.events.length > this.MAX_STORED_EVENTS) {
      this.events = this.events.slice(-this.MAX_STORED_EVENTS);
    }
  }

  private async sendBatch(): Promise<void> {
    if (this.events.length === 0) return;

    try {
      // TODO: Replace with actual API endpoint when available
      // const response = await fetch('/api/analytics/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ events: this.events }),
      // });

      // For now, just log the batch
      logger.info(`Analytics batch ready to send: ${this.events.length} events`);
      this.events = [];
    } catch (error) {
      logger.error('Failed to send analytics batch:', error);
    }
  }

  getErrorStats(): {
    totalErrors: number;
    errorsByType: Record<string, number>;
    recentErrors: ErrorAnalyticsEvent[];
  } {
    const errorsByType = this.events.reduce((acc, event) => {
      acc[event.errorType] = (acc[event.errorType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalErrors: this.events.length,
      errorsByType,
      recentErrors: this.events.slice(-5), // Last 5 errors
    };
  }
}

export const errorAnalytics = ErrorAnalytics.getInstance();
