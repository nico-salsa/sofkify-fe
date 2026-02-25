export interface User {
  document: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

//Crear userDTO (para recibir la respuesta de la API, que incluye el ID generado)
export interface UserDTO extends User {
  id: string;
  status: Status;
}

export interface CreateUserDTO extends User {
  password: string;
}

// interfaz para esperar la respuesta del usuario
export type UserResponse = UserDTO;

export interface LoginCredentials {
  email: string;
  password: string;
}

export type RegisterData = CreateUserDTO;

export type AuthMode = 'login' | 'register';

export interface LoginResponse {
  success: boolean;
  message: string;
  userId?: string;
  email?: string;
  name?: string;
  role?: string;
}

export type Status = 'active' | 'eliminated';

export interface RegisterResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthSessionUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}
