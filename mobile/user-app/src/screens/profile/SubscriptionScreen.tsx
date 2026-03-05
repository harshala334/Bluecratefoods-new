import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius, shadow } from '../../constants/spacing';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const SubscriptionScreen = ({ navigation }: any) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color={colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Blue Crate Premium</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.heroSection}>
                    <LinearGradient
                        colors={[colors.primary[500], colors.primary[700]]}
                        style={styles.heroCard}
                    >
                        <MaterialCommunityIcons name="crown" size={48} color={colors.white} />
                        <Text style={styles.heroTitle}>Upgrade to Premium</Text>
                        <Text style={styles.heroSubtitle}>Get unlimited free deliveries and exclusive deals on every order.</Text>
                    </LinearGradient>
                </View>

                <View style={styles.benefitsSection}>
                    <Text style={styles.sectionTitle}>Premium Benefits</Text>
                    <BenefitItem
                        icon="truck-fast"
                        title="Free Delivery"
                        subtitle="Unlimited free deliveries on all orders above ₹199"
                    />
                    <BenefitItem
                        icon="percent"
                        title="Extra 10% Off"
                        subtitle="Additional discount on 1000+ premium products"
                    />
                    <BenefitItem
                        icon="clock-fast"
                        title="Priority Support"
                        subtitle="Your orders always jump the queue for faster delivery"
                    />
                </View>

                <View style={styles.plansSection}>
                    <Text style={styles.sectionTitle}>Choose Your Plan</Text>
                    <TouchableOpacity style={styles.planCard}>
                        <View style={styles.planInfo}>
                            <Text style={styles.planName}>Monthly</Text>
                            <Text style={styles.planPrice}>₹99 / month</Text>
                        </View>
                        <View style={styles.selectCircle}>
                            <View style={styles.selectInner} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.planCard, styles.activePlanCard]}>
                        <View style={styles.popularBadge}>
                            <Text style={styles.popularText}>MOST POPULAR</Text>
                        </View>
                        <View style={styles.planInfo}>
                            <Text style={styles.planName}>Yearly</Text>
                            <Text style={styles.planPrice}>₹799 / year</Text>
                            <Text style={styles.saveText}>Save 33%</Text>
                        </View>
                        <View style={styles.selectCircleActive}>
                            <View style={styles.selectInnerActive} />
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.subscribeButton}>
                    <Text style={styles.subscribeButtonText}>Start 7-Day Free Trial</Text>
                </TouchableOpacity>
                <Text style={styles.footerLegal}>Renews at ₹799/yr after trial. Cancel anytime.</Text>
            </View>
        </SafeAreaView>
    );
};

const BenefitItem = ({ icon, title, subtitle }: any) => (
    <View style={styles.benefitItem}>
        <View style={styles.benefitIconContainer}>
            <MaterialCommunityIcons name={icon} size={24} color={colors.primary[600]} />
        </View>
        <View style={styles.benefitText}>
            <Text style={styles.benefitTitle}>{title}</Text>
            <Text style={styles.benefitSubtitle}>{subtitle}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[100],
    },
    backButton: {
        marginRight: spacing.md,
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
    },
    scrollContent: {
        paddingBottom: 120,
    },
    heroSection: {
        padding: spacing.lg,
    },
    heroCard: {
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        ...shadow.medium,
    },
    heroTitle: {
        fontSize: 24,
        fontFamily: typography.fontFamily.bold,
        color: colors.white,
        marginTop: 12,
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 20,
    },
    benefitsSection: {
        paddingHorizontal: spacing.xl,
        marginTop: spacing.sm,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
        marginBottom: spacing.lg,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    benefitIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: colors.primary[50],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    benefitText: {
        flex: 1,
    },
    benefitTitle: {
        fontSize: 15,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
        marginBottom: 2,
    },
    benefitSubtitle: {
        fontSize: 12,
        color: colors.gray[500],
        lineHeight: 16,
    },
    plansSection: {
        paddingHorizontal: spacing.xl,
        marginTop: spacing.md,
    },
    planCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: colors.gray[100],
        marginBottom: 16,
    },
    activePlanCard: {
        borderColor: colors.primary[500],
        backgroundColor: colors.primary[50],
    },
    planInfo: {
        flex: 1,
    },
    planName: {
        fontSize: 16,
        fontFamily: typography.fontFamily.bold,
        color: colors.text.primary,
        marginBottom: 2,
    },
    planPrice: {
        fontSize: 14,
        color: colors.gray[600],
    },
    saveText: {
        fontSize: 11,
        color: colors.primary[600],
        fontFamily: typography.fontFamily.bold,
        marginTop: 4,
    },
    popularBadge: {
        position: 'absolute',
        top: -10,
        right: 20,
        backgroundColor: colors.primary[600],
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    popularText: {
        fontSize: 10,
        color: colors.white,
        fontFamily: typography.fontFamily.bold,
    },
    selectCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.gray[300],
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'transparent',
    },
    selectCircleActive: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.primary[500],
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectInnerActive: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.primary[500],
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.white,
        padding: spacing.xl,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopColor: colors.gray[100],
    },
    subscribeButton: {
        backgroundColor: colors.primary[600],
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadow.medium,
    },
    subscribeButtonText: {
        fontSize: 16,
        fontFamily: typography.fontFamily.bold,
        color: colors.white,
    },
    footerLegal: {
        fontSize: 11,
        color: colors.gray[400],
        textAlign: 'center',
        marginTop: 12,
    },
});

export default SubscriptionScreen;
