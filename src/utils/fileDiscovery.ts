import fs from 'fs/promises';
import path from 'path';
import fg from 'fast-glob';
import ignore, { Ignore } from 'ignore';

/** Directories LeakX always skips, regardless of .gitignore contents. */
const DEFAULT_IGNORES = ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/build/**'];

/**
 * Loads and parses the .gitignore file from the given base directory, if present.
 *
 * @param baseDir - Directory to look for a .gitignore file in
 * @returns An `ignore` instance ready to filter file paths, or null if no .gitignore exists
 */
async function loadGitignore(baseDir: string): Promise<Ignore | null> {
  const gitignorePath = path.join(baseDir, '.gitignore');

  try {
    const content = await fs.readFile(gitignorePath, 'utf-8');
    return ignore().add(content);
  } catch {
    // No .gitignore file, or it couldn't be read — that's fine, just skip it.
    return null;
  }
}

/**
 * Determines whether a given path points to a directory.
 *
 * @param targetPath - Path to check
 * @returns true if the path is a directory, false otherwise (including if it doesn't exist)
 */
async function isDirectory(targetPath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(targetPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
  
  
 
 @param inputPaths - Paths or glob patterns provided on the command line
  @returns A sorted array of unique file paths ready to be scanned
 */
export async function discoverFiles(inputPaths: string[]): Promise<string[]> {
  const cwd = process.cwd();
  const gitignore = await loadGitignore(cwd);
  const discovered = new Set<string>();

  for (const inputPath of inputPaths) {
    const isGlob = fg.isDynamicPattern(inputPath);

    if (isGlob) {
      const matches = await fg(inputPath, { ignore: DEFAULT_IGNORES, dot: false, onlyFiles: true });
      matches.forEach((match) => discovered.add(match));
      continue;
    }

    const directory = await isDirectory(inputPath);

    if (directory) {
      const pattern = path.join(inputPath, '**/*').replace(/\\/g, '/');
      const matches = await fg(pattern, { ignore: DEFAULT_IGNORES, dot: false, onlyFiles: true });
      matches.forEach((match) => discovered.add(match));
    } else {
      // Treat as a single file path.
      discovered.add(inputPath.replace(/\\/g, '/'));
    }
  }

  const filtered = Array.from(discovered).filter((filePath) => {
    if (!gitignore) return true;
    const relative = path.relative(cwd, filePath).replace(/\\/g, '/');
    // Files outside the cwd (e.g. via ../) can't be matched against .gitignore rules.
    if (relative.startsWith('..')) return true;
    return !gitignore.ignores(relative);
  });

  return filtered.sort();
}
