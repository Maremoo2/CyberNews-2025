# Cybersecurity Incidents – December 2025

## Global Overview

### Trends & Analysis

December 2025 marked a significant culmination of cybersecurity challenges throughout the year, with major international cyber operations, unprecedented coordinated takedowns, massive data breaches, and the continued rise of AI-driven fraud. The month demonstrated both the growing sophistication of threat actors and the increasing effectiveness of coordinated law enforcement responses. From INTERPOL's "Operation Sentinel" resulting in 574 arrests across Africa to the FBI's disruption of the "Prince Group" network confiscating approximately $15 billion in illicit cryptocurrency, December showcased the global scale of both cybercrime and the response efforts.

Prolific extortion groups struck global platforms with devastating impact: ShinyHunters breached Pornhub compromising over 200 million user records and SoundCloud affecting approximately 28 million accounts. These attacks on major consumer platforms highlighted the persistent vulnerabilities in widely-used services and the massive scale of personal data exposure. Meanwhile, several state-linked Advanced Persistent Threat (APT) groups launched multi-country campaigns, with Check Point researchers documenting "Ink Dragon" attacks against European Union and Asian governments, and the emergence of the new China-aligned "LongNosedGoblin" group conducting espionage operations across Southeast Asia and Japan.

The rapid exploitation of zero-day vulnerabilities reached alarming speeds in December. Amazon security teams reported that China-nexus threat groups began exploiting CVE-2025-55182 (React2Shell) within hours of its public disclosure, demonstrating unprecedented speed in weaponizing newly discovered flaws. Critical vulnerabilities in HPE OneView, WatchGuard Firebox, and Fortinet products saw active exploitation, affecting enterprise infrastructure globally. This trend toward immediate exploitation of disclosed vulnerabilities significantly compressed the window for defensive patching, placing enormous pressure on security teams worldwide.

Perhaps most concerning was the acceleration of AI-driven fraud. Deepfake-as-a-service appeared in approximately 30% of corporate impersonation scams in 2025, representing a dramatic shift in attack sophistication. AI-enhanced phishing and voice-fraud campaigns contributed to an estimated $12.5 billion in U.S. losses alone, with F-Secure research finding that 89% of phishing and social engineering scams employed AI-generated content including deepfakes and synthetic voices. The democratization of these AI-powered attack tools lowered the barrier to entry for cybercriminals and dramatically increased the believability and success rates of social engineering attacks.

### Coordinated International Takedowns

December 2025 saw unprecedented coordination in law enforcement actions against cybercriminal networks:

**INTERPOL Operation Sentinel (October–November 2025, announced December):**
- Spanned 19 countries across Africa
- Resulted in 574 arrests
- Approximately $3 million recovered
- Targeted fraud and ransomware rings
- Demonstrated effectiveness of international coordination in African cybercrime landscape
- Operations focused on payment fraud, romance scams, and ransomware operations
- Highlighted Africa's growing importance in global cybercrime ecosystem

