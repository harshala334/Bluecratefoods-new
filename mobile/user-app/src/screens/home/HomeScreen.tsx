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
  ImageBackground,
  BackHandler
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
  const { addSearchTerm, getUnifiedFrequentList, addFrequentItem } = useRecipeStore();
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




  const trendingHits = [
    {
      id: 'hit-1',
      title: 'Fresh Spinach',
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200&q=80',
      product: { id: '1', name: 'Fresh Spinach', price: 40, mrp: 50, weight: '250g', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&q=80' }
    },
    {
      id: 'hit-2',
      title: 'Carrots',
      image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=200&q=80',
      product: { id: '2', name: 'Carrots (Ooty)', price: 65, mrp: 80, weight: '500g', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&q=80' }
    },
    {
      id: 'hit-3',
      title: 'Avocado',
      image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=200&q=80',
      product: { id: '3', name: 'Avocado (Haas)', price: 280, mrp: 350, weight: '1 pc', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300&q=80' }
    },
    {
      id: 'hit-4',
      title: 'Red Onions',
      image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=200&q=80',
      product: { id: '4', name: 'Red Onions', price: 35, mrp: 45, weight: '1kg', image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=300&q=80' }
    },
    {
      id: 'hit-5',
      title: 'Eggs',
      image: 'https://images.unsplash.com/photo-1506084868730-342b1f852e0d?w=200&q=80',
      product: { id: 'eggs-1', name: 'Organic Eggs', price: 90, mrp: 110, weight: '6 pcs', image: 'https://images.unsplash.com/photo-1506084868730-342b1f852e0d?w=300&q=80' }
    },
    {
      id: 'hit-6',
      title: 'Salmon',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&q=80',
      product: { id: 'fish-1', name: 'Fresh Salmon', price: 850, mrp: 1000, weight: '250g', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&q=80' }
    },
  ];

  const categories = [
    // Row 1: Vertical/Bento (Next to Promo)
    { id: 'frozen', title: 'Ready to cook: Frozen', subtitle: 'Quick frozen delicacies', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&q=80', filter: 'frozen', row: 1 },

    // Row 2: Curated Deliveries (Auto-adjusting grid)
    { id: '5min', title: '5 Min Meals', subtitle: 'Instant satisfaction', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80', filter: '5min', row: 2 },
    { id: '10min', title: '10 Min Meals', subtitle: 'Fast & fresh', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&q=80', filter: '10min', row: 2 },
    { id: 'veg', title: 'Fresh Veggies', subtitle: 'Farm to home', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&q=80', filter: 'vegetables', row: 3 },

    // Row 3: Imported & Sourcing (Horizontal Scrollable)
    { id: 'meat', title: 'Meat & Poultry', subtitle: 'Premium cuts', image: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?w=500&q=80', filter: 'meat', row: 3 },
    { id: 'grocery', title: 'Daily Groceries', subtitle: 'Essentials', image: 'https://images.unsplash.com/photo-1506484334402-40ff22e05a6d?w=500&q=80', filter: 'groceries', row: 3 },
    { id: 'packaging', title: 'Packaging', subtitle: 'Sustainable', image: 'https://images.unsplash.com/photo-1620455212513-ade425712128?w=500&q=80', filter: 'packaging', row: 3 },
    { id: 'spices', title: 'Global Spices', subtitle: 'Authentic flavors', image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=500&q=80', filter: 'spices', row: 3 },
    { id: 'sauces', title: 'Imported Sauces', subtitle: 'Chef grade', image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&q=80', filter: 'sauces', row: 3 },
    { id: 'japanese', title: 'Japanese Pantry', subtitle: 'Miso, Ramen, Nori', image: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=500&q=80', filter: 'japanese', row: 3 },
  ];



  const bestsellers = [
    {
      id: '1',
      name: 'Fresh Chicken Curry Cut',
      image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&h=300&fit=crop',
      rating: 4.8,
      reviews: 124,
      xp: 20,
      basePrice: 249,
      mrp: 299,
      unit: '500g',
      badge: 'BESTSELLER',
      bulkTiers: [
        { quantity: '2 kg', price: 940 },
        { quantity: '5 kg', price: 2200 }
      ]
    },
    {
      id: '2',
      name: 'Atlantic Salmon Fillet',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
      rating: 4.9,
      reviews: 86,
      xp: 35,
      basePrice: 899,
      mrp: 1099,
      unit: '250g',
      badge: 'PREMIUM',
      bulkTiers: [
        { quantity: '1 kg', price: 3400 },
        { quantity: '5 kg', price: 16000 }
      ]
    },
    {
      id: '3',
      name: 'Tender Mutton Chops',
      image: 'https://images.unsplash.com/photo-1603360946369-39c9f458d7e1?w=400&h=300&fit=crop',
      rating: 4.7,
      reviews: 52,
      xp: 40,
      basePrice: 549,
      mrp: 599,
      unit: '500g',
      bulkTiers: [
        { quantity: '2 kg', price: 2000 },
        { quantity: '5 kg', price: 4800 }
      ]
    },
    {
      id: '4',
      name: 'Fresh Tiger Prawns',
      image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400&h=300&fit=crop',
      rating: 4.6,
      reviews: 42,
      xp: 30,
      basePrice: 429,
      mrp: 499,
      unit: '250g',
      badge: 'HOT DEAL',
      bulkTiers: [
        { quantity: '1 kg', price: 1600 },
        { quantity: '3 kg', price: 4500 }
      ]
    },
    {
      id: '5',
      name: 'Farm Fresh Broiler',
      image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&h=300&fit=crop',
      rating: 4.5,
      reviews: 98,
      xp: 15,
      basePrice: 199,
      mrp: 249,
      unit: '1kg',
      bulkTiers: [
        { quantity: '5 kg', price: 900 },
        { quantity: '10 kg', price: 1700 }
      ]
    },
    {
      id: '6',
      name: 'Australian Lamb Rack',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
      rating: 4.9,
      reviews: 32,
      xp: 50,
      basePrice: 1299,
      mrp: 1499,
      unit: '500g',
      badge: 'IMPORTED',
      bulkTiers: [
        { quantity: '2 kg', price: 5000 },
        { quantity: '5 kg', price: 12000 }
      ]
    },
  ];

  const CUISINES = [
    { id: 'chinese', name: 'Chinese Sourcing', description: 'Oyster sauce, Noodles, Soy...', image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=600&q=80' },
    { id: 'italian', name: 'Italian Pantry', description: 'Pasta, Olive Oil, Herbs...', image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=600&q=80' },
    { id: 'indian', name: 'Indian Spices', description: 'Basmati, Pulses, Masalas...', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80' },
    { id: 'mexican', name: 'Mexican Cantina', description: 'Tortillas, Jalapenos, Beans...', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80' },
  ];

  const CATEGORY_PRODUCTS: Record<string, any[]> = {
    frozen: [
      { id: 'f-1', name: 'Veggie Pizza', price: 299, mrp: 399, unit: '450g', rating: 4.8, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80', bulkTiers: [{ quantity: '5 pcs', price: 1350 }, { quantity: '10 pcs', price: 2500 }] },
      { id: 'f-2', name: 'Chicken Nuggets', price: 199, mrp: 249, unit: '250g', rating: 4.5, image: 'https://images.unsplash.com/photo-1562967914-6c82c6ca0d27?w=400&q=80', bulkTiers: [{ quantity: '1 kg', price: 750 }, { quantity: '2 kg', price: 1400 }] },
    ],
    meat: [
      { id: 'm-1', name: 'Ribeye Steak', price: 1499, mrp: 1699, unit: '500g', rating: 4.9, image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80', bulkTiers: [{ quantity: '2 kg', price: 5600 }, { quantity: '5 kg', price: 13500 }] },
      { id: 'm-2', name: 'Duck Breast', price: 899, mrp: 999, unit: '300g', rating: 4.7, image: 'https://images.unsplash.com/photo-1516100882582-76c9a4440592?w=400&q=80', bulkTiers: [{ quantity: '1 kg', price: 2800 }, { quantity: '2 kg', price: 5400 }] },
    ],
    veg: [
      { id: 'v-1', name: 'Cherry Tomatoes', price: 80, mrp: 100, unit: '250g', rating: 4.6, image: 'https://images.unsplash.com/photo-1518977676601-b53f02ac6d31?w=400&q=80', bulkTiers: [{ quantity: '1 kg', price: 300 }, { quantity: '5 kg', price: 1400 }] },
      { id: 'v-2', name: 'Asparagus', price: 150, mrp: 180, unit: 'bundle', rating: 4.4, image: 'https://images.unsplash.com/photo-1515471204579-2baeba324d27?w=400&q=80', bulkTiers: [{ quantity: '10 bun', price: 1350 }] },
    ],
    japanese: [
      { id: 'j-1', name: 'Miso Paste', price: 350, mrp: 450, unit: '400g', rating: 4.9, image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400&q=80', bulkTiers: [{ quantity: '1 kg', price: 800 }, { quantity: '5 kg', price: 3800 }] },
      { id: 'j-2', name: 'Ramen Noodles', price: 120, mrp: 150, unit: '200g', rating: 4.7, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80', bulkTiers: [{ quantity: '1 kg', price: 550 }, { quantity: '5 kg', price: 2500 }] },
    ],
    spices: [
      { id: 's-1', name: 'Saffron Threads', price: 499, mrp: 599, unit: '1g', rating: 5.0, image: 'https://images.unsplash.com/photo-1601004890684-d8cbf3439a39?w=400&q=80', bulkTiers: [{ quantity: '10g', price: 4500 }] },
      { id: 's-2', name: 'Smoked Paprika', price: 210, mrp: 260, unit: '50g', rating: 4.8, image: 'https://images.unsplash.com/photo-1615485500704-a1a9d2590341?w=400&q=80', bulkTiers: [{ quantity: '500g', price: 1800 }] },
    ]
  };

  const CompactProductCard = ({ recipe: product, onPress, style }: any) => {
    const { addItem } = useCartStore();
    const { addFrequentItem } = useRecipeStore();

    return (
      <TouchableOpacity style={[styles.compactCard, style]} onPress={onPress} activeOpacity={0.9}>
        <View style={styles.compactImageContainer}>
          <Image source={{ uri: product.image }} style={styles.compactImage} />
        </View>
        <View style={styles.compactContent}>
          <Text style={styles.compactTitle} numberOfLines={1}>{product.name}</Text>
          <View style={styles.compactMeta}>
            <Ionicons name="star" size={10} color={colors.yellow[500]} />
            <Text style={styles.compactMetaText}>{product.rating || 4.5}</Text>
            <Text style={styles.compactMetaText}>•</Text>
            <Text style={styles.compactMetaText}>{product.unit || 'per unit'}</Text>
          </View>

          <View style={styles.compactPriceRow}>
            <View style={styles.compactPriceStack}>
              <Text style={styles.compactPrice}>₹{product.basePrice || product.price}</Text>
              {product.mrp && product.mrp > (product.basePrice || product.price) && (
                <Text style={styles.compactMrp}>₹{product.mrp}</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.miniAddBtn}
              onPress={(e) => {
                e.stopPropagation();
                const ingredient = {
                  id: product.id,
                  name: product.name,
                  price: product.basePrice || product.price,
                  unit: product.unit || product.weight,
                  image: product.image,
                  category: product.category || 'general'
                };
                addItem(ingredient as any, 1);
                addFrequentItem(product);
              }}
            >
              <Feather name="plus" size={14} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
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
        {/* Active Search Results Section */}
        {searchResults.length > 0 && (
          <View style={{ marginTop: spacing.xs, marginBottom: spacing.xs }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4, marginBottom: 2 }}>
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
              contentContainerStyle={{ paddingBottom: 4, paddingHorizontal: 4, alignItems: 'flex-start' }}
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


      </View>

      {/* Recommended for You Section - Unified */}
      <View style={styles.hitsSection}>
        <View style={styles.hitsHeader}>
          <Text style={styles.hitsTitle}>Recommended for You</Text>
          <Ionicons name="sparkles" size={14} color={colors.primary[500]} />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hitsScroll}
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
            ['Frozen', 'Vegetables', 'Meat', 'Dairy'].map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.gemContainer}
                onPress={() => { }}
              >
                <View style={[styles.gemCircle, { backgroundColor: colors.gray[50] }]}>
                  <Feather name="search" size={24} color={colors.gray[300]} />
                </View>
                <Text numberOfLines={1} style={{ fontSize: 11, color: colors.gray[400], marginTop: 6, width: 70, textAlign: 'center' }}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

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
                <ImageBackground source={{ uri: cat.image }} style={styles.bentoImageFull}>
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
                <ImageBackground source={{ uri: cat.image }} style={styles.bentoImageFull}>
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

          {/* Row 3: Imported Sourcing (Horizontal Scrollable) */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bentoScrollRow}
          >
            {categories.filter(c => c.row === 3).map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.bentoScrollItem}
                onPress={() => handleCategoryPress(cat.filter)}
              >
                <ImageBackground source={{ uri: cat.image }} style={styles.bentoImageFull}>
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.bentoGradient}
                  >
                    <Text style={styles.bentoLabelFloating}>{cat.title.split(':').pop()?.trim()}</Text>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Cuisine Sourcing Hub */}
      <View style={[styles.section, { paddingBottom: spacing.sm }]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Cuisine Sourcing Hub</Text>
          <MaterialCommunityIcons name="earth" size={18} color={colors.primary[500]} />
        </View>
        <Text style={styles.sectionSubtitle}>Professional essentials curated for your kitchen</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={windowWidth * 0.7 + spacing.md}
          decelerationRate="fast"
          contentContainerStyle={styles.cuisineScroll}
        >
          {CUISINES.map((cuisine) => (
            <TouchableOpacity
              key={cuisine.id}
              style={styles.cuisineCard}
              onPress={() => handleCategoryPress(cuisine.id)}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={{ uri: cuisine.image }}
                style={styles.cuisineImage}
                imageStyle={{ borderRadius: borderRadius.xl }}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.85)']}
                  style={styles.cuisineGradient}
                >
                  <View style={styles.cuisineContent}>
                    <Text style={styles.cuisineName}>{cuisine.name}</Text>
                    <Text style={styles.cuisineDescription} numberOfLines={1}>
                      {cuisine.description}
                    </Text>
                    <View style={styles.cuisineBadge}>
                      <Text style={styles.cuisineBadgeText}>SOURCING LIST</Text>
                      <Feather name="arrow-right" size={12} color={colors.white} />
                    </View>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Best Selling Products</Text>
          <Feather name="trending-up" size={16} color={colors.primary[500]} />
        </View>
        <View style={styles.bestsellerScrollContainer}>
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.compactGrid}
          >
            {bestsellers.map((product) => (
              <CompactProductCard
                key={product.id}
                recipe={product}
                onPress={() => navigation.navigate('ProductsTab', {
                  screen: 'ProductDetail',
                  params: { product }
                })}
              />
            ))}
          </ScrollView>
        </View>
      </View >

      {/* Infinite Category Flow */}
      {categories.map((category) => {
        const products = CATEGORY_PRODUCTS[category.id] || CATEGORY_PRODUCTS['frozen'];
        return (
          <View key={category.id} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{category.title.split(':').pop()?.trim()}</Text>
              <MaterialCommunityIcons name="lightning-bolt" size={16} color={colors.primary[500]} />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.discoveryScroll}
            >
              {products.map((product) => (
                <VerticalProductCard
                  key={product.id}
                  width={windowWidth * 0.42}
                  product={product}
                  onPress={() => navigation.navigate('ProductsTab', {
                    screen: 'ProductDetail',
                    params: { product }
                  })}
                />
              ))}
              {/* "View All" Card */}
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
        );
      })}

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
    backgroundColor: colors.background.primary,
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm, // Reduced from md(16) to sm(8) for even denser layout
    alignItems: 'flex-start',
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
    paddingHorizontal: BENTO_PADDING,
    paddingVertical: BENTO_GAP,
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
    marginTop: 2, // Slight separation
  },
  bentoScrollItem: {
    width: BENTO_UNIT * 1.8, // Slightly wider for scrollable look
    height: BENTO_UNIT,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.gray[100],
    ...shadow.soft,
  },
  bentoImageFull: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    justifyContent: 'flex-end', // Align content to bottom
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
    fontSize: 12,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    padding: 8, // Add padding for the text inside the gradient
  },
  bentoGradient: {
    flex: 1,
    justifyContent: 'flex-end',
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
  bestsellerScrollContainer: {
    height: 480, // Approximate height for 2x2 rows
    width: '100%',
    marginTop: 8,
  },
  compactCard: {
    width: (windowWidth - 32 - 12) / 2,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 8,
    ...shadow.soft,
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  compactImageContainer: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    backgroundColor: colors.gray[50],
    overflow: 'hidden',
    marginBottom: 8,
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
    gap: 4,
  },
  compactTitle: {
    ...textStyles.bodyLarge,
    fontWeight: '700',
    color: colors.text.primary,
  },
  compactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactMetaText: {
    fontSize: 10,
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
    marginTop: 4,
  },
  compactPriceStack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactPrice: {
    fontSize: 14,
    fontWeight: '800',
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
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Trending Hits Styles
  hitsSection: {
    paddingVertical: 4, // Reduced from 12
    backgroundColor: colors.background.primary,
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
    paddingHorizontal: 12,
    gap: 16,
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
    paddingRight: windowWidth * 0.1, // Extra space at end
    gap: spacing.md,
    paddingTop: spacing.sm,
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
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  viewAllCard: {
    width: 100,
    height: 160, // Match VerticalProductCard approximate height
    backgroundColor: 'rgba(20, 184, 166, 0.05)', // Primary alpha
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
    ...shadow.soft,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary[600],
  },
});

export default HomeScreen;
