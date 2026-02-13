/**
 * authStorage - Servicio para manejar persistencia de datos de autenticación
 * 
 * Responsabilidad ÚNICA: localStorage operations
 */

const STORAGE_KEY = 'softkify_user_email';

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
};
