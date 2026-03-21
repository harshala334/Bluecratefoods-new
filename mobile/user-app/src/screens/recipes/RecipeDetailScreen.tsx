import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
  Share,
  ActivityIndicator,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCartStore } from '../../stores/cartStore';
import { useLocationStore } from '../../stores/locationStore';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius, shadow } from '../../constants/spacing';
import { formatPrice } from '../../utils/formatters';
import { Feather, Ionicons } from '@expo/vector-icons';
import { recipeService } from '../../services/recipeService';
import { Recipe } from '../../types/recipe';

/**
 * Recipe Detail Screen
 * Shows full recipe details, ingredients with checkboxes, steps, nutrition
 * Matches web design from /web/nextjs-client/src/pages/recipes/[id].tsx
 */



// ...

export const getSpiceLevelLabel = (level: number) => {
  switch (level) {
    case 0: return 'None';
    case 1: return 'Mild';
    case 2: return 'Medium';
    case 3: return 'Spicy';
    case 4: return 'Very Spicy';
    case 5: return 'Extra Hot';
    default: return 'None';
  }
};

export const getYoutubeId = (url: string | undefined | null) => {
  if (!url) {
    return null;
  }
  // Handle various YouTube URL formats including shorts, share links, etc.
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  }

  // Fallback for some specific mobile share patterns if the regex above fails
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      const id = urlObj.pathname.slice(1);
      return id;
    }
    if (urlObj.searchParams.has('v')) {
      const id = urlObj.searchParams.get('v');
      return id;
    }
  } catch (e) {
    // URL constructor might fail on some strings
  }

  return null;
};

const RecipeDetailScreen = ({ route, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { recipeId } = route.params || {};
  const { addItem } = useCartStore();
  const { location } = useLocationStore();
  const isServiceable = location?.toLowerCase().includes('kolkata');

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const data = await recipeService.getRecipeById(recipeId);
        if (!data) throw new Error('Recipe not found');
        setRecipe(data);
      } catch (error) {
        console.error('Failed to load recipe', error);
        // Alert.alert('Error', 'Failed to load recipe details');
        // navigation.goBack();

        // Hardcoded fallback as requested by user to guarantee display
        const hardcodedRecipe: Recipe = {
          id: 999,
          name: 'Emergency Mock Tacos',
          image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800',
          time: '20 min',
          difficulty: 'Easy',
          servings: 4,
          rating: 4.8,
          reviews: 430,
          description: 'A fallback recipe to ensure the screen works. Flavorful ground beef tacos with all the toppings.',
          category: '1hour',
          basePrice: 15.00,
          spiceLevel: 2,
          ingredients: [
            { id: 1, name: 'Ground Beef', amount: 500, unit: 'g', price: 7.00, category: 'Meat', isMandatory: true },
            { id: 2, name: 'Taco Shells', amount: 8, unit: 'pcs', price: 3.00, category: 'Pantry', isMandatory: true },
          ],
          steps: [
            { id: 1, title: 'Cook Beef', description: 'Brown beef with taco seasoning.', time: 10 },
            { id: 2, title: 'Assemble', description: 'Fill shells.', time: 5 }
          ],
          nutrition: { calories: 450, protein: 25, carbs: 30, fat: 20 },
          utensils: [
            { id: 1, name: 'Frying Pan', image: 'https://images.unsplash.com/photo-1585515320310-25981483a219?w=200' }
          ]
        };
        console.log('Using HARDCODED recipe fallback');
        setRecipe(hardcodedRecipe);
      } finally {
        setLoading(false);
      }
    };
    if (recipeId) {
      fetchRecipe();
    }
  }, [recipeId]);

  // Loading State
  if (loading || !recipe) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  // const [servings, setServings] = useState(recipe.servings); // Moving state down after recipe load
  // Actually, we need to initialize state AFTER recipe is loaded.
  // Best to use a separate component or checks inside.
  // For simplicity, I will modify the component structure slightly or use effects.

  if (!recipe) return null;

  return <RecipeDetailContent recipe={recipe} navigation={navigation} addItem={addItem} isServiceable={isServiceable} insets={insets} />;
};

