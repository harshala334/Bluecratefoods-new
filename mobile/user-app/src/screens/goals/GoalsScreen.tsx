import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ProgressBarAndroid, // Note: Cross-platform progress bar needed? View width is better.
    Platform,
} from 'react-native';
import { colors } from '../../constants/colors';
import { typography, textStyles } from '../../constants/typography';
import { spacing, borderRadius, shadow } from '../../constants/spacing';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock Data
const USER_STATS = {
    level: 5,
    title: 'Sous Chef',
    xp: 2450,
    nextLevelXp: 3000,
    streak: 7,
    totalCooked: 42,
};

const DAILY_MISSIONS = [
    { id: 1, title: 'Cook a 10-min recipe', xp: 50, completed: true, icon: 'clock' },
    { id: 2, title: 'Share a recipe', xp: 30, completed: false, icon: 'share-2' },
    { id: 3, title: 'Try a new cuisine', xp: 100, completed: false, icon: 'globe' },
];

const ACHIEVEMENTS = [
    { id: 1, title: 'First Steps', description: 'Cooked your first meal', icon: 'flag', unlocked: true, color: colors.accent[500] },
    { id: 2, title: 'Speedster', description: 'Cooked a meal in < 10 mins', icon: 'zap', unlocked: true, color: colors.orange[500] },
    { id: 3, title: 'Healthy Eater', description: 'Cooked 5 healthy meals', icon: 'heart', unlocked: false, color: colors.red[500] },
    { id: 4, title: 'Master Chef', description: 'Reach Level 10', icon: 'award', unlocked: false, color: colors.purple[500] },
];

