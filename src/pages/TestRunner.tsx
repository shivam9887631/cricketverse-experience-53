
import React, { useState, useEffect } from 'react';
import { testRunner } from '../utils/testRunner';
import '../tests/deviceFeatureTests';
import '../tests/performanceTests';  // Import the new performance tests
import { performanceMonitor } from '../utils/performanceMetrics';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Skeleton } from '../components/ui/skeleton';
import { useToast } from '../hooks/use-toast';
import { CheckCircle, AlertCircle, LineChart, Zap } from 'lucide-react';

const TestRunnerPage: React.FC = () => {
  const [testResults, setTestResults] = useState<{
    total: number;
    passed: number;
    failed: number;
    results: { name: string; passed: boolean; error?: any }[];
  } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [perfMetrics, setPerfMetrics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('results');
  const { toast } = useToast();
  
  // Start performance monitoring when the page loads
  useEffect(() => {
    performanceMonitor.startMeasuring();
    return () => {
      const metrics = performanceMonitor.stopMeasuring();
      setPerfMetrics(metrics);
    };
  }, []);
  
  const runTests = async () => {
    setIsRunning(true);
    try {
      await testRunner.runAll();
      const results = testRunner.getSummary();
      setTestResults(results);
      const metrics = performanceMonitor.getMetrics();
      setPerfMetrics(metrics);
      
      // Show toast based on test results
      if (results.failed > 0) {
        toast({
          title: "Tests Completed with Issues",
          description: `${results.passed} passed, ${results.failed} failed`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Tests Passed Successfully",
          description: `All ${results.total} tests passed`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Error running tests:", error);
      toast({
        title: "Error Running Tests",
        description: "Check console for details",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Helper to render performance score
  const renderPerformanceScore = (value: number | null, threshold: number, unit: string = '', reverse: boolean = false): JSX.Element => {
    if (value === null) return <span className="text-muted-foreground">N/A</span>;
    
    const isGood = reverse ? value > threshold : value < threshold;
    const color = isGood ? "text-green-600" : "text-amber-600";
    
    return (
      <span className={color}>
        {value}{unit} {isGood ? <CheckCircle className="inline h-4 w-4" /> : <AlertCircle className="inline h-4 w-4" />}
      </span>
    );
  };
  
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Mobile App Test Runner</span>
            <Badge variant={isRunning ? "outline" : "default"}>
              {isRunning ? "Running..." : "Ready"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Run tests and performance analysis in Lovable environment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            data-testid="run-tests-button"
            className="mb-4"
          >
            {isRunning ? "Running Tests..." : "Run All Tests"}
          </Button>
          
          {testResults && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Test Summary</h3>
                <div className="flex gap-2">
                  <Badge variant="success" className="bg-green-500">
                    {testResults.passed} Passed
                  </Badge>
                  <Badge variant="destructive" className="bg-red-500">
                    {testResults.failed} Failed
                  </Badge>
                </div>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="results">Test Results</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="optimizations">Optimizations</TabsTrigger>
                </TabsList>
                
                <TabsContent value="results">
                  <Separator className="my-4" />
                  
                  <div className="mt-4 space-y-3" data-testid="test-results-list">
                    {testResults.results.map((result, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-md ${result.passed ? 'bg-green-50' : 'bg-red-50'}`}
                        data-testid={`test-result-${idx}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{result.name}</span>
                          <Badge variant={result.passed ? "success" : "destructive"}>
                            {result.passed ? "PASS" : "FAIL"}
                          </Badge>
                        </div>
                        {!result.passed && result.error && (
                          <div className="mt-2 text-sm text-red-600 p-2 bg-red-50 rounded">
                            {result.error.toString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="performance">
                  <Separator className="my-4" />
                  
                  {perfMetrics ? (
                    <div className="space-y-4" data-testid="performance-metrics">
                      <h4 className="font-medium mb-2 text-lg flex items-center">
                        <LineChart className="h-5 w-5 mr-2" /> Core Web Vitals
                      </h4>
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                        <Card className="p-3">
                          <div className="text-muted-foreground text-sm">Startup Time</div>
                          <div className="text-xl font-bold">
                            {renderPerformanceScore(perfMetrics.startupTime, 5000, ' ms')}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">App initialization</div>
                        </Card>
                        
                        <Card className="p-3">
                          <div className="text-muted-foreground text-sm">Response Time</div>
                          <div className="text-xl font-bold">
                            {renderPerformanceScore(perfMetrics.responseTime, 300, ' ms')}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">UI responsiveness</div>
                        </Card>
                        
                        <Card className="p-3">
                          <div className="text-muted-foreground text-sm">Memory Usage</div>
                          <div className="text-xl font-bold">
                            {perfMetrics.memoryUsage !== null ? 
                              renderPerformanceScore(perfMetrics.memoryUsage, 100, ' MB') : 
                              'N/A'}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">JS heap size</div>
                        </Card>
                        
                        <Card className="p-3">
                          <div className="text-muted-foreground text-sm">LCP</div>
                          <div className="text-xl font-bold">
                            {perfMetrics.largestContentfulPaintTime !== null ? 
                              renderPerformanceScore(perfMetrics.largestContentfulPaintTime, 2500, ' ms') : 
                              'N/A'}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Largest content</div>
                        </Card>
                        
                        <Card className="p-3">
                          <div className="text-muted-foreground text-sm">CLS</div>
                          <div className="text-xl font-bold">
                            {perfMetrics.cumulativeLayoutShift !== null ? 
                              renderPerformanceScore(perfMetrics.cumulativeLayoutShift, 0.1) : 
                              'N/A'}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Layout stability</div>
                        </Card>
                        
                        <Card className="p-3">
                          <div className="text-muted-foreground text-sm">FID</div>
                          <div className="text-xl font-bold">
                            {perfMetrics.firstInputDelay !== null ? 
                              renderPerformanceScore(perfMetrics.firstInputDelay, 100, ' ms') : 
                              'N/A'}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Input delay</div>
                        </Card>
                        
                        <Card className="p-3">
                          <div className="text-muted-foreground text-sm">Frame Rate</div>
                          <div className="text-xl font-bold">
                            {perfMetrics.frameRate !== null ? 
                              renderPerformanceScore(perfMetrics.frameRate, 30, ' fps', true) : 
                              'N/A'}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">UI smoothness</div>
                        </Card>
                        
                        <Card className="p-3">
                          <div className="text-muted-foreground text-sm">Cache Hit</div>
                          <div className="text-xl font-bold">
                            {perfMetrics.cacheHitRatio !== null ? 
                              renderPerformanceScore(perfMetrics.cacheHitRatio, 60, '%', true) : 
                              'N/A'}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Resource caching</div>
                        </Card>
                        
                        <Card className="p-3">
                          <div className="text-muted-foreground text-sm">Resources</div>
                          <div className="text-xl font-bold">
                            {perfMetrics.totalResourceSize !== null ? 
                              renderPerformanceScore(perfMetrics.totalResourceSize, 3, ' MB') : 
                              'N/A'}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Total size</div>
                        </Card>
                      </div>
                      
                      <h4 className="font-medium mt-6 mb-2 text-lg flex items-center">
                        <Zap className="h-5 w-5 mr-2" /> Resource Load Times
                      </h4>
                      
                      {Object.keys(perfMetrics.resourceLoadTimes).length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Resource Type</TableHead>
                              <TableHead className="text-right">Avg Load Time (ms)</TableHead>
                              <TableHead className="text-right">Score</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(perfMetrics.resourceLoadTimes).map(([type, time]) => (
                              <TableRow key={type}>
                                <TableCell className="font-medium">{type}</TableCell>
                                <TableCell className="text-right">{time}</TableCell>
                                <TableCell className="text-right">
                                  {renderPerformanceScore(time as number, 150, '')}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center text-muted-foreground p-4">No resource data available</div>
                      )}
                      
                      <div className="mt-6">
                        <h4 className="font-medium mb-2 text-lg">Environment</h4>
                        <Card className="p-4">
                          <h5 className="text-sm font-medium mb-1">Network</h5>
                          <p className="text-sm text-muted-foreground mb-3">{perfMetrics.networkCondition}</p>
                          
                          <h5 className="text-sm font-medium mb-1">Device</h5>
                          <p className="text-sm text-muted-foreground break-words">{perfMetrics.deviceInfo}</p>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 p-4">
                      <Skeleton className="h-8 w-3/4" />
                      <div className="grid grid-cols-3 gap-3">
                        {[...Array(6)].map((_, i) => (
                          <Skeleton key={i} className="h-24" />
                        ))}
                      </div>
                      <Skeleton className="h-8 w-3/4 mt-6" />
                      <Skeleton className="h-48" />
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="optimizations">
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <h4 className="font-medium mb-2 text-lg">Performance Optimization Suggestions</h4>
                    
                    <div className="space-y-3">
                      <Card className="p-4 bg-green-50">
                        <h5 className="font-medium flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Resource Optimization
                        </h5>
                        <p className="text-sm mt-2">
                          Critical resources are now preloaded for faster loading. Resource caching has been 
                          enhanced for slow connections.
                        </p>
                        <div className="mt-3 text-xs text-muted-foreground">
                          {perfMetrics && perfMetrics.cacheHitRatio !== null ? 
                            `Current cache hit ratio: ${perfMetrics.cacheHitRatio}%` : 
                            'Enable resource caching to improve performance'}
                        </div>
                      </Card>
                      
                      <Card className="p-4 bg-green-50">
                        <h5 className="font-medium flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2" /> 
                          Layout Optimization
                        </h5>
                        <p className="text-sm mt-2">
                          CSS containment applied to reduce layout thrashing. Content-visibility optimizations
                          for below-the-fold content.
                        </p>
                        <div className="mt-3 text-xs text-muted-foreground">
                          {perfMetrics && perfMetrics.cumulativeLayoutShift !== null ? 
                            `Current CLS: ${perfMetrics.cumulativeLayoutShift}` : 
                            'Run a test to measure layout stability'}
                        </div>
                      </Card>
                      
                      <Card className="p-4 bg-green-50">
                        <h5 className="font-medium flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2" /> 
                          Event Handler Optimization
                        </h5>
                        <p className="text-sm mt-2">
                          Event handlers optimized with passive listeners. Scroll and resize events 
                          are now more efficient.
                        </p>
                        <div className="mt-3 text-xs text-muted-foreground">
                          {perfMetrics && perfMetrics.firstInputDelay !== null ? 
                            `Current input delay: ${perfMetrics.firstInputDelay}ms` : 
                            'Run a test to measure input responsiveness'}
                        </div>
                      </Card>
                      
                      <Button 
                        onClick={() => {
                          performanceMonitor.applyOptimizations();
                          toast({
                            title: "Optimizations Applied",
                            description: "Performance optimizations have been applied to the application",
                          });
                        }} 
                        className="w-full"
                      >
                        Apply All Optimizations
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Console Output</CardTitle>
          <CardDescription>
            Check browser console (F12 {'>'} Console) for detailed test logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-900 text-slate-50 p-4 rounded-md font-mono text-sm overflow-auto max-h-64">
            <pre data-testid="console-output">
              {testResults ? (
                `🧪 Test Results: ${testResults.passed} passed, ${testResults.failed} failed\n\n` +
                testResults.results.map(r => 
                  `${r.passed ? '✅ PASS: ' : '❌ FAIL: '}${r.name}${r.error ? '\n   ' + r.error : ''}`
                ).join('\n')
              ) : 'Run tests to see output here...'}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestRunnerPage;
