import { useState, useMemo } from 'react';

type PostType = 'song' | 'image' | 'project' | 'note';

interface Post {
  slug:    string;
  title:   string;
  type:    PostType;
  tags:    string[];
  date:    string;
  youtube?: string;
  image?:  string;
  caption?: string;
}

const TYPE_LABELS: Record<PostType, string> = {
  song:    '♫',
  image:   '◈',
  project: '⌥',
  note:    '◇',
};

const TYPE_COLORS: Record<PostType, string> = {
  song:    '#d4a853',
  image:   '#7c6fcd',
  project: '#5a9a6e',
  note:    '#6b6a72',
};

export default function FeedGrid({ posts }: { posts: Post[] }) {
  const [activeType, setActiveType] = useState<PostType | 'all'>('all');
  const [activeTag, setActiveTag]   = useState<string | null>(null);

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

  const types: (PostType | 'all')[] = ['all', 'song', 'image', 'project', 'note'];

  return (
    <div>
      {/* Type filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {types.map(t => (
          <button
            key={t}
            onClick={() => { setActiveType(t); setActiveTag(null); }}
            className={`tag-pill transition-colors ${activeType === t ? 'active' : ''}`}
            style={activeType === t && t !== 'all' ? { color: TYPE_COLORS[t], borderColor: TYPE_COLORS[t] + '55' } : {}}
          >
            {t === 'all' ? 'All' : `${TYPE_LABELS[t]} ${t}s`}
          </button>
        ))}
      </div>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="flex gap-2 mb-8 flex-wrap border-b border-border pb-6">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`tag-pill ${activeTag === tag ? 'active' : ''}`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Count */}
      <p className="text-muted text-xs mb-6 uppercase tracking-widest">
        {filtered.length} {filtered.length === 1 ? 'post' : 'posts'}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
        {filtered.map(post => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted">
          No posts matching those filters.
        </div>
      )}
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  const icon  = TYPE_LABELS[post.type];
  const color = TYPE_COLORS[post.type];
  const date  = new Date(post.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <div className="bg-surface p-6 flex flex-col gap-3 group relative overflow-hidden">
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
        style={{ background: `linear-gradient(90deg, ${color}, #7c6fcd)` }}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest font-medium" style={{ color }}>
          {icon} {post.type}
        </span>
        <span className="text-muted text-[0.65rem]">{date}</span>
      </div>

      {/* Title */}
      <h3 className="font-serif text-xl text-ink leading-tight group-hover:text-gold transition-colors">
        {post.title}
      </h3>

      {/* Caption */}
      {post.caption && (
        <p className="text-muted text-sm leading-relaxed flex-1">{post.caption}</p>
      )}

      {/* YouTube embed placeholder */}
      {post.youtube && (
        <a
          href={post.youtube}
          target="_blank"
          rel="noopener"
          className="flex items-center gap-2 text-xs text-muted hover:text-gold transition-colors mt-auto pt-3 border-t border-border"
        >
          <span style={{ color: '#ff4444' }}>▶</span>
          Watch on YouTube ↗
        </a>
      )}

      {/* Image */}
      {post.image && !post.youtube && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full aspect-video object-cover rounded-sm mt-auto"
        />
      )}

      {/* Tags */}
      <div className="flex gap-1.5 flex-wrap mt-auto pt-3 border-t border-border">
        {post.tags.map(tag => (
          <span key={tag} className="text-[0.6rem] text-muted uppercase tracking-widest">#{tag}</span>
        ))}
      </div>
    </div>
  );
}
