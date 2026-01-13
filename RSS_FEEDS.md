# Direct RSS Feed Implementation

This document describes the implementation of direct RSS feed fetching for the CyberNews-2025 platform.

## Overview

The platform now fetches cybersecurity news directly from 128 RSS feeds across global news sources, replacing the previous Inoreader dependency for sources that don't work properly in Inoreader.

## RSS Feed Sources

The platform aggregates cybersecurity news from 128 RSS feeds organized by region:

- **United States**: 90 sources
- **Europe**: 24 sources  
- **Asia**: 14 sources

For the complete list of feeds, see `config/rss-feeds-config.json`.

### Notable Sources Include

**High-Profile Security Blogs:**
- **Krebs on Security** - Brian Krebs' investigative cybercrime blog
- **Troy Hunt** - Creator of Have I Been Pwned
- **Schneier on Security** - Bruce Schneier's security analysis
- **Graham Cluley** (UK)
- **BleepingComputer** - Breaking cybersecurity news

**Major Vendors & Organizations:**
- **CISA** (US Government Cybersecurity Agency)
- **NIST Cybersecurity Insights** (US Government)
- **Google Online Security Blog**
- **Cisco Security Blog**
- **Microsoft**, **Sophos**, **McAfee**, **Veracode**, **Trend Micro**

**News & Media:**
- **Dark Reading** - Premier cybersecurity news
- **CSO Online** - Enterprise security decision-makers
- **TechCrunch Cybersecurity**
- **TechRepublic Cybersecurity**
- **The Guardian - Data & Computer Security**
- **Threatpost**, **Infosecurity Magazine**
- **We Live Security** - ESET research

**Research & Analysis:**
- **MIT Cyber Security**
- **The Cyber Express**
- **Cyber Defense Magazine**
- **Help Net Security**

## Technical Implementation

### Architecture

```
RSS Feeds (128 sources)
    ↓
fetch-rss-feeds.js (Node.js script)
    ↓
rss-parser library (parsing)
    ↓
Transform to incident format
    ↓
data/incidents-YYYY.json (auto-routed by year)
```

### Key Features

1. **Automatic Year Routing**: Articles are automatically sorted into the correct year file based on publication date
2. **Duplicate Detection**: Uses URL matching to prevent duplicate articles
3. **Sequential ID Generation**: Generates unique IDs per year (2026001, 2026002, etc.)
4. **Tag Generation**: Automatically assigns tags based on content keywords
5. **Impact Scoring**: Calculates impact level (1-5) based on keyword analysis
6. **Source Weighting**: Each feed has a credibility weight (1-5) for prioritization
7. **Retry Logic**: Built-in retry mechanism for failed feeds
8. **Rate Limiting**: Small delays between feeds to be respectful to servers

### Configuration File Structure

`config/rss-feeds-config.json`:

```json
{
  "maxItemsPerFeed": 50,
  "feeds": [
    {
      "name": "Feed Name",
      "url": "https://example.com/feed.xml",
      "defaultRegion": "US|EU|ASIA|NO",
      "defaultCountry": "Country Name",
      "weight": 5
    }
  ],
  "tagKeywords": {
    "tag-name": ["keyword1", "keyword2"]
  },
  "impactKeywords": {
    "5": ["critical keywords"],
    "4": ["major keywords"],
    "3": ["moderate keywords"],
    "2": ["minor keywords"],
    "1": ["low keywords"]
  },
  "companyKeywords": ["company1", "company2"]
}
```

### Source Weight System (1-5 scale)

Each RSS feed is assigned a credibility weight to enable prioritization and signal quality assessment:

- **Weight 5 (Must-have / High Signal)**: Government agencies, security standards organizations, and top-tier security researchers
  - Examples: CISA, NIST, Krebs on Security, Troy Hunt, Schneier on Security, Google Security Blog
  - Count: 7 feeds

- **Weight 4 (Strong Source)**: Established infosec media outlets and high-quality vendor research
  - Examples: Dark Reading, BleepingComputer, CSO Online, Graham Cluley, MIT News, Infosecurity Magazine
  - Count: 17 feeds

- **Weight 3 (Solid Quality)**: Reputable vendor blogs, specialized security content, and niche experts
  - Examples: Sophos, Cisco, Veracode, SOC Prime, Acunetix, Trend Micro, Imperva
  - Count: 39 feeds

- **Weight 2 (Variable Quality)**: Mainstream tech media, consulting blogs, and mixed-quality sources
  - Examples: TechCrunch, TechRepublic, Security Magazine, US News, various consulting firms
  - Count: 60 feeds

- **Weight 1 (Low Signal)**: Content farms, SEO-focused sites, and high-noise sources
  - Examples: SecureBlitz, Hacker Combat, Virtualattacks
  - Count: 5 feeds

The weight system enables:
- **Prioritization**: Higher-weight sources can be processed first or given more prominence
- **Confidence scoring**: Multiple high-weight sources reporting the same incident increases credibility
- **Signal-to-noise optimization**: Filter or de-prioritize lower-weight sources during high-volume periods

