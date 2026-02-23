/**
 * useAuth Hook
 * Proporciona acceso al contexto de autenticación del usuario
 */

import { authStorage } from '../services/auth/authStorage';

interface User {
  id: string;
  email: string;
  name?: string;
  role?: 'client' | 'admin';
}

const buildDummyUser = (): User => ({
  id: 'user-123',
  email: 'user@example.com',
  role: 'client',
});

/**
 * useAuth - Hook para acceder al estado de autenticación
 * @returns {Object} { user, isAuthenticated, isLoading }
 */
export const useAuth = () => {
  const token = authStorage.getToken();
  return {
    user: token ? buildDummyUser() : null,
    isAuthenticated: Boolean(token),
    isLoading: false,
  };
};
