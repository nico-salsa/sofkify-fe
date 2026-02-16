import type { LoginCredentials, CreateUserDTO } from '../types/user.types';
import { VALIDATION_ERRORS } from '../components/Auth/data';

/**
 * Valida un email
 * @returns Mensaje de error o null si es válido
 */
export function getEmailError(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return VALIDATION_ERRORS.emailRequired;
  if (!emailRegex.test(email)) return VALIDATION_ERRORS.emailInvalid;
  return null;
}

/**
 * Valida las credenciales de login
 * @returns Objeto con errores (key: campo, value: mensaje)
 */
export function validateLoginCredentials(credentials: LoginCredentials): Record<string, string> {
  const errors: Record<string, string> = {};

  const emailError = getEmailError(credentials.email);
  if (emailError) errors.email = emailError;

  if (!credentials.password) {
    errors.password = VALIDATION_ERRORS.passwordRequired;
  } else if (credentials.password.length < 8) {
    errors.password = VALIDATION_ERRORS.passwordMin;
  }

  return errors;
}

/**
 * Valida los datos de registro
 * @returns Objeto con errores (key: campo, value: mensaje)
 */
export function validateUserData(data: CreateUserDTO): Record<string, string> {
  const errors: Record<string, string> = {};

  // Documento
  if (!data.document) {
    errors.document = 'El documento es requerido';
  } else if (data.document.trim().length < 5) {
    errors.document = 'El documento debe tener al menos 5 caracteres';
  }

  // Nombre
  if (!data.name) {
    errors.name = VALIDATION_ERRORS.nameRequired;
  } else if (data.name.trim().length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres';
  }

  // Email
  const emailError = getEmailError(data.email);
  if (emailError) errors.email = emailError;

  // Password
  if (!data.password) {
    errors.password = VALIDATION_ERRORS.passwordRequired;
  } else if (data.password.length < 8) {
    errors.password = VALIDATION_ERRORS.passwordMin;
  }

  // Teléfono
  if (!data.phone) {
    errors.phone = VALIDATION_ERRORS.phoneRequired;
  } else {
    const phoneDigitsOnly = data.phone.replace(/\D/g, '');
    if (!/^\d{7,}$/.test(phoneDigitsOnly)) {
      errors.phone = 'El teléfono debe tener al menos 7 dígitos';
    }
  }

  // Dirección
  if (!data.address) {
    errors.address = VALIDATION_ERRORS.addressRequired;
  } else if (data.address.trim().length < 5) {
    errors.address = 'La dirección debe tener al menos 5 caracteres';
  }

  // Ciudad
  if (!data.city) {
    errors.city = 'La ciudad es requerida';
  } else if (data.city.trim().length < 2) {
    errors.city = 'La ciudad debe tener al menos 2 caracteres';
  }

  // País
  if (!data.country) {
    errors.country = 'El país es requerido';
  } else if (data.country.trim().length < 2) {
    errors.country = 'El país debe tener al menos 2 caracteres';
  }

  return errors;
}
