import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Image,
    Animated,
    ScrollView,
    TouchableWithoutFeedback,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { API_CONFIG, CDN_URL } from '../../constants/config';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius, shadow } from '../../constants/spacing';

const { width, height } = Dimensions.get('window');

interface Checkpoint {
    id: number;
    time: number; // in seconds
    instruction: string;
    stationId: string; // ID of the kitchen box to highlight
}

const CHECKPOINTS: Checkpoint[] = [
    {
        id: 1,
        time: 1,
        instruction: "First, toast the burger buns until golden brown.",
        stationId: 'toaster',
    },
    {
        id: 2,
        time: 2,
        instruction: "Spread a generous layer of secret sauce.",
        stationId: 'prep',
    },
    {
        id: 3,
        time: 3,
        instruction: "Place fresh, crunchy lettuce on the bottom bun.",
        stationId: 'prep',
    },
    {
        id: 4,
        time: 4,
        instruction: "Add two juicy slices of tomato.",
        stationId: 'chopping',
    },
    {
        id: 5,
        time: 5,
        instruction: "Layer some thin onion rings for extra crunch.",
        stationId: 'chopping',
    },
    {
        id: 6,
        time: 6,
        instruction: "Place the hot, grilled burger patty on top.",
        stationId: 'stove',
    },
    {
        id: 7,
        time: 7,
        instruction: "Add a slice of melted cheddar cheese.",
        stationId: 'stove',
    },
    {
        id: 8,
        time: 8,
        instruction: "Top with some tangy pickles.",
        stationId: 'prep',
    },
    {
        id: 9,
        time: 9,
        instruction: "Close the burger with the top bun.",
        stationId: 'prep',
    },
    {
        id: 10,
        time: 10,
        instruction: "Gently press down for a perfect bite.",
        stationId: 'prep',
    },
    {
        id: 11,
        time: 11,
        instruction: "Your burger is ready! Bon appétit!",
        stationId: 'prep',
    }
];

const STATIONS = [
    // Big Machines / Basins
    { id: 'stove', name: 'Gas Stove', icon: 'flame', type: 'Ionicons', color: '#FACC15', category: 'machine', image: require('../../../assets/images/simulation/stove_3d_sprite_1769965932183.png') },
    { id: 'microwave', name: 'Microwave', icon: 'microwave', type: 'MaterialCommunityIcons', color: '#60A5FA', category: 'machine' },
    { id: 'oven', name: 'Oven', icon: 'stove', type: 'MaterialCommunityIcons', color: '#F87171', category: 'machine' },
    { id: 'sink', name: 'Sink', icon: 'water', type: 'Ionicons', color: '#2DD4BF', category: 'machine', image: require('../../../assets/images/simulation/sink_3d_sprite_1769965948482.png') },
    { id: 'prep', name: 'Counter', icon: 'table-furniture', type: 'MaterialCommunityIcons', color: '#A78BFA', category: 'machine', image: require('../../../assets/images/simulation/counter_3d_sprite_1769965987520.png') },

    // Small Utensils / Tools
    { id: 'blender', name: 'Blender', icon: 'blender', type: 'MaterialCommunityIcons', color: '#34D399', category: 'utensil' },
    { id: 'toaster', name: 'Toaster', icon: 'toaster-oven', type: 'MaterialCommunityIcons', color: '#FB923C', category: 'utensil' },
    { id: 'chopping', name: 'Chopping', icon: 'content-cut', type: 'MaterialCommunityIcons', color: '#F472B6', category: 'utensil' },
    { id: 'kettle', name: 'Kettle', icon: 'kettle-outline', type: 'MaterialCommunityIcons', color: '#94A3B8', category: 'utensil' },
    { id: 'whisk', name: 'Whisk', icon: 'bowl-mix', type: 'MaterialCommunityIcons', color: '#64748B', category: 'utensil' },
];

