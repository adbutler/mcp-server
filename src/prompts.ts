import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

interface SkillPrompt {
  name: string;
  description: string;
  instructions: string;
}

const skills: SkillPrompt[] = [
  {
    name: 'launch-campaign',
    description: 'Step-by-step workflow to create and launch a display ad campaign in AdButler',
    instructions: `# AdButler Campaign Launch

## PURPOSE
Launch a complete display ad campaign — from creating the advertiser through to an active placement serving ads in a zone.

## PREREQUISITES
- ADBUTLER_API_KEY must be set (already configured if you can see this prompt)
- Use the AdButler MCP tools listed below — they are already connected

## STEPS

### Step 1: Create Advertiser
- **Tool**: create_advertiser
- **Required**: name (string)
- **Optional**: email, can_add_ad_items, metadata

### Step 2: Create Campaign
- **Tool**: create_campaign
- **Required**: name (string)
- **Optional**: advertiser (ID from Step 1), targeting_source ("CAMPAIGN"|"AD_ITEM"), scheduling_source ("CAMPAIGN"|"AD_ITEM"), budget ({daily, weekly, monthly, lifetime}), metadata, contract

### Step 3: Create Ad Item
- **Tool**: create_image_ad_item (or create_custom_html_ad_item, create_rich_media_ad_item, create_native_ad_item)
- **Required**: name
- **For image**: creative (creative ID) OR creative_url (public URL to image)
- **Optional**: location (click URL), width, height, html_alt_text, tracking_pixel, metadata

### Step 4: Assign Ad Item to Campaign
- **Tool**: create_campaign_assignment
- **Required**: advertisement ({id: AD_ITEM_ID, type: "image_ad_item"}), campaign ({id: CAMPAIGN_ID, type: "standard_campaign"})
- **Optional**: weight, active, schedule, geo_target, platform_target, keywords

### Step 5: Create Publisher
- **Tool**: create_publisher
- **Required**: name
- **Optional**: timezone, email, domain, seller_type, metadata
- **Skip if**: publisher already exists (use list_publishers to find)

### Step 6: Create Zone
- **Tool**: create_zone
- **Required**: name
- **Optional**: publisher (ID from Step 5), width, height, dimensions ("fixed"|"dynamic"), serve_priority_order, metadata

### Step 7: Create Schedule
- **Tool**: create_schedule
- **All optional**: start_at (ISO-8601), end_at, delivery_method ("default"|"smooth"), quota_lifetime, quota_type ("views"|"clicks"), day_cap_limit, per_user_view_limit, per_user_view_period, day_parting_id

### Step 8: Create Placement (activates ad serving)
- **Tool**: create_placement
- **Required**: advertisement ({id: CAMPAIGN_ID, type: "standard_campaign"} or {id: AD_ITEM_ID, type: "image_ad_item"}), zone ({id: ZONE_ID, type: "standard_zone"}), schedule (SCHEDULE_ID)
- **Optional**: active (default true), weight, cost ({cpm, cpc, cpa}), priority ("sponsorship"|"standard"|"network"|"bulk"|"house"), serve_method ("weight"|"auction"), geo_target, platform_target, keywords

### Step 9: Get Zone Tag
- **Tool**: get_zone_tag
- **Required**: id (ZONE_ID)
- Returns the JavaScript embed code for the publisher's website

## DECISION TREE
- Advertiser exists? → list_advertisers to find ID, skip Step 1
- Image URL available? → use creative_url field, skip creative upload
- Custom HTML ad? → use create_custom_html_ad_item with custom_html field
- Publisher exists? → list_publishers to find ID, skip Step 5

## VALIDATION
After completing, verify:
- get_placement with PLACEMENT_ID → check active: true
- get_zone_tag with ZONE_ID → returns embed code`,
  },
  {
    name: 'retail-media-setup',
    description: 'Set up a retail media network with catalog zones, sponsored products, and auction pricing',
    instructions: `# AdButler Retail Media Setup

## PURPOSE
Set up a retail media / sponsored products network using catalog zones with auction-based pricing.

## STEPS

### Step 1: Create Publisher
- **Tool**: create_publisher
- **Required**: name

### Step 2: Create Catalog Zone
- **Tool**: create_catalog_zone
- **Required**: name, catalog_id (must exist in AdButler)
- **Optional**: publisher (ID from Step 1), bid_floor_cpm, bid_floor_cpc, advertiser_cost_type ("CPM"|"CPC"), auction_type ("FIRST_PRICE"|"SECOND_PRICE"), click_cooldown_period (seconds), conversion_lookback_period (seconds)

### Step 3: Create Campaign
- **Tool**: create_campaign
- **Required**: name
- **Optional**: advertiser

### Step 4: Create Catalog Ad Items
- **Tool**: create_catalog_ad_item
- **Required**: name, catalog_id (integer), catalog_item_identifier (string — product SKU)
- **Optional**: location (product page URL), tracking_pixel, metadata
- **Repeat** for each product

### Step 5: Get Zone Tag
- **Tool**: get_catalog_zone_tag
- **Required**: id (ZONE_ID)

## KEY NOTES
- catalog_id must reference an existing catalog in AdButler
- catalog_item_identifier is the unique product SKU or ID
- CPC pricing is typical for retail media (advertiser_cost_type: "CPC")
- SECOND_PRICE auctions are standard; FIRST_PRICE for premium inventory`,
  },
  {
    name: 'reporting',
    description: 'Pull performance reports, forecasts, and analytics from AdButler',
    instructions: `# AdButler Reporting

## PURPOSE
Pull performance reports and analytics data from AdButler.

## AVAILABLE REPORTS

### Quick Display Report
- **Tool**: get_display_report
- **Required**: type (overview|publisher|advertiser|zone|campaign|ad-item), period (day|week|month|year)
- **Optional**: preset (today|yesterday|last-7-days|last-30-days|last-month|last-3-months), from/to (YYYY-MM-DD), timezone, summary (bool), details (bool), breakdown (bool), financials (bool)
- **Filters**: publishers, zones, advertisers, campaigns, ad_items (comma-separated IDs)

### VAST Report
- **Tool**: get_vast_report
- **Same params as display report** but for VAST video campaigns

### Event Logs
- **Tool**: get_event_logs
- **Required**: log_type (display_impressions|display_clicks|display_conversions|display_blanks|vast_impressions|vast_clicks|vast_actions|vast_interactions|vast_blanks)
- **Optional**: from, to (YYYY-MM-DD)

### Saved Report Configuration
- **Tool**: create_custom_report — create a saved report config
- **Tool**: list_custom_reports — list saved configs
- **Tool**: get_custom_report — retrieve a saved config

## DECISION TREE
- Display ads? → get_display_report
- Video ads? → get_vast_report
- Raw event data? → get_event_logs
- Need recurring? → create_custom_report then schedule it`,
  },
  {
    name: 'vast-video',
    description: 'Create and launch a VAST video ad campaign with media, companions, and tracking',
    instructions: `# AdButler VAST Video Campaign

## PURPOSE
Launch a VAST video ad campaign with linear media, optional companions, and tracking events.

## STEPS

### Step 1: Create Advertiser
- **Tool**: create_advertiser — Required: name

### Step 2: Create VAST Campaign
- **Tool**: vast_create_campaign — Required: name, advertiser (ID)

### Step 3: Create VAST Ad Item
- **Tool**: vast_create_ad_item — Optional: name, location (VAST tag URL), duration ("HH:MM:SS"), skippable (bool), skip_duration, companion_display ("inline"|"required")

### Step 4: Add Linear Media
- **Tool**: vast_create_linear_media — Optional: ad_item (ID), type (MIME e.g. "video/mp4"), delivery ("progressive"|"streaming"), width, height, creative_url (video file URL), codec, min_bitrate, max_bitrate

### Step 5: Add Tracking Events
- **Tool**: vast_create_tracking — Optional: ad_item_id (ID), type ("start"|"firstQuartile"|"midpoint"|"thirdQuartile"|"complete"|"clicks"|"creativeView"|"mute"|"unmute"|"pause"|"resume"|"fullscreen"), link (tracking URL)

### Step 6: Add Companions (optional)
- **Tool**: vast_create_companion — Optional: ad_item (ID), resource_type ("static"|"iframe"|"html"), width, height, content, creative (ID), location (click URL)

### Step 7: Create Publisher & VAST Zone
- **Tool**: create_publisher — Required: name
- **Tool**: vast_create_zone — Required: name, publisher (ID)

### Step 8: Create VAST Schedule
- **Tool**: vast_create_schedule — Optional: delivery_method ("default"|"smooth"), start_date, end_date, quota_lifetime, quota_type ("views"|"clicks"), geo_target, day_parting_id

### Step 9: Create VAST Placement
- **Tool**: vast_create_placement — Required: advertisement ({id, type: "vast_ad_item"|"vast_campaign"}), zone (ID), schedule (ID). Optional: active, cost, priority, max_frequency, max_frequency_period, max_frequency_type ("start"|"click"|"complete"), serve_method`,
  },
  {
    name: 'programmatic',
    description: 'Set up programmatic advertising with demand sources, endpoints, and PMP deals',
    instructions: `# AdButler Programmatic Setup

## PURPOSE
Configure programmatic advertising: demand sources, demand endpoints, and PMP deals.

## STEPS

### Step 1: Create Demand Source
- **Tool**: create_demand_source
- **Optional**: name, network (ad network name), status ("active"|"paused"), spend_limit, spend_limit_period ("once"|"weekly"|"monthly")

### Step 2: Create Demand Endpoint
- **Tool**: create_demand_endpoint
- **Optional**: name, demand_source (ID from Step 1), supported_formats (["display","native","video"]), bid_floor, revenue_share, markup_percent, allowed_sizes, geo_target, filter_type ("all"|"include"|"exclude"), filtered_zones, status ("active"|"inactive")

### Step 3: Create PMP Deal (optional)
- **Tool**: create_pmp_deal
- **Optional**: name, bid_floor, geo_target, whitelist_seats (array of seat IDs), audience_target

### Step 4: Configure Zones
- **Tool**: update_zone
- Set: allow_demand_sources (true), bid_floor, pmp_deals (array of PMP deal IDs), private_auction (bool)`,
  },
  {
    name: 'targeting',
    description: 'Configure targeting rules — geo, platform, day-parting, data keys, audiences',
    instructions: `# AdButler Targeting & Audiences

## PURPOSE
Create targeting rules and apply them to placements or campaign assignments.

## TARGETING TYPES

### Geo Targeting
- **Tool**: create_geo_target
- **Required**: name
- **Optional**: areas ([{country, region, city, continent}]), inclusive (bool), range (radius int), unit ("miles"|"kilometers")

### Platform Targeting
- **Tool**: create_platform_target
- **Optional**: name, platform ("any"|"mobile"|"tablet"|"desktop"), device_targets (["Apple*"]), desktop_os_targets (["mac","windows","linux"]), mobile_os_targets (["android","ios"]), desktop_browser_targets, mobile_browser_targets

### Day-Parting
- **Tool**: create_day_parting
- **Optional**: name, ranges ({"monday": [{"start":"09:00","end":"17:00"}], ...}), use_member_timezone (bool)

### Data Key Targeting
- **Tools**: create_data_key (name, type: STRING|ARRAY|INTEGER|FLOAT), then create_data_key_target (name, target: JSON logic)

### List Targeting
- **Tools**: create_data_list (label), then create_list_target (label, data_list: ID, inclusive: bool)

### Postal Code Targeting
- **Tool**: create_postal_code_target
- **Optional**: label, inclusive (bool), locations ([{country, postal_codes: [...]}])

## APPLYING TARGETS
On placements: geo_target, platform_target, keywords, data_key_target_id, list_target
On campaign assignments: geo_target, platform_target, keywords, data_key_target, list_target
On schedules: day_parting_id`,
  },
  {
    name: 'contracts',
    description: 'Manage advertising contracts, templates, documents, payments, and signatures',
    instructions: `# AdButler Contract Management

## PURPOSE
Create and manage advertising contracts with documents, payments, and signatures.

## STEPS

### Step 1: Create Contract
- **Tool**: create_contract
- **Optional**: name, advertiser (ID), description, status ("open"|"tentative"|"pending"|"active"|"closed"|"expired"), start_at (YYYY-MM-DD), end_at, payment_due_date, rate

### Step 2: Create Document
- **Tool**: create_contract_document
- **Required**: contract_id
- **Optional**: name, file

### Step 3: Record Payments
- **Tool**: create_contract_payment
- **Required**: contract_id
- **Optional**: amount, note

### Step 4: Link Campaign
- Use create_campaign with contract field set to the contract ID

## OTHER TOOLS
- list_contracts, get_contract, update_contract, delete_contract
- archive_contract, list_archived_contracts, unarchive_contract
- create_contract_template, list_contract_templates
- list_contract_documents, list_contract_payments
- create_signature_request, list_signature_requests`,
  },
  {
    name: 'channels',
    description: 'Create channels to group zones for unified campaign delivery',
    instructions: `# AdButler Channel Management

## PURPOSE
Group multiple zones into channels for unified campaign delivery across publishers.

## STEPS

### Step 1: Create Channel
- **Tool**: create_channel
- **Required**: name
- **Optional**: priority ("sponsorship"|"standard"|"network"|"bulk"|"house"), use_share_of_voice (bool)

### Step 2: Assign Zones to Channel
- **Tool**: create_channel_zone_assignment
- **Required**: channel (ID), zone ({id, type: "standard_zone"|"email_zone"})
- **Repeat** for each zone

### Step 3: Create Channel-Based Placement
- **Tool**: create_placement
- Use channel (ID) instead of zone object
- **Required**: advertisement, schedule, channel

## VAST CHANNELS
- **Tool**: vast_create_channel — Required: name
- **Tool**: vast_create_channel_zone_assignment — channel (ID), zone (ID)

## KEY BENEFIT
One placement serves across all zones in the channel. Add/remove zones without changing placements.`,
  },
  {
    name: 'drafts',
    description: 'Stage campaigns in draft mode — create, review, edit, and publish when ready',
    instructions: `# AdButler Draft Campaigns

## PURPOSE
Stage campaigns, ad items, schedules, and placements in draft mode. Review and edit before publishing live.

## KEY CONCEPT
All draft entities wrap their fields in a "draft" object and link to a parent campaign via campaign_draft_id.

## STEPS

### Step 1: Create Draft Campaign
- **Tool**: draft_create_campaign
- **Body**: { draft: { name, advertiser, ... } }
- Returns: campaign draft ID

### Step 2: Create Draft Ad Items
- **Tools**: draft_create_image_ad_item, draft_create_custom_html_ad_item, draft_create_native_ad_item, draft_create_rich_media_ad_item, draft_create_catalog_ad_item
- **Required**: campaign_draft_id, draft: { name, creative_url|custom_html|template, ... }

### Step 3: Create Draft Schedule
- **Tool**: draft_create_schedule
- **Required**: campaign_draft_id, draft: { start_at, end_at, delivery_method, ... }

### Step 4: Create Draft Placement
- **Tool**: draft_create_placement
- **Required**: campaign_draft_id, draft: { advertisement: {id, type}, zone: {id, type}, schedule: DRAFT_SCHEDULE_ID, ... }
- **Note**: zone references a LIVE zone ID, not a draft

### Step 5: Review
- Use draft_list_campaigns, draft_get_campaign, draft_list_ad_items, etc. to review

### Step 6: Publish
- Call the save/publish endpoint on the draft campaign
- All children (ad items, assignments, schedules, placements) go live together

## IMPORTANT
- Nothing serves ads until published
- Zone IDs in placements must reference existing live zones
- The publish step validates everything — fix any errors before retrying`,
  },
];

export function registerPrompts(server: McpServer): void {
  for (const skill of skills) {
    server.prompt(
      skill.name,
      skill.description,
      () => ({
        messages: [
          {
            role: 'user' as const,
            content: {
              type: 'text' as const,
              text: skill.instructions,
            },
          },
        ],
      }),
    );
  }
}
