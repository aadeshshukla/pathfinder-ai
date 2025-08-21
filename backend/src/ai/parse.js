// Parses AI output into structured JSON
// Strict JSON parse with basic shape checks
export function parseRoadmapJSON(text) {
    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();
  
    let obj;
    try {
      obj = JSON.parse(cleaned);
    } catch {
      throw new Error("Model did not return valid JSON");
    }
  
    if (!obj || typeof obj !== "object") throw new Error("Invalid JSON root");
    if (!Array.isArray(obj.milestones)) throw new Error("milestones must be an array");
    if (!obj.timeline || typeof obj.timeline.totalDays !== "number")
      throw new Error("timeline.totalDays missing or invalid");
    if (!Array.isArray(obj.resources)) throw new Error("resources must be an array");
    if (!Array.isArray(obj.tips)) throw new Error("tips must be an array");
  
    // Normalize
    obj.milestones = obj.milestones.map((m, i) => ({
      id: String(m.id || `m-${i + 1}`),
      title: String(m.title || `Milestone ${i + 1}`),
      description: String(m.description || ""),
      estimatedDays: Number.isFinite(m.estimatedDays) ? Math.round(m.estimatedDays) : 7,
      tasks: Array.isArray(m.tasks) ? m.tasks.map(String) : [],
    }));
  
    obj.resources = obj.resources.map((r) => ({
      name: String(r.name || ""),
      type: ["course", "doc", "video", "tool", "repo"].includes(r.type) ? r.type : "doc",
      link: String(r.link || ""),
    }));
  
    obj.tips = obj.tips.map(String);
  
    return obj;
  }
 