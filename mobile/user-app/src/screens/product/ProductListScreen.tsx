import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ImageBackground,
    TextInput,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography, textStyles } from '../../constants/typography';
import { spacing, borderRadius, shadow } from '../../constants/spacing';
import { KittyChatSearchBar } from '../../components/common/KittyChatSearchBar';
import { VerticalProductCard } from '../../components/product/VerticalProductCard';
import { Recipe } from '../../types/recipe';

const { width } = Dimensions.get('window');

const CATEGORIES = [
    {
        id: 'frozen',
        name: 'Ready to cook: Frozen',
        items: '120+ Items',
        icon: '🥟',
        color: '#E0F2FE',
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&q=80'
    },
    {
        id: '5min',
        name: 'Ready-to-cook: <5 mins',
        items: '45+ Items',
        icon: '⚡',
        color: '#FEF3C7',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'
    },
    {
        id: '10min',
        name: 'Ready-to-cook: <10 mins',
        items: '60+ Items',
        icon: '⏱️',
        color: '#FFF1F2',
        image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&q=80'
    },
    {
        id: 'veg',
        name: 'Vegetables',
        items: '80+ Items',
        icon: '',
        color: '#DCFCE7',
        image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&q=80'
    },
    {
        id: 'meat',
        name: 'Meat',
        items: '30+ Items',
        icon: '🥩',
        color: '#FEE2E2',
        image: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?w=500&q=80'
    },
    {
        id: 'grocery',
        name: 'Groceries',
        items: '500+ Items',
        icon: '🛒',
        color: '#F3E8FF',
        image: 'https://images.unsplash.com/photo-1506484334402-40ff22e05a6d?w=500&q=80'
    },
    {
        id: 'packaging',
        name: 'Packaging',
        items: '15+ Items',
        icon: '📦',
        color: '#F1F5F9',
        image: 'https://images.unsplash.com/photo-1620455212513-ade425712128?w=500&q=80'
    },
];

const ProductListScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Recipe[]>([]);

    const filteredCategories = CATEGORIES.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderCategory = ({ item }: any) => (
        <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => navigation.navigate('CategoryDetail', {
                categoryId: item.id,
                categoryTitle: item.name
            })}
            activeOpacity={0.9}
        >
            <ImageBackground
                source={{ uri: item.image }}
                style={styles.imageContainer}
                imageStyle={{ borderRadius: borderRadius.xl }}
            >
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.85)']}
                    style={styles.categoryGradient}
                >
                    <View style={styles.categoryContent}>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryBadgeText}>{item.icon || '🛍️'}</Text>
                        </View>
                        <View>
                            <Text style={styles.categoryName} numberOfLines={1}>{item.name}</Text>
                            <View style={styles.categoryFooter}>
                                <Text style={styles.categoryCount}>{item.items}</Text>
                                <Feather name="arrow-right" size={14} color={colors.white} />
                            </View>
                        </View>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <View style={[styles.hero, { marginTop: insets.top + spacing.md }]}>
                <KittyChatSearchBar
                    navigation={navigation}
                    onSearchResults={(results) => setSearchResults(results)}
                />

                {searchResults.length > 0 && (
                    <View style={{ marginTop: spacing.xs, marginBottom: spacing.md }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text.primary }}>
                                Search Results
                            </Text>
                            <TouchableOpacity onPress={() => setSearchResults([])}>
                                <Text style={{ fontSize: 13, color: colors.primary[600], fontWeight: '700' }}>Clear</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={searchResults}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item: product }) => (
                                <View style={{ marginRight: 12 }}>
                                    <VerticalProductCard
                                        product={product}
                                        width={150}
                                        onPress={() => navigation.navigate('ProductDetail', { product })}
                                    />
                                </View>
                            )}
                        />
                    </View>
                )}
            </View>

            <FlatList
                data={filteredCategories}
                renderItem={renderCategory}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    header: {
        display: 'none',
    },
    hero: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.sm,
    },
    listContent: {
        paddingHorizontal: spacing.md,
        paddingBottom: 100,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    categoryCard: {
        width: (width - spacing.md * 3) / 2,
        height: 180,
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        ...shadow.medium,
    },
    imageContainer: {
        width: '100%',
        height: '100%',
    },
    categoryGradient: {
        flex: 1,
        borderRadius: borderRadius.xl,
        justifyContent: 'flex-end',
        padding: 12,
    },
    categoryContent: {
        justifyContent: 'space-between',
        height: '100%',
    },
    categoryBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadow.soft,
    },
    categoryBadgeText: {
        fontSize: 16,
    },
    categoryName: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.white,
        marginBottom: 4,
        fontFamily: typography.fontFamily.bold,
    },
    categoryFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryCount: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '600',
        fontFamily: typography.fontFamily.medium,
    }
});

export default ProductListScreen;
