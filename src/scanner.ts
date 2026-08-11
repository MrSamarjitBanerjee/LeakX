import fs from 'fs/promises';
import { detectors } from './detectors';
import { maskSecret } from './utils/mask';
import { discoverFiles } from './utils/fileDiscovery';
import { Finding, ScanResult } from './types';

/**
 * Scans a single file's contents line by line, running every detector
 * against each line and collecting any matches as findings.
 *
 * @param filePath - Path of the file being scanned
 * @param content - Full text content of the file
 * @returns An array of findings discovered in this file
 */
function scanFileContent(filePath: string, content: string): Finding[] {
  const findings: Finding[] = [];
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    for (const detector of detectors) {
      // Reset lastIndex since detector patterns use the global flag and are reused across lines.
      detector.pattern.lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = detector.pattern.exec(line)) !== null) {
        const secretValue = match[1] ?? match[0];

        findings.push({
          type: detector.name,
          file: filePath,
          line: index + 1,
          maskedSecret: maskSecret(secretValue),
        });

        // Avoid infinite loops on zero-length matches.
        if (match[0].length === 0) {
          detector.pattern.lastIndex++;
        }
      }
    }
  });

  return findings;
}

/**
 * Reads and scans a single file for secrets. Any read errors (permission
 * issues, broken symlinks, binary files, etc.) are caught and reported
 * as a warning instead of crashing the scan.
 *
 * @param filePath - Path of the file to scan
 * @param onWarning - Callback invoked with a warning message if the file can't be read
 * @returns Findings for this file, or an empty array if it couldn't be read
 */
async function scanFile(filePath: string, onWarning: (message: string) => void): Promise<Finding[]> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return scanFileContent(filePath, content);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    onWarning(`Could not read "${filePath}": ${reason}`);
    return [];
  }
}

/**
 * Runs a full LeakX scan across the given input paths (files, directories,
 * or glob patterns). Discovers all matching files, scans each one for
 * secrets, and returns all findings plus summary statistics.
 *
 * @param inputPaths - Paths or glob patterns provided by the user
 * @param onWarning - Callback invoked for any non-fatal warnings during scanning
 * @returns The complete scan result findings and summary
 */
export async function runScan(
  inputPaths: string[],
  onWarning: (message: string) => void = () => {}
): Promise<ScanResult> {
  const startTime = Date.now();
  const files = await discoverFiles(inputPaths);

  const allFindings: Finding[] = [];

  for (const file of files) {
    const findings = await scanFile(file, onWarning);
    allFindings.push(...findings);
  }

  const durationMs = Date.now() - startTime;

  return {
    findings: allFindings,
    summary: {
      filesScanned: files.length,
      secretsFound: allFindings.length,
      durationMs,
    },
  };
}
