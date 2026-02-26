import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
    constructor(private readonly locationService: LocationService) { }

    @Get('geocode')
    async geocode(@Query('address') address: string) {
        if (!address) {
            throw new HttpException('Address is required', HttpStatus.BAD_REQUEST);
        }
        return this.locationService.geocode(address);
    }

    @Get('reverse-geocode')
    async reverseGeocode(
        @Query('lat') lat: string,
        @Query('lng') lng: string
    ) {
        if (!lat || !lng) {
            throw new HttpException('Latitude and longitude are required', HttpStatus.BAD_REQUEST);
        }
        return this.locationService.reverseGeocode(parseFloat(lat), parseFloat(lng));
    }

    @Get('place/autocomplete/json')
    async autocomplete(@Query() query: Record<string, any>) {
        console.log('Autocomplete request:', query);
        if (!query.input) {
            throw new HttpException('Input is required', HttpStatus.BAD_REQUEST);
        }
        return this.locationService.autocomplete(query);
    }

    @Get('place/details/json')
    async placeDetails(@Query() query: Record<string, any>) {
        console.log('Place Details request:', query);
        if (!query.place_id && !query.placeid) {
            throw new HttpException('Place ID is required', HttpStatus.BAD_REQUEST);
        }
        return this.locationService.placeDetails(query);
    }
}
