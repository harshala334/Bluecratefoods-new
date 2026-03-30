import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCartStore } from '../../stores/cartStore';
import useAuthStore from '../../stores/authStore';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius, shadow } from '../../constants/spacing';
import { formatPrice } from '../../utils/formatters';
import { useLocationStore } from '../../stores/locationStore';

const { width } = Dimensions.get('window');

/**
 * Cart Screen
 * Shows cart items with quantity controls and checkout button
 * Updated with premium aesthetics and modern iconography
 */

export const CartScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { items, updateQuantity, removeItem, getCartSummary } = useCartStore();
  const { location } = useLocationStore();
  const { isGuest, isAuthenticated } = useAuthStore();
  const isServiceable = location?.toLowerCase().includes('kolkata');

  const { subtotal, deliveryFee, tax, total } = getCartSummary();

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty < 1) {
      removeItem(id);
    } else {
      updateQuantity(id, newQty);
    }
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <MaterialCommunityIcons
            name={isServiceable ? "cart-off" : "clipboard-text-outline"}
            size={60}
            color={colors.primary[300]}
          />
        </View>
        <Text style={styles.emptyTitle}>
          {isServiceable ? 'Your Cart is Empty' : 'Your Shop List is Empty'}
        </Text>
        <Text style={styles.emptyText}>
          {isServiceable
            ? 'Looks like you haven\'t added any delicious items yet.'
            : 'Add ingredients from recipes to your shopping list!'}
        </Text>
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => navigation.navigate('ProductsTab')}
        >
          <LinearGradient
            colors={[colors.primary[600], colors.primary[700]]}
            style={styles.browseButtonGradient}
          >
            <Text style={styles.browseButtonText}>Start Shopping</Text>
            <Feather name="arrow-right" size={20} color={colors.white} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <View style={styles.itemCountBadge}>
          <Text style={styles.itemCountText}>
            {items.length} {items.length === 1 ? 'Item' : 'Items'}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.itemsContainer}>
          {items.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <View style={styles.imageContainer}>
                {item.ingredient.image ? (
                  <Image source={{ uri: item.ingredient.image }} style={styles.itemImage} />
                ) : (
                  <View style={styles.itemPlaceholderImage}>
                    <Text style={styles.itemImageEmoji}>🍳</Text>
                  </View>
                )}
              </View>

              <View style={styles.itemInfo}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.ingredient.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => removeItem(item.id)}
                    style={styles.removeButton}
                  >
                    <Feather name="trash-2" size={18} color={colors.red[400]} />
                  </TouchableOpacity>
                </View>

                {item.recipeName && (
                  <View style={styles.recipeTag}>
                    <Feather name="book-open" size={10} color={colors.gray[400]} />
                    <Text style={styles.recipeTagName}>{item.recipeName}</Text>
                  </View>
                )}

                <View style={styles.itemFooter}>
                  <Text style={styles.itemPrice}>{formatPrice(item.ingredient.price)}</Text>

                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      style={styles.quantityButton}
                    >
                      <Feather name="minus" size={14} color={colors.primary[700]} />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      style={styles.quantityButton}
                    >
                      <Feather name="plus" size={14} color={colors.primary[700]} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Support Banner */}
        <View style={styles.supportBanner}>
          <Feather name="shield" size={20} color={colors.primary[600]} />
          <Text style={styles.supportText}>Safe & Secure Checkout • 100% Quality Assurance</Text>
        </View>
      </ScrollView>

      {/* Order Summary */}
      <View style={[styles.summaryContainer, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
        {!isServiceable && (
          <View style={styles.listModeBanner}>
            <MaterialCommunityIcons name="information-outline" size={16} color={colors.primary[700]} />
            <Text style={styles.listModeText}>
              Shopping List Mode: Take this list to your store!
            </Text>
          </View>
        )}

        <View style={styles.summaryContent}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
          </View>

          {isServiceable && (
            <>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={[styles.summaryValue, deliveryFee === 0 && { color: colors.green[600] }]}>
                  {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                </Text>
              </View>
            </>
          )}

          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.inclTax}>Incl. all taxes</Text>
            </View>
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </View>

          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => {
              if (isServiceable) {
                if (isGuest || !isAuthenticated) {
                  navigation.navigate('Login');
                } else {
                  navigation.navigate('Checkout');
                }
              } else {
                alert('Sharing your shopping list...');
              }
            }}
          >
            <LinearGradient
              colors={[colors.primary[600], colors.primary[700]]}
              style={styles.checkoutGradient}
            >
              <Text style={styles.checkoutButtonText}>
                {isServiceable ? 'Proceed to Checkout' : 'Share Shopping List'}
              </Text>
              <Feather name="chevron-right" size={20} color={colors.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.background.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
  },
  itemCountBadge: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  itemCountText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary[700],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background.primary,
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    ...shadow.soft,
  },
  emptyTitle: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.gray[500],
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
    lineHeight: 22,
  },
  browseButton: {
    width: '100%',
    maxWidth: 250,
  },
  browseButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: borderRadius.full,
    gap: 8,
    ...shadow.medium,
  },
  browseButtonText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  itemsContainer: {
    padding: spacing.lg,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow.soft,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.gray[50],
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  itemPlaceholderImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[50],
  },
  itemImageEmoji: {
    fontSize: 32,
  },
  itemInfo: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing.sm,
  },
  recipeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  recipeTagName: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
    fontFamily: typography.fontFamily.medium,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  itemPrice: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary[600],
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.full,
    padding: 3,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
  },
  quantityText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary[700],
    minWidth: 32,
    textAlign: 'center',
  },
  removeButton: {
    padding: 2,
  },
  supportBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 184, 166, 0.05)',
    marginHorizontal: spacing.lg,
    padding: 12,
    borderRadius: borderRadius.lg,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.1)',
  },
  supportText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary[700],
    fontFamily: typography.fontFamily.medium,
    flex: 1,
  },
  summaryContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    ...shadow.hard,
    paddingTop: spacing.lg,
  },
  listModeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: 10,
    borderRadius: 12,
    gap: 8,
  },
  listModeText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary[800],
  },
  summaryContent: {
    paddingHorizontal: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    fontFamily: typography.fontFamily.medium,
  },
  summaryValue: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[50],
  },
  totalLabel: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
  },
  inclTax: {
    fontSize: 10,
    color: colors.gray[400],
    fontFamily: typography.fontFamily.medium,
  },
  totalValue: {
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.primary[600],
  },
  checkoutButton: {
    width: '100%',
  },
  checkoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: borderRadius.xl,
    gap: 10,
    ...shadow.medium,
  },
  checkoutButtonText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },
});

export default CartScreen;
