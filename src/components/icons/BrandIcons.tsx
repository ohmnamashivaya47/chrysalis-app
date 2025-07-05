import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

// Meditation Icon - replaces 🧘
export const MeditationIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = "", 
  color = "currentColor" 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <circle cx="12" cy="8" r="3" stroke={color} strokeWidth="1.5" fill="none" />
    <path 
      d="M12 11c-2 0-4 1-4 3v2c0 1 1 2 2 2h4c1 0 2-1 2-2v-2c0-2-2-3-4-3z" 
      stroke={color} 
      strokeWidth="1.5" 
      fill="none" 
    />
    <path d="M8 14c-1.5-1-3-1-3 1" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M16 14c1.5-1 3-1 3 1" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Trophy Icon - replaces 🏆
export const TrophyIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = "", 
  color = "currentColor" 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <path 
      d="M6 9H4a2 2 0 01-2-2V5a2 2 0 012-2h2m0 6V9m0 0h12m-12 0v4a6 6 0 0012 0V9m0 0h2a2 2 0 012 2v2a2 2 0 01-2 2h-2m-12 4h12" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <rect x="9" y="21" width="6" height="2" stroke={color} strokeWidth="1.5" />
  </svg>
);

// QR Code Icon - replaces 📱
export const QRIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = "", 
  color = "currentColor" 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <rect x="3" y="3" width="8" height="8" stroke={color} strokeWidth="1.5" />
    <rect x="5" y="5" width="4" height="4" fill={color} />
    <rect x="13" y="3" width="8" height="8" stroke={color} strokeWidth="1.5" />
    <rect x="15" y="5" width="4" height="4" fill={color} />
    <rect x="3" y="13" width="8" height="8" stroke={color} strokeWidth="1.5" />
    <rect x="5" y="15" width="4" height="4" fill={color} />
    <rect x="13" y="13" width="2" height="2" fill={color} />
    <rect x="16" y="13" width="2" height="2" fill={color} />
    <rect x="19" y="13" width="2" height="2" fill={color} />
    <rect x="13" y="16" width="2" height="2" fill={color} />
    <rect x="19" y="16" width="2" height="2" fill={color} />
    <rect x="16" y="19" width="2" height="2" fill={color} />
    <rect x="19" y="19" width="2" height="2" fill={color} />
  </svg>
);

// Social Icon - replaces 💬
export const SocialIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = "", 
  color = "currentColor" 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <path 
      d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <circle cx="9" cy="10" r="1" fill={color} />
    <circle cx="15" cy="10" r="1" fill={color} />
    <path d="M9 14c1 1 2 1 3 1s2 0 3-1" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Settings Icon - replaces ⚙️
export const SettingsIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = "", 
  color = "currentColor" 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" />
    <path 
      d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" 
      stroke={color} 
      strokeWidth="1.5" 
    />
  </svg>
);

// Achievement Icon - replaces ✅
export const AchievementIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = "", 
  color = "currentColor" 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <path 
      d="M22 11.08V12a10 10 0 11-5.93-9.14" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <polyline 
      points="22,4 12,14.01 9,11.01" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

// Progress Icon - replaces 📈
export const ProgressIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = "", 
  color = "currentColor" 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <polyline 
      points="23,6 13.5,15.5 8.5,10.5 1,18" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <polyline 
      points="17,6 23,6 23,12" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

// Fire Icon - replaces 🔥 for streaks
export const StreakIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = "", 
  color = "currentColor" 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <path 
      d="M12 2c1 3 2.5 3.5 4 6 .5 1 .5 2 0 3-1 2-3 3-4 3s-3-1-4-3c-.5-1-.5-2 0-3 1.5-2.5 3-3 4-6z" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      fill="none"
    />
    <path 
      d="M12 17c.5 0 1-.5 1-1s-.5-1-1-1-1 .5-1 1 .5 1 1 1z" 
      fill={color}
    />
  </svg>
);

// Time Icon - replaces ⏱️
export const TimeIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = "", 
  color = "currentColor" 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <polyline 
      points="12,6 12,12 16,14" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);
