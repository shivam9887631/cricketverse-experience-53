
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
                  <Badge variant="default" className="bg-green-50">
                    {testResults.passed} Passed
                  </Badge>
                  <Badge variant="destructive" className="bg-red-50">
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
                          <Badge variant={result.passed ? "default" : "destructive"}>
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
                      <div className="grid grid-cols-2 gap-3">
                        <Card className="p-3">
                          <div className="text-muted-foreground text-sm">Startup Time</div>
                          <div className="text-xl font-bold">{perfMetrics.startupTime} ms</div>
                        </Card>
                        
                        <Card className="p-3">
                          <div className="text-muted-foreground text-sm">Response Time</div>
                          <div className="text-xl font-bold">{perfMetrics.responseTime} ms</div>
                        </Card>
                        
                        <Card className="p-3">
                          <div className="text-muted-foreground text-sm">Memory Usage</div>
                          <div className="text-xl font-bold">
                            {perfMetrics.memoryUsage !== null ? `${perfMetrics.memoryUsage} MB` : 'N/A'}
                          </div>
                        </Card>
                        
                        <Card className="p-3">
                          <div className="text-muted-foreground text-sm">Network</div>
                          <div className="text-sm font-medium truncate">{perfMetrics.networkCondition}</div>
                        </Card>
                      </div>
                      
                      <div className="mt-3">
                        <h4 className="font-medium mb-2">Device Information</h4>
                        <p className="text-sm text-muted-foreground break-words">{perfMetrics.deviceInfo}</p>
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
