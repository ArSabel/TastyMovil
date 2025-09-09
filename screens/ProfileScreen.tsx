import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import tw from 'twrnc';
import {
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Edit2, 
  LogOut, 
  ShoppingBag, 
  Settings, 
  Bell, 
  MapPin, 
  Calendar, 
  Save,
  CreditCard 
} from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import {
  validateName,
  validateCedulaOrRuc,
  validateEcuadorianPhone,
  validateEmail,
  validateBirthDate,
  validateAddress,
  formatCedula,
  formatPhone,
  ValidationResult
} from '../utils/validation';

interface ProfileScreenProps {
  navigation: any;
  route?: any;
}

interface FormErrors {
  [key: string]: string;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  const { user, signOut } = useAuth();
  const { 
    profile, 
    address, 
    loading, 
    saving, 
    error, 
    setError,
    loadProfile, 
    saveProfile 
  } = useProfile();
  
  const [isEditing, setIsEditing] = useState(route?.params?.editMode || false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  
  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    cedula_ruc: '',
    gender: '',
    birth_date: new Date(),
    street_address: '',
    reference: ''
  });

  // Load profile data when component mounts or profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        cedula_ruc: profile.cedula_ruc || '',
        gender: profile.gender || '',
        birth_date: profile.birth_date ? new Date(profile.birth_date) : new Date(),
        street_address: address?.street_address || '',
        reference: address?.reference || ''
      });
    }
  }, [profile, address]);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => signOut(),
        },
      ]
    );
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    // Validate first name
    const firstNameValidation = validateName(formData.first_name, 'Nombre');
    if (!firstNameValidation.isValid) {
      errors.first_name = firstNameValidation.message || '';
    }
    
    // Validate last name
    const lastNameValidation = validateName(formData.last_name, 'Apellido');
    if (!lastNameValidation.isValid) {
      errors.last_name = lastNameValidation.message || '';
    }
    
    // Validate phone
    const phoneValidation = validateEcuadorianPhone(formData.phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.message || '';
    }
    
    // Validate cedula/RUC
    const cedulaValidation = validateCedulaOrRuc(formData.cedula_ruc);
    if (!cedulaValidation.isValid) {
      errors.cedula_ruc = cedulaValidation.message || '';
    }
    
    // Validate birth date
    const birthDateValidation = validateBirthDate(formData.birth_date.toISOString());
    if (!birthDateValidation.isValid) {
      errors.birth_date = birthDateValidation.message || '';
    }
    
    // Validate address
    const addressValidation = validateAddress(formData.street_address);
    if (!addressValidation.isValid) {
      errors.street_address = addressValidation.message || '';
    }
    
    // Validate gender
    if (!formData.gender) {
      errors.gender = 'El género es requerido';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Por favor corrige los errores en el formulario');
      return;
    }
    
    const profileData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      full_name: `${formData.first_name} ${formData.last_name}`.trim(),
      phone: formData.phone,
      cedula_ruc: formData.cedula_ruc,
      gender: formData.gender,
      birth_date: formData.birth_date.toISOString().split('T')[0],
    };

    const addressData = {
      street_address: formData.street_address,
      reference: formData.reference,
    };

    const success = await saveProfile(profileData, addressData);

    if (success) {
      setIsEditing(false);
      setFormErrors({});
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFormData(prev => ({ ...prev, birth_date: selectedDate }));
      if (formErrors.birth_date) {
        setFormErrors(prev => ({ ...prev, birth_date: '' }));
      }
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-white justify-center items-center`}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={tw`mt-4 text-gray-600`}>Cargando perfil...</Text>
      </SafeAreaView>
    );
  }

  const menuItems = [
    {
      icon: ShoppingBag,
      title: 'Mis Pedidos',
      subtitle: 'Ver historial de pedidos',
      onPress: () => navigation.navigate('MyOrders'),
      color: '#3B82F6',
    },
    {
      icon: Bell,
      title: 'Notificaciones',
      subtitle: 'Configurar notificaciones',
      onPress: () => Alert.alert('Próximamente', 'Esta función estará disponible pronto'),
      color: '#3b82f6',
    },
    {
      icon: Settings,
      title: 'Configuración',
      subtitle: 'Ajustes de la aplicación',
      onPress: () => Alert.alert('Próximamente', 'Esta función estará disponible pronto'),
      color: '#6b7280',
    },
  ];

  return (
    <SafeAreaView style={tw`flex-1 bg-white pt-4`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between px-6 py-4 bg-blue-500 mt-2`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`p-2`}
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-white`}>Mi Cuenta</Text>
        <TouchableOpacity
          onPress={() => setIsEditing(!isEditing)}
          style={tw`p-2`}
        >
          <Edit2 size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={tw`px-6 py-6 bg-blue-50`}>
          <View style={tw`items-center mb-4`}>
            <View style={tw`bg-blue-500 rounded-full p-6 mb-4`}>
              <User size={40} color="white" />
            </View>
            
            <Text style={tw`text-2xl font-bold text-gray-800 mb-2`}>
              {profile?.full_name || `${formData.first_name} ${formData.last_name}`.trim() || 'Usuario'}
            </Text>
            
            <Text style={tw`text-gray-600`}>{user?.email}</Text>
          </View>
        </View>

        {/* Profile Form */}
        {isEditing ? (
          <View style={tw`px-6 pb-6`}>
            <Text style={tw`text-xl font-bold text-gray-800 mb-6`}>Editar Perfil</Text>
            
            {/* Personal Information Section */}
            <View style={tw`bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4`}>
              <View style={tw`flex-row items-center mb-4`}>
                <User size={20} color="#3B82F6" />
                <Text style={tw`text-lg font-semibold text-gray-800 ml-3`}>Información Personal</Text>
              </View>
              
              {/* First Name */}
              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-700 font-medium mb-2`}>Nombre *</Text>
                <TextInput
                  style={tw`bg-gray-50 border ${formErrors.first_name ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3`}
                  value={formData.first_name}
                  onChangeText={(value) => handleInputChange('first_name', value)}
                  placeholder="Ingresa tu nombre"
                  autoCapitalize="words"
                />
                {formErrors.first_name && (
                  <Text style={tw`text-red-500 text-sm mt-1`}>{formErrors.first_name}</Text>
                )}
              </View>
              
              {/* Last Name */}
              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-700 font-medium mb-2`}>Apellido *</Text>
                <TextInput
                  style={tw`bg-gray-50 border ${formErrors.last_name ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3`}
                  value={formData.last_name}
                  onChangeText={(value) => handleInputChange('last_name', value)}
                  placeholder="Ingresa tu apellido"
                  autoCapitalize="words"
                />
                {formErrors.last_name && (
                  <Text style={tw`text-red-500 text-sm mt-1`}>{formErrors.last_name}</Text>
                )}
              </View>
              
              {/* Phone */}
              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-700 font-medium mb-2`}>Teléfono *</Text>
                <TextInput
                  style={tw`bg-gray-50 border ${formErrors.phone ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3`}
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange('phone', value)}
                  placeholder="Ej: 0987654321"
                  keyboardType="phone-pad"
                  maxLength={10}
                />
                {formErrors.phone && (
                  <Text style={tw`text-red-500 text-sm mt-1`}>{formErrors.phone}</Text>
                )}
              </View>
              
              {/* Cedula/RUC */}
              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-700 font-medium mb-2`}>Cédula/RUC *</Text>
                <TextInput
                  style={tw`bg-gray-50 border ${formErrors.cedula_ruc ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3`}
                  value={formData.cedula_ruc}
                  onChangeText={(value) => handleInputChange('cedula_ruc', value)}
                  placeholder="Ej: 1234567890"
                  keyboardType="numeric"
                  maxLength={13}
                />
                {formErrors.cedula_ruc && (
                  <Text style={tw`text-red-500 text-sm mt-1`}>{formErrors.cedula_ruc}</Text>
                )}
              </View>
              
              {/* Gender */}
              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-700 font-medium mb-2`}>Género *</Text>
                <View style={tw`bg-gray-50 border ${formErrors.gender ? 'border-red-300' : 'border-gray-300'} rounded-lg`}>
                  <Picker
                    selectedValue={formData.gender}
                    onValueChange={(value) => handleInputChange('gender', value)}
                    style={tw`h-12`}
                  >
                    <Picker.Item label="Selecciona tu género" value="" />
                    <Picker.Item label="Masculino" value="Masculino" />
                    <Picker.Item label="Femenino" value="Femenino" />
                    <Picker.Item label="Otro" value="Otro" />
                  </Picker>
                </View>
                {formErrors.gender && (
                  <Text style={tw`text-red-500 text-sm mt-1`}>{formErrors.gender}</Text>
                )}
              </View>
              
              {/* Birth Date */}
              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-700 font-medium mb-2`}>Fecha de Nacimiento *</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={tw`bg-gray-50 border ${formErrors.birth_date ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3 flex-row items-center justify-between`}
                >
                  <Text style={tw`text-gray-800`}>{formatDate(formData.birth_date)}</Text>
                  <Calendar size={20} color="#6b7280" />
                </TouchableOpacity>
                {formErrors.birth_date && (
                  <Text style={tw`text-red-500 text-sm mt-1`}>{formErrors.birth_date}</Text>
                )}
              </View>
            </View>
            
            {/* Address Section */}
            <View style={tw`bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6`}>
              <View style={tw`flex-row items-center mb-4`}>
                <MapPin size={20} color="#3B82F6" />
                <Text style={tw`text-lg font-semibold text-gray-800 ml-3`}>Dirección</Text>
              </View>
              
              {/* Street Address */}
              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-700 font-medium mb-2`}>Dirección *</Text>
                <TextInput
                  style={tw`bg-gray-50 border ${formErrors.street_address ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3`}
                  value={formData.street_address}
                  onChangeText={(value) => handleInputChange('street_address', value)}
                  placeholder="Ej: Av. Amazonas N24-03 y Colón"
                  multiline
                  numberOfLines={2}
                />
                {formErrors.street_address && (
                  <Text style={tw`text-red-500 text-sm mt-1`}>{formErrors.street_address}</Text>
                )}
              </View>
              
              {/* Reference */}
              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-700 font-medium mb-2`}>Referencia</Text>
                <TextInput
                  style={tw`bg-gray-50 border border-gray-300 rounded-lg px-4 py-3`}
                  value={formData.reference}
                  onChangeText={(value) => handleInputChange('reference', value)}
                  placeholder="Ej: Edificio azul, junto al banco"
                  multiline
                  numberOfLines={2}
                />
              </View>
            </View>
            
            {/* Action Buttons */}
            <View style={tw`flex-row gap-3 mb-6`}>
              <TouchableOpacity
                onPress={() => setIsEditing(false)}
                style={tw`flex-1 bg-gray-200 rounded-lg py-4 flex-row items-center justify-center`}
              >
                <Text style={tw`text-gray-700 font-semibold`}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleSaveProfile}
                disabled={saving}
                style={tw`flex-1 bg-blue-500 rounded-lg py-4 flex-row items-center justify-center ${saving ? 'opacity-50' : ''}`}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Save size={20} color="white" />
                    <Text style={tw`text-white font-semibold ml-2`}>Guardar</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
            
            {/* Date Picker Modal */}
            {showDatePicker && (
              <DateTimePicker
                value={formData.birth_date}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1920, 0, 1)}
              />
            )}
          </View>
        ) : (
          <View style={tw`px-6 pb-6`}>
            {/* Profile Info */}
            <View style={tw`bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4`}>
              <View style={tw`flex-row items-center justify-between mb-4`}>
                <View style={tw`flex-row items-center`}>
                  <User size={20} color="#3B82F6" />
                  <Text style={tw`text-lg font-semibold text-gray-800 ml-3`}>Información Personal</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  style={tw`bg-blue-100 rounded-lg p-2`}
                >
                  <Edit2 size={16} color="#3B82F6" />
                </TouchableOpacity>
              </View>
              
              <View style={tw`gap-3`}>
                <View style={tw`flex-row items-center`}>
                  <Mail size={16} color="#3B82F6" />
                  <Text style={tw`text-gray-600 ml-3 flex-1`}>{user?.email}</Text>
                </View>
                
                <View style={tw`flex-row items-center`}>
                  <Phone size={16} color="#3B82F6" />
                  <Text style={tw`text-gray-600 ml-3 flex-1`}>
                    {profile?.phone || 'No especificado'}
                  </Text>
                </View>
                
                <View style={tw`flex-row items-center`}>
                  <User size={16} color="#6b7280" />
                  <Text style={tw`text-gray-600 ml-3 flex-1`}>
                    {profile?.gender || 'No especificado'}
                  </Text>
                </View>
                
                <View style={tw`flex-row items-center`}>
                  <Calendar size={16} color="#6b7280" />
                  <Text style={tw`text-gray-600 ml-3 flex-1`}>
                    {profile?.birth_date ? formatDate(new Date(profile.birth_date)) : 'No especificado'}
                  </Text>
                </View>
                
                <View style={tw`flex-row items-center`}>
                  <CreditCard size={16} color="#6b7280" />
                  <Text style={tw`text-gray-600 ml-3 flex-1`}>
                    {profile?.cedula_ruc || 'No especificado'}
                  </Text>
                </View>
              </View>
            </View>
            
            {/* Address Info */}
            <View style={tw`bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4`}>
              <View style={tw`flex-row items-center mb-4`}>
                <MapPin size={20} color="#3B82F6" />
                <Text style={tw`text-lg font-semibold text-gray-800 ml-3`}>Dirección</Text>
              </View>
              
              <View style={tw`gap-3`}>
                <View>
                  <Text style={tw`text-gray-500 text-sm`}>Dirección</Text>
                  <Text style={tw`text-gray-800`}>
                    {address?.street_address || 'No especificado'}
                  </Text>
                </View>
                
                {address?.reference && (
                  <View>
                    <Text style={tw`text-gray-500 text-sm`}>Referencia</Text>
                    <Text style={tw`text-gray-800`}>{address.reference}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Menu Items */}
        <View style={tw`px-6 pb-6`}>
          <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>Opciones</Text>
          
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity
                key={index}
                onPress={item.onPress}
                style={tw`bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3 flex-row items-center`}
              >
                <View style={[tw`p-3 rounded-full mr-4`, { backgroundColor: `${item.color}20` }]}>
                  <IconComponent size={24} color={item.color} />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-lg font-semibold text-gray-800`}>{item.title}</Text>
                  <Text style={tw`text-gray-600 text-sm`}>{item.subtitle}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Stats */}
        <View style={tw`px-6 pb-6`}>
          <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>Estadísticas</Text>
          
          <View style={tw`bg-gradient-to-r from-blue-500 to-red-500 rounded-2xl p-6`}>
            <Text style={tw`text-white text-lg font-semibold mb-4`}>Resumen de Actividad</Text>
            
            <View style={tw`flex-row justify-between`}>
              <View style={tw`items-center`}>
                <Text style={tw`text-white text-2xl font-bold`}>0</Text>
                <Text style={tw`text-white text-sm opacity-90`}>Pedidos</Text>
              </View>
              
              <View style={tw`items-center`}>
                <Text style={tw`text-white text-2xl font-bold`}>$0</Text>
                <Text style={tw`text-white text-sm opacity-90`}>Total Gastado</Text>
              </View>
              
              <View style={tw`items-center`}>
                <Text style={tw`text-white text-2xl font-bold`}>0</Text>
                <Text style={tw`text-white text-sm opacity-90`}>Favoritos</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <View style={tw`px-6 pb-8`}>
          <TouchableOpacity
            onPress={handleLogout}
            style={tw`bg-red-50 border border-red-200 rounded-xl p-4 flex-row items-center justify-center`}
          >
            <LogOut size={20} color="#dc2626" />
            <Text style={tw`text-red-600 font-semibold ml-3`}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};