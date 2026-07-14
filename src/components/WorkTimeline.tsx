import { useState, useEffect } from 'react';

type Role = {
  company: string;
  logo: string;
  title: string;
  period: string;
  location: string;
  color: string;
  industries: string[];
  functions: string[];
  summary: string;
  highlights: string[];
};

const ROLES: Role[] = [
  {
    company: 'Lahzo',
    logo: '/images/logos/clients/lahzo.png',
    title: 'VP, Strategy & Analytics',
    period: '2026',
    location: 'Atlanta, GA',
    color: '#5a9a6e',
    industries: ['AI / SaaS', 'Startup'],
    functions: ['Strategy', 'Analytics', 'AI Systems', 'Revenue Operations'],
    summary: 'Owned client analytics, AI conversation intelligence, and the AI-ification of the company — reporting to the CEO at a high-growth AI startup.',
    highlights: [
      'Overhauled measurement and data strategy — a full-funnel view of client value, adopted company-wide',
      'Transformed a manual conversation-review function into a self-improving LLM-judge process, redeploying ~$200K/year of capacity',
      'Built the company\'s AI context layer so no question had to be asked twice',
    ],
  },
  {
    company: 'Equifax',
    logo: '/images/logos/equifax.svg',
    title: 'Senior Director, Global AI & Data Strategy',
    period: '2025 — 2026',
    location: 'Atlanta, GA',
    color: '#d4a853',
    industries: ['Financial Services', 'Enterprise Tech'],
    functions: ['AI Strategy', 'Data Governance', 'International', 'Executive Comms'],
    summary: 'Led global AI and data strategy — turning enterprise AI ambition into assessments, partnerships, and trained teams.',
    highlights: [
      'Developed the AI Maturity Assessment cited by the CFO as a corporate priority',
      'Orchestrated a partnership deal that unlocked a $2M+ revenue stream',
      'Designed hands-on AI training — workflows adopted by hundreds across the organization',
    ],
  },
  {
    company: 'Intuit Mailchimp',
    logo: '/images/logos/mailchimp.svg',
    title: 'Director, Customer & International Analytics',
    period: '2020 — 2024',
    location: 'Atlanta, GA',
    color: '#7c6fcd',
    industries: ['SaaS', 'Marketing Technology'],
    functions: ['Analytics', 'Revenue Operations', 'Team Leadership', 'International'],
    summary: 'Drove $120M+ in revenue impact through pricing, go-to-market, and retention strategies while leading a team that grew 6x.',
    highlights: [
      'Led 22-person cross-functional team implementing the company\'s largest price increase: $100M+ in incremental annual revenue',
      'Stood up enterprise churn reduction program uncovering $90M+ in annual savings',
      'Positioned the company to 2x international revenue over three years',
    ],
  },
  {
    company: 'Accenture Strategy',
    logo: '/images/logos/accenture.svg',
    title: 'Sr. Strategy Consultant → Manager',
    period: '2014 — 2019',
    location: 'Atlanta, GA',
    color: '#6b8fad',
    industries: ['Management Consulting', 'Telecom', 'Healthcare', 'Retail'],
    functions: ['Strategy', 'Customer Experience', 'AI & Chatbot', 'Change Management'],
    summary: 'Strategy consulting across telecom, healthcare, and retail verticals.',
    highlights: [
      'Led AI chatbot program projected to reduce 250M customer service calls and deliver $200M in savings',
      'Conducted omni-channel customer behavior analysis delivering $7M in annual CX savings',
    ],
  },
  {
    company: 'PricewaterhouseCoopers',
    logo: '/images/logos/pwc.svg',
    title: 'Strategy Consultant, M&A Advisory',
    period: 'Summer 2016',
    location: 'Atlanta, GA',
    color: '#e05c2c',
    industries: ['Management Consulting', 'M&A Advisory'],
    functions: ['M&A Integration', 'Org Design', 'Analytics'],
    summary: 'M&A integration advisory during MBA internship.',
    highlights: [
      'Facilitated org design workshops driving $13M in synergies for major acquisition',
      'Developed integration tracking dashboards for $17B pharmaceutical deal',
    ],
  },
  {
    company: 'Alvarez & Marsal',
    logo: '/images/logos/am.svg',
    title: 'Manager, Business Consulting',
    period: '2012 — 2015',
    location: 'Atlanta, GA',
    color: '#a07840',
    industries: ['Management Consulting', 'Financial Services', 'Retail', 'Private Equity'],
    functions: ['Strategy', 'IT Advisory', 'Change Management', 'Due Diligence'],
    summary: 'Strategy and IT advisory across six engagements in retail, insurance, and PE.',
    highlights: [
      'Reduced digital content publishing cycle from 17 to 6 weeks, saving $6M annually',
      'Led proof-of-concept securing $1.5M in follow-on implementation work',
      'Implemented enterprise IT system reducing labor expenses by $5M+ across facilities',
    ],
  },
  {
    company: 'Booz Allen Hamilton',
    logo: '/images/logos/booz-allen.svg',
    title: 'Senior Consultant',
    period: '2009 — 2012',
    location: 'Atlanta, GA',
    color: '#7a6a9e',
    industries: ['Defense & Government', 'Public Health'],
    functions: ['Strategy', 'Public Health', 'Business Development'],
    summary: 'Federal consulting focused on public health strategy and pandemic response.',
    highlights: [
      'Developed three-year strategic plan for 300-person federal division',
      'Redesigned global diagnostic kit distribution during H1N1 pandemic — reduced failed deliveries by 85%',
      'Grew team from 2 to 14 consultants through business development',
    ],
  },
];

