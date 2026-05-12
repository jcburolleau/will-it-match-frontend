/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Newsreader Variable', 'Georgia', 'serif'],
        body: ['DM Sans Variable', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono Variable', 'ui-monospace', 'monospace'],
      },
      colors: {
        paper: 'oklch(96.6% 0.012 90)',
        ink: 'oklch(22% 0.015 55)',
        accent: 'oklch(38% 0.105 28)',
        shell: 'oklch(15% 0.015 55)',
      },
    },
  },
  plugins: [],
}
