# Cybersecurity Incidents – January 1-5, 2026

## Global Overview

### Trends & Analysis

The first week of January 2026 demonstrated the continued evolution and sophistication of cyber threats across multiple vectors. With 21 major incidents spanning January 1-5, ransomware prosecutions, supply-chain compromises, healthcare data breaches, AI-generated abuse, geopolitical cyber operations, DDoS attacks, and regulatory changes all featured prominently in the opening days of 2026.

**State-Sponsored Cyber Operations at Historic Scale**: Taiwan's National Security Bureau reported an unprecedented 2.63 million cyberattacks per day throughout 2025 from China-linked actors, representing a 6% increase and one of the most intensive state-sponsored cyber campaigns ever documented. Combined with pro-Russian hacktivist group NoName057(16)'s DDoS attacks on France's La Poste and Iranian APT42's spear-phishing against Israeli targets, geopolitical cyber operations reached new levels of intensity.

**Ransomware and Cybercrime**: The prosecution of two U.S. cybersecurity professionals for BlackCat/ALPHV ransomware attacks highlighted the growing insider threat, while ransomware groups like TridentLocker, Qilin, and CL0P continued to target critical infrastructure and healthcare. The Covenant Health breach notification, affecting 478,188 patients, and CL0P's attacks on Oracle E-Business Suite (hitting University of Phoenix and Korean Air) underscored the massive scale of modern ransomware attacks. The indictment of 54 Tren de Aragua gang members for ATM jackpotting demonstrated the convergence of organized crime, cybercrime, and terrorism financing.

**Supply-Chain Attacks**: Software supply-chain attacks continued to evolve, with Trust Wallet confirming a second Shai-Hulud supply-chain attack that resulted in approximately $8.5 million in stolen cryptocurrency. A malicious typosquatted Java library (org.fasterxml.jackson.core) was published on Maven Central, silently installing a multi-stage trojan on victim machines before being taken down within 90 minutes. These incidents demonstrate that supply-chain attacks remain a preferred attack vector for sophisticated threat actors.

**Cloud Service Abuse**: Check Point researchers documented a sophisticated phishing campaign abusing Google Cloud Application Integration to send convincing Google-branded emails. Attackers used the legitimate cloudapplicationintegration.googleapis.com domain with multi-stage redirects to steal credentials, demonstrating how threat actors leverage trusted cloud infrastructure to evade detection.

**Healthcare Under Siege**: Healthcare organizations in the U.S. and New Zealand experienced significant breaches. Beyond Covenant Health's massive exposure (478,188 patients), New Zealand's Manage My Health portal suffered unauthorized access affecting approximately 108,000 patients with a $60,000 ransom demand. Healthcare data remains one of the most valuable commodities on criminal markets.

**Geopolitical Cyber Operations**: Iranian state-backed APT42 (Charming Kitten) conducted spear-phishing campaigns via WhatsApp targeting Israeli security and defense workers on January 2, demonstrating the evolution of state-sponsored attacks toward mobile messaging platforms. Pro-Russian hacktivist group NoName057(16) launched their second DDoS attack on France's La Poste, disrupting postal and banking services for days.

**AI Safety Crisis**: Multiple AI-related incidents emerged: the Grok AI deepfake incident in France, where hundreds of women and minors had "undressed" deepfake images created of them, sparked a major investigation and highlighted critical gaps in AI content moderation. Poland requested EU investigation of TikTok for AI-generated "Polexit" disinformation, demonstrating how AI can be weaponized for political manipulation.

**Data Breaches and GDPR Enforcement**: France's CNIL imposed a €1.7 million fine on Nexpublica for a 2022 breach exposing 6.3 million records, demonstrating continued GDPR enforcement. The European Space Agency suffered a breach with 200GB of data stolen (source code, credentials, tokens) by hacker group "888", showing even highly technical organizations face sophisticated threats.

**Regulatory Landscape Shifts**: China's amended Cybersecurity Law and Hong Kong's Critical Infrastructure Ordinance both took effect January 1, imposing 1-hour incident reporting, higher fines, and stricter data controls. These changes signal intensifying regulatory requirements in Asia.

**Cryptocurrency Crime**: Beyond the Trust Wallet attack, the FBI's takedown of the E-Note darknet exchange disrupted over $70 million in illicit cryptocurrency. Ilya Lichtenstein, who pleaded guilty in 2024 to laundering proceeds from the Bitfinex heist, was released early under the First Step Act.

## Major Global Incidents

### January 1, 2026 – La Poste DDoS Attack (France)

- **Attack Type:** Distributed Denial of Service (DDoS)
- **Impact:** Central computer systems knocked offline; disruption to parcel tracking and banking portals for multiple days
- **Attribution:** NoName057(16) (pro-Russian hacker group)
- **Details:** The pro-Russian hacking group NoName057(16) launched a DDoS cyberattack on France's national postal service La Poste and La Banque Postale. The attack knocked central computer systems offline, disrupting online services including parcel tracking and banking. While online services were affected, physical mail deliveries and ATM payments continued to function. This was the second attack by the group, following a prior DDoS in late December. The attack is under investigation by France's Paris prosecutor and DGSI, with online services being restored.
- **Sources:** https://thecyberexpress.com/ and https://apnews.com/

