import React from 'react';
import type { ServicePackage, CurrencyCode } from '../types/creator';
import { formatCurrency } from '../data/currencies';
import { 
  Check, 
  X as XIcon, 
  Clock, 
  RefreshCw, 
  ArrowRight,
  Megaphone
} from 'lucide-react';

interface ServicePackageCardProps {
  pkg: ServicePackage;
  currentCurrency: CurrencyCode;
  onSelect: (pkg: ServicePackage) => void;
}

export const ServicePackageCard: React.FC<ServicePackageCardProps> = ({
  pkg,
  currentCurrency,
  onSelect,
}) => {
  return (
    <div className={`card package-card ${pkg.popular ? 'popular-card' : ''}`}>
      {pkg.popular && (
        <div className="popular-badge">
          <span>Popular Choice</span>
        </div>
      )}

      {/* Package Header */}
      <div className="package-card-header">
        <div className="platform-tag-row">
          <span className="pkg-platform-pill">{pkg.platform}</span>
        </div>

        <h3 className="pkg-title">{pkg.title}</h3>
        <p className="pkg-tagline">{pkg.tagline}</p>

        {/* Pricing Display */}
        <div className="pkg-price-row">
          <span className="pkg-amount">{formatCurrency(pkg.priceInINR, currentCurrency)}</span>
          <span className="pkg-term">/ project</span>
        </div>
      </div>

      {/* Turnaround & Terms Bar */}
      <div className="pkg-terms-grid">
        <div className="term-item">
          <Clock size={13} className="term-icon" />
          <div className="term-text">
            <span className="term-label">Delivery</span>
            <span className="term-val">{pkg.deliveryDays} business days</span>
          </div>
        </div>

        <div className="term-item">
          <RefreshCw size={13} className="term-icon" />
          <div className="term-text">
            <span className="term-label">Revisions</span>
            <span className="term-val">{pkg.includedRevisions} round included</span>
          </div>
        </div>
      </div>

      {/* Crucial Publishing Transparency Indicator */}
      <div className={`publishing-status-box ${pkg.publishingIncluded ? 'included' : 'not-included'}`}>
        <Megaphone size={14} className="pub-icon" />
        <div className="pub-text">
          <span className="pub-title">
            {pkg.publishingIncluded ? 'Publication Included' : 'Creative Production Only (UGC)'}
          </span>
          <span className="pub-desc">{pkg.publishingDestination}</span>
        </div>
      </div>

      {/* Deliverables Checklist */}
      <div className="pkg-deliverables-section">
        <span className="deliverables-heading">What's Included:</span>
        <ul className="deliverables-list">
          {pkg.deliverables.map((item, idx) => (
            <li key={idx} className="deliverable-item">
              <Check size={14} className="check-bullet" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {pkg.notIncluded && pkg.notIncluded.length > 0 && (
          <div className="not-included-sublist">
            <span className="not-included-heading">Not Included by Default:</span>
            <ul>
              {pkg.notIncluded.map((notItem, nIdx) => (
                <li key={nIdx} className="not-included-item">
                  <XIcon size={13} className="cross-bullet" />
                  <span>{notItem}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Best For Audience Tag */}
      <div className="pkg-best-for">
        <span className="best-for-label">Recommended for:</span>
        <p className="best-for-text">{pkg.bestFor}</p>
      </div>

      {/* Card Action CTA */}
      <div className="package-cta-wrapper">
        <button
          type="button"
          className={`btn btn-block ${pkg.popular ? 'btn-primary' : 'btn-secondary'} btn-lg select-package-btn`}
          onClick={() => onSelect(pkg)}
          id={`btn-select-${pkg.id}`}
        >
          <span>Select Package</span>
          <ArrowRight size={15} />
        </button>
      </div>

      <style>{`
        .package-card {
          display: flex;
          flex-direction: column;
          padding: 28px;
          border-radius: 24px;
          background-color: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
          position: relative;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .package-card:hover {
          transform: translateY(-4px);
          border-color: rgba(0, 0, 0, 0.2);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.08);
        }

        .popular-card {
          border: 2px solid #000000;
        }

        .popular-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #000000;
          color: #FFFFFF;
          padding: 4px 14px;
          border-radius: 9999px;
          font-size: 0.725rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          letter-spacing: 0.02em;
        }

        .package-card-header {
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }

        .platform-tag-row {
          margin-bottom: 8px;
        }

        .pkg-platform-pill {
          font-size: 0.725rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #1D1D1F;
          background-color: #F5F5F7;
          border: 1px solid rgba(0, 0, 0, 0.08);
          padding: 3px 10px;
          border-radius: 9999px;
        }

        .pkg-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1D1D1F;
          margin-bottom: 4px;
          letter-spacing: -0.02em;
        }

        .pkg-tagline {
          font-size: 0.85rem;
          color: #515154;
          line-height: 1.45;
          margin-bottom: 14px;
          min-height: 36px;
        }

        .pkg-price-row {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .pkg-amount {
          font-size: 2rem;
          font-weight: 700;
          color: #1D1D1F;
          letter-spacing: -0.03em;
        }

        .pkg-term {
          font-size: 0.85rem;
          color: #86868B;
          font-weight: 500;
        }

        .pkg-terms-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }

        .term-item {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #F5F5F7;
          padding: 8px 10px;
          border-radius: 10px;
        }

        .term-icon {
          color: #1D1D1F;
          flex-shrink: 0;
        }

        .term-text {
          display: flex;
          flex-direction: column;
        }

        .term-label {
          font-size: 0.675rem;
          font-weight: 600;
          text-transform: uppercase;
          color: #86868B;
        }

        .term-val {
          font-size: 0.8rem;
          font-weight: 600;
          color: #1D1D1F;
        }

        .publishing-status-box {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 12px;
          margin: 16px 0;
          font-size: 0.8rem;
          background: #F5F5F7;
          border: 1px solid rgba(0, 0, 0, 0.06);
          color: #1D1D1F;
        }

        .pub-icon {
          flex-shrink: 0;
          margin-top: 2px;
          color: #1D1D1F;
        }

        .pub-text {
          display: flex;
          flex-direction: column;
        }

        .pub-title {
          font-weight: 600;
        }

        .pub-desc {
          font-size: 0.72rem;
          color: #6E6E73;
          margin-top: 2px;
        }

        .pkg-deliverables-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }

        .deliverables-heading {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #86868B;
        }

        .deliverables-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 0;
          margin: 0;
        }

        .deliverable-item {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          font-size: 0.825rem;
          color: #515154;
          line-height: 1.45;
        }

        .check-bullet {
          color: #1D1D1F;
          background: #F5F5F7;
          border-radius: 50%;
          padding: 2px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .not-included-sublist {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px dashed rgba(0, 0, 0, 0.08);
        }

        .not-included-heading {
          font-size: 0.7rem;
          font-weight: 600;
          color: #86868B;
          display: block;
          margin-bottom: 6px;
        }

        .not-included-sublist ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 0;
          margin: 0;
        }

        .not-included-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.75rem;
          color: #86868B;
        }

        .cross-bullet {
          color: #86868B;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .pkg-best-for {
          background-color: #F5F5F7;
          border: 1px solid rgba(0, 0, 0, 0.06);
          padding: 10px 14px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .best-for-label {
          font-size: 0.675rem;
          font-weight: 600;
          text-transform: uppercase;
          color: #86868B;
          display: block;
          margin-bottom: 2px;
        }

        .best-for-text {
          font-size: 0.775rem;
          font-weight: 500;
          color: #515154;
          line-height: 1.4;
        }

        .package-cta-wrapper {
          margin-top: auto;
        }

        .select-package-btn {
          font-weight: 600;
          border-radius: 9999px;
          padding: 12px 20px;
          background: #000000;
          color: #FFFFFF;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .select-package-btn:hover {
          background: #2D2D2D;
        }
      `}</style>
    </div>
  );
};
