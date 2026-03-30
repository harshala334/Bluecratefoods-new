import React from 'react';
import { View, Text } from 'react-native';

export const MapView = React.forwardRef((props: any, ref: any) => {
  return (
    <View {...props} style={[props.style, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#e0e0e0' }]}>
      <Text style={{ color: '#666' }}>Map is not available on the web version yet.</Text>
      {props.children}
    </View>
  );
});

export const Marker = (props: any) => <View {...props} />;
export type Region = any;
