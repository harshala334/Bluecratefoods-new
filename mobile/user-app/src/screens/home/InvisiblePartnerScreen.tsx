import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../constants/colors';
import { typography, textStyles } from '../../constants/typography';
import { spacing, borderRadius } from '../../constants/spacing';

const benefits = [
  { icon: '⏱️', text: 'Save 50–60% prep time' },
  { icon: '❄️', text: 'Frozen freshness with consistent taste' },
  { icon: '🚀', text: 'Perfect for high-rush hours' },
  { icon: '💰', text: 'Bulk discounts for hotels & cafés' },
];

export const InvisiblePartnerScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title as any}>Your Kitchen’s Invisible Partner</Text>
        <Text style={styles.subtitle}>
          Streamline your kitchen operations with Eatee. We handle the prep, so you can focus on creating amazing dishes.
        </Text>
      </View>

      <View style={styles.benefitsGrid}>
        {benefits.map((benefit, index) => (
          <View key={index} style={styles.benefitCard}>
            <Text style={styles.benefitIcon}>{benefit.icon}</Text>
            <Text style={styles.benefitText}>{benefit.text}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
  },
  title: {
    ...textStyles.h2,
    textAlign: 'center',
    marginBottom: spacing.md,
    color: colors.primary[700],
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.gray[600],
    textAlign: 'center',
    maxWidth: '90%',
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.lg,
  },
  benefitCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  benefitIcon: {
    fontSize: 40,
    marginBottom: spacing.md,
  },
  benefitText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semibold,
    textAlign: 'center',
    color: colors.text.primary,
  },
});

export default InvisiblePartnerScreen;
