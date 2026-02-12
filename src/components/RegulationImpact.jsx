import { useState } from 'react';
import './RegulationImpact.css'

function RegulationImpact({ selectedYear }) {
  const [isExpanded, setIsExpanded] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const currentYear = new Date().getFullYear();
  
  // Key regulations and their impact
  const regulations = [
    {
      name: 'NIS2 Directive',
      icon: '🇪🇺',
      status: selectedYear >= 2024 ? 'In Effect' : 'Pending',
      region: 'European Union & EEA',
      impact: 'Expanded scope covering more critical sectors and supply chains. Increased penalties for non-compliance.',
      description: 'Directive (EU) 2022/2555 on measures for a high common level of cybersecurity across the Union, adopted December 14, 2022.',
      officialName: 'NIS 2-direktivet - Europaparlaments- og rådsdirektiv (EU) 2022/2555',
      keyRequirements: [
        'Mandatory incident reporting within 24 hours',
        'Supply chain security requirements',
        'Board-level accountability for cybersecurity',
        'Regular security audits and risk assessments',
        'Risk management with minimum security elements',
        'Handling of cybersecurity risks in supply chains',
        'Plans for maintenance, monitoring and testing'
      ],
      sectors: {
        essential: ['Energy', 'Transport', 'Banking', 'Health', 'Drinking water', 'Digital infrastructure', 'ICT services', 'Public administration', 'Space'],
        important: ['Postal and courier services', 'Waste management', 'Chemical production', 'Food production', 'Medical equipment', 'Research']
      },
      penalties: 'Up to €10,000,000 or 2% of global revenue for essential entities; €7,000,000 for important entities',
      implementationDeadline: 'October 24, 2024',
      realWorldImpact: selectedYear >= 2024 
        ? 'Organizations scrambled to comply, leading to increased security investments and faster incident disclosure.'
        : 'Organizations are preparing for stricter requirements and expanded coverage.',
      resources: [
        { 
          title: 'Official EU Legal Text (English)', 
          url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:52020PC0823',
          type: 'external'
        },
        { 
          title: 'Norwegian Government EEA Note', 
          url: 'https://www.regjeringen.no/no/sub/eos-notatbasen/notatene/2021/feb/nis2-direktivet/id2846097/',
          type: 'external'
        },
        { 
          title: 'NIS2 Directive PDF', 
          url: '/documents/nis2/Nis2.pdf',
          type: 'pdf'
        },
        { 
          title: 'NIS2 Directive - EU Briefing PDF', 
          url: '/documents/nis2/Nis2 directive eu breifing.pdf',
          type: 'pdf'
        }
      ],
      color: '#3498db',
      hasDetailedInfo: true
    },
    {
      name: 'NIST Cybersecurity Framework',
      icon: '🇺🇸',
      status: 'Established',
      region: 'United States & Global',
      impact: 'Widely adopted voluntary framework for managing cybersecurity risk. Version 2.0 released in 2024 with enhanced focus on governance and supply chain.',
      description: 'NIST Cybersecurity Framework (CSF) 2.0 provides guidance for managing and reducing cybersecurity risk. It is a voluntary framework adopted globally by organizations of all sizes.',
      officialName: 'NIST Cybersecurity Framework Version 2.0',
      keyRequirements: [
        'Identify: Asset management, risk assessment, and governance',
        'Protect: Access control, awareness training, and data security',
        'Detect: Continuous monitoring and detection processes',
        'Respond: Incident response planning and communications',
        'Recover: Recovery planning and improvements',
        'Govern: Establishing and maintaining cybersecurity governance (NEW in 2.0)'
      ],
      implementationTiers: [
        'Tier 1 (Partial): Ad hoc, reactive risk management',
        'Tier 2 (Risk Informed): Risk management practices approved but not established',
        'Tier 3 (Repeatable): Risk management practices are formally approved and expressed as policy',
        'Tier 4 (Adaptive): Organization adapts its practices based on lessons learned'
      ],
      realWorldImpact: selectedYear >= 2024
        ? 'NIST CSF 2.0 released with enhanced governance focus. Organizations increasingly reference NIST CSF in contracts and RFPs. Used as common language for board-level cyber risk discussions.'
        : 'Continued global adoption as de facto standard for cyber risk management. Increasingly referenced in regulations and contracts.',
      resources: [
        { 
          title: 'Official NIST Cybersecurity Framework', 
          url: 'https://www.nist.gov/cyberframework',
          type: 'external'
        },
        { 
          title: 'NIST CSF Documentation', 
          url: 'https://csrc.nist.gov/projects/cybersecurity-framework',
          type: 'external'
        },
        { 
          title: 'NIST CSF 2.0 PDF', 
          url: '/documents/nist/NIST-CSF-2.0.pdf',
          type: 'pdf',
          note: 'To be uploaded'
        },
        { 
          title: 'NIST Implementation Guide', 
          url: '/documents/nist/NIST-implementation-guide.pdf',
          type: 'pdf',
          note: 'To be uploaded'
        }
      ],
      color: '#16a085',
      hasDetailedInfo: true
    },
    {
      name: 'DORA',
      icon: '🇪🇺',
      status: selectedYear >= 2025 ? 'In Effect' : 'Pending',
      region: 'European Union & EEA',
      impact: 'Establishes comprehensive ICT risk management requirements for financial sector. Includes third-party risk management and digital operational resilience testing.',
      description: 'Regulation (EU) 2022/2554 on digital operational resilience for the financial sector (DORA). Entered into force January 17, 2025 in EU, July 1, 2025 in Norway.',
      officialName: 'Forordningen om Digital operasjonell motstandskraft (DORA) - EU Regulation 2022/2554',
      keyRequirements: [
        'ICT risk management with governance at board level',
        'Incident reporting and classification',
        'Digital operational resilience testing',
        'ICT third-party risk management',
        'Information sharing arrangements'
      ],
      sectors: ['Banking', 'Insurance', 'Investment firms', 'Payment services', 'Crypto-asset services', 'Critical ICT third-party service providers'],
      penalties: 'Up to €10,000,000 or 5% of total annual turnover for financial entities. Critical ICT providers subject to oversight.',
      implementationDeadline: 'January 17, 2025 (EU) / July 1, 2025 (Norway)',
      realWorldImpact: selectedYear >= 2025
        ? 'Financial institutions implementing comprehensive ICT risk frameworks. Increased focus on third-party vendor management and resilience testing. Penalties up to 50 million NOK in Norway.'
        : 'Financial sector preparing for new requirements. Gap analyses and third-party risk assessments underway.',
      resources: [
        { 
          title: 'Official EU Legal Text', 
          url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32022R2554',
          type: 'external'
        },
        { 
          title: 'Finans Norge - DORA Information', 
          url: 'https://www.finansnorge.no/tema/digitalisering/eus-digitale-agenda/forordningen-om-digital-operasjonell-motstandskraft---dora/',
          type: 'external'
        },
        { 
          title: 'PwC Norway - DORA Guide', 
          url: 'https://www.pwc.no/no/innsikt/dora-alt-du-trenger-a-vite.html',
          type: 'external'
        },
        { 
          title: 'DORA Regulation PDF', 
          url: '/documents/dora/DORA.pdf',
          type: 'pdf'
        },
        { 
          title: 'DORA - Norsk Lovtidend PDF', 
          url: '/documents/dora/DORA Norsk lovtidend.pdf',
          type: 'pdf'
        }
      ],
      color: '#e67e22',
      hasDetailedInfo: true
    },
    {
      name: 'GDPR',
      icon: '🔒',
      status: 'Established',
      region: 'European Union & Global',
      impact: 'Continued enforcement with record fines for data breaches and privacy violations.',
      keyRequirements: [
        'Data breach notification within 72 hours',
        'Privacy by design and by default',
        'Right to erasure and data portability',
        'Mandatory DPO for certain organizations'
      ],
      realWorldImpact: selectedYear >= 2024
        ? 'Enforcement intensified with multi-million euro fines. Organizations faced increased scrutiny on data handling practices.'
        : 'Mature enforcement with predictable penalty frameworks.',
      color: '#2ecc71'
    },
    {
      name: 'Digital Services Act (DSA)',
      icon: '⚖️',
      status: selectedYear >= 2024 ? 'In Effect' : 'Rolling Out',
      region: 'European Union',
      impact: 'New obligations for online platforms to combat illegal content and disinformation.',
      keyRequirements: [
        'Transparency in content moderation',
        'Risk assessments for systemic risks',
        'Crisis response mechanisms',
        'Independent audits of algorithmic systems'
      ],
      realWorldImpact: selectedYear >= 2024
        ? 'Major platforms implemented transparency reports and content moderation changes. Increased focus on combating deepfakes and AI-generated disinformation.'
        : 'Platforms are adapting policies in preparation for full enforcement.',
      color: '#9b59b6'
    },
    {
      name: 'SEC Cyber Disclosure Rules',
      icon: '🇺🇸',
      status: selectedYear >= 2023 ? 'In Effect' : 'Pending',
      region: 'United States',
      impact: 'Public companies must disclose material cybersecurity incidents within 4 business days.',
      keyRequirements: [
        '8-K filing within 4 days of material incident',
        'Annual disclosure of cyber risk management',
        'Board oversight description required',
        'CISO or equivalent role disclosure'
      ],
      realWorldImpact: selectedYear >= 2024
        ? 'Increased transparency led to faster public disclosure of breaches. Boards demanded better cyber risk reporting.'
        : 'Organizations are establishing materiality assessment frameworks.',
      color: '#e74c3c'
    },
    {
      name: 'China Cybersecurity Law',
      icon: '🇨🇳',
      status: 'In Effect',
      region: 'China',
      impact: 'Strict data localization and cybersecurity review requirements for critical infrastructure.',
      keyRequirements: [
        'Data localization for critical data',
        'Security reviews for data transfers abroad',
        'Critical infrastructure designation requirements',
        'Mandatory security certification'
      ],
      realWorldImpact: selectedYear >= 2024
        ? 'Foreign companies faced challenges with data residency requirements. Increased government scrutiny of technology supply chains.'
        : 'Continued enforcement with selective penalties for non-compliance.',
      color: '#f39c12'
    }
  ]

  return (
    <section className="regulation-impact" id="regulation" aria-label="Regulation Impact">
      <div className="regulation-header">
        <h2>📜 Regulatory Landscape & Compliance Impact</h2>
        <p className="regulation-subtitle">
          How cybersecurity regulations shaped the threat landscape and organizational responses in {selectedYear}
        </p>
      </div>

      <div className="regulation-intro">
        <p>
          Cybersecurity regulations increasingly drive organizational security strategies. In {selectedYear}, 
          multiple frameworks matured globally, creating a complex compliance landscape that directly influenced 
          how organizations detected, responded to, and disclosed cyber incidents.
        </p>
        <button 
          className="show-more-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          {isExpanded ? '▼ Show less' : '▶ Show more details'}
        </button>
      </div>

      {isExpanded && (
      <>

      {/* Regulation Cards */}
      <div className="regulations-grid">
        {regulations.map((reg) => (
          <div 
            key={reg.name} 
            className="regulation-card"
            style={{ borderTopColor: reg.color }}
          >
            <div className="regulation-card-header">
              <div className="reg-title-row">
                <span className="regulation-icon">{reg.icon}</span>
                <div>
                  <h3>{reg.name}</h3>
                  <p className="reg-region">{reg.region}</p>
                </div>
              </div>
              <span 
                className={`reg-status ${reg.status.toLowerCase().replace(' ', '-')}`}
                style={{ backgroundColor: reg.color }}
              >
                {reg.status}
              </span>
            </div>

            <div className="regulation-content">
              {reg.description && (
                <div className="reg-section">
                  <h4>ℹ️ Description</h4>
                  <p>{reg.description}</p>
                  {reg.officialName && <p className="official-name"><em>{reg.officialName}</em></p>}
                </div>
              )}

              <div className="reg-section">
                <h4>📋 Impact</h4>
                <p>{reg.impact}</p>
              </div>

              <div className="reg-section">
                <h4>✓ Key Requirements</h4>
                <ul>
                  {reg.keyRequirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              {reg.sectors && (
                <div className="reg-section">
                  <h4>🏢 Covered Sectors</h4>
                  <div className="sectors-info">
                    <div>
                      <strong>Essential Entities:</strong>
                      <p className="sector-list">{reg.sectors.essential.join(', ')}</p>
                    </div>
                    <div>
                      <strong>Important Entities:</strong>
                      <p className="sector-list">{reg.sectors.important.join(', ')}</p>
                    </div>
                  </div>
                </div>
              )}

              {reg.penalties && (
                <div className="reg-section">
                  <h4>⚖️ Penalties</h4>
                  <p>{reg.penalties}</p>
                </div>
              )}

              {reg.implementationDeadline && (
                <div className="reg-section">
                  <h4>📅 Implementation Deadline</h4>
                  <p>{reg.implementationDeadline}</p>
                </div>
              )}

              <div className="reg-section real-world">
                <h4>🌍 Real-World Impact in {selectedYear}</h4>
                <p>{reg.realWorldImpact}</p>
              </div>

              {reg.resources && reg.resources.length > 0 && (
                <div className="reg-section resources">
                  <h4>📚 Resources & Documentation</h4>
                  <ul className="resources-list">
                    {reg.resources.map((resource, index) => (
                      <li key={index}>
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`resource-link ${resource.type}`}
                        >
                          {resource.type === 'pdf' && '📄 '}
                          {resource.type === 'external' && '🔗 '}
                          {resource.title}
                        </a>
                        {resource.note && <span className="resource-note"> ({resource.note})</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* NIS2 Detailed Overview */}
      <div className="nis2-detailed-section">
        <h3>🇪🇺 NIS2-direktivet - Detaljert Oversikt</h3>
        <div className="nis2-content">
          <div className="nis2-intro">
            <h4>Om NIS2-direktivet</h4>
            <p>
              <strong>Europaparlaments- og rådsdirektiv (EU) 2022/2555</strong> om tiltak for å sikre et høyt felles nivå for sikkerhet i nettverks- og informasjonssystemer i hele Unionen, om endring av forordning (EU) 910/2014 og direktiv (EU) 2018/1972 og om oppheving av direktiv (EU) 2016/1148 (NIS 2-direktivet).
            </p>
            <p>
              <strong>Directive (EU) 2022/2555 of the European Parliament and of the Council</strong> of 14 December 2022 on measures for a high common level of cybersecurity across the Union, amending Regulation (EU) No 910/2014 and Directive (EU) 2018/1972, and repealing Directive (EU) 2016/1148 (NIS 2 Directive) (Text with EEA relevance).
            </p>
          </div>

          <div className="nis2-status">
            <h4>📅 Status og Viktige Datoer</h4>
            <ul>
              <li><strong>Vedtatt:</strong> 14. desember 2022</li>
              <li><strong>Gjennomføringsfrist:</strong> Innen 24. oktober 2024 skal medlemsstatene ha gjennomført direktivet i nasjonal rett</li>
              <li><strong>Ikrafttredelse:</strong> Fra 24. oktober 2024 oppheves gjeldende NIS1-direktiv</li>
              <li><strong>EØS-notat:</strong> Opprettet 16.02.2021, sist oppdatert 23.08.2023</li>
            </ul>
          </div>

          <div className="nis2-background">
            <h4>🎯 Bakgrunn og Formål</h4>
            <p>
              Bakgrunnen for direktivet er erkjennelsen av at selv om NIS1-direktivet har vært en viktig start i reguleringen av digital sikkerhet i EU, har implementeringen avdekket flere mangler som forhindrer direktivet fra å effektivt adressere aktuelle og fremtidige utfordringer innen digital sikkerhet.
            </p>
            <p>
              Formålet med NIS2-direktivet er å:
            </p>
            <ul>
              <li>Øke motstandsdyktigheten i nettverks- og informasjonssystemer til både private og offentlige aktører</li>
              <li>Redusere fragmenteringen av det indre markedet i sektorer som allerede er omfattet av NIS-direktivet</li>
              <li>Forbedre den felles bevisstheten og kapasiteten knyttet til motstandsdyktighet</li>
              <li>Redusere fragmentering og øke harmoniseringen gjennom mer effektivt samarbeid mellom kompetente myndigheter</li>
            </ul>
          </div>

          <div className="nis2-scope">
            <h4>🏢 Virkeområde og Omfattede Sektorer</h4>
            <p>
              NIS2-direktivet utvider virkeområdet sammenlignet med det nåværende NIS-direktivet, ved å innlemme flere sektorer som anses som kritisk for både økonomien og samfunnet.
            </p>
            
            <div className="scope-categories">
              <div className="scope-category essential">
                <h5>Vesentlige Tjenester (Essential)</h5>
                <p>Disse sektorene er oppført i direktivets vedlegg 1:</p>
                <ul>
                  <li>Energi</li>
                  <li>Transport</li>
                  <li>Bank</li>
                  <li>Finansmarkedsinfrastrukturer</li>
                  <li>Helse</li>
                  <li>Drikkevann</li>
                  <li>Avløpsvann</li>
                  <li>Digital infrastruktur</li>
                  <li>IKT-tjenester</li>
                  <li>Offentlig forvaltning (sentral og regional)</li>
                  <li>Romvirksomhet</li>
                </ul>
              </div>

              <div className="scope-category important">
                <h5>Viktige Tjenester (Important)</h5>
                <p>Disse sektorene er oppført i direktivets vedlegg 2:</p>
                <ul>
                  <li>Post- og kurertjenester</li>
                  <li>Avfallshåndtering</li>
                  <li>Produksjon og distribusjon av kjemikalier</li>
                  <li>Matproduksjon</li>
                  <li>Produksjon av visse varer (medisinsk utstyr, IKT-utstyr, kjøretøy, elektronikk, maskiner, transportutstyr)</li>
                  <li>Tilbydere av digitale tjenester</li>
                  <li>Forskning</li>
                </ul>
              </div>
            </div>

            <div className="size-requirements">
              <h5>Størrelseskriterier</h5>
              <p>
                Direktivet skal gjelde alle virksomheter innenfor de angitte sektorene som er like store eller større enn såkalte "medium sized enterprises" - virksomheter med <strong>50 eller flere ansatte</strong>.
              </p>
              <p>
                Også mindre virksomheter er omfattet dersom de:
              </p>
              <ul>
                <li>Er eneleverandør til et EU-land av en tjeneste som er vesentlig for å opprettholde kritisk samfunnsmessig eller økonomisk aktivitet</li>
                <li>Er særlig utsatt ved at en hendelse som rammer tjenesten kan få betydelig innvirkning på offentlig trygghet, sikkerhet eller helse</li>
                <li>Anses for å være kritiske enheter etter CER-direktivet</li>
              </ul>
            </div>
          </div>

          <div className="nis2-requirements">
            <h4>🛡️ Styrking av Sikkerhetskravene</h4>
            <p>
              NIS2 styrker sikkerhetskravene som stilles til tilbydere sammenlignet med NIS1. Medlemsstatene må sikre at tilbydere iverksetter hensiktsmessige og proporsjonale tekniske og organisatoriske tiltak.
            </p>
            <p>
              Minimumsliste over grunnleggende sikkerhetselementer inkluderer:
            </p>
            <ul>
              <li>Håndtering av cybersikkerhetsrisiko i forsyningskjeder og hos leverandører</li>
              <li>Planer for vedlikehold, overvåkning og testing</li>
              <li>Bruk av kryptografi</li>
              <li>Regelmessige sikkerhetsauditer og risikovurderinger</li>
              <li>Board-level ansvar for cybersikkerhet</li>
            </ul>
          </div>

          <div className="nis2-reporting">
            <h4>⚡ Varsling av Hendelser</h4>
            <p>
              Direktivet innfører mer presise bestemmelser om prosessen for varsling av hendelser:
            </p>
            <ul>
              <li><strong>Hva:</strong> Hendelser som har en betydelig innvirkning på tjenesteleveransen</li>
              <li><strong>Når:</strong> Mandatory incident reporting within 24 hours</li>
              <li><strong>Hvordan:</strong> Detaljerte bestemmelser om tidspunktene for varsling</li>
            </ul>
          </div>

          <div className="nis2-supervision">
            <h4>👁️ Tilsyn og Sanksjoner</h4>
            <p>
              Bestemmelsene om tilsyn skiller mellom tilbydere av vesentlige og viktige samfunnsviktige tjenester:
            </p>
            <div className="supervision-grid">
              <div className="supervision-item">
                <h5>Vesentlige tjenester</h5>
                <ul>
                  <li>Kan bli gjenstand for uanmeldt tilsyn</li>
                  <li>Strengere tilsynsregime</li>
                  <li>Administrativ sanksjon opptil <strong>€10,000,000</strong> eller <strong>2% av global omsetning</strong></li>
                </ul>
              </div>
              <div className="supervision-item">
                <h5>Viktige tjenester</h5>
                <ul>
                  <li>Tilsyn kun ved informasjon om manglende overholdelse</li>
                  <li>Mindre strengt tilsynsregime</li>
                  <li>Administrativ sanksjon opptil <strong>€7,000,000</strong></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="nis2-cooperation">
            <h4>🤝 Samarbeidsmekanismer på EU-nivå</h4>
            <p>
              NIS2 styrker sikkerheten i forsyningskjeden for viktige informasjons- og kommunikasjonsteknologier:
            </p>
            <ul>
              <li>Tettere samarbeid med Kommisjonen og ENISA for koordinerte risikovurderinger</li>
              <li>Forbedret NIS-samarbeidsgruppens rolle i strategiske politiske beslutninger</li>
              <li>CSIRT-nettverket videreføres</li>
              <li>Nytt nettverk: European cyber crisis liaison organisation network (EU-CyCLONe)</li>
              <li>Register for sårbarheter forvaltet av ENISA</li>
            </ul>
          </div>

          <div className="nis2-norway">
            <h4>🇳🇴 Norge og NIS2</h4>
            <p>
              <strong>Hovedansvarlig departement:</strong> Justis- og beredskapsdepartementet
            </p>
            <p>
              <strong>EØS-avtalen:</strong> Vedlegg XI - Elektronisk kommunikasjon, audiovisuelle tjenester og informasjonssamfunnstjenester
            </p>
            <p>
              Direktivet blir fulgt opp i EFTAs arbeidsgruppe for elektronisk kommunikasjon, audiovisuelle tjenester og informasjonssamfunnet (ECASIS).
            </p>
            <p>
              Lov om digital sikkerhet som gjennomfører gjeldende NIS-direktiv er fremmet for Stortinget. Dersom NIS2-direktivet blir en del av EØS-avtalen vil dette medføre behov for lovendringer, samt endringer i tilhørende forskrifter til loven.
            </p>
          </div>
        </div>
      </div>

      {/* NIST CSF Detailed Overview */}
      <div className="nist-detailed-section">
        <h3>🇺🇸 NIST Cybersecurity Framework - Detailed Overview</h3>
        <div className="nist-content">
          <div className="nist-intro">
            <h4>About NIST Cybersecurity Framework</h4>
            <p>
              The <strong>NIST Cybersecurity Framework (CSF)</strong> was developed by the National Institute of Standards and Technology in response to U.S. Executive Order 13636 to improve critical infrastructure cybersecurity. While originally focused on critical infrastructure, the framework has been widely adopted by organizations of all sizes and sectors globally.
            </p>
            <p>
              <strong>Version 2.0</strong> was released in February 2024, introducing significant enhancements including a new "Govern" function and expanded guidance on supply chain risk management.
            </p>
          </div>

          <div className="nist-core-functions">
            <h4>🎯 The Six Core Functions</h4>
            <p>
              NIST CSF 2.0 organizes cybersecurity activities into six core functions:
            </p>
            
            <div className="function-grid">
              <div className="function-item">
                <h5>1. Govern (NEW in 2.0)</h5>
                <p>Establish and monitor the organization's cybersecurity risk management strategy, expectations, and policy.</p>
                <ul>
                  <li>Organizational Context</li>
                  <li>Risk Management Strategy</li>
                  <li>Roles, Responsibilities, and Authorities</li>
                  <li>Policy</li>
                  <li>Oversight</li>
                  <li>Cybersecurity Supply Chain Risk Management</li>
                </ul>
              </div>

              <div className="function-item">
                <h5>2. Identify</h5>
                <p>Develop organizational understanding to manage cybersecurity risk to systems, people, assets, data, and capabilities.</p>
                <ul>
                  <li>Asset Management</li>
                  <li>Business Environment</li>
                  <li>Governance</li>
                  <li>Risk Assessment</li>
                  <li>Risk Management Strategy</li>
                  <li>Supply Chain Risk Management</li>
                </ul>
              </div>

              <div className="function-item">
                <h5>3. Protect</h5>
                <p>Develop and implement appropriate safeguards to ensure delivery of critical services.</p>
                <ul>
                  <li>Identity Management and Access Control</li>
                  <li>Awareness and Training</li>
                  <li>Data Security</li>
                  <li>Information Protection Processes</li>
                  <li>Maintenance</li>
                  <li>Protective Technology</li>
                </ul>
              </div>

              <div className="function-item">
                <h5>4. Detect</h5>
                <p>Develop and implement appropriate activities to identify the occurrence of a cybersecurity event.</p>
                <ul>
                  <li>Anomalies and Events</li>
                  <li>Security Continuous Monitoring</li>
                  <li>Detection Processes</li>
                </ul>
              </div>

              <div className="function-item">
                <h5>5. Respond</h5>
                <p>Develop and implement appropriate activities to take action regarding a detected cybersecurity incident.</p>
                <ul>
                  <li>Response Planning</li>
                  <li>Communications</li>
                  <li>Analysis</li>
                  <li>Mitigation</li>
                  <li>Improvements</li>
                </ul>
              </div>

              <div className="function-item">
                <h5>6. Recover</h5>
                <p>Develop and implement appropriate activities to maintain resilience and restore capabilities impaired by a cybersecurity incident.</p>
                <ul>
                  <li>Recovery Planning</li>
                  <li>Improvements</li>
                  <li>Communications</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="nist-tiers">
            <h4>📊 Implementation Tiers</h4>
            <p>
              The Framework defines four tiers to help organizations understand their current approach to cybersecurity risk management:
            </p>
            <div className="tiers-grid">
              <div className="tier-item">
                <h5>Tier 1: Partial</h5>
                <p>Risk management is ad hoc with limited awareness of cybersecurity risk. The organization may not have processes in place to participate in coordination or collaboration with other entities.</p>
              </div>
              <div className="tier-item">
                <h5>Tier 2: Risk Informed</h5>
                <p>Risk management practices are approved by management but may not be established as organizational policy. Coordination and collaboration with other entities is understood but the organization may not have formalized capabilities.</p>
              </div>
              <div className="tier-item">
                <h5>Tier 3: Repeatable</h5>
                <p>Risk management practices are formally approved and expressed as policy. The organization has the capabilities to participate in coordination and collaboration with other entities on a regular basis.</p>
              </div>
              <div className="tier-item">
                <h5>Tier 4: Adaptive</h5>
                <p>The organization adapts its cybersecurity practices based on previous and current activities, including lessons learned and predictive indicators. The organization actively participates in a larger ecosystem.</p>
              </div>
            </div>
          </div>

          <div className="nist-profiles">
            <h4>📋 Framework Profiles</h4>
            <p>
              Profiles are customized alignments of the Framework Core Functions, Categories, and Subcategories to an organization's business requirements, risk tolerance, and resources.
            </p>
            <ul>
              <li><strong>Current Profile:</strong> The cybersecurity outcomes currently being achieved</li>
              <li><strong>Target Profile:</strong> The desired cybersecurity outcomes</li>
              <li><strong>Profile Comparison:</strong> Identifies gaps between current and target states to create a prioritized action plan</li>
            </ul>
          </div>

          <div className="nist-whats-new">
            <h4>🆕 What's New in NIST CSF 2.0</h4>
            <ul>
              <li><strong>New "Govern" Function:</strong> Elevates governance to a standalone function emphasizing enterprise-wide cybersecurity risk management</li>
              <li><strong>Enhanced Supply Chain Guidance:</strong> Expanded categories addressing cybersecurity supply chain risk management (C-SCRM)</li>
              <li><strong>Organizational Context:</strong> New guidance on understanding organizational context including mission, stakeholder expectations, and dependencies</li>
              <li><strong>Expanded Audience:</strong> Framework explicitly addresses all organizations, not just critical infrastructure</li>
              <li><strong>Integration with Other Frameworks:</strong> Enhanced guidance on mapping to other standards (ISO 27001, CIS Controls, etc.)</li>
              <li><strong>Cybersecurity Metrics:</strong> New guidance on measuring and demonstrating cybersecurity program effectiveness</li>
            </ul>
          </div>

          <div className="nist-adoption">
            <h4>🌍 Global Adoption</h4>
            <p>
              The NIST Cybersecurity Framework has achieved remarkable global adoption:
            </p>
            <ul>
              <li><strong>United States:</strong> Widely referenced in government contracts, regulatory guidance, and industry standards</li>
              <li><strong>International:</strong> Adopted by organizations in over 50 countries as a voluntary framework</li>
              <li><strong>Sectors:</strong> Used across critical infrastructure, financial services, healthcare, manufacturing, and technology sectors</li>
              <li><strong>Regulatory Recognition:</strong> Referenced in various regulatory frameworks and guidelines (e.g., FFIEC, HIPAA guidance)</li>
              <li><strong>Contracts and RFPs:</strong> Increasingly required or referenced in vendor contracts and procurement processes</li>
            </ul>
          </div>

          <div className="nist-integration">
            <h4>🔗 Integration with Other Frameworks</h4>
            <p>
              NIST CSF is designed to complement existing frameworks and standards:
            </p>
            <div className="integration-grid">
              <div className="integration-item">
                <h5>ISO/IEC 27001</h5>
                <p>NIST provides mapping to ISO 27001 controls for organizations seeking certification</p>
              </div>
              <div className="integration-item">
                <h5>CIS Controls</h5>
                <p>CIS Critical Security Controls can be mapped to NIST CSF categories for implementation</p>
              </div>
              <div className="integration-item">
                <h5>COBIT</h5>
                <p>COBIT governance framework aligns with NIST's Govern function</p>
              </div>
              <div className="integration-item">
                <h5>NIST SP 800-53</h5>
                <p>Detailed security controls in SP 800-53 can be mapped to CSF subcategories</p>
              </div>
            </div>
          </div>

          <div className="nist-implementation">
            <h4>💼 Implementation Best Practices</h4>
            <ol>
              <li><strong>Establish Scope:</strong> Define which systems, assets, and business processes will be covered</li>
              <li><strong>Orient:</strong> Identify related systems and assets, regulatory requirements, and risk approach</li>
              <li><strong>Create Current Profile:</strong> Document current cybersecurity posture using Framework categories</li>
              <li><strong>Conduct Risk Assessment:</strong> Analyze operational environment to identify likelihood and impact of cybersecurity events</li>
              <li><strong>Create Target Profile:</strong> Based on business needs and risk appetite, define desired cybersecurity outcomes</li>
              <li><strong>Determine, Analyze, and Prioritize Gaps:</strong> Compare Current and Target profiles to create prioritized roadmap</li>
              <li><strong>Implement Action Plan:</strong> Execute initiatives to address gaps and achieve Target Profile</li>
              <li><strong>Monitor and Improve:</strong> Continuously assess implementation and adjust based on lessons learned</li>
            </ol>
          </div>
        </div>
      </div>

      {/* DORA Detailed Overview */}
      <div className="dora-detailed-section">
        <h3>🇪🇺 DORA - Digital Operasjonell Motstandskraft - Detaljert Oversikt</h3>
        <div className="dora-content">
          <div className="dora-intro">
            <h4>Hva er DORA?</h4>
            <p>
              <strong>Digital Operational Resilience Act (DORA)</strong> kalles i Norge for forordningen om digital operasjonell motstandskraft. DORA er en EU-forordning (Regulation (EU) 2022/2554) som inneholder felleseuropeiske regler som definerer og harmoniserer detaljerte krav til finansinstitusjoners håndtering og vurdering av IKT-risiko.
            </p>
            <p>
              Forordningen har som mål å <strong>styrke finansnæringens operasjonelle digitale motstandskraft</strong> og sikre at finanssektoren kan motstå, reagere på og gjenopprette seg fra alle typer IKT-relaterte forstyrrelser og trusler.
            </p>
          </div>

          <div className="dora-dates">
            <h4>📅 Når trer DORA i kraft?</h4>
            <ul>
              <li><strong>Vedtatt:</strong> 14. desember 2022</li>
              <li><strong>Ikrafttredelse i EU:</strong> 17. januar 2025</li>
              <li><strong>Ikrafttredelse i Norge:</strong> 1. juli 2025</li>
            </ul>
            <p className="dora-highlight">
              DORA er her! Finansinstitusjoner må etterleve kravene nå.
            </p>
          </div>

          <div className="dora-scope">
            <h4>🏢 Hvem omfattes av DORA?</h4>
            <p>
              Et bredt spekter av finansielle foretak omfattes av DORA:
            </p>
            <ul>
              <li>Banker og kredittinstitusjoner</li>
              <li>Forsikringsforetak (Solvens II)</li>
              <li>Verdipapirforetak</li>
              <li>Betalingstjenesteforetak</li>
              <li>E-pengeforetak</li>
              <li>Forvaltningsselskaper</li>
              <li>Kryptovaluta-tjenester</li>
              <li>Finansieringsforetak</li>
              <li>Låneformidlingsforetak</li>
              <li>Inkassoforetak</li>
              <li>Eiendomsmeglingsforetak</li>
              <li>Morselskap i finanskonsern</li>
            </ul>
            <p>
              <strong>Viktig:</strong> DORA gjelder også for <strong>leverandører av IKT-tjenester</strong> til finanssektoren. Kritiske IKT-tredjepartsleverandører vil bli direkte regulert og overvåket.
            </p>
          </div>

          <div className="dora-pillars">
            <h4>🎯 De Fem Hovedområdene i DORA</h4>
            
            <div className="pillar-grid">
              <div className="pillar-item">
                <h5>1. IKT Risikostyring</h5>
                <p>Omfattende krav til styring og kontroll av IKT-risiko:</p>
                <ul>
                  <li>Ledelsen må ha kompetanse og ta ansvar</li>
                  <li>Risikovurderinger og sikkerhetstiltak</li>
                  <li>Klare roller og ansvar</li>
                  <li>Allokering av IKT-investeringer</li>
                  <li>Regelmessig IKT-trening for ledelsen</li>
                </ul>
              </div>

              <div className="pillar-item">
                <h5>2. Hendelsesrapportering</h5>
                <p>Krav til rapportering av IKT-hendelser:</p>
                <ul>
                  <li>Klassifisering av hendelser</li>
                  <li>Rapportering til tilsynsmyndigheter</li>
                  <li>Tidskrav for varsling</li>
                  <li>Dokumentasjon av hendelsesforløp</li>
                  <li>Læring og forbedring</li>
                </ul>
              </div>

              <div className="pillar-item">
                <h5>3. Testing av Motstandsdyktighet</h5>
                <p>Regelmessig testing av digital operasjonell motstandskraft:</p>
                <ul>
                  <li>Sårbarhetstesting</li>
                  <li>Penetrasjonstesting</li>
                  <li>Red team testing (for store aktører)</li>
                  <li>Testing av gjenopprettingsplaner</li>
                  <li>Evaluering av resultater</li>
                </ul>
              </div>

              <div className="pillar-item">
                <h5>4. Risikostyring av IKT-tredjeparter</h5>
                <p>Styring av risiko knyttet til IKT-leverandører:</p>
                <ul>
                  <li>Due diligence av leverandører</li>
                  <li>Kontraktskrav og SLA-er</li>
                  <li>Kontinuerlig overvåking</li>
                  <li>Exitstrategier</li>
                  <li>Register over kritiske leverandører</li>
                </ul>
              </div>

              <div className="pillar-item">
                <h5>5. Informasjonsdeling</h5>
                <p>Deling av trusselinformasjon og cybersikkerhetsintelligens:</p>
                <ul>
                  <li>Deltakelse i informasjonshuber (f.eks. Nordisk FinansCert)</li>
                  <li>Deling av hendelser og trusler</li>
                  <li>Samarbeid med andre finansinstitusjoner</li>
                  <li>Læring på markedsnivå</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="dora-governance">
            <h4>👔 Ansvaret ligger hos ledelsen</h4>
            <p>
              DORA plasserer ansvaret for arbeidet med IKT-sikkerhet hos selskapets ledelse på en tydelig måte:
            </p>
            <ul>
              <li>Ledelsen må ha <strong>oppmerksomhet og kompetanse</strong> på IKT-risiko</li>
              <li>Ledelsen må <strong>definere, godkjenne og kontrollere</strong> alle tiltak som påvirker IKT-risiko</li>
              <li>Ledelsen må <strong>sette risikotoleransen</strong> for IKT-risiko</li>
              <li>Ledelsen må <strong>godkjenne og evaluere prosesser</strong> for:
                <ul>
                  <li>Kontinuitet i virksomheten</li>
                  <li>Gjenopprettelser etter kriser</li>
                  <li>IKT revisjon</li>
                  <li>IKT tredjepartsrisikohåndtering</li>
                </ul>
              </li>
              <li>Ledelsen må gjennomgå <strong>regelmessig IKT-trening</strong></li>
            </ul>
          </div>

          <div className="dora-third-party">
            <h4>🔗 Tredjepartsleverandører og Kritisk IKT</h4>
            <p>
              DORA innfører særskilte krav til håndtering av IKT-tredjepartsleverandører:
            </p>
            <div className="third-party-info">
              <div className="third-party-item">
                <h5>Harmoniserte kontraktskrav</h5>
                <p>Detaljerte grunnleggende regler for kontraktsinngåelse og serviceavtaler med IKT-leverandører</p>
              </div>
              <div className="third-party-item">
                <h5>Register over leverandører</h5>
                <p>Finansinstitusjoner må føre register over alle IKT-tredjepartsleverandører og identifisere kritiske leverandører</p>
              </div>
              <div className="third-party-item">
                <h5>Due diligence</h5>
                <p>Systematisk vurdering av faktisk IKT-risiko forbundet med leveranse fra tredjeparter</p>
              </div>
              <div className="third-party-item">
                <h5>Exit-strategier</h5>
                <p>Planer for å avslutte kontrakter og migrere tjenester ved behov</p>
              </div>
            </div>
          </div>

          <div className="dora-oversight">
            <h4>👁️ Klassifisering av Kritiske IKT-leverandører</h4>
            <p>
              Klassifiseringen av hvem som er kritiske IKT-leverandører vil gjøres av <strong>European Securities and Markets Authority (ESMA)</strong>, sammen med EBA og EIOPA. En liste over hvem som omfattes vil publiseres årlig.
            </p>
            <p>
              Forordningen fastsetter kriterier for å bli klassifisert som "kritisk IKT-leverandør":
            </p>
            <ul>
              <li>Antall viktige finansinstitusjoner som er avhengig av leverandøren</li>
              <li>Systemviktigheten av finansinstitusjonene som bruker tjenesten</li>
              <li>Konsekvensene av driftsavbrudd eller feil</li>
              <li>Tjenesteleverandørens erstattbarhet</li>
            </ul>
            <p>
              <strong>Kritiske IKT-leverandører</strong> kan få tilsyn én måned etter klassifisering eller tidligere. Tjenesteleverandører som ikke havner på listen kan søke om å bli klassifisert som "kritisk" for å vise cybersikkerhetsmodenhet.
            </p>
          </div>

          <div className="dora-penalties">
            <h4>⚖️ Konsekvenser og Sanksjoner</h4>
            <div className="penalties-info">
              <div className="penalty-item">
                <h5>Finansielle sanksjoner</h5>
                <ul>
                  <li>Bøter opptil <strong>€10,000,000</strong> eller <strong>5% av total årlig omsetning</strong> for finansinstitusjoner</li>
                  <li>I Norge: Brudd kan gi bøter opptil <strong>50 millioner kroner</strong></li>
                </ul>
              </div>
              <div className="penalty-item">
                <h5>Tilsyn av kritiske leverandører</h5>
                <ul>
                  <li>Direkte tilsyn av kritiske IKT-tredjepartsleverandører</li>
                  <li>Inspeksjoner og revisjoner</li>
                  <li>Krav om utbedringer</li>
                </ul>
              </div>
              <div className="penalty-item">
                <h5>Omdømmetap</h5>
                <ul>
                  <li>Offentliggjøring av brudd</li>
                  <li>Tap av kundetillit</li>
                  <li>Konkurranseulemper</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="dora-preparation">
            <h4>🚀 Hvordan forberede seg til DORA</h4>
            
            <div className="preparation-steps">
              <div className="prep-step">
                <h5>Fase 1: Forstå kravene</h5>
                <ul>
                  <li>Workshops og kompetanseheving</li>
                  <li>Konsekvensanalyse for din organisasjon</li>
                  <li>Identifisere gap mellom nåsituasjon og krav</li>
                </ul>
              </div>

              <div className="prep-step">
                <h5>Fase 2: Gjennomfør gap-analyse</h5>
                <ul>
                  <li>Modenhetsanalyse basert på DORA-krav</li>
                  <li>Nedenfra-og-opp vurdering via intervjuer</li>
                  <li>Ovenfra-og-ned strategisk planlegging</li>
                  <li>Dokumentbasert analyse</li>
                </ul>
              </div>

              <div className="prep-step">
                <h5>Fase 3: Lag veikart</h5>
                <ul>
                  <li>Prioriter tiltak og anbefalinger</li>
                  <li>Utvikle DORA-rammeverk tilpasset formålet</li>
                  <li>Vurder optimalisering av prosesser</li>
                  <li>Ressursplanlegging</li>
                </ul>
              </div>

              <div className="prep-step">
                <h5>Fase 4: Implementer</h5>
                <ul>
                  <li>Strategisk til operasjonell konseptualisering</li>
                  <li>Teknisk realisering</li>
                  <li>Interne verktøy og løsninger</li>
                  <li>Opplæring av ansatte</li>
                </ul>
              </div>

              <div className="prep-step">
                <h5>Fase 5: Test og forbedre</h5>
                <ul>
                  <li>Testing av motstandsdyktighet</li>
                  <li>Kontinuerlig overvåking</li>
                  <li>Læring og forbedring</li>
                  <li>Rapportering til ledelsen</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="dora-methodology">
            <h4>📊 Metodikk for Modenhetsanalyse</h4>
            <div className="methodology-phases">
              <div className="method-phase">
                <h5>Fase 1: Oppstart</h5>
                <p>Avtaler, planlegging og tidslinje. Diskusjon rundt eksterne, interne og regulatoriske krav.</p>
              </div>
              <div className="method-phase">
                <h5>Fase 2: Datainnsamling</h5>
                <p>Guidede intervjuer med nøkkelpersoner og innsamling av relevant dokumentasjon.</p>
              </div>
              <div className="method-phase">
                <h5>Fase 3: Analyse</h5>
                <p>Vurdering av modenhet på tvers av de fem DORA-områdene og identifisering av gap.</p>
              </div>
              <div className="method-phase">
                <h5>Fase 4: Forankring</h5>
                <p>Presentasjon av funn, anbefalinger og veikart for ledelsen.</p>
              </div>
            </div>
          </div>

          <div className="dora-benefits">
            <h4>✨ Fordeler med DORA-compliance</h4>
            <ul>
              <li><strong>Økt motstandsdyktighet:</strong> Bedre rustet mot cyberangrep og IKT-hendelser</li>
              <li><strong>Redusert risiko:</strong> Systematisk håndtering av IKT-risiko reduserer sannsynlighet og konsekvens av hendelser</li>
              <li><strong>Bedre styring:</strong> Klarere roller, ansvar og beslutningstaking</li>
              <li><strong>Konkurransefortrinn:</strong> DORA-compliance som kvalitetsstempel i markedet</li>
              <li><strong>Harmonisering:</strong> Felles standarder på tvers av EU/EØS forenkler grensekryssende virksomhet</li>
              <li><strong>Tillit:</strong> Økt tillit fra kunder, investorer og regulatorer</li>
            </ul>
          </div>

          <div className="dora-resources-norway">
            <h4>🇳🇴 Norske Ressurser</h4>
            <ul>
              <li><strong>Finanstilsynet:</strong> Fører tilsyn med DORA-etterlevelse i Norge</li>
              <li><strong>Finans Norge:</strong> Bransjeforening med informasjon og veiledning om DORA</li>
              <li><strong>Nordisk FinansCERT:</strong> Informasjonshub for deling av cybertrusler</li>
              <li><strong>Finansdepartementet:</strong> Ansvarlig for implementering av DORA i norsk lov</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Compliance Trends */}
      <div className="compliance-trends">
        <h3>📈 Key Compliance Trends in {selectedYear}</h3>
        <div className="trends-grid">
          <div className="trend-card">
            <h4>🚀 Accelerated Disclosure</h4>
            <p>
              Regulations like SEC rules and NIS2 compressed disclosure timelines to 24-72 hours. 
              Organizations invested heavily in incident classification and materiality assessment 
              frameworks to meet these aggressive deadlines.
            </p>
          </div>
          <div className="trend-card">
            <h4>👔 Board-Level Accountability</h4>
            <p>
              Cyber risk became a board-level issue. Directors faced personal liability for inadequate 
              oversight, driving demand for better reporting, third-party audits, and cyber insurance.
            </p>
          </div>
          <div className="trend-card">
            <h4>🔗 Supply Chain Focus</h4>
            <p>
              NIS2 and other frameworks extended requirements to supply chains. Organizations began 
              auditing vendors, requiring security certifications, and building supply chain risk 
              management programs.
            </p>
          </div>
          <div className="trend-card">
            <h4>💰 Rising Penalties</h4>
            <p>
              Enforcement intensified across all frameworks. Multi-million dollar fines for GDPR violations, 
              SEC investigations for inadequate disclosure, and NIS2 penalties up to €10M or 2% of revenue 
              created strong financial incentives for compliance.
            </p>
          </div>
        </div>
      </div>

      {/* Global Compliance Challenges */}
      <div className="compliance-challenges">
        <h3>⚠️ Cross-Border Compliance Challenges</h3>
        <div className="challenges-content">
          <p>
            Operating globally means navigating conflicting requirements:
          </p>
          <ul>
            <li>
              <strong>Data Localization:</strong> China and Russia require local storage, conflicting 
              with cloud-first strategies
            </li>
            <li>
              <strong>Disclosure Timing:</strong> Different timelines (24h for NIS2, 72h for GDPR, 4 days for SEC) 
              create operational complexity
            </li>
            <li>
              <strong>Extraterritorial Reach:</strong> GDPR applies globally to EU data subjects, creating 
              compliance obligations far beyond Europe
            </li>
            <li>
              <strong>Technology Transfer Restrictions:</strong> US export controls and Chinese cybersecurity 
              reviews limit cross-border technology sharing
            </li>
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div className="compliance-recommendations">
        <h3>💡 Strategic Compliance Recommendations</h3>
        <div className="recommendations-grid">
          <div className="recommendation-item">
            <h4>1. Build Compliance-Aware Incident Response</h4>
            <p>
              Integrate regulatory timelines into IR playbooks. Automate incident classification 
              for materiality assessments. Maintain pre-drafted disclosure templates.
            </p>
          </div>
          <div className="recommendation-item">
            <h4>2. Establish Board Reporting Cadence</h4>
            <p>
              Quarterly cyber risk reports with KPIs, threat intelligence summaries, and compliance 
              status. Train board members on cyber fundamentals.
            </p>
          </div>
          <div className="recommendation-item">
            <h4>3. Implement Supply Chain Risk Management</h4>
            <p>
              Vendor security questionnaires, contractual security requirements, continuous monitoring 
              of third-party risks, and incident response coordination with suppliers.
            </p>
          </div>
          <div className="recommendation-item">
            <h4>4. Engage Legal and Compliance Early</h4>
            <p>
              Cyber incidents have legal implications. Build cross-functional incident response teams 
              including legal, compliance, communications, and technical staff.
            </p>
          </div>
        </div>
      </div>
      </>
      )}
    </section>
  )
}

export default RegulationImpact
