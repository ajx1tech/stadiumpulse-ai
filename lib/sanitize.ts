/**
 * Centralized sanitization utilities for security hardening.
 */

/**
 * Strips HTML tags from a string to sanitize input.
 * @param {string} input - The raw string.
 * @returns {string} Sanitized string.
 */
export function sanitizeInput(input: string): string {
  if (!input) return ''
  return input.replace(/<[^>]*>?/gm, '').trim()
}
