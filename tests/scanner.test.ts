/**
 * Simple manual test script for LeakX's scanner and detectors.
 *
 * This project intentionally avoids a test framework (per project scope),
 * so this file can be run directly with ts-node to sanity-check detection
 * logic during development:
 *
 *   npx ts-node tests/scanner.test.ts
 */
import { detectors } from '../src/detectors';

interface TestCase {
  description: string;
  line: string;
  shouldMatch: boolean;
  detectorName: string;
}

const testCases: TestCase[] = [
  {
    description: 'detects a GitHub personal access token',
    line: 'const token = "ghp_16C7e42F292c6912E7710c838347Ae178B4a";',
    shouldMatch: true,
    detectorName: 'GitHub Token',
  },
  {
    description: 'detects an AWS access key',
    line: 'aws_access_key_id=AKIAIOSFODNN7EXAMPLE',
    shouldMatch: true,
    detectorName: 'AWS Access Key',
  },
  {
    description: 'detects an OpenAI API key',
    line: 'OPENAI_API_KEY=sk-proj-abcdefghijklmnopqrstuvwx1234567890',
    shouldMatch: true,
    detectorName: 'OpenAI API Key',
  },
  {
    description: 'detects a generic API key assignment',
    line: 'apiKey: "1234567890abcdef1234567890"',
    shouldMatch: true,
    detectorName: 'Generic API Key',
  },
  {
    description: 'detects a hardcoded password',
    line: 'password = "SuperSecret123"',
    shouldMatch: true,
    detectorName: 'Hardcoded Password',
  },
  {
    description: 'does not flag a normal line of code',
    line: 'const total = price * quantity;',
    shouldMatch: false,
    detectorName: 'N/A',
  },
];

let passed = 0;
let failed = 0;

for (const testCase of testCases) {
  const detector = detectors.find((d) => d.name === testCase.detectorName);
  let matched = false;

  for (const d of detectors) {
    d.pattern.lastIndex = 0;
    if (d.pattern.test(testCase.line)) {
      matched = true;
      break;
    }
  }

  const success = matched === testCase.shouldMatch;
  console.log(`${success ? '✅' : '❌'} ${testCase.description}`);

  if (success) {
    passed++;
  } else {
    failed++;
  }

  void detector;
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed > 0 ? 1 : 0;
