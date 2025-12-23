# July 2025 - US Major Incidents

## Major Data Breaches

### July 16, 2025 – Allianz Life

- **Date:** July 16, 2025
- **Target:** Allianz Life Insurance Co. of North America
- **Attack Type:** Social engineering of third-party CRM platform
- **Impact:** PII of over 1 million Americans stolen (majority of 1.4 million policyholders)
- **Attribution:** Tied to Clop ransomware gang (MOVEit file-transfer hacks)
- **Details:** Hackers infiltrated a cloud-based system used by Allianz Life Insurance Co. of North America on July 16, accessing data on the majority of its 1.4 million policyholders. The breach, discovered within a day, exposed sensitive personally identifiable information (PII) of customers, financial advisers, and some employees. Initial access was via social engineering, tricking vendor staff. Allianz stated its own networks weren't directly compromised – only the external vendor's platform was affected. The incident is tied to the wave of MOVEit file-transfer hacks by the Clop ransomware gang, as Allianz confirmed the attackers exploited a vulnerability in a file-transfer tool used by the vendor. Allianz offered 24 months of credit monitoring to victims.
- **Source:** [CBS News - Allianz Life Data Breach](https://cbsnews.com), [Findings - July 2025 Data Breach Round Up](https://findings.co), [CM Alliance](https://cm-alliance.com)

### July 18, 2025 – Anne Arundel Dermatology

- **Date:** July 18, 2025 (disclosed; attack occurred Feb 14 – May 13, 2025)
- **Target:** Anne Arundel Dermatology (Maryland-based healthcare group)
- **Attack Type:** Undetected intrusion exposing patient data
- **Impact:** Personal health information of nearly 1.9 million patients at risk
- **Attribution:** No known ransomware group claimed (stealth data theft)
- **Details:** The dermatology services provider announced a breach impacting approximately 1.9 million individuals – one of the largest U.S. health data breaches of 2025. Hackers gained unauthorized access to the network for approximately 3 months (Feb 14 – May 13, 2025), likely via compromised remote access or an unpatched system. They may have exfiltrated files containing patients' personal and medical information (names, birthdates, diagnoses, insurance details). The clinic could not confirm if data was actually stolen, but out of caution it offered 24 months of identity protection to those affected. No ransomware group claimed this attack and systems were not encrypted, suggesting it might have been a stealth data theft.
- **Source:** [SecurityWeek](https://securityweek.com), [Strobes - Top Data Breaches July 2025](https://strobes.co), HHS breach database

### May 2025 – U.S. National Guard (Revealed in July)

- **Date:** Breach occurred between March 2024 and late spring 2025; revealed in mid-July
- **Target:** U.S. Army National Guard networks
- **Attack Type:** State-sponsored espionage (configuration data breach)
- **Impact:** Network infrastructure configurations and IT data stolen
- **Attribution:** Chinese state-backed hackers
- **Details:** In mid-July it came to light that Chinese state-backed hackers breached the U.S. Army National Guard's networks sometime between March 2024 and late spring 2025. The attackers quietly stole network infrastructure configurations and other IT data – potentially exposing how Guard networks are set up – though no classified data was said to be taken. Sensitive network details in the hands of a foreign adversary raised security concerns for U.S. military cyber defense. U.S. officials attributed this breach to Chinese cyber espionage units as part of a broader campaign against government agencies.
- **Source:** [Findings - July 2025 Data Breach Round Up](https://findings.co), [CM Alliance](https://cm-alliance.com), BleepingComputer

## Corporate Security Incidents

### July 3, 2025 – Ingram Micro

- **Date:** July 3-9, 2025
- **Target:** Ingram Micro (Global IT supplier/distributor)
- **Attack Type:** Ransomware attack via compromised VPN
- **Impact:** Company-wide outage; losses estimated up to $136 million per day
- **Attribution:** SafePay ransomware gang claimed responsibility
- **Details:** SafePay ransomware attacked Ingram Micro's internal IT, likely via a compromised VPN login, causing a company-wide outage. Ingram's ordering systems, websites, and operations went down internationally for days (July 3-9). The company halted many services and had employees work from home as it contained the breach. Analysts estimated losses up to $100+ million per day of disruption. Ingram announced on Saturday, July 5 that it had identified a ransomware infection within their internal systems. The SafePay group claimed responsibility in a ransom note obtained by BleepingComputer, who reported that the attack was likely preceded by compromising Ingram's VPN platform. The hackers initially used "password spraying" attacks to collect credentials for the VPN instance and leveraged these to break in remotely, exfiltrating data directly from Ingram's systems. SafePay is unusual in not using a RaaS model, instead conducting attacks in-house, and focuses on data exfiltration via "double extortion."
- **Source:** [CM Alliance - July 2025 Cyber Attacks](https://cm-alliance.com), [SWK Technologies - July 2025 Recap](https://swktech.com), BleepingComputer, PCR

### July 20, 2025 – Dell Technologies

- **Date:** July 20, 2025
- **Target:** Dell Technologies (Test environment)
- **Attack Type:** Data breach of isolated test lab platform
- **Impact:** Limited customer information accessed (names, billing addresses, hardware service tags)
- **Attribution:** World Leaks extortion group
- **Details:** Dell disclosed that an unauthorized party (the "World Leaks" extortion gang) breached an isolated test lab platform used by Dell engineers. The attackers accessed limited customer information (names, billing addresses, and hardware service tags) from the test system – no financial data or critical systems were affected. Dell quickly contained the intrusion and notified customers. World Leaks group (financially motivated, known for data theft and extortion) claimed credit. This incident showed even tech giants' non-production environments can be targets.
- **Source:** [CM Alliance - July 2025 Cyber Attacks](https://cm-alliance.com), BleepingComputer

### July 23, 2025 – Toptal

- **Date:** July 23, 2025
- **Target:** Toptal (Freelance platform)
- **Attack Type:** Source code repository compromise
- **Impact:** Malicious code injected into open-source libraries; potential supply-chain threat
- **Attribution:** Not publicly identified; suspected opportunistic hackers exploiting leaked tokens
- **Details:** Freelance platform Toptal had its GitHub source code repository breached, allowing hackers to inject malicious code into some of the company's open-source libraries. Specifically, the attackers published trojanized npm packages from Toptal's account, aiming to steal data from developers who pulled those packages. Potential supply-chain threat to any developers or organizations that integrated the tampered packages (data exfiltration malware was embedded). Toptal secured its GitHub credentials and worked with npm to remove the rogue packages.
- **Source:** [CM Alliance - July 2025 Cyber Attacks](https://cm-alliance.com), BleepingComputer

## Federal Agency Security Impact

### Microsoft SharePoint Zero-Day Exploits

Following the SharePoint hacks, U.S. federal agencies took action:

- **Agencies Compromised:** DHS headquarters, several DHS component agencies, and HHS were confirmed compromised via the SharePoint zero-day
- **DOE Impact:** By late July, parts of DOE including the Nuclear Weapons Agency were also revealed as victims
- **CISA Response:** Issued emergency directives and alerts urging all government bodies and businesses to patch the exploited SharePoint vulnerabilities
- **Cyber Safety Review Board:** Reportedly convened to assess the incident's impact on federal systems
- **Attribution:** U.S. officials openly accused Chinese state hackers (Linen Typhoon/Violet Typhoon) and indicated active measures to "disrupt and defend" against the campaign
- **Technical Details:** Microsoft released patches for two severe zero-day vulnerabilities scoring 9.8 and 7.1 on the CVSS scale, enabling unauthenticated remote code execution (RCE) and administrative access to Microsoft SharePoint Server environments

**Source:** [CBS News - DHS and HHS Hacked](https://cbsnews.com), [SWK Technologies - July 2025 Recap](https://swktech.com), [CM Alliance](https://cm-alliance.com)

## Additional U.S. Breaches

July included other notable incidents:

- **"The Tea" dating app:** Leak of 72,000 confidential images from women's safety dating app due to cloud storage breach
- **Dollar Tree subsidiary:** Ransomware-related breach affecting nearly 2 million individuals' info (via former subsidiary's data through Zeroed-In Technologies)

These incidents further illustrate the range of U.S. targets, from tech startups to retail chains.

**Source:** [CM Alliance - July 2025 Cyber Attacks](https://cm-alliance.com)

## Sources

- [CBS News - Allianz Life Data Breach](https://cbsnews.com)
- [CBS News - DHS and HHS Hacked](https://cbsnews.com)
- [Findings - July 2025 Data Breach Round Up](https://findings.co)
- [CM Alliance - July 2025 Cyber Attacks](https://cm-alliance.com)
- [SWK Technologies - July 2025 Recap](https://swktech.com)
- [SecurityWeek - Anne Arundel Dermatology](https://securityweek.com)
- [Strobes - Top Data Breaches July 2025](https://strobes.co)
- BleepingComputer
- The Record
- Wall Street Journal
