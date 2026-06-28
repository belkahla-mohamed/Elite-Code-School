# Custom Agent Context

## MCP Servers Available
See `.mcp.json` in project root for configured MCP servers:
- **github** — GitHub integration (issues, PRs, code review)
- **supabase** — Supabase database inspection
- **playwright** — Browser testing
- **postgres** — Direct PostgreSQL queries

## MCP Credentials Required
Credentials are stored in `.env` file using environment variable substitution in `.mcp.json`.