const FRIDGE_ITEMS = [
    { id: 'bun', name: 'Burger Buns', icon: 'bread-slice', color: '#FDE68A', image: require('../../../assets/images/simulation/bun_3d_sprite_1769966026172.png') },
    { id: 'patty', name: 'Meat Patty', icon: 'food-steak', color: '#B45309' },
    { id: 'lettuce', name: 'Lettuce', icon: 'leaf', color: '#4ADE80' },
    { id: 'tomato', name: 'Tomato', icon: 'food-apple', color: '#F87171', image: require('../../../assets/images/simulation/tomato_3d_sprite_1769966001372.png'), choppedImage: require('../../../assets/images/simulation/chopped_tomato_3d_sprite_1769966063616.png') },
    { id: 'cheese', name: 'Cheese', icon: 'cheese', color: '#FBBF24' },
    { id: 'sauce', name: 'Secret Sauce', icon: 'bottle-tonic-plus', color: '#EF4444' },
];

const KNIFE_IMAGE = require('../../../assets/images/simulation/knife_3d_sprite_1769966048108.png');
const FRIDGE_3D_IMAGE = require('../../../assets/images/simulation/fridge_3d_sprite_1769965966994.png');

const KitchenStationBox = ({ station, isActive, onPress }: { station: any, isActive: boolean, onPress?: () => void }) => {
    const scale = useRef(new Animated.Value(1)).current;
    const shake = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (isActive) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scale, { toValue: 1.1, duration: 600, useNativeDriver: true }),
                    Animated.timing(scale, { toValue: 1, duration: 600, useNativeDriver: true }),
                ])
            ).start();
        } else {
            scale.setValue(1);
        }
    }, [isActive]);

    const handlePress = () => {
        if (isActive) {
            onPress?.();
        } else {
            // Shake animation for inactive click
            Animated.sequence([
                Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shake, { toValue: -10, duration: 50, useNativeDriver: true }),
                Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true }),
            ]).start();
        }
    };

    const renderIcon = () => {
        if (station.image) {
            return <Image source={station.image} style={styles.stationImage} />;
        }
        const size = station.category === 'machine' ? 28 : 20;
        if (station.type === 'Ionicons') return <Ionicons name={station.icon as any} size={size} color="#fff" />;
        return <MaterialCommunityIcons name={station.icon as any} size={size} color="#fff" />;
    };

    const boxStyle = station.category === 'machine' ? styles.machineBox : styles.utensilBox;

    return (
        <TouchableOpacity
            activeOpacity={isActive ? 0.7 : 0.9}
            onPress={handlePress}
            style={isActive ? { zIndex: 10 } : {}}
        >
            <Animated.View style={[
                boxStyle,
                { borderColor: isActive ? '#fff' : 'rgba(255,255,255,0.1)' },
                isActive && {
                    backgroundColor: `${station.color}40`,
                    borderWidth: 2,
                    shadowColor: station.color,
                    shadowOpacity: 1,
                    shadowRadius: 15,
                    elevation: 20
                },
                { transform: [{ scale }, { translateX: shake }] }
            ]}>
                <View style={[styles.stationIconContainer, { backgroundColor: station.color }]}>
                    {renderIcon()}
                </View>
                <View style={[styles.glowRing, { borderColor: station.color, opacity: isActive ? 1 : 0 }]} />
            </Animated.View>
        </TouchableOpacity>
    );
};

