import React, { useState } from 'react';
import type { LoginFormProps } from './Auth.types';
import { AUTH_MESSAGES, VALIDATION_ERRORS } from './data';

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onToggleMode, isLoading, error }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [validationError, setValidationError] = useState('');

  const validateForm = () => {
    if (!formData.email) {
      setValidationError(VALIDATION_ERRORS.emailRequired);
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setValidationError(VALIDATION_ERRORS.emailInvalid);
      return false;
    }
    if (!formData.password) {
      setValidationError(VALIDATION_ERRORS.passwordRequired);
      return false;
    }
    if (formData.password.length < 6) {
      setValidationError(VALIDATION_ERRORS.passwordMin);
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    await onSubmit(formData);
  };

  return (
    <div className="w-full flex items-center justify-center bg-white min-h-screen px-4 py-8 lg:py-0">
      <div className="w-full max-w-md">
        <h1 className="text-3xl lg:text-4xl font-bold text-black mb-2">{AUTH_MESSAGES.login.title}</h1>
        <p className="text-corporate-orange text-lg mb-8">{AUTH_MESSAGES.login.subtitle}</p>

        {(validationError || error) && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {validationError || error}
          </div>
        )}

        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-white border-2 border-light-gray rounded-lg focus:border-corporate-orange focus:outline-none transition-colors disabled:opacity-50"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-white border-2 border-light-gray rounded-lg focus:border-corporate-orange focus:outline-none transition-colors disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-corporate-orange text-white font-bold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Cargando...' : AUTH_MESSAGES.login.buttonLabel}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-700">
            {AUTH_MESSAGES.login.toggleText}{' '}
            <button
              onClick={onToggleMode}
              disabled={isLoading}
              className="text-corporate-orange underline font-semibold hover:text-orange-600 transition-colors disabled:opacity-50"
            >
              {AUTH_MESSAGES.login.toggleLink}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
