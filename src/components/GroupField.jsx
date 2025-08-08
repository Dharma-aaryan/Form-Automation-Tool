import React, { useState } from 'react'
import StaticField from './StaticField.jsx'

// reuse the same full palette
const PALETTE_ITEMS = [
  { type: 'text',           label: 'Text Field'    },
  { type: 'number',         label: 'Number Field'  },
  { type: 'date',           label: 'Date Picker'   },
  { type: 'single-select',  label: 'Single Select' },
  { type: 'multi-select',   label: 'Multi Select'  },
  { type: 'dropdown',       label: 'Dropdown Menu' },
  { type: 'submit',         label: 'Submit Button' },
  { type: 'header',         label: 'Header Text'   },
  { type: 'group',          label: 'Group Fields'  }
]

export default function GroupField({
  group,
  addToGroup,
  onFieldChange,
  onDelete,
  onMoveUp,
  onMoveDown
}) {
  const [isDragOver, setIsDragOver]             = useState(false)
  const [showLocalPalette, setShowLocalPalette] = useState(false)

  // Drag/drop only from this local palette
  function handleDragStart(e, item) {
    e.dataTransfer.setData('application/json', JSON.stringify(item))
    e.dataTransfer.setData('source', 'group')
  }
  function handleDragOver(e)   { e.preventDefault(); setIsDragOver(true) }
  function handleDragLeave()   { setIsDragOver(false) }
  function handleDrop(e) {
    e.preventDefault(); setIsDragOver(false)
    if (e.dataTransfer.getData('source') !== 'group') return
    const item = JSON.parse(e.dataTransfer.getData('application/json'))
    addToGroup(item)
  }

  return (
    <div className="group-container">
      <div className="group-header">
        <input
          className="group-title"
          value={group.label}
          onChange={e => onFieldChange(group.id, { label: e.target.value })}
        />
        <div className="group-controls">
          <button onClick={() => onMoveUp(group.id)}>▲</button>
          <button onClick={() => onMoveDown(group.id)}>▼</button>
          <button onClick={() => onDelete(group.id)}>✕</button>
        </div>

        <div className="add-field-wrapper">
          <button
            className="add-field-btn small"
            onClick={e => {
              e.stopPropagation()
              setShowLocalPalette(v => !v)
            }}
          >
            + Field
          </button>
          {showLocalPalette && (
            <div className="palette-list small">
              {PALETTE_ITEMS.map(item => (
                <div
                  key={item.type}
                  className="palette-list-item"
                  draggable
                  onDragStart={e => handleDragStart(e, item)}
                  onClick={() => {
                    addToGroup(item)
                    setShowLocalPalette(false)
                  }}
                >
                  {item.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        className={`group-fields${isDragOver ? ' drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {group.children.map(f => (
          <StaticField
            key={f.id}
            {...f}
            onValueChange={(i, v)      => onFieldChange(i, { value: v })}
            onTypeChange={(i, t)       => onFieldChange(i, { type: t, label: t })}
            onLabelChange={(i, txt)    => onFieldChange(i, { label: txt })}
            onRequiredChange={(i, chk) => onFieldChange(i, { required: chk })}
            onOptionsChange={(i, opts) => onFieldChange(i, { options: opts })}
            onDelete={i                => onFieldChange(i, { _delete: true })}
            onMoveUp={()               => onMoveUp(f.id)}
            onMoveDown={()             => onMoveDown(f.id)}
          />
        ))}
      </div>
    </div>
  )
}
