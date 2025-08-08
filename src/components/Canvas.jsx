// ── src/components/Canvas.jsx ──
import React from 'react'
import StaticField from './StaticField.jsx'
import GroupField  from './GroupField.jsx'
import FormField   from './FormField.jsx'


export default function Canvas({
  staticFields, dynamicFields, previewMode,
  onValueChange, onTypeChange, onLabelChange,
  onRequiredChange, onOptionsChange,
  onDelete, onMoveUp, onMoveDown,
  onDragOver, onDragLeave, onDrop, isDragOver
}) {
  // ── PREVIEW: end-user form ───────────────────────
  if (previewMode) {
    const allFields = [...staticFields, ...dynamicFields]
    return (
      <form onSubmit={e=>e.preventDefault()}>
        {allFields.map(f => (
          <FormField
            key={f.id}
            field={f}
            onChange={value=>onValueChange(f.id, { value })}
          />
        ))}
        <button type="submit">Submit</button>
      </form>
    )
  }

  // ── BUILDER: drag-n-drop canvas ─────────────────
  return (
    <>
      <section className="static-section">
        {staticFields.map(f => (
          <StaticField
            key={f.id}
            {...f}
            onValueChange={(i,v)=>onValueChange(i,{value:v})}
            onTypeChange={(i,t)=>onTypeChange(i,t)}
            onLabelChange={(i,txt)=>onLabelChange(i,txt)}
            onRequiredChange={(i,chk)=>onRequiredChange(i,chk)}
            onOptionsChange={(i,opts)=>onOptionsChange(i,opts)}
            onDelete={onDelete}
            onMoveUp={id=>onMoveUp(id,true)}
            onMoveDown={id=>onMoveDown(id,true)}
          />
        ))}
      </section>

      <section className="dynamic-fields-section">
        {dynamicFields.map(f=>(
          <StaticField
            key={f.id} {...f}
            onValueChange={(i,v)=>onValueChange(i,{value:v})}
            onTypeChange={(i,t)=>onTypeChange(i,t)}
            onLabelChange={(i,txt)=>onLabelChange(i,txt)}
            onRequiredChange={(i,chk)=>onRequiredChange(i,chk)}
            onOptionsChange={(i,opts)=>onOptionsChange(i,opts)}
            onDelete={onDelete}
            onMoveUp={id=>onMoveUp(id,false)}
            onMoveDown={id=>onMoveDown(id,false)}
          />
        ))}
      </section>

      <section className="dynamic-section">
        <div
          className={`dynamic-drop-area${isDragOver ? ' drag-over' : ''}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <p className="drop-hint">
            Drag here or click “Add Field” above to add fields
          </p>
        </div>
      </section>
    </>
  )
}
