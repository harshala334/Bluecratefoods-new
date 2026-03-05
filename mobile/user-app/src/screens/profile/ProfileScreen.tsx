import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { storage } from '../../utils/storage';
import { STORAGE_KEYS } from '../../constants/config';
import { authService } from '../../services/authService';
import Toast from 'react-native-toast-message';
import { colors } from '../../constants/colors';
import { typography, textStyles } from '../../constants/typography';
import { spacing, borderRadius, shadow } from '../../constants/spacing';
import { User } from '../../types/user';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuthStore from '../../stores/authStore';

const { width } = Dimensions.get('window');

/**
 * Profile Screen
 */

export const ProfileScreen = ({ navigation }: any) => {
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuthStore();
  const [loading, setLoading] = React.useState(true);
  const [userRecipes, setUserRecipes] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (user?.id) {
      fetchUserRecipes(user.id);
    }
    setLoading(false);
  }, [user]);

  const fetchUserRecipes = async (userId: string) => {
    try {
      const { recipes } = await import('../../services/recipeService').then(m => m.recipeService.getRecipes({ authorId: userId }));
      setUserRecipes(recipes.map(r => ({
        id: r.id.toString(),
        title: r.name,
        image: r.image || 'https://images.unsplash.com/photo-1495195129352-aec325b55b65?w=200', // Fallback food image
        views: r.reviews.toString(),
        likes: r.rating ? (r.rating * 10).toFixed(0) : '0',
        cookTime: r.time,
        isApproved: r.isApproved,
        status: r.status
      })));
    } catch (error) {
      console.error('Failed to fetch user recipes', error);
    }
  };

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

  const handleApplyCreator = async () => {
    if (user?.id) {
      navigation.navigate('CreatorApplication', { userId: user.id });
    }
  };

  const handleDeleteRecipe = (recipeId: string) => {
    Alert.alert(
      'Delete Recipe',
      'Are you sure you want to delete this recipe? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { recipeService } = await import('../../services/recipeService');
              await recipeService.deleteRecipe(recipeId);
              setUserRecipes(prev => prev.filter(r => r.id !== recipeId));
              Toast.show({
                type: 'success',
                text1: 'Recipe Deleted',
                text2: 'The recipe has been removed.',
              });
            } catch (error) {
              console.error('Delete recipe error:', error);
              Alert.alert('Error', 'Failed to delete recipe. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleRecipePress = (recipe: any) => {
    if (!recipe.isApproved && recipe.status !== 'approved') {
      Toast.show({
        type: 'info',
        text1: 'Recipe Pending',
        text2: 'This recipe is awaiting admin approval.',
        position: 'bottom',
      });
      return;
    }
    // Navigate to recipe detail via Main -> RecipesTab
    navigation.navigate('Main', {
      screen: 'RecipesTab',
      params: {
        screen: 'RecipeDetail',
        params: { recipeId: recipe.id },
      },
    });
  };

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

  const profileData = {
    ...user,
    bio: user.bio || 'Food enthusiast',
    profileImage: user.profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name),
    backgroundImage: user.backgroundImage || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=200&fit=crop',
    stats: {
      views: '0',
      followers: '0',
      itemViews: userRecipes.length.toString(),
    },
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Background Image & Profile Photo */}
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

          {/* Profile Photo positioned over background */}
          <View style={styles.profilePhotoContainer}>
            <Image
              source={{ uri: profileData.profileImage }}
              style={styles.profilePhoto}
            />
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Feather name="edit-2" size={14} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.nameSection}>
            <Text style={styles.profileName}>{profileData.name}</Text>
            {profileData.isVerifiedCreator && (
              <MaterialCommunityIcons name="check-decagram" size={20} color={colors.primary[500]} style={{ marginLeft: 4 }} />
            )}
          </View>
          <Text style={styles.profileEmail}>{profileData.email}</Text>
          {profileData.bio && (
            <Text style={styles.profileBio}>{profileData.bio}</Text>
          )}
        </View>

        {/* Stats Bar (Bento-fied) */}
        <View style={styles.newStatsContainer}>
          <View style={styles.newStatCard}>
            <View style={[styles.statIconContainer, { backgroundColor: colors.primary[50] }]}>
              <Ionicons name="eye-outline" size={20} color={colors.primary[600]} />
            </View>
            <View>
              <Text style={styles.newStatValue}>{profileData.stats.views}</Text>
              <Text style={styles.newStatLabel}>Views</Text>
            </View>
          </View>

          <View style={styles.newStatCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#FCE4EC' }]}>
              <Ionicons name="people-outline" size={20} color="#D81B60" />
            </View>
            <View>
              <Text style={styles.newStatValue}>{profileData.stats.followers}</Text>
              <Text style={styles.newStatLabel}>Followers</Text>
            </View>
          </View>

          <View style={styles.newStatCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#E1F5FE' }]}>
              <Ionicons name="restaurant-outline" size={20} color="#0288D1" />
            </View>
            <View>
              <Text style={styles.newStatValue}>{profileData.stats.itemViews}</Text>
              <Text style={styles.newStatLabel}>Recipes</Text>
            </View>
          </View>
        </View>

        {/* Creator Status Section */}
        {/* Admin Dashboard Entry Point */}
        {profileData.userType === 'admin' && (
          <TouchableOpacity
            style={styles.adminBanner}
            onPress={() => navigation.navigate('AdminRequests')}
          >
            <View style={styles.adminBannerInfo}>
              <View style={styles.adminIconCircle}>
                <MaterialCommunityIcons name="shield-check" size={24} color={colors.primary[600]} />
              </View>
              <View style={{ flex: 1, marginRight: spacing.sm }}>
                <Text style={styles.adminBannerTitle}>Admin Dashboard</Text>
                <Text style={styles.adminBannerSubtitle}>Review pending creator and recipe requests</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={24} color={colors.primary[600]} />
          </TouchableOpacity>
        )}

        {!profileData.isVerifiedCreator && profileData.userType !== 'admin' && (
          <View style={styles.creatorBanner}>
            <View style={[styles.creatorBannerInfo, { flex: 1, marginRight: spacing.md }]}>
              <Text style={styles.creatorBannerTitle}>
                {profileData.creatorStatus === 'pending' ? 'Application Pending' : 'Become a Creator'}
              </Text>
              <Text style={styles.creatorBannerSubtitle}>
                {profileData.creatorStatus === 'pending'
                  ? 'We are currently reviewing your profile for verification.'
                  : 'Share your recipes with the world and get verified!'}
              </Text>
            </View>
            {profileData.creatorStatus !== 'pending' && (
              <TouchableOpacity style={styles.applyButton} onPress={handleApplyCreator}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* User's Recipes */}
        {(profileData.isVerifiedCreator || userRecipes.length > 0) && (
          <View style={styles.recipesSection}>
            <View style={styles.recipesSectionHeader}>
              <Text style={styles.recipesSectionTitle}>My Recipes</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.recipeGrid}>
              {userRecipes.map((recipe) => (
                <TouchableOpacity
                  key={recipe.id}
                  style={styles.recipeCard}
                  onPress={() => handleRecipePress(recipe)}
                >
                  <View style={styles.recipeImageContainer}>
                    <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                    {recipe.status === 'pending' && (
                      <View style={styles.pendingBadge}>
                        <Text style={styles.pendingBadgeText}>Pending</Text>
                      </View>
                    )}
                    {recipe.status === 'rejected' && (
                      <View style={[styles.pendingBadge, { backgroundColor: '#FFEBEE', borderColor: '#EF5350' }]}>
                        <Text style={[styles.pendingBadgeText, { color: '#C62828' }]}>Rejected</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.recipeInfo}>
                    <Text style={styles.recipeTitle} numberOfLines={2}>
                      {recipe.title}
                    </Text>
                    <View style={styles.recipeFooter}>
                      <View style={styles.recipeStats}>
                        <View style={styles.recipeStatItem}>
                          <Ionicons name="eye-outline" size={14} color={colors.gray[500]} />
                          <Text style={styles.recipeStatText}>{recipe.views}</Text>
                        </View>
                        <View style={styles.recipeStatItem}>
                          <Ionicons name="heart-outline" size={14} color={colors.gray[500]} />
                          <Text style={styles.recipeStatText}>{recipe.likes}</Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteRecipe(recipe.id)}
                      >
                        <Feather name="trash-2" size={16} color={colors.error || '#F44336'} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Quick Actions (Bento Grid) */}
        <View style={styles.bentoMenuGrid}>
          <View style={styles.bentoRow}>
            <TouchableOpacity style={[styles.bentoCard, { backgroundColor: '#E3F2FD' }]}>
              <View style={[styles.bentoIconBadge, { backgroundColor: '#1976D2' }]}>
                <Ionicons name="cube-outline" size={24} color={colors.white} />
              </View>
              <Text style={styles.bentoCardTitle}>My Orders</Text>
              <Text style={styles.bentoCardSubtitle}>Track deliveries</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.bentoCard, { backgroundColor: '#FCE4EC' }]}>
              <View style={[styles.bentoIconBadge, { backgroundColor: '#D81B60' }]}>
                <Ionicons name="heart-outline" size={24} color={colors.white} />
              </View>
              <Text style={styles.bentoCardTitle}>Favorites</Text>
              <Text style={styles.bentoCardSubtitle}>Saved recipes</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bentoRow}>
            <TouchableOpacity
              style={[styles.bentoCard, { backgroundColor: '#E0F2F1' }]}
              onPress={() => navigation.navigate('Subscription')}
            >
              <View style={[styles.bentoIconBadge, { backgroundColor: '#00796B' }]}>
                <Ionicons name="card-outline" size={24} color={colors.white} />
              </View>
              <Text style={styles.bentoCardTitle}>Premium</Text>
              <Text style={styles.bentoCardSubtitle}>Unlock perks</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.bentoCard, { backgroundColor: '#F3E5F5' }]}
            >
              <View style={[styles.bentoIconBadge, { backgroundColor: '#7B1FA2' }]}>
                <Ionicons name="settings-outline" size={24} color={colors.white} />
              </View>
              <Text style={styles.bentoCardTitle}>Settings</Text>
              <Text style={styles.bentoCardSubtitle}>Account info</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bentoRow}>
            <TouchableOpacity
              style={[styles.bentoCard, { backgroundColor: '#FFF3E0', flex: 2 }]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <View style={[styles.bentoIconBadge, { backgroundColor: '#F57C00' }]}>
                  <Ionicons name="help-circle-outline" size={24} color={colors.white} />
                </View>
                <View>
                  <Text style={styles.bentoCardTitle}>Help & Support</Text>
                  <Text style={styles.bentoCardSubtitle}>24/7 Assistance</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.bentoCard, { backgroundColor: '#FFEBEE', flex: 1.2 }]}
              onPress={handleLogout}
            >
              <View style={[styles.bentoIconBadge, { backgroundColor: '#D32F2F' }]}>
                <Ionicons name="log-out-outline" size={24} color={colors.white} />
              </View>
              <Text style={[styles.bentoCardTitle, { color: '#D32F2F' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
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
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.white,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
  },
  guestTitle: {
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.display,
    fontWeight: '700' as const,
    color: colors.text.primary,
    textAlign: 'left',
    marginBottom: spacing.sm,
  },
  guestSubtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.gray[500],
    textAlign: 'left',
    marginBottom: spacing.xl,
    paddingRight: spacing.lg,
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
  // Profile Header Styles
  adminBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary[50],
    marginHorizontal: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary[100],
  },
  adminBannerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  adminIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
  },
  adminBannerTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary[700],
    marginBottom: 2,
  },
  adminBannerSubtitle: {
    fontSize: 11,
    color: colors.primary[600],
    fontFamily: typography.fontFamily.medium,
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
  editButtonText: {
    fontSize: 12,
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
    fontWeight: '700' as const,
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
  },
  // New Stats Styles
  newStatsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  newStatCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    ...shadow.soft,
    borderWidth: 1,
    borderColor: colors.gray[50],
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newStatValue: {
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
  },
  newStatLabel: {
    fontSize: 10,
    color: colors.gray[500],
    fontFamily: typography.fontFamily.medium,
    textTransform: 'uppercase',
  },

  // Bento Menu Styles
  bentoMenuGrid: {
    paddingHorizontal: spacing.lg,
    gap: 12,
    marginBottom: spacing.xl,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bentoCard: {
    flex: 1,
    borderRadius: 20,
    padding: spacing.lg,
    minHeight: 110,
    justifyContent: 'space-between',
    ...shadow.soft,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  bentoIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
  },
  bentoCardTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginTop: spacing.sm,
  },
  bentoCardSubtitle: {
    fontSize: 12,
    color: colors.gray[600],
    fontFamily: typography.fontFamily.medium,
    marginTop: 2,
  },
  creatorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary[50],
    marginHorizontal: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary[100],
  },
  creatorBannerInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  creatorBannerTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary[700],
    marginBottom: 2,
  },
  creatorBannerSubtitle: {
    fontSize: 12,
    color: colors.primary[600],
    lineHeight: 16,
  },
  applyButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  applyButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
  },
  // Recipes Section Styles
  recipesSection: {
    backgroundColor: colors.white,
    padding: spacing.xl,
    marginTop: spacing.md,
  },
  recipesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  recipesSectionTitle: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.display,
    fontWeight: '700' as const,
    color: colors.text.primary,
  },
  viewAllText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary[600],
    fontFamily: typography.fontFamily.bold,
  },
  recipeGrid: {
    gap: spacing.md,
  },
  recipeCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  recipeImageContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  recipeImage: {
    width: 70,
    height: 70,
    borderRadius: borderRadius.md,
  },
  pendingBadge: {
    position: 'absolute',
    top: -5,
    left: -5,
    backgroundColor: '#FFF9C4', // Light Yellow
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FBC02D', // Darker Yellow
    zIndex: 1,
  },
  pendingBadgeText: {
    fontSize: 8,
    fontFamily: typography.fontFamily.bold,
    color: '#F57F17', // Orange/Brown for contrast
    textTransform: 'uppercase',
  },
  recipeInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  recipeTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  recipeStats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  recipeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFEBEE',
  },
  recipeStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recipeStatText: {
    fontSize: 12,
    color: colors.gray[500],
    fontFamily: typography.fontFamily.medium,
  },
  // Legacy or Helper Styles
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
