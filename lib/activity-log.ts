const globalLog = globalThis as unknown as { ecsActivityLog?: ActivityEntry[] };

export type ActivityEntry = {
  id: string;
  type: "student" | "project" | "certification" | "request" | "teacher";
  action: string;
  description: string;
  createdAt: string;
};

export function addActivity(type: ActivityEntry["type"], action: string, description: string) {
  if (!globalLog.ecsActivityLog) globalLog.ecsActivityLog = [];
  globalLog.ecsActivityLog.unshift({
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    action,
    description,
    createdAt: new Date().toISOString(),
  });
}

export function getActivityLog(limit = 20): ActivityEntry[] {
  return (globalLog.ecsActivityLog ?? []).slice(0, limit);
}
