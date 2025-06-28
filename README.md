# Semantic Compare - Privacy-First File Comparison

A powerful, client-side web application for semantic comparison of YAML, JSON, TOML, and XML files. All processing happens locally in your browser - **no data ever leaves your computer**.

## 🚀 Features

- **🔒 Privacy-First**: All processing happens locally in your browser
- **🔍 Semantic Comparison**: Understands structure and meaning, not just text differences
- **📁 Multi-Format Support**: JSON, YAML, TOML, XML, CSV, and plain text
- **🤖 Auto-Detection**: Automatically detects file formats
- **⚙️ Configurable Options**: Control comparison behavior with advanced settings
- **💡 Interactive Help**: Comprehensive tooltips with examples for every option
- **🎨 Modern UI**: Clean, compact diff viewer with optimized layout
- **📱 Responsive Design**: Perfect experience on desktop, tablet, and mobile
- **🛠️ Developer API**: Programmatic access for integration

## 🎯 What Makes It "Semantic"?

Unlike traditional diff tools that compare line-by-line, Semantic Compare understands the logical structure of your data:

- **Key Order Independence**: `{"a": 1, "b": 2}` equals `{"b": 2, "a": 1}`
- **Type Coercion**: `"123"` can equal `123` when enabled
- **Whitespace Normalization**: Formatting differences are ignored
- **Structural Understanding**: Focuses on meaningful content changes

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Usage

1. **Upload or paste** your original and modified files
2. **Select format** or use auto-detection
3. **Configure options** - click the ⓘ icons for detailed explanations and examples
4. **Click Compare** to see semantic differences with syntax highlighting

## 💡 Interactive Help System

Every configuration option includes an interactive tooltip (ⓘ) that provides:
- **Detailed explanations** of what each option does
- **Before/After examples** showing the option's effect
- **Real-world use cases** for when to use each feature
- **Click-to-open modals** with comprehensive information

## 📖 API Usage

```typescript
import { semanticCompare } from './lib/api';

// Basic comparison
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
```

## 🔧 Configuration Options

### Normalization Options
- **sortKeys**: Ignore object key order
- **coerceTypes**: Convert string numbers/booleans to native types
- **ignoreWhitespace**: Normalize whitespace differences
- **caseSensitive**: Control case sensitivity
- **trimStrings**: Trim leading/trailing whitespace
- **ignorePaths**: Exclude specific paths from comparison

### Comparison Options
- **ignoreArrayOrder**: Treat array order as insignificant
- **keysToSkip**: Skip specific keys during comparison
- **showOnlyDifferences**: Focus on changed content only

## 📁 Supported Formats

| Format | Features | Use Cases |
|--------|----------|-----------|
| **JSON** | Native browser support, fast parsing, semantic comparison | APIs, configuration, data exchange |
| **YAML** | Human-readable, comments, references, multi-document | DevOps, configuration, documentation |
| **TOML** | Clear syntax, native date/time, semantic understanding | Configuration files, especially Rust/Python |
| **XML** | Structured markup, attributes, namespace handling | Enterprise systems, documents, legacy data |
| **CSV** | Column-aware comparison, header detection, delimiter auto-detection | Data files, spreadsheets, reports |
| **Text** | Line-by-line comparison, whitespace normalization | Code files, documentation, logs |

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite
- **Parsing**: js-yaml, @ltd/j-toml, fast-xml-parser
- **Comparison**: json-diff-ts
- **UI**: react-diff-viewer-continued
- **Deployment**: GitHub Pages ready

## 🔐 Privacy & Security

- **No Server Communication**: All processing happens in your browser
- **No Data Storage**: Files are never saved or transmitted
- **Open Source**: Code is publicly verifiable
- **HTTPS Delivery**: Secure asset delivery via GitHub Pages

## 🚀 Deployment

### GitHub Pages

1. Update the `base` path in `vite.config.ts`
2. Build the application: `npm run build`
3. Deploy the `dist` folder to GitHub Pages

### Manual Deployment

```bash
# Build for production
npm run build

# Deploy dist/ folder to your hosting provider
```

## 📄 License

MIT License - see LICENSE file for details
