/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A5F',
        pagebg: '#F8FAFC',
        card: '#FFFFFF',
        border: '#E2E8F0',
        dangerBg: '#FEF2F2',
        dangerBorder: '#FCA5A5',
        dangerText: '#991B1B',
        success: '#10B981',
        infoBg: '#E0F2FE',
        infoText: '#1E3A5F',
      },
      boxShadow: {
        soft: '0 1px 0 rgba(15, 23, 42, 0.02)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '12px',
      },
    },
  },
  plugins: [],
};
