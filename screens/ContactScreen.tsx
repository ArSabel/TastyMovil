import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { ArrowLeft, Phone, Mail, MessageCircle, Clock } from 'lucide-react-native';

interface ContactScreenProps {
  navigation: any;
}

export const ContactScreen: React.FC<ContactScreenProps> = ({ navigation }) => {
  const callPhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const sendEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const sendWhatsApp = () => {
    const message = 'Hola, me gustaría obtener información sobre TastyFood';
    const url = `whatsapp://send?phone=593958951061&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'WhatsApp no está instalado en este dispositivo');
        }
      })
      .catch(() => {
        Alert.alert('Error', 'No se pudo abrir WhatsApp');
      });
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
          <Text style={tw`text-xl font-bold text-white`}>Contacto</Text>
          <View style={tw`w-8`} />
      </View>

      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={tw`px-6 py-8 bg-gradient-to-b from-blue-50 to-white`}>
          <Text style={tw`text-2xl font-bold text-gray-800 text-center mb-4`}>
            ¿Necesitas ayuda?
          </Text>
          <Text style={tw`text-gray-600 text-center leading-6`}>
            Estamos aquí para atenderte. Contáctanos por cualquiera de estos medios.
          </Text>
        </View>

        {/* Contact Methods */}
        <View style={tw`px-6 pb-6`}>
          {/* Phone Contacts */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>Teléfonos</Text>
            
            <TouchableOpacity
              onPress={() => callPhone('+593958951061')}
              style={tw`bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3 flex-row items-center`}
            >
              <View style={tw`bg-green-100 p-3 rounded-full mr-4`}>
                <Phone size={24} color="#16a34a" />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-lg font-semibold text-gray-800`}>Móvil Principal</Text>
                <Text style={tw`text-gray-600`}>+593 95 895 1061</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => callPhone('052679600')}
              style={tw`bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3 flex-row items-center`}
            >
              <View style={tw`bg-blue-100 p-3 rounded-full mr-4`}>
                <Phone size={24} color="#2563eb" />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-lg font-semibold text-gray-800`}>Oficina Principal</Text>
                <Text style={tw`text-gray-600`}>052 679 600</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Email */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>Correo Electrónico</Text>
            
            <TouchableOpacity
              onPress={() => sendEmail('gerencia@ep-uleam.gob.ec')}
              style={tw`bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-row items-center`}
            >
              <View style={tw`bg-red-100 p-3 rounded-full mr-4`}>
                <Mail size={24} color="#dc2626" />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-lg font-semibold text-gray-800`}>Gerencia</Text>
                <Text style={tw`text-gray-600`}>gerencia@ep-uleam.gob.ec</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* WhatsApp */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>WhatsApp</Text>
            
            <TouchableOpacity
              onPress={sendWhatsApp}
              style={tw`bg-green-500 rounded-xl p-4 shadow-sm flex-row items-center justify-center`}
            >
              <MessageCircle size={24} color="white" />
              <Text style={tw`text-white font-semibold text-lg ml-3`}>Chatear por WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Operating Hours */}
        <View style={tw`px-6 pb-6`}>
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


      </ScrollView>
    </SafeAreaView>
  );
};