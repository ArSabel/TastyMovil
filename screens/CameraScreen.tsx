import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Image,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import tw from 'twrnc';

interface CameraScreenProps {
  navigation: any;
}

export const CameraScreen: React.FC<CameraScreenProps> = ({ navigation }) => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    // Camera permissions are still loading
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
        <Text style={tw`text-gray-600`}>Cargando permisos de cámara...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center px-6`}>
        <Text style={tw`text-6xl mb-4`}>📷</Text>
        <Text style={tw`text-xl font-bold text-gray-800 mb-2 text-center`}>
          Permisos de Cámara
        </Text>
        <Text style={tw`text-gray-600 text-center mb-6`}>
          Necesitamos acceso a tu cámara para tomar fotos de productos.
        </Text>
        <TouchableOpacity
          style={tw`bg-blue-600 px-6 py-3 rounded-lg mb-4`}
          onPress={requestPermission}
        >
          <Text style={tw`text-white font-semibold`}>Conceder Permisos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`bg-gray-300 px-6 py-3 rounded-lg`}
          onPress={() => navigation.goBack()}
        >
          <Text style={tw`text-gray-700 font-semibold`}>Volver</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        setPhoto(photo.uri);
        Alert.alert(
          'Foto tomada',
          '¡Foto capturada exitosamente!',
          [
            {
              text: 'Tomar otra',
              onPress: () => setPhoto(null),
            },
            {
              text: 'Usar esta foto',
              onPress: () => {
                // Here you could save the photo or send it to your backend
                Alert.alert('Éxito', 'Foto guardada correctamente');
                navigation.goBack();
              },
            },
          ]
        );
      } catch (error) {
        Alert.alert('Error', 'No se pudo tomar la foto');
      }
    }
  };

  if (photo) {
    return (
      <SafeAreaView style={tw`flex-1 bg-black`}>
        {/* Header */}
        <View style={tw`absolute top-12 left-4 right-4 z-10 flex-row justify-between items-center`}>
          <TouchableOpacity
            style={tw`bg-black bg-opacity-50 p-3 rounded-full`}
            onPress={() => navigation.goBack()}
          >
            <Text style={tw`text-white text-xl`}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={tw`text-white font-bold text-2xl`}>Vista Previa</Text>
            <Text style={tw`text-gray-300 text-center`}>Revisa tu foto</Text>
          </View>
          <View style={tw`w-10`} />
        </View>

        {/* Photo Preview */}
        <Image source={{ uri: photo }} style={tw`flex-1`} resizeMode="contain" />

        {/* Controls */}
        <View style={tw`absolute bottom-12 left-4 right-4 flex-row justify-center space-x-4`}>
          <TouchableOpacity
            style={tw`bg-gray-600 px-6 py-3 rounded-full`}
            onPress={() => setPhoto(null)}
          >
            <Text style={tw`text-white font-semibold`}>Tomar otra</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-blue-600 px-6 py-3 rounded-full`}
            onPress={() => {
              Alert.alert('Éxito', 'Foto guardada correctamente');
              navigation.goBack();
            }}
          >
            <Text style={tw`text-white font-semibold`}>Usar foto</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      {/* Header */}
      <View style={tw`absolute top-12 left-4 right-4 z-10 flex-row justify-between items-center`}>
        <TouchableOpacity
          style={tw`bg-black bg-opacity-50 p-3 rounded-full`}
          onPress={() => navigation.goBack()}
        >
          <Text style={tw`text-white text-xl`}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={tw`text-white font-bold text-2xl`}>Cámara</Text>
          <Text style={tw`text-gray-300 text-center`}>Toma una foto</Text>
        </View>
        <TouchableOpacity
          style={tw`bg-black bg-opacity-50 p-3 rounded-full`}
          onPress={toggleCameraFacing}
        >
          <Text style={tw`text-white text-lg`}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Camera View */}
      <CameraView
        ref={cameraRef}
        style={tw`flex-1`}
        facing={facing}
      >
        {/* Camera Controls */}
        <View style={tw`absolute bottom-12 left-0 right-0 flex-row justify-center items-center`}>
          <TouchableOpacity
            style={tw`w-20 h-20 bg-white rounded-full border-4 border-gray-300 justify-center items-center`}
            onPress={takePicture}
          >
            <View style={tw`w-16 h-16 bg-white rounded-full`} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </SafeAreaView>
  );
};