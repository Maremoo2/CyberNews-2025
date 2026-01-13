# Direct RSS Feed Implementation

This document describes the implementation of direct RSS feed fetching for the CyberNews-2025 platform.

## Overview

The platform now fetches cybersecurity news directly from 33 RSS feeds across global news sources, replacing the previous Inoreader dependency for sources that don't work properly in Inoreader.

## RSS Feed Sources

### United States (18 sources)
1. **CISA News** - https://www.cisa.gov/news.xml
2. **CISA Blog** - https://www.cisa.gov/blog.xml
3. **Schneier on Security** - https://www.schneier.com/tag/cybersecurity/feed/
4. **2B Innovations** - https://2binnovations.com/category/cybersecurity-news-updates/feed/
5. **US News Cybersecurity** - https://www.usnews.com/topics/subjects/cybersecurity/rss
6. **Security Magazine** - https://www.securitymagazine.com/rss/topic/2788
7. **Mitnick Security** - https://www.mitnicksecurity.com/blog/rss.xml
8. **TechCrunch Cybersecurity** - https://techcrunch.com/tag/cybersecurity/feed/
9. **The Verge Cybersecurity** - https://www.theverge.com/rss/cyber-security/index.xml
10. **New York Times Cybersecurity** - https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/spotlight/cybersecurity/rss.xml
11. **Foreign Affairs Cybersecurity** - https://www.foreignaffairs.com/feeds/topic/cybersecurity/rss.xml
12. **SDM Magazine** - https://www.sdmmag.com/rss/topic/6802-cybersecurity-chronicles
13. **MIT Cyber Security** - https://news.mit.edu/topic/mitcyber-security-rss.xml
14. **Cybersecurity Dive** - https://www.cybersecuritydive.com/feeds/news/
15. **eSecurity Planet** - https://www.esecurityplanet.com/feed/
16. **How-To Geek Cybersecurity** - https://www.howtogeek.com/feed/category/cybersecurity/
17. **CyberPilot** - https://www.cyberpilot.io/cyberpilot-blog/rss.xml

### Europe (9 sources)
1. **Graham Cluley** - https://grahamcluley.com/feed/ (UK)
2. **The Conversation Cybersecurity** - https://theconversation.com/topics/cybersecurity-535/articles.atom (UK)
3. **Alias Robotics** - https://news.aliasrobotics.com/rss/ (Spain)
4. **Il Sole 24 Ore** - https://www.ilsole24ore.com/rss/tecnologia--cybersicurezza.xml (Italy)
5. **Clubic** - https://www.clubic.com/feed/antivirus-securite-informatique/rss (France)
6. **Help Net Security** - https://www.helpnetsecurity.com/feed/
7. **Cybersecurity Cloud Expo** - https://www.cybersecuritycloudexpo.com/feed/ (UK)
8. **IT Security Expert** - https://blog.itsecurityexpert.co.uk/feeds/posts/default?alt=atom (UK)
9. **Infinigate** - https://www.infinigate.com/uk/news-types/news-press/feed/ (UK)

### Asia (2 sources)
1. **South China Morning Post** - https://www.scmp.com/rss/296935/feed/ (Hong Kong)
2. **Mashable Cybersecurity** - https://in.mashable.com/cybersecurity.xml (India)

### Global (4 sources)
1. **SN Wire** - https://snwire.com/feed/
2. **The Cyber Express** - https://thecyberexpress.com/feed/
3. **Upstream Auto** - https://upstream.auto/autothreat-intelligence/
4. **Cyber Insider** - https://cyberinsider.com/feed/
5. **Info Savvy** - https://info-savvy.com/feed/

## Technical Implementation

### Architecture

```
RSS Feeds (33 sources)
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
6. **Retry Logic**: Built-in retry mechanism for failed feeds
7. **Rate Limiting**: Small delays between feeds to be respectful to servers

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
      "defaultCountry": "Country Name"
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
7. Source credibility scoring
