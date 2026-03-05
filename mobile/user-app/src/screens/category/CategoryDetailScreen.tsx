import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    Dimensions,
    TextInput,
    Modal,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography, textStyles } from '../../constants/typography';
import { spacing, borderRadius, shadow } from '../../constants/spacing';
import useCartStore from '../../stores/cartStore';
import useRecipeStore from '../../stores/recipeStore';
import { recipeService } from '../../services/recipeService';

const { width: windowWidth } = Dimensions.get('window');
const SIDEBAR_WIDTH = 90;

// Mock Data for demonstration
const SUBCATEGORIES: any = {
    veg: [
        { id: 'leafy', name: 'Leafy Greens', icon: '🥬' },
        { id: 'roots', name: 'Root Veggies', icon: '🥕' },
        { id: 'exotic', name: 'Exotic Veg', icon: '🥑' },
        { id: 'daily', name: 'Daily Needs', icon: '🧅' },
        { id: 'organic', name: 'Organic', icon: '🌿' },
    ],
    frozen: [
        { id: 'snacks', name: 'Snacks', icon: '🥟' },
        { id: 'desserts', name: 'Desserts', icon: '🍦' },
        { id: 'meals', name: 'Quick Meals', icon: '🥡' },
        { id: 'fries', name: 'Fries & Sides', icon: '🍟' },
    ],
    '5min': [
        { id: 'breakfast', name: 'Breakfast', icon: '🥣' },
        { id: 'noodles', name: 'Noodles', icon: '🍜' },
        { id: 'soups', name: 'Soups', icon: '🍲' },
    ],
    '10min': [
        { id: 'indian', name: 'Indian Meals', icon: '🍛' },
        { id: 'pasta', name: 'Pastas', icon: '🍝' },
        { id: 'biryani', name: 'Biryanis', icon: '🥘' },
    ],
    meat: [
        { id: 'chicken', name: 'Chicken', icon: '🍗' },
        { id: 'mutton', name: 'Mutton', icon: '🍖' },
        { id: 'fish', name: 'Fish & Seafood', icon: '🐟' },
        { id: 'eggs', name: 'Eggs', icon: '🥚' },
    ],
    grocery: [
        { id: 'flour', name: 'Flour & Rice', icon: '🍚' },
        { id: 'oil', name: 'Oils & Ghee', icon: '🍶' },
        { id: 'spices', name: 'Spices', icon: '🧂' },
        { id: 'dairy', name: 'Dairy & Bread', icon: '🍞' },
    ],
    packaging: [
        { id: 'boxes', name: 'Boxes', icon: '📦' },
        { id: 'bags', name: 'Bags', icon: '🛍️' },
        { id: 'containers', name: 'Containers', icon: '🍱' },
    ],
    // Fallback for others
    default: [
        { id: 'all', name: 'All Items', icon: '📦' },
        { id: 'new', name: 'New Arrivals', icon: '✨' },
        { id: 'deals', name: 'Best Deals', icon: '🏷️' },
    ]
};

