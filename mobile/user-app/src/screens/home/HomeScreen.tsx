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
import { API_CONFIG, CDN_URL } from '../../constants/config';
import { colors } from '../../constants/colors';
import { typography, textStyles } from '../../constants/typography';
import { spacing, borderRadius, shadow } from '../../constants/spacing';
import { Feather, Ionicons } from '@expo/vector-icons';
import { chatService, Message } from '../../services/chatService';
import { recipeService } from '../../services/recipeService';
import { Recipe } from '../../types/recipe';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchingText, setSearchingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // ... (previous state definitions remain the same)

  const placeholderTexts = [
    "Search 'Fresh organic milk'",
    "Try 'Frozen snacks'",
    "Search 'Ready to eat meals'",
    "Try 'Sustainable packaging'"
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
    });
    return unsubscribe;
  }, []);

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
        handleSearchCancel();
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
    { id: 'frozen', title: 'Ready to cook: Frozen', subtitle: 'Quick frozen delicacies', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&q=80', filter: 'frozen' },
    { id: '5min', title: 'Ready-to-cook: <5 mins', subtitle: 'Instant satisfaction', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80', filter: '5min' },
    { id: '10min', title: 'Ready-to-cook: <10 mins', subtitle: 'Fast & fresh meals', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&q=80', filter: '10min' },
    { id: 'veg', title: 'Vegetables', subtitle: 'Farm to your doorstep', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&q=80', filter: 'vegetables' },
    { id: 'meat', title: 'Meat', subtitle: 'Premium cuts & poultry', image: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?w=500&q=80', filter: 'meat' },
    { id: 'grocery', title: 'Groceries', subtitle: 'Daily kitchen essentials', image: 'https://images.unsplash.com/photo-1506484334402-40ff22e05a6d?w=500&q=80', filter: 'groceries' },
    { id: 'packaging', title: 'Packaging', subtitle: 'Safe & sustainable', image: 'https://images.unsplash.com/photo-1620455212513-ade425712128?w=500&q=80', filter: 'packaging' },
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
    },
  ];

  const CompactProductCard = ({ recipe: product, onPress, style }: any) => {
    const savings = product.mrp ? Math.round(((product.mrp - product.basePrice) / product.mrp) * 100) : 0;

    return (
      <TouchableOpacity style={[styles.compactCard, style]} onPress={onPress}>
        <Image source={{ uri: product.image }} style={styles.compactImage} />
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
              <Text style={styles.compactPrice}>₹{product.basePrice}</Text>
              {product.mrp && product.mrp > product.basePrice && (
                <Text style={styles.compactMrp}>₹{product.mrp}</Text>
              )}
            </View>
            {savings > 0 && (
              <View style={styles.compactSavingsBadge}>
                <Text style={styles.compactSavingsText}>{savings}% OFF</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const VerticalProductCard = ({ product, onPress, width }: any) => {
    const savings = product.mrp ? Math.round(((product.mrp - product.basePrice) / product.mrp) * 100) : 0;

    const cartItem = items.find(i => i.ingredient.id === product.id);
    const quantity = cartItem?.quantity || 0;

    const handleAdd = (e: any) => {
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
    };

    const handleIncrement = (e: any) => {
      e.stopPropagation();
      updateQuantityByIngredientId(product.id, quantity + 1);
    };

    const handleDecrement = (e: any) => {
      e.stopPropagation();
      updateQuantityByIngredientId(product.id, quantity - 1);
    };

    const handleAddBulk = (e: any, bulkQuantity: string) => {
      e.stopPropagation();
      const qty = parseInt(bulkQuantity) || 1;
      const cartItem = items.find(i => i.ingredient.id === product.id);

      if (!cartItem) {
        const ingredient = {
          id: product.id,
          name: product.name,
          price: product.basePrice || product.price,
          unit: product.unit || product.weight,
          image: product.image,
          category: product.category || 'general'
        };
        addItem(ingredient as any, qty);
        addFrequentItem(product);
      } else {
        updateQuantityByIngredientId(product.id, qty);
      }
    };

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={{
          width: width,
          backgroundColor: colors.white,
          borderRadius: 12,
          overflow: 'hidden',
          ...shadow.soft,
          borderWidth: 1,
          borderColor: colors.gray[100],
          marginBottom: 12,
        }}
      >
        {/* Product Image Area */}
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: product.image }}
            style={{ width: '100%', height: 90, backgroundColor: colors.gray[100] }} // Reduced from 100
            resizeMode="cover"
          />
          {product.badge && (
            <View style={{
              position: 'absolute',
              top: 8,
              left: 0,
              backgroundColor: colors.primary[600],
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderTopRightRadius: 4,
              borderBottomRightRadius: 4,
            }}>
              <Text style={{ fontSize: 8, fontFamily: typography.fontFamily.bold, color: colors.white }}>
                {product.badge}
              </Text>
            </View>
          )}
          {savings > 0 && (
            <View style={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              backgroundColor: colors.accent[500],
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4,
            }}>
              <Text style={{ fontSize: 9, fontFamily: typography.fontFamily.bold, color: colors.white }}>
                {savings}% OFF
              </Text>
            </View>
          )}
        </View>

        {/* Content Area */}
        <View style={{ padding: 4 }}>
          <Text style={{
            fontSize: 11, // Reduced from 12
            fontFamily: typography.fontFamily.semibold,
            color: colors.gray[800],
            marginBottom: 1,
            height: 26, // Reduced from 28
          }} numberOfLines={2}>
            {product.name}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 1 }}>
            <Text style={{ fontSize: 9, color: colors.gray[500], fontFamily: typography.fontFamily.medium }}>
              {product.unit || 'per unit'}
            </Text>
          </View>

          {product.bulkTiers && (
            <View style={{
              flexDirection: 'column',
              gap: 2, // Reduced from 4
              marginBottom: 4, // Reduced from 8
              backgroundColor: colors.gray[50],
              padding: 2, // Reduced from 4
              borderRadius: 4, // Reduced from 6
            }}>
              {product.bulkTiers.map((tier: any, idx: number) => {
                const qtyNum = parseInt(tier.quantity) || 1;
                const unitPrice = Math.round(tier.price / qtyNum);
                return (
                  <View key={idx} style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 1,
                  }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 9, fontFamily: typography.fontFamily.bold, color: colors.gray[600] }}>
                        {tier.quantity}: <Text style={{ color: colors.primary[600] }}>₹{tier.price}</Text>
                      </Text>
                      <Text style={{ fontSize: 7, color: colors.gray[400], fontFamily: typography.fontFamily.medium }}>
                        ₹{unitPrice} / unit
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{
                        backgroundColor: colors.white,
                        borderWidth: 1,
                        borderColor: colors.primary[200],
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 4,
                      }}
                      onPress={(e) => handleAddBulk(e, tier.quantity)}
                    >
                      <Text style={{ fontSize: 8, fontFamily: typography.fontFamily.bold, color: colors.primary[600] }}>ADD</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 0 }}>
                <Text style={{ fontSize: 14, fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
                  ₹{product.basePrice}
                </Text>
                {product.mrp && product.mrp > product.basePrice && (
                  <Text style={{ fontSize: 9, color: colors.gray[400], textDecorationLine: 'line-through' }}>
                    ₹{product.mrp}
                  </Text>
                )}
              </View>
            </View>

            {quantity > 0 ? (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.primary[50],
                borderRadius: 6,
                borderWidth: 1,
                borderColor: colors.primary[100],
                ...shadow.soft,
              }}>
                <TouchableOpacity
                  onPress={handleDecrement}
                  style={{ padding: 4, paddingHorizontal: 4 }}
                >
                  <Feather name="minus" size={14} color={colors.primary[600]} />
                </TouchableOpacity>
                <Text style={{
                  fontSize: 12,
                  fontFamily: typography.fontFamily.bold,
                  color: colors.primary[700],
                  minWidth: 16,
                  textAlign: 'center',
                }}>
                  {quantity}
                </Text>
                <TouchableOpacity
                  onPress={handleIncrement}
                  style={{ padding: 4, paddingHorizontal: 4 }}
                >
                  <Feather name="plus" size={14} color={colors.primary[600]} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: colors.white,
                  borderWidth: 1,
                  borderColor: colors.primary[500],
                  paddingHorizontal: 8, // Reduced from 12
                  paddingVertical: 3, // Reduced from 5
                  borderRadius: 6,
                  ...shadow.soft,
                }}
                onPress={handleAdd}
              >
                <Text style={{ fontSize: 11, fontFamily: typography.fontFamily.bold, color: colors.primary[600] }}>
                  ADD
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleChatSubmit = async (text?: string) => {
    const userText = text || searchQuery;
    if (!userText.trim()) return;

    setSearchQuery('');
    setIsSearching(true);
    setSearchingText(userText);
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
    addSearchTerm(userText);

    generateMascotResponse(userText);
  };

  const generateMascotResponse = async (query: string) => {
    setIsTyping(true);

    try {
      // Fetch results for the dedicated results section
      try {
        const results = await recipeService.searchRecipes(query);
        setSearchResults(results);
        setIsSearching(false); // Clear feedback as soon as results are here
      } catch (error) {
        console.warn("HomeScreen: Failed to fetch search results for section", error);
        setIsSearching(false);
      }

      // Use the centralized chat logic from ChatService
      await chatService.generateBotResponse(query);
    } finally {
      setIsTyping(false);
      setIsSearching(false); // Safety fallback
    }
  };

  const handleBrowseProducts = () => {
    setIsSearchFocused(false);
    navigation.navigate('ProductsTab');
  };



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

  const handleSearchPress = (query: string) => {
    setIsSearchFocused(false);
    setSearchQuery('');
    Keyboard.dismiss();

    // Use handleChatSubmit to visually show the search in chat
    handleChatSubmit(query);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchCancel = () => {
    setIsSearchFocused(false);
    setSearchQuery('');
    Keyboard.dismiss();
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
      <View style={[styles.hero, { backgroundColor: colors.primary[50] }]}>
        {/* Search Bar */}
        {/* ... */}
        <View style={styles.mascotRow}>
          {/* TODO: [CLOUDINARY] Upload 'cat-cheff.png' to Cloudinary and usage remote URL.
              Example: source={{ uri: 'https://res.cloudinary.com/.../cat-cheff.png' }}
              This reduces bundle size. */}
          <Image
            source={require('../../../assets/images/kitty_with_cart_cropped.png')}
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
                      maxWidth: '92%',
                      ...shadow.soft,
                    }}
                  >
                    <Text style={{
                      fontSize: typography.fontSize.xs,
                      color: item.sender === 'user' ? colors.white : colors.text.primary,
                      fontFamily: typography.fontFamily.medium,
                      marginBottom: item.products && item.products.length > 0 ? 8 : 0,
                    }}>
                      {item.text}
                    </Text>

                    {item.products && item.products.length > 0 && (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        nestedScrollEnabled={true}
                        style={{ marginTop: 4 }}
                      >
                        {item.products.map((product: any) => (
                          <View key={product.id} style={{ marginRight: 10 }}>
                            <VerticalProductCard
                              product={product}
                              width={140}
                              onPress={() => navigation.navigate('ProductsTab', {
                                screen: 'ProductDetail',
                                params: { product }
                              })}
                            />
                          </View>
                        ))}
                      </ScrollView>
                    )}
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
        <View style={{ zIndex: 100, position: 'relative' }}>
          <View style={styles.newSearchContainer}>
            <TouchableOpacity onPress={() => handleChatSubmit()} style={{ marginRight: 10 }}>
              <Feather name="search" size={20} color={colors.primary[500]} />
            </TouchableOpacity>
            {isSearching ? (
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 13, color: colors.gray[500], fontStyle: 'italic' }}>
                  Searching for "{searchingText}"...
                </Text>
              </View>
            ) : (
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
            )}
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

          {/* Search Mode Tags Row - RELATIVE positioning for robust scroll */}
          {isSearchFocused && (
            <View style={{ width: '100%', height: 44, marginBottom: spacing.xs, borderBottomWidth: 1, borderBottomColor: colors.gray[100], paddingBottom: spacing.xs }}>
              <FlatList
                data={quickOptions}
                horizontal
                showsHorizontalScrollIndicator={true}
                nestedScrollEnabled={true}
                keyExtractor={(item) => item}
                keyboardShouldPersistTaps="always"
                style={{ width: '100%', height: '100%' }}
                contentContainerStyle={{
                  paddingHorizontal: spacing.md,
                  alignItems: 'center',
                }}
                renderItem={({ item: tag }) => (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: colors.gray[50],
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 100,
                      borderWidth: 1,
                      borderColor: colors.gray[200],
                      marginRight: 8,
                    }}
                    onPress={() => handleSearchPress(tag)}
                  >
                    <Feather name="search" size={12} color={colors.gray[400]} style={{ marginRight: 6 }} />
                    <Text style={{ fontSize: 13, color: colors.gray[700], fontFamily: typography.fontFamily.medium }}>{tag}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* Search Mode Overlay Content - Absolute but below the relative tags row */}
          {isSearchFocused && searchQuery.length > 0 && (
            <View style={[styles.searchOverlay, { top: 94 }]}>
              <View style={[styles.resultsList, { paddingHorizontal: spacing.md }]}>
                <TouchableOpacity
                  style={styles.suggestionItem}
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
                    width={(windowWidth - 48) / 3}
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
                onPress={() => item.type === 'search'
                  ? handleSearchPress(item.title)
                  : navigation.navigate('ProductsTab', {
                    screen: 'ProductDetail',
                    params: { product: item.product }
                  })
                }
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
                onPress={() => handleSearchPress(item)}
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
          {/* Row 1 & 2: Carousel (3/4) + Frozen (1/4) */}
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

            <TouchableOpacity
              style={styles.bentoVertical}
              onPress={() => handleCategoryPress('frozen')}
            >
              <Image source={{ uri: categories[0].image }} style={styles.bentoImageFull} />
              <View style={styles.bentoScrim} />
              <Text style={styles.bentoLabelFloating}>Frozen</Text>
            </TouchableOpacity>
          </View>

          {/* Row 3: <5min (1/2) + <10min (1/2) */}
          <View style={styles.bentoRow}>
            <TouchableOpacity
              style={styles.bentoHalf}
              onPress={() => handleCategoryPress('5min')}
            >
              <Image source={{ uri: categories[1].image }} style={styles.bentoImageFull} />
              <View style={styles.bentoScrim} />
              <Text style={styles.bentoLabelFloating}>&lt;5 mins</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bentoHalf}
              onPress={() => handleCategoryPress('10min')}
            >
              <Image source={{ uri: categories[2].image }} style={styles.bentoImageFull} />
              <View style={styles.bentoScrim} />
              <Text style={styles.bentoLabelFloating}>&lt;10 mins</Text>
            </TouchableOpacity>
          </View>

          {/* Row 4: Veg, Meat, Grocery, Packaging (1/4 each) */}
          <View style={styles.bentoRow}>
            {categories.slice(3).map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.bentoQuarter}
                onPress={() => handleCategoryPress(cat.filter)}
              >
                <Image source={{ uri: cat.image }} style={styles.bentoImageFull} />
                <View style={styles.bentoScrim} />
                <Text style={styles.bentoLabelFloating} numberOfLines={1}>
                  {cat.title.split(':').pop()?.trim()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Bestsellers Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Best Selling Products</Text>
        <View style={styles.compactGrid}>
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
        </View>
      </View >

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
    paddingHorizontal: spacing.md, // 16px
    paddingTop: 0, // Removed padding to move the whole mascot row up
    paddingBottom: 2, // Tighter padding
    marginTop: -8, // Pull tight against top bar
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
  sectionTitle: {
    ...textStyles.h2,
    color: colors.text.primary,
    textAlign: 'left',
    alignSelf: 'flex-start',
    width: '100%',
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
    // Note: bentoGrid's gap handles vertical spacing now
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
  },
  bentoImageFull: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
    position: 'absolute',
    bottom: 8,
    left: 8,
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
  },
  compactCard: {
    width: '48%',
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    ...shadow.soft,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[50],
    overflow: 'hidden', // Ensure image doesn't bleed out of rounded corners
  },
  compactImage: {
    width: 65, // Increased slightly for full coverage
    height: '100%', // Match card height
    aspectRatio: 1,
    backgroundColor: colors.gray[100],
  },
  compactContent: {
    flex: 1,
    marginLeft: 8,
  },
  compactTitle: {
    fontSize: typography.fontSize.xsMedium,
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
    fontSize: typography.fontSize.xxs,
    color: colors.gray[500],
    fontFamily: typography.fontFamily.medium,
  },
  compactPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  compactPriceStack: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  compactPrice: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
  },
  compactMrp: {
    fontSize: typography.fontSize.xxs,
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
  // Trending Hits Styles
  hitsSection: {
    paddingVertical: 4, // Reduced from 12
    backgroundColor: colors.white,
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
});

export default HomeScreen;
