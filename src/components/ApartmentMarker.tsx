import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { Apartment } from '@/constants/dummyApartments';
import { Colors } from '@/constants/colors';

interface Props {
  apartment: Apartment;
  isSelected: boolean;
  onPress: (apartment: Apartment) => void;
}

export const ApartmentMarker: React.FC<Props> = ({ apartment, isSelected, onPress }) => {
  const backgroundColor = apartment.isBrokerage
    ? Colors.markerBrokerage
    : isSelected
    ? Colors.markerSelected
    : Colors.markerDefault;

  return (
    <Marker
      coordinate={apartment.coordinate}
      onPress={() => onPress(apartment)}
      tracksViewChanges={isSelected}
    >
      <View style={[styles.bubble, { backgroundColor }, isSelected && styles.bubbleSelected]}>
        <Text style={styles.price}>₪{(apartment.price / 1000).toFixed(1)}k</Text>
      </View>
      <View style={[styles.arrow, { borderTopColor: backgroundColor }]} />
    </Marker>
  );
};

const styles = StyleSheet.create({
  bubble: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  bubbleSelected: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    shadowOpacity: 0.4,
    elevation: 6,
  },
  price: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    alignSelf: 'center',
  },
});