### Tag Categories (18 total)

1. **ransomware** - Ransomware attacks and extortion
2. **data-breach** - Data breaches and leaks
3. **vulnerability** - Software vulnerabilities and CVEs
4. **phishing** - Phishing and credential theft
5. **ddos** - DDoS attacks
6. **malware** - Malware and trojans
7. **apt** - Advanced persistent threats
8. **state-sponsored** - Nation-state attacks
9. **supply-chain** - Supply chain compromises
10. **iot** - IoT and smart device security
11. **cloud** - Cloud security issues
12. **mobile** - Mobile security (Android/iOS)
13. **healthcare** - Healthcare sector incidents
14. **finance** - Financial sector incidents
15. **government** - Government sector incidents
16. **critical-infrastructure** - Critical infrastructure
17. **ai-ml** - AI/ML security
18. **encryption** - Encryption and cryptography

### Impact Scoring (1-5 scale)

- **Level 5 (Critical)**: National security, catastrophic, millions affected
- **Level 4 (Major)**: Significant, severe, widespread, high-profile
- **Level 3 (Moderate)**: Notable, substantial impact
- **Level 2 (Minor)**: Limited, isolated incidents
- **Level 1 (Low)**: Minimal, negligible impact

## Usage

### Running the Script

```bash
# Dry-run mode (preview without saving)
npm run fetch-rss -- --dry-run

# Normal mode (fetch and save)
npm run fetch-rss
```

### Automated Execution

The script runs automatically via GitHub Actions every 6 hours:
- Workflow: `.github/workflows/fetch-rss-feeds.yml`
- Schedule: `0 */6 * * *` (every 6 hours)
- Manual trigger: Available via GitHub Actions UI

### Manual Trigger

1. Go to repository on GitHub
2. Click **Actions** tab
3. Select **"Fetch RSS Feeds"** workflow
4. Click **"Run workflow"**
5. Select branch and confirm

## Output Format

Each article is transformed into an incident object:

```json
{
  "id": "2026001",
  "date": "2026-01-13",
  "title": "Article Title",
  "summary": "Article summary truncated to 300 characters...",
  "region": "US",
  "country": "United States",
  "sourceName": "Source Name",
  "sourceUrl": "https://source.com/article",
  "tags": ["tag1", "tag2"],
  "impact": 3
}
```

## Maintenance

### Adding New Feeds

1. Edit `config/rss-feeds-config.json`
2. Add new feed object to `feeds` array:
   ```json
   {
     "name": "New Source",
     "url": "https://newsource.com/feed.xml",
     "defaultRegion": "US",
     "defaultCountry": "United States"
   }
   ```
3. Test with dry-run: `npm run fetch-rss -- --dry-run`
4. Commit changes

### Updating Tag Keywords

1. Edit `tagKeywords` section in `config/rss-feeds-config.json`
2. Add new tags or keywords to existing tags
3. Test to ensure proper tag assignment

### Troubleshooting

**Problem**: Feed fails to fetch
- Check if RSS feed URL is accessible
- Verify feed format (RSS/Atom)
- Check for network/firewall issues

**Problem**: No new articles despite feed having new content
- Check if URLs already exist in incidents files
- Verify date parsing is working correctly

**Problem**: Wrong region assignment
- Update `defaultRegion` in feed config
- Verify region is one of: US, EU, ASIA, NO

## Benefits Over Inoreader

1. **Direct control**: No dependency on third-party aggregation service
2. **More sources**: Can add any RSS feed without Inoreader limitations
3. **Reliability**: Feeds that don't work in Inoreader now work directly
4. **Cost**: No API limits or subscription requirements
5. **Transparency**: Full control over parsing and transformation logic
6. **Customization**: Easy to add custom parsing for specific feeds

## Backward Compatibility

The original Inoreader fetcher (`fetch-inoreader.js`) is still available:
- Command: `npm run fetch-news`
- Workflow: `.github/workflows/fetch-inoreader-news.yml`
- Config: `config/inoreader-config.json`

Both systems can coexist and feed into the same incidents files.

## Dependencies

- **rss-parser**: RSS/Atom feed parsing
- **cheerio**: HTML stripping and text extraction
- **node-fetch**: HTTP requests (already installed)

## Future Enhancements

Potential improvements:
1. Parallel feed fetching for better performance
2. Intelligent region detection from content
3. Category-specific keyword weighting
4. Feed health monitoring and alerts
5. Custom parsers for non-standard feed formats
6. Article deduplication by content similarity
7. ~~Source credibility scoring~~ ✅ **Implemented**: Weight-based source prioritization (1-5 scale)
8. **Multi-source confidence scoring**: Boost articles reported by multiple high-weight sources
9. **Threat actor tracking**: Identify and tag known threat actors (LockBit, ALPHV, APT groups)
10. **Sector-specific tagging**: Enhanced categorization for Finance, Healthcare, OT, Cloud sectors
