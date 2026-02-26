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
            // Remove key if present in query to avoid duplication/override
            const { key, ...params } = query;
            const response = await axios.get(`${this.baseUrl}/place/autocomplete/json`, {
                params: {
                    ...params,
                    key: this.googleMapsApiKey,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Autocomplete error:', error);
            // Return empty results or similar structure to not break frontend
            throw new HttpException('Failed to fetch autocomplete data', HttpStatus.BAD_GATEWAY);
        }
    }

    async placeDetails(query: Record<string, any>) {
        if (!this.googleMapsApiKey) {
            throw new HttpException('Google Maps API key not configured', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        try {
            const { key, ...params } = query;
            const response = await axios.get(`${this.baseUrl}/place/details/json`, {
                params: {
                    ...params,
                    key: this.googleMapsApiKey,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Place details error:', error);
            throw new HttpException('Failed to fetch place details', HttpStatus.BAD_GATEWAY);
        }
    }
}
