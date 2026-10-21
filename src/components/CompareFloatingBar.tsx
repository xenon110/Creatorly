import React from 'react';
import type { CreatorProfile } from '../types/creator';
import { Layers, ArrowRight, X } from 'lucide-react';

interface CompareFloatingBarProps {
  creators: CreatorProfile[];
  onOpenCompare: () => void;
  onClearAll: () => void;
  onRemoveCreator: (id: string) => void;
}

export const CompareFloatingBar: React.FC<CompareFloatingBarProps> = ({
  creators,
  onOpenCompare,
  onClearAll,
  onRemoveCreator
}) => {
  if (creators.length === 0) return null;

  return (
    <div className="compare-floating-bar">
      <div className="floating-bar-left">
        <div className="floating-badge">
          <Layers size={16} />
          <span>{creators.length} shortlisted</span>
        </div>

        <div className="floating-avatars">
          {creators.map((c) => (
            <div key={c.id} className="floating-avatar-item">
              <img src={c.avatarUrl} alt={c.fullName} className="f-avatar-img" />
              <button
                type="button"
                className="f-remove-btn"
                onClick={() => onRemoveCreator(c.id)}
                title={`Remove ${c.fullName}`}
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="floating-bar-right">
        <button
          type="button"
          className="btn-floating-clear"
          onClick={onClearAll}
        >
          Clear
        </button>

        <button
          type="button"
          className="btn-floating-compare"
          onClick={onOpenCompare}
        >
          <span>Compare Side-by-Side</span>
          <ArrowRight size={15} />
        </button>
      </div>

      <style>{`
        .compare-floating-bar {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(15, 23, 42, 0.94);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          padding: 10px 20px;
          border-radius: var(--radius-full);
          box-shadow: 0 16px 36px -6px rgba(0, 0, 0, 0.4), 0 0 24px rgba(5, 150, 105, 0.25);
          display: flex;
          align-items: center;
          gap: 24px;
          z-index: 900;
          animation: floatUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes floatUp {
          from { opacity: 0; transform: translate(-50%, 25px) scale(0.96); }
          to { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }

        .floating-bar-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .floating-badge {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 13.5px;
          font-weight: 700;
          color: #6EE7B7;
        }

        .floating-avatars {
          display: flex;
          align-items: center;
          margin-left: 6px;
        }

        .floating-avatar-item {
          position: relative;
          margin-left: -10px;
          transition: transform 0.15s ease;
        }

        .floating-avatar-item:first-child {
          margin-left: 0;
        }

        .floating-avatar-item:hover {
          transform: translateY(-2px) scale(1.1);
          z-index: 5;
        }

        .f-avatar-img {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-full);
          object-fit: cover;
          border: 2px solid #1E293B;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        .f-remove-btn {
          position: absolute;
          top: -2px;
          right: -2px;
          background-color: #EF4444;
          color: #ffffff;
          border: none;
          width: 15px;
          height: 15px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.15s ease;
        }

        .f-remove-btn:hover {
          transform: scale(1.2);
        }

        .floating-bar-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .btn-floating-clear {
          background: none;
          border: none;
          color: #94A3B8;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          transition: color 0.15s ease;
        }

        .btn-floating-clear:hover {
          color: #F8FAFC;
        }

        .btn-floating-compare {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #059669;
          color: #ffffff;
          border: none;
          padding: 9px 18px;
          border-radius: var(--radius-full);
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(5, 150, 105, 0.35);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-floating-compare:hover {
          transform: translateY(-2px);
          background: #047857;
          box-shadow: 0 6px 20px rgba(5, 150, 105, 0.5);
        }

        @media (max-width: 600px) {
          .compare-floating-bar {
            width: calc(100% - 32px);
            justify-content: space-between;
            bottom: 16px;
            padding: 10px 16px;
          }
          .floating-avatars {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};
