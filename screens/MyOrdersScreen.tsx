import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { ArrowLeft } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useFacturas, Factura } from '../hooks/useServices';

interface MyOrdersScreenProps {
  navigation: any;
}

export const MyOrdersScreen: React.FC<MyOrdersScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const { facturas, loading, error, refetch } = useFacturas(user?.id);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      refetch();
    }
  }, [user?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return `$${price?.toFixed(2) || '0.00'}`;
  };

  const handleOrderPress = (factura: Factura) => {
    navigation.navigate('OrderDetails', {
      facturaId: factura.id,
      numeroFactura: factura.numero_factura,
      total: factura.total
    });
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`} edges={['top']}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={tw`mt-4 text-gray-600 text-lg`}>Cargando pedidos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`} edges={['top']}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between px-6 py-4 bg-blue-500`}>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity
            style={tw`p-2`}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <View style={tw`flex-1`}>
            <Text style={tw`text-xl font-bold text-white`}>Mis Pedidos</Text>
            <Text style={tw`text-white opacity-80`}>Historial de pedidos realizados</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={tw`flex-1`}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {error ? (
          <View style={tw`flex-1 justify-center items-center px-6 py-12`}>
            <Text style={tw`text-6xl mb-4`}>❌</Text>
            <Text style={tw`text-xl font-bold text-gray-800 mb-2 text-center`}>Error al cargar pedidos</Text>
            <Text style={tw`text-gray-600 text-center mb-6`}>{error}</Text>
            <TouchableOpacity
              style={tw`bg-blue-500 rounded-2xl py-3 px-6`}
              onPress={onRefresh}
            >
              <Text style={tw`text-white font-bold`}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : facturas.length === 0 ? (
          <View style={tw`flex-1 justify-center items-center px-6 py-12`}>
            <Text style={tw`text-6xl mb-4`}>📋</Text>
            <Text style={tw`text-xl font-bold text-gray-800 mb-2 text-center`}>No tienes pedidos</Text>
            <Text style={tw`text-gray-600 text-center mb-6`}>Cuando realices tu primer pedido aparecerá aquí</Text>
            <TouchableOpacity
              style={tw`bg-blue-500 rounded-2xl py-3 px-6`}
              onPress={() => navigation.navigate('Sections')}
            >
              <Text style={tw`text-white font-bold`}>Explorar Menú</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={tw`px-6 py-4`}>
            {facturas.map((factura, index) => {
              const statusStyle = getStatusColor(factura.estado);
              return (
                <TouchableOpacity
                  key={factura.id}
                  style={tw`bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100`}
                  onPress={() => handleOrderPress(factura)}
                  activeOpacity={0.8}
                >
                  {/* Header del pedido */}
                  <View style={tw`flex-row justify-between items-start mb-4`}>
                    <View style={tw`flex-1`}>
                      <Text style={tw`text-lg font-bold text-gray-800 mb-1`}>
                        Pedido #{factura.numero_factura}
                      </Text>
                      <Text style={tw`text-gray-600 text-sm`}>
                        {formatDate(factura.fecha_factura)}
                      </Text>
                    </View>
                    <View style={tw`${statusStyle.bg} rounded-full px-3 py-1 flex-row items-center`}>
                      <Text style={tw`text-sm mr-1`}>{statusStyle.icon}</Text>
                      <Text style={tw`${statusStyle.text} font-semibold text-sm`}>
                        {getStatusText(factura.estado)}
                      </Text>
                    </View>
                  </View>

                  {/* Detalles del pedido */}
                  <View style={tw`border-t border-gray-100 pt-4`}>
                    <View style={tw`flex-row justify-between items-center mb-2`}>
                      <Text style={tw`text-gray-600`}>Total del pedido</Text>
                      <Text style={tw`text-xl font-bold text-gray-800`}>
                        {formatPrice(factura.total)}
                      </Text>
                    </View>
                    
                    {factura.detalles && factura.detalles.length > 0 && (
                      <View style={tw`flex-row justify-between items-center mb-2`}>
                        <Text style={tw`text-gray-600`}>Productos</Text>
                        <Text style={tw`text-gray-800 font-semibold`}>
                          {factura.detalles.length} {factura.detalles.length === 1 ? 'producto' : 'productos'}
                        </Text>
                      </View>
                    )}
                    
                    {factura.metodo_pago && (
                      <View style={tw`flex-row justify-between items-center`}>
                        <Text style={tw`text-gray-600`}>Método de pago</Text>
                        <Text style={tw`text-gray-800 font-semibold capitalize`}>
                          {factura.metodo_pago}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Indicador de navegación */}
                  <View style={tw`flex-row justify-end items-center mt-4 pt-4 border-t border-gray-100`}>
                    <Text style={tw`text-blue-600 font-semibold mr-2`}>Ver detalles</Text>
                    <Text style={tw`text-blue-600 text-lg`}>→</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={tw`h-6`} />
      </ScrollView>
    </SafeAreaView>
  );
};