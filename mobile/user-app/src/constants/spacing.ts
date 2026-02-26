/**
 * Spacing Design Tokens
 * Matching Tailwind spacing system
 */

import { moderateScale } from '../utils/responsive';

export const spacing = {
  xs: moderateScale(4),      // 4px
  sm: moderateScale(8),      // 8px
  md: moderateScale(16),     // 16px (Standard screen padding)
  lg: moderateScale(20),     // 20px (Reduced from 24)
  xl: moderateScale(24),     // 24px (Reduced from 32)
  '2xl': moderateScale(32),  // 32px (Reduced from 48)
  '3xl': moderateScale(40),  // 40px (Reduced from 64)
  '4xl': moderateScale(48),  // 48px (Reduced from 80)
  '5xl': moderateScale(64),  // 64px (Reduced from 96)
};

// Screen padding
export const screenPadding = spacing.md; // 16px

// Component spacing
export const componentSpacing = {
  xxs: moderateScale(2),
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(12),
  lg: moderateScale(16),
  xl: moderateScale(20),
  xxl: moderateScale(24),
};

// Border radius
export const borderRadius = {
  none: 0,
  sm: moderateScale(4),
  md: moderateScale(8),
  lg: moderateScale(12),
  xl: moderateScale(16),
  '2xl': moderateScale(20),
  '3xl': moderateScale(24),
  full: 9999,
};

// Shadow/Elevation
export const shadow = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  // Ultra-subtle (cards, buttons in resting state)
  soft: {
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 1 }, // Tighter offset
    shadowOpacity: 0.06, // Lower opacity
    shadowRadius: 4, // Tighter radius
    elevation: 2,
  },
  // Medium (modals, dropdowns)
  medium: {
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 4 }, // Reduced height
    shadowOpacity: 0.1,
    shadowRadius: 12, // Reduced radius
    elevation: 4,
  },
  // Hard/Floating (floating action buttons, sticky headers)
  hard: {
    shadowColor: '#475569',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
  },
};

export default spacing;
