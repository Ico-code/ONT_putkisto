import React, { useState } from "react";
// Changed to a standard global CSS import
import "./Sidebar.css";
import {
  LayoutDashboard,
  FolderKanban,
  Plus,
  GitMerge,
  PanelRightOpen,
} from "lucide-react";
import { NavLink } from "react-router";
import type { Project } from "../../../types/ProjectTypes";

interface SidebarProps {
  projects?: Project[]; // Optional, defaults to MOCK_PROJECTS
  activeRoute: string; // Used for highlighting the current section
  isCollapsed?: boolean; // Controlled collapsed state
  onToggleCollapsed?: () => void; // Toggle handler passed from parent
}

import useProjects from "../../../hooks/useProjects";
import NewProjectModal from "../../../modals/NewProjectModal";
import { useNavigate } from "react-router";

export const Sidebar: React.FC<SidebarProps> = ({
  projects,
  activeRoute,
  isCollapsed = false,
  onToggleCollapsed,
}) => {
  // Icon size consistency
  const projectIconSize = 16;

  const getLinkClass = (path: string) => {
    // Use direct class names with template literals
    return `navLink ${activeRoute === path ? "active" : ""}`;
  };
  // controlled state; toggle passed via props
  const toggleCollapsed = () => onToggleCollapsed?.();

  const { projects: hookProjects, addProject } = useProjects();
  const displayProjects = projects ?? hookProjects;
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="logo">
        <GitMerge size={projectIconSize} className="linkIcon" />
        TaskFlow
      </div>
      <div className="sidebarContent">
        <div className="navSection">
          <div className="sideNavHeader">
            <p className="navSectionTitle">Menu</p>
            <button
              className="collapseSidenav"
              onClick={toggleCollapsed}
              aria-expanded={!isCollapsed}
              aria-label={isCollapsed ? "Open sidebar" : "Collapse sidebar"}
              title={isCollapsed ? "Open sidebar" : "Collapse sidebar"}
            >
              <PanelRightOpen size={16} />
            </button>
          </div>

          <NavLink to="/" className={getLinkClass("/")}>
            <LayoutDashboard size={projectIconSize} className="linkIcon" />
            <p style={isCollapsed ? { display: "none" } : {}}>Dashboard</p>
          </NavLink>
        </div>

        <div className="menuSection">
          <div className="projectsHeader">
            <p className="navSectionTitle noBottomMargin">Projects</p>
            <button
              className="controlButton mutedText"
              onClick={() => setIsNewProjectOpen(true)}
              aria-label="Create new project"
              title="Create new project"
            >
              <Plus size={projectIconSize} />
            </button>
          </div>

          <div className="projectList">
            {displayProjects.map((p) => (
              <NavLink
                key={p.id}
                to={`/projects/${p.id}`}
                className={getLinkClass(`/projects/${p.id}`)}
              >
                <FolderKanban
                  size={projectIconSize}
                  className="linkIcon projectIcon"
                />
                <span className="linkText">{p.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onCreate={(name: string) => {
          const id = `p_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
          const proj = { id, name, isActive: true };
          addProject(proj);
          setIsNewProjectOpen(false);
          navigate(`/projects/${id}`);
        }}
      />
    </aside>
  );
};
