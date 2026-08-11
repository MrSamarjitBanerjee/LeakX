import { Detector } from '../types';

/**
 * Detects GitHub personal access tokens and fine-grained tokens.
 */
export const githubTokenDetector: Detector = {
  name: 'GitHub Token',
  pattern: /gh[pousr]_[A-Za-z0-9]{36,}/g,
};