### January 1, 2026 – China Cybersecurity Law Amendments (China)

- **Attack Type:** Legislative/Policy change
- **Impact:** Mandatory 1-hour incident reporting, higher fines, stricter cross-border data transfer controls, extraterritorial reach
- **Attribution:** Chinese government
- **Details:** China's amended Cybersecurity Law came into effect on January 1, 2026, representing the most significant update since 2017. The changes impose near-real-time (1-hour) incident reporting for critical sectors, substantially higher fines for violations, mandatory security audits, stricter regulations on AI and encryption, and expanded extraterritorial reach allowing Chinese authorities to assert jurisdiction over foreign entities. Businesses operating in or with China must comply with significantly tighter security and data localization requirements.
- **Source:** https://thecyberexpress.com/ and https://mayerbrown.com/

### January 1, 2026 – Hong Kong Critical Infrastructure Ordinance (Hong Kong)

- **Attack Type:** Legislative/Policy change
- **Impact:** Expanded sector designation as "critical"; mandatory incident reporting and heightened security requirements
- **Attribution:** Hong Kong government
- **Details:** Hong Kong's Critical Infrastructure (Computer Systems) Ordinance went live on January 1, 2026, significantly expanding the number of sectors designated as "critical" to include utilities, transport, and other essential services. Private operators now face new compliance obligations including mandatory incident reporting within specified timeframes and heightened security standards. The law aims to enhance resilience of systems vital to Hong Kong's functioning.
- **Source:** https://digitalforensicsmagazine.com/

### January 2, 2026 – BlackCat/ALPHV Ransomware Prosecutions (United States)

- **Attack Type:** Ransomware (BlackCat/ALPHV)
- **Impact:** Two U.S. cybersecurity professionals pleaded guilty to deploying ransomware in multiple 2023 attacks
- **Attribution:** Ryan Goldberg (46) and co-defendant
- **Details:** Two U.S. cybersecurity professionals with legitimate credentials and expertise pleaded guilty to charges tied to their roles in BlackCat/ALPHV ransomware attacks during 2023. This represents a significant case of insider threat and professional misconduct.
- **Source:** https://securityaffairs.com/174898/cyber-crime/blackcat-alphv-ransomware-guilty-pleas.html

### December 31, 2025 – Sedgwick TridentLocker Ransomware Attack (United States)

- **Attack Type:** Ransomware (TridentLocker)
- **Impact:** 3.4GB of data exfiltrated from federal contractor subsidiary
- **Attribution:** TridentLocker ransomware group
- **Details:** Sedgwick confirmed a cybersecurity incident affecting its federal contractor subsidiary, Sedgwick Government Solutions, after the TridentLocker ransomware group claimed to have stolen 3.4GB of data on New Year's Eve. The company is a major claims administrator serving federal contractors.
- **Source:** https://securityaffairs.com/174851/data-breach/sedgwick-tridentlocker-ransomware-attack.html

### January 2026 – Covenant Health Data Breach Updated (United States)

- **Attack Type:** Ransomware (Qilin)
- **Impact:** 478,188 patients affected (updated from initial 7,800)
- **Attribution:** Qilin ransomware group
- **Details:** Covenant Health reported that 7,800 individuals were affected by a data breach in July 2025, but updated the total to 478,188 in December 2025. The attack was later attributed to the Qilin ransomware group. Notifications to affected patients were sent in early January 2026.
- **Source:** https://securityaffairs.com/174825/data-breach/covenant-health-data-breach-2.html

### December 30, 2025 – Manage My Health Breach (New Zealand)

- **Attack Type:** Unauthorized access / Data breach
- **Impact:** ~126,000 patients affected (~6-7% of 1.8M users)
- **Attribution:** Unknown
- **Details:** A widely used patient portal in New Zealand reported a cyber breach affecting up to 126,000 people. Manage My Health has identified general practices whose patients have had their private health information breached. The portal serves approximately 1.8 million users across New Zealand.
- **Sources:** 
  - https://www.healthcareitnews.com/news/apac/126000-affected-it-hack-patient-portal-manage-my-health
  - https://www.rnz.co.nz/news/national/538571/manage-my-health-cybersecurity-hack-gps-whose-patients-data-was-stolen-identified

### January 2026 – Trust Wallet Shai-Hulud Supply-Chain Attack (Global)

- **Attack Type:** Supply-chain attack (Chrome extension compromise)
- **Impact:** ~$8.5 million in cryptocurrency stolen
- **Attribution:** Shai-Hulud campaign
- **Details:** Trust Wallet confirmed that a supply-chain attack tied to the Shai-Hulud campaign allowed a malicious update to its Chrome extension, draining approximately $8.5 million in cryptocurrency from users. This represents the second Shai-Hulud attack affecting Trust Wallet.
- **Source:** https://securityaffairs.com/174880/hacking/trust-wallet-second-shai-hulud-supply-chain-attack.html

### January 2026 – Google Cloud Phishing Campaign (Global)

