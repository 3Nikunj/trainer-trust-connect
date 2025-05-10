
/**
 * Helper utilities for working with Supabase
 */

/**
 * Casts a string to a UUID type for Supabase
 */
export const asUUID = (id: string): UUID => id as unknown as UUID;

/**
 * Type guard to check if response has error
 */
export const hasError = (data: any): boolean => {
  return data && typeof data === 'object' && 'error' in data;
};

/**
 * Safely access data from a Supabase response
 */
export const safeDataAccess = <T>(data: T | { error: any }): T | null => {
  if (hasError(data)) {
    return null;
  }
  return data as T;
};
