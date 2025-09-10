import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { ArrowLeft, ShoppingCart } from 'lucide-react-native';
import { useProductosDestacados } from '../hooks/useServices';
import { useCart } from '../hooks/useCart';

interface AllFeaturedProductsScreenProps {
  navigation: any;
}

export const AllFeaturedProductsScreen: React.FC<AllFeaturedProductsScreenProps> = ({ navigation }) => {
  const { productos: productosDestacados, loading, error } = useProductosDestacados(20); // Obtener más productos destacados
  const { addToCart } = useCart();

  const getProductIcon = (nombre: string) => {
    const name = nombre.toLowerCase();
    if (name.includes('café')) return '☕';
    if (name.includes('sandwich')) return '🥪';
    if (name.includes('ensalada')) return '🥗';
    if (name.includes('pizza')) return '🍕';
    if (name.includes('hamburguesa')) return '🍔';
    if (name.includes('pasta')) return '🍝';
    if (name.includes('sopa')) return '🍲';
    if (name.includes('jugo')) return '🧃';
    if (name.includes('agua')) return '💧';
    if (name.includes('refresco')) return '🥤';
    if (name.includes('torta')) return '🍰';
    if (name.includes('pan')) return '🍞';
    if (name.includes('empanada')) return '🥟';
    if (name.includes('pollo')) return '🍗';
    if (name.includes('carne')) return '🥩';
    if (name.includes('pescado')) return '🐟';
    if (name.includes('arroz')) return '🍚';
    if (name.includes('fruta')) return '🍎';
    return '🍽️';
  };

  const handleAddToCart = (producto: any) => {
    const cartItem = {
      producto,
      cantidad: 1
    };

    addToCart(cartItem);
    Alert.alert(
      'Agregado al carrito',
      `1 x ${producto.nombre} agregado al carrito`,
      [
        { text: 'Continuar', style: 'default' },
        { text: 'Ver carrito', onPress: () => navigation.navigate('Cart') }
      ]
    );
  };

  if (error) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center px-6`} edges={['top']}>
        <Text style={tw`text-6xl mb-4`}>❌</Text>
        <Text style={tw`text-xl font-bold text-gray-800 mb-2 text-center`}>Error al cargar productos</Text>
        <Text style={tw`text-gray-600 text-center mb-6`}>{error}</Text>
        <TouchableOpacity
           style={tw`bg-blue-500 rounded-2xl py-3 px-6`}
           onPress={() => navigation.goBack()}
         >
          <Text style={tw`text-white font-bold`}>Volver</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`} edges={['top']}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={tw`mt-4 text-gray-600 text-lg`}>Cargando productos destacados...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`} edges={['top']}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between px-6 py-4 bg-blue-500`}>
        <TouchableOpacity
          style={tw`p-2`}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-white`}>Productos Destacados</Text>
        <TouchableOpacity
          style={tw`p-2`}
          onPress={() => navigation.navigate('Cart')}
        >
          <ShoppingCart size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        <View style={tw`px-6 py-6`}>
          <Text style={tw`text-2xl font-bold text-gray-800 mb-6`}>Los más vendidos</Text>
          
          {productosDestacados.length === 0 ? (
            <View style={tw`bg-white rounded-2xl p-8 items-center shadow-sm`}>
              <Text style={tw`text-6xl mb-4`}>🍽️</Text>
              <Text style={tw`text-xl font-bold text-gray-800 mb-2`}>No hay productos destacados</Text>
              <Text style={tw`text-gray-600 text-center`}>Por el momento no hay productos destacados disponibles</Text>
            </View>
          ) : (
            <View style={tw`flex-row flex-wrap justify-between`}>
              {productosDestacados.map((producto, index) => (
                <View
                  key={producto.id}
                  style={tw`bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100 w-[48%]`}
                >
                  {/* Product Image/Icon */}
                  <View style={tw`w-full h-32 rounded-xl bg-gray-100 items-center justify-center mb-3`}>
                    {producto.imagen_url ? (
                      <Image
                        source={{ uri: producto.imagen_url }}
                        style={tw`w-full h-full rounded-xl`}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={tw`text-5xl`}>{getProductIcon(producto.nombre)}</Text>
                    )}
                  </View>

                  {/* Product Info */}
                  <Text style={tw`font-bold text-gray-800 text-base mb-1`}>
                    {producto.nombre}
                  </Text>
                  <Text style={tw`text-gray-600 text-xs mb-2 h-8`} numberOfLines={2}>
                    {producto.descripcion || 'Producto fresco y delicioso preparado diariamente'}
                  </Text>
                  <View style={tw`flex-row justify-between items-center`}>
                    <Text style={tw`text-blue-600 font-bold text-base`}>
                      ${producto.precio.toFixed(2)}
                    </Text>
                    <TouchableOpacity
                      style={tw`bg-blue-500 rounded-full p-2`}
                      onPress={() => handleAddToCart(producto)}
                    >
                      <ShoppingCart size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={tw`h-6`} />
      </ScrollView>
    </SafeAreaView>
  );
};