- **Attack Type:** Phishing via Google Cloud abuse
- **Impact:** Worldwide credential theft campaign
- **Attribution:** Unknown threat actor
- **Details:** Check Point researchers revealed a phishing campaign that abuses Google Cloud Application Integration to send emails impersonating legitimate Google messages. The attack uses layered redirection with trusted cloud services (cloudapplicationintegration.googleapis.com), user validation checks, and brand impersonation to evade detection and increase phishing success.
- **Source:** https://securityaffairs.com/174858/hacking/phishing-campaign-abuses-google-cloud-application.html

### January 2026 – Maven Central Typosquatted Jackson Library (Global)

- **Attack Type:** Software supply-chain / Typosquatting
- **Impact:** Multi-stage trojan installed on victim machines
- **Attribution:** Unknown threat actor
- **Details:** Maven Central, the leading Java dependency repository, was targeted by the malicious "org.fasterxml.jackson.core" package that masqueraded as the legitimate Jackson JSON library. The package silently installed a multi-stage trojan on victim machines. It was taken down within 90 minutes of disclosure.
- **Source:** https://www.scworld.com/news/maven-central-subjected-to-typosquatted-jackson-json-library

### January 2, 2026 – APT42 Spear-Phishing Campaign (Israel)

- **Attack Type:** Spear-phishing via WhatsApp
- **Impact:** Israeli security and defense workers targeted
- **Attribution:** APT42 (Charming Kitten) - Iranian state-backed
- **Details:** Israeli security and defense workers were subjected to an ongoing spear-phishing campaign involving infrastructure linked to Iranian state-backed threat operation APT42, also known as Charming Kitten. Threat actors used WhatsApp to send malicious messages purporting to be from legitimate organizations, luring recipients into clicking shortened URLs that redirect to credential- and information-stealing websites.
- **Source:** https://www.scworld.com/brief/apt42-linked-infrastructure-leveraged-in-israel-targeted-spear-phishing-attack

### January 2, 2026 – Grok AI Deepfake Investigation (France)

- **Attack Type:** AI-generated deepfake abuse
- **Impact:** Hundreds of women and minors victimized
- **Attribution:** Abuse of Grok AI on X platform
- **Details:** French authorities are investigating AI-generated sexually explicit deepfakes created with Grok on X after hundreds of women and teens reported manipulated "undressed" images of them shared on social media. French lawmakers filed formal complaints on January 2. Grok's developers acknowledged isolated failures of content filters and pledged improvements.
- **Source:** https://securityaffairs.com/174842/social-media/french-authorities-investigate-ai-undressing-deepfakes-on-x.html

### January 2, 2026 – Nexpublica GDPR Fine (France)

- **Attack Type:** Enforcement action for 2022 data breach
- **Impact:** €1.7 million fine imposed; 6.3 million personal records exposed (including sensitive disability data)
- **Attribution:** CNIL (French data protection authority)
- **Details:** France's CNIL imposed a €1.7 million fine on Nexpublica under GDPR regulations. The fine stemmed from a 2022 data breach that exposed 6.3 million personal records, including sensitive disability data. The enforcement action demonstrates the continued commitment to data protection and accountability for inadequate security measures.
- **Source:** https://thecyberexpress.com/

### January 2, 2026 – TikTok "Polexit" Disinformation Investigation (Poland/EU)

- **Attack Type:** AI-generated disinformation campaign
- **Impact:** Viral TikTok campaign pushing "Polexit" (Poland leaving EU) propaganda ahead of EU elections
- **Attribution:** Unknown state-backed content creators
- **Details:** The Polish government formally requested EU regulators to investigate TikTok for an AI-generated disinformation campaign promoting "Polexit" ahead of EU elections. Under the Digital Services Act, Poland cited the viral campaign as potential foreign interference in democratic processes. The investigation focuses on social media platforms' role in amplifying state-backed propaganda.
- **Source:** https://thecyberexpress.com/

### January 2, 2026 – European Space Agency Data Breach

- **Attack Type:** Data breach / Cyberattack
- **Impact:** 200GB of data stolen (source code, access tokens, credentials)
- **Attribution:** Hacker group "888" (claimed responsibility)
- **Details:** The European Space Agency's science servers were breached, resulting in the theft of 200GB of sensitive data including source code, access tokens, and credentials. The hacker group known as "888" claimed responsibility for the breach. The incident demonstrates that even highly technical and security-conscious organizations in the space sector are vulnerable to sophisticated cyberattacks.
- **Source:** https://gizmodo.com/

### January 2, 2026 – ATM Jackpotting / Tren de Aragua Gang (United States)

- **Attack Type:** Malware (Ploutus) / ATM Jackpotting
- **Impact:** "Many millions of dollars" stolen and laundered; funds used to support terrorist activities
- **Attribution:** Tren de Aragua gang (54 members indicted; designated terrorist organization from Venezuela)
- **Details:** A federal grand jury indicted 54 members of Venezuela's Tren de Aragua gang, which has been designated as a terrorist organization. The gang allegedly deployed Ploutus malware to hack into hundreds of ATMs across the United States (primarily Nebraska and nationwide), forcing them to dispense cash in so-called "jackpotting" attacks. The stolen funds, totaling "many millions of dollars," were later laundered to fund terrorist activities. This represents a significant case connecting cybercrime, organized crime, and terrorism financing.
- **Source:** https://hstoday.us/

