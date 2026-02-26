/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',   // Very light turquoise
          100: '#ccfbf1',  // Light turquoise
          200: '#99f6e4',  // Soft turquoise
          300: '#5eead4',  // Medium turquoise
          400: '#2dd4bf',  // Bright turquoise
          500: '#28b7b5',  // Main turquoise
          600: '#0d9488',  // Deep turquoise
          700: '#0f766e',  // Dark turquoise
          800: '#115e59',  // Very dark turquoise
          900: '#134e4a',  // Darkest turquoise
        },
        secondary: {
          50: '#ecfeff',   // Light cyan
          100: '#cffafe',  // Soft cyan
          200: '#a5f3fc',  // Bright cyan
          300: '#67e8f9',  // Medium cyan
          400: '#22d3ee',  // Vibrant cyan
          500: '#06b6d4',  // Deep cyan
          600: '#0891b2',  // Dark cyan
          700: '#0e7490',  // Darker cyan
          800: '#155e75',  // Very dark cyan
          900: '#164e63',  // Darkest cyan
        },
        accent: {
          50: '#f0f9ff',   // Very light blue
          100: '#e0f2fe',  // Light blue
          200: '#bae6fd',  // Soft blue
          300: '#7dd3fc',  // Medium blue
          400: '#38bdf8',  // Bright blue
          500: '#0ea5e9',  // Main blue
          600: '#0284c7',  // Deep blue
          700: '#0369a1',  // Dark blue
          800: '#075985',  // Very dark blue
          900: '#0c4a6e',  // Darkest blue
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 30px -5px rgba(0, 0, 0, 0.04)',
        'hard': '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}
