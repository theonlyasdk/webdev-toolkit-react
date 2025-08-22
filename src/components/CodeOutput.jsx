
import React, { useState } from 'react';

const CodeOutput = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="code-output">
      <button className="btn btn-sm btn-primary copy-btn" title="Copy" onClick={handleCopy}>
        <i className={`bi ${copied ? 'bi-check-lg' : 'bi-clipboard'}`}></i>
      </button>
      <code>{code}</code>
    </div>
  );
};

export default CodeOutput;
