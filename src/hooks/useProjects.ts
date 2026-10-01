import { useCallback, useEffect, useState } from 'react'
import type { Project } from '../types/ProjectTypes'

const STORAGE_KEY = 'projects_v1'

const DEFAULT_PROJECTS: Project[] = [
  { id: 'p1', name: 'CI/CD Pipeline Demo', isActive: true },
  { id: 'p2', name: 'Website Redesign', isActive: false },
  { id: 'p3', name: 'Server Migration', isActive: false },
]

export function useProjects() {
  const [projects, setProjects] = useState<Project[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  // load from localStorage (or fallback to default)
  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        setProjects(JSON.parse(raw) as Project[])
      } else {
        setProjects(DEFAULT_PROJECTS)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS))
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to load projects'))
      setProjects(DEFAULT_PROJECTS)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const refresh = useCallback(() => load(), [load])

  const saveProjects = useCallback((next: Project[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      setProjects(next)
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to save projects'))
    }
  }, [])

  const addProject = useCallback((p: Project) => {
    setProjects((prev) => {
      const next = prev ? [...prev, p] : [p]
      saveProjects(next)
      return next
    })
  }, [saveProjects])

  const updateProject = useCallback((id: string, patch: Partial<Project>) => {
    setProjects((prev) => {
      if (!prev) return prev
      const next = prev.map((proj) => (proj.id === id ? { ...proj, ...patch } : proj))
      saveProjects(next)
      return next
    })
  }, [saveProjects])

  const removeProject = useCallback((id: string) => {
    setProjects((prev) => {
      if (!prev) return prev
      const next = prev.filter((proj) => proj.id !== id)
      saveProjects(next)
      return next
    })
  }, [saveProjects])

  return {
    projects: projects ?? [],
    loading,
    error,
    refresh,
    addProject,
    updateProject,
    removeProject,
  }
}

export default useProjects
