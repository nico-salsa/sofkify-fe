import React from 'react';
import type { LoginFormProps } from './Auth.types';
import { AUTH_MESSAGES } from './data';
import { useAuthValidation } from '../../hooks/useAuthValidation';
import { validateLoginCredentials } from '../../utils/validators';

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onToggleMode, isLoading, error }) => {
  const { formData, errors, touched, handleChange, handleBlur, handleSubmit } = useAuthValidation({
    initialState: { email: '', password: '' },
    validate: validateLoginCredentials,
    onSubmit,
  });

  return (
    <div className="w-full flex items-center justify-center bg-white min-h-screen px-4 py-8 lg:py-0">
      <div className="w-full max-w-md">
        <h1 className="text-3xl lg:text-4xl font-bold text-black mb-2">{AUTH_MESSAGES.login.title}</h1>
        <p className="text-corporate-orange text-lg mb-8">{AUTH_MESSAGES.login.subtitle}</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
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
              onBlur={handleBlur}
              disabled={isLoading}
              className={`w-full px-4 py-3 bg-white border-2 rounded-lg focus:outline-none transition-colors disabled:opacity-50 ${touched.email && errors.email
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-light-gray focus:border-corporate-orange'
                }`}
            />
            {touched.email && errors.email && (
              <span className="text-red-500 text-sm mt-1 block">{errors.email}</span>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              className={`w-full px-4 py-3 bg-white border-2 rounded-lg focus:outline-none transition-colors disabled:opacity-50 ${touched.password && errors.password
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-light-gray focus:border-corporate-orange'
                }`}
            />
            {touched.password && errors.password && (
              <span className="text-red-500 text-sm mt-1 block">{errors.password}</span>
            )}
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
