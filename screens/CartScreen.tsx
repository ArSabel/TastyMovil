import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import tw from 'twrnc';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../hooks/useCart';
import { useCreateFactura } from '../hooks/useServices';

interface CartScreenProps {
  navigation: any;
}

export const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const { cartItems, loading, updateQuantity, removeFromCart, clearCart, getCartSummary } = useCart();
  const { createFactura, loading: creatingFactura } = useCreateFactura();
  const [processingOrder, setProcessingOrder] = useState(false);

  const summary = getCartSummary();

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

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: number) => {
    Alert.alert(
      'Eliminar Producto',
      '¿Estás seguro de que quieres eliminar este producto del carrito?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            removeFromCart(productId);
          }
        }
      ]
    );
  };

  const handleCheckout = async () => {
    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión para realizar el pedido');
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega productos antes de procesar el pedido');
      return;
    }

    try {
      setProcessingOrder(true);

      // Crear factura con los productos del carrito
      const facturaData = {
        cliente_id: user.id,
        empleado_id: user.id, // Por ahora el mismo usuario
        productos: cartItems.map(item => ({
          producto_id: item.producto.id,
          cantidad: item.cantidad,
          precio_unitario: item.producto.precio
        })),
        metodo_pago: 'efectivo' as const, // Por defecto
        notas: 'Pedido desde la aplicación móvil'
      };

      const factura = await createFactura(facturaData);

      // Limpiar carrito
      clearCart();

      // Mostrar confirmación
      Alert.alert(
        'Pedido realizado',
        `Tu pedido ha sido procesado exitosamente`,
        [
          {
            text: 'Ver detalles',
            onPress: () => navigation.navigate('OrderDetails', {
              facturaId: factura.id,
              numeroFactura: factura.numero_factura,
              total: factura.total
            })
          },
          {
            text: 'Continuar',
            onPress: () => navigation.navigate('Menu')
          }
        ]
      );

    } catch (err) {
      console.error('Error:', err);
      Alert.alert('Error', err instanceof Error ? err.message : 'Ocurrió un error inesperado');
    } finally {
      setProcessingOrder(false);
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

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
          <Text style={tw`text-xl font-bold text-white`}>Mi Carrito</Text>
          <View style={tw`w-8`} />
      </View>

      {cartItems.length === 0 ? (
        // Empty Cart
        <View style={tw`flex-1 justify-center items-center px-6`}>
          <Text style={tw`text-8xl mb-6`}>🛒</Text>
          <Text style={tw`text-2xl font-bold text-gray-800 mb-4 text-center`}>Tu carrito está vacío</Text>
          <Text style={tw`text-gray-600 text-center mb-8 text-lg leading-6`}>
            Explora nuestros productos y realiza tu pedido
          </Text>
          <TouchableOpacity
              style={tw`bg-blue-500 rounded-2xl py-4`}
              onPress={() => navigation.navigate('Menu')}
            >
            <Text style={tw`text-white font-bold text-lg`}>Explorar Productos</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Cart with Items
        <>
          <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
            {/* Cart Items */}
            <View style={tw`px-6 py-6`}>
              {cartItems.map((item, index) => (
                <View
                  key={`${item.producto.id}-${index}`}
                  style={tw`bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100`}
                >
                  <View style={tw`flex-row`}>
                    {/* Product Image */}
                    <View style={tw`w-16 h-16 rounded-xl bg-gray-100 items-center justify-center mr-4`}>
                      {item.producto.imagen_url ? (
                        <Image
                          source={{ uri: item.producto.imagen_url }}
                          style={tw`w-full h-full rounded-xl`}
                          resizeMode="cover"
                        />
                      ) : (
                        <Text style={tw`text-2xl`}>{getProductIcon(item.producto.nombre)}</Text>
                      )}
                    </View>

                    {/* Product Info */}
                    <View style={tw`flex-1`}>
                      <Text style={tw`text-lg font-bold text-gray-800 mb-1`}>
                        {item.producto.nombre}
                      </Text>
                      <Text style={tw`text-gray-600 text-sm mb-1`}>
                        {item.producto.descripcion || 'Producto fresco y delicioso'}
                      </Text>
                      <Text style={tw`text-lg font-bold text-blue-600 mb-2`}>
                {formatPrice(item.producto.precio)} c/u
              </Text>
                      <Text style={tw`text-gray-800 font-semibold`}>
                        Subtotal: {formatPrice(item.producto.precio * item.cantidad)}
                      </Text>
                    </View>

                    {/* Quantity Controls */}
                    <View style={tw`items-center ml-4`}>
                      <View style={tw`flex-row items-center bg-gray-100 rounded-xl`}>
                        <TouchableOpacity
                          style={tw`w-8 h-8 rounded-l-xl bg-red-500 items-center justify-center`}
                          onPress={() => handleUpdateQuantity(item.producto.id, item.cantidad - 1)}
                        >
                          <Text style={tw`text-white font-bold`}>−</Text>
                        </TouchableOpacity>
                        <Text style={tw`px-3 py-2 text-lg font-bold text-gray-800`}>
                          {item.cantidad}
                        </Text>
                        <TouchableOpacity
                          style={tw`w-8 h-8 rounded-r-xl bg-blue-500 items-center justify-center`}
                          onPress={() => handleUpdateQuantity(item.producto.id, item.cantidad + 1)}
                        >
                          <Text style={tw`text-white font-bold`}>+</Text>
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity
                        style={tw`mt-2 p-1`}
                        onPress={() => handleRemoveItem(item.producto.id)}
                      >
                        <Text style={tw`text-red-500 text-sm`}>Eliminar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Order Summary */}
          <View style={tw`bg-white px-6 py-6 shadow-lg`}>
            <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>Resumen del Pedido</Text>
            
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`text-gray-600`}>Subtotal</Text>
              <Text style={tw`text-gray-800 font-semibold`}>{formatPrice(summary.subtotal)}</Text>
            </View>
            
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`text-gray-600`}>Impuestos (16%)</Text>
              <Text style={tw`text-gray-800 font-semibold`}>{formatPrice(summary.tax)}</Text>
            </View>
            
            <View style={tw`border-t border-gray-200 pt-2 mt-2`}>
              <View style={tw`flex-row justify-between mb-4`}>
                <Text style={tw`text-xl font-bold text-gray-800`}>Total</Text>
                <Text style={tw`text-xl font-bold text-blue-600`}>{formatPrice(summary.total)}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={tw`bg-blue-500 rounded-2xl py-4 items-center ${
                processingOrder || creatingFactura ? 'opacity-50' : ''
              }`}
              onPress={handleCheckout}
              disabled={processingOrder || creatingFactura}
            >
              <Text style={tw`text-white font-bold text-lg`}>
                {processingOrder || creatingFactura ? 'Procesando...' : 'Realizar Pedido'}
              </Text>
            </TouchableOpacity>

            {/* Payment Methods Info */}
            <View style={tw`mt-4 bg-gray-50 rounded-xl p-4`}>
              <Text style={tw`text-gray-700 font-semibold mb-2`}>💳 Métodos de pago</Text>
              <Text style={tw`text-gray-600 text-sm`}>
                Efectivo
              </Text>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};