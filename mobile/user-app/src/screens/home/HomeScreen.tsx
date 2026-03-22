import React, { useState, useEffect, useRef } from 'react';
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
  ImageBackground,
  BackHandler,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { API_CONFIG, CDN_URL } from '../../constants/config';
import { colors } from '../../constants/colors';
import { typography, textStyles } from '../../constants/typography';
import { spacing, borderRadius, shadow } from '../../constants/spacing';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { chatService, Message } from '../../services/chatService';
import { recipeService } from '../../services/recipeService';
import { Recipe } from '../../types/recipe';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KittyChatSearchBar } from '../../components/common/KittyChatSearchBar';
import { VerticalProductCard } from '../../components/product/VerticalProductCard';

const { width: windowWidth } = Dimensions.get('window'); // Re-declaring since we removed interface


import { useLocationStore } from '../../stores/locationStore';
import useCartStore from '../../stores/cartStore';
import useRecipeStore from '../../stores/recipeStore';

/**
 * Home Screen - Landing page with categories
 */

export const HomeScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { location } = useLocationStore();
  const isServiceable = location?.toLowerCase().includes('kolkata');

  const { items, addItem, updateQuantityByIngredientId } = useCartStore();
  const { addSearchTerm, getUnifiedFrequentList, addFrequentItem, clearSearchHistory } = useRecipeStore();
  const unifiedFrequent = getUnifiedFrequentList();

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const chatListRef = React.useRef<ScrollView>(null);


  const quickOptions = ['Breakfast', 'Healthy', 'Snacks', 'Dessert', 'Spicy', 'Chicken', 'Chinese', 'Italian', 'Mexican'];

  const promos = [
    { id: 1, title: '50% OFF on First Order', subtitle: 'Use code: WELCOME50', color: '#FF7043', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80' },
    { id: 2, title: 'New Vegan Collection', subtitle: 'Explore plant-based goodness', color: '#66BB6A', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80' },
    { id: 3, title: 'Chef\'s Special Curry', subtitle: 'Limited time offer', color: '#FFA726', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80' }
  ];

  const carouselWidth = (windowWidth - 32 - 4) * 0.75;

  // Handle back button press when search is focused
  useEffect(() => {
    const backAction = () => {
      if (isSearchFocused) {
        setIsSearchFocused(false);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [isSearchFocused]);

  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      let nextSlide = currentSlide + 1;
      if (nextSlide >= promos.length) nextSlide = 0;

      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: nextSlide * carouselWidth,
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

  const [bestsellers, setBestsellers] = useState<any[]>([]);

  const [liveProducts, setLiveProducts] = useState<Record<string, any[]>>({});
  const [loadingLive, setLoadingLive] = useState(true);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      setLoadingLive(true);
      const featuredCategories = categories.filter(c => c.row <= 3).map(c => c.id);
      const productMap: Record<string, any[]> = {};

      try {
        // Fetch category products
        await Promise.all(featuredCategories.map(async (catId) => {
          const { recipes } = await recipeService.getRecipes({ category: catId, limit: 5 });
          if (recipes && recipes.length > 0) {
            productMap[catId] = recipes;
          }
        }));
        setLiveProducts(productMap);

        // Fetch bestsellers (recent items for now)
        const { recipes: recentProducts } = await recipeService.getRecipes({ limit: 10 });
        setBestsellers(recentProducts);
      } catch (error) {
        console.warn("Failed to fetch home products:", error);
      } finally {
        setLoadingLive(false);
      }
    };
    fetchHomeProducts();
  }, []);





  const categories = [
    // Row 1: Vertical/Bento (Next to Promo)
    { id: 'frozen', title: 'Ready to cook: Frozen', subtitle: 'Quick frozen delicacies', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&q=80', filter: 'frozen', row: 1 },

    // Row 2: Curated Deliveries (Auto-adjusting grid)
    { id: '5min', title: '5 Min Meals', subtitle: 'Instant satisfaction', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80', filter: '5min', row: 2 },
    { id: '10min', title: '10 Min Meals', subtitle: 'Fast & fresh', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&q=80', filter: '10min', row: 2 },

    // Row 3: Sourcing Categories — 4 squares with local images
    { id: 'veg', title: 'Fresh Vegetables', subtitle: 'Farm to home', image: require('../../../assets/images/vege.jpg'), filter: 'vegetables', row: 3 },
    { id: 'meat', title: 'Fresh & Frozen Meat', subtitle: 'Premium cuts', image: require('../../../assets/images/chicken.jpg'), filter: 'meat', row: 3 },
    { id: 'kitchen', title: 'Kitchen Essentials', subtitle: 'Pro grade tools', image: require('../../../assets/images/kitchen.jpg'), filter: 'kitchen', row: 3 },
    { id: 'packaging', title: 'Packaging Materials', subtitle: 'Sustainable', image: require('../../../assets/images/packag.jpg'), filter: 'packaging', row: 3 },
  ];




  const CUISINES = [
    { id: 'chinese', name: 'Chinese', image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=600&q=80' },
    { id: 'italian', name: 'Italian', image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=600&q=80' },
    { id: 'indian', name: 'Indian', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80' },
    { id: 'mexican', name: 'Mexican', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80' },
    { id: 'japanese', name: 'Japanese', image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&q=80' },
    { id: 'thai', name: 'Thai', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80' },
    { id: 'french', name: 'French', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80' },
    { id: 'mediterranean', name: 'Mediterranean', image: 'https://images.unsplash.com/photo-1505575967455-40e256f73376?w=600&q=80' },
    { id: 'middle-eastern', name: 'Middle Eastern', image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&q=80' },
  ];

  const PACKAGING_DATA = [
    { id: 'boxes', name: 'Premium Boxes', description: 'Bio-degradable, High durability', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80' },
    { id: 'bags', name: 'Custom Bags', description: 'Eco-friendly, Custom printing', image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&q=80' },
    { id: 'cutlery', name: 'Eco Cutlery', description: 'Wooden & Bamboo essentials', image: 'https://images.unsplash.com/photo-1591871937573-74dbba515c4c?w=600&q=80' },
    { id: 'wraps', name: 'Luxury Wraps', description: 'Protective & Aesthetic rolls', image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80' },
  ];

  const PARTNER_BRANDS = [
    { id: 'b1', name: 'Amul', image: require('../../../assets/images/amul.png') },
    { id: 'b2', name: 'Nestle', image: require('../../../assets/images/nestle.png') },
    { id: 'b3', name: 'Britannia', image: require('../../../assets/images/britannia.jpeg') },
    { id: 'b4', name: 'Mother Dairy', image: require('../../../assets/images/motherdairy.png') },
    { id: 'b5', name: 'Parle', image: require('../../../assets/images/parle.png') },
    { id: 'b6', name: 'Coca-Cola', image: require('../../../assets/images/cococola.png') },
    { id: 'b7', name: 'Unilever', image: require('../../../assets/images/unilever.jpeg') },
    { id: 'b8', name: 'Pepsi', image: require('../../../assets/images/pepsi.png') },
  ];

  // Animation for Brands Ticker
  const scrollX = useRef(new Animated.Value(0)).current;
  const brandsCount = PARTNER_BRANDS.length;
  const brandWidth = 100; // Increased from 80 for larger badge
  const totalWidth = brandsCount * brandWidth;

  useEffect(() => {
    const startAnimation = () => {
      scrollX.setValue(0);
      Animated.loop(
        Animated.timing(scrollX, {
          toValue: -totalWidth,
          duration: 20000, // Move slower for better look
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    };
    startAnimation();
  }, [totalWidth]);

  const CompactProductCard = ({ recipe: product, onPress, style }: any) => {
    const { addItem } = useCartStore();
    const { addFrequentItem } = useRecipeStore();
    const isOutOfStock = product.inStock === false;

    return (
      <TouchableOpacity style={[styles.compactCard, style]} onPress={onPress} activeOpacity={0.9}>
        <View style={[styles.compactImageContainer, isOutOfStock && { opacity: 0.5 }]}>
          <Image source={{ uri: product.image }} style={styles.compactImage} />
        </View>
        <View style={styles.compactContent}>
          <Text style={styles.compactTitle} numberOfLines={2}>{product.name}</Text>
          <View style={styles.compactMeta}>
            <Ionicons name="star" size={10} color={colors.yellow[500]} />
            <Text style={styles.compactMetaText}>{product.rating || 4.5}</Text>
            <Text style={styles.compactMetaText}>•</Text>
            <Text style={styles.compactMetaText}>{product.unit || 'per unit'}</Text>
          </View>

          <View style={styles.compactPriceRow}>
            <View style={styles.compactPriceStack}>
              {product.mrp && product.mrp > (product.price || product.basePrice || 0) && (
                <Text style={styles.compactMrp}>₹{product.mrp}</Text>
              )}
              <Text style={styles.compactPrice}>₹{product.price || product.basePrice || 0}</Text>
            </View>
          </View>
        </View>

        {isOutOfStock ? (
          <View style={[styles.miniAddBtn, { backgroundColor: colors.gray[100], width: 'auto', paddingHorizontal: 6, borderRadius: 4, height: 20, borderWidth: 1, borderColor: colors.gray[300] }]}>
            <Text style={{ fontSize: 9, fontFamily: typography.fontFamily.bold, color: colors.gray[500] }}>OUT</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.miniAddBtn}
            onPress={(e) => {
              e.stopPropagation();
              const ingredient = {
                id: product.id,
                name: product.name,
                price: product.price || product.basePrice || 0,
                unit: product.unit || product.weight || '',
                image: product.image,
                category: product.category || 'general'
              };
              addItem(ingredient as any, 1);
              addFrequentItem(product);
            }}
          >
            <Feather name="plus" size={12} color={colors.white} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const [searchResults, setSearchResults] = useState<Recipe[]>([]);

  const handleCategoryPress = (filter: string) => {
    const category = categories.find(c => c.filter === filter || c.id === filter);
    navigation.navigate('ProductsTab', {
      screen: 'CategoryDetail',
      params: {
        categoryId: category?.id || filter,
        categoryTitle: category?.title || 'Products',
      }
    });
  };


  const TrendingGem = ({ item, onPress }: any) => (
    <TouchableOpacity
      style={styles.gemContainer}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.gemCircle}>
        <Image source={{ uri: item.image }} style={styles.gemImage} resizeMode="cover" />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      scrollEnabled={true}
    >

      {/* Hero Section */}
      <View style={styles.hero}>
        <KittyChatSearchBar
          navigation={navigation}
          onSearchResults={(results) => setSearchResults(results)}
        />
      </View>

      {/* Active Search Results Section */}
      {searchResults.length > 0 && (
        <View style={styles.sectionCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 0, marginBottom: 12 }}>
            <Text style={{ ...textStyles.h2, color: colors.text.primary, textAlign: 'left' }}>
              Search Results
            </Text>
            <TouchableOpacity onPress={() => setSearchResults([])}>
              <Text style={{ fontSize: 13, color: colors.primary[600], fontWeight: '700', fontFamily: typography.fontFamily.semibold }}>Clear</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 0, paddingHorizontal: 0, alignItems: 'flex-start' }}
          >
            {searchResults.map((product) => (
              <View key={product.id} style={{ marginRight: 8 }}>
                <VerticalProductCard
                  product={product}
                  width={windowWidth * 0.42}
                  onPress={() => navigation.navigate('ProductsTab', {
                    screen: 'ProductDetail',
                    params: { product }
                  })}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Recommended for You Section - Unified */}
      <View style={styles.sectionCard}>
        <View style={[styles.hitsSection, { backgroundColor: 'transparent' }]}>
          <View style={[styles.hitsHeader, { paddingHorizontal: 0, justifyContent: 'space-between' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.hitsTitle}>Recommended for You</Text>
              <Ionicons name="sparkles" size={14} color={colors.primary[500]} />
            </View>
            {unifiedFrequent.length > 0 && (
              <TouchableOpacity onPress={() => clearSearchHistory()}>
                <Text style={{ fontSize: 13, color: colors.primary[600], fontWeight: '700' }}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.hitsScroll, { paddingHorizontal: 0 }]}
          >
            {unifiedFrequent.length > 0 ? (
              unifiedFrequent.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.gemContainer}
                  onPress={() => {
                    // Re-implement search logic if needed, or just navigate
                    if (item.type === 'search') {
                      // Logic for search
                    } else {
                      navigation.navigate('ProductsTab', {
                        screen: 'ProductDetail',
                        params: { product: item.product }
                      })
                    }
                  }}
                >
                  <View style={[
                    styles.gemCircle,
                    item.type === 'search'
                      ? { backgroundColor: colors.primary[50], borderStyle: 'dashed', borderWidth: 1, borderColor: colors.primary[200] }
                      : { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gray[100] }
                  ]}>
                    {item.type === 'search' ? (
                      <Feather name="search" size={24} color={colors.primary[400]} />
                    ) : (
                      <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%', borderRadius: 100 }} />
                    )}
                  </View>
                  <Text numberOfLines={1} style={{ fontSize: 11, color: colors.gray[600], marginTop: 6, fontWeight: '600', width: 70, textAlign: 'center' }}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              // Initial placeholders
              [
                { title: 'Frozen', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80', filter: 'frozen' },
                { title: 'Vegetables', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80', filter: 'veg' },
                { title: 'Meat', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80', filter: 'meat' },
                { title: 'Dairy', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80', filter: 'grocery' },
                { title: 'Snacks', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80', filter: 'frozen' },
                { title: 'Breakfast', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80', filter: '5min' },
                { title: 'Groceries', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80', filter: 'grocery' },
                { title: 'Beverages', image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400&q=80', filter: 'frozen' },
                { title: 'Fruits', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80', filter: 'veg' },
                { title: 'Kitchen', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&q=80', filter: 'packaging' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.title}
                  style={styles.gemContainer}
                  onPress={() => handleCategoryPress(item.filter)}
                >
                  <View style={[styles.gemCircle, { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gray[100] }]}>
                    <Image
                      source={{ uri: item.image }}
                      style={{ width: '100%', height: '100%', borderRadius: 100 }}
                    />
                  </View>
                  <Text numberOfLines={1} style={{ fontSize: 11, color: colors.gray[600], marginTop: 6, fontWeight: '600', width: 70, textAlign: 'center' }}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.bentoSection}>
          <View style={styles.bentoGrid}>
            {/* Row 1: Carousel (3/4) + First Row 1 Category (1/4) */}
            <View style={styles.bentoRow}>
              <View style={styles.promoWrapper}>
                <ScrollView
                  ref={scrollViewRef}
                  horizontal
                  pagingEnabled={false}
                  snapToInterval={BENTO_WIDE_WIDTH}
                  snapToAlignment="start"
                  decelerationRate="fast"
                  showsHorizontalScrollIndicator={false}
                  onScroll={onScroll}
                  scrollEventThrottle={16}
                  style={styles.promoScroll}
                >
                  {promos.map((promo) => (
                    <View key={promo.id} style={{ width: carouselWidth, height: 96 }}>
                      <ImageBackground
                        source={{ uri: promo.image }}
                        style={styles.promoCardContent}
                        imageStyle={{ borderRadius: 12 }}
                      >
                        <View style={styles.promoOverlay} />
                        <View style={styles.promoContent}>
                          <Text style={styles.promoTitle} numberOfLines={1}>{promo.title}</Text>
                          <Text style={styles.promoSubtitle} numberOfLines={1}>{promo.subtitle}</Text>
                          <TouchableOpacity style={styles.promoMiniButton}>
                            <Text style={styles.promoMiniButtonText}>GO</Text>
                          </TouchableOpacity>
                        </View>
                      </ImageBackground>
                    </View>
                  ))}
                </ScrollView>
                {/* Dots */}
                <View style={styles.bentoDots}>
                  {promos.map((_, i) => (
                    <View key={i} style={[styles.bentoDot, currentSlide === i && styles.bentoDotActive]} />
                  ))}
                </View>
              </View>

              {categories.filter(c => c.row === 1).slice(0, 1).map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.bentoVertical}
                  onPress={() => handleCategoryPress(cat.filter)}
                >
                  <ImageBackground
                    source={{ uri: cat.image }}
                    style={styles.bentoImageFull}
                    imageStyle={{ transform: [{ scale: 1.1 }], resizeMode: 'cover' }}
                  >
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.8)']}
                      style={styles.bentoGradient}
                    >
                      <Text style={styles.bentoLabelFloating}>{cat.title.split(':').pop()?.trim()}</Text>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </View>

            {/* Row 2: Curated Deliveries (Auto-adjusting grid) */}
            <View style={styles.bentoRow}>
              {categories.filter(c => c.row === 2).map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.bentoHalf} // Adjusts width automatically in flex-row bentoRow
                  onPress={() => handleCategoryPress(cat.filter)}
                >
                  <ImageBackground
                    source={{ uri: cat.image }}
                    style={styles.bentoImageFull}
                    imageStyle={{ transform: [{ scale: 1.1 }], resizeMode: 'cover' }}
                  >
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.8)']}
                      style={styles.bentoGradient}
                    >
                      <Text numberOfLines={2} style={styles.bentoLabelFloating}>{cat.title.split(':').pop()?.trim()}</Text>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </View>

            {/* Row 3: Core Categories — 4 squares, edge-to-edge */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.bentoSquareRow}
              style={styles.bentoSquareRowOuter}
            >
              {categories.filter(c => c.row === 3).map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.bentoSquareItem}
                  onPress={() => handleCategoryPress(cat.filter)}
                >
                  <ImageBackground
                    source={typeof cat.image === 'string' ? { uri: cat.image } : cat.image}
                    style={styles.bentoImageFull}
                    imageStyle={{ transform: [{ scale: 1.22 }], resizeMode: 'cover' }}
                  >
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.7)']}
                      style={styles.bentoGradient}
                    >
                      <Text style={[styles.bentoLabelFloating, { textAlign: 'center' }]} numberOfLines={2}>
                        {cat.title}
                      </Text>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>

      {/* Cuisine Sourcing Hub - Circular Gems */}
      <View style={styles.sectionCard}>
        <View style={[styles.hitsSection, { backgroundColor: 'transparent' }]}>
          <View style={[styles.hitsHeader, { paddingHorizontal: 0 }]}>
            <Text style={styles.hitsTitle}>Cuisine Sourcing Hub</Text>
            <MaterialCommunityIcons name="earth" size={14} color={colors.primary[500]} />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.hitsScroll, { paddingHorizontal: 0 }]}
          >
            {CUISINES.map((cuisine) => (
              <TouchableOpacity
                key={cuisine.id}
                style={styles.gemContainer}
                onPress={() => handleCategoryPress(cuisine.id)}
              >
                <View style={[styles.gemCircle, { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gray[100] }]}>
                  <Image source={{ uri: cuisine.image }} style={styles.gemImage} />
                </View>
                <Text numberOfLines={1} style={{ fontSize: 11, color: colors.gray[600], marginTop: 6, fontWeight: '600', width: 70, textAlign: 'center' }}>
                  {cuisine.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Best Sellers Section */}
      {bestsellers.length > 0 && (
        <View style={styles.sectionCard}>
          <View style={[styles.bestsellerSection, { backgroundColor: 'transparent' }]}>
            <View style={[styles.sectionHeader, { paddingHorizontal: 0 }]}>
              <Text style={styles.bestsellerTitle}>Best Selling Products</Text>
              <Feather name="trending-up" size={16} color={colors.primary[400]} />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[styles.bestsellerHorizContent, { paddingLeft: 0, paddingRight: 0 }]}
            >
              {Array.from({ length: Math.ceil(bestsellers.length / 2) }, (_, i) => (
                <View key={i} style={styles.bestsellerColumn}>
                  {bestsellers.slice(i * 2, i * 2 + 2).map((product) => (
                    <CompactProductCard
                      key={product.id}
                      recipe={product}
                      style={styles.compactCardHoriz}
                      onPress={() => navigation.navigate('ProductsTab', {
                        screen: 'ProductDetail',
                        params: { product }
                      })}
                    />
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Partner Brands Spotlight - Self-Moving Ticker */}
      <View style={styles.sectionCard}>
        <View style={[styles.brandsBreaker, { backgroundColor: 'transparent' }]}>
          <View style={[styles.sectionHeader, { paddingHorizontal: 0, marginBottom: 12 }]}>
            <Text style={styles.hitsTitle}>Trusted Partners</Text>
            <MaterialCommunityIcons name="shield-check" size={14} color={colors.primary[500]} />
          </View>
          <View style={{ overflow: 'hidden' }}>
            <Animated.View
              style={{
                flexDirection: 'row',
                transform: [{ translateX: scrollX }],
                width: totalWidth * 2,
                paddingLeft: 0,
              }}
            >
              {[...PARTNER_BRANDS, ...PARTNER_BRANDS].map((brand, index) => (
                <View key={`${brand.id}-${index}`} style={[styles.gemContainer, { width: brandWidth, marginHorizontal: 0 }]}>
                  <View style={styles.brandBadge}>
                    <View style={styles.brandBadgeInner}>
                      <Image
                        source={brand.image}
                        style={{ width: '85%', height: '85%', resizeMode: 'contain' }}
                      />
                    </View>
                  </View>
                  <Text numberOfLines={1} style={{ fontSize: 9, color: colors.gray[600], marginTop: 4, fontWeight: '600', textAlign: 'center' }}>
                    {brand.name}
                  </Text>
                </View>
              ))}
            </Animated.View>
          </View>
        </View>
      </View>

      {/* Infinite Category Flow */}
      {loadingLive ? (
        <View style={styles.sectionCard}>
          <View style={styles.loadingSection}>
            <ActivityIndicator size="small" color={colors.primary[500]} />
            <Text style={styles.loadingSectionText}>Loading fresh selections...</Text>
          </View>
        </View>
      ) : (
        categories.filter(c => c.row <= 3).map((category) => {
          const products = liveProducts[category.id];
          if (!products || products.length === 0) return null; // Don't show empty categories
          return (
            <View key={category.id} style={styles.sectionCard}>
              <View style={[styles.section, { paddingHorizontal: 0 }]}>
                <View style={[styles.sectionHeader, { paddingHorizontal: 0 }]}>
                  <Text style={styles.sectionTitle}>{category.title.split(':').pop()?.trim()}</Text>
                  <MaterialCommunityIcons name="lightning-bolt" size={16} color={colors.primary[500]} />
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={[styles.discoveryScroll, { paddingLeft: 0, paddingRight: 0 }]}
                >
                  {products.map((product) => {
                    const isMeal = ['5min', '10min', '15min'].includes(category.id);
                    return (
                      <VerticalProductCard
                        key={product.id}
                        width={windowWidth * 0.42}
                        product={product}
                        onPress={() => {
                          if (isMeal) {
                            navigation.navigate('RecipeDetail', { recipeId: product.id });
                          } else {
                            navigation.navigate('ProductsTab', {
                              screen: 'ProductDetail',
                              params: { product }
                            });
                          }
                        }}
                      />
                    );
                  })}
                  <TouchableOpacity
                    style={styles.viewAllCard}
                    onPress={() => handleCategoryPress(category.id)}
                  >
                    <View style={styles.viewAllCircle}>
                      <Feather name="arrow-right" size={24} color={colors.primary[500]} />
                    </View>
                    <Text style={styles.viewAllText}>View All</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>
          );
        })
      )}

      {/* Essential Packaging Hub */}
      <View style={styles.sectionCard}>
        <View style={[styles.section, { paddingHorizontal: 0 }]}>
          <View style={[styles.sectionHeader, { paddingHorizontal: 0 }]}>
            <Text style={styles.sectionTitle}>Essential Packaging Hub</Text>
            <MaterialCommunityIcons name="package-variant-closed" size={18} color={colors.primary[500]} />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={windowWidth * 0.7 + spacing.md}
            decelerationRate="fast"
            contentContainerStyle={[styles.cuisineScroll, { paddingLeft: 0, paddingRight: 0 }]}
          >
            {PACKAGING_DATA.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.cuisineCard}
                onPress={() => handleCategoryPress(item.id)}
                activeOpacity={0.9}
              >
                <ImageBackground
                  source={{ uri: item.image }}
                  style={styles.cuisineImage}
                  imageStyle={{ borderRadius: borderRadius.xl }}
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.85)']}
                    style={styles.cuisineGradient}
                  >
                    <View style={styles.cuisineContent}>
                      <Text style={styles.cuisineName}>{item.name}</Text>
                      <Text style={styles.cuisineDescription} numberOfLines={1}>
                        {item.description}
                      </Text>
                      <View style={styles.cuisineBadge}>
                        <Text style={styles.cuisineBadgeText}>VIEW CATALOG</Text>
                        <Feather name="arrow-right" size={12} color={colors.white} />
                      </View>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <View style={{ height: spacing.xl * 2 }} />

    </ScrollView >
  );
};

const BENTO_PADDING = 16;
const BENTO_GAP = 8;
const BENTO_UNIT = (windowWidth - (BENTO_PADDING * 2) - (BENTO_GAP * 3)) / 4;
const BENTO_WIDE_WIDTH = BENTO_UNIT * 3 + (BENTO_GAP * 2);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary, // Reverted to original light teal
  },
  hero: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: 2,
    marginTop: 0,
  },
  heroTitle: {
    ...textStyles.h1,
    fontSize: typography.fontSize['4xl'], // 28px
    lineHeight: typography.lineHeight.tight * typography.fontSize['4xl'],
    marginBottom: spacing.md,
  },
  heroAccent: {
    color: colors.primary[500],
  },
  heroSubtitle: {
    ...textStyles.bodySmall,
    color: colors.gray[600],
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.xsMedium,
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
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: 'flex-start',
  },
  sectionCard: {
    backgroundColor: colors.white,
    marginHorizontal: 6, // Small gap for "box" look
    borderRadius: 16,
    paddingHorizontal: 10, // margin(6) + padding(10) = 16px total
    paddingVertical: 10,
    marginBottom: 6, // Reduced from 12 to match search bar gap
    ...shadow.soft,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  bestsellerSection: {
    paddingTop: 0,
    paddingBottom: 0,
    marginVertical: 0,
    width: '100%',
  },
  bestsellerTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  sectionSubtitle: {
    ...textStyles.bodyLarge,
    color: colors.gray[600],
    textAlign: 'left',
    alignSelf: 'flex-start',
    width: '100%',
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
    alignItems: 'flex-start',
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
    textAlign: 'left',
  },
  businessSubtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.amber[700],
    textAlign: 'left',
    marginBottom: spacing.lg,
  },
  businessButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
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
    marginBottom: -4.2, // Back to original subtle overlap
  },
  catImage: {
    width: 110,
    height: 110,
    marginRight: 2,
    transform: [{ translateY: 20 }],
    zIndex: 1000, // Move ONLY the mascot down
  },
  speechBubble: {
    flex: 1,
    backgroundColor: '#E0F7FA', // Or use colors.primary[100]
    padding: 6,
    borderRadius: 16,
    borderBottomLeftRadius: 0, // Makes it look like a speech bubble
    marginBottom: 6, // Reduced from 10
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
    marginTop: 0,
    zIndex: 10, // Ensure search bar sits on TOP of the mascot
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
  bentoSection: {
    paddingVertical: 0,
  },
  bentoGrid: {
    gap: BENTO_GAP,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: BENTO_GAP,
    flexWrap: 'wrap', // Support auto-adjusting/wrapping for Row 2
  },
  promoWrapper: {
    flex: 3,
    height: BENTO_UNIT, // 1 unit high
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.gray[100],
    ...shadow.soft,
  },
  promoScroll: {
    width: '100%',
  },
  promoCardContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  promoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  promoContent: {
    padding: 12,
  },
  promoTitle: {
    fontSize: typography.fontSize.xl, // 16px (Aligned with H2)
    fontFamily: typography.fontFamily.display,
    fontWeight: typography.fontWeight.extrabold,
    color: colors.white,
    marginBottom: 2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: 2,
    textAlign: 'left',
  },
  promoSubtitle: {
    ...textStyles.bodySmall, // 11px
    color: colors.gray[100],
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'left',
  },
  promoMiniButton: {
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  promoMiniButtonText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary[600],
  },
  bentoDots: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    gap: 4,
  },
  bentoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  bentoDotActive: {
    backgroundColor: colors.white,
    width: 12,
  },
  bentoVertical: {
    flex: 1,
    height: BENTO_UNIT, // 1 unit high
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.gray[100],
    ...shadow.soft,
  },
  bentoHalf: {
    flex: 1,
    height: BENTO_UNIT, // 1 unit high
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.gray[100],
    ...shadow.soft,
  },
  bentoQuarter: {
    flex: 1,
    height: BENTO_UNIT, // 1 unit high
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.gray[100],
    ...shadow.soft,
    minWidth: '22%', // Ensure at least 4 items fit, but they can wrap
  },
  bentoScrollRow: {
    gap: BENTO_GAP,
    paddingRight: BENTO_PADDING,
    marginTop: 2,
  },
  bentoScrollItem: {
    width: BENTO_UNIT * 1.8,
    height: BENTO_UNIT,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.gray[100],
    ...shadow.soft,
  },
  bentoSquareRowOuter: {
    marginTop: 0,
  },
  bentoSquareRow: {
    gap: BENTO_GAP,
  },
  bentoSquareItem: {
    width: BENTO_UNIT,
    height: BENTO_UNIT,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.gray[100],
    ...shadow.soft,
  },
  bentoImageFull: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bentoScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  bentoScrimLight: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  bentoLabelFloating: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '600', // Semibold
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
    paddingHorizontal: 4, // Horizontal only for small items
  },
  bentoGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // New Styles
  searchOverlay: {
    position: 'absolute',
    top: 48, // Below the search bar
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    zIndex: 1000,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    ...shadow.medium,
    borderWidth: 1,
    borderColor: colors.gray[100],
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
    paddingHorizontal: 6, // Refined for sleekness
    paddingVertical: 2, // Refined for sleekness
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
  compactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    paddingBottom: 20, // Extra space at bottom of SCROLL list
  },
  bestsellerHorizContent: {
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    gap: 8,
    paddingBottom: 0,
  },
  bestsellerColumn: {
    gap: 8,
  },
  compactCardHoriz: {
    width: (windowWidth - (spacing.md * 2 + 6)) / 2,
  },
  compactCard: {
    width: (windowWidth - (spacing.md * 2 + 6)) / 2,
    backgroundColor: colors.white,
    borderRadius: 16,
    height: 80,
    ...shadow.soft,
    borderWidth: 1,
    borderColor: colors.gray[100],
    flexDirection: 'row',
    alignItems: 'stretch',
    position: 'relative',
    overflow: 'hidden',
    paddingRight: 0,
  },
  compactImageContainer: {
    width: 70,
    backgroundColor: colors.gray[50],
    position: 'relative',
  },
  compactSaveBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: colors.accent[500],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  compactSaveText: {
    color: colors.white,
    fontSize: 8,
    fontFamily: typography.fontFamily.bold,
  },
  compactImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  compactContent: {
    flex: 1,
    paddingLeft: 8,
    paddingRight: 4,
    paddingVertical: 2,
    justifyContent: 'flex-start',
    gap: 0,
  },
  compactTitle: {
    fontSize: 10.5,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
    lineHeight: 13,
  },
  compactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactMetaText: {
    fontSize: 9,
    color: colors.gray[500],
    fontFamily: typography.fontFamily.medium,
  },
  compactTiersContainer: {
    flexDirection: 'column',
    gap: 4,
    marginVertical: 6,
    padding: 4,
    backgroundColor: colors.gray[50],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  compactTierPill: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  compactTierText: {
    fontSize: 9,
    color: colors.gray[600],
    fontFamily: typography.fontFamily.medium,
  },
  compactPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 0,
  },
  compactPriceStack: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  compactPrice: {
    fontSize: 13,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary[600],
  },
  compactMrp: {
    fontSize: 10,
    color: colors.gray[400],
    textDecorationLine: 'line-through',
  },
  compactSavingsBadge: {
    backgroundColor: colors.accent[100],
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  compactSavingsText: {
    fontSize: typography.fontSize.xxxs,
    fontFamily: typography.fontFamily.bold,
    color: colors.accent[700],
  },
  miniAddBtn: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
  },
  // Trending Hits Styles
  hitsSection: {
    paddingVertical: 0,
    backgroundColor: colors.background.primary,
  },
  brandsBreaker: {
    paddingTop: 0,
    paddingBottom: 0,
    marginVertical: 0,
  },
  brandBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[500], // Primary ring
    justifyContent: 'center',
    alignItems: 'center',
    ...shadow.soft,
  },
  brandBadgeInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  brandLogoOverlay: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.15)', // Very subtle dark tint to ground the logo without dulling the image
    justifyContent: 'center',
    alignItems: 'center',
  },
  hitsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 6,
    marginBottom: 6, // Reduced from 10
  },
  hitsTitle: {
    ...textStyles.h3, // Using h3 for sleeker look
    color: colors.gray[800],
    letterSpacing: -0.5,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  bitumen: { // Fixing the bitumen regression here too if it exists
    backgroundColor: colors.white,
    borderLeftColor: colors.primary[500],
  },
  hitsScroll: {
    paddingHorizontal: 16, // Matched with header padding
    gap: -2,
  },
  gemContainer: {
    alignItems: 'center',
  },
  gemCircle: {
    width: 50, // Reduced from 64
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[100],
    ...shadow.soft,
  },
  gemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  // Cuisine Sourcing Styles
  cuisineScroll: {
    paddingLeft: 0,
    paddingRight: windowWidth * 0.1,
    paddingTop: 0,
    paddingBottom: 0,
  },
  cuisineCard: {
    width: windowWidth * 0.7,
    height: 180,
    borderRadius: borderRadius.xl,
    ...shadow.medium,
    backgroundColor: colors.white,
  },
  cuisineImage: {
    width: '100%',
    height: '100%',
  },
  cuisineGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.md,
    borderRadius: borderRadius.xl,
  },
  cuisineContent: {
    gap: 4,
  },
  cuisineName: {
    ...textStyles.h3,
    color: colors.white,
    fontSize: 18,
  },
  cuisineDescription: {
    ...textStyles.bodySmall,
    color: 'rgba(255,255,255,0.8)',
  },
  cuisineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cuisineBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 0.5,
  },
  // Infinite Discovery Section Styles
  discoveryScroll: {
    paddingLeft: 0,
    paddingRight: 16,
    gap: spacing.md,
    paddingBottom: 0,
  },
  viewAllCard: {
    width: 100,
    height: 160,
    backgroundColor: 'rgba(20, 184, 166, 0.05)',
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.1)',
    borderStyle: 'dashed',
    gap: 8,
    alignSelf: 'flex-start',
  },
  viewAllCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.gray[400],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary[600],
  },
  loadingSection: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  loadingSectionText: {
    marginLeft: 12,
    fontSize: 14,
    color: colors.gray[500],
    fontFamily: typography.fontFamily.body,
  },
});

export default HomeScreen;
