import { useState, useMemo } from 'react';

type PostType = 'song' | 'image' | 'project' | 'note';

interface Post {
  slug:    string;
  title:   string;
  type:    PostType;
  tags:    string[];
  date:    string;
  youtube?: string;
  embed?:  string;
  image?:  string;
  caption?: string;
}

const TYPE_META: Record<PostType, { label: string; icon: string; color: string; bg: string }> = {
  song:    { label: 'Song',    icon: '♫', color: '#d4a853', bg: 'rgba(212,168,83,.08)' },
  image:   { label: 'Image',  icon: '◈', color: '#7c6fcd', bg: 'rgba(124,111,205,.08)' },
  project: { label: 'Project',icon: '⌥', color: '#5a9a6e', bg: 'rgba(90,154,110,.08)' },
  note:    { label: 'Note',   icon: '◇', color: '#6b8fad', bg: 'rgba(107,143,173,.08)' },
};

const ALL_TYPES: (PostType | 'all')[] = ['all', 'song', 'image', 'project', 'note'];

function ytId(url: string) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/watch\?v=)([^&?/\s]+)/);
  return m ? m[1] : null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// ─── PostCard ──────────────────────────────────────────────────────────────

function PostCard({ post }: { post: Post }) {
  const [playing, setPlaying] = useState(false);
  const [embedOpen, setEmbedOpen] = useState(false);
  const meta = TYPE_META[post.type];
  const videoId = post.youtube ? ytId(post.youtube) : null;
  const thumbUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
  const coverImage = post.image || thumbUrl;
  const date = formatDate(post.date);

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
      transition: 'border-color .2s',
    }}
    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-hi)')}
    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      {/* Cover art / YouTube embed */}
      {coverImage && (
        <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: '#000' }}>
          {playing && videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <img
                src={coverImage}
                alt={post.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: .92 }}
              />
              {/* Type badge on image */}
              <div style={{
                position: 'absolute', top: 10, left: 10,
                background: 'rgba(0,0,0,.72)', backdropFilter: 'blur(6px)',
                border: `1px solid ${meta.color}44`,
                color: meta.color,
                fontSize: '.6rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase',
                padding: '.2em .6em', borderRadius: 2,
              }}>
                {meta.icon} {meta.label}
              </div>
              {/* Play button for YouTube */}
              {videoId && (
                <button
                  onClick={() => setPlaying(true)}
                  style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,.3)', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background .2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,.5)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,.3)')}
                  aria-label="Play video"
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: '#ff0000dd', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(0,0,0,.5)',
                  }}>
                    <span style={{ color: '#fff', fontSize: '1.1rem', marginLeft: 3 }}>▶</span>
                  </div>
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* No image — type banner */}
      {!coverImage && (
        <div style={{
          padding: '.5rem .75rem',
          background: meta.bg,
          borderBottom: `1px solid ${meta.color}22`,
          display: 'flex', alignItems: 'center', gap: '.4rem',
          fontSize: '.65rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase',
          color: meta.color,
        }}>
          {meta.icon} {meta.label}
        </div>
      )}

      {/* Body */}
      <div style={{ padding: '1rem 1.125rem', display: 'flex', flexDirection: 'column', gap: '.5rem', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '.5rem' }}>
          <h3 style={{
            fontFamily: '"DM Serif Display", serif', fontSize: '1.2rem',
            color: 'var(--ink)', lineHeight: 1.25, margin: 0,
          }}>{post.title}</h3>
          <span style={{ fontSize: '.62rem', color: 'var(--muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>{date}</span>
        </div>

        {post.caption && (
          <p style={{ fontSize: '.8rem', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>{post.caption}</p>
        )}

        {/* Embeddable iframe (non-YouTube) */}
        {post.embed && !post.youtube && (
          <div style={{ marginTop: '.5rem' }}>
            {embedOpen ? (
              <div>
                <iframe
                  src={post.embed}
                  style={{ width: '100%', height: 300, border: 'none', borderRadius: 3 }}
                  loading="lazy"
                />
                <button onClick={() => setEmbedOpen(false)} style={{
                  marginTop: '.5rem', background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em',
                }}>Collapse ↑</button>
              </div>
            ) : (
              <button onClick={() => setEmbedOpen(true)} style={{
                background: meta.bg, border: `1px solid ${meta.color}33`, cursor: 'pointer',
                fontSize: '.65rem', color: meta.color, textTransform: 'uppercase', letterSpacing: '.08em',
                padding: '.3em .8em', borderRadius: 2, fontFamily: 'inherit',
              }}>
                ↗ Open Interactive View
              </button>
            )}
          </div>
        )}

        {/* Tags */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '.35rem',
          paddingTop: '.75rem', marginTop: 'auto',
          borderTop: '1px solid var(--border)',
        }}>
          {post.tags.map(tag => (
            <span key={tag} style={{
              fontSize: '.6rem', color: 'var(--muted)', letterSpacing: '.08em',
              textTransform: 'uppercase',
            }}>#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── FeedGrid ─────────────────────────────────────────────────────────────

export default function FeedGrid({ posts }: { posts: Post[] }) {
  const [activeType, setActiveType] = useState<PostType | 'all'>('all');
  const [activeTag,  setActiveTag]  = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach(p => p.tags.forEach(t => set.add(t)));
    return Array.from(set).sort();
  }, [posts]);

  const filtered = useMemo(() =>
    posts.filter(p => {
      const typeOk = activeType === 'all' || p.type === activeType;
      const tagOk  = !activeTag || p.tags.includes(activeTag);
      return typeOk && tagOk;
    }),
  [posts, activeType, activeTag]);

  return (
    <div>
      {/* ── Type tabs ── */}
      <div style={{ display: 'flex', gap: '.375rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {ALL_TYPES.map(t => {
          const isActive = activeType === t;
          const meta = t !== 'all' ? TYPE_META[t] : null;
          return (
            <button
              key={t}
              onClick={() => { setActiveType(t); setActiveTag(null); }}
              className={`type-tab${isActive ? ' active' : ''}`}
              style={isActive && meta ? {
                background: meta.color,
                color: '#fff',
                borderColor: meta.color,
              } : {}}
            >
              {t === 'all' ? 'All' : `${meta!.icon} ${meta!.label}s`}
            </button>
          );
        })}
      </div>

      {/* ── Tag cloud ── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '.375rem',
        paddingBottom: '1.25rem', marginBottom: '1.25rem',
        borderBottom: '1px solid var(--border)',
      }}>
        <span style={{ fontSize: '.6rem', textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--muted)', alignSelf: 'center', marginRight: '.25rem' }}>
          Tags:
        </span>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`tag-pill${activeTag === tag ? ' active' : ''}`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* ── Count + clear ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', margin: 0 }}>
          {filtered.length} {filtered.length === 1 ? 'post' : 'posts'}
        </p>
        {(activeType !== 'all' || activeTag) && (
          <button onClick={() => { setActiveType('all'); setActiveTag(null); }} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '.65rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '.08em',
            fontFamily: 'inherit',
          }}>
            Clear filters ×
          </button>
        )}
      </div>

      {/* ── Grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
        gap: '1px',
        background: 'var(--border)',
        border: '1px solid var(--border)',
      }}>
        {filtered.map(post => <PostCard key={post.slug} post={post} />)}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--muted)' }}>
          No posts matching those filters.
        </div>
      )}
    </div>
  );
}
