import React from 'react'
import { useDraggable } from '@dnd-kit/core'

// your draggable field types
const PALETTE_ITEMS = [
  { type: 'text', label: 'Text Field' },
  { type: 'number', label: 'Number Field' },
  { type: 'email', label: 'Email Field' },
  { type: 'textarea', label: 'Text Area' },
]

export default function Palette() {
  return (
    <div className="palette">
      <h2>Palette</h2>
      {PALETTE_ITEMS.map((item) => (
        <PaletteItem
          key={item.type}
          id={`palette-${item.type}`}
          data={item}
        />
      ))}
    </div>
  )
}

function PaletteItem({ id, data }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data, // so active.data.current === {type, label}
    })

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="palette-item"
      {...listeners}
      {...attributes}
    >
      {data.label}
    </div>
  )
}
