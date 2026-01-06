# mcp-ctftime

[![npm version](https://img.shields.io/npm/v/mcp-ctftime.svg)](https://www.npmjs.com/package/mcp-ctftime)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An MCP (Model Context Protocol) server that wraps the public **[CTFtime API](https://ctftime.org/api/)**, enabling AI assistants to query CTF events, teams, rankings, and results.

## Quickstart

### Option 1: npx (no install)

```bash
npx mcp-ctftime
```

### Option 2: Global install

```bash
npm install -g mcp-ctftime
mcp-ctftime
```

### Option 3: From source

```bash
git clone https://github.com/tomek7667/mcp-ctftime.git
cd mcp-ctftime
pnpm install
pnpm build
pnpm start
```

## Tools

| Tool                                      | Description                              |
| ----------------------------------------- | ---------------------------------------- |
| `ctftime_events(limit?, start?, finish?)` | List events in a UNIX timestamp window   |
| `ctftime_event(event_id)`                 | Get event details by ID                  |
| `ctftime_top_teams(year?, limit?)`        | Get top teams (current or specific year) |
| `ctftime_top_by_country(country_code)`    | Get top teams by country (current year)  |
| `ctftime_team(team_id)`                   | Get team details by ID                   |
| `ctftime_results(year?)`                  | Get event results for a year             |
| `ctftime_votes(year)`                     | Get event votes for a year               |

---

## Client Setup

### Claude Desktop

Claude Desktop supports MCP servers via a JSON configuration file.

**Config file location:**

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

**Using npx (recommended):**

```json
{
	"mcpServers": {
		"ctftime": {
			"command": "npx",
			"args": ["-y", "mcp-ctftime"]
		}
	}
}
```

**Using global install:**

```json
{
	"mcpServers": {
		"ctftime": {
			"command": "mcp-ctftime"
		}
	}
}
```

Restart Claude Desktop after editing the config.

---

### OpenAI Codex CLI

Codex CLI stores MCP configuration in `~/.codex/config.toml`.

**Using the CLI:**

```bash
codex mcp add ctftime -- npx -y mcp-ctftime
```

**Or edit `~/.codex/config.toml` directly:**

```toml
[mcp_servers.ctftime]
command = "npx"
args = ["-y", "mcp-ctftime"]
```

**Using global install:**

```toml
[mcp_servers.ctftime]
command = "mcp-ctftime"
```

Use `/mcp` in the Codex TUI to verify the server is connected.

---

### Amp

Amp supports MCP servers via the `amp.mcpServers` setting in VS Code `settings.json` or via CLI.

**Config file location (VS Code):**

- **macOS**: `~/Library/Application Support/Code/User/settings.json`
- **Windows**: `%APPDATA%\Code\User\settings.json`
- **Linux**: `~/.config/Code/User/settings.json`

**Using npx (recommended):**

```json
{
	"amp.mcpServers": {
		"ctftime": {
			"command": "npx",
			"args": ["-y", "mcp-ctftime"]
		}
	}
}
```

**Using global install:**

```json
{
	"amp.mcpServers": {
		"ctftime": {
			"command": "mcp-ctftime"
		}
	}
}
```

**Via CLI:**

```bash
amp mcp add ctftime npx -y mcp-ctftime
```

---

### Gemini CLI

Gemini CLI stores MCP configuration in `~/.gemini/settings.json`.

**Using npx (recommended):**

```json
{
	"mcpServers": {
		"ctftime": {
			"command": "npx",
			"args": ["-y", "mcp-ctftime"]
		}
	}
}
```

**Using global install:**

```json
{
	"mcpServers": {
		"ctftime": {
			"command": "mcp-ctftime"
		}
	}
}
```

**Via CLI:**

```bash
gemini mcp add ctftime npx -- -y mcp-ctftime
```

Use `/mcp` in Gemini CLI to verify server status.

---

## Docker

```bash
docker build -t mcp-ctftime .
docker run -i mcp-ctftime
```

For clients that support Docker-based MCP servers:

```json
{
	"mcpServers": {
		"ctftime": {
			"command": "docker",
			"args": ["run", "-i", "--rm", "mcp-ctftime"]
		}
	}
}
```

---

## Compatibility

| Feature   | Supported             |
| --------- | --------------------- |
| Transport | stdio                 |
| Node.js   | >=18.0.0              |
| Platforms | macOS, Linux, Windows |

### Tested Clients

| Client           | Status      |
| ---------------- | ----------- |
| Claude Desktop   | ✅ Verified |
| OpenAI Codex CLI | ✅ Verified |
| Amp              | ✅ Verified |
| Gemini CLI       | ✅ Verified |

---

## Environment Variables

Currently, this server does not require any environment variables. The CTFtime API is public and does not require authentication.

---

## Development

```bash
# Clone and install
git clone https://github.com/tomek7667/mcp-ctftime.git
cd mcp-ctftime
pnpm install

# Build
pnpm build

# Run
pnpm start

# Watch mode (auto-rebuild)
pnpm watch
```

---

## API Reference

This server wraps the public CTFtime API: https://ctftime.org/api/

All timestamps use UNIX epoch seconds. Country codes use ISO 3166-1 alpha-2 format (lowercase, e.g., `us`, `de`, `pl`).
