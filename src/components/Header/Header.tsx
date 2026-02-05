import React from 'react';

interface INavbarItem {
  href: string;
  label: string;
}

interface IHeaderProps {
  navbarItems: INavbarItem[];
}

const Header: React.FC<IHeaderProps> = ({ navbarItems }) => {
  return (
    <header>
      <nav>
        <ul>
          {navbarItems.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;