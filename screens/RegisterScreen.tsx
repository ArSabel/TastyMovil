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
import { supabase } from '../lib/supabase';

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const createUserProfile = async (userId: string, userEmail: string) => {
    try {
      // Primero verificar si el perfil ya existe
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      // Si el perfil ya existe, no hacer nada
      if (existingProfile) {
        console.log('Profile already exists for user:', userId);
        return;
      }

      // Si no existe, crear el perfil
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          first_name: '',
          last_name: '',
          full_name: '',
          cedula_ruc: '',
          phone: '',
          gender: '',
          birth_date: null,
          role: 'customer'
        });

      if (error) {
        // Si es error de clave duplicada, ignorarlo
        if (error.code === '23505') {
          console.log('Profile already exists (duplicate key), continuing...');
          return;
        }
        console.error('Error creating profile:', error);
        throw error;
      }
    } catch (error: any) {
      // Si es error de clave duplicada, no lanzar el error
      if (error?.code === '23505') {
        console.log('Profile already exists (duplicate key), continuing...');
        return;
      }
      console.error('Profile creation failed:', error);
      throw error;
    }
  };

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
    
    try {
      const { data, error } = await signUp(email, password);
      
      if (error) {
        Alert.alert('Error de registro', error.message);
        return;
      }

      // Si el registro fue exitoso y tenemos el usuario
      if (data?.user) {
        try {
          // Crear el perfil del usuario
          await createUserProfile(data.user.id, email);
          
          Alert.alert(
            'Registro exitoso',
            'Completa tu perfil para poder hacer pedidos.',
            [
              {
                text: 'Completar perfil',
                onPress: () => navigation.navigate('Profile', { editMode: true }),
              },
            ]
          );
        } catch (profileError) {
          console.error('Error creating user profile:', profileError);
          Alert.alert(
            'Registro parcialmente exitoso',
            'Tu cuenta fue creada pero hubo un problema configurando tu perfil. Completa tu perfil para poder hacer pedidos.',
            [
              {
                text: 'Completar perfil',
                onPress: () => navigation.navigate('Profile', { editMode: true }),
              },
            ]
          );
        }
      } else {
        Alert.alert(
          'Registro exitoso',
          'Completa tu perfil para poder hacer pedidos.',
          [
            {
              text: 'Completar perfil',
              onPress: () => navigation.navigate('Profile'),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Ocurrió un error durante el registro. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
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
              <Text style={tw`text-2xl font-bold text-center text-orange-600 mb-2`}>
                Bienvenido a Tasty Food
              </Text>
              <Text style={tw`text-base text-center text-blue-500 mb-4`}>
                ¿Qué te gustaría pedir?
              </Text>
            </View>
            
            <Text style={tw`text-xl font-bold text-center mb-6`}>
              Crea tu cuenta
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
              <Text style={tw`text-gray-700 mb-2 font-medium`}>Confirmar contraseña</Text>
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
              style={tw`bg-blue-500 rounded-lg py-4 mb-4 ${loading ? 'opacity-50' : ''}`}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={tw`text-white text-center text-lg font-semibold`}>
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </Text>
            </TouchableOpacity>

            <View style={tw`flex-row justify-center mt-4 border-t border-gray-200 pt-4`}>
              <Text style={tw`text-gray-600`}>¿Ya tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={tw`text-blue-500 font-semibold`}>Iniciar sesión</Text>
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
              Crea tu cuenta
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
              <Text style={tw`text-gray-700 mb-2 font-medium`}>Confirmar contraseña</Text>
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
              style={tw`bg-blue-500 rounded-lg py-4 mb-4 ${loading ? 'opacity-50' : ''}`}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={tw`text-white text-center text-lg font-semibold`}>
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </Text>
            </TouchableOpacity>

            <View style={tw`flex-row justify-center mt-4 border-t border-gray-200 pt-4`}>
              <Text style={tw`text-gray-600`}>¿Ya tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={tw`text-blue-500 font-semibold`}>Iniciar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};