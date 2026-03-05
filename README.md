# @adbutler/mcp-server

MCP server for the [AdButler](https://www.adbutler.com) ad management API. Gives AI assistants (Claude Desktop, Claude Code, Cursor, etc.) direct tool access to manage advertisers, campaigns, zones, publishers, ad items, creatives, placements, and reports.

## Setup

### Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

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

### Claude Code

```bash
claude mcp add adbutler -- npx -y @adbutler/mcp-server
```

Set the environment variable before running:
```bash
export ADBUTLER_API_KEY=your_api_key_here
```

### Local Development

```bash
git clone <repo>
cd adbutler-mcp-server
npm install
npm run build
ADBUTLER_API_KEY=your_key node dist/index.js
```

## Tools (36)

| Group | Tools |
|-------|-------|
| Advertisers | `list_advertisers`, `get_advertiser`, `create_advertiser`, `update_advertiser` |
| Campaigns | `list_campaigns`, `get_campaign`, `create_campaign`, `update_campaign`, `delete_campaign` |
| Zones | `list_zones`, `get_zone`, `create_zone`, `update_zone`, `get_zone_tag` |
| Publishers | `list_publishers`, `get_publisher`, `create_publisher`, `update_publisher` |
| Ad Items | `list_ad_items`, `get_ad_item`, `create_image_ad_item`, `update_image_ad_item`, `delete_ad_item` |
| Creatives | `list_creatives`, `get_creative`, `create_creative`, `update_creative`, `delete_creative` |
| Placements | `list_placements`, `get_placement`, `create_placement`, `delete_placement` |
| Reports | `get_display_report`, `get_vast_report`, `get_event_logs` |
| Ad Serving | `serve_ad` |

## Authentication

Get your API key from **AdButler > Settings > API Keys**. Pass it via the `ADBUTLER_API_KEY` environment variable.

## Testing

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

## License

MIT
