import { useState, useCallback } from 'react';
import { validateUserData } from '../utils/validators';
import { authApi } from '../services/auth/authApi';
import { authStorage } from '../services/auth/authStorage';
import type { CreateUserDTO } from '../types/user.types';

export interface UseRegisterReturn {
  register: (data: CreateUserDTO) => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useRegister(): UseRegisterReturn {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(async (data: CreateUserDTO): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      validateUserData(data);
      const response = await authApi.register(data);
      authStorage.saveSession({
        id: response.id,
        email: response.email,
        name: response.name,
        role: response.role,
      });
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido en registro';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  /**
   * Limpia el mensaje de error
   */
  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  return {
    register,
    loading,
    error,
    clearError,
  };
}
