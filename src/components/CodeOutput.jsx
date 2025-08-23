import React, { useState } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeOutput = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="tool-code-output">
      <button className="btn btn-sm btn-primary copy-btn" title="Copy" onClick={handleCopy}>
        <i className={`bi ${copied ? 'bi-check-lg' : 'bi-clipboard'}`}></i>
      </button>
      <SyntaxHighlighter language="css" style={dark}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeOutput;