**Source:** [INTERPOL - 574 arrests and USD 3 million recovered](https://interpol.int)

**U.S.–European E-Note Takedown (December 18, 2025):**
- Joint operation involving U.S. Department of Justice, FBI, Finnish National Bureau of Investigation, German Police, and Michigan State Police
- Seized domains: e-note.com, e-note.ws, and jabb.mn
- Dismantled mobile applications associated with the exchange
- Approximately $70 million seized
- Platform used extensively by ransomware gangs for money laundering
- Operators arrested in coordinated multi-country operation
- Servers and cryptocurrency wallets confiscated
- Assets forfeited to victim compensation funds

**Sources:** [BleepingComputer - US seizes E-Note crypto exchange](https://bleepingcomputer.com), [BleepingComputer - International partners](https://bleepingcomputer.com)

**FBI Prince Group Network Disruption (December 2025):**
- Massive FBI operation targeting international cryptocurrency money laundering network
- Approximately $15 billion in illicit cryptocurrency confiscated
- One of the largest financial seizures in cybercrime history
- Network provided services to multiple criminal organizations
- Disrupted significant portion of underground cryptocurrency laundering infrastructure
- Multiple jurisdictions involved in coordinated action

**Source:** [Help Net Security - Global law enforcement actions](https://helpnetsecurity.com)

### Major Data Breaches and Extortion Campaigns

**Pornhub Breach (December 2025):**
- Over 200 million Premium user records exposed
- Breach linked to compromise of analytics provider Mixpanel
- Data included: email addresses, search histories, watch histories, download histories, location data, and associated video details
- Information collected prior to 2021
- No passwords, payment information, or government-issued IDs compromised
- ShinyHunters extortion group claimed responsibility
- OpenAI also acknowledged related Mixpanel incident
- Raises significant privacy concerns for adult content platform users

**Source:** [Check Point Research - 22nd December Threat Intelligence Report](https://research.checkpoint.com)

**SoundCloud Breach (December 2025):**
- Unauthorized access to database containing user email addresses and public profile information
- Approximately 20% of SoundCloud's users affected (approximately 28 million accounts)
- Caused system outages and VPN connection issues
- ShinyHunters extortion gang claimed responsibility
- Impact on major music streaming and artist platform
- Disrupted services for content creators and listeners globally

**Source:** [Check Point Research - 22nd December Threat Intelligence Report](https://research.checkpoint.com)

**Venezuela PDVSA Cyberattack (December 2025):**
- Petróleos de Venezuela (state oil company) experienced major cyberattack
- Disrupted export operations and offline systems managing country's main crude terminal
- Administrative and operational network systems affected
- Cargo deliveries halted at critical infrastructure
- Scope of data compromise not disclosed
- Significant impact on national oil production and exports
- Economic implications for Venezuela's petroleum-dependent economy

**Source:** [Check Point Research - 22nd December Threat Intelligence Report](https://research.checkpoint.com)

### State-Sponsored APT Campaigns

**Ink Dragon (China-Aligned) - Multi-Country Campaign:**
- Check Point Research revealed sophisticated wave of attacks
- Targets: European governments, Southeast Asia, South America
- Technical capabilities:
  - Converts compromised IIS servers into relay nodes
  - Deploys ShadowPad malware framework
  - Exploits predictable configuration keys for persistent access
  - Uses new FinalDraft backdoor for data exfiltration and lateral movement
- Advanced toolchain indicates state-level resources and sophistication
- Ongoing campaigns with multiple objectives across three continents

**Source:** [Check Point Research - 22nd December Threat Intelligence Report](https://research.checkpoint.com)

**LongNosedGoblin (China-Linked) - Asia-Pacific Espionage:**
- New China-aligned threat actor identified
- Targets: Government networks in Southeast Asia and Japan
- Novel techniques: Group Policy abuse for persistence and privilege escalation
- Focuses on intelligence collection from government ministries
- Demonstrates continued evolution of Chinese APT capabilities
- Represents emerging threat to regional governments

**Source:** [The Record - New China-linked hacker group](https://therecord.media)

### Zero-Day Exploitation and Critical Vulnerabilities

**CVE-2025-55182 (React2Shell) - Immediate Weaponization:**
- Critical vulnerability in React Server Components
- Maximum CVSS score of 10.0
- Affects React versions 19.x and Next.js versions 15.x and 16.x with App Router
- Public disclosure: December 3, 2025
- Exploitation observed within hours by:
  - Earth Lamia (China state-nexus)
  - Jackpot Panda (China state-nexus)
  - Multiple other China-nexus threat groups
- Amazon threat intelligence teams observed active exploitation attempts
- Does not affect AWS services directly
- Represents fastest observed zero-day weaponization timeline
- Highlights compressed security response windows

**Source:** [AWS Security Blog - China-nexus cyber threat groups rapidly exploit React2Shell](https://aws.amazon.com)

**CVE-2025-37164 - HPE OneView RCE (December 2025):**
- Critical severity vulnerability with CVSS score of 10.0
- Unauthenticated remote code execution flaw
- Affects all HPE OneView versions prior to 11.00 (includes versions 5.20 through 10.20)
- Impacts centralized IT infrastructure management systems
- Successful exploitation enables remote attacker to execute arbitrary code
- Widespread deployment in enterprise environments increases risk
- Active exploitation observed in the wild

**Source:** [Check Point Research - 22nd December Threat Intelligence Report](https://research.checkpoint.com)

**CVE-2025-14733 - WatchGuard Firebox Critical Vulnerability:**
- Critical remote code execution vulnerability
- Affects WatchGuard Firebox firewalls running Fireware OS 11.x and later
- Out-of-bounds write flaw
- Enables unauthenticated remote code execution on unpatched devices with IKEv2
- No user interaction required
- Actively exploited in the wild
- Targets critical network security infrastructure

**Source:** [Check Point Research - 22nd December Threat Intelligence Report](https://research.checkpoint.com)

**CVE-2025-59718 and CVE-2025-59719 - Fortinet Authentication Bypass:**
- Critical authentication bypass flaws
- Affects: FortiGate, FortiOS, FortiWeb, FortiProxy, FortiSwitchManager
- Attackers can log in without credentials
- Capability to export full device configurations
- Risk of cracked passwords and network compromise
- Active exploitation spotted by researchers
- Widespread deployment amplifies impact
- Critical enterprise security infrastructure affected

**Source:** [Check Point Research - 22nd December Threat Intelligence Report](https://research.checkpoint.com)

### AI-Driven Fraud and Deepfakes

**Deepfake-as-a-Service Explosion:**
- 2025 marked turning point in cyber threat landscape
- Deepfake-as-a-Service (DaaS) emerged as fastest-growing cybercriminal tool
- Cyble Executive Threat Monitoring report findings:
  - AI-powered deepfakes involved in over 30% of high-impact corporate impersonation attacks in 2025
  - Dramatic increase from previous years
  - Lowered technical barriers for sophisticated attacks
  - Democratization of advanced fraud techniques

**Source:** [Cyble - Deepfake-as-a-Service Exploded In 2025](https://cyble.com)

**AI Content Generation in Scams:**
- F-Secure research: 89% of phishing and social engineering scams used AI for content generation
- Techniques employed:
  - Deepfake video creation
  - Voice cloning technology
  - Realistic persona generation
  - Automated phishing content creation
- Enables bypass of traditional security checks
- Exploits human trust through hyper-realistic impersonations

**Source:** [F-Secure - F-Alert US Cyber Threats Bulletin December 2025](https://f-secure.com)

**Financial Impact:**
- U.S. financial fraud losses: $12.5 billion in 2025
- AI-assisted attacks significantly contributed to increase
- Combination of deepfake video, voice cloning, and realistic personas
- Targets both individuals and organizations
- Effectiveness dramatically higher than traditional phishing

**Sources:** [Cyble - Deepfake-as-a-Service Financial Impact](https://cyble.com), [F-Secure - AI-driven scams](https://f-secure.com)

### Critical Infrastructure Attacks

**Denmark Water Utility Attack (December 2024, announced December 2025):**
- Køge Waterworks municipal water plant targeted
- Cyber sabotage via Industrial Control System (ICS) manipulation
- Attackers remotely manipulated pumps, changing pressure
- Result: Three burst pipes, water cut to approximately 450 homes
- Danish Defence Intelligence Service (DDIS) attribution: Russia-linked Z-Pentest group
- Represents escalation in critical infrastructure targeting
- Hybrid warfare implications

**Source:** [Check Point Research - Denmark's water utility cyberattack](https://research.checkpoint.com)

## Statistics (December 2025 Global Overview)

### Law Enforcement Actions

- **574 arrests** across 19 African countries (Operation Sentinel)
- **~$3 million** recovered in Operation Sentinel
- **~$70 million** seized in E-Note cryptocurrency exchange takedown
- **~$15 billion** in illicit cryptocurrency confiscated in FBI Prince Group operation

### Data Breach Impact

- **200+ million** Pornhub user records exposed
- **~28 million** SoundCloud accounts affected (20% of user base)
- Multiple critical infrastructure organizations compromised globally

### AI-Driven Fraud

- **30%** of high-impact corporate impersonation attacks involved AI-powered deepfakes
- **89%** of phishing/social engineering scams employed AI-generated content
- **$12.5 billion** in U.S. losses from AI-driven fraud in 2025

### Zero-Day Exploitation Timeline

- **Hours**: Time from CVE-2025-55182 disclosure to active exploitation by China-nexus groups
- **10.0 CVSS**: Multiple critical vulnerabilities with maximum severity scores (React2Shell, HPE OneView)

## Key Recommendations

Based on December 2025's global threat landscape, security experts emphasize:

* **Zero-Day Response Readiness**: Organizations must prepare for immediate exploitation of disclosed vulnerabilities, with automated patching capabilities and compressed response timelines

* **AI-Driven Threat Defense**: Implement AI-powered defense tools to counter AI-generated attacks, including deepfake detection, voice authentication systems, and behavioral analysis

* **Critical Infrastructure Protection**: Enhanced monitoring and segmentation of Industrial Control Systems (ICS) and Operational Technology (OT) environments, particularly in utilities and essential services

* **Third-Party Risk Management**: Strengthen vendor security assessments following Mixpanel/Pornhub-style supply chain compromises

* **Cryptocurrency Transaction Monitoring**: Enhanced scrutiny of cryptocurrency transactions and exchanges following major law enforcement seizures

* **Multi-Factor Authentication Beyond SMS**: Implement phishing-resistant MFA methods (hardware tokens, biometrics) to counter AI-powered social engineering

* **Incident Response Planning**: Regular tabletop exercises simulating rapid zero-day exploitation scenarios and coordinated APT campaigns

## Sources

- [INTERPOL - 574 arrests and USD 3 million recovered in coordinated cybercrime operation across Africa](https://interpol.int)
- [BleepingComputer - US seizes E-Note crypto exchange for laundering ransomware payments](https://bleepingcomputer.com)
- [Help Net Security - Global law enforcement actions put pressure on cybercrime networks](https://helpnetsecurity.com)
- [Check Point Research - 22nd December Threat Intelligence Report](https://research.checkpoint.com)
- [The Record - New China-linked hacker group spies on governments in Southeast Asia, Japan](https://therecord.media)
- [AWS Security Blog - China-nexus cyber threat groups rapidly exploit React2Shell vulnerability (CVE-2025-55182)](https://aws.amazon.com)
- [Cyble - Deepfake-as-a-Service Exploded In 2025: 2026 Threats Ahead](https://cyble.com)
- [F-Secure - F-Alert US Cyber Threats Bulletin December 2025](https://f-secure.com)
