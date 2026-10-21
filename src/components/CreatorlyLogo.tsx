import React from 'react';

interface CreatorlyLogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  withBackground?: boolean;
  bgRadius?: number;
  bgColor?: string;
}

export const CreatorlyLogo: React.FC<CreatorlyLogoProps> = ({
  className = '',
  width = 28,
  height = 22,
  withBackground = false,
  bgRadius = 24,
  bgColor = '#f9f9f8',
}) => {
  return (
    <svg
      viewBox="0 0 200 160"
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      className={`creatorly-brand-svg ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
      aria-hidden="true"
    >
      {withBackground && (
        <rect width="200" height="160" rx={bgRadius} fill={bgColor} />
      )}
      {/* Top Left: Green */}
      <circle cx="75" cy="45" r="22" fill="#54c463" />
      {/* Top Right: Orange */}
      <circle cx="140" cy="45" r="22" fill="#ed7d1b" />
      {/* Bottom Left: Blue */}
      <circle cx="75" cy="110" r="22" fill="#5184f5" />
      {/* Bottom Right: Pink */}
      <circle cx="140" cy="110" r="22" fill="#e356a7" />
    </svg>
  );
};

export default CreatorlyLogo;
