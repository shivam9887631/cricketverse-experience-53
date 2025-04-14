
/**
 * Performance metrics collection utility for testing app performance
 */

interface PerformanceMetrics {
  startupTime: number;
  responseTime: number;
  memoryUsage: number | null;
  deviceInfo: string;
  networkCondition: string;
  domLoadTime: number;
  firstPaintTime: number;
  largestContentfulPaintTime: number | null;
  resourceLoadTimes: Record<string, number>;
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
    networkCondition: 'Unknown',
    domLoadTime: 0,
    firstPaintTime: 0,
    largestContentfulPaintTime: null,
    resourceLoadTimes: {}
  };

  /**
   * Start measuring app performance
   */
  startMeasuring(): void {
    this.startTime = performance.now();
    this.observeWebVitals();
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

    // Calculate resource load times
    this.calculateResourceMetrics();

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
      this.metrics.domLoadTime = navTiming.domComplete - navTiming.domLoading;
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

  /**
   * Calculate metrics for resource loading
   */
  private calculateResourceMetrics(): void {
    if (performance.getEntriesByType) {
      // Resource timing data
      const resources = performance.getEntriesByType('resource');
      const resourceTypes: Record<string, number[]> = {};
      
      resources.forEach(resource => {
        const url = new URL(resource.name);
        const fileType = url.pathname.split('.').pop() || 'unknown';
        
        if (!resourceTypes[fileType]) {
          resourceTypes[fileType] = [];
        }
        
        resourceTypes[fileType].push(resource.duration);
      });
      
      // Calculate average load time by resource type
      Object.keys(resourceTypes).forEach(type => {
        const times = resourceTypes[type];
        const avgTime = Math.round(times.reduce((sum, time) => sum + time, 0) / times.length);
        this.metrics.resourceLoadTimes[type] = avgTime;
      });
    }
  }

  /**
   * Observe Web Vital metrics using Performance Observer
   */
  private observeWebVitals(): void {
    // First Paint & First Contentful Paint
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    if (firstPaint) {
      this.metrics.firstPaintTime = Math.round(firstPaint.startTime);
    }

    // Observe Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            this.metrics.largestContentfulPaintTime = Math.round(lastEntry.startTime);
            console.log(`LCP: ${this.metrics.largestContentfulPaintTime}ms`);
          }
        });
        
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        console.warn('LCP measurement not supported', e);
      }
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();

