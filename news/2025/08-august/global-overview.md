# Cybersecurity Incidents – August 2025

## Global Overview

### Trends & Analysis

August 2025 witnessed a surge in cyber incidents across the globe, impacting multiple sectors and regions. A coordinated wave of ransomware attacks hit organizations worldwide – the number of ransomware incidents climbed to 506 globally (up 7% from July). No industry proved off-limits: attackers struck healthcare (e.g. US dialysis provider DaVita, 2.6+ million patients affected), finance (Allianz and Farmers Insurance, millions of customer records stolen), aviation (Russia's Aeroflot crippled by hacktivists, grounding flights, and Air France-KLM customer data exposed), tech firms (Google's Salesforce database breached), telecoms, and more.

A significant trend was supply-chain and third-party platform exploits – for example, a Salesforce CRM extortion campaign by the ShinyHunters group compromised multiple corporations in both the U.S. and Europe. Meanwhile, state-sponsored and hacktivist attacks added a geopolitical edge: pro-Ukraine hackers leaked data from Russian targets like Aeroflot, and Norway officially blamed Russian operatives for a dam sabotage incident. Notably, critical vulnerabilities also came to light – WhatsApp rushed to patch a zero-click exploit used to implant spyware on Apple devices – underscoring that August's cyber threats ranged from ransomware and data theft to espionage and critical infrastructure attacks.

### Ransomware Dominance & Evolution

Ransomware remained the #1 threat in August 2025, with both the volume of attacks and the tactics evolving. Several elite ransomware groups operated a "big-game hunting" model at scale: Qilin (aka Agenda) was the most prolific gang, with 86 attacks claimed in August alone – roughly 17% of all incidents – making it the top player for the second month in a row. Groups like Akira (57 attacks) and newcomer Sinobi (36) also racked up dozens of victims. Notably, attackers increasingly exfiltrated data for double extortion: in 201 cases where data theft size was reported, a total of 97.5 TB was stolen (averaging ~485 GB per breach).

Another trend was a shift to cloud-centric tactics – for example, Microsoft reported the Storm-0501 actor pivoting from on-premises to cloud-based ransomware attacks, exploiting enterprise cloud environments for leverage. Ransomware operators also continued to refine their exploitation of VPN appliances and managed service providers as entry vectors (as seen in the SonicWall VPN campaign). Overall, the ransomware economy showed a tightening RaaS model with affiliates enabling a higher tempo of attacks than ever.

### Supply Chain and Third-Party Risks

August's incidents underscored the outsized role of supply-chain attacks. Many major data breaches did not stem from direct hacks of the target company, but from compromise of a vendor or platform. The ShinyHunters campaign is a prime example: by breaching third-party CRM integrations (Salesforce OAuth tokens), hackers accessed dozens of companies' customer databases. Similarly, the compromise of Red Hat's software (disclosed in September) indirectly exposed Nissan's data. This trend extends to software supply chain poisoning (as seen in the Sogou IME malware case in Asia) and to outsourcing providers (the Miljödata case impacting municipalities).

Organizations are increasingly realizing that their cybersecurity is only as strong as that of their weakest supplier. This has led to renewed focus on vendor due diligence, network segmentation for third-party access, and insistence on security certifications in contracts. Regulators in the EU and US are also moving to hold primary companies accountable for third-party breaches, further driving this focus.

### AI: Double-Edged Sword

The influence of artificial intelligence in cybersecurity was highly visible in August. On one hand, security teams are leveraging AI for defense: at the Black Hat USA 2025 conference (early August in Las Vegas), AI-driven security took center stage. Experts discussed "Agentic AI" systems that autonomously analyze attack surfaces and respond to threats, and there were nearly 30 sessions on AI applications in security. The U.S. Department of Defense also highlighted massive investments in AI for cyber operations and the need to bake in resilience against AI-specific threats.

On the other hand, attackers are abusing AI. August saw reports of prompt-injection techniques where malicious instructions hidden inside images could trick large language models into executing harmful code when they process the image. There were also instances of AI tools being used to generate more convincing phishing lures and deepfake voices (for vishing attacks like the Cisco breach). The takeaway is that AI is becoming a battleground – defenders are adopting AI for scale and speed, while adversaries seek to exploit AI's trust and new vulnerabilities. This trend is expected to accelerate, raising discussions about AI governance and security validation for AI systems.

