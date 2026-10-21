import React, { useState, useMemo, useRef } from 'react';
import type { CreatorProfile, CurrencyCode, ServicePackage } from '../types/creator';
import { formatCurrency } from '../data/currencies';
import { 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Clock, 
  Flame, 
  CheckCircle2, 
  Zap, 
  Lock, 
  UserCheck,
  Send,
  Eye
} from 'lucide-react';

import { VerificationBadge } from './VerificationBadge';
import DemoOne from '@/components/ui/3d-testimonials-demo';

interface DiscoverDirectoryProps {
  creators: CreatorProfile[];
  currentCurrency: CurrencyCode;
  onSelectCreator: (creator: CreatorProfile) => void;
  onInitiateBooking: (creator: CreatorProfile, packageItem?: ServicePackage) => void;
  onToggleCompare: (creator: CreatorProfile) => void;
  isCreatorInCompare: (creatorId: string) => boolean;
  onShowToast: (msg: string) => void;
  onNavigateToSmartMatch?: () => void;
  onNavigateToKineticHero?: () => void;
  onOpenOnboarding?: () => void;
  onNavigateToPipeline?: () => void;
}

const CATEGORIES = [
  { label: 'All Creators', key: 'All Niches', icon: '🌟' },
  { label: 'Education & Learning', key: 'Education', icon: '🎓' },
  { label: 'Lifestyle & Vlogs', key: 'Lifestyle', icon: '🌿' },
  { label: 'Finance & Economics', key: 'Finance', icon: '📈' },
  { label: 'Technology & AI', key: 'Tech', icon: '💻' },
  { label: 'Documentary & Stories', key: 'Documentary', icon: '🎬' },
  { label: 'Reels & Viral Shorts', key: 'Reels', icon: '⚡' },
  { label: 'Fitness & Sports', key: 'Fitness', icon: '🏋️' },
  { label: 'Food & Dining', key: 'Food', icon: '🍕' },
  { label: 'Fashion & Styling', key: 'Fashion', icon: '👗' }
];

