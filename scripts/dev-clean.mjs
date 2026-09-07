import { execSync, spawn } from "node:child_process"
import { rmSync } from "node:fs"

function pidsOnPort(port) {
  try {
    const out = execSync(`netstat -ano | findstr :${port} | findstr LISTENING`, { shell: true }).toString()
    return [...new Set(out.split("\n").map((l) => l.trim().split(/\s+/).pop()).filter(Boolean))]
  } catch {
    return []
  }
}

for (const pid of pidsOnPort(3000)) {
  try {
    execSync(`taskkill /PID ${pid} /T /F`, { stdio: "ignore" })
    console.log(`killed stale server on port 3000 (pid ${pid})`)
  } catch {}
}

rmSync(".next", { recursive: true, force: true })
console.log(".next removed — starting fresh dev server...")

spawn("npm", ["run", "dev"], { stdio: "inherit", shell: true })
