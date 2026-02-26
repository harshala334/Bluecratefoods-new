import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius, shadow } from '../../constants/spacing';
import { authService } from '../../services/authService';
import { storage } from '../../utils/storage';
import { STORAGE_KEYS } from '../../constants/config';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';

const CreatorApplicationScreen = ({ navigation, route }: any) => {
    const { userId } = route.params;
    const [reason, setReason] = useState('');
    const [socialLinks, setSocialLinks] = useState<string[]>(['']);
    const [loading, setLoading] = useState(false);

    const handleAddLink = () => {
        setSocialLinks([...socialLinks, '']);
    };

    const handleRemoveLink = (index: number) => {
        const newLinks = socialLinks.filter((_, i) => i !== index);
        setSocialLinks(newLinks.length > 0 ? newLinks : ['']);
    };

    const handleUpdateLink = (text: string, index: number) => {
        const newLinks = [...socialLinks];
        newLinks[index] = text;
        setSocialLinks(newLinks);
    };

    const handleSubmit = async () => {
        if (!reason.trim()) {
            Alert.alert('Required', 'Please tell us why you want to become a creator.');
            return;
        }

        const validLinks = socialLinks.filter(link => link.trim() !== '');

        setLoading(true);
        try {
            await authService.applyCreator(userId, reason, validLinks);

            // Optimistically update storage
            try {
                const userData = await storage.getItem(STORAGE_KEYS.USER_DATA) as any;
                if (userData) {
                    userData.creatorStatus = 'pending';
                    await storage.setItem(STORAGE_KEYS.USER_DATA, userData);
                }
            } catch (e) {
                console.log('Failed to update storage optimistically:', e);
            }

            Toast.show({
                type: 'success',
                text1: 'Application Submitted',
                text2: 'Wait for admin approval!',
            });
            navigation.goBack();
        } catch (error) {
            console.error('Submit application error:', error);
            Alert.alert('Error', 'Failed to submit application. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Become a Creator</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.infoCard}>
                    <LinearGradient
                        colors={[colors.primary[500], colors.primary[600]]}
                        style={styles.infoGradient}
                    >
                        <Feather name="award" size={32} color="white" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoTitle}>Join the Community</Text>
                            <Text style={styles.infoSubtitle}>Share your passion, build your brand, and inspire others with your recipes.</Text>
                        </View>
                    </LinearGradient>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Why do you want to join? *</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Tell us about your culinary journey and what you hope to achieve as a BlueCrate creator..."
                        placeholderTextColor={colors.gray[400]}
                        multiline
                        numberOfLines={6}
                        value={reason}
                        onChangeText={setReason}
                        textAlignVertical="top"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Social Presence & Links</Text>
                    <Text style={styles.subLabel}>Add links to your Instagram, YouTube, blog, or portfolio.</Text>

                    {socialLinks.map((link, index) => (
                        <View key={index} style={styles.linkRow}>
                            <View style={styles.inputWrapper}>
                                <Feather name="link" size={16} color={colors.gray[400]} style={styles.linkIcon} />
                                <TextInput
                                    style={styles.linkInput}
                                    placeholder="https:// instagram.com/..."
                                    placeholderTextColor={colors.gray[400]}
                                    value={link}
                                    onChangeText={(text) => handleUpdateLink(text, index)}
                                    autoCapitalize="none"
                                />
                            </View>
                            <TouchableOpacity
                                onPress={() => handleRemoveLink(index)}
                                style={styles.removeCircle}
                            >
                                <Ionicons name="close-circle" size={20} color={colors.error || '#F44336'} />
                            </TouchableOpacity>
                        </View>
                    ))}

                    <TouchableOpacity style={styles.addButton} onPress={handleAddLink}>
                        <Ionicons name="add-circle-outline" size={20} color={colors.primary[500]} />
                        <Text style={styles.addButtonText}>Add another link</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.disabledButton]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <Text style={styles.submitButtonText}>
                        {loading ? 'Submitting...' : 'Submit Application'}
                    </Text>
                </TouchableOpacity>
                <Text style={styles.disclaimer}>
                    By submitting, you agree to our Creator Guidelines and content quality standards.
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const MaterialCommunityIcons = (props: any) => <Ionicons {...props} />; // Fallback if not available

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.gray[50],
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.lg,
        backgroundColor: colors.white,
    },
    backButton: {
        marginRight: spacing.lg,
    },
    headerTitle: {
        fontSize: typography.fontSize.xl,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
    },
    scrollContent: {
        padding: spacing.xl,
    },
    infoCard: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        marginBottom: spacing.xl,
        ...shadow.medium,
    },
    infoGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.xl,
        gap: spacing.lg,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoTitle: {
        fontSize: typography.fontSize.lg,
        fontFamily: typography.fontFamily.bold,
        color: colors.white,
        marginBottom: 4,
    },
    infoSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.9)',
        lineHeight: 18,
    },
    section: {
        marginBottom: spacing.xl,
    },
    label: {
        fontSize: typography.fontSize.base,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    subLabel: {
        fontSize: 12,
        color: colors.gray[500],
        marginBottom: spacing.md,
    },
    textArea: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        fontSize: typography.fontSize.sm,
        color: colors.text.primary,
        minHeight: 140,
        borderWidth: 1,
        borderColor: colors.gray[200],
    },
    linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
        gap: spacing.sm,
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.gray[200],
        paddingHorizontal: spacing.md,
    },
    linkIcon: {
        marginRight: spacing.sm,
    },
    linkInput: {
        flex: 1,
        height: 48,
        fontSize: typography.fontSize.sm,
        color: colors.text.primary,
    },
    removeCircle: {
        padding: 4,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginTop: spacing.xs,
    },
    addButtonText: {
        fontSize: typography.fontSize.sm,
        fontFamily: typography.fontFamily.bold,
        color: colors.primary[500],
    },
    submitButton: {
        backgroundColor: colors.primary[500],
        height: 56,
        borderRadius: borderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.md,
        ...shadow.medium,
    },
    disabledButton: {
        opacity: 0.7,
    },
    submitButtonText: {
        color: colors.white,
        fontSize: typography.fontSize.base,
        fontFamily: typography.fontFamily.bold,
    },
    disclaimer: {
        fontSize: 11,
        color: colors.gray[400],
        textAlign: 'center',
        marginTop: spacing.lg,
        lineHeight: 16,
    }
});

export default CreatorApplicationScreen;
