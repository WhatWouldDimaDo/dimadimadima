import { useState, useMemo } from 'react';

type Project = {
  slug: string;
  title: string;
  description: string;
  shortDescription?: string;
  tags: string[];
  url?: string;
  image?: string;
  status?: string;
  date?: string;
};

type Props = { projects: Project[] };

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  live:       { label: 'Live',       color: '#5a9a6e' },
  active:     { label: 'Active',     color: '#d4a853' },
  built:      { label: 'Built',      color: '#7c6fcd' },
  concept:    { label: 'Concept',    color: '#6b6a72' },
  research:   { label: 'Research',   color: '#6b8fad' },
  experiment: { label: 'Experiment', color: '#c07050' },
};

const CATEGORIES = [
  { id: 'all',          label: 'All'           },
  { id: 'ai',           label: 'AI / LLM'      },
  { id: 'data',         label: 'Data Science'  },
  { id: 'creative',     label: 'Creative'      },
  { id: 'tools',        label: 'Tools'         },
  { id: 'infra',        label: 'Infrastructure'},
  { id: 'family',       label: 'Family'        },
];

const TAG_CATEGORY_MAP: Record<string, string[]> = {
  ai:       ['ai', 'claude', 'llm', 'openai', 'gemini', 'suno', 'ml', 'cv', 'face-recognition', 'semantic-search', 'multi-agent', 'orchestration', 'mcp', 'litellm', 'ollama', 'perplexity', 'anthropic'],
  data:     ['data-analysis', 'data-pipeline', 'python', 'sql', 'network-analysis', 'scraping', 'pipeline', 'tmdb', 'firecrawl', 'obsidian'],
  creative: ['music', 'illustration', 'comics', 'sticker', 'ai-art', 'chatgpt', 'editorial', 'newsletter'],
  tools:    ['cli', 'chrome-extension', 'automation', 'productivity', 'gmail', 'exiftool', 'voice', 'swift', 'macos'],
  infra:    ['infrastructure', 'bun', 'docker', 'vercel', 'streaming', 'platform', 'open-source'],
  family:   ['family', 'dean', 'kids', 'ffmpeg', 'paw-patrol'],
};

function getCategory(tags: string[]): string[] {
  const cats: string[] = [];
  for (const [cat, catTags] of Object.entries(TAG_CATEGORY_MAP)) {
    if (tags.some(t => catTags.includes(t.toLowerCase()))) cats.push(cat);
  }
  return cats;
}

function getInitials(title: string): string {
  const words = title.trim().split(/\s+/);
  if (words.length > 1) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return (words[0]?.slice(0, 2) || '').toUpperCase();
}

