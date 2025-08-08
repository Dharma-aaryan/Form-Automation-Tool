// ── src/components/FormField.jsx ──
import React from 'react'


export default function FormField({ field, onChange }) {
  const { id, type, label, value, options = [], required } = field

  const handleChange = e => {
    onChange(
      type === 'multi-select'
        ? Array.from(e.target.selectedOptions).map(o => o.value)
        : e.target.value
    )
  }

  return (
    <div className="form-field" style={{ cursor: 'default' }}>
      <label style={{ display: 'block', marginBottom: 4 }}>
        {label}{required && ' *'}
      </label>

      {type === 'text' || type === 'number' || type === 'date' ? (
        <input
          type={type}
          value={value}
          required={required}
          onChange={e => onChange(e.target.value)}
        />
      ) : type === 'single-select' ? (
        <div>
          {options.map(opt => (
            <label key={opt} style={{ display: 'block' }}>
              <input
                type="radio"
                name={id}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      ) : type === 'multi-select' ? (
        <select
          multiple
          value={value}
          required={required}
          onChange={handleChange}
        >
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : type === 'dropdown' ? (
        <select
          value={value}
          required={required}
          onChange={handleChange}
        >
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : type === 'submit' ? (
        <button type="submit">{label}</button>
      ) : null}
    </div>
  )
}
