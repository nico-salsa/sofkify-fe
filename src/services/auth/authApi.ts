import type {
  CreateUserDTO,
  LoginCredentials,
  LoginResponse,
  RegisterResponse,
} from '../../types/user.types';
import { API_CONFIG } from '../api/config';
import { httpRequest } from '../http/httpClient';

/**
 * authApi - comunicacion HTTP con user-service.
 */

const postJson = <T>(url: string, body: unknown) => {
  return httpRequest<T>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};

const mapToBackendRegisterFormat = (data: CreateUserDTO) => {
  return {
    email: data.email,
    password: data.password,
    name: data.name,
  };
};

export const authApi = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return postJson<LoginResponse>(`${API_CONFIG.USERS_BASE_URL}/users/auth/login`, credentials);
  },

  async register(data: CreateUserDTO): Promise<RegisterResponse> {
    const backendData = mapToBackendRegisterFormat(data);
    return postJson<RegisterResponse>(`${API_CONFIG.USERS_BASE_URL}/users`, backendData);
  },
};