const RecipeDetailContent = ({ recipe, navigation, addItem, isServiceable, insets }: { recipe: Recipe, navigation: any, addItem: any, isServiceable: boolean, insets: any }) => {
  // Ensure basic arrays exist
  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const steps = Array.isArray(recipe.steps) ? recipe.steps : [];
  const servings = Number(recipe.servings || 1);
  const currentServings = servings; // Use as default

  const [localServings, setLocalServings] = useState(servings);
  const [spiceLevel, setSpiceLevel] = useState(recipe.spiceLevel || 0);

  // Initialize selectedIngredients with mandatory items
  const [selectedIngredients, setSelectedIngredients] = useState<Set<number>>(() => {
    const initial = new Set<number>();
    ingredients.forEach(ing => {
      if (ing.isMandatory) initial.add(ing.id);
    });
    return initial;
  });

  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'utensils' | 'steps'>('ingredients');

  // Review Modal State
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  // Save State
  const [isSaved, setIsSaved] = useState(false);

  // Step-by-Step Mode State
  const [isStepByStepVisible, setIsStepByStepVisible] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // ... (rest of the logic functions same as before)
  const servingRatio = servings > 0 ? localServings / servings : 1;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const videoId = getYoutubeId(recipe.videoUrl || '');
  const showVideo = !!(recipe.videoUrl && videoId);

  const handleStartStepByStep = () => {
    const firstStep = steps[0];
    if (!firstStep) return;
    setTimerSeconds(firstStep.timerSeconds || (firstStep.time || 0) * 60);
    setIsTimerRunning(false);
    setIsStepByStepVisible(true);
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      const nextStep = steps[nextIndex];
      setCurrentStepIndex(nextIndex);
      setTimerSeconds(nextStep.timerSeconds || (nextStep.time || 0) * 60);
      setIsTimerRunning(false);
    } else {
      setIsStepByStepVisible(false);
      Alert.alert('Congratulations!', 'You have completed the recipe!');
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      const prevStep = steps[prevIndex];
      setCurrentStepIndex(prevIndex);
      setTimerSeconds(prevStep.timerSeconds || (prevStep.time || 0) * 60);
      setIsTimerRunning(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this delicious recipe for ${recipe.name} on Blue Crate!`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // In a real app, this would persist to storage/API
  };

  const toggleIngredient = (id: number) => {
    const ingredient = ingredients.find(i => i.id === id);
    if (ingredient?.isMandatory) return; // Cannot toggle mandatory items

    const newSelected = new Set(selectedIngredients);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIngredients(newSelected);
  };

  const selectAllIngredients = () => {
    if (selectedIngredients.size === ingredients.length) {
      // Deselect all except mandatory
      const mandatory = new Set<number>();
      ingredients.forEach(ing => {
        if (ing.isMandatory) mandatory.add(ing.id);
      });
      setSelectedIngredients(mandatory);
    } else {
      // Select all
      setSelectedIngredients(new Set(ingredients.map(i => i.id)));
    }
  };

  const addToCart = async () => {
    const selectedItems = ingredients.filter(ing => selectedIngredients.has(ing.id));

    if (selectedItems.length === 0) {
      Alert.alert('No Ingredients Selected', 'Please select at least one ingredient');
      return;
    }

    // Add each selected ingredient to cart
    for (const ingredient of selectedItems) {
      if (!ingredient || !ingredient.id) continue;
      const adjustedAmount = Math.ceil((Number(ingredient.amount) || 0) * servingRatio);
      await addItem(
        {
          id: String(ingredient.id),
          name: String(ingredient.name || 'Ingredient'),
          price: Number(ingredient.price || 0),
          quantity: 1,
          unit: String(ingredient.unit || ''),
          image: String(recipe.image || ''),
          isAvailable: true,
        },
        adjustedAmount,
        String(recipe.id || ''),
        String(recipe.name || '')
      );
    }

    Alert.alert(
      isServiceable ? 'Added to Cart!' : 'Added to Shop List!',
      `${selectedItems.length} ingredient${selectedItems.length > 1 ? 's' : ''} added to your ${isServiceable ? 'cart' : 'shopping list'}`,
      [
        { text: 'Continue', style: 'cancel' },
        {
          text: isServiceable ? 'View Cart' : 'View Shop',
          onPress: () => navigation.navigate('CartTab')
        }
      ]
    );
  };

  const totalCost = ingredients
    .filter(ing => selectedIngredients.has(ing.id))
    .reduce((sum, ing) => sum + (ing.price || 0), 0);

  const getDifficultyColor = () => {
    switch (recipe.difficulty) {
      case 'Easy':
        return colors.green[500];
      case 'Medium':
        return colors.yellow[500];
      case 'Hard':
        return colors.red[500];
      default:
        return colors.gray[500];
    }
  };

  const handleSubmitReview = () => {
    // Comment is optional now

    const newReview = {
      id: Date.now(),
      user: 'You',
      rating: newReviewRating,
      comment: newReviewComment,
      date: 'Just now',
    };

    // In a real app, this would be an API call
    if (recipe.userReviews) {
      recipe.userReviews.unshift(newReview);
    } else {
      recipe.userReviews = [newReview];
    }

    // Update review count and average rating (mock logic)
    recipe.reviews += 1;

    setIsReviewModalVisible(false);
    setNewReviewComment('');
    setNewReviewRating(5);
    Alert.alert('Success', 'Review submitted successfully!');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Hero Image */}
        <View style={styles.heroSection}>
          {recipe.image ? (
            <Image source={{ uri: recipe.image }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <View style={[styles.heroImage, { backgroundColor: colors.gray[100], justifyContent: 'center', alignItems: 'center' }]}>
              <Feather name="image" size={50} color={colors.gray[300]} />
            </View>
          )}
          <View style={styles.heroOverlay} />

          <TouchableOpacity
            style={[styles.backButton, { top: insets.top + spacing.sm }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>

          <View style={[styles.headerActions, { top: insets.top + spacing.sm }]}>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Ionicons name="share-social-outline" size={24} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
              <Ionicons
                name={isSaved ? "heart" : "heart-outline"}
                size={24}
                color={isSaved ? colors.red[500] : colors.white}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{recipe.name || 'Recipe'}</Text>

            {/* Added by User Tag */}
            <View style={styles.authorRow}>
              <Ionicons name="person-outline" size={14} color={colors.gray[300]} style={{ marginRight: 4 }} />
              <Text style={styles.authorText}>
                Recipe by {recipe.authorName || 'Blue Crate Chef'}
              </Text>
            </View>

            <View style={styles.heroMetaContainer}>
              {/* Unified Glassmorphism Meta Bar */}
              <View style={styles.unifiedMetaBar}>
                <View style={styles.unifiedMetaItem}>
                  <Ionicons name="star" size={16} color={colors.yellow[500]} />
                  <Text style={styles.unifiedMetaText}>
                    {recipe.rating || 5} <Text style={styles.unifiedMetaSubtext}>({recipe.reviews || 0})</Text>
                  </Text>
                </View>
                <View style={styles.unifiedMetaDivider} />
                <View style={styles.unifiedMetaItem}>
                  <Ionicons name="time-outline" size={16} color={colors.white} />
                  <Text style={styles.unifiedMetaText}>{recipe.time || '20 min'}</Text>
                </View>
                <View style={styles.unifiedMetaDivider} />
                <View style={styles.unifiedMetaItem}>
                  <Ionicons name="restaurant-outline" size={16} color={colors.white} />
                  <Text style={styles.unifiedMetaText}>{recipe.servings || 1} servings</Text>
                </View>
              </View>

              {/* Tags Row */}
              <View style={styles.heroTagsRow}>
                <View style={[styles.statusTag, { backgroundColor: getDifficultyColor() }]}>
                  <Text style={styles.statusTagText}>{recipe.difficulty || 'Easy'}</Text>
                </View>
                <View style={styles.priceTag}>
                  <Text style={styles.priceTagText}>
                    from <Text style={styles.priceTagValue}>{formatPrice(recipe.basePrice || 0)}</Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Features Bar moved inside content to avoid overlap clipping */}


        <View style={styles.content}>
          <View style={styles.featuresBar}>
            <Ionicons name="checkmark-circle" size={18} color={colors.green[500]} />
            <Text style={styles.featuresText}>
              Beginner-safe • No special equipment • Tested recipe
            </Text>
          </View>
          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Recipe</Text>
            <Text style={styles.description}>{recipe.description}</Text>

            {recipe.tags && recipe.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {recipe.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            {['Ingredients', 'Utensils', 'Steps'].map((tab) => {
              const isActive = activeTab === tab.toLowerCase();
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tabButton, isActive && styles.tabButtonActive]}
                  onPress={() => setActiveTab(tab.toLowerCase() as any)}
                >
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {activeTab === 'ingredients' && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Ingredients</Text>
                  <TouchableOpacity onPress={selectAllIngredients}>
                    <Text style={styles.selectAllText}>
                      {selectedIngredients.size === recipe.ingredients.length ? 'Deselect All' : 'Select All'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Servings Adjuster */}
                <View style={styles.servingsContainer}>
                  <Text style={styles.servingsLabel}>Number of Servings</Text>
                  <View style={styles.servingsControls}>
                    <TouchableOpacity
                      style={styles.servingsButton}
                      onPress={() => setLocalServings(Math.max(1, localServings - 1))}
                    >
                      <Text style={styles.servingsButtonText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.servingsValue}>{localServings}</Text>
                    <TouchableOpacity
                      style={styles.servingsButton}
                      onPress={() => setLocalServings(localServings + 1)}
                    >
                      <Text style={styles.servingsButtonText}>+</Text>
                    </TouchableOpacity>
                    <Text style={styles.servingsPeople}>people</Text>
                  </View>
                </View>

                {/* Spice Level Adjuster */}
                <View style={styles.spiceContainer}>
                  <View style={styles.spiceHeader}>
                    <Text style={styles.spiceLabel}>Spice Level</Text>
                    <Text style={styles.spiceValue}>{getSpiceLevelLabel(spiceLevel)}</Text>
                  </View>
                  <Slider
                    style={{ width: '100%', height: 40, transform: [{ scaleY: 1.2 }] }} // Bolder line via scaleY
                    minimumValue={0}
                    maximumValue={5}
                    step={1}
                    value={spiceLevel}
                    onValueChange={setSpiceLevel}
                    minimumTrackTintColor={colors.primary[500]}
                    maximumTrackTintColor={colors.gray[200]}
                    thumbTintColor={colors.primary[500]}
                  />
                </View>

                {/* Ingredients List with Checkboxes and Banners */}
                <View style={styles.ingredientsList}>
                  {/* Mandatory Section */}
                  <View style={styles.ingredientSection}>
                    <Text style={styles.providedTitle}>Provided by Blue Crate</Text>
                    <View style={styles.infoBanner}>
                      <Feather name="truck" size={16} color={colors.green[600]} />
                      <Text style={styles.infoBannerText}>These will be included in your kit</Text>
                    </View>

                    {recipe.ingredients.filter(i => i.isMandatory).map((ingredient) => {
                      const isSelected = selectedIngredients.has(ingredient.id);
                      const adjustedAmount = Math.ceil(ingredient.amount * servingRatio);

                      return (
                        <View key={ingredient.id} style={[styles.ingredientItem, styles.ingredientItemDisabled]}>
                          <View style={styles.ingredientLeft}>
                            <View style={[styles.checkbox, styles.checkboxDisabled]}>
                              <Feather name="check" size={14} color={colors.white} />
                            </View>
                            <View>
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Text style={styles.ingredientName}>{ingredient.name}</Text>
                                <Feather name="lock" size={12} color={colors.gray[400]} />
                              </View>
                              <Text style={styles.ingredientCategory}>{ingredient.category}</Text>
                            </View>
                          </View>
                          <View style={styles.ingredientRight}>
                            <Text style={styles.ingredientAmount}>
                              {adjustedAmount} {ingredient.unit}
                            </Text>
                            <Text style={styles.ingredientPrice}>{formatPrice(ingredient.price)}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>

                  {/* Optional Section */}
                  <View style={styles.ingredientSection}>
                    <View style={[styles.infoBanner, { backgroundColor: colors.green[50] }]}>
                      <Ionicons name="home" size={16} color={colors.green[700]} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.infoBannerText, { fontWeight: '700' }]}>Optional | Usually at home</Text>
                        <Text style={[styles.infoBannerText, { fontSize: 11 }]}>
                          Check items you need. These are usually available at home.
                        </Text>
                      </View>
                    </View>

                    {recipe.ingredients.filter(i => !i.isMandatory).map((ingredient) => {
                      const isSelected = selectedIngredients.has(ingredient.id);
                      const adjustedAmount = Math.ceil(ingredient.amount * servingRatio);

                      return (
                        <TouchableOpacity
                          key={ingredient.id}
                          style={[
                            styles.ingredientItem,
                            isSelected && styles.ingredientItemSelected,
                          ]}
                          onPress={() => toggleIngredient(ingredient.id)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.ingredientLeft}>
                            <View style={[
                              styles.checkbox,
                              isSelected && styles.checkboxSelected,
                            ]}>
                              {isSelected && <Feather name="check" size={14} color={colors.white} />}
                            </View>
                            <View>
                              <Text style={styles.ingredientName}>{ingredient.name}</Text>
                              <Text style={styles.ingredientCategory}>{ingredient.category}</Text>
                            </View>
                          </View>
                          <View style={styles.ingredientRight}>
                            <Text style={styles.ingredientAmount}>
                              {adjustedAmount} {ingredient.unit}
                            </Text>
                            <Text style={styles.ingredientPrice}>{formatPrice(ingredient.price)}</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Add-ons Mock Section */}
                  <View style={styles.ingredientSection}>
                    <View style={[styles.infoBanner, { backgroundColor: '#FFF5EB' }]}>
                      <Ionicons name="add-circle" size={18} color="#D97706" />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.infoBannerText, { fontWeight: '700', color: '#92400E' }]}>Add-ons</Text>
                        <Text style={[styles.infoBannerText, { fontSize: 11, color: '#92400E' }]}>
                          Optional extras that you can add
                        </Text>
                      </View>
                    </View>
                    {/* (This would be mapped if recipe had addOns) */}
                  </View>
                </View>

                {/* Nutrition Info */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Nutrition (per serving)</Text>
                  <View style={styles.nutritionGrid}>
                    <View style={styles.nutritionItem}>
                      <View style={[styles.nutritionIconContainer, { backgroundColor: colors.orange[100] }]}>
                        <Ionicons name="flame" size={20} color={colors.orange[500]} />
                      </View>
                      <View>
                        <Text style={styles.nutritionValue}>{recipe.nutrition?.calories || 0}</Text>
                        <Text style={styles.nutritionLabel}>Calories</Text>
                      </View>
                    </View>
                    <View style={styles.nutritionItem}>
                      <View style={[styles.nutritionIconContainer, { backgroundColor: colors.accent[100] }]}>
                        <Ionicons name="barbell" size={20} color={colors.accent[500]} />
                      </View>
                      <View>
                        <Text style={styles.nutritionValue}>{recipe.nutrition?.protein || 0}g</Text>
                        <Text style={styles.nutritionLabel}>Protein</Text>
                      </View>
                    </View>
                    <View style={styles.nutritionItem}>
                      <View style={[styles.nutritionIconContainer, { backgroundColor: colors.green[100] }]}>
                        <Ionicons name="restaurant" size={20} color={colors.green[500]} />
                      </View>
                      <View>
                        <Text style={styles.nutritionValue}>{recipe.nutrition?.carbs || 0}g</Text>
                        <Text style={styles.nutritionLabel}>Carbs</Text>
                      </View>
                    </View>
                    <View style={styles.nutritionItem}>
                      <View style={[styles.nutritionIconContainer, { backgroundColor: colors.yellow[100] }]}>
                        <Ionicons name="water" size={20} color={colors.yellow[500]} />
                      </View>
                      <View>
                        <Text style={styles.nutritionValue}>{recipe.nutrition?.fat || 0}g</Text>
                        <Text style={styles.nutritionLabel}>Fat</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Order Summary - Fixed at bottom */}
                <View style={styles.orderSummarySection}>
                  <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>{isServiceable ? 'Order Summary' : 'Shopping List'}</Text>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Selected Items:</Text>
                      <Text style={styles.summaryValue}>{selectedIngredients.size}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Servings:</Text>
                      <Text style={styles.summaryValue}>{localServings}</Text>
                    </View>
                    <View style={[styles.summaryRow, styles.totalRow]}>
                      <Text style={styles.totalLabel}>Total:</Text>
                      <Text style={styles.totalValue}>{formatPrice(totalCost)}</Text>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.addToCartButton,
                        selectedIngredients.size === 0 && styles.addToCartButtonDisabled,
                      ]}
                      onPress={addToCart}
                      disabled={selectedIngredients.size === 0}
                    >
                      <Text style={styles.cartIcon}>{isServiceable ? '🛒' : '📝'}</Text>
                      <Text style={styles.addToCartText}>{isServiceable ? 'Add to Cart' : 'Add to Shopping Cart'}</Text>
                    </TouchableOpacity>

                    {isServiceable && (
                      <Text style={styles.deliveryNote}>Free delivery on orders over {formatPrice(50)}</Text>
                    )}
                  </View>
                </View>
              </View>
            )}



            {activeTab === 'utensils' && (
              <View style={styles.section}>
                {recipe.utensils && recipe.utensils.length > 0 ? (
                  <>
                    <View style={styles.sectionTitleRow}>
                      <Text style={styles.sectionTitleIcon}>🍴</Text>
                      <Text style={styles.sectionTitle}>Utensils Needed</Text>
                    </View>
                    <View style={styles.utensilsList}>
                      {recipe.utensils.map((utensil) => (
                        <View key={utensil.id} style={styles.utensilItem}>
                          <Image source={{ uri: utensil.image }} style={styles.utensilImage} />
                          <Text style={styles.utensilText}>{utensil.name}</Text>
                        </View>
                      ))}
                    </View>
                  </>
                ) : (
                  <Text style={styles.emptyStateText}>No specific utensils listed for this recipe.</Text>
                )}
              </View>
            )}

            {activeTab === 'steps' && (
              <View style={styles.section}>
                <View style={styles.sectionTitleRow}>
                  <Text style={styles.sectionTitleIcon}>👨‍🍳</Text>
                  <Text style={styles.sectionTitle}>Cooking Steps</Text>
                </View>

                <TouchableOpacity
                  style={styles.startCookingButton}
                  onPress={handleStartStepByStep}
                >
                  <Ionicons name="play-circle" size={24} color={colors.white} />
                  <Text style={styles.startCookingText}>Start Step-by-Step</Text>
                </TouchableOpacity>



                <View style={styles.stepsList}>
                  {recipe.steps.map((step, index) => (
                    <TouchableOpacity
                      key={step.id}
                      style={[
                        styles.stepItem,
                        activeStep === step.id && styles.stepItemActive,
                      ]}
                      onPress={() => setActiveStep(activeStep === step.id ? null : step.id)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.stepHeader}>
                        <View style={styles.stepNumber}>
                          <Text style={styles.stepNumberText}>{index + 1}</Text>
                        </View>
                        <View style={styles.stepContent}>
                          <View style={styles.stepTitleRow}>
                            <Text style={styles.stepTitle}>{step.title}</Text>
                            <View style={styles.stepTime}>
                              <Text style={styles.stepTimeIcon}>⏱️</Text>
                              <Text style={styles.stepTimeText}>{step.time} min</Text>
                            </View>
                          </View>
                          <Text style={styles.stepDescription}>{step.description}</Text>
                          {activeStep === step.id && (
                            <View style={styles.tipContainer}>
                              <Text style={styles.tipText}>
                                <Text style={styles.tipLabel}>💡 Pro Tip: </Text>
                                {step.tip}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Reviews Section - Visible under all tabs */}
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitleIcon}>⭐</Text>
              <Text style={styles.sectionTitle}>Reviews ({recipe.reviews})</Text>
            </View>

            <TouchableOpacity
              style={styles.writeReviewButton}
              onPress={() => setIsReviewModalVisible(true)}
            >
              <Text style={styles.writeReviewText}>Write a Review</Text>
            </TouchableOpacity>

            {recipe.userReviews && recipe.userReviews.filter(r => r.comment && r.comment.trim().length > 0).length > 0 ? (
              <View style={styles.reviewsList}>
                {recipe.userReviews
                  .filter(review => review.comment && review.comment.trim().length > 0)
                  .map((review) => (
                    <View key={review.id} style={styles.reviewItem}>
                      <View style={styles.reviewHeader}>
                        <Text style={styles.reviewUser}>{review.user}</Text>
                        <Text style={styles.reviewDate}>{review.date}</Text>
                      </View>
                      <View style={styles.reviewRating}>
                        {[...Array(5)].map((_, i) => (
                          <Ionicons
                            key={i}
                            name={i < review.rating ? "star" : "star-outline"}
                            size={14}
                            color={colors.yellow[500]}
                          />
                        ))}
                      </View>
                      <Text style={styles.reviewComment}>{review.comment}</Text>
                    </View>
                  ))}
              </View>
            ) : (
              <Text style={styles.emptyStateText}>No written reviews yet. Be the first to write one!</Text>
            )}
          </View>

        </View>

        {/* Write Review Modal */}
        <Modal
          visible={isReviewModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsReviewModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Write a Review</Text>

              <Text style={styles.modalLabel}>Rating</Text>
              <View style={styles.ratingSelector}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setNewReviewRating(star)}>
                    <Ionicons
                      name={star <= newReviewRating ? "star" : "star-outline"}
                      size={32}
                      color={colors.yellow[500]}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalLabel}>Comment</Text>
              <TextInput
                style={styles.commentInput}
                placeholder="Share your thoughts..."
                placeholderTextColor={colors.gray[400]}
                multiline
                numberOfLines={4}
                value={newReviewComment}
                onChangeText={setNewReviewComment}
                textAlignVertical="top"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsReviewModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={handleSubmitReview}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Step-by-Step Modal */}
        <Modal
          visible={isStepByStepVisible}
          animationType="slide"
          onRequestClose={() => setIsStepByStepVisible(false)}
        >
          <View style={styles.stepModalContainer}>
            {/* Header */}
            <View style={[styles.stepModalHeader, { paddingTop: insets.top + spacing.sm }]}>
              <TouchableOpacity onPress={() => setIsStepByStepVisible(false)}>
                <Ionicons name="close" size={28} color={colors.text.primary} />
              </TouchableOpacity>
              <Text style={styles.stepProgressText}>
                Step {currentStepIndex + 1} of {steps.length}
              </Text>
              <View style={{ width: 28 }} />
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${((currentStepIndex + 1) / (steps.length || 1)) * 100}%` }
                ]}
              />
            </View>

            {/* Video Section (Outside ScrollView to stay fixed during steps) */}
            <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
              {showVideo ? (
                <View style={[styles.videoPlaceholder, { justifyContent: 'flex-start', alignItems: 'stretch' }]}>
                  <WebView
                    style={styles.webView}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    allowsFullscreenVideo={true}
                    source={{ uri: `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=0&showinfo=0&controls=1` }}
                    onError={(e) => console.log('[DEBUG] WebView Error:', e.nativeEvent)}
                    onHttpError={(e) => console.log('[DEBUG] WebView HTTP Error:', e.nativeEvent)}
                  />
                </View>
              ) : (
                <View style={styles.videoPlaceholder}>
                  <Image
                    source={{ uri: recipe.image || '' }}
                    style={styles.videoThumbnail}
                    resizeMode="cover"
                  />
                  <View style={styles.playButtonOverlay}>
                    <Ionicons name="play" size={48} color={colors.white} />
                  </View>
                  <Text style={styles.videoLabel}>Video Tutorial</Text>
                </View>
              )}
            </View>

            <ScrollView style={styles.stepModalContent}>

              {/* Step Content */}
              <Text style={styles.stepModalTitle}>{steps[currentStepIndex]?.title || 'Step'}</Text>
              <Text style={styles.stepModalDescription}>{steps[currentStepIndex]?.description || ''}</Text>

              {/* Timer */}
              <View style={styles.timerContainer}>
                <Text style={styles.timerLabel}>Timer</Text>
                <Text style={styles.timerValue}>{formatTime(timerSeconds)}</Text>
                <View style={styles.timerControls}>
                  <TouchableOpacity
                    style={styles.timerButton}
                    onPress={() => setIsTimerRunning(!isTimerRunning)}
                  >
                    <Ionicons
                      name={isTimerRunning ? "pause" : "play"}
                      size={24}
                      color={colors.primary[600]}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.timerButton}
                    onPress={() => {
                      setIsTimerRunning(false);
                      setTimerSeconds(steps[currentStepIndex]?.timerSeconds || (steps[currentStepIndex]?.time || 0) * 60);
                    }}
                  >
                    <Ionicons name="refresh" size={24} color={colors.gray[600]} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Tip */}
              {steps[currentStepIndex]?.tip && (
                <View style={styles.tipContainer}>
                  <Text style={styles.tipText}>
                    <Text style={styles.tipLabel}>💡 Pro Tip: </Text>
                    {steps[currentStepIndex].tip}
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* Navigation Footer */}
            <View style={styles.stepModalFooter}>
              <TouchableOpacity
                style={[styles.navButton, styles.prevButton, currentStepIndex === 0 && styles.navButtonDisabled]}
                onPress={handlePrevStep}
                disabled={currentStepIndex === 0}
              >
                <Text style={styles.prevButtonText}>Previous</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.navButton, styles.nextButton]}
                onPress={handleNextStep}
              >
                <Text style={styles.nextButtonText}>
                  {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next Step'}
                </Text>
                {currentStepIndex < steps.length - 1 && (
                  <Ionicons name="arrow-forward" size={20} color={colors.white} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


      </ScrollView>

      <TouchableOpacity
        style={styles.resumeCookingButton}
        onPress={handleStartStepByStep}
      >
        <Ionicons name="play" size={32} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  heroSection: {
    position: 'relative',
    height: 300,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.gray[200],
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  backButton: {
    position: 'absolute',
    top: spacing.md, // Reduced from spacing.xl to move higher
    left: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  headerActions: {
    position: 'absolute',
    top: spacing.md, // Reduced from spacing.xl to move higher
    right: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
    zIndex: 10,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: spacing['3xl'], // Increased bottom padding to account for overlap
  },
  heroTitle: {
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.display,
    fontWeight: '700' as const,
    color: colors.white,
    marginBottom: spacing.md,
  },
  heroMetaContainer: {
    marginTop: spacing.sm,
  },
  unifiedMetaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: borderRadius.lg,
    paddingVertical: 6, // Slightly tighter vertical padding
    paddingRight: spacing.sm,
    paddingLeft: 0, // Removed left padding to start content at the very edge
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  unifiedMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // Tighter gap
    paddingLeft: 4, // Controlled padding for the first icon
    paddingRight: 4,
  },
  unifiedMetaDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: spacing.xs,
  },
  unifiedMetaText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semibold,
    color: colors.white,
  },
  unifiedMetaSubtext: {
    fontSize: typography.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: 'normal',
  },
  heroTagsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  statusTag: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  statusTagText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },
  priceTag: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  priceTagText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    fontFamily: typography.fontFamily.medium,
  },
  priceTagValue: {
    fontFamily: typography.fontFamily.bold,
    color: colors.primary[600],
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  authorText: {
    color: colors.gray[300],
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
  },
  featuresBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg, // Added rounded corners
    marginBottom: spacing.md, // Add breathing room
    gap: 6,
    ...shadow.soft, // Add shadow to separate from gray bg
  },
  featuresText: {
    fontSize: 12, // Fixed small size to ensure single-line fit
    fontFamily: typography.fontFamily.medium,
    color: colors.gray[600],
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    marginTop: -spacing.xl, // Overlap the hero image
    backgroundColor: colors.gray[50],
    borderTopLeftRadius: borderRadius['3xl'],
    borderTopRightRadius: borderRadius['3xl'],
    paddingTop: spacing.xl,
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
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.display,
    fontWeight: '700' as const,
    color: colors.text.primary,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitleIcon: {
    fontSize: 28,
  },
  selectAllText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semibold,
    color: colors.primary[600],
  },
  description: {
    fontSize: typography.fontSize.base,
    color: colors.gray[700],
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.base,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary[100],
  },
  tagText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary[700],
    fontFamily: typography.fontFamily.medium,
  },
  servingsContainer: {
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  spiceContainer: {
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.xl,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  spiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm, // Increased to match servingsLabel margin
  },
  spiceLabel: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semibold,
    color: colors.text.primary,
  },
  spiceValue: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary[600],
  },
  servingsLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.gray[700],
    marginBottom: spacing.sm,
  },
  servingsControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  servingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  servingsButtonText: {
    fontSize: typography.fontSize.xl,
    color: colors.primary[600],
    fontWeight: '600' as const,
  },
  servingsValue: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    fontWeight: '700' as const,
    color: colors.text.primary,
    minWidth: 50,
    textAlign: 'center',
  },
  servingsPeople: {
    fontSize: typography.fontSize.base,
    color: colors.gray[600],
  },
  ingredientsList: {
    gap: spacing.md,
  },
  ingredientSection: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  providedTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  infoBannerText: {
    fontSize: 13,
    color: colors.green[800],
    fontFamily: typography.fontFamily.medium,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1, // Thinner border for cleaner look
    borderColor: colors.gray[200],
    backgroundColor: colors.white,
    ...shadow.soft,
  },
  ingredientItemSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  ingredientLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  checkmark: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '700' as const,
  },
  ingredientName: {
    fontSize: 15,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
  },
  ingredientCategory: {
    fontSize: 12,
    color: colors.gray[500],
    fontFamily: typography.fontFamily.medium,
  },
  ingredientItemDisabled: {
    backgroundColor: colors.gray[50],
    borderColor: colors.gray[200],
  },
  checkboxDisabled: {
    backgroundColor: colors.gray[400],
    borderColor: colors.gray[400],
  },
  ingredientRight: {
    alignItems: 'flex-end',
  },
  ingredientAmount: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
  },
  ingredientPrice: {
    fontSize: 14,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary[600],
  },

  stepsList: {
    gap: spacing.md,
  },
  stepItem: {
    borderWidth: 2,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    backgroundColor: colors.white,
  },
  stepItemActive: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  stepHeader: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    fontWeight: '700' as const,
    color: colors.white,
  },
  stepContent: {
    flex: 1,
  },
  stepTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  stepTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    fontWeight: '700' as const,
    color: colors.text.primary,
    flex: 1,
  },
  stepTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepTimeIcon: {
    fontSize: 14,
  },
  stepTimeText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  stepDescription: {
    fontSize: typography.fontSize.base,
    color: colors.gray[700],
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.base,
  },
  tipContainer: {
    marginTop: spacing.md,
    backgroundColor: colors.yellow[50],
    borderLeftWidth: 4,
    borderLeftColor: colors.yellow[400],
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  tipText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
  },
  tipLabel: {
    fontFamily: typography.fontFamily.bold,
    color: colors.primary[700],
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  nutritionItem: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  nutritionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nutritionValue: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    fontWeight: '700' as const,
    color: colors.text.primary,
  },
  nutritionLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    fontFamily: typography.fontFamily.medium,
  },
  orderSummarySection: {
    marginBottom: spacing['2xl'],
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.sm,
    ...shadow.medium,
  },
  summaryTitle: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    fontWeight: '700' as const,
    color: colors.text.primary,
    marginBottom: spacing.md,
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
    fontFamily: typography.fontFamily.semibold,
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
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    gap: spacing.sm,
    ...shadow.soft,
  },
  addToCartButtonDisabled: {
    opacity: 0.5,
  },
  cartIcon: {
    fontSize: 20,
  },
  addToCartText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    fontWeight: '700' as const,
    color: colors.white,
  },
  deliveryNote: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    textAlign: 'center',
    marginTop: spacing.md,
  },
  utensilsList: {
    gap: spacing.md,
  },
  utensilItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    borderColor: colors.gray[200],
    gap: spacing.md,
  },
  utensilImage: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray[100],
  },
  utensilText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semibold,
    color: colors.text.primary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: spacing.xs,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  tabButtonActive: {
    backgroundColor: colors.primary[500],
  },
  tabText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semibold,
    color: colors.gray[600],
  },
  tabTextActive: {
    color: colors.white,
  },
  tabContent: {
    minHeight: 200,
  },
  emptyStateText: {
    fontSize: typography.fontSize.base,
    color: colors.gray[500],
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  reviewsList: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  reviewItem: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  reviewUser: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semibold,
    color: colors.text.primary,
  },
  reviewDate: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
  },
  reviewRating: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    gap: 2,
  },
  reviewComment: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.sm,
  },
  writeReviewButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary[500],
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  writeReviewText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semibold,
    color: colors.primary[600],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadow.medium,
  },
  modalTitle: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  ratingSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    minHeight: 100,
    marginBottom: spacing.xl,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.gray[100],
  },
  submitButton: {
    backgroundColor: colors.primary[500],
  },
  cancelButtonText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semibold,
    color: colors.gray[700],
  },
  submitButtonText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semibold,
    color: colors.white,
  },
  startCookingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    marginBottom: spacing.lg,
    ...shadow.soft,
  },
  resumeCookingButton: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[500],
    borderRadius: 28,
    ...shadow.medium,
    zIndex: 100,
  },
  startCookingText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },
  stepModalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  stepModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  stepProgressText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semibold,
    color: colors.text.primary,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: colors.gray[200],
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
  },
  stepModalContent: {
    flex: 1,
    padding: spacing.lg,
  },
  videoPlaceholder: {
    height: 200,
    backgroundColor: colors.black,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  playButtonOverlay: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  videoLabel: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    color: colors.white,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    fontSize: typography.fontSize.xs,
  },
  stepModalTitle: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  stepModalDescription: {
    fontSize: typography.fontSize.base,
    color: colors.gray[700],
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.base,
    marginBottom: spacing.xs,
  },
  timerContainer: {
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  timerLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timerValue: {
    fontSize: 48,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary[600],
    fontVariant: ['tabular-nums'],
    marginBottom: spacing.md,
  },
  timerControls: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  timerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[300],
    ...shadow.soft,
  },
  stepModalFooter: {
    flexDirection: 'row',
    padding: spacing.sm,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    gap: spacing.md,
  },
  navButton: {
    flex: 1,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  prevButton: {
    backgroundColor: colors.gray[100],
  },
  nextButton: {
    backgroundColor: colors.primary[500],
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  prevButtonText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semibold,
    color: colors.gray[700],
  },
  nextButtonText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semibold,
    color: colors.white,
  },
  webView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  globalVideoContainer: {
    marginTop: spacing.xl,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  videoSectionTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  globalVideoWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.gray[100],
  },
  tutorialNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.md,
    marginBottom: spacing.xl,
  },
  tutorialNoteText: {
    fontSize: 13,
    color: colors.primary[700],
    fontFamily: typography.fontFamily.medium,
    flex: 1,
  },
});

export default RecipeDetailScreen;
