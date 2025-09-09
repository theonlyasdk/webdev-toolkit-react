import React, { useState, useEffect } from 'react';
import RangeInput from './RangeInput';
import CustomColorPicker from './CustomColorPicker'; // Use this!

const GradientPicker = ({ onGradientChange }) => {
  const [stops, setStops] = useState([
    { id: 1, color: '#0d6efd', position: 0 },
    { id: 2, color: '#6f42c1', position: 100 }
  ]);
  const [gradientType, setGradientType] = useState('linear');
  const [angle, setAngle] = useState(90);
  const [radialShape, setRadialShape] = useState('ellipse');
  const [nextId, setNextId] = useState(3);
  const [openPickerId, setOpenPickerId] = useState(null);

  useEffect(() => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const colorStops = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ');
    
    let gradientCode = '';
    if (gradientType === 'linear') {
      gradientCode = `linear-gradient(${angle}deg, ${colorStops})`;
    } else {
      gradientCode = `radial-gradient(${radialShape}, ${colorStops})`;
    }
    onGradientChange(gradientCode);
  }, [stops, gradientType, angle, radialShape, onGradientChange]);

  const handleStopChange = (id, field, value) => {
    setStops(stops.map(stop => stop.id === id ? { ...stop, [field]: value } : stop));
  };

  const addStop = () => {
    setStops([...stops, { id: nextId, color: '#ffffff', position: 50 }]);
    setNextId(nextId + 1);
  };

  const removeStop = (id) => {
    if (stops.length > 2) {
      setStops(stops.filter(stop => stop.id !== id));
    }
  };

  const resetAngle = () => setAngle(90);

  return (
    <div className="d-flex flex-column gap-3">
      <div>
        <label className="form-label">Colors</label>
        <div id="gradient-stops">
          {stops.map(stop => (
            <div className="gradient-stop" key={stop.id}>
              {/* Color Picker Button */}
              <button
                type="button"
                className="btn d-flex align-items-center justify-content-center border"
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: stop.color,
                  flexShrink: 0
                }}
                onClick={() => setOpenPickerId(stop.id)}
                title="Pick color"
              >
                <i className="bi bi-palette-fill" style={{
                  color: 'white',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                  fontSize: '1rem'
                }}></i>
              </button>
              {/* Color Picker Dialog */}
              {openPickerId === stop.id && (
                <CustomColorPicker
                  isOpen={true}
                  initialColor={stop.color}
                  onColorChange={color => {
                    handleStopChange(stop.id, 'color', color);
                  }}
                  onClose={() => setOpenPickerId(null)}
                />
              )}
              <input
                type="range"
                className="form-range"
                min="0"
                max="100"
                value={stop.position}
                onChange={e => handleStopChange(stop.id, 'position', e.target.value)}
              />
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => removeStop(stop.id)}
                title="Delete stop"
                disabled={stops.length <= 2}
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          ))}
        </div>
        <div className="d-flex flex-row align-items-center justify-content-center gap-2 mt-2">
          <button className="btn btn-sm btn-outline-primary mt-2" onClick={addStop}>Add Color</button>
        </div>
      </div>
      <div>
        <label htmlFor="gradientType" className="form-label">Type</label>
        <select className="form-select" id="gradientType" value={gradientType} onChange={e => setGradientType(e.target.value)}>
          <option value="linear">Linear</option>
          <option value="radial">Radial</option>
        </select>
      </div>
      {gradientType === 'linear' && (
        <RangeInput label="Angle" id="gradientAngle" value={angle} min="0" max="360" unit="deg" onChange={e => setAngle(e.target.value)} onReset={resetAngle} />
      )}
      {gradientType === 'radial' && (
        <div>
          <label htmlFor="radialShape" className="form-label">Shape</label>
          <select className="form-select" id="radialShape" value={radialShape} onChange={e => setRadialShape(e.target.value)}>
            <option value="ellipse">Ellipse</option>
            <option value="circle">Circle</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default GradientPicker;
