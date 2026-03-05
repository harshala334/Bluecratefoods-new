import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    TextInput,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography, textStyles } from '../../constants/typography';
import { spacing, borderRadius, shadow } from '../../constants/spacing';

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
    const [searchQuery, setSearchQuery] = useState('');

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
            activeOpacity={0.8}
        >
            <View style={[styles.imageContainer, { backgroundColor: item.color }]}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.iconBadge}>
                    <Text style={styles.iconText}>{item.icon}</Text>
                </View>
            </View>
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.footer}>
                    <Text style={styles.itemCount}>{item.items}</Text>
                    <Feather name="chevron-right" size={16} color={colors.primary[500]} />
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
            <View style={styles.searchBarWrapper}>
                <View style={styles.searchContainer}>
                    <Feather name="search" size={18} color={colors.primary[500]} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search categories..."
                        placeholderTextColor={colors.gray[400]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Feather name="x" size={18} color={colors.gray[400]} />
                        </TouchableOpacity>
                    )}
                </View>
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
        backgroundColor: colors.white,
    },
    header: {
        display: 'none',
    },
    searchBarWrapper: {
        backgroundColor: colors.primary[500],
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.sm,
        paddingTop: spacing.md, // Increased padding to clear status bar
        marginTop: 0,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 8,
        height: 40,
        paddingHorizontal: spacing.sm,
        ...shadow.soft,
    },
    searchIcon: {
        marginRight: spacing.xs,
    },
    searchInput: {
        flex: 1,
        fontSize: typography.fontSize.base,
        color: colors.text.primary,
        paddingVertical: 0,
    },
    listContent: {
        padding: spacing.md,
        paddingTop: spacing.xs, // Reduced to match sleek design
        paddingBottom: 100,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: spacing.xs, // Further reduced for high density
    },
    categoryCard: {
        width: (width - spacing.md * 3) / 2,
        backgroundColor: colors.white,
        borderRadius: 8, // Sleek 8px rounding
        ...shadow.soft,
        borderWidth: 1,
        borderColor: colors.gray[100],
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        height: 120,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        opacity: 0.8,
        resizeMode: 'cover',
    },
    iconBadge: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: colors.white,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadow.soft,
    },
    iconText: {
        fontSize: 18,
    },
    info: {
        padding: 12,
    },
    name: {
        fontSize: typography.fontSize.base,
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemCount: {
        fontSize: typography.fontSize.xsMedium,
        color: colors.gray[500],
        fontWeight: '500',
    }
});

export default ProductListScreen;
