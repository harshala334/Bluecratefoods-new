import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    Keyboard,
    FlatList,
    Dimensions,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, shadow } from '../../constants/spacing';
import { chatService, Message } from '../../services/chatService';
import { recipeService } from '../../services/recipeService';
import useRecipeStore from '../../stores/recipeStore';
import { VerticalProductCard } from '../product/VerticalProductCard';

interface KittyChatSearchBarProps {
    navigation: any;
    onSearchResults?: (results: any[]) => void;
}

export const KittyChatSearchBar = ({ navigation, onSearchResults }: KittyChatSearchBarProps) => {
    const { addSearchTerm } = useRecipeStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchingText, setSearchingText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const chatListRef = useRef<ScrollView>(null);

    const placeholderTexts = [
        "Search 'Fresh organic milk'",
        "Try 'Frozen snacks'",
        "Search 'Ready to eat meals'",
        "Try 'Sustainable packaging'"
    ];
    const [dynamicPlaceholder, setDynamicPlaceholder] = useState(placeholderTexts[0]);

    const quickOptions = ['Meal Kits', 'Fresh Veggies', 'Premium Meat', 'Ready to Cook', 'Healthy Recipes', 'Best Sellers', 'New Arrivals'];

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        let currentTextIndex = 0;
        let charIndex = placeholderTexts[0].length;
        let isDeleting = false;

        const runTypingEffect = () => {
            const currentFullText = placeholderTexts[currentTextIndex];
            const prefix = "Try '";

            if (isDeleting) {
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

    const handleChatSubmit = async (text?: string) => {
        const userText = text || searchQuery;
        if (!userText.trim()) return;

        setSearchQuery('');
        setIsSearching(true);
        setSearchingText(userText);
        Keyboard.dismiss();
        setIsSearchFocused(false);

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
            try {
                const results = await recipeService.searchRecipes(query);
                if (onSearchResults) {
                    onSearchResults(results);
                }
                setIsSearching(false);
            } catch (error) {
                console.warn("KittyChatSearchBar: Failed to fetch search results", error);
                setIsSearching(false);
            }
            await chatService.generateBotResponse(query);
        } finally {
            setIsTyping(false);
            setIsSearching(false);
        }
    };

    const handleSearchFocus = () => {
        setIsSearchFocused(true);
    };

    const handleSearchCancel = () => {
        setIsSearchFocused(false);
        setSearchQuery('');
        Keyboard.dismiss();
    };

    const handleSearchPress = (query: string) => {
        setIsSearchFocused(false);
        setSearchQuery('');
        Keyboard.dismiss();
        handleChatSubmit(query);
    };

    return (
        <View style={styles.container}>
            <View style={styles.mascotRow}>
                <Image
                    source={require('../../../assets/images/kitty_with_cart_cropped.png')}
                    style={styles.catImage}
                    resizeMode="contain"
                />
                <View style={styles.speechBubble}>
                    <TouchableOpacity
                        style={styles.maximizeIcon}
                        onPress={() => navigation.navigate('Chat')}
                    >
                        <Feather name="maximize-2" size={14} color={colors.primary[500]} />
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
                                    style={[
                                        styles.messageBubble,
                                        {
                                            alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start',
                                            backgroundColor: item.sender === 'user' ? colors.primary[500] : colors.white,
                                            borderBottomRightRadius: item.sender === 'user' ? 2 : 12,
                                            borderBottomLeftRadius: item.sender === 'bot' ? 2 : 12,
                                        }
                                    ]}
                                >
                                    <Text style={[
                                        styles.messageText,
                                        { color: item.sender === 'user' ? colors.white : colors.text.primary }
                                    ]}>
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
                                                        width={Dimensions.get('window').width * 0.42}
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
                            {isTyping && (
                                <View style={[styles.messageBubble, { alignSelf: 'flex-start', backgroundColor: colors.white, borderBottomLeftRadius: 2 }]}>
                                    <Text style={[styles.messageText, { color: colors.text.primary, fontStyle: 'italic' }]}>typing...</Text>
                                </View>
                            )}
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
                            onChangeText={setSearchQuery}
                            onSubmitEditing={() => handleChatSubmit()}
                            onFocus={handleSearchFocus}
                        />
                    )}
                    {isSearchFocused ? (
                        <TouchableOpacity onPress={handleSearchCancel}>
                            <Feather name="x" size={20} color={colors.gray[400]} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => { }}>
                            <Feather name="mic" size={20} color={colors.gray[400]} />
                        </TouchableOpacity>
                    )}
                </View>

                {isSearchFocused && (
                    <View style={styles.tagsRow}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="always"
                            contentContainerStyle={styles.tagsContainer}
                        >
                            {quickOptions.map((tag) => (
                                <TouchableOpacity
                                    key={tag}
                                    style={styles.tag}
                                    onPress={() => handleSearchPress(tag)}
                                >
                                    <Feather name="search" size={14} color={colors.primary[500]} style={{ marginRight: 6 }} />
                                    <Text style={styles.tagText}>{tag}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {isSearchFocused && searchQuery.length > 0 && (
                    <View style={styles.searchOverlay}>
                        <TouchableOpacity
                            style={styles.suggestionItem}
                            onPress={() => handleSearchPress(searchQuery)}
                        >
                            <Feather name="list" size={16} color={colors.primary[500]} style={{ marginRight: 10 }} />
                            <Text style={styles.suggestionText}>
                                See all results for "{searchQuery}"
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    mascotRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: -2,
    },
    catImage: {
        width: 110,
        height: 110,
        marginRight: 2,
        transform: [{ translateY: 22 }, { translateX: 8 }],
        zIndex: 1000,
    },
    speechBubble: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        borderBottomLeftRadius: 4,
        padding: 12,
        ...shadow.medium,
        minHeight: 100,
        marginBottom: 6,
    },
    maximizeIcon: {
        position: 'absolute',
        top: -10,
        right: -10,
        zIndex: 20,
        backgroundColor: colors.white,
        padding: 6,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: colors.gray[100],
        ...shadow.soft,
    },
    messageBubble: {
        marginBottom: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        maxWidth: '92%',
        ...shadow.soft,
    },
    messageText: {
        fontSize: 12,
        fontFamily: typography.fontFamily.medium,
    },
    newSearchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: 16,
        height: 50,
        borderRadius: 25,
        ...shadow.medium,
        borderWidth: 1,
        borderColor: colors.primary[100],
        marginBottom: 4,
        zIndex: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        fontFamily: typography.fontFamily.medium,
        color: colors.text.primary,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.gray[50],
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: colors.gray[200],
        marginRight: 8,
    },
    tagText: {
        fontSize: 12,
        fontFamily: typography.fontFamily.medium,
        color: colors.gray[600],
    },
    tagsRow: {
        width: '100%',
        marginBottom: 0,
        borderBottomWidth: 0,
        paddingBottom: 0,
    },
    tagsContainer: {
        alignItems: 'center',
    },
    searchOverlay: {
        marginTop: 2,
        backgroundColor: colors.white,
        borderRadius: 12,
        ...shadow.medium,
        zIndex: 2000,
        paddingVertical: spacing.xs,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    suggestionText: {
        fontSize: 14,
        color: colors.primary[500],
        fontFamily: typography.fontFamily.semibold,
    },
});
