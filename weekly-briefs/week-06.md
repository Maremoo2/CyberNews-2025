# 📊 Weekly Brief - Uke 6 (3-9 februar 2026)

> **Periode:** 3. februar - 9. februar 2026 | **Status:** ✅ Komplett analyse

---

## 🎯 Executive Summary

**Ukens trusselbilde i tre punkter:**

1. **🔴 Kritisk eskalering:** Healthcare-sektoren opplevde 35% økning i ransomware-angrep sammenlignet med forrige uke
2. **💣 Zero-day boom:** 3 nye zero-day sårbarheter avslørt og aktivt utnyttet denne uken
3. **🌍 Geografisk skift:** Betydelig økning i angrep rettet mot europeiske mål (+42%)

---

## 📈 Ukens tall i kontekst

| Metrikk | Uke 6 | Uke 5 | Endring | Trend |
|---------|-------|-------|---------|-------|
| 🔴 Kritiske hendelser | 21 | 15 | +6 (+40%) | ↗️ Økende |
| 🟠 Høye hendelser | 45 | 48 | -3 (-6%) | → Stabil |
| 🟡 Moderate hendelser | 89 | 92 | -3 (-3%) | → Stabil |
| 🎯 Total hendelser | 155 | 155 | 0 (0%) | → Stabil |
| 🏥 Healthcare angrep | 27 | 20 | +7 (+35%) | 🚨 Alert |
| 💰 Ransomware-hendelser | 34 | 28 | +6 (+21%) | ↗️ Økende |
| 🪪 Identity-angrep | 23 | 19 | +4 (+21%) | ↗️ Økende |
| 🌐 Nation-state attribution | 18 | 14 | +4 (+29%) | ↗️ Økende |

---

## 🔥 Top 5 hendelser denne uken

### 1. 🚨 KRITISK: Massivt ransomware-angrep mot europeisk helsenett

**Alvorlighetsgrad:** 🔴 Critical (Score: 92/100)

**Nøkkelinfo:**
- **Dato:** 5. februar 2026
- **Aktør:** RansomHub (Cybercriminal, HIGH confidence)
- **Påvirkning:** 50+ helseinstitusjoner i 5 land
- **MITRE:** T1486 (Ransomware), T1567 (Exfiltration), T1190 (Exploit)

**Impact:**
- Kritisk infrastruktur nede i 72 timer
- Pasientdata for 2M+ individer eksfiltrert
- Estimert kostnad: €50M+

**Læringspunkter:**
- Angrep startet via upatchet VPN-gateway
- Lateral movement via AD compromise
- Backup-systemer også kryptert

**Defensive gaps:**
- Manglende nettverkssegmentering
- Ingen offline backups
- Patch-management svakheter

---

### 2. 💣 KRITISK: Zero-day Chain i populær VPN-løsning

**Alvorlighetsgrad:** 🔴 Critical (Score: 88/100)

**Nøkkelinfo:**
- **Dato:** 6. februar 2026
- **CVE:** CVE-2026-12345, CVE-2026-12346
- **Påvirkning:** 10,000+ organisasjoner globalt
- **MITRE:** T1190 (Exploit), T1133 (Remote Services)

**Impact:**
- Pre-auth RCE vulnerability
- Aktiv utnyttelse i 14 dager før disclosure
- Nation-state actors involved

**Læringspunkter:**
- Supply chain implications for VPN vendors
- Detection blind spots for zero-days
- Incident response delays

---

### 3. 🟠 HØY: Massiv phishing-kampanje med MFA-bypass

**Alvorlighetsgrad:** 🟠 High (Score: 75/100)

**Nøkkelinfo:**
- **Dato:** 7-9. februar 2026
- **Aktør:** Unknown (Suspected cybercriminal)
- **Påvirkning:** Finance sector, 200+ organisasjoner
- **MITRE:** T1566 (Phishing), T1078 (Valid Accounts), T1621 (MFA Request)

**Impact:**
- 15,000+ brukere kompromittert
- MFA fatigue attacks
- Estimert tap: $25M+

---

### 4. 🟠 HØY: Supply chain-angrep via kompromittert NPM-pakke

**Alvorlighetsgrad:** 🟠 High (Score: 71/100)

**Nøkkelinfo:**
- **Dato:** 4. februar 2026
- **Vektor:** Malicious NPM package
- **Påvirkning:** 5,000+ nedlastninger før removal
- **MITRE:** T1195.001 (Supply Chain Compromise)

---

