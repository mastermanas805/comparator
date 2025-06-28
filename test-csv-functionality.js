// Quick test to verify CSV functionality
import { semanticCompare, detectFormat, parseContent } from './src/lib/api.js';

const csv1 = `name,age,city
John,30,NYC
Jane,25,LA`;

const csv2 = `name,age,city
John,30,NYC
Jane,26,LA`;

console.log('Testing CSV detection...');
const detectedFormat = detectFormat(csv1, 'test.csv');
console.log('Detected format:', detectedFormat);

console.log('\nTesting CSV parsing...');
try {
  const parsed = parseContent(csv1, 'csv');
  console.log('Parsed CSV:', JSON.stringify(parsed, null, 2));
} catch (e) {
  console.error('Parse error:', e.message);
}

console.log('\nTesting CSV comparison...');
try {
  const result = semanticCompare({
    original: csv1,
    modified: csv2,
    type: 'csv',
    options: {
      sortKeys: true,
      coerceTypes: true
    }
  });
  
  console.log('Comparison result:');
  console.log('- Identical:', result.identical);
  console.log('- Summary:', result.summary);
  console.log('- Diff:', result.diff ? 'Has differences' : 'No differences');
} catch (e) {
  console.error('Comparison error:', e.message);
}
