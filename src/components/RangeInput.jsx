
import React from 'react';

const RangeInput = ({ label, id, value, min, max, step = 1, unit, onChange, onReset }) => (
  <div>
    <label htmlFor={id} className="form-label d-flex justify-content-between">
      {label}: <span>{value}{unit}</span>
    </label>
    <div className="d-flex align-items-center gap-2">
      <input
        type="range"
        className="form-range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
      />
      {onReset && (
        <button className="btn btn-sm btn-outline-secondary" onClick={onReset} title="Reset">
          <i className="bi bi-arrow-counterclockwise"></i>
        </button>
      )}
    </div>
  </div>
);

export default RangeInput;
