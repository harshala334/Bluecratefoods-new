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
    ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
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
import { CATEGORY_DATA, DEFAULT_SUBCATEGORIES } from '../../constants/categories';

// Helper to get subcategories mapping from central data
const getSubcategoriesMap = () => {
    const map: Record<string, any[]> = {};
    CATEGORY_DATA.forEach(cat => {
        map[cat.id] = cat.subcategories;
    });
    return map;
};

const SUBCATEGORIES = getSubcategoriesMap();

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
    const [selectedSub, setSelectedSub] = useState(selectedSubId || 'all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('popular'); // popular, priceLow, priceHigh, nameAZ
    const [showSortModal, setShowSortModal] = useState(false);

    const { items, addItem, updateQuantityByIngredientId, totalItems, totalPrice } = useCartStore();
    const { addFrequentItem } = useRecipeStore();
    // Fetch products for category using React Query
    const { data: productsData, isLoading: loading } = useQuery({
        queryKey: ['products', { category: categoryId }],
        queryFn: async () => {
            const { recipes } = await recipeService.getRecipes({ 
                category: categoryId === 'all' ? undefined : categoryId 
            });
            return recipes;
        },
    });

    const products = productsData || [];

    const subcategories = SUBCATEGORIES[categoryId] || DEFAULT_SUBCATEGORIES;

    const handleAdd = (product: any) => {
        const ingredient = {
            id: product.id,
            name: product.name,
            price: product.price || product.basePrice || 0,
            unit: product.unit || product.weight || '',
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
                price: product.price || product.basePrice || 0,
                unit: product.unit || product.weight || '',
                image: product.image,
                category: categoryId,
            };
            addItem(ingredient as any, qty);
        } else {
            updateQuantityByIngredientId(product.id, qty);
        }
    };

    /**
     * Interleaves products from different subcategories in a round-robin fashion.
     * Picks up to 'count' products from each subcategory per round.
     */
    const interleaveProducts = (availableProducts: any[], subcatList: any[], count: number = 2) => {
        const result: any[] = [];
        const groups: Record<string, any[]> = {};
        const others: any[] = [];

        // Group products by subcategory
        availableProducts.forEach(p => {
            const subId = p.subcategory || (Array.isArray(p.tags) && p.tags[0]) || 'other';
            if (subId === 'other') {
                others.push(p);
            } else {
                if (!groups[subId]) groups[subId] = [];
                groups[subId].push(p);
            }
        });

        // Combine subcategories from the list and from the actual data found
        const subIdsFromList = subcatList.map(s => s.id).filter(id => id !== 'all');
        const subIdsFromGroups = Object.keys(groups);
        
        // Ensure we maintain the order of the provided list, but add any extra categories found in groups
        const allSubIds = Array.from(new Set([...subIdsFromList, ...subIdsFromGroups]));
        const activeSubIds = allSubIds.filter(id => groups[id] && groups[id].length > 0);

        // Keep track of how many we've taken from each group
        const groupPointers: Record<string, number> = {};
        activeSubIds.forEach(id => groupPointers[id] = 0);
        let othersPointer = 0;

        let addedInRound = true;
        while (addedInRound) {
            addedInRound = false;

            // Round-robin through subcategories
            for (const id of activeSubIds) {
                const group = groups[id];
                const start = groupPointers[id];
                const toTake = Math.min(count, group.length - start);

                if (toTake > 0) {
                    for (let i = 0; i < toTake; i++) {
                        result.push(group[start + i]);
                    }
                    groupPointers[id] += toTake;
                    addedInRound = true;
                }
            }

            // Add some "others" if any
            if (othersPointer < others.length) {
                const toTake = Math.min(count, others.length - othersPointer);
                for (let i = 0; i < toTake; i++) {
                    result.push(others[othersPointer + i]);
                }
                othersPointer += toTake;
                addedInRound = true;
            }
        }

        return result;
    };

    const getSortedProducts = () => {
        let items = [...products]; // Use the products state, not the hardcoded PRODUCTS

        // Filter by search
        if (searchQuery) {
            items = items.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        // Filter by subcategory
        if (selectedSub !== 'all') {
            items = items.filter(p =>
                p.subcategory === selectedSub ||
                p.category === selectedSub ||
                (Array.isArray(p.tags) && p.tags.includes(selectedSub)) ||
                (Array.isArray(p.secondaryCategories) && p.secondaryCategories.includes(selectedSub))
            );
        }

        // Sort items
        switch (sortBy) {
            case 'priceLow':
                return items.sort((a, b) => (a.price || a.basePrice || 0) - (b.price || b.basePrice || 0));
            case 'priceHigh':
                return items.sort((a, b) => (b.price || b.basePrice || 0) - (a.price || a.basePrice || 0));
            case 'nameAZ':
                return items.sort((a, b) => a.name.localeCompare(b.name));
            default:
                // Special interleaving logic for 'All Items' when sorted by popularity
                if (selectedSub === 'all') {
                    return interleaveProducts(items, subcategories);
                }
                return items; // Default for specific subcategory or other cases
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
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={styles.mainContent}>
                {/* Sidebar */}
                <View style={styles.sidebar}>
                    <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(109, 240, 236, 0.67)' }]} />
                    {/* Move back button here */}
                    <TouchableOpacity
                        style={styles.sidebarBackButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Feather name="arrow-left" size={20} color={colors.primary[600]} />
                    </TouchableOpacity>

                    <FlatList
                        data={subcategories}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingTop: spacing.sm }}
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
                        <View style={styles.headerSearchContainer}>
                            <Feather name="search" size={16} color={colors.gray[400]} style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search in category..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholderTextColor={colors.gray[400]}
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchQuery('')}>
                                    <Feather name="x" size={16} color={colors.gray[400]} />
                                </TouchableOpacity>
                            )}
                        </View>
                        <TouchableOpacity
                            style={styles.filterButton}
                            onPress={() => setShowSortModal(true)}
                        >
                            <Ionicons name="options-outline" size={18} color={colors.primary[500]} />
                        </TouchableOpacity>
                    </View>
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={colors.primary[500]} />
                            <Text style={styles.loadingText}>Fetching fresh items...</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={sortedProducts}
                            numColumns={2}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderProduct}
                            contentContainerStyle={styles.gridContent}
                            showsVerticalScrollIndicator={false}
                            columnWrapperStyle={styles.columnWrapper}
                            initialNumToRender={8}
                            maxToRenderPerBatch={10}
                            windowSize={5}
                            removeClippedSubviews={true}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Feather name="search" size={48} color={colors.gray[300]} />
                                    <Text style={styles.emptyText}>No products found in this category</Text>
                                </View>
                            }
                        />
                    )}
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
        backgroundColor: colors.primary[500], // Base primary brand color
        paddingTop: spacing.xs,
    },
    sidebarItem: {
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
    sidebarItemActive: {
        // Removed white square background
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.15)', // Subtlest white for inactive circles
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    iconContainerActive: {
        backgroundColor: colors.white, // Pop white for active icon
        borderWidth: 0,
    },
    subIcon: {
        fontSize: 20,
    },
    sidebarLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center',
        paddingHorizontal: 2,
        marginTop: 2,
    },
    sidebarBackButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.sm,
        alignSelf: 'center', // Center in sidebar
        marginBottom: spacing.xs,
        ...shadow.soft,
    },
    sidebarLabelActive: {
        color: colors.white,
        fontWeight: '800',
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
        width: 40,
        height: 40,
        backgroundColor: colors.white,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadow.soft,
        borderWidth: 1,
        borderColor: colors.gray[100],
    },
    headerSearchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        marginRight: spacing.sm,
        paddingHorizontal: spacing.sm,
        height: 40,
        borderRadius: 12,
        ...shadow.soft,
        borderWidth: 1,
        borderColor: colors.gray[100],
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        fontFamily: typography.fontFamily.medium,
        color: colors.text.primary,
        padding: 0,
    },
    gridContent: {
        paddingBottom: 120, // Increased to avoid overlap with floating cart bar
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    productCardWrapper: {
        marginBottom: spacing.md,
    },
    cartBar: {
        position: 'absolute',
        bottom: 15,
        left: spacing.sm,
        right: spacing.sm,
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        fontFamily: typography.fontFamily.body,
        color: colors.gray[500],
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyText: {
        marginTop: 12,
        fontSize: 16,
        fontFamily: typography.fontFamily.body,
        color: colors.gray[400],
    },
});

export default CategoryDetailScreen;