export default function ProjectsGrid({ projects }: Props) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const allTags = useMemo(() =>
    [...new Set(projects.flatMap(p => p.tags))].sort(), [projects]);

  const filtered = useMemo(() => {
    return projects.filter(p => {
      if (activeCategory !== 'all') {
        const cats = getCategory(p.tags);
        if (!cats.includes(activeCategory)) return false;
      }
      if (activeTag && !p.tags.includes(activeTag)) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!p.title.toLowerCase().includes(q) &&
            !p.description.toLowerCase().includes(q) &&
            !p.tags.some(t => t.includes(q))) return false;
      }
      return true;
    });
  }, [projects, activeCategory, activeTag, search]);

  return (
    <div>
      {/* Category tabs */}
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); setActiveTag(null); }}
            style={{
              fontSize: '0.65rem', fontFamily: 'DM Mono, monospace',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              padding: '0.35em 0.9em', borderRadius: '2px',
              border: '1px solid var(--border)',
              background: activeCategory === cat.id ? 'var(--ink)' : 'transparent',
              color: activeCategory === cat.id ? 'var(--bg)' : 'var(--muted)',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >{cat.label}</button>
        ))}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search…"
          style={{
            marginLeft: 'auto', fontSize: '0.65rem', fontFamily: 'DM Mono, monospace',
            padding: '0.35em 0.75em', borderRadius: '2px',
            border: '1px solid var(--border)', background: 'transparent',
            color: 'var(--ink)', outline: 'none', width: '130px',
          }}
        />
      </div>

      {/* Tag cloud */}
      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
        {allTags.map(t => (
          <button
            key={t}
            onClick={() => setActiveTag(activeTag === t ? null : t)}
            style={{
              fontSize: '0.58rem', fontFamily: 'DM Mono, monospace',
              textTransform: 'uppercase', letterSpacing: '0.06em',
              padding: '0.15em 0.55em', borderRadius: '2px',
              border: `1px solid ${activeTag === t ? 'var(--gold)' : 'var(--border)'}`,
              background: activeTag === t ? 'rgba(212,168,83,0.1)' : 'transparent',
              color: activeTag === t ? 'var(--gold)' : 'var(--muted)',
              cursor: 'pointer', transition: 'all 0.12s',
            }}
          >#{t}</button>
        ))}
        {(activeTag || search || activeCategory !== 'all') && (
          <button
            onClick={() => { setActiveTag(null); setSearch(''); setActiveCategory('all'); }}
            style={{ fontSize: '0.58rem', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0.15em 0.55em', borderRadius: '2px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', marginLeft: '0.25rem' }}
          >Clear ×</button>
        )}
      </div>

      {/* Count */}
      <div style={{ fontSize: '0.65rem', color: 'var(--muted)', fontFamily: 'DM Mono, monospace', marginBottom: '1.25rem', letterSpacing: '0.06em' }}>
        {filtered.length} project{filtered.length !== 1 ? 's' : ''}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '1rem' }}>
        {filtered.map(p => {
          const statusMeta = p.status ? STATUS_CONFIG[p.status] ?? { label: p.status, color: '#6b6a72' } : null;
          const href = p.url || null;
          const date = p.date ? new Date(p.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : null;

          const cardHref = `/projects/${p.slug}`;
          const cardDescription = p.shortDescription ?? (p.description.length > 80 ? p.description.substring(0, 80) + '...' : p.description);

          return (
            <a
              key={p.slug}
              href={cardHref}
              style={{ background: 'var(--surface)', display: 'flex', flexDirection: 'column', position: 'relative', textDecoration: 'none', color: 'inherit', border: '1px solid var(--border)', overflow: 'hidden' }}
              className="card-hover"
            >
              {p.image ? (
                <div style={{ width: '100%', aspectRatio: '3/2', overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(135deg, var(--border) 0%, var(--surface) 100%)' }}>
                  <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)' }} loading="lazy" />
                </div>
              ) : (
                <div style={{ minHeight: '8rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '1.5rem 1.25rem', background: 'linear-gradient(135deg, var(--surface) 60%, rgba(212,168,83,0.06))', position: 'relative' }}>
                  <span style={{ position: 'absolute', top: '0.5rem', right: '1rem', fontFamily: 'DM Serif Display, serif', fontSize: '3rem', opacity: 0.1, color: 'var(--gold)', userSelect: 'none', pointerEvents: 'none' }}>{getInitials(p.title)}</span>
                  <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.2rem', color: 'var(--ink)', lineHeight: 1.25, marginBottom: '0.5rem' }}>{p.title}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: 'DM Mono, monospace', lineHeight: '1.4', marginTop: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cardDescription}</div>
                  {statusMeta && (
                    <span style={{ fontSize: '0.58rem', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.12em', color: statusMeta.color, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: statusMeta.color, display: 'inline-block' }} />
                      {statusMeta.label}
                    </span>
                  )}
                </div>
              )}
              {p.image && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', padding: '0 0.75rem', paddingTop: '0.35rem', paddingBottom: '0.35rem', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {statusMeta && (
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: statusMeta.color, flexShrink: 0, display: 'inline-block' }} />
                    )}
                    <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '0.9rem', color: 'var(--ink)', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{p.title}</div>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: 'DM Mono, monospace', lineHeight: '1.4', marginTop: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cardDescription}</div>
                </div>
              )}
            </a>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.8rem', fontFamily: 'DM Mono, monospace' }}>
          No projects match that filter.
        </div>
      )}
    </div>
  );
}
