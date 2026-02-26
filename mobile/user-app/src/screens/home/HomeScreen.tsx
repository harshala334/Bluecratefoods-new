import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions, // Import Dimensions
  NativeSyntheticEvent,
  NativeScrollEvent,
  FlatList,
  ImageBackground
} from 'react-native';
import { API_CONFIG, CDN_URL } from '../../constants/config';
import { colors } from '../../constants/colors';
import { typography, textStyles } from '../../constants/typography';
import { spacing, borderRadius, shadow } from '../../constants/spacing';
import { Feather, Ionicons } from '@expo/vector-icons';
import { recipeService } from '../../services/recipeService';
import { chatService, Message } from '../../services/chatService';
import { Recipe } from '../../types/recipe';

const { width: windowWidth } = Dimensions.get('window'); // Re-declaring since we removed interface


import { useLocationStore } from '../../stores/locationStore';

/**
 * Home Screen - Landing page with categories
 */

export const HomeScreen = ({ navigation }: any) => {
  const { location } = useLocationStore();
  const isServiceable = location?.toLowerCase().includes('kolkata');

  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [suggestedRecipes, setSuggestedRecipes] = useState<Recipe[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<Recipe[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ... (previous state definitions remain the same)

  const placeholderTexts = [
    "Try 'I want something spicy'",
    "Try 'Show me vegan options'",
    "Try 'Quick breakfast ideas'",
    "Try 'Gluten-free snacks'"
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0); // Keeping for safety if used elsewhere, though we'll use dynamicPlaceholder
  const [dynamicPlaceholder, setDynamicPlaceholder] = useState(placeholderTexts[0]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let currentTextIndex = 0;
    let charIndex = placeholderTexts[0].length;
    let isDeleting = false;

    const runTypingEffect = () => {
      const currentFullText = placeholderTexts[currentTextIndex];
      const prefix = "Try '";

      if (isDeleting) {
        // Instant 'delete' - jump straight to the prefix of the next sentence
        isDeleting = false;
        currentTextIndex = (currentTextIndex + 1) % placeholderTexts.length;
        charIndex = prefix.length;
        setDynamicPlaceholder(placeholderTexts[currentTextIndex].substring(0, charIndex));
        timeoutId = setTimeout(runTypingEffect, 1);
      } else {
        if (charIndex < currentFullText.length) {
          charIndex++;
          setDynamicPlaceholder(currentFullText.substring(0, charIndex));
          timeoutId = setTimeout(runTypingEffect, 2);
        } else {
          isDeleting = true;
          timeoutId = setTimeout(runTypingEffect, 1200);
        }
      }
    };

    timeoutId = setTimeout(() => {
      isDeleting = true;
      runTypingEffect();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const unsubscribe = chatService.subscribe((messages) => {
      setChatMessages(messages);

      // Sync suggestions from the latest bot message
      const lastMsg = messages[messages.length - 1];
      if (lastMsg && lastMsg.sender === 'bot') {
        if (lastMsg.recipes && lastMsg.recipes.length > 0) {
          setSuggestedRecipes(lastMsg.recipes);
        }
      }
    });
    return unsubscribe;
  }, []);

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 1 && isSearchFocused) {
        try {
          const results = await recipeService.searchRecipes(searchQuery);
          setSuggestions(results.slice(0, 3)); // Limit to 3 for compact view
          setShowSuggestions(true);
        } catch (error) {
          console.error("Search error:", error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, isSearchFocused]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const chatListRef = React.useRef<ScrollView>(null);


  const quickOptions = ['Breakfast', 'Healthy', 'Snacks', 'Dessert', 'Spicy', 'Chicken'];

  const promos = [
    { id: 1, title: '50% OFF on First Order', subtitle: 'Use code: WELCOME50', color: '#FF7043', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80' },
    { id: 2, title: 'New Vegan Collection', subtitle: 'Explore plant-based goodness', color: '#66BB6A', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80' },
    { id: 3, title: 'Chef\'s Special Curry', subtitle: 'Limited time offer', color: '#FFA726', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80' }
  ];

  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      let nextSlide = currentSlide + 1;
      if (nextSlide >= promos.length) nextSlide = 0;

      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: nextSlide * windowWidth,
          animated: true,
        });
        setCurrentSlide(nextSlide);
      }
    }, 4000); // 4 seconds

    return () => clearInterval(interval);
  }, [currentSlide]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (roundIndex !== currentSlide) {
      setCurrentSlide(roundIndex);
    }
  };



  const categories = [
    { id: '1min', title: isServiceable ? 'Ready in 1 Min' : 'Cook in 1 Min', subtitle: isServiceable ? 'Quick bites & instant recipes' : 'Super fast recipes', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&q=80', filter: '1min' },
    { id: '10min', title: isServiceable ? 'Ready in 10 Mins' : 'Cook in 10 Mins', subtitle: 'Fast & easy meals', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80', filter: '10min' },
    { id: '30min', title: isServiceable ? 'Ready in 30 Mins' : 'Cook in 30 Mins', subtitle: 'Gourmet experiences', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&q=80', filter: '30min' },
    { id: 'ready', title: isServiceable ? 'Ready to Eat' : 'Master Chef Tips', subtitle: isServiceable ? 'Fresh & pre-cooked' : 'Learn pro techniques', image: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=500&q=80', filter: 'ready' },
    { id: 'offers', title: isServiceable ? 'Special Offers' : 'Featured Recipes', subtitle: isServiceable ? 'Discounts & deals' : 'Editor\'s pick for you', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&q=80', filter: 'offers' },
    { id: 'xp', title: 'XP Boost', subtitle: 'Level up faster', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&q=80', filter: 'xp' },
  ];

  const BentoCard = ({ item, style }: any) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => handleCategoryPress(item.filter)}
      style={[styles.bentoCard, style, { padding: 0, borderStartColor: 'transparent', height: style?.height || 120 }]}
    >
      <ImageBackground
        source={{ uri: item.image }}
        style={{ flex: 1, justifyContent: 'flex-end' }}
        imageStyle={{ borderRadius: 12, opacity: 0.6 }}
      >
        <View style={{
          backgroundColor: 'rgba(0,0,0,0.4)',
          padding: 10,
          borderRadius: 12,
          flex: 1,
          justifyContent: 'flex-end'
        }}>
          <Text style={[styles.bentoTitle, { color: colors.white, fontSize: 13, marginBottom: 2 }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={{ color: colors.gray[200], fontSize: 10, fontFamily: typography.fontFamily.medium }} numberOfLines={1}>
            {item.subtitle}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );


  const bestsellers = [
    {
      id: '1',
      name: 'Paneer Tikka',
      image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop',
      rating: 4.5,
      reviews: 20,
      xp: 20,
      difficulty: 'Easy',
    },
    {
      id: '2',
      name: 'Veg Biryani',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=400&h=300&fit=crop',
      rating: 4.2,
      reviews: 15,
      xp: 25,
      difficulty: 'Medium',
    },
    {
      id: '3',
      name: 'Chicken Samosa',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
      rating: 4.8,
      reviews: 42,
      xp: 30,
      difficulty: 'Easy',
    },
    {
      id: '4',
      name: 'Mutton Kebab',
      image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=300&fit=crop',
      rating: 4.6,
      reviews: 28,
      xp: 35,
      difficulty: 'Hard',
    },
  ];

  const CompactRecipeCard = ({ recipe, onPress }: any) => (
    <TouchableOpacity style={styles.compactCard} onPress={onPress}>
      <Image source={{ uri: recipe.image }} style={styles.compactImage} />
      <View style={styles.compactContent}>
        <Text style={styles.compactTitle} numberOfLines={1}>{recipe.name}</Text>
        <View style={styles.compactMeta}>
          <Ionicons name="star" size={12} color={colors.yellow[500]} />
          <Text style={styles.compactMetaText}>{recipe.rating || 4.5}</Text>
          <Text style={styles.compactMetaText}>•</Text>
          <Text style={styles.compactMetaText}>{recipe.reviews || 10}</Text>
          <View style={styles.xpBadge}>
            <View style={styles.xpCoin}>
              <Text style={styles.xpCoinText}>●</Text>
            </View>
            <Text style={styles.xpText}>{recipe.xp || 20} XP</Text>
          </View>
        </View>
        <View style={styles.compactFooter}>
          <Ionicons name="information-circle-outline" size={12} color={colors.gray[400]} />
          <Text style={styles.compactFooterText}>{recipe.difficulty || 'Easy'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleChatSubmit = async () => {
    if (!searchQuery.trim()) return;

    const userText = searchQuery;
    setSearchQuery('');
    Keyboard.dismiss();
    setIsSearchFocused(false);

    // Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
      timestamp: Date.now(),
    };
    chatService.addMessage(userMsg);

    generateMascotResponse(userText);
  };

  const generateMascotResponse = async (query: string) => {
    setIsTyping(true);
    // Use the centralized chat logic from ChatService
    // Simulate a delay for natural feel
    setTimeout(async () => {
      await chatService.generateBotResponse(query);
      setIsTyping(false);
    }, 1000);
  };

  const handleBrowseRecipes = (term?: string) => {
    // Navigate to Full Chat Interface
    // We don't need to pass initialQuery if we are syncing via service
    // But if term is provided (quick tags), we should probably submit it first?
    // For now, if term is passed, we treat it as a new chat submission then navigate?
    // Or just navigate. The user asked for maximize icon to expand.
    // Let's just navigate.
    setIsSearchFocused(false);
    navigation.navigate('Chat');
  };



  const handleCategoryPress = (filter: string) => {
    // Navigate to Recipes tab with filter
    navigation.navigate('RecipesTab', {
      screen: 'RecipeList',
      params: { timeFilter: filter },
    });
  };

  const handleSearchPress = (query: string) => {
    // Navigate to Recipe List with search query (bypassing Chat)
    setIsSearchFocused(false);
    setSearchQuery('');
    Keyboard.dismiss();

    navigation.navigate('Main', {
      screen: 'RecipesTab',
      params: {
        screen: 'RecipeList',
        params: { initialSearch: query },
      }
    });
  };

  const handleSuggestionPress = (recipe: Recipe) => {
    setIsSearchFocused(false);
    setSearchQuery('');
    Keyboard.dismiss();

    // Navigate to Recipe Detail
    navigation.navigate('Main', {
      screen: 'RecipesTab',
      params: {
        screen: 'RecipeDetail',
        params: { recipeId: String(recipe.id) },
      }
    });
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchCancel = () => {
    setIsSearchFocused(false);
    setSearchQuery('');
    Keyboard.dismiss();
  };

  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      scrollEnabled={true}
    >

      {/* Hero Section */}
      <View style={[styles.hero, { backgroundColor: colors.primary[50] }]}>
        {/* Search Bar */}
        {/* ... */}
        <View style={styles.mascotRow}>
          {/* TODO: [CLOUDINARY] Upload 'cat-cheff.png' to Cloudinary and usage remote URL.
              Example: source={{ uri: 'https://res.cloudinary.com/.../cat-cheff.png' }}
              This reduces bundle size. */}
          <Image
            source={{ uri: `${CDN_URL}/cat-cheff.png` }}
            style={styles.catImage}
            resizeMode="contain"
          />
          <View style={styles.speechBubble}>
            {/* Maximize Icon */}
            <TouchableOpacity
              style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}
              onPress={() => navigation.navigate('Chat')}
            >
              <Feather name="maximize-2" size={16} color={colors.gray[500]} />
            </TouchableOpacity>

            <View style={{ height: 80 }}>
              <ScrollView
                ref={chatListRef}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => chatListRef.current?.scrollToEnd({ animated: true })}
              >
                {chatMessages.map((item) => (
                  <View
                    key={item.id}
                    style={{
                      marginBottom: 8,
                      alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start',
                      backgroundColor: item.sender === 'user' ? colors.primary[500] : colors.white,
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 12,
                      borderBottomRightRadius: item.sender === 'user' ? 2 : 12,
                      borderBottomLeftRadius: item.sender === 'bot' ? 2 : 12,
                      maxWidth: '85%',
                      ...shadow.soft,
                    }}
                  >
                    <Text style={{
                      fontSize: typography.fontSize.xs,
                      color: item.sender === 'user' ? colors.white : colors.text.primary,
                      fontFamily: typography.fontFamily.medium,
                    }}>
                      {item.text}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
        <View style={{ zIndex: 10 }}>
          <View style={styles.newSearchContainer}>
            <Feather name="search" size={20} color={colors.gray[400]} style={{ marginRight: 10 }} />
            <TextInput
              style={styles.searchInput}
              placeholder={dynamicPlaceholder}
              placeholderTextColor={colors.gray[400]}
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
              }}
              onSubmitEditing={() => handleChatSubmit()}
              onFocus={handleSearchFocus}
            />
            {isSearchFocused ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                {/* <TouchableOpacity onPress={() => handleBrowseRecipes()}>
                  <Feather name="arrow-right-circle" size={20} color={colors.primary[500]} />
                </TouchableOpacity> */}
                <TouchableOpacity onPress={handleSearchCancel}>
                  <Feather name="x" size={20} color={colors.gray[400]} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => console.log('Mic pressed')}>
                <Feather name="mic" size={20} color={colors.gray[400]} />
              </TouchableOpacity>
            )}
          </View>

          {/* Permanent Suggestions Strip */}
          <View style={{ marginTop: spacing.xs }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 2, paddingBottom: 4 }}
            >
              {quickOptions.map((tag, index) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.quickTag,
                    {
                      marginRight: 3,
                      backgroundColor: colors.white,
                      borderWidth: 1,
                      borderColor: colors.gray[200],
                      elevation: 0,
                      shadowOpacity: 0
                    }
                  ]}
                  onPress={() => handleSearchPress(tag)}
                >
                  <Text style={[styles.quickTagText, { color: colors.gray[700] }]}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Search Mode Overlay Content - Only Suggestions/Results */}
          {isSearchFocused && searchQuery.length > 0 && (
            <View style={styles.searchOverlay}>
              <View style={styles.resultsList}>
                {suggestions.length > 0 && suggestions.map((recipe) => (
                  <TouchableOpacity
                    key={recipe.id}
                    style={[styles.suggestionItem, styles.suggestionBorder]}
                    onPress={() => handleSuggestionPress(recipe)}
                  >
                    <Feather name="search" size={14} color={colors.gray[400]} style={{ marginRight: 8 }} />
                    <Text style={styles.suggestionText} numberOfLines={1}>{recipe.name}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[
                    styles.suggestionItem,
                    { borderTopWidth: suggestions.length > 0 ? 0 : 1, borderTopColor: colors.gray[100] }
                  ]}
                  onPress={() => handleSearchPress(searchQuery)}
                >
                  <Feather name="list" size={16} color={colors.primary[500]} style={{ marginRight: 10 }} />
                  <Text style={[styles.suggestionText, { color: colors.primary[500], fontWeight: '600' }]}>
                    See all results for "{searchQuery}"
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

        </View>

      </View>

      {/* Promo Carousel */}
      <View style={styles.promoContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.promoScroll}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          {promos.map((promo) => (
            <View key={promo.id} style={{ width: windowWidth, paddingHorizontal: 16 }}>
              <View style={styles.promoCard}>
                {/* TODO: [CLOUDINARY] Ensure these promo images are served from Cloudinary in production for optimization */}
                <Image source={{ uri: promo.image }} style={styles.promoImage} />
                <View style={styles.promoOverlay} />
                <View style={styles.promoContent}>
                  <Text style={styles.promoTitle}>{promo.title}</Text>
                  <Text style={styles.promoSubtitle}>{promo.subtitle}</Text>
                  <TouchableOpacity
                    style={styles.promoButton}
                    onPress={() => navigation.navigate('RecipesTab')}
                  >
                    <Text style={styles.promoButtonText}>{isServiceable ? 'Shop Now' : 'View Recipes'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {promos.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentSlide === index ? styles.activeDot : styles.inactiveDot
              ]}
            />
          ))}
        </View>
      </View >

      {/* Suggested Recipes from Chat */}
      {suggestedRecipes.length > 0 && (
        <View style={[styles.section, { backgroundColor: colors.green[50], paddingVertical: spacing.xs }]}>
          <View style={{ marginBottom: 0 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={[styles.sectionTitle as any, { textAlign: 'left', color: colors.green[800] }]}>Eatee Kitty's Suggestions</Text>
              <TouchableOpacity onPress={() => setSuggestedRecipes([])}>
                <Feather name="x-circle" size={24} color={colors.green[700]} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.sectionSubtitle, { textAlign: 'left' }]}>Based on your chat</Text>
          </View>
          <View style={styles.compactGrid}>
            {suggestedRecipes.map((recipe) => (
              <CompactRecipeCard
                key={recipe.id}
                recipe={recipe}
                onPress={() => navigation.navigate('Main', {
                  screen: 'RecipesTab',
                  params: {
                    screen: 'RecipeDetail',
                    params: { recipeId: String(recipe.id) },
                  }
                })}
              />
            ))}
          </View>
        </View>
      )}


      {/* Categories Section - Mosaic Layout */}
      < View style={styles.section} >
        < View style={styles.bentoGrid} >
          <View style={styles.bentoRow}>
            {/* Left Column */}
            <View style={styles.bentoCol}>
              <BentoCard item={categories[0]} style={{ height: 140 }} />
              <BentoCard item={categories[5]} style={{ height: 100 }} />
              <BentoCard item={categories[3]} style={{ height: 100 }} />
            </View>

            {/* Right Column */}
            <View style={styles.bentoCol}>
              <BentoCard item={categories[1]} style={{ height: 100 }} />
              <BentoCard item={categories[2]} style={{ height: 140 }} />
              <BentoCard item={categories[4]} style={{ height: 100 }} />
            </View>
          </View>
        </View >
      </View >

      {/* Bestsellers Section */}
      < View style={[styles.section, { backgroundColor: colors.rose[50] }]} >
        <Text style={[styles.sectionTitle as any, { color: colors.rose[900] }]}>Top Recommendations</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.rose[700] }]}>
          {isServiceable ? 'Restaurant-quality appetizers, ready in minutes at home' : 'Professional recipes for restaurant-quality appetizers at home'}
        </Text>
        <View style={styles.compactGrid}>
          {bestsellers.map((product) => (
            <CompactRecipeCard
              key={product.id}
              recipe={product}
              onPress={() => navigation.navigate('Main', {
                screen: 'RecipesTab',
                params: {
                  screen: 'RecipeDetail',
                  params: { recipeId: String(product.id) },
                }
              })}
            />
          ))}
        </View>
      </View >

    </ScrollView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  hero: {
    paddingHorizontal: spacing.md, // 16px
    paddingTop: spacing.md, // Reduced from lg(20) to md(16)
    paddingBottom: 12, // Reduced from spacing.md(16)
  },
  heroTitle: {
    ...textStyles.h1,
    fontSize: typography.fontSize['4xl'],
    lineHeight: typography.lineHeight.tight * typography.fontSize['4xl'],
    marginBottom: spacing.md,
  },
  heroAccent: {
    color: colors.primary[500],
  },
  heroSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.sm,
    marginBottom: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    ...shadow.soft,
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  // searchInput: {
  //   flex: 1,
  //   fontSize: typography.fontSize.base,
  //   color: colors.text.primary,
  //   fontFamily: typography.fontFamily.medium,
  //   height: 40,
  // },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.gray[200],
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starIcon: {
    fontSize: 20,
    marginRight: 4,
  },
  section: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm, // Reduced from md(16) to sm(8) for even denser layout
  },
  sectionTitle: {
    fontSize: typography.fontSize['xl'],
    fontFamily: typography.fontFamily.display,
    fontWeight: '700' as const,
    color: colors.text.primary,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.gray[600],
    textAlign: 'center',
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  categoryCard: {
    width: '47%', // Slightly less than 50% to account for gap
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.gray[200],
    ...shadow.soft,
  },
  categoryIcon: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  categoryTitle: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.display,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  categoryDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    marginBottom: spacing.sm,
  },
  categoryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  categoryDishes: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.semibold,
    color: colors.primary[600],
  },
  arrowIcon: {
    fontSize: 18,
    color: colors.primary[600],
  },
  bestsellersCarousel: {
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    marginTop: spacing.md,
  },
  productCard: {
    width: 180,
    marginRight: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    ...shadow.soft,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 100,
  },
  productInfo: {
    padding: spacing.sm,
  },
  productName: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  productDescription: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
  },
  cta: {
    backgroundColor: colors.primary[500],
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius['2xl'],
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  ctaIcon: {
    fontSize: 40,
  },
  ctaTitle: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.display,
    color: colors.white,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.white,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    gap: spacing.sm,
  },
  ctaButtonText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary[600],
  },
  businessSection: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.amber[50],
    borderRadius: borderRadius['2xl'],
    alignItems: 'center',
  },
  businessIcon: {
    fontSize: 40,
  },
  businessTitle: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.display,
    fontWeight: '700' as const,
    color: colors.amber[900],
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  businessSubtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.amber[700],
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  businessButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  businessButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    flex: 1,
    minWidth: 120,
  },
  wholesaleButton: {
    backgroundColor: colors.accent[500],
  },
  businessButtonText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
    textAlign: 'center',
  },
  mascotRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    // paddingLeft: -0,
    // paddingHorizontal: 10,
    marginBottom: -4.2,
    // zIndex: 10,
  },
  catImage: {
    width: 110,
    height: 110,
    marginRight: 2,
  },
  speechBubble: {
    flex: 1,
    backgroundColor: '#E0F7FA', // Or use colors.primary[100]
    padding: 6,
    borderRadius: 16,
    borderBottomLeftRadius: 0, // Makes it look like a speech bubble
    marginBottom: 10, // Push bubble up slightly more than the cat
  },
  bubbleTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
    marginBottom: 2,
  },
  bubbleSubtitle: {
    fontSize: 12,
    color: '#546E7A', // Or colors.gray[600]
  },
  newSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#00897B', // Or colors.primary[500]
    borderRadius: 10, // High number for pill shape
    paddingHorizontal: 10,
    height: 40,
    marginTop: 0, // The negative margin on mascotRow handles the overlap
    zIndex: 1, // Ensure search bar sits on TOP
    shadowColor: '#000', // Optional: nice drop shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    paddingVertical: 0,
    height: '100%',
  },
  suggestionsContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginTop: 4,
    ...shadow.medium,
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 100,
    elevation: 8, // Make sure it floats above
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  suggestionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  suggestionText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    fontFamily: typography.fontFamily.medium,
  },
  promoContainer: {
    marginBottom: spacing.xs,
    height: 140, // Slightly more compact (was 150)
  },
  promoScroll: {
    // paddingLeft: spacing.md, 
  },
  promoCard: {
    // width handled by parent wrapper
    height: 140, // Reduced from 160
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.gray[200],
    position: 'relative',
    ...shadow.medium, // Stronger shadow for promos
    width: '100%',
  },
  promoImage: {
    width: '100%',
    height: '100%',
  },
  promoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  promoContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
  },
  promoTitle: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[200],
    marginBottom: spacing.md,
  },
  promoButton: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: spacing.md,
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.white,
  },
  inactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  // New Styles
  searchOverlay: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    zIndex: 100,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadow.medium,
  },
  quickOptionsContainer: {
    // marginTop removed
  },
  quickOptionsTitle: {
    fontSize: typography.fontSize.base,
    color: colors.gray[600],
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  quickTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  quickTag: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  quickTagText: {
    color: colors.gray[800],
    fontSize: typography.fontSize.xs,
  },
  resultsList: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  bentoGrid: {
    gap: spacing.xs,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  bentoCol: {
    flex: 1,
    gap: spacing.xs,
  },
  bentoCard: {
    padding: 8,
    borderRadius: borderRadius['sm'],
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.gray[100],
    ...shadow.soft, // Use soft shadow
  },
  bentoIcon: {
    width: 44,
    height: 44,
    borderRadius: 999, // Circulrar
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  bentoTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  bentoSubtitle: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    lineHeight: 16,
  },
  compactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  compactCard: {
    width: '48%', // Slightly smaller to ensure gap fits
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    marginBottom: spacing.sm, // Reduced from spacing.md(16)
    ...shadow.soft,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[50], // Very subtle border
  },
  compactImage: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
  },
  compactContent: {
    flex: 1,
    marginLeft: 8,
  },
  compactTitle: {
    fontSize: 12,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: 2,
  },
  compactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flexWrap: 'wrap',
    marginBottom: 2,
  },
  compactMetaText: {
    fontSize: 10,
    color: colors.gray[600],
  },
  compactMetaDivider: {
    fontSize: 10,
    color: colors.gray[400],
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 2,
  },
  xpCoin: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFC107',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
  },
  xpCoinText: {
    fontSize: 6,
    color: colors.white,
  },
  xpText: {
    fontSize: 9,
    fontFamily: typography.fontFamily.bold,
    color: '#F57F17',
  },
  compactFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  compactFooterText: {
    fontSize: 10,
    color: colors.gray[500],
  },
});

export default HomeScreen;
