import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { ArrowLeft, MapPin, Navigation, Clock, Phone } from 'lucide-react-native';

interface LocationsScreenProps {
  navigation: any;
}

export const LocationsScreen: React.FC<LocationsScreenProps> = ({ navigation }) => {
  const openMaps = () => {
    const url = 'https://maps.google.com/?q=Universidad+Laica+Eloy+Alfaro+de+Manabí,+Manta,+Ecuador';
    Linking.openURL(url);
  };

  const callPhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`} edges={['top']}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between px-6 py-4 bg-blue-500`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`p-2`}
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-white`}>Ubicaciones</Text>
        <View style={tw`w-8`} />
      </View>

      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        {/* Main Location */}
        <View style={tw`px-6 py-8`}>
          <View style={tw`bg-white rounded-2xl shadow-lg p-6 border border-gray-100`}>
            <View style={tw`flex-row items-center mb-4`}>
              <MapPin size={28} color="#3B82F6" />
              <Text style={tw`text-2xl font-bold text-gray-800 ml-3`}>Campus Principal</Text>
            </View>
            
            <Text style={tw`text-lg font-semibold text-gray-800 mb-2`}>
              Universidad Laica Eloy Alfaro de Manabí
            </Text>
            
            <Text style={tw`text-gray-600 mb-4 leading-6`}>
              Ciudadela Universitaria Vía San Mateo{"\n"}
              Manta, Manabí, Ecuador
            </Text>
            
            <TouchableOpacity
              onPress={openMaps}
              style={tw`bg-blue-500 rounded-xl py-3 px-4 flex-row items-center justify-center mb-4`}
            >
              <Navigation size={20} color="white" />
              <Text style={tw`text-white font-semibold ml-2`}>Ver en Google Maps</Text>
            </TouchableOpacity>
            
            {/* Contact Info */}
            <View style={tw`border-t border-gray-200 pt-4`}>
              <Text style={tw`text-lg font-semibold text-gray-800 mb-3`}>Información de Contacto</Text>
              
              <TouchableOpacity
                onPress={() => callPhone('+593958951061')}
                style={tw`flex-row items-center mb-3 p-3 bg-gray-50 rounded-lg`}
              >
                <Phone size={20} color="#3B82F6" />
                <Text style={tw`text-gray-700 ml-3 font-medium`}>+593 95 895 1061</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => callPhone('052679600')}
                style={tw`flex-row items-center mb-3 p-3 bg-gray-50 rounded-lg`}
              >
                <Phone size={20} color="#3B82F6" />
                <Text style={tw`text-gray-700 ml-3 font-medium`}>052 679 600</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Operating Hours */}
        <View style={tw`px-6 pb-8`}>
          <View style={tw`bg-blue-50 rounded-2xl p-6 border border-blue-100`}>
            <View style={tw`flex-row items-center mb-4`}>
              <Clock size={24} color="#3B82F6" />
              <Text style={tw`text-xl font-bold text-gray-800 ml-3`}>Horarios de Atención</Text>
            </View>
            
            <View style={tw`gap-3`}>
              <View style={tw`flex-row justify-between items-center py-2`}>
                <Text style={tw`text-gray-700 font-medium`}>Lunes - Viernes</Text>
                <Text style={tw`text-gray-800 font-semibold`}>8:00 - 17:00</Text>
              </View>
              
              <View style={tw`flex-row justify-between items-center py-2 border-t border-blue-200`}>
                <Text style={tw`text-gray-700 font-medium`}>Sábado</Text>
                <Text style={tw`text-gray-800 font-semibold`}>8:00 - 14:00</Text>
              </View>
              
              <View style={tw`flex-row justify-between items-center py-2 border-t border-blue-200`}>
                <Text style={tw`text-gray-700 font-medium`}>Domingo</Text>
                <Text style={tw`text-red-600 font-semibold`}>Cerrado</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Additional Info */}
        <View style={tw`px-6 pb-8`}>
          <View style={tw`bg-blue-50 rounded-2xl p-6 border border-blue-100`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>Información Adicional</Text>
            
            <View style={tw`gap-3`}>
              <View style={tw`flex-row items-start`}>
                <Text style={tw`text-blue-600 font-bold mr-2`}>•</Text>
                <Text style={tw`text-gray-700 flex-1`}>
                  Servicio de comida disponible en múltiples puntos del campus
                </Text>
              </View>
              
              <View style={tw`flex-row items-start`}>
                <Text style={tw`text-blue-600 font-bold mr-2`}>•</Text>
                <Text style={tw`text-gray-700 flex-1`}>
                  Entrega rápida a oficinas y aulas durante horarios académicos
                </Text>
              </View>
              
              <View style={tw`flex-row items-start`}>
                <Text style={tw`text-blue-600 font-bold mr-2`}>•</Text>
                <Text style={tw`text-gray-700 flex-1`}>
                  Estacionamiento disponible para estudiantes y personal
                </Text>
              </View>
              
              <View style={tw`flex-row items-start`}>
                <Text style={tw`text-blue-600 font-bold mr-2`}>•</Text>
                <Text style={tw`text-gray-700 flex-1`}>
                  Acceso fácil desde las principales vías de Manta
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};