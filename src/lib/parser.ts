import yaml from 'js-yaml';
import { parse as parseToml } from '@ltd/j-toml';
import { XMLParser } from 'fast-xml-parser';

export type SupportedFormat = 'json' | 'yaml' | 'toml' | 'xml';

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