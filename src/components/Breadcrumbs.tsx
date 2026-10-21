import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  niche: string;
  creatorName: string;
  onNavigateHome?: () => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  niche,
  creatorName,
  onNavigateHome,
}) => {
  return (
    <nav className="breadcrumbs-bar" aria-label="Breadcrumb">
      <div className="container breadcrumbs-inner">
        <div className="breadcrumbs-trail">
          <a href="/" className="crumb-link" onClick={(e) => { e.preventDefault(); onNavigateHome?.(); }}>
            <Home size={14} />
            <span>Home</span>
          </a>
          <ChevronRight size={13} className="crumb-separator" />
          <a href="#creators" className="crumb-link">
            <span>Creators</span>
          </a>
          <ChevronRight size={13} className="crumb-separator" />
          <a href="#category" className="crumb-link">
            <span>{niche}</span>
          </a>
          <ChevronRight size={13} className="crumb-separator" />
          <span className="crumb-current" aria-current="page">
            {creatorName}
          </span>
        </div>

        <div className="marketplace-assurance">
          <span className="dot"></span>
          <span>Verified Marketplace Storefront</span>
        </div>
      </div>

      <style>{`
        .breadcrumbs-bar {
          background-color: var(--bg-primary);
          border-bottom: 1px solid var(--border-light);
          padding: 10px 0;
          font-size: 0.8rem;
        }

        .breadcrumbs-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .breadcrumbs-trail {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .crumb-link {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--text-muted);
          transition: color 0.15s ease;
        }

        .crumb-link:hover {
          color: var(--accent-primary);
        }

        .crumb-separator {
          color: var(--border-dark);
        }

        .crumb-current {
          color: var(--text-primary);
          font-weight: 600;
        }

        .marketplace-assurance {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: var(--success);
          font-weight: 600;
        }

        .marketplace-assurance .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--success);
        }

        @media (max-width: 640px) {
          .marketplace-assurance {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};
