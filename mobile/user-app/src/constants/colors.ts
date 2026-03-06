/**
 * Color Design Tokens
 * Matching web Tailwind config exactly
 */

export const colors = {
  // Primary - Turquoise/Teal (Main brand color)
  primary: {
    50: '#f0fdfa',   // Very light turquoise
    100: '#ccfbf1',  // Light turquoise
    200: '#99f6e4',  // Soft turquoise
    300: '#5eead4',  // Medium turquoise
    400: '#2dd4bf',  // Bright turquoise
    500: '#28b7b5',  // Main turquoise (Primary buttons)
    600: '#0d9488',  // Deep turquoise
    700: '#0f766e',  // Dark turquoise
    800: '#115e59',  // Very dark turquoise
    900: '#134e4a',  // Darkest turquoise
  },

  // Secondary - Cyan
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

  // Accent - Blue
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
  },

  // Green - Success states
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',  // Success
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Gray - Neutral colors
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Orange - Warnings
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },

  // Red - Errors
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',  // Error
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Yellow - Warnings & Ratings
  yellow: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',  // Star ratings
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
  },

  // Purple - Special features
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },

  // Amber - Business/B2B (Matching web)
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Rose - D2C/Bestsellers (Matching web)
  rose: {
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    500: '#f43f5e',
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
    900: '#881337',
  },

  // Semantic colors (shortcuts)
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Basic colors
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',

  // Background colors
  background: {
    primary: '#f0fdfa', // Match chat section (primary.50)
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
  },

  // Text colors
  text: {
    primary: '#111827',    // gray-900
    secondary: '#4b5563',  // gray-600
    tertiary: '#9ca3af',   // gray-400
    inverse: '#ffffff',
  },

  // Border colors
  border: {
    light: '#e5e7eb',      // gray-200
    default: '#d1d5db',    // gray-300
    dark: '#9ca3af',       // gray-400
  },

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
};

export default colors;
