import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ImageBackground,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography, textStyles } from '../../constants/typography';
import { spacing, borderRadius, shadow } from '../../constants/spacing';
import { KittyChatSearchBar } from '../../components/common/KittyChatSearchBar';
import { VerticalProductCard } from '../../components/product/VerticalProductCard';
import { Recipe } from '../../types/recipe';

const { width: windowWidth } = Dimensions.get('window');

import { CATEGORY_DATA } from '../../constants/categories';

const ProductListScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const [searchResults, setSearchResults] = useState<Recipe[]>([]);

    const handleCategoryPress = (categoryId: string, subCategoryId?: string) => {
        navigation.navigate('CategoryDetail', {
            categoryId,
            categoryTitle: CATEGORY_DATA.find(c => c.id === categoryId)?.title || 'Products',
            selectedSubId: subCategoryId || 'all'
        });
    };

    const renderSection = (section: any) => (
        <View key={section.id} style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
                <View>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
                </View>
                <TouchableOpacity
                    style={styles.viewAllButton}
                    onPress={() => handleCategoryPress(section.id)}
                >
                    <Text style={styles.viewAllText}>View All</Text>
                    <Feather name="chevron-right" size={16} color={colors.primary[600]} />
                </TouchableOpacity>
            </View>

            <View style={styles.subcategoryGrid}>
                {section.subcategories.filter((s: any) => s.id !== 'all').map((sub: any) => (
                    <TouchableOpacity
                        key={sub.id}
                        style={styles.subCard}
                        onPress={() => handleCategoryPress(section.id, sub.id)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.subIconContainer}>
                            <Text style={styles.subIconText}>{sub.icon}</Text>
                        </View>
                        <Text style={styles.subName} numberOfLines={2}>{sub.name}</Text>
                    </TouchableOpacity>
                ))}
                {/* Placeholder for grid alignment */}
                {section.subcategories.filter((s: any) => s.id !== 'all').length % 3 !== 0 &&
                    Array(3 - (section.subcategories.filter((s: any) => s.id !== 'all').length % 3)).fill(0).map((_, i) => (
                        <View key={`placeholder-${i}`} style={[styles.subCard, { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0, borderWidth: 0 }]} />
                    ))
                }
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right']}>
            {/* Fixed Header Section */}
            <View style={{ backgroundColor: colors.background.primary, paddingTop: insets.top + spacing.md }}>
                {/* Hero / Welcome */}
                <View style={styles.hero}>
                    <View style={styles.welcomeTextGroup}>
                        <Text style={styles.welcomeText}>Explore our premium</Text>
                        <Text style={styles.brandText}>Storefront</Text>
                    </View>
                </View>

                {/* Search Container - Fixed wrapper for bar and results */}
                <View style={styles.stickySearchWrapper}>
                    <View style={styles.searchContainer}>
                        <KittyChatSearchBar
                            navigation={navigation}
                            onSearchResults={(results) => setSearchResults(results)}
                        />
                    </View>

                    {/* Search Results Overlay */}
                    {searchResults.length > 0 && (
                        <View style={styles.resultsOverlay}>
                            <View style={styles.resultsHeader}>
                                <Text style={styles.resultsTitle}>Found {searchResults.length} items</Text>
                                <TouchableOpacity onPress={() => setSearchResults([])}>
                                    <Ionicons name="close-circle" size={24} color={colors.gray[400]} />
                                </TouchableOpacity>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.resultsScroll}>
                                {searchResults.map((product) => (
                                    <View key={product.id} style={{ marginRight: 12 }}>
                                        <VerticalProductCard
                                            product={product}
                                            width={160}
                                            onPress={() => navigation.navigate('RecipeDetail', { recipeId: product.id })}
                                        />
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>

                {/* Promo Banner */}
                <View style={styles.bannerContainer}>
                    <LinearGradient
                        colors={['#FF7043', '#F4511E']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.promoBanner}
                    >
                        <View style={styles.promoContent}>
                            <Text style={styles.promoTitle}>Flash Sale! ⚡</Text>
                            <Text style={styles.promoSubtitle}>Up to 40% off on exotic veggies</Text>
                        </View>
                        <MaterialCommunityIcons name="basket-outline" size={40} color="rgba(255,255,255,0.3)" />
                    </LinearGradient>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Main Sections */}
                <View style={{ marginTop: spacing.sm }}>
                    {CATEGORY_DATA.map(renderSection)}
                </View>


                {/* Bottom Trust Section */}
                <View style={styles.trustSection}>
                    <Text style={styles.trustTitle}>Why shop with BlueCrate?</Text>
                    <View style={styles.trustGrid}>
                        <View style={styles.trustItem}>
                            <View style={styles.trustIconCircle}>
                                <Ionicons name="flash-outline" size={20} color={colors.primary[600]} />
                            </View>
                            <Text style={styles.trustText}>10 Min Delivery</Text>
                        </View>
                        <View style={styles.trustItem}>
                            <View style={styles.trustIconCircle}>
                                <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary[600]} />
                            </View>
                            <Text style={styles.trustText}>Quality Checked</Text>
                        </View>
                        <View style={styles.trustItem}>
                            <View style={styles.trustIconCircle}>
                                <Ionicons name="leaf-outline" size={20} color={colors.primary[600]} />
                            </View>
                            <Text style={styles.trustText}>Farm Fresh</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    hero: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xs,
    },
    welcomeTextGroup: {
        marginBottom: spacing.xs,
    },
    welcomeText: {
        fontSize: 24,
        color: colors.text.secondary,
        fontFamily: typography.fontFamily.medium,
    },
    brandText: {
        fontSize: 32,
        color: colors.primary[600],
        fontFamily: typography.fontFamily.bold,
        marginTop: -8,
    },
    searchContainer: {
        backgroundColor: colors.background.primary,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xs,
        paddingBottom: spacing.sm,
    },
    stickySearchWrapper: {
        backgroundColor: colors.background.primary,
        zIndex: 10,
    },
    resultsOverlay: {
        backgroundColor: colors.white,
        marginHorizontal: spacing.sm,
        borderRadius: 20,
        paddingVertical: spacing.md,
        marginBottom: spacing.lg,
        ...shadow.soft,
    },
    resultsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.sm,
    },
    resultsTitle: {
        fontSize: 16,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
    },
    resultsScroll: {
        paddingHorizontal: spacing.lg,
    },
    bannerContainer: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.xl,
    },
    promoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.lg,
        borderRadius: 20,
        ...shadow.medium,
    },
    promoContent: {
        flex: 1,
    },
    promoTitle: {
        fontSize: 18,
        fontFamily: typography.fontFamily.bold,
        color: colors.white,
    },
    promoSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.9)',
        fontFamily: typography.fontFamily.medium,
        marginTop: 2,
    },
    sectionContainer: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
    },
    sectionSubtitle: {
        fontSize: 12,
        color: colors.gray[500],
        fontFamily: typography.fontFamily.medium,
        marginTop: 2,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    viewAllText: {
        fontSize: 14,
        color: colors.primary[600],
        fontFamily: typography.fontFamily.bold,
    },
    subcategoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    subCard: {
        width: (windowWidth - spacing.lg * 2 - 24) / 3,
        backgroundColor: colors.white,
        padding: spacing.md,
        borderRadius: 16,
        alignItems: 'center',
        ...shadow.soft,
    },
    subIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.gray[50],
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    subIconText: {
        fontSize: 22,
    },
    subName: {
        fontSize: 11,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
        textAlign: 'center',
    },
    trustSection: {
        backgroundColor: colors.white,
        marginHorizontal: spacing.sm,
        borderRadius: 20,
        padding: spacing.xl,
        marginVertical: spacing.xl,
        alignItems: 'center',
        ...shadow.soft,
    },
    trustTitle: {
        fontSize: 16,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
        marginBottom: spacing.lg,
    },
    trustGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    trustItem: {
        alignItems: 'center',
        gap: 8,
    },
    trustIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadow.soft,
    },
    trustText: {
        fontSize: 10,
        fontFamily: typography.fontFamily.bold,
        color: colors.gray[600],
    }
});

export default ProductListScreen;