### January 2026 – Bitfinex Hacker Early Release (United States)

- **Attack Type:** Related to 2016 Bitfinex cryptocurrency heist
- **Impact:** Early release of convicted money launderer
- **Attribution:** Ilya Lichtenstein (defendant)
- **Details:** Ilya Lichtenstein, who pleaded guilty in 2024 to laundering proceeds from the Bitfinex heist, was released early under the First Step Act. He publicly credited the policy (signed by former President Trump) for his early release. His wife Heather Morgan, co-defendant in the case, was similarly released early in late 2025.
- **Source:** https://techcrunch.com/2026/01/02/bitfinex-hacker-ilya-lichtenstein-credits-trump-for-early-release-from-prison/

### January 3, 2026 – CL0P Ransomware Attacks on Oracle E-Business Suite (Global)

- **Attack Type:** Ransomware exploiting third-party vulnerability
- **Impact:** Millions of personal and employee records stolen; victims include University of Phoenix (US) and Korean Air (South Korea)
- **Attribution:** CL0P/ALPHV ransomware gang
- **Details:** The CL0P ransomware group expanded attacks targeting Oracle E-Business Suite systems worldwide. Victims reported include University of Phoenix in the United States and Korean Air in South Korea. Attackers exploited a third-party software vulnerability to steal millions of personal and employee records. This demonstrates CL0P's continued focus on high-volume attacks exploiting zero-day flaws in widely deployed enterprise systems.
- **Sources:** https://thecyberexpress.com/ and https://bankinfosecurity.com/

### January 2, 2026 – FBI E-Note Cryptocurrency Exchange Takedown (Global)

- **Attack Type:** Law enforcement operation against darknet payment processor
- **Impact:** Over $70 million in illicit cryptocurrency assets disrupted; infrastructure seized
- **Attribution:** E-Note operators (led by Nikolay Chudnovets)
- **Details:** The FBI led an international operation with German and Finnish partners to seize the online infrastructure of E-Note, a darknet cryptocurrency exchange and payment processor. E-Note had been laundering funds for cybercriminal groups, including ransomware operators and fraud rings. Over $70 million in illicit cryptocurrency assets linked to ransomware and fraud were disrupted. Suspects including Nikolay Chudnovets were charged. The exchange has been shut down and infrastructure seized.
- **Sources:** https://thecyberexpress.com/

### January 4, 2026 – Singapore SmarterMail Vulnerability Warning

- **Attack Type:** Critical vulnerability disclosure (CVE-2025-52691)
- **Impact:** Unauthenticated remote code execution flaw; attackers could steal credentials or take full control of mail systems
- **Attribution:** Any attacker (exploit code is public)
- **Details:** Singapore's Cybersecurity Agency issued an urgent warning about CVE-2025-52691, an unauthenticated remote code execution vulnerability in SmarterMail email servers. The critical flaw allows attackers to steal credentials or gain full control of affected systems without authentication. With exploit code publicly available, the vulnerability poses an immediate threat to unpatched systems. The vendor has released a patch, and organizations are urged to update immediately.
- **Source:** https://thecyberexpress.com/

### January 5, 2026 – Taiwan Reports Massive Chinese Cyber Operations

- **Attack Type:** Sustained cyberattacks / DDoS / MITM / Espionage
- **Impact:** Average of 2.63 million attacks per day throughout 2025 (6% increase); sustained espionage and disruption attempts targeting energy grids, hospitals, banks, and emergency services
- **Attribution:** China's military cyber units (denied by Beijing)
- **Details:** Taiwan's National Security Bureau reported that mainland China-linked hackers launched an average of 2.63 million cyberattacks per day on Taiwan's critical infrastructure in 2025, representing a 6% increase from the previous year. Targets included energy grids, hospitals, banks, and emergency services. The sustained campaign combines espionage, disruption attempts, and probing for vulnerabilities. Taiwan is monitoring the activity and preparing enhanced defenses. Beijing has denied involvement, but Taiwanese authorities attribute the attacks to China's military cyber units as part of broader cross-strait tensions.
- **Source:** https://reuters.com/ and https://economictimes.indiatimes.com/

### January 5, 2026 – UK NCSC Sanitisation Service Launch

- **Attack Type:** Security initiative (not an attack)
- **Impact:** New formal testing and certification service for data sanitisation equipment and processes
- **Attribution:** UK National Cyber Security Centre (NCSC)
- **Details:** The UK's National Cyber Security Centre launched a new Sanitisation Service Assurance initiative on January 5, providing formal testing and certification of data sanitisation (secure data destruction) equipment and processes. This initiative enhances trust in wiping and erasing sensitive data, establishing standards for organizations handling confidential information. The service is active and available immediately.
- **Source:** https://digitalforensicsmagazine.com/

### January 6-7, 2026 – Active Exploitation of Legacy D-Link DSL Router RCE Vulnerability