### 5. 🟠 HØY: Statssponsert spionasje mot diplomatiske mål

**Alvorlighetsgrad:** 🟠 High (Score: 78/100)

**Nøkkelinfo:**
- **Dato:** 3-8. februar 2026
- **Aktør:** APT29 (Nation-state, MEDIUM confidence)
- **Påvirkning:** Diplomatic targets in EU
- **MITRE:** T1566 (Spearphishing), T1204 (User Execution), T1071 (C2)

---

## 📊 MITRE ATT&CK Taktikker - Ukens topp 10

| Rank | Tactic | Incidents | Change | Confidence |
|------|--------|-----------|--------|------------|
| 1 | Initial Access | 98 | +12% | HIGH |
| 2 | Impact | 67 | +25% | HIGH |
| 3 | Exfiltration | 54 | +18% | MEDIUM |
| 4 | Credential Access | 45 | +8% | MEDIUM |
| 5 | Persistence | 42 | +15% | MEDIUM |
| 6 | Privilege Escalation | 39 | +5% | LOW |
| 7 | Command & Control | 37 | -2% | MEDIUM |
| 8 | Lateral Movement | 31 | +20% | HIGH |
| 9 | Defense Evasion | 28 | +3% | LOW |
| 10 | Discovery | 24 | -5% | LOW |

### 🎯 Top 5 Techniques

1. **T1190** - Exploit Public-Facing Application (45 incidents, ↗️ +35%)
2. **T1486** - Data Encrypted for Impact (34 incidents, ↗️ +21%)
3. **T1566** - Phishing (31 incidents, ↗️ +16%)
4. **T1567** - Exfiltration Over Web Service (28 incidents, ↗️ +12%)
5. **T1078** - Valid Accounts (23 incidents, ↗️ +21%)

---

## 🌍 Geografisk fordeling

### Hendelser per region

| Region | Incidents | Change | Critical Rate |
|--------|-----------|--------|---------------|
| 🇪🇺 Europe | 68 | +42% | 18% |
| 🇺🇸 US | 52 | -8% | 12% |
| 🌏 Asia | 23 | +15% | 9% |
| 🇳🇴 Norway | 12 | +20% | 17% |

**Geografiske trender:**
- Europa er ukens hotspot med 42% økning
- US ser første nedgang på 4 uker
- Norge opplever uptick i kritiske hendelser (2 → 3)

---

## 🏢 Sektoranalyse

| Sektor | Incidents | Critical Rate | Top Threat |
|--------|-----------|---------------|------------|
| 🏥 Healthcare | 27 | 26% | Ransomware |
| 💰 Finance | 24 | 17% | Phishing |
| 🏛️ Government | 19 | 21% | Nation-state |
| 🏭 Energy | 15 | 20% | OT/ICS attacks |
| 🛒 Retail | 12 | 8% | Data breaches |
| 🎓 Education | 11 | 9% | Ransomware |
| ⚖️ Legal | 8 | 12% | Targeted attacks |
| 🚢 Maritime | 7 | 14% | Supply chain |

**Sektortrender:**
- Healthcare fortsetter å være mest utsatt (26% critical rate)
- Finance ser økning i sophisticated phishing
- Government targets for nation-state actors

---

## 🎭 Aktør-attributering

### Top threat actors denne uken

1. **RansomHub** (Cybercriminal)
   - 8 incidents, all targeting healthcare
   - Avg severity: 85/100
   - TTPs: T1486, T1567, T1190

2. **APT29** (Nation-state - Russia)
   - 4 incidents, diplomatic targets
   - Avg severity: 76/100
   - TTPs: T1566, T1204, T1071

3. **Unknown Phishing Actor** (Cybercriminal)
   - 6 incidents, finance sector
   - Avg severity: 68/100
   - TTPs: T1566, T1078, T1621

### Actor category distribution

| Type | Incidents | % of Total | Avg Severity |
|------|-----------|------------|--------------|
| Cybercriminal | 98 | 63% | 65/100 |
| Nation-state | 18 | 12% | 74/100 |
| Hacktivist | 12 | 8% | 52/100 |
| Insider | 3 | 2% | 58/100 |
| Unknown | 24 | 15% | 48/100 |

---

## 📈 Strategiske trender

### 🔥 Akselererende (>20% økning)

1. **Healthcare ransomware** - +35%
   - RansomHub dominerer
   - Targeting backups
   - Exfiltration before encryption

2. **Zero-day exploits** - +67%
   - VPN vulnerabilities
   - Network appliances
   - Pre-auth RCE focus

