import { useState } from 'react';

type Client = { name: string; logo: string };
type Role = {
  company: string;
  logo: string;
  title: string;
  period: string;
  location: string;
  color: string;
  industries: string[];
  functions: string[];
  clients: Client[];
  achievements: string[];
  metrics: string[];
};

const ROLES: Role[] = [
  {
    company: 'Lahzo',
    logo: '/images/logos/lahzo.svg',
    title: 'VP, Strategy & Analytics',
    period: 'Mar 2026 — Present',
    location: 'Atlanta, GA · Remote',
    color: '#5a9a6e',
    industries: ['AI / SaaS', 'Revenue Operations', 'Startup'],
    functions: ['Strategy', 'Analytics', 'AI Systems', 'Executive Partnership'],
    clients: [],
    achievements: [
      "Architecting internal AI systems, data products, and proprietary pipelines that power Lahzo's revenue flywheel",
      'Automating performance marketing and ad-to-agent attribution to eliminate manual bottlenecks and give clients clear ROI visibility',
      'Building conversation review automation layer — feeding insights into agent optimization, product prioritization, and GTM playbooks',
      'Acting as strategic partner to CEO and Head of Strategy on enterprise deals, pricing, and product direction',
      'Joined as a senior leadership hire at a pre-Series A AI company — brought in to build the data and analytics function from scratch',
    ],
    metrics: ['Equity stake', 'Ad-to-agent automation', 'CEO-level partnership', 'Series A stage'],
  },
  {
    company: 'Equifax',
    logo: '/images/logos/equifax.svg',
    title: 'VP, Global AI & Data Strategy',
    period: '2025 — 2026',
    location: 'Atlanta, GA',
    color: '#d4a853',
    industries: ['Financial Services', 'Credit & Data Analytics', 'Enterprise Tech'],
    functions: ['AI Strategy', 'Data Governance', 'International', 'Executive Comms'],
    clients: [],
    achievements: [
      'Led global AI and analytics strategy across international markets and business units',
      'Developed AI maturity framework adopted across four regions',
      'Restructured multi-million dollar data partnerships to align with AI-first strategy',
      'Built Insights Guild — internal knowledge network connecting AI practitioners across global teams; recognized as crown jewel initiative by leadership',
      'Produced C-suite executive newsletter synthesizing global AI competitive landscape — 30% more content and 2× more connections than predecessor format',
    ],
    metrics: ['Multi-million$ restructured', 'AI maturity framework', '4 regions', 'Global AI Guild'],
  },
  {
    company: 'Intuit Mailchimp',
    logo: '/images/logos/mailchimp.svg',
    title: 'Director, Customer & International Analytics',
    period: '2021 — 2023',
    location: 'Atlanta, GA',
    color: '#7c6fcd',
    industries: ['SaaS', 'Marketing Technology', 'Enterprise Software'],
    functions: ['Analytics', 'Revenue Operations', 'Team Leadership', 'Strategy', 'International'],
    clients: [],
    achievements: [
      'Scaled analytics org from 4 to 20 people supporting six customer-facing departments — boosted capacity 50% via recruiting and two external partnerships',
      'Partnered with Chief Sales Officer and Chief Customer Officer on GTM strategy, operational targets, and weekly business performance tracking',
      "Led 22-person cross-functional team to design and implement Mailchimp's largest price increase: $100M+ in incremental annual revenue while minimizing churn",
      'Stood up enterprise-wide churn reduction program — uncovered $90M+ in annual savings through billing failure mitigation, retention promotions, and propensity model deployments',
      'Positioned Mailchimp to 2× international revenue over three years — accelerated localization into 5 languages and shifted to local Sales/CS models globally',
      'Developed business cases driving 6× growth in go-to-market team headcount by modeling Sales, Onboarding, and CS impact on conversion and retention',
    ],
    metrics: ['$100M+ price increase', '$90M+ churn savings', '20-person team', '6× GTM growth', '2× intl revenue'],
  },
  {
    company: 'Accenture Strategy',
    logo: '/images/logos/accenture.svg',
    title: 'Sr. Strategy Consultant → Manager',
    period: '2014 — 2019',
    location: 'Atlanta, GA',
    color: '#6b8fad',
    industries: ['Management Consulting', 'Telecom', 'Healthcare', 'Retail'],
    functions: ['Strategy', 'Customer Experience', 'AI & Chatbot', 'Analytics', 'Change Management'],
    clients: [
      { name: 'Verizon / AT&T',              logo: '/images/logos/verizon.svg' },
      { name: 'Blue Cross Blue Shield NC',   logo: '/images/logos/bcbs-nc.svg' },
      { name: 'Walmart',                      logo: '/images/logos/walmart.svg' },
    ],
    achievements: [
      '[Telecom] Led AI chatbot program expected to reduce customer service calls by 250M and deliver $200M in savings over three years — built business case, led negotiations, managed deployment across channels',
      '[Telecom] Conducted omni-channel customer behavior and churn analysis — delivered $7M in annual savings through targeted CX improvements',
      '[Healthcare Payer] Stood up Customer Experience Transformation Management Office — defined governance model, org design, and operational processes for cross-functional CX team',
      '[Retail] Identified customer experience gaps at global retailer; recommended omni-channel improvements via two-day executive workshop with senior leadership',
      'Co-authored Accenture Strategy thought leadership on blockchain\'s impact in media — published and distributed to clients',
    ],
    metrics: ['$200M chatbot savings', '250M calls deflected', '$7M CX savings', 'CX Transformation Office'],
  },
  {
    company: 'PricewaterhouseCoopers',
    logo: '/images/logos/pwc.svg',
    title: 'Strategy Consultant, M&A Advisory',
    period: 'Summer 2016',
    location: 'Atlanta, GA',
    color: '#e05c2c',
    industries: ['Management Consulting', 'M&A Advisory', 'Pharma', 'Consumer Goods'],
    functions: ['M&A Integration', 'Org Design', 'Analytics', 'Synergy Capture'],
    clients: [
      { name: 'Laura Mercier (Shiseido)',  logo: '/images/logos/laura-mercier.svg' },
      { name: 'Pfizer',                    logo: '/images/logos/pfizer.svg' },
    ],
    achievements: [
      '[Laura Mercier / Cosmetics] Facilitated 9 org design workshops driving $13M in synergies for major cosmetics acquisition — aligned leadership across functional workstreams',
      '[Pfizer / Pharma] Developed Tableau integration tracking tools to manage a $17B pharmaceutical acquisition — dashboards used by the executive integration office',
    ],
    metrics: ['$13M synergies', '$17B deal tracked', '9 workshops'],
  },
  {
    company: 'Alvarez & Marsal',
    logo: '/images/logos/am.svg',
    title: 'Manager, Business Consulting',
    period: '2012 — 2015',
    location: 'Atlanta, GA',
    color: '#a07840',
    industries: ['Management Consulting', 'Financial Services', 'Retail', 'Construction', 'Insurance', 'Private Equity'],
    functions: ['Strategy', 'IT Advisory', 'Change Management', 'Business Case', 'Due Diligence'],
    clients: [
      { name: 'Target',             logo: '/images/logos/target.svg' },
      { name: 'New York Life',      logo: '/images/logos/new-york-life.svg' },
      { name: 'Oldcastle Materials', logo: '/images/logos/oldcastle.svg' },
      { name: 'Beechcraft',         logo: '/images/logos/beechcraft.svg' },
      { name: 'Apollo Global',      logo: '/images/logos/apollo.svg' },
      { name: 'MultiView',          logo: '/images/logos/multiview.svg' },
    ],
    achievements: [
      '[Target] Reduced digital content publishing cycle time from 17 to 6 weeks — identified process bottlenecks and redesigned workflow saving $6M annually',
      '[New York Life] Led 3-person team through proof-of-concept of new Vendor Risk Management process — secured CIO buy-in and $1.5M in follow-on implementation',
      '[Oldcastle / Construction] Analyzed technology infrastructure; built business case for AWS data center migration delivering $1.3M in savings',
      '[Beechcraft] Implemented IT system for aircraft manufacturer reducing labor expenses by $5M+; led training program for 800 staff across facilities',
      '[Apollo / PE] Conducted 2 IT due diligence projects — uncovered ineffective management practices that refined valuation of target financial services companies',
      '[Insurance] Conducted market benchmarking uncovering significant underpricing for long-term health insurance provider — findings drove corporate turnaround strategy changes',
    ],
    metrics: ['$6M cycle savings', '$1.5M follow-on', '$1.3M AWS savings', '$5M labor reduction', '800 staff trained'],
  },
  {
    company: 'Booz Allen Hamilton',
    logo: '/images/logos/booz-allen.svg',
    title: 'Senior Consultant',
    period: '2009 — 2012',
    location: 'Atlanta, GA · CDC Account',
    color: '#7a6a9e',
    industries: ['Defense & Government', 'Public Health', 'Federal Consulting'],
    functions: ['Strategy', 'Public Health', 'Business Development', 'Operations'],
    clients: [
      { name: 'CDC — Influenza Division', logo: '/images/logos/cdc.svg' },
      { name: 'American Cancer Society',  logo: '/images/logos/acs.svg' },
    ],
    achievements: [
      '[CDC] Developed three-year strategic plan for 300-person Influenza Division — aligned leadership on priorities, resources, and multi-year roadmap',
      '[CDC] Redesigned global H1N1 diagnostic kit distribution system during 2009 pandemic — reduced failed deliveries by 85% through supply chain redesign and process improvements',
      'Recognized with CDC Public Health Impact Award for contributions during pandemic response',
      '[American Cancer Society] Supported strategy and operations engagement during nonprofit consulting work',
      'Grew Booz Allen CDC team from 2 to 14 consultants through business development and client relationship building',
    ],
    metrics: ['85% fewer failed deliveries', 'CDC Public Health Award', '2→14 consultant team'],
  },
];