- **Attack Type:** Remote Code Execution (RCE) via CVE-2026-0625
- **Impact:** Critical vulnerability (CVSS 9.3) in end-of-life D-Link DSL routers being actively exploited
- **Attribution:** Multiple threat actors
- **Details:** Security researchers reported active exploitation of a critical remote code execution vulnerability in legacy D-Link DSL routers that are no longer supported with security patches. The vulnerability allows unauthenticated attackers to execute arbitrary code remotely through the dnscfg.cgi endpoint. This incident highlights the persistent risk of end-of-life network equipment that remains deployed but unpatched, making them attractive targets for threat actors. DNS hijacking attacks similar to the "DNSChanger" campaign have been observed exploiting this flaw.
- **Source:** https://thehackernews.com/2026/01/ongoing-attacks-exploiting-critical-rce-vulnerability-in-legacy-d-link-dsl-routers.html

### January 7, 2026 – NordVPN Denies Data Breach After Leak Claims

- **Attack Type:** Alleged data breach / unauthorized access
- **Impact:** NordVPN denies compromise; leaked data claimed to be old, dummy data, or from third-party test environment
- **Attribution:** Threat actor "1011"
- **Details:** NordVPN publicly denied breach allegations after a hacker claimed to have leaked internal development data from Salesforce development servers on underground forums. The company stated that their investigation found the leaked information was dummy data from an isolated third-party test environment, not production systems. The incident demonstrates the challenges VPN and security providers face in proving negative claims and managing reputation during breach rumors and potential disinformation campaigns.
- **Source:** https://www.securityweek.com/nordvpn-denies-breach-after-hacker-leaks-data/

### January 7, 2026 – BleepingComputer Reports Data Breach

- **Attack Type:** Data breach  
- **Impact:** Cybersecurity news site BleepingComputer confirms unauthorized access
- **Attribution:** Unknown
- **Details:** BleepingComputer, a major cybersecurity news publication, confirmed it experienced a data breach. The incident underscores that even security-focused organizations can become targets and demonstrates the importance of transparency in breach disclosure. As a prominent security news outlet, BleepingComputer may have been targeted for information about vulnerabilities, security researchers, or upcoming stories.
- **Source:** https://www.bleepingcomputer.com/

### January 7, 2026 – Taiwan Reports Tenfold Increase in Chinese Cyberattacks on Energy Sector

- **Attack Type:** State-sponsored cyberattacks on critical infrastructure
- **Impact:** 10x increase in attacks targeting Taiwan's energy sector in 2025
- **Attribution:** Chinese state-sponsored actors
- **Details:** Taiwan's government reported a dramatic tenfold increase in cyberattacks attributed to Chinese actors targeting the nation's energy infrastructure throughout 2025. The attacks appear focused on reconnaissance and establishing persistent access rather than immediate disruption, representing a long-term strategic positioning effort. This escalation is part of broader cross-strait cyber operations, with Taiwan's National Security Bureau previously reporting 2.63 million attacks per day across all critical infrastructure sectors.
- **Source:** https://www.bleepingcomputer.com/news/security/taiwan-says-chinas-attacks-on-its-energy-sector-increased-tenfold/

### January 7, 2026 – Microsoft Warns: Phishing Actors Exploit Complex Routing to Spoof Internal Emails

- **Attack Type:** Advanced phishing via domain spoofing and misconfigured email authentication
- **Impact:** Widespread phishing campaign using Tycoon2FA PhaaS platform; 13+ million malicious emails blocked in October 2025
- **Attribution:** Multiple threat actors using Phishing-as-a-Service (Storm-1747 actor profile)
- **Details:** Microsoft Threat Intelligence disclosed a sophisticated phishing campaign exploiting complex email routing scenarios and misconfigured spoof protections (SPF, DKIM, DMARC) to send emails that appear to originate internally. Threat actors leverage organizations with MX records not pointed to Office 365 and permissive DMARC policies to deliver credential phishing and BEC scams. The attacks use Tycoon2FA adversary-in-the-middle (AiTM) phishing to bypass MFA, with lures themed around voicemails, HR communications, password resets, and fake invoices. The phishing emails show matching "To" and "From" addresses, making them appear as internal communications. This is not a Direct Send vulnerability but a configuration problem requiring strict DMARC enforcement and proper third-party connector setup.
- **Source:** https://www.microsoft.com/en-us/security/blog/

### January 7, 2026 – Two Malicious Chrome Extensions Caught Stealing ChatGPT and DeepSeek Conversations

- **Attack Type:** Malicious browser extensions / data exfiltration
- **Impact:** Chrome extensions designed to steal AI chat conversations and sensitive data
- **Attribution:** Unknown threat actors
- **Details:** Cybersecurity researchers discovered two malicious extensions on the Chrome Web Store specifically designed to exfiltrate conversations from OpenAI ChatGPT and DeepSeek AI platforms. The extensions read and steal sensitive information from AI chat sessions, highlighting a new attack vector as AI tools become valuable data sources. This demonstrates that browser extensions have re-emerged as a high-risk attack surface, with AI platforms now targeted for data theft alongside traditional credential harvesting.
- **Source:** https://thehackernews.com/

### January 7, 2026 – Kimwolf Android Botnet Grows to 2+ Million Devices via Residential Proxies

