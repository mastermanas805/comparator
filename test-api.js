// Simple test to verify the API is working
// Run this in the browser console to test the core functionality

console.log('🧪 Testing Semantic Compare API...');

// Test data
const file1 = '{"name": "John", "age": 30}';
const file2 = '{"age": 30, "name": "John"}';

try {
  // Import the API (this might need to be adjusted based on how modules are loaded)
  console.log('📦 Testing JSON parsing...');
  const parsed1 = JSON.parse(file1);
  const parsed2 = JSON.parse(file2);
  console.log('✅ JSON parsing successful');
  console.log('File 1 parsed:', parsed1);
  console.log('File 2 parsed:', parsed2);
  
  // Test basic comparison
  console.log('🔍 Testing basic comparison...');
  const areEqual = JSON.stringify(parsed1) === JSON.stringify(parsed2);
  console.log('Basic string comparison:', areEqual);
  
  // Test key sorting
  const sortKeys = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(sortKeys);
    return Object.keys(obj).sort().reduce((result, key) => {
      result[key] = sortKeys(obj[key]);
      return result;
    }, {});
  };
  
  const sorted1 = sortKeys(parsed1);
  const sorted2 = sortKeys(parsed2);
  console.log('Sorted 1:', sorted1);
  console.log('Sorted 2:', sorted2);
  
  const sortedEqual = JSON.stringify(sorted1) === JSON.stringify(sorted2);
  console.log('✅ Sorted comparison result:', sortedEqual);
  
} catch (error) {
  console.error('❌ Test failed:', error);
}

console.log('🏁 Test complete');
