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
  } as const,

  // Font Sizes (Dense Premium Scale)
  fontSize: {
    xxxs: moderateScale(8),
    xxs: moderateScale(9),
    xs: moderateScale(10),
    xsMedium: moderateScale(11), // Carousel Subtitle
    sm: moderateScale(12),       // Standard Body
    base: moderateScale(13),
    md: moderateScale(14),       // H4
    lg: moderateScale(15),       // H3
    xl: moderateScale(16),       // H2 / Section Title / Carousel Title
    '2xl': moderateScale(18),    // H1 / Hero Title
    '3xl': moderateScale(22),
    '4xl': moderateScale(24),
    '5xl': moderateScale(28),
  },

  // Line Heights
  lineHeight: {
    tight: 1.1,
    normal: 1.4,
    relaxed: 1.6,
    loose: 2,
  },

  // Letter Spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.2,
    wider: 0.5,
  },

  // Font Weights
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  } as const,
};

// Text Style Presets (Dense Premium Hierarchy)
export const textStyles = {
  // Headings
  h1: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize['2xl'], // 18px
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.fontSize['2xl'] * 1.2,
    textAlign: 'left' as const,
  },
  h2: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.xl, // 16px
    fontWeight: typography.fontWeight.extrabold,
    lineHeight: typography.fontSize.xl * 1.2,
    textAlign: 'left' as const,
  },
  h3: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.fontSize.lg, // 15px
    fontWeight: typography.fontWeight.bold,
    textAlign: 'left' as const,
  },
  h4: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.fontSize.md, // 14px
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'left' as const,
  },

  // Body text
  bodyLarge: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base, // 13px
  },
  body: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm, // 12px
  },
  bodySmall: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xsMedium, // 11px
  },

  // Labels
  label: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.md, // 14px
    fontWeight: typography.fontWeight.medium,
  },
  labelSmall: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm, // 12px
    fontWeight: typography.fontWeight.medium,
  },

  // Buttons
  button: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.fontSize.base, // 13px
    fontWeight: typography.fontWeight.semibold,
  },
  buttonSmall: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.fontSize.sm, // 12px
    fontWeight: typography.fontWeight.semibold,
  },

  // Caption
  caption: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xsMedium, // 11px
  },
  captionSmall: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs, // 10px
  },
};

export default typography;
