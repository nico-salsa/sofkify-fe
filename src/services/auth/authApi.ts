import type { LoginCredentials, CreateUserDTO, AuthResponse } from '../../types/user.types';

/**
 * authApi - Servicio para llamadas HTTP de autenticación
 * 
 * Responsabilidad ÚNICA: Comunicación con el backend
 * NO maneja estado, NO maneja validación, NO maneja persistencia
 */

// Configuración base (se define UNA sola vez)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
/**
 * Función auxiliar para hacer POST requests
 * Centraliza la configuración de fetch
 */
async function postRequest<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    //console.log(data);
    throw new Error(data.message || `Error en ${endpoint}`);
  }

  return data;
}

/**
 * Mapper temporal: convierte CreateUserDTO al formato que espera el backend
 * TODO: Refactorizar cuando el backend acepte todos los campos
 */
function mapToBackendRegisterFormat(data: CreateUserDTO) {
  return {
    email: data.email,
    password: data.password,
    name: data.name,
  };
}

/**
 * API de autenticación
 */
export const authApi = {
  /**
   * Authenticates a user against the backend API.
   *
   * @param credentials login payload with email and password
   * @returns backend auth response
   * @throws Error when backend returns a non-2xx response
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return postRequest<AuthResponse>('/api/users/auth/login', credentials);
  },

  /**
   * Registers a new user in the backend API.
   *
   * @param data registration payload from UI
   * @returns backend auth response
   * @throws Error when backend returns a non-2xx response
   */
  async register(data: CreateUserDTO): Promise<AuthResponse> {
    const backendData = mapToBackendRegisterFormat(data);
    return postRequest<AuthResponse>('/api/users', backendData);
  },
};
