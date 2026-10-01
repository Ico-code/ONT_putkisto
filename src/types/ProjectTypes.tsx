// Shared TypeScript types for projects and Kanban data

export type Project = {
  id: string;
  name: string;
  isActive?: boolean;
  lastVisited?: number;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
};

export type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

export type BoardState = Column[];
