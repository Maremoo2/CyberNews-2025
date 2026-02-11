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
          title: 'NIS2 Directive - Norwegian PDF', 
          url: '/documents/nis2/NIS2-direktiv-norsk.pdf',
          type: 'pdf',
          note: 'To be uploaded'
        },
        { 
          title: 'NIS2 Directive - English PDF', 
          url: '/documents/nis2/NIS2-directive-english.pdf',
          type: 'pdf',
          note: 'To be uploaded'
        }
      ],
      color: '#3498db',
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
