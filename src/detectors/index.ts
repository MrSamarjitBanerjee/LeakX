import { Detector } from '../types';
import { githubTokenDetector } from './githubToken';
import { awsKeyDetector } from './awsKey';
import { openaiKeyDetector } from './openaiKey';
import { genericApiKeyDetector } from './genericApiKey';
import { passwordDetector } from './password';

/**
 * All secret detectors LeakX runs against every scanned line.
 */
export const detectors: Detector[] = [
  githubTokenDetector,
  awsKeyDetector,
  openaiKeyDetector,
  genericApiKeyDetector,
  passwordDetector,
];
