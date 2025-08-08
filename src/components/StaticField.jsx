// src/components/StaticField.jsx
import React, { useState, useEffect, useRef } from 'react'

const TYPE_LABELS = {
  text:           'Text Field',
  number:         'Number Field',
  date:           'Date Picker',
  'single-select':'Single Select',
  'multi-select': 'Multi Select',
  dropdown:       'Dropdown Menu',
  submit:         'Submit Button',
  header:         'Header Text'
}

export default function StaticField({
  id,
  type,
  label,
  value,
  options = [],
  required,
  onTypeChange,
  onLabelChange,
  onRequiredChange,
  onOptionsChange,
  onValueChange,
  onDelete,
  onMoveUp,
  onMoveDown
}) {
  const [isOpen,        setIsOpen]        = useState(false)
  const [editingHeader, setEditingHeader] = useState(false)
  const [headerText,    setHeaderText]    = useState(label)
  const ref = useRef(null)

  // Keep headerText in sync with label prop
  useEffect(() => {
    if (type === 'header' || type === 'submit') {
      setHeaderText(label)
    }
  }, [label, type])

  // Close popup on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (isOpen && ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Commit inline header/submit edit
  function commitHeader() {
    const text = headerText.trim() || label
    onLabelChange(id, text)
    setEditingHeader(false)
  }

  // ── HEADER only ───────────────────────────────────
  if (type === 'header') {
    return (
      <div className="form-field" ref={ref}>
        <div className="controls">
          <button
            className="control-btn"
            onClick={e => { e.stopPropagation(); onMoveUp(id) }}
          >▲</button>
          <button
            className="control-btn"
            onClick={e => { e.stopPropagation(); onMoveDown(id) }}
          >▼</button>
          <button
            className="control-btn"
            onClick={e => { e.stopPropagation(); onDelete(id) }}
          >✕</button>
        </div>

        {editingHeader ? (
          <input
            className="header-inline-input"
            value={headerText}
            autoFocus
            onChange={e => setHeaderText(e.target.value)}
            onBlur={commitHeader}
            onKeyDown={e => e.key==='Enter' && commitHeader()}
          />
        ) : (
          <h2
            className="header-inline-text"
            onDoubleClick={() => setEditingHeader(true)}
          >
            {label}
          </h2>
        )}
      </div>
    )
  }

  // ── SUBMIT only ───────────────────────────────────
  if (type === 'submit') {
    return (
      <div className="form-field" ref={ref}>
        <div className="controls">
          <button
            className="control-btn"
            onClick={e => { e.stopPropagation(); onMoveUp(id) }}
          >▲</button>
          <button
            className="control-btn"
            onClick={e => { e.stopPropagation(); onMoveDown(id) }}
          >▼</button>
          <button
            className="control-btn"
            onClick={e => { e.stopPropagation(); onDelete(id) }}
          >✕</button>
        </div>

        {editingHeader ? (
          <input
            className="header-inline-input"
            value={headerText}
            autoFocus
            onChange={e => setHeaderText(e.target.value)}
            onBlur={commitHeader}
            onKeyDown={e => e.key==='Enter' && commitHeader()}
          />
        ) : (
          <button
            className="header-inline-text submit-inline-text"
            onDoubleClick={() => setEditingHeader(true)}
          >
            {label}
          </button>
        )}
      </div>
    )
  }

  // ── EVERYTHING ELSE ────────────────────────────────
  return (
    <div className="form-field" ref={ref} onClick={() => setIsOpen(true)}>
      <button
        className="edit-btn"
        onClick={e => { e.stopPropagation(); setIsOpen(true) }}
      >✎</button>

      <div className="field-header">
        <span className="field-name">{label}</span>
        {required && <span className="required-asterisk">*</span>}
      </div>

      <div className="field-preview">
        {['text','number','date'].includes(type) ? (
          <input
            type={type}
            placeholder={label}
            value={value}
            onChange={e => onValueChange(id, e.target.value)}
          />
        ) : (
          <div
            className={
              type==='multi-select' ? 'checkbox-group' : 'radio-group'
            }
            style={{ display:'flex', flexDirection:'column', gap:'8px' }}
          >
            {type==='single-select' && options.map((opt,i)=>(
              <label key={i}>
                <input
                  type="radio"
                  name={id}
                  checked={value===opt}
                  onChange={()=>onValueChange(id,opt)}
                />
                {opt}
              </label>
            ))}
            {type==='multi-select' && options.map((opt,i)=>(
              <label key={i}>
                <input
                  type="checkbox"
                  checked={value.includes(opt)}
                  onChange={e => {
                    const next = e.target.checked
                      ? [...value, opt]
                      : value.filter(v=>v!==opt)
                    onValueChange(id, next)
                  }}
                />
                {opt}
              </label>
            ))}
            {type==='dropdown' && (
              <select
                value={value}
                onChange={e => onValueChange(id, e.target.value)}
              >
                {options.map((opt,i)=>(
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="inline-popup" onClick={e=>e.stopPropagation()}>
          <div className="popup-header">
            <h4 className="popup-title">{TYPE_LABELS[type]}</h4>
            <div className="popup-controls">
              <button onClick={()=>onMoveUp(id)}>▲</button>
              <button onClick={()=>onMoveDown(id)}>▼</button>
              <button onClick={() => { onDelete(id); setIsOpen(false) }}>✕</button>
            </div>
          </div>

          <div className="popup-body">
            <label>
              Label
              <input
                type="text"
                value={label}
                onChange={e=>onLabelChange(id, e.target.value)}
              />
            </label>

            <label>
              Field Type
              <select
                className="popup-type"
                value={type}
                onChange={e=>onTypeChange(id, e.target.value)}
              >
                {Object.entries(TYPE_LABELS).map(([k,l])=>(
                  <option key={k} value={k}>{l}</option>
                ))}
              </select>
            </label>

            <label className="popup-required">
              <input
                type="checkbox"
                checked={required}
                onChange={e=>onRequiredChange(id, e.target.checked)}
              />
              Required
            </label>

            {['single-select','multi-select','dropdown'].includes(type) && (
              <div className="options-editor">
                <h5>Options</h5>
                {options.map((opt,i)=>(
                  <div key={i} className="option-row">
                    <input
                      value={opt}
                      onChange={e => {
                        const newOpts = [...options]
                        newOpts[i] = e.target.value
                        onOptionsChange(id, newOpts)
                      }}
                    />
                    <button onClick={() =>
                      onOptionsChange(id, options.filter((_,j)=>j!==i))
                    }>✕</button>
                  </div>
                ))}
                <button
                  className="add-option-btn"
                  onClick={() => onOptionsChange(id, [...options, `Option ${options.length+1}`])}
                >
                  + Add Option
                </button>
              </div>
            )}
          </div>

          <button className="close-popup" onClick={()=>setIsOpen(false)}>
            Done
          </button>
        </div>
      )}
    </div>
  )
}
