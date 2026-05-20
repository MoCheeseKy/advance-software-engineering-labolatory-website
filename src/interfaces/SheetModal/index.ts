import React from 'react';

export default interface SheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
}
