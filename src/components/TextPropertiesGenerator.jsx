
import React, { useState, useEffect } from 'react';
import RangeInput from './RangeInput';
import CodeOutput from './CodeOutput';
import GradientPicker from './GradientPicker';
import FontSelector from './FontSelector';

const TextPropertiesGenerator = () => {
  const [fontSize, setFontSize] = useState(56);
  const [fontWeight, setFontWeight] = useState(700);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [colorType, setColorType] = useState('solid'); // 'solid' or 'gradient'
  const [solidColor, setSolidColor] = useState('#0d6efd');
  const [gradientColor, setGradientColor] = useState('linear-gradient(90deg, #0d6efd 0%, #6f42c1 100%)');
  const [previewText, setPreviewText] = useState('Text');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [useGoogleFonts, setUseGoogleFonts] = useState(false);

  useEffect(() => {
    if (useGoogleFonts && fontFamily && fontFamily !== 'Inter') { // Avoid loading Inter again if it's already the default
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [fontFamily, useGoogleFonts]);

  const resetFontSize = () => setFontSize(56);
  const resetFontWeight = () => setFontWeight(700);
  const resetLetterSpacing = () => setLetterSpacing(0);

  const textColor = colorType === 'solid' ? solidColor : gradientColor;

  const textPropertiesCode = `font-size: ${fontSize}px;
font-weight: ${fontWeight};
letter-spacing: ${letterSpacing}px;
font-family: '${fontFamily.trim() || 'Inter'}', sans-serif;
${colorType === 'solid' ? `color: ${textColor};` : `background-image: ${textColor};
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;`}`;

  const textPropertiesStyle = {
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    letterSpacing: `${letterSpacing}px`,
    fontFamily: `'${fontFamily}', sans-serif`,
    ...(colorType === 'solid' ? { color: textColor } : { backgroundImage: textColor, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' })
  };

  return (
    <div className="container">
      <div className="card-body p-3">
        <h4 className="card-title mb-4">Text Properties Generator</h4>
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="d-flex flex-column gap-3">
              <div>
                <label htmlFor="previewText" className="form-label">Preview Text</label>
                <textarea className="form-control" id="previewText" placeholder="Enter preview text..." rows="3" value={previewText} onChange={e => setPreviewText(e.target.value)}></textarea>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" id="useGoogleFonts" checked={useGoogleFonts} onChange={() => setUseGoogleFonts(!useGoogleFonts)} />
                <label className="form-check-label" htmlFor="useGoogleFonts">Use Google Fonts</label>
              </div>
              <FontSelector onFontSelect={setFontFamily} selectedFont={fontFamily} useGoogleFonts={useGoogleFonts} />
              <RangeInput label="Font Size" id="tp-size" value={fontSize} min="10" max="150" unit="px" onChange={e => setFontSize(e.target.value)} onReset={resetFontSize} />
              <RangeInput label="Font Weight" id="tp-weight" value={fontWeight} min="100" max="900" step="100" unit="" onChange={e => setFontWeight(e.target.value)} onReset={resetFontWeight} />
              <RangeInput label="Letter Spacing" id="tp-spacing" value={letterSpacing} min="-5" max="20" unit="px" onChange={e => setLetterSpacing(e.target.value)} onReset={resetLetterSpacing} />
              <div>
                <label className="form-label">Color Type</label>
                <select className="form-select" value={colorType} onChange={e => setColorType(e.target.value)}>
                  <option value="solid">Solid Color</option>
                  <option value="gradient">Gradient</option>
                </select>
              </div>
              {colorType === 'solid' ? (
                <div>
                  <label htmlFor="tp-color" className="form-label">Text Color</label>
                  <input type="color" className="form-control form-control-color w-100" id="tp-color" value={solidColor} onChange={e => setSolidColor(e.target.value)} />
                </div>
              ) : (
                <GradientPicker onGradientChange={setGradientColor} />
              )}
            </div>
          </div>
          <div className="col-lg-7">
            <div className="preview-area mb-3">
              <div id="text-properties-preview" style={textPropertiesStyle}>{previewText}</div>
            </div>
            <CodeOutput code={textPropertiesCode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextPropertiesGenerator;