const TAG_CATS = {
  industry: { label: 'Industry', color: '#d4a853', bg: 'rgba(212,168,83,0.1)',   border: 'rgba(212,168,83,0.3)' },
  function: { label: 'Function', color: '#7c6fcd', bg: 'rgba(124,111,205,0.1)', border: 'rgba(124,111,205,0.3)' },
};

export default function WorkPortfolio() {
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [openIdx, setOpenIdx] = useState<Set<number>>(new Set([0]));
  const [activeFilter, setActiveFilter] = useState<'industry' | 'function'>('industry');

  const allTags = {
    industry: [...new Set(ROLES.flatMap(r => r.industries))].sort(),
    function: [...new Set(ROLES.flatMap(r => r.functions))].sort(),
  };

  const filteredRoles = activeTags.size === 0
    ? ROLES
    : ROLES.filter(role => {
        const roleTags = new Set([...role.industries, ...role.functions]);
        return [...activeTags].some(t => roleTags.has(t));
      });

  function toggleTag(tag: string) {
    setActiveTags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag); else next.add(tag);
      return next;
    });
  }
  function toggleRole(i: number) {
    setOpenIdx(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  }

  const tagPill = (tag: string, cat: keyof typeof TAG_CATS, clickable = true) => {
    const c = TAG_CATS[cat];
    const active = activeTags.has(tag);
    return (
      <button
        key={tag}
        onClick={clickable ? () => toggleTag(tag) : undefined}
        style={{
          fontSize: '0.6rem', fontFamily: 'DM Mono, monospace',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          padding: '0.2em 0.65em', borderRadius: '2px',
          border: `1px solid ${active ? c.color : c.border}`,
          background: active ? c.color : c.bg,
          color: active ? 'var(--bg)' : c.color,
          cursor: clickable ? 'pointer' : 'default',
          transition: 'all 0.15s', whiteSpace: 'nowrap',
        }}
      >
        {tag}
      </button>
    );
  };

  return (
    <div>
      {/* Filter bar */}
      <div style={{ marginBottom: '2rem', padding: '1.25rem 1.5rem', border: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--muted)', flexShrink: 0 }}>Filter by</span>
          {(['industry', 'function'] as const).map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                fontSize: '0.6rem', fontFamily: 'DM Mono, monospace',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                padding: '0.2em 0.65em', borderRadius: '2px',
                border: '1px solid var(--border-hi)',
                background: activeFilter === f ? 'var(--border-hi)' : 'transparent',
                color: activeFilter === f ? 'var(--ink)' : 'var(--muted)',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {TAG_CATS[f].label}
            </button>
          ))}
          {activeTags.size > 0 && (
            <button
              onClick={() => setActiveTags(new Set())}
              style={{ fontSize: '0.6rem', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.2em 0.65em', borderRadius: '2px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', marginLeft: 'auto' }}
            >
              Clear {activeTags.size} ×
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {allTags[activeFilter].map(t => tagPill(t, activeFilter))}
        </div>

        {activeTags.size > 0 && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.65rem', color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>
            Showing {filteredRoles.length} of {ROLES.length} roles
          </div>
        )}
      </div>

      {/* Role cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', border: '1px solid var(--border)', background: 'var(--border)' }}>
        {filteredRoles.map((role) => {
          const globalIdx = ROLES.indexOf(role);
          const isOpen = openIdx.has(globalIdx);
          return (
            <div key={role.company} style={{ background: 'var(--surface)' }}>
              <button
                onClick={() => toggleRole(globalIdx)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.5rem', cursor: 'pointer', background: 'none', border: 'none', textAlign: 'left' }}
              >
                <div style={{ width: '3px', height: '2.75rem', background: role.color, borderRadius: '2px', flexShrink: 0 }} />

                {/* Company logo */}
                <div style={{ width: '80px', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                  <img
                    src={role.logo}
                    alt={role.company}
                    style={{ maxWidth: '80px', maxHeight: '30px', width: 'auto', height: 'auto', objectFit: 'contain', filter: 'var(--logo-filter)', opacity: 0.8 }}
                  />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.1rem', color: 'var(--ink)', lineHeight: 1.2 }}>{role.title}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.2rem' }}>{role.company} · {role.location}</div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}>{role.period}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.2rem', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>⌄</div>
                </div>
              </button>

              {isOpen && (
                <div style={{ padding: '0 1.5rem 1.5rem 4.75rem', borderTop: '1px solid var(--border)' }}>
                  {/* Industry + Function tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', margin: '0.875rem 0 0.75rem' }}>
                    {role.industries.map(t => tagPill(t, 'industry'))}
                    {role.functions.map(t => tagPill(t, 'function'))}
                  </div>

                  {/* Achievements */}
                  <ul style={{ margin: '0 0 0.875rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', padding: 0, listStyle: 'none' }}>
                    {role.achievements.map((b, j) => (
                      <li key={j} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8125rem', color: 'var(--muted)', lineHeight: 1.65 }}>
                        <span style={{ color: role.color, flexShrink: 0 }}>—</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Metrics */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: role.clients.length ? '1rem' : '0' }}>
                    {role.metrics.map(m => (
                      <span
                        key={m}
                        style={{ fontSize: '0.6rem', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', border: `1px solid ${role.color}44`, color: role.color, padding: '0.2em 0.65em', borderRadius: '2px' }}
                      >
                        {m}
                      </span>
                    ))}
                  </div>

                  {/* Client logos */}
                  {role.clients.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--muted)', marginBottom: '0.6rem' }}>Clients</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem', alignItems: 'center' }}>
                        {role.clients.map(c => (
                          <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.75rem', border: '1px solid var(--border)', background: 'var(--bg)', borderRadius: '2px' }}>
                            <img
                              src={c.logo}
                              alt={c.name}
                              style={{ height: '18px', width: 'auto', maxWidth: '60px', objectFit: 'contain', filter: 'var(--logo-filter)', opacity: 0.7 }}
                            />
                            <span style={{ fontSize: '0.6rem', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{c.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
