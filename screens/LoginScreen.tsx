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
  Image,
  ImageBackground,
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
      style={tw`flex-1`}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={tw`flex-1`}>
        {/* Diseño para pantallas grandes (tablets) */}
        <View style={tw`flex-1 flex-row hidden md:flex`}>
          <View style={tw`w-1/2 bg-white p-6 justify-center`}>
            <View style={tw`mb-8 items-center`}>
              <Image
                source={require('../img/TASTYFOOD.png')}
                style={tw`w-24 h-24 mb-4`}
                resizeMode="contain"
              />
              <Text style={tw`text-2xl font-bold text-center text-blue-600 mb-2`}>
                Bienvenido a Tasty Food
              </Text>
              <Text style={tw`text-base text-center text-blue-500 mb-4`}>
                ¿Qué te gustaría pedir?
              </Text>
            </View>
            
            <Text style={tw`text-xl font-bold text-center mb-6`}>
              Inicia sesión en tu cuenta
            </Text>

            <View style={tw`mb-4`}>
              <Text style={tw`text-gray-700 mb-2 font-medium`}>Correo electrónico</Text>
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
                placeholder="********"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              style={tw`bg-blue-500 rounded-lg py-4 mb-4 ${loading ? 'opacity-50' : ''}`}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={tw`text-white text-center text-lg font-semibold`}>
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Text>
            </TouchableOpacity>

            <View style={tw`flex-row justify-center mt-4 border-t border-gray-200 pt-4`}>
              <Text style={tw`text-gray-600`}>¿No tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={tw`text-blue-500 font-semibold`}>Crear cuenta</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <ImageBackground 
            source={require('../img/BANNER.png')} 
            style={tw`w-1/2 h-auto`}
            resizeMode="cover"
          >
            <View style={tw`flex-1 bg-black bg-opacity-30`}></View>
          </ImageBackground>
        </View>
        
        {/* Diseño para móviles */}
        <View style={tw`flex-1 flex-col md:hidden`}>
          <ImageBackground 
            source={require('../img/BANNER.png')} 
            style={tw`w-full h-64`}
            resizeMode="cover"
          >
            <View style={tw`flex-1 bg-black bg-opacity-30 justify-center items-center`}>
              <Image
                source={require('../img/TASTYFOOD.png')}
                style={tw`w-24 h-24 mb-2`}
                resizeMode="contain"
              />
              <Text style={tw`text-2xl font-bold text-center text-white mb-1`}>
                Bienvenido a Tasty Food
              </Text>
              <Text style={tw`text-base text-center text-white`}>
                ¿Qué te gustaría pedir?
              </Text>
            </View>
          </ImageBackground>
          
          <View style={tw`bg-white p-6 flex-1`}>
            <Text style={tw`text-xl font-bold text-center mb-6`}>
              Inicia sesión en tu cuenta
            </Text>
            
            <View style={tw`mb-4`}>
              <Text style={tw`text-gray-700 mb-2 font-medium`}>Correo electrónico</Text>
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
                placeholder="********"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              style={tw`bg-blue-500 rounded-lg py-4 mb-4 ${loading ? 'opacity-50' : ''}`}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={tw`text-white text-center text-lg font-semibold`}>
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Text>
            </TouchableOpacity>

            <View style={tw`flex-row justify-center mt-4 border-t border-gray-200 pt-4`}>
              <Text style={tw`text-gray-600`}>¿No tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={tw`text-blue-500 font-semibold`}>Crear cuenta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};