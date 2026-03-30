import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography, textStyles } from '../../constants/typography';
import { spacing, borderRadius, shadow } from '../../constants/spacing';
import { LinearGradient } from 'expo-linear-gradient';
import useCartStore from '../../stores/cartStore';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }: any) => {
    const product = route.params?.product;
    const insets = useSafeAreaInsets();
    const [quantity, setQuantity] = useState(1);
    const { addItem } = useCartStore();

    if (!product) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Product information missing</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
                    <Text style={{ color: colors.primary[600] }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const currentPrice = Number(product.price || product.basePrice || 0);

    const handleAddToCart = () => {
        try {
            const ingredient = {
                id: product.id || `unknown-${Date.now()}`,
                name: String(product.name || 'Product'),
                price: currentPrice,
                unit: String(product.weight || product.unit || ''),
                image: String(product.image || ''),
                category: String(product.category || 'general'),
                bulkTiers: product.bulkTiers
            };
            addItem(ingredient as any, quantity);
            navigation.goBack();
        } catch (error) {
            console.error('Add to cart error:', error);
            navigation.goBack();
        }
    };

    const handleBack = () => {
        const state = navigation.getState();
        const routes = state?.routes || [];
        const previousRoute = routes.length > 1 ? routes[routes.length - 2] : null;

        // If previous screen was part of the product flow, go back normally
        if (previousRoute && (previousRoute.name === 'CategoryDetail' || previousRoute.name === 'ProductList')) {
            navigation.goBack();
        } else {
            // Force navigation to the Product Category list
            navigation.navigate('ProductsTab', { screen: 'ProductList' });
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                {/* Hero Image Section */}
                <View style={styles.imageContainer}>
                    {product.image ? (
                        <Image source={{ uri: product.image }} style={styles.image} />
                    ) : (
                        <View style={[styles.image, { backgroundColor: colors.gray[100], justifyContent: 'center', alignItems: 'center' }]}>
                            <Feather name="package" size={60} color={colors.gray[300]} />
                        </View>
                    )}
                    <LinearGradient
                        colors={['rgba(0,0,0,0.1)', 'transparent', 'transparent']}
                        style={StyleSheet.absoluteFill}
                    />

                    {/* Floating Header Actions */}
                    <View style={[styles.headerActions, { top: insets.top + 10 }]}>
                        <TouchableOpacity
                            onPress={handleBack}
                            style={styles.actionButton}
                        >
                            <Feather name="arrow-left" size={24} color={colors.text.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Feather name="share-2" size={22} color={colors.text.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Product Info content */}
                <View style={styles.content}>
                    <View style={styles.mainInfo}>
                        <View style={styles.titleRow}>
                            <Text style={styles.title}>{product.name}</Text>
                            <TouchableOpacity>
                                <Feather name="heart" size={24} color={colors.gray[400]} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.weight}>{product.weight || product.unit || ''}</Text>

                        <View style={styles.priceRow}>
                            <View style={styles.priceStack}>
                                <Text style={styles.price}>₹{currentPrice}</Text>
                                {(Number(product.mrp || 0) > currentPrice) && (
                                    <Text style={styles.mrpText}>₹{Math.round(Number(product.mrp))}</Text>
                                )}
                            </View>
                            {Number(product.mrp || 0) > currentPrice && (
                                <View style={styles.discountBadge}>
                                    <Text style={styles.discountText}>
                                        {Math.round(((Number(product.mrp) - currentPrice) / Number(product.mrp)) * 100)}% OFF
                                    </Text>
                                </View>
                            )}
                        </View>

                        {Array.isArray(product.bulkTiers) && product.bulkTiers.length > 0 && (
                            <View style={styles.bulkSection}>
                                <Text style={styles.bulkTitle}>Bulk Pricing for Businesses</Text>
                                <View style={styles.bulkTiersGrid}>
                                    {product.bulkTiers.slice(1, 3).map((tier: any, idx: number) => {
                                        if (!tier || !tier.price || !tier.quantity) return null;
                                        const qtyNum = parseInt(String(tier.quantity)) || 1;
                                        const tierPrice = Number(tier.price) || 0;
                                        const unitPrice = qtyNum > 0 ? Math.round(tierPrice / qtyNum) : 0;
                                        const basePriceForCalc = currentPrice || 1; // Avoid div by zero
                                        const savingsPercent = Math.round((1 - (tierPrice / (basePriceForCalc * qtyNum))) * 100);

                                        return (
                                            <View key={idx} style={styles.bulkTierCard}>
                                                <View style={styles.tierHeader}>
                                                    <Text style={styles.tierQty}>{tier.quantity || 'Unit'}</Text>
                                                    {isFinite(savingsPercent) && savingsPercent > 0 && (
                                                        <View style={styles.savingsPill}>
                                                            <Text style={styles.savingsText}>Save {savingsPercent}%</Text>
                                                        </View>
                                                    )}
                                                </View>
                                                <Text style={styles.tierPrice}>₹{tierPrice}</Text>
                                                <Text style={styles.unitPrice}>₹{unitPrice} / unit</Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        )}
                    </View>

                    <View style={styles.divider} />

                    {/* Highlights Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Product Highlights</Text>
                        <View style={styles.highlightsGrid}>
                            <HighlightItem icon="star" label="Premium Quality" />
                            <HighlightItem icon="truck" label="10 Min Delivery" />
                            <HighlightItem icon="shield" label="Safe & Hygienic" />
                            <HighlightItem icon="sun" label="Natural & Fresh" />
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Description Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Product Description</Text>
                        <Text style={styles.description}>
                            This is a premium quality {(product.name || 'product').toLowerCase()} sourced directly from the finest local farms.
                            Our products undergo rigorous quality checks to ensure you receive the freshest produce every time.
                            Perfect for your daily meals and healthy lifestyle.
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Nutritional Value */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Nutritional Value (per 100g)</Text>
                        <View style={styles.nutritionTable}>
                            <NutritionRow label="Calories" value={product.nutrition?.calories || '45 kcal'} />
                            <NutritionRow label="Total Fat" value={product.nutrition?.fat || '0.5g'} />
                            <NutritionRow label="Carbohydrates" value={product.nutrition?.carbs || '9.2g'} />
                            <NutritionRow label="Protein" value={product.nutrition?.protein || '1.1g'} />
                        </View>
                    </View>

                    <View style={{ height: 120 }} />
                </View>
            </ScrollView>

            {/* Sticky Footer */}
            <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                        <Feather name="minus" size={20} color={colors.primary[600]} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{quantity}</Text>
                    <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => setQuantity(quantity + 1)}
                    >
                        <Feather name="plus" size={20} color={colors.primary[600]} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart}>
                    <Text style={styles.addBtnText}>Add to Cart • ₹{currentPrice * quantity}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const HighlightItem = ({ icon, label }: any) => (
    <View style={styles.highlightItem}>
        <View style={styles.highlightIcon}>
            <Feather name={icon} size={16} color={colors.primary[600]} />
        </View>
        <Text style={styles.highlightLabel}>{label}</Text>
    </View>
);

const NutritionRow = ({ label, value }: any) => (
    <View style={styles.nutritionRow}>
        <Text style={styles.nutritionLabel}>{label}</Text>
        <Text style={styles.nutritionValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    imageContainer: {
        width: width,
        height: width * 0.9,
        backgroundColor: colors.gray[50],
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    headerActions: {
        position: 'absolute',
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        ...shadow.soft,
    },
    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
    },
    mainInfo: {
        marginBottom: spacing.md,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: typography.fontSize['3xl'],
        fontWeight: '800',
        color: colors.text.primary,
        flex: 1,
        marginRight: spacing.md,
    },
    weight: {
        fontSize: typography.fontSize.lg,
        color: colors.gray[500],
        marginTop: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.md,
        gap: 12,
    },
    price: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: '800',
        color: colors.text.primary,
    },
    priceStack: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    mrpText: {
        fontSize: typography.fontSize.lg,
        color: colors.gray[400],
        textDecorationLine: 'line-through',
        fontFamily: typography.fontFamily.body,
    },
    bulkSection: {
        marginTop: 16,
        backgroundColor: colors.gray[50],
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.gray[200],
    },
    bulkTitle: {
        fontSize: typography.fontSize.xsMedium,
        fontFamily: typography.fontFamily.bold,
        color: colors.gray[600],
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    bulkTiersGrid: {
        flexDirection: 'row',
        gap: 10,
    },
    bulkTierCard: {
        flex: 1,
        backgroundColor: colors.white,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.gray[200],
        ...shadow.soft,
    },
    tierHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    tierQty: {
        fontSize: typography.fontSize.base,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
    },
    savingsPill: {
        backgroundColor: colors.accent[50],
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 4,
    },
    savingsText: {
        fontSize: typography.fontSize.xxxs,
        fontFamily: typography.fontFamily.bold,
        color: colors.accent[700],
    },
    tierPrice: {
        fontSize: typography.fontSize.lg,
        fontFamily: typography.fontFamily.bold,
        color: colors.primary[600],
    },
    unitPrice: {
        fontSize: typography.fontSize.xxs,
        color: colors.gray[500],
        fontFamily: typography.fontFamily.medium,
    },
    discountBadge: {
        backgroundColor: colors.accent[50],
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.accent[100],
    },
    discountText: {
        color: colors.accent[700],
        fontSize: typography.fontSize.xsMedium,
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: colors.gray[100],
        marginVertical: spacing.lg,
    },
    section: {
        marginBottom: spacing.xs,
    },
    sectionTitle: {
        ...textStyles.h2,
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    highlightsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    highlightItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.gray[50],
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 30,
        gap: 8,
    },
    highlightIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadow.soft,
    },
    highlightLabel: {
        fontSize: typography.fontSize.xsMedium,
        fontWeight: '600',
        color: colors.gray[700],
    },
    description: {
        fontSize: typography.fontSize.base,
        color: colors.gray[600],
        lineHeight: 22,
    },
    nutritionTable: {
        backgroundColor: colors.gray[50],
        borderRadius: borderRadius.lg,
        padding: spacing.md,
    },
    nutritionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.03)',
    },
    nutritionLabel: {
        fontSize: typography.fontSize.base,
        color: colors.gray[600],
    },
    nutritionValue: {
        fontSize: typography.fontSize.base,
        fontWeight: '600',
        color: colors.text.primary,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.white,
        paddingHorizontal: spacing.lg,
        paddingTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        ...shadow.hard,
        borderTopWidth: 1,
        borderTopColor: colors.gray[100],
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary[50],
        borderRadius: 12,
        padding: 4,
    },
    qtyBtn: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    qtyText: {
        fontSize: typography.fontSize.lg,
        fontWeight: '700',
        color: colors.primary[700],
        minWidth: 30,
        textAlign: 'center',
    },
    addBtn: {
        flex: 1,
        backgroundColor: colors.primary[600],
        height: 54,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadow.medium,
    },
    addBtnText: {
        color: colors.white,
        fontSize: typography.fontSize.lg,
        fontWeight: '700',
    },
});

export default ProductDetailScreen;
