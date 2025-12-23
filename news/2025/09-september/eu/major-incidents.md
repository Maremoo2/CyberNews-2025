# September 2025 - EU Major Incidents

## Major Data Breaches

### Sept 30, 2025 – Harrods (UK)

- **Date:** September 30, 2025
- **Target:** Harrods (London-based luxury retailer)
- **Attack Type:** Third-party vendor breach
- **Impact:** 430,000 customers affected
- **Attribution:** Unidentified threat actor
- **Details:** The London-based luxury retailer Harrods disclosed that a third-party vendor breach exposed data of 430,000 customers. The stolen data included names and contact details (but no payment info). Harrods refused to negotiate with the attackers, and the threat actor remains unidentified. This incident highlights supply-chain risk affecting an EU-adjacent organization (UK) and thousands of European customers. Despite Brexit, the breach had implications for EU customers and demonstrated continuing cross-border data protection concerns.
- **Source:** [CM Alliance - Sept 2025](https://cm-alliance.com)

### Sept 22, 2025 – Stellantis (Netherlands/Multinational)

- **Date:** September 22, 2025
- **Target:** Stellantis (One of world's largest automakers with many EU brands)
- **Attack Type:** Data breach via Salesforce CRM compromise
- **Impact:** Internal emails, documents, and personal information of employees, suppliers, customers, and dealers exposed
- **Attribution:** ShinyHunters (UNC6395)
- **Details:** Stellantis, one of the world's largest automakers (with many EU brands including Peugeot, Citroën, Fiat, Opel), confirmed a data breach stemming from a compromise of its Salesforce CRM via the Salesloft/Drift OAuth token incident. ShinyHunters (UNC6395) were attributed to the attack, which exposed internal emails, documents, and personal information of employees, suppliers, customers, and dealers. The breach was part of a wider campaign targeting multiple companies' Salesforce data. Stellantis notified affected individuals and regulatory authorities across multiple EU jurisdictions.
- **Source:** [CM Alliance - Sept 2025](https://cm-alliance.com)

### Sept 26, 2025 – Kido International (UK)

- **Date:** September 26, 2025
- **Target:** Kido International (18 children's nurseries in London)
- **Attack Type:** Ransomware (Radiant)
- **Impact:** Over 8,000 children's personal data stolen
- **Attribution:** Radiant ransomware group (claiming Russia-based)
- **Details:** Radiant ransomware hackers breached Kido, a company operating 18 children's nurseries in London, stealing personal data on over 8,000 children. Leaked records included children's names, photos, home addresses, family contacts, and even safeguarding notes. The attackers (claiming to be a Russia-based group) posted some stolen data as proof and demanded ransom, threatening to leak more records. This shocking incident (described by experts as "an absolute new low") alarmed EU data protection authorities, given Kido's operations and data also spanned the US and India. While the UK is no longer in the EU, the breach affected EU citizens and raised questions about childcare sector security standards across Europe. Europol coordinated with UK authorities and national cyber units to investigate.
- **Source:** [CM Alliance - Sept 2025](https://cm-alliance.com), [World Economic Forum](https://weforum.org)

## Critical Infrastructure Attacks

### Sept 1, 2025 – Jaguar Land Rover (UK/Slovakia)

- **Date:** September 1, 2025
- **Target:** Jaguar Land Rover (JLR) - Major automotive manufacturer
- **Attack Type:** Cyberattack/Ransomware
- **Impact:** Almost four-week shutdown affecting plants in UK, Slovakia, India, and Brazil
- **Attribution:** "Scattered Lapsus$ Hunters"
- **Details:** Jaguar Land Rover (JLR) was hit by a cyberattack that severely disrupted manufacturing. Production and IT systems were partly shut down for almost four weeks, affecting JLR plants in the UK and EU (Slovakia), as well as India and Brazil. Initially, JLR believed customer data wasn't compromised, but further investigation revealed some sensitive data theft. A threat group calling itself "Scattered Lapsus$ Hunters" claimed responsibility for the attack. This incident not only halted a major automaker's operations but also reverberated through supply chains (leading to parts shortages). The UK government provided financial support through a $2 billion loan guarantee to help JLR recover and resume operations. The extended duration of the disruption (nearly 4 weeks) demonstrated the serious impact of ransomware on critical manufacturing infrastructure.
- **Source:** [CM Alliance - Sept 2025](https://cm-alliance.com), [World Economic Forum](https://weforum.org)

### Sept 19-20, 2025 – Collins Aerospace/European Airports

- **Date:** September 19-20, 2025 (weekend)
- **Target:** Collins Aerospace's vMUSE check-in/boarding system
- **Attack Type:** Ransomware (HardBit)
- **Impact:** Major disruptions at multiple European airports; 100+ flights delayed/canceled
- **Attribution:** HardBit ransomware gang
- **Details:** A ransomware attack on Collins Aerospace's vMUSE check-in/boarding system caused chaos at several major EU airports. Flights were delayed or canceled at Heathrow (UK), Brussels (BE), Berlin (DE), Dublin and Cork (IE) as airports reverted to manual check-ins. Thousands of passengers were affected during the busy weekend travel period. The HardBit ransomware was identified in the attack, and at least one arrest was made in connection with the incident. While this was a third-party IT provider breach, it impacted critical transportation infrastructure across the EU. EU authorities have since called for greater resilience and vendor security oversight in aviation. The incident highlighted the vulnerability of centralized aviation IT systems and the potential for widespread disruption from a single point of failure.
- **Source:** [CM Alliance - Sept 2025](https://cm-alliance.com), [World Economic Forum](https://weforum.org)

## Supply Chain Compromises

### Sept (Early Month) – Salesforce OAuth Token Campaign

- **Date:** September 2025 (ongoing campaign)
- **Target:** Multiple European companies using Salesforce CRM
- **Attack Type:** OAuth token theft and abuse
- **Impact:** Dozens of companies' CRM data accessed
- **Attribution:** ShinyHunters (UNC6395)
- **Details:** The ShinyHunters extortion group exploited stolen OAuth tokens from Salesforce add-ons (Salesloft/Drift) to breach dozens of companies' CRM data. European victims in this campaign included:
  - **Zscaler:** Exposed customer contact info and support cases
  - **Palo Alto Networks:** Compromised Salesforce data
  - **Cloudflare:** Support data and APIs leaked
  - **Stellantis:** Internal emails and personal data (detailed above)
  
  The attack methodology involved voice-phishing (vishing) to compromise OAuth tokens, allowing access to Salesforce CRM systems across multiple organizations. This supply chain attack demonstrated how a single vulnerability in a widely-used third-party integration could cascade across numerous companies. The FBI and CISA issued alerts to warn other Salesforce customers. The campaign led to renewed focus on OAuth token security, API access controls, and vendor security audits across the EU.
- **Source:** [CM Alliance - Sept 2025](https://cm-alliance.com)

### Sept (Mid-Month) – NPM Supply Chain Attacks

- **Date:** September 2025
- **Target:** JavaScript/Node.js ecosystem
- **Attack Type:** Software supply chain compromise
- **Impact:** Estimated 10% of all cloud environments disrupted
- **Attribution:** Unknown (separate from ShinyHunters)
- **Details:** Open-source ecosystems were hit by unprecedented attacks affecting European developers and companies:
  
  **"Shai-Hulud" Worm:**
  - Infected hundreds of npm packages
  - Designed to steal cloud credentials
  - Self-propagating worm functionality
  - Affected companies globally including EU
  
  **NPM Maintainer Account Hijack:**
  - Attackers hijacked npm maintainer Josh Junon's account via phishing
  - Phishing campaign impersonated npm support
  - Injected malware into widely used packages (chalk-template, has-ansi)
  - Packages had over 2.6 billion weekly downloads combined
  - Disrupted approximately 10% of all cloud environments
  - Threat actor not publicly identified
  
  These attacks highlighted the vulnerability of the software supply chain and affected numerous European companies relying on npm packages. The incidents prompted calls for enhanced security measures in open-source package management and maintainer account protection.
- **Source:** [CM Alliance - Sept 2025](https://cm-alliance.com)

## Additional Notable Incidents

### Hackney Council (UK)

- **Date:** Early September 2025
- **Target:** Hackney Council (London borough local authority)
- **Attack Type:** Ransomware
- **Impact:** Disruption of local government services
- **Details:** London's Hackney Council (UK local authority) suffered a notable ransomware incident that disrupted services. While outside EU jurisdiction post-Brexit, the incident served as a reminder that municipal governments remain targets. The attack affected public services including housing, social care, and administrative functions. Council staff worked with the National Cyber Security Centre to contain the incident and restore services. The event prompted other UK and EU local authorities to review their cybersecurity measures.

## Sector Impact Analysis

**Automotive Sector:**
- JLR: 4-week production shutdown across multiple countries
- Stellantis: Major data breach affecting global operations
- Supply chain disruptions rippling across European manufacturing
- UK government intervention required to support recovery

**Aviation Sector:**
- Collins Aerospace attack affected 5 countries simultaneously
- Manual processing at major European hubs
- Passenger travel significantly disrupted
- Calls for mandatory aviation IT security standards

**Technology/Cloud Services:**
- Multiple EU tech companies affected by Salesforce campaign
- Software supply chain attacks (npm) impacted European developers
- Need for enhanced OAuth and API security
- Third-party risk management highlighted

**Childcare/Education:**
- Kido breach demonstrated vulnerability of sensitive sectors
- Inadequate security for children's personal data
- GDPR enforcement implications
- Need for sector-specific security standards

## Regulatory Response

**Immediate Actions:**
- Enhanced critical infrastructure monitoring
- Aviation sector security reviews initiated
- Child protection data security assessments
- Supply chain security guidance updated

**Policy Developments:**
- CER Directive guidelines published (Sept 11)
- Digital Omnibus initiative launched (mid-Sept)
- NIS2 implementation continuing
- CRA preparation accelerated

**Enforcement:**
- Multiple GDPR investigations opened
- Cross-border cooperation on attribution
- Europol coordination with national authorities
- Potential penalties for inadequate security measures

## Key Takeaways

September 2025 in the EU was characterized by:

1. **Supply chain vulnerabilities** causing widespread impact (Salesforce, npm)
2. **Critical infrastructure attacks** requiring government intervention (JLR, airports)
3. **Targeting of vulnerable populations** raising ethical concerns (Kido children)
4. **Regulatory evolution** attempting to balance security and business needs
5. **Cross-border coordination** necessary for effective response
6. **Third-party risk** emerging as top security challenge

The month demonstrated that EU cybersecurity requires both proactive defense measures and adaptive regulatory frameworks to protect citizens, businesses, and critical infrastructure from increasingly sophisticated threats.
