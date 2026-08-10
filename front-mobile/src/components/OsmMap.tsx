import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, UrlTile, MapPressEvent } from 'react-native-maps';
import { LocationCoords } from '../types';

type Props = {
  coords: LocationCoords;
  title?: string;
  description?: string;
  height?: number;
  interactive?: boolean;
  onSelectCoords?: (coords: LocationCoords) => void;
};

export default function OsmMap({
  coords,
  title = 'Localização',
  description,
  height = 220,
  interactive = false,
  onSelectCoords,
}: Props) {
  const handleMapPress = (e: MapPressEvent) => {
    if (onSelectCoords) {
      onSelectCoords(e.nativeEvent.coordinate);
    }
  };

  return (
    <View style={[styles.container, { height }]}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}
        region={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}
        scrollEnabled={interactive}
        zoomEnabled={interactive}
        pitchEnabled={interactive}
        rotateEnabled={false}
        onPress={interactive ? handleMapPress : undefined}
      >
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
        <Marker
          coordinate={{
            latitude: coords.latitude,
            longitude: coords.longitude,
          }}
          title={title}
          description={description}
          draggable={interactive}
          onDragEnd={
            interactive && onSelectCoords
              ? (e) => onSelectCoords(e.nativeEvent.coordinate)
              : undefined
          }
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#EAEAEA',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
