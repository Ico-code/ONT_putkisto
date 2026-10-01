import React, { useState } from "react";
import "./KanbanView.css";
import useBoard from '../../hooks/useBoard'
import type { Task } from "../../types/ProjectTypes";
import { useParams } from 'react-router'
import useProjects from '../../hooks/useProjects'

type Props = {
  projectId?: string;
};


const KanbanView: React.FC<Props> = ({ projectId: propProjectId }) => {
  const params = useParams()
  const projectId = propProjectId ?? params.projectId
  const { projects } = useProjects()
  const project = projects.find((p) => p.id === projectId)

  const { columns, addTask, deleteTask, editTask, moveTask } = useBoard(projectId)

  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskColumn, setNewTaskColumn] = useState<string>("todo")

  const onDragStart = (
    e: React.DragEvent,
    taskId: string,
    fromColumnId: string
  ) => {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ taskId, fromColumnId })
    );
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDropOnColumn = (
    e: React.DragEvent,
    toColumnId: string,
    beforeTaskId?: string | null
  ) => {
    e.preventDefault();
    const payloadRaw = e.dataTransfer.getData("text/plain");
    if (!payloadRaw) return;
    try {
      const payload = JSON.parse(payloadRaw);
      const { taskId, fromColumnId } = payload as {
        taskId: string;
        fromColumnId: string;
      };

      if (fromColumnId === toColumnId && !beforeTaskId) return;
      moveTask(taskId, toColumnId, beforeTaskId ?? null)
    } catch (err) {
      void err;
    }
  };

  const handleAddTask = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: Task = { id: `t${Date.now()}`, title: newTaskTitle.trim() }
    addTask(newTaskColumn, newTask)
    setNewTaskTitle("");
  };

  const handleDeleteTask = (taskId: string) => deleteTask(taskId)
  const handleEditTask = (taskId: string) => {
    const newTitle = prompt('Edit task title')
    if (!newTitle) return
    editTask(taskId, { title: newTitle })
  }

  return (
    <main className="kanban">
      <header className="kanban__header">
          <div className="kanban__heading">
          <h1 className="kanban__title">{project ? project.name : 'Kanban View'}</h1>
          <p className="kanban__subtitle">
            Project ID: {projectId ?? "none selected"}
          </p>
        </div>
        <section className="kanban__controls">
          <form onSubmit={(e) => handleAddTask(e)} className="kanban__addForm">
            <div className="detailsGroup">
              <input
                placeholder="New task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="kanban__input"
              />
              <select
                value={newTaskColumn}
                onChange={(e) => setNewTaskColumn(e.target.value)}
                className="kanban__select"
              >
                {columns.map((c) => (
                  <option value={c.id} key={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="kanban__button">
              Add
            </button>
          </form>
        </section>
      </header>

      <section className="kanban__board">
        {columns.map((col) => (
          <div
            key={col.id}
            className="kanban__column"
            onDragOver={onDragOver}
            onDrop={(e) => onDropOnColumn(e, col.id)}
          >
            <h3 className="kanban__columnTitle">
              {col.title}{" "}
              <span className="kanban__count">{col.tasks.length}</span>
            </h3>
            <div className="kanban__tasks">
              {col.tasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  className="kanban__card"
                  onDragStart={(e) => onDragStart(e, task.id, col.id)}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDropOnColumn(e, col.id, task.id)}
                >
                  <div className="kanban__cardHeader">
                    <strong>{task.title}</strong>
                    <div className="kanban__cardActions">
                      <button
                        onClick={() => handleEditTask(task.id)}
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        title="Delete"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                  {task.description && (
                    <p className="kanban__cardDesc">{task.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export const KanbanViewPage = KanbanView;
export default KanbanView;
