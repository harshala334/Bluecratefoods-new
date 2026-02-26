import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { authService } from '../../services/authService';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { Feather } from '@expo/vector-icons';
import { recipeService } from '../../services/recipeService';
import Toast from 'react-native-toast-message'; // Assuming Toast is imported from here

export const AddRecipeScreen = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        image: '',
        time: '',
        difficulty: 'Easy',
        servings: '2',
        description: '',
        category: '10min',
        basePrice: '',
        videoUrl: '',
    });

    const [ingredientsText, setIngredientsText] = useState('');
    const [stepsText, setStepsText] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');

    const difficultyOptions = ['Easy', 'Medium', 'Hard'];

    const handlePickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [16, 9],
                quality: 0.5,
            });

            if (!result.canceled) {
                setUploading(true);
                try {
                    const uploadedUrl = await authService.uploadImage(result.assets[0].uri);
                    setForm({ ...form, image: uploadedUrl });
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
            Toast.show({
                type: 'error',
                text1: 'Picker Error',
                text2: 'Could not access image library',
                position: 'bottom',
            });
        }
    };

    const addTag = () => {
        if (currentTag.trim()) {
            if (!tags.includes(currentTag.trim())) {
                setTags([...tags, currentTag.trim()]);
            }
            setCurrentTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async () => {
        if (!form.name || !form.description || !ingredientsText || !stepsText) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);

            // Parse ingredients (simple line split for now)
            const ingredients = ingredientsText.split('\n').filter(i => i.trim()).map((ing, index) => ({
                id: index + 1,
                name: ing,
                amount: 1, // Default
                unit: 'pc',
                price: 0,
                category: 'Other'
            }));

            // Parse steps
            const steps = stepsText.split('\n').filter(s => s.trim()).map((step, index) => ({
                id: index + 1,
                title: `Step ${index + 1}`,
                description: step,
                time: 5
            }));

            await recipeService.createRecipe({
                ...form,
                difficulty: form.difficulty as any,
                servings: parseInt(form.servings) || 2,
                basePrice: parseFloat(form.basePrice) || 10,
                ingredients,
                steps,
                nutrition: { calories: 500, protein: 20, carbs: 50, fat: 20 }, // Default values
                utensils: [],
                tags,
                videoUrl: form.videoUrl,
            });

            Alert.alert('Success', 'Recipe submitted for approval! It will be visible once reviewed.', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to save recipe');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Add New Recipe</Text>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Recipe Name *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., Spicy Chicken Wings"
                    value={form.name}
                    onChangeText={(t) => setForm({ ...form, name: t })}
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Description *</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Describe your delicious dish..."
                    multiline
                    numberOfLines={3}
                    value={form.description}
                    onChangeText={(t) => setForm({ ...form, description: t })}
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Tags</Text>
                <View style={styles.tagInputContainer}>
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="Add tag (e.g. #vegan)"
                        value={currentTag}
                        onChangeText={setCurrentTag}
                        onSubmitEditing={addTag}
                    />
                    <TouchableOpacity style={styles.addTagBtn} onPress={addTag}>
                        <Feather name="plus" size={20} color={colors.white} />
                    </TouchableOpacity>
                </View>
                <View style={styles.tagsContainer}>
                    {tags.map((tag, index) => (
                        <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>#{tag.replace(/^#/, '')}</Text>
                            <TouchableOpacity onPress={() => removeTag(tag)}>
                                <Feather name="x" size={14} color={colors.primary[600]} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.row}>
                <View style={[styles.formGroup, { flex: 1, marginRight: spacing.md }]}>
                    <Text style={styles.label}>Time (e.g. 30 min)</Text>
                    <TextInput
                        style={styles.input}
                        value={form.time}
                        onChangeText={(t) => setForm({ ...form, time: t })}
                    />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Servings</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={form.servings}
                        onChangeText={(t) => setForm({ ...form, servings: t })}
                    />
                </View>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Difficulty</Text>
                <View style={styles.radioGroup}>
                    {difficultyOptions.map((opt) => (
                        <TouchableOpacity
                            key={opt}
                            style={[styles.radioBtn, form.difficulty === opt && styles.radioBtnActive]}
                            onPress={() => setForm({ ...form, difficulty: opt })}
                        >
                            <Text style={[styles.radioText, form.difficulty === opt && styles.radioTextActive]}>{opt}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Ingredients (One per line) *</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="2 Eggs&#10;1 Cup Flour&#10;..."
                    multiline
                    numberOfLines={5}
                    value={ingredientsText}
                    onChangeText={setIngredientsText}
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Steps (One per line) *</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Mix ingredients&#10;Bake at 350F&#10;..."
                    multiline
                    numberOfLines={5}
                    value={stepsText}
                    onChangeText={setStepsText}
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Video Tutorial (YouTube Link - Optional)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={form.videoUrl}
                    onChangeText={(t) => setForm({ ...form, videoUrl: t })}
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Recipe Image</Text>
                <TouchableOpacity onPress={handlePickImage} disabled={uploading}>
                    {form.image ? (
                        <Image source={{ uri: form.image }} style={styles.imagePreview} />
                    ) : (
                        <View style={[styles.imagePreview, styles.placeholder]}>
                            {uploading ? (
                                <ActivityIndicator color={colors.primary[500]} />
                            ) : (
                                <Text style={styles.uploadText}>+ Upload Photo</Text>
                            )}
                        </View>
                    )}
                </TouchableOpacity>
                {uploading && <Text style={styles.uploadingText}>Uploading...</Text>}
            </View>

            <TouchableOpacity
                style={[styles.submitBtn, loading && styles.disabledBtn]}
                onPress={handleSubmit}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.submitBtnText}>Publish Recipe</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.gray[50],
    },
    content: {
        padding: spacing.lg,
    },
    title: {
        fontSize: typography.fontSize['2xl'],
        fontFamily: typography.fontFamily.bold,
        marginBottom: spacing.xl,
        color: colors.text.primary,
    },
    formGroup: {
        marginBottom: spacing.lg,
    },
    inputGroup: {
        marginBottom: spacing.lg,
    },
    label: {
        fontSize: typography.fontSize.sm,
        fontFamily: typography.fontFamily.medium,
        color: colors.gray[700],
        marginBottom: spacing.xs,
    },
    input: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.gray[300],
        borderRadius: borderRadius.md,
        padding: spacing.md,
        fontSize: typography.fontSize.base,
        color: colors.text.primary,
    },
    textArea: {
        height: 100,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
    },
    instructionRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.gray[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    placeholder: {
        borderWidth: 2,
        borderColor: colors.gray[300],
        borderStyle: 'dashed',
    },
    uploadText: {
        color: colors.primary[600],
        fontFamily: typography.fontFamily.medium,
        fontSize: typography.fontSize.lg,
    },
    uploadingText: {
        color: colors.gray[500],
        fontSize: typography.fontSize.sm,
        textAlign: 'center',
    },
    radioGroup: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    radioBtn: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.gray[300],
        backgroundColor: colors.white,
    },
    radioBtnActive: {
        backgroundColor: colors.primary[500],
        borderColor: colors.primary[500],
    },
    radioText: {
        color: colors.gray[600],
    },
    radioTextActive: {
        color: colors.white,
        fontWeight: 'bold',
    },
    submitBtn: {
        backgroundColor: colors.primary[600],
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        marginTop: spacing.md,
    },
    disabledBtn: {
        opacity: 0.7,
    },
    submitBtnText: {
        color: colors.white,
        fontSize: typography.fontSize.lg,
        fontWeight: 'bold',
    },
    tagInputContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    addTagBtn: {
        backgroundColor: colors.primary[600],
        justifyContent: 'center',
        alignItems: 'center',
        width: 44,
        borderRadius: borderRadius.md,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary[50],
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        borderRadius: borderRadius.full,
        gap: spacing.xs,
        borderWidth: 1,
        borderColor: colors.primary[100],
    },
    tagText: {
        fontSize: typography.fontSize.sm,
        color: colors.primary[700],
        fontFamily: typography.fontFamily.medium,
    },
});

export default AddRecipeScreen;
