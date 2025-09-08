import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import tw from 'twrnc';
import { useSecciones } from '../hooks/useServices';

interface SectionsScreenProps {
  navigation: any;
  route: any;
}

export const SectionsScreen: React.FC<SectionsScreenProps> = ({ navigation }) => {
  const { secciones, loading, error } = useSecciones();

  const getSectionIcon = (nombre: string) => {
    const name = nombre.toLowerCase();
    if (name.includes('desayuno')) return '🌅';
    if (name.includes('almuerzo')) return '🍽️';
    if (name.includes('merienda')) return '🧁';
    if (name.includes('bebida')) return '🥤';
    if (name.includes('postre')) return '🍰';
    return '🍴';
  };

  const getSectionColor = (index: number) => {
    const colors = [
      { bg: 'bg-orange-100', text: 'text-orange-600' },
      { bg: 'bg-red-100', text: 'text-red-600' },
      { bg: 'bg-yellow-100', text: 'text-yellow-600' },
      { bg: 'bg-orange-50', text: 'text-orange-700' },
    ];
    return colors[index % colors.length];
  };

  const handleSectionPress = (seccion: any) => {
    navigation.navigate('Products', {
      sectionId: seccion.id,
      sectionName: seccion.nombre,
    });
  };

  if (error) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center px-6`}>
        <Text style={tw`text-6xl mb-4`}>❌</Text>
        <Text style={tw`text-xl font-bold text-gray-800 mb-2 text-center`}>Error al cargar secciones</Text>
        <Text style={tw`text-gray-600 text-center mb-6`}>{error}</Text>
        <TouchableOpacity
          style={tw`bg-orange-500 rounded-2xl py-3 px-6`}
          onPress={() => navigation.goBack()}
        >
          <Text style={tw`text-white font-bold`}>Volver</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
        <ActivityIndicator size="large" color="#EA580C" />
        <Text style={tw`mt-4 text-gray-600 text-lg`}>Cargando secciones...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      {/* Header */}
      <View style={tw`bg-white px-6 py-4 shadow-sm`}>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity
            style={tw`mr-4 p-2 rounded-full bg-orange-100`}
            onPress={() => navigation.goBack()}
          >
            <Text style={tw`text-xl text-orange-600`}>←</Text>
          </TouchableOpacity>
          <Text style={tw`text-2xl font-bold text-orange-600`}>Nuestro Menú</Text>
        </View>
      </View>

      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        <View style={tw`px-6 py-6`}>
          <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Elige tu sección favorita:</Text>
          
          {secciones.length === 0 ? (
            <View style={tw`bg-white rounded-2xl p-8 items-center shadow-sm`}>
              <Text style={tw`text-6xl mb-4`}>🍴</Text>
              <Text style={tw`text-xl font-bold text-gray-800 mb-2`}>No hay secciones disponibles</Text>
              <Text style={tw`text-gray-600 text-center`}>Por el momento no hay secciones en el menú</Text>
            </View>
          ) : (
            <View>
              {secciones.map((seccion, index) => {
                const colorScheme = getSectionColor(index);
                return (
                  <TouchableOpacity
                    key={seccion.id}
                    style={tw`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 active:bg-gray-50 ${index > 0 ? 'mt-4' : ''}`}
                    onPress={() => handleSectionPress(seccion)}
                  >
                    <View style={tw`flex-row items-center`}>
                      <View style={tw`w-16 h-16 ${colorScheme.bg} rounded-2xl items-center justify-center mr-4`}>
                        <Text style={tw`text-3xl`}>{getSectionIcon(seccion.nombre)}</Text>
                      </View>
                      <View style={tw`flex-1`}>
                        <Text style={tw`text-xl font-bold text-gray-800 mb-1`}>{seccion.nombre}</Text>
                        <Text style={tw`text-gray-600 mb-2`}>{seccion.descripcion}</Text>
                        <View style={tw`flex-row items-center`}>
                          <View style={tw`bg-green-100 rounded-full px-3 py-1`}>
                            <Text style={tw`text-sm font-medium text-green-700`}>Disponible</Text>
                          </View>
                        </View>
                      </View>
                      <View style={tw`ml-4`}>
                        <Text style={tw`text-2xl text-gray-400`}>→</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Info Section */}
        <View style={tw`mx-6 mb-6 bg-white rounded-2xl p-6 shadow-sm`}>
          <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>💡 Información</Text>
          <Text style={tw`text-gray-600 text-base leading-6`}>
            Todos nuestros productos están preparados frescos diariamente. 
            Verifica la disponibilidad de stock en cada sección.
          </Text>
        </View>

        {/* Bottom Spacing */}
        <View style={tw`h-6`} />
      </ScrollView>
    </SafeAreaView>
  );
};