const GoalsScreen = () => {
    const insets = useSafeAreaInsets();
    const [missions, setMissions] = useState(DAILY_MISSIONS);

    const toggleMission = (id: number) => {
        // Just a mock toggle for interaction
        setMissions(prev => prev.map(m => m.id === id ? { ...m, completed: !m.completed } : m));
    };

    const progressPercent = (USER_STATS.xp / USER_STATS.nextLevelXp) * 100;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + spacing.sm }]}>
                <Text style={styles.headerTitle}>My Goals</Text>
                <View style={styles.streakBadge}>
                    <Ionicons name="flame" size={20} color={colors.orange[500]} />
                    <Text style={styles.streakText}>{USER_STATS.streak} Day Streak</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Level Card */}
                <View style={styles.levelCard}>
                    {/* Gradient Background could be nice here */}
                    <View style={styles.levelHeader}>
                        <View>
                            <Text style={styles.levelLabel}>Current Level</Text>
                            <Text style={styles.levelTitle}>{USER_STATS.title}</Text>
                        </View>
                        <View style={styles.levelBadge}>
                            <Text style={styles.levelNumber}>{USER_STATS.level}</Text>
                        </View>
                    </View>

                    <View style={styles.progressContainer}>
                        <View style={styles.progressLabelRow}>
                            <Text style={styles.xpText}>{USER_STATS.xp} XP</Text>
                            <Text style={styles.xpText}>{USER_STATS.nextLevelXp} XP</Text>
                        </View>
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                        </View>
                        <Text style={styles.progressSubtext}>
                            {USER_STATS.nextLevelXp - USER_STATS.xp} XP to reach Level {USER_STATS.level + 1}
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.boostButton}>
                        <Feather name="trending-up" size={18} color={colors.white} style={{ marginRight: 8 }} />
                        <Text style={styles.boostButtonText}>View XP Boost Items</Text>
                    </TouchableOpacity>
                </View>

                {/* Daily Missions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Daily Missions</Text>
                    <View style={styles.missionsList}>
                        {missions.map((mission) => (
                            <TouchableOpacity
                                key={mission.id}
                                style={[styles.missionItem, mission.completed && styles.missionItemCompleted]}
                                activeOpacity={0.8}
                                onPress={() => toggleMission(mission.id)}
                            >
                                <View style={[styles.missionIcon, { backgroundColor: mission.completed ? colors.green[100] : colors.gray[100] }]}>
                                    <Feather
                                        name={mission.completed ? "check" : mission.icon as any}
                                        size={20}
                                        color={mission.completed ? colors.green[600] : colors.gray[600]}
                                    />
                                </View>
                                <View style={styles.missionContent}>
                                    <Text style={[styles.missionTitle, mission.completed && styles.missionTitleCompleted]}>
                                        {mission.title}
                                    </Text>
                                    <Text style={styles.missionXp}>+{mission.xp} XP</Text>
                                </View>
                                {mission.completed && (
                                    <View style={styles.completedBadge}>
                                        <Text style={styles.completedText}>Done</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Achievements */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Achievements</Text>
                    <View style={styles.achievementsGrid}>
                        {ACHIEVEMENTS.map((achievement) => (
                            <View
                                key={achievement.id}
                                style={[styles.achievementCard, !achievement.unlocked && styles.achievementLocked]}
                            >
                                <View style={[styles.achievementIcon, { backgroundColor: achievement.unlocked ? achievement.color + '20' : colors.gray[100] }]}>
                                    <Feather
                                        name={achievement.icon as any}
                                        size={24}
                                        color={achievement.unlocked ? achievement.color : colors.gray[400]}
                                    />
                                </View>
                                <Text style={[styles.achievementTitle, !achievement.unlocked && styles.textLocked]}>
                                    {achievement.title}
                                </Text>
                                <Text style={styles.achievementDesc} numberOfLines={2}>
                                    {achievement.description}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    scrollContent: {
        padding: spacing.md,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingTop: spacing.md, // Base padding, effectively overridden/added to by inline style
        paddingBottom: spacing.sm,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[100],
    },
    headerTitle: {
        ...(textStyles.h2 as any),
        color: colors.text.primary,
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.orange[50], // Light orange
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.orange[200],
    },
    streakText: {
        marginLeft: 4,
        color: colors.orange[700],
        fontWeight: '700',
        fontSize: typography.fontSize.sm,
    },
    levelCard: {
        backgroundColor: colors.primary[600], // Dark primary
        borderRadius: borderRadius['2xl'],
        padding: spacing.lg,
        marginBottom: spacing.lg,
        ...shadow.medium,
    },
    levelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.lg,
    },
    levelLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: typography.fontSize.sm,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontWeight: '600',
    },
    levelTitle: {
        color: colors.white,
        fontSize: typography.fontSize['3xl'], // Big title
        fontWeight: 'bold',
        fontFamily: typography.fontFamily.display,
    },
    levelBadge: {
        backgroundColor: colors.white,
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadow.soft,
    },
    levelNumber: {
        color: colors.primary[600],
        fontSize: typography.fontSize.xl,
        fontWeight: 'bold',
    },
    progressContainer: {
        marginBottom: spacing.lg,
    },
    progressLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    xpText: {
        color: colors.white,
        fontSize: typography.fontSize.xs,
        fontWeight: '600',
    },
    progressBarBg: {
        height: 8,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: colors.yellow[400], // Highlight color
        borderRadius: 4,
    },
    progressSubtext: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: typography.fontSize.xs,
        textAlign: 'center',
    },
    boostButton: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    boostButtonText: {
        color: colors.white,
        fontWeight: '600',
        fontSize: typography.fontSize.base,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        ...(textStyles.h3 as any),
        marginBottom: spacing.md,
        color: colors.text.primary,
    },
    missionsList: {
        gap: spacing.sm,
    },
    missionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: spacing.md,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: colors.gray[100],
        ...shadow.soft,
    },
    missionItemCompleted: {
        borderColor: colors.green[200],
        backgroundColor: colors.green[50], // Very light green
        opacity: 0.8,
    },
    missionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    missionContent: {
        flex: 1,
    },
    missionTitle: {
        fontSize: typography.fontSize.base,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 2,
    },
    missionTitleCompleted: {
        textDecorationLine: 'line-through',
        color: colors.gray[500],
    },
    missionXp: {
        fontSize: typography.fontSize.xs,
        color: colors.primary[600],
        fontWeight: 'bold',
    },
    completedBadge: {
        backgroundColor: colors.green[100],
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: borderRadius.full,
    },
    completedText: {
        color: colors.green[700],
        fontSize: typography.fontSize.xs,
        fontWeight: 'bold',
    },
    achievementsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    achievementCard: {
        width: '47%', // 2 cols with gap
        backgroundColor: colors.white,
        padding: spacing.md,
        borderRadius: borderRadius.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.gray[100],
        ...shadow.soft,
    },
    achievementLocked: {
        opacity: 0.6,
        backgroundColor: colors.gray[50],
        borderColor: colors.gray[200],
        elevation: 0,
        shadowOpacity: 0,
    },
    achievementIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    achievementTitle: {
        fontSize: typography.fontSize.sm,
        fontWeight: 'bold',
        marginBottom: 4,
        textAlign: 'center',
        color: colors.text.primary,
    },
    textLocked: {
        color: colors.gray[500],
    },
    achievementDesc: {
        fontSize: 10,
        color: colors.gray[500],
        textAlign: 'center',
    },
});

export default GoalsScreen;
