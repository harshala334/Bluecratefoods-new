import { create } from 'zustand';
import * as Location from 'expo-location';

interface LocationState {
    location: string;
    isLoading: boolean;
    errorMsg: string | null;
    setLocation: (location: string) => void;
    fetchCurrentLocation: () => Promise<void>;
}

export const useLocationStore = create<LocationState>((set) => ({
    location: 'NYC', // Default location
    isLoading: false,
    errorMsg: null,
    setLocation: (location) => set({ location }),
    fetchCurrentLocation: async () => {
        set({ isLoading: true, errorMsg: null });
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                set({ errorMsg: 'Permission to access location was denied', isLoading: false });
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const reverseGeocode = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });

            if (reverseGeocode && reverseGeocode.length > 0) {
                const address = reverseGeocode[0];
                const city = address.city || address.subregion || address.region;
                const region = address.region || address.country;
                // Format: "City, Region" or just "City"
                const formattedLocation = region ? `${city}, ${region}` : city || 'Unknown Location';

                set({ location: formattedLocation, isLoading: false });
            } else {
                set({ location: 'Unknown Location', isLoading: false });
            }

        } catch (error) {
            set({ errorMsg: 'Error fetching location', isLoading: false });
            console.error(error);
        }
    }
}));
