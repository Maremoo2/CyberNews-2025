# November 2025 - United States Summary

## Overview

November 2025 proved to be a pivotal month for US cybersecurity, with the nation experiencing 356 ransomware attacks—more than 10 times the number of any other country. The month was dominated by sophisticated zero-day exploitation, critical infrastructure targeting, and aggressive ransomware campaigns that disrupted emergency services, compromised major educational institutions, and exposed sensitive data of tens of thousands of individuals.

Four major incidents defined the month: Harvard University's social engineering breach, Cox Enterprises and Dartmouth College falling victim to an Oracle E-Business Suite zero-day exploited by the Cl0p ransomware group, and the Inc Ransom gang's devastating attack on the CodeRED emergency alert system. These incidents collectively affected over 40,000 individuals directly and disrupted critical services for millions more.

The month also saw significant policy developments, including the extension of critical cybersecurity laws and coordinated international sanctions against ransomware infrastructure, demonstrating both the severity of the threat and the growing commitment to combating it through legislative and diplomatic means.

## Key Trends

### Zero-Day Exploitation at Scale

The Cl0p ransomware group's systematic exploitation of CVE-2025-61882, a previously unknown vulnerability in Oracle E-Business Suite, represents a significant escalation in ransomware tactics. Unlike traditional opportunistic attacks, this campaign demonstrated:

**Advanced Capability:** The ability to discover and weaponize zero-day vulnerabilities in widely-deployed enterprise software requires substantial resources and expertise, suggesting either nation-state backing or highly sophisticated criminal organizations.

**Organized Campaign Structure:** Cl0p didn't exploit a single target but conducted a coordinated campaign across multiple sectors, including higher education (Dartmouth), media and telecommunications (Cox Enterprises), and numerous other organizations not publicly disclosed.

**Data Exfiltration Focus:** Rather than purely encrypting systems for ransom, Cl0p prioritized data theft for extortion—stealing 226 GB from Dartmouth alone. This "double extortion" tactic increases pressure on victims who might otherwise restore from backups.

### Critical Infrastructure Vulnerabilities

The Inc Ransom attack on OnSolve's CodeRED emergency alert system exposed alarming vulnerabilities in public safety infrastructure:

**Systemic Impact:** CodeRED serves hundreds of local governments across dozens of states, meaning a single compromise disrupted emergency notification capabilities for millions of Americans.

**Public Safety Risk:** During an actual emergency (natural disaster, active threat, public health crisis), the inability to send timely alerts could result in loss of life.

**Third-Party Concentration:** The consolidation of emergency services onto third-party platforms creates single points of failure with cascading consequences.

### Social Engineering Sophistication

Harvard University's breach via phone-based social engineering (vishing) demonstrates that human vulnerabilities remain a primary attack vector, even at institutions with significant cybersecurity resources:

**Technical Controls Insufficient:** Multi-factor authentication and endpoint protection cannot prevent attacks that manipulate authorized users into providing access.

**Targeting Sophistication:** Attackers demonstrated knowledge of Harvard's organizational structure, alumni affairs operations, and likely conducted reconnaissance to make their social engineering attempts more convincing.

**Persistent Threat:** Despite years of security awareness training, social engineering remains effective, suggesting the need for more robust verification procedures for sensitive access requests.

### Ransomware Industrialization

November's incidents reflect the continued industrialization of ransomware operations:

**Group Specialization:** Different ransomware groups demonstrate distinct specializations:
- **Cl0p:** Zero-day exploitation, enterprise targets, systematic campaigns
- **Inc Ransom:** Government and critical infrastructure, aggressive demands

**Professional Operations:** Both groups maintained dark web leak sites, conducted negotiations, and operated with business-like efficiency.

**Global Infrastructure:** The US Treasury sanctions against Media Land LLC highlight the complex international infrastructure supporting ransomware operations, including bulletproof hosting providers that shield criminal activities from law enforcement.

## Impact Assessment

### Individual Impact

**Directly Affected Individuals:**
- **~9,500** Cox Enterprises employees and customers with personal data exposed
- **~32,500** individuals connected to Dartmouth (1,500 NH + 31,000 ME residents) with names, SSNs, and financial information stolen
- **Thousands** of Harvard alumni, donors, faculty, and staff with personal information and donation histories potentially accessed
- **Unknown but significant** number of CodeRED users with contact information exfiltrated

**Indirect Impact:**
- **Millions** of Americans in jurisdictions using CodeRED experienced disrupted emergency notification capabilities
- **Hundreds of organizations** potentially affected by Gainsight/Salesforce platform compromise
- **Numerous Oracle EBS customers** not yet publicly disclosed as Cl0p victims

