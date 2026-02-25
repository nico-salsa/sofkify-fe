/**
 * useAuth - acceso simple a sesion local.
 */

import { authStorage } from '../services/auth/authStorage';

export const useAuth = () => {
  const user = authStorage.getSession();

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading: false,
  };
};
