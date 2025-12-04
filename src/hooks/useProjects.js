import { useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";

const STAGES = [
  "Inquiry",
  "Discovery Call",
  "Proposal Sent",
  "Booked",
  "Shooting",
  "Editing",
  "Delivered",
];

function createProjectId() {
  return crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
}

export function useProjects() {
  const [projects, setProjects] = useLocalStorage("fp-projects", []);

  function addProject(data) {
    const project = {
      id: createProjectId(),
      clientName: data.clientName || "",
      projectType: data.projectType || "",
      email: data.email || "",
      phone: data.phone || "",
      stage: data.stage || "Inquiry",
      budget: data.budget || "",
      shootDate: data.shootDate || "",
      dueDate: data.dueDate || "",         
      location: data.location || "",
      invoiceStatus: data.invoiceStatus || "Pending",
      contractStatus: data.contractStatus || "Not sent",
      notes: data.notes || "",
      createdAt: new Date().toISOString(),
    };
    setProjects((prev) => [...prev, project]);
  }

  function updateProject(id, updates) {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }

  function deleteProject(id) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  function moveProject(id, newStage) {
    updateProject(id, { stage: newStage });
  }

  const projectsByStage = useMemo(() => {
    const map = {};
    STAGES.forEach((s) => (map[s] = []));
    projects.forEach((p) => {
      const stage = STAGES.includes(p.stage) ? p.stage : "Inquiry";
      map[stage].push(p);
    });
    return map;
  }, [projects]);

  return {
    stages: STAGES,
    projects,
    projectsByStage,
    addProject,
    updateProject,
    deleteProject,
    moveProject,
  };
}
