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
    const { product } = route.params;
    const insets = useSafeAreaInsets();
    const [quantity, setQuantity] = useState(1);
    const { addItem } = useCartStore();

    const handleAddToCart = () => {
        const ingredient = {
            id: product.id,
            name: product.name,
            price: product.price,
            unit: product.weight,
            image: product.image,
            category: product.category || 'general',
        };
        addItem(ingredient as any, quantity);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                {/* Hero Image Section */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: product.image }} style={styles.image} />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.1)', 'transparent', 'transparent']}
                        style={StyleSheet.absoluteFill}
                    />

                    {/* Floating Header Actions */}
                    <View style={[styles.headerActions, { top: insets.top + 10 }]}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
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
                        <Text style={styles.weight}>{product.weight}</Text>

                        <View style={styles.priceRow}>
                            <View style={styles.priceStack}>
                                <Text style={styles.price}>₹{product.price || product.basePrice}</Text>
                                {(product.mrp || (product.price * 1.2)) > (product.price || product.basePrice) && (
                                    <Text style={styles.mrpText}>₹{Math.round(product.mrp || (product.price * 1.2))}</Text>
                                )}
                            </View>
                            <View style={styles.discountBadge}>
                                <Text style={styles.discountText}>
                                    {product.mrp
                                        ? Math.round(((product.mrp - (product.price || product.basePrice)) / product.mrp) * 100)
                                        : 20}% OFF
                                </Text>
                            </View>
                        </View>

                        {product.bulkTiers && (
                            <View style={styles.bulkSection}>
                                <Text style={styles.bulkTitle}>Bulk Pricing for Businesses</Text>
                                <View style={styles.bulkTiersGrid}>
                                    {product.bulkTiers.map((tier: any, idx: number) => (
                                        <View key={idx} style={styles.bulkTierCard}>
                                            <View style={styles.tierHeader}>
                                                <Text style={styles.tierQty}>{tier.quantity}</Text>
                                                <View style={styles.savingsPill}>
                                                    <Text style={styles.savingsText}>Save {Math.round((1 - (tier.price / (product.price * (parseInt(tier.quantity) || 1)))) * 100)}%</Text>
                                                </View>
                                            </View>
                                            <Text style={styles.tierPrice}>₹{tier.price}</Text>
                                            <Text style={styles.unitPrice}>₹{Math.round(tier.price / (parseInt(tier.quantity) || 1))} / unit</Text>
                                        </View>
                                    ))}
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
                            This is a premium quality {product.name.toLowerCase()} sourced directly from the finest local farms.
                            Our products undergo rigorous quality checks to ensure you receive the freshest produce every time.
                            Perfect for your daily meals and healthy lifestyle.
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Nutritional Value */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Nutritional Value (per 100g)</Text>
                        <View style={styles.nutritionTable}>
                            <NutritionRow label="Calories" value="45 kcal" />
                            <NutritionRow label="Total Fat" value="0.5g" />
                            <NutritionRow label="Carbohydrates" value="9.2g" />
                            <NutritionRow label="Protein" value="1.1g" />
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
                    <Text style={styles.addBtnText}>Add to Cart • ₹{product.price * quantity}</Text>
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