### Geopolitical Cyber Offensives

The interplay between global conflicts and cyber operations was stark in August. The Russia-Ukraine war continued to spill into cyberspace: Russia-affiliated actors not only carried out disruptive attacks (like the Norwegian dam incident and attempted sabotage in Poland and Baltic states, according to intelligence sources), but also engaged in influence operations and espionage hacks against European governments. Conversely, pro-Ukraine hacktivists intensified operations against Russian companies and infrastructure – the Aeroflot breach and leaks by groups like Belarusian Cyber-Partisans and SilentCrow were emblematic.

In the Middle East and Asia, political tensions likewise translated to cyber campaigns (e.g. APT36 against India, Chinese surveillance of dissident communities). This trend of state-sponsored and politically motivated attacks is blurring the line between cybercrime and cyberwarfare. Nations are increasingly naming and shaming state actors (as Norway and the UK did with Russia) and bolstering international cyber alliances. A notable development is NATO's work on a cyber defense policy that could potentially treat certain hacks as equivalent to armed attacks. All told, August reaffirmed that geopolitics heavily influences cyber threat activity, and organizations must consider nation-state tactics in their threat models.

### Targeted Sectors

Analysis of August incidents reveals some sectors faced higher threat levels:

**Manufacturing:** saw the largest spike in ransomware – a 57% increase in attacks from July (72) to August (113), according to Comparitech. High-profile cases included Japan's Asahi Breweries (production halted by Qilin ransomware) and several automotive and electronics suppliers. Threat actors are drawn by the potential to disrupt supply chains and extort payments to resume production.

**Healthcare:** continued to experience large data breaches. While only one healthcare ransomware attack was confirmed in Aug, there were significant disclosures of earlier breaches: for example, the DaVita incident (2.7M patients) and Healthcare Services Group (624K individuals). Attackers covet healthcare data for its long-term value (fraud, identity theft) and know that hospitals are under pressure to avoid downtime.

**Government:** many August ransomware victims were public entities. The State of Nevada attack was unprecedented, and local governments like cities and counties (e.g. St. Paul, MN was hit by InterLock ransomware, crippling city services) were routinely targeted. The trend towards brazen attacks on state IT systems raises concerns about public safety and critical services.

**Telecom & Tech:** Telecom firms (Bouygues, Orange Belgium) suffered breaches affecting millions, showing telcos remain prime targets for data theft. Technology and cloud companies were not spared either – beyond Workday and Cisco, August saw attacks on smaller tech service providers (IT consultancies, MSPs) which threat actors use as beachheads into client networks. Financial services were also heavily targeted via third-party attacks (credit bureaus, insurance, fintech). In summary, no sector was truly safe in August, reinforcing that cybersecurity must be a priority across the board.

## Statistics (August 2025 Cyber Incidents)

### Global Incident Count

Approximately 506 ransomware attacks were recorded worldwide in August 2025. This represents a 7% increase over the previous month, breaking a mid-year decline and marking the second consecutive monthly rise in ransomware activity. Of these 506 attacks, only 30 were publicly confirmed by victims (the rest were claims on leak sites), indicating many organizations likely paid ransoms or silently handled incidents.

### Top Ransomware Groups

The most active ransomware gangs in August by number of victims were:
- **Qilin:** 86 attacks (17% of all incidents)
- **Akira:** 57 attacks
- **Sinobi:** 36 attacks
- **DragonForce:** 30 attacks
- **SafePay:** 28 attacks

Qilin also accounted for the most confirmed data leaks. In terms of successful breaches confirmed by victims, Qilin was responsible for 6 of 30 known cases (20%). Other groups with confirmed hits included Interlock, Warlock, Lynx, Kairos, PEAR, and BlueLocker. Notably, several new ransomware groups emerged in August (e.g. PEAR, Cephalus, Desolator), reflecting the constantly evolving threat landscape.

### Data Breach Volume

