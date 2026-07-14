import { useState } from 'react';

const LOGOS = [
  { company: 'Lahzo', logo: '/images/logos/lahzo.svg', lightFix: true },
  { company: 'Equifax', logo: '/images/logos/equifax.svg' },
  { company: 'Mailchimp', logo: '/images/logos/mailchimp.svg', darkFix: true },
  { company: 'Accenture', logo: '/images/logos/accenture.svg' },
  { company: 'PwC', logo: '/images/logos/pwc.svg' },
  { company: 'Alvarez & Marsal', logo: '/images/logos/am.svg', darkFix: true, boost: true },
  { company: 'Booz Allen Hamilton', logo: '/images/logos/booz-allen.svg', darkFix: true },
  { company: 'Fuqua', logo: '/images/logos/fuqua.svg', darkFix: true, boost: true },
  { company: 'Emory', logo: '/images/logos/emory.svg', darkFix: true, boost: true },
];

interface ClientLogoWallProps {
  onFilter: (company: string | null) => void;
  activeFilter: string | null;
}

export default function ClientLogoWall({ onFilter, activeFilter }: ClientLogoWallProps) {
  return (
    <div>
      {/* Small/square logos (A&M, Fuqua, Emory) render dark-on-transparent and need a
          brightness/invert fix to stay legible on the dark & hacker themes; Lahzo's mark
          is light-on-transparent and needs the inverse fix on the light theme. */}
      <style>{`
        html[data-theme="dark"] .clw-dark-fix,
        html[data-theme="hacker"] .clw-dark-fix { filter: brightness(0) invert(0.9); }
        html[data-theme="light"] .clw-light-fix { filter: invert(1) brightness(0.35); }
      `}</style>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '0.75rem',
        }}
      >
        {LOGOS.map(({ company, logo, darkFix, lightFix, boost }) => {
          const isActive = activeFilter === company;
          const fixClass = darkFix ? 'clw-dark-fix' : lightFix ? 'clw-light-fix' : '';
          return (
            <button
              key={company}
              title={company}
              onClick={() => onFilter(isActive ? null : company)}
              style={{
                height: '64px',
                padding: '0.75rem',
                background: 'var(--surface)',
                border: isActive ? '2px solid #d4a853' : '1px solid var(--border)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease, transform 0.2s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <img
                src={logo}
                alt={company}
                className={fixClass}
                style={{
                  height: boost ? '56px' : '48px',
                  maxHeight: boost ? '56px' : '48px',
                  maxWidth: '130px',
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
