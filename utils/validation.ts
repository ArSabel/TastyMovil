// Utilidades de validación para formularios

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// Validar cédula ecuatoriana
export const validateEcuadorianId = (cedula: string): ValidationResult => {
  if (!cedula) {
    return { isValid: false, message: 'La cédula es requerida' };
  }

  // Remover espacios y guiones
  const cleanCedula = cedula.replace(/[\s-]/g, '');
  
  if (cleanCedula.length !== 10) {
    return { isValid: false, message: 'La cédula debe tener 10 dígitos' };
  }

  if (!/^\d{10}$/.test(cleanCedula)) {
    return { isValid: false, message: 'La cédula solo debe contener números' };
  }

  const digits = cleanCedula.split('').map(Number);
  const province = parseInt(cleanCedula.substring(0, 2));
  
  // Validar provincia (01-24)
  if (province < 1 || province > 24) {
    return { isValid: false, message: 'Código de provincia inválido' };
  }
  
  // Algoritmo de validación de cédula ecuatoriana
  const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;
  
  for (let i = 0; i < 9; i++) {
    let result = digits[i] * coefficients[i];
    if (result > 9) result -= 9;
    sum += result;
  }
  
  const checkDigit = sum % 10 === 0 ? 0 : 10 - (sum % 10);
  
  if (checkDigit !== digits[9]) {
    return { isValid: false, message: 'Cédula inválida' };
  }

  return { isValid: true };
};

// Validar RUC ecuatoriano
export const validateEcuadorianRuc = (ruc: string): ValidationResult => {
  if (!ruc) {
    return { isValid: false, message: 'El RUC es requerido' };
  }

  const cleanRuc = ruc.replace(/[\s-]/g, '');
  
  if (cleanRuc.length !== 13) {
    return { isValid: false, message: 'El RUC debe tener 13 dígitos' };
  }

  if (!/^\d{13}$/.test(cleanRuc)) {
    return { isValid: false, message: 'El RUC solo debe contener números' };
  }

  // Para RUC de persona natural, los primeros 10 dígitos deben ser una cédula válida
  const cedula = cleanRuc.substring(0, 10);
  const cedulaValidation = validateEcuadorianId(cedula);
  
  if (!cedulaValidation.isValid) {
    return { isValid: false, message: 'RUC inválido: cédula base incorrecta' };
  }

  // Los últimos 3 dígitos deben ser 001 para persona natural
  const lastThree = cleanRuc.substring(10);
  if (lastThree !== '001') {
    return { isValid: false, message: 'RUC inválido: debe terminar en 001' };
  }

  return { isValid: true };
};

// Validar cédula o RUC
export const validateCedulaOrRuc = (value: string): ValidationResult => {
  if (!value) {
    return { isValid: false, message: 'Cédula o RUC es requerido' };
  }

  const cleanValue = value.replace(/[\s-]/g, '');
  
  if (cleanValue.length === 10) {
    return validateEcuadorianId(cleanValue);
  } else if (cleanValue.length === 13) {
    return validateEcuadorianRuc(cleanValue);
  } else {
    return { isValid: false, message: 'Debe tener 10 dígitos (cédula) o 13 dígitos (RUC)' };
  }
};

// Validar teléfono ecuatoriano
export const validateEcuadorianPhone = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: false, message: 'El teléfono es requerido' };
  }

  const cleanPhone = phone.replace(/[\s()-]/g, '');
  
  // Teléfonos móviles: 09XXXXXXXX (10 dígitos)
  // Teléfonos fijos: 0XXXXXXXX (9 dígitos) - códigos de área: 02, 03, 04, 05, 06, 07
  const mobileRegex = /^09\d{8}$/;
  const landlineRegex = /^0[2-7]\d{7}$/;
  
  if (mobileRegex.test(cleanPhone) || landlineRegex.test(cleanPhone)) {
    return { isValid: true };
  }

  return { 
    isValid: false, 
    message: 'Formato inválido. Ej: 0987654321 (móvil) o 022345678 (fijo)' 
  };
};

// Validar email
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, message: 'El email es requerido' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Formato de email inválido' };
  }

  return { isValid: true };
};

// Validar nombre (solo letras y espacios)
export const validateName = (name: string, fieldName: string = 'Nombre'): ValidationResult => {
  if (!name || !name.trim()) {
    return { isValid: false, message: `${fieldName} es requerido` };
  }

  if (name.trim().length < 2) {
    return { isValid: false, message: `${fieldName} debe tener al menos 2 caracteres` };
  }

  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  
  if (!nameRegex.test(name.trim())) {
    return { isValid: false, message: `${fieldName} solo debe contener letras` };
  }

  return { isValid: true };
};

// Validar fecha de nacimiento
export const validateBirthDate = (date: string): ValidationResult => {
  if (!date) {
    return { isValid: false, message: 'La fecha de nacimiento es requerida' };
  }

  const birthDate = new Date(date);
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
  const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());

  if (birthDate > maxDate) {
    return { isValid: false, message: 'Debe ser mayor de 13 años' };
  }

  if (birthDate < minDate) {
    return { isValid: false, message: 'Fecha inválida' };
  }

  return { isValid: true };
};

// Validar dirección
export const validateAddress = (address: string): ValidationResult => {
  if (!address || !address.trim()) {
    return { isValid: false, message: 'La dirección es requerida' };
  }

  if (address.trim().length < 10) {
    return { isValid: false, message: 'La dirección debe ser más específica (mín. 10 caracteres)' };
  }

  return { isValid: true };
};

// Formatear cédula para mostrar
export const formatCedula = (cedula: string): string => {
  const clean = cedula.replace(/\D/g, '');
  if (clean.length <= 10) {
    return clean.replace(/(\d{10})(\d{0,3})/, '$1$2');
  }
  return clean;
};

// Formatear teléfono para mostrar
export const formatPhone = (phone: string): string => {
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 10 && clean.startsWith('09')) {
    return clean.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2 $3');
  } else if (clean.length === 9 && clean.startsWith('0')) {
    return clean.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3');
  }
  return clean;
};