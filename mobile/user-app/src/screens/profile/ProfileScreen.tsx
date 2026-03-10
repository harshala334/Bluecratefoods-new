import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius, shadow } from '../../constants/spacing';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuthStore from '../../stores/authStore';

/**
 * Profile Screen
 * A premium, bento-grid styled account hub.
 */

export const ProfileScreen = ({ navigation }: any) => {
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuthStore();
  const [loading, setLoading] = React.useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'See you next time!',
        position: 'bottom',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { user });
  };

  React.useEffect(() => {
    setLoading(false);
  }, [user]);

  if (loading || authLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.guestContainer}>
            <View style={styles.guestIconContainer}>
              <Feather name="user" size={60} color={colors.primary[500]} />
            </View>
            <Text style={styles.guestTitle}>Welcome to Blue Crate</Text>
            <Text style={styles.guestSubtitle}>Ready-to-Cook. Ready-to-Love.</Text>
            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.signInButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Mock data for premium features
  const profileData = {
    ...user,
    backgroundImage: user.backgroundImage || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=200&fit=crop',
    activeOrderId: user.activeOrderId || 'ORD-12345',
    subscriptionTier: user.subscriptionTier || 'free',
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.profileHeader}>
          <ImageBackground
            source={{ uri: profileData.backgroundImage }}
            style={styles.backgroundImage}
            imageStyle={styles.backgroundImageStyle}
          >
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.6)']}
              style={styles.backgroundOverlay}
            />
          </ImageBackground>

          <View style={styles.profilePhotoContainer}>
            <Image
              source={{ uri: profileData.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}` }}
              style={styles.profilePhoto}
            />
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Feather name="edit-2" size={14} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* User Info Section */}
        <View style={styles.profileInfo}>
          <View style={styles.nameSection}>
            <Text style={styles.profileName}>{profileData.name}</Text>
          </View>
          <Text style={styles.profileEmail}>{profileData.email}</Text>

          <Text style={styles.profileBio}>{profileData.bio || 'Food enthusiast'}</Text>

          <View style={styles.badgeRow}>
            <View style={[styles.tierBadge, { backgroundColor: profileData.subscriptionTier === 'premium' ? colors.primary[50] : colors.gray[100] }]}>
              <MaterialCommunityIcons
                name={profileData.subscriptionTier === 'premium' ? "crown" : "account"}
                size={14}
                color={profileData.subscriptionTier === 'premium' ? colors.primary[600] : colors.gray[500]}
              />
              <Text style={[styles.tierBadgeText, { color: profileData.subscriptionTier === 'premium' ? colors.primary[700] : colors.gray[600] }]}>
                {profileData.subscriptionTier === 'premium' ? 'Premium Member' : 'Free Tier'}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Cards */}
        <View style={styles.actionCardsContainer}>
          {profileData.activeOrderId && (
            <TouchableOpacity
              style={styles.activeOrderCard}
              onPress={() => navigation.navigate('TrackOrder', { orderId: profileData.activeOrderId })}
            >
              <LinearGradient
                colors={[colors.primary[500], colors.primary[700]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.activeOrderGradient}
              >
                <View style={styles.activeOrderInfo}>
                  <View style={styles.activeOrderIconContainer}>
                    <MaterialCommunityIcons name="moped" size={24} color={colors.white} />
                  </View>
                  <View>
                    <Text style={styles.activeOrderTitle}>Order is on the way!</Text>
                    <Text style={styles.activeOrderSubtitle}>Arrival in ~12 mins</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.white} />
              </LinearGradient>
            </TouchableOpacity>
          )}

          {profileData.subscriptionTier !== 'premium' && (
            <TouchableOpacity
              style={styles.promoCard}
              onPress={() => navigation.navigate('Subscription')}
            >
              <View style={styles.promoContent}>
                <View style={styles.promoIconContainer}>
                  <Ionicons name="gift-outline" size={24} color="#D81B60" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.promoTitle}>Upgrade to Premium</Text>
                  <Text style={styles.promoSubtitle}>Get 2x points on every order</Text>
                </View>
                <Feather name="arrow-right" size={20} color={colors.gray[400]} />
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Bento Grid Dashboard */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dashboard</Text>
        </View>

        <View style={styles.settingsList}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('MyOrders')}
          >
            <View style={[styles.settingIconContainer, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="receipt-outline" size={22} color="#1976D2" />
            </View>
            <Text style={styles.settingText}>My Orders</Text>
            <Text style={styles.settingSubtitle}>Track & history</Text>
            <Feather name="chevron-right" size={18} color={colors.gray[400]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('Favorites')}
          >
            <View style={[styles.settingIconContainer, { backgroundColor: '#FCE4EC' }]}>
              <Ionicons name="heart-outline" size={22} color="#D81B60" />
            </View>
            <Text style={styles.settingText}>Favorites</Text>
            <Text style={styles.settingSubtitle}>Saved recipes</Text>
            <Feather name="chevron-right" size={18} color={colors.gray[400]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('ManageAddresses')}
          >
            <View style={[styles.settingIconContainer, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="location-outline" size={22} color="#388E3C" />
            </View>
            <Text style={styles.settingText}>Addresses</Text>
            <Text style={styles.settingSubtitle}>Manage locations</Text>
            <Feather name="chevron-right" size={18} color={colors.gray[400]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, { borderBottomWidth: 0 }]}
            onPress={() => navigation.navigate('Payments')}
          >
            <View style={[styles.settingIconContainer, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="card-outline" size={22} color="#F57C00" />
            </View>
            <Text style={styles.settingText}>Payments</Text>
            <Text style={styles.settingSubtitle}>Saved cards</Text>
            <Feather name="chevron-right" size={18} color={colors.gray[400]} />
          </TouchableOpacity>
        </View>

        {/* Preferences List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Preferences</Text>
        </View>

        <View style={styles.settingsList}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('NotificationSettings')}
          >
            <View style={styles.settingIconContainer}>
              <Ionicons name="notifications-outline" size={22} color={colors.gray[600]} />
            </View>
            <Text style={styles.settingText}>Notification Settings</Text>
            <Feather name="chevron-right" size={18} color={colors.gray[400]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('DietaryPreferences')}
          >
            <View style={styles.settingIconContainer}>
              <MaterialCommunityIcons name="silverware-variant" size={22} color={colors.gray[600]} />
            </View>
            <Text style={styles.settingText}>Dietary Preferences</Text>
            <Feather name="chevron-right" size={18} color={colors.gray[400]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('PrivacySecurity')}
          >
            <View style={styles.settingIconContainer}>
              <Ionicons name="shield-checkmark-outline" size={22} color={colors.gray[600]} />
            </View>
            <Text style={styles.settingText}>Privacy & Security</Text>
            <Feather name="chevron-right" size={18} color={colors.gray[400]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('HelpCenter')}
          >
            <View style={styles.settingIconContainer}>
              <Ionicons name="help-circle-outline" size={22} color={colors.gray[600]} />
            </View>
            <Text style={styles.settingText}>Help Center</Text>
            <Feather name="chevron-right" size={18} color={colors.gray[400]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, { borderBottomWidth: 0 }]}
            onPress={handleLogout}
          >
            <View style={[styles.settingIconContainer, { backgroundColor: '#FFEBEE' }]}>
              <Ionicons name="log-out-outline" size={22} color="#D32F2F" />
            </View>
            <Text style={[styles.settingText, { color: '#D32F2F', fontFamily: typography.fontFamily.bold }]}>Logout Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Blue Crate v1.0.0</Text>
          <Text style={styles.footerText}>© 2025 All rights reserved</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.white,
  },
  guestIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  guestTitle: {
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.display,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  guestSubtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.gray[500],
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  signInButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: 40,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    ...shadow.medium,
  },
  signInButtonText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },
  profileHeader: {
    position: 'relative',
    height: 180,
    backgroundColor: colors.white,
  },
  backgroundImage: {
    width: '100%',
    height: 140,
  },
  backgroundImageStyle: {
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  profilePhotoContainer: {
    position: 'absolute',
    bottom: 0,
    left: spacing.xl,
    alignItems: 'center',
  },
  profilePhoto: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: colors.white,
    backgroundColor: colors.gray[100],
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary[500],
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
    ...shadow.soft,
  },
  profileInfo: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    backgroundColor: colors.white,
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.display,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    marginBottom: spacing.md,
    fontFamily: typography.fontFamily.medium,
  },
  profileBio: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    lineHeight: 22,
    fontFamily: typography.fontFamily.body,
    marginBottom: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tierBadgeText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.bold,
  },
  actionCardsContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginTop: spacing.md,
  },
  activeOrderCard: {
    borderRadius: 20,
    overflow: 'hidden',
    ...shadow.medium,
  },
  activeOrderGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  activeOrderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  activeOrderIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeOrderTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },
  activeOrderSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: typography.fontFamily.medium,
  },
  promoCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.gray[100],
    ...shadow.soft,
  },
  promoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  promoIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FCE4EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
  },
  promoSubtitle: {
    fontSize: 12,
    color: colors.gray[500],
    fontFamily: typography.fontFamily.medium,
  },
  sectionHeader: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    letterSpacing: 0.5,
  },
  settingsList: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    borderRadius: 24,
    padding: spacing.sm,
    marginBottom: spacing.xl,
    ...shadow.soft,
    borderWidth: 1,
    borderColor: colors.gray[50],
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[50],
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.gray[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  settingText: {
    flex: 1,
    fontSize: 15,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
  },
  settingSubtitle: {
    fontSize: 12,
    color: colors.gray[500],
    fontFamily: typography.fontFamily.medium,
    marginRight: spacing.sm,
  },
  footer: {
    alignItems: 'center',
    padding: spacing.xl,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 11,
    color: colors.gray[400],
    marginBottom: 2,
    letterSpacing: 0.3,
  },
});

export default ProfileScreen;