Data exfiltration remains a hallmark of modern attacks. In August, for the subset of breaches where hackers provided data size details (201 cases), ~97.5 TB of data was stolen. This averages out to ~0.5 TB (500 GB) per incident. The actual number is likely higher, as many attacks (e.g. Aeroflot, government hacks) did not report sizes. Personal records numbering in the tens of millions were compromised:
- **Farmers Insurance:** 11 million records
- **TransUnion:** 4.4 million records
- **Bouygues Telecom:** 6.4 million records
- **Allianz Life:** 1.1 million records
- **DaVita:** 2.7 million records

### Sector Trends

According to data research, the manufacturing sector saw a huge jump in ransomware attacks in August, up 57% from July (72 attacks in July to 113 in August), the biggest increase for any sector. Many of these were in automotive and industrial suppliers (e.g. Asahi, Sunrise, Shinko Plastics in Japan). Government entities were targets of at least 11 confirmed ransomware attacks in August (and numerous claims), including the unprecedented Nevada incident. In contrast, healthcare and education sectors had only 1 confirmed ransomware attack each in August – however, both saw multiple unconfirmed/extortion cases, and significant breach disclosures from prior hacks (e.g. DaVita's 2.7M patient breach). This suggests adversaries may be avoiding causing outages in hospitals/schools (to limit backlash), yet still stealing data from them.

### Geographic Distribution

North America and Europe continued to account for a large share of incidents, but attacks were truly global:

**United States:** At least 9 states had local governments or schools hit by ransomware in August, and dozens of businesses nationwide were affected. The Nevada statewide attack was a milestone. Breaches of major U.S. corporations also made up a big portion of records lost.

**Europe:** Experienced major incidents in France, Benelux, Nordics, and Italy – ranging from telecom breaches to the Italian hotel passport data heist (90k IDs). The ongoing Russia-Ukraine conflict kept Eastern Europe on alert, though most publicly reported EU incidents in August were in Western Europe.

**Asia:** Saw significant cases in East Asia and South Asia: Japan had multiple ransomware hits (Nissan, others), South Korea dealt with repeated attacks on a high-profile platform, and India grappled with state-sponsored intrusions. Meanwhile, lesser-reported attacks hit parts of the Middle East and Africa (e.g. an Angolan pharmacy chain ransomware listed by Qilin).

Overall, August 2025's statistics confirm an upward trend in cyber attacks after a brief mid-year lull. Ransomware groups are growing bolder and more numerous, data breaches continue to expose massive amounts of personal information, and critical service outages are no longer rarities. These numbers underscore the urgent need for organizations to strengthen their cybersecurity posture heading into the latter half of 2025.

## Key Recommendations

Based on August 2025's incidents, security experts emphasize:

* **Supply chain security and vendor due diligence** are critical to preventing third-party breaches
* **Multi-factor authentication and OAuth token management** must be strengthened to prevent social engineering attacks
* **Cloud security and CRM platform protections** require enhanced monitoring and access controls
* **Ransomware preparedness and backup strategies** remain essential for business continuity
* **Patch management for VPN and remote access systems** is critical after SonicWall campaign
* **Critical infrastructure monitoring and OT security** must be prioritized given dam sabotage and infrastructure attacks

## Sources

- [Comparitech - Ransomware roundup: August 2025](https://comparitech.com)
- [CM Alliance - Major Cyber Attacks, Ransomware Attacks and Data Breaches: August 2025](https://cm-alliance.com)
- [Reuters - Norway spy chief blames Russian hackers for dam sabotage](https://reuters.com)
- [Cybersecurity Review - News August 2025](https://cybersecurity-review.com)
- [The Hacker News - Transparent Tribe Targets Indian Govt](https://thehackernews.com)
- [The Guardian - Russian hackers seized control of Norwegian dam](https://theguardian.com)
- [Illumio - Top Cybersecurity News Stories From August 2025](https://illumio.com)
- [White House - Sustaining Select Efforts to Strengthen Cybersecurity](https://whitehouse.gov)
- [Achilles - Cybersecurity at a Crossroad](https://achilles.com)
- [BleepingComputer - Nissan breach reports](https://bleepingcomputer.com)
- [CloudSEK - Cybersecurity in Focus: India Independence Day Threats](https://cloudsek.com)