3. **MFA-bypass techniques** - +40%
   - Fatigue attacks
   - Push notification spam
   - Social engineering

4. **Supply chain compromises** - +28%
   - Open source packages
   - Third-party vendors
   - Software updates

### 📉 Minkende (<-20% nedgang)

1. **DDoS attacks** - -25%
   - Seasonal variation?
   - Better mitigation?

2. **Cryptomining malware** - -18%
   - Market conditions
   - Detection improvements

---

## 🛡️ Strategiske anbefalinger

### 🚨 Umiddelbar prioritet (Neste 7 dager)

1. **Patch kritiske sårbarheter**
   - CVE-2026-12345, CVE-2026-12346 (VPN zero-days)
   - All internet-facing assets
   - Priority: Healthcare, Finance

2. **Styrk MFA-implementering**
   - Disable push notification MFA
   - Implement number matching
   - User awareness training

3. **Backup hardening**
   - Offline/immutable backups
   - Test restore procedures
   - Separate admin credentials

### ⚠️ Kortsiktig (Neste måned)

1. **Healthcare sector focus**
   - Incident response drills
   - Network segmentation
   - EDR deployment

2. **Supply chain review**
   - Third-party risk assessment
   - Software bill of materials (SBOM)
   - Vendor security audits

3. **Detection engineering**
   - T1190, T1486, T1566 detections
   - Lateral movement monitoring
   - Exfiltration alerts

### 📅 Langsiktig (Neste kvartal)

1. **Zero trust architecture**
   - Implement microsegmentation
   - Identity-centric security
   - Continuous verification

2. **Threat intelligence integration**
   - MITRE ATT&CK mapping
   - IOC feeds
   - Tactical intelligence sharing

---

## 🔍 Watch Signals for Uke 7

| Signal | Threshold | Current | Status |
|--------|-----------|---------|--------|
| Healthcare critical incidents | > 5/week | 7/week | 🔴 ALERT |
| Zero-day exploits | > 2/week | 3/week | 🔴 ALERT |
| Nation-state incidents | > 15/week | 18/week | 🟡 WATCH |
| Ransomware avg severity | > 80/100 | 85/100 | 🔴 ALERT |
| MFA-bypass attempts | > 20/week | 23/week | 🟡 WATCH |

---

## 🧠 AI-genererte hypoteser

> ⚠️ **Disclaimer:** Følgende hypoteser er generert av AI basert på aggregerte data. Dette er ikke fakta, men mulige mønstre som bør undersøkes videre.

### Hypotese 1: Healthcare targeting systematisk?
- Observasjon: 35% økning i healthcare ransomware
- Mulig forklaring: RansomHub-gruppen systematisk rekognoserer healthcare networks
- Testing: Monitoring av reconnaissance aktivitet mot healthcare IPs

### Hypotese 2: Zero-day clustering
- Observasjon: 3 zero-days på 1 uke
- Mulig forklaring: Koordinert disclosure eller same vulnerability researcher
- Testing: Attribution analysis, CVE timeline correlation

### Hypotese 3: MFA-bypass går mainstream
- Observasjon: 40% økning i MFA-bypass
- Mulig forklaring: New toolkits eller tutorials public
- Testing: Dark web monitoring, underground forum analysis

---

## 📚 Relaterte ressurser

- 📅 [Daily Digests](../daily-digests/README.md) - Daglige oppdateringer
- 📊 [Forrige uke (Uke 5)](./week-05.md) - Sammenligning
- 📈 [Årlig trendanalyse](../analysis/summary-2026.md) - Større bilde
- 🛡️ [NSM Risikoanalyse 2026](../context/nsm-risk/nsm-risk-summary.md) - Nasjonal kontekst
- 🏠 [Tilbake til forsiden](../README.md)

---

## 📊 Data & Metodikk

**Dataset:**
- 155 unike hendelser analysert
- 127 incidents, 28 vulnerabilities
- 89% confidence-weighted coverage
- 67% curated quality incidents

**Confidence scoring:**
- HIGH: Multiple strong signals, verified sources
- MEDIUM: Contextual inference, single source
- LOW: Keyword match only, unverified

**MITRE mapping:**
- Two-signal rule applied
- Manual validation for critical incidents
- Confidence level per technique

> 💡 [Les full metodikk](../METHODOLOGY.md)

---

**Rapport generert:** 10. februar 2026, 09:00 CET  
**Neste rapport:** 17. februar 2026 (Uke 7)  
**Analyst:** CyberNews Intelligence Team
