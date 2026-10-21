import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface NotificationToastProps {
  message: string | null;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="toast-notification-wrapper" role="alert">
      <div className="toast-inner">
        <CheckCircle2 size={16} className="toast-icon text-success" />
        <span className="toast-message">{message}</span>
        <button type="button" className="toast-close" onClick={onClose} aria-label="Dismiss toast">
          <X size={14} />
        </button>
      </div>

      <style>{`
        .toast-notification-wrapper {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 2000;
          animation: slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
          from {
            transform: translateY(16px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .toast-inner {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 18px;
          background-color: #0F172A;
          color: #FFFFFF;
          border-radius: var(--radius-md);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
          font-size: 0.85rem;
          max-width: 420px;
        }

        .toast-icon {
          flex-shrink: 0;
        }

        .toast-message {
          flex: 1;
          line-height: 1.4;
          font-weight: 500;
        }

        .toast-close {
          color: #94A3B8;
          padding: 2px;
          transition: color 0.15s ease;
        }

        .toast-close:hover {
          color: #FFFFFF;
        }
      `}</style>
    </div>
  );
};
