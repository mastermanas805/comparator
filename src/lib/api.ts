import { parseContent, parseWithAutoDetection, detectFormat } from './parser';
import type { SupportedFormat } from './parser';
import { normalizeData } from './normalizer';
import type { NormalizationOptions } from './normalizer';
import { compareData, areIdentical, getDiffSummary } from './comparer';
import type { CompareOptions } from './comparer';

export interface SemanticCompareOptions extends NormalizationOptions {
  // Comparison options
  ignoreArrayOrder?: boolean;
  keysToSkip?: string[];
  arrayItemKeyName?: string;
  showOnlyDifferences?: boolean;

  // Auto-detection
  autoDetectFormat?: boolean;
}

export interface SemanticCompareInput {
  original: string;
  modified: string;
  type?: SupportedFormat; // Optional if autoDetectFormat is true
  options?: SemanticCompareOptions;
  originalFilename?: string;
  modifiedFilename?: string;
}

export interface SemanticCompareResult {
  diff: any;
  originalParsed: any;
  modifiedParsed: any;
  originalNormalized: any;
  modifiedNormalized: any;
  detectedFormats?: {
    original: SupportedFormat;
    modified: SupportedFormat;
  };
  summary: {
    hasChanges: boolean;
    changeCount: number;
    summary: string;
  };
  identical: boolean;
}

/**
 * Main semantic comparison function
 */
export function semanticCompare({
  original,
  modified,
  type,
  options = {},
  originalFilename,
  modifiedFilename
}: SemanticCompareInput): SemanticCompareResult {
  let originalFormat: SupportedFormat;
  let modifiedFormat: SupportedFormat;
  let origParsed: any;
  let modParsed: any;

  // Auto-detect format if requested or type not provided
  if (options.autoDetectFormat || !type) {
    const origResult = parseWithAutoDetection(original, originalFilename);
    const modResult = parseWithAutoDetection(modified, modifiedFilename);

    origParsed = origResult.data;
    modParsed = modResult.data;
    originalFormat = origResult.detectedFormat;
    modifiedFormat = modResult.detectedFormat;

    // If formats don't match, use the more structured one or default to JSON
    if (originalFormat !== modifiedFormat) {
      const formatPriority: SupportedFormat[] = ['json', 'xml', 'toml', 'csv', 'yaml'];
      const chosenFormat = formatPriority.find(f =>
        f === originalFormat || f === modifiedFormat
      ) || 'json';

      // Re-parse with the chosen format
      origParsed = parseContent(original, chosenFormat);
      modParsed = parseContent(modified, chosenFormat);
      originalFormat = modifiedFormat = chosenFormat;
    }
  } else {
    // Use specified format
    originalFormat = modifiedFormat = type;
    origParsed = parseContent(original, type);
    modParsed = parseContent(modified, type);
  }

  // Normalize data
  const normalizationOptions: NormalizationOptions = {
    sortKeys: options.sortKeys,
    coerceTypes: options.coerceTypes,
    ignoreWhitespace: options.ignoreWhitespace,
    caseSensitive: options.caseSensitive,
    ignorePaths: options.ignorePaths,
    trimStrings: options.trimStrings,
  };

  const origNorm = normalizeData(origParsed, originalFormat, normalizationOptions);
  const modNorm = normalizeData(modParsed, modifiedFormat, normalizationOptions);

  // Compare
  const compareOptions: CompareOptions = {
    ignoreArrayOrder: options.ignoreArrayOrder,
    keysToSkip: options.keysToSkip,
    arrayItemKeyName: options.arrayItemKeyName,
    showOnlyDifferences: options.showOnlyDifferences,
  };

  const diff = compareData(origNorm, modNorm, compareOptions);
  const identical = areIdentical(origNorm, modNorm, compareOptions);
  const summary = getDiffSummary(diff);

  return {
    diff,
    originalParsed: origParsed,
    modifiedParsed: modParsed,
    originalNormalized: origNorm,
    modifiedNormalized: modNorm,
    detectedFormats: options.autoDetectFormat || !type ? {
      original: originalFormat,
      modified: modifiedFormat
    } : undefined,
    summary,
    identical
  };
}

// Re-export types and functions for external use
export {
  parseContent,
  parseWithAutoDetection,
  detectFormat,
  normalizeData,
  compareData,
  areIdentical,
  getDiffSummary,
  type SupportedFormat,
  type NormalizationOptions,
  type CompareOptions
};