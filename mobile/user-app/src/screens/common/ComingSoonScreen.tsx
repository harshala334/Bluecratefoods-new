import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

export const ComingSoonScreen = ({ navigation }: any) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name="rocket-launch-outline" size={60} color={colors.primary[500]} />
                </View>
                <Text style={styles.title}>Coming Soon</Text>
                <Text style={styles.subtitle}>
                    We're building something special for you. This feature will be live in our next update!
                </Text>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Feather name="arrow-left" size={20} color={colors.white} style={{ marginRight: 8 }} />
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        padding: spacing.xl,
        maxWidth: 320,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.primary[50],
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
    },
    title: {
        fontSize: 28,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: colors.gray[500],
        textAlign: 'center',
        lineHeight: 24,
        fontFamily: typography.fontFamily.medium,
        marginBottom: spacing.xl * 1.5,
    },
    backButton: {
        flexDirection: 'row',
        backgroundColor: colors.primary[500],
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
    },
    backButtonText: {
        color: colors.white,
        fontSize: 16,
        fontFamily: typography.fontFamily.bold,
    },
});

export default ComingSoonScreen;
