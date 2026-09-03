import { hashPassword, verifyPassword } from "../lib/passwords";
import { createParentPasswordReset, consumeParentPasswordReset, setParentPassword, getParentByEmail, getParentByPassword, getParentByLogin } from "../lib/store";
import { hashSecret } from "../lib/auth";

async function main() {
  console.log("=== Test logic password flow (demo store) ===");

  const h = await hashPassword("NouveauPass2026");
  console.log("1. hashPassword format:", h.startsWith("scrypt:") ? "OK (scrypt)" : "FAIL");
  console.log("2. verifyPassword (bon mot de passe):", await verifyPassword("NouveauPass2026", h));
  console.log("3. verifyPassword (mauvais):", await verifyPassword("Faux", h));

  const parent = await getParentByEmail("parent.youssef@example.com");
  console.log("4. getParentByEmail:", parent ? `OK (${parent.email}, passwordHash: ${parent.passwordHash ?? "aucun"})` : "FAIL");
  if (!parent) return;

  const token = "tokentest-" + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  const expires = new Date(Date.now() + 3_600_000).toISOString();
  await createParentPasswordReset(parent.id, hashSecret(token), expires);
  console.log("5. createParentPasswordReset: OK");

  const parentId = await consumeParentPasswordReset(hashSecret(token));
  console.log("6. consumeParentPasswordReset (valide):", parentId === parent.id ? "OK" : "FAIL");
  const reuse = await consumeParentPasswordReset(hashSecret(token));
  console.log("7. consumeParentPasswordReset (réutilisation):", reuse === null ? "OK (rejeté)" : "FAIL");

  await setParentPassword(parent.id, h);
  const updated = await getParentByEmail(parent.email);
  console.log("8. setParentPassword persisté:", updated?.passwordHash ? "OK" : "FAIL");

  const byPassword = await getParentByPassword(parent.email, "NouveauPass2026");
  console.log("9. getParentByPassword (bon):", byPassword ? `OK (student: ${byPassword.student.firstName})` : "FAIL");
  const byWrongPassword = await getParentByPassword(parent.email, "FauxPass");
  console.log("10. getParentByPassword (mauvais):", byWrongPassword === null ? "OK (rejeté)" : "FAIL");

  const bySecret = await getParentByLogin(parent.email, "YOUSEEF-2026");
  console.log("11. getParentByLogin legacy secret:", bySecret ? "OK" : "FAIL");
}

main().then(() => process.exit(0)).catch(e => { console.error("FAIL:", e.message); process.exit(1); });
