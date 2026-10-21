import React from 'react';
import type { PortfolioItem } from '../types/creator';
import { VerificationBadge } from './VerificationBadge';
import { YouTubeIcon, InstagramIcon } from './SocialIcons';
import { 
  Eye, 
  TrendingUp, 
  Calendar, 
  ExternalLink, 
  Maximize2
} from 'lucide-react';

interface PortfolioCardProps {
  item: PortfolioItem;
  onSelect: (item: PortfolioItem) => void;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({
  item,
  onSelect,
}) => {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return <YouTubeIcon size={13} className="text-danger" />;
      case 'instagram':
        return <InstagramIcon size={13} className="text-pink" />;
      default:
        return <ExternalLink size={13} />;
    }
  };

  return (
    <div 
      className="card portfolio-card"
      onClick={() => onSelect(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(item);
        }
      }}
      aria-label={`View portfolio case study: ${item.title}`}
    >
      {/* Thumbnail Frame */}
      <div className="thumbnail-wrapper">
        <img 
          src={item.thumbnailUrl} 
          alt={item.title} 
          className="thumbnail-img"
          loading="lazy"
        />
        
        {/* Top Badges */}
        <div className="thumbnail-top-overlay">
          <div className="platform-pill">
            {getPlatformIcon(item.platform)}
            <span>{item.platform === 'youtube' ? 'YouTube' : 'Instagram'}</span>
          </div>

          <span className="format-pill">{item.format}</span>
        </div>

        {/* Hover Action Overlay */}
        <div className="thumbnail-hover-overlay">
          <div className="preview-action-btn">
            <Maximize2 size={16} />
            <span>View Case Study</span>
          </div>
        </div>

        {/* Bottom Metric Bar */}
        <div className="thumbnail-bottom-metrics">
          <div className="stat-item">
            <Eye size={12} />
            <span>{item.views >= 1000 ? `${(item.views / 1000).toFixed(1)}K views` : `${item.views} views`}</span>
          </div>
          <div className="stat-separator">•</div>
          <div className="stat-item">
            <TrendingUp size={12} />
            <span>{item.engagement}% eng.</span>
          </div>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="card-body">
        <div className="card-client-row">
          <span className="client-brand">Partner: <strong>{item.brandClient}</strong></span>
          <div className="verified-stat-pill" title="Verified via platform API token">
            <VerificationBadge level="verified" size="sm" />
          </div>
        </div>

        <h3 className="card-title" title={item.title}>
          {item.title}
        </h3>

        <p className="card-summary">
          {item.deliverableSummary}
        </p>

        <div className="card-footer-row">
          <span className="publish-date">
            <Calendar size={12} />
            <span>{item.publishedDate}</span>
          </span>

          <span className="case-study-link">
            <span>Explore Results</span>
            <ExternalLink size={12} />
          </span>
        </div>
      </div>

      <style>{`
        .portfolio-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          cursor: pointer;
          border-radius: var(--radius-xl);
          border: 1px solid rgba(226, 232, 240, 0.9);
          background-color: #FFFFFF;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease;
        }

        .portfolio-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 32px -4px rgba(79, 70, 229, 0.12);
          border-color: rgba(99, 102, 241, 0.35);
        }

        .thumbnail-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background-color: #0F172A;
        }

        .thumbnail-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .portfolio-card:hover .thumbnail-img {
          transform: scale(1.06);
        }

        .thumbnail-top-overlay {
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 2;
        }

        .platform-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(8px);
          color: white;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          font-weight: 700;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .format-pill {
          padding: 4px 10px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          color: #0F172A;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          font-weight: 700;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }

        .thumbnail-hover-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.2) 0%, rgba(15, 23, 42, 0.7) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          backdrop-filter: blur(2px);
          transition: opacity 0.25s ease;
          z-index: 3;
        }

        .portfolio-card:hover .thumbnail-hover-overlay {
          opacity: 1;
        }

        .preview-action-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          background: #059669;
          color: #FFFFFF;
          padding: 9px 18px;
          border-radius: var(--radius-full);
          font-size: 0.825rem;
          font-weight: 700;
          box-shadow: 0 8px 20px rgba(5, 150, 105, 0.35);
          transform: translateY(6px);
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease;
        }

        .preview-action-btn:hover {
          background-color: #047857;
        }

        .portfolio-card:hover .preview-action-btn {
          transform: translateY(0);
        }

        .thumbnail-bottom-metrics {
          position: absolute;
          bottom: 10px;
          left: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 10px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(8px);
          border-radius: var(--radius-full);
          font-size: 0.725rem;
          color: white;
          font-weight: 600;
          z-index: 2;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
        }

        .thumbnail-bottom-metrics .stat-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .stat-separator {
          color: rgba(255, 255, 255, 0.4);
        }

        .card-body {
          padding: 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-client-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .client-brand {
          font-size: 0.775rem;
          color: #64748B;
        }

        .client-brand strong {
          color: #1E293B;
          font-weight: 700;
        }

        .card-title {
          font-size: 1rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.4;
          margin-bottom: 8px;
          letter-spacing: -0.01em;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.15s ease;
        }

        .portfolio-card:hover .card-title {
          color: #059669;
        }

        .card-summary {
          font-size: 0.825rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        .card-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid var(--border-light);
          font-size: 0.775rem;
        }

        .publish-date {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #64748B;
          font-weight: 500;
        }

        .case-study-link {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #059669;
          font-weight: 700;
          transition: gap 0.2s ease;
        }

        .portfolio-card:hover .case-study-link {
          gap: 8px;
        }

        .text-danger {
          color: #EF4444;
        }

        .text-pink {
          color: #EC4899;
        }
      `}</style>
    </div>
  );
};
