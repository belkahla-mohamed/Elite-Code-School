import { NextResponse } from "next/server";

export function validateContentType(request: Request): NextResponse | null {
  const ct = request.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) {
    return NextResponse.json({ error: "Content-Type doit être application/json" }, { status: 415 });
  }
  return null;
}

export function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
