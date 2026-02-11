# Instruksjoner for NIS2 PDF-dokumenter

## 📁 Hvor skal du plassere PDF-ene?

Plasser dine 2 PDF-dokumenter i følgende mappe:

```
/public/documents/nis2/
```

## 📄 Foreslåtte filnavn

For å få lenker til å fungere optimalt, bruk disse filnavnene:

1. **NIS2-direktiv-norsk.pdf** - Norsk versjon av NIS2-direktivet
2. **NIS2-directive-english.pdf** - Engelsk versjon av NIS2-direktivet

## 🔗 Slik legger du til PDF-ene

### Steg 1: Kopier PDF-ene til riktig mappe

```bash
# Fra prosjektets rotmappe
cp /sti/til/din/første.pdf public/documents/nis2/NIS2-direktiv-norsk.pdf
cp /sti/til/din/andre.pdf public/documents/nis2/NIS2-directive-english.pdf
```

### Steg 2: Verifiser at filene er på plass

```bash
ls -la public/documents/nis2/
```

Du skal se:
- README.md
- NIS2-direktiv-norsk.pdf
- NIS2-directive-english.pdf

## 🌐 Hvordan PDF-ene blir tilgjengelige

Når PDF-ene er plassert i `/public/documents/nis2/`, vil de automatisk være tilgjengelige på nettsiden:

- Norsk PDF: `https://din-nettside.no/documents/nis2/NIS2-direktiv-norsk.pdf`
- Engelsk PDF: `https://din-nettside.no/documents/nis2/NIS2-directive-english.pdf`

## 📊 Hvor vises NIS2-informasjonen?

NIS2-informasjonen vises i **"Regulatory Landscape & Compliance Impact"**-seksjonen på nettsiden:

1. **I navigasjonen:** Klikk på "⚖️ Regulation Impact"
2. **På siden:** Klikk på "▶ Show more details" for å se all informasjon
3. **NIS2-kortet:** Inneholder grunnleggende informasjon og lenker
4. **Detaljert NIS2-seksjon:** Omfattende oversikt med all informasjon fra regjeringen.no

## 🎨 Hva er inkludert i oppdateringen?

### 1. Utvidet NIS2-kort
- Offisielt navn på norsk og engelsk
- Beskrivelse av direktivet
- Utvidede krav (7 punkter)
- Dekning av sektorer (vesentlige og viktige)
- Sanksjoner og bøter
- Implementeringsfrist
- Lenker til ressurser (EU-lov, regjeringen.no, og PDF-er)

### 2. Ny detaljert NIS2-seksjon
En dedikert seksjon med:
- ✅ Om NIS2-direktivet (norsk og engelsk)
- ✅ Status og viktige datoer
- ✅ Bakgrunn og formål
- ✅ Virkeområde og omfattede sektorer
- ✅ Størrelseskriterier for virksomheter
- ✅ Styrking av sikkerhetskravene
- ✅ Varsling av hendelser
- ✅ Tilsyn og sanksjoner
- ✅ Samarbeidsmekanismer på EU-nivå
- ✅ Norge og NIS2

### 3. Eksterne lenker
- ✅ [Offisiell EU-lovtekst](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:52020PC0823)
- ✅ [Norsk regjeringens EØS-notat](https://www.regjeringen.no/no/sub/eos-notatbasen/notatene/2021/feb/nis2-direktivet/id2846097/)

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
# Scroll ned til NIS2-kortet og den detaljerte seksjonen
# Test at lenkene fungerer (eksterne lenker skal fungere, PDF-lenker når filene er på plass)
```

## 📋 Sjekkliste

- [ ] Opprettet `/public/documents/nis2/` mappe (✅ Allerede gjort)
- [ ] Kopiert første PDF til `public/documents/nis2/NIS2-direktiv-norsk.pdf`
- [ ] Kopiert andre PDF til `public/documents/nis2/NIS2-directive-english.pdf`
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
- Plassering av filer → Se `/public/documents/nis2/`
- Oppdatering av innhold → Se `src/components/RegulationImpact.jsx`
- Styling → Se `src/components/RegulationImpact.css`
- Lenker → Sjekk `resources` array i NIS2-objektet i `RegulationImpact.jsx`

## 📝 Notater

- PDF-filene serveres direkte fra `/public/` mappen
- Alle filer i `/public/` blir kopiert til byggemappen (`dist/`) under bygging
- PDF-ene vil være tilgjengelige på samme relative sti i produksjon
- Hvis du endrer filnavnene, må du også oppdatere lenkene i `RegulationImpact.jsx`
