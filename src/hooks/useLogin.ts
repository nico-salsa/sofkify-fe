    import { useState, useCallback } from 'react';
    import { validateLoginCredentials } from '../utils/validators';
    import { authApi } from '../services/authApi';
    import { authStorage } from '../services/authStorage';
    import type { LoginCredentials } from '../types/user.types';

export interface UseLoginReturn {
  login: (credentials: LoginCredentials) => Promise<void>;
  loading: boolean;
  error: string | null;
    clearError: () => void;
    }

export function useLogin(): UseLoginReturn {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            validateLoginCredentials(credentials);
            // Usar servicio authApi
            await authApi.login(credentials);
            // Usar servicio authStorage
            authStorage.saveUserEmail(credentials.email);
            setLoading(false);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido en login';
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
        login,
        loading,
        error,
        clearError,
    };
    }
