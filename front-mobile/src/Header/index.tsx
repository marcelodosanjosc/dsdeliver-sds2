import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const navigation = useNavigation<any>();
  const { user, isAuthenticated, isEmployee, logout } = useAuth();

  const handleLogoPress = () => {
    if (!isAuthenticated) return;
    if (isEmployee) {
      navigation.navigate('Orders');
    } else {
      navigation.navigate('Catalog');
    }
  };

  const handleLogout = () => {
    Alert.alert('Sair da Conta', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.brand}
        onPress={handleLogoPress}
        activeOpacity={0.8}
      >
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.text}>DS Delivery</Text>
      </TouchableOpacity>

      {isAuthenticated && user && (
        <View style={styles.userSection}>
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {user.name.split(' ')[0]}
            </Text>
            <Text style={styles.userRole}>
              {isEmployee ? '🛵 Entregador' : '🛍️ Cliente'}
            </Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DA5C5C',
    paddingTop: 45,
    paddingBottom: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 25,
    letterSpacing: -0.24,
    color: '#FFF',
    marginLeft: 10,
    fontFamily: 'OpenSans_700Bold',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userInfo: {
    alignItems: 'flex-end',
  },
  userName: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'OpenSans_700Bold',
  },
  userRole: {
    color: '#FFEAEA',
    fontSize: 10,
    fontFamily: 'OpenSans_400Regular',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  logoutText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'OpenSans_700Bold',
  },
});

export default Header;