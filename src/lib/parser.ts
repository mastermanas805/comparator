import yaml from 'js-yaml';
import { parse as parseToml } from '@ltd/j-toml';
import { XMLParser } from 'fast-xml-parser';
import Papa from 'papaparse';

export type SupportedFormat = 'json' | 'yaml' | 'toml' | 'xml' | 'csv';

/**
 * Auto-detect the format of content based on structure and syntax
 */
export function detectFormat(content: string, filename?: string): SupportedFormat {
  const trimmed = content.trim();

  // Check file extension first if available
  if (filename) {
    const ext = filename.toLowerCase().split('.').pop();
    if (ext === 'json') return 'json';
    if (ext === 'yaml' || ext === 'yml') return 'yaml';
    if (ext === 'toml') return 'toml';
    if (ext === 'xml') return 'xml';
    if (ext === 'csv') return 'csv';
  }

  // Try JSON first (strict syntax)
  try {
    JSON.parse(trimmed);
    return 'json';
  } catch {}

  // Check for XML (presence of < and > tags)
  if (trimmed.includes('<') && trimmed.includes('>') &&
      (trimmed.startsWith('<') || trimmed.includes('<?xml'))) {
    return 'xml';
  }

  // Check for TOML (table headers or key = value patterns)
  if (/^\s*\[.*\]\s*$/m.test(trimmed) || /^\s*\w+\s*=\s*.+$/m.test(trimmed)) {
    return 'toml';
  }

  // Check for CSV (comma-separated values with consistent structure)
  const lines = trimmed.split('\n').filter(line => line.trim());
  if (lines.length >= 2) {
    const firstLine = lines[0].trim();
    const secondLine = lines[1].trim();

    // Check if it looks like CSV (commas, consistent column count)
    const firstCommas = (firstLine.match(/,/g) || []).length;
    const secondCommas = (secondLine.match(/,/g) || []).length;

    // More robust CSV detection
    if (firstCommas > 0 && firstCommas === secondCommas &&
        !firstLine.includes('{') && !firstLine.includes('<') &&
        !firstLine.includes('=') && !firstLine.includes(':') &&
        !firstLine.includes('[') && !firstLine.includes(']') &&
        // Check if it's not YAML-like (no indentation patterns)
        !firstLine.match(/^\s*-\s/) && !secondLine.match(/^\s*-\s/) &&
        // Additional check: try parsing as CSV to validate
        (() => {
          try {
            const testResult = Papa.parse(trimmed, { header: true, preview: 2 });
            return testResult.data && testResult.data.length > 0 &&
                   Object.keys(testResult.data[0] || {}).length > 1;
          } catch {
            return false;
          }
        })()) {
      return 'csv';
    }
  }

  // Default to YAML (most flexible format)
  return 'yaml';
}

/**
 * Parse content with the specified format
 */
export function parseContent(content: string, type: SupportedFormat): any {
  try {
    switch (type) {
      case 'json':
        return JSON.parse(content);
      case 'yaml':
        return yaml.load(content, { schema: yaml.JSON_SCHEMA });
      case 'toml':
        return parseToml(content);
      case 'xml':
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: '@',
          trimValues: true,
          parseAttributeValue: true
        });
        return parser.parse(content);
      case 'csv':
        const result = Papa.parse(content, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          transformHeader: (header: string) => header.trim(),
          transform: (value: string) => {
            // Trim whitespace from values
            return typeof value === 'string' ? value.trim() : value;
          }
        });

        if (result.errors && result.errors.length > 0) {
          throw new Error(`CSV parsing errors: ${result.errors.map(e => e.message).join(', ')}`);
        }

        return result.data;
      default:
        throw new Error('Unsupported format: ' + type);
    }
  } catch (e: any) {
    throw new Error(`Failed to parse as ${type.toUpperCase()}: ${e.message}`);
  }
}

/**
 * Parse content with auto-detection
 */
export function parseWithAutoDetection(content: string, filename?: string): { data: any; detectedFormat: SupportedFormat } {
  const detectedFormat = detectFormat(content, filename);
  const data = parseContent(content, detectedFormat);
  return { data, detectedFormat };
}