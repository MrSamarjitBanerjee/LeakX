/**
 * Masks a secret so it can be safely printed to the console.
 * Keeps the first 4 and last 4 characters visible and replaces the
 * middle with asterisks. 
 *
 * @param secret -   The raw secret string to mask
 * @returns  The masked version of the secret, safe to display
 *
 * @example
 * maskSecret("ghp_1234567890abcdef1234567890abcdef1234")
 * // => "ghp_...1234"
 */
export function maskSecret(secret: string): string {
  if (secret.length <= 8) {
    return '*'.repeat(secret.length);
  }

  const visibleStart = secret.slice(0, 4);
  const visibleEnd = secret.slice(-4);

  return `${visibleStart}...${visibleEnd}`;
}
