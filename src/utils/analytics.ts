/**
 * Analytics Tracking Utility
 * Tracks user interactions and events for better insights
 */

interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  userId?: string;
  timestamp: string;
  page: string;
  userAgent: string;
  sessionId: string;
}

class Analytics {
  private sessionId: string;
  private userId: string | null = null;
  private isEnabled: boolean = true;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = localStorage.getItem('userId');
    
    // Disable analytics in development if needed
    this.isEnabled = process.env.NODE_ENV === 'production' || 
                     localStorage.getItem('enableAnalytics') === 'true';
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private createEvent(
    event: string,
    category: string,
    action: string,
    label?: string,
    value?: number
  ): AnalyticsEvent {
    return {
      event,
      category,
      action,
      label,
      value,
      userId: this.userId,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      userAgent: navigator.userAgent,
      sessionId: this.sessionId
    };
  }

  private async sendEvent(eventData: AnalyticsEvent): Promise<void> {
    if (!this.isEnabled) {
      console.log('📊 [Analytics] Event (disabled):', eventData);
      return;
    }

    try {
      // Store events locally for now (you can replace with your analytics service)
      const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      events.push(eventData);
      
      // Keep only last 1000 events to prevent storage overflow
      if (events.length > 1000) {
        events.splice(0, events.length - 1000);
      }
      
      localStorage.setItem('analytics_events', JSON.stringify(events));
      
      console.log('📊 [Analytics] Event tracked:', eventData);

      // TODO: Replace with actual analytics service (Google Analytics, Mixpanel, etc.)
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(eventData)
      // });

    } catch (error) {
      console.error('📊 [Analytics] Failed to send event:', error);
    }
  }

  // Set user ID when user logs in
  setUserId(userId: string): void {
    this.userId = userId;
    localStorage.setItem('userId', userId);
  }

  // Clear user ID when user logs out
  clearUserId(): void {
    this.userId = null;
    localStorage.removeItem('userId');
  }

  // Page view tracking
  trackPageView(page: string, title?: string): void {
    this.sendEvent(this.createEvent(
      'page_view',
      'navigation',
      'view',
      page,
      undefined
    ));
  }

  // User authentication events
  trackLogin(method: 'email' | 'google' | 'linkedin' = 'email'): void {
    this.sendEvent(this.createEvent(
      'login',
      'authentication',
      'login',
      method
    ));
  }

  trackSignup(method: 'email' | 'google' | 'linkedin' = 'email'): void {
    this.sendEvent(this.createEvent(
      'signup',
      'authentication',
      'signup',
      method
    ));
  }

  trackLogout(): void {
    this.sendEvent(this.createEvent(
      'logout',
      'authentication',
      'logout'
    ));
  }

  // Job-related events
  trackJobSearch(query: string, filters?: any): void {
    this.sendEvent(this.createEvent(
      'job_search',
      'jobs',
      'search',
      query
    ));
  }

  trackJobView(jobId: string, jobTitle: string): void {
    this.sendEvent(this.createEvent(
      'job_view',
      'jobs',
      'view',
      `${jobId}_${jobTitle}`
    ));
  }

  trackJobApply(jobId: string, jobTitle: string): void {
    this.sendEvent(this.createEvent(
      'job_apply',
      'jobs',
      'apply',
      `${jobId}_${jobTitle}`
    ));
  }

  trackJobSave(jobId: string, jobTitle: string): void {
    this.sendEvent(this.createEvent(
      'job_save',
      'jobs',
      'save',
      `${jobId}_${jobTitle}`
    ));
  }

  // Company events
  trackCompanyView(companyId: string, companyName: string): void {
    this.sendEvent(this.createEvent(
      'company_view',
      'companies',
      'view',
      `${companyId}_${companyName}`
    ));
  }

  // UI interaction events
  trackButtonClick(buttonName: string, location: string): void {
    this.sendEvent(this.createEvent(
      'button_click',
      'ui_interaction',
      'click',
      `${buttonName}_${location}`
    ));
  }

  trackFormSubmit(formName: string, success: boolean): void {
    this.sendEvent(this.createEvent(
      'form_submit',
      'forms',
      success ? 'success' : 'error',
      formName
    ));
  }

  trackFeatureUse(featureName: string, action: string): void {
    this.sendEvent(this.createEvent(
      'feature_use',
      'features',
      action,
      featureName
    ));
  }

  // Error tracking
  trackError(error: string, context: string): void {
    this.sendEvent(this.createEvent(
      'error',
      'errors',
      'error',
      `${context}_${error}`
    ));
  }

  // Performance tracking
  trackPerformance(metric: string, value: number, context: string): void {
    this.sendEvent(this.createEvent(
      'performance',
      'performance',
      metric,
      context,
      value
    ));
  }

  // Get analytics data (for debugging or admin dashboard)
  getStoredEvents(): AnalyticsEvent[] {
    try {
      return JSON.parse(localStorage.getItem('analytics_events') || '[]');
    } catch {
      return [];
    }
  }

  // Clear stored events
  clearStoredEvents(): void {
    localStorage.removeItem('analytics_events');
  }

  // Enable/disable analytics
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    localStorage.setItem('enableAnalytics', enabled.toString());
  }
}

// Create singleton instance
const analytics = new Analytics();

export default analytics;