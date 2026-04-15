/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:       '#0c0c0e',
        surface:  '#131316',
        border:   '#232328',
        'border-hi': '#3a3a42',
        ink:      '#e8e6e0',
        muted:    '#6b6a72',
        gold:     '#d4a853',
        violet:   '#7c6fcd',
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        mono:  ['"DM Mono"', '"Courier New"', 'monospace'],
      },
    },
  },
};
