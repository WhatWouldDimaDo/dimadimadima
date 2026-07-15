import { useMemo, useState } from 'react';

type Project = {
  slug: string;
  title: string;
  description: string;
  shortDescription?: string;
  tags: string[];
  image?: string;
  status?: string;
  date?: string;
};

type Props = { projects: Project[] };

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  live: { label: 'Live', color: '#4f8a61' }, active: { label: 'Active', color: '#a97922' },
  built: { label: 'Built', color: '#6a5fba' }, concept: { label: 'Concept', color: '#6b6a72' },
  research: { label: 'Research', color: '#587b9e' }, experiment: { label: 'Experiment', color: '#a85e42' },
};

const CATEGORIES = [
  ['all', 'All'], ['ai', 'AI / LLM'], ['data', 'Data'], ['creative', 'Creative'],
  ['tools', 'Tools'], ['family', 'Family'],
] as const;

const TAG_CATEGORY_MAP: Record<string, string[]> = {
  ai: ['ai','claude','llm','openai','gemini','suno','ml','cv','multi-agent','orchestration','mcp','litellm','ollama','anthropic'],
  data: ['data-analysis','data-pipeline','python','sql','network-analysis','scraping','pipeline','tmdb','firecrawl','obsidian'],
  creative: ['music','illustration','comics','sticker','ai-art','chatgpt','editorial','newsletter'],
  tools: ['cli','chrome-extension','automation','productivity','gmail','exiftool','voice','swift','macos','infrastructure','docker','vercel'],
  family: ['family','dean','kids','ffmpeg','paw-patrol'],
};

function projectCategories(tags: string[]) {
  return Object.entries(TAG_CATEGORY_MAP)
    .filter(([, categoryTags]) => tags.some(tag => categoryTags.includes(tag.toLowerCase())))
    .map(([category]) => category);
}

function initials(title: string) {
  const words = title.trim().split(/\s+/);
  return words.length > 1 ? `${words[0][0]}${words.at(-1)?.[0]}`.toUpperCase() : title.slice(0, 2).toUpperCase();
}

export default function ProjectsGrid({ projects }: Props) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return projects.filter(project => {
      if (activeCategory !== 'all' && !projectCategories(project.tags).includes(activeCategory)) return false;
      if (!query) return true;
      return project.title.toLowerCase().includes(query)
        || project.description.toLowerCase().includes(query)
        || project.tags.some(tag => tag.toLowerCase().includes(query));
    });
  }, [activeCategory, projects, search]);

  return (
    <div className="projects-browser">
      <div className="projects-controls">
        <div className="project-filters" aria-label="Filter projects">
          {CATEGORIES.map(([id, label]) => (
            <button key={id} type="button" aria-pressed={activeCategory === id}
              onClick={() => setActiveCategory(id)}>{label}</button>
          ))}
        </div>
        <label className="project-search">
          <span className="sr-only">Search projects</span>
          <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
          <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search projects" />
        </label>
      </div>

      <div className="projects-result-line">
        <span>{filtered.length} project{filtered.length === 1 ? '' : 's'}</span>
        {(search || activeCategory !== 'all') && (
          <button type="button" onClick={() => { setSearch(''); setActiveCategory('all'); }}>Clear filters ×</button>
        )}
      </div>

      <div className="projects-grid">
        {filtered.map(project => {
          const status = project.status ? STATUS_CONFIG[project.status] ?? { label: project.status, color: '#6b6a72' } : null;
          const description = project.shortDescription ?? project.description;
          const date = project.date ? new Date(project.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : null;
          return (
            <a key={project.slug} href={`/projects/${project.slug}`} className="project-card">
              <div className="project-card-media">
                {project.image
                  ? <img src={project.image} alt="" loading="lazy" />
                  : <span className="project-card-initials" aria-hidden="true">{initials(project.title)}</span>}
              </div>
              <div className="project-card-body">
                <div className="project-card-meta">
                  {status && <span style={{ color: status.color }}><i style={{ background: status.color }} />{status.label}</span>}
                  {date && <time>{date}</time>}
                </div>
                <h2>{project.title}</h2>
                <p>{description}</p>
                <span className="project-card-link">Open project <span aria-hidden="true">↗</span></span>
              </div>
            </a>
          );
        })}
      </div>

      {filtered.length === 0 && <p className="projects-empty">No projects match that search.</p>}
    </div>
  );
}
