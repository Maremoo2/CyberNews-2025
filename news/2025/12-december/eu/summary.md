# December 2025 - European Union Summary

## Overview

December 2025 presented a sobering conclusion to the year for European cybersecurity, characterized by critical infrastructure attacks on essential services, major data breaches affecting millions of citizens, and the formal attribution of state-sponsored sabotage operations. The month saw ransomware encryption of Romania's national water management systems, a suspected DDoS attack crippling France's postal and banking services, and Denmark's public attribution of Russian cyber sabotage against municipal water infrastructure. Italy's national railway operator suffered a massive 2.3 TB data breach through its IT provider, highlighting persistent supply chain vulnerabilities.

These incidents occurred against a backdrop of significant regulatory evolution, with the EU's Cyber Resilience Act reaching final agreement, the NIS2 Directive continuing its rollout across member states, and the Digital Operational Resilience Act (DORA) entering enforcement for the financial sector. The combination of sophisticated attacks on critical infrastructure and advancing regulatory frameworks underscored Europe's position at the forefront of both cyber threats and cybersecurity governance.

## Key Trends

### Infrastructure Targets: Ransomware and Malware Focus on Critical Systems

December demonstrated that critical infrastructure—particularly utilities, transportation, and public services—remains a prime target for cyber adversaries:

**Water Infrastructure Under Siege:**

**Romanian Waters Authority (December 20):**
- ~1,000 systems encrypted with BitLocker-based ransomware
- 10 of 11 national river basin organizations affected
- Critical national water management infrastructure targeted
- Operations continued through manual processes
- No disruption to water service delivery despite IT paralysis

**Denmark's Køge Waterworks (2024 attack, December 2025 attribution):**
- ICS manipulation causing physical damage
- Three burst pipes, 450 homes without water
- Attributed to Russia-linked Z-Pentest group
- Demonstrates physical consequences of cyber attacks
- No advanced malware required—direct control system manipulation

**Transportation Sector Vulnerabilities:**

**FS Italiane/Almaviva Breach (November, disclosed December):**
- 2.3 TB of sensitive data stolen from IT provider
- Passenger records, contracts, defense documents exposed
- National railway operator compromised via supply chain
- Critical transportation infrastructure data at risk

**Postal and Banking Services:**

**La Poste/Banque Postale (December 23):**
- Suspected DDoS attack
- 12-hour outage of digital services
- Timing two days before Christmas maximized impact
- Dual effect on postal and banking operations

**Attack Characteristics:**
- Ransomware increasingly using legitimate tools (BitLocker) to evade detection
- DDoS attacks demonstrate continued effectiveness against major services
- ICS vulnerabilities enable physical sabotage without sophisticated malware
- Hybrid warfare tactics blend cyber and physical effects
- Timing attacks for maximum disruption (holidays, peak periods)

**Implications:**
- Critical services must prepare for both digital and physical consequences
- Legacy ICS systems vulnerable to relatively simple attacks
- Redundancy and manual processes remain essential for resilience
- Attackers understand operational dependencies and exploit them strategically

### State-Sponsored Campaigns: Russian and Chinese Operations

European agencies reported escalating state-sponsored cyber activities throughout December:

**Russian-Backed Operations:**

**Z-Pentest Group (Denmark Attribution):**
- Danish Defence Intelligence Service (DDIS) publicly attributed Køge waterworks attack
- Part of documented pattern of Russian infrastructure targeting
- Demonstrates persistent threat to Nordic countries
- Hybrid warfare tactics against civilian infrastructure

**NoName057(16) and Related Groups:**
- Continued DDoS campaigns against European targets
- Focus on government websites and critical services
- Pro-Russian hacktivist groups aligned with state objectives
- Attacks often timed with geopolitical events

**Targeting Pattern:**
- Water and energy infrastructure prioritized
- Nordic and Baltic states most frequently targeted
- Transportation and logistics networks under surveillance
- Government and defense sectors persistent targets

**Chinese APT Activity:**

**Ink Dragon Campaign (Check Point Report):**
- Ongoing attacks against EU governments
- Advanced toolchain including ShadowPad framework
- Converts compromised IIS servers into relay nodes
- New FinalDraft backdoor for exfiltration
- Targets government ministries and agencies

**Objectives:**
- Long-term intelligence collection
- Access to diplomatic communications
- Understanding of EU policy deliberations
- Economic espionage in key technology sectors

**Eastern Europe Under Constant Probe:**
- Countries bordering Russia and Belarus face heightened threat
- Critical infrastructure reconnaissance ongoing
- Mix of espionage and pre-positioning for potential disruption
- Intelligence sharing among NATO allies increased in response

