import React, { useState, useRef, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface SyntaxHighlightedInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  format: string;
  className?: string;
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
    case 'javascript':
    case 'js':
      return 'javascript';
    case 'typescript':
    case 'ts':
      return 'typescript';
    case 'css':
      return 'css';
    case 'html':
      return 'html';
    case 'markdown':
    case 'md':
      return 'markdown';
    default:
      return 'text';
  }
};

const SyntaxHighlightedInput: React.FC<SyntaxHighlightedInputProps> = ({
  value,
  onChange,
  placeholder,
  format,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlighterRef = useRef<HTMLDivElement>(null);

  const language = getLanguageFromFormat(format);

  // Sync scroll between textarea and highlighter
  const handleScroll = () => {
    if (textareaRef.current && highlighterRef.current) {
      const textarea = textareaRef.current;
      const highlighter = highlighterRef.current;
      highlighter.scrollTop = textarea.scrollTop;
      highlighter.scrollLeft = textarea.scrollLeft;
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.max(120, Math.min(400, textareaRef.current.scrollHeight));
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [value]);

  const customStyle = {
    ...oneLight,
    'pre[class*="language-"]': {
      ...oneLight['pre[class*="language-"]'],
      margin: 0,
      padding: '12px',
      background: 'transparent',
      fontSize: '0.9rem',
      lineHeight: '1.5',
      fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
    },
    'code[class*="language-"]': {
      ...oneLight['code[class*="language-"]'],
      fontSize: '0.9rem',
      lineHeight: '1.5',
      fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
    }
  };

  return (
    <div className={`syntax-input-container ${className}`}>
      <div className="syntax-input-wrapper">
        {/* Syntax highlighted background */}
        <div 
          ref={highlighterRef}
          className="syntax-highlighter-bg"
          style={{ 
            opacity: isFocused ? 0.7 : 1,
            transition: 'opacity 0.2s ease'
          }}
        >
          <SyntaxHighlighter
            language={language}
            style={customStyle}
            customStyle={{
              margin: 0,
              padding: '12px',
              background: 'transparent',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
            }}
            showLineNumbers={false}
            wrapLines={true}
            wrapLongLines={true}
          >
            {value || (language === 'json' ? '{\n  \n}' : value || ' ')}
          </SyntaxHighlighter>
        </div>

        {/* Transparent textarea overlay */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onScroll={handleScroll}
          placeholder={placeholder}
          className="syntax-textarea"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>
    </div>
  );
};

export default SyntaxHighlightedInput;
