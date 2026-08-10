import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../Header';
import { useCart } from '../contexts/CartContext';
import { createOrder } from '../api';
import { formatPrice } from '../OrderCard';
import OsmMap from '../components/OsmMap';
import { getCurrentDeviceLocation } from '../services/locationService';
import { LocationCoords } from '../types';

const DEFAULT_COORDS: LocationCoords = {
  latitude: -23.55052,
  longitude: -46.633308,
};

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState<LocationCoords>(DEFAULT_COORDS);
  const [loadingGps, setLoadingGps] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigation = useNavigation<any>();

  const handleGetGpsLocation = async () => {
    try {
      setLoadingGps(true);
      const userCoords = await getCurrentDeviceLocation();
      if (userCoords) {
        setCoords(userCoords);
        Alert.alert('Sucesso', 'Localização GPS capturada no mapa!');
      } else {
        Alert.alert('GPS Indisponível', 'Não foi possível obter a localização. Verifique as permissões de GPS.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Falha ao obter localização.');
    } finally {
      setLoadingGps(false);
    }
  };

  const handleFinishOrder = async () => {
    if (items.length === 0) {
      Alert.alert('Carrinho Vazio', 'Adicione produtos antes de finalizar o pedido.');
      return;
    }

    if (!address.trim()) {
      Alert.alert('Atenção', 'Informe o endereço de entrega para prosseguir.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        address: address.trim(),
        latitude: coords.latitude,
        longitude: coords.longitude,
        products: items.flatMap((item) =>
          Array(item.quantity).fill({ id: item.product.id })
        ),
      };

      await createOrder(payload);
      clearCart();
      Alert.alert(
        'Pedido Realizado! 🎉',
        'Seu pedido foi enviado com sucesso e está aguardando entrega.',
        [
          {
            text: 'Ver Meus Pedidos',
            onPress: () => navigation.navigate('MyOrders'),
          },
        ]
      );
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Houve um erro ao enviar o pedido. Tente novamente.';
      Alert.alert('Erro no pedido', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionTitle}>Seu Carrinho</Text>

        {items.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Seu carrinho está vazio 🛒</Text>
            <TouchableOpacity
              style={styles.backCatalogButton}
              onPress={() => navigation.navigate('Catalog')}
              activeOpacity={0.8}
            >
              <Text style={styles.backCatalogText}>Voltar ao Cardápio</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Lista de Itens */}
            <View style={styles.card}>
              {items.map((item) => (
                <View key={item.product.id} style={styles.itemRow}>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.product.name}</Text>
                    <Text style={styles.itemPrice}>{formatPrice(item.product.price)}</Text>
                  </View>

                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Text style={styles.qtyButtonText}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.qtyText}>{item.quantity}</Text>

                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
                    >
                      <Text style={styles.qtyButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total do Pedido:</Text>
                <Text style={styles.totalValue}>{formatPrice(totalAmount)}</Text>
              </View>
            </View>

            {/* Seção de Endereço & Mapa */}
            <Text style={styles.sectionTitle}>Local de Entrega</Text>
            <View style={styles.card}>
              <Text style={styles.inputLabel}>Endereço Completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Av. Paulista, 1500 - Apto 32"
                placeholderTextColor="#9E9E9E"
                value={address}
                onChangeText={setAddress}
              />

              <TouchableOpacity
                style={styles.gpsButton}
                onPress={handleGetGpsLocation}
                disabled={loadingGps}
                activeOpacity={0.8}
              >
                {loadingGps ? (
                  <ActivityIndicator size="small" color="#DA5C5C" />
                ) : (
                  <Text style={styles.gpsButtonText}>📍 Obter Minha Localização (GPS)</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.mapHint}>
                Confirme o ponto no mapa (toque para ajustar):
              </Text>

              <OsmMap
                coords={coords}
                interactive={true}
                onSelectCoords={setCoords}
                height={200}
                title="Ponto de Entrega"
                description={address || 'Selecione o local no mapa'}
              />
            </View>

            {/* Botão de Finalizar */}
            <TouchableOpacity
              style={[styles.checkoutButton, submitting && styles.buttonDisabled]}
              onPress={handleFinishOrder}
              disabled={submitting}
              activeOpacity={0.85}
            >
              {submitting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.checkoutButtonText}>CONFIRMAR E ENVIAR PEDIDO</Text>
              )}
            </TouchableOpacity>
          </>
        )}
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
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#263238',
    fontFamily: 'OpenSans_700Bold',
    marginBottom: 10,
    marginTop: 6,
  },
  emptyCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#9E9E9E',
    fontFamily: 'OpenSans_400Regular',
    marginBottom: 16,
  },
  backCatalogButton: {
    backgroundColor: '#DA5C5C',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backCatalogText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'OpenSans_700Bold',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemDetails: {
    flex: 1,
    marginRight: 10,
  },
  itemName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#263238',
    fontFamily: 'OpenSans_700Bold',
  },
  itemPrice: {
    fontSize: 13,
    color: '#DA5C5C',
    fontFamily: 'OpenSans_700Bold',
    marginTop: 2,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyButton: {
    width: 32,
    height: 32,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#263238',
  },
  qtyText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#263238',
    minWidth: 20,
    textAlign: 'center',
    fontFamily: 'OpenSans_700Bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    marginTop: 6,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#263238',
    fontFamily: 'OpenSans_700Bold',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DA5C5C',
    fontFamily: 'OpenSans_700Bold',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#263238',
    fontFamily: 'OpenSans_700Bold',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#263238',
    fontFamily: 'OpenSans_400Regular',
    marginBottom: 10,
  },
  gpsButton: {
    backgroundColor: '#FFF0F0',
    borderWidth: 1,
    borderColor: '#FFD6D6',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  gpsButtonText: {
    color: '#DA5C5C',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'OpenSans_700Bold',
  },
  mapHint: {
    fontSize: 12,
    color: '#9E9E9E',
    fontFamily: 'OpenSans_400Regular',
    marginBottom: 8,
  },
  checkoutButton: {
    backgroundColor: '#DA5C5C',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#DA5C5C',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  checkoutButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    fontFamily: 'OpenSans_700Bold',
  },
});
