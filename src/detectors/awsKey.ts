import { Detector } from '../types';

/**
 * Detects AWS access key IDs.
 * Matches the standard AWS key prefixes (AKIA, ABIA, ACCA, ASIA, etc.)
 * followed by 16 uppercase alphanumeric characters.
 */
export const awsKeyDetector: Detector = {
  name: 'AWS Access Key',
  pattern: /\b(?:AKIA|ABIA|ACCA|ASIA)[A-Z0-9]{16}\b/g,
};
