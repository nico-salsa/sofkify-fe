import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import cartIcon from '/lineicons_cart-2.svg';
import type { IHeaderProps } from './types';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useLogout } from '../../hooks/useLogout';

const Header: React.FC<IHeaderProps> = ({ navbarItems }) => {
  const { totalQuantity } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { logout } = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header className="bg-dark-gray h-16 flex items-center justify-center shadow-md max-md:hidden">
      <nav className="max-w-286 mx-auto flex items-center justify-between w-11/12">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="block h-10 hover:opacity-80 transition-opacity">
            <img
              src="/softkify-logo.jpeg"
              alt="Sofkify Logo"
              className="h-full w-auto object-contain rounded"
            />
          </Link>
        </div>

        {/* Navigation Items */}
        <ul className="flex items-center gap-6">
          {/* User Info (if authenticated) */}
          {isAuthenticated && user && (
            <li className="flex items-center gap-2 text-sofka-primary text-sm">
              <span className="bg-corporate-orange text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
              </span>
              <span className="font-medium hidden lg:block">
                {user.name || user.email}
              </span>
            </li>
          )}

          {/* My Orders Link (if authenticated) */}
          {isAuthenticated && (
            <li>
              <Link
                to="/my-orders"
                className="text-sofka-primary font-semibold hover:text-corporate-orange transition-colors duration-300 flex items-center gap-1"
              >
                📦 Mis Órdenes
              </Link>
            </li>
          )}

          {/* Dynamic Nav Items */}
          {navbarItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className="text-sofka-primary font-semibold hover:text-corporate-orange transition-colors duration-300"
              >
                {item.label}
              </Link>
            </li>
          ))}

          {/* Cart Icon */}
          <li className="relative">
            <Link 
              to="/cart" 
              className="block relative hover:opacity-80 transition-opacity"
              title="Ver Carrito"
            >
              <img 
                src={cartIcon} 
                alt="Carrito" 
                className="h-6 w-6 object-contain" 
              />
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-corporate-orange text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {totalQuantity}
                </span>
              )}
            </Link>
          </li>

          {/* Logout Button (if authenticated) */}
          {isAuthenticated && (
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded transition-colors duration-300 flex items-center gap-2"
                title="Cerrar Sesión"
              >
                <span>🚪</span>
                <span className="hidden lg:block">Cerrar Sesión</span>
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
