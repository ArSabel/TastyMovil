import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import tw from 'twrnc';
import { useAuth } from '../context/AuthContext';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  const menuItems = [
    {
      title: 'Restaurantes',
      description: 'Explora restaurantes disponibles',
      screen: 'Restaurants',
      color: 'bg-blue-500',
      icon: '🍽️',
    },
    {
      title: 'Productos',
      description: 'Ver catálogo de productos',
      screen: 'Products',
      color: 'bg-green-500',
      icon: '🍕',
    },
    {
      title: 'Mi Carrito',
      description: 'Ver mis pedidos',
      screen: 'Cart',
      color: 'bg-orange-500',
      icon: '🛒',
    },
    {
      title: 'Cámara',
      description: 'Tomar foto de producto',
      screen: 'Camera',
      color: 'bg-purple-500',
      icon: '📷',
    },
  ];

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <ScrollView style={tw`flex-1`}>
        {/* Header */}
        <View style={tw`bg-white px-6 py-4 shadow-sm`}>
          <View style={tw`flex-row justify-between items-center`}>
            <View>
              <Text style={tw`text-2xl font-bold text-gray-800`}>TastyFood</Text>
              <Text style={tw`text-gray-600`}>Bienvenido, {user?.email}</Text>
            </View>
            <TouchableOpacity
              style={tw`bg-red-500 px-4 py-2 rounded-lg`}
              onPress={handleLogout}
            >
              <Text style={tw`text-white font-semibold`}>Salir</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Grid */}
        <View style={tw`px-6 py-6`}>
          <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>Menú Principal</Text>
          
          <View style={tw`flex-row flex-wrap justify-between`}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={tw`w-[48%] ${item.color} rounded-xl p-4 mb-4 shadow-sm`}
                onPress={() => navigation.navigate(item.screen)}
              >
                <Text style={tw`text-3xl mb-2`}>{item.icon}</Text>
                <Text style={tw`text-white font-bold text-lg mb-1`}>
                  {item.title}
                </Text>
                <Text style={tw`text-white opacity-90 text-sm`}>
                  {item.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={tw`mx-6 mb-6 bg-white rounded-xl p-4 shadow-sm`}>
          <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>Estadísticas</Text>
          <View style={tw`flex-row justify-between`}>
            <View style={tw`items-center`}>
              <Text style={tw`text-2xl font-bold text-blue-600`}>0</Text>
              <Text style={tw`text-gray-600 text-sm`}>Pedidos</Text>
            </View>
            <View style={tw`items-center`}>
              <Text style={tw`text-2xl font-bold text-green-600`}>$0</Text>
              <Text style={tw`text-gray-600 text-sm`}>Total</Text>
            </View>
            <View style={tw`items-center`}>
              <Text style={tw`text-2xl font-bold text-orange-600`}>0</Text>
              <Text style={tw`text-gray-600 text-sm`}>Favoritos</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};