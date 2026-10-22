import React, { useState, useEffect } from 'react';
import type { AuthUser, UserRole } from '../types/creator';
import { CreatorlyLogo } from './CreatorlyLogo';
import { signInWithSupabase, signUpWithSupabase } from '../lib/supabaseClient';
import {
  Mail,
  Lock,
  User,
  Building2,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';

interface AuthPageProps {
  initialTab?: 'signin' | 'signup';
  initialRole?: UserRole;
  targetDestination?: 'workspace' | 'discover' | 'pipeline' | 'storefront';
  onLoginSuccess: (user: AuthUser, destination?: 'workspace' | 'discover' | 'pipeline' | 'storefront') => void;
  onBack: () => void;
  onShowToast: (msg: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialTab = 'signin',
  initialRole = 'creator',
  targetDestination,
  onLoginSuccess,
  onBack,
  onShowToast
}) => {
  const [tab, setTab] = useState<'signin' | 'signup'>(initialTab);
  const [role, setRole] = useState<UserRole>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialRole) setRole(initialRole);
  }, [initialRole]);

  useEffect(() => {
    if (initialTab) setTab(initialTab);
  }, [initialTab]);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [handle, setHandle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [niche, setNiche] = useState('Tech & AI');
  const [campaignGoal, setCampaignGoal] = useState('Product Launch');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fast 1-Click Demo Testing
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
    onShowToast('Logged in as Creator: Alex Sharma');
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
    onShowToast('Logged in as User / Brand: Razorpay Growth Team');
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

    const destination = targetDestination || ((role === 'creator') ? 'workspace' : 'discover');
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

        const { user: newUser, error } = await signUpWithSupabase(email, password, {
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

        onLoginSuccess(newUser, destination);
        onShowToast(`Account created! Welcome to Creatorly, ${newUser.name}.`);
      } else {
        const { user: signedInUser, error } = await signInWithSupabase(email, password, role);

        if (error || !signedInUser) {
          setErrorMessage(error || 'Invalid email or password.');
          setIsSubmitting(false);
          return;
        }

        onLoginSuccess(signedInUser, destination);
        onShowToast(`Signed in successfully as ${signedInUser.name}!`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-fullpage-container">
      {/* ========================================================= */}
      {/* TOP HEADER BAR                                            */}
      {/* ========================================================= */}
      <header className="auth-fullpage-navbar">
        <div className="auth-navbar-inner">
          <div className="auth-logo-cluster" onClick={onBack} role="button" tabIndex={0}>
            <CreatorlyLogo width={28} height={22} />
            <span className="auth-brand-wordmark">creatorly<span className="dot-coral">.</span></span>
          </div>

          <button
            type="button"
            className="auth-btn-back"
            onClick={onBack}
          >
            <ArrowLeft size={16} />
            <span>Back to storefront</span>
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* CENTERED NORMAL & CLEAR AUTH CARD                         */}
      {/* ========================================================= */}
      <main className="auth-fullpage-content">
        <div className="auth-card-wrapper">
          <div className="auth-card">
            {/* Logo & Header */}
            <div className="auth-card-header">
              <div className="auth-card-logo">
                <CreatorlyLogo width={36} height={28} />
              </div>
              <h1 className="auth-card-title">
                {tab === 'signin' ? 'Sign in to Creatorly' : 'Create your account'}
              </h1>
              <p className="auth-card-subtitle">
                {tab === 'signin'
                  ? 'Access your creator storefront, deals, and escrow pipeline.'
                  : 'Join 500+ verified creators and brands running direct partnerships.'}
              </p>
            </div>

            {/* Tab Switcher: Sign In vs Create Account */}
            <div className="auth-segmented-tabs">
              <button
                type="button"
                className={`tab-switch-btn ${tab === 'signin' ? 'active' : ''}`}
                onClick={() => { setTab('signin'); setErrorMessage(null); }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`tab-switch-btn ${tab === 'signup' ? 'active' : ''}`}
                onClick={() => { setTab('signup'); setErrorMessage(null); }}
              >
                Create Account
              </button>
            </div>

            {/* Role Switcher: Creator vs User (Brand) */}
            <div className="auth-role-tabs">
              <button
                type="button"
                className={`role-tab-btn ${role === 'creator' ? 'active' : ''}`}
                onClick={() => setRole('creator')}
              >
                <User size={16} />
                <span>Creator</span>
              </button>
              <button
                type="button"
                className={`role-tab-btn ${role === 'brand' ? 'active' : ''}`}
                onClick={() => setRole('brand')}
              >
                <Building2 size={16} />
                <span>User (Brand)</span>
              </button>
            </div>

            {/* Google 1-Click Fast Login */}
            <button
              type="button"
              className="btn-google-auth"
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

            <div className="auth-divider-line">
              <span>or continue with email</span>
            </div>

            {/* Error Notice */}
            {errorMessage && (
              <div className="auth-error-box">
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Normal, Clear Form */}
            <form onSubmit={handleSubmit} className="auth-form">
              {tab === 'signup' && role === 'creator' && (
                <>
                  <div className="form-fields-row">
                    <div className="field-block">
                      <label>Full Creator Name</label>
                      <div className="field-input-wrap">
                        <User size={16} className="field-icon" />
                        <input
                          type="text"
                          placeholder="e.g. Alex Sharma"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="field-block">
                      <label>Social Handle</label>
                      <div className="field-input-wrap">
                        <span className="field-at-sign">@</span>
                        <input
                          type="text"
                          placeholder="yourhandle"
                          value={handle}
                          onChange={(e) => setHandle(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="field-block">
                    <label>Primary Content Category</label>
                    <select
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      className="field-select-dropdown"
                    >
                      <option value="Tech & AI">Tech & Artificial Intelligence</option>
                      <option value="Developer Tools">Developer Tools & Programming</option>
                      <option value="Productivity">Productivity & Business Tools</option>
                      <option value="Consumer Tech">Consumer Hardware & Reviews</option>
                      <option value="Startups">Startups & Venture</option>
                    </select>
                  </div>
                </>
              )}

              {tab === 'signup' && role === 'brand' && (
                <div className="form-fields-row">
                  <div className="field-block">
                    <label>Company / Brand Name</label>
                    <div className="field-input-wrap">
                      <Building2 size={16} className="field-icon" />
                      <input
                        type="text"
                        placeholder="e.g. Acme Tech"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="field-block">
                    <label>Campaign Objective</label>
                    <select
                      value={campaignGoal}
                      onChange={(e) => setCampaignGoal(e.target.value)}
                      className="field-select-dropdown"
                    >
                      <option value="Product Launch">New Product Launch</option>
                      <option value="Developer Reach">Developer & Tech Awareness</option>
                      <option value="Conversions">Performance & Sales</option>
                      <option value="Ambassadorship">Long-Term Partnerships</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div className="field-block">
                <label>{role === 'brand' ? 'Work Email Address' : 'Email Address'}</label>
                <div className="field-input-wrap">
                  <Mail size={16} className="field-icon" />
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
              <div className="field-block">
                <label>Password</label>
                <div className="field-input-wrap">
                  <Lock size={16} className="field-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn-eye-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="form-sub-options">
                <label className="checkbox-wrap">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me for 30 days</span>
                </label>
                {tab === 'signin' && (
                  <button
                    type="button"
                    className="btn-forgot-password-link"
                    onClick={() => onShowToast('Password reset link sent to your email.')}
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn-main-auth-submit" disabled={isSubmitting}>
                <span>
                  {isSubmitting
                    ? (tab === 'signin' ? 'Authenticating...' : 'Creating Account...')
                    : (tab === 'signin'
                      ? (role === 'creator' ? 'Sign In as Creator' : 'Sign In as User / Brand')
                      : (role === 'creator' ? 'Create Creator Account' : 'Register User / Brand Account'))}
                </span>
                <ArrowRight size={17} />
              </button>
            </form>

            {/* Bottom Switcher */}
            <div className="form-bottom-switch">
              {tab === 'signin' ? (
                <span>
                  Don't have an account yet?{' '}
                  <button type="button" onClick={() => setTab('signup')}>
                    Sign up
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button type="button" onClick={() => setTab('signin')}>
                    Sign in
                  </button>
                </span>
              )}
            </div>

            {/* Quick Demo Testing Links */}
            <div className="auth-quick-demo-footer">
              <span className="quick-demo-label">Quick 1-click test:</span>
              <button type="button" className="btn-quick-pill" onClick={handleQuickDemoCreator}>
                Alex Sharma (Creator)
              </button>
              <span className="dot-divider">•</span>
              <button type="button" className="btn-quick-pill" onClick={handleQuickDemoBrand}>
                Razorpay (User / Brand)
              </button>
            </div>
          </div>

          {/* Secure Guarantee */}
          <div className="auth-footer-security">
            <span>🛡️ Protected by 256-bit Milestone Escrow & Creatorly Guarantee</span>
          </div>
        </div>
      </main>

      {/* ========================================================= */}
      {/* CLEAN, LIGHT THEME STYLES                                  */}
      {/* ========================================================= */}
      <style>{`
        .auth-fullpage-container {
          min-height: 100vh;
          width: 100%;
          background-color: #FAF8F5;
          color: #18191E;
          font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          display: flex;
          flex-direction: column;
        }

        /* Top Navbar */
        .auth-fullpage-navbar {
          background: #FAF8F5;
          border-bottom: 1px solid #ECE7DE;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .auth-navbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .auth-logo-cluster {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .auth-brand-wordmark {
          font-size: 1.35rem;
          font-weight: 800;
          color: #18191E;
          letter-spacing: -0.03em;
        }

        .dot-coral {
          color: #FF5B38;
        }

        .auth-btn-back {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          color: #18191E;
          padding: 8px 18px;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .auth-btn-back:hover {
          background: #18191E;
          color: #FFFFFF;
          border-color: #18191E;
          transform: translateX(-2px);
        }

        /* Centered Content Layout */
        .auth-fullpage-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px 60px;
        }

        .auth-card-wrapper {
          width: 100%;
          max-width: 490px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .auth-card {
          width: 100%;
          background: #FFFFFF;
          border: 1.5px solid #ECE7DE;
          border-radius: 24px;
          padding: 36px 36px 28px;
          box-shadow: 0 16px 45px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .auth-card-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .auth-card-logo {
          margin-bottom: 2px;
        }

        .auth-card-title {
          font-size: 1.6rem;
          font-weight: 900;
          color: #18191E;
          letter-spacing: -0.03em;
          margin: 0;
        }

        .auth-card-subtitle {
          font-size: 0.86rem;
          color: #64748B;
          margin: 0;
          line-height: 1.45;
        }

        /* Segmented Tabs (Sign In / Create Account) */
        .auth-segmented-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #FAF8F5;
          padding: 4px;
          border-radius: 12px;
          border: 1.5px solid #ECE7DE;
        }

        .tab-switch-btn {
          background: transparent;
          border: none;
          padding: 9px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 800;
          color: #64748B;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab-switch-btn.active {
          background: #18191E;
          color: #FFFFFF;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        /* Role Switcher */
        .auth-role-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .role-tab-btn {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.84rem;
          font-weight: 700;
          color: #64748B;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .role-tab-btn:hover {
          border-color: #CBD5E1;
          color: #18191E;
        }

        .role-tab-btn.active {
          border-color: #FF5B38;
          background: #FFF9F7;
          color: #FF5B38;
        }

        /* Google 1-Click */
        .btn-google-auth {
          width: 100%;
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          padding: 11px 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 0.88rem;
          font-weight: 700;
          color: #18191E;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
        }

        .btn-google-auth:hover {
          background: #FAF8F5;
          border-color: #CBD5E1;
        }

        /* Divider */
        .auth-divider-line {
          position: relative;
          text-align: center;
          margin: 2px 0;
        }

        .auth-divider-line::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #E2E8F0;
        }

        .auth-divider-line span {
          position: relative;
          background: #FFFFFF;
          padding: 0 12px;
          font-size: 0.72rem;
          font-weight: 700;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Error Box */
        .auth-error-box {
          background: #FEF2F2;
          border: 1px solid #FCA5A5;
          color: #991B1B;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 600;
        }

        /* Form */
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-fields-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .field-block {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .field-block label {
          font-size: 0.8rem;
          font-weight: 800;
          color: #18191E;
        }

        .field-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .field-icon {
          position: absolute;
          left: 14px;
          color: #94A3B8;
          pointer-events: none;
        }

        .field-at-sign {
          position: absolute;
          left: 15px;
          color: #64748B;
          font-weight: 800;
          pointer-events: none;
        }

        .field-input-wrap input {
          width: 100%;
          padding: 11px 14px 11px 40px;
          background: #FFFFFF;
          border: 1.5px solid #CBD5E1;
          border-radius: 10px;
          font-size: 0.9rem;
          color: #18191E;
          outline: none;
          font-family: inherit;
          transition: all 0.2s ease;
        }

        .field-input-wrap input:focus {
          border-color: #FF5B38;
          box-shadow: 0 0 0 3px rgba(255, 91, 56, 0.12);
        }

        .btn-eye-toggle {
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

        .btn-eye-toggle:hover {
          color: #18191E;
        }

        .field-select-dropdown {
          width: 100%;
          padding: 11px 14px;
          background: #FFFFFF;
          border: 1.5px solid #CBD5E1;
          border-radius: 10px;
          font-size: 0.88rem;
          color: #18191E;
          outline: none;
          font-family: inherit;
        }

        .field-select-dropdown:focus {
          border-color: #FF5B38;
        }

        .form-sub-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
          padding: 2px 0;
        }

        .checkbox-wrap {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #475569;
          font-weight: 500;
          cursor: pointer;
          user-select: none;
        }

        .checkbox-wrap input {
          accent-color: #FF5B38;
          width: 15px;
          height: 15px;
        }

        .btn-forgot-password-link {
          background: none;
          border: none;
          color: #FF5B38;
          font-weight: 700;
          font-size: 0.8rem;
          cursor: pointer;
        }

        .btn-forgot-password-link:hover {
          text-decoration: underline;
        }

        /* Submit Button */
        .btn-main-auth-submit {
          background: #18191E;
          color: #FFFFFF;
          border: none;
          padding: 13px 20px;
          border-radius: 12px;
          font-size: 0.94rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
          margin-top: 4px;
        }

        .btn-main-auth-submit:hover {
          background: #FF5B38;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(255, 91, 56, 0.3);
        }

        /* Switch */
        .form-bottom-switch {
          text-align: center;
          font-size: 0.84rem;
          color: #64748B;
          padding-top: 4px;
        }

        .form-bottom-switch button {
          background: none;
          border: none;
          color: #FF5B38;
          font-weight: 800;
          cursor: pointer;
        }

        .form-bottom-switch button:hover {
          text-decoration: underline;
        }

        /* Quick Demo Testing Links */
        .auth-quick-demo-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding-top: 12px;
          border-top: 1px solid #F1F5F9;
          font-size: 0.76rem;
          color: #64748B;
          flex-wrap: wrap;
        }

        .quick-demo-label {
          font-weight: 600;
        }

        .btn-quick-pill {
          background: #FAF8F5;
          border: 1px solid #ECE7DE;
          color: #18191E;
          font-weight: 700;
          font-size: 0.74rem;
          padding: 3px 9px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-quick-pill:hover {
          background: #18191E;
          color: #FFFFFF;
          border-color: #18191E;
        }

        .dot-divider {
          color: #CBD5E1;
        }

        /* Security caption below card */
        .auth-footer-security {
          font-size: 0.76rem;
          color: #64748B;
          font-weight: 600;
          text-align: center;
        }

        @media (max-width: 540px) {
          .auth-card {
            padding: 24px 20px 20px;
            border-radius: 18px;
          }
          .form-fields-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
