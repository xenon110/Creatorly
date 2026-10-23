import React, { useState } from 'react';
import type { CurrencyCode, AuthUser, UserRole } from '../types/creator';
import { CURRENCIES } from '../data/currencies';
import { 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  Globe, 
  Check,
  ArrowRight
} from 'lucide-react';
import { CreatorlyLogo } from './CreatorlyLogo';


interface GlobalNavbarProps {
  currentCurrency: CurrencyCode;
  onCurrencyChange: (code: CurrencyCode) => void;
  onRequestBooking?: () => void;
  onShowToast: (msg: string) => void;
  activeView: 'smartmatch' | 'discover' | 'creator-profile' | 'inbox' | 'kinetic-hero' | 'workspace';
  onNavigate: (view: 'smartmatch' | 'discover' | 'creator-profile' | 'inbox' | 'kinetic-hero' | 'workspace') => void;
  compareCount: number;
  onOpenCompare: () => void;
  onOpenOnboarding: () => void;
  unreadInboxCount: number;
  currentUser?: AuthUser | null;
  onOpenAuth?: (tab?: 'signin' | 'signup', role?: UserRole) => void;
  onLogout?: () => void;
}

export const GlobalNavbar: React.FC<GlobalNavbarProps> = ({
  currentCurrency,
  onCurrencyChange,
  onShowToast,
  activeView,
  onNavigate,
  compareCount,
  onOpenCompare,
  onOpenOnboarding,
  unreadInboxCount,
  currentUser,
  onOpenAuth,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [authModal, setAuthModal] = useState<'brand' | 'creator' | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('discover');
      onShowToast(`Searching for: "${searchQuery}"`);
    }
  };

  return (
    <>
      <header className="global-nav-container">
        <div className="nav-inner">
          {/* Brand Logo */}
          <div className="nav-left">
            <button 
              type="button" 
              className="nav-logo" 
              onClick={() => onNavigate('smartmatch')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <CreatorlyLogo width={30} height={24} />
              <span className="logo-wordmark" style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.03em', color: '#18191E' }}>creatorly.</span>
            </button>
          </div>

          {/* Center Navigation */}
          <nav className="nav-center desktop-only" aria-label="Main Navigation">
            <button
              type="button"
              className={`nav-link ${activeView === 'discover' ? 'active' : ''}`}
              onClick={() => onNavigate('discover')}
            >
              Discover
            </button>

            <button
              type="button"
              className={`nav-link ${activeView === 'workspace' ? 'active' : ''}`}
              onClick={() => onNavigate('workspace')}
            >
              Creator Workspace
            </button>

            <button
              type="button"
              className={`nav-link ${activeView === 'creator-profile' ? 'active' : ''}`}
              onClick={() => onNavigate('creator-profile')}
            >
              Creator Storefront
            </button>

            <button
              type="button"
              className="nav-link"
              onClick={onOpenCompare}
            >
              Compare
              {compareCount > 0 && (
                <span className="nav-counter-badge">{compareCount}</span>
              )}
            </button>

            <button
              type="button"
              className={`nav-link ${activeView === 'inbox' ? 'active' : ''}`}
              onClick={() => onNavigate('inbox')}
            >
              Workflow Pipeline
              {unreadInboxCount > 0 && (
                <span className="nav-counter-badge badge-alert">{unreadInboxCount}</span>
              )}
            </button>
          </nav>

          {/* Right — Role-based entry + actions */}
          <div className="nav-right desktop-only">
            {/* Currency Selector */}
            <div className="currency-selector-wrapper">
              <button 
                type="button" 
                className="currency-btn"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                aria-label="Select currency"
                aria-expanded={currencyDropdownOpen}
              >
                <Globe size={14} />
                <span>{currentCurrency}</span>
                <ChevronDown size={12} className={`chevron ${currencyDropdownOpen ? 'rotate' : ''}`} />
              </button>

              {currencyDropdownOpen && (
                <div className="currency-dropdown card">
                  <div className="currency-dropdown-header">
                    <span>Display Currency</span>
                  </div>
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                    <button
                      key={code}
                      type="button"
                      className={`currency-option ${currentCurrency === code ? 'selected' : ''}`}
                      onClick={() => {
                        onCurrencyChange(code);
                        setCurrencyDropdownOpen(false);
                        onShowToast(`Currency: ${code} (${CURRENCIES[code].symbol})`);
                      }}
                    >
                      <span className="code">{code}</span>
                      <span className="symbol">{CURRENCIES[code].symbol}</span>
                      {currentCurrency === code && <Check size={14} className="check-icon" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search & Register as Influencer Buttons */}
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {currentUser.role === 'creator' && (
                  <button
                    type="button"
                    className="btn-role btn-role-creator"
                    onClick={() => onNavigate('workspace')}
                    style={{ background: '#16281D', color: '#FFFFFF', borderColor: '#16281D' }}
                  >
                    Workspace
                  </button>
                )}
                <button
                  type="button"
                  className="btn-role btn-role-brand"
                  onClick={() => onNavigate('inbox')}
                >
                  {currentUser.role === 'creator' ? 'Deals Pipeline' : 'Campaign Hub'}
                </button>
                <button
                  type="button"
                  className="btn-role btn-role-creator"
                  onClick={() => onLogout && onLogout()}
                  title="Sign out of session"
                >
                  Log out ({currentUser.name.split(' ')[0]})
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button 
                  type="button" 
                  className="btn-role btn-role-brand"
                  onClick={() => {
                    onNavigate('discover');
                    onShowToast('Browsing verified creators & transparent rate cards');
                  }}
                  title="Explore creators, audience metrics & transparent rates"
                >
                  Find Creators & Rates
                </button>

                <button 
                  type="button" 
                  className="btn-role btn-role-creator"
                  onClick={() => {
                    if (onOpenAuth) {
                      onOpenAuth('signup', 'creator');
                    } else {
                      onOpenOnboarding();
                    }
                    onShowToast('Register your details as a creator');
                  }}
                  title="Register your details, connect socials & list rate cards"
                >
                  Join as Creator
                </button>

                <button 
                  type="button" 
                  className="btn-role btn-role-login"
                  onClick={() => onOpenAuth && onOpenAuth('signin', 'creator')}
                >
                  Log in
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="mobile-only mobile-toggle-wrapper">
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-drawer">
            <div className="mobile-drawer-inner">
              <form onSubmit={handleSearchSubmit} className="mobile-search">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search creators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              <div className="mobile-nav-links">
                <button 
                  type="button" 
                  className={`mobile-link-btn ${activeView === 'discover' ? 'active' : ''}`}
                  onClick={() => { onNavigate('discover'); setMobileMenuOpen(false); }}
                >
                  Discover Creators
                </button>
                <button 
                  type="button" 
                  className="mobile-link-btn"
                  onClick={() => { onOpenCompare(); setMobileMenuOpen(false); }}
                >
                  <span>Compare ({compareCount})</span>
                </button>
                <button 
                  type="button" 
                  className={`mobile-link-btn ${activeView === 'inbox' ? 'active' : ''}`}
                  onClick={() => { onNavigate('inbox'); setMobileMenuOpen(false); }}
                >
                  <span>Workflow Pipeline ({unreadInboxCount})</span>
                </button>
              </div>

              <div className="mobile-role-actions">
                {currentUser ? (
                  <>
                    <button
                      className="btn btn-primary btn-block"
                      onClick={() => { setMobileMenuOpen(false); onNavigate('inbox'); }}
                    >
                      {currentUser.role === 'creator' ? 'Deals Pipeline' : 'Campaign Hub'}
                    </button>
                    <button
                      className="btn btn-secondary btn-block"
                      onClick={() => { setMobileMenuOpen(false); if (onLogout) onLogout(); }}
                    >
                      Log out ({currentUser.name})
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className="btn btn-primary btn-block"
                      onClick={() => { setMobileMenuOpen(false); onNavigate('discover'); onShowToast('Browsing verified creators & transparent rate cards'); }}
                    >
                      Find Creators & Rates
                    </button>
                    <button 
                      className="btn btn-secondary btn-block"
                      onClick={() => { 
                        setMobileMenuOpen(false); 
                        if (onOpenAuth) onOpenAuth('signup', 'creator');
                        else onOpenOnboarding(); 
                        onShowToast('Register your details as a creator');
                      }}
                    >
                      Join as Creator
                    </button>
                    <button 
                      className="btn btn-secondary btn-block"
                      style={{ background: '#18191E', color: '#FFFFFF', borderColor: '#18191E' }}
                      onClick={() => { setMobileMenuOpen(false); onOpenAuth && onOpenAuth('signin', 'creator'); }}
                    >
                      Log in
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Auth / Role Selection Modal */}
      {authModal && (
        <div className="modal-overlay" onClick={() => setAuthModal(null)}>
          <div className="modal-content auth-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="auth-modal-inner">
              <button className="auth-close-btn" onClick={() => setAuthModal(null)}>
                <X size={18} />
              </button>

              {authModal === 'brand' ? (
                <>
                  <div className="auth-header">
                    <span className="auth-role-tag">For Brands</span>
                    <h3 className="auth-title">Find your next creator partner</h3>
                    <p className="auth-subtitle">
                      Browse verified creators, compare rates side-by-side, and book with milestone-protected payments.
                    </p>
                  </div>
                  
                  <div className="auth-form-fields">
                    <div className="form-group">
                      <label>Company name</label>
                      <input type="text" placeholder="Acme Inc." />
                    </div>
                    <div className="form-group">
                      <label>Work email</label>
                      <input type="email" placeholder="you@company.com" />
                    </div>
                    <div className="form-group">
                      <label>Password</label>
                      <input type="password" placeholder="Create a password" />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button 
                      className="btn btn-primary btn-block btn-lg" 
                      onClick={() => {
                        setAuthModal(null);
                        onNavigate('discover');
                        onShowToast('Explore verified creators in the marketplace.');
                      }}
                    >
                      <span>Explore Creators</span>
                      <ArrowRight size={16} />
                    </button>

                    <button 
                      type="button"
                      className="btn btn-secondary btn-block" 
                      style={{ background: '#ECFDF5', borderColor: '#A7F3D0', color: '#059669', fontWeight: 700 }}
                      onClick={() => {
                        setAuthModal(null);
                        onNavigate('inbox');
                        onShowToast('Opening Brand Campaign Hub in Workflow Pipeline');
                      }}
                    >
                      <span>Open Brand Campaign Hub →</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="auth-header">
                    <span className="auth-role-tag creator">For Creators</span>
                    <h3 className="auth-title">Showcase your work, get booked</h3>
                    <p className="auth-subtitle">
                      Set your rates, list your packages, and receive collaboration requests from real brands. No agency cuts.
                    </p>
                  </div>
                  
                  <div className="auth-form-fields">
                    <div className="form-group">
                      <label>Your full name</label>
                      <input type="text" placeholder="Priya Sharma" />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" placeholder="you@email.com" />
                    </div>
                    <div className="form-group">
                      <label>Primary platform</label>
                      <select>
                        <option value="">Select one</option>
                        <option value="youtube">YouTube</option>
                        <option value="instagram">Instagram</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button 
                      className="btn btn-primary btn-block btn-lg" 
                      onClick={() => {
                        setAuthModal(null);
                        onOpenOnboarding();
                      }}
                    >
                      <span>Create your storefront</span>
                      <ArrowRight size={16} />
                    </button>

                    <button 
                      type="button"
                      className="btn btn-secondary btn-block" 
                      style={{ background: '#ECFDF5', borderColor: '#A7F3D0', color: '#059669', fontWeight: 700 }}
                      onClick={() => {
                        setAuthModal(null);
                        onNavigate('inbox');
                        onShowToast('Opening Creator Workspace in Workflow Pipeline');
                      }}
                    >
                      <span>Open Creator Workspace →</span>
                    </button>
                  </div>

                  <p className="auth-footer-note">
                    Free to join. You keep 100% of what brands pay you.
                  </p>

                  <div className="auth-switch-text">
                    <span>Looking to hire creators? <button onClick={() => setAuthModal('brand')}>Sign up as a brand</button></span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .global-nav-container {
          position: sticky;
          top: 0;
          z-index: 100;
          background-color: rgba(255, 255, 255, 0.92);
          backdrop-filter: saturate(180%) blur(20px);
          -webkit-backdrop-filter: saturate(180%) blur(20px);
          border-bottom: 1px solid var(--border-light);
          height: var(--header-height);
          display: flex;
          align-items: center;
        }

        .nav-inner {
          max-width: var(--container-max-width);
          width: 100%;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          height: 100%;
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .logo-wordmark {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          font-weight: 400;
          color: var(--text-primary);
          letter-spacing: -0.03em;
          font-style: italic;
        }

        /* Center Nav Links */
        .nav-center {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .nav-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          font-size: 0.84rem;
          font-weight: 500;
          color: var(--text-secondary);
          border-radius: var(--radius-full);
          transition: all 0.15s ease;
          position: relative;
          letter-spacing: -0.005em;
        }

        .nav-link:hover {
          color: var(--text-primary);
          background-color: var(--bg-tertiary);
        }

        .nav-link.active {
          color: var(--text-primary);
          font-weight: 600;
        }

        .nav-counter-badge {
          font-size: 0.65rem;
          font-weight: 700;
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          padding: 1px 7px;
          border-radius: 10px;
          line-height: 1.4;
        }

        .nav-counter-badge.badge-alert {
          background: var(--brand);
          color: white;
        }

        /* Right */
        .nav-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        /* Role buttons — the key UX element */
        .btn-role {
          padding: 7px 18px;
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: var(--radius-full);
          transition: all 0.2s ease;
          letter-spacing: -0.005em;
        }

        .btn-role-brand {
          background: var(--accent-primary);
          color: var(--text-inverted);
          border: 1px solid var(--accent-primary);
        }

        .btn-role-brand:hover {
          background: var(--accent-hover);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .btn-role-creator {
          background: transparent;
          color: var(--text-primary);
          border: 1px solid var(--border-medium);
        }

        .btn-role-creator:hover {
          background: var(--bg-tertiary);
          border-color: var(--accent-primary);
          transform: translateY(-1px);
        }

        .btn-role-login {
          background: #18191E;
          color: #FFFFFF;
          border: 1px solid #18191E;
        }

        .btn-role-login:hover {
          background: #FF5B38;
          border-color: #FF5B38;
          transform: translateY(-1px);
        }

        /* Currency */
        .currency-selector-wrapper {
          position: relative;
        }

        .currency-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--text-muted);
          border-radius: var(--radius-full);
          border: 1px solid transparent;
          transition: all 0.15s ease;
        }

        .currency-btn:hover {
          background: var(--bg-tertiary);
          color: var(--text-secondary);
        }

        .chevron {
          transition: transform 0.15s ease;
        }

        .chevron.rotate {
          transform: rotate(180deg);
        }

        .currency-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 200px;
          padding: 8px 4px;
          z-index: 200;
          animation: scaleUp 0.12s ease-out;
        }

        .currency-dropdown-header {
          padding: 4px 12px 8px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted);
        }

        .currency-option {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          font-size: 0.84rem;
          border-radius: var(--radius-sm);
          transition: background 0.1s ease;
          color: var(--text-secondary);
        }

        .currency-option:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .currency-option.selected {
          color: var(--text-primary);
          font-weight: 600;
        }

        .currency-option .code {
          font-weight: 600;
          min-width: 32px;
        }

        .currency-option .symbol {
          color: var(--text-muted);
        }

        .currency-option .check-icon {
          margin-left: auto;
          color: var(--brand);
        }

        /* Auth Modal */
        .auth-modal-box {
          max-width: 440px;
        }

        .auth-modal-inner {
          padding: 36px 32px 32px;
          position: relative;
        }

        .auth-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          color: var(--text-muted);
          transition: all 0.15s ease;
        }

        .auth-close-btn:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .auth-header {
          margin-bottom: 28px;
        }

        .auth-role-tag {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--brand);
          background: var(--brand-subtle);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          margin-bottom: 16px;
        }

        .auth-role-tag.creator {
          color: var(--accent-teal);
          background: var(--success-bg);
        }

        .auth-title {
          font-family: var(--font-serif);
          font-size: 1.65rem;
          font-weight: 400;
          line-height: 1.2;
          letter-spacing: -0.03em;
          margin-bottom: 8px;
        }

        .auth-subtitle {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .auth-form-fields {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .form-group label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .form-group input,
        .form-group select {
          padding: 10px 14px;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          font-size: 0.88rem;
          color: var(--text-primary);
          background: var(--bg-primary);
          transition: border-color 0.15s ease;
          font-family: var(--font-sans);
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: var(--accent-primary);
          outline: none;
          box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.06);
        }

        .form-group input::placeholder {
          color: var(--text-muted);
        }

        .auth-switch-text {
          text-align: center;
          margin-top: 20px;
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .auth-switch-text button {
          color: var(--brand);
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .auth-footer-note {
          text-align: center;
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-top: 12px;
        }

        /* Desktop / Mobile toggles */
        .desktop-only {
          display: flex;
        }

        .mobile-only {
          display: none;
        }

        @media (max-width: 900px) {
          .desktop-only {
            display: none;
          }

          .mobile-only {
            display: flex;
          }
        }

        .mobile-toggle-wrapper {
          align-items: center;
          justify-content: flex-end;
        }

        .mobile-menu-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          color: var(--text-primary);
        }

        .mobile-drawer {
          position: fixed;
          inset: var(--header-height) 0 0 0;
          background: var(--bg-primary);
          z-index: 99;
          animation: fadeIn 0.12s ease-out;
          overflow-y: auto;
        }

        .mobile-drawer-inner {
          padding: 20px 20px 40px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .mobile-search {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          background: var(--bg-secondary);
        }

        .mobile-search input {
          border: none;
          background: transparent;
          font-size: 0.9rem;
          flex: 1;
          outline: none;
          color: var(--text-primary);
        }

        .mobile-search svg {
          color: var(--text-muted);
        }

        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .mobile-link-btn {
          text-align: left;
          padding: 12px 16px;
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          transition: all 0.1s ease;
        }

        .mobile-link-btn:hover,
        .mobile-link-btn.active {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .mobile-role-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-top: 12px;
          border-top: 1px solid var(--border-light);
        }
      `}</style>
    </>
  );
};
