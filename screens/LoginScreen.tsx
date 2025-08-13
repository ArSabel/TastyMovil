import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import tw from 'twrnc';
import { useAuth } from '../context/AuthContext';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Error de autenticación', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-white`}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={tw`flex-1 justify-center px-6`}>
        <View style={tw`mb-8`}>
          <Text style={tw`text-3xl font-bold text-center text-gray-800 mb-2`}>
            TastyFood
          </Text>
          <Text style={tw`text-lg text-center text-gray-600`}>
            Inicia sesión en tu cuenta
          </Text>
        </View>

        <View style={tw`mb-6`}>
          <Text style={tw`text-gray-700 mb-2 font-medium`}>Email</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg px-4 py-3 text-base`}
            placeholder="tu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={tw`mb-6`}>
          <Text style={tw`text-gray-700 mb-2 font-medium`}>Contraseña</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg px-4 py-3 text-base`}
            placeholder="Tu contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity
          style={tw`bg-blue-600 rounded-lg py-4 mb-4 ${loading ? 'opacity-50' : ''}`}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={tw`text-white text-center text-lg font-semibold`}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Text>
        </TouchableOpacity>

        <View style={tw`flex-row justify-center`}>
          <Text style={tw`text-gray-600`}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={tw`text-blue-600 font-semibold`}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};