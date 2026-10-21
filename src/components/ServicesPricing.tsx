import React, { useState } from 'react';
import type { ServicePackage, CurrencyCode, ServiceAddOn } from '../types/creator';
import { ServicePackageCard } from './ServicePackageCard';
import { PackageComparisonTable } from './PackageComparisonTable';
import { formatCurrency } from '../data/currencies';
import { 
  ShieldCheck, 
  Layers, 
  PlusCircle, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

interface ServicesPricingProps {
  packages: ServicePackage[];
  addOns: ServiceAddOn[];
  currentCurrency: CurrencyCode;
  onSelectPackage: (pkg: ServicePackage) => void;
  onOpenCustomQuote: () => void;
}

export const ServicesPricing: React.FC<ServicesPricingProps> = ({
  packages,
  addOns,
  currentCurrency,
  onSelectPackage,
  onOpenCustomQuote,
}) => {
  const [showComparison, setShowComparison] = useState(false);

  return (
    <section className="services-pricing-section" id="creator-services">
      <div className="section-header">
        <div className="section-header-row">
          <div>
            <div className="section-tag">Standardized Deliverables</div>
            <h2 className="section-title">Services & Transparent Pricing</h2>
            <p className="section-desc">
              Choose an upfront service package or customize with optional campaign add-ons. No hidden surprises or quote haggling.
            </p>
          </div>

          <div className="table-toggle-wrapper">
            <button
              type="button"
              className="btn btn-secondary table-toggle-btn"
              onClick={() => setShowComparison(!showComparison)}
              aria-expanded={showComparison}
            >
              <Layers size={15} />
              <span>{showComparison ? 'Hide Comparison Matrix' : 'Compare Packages Side-by-Side'}</span>
              {showComparison ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Transparency Banner */}
      <div className="transparency-banner">
        <div className="banner-icon">
          <ShieldCheck size={18} />
        </div>
        <div className="banner-content">
          <h4>Escrow & Delivery Guarantee</h4>
          <p>
            When you select a package, funds remain in secure Creatorly Escrow and are only disbursed upon your final content approval. All packages include at least 1 script outline and video edit review.
          </p>
        </div>
      </div>

      {/* Side-by-Side Comparison Table (if expanded) */}
      {showComparison && (
        <PackageComparisonTable
          packages={packages}
          currentCurrency={currentCurrency}
          onSelectPackage={onSelectPackage}
        />
      )}

      {/* 4 Standard Packages Grid */}
      <div className="packages-grid">
        {packages.map((pkg) => (
          <ServicePackageCard
            key={pkg.id}
            pkg={pkg}
            currentCurrency={currentCurrency}
            onSelect={onSelectPackage}
          />
        ))}
      </div>

      {/* Available Add-Ons Showcase */}
      <div className="addons-showcase card">
        <div className="addons-header">
          <div className="addons-title-left">
            <PlusCircle size={18} className="text-accent" />
            <div>
              <h3>Optional Campaign Add-Ons</h3>
              <p>Configure these additional rights and deliverables during package selection</p>
            </div>
          </div>

          <button 
            type="button" 
            className="btn btn-outline-primary btn-sm"
            onClick={onOpenCustomQuote}
          >
            Need a Custom Scope?
          </button>
        </div>

        <div className="addons-grid">
          {addOns.map((addon) => (
            <div key={addon.id} className="addon-item-box">
              <div className="addon-top">
                <span className="addon-name">{addon.name}</span>
                <span className="addon-price">
                  +{formatCurrency(addon.priceInINR, currentCurrency)}
                </span>
              </div>
              <p className="addon-desc">{addon.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .services-pricing-section {
          margin-bottom: 48px;
        }

        .section-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .table-toggle-btn {
          font-weight: 600;
          background: #FFFFFF;
          border: 1px solid rgba(99, 102, 241, 0.3);
          color: var(--color-indigo);
          border-radius: var(--radius-full);
          padding: 8px 18px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .table-toggle-btn:hover {
          background: rgba(99, 102, 241, 0.08);
          border-color: var(--color-indigo);
          transform: translateY(-1px);
        }

        .transparency-banner {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px 20px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.06) 100%);
          border: 1px solid rgba(16, 185, 129, 0.25);
          border-radius: var(--radius-lg);
          margin: 18px 0 26px;
          box-shadow: 0 4px 14px -3px rgba(16, 185, 129, 0.08);
        }

        .banner-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
        }

        .banner-content h4 {
          font-size: 0.925rem;
          font-weight: 700;
          color: #065F46;
          margin-bottom: 3px;
        }

        .banner-content p {
          font-size: 0.825rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .packages-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-top: 24px;
        }

        @media (max-width: 1180px) {
          .packages-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .packages-grid {
            grid-template-columns: 1fr;
          }
        }

        .addons-showcase {
          margin-top: 32px;
          padding: 26px;
          background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);
          border: 1px solid rgba(99, 102, 241, 0.15);
          border-radius: var(--radius-xl);
          position: relative;
          overflow: hidden;
          box-shadow: 0 6px 20px -4px rgba(15, 23, 42, 0.04);
        }

        .addons-showcase::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #059669;
        }

        .addons-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
          flex-wrap: wrap;
          gap: 14px;
        }

        .addons-title-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .addons-title-left .text-accent {
          color: var(--color-indigo);
          animation: sparkleFloat 4s ease-in-out infinite;
        }

        .addons-title-left h3 {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }

        .addons-title-left p {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .addons-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        @media (max-width: 992px) {
          .addons-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 580px) {
          .addons-grid {
            grid-template-columns: 1fr;
          }
        }

        .addon-item-box {
          background-color: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: all 0.22s ease;
          position: relative;
        }

        .addon-item-box:hover {
          border-color: rgba(99, 102, 241, 0.4);
          transform: translateY(-3px);
          box-shadow: 0 8px 24px -4px rgba(99, 102, 241, 0.12);
        }

        .addon-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }

        .addon-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.35;
        }

        .addon-price {
          font-size: 0.85rem;
          font-weight: 800;
          color: #059669;
          background: #ECFDF5;
          padding: 3px 8px;
          border-radius: var(--radius-sm);
          white-space: nowrap;
          border: 1px solid #A7F3D0;
        }

        .addon-desc {
          font-size: 0.775rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }
      `}</style>
    </section>
  );
};
