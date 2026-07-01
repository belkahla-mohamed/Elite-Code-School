import { randomBytes } from "crypto";

const globalLog = globalThis as unknown as { ecsActivityLog?: ActivityEntry[] };

export type ActivityEntry = {
  id: string;
  type: "student" | "project" | "certification" | "request";
  action: string;
  description: string;
  createdAt: string;
};

export function addActivity(type: ActivityEntry["type"], action: string, description: string) {
  if (!globalLog.ecsActivityLog) globalLog.ecsActivityLog = [];
  globalLog.ecsActivityLog.unshift({
    id: `act-${Date.now()}-${randomBytes(4).toString("hex")}`,
    type,
    action,
    description,
    createdAt: new Date().toISOString(),
  });
  // Keep max 200 entries
  if (globalLog.ecsActivityLog.length > 200) {
    globalLog.ecsActivityLog = globalLog.ecsActivityLog.slice(0, 200);
  }
}

export function getActivityLog(limit = 50): ActivityEntry[] {
  return (globalLog.ecsActivityLog ?? []).slice(0, limit);
}

export function getFilteredActivityLog(opts: {
  limit?: number;
  type?: ActivityEntry["type"] | "all";
  search?: string;
}): ActivityEntry[] {
  let entries = globalLog.ecsActivityLog ?? [];
  if (opts.type && opts.type !== "all") {
    entries = entries.filter((e) => e.type === opts.type);
  }
  if (opts.search?.trim()) {
    const q = opts.search.toLowerCase();
    entries = entries.filter(
      (e) =>
        e.action.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
    );
  }
  return entries.slice(0, opts.limit ?? 50);
}
