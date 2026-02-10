/**
 * Generate visual assets for README
 * Creates SVG charts and graphics for top attack types and MITRE paths
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load incidents data
const incidents2026 = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/incidents-2026-enriched.json'), 'utf8')
);
const incidents2025 = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/incidents-2025-enriched.json'), 'utf8')
);

const allIncidents = [...incidents2026, ...incidents2025];

// Analyze MITRE techniques
function analyzeMITRE() {
  const techniqueCount = {};
  
  allIncidents.forEach(incident => {
    if (incident.mitreTechniques && Array.isArray(incident.mitreTechniques)) {
      incident.mitreTechniques.forEach(tech => {
        const id = tech.id || tech;
        techniqueCount[id] = (techniqueCount[id] || 0) + 1;
      });
    }
  });
  
  // Sort and get top 10
  return Object.entries(techniqueCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
}

// Analyze attack types
function analyzeAttackTypes() {
  const attackTypes = {};
  
  allIncidents.forEach(incident => {
    if (incident.tags && Array.isArray(incident.tags)) {
      incident.tags.forEach(tag => {
        if (tag !== 'Cyber') { // Exclude generic tag
          attackTypes[tag] = (attackTypes[tag] || 0) + 1;
        }
      });
    }
  });
  
  // Sort and get top 10
  return Object.entries(attackTypes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
}

// Generate SVG bar chart
function generateBarChart(data, title, filename) {
  const width = 800;
  const height = 400;
  const margin = { top: 60, right: 30, bottom: 80, left: 150 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  
  const maxValue = Math.max(...data.map(d => d[1]));
  const barHeight = chartHeight / data.length;
  
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="#0a0e1a"/>
  
  <!-- Title -->
  <text x="${width/2}" y="30" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">
    ${title}
  </text>
  
  <!-- Chart area -->
  <g transform="translate(${margin.left}, ${margin.top})">
`;

  // Generate bars
  data.forEach((item, index) => {
    const [label, value] = item;
    const barWidth = (value / maxValue) * chartWidth;
    const y = index * barHeight + (barHeight - 20) / 2;
    
    // Color based on position
    const colors = ['#ff4444', '#ff8844', '#ffaa44', '#ffcc44', '#44ff88', '#4488ff', '#8844ff', '#ff44ff', '#44ffff', '#88ff44'];
    const color = colors[index % colors.length];
    
    svg += `
    <!-- Bar ${index + 1}: ${label} -->
    <rect x="0" y="${y}" width="${barWidth}" height="20" fill="${color}" opacity="0.8"/>
    <text x="${barWidth + 10}" y="${y + 15}" font-family="Arial, sans-serif" font-size="14" fill="#ffffff">
      ${value}
    </text>
    <text x="-10" y="${y + 15}" font-family="Arial, sans-serif" font-size="12" fill="#e0e0e0" text-anchor="end">
      ${label}
    </text>
`;
  });

  svg += `
  </g>
  
  <!-- Footer -->
  <text x="${width/2}" y="${height - 20}" font-family="Arial, sans-serif" font-size="12" fill="#888888" text-anchor="middle">
    Based on ${allIncidents.length} incidents from CyberNews 2025-2026
  </text>
</svg>`;

  fs.writeFileSync(path.join(__dirname, '../public', filename), svg);
  console.log(`✅ Generated ${filename}`);
}

// Generate MITRE attack path visualization
function generateMITREPath() {
  const width = 900;
  const height = 500;
  
  // MITRE tactics in order
  const tactics = [
    { name: 'Initial\nAccess', color: '#ff4444', x: 50 },
    { name: 'Execution', color: '#ff8844', x: 170 },
    { name: 'Persistence', color: '#ffaa44', x: 290 },
    { name: 'Privilege\nEscalation', color: '#ffcc44', x: 410 },
    { name: 'Defense\nEvasion', color: '#44ff88', x: 530 },
    { name: 'Credential\nAccess', color: '#4488ff', x: 650 },
    { name: 'Impact', color: '#ff44ff', x: 770 }
  ];
  
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="#0a0e1a"/>
  
  <!-- Title -->
  <text x="${width/2}" y="40" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#ffffff" text-anchor="middle">
    MITRE ATT&amp;CK Attack Chain
  </text>
  <text x="${width/2}" y="65" font-family="Arial, sans-serif" font-size="14" fill="#888888" text-anchor="middle">
    Typical progression of cyber attacks
  </text>
  
  <!-- Attack path -->
  <g transform="translate(0, 150)">
`;

  // Draw connections
  for (let i = 0; i < tactics.length - 1; i++) {
    const x1 = tactics[i].x + 50;
    const y1 = 150;
    const x2 = tactics[i + 1].x + 50;
    const y2 = 150;
    
    svg += `
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" 
          stroke="#00d4ff" stroke-width="3" opacity="0.5" 
          stroke-dasharray="5,5">
      <animate attributeName="stroke-dashoffset" from="0" to="-10" dur="1s" repeatCount="indefinite"/>
    </line>
    <polygon points="${x2-8},${y2-6} ${x2},${y2} ${x2-8},${y2+6}" fill="#00d4ff" opacity="0.8"/>
`;
  }

  // Draw tactics
  tactics.forEach((tactic, i) => {
    svg += `
    <g transform="translate(${tactic.x}, 100)">
      <circle cx="50" cy="50" r="45" fill="${tactic.color}" opacity="0.3" stroke="${tactic.color}" stroke-width="2"/>
      <circle cx="50" cy="50" r="35" fill="${tactic.color}" opacity="0.6"/>
      <text x="50" y="48" font-family="Arial, sans-serif" font-size="11" font-weight="bold" 
            fill="#ffffff" text-anchor="middle">
        ${tactic.name.split('\n')[0]}
      </text>
      ${tactic.name.includes('\n') ? `
      <text x="50" y="62" font-family="Arial, sans-serif" font-size="11" font-weight="bold" 
            fill="#ffffff" text-anchor="middle">
        ${tactic.name.split('\n')[1]}
      </text>` : ''}
      <text x="50" y="-10" font-family="Arial, sans-serif" font-size="16" font-weight="bold" 
            fill="#00d4ff" text-anchor="middle">
        ${i + 1}
      </text>
    </g>
`;
  });

  svg += `
  </g>
  
  <!-- Legend -->
  <g transform="translate(50, 420)">
    <text x="0" y="0" font-family="Arial, sans-serif" font-size="12" fill="#e0e0e0">
      Attack progression flows left to right • Each phase enables the next
    </text>
  </g>
  
  <!-- Footer -->
  <text x="${width/2}" y="${height - 20}" font-family="Arial, sans-serif" font-size="12" fill="#888888" text-anchor="middle">
    MITRE ATT&amp;CK Framework • CyberNews 2026
  </text>
</svg>`;

  fs.writeFileSync(path.join(__dirname, '../public/mitre-attack-chain.svg'), svg);
  console.log('✅ Generated mitre-attack-chain.svg');
}

// Generate snapshot summary
function generateSnapshot() {
  const criticalIncidents = allIncidents.filter(i => (i.severity || 0) >= 80).length;
  const totalIncidents = allIncidents.length;
  const avgSeverity = Math.round(
    allIncidents.reduce((sum, i) => sum + (i.severity || 0), 0) / totalIncidents
  );
  
  const width = 1000;
  const height = 600;
  
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a1628;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#1a2845;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f1b35;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="${width}" height="${height}" fill="url(#bg-gradient)"/>
  
  <!-- Grid pattern -->
  <defs>
    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="30" y2="30" stroke="rgba(0, 212, 255, 0.05)" stroke-width="1"/>
      <line x1="30" y1="0" x2="0" y2="30" stroke="rgba(0, 212, 255, 0.05)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#grid)" opacity="0.3"/>
  
  <!-- Title -->
  <text x="${width/2}" y="60" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#ffffff" text-anchor="middle">
    🛡️ CyberNews 2026 - Snapshot
  </text>
  <text x="${width/2}" y="95" font-family="Arial, sans-serif" font-size="16" fill="#00d4ff" text-anchor="middle">
    Threat Intelligence Overview
  </text>
  
  <!-- Stats cards -->
  <g transform="translate(100, 140)">
    <!-- Card 1: Total Incidents -->
    <rect x="0" y="0" width="200" height="120" fill="#1a2845" stroke="#00d4ff" stroke-width="2" rx="10"/>
    <text x="100" y="35" font-family="Arial, sans-serif" font-size="14" fill="#888888" text-anchor="middle">
      Total Incidents
    </text>
    <text x="100" y="75" font-family="Arial, sans-serif" font-size="42" font-weight="bold" fill="#00d4ff" text-anchor="middle">
      ${totalIncidents}
    </text>
    <text x="100" y="100" font-family="Arial, sans-serif" font-size="12" fill="#888888" text-anchor="middle">
      2025-2026
    </text>
  </g>
  
  <g transform="translate(400, 140)">
    <!-- Card 2: Critical -->
    <rect x="0" y="0" width="200" height="120" fill="#1a2845" stroke="#ff4444" stroke-width="2" rx="10"/>
    <text x="100" y="35" font-family="Arial, sans-serif" font-size="14" fill="#888888" text-anchor="middle">
      Critical Threats
    </text>
    <text x="100" y="75" font-family="Arial, sans-serif" font-size="42" font-weight="bold" fill="#ff4444" text-anchor="middle">
      ${criticalIncidents}
    </text>
    <text x="100" y="100" font-family="Arial, sans-serif" font-size="12" fill="#888888" text-anchor="middle">
      Severity ≥ 80
    </text>
  </g>
  
  <g transform="translate(700, 140)">
    <!-- Card 3: Average Severity -->
    <rect x="0" y="0" width="200" height="120" fill="#1a2845" stroke="#ffaa44" stroke-width="2" rx="10"/>
    <text x="100" y="35" font-family="Arial, sans-serif" font-size="14" fill="#888888" text-anchor="middle">
      Avg Severity
    </text>
    <text x="100" y="75" font-family="Arial, sans-serif" font-size="42" font-weight="bold" fill="#ffaa44" text-anchor="middle">
      ${avgSeverity}
    </text>
    <text x="100" y="100" font-family="Arial, sans-serif" font-size="12" fill="#888888" text-anchor="middle">
      out of 100
    </text>
  </g>
  
  <!-- Key features -->
  <g transform="translate(100, 300)">
    <text x="0" y="0" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#ffffff">
      ✅ Key Features:
    </text>
    
    <text x="0" y="35" font-family="Arial, sans-serif" font-size="14" fill="#e0e0e0">
      🎯 MITRE ATT&amp;CK Mapped
    </text>
    <text x="300" y="35" font-family="Arial, sans-serif" font-size="14" fill="#e0e0e0">
      📊 Daily Digest Reports
    </text>
    <text x="600" y="35" font-family="Arial, sans-serif" font-size="14" fill="#e0e0e0">
      🤖 AI-Powered Analysis
    </text>
    
    <text x="0" y="65" font-family="Arial, sans-serif" font-size="14" fill="#e0e0e0">
      🛡️ NSM Integration
    </text>
    <text x="300" y="65" font-family="Arial, sans-serif" font-size="14" fill="#e0e0e0">
      📈 Weekly Strategic Briefs
    </text>
    <text x="600" y="65" font-family="Arial, sans-serif" font-size="14" fill="#e0e0e0">
      🔍 800+ Enriched Incidents
    </text>
  </g>
  
  <!-- Call to action -->
  <g transform="translate(${width/2}, 480)">
    <rect x="-200" y="0" width="400" height="60" fill="#00d4ff" rx="10"/>
    <text x="0" y="38" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#0a0e1a" text-anchor="middle">
      🚀 Explore Live Platform
    </text>
  </g>
  
  <!-- Footer -->
  <text x="${width/2}" y="${height - 20}" font-family="Arial, sans-serif" font-size="12" fill="#888888" text-anchor="middle">
    maremoo2.github.io/CyberNews-2025
  </text>
</svg>`;

  fs.writeFileSync(path.join(__dirname, '../public/snapshot-2026.svg'), svg);
  console.log('✅ Generated snapshot-2026.svg');
}

// Main execution
console.log('🎨 Generating visual assets...\n');

const mitreData = analyzeMITRE();
const attackTypeData = analyzeAttackTypes();

console.log(`📊 Top 10 MITRE Techniques:`);
mitreData.forEach(([id, count]) => console.log(`  ${id}: ${count}`));

console.log(`\n🔥 Top 10 Attack Types:`);
attackTypeData.forEach(([type, count]) => console.log(`  ${type}: ${count}`));

console.log('\n📈 Generating charts...\n');

generateBarChart(mitreData, 'Top 10 MITRE ATT&CK Techniques', 'top-mitre-techniques.svg');
generateBarChart(attackTypeData, 'Top 10 Attack Types', 'top-attack-types.svg');
generateMITREPath();
generateSnapshot();

console.log('\n✅ All visual assets generated successfully!');
console.log('📁 Files saved to public/ directory');
