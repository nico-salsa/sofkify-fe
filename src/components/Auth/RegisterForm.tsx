import React from 'react';
import type { RegisterFormProps } from './Auth.types';
import { AUTH_MESSAGES } from './data';
import { useAuthValidation } from '../../hooks/useAuthValidation';
import { validateUserData } from '../../utils/validators';

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, onToggleMode, isLoading, error }) => {
  const { formData, errors, touched, handleChange, handleBlur, handleSubmit } = useAuthValidation({
    initialState: {
      name: '',
      email: '',
      password: '',
      address: '',
      phone: '',
      document: '',
      city: '',
      country: '',
    },
    validate: validateUserData,
    onSubmit,
  });

  return (
    <div className="w-full flex items-center justify-center bg-white min-h-screen px-4 py-8 lg:py-0">
      <div className="w-full max-w-md">
        <h1 className="text-3xl lg:text-4xl font-bold text-black mb-2">{AUTH_MESSAGES.register.title}</h1>
        <p className="text-corporate-orange text-lg mb-8">{AUTH_MESSAGES.register.subtitle}</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="document"
              placeholder="Documento de identidad"
              value={formData.document}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              className={`w-full px-4 py-3 bg-white border-2 rounded-lg focus:outline-none transition-colors disabled:opacity-50 ${touched.document && errors.document
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-light-gray focus:border-corporate-orange'
                }`}
            />
            {touched.document && errors.document && (
              <span className="text-red-500 text-sm mt-1 block">{errors.document}</span>
            )}
          </div>

          <div>
            <input
              type="text"
              name="name"
              placeholder="Nombre completo"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              className={`w-full px-4 py-3 bg-white border-2 rounded-lg focus:outline-none transition-colors disabled:opacity-50 ${touched.name && errors.name
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-light-gray focus:border-corporate-orange'
                }`}
            />
            {touched.name && errors.name && (
              <span className="text-red-500 text-sm mt-1 block">{errors.name}</span>
            )}
          </div>

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

          <div>
            <input
              type="text"
              name="address"
              placeholder="Dirección"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              className={`w-full px-4 py-3 bg-white border-2 rounded-lg focus:outline-none transition-colors disabled:opacity-50 ${touched.address && errors.address
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-light-gray focus:border-corporate-orange'
                }`}
            />
            {touched.address && errors.address && (
              <span className="text-red-500 text-sm mt-1 block">{errors.address}</span>
            )}
          </div>

          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Teléfono"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              className={`w-full px-4 py-3 bg-white border-2 rounded-lg focus:outline-none transition-colors disabled:opacity-50 ${touched.phone && errors.phone
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-light-gray focus:border-corporate-orange'
                }`}
            />
            {touched.phone && errors.phone && (
              <span className="text-red-500 text-sm mt-1 block">{errors.phone}</span>
            )}
          </div>

          <div>
            <input
              type="text"
              name="city"
              placeholder="Ciudad"
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              className={`w-full px-4 py-3 bg-white border-2 rounded-lg focus:outline-none transition-colors disabled:opacity-50 ${touched.city && errors.city
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-light-gray focus:border-corporate-orange'
                }`}
            />
            {touched.city && errors.city && (
              <span className="text-red-500 text-sm mt-1 block">{errors.city}</span>
            )}
          </div>

          <div>
            <input
              type="text"
              name="country"
              placeholder="País"
              value={formData.country}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              className={`w-full px-4 py-3 bg-white border-2 rounded-lg focus:outline-none transition-colors disabled:opacity-50 ${touched.country && errors.country
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-light-gray focus:border-corporate-orange'
                }`}
            />
            {touched.country && errors.country && (
              <span className="text-red-500 text-sm mt-1 block">{errors.country}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-corporate-orange text-white font-bold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Cargando...' : AUTH_MESSAGES.register.buttonLabel}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-700">
            {AUTH_MESSAGES.register.toggleText}{' '}
            <button
              onClick={onToggleMode}
              disabled={isLoading}
              className="text-corporate-orange underline font-semibold hover:text-orange-600 transition-colors disabled:opacity-50"
            >
              {AUTH_MESSAGES.register.toggleLink}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
