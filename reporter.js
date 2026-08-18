/*const path = require('path');

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
    const failedTestsReport = [];

    console.log('Playwright Test Execution\n');

    for (const [file, tests] of Object.entries(this.testFiles)) {
      console.log(`Test File: ${file}`);
      totalTests += tests.length;
      
      for (const { test, result } of tests) {
        const status = result.status === 'passed' ? '✓' : '✗';
        console.log(`  ${status} ${test.title}`);
        
        if (result.status !== 'passed') {
          // Extract specific line and column from the test location object
          const errorLine = test.location?.line || 'Unknown';
          const errorColumn = test.location?.column || 'Unknown';
          const cleanErrorMessage = result.error?.message || 'No explicit error message provided.';

          // Capture the truncated stack trace
          let truncatedStack = '';
          if (result.error?.stack) {
            const stackLines = result.error.stack.split('\n');
            truncatedStack = stackLines.slice(0, 4).join('\n');
            console.log(truncatedStack.split('\n').map(line => `    ${line}`).join('\n'));
          }

          // Save failure details for the final report block
          failedTestsReport.push({
            file,
            title: test.title,
            line: errorLine,
            column: errorColumn,
            error: cleanErrorMessage,
            stack: truncatedStack
          });
        }
      }
      console.log('');
    }

    console.log('Execution Summary');
    console.log(`Test Files Executed: ${totalTestFiles}`);
    console.log(`Total Test Cases: ${totalTests}`);
    console.log(`Passed: ${this.passed}`);
    console.log(`Failed: ${this.failed}`);
    console.log(`Status: ${this.failed > 0 ? 'FAILURE' : 'SUCCESS'}\n`);

    // Generate and print the dedicated Failure Report if any test failed
    if (this.failed > 0) {
      console.log('==================================================');
      console.log('🚨 DETAILED FAILURE REPORT 🚨');
      console.log('==================================================');
      
      failedTestsReport.forEach((fail, index) => {
        console.log(`[Failure #${index + 1}]`);
        console.log(`📍 File Name   : ${fail.file}`);
        console.log(`📝 Test Name   : ${fail.title}`);
        console.log(`🔢 Failed At   : Line ${fail.line}, Column ${fail.column}`);
        console.log(`❌ Error Found : ${fail.error}`);
        if (fail.stack) {
          console.log(`🥞 Quick Stack :\n${fail.stack.split('\n').map(line => `   ${line}`).join('\n')}`);
        }
        console.log('--------------------------------------------------');
      });
    }
  }
}

module.exports = CustomReporter;*/

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
    const failedTestsReport = [];

    console.log('\n══════════════════════════════════════════════════');
    console.log('   🎭  PLAYWRIGHT TEST EXECUTION REPORT');
    console.log('══════════════════════════════════════════════════\n');

    for (const [file, tests] of Object.entries(this.testFiles)) {
      console.log(`📁 Test File: ${file}`);
      totalTests += tests.length;

      for (const { test, result } of tests) {
        const status = result.status === 'passed' ? '✅' : '❌';
        const duration = result.duration ? `(${result.duration}ms)` : '';
        console.log(`   ${status} ${test.title} ${duration}`);

        if (result.status !== 'passed') {
          const errorLine = test.location?.line || 'Unknown';
          const errorColumn = test.location?.column || 'Unknown';
          const cleanErrorMessage = result.error?.message || 'No explicit error message provided.';

          let truncatedStack = '';
          if (result.error?.stack) {
            const stackLines = result.error.stack.split('\n');
            truncatedStack = stackLines.slice(0, 6).join('\n');
            console.log(truncatedStack.split('\n').map(line => `      ${line}`).join('\n'));
          }

          failedTestsReport.push({
            file,
            title: test.title,
            line: errorLine,
            column: errorColumn,
            error: cleanErrorMessage,
            stack: truncatedStack
          });
        }
      }
      console.log('');
    }

    console.log('══════════════════════════════════════════════════');
    console.log('   📊 EXECUTION SUMMARY');
    console.log('══════════════════════════════════════════════════');
    console.log(`   Test Files Executed : ${totalTestFiles}`);
    console.log(`   Total Test Cases    : ${totalTests}`);
    console.log(`   ✅ Passed           : ${this.passed}`);
    console.log(`   ❌ Failed           : ${this.failed}`);
    console.log(`   📌 Status           : ${this.failed > 0 ? '🔴 FAILURE' : '🟢 SUCCESS'}`);
    console.log('══════════════════════════════════════════════════\n');

    if (this.failed > 0) {
      console.log('╔══════════════════════════════════════════════════╗');
      console.log('║        🚨  D E T A I L E D   F A I L U R E        ║');
      console.log('║              R E P O R T                          ║');
      console.log('╚══════════════════════════════════════════════════╝\n');

      failedTestsReport.forEach((fail, index) => {
        console.log(`┌──────────────────────────────────────────────────┐`);
        console.log(`│ [Failure #${String(index + 1).padStart(2, '0')}]                                    │`);
        console.log(`├──────────────────────────────────────────────────┤`);
        console.log(`│ 📍 File Name   : ${fail.file.padEnd(38)}│`);
        console.log(`│ 📝 Test Name   : ${fail.title.padEnd(38)}│`);
        console.log(`│ 🔢 Failed At   : Line ${String(fail.line).padEnd(4)}, Column ${String(fail.column).padEnd(29)}│`);
        console.log(`│ ❌ Error       : ${fail.error.substring(0, 38).padEnd(38)}│`);
        if (fail.error.length > 38) {
          let remaining = fail.error.substring(38);
          while (remaining.length > 0) {
            const chunk = remaining.substring(0, 38);
            remaining = remaining.substring(38);
            console.log(`│                : ${chunk.padEnd(38)}│`);
          }
        }
        if (fail.stack) {
          console.log(`│ 🥞 Stack Trace :                                  │`);
          fail.stack.split('\n').forEach(line => {
            const chunks = [];
            let rem = line;
            while (rem.length > 0) {
              chunks.push(rem.substring(0, 46));
              rem = rem.substring(46);
            }
            chunks.forEach(chunk => {
              console.log(`│   ${chunk.padEnd(47)}│`);
            });
          });
        }
        console.log(`└──────────────────────────────────────────────────┘\n`);
      });
    }
  }
}

module.exports = CustomReporter;