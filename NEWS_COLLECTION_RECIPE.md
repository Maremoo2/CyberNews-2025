# 📋 News Collection Recipe for DeepResearch

This guide provides a structured approach to collecting and organizing cybersecurity news using DeepResearch and ChatGPT.

## 1. Monthly Structure Template

### Repository Path Structure:
```
/news
  /2025
    /01-january
    /02-february
    /03-march
    /04-april
    /05-may
    /06-june
    /07-july
    /08-august
    /09-september
    /10-october
    /11-november
    /12-december
```

## 2. Geographic Coverage Template

For each month, organize by region:

```
/01-january
  /global-overview.md
  /eu
    - summary.md
    - major-incidents.md
  /us
    - summary.md
    - major-incidents.md
  /asia
    - summary.md
    - major-incidents.md
  /norway
    - summary.md
    - major-incidents.md
```

## 3. DeepResearch ChatGPT Prompts

### Monthly Overview Prompt:
```
Research and compile cybersecurity news for [MONTH YEAR] with the following structure:

1. Global Overview: Major cyber incidents, trends, and statistics
2. European Union: 
   - Major data breaches
   - New regulations/legislation
   - Notable attacks on EU organizations
3. United States:
   - Major data breaches
   - Government cybersecurity initiatives
   - Corporate security incidents
4. Asia:
   - Regional cyber threats
   - Major incidents in China, Japan, Korea, India
   - Emerging trends
5. Norway:
   - National cyber incidents
   - Norwegian company breaches
   - Government cybersecurity initiatives

Format each incident with:
- Date
- Organization/Target
- Type of attack
- Impact
- Source links
```

### Weekly Update Prompt:
```
Search for cybersecurity news from [START DATE] to [END DATE] for: 
- EU region (focus on GDPR violations, critical infrastructure)
- US region (focus on ransomware, state-sponsored attacks)
- Asia region (focus on APT groups, major breaches)
- Norway (focus on local incidents, NSM advisories)

Provide incident summaries with dates and credible sources.
```

## 4. File Organization Structure

Files are organized in regional subdirectories within each month:

```
/[month]
  /[region]
    - summary.md
    - major-incidents.md
```

Examples:
- `/01-january/eu/summary.md`
- `/01-january/us/summary.md`
- `/01-january/asia/summary.md`
- `/01-january/norway/summary.md`

## 5. Standard Article Format

```markdown
# [Month] [Year] - [Region] Cybersecurity News

## Major Incidents

### [Incident Title]
- **Date:** YYYY-MM-DD
- **Target:** [Organization/Sector]
- **Attack Type:** [Ransomware/Phishing/DDoS/Data Breach/etc.]
- **Impact:** [Description of damage/data stolen/systems affected]
- **Attribution:** [Threat actor if known]
- **Source:** [Link to news article]

## Trends & Analysis
[Monthly trends for this region]

## Legislation & Policy Updates
[Any new regulations or government initiatives]

## Statistics
- Total incidents reported: X
- Most targeted sector: [Sector]
- Most common attack type: [Type]
```

## 6. DeepResearch Workflow

### Step 1: Start of each month

```
"Research cybersecurity incidents from [LAST MONTH] across EU, US, Asia, and Norway.
Prioritize: ransomware attacks, data breaches affecting >10,000 people, 
critical infrastructure attacks, and state-sponsored campaigns."
```

### Step 2: Weekly check-ins

```
"Update on cybersecurity news for the week of [DATE RANGE] in EU/US/Asia/Norway.
Focus on breaking incidents and emerging threats."
```

### Step 3: End of month compilation

```
"Compile and analyze all cybersecurity incidents from [MONTH] for my repository.
Create a comprehensive summary organized by region with statistics and trends."
```

## 7. Quick Adding Workflow

1. Run DeepResearch query (weekly or monthly)
2. Copy results to your local editor
3. Format using the standard template above
4. Commit to GitHub:

```bash
git add news/2025/[month]/[region]/summary.md
git commit -m "Add [region] cyber news for [month] [year]"
git push
```

## 8. Integration with incidents.json

After collecting news in the markdown files, you can also add significant incidents to the main `data/incidents.json` file for display on the website:

```json
{
  "id": "unique-id",
  "date": "YYYY-MM-DD",
  "title": "Incident title",
  "summary": "Brief description",
  "region": "US|EU|ASIA|NO",
  "country": "Country name",
  "sourceName": "Source name",
  "sourceUrl": "https://link-to-source.com",
  "tags": ["tag1", "tag2", "tag3"],
  "impact": 1-5
}
```

### Region Codes:
- `US` - United States
- `EU` - European Union
- `ASIA` - Asia Pacific
- `NO` - Norway

### Impact Scale:
- `1` - Low impact, minor incident
- `2` - Moderate impact
- `3` - Significant impact
- `4` - Major impact (shown in "biggest stories" filter)
- `5` - Critical impact (shown in "biggest stories" filter)

## 9. Bonus: Automation Ideas

Since the repository is JavaScript-heavy with Vite + React, you could create:

- A simple web form to add news entries
- An automated script to fetch from RSS feeds (Bleeping Computer, The Hacker News, etc.)
- A dashboard to display news by month/region
- GitHub Actions to remind you monthly to update

## 10. Pro Tips for DeepResearch

✅ **Be specific about date ranges** - Narrow down to weekly or monthly periods for better results

✅ **Request source links for verification** - Always ask DeepResearch to include credible sources

✅ **Ask for incident categorization** - Request incidents to be grouped by type (ransomware, APT, data breach, etc.)

✅ **Request statistics and trend analysis** - Ask for numerical data and patterns

✅ **Specify regions explicitly each time** - Don't assume context carries over between queries

## 11. Recommended News Sources

### Global:
- The Hacker News
- Bleeping Computer
- SecurityWeek
- Dark Reading
- Krebs on Security

### EU Specific:
- ENISA (European Union Agency for Cybersecurity)
- CERT-EU
- European Data Protection Board

### US Specific:
- CISA Advisories
- US-CERT
- FBI Cyber Division

### Asia Specific:
- JPCERT/CC (Japan)
- KrCERT (Korea)
- CERT-In (India)
- SingCERT (Singapore)

### Norway Specific:
- NSM (Nasjonal sikkerhetsmyndighet)
- NorCERT
- Norwegian news: E24, Digi.no, Kode24

## 12. Monthly Checklist

Use this checklist at the start of each month:

- [ ] Create new month directory (e.g., `/02-february`)
- [ ] Create regional subdirectories (eu, us, asia, norway)
- [ ] Run initial DeepResearch query for previous month
- [ ] Create `global-overview.md` with overall trends
- [ ] Create `summary.md` for each region
- [ ] Create `major-incidents.md` for each region
- [ ] Add significant incidents to `data/incidents.json`
- [ ] Review and verify all source links
- [ ] Commit and push to GitHub
- [ ] Schedule weekly check-ins for ongoing updates

## 13. Quality Control

Before committing, verify:

- [ ] All dates are in YYYY-MM-DD format
- [ ] All incidents have credible source links
- [ ] Regional categorization is correct
- [ ] Impact ratings are justified
- [ ] No duplicate entries
- [ ] Statistics are accurate
- [ ] Markdown formatting is consistent

---

**Happy News Collecting! 📰🔒**
