// src/pages/DesignPage.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import Canvas from '../components/Canvas.jsx'

// ─── Palette & Helpers ───────────────────────────
const PALETTE_ITEMS = [
  { type: 'text',           label: 'Text Field'    },
  { type: 'number',         label: 'Number Field'  },
  { type: 'date',           label: 'Date Picker'   },
  { type: 'single-select',  label: 'Single Select' },
  { type: 'multi-select',   label: 'Multi Select'  },
  { type: 'submit',         label: 'Submit Button' },
  { type: 'header',         label: 'Header Text'   },
  { type: 'dropdown',       label: 'Dropdown Menu' }
]

function itemLabel(type) {
  return PALETTE_ITEMS.find(x => x.type === type)?.label || 'Field'
}

function typeExtras(type) {
  switch (type) {
    case 'single-select':
    case 'multi-select':
      return {
        options: ['Option 1','Option 2'],
        value:   type === 'multi-select' ? [] : 'Option 1'
      }
    case 'dropdown':
      return {
        options: ['Option 1','Option 2'],
        value: 'Option 1'
      }
    case 'header':
      // no input value for header
      return {}
    default:
      return { value: '' }
  }
}

export default function DesignPage({ onSave }) {
  const navigate   = useNavigate()
  const { state }  = useLocation()
  const pre        = state?.form
  const openOnLoad = state?.openPalette

  // ── Preview vs Builder toggle ──────────────────
  const [previewMode, setPreviewMode] = useState(false)

  // ── Title ───────────────────────────────────────
  const [pageTitle, setPageTitle]           = useState(pre?.name || 'Customize Form')
  const [isEditingTitle, setIsEditingTitle] = useState(false)

  // ── Fields ─────────────────────────────────────
  const [staticFields, setStaticFields] = useState(() =>
    pre
      ? pre.fields.filter(f => f.required)
      : [
          { id: uuidv4(), type:'text',  label:'Name',         value:'', required:true },
          { id: uuidv4(), type:'text',  label:'Email',        value:'', required:true },
          { id: uuidv4(), type:'text',  label:'Phone Number', value:'', required:true }
        ]
  )
  const [dynamicFields, setDynamicFields] = useState(() =>
    pre ? pre.fields.filter(f => !f.required) : []
  )

  // ── Palette / Drag ─────────────────────────────
  const [showPalette, setShowPalette] = useState(false)
  const [isDragOver,   setIsDragOver] = useState(false)
  useEffect(() => {
    if (openOnLoad) setShowPalette(true)
  }, [openOnLoad])

  // ── Add / Update / Delete ───────────────────────
  function makeField(item) {
    return {
      id:       uuidv4(),
      type:     item.type,
      label:    item.label,
      required: false,
      ...typeExtras(item.type)
    }
  }
  function addField(item) {
    setDynamicFields(d => [...d, makeField(item)])
    setShowPalette(false)
  }
  function updateField(id, upd) {
    if (upd._delete) {
      setStaticFields(s => s.filter(f => f.id !== id))
      setDynamicFields(d => d.filter(f => f.id !== id))
      return
    }
    setStaticFields(s => s.map(f => f.id===id ? {...f,...upd} : f))
    setDynamicFields(d => d.map(f => f.id===id ? {...f,...upd} : f))
  }

  // ── Drag & Drop ─────────────────────────────────
  function onDragStart(e, item) {
    e.dataTransfer.setData('application/json', JSON.stringify(item))
  }
  function onDragOver(e) {
    e.preventDefault(); setIsDragOver(true)
  }
  function onDragLeave() {
    setIsDragOver(false)
  }
  function onDrop(e) {
    e.preventDefault(); setIsDragOver(false)
    try {
      addField(JSON.parse(e.dataTransfer.getData('application/json')))
    } catch {}
  }

  // ── Move Up/Down ────────────────────────────────
  function moveStaticUp(id) {
    setStaticFields(s => {
      const i = s.findIndex(f => f.id===id)
      if (i > 0) [s[i-1],s[i]] = [s[i],s[i-1]]
      return [...s]
    })
  }
  function moveStaticDown(id) {
    setStaticFields(s => {
      const i = s.findIndex(f => f.id===id)
      if (i >= 0 && i < s.length-1) [s[i],s[i+1]] = [s[i+1],s[i]]
      return [...s]
    })
  }
  function moveDynamicUp(id) {
    setDynamicFields(d => {
      const i = d.findIndex(f => f.id===id)
      if (i > 0) [d[i-1],d[i]] = [d[i],d[i-1]]
      return [...d]
    })
  }
  function moveDynamicDown(id) {
    setDynamicFields(d => {
      const i = d.findIndex(f => f.id===id)
      if (i >= 0 && i < d.length-1) [d[i],d[i+1]] = [d[i+1],d[i]]
      return [...d]
    })
  }

  // ── Save & Exit ─────────────────────────────────
  function saveAll() {
    const formObj = {
      id:      pre?.id ?? uuidv4(),
      name:    pageTitle,
      created: pre?.created ?? Date.now(),
      fields:  [...staticFields, ...dynamicFields]
    }
    onSave(formObj)
    navigate('/')
  }

  return (
    <div className="page-with-sidebar">
      <div className="design-page">
        <header className="design-header">
          {isEditingTitle ? (
            <input
              className="title-input"
              value={pageTitle}
              onChange={e=>setPageTitle(e.target.value)}
              onBlur={()=>setIsEditingTitle(false)}
              onKeyDown={e=>e.key==='Enter'&&setIsEditingTitle(false)}
              autoFocus
            />
          ) : (
            <h1 className="page-title" onClick={()=>setIsEditingTitle(true)}>
              {pageTitle}
            </h1>
          )}

          <div className="header-buttons">
            {/* Preview toggle */}
            <button
              className="add-field-btn"
              onClick={() => setPreviewMode(pm => !pm)}
            >
              {previewMode ? 'Back to Builder' : 'Preview Form'}
            </button>

            {/* Builder-only controls */}
            {!previewMode && <>
              <button
                className="add-field-btn"
                onClick={() => setShowPalette(v => !v)}
              >
                Add Field ▼
              </button>
              {showPalette && (
                <div className="palette-list">
                  {PALETTE_ITEMS.map(item => (
                    <div
                      key={item.type}
                      className="palette-list-item"
                      draggable
                      onDragStart={e => onDragStart(e, item)}
                      onClick={() => addField(item)}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
              <button className="save-btn" onClick={saveAll}>
                Save Form
              </button>
            </>}
          </div>
        </header>

        <Canvas
          staticFields={staticFields}
          dynamicFields={dynamicFields}
          previewMode={previewMode}

          onValueChange={(id, upd)     => updateField(id, upd)}
          onTypeChange={(id, type)     => updateField(id, { type, label: itemLabel(type), ...typeExtras(type) })}
          onLabelChange={(id, label)   => updateField(id, { label })}
          onRequiredChange={(id, req)  => updateField(id, { required: req })}
          onOptionsChange={(id, opts)  => updateField(id, { options: opts })}
          onDelete={id                  => updateField(id, { _delete: true })}
          onMoveUp={(id, isStatic)      => isStatic ? moveStaticUp(id) : moveDynamicUp(id)}
          onMoveDown={(id, isStatic)    => isStatic ? moveStaticDown(id) : moveDynamicDown(id)}

          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          isDragOver={isDragOver}
        />
      </div>
    </div>
  )
}
