import type { AuthMode } from '../../types/user.types';

export interface AuthPageProps {
  initialMode?: AuthMode;
}

export interface FormState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export interface AuthImageProps {
  position: 'left' | 'right';
}

export interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => Promise<void>;
  onToggleMode: () => void;
  isLoading: boolean;
  error: string | null;
}

export interface RegisterFormProps {
  onSubmit: (data: {
    name: string;
    lastName: string;
    email: string;
    password: string;
    address: string;
    phone: number;
  }) => Promise<void>;
  onToggleMode: () => void;
  isLoading: boolean;
  error: string | null;
}
