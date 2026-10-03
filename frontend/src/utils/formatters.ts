/**
 * Formats a number with comma separators (e.g., 1428 -> "1,428")
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Formats a percentage value (e.g., 88.6 -> "88.6%")
 */
export function formatPercentage(val: number, decimals: number = 1): string {
  return `${Number(val.toFixed(decimals))}%`;
}

/**
 * Combines conditional class names cleanly
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
