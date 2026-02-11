# Instruksjoner for DORA PDF-dokumenter

## 📁 Hvor skal du plassere PDF-ene?

Plasser dine 2 PDF-dokumenter i følgende mappe:

```
/public/documents/dora/
```

## 📄 Foreslåtte filnavn

For å få lenker til å fungere optimalt, bruk disse filnavnene:

1. **DORA-regulation-norwegian.pdf** - Norsk versjon av DORA-forordningen
2. **DORA-regulation-english.pdf** - Engelsk versjon av DORA-forordningen

## 🔗 Slik legger du til PDF-ene

### Steg 1: Kopier PDF-ene til riktig mappe

```bash
# Fra prosjektets rotmappe
cp /sti/til/din/første.pdf public/documents/dora/DORA-regulation-norwegian.pdf
cp /sti/til/din/andre.pdf public/documents/dora/DORA-regulation-english.pdf
```

### Steg 2: Verifiser at filene er på plass

```bash
ls -la public/documents/dora/
```

Du skal se:
- README.md
- DORA-regulation-norwegian.pdf
- DORA-regulation-english.pdf

## 🌐 Hvordan PDF-ene blir tilgjengelige

Når PDF-ene er plassert i `/public/documents/dora/`, vil de automatisk være tilgjengelige på nettsiden:

- Norsk PDF: `https://din-nettside.no/documents/dora/DORA-regulation-norwegian.pdf`
- Engelsk PDF: `https://din-nettside.no/documents/dora/DORA-regulation-english.pdf`

## 📊 Hvor vises DORA-informasjonen?

DORA-informasjonen vises i **"Regulatory Landscape & Compliance Impact"**-seksjonen på nettsiden:

1. **I navigasjonen:** Klikk på "⚖️ Regulation Impact"
2. **På siden:** Klikk på "▶ Show more details" for å se all informasjon
3. **DORA-kortet:** Inneholder grunnleggende informasjon og lenker
4. **Detaljert DORA-seksjon:** Omfattende oversikt med all informasjon om DORA på norsk

## 🎨 Hva er inkludert i oppdateringen?

### 1. Utvidet DORA-kort
- Offisielt navn på norsk og engelsk
- Beskrivelse av forordningen
- De fem hovedområdene i DORA
- Ikrafttredelsesdato
- Virkeområde (finanssektoren)
- Sanksjoner og bøter (opptil 50 millioner kroner)
- Lenker til ressurser (EU-lov, Finans Norge, PwC, og PDF-er)

### 2. Ny detaljert DORA-seksjon (på norsk)
En dedikert seksjon med:
- ✅ Hva er DORA?
- ✅ Når trer DORA i kraft?
- ✅ Hvem omfattes av DORA?
- ✅ De fem hovedområdene i DORA
  - IKT risikostyring
  - Hendelsesrapportering
  - Testing av motstandsdyktighet
  - Risikostyring av IKT-tredjeparter
  - Informasjonsdeling
- ✅ Ansvaret ligger hos ledelsen
- ✅ Tredjepartsleverandører og kritisk IKT
- ✅ Klassifisering av kritiske IKT-leverandører
- ✅ Konsekvenser og sanksjoner
- ✅ Hvordan forberede seg til DORA
- ✅ Metodikk for modenhetsanalyse

### 3. Eksterne lenker
- ✅ [Official EU Legal Text](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32022R2554)
- ✅ [Finans Norge - DORA](https://www.finansnorge.no/tema/digitalisering/eus-digitale-agenda/forordningen-om-digital-operasjonell-motstandskraft---dora/)
- ✅ [PwC Norge - DORA Guide](https://www.pwc.no/no/innsikt/dora-alt-du-trenger-a-vite.html)

## 🔄 Oppdatering etter at PDF-er er lagt til

Etter at du har lagt PDF-ene i mappen, bygge og deploy nettsiden på nytt:

```bash
# Bygg prosjektet
npm run build

# Deploy (avhenger av din deployment-metode)
# For eksempel: git add, commit, push, eller annen CI/CD
```

## 🚀 Testing

For å teste lokalt før deployment:

```bash
# Start utviklingsserver
npm run dev

# Åpne nettleseren på http://localhost:5173
# Naviger til "⚖️ Regulation Impact" seksjonen
# Klikk "Show more details"
# Scroll ned til DORA-kortet og den detaljerte seksjonen
# Test at lenkene fungerer (eksterne lenker skal fungere, PDF-lenker når filene er på plass)
```

## 📋 Sjekkliste

- [x] Opprettet `/public/documents/dora/` mappe
- [ ] Kopiert første PDF til `public/documents/dora/DORA-regulation-norwegian.pdf`
- [ ] Kopiert andre PDF til `public/documents/dora/DORA-regulation-english.pdf`
- [ ] Testet lokalt med `npm run dev`
- [ ] Verifisert at PDF-lenkene fungerer
- [ ] Bygget prosjektet med `npm run build`
- [ ] Deployet til produksjon

## 💡 Tips

1. **PDF-størrelse:** Hold PDF-filene under 10 MB hvis mulig for raskere lasting
2. **Filnavn:** Bruk de foreslåtte filnavnene for beste kompatibilitet
3. **Backup:** Ta backup av originale PDF-er før du kopierer dem
4. **Git:** Legg til PDF-ene i Git hvis du vil versjonskontrollere dem, eller legg til `*.pdf` i `.gitignore` hvis de er for store

## 💼 Om DORA

DORA (Digital Operational Resilience Act) er en EU-forordning som trådte i kraft 17. januar 2025 i EU, og 1. juli 2025 i Norge. Forordningen stiller krav til digital operasjonell motstandsdyktighet i finanssektoren og er viktig for:

- Banker
- Forsikringsselskaper
- Verdipapirforetak
- Betalingstjenester
- Kryptovaluta-tjenester
- Og mange flere finansielle aktører

## ❓ Spørsmål?

Hvis du har spørsmål om:
- Plassering av filer → Se `/public/documents/dora/`
- Oppdatering av innhold → Se `src/components/RegulationImpact.jsx`
- Styling → Se `src/components/RegulationImpact.css`
- Lenker → Sjekk `resources` array i DORA-objektet i `RegulationImpact.jsx`

## 📝 Notater

- PDF-filene serveres direkte fra `/public/` mappen
- Alle filer i `/public/` blir kopiert til byggemappen (`dist/`) under bygging
- PDF-ene vil være tilgjengelige på samme relative sti i produksjon
- Hvis du endrer filnavnene, må du også oppdatere lenkene i `RegulationImpact.jsx`
- DORA-seksjonen er hovedsakelig på norsk siden dette er spesielt relevant for norske finansaktører
