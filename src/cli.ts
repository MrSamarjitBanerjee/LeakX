#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { runScan } from './scanner';
import { Finding, ScanSummary } from './types';

const program = new Command();

program
  .name('leakx')
  .description('Scan your codebase for hardcoded secrets, API keys, and passwords.')
  .version('1.0.0');

program
  .command('scan')
  .description('Scan one or more files, directories, or glob patterns for secrets')
  .argument('<paths...>', 'files, directories, or glob patterns to scan')
  .action(async (paths: string[]) => {
    await handleScan(paths);
  });

/**
 * Prints a single finding to the console in a readable, color-coded format.
 *
 * @param finding - The finding to print
 */
function printFinding(finding: Finding): void {
  console.log(chalk.red.bold(`✖ ${finding.type}`));
  console.log(`  ${chalk.gray('File:')} ${finding.file}`);
  console.log(`  ${chalk.gray('Line:')} ${finding.line}`);
  console.log(`  ${chalk.gray('Secret:')} ${chalk.yellow(finding.maskedSecret)}`);
  console.log('');
}

/**
 * Prints the final scan summary: files scanned, secrets found, and duration.
 *
 * @param summary - The scan summary statistics
 */
function printSummary(summary: ScanSummary): void {
  const seconds = (summary.durationMs / 1000).toFixed(2);

  console.log(chalk.bold('Scan Summary'));
  console.log(`  Files Scanned : ${summary.filesScanned}`);

  if (summary.secretsFound > 0) {
    console.log(`  Secrets Found : ${chalk.red.bold(summary.secretsFound)}`);
  } else {
    console.log(`  Secrets Found : ${chalk.green('0')}`);
  }

  console.log(`  Scan Duration : ${seconds}s`);
}

/**
 * scan run: executes the scan, prints findings and warnings,
 * then prints the summary. Sets a non-zero exit code if secrets were found,
 
 *
 * @param paths - Paths or glob patterns to scan, as provided on the command line
 */
async function handleScan(paths: string[]): Promise<void> {
  console.log(chalk.cyan.bold('\n🔍 LeakX — scanning for secrets...\n'));

  const warnings: string[] = [];
  const result = await runScan(paths, (message) => warnings.push(message));

  if (result.findings.length > 0) {
    result.findings.forEach(printFinding);
  } else {
    console.log(chalk.green('No secrets found. Nice and clean! ✅\n'));
  }

  if (warnings.length > 0) {
    console.log(chalk.yellow.bold('Warnings:'));
    warnings.forEach((warning) => console.log(chalk.yellow(`  ⚠ ${warning}`)));
    console.log('');
  }

  printSummary(result.summary);

  if (result.findings.length > 0) {
    process.exitCode = 1;
  }
}

program.parseAsync(process.argv).catch((error) => {
  console.error(chalk.red('LeakX encountered an unexpected error:'), error);
  process.exitCode = 1;
});
