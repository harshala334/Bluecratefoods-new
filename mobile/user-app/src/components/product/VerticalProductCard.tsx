import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { shadow } from '../../constants/spacing';
import useCartStore from '../../stores/cartStore';
import useRecipeStore from '../../stores/recipeStore';

interface VerticalProductCardProps {
    product: any;
    onPress: () => void;
    width: number;
}

export const VerticalProductCard = ({ product, onPress, width }: VerticalProductCardProps) => {
    const { items, addItem, updateQuantityByIngredientId } = useCartStore();
    const { addFrequentItem } = useRecipeStore();

    const currentPrice = Number(product.price || product.basePrice || 0);
    const mrp = Number(product.mrp || 0);
    const savings = mrp > currentPrice ? Math.round(((mrp - currentPrice) / mrp) * 100) : 0;

    const cartItem = items.find(i => i.ingredient.id === product.id);
    const quantity = cartItem?.quantity || 0;

    const isOutOfStock = product.inStock === false;

    const handleAdd = (e: any) => {
        e.stopPropagation();
        if (isOutOfStock) return;
        const ingredient = {
            id: product.id,
            name: product.name,
            price: currentPrice,
            unit: product.unit || product.weight || '',
            image: product.image,
            category: product.category || 'general'
        };
        addItem(ingredient as any, 1);
        addFrequentItem(product);
    };

    const handleIncrement = (e: any) => {
        e.stopPropagation();
        updateQuantityByIngredientId(product.id, quantity + 1);
    };

    const handleDecrement = (e: any) => {
        e.stopPropagation();
        updateQuantityByIngredientId(product.id, quantity - 1);
    };

    const handleAddBulk = (e: any, bulkQuantity: string) => {
        e.stopPropagation();
        if (isOutOfStock) return;

        const qty = parseInt(bulkQuantity) || 1;
        const cartItem = items.find(i => i.ingredient.id === product.id);

        if (!cartItem) {
            const ingredient = {
                id: product.id,
                name: product.name,
                price: currentPrice,
                unit: product.unit || product.weight || '',
                image: product.image,
                category: product.category || 'general'
            };
            addItem(ingredient as any, qty);
            addFrequentItem(product);
        } else {
            updateQuantityByIngredientId(product.id, qty);
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={{
                width: width,
                backgroundColor: colors.white,
                borderRadius: 12,
                overflow: 'hidden',
                ...shadow.soft,
                borderWidth: 1,
                borderColor: colors.gray[100],
            }}
        >
            {/* Product Image Area */}
            <View style={{ position: 'relative', opacity: isOutOfStock ? 0.5 : 1 }}>
                <Image
                    source={{ uri: product.image }}
                    style={{ width: '100%', height: 90, backgroundColor: colors.gray[100] }}
                    resizeMode="cover"
                />
                {product.badge && (
                    <View style={{
                        position: 'absolute',
                        top: 8,
                        left: 0,
                        backgroundColor: colors.primary[600],
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderTopRightRadius: 4,
                        borderBottomRightRadius: 4,
                    }}>
                        <Text style={{ fontSize: 8, fontFamily: typography.fontFamily.bold, color: colors.white }}>
                            {product.badge}
                        </Text>
                    </View>
                )}
                {savings > 0 && (
                    <View style={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        backgroundColor: colors.accent[500],
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 4,
                    }}>
                        <Text style={{ fontSize: 9, fontFamily: typography.fontFamily.bold, color: colors.white }}>
                            {savings}% OFF
                        </Text>
                    </View>
                )}
            </View>

            {/* Content Area */}
            <View style={{ padding: 4 }}>
                <Text style={{
                    fontSize: 11,
                    fontFamily: typography.fontFamily.semibold,
                    color: colors.gray[800],
                    marginBottom: 1,
                    height: 26,
                }} numberOfLines={2}>
                    {product.name || 'Product'}
                </Text>

                <View style={{ height: 14, justifyContent: 'center', marginBottom: 2 }}>
                    <Text style={{ fontSize: 9, color: colors.gray[500], fontFamily: typography.fontFamily.medium }}>
                        {product.unit || product.weight || ''}
                    </Text>
                </View>

                <View style={{
                    height: 52,
                    marginBottom: 6,
                    backgroundColor: Array.isArray(product.bulkTiers) && product.bulkTiers.length > 0 ? colors.gray[50] : 'transparent',
                    padding: Array.isArray(product.bulkTiers) && product.bulkTiers.length > 0 ? 2 : 0,
                    borderRadius: 4,
                    justifyContent: 'center'
                }}>
                    {Array.isArray(product.bulkTiers) && product.bulkTiers.map((tier: any, idx: number) => {
                        if (!tier) return null;
                        const qtyNum = parseInt(tier.quantity) || 1;
                        const tierPrice = tier.price || 0;
                        const unitPrice = qtyNum > 0 ? Math.round(tierPrice / qtyNum) : tierPrice;
                        return (
                            <View key={idx} style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingVertical: 1,
                            }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 9, fontFamily: typography.fontFamily.bold, color: colors.gray[600] }}>
                                        {tier.quantity}: <Text style={{ color: colors.primary[600] }}>₹{tier.price}</Text>
                                    </Text>
                                    <Text style={{ fontSize: 7, color: colors.gray[400], fontFamily: typography.fontFamily.medium }}>
                                        ₹{unitPrice} / unit
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: isOutOfStock ? colors.gray[100] : colors.white,
                                        borderWidth: 1,
                                        borderColor: isOutOfStock ? colors.gray[300] : colors.primary[200],
                                        paddingHorizontal: 6,
                                        paddingVertical: 2,
                                        borderRadius: 4,
                                    }}
                                    onPress={(e) => handleAddBulk(e, tier.quantity)}
                                    disabled={isOutOfStock}
                                >
                                    <Text style={{ fontSize: 8, fontFamily: typography.fontFamily.bold, color: isOutOfStock ? colors.gray[400] : colors.primary[600] }}>
                                        {isOutOfStock ? 'OUT' : 'ADD'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View>
                        <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end', height: 32 }}>
                            <Text style={{ fontSize: 13, fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
                                ₹{currentPrice}
                            </Text>
                            <View style={{ height: 12 }}>
                                {mrp > currentPrice ? (
                                    <Text style={{ fontSize: 9, color: colors.gray[400], textDecorationLine: 'line-through' }}>
                                        ₹{Math.round(mrp)}
                                    </Text>
                                ) : null}
                            </View>
                        </View>
                    </View>

                    {quantity > 0 ? (
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: colors.primary[50],
                            borderRadius: 6,
                            borderWidth: 1,
                            borderColor: colors.primary[100],
                            ...shadow.soft,
                        }}>
                            <TouchableOpacity
                                onPress={handleDecrement}
                                style={{ padding: 4, paddingHorizontal: 4 }}
                            >
                                <Feather name="minus" size={14} color={colors.primary[600]} />
                            </TouchableOpacity>
                            <Text style={{
                                fontSize: 12,
                                fontFamily: typography.fontFamily.bold,
                                color: colors.primary[700],
                                minWidth: 16,
                                textAlign: 'center',
                            }}>
                                {quantity}
                            </Text>
                            <TouchableOpacity
                                onPress={handleIncrement}
                                style={{ padding: 4, paddingHorizontal: 4 }}
                            >
                                <Feather name="plus" size={14} color={colors.primary[600]} />
                            </TouchableOpacity>
                        </View>
                    ) : isOutOfStock ? (
                        <View
                            style={{
                                backgroundColor: colors.gray[100],
                                borderWidth: 1,
                                borderColor: colors.gray[300],
                                paddingHorizontal: 8,
                                paddingVertical: 3,
                                borderRadius: 6,
                            }}
                        >
                            <Text style={{ fontSize: 9, fontFamily: typography.fontFamily.bold, color: colors.gray[500] }}>
                                OUT OF STOCK
                            </Text>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={{
                                backgroundColor: colors.white,
                                borderWidth: 1,
                                borderColor: colors.primary[500],
                                paddingHorizontal: 8,
                                paddingVertical: 3,
                                borderRadius: 6,
                                ...shadow.soft,
                            }}
                            onPress={handleAdd}
                        >
                            <Text style={{ fontSize: 11, fontFamily: typography.fontFamily.bold, color: colors.primary[600] }}>
                                ADD
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};
