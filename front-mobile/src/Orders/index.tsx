import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  Alert,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { fetchOrders } from '../api';
import Header from '../Header';
import OrderCard from '../OrderCard';
import { Order } from '../types';
import { useIsFocused, useNavigation } from '@react-navigation/native';

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  const fetchData = () => {
    setIsLoading(true);
    fetchOrders()
      .then((response) => setOrders(response.data))
      .catch(() => Alert.alert('Atenção', 'Houve um erro ao buscar os pedidos'))
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleOnPress = (order: Order) => {
    navigation.navigate('OrderDetails', {
      order,
    });
  };

  return (
    <View style={styles.screen}>
      <Header />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Entregas Pendentes</Text>
        <Text style={styles.subtitle}>Selecione um pedido para entregar</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#DA5C5C']} />
        }
      >
        {isLoading && !refreshing ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#DA5C5C" />
            <Text style={styles.loadingText}>Buscando pedidos pendentes...</Text>
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum pedido pendente no momento! 🎉</Text>
          </View>
        ) : (
          orders.map((order) => (
            <TouchableOpacity
              key={order.id}
              onPress={() => handleOnPress(order)}
              activeOpacity={0.85}
            >
              <OrderCard order={order} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  titleContainer: {
    paddingHorizontal: '5%',
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#263238',
    fontFamily: 'OpenSans_700Bold',
  },
  subtitle: {
    fontSize: 12,
    color: '#9E9E9E',
    fontFamily: 'OpenSans_400Regular',
    marginTop: 2,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: '5%',
    paddingBottom: 30,
  },
  center: {
    paddingTop: 60,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#9E9E9E',
    fontFamily: 'OpenSans_400Regular',
  },
  emptyContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    marginTop: 30,
  },
  emptyText: {
    fontSize: 15,
    color: '#9E9E9E',
    fontFamily: 'OpenSans_400Regular',
    textAlign: 'center',
  },
});

export default Orders;