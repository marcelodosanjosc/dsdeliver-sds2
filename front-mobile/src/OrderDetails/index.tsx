import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Header from '../Header';
import { Order } from '../types';
import OrderCard from '../OrderCard';
import OsmMap from '../components/OsmMap';
import { confirmDelivery } from '../api';
import { getCurrentDeviceLocation } from '../services/locationService';
import { getDistance } from 'geolib';

function OrderDetails() {
  const route = useRoute<any>();
  const { order } = route.params as { order: Order };
  const navigation = useNavigation<any>();
  const [distanceText, setDistanceText] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    async function calculateDistance() {
      if (order.latitude && order.longitude) {
        const driverCoords = await getCurrentDeviceLocation();
        if (driverCoords) {
          const meters = getDistance(
            { latitude: driverCoords.latitude, longitude: driverCoords.longitude },
            { latitude: order.latitude, longitude: order.longitude }
          );
          if (meters < 1000) {
            setDistanceText(`${meters} metros`);
          } else {
            setDistanceText(`${(meters / 1000).toFixed(1)} km`);
          }
        }
      }
    }
    calculateDistance();
  }, [order]);

  const handleCancel = () => {
    navigation.navigate('Orders');
  };

  const handleConfirmDelivery = async () => {
    try {
      setConfirming(true);
      await confirmDelivery(order.id);
      Alert.alert('Sucesso!', `Pedido #${order.id} confirmado com sucesso!`);
      navigation.navigate('Orders');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', `Houve um erro ao confirmar a entrega do pedido #${order.id}`);
    } finally {
      setConfirming(false);
    }
  };

  const handleStartNavigation = () => {
    const url = `https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination=${order.latitude},${order.longitude}`;
    Linking.openURL(url);
  };

  const orderCoords = {
    latitude: order.latitude || -23.55052,
    longitude: order.longitude || -46.633308,
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <OrderCard order={order} />

        {/* Mapa OpenStreetMap do Destino */}
        <View style={styles.mapCard}>
          <View style={styles.mapHeader}>
            <Text style={styles.mapTitle}>📍 Local da Entrega</Text>
            {distanceText && (
              <Text style={styles.distanceBadge}>Aprox. {distanceText}</Text>
            )}
          </View>
          <Text style={styles.addressText} numberOfLines={2}>
            {order.address}
          </Text>
          <OsmMap
            coords={orderCoords}
            height={180}
            title={`Pedido #${order.id}`}
            description={order.address}
          />
        </View>

        {/* Ações */}
        <TouchableOpacity
          style={[styles.button, styles.navButton]}
          onPress={handleStartNavigation}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>🧭 INICIAR NAVEGAÇÃO</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.confirmButton, confirming && styles.buttonDisabled]}
          onPress={handleConfirmDelivery}
          disabled={confirming}
          activeOpacity={0.85}
        >
          {confirming ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>✅ CONFIRMAR ENTREGA</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancel}
          activeOpacity={0.85}
        >
          <Text style={[styles.buttonText, styles.cancelButtonText]}>VOLTAR</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingHorizontal: '4%',
    paddingBottom: 40,
    gap: 12,
  },
  mapCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  mapTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#263238',
    fontFamily: 'OpenSans_700Bold',
  },
  distanceBadge: {
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    fontFamily: 'OpenSans_700Bold',
  },
  addressText: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'OpenSans_400Regular',
    marginBottom: 10,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButton: {
    backgroundColor: '#263238',
  },
  confirmButton: {
    backgroundColor: '#DA5C5C',
  },
  cancelButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#FFF',
    letterSpacing: 0.5,
    fontFamily: 'OpenSans_700Bold',
  },
  cancelButtonText: {
    color: '#666',
  },
});

export default OrderDetails;