**Source:** [The Guardian - Denmark attribution](https://theguardian.com), [Check Point Research](https://research.checkpoint.com)

### Vulnerabilities & Supply Chains: Cl0p and Multi-Country Extortion

Attackers continued exploiting known weaknesses throughout the European supply chain:

**CL0P Gang Operations:**
- Targeted European software via SonicWall VPN vulnerabilities
- Exploited Oracle E-Business Suite bugs
- Multi-country extortion campaigns
- Focus on managed service providers (MSPs) as entry points

**FS Italiane/Almaviva Incident:**
- Exemplifies supply chain risk
- IT service provider breach exposed national railway data
- 2.3 TB exfiltration indicates prolonged access
- Third-party security becomes first-party risk

**Common Attack Vectors:**
- Compromised MSP credentials
- Remote access VPN vulnerabilities
- Phishing targeting third-party support staff
- Exploitation of trust relationships
- Credential attacks on supplier networks

**Vulnerability Landscape:**
- Many breaches begin with compromised vendor access
- Shared credentials across client environments
- Inadequate segmentation between client networks
- Delayed patching at smaller service providers
- Complex supply chains multiply attack surface

**Implications for European Organizations:**
- NIS2 Directive mandates supply chain security measures
- Enhanced vendor due diligence required
- Contractual security requirements must be enforceable
- Continuous monitoring of third-party access
- Incident response plans must include supplier compromises

### AI and Phishing: European CISOs' Top Concerns

**AI-Driven Threats Dominating December:**

**Hornet Security Research Findings:**
- Email malware surged +130% year-over-year in late 2025
- AI-driven phishing and deepfakes cited as top CISO concerns
- Holiday season saw spike in AI-generated lures
- Fake courier notices using AI-crafted messages
- Synthetic voice calls impersonating executives

**Attack Evolution:**
- Traditional phishing templates replaced by AI-generated content
- Personalization at scale through automation
- Voice deepfakes bypassing verification procedures
- Video deepfakes in business email compromise
- Multilingual attacks generated automatically

**European-Specific Challenges:**
- GDPR compliance complicates some AI defense measures
- Multilingual nature of EU requires sophisticated AI detection
- Cross-border attacks exploit jurisdictional complexities
- Privacy regulations limit some behavioral monitoring

**Holiday Season Exploitation:**
- Fake package delivery notifications
- Fraudulent holiday charity appeals
- AI-generated phishing targeting year-end financial processes
- Impersonation of executives during vacation periods
- Increased volume coinciding with reduced security staffing

**Defense Implications:**
- Traditional anti-phishing training less effective against AI content
- Need for AI-powered detection systems
- Multi-factor authentication essential but insufficient alone
- User awareness must include AI-generated threat recognition
- Behavioral analytics required to detect anomalous patterns

**Source:** [Hornet Security - Monthly Threat Report December 2025](https://hornetsecurity.com)

## Legislation & Policy Updates

### Cyber Resilience Act: Security-by-Design Requirements

**Legislative Milestone:**
- EU's new Cyber Resilience Act agreed in late 2025
- Final legislative text approved by EU institutions
- Represents major shift in product security approach
- Full enforcement begins 2027

**Key Requirements:**

**Mandatory Security Standards:**
- Security-by-design principles required for all digital products
- Applies to hardware and software sold in EU market
- Manufacturers must ensure products secure throughout lifecycle
- Default passwords banned
- Regular security updates mandatory

**Vulnerability Management:**
- Active vulnerability handling required
- Coordinated disclosure procedures
- Security update delivery mechanisms mandatory
- End-of-life security considerations

**Scope:**
- Covers IoT devices, software, hardware with digital elements
- Applies to products placed on EU market
- Manufacturers, importers, distributors affected
- Some exemptions for specific product categories

**Enforcement Timeline:**
- Legislation finalized December 2025
- Transition period for industry compliance
- Full enforcement beginning 2027
- Phased implementation for different product categories

**Global Impact:**
- Expected to influence global product security standards
- Similar to GDPR's worldwide effect
- Manufacturers targeting EU must comply globally
- May drive security improvements beyond EU borders

**Significance:**
- Shifts liability toward manufacturers
- Addresses persistent IoT security weaknesses
- Complements NIS2 and sector-specific regulations
- Part of comprehensive EU cyber legislative package

### NIS2 / DORA: Implementation and Enforcement

**NIS2 Directive Rollout:**

**Member State Transposition:**
- Revised NIS2 Directive in member-state implementation phase
- Countries adapting national laws to meet requirements
- Deadline for transposition: October 2024 (many still finalizing December 2025)
- Varying speed of implementation across EU

**Covered Sectors:**
- 18 critical and important sectors
- Energy, transport, banking, health, digital infrastructure
- Water, waste water, food production
- Public administration, space
- Expanded scope from original NIS Directive

**Key Requirements:**
- Risk assessment and security measures mandatory
- Incident reporting within strict timelines
- Supply chain security obligations
- Board-level oversight and accountability
- Significant fines for non-compliance

**Enforcement Activity:**
- Some member states beginning compliance audits
- Guidance documents from national authorities
- Industry working groups on implementation
- Early enforcement actions expected in 2026

**Digital Operational Resilience Act (DORA):**

**Status:**
- Entered enforcement January 2025 for financial sector
- Applies to banks, insurance, investment firms, crypto-asset service providers
- December 2025: First full year of compliance

**Requirements:**
- ICT risk management frameworks mandatory
- Digital operational resilience testing (including threat-led penetration testing)
- ICT third-party risk management
- Incident reporting to financial regulators
- Information sharing on cyber threats

**December 2025 Compliance:**
- Financial institutions completing first year under DORA
- Regulatory guidance evolving based on implementation experience
- Focus on third-party risk management given supply chain incidents
- Enhanced oversight of critical ICT service providers

**Interconnection:**
- DORA complements NIS2 for financial sector
- Overlap requires coordinated compliance approach
- Regulators working to harmonize requirements
- Financial sector faces strictest cyber requirements in EU

### Regulatory Actions: Tightening Breach Notification and Fines

**Enhanced Breach Notification Requirements:**

**Stricter Timelines:**
- Some EU countries require incident reporting within hours
- Critical operators (energy, health) face tightest deadlines
- Move beyond GDPR's 72-hour standard for critical sectors
- Real-time reporting expectations for major incidents

**Consequences of Delay:**
- Increased fines for late breach notifications
- Regulatory investigations triggered by reporting failures
- Public disclosure requirements in certain cases
- Reputational damage from regulatory censure

**Sector-Specific Obligations:**
- Healthcare: Patient data breaches require immediate action
- Financial: DORA reporting to financial regulators
- Energy/Utilities: National security considerations drive faster reporting
- Telecommunications: Critical infrastructure status demands rapid disclosure

**2024 Regulations Implementation:**

**IoT Security Rules:**
- EU Radio Equipment Directive (RED) requirements ongoing
- Default password bans being enforced
- Manufacturers must demonstrate compliance
- Market surveillance authorities conducting checks

**Cloud Security Rules:**
- Enhanced requirements for cloud service providers
- Certification schemes under development
- Focus on data sovereignty and resilience
- GDPR compliance remains foundation

**No Major New EU-Wide Law in December 2025:**
- Focus on implementing existing legislation
- Cyber Resilience Act finalized but not yet enforced
- Regulatory agencies prioritizing guidance and enforcement
- Industry adjustment period ongoing

## Statistics

**Incident Data Limitations:**
- Precise EU-wide figures for December 2025 not yet published
- ENISA expected to release comprehensive data in early 2026
- Mid-year 2025 ENISA report noted ~70% of EU incidents were high-impact
- Monthly granular data pending consolidation

**Known December Incidents:**
- ~1,000 systems affected in Romanian Waters attack
- 450 homes without water in Denmark ICS attack
- 2.3 TB data stolen in FS Italiane/Almaviva breach
- 12-hour outage in La Poste/Banque Postale attack

**Sector Trends (Based on Available Data):**
- Ransomware and phishing remain top incident types
- Public-sector and transportation sectors saw bulk of reported disruptions
- Water infrastructure emerged as frequent target
- Financial services incident reporting up (DORA effect)

**Regulatory Enforcement:**
- GDPR fines continue for data breaches
- NIS2 enforcement actions pending
- Increased scrutiny of third-party processors
- Board-level accountability emphasized

## Sector-Specific Analysis

### Water and Utilities

**Threat Environment:**
- Multiple attacks on water infrastructure (Romania, Denmark)
- Both ransomware and ICS manipulation observed
- Critical services targeted for disruption and extortion
- Physical safety implications of cyber attacks

**Vulnerabilities:**
- Legacy SCADA and ICS systems
- Remote access requirements create attack surface
- Limited cybersecurity resources in municipal utilities
- Operational technology (OT) often insecure by design

**Regulatory Response:**
- NIS2 includes water sector explicitly
- Enhanced security requirements forthcoming
- National authorities conducting infrastructure assessments
- Increased investment in OT security

### Transportation and Logistics

**Key Incidents:**
- FS Italiane data breach (2.3 TB stolen)
- Railway operations data compromised
- Defense-related transport information exposed

**Sector Challenges:**
- Complex IT/OT environments
- Legacy systems in rail networks
- Supply chain dependencies (IT service providers)
- National security implications

**Security Priorities:**
- Data protection for passenger information
- Supply chain security for service providers
- Segmentation between safety-critical and business systems
- Incident response for operational disruption

### Postal and Financial Services

**La Poste/Banque Postale Attack:**
- Dual-use infrastructure (postal and banking)
- DDoS demonstrated continued threat
- Service availability critical for citizens
- Holiday timing amplified impact

**Financial Sector Under DORA:**
- First year of compliance complete
- Enhanced resilience requirements
- Third-party risk management focus
- Mandatory testing and reporting

### Public Administration

**Ongoing Challenges:**
- Limited cybersecurity budgets
- Legacy systems difficult to secure
- Attractive targets for state-sponsored actors
- Critical services to citizens

**NIS2 Impact:**
- Public administration explicitly covered
- Enhanced security measures required
- Incident reporting obligations
- Need for capacity building

## GDPR Enforcement and Data Protection

**December 2025 GDPR Activity:**

**Major Breach Notifications:**
- FS Italiane/Almaviva incident required GDPR notifications
- Italian Garante investigating breach circumstances
- Passenger personal data exposure triggers Article 33/34 obligations
- Potential significant fines for security failures

**Cross-Border Cooperation:**
- Italian data protection authority coordinating with other EU DPAs
- One-stop-shop mechanism for cross-border cases
- Enhanced information sharing on breach patterns
- Coordinated enforcement approach

**Third-Party Processor Issues:**
- Almaviva breach raises Article 28 compliance questions
- Technical and organizational measures scrutinized
- Controller-processor relationships under examination
- Need for enforceable security commitments

**Enforcement Trends:**
- Continued focus on security of processing (Article 32)
- Data minimization principles increasingly enforced
- Breach notification quality assessed
- Board-level accountability emphasized

## EU Cyber Threat Landscape

### Threat Actor Categories

**1. State-Sponsored Actors:**
- Russian intelligence services and military units (Z-Pentest, Sandworm, APT28)
- Chinese APT groups (Ink Dragon, others)
- Focus: Espionage, sabotage, influence operations
- Targets: Critical infrastructure, government, defense

**2. Financially Motivated Criminals:**
- Ransomware gangs (various groups targeting EU organizations)
- Business email compromise operators
- Cryptocurrency theft groups
- Motivation: Financial extortion

**3. Hacktivists:**
- Pro-Russian groups (NoName057(16))
- Various ideological motivations
- Tactics: DDoS, defacement, data leaks
- Often aligned with state interests

### Most Targeted EU Regions (December)

**December 2025 Geographic Distribution:**
- **Romania**: National water infrastructure
- **France**: Postal and banking services
- **Denmark**: Municipal water infrastructure
- **Italy**: National railway operator

**Persistent Target Areas:**
- Nordic countries (Russian threat focus)
- Baltic states (geopolitical tensions)
- Eastern Europe (proximity to threat actors)
- Major Western European economies (high-value targets)

### Critical Infrastructure Focus

**Priorities for Adversaries:**
- Water and waste water systems
- Energy generation and distribution
- Transportation networks
- Telecommunications infrastructure
- Financial systems
- Government services

## Recommendations for EU Organizations

### Immediate Actions

**1. Critical Infrastructure Protection:**
- Conduct risk assessments of ICS/SCADA systems
- Implement network segmentation (IT/OT separation)
- Enhanced monitoring for anomalous control system behavior
- Regular penetration testing of OT environments
- Incident response plans specific to ICS scenarios

**2. NIS2 Compliance Acceleration:**
- Determine if organization falls under NIS2 scope
- Conduct gap analysis against requirements
- Implement mandatory security measures
- Establish incident reporting procedures to national authorities
- Ensure board-level cyber risk oversight

**3. Supply Chain Risk Management:**
- Emergency audit of all third-party access to systems
- Review and update vendor security requirements
- Implement continuous monitoring of third-party connections
- Contractual obligations for security standards
- Incident notification requirements in all vendor contracts

**4. GDPR/DORA Compliance Verification:**
- Review data protection impact assessments
- Assess adequacy of technical and organizational measures
- Verify breach notification procedures
- For financial sector: ensure DORA resilience testing complete
- Board reporting on compliance status

### Strategic Improvements

**1. Resilience and Business Continuity:**
- Offline, immutable backups for all critical systems
- Regular backup restoration testing
- Manual procedures for critical operations
- Redundancy for essential services
- Geographic diversity for critical systems

**2. Detection and Response:**
- 24/7 security operations capability
- Threat intelligence integration (focus on state-sponsored threats)
- Behavioral analytics for insider threats and compromised accounts
- Automated incident response for common scenarios
- Regular tabletop exercises simulating major incidents

**3. AI Threat Mitigation:**
- AI-powered email security solutions
- Deepfake detection capabilities
- Enhanced identity verification beyond passwords
- User training on AI-generated threats
- Behavioral analysis for anomaly detection

**4. Governance and Oversight:**
- Regular cyber risk reporting to board
- Cyber expertise at board or advisory level
- NIS2 board liability awareness
- Integration of cyber risk into enterprise risk management
- Executive accountability for security outcomes

### Sector-Specific Recommendations

**Critical Infrastructure (Water, Energy, Transport):**
- Prioritize ICS/SCADA security
- Physical security integration with cyber
- Threat intelligence on infrastructure-focused actors
- Regional cooperation with sector peers
- National government coordination

**Financial Services:**
- DORA compliance as baseline
- Third-party risk management priority
- Advanced threat detection for APT groups
- Resilience testing including severe scenarios
- Cross-border incident coordination

**Public Sector:**
- Leverage EU funding for cybersecurity improvements
- Share threat intelligence via national CERTs
- Participate in sector-specific information sharing
- Build internal security expertise
- Public-private partnerships for capability building

**Healthcare:**
- Patient safety implications of cyber incidents
- Medical device security (IoT)
- Supply chain security for health IT vendors
- Ransomware preparedness
- GDPR compliance for health data

## Looking Ahead: 2026 and Beyond

**Regulatory Landscape:**
- Cyber Resilience Act preparation period
- NIS2 enforcement escalation
- DORA second year of operation
- Potential new AI-specific regulations
- Continued GDPR enforcement evolution

**Threat Evolution:**
- Increased state-sponsored infrastructure targeting
- AI-powered attacks becoming mainstream
- Supply chain attacks growing in sophistication
- Ransomware tactics continuing to evolve
- Deepfakes and synthetic media threats

**European Response:**
- Enhanced cross-border cooperation
- NATO cyber defense policy development
- EU cyber defense budget increases
- Mandatory security standards expanding
- Industry-government partnerships strengthening

**Organizational Priorities:**
- Move from compliance to resilience mindset
- Investment in detection and response capabilities
- Supply chain security operationalization
- Board-level engagement with cyber risk
- Continuous adaptation to evolving threats

## Conclusion

December 2025 underscored the multifaceted nature of cyber threats facing the European Union. Critical infrastructure attacks demonstrated that adversaries are willing and able to target essential services with potentially physical consequences. The formal attribution of Russian cyber sabotage against Danish water infrastructure marked a significant moment in European cyber defense, showing increased willingness to publicly name state actors.

The regulatory landscape continued to evolve, with the Cyber Resilience Act reaching final agreement and NIS2/DORA implementation proceeding across sectors. These frameworks provide a structured approach to improving security, but December's incidents showed that threats are evolving as fast as defenses. The combination of state-sponsored sabotage, criminal ransomware, AI-powered fraud, and supply chain compromises requires a comprehensive, multi-layered defense strategy.

Success in 2026 and beyond will require:
- Full implementation of EU cyber regulations (NIS2, DORA, CRA)
- Robust supply chain security programs
- Enhanced critical infrastructure protection (especially ICS/OT)
- AI-powered defenses to counter AI-powered attacks
- Cross-border cooperation and information sharing
- Board-level prioritization and resource allocation

The EU's comprehensive regulatory framework, if fully implemented, positions the region to achieve greater cyber resilience. However, the persistent and evolving nature of threats demands continuous vigilance, adaptation, and investment from both public and private sectors.

## Sources

- [The Register - 1,000 systems pwned in Romanian Waters ransomware attack](https://theregister.com)
- [CSO Online - French postal service brought down by cyber attack](https://csoonline.com)
- [The Guardian - Denmark says Russia was behind two 'destructive and disruptive' cyber-attacks](https://theguardian.com)
- [Security Affairs - Massive data leak hits Italian railway operator Ferrovie dello Stato via Almaviva hack](https://securityaffairs.com)
- [Check Point Research - 22nd December Threat Intelligence Report](https://research.checkpoint.com)
- [Hornet Security - Monthly Threat Report December 2025](https://hornetsecurity.com)
- ENISA Reports and Guidelines
- EU Official Journal (Cyber Resilience Act, NIS2, DORA)
- National Data Protection Authorities
- EU Digital Strategy Communications
