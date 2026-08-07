const path = require('path');

class CustomReporter {
  constructor(options) {
    this.testFiles = {};
    this.passed = 0;
    this.failed = 0;
  }

  onTestEnd(test, result) {
    const absolutePath = test.location.file;
    const relativePath = path.relative(process.cwd(), absolutePath);
    
    if (!this.testFiles[relativePath]) {
      this.testFiles[relativePath] = [];
    }
    this.testFiles[relativePath].push({ test, result });
    
    if (result.status === 'passed') {
      this.passed++;
    } else {
      this.failed++;
    }
  }

  onEnd(result) {
    const totalTestFiles = Object.keys(this.testFiles).length;
    let totalTests = 0;

    console.log('Playwright Test Execution\n');

    for (const [file, tests] of Object.entries(this.testFiles)) {
      console.log(`Test File: ${file}`);
      totalTests += tests.length;
      for (const { test, result } of tests) {
        const status = result.status === 'passed' ? '✓' : '✗';
        console.log(`  ${status} ${test.title}`);
        if (result.status !== 'passed' && result.error) {
          console.log(`    Error: ${result.error.message}`);
          if (result.error.stack) {
            const stackLines = result.error.stack.split('\n');
            // Show first 4 lines of stack trace (error + top 3 frames)
            const truncatedStack = stackLines.slice(0, 4).join('\n');
            console.log(truncatedStack.split('\n').map(line => `    ${line}`).join('\n'));
          }
        }
      }
      console.log('');
    }

    console.log('Execution Summary');
    console.log(`Test Files Executed: ${totalTestFiles}`);
    console.log(`Total Test Cases: ${totalTests}`);
    console.log(`Passed: ${this.passed}`);
    console.log(`Failed: ${this.failed}`);
    console.log(`Status: ${this.failed > 0 ? 'FAILURE' : 'SUCCESS'}`);
  }
}

module.exports = CustomReporter;