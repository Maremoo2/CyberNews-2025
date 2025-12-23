# June 2025 - Norway Major Incidents

## National Cyber Incidents

### April 7, 2025 (Reported June 2025) – Bremanger Dam Breach

- **Date:** April 7, 2025 (attack occurred); became public in late June when authorities released findings
- **Target:** Bremanger hydropower dam control system (western Norway, near Risevatnet)
- **Attack Type:** Critical infrastructure sabotage / cyberattack on control systems
- **Impact:** Dam valve opened remotely for four hours; 497 liters/second extra outflow
- **Attribution:** Unknown hackers; initial rumors suggested Russian links but not confirmed

#### Attack Details

**Discovery:**
The dam's owner, Breivika Eiendom, noticed abnormal readings on April 7 and quickly isolated the system. Attackers managed to remotely log in to the dam's control panel (which regulates a water reservoir) and fully open one of the dam's valves for four hours.

**Water Release:**
This caused a surge of 497 liters per second in outflow. While not dangerous (the dam's flood capacity is approximately 20,000 l/s), it was definitely unauthorized and potentially risky.

**Timeline:**
- **April 7:** Abnormal readings detected; system isolated
- **April 10:** Norway's National Security Authority (NSM) and Water Resources Directorate (NVE) were alerted
- **Case handed to Kripos** (police cybercrime unit) for investigation
- **Late June:** Incident findings made public

#### Cause and Vulnerability

**Simple Exploit:**
Investigators believe the intruders simply exploited a **weak password** on the web-based control interface. No sophisticated malware or zero-day exploit was used. The control system was:
- Accessible online with minimal protection
- No multi-factor authentication
- Essentially an invitation to anyone who knew the address

As Claroty Chief Strategy Officer Grant Geyer noted: "This wasn't a super sophisticated cyber attack; it was someone logging into a control system with too little security and opening a dam valve all the way."

#### Attribution and Speculation

**Initial Reports:**
Initial reports suggested the attack may have been launched from Russia, but neither NSM nor Breivika Eiendom confirmed this. It might well have been a lone hacker or small group "testing the waters" rather than nation-state actors.

**Significance:**
The lack of sophisticated techniques doesn't diminish the severity – it actually makes it more concerning that such basic security failures exist in critical infrastructure.

#### Impact Assessment

**Minimal Physical Damage:**
Fortunately, the dam primarily serves a fish farm and isn't connected to Norway's power grid, so the consequences were minor – no flooding or injuries.

**Wake-Up Call:**
However, this "near miss" was a major wake-up call. Norwegian experts from NSM and Claroty noted that even simple attacks due to lax security can threaten public safety.

#### Response and Remediation

**Immediate Actions by Dam Owner:**
- Quickly implemented multi-factor authentication
- Removed the system from direct internet access
- Enhanced monitoring capabilities

**NSM Utilization:**
By June, NSM was using this incident as a teaching example in outreach to other utility operators, emphasizing:
- Strong passwords and MFA on control systems
- Active monitoring of OT environments
- Better cyber hygiene in industrial facilities
- Removing unnecessary internet connectivity

#### Broader Implications

**Key Lessons:**
- "Just like you wouldn't leave your front door unlocked, the systems that we rely on for access to water, power, and heat need that same basic protection." - Grant Geyer, Claroty
- "Remote access, authentication hygiene, and clear ownership of cyber-physical interfaces should be routine agenda items, not reactive conversations."
- "Incidents like this are not outliers; they're reminders that foundational controls are the cornerstone of operational resilience."

**National Impact:**
This incident alone spurred nationwide discussions about protecting Norway's water, energy, and transportation systems from cyber threats. It validated warnings about potential targeting of Norway's critical infrastructure.

**Source:** [CyberRisk Leaders - Hackers Open Dam Valves in Norway](https://cyberriskleaders.com), [SANS NewsBites - Volume XXVII, Issue 49](https://sans.org)

## Breaches Affecting Norwegian Companies

### Indirect Global Breach Impacts

June 2025 passed without any publicly known large-scale data breach at a Norway-headquartered company. However, global breaches had indirect effects on Norway:

#### 16 Billion Credential Leak Impact

The massive 16 billion credential leak mentioned in global incidents likely included countless Norwegian user accounts:
- Email logins
- Netflix and streaming service passwords
- Social media credentials
- Banking and financial service logins

**Response:**
Norwegian businesses were urged by NSM to proactively:
- Reset passwords organization-wide
- Enable multi-factor authentication
- Monitor for account takeover attempts
- Educate employees about credential security

#### Episource Healthcare Breach

Norwegian subsidiaries of international firms were impacted:
- Norway's branch of Episource (healthcare IT provider) involved in 5.4M patient data breach disclosed in U.S.
- Norwegian patient records in certain clinical trials may have been exposed
- Highlighted risks of international data transfers

#### Ahold Delhaize Breach

Norwegian customers of Ahold Delhaize (owner of local grocery chains) indirectly affected:
- Some European loyalty program data stored on compromised U.S. servers
- Limited Norwegian customer exposure
- Demonstrated interconnected nature of global operations

### Norwegian Response to Global Threats

While no Norway-headquartered company announced a significant breach in June, organizations quietly took proactive measures:

**Banks:**
- Doubled down on fraud detection
- Anticipated credential stuffing attempts
- Enhanced monitoring for account takeover

**Industrial Firms:**
- Re-audited OT networks
- Mindful of Bremanger dam case
- Reviewed remote access security

**Emergency Security Reviews:**
Several large Norwegian companies held emergency security reviews in June after news of:
- Ransomware spike globally
- Mega-credential leaks
- Critical infrastructure targeting

This precautionary stance was prudent given Norway's history (e.g., the 2019 Hydro ransomware attack).

## Government and NSM Cybersecurity Advisories

### Digital Security Act (Passed June 23, 2025)

On June 23, 2025, the Storting (Norwegian legislature) passed the new **Digital Security Act (DSA)** and an accompanying regulation. This law, which took effect later on October 1, 2025, represents a milestone for Norway's cyber resilience.

#### Alignment with EU Framework

The DSA aligns closely with the EU's NIS Directive framework, ensuring Norway (though not an EU member) maintains compatibility with European standards.

#### Key Requirements

**Covered Entities:**
Companies in sectors including:
- Energy
- Transportation
- Healthcare
- Finance
- Digital infrastructure

**Mandatory Measures:**
- Maintain robust security measures
- Report incidents to authorities (NSM) within 24 hours
- Conduct regular risk assessments
- Implement incident response plans
- Board-level accountability for cybersecurity

**Enforcement:**
- Specifies fines for non-compliance
- Assigns sector-specific regulators to oversee enforcement
- Provides clear guidelines for penalties

#### Legislative Significance

**Unified Framework:**
The DSA updated and unified rules that were previously scattered across various laws. It signifies Norway's commitment to:
- Keeping pace with EU standards
- Protecting national critical infrastructure
- Creating clear regulatory expectations
- Holding organizations accountable

**Catalyst:**
Lawmakers in the final committee review specifically cited the Bremanger dam incident as evidence for stronger cyber laws, demonstrating how real-world incidents drive policy.

**Source:** [DLA Piper - Digital Security Act](https://norway.dlapiper.com)

### NSM National Framework for Handling Digital Attacks

In late June, the Norwegian National Security Authority (NSM) published a **national framework for handling digital attacks**, which provides guidelines for organizations on incident management and inter-agency cooperation.

#### Framework Components

**Systematic Incident Response:**
- Clear procedures for incident detection and reporting
- Escalation protocols to national level when needed
- Coordination between public and private sectors
- Integration with EU's Cybersecurity Blueprint

**Collaboration Emphasis:**
The framework stresses collaboration between:
- Government agencies
- Private sector organizations
- Critical infrastructure operators
- International partners

**Based on Lessons Learned:**
Builds on lessons from past cyber crises, including:
- 2019 Norsk Hydro ransomware attack
- Bremanger dam incident
- Global ransomware trends
- International best practices

**Source:** [DataGuidance - NSM Framework](https://dataguidance.com)

### NSM Advisories and Bulletins

#### Global Ransomware Warning (June 2025)

NSM issued advisory to Norwegian businesses:

**Content:**
- Warning about global ransomware uptick
- Cited trends reported by Europol and FBI
- Specific threat actor profiles

**Recommended Steps:**
- Implement offline backups
- Conduct ransomware response drills
- Segment networks to contain potential spread
- Ensure recovery procedures tested
- Maintain incident response plans

#### 16 Billion Credential Leak Response

NSM bulletin highlighted risks from the massive credential dump:

**Urgent Recommendations:**
- Enforce organization-wide password resets
- Mandate multi-factor authentication
- Monitor for account takeover attempts
- Educate employees about password reuse risks

**Rationale:**
Password reuse by employees could lead to breaches given the massive credential dump available to attackers.

### Energy Sector Cybersecurity Exercise (Mid-June 2025)

The Norwegian Energy Sector conducted a special cybersecurity exercise, facilitated by NVE (Norwegian Water Resources and Energy Directorate) and NSM.

#### Exercise Details

**Timing:**
The exercise was planned earlier but gained prominence post-Bremanger dam hack.

**Scenario:**
Simulated cyberattack on a regional power grid control system.

**Objectives:**
- Practice new reporting flows mandated by DSA
- Test coordination between utilities and authorities
- Validate NSM's new framework
- Identify gaps in communication and response

**Outcomes:**
Officials noted the exercise helped identify communication gaps that would be fixed ahead of the DSA's full implementation in October.

**Participants:**
- Major power utilities
- Grid operators
- NVE regulators
- NSM security experts
- Municipal energy authorities

## Government Proactive Measures

### Justice Minister Press Conference

Following the dam attack discovery, Norway intensified public warnings:

**May 5 Press Conference:**
Justice Minister held press conference urging critical infrastructure operators to:
- Be on high alert for cyber threats
- Report all anomalies to NSM immediately
- Review and strengthen security controls
- Implement recommended best practices

### PST Security Warnings

Norway's Police Security Service (PST) maintained heightened threat communications:

**February 2025 Annual Assessment:**
Actively referenced throughout June, identifying:
- Pro-Russian cyber groups as biggest digital threat to Norway
- Increased targeting due to Norway's NATO membership
- Support for Ukraine making Norway potential target

**Veileder Program:**
Increased surveillance of key facilities' networks through the Veileder program:
- Collaboration between intelligence services and industry
- Active monitoring of critical infrastructure
- Threat intelligence sharing
- Early warning capabilities

### International Cooperation Initiatives

#### NATO Collaboration

- **Participation in Locked Shields 2025:** Testing joint responses to power grid and telecom attacks
- **Information sharing:** Enhanced coordination on threat intelligence
- **Joint exercises:** Practicing cross-border incident response

#### Scandinavian Cyber Agreement (Mid-May)

Cybersecurity information-sharing agreement with Sweden and Denmark:
- Focus on energy sector protection
- Joint threat intelligence
- Coordinated response to regional threats
- Shared best practices

#### Cyber Range Funding (May 18)

Announcement of funding for new Cyber Range at Norwegian university:
- Simulate attacks for training
- Train incident responders
- Develop domestic cybersecurity talent
- Support research and development

## Statistics and Context

### Incident Volume

**First Half 2025:**
NSM handled approximately 500 serious cyber incidents (increase from ~400 in same period 2024).

**June Specifically:**
Few dozen incidents of note, most minor:
- Malware infections
- DDoS attacks
- Phishing campaigns
- Attempted intrusions

**Tier 1 Incident:**
Bremanger dam attack was the single significant incident in terms of potential impact.

### Comparative Context

**Low Breach Numbers:**
- Very few personal records compromised in Norway-specific incidents
- Under 50,000 individuals' data exposed year-to-date (mostly from minor incidents earlier in year)
- Low figure internationally pointing to either strong privacy protections or underreporting
- New DSA law expected to improve reporting transparency

### No Additional Major Incidents

No other major cyberattacks on Norwegian critical infrastructure were disclosed in June beyond the Bremanger dam incident. However, this single incident was sufficient to drive significant policy and operational changes across the country.

## Impact Assessment

- **First known cyberattack** on Norwegian physical infrastructure with operational impact
- **Four-hour unauthorized water release** from hydropower facility
- **Major wake-up call** about critical infrastructure vulnerabilities
- **Simple attack vector** (weak password) demonstrated basic security failures
- **No casualties** but highlighted potential for harm
- **Catalyzed legislative action** (DSA passage)
- **Spurred national discussion** about protecting critical infrastructure
- **Enhanced security measures** across utility sector
- **International cooperation** expanded
- **Proactive defense posture** adopted by government and industry

## Looking Ahead from June 2025

The relative calm in June 2025 (aside from the dam incident) provided Norway an opportune moment to push proactive initiatives:

### October 2025 Implementation

With DSA taking effect October 1, organizations had several months to prepare:
- Implement required security measures
- Establish incident reporting procedures
- Conduct risk assessments
- Train staff on new requirements

### Continued Vigilance

Norway's proactive measures in June positioned the country well, but officials emphasized:
- Constant vigilance necessary
- Threats continue to evolve
- No room for complacency
- Sustained investment required

### Building on Momentum

The combination of:
- Strong legislative framework (DSA)
- Practical guidance (NSM framework)
- International cooperation (NATO, Scandinavia)
- High public awareness
- Emergency exercises

...positioned Norway to address future cyber threats more effectively than before June 2025.

## Sources & Citations

- [CyberRisk Leaders - Hackers Open Dam Valves in Norway](https://cyberriskleaders.com)
- [SANS NewsBites - Volume XXVII, Issue 49, July 1, 2025](https://sans.org)
- [DLA Piper - Digital Security Act and Related Regulation Enters into Force](https://norway.dlapiper.com)
- [DataGuidance - NSM Publishes National Framework for Handling Digital Attacks](https://dataguidance.com)
- [Ozark FCU - June 2025 Data Breach (for global credential leak context)](https://ozarkfcu.com)
- Norwegian National Security Authority (NSM) public advisories
- Norwegian Water Resources and Energy Directorate (NVE) reports
- Police Security Service (PST) threat assessments
