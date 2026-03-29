import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LocationService {
    private readonly googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    private readonly baseUrl = 'https://maps.googleapis.com/maps/api';

    async geocode(address: string) {
        if (!this.googleMapsApiKey) {
            throw new HttpException('Google Maps API key not configured', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        try {
            const response = await axios.get(`${this.baseUrl}/geocode/json`, {
                params: {
                    address: address,
                    key: this.googleMapsApiKey,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Geocoding error:', error);
            throw new HttpException('Failed to fetch geocoding data', HttpStatus.BAD_GATEWAY);
        }
    }

    async reverseGeocode(lat: number, lng: number) {
        if (!this.googleMapsApiKey) {
            throw new HttpException('Google Maps API key not configured', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        try {
            const response = await axios.get(`${this.baseUrl}/geocode/json`, {
                params: {
                    latlng: `${lat},${lng}`,
                    key: this.googleMapsApiKey,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            throw new HttpException('Failed to fetch reverse geocoding data', HttpStatus.BAD_GATEWAY);
        }
    }

    async autocomplete(query: Record<string, any>) {
        if (!this.googleMapsApiKey) {
            throw new HttpException('Google Maps API key not configured', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        try {
            const { input, language, ...rest } = query;
            
            // Try Google Places API (New) first as it's the modern standard
            try {
                const response = await axios.post(
                    'https://places.googleapis.com/v1/places:autocomplete',
                    {
                        input: input,
                        languageCode: language || 'en',
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Goog-Api-Key': this.googleMapsApiKey,
                        },
                    }
                );

                const predictions = (response.data.suggestions || []).map((s: any) => {
                    const p = s.placePrediction;
                    if (!p) return null;
                    return {
                        description: p.text?.text || '',
                        place_id: p.placeId,
                        structured_formatting: {
                            main_text: p.structuredFormat?.mainText?.text || '',
                            secondary_text: p.structuredFormat?.secondaryText?.text || '',
                        },
                        types: p.types || [],
                    };
                }).filter(Boolean);

                return {
                    predictions,
                    status: predictions.length > 0 ? 'OK' : 'ZERO_RESULTS',
                };
            } catch (newApiError: any) {
                // If New API is disabled (403), fallback to Legacy API
                if (newApiError.response?.status === 403 || newApiError.response?.status === 404) {
                    console.warn('Places API (New) disabled/not found, falling back to Legacy API...');
                    const legacyResponse = await axios.get(`${this.baseUrl}/place/autocomplete/json`, {
                        params: {
                            ...query,
                            key: this.googleMapsApiKey,
                        },
                    });
                    return legacyResponse.data;
                }
                throw newApiError;
            }
        } catch (error: any) {
            console.error('Autocomplete error:', error.response?.data || error.message);
            // If it's a 403 from legacy too, provide the enablement link
            if (error.response?.data?.status === 'REQUEST_DENIED') {
                console.error('ACTION REQUIRED: Please enable "Places API" or "Places API (New)" in Google Cloud Console.');
            }
            return { predictions: [], status: 'ERROR' };
        }
    }

    async placeDetails(query: Record<string, any>) {
        if (!this.googleMapsApiKey) {
            throw new HttpException('Google Maps API key not configured', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        try {
            const placeId = query.place_id || query.placeid;
            
            // Try Google Places API (New)
            try {
                const response = await axios.get(
                    `https://places.googleapis.com/v1/places/${placeId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Goog-Api-Key': this.googleMapsApiKey,
                            'X-Goog-FieldMask': 'id,displayName,formattedAddress,location',
                        },
                    }
                );

                const data = response.data;
                console.log('Successfully fetched details from New API');

                return {
                    result: {
                        place_id: data.id,
                        formatted_address: data.formattedAddress,
                        geometry: {
                            location: {
                                lat: data.location?.latitude,
                                lng: data.location?.longitude,
                            },
                        },
                        name: data.displayName?.text,
                    },
                    status: 'OK',
                };
            } catch (newApiError: any) {
                // Fallback to Legacy API
                console.warn('Place Details New API failed, falling back to Legacy API...');
                const legacyResponse = await axios.get(`${this.baseUrl}/place/details/json`, {
                    params: {
                        ...query,
                        key: this.googleMapsApiKey,
                    },
                });
                return legacyResponse.data;
            }
        } catch (error: any) {
            console.error('Place details error:', error.response?.data || error.message);
            throw new HttpException('Failed to fetch place details', HttpStatus.BAD_GATEWAY);
        }
    }
}
