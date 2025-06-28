import type { SupportedFormat } from './parser';

export interface NormalizationOptions {
  sortKeys?: boolean;
  coerceTypes?: boolean;
  ignoreWhitespace?: boolean;
  caseSensitive?: boolean;
  ignorePaths?: string[];
  trimStrings?: boolean;
}

/**
 * Recursively sort object keys and array elements for consistent comparison
 */
function sortObjectKeys(obj: any): any {
  if (Array.isArray(obj)) {
    // Sort array elements recursively, then sort the array itself
    const sortedElements = obj.map(sortObjectKeys);

    // Sort primitive arrays, but preserve object arrays in their original order
    // unless all elements are primitives
    const allPrimitives = sortedElements.every(el =>
      el === null || el === undefined || typeof el !== 'object'
    );

    if (allPrimitives) {
      return sortedElements.sort((a, b) => {
        // Handle null/undefined
        if (a === null && b === null) return 0;
        if (a === null) return -1;
        if (b === null) return 1;
        if (a === undefined && b === undefined) return 0;
        if (a === undefined) return -1;
        if (b === undefined) return 1;

        // Convert to string for comparison
        const aStr = String(a);
        const bStr = String(b);
        return aStr.localeCompare(bStr);
      });
    }

    return sortedElements;
  } else if (obj && typeof obj === 'object' && obj.constructor === Object) {
    return Object.keys(obj)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortObjectKeys(obj[key]);
        return acc;
      }, {} as any);
  }
  return obj;
}

/**
 * Coerce string values to their appropriate types
 */
function coerceValue(val: any): any {
  if (typeof val === 'string') {
    // Integer
    if (/^-?\d+$/.test(val)) return parseInt(val, 10);
    // Float
    if (/^-?\d*\.\d+$/.test(val)) return parseFloat(val);
    // Boolean
    if (/^(true|false)$/i.test(val)) return val.toLowerCase() === 'true';
    // Null
    if (/^null$/i.test(val)) return null;
    // Undefined
    if (/^undefined$/i.test(val)) return undefined;
  }
  return val;
}

/**
 * Recursively coerce types throughout the object
 */
function coerceTypes(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(coerceTypes);
  } else if (obj && typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      result[key] = coerceTypes(obj[key]);
    }
    return result;
  }
  return coerceValue(obj);
}

/**
 * Normalize XML structure with sorted attributes and elements
 */
function normalizeXml(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(normalizeXml);
  } else if (obj && typeof obj === 'object') {
    // Separate attributes (starting with @) from elements
    const attributes: any = {};
    const elements: any = {};

    for (const key in obj) {
      if (key.startsWith('@')) {
        attributes[key] = normalizeXml(obj[key]);
      } else {
        elements[key] = normalizeXml(obj[key]);
      }
    }

    // Sort both attributes and elements
    const sortedAttrs = Object.keys(attributes).sort().reduce((acc, key) => {
      acc[key] = attributes[key];
      return acc;
    }, {} as any);

    const sortedElements = Object.keys(elements).sort().reduce((acc, key) => {
      acc[key] = elements[key];
      return acc;
    }, {} as any);

    return { ...sortedAttrs, ...sortedElements };
  }
  return obj;
}

/**
 * Remove specified paths from the object
 */
function removePaths(obj: any, paths: string[]): any {
  if (!paths || paths.length === 0) return obj;

  const result = JSON.parse(JSON.stringify(obj)); // Deep clone

  for (const path of paths) {
    const parts = path.split('.');
    let current = result;

    for (let i = 0; i < parts.length - 1; i++) {
      if (current && typeof current === 'object' && parts[i] in current) {
        current = current[parts[i]];
      } else {
        break;
      }
    }

    if (current && typeof current === 'object' && parts[parts.length - 1] in current) {
      delete current[parts[parts.length - 1]];
    }
  }

  return result;
}

/**
 * Normalize string values (trim, case sensitivity)
 */
function normalizeStrings(obj: any, options: NormalizationOptions): any {
  if (Array.isArray(obj)) {
    return obj.map(item => normalizeStrings(item, options));
  } else if (obj && typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      const normalizedKey = options.caseSensitive ? key : key.toLowerCase();
      result[normalizedKey] = normalizeStrings(obj[key], options);
    }
    return result;
  } else if (typeof obj === 'string') {
    let normalized = obj;
    if (options.trimStrings) {
      normalized = normalized.trim();
    }
    if (options.ignoreWhitespace) {
      normalized = normalized.replace(/\s+/g, ' ').trim();
    }
    if (!options.caseSensitive) {
      normalized = normalized.toLowerCase();
    }
    return normalized;
  }
  return obj;
}

/**
 * Main normalization function
 */
export function normalizeData(
  obj: any,
  type: SupportedFormat,
  options: NormalizationOptions = {}
): any {
  let normalized = obj;

  // Remove ignored paths first
  if (options.ignorePaths && options.ignorePaths.length > 0) {
    normalized = removePaths(normalized, options.ignorePaths);
  }

  // Normalize strings (trim, case sensitivity)
  if (options.trimStrings || options.ignoreWhitespace || !options.caseSensitive) {
    normalized = normalizeStrings(normalized, options);
  }

  // Type coercion
  if (options.coerceTypes) {
    normalized = coerceTypes(normalized);
  }

  // Key sorting
  if (options.sortKeys) {
    if (type === 'xml') {
      normalized = normalizeXml(normalized);
    } else {
      normalized = sortObjectKeys(normalized);
    }
  }

  return normalized;
}