import React from 'react';
import { X, ShieldCheck, CheckCircle2, Lock, RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorName: string;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  creatorName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content verification-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="title-with-icon">
            <div className="shield-icon-box">
              <ShieldCheck size={20} className="shield-svg" />
            </div>
            <div>
              <h3>How Creatorly Verifies Creators & Metrics</h3>
              <p className="subtitle">Verification standards applied to {creatorName}'s storefront</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="verification-status-banner">
            <div className="banner-left">
              <span className="badge badge-verified">
                <ShieldCheck size={14} />
                <span>Tier 1 Verified Creator</span>
              </span>
              <p className="banner-text">
                Identity, business registration, and live social channels confirmed via direct OAuth API integrations.
              </p>
            </div>
            <div className="last-sync">
              <RefreshCw size={12} className="spin-slow" />
              <span>Synced 3 days ago</span>
            </div>
          </div>

          <div className="standards-grid">
            <div className="standard-card">
              <div className="card-top">
                <CheckCircle2 size={16} className="text-success" />
                <h4>Direct Platform OAuth Sync</h4>
              </div>
              <p>
                Metrics such as follower counts, average views per post, and engagement rates are pulled directly via official Meta Graph API and YouTube Data API tokens. We never accept self-uploaded screenshots for verified stats.
              </p>
            </div>

            <div className="standard-card">
              <div className="card-top">
                <CheckCircle2 size={16} className="text-success" />
                <h4>Audience Quality & Bot Scrubbing</h4>
              </div>
              <p>
                Every 30 days, creator profiles undergo automated fraud checks examining comment sentiment distribution, follower growth velocity, and account authenticity to flag non-human engagement.
              </p>
            </div>

            <div className="standard-card">
              <div className="card-top">
                <CheckCircle2 size={16} className="text-success" />
                <h4>Verified Transaction Escrow</h4>
              </div>
              <p>
                Client reviews and completed campaign tags are only marked as "Verified" when the transaction was booked and fulfilled through Creatorly Escrow with mutual deliverable approval.
              </p>
            </div>

            <div className="standard-card">
              <div className="card-top">
                <AlertTriangle size={16} className="text-warning" />
                <h4>Self-Reported Data Distinction</h4>
              </div>
              <p>
                Whenever a creator inputs unverified claims (e.g. offline workshop attendees or external stats), Creatorly explicitly tags them as <strong className="text-warning">Self-Reported</strong> so brand buyers can make informed decisions.
              </p>
            </div>
          </div>

          <div className="verification-footer-note">
            <Lock size={14} />
            <span>
              All campaign payments are held safely in escrow until you inspect and approve deliverables.
            </span>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => {
              onClose();
              window.open('https://creatorly.com/trust-and-safety', '_blank');
            }}
          >
            <span>Read Trust & Verification Guidelines</span>
            <ExternalLink size={13} />
          </button>
        </div>
      </div>

      <style>{`
        .verification-modal {
          max-width: 620px;
          padding: 24px;
        }

        .title-with-icon {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .shield-icon-box {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background-color: var(--success-bg);
          border: 1px solid var(--success-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--success);
          flex-shrink: 0;
        }

        .verification-status-banner {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 14px 16px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin: 16px 0 20px;
        }

        .banner-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-top: 6px;
        }

        .last-sync {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.725rem;
          color: var(--text-muted);
          white-space: nowrap;
          background-color: var(--bg-primary);
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-light);
        }

        .standards-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }

        .standard-card {
          padding: 14px;
          background-color: var(--bg-primary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
        }

        .card-top {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .card-top h4 {
          font-size: 0.925rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .standard-card p {
          font-size: 0.825rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .text-success {
          color: var(--success);
        }

        .text-warning {
          color: var(--warning);
        }

        .verification-footer-note {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 18px;
          padding: 10px 14px;
          background-color: var(--accent-subtle);
          border: 1px solid var(--accent-border);
          border-radius: var(--radius-md);
          font-size: 0.8rem;
          color: var(--accent-primary);
          font-weight: 500;
        }

        .modal-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid var(--border-light);
        }
      `}</style>
    </div>
  );
};
