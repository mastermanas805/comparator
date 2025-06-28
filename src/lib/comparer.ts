import { diff } from 'json-diff-ts';

export interface CompareOptions {
  ignoreArrayOrder?: boolean;
  keysToSkip?: string[];
  arrayItemKeyName?: string;
  showOnlyDifferences?: boolean;
}

/**
 * Compare two normalized data structures and return differences
 */
export function compareData(a: any, b: any, _options: CompareOptions = {}): any {
  try {
    const result = diff(a, b);

    // If no differences found, return null to indicate identical content
    if (!result || (Array.isArray(result) && result.length === 0)) {
      return null;
    }

    return result;
  } catch (error) {
    console.error('Error during comparison:', error);
    throw new Error(`Comparison failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check if two objects are semantically identical
 */
export function areIdentical(a: any, b: any, options: CompareOptions = {}): boolean {
  const result = compareData(a, b, options);
  return result === null;
}

/**
 * Get a summary of differences
 */
export function getDiffSummary(diffResult: any): {
  hasChanges: boolean;
  changeCount: number;
  summary: string
} {
  if (!diffResult) {
    return {
      hasChanges: false,
      changeCount: 0,
      summary: 'No differences found'
    };
  }

  if (Array.isArray(diffResult)) {
    return {
      hasChanges: diffResult.length > 0,
      changeCount: diffResult.length,
      summary: `${diffResult.length} change${diffResult.length === 1 ? '' : 's'} detected`
    };
  }

  if (typeof diffResult === 'object') {
    const keys = Object.keys(diffResult);
    return {
      hasChanges: keys.length > 0,
      changeCount: keys.length,
      summary: `${keys.length} difference${keys.length === 1 ? '' : 's'} found`
    };
  }

  return {
    hasChanges: true,
    changeCount: 1,
    summary: 'Differences detected'
  };
}