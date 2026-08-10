import * as Location from 'expo-location';
import { LocationCoords } from '../types';

const DEFAULT_FALLBACK_COORDS: LocationCoords = {
  latitude: -23.55052,
  longitude: -46.633308,
};

export async function requestLocationPermission(): Promise<boolean> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Erro ao solicitar permissão de localização:', error);
    return false;
  }
}

export async function getCurrentDeviceLocation(): Promise<LocationCoords> {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      return DEFAULT_FALLBACK_COORDS;
    }

    const lastKnown = await Location.getLastKnownPositionAsync({});
    if (lastKnown) {
      return {
        latitude: lastKnown.coords.latitude,
        longitude: lastKnown.coords.longitude,
      };
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Low,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.warn('GPS não fixou sinal imediato no emulador/aparelho, usando coordenadas padrão:', error);
    return DEFAULT_FALLBACK_COORDS;
  }
}

/**
 * Converte Coordenadas (Lat/Long) em Endereço legível (Rua, Número, Bairro, Cidade)
 */
export async function reverseGeocodeCoords(coords: LocationCoords): Promise<string | null> {
  try {
    const results = await Location.reverseGeocodeAsync(coords);
    if (results && results.length > 0) {
      const item = results[0];
      const street = item.street || item.name || '';
      const number = item.streetNumber ? `, ${item.streetNumber}` : '';
      const district = item.district || item.subregion ? ` - ${item.district || item.subregion}` : '';
      const city = item.city || item.region ? `, ${item.city || item.region}` : '';

      const formatted = `${street}${number}${district}${city}`.replace(/^[\s,-]+/, '').trim();
      return formatted || null;
    }
  } catch (error) {
    console.warn('Erro ao converter coordenadas para endereço:', error);
  }
  return null;
}

/**
 * Converte um texto de endereço em Coordenadas (Lat/Long) para posicionar no mapa
 */
export async function geocodeAddress(addressText: string): Promise<LocationCoords | null> {
  try {
    if (!addressText.trim()) return null;
    const results = await Location.geocodeAsync(addressText);
    if (results && results.length > 0) {
      return {
        latitude: results[0].latitude,
        longitude: results[0].longitude,
      };
    }
  } catch (error) {
    console.warn('Erro ao buscar coordenadas do endereço:', error);
  }
  return null;
}
