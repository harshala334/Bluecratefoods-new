import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Image,
    ScrollView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius, shadow } from '../../constants/spacing';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { recipeService } from '../../services/recipeService';
import { chatService, Message } from '../../services/chatService';
import { Recipe } from '../../types/recipe';

export const ChatScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { initialQuery } = route.params || {};
    const insets = useSafeAreaInsets();

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [suggestions, setSuggestions] = useState<Recipe[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const unsubscribe = chatService.subscribe((updatedMessages) => {
            setMessages(updatedMessages);
        });
        return unsubscribe;
    }, []);

    // Effect for initialQuery if needed (e.g. from other screens)
    // For now, assuming Service is single source of truth. 
    // If we want to support initialQuery from other places, we can check if it needs to be added.
    /*
    useEffect(() => {
        if (initialQuery) {
            // Check if already handled
             const lastMsg = messages[messages.length - 1];
             if (lastMsg?.text !== initialQuery) {
                 // Logic to add...
             }
        }
    }, [initialQuery]);
    */ // Commenting out to prefer Service state

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (inputText.length > 1) {
                try {
                    const results = await recipeService.searchRecipes(inputText);
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
    }, [inputText]);

    // addBotMessage removed in favor of direct service calls or generateBotResponse

    const generateBotResponse = async (query: string) => {
        setIsTyping(true);
        await chatService.generateBotResponse(query);
        setIsTyping(false);
    };

    const handleSend = () => {
        if (inputText.trim().length === 0) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: Date.now(),
        };

        chatService.addMessage(userMsg);
        setInputText('');
        setSuggestions([]); // Clear suggestions on send
        setShowSuggestions(false);
        generateBotResponse(inputText);
    };

    const handleSuggestionPress = (recipe: Recipe) => {
        setSuggestions([]);
        setShowSuggestions(false);
        setInputText('');

        // Navigate to Recipe Detail (nested in Main > RecipesTab)
        navigation.navigate('Main', {
            screen: 'ProductsTab',
            params: {
                screen: 'ProductDetail',
                params: { product: recipe },
            }
        });
    };

    const handleSearchPress = (query: string) => {
        setSuggestions([]);
        setShowSuggestions(false);
        setInputText('');

        // Navigate to Recipe List (nested in Main > RecipesTab)
        navigation.navigate('Main', {
            screen: 'ProductsTab',
            params: {
                screen: 'ProductList',
                params: { initialSearch: query },
            }
        });
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isUser = item.sender === 'user';
        return (
            <View style={[
                styles.messageBubble,
                isUser ? styles.userBubble : styles.botBubble,
                item.products && item.products.length > 0 ? { alignItems: 'flex-start', flexWrap: 'wrap' } : {}
            ]}>
                {!isUser && (
                    <View style={styles.botIcon}>
                        <Feather name="shopping-bag" size={16} color={colors.white} />
                    </View>
                )}
                <View style={{ flex: 1, maxWidth: isUser ? '100%' : '100%' }}>
                    <View style={[
                        styles.bubbleContent,
                        isUser ? styles.userBubbleContent : styles.botBubbleContent,
                        isUser && { alignSelf: 'flex-end' },
                        !isUser && { alignSelf: 'flex-start', maxWidth: '85%' }
                    ]}>
                        <Text style={[
                            styles.messageText,
                            isUser ? styles.userMessageText : styles.botMessageText
                        ]}>{item.text}</Text>
                    </View>

                    {/* Render Recipe Cards if available */}
                    {!isUser && item.products && item.products.length > 0 && (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.recipeListContainer}
                        >
                            {item.products.map((recipe) => (
                                <TouchableOpacity
                                    key={recipe.id}
                                    style={styles.chatRecipeCard}
                                    onPress={() => handleSuggestionPress(recipe)}
                                    activeOpacity={0.9}
                                >
                                    <Image source={{ uri: recipe.image }} style={styles.chatRecipeImage} />
                                    <View style={styles.chatRecipeInfo}>
                                        <Text style={styles.chatRecipeName} numberOfLines={2}>{recipe.name}</Text>
                                        <View style={styles.chatRecipeMeta}>
                                            <View style={styles.chatMetaItem}>
                                                <Feather name="truck" size={12} color={colors.primary[500]} />
                                                <Text style={styles.chatMetaText}>Fast Delivery</Text>
                                            </View>
                                            <View style={styles.chatMetaItem}>
                                                <Feather name="star" size={12} color={colors.yellow[500]} />
                                                <Text style={styles.chatMetaText}>{recipe.rating}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color={colors.gray[800]} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Shopping Assistant</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.messageList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            {isTyping && (
                <View style={styles.typingIndicator}>
                    <ActivityIndicator size="small" color={colors.primary[500]} />
                    <Text style={styles.typingText}>Assistant is searching...</Text>
                </View>
            )}

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                style={styles.inputContainer}
            >
                {showSuggestions && inputText.length > 0 && (
                    <View style={styles.suggestionsContainer}>
                        {suggestions.length > 0 && suggestions.map((recipe, index) => (
                            <TouchableOpacity
                                key={recipe.id}
                                style={[
                                    styles.suggestionItem,
                                    styles.suggestionBorder
                                ]}
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
                            onPress={() => handleSearchPress(inputText)}
                        >
                            <Feather name="list" size={14} color={colors.primary[500]} style={{ marginRight: 8 }} />
                            <Text style={[styles.suggestionText, { color: colors.primary[500], fontWeight: '600' }]}>
                                See all results for "{inputText}"
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Search for groceries, products..."
                        placeholderTextColor={colors.gray[400]}
                        value={inputText}
                        onChangeText={setInputText}
                        onSubmitEditing={handleSend}
                        returnKeyType="send"
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                        onPress={handleSend}
                        disabled={!inputText.trim()}
                    >
                        <Feather name="arrow-up" size={20} color={colors.white} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[200],
        backgroundColor: colors.white,
    },
    backButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        fontSize: typography.fontSize.lg,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
    },
    messageList: {
        padding: spacing.md,
        paddingBottom: spacing.xl,
    },
    messageBubble: {
        flexDirection: 'row',
        marginBottom: spacing.md,
        alignItems: 'flex-end',
    },
    userBubble: {
        justifyContent: 'flex-end',
    },
    botBubble: {
        justifyContent: 'flex-start',
    },
    botIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.primary[500],
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        marginBottom: 4,
    },
    bubbleContent: {
        maxWidth: '80%',
        padding: spacing.md,
        borderRadius: borderRadius.xl,
        ...shadow.soft,
    },
    userBubbleContent: {
        backgroundColor: colors.primary[500],
        borderBottomRightRadius: 4,
    },
    botBubbleContent: {
        backgroundColor: colors.white,
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: typography.fontSize.base,
        lineHeight: 22,
    },
    userMessageText: {
        color: colors.white,
    },
    botMessageText: {
        color: colors.text.primary,
    },
    typingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        paddingLeft: spacing.xl,
        gap: spacing.sm,
    },
    typingText: {
        fontSize: typography.fontSize.sm,
        color: colors.gray[500],
    },
    inputContainer: {
        padding: spacing.md,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.gray[100],
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.gray[100],
        borderRadius: borderRadius['2xl'],
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm, // Reduced vertical padding
        minHeight: 48,
    },
    input: {
        flex: 1,
        fontSize: typography.fontSize.base,
        color: colors.text.primary,
        maxHeight: 100,
        paddingVertical: 4,
    },
    sendButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.primary[500],
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: spacing.sm,
    },
    sendButtonDisabled: {
        backgroundColor: colors.gray[400],
    },
    suggestionsContainer: {
        position: 'absolute',
        bottom: '100%',
        left: spacing.md,
        right: spacing.md,
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        ...shadow.medium,
        marginBottom: spacing.xs,
        overflow: 'hidden',
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.white,
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
    recipeListContainer: {
        paddingTop: spacing.md,
        paddingRight: spacing.md,
        gap: spacing.md,
    },
    chatRecipeCard: {
        width: 220,
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        ...shadow.soft,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.gray[100],
    },
    chatRecipeImage: {
        width: '100%',
        height: 120,
        backgroundColor: colors.gray[200],
    },
    chatRecipeInfo: {
        padding: spacing.sm,
    },
    chatRecipeName: {
        fontSize: typography.fontSize.sm,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
        marginBottom: 4,
        height: 40,
    },
    chatRecipeMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chatMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    chatMetaText: {
        fontSize: typography.fontSize.xs,
        color: colors.gray[500],
    },
});

export default ChatScreen;
