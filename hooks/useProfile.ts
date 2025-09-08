import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export interface ProfileData {
  id?: string;
  first_name: string;
  last_name: string;
  full_name: string;
  cedula_ruc: string;
  phone: string;
  gender: string;
  birth_date: string;
  role?: string;
}

export interface AddressData {
  id?: number;
  user_id?: string;
  country_id?: number;
  province_id?: number;
  canton_id?: number;
  street_address: string;
  reference: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    full_name: '',
    cedula_ruc: '',
    phone: '',
    gender: '',
    birth_date: '',
  });
  const [address, setAddress] = useState<AddressData>({
    street_address: '',
    reference: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del perfil
  const loadProfile = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      // Cargar datos del perfil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (profileData) {
        setProfile({
          id: profileData.id,
          first_name: profileData.first_name || '',
          last_name: profileData.last_name || '',
          full_name: profileData.full_name || '',
          cedula_ruc: profileData.cedula_ruc || '',
          phone: profileData.phone || '',
          gender: profileData.gender || '',
          birth_date: profileData.birth_date || '',
          role: profileData.role,
        });
      }

      // Cargar datos de dirección
      const { data: addressData, error: addressError } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (addressError && addressError.code !== 'PGRST116') {
        console.warn('Error loading address:', addressError);
      }

      if (addressData) {
        setAddress({
          id: addressData.id,
          user_id: addressData.user_id,
          country_id: addressData.country_id,
          province_id: addressData.province_id,
          canton_id: addressData.canton_id,
          street_address: addressData.street_address || '',
          reference: addressData.reference || '',
        });
      }
    } catch (err: any) {
      console.error('Error loading profile:', err);
      setError(err.message || 'Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  // Guardar datos del perfil
  const saveProfile = async (profileData: ProfileData, addressData: AddressData) => {
    if (!user?.id) {
      setError('Usuario no autenticado');
      return false;
    }

    setSaving(true);
    setError(null);

    try {
      // Generar full_name automáticamente
      const fullName = `${profileData.first_name.trim()} ${profileData.last_name.trim()}`.trim();
      
      const profileToSave = {
        ...profileData,
        id: user.id,
        full_name: fullName,
        role: profile.role || 'customer',
      };

      // Guardar o actualizar perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileToSave, {
          onConflict: 'id'
        });

      if (profileError) {
        throw profileError;
      }

      // Guardar o actualizar dirección si hay datos
      if (addressData.street_address.trim() || addressData.reference.trim()) {
        const addressToSave = {
          ...addressData,
          user_id: user.id,
          country_id: addressData.country_id || 1, // Default Ecuador
        };

        const { error: addressError } = await supabase
          .from('addresses')
          .upsert(addressToSave, {
            onConflict: 'user_id'
          });

        if (addressError) {
          console.warn('Error saving address:', addressError);
        }
      }

      // Actualizar estado local
      setProfile(profileToSave);
      setAddress(addressData);

      return true;
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Error al guardar el perfil');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Validar cédula ecuatoriana
  const validateEcuadorianId = (cedula: string): boolean => {
    if (!cedula || cedula.length !== 10) return false;
    
    const digits = cedula.split('').map(Number);
    const province = parseInt(cedula.substring(0, 2));
    
    // Validar provincia (01-24)
    if (province < 1 || province > 24) return false;
    
    // Algoritmo de validación
    const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let sum = 0;
    
    for (let i = 0; i < 9; i++) {
      let result = digits[i] * coefficients[i];
      if (result > 9) result -= 9;
      sum += result;
    }
    
    const checkDigit = sum % 10 === 0 ? 0 : 10 - (sum % 10);
    return checkDigit === digits[9];
  };

  // Validar teléfono ecuatoriano
  const validateEcuadorianPhone = (phone: string): boolean => {
    const phoneRegex = /^(09|02|03|04|05|06|07)\d{8}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    if (user?.id) {
      loadProfile();
    }
  }, [user?.id]);

  return {
    profile,
    address,
    loading,
    saving,
    error,
    setProfile,
    setAddress,
    loadProfile,
    saveProfile,
    validateEcuadorianId,
    validateEcuadorianPhone,
    setError,
  };
};