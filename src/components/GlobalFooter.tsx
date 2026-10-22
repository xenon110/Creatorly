import React from 'react';
import type { CurrencyCode } from '../types/creator';
import { CURRENCIES } from '../data/currencies';
import { Lock, Globe } from 'lucide-react';
import { CreatorlyLogo } from './CreatorlyLogo';

interface GlobalFooterProps {
  currentCurrency: CurrencyCode;
  onCurrencyChange: (code: CurrencyCode) => void;
  onShowToast: (msg: string) => void;
  onNavigateToPage?: (slug: string) => void;
}

export const GlobalFooter: React.FC<GlobalFooterProps> = ({
  currentCurrency,
  onCurrencyChange,
  onShowToast,
  onNavigateToPage,
}) => {
  const handleLinkClick = (e: React.MouseEvent, slug: string, toastDesc: string) => {
    e.preventDefault();
    if (onNavigateToPage) {
      onNavigateToPage(slug);
    } else {
      onShowToast(toastDesc);
    }
  };

  return (
    <footer className="global-footer">
      <div className="container footer-inner">
        {/* Top 4-Column Layout */}
        <div className="footer-top-grid">
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <div className="footer-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreatorlyLogo width={30} height={24} />
              <span className="logo-wordmark" style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.03em', color: '#18191E' }}>creatorly.</span>
            </div>
            <p className="footer-brand-desc">
              The professional global marketplace connecting brands with verified tech, AI, and developer creators. Upfront pricing, audited metrics, and milestone escrow security.
            </p>
            <div 
              className="footer-trust-pill"
              onClick={() => onNavigateToPage?.('how-escrow-works')}
              style={{ cursor: 'pointer' }}
              title="Click to view Escrow Architecture"
            >
              <Lock size={12} className="text-success" />
              <span>Bank-Grade Escrow Protection</span>
            </div>
          </div>

          {/* Discover Creators */}
          <div className="footer-col">
            <h4 className="footer-heading">Discover Creators</h4>
            <ul className="footer-links">
              <li><a href="#technology" onClick={(e) => handleLinkClick(e, 'tech-ai-creators', 'Browsing Technology & AI creators')}>Technology & AI</a></li>
              <li><a href="#developer-tools" onClick={(e) => handleLinkClick(e, 'saas-devtools-creators', 'Browsing Developer Tools creators')}>Developer Tools & APIs</a></li>
              <li><a href="#productivity" onClick={(e) => handleLinkClick(e, 'saas-devtools-creators', 'Browsing SaaS & Productivity creators')}>SaaS & Productivity</a></li>
              <li><a href="#consumer-tech" onClick={(e) => handleLinkClick(e, 'consumer-tech-creators', 'Browsing Consumer Electronics creators')}>Consumer Electronics</a></li>
              <li><a href="#all-creators" onClick={(e) => handleLinkClick(e, 'all-creators', 'Browsing All Creators')}>All Vetted Creators</a></li>
            </ul>
          </div>

          {/* For Brands */}
          <div className="footer-col">
            <h4 className="footer-heading">For Brands & Agencies</h4>
            <ul className="footer-links">
              <li><a href="#how-escrow-works" onClick={(e) => handleLinkClick(e, 'how-escrow-works', 'Creatorly Escrow & Milestone Protection')}>Escrow Protection</a></li>
              <li><a href="#pricing-transparency" onClick={(e) => handleLinkClick(e, 'creator-standards', 'Pricing Transparency Standards')}>Pricing Standards</a></li>
              <li><a href="#usage-rights" onClick={(e) => handleLinkClick(e, 'creator-standards', 'Commercial Licensing Standards')}>Commercial Licensing</a></li>
              <li><a href="#case-studies" onClick={(e) => handleLinkClick(e, 'about-creatorly', 'Creatorly Manifesto & Mission')}>Brand Manifesto</a></li>
              <li><a href="#enterprise" onClick={(e) => handleLinkClick(e, 'agency-partnerships', 'Agency Partnerships')}>Enterprise Solutions</a></li>
            </ul>
          </div>

          {/* For Creators & Trust */}
          <div className="footer-col">
            <h4 className="footer-heading">Trust & Creator Resources</h4>
            <ul className="footer-links">
              <li><a href="#apply" onClick={(e) => handleLinkClick(e, 'apply-creator', 'Creator Application Portal')}>Apply as a Creator</a></li>
              <li><a href="#metrics-audit" onClick={(e) => handleLinkClick(e, 'verification-protocol', 'How Creatorly Verifies Audience APIs')}>Metric Verification Standards</a></li>
              <li><a href="#fellowship" onClick={(e) => handleLinkClick(e, 'creator-fellowship', 'Creator Fellowship Cohorts')}>Creator Fellowship</a></li>
              <li><a href="#terms" onClick={(e) => handleLinkClick(e, 'creator-standards', 'Creatorly Code of Conduct')}>Creator Standards</a></li>
              <li><a href="#press" onClick={(e) => handleLinkClick(e, 'press-media-kit', 'Press & Brand Kit')}>Press & Brand Kit</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Currency, Compliance */}
        <div className="footer-bottom-row">
          <div className="footer-bottom-left">
            <span>© {new Date().getFullYear()} Creatorly Technologies Inc. All rights reserved.</span>
            <span className="dot-sep">•</span>
            <span>Verified creator marketplace. Bank-grade milestone escrow for all brand collaborations.</span>
          </div>

          <div className="footer-bottom-right">
            <div className="footer-currency-picker">
              <Globe size={13} />
              <span>Currency:</span>
              <select 
                value={currentCurrency}
                onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
                aria-label="Change currency"
              >
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                  <option key={code} value={code}>
                    {code} ({CURRENCIES[code].symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .global-footer {
          background: #F5F5F7;
          color: #6E6E73;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
          margin-top: auto;
          padding: 64px 0 32px;
          position: relative;
        }

        .footer-top-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 36px;
          margin-bottom: 48px;
        }

        @media (max-width: 992px) {
          .footer-top-grid {
            grid-template-columns: 1fr 1fr;
            gap: 28px;
          }
        }

        @media (max-width: 580px) {
          .footer-top-grid {
            grid-template-columns: 1fr;
          }
        }

        .brand-col {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-mark-sm {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: #059669;
          color: #FFFFFF;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          box-shadow: 0 2px 8px rgba(5, 150, 105, 0.3);
        }

        .footer-logo .logo-wordmark {
          color: #0F172A;
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .footer-brand-desc {
          font-size: 0.85rem;
          color: #64748B;
          line-height: 1.6;
          max-width: 320px;
        }

        .footer-trust-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #065F46;
          background: #ECFDF5;
          border: 1px solid #A7F3D0;
          padding: 6px 14px;
          border-radius: 9999px;
          width: fit-content;
        }

        .footer-heading {
          font-size: 0.825rem;
          font-weight: 700;
          color: #0F172A;
          letter-spacing: -0.01em;
          margin-bottom: 16px;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 0;
          margin: 0;
        }

        .footer-links a {
          font-size: 0.825rem;
          color: #64748B;
          text-decoration: none;
          transition: all 0.15s ease;
          display: inline-block;
        }

        .footer-links a:hover {
          color: #059669;
          transform: translateX(2px);
        }

        .footer-bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 24px;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
          font-size: 0.75rem;
          color: #86868B;
          flex-wrap: wrap;
          gap: 16px;
        }

        .footer-bottom-left {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .footer-currency-picker {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6E6E73;
        }

        .footer-currency-picker select {
          background-color: #FFFFFF;
          color: #1D1D1F;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 9999px;
          padding: 5px 12px;
          font-size: 0.775rem;
          font-family: inherit;
          cursor: pointer;
          outline: none;
        }

        .footer-currency-picker select:focus {
          border-color: #000000;
        }
      `}</style>
    </footer>
  );
};
