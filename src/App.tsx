import React, { useState } from 'react';
import './App.css';
import { semanticCompare, detectFormat } from './lib/api';
import type { SupportedFormat, SemanticCompareResult } from './lib/api';
import DiffViewer from './components/DiffViewer';
import InfoTooltip from './components/InfoTooltip';

const formatOptions: { label: string; value: SupportedFormat | 'auto' }[] = [
  { label: 'Auto-detect', value: 'auto' },
  { label: 'JSON', value: 'json' },
  { label: 'YAML', value: 'yaml' },
  { label: 'TOML', value: 'toml' },
  { label: 'XML', value: 'xml' },
  { label: 'CSV', value: 'csv' },
];

type Route = 'home' | 'about' | 'api';

function App() {
  const [route, setRoute] = useState<Route>('home');
  const [file1, setFile1] = useState('');
  const [file2, setFile2] = useState('');
  const [format, setFormat] = useState<SupportedFormat | 'auto'>('auto');
  const [sortKeys, setSortKeys] = useState(true);
  const [coerceTypes, setCoerceTypes] = useState(true);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(true);
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [ignorePaths, setIgnorePaths] = useState('');
  const [trimStrings, setTrimStrings] = useState(true);
  const [result, setResult] = useState<SemanticCompareResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [file1Filename, setFile1Filename] = useState<string>('');
  const [file2Filename, setFile2Filename] = useState<string>('');

  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    setValue: (v: string) => void,
    setFilename: (name: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFilename(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string || '';
      setValue(content);

      // Auto-detect format if in auto mode
      if (format === 'auto') {
        try {
          const detected = detectFormat(content, file.name);
          console.log(`Auto-detected format: ${detected} for file: ${file.name}`);
        } catch (e) {
          console.warn('Format detection failed:', e);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleCompare = () => {
    console.log('🔍 Starting comparison...');
    setError(null);
    setResult(null);

    if (!file1.trim() || !file2.trim()) {
      setError('Please provide content for both files');
      return;
    }

    console.log('📝 File 1 content:', file1.substring(0, 100) + '...');
    console.log('📝 File 2 content:', file2.substring(0, 100) + '...');
    console.log('⚙️ Format:', format);
    console.log('⚙️ Options:', { sortKeys, coerceTypes, ignoreWhitespace, caseSensitive, trimStrings });

    try {
      const compareResult = semanticCompare({
        original: file1,
        modified: file2,
        type: format === 'auto' ? undefined : format,
        originalFilename: file1Filename,
        modifiedFilename: file2Filename,
        options: {
          sortKeys,
          coerceTypes,
          ignoreWhitespace,
          caseSensitive,
          trimStrings,
          ignorePaths: ignorePaths ? ignorePaths.split(',').map(p => p.trim()).filter(Boolean) : undefined,
          autoDetectFormat: format === 'auto',
        },
      });

      console.log('✅ Comparison result:', compareResult);
      setResult(compareResult);
    } catch (e: any) {
      console.error('❌ Comparison error:', e);
      setError(e.message);
    }
  };

  const renderHome = () => (
    <>
      <div className="privacy-notice">
        All processing is done locally in your browser. No data ever leaves your computer.
      </div>

      <div className="controls-section">
        <div className="controls-row">
          <label>
            Format:
            <InfoTooltip
              title="Format Selection"
              description="Choose the data format for parsing your files. Auto-detect analyzes both content structure and filename extensions to automatically determine the correct format."
              example={{
                before: 'File: config.yaml\n---\nname: "John"\nage: 30',
                after: 'Detected: YAML\nParsed successfully',
                explanation: "Auto-detect recognizes YAML from the .yaml extension and content structure with --- delimiter."
              }}
            />
            <select value={format} onChange={e => setFormat(e.target.value as SupportedFormat | 'auto')}>
              {formatOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
          {result?.detectedFormats && (
            <div className="detected-formats">
              Detected: {result.detectedFormats.original}
              {result.detectedFormats.original !== result.detectedFormats.modified &&
                ` / ${result.detectedFormats.modified}`}
            </div>
          )}
        </div>

        <div className="controls-row">
          <label>
            <input type="checkbox" checked={sortKeys} onChange={e => setSortKeys(e.target.checked)} />
            Ignore key order
            <InfoTooltip
              title="Ignore Key Order"
              description="When enabled, objects with the same properties in different orders are considered identical. Also sorts primitive arrays for consistent comparison."
              example={{
                before: '{"name": "John", "age": 30}\n["reading", "swimming", "coding"]',
                after: '{"age": 30, "name": "John"}\n["coding", "reading", "swimming"]',
                explanation: "Both objects and arrays are normalized to the same order, making these files identical."
              }}
            />
          </label>
          <label>
            <input type="checkbox" checked={coerceTypes} onChange={e => setCoerceTypes(e.target.checked)} />
            Coerce types
            <InfoTooltip
              title="Coerce Types"
              description="Automatically converts string representations to their appropriate data types (numbers, booleans, null) for semantic comparison."
              example={{
                before: '{"age": "30", "active": "true", "data": "null"}',
                after: '{"age": 30, "active": true, "data": null}',
                explanation: "String values are converted to their natural types: '30' → 30, 'true' → true, 'null' → null."
              }}
            />
          </label>
          <label>
            <input type="checkbox" checked={ignoreWhitespace} onChange={e => setIgnoreWhitespace(e.target.checked)} />
            Ignore whitespace
            <InfoTooltip
              title="Ignore Whitespace"
              description="Normalizes whitespace in string values by collapsing multiple consecutive spaces into single spaces and trimming leading/trailing whitespace."
              example={{
                before: '"  Hello    World   "',
                after: '"Hello World"',
                explanation: "Multiple spaces are collapsed to single spaces, and leading/trailing whitespace is removed."
              }}
            />
          </label>
          <label>
            <input type="checkbox" checked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)} />
            Case sensitive
            <InfoTooltip
              title="Case Sensitive"
              description="When disabled, string comparisons ignore case differences in both object keys and string values throughout the entire structure."
              example={{
                before: '{"Name": "JOHN", "City": "NEW YORK"}',
                after: '{"name": "john", "city": "new york"}',
                explanation: "With case sensitivity disabled, these objects are considered identical despite different capitalization."
              }}
            />
          </label>
        </div>

        <div className="controls-row">
          <label>
            <input type="checkbox" checked={trimStrings} onChange={e => setTrimStrings(e.target.checked)} />
            Trim strings
            <InfoTooltip
              title="Trim Strings"
              description="Removes leading and trailing whitespace from all string values before comparison, but preserves internal spacing."
              example={{
                before: '"  Hello World  "',
                after: '"Hello World"',
                explanation: "Only leading and trailing spaces are removed. Internal spacing between words is preserved."
              }}
            />
          </label>
          <label>
            Ignore paths:
            <InfoTooltip
              title="Ignore Paths"
              description="Exclude specific object paths from comparison using dot notation for nested properties. Use commas to separate multiple paths."
              example={{
                before: '{"user": "john", "timestamp": "2023-01-01", "meta": {"id": 123}}',
                after: 'Ignored: timestamp,meta.id\nCompared: {"user": "john"}',
                explanation: "Only the 'user' field is compared. Timestamp and meta.id are completely ignored."
              }}
            />
            <input
              type="text"
              value={ignorePaths}
              onChange={e => setIgnorePaths(e.target.value)}
              placeholder="e.g., timestamp,metadata.id"
              style={{ marginLeft: 8, width: 200 }}
            />
          </label>
        </div>
      </div>

      <div className="inputs-row">
        <div className="input-col">
          <label>File One {file1Filename && <span className="filename">({file1Filename})</span>}</label>
          <textarea
            value={file1}
            onChange={e => setFile1(e.target.value)}
            rows={12}
            placeholder="Paste or upload first file..."
          />
          <input
            type="file"
            accept=".json,.yaml,.yml,.toml,.xml,.csv,.txt"
            onChange={e => handleFile(e, setFile1, setFile1Filename)}
            style={{ marginTop: 8 }}
          />
        </div>
        <div className="input-col">
          <label>File Two {file2Filename && <span className="filename">({file2Filename})</span>}</label>
          <textarea
            value={file2}
            onChange={e => setFile2(e.target.value)}
            rows={12}
            placeholder="Paste or upload second file..."
          />
          <input
            type="file"
            accept=".json,.yaml,.yml,.toml,.xml,.csv,.txt"
            onChange={e => handleFile(e, setFile2, setFile2Filename)}
            style={{ marginTop: 8 }}
          />
        </div>
      </div>

      <div className="action-buttons">
        <button onClick={handleCompare} className="compare-btn">Compare</button>
        <button onClick={() => {
          setFile1('');
          setFile2('');
          setResult(null);
          setError(null);
          setFile1Filename('');
          setFile2Filename('');
        }} className="clear-btn">Clear</button>
      </div>

      <div className="diff-output">
        {error && <div className="error">{error}</div>}
        {result ? (
          <DiffViewer
            original={result.originalNormalized}
            modified={result.modifiedNormalized}
            diff={result.diff}
            format={format === 'auto' && result.detectedFormats ? result.detectedFormats.original : format === 'auto' ? 'json' : format}
          />
        ) : (
          <div className="placeholder">Diff output will appear here.</div>
        )}
      </div>
    </>
  );

  const renderAbout = () => (
    <div className="about-page">
      <h1>About Semantic Compare</h1>

      <h2>🔒 Privacy-First Design</h2>
      <p>
        This application performs semantic comparison of JSON, YAML, TOML, XML, CSV, and plain text files entirely in your browser.
        <strong> No data ever leaves your computer.</strong> All parsing, normalization, and comparison logic runs
        locally using client-side JavaScript.
      </p>

      <h2>🎯 What is Semantic Comparison?</h2>
      <p>
        Unlike traditional line-by-line diff tools, semantic comparison understands the structure and meaning of your data:
      </p>
      <ul>
        <li><strong>Ignores formatting:</strong> Whitespace, indentation, and line breaks don't matter</li>
        <li><strong>Key order independence:</strong> Object properties can be reordered without showing differences</li>
        <li><strong>Type coercion:</strong> "123" vs 123 can be treated as identical</li>
        <li><strong>Structural understanding:</strong> Focuses on logical content changes</li>
        <li><strong>Case sensitivity control:</strong> Compare text with or without case sensitivity</li>
      </ul>

      <h2>💡 Interactive Help System</h2>
      <p>
        Every configuration option includes comprehensive help through interactive tooltips:
      </p>
      <ul>
        <li><strong>Click-to-Open Modals:</strong> Detailed explanations that don't interfere with your workflow</li>
        <li><strong>Before/After Examples:</strong> Visual demonstrations of each option's effect</li>
        <li><strong>Real-World Use Cases:</strong> Practical guidance on when to use each feature</li>
        <li><strong>Comprehensive Coverage:</strong> Help available for every single configuration option</li>
      </ul>

      <h2>🎨 Modern User Interface</h2>
      <p>
        Designed for optimal productivity and user experience:
      </p>
      <ul>
        <li><strong>Compact Diff Viewer:</strong> Optimized column widths maximize content visibility</li>
        <li><strong>Syntax Highlighting:</strong> Beautiful code highlighting in diff results</li>
        <li><strong>Responsive Design:</strong> Perfect experience on desktop, tablet, and mobile</li>
        <li><strong>Clean Layout:</strong> Intuitive interface that gets out of your way</li>
        <li><strong>File Upload Support:</strong> Drag-and-drop or browse to upload files</li>
      </ul>

      <h2>📁 Supported Formats</h2>
      <div className="format-grid">
        <div className="format-card">
          <h3>JSON</h3>
          <p>Native browser support, fast parsing, semantic comparison of objects and arrays</p>
        </div>
        <div className="format-card">
          <h3>YAML</h3>
          <p>Human-readable, supports comments and references, multi-document support</p>
        </div>
        <div className="format-card">
          <h3>TOML</h3>
          <p>Clear syntax, native date/time support, semantic understanding</p>
        </div>
        <div className="format-card">
          <h3>XML</h3>
          <p>Structured markup, attribute handling, namespace support</p>
        </div>
        <div className="format-card">
          <h3>CSV</h3>
          <p>Column-aware comparison, header detection, delimiter auto-detection</p>
        </div>
        <div className="format-card">
          <h3>Plain Text</h3>
          <p>Line-by-line comparison with whitespace normalization options</p>
        </div>
      </div>

      <h2>✨ Features</h2>
      <ul>
        <li>🔍 <strong>Auto-detection:</strong> Automatically identify file formats</li>
        <li>⚙️ <strong>Configurable options:</strong> Control comparison behavior with interactive help</li>
        <li>🎯 <strong>Path exclusion:</strong> Ignore specific fields (e.g., timestamps)</li>
        <li>💡 <strong>Interactive tooltips:</strong> Click ⓘ icons for detailed explanations and examples</li>
        <li>🎨 <strong>Compact layout:</strong> Optimized diff viewer with narrow gutters</li>
        <li>📱 <strong>Responsive design:</strong> Works perfectly on all screen sizes</li>
        <li>🔒 <strong>Privacy guaranteed:</strong> All processing happens locally</li>
        <li>📖 <strong>Open source:</strong> Transparent and verifiable code</li>
      </ul>

      <h2>🚀 Technical Implementation</h2>
      <p>
        Built with modern web technologies for performance and reliability:
      </p>
      <ul>
        <li><strong>React 18 + TypeScript:</strong> Type-safe, component-based UI with modern hooks</li>
        <li><strong>Vite:</strong> Lightning-fast build tool with hot module replacement</li>
        <li><strong>js-yaml:</strong> YAML parsing and processing</li>
        <li><strong>@ltd/j-toml:</strong> TOML parsing with full specification support</li>
        <li><strong>fast-xml-parser:</strong> High-performance XML processing</li>
        <li><strong>Custom diff engine:</strong> Semantic comparison algorithms with syntax highlighting</li>
        <li><strong>Modern CSS:</strong> Responsive design with optimized layouts and accessibility</li>
      </ul>

      <h2>👥 Contributing & Code Ownership</h2>
      <p>
        This is an open-source project and we welcome contributions from the community!
      </p>
      <div className="contribution-info">
        <div className="info-section">
          <h3>📋 Code Owner</h3>
          <p>
            <strong>Repository:</strong> <a href="https://github.com/mastermanas805/comparator" target="_blank" rel="noopener noreferrer">
              github.com/mastermanas805/comparator
            </a>
          </p>
          <p>
            <strong>Maintainer:</strong> mastermanas805
          </p>
        </div>

        <div className="info-section">
          <h3>🤝 How to Contribute</h3>
          <ul>
            <li><strong>Issues:</strong> Report bugs or request features on GitHub</li>
            <li><strong>Pull Requests:</strong> Submit code improvements and new features</li>
            <li><strong>Documentation:</strong> Help improve guides and examples</li>
            <li><strong>Testing:</strong> Add test cases and improve coverage</li>
          </ul>
          <p>
            See our <a href="https://github.com/mastermanas805/comparator/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer">
              Contributing Guide
            </a> for detailed instructions on setting up the development environment and submission guidelines.
          </p>
        </div>
      </div>

      <p>
        <a href="https://github.com/mastermanas805/comparator" target="_blank" rel="noopener noreferrer">
          View source code on GitHub →
        </a>
      </p>
    </div>
  );

  const renderApiDocs = () => (
    <div className="api-docs-page">
      <h1>API Documentation</h1>

      <p>
        The semantic comparison functionality is available as a JavaScript library for programmatic use.
        All processing happens client-side, ensuring your data never leaves your environment. The API supports
        JSON, YAML, TOML, XML, CSV, and plain text formats with comprehensive configuration options.
      </p>

      <h2>📁 Supported Formats</h2>
      <p>The API supports the following formats with semantic understanding:</p>
      <ul>
        <li><strong>JSON:</strong> Native browser support, fast parsing, object/array comparison</li>
        <li><strong>YAML:</strong> Multi-document support, comments, references</li>
        <li><strong>TOML:</strong> Native date/time types, clear syntax</li>
        <li><strong>XML:</strong> Attribute handling, namespace support</li>
        <li><strong>CSV:</strong> Column-aware comparison, header detection</li>
        <li><strong>Text:</strong> Line-by-line comparison with normalization</li>
      </ul>

      <h2>Installation</h2>
      <p>Include the library in your project:</p>
      <pre>{`// ES6 modules
import { semanticCompare } from './lib/api';

// Or copy the lib/ folder to your project`}</pre>

      <h2>Basic Usage</h2>
      <pre>{`import { semanticCompare } from './lib/api';

const result = semanticCompare({
  original: '{"name": "John", "age": 30}',
  modified: '{"age": 30, "name": "John"}',
  type: 'json',
  options: {
    sortKeys: true,
    coerceTypes: true
  }
});

console.log(result.identical); // true
console.log(result.summary);   // { hasChanges: false, ... }`}</pre>

      <h2>Auto-Detection</h2>
      <pre>{`const result = semanticCompare({
  original: originalContent,
  modified: modifiedContent,
  originalFilename: 'config.yaml',
  modifiedFilename: 'config.yml',
  options: {
    autoDetectFormat: true,
    sortKeys: true
  }
});

console.log(result.detectedFormats);
// { original: 'yaml', modified: 'yaml' }`}</pre>

      <h2>Advanced Options</h2>
      <pre>{`const result = semanticCompare({
  original: originalData,
  modified: modifiedData,
  type: 'json',
  options: {
    // Normalization options
    sortKeys: true,
    coerceTypes: true,
    ignoreWhitespace: true,
    caseSensitive: false,
    trimStrings: true,
    ignorePaths: ['timestamp', 'metadata.lastModified'],

    // Comparison options
    ignoreArrayOrder: true,
    keysToSkip: ['id', 'createdAt'],
    showOnlyDifferences: false
  }
});`}</pre>

      <h2>API Reference</h2>

      <h3>semanticCompare(input)</h3>
      <p><strong>Parameters:</strong></p>
      <ul>
        <li><code>original</code> (string): Original content</li>
        <li><code>modified</code> (string): Modified content</li>
        <li><code>type</code> (optional): 'json' | 'yaml' | 'toml' | 'xml' | 'csv'</li>
        <li><code>originalFilename</code> (optional): For auto-detection</li>
        <li><code>modifiedFilename</code> (optional): For auto-detection</li>
        <li><code>options</code> (optional): Configuration object</li>
      </ul>

      <p><strong>Returns:</strong> SemanticCompareResult object with:</p>
      <ul>
        <li><code>diff</code>: Difference object (null if identical)</li>
        <li><code>identical</code>: Boolean indicating if files are semantically identical</li>
        <li><code>summary</code>: Human-readable summary of changes</li>
        <li><code>originalParsed</code>: Parsed original data</li>
        <li><code>modifiedParsed</code>: Parsed modified data</li>
        <li><code>originalNormalized</code>: Normalized original data</li>
        <li><code>modifiedNormalized</code>: Normalized modified data</li>
        <li><code>detectedFormats</code>: Auto-detected formats (if applicable)</li>
      </ul>

      <h2>Utility Functions</h2>
      <pre>{`import {
  parseContent,
  detectFormat,
  normalizeData,
  compareData
} from './lib/api';

// Parse content
const data = parseContent('{"key": "value"}', 'json');

// Detect format
const format = detectFormat(content, 'config.yaml');

// Normalize data
const normalized = normalizeData(data, 'json', { sortKeys: true });

// Compare data directly
const diff = compareData(obj1, obj2, { ignoreArrayOrder: true });`}</pre>

      <h2>Error Handling</h2>
      <pre>{`try {
  const result = semanticCompare({
    original: invalidJson,
    modified: validJson,
    type: 'json'
  });
} catch (error) {
  console.error('Comparison failed:', error.message);
  // Handle parsing errors, invalid formats, etc.
}`}</pre>

      <h2>Examples</h2>

      <h3>JSON with Reordered Keys</h3>
      <pre>{`const result = semanticCompare({
  original: '{"name": "Alice", "age": 25}',
  modified: '{"age": 25, "name": "Alice"}',
  type: 'json',
  options: { sortKeys: true }
});
// result.identical === true`}</pre>

      <h3>YAML with Type Coercion</h3>
      <pre>{`const result = semanticCompare({
  original: 'enabled: "true"\\nport: "8080"',
  modified: 'enabled: true\\nport: 8080',
  type: 'yaml',
  options: { coerceTypes: true }
});
// result.identical === true`}</pre>

      <h3>Ignoring Specific Paths</h3>
      <pre>{`const result = semanticCompare({
  original: '{"user": "john", "timestamp": "2023-01-01"}',
  modified: '{"user": "john", "timestamp": "2023-01-02"}',
  type: 'json',
  options: { ignorePaths: ['timestamp'] }
});
// result.identical === true`}</pre>
    </div>
  );

  return (
    <div className="app-container">
      <nav className="main-nav">
        <button onClick={() => setRoute('home')} className={route === 'home' ? 'active' : ''}>Compare</button>
        <button onClick={() => setRoute('about')} className={route === 'about' ? 'active' : ''}>About</button>
        <button onClick={() => setRoute('api')} className={route === 'api' ? 'active' : ''}>API Docs</button>
      </nav>
      <div className="page-content">
        {route === 'home' && renderHome()}
        {route === 'about' && renderAbout()}
        {route === 'api' && renderApiDocs()}
      </div>
    </div>
  );
}

export default App;
