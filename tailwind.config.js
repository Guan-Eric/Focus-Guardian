/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Primary Blue - Main brand color
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#3b82f6', // Main primary
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        
        // Success Green - Streaks, achievements, positive feedback
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#10b981', // Main success
          600: '#059669',
          700: '#047857',
          800: '#166534',
          900: '#14532d',
        },
        
        // Warning/Gold - Premium features, special badges
        warning: {
          50: '#fef3c7',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24', // Main warning
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        
        // Pink/Magenta - Badges, special features
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#ec4899', // Main accent
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        
        // Purple - Levels, progression
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#8b5cf6', // Main purple
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        
        // Cyan/Teal - Focus, timers
        focus: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4', // Main focus
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        
        // Neutral/Slate - UI elements
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        
        // Dark mode colors
        dark: {
          bg: '#1e293b',
          surface: '#334155',
          border: '#475569',
          text: '#f1f5f9',
          'text-secondary': '#94a3b8',
        },
      },
      
      // Custom gradient colors
      gradients: {
        primary: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        warning: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        accent: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
        purple: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      },
      
      // Box shadows
      boxShadow: {
        'primary': '0 4px 14px 0 rgba(59, 130, 246, 0.39)',
        'success': '0 4px 14px 0 rgba(16, 185, 129, 0.39)',
        'warning': '0 4px 14px 0 rgba(251, 191, 36, 0.39)',
        'card': '0 2px 8px 0 rgba(15, 23, 42, 0.08)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      
      // Border radius
      borderRadius: {
        'card': '16px',
        'button': '12px',
        'input': '10px',
        'full': '9999px',
      },
      
      // Spacing (matches your wireframe spacing)
      spacing: {
        '18': '72px',
        '88': '352px',
      },
      
      // Font sizes
      fontSize: {
        'xxs': '10px',
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '28px',
        '4xl': '32px',
        '5xl': '40px',
        '6xl': '48px',
        '7xl': '56px',
        '8xl': '64px',
      },
    },
  },
  plugins: [],
}