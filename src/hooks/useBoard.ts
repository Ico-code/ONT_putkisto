import { useCallback, useEffect, useState } from 'react'
import type { Column, Task } from '../types/ProjectTypes'
import useProjects from './useProjects'

export function useBoard(projectId?: string) {
  const key = projectId ? `kanban_board_${projectId}` : 'kanban_board_default'
  const [columns, setColumns] = useState<Column[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const initialColumns = (): Column[] => [
    {
      id: 'todo',
      title: 'To Do',
      tasks: [
        { id: 't1', title: 'Create initial data model' },
        { id: 't2', title: 'Design UI mockups' },
        { id: 't3', title: 'Set up routes' },
      ],
    },
    {
      id: 'inprogress',
      title: 'In Progress',
      tasks: [{ id: 't4', title: 'Implement Kanban board' }],
    },
    { id: 'done', title: 'Done', tasks: [] },
  ]

  useEffect(() => {
    setLoading(true)
    try {
      const raw = localStorage.getItem(key)
      if (raw) setColumns(JSON.parse(raw) as Column[])
      else setColumns(initialColumns())
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setColumns(initialColumns())
    } finally {
      setLoading(false)
    }
  }, [key])

  useEffect(() => {
    if (columns) {
      try {
        localStorage.setItem(key, JSON.stringify(columns))
      } catch (e) {
        void e
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns])

  // update project's lastVisited when board changes via operations
  const { updateProject } = useProjects()

  const addTask = useCallback((columnId: string, task: Task) => {
    setColumns((prev) => {
      if (!prev) return prev
      const next = prev.map((c) => (c.id === columnId ? { ...c, tasks: [...c.tasks, task] } : c))
      try { if (projectId) updateProject?.(projectId, { lastVisited: Date.now() }) } catch (e) { void e }
      return next
    })
  }, [])

  const deleteTask = useCallback((taskId: string) => {
    setColumns((prev) => {
      if (!prev) return prev
      const next = prev.map((c) => ({ ...c, tasks: c.tasks.filter((t) => t.id !== taskId) }))
      try { if (projectId) updateProject?.(projectId, { lastVisited: Date.now() }) } catch (e) { void e }
      return next
    })
  }, [])

  const editTask = useCallback((taskId: string, patch: Partial<Task>) => {
    setColumns((prev) => {
      if (!prev) return prev
      const next = prev.map((c) => ({ ...c, tasks: c.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)) }))
      try { if (projectId) updateProject?.(projectId, { lastVisited: Date.now() }) } catch (e) { void e }
      return next
    })
  }, [])

  const moveTask = useCallback((taskId: string, toColumnId: string, beforeTaskId?: string | null) => {
    setColumns((prev) => {
      if (!prev) return prev
      const next = prev.map((c) => ({ ...c, tasks: [...c.tasks] }))
      const fromCol = next.find((c) => c.tasks.some((t) => t.id === taskId))
      const toCol = next.find((c) => c.id === toColumnId)
      if (!fromCol || !toCol) return prev
      const idx = fromCol.tasks.findIndex((t) => t.id === taskId)
      if (idx < 0) return prev
      const [task] = fromCol.tasks.splice(idx, 1)
      if (beforeTaskId) {
        const insertAt = toCol.tasks.findIndex((t) => t.id === beforeTaskId)
        if (insertAt >= 0) toCol.tasks.splice(insertAt, 0, task)
        else toCol.tasks.push(task)
      } else {
        toCol.tasks.push(task)
      }
      try { if (projectId) updateProject?.(projectId, { lastVisited: Date.now() }) } catch (e) { void e }
      return next
    })
  }, [])

  const moveTaskLeft = useCallback((taskId: string) => {
    setColumns((prev) => {
      if (!prev) return prev
      const next = prev.map((c) => ({ ...c, tasks: [...c.tasks] }))
      const fromIdx = next.findIndex((col) => col.tasks.some((t) => t.id === taskId))
      if (fromIdx <= 0) return prev
      const fromCol = next[fromIdx]
      const toCol = next[fromIdx - 1]
      const taskIndex = fromCol.tasks.findIndex((t) => t.id === taskId)
      if (taskIndex < 0) return prev
      const [task] = fromCol.tasks.splice(taskIndex, 1)
      toCol.tasks.push(task)
      try { if (projectId) updateProject?.(projectId, { lastVisited: Date.now() }) } catch (e) { void e }
      return next
    })
  }, [])

  const moveTaskRight = useCallback((taskId: string) => {
    setColumns((prev) => {
      if (!prev) return prev
      const next = prev.map((c) => ({ ...c, tasks: [...c.tasks] }))
      const fromIdx = next.findIndex((col) => col.tasks.some((t) => t.id === taskId))
      if (fromIdx < 0 || fromIdx >= next.length - 1) return prev
      const fromCol = next[fromIdx]
      const toCol = next[fromIdx + 1]
      const taskIndex = fromCol.tasks.findIndex((t) => t.id === taskId)
      if (taskIndex < 0) return prev
      const [task] = fromCol.tasks.splice(taskIndex, 1)
      toCol.tasks.push(task)
      try { if (projectId) updateProject?.(projectId, { lastVisited: Date.now() }) } catch (e) { void e }
      return next
    })
  }, [])

  return {
    columns: columns ?? [],
    loading,
    addTask,
    deleteTask,
    editTask,
    moveTask,
    moveTaskLeft,
    moveTaskRight,
    setColumns,
  }
}

export default useBoard
