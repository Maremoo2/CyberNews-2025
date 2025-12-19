# Security News Year in Review 2025

En statisk nettside for oversikt over cybersikkerhetshendelser i 2025. Bygget med Vite + React og hostet på GitHub Pages.

---

## 🌐 Se nettsiden live

**👉 [Klikk her for å se Security News Year in Review 2025](https://maremoo2.github.io/CyberNews-2025/)**

Live URL: https://maremoo2.github.io/CyberNews-2025/

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

## Legge til nye hendelser

Hendelser lagres i `data/incidents.json`. For å legge til en ny hendelse, følg dette formatet:

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

1. Gå til repository Settings
2. Velg "Pages" i sidemenyen
3. Under "Source", velg "GitHub Actions"
4. Workflow vil kjøre ved neste push til main

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
