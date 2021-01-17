import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Alert, Text} from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { fetchOrders } from '../api';
import Header from '../Header';
import OrderCard from '../OrderCard';
import { Order } from '../types';
import { useIsFocused, useNavigation } from '@react-navigation/native';

function Orders(){
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const fetchData = () => {
      setIsLoading(true);
      fetchOrders()
      .then(response => setOrders(response.data))
      .catch(() => Alert.alert('Houve um erro ao busca s pedidos'))
      .finally(() => setIsLoading(false));
    }

    useEffect( () => {
      if(isFocused){
        fetchData();
      }
    }, [isFocused]);

    const handeleOnPress = (order: Order) => {
      navigation.navigate('OrderDetails', {
        order
      });
    }

    return (
        <>
        <Header />
        <ScrollView style={styles.container}>
           {isLoading ? (
           <Text>Buscando pedidos...</Text> 
           ) : (
                orders.map(order => (
              <TouchableWithoutFeedback 
              key={order.id} 
              onPress={() => handeleOnPress(order) }
              >
                 <OrderCard order={order} />
              </TouchableWithoutFeedback>
            ))
           )}
        </ScrollView>
        </>
    );
}


const styles = StyleSheet.create({
  
    container: {
      paddingRight: '5%',
      paddingLeft: '5%'
    },
    button: {
      backgroundColor: '#DA5C5C',
      flexDirection: 'row',
      borderRadius: 10,
      marginTop: 40,
      alignItems: 'center',
      justifyContent: 'center'
    },
    buttonText: {
      paddingTop: 15,
      paddingBottom: 15,
      paddingLeft: 50,
      paddingRight: 50,
      fontWeight: 'bold',
      fontSize: 18,
      color: '#FFF',
      letterSpacing: -0.24,
      fontFamily: 'OpenSans_700Bold'
    }
  }
     
)

export default Orders;