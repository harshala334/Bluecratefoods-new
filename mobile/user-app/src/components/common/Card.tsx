import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../constants/colors';
import { borderRadius, shadow, spacing } from '../../constants/spacing';

/**
 * Card Component - Container with elevation/shadow
 */

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  style,
}) => {
  return (
    <View style={[styles.base, styles[variant], style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
  },
  default: {
    ...shadow.soft,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  elevated: {
    ...shadow.hard,
  },
});

export default Card;