const PRODUCTS: any = [
    {
        id: '1', name: 'Fresh Spinach', price: 40, mrp: 50, weight: '250g', unit: '250g',
        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&q=80',
        subcategory: 'leafy', badge: 'DEAL',
        bulkTiers: [
            { quantity: '1kg', price: 140 },
            { quantity: '5kg', price: 650 }
        ]
    },
    {
        id: '2', name: 'Carrots (Ooty)', price: 65, mrp: 80, weight: '500g', unit: '500g',
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&q=80',
        subcategory: 'roots',
        bulkTiers: [
            { quantity: '2kg', price: 240 },
            { quantity: '10kg', price: 1100 }
        ]
    },
    {
        id: '3', name: 'Avocado (Haas)', price: 280, mrp: 350, weight: '1 pc', unit: '1 pc',
        image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300&q=80',
        subcategory: 'exotic', badge: 'PREMIUM',
        bulkTiers: [
            { quantity: '5 pcs', price: 1300 },
            { quantity: '12 pcs', price: 3000 }
        ]
    },
    {
        id: '4', name: 'Red Onions', price: 35, mrp: 45, weight: '1kg', unit: '1kg',
        image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=300&q=80',
        subcategory: 'daily',
        bulkTiers: [
            { quantity: '5kg', price: 160 },
            { quantity: '20kg', price: 600 }
        ]
    },
    { id: '5', name: 'Hydroponic Lettuce', price: 120, mrp: 150, weight: '200g', unit: '200g', image: 'https://images.unsplash.com/photo-1622206141540-584454467bd9?w=300&q=80', subcategory: 'organic' },
    { id: '6', name: 'Broccoli (Hybrid)', price: 90, mrp: 110, weight: '1 pc', unit: '1 pc', image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=300&q=80', subcategory: 'leafy' },
    {
        id: '7', name: 'Bell Peppers (Red)', price: 185, mrp: 220, weight: '2 pcs', unit: '2 pcs',
        image: 'https://images.unsplash.com/photo-1563513331624-39460ef82c16?w=300&q=80',
        subcategory: 'exotic',
        bulkTiers: [
            { quantity: '1kg', price: 380 },
            { quantity: '3kg', price: 1050 }
        ]
    },
    { id: '8', name: 'Baby Corn', price: 45, mrp: 60, weight: '200g', unit: '200g', image: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?w=300&q=80', subcategory: 'exotic' },
    { id: '9', name: 'Cherry Tomatoes', price: 75, mrp: 100, weight: '250g', unit: '250g', image: 'https://images.unsplash.com/photo-1518977676601-b53f02bad675?w=300&q=80', subcategory: 'daily' },
    { id: '10', name: 'Sweet Potato', price: 55, mrp: 75, weight: '500g', unit: '500g', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&q=80', subcategory: 'roots' },
    { id: '11', name: 'Frozen Green Peas', price: 95, mrp: 120, weight: '500g', unit: '500g', image: 'https://images.unsplash.com/photo-1592119747782-d8c12c2ea2b7?w=300&q=80', subcategory: 'snacks' },
    { id: '12', name: 'Potato Wedges', price: 150, mrp: 180, weight: '400g', unit: '400g', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&q=80', subcategory: 'fries' },
    { id: '13', name: 'Frozen Momos', price: 199, mrp: 250, weight: '12 pcs', unit: '12 pcs', image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=300&q=80', subcategory: 'snacks' },
];

const CategoryDetailScreen = ({ route, navigation }: any) => {
    const { categoryId = 'veg', categoryTitle = 'Vegetables' } = route.params || {};
    const [selectedSub, setSelectedSub] = useState(SUBCATEGORIES[categoryId]?.[0]?.id || 'all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('popular'); // popular, priceLow, priceHigh, nameAZ
    const [showSortModal, setShowSortModal] = useState(false);

    const { items, addItem, updateQuantityByIngredientId, totalItems, totalPrice } = useCartStore();
    const { addFrequentItem } = useRecipeStore();
    const [products, setProducts] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const results = await recipeService.searchRecipes(categoryId);
                setProducts(results);
            } catch (error) {
                setProducts(PRODUCTS); // Fallback to local mock if service fails
            }
            setLoading(false);
        };
        fetchProducts();
    }, [categoryId]);

    const subcategories = SUBCATEGORIES[categoryId] || SUBCATEGORIES.default;

    const handleAdd = (product: any) => {
        const ingredient = {
            id: product.id,
            name: product.name,
            price: product.price,
            unit: product.weight,
            image: product.image,
            category: categoryId,
        };
        addItem(ingredient as any, 1);
        addFrequentItem(product);
    };

    const handleAddBulk = (product: any, bulkQuantity: string) => {
        const qty = parseInt(bulkQuantity) || 1;
        // If not in cart, add first, then update quantity
        const cartItem = items.find(i => i.ingredient.id === product.id);
        if (!cartItem) {
            const ingredient = {
                id: product.id,
                name: product.name,
                price: product.price,
                unit: product.weight,
                image: product.image,
                category: categoryId,
            };
            addItem(ingredient as any, qty);
        } else {
            updateQuantityByIngredientId(product.id, qty);
        }
    };

    const getSortedProducts = () => {
        let items = [...PRODUCTS];

        // Filter by search
        if (searchQuery) {
            items = items.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        // Filter by subcategory
        if (selectedSub !== 'all') {
            items = items.filter(p => p.subcategory === selectedSub);
        }

        // Sort items
        switch (sortBy) {
            case 'priceLow':
                return items.sort((a, b) => a.price - b.price);
            case 'priceHigh':
                return items.sort((a, b) => b.price - a.price);
            case 'nameAZ':
                return items.sort((a, b) => a.name.localeCompare(b.name));
            default:
                return items; // 'popular' or default (mock order)
        }
    };

    const sortedProducts = getSortedProducts();

    const sortOptions = [
        { id: 'popular', label: 'Popularity', icon: 'trending-up' },
        { id: 'priceLow', label: 'Price: Low to High', icon: 'arrow-down' },
        { id: 'priceHigh', label: 'Price: High to Low', icon: 'arrow-up' },
        { id: 'nameAZ', label: 'Name: A to Z', icon: 'type' },
    ];

    const renderProduct = ({ item }: { item: any }) => {
        const savings = item.mrp ? Math.round(((item.mrp - item.price) / item.mrp) * 100) : 0;

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
                style={styles.card}
                activeOpacity={0.8}
            >
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={styles.productImage} />
                    {item.badge && (
                        <View style={styles.badgeLabel}>
                            <Text style={styles.badgeLabelText}>{item.badge}</Text>
                        </View>
                    )}
                    {savings > 0 && (
                        <View style={styles.savingsBadge}>
                            <Text style={styles.savingsBadgeText}>{savings}% OFF</Text>
                        </View>
                    )}
                </View>
                <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.productWeight}>{item.weight || item.unit}</Text>

                    {item.bulkTiers && (
                        <View style={styles.bulkTiersContainer}>
                            {item.bulkTiers.map((tier: any, idx: number) => {
                                const qtyNum = parseInt(tier.quantity) || 1;
                                const unitPrice = Math.round(tier.price / qtyNum);
                                return (
                                    <View key={idx} style={styles.bulkTierItem}>
                                        <View style={styles.bulkTierInfo}>
                                            <Text style={styles.bulkTierQty}>{tier.quantity}: <Text style={styles.bulkTierPrice}>₹{tier.price}</Text></Text>
                                            <Text style={styles.bulkTierUnitPrice}>₹{unitPrice} / unit</Text>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.bulkAddBtn}
                                            onPress={(e) => {
                                                e.stopPropagation();
                                                handleAddBulk(item, tier.quantity);
                                                addFrequentItem(item);
                                            }}
                                        >
                                            <Text style={styles.bulkAddBtnText}>ADD</Text>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </View>
                    )}

                    <View style={styles.priceRow}>
                        <View>
                            <View style={styles.priceStack}>
                                <Text style={styles.productPrice}>₹{item.price}</Text>
                                {item.mrp && item.mrp > item.price && (
                                    <Text style={styles.mrpText}>₹{item.mrp}</Text>
                                )}
                            </View>
                        </View>

                        {(() => {
                            const cartItem = items.find(i => i.ingredient.id === item.id);
                            const quantity = cartItem?.quantity || 0;

                            if (quantity > 0) {
                                return (
                                    <View style={[styles.stepperContainer, shadow.soft]}>
                                        <TouchableOpacity
                                            onPress={(e) => {
                                                e.stopPropagation();
                                                updateQuantityByIngredientId(item.id, quantity - 1);
                                            }}
                                            style={styles.stepperBtn}
                                        >
                                            <Feather name="minus" size={14} color={colors.primary[600]} />
                                        </TouchableOpacity>
                                        <Text style={styles.stepperQty}>{quantity}</Text>
                                        <TouchableOpacity
                                            onPress={(e) => {
                                                e.stopPropagation();
                                                updateQuantityByIngredientId(item.id, quantity + 1);
                                            }}
                                            style={styles.stepperBtn}
                                        >
                                            <Feather name="plus" size={14} color={colors.primary[600]} />
                                        </TouchableOpacity>
                                    </View>
                                );
                            }

                            return (
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        handleAdd(item);
                                    }}
                                >
                                    <Text style={styles.actionButtonText}>ADD</Text>
                                </TouchableOpacity>
                            );
                        })()}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
            <View style={styles.mainContent}>
                {/* Sidebar */}
                <View style={styles.sidebar}>
                    <FlatList
                        data={subcategories}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => setSelectedSub(item.id)}
                                style={[
                                    styles.sidebarItem,
                                    selectedSub === item.id && styles.sidebarItemActive
                                ]}
                            >
                                <View style={[
                                    styles.iconContainer,
                                    selectedSub === item.id && styles.iconContainerActive
                                ]}>
                                    <Text style={styles.subIcon}>{item.icon}</Text>
                                </View>
                                <Text style={[
                                    styles.sidebarLabel,
                                    selectedSub === item.id && styles.sidebarLabelActive
                                ]}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>

                {/* Product Grid */}
                <View style={styles.productContent}>
                    <View style={styles.listHeader}>
                        <Text style={styles.listTitle}>{subcategories.find((s: any) => s.id === selectedSub)?.name || 'Items'}</Text>
                        <TouchableOpacity
                            style={styles.filterButton}
                            onPress={() => setShowSortModal(true)}
                        >
                            <Text style={styles.filterText}>
                                {sortOptions.find(o => o.id === sortBy)?.label || 'Sort'}
                            </Text>
                            <Feather name="chevron-down" size={14} color={colors.primary[500]} />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={sortedProducts}
                        numColumns={2}
                        keyExtractor={(item) => item.id}
                        renderItem={renderProduct}
                        contentContainerStyle={styles.gridContent}
                        showsVerticalScrollIndicator={false}
                        columnWrapperStyle={styles.columnWrapper}
                    />
                </View>
            </View>

            {/* Floating Cart Bar */}
            {totalItems > 0 && (
                <TouchableOpacity
                    style={styles.cartBar}
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate('CartTab')}
                >
                    <View style={styles.cartBarContent}>
                        <View>
                            <Text style={styles.cartBarItems}>{totalItems} {totalItems === 1 ? 'ITEM' : 'ITEMS'}</Text>
                            <Text style={styles.cartBarTotal}>₹{totalPrice.toFixed(2)}</Text>
                        </View>
                        <View style={styles.viewCartButton}>
                            <Text style={styles.viewCartText}>View Cart</Text>
                            <Feather name="chevron-right" size={20} color={colors.white} />
                        </View>
                    </View>
                </TouchableOpacity>
            )}

            {/* Sort Modal */}
            <Modal
                visible={showSortModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowSortModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowSortModal(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Sort By</Text>
                            <TouchableOpacity onPress={() => setShowSortModal(false)}>
                                <Feather name="x" size={24} color={colors.gray[600]} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.sortOptions}>
                            {sortOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={[
                                        styles.sortOption,
                                        sortBy === option.id && styles.sortOptionActive
                                    ]}
                                    onPress={() => {
                                        setSortBy(option.id);
                                        setShowSortModal(false);
                                    }}
                                >
                                    <View style={styles.sortOptionLeft}>
                                        <Feather
                                            name={option.icon as any}
                                            size={18}
                                            color={sortBy === option.id ? colors.primary[600] : colors.gray[600]}
                                        />
                                        <Text style={[
                                            styles.sortOptionLabel,
                                            sortBy === option.id && styles.sortOptionLabelActive
                                        ]}>
                                            {option.label}
                                        </Text>
                                    </View>
                                    {sortBy === option.id && (
                                        <Ionicons name="checkmark-circle" size={20} color={colors.primary[600]} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
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
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs || 4,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[100],
        gap: spacing.sm,
        backgroundColor: colors.white,
        ...shadow.soft,
    },
    backButton: {
        padding: 4,
    },
    headerSearch: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.gray[50],
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.sm,
        height: 40,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: typography.fontSize.base,
        color: colors.text.primary,
    },
    cartHeaderButton: {
        padding: 4,
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: colors.primary[500],
        borderRadius: 8,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: colors.white,
    },
    badgeText: {
        color: colors.white,
        fontSize: typography.fontSize.xxs,
        fontWeight: '700',
    },
    mainContent: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 0, // Removed gap below topbar
    },
    sidebar: {
        width: SIDEBAR_WIDTH,
        backgroundColor: colors.gray[50],
        borderRightWidth: 1,
        borderRightColor: colors.gray[100],
        paddingTop: spacing.xs, // Add minimal top padding for sleekness
    },
    sidebarItem: {
        paddingVertical: 8,
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingHorizontal: 8,
        borderLeftWidth: 3,
        borderLeftColor: 'transparent',
    },
    sidebarItemActive: {
        backgroundColor: colors.white,
        borderLeftColor: colors.primary[500],
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
        ...shadow.soft,
    },
    iconContainerActive: {
        backgroundColor: colors.primary[50],
    },
    subIcon: {
        fontSize: 22,
    },
    sidebarLabel: {
        fontSize: typography.fontSize.xxs,
        fontWeight: '600',
        color: colors.gray[500],
        textAlign: 'left',
        paddingHorizontal: 4,
    },
    sidebarLabelActive: {
        color: colors.primary[700],
    },
    productContent: {
        flex: 1,
        padding: 6, // Reduced from 8
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: spacing.sm,
        paddingHorizontal: 4,
    },
    listTitle: {
        ...textStyles.h3,
        color: colors.text.primary,
        textAlign: 'left',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    filterText: {
        fontSize: typography.fontSize.xsMedium,
        color: colors.gray[600],
        fontWeight: '500',
    },
    gridContent: {
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    card: {
        width: (windowWidth - SIDEBAR_WIDTH - 20) / 2, // Adjusted to reduce gap
        backgroundColor: colors.white,
        borderRadius: 8, // Sleek 8px rounding
        marginBottom: 12, // Reduced from 16
        ...shadow.soft,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.gray[100],
    },
    imageContainer: {
        width: '100%',
        height: 120,
        backgroundColor: colors.gray[50],
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    addButton: {
        position: 'absolute',
        bottom: -15,
        right: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary[500],
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        height: 30,
        ...shadow.medium,
    },
    addButtonText: {
        color: colors.white,
        fontSize: typography.fontSize.xsMedium,
        fontWeight: '700',
        marginLeft: 2,
    },
    productInfo: {
        padding: 6, // Tighter padding
    },
    productName: {
        fontSize: typography.fontSize.xsMedium,
        color: colors.gray[800],
        fontFamily: typography.fontFamily.semibold,
        height: 32,
        marginBottom: 2,
    },
    productWeight: {
        fontSize: typography.fontSize.xxs,
        fontFamily: typography.fontFamily.medium,
        marginBottom: 4, // Reduced to make space for tiers
    },
    bulkTiersContainer: {
        flexDirection: 'column',
        gap: 6,
        marginBottom: 8,
        backgroundColor: colors.gray[50],
        padding: 4,
        borderRadius: 6,
    },
    bulkTierItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 2,
    },
    bulkTierInfo: {
        flex: 1,
    },
    bulkTierQty: {
        fontSize: typography.fontSize.xxxs,
        fontFamily: typography.fontFamily.bold,
        color: colors.gray[600],
    },
    bulkTierPrice: {
        color: colors.primary[600],
    },
    bulkTierUnitPrice: {
        fontSize: typography.fontSize.xxxs,
        color: colors.gray[400],
        fontFamily: typography.fontFamily.medium,
    },
    bulkAddBtn: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.primary[200],
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    bulkAddBtnText: {
        fontSize: typography.fontSize.xxxs,
        fontFamily: typography.fontFamily.bold,
        color: colors.primary[600],
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    priceStack: {
        flexDirection: 'column', // Stack vertically to save horizontal space
        alignItems: 'flex-start',
        gap: 0,
    },
    productPrice: {
        fontSize: typography.fontSize.base,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
    },
    mrpText: {
        fontSize: typography.fontSize.xs,
        color: colors.gray[400],
        textDecorationLine: 'line-through',
        fontFamily: typography.fontFamily.body,
    },
    actionButton: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.primary[500],
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 6,
        ...shadow.soft,
    },
    actionButtonText: {
        color: colors.primary[600],
        fontSize: typography.fontSize.xsMedium,
        fontFamily: typography.fontFamily.bold,
    },
    stepperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary[50],
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.primary[100],
    },
    stepperBtn: {
        padding: 6,
        paddingHorizontal: 6, // Slightly tighter
    },
    stepperQty: {
        fontSize: typography.fontSize.xsMedium,
        fontFamily: typography.fontFamily.bold,
        color: colors.primary[700],
        minWidth: 18,
        textAlign: 'center',
    },
    badgeLabel: {
        position: 'absolute',
        top: 8,
        left: 0,
        backgroundColor: colors.primary[600],
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
    },
    badgeLabelText: {
        fontSize: typography.fontSize.xxxs,
        fontFamily: typography.fontFamily.bold,
        color: colors.white,
    },
    savingsBadge: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: colors.accent[500],
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    savingsBadgeText: {
        fontSize: typography.fontSize.xxxs,
        fontFamily: typography.fontFamily.bold,
        color: colors.white,
    },
    cartBar: {
        position: 'absolute',
        bottom: 20,
        left: spacing.md,
        right: spacing.md,
        backgroundColor: colors.primary[600],
        borderRadius: borderRadius.lg,
        padding: 12,
        ...shadow.medium,
    },
    cartBarContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cartBarItems: {
        color: colors.white,
        fontSize: typography.fontSize.xxs,
        fontWeight: '700',
        opacity: 0.9,
    },
    cartBarTotal: {
        color: colors.white,
        fontSize: typography.fontSize.lg,
        fontWeight: '700',
    },
    viewCartButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    viewCartText: {
        color: colors.white,
        fontSize: typography.fontSize.lg,
        fontWeight: '700',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.white,
        borderTopLeftRadius: borderRadius['3xl'],
        borderTopRightRadius: borderRadius['3xl'],
        padding: spacing.lg,
        paddingBottom: 40,
        ...shadow.hard,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    modalTitle: {
        ...textStyles.h2,
        color: colors.text.primary,
    },
    sortOptions: {
        gap: spacing.sm,
    },
    sortOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.md,
        borderRadius: borderRadius.xl,
        backgroundColor: colors.gray[50],
        borderWidth: 1,
        borderColor: 'transparent',
    },
    sortOptionActive: {
        backgroundColor: colors.primary[50],
        borderColor: colors.primary[200],
    },
    sortOptionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    sortOptionLabel: {
        fontSize: typography.fontSize.lg,
        fontWeight: '600',
        color: colors.gray[700],
    },
    sortOptionLabelActive: {
        color: colors.primary[700],
    },
});

export default CategoryDetailScreen;
