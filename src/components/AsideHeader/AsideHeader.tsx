import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { navbarItems } from './data';
import type { AsideHeaderProps } from './types';
import { useAuth } from '../../hooks/useAuth';
import { useLogout } from '../../hooks/useLogout';
import { useCart } from '../../hooks/useCart';

const AsideHeader: React.FC<AsideHeaderProps> = ({ onAction }) => {
  const { isAuthenticated, user } = useAuth();
  const { logout } = useLogout();
  const { totalQuantity } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onAction();
    navigate('/auth');
  };

  return (
    <aside className="mt-12 p-5 h-full overflow-y-auto">
      {/* Logo */}
      <Link to="/" className="w-40 block mb-8" onClick={onAction}>
        <img 
          src="/softkify-logo.jpeg" 
          alt="Sofkify Logo" 
          className="w-full h-auto object-contain rounded shadow-sm" 
        />
      </Link>

      {/* User Info (if authenticated) */}
      {isAuthenticated && user && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-corporate-orange text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
              {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 truncate">
                {user.name || 'Usuario'}
              </p>
              <p className="text-sm text-gray-600 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav>
        <ul className="space-y-2">
          {/* Cart Link */}
          <li>
            <Link 
              to="/cart" 
              onClick={onAction}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <span className="font-medium text-gray-800">🛒 Carrito</span>
              {totalQuantity > 0 && (
                <span className="bg-corporate-orange text-white text-xs font-bold px-2 py-1 rounded-full">
                  {totalQuantity}
                </span>
              )}
            </Link>
          </li>

          {/* My Orders (if authenticated) */}
          {isAuthenticated && (
            <li>
              <Link 
                to="/my-orders" 
                onClick={onAction}
                className="block p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium text-gray-800"
              >
                📦 Mis Órdenes
              </Link>
            </li>
          )}

          {/* Dynamic Nav Items */}
          {navbarItems.map((item, index) => (
            <li key={index}>
              <Link 
                to={item.href} 
                onClick={onAction}
                className="block p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium text-gray-800"
              >
                {item.label}
              </Link>
            </li>
          ))}

          {/* Logout Button (if authenticated) */}
          {isAuthenticated && (
            <li className="pt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold p-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <span>🚪</span>
                <span>Cerrar Sesión</span>
              </button>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default AsideHeader;
