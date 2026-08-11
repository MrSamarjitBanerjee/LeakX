export interface Detector {
  /** Human-readable name of the secret type, e.g. "GitHub Token" */
  name: string;
  /** Regular expression used to find this secret inside a line of text */
  pattern: RegExp;
}

/**
 * Represents a single secret found inside a file.
 */
export interface Finding {
  /** Type of secret detected, e.g. "AWS Access Key" */
  type: string;
  /** Relative or absolute path of the file where the secret was found */
  file: string;
  /** Line number (1-based) where the secret occurs */
  line: number;
  /** The secret value, masked before display */
  maskedSecret: string;
}

/**
 * Summary statistics collected after a full scan.
 */
export interface ScanSummary {
  filesScanned: number;
  secretsFound: number;
  durationMs: number;
}

/**
 * Final result of a scan: all findings plus summary stats.
 */
export interface ScanResult {
  findings: Finding[];
  summary: ScanSummary;
}
