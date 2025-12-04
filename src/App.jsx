import { NavLink, Route, Routes, Navigate } from "react-router-dom";
import { PipelinePage } from "./pages/PipelinePage.jsx";
import { CalendarPage } from "./pages/CalendarPage.jsx";
import { InsightsPage } from "./pages/InsightsPage.jsx";
import { NewProjectPage } from "./pages/NewProjectPage.jsx";

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">Freelancer Flow</div>
        <nav className="nav">
          <NavLink
            to="/pipeline"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            🗂 Pipeline
          </NavLink>
          <NavLink
            to="/calendar"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            📅 Calendar
          </NavLink>
          <NavLink
            to="/new"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            ➕ New project
          </NavLink>
          <NavLink
            to="/insights"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            📊 Insights
          </NavLink>
        </nav>
      </aside>
      <main className="main">
        <Routes>
          <Route path="/" element={<Navigate to="/pipeline" replace />} />
          <Route path="/pipeline" element={<PipelinePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/new" element={<NewProjectPage />} />
          <Route path="/insights" element={<InsightsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
