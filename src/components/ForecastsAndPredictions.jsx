import { useMemo } from 'react'
import './ForecastsAndPredictions.css'

function ForecastsAndPredictions({ incidents, selectedYear }) {
  const forecasts = useMemo(() => {
    if (!incidents || incidents.length === 0) return null

    // Analyze trends from incidents to make data-driven predictions
    const trendAnalysis = {
      ransomware: incidents.filter(i => 
        `${i.title} ${i.summary} ${i.tags?.join(' ')}`.toLowerCase().includes('ransomware')
      ).length,
      supply_chain: incidents.filter(i => 
        `${i.title} ${i.summary} ${i.tags?.join(' ')}`.toLowerCase().includes('supply-chain') ||
        `${i.title} ${i.summary}`.toLowerCase().includes('supply chain')
      ).length,
      cloud: incidents.filter(i => 
        `${i.title} ${i.summary} ${i.tags?.join(' ')}`.toLowerCase().includes('cloud') ||
        `${i.title} ${i.summary}`.toLowerCase().includes('aws') ||
        `${i.title} ${i.summary}`.toLowerCase().includes('azure')
      ).length,
      ai_related: incidents.filter(i => 
        `${i.title} ${i.summary} ${i.tags?.join(' ')}`.toLowerCase().includes('ai') ||
        `${i.title} ${i.summary}`.toLowerCase().includes('deepfake') ||
        `${i.title} ${i.summary}`.toLowerCase().includes('artificial intelligence')
      ).length
    }

    return trendAnalysis
  }, [incidents])

  const nextYear = selectedYear + 1

  return (
    <section className="forecasts" aria-label="Forecasts and Predictions">
      <div className="forecasts-header">
        <h2>🔮 Looking Ahead: Predictions for {nextYear}</h2>
        <p className="forecasts-subtitle">
          Data-driven forecasts based on {selectedYear} trends and emerging threat patterns
        </p>
      </div>

      <div className="forecast-intro">
        <p>
          Predicting cybersecurity trends is challenging, but analyzing patterns from {selectedYear} 
          provides insights into likely developments. These forecasts combine observed trends with 
          threat intelligence to help organizations prepare for emerging risks.
        </p>
        <p className="forecast-note">
          <strong>Note:</strong> Prediction inputs are based on <strong>media coverage volume</strong> (article counts), 
          not confirmed unique incidents. Trends reflect what security topics dominated public discourse.
        </p>
      </div>

      {/* Top Predictions */}
      <div className="predictions-grid">
        <div className="prediction-card high-confidence">
          <div className="prediction-header">
            <span className="prediction-number">1</span>
            <span className="confidence-badge high">High Confidence</span>
          </div>
          <h3>🤖 AI-Powered Attacks Become Mainstream</h3>
          <div className="prediction-content">
            <p className="prediction-why">
              <strong>Why:</strong> AI tools are increasingly accessible, and we observed{' '}
              {forecasts?.ai_related || 'numerous'} AI-related articles covering security incidents, research, and policy in {selectedYear}. 
              Attackers will leverage AI for more convincing phishing, automated vulnerability discovery, 
              and evasion of traditional defenses.
            </p>
            <p className="prediction-what">
              <strong>What to Expect:</strong>
            </p>
            <ul>
              <li>AI-generated phishing emails indistinguishable from legitimate communication</li>
              <li>Deepfake voice/video for CEO fraud and social engineering</li>
              <li>Automated reconnaissance and vulnerability scanning at scale</li>
              <li>AI-powered password cracking and credential stuffing</li>
            </ul>
            <p className="prediction-action">
              <strong>Action:</strong> Invest in AI-powered detection, zero-trust authentication, 
              and employee training on AI-enabled social engineering.
            </p>
          </div>
        </div>

        <div className="prediction-card high-confidence">
          <div className="prediction-header">
            <span className="prediction-number">2</span>
            <span className="confidence-badge high">High Confidence</span>
          </div>
          <h3>☁️ Cloud Security Incidents Continue to Rise</h3>
          <div className="prediction-content">
            <p className="prediction-why">
              <strong>Why:</strong> With {forecasts?.cloud || 'many'} cloud-related articles in {selectedYear}, 
              and continued cloud adoption, misconfigurations and identity issues will persist as major 
              attack vectors.
            </p>
            <p className="prediction-what">
              <strong>What to Expect:</strong>
            </p>
            <ul>
              <li>Increased exploitation of misconfigured cloud storage and databases</li>
              <li>IAM vulnerabilities leading to unauthorized access</li>
              <li>Cross-tenant attacks in multi-tenant environments</li>
              <li>Serverless and container security challenges</li>
            </ul>
            <p className="prediction-action">
              <strong>Action:</strong> Implement Cloud Security Posture Management (CSPM), 
              enforce least privilege, and automate configuration compliance checks.
            </p>
          </div>
        </div>

        <div className="prediction-card medium-confidence">
          <div className="prediction-header">
            <span className="prediction-number">3</span>
            <span className="confidence-badge medium">Medium Confidence</span>
          </div>
          <h3>🔗 Supply Chain Attacks Evolve and Expand</h3>
          <div className="prediction-content">
            <p className="prediction-why">
              <strong>Why:</strong> {forecasts?.supply_chain || 'Multiple'} supply chain incidents 
              in {selectedYear} showed this remains a high-ROI attack vector. Attackers will target 
              software vendors, managed service providers, and open-source ecosystems.
            </p>
            <p className="prediction-what">
              <strong>What to Expect:</strong>
            </p>
            <ul>
              <li>Compromise of popular open-source packages and libraries</li>
              <li>MSP and cloud service provider breaches affecting multiple customers</li>
              <li>Hardware supply chain attacks on network equipment</li>
              <li>SaaS vendor compromises for downstream customer access</li>
            </ul>
            <p className="prediction-action">
              <strong>Action:</strong> Implement software bill of materials (SBOM), vendor risk 
              assessments, and continuous monitoring of third-party access.
            </p>
          </div>
        </div>

        <div className="prediction-card high-confidence">
          <div className="prediction-header">
            <span className="prediction-number">4</span>
            <span className="confidence-badge high">High Confidence</span>
          </div>
          <h3>💰 Ransomware Remains Top Threat</h3>
          <div className="prediction-content">
            <p className="prediction-why">
              <strong>Why:</strong> With {forecasts?.ransomware || 'hundreds of'} ransomware 
              incidents in {selectedYear}, this profit-driven crime shows no signs of slowing. 
              Expect more targeted attacks, faster encryption, and data exfiltration before encryption.
            </p>
            <p className="prediction-what">
              <strong>What to Expect:</strong>
            </p>
            <ul>
              <li>More targeted attacks on high-value sectors (healthcare, finance, critical infrastructure)</li>
              <li>Triple extortion: encryption + data leak + DDoS threats</li>
              <li>Faster encryption times making detection harder</li>
              <li>Ransomware-as-a-Service lowering barrier to entry</li>
            </ul>
            <p className="prediction-action">
              <strong>Action:</strong> Immutable backups, network segmentation, EDR deployment, 
              and tested incident response playbooks.
            </p>
          </div>
        </div>

        <div className="prediction-card medium-confidence">
          <div className="prediction-header">
            <span className="prediction-number">5</span>
            <span className="confidence-badge medium">Medium Confidence</span>
          </div>
          <h3>🌐 Geopolitical Cyber Warfare Intensifies</h3>
          <div className="prediction-content">
            <p className="prediction-why">
              <strong>Why:</strong> Ongoing global tensions will continue to manifest in cyberspace. 
              State-sponsored actors will target critical infrastructure, conduct espionage, 
              and support hybrid warfare operations.
            </p>
            <p className="prediction-what">
              <strong>What to Expect:</strong>
            </p>
            <ul>
              <li>Increased attacks on energy and telecommunications infrastructure</li>
              <li>Espionage campaigns targeting government and defense contractors</li>
              <li>Hacktivist groups aligned with nation-state interests</li>
              <li>Disinformation campaigns leveraging AI-generated content</li>
            </ul>
            <p className="prediction-action">
              <strong>Action:</strong> Assume breach mentality, segment OT/IT networks, 
              implement advanced threat detection, and participate in threat intelligence sharing.
            </p>
          </div>
        </div>

        <div className="prediction-card low-confidence">
          <div className="prediction-header">
            <span className="prediction-number">6</span>
            <span className="confidence-badge low">Emerging Threat</span>
          </div>
          <h3>🔐 Post-Quantum Cryptography Preparation Accelerates</h3>
          <div className="prediction-content">
            <p className="prediction-why">
              <strong>Why:</strong> As quantum computing advances, "harvest now, decrypt later" 
              attacks motivate early adoption of quantum-resistant cryptography. NIST standards 
              are finalized, pushing migration timelines.
            </p>
            <p className="prediction-what">
              <strong>What to Expect:</strong>
            </p>
            <ul>
              <li>Early adopters begin migrating to post-quantum algorithms</li>
              <li>Increased targeting of long-term sensitive data for future decryption</li>
              <li>Cryptographic agility becomes a security requirement</li>
              <li>Guidance and tooling for PQC migration emerges</li>
            </ul>
            <p className="prediction-action">
              <strong>Action:</strong> Inventory cryptographic systems, assess quantum risk 
              to sensitive data, and develop migration roadmap for quantum-resistant algorithms.
            </p>
          </div>
        </div>
      </div>

      {/* Technology Trends */}
      <div className="tech-trends">
        <h3>🚀 Emerging Technologies & Security Implications</h3>
        <div className="tech-grid">
          <div className="tech-card">
            <h4>⚡ 5G and Edge Computing</h4>
            <p>
              Expanded attack surface with billions of IoT devices. Edge computing pushes data 
              processing to less secure locations. Network slicing creates new segmentation challenges.
            </p>
          </div>
          <div className="tech-card">
            <h4>🏥 AI in Healthcare</h4>
            <p>
              AI diagnostic tools and medical devices create new targets. Patient data privacy 
              concerns grow with AI training datasets. Adversarial attacks on medical AI systems pose safety risks.
            </p>
          </div>
          <div className="tech-card">
            <h4>🔋 Electric Vehicle Infrastructure</h4>
            <p>
              EV charging networks become critical infrastructure. Vehicle-to-grid communication 
              creates new attack vectors. Over-the-air updates vulnerable to supply chain attacks.
            </p>
          </div>
          <div className="tech-card">
            <h4>🏦 Central Bank Digital Currencies</h4>
            <p>
              CBDCs introduce new financial infrastructure requiring robust security. Digital 
              wallets become high-value targets. Cross-border transaction surveillance raises privacy concerns.
            </p>
          </div>
        </div>
      </div>

      {/* Action Plan */}
      <div className="action-plan">
        <h3>📋 Strategic Action Plan for {nextYear}</h3>
        <div className="quarters-grid">
          <div className="forecast-quarter-card">
            <h4>Q1 {nextYear}: Assess and Plan</h4>
            <ul>
              <li>Conduct threat modeling based on these predictions</li>
              <li>Gap analysis of current security controls</li>
              <li>Budget allocation for priority initiatives</li>
              <li>Update incident response playbooks</li>
            </ul>
          </div>
          <div className="forecast-quarter-card">
            <h4>Q2 {nextYear}: Deploy Foundations</h4>
            <ul>
              <li>Roll out MFA universally</li>
              <li>Implement EDR/XDR solutions</li>
              <li>Deploy cloud security posture management</li>
              <li>Establish vendor risk management program</li>
            </ul>
          </div>
          <div className="forecast-quarter-card">
            <h4>Q3 {nextYear}: Mature Capabilities</h4>
            <ul>
              <li>Enhance threat detection with SIEM/SOAR</li>
              <li>Launch security awareness campaign on AI threats</li>
              <li>Conduct tabletop exercises for major scenarios</li>
              <li>Implement data loss prevention</li>
            </ul>
          </div>
          <div className="forecast-quarter-card">
            <h4>Q4 {nextYear}: Optimize and Prepare</h4>
            <ul>
              <li>Measure security program effectiveness</li>
              <li>Conduct red team assessment</li>
              <li>Review and update for {nextYear + 1}</li>
              <li>Board reporting on security posture</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="forecast-disclaimer">
        <h4>⚠️ Important Note on Predictions</h4>
        <p>
          These forecasts are based on observed trends from {selectedYear} and expert analysis, 
          but the threat landscape is inherently unpredictable. Zero-day vulnerabilities, novel 
          attack techniques, and geopolitical events can rapidly change the threat environment. 
          Use these predictions as guidance for strategic planning, not absolute certainties. 
          Maintain flexibility and regularly reassess your threat model.
        </p>
      </div>
    </section>
  )
}

export default ForecastsAndPredictions
