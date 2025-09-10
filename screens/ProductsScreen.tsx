import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ShoppingCart } from 'lucide-react-native';
import tw from 'twrnc';
import { useProductos, Producto } from '../hooks/useServices';
import { useCart } from '../hooks/useCart';

interface ProductsScreenProps {
  navigation: any;
  route: any;
}

export const ProductsScreen: React.FC<ProductsScreenProps> = ({ navigation, route }) => {
  const { sectionId, sectionName } = route.params;
  const { productos, loading, error } = useProductos(sectionId);
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState<{[key: number]: number}>({});

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

  const getQuantity = (productId: number) => {
    return quantities[productId] || 1;
  };

  const setQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) quantity = 1;
    setQuantities(prev => ({ ...prev, [productId]: quantity }));
  };

  const handleAddToCart = (producto: Producto) => {
    const quantity = getQuantity(producto.id);
    
    if (producto.stock_actual && producto.stock_actual < quantity) {
      Alert.alert(
        'Stock insuficiente',
        `Solo hay ${producto.stock_actual} unidades disponibles de ${producto.nombre}`
      );
      return;
    }

    const cartItem = {
      producto,
      cantidad: quantity
    };

    addToCart(cartItem);
    Alert.alert(
      'Agregado al carrito',
      `${quantity} x ${producto.nombre} agregado al carrito`,
      [
        { text: 'Continuar', style: 'default' },
        { text: 'Ver carrito', onPress: () => navigation.navigate('Cart') }
      ]
    );

    // Reset quantity after adding to cart
    setQuantity(producto.id, 1);
  };

  const isOutOfStock = (producto: Producto) => {
    return producto.stock_actual === 0;
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'text-red-600';
    if (stock <= 5) return 'text-blue-600';
    return 'text-green-600';
  };

  const getStockBadgeColor = (stock: number) => {
    if (stock === 0) return 'bg-red-100';
    if (stock <= 5) return 'bg-blue-100';
    return 'bg-green-100';
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
        <Text style={tw`mt-4 text-gray-600 text-lg`}>Cargando productos...</Text>
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
        <Text style={tw`text-xl font-bold text-white`}>{sectionName}</Text>
        <TouchableOpacity
          style={tw`p-2`}
          onPress={() => navigation.navigate('Cart')}
        >
          <ShoppingCart size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        <View style={tw`px-6 py-6`}>
          {productos.length === 0 ? (
            <View style={tw`bg-white rounded-2xl p-8 items-center shadow-sm`}>
              <Text style={tw`text-6xl mb-4`}>🍽️</Text>
              <Text style={tw`text-xl font-bold text-gray-800 mb-2`}>No hay productos disponibles</Text>
              <Text style={tw`text-gray-600 text-center`}>Por el momento no hay productos en esta sección</Text>
            </View>
          ) : (
            <View>
              {productos.map((producto, index) => (
                <View
                  key={producto.id}
                  style={tw`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 ${
                    isOutOfStock(producto) ? 'opacity-60' : ''
                  } ${index > 0 ? 'mt-4' : ''}`}
                >
                  <View style={tw`flex-row`}>
                    {/* Product Image/Icon */}
                    <View style={tw`w-20 h-20 rounded-xl bg-gray-100 items-center justify-center mr-4`}>
                      {producto.imagen_url ? (
                        <Image
                          source={{ uri: producto.imagen_url }}
                          style={tw`w-full h-full rounded-xl`}
                          resizeMode="cover"
                        />
                      ) : (
                        <Text style={tw`text-3xl`}>{getProductIcon(producto.nombre)}</Text>
                      )}
                    </View>

                    {/* Product Info */}
                    <View style={tw`flex-1`}>
                      <View style={tw`flex-row justify-between items-start mb-2`}>
                        <Text style={tw`text-lg font-bold text-gray-800 flex-1 mr-2`}>
                          {producto.nombre}
                        </Text>
                        <View style={tw`items-end`}>
                          <Text style={tw`text-xl font-bold text-blue-600`}>
                            ${producto.precio.toFixed(2)}
                          </Text>
                          <View style={tw`${getStockBadgeColor(producto.stock_actual || 0)} rounded-full px-2 py-1 mt-1`}>
                            <Text style={tw`${getStockColor(producto.stock_actual || 0)} text-xs font-medium`}>
                              {isOutOfStock(producto) ? 'Agotado' : `Stock: ${producto.stock_actual}`}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <Text style={tw`text-gray-600 text-sm mb-3 leading-5`}>
                        {producto.descripcion || 'Producto fresco y delicioso preparado diariamente'}
                      </Text>

                      {/* Quantity and Add to Cart */}
                      {!isOutOfStock(producto) && (
                        <View style={tw`flex-row items-center justify-between`}>
                          {/* Quantity Selector */}
                          <View style={tw`flex-row items-center bg-gray-100 rounded-xl`}>
                            <TouchableOpacity
                              style={tw`p-2 rounded-l-xl`}
                              onPress={() => setQuantity(producto.id, getQuantity(producto.id) - 1)}
                            >
                              <Text style={tw`text-lg font-bold text-gray-600`}>−</Text>
                            </TouchableOpacity>
                            <Text style={tw`px-4 py-2 text-lg font-bold text-gray-800`}>
                              {getQuantity(producto.id)}
                            </Text>
                            <TouchableOpacity
                              style={tw`p-2 rounded-r-xl`}
                              onPress={() => {
                                const maxQuantity = producto.stock_actual || 1;
                                if (getQuantity(producto.id) < maxQuantity) {
                                  setQuantity(producto.id, getQuantity(producto.id) + 1);
                                }
                              }}
                            >
                              <Text style={tw`text-lg font-bold text-gray-600`}>+</Text>
                            </TouchableOpacity>
                          </View>

                          {/* Add to Cart Button */}
                          <TouchableOpacity
                            style={tw`bg-blue-500 rounded-xl py-3 px-6 flex-row items-center`}
                            onPress={() => handleAddToCart(producto)}
                            activeOpacity={0.8}
                          >
                            <Text style={tw`text-white font-semibold mr-2`}>Agregar</Text>
                            <Text style={tw`text-white text-lg`}>🛒</Text>
                          </TouchableOpacity>
                        </View>
                      )}

                      {/* Out of Stock Message */}
                      {isOutOfStock(producto) && (
                        <View style={tw`bg-red-100 rounded-xl py-3 px-4 flex-row items-center justify-center`}>
                          <Text style={tw`text-red-600 font-semibold mr-2`}>Producto agotado</Text>
                          <Text style={tw`text-red-600 text-lg`}>❌</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Info Section */}
        {productos.length > 0 && (
          <View style={tw`mx-6 mb-6 bg-white rounded-2xl p-6 shadow-sm`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>ℹ️ Información</Text>
            <Text style={tw`text-gray-600 text-base leading-6`}>
              Todos nuestros productos son frescos y preparados diariamente.
              Los precios incluyen todos los impuestos. Stock actualizado en tiempo real.
            </Text>
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={tw`h-6`} />
      </ScrollView>
    </SafeAreaView>
  );
};