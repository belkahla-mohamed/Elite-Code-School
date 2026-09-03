const B = "http://localhost:3000";
const post = async (p, b) => {
  const r = await fetch(B + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) });
  return { s: r.status, j: await r.json().catch(() => ({})), headers: r.headers };
};

(async () => {
  await post("/api/auth/parent/forgot-password", { email: "parent.youssef@example.com" });
  const la = await post("/api/auth/admin", { email: "admin@elitecodeschool.com", password: "admin123" });
  console.log("Admin login status:", la.s);
  const cookie = la.headers.getSetCookie().map(c => c.split(";")[0]).join("; ");
  console.log("Cookie présent:", cookie.length > 0);
  const lg = await fetch(B + "/api/activity-log", { headers: { cookie } });
  console.log("Activity log status:", lg.s);
  const ld = await lg.json();
  const entries = ld.entries ?? ld.log ?? ld;
  console.log("Nb entries:", Array.isArray(entries) ? entries.length : "?");
  if (Array.isArray(entries)) {
    entries.slice(0, 5).forEach(e => console.log("-", e.type ?? "?", "|", (e.action ?? "?"), "|", (e.description ?? "").slice(0, 80)));
  }
  const s = JSON.stringify(ld);
  console.log("Contient 'SIMULÉ':", s.includes("SIMUL"));
  console.log("Contient 'réinitialisation':", s.includes("initialisation"));
  const idx = s.lastIndexOf("reset=");
  console.log("reset= trouvé:", idx >= 0);
  if (idx < 0) return;
  const rest = s.slice(idx + 6);
  const token = rest.split('"')[0].split("\\")[0].trim();
  console.log("Token:", token.slice(0, 12) + "...");

  const rp = await post("/api/auth/parent/reset-password", { token, password: "NouveauPass2026" });
  console.log("1. Reset password:", rp.s, rp.j.message ?? rp.j.error);

  const reuse = await post("/api/auth/parent/reset-password", { token, password: "AutrePass2026" });
  console.log("2. Réutilisation token (doit échouer):", reuse.s, reuse.j.error);

  const li = await post("/api/auth/parent", { email: "parent.youssef@example.com", password: "NouveauPass2026" });
  console.log("3. Login nouveau mot de passe:", li.s, li.j.user?.role ?? li.j.error);

  const lo = await post("/api/auth/parent", { email: "parent.youssef@example.com", secret: "YOUSEEF-2026" });
  console.log("4. Login secret legacy (doit marcher):", lo.s, lo.j.user?.role ?? "FAIL");
})().catch(e => console.log("FAIL", e.message));
