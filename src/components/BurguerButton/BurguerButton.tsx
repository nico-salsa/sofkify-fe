import React from 'react';

interface BurguerButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

const BurguerButton: React.FC<BurguerButtonProps> = ({ onClick, isOpen }) => {
  return (
    <button
      className="w-10 h-10 sm:hidden sticky top-4 left-4 z-50 flex flex-col items-center justify-center gap-1.5 focus:outline-none"
      onClick={onClick}
      aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
    >
      {/* Línea superior */}
      <span
        className={`block bg-sofka-gray h-0.5 w-7 rounded-full transition-all duration-300 ease-in-out ${isOpen ? 'rotate-45 translate-y-2' : 'rotate-0 translate-y-0'}`}
      ></span>

      {/* Línea del medio - desaparece cuando está abierto */}
      <span
        className={`block bg-sofka-gray h-0.5 w-7 rounded-full transition-all duration-300 ease-in-out ${isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}
      ></span>

      {/* Línea inferior */}
      <span
        className={`block bg-sofka-gray h-0.5 w-7 rounded-full transition-all duration-300 ease-in-out ${isOpen ? '-rotate-45 -translate-y-2' : 'rotate-0 translate-y-0'}`}
      ></span>
    </button>
  );
};

export default BurguerButton;