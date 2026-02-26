import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { borderRadius } from '../../constants/spacing';

/**
 * Badge Component - Small colored label
 */

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  style,
}) => {
  return (
    <View style={[styles.base, styles[variant], style]}>
      <Text style={[styles.text, styles[`${variant}Text`]]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  
  // Variants
  success: {
    backgroundColor: colors.green[100],
  },
  warning: {
    backgroundColor: colors.yellow[100],
  },
  error: {
    backgroundColor: colors.red[100],
  },
  info: {
    backgroundColor: colors.accent[100],
  },
  default: {
    backgroundColor: colors.gray[100],
  },
  
  // Text styles
  text: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    fontWeight: '600',
  },
  successText: {
    color: colors.green[700],
  },
  warningText: {
    color: colors.yellow[700],
  },
  errorText: {
    color: colors.red[700],
  },
  infoText: {
    color: colors.accent[700],
  },
  defaultText: {
    color: colors.gray[700],
  },
});

export default Badge;
