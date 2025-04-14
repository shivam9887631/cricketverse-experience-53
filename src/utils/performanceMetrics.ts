
/**
 * Performance metrics collection utility for testing app performance
 */

interface PerformanceMetrics {
  startupTime: number;
  responseTime: number;
  memoryUsage: number | null;
  deviceInfo: string;
  networkCondition: string;
}

// Define an extended Performance interface to handle non-standard memory property
interface ExtendedPerformance extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

class PerformanceMonitor {
  private startTime: number = 0;
  private metrics: PerformanceMetrics = {
    startupTime: 0,
    responseTime: 0,
    memoryUsage: null,
    deviceInfo: 'Unknown',
    networkCondition: 'Unknown'
  };

  /**
   * Start measuring app performance
   */
  startMeasuring(): void {
    this.startTime = performance.now();
    console.log('🔍 Performance monitoring started');
  }

  /**
   * Stop measuring and calculate metrics
   */
  stopMeasuring(): PerformanceMetrics {
    const endTime = performance.now();
    this.metrics.responseTime = Math.round(endTime - this.startTime);
    
    // Get memory usage if available in browser (Chrome-specific feature)
    const extendedPerf = performance as ExtendedPerformance;
    if (extendedPerf.memory) {
      this.metrics.memoryUsage = Math.round(extendedPerf.memory.usedJSHeapSize / (1024 * 1024));
    }

    // Get device info
    this.metrics.deviceInfo = `${navigator.platform} - ${navigator.userAgent}`;

    // Get network information
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        this.metrics.networkCondition = `${connection.effectiveType} - ${connection.downlink} Mbps`;
      }
    }

    console.log('📊 Performance metrics collected:', this.metrics);
    return this.metrics;
  }

  /**
   * Measure startup time from navigation timing API
   */
  measureStartupTime(): void {
    if (window.performance && window.performance.timing) {
      const navTiming = window.performance.timing;
      this.metrics.startupTime = navTiming.domContentLoadedEventEnd - navTiming.navigationStart;
      console.log(`🚀 App startup time: ${this.metrics.startupTime}ms`);
    } else {
      console.warn('Navigation Timing API not supported');
    }
  }
  
  /**
   * Get the collected metrics
   */
  getMetrics(): PerformanceMetrics {
    return this.metrics;
  }
  
  /**
   * Test app response time for a specific action
   * @param action Function to test
   * @param label Action name for logging
   */
  async measureActionTime(action: () => Promise<any>, label: string): Promise<number> {
    const start = performance.now();
    await action();
    const end = performance.now();
    const duration = Math.round(end - start);
    console.log(`⏱️ ${label}: ${duration}ms`);
    return duration;
  }
}

export const performanceMonitor = new PerformanceMonitor();
