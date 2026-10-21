import React, { useState } from 'react';
import type { PortfolioItem } from '../types/creator';
import { PortfolioCard } from './PortfolioCard';
import { PortfolioModal } from './PortfolioModal';

interface PortfolioGridProps {
  portfolio: PortfolioItem[];
  onBookSimilar: (format: string) => void;
}

export const PortfolioGrid: React.FC<PortfolioGridProps> = ({
  portfolio,
  onBookSimilar,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalItem, setActiveModalItem] = useState<PortfolioItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Work' },
    { id: 'youtube', label: 'YouTube Integrations' },
    { id: 'reel', label: 'Sponsored Reels' },
    { id: 'ugc', label: 'UGC Video Ads' },
  ];

  const filteredItems = portfolio.filter((item) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'youtube') return item.platform === 'youtube';
    if (selectedCategory === 'reel') return item.format === 'Sponsored Reel';
    if (selectedCategory === 'ugc') return item.format === 'UGC Ad Creative';
    return true;
  });

  return (
    <section className="portfolio-section" id="creator-portfolio">
      <div className="section-header">
        <div className="section-header-row">
          <div>
            <div className="section-tag">Proof of Work</div>
            <h2 className="section-title">Selected Work & Brand Partnerships</h2>
            <p className="section-desc">
              A selection of recent content and brand collaborations. Explore real deliverables, view counts, and conversion outcomes.
            </p>
          </div>

          <div className="filter-pills-group">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`filter-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid container */}
      <div className="portfolio-grid">
        {filteredItems.map((item) => (
          <PortfolioCard
            key={item.id}
            item={item}
            onSelect={(selected) => setActiveModalItem(selected)}
          />
        ))}
      </div>

      {/* Media Case Study Modal */}
      <PortfolioModal
        item={activeModalItem}
        onClose={() => setActiveModalItem(null)}
        onBookSimilar={onBookSimilar}
      />

      <style>{`
        .portfolio-section {
          margin-bottom: 40px;
        }

        .section-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .filter-pills-group {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-pill {
          padding: 6px 14px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          background-color: var(--bg-primary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-full);
          transition: all 0.15s ease;
        }

        .filter-pill:hover {
          color: var(--text-primary);
          border-color: var(--border-dark);
        }

        .filter-pill.active {
          background-color: var(--text-primary);
          color: var(--text-inverted);
          border-color: var(--text-primary);
        }

        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 24px;
        }

        @media (max-width: 992px) {
          .portfolio-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }

        @media (max-width: 600px) {
          .portfolio-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};
