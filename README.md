# mcp-ctftime

An MCP (Model Context Protocol) server that wraps the public **CTFtime API**.

## Tools

- `ctftime_events(limit?, start?, finish?)` – list events in a UNIX timestamp window
- `ctftime_event(event_id)` – event details
- `ctftime_top_teams(year?, limit?)` – top teams
- `ctftime_top_by_country(country_code)` – top teams by country (current year)
- `ctftime_team(team_id)` – team details
- `ctftime_results(year?)` – event results
- `ctftime_votes(year)` – event votes

## Install / build

```bash
npm install
npm run build
```

## Run

```bash
node build/index.js
```

## Claude Desktop config example

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ctftime": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/mcp-ctftime/build/index.js"]
    }
  }
}
```

## Notes

- This uses the public API documented by CTFtime: https://ctftime.org/api/
- Don’t use the API to run a CTFtime clone; CTFtime explicitly asks users not to.
