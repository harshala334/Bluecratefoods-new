import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius, shadow } from '../../constants/spacing';

interface AddressDetailModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (details: {
        houseNo: string;
        floor?: string;
        landmark?: string;
        label: 'Home' | 'Work' | 'Other';
    }) => void;
    baseAddress: string;
}

export const AddressDetailModal = ({ visible, onClose, onSave, baseAddress }: AddressDetailModalProps) => {
    const [houseNo, setHouseNo] = useState('');
    const [floor, setFloor] = useState('');
    const [landmark, setLandmark] = useState('');
    const [label, setLabel] = useState<'Home' | 'Work' | 'Other'>('Home');

    const handleSave = () => {
        if (!houseNo) return;
        onSave({ houseNo, floor, landmark, label });
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}
                >
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Enter Address Details</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Feather name="x" size={24} color={colors.text.primary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.locationSummary}>
                                <Feather name="map-pin" size={20} color={colors.primary[600]} />
                                <Text style={styles.baseAddress} numberOfLines={2}>{baseAddress}</Text>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>HOUSE / FLAT / BLOCK NO.</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. 402, Block A"
                                    value={houseNo}
                                    onChangeText={setHouseNo}
                                    placeholderTextColor={colors.gray[400]}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>FLOOR (OPTIONAL)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. 4th Floor"
                                    value={floor}
                                    onChangeText={setFloor}
                                    placeholderTextColor={colors.gray[400]}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>LANDMARK (OPTIONAL)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. Near HDFC Bank"
                                    value={landmark}
                                    onChangeText={setLandmark}
                                    placeholderTextColor={colors.gray[400]}
                                />
                            </View>

                            <View style={styles.labelGroup}>
                                <Text style={styles.inputLabel}>SAVE AS</Text>
                                <View style={styles.labelButtons}>
                                    {(['Home', 'Work', 'Other'] as const).map((l) => (
                                        <TouchableOpacity
                                            key={l}
                                            style={[
                                                styles.labelButton,
                                                label === l && styles.labelButtonActive
                                            ]}
                                            onPress={() => setLabel(l)}
                                        >
                                            <Feather 
                                                name={l === 'Home' ? 'home' : l === 'Work' ? 'briefcase' : 'map-pin'} 
                                                size={16} 
                                                color={label === l ? colors.white : colors.gray[600]} 
                                            />
                                            <Text style={[
                                                styles.labelText,
                                                label === l && styles.labelTextActive
                                            ]}>{l}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <TouchableOpacity 
                                style={[styles.saveButton, !houseNo && styles.saveButtonDisabled]}
                                onPress={handleSave}
                                disabled={!houseNo}
                            >
                                <Text style={styles.saveButtonText}>Save Address</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
    },
    content: {
        padding: spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: typography.fontSize.lg,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
    },
    closeButton: {
        padding: 4,
    },
    locationSummary: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.gray[50],
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        gap: spacing.sm,
        marginBottom: spacing.xl,
    },
    baseAddress: {
        flex: 1,
        fontSize: typography.fontSize.sm,
        color: colors.gray[600],
        fontFamily: typography.fontFamily.medium,
    },
    inputGroup: {
        marginBottom: spacing.lg,
    },
    inputLabel: {
        fontSize: 10,
        fontFamily: typography.fontFamily.bold,
        color: colors.gray[500],
        marginBottom: 8,
        letterSpacing: 1,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[200],
        paddingVertical: 8,
        fontSize: typography.fontSize.base,
        fontFamily: typography.fontFamily.medium,
        color: colors.text.primary,
    },
    labelGroup: {
        marginBottom: spacing.xl,
    },
    labelButtons: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    labelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.gray[200],
        gap: 6,
    },
    labelButtonActive: {
        backgroundColor: colors.primary[600],
        borderColor: colors.primary[600],
    },
    labelText: {
        fontSize: typography.fontSize.sm,
        fontFamily: typography.fontFamily.semibold,
        color: colors.gray[600],
    },
    labelTextActive: {
        color: colors.white,
    },
    saveButton: {
        backgroundColor: colors.primary[600],
        paddingVertical: 16,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        marginTop: spacing.sm,
        ...shadow.medium,
    },
    saveButtonDisabled: {
        backgroundColor: colors.gray[300],
    },
    saveButtonText: {
        color: colors.white,
        fontSize: typography.fontSize.base,
        fontFamily: typography.fontFamily.bold,
    },
});
