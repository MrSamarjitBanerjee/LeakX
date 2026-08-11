import { Detector } from '../types';

/**
 * Detects OpenAI API keys.
 * Matches both legacy (sk-...) and project-scoped (sk-proj-...) key formats.
 */
export const openaiKeyDetector: Detector = {
  name: 'OpenAI API Key',
  pattern: /sk-(?:proj-)?[A-Za-z0-9_-]{20,}/g,
};
