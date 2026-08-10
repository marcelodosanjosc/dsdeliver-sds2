import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../Header';
import { fetchMyOrders } from '../api';
import { Order } from '../types';
import { formatPrice } from '../OrderCard';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.locale('pt-br');
dayjs.extend(relativeTime);

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation<any>();

  const loadOrders = async () => {
    try {
      const response = await fetchMyOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Erro ao buscar meus pedidos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.navBar}>
        <Text style={styles.navTitle}>Meus Pedidos</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Catalog')}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>🍔 Cardápio</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#DA5C5C']} />
        }
      >
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#DA5C5C" />
            <Text style={styles.loadingText}>Buscando seus pedidos...</Text>
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Você ainda não fez nenhum pedido.</Text>
            <TouchableOpacity
              style={styles.orderNowButton}
              onPress={() => navigation.navigate('Catalog')}
              activeOpacity={0.8}
            >
              <Text style={styles.orderNowText}>Fazer meu primeiro pedido</Text>
            </TouchableOpacity>
          </View>
        ) : (
          orders.map((order) => {
            const isDelivered = order.status === 'DELIVERED';

            return (
              <View key={order.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.orderId}>Pedido #{order.id}</Text>
                    <Text style={styles.orderDate}>{dayjs(order.moment).fromNow()}</Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      isDelivered ? styles.statusDelivered : styles.statusPending,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        isDelivered ? styles.statusTextDelivered : styles.statusTextPending,
                      ]}
                    >
                      {isDelivered ? '✅ Entregue' : '⏳ Em Andamento'}
                    </Text>
                  </View>
                </View>

                <View style={styles.addressBox}>
                  <Text style={styles.addressLabel}>📍 Entregar em:</Text>
                  <Text style={styles.addressText} numberOfLines={2}>
                    {order.address}
                  </Text>
                </View>

                <View style={styles.productsList}>
                  {order.products.map((product, idx) => (
                    <View key={`${product.id}-${idx}`} style={styles.productRow}>
                      <Text style={styles.productName}>• {product.name}</Text>
                      <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total Pago:</Text>
                  <Text style={styles.totalValue}>{formatPrice(order.total)}</Text>
                </View>
              </View>
            );
          })
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
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  navTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#263238',
    fontFamily: 'OpenSans_700Bold',
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  backButtonText: {
    fontSize: 13,
    color: '#263238',
    fontWeight: 'bold',
    fontFamily: 'OpenSans_700Bold',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  loadingText: {
    marginTop: 10,
    color: '#9E9E9E',
    fontFamily: 'OpenSans_400Regular',
  },
  emptyCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 15,
    color: '#9E9E9E',
    fontFamily: 'OpenSans_400Regular',
    marginBottom: 16,
    textAlign: 'center',
  },
  orderNowButton: {
    backgroundColor: '#DA5C5C',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  orderNowText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'OpenSans_700Bold',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 10,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#263238',
    fontFamily: 'OpenSans_700Bold',
  },
  orderDate: {
    fontSize: 12,
    color: '#9E9E9E',
    fontFamily: 'OpenSans_400Regular',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: '#FFF8E1',
  },
  statusDelivered: {
    backgroundColor: '#E8F5E9',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'OpenSans_700Bold',
  },
  statusTextPending: {
    color: '#F57F17',
  },
  statusTextDelivered: {
    color: '#2E7D32',
  },
  addressBox: {
    backgroundColor: '#FAFAFA',
    padding: 10,
    borderRadius: 6,
    marginVertical: 10,
  },
  addressLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: 'bold',
    fontFamily: 'OpenSans_700Bold',
  },
  addressText: {
    fontSize: 13,
    color: '#263238',
    fontFamily: 'OpenSans_400Regular',
    marginTop: 2,
  },
  productsList: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 10,
    gap: 4,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'OpenSans_400Regular',
  },
  productPrice: {
    fontSize: 13,
    color: '#263238',
    fontFamily: 'OpenSans_700Bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#263238',
    fontFamily: 'OpenSans_700Bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DA5C5C',
    fontFamily: 'OpenSans_700Bold',
  },
});
