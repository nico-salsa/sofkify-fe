import { useCallback } from 'react';
import { authStorage } from '../services/authStorage';

export interface UseLogoutReturn {
  logout: () => void;
}

export function useLogout(): UseLogoutReturn {
  const logout = useCallback((): void => {
    authStorage.clearUserEmail();
  }, []);

  return {
    logout,
  };
}
