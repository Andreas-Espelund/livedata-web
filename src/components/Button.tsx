'use client'
import React from 'react';

type ButtonSize = 'small' | 'medium' | 'large';
type ButtonColor = 'primary' | 'accent' | 'error';

interface ButtonProps {
  size?: ButtonSize;
  color?: ButtonColor;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  size = 'medium',
  color = 'primary',
  disabled = false,
  onClick,
  children,
}) => {
  
    let sizeClasses;
    let colorClasses;


  switch (size) {
    case 'small':
        sizeClasses = 'px-2 py-1 text-sm';
    case 'large':
        sizeClasses = 'px-6 py-3 text-lg';
    default:
        sizeClasses = 'px-4 py-2';
  }

  switch (color) {
    case 'accent':
        colorClasses = 'bg-blue-500 hover:bg-blue-600 text-white';
    case 'error':
        colorClasses = 'bg-red-500 hover:bg-red-600 text-white';
    default:
        colorClasses = 'bg-primary hover:bg-primary text-white';
  }


  const handleClick = () => {
    if (! disabled && onClick) onClick()
  }

  return (
    <button
      className={`transition-all rounded-xl focus:outline-none focus:outline ${sizeClasses} ${colorClasses} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'
      }`}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;