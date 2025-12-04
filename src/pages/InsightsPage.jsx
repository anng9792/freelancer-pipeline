import { useProjects } from "../hooks/useProjects.js";

export function InsightsPage() {
  const { projects, stages } = useProjects();

  const countByStage = stages.map((stage) => ({
    stage,
    count: projects.filter((p) => p.stage === stage).length,
  }));

  const totalBudget = projects.reduce((sum, p) => {
    const num = parseFloat(String(p.budget).replace(/[^0-9.]/g, ""));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Insights</h1>
      </div>

      <div className="card" style={{ display: "grid", gap: 16 }}>
        <div style={{ display: "flex", gap: 16 }}>
          <div className="card" style={{ flex: 1, padding: 12 }}>
            <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
              Active projects
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: 600 }}>
              {projects.length}
            </div>
          </div>
          <div className="card" style={{ flex: 1, padding: 12 }}>
            <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
              Total budget (raw)
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: 600 }}>
              ${totalBudget.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 12 }}>
          <div
            style={{
              fontSize: "0.9rem",
              fontWeight: 500,
              marginBottom: 8,
            }}
          >
            Projects per stage
          </div>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              fontSize: "0.85rem",
            }}
          >
            {countByStage.map((item) => (
              <li
                key={item.stage}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#4b5563",
                }}
              >
                <span>{item.stage}</span>
                <span>{item.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
