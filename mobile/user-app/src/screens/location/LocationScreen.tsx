import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { MapView, Marker, Region } from '../../components/location/MapWrapper';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { API_CONFIG } from '../../constants/config';
import { colors } from '../../constants/colors';
import { spacing, borderRadius, shadow } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { Feather } from '@expo/vector-icons';
import { useLocationStore } from '../../stores/locationStore';
import * as Location from 'expo-location';
import { AddressDetailModal } from '../../components/location/AddressDetailModal';
import { useAuthStore } from '../../stores/authStore';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export const LocationScreen = ({ navigation }: any) => {
    const { setLocation, fetchCurrentLocation, isLoading, location } = useLocationStore();
    const mapRef = useRef<MapView>(null);
    const [region, setRegion] = useState<Region>({
        latitude: 22.5726,
        longitude: 88.3639,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    });
    const [addressText, setAddressText] = useState(location);
    const [isMapReady, setIsMapReady] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [geocodeDetails, setGeocodeDetails] = useState<any>(null);
    const { addAddress } = useAuthStore();

    // Initial location fetch
    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status === 'granted') {
                    const loc = await Location.getCurrentPositionAsync({});
                    const newRegion = {
                        latitude: loc.coords.latitude,
                        longitude: loc.coords.longitude,
                        latitudeDelta: 0.005, // Zoom in closer
                        longitudeDelta: 0.005 * ASPECT_RATIO,
                    };
                    setRegion(newRegion);
                    mapRef.current?.animateToRegion(newRegion, 1000);

                    // Reverse geocode initial
                    const address = await reverseGeocode(loc.coords.latitude, loc.coords.longitude);
                    setAddressText(address);
                }
            } catch (error) {
                console.log('Error getting location', error);
            }
        })();
    }, []);

    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const geocodeResult = await Location.reverseGeocodeAsync({
                latitude: lat,
                longitude: lng,
            });
            if (geocodeResult && geocodeResult.length > 0) {
                const address = geocodeResult[0];
                setGeocodeDetails(address);
                const parts = [
                    address.street || address.name,
                    address.district || address.subregion || address.city,
                    address.city || address.region
                ].filter(Boolean);
                return parts.slice(0, 2).join(', ') || 'Unknown Location';
            }
        } catch (error) {
            console.error('Reverse geocode error:', error);
        }
        return 'Unknown Location';
    };

    const handleRegionChangeComplete = async (newRegion: Region) => {
        // Update marker text based on center
        // Debounce this ideally, but for now direct call
        const addr = await reverseGeocode(newRegion.latitude, newRegion.longitude);
        setAddressText(addr);
        setRegion(newRegion);
    };

    const handleConfirm = () => {
        setShowDetailModal(true);
    };

    const handleSaveAddress = async (details: any) => {
        try {
            const fullAddress = `${details.houseNo}, ${details.floor ? details.floor + ', ' : ''}${details.landmark ? details.landmark + ', ' : ''}${addressText}`;
            
            await addAddress({
                label: details.label,
                addressLine1: `${details.houseNo}${details.floor ? ', ' + details.floor : ''}`,
                addressLine2: details.landmark || '',
                city: geocodeDetails?.city || '', 
                state: geocodeDetails?.region || '', 
                zipCode: geocodeDetails?.postalCode || '',
                country: geocodeDetails?.country || 'India',
                isPrimary: true,
                isDefault: true,
                latitude: region.latitude,
                longitude: region.longitude
            });

            setLocation(fullAddress);
            setShowDetailModal(false);
            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                navigation.navigate('Main');
            }
        } catch (error) {
            console.error('Failed to save address:', error);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header / Search Bar Overlay */}
            <View style={styles.searchContainer}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => {
                        if (navigation.canGoBack()) {
                            navigation.goBack();
                        } else {
                            navigation.navigate('Main');
                        }
                    }}
                >
                    <Feather name="arrow-left" size={24} color={colors.text.primary} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <GooglePlacesAutocomplete
                        placeholder='Search for area, street...'
                        onPress={(data, details = null) => {
                            console.log('Place Selected:', data.description);
                            // 'details' is provided when fetchDetails = true
                            if (details && details.geometry && details.geometry.location) {
                                const { lat, lng } = details.geometry.location;
                                console.log('Place Coordinates:', lat, lng);
                                const newRegion = {
                                    latitude: lat,
                                    longitude: lng,
                                    latitudeDelta: 0.005,
                                    longitudeDelta: 0.005 * ASPECT_RATIO,
                                };
                                mapRef.current?.animateToRegion(newRegion, 1000);
                                setRegion(newRegion);
                                setAddressText(data.description); 
                            } else {
                                console.warn('No details available for selected place');
                            }
                        }}
                        query={{
                            key: 'REQUIRED-BUT-PROXIED', // Library requires a key string to start requests
                            language: 'en',
                        }}
                        requestUrl={{
                            url: API_CONFIG.ENDPOINTS.LOCATION, // Points to /location -> appends /place/autocomplete/json
                            useOnPlatform: 'all',
                        }}
                        fetchDetails={true}
                        styles={{
                            textInputContainer: {
                                backgroundColor: 'transparent',
                            },
                            textInput: {
                                height: 44,
                                color: colors.text.primary,
                                fontSize: 16,
                                backgroundColor: colors.white,
                                borderRadius: borderRadius.lg,
                                ...shadow.soft,
                            },
                            listView: {
                                position: 'absolute',
                                top: 50,
                                zIndex: 1000,
                                backgroundColor: colors.white,
                                borderRadius: borderRadius.md,
                                ...shadow.medium,
                            }
                        }}
                        onFail={(error) => console.log('Autocomplete Error:', error)}
                        enablePoweredByContainer={false}
                    />
                </View>
            </View>

            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={region}
                onRegionChangeComplete={handleRegionChangeComplete}
                showsUserLocation={true}
                showsMyLocationButton={false} // We'll make a custom one
                onMapReady={() => setIsMapReady(true)}
            >
                {/* 
                  We don't use a Marker here for the center because we want the pin 
                  to stay fixed while the map moves underneath (Uber style). 
                  So we render a View absolutely positioned in the center.
                */}
            </MapView>

            {/* Center Pin */}
            <View style={styles.centerMarkerContainer}>
                <Feather name="map-pin" size={40} color={colors.primary[600]} style={{ marginBottom: 40 }} />
            </View>

            {/* Bottom Card */}
            <View style={styles.bottomCard}>
                <Text style={styles.label}>Select Location</Text>
                <View style={styles.locationRow}>
                    <Feather name="map-pin" size={20} color={colors.primary[600]} />
                    <Text style={styles.addressText} numberOfLines={2}>{addressText}</Text>
                </View>

                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleConfirm}
                    activeOpacity={0.8}
                >
                    <Text style={styles.confirmButtonText}>Confirm Location</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.myLocationButton}
                    onPress={async () => {
                        const { status } = await Location.requestForegroundPermissionsAsync();
                        if (status === 'granted') {
                            const loc = await Location.getCurrentPositionAsync({});
                            const newRegion = {
                                latitude: loc.coords.latitude,
                                longitude: loc.coords.longitude,
                                latitudeDelta: 0.005,
                                longitudeDelta: 0.005 * ASPECT_RATIO,
                            };
                            mapRef.current?.animateToRegion(newRegion, 1000);
                        }
                    }}
                >
                    <Feather name="crosshair" size={24} color={colors.gray[700]} />
                </TouchableOpacity>
            </View>

            <AddressDetailModal
                visible={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                onSave={handleSaveAddress}
                baseAddress={addressText}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    searchContainer: {
        position: 'absolute',
        top: 50, // Safe area
        left: 20,
        right: 20,
        zIndex: 30,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    backButton: {
        backgroundColor: colors.white,
        padding: 10,
        borderRadius: borderRadius.lg,
        ...shadow.soft,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerMarkerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5,
        pointerEvents: 'none', // Allow touches to pass through to map
    },
    bottomCard: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.white,
        borderTopLeftRadius: borderRadius['2xl'],
        borderTopRightRadius: borderRadius['2xl'],
        padding: spacing.xl,
        ...shadow.medium,
        zIndex: 20,
    },
    label: {
        fontSize: typography.fontSize.sm,
        color: colors.gray[500],
        marginBottom: spacing.sm,
        fontFamily: typography.fontFamily.medium,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        marginBottom: spacing.xl,
        backgroundColor: colors.gray[50],
        padding: spacing.md,
        borderRadius: borderRadius.lg,
    },
    addressText: {
        flex: 1,
        fontSize: typography.fontSize.base,
        color: colors.text.primary,
        fontFamily: typography.fontFamily.medium,
    },
    confirmButton: {
        backgroundColor: colors.primary[500],
        paddingVertical: spacing.md,
        borderRadius: borderRadius.xl,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: colors.white,
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.fontSize.lg,
    },
    myLocationButton: {
        position: 'absolute',
        top: -60,
        right: 20,
        backgroundColor: colors.white,
        padding: 12,
        borderRadius: 30,
        ...shadow.medium,
    },
});

export default LocationScreen;
