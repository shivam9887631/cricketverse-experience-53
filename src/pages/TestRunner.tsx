
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
    await testRunner.runAll();
    setTestResults(testRunner.getSummary());
    const metrics = performanceMonitor.getMetrics();
    setPerfMetrics(metrics);
    setIsRunning(false);
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
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="results">Test Results</TabsTrigger>
                  <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
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
                      <h4 className="font-medium mb-2 text-lg">Core Web Vitals</h4>
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                        <Card className="p-3">
                          <div className="text-muted-foreground text-sm">Startup Time</div>
                          <div className="text-xl font-bold">{perfMetrics.startupTime} ms</div>
                          <div className="text-xs text-muted-foreground mt-1">App initialization</div>
                        </Card>
                        
                        <Card className="p-3">
                          <div className="text-muted-foreground text-sm">Response Time</div>
                          <div className="text-xl font-bold">{perfMetrics.responseTime} ms</div>
                          <div className="text-xs text-muted-foreground mt-1">UI responsiveness</div>
                        </Card>
                        
                        <Card className="p-3">
                          <div className="text-muted-foreground text-sm">Memory Usage</div>
                          <div className="text-xl font-bold">
                            {perfMetrics.memoryUsage !== null ? `${perfMetrics.memoryUsage} MB` : 'N/A'}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">JS heap size</div>
                        </Card>
                        
                        <Card className="p-3">
                          <div className="text-muted-foreground text-sm">DOM Load</div>
                          <div className="text-xl font-bold">{perfMetrics.domLoadTime} ms</div>
                          <div className="text-xs text-muted-foreground mt-1">DOM rendering</div>
                        </Card>
                        
                        <Card className="p-3">
                          <div className="text-muted-foreground text-sm">First Paint</div>
                          <div className="text-xl font-bold">
                            {perfMetrics.firstPaintTime ? `${perfMetrics.firstPaintTime} ms` : 'N/A'}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Initial rendering</div>
                        </Card>
                        
                        <Card className="p-3">
                          <div className="text-muted-foreground text-sm">LCP</div>
                          <div className="text-xl font-bold">
                            {perfMetrics.largestContentfulPaintTime ? `${perfMetrics.largestContentfulPaintTime} ms` : 'N/A'}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Largest content</div>
                        </Card>
                      </div>
                      
                      <h4 className="font-medium mt-6 mb-2 text-lg">Resource Load Times</h4>
                      
                      {Object.keys(perfMetrics.resourceLoadTimes).length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Resource Type</TableHead>
                              <TableHead className="text-right">Avg Load Time (ms)</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(perfMetrics.resourceLoadTimes).map(([type, time]) => (
                              <TableRow key={type}>
                                <TableCell className="font-medium">{type}</TableCell>
                                <TableCell className="text-right">{time}</TableCell>
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
                    <div className="text-center p-4">Run tests to see performance metrics</div>
                  )}
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

