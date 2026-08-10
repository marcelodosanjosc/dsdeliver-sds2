import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from './contexts/AuthContext';

// Auth Screens
import Login from './Auth/Login';
import Register from './Auth/Register';

// Employee / Delivery Screens
import Orders from './Orders';
import OrderDetails from './OrderDetails';

// Customer Screens
import Catalog from './Catalog';
import Cart from './Cart';
import MyOrders from './MyOrders';

const Stack = createStackNavigator();

function Routes() {
  const { isAuthenticated, isEmployee, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#DA5C5C" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: {
            backgroundColor: '#F5F5F5',
          },
        }}
      >
        {!isAuthenticated ? (
          // Fluxo de Autenticação
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </>
        ) : isEmployee ? (
          // Fluxo do Entregador (ROLE_FUNCIONARIO)
          <>
            <Stack.Screen name="Orders" component={Orders} />
            <Stack.Screen name="OrderDetails" component={OrderDetails} />
          </>
        ) : (
          // Fluxo do Cliente (ROLE_CLIENTE)
          <>
            <Stack.Screen name="Catalog" component={Catalog} />
            <Stack.Screen name="Cart" component={Cart} />
            <Stack.Screen name="MyOrders" component={MyOrders} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
});

export default Routes;