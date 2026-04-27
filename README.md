# AdButler MCP Server

[![npm](https://img.shields.io/npm/v/@adbutler/mcp-server.svg)](https://www.npmjs.com/package/@adbutler/mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Manage your entire AdButler account from any AI assistant — Claude, ChatGPT, Cursor, Windsurf, Cline, and any other [Model Context Protocol](https://modelcontextprotocol.io) client.

This MCP server exposes the **full AdButler v2 API** — 600+ tools covering advertisers, campaigns, zones, creatives, placements, VAST video ads, programmatic / RTB, reporting, targeting, drafts, contracts, product catalogs, and more — plus 9 pre-built workflow prompts that walk an AI through common tasks like launching a campaign or setting up retail media.

## What you can ask

> "Create a new campaign for Pepsi targeting users in Canada with a $5,000 lifetime budget, and assign it to my Homepage Banner zone."

> "Show me the top 10 underperforming ad items in the last 7 days by CTR."

> "Set up a VAST 4.2 pre-roll campaign with a 30-second skippable creative and three companion banners."

> "Walk me through creating a new programmatic deal."

> "Audit my ad units — which zones have no active placements?"

The AI translates these into the right sequence of AdButler API calls, runs them, and shows you the result.

## Install

You have two options. **Most users want the hosted version** — zero setup, just paste a URL.

### Option A — Hosted (recommended)

Use AdButler's hosted MCP server. No install, no Node, no npm.

| Client | Configuration |
|--------|---------------|
| **Claude Desktop / Code** | Add an MCP server with type `sse`, URL `https://mcp.adbutler.com/sse`, and header `Authorization: Bearer YOUR_ADBUTLER_API_KEY` |
| **Cursor** | Settings → Features → Model Context Protocol → Add server with the URL + auth header above |
| **Any MCP client** | SSE endpoint: `https://mcp.adbutler.com/sse` — pass your API key via `Authorization: Bearer …` or `?api_key=…` query param |

### Option B — Local stdio (npm)

Run the server locally as a Node process. Useful if you want to keep your API key out of any external service or run against a self-hosted AdButler.

#### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "adbutler": {
      "command": "npx",
      "args": ["-y", "@adbutler/mcp-server"],
      "env": {
        "ADBUTLER_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

#### Claude Code

```bash
claude mcp add adbutler --env ADBUTLER_API_KEY=your_api_key_here -- npx -y @adbutler/mcp-server
```

#### Cursor / Windsurf / Cline

Add to the client's MCP config:

```json
{
  "mcpServers": {
    "adbutler": {
      "command": "npx",
      "args": ["-y", "@adbutler/mcp-server"],
      "env": { "ADBUTLER_API_KEY": "your_api_key_here" }
    }
  }
}
```

## Get your AdButler API key

AdButler Dashboard → **Settings → API Keys** → create a new key. It's the same key the AdButler v2 REST API uses.

## What's included

### 9 workflow prompts

Pre-built skill prompts that guide the AI through complete workflows end-to-end. Invoke them as MCP prompts (`/launch-campaign` etc.) from your client.

| Prompt | What it does |
|--------|--------------|
| `launch-campaign` | Walks an end-to-end campaign launch — advertiser → campaign → ad items → creatives → targeting → placements |
| `retail-media-setup` | Sets up sponsored products / retail media for an e-commerce site |
| `reporting` | Generates a custom report with the right dimensions and filters |
| `vast-video` | Builds a VAST video ad with linear + companion creatives |
| `programmatic` | Configures programmatic deals, bidders, and demand sources |
| `targeting` | Builds geo / platform / data-key / list targets |
| `contracts` | Creates IO contracts and assigns them to campaigns |
| `channels` | Bundles zones into a channel and assigns campaigns |
| `drafts` | Stages a complete campaign as drafts before going live |

### 600+ tools across the full AdButler API

| Domain | Tools | Examples |
|--------|------:|----------|
| **Display ads** | 100+ | `list_advertisers`, `create_campaign`, `create_image_ad_item`, `create_native_ad_item`, `create_placement`, `create_schedule`, `create_campaign_assignment` |
| **VAST 2/3/4 video** | 156 | `vast_create_creative`, `vast_create_linear_media`, `vast_create_companion`, `vast_create_placement`, `vast_create_schedule`, plus full VAST 4.2 sub-resource coverage |
| **Zones & publishing** | 50+ | `create_zone`, `create_zone_catalog`, `create_zone_email`, `create_native_template`, `create_publisher`, ORTB native assets |
| **Targeting** | 37 | `create_geo_target`, `create_platform_target`, `create_data_key`, `create_data_list`, `create_postal_code_target` |
| **Reporting** | 39 | `get_display_report`, `get_vast_report`, `get_event_logs`, custom report configs, scheduled reports |
| **Programmatic / RTB** | 25 | `create_demand_source`, `create_demand_endpoint`, `create_bidder`, `create_pmp_deal` |
| **Product catalogs** | 20 | `create_product_db_catalog`, `bulk_upload_products`, ad item ↔ catalog item linking |
| **Drafts** | 48 | Stage campaigns/ad items/placements/schedules as drafts; publish atomically |
| **Contracts** | 43 | Insertion orders, contract documents, signature requests, payments |
| **Account & security** | 27 | Users, roles, redirect domains, beacon signing keys, SFTP connections |
| **Ad serving** | 2 | `serve_ad`, `live_website_preview` |

100% coverage of the AdButler [v2 OpenAPI spec](https://api.adbutler.com/openapi.json) (604/604 endpoints).

## Development

Local source for contributors:

```bash
git clone https://github.com/adbutler/mcp-server
cd mcp-server
npm install
npm run build
ADBUTLER_API_KEY=your_key node dist/index.js
```

Inspect with the official MCP inspector:

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

## Resources

- **AdButler API documentation** — https://api.adbutler.com/openapi.json
- **MCP Protocol** — https://modelcontextprotocol.io
- **Hosted server status** — https://mcp.adbutler.com/health
- **Issues / feature requests** — https://github.com/adbutler/mcp-server/issues

## License

MIT
