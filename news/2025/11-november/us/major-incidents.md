# November 2025 - US Major Incidents

## Major Incidents

### November 18 – Harvard University

- **Date:** November 18, 2025
- **Target:** Harvard University
- **Attack Type:** Phishing/Voice phishing (vishing)
- **Impact:** Personal details of alumni, donors, staff and faculty potentially accessed
- **Attribution:** Unknown
- **Details:** Attackers breached an alumni affairs database via phone-based social engineering. The breach, discovered on November 18, 2025, involved unauthorized access to databases used by the office of Alumni Affairs and Development. Harvard officials acted immediately to remove the attacker's access and prevent further unauthorized intrusion.

  The compromised databases generally do not contain Social Security numbers, passwords, payment card information, or financial account numbers. However, they do include other personal information such as:
  - Email addresses
  - Telephone numbers
  - Home and business addresses
  - Event attendance records
  - Details of donations to Harvard
  - Other biographical information pertaining to University fundraising and alumni engagement activities

  Harvard officials do not yet know precisely what data the attackers accessed. An investigation is ongoing, and the university has not identified the attacker. This incident highlights the continued effectiveness of social engineering tactics, even against sophisticated organizations with significant cybersecurity resources.
- **Source:** [Harvard Magazine - Harvard Alumni Affairs Databases Breached](https://harvardmagazine.com)

### November 22 – Cox Enterprises

- **Date:** November 22, 2025 (attack occurred August 9-14, 2025)
- **Target:** Cox Enterprises
- **Attack Type:** Data breach (Oracle EBS zero-day - CVE-2025-61882)
- **Impact:** Personal data of ~9,500 individuals (employees/customers) exposed
- **Attribution:** Cl0p ransomware group
- **Details:** A previously unknown vulnerability in Oracle E-Business Suite (CVE-2025-61882) was exploited by the Cl0p ransomware group, exposing personal data of approximately 9,479 individuals in Cox's records. The attack occurred between August 9-14, 2025, but was disclosed in November.

  The Cl0p group utilized this zero-day vulnerability to inject ransomware, encrypting files and publishing stolen data on the dark web. Key indicators of compromise included specific C2 IP addresses, malicious domains, and SHA256 hashes of the ransomware payload.

  **Attack Methodology:**
  - Exploited public-facing Oracle EBS application (T1190 technique)
  - SQL injection for remote code execution
  - Privilege elevation to SYSTEM level
  - Data exfiltration before encryption
  - Publication of stolen data on dark web leak site

  The Cl0p ransomware group claimed responsibility for the breach and published stolen files on their leak site. This incident is part of a broader campaign by Cl0p targeting Oracle EBS customers throughout the fall of 2025.
- **Source:** [FireCompass - Cox Enterprises Oracle EBS Zero-Day Breach Incident Report](https://firecompass.com)

### November 26 – Dartmouth College

- **Date:** November 26, 2025 (attack began August 2025)
- **Target:** Dartmouth College
- **Attack Type:** Data breach (Oracle EBS zero-day - CVE-2025-61882)
- **Impact:** Over 226 GB of data stolen; ~1,500 New Hampshire and 31,000 Maine residents affected
- **Attribution:** Cl0p ransomware group
- **Details:** The same Oracle E-Business Suite vulnerability exploited against Cox Enterprises was used to hack Dartmouth College. The attack began in August 2025 but was disclosed in November. Over 226 GB of data were stolen, including:
  - Names
  - Social Security Numbers (SSNs)
  - Financial information of students, faculty, and donors

  Approximately 1,500 New Hampshire residents and 31,000 Maine residents were reported affected by the breach. The Cl0p group named Dartmouth on its leak site alongside dozens of other US and Canadian victims of the Oracle EBS zero-day campaign.

  The cybercriminals made public 226 GB of archives containing files allegedly stolen from the university. Security researchers conducting brief file tree and metadata analysis confirmed that the data appears to come from Dartmouth. The breach underscores the widespread impact of the Oracle EBS vulnerability across higher education institutions.
- **Source:** [SecurityWeek - Dartmouth College Confirms Data Theft in Oracle Hack](https://securityweek.com)

### November 26 – OnSolve CodeRED Emergency Alert System

- **Date:** November 26, 2025 (accessed November 1, ransomware deployed November 10)
- **Target:** OnSolve CodeRED Emergency Alert System
- **Attack Type:** Ransomware (Inc Ransom)
- **Impact:** Emergency alerts disrupted nationwide; user account data exfiltrated
- **Attribution:** Inc Ransom gang
- **Details:** A cyber-attack on the CodeRED legacy alert platform (used by many US cities and counties for emergency notifications) encrypted systems and exfiltrated user account data including names, phone numbers, and addresses. Emergency alerts were disrupted nationwide, affecting dozens of states.

  **Timeline:**
  - November 1, 2025: Inc Ransom gang gained access to CodeRED systems
  - November 10, 2025: Ransomware deployed across the platform
  - November 22, 2025: Inc Ransom listed the attack on their leak website
  - November 26, 2025: Public disclosure and notification

  The Inc Ransom group reportedly demanded $100,000 in ransom, but negotiations failed. The attack represents a significant threat to public safety infrastructure, as CodeRED is used by emergency management agencies across the United States to send critical alerts to residents during emergencies, disasters, and other urgent situations.

  The incident highlights vulnerabilities in critical emergency communication infrastructure. The disruption of emergency alert capabilities affected public safety operations in dozens of states, potentially impacting millions of Americans' ability to receive timely warnings about emergencies.

  The Inc Ransom gang has been particularly active in November 2025, also targeting the Pennsylvania Office of the Attorney General and other high-profile government and critical infrastructure targets.
- **Source:** [SecurityWeek - Ransomware Attack Disrupts Local Emergency Alert System Across US](https://securityweek.com)

## Legislation & Policy Updates

### US Treasury Sanctions (November 19, 2025)

The US Treasury's Office of Foreign Assets Control (OFAC), in coordination with Australia's Department of Foreign Affairs and Trade and the United Kingdom's Foreign Commonwealth and Development Office, announced coordinated sanctions targeting Media Land, a Russia-based bulletproof hosting (BPH) service provider.

**Targets:**
- **Media Land LLC:** Russian bulletproof hosting provider supporting ransomware operations
- **Three leadership team members** of Media Land
- **Three sister companies** affiliated with Media Land

**Significance:**
Media Land was identified as a key enabler of ransomware groups like LockBit. Bulletproof hosting providers offer infrastructure that is resistant to law enforcement takedown attempts, allowing cybercriminals to operate with reduced risk of disruption. This trilateral action represents a coordinated effort to disrupt the infrastructure behind global cybercrime.

The sanctions freeze any US assets of the designated entities and generally prohibit US persons from engaging in transactions with them. The action sends a strong message about international cooperation in combating ransomware infrastructure.

**Source:** [US Treasury - United States, Australia, and United Kingdom Sanction Russian Cybercrime Infrastructure](https://home.treasury.gov)

### US Cybersecurity Funding Extension (November 2025)

Congress temporarily extended two critical cybersecurity laws that lapsed in September 2025:

#### Cybersecurity and Infrastructure Security Act (CISA) - 2015
The CISA provides legal protections for private companies to share cyber threat data with the federal government. Without these protections, companies face legal liability concerns when sharing threat intelligence. The extension ensures continued public-private information sharing on cyber threats.

#### State and Local Cyber Grant Program
This grant program has allocated $1 billion in cybersecurity funding to state and local governments since 2022. The funding supports:
- Cybersecurity infrastructure improvements
- Incident response capabilities
- Training and workforce development
- Threat intelligence sharing

**Industry Response:**
The Business Software Alliance, representing Amazon Web Services, Cloudflare, Microsoft, and Oracle, praised the Senate for including the extensions. Industry groups warned that continued delays risk deepening information-sharing gaps between public and private sectors, particularly as ransomware and nation-state threats continue to escalate.

**Source:** [TechPolicy.Press - November 2025 US Tech Policy Roundup](https://techpolicy.press)

### Federal Incident Response

In response to November's incidents, particularly the Oracle EBS zero-day campaign and the CodeRED attack:

**CISA Actions:**
- Issued emergency directive for federal agencies to patch Oracle EBS systems
- Enhanced threat intelligence sharing on Cl0p ransomware tactics
- Coordinated response to CodeRED incident with state and local emergency management

**FBI Involvement:**
- Investigation of Inc Ransom gang and CodeRED attack
- Coordination with international partners on Cl0p ransomware group
- Support for victims in Oracle EBS zero-day campaign

## Statistics

### Ransomware Dominance

The United States remained by far the most attacked country in November 2025:
- **356 ransomware attacks** in the US (10 times higher than second-place Canada)
- **USA** accounts for more than 55% of all ransomware attacks globally

Followed by:
- **Canada:** ~35-40 attacks
- **United Kingdom:** ~35-40 attacks
- **Germany, India, and Italy:** Lower but significant numbers

**Source:** [Cyble - Ransomware Attacks Surge](https://cyble.com)

### Sector Targeting in the US

Most-attacked sectors in November included:
1. **Construction**
2. **Professional Services**
3. **Manufacturing**
4. **Healthcare**
5. **Energy & Utilities**
6. **IT**

**Higher Education** was notably impacted by the Oracle EBS zero-day, with Dartmouth and multiple other colleges affected.

**Source:** [Cyble - Ransomware Attacks Surge](https://cyble.com)

### Oracle EBS Zero-Day Campaign Impact

The Cl0p ransomware group's exploitation of CVE-2025-61882 affected:
- **Dozens of US organizations** (exact number undisclosed)
- **Multiple Canadian organizations**
- **Higher education institutions:** Multiple colleges and universities
- **Corporations:** Fortune 500 companies including Cox Enterprises
- **Data exposed:** Hundreds of gigabytes across all victims

### Critical Infrastructure

November saw significant attacks on US critical infrastructure:
- **Emergency Alert Systems:** CodeRED serving hundreds of jurisdictions
- **Higher Education:** Multiple universities via Oracle EBS
- **Government:** Pennsylvania Attorney General's office (Inc Ransom)

### Individual Impact

Confirmed individuals affected by November US breaches:
- **~9,500:** Cox Enterprises employees and customers
- **~32,500:** Dartmouth-related (1,500 NH + 31,000 ME residents)
- **Thousands:** Harvard alumni, donors, faculty, staff
- **Unknown but significant:** CodeRED emergency alert system users

## Trends & Analysis

### Zero-Day Exploitation

The Oracle EBS zero-day (CVE-2025-61882) represents a significant threat to enterprise systems. Oracle E-Business Suite is widely deployed in large organizations for:
- Financial management
- Supply chain management
- Human resources
- Customer relationship management

The Cl0p group's systematic exploitation of this vulnerability across multiple sectors demonstrates:
- Advanced capability to discover zero-days in enterprise software
- Organized campaign structure targeting high-value organizations
- Data exfiltration focus rather than pure encryption ransomware

### Supply-Chain and Third-Party Risk

Multiple November incidents involved third-party or supply-chain elements:
- **CodeRED:** Third-party emergency alert platform serving hundreds of jurisdictions
- **Gainsight:** Salesforce platform compromise affecting hundreds of companies
- **Oracle EBS:** Widely-used enterprise software with cascading impact

### Social Engineering Sophistication

The Harvard incident demonstrates that phone-based social engineering (vishing) remains effective against even well-resourced organizations. This suggests:
- Training programs may not adequately address vishing threats
- Technical controls have limited effectiveness against human manipulation
- Multi-factor authentication and zero-trust principles are essential

### Critical Infrastructure Targeting

The Inc Ransom attack on CodeRED represents a concerning trend toward targeting public safety infrastructure. Emergency alert systems are critical for:
- Natural disaster warnings
- Public health emergencies
- Law enforcement notifications
- Community safety alerts

The disruption of these systems during an actual emergency could have life-threatening consequences.

### Ransomware Group Specialization

Different threat actors demonstrated distinct specializations:
- **Cl0p:** Zero-day exploitation, enterprise targets, data exfiltration
- **Inc Ransom:** Government and critical infrastructure, aggressive demands

This specialization suggests a maturing ransomware ecosystem with groups focusing on specific techniques and target types.

## Response and Mitigation

### Immediate Actions for Organizations

Based on November's incidents, organizations should:

1. **Patch Oracle EBS:** Immediately apply security updates for CVE-2025-61882
2. **Review Emergency Systems:** Assess third-party emergency notification platforms
3. **Enhance Vishing Defenses:** Implement verification procedures for phone-based requests
4. **Monitor for Data Exfiltration:** Deploy tools to detect unusual data transfers
5. **Segment Networks:** Isolate critical systems from general corporate networks

### Strategic Priorities

1. **Zero-Trust Architecture:** Assume breach and verify every access attempt
2. **Third-Party Risk Management:** Enhanced security requirements in contracts
3. **Incident Response Planning:** Tabletop exercises for ransomware scenarios
4. **Backup and Recovery:** Immutable backups stored offline
5. **Threat Intelligence:** Subscribe to feeds on active threat groups

### Policy Recommendations

November's incidents support several policy priorities:
- Mandatory incident reporting for critical infrastructure
- Enhanced security requirements for emergency systems
- Federal funding for state/local cybersecurity (now extended)
- International cooperation on ransomware infrastructure (sanctions)
- Public-private information sharing (CISA extension)

## Looking Ahead

November 2025's incidents in the United States highlight several ongoing challenges:

### Persistent Threats
- Ransomware groups continue to evolve tactics and targets
- Zero-day vulnerabilities in enterprise software pose systemic risk
- Social engineering remains effective despite awareness efforts
- Critical infrastructure faces sophisticated, persistent threats

### Policy Progress
- Extended cybersecurity funding supports state/local resilience
- International sanctions target ransomware infrastructure
- CISA extension enables continued threat intelligence sharing

### Priorities for 2026
1. Accelerate zero-trust architecture adoption
2. Strengthen third-party security requirements
3. Enhance critical infrastructure protections
4. Improve incident detection and response capabilities
5. Continue international cooperation on cybercrime

## Sources & Citations

- [Harvard Magazine - Harvard Alumni Affairs Databases Breached](https://harvardmagazine.com)
- [FireCompass - Cox Enterprises Oracle EBS Zero-Day Breach Incident Report](https://firecompass.com)
- [SecurityWeek - Dartmouth College Confirms Data Theft in Oracle Hack](https://securityweek.com)
- [SecurityWeek - Ransomware Attack Disrupts Local Emergency Alert System Across US](https://securityweek.com)
- [US Treasury - Sanctions on Russian Cybercrime Infrastructure Supporting Ransomware](https://home.treasury.gov)
- [TechPolicy.Press - November 2025 US Tech Policy Roundup](https://techpolicy.press)
- [Cyble - Ransomware Attacks Surge To Second-Highest Level In 2025](https://cyble.com)
