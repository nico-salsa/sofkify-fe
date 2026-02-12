export interface User {
  name: string;
  lastName: string;
  email: string;
  address: string;
  phone: string;
}

//Crear userDTO (para recibir la respuesta de la API, que incluye el ID generado)
export interface UserDTO extends User {
  id: string;
}

export interface CreateUserDTO extends User {
  password: string;
}
//interfaz para esperar la respuesta la respuesta del usuario 
export interface UserResponse extends UserDTO {}

export interface LoginCredentials {
  email: string;
  password: string;
}

export type RegisterData = CreateUserDTO;

export type AuthMode = 'login' | 'register';

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: UserResponse;
}
