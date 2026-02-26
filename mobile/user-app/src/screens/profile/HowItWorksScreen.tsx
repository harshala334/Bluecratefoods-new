import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius, shadow } from '../../constants/spacing';

export const HowItWorksScreen = () => {
    const steps = [
        { icon: 'shopping-bag', title: 'Browse Dishes', description: 'Discover amazing recipes from our curated collection', color: colors.accent[500] },
        { icon: 'check-circle', title: 'Select Ingredients', description: 'Choose fresh ingredients for your selected recipes', color: colors.green[500] },
        { icon: 'truck', title: 'Get Delivered', description: 'Receive everything at your doorstep within hours', color: colors.orange[500] },
        { icon: 'book-open', title: 'Cook with Guidance', description: 'Follow step-by-step instructions to create magic', color: colors.purple[500] },
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>How It Works</Text>
                <Text style={styles.sectionSubtitle}>Four simple steps to delicious meals</Text>

                <View style={styles.features}>
                    {steps.map((feature, index) => (
                        <View key={index} style={styles.featureCard}>
                            <View style={[styles.featureIcon, { backgroundColor: `${feature.color}20` }]}>
                                <Feather name={feature.icon as any} size={24} color={feature.color} />
                            </View>
                            <Text style={styles.featureTitle}>{feature.title}</Text>
                            <Text style={styles.featureDescription}>{feature.description}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    section: {
        padding: spacing.md,
        paddingTop: spacing.xl,
    },
    sectionTitle: {
        fontSize: typography.fontSize['2xl'],
        fontFamily: typography.fontFamily.display,
        fontWeight: '700',
        color: colors.text.primary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    sectionSubtitle: {
        fontSize: typography.fontSize.base,
        color: colors.gray[600],
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    features: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    featureCard: {
        width: '47%',
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        alignItems: 'center',
        ...shadow.soft,
        borderWidth: 1,
        borderColor: colors.gray[100],
        marginBottom: spacing.md,
    },
    featureIcon: {
        width: 50,
        height: 50,
        borderRadius: borderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    featureTitle: {
        fontSize: typography.fontSize.sm,
        fontFamily: typography.fontFamily.bold,
        textAlign: 'center',
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    featureDescription: {
        fontSize: typography.fontSize.xs,
        color: colors.gray[600],
        textAlign: 'center',
        lineHeight: typography.lineHeight.relaxed * typography.fontSize.xs,
    },
});

export default HowItWorksScreen;
