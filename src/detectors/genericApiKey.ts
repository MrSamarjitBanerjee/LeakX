import { Detector } from '../types';

/**
 * Detects generic API keys / secrets assigned to a variable, e.g.:
 *   API_KEY = "a1b2c3d4e5f6g7h8i9j0"
 *   apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxx'
 */
export const genericApiKeyDetector: Detector = {
  name: 'Generic API Key',
  pattern:
    /(?:api[_-]?key|secret[_-]?key|access[_-]?token|auth[_-]?token)\s*[:=]\s*['"]([A-Za-z0-9_\-/+]{16,})['"]/gi,
};