- **Attack Type:** Android botnet / malware propagation via residential proxy networks
- **Impact:** Over 2 million Android devices compromised, including TVs and IoT devices on internal networks
- **Attribution:** Kimwolf botnet operators (Aisuru malware variant)
- **Details:** The Kimwolf botnet, an Android variant of Aisuru malware, has grown to over two million compromised hosts by exploiting vulnerabilities in residential proxy networks. The botnet targets devices on internal networks, using infected Android devices (including smart TVs and IoT-like devices) as entry points to corporate and home networks. Operators monetize access through residential proxy services and DDoS-for-hire platforms. The significant concern is the pivot capability: compromised Android devices serve as gateways to internal network resources beyond simple DDoS or click fraud.
- **Source:** https://www.bleepingcomputer.com/

### January 7, 2026 – Scattered Lapsus$/ShinyHunters Caught in Researcher Honeypot

- **Attack Type:** Threat actor deception / honeypot operation
- **Impact:** Security researchers successfully trapped known threat actors using fake datasets
- **Attribution:** Scattered Lapsus$ Hunters (also known as ShinyHunters)
- **Details:** Cybersecurity researchers deployed a sophisticated honeypot using realistic but mostly fake datasets to lure and study the Scattered Lapsus$ Hunters group (also known as ShinyHunters). The operation provided valuable intelligence on the threat actors' tactics, techniques, and procedures (TTPs), confirming that even "elite" threat actor groups can be deceived by well-crafted deception infrastructure. This demonstrates the value of active defensive threat intelligence and honeypot operations beyond passive logging and monitoring.
- **Source:** https://www.darkreading.com/

## Statistics

### Global Incident Volume (January 1-5, 2026)
- **21 major incidents** reported across multiple regions
- **Millions of individuals** affected by data breaches (Covenant Health 478K+, Manage My Health 108K+, Nexpublica 6.3M, CL0P victims)
- **€1.7 million** GDPR fine for Nexpublica
- **200GB of data** stolen from European Space Agency
- **$8.5 million** stolen in Trust Wallet supply-chain attack
- **$70+ million** in illicit cryptocurrency disrupted by FBI takedown
- **2.63 million attacks per day** targeting Taiwan in 2025 (6% increase)
- **Hundreds of victims** of AI-generated deepfake abuse
- **"Many millions of dollars"** stolen via ATM jackpotting

### Attack Type Distribution
- Ransomware: 5 incidents (24%) - BlackCat/ALPHV, TridentLocker, Qilin, CL0P, ATM Jackpotting
- Supply-chain attacks: 2 incidents (10%) - Trust Wallet, Maven Central
- Data breaches: 3 incidents (14%) - Manage My Health, Nexpublica, European Space Agency
- DDoS attacks: 1 incident (5%) - La Poste
- State-sponsored attacks: 2 incidents (10%) - Taiwan cyber operations, APT42
- Legislative/Policy changes: 2 incidents (10%) - China Cybersecurity Law, Hong Kong ordinance
- Law enforcement operations: 1 incident (5%) - E-Note takedown
- Phishing/Social engineering: 1 incident (5%) - Google Cloud phishing
- AI abuse/disinformation: 2 incidents (10%) - Grok deepfakes, TikTok Polexit
- Vulnerability disclosure: 1 incident (5%) - SmarterMail
- Security initiative: 1 incident (5%) - UK NCSC Sanitisation Service

### Most Targeted Sectors
1. Financial services / Cryptocurrency (4 incidents: Trust Wallet, E-Note, Bitfinex, ATM Jackpotting)
2. Healthcare (3 incidents: Covenant Health, Manage My Health, Taiwan hospitals)
3. Government / Critical infrastructure (4 incidents: La Poste, China/Hong Kong regulatory, Taiwan infrastructure)
4. Defense/Security (2 incidents: APT42 targeting Israeli security, European Space Agency)
5. Software development / IT (2 incidents: Maven Central, SmarterMail)
6. Social media/AI platforms (2 incidents: Grok deepfakes, TikTok disinformation)
7. Higher education (1 incident: University of Phoenix)
8. Aviation (1 incident: Korean Air)

### Geographic Distribution
- Asia-Pacific: 6 incidents (China, Hong Kong, Taiwan, New Zealand, Singapore, Israel/Iran-linked)
- European Union: 6 incidents (France: La Poste, Nexpublica, Grok, Poland: TikTok, ESA, UK: NCSC)
- United States: 4 incidents (BlackCat/ALPHV, Sedgwick, Covenant Health, ATM Jackpotting)
- Global/Multi-region: 5 incidents (Trust Wallet, Google Cloud phishing, Maven Central, CL0P, E-Note)

### Severity Assessment
- Critical: 12 incidents (Taiwan cyber operations, La Poste DDoS, ATM jackpotting, healthcare breaches, ESA breach, Grok deepfakes, CL0P ransomware, state-sponsored attacks, SmarterMail vulnerability)
- High: 7 incidents (BlackCat prosecutions, supply-chain attacks, law enforcement operations, GDPR fines, TikTok disinformation)
- Medium: 2 incidents (China/Hong Kong regulatory changes, UK NCSC service launch)

## Threat Actor Activity

