import { useState } from 'react';

const LOGOS = [
  { company: 'Lahzo', logo: '/images/logos/lahzo.svg' },
  { company: 'Equifax', logo: '/images/logos/equifax.svg' },
  { company: 'Mailchimp', logo: '/images/logos/mailchimp.svg' },
  { company: 'Accenture', logo: '/images/logos/accenture.svg' },
  { company: 'PwC', logo: '/images/logos/pwc.svg' },
  { company: 'Alvarez & Marsal', logo: '/images/logos/am.svg' },
  { company: 'Booz Allen Hamilton', logo: '/images/logos/booz-allen.svg' },
  { company: 'Fuqua', logo: '/images/logos/fuqua.svg' },
  { company: 'Emory', logo: '/images/logos/emory.svg' },
];

interface ClientLogoWallProps {
  onFilter: (company: string | null) => void;
  activeFilter: string | null;
}

export default function ClientLogoWall({ onFilter, activeFilter }: ClientLogoWallProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '0.75rem',
      }}
    >
      {LOGOS.map(({ company, logo }) => {
        const isActive = activeFilter === company;
        return (
          <button
            key={company}
            title={company}
            onClick={() => onFilter(isActive ? null : company)}
            style={{
              padding: '0.75rem',
              background: 'var(--surface)',
              border: isActive ? '2px solid #d4a853' : '1px solid var(--border)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative',
              filter: isActive ? 'none' : 'grayscale(100%) brightness(0.8)',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.filter = 'none';
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.filter = 'grayscale(100%) brightness(0.8)';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            <img
              src={logo}
              alt={company}
              style={{
                height: '48px',
                width: 'auto',
                maxWidth: '100%',
                objectFit: 'contain',
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
