import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import KanbanView from "./pages/KanbanView/KanbanView.tsx";
import { DashboardView } from "./pages/Dashboard/Dashboard.tsx";
import LoginView from "./pages/login/loginView.tsx";
import NotFoundView from "./pages/NotFoundView/NotFoundView.tsx";
import DefaultLayout from "./components/layout/DefaultLayout";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      {/* All routes wrapped with a shared layout */}
      <Route element={<DefaultLayout />}> 
        <Route path="/" element={<DashboardView />} />
        <Route path="/projects/:projectId" element={<KanbanView />} />
        <Route path="/Kanban" element={<KanbanView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="*" element={<NotFoundView />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