### Institutional Impact

**Higher Education:**
- Dartmouth College: 226 GB of sensitive data stolen and published
- Harvard University: Alumni affairs operations compromised
- Other institutions: Multiple colleges affected by Oracle EBS campaign

**Emergency Services:**
- Emergency alert disruptions across dozens of states
- Loss of public trust in emergency notification systems
- Potential gaps in emergency preparedness during critical incidents

**Corporate Sector:**
- Cox Enterprises: Data breach affecting nearly 10,000 individuals
- Multiple organizations: Oracle EBS vulnerability exposures
- Reputational damage and regulatory scrutiny

### Economic Impact

**Direct Costs:**
- Ransom payments (many unreported)
- Incident response and forensics
- Legal and regulatory compliance
- Credit monitoring for affected individuals
- System restoration and hardening

**Indirect Costs:**
- Lost productivity during system outages
- Reputational damage and customer churn
- Increased insurance premiums
- Long-term security improvements

**Systemic Costs:**
- $1 billion State and Local Cyber Grant Program extension
- Federal agency incident response resources
- CISA emergency directive compliance costs

## Sector-Specific Analysis

### Higher Education

November revealed higher education as a high-value target for ransomware groups:

**Vulnerabilities:**
- Large amounts of sensitive personal data (SSNs, financial information)
- Research and intellectual property
- Often limited cybersecurity budgets relative to data value
- Complex IT environments with many users and access points

**Dartmouth Case Study:**
The Dartmouth breach exemplifies these vulnerabilities. As a prestigious institution, it held valuable data on:
- Students (past and present)
- Faculty and researchers
- Donors (including financial information)
- Research activities and intellectual property

The 226 GB of stolen data suggests comprehensive compromise, and the publication on Cl0p's leak site indicates failed ransom negotiations—a decision that exposed tens of thousands of individuals' sensitive information.

### Emergency Services

The CodeRED attack represents a watershed moment for emergency services cybersecurity:

**Current State:**
- Many jurisdictions rely on third-party platforms
- Emergency systems often lack robust cybersecurity
- Limited redundancy for critical alert functions
- Budget constraints limit security investments

**Implications:**
- Need for enhanced security requirements for emergency service vendors
- Consideration of redundant notification systems
- Increased federal support for local emergency infrastructure
- Potential regulatory requirements for critical alert systems

### Corporate Enterprise

The Oracle EBS zero-day affected numerous corporate enterprises:

**Risk Factors:**
- Dependence on widely-deployed enterprise software
- Patch management challenges in complex environments
- High value of corporate data for extortion
- Regulatory compliance pressures

**Cox Enterprises Case:**
As a major media and communications company, Cox's breach demonstrates that even large organizations with security resources can fall victim to zero-day attacks. The relatively "small" number (9,500) of affected individuals suggests Cox may have detected and contained the breach before more extensive damage occurred.

## Policy and Regulatory Response

### Legislative Actions

**Cybersecurity Funding Extension:**
The extension of the State and Local Cyber Grant Program ensures continued federal support for jurisdictions facing resource constraints. This $1 billion program is particularly critical given the CodeRED incident, which demonstrated how local governments depend on vulnerable third-party systems.

**CISA Extension:**
The 2015 Cybersecurity and Infrastructure Security Act extension maintains legal protections for companies sharing threat intelligence with the government. This is crucial for responding to campaigns like the Oracle EBS zero-day, where rapid information sharing can help potential victims defend against known exploitation techniques.

### International Cooperation

**Media Land Sanctions:**
The coordinated US-UK-Australia sanctions against Media Land LLC and its leadership represent an important evolution in combating ransomware:

**Precedent:** Demonstrates willingness to use financial sanctions against ransomware infrastructure
**Coordination:** Trilateral action increases effectiveness by preventing simple relocation
**Deterrence:** Sends message to bulletproof hosting providers supporting criminal activities
**Limitations:** Effectiveness depends on enforcement and the ability to prevent operations from relocating to non-sanctioned jurisdictions

### Federal Agency Response

**CISA Actions:**
- Emergency directive for Oracle EBS patching
- Enhanced threat intelligence on Cl0p tactics
- Support for CodeRED incident response

**FBI Involvement:**
- Investigation of Inc Ransom and Cl0p operations
- International coordination on ransomware groups
- Victim support and evidence collection

## Lessons Learned

### For Organizations

**1. Patch Management is Critical (But Insufficient)**
The Oracle EBS zero-day demonstrates that even diligent patching cannot prevent zero-day exploitation. Organizations need:
- Defense-in-depth strategies
- Network segmentation to limit breach impact
- Robust monitoring for unusual data access
- Incident response plans that assume compromise

