import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius } from '../../constants/spacing';
import { authService } from '../../services/authService';
import { storage } from '../../utils/storage';
import { STORAGE_KEYS } from '../../constants/config';
import { User } from '../../types/user';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';

export const EditProfileScreen = ({ navigation, route }: any) => {
    const { user } = route.params || {};

    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [profileImage, setProfileImage] = useState(user?.profileImage || '');
    const [backgroundImage, setBackgroundImage] = useState(user?.backgroundImage || '');
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handlePickImage = async (type: 'profile' | 'background') => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: type === 'profile' ? [1, 1] : [16, 9],
                quality: 0.5,
            });

            if (!result.canceled) {
                setUploading(true);
                try {
                    // Upload immediately
                    const uploadedUrl = await authService.uploadImage(result.assets[0].uri);

                    if (type === 'profile') {
                        setProfileImage(uploadedUrl);
                    } else {
                        setBackgroundImage(uploadedUrl);
                    }

                    Toast.show({
                        type: 'success',
                        text1: 'Image uploaded successfully',
                        position: 'bottom',
                    });
                } catch (error) {
                    console.error('Upload error:', error);
                    Toast.show({
                        type: 'error',
                        text1: 'Upload Failed',
                        text2: 'Could not upload image',
                        position: 'bottom',
                    });
                } finally {
                    setUploading(false);
                }
            }
        } catch (error) {
            console.error('Picker error:', error);
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Name is required',
                position: 'bottom',
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await authService.updateProfile(user.id, {
                name,
                bio,
                profileImage,
                backgroundImage,
            });

            // Update local storage with new user data
            // We need to preserve the token, so we get the old token first?
            // Actually AuthResponse contains the token too usually?
            // My backend implementation returns token in generateToken(user) but I need to check if updateProfile returns token.
            // In auth.service.ts, updateProfile returns `user` object but NO token.
            // So I should only update USER_DATA in storage.

            await storage.setItem(STORAGE_KEYS.USER_DATA, response.user);

            Toast.show({
                type: 'success',
                text1: 'Profile Updated',
                position: 'bottom',
            });

            navigation.goBack();
        } catch (error: any) {
            console.error('Update profile error:', error);
            Toast.show({
                type: 'error',
                text1: 'Update Failed',
                text2: error.response?.data?.message || 'Could not update profile',
                position: 'bottom',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            value={name}
                            editable={false}
                            placeholder="Your name"
                            style={[styles.input, styles.disabledInput]}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Bio</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={bio}
                            onChangeText={setBio}
                            placeholder="Tell us about yourself"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Profile Image</Text>
                        <View style={styles.imagePreviewContainer}>
                            {profileImage ? (
                                <Image source={{ uri: profileImage }} style={styles.profilePreview} />
                            ) : (
                                <View style={[styles.profilePreview, styles.placeholder]} />
                            )}
                            <TouchableOpacity
                                style={styles.uploadButton}
                                onPress={() => handlePickImage('profile')}
                                disabled={uploading}
                            >
                                <Text style={styles.uploadButtonText}>
                                    {uploading ? 'Uploading...' : 'Change Photo'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Background Image</Text>
                        <View style={styles.imagePreviewContainer}>
                            {backgroundImage ? (
                                <Image source={{ uri: backgroundImage }} style={styles.background} />
                            ) : (
                                <View style={[styles.backgroundPreview, styles.placeholder]} />
                            )}
                            <TouchableOpacity
                                style={styles.uploadButton}
                                onPress={() => handlePickImage('background')}
                                disabled={uploading}
                            >
                                <Text style={styles.uploadButtonText}>
                                    {uploading ? 'Uploading...' : 'Change Cover'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={colors.white} />
                        ) : (
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        )}
                    </TouchableOpacity>
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
    content: {
        padding: spacing.xl,
    },
    form: {
        gap: spacing.lg,
    },
    inputGroup: {
        gap: spacing.sm,
    },
    label: {
        fontSize: typography.fontSize.base,
        fontFamily: typography.fontFamily.medium,
        color: colors.text.primary,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.gray[300],
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        fontSize: typography.fontSize.base,
        backgroundColor: colors.white,
    },
    disabledInput: {
        backgroundColor: colors.gray[100],
        color: colors.gray[600],
    },
    textArea: {
        minHeight: 100,
    },
    saveButton: {
        backgroundColor: colors.primary[500],
        paddingVertical: spacing.md,
        borderRadius: borderRadius.xl,
        alignItems: 'center',
        marginTop: spacing.md,
    },
    saveButtonText: {
        fontSize: typography.fontSize.lg,
        fontFamily: typography.fontFamily.bold,
        color: colors.white,
    },
    saveButtonDisabled: {
        opacity: 0.7,
    },
    imagePreviewContainer: {
        alignItems: 'center',
        gap: spacing.md,
    },
    profilePreview: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.gray[200],
    },
    backgroundPreview: {
        width: '100%',
        height: 150,
        borderRadius: borderRadius.md,
        backgroundColor: colors.gray[200],
    },
    placeholder: {
        borderWidth: 1,
        borderColor: colors.gray[300],
        borderStyle: 'dashed',
    },
    uploadButton: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        backgroundColor: colors.gray[100],
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.gray[300],
    },
    uploadButtonText: {
        fontSize: typography.fontSize.sm,
        color: colors.text.primary,
        fontFamily: typography.fontFamily.medium,
    },
});

export default EditProfileScreen;
