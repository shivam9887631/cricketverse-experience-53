
/**
 * Simple test runner for Lovable environment
 * This allows running tests directly in the browser without local deployment
 */

type TestFunction = () => Promise<void> | void;

interface TestCase {
  name: string;
  fn: TestFunction;
}

class TestRunner {
  private tests: TestCase[] = [];
  private results: {name: string, passed: boolean, error?: any}[] = [];
  
  addTest(name: string, fn: TestFunction) {
    this.tests.push({ name, fn });
    return this;
  }
  
  async runAll() {
    console.log('🧪 Starting tests...');
    this.results = [];
    
    for (const test of this.tests) {
      try {
        await test.fn();
        console.log(`✅ PASS: ${test.name}`);
        this.results.push({ name: test.name, passed: true });
      } catch (error) {
        console.error(`❌ FAIL: ${test.name}`, error);
        this.results.push({ name: test.name, passed: false, error });
      }
    }
    
    const passCount = this.results.filter(r => r.passed).length;
    const failCount = this.results.length - passCount;
    
    console.log(`\n🧪 Test Results: ${passCount} passed, ${failCount} failed`);
    return {
      passed: passCount,
      failed: failCount,
      results: this.results
    };
  }
  
  getSummary() {
    const passCount = this.results.filter(r => r.passed).length;
    const failCount = this.results.length - passCount;
    return {
      total: this.results.length,
      passed: passCount,
      failed: failCount,
      results: this.results
    };
  }
}

export const testRunner = new TestRunner();

// Helper functions for assertions
export function assertEquals(actual: any, expected: any, message?: string) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected} but got ${actual}`);
  }
}

export function assertTrue(value: boolean, message?: string) {
  if (!value) {
    throw new Error(message || 'Expected true but got false');
  }
}

export function assertFalse(value: boolean, message?: string) {
  if (value) {
    throw new Error(message || 'Expected false but got true');
  }
}

export function assertNotNull(value: any, message?: string) {
  if (value === null || value === undefined) {
    throw new Error(message || 'Expected non-null value');
  }
}
