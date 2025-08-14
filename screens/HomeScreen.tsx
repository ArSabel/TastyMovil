import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
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
      title: 'Menú',
      description: 'Explora nuestro delicioso menú',
      screen: 'Sections',
      color: 'bg-gradient-to-r from-orange-400 to-red-400',
      icon: '🍽️',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      title: 'Mis Pedidos',
      description: 'Ver pedidos realizados',
      screen: 'MyOrders',
      color: 'bg-gradient-to-r from-green-400 to-blue-400',
      icon: '📋',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Mi Carrito',
      description: 'Productos seleccionados',
      screen: 'Cart',
      color: 'bg-gradient-to-r from-red-400 to-orange-400',
      icon: '🛒',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
    },
  ];

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={tw`bg-white px-6 py-6 shadow-sm`}>
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <View>
              <Text style={tw`text-3xl font-bold text-gray-800`}>TastyFood</Text>
              <Text style={tw`text-gray-600 text-base`}>¡Hola! {user?.email?.split('@')[0]}</Text>
            </View>
            <TouchableOpacity
              style={tw`bg-red-500 px-4 py-2 rounded-full shadow-sm`}
              onPress={handleLogout}
            >
              <Text style={tw`text-white font-semibold`}>Salir</Text>
            </TouchableOpacity>
          </View>
          
          {/* Search Bar Style */}
          <View style={tw`bg-gray-100 rounded-full px-4 py-3 flex-row items-center`}>
            <Text style={tw`text-gray-500 text-base flex-1`}>🔍 ¿Qué se te antoja hoy?</Text>
          </View>
        </View>

        {/* Promotional Banner */}
        <View style={tw`mx-6 mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm`}>
          <Text style={tw`text-blue-800 text-xl font-bold mb-2`}>¡Comida Deliciosa!</Text>
          <Text style={tw`text-blue-600 text-base`}>Descubre nuestros platos más populares</Text>
        </View>

        {/* Categories Section */}
        <View style={tw`px-6 py-6`}>
          <Text style={tw`text-2xl font-bold text-gray-800 mb-6`}>¿Qué quieres comer?</Text>
          
          <View style={tw`flex-row flex-wrap justify-between`}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={tw`w-[48%] ${item.bgColor} rounded-2xl p-6 mb-4 shadow-sm border border-gray-100`}
                onPress={() => navigation.navigate(item.screen)}
                activeOpacity={0.8}
              >
                <View style={tw`${item.color} w-12 h-12 rounded-full items-center justify-center mb-4`}>
                  <Text style={tw`text-2xl`}>{item.icon}</Text>
                </View>
                <Text style={tw`${item.textColor} font-bold text-lg mb-2`}>
                  {item.title}
                </Text>
                <Text style={tw`text-gray-600 text-sm leading-5`}>
                  {item.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={tw`mx-6 mb-6 bg-white rounded-2xl p-6 shadow-sm`}>
          <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>Tu Actividad</Text>
          <View style={tw`flex-row justify-between`}>
            <View style={tw`items-center flex-1`}>
              <View style={tw`bg-blue-100 w-12 h-12 rounded-full items-center justify-center mb-2`}>
                <Text style={tw`text-blue-600 text-xl`}>📋</Text>
              </View>
              <Text style={tw`text-2xl font-bold text-blue-600`}>0</Text>
              <Text style={tw`text-gray-600 text-sm`}>Pedidos</Text>
            </View>
            <View style={tw`items-center flex-1`}>
              <View style={tw`bg-green-100 w-12 h-12 rounded-full items-center justify-center mb-2`}>
                <Text style={tw`text-green-600 text-xl`}>💰</Text>
              </View>
              <Text style={tw`text-2xl font-bold text-green-600`}>$0</Text>
              <Text style={tw`text-gray-600 text-sm`}>Gastado</Text>
            </View>
            <View style={tw`items-center flex-1`}>
              <View style={tw`bg-orange-100 w-12 h-12 rounded-full items-center justify-center mb-2`}>
                <Text style={tw`text-orange-600 text-xl`}>🍽️</Text>
              </View>
              <Text style={tw`text-2xl font-bold text-orange-600`}>0</Text>
              <Text style={tw`text-gray-600 text-sm`}>Platos</Text>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={tw`h-6`} />
      </ScrollView>
    </SafeAreaView>
  );
};