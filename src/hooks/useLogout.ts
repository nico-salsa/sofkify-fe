import { useCallback } from 'react';
import { authStorage } from '../services/auth/authStorage';

export interface UseLogoutReturn {
  logout: () => void;
}

export function useLogout(): UseLogoutReturn {
  const logout = useCallback((): void => {
    authStorage.clearSession();
  }, []);

  return {
    logout,
  };
}