export const DiscoverDirectory: React.FC<DiscoverDirectoryProps> = ({
  creators,
  currentCurrency,
  onSelectCreator,
  onInitiateBooking,
  onShowToast,
  onNavigateToSmartMatch,
  onNavigateToKineticHero,
  onOpenOnboarding,
  onNavigateToPipeline
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All Niches');
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const trendingRailRef = useRef<HTMLDivElement>(null);

  // Active hero featured creator
  const featuredCreator = creators[featuredIndex % creators.length] || creators[0];

  const handleNextFeatured = () => {
    setFeaturedIndex((prev) => (prev + 1) % creators.length);
  };

  const handlePrevFeatured = () => {
    setFeaturedIndex((prev) => (prev - 1 + creators.length) % creators.length);
  };

  const scrollTrending = (direction: 'left' | 'right') => {
    if (trendingRailRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      trendingRailRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Filter creators for the trending showcase
  const displayedCreators = useMemo(() => {
    if (selectedCategory === 'All Niches') return creators;
    const key = selectedCategory.toLowerCase();
    const filtered = creators.filter(c => {
      const niche = (c.primaryNiche || '').toLowerCase();
      const subs = (c.subNiches || []).map(s => s.toLowerCase()).join(' ');
      const bio = (c.bio || '').toLowerCase();
      if (key === 'lifestyle') {
        return niche.includes('lifestyle') || niche.includes('tech & life') || niche.includes('style') || subs.includes('routine') || subs.includes('vlog');
      }
      return niche.includes(key) || subs.includes(key) || bio.includes(key);
    });
    return filtered.length > 0 ? filtered : creators;
  }, [creators, selectedCategory]);

  return (
    <section className="directory-section" id="discover">
      <div className="directory-container">
        
        {/* ========================================================= */}
        {/* SECTION 1: EDITORIAL HERO — WHO WE ARE & DUAL ROLE ENTRY  */}
        {/* ========================================================= */}
        <div className="hero-editorial">
          <div className="hero-pill-tag">
            <span className="pill-dot"></span>
            <span>Direct Creator Marketplace • Zero Agency Markup</span>
          </div>

          <h1 className="hero-heading">
            Where modern brands hire <span className="font-serif italic text-accent">authentic creators</span>.
          </h1>

          <p className="hero-subheading">
            Skip the endless email chains, opaque pricing, and ghosting. Connect directly with vetted YouTubers, Instagrammers, and storytelling creators with milestone-protected escrow.
          </p>

          {/* DUAL ROLE ENTRY BUTTONS */}
          <div className="hero-role-cta-group">
            <a href="#trending-creators" className="btn-role-primary">
              <Users size={17} />
              <span>I'm a Brand — Explore Creators</span>
              <ArrowRight size={16} />
            </a>

            <button 
              type="button" 
              className="btn-role-secondary"
              onClick={onOpenOnboarding}
            >
              <UserCheck size={17} />
              <span>I'm a Creator — Join Roster</span>
            </button>

            {onNavigateToSmartMatch && (
              <button 
                type="button" 
                className="btn-role-ghost"
                onClick={onNavigateToSmartMatch}
              >
                <Sparkles size={15} />
                <span>SmartMatch AI</span>
              </button>
            )}

            {onNavigateToKineticHero && (
              <button 
                type="button" 
                className="btn-role-ghost"
                onClick={onNavigateToKineticHero}
                title="Experience interactive liquid sculpture showcase"
              >
                <Zap size={15} />
                <span>Kinetic Hero ✨</span>
              </button>
            )}
          </div>

          {/* Social Proof Trust Bar */}
          <div className="hero-social-proof">
            <div className="avatar-stack">
              {creators.slice(0, 4).map((c, i) => (
                <img 
                  key={c.id} 
                  src={c.avatarUrl} 
                  alt={c.fullName} 
                  className="stack-avatar" 
                  style={{ zIndex: 10 - i }}
                />
              ))}
            </div>
            <div className="proof-text-block">
              <div className="proof-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="star-filled" fill="#E05A47" color="#E05A47" />
                ))}
                <span className="proof-rating">4.9 / 5</span>
              </div>
              <span className="proof-caption">Over ₹2.4 Cr+ disbursed • 1,200+ direct deals • Zero escrow disputes</span>
            </div>
          </div>

          {/* 4 Core Value Pillars Strip */}
          <div className="hero-pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <ShieldCheck size={20} />
              </div>
              <div className="pillar-text">
                <strong>100% Escrow Protection</strong>
                <span>Funds released only upon your final approval of deliverables</span>
              </div>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box">
                <Sparkles size={20} />
              </div>
              <div className="pillar-text">
                <strong>Zero Agency Markup</strong>
                <span>Direct pricing with zero commissions or hidden intermediary retainers</span>
              </div>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box">
                <Eye size={20} />
              </div>
              <div className="pillar-text">
                <strong>Audited API Metrics</strong>
                <span>Real audience data verified directly through YouTube & Meta APIs</span>
              </div>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box">
                <Clock size={20} />
              </div>
              <div className="pillar-text">
                <strong>&lt; 2 Hr Creator Response</strong>
                <span>Fast turnarounds & direct in-app collaboration messaging</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: ALTERNATING LEFT & RIGHT STORYTELLING CARDS    */}
        {/* ========================================================= */}
        <div className="alternating-showcase-section">
          <div className="section-center-heading">
            <span className="section-eyebrow-tag">BUILT FOR HUMANS</span>
            <h2 className="section-main-heading">The Transparent Way to Run Creator Partnerships</h2>
            <p className="section-sub-heading">Explore how direct hiring and milestone escrow protect both brands and creators.</p>
          </div>

          {/* Zig-zag Row 1: For Brands */}
          <div className="zigzag-row">
            <div className="zigzag-text-col">
              <span className="zigzag-step-tag">FOR BRANDS • DIRECT DISCOVERY</span>
              <h3 className="zigzag-title">Find & Hire Verified Influencers with Zero Middlemen</h3>
              <p className="zigzag-desc">
                Skip lengthy agency negotiations and 35% markups. Browse active storefronts, inspect audited audience demographics, compare clear packages, and hire verified creators in minutes.
              </p>

              <div className="zigzag-features-list">
                <div className="zigzag-feature-item">
                  <CheckCircle2 size={18} className="feat-check" />
                  <span>Fixed-rate packages for Reels, Dedicated YouTube Videos, & Stories</span>
                </div>
                <div className="zigzag-feature-item">
                  <CheckCircle2 size={18} className="feat-check" />
                  <span>Audited API analytics (views, engagement rate, and audience city distribution)</span>
                </div>
                <div className="zigzag-feature-item">
                  <CheckCircle2 size={18} className="feat-check" />
                  <span>Direct creator chat, file sharing, and 1-on-1 collaboration tools</span>
                </div>
              </div>

              <a href="#trending-creators" className="btn-zigzag-cta">
                <span>Explore Verified Creators</span>
                <ArrowRight size={15} />
              </a>
            </div>

            <div className="zigzag-visual-col">
              <div className="hero-showcase-wrapper">
                <div className="hero-card-card">
                  <div className="floating-badge badge-escrow">
                    <ShieldCheck size={14} />
                    <span>100% Escrow Protected</span>
                  </div>

                  <div className="floating-badge badge-speed">
                    <Clock size={13} />
                    <span>Avg reply: &lt; 2 hrs</span>
                  </div>

                  {/* Card Header */}
                  <div className="hero-card-header">
                    <div className="hero-card-user">
                      <div className="hero-avatar-box">
                        <img 
                          src={featuredCreator.avatarUrl} 
                          alt={featuredCreator.fullName} 
                          className="hero-avatar-img"
                        />
                        <span className="hero-live-indicator" title="Available for bookings"></span>
                      </div>
                      <div>
                        <div className="hero-card-name-row">
                          <h4 className="hero-card-name">{featuredCreator.fullName}</h4>
                          {featuredCreator.verifiedBadge && <VerificationBadge size="sm" />}
                        </div>
                        <span className="hero-card-handle">{featuredCreator.handle}</span>
                        <span className="hero-niche-pill">{featuredCreator.primaryNiche}</span>
                      </div>
                    </div>

                    <div className="hero-card-switcher">
                      <button 
                        type="button" 
                        onClick={handlePrevFeatured} 
                        className="btn-switch" 
                        aria-label="Previous creator"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button 
                        type="button" 
                        onClick={handleNextFeatured} 
                        className="btn-switch" 
                        aria-label="Next creator"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="hero-card-bio">
                    "{featuredCreator.bio}"
                  </p>

                  <div className="hero-metrics-grid">
                    <div className="hero-metric-pill">
                      <div className="hmetric-icon-wrap">
                        <Users size={12} />
                      </div>
                      <div>
                        <strong className="hmetric-num">{featuredCreator.metrics.totalAudience.toLocaleString()}</strong>
                        <span className="hmetric-label">Audience</span>
                      </div>
                    </div>

                    <div className="hero-metric-pill">
                      <div className="hmetric-icon-wrap">
                        <Eye size={12} />
                      </div>
                      <div>
                        <strong className="hmetric-num">{featuredCreator.metrics.averageViews.toLocaleString()}</strong>
                        <span className="hmetric-label">Avg Views</span>
                      </div>
                    </div>

                    <div className="hero-metric-pill">
                      <div className="hmetric-icon-wrap">
                        <Star size={12} fill="#E05A47" color="#E05A47" />
                      </div>
                      <div>
                        <strong className="hmetric-num">{featuredCreator.metrics.engagementRate}%</strong>
                        <span className="hmetric-label">Engagement</span>
                      </div>
                    </div>
                  </div>

                  <div className="hero-card-footer">
                    <div className="hero-card-price">
                      <span className="hprice-sub">Starting Package</span>
                      <strong className="hprice-num">
                        {formatCurrency(Math.min(...featuredCreator.packages.map(p => p.priceInINR)), currentCurrency)}
                      </strong>
                    </div>

                    <button 
                      type="button" 
                      className="btn-hero-book"
                      onClick={() => onInitiateBooking(featuredCreator, featuredCreator.packages[0])}
                    >
                      <Send size={14} />
                      <span>Book Creator</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Zig-zag Row 2: For Creators */}
          <div className="zigzag-row zigzag-reverse">
            <div className="zigzag-visual-col">
              <div className="vault-showcase-card">
                <div className="vault-card-header">
                  <div className="vault-icon-circle">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="vault-card-title">Creator Escrow Vault</h4>
                    <span className="vault-card-subtitle">Bank-grade milestone disbursements</span>
                  </div>
                </div>

                <div className="vault-stages-list">
                  <div className="vault-stage-item completed">
                    <div className="vstage-icon">
                      <Check size={14} />
                    </div>
                    <div className="vstage-text">
                      <div className="vstage-row">
                        <strong>Brief & Script Sign-off</strong>
                        <span className="vstage-pct">30% Reserved</span>
                      </div>
                      <span className="vstage-sub">Funds locked safely before creator starts shooting</span>
                    </div>
                  </div>

                  <div className="vault-stage-item current">
                    <div className="vstage-icon">
                      <Clock size={14} />
                    </div>
                    <div className="vstage-text">
                      <div className="vstage-row">
                        <strong>Draft Review & Revisions</strong>
                        <span className="vstage-pct">40% Unlocked</span>
                      </div>
                      <span className="vstage-sub">Review watermarked video draft with structured edits</span>
                    </div>
                  </div>

                  <div className="vault-stage-item pending">
                    <div className="vstage-icon">
                      <Lock size={14} />
                    </div>
                    <div className="vstage-text">
                      <div className="vstage-row">
                        <strong>Live Post & URL Verification</strong>
                        <span className="vstage-pct">30% Final Payout</span>
                      </div>
                      <span className="vstage-sub">Instant direct deposit upon verified post publication</span>
                    </div>
                  </div>
                </div>

                <div className="vault-guarantee-footer">
                  <CheckCircle2 size={16} className="text-accent" />
                  <span>100% Guaranteed payment for approved deliverables</span>
                </div>
              </div>
            </div>

            <div className="zigzag-text-col">
              <span className="zigzag-step-tag">FOR CREATORS • ZERO-RISK EARNINGS</span>
              <h3 className="zigzag-title">Never Chase Invoices or Deal with Ghosting Brands</h3>
              <p className="zigzag-desc">
                Stop doing unpaid spec work or waiting 90 days for net-terms payouts. Brands deposit 100% of the campaign budget into escrow upfront, ensuring you are compensated promptly for your creative work.
              </p>

              <div className="zigzag-features-list">
                <div className="zigzag-feature-item">
                  <CheckCircle2 size={18} className="feat-check" />
                  <span>Guaranteed milestone escrow protects every creative hour you invest</span>
                </div>
                <div className="zigzag-feature-item">
                  <CheckCircle2 size={18} className="feat-check" />
                  <span>Standardized commercial contracts & automatic tax-compliant invoicing</span>
                </div>
                <div className="zigzag-feature-item">
                  <CheckCircle2 size={18} className="feat-check" />
                  <span>Clean public storefront to showcase packages without awkward price negotiations</span>
                </div>
              </div>

              <button 
                type="button" 
                className="btn-zigzag-cta"
                onClick={onOpenOnboarding}
              >
                <span>Join Creator Roster</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 3: HOW IT WORKS IN 3 SIMPLE STEPS                */}
        {/* ========================================================= */}
        <div className="how-it-works-section" id="how-it-works">
          <div className="section-center-heading">
            <span className="section-eyebrow-tag">SIMPLE WORKFLOW</span>
            <h2 className="section-main-heading">How Creatorly Works</h2>
            <p className="section-sub-heading">Predictable, transparent, and stress-free partnerships from discovery to publish.</p>
          </div>

          <div className="steps-cards-grid">
            <div className="step-card">
              <div className="step-card-num">01</div>
              <h4 className="step-card-title">Discover & Filter</h4>
              <p className="step-card-desc">
                Filter verified creators by niche, platform, audience size, and package budget. Compare audited engagement rates and previous work side-by-side.
              </p>
              <div className="step-card-pill">Audited Demographics</div>
              <button
                type="button"
                className="mt-4 text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors"
                onClick={() => {
                  const el = document.getElementById('marketplace-heading') || document.querySelector('.directory-container');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  onShowToast('Explore creators below');
                }}
              >
                <span>Browse Creators</span>
                <span>↓</span>
              </button>
            </div>

            <div className="step-card">
              <div className="step-card-num">02</div>
              <h4 className="step-card-title">Book via Escrow</h4>
              <p className="step-card-desc">
                Select standardized packages or submit a custom campaign brief. Funds are held safely in escrow and remain protected until you review and approve deliverables.
              </p>
              <div className="step-card-pill">Zero Upfront Risk</div>
              <button
                type="button"
                className="mt-4 text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors"
                onClick={() => {
                  if (creators && creators.length > 0) {
                    onInitiateBooking(creators[0], creators[0].packages[0]);
                  }
                }}
              >
                <span>Try Booking Demo</span>
                <span>→</span>
              </button>
            </div>

            <div className="step-card">
              <div className="step-card-num">03</div>
              <h4 className="step-card-title">Review & Payout</h4>
              <p className="step-card-desc">
                The creator delivers draft assets. Request edits or approve the content in one click. Once live and verified, escrow automatically disburses payment.
              </p>
              <div className="step-card-pill">Guaranteed Delivery</div>
              <button
                type="button"
                className="mt-4 text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors"
                onClick={() => {
                  if (onNavigateToPipeline) {
                    onNavigateToPipeline();
                  } else {
                    onShowToast('Navigating to Live Deal Pipeline');
                  }
                }}
              >
                <span>View Deal Pipeline</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 4: 3D TESTIMONIALS & TRUST WALL                  */}
        {/* ========================================================= */}
        <div className="testimonials-3d-section my-16 py-12 px-6 sm:px-10 rounded-3xl bg-surface border border-border shadow-xs overflow-hidden" id="testimonials-wall">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-surface-raised text-foreground border border-border mb-3.5">
                <Sparkles size={13} className="text-accent" />
                VERIFIED COMMUNITY OF 1,800+ DEALS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight mb-4">
                Loved by Top Creators & Modern Brands
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed mb-6">
                Hear firsthand from verified creators and marketing teams who rely on Creatorly for transparent deal contracts, zero-ghosting escrow security, and lightning-fast milestone disbursements.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="p-3.5 bg-background rounded-xl border border-border">
                  <div className="text-2xl font-bold text-foreground">99.4%</div>
                  <div className="text-xs text-muted-foreground font-medium mt-0.5">On-Time Deliverables</div>
                </div>
                <div className="p-3.5 bg-background rounded-xl border border-border">
                  <div className="text-2xl font-bold text-foreground">₹2.4 Cr+</div>
                  <div className="text-xs text-muted-foreground font-medium mt-0.5">Milestone Escrows Released</div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck size={16} className="text-accent shrink-0" />
                <span>All reviews cross-verified against completed escrow contracts</span>
              </div>
            </div>

            <div className="lg:col-span-7 flex justify-center w-full">
              <DemoOne />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 5: TRENDING CREATORS HORIZONTAL SCROLL RAIL      */}
        {/* ========================================================= */}
        <div className="trending-rail-section" id="trending-creators">
          <div className="trending-section-header">
            <div className="trending-title-group">
              <span className="trending-badge">
                <Flame size={14} className="flame-icon" />
                Featured This Week
              </span>
              <h2 className="trending-title">Trending Verified Creators</h2>
            </div>

            <div className="rail-navigation-arrows">
              <button 
                type="button" 
                onClick={() => scrollTrending('left')} 
                className="btn-rail-arrow"
                aria-label="Scroll creators left"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                type="button" 
                onClick={() => scrollTrending('right')} 
                className="btn-rail-arrow"
                aria-label="Scroll creators right"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="trending-categories-strip">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                className={`category-pill ${selectedCategory === cat.key ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(cat.key);
                  onShowToast(`Showing ${cat.label}`);
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="trending-scroll-track" ref={trendingRailRef}>
            {displayedCreators.map((c) => {
              const lowestPrice = Math.min(...c.packages.map(p => p.priceInINR));
              return (
                <div key={c.id} className="trending-card">
                  <div className="trending-card-top">
                    <div className="trending-avatar-wrap">
                      <img src={c.avatarUrl} alt={c.fullName} className="trending-avatar-img" />
                      <span className="trending-status-dot"></span>
                    </div>
                    <div className="trending-info">
                      <div className="trending-name-row">
                        <h4 className="trending-name" onClick={() => onSelectCreator(c)}>{c.fullName}</h4>
                        {c.verifiedBadge && <CheckCircle2 size={14} className="verified-check-icon" />}
                      </div>
                      <span className="trending-handle">{c.handle}</span>
                      <span className="trending-niche">{c.primaryNiche}</span>
                    </div>
                  </div>

                  <div className="trending-metrics-strip">
                    <div className="tmetric-item">
                      <span className="tmetric-val">{c.metrics.totalAudience.toLocaleString()}</span>
                      <span className="tmetric-lbl">Audience</span>
                    </div>
                    <div className="tmetric-item">
                      <span className="tmetric-val">{c.metrics.engagementRate}%</span>
                      <span className="tmetric-lbl">Eng.</span>
                    </div>
                    <div className="tmetric-item price-item">
                      <span className="tmetric-val text-accent">{formatCurrency(lowestPrice, currentCurrency)}</span>
                      <span className="tmetric-lbl">From</span>
                    </div>
                  </div>

                  <div className="trending-card-actions">
                    <button 
                      type="button" 
                      className="btn-trending-view"
                      onClick={() => onSelectCreator(c)}
                    >
                      Storefront
                    </button>
                    <button 
                      type="button" 
                      className="btn-trending-hire"
                      onClick={() => onInitiateBooking(c, c.packages[0])}
                    >
                      Book
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 6: THE CREATORLY STANDARD (VALUE PROPS)          */}
        {/* ========================================================= */}
        <div className="features-preview-section">
          <div className="features-header">
            <span className="features-tag">The Creatorly Standard</span>
            <h2 className="features-title">Hiring creators made transparent and safe.</h2>
          </div>

          <div className="features-cards-grid">
            <div className="feature-item-card">
              <div className="feature-icon-box">
                <ShieldCheck size={22} />
              </div>
              <h3 className="feature-item-title">Milestone Escrow Protection</h3>
              <p className="feature-item-desc">
                Your payment is held securely in escrow and only released to the creator after you approve the draft deliverable.
              </p>
            </div>

            <div className="feature-item-card">
              <div className="feature-icon-box">
                <Check size={22} />
              </div>
              <h3 className="feature-item-title">Audited Platform APIs</h3>
              <p className="feature-item-desc">
                Follower counts, average views, and true engagement metrics are verified directly via Meta and YouTube OAuth tokens.
              </p>
            </div>

            <div className="feature-item-card">
              <div className="feature-icon-box">
                <Sparkles size={22} />
              </div>
              <h3 className="feature-item-title">Transparent Fixed Pricing</h3>
              <p className="feature-item-desc">
                Clear packages with defined turnaround times and revision counts. Zero middlemen markups or awkward DM negotiations.
              </p>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .directory-section {
          padding: 24px 0 80px 0;
          background: #FAFAFA;
          position: relative;
        }

        .directory-container {
          width: 100%;
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 clamp(16px, 3vw, 40px);
        }

        .text-accent {
          color: #E05A47 !important;
        }

        /* ========================================================= */
        /* EDITORIAL HERO SECTION                                    */
        /* ========================================================= */
        .hero-editorial {
          text-align: center;
          padding: 48px 0 40px;
          border-bottom: 1px solid #EAEAE6;
          margin-bottom: 48px;
        }

        .hero-pill-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #FFFFFF;
          border: 1px solid #E4E4E7;
          color: #18181B;
          font-size: 0.775rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 9999px;
          margin-bottom: 22px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .pill-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #E05A47;
        }

        .hero-heading {
          font-size: clamp(2.4rem, 4.4vw, 4rem);
          font-weight: 700;
          color: #18181B;
          letter-spacing: -0.035em;
          line-height: 1.15;
          max-width: 960px;
          margin: 0 auto 20px;
        }

        .hero-subheading {
          font-size: clamp(1rem, 1.25vw, 1.15rem);
          color: #52525B;
          line-height: 1.65;
          max-width: 740px;
          margin: 0 auto 34px;
        }

        /* Dual Role CTAs */
        .hero-role-cta-group {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 34px;
          flex-wrap: wrap;
        }

        .btn-role-primary {
          background-color: #18181B;
          color: #FFFFFF;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 13px 26px;
          border-radius: 9999px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid #18181B;
          box-shadow: 0 4px 14px rgba(24, 24, 27, 0.15);
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .btn-role-primary:hover {
          background-color: #09090B;
          transform: translateY(-1.5px);
          box-shadow: 0 6px 20px rgba(24, 24, 27, 0.25);
        }

        .btn-role-secondary {
          background-color: #FFFFFF;
          color: #18181B;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 12px 24px;
          border-radius: 9999px;
          border: 1px solid #D4D4D8;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          transition: all 0.18s ease;
          cursor: pointer;
        }

        .btn-role-secondary:hover {
          background: #F4F4F5;
          border-color: #A1A1AA;
          transform: translateY(-1.5px);
        }

        .btn-role-ghost {
          background: transparent;
          color: #52525B;
          font-weight: 500;
          font-size: 0.9rem;
          padding: 12px 18px;
          border-radius: 9999px;
          border: 1px dashed #D4D4D8;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: all 0.18s ease;
          cursor: pointer;
        }

        .btn-role-ghost:hover {
          background: #FFFFFF;
          color: #18181B;
          border-color: #18181B;
        }

        .hero-social-proof {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-bottom: 40px;
        }

        .avatar-stack {
          display: flex;
          align-items: center;
        }

        .stack-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 2px solid #FFFFFF;
          object-fit: cover;
          margin-left: -8px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .stack-avatar:first-child {
          margin-left: 0;
        }

        .proof-text-block {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .proof-stars {
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .proof-rating {
          font-size: 0.85rem;
          font-weight: 700;
          color: #18181B;
          margin-left: 4px;
        }

        .proof-caption {
          font-size: 0.775rem;
          color: #71717A;
          font-weight: 500;
        }

        /* 4 Pillars Strip */
        .hero-pillars-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          width: 100%;
          margin-bottom: 32px;
        }

        @media (max-width: 1024px) {
          .hero-pillars-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .hero-pillars-grid {
            grid-template-columns: 1fr;
          }
        }

        .pillar-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: #FFFFFF;
          border: 1px solid #EAEAE6;
          border-radius: 14px;
          padding: 16px;
          text-align: left;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }

        .pillar-icon-box {
          color: #18181B;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .pillar-text strong {
          display: block;
          font-size: 0.875rem;
          color: #18181B;
          margin-bottom: 2px;
        }

        .pillar-text span {
          display: block;
          font-size: 0.75rem;
          color: #71717A;
          line-height: 1.45;
        }

        /* ========================================================= */
        /* ALTERNATING STORYTELLING CARDS                            */
        /* ========================================================= */
        .alternating-showcase-section {
          margin-bottom: 64px;
        }

        .section-center-heading {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 48px;
        }

        .section-eyebrow-tag {
          display: inline-block;
          font-size: 0.725rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #71717A;
          margin-bottom: 8px;
        }

        .section-main-heading {
          font-size: clamp(1.8rem, 2.8vw, 2.4rem);
          font-weight: 800;
          color: #18181B;
          letter-spacing: -0.025em;
          line-height: 1.2;
          margin: 0 0 12px;
        }

        .section-sub-heading {
          font-size: 0.95rem;
          color: #71717A;
          line-height: 1.6;
          margin: 0;
        }

        .zigzag-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
          margin-bottom: 56px;
        }

        .zigzag-reverse {
          direction: ltr;
        }

        @media (max-width: 900px) {
          .zigzag-row {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }

        .zigzag-step-tag {
          display: inline-block;
          font-size: 0.725rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: #71717A;
          margin-bottom: 10px;
        }

        .zigzag-title {
          font-size: clamp(1.5rem, 2.2vw, 1.95rem);
          font-weight: 800;
          color: #18181B;
          letter-spacing: -0.02em;
          line-height: 1.25;
          margin: 0 0 14px;
        }

        .zigzag-desc {
          font-size: 0.925rem;
          color: #52525B;
          line-height: 1.65;
          margin: 0 0 22px;
        }

        .zigzag-features-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 26px;
        }

        .zigzag-feature-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.875rem;
          color: #3F3F46;
          line-height: 1.45;
        }

        .feat-check {
          color: #18181B;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .btn-zigzag-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #18181B;
          color: #FFFFFF;
          font-weight: 600;
          font-size: 0.875rem;
          padding: 11px 22px;
          border-radius: 9999px;
          text-decoration: none;
          border: 1px solid #18181B;
          transition: all 0.18s ease;
          cursor: pointer;
        }

        .btn-zigzag-cta:hover {
          background: #09090B;
          transform: translateY(-1px);
        }

        /* Zigzag Creator Showcase Card */
        .hero-showcase-wrapper {
          position: relative;
        }

        .hero-card-card {
          background: #FFFFFF;
          border: 1px solid #EAEAE6;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.02);
          position: relative;
        }

        .floating-badge {
          position: absolute;
          background: #FFFFFF;
          border: 1px solid #E4E4E7;
          border-radius: 9999px;
          padding: 6px 14px;
          font-size: 0.725rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          z-index: 10;
        }

        .badge-escrow {
          top: -12px;
          right: 20px;
          color: #18181B;
        }

        .badge-speed {
          bottom: -12px;
          left: 20px;
          color: #18181B;
        }

        .hero-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .hero-card-user {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .hero-avatar-box {
          position: relative;
          width: 58px;
          height: 58px;
          flex-shrink: 0;
        }

        .hero-avatar-img {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #FFFFFF;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
        }

        .hero-live-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          background: #22C55E;
          border: 2px solid #FFFFFF;
          border-radius: 50%;
        }

        .hero-card-name-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .hero-card-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: #18181B;
          margin: 0;
        }

        .hero-card-handle {
          display: block;
          font-size: 0.8rem;
          color: #71717A;
          margin-bottom: 4px;
        }

        .hero-niche-pill {
          display: inline-block;
          font-size: 0.725rem;
          font-weight: 600;
          color: #18181B;
          background: #F4F4F5;
          padding: 2px 8px;
          border-radius: 6px;
        }

        .hero-card-switcher {
          display: flex;
          gap: 4px;
        }

        .btn-switch {
          background: #F4F4F5;
          border: 1px solid #E4E4E7;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #3F3F46;
          transition: all 0.15s ease;
        }

        .btn-switch:hover {
          background: #18181B;
          color: #FFFFFF;
        }

        .hero-card-bio {
          font-size: 0.85rem;
          color: #52525B;
          line-height: 1.5;
          font-style: italic;
          margin: 0 0 16px;
        }

        .hero-metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 20px;
        }

        .hero-metric-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #FAFAFA;
          border: 1px solid #EAEAE6;
          border-radius: 10px;
          padding: 8px 10px;
        }

        .hmetric-icon-wrap {
          color: #71717A;
        }

        .hmetric-num {
          display: block;
          font-size: 0.875rem;
          font-weight: 700;
          color: #18181B;
          line-height: 1.2;
        }

        .hmetric-label {
          display: block;
          font-size: 0.675rem;
          color: #71717A;
          text-transform: uppercase;
        }

        .hero-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid #F4F4F5;
        }

        .hero-card-price .hprice-sub {
          display: block;
          font-size: 0.725rem;
          color: #71717A;
        }

        .hero-card-price .hprice-num {
          font-size: 1.15rem;
          font-weight: 800;
          color: #18181B;
        }

        .btn-hero-book {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #18181B;
          color: #FFFFFF;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 8px 18px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-hero-book:hover {
          background: #09090B;
        }

        /* Vault Card for Creators */
        .vault-showcase-card {
          background: #FFFFFF;
          border: 1px solid #EAEAE6;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.06);
        }

        .vault-card-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #EAEAE6;
        }

        .vault-icon-circle {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #F4F4F5;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #18181B;
        }

        .vault-card-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #18181B;
          margin: 0;
        }

        .vault-card-subtitle {
          font-size: 0.775rem;
          color: #71717A;
        }

        .vault-stages-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .vault-stage-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid #EAEAE6;
          background: #FAFAFA;
        }

        .vault-stage-item.completed {
          background: #FFFFFF;
          border-color: #E4E4E7;
        }

        .vault-stage-item.current {
          background: #FFFFFF;
          border-color: #18181B;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .vstage-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #F4F4F5;
          color: #18181B;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .vault-stage-item.current .vstage-icon {
          background: #18181B;
          color: #FFFFFF;
        }

        .vstage-text {
          flex: 1;
        }

        .vstage-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2px;
        }

        .vstage-row strong {
          font-size: 0.85rem;
          color: #18181B;
        }

        .vstage-pct {
          font-size: 0.725rem;
          font-weight: 700;
          color: #71717A;
        }

        .vstage-sub {
          display: block;
          font-size: 0.725rem;
          color: #71717A;
        }

        .vault-guarantee-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #18181B;
          background: #FAFAFA;
          border: 1px solid #EAEAE6;
          padding: 10px 14px;
          border-radius: 10px;
        }

        /* ========================================================= */
        /* HOW IT WORKS 3-STEP SECTION                               */
        /* ========================================================= */
        .how-it-works-section {
          padding: 48px 0;
          margin-bottom: 56px;
        }

        .steps-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        @media (max-width: 860px) {
          .steps-cards-grid {
            grid-template-columns: 1fr;
          }
        }

        .step-card {
          background: #FFFFFF;
          border: 1px solid #EAEAE6;
          border-radius: 18px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }

        .step-card-num {
          font-size: 2.2rem;
          font-weight: 800;
          color: #18181B;
          letter-spacing: -0.04em;
          line-height: 1;
          margin-bottom: 16px;
        }

        .step-card-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #18181B;
          margin: 0 0 10px;
        }

        .step-card-desc {
          font-size: 0.875rem;
          color: #52525B;
          line-height: 1.6;
          margin: 0 0 20px;
          flex: 1;
        }

        .step-card-pill {
          background: #F4F4F5;
          color: #18181B;
          font-size: 0.725rem;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 9999px;
          width: fit-content;
        }

        /* ========================================================= */
        /* TRENDING SCROLL TRACK                                     */
        /* ========================================================= */
        .trending-rail-section {
          margin-bottom: 64px;
        }

        .trending-section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .trending-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #E05A47;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 4px;
        }

        .flame-icon {
          color: #E05A47;
        }

        .trending-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #18181B;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .rail-navigation-arrows {
          display: flex;
          gap: 8px;
        }

        .btn-rail-arrow {
          background: #FFFFFF;
          border: 1px solid #E4E4E7;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #3F3F46;
          transition: all 0.15s ease;
        }

        .btn-rail-arrow:hover {
          background: #18181B;
          color: #FFFFFF;
        }

        /* Category pills strip on the trending section */
        .trending-categories-strip {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 14px;
          margin-bottom: 16px;
          scrollbar-width: none;
        }

        .trending-categories-strip::-webkit-scrollbar {
          display: none;
        }

        .category-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #FFFFFF;
          border: 1px solid #E4E4E7;
          border-radius: 9999px;
          padding: 7px 16px;
          font-size: 0.825rem;
          font-weight: 500;
          color: #3F3F46;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .category-pill.active {
          background: #18181B;
          color: #FFFFFF;
          border-color: #18181B;
        }

        .category-pill:hover:not(.active) {
          background: #F4F4F5;
          color: #18181B;
        }

        .trending-scroll-track {
          display: flex;
          gap: 18px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding-bottom: 12px;
          scrollbar-width: none;
        }

        .trending-scroll-track::-webkit-scrollbar {
          display: none;
        }

        .trending-card {
          flex: 0 0 300px;
          background: #FFFFFF;
          border: 1px solid #EAEAE6;
          border-radius: 16px;
          padding: 18px;
          scroll-snap-align: start;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .trending-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px -4px rgba(0, 0, 0, 0.08);
        }

        .trending-card-top {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .trending-avatar-wrap {
          position: relative;
          width: 48px;
          height: 48px;
        }

        .trending-avatar-img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
        }

        .trending-status-dot {
          position: absolute;
          bottom: 1px;
          right: 1px;
          width: 10px;
          height: 10px;
          background: #22C55E;
          border: 1.5px solid #FFFFFF;
          border-radius: 50%;
        }

        .trending-name-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .trending-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: #18181B;
          margin: 0;
          cursor: pointer;
        }

        .trending-handle {
          display: block;
          font-size: 0.775rem;
          color: #71717A;
        }

        .trending-niche {
          display: inline-block;
          font-size: 0.7rem;
          color: #71717A;
          background: #F4F4F5;
          padding: 2px 6px;
          border-radius: 4px;
          margin-top: 2px;
        }

        .trending-metrics-strip {
          display: flex;
          justify-content: space-between;
          background: #FAFAFA;
          border: 1px solid #EAEAE6;
          border-radius: 10px;
          padding: 8px 12px;
          margin-bottom: 14px;
        }

        .tmetric-item {
          display: flex;
          flex-direction: column;
        }

        .tmetric-val {
          display: block;
          font-size: 0.825rem;
          font-weight: 700;
          color: #18181B;
        }

        .tmetric-lbl {
          display: block;
          font-size: 0.65rem;
          color: #71717A;
          text-transform: uppercase;
        }

        .trending-card-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .btn-trending-view {
          background: #F4F4F5;
          border: 1px solid #E4E4E7;
          border-radius: 8px;
          padding: 7px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #18181B;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-trending-view:hover {
          background: #E4E4E7;
        }

        .btn-trending-hire {
          background: #18181B;
          border: none;
          border-radius: 8px;
          padding: 7px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #FFFFFF;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-trending-hire:hover {
          background: #09090B;
        }

        /* ========================================================= */
        /* PLATFORM VALUE PROPS (THE CREATORLY STANDARD)             */
        /* ========================================================= */
        .features-preview-section {
          background: #FFFFFF;
          border: 1px solid #EAEAE6;
          border-radius: 20px;
          padding: 40px;
          text-align: center;
        }

        .features-header {
          margin-bottom: 32px;
        }

        .features-tag {
          display: inline-block;
          font-size: 0.725rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #71717A;
          margin-bottom: 6px;
        }

        .features-title {
          font-size: clamp(1.4rem, 2vw, 1.8rem);
          font-weight: 800;
          color: #18181B;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .features-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          text-align: left;
        }

        @media (max-width: 860px) {
          .features-cards-grid {
            grid-template-columns: 1fr;
          }
        }

        .feature-item-card {
          background: #FAFAFA;
          border: 1px solid #EAEAE6;
          border-radius: 14px;
          padding: 24px;
        }

        .feature-icon-box {
          color: #18181B;
          margin-bottom: 14px;
        }

        .feature-item-title {
          font-size: 1rem;
          font-weight: 700;
          color: #18181B;
          margin: 0 0 8px;
        }

        .feature-item-desc {
          font-size: 0.85rem;
          color: #52525B;
          line-height: 1.55;
          margin: 0;
        }
      `}</style>
    </section>
  );
};