**2. Social Engineering Remains Effective**
Harvard's breach shows that technical controls must be paired with:
- Regular security awareness training
- Verification procedures for sensitive access requests
- Cultural emphasis on security responsibility
- Simulated phishing and vishing exercises

**3. Third-Party Risk Requires Active Management**
CodeRED and Gainsight incidents highlight:
- Need for contractual security requirements
- Regular third-party security assessments
- Contingency plans for vendor compromises
- Consideration of concentration risk

**4. Data Protection is Paramount**
With ransomware shifting to data exfiltration:
- Encryption of sensitive data at rest
- Data loss prevention tools
- Monitoring of data transfers
- Data minimization practices

### For Policymakers

**1. Critical Infrastructure Protections**
CodeRED demonstrates need for:
- Enhanced security standards for emergency systems
- Federal support for local cybersecurity
- Redundancy requirements for critical functions
- Regular security assessments of essential services

**2. International Cooperation**
Media Land sanctions show:
- Value of coordinated international action
- Need for expanded partnerships
- Importance of financial pressure on criminal infrastructure
- Potential for greater coordination with more countries

**3. Information Sharing**
CISA extension supports:
- Legal protection for threat intelligence sharing
- Public-private partnership effectiveness
- Rapid response to emerging threats
- Collective defense benefits

**4. Resource Allocation**
State and Local Cyber Grant Program demonstrates:
- Federal funding enables local cybersecurity improvements
- Importance of sustained investment
- Need for capacity building at all government levels

## Looking Ahead

### Immediate Priorities

**For Organizations:**
1. **Patch Oracle EBS:** Immediate application of CVE-2025-61882 fix
2. **Review Emergency Systems:** Assessment of third-party emergency platforms
3. **Enhance Vishing Defenses:** Implement phone-based verification procedures
4. **Monitor for Exfiltration:** Deploy data loss prevention tools
5. **Segment Networks:** Isolate critical systems

**For Government:**
1. **Emergency System Security:** Enhanced requirements for critical alert platforms
2. **Threat Intelligence:** Expanded sharing on active campaigns
3. **International Cooperation:** Build on Media Land sanctions model
4. **Resource Support:** Continue funding for state/local cybersecurity

### Strategic Initiatives

**Zero-Trust Architecture:**
November's incidents demonstrate the inadequacy of perimeter-based security. Organizations should accelerate adoption of zero-trust principles:
- Verify every access request
- Assume breach
- Minimize blast radius through segmentation
- Continuous monitoring and validation

**Supply-Chain Security:**
The Oracle EBS campaign and third-party incidents require:
- Enhanced vendor security requirements
- Regular third-party risk assessments
- Contractual security controls
- Continuous monitoring of third-party access

**Resilience Focus:**
Beyond prevention, organizations need resilience:
- Immutable, offline backups
- Incident response playbooks
- Business continuity plans
- Regular tabletop exercises

### Emerging Challenges

**AI-Enabled Attacks:**
While not prominently featured in November's US incidents, the Chinese AI-powered campaign demonstrates future threats:
- Automated vulnerability discovery
- AI-enhanced social engineering
- Adaptive attack techniques
- Scale of operations

**Ransomware Evolution:**
Expect continued evolution:
- More zero-day exploitation
- Increased critical infrastructure targeting
- Data exfiltration becoming primary tactic
- Specialization among threat groups

## Conclusion

November 2025 marks a significant chapter in US cybersecurity history. With 356 ransomware attacks—far exceeding any other nation—the United States remains the primary target for sophisticated cyber criminals and nation-state actors. The month's incidents revealed critical vulnerabilities in enterprise software (Oracle EBS zero-day), emergency services (CodeRED), higher education (Harvard and Dartmouth), and corporate infrastructure (Cox Enterprises).

The diversity of successful attacks—from advanced zero-day exploitation to simple phone-based social engineering—demonstrates that threats span the entire spectrum of sophistication. No organization, regardless of size or resources, can consider itself immune.

However, November also demonstrated progress in the fight against cybercrime. The extension of critical cybersecurity laws ensures continued funding and information sharing. International sanctions against ransomware infrastructure show growing cooperation among allies. Federal agencies actively supported victims and shared threat intelligence.

As we look toward 2026, the lessons of November 2025 are clear: cybersecurity requires sustained investment, public-private cooperation, international coordination, and a fundamental shift from perimeter defense to resilience-focused strategies that assume breach and prioritize rapid detection, response, and recovery.

The 40,000+ individuals directly affected by November's breaches, and the millions more who experienced disrupted emergency services, deserve no less than our unwavering commitment to improving cybersecurity across all sectors of American society.
