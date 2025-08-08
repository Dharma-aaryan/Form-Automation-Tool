// src/App.jsx
import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import LandingPage from './pages/LandingPage.jsx'
import DesignPage  from './pages/DesignPage.jsx'

export default function App() {
  const [forms, setForms] = useState([])

  // Add new or replace existing
  function handleSave(form) {
    setForms(prev => {
      const idx = prev.findIndex(f => f.id === form.id)
      if (idx !== -1) {
        const updated = [...prev]
        updated[idx] = form
        return updated
      } else {
        return [...prev, form]
      }
    })
  }

  function handleDelete(id) {
    setForms(prev => prev.filter(f => f.id !== id))
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <LandingPage
            forms={forms}
            onDelete={handleDelete}
          />
        }/>
        <Route path="/design" element={
          <DesignPage
            onSave={handleSave}
          />
        }/>
      </Routes>
    </BrowserRouter>
  )
}
