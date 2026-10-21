import React, { useState } from 'react';
import type { PortfolioItem } from '../types/creator';
import { VerificationBadge } from './VerificationBadge';
import { 
  X, 
  Play, 
  Pause, 
  Eye, 
  TrendingUp, 
  Calendar, 
  ExternalLink, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  Quote
} from 'lucide-react';

interface PortfolioModalProps {
  item: PortfolioItem | null;
  onClose: () => void;
  onBookSimilar: (format: string) => void;
}

export const PortfolioModal: React.FC<PortfolioModalProps> = ({
  item,
  onClose,
  onBookSimilar,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  if (!item) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content portfolio-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Header */}
        <div className="modal-header">
          <div className="modal-header-meta">
            <span className="badge badge-neutral">{item.format}</span>
            <span className="dot-sep">•</span>
            <span className="platform-tag">{item.platform.toUpperCase()}</span>
            <span className="dot-sep">•</span>
            <span className="brand-tag">Campaign for <strong>{item.brandClient}</strong></span>
          </div>

          <button className="close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="portfolio-modal-body">
          {/* Simulated Video Player / Media Container */}
          <div className="media-player-container">
            <img 
              src={item.thumbnailUrl} 
              alt={item.title} 
              className="player-poster-img"
            />

            {/* Simulated Player Controls Overlay */}
            <div className="player-overlay">
              <button 
                type="button" 
                className="player-play-btn"
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Pause demonstration video' : 'Play demonstration video'}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} className="play-icon-offset" />}
              </button>

              <div className="player-bottom-bar">
                <button 
                  type="button" 
                  className="control-icon-btn"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                </button>

                <div className="progress-rail">
                  <div className={`progress-rail-fill ${isPlaying ? 'animated-progress' : ''}`}></div>
                </div>

                <div className="time-display">0:45 / 1:30</div>

                <button 
                  type="button" 
                  className="control-icon-btn"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
              </div>
            </div>
          </div>

          {/* Case Study Insights */}
          <div className="modal-details-container">
            <div className="modal-title-row">
              <h2 className="modal-title">{item.title}</h2>
              <div className="verified-badge-row">
                <VerificationBadge level="verified" size="sm" />
              </div>
            </div>

            {/* Verified Performance Metric Pills */}
            <div className="metrics-summary-bar">
              <div className="summary-metric">
                <Eye size={15} className="metric-icon" />
                <div>
                  <span className="metric-val">{item.views.toLocaleString()}</span>
                  <span className="metric-desc">Verified Views</span>
                </div>
              </div>

              <div className="summary-metric">
                <TrendingUp size={15} className="metric-icon" />
                <div>
                  <span className="metric-val">{item.engagement}%</span>
                  <span className="metric-desc">Engagement Rate</span>
                </div>
              </div>

              <div className="summary-metric">
                <Calendar size={15} className="metric-icon" />
                <div>
                  <span className="metric-val">{item.publishedDate}</span>
                  <span className="metric-desc">Publication Date</span>
                </div>
              </div>
            </div>

            {/* Campaign Brief & Deliverables */}
            <div className="info-block">
              <h4>Campaign Objective</h4>
              <p>{item.campaignObjective}</p>
            </div>

            <div className="info-block">
              <h4>Deliverables Provided</h4>
              <p>{item.deliverableSummary}</p>
            </div>

            {/* Verified Client Testimonial */}
            {item.clientQuote && (
              <div className="client-quote-box">
                <Quote size={20} className="quote-icon" />
                <div className="quote-content">
                  <p className="quote-text">"{item.clientQuote}"</p>
                  <span className="quote-author">— {item.clientAuthor}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="modal-actions-bar">
          <a 
            href={item.originalUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            <span>Open Original Content</span>
            <ExternalLink size={14} />
          </a>

          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onBookSimilar(item.format);
            }}
          >
            <span>Book Similar Campaign</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      <style>{`
        .portfolio-modal-box {
          max-width: 760px;
          padding: 0;
          overflow: hidden;
        }

        .portfolio-modal-box .modal-header {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(--bg-primary);
        }

        .modal-header-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: var(--text-muted);
          flex-wrap: wrap;
        }

        .dot-sep {
          color: var(--border-medium);
        }

        .platform-tag {
          font-weight: 700;
          color: var(--text-secondary);
        }

        .brand-tag strong {
          color: var(--text-primary);
        }

        .portfolio-modal-body {
          max-height: calc(85vh - 130px);
          overflow-y: auto;
        }

        .media-player-container {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background-color: #000;
          overflow: hidden;
        }

        .player-poster-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .player-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .player-play-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.95);
          color: var(--accent-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          transition: transform 0.15s ease, background-color 0.15s ease;
        }

        .player-play-btn:hover {
          transform: scale(1.08);
          background-color: #ffffff;
        }

        .play-icon-offset {
          margin-left: 3px;
        }

        .player-bottom-bar {
          position: absolute;
          bottom: 12px;
          left: 16px;
          right: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
          font-size: 0.75rem;
        }

        .control-icon-btn {
          color: white;
          padding: 4px;
        }

        .progress-rail {
          flex: 1;
          height: 4px;
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-rail-fill {
          width: 35%;
          height: 100%;
          background-color: var(--accent-primary);
        }

        .animated-progress {
          animation: progressMove 12s linear infinite;
        }

        @keyframes progressMove {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        .time-display {
          font-family: var(--font-mono);
          color: rgba(255, 255, 255, 0.85);
          white-space: nowrap;
        }

        .modal-details-container {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .modal-title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .modal-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.35;
        }

        .metrics-summary-bar {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          background-color: var(--bg-secondary);
          padding: 12px 16px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-light);
        }

        @media (max-width: 600px) {
          .metrics-summary-bar {
            grid-template-columns: 1fr;
          }
        }

        .summary-metric {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .summary-metric .metric-icon {
          color: var(--accent-primary);
        }

        .summary-metric .metric-val {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          display: block;
        }

        .summary-metric .metric-desc {
          font-size: 0.7rem;
          color: var(--text-muted);
          display: block;
        }

        .info-block h4 {
          font-size: 0.825rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-muted);
          margin-bottom: 4px;
        }

        .info-block p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .client-quote-box {
          display: flex;
          gap: 12px;
          padding: 16px;
          background-color: var(--bg-secondary);
          border-left: 3px solid var(--accent-primary);
          border-radius: var(--radius-sm);
        }

        .quote-icon {
          color: var(--accent-primary);
          flex-shrink: 0;
          opacity: 0.6;
        }

        .quote-text {
          font-style: italic;
          color: var(--text-primary);
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 6px;
        }

        .quote-author {
          font-size: 0.775rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .modal-actions-bar {
          padding: 16px 24px;
          background-color: var(--bg-primary);
          border-top: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
      `}</style>
    </div>
  );
};
