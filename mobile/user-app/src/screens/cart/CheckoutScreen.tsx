import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCartStore } from '../../stores/cartStore';
import { useOrderStore } from '../../stores/orderStore';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius, shadow } from '../../constants/spacing';
import { formatPrice } from '../../utils/formatters';

const { width } = Dimensions.get('window');

/**
 * Checkout Screen
 * Displays order summary and payment options
 * Refined for premium design consistency
 */

const PAYMENT_METHODS = [
  { id: 'card', name: 'Credit/Debit Card', icon: 'credit-card', provider: 'Feather', disabled: true },
  { id: 'upi', name: 'UPI (GPay, PhonePe)', icon: 'smartphone', provider: 'Feather', disabled: true },
  { id: 'netbanking', name: 'Net Banking', icon: 'account-balance', provider: 'Material', disabled: true },
  { id: 'wallet', name: 'Wallets', icon: 'account-balance-wallet', provider: 'Material', disabled: true },
  { id: 'cod', name: 'Cash on Delivery', icon: 'dollar-sign', provider: 'Feather', disabled: false },
];

export const CheckoutScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { items, getCartSummary, clearCart } = useCartStore();
  const { placeOrder } = useOrderStore();
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
        'Order Placed! 🥳',
        'Your order has been sent to the kitchen and will reach you in 10-15 mins.',
        [
          {
            text: 'Track Order',
            onPress: async () => {
              await clearCart();
              navigation.navigate('TrackOrder');
            },
          },
        ]
      );
    }, 1500);
  };

  const renderPaymentIcon = (method: typeof PAYMENT_METHODS[0]) => {
    if (method.provider === 'Feather') {
      return <Feather name={method.icon as any} size={20} color={method.disabled ? colors.gray[400] : colors.primary[600]} />;
    }
    return <MaterialCommunityIcons name={method.icon as any} size={22} color={method.disabled ? colors.gray[400] : colors.primary[600]} />;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery Address Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.addressInfo}>
              <View style={styles.addressIconContainer}>
                <Feather name="home" size={20} color={colors.primary[600]} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.addressTypeHeader}>
                  <Text style={styles.addressLabel}>Home (Primary)</Text>
                  <TouchableOpacity>
                    <Text style={styles.changeAddressText}>Change</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.addressText}>
                  123, Green Street, Blue Crate Apartments{"\n"}
                  Indiranagar, Bangalore - 560038
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Options Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentCard}>
            {PAYMENT_METHODS.map((method, index) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentOption,
                  index === PAYMENT_METHODS.length - 1 && { borderBottomWidth: 0 },
                  method.disabled && styles.disabledPaymentOption,
                ]}
                onPress={() => !method.disabled && setSelectedPayment(method.id)}
                disabled={method.disabled}
              >
                <View style={styles.paymentOptionLeft}>
                  <View style={[styles.paymentIconContainer, method.disabled && { backgroundColor: colors.gray[50] }]}>
                    {renderPaymentIcon(method)}
                  </View>
                  <Text style={[
                    styles.paymentName,
                    method.disabled && styles.disabledText
                  ]}>
                    {method.name}
                  </Text>
                </View>

                {method.disabled ? (
                  <Text style={styles.comingSoonText}>Soon</Text>
                ) : (
                  <View style={[
                    styles.radioButton,
                    selectedPayment === method.id && styles.radioButtonActive
                  ]}>
                    {selectedPayment === method.id && <View style={styles.radioButtonInner} />}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.infoCard}>
          <Feather name="info" size={18} color={colors.primary[600]} />
          <Text style={styles.infoText}>
            Blue Crate ensures all deliveries are contact-less and ingredients are farm-fresh sourced.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
        <View style={styles.footerContent}>
          <View>
            <Text style={styles.footerTotalLabel}>Total Amount</Text>
            <Text style={styles.footerTotalValue}>{formatPrice(total)}</Text>
          </View>

          <TouchableOpacity
            style={styles.placeOrderButton}
            onPress={handlePlaceOrder}
            disabled={isProcessing}
          >
            <LinearGradient
              colors={[colors.primary[600], colors.primary[700]]}
              style={styles.placeOrderGradient}
            >
              <Text style={styles.placeOrderButtonText}>
                {isProcessing ? 'Processing' : 'Place Order'}
              </Text>
              <Feather name="check-circle" size={18} color={colors.white} />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background.primary,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: colors.white,
    ...shadow.soft,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 150,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    ...shadow.soft,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  addressInfo: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  addressIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  addressLabel: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
  },
  changeAddressText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary[600],
    fontFamily: typography.fontFamily.bold,
  },
  addressText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    lineHeight: 20,
    fontFamily: typography.fontFamily.medium,
  },
  paymentCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    ...shadow.soft,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
    overflow: 'hidden',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[50],
  },
  disabledPaymentOption: {
    opacity: 0.6,
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentName: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    fontFamily: typography.fontFamily.semibold,
  },
  comingSoonText: {
    fontSize: 10,
    color: colors.gray[400],
    fontFamily: typography.fontFamily.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    backgroundColor: colors.gray[50],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  disabledText: {
    color: colors.gray[400],
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonActive: {
    borderColor: colors.primary[600],
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary[600],
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(20, 184, 166, 0.05)',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.1)',
  },
  infoText: {
    fontSize: 12,
    color: colors.primary[700],
    fontFamily: typography.fontFamily.medium,
    flex: 1,
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    ...shadow.hard,
    paddingTop: spacing.lg,
  },
  footerContent: {
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerTotalLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    fontFamily: typography.fontFamily.medium,
    marginBottom: 2,
  },
  footerTotalValue: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
  },
  placeOrderButton: {
    flex: 1,
    marginLeft: spacing.xl,
  },
  placeOrderGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: borderRadius.xl,
    gap: 8,
    ...shadow.medium,
  },
  placeOrderButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
  },
});

export default CheckoutScreen;