### BlackCat/ALPHV
Two U.S. cybersecurity professionals were prosecuted for deploying BlackCat/ALPHV ransomware in 2023, demonstrating insider threats and professional misconduct. Related to the broader ALPHV/CL0P operations.

### CL0P Ransomware Gang
The CL0P ransomware group (also associated with ALPHV operations) expanded attacks targeting Oracle E-Business Suite systems globally in January 2026. Victims include University of Phoenix (US) and Korean Air (South Korea). The group continues their pattern of exploiting zero-day flaws in widely deployed enterprise systems to conduct high-volume attacks and steal millions of records.

### TridentLocker
New Year's Eve attack on Sedgwick Government Solutions, exfiltrating 3.4GB of data from federal contractor.

### Qilin
Attributed to the massive Covenant Health breach affecting 478,188 patients from a July 2025 attack.

### Shai-Hulud Campaign
### Shai-Hulud Campaign
Second supply-chain attack on Trust Wallet Chrome extension, stealing $8.5 million in cryptocurrency.

### APT42 (Charming Kitten)
Iranian state-backed group conducting spear-phishing via WhatsApp against Israeli security and defense personnel on January 2, 2026.

### NoName057(16)
Pro-Russian hacker group that launched DDoS attacks against France's La Poste postal and banking services on January 1, 2026. This was their second attack on French infrastructure after a late December campaign.

### Tren de Aragua Gang
Venezuelan criminal organization designated as a terrorist group. 54 members were indicted for deploying Ploutus malware in ATM jackpotting attacks across the United States, stealing "many millions of dollars" that were laundered to fund terrorist activities.

### China's Military Cyber Units
Taiwan's National Security Bureau attributes 2.63 million daily cyberattacks to China's military cyber units, targeting Taiwan's critical infrastructure throughout 2025 with a 6% increase. Beijing has denied involvement.

### Hacker Group "888"
Claimed responsibility for breaching the European Space Agency's science servers and stealing 200GB of data including source code, access tokens, and credentials.

### E-Note Operators (Disrupted)
Led by Nikolay Chudnovets, E-Note was a darknet cryptocurrency exchange that laundered over $70 million for cybercriminal groups including ransomware operators. The FBI-led international operation successfully disrupted the infrastructure and charged the operators.

### Unknown Supply-Chain Actors
- Google Cloud phishing campaign abusing legitimate cloud infrastructure
- Maven Central typosquatting attack with Jackson library impersonation

### Unknown State-Backed Actors (TikTok Disinformation)
Unknown state-backed content creators launched an AI-generated disinformation campaign on TikTok promoting "Polexit" ahead of EU elections, prompting Polish government to request EU investigation under the Digital Services Act.

## Key Trends Analysis

### Supply-Chain Attacks Remain Prevalent
Three separate supply-chain incidents (Trust Wallet, Maven Central, Google Cloud abuse) demonstrate that attackers continue to find success by compromising trusted infrastructure and software distribution channels.

### Healthcare Is Prime Target
With over 604,000 individuals affected across U.S. and New Zealand healthcare breaches, the healthcare sector remains one of the most targeted and vulnerable industries.

### Mobile Messaging as Attack Vector
APT42's use of WhatsApp for spear-phishing represents the evolution of social engineering toward mobile platforms where security controls may be less mature than email.

### AI Safety Gaps
The Grok deepfake incident exposed critical gaps in AI content moderation and safety filters, demonstrating that AI technology can be weaponized for harassment and abuse.

### Insider Threats
The BlackCat/ALPHV prosecution highlights the serious risk posed by cybersecurity professionals who use their expertise and access for criminal purposes.

### Cryptocurrency Crime Evolution
Both the Trust Wallet supply-chain attack and the Bitfinex hacker release demonstrate that cryptocurrency remains a major target and motivation for cybercriminals.

### State-Sponsored Cyber Warfare Intensifies
Taiwan reported an unprecedented 2.63 million cyberattacks per day throughout 2025, attributed to China's military cyber units. This represents one of the most intensive state-sponsored cyber campaigns globally, demonstrating the cyber dimension of geopolitical conflicts.

### Pro-Russian Hacktivist Operations
NoName057(16)'s DDoS attacks on French infrastructure (La Poste) demonstrate continued pro-Russian hacktivist targeting of Western European critical services as part of broader geopolitical cyber operations.

### DDoS Attacks on Critical Services
The La Poste attack showed how DDoS can disrupt essential government services (postal, banking) for days, affecting millions of users even when physical operations continue.

### AI-Powered Disinformation Campaigns
The TikTok "Polexit" campaign demonstrates how AI-generated content can be weaponized for political disinformation, prompting new investigations under the EU's Digital Services Act.

### GDPR Enforcement Continues
The €1.7 million fine against Nexpublica for a 2022 data breach demonstrates continued EU commitment to data protection enforcement, even years after incidents.

### Regulatory Tightening in Asia
China's 1-hour incident reporting requirement and Hong Kong's expanded critical infrastructure protections signal increasing regulatory burden on organizations operating in the region.

