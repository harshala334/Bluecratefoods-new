import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    StatusBar,
    TextInput
} from 'react-native';
import { colors } from '../../constants/colors';
import { spacing, borderRadius, shadow } from '../../constants/spacing';
import { typography, textStyles } from '../../constants/typography';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock Data for Community Feed
const MOCK_POSTS = [
    {
        id: '1',
        user: {
            name: 'Sarah Jenkins',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            level: 'Sous Chef',
        },
        timestamp: '2h ago',
        content: 'Just tried the new Spicy Thai Basil Chicken recipe! It was amazing but definitely packs a punch 🌶️',
        image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        likes: 24,
        comments: 5,
        liked: false,
    },
    {
        id: '2',
        user: {
            name: 'Mike Chen',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            level: 'Head Chef',
        },
        timestamp: '5h ago',
        content: 'Prep for the weekend dinner party is underway! Who else is cooking up a storm today? 🔪🥬',
        image: null,
        likes: 12,
        comments: 2,
        liked: true,
    },
    {
        id: '3',
        user: {
            name: 'Emily Davis',
            avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
            level: 'Line Cook',
        },
        timestamp: '1d ago',
        content: 'Can anyone recommend a good substitute for heavy cream in the Mushroom Risotto? Trying to keep it lighter!',
        image: null,
        likes: 8,
        comments: 14,
        liked: false,
    },
];

const CommunityScreen = () => {
    const insets = useSafeAreaInsets();
    const [posts, setPosts] = useState(MOCK_POSTS);

    const toggleLike = (id: string) => {
        setPosts(prev => prev.map(post =>
            post.id === id
                ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
                : post
        ));
    };

    const renderPost = ({ item }: { item: typeof MOCK_POSTS[0] }) => (
        <View style={styles.postCard}>
            {/* Post Header */}
            <View style={styles.postHeader}>
                <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.user.name}</Text>
                    <View style={styles.metaRow}>
                        <Text style={styles.userLevel}>{item.user.level}</Text>
                        <Text style={styles.dotSeparator}>•</Text>
                        <Text style={styles.timestamp}>{item.timestamp}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                    <Feather name="more-horizontal" size={20} color={colors.gray[500]} />
                </TouchableOpacity>
            </View>

            {/* Post Content */}
            <Text style={styles.postContent}>{item.content}</Text>

            {item.image && (
                <Image source={{ uri: item.image }} style={styles.postImage} resizeMode="cover" />
            )}

            {/* Post Actions */}
            <View style={styles.actionRow}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => toggleLike(item.id)}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name={item.liked ? "heart" : "heart-outline"}
                        size={22}
                        color={item.liked ? colors.red[500] : colors.gray[500]}
                    />
                    <Text style={[styles.actionText, item.liked && styles.activeActionText]}>
                        {item.likes}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                    <Ionicons name="chatbubble-outline" size={22} color={colors.gray[500]} />
                    <Text style={styles.actionText}>{item.comments}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionButton, styles.shareBtn]} activeOpacity={0.7}>
                    <Ionicons name="share-social-outline" size={22} color={colors.gray[500]} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={colors.white} barStyle="dark-content" />

            {/* Header */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + spacing.sm }]}>
                <Text style={styles.headerTitle}>Community</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="notifications-outline" size={24} color={colors.text.primary} />
                </TouchableOpacity>
            </View>

            {/* New Post Input Trigger */}
            <View style={styles.newPostContainer}>
                {/* TODO: [CLOUDINARY] Use user's Cloudinary avatar URL here */}
                <Image source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} style={styles.myAvatar} />
                <TouchableOpacity style={styles.fakeInput}>
                    <Text style={styles.placeholderText}>Share your culinary adventures...</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={posts}
                keyExtractor={item => item.id}
                renderItem={renderPost}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            {/* Floating Action Button */}
            <TouchableOpacity style={styles.fab} activeOpacity={0.9}>
                {/* TODO: [CLOUDINARY] When creating a post, upload any selected images to Cloudinary first */}
                <Feather name="plus" size={24} color={colors.white} />
            </TouchableOpacity>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingTop: spacing.md, // Base padding, updated to match Goals/Home
        paddingBottom: spacing.sm,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[100],
    },
    headerTitle: {
        ...(textStyles.h2 as any),
        color: colors.text.primary,
    },
    iconButton: {
        padding: spacing.xs,
    },
    newPostContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.white,
        marginBottom: spacing.xs,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[100],
    },
    myAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: spacing.md,
        backgroundColor: colors.gray[200],
    },
    fakeInput: {
        flex: 1,
        height: 40,
        backgroundColor: colors.gray[50], // Light gray bg for input
        borderRadius: borderRadius.full,
        justifyContent: 'center',
        paddingHorizontal: spacing.md,
        borderWidth: 1,
        borderColor: colors.gray[200],
    },
    placeholderText: {
        color: colors.gray[500],
        fontSize: typography.fontSize.sm,
    },
    listContent: {
        paddingBottom: 80, // Space for FAB
    },
    postCard: {
        backgroundColor: colors.white,
        marginBottom: spacing.sm,
        padding: spacing.md,
        // Using soft shadow from spacing based on design system
        ...shadow.soft,
        elevation: 1, // Ensure flat look isn't too strong
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: spacing.sm,
        backgroundColor: colors.gray[200],
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: typography.fontSize.base,
        fontWeight: '700',
        color: colors.text.primary,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userLevel: {
        fontSize: typography.fontSize.xs,
        color: colors.primary[600],
        fontWeight: '600',
    },
    dotSeparator: {
        marginHorizontal: 4,
        color: colors.gray[400],
        fontSize: 10,
    },
    timestamp: {
        fontSize: typography.fontSize.xs,
        color: colors.gray[500],
    },
    moreButton: {
        padding: 4,
    },
    postContent: {
        fontSize: typography.fontSize.base,
        color: colors.text.secondary,
        lineHeight: 22,
        marginBottom: spacing.md,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
    },
    actionRow: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: colors.gray[100],
        paddingTop: spacing.sm,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: spacing.xl,
        paddingVertical: 4,
    },
    actionText: {
        marginLeft: 6,
        color: colors.gray[600],
        fontSize: typography.fontSize.sm,
        fontWeight: '500',
    },
    activeActionText: {
        color: colors.red[500],
    },
    shareBtn: {
        marginLeft: 'auto',
        marginRight: 0,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary[500],
        alignItems: 'center',
        justifyContent: 'center',
        ...shadow.medium,
    },
});

export default CommunityScreen;
