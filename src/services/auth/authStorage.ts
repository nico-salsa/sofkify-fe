/**
 * authStorage - Servicio para manejar persistencia de datos de autenticación
 * 
 * Responsabilidad ÚNICA: localStorage operations
 */

const STORAGE_KEY = 'softkify_user_email';
const TOKEN_KEY = 'softkify_auth_token';

export const authStorage = {
  /**
   * Guarda el email del usuario autenticado
   */
  saveUserEmail(email: string): void {
    localStorage.setItem(STORAGE_KEY, email);
  },

  /**
   * Obtiene el email del usuario guardado
   */
  getUserEmail(): string | null {
    return localStorage.getItem(STORAGE_KEY);
  },

  /**
   * Elimina el email del usuario (logout)
   */
  clearUserEmail(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  /**
   * Guarda el token de autenticación
   */
  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * Obtiene el token de autenticación
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Elimina el token (logout)
   */
  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },
};
