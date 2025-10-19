import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        critical: '#dc2626',
        major: '#f59e0b',
        minor: '#10b981',
        normal: '#2563eb'
      }
    },
  },
  plugins: [],
} satisfies Config;
