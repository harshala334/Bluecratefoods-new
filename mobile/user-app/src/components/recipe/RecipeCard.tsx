import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { formatPrice } from '../../utils/formatters';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius, shadow } from '../../constants/spacing';
import { Feather, Ionicons } from '@expo/vector-icons';

import { Recipe } from '../../types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: (recipeId: number) => void;
}

const getDifficultyColor = (difficulty: string | undefined) => {
  switch (difficulty) {
    case 'Easy':
      return { bg: colors.green[100], text: colors.green[700] };
    case 'Medium':
      return { bg: colors.yellow[100], text: colors.yellow[700] };
    case 'Hard':
      return { bg: colors.red[100], text: colors.red[700] };
    default:
      return { bg: colors.gray[100], text: colors.gray[700] };
  }
};

const RecipeCard = ({ recipe, onPress }: RecipeCardProps) => {
  const difficultyColors = getDifficultyColor(recipe.difficulty);

  return (
    <TouchableOpacity
      style={styles.recipeCard}
      activeOpacity={0.8}
      onPress={() => onPress(recipe.id)}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: recipe.image }} style={styles.recipeImage} />

        {/* Rating Badge */}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color={colors.yellow[500]} style={{ marginRight: 2 }} />
          <Text style={styles.ratingText}>{recipe.rating}</Text>
        </View>

        {/* Difficulty Badge */}
        <View style={[styles.difficultyBadge, { backgroundColor: difficultyColors.bg || 'rgba(255,255,255,0.9)' }]}>
          <Text style={[styles.difficultyText, { color: difficultyColors.text }]}>
            {recipe.difficulty}
          </Text>
        </View>
      </View>

      <View style={styles.recipeInfo}>
        <Text style={styles.recipeName} numberOfLines={2}>{recipe.name}</Text>

        <View style={styles.recipeMetaRow}>
          <View style={styles.metaItem}>
            <Feather name="clock" size={14} color={colors.gray[600]} />
            <Text style={styles.metaText}>{recipe.time}</Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="users" size={14} color={colors.gray[600]} />
            <Text style={styles.metaText}>{recipe.servings}</Text>
          </View>
        </View>

        {recipe.tags && recipe.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {recipe.tags.slice(0, 3).map((tag: string, i: number) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
            {recipe.tags.length > 3 && (
              <Text style={styles.tagText}>+{recipe.tags.length - 3}</Text>
            )}
          </View>
        )}

        <View style={styles.ingredientsRow}>
          <View style={styles.ingredientInfo}>
            <Ionicons name="basket-outline" size={14} color={colors.gray[400]} />
            <Text style={styles.ingredientsText}>
              {recipe.ingredients.length}
            </Text>
          </View>
          <Text style={styles.priceText}>
            from {formatPrice(recipe.basePrice)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  recipeCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    overflow: 'visible', // Changed to visible for shadow to show on iOS
    ...shadow.soft, // New soft shadow
    marginBottom: spacing.sm, // Add some bottom spacing for grid layouts
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 180, // Slightly taller for more immersive feel
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    overflow: 'hidden', // Need this here for image border radius
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.gray[200],
  },
  ratingBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Glass-like effect
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    ...shadow.soft,
  },
  starIcon: {
    fontSize: 12,
    marginRight: 2,
  },
  ratingText: {
    fontSize: typography.fontSize.xxs, // 10px
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
  },
  difficultyBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.md,
    // Add lightweight backdrop for better readability on light images if needed
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  difficultyText: {
    fontFamily: typography.fontFamily.bold,
    textTransform: 'uppercase', // Uppercase for badge style
    fontSize: typography.fontSize.xxs, // 10px
  },
  recipeInfo: {
    padding: 12, // Denser padding (was spacing.md=16)
  },
  recipeName: {
    fontSize: typography.fontSize.base, // Changed from .md (invalid) to .base
    fontFamily: typography.fontFamily.bold,
    fontWeight: '700' as const,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    minHeight: 44, // Consistent height for 2 lines
    lineHeight: 22,
  },
  recipeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaIcon: {
    fontSize: 14,
  },
  metaText: {
    fontSize: typography.fontSize.xxs, // 10px
    color: colors.gray[500],
    fontFamily: typography.fontFamily.medium,
  },
  ingredientsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  ingredientsText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
  },
  ingredientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  priceText: {
    fontSize: typography.fontSize.sm, // Reduced from .base
    fontFamily: typography.fontFamily.bold,
    fontWeight: '700' as const,
    color: colors.primary[600],
  },
  tagsRow: {
    display: 'none', // Hiding tags for cleaner card look (Zomato/Swiggy style cards usually cleaner)
  },
  tag: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: typography.fontSize.xxs, // 10px
    color: colors.gray[600],
    fontFamily: typography.fontFamily.medium,
  },
});

export default memo(RecipeCard);
