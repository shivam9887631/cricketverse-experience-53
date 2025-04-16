
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { runAllTests, runPerformanceTests, TestResult } from '@/utils/testRunner';
import { performanceMonitor } from '@/utils/performanceMetrics';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

// Fix the type error by ensuring we properly type the components
const TestRunnerPage = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [optimizationsApplied, setOptimizationsApplied] = useState(false);

  const handleRunTests = async (type: 'all' | 'performance') => {
    setIsRunning(true);
    setProgress(0);
    setTestResults([]);
    
    // Progress simulation - would be replaced with actual progress in a real system
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, 200);
    
    try {
      // Run the appropriate tests
      let results: TestResult[];
      
      if (type === 'all') {
        results = await runAllTests();
      } else {
        results = await runPerformanceTests();
      }
      
      // Update results and complete progress
      setTestResults(results);
      setProgress(100);
    } catch (error) {
      console.error('Error running tests:', error);
      setTestResults([{
        name: 'Test Error',
        result: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        duration: 0
      }]);
    } finally {
      clearInterval(progressInterval);
      setIsRunning(false);
    }
  };

  const applyOptimizations = () => {
    try {
      performanceMonitor.applyOptimizations();
      setOptimizationsApplied(true);
    } catch (error) {
      console.error('Failed to apply optimizations:', error);
    }
  };

  // Group results by status for better display
  const passedTests = testResults.filter(test => test.result === 'passed');
  const failedTests = testResults.filter(test => test.result === 'failed');
  const warningTests = testResults.filter(test => test.result === 'warning');
  
  // Calculate metrics and stats
  const totalTests = testResults.length;
  const passRate = totalTests > 0 ? Math.round((passedTests.length / totalTests) * 100) : 0;
  
  // Performance metrics display helper
  const renderMetrics = () => {
    const performanceTests = testResults.filter(test => test.name.includes('Performance'));
    if (performanceTests.length === 0) return <p>No performance data available</p>;
    
    return (
      <div className="space-y-4">
        {performanceTests.map((test, index) => (
          <div key={index} className="border rounded-lg p-4">
            <h3 className="font-medium">{test.name}</h3>
            {test.metrics && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {Object.entries(test.metrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground">{key}:</span>
                    <span className="font-mono">{value?.toString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderOptimizationsTab = () => {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Performance Optimizations</CardTitle>
            <CardDescription>Apply and monitor performance improvements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h3 className="font-medium mb-2">Available Optimizations</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Resource loading optimization (preloading, caching)</li>
                <li>CSS containment for better layout performance</li>
                <li>Event handler optimization with passive listeners</li>
                <li>Content visibility for off-screen elements</li>
                <li>Debounced resize handlers</li>
              </ul>
            </div>
            
            <Button 
              onClick={applyOptimizations} 
              disabled={optimizationsApplied}
            >
              {optimizationsApplied ? 'Optimizations Applied' : 'Apply Optimizations'}
            </Button>
            
            {optimizationsApplied && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Optimizations have been applied successfully. Run performance tests again to see the impact.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Test Runner</h1>
            <p className="text-muted-foreground">
              Run tests to verify app functionality and performance
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setActiveTab('all');
                handleRunTests('all');
              }}
              disabled={isRunning}
            >
              Run All Tests
            </Button>
            <Button
              onClick={() => {
                setActiveTab('performance');
                handleRunTests('performance');
              }}
              disabled={isRunning}
              variant="outline"
            >
              Run Performance Tests
            </Button>
          </div>
        </div>

        {isRunning && (
          <div className="space-y-2">
            <p>Running tests...</p>
            <Progress value={progress} />
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Tests</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="optimizations">Optimizations</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {testResults.length > 0 ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Test Results Summary</CardTitle>
                    <CardDescription>
                      {passRate}% pass rate ({passedTests.length}/{totalTests} tests)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                        <span>Passed: {passedTests.length}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                        <span>Failed: {failedTests.length}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                        <span>Warnings: {warningTests.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {testResults.map((test, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{test.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{test.duration}ms</span>
                            {test.result === 'passed' && <CheckCircle className="h-5 w-5 text-green-500" />}
                            {test.result === 'failed' && <XCircle className="h-5 w-5 text-red-500" />}
                            {test.result === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {test.error && (
                          <div className="text-red-500 text-sm mb-2">{test.error}</div>
                        )}
                        {test.message && (
                          <div className="text-sm">{test.message}</div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Tests Run</CardTitle>
                  <CardDescription>Click "Run All Tests" to start testing</CardDescription>
                </CardHeader>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            {testResults.length > 0 ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>Detailed performance measurements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderMetrics()}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Performance Data</CardTitle>
                  <CardDescription>Click "Run Performance Tests" to analyze performance</CardDescription>
                </CardHeader>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="optimizations">
            {renderOptimizationsTab()}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TestRunnerPage;
