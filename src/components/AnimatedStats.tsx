import { useEffect, useRef, useState } from 'react';

interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  sub?: string;
}

function Counter({ value, prefix = '', suffix = '', duration = 1400 }: {
  value: number; prefix?: string; suffix?: string; duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const step = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(eased * value));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

const STATS: Stat[] = [
  { value: 30,   suffix: '+',  label: 'Projects Built',       sub: 'AI tools, systems, experiments' },
  { value: 15,   suffix: '+',  label: 'Years Experience',      sub: 'Analytics · Strategy · AI' },
  { value: 400,  prefix: '$', suffix: 'M+', label: 'Business Impact',  sub: 'Documented ROI across clients' },
  { value: 10,   suffix: 'K+', label: 'AI Generations',        sub: "Lil' Mimic Studio" },
];

export default function AnimatedStats() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))',
      gap: '1px',
      background: 'var(--border)',
      border: '1px solid var(--border)',
      margin: '2rem 0',
    }}>
      {STATS.map((s, i) => (
        <div key={i} style={{
          background: 'var(--surface)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
        }}>
          <div style={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 600,
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            color: 'var(--gold)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}>
            <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} duration={1600 + i * 100} />
          </div>
          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--ink)' }}>
            {s.label}
          </div>
          {s.sub && (
            <div style={{ fontSize: '0.65rem', color: 'var(--muted)', fontFamily: '"DM Mono", monospace' }}>
              {s.sub}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
