import React from 'react';
import { Link } from 'react-router-dom';
import cartIcon from '/lineicons_cart-2.svg';
import type { IHeaderProps } from './types';

const Header: React.FC<IHeaderProps> = ({ navbarItems }) => {
  return (
    <header className="bg-dark-gray h-14 flex items-center justify-center max-md:hidden">
      <nav className="max-w-286 mx-auto flex items-center w-11/12">
        <ul className="flex justify-between w-full">
          <li className="h-6">
            <Link to="/" className="block h-full">
              <img
                src="/softkify-logo.jpeg"
                alt="Logo"
                className="h-full w-auto object-contain"
              />
            </Link>
          </li>
          {navbarItems.map((item, index) => (
            <li key={item.href} className="h-6 mb-4" style={{ marginBottom: index < navbarItems.length - 1 ? '0.5rem' : '0' }}>
              <Link
                to={item.href}
                className="block h-full transition-colors duration-300 hover:text-corporate-orange text-sofka-primary font-bold"
              >
                {item.label}
              </Link>
            </li>
          ))}
           <li className="h-6">
            <Link to="/cart" className="block h-full">
              <img src={cartIcon} alt="Cart Icon" className="h-full w-auto object-contain" />
            </Link>
          </li>

        </ul>
      </nav>
    </header>
  );
};

export default Header;