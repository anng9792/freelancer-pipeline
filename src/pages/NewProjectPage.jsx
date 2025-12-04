// src/pages/NewProjectPage.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useProjects } from "../hooks/useProjects.js";

export function NewProjectPage() {
  const { stages, addProject } = useProjects();
  const navigate = useNavigate();
  const location = useLocation();

  const defaultStage =
    location.state && location.state.defaultStage
      ? location.state.defaultStage
      : "Inquiry";

  const [form, setForm] = useState({
    clientName: "",
    projectType: "",
    email: "",
    phone: "",
    stage: defaultStage,
    budget: "",
    shootDate: "",
    dueDate: "",
    location: "",
    invoiceStatus: "Pending",
    contractStatus: "Not sent",
    notes: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.clientName.trim()) {
      alert("Please enter a client name");
      return;
    }
    addProject(form);
    navigate("/pipeline");
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">New project</h1>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label>Client name</label>
            <input
              className="input"
              name="clientName"
              value={form.clientName}
              onChange={handleChange}
              placeholder="Jane Doe"
            />
          </div>

          <div className="form-field">
            <label>Project type</label>
            <input
              className="input"
              name="projectType"
              value={form.projectType}
              onChange={handleChange}
              placeholder="Wedding, branding, event..."
            />
          </div>

          <div className="form-field">
            <label>Email</label>
            <input
              className="input"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jane@example.com"
            />
          </div>

          <div className="form-field">
            <label>Phone</label>
            <input
              className="input"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="form-field">
            <label>Shoot date</label>
            <input
              className="input"
              type="date"
              name="shootDate"
              value={form.shootDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>Due date</label>
            <input
              className="input"
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>Location</label>
            <input
              className="input"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Venue, city, etc."
            />
          </div>

          <div className="form-field">
            <label>Budget</label>
            <input
              className="input"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              placeholder="$"
            />
          </div>

          <div className="form-field">
            <label>Stage</label>
            <select
              className="select"
              name="stage"
              value={form.stage}
              onChange={handleChange}
            >
              {stages.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Invoice status</label>
            <input
              className="input"
              name="invoiceStatus"
              value={form.invoiceStatus}
              onChange={handleChange}
              placeholder="Pending, Sent, Paid..."
            />
          </div>

          <div className="form-field">
            <label>Contract status</label>
            <input
              className="input"
              name="contractStatus"
              value={form.contractStatus}
              onChange={handleChange}
              placeholder="Not sent, Sent, Signed..."
            />
          </div>
        </div>

        <div className="form-field" style={{ marginTop: 12 }}>
          <label>Notes</label>
          <textarea
            className="textarea"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Any important details, requests, or context."
          />
        </div>

        <div className="button-row">
          <button
            type="button"
            className="button secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button type="submit" className="button primary">
            Create project
          </button>
        </div>
      </form>
    </>
  );
}
