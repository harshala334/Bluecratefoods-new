import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Image,
    Linking,
    Modal,
    ScrollView,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius, shadow } from '../../constants/spacing';
import { authService } from '../../services/authService';
import { recipeService } from '../../services/recipeService';
import { User } from '../../types/user';
import { Recipe } from '../../types/recipe';
import Toast from 'react-native-toast-message';

const AdminRequestsScreen = () => {
    const [activeTab, setActiveTab] = useState<'creators' | 'recipes'>('creators');
    const [subTab, setSubTab] = useState<'pending' | 'approved'>('pending');
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchData();
    }, [activeTab, subTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'creators') {
                if (subTab === 'pending') {
                    const creators = await authService.getPendingCreators();
                    setData(creators);
                } else {
                    const creators = await authService.getVerifiedCreators();
                    setData(creators);
                }
            } else {
                if (subTab === 'pending') {
                    const recipes = await recipeService.getPendingRecipes();
                    setData(recipes);
                } else {
                    const recipes = await recipeService.getAdminRecipes();
                    // Filter for approved ones specifically for the approved sub-tab
                    setData(recipes.filter(r => r.isApproved || r.status === 'approved'));
                }
            }
        } catch (error) {
            console.error('Error fetching admin requests:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to fetch data',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleApproveCreator = async (userId: string) => {
        try {
            await authService.approveCreator(userId);
            setData(prev => prev.filter(c => c.id !== userId));
            Toast.show({ type: 'success', text1: 'Approved', text2: 'User is now a verified creator' });
        } catch (error) {
            Alert.alert('Error', 'Failed to approve creator');
        }
    };

    const handleRejectCreator = async (userId: string) => {
        try {
            await authService.rejectCreator(userId);
            setData(prev => prev.filter(c => c.id !== userId));
            Toast.show({ type: 'success', text1: 'Rejected', text2: 'Application rejected' });
        } catch (error) {
            Alert.alert('Error', 'Failed to reject creator');
        }
    };

    const handleRevokeCreator = (userId: string, userName: string) => {
        Alert.alert(
            'Revoke Creator Status',
            `Are you sure you want to revoke creator status for ${userName}? They will no longer be able to add recipes.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Revoke',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await authService.revokeCreator(userId);
                            // Also reject their recipes so they are hidden from public
                            try {
                                await recipeService.rejectByAuthor(userId);
                            } catch (e) {
                                console.error('Failed to hide recipes for revoked creator:', e);
                            }
                            setData(prev => prev.filter(c => c.id !== userId));
                            Toast.show({ type: 'success', text1: 'Revoked', text2: 'Creator status removed & recipes hidden' });
                        } catch (error) {
                            Alert.alert('Error', 'Failed to revoke status');
                        }
                    }
                }
            ]
        );
    };

    const handleApproveRecipe = async (recipeId: string | number) => {
        try {
            await recipeService.approveRecipe(recipeId.toString());
            setData(prev => prev.filter(r => r.id !== recipeId));
            Toast.show({ type: 'success', text1: 'Approved', text2: 'Recipe is now live' });
        } catch (error) {
            Alert.alert('Error', 'Failed to approve recipe');
        }
    };

    const handleRejectRecipe = async (recipeId: string | number) => {
        try {
            await recipeService.rejectRecipe(recipeId.toString());
            setData(prev => prev.filter(r => r.id !== recipeId));
            Toast.show({ type: 'success', text1: 'Rejected', text2: 'Recipe rejected' });
        } catch (error) {
            Alert.alert('Error', 'Failed to reject recipe');
        }
    };

    const handleDeleteRecipe = (recipeId: string | number, recipeTitle: string) => {
        Alert.alert(
            'Delete Recipe',
            `Are you sure you want to delete "${recipeTitle}"? This cannot be undone.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await recipeService.deleteRecipe(recipeId.toString());
                            setData(prev => prev.filter(r => r.id !== recipeId));
                            Toast.show({ type: 'success', text1: 'Deleted', text2: 'Recipe removed' });
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete recipe');
                        }
                    }
                }
            ]
        );
    };

    const renderCreatorItem = ({ item }: { item: User }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Image
                    source={{ uri: item.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}` }}
                    style={styles.avatar}
                />
                <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardSubtitle}>{item.email}</Text>
                </View>
                {subTab === 'approved' && (
                    <View style={[styles.badge, styles.approvedBadge]}>
                        <Text style={styles.badgeText}>Verified</Text>
                    </View>
                )}
            </View>

            {subTab === 'pending' && (item.creatorApplicationReason || (item.creatorSocialLinks && item.creatorSocialLinks.length > 0)) && (
                <View style={styles.applicationDetails}>
                    {item.creatorApplicationReason && (
                        <View style={styles.detailSection}>
                            <Text style={styles.detailLabel}>Reason for joining:</Text>
                            <Text style={styles.detailText}>{item.creatorApplicationReason}</Text>
                        </View>
                    )}
                    {item.creatorSocialLinks && item.creatorSocialLinks.length > 0 && (
                        <View style={styles.detailSection}>
                            <Text style={styles.detailLabel}>Social Links:</Text>
                            <View style={styles.linksContainer}>
                                {item.creatorSocialLinks.map((link, idx) => (
                                    <TouchableOpacity
                                        key={idx}
                                        style={styles.linkBadge}
                                        onPress={() => {
                                            const url = link.startsWith('http') ? link : `https://${link}`;
                                            Linking.openURL(url).catch(err => Alert.alert('Error', 'Cannot open link'));
                                        }}
                                    >
                                        <Feather name="link" size={10} color={colors.primary[600]} />
                                        <Text style={styles.linkBadgeText} numberOfLines={1}>{link}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
            )}

            <View style={styles.cardActions}>
                {subTab === 'pending' ? (
                    <>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.approveButton]}
                            onPress={() => handleApproveCreator(item.id)}
                        >
                            <Text style={styles.actionButtonText}>Approve</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.rejectButton]}
                            onPress={() => handleRejectCreator(item.id)}
                        >
                            <Text style={[styles.actionButtonText, styles.rejectButtonText]}>Reject</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.dangerButton]}
                        onPress={() => handleRevokeCreator(item.id, item.name)}
                    >
                        <Feather name="user-x" size={16} color="white" />
                        <Text style={[styles.actionButtonText, { marginLeft: 8 }]}>Revoke Status</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const renderRecipeItem = ({ item }: { item: Recipe }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => handleViewRecipe(item)}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <Image source={{ uri: item.image }} style={styles.recipeImage} />
                <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardSubtitle}>By {item.authorName || 'Unknown Creator'}</Text>
                </View>
                {subTab === 'approved' && (
                    <View style={[styles.badge, styles.approvedBadge]}>
                        <Text style={styles.badgeText}>Live</Text>
                    </View>
                )}
                {subTab === 'pending' && (
                    <View style={{ position: 'absolute', right: 0, top: 0 }}>
                        <Feather name="maximize-2" size={16} color={colors.primary[500]} />
                    </View>
                )}
            </View>
            <View style={styles.cardActions}>
                {subTab === 'pending' ? (
                    <>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.approveButton]}
                            onPress={() => handleApproveRecipe(item.id)}
                        >
                            <Text style={styles.actionButtonText}>Approve</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.rejectButton]}
                            onPress={() => handleRejectRecipe(item.id)}
                        >
                            <Text style={[styles.actionButtonText, styles.rejectButtonText]}>Reject</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.dangerButton]}
                        onPress={() => handleDeleteRecipe(item.id, item.name)}
                    >
                        <Feather name="trash-2" size={16} color="white" />
                        <Text style={[styles.actionButtonText, { marginLeft: 8 }]}>Delete Recipe</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );

    const handleViewRecipe = (recipe: Recipe) => {
        setSelectedRecipe(recipe);
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Admin Dashboard</Text>
            </View>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'creators' && styles.activeTab]}
                    onPress={() => setActiveTab('creators')}
                >
                    <Text style={[styles.tabText, activeTab === 'creators' && styles.activeTabText]}>
                        Creators
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'recipes' && styles.activeTab]}
                    onPress={() => setActiveTab('recipes')}
                >
                    <Text style={[styles.tabText, activeTab === 'recipes' && styles.activeTabText]}>
                        Recipes
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.subTabs}>
                <TouchableOpacity
                    style={[styles.subTab, subTab === 'pending' && styles.activeSubTab]}
                    onPress={() => setSubTab('pending')}
                >
                    <Text style={[styles.subTabText, subTab === 'pending' && styles.activeSubTabText]}>
                        Pending
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.subTab, subTab === 'approved' && styles.activeSubTab]}
                    onPress={() => setSubTab('approved')}
                >
                    <Text style={[styles.subTabText, subTab === 'approved' && styles.activeSubTabText]}>
                        Approved
                    </Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary[500]} />
                </View>
            ) : (
                <FlatList
                    data={data}
                    renderItem={(activeTab === 'creators' ? renderCreatorItem : renderRecipeItem) as any}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="documents-outline" size={60} color={colors.gray[300]} />
                            <Text style={styles.emptyText}>Nothing found here.</Text>
                        </View>
                    }
                />
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Recipe Details</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color={colors.text.primary} />
                            </TouchableOpacity>
                        </View>

                        {selectedRecipe && (
                            <ScrollView style={styles.modalScroll}>
                                <Image source={{ uri: selectedRecipe.image }} style={styles.modalImage} />
                                <View style={styles.modalBody}>
                                    <Text style={styles.modalRecipeName}>{selectedRecipe.name}</Text>
                                    <Text style={styles.modalAuthor}>By {selectedRecipe.authorName}</Text>

                                    <View style={styles.modalSection}>
                                        <Text style={styles.modalSectionTitle}>Description</Text>
                                        <Text style={styles.modalText}>{selectedRecipe.description || 'No description provided.'}</Text>
                                    </View>

                                    <View style={styles.modalSection}>
                                        <Text style={styles.modalSectionTitle}>Ingredients</Text>
                                        {selectedRecipe.ingredients && selectedRecipe.ingredients.map((ing, i: number) => (
                                            <Text key={i} style={styles.modalText}>
                                                • {ing.amount} {ing.unit} {ing.name}
                                            </Text>
                                        ))}
                                    </View>

                                    <View style={styles.modalSection}>
                                        <Text style={styles.modalSectionTitle}>Instructions</Text>
                                        {selectedRecipe.steps && selectedRecipe.steps.map((step, i: number) => (
                                            <View key={i} style={{ marginBottom: 8 }}>
                                                <Text style={styles.modalText}>
                                                    {i + 1}. <Text style={{ fontFamily: typography.fontFamily.bold }}>{step.title}</Text>
                                                </Text>
                                                <Text style={[styles.modalText, { marginLeft: 16, fontSize: 13 }]}>
                                                    {step.description}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </ScrollView>
                        )}

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.approveButton]}
                                onPress={() => {
                                    if (selectedRecipe) handleApproveRecipe(selectedRecipe.id);
                                    setModalVisible(false);
                                }}
                            >
                                <Text style={styles.actionButtonText}>Approve</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.rejectButton]}
                                onPress={() => {
                                    if (selectedRecipe) handleRejectRecipe(selectedRecipe.id);
                                    setModalVisible(false);
                                }}
                            >
                                <Text style={[styles.actionButtonText, styles.rejectButtonText]}>Reject</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.gray[50],
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.lg,
        backgroundColor: colors.white,
    },
    headerTitle: {
        fontSize: typography.fontSize['2xl'],
        fontFamily: typography.fontFamily.display,
        fontWeight: '700' as const,
        color: colors.text.primary,
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        paddingHorizontal: spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[100],
    },
    tab: {
        paddingVertical: spacing.md,
        marginRight: spacing.xl,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: colors.primary[500],
    },
    tabText: {
        fontSize: typography.fontSize.base,
        fontFamily: typography.fontFamily.medium,
        color: colors.gray[500],
    },
    activeTabText: {
        color: colors.primary[500],
        fontFamily: typography.fontFamily.bold,
    },
    subTabs: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.sm,
        gap: spacing.sm,
    },
    subTab: {
        paddingHorizontal: spacing.lg,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: colors.gray[100],
    },
    activeSubTab: {
        backgroundColor: colors.primary[50],
    },
    subTabText: {
        fontSize: 13,
        color: colors.gray[600],
        fontFamily: typography.fontFamily.medium,
    },
    activeSubTabText: {
        color: colors.primary[600],
        fontFamily: typography.fontFamily.bold,
    },
    listContent: {
        padding: spacing.md,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
        ...shadow.soft,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: spacing.md,
    },
    recipeImage: {
        width: 60,
        height: 60,
        borderRadius: borderRadius.md,
        marginRight: spacing.md,
    },
    cardInfo: {
        flex: 1,
    },
    cardTitle: {
        fontSize: typography.fontSize.base,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
        marginBottom: 2,
    },
    cardSubtitle: {
        fontSize: 12,
        color: colors.gray[500],
        fontFamily: typography.fontFamily.medium,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    approvedBadge: {
        backgroundColor: '#E8F5E9',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#2E7D32',
        textTransform: 'uppercase',
    },
    cardActions: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: spacing.md,
    },
    applicationDetails: {
        backgroundColor: colors.gray[50],
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.gray[100],
    },
    detailSection: {
        marginBottom: spacing.sm,
    },
    detailLabel: {
        fontSize: 10,
        fontFamily: typography.fontFamily.bold,
        color: colors.gray[500],
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    detailText: {
        fontSize: 13,
        color: colors.text.secondary,
        fontFamily: typography.fontFamily.medium,
        lineHeight: 18,
    },
    linksContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    linkBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary[50],
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
        maxWidth: 150,
    },
    linkBadgeText: {
        fontSize: 11,
        color: colors.primary[700],
        fontFamily: typography.fontFamily.medium,
    },
    actionButton: {
        flex: 1,
        height: 44,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    approveButton: {
        backgroundColor: colors.primary[500],
    },
    rejectButton: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.gray[200],
    },
    dangerButton: {
        backgroundColor: '#FFEBEE',
        borderWidth: 1,
        borderColor: '#FFCDD2',
    },
    actionButtonText: {
        color: colors.white,
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.fontSize.sm,
    },
    rejectButtonText: {
        color: colors.gray[600],
    },
    dangerButtonText: {
        color: '#D32F2F',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
    },
    emptyText: {
        marginTop: spacing.md,
        fontSize: typography.fontSize.base,
        color: colors.gray[400],
        fontFamily: typography.fontFamily.medium,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        height: '80%',
        paddingBottom: spacing.xl,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[100],
    },
    modalTitle: {
        fontSize: typography.fontSize.lg,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
    },
    modalScroll: {
        flex: 1,
    },
    modalImage: {
        width: '100%',
        height: 200,
    },
    modalBody: {
        padding: spacing.xl,
    },
    modalRecipeName: {
        fontSize: typography.fontSize.xl,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
        marginBottom: 4,
    },
    modalAuthor: {
        fontSize: typography.fontSize.sm,
        color: colors.primary[500],
        fontFamily: typography.fontFamily.bold,
        marginBottom: spacing.lg,
    },
    modalSection: {
        marginBottom: spacing.xl,
    },
    modalSectionTitle: {
        fontSize: typography.fontSize.base,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    modalText: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
        fontFamily: typography.fontFamily.medium,
        lineHeight: 22,
        marginBottom: 4,
    },
    modalFooter: {
        flexDirection: 'row',
        padding: spacing.xl,
        gap: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.gray[100],
    },
});

export default AdminRequestsScreen;
