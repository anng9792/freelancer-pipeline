import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../hooks/useProjects.js";
import { ProjectDetailDrawer } from "../components/ProjectDetailDrawer.jsx";

function formatBudget(value) {
  if (!value) return "$TBD";
  return `$${value}`;
}

const FIELD_CONFIG = [
  {
    key: "shootDate",
    label: "Date",
    bubbleClass: "bubble-date",
    format: (v) => (v ? new Date(v).toLocaleDateString() : "TBD"),
  },
  {
    key: "budget",
    label: "Budget",
    bubbleClass: "bubble-budget",
    format: (v) => formatBudget(v),
  },

  {
    key: "location",
    label: "Location",
    bubbleClass: "bubble-location",
    format: (v) => (v ? v : "TBD"),
  },
  {
    key: "invoiceStatus",
    label: "Invoice",
    bubbleClass: "bubble-invoice",
    format: (v) => (v ? v : "TBD"),
  },
  {
    key: "contractStatus",
    label: "Contract",
    bubbleClass: "bubble-contract",
    format: (v) => (v ? v : "TBD"),
  },
];

export function PipelinePage() {
  const {
    stages,
    projects,
    projectsByStage,
    moveProject,
    updateProject,
    deleteProject,
  } = useProjects();

  const [selectedId, setSelectedId] = useState(null);
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

  const navigate = useNavigate();

  function handleAddForStage(stage) {
    navigate("/new", {
      state: { defaultStage: stage },
    });
  }

  function handleDragStart(e, projectId) {
    setDraggedId(projectId);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragEnd() {
    setDraggedId(null);
    setDragOverStage(null);
  }

  function handleDragOver(e, stage) {
    e.preventDefault();
    setDragOverStage(stage);
    e.dataTransfer.dropEffect = "move";
  }

  function handleDrop(e, stage) {
    e.preventDefault();
    if (draggedId) {
      moveProject(draggedId, stage);
    }
    setDraggedId(null);
    setDragOverStage(null);
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Pipeline</h1>
        <p style={{ color: "#6b7280", fontSize: "0.9rem" }}></p>
      </div>

      {/* Left: scrollable columns, Right: detail card */}
      <div className="pipeline-layout">
        <div className="pipeline-scroll-wrapper">
          <div className="pipeline-row">
            {stages.map((stage) => (
              <div key={stage} className="pipeline-column-shell">
                <div className="pipeline-column-header">
                  <div className="pipeline-column-title">{stage}</div>
                  <button
                    type="button"
                    className="column-add-button"
                    onClick={() => handleAddForStage(stage)}
                  >
                    + New
                  </button>
                </div>

                <div
                  className={
                    "pipeline-column" +
                    (dragOverStage === stage
                      ? " pipeline-column--dragover"
                      : "")
                  }
                  onDragOver={(e) => handleDragOver(e, stage)}
                  onDrop={(e) => handleDrop(e, stage)}
                >
                  {projectsByStage[stage].map((project) => (
                    <button
                      key={project.id}
                      type="button"
                      className={
                        "project-card" +
                        (draggedId === project.id
                          ? " project-card--dragging"
                          : "")
                      }
                      onClick={() => setSelectedId(project.id)}
                      draggable
                      onDragStart={(e) => handleDragStart(e, project.id)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="project-title-row">
                        <div className="project-name">{project.clientName}</div>
                        <span className="project-tag">
                          {project.projectType || "Project"}
                        </span>
                      </div>

                      {FIELD_CONFIG.map((field) => {
                        const value = project[field.key];

                        if (!value) return null;

                        return (
                          <div key={field.key} className="project-meta">
                            {field.label}{" "}
                            <span
                              className={`detail-bubble ${field.bubbleClass}`}
                            >
                              {field.format(value)}
                            </span>
                          </div>
                        );
                      })}
                    </button>
                  ))}

                  {projectsByStage[stage].length === 0 && (
                    <div className="pipeline-empty">
                      No projects in this stage.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedId && (
          <div className="card detail-card">
            <ProjectDetailDrawer
              selectedId={selectedId}
              projects={projects}
              stages={stages}
              onUpdate={updateProject}
              onDelete={deleteProject}
              onMove={moveProject}
              onClose={() => setSelectedId(null)}
            />
          </div>
        )}
      </div>
    </>
  );
}
