import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCartStore } from '../../stores/cartStore';
import { useOrderStore } from '../../stores/orderStore';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius } from '../../constants/spacing';
import { formatPrice } from '../../utils/formatters';

/**
 * Checkout Screen
 * Displays order summary and payment options
 */

const PAYMENT_METHODS = [
  { id: 'card', name: 'Credit/Debit Card', icon: '💳', disabled: true },
  { id: 'upi', name: 'UPI (GPay, PhonePe)', icon: '📱', disabled: true },
  { id: 'netbanking', name: 'Net Banking', icon: '🏦', disabled: true },
  { id: 'wallet', name: 'Wallets', icon: '👛', disabled: true },
  { id: 'cod', name: 'Cash on Delivery', icon: '💵', disabled: false },
];

export const CheckoutScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { items, getCartSummary, clearCart } = useCartStore(); // Added items destructuring
  const { placeOrder } = useOrderStore(); // Hook order store
  const { total } = getCartSummary();
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    // Simulate API call
    setTimeout(async () => {
      // Create the order in our OrderStore (Database)
      await placeOrder(items, total);

      setIsProcessing(false);
      Alert.alert(
        'Order Placed!',
        'Your order has been sent to the kitchen.',
        [
          {
            text: 'Track Order',
            onPress: async () => {
              await clearCart();
              // Navigate to the new Track Order screen
              navigation.navigate('TrackOrder');
            },
          },
        ]
      );
    }, 1500);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.card}>
            <View style={styles.addressHeader}>
              <Text style={styles.addressLabel}>Home</Text>
              <Text style={styles.changeAddressText}>Change</Text>
            </View>
            <Text style={styles.addressText}>
              123, Green Street, Blue Crate Apartments{"\n"}
              Indiranagar, Bangalore - 560038
            </Text>
          </View>
        </View>

        {/* Payment Options Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.card}>
            {PAYMENT_METHODS.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentOption,
                  selectedPayment === method.id && styles.selectedPaymentOption,
                  method.disabled && styles.disabledPaymentOption,
                ]}
                onPress={() => !method.disabled && setSelectedPayment(method.id)}
                disabled={method.disabled}
              >
                <View style={styles.paymentOptionLeft}>
                  <Text style={[
                    styles.paymentIcon,
                    method.disabled && styles.disabledText
                  ]}>
                    {method.icon}
                  </Text>
                  <Text style={[
                    styles.paymentName,
                    method.disabled && styles.disabledText
                  ]}>
                    {method.name}
                  </Text>
                </View>

                <View style={styles.radioButton}>
                  {selectedPayment === method.id && <View style={styles.radioButtonSelected} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Order Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.card}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>{formatPrice(total)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View>
            <Text style={styles.footerTotalLabel}>Total to Pay</Text>
            <Text style={styles.footerTotalValue}>{formatPrice(total)}</Text>
          </View>

          <TouchableOpacity
            style={[styles.placeOrderButton, isProcessing && styles.placeOrderButtonDisabled]}
            onPress={handlePlaceOrder}
            disabled={isProcessing}
          >
            <Text style={styles.placeOrderButtonText}>
              {isProcessing ? 'Processing...' : 'Place Order'}
            </Text>
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
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 100, // Space for footer
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  // Address Styles
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  addressLabel: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
    fontWeight: '700',
    color: colors.text.primary,
  },
  changeAddressText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary[600],
    fontFamily: typography.fontFamily.medium,
  },
  addressText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    lineHeight: 20,
  },
  // Payment Styles
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  selectedPaymentOption: {
    // Optional: Add specific style for selected container
  },
  disabledPaymentOption: {
    opacity: 0.5,
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  paymentIcon: {
    fontSize: 24,
  },
  paymentName: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    fontFamily: typography.fontFamily.medium,
  },
  disabledText: {
    color: colors.gray[400],
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary[500],
  },
  // Summary Styles
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
  },
  totalValue: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    fontWeight: '700',
    color: colors.text.primary,
  },
  // Footer Styles
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  footerContent: {
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerTotalLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    marginBottom: 2,
  },
  footerTotalValue: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    fontWeight: '700',
    color: colors.text.primary,
  },
  placeOrderButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    minWidth: 150,
    alignItems: 'center',
  },
  placeOrderButtonDisabled: {
    backgroundColor: colors.gray[400],
  },
  placeOrderButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    fontWeight: '700',
  },
});

export default CheckoutScreen;
