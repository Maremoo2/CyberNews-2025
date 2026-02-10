import './NSMRiskAnalysis.css';

function NSMRiskAnalysis({ selectedYear }) {
  const yearChanges = {
    2020: "Pandemi tvang frem digital transformasjon → fokus på hjemmekontor og VPN-sikkerhet",
    2021: "Ransomware blir industri → fokus skifter fra teknikk til organisasjon",
    2022: "Ukraina-krigen endrer alt → hybridkrigsføring blir realitet",
    2023: "Leverandører blir angrepsflate, ikke bare risiko",
    2024: "Fysisk-digital samspill blir tydelig → kritisk infrastruktur i fokus",
    2025: "Tillitssvekkelse som våpen → psyops viktigere enn tekniske angrep",
    2026: "Beredskap og styring vurderes som svakere enn tekniske kontroller"
  };

  const recurringThemes = [
    {
      icon: "🔑",
      title: "Identitet og tilgang",
      description: "Mennesker og organisasjoner er svakere enn systemer. Fra VPN-sikkerhet til leverandørstyring."
    },
    {
      icon: "🔗",
      title: "Leverandør- og avhengighetsrisiko",
      description: "Systematisk økning fra 2021. I 2026: nasjonal sikkerhetsrisiko, ikke bare teknisk problem."
    },
    {
      icon: "🎭",
      title: "Informasjonspåvirkning og tillit",
      description: "Fra 2022: tydelig strategi. I 2026: AI-drevet desinformasjon og tillitssvekkelse som våpen."
    },
    {
      icon: "⚠️",
      title: "Beredskap, øvelse og beslutningsevne",
      description: "Manglende planverk og øvelser er større trussel enn tekniske angrep."
    },
    {
      icon: "🤖",
      title: "Teknologi utvikler seg raskere enn styring",
      description: "AI, LLM og automatisering utfordrer tradisjonell sikkerhetsstyring."
    }
  ];

  const actionableItems = [
    {
      title: "Øvelser før verktøy",
      description: "Mindre fokus på 'flere verktøy', mer på roller, ansvar og systematiske øvelser"
    },
    {
      title: "Leverandørstyring først",
      description: "Kartlegg og kontroller leverandører før nye digitale initiativ"
    },
    {
      title: "Forbered deg på det uklare",
      description: "Tren på hendelser som er uklare og tvetydige, ikke bare 'klassiske angrep'"
    },
    {
      title: "Styrk kritisk tenkning",
      description: "Bygg organisatorisk motstandskraft mot manipulasjon og desinformasjon"
    }
  ];

  return (
    <section id="nsm-risk" className="nsm-risk-analysis">
      <div className="section-container">
        <h2 className="section-title">🇳🇴 NSM Risikoanalyse 2020–{selectedYear}</h2>
        
        {/* Block 1: Executive Summary */}
        <div className="nsm-executive-summary">
          <h3>NSM Risikoanalyse 2020–{selectedYear} – Kort fortalt</h3>
          <p className="summary-text">
            Trusselbildet har beveget seg fra tekniske sårbarheter og opportunistiske angrep, 
            til systematisk undergraving av tillit, leverandøravhengighet og beredskap. 
            Der tidlige år handlet om ransomware og digital hygiene, peker de siste rapportene 
            tydelig på styring, samhandling og beslutningsevne som den største svakheten. 
            Geopolitiske endringer, særlig Ukraina-krigen i 2022, transformerte trusselbildet 
            fra cyberkriminalitet til statssponsorert hybridkrigsføring. I {selectedYear} er 
            fokuset på AI-drevne trusler og systematisk tillitssvekkelse som dominerende 
            utfordringer for nasjonal sikkerhet.
          </p>
        </div>

        {/* Block 2: Development over time */}
        <div className="nsm-timeline-section">
          <h3>Utvikling over tid – Det som endret seg</h3>
          <div className="nsm-timeline">
            {Object.entries(yearChanges)
              .filter(([year]) => parseInt(year) <= selectedYear)
              .map(([year, change]) => (
                <div key={year} className={`timeline-item ${year == selectedYear ? 'current' : ''}`}>
                  <div className="year-badge">{year}</div>
                  <p className="change-description">{change}</p>
                </div>
              ))}
          </div>
        </div>

        {/* Block 3: Key recurring findings */}
        <div className="nsm-recurring-themes">
          <h3>Viktigste gjennomgående funn</h3>
          <p className="section-intro">
            Disse temaene går igjen på tvers av alle årene, og er det ledere, 
            kommuner og CISOs faktisk bryr seg om:
          </p>
          <div className="themes-grid">
            {recurringThemes.map((theme, index) => (
              <div key={index} className="theme-card">
                <div className="theme-icon">{theme.icon}</div>
                <h4>{theme.title}</h4>
                <p>{theme.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Block 4: Actionable focus areas */}
        <div className="nsm-action-items">
          <h3>Hva bør man faktisk fokusere på nå?</h3>
          <p className="section-intro">
            Basert på NSMs vurderinger og observerte hendelser i {selectedYear} bør 
            organisasjoner prioritere:
          </p>
          <div className="action-list">
            {actionableItems.map((item, index) => (
              <div key={index} className="action-item">
                <div className="action-number">{index + 1}</div>
                <div className="action-content">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison: What changed */}
        <div className="nsm-comparison">
          <h3>Hva har endret seg?</h3>
          <div className="comparison-grid">
            <div className="comparison-item before">
              <h4>Før (2020-2021)</h4>
              <ul>
                <li>Teknisk sikkerhet</li>
                <li>Ransomware og cyberkriminalitet</li>
                <li>Isolerte hendelser</li>
                <li>Patching og backup</li>
              </ul>
            </div>
            <div className="comparison-arrow">→</div>
            <div className="comparison-item now">
              <h4>Nå (2024-{selectedYear})</h4>
              <ul>
                <li>Samfunnsfunksjoner og tillit</li>
                <li>Statssponsorert hybridkrigsføring</li>
                <li>Kontinuerlig press og påvirkning</li>
                <li>Beredskap, styring og beslutninger</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Cross-links to other sections */}
        <div className="nsm-crosslinks">
          <h3>Se også</h3>
          <div className="crosslinks-grid">
            <a href="#themes" className="crosslink-card">
              <span className="crosslink-icon">🛡️</span>
              <div className="crosslink-content">
                <h4>Strategic Risk Themes</h4>
                <p>Hvordan temaene fra NSM vises i faktiske hendelser</p>
              </div>
            </a>
            <a href="#defense" className="crosslink-card">
              <span className="crosslink-icon">🛡️</span>
              <div className="crosslink-content">
                <h4>Defense Analysis</h4>
                <p>Tekniske tiltak og forsvarsteknikker</p>
              </div>
            </a>
            <a href="#regulation" className="crosslink-card">
              <span className="crosslink-icon">⚖️</span>
              <div className="crosslink-content">
                <h4>Regulation Impact</h4>
                <p>Hvordan regelverk påvirker sikkerhetspraksis</p>
              </div>
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className="nsm-cta">
          <p>
            <strong>📚 Les mer:</strong>{' '}
            <a 
              href="https://nsm.no/regelverk-og-hjelp/rad-og-anbefalinger/grunnprinsipper-for-ikt-sikkerhet-2-0/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              NSMs Grunnprinsipper for IKT-sikkerhet
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default NSMRiskAnalysis;
