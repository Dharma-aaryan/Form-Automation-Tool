// src/pages/LandingPage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/preview.css';


// Label map for display
const TYPE_LABELS = {
  text:            'Text',
  number:          'Number',
  date:            'Date Picker',
  'single-select': 'Single‑Select',
  'multi-select':  'Multi‑Select',
  dropdown:        'Dropdown',
  submit:          'Submit Button',
  header:          'Header',
  group:           'Group'
}

export default function LandingPage({ forms, onDelete }) {
  const navigate = useNavigate()
  const [viewForm, setViewForm]           = useState(null)
  const [expandedGroups, setExpandedGroups] = useState(new Set())

  // Open builder for new form
  const handleCreate = () =>
    navigate('/design', { state: { form: null, openPalette: true } })

  // Open builder for existing form
  const handleEdit = form =>
    navigate('/design', { state: { form, openPalette: false } })

  // Show data‑view modal
  const handleView = form => {
    setViewForm(form)
    setExpandedGroups(new Set())  // reset any expansions
  }
  const closeView = () => setViewForm(null)

  // Toggle a group's expanded state
  function toggleGroup(id) {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // Recursively render table rows; only groups get an arrow
  function renderRows(fields, depth = 0) {
    return fields.flatMap(field => {
      if (field.type === 'group') {
        const isOpen = expandedGroups.has(field.id)
        return [
          <tr key={field.id}>
            <td style={{ paddingLeft: depth * 20 }}>
              <button
                onClick={() => toggleGroup(field.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  marginRight: 8
                }}
                aria-label={isOpen ? 'Collapse group' : 'Expand group'}
              >
                {isOpen ? '▼' : '▶'}
              </button>
              <strong>{field.label}</strong>
            </td>
            <td>{TYPE_LABELS[field.type]}</td>
            <td>—</td>
          </tr>,
          ...(isOpen
            ? renderRows(field.children || [], depth + 1)
            : [])
        ]
      } else {
        // regular field row
        const displayValue = field.type === 'multi-select'
          ? (field.value || []).join(', ')
          : field.type === 'header'
            ? 'header'
            : String(field.value ?? '')
        return (
          <tr key={field.id}>
            <td style={{ paddingLeft: depth * 20 }}>{field.label}</td>
            <td>{TYPE_LABELS[field.type] || field.type}</td>
            <td>{displayValue}</td>
          </tr>
        )
      }
    })
  }

  return (
    <div className="landing-page">
      <div className="landing-header">
        <h1>Your Forms</h1>
        <button
          className="action-btn add-top-btn"
          onClick={handleCreate}
        >
          Add New Form
        </button>
      </div>

      {forms.length === 0 ? (
        <p>No forms saved yet.</p>
      ) : (
        <table className="forms-table">
          <thead>
            <tr>
              <th>Form Name</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {forms.map(f => (
              <tr key={f.id}>
                <td>{f.name}</td>
                <td>{new Date(f.created).toLocaleString()}</td>
                <td className="actions-cell">
                  <button
                    className="action-btn view-btn"
                    onClick={() => handleView(f)}
                  >
                    View Data
                  </button>
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(f)}
                  >
                    Edit
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => onDelete(f.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {viewForm && (
        <div className="data-popup-overlay" onClick={closeView}>
          <div
            className="data-popup"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="close-data-popup"
              onClick={closeView}
            >
              ✕
            </button>
            <h2>{viewForm.name} — Data</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Type</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {renderRows(viewForm.fields)}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
