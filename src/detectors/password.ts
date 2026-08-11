import { Detector } from '../types';

/**
 * Detects hardcoded passwords assigned directly in code, e.g.:
 *   password = "SuperSecret123"
 *   PASSWORD: 'letmein'
 *   pwd="admin123"
 *
 * Only flags values with at least 4 characters to avoid matching empty
 * or placeholder strings like "" or "x".
 */
export const passwordDetector: Detector = {
  name: 'Hardcoded Password',
  pattern: /(?:password|passwd|pwd)\s*[:=]\s*['"]([^'"]{4,})['"]/gi,
};
