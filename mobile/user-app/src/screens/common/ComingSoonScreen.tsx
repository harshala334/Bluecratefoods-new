import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const ComingSoonScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <MaterialCommunityIcons name="rocket" size={60} color={colors.primary[500]} style={styles.icon} />
                <Text style={styles.title}>Coming Soon</Text>
                <Text style={styles.subtitle}>
                    We are working hard to bring this feature to you. Stay tuned!
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        padding: spacing.xl,
        maxWidth: 300,
    },
    icon: {
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: typography.fontSize['3xl'],
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: typography.fontSize.lg,
        color: colors.gray[600],
        textAlign: 'center',
        lineHeight: 24,
    },
});

export default ComingSoonScreen;
