import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius, shadow } from '../../constants/spacing';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const USER_TYPES = [
    { id: 'individual', label: 'Individual', icon: 'person-outline' },
    { id: 'restaurant', label: 'Restaurant', icon: 'restaurant-outline' },
    { id: 'street_cart', label: 'Street Cart', icon: 'moped-outline' },
    { id: 'shopkeeper', label: 'Shopkeeper', icon: 'storefront-outline' },
];

const DIETARY_TAGS = [
    { id: 'veg', label: 'Vegetarian', icon: 'leaf-outline', color: '#4CAF50' },
    { id: 'vegan', label: 'Vegan', icon: 'flower-outline', color: '#81C784' },
    { id: 'gluten_free', label: 'Gluten-Free', icon: 'basket-outline', color: '#FFB300' },
    { id: 'dairy_free', label: 'Dairy-Free', icon: 'water-outline', color: '#64B5F6' },
    { id: 'keto', label: 'Keto Friendly', icon: 'fitness-outline', color: '#FF7043' },
    { id: 'halal', label: 'Halal', icon: 'checkmark-circle-outline', color: '#BA68C8' },
];

const SOURCING_NEEDS = [
    { id: 'high_volume', label: 'High Volume', icon: 'layers-outline', description: 'Bulk orders for daily operations' },
    { id: 'pre_chopped', label: 'Pre-chopped', icon: 'cut-outline', description: 'Ready-to-use ingredients' },
    { id: 'ready_cook', label: 'Ready-to-cook', icon: 'flame-outline', description: 'Bases and prepared mixtures' },
    { id: 'fresh_produce', label: 'Fresh Produce', icon: 'nutrition-outline', description: 'Daily farm-fresh delivery' },
];

const ALLERGIES = [
    { id: 'peanuts', label: 'Peanuts' },
    { id: 'shellfish', label: 'Shellfish' },
    { id: 'eggs', label: 'Eggs' },
    { id: 'soy', label: 'Soy' },
    { id: 'wheat', label: 'Wheat' },
];

