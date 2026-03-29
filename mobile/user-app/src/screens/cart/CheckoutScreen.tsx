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
  { id: 'upi', name: 'UPI (GPay, PhonePe, etc.)', icon: 'smartphone', provider: 'Feather', disabled: false },
  { id: 'card', name: 'Credit/Debit Card', icon: 'credit-card', provider: 'Feather', disabled: false },
  { id: 'netbanking', name: 'Net Banking', icon: 'bank', provider: 'Material', disabled: false },
  { id: 'wallet', name: 'Wallets / PayLater', icon: 'wallet', provider: 'Material', disabled: false },
  { id: 'cod', name: 'Cash on Delivery', icon: 'dollar-sign', provider: 'Feather', disabled: false },
];

import Constants from 'expo-constants';
import { RazorpayCheckout } from '../../utils/authProvider';
import useAuthStore from '../../stores/authStore';
import { API_CONFIG } from '../../constants/config';
import axios from 'axios';

const RAZORPAY_KEY_ID = Constants.expoConfig?.extra?.RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID';

export const CheckoutScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { items, getCartSummary, clearCart } = useCartStore();
  const { placeOrder } = useOrderStore();
  const { user, selectedAddress } = useAuthStore();
  const { total } = getCartSummary();
  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = async () => {
    if (selectedPayment === 'cod') {
      await handleCodOrder();
    } else {
      await handleRazorpayPayment();
    }
  };

  const handleCodOrder = async () => {
    setIsProcessing(true);
    try {
      await placeOrder(items, total, {
        name: user?.name || 'Guest User',
        address: selectedAddress ? `${selectedAddress.addressLine1}, ${selectedAddress.addressLine2 ? selectedAddress.addressLine2 + ', ' : ''}${selectedAddress.city}` : '181, Becharam Chatterjee Road, Behala, Kolkata-700061',
        phone: user?.phone || '9591890828',
        email: user?.email || 'guest@example.com'
      });

      setIsProcessing(false);
      showSuccessAlert();
    } catch (err) {
      setIsProcessing(false);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    }
  };

  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    try {
      // 1. Create Order on Backend
      const { data: rzpOrder } = await axios.post(`${API_CONFIG.BASE_URL}/auth/payment/create-order`, {
        amount: total,
        userId: user?.id || 'guest',
      });

      // 2. Open Razorpay Checkout
      const options = {
        description: 'Quality Meal Kits & Ingredients',
        image: 'https://bluecratefoods.com/BCF_logo.png',
        currency: rzpOrder.currency,
        key: RAZORPAY_KEY_ID,
        amount: rzpOrder.amount,
        name: 'BlueCrate Foods',
        order_id: rzpOrder.id,
        prefill: {
          email: user?.email || '',
          contact: user?.phone || '',
          name: user?.name || ''
        },
        theme: { color: colors.primary[600] }
      };

      const response = await RazorpayCheckout.open(options);

      // 3. Verify Signature on Backend
      const { data: verification } = await axios.post(`${API_CONFIG.BASE_URL}/auth/payment/verify-signature`, {
        orderId: rzpOrder.id,
        paymentId: response.razorpay_payment_id,
        signature: response.razorpay_signature,
        userId: user?.id || 'guest',
        items,
        amount: total,
      });

      if (verification.success) {
        // 4. Record order in our system
        await placeOrder(items, total, {
          name: user?.name || 'Guest User',
          address: selectedAddress ? `${selectedAddress.addressLine1}, ${selectedAddress.addressLine2 ? selectedAddress.addressLine2 + ', ' : ''}${selectedAddress.city}` : '181, Becharam Chatterjee Road, Behala, Kolkata-700061',
          phone: user?.phone || '9591890828',
          email: user?.email || 'guest@example.com'
        });
        setIsProcessing(false);
        showSuccessAlert();
      }
    } catch (error: any) {
      setIsProcessing(false);
      console.error('Payment Error:', error);
      Alert.alert('Payment Failed', error.description || 'Transaction was not successful.');
    }
  };

  const showSuccessAlert = () => {
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
  };

  const renderPaymentIcon = (method: typeof PAYMENT_METHODS[0]) => {
    if (method.provider === 'Feather') {
      return <Feather name={method.icon as any} size={20} color={method.disabled ? colors.gray[400] : colors.primary[600]} />;
    }
    return <MaterialCommunityIcons name={method.icon as any} size={22} color={method.disabled ? colors.gray[400] : colors.primary[600]} />;
  };

  return (
    <View style={styles.container}>


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
                  <Text style={styles.addressLabel}>{selectedAddress?.label || 'Home'} (Primary)</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Location')}>
                    <Text style={styles.changeAddressText}>Change</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.addressText}>
                  {selectedAddress ? (
                    `${selectedAddress.addressLine1}${selectedAddress.addressLine2 ? '\n' + selectedAddress.addressLine2 : ''}\n${selectedAddress.city} ${selectedAddress.zipCode}`
                  ) : (
                    "123, Green Street, Blue Crate Apartments\nIndiranagar, Bangalore - 560038"
                  )}
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
