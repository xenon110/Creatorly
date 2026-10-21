import React, { useState } from 'react';
import type { CreatorReview } from '../types/creator';
import { 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  TrendingUp 
} from 'lucide-react';

interface ReviewsSectionProps {
  reviews: CreatorReview[];
  overallRating: number;
  totalReviews: number;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  overallRating,
  totalReviews,
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filterOptions = [
    { id: 'all', label: `All Reviews (${totalReviews})` },
    { id: 'youtube', label: 'YouTube Integrations' },
    { id: 'reel', label: 'Sponsored Reels' },
    { id: 'ugc', label: 'UGC Ad Creatives' },
  ];

  const filteredReviews = reviews.filter((rev) => {
    if (filterType === 'all') return true;
    if (filterType === 'youtube') return rev.campaignType.includes('YouTube') || rev.campaignType.includes('Review');
    if (filterType === 'reel') return rev.campaignType.includes('Reel');
    if (filterType === 'ugc') return rev.campaignType.includes('UGC');
    return true;
  });

  return (
    <section className="reviews-section" id="creator-reviews">
      <div className="section-header">
        <div className="section-header-row">
          <div>
            <div className="section-tag">Brand Social Proof</div>
            <h2 className="section-title">Reviews & Previous Collaborations</h2>
            <p className="section-desc">
              Authentic performance feedback from verified brand partners who completed campaign milestones through Creatorly Escrow.
            </p>
          </div>

          <div className="rating-summary-badge card">
            <div className="rating-stars-row">
              <div className="stars-cluster">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="star-filled" fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <span className="rating-score">{overallRating.toFixed(1)}</span>
            </div>
            <span className="rating-count">Based on {totalReviews} completed brand campaigns</span>
          </div>
        </div>
      </div>

      {/* Review Type Filter Bar */}
      <div className="review-filters-bar">
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`filter-pill ${filterType === opt.id ? 'active' : ''}`}
            onClick={() => setFilterType(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Reviews Grid */}
      <div className="reviews-cards-grid">
        {filteredReviews.map((rev) => (
          <div key={rev.id} className="review-card card">
            {/* Top row with Brand Logo & Verified Tag */}
            <div className="review-card-top">
              <div className="brand-ident-box">
                <div className="brand-avatar-fallback">
                  {rev.brandLogo}
                </div>
                <div className="brand-names">
                  <h4 className="brand-name">{rev.brandName}</h4>
                  <span className="reviewer-info">{rev.reviewerName} • {rev.reviewerRole}</span>
                </div>
              </div>

              {rev.verifiedTransaction && (
                <div className="verified-campaign-tag" title="Verified transaction fulfilled via Creatorly Escrow">
                  <ShieldCheck size={13} className="text-success" />
                  <span>Verified Campaign</span>
                </div>
              )}
            </div>

            {/* Campaign Format & Star Rating */}
            <div className="review-meta-bar">
              <div className="stars-mini">
                {[...Array(5)].map((_, s) => (
                  <Star 
                    key={s} 
                    size={13} 
                    fill={s < Math.floor(rev.rating) ? '#F59E0B' : 'none'} 
                    color="#F59E0B" 
                  />
                ))}
                <span className="rating-num">{rev.rating.toFixed(1)}</span>
              </div>

              <span className="campaign-format-badge">{rev.campaignType}</span>
            </div>

            {/* Review Testimonial Body */}
            <p className="review-body-text">
              "{rev.content}"
            </p>

            {/* Metric Highlight Callout if available */}
            {rev.metricHighlight && (
              <div className="metric-highlight-box">
                <TrendingUp size={14} className="metric-highlight-icon" />
                <span className="metric-highlight-text">{rev.metricHighlight}</span>
              </div>
            )}

            {/* Review Date Footer */}
            <div className="review-card-footer">
              <span className="review-date">
                <Calendar size={12} />
                <span>Completed {rev.date}</span>
              </span>

              <span className="escrow-verified-label">
                <CheckCircle2 size={12} className="text-success" />
                <span>Escrow Completed</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .reviews-section {
          margin-bottom: 48px;
        }

        .rating-summary-badge {
          padding: 14px 22px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
        }

        @media (max-width: 768px) {
          .rating-summary-badge {
            align-items: flex-start;
          }
        }

        .rating-stars-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .stars-cluster {
          display: flex;
          gap: 3px;
        }

        .rating-score {
          font-size: 1.45rem;
          font-weight: 700;
          color: #1D1D1F;
          letter-spacing: -0.02em;
        }

        .rating-count {
          font-size: 0.75rem;
          color: #86868B;
          margin-top: 3px;
          font-weight: 500;
        }

        .review-filters-bar {
          display: flex;
          gap: 8px;
          margin: 22px 0 26px;
          flex-wrap: wrap;
        }

        .filter-pill {
          padding: 7px 16px;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 500;
          background-color: #F5F5F7;
          color: #515154;
          border: 1px solid rgba(0, 0, 0, 0.06);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .filter-pill:hover {
          background-color: #E8E8ED;
          color: #1D1D1F;
        }

        .filter-pill.active {
          background: #000000;
          color: #FFFFFF;
          border-color: #000000;
          font-weight: 600;
        }

        .reviews-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        @media (max-width: 768px) {
          .reviews-cards-grid {
            grid-template-columns: 1fr;
          }
        }

        .review-card {
          padding: 24px;
          background-color: #FFFFFF;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 20px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .review-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.06);
        }

        .review-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 14px;
          gap: 12px;
        }

        .brand-ident-box {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-avatar-fallback {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #000000;
          color: #FFFFFF;
          font-weight: 700;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-names {
          display: flex;
          flex-direction: column;
        }

        .brand-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: #1D1D1F;
        }

        .reviewer-info {
          font-size: 0.725rem;
          color: #86868B;
        }

        .verified-campaign-tag {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.725rem;
          font-weight: 500;
          color: #1D1D1F;
          background: #F5F5F7;
          padding: 4px 10px;
          border-radius: 9999px;
          border: 1px solid rgba(0, 0, 0, 0.06);
          white-space: nowrap;
        }

        .review-meta-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .stars-mini {
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .rating-num {
          font-size: 0.825rem;
          font-weight: 600;
          color: #1D1D1F;
          margin-left: 4px;
        }

        .campaign-format-badge {
          font-size: 0.725rem;
          font-weight: 500;
          color: #515154;
          background: #F5F5F7;
          border: 1px solid rgba(0, 0, 0, 0.06);
          padding: 3px 10px;
          border-radius: 9999px;
        }

        .review-body-text {
          font-size: 0.875rem;
          color: #515154;
          line-height: 1.55;
          margin-bottom: 14px;
          flex: 1;
        }

        .metric-highlight-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #F5F5F7;
          border: 1px solid rgba(0, 0, 0, 0.06);
          padding: 9px 14px;
          border-radius: 10px;
          margin-bottom: 14px;
        }

        .metric-highlight-icon {
          color: #1D1D1F;
          flex-shrink: 0;
        }

        .metric-highlight-text {
          font-size: 0.8rem;
          font-weight: 600;
          color: #1D1D1F;
        }

        .review-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          font-size: 0.725rem;
          color: #86868B;
        }

        .review-date,
        .escrow-verified-label {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .escrow-verified-label {
          color: #1D1D1F;
          font-weight: 500;
        }
      `}</style>
    </section>
  );
};
