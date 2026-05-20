import React from 'react';

export default interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline';
  colorType?: 'primary' | 'secondary' | 'dark-mist';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}