interface WorkTimelineProps {
  filterCompany?: string | null;
}

export default function WorkTimeline({ filterCompany = null }: WorkTimelineProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(() => {
    if (filterCompany) {
      const idx = ROLES.findIndex(r => r.company === filterCompany);
      return idx >= 0 ? idx : null;
    }
    return null;
  });

  useEffect(() => {
    if (filterCompany) {
      const idx = ROLES.findIndex(r => r.company === filterCompany);
      if (idx >= 0) setExpandedIdx(idx);
    }
  }, [filterCompany]);

  return (
    <div>
      {/* Timeline */}
      <div style={{ position: 'relative', paddingLeft: '2rem' }}>
        <div style={{
          position: 'absolute', left: '0.5rem', top: '0.5rem', bottom: '0.5rem',
          width: '1px', background: 'var(--border)',
        }} />

        {ROLES.map((role, i) => {
          const globalIdx = ROLES.indexOf(role);
          const isExpanded = expandedIdx === globalIdx;
          const isHighlighted = filterCompany === role.company;
          return (
            <div key={role.company} style={{ position: 'relative', paddingBottom: '1rem' }}>
              <div style={{
                position: 'absolute', left: '-1.75rem', top: '1.5rem',
                width: '0.625rem', height: '0.625rem',
                borderRadius: '50%', background: role.color,
                border: '2px solid var(--bg)', zIndex: 1,
              }} />

              <div
                onClick={() => setExpandedIdx(isExpanded ? null : globalIdx)}
                style={{
                  border: isHighlighted ? '2px solid #d4a853' : '1px solid var(--border)',
                  background: 'transparent',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                  boxShadow: isHighlighted ? '0 0 8px rgba(212,168,83,0.3)' : 'none',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = `${role.color}44`)}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = isHighlighted ? '#d4a853' : 'var(--border)';
                }}
              >
                <div
                  style={{
                    width: '100%', display: 'grid',
                    gridTemplateColumns: '110px 1fr auto',
                    alignItems: 'center', gap: '1.25rem',
                    padding: '1.25rem 1.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={role.logo} alt={role.company}
                      style={{
                        maxWidth: '110px', maxHeight: '44px',
                        width: 'auto', height: 'auto', objectFit: 'contain',
                      }}
                    />
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'DM Serif Display, serif',
                      fontSize: '1.3rem', color: 'var(--ink)', lineHeight: 1.2,
                    }}>{role.title}</div>
                    <div style={{
                      fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.2rem',
                    }}>{role.company}</div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                    <div style={{
                      fontSize: '0.75rem', textTransform: 'uppercase',
                      letterSpacing: '0.08em', color: role.color,
                      fontFamily: 'DM Mono, monospace',
                    }}>{role.period}</div>
                    <div style={{
                      fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.15rem',
                    }}>{role.location}</div>
                    <div style={{
                      fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem',
                      transition: 'transform 0.2s ease',
                      transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                    }}>
                      ▼
                    </div>
                  </div>
                </div>

                <div style={{
                  maxHeight: isExpanded ? '500px' : '0',
                  overflow: 'hidden',
                  opacity: isExpanded ? 1 : 0,
                  transition: 'max-height 0.3s ease, opacity 0.2s ease',
                }}>
                  {isExpanded && (
                    <div style={{
                      padding: '0 1.5rem 1.5rem', marginLeft: '110px',
                      paddingLeft: '1.25rem', borderTop: '1px solid var(--border)',
                    }}>
                      <div style={{
                        fontSize: '0.92rem', color: 'var(--muted)', lineHeight: 1.65,
                        paddingTop: '1rem',
                      }}>{role.summary}</div>
                      <ul style={{
                        margin: 0, padding: 0, listStyle: 'none',
                        display: 'flex', flexDirection: 'column', gap: '0.4rem',
                        paddingTop: '0.75rem',
                      }}>
                        {role.highlights.map((h, j) => (
                          <li key={j} style={{
                            display: 'flex', gap: '0.75rem',
                            fontSize: '0.92rem', color: 'var(--muted)', lineHeight: 1.7,
                          }}>
                            <span style={{ color: role.color, flexShrink: 0 }}>—</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
