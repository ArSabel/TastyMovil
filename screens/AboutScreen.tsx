import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { ArrowLeft, Users, Target, Award } from 'lucide-react-native';

interface AboutScreenProps {
  navigation: any;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={tw`flex-1 bg-white`} edges={['top']}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between px-6 py-4 bg-blue-500`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`p-2`}
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-white`}>Nosotros</Text>
        <View style={tw`w-8`} />
      </View>

      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={tw`px-6 py-8 bg-gradient-to-b from-blue-50 to-white`}>
          <Text style={tw`text-3xl font-bold text-gray-800 text-center mb-4`}>
            TastyFood
          </Text>
          <Text style={tw`text-lg text-gray-600 text-center leading-6`}>
            Somos la Empresa Pública de producción y desarrollo estratégico de la Universidad Laica Eloy Alfaro de Manabí
          </Text>
        </View>

        {/* Mission & Vision */}
        <View style={tw`px-6 py-6`}>
          <View style={tw`mb-8`}>
            <View style={tw`flex-row items-center mb-4`}>
              <Target size={24} color="#3B82F6" />
              <Text style={tw`text-xl font-bold text-gray-800 ml-3`}>Nuestra Misión</Text>
            </View>
            <Text style={tw`text-gray-600 leading-6`}>
              Brindar servicios de alimentación de calidad premium a la comunidad universitaria, 
              utilizando ingredientes frescos y promoviendo una experiencia gastronómica excepcional 
              que contribuya al bienestar y desarrollo académico de nuestros estudiantes.
            </Text>
          </View>

          <View style={tw`mb-8`}>
            <View style={tw`flex-row items-center mb-4`}>
              <Users size={24} color="#3B82F6" />
              <Text style={tw`text-xl font-bold text-gray-800 ml-3`}>Nuestra Visión</Text>
            </View>
            <Text style={tw`text-gray-600 leading-6`}>
              Ser reconocidos como la empresa líder en servicios de alimentación universitaria, 
              estableciendo estándares de excelencia en calidad, innovación y sostenibilidad 
              que sirvan de modelo para otras instituciones educativas.
            </Text>
          </View>
        </View>

        {/* Values */}
        <View style={tw`px-6 py-6 bg-gray-50`}>
          <View style={tw`flex-row items-center mb-6`}>
            <Award size={24} color="#3B82F6" />
            <Text style={tw`text-xl font-bold text-gray-800 ml-3`}>Nuestros Valores</Text>
          </View>
          
          <View style={tw`gap-4`}>
            <View style={tw`bg-white p-4 rounded-lg shadow-sm`}>
              <Text style={tw`font-semibold text-gray-800 mb-2`}>🥬 Calidad Premium</Text>
              <Text style={tw`text-gray-600`}>
                Utilizamos únicamente ingredientes frescos y de la más alta calidad en todos nuestros platillos.
              </Text>
            </View>
            
            <View style={tw`bg-white p-4 rounded-lg shadow-sm`}>
              <Text style={tw`font-semibold text-gray-800 mb-2`}>🚀 Servicio Rápido</Text>
              <Text style={tw`text-gray-600`}>
                Entregamos tu comida caliente y fresca en el menor tiempo posible, respetando tu horario académico.
              </Text>
            </View>
            
            <View style={tw`bg-white p-4 rounded-lg shadow-sm`}>
              <Text style={tw`font-semibold text-gray-800 mb-2`}>👨‍🍳 Experiencia Culinaria</Text>
              <Text style={tw`text-gray-600`}>
                Nuestros chefs tienen años de experiencia preparando comida deliciosa y nutritiva.
              </Text>
            </View>
            
            <View style={tw`bg-white p-4 rounded-lg shadow-sm`}>
              <Text style={tw`font-semibold text-gray-800 mb-2`}>🌱 Sostenibilidad</Text>
              <Text style={tw`text-gray-600`}>
                Comprometidos con prácticas sostenibles y el cuidado del medio ambiente.
              </Text>
            </View>
          </View>
        </View>

        {/* University Connection */}
        <View style={tw`px-6 py-8`}>
          <Text style={tw`text-xl font-bold text-gray-800 mb-4 text-center`}>
            Universidad Laica Eloy Alfaro de Manabí
          </Text>
          <Text style={tw`text-gray-600 text-center leading-6`}>
            Como empresa pública de la ULEAM, nos enorgullece servir a nuestra comunidad universitaria 
            con dedicación y excelencia, contribuyendo al desarrollo integral de nuestros estudiantes 
            a través de una alimentación saludable y de calidad.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};