import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeOutput = ({ code, codeLanguage = 'css'}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };


  return (
    <div className="tool-code-output">
      <button className="btn btn-sm btn-secondary copy-btn" title="Copy" onClick={handleCopy}>
        <i className={`bi ${copied ? 'bi-check-lg' : 'bi-clipboard'}`}></i>
      </button>
      <SyntaxHighlighter language={codeLanguage} style={dracula}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeOutput;
