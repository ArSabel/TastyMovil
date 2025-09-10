import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { ArrowLeft } from 'lucide-react-native';
import { useSecciones } from '../hooks/useServices';

interface AllCategoriesScreenProps {
  navigation: any;
}

export const AllCategoriesScreen: React.FC<AllCategoriesScreenProps> = ({ navigation }) => {
  const { secciones, loading, error } = useSecciones();
  
  const getSectionIcon = (nombre: string) => {
    const name = nombre.toLowerCase();
    if (name.includes('desayuno')) return '🌅';
    if (name.includes('almuerzo')) return '🍽️';
    if (name.includes('merienda')) return '🧁';
    if (name.includes('bebida')) return '🥤';
    if (name.includes('postre')) return '🍰';
    if (name.includes('snack')) return '🍿';
    return '🍴';
  };

  const getSectionColor = (index: number) => {
    const colors = [
      { bg: 'bg-blue-100', text: 'text-blue-600' },
      { bg: 'bg-green-100', text: 'text-green-600' },
      { bg: 'bg-blue-100', text: 'text-blue-600' },
      { bg: 'bg-yellow-100', text: 'text-yellow-600' },
      { bg: 'bg-pink-100', text: 'text-pink-600' },
      { bg: 'bg-purple-100', text: 'text-purple-600' },
    ];
    return colors[index % colors.length];
  };

  if (error) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center px-6`} edges={['top']}>
        <Text style={tw`text-6xl mb-4`}>❌</Text>
        <Text style={tw`text-xl font-bold text-gray-800 mb-2 text-center`}>Error al cargar categorías</Text>
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
        <Text style={tw`mt-4 text-gray-600 text-lg`}>Cargando categorías...</Text>
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
        <Text style={tw`text-xl font-bold text-white`}>Todas las Categorías</Text>
        <View style={tw`w-10`} />
      </View>

      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        <View style={tw`px-6 py-6`}>
          <Text style={tw`text-2xl font-bold text-gray-800 mb-6`}>Explora nuestras categorías</Text>
          
          {secciones.length === 0 ? (
            <View style={tw`bg-white rounded-2xl p-8 items-center shadow-sm`}>
              <Text style={tw`text-6xl mb-4`}>🍴</Text>
              <Text style={tw`text-xl font-bold text-gray-800 mb-2`}>No hay categorías disponibles</Text>
              <Text style={tw`text-gray-600 text-center`}>Por el momento no hay categorías en el menú</Text>
            </View>
          ) : (
            <View style={tw`flex-row flex-wrap justify-between`}>
              {secciones.map((seccion, index) => {
                const colorScheme = getSectionColor(index);
                return (
                  <TouchableOpacity
                    key={seccion.id}
                    style={tw`${colorScheme.bg} rounded-2xl p-6 mb-4 w-[48%] items-center shadow-sm`}
                    onPress={() => navigation.navigate('Products', { sectionId: seccion.id, sectionName: seccion.nombre })}
                    activeOpacity={0.8}
                  >
                    <Text style={tw`text-5xl mb-4`}>{getSectionIcon(seccion.nombre)}</Text>
                    <Text style={tw`${colorScheme.text} font-bold text-lg text-center`}>
                      {seccion.nombre}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={tw`h-6`} />
      </ScrollView>
    </SafeAreaView>
  );
};