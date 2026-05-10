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
    logo: '/images/logos/lahzo.svg',
    title: 'VP, Strategy & Analytics',
    period: 'Mar 2026 — Present',
    location: 'Atlanta, GA',
    color: '#5a9a6e',
    industries: ['AI / SaaS', 'Startup'],
    functions: ['Strategy', 'Analytics', 'AI Systems', 'Revenue Operations'],
    summary: 'Building the data and analytics function from scratch at a pre-Series A AI company.',
    highlights: [
      'Architecting internal AI systems and proprietary pipelines powering the revenue flywheel',
      'Automating performance marketing attribution to eliminate manual bottlenecks',
      'Strategic partner to CEO on enterprise deals, pricing, and product direction',
    ],
  },
  {
    company: 'Equifax',
    logo: '/images/logos/equifax.svg',
    title: 'VP, Global AI & Data Strategy',
    period: '2025 — 2026',
    location: 'Atlanta, GA',
    color: '#d4a853',
    industries: ['Financial Services', 'Enterprise Tech'],
    functions: ['AI Strategy', 'Data Governance', 'International', 'Executive Comms'],
    summary: 'Led global AI and analytics strategy across international markets.',
    highlights: [
      'Developed AI maturity framework adopted across four regions',
      'Built Insights Guild — internal knowledge network recognized as crown jewel initiative',
      'Restructured multi-million dollar data partnerships for AI-first strategy',
    ],
  },
  {
    company: 'Intuit Mailchimp',
    logo: '/images/logos/mailchimp.svg',
    title: 'Director, Customer & International Analytics',
    period: '2021 — 2023',
    location: 'Atlanta, GA',
    color: '#7c6fcd',
    industries: ['SaaS', 'Marketing Technology'],
    functions: ['Analytics', 'Revenue Operations', 'Team Leadership', 'International'],
    summary: 'Scaled analytics org from 4 to 20 and led cross-functional revenue programs.',
    highlights: [
      'Led 22-person cross-functional team implementing largest price increase: $100M+ in incremental annual revenue',
      'Stood up enterprise churn reduction program uncovering $90M+ in annual savings',
      'Positioned company to 2x international revenue over three years',
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

const ALL_INDUSTRIES = [...new Set(ROLES.flatMap(r => r.industries))].sort();
const ALL_FUNCTIONS = [...new Set(ROLES.flatMap(r => r.functions))].sort();

interface WorkTimelineProps {
  filterCompany?: string | null;
}

export default function WorkTimeline({ filterCompany = null }: WorkTimelineProps) {
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [expandedIdx, setExpandedIdx] = useState<number | null>(() => {
    if (filterCompany) {
      const idx = ROLES.findIndex(r => r.company === filterCompany);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  useEffect(() => {
    if (filterCompany) {
      const idx = ROLES.findIndex(r => r.company === filterCompany);
      if (idx >= 0) setExpandedIdx(idx);
    }
  }, [filterCompany]);

  function toggleTag(tag: string) {
    setActiveTags(prev => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }

  const filteredRoles = activeTags.size === 0
    ? ROLES
    : ROLES.filter(r =>
        [...activeTags].some(t => r.industries.includes(t) || r.functions.includes(t))
      );

  const hasActiveFilters = activeTags.size > 0;
  const roleCount = filteredRoles.length;

  return (
    <div>
      {/* Tag Cloud */}
      <div style={{
        marginBottom: '2.5rem', padding: '1.5rem',
        border: '1px solid var(--border)', background: 'var(--surface)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          marginBottom: '0.75rem', flexWrap: 'wrap',
        }}>
          <span style={{
            fontSize: '0.8rem', textTransform: 'uppercase',
            letterSpacing: '0.08em', color: 'var(--muted)',
          }}>Industries</span>
          {hasActiveFilters && (
            <button
              onClick={() => setActiveTags(new Set())}
              style={{
                fontSize: '0.8rem', fontFamily: 'DM Mono, monospace',
                textTransform: 'uppercase', letterSpacing: '0.06em',
                padding: '0.3em 0.75em', borderRadius: '2px',
                border: '1px solid var(--border)', background: 'transparent',
                color: 'var(--muted)', cursor: 'pointer', marginLeft: 'auto',
              }}
            >
              Clear {activeTags.size} &times;
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
          {ALL_INDUSTRIES.map(tag => {
            const active = activeTags.has(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                style={{
                  fontSize: '0.8rem', fontFamily: 'DM Mono, monospace',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  padding: '0.3em 0.75em', borderRadius: '2px',
                  border: `1px solid ${active ? '#d4a853' : 'rgba(212,168,83,0.3)'}`,
                  background: active ? '#d4a853' : 'rgba(212,168,83,0.1)',
                  color: active ? 'var(--bg)' : '#d4a853',
                  cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
                }}
              >
                {tag}
              </button>
            );
          })}
        </div>

        <span style={{
          fontSize: '0.8rem', textTransform: 'uppercase',
          letterSpacing: '0.08em', color: 'var(--muted)',
          display: 'block', marginBottom: '0.5rem',
        }}>Functions</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {ALL_FUNCTIONS.map(tag => {
            const active = activeTags.has(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                style={{
                  fontSize: '0.8rem', fontFamily: 'DM Mono, monospace',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  padding: '0.3em 0.75em', borderRadius: '2px',
                  border: `1px solid ${active ? '#7c6fcd' : 'rgba(124,111,205,0.3)'}`,
                  background: active ? '#7c6fcd' : 'rgba(124,111,205,0.1)',
                  color: active ? 'var(--bg)' : '#7c6fcd',
                  cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
                }}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <div style={{
            marginTop: '0.75rem', fontSize: '0.9rem',
            color: '#d4a853', fontFamily: 'DM Mono, monospace',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <span
              style={{
                display: 'inline-block',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            >
              {roleCount} of {ROLES.length} roles
            </span>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', paddingLeft: '2rem' }}>
        <div style={{
          position: 'absolute', left: '0.5rem', top: '0.5rem', bottom: '0.5rem',
          width: '1px', background: 'var(--border)',
        }} />

        {filteredRoles.map((role, i) => {
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
                  background: 'var(--surface)',
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
                    gridTemplateColumns: '80px 1fr auto',
                    alignItems: 'center', gap: '1.25rem',
                    padding: '1.25rem 1.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={role.logo} alt={role.company}
                      style={{
                        maxWidth: '80px', maxHeight: '32px',
                        width: 'auto', height: 'auto', objectFit: 'contain',
                        filter: 'var(--logo-filter)', opacity: 0.85,
                      }}
                    />
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'DM Serif Display, serif',
                      fontSize: '1.05rem', color: 'var(--ink)', lineHeight: 1.2,
                    }}>{role.title}</div>
                    <div style={{
                      fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.15rem',
                    }}>{role.summary}</div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                    <div style={{
                      fontSize: '0.65rem', textTransform: 'uppercase',
                      letterSpacing: '0.08em', color: role.color,
                      fontFamily: 'DM Mono, monospace',
                    }}>{role.period}</div>
                    <div style={{
                      fontSize: '0.6rem', color: 'var(--muted)', marginTop: '0.15rem',
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
                      padding: '0 1.5rem 1.5rem', marginLeft: '80px',
                      paddingLeft: '1.25rem', borderTop: '1px solid var(--border)',
                    }}>
                      <div style={{
                        display: 'flex', flexWrap: 'wrap', gap: '0.3rem',
                        margin: '1rem 0 0.875rem',
                      }}>
                        {role.industries.map(t => (
                          <span key={t} style={{
                            fontSize: '0.55rem', fontFamily: 'DM Mono, monospace',
                            textTransform: 'uppercase', letterSpacing: '0.06em',
                            padding: '0.15em 0.5em', borderRadius: '2px',
                            border: '1px solid rgba(212,168,83,0.3)',
                            color: '#d4a853', background: 'rgba(212,168,83,0.06)',
                          }}>{t}</span>
                        ))}
                        {role.functions.map(t => (
                          <span key={t} style={{
                            fontSize: '0.55rem', fontFamily: 'DM Mono, monospace',
                            textTransform: 'uppercase', letterSpacing: '0.06em',
                            padding: '0.15em 0.5em', borderRadius: '2px',
                            border: '1px solid rgba(124,111,205,0.3)',
                            color: '#7c6fcd', background: 'rgba(124,111,205,0.06)',
                          }}>{t}</span>
                        ))}
                      </div>

                      <ul style={{
                        margin: 0, padding: 0, listStyle: 'none',
                        display: 'flex', flexDirection: 'column', gap: '0.4rem',
                      }}>
                        {role.highlights.map((h, j) => (
                          <li key={j} style={{
                            display: 'flex', gap: '0.75rem',
                            fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.65,
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
