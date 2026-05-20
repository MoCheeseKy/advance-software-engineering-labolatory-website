'use client';

import React, { useEffect } from 'react';
import SheetModalProps from '@/interfaces/SheetModal';

export default function SheetModal({
  isOpen,
  onClose,
  title,
  description,
  icon,
  footer,
}: SheetModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden='true'
      />

      <div
        className={`fixed z-50 w-full md:max-w-[700px] max-h-[90vh] overflow-y-auto bg-[#F9F9F9] shadow-2xl transition-all duration-300 ease-out flex flex-col
          /* Mobile styles (Bottom Sheet) */
          left-0 bottom-0 rounded-t-3xl p-6
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
          
          /* Desktop styles (Centered Modal) */
          md:left-1/2 md:top-1/2 md:bottom-auto md:rounded-3xl md:p-10
          md:-translate-x-1/2 
          ${
            isOpen
              ? 'md:-translate-y-1/2 md:scale-100 md:opacity-100'
              : 'md:-translate-y-[40%] md:scale-95 md:opacity-0 pointer-events-none'
          }
        `}
        role='dialog'
        aria-modal='true'
        aria-labelledby='sheet-modal-title'
      >
        <div className='md:hidden w-14 h-1.5 bg-gray-300 rounded-full mx-auto mb-6 shrink-0' />

        {/* Header */}
        <div className='flex justify-between items-start gap-4 mb-4 shrink-0'>
          <h2
            id='sheet-modal-title'
            className='text-xl md:text-2xl font-bold text-primary leading-tight'
          >
            {title}
          </h2>
          {icon && (
            <div className='text-primary text-3xl shrink-0 flex items-center justify-center'>
              {icon}
            </div>
          )}
        </div>

        {/* Description */}
        <div className='text-dark-mist font-medium text-sm md:text-base leading-relaxed text-justify'>
          {description}
        </div>

        {/* Footer */}
        {footer && <div className='mt-8 shrink-0'>{footer}</div>}
      </div>
    </>
  );
}
