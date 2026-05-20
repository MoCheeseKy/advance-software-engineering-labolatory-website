import React from 'react';
import ButtonProps from '@/interfaces/Button';

export default function Button({
  children,
  className = '',
  variant = 'solid',
  colorType = 'primary',
  startIcon,
  endIcon,
  type = 'button',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg transition-all duration-200 text-xl font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variantStyles = {
    solid: {
      primary:
        'bg-primary text-white border border-primary hover:bg-primary/90 focus-visible:ring-primary',
      secondary:
        'bg-secondary text-white border border-secondary hover:bg-secondary/90 focus-visible:ring-secondary',
      'dark-mist':
        'bg-dark-mist text-white border border-dark-mist hover:bg-dark-mist/90 focus-visible:ring-dark-mist',
    },
    outline: {
      primary:
        'bg-transparent text-primary border border-primary hover:bg-primary hover:text-white focus-visible:ring-primary',
      secondary:
        'bg-transparent text-secondary border border-secondary hover:bg-secondary hover:text-white focus-visible:ring-secondary',
      'dark-mist':
        'bg-transparent text-dark-mist border border-dark-mist hover:bg-dark-mist hover:text-white focus-visible:ring-dark-mist',
    },
  };

  const hasWidthClass = /(^|\s)w-/.test(className);
  const widthClass = hasWidthClass ? '' : 'w-full';

  const combinedClassName =
    `${baseStyles} ${variantStyles[variant][colorType]} ${widthClass} ${className}`.trim();

  return (
    <button type={type} className={combinedClassName} {...props}>
      {startIcon && (
        <span className='inline-flex items-center justify-center shrink-0'>
          {startIcon}
        </span>
      )}
      <span>{children}</span>
      {endIcon && (
        <span className='inline-flex items-center justify-center shrink-0'>
          {endIcon}
        </span>
      )}
    </button>
  );
}