### ATM Infrastructure Vulnerabilities
The Tren de Aragua gang's ATM jackpotting attacks demonstrate that physical banking infrastructure remains vulnerable to malware-based attacks, with connections to organized crime and terrorism financing.

### Space Sector Cybersecurity
The European Space Agency breach demonstrates that even highly technical organizations in sensitive sectors face sophisticated cyber threats, with 200GB of critical data compromised.

### Critical Vulnerability Warnings
Singapore's urgent SmarterMail vulnerability disclosure highlights the ongoing challenge of securing widely-deployed software systems against unauthenticated remote code execution flaws.

## Looking Ahead

### Key Takeaways for Q1 2026

- **Supply-chain security** must be a top priority for organizations
- **Healthcare cybersecurity** requires urgent investment and attention
- **AI safety measures** need significant strengthening, especially for content generation
- **Insider threat programs** are critical as trusted professionals can become threat actors
- **Mobile platform security** needs to match email security controls
- **Vendor risk management** is essential as third-party compromises cascade to clients
- **State-sponsored threats** continue targeting critical infrastructure and personnel at unprecedented scale
- **Cryptocurrency** remains a high-value target requiring robust security
- **DDoS protection** for critical government services must be strengthened
- **GDPR compliance** remains essential with continued enforcement and significant fines
- **Regulatory compliance** in Asia requires rapid incident reporting (1-hour in China)
- **ATM security** needs modernization to prevent malware-based jackpotting attacks
- **Space sector security** requires enhanced protections for sensitive research data
- **Vulnerability management** must be rapid and comprehensive to prevent exploitation

### Emerging Challenges

1. **AI-Generated Content Abuse**: Need for robust content moderation and safety filters (Grok deepfakes, TikTok disinformation)
2. **Supply-Chain Trust**: Difficulty validating software dependencies and updates
3. **Mobile Messaging Security**: WhatsApp and similar platforms as phishing vectors
4. **Healthcare Data Protection**: Massive breaches affecting hundreds of thousands
5. **Cloud Service Abuse**: Legitimate infrastructure weaponized for phishing
6. **Insider Threats**: Trusted professionals with security expertise becoming criminals
7. **State-Sponsored Mass Attacks**: Unprecedented scale of attacks (2.63M/day on Taiwan)
8. **Cross-Border Regulatory Complexity**: Navigating different requirements (1-hour reporting in China vs. other jurisdictions)
9. **ATM Malware Evolution**: Organized crime using sophisticated malware for jackpotting
10. **Space Sector Vulnerabilities**: Critical research infrastructure under attack
11. **Pro-Russian Hacktivist Campaigns**: Continued DDoS targeting of Western infrastructure
12. **AI Disinformation**: State-backed actors using AI for political manipulation

## Conclusion

The first week of January 2026 demonstrated that cyber threats are becoming more sophisticated, diverse, and impactful across multiple dimensions. With 21 major incidents spanning January 1-5, the threat landscape has intensified significantly compared to previous periods.

**State-Sponsored Operations at Unprecedented Scale**: Taiwan's report of 2.63 million daily cyberattacks from China-linked actors throughout 2025 represents one of the most intensive state-sponsored cyber campaigns ever documented. Combined with pro-Russian hacktivist DDoS attacks on French infrastructure and Iranian APT operations against Israeli targets, the geopolitical cyber dimension has reached new levels of intensity.

**Regulatory Landscape Shifting**: China's implementation of 1-hour incident reporting requirements and Hong Kong's expanded critical infrastructure protections demonstrate increasing regulatory burden in Asia. Simultaneously, the EU continues aggressive GDPR enforcement with the €1.7 million Nexpublica fine, showing that data protection violations will face consequences even years after breaches occur.

**AI as Dual-Use Technology**: The Grok deepfake incident affecting hundreds of women and minors, combined with the TikTok "Polexit" disinformation campaign, demonstrates how AI can be weaponized for both personal harassment and political manipulation. These incidents highlight critical gaps in AI content moderation that must be addressed urgently.

**Evolving Criminal Tactics**: From supply-chain attacks (Trust Wallet, Maven Central) to ATM jackpotting by terrorist organizations (Tren de Aragua), from insider threats (BlackCat professionals) to space sector breaches (European Space Agency), criminals are diversifying their methods and targets. The healthcare sector continues to bear a disproportionate burden with massive breaches affecting over 6 million individuals across multiple incidents.

Organizations must adopt a comprehensive, multi-layered security approach that addresses traditional network threats, supply-chain risks, insider threats, mobile platform security, AI safety concerns, DDoS resilience, vulnerability management, and regulatory compliance. The healthcare sector requires particular attention given the scale and frequency of breaches. Financial infrastructure, including ATMs and cryptocurrency platforms, needs modernization to prevent malware-based attacks.

International cooperation, robust legal frameworks, rapid response capabilities, and aggressive vulnerability management will be essential to combat these evolving threats throughout 2026. The incidents of early January serve as a stark reminder that cybersecurity is not just a technical challenge but a business, legal, ethical, societal, and geopolitical imperative. Organizations must prepare for an environment where state-sponsored attacks occur at unprecedented scale, AI-powered threats emerge rapidly, and regulatory requirements become increasingly stringent across different jurisdictions.
