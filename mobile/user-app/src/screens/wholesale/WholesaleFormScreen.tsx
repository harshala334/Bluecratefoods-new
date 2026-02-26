import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors } from '../../constants/colors';
import { typography, textStyles } from '../../constants/typography';
import { spacing, borderRadius, shadow } from '../../constants/spacing';

export const WholesaleFormScreen = ({ navigation }: any) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    businessName: '',
    businessType: '',
    location: '',
    interests: [] as string[],
    dailyRequirement: '',
    acceptTC: false,
  });

  const [showBusinessTypes, setShowBusinessTypes] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);

  const businessTypes = [
    'Restaurant',
    'Café',
    'Cloud Kitchen',
    'Catering Service',
    'Hotel',
    'Other',
  ];

  const interestOptions = [
    'Veg Frozen Items',
    'Chicken Products',
    'Seafood (Fish & Prawns)',
    'Momos',
    'Other products we can add',
  ];

  const requirementOptions = [
    '1–5 kg',
    '5–15 kg',
    '15–30 kg',
    '30+ kg',
  ];

  const deliveryFeatures = [
    { icon: '❄️', title: 'Cold-chain delivery' },
    { icon: '📦', title: 'Bulk order support' },
    { icon: '👤', title: 'Dedicated account manager' },
    { icon: '💰', title: 'Special rates for regular clients' },
  ];

  const handleInterestToggle = (interest: string) => {
    const currentInterests = formData.interests as string[];
    if (currentInterests.includes(interest)) {
      setFormData({
        ...formData,
        interests: currentInterests.filter((item) => item !== interest),
      });
    } else {
      setFormData({
        ...formData,
        interests: [...currentInterests, interest],
      });
    }
  };

  const handleSubmit = () => {
    if (!formData.phoneNumber.trim()) {
      Alert.alert('Required Field', 'Phone number is required');
      return;
    }

    if (!formData.acceptTC) {
      Alert.alert('Terms & Conditions', 'Please accept the terms and conditions');
      return;
    }

    // Handle form submission here
    Alert.alert('Success', 'Your wholesale inquiry has been submitted! We will contact you soon.');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title as any}>Get Wholesale Pricing</Text>
        <Text style={styles.subtitle}>
          Fill out the form below and our team will contact you with special wholesale rates
        </Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {/* Full Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.textInput}
            value={formData.fullName}
            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            placeholder="Enter your full name"
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        {/* Phone Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Phone Number <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.textInput}
            value={formData.phoneNumber}
            onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
            placeholder="Enter your phone number"
            placeholderTextColor={colors.gray[400]}
            keyboardType="phone-pad"
          />
        </View>

        {/* Business Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Business Name</Text>
          <TextInput
            style={styles.textInput}
            value={formData.businessName}
            onChangeText={(text) => setFormData({ ...formData, businessName: text })}
            placeholder="Enter your business name"
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        {/* Type of Business */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Type of Business</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowBusinessTypes(!showBusinessTypes)}
          >
            <Text style={[styles.dropdownText, !formData.businessType && styles.placeholder]}>
              {formData.businessType || 'Select business type'}
            </Text>
            <Text style={styles.dropdownArrow}>{showBusinessTypes ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {showBusinessTypes && (
            <View style={styles.dropdownList}>
              {businessTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setFormData({ ...formData, businessType: type });
                    setShowBusinessTypes(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Location */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Your Location (City / Area)</Text>
          <TextInput
            style={styles.textInput}
            value={formData.location}
            onChangeText={(text) => setFormData({ ...formData, location: text })}
            placeholder="Enter your city or area"
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        {/* What Are You Interested In */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>What Are You Interested In?</Text>
          <View style={styles.checkboxGroup}>
            {interestOptions.map((interest) => (
              <TouchableOpacity
                key={interest}
                style={styles.checkboxItem}
                onPress={() => handleInterestToggle(interest)}
              >
                <View style={[
                  styles.checkbox,
                  (formData.interests as string[]).includes(interest) && styles.checkboxSelected
                ]}>
                  {(formData.interests as string[]).includes(interest) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
                <Text style={styles.checkboxLabel}>{interest}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Daily/Weekly Requirement */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Daily/Weekly Requirement</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowRequirements(!showRequirements)}
          >
            <Text style={[styles.dropdownText, !formData.dailyRequirement && styles.placeholder]}>
              {formData.dailyRequirement || 'Select requirement range'}
            </Text>
            <Text style={styles.dropdownArrow}>{showRequirements ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {showRequirements && (
            <View style={styles.dropdownList}>
              {requirementOptions.map((req) => (
                <TouchableOpacity
                  key={req}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setFormData({ ...formData, dailyRequirement: req });
                    setShowRequirements(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{req}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Terms & Conditions */}
        <TouchableOpacity
          style={styles.tcContainer}
          onPress={() => setFormData({ ...formData, acceptTC: !formData.acceptTC })}
        >
          <View style={[styles.checkbox, formData.acceptTC && styles.checkboxSelected]}>
            {formData.acceptTC && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.tcText}>Accept Terms & Conditions</Text>
        </TouchableOpacity>
      </View>

      {/* Delivery Features */}
      <View style={styles.featuresSection}>
        <Text style={styles.featuresTitle as any}>Fast Delivery Across the City</Text>
        <View style={styles.featuresList}>
          {deliveryFeatures.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureText}>{feature.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Get Wholesale Pricing</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
  },
  title: {
    ...textStyles.h2,
    textAlign: 'center',
    marginBottom: spacing.md,
    color: colors.primary[700],
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.gray[600],
    textAlign: 'center',
    maxWidth: '90%',
  },
  form: {
    padding: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  required: {
    color: colors.red[500],
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    backgroundColor: colors.white,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  placeholder: {
    color: colors.gray[400],
  },
  dropdownArrow: {
    fontSize: 12,
    color: colors.gray[500],
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    marginTop: spacing.xs,
    ...shadow.soft,
  },
  dropdownItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  dropdownItemText: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  checkboxGroup: {
    gap: spacing.sm,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.gray[300],
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  checkboxSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  checkmark: {
    color: colors.white,
    fontSize: 14,
    fontFamily: typography.fontFamily.bold,
  },
  checkboxLabel: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    flex: 1,
  },
  tcContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  tcText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  featuresSection: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    margin: spacing.lg,
    borderRadius: borderRadius.xl,
    ...shadow.soft,
  },
  featuresTitle: {
    ...textStyles.h3,
    textAlign: 'center',
    marginBottom: spacing.lg,
    color: colors.primary[700],
  },
  featuresList: {
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureText: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    fontFamily: typography.fontFamily.medium,
  },
  buttonContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  submitButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    ...shadow.medium,
  },
  submitButtonText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },
});

export default WholesaleFormScreen;