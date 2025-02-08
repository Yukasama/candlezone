import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/components/**/*.{tsx,mdx}',
    './src/app/**/*.{tsx,mdx}',
    './src/features/**/*.{tsx,mdx}',
  ],
};

export default config;
