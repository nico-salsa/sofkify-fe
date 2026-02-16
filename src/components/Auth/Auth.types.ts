import type { AuthMode, CreateUserDTO, LoginCredentials } from '../../types/user.types';

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
  onSubmit: (data: LoginCredentials) => Promise<void>;
  onToggleMode: () => void;
  isLoading: boolean;
  error: string | null;
}

export interface RegisterFormProps {
  onSubmit: (data: CreateUserDTO) => Promise<void>;
  onToggleMode: () => void;
  isLoading: boolean;
  error: string | null;
}
