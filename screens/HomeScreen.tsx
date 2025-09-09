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

  const categories = [
    {
      title: 'Desayunos',
      icon: '🍽️',
      screen: 'Sections',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      title: 'Almuerzos',
      icon: '🍽️',
      screen: 'Sections',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      title: 'Meriendas',
      icon: '🍽️',
      screen: 'Sections',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
  ];

  const featuredProducts = [
    {
      name: 'Hamburguesa Clásica',
      price: '$8.50',
      image: '🍔',
    },
    {
      name: 'Pizza Margherita',
      price: '$12.00',
      image: '🍕',
    },
    {
      name: 'Ensalada César',
      price: '$6.50',
      image: '🥗',
    },
  ];

  const features = [
    {
      icon: '🥬',
      title: 'Ingredientes Frescos',
      description: 'Utilizamos ingredientes frescos y de calidad en todos nuestros platillos.',
    },
    {
      icon: '🚀',
      title: 'Entrega Rápida',
      description: 'Entregamos tu comida caliente y fresca en el menor tiempo posible.',
    },
    {
      icon: '👨‍🍳',
      title: 'Chefs Expertos',
      description: 'Nuestros chefs tienen años de experiencia preparando comida deliciosa.',
    },
  ];

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50 pt-4`}>
      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={tw`bg-white px-6 py-6 shadow-sm`}>
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <View>
              <Text style={tw`text-3xl font-bold text-blue-600`}>TastyFood</Text>
              <Text style={tw`text-gray-600 text-base`}>¡Hola! {user?.email?.split('@')[0]}</Text>
            </View>
            <TouchableOpacity
              style={tw`bg-red-500 px-4 py-2 rounded-full shadow-sm`}
              onPress={handleLogout}
            >
              <Text style={tw`text-white font-semibold`}>Salir</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Banner */}
        <View style={tw`mx-6 mt-6 bg-blue-500 rounded-2xl p-8 shadow-lg`}>
          <Text style={tw`text-white text-2xl font-bold mb-3 text-center`}>
            Disfruta la mejor experiencia gastronómica en el campus
          </Text>
          <Text style={tw`text-blue-100 text-base mb-6 text-center`}>
            Platillos preparados con ingredientes frescos y de calidad premium
          </Text>
          <TouchableOpacity
            style={tw`bg-white px-6 py-3 rounded-full self-center shadow-sm`}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Menu' })}
          >
            <Text style={tw`text-blue-600 font-bold text-base`}>Ver Menú</Text>
          </TouchableOpacity>
        </View>

        {/* Nuestras Categorías */}
        <View style={tw`px-6 py-6`}>
          <View style={tw`flex-row justify-between items-center mb-6`}>
            <Text style={tw`text-2xl font-bold text-gray-800`}>Nuestras Categorías</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Menu' })}>
              <Text style={tw`text-blue-600 font-semibold`}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          
          <View style={tw`flex-row justify-between`}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={tw`flex-1 ${category.bgColor} rounded-2xl p-4 mx-1 items-center shadow-sm`}
                onPress={() => navigation.navigate('MainTabs', { screen: 'Menu' })}
                activeOpacity={0.8}
              >
                <Text style={tw`text-3xl mb-2`}>{category.icon}</Text>
                <Text style={tw`${category.textColor} font-bold text-sm text-center`}>
                  {category.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Productos Destacados */}
        <View style={tw`px-6 py-6`}>
          <View style={tw`flex-row justify-between items-center mb-6`}>
            <Text style={tw`text-2xl font-bold text-gray-800`}>Productos Destacados</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Menu' })}>
              <Text style={tw`text-blue-600 font-semibold`}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredProducts.map((product, index) => (
              <View
                key={index}
                style={tw`bg-white rounded-2xl p-4 mr-4 shadow-sm border border-gray-100 w-40`}
              >
                <Text style={tw`text-4xl text-center mb-3`}>{product.image}</Text>
                <Text style={tw`font-bold text-gray-800 text-center mb-2`}>
                  {product.name}
                </Text>
                <Text style={tw`text-blue-600 font-bold text-center text-lg`}>
                  {product.price}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ¿Por qué elegirnos? */}
        <View style={tw`px-6 py-6`}>
          <Text style={tw`text-2xl font-bold text-gray-800 mb-6 text-center`}>¿Por qué elegirnos?</Text>
          
          <View>
            {features.map((feature, index) => (
              <View key={index} style={tw`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${index > 0 ? 'mt-4' : ''}`}>
                <View style={tw`flex-row items-center mb-3`}>
                  <Text style={tw`text-2xl mr-4`}>{feature.icon}</Text>
                  <Text style={tw`font-bold text-gray-800 text-lg flex-1`}>
                    {feature.title}
                  </Text>
                </View>
                <Text style={tw`text-gray-600 leading-5 ml-12`}>
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Call to Action */}
        <View style={tw`mx-6 mb-6 bg-green-500 rounded-2xl p-6 shadow-lg`}>
          <Text style={tw`text-white text-xl font-bold mb-3 text-center`}>
            ¿Listo para ordenar?
          </Text>
          <Text style={tw`text-green-100 text-base mb-4 text-center`}>
            Haz tu pedido ahora y disfruta de la mejor comida del campus.
          </Text>
          <TouchableOpacity
            style={tw`bg-white px-6 py-3 rounded-full self-center shadow-sm`}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Menu' })}
          >
            <Text style={tw`text-green-600 font-bold text-base`}>Hacer Pedido</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={tw`bg-gray-800 mx-6 mb-6 rounded-2xl p-6`}>
          <Text style={tw`text-white text-xl font-bold mb-4 text-center`}>TastyFood</Text>
          <Text style={tw`text-gray-300 text-sm mb-4 text-center`}>
            Somos la Empresa Pública de producción y desarrollo estratégico de la Universidad Laica Eloy Alfaro de Manabí
          </Text>
          
          <View style={tw`border-t border-gray-600 pt-4 mt-4`}>
            <View style={tw`flex-row justify-between mb-4`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-white font-bold mb-2`}>Horario</Text>
                <Text style={tw`text-gray-300 text-sm`}>Lunes - Viernes:</Text>
                <Text style={tw`text-gray-300 text-sm mb-1`}>8:00 - 17:00</Text>
                <Text style={tw`text-gray-300 text-sm`}>Sábado:</Text>
                <Text style={tw`text-gray-300 text-sm mb-1`}>8:00 - 14:00</Text>
                <Text style={tw`text-gray-300 text-sm`}>Domingo:</Text>
                <Text style={tw`text-gray-300 text-sm`}>Cerrado</Text>
              </View>
              
              <View style={tw`flex-1`}>
                <Text style={tw`text-white font-bold mb-2`}>Contacto</Text>
                <Text style={tw`text-gray-300 text-sm mb-1`}>+593 95 895 1061</Text>
                <Text style={tw`text-gray-300 text-sm mb-1`}>052679600</Text>
                <Text style={tw`text-gray-300 text-sm mb-1`}>gerencia@ep-uleam.gob.ec</Text>
                <Text style={tw`text-gray-300 text-sm`}>ULEAM, Manta</Text>
              </View>
            </View>
            
            <Text style={tw`text-gray-400 text-xs text-center mt-4`}>
              © 2025 TastyFood. Todos los derechos reservados.
            </Text>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={tw`h-6`} />
      </ScrollView>
    </SafeAreaView>
  );
};