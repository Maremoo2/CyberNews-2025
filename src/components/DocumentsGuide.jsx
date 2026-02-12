import { useState } from 'react';
import './DocumentsGuide.css';

function DocumentsGuide() {
  const [isOpen, setIsOpen] = useState(false);

  const documentSections = [
    {
      id: 'nis2',
      title: 'NIS2 Directive',
      icon: '🇪🇺',
      description: 'EU Directive on cybersecurity measures across the Union',
      color: '#3498db',
      documents: [
        {
          title: 'NIS2 Directive PDF',
          url: '/documents/nis2/Nis2.pdf',
          size: '1.3 MB',
          description: 'Main directive document'
        },
        {
          title: 'NIS2 Directive - EU Briefing',
          url: '/documents/nis2/Nis2 directive eu breifing.pdf',
          size: '849 KB',
          description: 'EU briefing on the NIS2 directive'
        }
      ],
      resources: [
        {
          title: 'Official EU Legal Text',
          url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:52020PC0823'
        },
        {
          title: 'Norwegian Government EEA Note',
          url: 'https://www.regjeringen.no/no/sub/eos-notatbasen/notatene/2021/feb/nis2-direktivet/id2846097/'
        }
      ]
    },
    {
      id: 'dora',
      title: 'DORA',
      icon: '🇪🇺',
      description: 'Digital Operational Resilience Act for financial sector',
      color: '#e67e22',
      documents: [
        {
          title: 'DORA Regulation PDF',
          url: '/documents/dora/DORA.pdf',
          size: '1.5 MB',
          description: 'Main regulation document'
        },
        {
          title: 'DORA - Norsk Lovtidend',
          url: '/documents/dora/DORA Norsk lovtidend.pdf',
          size: '119 KB',
          description: 'Norwegian legal gazette version'
        }
      ],
      resources: [
        {
          title: 'Official EU Legal Text',
          url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32022R2554'
        },
        {
          title: 'Finans Norge - DORA Information',
          url: 'https://www.finansnorge.no/tema/digitalisering/eus-digitale-agenda/forordningen-om-digital-operasjonell-motstandskraft---dora/'
        },
        {
          title: 'PwC Norway - DORA Guide',
          url: 'https://www.pwc.no/no/innsikt/dora-alt-du-trenger-a-vite.html'
        }
      ]
    },
    {
      id: 'nist',
      title: 'NIST CSF',
      icon: '🇺🇸',
      description: 'NIST Cybersecurity Framework for risk management',
      color: '#16a085',
      documents: [],
      resources: [
        {
          title: 'Official NIST Cybersecurity Framework',
          url: 'https://www.nist.gov/cyberframework'
        },
        {
          title: 'NIST CSF Documentation',
          url: 'https://csrc.nist.gov/projects/cybersecurity-framework'
        },
        {
          title: 'NIST Publications',
          url: 'https://csrc.nist.gov/publications'
        }
      ]
    },
    {
      id: 'nsm',
      title: 'NSM Risiko',
      icon: '🇳🇴',
      description: 'Norwegian National Security Authority risk assessments',
      color: '#9b59b6',
      documents: [
        {
          title: 'NSM Risiko 2026',
          url: '/context/nsm-risk/Risiko 2026.pdf',
          size: 'Various',
          description: 'Latest risk assessment'
        },
        {
          title: 'NSM Risiko 2025',
          url: '/context/nsm-risk/Risiko 2025.pdf',
          size: 'Various',
          description: '2025 risk assessment'
        },
        {
          title: 'NSM Risiko 2024',
          url: '/context/nsm-risk/Risiko 2024.pdf',
          size: 'Various',
          description: '2024 risk assessment'
        }
      ],
      resources: [
        {
          title: 'NSM - National Security Authority',
          url: 'https://nsm.no/'
        },
        {
          title: 'NSM Grunnprinsipper for IKT-sikkerhet',
          url: 'https://nsm.no/regelverk-og-hjelp/rad-og-anbefalinger/grunnprinsipper-for-ikt-sikkerhet-2-0/'
        }
      ]
    }
  ];

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating button */}
      <button 
        className={`documents-guide-button ${isOpen ? 'active' : ''}`}
        onClick={togglePanel}
        aria-label="Open documents and guides"
        title="Dokumenter & Veiledere"
      >
        <span className="button-icon">📚</span>
        <span className="button-text">Dokumenter</span>
      </button>

      {/* Slide-in panel */}
      <div className={`documents-guide-panel ${isOpen ? 'open' : ''}`}>
        <div className="panel-header">
          <h2>📚 Dokumenter & Veiledere</h2>
          <button 
            className="close-button" 
            onClick={togglePanel}
            aria-label="Close panel"
          >
            ✕
          </button>
        </div>

        <div className="panel-content">
          <p className="panel-intro">
            Tilgang til viktige reguleringer og veiledere innen cybersikkerhet. 
            Her finner du offisielle dokumenter og nyttige ressurser.
          </p>

          {documentSections.map(section => (
            <div key={section.id} className="doc-section" style={{ borderLeftColor: section.color }}>
              <div className="doc-section-header">
                <span className="doc-icon">{section.icon}</span>
                <div>
                  <h3>{section.title}</h3>
                  <p className="doc-description">{section.description}</p>
                </div>
              </div>

              {section.documents.length > 0 && (
                <div className="doc-list">
                  <h4>📄 Dokumenter</h4>
                  {section.documents.map((doc, idx) => (
                    <a 
                      key={idx}
                      href={doc.url} 
                      className="doc-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="doc-info">
                        <span className="doc-title">{doc.title}</span>
                        <span className="doc-meta">{doc.description} • {doc.size}</span>
                      </div>
                      <span className="doc-arrow">→</span>
                    </a>
                  ))}
                </div>
              )}

              {section.resources.length > 0 && (
                <div className="resource-list">
                  <h4>🔗 Nyttige lenker</h4>
                  {section.resources.map((resource, idx) => (
                    <a 
                      key={idx}
                      href={resource.url} 
                      className="resource-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>{resource.title}</span>
                      <span className="external-icon">↗</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="panel-footer">
            <p>
              💡 <strong>Tips:</strong> Klikk på dokumentlenker for å åpne PDF-filer direkte i nettleseren. 
              Eksterne lenker åpnes i ny fane.
            </p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && <div className="documents-guide-overlay" onClick={togglePanel} />}
    </>
  );
}

export default DocumentsGuide;
