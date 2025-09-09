import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import tw from 'twrnc';
import { useSecciones } from '../hooks/useServices';

interface RestaurantsScreenProps {
  navigation: any;
}

export const RestaurantsScreen: React.FC<RestaurantsScreenProps> = ({ navigation }) => {
  const { secciones: services, loading, error } = useSecciones();
  const refetch = () => {}; // Placeholder for refetch functionality

  const renderService = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={tw`bg-white mx-4 mb-4 rounded-xl shadow-sm border border-gray-100`}
      onPress={() => {
        // Navigate to restaurant details
        console.log('Navigate to service:', item.id);
      }}
    >
      <View style={tw`p-4`}>
        <View style={tw`flex-row justify-between items-start mb-2`}>
          <Text style={tw`text-lg font-bold text-gray-800 flex-1`}>
            {item.name}
          </Text>
          <View style={tw`bg-green-100 px-2 py-1 rounded-full ml-2`}>
            <Text style={tw`text-green-800 text-xs font-semibold`}>Abierto</Text>
          </View>
        </View>
        
        {item.description && (
          <Text style={tw`text-gray-600 mb-3 leading-5`}>
            {item.description}
          </Text>
        )}
        
        <View style={tw`flex-row justify-between items-center`}>
          <View>
            {item.address && (
              <Text style={tw`text-gray-500 text-sm mb-1`}>📍 {item.address}</Text>
            )}
            {item.phone && (
              <Text style={tw`text-gray-500 text-sm`}>📞 {item.phone}</Text>
            )}
          </View>
          
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-yellow-500 mr-1`}>⭐</Text>
            <Text style={tw`text-gray-600 font-semibold`}>4.5</Text>
          </View>
        </View>
        
        <View style={tw`flex-row justify-between items-center mt-3 pt-3 border-t border-gray-100`}>
          <Text style={tw`text-gray-500 text-sm`}>Tiempo estimado: 30-45 min</Text>
          <Text style={tw`text-blue-600 font-semibold`}>Ver menú →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={tw`flex-1 justify-center items-center px-6`}>
      <Text style={tw`text-6xl mb-4`}>🍽️</Text>
      <Text style={tw`text-xl font-bold text-gray-800 mb-2 text-center`}>
        No hay servicios disponibles
      </Text>
      <Text style={tw`text-gray-600 text-center mb-4`}>
        Parece que no hay servicios registrados en este momento.
      </Text>
      <TouchableOpacity
        style={tw`bg-blue-600 px-6 py-3 rounded-lg`}
        onPress={refetch}
      >
        <Text style={tw`text-white font-semibold`}>Intentar de nuevo</Text>
      </TouchableOpacity>
    </View>
  );

  const renderError = () => (
    <View style={tw`flex-1 justify-center items-center px-6`}>
      <Text style={tw`text-6xl mb-4`}>❌</Text>
      <Text style={tw`text-xl font-bold text-gray-800 mb-2 text-center`}>
        Error al cargar servicios
      </Text>
      <Text style={tw`text-gray-600 text-center mb-4`}>
        {error}
      </Text>
      <TouchableOpacity
        style={tw`bg-blue-600 px-6 py-3 rounded-lg`}
        onPress={refetch}
      >
        <Text style={tw`text-white font-semibold`}>Reintentar</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && services.length === 0) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 pt-4`}>
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={tw`text-gray-600 mt-4`}>Cargando servicios...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && services.length === 0) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50`}>
        {renderError()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      {/* Header */}
      <View style={tw`bg-white px-4 py-4 shadow-sm`}>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity
            style={tw`mr-4`}
            onPress={() => navigation.goBack()}
          >
            <Text style={tw`text-2xl`}>←</Text>
          </TouchableOpacity>
          <Text style={tw`text-xl font-bold text-gray-800`}>Servicios</Text>
        </View>
      </View>

      {services.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={services}
          renderItem={renderService}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={tw`py-4`}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refetch}
              colors={['#3B82F6']}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};