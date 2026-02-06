import React from 'react';
import type { AuthImageProps } from './Auth.types';

const AuthImage: React.FC<AuthImageProps> = ({ position }) => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-corporate-orange to-yellow">
      <div className="flex flex-col items-center justify-center h-4/5 px-8">
        <img
          src="/auth-illustration.png"
          alt="Auth Illustration"
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </div>
    </div>
  );
};

export default AuthImage;
