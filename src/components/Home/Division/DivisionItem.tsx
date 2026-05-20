import React from 'react';

interface DivisionItemProps {
  title: string;
  icon: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  onClick?: () => void;
}

export default function DivisionItem({
  title,
  icon,
  iconPosition = 'left',
  className = '',
  onClick,
}: DivisionItemProps) {
  // If iconPosition is right, reverse the row only on desktop (md+)
  // So on mobile, icon is always on the left.
  const isRight = iconPosition === 'right';

  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between py-4 px-7 font-bold bg-white rounded-md max-w-[412px] w-full shadow-sm cursor-pointer hover:shadow-md transition-shadow ${
        isRight ? 'flex-row md:flex-row-reverse' : 'flex-row'
      } ${className}`}
    >
      <div className="text-primary flex items-center shrink-0">{icon}</div>
      <p className={isRight ? 'text-right md:text-left text-sm md:text-base' : 'text-right text-sm md:text-base'}>{title}</p>
    </div>
  );
}
