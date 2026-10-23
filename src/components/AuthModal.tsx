import React, { useState } from 'react';
import type { AuthUser, UserRole } from '../types/creator';
import { CreatorlyLogo } from './CreatorlyLogo';
import { signInWithSupabase, signUpWithSupabase } from '../lib/supabaseClient';
import {
  X,
  Mail,
  Lock,
  User,
  Building2,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  Check,
  Video,
  FileCheck2,
  CreditCard
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser, destination?: any, createdCreator?: any) => void;
  initialTab?: 'signin' | 'signup';
  initialRole?: UserRole;
  targetDestination?: 'workspace' | 'discover' | 'pipeline' | 'storefront';
  onShowToast: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialTab = 'signin',
  initialRole = 'creator',
  targetDestination: _targetDestination,
  onShowToast
}) => {
  const [tab, setTab] = useState<'signin' | 'signup'>(initialTab);
  const [role, setRole] = useState<UserRole>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [handle, setHandle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [niche, setNiche] = useState('Tech & AI');
  const [campaignGoal, setCampaignGoal] = useState('Product Launch');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Preset Instant Demo Logins
  const handleQuickDemoCreator = () => {
    const demoUser: AuthUser = {
      id: 'alex-sharma',
      name: 'Alex Sharma',
      email: 'alex@alexsharma.media',
      role: 'creator',
      handle: '@alexsharma',
      avatarUrl: '/images/alex-sharma.jpg',
      niche: 'AI & Developer Tools',
      verified: true
    };
    onLoginSuccess(demoUser, 'workspace');
    onShowToast('Logged in as Creator: Alex Sharma (Creator Workspace)');
    onClose();
  };

  const handleQuickDemoBrand = () => {
    const demoUser: AuthUser = {
      id: 'brand-razorpay',
      name: 'Razorpay Growth Team',
      email: 'marketing@razorpay.com',
      role: 'brand',
      companyName: 'Razorpay Technologies',
      avatarUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&auto=format&fit=crop&q=80',
      verified: true
    };
    onLoginSuccess(demoUser, 'discover');
    onShowToast('Logged in as Brand: Razorpay Growth Team');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    const destination = (role === 'creator') ? 'workspace' : 'discover';
    setIsSubmitting(true);

    try {
      if (tab === 'signup') {
        if (role === 'creator' && !fullName.trim()) {
          setErrorMessage('Please enter your full creator name.');
          setIsSubmitting(false);
          return;
        }
        if (role === 'brand' && !companyName.trim()) {
          setErrorMessage('Please enter your company / brand name.');
          setIsSubmitting(false);
          return;
        }

        const { user: newUser, creator: createdCreator, error } = await signUpWithSupabase(email, password, {
          name: role === 'creator' ? fullName.trim() : companyName.trim(),
          role,
          handle: role === 'creator' ? (handle.startsWith('@') ? handle.trim() : `@${handle.trim() || 'creator'}`) : undefined,
          companyName: role === 'brand' ? companyName.trim() : undefined,
          niche: role === 'creator' ? niche : undefined
        });

        if (error || !newUser) {
          setErrorMessage(error || 'Failed to create account.');
          setIsSubmitting(false);
          return;
        }

        onLoginSuccess(newUser, destination, createdCreator);
        onShowToast(`Account created! Welcome to Creatorly, ${newUser.name}.`);
        onClose();
      } else {
        // Sign In Flow
        const { user: signedInUser, error } = await signInWithSupabase(email, password, role);

        if (error || !signedInUser) {
          setErrorMessage(error || 'Invalid email or password.');
          setIsSubmitting(false);
          return;
        }

        onLoginSuccess(signedInUser, destination);
        onShowToast(`Signed in successfully as ${signedInUser.name}!`);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="auth-modal-card-dashing" onClick={(e) => e.stopPropagation()}>
        {/* Floating Close Button */}
        <button
          type="button"
          className="auth-floating-close-btn"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div className="auth-dashing-grid">
          {/* ========================================================= */}
          {/* LEFT COLUMN: THE CREATOR COMMERCE SHOWCASE (DEEP DARK)   */}
          {/* ========================================================= */}
          <div className="auth-showcase-panel">
            {/* Top Brand Header */}
            <div className="showcase-top-row">
              <div className="showcase-logo-wrap">
                <CreatorlyLogo width={28} height={22} />
                <span className="showcase-brand-name">creatorly<span className="dot-coral">.</span></span>
              </div>
              <div className="showcase-live-pill">
                <span className="pulsing-live-dot"></span>
                <span>ESCROW SECURED</span>
              </div>
            </div>

            {/* Headline */}
            <div className="showcase-hero-text">
              <h2>Where verified creators & brands run commerce.</h2>
              <p>Zero agency markups. 100% milestone protected contracts.</p>
            </div>

            {/* Interactive Live Deal Snapshot Card */}
            <div className="live-deal-visual-card">
              <div className="deal-visual-header">
                <div className="deal-creator-cell">
                  <img src="/images/alex-sharma.jpg" alt="Alex Sharma" className="deal-avatar" />
                  <div>
                    <div className="deal-name-verified">
                      <strong>Alex Sharma</strong>
                      <span className="deal-v-badge">✓</span>
                    </div>
                    <span className="deal-handle">@alexsharma • Tech & AI</span>
                  </div>
                </div>
                <div className="deal-brand-cell">
                  <span className="brand-tag-name">Razorpay</span>
                </div>
              </div>

              <div className="deal-package-bar">
                <span className="package-title">Dedicated 60s Integration + Newsletter</span>
                <span className="package-escrow-badge">₹85,000 Locked in Escrow</span>
              </div>

              <div className="deal-milestone-track">
                <div className="milestone-status-line">
                  <span className="milestone-step-text">Milestone 3 of 5: <strong>Script Approved</strong></span>
                  <span className="milestone-percent">60%</span>
                </div>
                <div className="milestone-progress-bar">
                  <div className="milestone-fill-glow" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>

            {/* Visual 4-Step Pipeline Flow */}
            <div className="pipeline-stepper-box">
              <div className="stepper-title">The 4-Stage Collaboration Pipeline:</div>
              <div className="stepper-grid">
                <div className="stepper-step">
                  <div className="step-icon-bubble"><Video size={13} /></div>
                  <span className="step-num">01. Discovery</span>
                  <span className="step-desc">Audit real reach</span>
                </div>
                <div className="stepper-step">
                  <div className="step-icon-bubble"><CreditCard size={13} /></div>
                  <span className="step-num">02. Escrow</span>
                  <span className="step-desc">Deposit locked</span>
                </div>
                <div className="stepper-step">
                  <div className="step-icon-bubble"><FileCheck2 size={13} /></div>
                  <span className="step-num">03. Review</span>
                  <span className="step-desc">Approve video</span>
                </div>
                <div className="stepper-step">
                  <div className="step-icon-bubble"><Check size={13} /></div>
                  <span className="step-num">04. Payout</span>
                  <span className="step-desc">Bank transfer</span>
                </div>
              </div>
            </div>

            {/* Instant Demo Switcher */}
            <div className="auth-fast-demo-container">
              <div className="fast-demo-label">
                <Zap size={14} className="text-coral" />
                <span>One-Click Test Accounts (Instant Access)</span>
              </div>
              <div className="fast-demo-grid">
                <button
                  type="button"
                  className="btn-fast-demo btn-fast-creator"
                  onClick={handleQuickDemoCreator}
                >
                  <img src="/images/alex-sharma.jpg" alt="Alex" className="mini-demo-img" />
                  <div className="fast-demo-content">
                    <div className="fast-demo-title">
                      <strong>Alex Sharma</strong>
                      <span className="badge-role-pill creator-pill">Creator</span>
                    </div>
                    <span className="fast-demo-sub">Creator Studio & Deals Pipeline</span>
                  </div>
                  <ArrowRight size={14} className="fast-arrow" />
                </button>

                <button
                  type="button"
                  className="btn-fast-demo btn-fast-brand"
                  onClick={handleQuickDemoBrand}
                >
                  <div className="mini-demo-icon">🏢</div>
                  <div className="fast-demo-content">
                    <div className="fast-demo-title">
                      <strong>Razorpay Marketing</strong>
                      <span className="badge-role-pill brand-pill">Brand</span>
                    </div>
                    <span className="fast-demo-sub">Brand Campaign Hub & Escrow</span>
                  </div>
                  <ArrowRight size={14} className="fast-arrow" />
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: HIGH-CONTRAST AUTH COMMAND CONSOLE          */}
          {/* ========================================================= */}
          <div className="auth-console-panel">
            {/* Top Switcher: Sign In vs Create Account */}
            <div className="dashing-tab-wrapper">
              <button
                type="button"
                className={`dashing-tab-btn ${tab === 'signin' ? 'active' : ''}`}
                onClick={() => { setTab('signin'); setErrorMessage(null); }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`dashing-tab-btn ${tab === 'signup' ? 'active' : ''}`}
                onClick={() => { setTab('signup'); setErrorMessage(null); }}
              >
                Create Account
              </button>
            </div>

            {/* Console Header */}
            <div className="console-title-row">
              <h3>
                {tab === 'signin' ? (
                  role === 'creator' ? 'Creator Sign In' : 'Brand Sign In'
                ) : (
                  role === 'creator' ? 'Join as a Creator' : 'Register your Brand'
                )}
              </h3>
              <p>
                {tab === 'signin'
                  ? 'Access your deals pipeline, review scripts, and track payouts.'
                  : 'Get started in under 2 minutes with direct storefront access.'}
              </p>
            </div>

            {/* Interactive Role Switcher */}
            <div className="dashing-role-selector">
              <button
                type="button"
                className={`dashing-role-card ${role === 'creator' ? 'selected' : ''}`}
                onClick={() => setRole('creator')}
              >
                <div className="role-icon-box">
                  <User size={18} />
                </div>
                <div className="role-card-text">
                  <strong>Influencer / Creator</strong>
                  <span>Get booked & monetize</span>
                </div>
                {role === 'creator' && <div className="role-active-check">✓</div>}
              </button>

              <button
                type="button"
                className={`dashing-role-card ${role === 'brand' ? 'selected' : ''}`}
                onClick={() => setRole('brand')}
              >
                <div className="role-icon-box">
                  <Building2 size={18} />
                </div>
                <div className="role-card-text">
                  <strong>Brand / Business</strong>
                  <span>Hire creators with escrow</span>
                </div>
                {role === 'brand' && <div className="role-active-check">✓</div>}
              </button>
            </div>

            {/* Social 1-Click Login Option */}
            <div className="social-quick-login-row">
              <button
                type="button"
                className="btn-social-auth"
                onClick={() => {
                  if (role === 'creator') handleQuickDemoCreator();
                  else handleQuickDemoBrand();
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="dashing-divider">
              <span>or continue with email</span>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="auth-error-chip">
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="dashing-auth-form">
              {tab === 'signup' && role === 'creator' && (
                <div className="form-two-cols">
                  <div className="form-input-block">
                    <label>Full Creator Name</label>
                    <div className="input-shell">
                      <User size={16} className="input-ico" />
                      <input
                        type="text"
                        placeholder="Alex Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-input-block">
                    <label>Social Handle</label>
                    <div className="input-shell">
                      <span className="input-at">@</span>
                      <input
                        type="text"
                        placeholder="alexsharma"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {tab === 'signup' && role === 'brand' && (
                <div className="form-two-cols">
                  <div className="form-input-block">
                    <label>Company / Brand Name</label>
                    <div className="input-shell">
                      <Building2 size={16} className="input-ico" />
                      <input
                        type="text"
                        placeholder="Razorpay Inc."
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-input-block">
                    <label>Campaign Objective</label>
                    <select
                      value={campaignGoal}
                      onChange={(e) => setCampaignGoal(e.target.value)}
                      className="dashing-select"
                    >
                      <option value="Product Launch">New Product Launch</option>
                      <option value="Developer Reach">Developer & Tech Reach</option>
                      <option value="Performance">Performance & Conversions</option>
                      <option value="Ambassadorship">Long-term Creator Deals</option>
                    </select>
                  </div>
                </div>
              )}

              {tab === 'signup' && role === 'creator' && (
                <div className="form-input-block">
                  <label>Primary Content Category</label>
                  <select
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className="dashing-select"
                  >
                    <option value="Tech & AI">Tech & Artificial Intelligence</option>
                    <option value="Developer Tools">Developer Tools & Code</option>
                    <option value="Productivity">Productivity & Business</option>
                    <option value="Consumer Tech">Consumer Hardware & Reviews</option>
                    <option value="Startups">Startups & Venture</option>
                  </select>
                </div>
              )}

              {/* Email Address */}
              <div className="form-input-block">
                <label>{role === 'brand' ? 'Work Email Address' : 'Email Address'}</label>
                <div className="input-shell">
                  <Mail size={16} className="input-ico" />
                  <input
                    type="email"
                    placeholder={role === 'brand' ? 'partner@company.com' : 'you@creator.media'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-input-block">
                <label>Password</label>
                <div className="input-shell">
                  <Lock size={16} className="input-ico" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn-toggle-eye"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Options Row */}
              <div className="form-options-bar">
                <label className="dashing-checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Keep me signed in</span>
                </label>
                {tab === 'signin' && (
                  <button
                    type="button"
                    className="btn-forgot-link"
                    onClick={() => onShowToast('Password reset link sent to your email.')}
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              {/* Submit CTA */}
              <button type="submit" className="btn-dashing-submit" disabled={isSubmitting}>
                <span>
                  {isSubmitting
                    ? (tab === 'signin' ? 'Authenticating...' : 'Creating Account...')
                    : (tab === 'signin'
                      ? (role === 'creator' ? 'Sign In to Creator Studio' : 'Sign In to Brand Hub')
                      : (role === 'creator' ? 'Launch My Creator Storefront' : 'Create Brand Partner Account'))}
                </span>
                <ArrowRight size={17} className="submit-arrow" />
              </button>
            </form>

            {/* Footer Trust Bar */}
            <div className="console-trust-footer">
              <ShieldCheck size={14} className="text-emerald" />
              <span>Bank-grade 256-bit Escrow Encryption • Social API Authenticated</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .auth-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(10, 12, 16, 0.82);
          backdrop-filter: blur(14px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          z-index: 2500;
          animation: authFade 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes authFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .auth-modal-card-dashing {
          background: #FFFFFF;
          width: 100%;
          max-width: 1080px;
          border-radius: 28px;
          box-shadow: 0 35px 90px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.1);
          overflow: hidden;
          position: relative;
          max-height: 92vh;
          animation: authZoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes authZoomIn {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(18px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .auth-floating-close-btn {
          position: absolute;
          top: 18px;
          right: 20px;
          background: #FAF8F5;
          border: 1px solid #E2E8F0;
          color: #18191E;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .auth-floating-close-btn:hover {
          background: #18191E;
          color: #FFFFFF;
          transform: rotate(90deg);
        }

        .auth-dashing-grid {
          display: grid;
          grid-template-columns: 1.15fr 1.3fr;
          max-height: 92vh;
        }

        /* ========================================================= */
        /* LEFT PANEL: CLEAN LIGHT SHOWCASE (WARM CREAM #FAF8F5)     */
        /* ========================================================= */
        .auth-showcase-panel {
          background: #FAF8F5;
          color: #18191E;
          padding: 38px 40px;
          display: flex;
          flex-direction: column;
          gap: 22px;
          overflow-y: auto;
          border-right: 1px solid #ECE7DE;
          scrollbar-width: thin;
        }

        .showcase-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .showcase-logo-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .showcase-brand-name {
          font-size: 1.35rem;
          font-weight: 800;
          color: #18191E;
          letter-spacing: -0.03em;
        }

        .dot-coral {
          color: #FF5B38;
        }

        .showcase-live-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #FFFFFF;
          border: 1px solid #ECE7DE;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: #18191E;
        }

        .pulsing-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #54c463;
          box-shadow: 0 0 8px #54c463;
          animation: pulseGreen 1.8s infinite;
        }

        @keyframes pulseGreen {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }

        .showcase-hero-text h2 {
          font-size: 1.6rem;
          font-weight: 800;
          line-height: 1.25;
          letter-spacing: -0.025em;
          color: #18191E;
          margin: 0 0 8px 0;
        }

        .showcase-hero-text p {
          font-size: 0.88rem;
          color: #5C616E;
          line-height: 1.45;
          margin: 0;
        }

        /* Live Deal Snapshot Visual Card */
        .live-deal-visual-card {
          background: #FFFFFF;
          border: 1.5px solid #ECE7DE;
          border-radius: 18px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
        }

        .deal-visual-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .deal-creator-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .deal-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid #FF5B38;
        }

        .deal-name-verified {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .deal-name-verified strong {
          font-size: 0.88rem;
          color: #18191E;
        }

        .deal-v-badge {
          background: #54c463;
          color: #0E1015;
          font-size: 0.6rem;
          font-weight: 800;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .deal-handle {
          font-size: 0.72rem;
          color: #64748B;
        }

        .brand-tag-name {
          background: #18191E;
          color: #FFFFFF;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 700;
        }

        .deal-package-bar {
          background: #FAF8F5;
          border: 1px solid #ECE7DE;
          padding: 8px 12px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.78rem;
        }

        .package-title {
          color: #18191E;
          font-weight: 600;
        }

        .package-escrow-badge {
          color: #166534;
          font-weight: 800;
          font-size: 0.75rem;
        }

        .deal-milestone-track {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .milestone-status-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.74rem;
          color: #64748B;
        }

        .milestone-status-line strong {
          color: #18191E;
        }

        .milestone-percent {
          color: #FF5B38;
          font-weight: 700;
        }

        .milestone-progress-bar {
          width: 100%;
          height: 6px;
          background: #E2E8F0;
          border-radius: 9999px;
          overflow: hidden;
        }

        .milestone-fill-glow {
          height: 100%;
          background: linear-gradient(90deg, #FF5B38, #54c463);
          border-radius: 9999px;
        }

        /* 4-Step Stepper */
        .pipeline-stepper-box {
          background: #FFFFFF;
          border: 1.5px solid #ECE7DE;
          border-radius: 16px;
          padding: 16px;
        }

        .stepper-title {
          font-size: 0.78rem;
          font-weight: 700;
          color: #18191E;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
        }

        .stepper-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .stepper-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 4px;
        }

        .step-icon-bubble {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #FAF8F5;
          border: 1px solid #ECE7DE;
          color: #18191E;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-num {
          font-size: 0.72rem;
          font-weight: 700;
          color: #18191E;
        }

        .step-desc {
          font-size: 0.65rem;
          color: #64748B;
          line-height: 1.2;
        }

        /* Fast Demo Section */
        .auth-fast-demo-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: auto;
        }

        .fast-demo-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.74rem;
          font-weight: 700;
          color: #18191E;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .fast-demo-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .btn-fast-demo {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 14px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-fast-demo:hover {
          background: #FAF8F5;
          border-color: #FF5B38;
          transform: translateY(-1px);
        }

        .mini-demo-img {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid #FF5B38;
        }

        .mini-demo-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: #18191E;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.05rem;
        }

        .fast-demo-content {
          flex: 1;
        }

        .fast-demo-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .fast-demo-title strong {
          font-size: 0.85rem;
          color: #18191E;
        }

        .badge-role-pill {
          font-size: 0.64rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .creator-pill {
          background: rgba(255, 91, 56, 0.12);
          color: #FF5B38;
        }

        .brand-pill {
          background: rgba(81, 132, 245, 0.12);
          color: #2563EB;
        }

        .fast-demo-sub {
          font-size: 0.72rem;
          color: #64748B;
        }

        .fast-arrow {
          color: #64748B;
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .btn-fast-demo:hover .fast-arrow {
          color: #FF5B38;
          transform: translateX(3px);
        }

        /* ========================================================= */
        /* RIGHT PANEL: CLEAN HIGH-CONTRAST CONSOLE                  */
        /* ========================================================= */
        .auth-console-panel {
          background: #FFFFFF;
          padding: 38px 44px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          overflow-y: auto;
        }

        .dashing-tab-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #F1F5F9;
          padding: 4px;
          border-radius: 12px;
          border: 1px solid #E2E8F0;
        }

        .dashing-tab-btn {
          background: transparent;
          border: none;
          padding: 10px;
          border-radius: 9px;
          font-size: 0.88rem;
          font-weight: 700;
          color: #64748B;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dashing-tab-btn.active {
          background: #18191E;
          color: #FFFFFF;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .console-title-row h3 {
          font-size: 1.55rem;
          font-weight: 800;
          color: #18191E;
          letter-spacing: -0.025em;
          margin: 0 0 4px 0;
        }

        .console-title-row p {
          font-size: 0.86rem;
          color: #64748B;
          margin: 0;
        }

        /* Dashing Role Cards */
        .dashing-role-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .dashing-role-card {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 14px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          text-align: left;
          position: relative;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dashing-role-card:hover {
          border-color: #CBD5E1;
          transform: translateY(-1px);
        }

        .dashing-role-card.selected {
          border-color: #FF5B38;
          background: #FFF9F7;
          box-shadow: 0 4px 14px rgba(255, 91, 56, 0.12);
        }

        .role-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          color: #18191E;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dashing-role-card.selected .role-icon-box {
          background: #FF5B38;
          color: #FFFFFF;
          border-color: #FF5B38;
        }

        .role-card-text {
          flex: 1;
        }

        .role-card-text strong {
          display: block;
          font-size: 0.85rem;
          color: #18191E;
          font-weight: 700;
        }

        .role-card-text span {
          display: block;
          font-size: 0.72rem;
          color: #64748B;
        }

        .role-active-check {
          position: absolute;
          top: 8px;
          right: 10px;
          font-size: 0.75rem;
          font-weight: 800;
          color: #FF5B38;
        }

        /* Social Auth Button */
        .social-quick-login-row {
          width: 100%;
        }

        .btn-social-auth {
          width: 100%;
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 0.86rem;
          font-weight: 700;
          color: #18191E;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .btn-social-auth:hover {
          border-color: #18191E;
          background: #FAF8F5;
          transform: translateY(-1px);
        }

        .dashing-divider {
          position: relative;
          text-align: center;
          margin: 2px 0;
        }

        .dashing-divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #E2E8F0;
        }

        .dashing-divider span {
          position: relative;
          background: #FFFFFF;
          padding: 0 12px;
          font-size: 0.74rem;
          color: #94A3B8;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .auth-error-chip {
          background: #FEF2F2;
          border: 1px solid #FCA5A5;
          color: #991B1B;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .dashing-auth-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .form-two-cols {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .form-input-block {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .form-input-block label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #18191E;
        }

        .input-shell {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .input-ico {
          position: absolute;
          left: 13px;
          color: #94A3B8;
          pointer-events: none;
        }

        .input-at {
          position: absolute;
          left: 14px;
          color: #64748B;
          font-weight: 800;
          pointer-events: none;
        }

        .input-shell input {
          width: 100%;
          padding: 11px 14px 11px 40px;
          background: #FFFFFF;
          border: 1.5px solid #CBD5E1;
          border-radius: 11px;
          font-size: 0.9rem;
          color: #18191E;
          outline: none;
          font-family: inherit;
          transition: all 0.2s ease;
        }

        .input-shell input:focus {
          border-color: #FF5B38;
          box-shadow: 0 0 0 3px rgba(255, 91, 56, 0.15);
        }

        .btn-toggle-eye {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 4px;
        }

        .btn-toggle-eye:hover {
          color: #18191E;
        }

        .dashing-select {
          width: 100%;
          padding: 11px 14px;
          background: #FFFFFF;
          border: 1.5px solid #CBD5E1;
          border-radius: 11px;
          font-size: 0.88rem;
          color: #18191E;
          outline: none;
          font-family: inherit;
        }

        .dashing-select:focus {
          border-color: #FF5B38;
        }

        .form-options-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
          padding: 2px 0;
        }

        .dashing-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #475569;
          font-weight: 500;
          cursor: pointer;
          user-select: none;
        }

        .dashing-checkbox input {
          accent-color: #FF5B38;
          width: 15px;
          height: 15px;
        }

        .btn-forgot-link {
          background: none;
          border: none;
          color: #FF5B38;
          font-weight: 700;
          font-size: 0.8rem;
          cursor: pointer;
        }

        .btn-forgot-link:hover {
          text-decoration: underline;
        }

        /* Submit Button */
        .btn-dashing-submit {
          background: #18191E;
          color: #FFFFFF;
          border: none;
          padding: 13px 22px;
          border-radius: 12px;
          font-size: 0.94rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
          margin-top: 4px;
        }

        .btn-dashing-submit:hover {
          background: #FF5B38;
          transform: translateY(-1px);
          box-shadow: 0 8px 22px rgba(255, 91, 56, 0.38);
        }

        .btn-dashing-submit:active {
          transform: translateY(0);
        }

        .submit-arrow {
          transition: transform 0.2s ease;
        }

        .btn-dashing-submit:hover .submit-arrow {
          transform: translateX(4px);
        }

        /* Console Footer */
        .console-trust-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.72rem;
          font-weight: 600;
          color: #64748B;
          padding-top: 6px;
          border-top: 1px solid #F1F5F9;
        }

        @media (max-width: 900px) {
          .auth-dashing-grid {
            grid-template-columns: 1fr;
          }
          .auth-showcase-panel {
            display: none;
          }
          .auth-console-panel {
            padding: 30px 24px;
          }
        }
      `}</style>
    </div>
  );
};
