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

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Error de registro', error.message);
    } else {
      Alert.alert(
        'Registro exitoso',
        'Se ha enviado un email de confirmación a tu correo electrónico.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
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
            Crear Cuenta
          </Text>
          <Text style={tw`text-lg text-center text-gray-600`}>
            Únete a TastyFood
          </Text>
        </View>

        <View style={tw`mb-4`}>
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

        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-2 font-medium`}>Contraseña</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg px-4 py-3 text-base`}
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={tw`mb-6`}>
          <Text style={tw`text-gray-700 mb-2 font-medium`}>Confirmar Contraseña</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg px-4 py-3 text-base`}
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity
          style={tw`bg-green-600 rounded-lg py-4 mb-4 ${loading ? 'opacity-50' : ''}`}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={tw`text-white text-center text-lg font-semibold`}>
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Text>
        </TouchableOpacity>

        <View style={tw`flex-row justify-center`}>
          <Text style={tw`text-gray-600`}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={tw`text-blue-600 font-semibold`}>Inicia Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};