const RecipeSimulationScreen = () => {
    const navigation = useNavigation();
    const videoSource = require('../../../assets/videos/simulation.mp4');
    const chefKittyImg = { uri: `${CDN_URL}/cat-cheff.png` };

    const [currentStep, setCurrentStep] = useState(0);
    const [activeTabStationId, setActiveTabStationId] = useState(CHECKPOINTS[0].stationId);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFridgeOpen, setIsFridgeOpen] = useState(false);
    const [itemsOnCounter, setItemsOnCounter] = useState<string[]>([]); // Store IDs instead of names
    const [isTomatoChopped, setIsTomatoChopped] = useState(false);
    const [progress, setProgress] = useState(0);

    // Animation values
    const knifePos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
    const knifeRotation = useRef(new Animated.Value(0)).current;
    const waterOpacity = useRef(new Animated.Value(0)).current;
    const steamOpacity = useRef(new Animated.Value(0)).current;

    const utensilsScrollRef = useRef<ScrollView>(null);
    const machinesScrollRef = useRef<ScrollView>(null);
    const tabsScrollRef = useRef<ScrollView>(null);
    const [videoError, setVideoError] = useState(false);
    const [showOverlays, setShowOverlays] = useState(false);

    // Refs for synchronization
    const stepRef = useRef(0);
    const stopTimeRef = useRef(CHECKPOINTS[0].time);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const player = useVideoPlayer(videoSource, (player) => {
        player.loop = false;
        player.pause();
    });

    React.useEffect(() => {
        const playingSub = player.addListener('playingChange', (event) => {
            setIsPlaying(event.isPlaying);
            if (event.isPlaying) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                intervalRef.current = setInterval(() => {
                    const currentPos = player.currentTime;
                    const duration = player.duration || 11;
                    setProgress(currentPos / duration);
                    if (currentPos >= stopTimeRef.current - 0.05) {
                        player.pause();
                        setProgress(Math.min(stopTimeRef.current / duration, 1));
                    }
                }, 30);
            } else {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            }
        });

        const timeSub = player.addListener('timeUpdate', (event) => {
            if (!player.playing) {
                const duration = player.duration || 11;
                setProgress(event.currentTime / duration);
            }
        });

        return () => {
            playingSub.remove();
            timeSub.remove();
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [player]);

    const currentCheckpoint = CHECKPOINTS[currentStep];

    // Sync active tab when step changes automatically
    React.useEffect(() => {
        setActiveTabStationId(currentCheckpoint.stationId);

        // Auto-scroll to the active station in the grid
        const utensilIndex = STATIONS.filter(s => s.category === 'utensil').findIndex(s => s.id === currentCheckpoint.stationId);
        if (utensilIndex !== -1) {
            utensilsScrollRef.current?.scrollTo({ x: utensilIndex * (60 + 12) - 20, animated: true });
        }

        const machineIndex = STATIONS.filter(s => s.category === 'machine').findIndex(s => s.id === currentCheckpoint.stationId);
        if (machineIndex !== -1) {
            machinesScrollRef.current?.scrollTo({ x: machineIndex * (100 + 12) - 20, animated: true });
        }

        // Auto-scroll the tabs too
        const tabIndex = STATIONS.findIndex(s => s.id === currentCheckpoint.stationId);
        if (tabIndex !== -1) {
            tabsScrollRef.current?.scrollTo({ x: tabIndex * 100 - (width / 3), animated: true });
        }
    }, [currentStep, currentCheckpoint.stationId]);

    const handleNext = async () => {
        if (currentStep < CHECKPOINTS.length - 1) {
            if (player.playing) {
                player.pause();
            } else {
                const currentTime = player.currentTime;
                if (currentTime >= stopTimeRef.current - 0.2) {
                    const nextStep = currentStep + 1;
                    setCurrentStep(nextStep);
                    stepRef.current = nextStep;
                    stopTimeRef.current = CHECKPOINTS[nextStep].time;
                }
                player.play();
            }
        } else {
            navigation.goBack();
        }
    };

    const toggleFridge = () => setIsFridgeOpen(!isFridgeOpen);

    const handleFridgeItemPress = (itemId: string) => {
        if (!itemsOnCounter.includes(itemId)) {
            setItemsOnCounter([...itemsOnCounter, itemId]);
        }
        setIsFridgeOpen(false);
        // Automatically switch to Counter tab to show the item
        setActiveTabStationId('prep');
    };

    const handleChop = () => {
        if (!isTomatoChopped) {
            // Complex knife animation
            Animated.sequence([
                // Move knife to tomato
                Animated.spring(knifePos, {
                    toValue: { x: -30, y: 0 },
                    useNativeDriver: true,
                }),
                // Slicing motion
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(knifeRotation, { toValue: -15, duration: 150, useNativeDriver: true }),
                        Animated.timing(knifeRotation, { toValue: 15, duration: 150, useNativeDriver: true }),
                    ]),
                    { iterations: 3 }
                ),
            ]).start(() => {
                setIsTomatoChopped(true);
                // Reset knife
                Animated.spring(knifePos, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: true,
                }).start();
                knifeRotation.setValue(0);

                if (currentCheckpoint.stationId === 'chopping') {
                    handleNext();
                }
            });
        }
    };
    const handleWash = () => {
        Animated.sequence([
            Animated.timing(waterOpacity, { toValue: 0.8, duration: 300, useNativeDriver: true }),
            Animated.delay(1500),
            Animated.timing(waterOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start(() => {
            if (currentCheckpoint.stationId === 'sink') {
                handleNext();
            }
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Top Section: Video Player */}
            <TouchableWithoutFeedback onPress={() => setShowOverlays(!showOverlays)}>
                <View style={styles.videoSection}>
                    {showOverlays && (
                        <View style={styles.header}>
                            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                                <Ionicons name="close" size={28} color={colors.white} />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>SIMULATION</Text>
                            <View style={{ width: 44 }} />
                        </View>
                    )}

                    {videoError ? (
                        <View style={styles.videoMock}>
                            <Text style={styles.videoText}>VIDEO NOT FOUND</Text>
                        </View>
                    ) : (
                        <VideoView
                            player={player}
                            style={styles.video}
                            contentFit="cover"
                            fullscreenOptions={{ enable: false }}
                            allowsPictureInPicture={false}
                        />
                    )}

                    {showOverlays && (
                        <View style={styles.progressBarBackground}>
                            <View style={[styles.progressBarFill, { width: `${Math.min(progress, 1) * 100}%` }]} />
                        </View>
                    )}
                </View>
            </TouchableWithoutFeedback>

            {/* Middle Section: Character & Tabs */}
            <View style={styles.instructionSection}>
                {/* Tabs Header */}
                <View style={styles.tabsHeader}>
                    <ScrollView
                        ref={tabsScrollRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.tabsScrollContent}
                    >
                        {STATIONS.map((station) => {
                            const isCurrentTask = currentCheckpoint.stationId === station.id;
                            const isViewed = activeTabStationId === station.id;
                            return (
                                <TouchableOpacity
                                    key={station.id}
                                    onPress={() => setActiveTabStationId(station.id)}
                                    style={[
                                        styles.tabPill,
                                        isViewed && { backgroundColor: station.color, borderColor: station.color },
                                        isCurrentTask && !isViewed && { borderColor: station.color, borderStyle: 'dotted' }
                                    ]}
                                >
                                    <Text style={[
                                        styles.tabPillText,
                                        isViewed && styles.tabPillTextActive,
                                        isCurrentTask && !isViewed && { color: station.color }
                                    ]}>
                                        {station.name}
                                        {isCurrentTask && " 📍"}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                <View style={styles.middleMainLayout}>
                    {/* Character Column */}
                    <View style={styles.characterColumn}>
                        <View style={styles.speechBubble}>
                            <View style={styles.speechBubbleTail} />
                            <Text style={styles.speechText} numberOfLines={4} ellipsizeMode="tail">
                                {activeTabStationId === 'prep' && itemsOnCounter.length > 0
                                    ? `Great! You've gathered: ${itemsOnCounter.join(', ')}. Now follow the steps!`
                                    : currentCheckpoint.instruction}
                            </Text>
                        </View>
                        <Image source={chefKittyImg} style={styles.kittyImage} />
                    </View>

                    {/* Illustration Column */}
                    <View style={styles.displayColumn}>
                        <View style={[
                            styles.stationDisplayBox,
                            { borderColor: STATIONS.find(s => s.id === activeTabStationId)?.color + '40' }
                        ]}>
                            {/* Inner Box with subtle background */}
                            <View style={[
                                styles.stationDisplayInner,
                                { backgroundColor: (STATIONS.find(s => s.id === activeTabStationId)?.color || '#fff') + '10' }
                            ]}>
                                {activeTabStationId === 'sink' ? (
                                    <View style={styles.sinkInterface}>
                                        <Image source={STATIONS.find(s => s.id === 'sink')?.image} style={styles.choppingStationImage} />
                                        <Animated.View style={[styles.waterEffect, { opacity: waterOpacity }]}>
                                            <MaterialCommunityIcons name="water" size={32} color="#60A5FA" />
                                            <MaterialCommunityIcons name="water" size={24} color="#93C5FD" />
                                        </Animated.View>
                                        <TouchableOpacity style={styles.washButton} onPress={handleWash}>
                                            <Text style={styles.chopButtonText}>WASH INGREDIENTS</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : activeTabStationId === 'chopping' && itemsOnCounter.includes('tomato') ? (
                                    <View style={styles.choppingInterface}>
                                        <View style={styles.choppingItemRow}>
                                            <Image
                                                source={isTomatoChopped ? FRIDGE_ITEMS.find(f => f.id === 'tomato')?.choppedImage : FRIDGE_ITEMS.find(f => f.id === 'tomato')?.image}
                                                style={styles.choppingStationImage}
                                            />
                                            <Animated.View style={[
                                                styles.knifeContainer3D,
                                                {
                                                    transform: [
                                                        { translateX: knifePos.x },
                                                        { translateY: knifePos.y },
                                                        {
                                                            rotate: knifeRotation.interpolate({
                                                                inputRange: [-180, 180],
                                                                outputRange: ['-180deg', '180deg']
                                                            })
                                                        }
                                                    ]
                                                }
                                            ]}>
                                                <Image source={KNIFE_IMAGE} style={styles.knifeImage3D} />
                                            </Animated.View>
                                        </View>
                                        {!isTomatoChopped && (
                                            <TouchableOpacity style={styles.chopButton} onPress={handleChop}>
                                                <Text style={styles.chopButtonText}>PRESS TO CHOP</Text>
                                            </TouchableOpacity>
                                        )}
                                        {isTomatoChopped && (
                                            <View style={styles.choppedSuccess}>
                                                <Feather name="check" size={14} color="#10B981" />
                                                <Text style={styles.choppedSuccessText}>PERFECTLY CHOPPED!</Text>
                                            </View>
                                        )}
                                    </View>
                                ) : (
                                    <>
                                        <MaterialCommunityIcons
                                            name={STATIONS.find(s => s.id === activeTabStationId)?.icon as any}
                                            size={48}
                                            color={STATIONS.find(s => s.id === activeTabStationId)?.color}
                                        />
                                        <Text style={styles.displayStationName}>
                                            {STATIONS.find(s => s.id === activeTabStationId)?.name}
                                        </Text>
                                    </>
                                )}

                                {activeTabStationId === 'prep' && itemsOnCounter.length > 0 && (
                                    <View style={styles.counterVisualGrid}>
                                        {itemsOnCounter.map((itemId) => {
                                            const item = FRIDGE_ITEMS.find(f => f.id === itemId);
                                            if (!item) return null;
                                            return (
                                                <View key={itemId} style={[styles.visualIngredientBase, { backgroundColor: item.color + '20' }]}>
                                                    <MaterialCommunityIcons name={item.icon as any} size={20} color={item.color} />
                                                    {itemId === 'tomato' && isTomatoChopped && (
                                                        <View style={styles.choppedIconBadge}>
                                                            <Feather name="check" size={8} color="#fff" />
                                                        </View>
                                                    )}
                                                </View>
                                            );
                                        })}
                                    </View>
                                )}

                                <View style={styles.stationBadge}>
                                    <Text style={[styles.stationBadgeText, { color: STATIONS.find(s => s.id === activeTabStationId)?.color }]}>
                                        {activeTabStationId === currentCheckpoint.stationId ? 'ACTIVE TASK' : 'IDLE'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.stepCounterContainer}>
                            <Text style={styles.stepCounterText}>Step {currentStep + 1} of 11</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Bottom Section: Kitchen Environment Grid */}
            <View style={styles.kitchenArea}>
                {/* Fridge and Shelves */}
                <View style={styles.propsContainer}>
                    <TouchableOpacity
                        style={styles.leftFridge}
                        onPress={toggleFridge}
                        activeOpacity={0.8}
                    >
                        <Image source={FRIDGE_3D_IMAGE} style={styles.fridgeImage3D} />
                        <View style={styles.fridgePulse} />
                    </TouchableOpacity>
                    <View style={styles.rightShelves}>
                        {[1, 2].map(i => (
                            <View key={i} style={styles.shelfRow}>
                                <View style={styles.shelfPlate} />
                                <View style={styles.shelfItems}>
                                    <MaterialCommunityIcons name="pot-steam" size={20} color="rgba(255,255,255,0.4)" />
                                    <MaterialCommunityIcons name="pan" size={20} color="rgba(255,255,255,0.4)" />
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Stations Grid */}
                <View style={styles.gridSection}>
                    <View style={styles.stationsGrid}>
                        {/* Utensils Row (Small, Scrollable) */}
                        <View style={styles.utensilsRowContainer}>
                            <ScrollView
                                ref={utensilsScrollRef}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.utensilsScroll}
                            >
                                {STATIONS.filter(s => s.category === 'utensil').map(station => (
                                    <KitchenStationBox
                                        key={station.id}
                                        station={station}
                                        isActive={currentCheckpoint.stationId === station.id}
                                        onPress={handleNext}
                                    />
                                ))}
                            </ScrollView>
                        </View>

                        {/* Machines Row (Big, Scrollable) */}
                        <View style={styles.machinesRowContainer}>
                            <ScrollView
                                ref={machinesScrollRef}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.machinesScroll}
                            >
                                {STATIONS.filter(s => s.category === 'machine').map(station => (
                                    <KitchenStationBox
                                        key={station.id}
                                        station={station}
                                        isActive={currentCheckpoint.stationId === station.id}
                                        onPress={handleNext}
                                    />
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </View>

            {/* Fridge Modal */}
            <Modal
                visible={isFridgeOpen}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsFridgeOpen(false)}
            >
                <TouchableWithoutFeedback onPress={() => setIsFridgeOpen(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.fridgePopup}>
                                <View style={styles.fridgeInside}>
                                    <View style={styles.fridgeLight} />
                                    {/* Shelf 1 */}
                                    <View style={styles.fridgeShelfInterior}>
                                        <View style={styles.fridgeItemContainer}>
                                            {FRIDGE_ITEMS.slice(0, 3).map((item) => (
                                                <TouchableOpacity
                                                    key={item.id}
                                                    style={styles.fridgeItem3D}
                                                    onPress={() => handleFridgeItemPress(item.id)}
                                                >
                                                    <View style={styles.itemImageWrapper}>
                                                        {item.image ? (
                                                            <Image source={item.image} style={styles.fridgeItemSprite} />
                                                        ) : (
                                                            <View style={[styles.fridgeItemIcon, { backgroundColor: item.color + '20' }]}>
                                                                <MaterialCommunityIcons name={item.icon as any} size={28} color={item.color} />
                                                            </View>
                                                        )}
                                                    </View>
                                                    <Text style={styles.fridgeItemLabel}>{item.name}</Text>
                                                    {itemsOnCounter.includes(item.id) && (
                                                        <View style={styles.itemCheckedSecondary}>
                                                            <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                                                        </View>
                                                    )}
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                        <View style={styles.physicalShelf} />
                                    </View>

                                    {/* Shelf 2 */}
                                    <View style={styles.fridgeShelfInterior}>
                                        <View style={styles.fridgeItemContainer}>
                                            {FRIDGE_ITEMS.slice(3).map((item) => (
                                                <TouchableOpacity
                                                    key={item.id}
                                                    style={styles.fridgeItem3D}
                                                    onPress={() => handleFridgeItemPress(item.id)}
                                                >
                                                    <View style={styles.itemImageWrapper}>
                                                        {item.image ? (
                                                            <Image source={item.image} style={styles.fridgeItemSprite} />
                                                        ) : (
                                                            <View style={[styles.fridgeItemIcon, { backgroundColor: item.color + '20' }]}>
                                                                <MaterialCommunityIcons name={item.icon as any} size={28} color={item.color} />
                                                            </View>
                                                        )}
                                                    </View>
                                                    <Text style={styles.fridgeItemLabel}>{item.name}</Text>
                                                    {itemsOnCounter.includes(item.id) && (
                                                        <View style={styles.itemCheckedSecondary}>
                                                            <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                                                        </View>
                                                    )}
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                        <View style={styles.physicalShelf} />
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E4040',
    },
    videoSection: {
        height: height * 0.3,
        backgroundColor: '#000',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.sm,
        paddingTop: 4,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    headerTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 2,
    },
    backButton: {
        padding: spacing.sm,
    },
    video: {
        width: '100%',
        height: '100%',
    },
    videoMock: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoText: {
        color: '#fff',
    },
    progressBarBackground: {
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#FACC15',
    },

    // Instructions & Tabs
    instructionSection: {
        height: height * 0.32, // Balanced height
        backgroundColor: '#F0F9F9',
        paddingTop: spacing.sm,
        paddingHorizontal: spacing.sm,
        zIndex: 5,
        ...shadow.medium,
    },
    tabsHeader: {
        marginBottom: 8,
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.02)',
    },
    tabsScrollContent: {
        paddingHorizontal: 4,
        gap: 8,
    },
    tabPill: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
    },
    tabPillText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#64748B',
    },
    tabPillTextActive: {
        color: '#fff',
    },
    middleMainLayout: {
        flex: 1,
        flexDirection: 'row',
        gap: 8,
    },
    characterColumn: {
        flex: 0.45,
        justifyContent: 'center', // Center to fill the gap better
        alignItems: 'center',
    },
    displayColumn: {
        flex: 0.55,
        justifyContent: 'center',
    },
    stationDisplayBox: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 2,
        padding: 4,
        ...shadow.soft,
    },
    stationDisplayInner: {
        flex: 1,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    displayStationName: {
        fontSize: 10,
        fontWeight: '700',
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    stepCounterContainer: {
        marginTop: 4,
        alignItems: 'flex-end',
    },
    stepCounterText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#94A3B8',
    },
    kittyImage: {
        width: 95, // Larger kitty
        height: 95,
        resizeMode: 'contain',
    },
    speechBubble: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 10,
        marginBottom: 8,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        ...shadow.soft,
        width: '100%',
    },
    speechBubbleTail: {
        position: 'absolute',
        bottom: -6,
        left: '20%',
        width: 12,
        height: 12,
        backgroundColor: '#fff',
        borderRightWidth: 1.5,
        borderBottomWidth: 1.5,
        borderColor: '#E2E8F0',
        transform: [{ rotate: '45deg' }],
        zIndex: -1,
    },
    speechText: {
        fontSize: 12, // Premium, readable size
        fontWeight: '600',
        color: '#1E293B',
        lineHeight: 16,
        textAlign: 'center',
    },
    stationBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255,255,255,0.8)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    stationBadgeText: {
        fontSize: 8,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },

    // Kitchen Area
    kitchenArea: {
        flex: 1,
        backgroundColor: '#264E4E',
        padding: spacing.md,
    },
    propsContainer: {
        flexDirection: 'row',
        height: 60,
        marginBottom: 8,
    },
    leftFridge: {
        width: 70,
        height: 70,
        backgroundColor: 'transparent',
        borderRadius: 8,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fridgeImage3D: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    fridgeHandle: {
        position: 'absolute',
        right: 6,
        top: 20,
        bottom: 20,
        width: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 2,
    },
    fridgeShelves: {
        flex: 1,
        justifyContent: 'space-around',
    },
    fridgeShelf: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    rightShelves: {
        flex: 1,
        paddingLeft: 20,
        justifyContent: 'space-around',
    },
    shelfRow: {
        height: 24,
        justifyContent: 'flex-end',
    },
    shelfPlate: {
        height: 3,
        backgroundColor: '#1E4040',
        borderRadius: 2,
    },
    shelfItems: {
        flexDirection: 'row',
        gap: 15,
        position: 'absolute',
        bottom: 4,
        left: 10,
    },

    // Grid
    gridSection: {
        flex: 1,
    },
    stationsGrid: {
        gap: 0, // Tighten gap as padding handles highlight clearance
    },
    utensilsRowContainer: {
        gap: 8,
    },
    utensilsScroll: {
        flexDirection: 'row',
        gap: 12,
        paddingRight: 20,
        paddingVertical: 8, // Room for scale and shadows
    },
    machinesRowContainer: {
        gap: 8,
    },
    machinesScroll: {
        flexDirection: 'row',
        gap: 12,
        paddingRight: 20,
        paddingVertical: 8, // Slightly tighter vertical padding
    },
    rowLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 1.5,
    },
    machineBox: {
        width: 100, // Fixed width for big buttons in scrollable row
        height: 100,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    utensilBox: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    stationIconContainer: {
        width: '65%',
        height: '65%',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    glowRing: {
        position: 'absolute',
        top: -4,
        left: -4,
        right: -4,
        bottom: -4,
        borderRadius: 16,
        borderWidth: 2,
    },
    fridgePulse: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderWidth: 2,
        borderColor: '#60A5FA',
        borderRadius: 8,
        opacity: 0.3,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fridgePopup: {
        width: width * 0.9,
        height: height * 0.6,
        backgroundColor: '#F8FAFC',
        borderRadius: 32,
        borderWidth: 8,
        borderColor: '#E2E8F0',
        padding: 0,
        ...shadow.hard,
        overflow: 'hidden',
    },
    fridgeInside: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 40,
        gap: 20,
    },
    fridgeLight: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
    },
    fridgeShelfInterior: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    fridgeItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        paddingBottom: 4,
    },
    fridgeItem3D: {
        alignItems: 'center',
        width: '30%',
    },
    itemImageWrapper: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fridgeItemSprite: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    fridgeItemLabel: {
        fontSize: 9,
        fontWeight: '900',
        color: '#64748B',
        marginTop: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    fridgeItemIcon: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    physicalShelf: {
        height: 12,
        backgroundColor: '#E2E8F0',
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    itemCheckedSecondary: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    itemCheckedBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    stationImage: {
        width: '120%',
        height: '120%',
        resizeMode: 'contain',
    },
    choppingStationImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    knifeContainer3D: {
        position: 'absolute',
        right: -20,
        top: 0,
    },
    knifeImage3D: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
    },
    sinkInterface: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    waterEffect: {
        position: 'absolute',
        top: 20,
        alignItems: 'center',
    },
    washButton: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 10,
        ...shadow.soft,
    },
    chopButton: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        ...shadow.soft,
    },
    chopButtonText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    choppedSuccess: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#F0FDF4',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    choppedSuccessText: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#059669',
    },
    counterVisualGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 10,
        justifyContent: 'center',
    },
    visualIngredientBase: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    choppedIconBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#10B981',
        borderRadius: 6,
        padding: 1,
    },
    choppingInterface: {
        alignItems: 'center',
        gap: 12,
    },
    choppingItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
});

export default RecipeSimulationScreen;
