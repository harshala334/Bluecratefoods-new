import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

const ProfileSetupScreen = ({ navigation }: any) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    const handleFinish = () => {
        if (firstName && lastName) {
            navigation.navigate('LocationPermission');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                                <Feather name="arrow-left" size={24} color={colors.text.primary} />
                            </TouchableOpacity>
                            <Text style={styles.title}>Set up your profile</Text>
                            <Text style={styles.subtitle}>Help us personalize your experience</Text>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>First Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="John"
                                    value={firstName}
                                    onChangeText={setFirstName}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Last Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Doe"
                                    value={lastName}
                                    onChangeText={setLastName}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email Address (Optional)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="john.doe@example.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                        </View>

                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={[
                                    styles.finishButton,
                                    (!firstName || !lastName) && styles.finishButtonDisabled
                                ]}
                                onPress={handleFinish}
                                disabled={!firstName || !lastName}
                            >
                                <Text style={styles.finishButtonText}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    header: {
        marginTop: 20,
        marginBottom: 40,
    },
    backButton: {
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.gray[500],
    },
    form: {
        gap: 24,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.gray[700],
    },
    input: {
        height: 56,
        borderWidth: 1,
        borderColor: colors.gray[200],
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: colors.text.primary,
        backgroundColor: colors.gray[50],
    },
    footer: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 20,
    },
    finishButton: {
        backgroundColor: colors.primary[500],
        height: 58,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    finishButtonDisabled: {
        backgroundColor: colors.gray[300],
    },
    finishButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
});

export default ProfileSetupScreen;
