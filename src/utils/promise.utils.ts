/**
 * Sleep function that returns a Promise that resolves after specified milliseconds
 * @param ms - Number of milliseconds to sleep
 * @returns Promise that resolves after the specified delay
 *
 * @example
 * // Sleep for 1 second
 * await sleep(1000);
 *
 * // Sleep for 500ms
 * await sleep(500);
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Sleep function with seconds instead of milliseconds for convenience
 * @param seconds - Number of seconds to sleep
 * @returns Promise that resolves after the specified delay
 *
 * @example
 * // Sleep for 2 seconds
 * await sleepSeconds(2);
 */
export const sleepSeconds = (seconds: number): Promise<void> => {
  return sleep(seconds * 1000);
};
