import React, { useState, useEffect } from 'react'
import './NewProjectModal.css'

interface Props {
  isOpen: boolean
  onClose: () => void
  onCreate: (name: string) => void
}

const NewProjectModal: React.FC<Props> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('')

  useEffect(() => {
    if (isOpen) setName('')
  }, [isOpen])

  if (!isOpen) return null

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onCreate(name.trim())
  }

  return (
    <div className="np-modal-overlay" role="dialog" aria-modal="true">
      <div className="np-modal">
        <h3 className="np-title">Create new project</h3>
        <form onSubmit={submit} className="np-form">
          <label className="np-label">
            Name
            <input
              className="np-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
              autoFocus
            />
          </label>
          <div className="np-actions">
            <button type="button" className="np-btn np-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="np-btn np-primary">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewProjectModal
