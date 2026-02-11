# Instruksjoner for NIST Cybersecurity Framework PDF-dokumenter

## 📁 Hvor skal du plassere PDF-ene?

Plasser dine 2 PDF-dokumenter i følgende mappe:

```
/public/documents/nist/
```

## 📄 Foreslåtte filnavn

For å få lenker til å fungere optimalt, bruk disse filnavnene:

1. **NIST-CSF-2.0.pdf** - NIST Cybersecurity Framework version 2.0
2. **NIST-implementation-guide.pdf** - Implementeringsguide for NIST CSF

## 🔗 Slik legger du til PDF-ene

### Steg 1: Kopier PDF-ene til riktig mappe

```bash
# Fra prosjektets rotmappe
cp /sti/til/din/første.pdf public/documents/nist/NIST-CSF-2.0.pdf
cp /sti/til/din/andre.pdf public/documents/nist/NIST-implementation-guide.pdf
```

### Steg 2: Verifiser at filene er på plass

```bash
ls -la public/documents/nist/
```

Du skal se:
- README.md
- NIST-CSF-2.0.pdf
- NIST-implementation-guide.pdf

## 🌐 Hvordan PDF-ene blir tilgjengelige

Når PDF-ene er plassert i `/public/documents/nist/`, vil de automatisk være tilgjengelige på nettsiden:

- NIST CSF 2.0: `https://din-nettside.no/documents/nist/NIST-CSF-2.0.pdf`
- Implementation Guide: `https://din-nettside.no/documents/nist/NIST-implementation-guide.pdf`

## 📊 Hvor vises NIST-informasjonen?

NIST-informasjonen vises i **"Regulatory Landscape & Compliance Impact"**-seksjonen på nettsiden:

1. **I navigasjonen:** Klikk på "⚖️ Regulation Impact"
2. **På siden:** Klikk på "▶ Show more details" for å se all informasjon
3. **NIST-kortet:** Inneholder grunnleggende informasjon og lenker
4. **Detaljert NIST-seksjon:** Omfattende oversikt med all informasjon om NIST CSF

## 🎨 Hva er inkludert i oppdateringen?

### 1. Utvidet NIST-kort
- Beskrivelse av NIST Cybersecurity Framework 2.0
- De seks kjernefunksjonene (Core Functions)
- Implementeringsnivåer (Tiers)
- Profiler og tilpasning
- Globalt vedtatt rammeverk
- Lenker til ressurser (NIST.gov, dokumentasjon, og PDF-er)

### 2. Ny detaljert NIST-seksjon
En dedikert seksjon med:
- ✅ Om NIST Cybersecurity Framework
- ✅ De seks kjernefunksjonene i detalj
- ✅ Implementation Tiers
- ✅ Framework Profiles
- ✅ NIST CSF 2.0 - Hva er nytt
- ✅ Globalt vedtak og anvendelse
- ✅ Integrasjon med andre rammeverk
- ✅ Praktiske implementeringstips

### 3. Eksterne lenker
- ✅ [Official NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- ✅ [NIST CSF Documentation](https://csrc.nist.gov/projects/cybersecurity-framework)
- ✅ [NIST Publications](https://csrc.nist.gov/publications)

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
# Scroll ned til NIST-kortet og den detaljerte seksjonen
# Test at lenkene fungerer
```

## 📋 Sjekkliste

- [x] Opprettet `/public/documents/nist/` mappe
- [ ] Kopiert første PDF til `public/documents/nist/NIST-CSF-2.0.pdf`
- [ ] Kopiert andre PDF til `public/documents/nist/NIST-implementation-guide.pdf`
- [ ] Testet lokalt med `npm run dev`
- [ ] Verifisert at PDF-lenkene fungerer
- [ ] Bygget prosjektet med `npm run build`
- [ ] Deployet til produksjon

## 💡 Tips

1. **PDF-størrelse:** Hold PDF-filene under 10 MB hvis mulig for raskere lasting
2. **Filnavn:** Bruk de foreslåtte filnavnene for beste kompatibilitet
3. **Backup:** Ta backup av originale PDF-er før du kopierer dem
4. **Git:** Legg til PDF-ene i Git hvis du vil versjonskontrollere dem, eller legg til `*.pdf` i `.gitignore` hvis de er for store

## ❓ Spørsmål?

Hvis du har spørsmål om:
- Plassering av filer → Se `/public/documents/nist/`
- Oppdatering av innhold → Se `src/components/RegulationImpact.jsx`
- Styling → Se `src/components/RegulationImpact.css`
- Lenker → Sjekk `resources` array i NIST-objektet i `RegulationImpact.jsx`

## 📝 Notater

- PDF-filene serveres direkte fra `/public/` mappen
- Alle filer i `/public/` blir kopiert til byggemappen (`dist/`) under bygging
- PDF-ene vil være tilgjengelige på samme relative sti i produksjon
- Hvis du endrer filnavnene, må du også oppdatere lenkene i `RegulationImpact.jsx`
