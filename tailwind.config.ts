import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/components/**/*.{tsx}',
    './src/app/**/*.{tsx}',
    './src/features/**/*.{tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'border-spin': 'border-spin 3s linear infinite',
      },
      keyframes: {
        'border-spin': {
          from: {
            'border-image-source':
              'linear-gradient(0deg, transparent 50%, hsl(var(--success)) 50%)',
          },
          to: {
            'border-image-source':
              'linear-gradient(360deg, transparent 50%, hsl(var(--success)) 50%)',
          },
        },
      },
    },
  },
};

export default config;
