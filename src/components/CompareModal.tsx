import React from 'react';
import type { CreatorProfile, CurrencyCode, ServicePackage } from '../types/creator';
import { formatCurrency } from '../data/currencies';
import { X, Layers, Send, ExternalLink, Clock, ShieldCheck, ThumbsUp, Eye, Users } from 'lucide-react';
import { VerificationBadge } from './VerificationBadge';

interface CompareModalProps {
  creators: CreatorProfile[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveCreator: (creatorId: string) => void;
  onClearAll: () => void;
  currentCurrency: CurrencyCode;
  onSelectCreator: (creator: CreatorProfile) => void;
  onInitiateBooking: (creator: CreatorProfile, packageItem?: ServicePackage) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  creators,
  isOpen,
  onClose,
  onRemoveCreator,
  onClearAll,
  currentCurrency,
  onSelectCreator,
  onInitiateBooking
}) => {
  if (!isOpen) return null;

  return (
    <div className="compare-modal-overlay" onClick={onClose}>
      <div className="compare-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="compare-modal-header">
          <div className="compare-header-title">
            <Layers size={20} className="text-indigo" />
            <h3>Side-by-Side Creator Comparison</h3>
            <span className="compare-count-tag">{creators.length} Creators</span>
          </div>

          <div className="compare-header-actions">
            <button
              type="button"
              className="btn-clear-compare"
              onClick={onClearAll}
            >
              Clear Comparison
            </button>
            <button
              type="button"
              className="btn-close-modal"
              onClick={onClose}
              aria-label="Close Comparison"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body: Comparison Matrix */}
        <div className="compare-modal-body">
          {creators.length === 0 ? (
            <div className="empty-compare-state">
              <Layers size={40} className="text-muted" />
              <h4>No creators shortlisted for comparison yet</h4>
              <p>Click "Compare" on any creator card in Discover or SmartMatch to compare their metrics and pricing side-by-side.</p>
              <button type="button" className="btn-browse-creators" onClick={onClose}>
                Browse Creators
              </button>
            </div>
          ) : (
            <div className="compare-table-wrapper">
              <table className="compare-matrix-table">
                <thead>
                  <tr>
                    <th className="criteria-col">Comparison Criteria</th>
                    {creators.map((c) => (
                      <th key={c.id} className="creator-col">
                        <div className="creator-col-header">
                          <button
                            type="button"
                            className="btn-remove-col"
                            onClick={() => onRemoveCreator(c.id)}
                            title="Remove from comparison"
                          >
                            <X size={14} />
                          </button>
                          <img
                            src={c.avatarUrl}
                            alt={c.fullName}
                            className="compare-avatar"
                          />
                          <div className="compare-creator-name">
                            <span>{c.fullName}</span>
                            {c.verifiedBadge && <VerificationBadge />}
                          </div>
                          <span className="compare-handle">{c.handle}</span>
                          <span className="compare-niche-pill">{c.primaryNiche}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Row 1: Starting Price */}
                  <tr>
                    <td className="criteria-cell">Starting Price</td>
                    {creators.map((c) => {
                      const minPrice = Math.min(...c.packages.map(p => p.priceInINR));
                      return (
                        <td key={c.id} className="value-cell highlight-price">
                          {formatCurrency(minPrice, currentCurrency)}
                          <span className="cell-sub">base package</span>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row 2: Most Popular Package */}
                  <tr>
                    <td className="criteria-cell">Popular Package</td>
                    {creators.map((c) => {
                      const popPkg = c.packages.find(p => p.popular) || c.packages[0];
                      return (
                        <td key={c.id} className="value-cell">
                          <strong>{popPkg.title}</strong>
                          <span className="cell-sub">
                            {formatCurrency(popPkg.priceInINR, currentCurrency)} • {popPkg.deliveryDays}d turnaround
                          </span>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row 3: Total Audience */}
                  <tr>
                    <td className="criteria-cell">Audited Audience</td>
                    {creators.map((c) => (
                      <td key={c.id} className="value-cell">
                        <div className="metric-inline">
                          <Users size={14} className="text-muted" />
                          <span>{c.metrics.totalAudience.toLocaleString()} followers</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Row 4: Average Views */}
                  <tr>
                    <td className="criteria-cell">Average Views</td>
                    {creators.map((c) => (
                      <td key={c.id} className="value-cell">
                        <div className="metric-inline">
                          <Eye size={14} className="text-muted" />
                          <span>{c.metrics.averageViews.toLocaleString()} per post</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Row 5: Engagement Rate */}
                  <tr>
                    <td className="criteria-cell">Verified Engagement</td>
                    {creators.map((c) => (
                      <td key={c.id} className="value-cell">
                        <div className="metric-inline">
                          <ThumbsUp size={14} className="text-emerald" />
                          <strong>{c.metrics.engagementRate}%</strong>
                        </div>
                        <span className="cell-sub">audited by Meta API</span>
                      </td>
                    ))}
                  </tr>

                  {/* Row 6: Target Market Concentration */}
                  <tr>
                    <td className="criteria-cell">Audience in {creators[0]?.location.country}</td>
                    {creators.map((c) => (
                      <td key={c.id} className="value-cell">
                        <div className="metric-inline">
                          <ShieldCheck size={14} className="text-emerald" />
                          <span>{c.metrics.targetMarketPercentage}% domestic audience</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Row 7: Revisions & Turnaround */}
                  <tr>
                    <td className="criteria-cell">Standard Turnaround</td>
                    {creators.map((c) => (
                      <td key={c.id} className="value-cell">
                        <div className="metric-inline">
                          <Clock size={14} className="text-muted" />
                          <span>{c.availability.earliestDelivery}</span>
                        </div>
                        <span className="cell-sub">1 revision included</span>
                      </td>
                    ))}
                  </tr>

                  {/* Row 8: Response Time & Availability */}
                  <tr>
                    <td className="criteria-cell">Current Availability</td>
                    {creators.map((c) => (
                      <td key={c.id} className="value-cell">
                        <span className="status-pill-green">
                          {c.availability.label}
                        </span>
                        <span className="cell-sub">
                          {c.availability.slotsRemaining} of {c.availability.totalSlots} campaign slots open
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Row 9: Collaboration CTA */}
                  <tr className="actions-row">
                    <td className="criteria-cell">Direct Action</td>
                    {creators.map((c) => (
                      <td key={c.id} className="value-cell action-cell">
                        <button
                          type="button"
                          className="btn-table-hire"
                          onClick={() => {
                            onClose();
                            onInitiateBooking(c, c.packages[0]);
                          }}
                        >
                          <Send size={14} />
                          <span>Send Request</span>
                        </button>
                        <button
                          type="button"
                          className="btn-table-storefront"
                          onClick={() => {
                            onClose();
                            onSelectCreator(c);
                          }}
                        >
                          <span>Storefront</span>
                          <ExternalLink size={13} />
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .compare-modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(15, 23, 42, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(4px);
        }

        .compare-modal-container {
          background-color: var(--bg-primary);
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 1100px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          animation: modalAppear 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes modalAppear {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }

        .compare-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          border-bottom: 1px solid var(--border-light);
          background-color: var(--bg-secondary);
        }

        .compare-header-title {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .text-indigo {
          color: var(--color-indigo);
        }

        .compare-header-title h3 {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .compare-count-tag {
          font-size: 12px;
          font-weight: 600;
          background-color: var(--color-indigo-subtle);
          color: var(--color-indigo-dark);
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        .compare-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-clear-compare {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 13px;
          cursor: pointer;
          transition: color 0.15s ease;
        }

        .btn-clear-compare:hover {
          color: #EF4444;
        }

        .btn-close-modal {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: var(--radius-sm);
        }

        .btn-close-modal:hover {
          color: var(--text-primary);
        }

        .compare-modal-body {
          padding: 24px;
          overflow-y: auto;
        }

        .compare-table-wrapper {
          overflow-x: auto;
        }

        .compare-matrix-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .compare-matrix-table th,
        .compare-matrix-table td {
          padding: 14px 16px;
          border-bottom: 1px solid var(--border-light);
        }

        .criteria-col {
          width: 220px;
          font-size: 13px;
          font-weight: 700;
          color: var(--text-secondary);
          background-color: var(--bg-secondary);
          border-radius: var(--radius-md) 0 0 0;
        }

        .criteria-cell {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
          background-color: #FAFAFA;
        }

        .creator-col {
          min-width: 240px;
          background-color: var(--bg-primary);
          vertical-align: top;
        }

        .creator-col-header {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 10px 0;
        }

        .btn-remove-col {
          position: absolute;
          top: 0;
          right: 0;
          background: none;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-full);
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          cursor: pointer;
        }

        .btn-remove-col:hover {
          background-color: #FEE2E2;
          color: #DC2626;
          border-color: #FCA5A5;
        }

        .compare-avatar {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-full);
          object-fit: cover;
          border: 2px solid var(--border-light);
          margin-bottom: 8px;
        }

        .compare-creator-name {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .compare-handle {
          font-size: 12px;
          color: var(--text-muted);
          font-family: var(--font-mono);
          margin-bottom: 6px;
        }

        .compare-niche-pill {
          font-size: 11px;
          font-weight: 600;
          background-color: var(--color-indigo-subtle);
          color: var(--color-indigo-dark);
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        .value-cell {
          font-size: 14px;
          color: var(--text-primary);
          vertical-align: middle;
        }

        .highlight-price {
          font-size: 18px;
          font-weight: 800;
          color: var(--color-indigo-dark);
        }

        .cell-sub {
          display: block;
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .metric-inline {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .text-emerald {
          color: var(--color-emerald);
        }

        .status-pill-green {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          background-color: #ECFDF5;
          color: #059669;
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        .actions-row td {
          background-color: var(--bg-secondary);
        }

        .action-cell {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .btn-table-hire {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background-color: var(--color-indigo);
          color: #ffffff;
          border: none;
          padding: 8px 12px;
          border-radius: var(--radius-md);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-table-hire:hover {
          background-color: var(--color-indigo-dark);
        }

        .btn-table-storefront {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          background-color: var(--bg-primary);
          border: 1px solid var(--border-light);
          color: var(--text-secondary);
          padding: 6px 10px;
          border-radius: var(--radius-md);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-table-storefront:hover {
          color: var(--color-indigo);
        }

        .empty-compare-state {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-compare-state h4 {
          font-size: 18px;
          font-weight: 700;
          margin: 12px 0 6px 0;
        }

        .empty-compare-state p {
          font-size: 14px;
          color: var(--text-secondary);
          max-width: 440px;
          margin: 0 auto 20px auto;
        }

        .btn-browse-creators {
          background-color: var(--color-indigo);
          color: #ffffff;
          border: none;
          padding: 10px 20px;
          border-radius: var(--radius-md);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};
