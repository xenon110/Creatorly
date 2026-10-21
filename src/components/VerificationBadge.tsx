import React from 'react';
import { AlertCircle, HelpCircle, ShieldCheck } from 'lucide-react';
import type { VerificationLevel } from '../types/creator';

interface VerificationBadgeProps {
  level?: VerificationLevel;
  sourceText?: string;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  level = 'verified',
  sourceText,
  onClick,
  size = 'md',
}) => {
  if (level === 'verified') {
    return (
      <button 
        type="button" 
        className={`badge badge-verified badge-clickable ${size}`}
        onClick={onClick}
        title={sourceText || 'Verified via direct API integration'}
        aria-label="Verified creator data"
      >
        <ShieldCheck size={size === 'sm' ? 12 : 14} />
        <span>Verified</span>
      </button>
    );
  }

  if (level === 'self_reported') {
    return (
      <button 
        type="button" 
        className={`badge badge-self-reported badge-clickable ${size}`}
        onClick={onClick}
        title="Self-reported by creator. Not independently verified via API."
        aria-label="Self-reported metric"
      >
        <AlertCircle size={size === 'sm' ? 12 : 14} />
        <span>Self-Reported</span>
      </button>
    );
  }

  return (
    <span className={`badge badge-neutral ${size}`} title="Data not currently available">
      <HelpCircle size={size === 'sm' ? 12 : 14} />
      <span>Unavailable</span>
    </span>
  );
};
