/**
 * Typography Design Tokens
 * Matching web font system
 */

import { moderateScale } from '../utils/responsive';

export const typography = {
  // Font Families
  fontFamily: {
    display: 'PlayfairDisplay-Bold',  // For headings (serif)
    body: 'Inter-Regular',             // For content (sans-serif)
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },

  // Font Sizes
  fontSize: {
    xxs: moderateScale(10),
    xs: moderateScale(12),
    sm: moderateScale(14),
    base: moderateScale(16),
    lg: moderateScale(18),
    xl: moderateScale(20),
    '2xl': moderateScale(24),
    '3xl': moderateScale(28),
    '4xl': moderateScale(32),
    '5xl': moderateScale(40),
    '6xl': moderateScale(48),
    '7xl': moderateScale(56),
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Letter Spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },

  // Font Weights
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};

// Text Style Presets (commonly used combinations)
export const textStyles = {
  // Headings
  h1: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize['5xl'],
    lineHeight: typography.lineHeight.tight * typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.bold,
  },
  h2: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize['4xl'],
    lineHeight: typography.lineHeight.tight * typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
  },
  h3: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize['3xl'],
    lineHeight: typography.lineHeight.tight * typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
  },
  h4: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize['2xl'],
    lineHeight: typography.lineHeight.normal * typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
  },

  // Body text
  bodyLarge: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.lg,
  },
  body: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.normal * typography.fontSize.base,
  },
  bodySmall: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.normal * typography.fontSize.sm,
  },

  // Labels
  label: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  labelSmall: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },

  // Buttons
  button: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  buttonSmall: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },

  // Caption
  caption: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.normal * typography.fontSize.xs,
  },
};

export default typography;
