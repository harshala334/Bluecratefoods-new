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
import { VerticalProductCard } from '../../components/product/VerticalProductCard';

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
    { id: '14', name: 'Avocado Toast Kit', price: 120, mrp: 150, weight: '1 serving', unit: '1 serving', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80', subcategory: 'breakfast', categoryId: '5min' },
    { id: '15', name: 'Dal Tadka Meal', price: 180, mrp: 220, weight: '1 serving', unit: '1 serving', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&q=80', subcategory: 'indian', categoryId: '10min' },
];

const CategoryDetailScreen = ({ route, navigation }: any) => {
    const { categoryId = 'veg', categoryTitle = 'Vegetables', selectedSubId } = route.params || {};
    const [selectedSub, setSelectedSub] = useState(selectedSubId || SUBCATEGORIES[categoryId]?.[0]?.id || 'all');
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
        const isMeal = ['5min', '10min', '15min'].includes(categoryId);

        return (
            <View style={styles.productCardWrapper}>
                <VerticalProductCard
                    product={item}
                    width={(windowWidth - SIDEBAR_WIDTH - 24) / 2}
                    onPress={() => {
                        if (isMeal) {
                            navigation.navigate('RecipeDetail', { recipeId: item.id });
                        } else {
                            navigation.navigate('ProductDetail', { product: item });
                        }
                    }}
                />
            </View>
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
                        <View style={styles.headerTitleGroup}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => navigation.goBack()}
                            >
                                <Feather name="arrow-left" size={20} color={colors.primary[600]} />
                            </TouchableOpacity>
                            <Text style={styles.listTitle} numberOfLines={1}>
                                {subcategories.find((s: any) => s.id === selectedSub)?.name || 'Items'}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.filterButton}
                            onPress={() => setShowSortModal(true)}
                        >
                            <Text style={styles.filterText}>
                                {sortOptions.find(o => o.id === sortBy)?.label || 'Sort'}
                            </Text>
                            <Ionicons name="options-outline" size={16} color={colors.primary[500]} />
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
        backgroundColor: colors.background.primary,
    },
    mainContent: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 0,
    },
    sidebar: {
        width: SIDEBAR_WIDTH,
        backgroundColor: colors.background.primary,
        borderRightWidth: 1,
        borderRightColor: colors.gray[100],
        paddingTop: spacing.xs,
    },
    sidebarItem: {
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
    sidebarItemActive: {
        backgroundColor: colors.white,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
        ...shadow.soft,
    },
    iconContainerActive: {
        backgroundColor: colors.primary[50],
        borderWidth: 1.5,
        borderColor: colors.primary[500],
    },
    subIcon: {
        fontSize: 20,
    },
    sidebarLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: colors.gray[500],
        textAlign: 'center',
        paddingHorizontal: 2,
    },
    sidebarLabelActive: {
        color: colors.primary[700],
        fontWeight: '700',
    },
    productContent: {
        flex: 1,
        padding: spacing.sm,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    headerTitleGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        flex: 1,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadow.soft,
        borderWidth: 1,
        borderColor: colors.gray[100],
    },
    listTitle: {
        fontSize: 18,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
        flex: 1,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: colors.white,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: borderRadius.lg,
        ...shadow.soft,
        borderWidth: 1,
        borderColor: colors.gray[100],
    },
    filterText: {
        fontSize: 12,
        color: colors.gray[600],
        fontWeight: '600',
    },
    gridContent: {
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    productCardWrapper: {
        marginBottom: spacing.md,
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
