import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/Auth/LoginForm';
import RegisterForm from '../../components/Auth/RegisterForm';
import AuthImage from '../../components/Auth/AuthImage';
import type { AuthMode, CreateUserDTO, LoginCredentials } from '../../types/user.types';
import { useLogin } from '../../hooks/useLogin';
import { useRegister } from '../../hooks/useRegister';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const navigate = useNavigate();
  const loginHook = useLogin();
  const registerHook = useRegister();

  const handleToggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    loginHook.clearError();
    registerHook.clearError();
  };

  const handleLogin = async (data: LoginCredentials) => {
    try {
      await loginHook.login(data);
      navigate('/');
    } catch (err) {
      // Error already handled by hook
    }
  };

  const handleRegister = async (data: CreateUserDTO) => {
    try {
      await registerHook.register(data);
      navigate('/');
    } catch (err) {
      // Error already handled by hook
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
              isLoading={loginHook.loading}
              error={loginHook.error}
            />
          </div>
        </>
      ) : (
        <>
          <div className="w-full lg:w-1/2">
            <RegisterForm
              onSubmit={handleRegister}
              onToggleMode={handleToggleMode}
              isLoading={registerHook.loading}
              error={registerHook.error}
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
