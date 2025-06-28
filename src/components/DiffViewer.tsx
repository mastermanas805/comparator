import React, { useState } from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface DiffViewerProps {
  original: any;
  modified: any;
  diff: any;
  format: string;
}

const getLanguageFromFormat = (format: string): string => {
  switch (format.toLowerCase()) {
    case 'json':
      return 'json';
    case 'yaml':
    case 'yml':
      return 'yaml';
    case 'xml':
      return 'xml';
    case 'toml':
      return 'toml';
    case 'csv':
      return 'csv';
    case 'javascript':
    case 'js':
      return 'javascript';
    case 'typescript':
    case 'ts':
      return 'typescript';
    default:
      return 'json'; // Default to JSON for most structured data
  }
};

function formatContent(obj: any, format: string): string {
  if (typeof obj === 'string') return obj;

  let formatted: string;
  switch (format) {
    case 'json':
      formatted = JSON.stringify(obj, null, 2);
      break;
    case 'yaml':
      // For display purposes, convert back to JSON with nice formatting
      formatted = JSON.stringify(obj, null, 2);
      break;
    case 'toml':
      formatted = JSON.stringify(obj, null, 2);
      break;
    case 'xml':
      formatted = JSON.stringify(obj, null, 2);
      break;
    case 'csv':
      // Convert CSV data back to CSV format for display
      if (Array.isArray(obj) && obj.length > 0) {
        const headers = Object.keys(obj[0] || {});
        const csvLines = [headers.join(',')];

        obj.forEach(row => {
          const values = headers.map(header => {
            const value = row[header];
            // Escape values that contain commas, quotes, or newlines
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value || '';
          });
          csvLines.push(values.join(','));
        });

        formatted = csvLines.join('\n');
      } else {
        formatted = JSON.stringify(obj, null, 2);
      }
      break;
    default:
      formatted = JSON.stringify(obj, null, 2);
  }

  // Handle very long lines by adding line breaks at reasonable points (except for CSV)
  if (format !== 'csv') {
    return formatted.split('\n').map(line => {
      if (line.length > 120) {
        // For very long lines, try to break at commas or other natural break points
        return line.replace(/,\s*/g, ',\n    ');
      }
      return line;
    }).join('\n');
  }

  return formatted;
}

const DiffViewer: React.FC<DiffViewerProps> = ({ original, modified, diff, format }) => {
  const [splitView, setSplitView] = useState(true);
  const [showDiffOnly, setShowDiffOnly] = useState(false);

  const language = getLanguageFromFormat(format);

  // Custom render function for syntax highlighting
  const renderContent = (str: string) => {
    return (
      <SyntaxHighlighter
        language={language}
        style={oneLight}
        customStyle={{
          margin: 0,
          padding: 0,
          background: 'transparent',
          fontSize: 'inherit',
          lineHeight: 'inherit',
          fontFamily: 'inherit',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          maxWidth: '100%',
          overflow: 'hidden',
        }}
        codeTagProps={{
          style: {
            fontSize: 'inherit',
            fontFamily: 'inherit',
            lineHeight: 'inherit',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            maxWidth: '100%',
          }
        }}
        PreTag="div"
        wrapLines={true}
        wrapLongLines={true}
      >
        {str}
      </SyntaxHighlighter>
    );
  };

  // If diff is empty or null, files are semantically identical
  if (!diff || (Array.isArray(diff) && diff.length === 0) || (typeof diff === 'object' && Object.keys(diff).length === 0)) {
    return (
      <div className="diff-result">
        <div className="diff-identical">✅ Files are semantically identical.</div>
        <div className="diff-controls">
          <label>
            <input
              type="checkbox"
              checked={splitView}
              onChange={(e) => setSplitView(e.target.checked)}
            />
            Split View
          </label>
        </div>
        <div className="diff-viewer">
          <div className="diff-viewer-content">
            <ReactDiffViewer
              oldValue={formatContent(original, format)}
              newValue={formatContent(modified, format)}
              splitView={splitView}
              leftTitle="Original"
              rightTitle="Modified"
              showDiffOnly={false}
              useDarkTheme={false}
              compareMethod={DiffMethod.WORDS}
              renderContent={renderContent}
              styles={{
                variables: {
                  light: {
                    codeFoldGutterBackground: '#f7f7f7',
                    codeFoldBackground: '#f7f7f7',
                    diffViewerBackground: '#fff',
                    addedBackground: '#e6ffed',
                    removedBackground: '#ffecec',
                    wordAddedBackground: '#acf2bd',
                    wordRemovedBackground: '#fdb8c0',
                    addedGutterBackground: '#cdffd8',
                    removedGutterBackground: '#ffdce0',
                    gutterBackground: '#f7f7f7',
                    gutterBackgroundDark: '#f7f7f7',
                    highlightBackground: '#fffbdd',
                    highlightGutterBackground: '#fff5b4',
                  }
                },
                contentText: {
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word',
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="diff-result">
      <div className="diff-summary">
        <span className="diff-changes">🔍 Differences detected</span>
        {Array.isArray(diff) && <span className="diff-count">({diff.length} changes)</span>}
      </div>
      <div className="diff-controls">
        <label>
          <input
            type="checkbox"
            checked={splitView}
            onChange={(e) => setSplitView(e.target.checked)}
          />
          Split View
        </label>
        <label>
          <input
            type="checkbox"
            checked={showDiffOnly}
            onChange={(e) => setShowDiffOnly(e.target.checked)}
          />
          Show Differences Only
        </label>
      </div>
      <div className="diff-viewer">
        <div className="diff-viewer-content">
          <ReactDiffViewer
            oldValue={formatContent(original, format)}
            newValue={formatContent(modified, format)}
            splitView={splitView}
            leftTitle="Original"
            rightTitle="Modified"
            showDiffOnly={showDiffOnly}
            useDarkTheme={false}
            compareMethod={DiffMethod.WORDS}
            renderContent={renderContent}
            styles={{
              variables: {
                light: {
                  codeFoldGutterBackground: '#f7f7f7',
                  codeFoldBackground: '#f7f7f7',
                  diffViewerBackground: '#fff',
                  addedBackground: '#e6ffed',
                  removedBackground: '#ffecec',
                  wordAddedBackground: '#acf2bd',
                  wordRemovedBackground: '#fdb8c0',
                  addedGutterBackground: '#cdffd8',
                  removedGutterBackground: '#ffdce0',
                  gutterBackground: '#f7f7f7',
                  gutterBackgroundDark: '#f7f7f7',
                  highlightBackground: '#fffbdd',
                  highlightGutterBackground: '#fff5b4',
                }
              },
              contentText: {
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DiffViewer;