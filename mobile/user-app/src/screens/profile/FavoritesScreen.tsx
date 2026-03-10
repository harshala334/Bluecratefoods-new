import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, shadow } from '../../constants/spacing';
import { Feather, Ionicons } from '@expo/vector-icons';

const MOCK_FAVORITES = [
    {
        id: '1',
        name: 'Butter Chicken Meal Kit',
        category: 'Indian',
        image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=400&fit=crop',
        rating: 4.8,
        reviews: 124,
    },
    {
        id: '2',
        name: 'Quinoa Buddha Bowl',
        category: 'Healthy',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
        rating: 4.9,
        reviews: 89,
    },
    {
        id: '3',
        name: 'Homemade Pasta Kit',
        category: 'Italian',
        image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=400&h=400&fit=crop',
        rating: 4.7,
        reviews: 210,
    },
];

export const FavoritesScreen = ({ navigation }: any) => {
    const renderItem = ({ item }: { item: typeof MOCK_FAVORITES[0] }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ProductsTab', { screen: 'ProductDetail', params: { id: item.id } })}
        >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <TouchableOpacity style={styles.heartButton}>
                <Ionicons name="heart" size={20} color="#D32F2F" />
            </TouchableOpacity>

            <View style={styles.cardInfo}>
                <Text style={styles.cardCategory}>{item.category}</Text>
                <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color="#FFB300" />
                    <Text style={styles.ratingText}>{item.rating} ({item.reviews} reviews)</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="chevron-left" size={24} color={colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Favorites</Text>
                <View style={{ width: 40 }} />
            </View>

            {MOCK_FAVORITES.length > 0 ? (
                <FlatList
                    data={MOCK_FAVORITES}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconCircle}>
                        <Ionicons name="heart-outline" size={60} color={colors.gray[300]} />
                    </View>
                    <Text style={styles.emptyTitle}>No Favorites Yet</Text>
                    <Text style={styles.emptySubtitle}>Start hearting recipes and kits you love to see them here.</Text>
                    <TouchableOpacity
                        style={styles.browseButton}
                        onPress={() => navigation.navigate('ProductsTab')}
                    >
                        <Text style={styles.browseButtonText}>Browse Menu</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.gray[50],
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.white,
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
    listContent: {
        padding: spacing.md,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    card: {
        width: '48%',
        backgroundColor: colors.white,
        borderRadius: 20,
        overflow: 'hidden',
        ...shadow.soft,
    },
    cardImage: {
        width: '100%',
        height: 150,
    },
    heartButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255,255,255,0.9)',
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadow.soft,
    },
    cardInfo: {
        padding: spacing.md,
    },
    cardCategory: {
        fontSize: 10,
        fontFamily: typography.fontFamily.bold,
        color: colors.primary[600],
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    cardName: {
        fontSize: 15,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
        marginBottom: 4,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 12,
        color: colors.gray[500],
        fontFamily: typography.fontFamily.medium,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl * 2,
    },
    emptyIconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
        ...shadow.soft,
    },
    emptyTitle: {
        fontSize: 20,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    emptySubtitle: {
        fontSize: 14,
        color: colors.gray[500],
        textAlign: 'center',
        lineHeight: 20,
        fontFamily: typography.fontFamily.medium,
    },
    browseButton: {
        marginTop: spacing.xl,
        backgroundColor: colors.primary[500],
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 30,
        ...shadow.medium,
    },
    browseButtonText: {
        color: colors.white,
        fontSize: 16,
        fontFamily: typography.fontFamily.bold,
    },
});

export default FavoritesScreen;
