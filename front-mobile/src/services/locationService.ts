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

    // 1. Tenta obter a última posição conhecida em cache (muito rápido e confiável no emulador)
    const lastKnown = await Location.getLastKnownPositionAsync({});
    if (lastKnown) {
      return {
        latitude: lastKnown.coords.latitude,
        longitude: lastKnown.coords.longitude,
      };
    }

    // 2. Tenta obter a posição atual com precisão balanceada
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Low,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.warn('GPS não fixou sinal imediato no emulador/aparelho, usando coordenadas padrão:', error);
    // Retorna fallback seguro sem quebrar o fluxo
    return DEFAULT_FALLBACK_COORDS;
  }
}
