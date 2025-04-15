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
  // Enhanced metrics
  interactionToNextPaint: number | null;
  firstInputDelay: number | null;
  cumulativeLayoutShift: number | null;
  timeToInteractive: number | null;
  javaScriptExecution: number | null;
  renderBlockingTime: number | null;
  cacheHitRatio: number | null;
  totalResourceSize: number | null;
  frameRate: number | null;
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
    resourceLoadTimes: {},
    interactionToNextPaint: null,
    firstInputDelay: null,
    cumulativeLayoutShift: null,
    timeToInteractive: null,
    javaScriptExecution: null,
    renderBlockingTime: null,
    cacheHitRatio: null,
    totalResourceSize: null,
    frameRate: null
  };
  private frameRateData: number[] = [];
  private frameRateInterval: number | null = null;

  /**
   * Start measuring app performance
   */
  startMeasuring(): void {
    this.startTime = performance.now();
    this.observeWebVitals();
    this.measureFrameRate();
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

    // Calculate resource metrics
    this.calculateResourceMetrics();

    // Calculate advanced metrics
    this.calculateAdvancedMetrics();

    // Stop frame rate monitoring
    if (this.frameRateInterval !== null) {
      window.clearInterval(this.frameRateInterval);
      this.frameRateInterval = null;
      
      // Calculate average frame rate
      if (this.frameRateData.length > 0) {
        const sum = this.frameRateData.reduce((a, b) => a + b, 0);
        this.metrics.frameRate = Math.round(sum / this.frameRateData.length);
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
      let totalSize = 0;
      let cacheHits = 0;
      
      resources.forEach(resource => {
        const url = new URL(resource.name);
        const fileType = url.pathname.split('.').pop() || 'unknown';
        
        if (!resourceTypes[fileType]) {
          resourceTypes[fileType] = [];
        }
        
        resourceTypes[fileType].push(resource.duration);
        
        // Calculate resource size and cache hits if transferSize is available
        const res = resource as PerformanceResourceTiming;
        if (res.transferSize !== undefined) {
          totalSize += res.transferSize;
          // A cached resource will have transferSize of 0 but decodedBodySize > 0
          if (res.transferSize === 0 && res.decodedBodySize > 0) {
            cacheHits++;
          }
        }
      });
      
      // Calculate average load time by resource type
      Object.keys(resourceTypes).forEach(type => {
        const times = resourceTypes[type];
        const avgTime = Math.round(times.reduce((sum, time) => sum + time, 0) / times.length);
        this.metrics.resourceLoadTimes[type] = avgTime;
      });
      
      // Calculate cache hit ratio
      if (resources.length > 0) {
        this.metrics.cacheHitRatio = Math.round((cacheHits / resources.length) * 100);
        this.metrics.totalResourceSize = Math.round(totalSize / (1024 * 1024) * 100) / 100; // in MB
      }
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
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            this.metrics.largestContentfulPaintTime = Math.round(lastEntry.startTime);
            console.log(`LCP: ${this.metrics.largestContentfulPaintTime}ms`);
          }
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        
        // First Input Delay
        const fidObserver = new PerformanceObserver((entryList) => {
          const entry = entryList.getEntries()[0];
          if (entry) {
            this.metrics.firstInputDelay = Math.round((entry as any).processingStart - (entry as any).startTime);
            console.log(`FID: ${this.metrics.firstInputDelay}ms`);
          }
        });
        fidObserver.observe({ type: 'first-input', buffered: true });
        
        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((entryList) => {
          let clsValue = 0;
          entryList.getEntries().forEach(entry => {
            clsValue += (entry as any).value || 0;
          });
          this.metrics.cumulativeLayoutShift = Math.round(clsValue * 1000) / 1000;
          console.log(`CLS: ${this.metrics.cumulativeLayoutShift}`);
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });

      } catch (e) {
        console.warn('Web Vitals measurement not fully supported', e);
      }
    }
  }
  
  /**
   * Calculate advanced performance metrics
   */
  private calculateAdvancedMetrics(): void {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      
      // Time to Interactive (approximation)
      this.metrics.timeToInteractive = timing.domInteractive - timing.navigationStart;
      
      // JavaScript execution time
      this.metrics.javaScriptExecution = timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart;
      
      // Render blocking time (approximation)
      this.metrics.renderBlockingTime = timing.domComplete - timing.domContentLoadedEventEnd;
      
      console.log(`TTI: ${this.metrics.timeToInteractive}ms, JS Execution: ${this.metrics.javaScriptExecution}ms`);
    }
  }
  
  /**
   * Measure frame rate
   */
  private measureFrameRate(): void {
    if ('requestAnimationFrame' in window) {
      let lastFrameTime = performance.now();
      let frameCount = 0;
      
      const countFrames = () => {
        const now = performance.now();
        frameCount++;
        
        if (now - lastFrameTime >= 1000) { // Calculate every second
          const fps = Math.round(frameCount * 1000 / (now - lastFrameTime));
          this.frameRateData.push(fps);
          frameCount = 0;
          lastFrameTime = now;
        }
        
        requestAnimationFrame(countFrames);
      };
      
      requestAnimationFrame(countFrames);
    }
  }
  
  /**
   * Perform recommended optimizations
   */
  applyOptimizations(): void {
    console.log('Applying performance optimizations...');
    
    // Optimize resource loading
    this.optimizeResourceLoading();
    
    // Optimize rendering
    this.optimizeRendering();
    
    console.log('Optimizations applied');
  }
  
  /**
   * Optimize resource loading
   */
  private optimizeResourceLoading(): void {
    // Preload critical resources
    const preloadUrls = this.getPreloadUrls();
    preloadUrls.forEach(url => {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.href = url;
      preloadLink.as = this.getResourceType(url);
      document.head.appendChild(preloadLink);
    });
    
    // Cache resources in localStorage if appropriate
    if (this.metrics.networkCondition.includes('2g') || this.metrics.networkCondition.includes('slow')) {
      this.enableLocalStorageCaching();
    }
  }
  
  /**
   * Get URLs that should be preloaded
   */
  private getPreloadUrls(): string[] {
    // This would be more sophisticated in a real app
    // Currently we just preload the first image we find
    const images = Array.from(document.getElementsByTagName('img'));
    return images.slice(0, 2).map(img => img.src).filter(src => !!src);
  }
  
  /**
   * Get resource type for preloading
   */
  private getResourceType(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return 'image';
    } else if (['js'].includes(extension || '')) {
      return 'script';
    } else if (['css'].includes(extension || '')) {
      return 'style';
    }
    return 'fetch';
  }
  
  /**
   * Enable localStorage caching for slow connections
   */
  private enableLocalStorageCaching(): void {
    // Simple example - in a real app, this would be more sophisticated
    const cachingScript = document.createElement('script');
    cachingScript.textContent = `
      // Simple resource caching in localStorage
      function cacheResource(url, content) {
        try {
          localStorage.setItem('cache_' + url, content);
          localStorage.setItem('cache_time_' + url, Date.now());
        } catch (e) {
          console.warn('localStorage caching failed', e);
        }
      }
    `;
    document.head.appendChild(cachingScript);
  }
  
  /**
   * Optimize rendering performance
   */
  private optimizeRendering(): void {
    // Reduce layout thrashing
    this.optimizeLayouts();
    
    // Optimize event handlers
    this.optimizeEventHandlers();
  }
  
  /**
   * Optimize layouts to reduce reflows
   */
  private optimizeLayouts(): void {
    // Add a class to the body to enable CSS containment where appropriate
    document.body.classList.add('perf-optimized');
    
    // Add style for performance optimization
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      .perf-optimized .contain-layout {
        contain: layout;
      }
      .perf-optimized .contain-paint {
        contain: paint;
      }
      .perf-optimized .content-visibility-auto {
        content-visibility: auto;
      }
    `;
    document.head.appendChild(styleEl);
    
    // Apply containment to appropriate elements
    const listElements = document.querySelectorAll('ul, ol');
    listElements.forEach(el => {
      el.classList.add('contain-layout');
    });
    
    // Apply content-visibility to below-the-fold content
    const belowFoldElements = Array.from(document.querySelectorAll('section, div'))
      .filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.top > window.innerHeight * 1.5;
      });
    
    belowFoldElements.forEach(el => {
      el.classList.add('content-visibility-auto');
    });
  }
  
  /**
   * Optimize event handlers to reduce JavaScript execution
   */
  private optimizeEventHandlers(): void {
    // Add passive event listeners where appropriate
    const scrollElements = document.querySelectorAll('.scroll-container');
    scrollElements.forEach(el => {
      // Check for scroll event handler and optimize it if it exists
      const scrollHandler = (el as any).onscroll;
      if (scrollHandler) {
        // Remove existing handler 
        (el as any).onscroll = null;
        
        // Add optimized passive event listener
        el.addEventListener('scroll', function(e) {
          // Use requestAnimationFrame to optimize
          window.requestAnimationFrame(() => {
            scrollHandler.call(el, e);
          });
        }, { passive: true });
      }
    });
    
    // Debounce resize handlers
    if (window.onresize) {
      const origResize = window.onresize;
      let resizeTimeout: number | null = null;
      
      window.onresize = function(e) {
        if (resizeTimeout) {
          window.clearTimeout(resizeTimeout);
        }
        
        resizeTimeout = window.setTimeout(() => {
          origResize.call(window, e);
        }, 150);
      };
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();