export const DietaryPreferencesScreen = ({ navigation }: any) => {
    const [userType, setUserType] = useState('individual');
    const [selectedTags, setSelectedTags] = useState<string[]>(['veg']);
    const [selectedSourcing, setSelectedSourcing] = useState<string[]>([]);
    const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
    const [showWarnings, setShowWarnings] = useState(true);

    const toggleTag = (id: string) => {
        setSelectedTags(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const toggleSourcing = (id: string) => {
        setSelectedSourcing(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const toggleAllergy = (id: string) => {
        setSelectedAllergies(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    const isBusiness = userType !== 'individual';

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="chevron-left" size={24} color={colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Dietary Preferences</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* User Type Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>I am a...</Text>
                    <View style={styles.userTypeGrid}>
                        {USER_TYPES.map(type => {
                            const isActive = userType === type.id;
                            return (
                                <TouchableOpacity
                                    key={type.id}
                                    style={[styles.userTypeCard, isActive && styles.userTypeCardActive]}
                                    onPress={() => setUserType(type.id)}
                                >
                                    <Ionicons
                                        name={type.icon as any}
                                        size={24}
                                        color={isActive ? colors.primary[600] : colors.gray[400]}
                                    />
                                    <Text style={[styles.userTypeLabel, isActive && styles.userTypeLabelActive]}>
                                        {type.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Intro Card */}
                <LinearGradient
                    colors={isBusiness ? ['#E3F2FD', '#E1F5FE'] : ['#E8F5E9', '#F1F8E9']}
                    style={styles.introCard}
                >
                    <MaterialCommunityIcons
                        name={isBusiness ? "store-outline" : "leaf"}
                        size={32}
                        color={isBusiness ? colors.primary[700] : "#2E7D32"}
                    />
                    <View style={styles.introTextContainer}>
                        <Text style={[styles.introTitle, isBusiness && { color: colors.primary[800] }]}>
                            {isBusiness ? 'Optimize Your Supply' : 'Personalize Your Menu'}
                        </Text>
                        <Text style={[styles.introSubtitle, isBusiness && { color: colors.primary[600] }]}>
                            {isBusiness
                                ? 'We\'ll tailor our inventory to your business needs.'
                                : 'We\'ll highlight recipes that match your lifestyle.'}
                        </Text>
                    </View>
                </LinearGradient>

                {/* Dietary Tags / Menu Focus */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        {isBusiness ? 'Menu Specialization' : 'Dietary Preferences'}
                    </Text>
                    <Text style={styles.sectionSubtitle}>
                        {isBusiness ? 'Help us understand your kitchen focus.' : 'Select what matches your daily diet.'}
                    </Text>
                    <View style={styles.tagGrid}>
                        {DIETARY_TAGS.map(tag => {
                            const isActive = selectedTags.includes(tag.id);
                            return (
                                <TouchableOpacity
                                    key={tag.id}
                                    style={[
                                        styles.tagCard,
                                        isActive && { borderColor: tag.color, backgroundColor: tag.color + '10' }
                                    ]}
                                    onPress={() => toggleTag(tag.id)}
                                >
                                    <Ionicons
                                        name={tag.icon as any}
                                        size={24}
                                        color={isActive ? tag.color : colors.gray[400]}
                                    />
                                    <Text style={[styles.tagLabel, isActive && { color: tag.color, fontWeight: '700' }]}>
                                        {tag.label}
                                    </Text>
                                    {isActive && (
                                        <View style={[styles.checkBadge, { backgroundColor: tag.color }]}>
                                            <Ionicons name="checkmark" size={12} color={colors.white} />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Business-Only Section: Sourcing Needs */}
                {isBusiness && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Sourcing Needs</Text>
                        <Text style={styles.sectionSubtitle}>How can we help your kitchen efficiency?</Text>
                        <View style={styles.sourcingList}>
                            {SOURCING_NEEDS.map(need => {
                                const isActive = selectedSourcing.includes(need.id);
                                return (
                                    <TouchableOpacity
                                        key={need.id}
                                        style={[styles.sourcingCard, isActive && styles.sourcingCardActive]}
                                        onPress={() => toggleSourcing(need.id)}
                                    >
                                        <View style={styles.sourcingInfo}>
                                            <Ionicons
                                                name={need.icon as any}
                                                size={22}
                                                color={isActive ? colors.primary[600] : colors.gray[400]}
                                            />
                                            <View style={{ marginLeft: 12 }}>
                                                <Text style={[styles.sourcingLabel, isActive && styles.sourcingLabelActive]}>
                                                    {need.label}
                                                </Text>
                                                <Text style={styles.sourcingDesc}>{need.description}</Text>
                                            </View>
                                        </View>
                                        <Ionicons
                                            name={isActive ? "checkbox" : "square-outline"}
                                            size={24}
                                            color={isActive ? colors.primary[600] : colors.gray[300]}
                                        />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                )}

                {/* Allergies - More prominent for Individuals */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Allergies & Exclusions</Text>
                    <Text style={styles.sectionSubtitle}>
                        {isBusiness ? 'List ingredients you never use.' : 'Select items you want to avoid.'}
                    </Text>
                    <View style={styles.allergyList}>
                        {ALLERGIES.map(allergy => {
                            const isActive = selectedAllergies.includes(allergy.id);
                            return (
                                <TouchableOpacity
                                    key={allergy.id}
                                    style={[styles.allergyItem, isActive && styles.allergyItemActive]}
                                    onPress={() => toggleAllergy(allergy.id)}
                                >
                                    <Text style={[styles.allergyLabel, isActive && styles.allergyLabelActive]}>
                                        {allergy.label}
                                    </Text>
                                    {isActive && <Ionicons name="close-circle" size={18} color="#D32F2F" />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Settings */}
                {!isBusiness && (
                    <View style={styles.section}>
                        <View style={styles.settingRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.settingLabel}>Show Allergen Warnings</Text>
                                <Text style={styles.settingDesc}>Get alerts when a recipe contains your allergens.</Text>
                            </View>
                            <Switch
                                value={showWarnings}
                                onValueChange={setShowWarnings}
                                trackColor={{ false: colors.gray[200], true: colors.primary[500] }}
                            />
                        </View>
                    </View>
                )}

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.saveButtonText}>Save & Apply Settings</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[50],
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.gray[50],
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
    },
    scrollContent: {
        padding: spacing.lg,
    },
    userTypeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    userTypeCard: {
        flex: 1,
        minWidth: '45%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.gray[50],
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: colors.gray[100],
        gap: 10,
    },
    userTypeCardActive: {
        backgroundColor: colors.primary[50],
        borderColor: colors.primary[300],
    },
    userTypeLabel: {
        fontSize: 14,
        fontFamily: typography.fontFamily.medium,
        color: colors.gray[600],
    },
    userTypeLabelActive: {
        color: colors.primary[700],
        fontWeight: '700',
    },
    introCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        borderRadius: 20,
        marginVertical: spacing.xl,
        gap: spacing.md,
    },
    introTextContainer: {
        flex: 1,
    },
    introTitle: {
        fontSize: 16,
        fontFamily: typography.fontFamily.bold,
        color: '#1B5E20',
    },
    introSubtitle: {
        fontSize: 13,
        color: '#43A047',
        fontFamily: typography.fontFamily.medium,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: colors.gray[500],
        marginBottom: spacing.md,
        fontFamily: typography.fontFamily.medium,
    },
    tagGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    tagCard: {
        width: '48%',
        padding: spacing.md,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: colors.gray[100],
        alignItems: 'center',
        gap: 8,
        position: 'relative',
    },
    tagLabel: {
        fontSize: 14,
        fontFamily: typography.fontFamily.medium,
        color: colors.gray[600],
    },
    checkBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadow.soft,
    },
    sourcingList: {
        gap: 12,
    },
    sourcingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.lg,
        borderRadius: 20,
        backgroundColor: colors.gray[50],
        borderWidth: 1.5,
        borderColor: colors.gray[100],
    },
    sourcingCardActive: {
        backgroundColor: colors.white,
        borderColor: colors.primary[300],
        ...shadow.soft,
    },
    sourcingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    sourcingLabel: {
        fontSize: 16,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
    },
    sourcingLabelActive: {
        color: colors.primary[700],
    },
    sourcingDesc: {
        fontSize: 12,
        color: colors.gray[500],
        marginTop: 2,
    },
    allergyList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    allergyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        backgroundColor: colors.gray[50],
        borderWidth: 1,
        borderColor: colors.gray[100],
        gap: 6,
    },
    allergyItemActive: {
        backgroundColor: '#FFEBEE',
        borderColor: '#EF9A9A',
    },
    allergyLabel: {
        fontSize: 14,
        fontFamily: typography.fontFamily.medium,
        color: colors.gray[600],
    },
    allergyLabelActive: {
        color: '#D32F2F',
        fontWeight: '700',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
    },
    settingLabel: {
        fontSize: 16,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
    },
    settingDesc: {
        fontSize: 13,
        color: colors.gray[500],
        marginTop: 2,
    },
    saveButton: {
        backgroundColor: colors.primary[500],
        paddingVertical: spacing.lg,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        marginTop: spacing.xl,
        marginBottom: spacing.xl,
        ...shadow.medium,
    },
    saveButtonText: {
        color: colors.white,
        fontSize: 16,
        fontFamily: typography.fontFamily.bold,
    },
});

export default DietaryPreferencesScreen;
