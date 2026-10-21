import React, { useState } from 'react';
import type { CreatorProfile, CurrencyCode } from '../types/creator';
import { formatCurrency } from '../data/currencies';
import { 
  Clock, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Check, 
  Lock,
  ArrowRight
} from 'lucide-react';

interface BookingPanelProps {
  creator: CreatorProfile;
  currentCurrency: CurrencyCode;
  onRequestBooking: () => void;
  onOpenMessage: () => void;
  onShowToast: (msg: string) => void;
}

export const BookingPanel: React.FC<BookingPanelProps> = ({
  creator,
  currentCurrency,
  onRequestBooking,
  onOpenMessage,
  onShowToast,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const startingPrice = Math.min(...creator.packages.map((p) => p.priceInINR));

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    onShowToast(`Storefront link copied to clipboard!`);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onShowToast(
      !isBookmarked 
        ? `Saved ${creator.fullName} to your Brand Shortlist` 
        : `Removed from your shortlist`
    );
  };

  return (
    <div className="card booking-panel-card" id="booking-panel">
      {/* Top Header Row with Availability */}
      <div className="panel-status-row">
        <div className="status-indicator">
          <span className="status-pulse-dot"></span>
          <span className="status-text">{creator.availability.label}</span>
        </div>
        <div className="response-time-pill" title="Typical reply time on Creatorly">
          <Clock size={12} />
          <span>Replies in {creator.availability.responseTime}</span>
        </div>
      </div>

      {/* Pricing Header */}
      <div className="panel-price-section">
        <span className="price-label">Starting at</span>
        <div className="price-display">
          <span className="main-price">{formatCurrency(startingPrice, currentCurrency)}</span>
          <span className="price-term">/ package</span>
        </div>
        <div className="price-subtext">
          <span>Fixed price transparency • Escrow protected</span>
        </div>
      </div>

      {/* Key Highlights Checklist */}
      <div className="panel-highlights">
        <div className="highlight-item">
          <Check size={14} className="highlight-check" />
          <span>Includes 1 structured revision round</span>
        </div>
        <div className="highlight-item">
          <Check size={14} className="highlight-check" />
          <span>30-day organic usage rights included</span>
        </div>
        <div className="highlight-item">
          <Check size={14} className="highlight-check" />
          <span>Next delivery slot opens {creator.availability.earliestDelivery}</span>
        </div>
      </div>

      {/* Main Action CTAs */}
      <div className="panel-cta-group">
        <button 
          type="button" 
          className="btn btn-primary btn-block btn-lg cta-request"
          onClick={onRequestBooking}
          id="btn-request-booking"
        >
          <span>Request a Booking</span>
          <ArrowRight size={16} />
        </button>

        <button 
          type="button" 
          className="btn btn-secondary btn-block cta-message"
          onClick={onOpenMessage}
          id="btn-message-creator"
        >
          <MessageSquare size={15} />
          <span>Message Creator</span>
        </button>
      </div>

      {/* Trust & Escrow Guarantee Note */}
      <div className="panel-guarantee">
        <div className="guarantee-icon">
          <Lock size={13} />
        </div>
        <p className="guarantee-text">
          <strong>No payment required today.</strong> Collaboration terms and milestones are agreed upon before funds enter escrow.
        </p>
      </div>

      {/* Secondary Fast Tools: Share & Shortlist */}
      <div className="panel-actions-footer">
        <button 
          type="button" 
          className="panel-tool-btn" 
          onClick={handleShare}
          aria-label="Share creator storefront"
        >
          {copiedLink ? <Check size={13} className="text-success" /> : <Share2 size={13} />}
          <span>{copiedLink ? 'Link Copied' : 'Share Profile'}</span>
        </button>

        <span className="tool-divider">•</span>

        <button 
          type="button" 
          className={`panel-tool-btn ${isBookmarked ? 'bookmarked' : ''}`}
          onClick={handleBookmark}
          aria-label="Save creator to brand shortlist"
        >
          <Bookmark size={13} fill={isBookmarked ? 'currentColor' : 'none'} />
          <span>{isBookmarked ? 'Shortlisted' : 'Save Creator'}</span>
        </button>
      </div>

      <style>{`
        .booking-panel-card {
          padding: 28px;
          border-radius: 24px;
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          position: sticky;
          top: calc(var(--header-height) + 20px);
          overflow: hidden;
        }

        .panel-status-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .status-indicator {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 0.775rem;
          font-weight: 600;
          color: #1D1D1F;
          background: #F5F5F7;
          padding: 5px 12px;
          border-radius: 9999px;
          border: 1px solid rgba(0, 0, 0, 0.06);
        }

        .status-pulse-dot {
          width: 8px;
          height: 8px;
          background-color: #10B981;
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
        }

        .response-time-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.725rem;
          font-weight: 600;
          color: #059669;
          background-color: #ECFDF5;
          padding: 5px 12px;
          border-radius: 9999px;
          border: 1px solid #A7F3D0;
        }

        .panel-price-section {
          padding-bottom: 20px;
          margin-bottom: 20px;
          border-bottom: 1px solid #F1F5F9;
        }

        .price-label {
          font-size: 0.75rem;
          color: #64748B;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          display: block;
          margin-bottom: 4px;
        }

        .price-display {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .main-price {
          font-size: 2.2rem;
          font-weight: 800;
          color: #059669;
          letter-spacing: -0.03em;
        }

        .price-term {
          font-size: 0.85rem;
          color: #64748B;
          font-weight: 500;
        }

        .price-subtext {
          font-size: 0.75rem;
          color: #64748B;
          font-weight: 500;
          margin-top: 6px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .panel-highlights {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .highlight-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.85rem;
          font-weight: 500;
          color: #475569;
          line-height: 1.4;
        }

        .highlight-check {
          color: #059669;
          background: #ECFDF5;
          border-radius: 50%;
          padding: 3px;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .panel-cta-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }

        .cta-request {
          background: #059669;
          color: #FFFFFF;
          border: none;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 14px 20px;
          border-radius: 9999px;
          box-shadow: 0 4px 14px rgba(5, 150, 105, 0.35);
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .cta-request:hover {
          background: #047857;
          box-shadow: 0 6px 20px rgba(5, 150, 105, 0.45);
          transform: translateY(-1.5px);
        }

        .cta-message {
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          color: #0F172A;
          font-weight: 600;
          padding: 12px 18px;
          border-radius: 9999px;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .cta-message:hover {
          background: #E8E8ED;
        }

        .panel-guarantee {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: #F5F5F7;
          padding: 12px 14px;
          border-radius: 14px;
          border: 1px solid rgba(0, 0, 0, 0.06);
          margin-bottom: 18px;
        }

        .guarantee-icon {
          color: #1D1D1F;
          background: #E8E8ED;
          padding: 4px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 1px;
          flex-shrink: 0;
        }

        .guarantee-text {
          font-size: 0.75rem;
          color: #6E6E73;
          line-height: 1.45;
        }

        .guarantee-text strong {
          color: #1D1D1F;
        }

        .panel-actions-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding-top: 14px;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
        }

        .panel-tool-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.775rem;
          font-weight: 500;
          color: #6E6E73;
          padding: 6px 10px;
          border-radius: 9999px;
          transition: all 0.15s ease;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .panel-tool-btn:hover {
          color: #1D1D1F;
          background: #F5F5F7;
        }

        .panel-tool-btn.bookmarked {
          color: #000000;
          font-weight: 600;
        }

        .tool-divider {
          color: rgba(0, 0, 0, 0.15);
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
};
