#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const CTFtime_API_BASE = "https://ctftime.org/api/v1";

async function getJson<T>(url: string): Promise<T> {
	const res = await fetch(url, {
		headers: {
			Accept: "application/json",
			// CTFtime doesn't require a UA header for this API, but it helps with debugging and etiquette.
			"User-Agent": "mcp-ctftime/0.1.0 (+https://ctftime.org/api/)",
		},
	});
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(
			`CTFtime API error ${res.status} for ${url}${
				text ? `: ${text.slice(0, 300)}` : ""
			}`
		);
	}
	return (await res.json()) as T;
}

function qs(params: Record<string, string | number | undefined>): string {
	const u = new URLSearchParams();
	for (const [k, v] of Object.entries(params)) {
		if (v === undefined) continue;
		u.set(k, String(v));
	}
	const s = u.toString();
	return s ? `?${s}` : "";
}

const server = new McpServer({
	name: "ctftime",
	version: "0.1.0",
});

// Tools

server.registerTool(
	"ctftime_events",
	{
		description:
			"List CTFtime events in a time window. Uses UNIX timestamps (seconds) for start/finish; returns past and upcoming events.",
		inputSchema: {
			limit: z
				.number()
				.int()
				.min(1)
				.max(100)
				.default(20)
				.describe("Max events (1-100)."),
			start: z
				.number()
				.int()
				.optional()
				.describe("UNIX timestamp (seconds) for window start."),
			finish: z
				.number()
				.int()
				.optional()
				.describe("UNIX timestamp (seconds) for window finish."),
		},
	},
	async ({ limit, start, finish }) => {
		const url = `${CTFtime_API_BASE}/events/${qs({ limit, start, finish })}`;
		const data = await getJson<any[]>(url);

		// Lightly normalize for LLM consumption (keep original fields too).
		const normalized = data.map((e) => ({
			id: e.id,
			title: e.title,
			url: e.url,
			start: e.start,
			finish: e.finish,
			format: e.format,
			onsite: e.onsite,
			weight: e.weight,
			restrictions: e.restrictions,
			ctftime_url: e.ctftime_url,
			organizers: e.organizers,
			location: e.location,
		}));

		return {
			content: [{ type: "text", text: JSON.stringify(normalized, null, 2) }],
		};
	}
);

server.registerTool(
	"ctftime_event",
	{
		description: "Get full details for a specific CTFtime event by event_id.",
		inputSchema: {
			event_id: z.number().int().min(1).describe("CTFtime event id."),
		},
	},
	async ({ event_id }) => {
		const url = `${CTFtime_API_BASE}/events/${event_id}/`;
		const data = await getJson<any>(url);
		return {
			content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
		};
	}
);

server.registerTool(
	"ctftime_top_teams",
	{
		description: "Get top teams for a year (or current year if year omitted).",
		inputSchema: {
			year: z
				.number()
				.int()
				.min(2011)
				.max(2100)
				.optional()
				.describe("Year (e.g., 2025)."),
			limit: z
				.number()
				.int()
				.min(1)
				.max(100)
				.default(10)
				.describe("Max teams (1-100)."),
		},
	},
	async ({ year, limit }) => {
		const base = year
			? `${CTFtime_API_BASE}/top/${year}/`
			: `${CTFtime_API_BASE}/top/`;
		const url = `${base}${qs({ limit })}`;
		const data = await getJson<any[]>(url);
		return {
			content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
		};
	}
);

server.registerTool(
	"ctftime_top_by_country",
	{
		description:
			"Get top teams for the current year by country (ISO 3166-1 alpha-2 country code, lowercase).",
		inputSchema: {
			country_code: z
				.string()
				.min(2)
				.max(2)
				.describe("Country code (e.g., 'pl', 'us', 'de')."),
		},
	},
	async ({ country_code }) => {
		const code = country_code.toLowerCase();
		const url = `${CTFtime_API_BASE}/top-by-country/${code}/`;
		const data = await getJson<any[]>(url);
		return {
			content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
		};
	}
);

server.registerTool(
	"ctftime_team",
	{
		description: "Get information about a specific team by team_id.",
		inputSchema: {
			team_id: z.number().int().min(1).describe("CTFtime team id."),
		},
	},
	async ({ team_id }) => {
		const url = `${CTFtime_API_BASE}/teams/${team_id}/`;
		const data = await getJson<any>(url);
		return {
			content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
		};
	}
);

server.registerTool(
	"ctftime_results",
	{
		description: "Get event results for a year (or current year if omitted).",
		inputSchema: {
			year: z
				.number()
				.int()
				.min(2011)
				.max(2100)
				.optional()
				.describe("Year (e.g., 2025)."),
		},
	},
	async ({ year }) => {
		const url = year
			? `${CTFtime_API_BASE}/results/${year}/`
			: `${CTFtime_API_BASE}/results/`;
		const data = await getJson<any>(url);
		return {
			content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
		};
	}
);

server.registerTool(
	"ctftime_votes",
	{
		description: "Get event votes for a year.",
		inputSchema: {
			year: z.number().int().min(2011).max(2100).describe("Year (e.g., 2025)."),
		},
	},
	async ({ year }) => {
		const url = `${CTFtime_API_BASE}/votes/${year}/`;
		const data = await getJson<any>(url);
		return {
			content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
		};
	}
);

async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("mcp-ctftime running on stdio");
}

main().catch((err) => {
	console.error("Fatal error:", err);
	process.exit(1);
});
