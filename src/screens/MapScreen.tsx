import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import { ApartmentMarker } from '@/components/ApartmentMarker';
import { ApartmentCard } from '@/components/ApartmentCard';
import { DUMMY_APARTMENTS, TEL_AVIV_CENTER, Apartment } from '@/constants/dummyApartments';
import { Colors } from '@/constants/colors';

export const MapScreen: React.FC = () => {
  const { t } = useTranslation();
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const mapRef = useRef<MapView>(null);

  const handleMarkerPress = (apartment: Apartment) => {
    setSelectedApartment(apartment);
    mapRef.current?.animateToRegion(
      {
        ...apartment.coordinate,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      400
    );
  };

  const handleMapPress = () => {
    setSelectedApartment(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('map.title')}</Text>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.markerDefault }]} />
            <Text style={styles.legendText}>ישיר</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.markerBrokerage }]} />
            <Text style={styles.legendText}>תיווך</Text>
          </View>
        </View>
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'web' ? undefined : PROVIDER_GOOGLE}
        initialRegion={TEL_AVIV_CENTER}
        onPress={handleMapPress}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {DUMMY_APARTMENTS.map((apt) => (
          <ApartmentMarker
            key={apt.id}
            apartment={apt}
            isSelected={selectedApartment?.id === apt.id}
            onPress={handleMarkerPress}
          />
        ))}
      </MapView>

      <View style={styles.countBadge}>
        <Text style={styles.countText}>{DUMMY_APARTMENTS.length} דירות באזור</Text>
      </View>

      {selectedApartment && (
        <ApartmentCard
          apartment={selectedApartment}
          onClose={() => setSelectedApartment(null)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'right',
  },
  legend: {
    flexDirection: 'row-reverse',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  map: {
    flex: 1,
  },
  countBadge: {
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  countText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
});
