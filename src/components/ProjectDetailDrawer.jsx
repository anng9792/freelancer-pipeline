// src/components/ProjectDetailDrawer.jsx
import { useEffect, useMemo, useState } from "react";

function formatBudget(value) {
  if (!value) return "$TBD";
  return `$${value}`;
}

export function ProjectDetailDrawer({
  selectedId,
  projects,
  stages,
  onUpdate,
  onDelete,
  onMove,
  onClose,
}) {
  const project = useMemo(
    () => projects.find((p) => p.id === selectedId),
    [projects, selectedId]
  );

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    if (project && !editing) {
      setDraft(project);
    }
  }, [project, editing]);

  if (!selectedId || !project) return null;

  const current = editing && draft ? draft : project;

  function handleEditStart() {
    setDraft(project);
    setEditing(true);
  }

  function handleFieldChange(e) {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  }

  function handleSave() {
    if (!draft) return;
    onUpdate(project.id, draft);
    setEditing(false);
  }

  function handleDelete() {
    if (confirm("Delete this project")) {
      onDelete(project.id);
      onClose();
    }
  }

  return (
    <div className="detail-drawer">
      <section>
        <h2 style={{ fontSize: "1.1rem", marginBottom: 8 }}>
          {current.clientName}
        </h2>
        <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: 12 }}>
          {current.projectType || "Untitled project"}
        </p>

        <div className="form-grid">
          <div className="form-field">
            <label>Client email</label>
            {editing ? (
              <input
                className="input"
                name="email"
                value={current.email}
                onChange={handleFieldChange}
              />
            ) : (
              <span className="detail-bubble bubble-phone">
                {current.phone || "Not set"}
              </span>
            )}
          </div>
          <div className="form-field">
            <label>Client phone</label>
            {editing ? (
              <input
                className="input"
                name="phone"
                value={current.phone}
                onChange={handleFieldChange}
              />
            ) : (
              <span className="detail-bubble bubble-phone">
                {current.phone || "Not set"}
              </span>
            )}
          </div>
          <div className="form-field">
            <label>Shoot date</label>
            {editing ? (
              <input
                className="input"
                type="date"
                name="shootDate"
                value={current.shootDate || ""}
                onChange={handleFieldChange}
              />
            ) : (
              <span className="detail-bubble bubble-date">
                {current.shootDate
                  ? new Date(current.shootDate).toLocaleDateString()
                  : "Not set"}
              </span>
            )}
          </div>
          <div className="form-field">
            <label>Due date</label>
            {editing ? (
              <input
                className="input"
                type="date"
                name="dueDate"
                value={current.dueDate || ""}
                onChange={handleFieldChange}
              />
            ) : (
              <span className="detail-bubble bubble-date">
                {current.dueDate
                  ? new Date(current.dueDate).toLocaleDateString()
                  : "TBD"}
              </span>
            )}
          </div>
          <div className="form-field">
            <label>Location</label>
            {editing ? (
              <input
                className="input"
                name="location"
                value={current.location}
                onChange={handleFieldChange}
              />
            ) : (
              <span className="detail-bubble bubble-location">
                {current.location || "Not set"}
              </span>
            )}
          </div>

          <div className="form-field">
            <label>Budget</label>
            {editing ? (
              <div className="input-dollar-wrapper">
                <span className="input-dollar-sign">$</span>
                <input
                  className="input input-dollar-field"
                  name="budget"
                  value={current.budget || ""}
                  onChange={handleFieldChange}
                />
              </div>
            ) : (
              <span className="detail-bubble bubble-budget">
                {formatBudget(current.budget)}
              </span>
            )}
          </div>

          <div className="form-field">
            <label>Stage</label>
            {editing ? (
              <select
                className="select"
                name="stage"
                value={current.stage}
                onChange={handleFieldChange}
              >
                {stages.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            ) : (
              <span className="detail-bubble bubble-stage">
                {current.stage}
              </span>
            )}
          </div>

          <div className="form-field">
            <label>Invoice status</label>
            {editing ? (
              <input
                className="input"
                name="invoiceStatus"
                value={current.invoiceStatus}
                onChange={handleFieldChange}
              />
            ) : (
              <span className="detail-bubble bubble-invoice">
                {current.invoiceStatus}
              </span>
            )}
          </div>
          <div className="form-field">
            <label>Contract status</label>
            {editing ? (
              <input
                className="input"
                name="contractStatus"
                value={current.contractStatus}
                onChange={handleFieldChange}
              />
            ) : (
              <span className="detail-bubble bubble-contract">
                {current.contractStatus}
              </span>
            )}
          </div>
        </div>

        <div className="form-field" style={{ marginTop: 12 }}>
          <label>Notes</label>
          {editing ? (
            <textarea
              className="textarea"
              name="notes"
              value={current.notes}
              onChange={handleFieldChange}
            />
          ) : (
            <div className="bubble-notes">
              {current.notes || "No notes yet."}
            </div>
          )}
        </div>

        <div className="button-row">
          {editing ? (
            <>
              <button
                className="button secondary"
                type="button"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
              <button
                className="button primary"
                type="button"
                onClick={handleSave}
              >
                Save changes
              </button>
            </>
          ) : (
            <>
              <button
                className="button secondary"
                type="button"
                onClick={handleEditStart}
              >
                Edit
              </button>
              <button
                className="button danger"
                type="button"
                onClick={handleDelete}
              >
                Delete
              </button>
            </>
          )}
          <button className="button" type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </section>

      <section className="card">
        <h3 style={{ fontSize: "1rem", marginBottom: 8 }}>Quick stage move</h3>
        <p
          style={{
            fontSize: "0.8rem",
            color: "#6b7280",
            marginBottom: 12,
          }}
        >
          Move this project around in your pipeline.
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {stages.map((s) => (
            <button
              key={s}
              type="button"
              className={
                "button stage-button" +
                (s === current.stage ? " primary selected" : " secondary")
              }
              onClick={() => onMove(project.id, s)}
            >
              {s}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
