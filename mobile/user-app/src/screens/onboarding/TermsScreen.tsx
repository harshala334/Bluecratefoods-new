import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

const TermsScreen = ({ navigation }: any) => {
    const [agreed, setAgreed] = useState(false);

    const handleNext = () => {
        if (agreed) {
            navigation.navigate('ProfileSetup');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Ionicons name="document-text-outline" size={80} color={colors.primary[500]} />
                    <Text style={styles.title}>Accept Eatee's Terms & Review Privacy Notice</Text>
                </View>

                <View style={styles.body}>
                    <Text style={styles.description}>
                        By selecting "I Agree" below, I have reviewed and agree to the{' '}
                        <Text style={styles.linkText}>Terms of Use</Text> and acknowledge the{' '}
                        <Text style={styles.linkText}>Privacy Notice</Text>. I am at least 18 years of age.
                    </Text>
                </View>

                <View style={styles.footer}>
                    <View style={styles.divider} />

                    <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => setAgreed(!agreed)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.checkboxLabel}>I Agree</Text>
                        <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
                            {agreed && <Feather name="check" size={16} color="white" />}
                        </View>
                    </TouchableOpacity>

                    <View style={styles.navigationButtons}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}
                        >
                            <Feather name="arrow-left" size={24} color={colors.text.primary} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.nextButton,
                                !agreed && styles.nextButtonDisabled
                            ]}
                            onPress={handleNext}
                            disabled={!agreed}
                        >
                            <Text style={[styles.nextButtonText, !agreed && styles.nextButtonTextDisabled]}>Next</Text>
                            <Feather
                                name="arrow-right"
                                size={20}
                                color={agreed ? "white" : colors.gray[400]}
                                style={styles.arrowIcon}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    header: {
        marginTop: 60,
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.text.primary,
        marginTop: 24,
        lineHeight: 36,
    },
    body: {
        marginTop: 32,
    },
    description: {
        fontSize: 16,
        color: colors.text.secondary || colors.gray[600],
        lineHeight: 24,
    },
    linkText: {
        color: colors.primary[500],
        fontWeight: '500',
    },
    footer: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 20,
    },
    divider: {
        height: 1,
        backgroundColor: colors.gray[100],
        marginBottom: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    checkboxLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text.primary,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: colors.gray[300],
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxActive: {
        backgroundColor: colors.primary[500],
        borderColor: colors.primary[500],
    },
    navigationButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.gray[100],
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextButton: {
        backgroundColor: colors.primary[500],
        height: 56,
        borderRadius: 28,
        paddingHorizontal: 32,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 140,
    },
    nextButtonDisabled: {
        backgroundColor: colors.gray[100],
    },
    nextButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    nextButtonTextDisabled: {
        color: colors.gray[400],
    },
    arrowIcon: {
        marginLeft: 8,
    },
});

export default TermsScreen;
