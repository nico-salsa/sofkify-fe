import type { LoginCredentials, CreateUserDTO } from '../types/user.types';

/**
 * Valida que el email tenga un formato válido
 *
 * @param email - Email a validar
 * @throws Error si el email no es válido
 */
export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new Error('Email inválido');
  }
}

/**
 * Valida las credenciales de login
 *
 * @param credentials - Credenciales a validar
 * @throws Error si las credenciales no son válidas
 */
export function validateLoginCredentials(credentials: LoginCredentials): void {
  if (!credentials.email) {
    throw new Error('El email es requerido');
  }

  if (!credentials.password) {
    throw new Error('La contraseña es requerida');
  }

  validateEmail(credentials.email);
}

/**
 * Valida los datos de un nuevo usuario
 *
 * @param data - Datos del usuario a validar
 * @throws Error si los datos no son válidos
 */
export function validateUserData(data: CreateUserDTO): void {
  // Validar nombre
  if (!data.name || data.name.trim().length < 2) {
    throw new Error('El nombre debe tener al menos 2 caracteres');
  }

  // Validar apellido
  if (!data.lastName || data.lastName.trim().length < 2) {
    throw new Error('El apellido debe tener al menos 2 caracteres');
  }

  // Validar email
  if (!data.email) {
    throw new Error('El email es requerido');
  }
  validateEmail(data.email);

  // Validar contraseña
  if (!data.password || data.password.length < 6) {
    throw new Error('La contraseña debe tener al menos 6 caracteres');
  }

  // Validar teléfono
  if (!data.phone) {
    throw new Error('El teléfono es requerido');
  }
  const phoneDigitsOnly = data.phone.replace(/\D/g, '');
  const phoneRegex = /^\d{7,}$/;
  if (!phoneRegex.test(phoneDigitsOnly)) {
    throw new Error('El teléfono debe tener al menos 7 dígitos');
  }

  // Validar dirección
  if (!data.address || data.address.trim().length < 5) {
    throw new Error('La dirección debe tener al menos 5 caracteres');
  }
}
