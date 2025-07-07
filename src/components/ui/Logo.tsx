import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  className = '', 
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Butterfly logo */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
          {/* Upper wings */}
          <ellipse cx="20" cy="25" rx="12" ry="9" fill="#6B8E23" opacity="0.9"/>
          <ellipse cx="44" cy="25" rx="12" ry="9" fill="#6B8E23" opacity="0.9"/>
          
          {/* Lower wings */}
          <ellipse cx="22" cy="40" rx="9" ry="7" fill="#6B8E23" opacity="0.8"/>
          <ellipse cx="42" cy="40" rx="9" ry="7" fill="#6B8E23" opacity="0.8"/>
          
          {/* Body */}
          <ellipse cx="32" cy="32" rx="1.5" ry="15" fill="#8B7355"/>
          
          {/* Antennae */}
          <path d="M30 20 Q28 15 29 12" stroke="#8B7355" strokeWidth="1" fill="none"/>
          <path d="M34 20 Q36 15 35 12" stroke="#8B7355" strokeWidth="1" fill="none"/>
          
          {/* Wing spots */}
          <circle cx="20" cy="23" r="2" fill="white" opacity="0.7"/>
          <circle cx="44" cy="23" r="2" fill="white" opacity="0.7"/>
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-earthyGreen ${textSizeClasses[size]}`}>
            Chrysalis
          </span>
          {size !== 'sm' && (
            <span className="text-sm text-warmClay opacity-80">
              Mind Mastery
            </span>
          )}
        </div>
      )}
    </div>
  );
};
