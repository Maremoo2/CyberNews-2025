# Cybersecurity Threat Intelligence Platform

An enterprise-grade threat intelligence platform that enriches 800+ cybersecurity incidents using MITRE ATT&CK mapping, explainable risk scoring, threat actor attribution, and strategic theme analysis. Built for security analysts, CISOs, and SOC teams who need actionable intelligence, not just news aggregation.

**🔗 [View Live Platform](https://maremoo2.github.io/CyberNews-2025/)**

---

## 🎯 What Makes This Different

This isn't another security news feed. It's a comprehensive analytical platform that:

- **Separates signal from noise** with curated, high-confidence enrichment
- **Maps incidents to MITRE ATT&CK** with transparent confidence scoring
- **Explains risk** instead of just listing severity numbers
- **Provides executive-level insights** for strategic decision-making
- **Exposes data limitations** transparently (no hype, just methodology)

### Real Methodology. No Hype.

Every metric is explained. Every count is documented. Every limitation is disclosed.

---

## 🚀 Enterprise Features

### 💼 CISO Mode
Executive dashboard with professional filtering:
- **Critical Only**: Severity ≥80/100 for board-level reporting
- **Curated Only**: High-quality enrichment with multi-signal validation
- **High Confidence**: Filter low-confidence mappings for operational use

### 🔗 Attack Chain Reconstruction
Automatic multi-stage attack pattern detection:
- Visualizes: Initial Access → Privilege Escalation → Persistence → Exfiltration
- Shows most common attack paths with real incident examples
- Identifies defense-in-depth gaps

### 📊 Sector Benchmarking
CISO-level risk comparison across industries:
- Critical incident rate by sector
- Exploit-led attack percentages
- Attribution rates and average severity scores
- Enables statements like: *"Energy sector has 2x higher critical rate than Finance"*

### 📈 Trend Acceleration Analysis
Detect emerging vs. declining threats using linear regression:
- **Accelerating threats** (>20% growth) - requires immediate attention
- **Declining threats** (<-20% decline) - validate defensive effectiveness
- **Stable threats** - persistent risk requiring ongoing monitoring

### 🎯 Confidence-Weighted Analytics
Quality over quantity in threat intelligence:
- Formula: `score = count × avg_confidence`
- Ensures one high-confidence incident > five low-confidence buzzword reports
- Confidence weights: high=1.0, medium=0.5, low=0.2

### 🛡️ Detection Gap Analysis
Map MITRE techniques against mentioned security tools:
- Identify where attack techniques dominate but defenses are rarely discussed
- Example: *"T1190 (Exploit Public-Facing Application) appears in 15% of incidents, but WAF mentioned in only 3%"*
- Real control gap analysis for security teams

### 📚 Interactive Cybersecurity Glossary
CISO-friendly terminology support:
- **50+ curated terms** with definitions, categories, and MITRE mappings
- **Hover tooltips** providing instant context for technical terms
- **Searchable glossary panel** with category filtering
- **Term normalization** consolidating variants (spearphishing → phishing)
- **Usage analytics** showing most common terminology patterns

### 🎛️ Global Filter Bar (NEW)
Comprehensive filtering system for precise analysis:
- **Content Type Toggle**: Switch between incidents and articles
- **Severity Filtering**: Critical, high, moderate, or low severity
- **Actor Type**: Filter by nation-state, cybercriminal, hacktivist, or insider threats
- **Sector Filtering**: Target specific industries (finance, healthcare, government, etc.)
- **Region Selection**: Focus on US, Europe, Asia, or Norway
- **Date Range Picker**: Analyze specific time periods
- **Active Filter Summary**: Visual badges showing applied filters

### 📊 Trend Continuity Analysis (NEW)
Month-over-month trend tracking:
- **MoM Percentage Changes**: Track growth or decline in incident volume
- **Trending Attacks**: Identify attacks with >20% increase
- **New Attack Types**: Spot emerging threat vectors
- **Severity Trends**: Track how incident severity changes over time
- **Moving Averages**: Smooth out noise to see real trends

### 📈 Year-over-Year Comparison (NEW)
Strategic 2025 vs 2026 analysis:
- **Side-by-Side Metrics**: Compare total incidents, avg impact, critical events
- **Attack Type Evolution**: See which attacks are growing/declining
- **Sector Trends**: Identify which industries face increased risk
- **Severity Distribution**: Compare overall threat landscape changes
- **Executive Insights**: Automated summary of key changes

### 📆 Quarterly Review Mode (NEW)
Perfect for board presentations and strategic planning:
- **Q1-Q4 Summaries**: Comprehensive quarterly breakdowns
- **QoQ Changes**: Quarter-over-quarter growth indicators
- **Top Attacks & Sectors**: Most impacted areas per quarter
- **Unique Actor Counts**: Track threat actor activity
- **Strategic Focus Areas**: Automated recommendations based on patterns

### ⚖️ Bias Indicator (NEW)
Transparent data quality and limitations:
- **Source Distribution**: Shows which sources dominate the data
- **Regional Bias Detection**: Identifies geographic coverage gaps
- **Language Bias**: Tracks English vs. other language content
- **Bias Alerts**: Automatically flags concentration risks
- **Transparency Notes**: Explains why biases matter for decision-making

### 🧪 Validation Dashboard (NEW)
Self-audit metrics showing system quality:
- **Overall Quality Score**: Composite 0-100 score
- **Deduplication Accuracy**: Measures duplicate detection effectiveness
- **False Merge Rate**: Tracks incorrectly merged incidents
- **Attribution Coverage**: Shows % of incidents with threat actor attribution
- **MITRE Coverage**: Tracks technique mapping completeness
- **Enrichment Completeness**: Measures data enrichment quality
- **Learning System Status**: Shows corrections and improvements over time

### 🧠 Learning Memory System (NEW)
System learns from corrections:
- **False Merge Tracking**: Records and learns from incorrect merges
- **New Term Discovery**: Automatically captures emerging terminology
- **Manual Corrections**: Stores analyst corrections for future reference
- **Attribution Improvements**: Tracks attribution confidence changes
- **Continuous Improvement**: System gets smarter over time

---

## 📋 Core Features

### Analytical Framework
- **MITRE ATT&CK Mapping**: Two-signal validation rule with confidence scores (high/medium/low)
- **Severity Scoring**: Transparent 0-100 point system based on Impact, Exploitability, and Adversary factors
- **Threat Actor Attribution**: Categorized (nation-state, cybercriminal, hacktivist) with confidence levels
- **Strategic Themes**: 10 predefined risk themes (cloud exfiltration, exploit-led, identity abuse, ransomware, etc.)
- **Content Classification**: Separates incidents from vulnerability advisories, policy updates, and opinion pieces

### Data Quality
- **800+ incidents** enriched across 2025-2026
- **Curated subset** with multi-signal validation for operational use
- **Transparent methodology** with documented counting rules and limitations
- **Automated enrichment pipeline** with configurable confidence thresholds
- **Single Source of Truth**: `/config/taxonomy.json` ensures consistency across all definitions
  - Centralized severity levels, actor types, sectors, themes
  - MITRE ATT&CK framework mapping
  - Eliminates inconsistencies across the system

### Interactive Dashboard
- 📊 Regional filtering (US, Europe, Asia, Norway)
- 📅 Monthly timeline with contextual summaries
- 🔍 Full-text search across titles, summaries, and tags
- 🏷️ Tag-based filtering and exploration
- 📱 Responsive design for mobile and desktop
- 🔗 Shareable URLs for filtered views

---

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 19 with hooks and functional components
- **Build Tool**: Vite for fast development and optimized production builds
- **Hosting**: GitHub Pages with automated deployment
- **Data Pipeline**: Node.js enrichment scripts with MITRE ATT&CK integration
- **Deployment**: GitHub Actions CI/CD

### Data Flow
```
RSS Feeds → Inoreader API → fetch-inoreader.js
    ↓
Raw Incidents → enhanced-enrichment.js → Enriched JSON
    ↓
React Components → analyticsUtils.js → Dashboard Visualizations
```

### Enrichment Pipeline
1. **Content Extraction**: Fetch from Inoreader JSON feeds
2. **Severity Scoring**: 0-100 point system with transparent drivers
3. **MITRE Mapping**: Two-signal rule for technique identification
4. **Actor Attribution**: Name recognition + category classification
5. **Theme Classification**: Top 3 themes per incident with confidence
6. **Quality Flagging**: Mark as curated based on enrichment signals

---

---

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Local Development

```bash
# Clone the repository
git clone https://github.com/Maremoo2/CyberNews-2025.git
cd CyberNews-2025

# Install dependencies
npm install

# Start development server
npm run dev
# Open http://localhost:5173
```

### Useful Commands

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Enrich incidents with MITRE ATT&CK and analytics
npm run enrich-enhanced

# Validate year routing
npm run validate-years

# Fetch latest news from RSS feeds (automated via GitHub Actions)
npm run fetch-rss

# Fetch latest news from Inoreader (legacy method)
npm run fetch-news

# Bulk fetch historical 2025 articles (for collecting 40-50k articles)
npm run fetch-2025-bulk -- --max-iterations=100
```

---

## 📊 Analytics & Methodology

### Severity Scoring (0-100 points)

**Impact Factors (0-40 points)**
- Service disruption: +15
- Sensitive data exposure: +15
- Critical infrastructure impact: +20
- Large scale (millions affected): +10

**Exploitability (0-30 points)**
- Exploited in the wild: +20
- Zero-day: +15
- Internet-facing vector: +10

**Adversary (0-15 points)**
- Nation-state actor: +15
- Known ransomware group: +10

**Severity Labels**
- Critical: ≥80 points
- High: 60-79 points
- Moderate: 25-59 points
- Low: <25 points

### MITRE ATT&CK Mapping

**Two-Signal Rule**: Each technique requires multiple keyword matches for confident mapping.

Example for T1567 (Exfiltration Over Web Service):
- Signal 1 (weight 1.0): "exfiltrate", "upload", "leak"
- Signal 2 (weight 0.8): "OneDrive", "S3", "Drive", "Dropbox"
- Total needed: ≥1.0 to map

**Confidence Levels**:
- High: Multiple strong signals, clear attack chain
- Medium: Technique implied from context
- Low: Single keyword match only

### Strategic Themes

10 predefined risk themes, each incident gets up to 3:

1. Cloud Exfiltration & SaaS Abuse
2. Exploit-Led Intrusions
3. Identity & Token Abuse
4. Ransomware & Extortion Economy
5. Supply Chain & Third-Party Compromise
6. Disinformation & Deepfakes
7. Botnets, DDoS & Commodity Malware
8. Mobile/Android & Spyware Ecosystem
9. OT/ICS & Critical Infrastructure
10. Regulatory & Disclosure Pressure

### Known Limitations

Transparently documented in the UI:
- **Media Bias**: English/Western-centric sources
- **Underreporting**: Many incidents never disclosed publicly
- **Survivorship Bias**: Only detected incidents visible
- **Disclosure Lag**: Months/years delay common
- **Attribution Uncertainty**: Often incomplete or misleading
- **Impact Assessment**: Frequently unknown or minimized

---

## 💼 Professional Use Cases

### For Security Analysts
- **Threat Hunting**: Use MITRE ATT&CK mappings to identify techniques in your environment
- **Trend Analysis**: Spot emerging attack patterns before they become widespread
- **Intelligence Reporting**: Export curated incidents for executive briefings
- **Control Validation**: Compare detection gaps against your security stack

### For CISOs & Security Leaders
- **Board Reporting**: CISO Mode provides executive-level summaries with confidence scoring
- **Budget Justification**: Sector benchmarking shows relative risk position
- **Strategic Planning**: Trend acceleration identifies where to invest defensively
- **Risk Communication**: Transparent methodology supports informed decision-making

### For SOC Teams
- **Playbook Development**: Attack chain analysis reveals common multi-stage patterns
- **Detection Engineering**: High-confidence MITRE mappings guide rule creation
- **Threat Intel Integration**: Structured JSON export for SIEM/SOAR platforms
- **Analyst Training**: Real-world incidents mapped to ATT&CK for learning

### For Researchers & Students
- **Dataset Access**: 800+ enriched incidents with transparent methodology
- **Methodology Learning**: Study practical threat intelligence enrichment
- **Academic Research**: Analyze threat trends with confidence-weighted data
- **Portfolio Building**: Demonstrate analytical thinking and technical depth

---

## 📝 For Your Resume/CV

### Project Description Template

**Cybersecurity Threat Intelligence Platform**

Built a threat intelligence platform that enriches 800+ cybersecurity incidents using MITRE ATT&CK mapping, explainable risk scoring, threat actor attribution, and strategic theme analysis. 

Designed enterprise analytics framework with:
- Confidence-weighted MITRE technique scoring (quality over quantity)
- Attack chain reconstruction for multi-stage threat patterns
- Sector benchmarking with cross-industry KPI comparison
- Trend acceleration detection using linear regression
- Transparent methodology with documented data limitations

Technologies: React, Node.js, MITRE ATT&CK, Vite, GitHub Actions

### Interview Talking Points

**"I wanted to move beyond news aggregation, so I built an analytical layer that:"**

1. **Separates signal from noise** - Not every headline is equally important. I use confidence scoring and multi-signal validation to identify high-quality intelligence.

2. **Maps incidents to MITRE ATT&CK** - Each incident is analyzed for techniques and tactics, with confidence levels (high/medium/low) so operational teams know what's actionable.

3. **Explains risk instead of just listing it** - My severity scoring system uses a transparent 0-100 point formula based on Impact, Exploitability, and Adversary factors. Anyone can understand why something is rated "critical."

4. **Provides executive-level insights** - CISO Mode filters to critical incidents with high confidence, sector benchmarking enables strategic comparisons, and attack chain analysis shows defensive priorities.

5. **Exposes limitations transparently** - I document media bias, underreporting, disclosure lag, and other data quality issues. No hype, just honest methodology.

**Technical Depth**: Two-signal rule for MITRE mapping, confidence-weighted analytics (score = count × avg_confidence), linear regression for trend acceleration, React component architecture with custom analytics utilities.

**Business Value**: Enables CISOs to make informed decisions in 10 minutes instead of days, helps SOC teams prioritize threats, and provides strategic insights for budget justification.

---

## 🔄 Automated Data Pipeline

The platform automatically fetches and enriches cybersecurity news every 6 hours via GitHub Actions.

This project automatically fetches cybersecurity news from **33 direct RSS feeds** across global cybersecurity news sources.

### How It Works

The GitHub Actions workflow runs automatically **every 6 hours** to:
1. Fetch articles from 33 RSS feeds directly:
   - **US sources**: CISA, Schneier on Security, TechCrunch, The Verge, New York Times, and more
   - **European sources**: Graham Cluley, Il Sole 24 Ore, Clubic, Infinigate, and more
   - **Asian sources**: South China Morning Post, Mashable India
   - **Global sources**: The Cyber Express, Help Net Security, Cybersecurity Dive, and more
2. Transform articles into the incidents format
3. Auto-generate tags based on article content (ransomware, data-breach, vulnerability, etc.)
4. Calculate impact scores automatically
5. Skip duplicate articles (by URL)
6. Assign sequential IDs (2026001, 2026002, etc.)
7. Auto-commit new articles to appropriate year files (`data/incidents-2026.json`, etc.)

### Manual Trigger

You can manually trigger the news fetch workflow:

1. Go to **Actions** tab in GitHub
2. Select **"Fetch RSS Feeds"** workflow
3. Click **"Run workflow"** button
4. Select the branch and click **"Run workflow"**

The workflow will fetch the latest articles and commit them automatically if new articles are found.

### Test Locally

You can test the fetch script locally:

```bash
# Dry-run (shows what would be added without saving)
npm run fetch-rss -- --dry-run

# Actually fetch and save
npm run fetch-rss
```

**Note**: The RSS feeds are public and don't require authentication. The script includes automatic retry logic and rate limiting.

### Legacy Inoreader Support

The original Inoreader fetcher is still available for backward compatibility:

```bash
# Use Inoreader (old method)
npm run fetch-news
```

### Configuration

The RSS feed configuration is in `config/rss-feeds-config.json`:
- 128 RSS feed URLs with source names (increased from 33)
- Default region/country mappings for each source
- Tag keyword patterns (18+ categories including ransomware, data-breach, vulnerability, phishing, etc.)
- Impact level keywords (1-5 scale)
- Company/product keywords for automatic tagging
- `maxItemsPerFeed`: 500 (increased from 50 to fetch more historical data)

### Bulk Historical Fetch

For collecting large volumes of historical articles (e.g., 40-50k articles from 2025), use the bulk fetch feature:

```bash
# Test with dry run
npm run fetch-2025-bulk -- --dry-run --max-iterations=10

# Run actual bulk fetch (takes 2-3 hours)
npm run fetch-2025-bulk -- --max-iterations=100
```

The bulk fetch uses Inoreader's pagination API to fetch historical articles throughout 2025. See [BULK_FETCH_2025_GUIDE.md](./BULK_FETCH_2025_GUIDE.md) for detailed instructions.

**GitHub Actions:** You can also trigger the bulk fetch via GitHub Actions:
1. Go to Actions → "Fetch 2025 Articles (Bulk)"
2. Click "Run workflow"
3. Configure max_iterations and dry_run options
4. The workflow will automatically commit fetched articles

### Year Routing

The system automatically routes incidents to the correct year file based on their publication date:

- **2025 articles** → `data/incidents-2025.json`
- **2026 articles** → `data/incidents-2026.json`
- Each year has its own ID sequence (e.g., 2025001, 2026001)
- No manual intervention required when transitioning to new years

**Validate year routing:**
```bash
# Verify all incidents are in correct year files
npm run validate-years
```

This ensures no cross-year contamination in the data files. See [YEAR_ROUTING_VERIFIED.md](./YEAR_ROUTING_VERIFIED.md) for details.

## Legge til nye hendelser manuelt

You can still manually add incidents to `data/incidents-2026.json`. Follow this format:

```json
{
  "id": "unik-id",
  "date": "YYYY-MM-DD",
  "title": "Tittel på hendelsen",
  "summary": "En kort beskrivelse av hendelsen",
  "region": "US",
  "country": "Land navn (valgfritt)",
  "sourceName": "Navn på kilden",
  "sourceUrl": "https://link-til-kilde.com",
  "tags": ["tag1", "tag2", "tag3"]
}
```

### Eksempel:

```json
{
  "id": "13",
  "date": "2025-12-19",
  "title": "Ny sikkerhetsoppdatering utgitt",
  "summary": "Kritisk sikkerhetsoppdatering for populær programvare utgitt etter oppdagelse av alvorlig sårbarhet.",
  "region": "EU",
  "country": "Sweden",
  "sourceName": "Security Weekly",
  "sourceUrl": "https://example.com/update",
  "tags": ["security update", "vulnerability", "patch"]
}
```

### Viktige regler:

1. **id**: Må være unik (bruk tall eller UUID)
2. **date**: Må være i formatet YYYY-MM-DD
3. **region**: Må være en av: `"US"`, `"EU"`, `"ASIA"`, eller `"NO"`
4. **impact**: Tall fra 1-5 som indikerer alvorlighetsgrad (1=lav, 5=kritisk). Hendelser med impact ≥ 4 vises når "største saker"-filteret er aktivt
5. **title** og **summary**: Kan inneholde norsk tekst
6. **tags**: Array av strings (valgfritt, men anbefalt)
7. **country**: Valgfritt felt for å spesifisere land

## Deployment

Nettsiden deployes automatisk til GitHub Pages når endringer pushes til `main`-branchen.

### Manuell deployment

1. Commit og push endringer til `main`:
```bash
git add .
git commit -m "Oppdater hendelser"
git push origin main
```

2. GitHub Actions vil automatisk:
   - Bygge prosjektet
   - Deploye til GitHub Pages
   - Nettsiden vil være tilgjengelig på: https://maremoo2.github.io/CyberNews-2025/

### Aktivere GitHub Pages (første gang)

⚠️ **Viktig: Nettsiden vil ikke være tilgjengelig før GitHub Pages er konfigurert!**

Følg disse trinnene nøye for å aktivere GitHub Pages:

1. **Gå til repository Settings**
   - Klikk på "Settings" fanen øverst i repositoryet
   
2. **Velg "Pages" i sidemenyen**
   - I venstre sidemeny under Settings ser du flere seksjoner:
     - Access
     - **Code and automation** ← Se etter denne seksjonen
     - Security
     - Integrations
   - Under "Code and automation" seksjonen, scroll ned til du finner **"Pages"**
   - Klikk på "Pages"
   
3. **Konfigurer Source**
   - Når du er på Pages settings siden, ser du en seksjon kalt **"Build and deployment"**
   - I denne seksjonen finner du **"Source"**
   
   **Hva du kan se:**
   
   **Alternativ A - Dropdown meny:**
   - En dropdown som viser "None" eller "Deploy from a branch"
   - Klikk på den og velg **"GitHub Actions"**
   
   **Alternativ B - Workflow forslag:**
   - Tekst som sier "Use a suggested workflow, browse all workflows, or create your own"
   - Workflow kort som "GitHub Pages Jekyll" eller "Static HTML"
   - **IKKE velg disse workflow templates!**
   - Se etter en mulighet til å velge **"GitHub Actions"** som deployment metode
   - Eller se etter en lenke til "Configure" eller sette opp GitHub Actions deployment
   
   - Målet er å sette Source til **"GitHub Actions"** (ikke en spesifikk workflow template)
   - Ikke velg "Deploy from a branch"
   - Ikke velg workflow templates (Jekyll, Static HTML, etc.)
   - Du MÅ aktivere "GitHub Actions" som deployment source
   - Repositoryet ditt har allerede riktig workflow fil på `.github/workflows/deploy.yml`
   
4. **Lagre og vent**
   - Innstillingene lagres automatisk
   - Workflow vil kjøre automatisk ved neste push til main-branchen
   - Du kan også kjøre workflowen manuelt fra "Actions" fanen
   
5. **Verifiser deployment**
   - Gå til "Actions" fanen i repositoryet
   - Sjekk at "Deploy to GitHub Pages" workflow kjører uten feil
   - Når workflowen er ferdig (grønn hake), vil nettsiden være live på:
     https://maremoo2.github.io/CyberNews-2025/

**Merk:** Når GitHub Pages er aktivert, vil nettsiden automatisk være online 24/7. Du trenger ikke å kjøre noen servere eller betale for hosting. GitHub Pages er gratis for offentlige repositories og håndterer all hosting automatisk.

## Feilsøking (Troubleshooting)

### Nettsiden åpner ikke / 404 Error

**Problem:** Når du går til https://maremoo2.github.io/CyberNews-2025/ får du en 404-feil eller siden lastes ikke.

**Løsning:**
1. **Sjekk at GitHub Pages er aktivert:**
   - Gå til Settings → Pages
   - Verifiser at "Source" er satt til "GitHub Actions"
   
2. **Sjekk workflow status:**
   - Gå til "Actions" fanen
   - Se etter "Deploy to GitHub Pages" workflow
   - Hvis den viser rød X (feilet):
     - Klikk på den feilede kjøringen
     - Les feilmeldingen i "Setup Pages" steget
     - Vanligvis betyr dette at GitHub Pages ikke er aktivert i Settings
   
3. **Kjør workflow på nytt:**
   - Gå til "Actions" fanen
   - Klikk på "Deploy to GitHub Pages" i venstre meny
   - Klikk på "Run workflow" knappen
   - Velg "main" branch og klikk "Run workflow"

4. **Vent på deployment:**
   - Det kan ta 1-2 minutter før endringer blir synlige
   - Prøv å refresh siden eller clear browser cache

### Workflow feiler på "Setup Pages" steget

**Problem:** GitHub Actions workflow feiler med feilmelding om at Pages ikke er konfigurert.

**Løsning:**
Dette betyr at GitHub Pages ikke er aktivert i repository settings. Følg instruksjonene under "Aktivere GitHub Pages (første gang)" ovenfor.

### Endringer vises ikke på nettsiden

**Problem:** Du har pushet endringer til main, men de vises ikke på den live nettsiden.

**Løsning:**
1. Sjekk at workflow har kjørt etter din siste push
2. Vent 1-2 minutter (caching)
3. Hard refresh i nettleseren (Ctrl+Shift+R eller Cmd+Shift+R)
4. Sjekk at build-steget i workflow fullførte uten feil

## Prosjektstruktur

```
CyberNews-2025/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── data/
│   └── incidents.json          # Hendelsesdata
├── public/
│   └── vite.svg               # Statiske filer
├── src/
│   ├── App.jsx                # Hovedkomponent
│   ├── App.css                # Styling
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styling
├── index.html                 # HTML template
├── package.json               # Avhengigheter og scripts
├── vite.config.js             # Vite konfigurasjon
└── README.md                  # Denne filen
```

## Delbare lenker

Nettsiden støtter URL-parametre for enkel deling av filtrerte visninger:

### URL-parametre

- `m` eller `month`: Måned (jan, feb, mar, apr, mai, jun, jul, aug, sep, okt, nov, des)
- `r` eller `region`: Region (us, eu, asia, no)
- `t` eller `tag`: Tag-filter (f.eks. ransomware)
- `major`: Vis kun største saker (true eller 1)

### Shareable URLs

```
# January incidents in Norway
https://maremoo2.github.io/CyberNews-2025/?m=jan&r=no

# November incidents with ransomware tag
https://maremoo2.github.io/CyberNews-2025/?m=nov&t=ransomware

# Critical incidents only from December
https://maremoo2.github.io/CyberNews-2025/?m=des&major=true
```

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and component patterns
- Add comments for complex analytical logic
- Update methodology documentation for new features
- Test enrichment pipeline changes thoroughly

---

## 📚 Documentation

- **[METHODOLOGY.md](./METHODOLOGY.md)** - Detailed analytical methodology
- **[ANALYTICS_PROPOSAL.md](./ANALYTICS_PROPOSAL.md)** - Original design proposal
- **[YEAR_ROUTING_VERIFIED.md](./YEAR_ROUTING_VERIFIED.md)** - Data integrity verification

---

## 📄 License

This project is open source and available under the **MIT License**.

---

## 🙏 Acknowledgments

- **MITRE ATT&CK** framework for structured threat taxonomy
- **Inoreader** for RSS feed aggregation
- **GitHub Pages** for free hosting and CI/CD
- The cybersecurity community for threat intelligence sharing

---

## 📬 Contact

Have questions, feedback, or suggestions? Please [open an issue](https://github.com/Maremoo2/CyberNews-2025/issues) on GitHub.

For collaboration or professional inquiries, connect via GitHub profile.

---

**Built with 🔐 for the cybersecurity community**

*Making threat intelligence accessible, explainable, and actionable.*
