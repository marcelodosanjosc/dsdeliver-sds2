import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isEmployee, setIsEmployee] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigation = useNavigation<any>();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setLoading(true);
      await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        employee: isEmployee,
      });
      Alert.alert('Sucesso', 'Conta criada com sucesso!');
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Erro ao realizar cadastro. Tente outro e-mail.';
      Alert.alert('Erro no cadastro', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
          <Text style={styles.appName}>DS Delivery</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Cadastre-se para começar a usar</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: João da Silva"
              placeholderTextColor="#9E9E9E"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="seuemail@exemplo.com"
              placeholderTextColor="#9E9E9E"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              placeholder="(11) 99999-9999"
              placeholderTextColor="#9E9E9E"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Mínimo de 6 caracteres"
              placeholderTextColor="#9E9E9E"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View style={styles.roleSelectionGroup}>
            <Text style={styles.label}>Tipo de Perfil</Text>
            <View style={styles.roleButtonsRow}>
              <TouchableOpacity
                style={[styles.roleButton, !isEmployee && styles.roleButtonActive]}
                onPress={() => setIsEmployee(false)}
                activeOpacity={0.8}
              >
                <Text style={[styles.roleButtonText, !isEmployee && styles.roleButtonTextActive]}>
                  🛍️ Cliente
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleButton, isEmployee && styles.roleButtonActive]}
                onPress={() => setIsEmployee(true)}
                activeOpacity={0.8}
              >
                <Text style={[styles.roleButtonText, isEmployee && styles.roleButtonTextActive]}>
                  🛵 Entregador
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>CADASTRAR</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}
          >
            <Text style={styles.loginText}>
              Já tem uma conta? <Text style={styles.loginTextBold}>Faça Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#DA5C5C',
    fontFamily: 'OpenSans_700Bold',
    marginTop: 6,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#263238',
    fontFamily: 'OpenSans_700Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#9E9E9E',
    fontFamily: 'OpenSans_400Regular',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#263238',
    fontFamily: 'OpenSans_400Regular',
  },
  roleSelectionGroup: {
    marginBottom: 20,
  },
  roleButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  roleButtonActive: {
    borderColor: '#DA5C5C',
    backgroundColor: '#FFF0F0',
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    fontFamily: 'OpenSans_700Bold',
  },
  roleButtonTextActive: {
    color: '#DA5C5C',
  },
  button: {
    backgroundColor: '#DA5C5C',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    fontFamily: 'OpenSans_700Bold',
  },
  loginLink: {
    marginTop: 18,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'OpenSans_400Regular',
  },
  loginTextBold: {
    color: '#DA5C5C',
    fontWeight: 'bold',
    fontFamily: 'OpenSans_700Bold',
  },
});
