import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useCartStore } from '../../stores/cartStore';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius } from '../../constants/spacing';
import { formatPrice } from '../../utils/formatters';
import { useLocationStore } from '../../stores/locationStore';

/**
 * Cart Screen
 * Shows cart items with quantity controls and checkout button
 */

export const CartScreen = ({ navigation }: any) => {
  const { items, updateQuantity, removeItem, getCartSummary } = useCartStore();
  const { location } = useLocationStore();
  const isServiceable = location?.toLowerCase().includes('kolkata');

  const { subtotal, deliveryFee, tax, total } = getCartSummary();

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>{isServiceable ? '🛒' : '📝'}</Text>
        <Text style={styles.emptyTitle}>{isServiceable ? 'Your Cart is Empty' : 'Your Shop List is Empty'}</Text>
        <Text style={styles.emptyText}>
          {isServiceable ? 'Add some delicious recipes to get started!' : 'Add ingredients from recipes to your shopping list!'}
        </Text>
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => navigation.navigate('RecipesTab')}
        >
          <Text style={styles.browseButtonText}>Browse Recipes</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ... (ScrollView content) ... */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.itemsContainer}>
          <Text style={styles.itemCount}>
            {items.length} Item{items.length !== 1 ? 's' : ''}
          </Text>

          {items.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <View style={styles.itemPlaceholderImage}>
                <Text style={styles.itemImageEmoji}>🍳</Text>
              </View>

              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>
                  {item.ingredient.name}
                  {item.recipeName && (
                    <Text style={styles.recipeTag}> • {item.recipeName}</Text>
                  )}
                </Text>
                <Text style={styles.itemPrice}>{formatPrice(item.ingredient.price)}</Text>

                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => removeItem(item.id)}
                style={styles.removeButton}
              >
                <Text style={styles.removeIcon}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Order Summary */}
      <View style={styles.summaryContainer}>
        {/* Warning if not serviceable */}
        {!isServiceable && (
          <View style={{ marginBottom: spacing.md, backgroundColor: colors.primary[50], padding: spacing.sm, borderRadius: borderRadius.md }}>
            <Text style={{ color: colors.primary[800], textAlign: 'center', fontSize: typography.fontSize.sm, fontWeight: '700' }}>
              Shopping List Mode
            </Text>
            <Text style={{ color: colors.primary[700], textAlign: 'center', fontSize: typography.fontSize.xs }}>
              Take this list to your local store or share it!
            </Text>
          </View>
        )}

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Estimated Price</Text>
          <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
        </View>
        {isServiceable && (
          <>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>{formatPrice(deliveryFee)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>{formatPrice(tax)}</Text>
            </View>
          </>
        )}
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatPrice(total)}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => {
            if (isServiceable) {
              navigation.navigate('Checkout');
            } else {
              // Mock share functionality
              alert('Sharing your shopping list...');
            }
          }}
        >
          <Text style={styles.checkoutButtonText}>
            {isServiceable ? 'Proceed to Checkout' : 'Share Shopping List'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background.primary,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    fontWeight: '700' as const,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.fontSize.lg,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  browseButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
  },
  browseButtonText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    fontWeight: '700' as const,
    color: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  itemsContainer: {
    padding: spacing.lg,
  },
  itemCount: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[200],
  },
  itemPlaceholderImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImageEmoji: {
    fontSize: 40,
  },
  itemInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  itemName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semibold,
    color: colors.text.primary,
    marginBottom: 4,
  },
  recipeTag: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
  },
  itemPrice: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    fontWeight: '700' as const,
    color: colors.primary[600],
    marginBottom: spacing.sm,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
  },
  quantityText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semibold,
    minWidth: 30,
    textAlign: 'center',
  },
  removeButton: {
    padding: spacing.sm,
  },
  removeIcon: {
    fontSize: 20,
  },
  summaryContainer: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: typography.fontSize.base,
    color: colors.gray[600],
  },
  summaryValue: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingTop: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  totalLabel: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    fontWeight: '700' as const,
    color: colors.text.primary,
  },
  totalValue: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    fontWeight: '700' as const,
    color: colors.primary[600],
  },
  checkoutButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    fontWeight: '700' as const,
    color: colors.white,
  },
});

export default CartScreen;
