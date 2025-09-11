import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { useAuth } from '../context/AuthContext';
import { useProductosDestacados } from '../hooks/useServices';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const { productos: productosDestacados, loading: loadingProductos } = useProductosDestacados(3);

  const handleLogout = async () => {
    await signOut();
  };

  const categories = [
    {
      title: 'Desayunos',
      icon: '🌅',
      screen: 'Products',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      sectionName: 'Desayunos',
      sectionId: 1, // ID de la sección de Desayunos
    },
    {
      title: 'Almuerzos',
      icon: '🍽️',
      screen: 'Products',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      sectionName: 'Almuerzos',
      sectionId: 2, // ID de la sección de Almuerzos
    },
    {
      title: 'Meriendas',
      icon: '🧁',
      screen: 'Products',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      sectionName: 'Meriendas',
      sectionId: 3, // ID de la sección de Meriendas
    },
  ];

  // Mapeamos los productos destacados desde la API para mantener la estructura esperada
  const featuredProducts = loadingProductos ? [
    { name: 'Cargando...', price: '$0.00', image: '⌛' }
  ] : productosDestacados.map(producto => ({
    name: producto.nombre,
    price: `$${producto.precio.toFixed(2)}`,
    image: producto.imagen_url ? '🍽️' : '🍔'
  }));

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`} edges={['top']}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between px-6 py-4 bg-blue-500`}>
        <View style={tw`flex-1`}>
          <Text style={tw`text-2xl font-bold text-white`}>TastyFood</Text>
          <Text style={tw`text-white opacity-80`}>¡Hola!</Text>
        </View>
        <TouchableOpacity
          style={tw`bg-red-500 px-4 py-2 rounded-full shadow-sm`}
          onPress={handleLogout}
        >
          <Text style={tw`text-white font-semibold`}>Salir</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>

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
            onPress={() => navigation.navigate('Products', { sectionId: 1, sectionName: 'Desayunos' })}
          >
            <Text style={tw`text-blue-600 font-bold text-base`}>Ver Menú</Text>
          </TouchableOpacity>
        </View>

        {/* Nuestras Categorías */}
        <View style={tw`px-6 py-6`}>
          <View style={tw`flex-row justify-between items-center mb-6`}>
            <Text style={tw`text-2xl font-bold text-gray-800`}>Nuestras Categorías</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllCategories')}>
              <Text style={tw`text-blue-600 font-semibold`}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          <View style={tw`flex-row justify-between`}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={tw`flex-1 ${category.bgColor} rounded-2xl p-4 mx-1 items-center shadow-sm`}
                onPress={() => navigation.navigate(category.screen, { sectionId: category.sectionId, sectionName: category.sectionName })}
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
            <TouchableOpacity onPress={() => navigation.navigate('AllFeaturedProducts')}>
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
            onPress={() => navigation.navigate('Products', { sectionId: 1, sectionName: 'Desayunos' })}
          >
            <Text style={tw`text-green-600 font-bold text-base`}>Hacer Pedido</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={tw`h-6`} />
      </ScrollView>
    </SafeAreaView>
  );
};
