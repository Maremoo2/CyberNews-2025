# Security News Year in Review 2025

En statisk nettside for oversikt over cybersikkerhetshendelser i 2025. Bygget med Vite + React og hostet på GitHub Pages.

---

## 🌐 Se nettsiden live

**👉 [Klikk her for å se Security News Year in Review 2025](https://maremoo2.github.io/CyberNews-2025/)**

Live URL: https://maremoo2.github.io/CyberNews-2025/

> **⚠️ Viktig:** Hvis lenken ikke fungerer, må GitHub Pages aktiveres i repository settings. Se [Aktivere GitHub Pages](#aktivere-github-pages-første-gang) for instruksjoner. Etter aktivering vil nettsiden automatisk være online 24/7 uten ytterligere konfigurasjon.

---

## Funksjoner

- 📊 **Regionsfiltrering**: Filtrer hendelser etter US, Europa, Asia, Norge eller vis alle
- 📅 **Månedsfilter**: Velg spesifikk måned eller se alle måneder (dropdown på mobil, knapper på desktop)
- 📰 **Månedlige sammendrag**: Kontekstuelle sammendrag for hver måned som gir oversikt over hovedtrender
- 🔥 **Største saker-filter**: Toggle for å vise kun hendelser med høy impact (≥ 4)
- 🔗 **Delbare lenker**: URL-parametre for enkel deling av filtrerte visninger
- 🔍 **Søkefunksjon**: Søk i titler, sammendrag og tags
- 🏷️ **Tag-filtrering**: Klikk på tags for å filtrere hendelser
- 📱 **Responsivt design**: Mobil-først design som fungerer på alle enheter
- 🔢 **Dynamiske tellere**: Antall hendelser per region oppdateres basert på valgt måned
- ⏱️ **Sortert etter dato**: Nyeste hendelser vises først

## Tech Stack

- **Frontend**: React 19 (JavaScript)
- **Build Tool**: Vite
- **Hosting**: GitHub Pages
- **Data**: Statisk JSON-fil (`data/incidents.json`)
- **Deployment**: GitHub Actions

## Kom i gang lokalt

### Forutsetninger

- Node.js versjon 18 eller nyere
- npm (følger med Node.js)

### Installasjon

1. Klon repositoryet:
```bash
git clone https://github.com/Maremoo2/CyberNews-2025.git
cd CyberNews-2025
```

2. Installer avhengigheter:
```bash
npm install
```

3. Start utviklingsserver:
```bash
npm run dev
```

4. Åpne nettleseren på `http://localhost:5173`

### Andre nyttige kommandoer

```bash
# Bygg for produksjon
npm run build

# Forhåndsvis produksjonsbygg lokalt
npm run preview

# Kjør linter
npm run lint
```

## 🔄 Automated News Aggregation

This project automatically fetches cybersecurity news from Inoreader RSS feeds and adds them to the incidents database.

### How It Works

The GitHub Actions workflow runs automatically **every 6 hours** to:
1. Fetch articles from 3 Inoreader JSON feeds:
   - **Cyber** (US-focused cybersecurity news)
   - **Data/IT** (European data and IT security news)
   - **Offentlig/Microsoft** (Norwegian public sector and Microsoft news)
2. Transform articles into the incidents format
3. Auto-generate tags based on article content
4. Skip duplicate articles (by URL)
5. Assign sequential IDs (2026001, 2026002, etc.)
6. Auto-commit new articles to `data/incidents-2026.json`

### Manual Trigger

You can manually trigger the news fetch workflow:

1. Go to **Actions** tab in GitHub
2. Select **"Fetch Inoreader News"** workflow
3. Click **"Run workflow"** button
4. Select the branch and click **"Run workflow"**

The workflow will fetch the latest articles and commit them automatically if new articles are found.

### Test Locally

You can test the fetch script locally:

```bash
# Dry-run (shows what would be added without saving)
npm run fetch-news -- --dry-run

# Actually fetch and save
npm run fetch-news
```

**Note**: The Inoreader feeds are public JSON endpoints and don't require authentication.

### Configuration

The feed configuration is in `config/inoreader-config.json`:
- Feed URLs
- Default region/country mappings
- Tag keyword patterns
- Impact level keywords

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

### Eksempler på delbare lenker

```
# Januar hendelser i Norge
https://maremoo2.github.io/CyberNews-2025/?m=jan&r=no

# November hendelser med ransomware-tag
https://maremoo2.github.io/CyberNews-2025/?m=nov&t=ransomware

# Kun største saker fra desember
https://maremoo2.github.io/CyberNews-2025/?m=des&major=true

# Norge hendelser fra november
https://maremoo2.github.io/CyberNews-2025/?m=nov&r=no
```

## Bidra

For å bidra til prosjektet:

1. Fork repositoryet
2. Opprett en ny branch (`git checkout -b feature/ny-funksjon`)
3. Commit endringene (`git commit -m 'Legg til ny funksjon'`)
4. Push til branchen (`git push origin feature/ny-funksjon`)
5. Opprett en Pull Request

## Lisens

Dette prosjektet er open source og tilgjengelig under MIT-lisensen.

## Kontakt

For spørsmål eller tilbakemeldinger, vennligst opprett et issue i GitHub-repositoryet.
