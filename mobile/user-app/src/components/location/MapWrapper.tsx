import React, { forwardRef, useImperativeHandle } from 'react';
import { Platform, View, Text } from 'react-native';

export interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

const MapViewWeb = forwardRef((props: any, ref) => {
    useImperativeHandle(ref, () => ({
        animateToRegion: () => {}
    }));
    return (
        <View style={[{ backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' }, props.style]}>
            <Text style={{ fontSize: 13, color: '#475569', fontWeight: '600' }}>Interactive Map - Mobile Only</Text>
            <Text style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Please use the search bar above to locate your address.</Text>
            {props.children}
        </View>
    );
});

const MarkerWeb = (props: any) => <View {...props} />;

let MapViewExport: any;
let MarkerExport: any;

if (Platform.OS === 'web') {
    MapViewExport = MapViewWeb;
    MarkerExport = MarkerWeb;
} else {
    try {
        const Map = require('react-native-maps');
        MapViewExport = Map.default;
        MarkerExport = Map.Marker;
    } catch (e) {
        MapViewExport = MapViewWeb;
        MarkerExport = MarkerWeb;
    }
}

export { MapViewExport as MapView, MarkerExport as Marker };
