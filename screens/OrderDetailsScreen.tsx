import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  ActivityIndicator,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
// QRCode temporalmente removido para solucionar error de react-native-svg
// import QRCode from 'react-native-qrcode-svg';
import { useFacturas, Factura, FacturaDetalle } from '../hooks/useServices';

interface OrderDetailsScreenProps {
  navigation: any;
  route: {
    params: {
      facturaId: number;
      numeroFactura: string;
      total: number;
    };
  };
}

export const OrderDetailsScreen: React.FC<OrderDetailsScreenProps> = ({ navigation, route }) => {
  const { facturaId, numeroFactura, total } = route.params;
  const { facturas, loading: facturasLoading } = useFacturas();
  const [facturaDetails, setFacturaDetails] = useState<Factura | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFacturaDetails();
  }, []);

  const fetchFacturaDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar la factura específica
      const factura = facturas.find(f => f.id === facturaId);
      
      if (factura) {
        setFacturaDetails(factura);
      } else {
        // Si no se encuentra, crear una factura mock con los datos disponibles
        const mockFactura: Factura = {
          id: facturaId,
          numero_factura: numeroFactura,
          cliente_id: 'user-id',
          empleado_id: 'employee-id',
          subtotal: total / 1.16,
          impuesto: total * 0.16 / 1.16,
          descuento: 0,
          total: total,
          estado: 'pagado',
          metodo_pago: 'efectivo',
          notas: 'Pedido desde la aplicación móvil',
          fecha_factura: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          detalles: []
        };
        setFacturaDetails(mockFactura);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const generateQRData = () => {
    return `FACTURA:${numeroFactura}|TOTAL:${total}|FECHA:${new Date().toISOString().split('T')[0]}`;
  };

  const shareOrder = async () => {
    try {
      const message = `🧾 Mi Pedido\n\n` +
        `📋 Número: ${numeroFactura}\n` +
        `📅 Fecha: ${facturaDetails ? formatDate(facturaDetails.fecha_factura) : new Date().toLocaleDateString()}\n` +
        `💰 Total: $${total?.toFixed(2)}\n` +
        `📦 Estado: ${facturaDetails ? getStatusText(facturaDetails.estado) : 'Procesado'}\n\n` +
        `¡Gracias por tu compra!`;

      await Share.share({
        message: message,
        title: 'Mi Pedido'
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'pagado': return { bg: 'bg-green-100', text: 'text-green-800', icon: '✅' };
      case 'pendiente': return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳' };
      case 'cancelado': return { bg: 'bg-red-100', text: 'text-red-800', icon: '❌' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', icon: '❓' };
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'pagado': return 'Pagado';
      case 'pendiente': return 'Pendiente';
      case 'cancelado': return 'Cancelado';
      default: return estado;
    }
  };

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

  const formatPrice = (price: number) => {
    return `$${price?.toFixed(2) || '0.00'}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={tw`mt-4 text-gray-600 text-lg`}>Cargando detalles del pedido...</Text>
      </SafeAreaView>
    );
  }

  if (error || !facturaDetails) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center px-6`}>
        <Text style={tw`text-6xl mb-4`}>❌</Text>
        <Text style={tw`text-xl font-bold text-gray-800 mb-2 text-center`}>Error al cargar el pedido</Text>
        <Text style={tw`text-gray-600 text-center mb-6`}>No se pudieron obtener los detalles del pedido</Text>
        <TouchableOpacity
          style={tw`bg-blue-500 rounded-2xl py-3 px-6`}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={tw`text-white font-bold`}>Volver al Inicio</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const statusStyle = getStatusColor(facturaDetails.estado);

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      {/* Header */}
      <View style={tw`bg-white px-6 py-4 shadow-sm`}>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity
            style={tw`mr-4 p-2 rounded-full bg-blue-100`}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={tw`text-xl text-blue-600`}>←</Text>
          </TouchableOpacity>
          <View style={tw`flex-1`}>
            <Text style={tw`text-2xl font-bold text-blue-600`}>Detalles del Pedido</Text>
            <Text style={tw`text-gray-600`}>{numeroFactura}</Text>
          </View>
          <TouchableOpacity
            style={tw`p-2 rounded-full bg-blue-100`}
            onPress={shareOrder}
          >
            <Text style={tw`text-xl`}>📤</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        {/* Success Message */}
        <View style={tw`mx-6 mt-6 bg-green-50 rounded-2xl p-6 border border-green-200`}>
          <View style={tw`items-center`}>
            <Text style={tw`text-6xl mb-4`}>🛒</Text>
            <Text style={tw`text-2xl font-bold text-green-800 mb-2 text-center`}>¡Pedido Realizado!</Text>
            <Text style={tw`text-green-700 text-center text-lg`}>Tu pedido ha sido procesado exitosamente</Text>
          </View>
        </View>

        {/* QR Code Section */}
        <View style={tw`mx-6 mt-6 bg-white rounded-2xl p-6 shadow-sm items-center`}>
          <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>Código QR del Pedido</Text>
          
          <View style={tw`w-48 h-48 bg-white rounded-2xl items-center justify-center mb-4 border border-gray-200`}>
            {/* QRCode temporalmente reemplazado por un texto para solucionar error de react-native-svg */}
            <View style={tw`w-40 h-40 bg-gray-200 rounded-xl items-center justify-center`}>
              <Text style={tw`text-gray-800 font-bold text-center p-4`}>Código QR no disponible temporalmente</Text>
            </View>
          </View>
          
          <Text style={tw`text-gray-600 text-center text-sm`}>Muestra este código para confirmar tu pedido</Text>
        </View>

        {/* Order Status */}
        <View style={tw`mx-6 mt-6 bg-white rounded-2xl p-6 shadow-sm`}>
          <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>Estado del Pedido</Text>
          
          <View style={tw`${statusStyle.bg} rounded-xl p-4 flex-row items-center`}>
            <Text style={tw`text-2xl mr-3`}>{statusStyle.icon}</Text>
            <View style={tw`flex-1`}>
              <Text style={tw`${statusStyle.text} font-bold text-lg capitalize`}>
                {getStatusText(facturaDetails.estado)}
              </Text>
              <Text style={tw`${statusStyle.text} opacity-80`}>
                {facturaDetails.estado === 'pendiente' && 'Tu pedido está siendo procesado'}
                {facturaDetails.estado === 'pagado' && 'Pedido pagado y confirmado'}
                {facturaDetails.estado === 'cancelado' && 'Pedido cancelado'}
              </Text>
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View style={tw`mx-6 mt-6 bg-white rounded-2xl p-6 shadow-sm`}>
          <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>Resumen del Pedido</Text>
          
          {/* Products */}
          {facturaDetails.detalles && facturaDetails.detalles.length > 0 ? (
            facturaDetails.detalles.map((detalle, index) => (
              <View key={index} style={tw`flex-row items-center py-3 border-b border-gray-100`}>
                <View style={tw`w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4`}>
                  <Text style={tw`text-xl`}>{getProductIcon(detalle.producto?.nombre || 'producto')}</Text>
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-gray-800 font-semibold`}>{detalle.producto?.nombre || 'Producto'}</Text>
                  <Text style={tw`text-gray-600 text-sm`}>Cantidad: {detalle.cantidad} x {formatPrice(detalle.precio_unitario)}</Text>
                </View>
                <Text style={tw`text-gray-800 font-bold`}>{formatPrice(detalle.precio_total)}</Text>
              </View>
            ))
          ) : (
            <View style={tw`flex-row items-center py-3 border-b border-gray-100`}>
              <View style={tw`w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4`}>
                <Text style={tw`text-xl`}>🍽️</Text>
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-gray-800 font-semibold`}>Productos del pedido</Text>
                <Text style={tw`text-gray-600 text-sm`}>Detalles no disponibles</Text>
              </View>
              <Text style={tw`text-gray-800 font-bold`}>{formatPrice(facturaDetails.total)}</Text>
            </View>
          )}
          
          {/* Totals */}
          <View style={tw`mt-4 pt-4 border-t border-gray-200`}>
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`text-gray-600`}>Subtotal</Text>
              <Text style={tw`text-gray-800 font-semibold`}>{formatPrice(facturaDetails.subtotal)}</Text>
            </View>
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`text-gray-600`}>Impuestos</Text>
              <Text style={tw`text-gray-800 font-semibold`}>{formatPrice(facturaDetails.impuesto)}</Text>
            </View>
            {facturaDetails.descuento > 0 && (
              <View style={tw`flex-row justify-between mb-2`}>
                <Text style={tw`text-gray-600`}>Descuento</Text>
                <Text style={tw`text-red-600 font-semibold`}>-{formatPrice(facturaDetails.descuento)}</Text>
              </View>
            )}
            <View style={tw`flex-row justify-between pt-2 border-t border-gray-200`}>
              <Text style={tw`text-xl font-bold text-gray-800`}>Total</Text>
              <Text style={tw`text-xl font-bold text-green-600`}>{formatPrice(facturaDetails.total)}</Text>
            </View>
          </View>
        </View>

        {/* Order Info */}
        <View style={tw`mx-6 mt-6 bg-white rounded-2xl p-6 shadow-sm`}>
          <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>Información del Pedido</Text>
          
          <View style={tw`space-y-3`}>
            <View style={tw`flex-row justify-between`}>
              <Text style={tw`text-gray-600`}>Número de Factura</Text>
              <Text style={tw`text-gray-800 font-semibold`}>{facturaDetails.numero_factura}</Text>
            </View>
            <View style={tw`flex-row justify-between`}>
              <Text style={tw`text-gray-600`}>Fecha del Pedido</Text>
              <Text style={tw`text-gray-800 font-semibold`}>{formatDate(facturaDetails.fecha_factura)}</Text>
            </View>
            <View style={tw`flex-row justify-between`}>
              <Text style={tw`text-gray-600`}>Método de Pago</Text>
              <Text style={tw`text-gray-800 font-semibold capitalize`}>{facturaDetails.metodo_pago || 'Efectivo'}</Text>
            </View>
            <View style={tw`flex-row justify-between`}>
              <Text style={tw`text-gray-600`}>Estado</Text>
              <Text style={tw`text-gray-800 font-semibold`}>{getStatusText(facturaDetails.estado)}</Text>
            </View>
            {facturaDetails.notas && (
              <View style={tw`flex-row justify-between`}>
                <Text style={tw`text-gray-600`}>Notas</Text>
                <Text style={tw`text-gray-800 font-semibold flex-1 text-right`}>{facturaDetails.notas}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={tw`mx-6 mt-6 mb-6`}>
          <TouchableOpacity
            style={tw`bg-blue-500 rounded-2xl py-4 items-center mb-3`}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={tw`text-white font-bold text-lg`}>Realizar Otro Pedido</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={tw`bg-gray-200 rounded-2xl py-4 items-center`}
            onPress={shareOrder}
          >
            <Text style={tw`text-gray-800 font-bold text-lg`}>Compartir Pedido</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={tw`h-6`} />
      </ScrollView>
    </SafeAreaView>
  );
};