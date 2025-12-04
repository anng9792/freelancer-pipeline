import { useMemo, useState } from "react";
import { useProjects } from "../hooks/useProjects.js";
import { ProjectDetailDrawer } from "../components/ProjectDetailDrawer.jsx";

const STAGE_COLORS = {
  Inquiry: "#6B7280",
  Booked: "#10B981",
  "Discovery Call": "#e587d5ff",
  "Proposal Sent": "#e3e587ff",
  Shooting: "#3B82F6",
  Editing: "#8B5CF6",
  Delivered: "#F59E0B",
};

function getMonthMatrix(baseDate) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const firstWeekday = firstOfMonth.getDay();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];

  for (let i = firstWeekday - 1; i >= 0; i -= 1) {
    const dayNum = daysInPrevMonth - i;
    const date = new Date(year, month - 1, dayNum);
    cells.push({ date, inCurrentMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    cells.push({ date, inCurrentMonth: true });
  }

  while (cells.length < 42) {
    const last = cells[cells.length - 1].date;
    const next = new Date(
      last.getFullYear(),
      last.getMonth(),
      last.getDate() + 1
    );
    cells.push({ date: next, inCurrentMonth: false });
  }

  return cells;
}

function formatISO(date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function CalendarPage() {
  const { projects, stages, updateProject, deleteProject, moveProject } =
    useProjects();

  const [monthStart, setMonthStart] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [selectedId, setSelectedId] = useState(null);

  function goToPrevMonth() {
    setMonthStart(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  }

  function goToNextMonth() {
    setMonthStart(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  }

  const monthMatrix = useMemo(() => getMonthMatrix(monthStart), [monthStart]);

  const projectsByDate = useMemo(() => {
    const map = {};
    projects.forEach((p) => {
      if (p.shootDate) {
        const iso = p.shootDate;
        if (!map[iso]) map[iso] = [];
        map[iso].push({ ...p, _calendarKind: "shoot" });
      }
      if (p.dueDate) {
        const iso = p.dueDate;
        if (!map[iso]) map[iso] = [];
        map[iso].push({ ...p, _calendarKind: "due" });
      }
    });
    return map;
  }, [projects]);

  const monthLabel = monthStart.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Calendar</h1>
        <div className="calendar-header">
          <button
            type="button"
            className="button secondary calendar-nav"
            onClick={goToPrevMonth}
          >
            ‹
          </button>
          <div className="calendar-title">{monthLabel}</div>
          <button
            type="button"
            className="button secondary calendar-nav"
            onClick={goToNextMonth}
          >
            ›
          </button>
        </div>
      </div>

      {/* Calendar stays full width */}
      <div className="card calendar-card">
        <div className="calendar-grid">
          {weekdayLabels.map((label) => (
            <div key={label} className="calendar-weekday">
              {label}
            </div>
          ))}

          {monthMatrix.map(({ date, inCurrentMonth }, idx) => {
            const iso = formatISO(date);
            const dayProjects = projectsByDate[iso] || [];

            return (
              <div
                key={iso + idx}
                className={
                  "calendar-day" +
                  (inCurrentMonth ? "" : " calendar-day--muted")
                }
              >
                <div className="calendar-day-number">{date.getDate()}</div>

                <div className="calendar-day-projects">
                  {dayProjects.map((p, i) => (
                    <div
                      key={p.id + "-" + (p._calendarKind || "shoot") + "-" + i}
                      className="calendar-project-pill"
                      title={p.clientName}
                      onClick={() => setSelectedId(p.id)}
                    >
                      <span
                        className="calendar-project-dot"
                        style={{
                          background: STAGE_COLORS[p.stage] || "#6B7280",
                        }}
                      ></span>

                      <div className="calendar-project-client">
                        {p.clientName}
                      </div>

                      <div className="calendar-project-type">
                        {p.projectType || ""}
                        {p._calendarKind === "due" && (
                          <span className="calendar-project-due-tag">Due</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal-style overlay for detail card */}
      {selectedId && (
        <div className="detail-overlay" onClick={() => setSelectedId(null)}>
          <div
            className="detail-overlay-panel"
            onClick={(e) => e.stopPropagation()}
          >
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
        </div>
      )}
    </>
  );
}
