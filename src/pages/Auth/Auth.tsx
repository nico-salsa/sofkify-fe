import React, { useState } from 'react';
import LoginForm from '../../components/Auth/LoginForm';
import RegisterForm from '../../components/Auth/RegisterForm';
import AuthImage from '../../components/Auth/AuthImage';
import type { AuthMode } from '../../types/user.types';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError(null);
  };

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Conectar con API en siguiente issue
      console.log('Login data:', data);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError('Error al iniciar sesión');
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: {
    name: string;
    lastName: string;
    email: string;
    password: string;
    address: string;
    phone: number;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Conectar con API en siguiente issue
      console.log('Register data:', data);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError('Error al registrarse');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {mode === 'login' ? (
        <>
          <div className="hidden lg:flex lg:w-1/2">
            <AuthImage position="left" />
          </div>
          <div className="w-full lg:w-1/2">
            <LoginForm
              onSubmit={handleLogin}
              onToggleMode={handleToggleMode}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </>
      ) : (
        <>
          <div className="w-full lg:w-1/2">
            <RegisterForm
              onSubmit={handleRegister}
              onToggleMode={handleToggleMode}
              isLoading={isLoading}
              error={error}
            />
          </div>
          <div className="hidden lg:flex lg:w-1/2">
            <AuthImage position="right" />
          </div>
        </>
      )}
    </div>
  );
};

export default Auth;
