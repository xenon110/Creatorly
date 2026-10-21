import React, { useState, useEffect } from 'react';
import type { CreatorProfile, CurrencyCode } from '../../types/creator';
import { 
  ArrowLeft, 
  ArrowRight,
  ArrowUpRight, 
  Check, 
  ShieldCheck, 
  Zap, 
  Lock, 
  Award, 
  DollarSign, 
  Users, 
  FileText, 
  Search, 
  Send, 
  Download, 
  Copy, 
  ChevronRight, 
  Sparkles, 
  Globe, 
  HeartHandshake, 
  Code2, 
  Laptop, 
  Smartphone, 
  Layers, 
  ExternalLink,
  MessageSquare,
  HelpCircle,
  Briefcase,
  Star,
  Play
} from 'lucide-react';
import { CreatorlyLogo } from '../CreatorlyLogo';

export type PageSlug = 
  // About
  | 'about-creatorly'
  | 'how-escrow-works'
  | 'verification-protocol'
  | 'creator-standards'
  | 'press-media-kit'
  // Careers
  | 'open-positions'
  | 'creator-fellowship'
  | 'culture-perks'
  | 'engineering-blog'
  | 'brand-guidelines'
  // Connect
  | 'contact-creator'
  | 'hire-campaign'
  | 'support-help'
  | 'agency-partnerships'
  | 'discord-community'
  // Discover & Visit
  | 'all-creators'
  | 'tech-ai-creators'
  | 'saas-devtools-creators'
  | 'consumer-tech-creators'
  | 'apply-creator';

interface MarketplaceInfoPagesProps {
  pageSlug: string;
  onNavigateToPage: (slug: string) => void;
  onReturnToHome: () => void;
  onSelectCreator: (creator: CreatorProfile) => void;
  creators: CreatorProfile[];
  currentCurrency: CurrencyCode;
  onShowToast: (msg: string) => void;
  onOpenBookingModal?: (creator: CreatorProfile) => void;
}

export const MarketplaceInfoPages: React.FC<MarketplaceInfoPagesProps> = ({
  pageSlug,
  onNavigateToPage,
  onReturnToHome,
  onSelectCreator,
  creators,
  currentCurrency,
  onShowToast,
  onOpenBookingModal
}) => {
  const currentSlug = (pageSlug as PageSlug) || 'about-creatorly';

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSlug]);

  // Interactive States
  const [escrowBudget, setEscrowBudget] = useState<number>(50000);
  const [auditCreatorIndex, setAuditCreatorIndex] = useState<number>(0);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [jobApplied, setJobApplied] = useState(false);
  const [creatorApplicationSubmitted, setCreatorApplicationSubmitted] = useState(false);
  const [supportFaqSearch, setSupportFaqSearch] = useState('');
  const [supportTicketSubmitted, setSupportTicketSubmitted] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [contactCreatorId, setContactCreatorId] = useState<string>(creators[0]?.id || 'cr_alex_sharma');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [agencyDemoBooked, setAgencyDemoBooked] = useState(false);
  const [creatorDirectoryCategory, setCreatorDirectoryCategory] = useState<string>('All');

  // Copy Hex Utility
  const copyHex = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    onShowToast(`Copied ${hex} to clipboard!`);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  // Category mapping for tabs
  const getCategoryFromSlug = (slug: string): 'about' | 'careers' | 'connect' | 'discover' => {
    if (['about-creatorly', 'how-escrow-works', 'verification-protocol', 'creator-standards', 'press-media-kit'].includes(slug)) return 'about';
    if (['open-positions', 'creator-fellowship', 'culture-perks', 'engineering-blog', 'brand-guidelines'].includes(slug)) return 'careers';
    if (['contact-creator', 'hire-campaign', 'support-help', 'agency-partnerships', 'discord-community'].includes(slug)) return 'connect';
    return 'discover';
  };

  const currentCategory = getCategoryFromSlug(currentSlug);

  const getPageTitle = (slug: string): string => {
    switch (slug) {
      case 'about-creatorly': return 'About Creatorly';
      case 'how-escrow-works': return 'How Escrow Works';
      case 'verification-protocol': return 'Verification Protocol';
      case 'creator-standards': return 'Creator Standards';
      case 'press-media-kit': return 'Press & Media Kit';
      case 'open-positions': return 'Open Positions (3)';
      case 'creator-fellowship': return 'Creator Fellowship';
      case 'culture-perks': return 'Culture & Perks';
      case 'engineering-blog': return 'Engineering Blog';
      case 'brand-guidelines': return 'Brand Guidelines';
      case 'contact-creator': return 'Contact Creator';
      case 'hire-campaign': return 'Hire for Campaign';
      case 'support-help': return 'Support & Help Desk';
      case 'agency-partnerships': return 'Agency Partnerships';
      case 'discord-community': return 'Discord Community';
      case 'all-creators': return 'All Creators Directory';
      case 'tech-ai-creators': return 'Technology & AI Creators';
      case 'saas-devtools-creators': return 'SaaS & Dev Tools Creators';
      case 'consumer-tech-creators': return 'Consumer Tech Creators';
      case 'apply-creator': return 'Apply as a Creator';
      default: return 'Creatorly Marketplace';
    }
  };

  // Nav Links grouped by category
  const categoryLinks = {
    about: [
      { slug: 'about-creatorly', label: 'About Creatorly' },
      { slug: 'how-escrow-works', label: 'How Escrow Works' },
      { slug: 'verification-protocol', label: 'Verification Protocol' },
      { slug: 'creator-standards', label: 'Creator Standards' },
      { slug: 'press-media-kit', label: 'Press & Media Kit' },
    ],
    careers: [
      { slug: 'open-positions', label: 'Open Positions (3)', badge: "We're hiring" },
      { slug: 'creator-fellowship', label: 'Creator Fellowship' },
      { slug: 'culture-perks', label: 'Culture & Perks' },
      { slug: 'engineering-blog', label: 'Engineering Blog' },
      { slug: 'brand-guidelines', label: 'Brand Guidelines' },
    ],
    connect: [
      { slug: 'contact-creator', label: 'Contact Creator' },
      { slug: 'hire-campaign', label: 'Hire for Campaign' },
      { slug: 'support-help', label: 'Support & Help Desk' },
      { slug: 'agency-partnerships', label: 'Agency Partnerships' },
      { slug: 'discord-community', label: 'Discord Community' },
    ],
    discover: [
      { slug: 'all-creators', label: 'All Creators' },
      { slug: 'tech-ai-creators', label: 'Technology & AI' },
      { slug: 'saas-devtools-creators', label: 'SaaS & Dev Tools' },
      { slug: 'consumer-tech-creators', label: 'Consumer Tech' },
      { slug: 'apply-creator', label: 'Apply as a Creator' },
    ]
  };

  return (
    <div className="marketplace-info-page">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP NAVIGATION & BREADCRUMB BAR
      ────────────────────────────────────────────────────────────── */}
      <nav className="info-top-nav">
        <div className="fresh-content-container info-nav-flex">
          <div className="info-nav-left">
            <button 
              type="button" 
              className="btn-info-logo" 
              onClick={onReturnToHome}
              aria-label="Creatorly Home"
            >
              <CreatorlyLogo width={28} height={22} />
              <span className="info-logo-text">creatorly.</span>
            </button>

            <span className="info-nav-divider">/</span>

            <span className="info-breadcrumb-category">
              {currentCategory.toUpperCase()}
            </span>

            <span className="info-nav-divider">/</span>

            <span className="info-breadcrumb-current">
              {getPageTitle(currentSlug)}
            </span>
          </div>

          <div className="info-nav-right">
            <button
              type="button"
              className="btn-back-storefront"
              onClick={onReturnToHome}
            >
              <ArrowLeft size={15} />
              <span>Back to Storefront</span>
            </button>

            <button
              type="button"
              className="btn-cta-nav"
              onClick={() => onNavigateToPage('hire-campaign')}
            >
              <span>Work together</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          2. SUB-NAVIGATION TABS (Category Switcher)
      ────────────────────────────────────────────────────────────── */}
      <section className="info-subnav-section">
        <div className="fresh-content-container info-subnav-container">
          <div className="subnav-pill-row">
            {categoryLinks[currentCategory].map((link) => (
              <button
                key={link.slug}
                type="button"
                className={`subnav-pill ${currentSlug === link.slug ? 'active' : ''}`}
                onClick={() => onNavigateToPage(link.slug)}
              >
                <span>{link.label}</span>
                {link.badge && <span className="subnav-badge">{link.badge}</span>}
              </button>
            ))}
          </div>

          {/* Quick Category Jump Links */}
          <div className="quick-category-links">
            <span className="quick-cat-label">Sections:</span>
            {(['about', 'careers', 'connect', 'discover'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                className={`quick-cat-btn ${currentCategory === cat ? 'active' : ''}`}
                onClick={() => {
                  const firstSlug = categoryLinks[cat][0]?.slug || 'about-creatorly';
                  onNavigateToPage(firstSlug);
                }}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN CONTENT ROUTER (All 20 Pages)
      ────────────────────────────────────────────────────────────── */}
      <main className="info-main-content">
        <div className="fresh-content-container">
          
          {/* ========================================================= */}
          {/* PAGE 1: About Creatorly                                   */}
          {/* ========================================================= */}
          {currentSlug === 'about-creatorly' && (
            <div className="page-section-block">
              <div className="editorial-header">
                <span className="editorial-eyebrow">
                  <span className="eyebrow-bullet">•</span> ABOUT CREATORLY / MANIFESTO
                </span>
                <h1 className="editorial-title">
                  Where honesty meets <span className="text-coral">influence.</span>
                </h1>
                <p className="editorial-subtitle">
                  Creatorly was founded on a simple conviction: creator marketing doesn't need opaque agency markups, anxious invoice follow-ups, or vanity follower counts. It needs transparent milestone rate cards, direct verified metrics, and bank-grade escrow protection.
                </p>
              </div>

              {/* Stats Highlights */}
              <div className="metrics-strip-grid">
                <div className="metric-box">
                  <span className="metric-number">₹14.8 Cr+</span>
                  <span className="metric-label">Escrow payouts settled</span>
                  <span className="metric-sub">Zero payment defaults recorded</span>
                </div>
                <div className="metric-box">
                  <span className="metric-number">500+</span>
                  <span className="metric-label">Verified Creators</span>
                  <span className="metric-sub">Direct Meta & YouTube OAuth audit</span>
                </div>
                <div className="metric-box">
                  <span className="metric-number">0%</span>
                  <span className="metric-label">Fraud Incident Rate</span>
                  <span className="metric-sub">Tier-1 trustee escrow vaulting</span>
                </div>
                <div className="metric-box">
                  <span className="metric-number">&lt; 2 hrs</span>
                  <span className="metric-label">Avg Creator SLA</span>
                  <span className="metric-sub">Prompt communication guaranteed</span>
                </div>
              </div>

              {/* 4 Pillars of Creatorly */}
              <div className="editorial-grid-2col">
                <div className="info-card">
                  <div className="info-card-icon"><ShieldCheck size={24} className="text-coral" /></div>
                  <h3>Milestone-Protected Escrow</h3>
                  <p>
                    Brands deposit campaign budgets safely into neutral escrow accounts before production starts. Funds are locked and only released upon verifiable milestone completion — scripts, rough cuts, and live post analytics.
                  </p>
                </div>

                <div className="info-card">
                  <div className="info-card-icon"><Award size={24} className="text-teal" /></div>
                  <h3>Direct API Verification</h3>
                  <p>
                    We reject fake media kits and photoshopped screenshots. Every creator’s audience demographics, 30-day view velocity, and authentic engagement rates are queried directly from Meta Graph and Google APIs.
                  </p>
                </div>

                <div className="info-card">
                  <div className="info-card-icon"><HeartHandshake size={24} className="text-coral" /></div>
                  <h3>Creators Keep 100%</h3>
                  <p>
                    Creators set their own rate cards and keep 100% of their published fees. We believe talented storytellers should be rewarded fully for their craft, not taxed with 30% agency cuts.
                  </p>
                </div>

                <div className="info-card">
                  <div className="info-card-icon"><Zap size={24} className="text-lime" /></div>
                  <h3>Gentle & Professional UX</h3>
                  <p>
                    A calm, distraction-free marketplace designed for clear decision-making. No aggressive spam, no fake urgency timers — just respectful partnerships built to last for quarters, not just single posts.
                  </p>
                </div>
              </div>

              {/* Callout Action */}
              <div className="editorial-action-banner">
                <div>
                  <h3>Ready to experience the gentle future of creator collaborations?</h3>
                  <p>Explore vetted creators across tech, design, lifestyle, and finance.</p>
                </div>
                <button type="button" className="btn-action-primary" onClick={onReturnToHome}>
                  <span>Explore Creator Roster</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 2: How Escrow Works                                  */}
          {/* ========================================================= */}
          {currentSlug === 'how-escrow-works' && (
            <div className="page-section-block">
              <div className="editorial-header">
                <span className="editorial-eyebrow">
                  <span className="eyebrow-bullet">•</span> ESCROW ARCHITECTURE / TRUST FIRST
                </span>
                <h1 className="editorial-title">
                  Bank-grade milestone protection. <span className="text-coral">For both sides.</span>
                </h1>
                <p className="editorial-subtitle">
                  Neither brands nor creators take all the risk. Campaign funds stay vaulted in regulated escrow accounts and release automatically in transparent stages as real deliverables get approved.
                </p>
              </div>

              {/* Interactive Escrow Simulator */}
              <div className="escrow-simulator-card">
                <div className="sim-header">
                  <div>
                    <h4>Interactive Milestone Calculator</h4>
                    <p>Adjust the campaign budget to see how Creatorly breaks down milestone escrow release.</p>
                  </div>
                  <div className="budget-preset-pills">
                    {[25000, 50000, 100000, 250000].map((b) => (
                      <button
                        key={b}
                        type="button"
                        className={`preset-btn ${escrowBudget === b ? 'active' : ''}`}
                        onClick={() => setEscrowBudget(b)}
                      >
                        ₹{(b / 1000).toFixed(0)}k
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sim-slider-row">
                  <label>Total Campaign Escrow: <strong>₹{escrowBudget.toLocaleString('en-IN')}</strong></label>
                  <input
                    type="range"
                    min="10000"
                    max="500000"
                    step="5000"
                    value={escrowBudget}
                    onChange={(e) => setEscrowBudget(Number(e.target.value))}
                    className="budget-slider"
                  />
                </div>

                <div className="milestone-stages-grid">
                  <div className="stage-box">
                    <div className="stage-num">01</div>
                    <span className="stage-pct">30% Deposit</span>
                    <h5>Creative Script & Outline</h5>
                    <p>Released upon brand approving video outline, hook script, and talking points.</p>
                    <div className="stage-amount">₹{(escrowBudget * 0.3).toLocaleString('en-IN')}</div>
                  </div>

                  <div className="stage-box">
                    <div className="stage-num">02</div>
                    <span className="stage-pct">40% Milestone</span>
                    <h5>Rough Cut & Revisions</h5>
                    <p>Released upon video review, b-roll confirmation, and feedback integration.</p>
                    <div className="stage-amount">₹{(escrowBudget * 0.4).toLocaleString('en-IN')}</div>
                  </div>

                  <div className="stage-box">
                    <div className="stage-num">03</div>
                    <span className="stage-pct">30% Final Release</span>
                    <h5>Live Post & 72h Verification</h5>
                    <p>Released once the sponsor post goes live with tracking link and reach verification.</p>
                    <div className="stage-amount">₹{(escrowBudget * 0.3).toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>

              {/* Escrow Safety FAQ points */}
              <div className="editorial-grid-3col">
                <div className="feature-block">
                  <Lock size={20} className="text-coral" />
                  <h4>Trustee Escrow Accounts</h4>
                  <p>Funds never sit in proprietary operating accounts. They are held by registered banking trustees until verified milestone sign-off.</p>
                </div>
                <div className="feature-block">
                  <Check size={20} className="text-teal" />
                  <h4>No Payment Chasing</h4>
                  <p>Creators work with full peace of mind knowing 100% of the funds are already funded and locked in escrow before they hit record.</p>
                </div>
                <div className="feature-block">
                  <ShieldCheck size={20} className="text-lime" />
                  <h4>Dispute Protection</h4>
                  <p>If a creator fails to deliver within the agreed SLA, funds return to the brand automatically with zero hassle.</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 3: Verification Protocol                             */}
          {/* ========================================================= */}
          {currentSlug === 'verification-protocol' && (
            <div className="page-section-block">
              <div className="editorial-header">
                <span className="editorial-eyebrow">
                  <span className="eyebrow-bullet">•</span> VERIFICATION PROTOCOL / AUDIT ENGINE
                </span>
                <h1 className="editorial-title">
                  Zero bots. Zero fake engagement. <span className="text-coral">Real humans only.</span>
                </h1>
                <p className="editorial-subtitle">
                  Before any creator earns the Creatorly Verified badge, their accounts undergo our rigorous 6-step algorithmic and editorial inspection. Only 6% of applicants pass.
                </p>
              </div>

              {/* Interactive Audit Inspector */}
              <div className="audit-inspector-card">
                <div className="inspector-top">
                  <h4>Live Verification Audit Inspector</h4>
                  <p>Preview the direct API verification metrics on vetted creators:</p>
                  <div className="creator-select-tabs">
                    {creators.slice(0, 4).map((c, idx) => (
                      <button
                        key={c.id}
                        type="button"
                        className={`creator-tab-btn ${auditCreatorIndex === idx ? 'active' : ''}`}
                        onClick={() => setAuditCreatorIndex(idx)}
                      >
                        {c.fullName} ({c.primaryNiche})
                      </button>
                    ))}
                  </div>
                </div>

                {creators[auditCreatorIndex] && (
                  <div className="audit-results-box">
                    <div className="audit-score-col">
                      <div className="score-badge-circle">
                        <span className="score-val">98.4</span>
                        <span className="score-scale">/ 100</span>
                      </div>
                      <span className="score-status">✓ VERIFIED AUTHENTIC</span>
                      <span className="score-note">Last audited: Meta API 48h ago</span>
                    </div>

                    <div className="audit-details-col">
                      <div className="audit-row">
                        <span className="audit-label">Direct API Connection:</span>
                        <span className="audit-val text-teal">✓ Meta & YouTube OAuth Active</span>
                      </div>
                      <div className="audit-row">
                        <span className="audit-label">Audience Authenticity:</span>
                        <span className="audit-val">97.2% Real Humans (No suspicious bot spikes)</span>
                      </div>
                      <div className="audit-row">
                        <span className="audit-label">Primary Geography:</span>
                        <span className="audit-val">82% India (Mumbai, Bengaluru, Delhi, Pune)</span>
                      </div>
                      <div className="audit-row">
                        <span className="audit-label">Avg Engagement Rate:</span>
                        <span className="audit-val">{creators[auditCreatorIndex].engagementRate}% (Top 5% in category)</span>
                      </div>
                      <div className="audit-row">
                        <span className="audit-label">Sponsor Completion Rate:</span>
                        <span className="audit-val">100% On-Time Deliveries across 14 campaigns</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* The 6 Pillars of the Audit */}
              <div className="editorial-grid-3col">
                <div className="feature-block">
                  <div className="step-tag">Step 1</div>
                  <h4>OAuth Handshake</h4>
                  <p>Direct token authentication with Meta Graph API and Google YouTube Analytics API.</p>
                </div>
                <div className="feature-block">
                  <div className="step-tag">Step 2</div>
                  <h4>Follower Velocity Check</h4>
                  <p>Historical growth curve analysis to detect synthetic bulk purchases or sudden overnight spikes.</p>
                </div>
                <div className="feature-block">
                  <div className="step-tag">Step 3</div>
                  <h4>Comment Sentiment NLP</h4>
                  <p>Natural language parsing of comments to separate real discourse from emoji bot farms.</p>
                </div>
                <div className="feature-block">
                  <div className="step-tag">Step 4</div>
                  <h4>Audience Demographics</h4>
                  <p>Auditing age, gender, and geographical concentrations to match brand buyer personas.</p>
                </div>
                <div className="feature-block">
                  <div className="step-tag">Step 5</div>
                  <h4>Brand Reference Checks</h4>
                  <p>Direct outreach to past 3 sponsorship clients to verify professionalism and communication.</p>
                </div>
                <div className="feature-block">
                  <div className="step-tag">Step 6</div>
                  <h4>Legal Identity & KYC</h4>
                  <p>PAN, GST, and institutional bank account verification for clean, hassle-free tax invoicing.</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 4: Creator Standards                                 */}
          {/* ========================================================= */}
          {currentSlug === 'creator-standards' && (
            <div className="page-section-block">
              <div className="editorial-header">
                <span className="editorial-eyebrow">
                  <span className="eyebrow-bullet">•</span> CODE OF CONDUCT / ETHICAL CREATIVE
                </span>
                <h1 className="editorial-title">
                  High craft. Clear commitments. <span className="text-coral">Dignified execution.</span>
                </h1>
                <p className="editorial-subtitle">
                  The foundational code of conduct that gives tier-1 brands the confidence to invest repeatedly with Creatorly creators.
                </p>
              </div>

              <div className="standards-list">
                <div className="standard-item">
                  <div className="std-number">01</div>
                  <div className="std-content">
                    <h4>The &lt; 2-Hour Communication SLA</h4>
                    <p>
                      Prompt communication builds great partnerships. Creators acknowledge brand inquiries and revision comments within 2 hours during normal business hours.
                    </p>
                  </div>
                </div>

                <div className="standard-item">
                  <div className="std-number">02</div>
                  <div className="std-content">
                    <h4>Two Revision Rounds Guaranteed</h4>
                    <p>
                      Every package includes two thorough rounds of structured feedback. Brands provide consolidated notes, and creators implement adjustments within 48 hours without friction.
                    </p>
                  </div>
                </div>

                <div className="standard-item">
                  <div className="std-number">03</div>
                  <div className="std-content">
                    <h4>FTC & ASCI Transparent Disclosures</h4>
                    <p>
                      Every sponsored video, reel, and post features prominent disclosure (#ad / #partnership). We believe honesty with audiences builds long-term brand credibility.
                    </p>
                  </div>
                </div>

                <div className="standard-item">
                  <div className="std-number">04</div>
                  <div className="std-content">
                    <h4>Authentic Testing & Respectful Critique</h4>
                    <p>
                      Creators test products for a minimum of 48 hours before speaking on them. If a creator discovers an issue, they notify the brand immediately before proceeding.
                    </p>
                  </div>
                </div>

                <div className="standard-item">
                  <div className="std-number">05</div>
                  <div className="std-content">
                    <h4>30-Day Category Exclusivity</h4>
                    <p>
                      Creators agree not to feature direct commercial competitors in the same vertical for 30 days before and after campaign publishing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 5: Press & Media Kit                                 */}
          {/* ========================================================= */}
          {currentSlug === 'press-media-kit' && (
            <div className="page-section-block">
              <div className="editorial-header">
                <span className="editorial-eyebrow">
                  <span className="eyebrow-bullet">•</span> PRESS ROOM & MEDIA KIT
                </span>
                <h1 className="editorial-title">
                  Press releases, brand assets & <span className="text-coral">founder bio.</span>
                </h1>
                <p className="editorial-subtitle">
                  Official news, high-resolution logos, brand identity guidelines, and media contact for journalists covering creator economy innovation.
                </p>
              </div>

              {/* Brand Asset Downloads */}
              <h3 className="section-subheading">Official Brand Assets</h3>
              <div className="editorial-grid-3col">
                <div className="asset-download-card">
                  <div className="asset-preview-box">
                    <CreatorlyLogo width={48} height={40} />
                  </div>
                  <h4>Creatorly Primary Wordmark</h4>
                  <p>Vector SVG & high-res PNG with transparent background.</p>
                  <button type="button" className="btn-download" onClick={() => onShowToast('Downloaded Creatorly_Wordmark.zip')}>
                    <Download size={14} />
                    <span>Download SVG + PNG</span>
                  </button>
                </div>

                <div className="asset-download-card">
                  <div className="asset-preview-box">
                    <div className="four-dots-preview">
                      <span className="dot dot-green"></span>
                      <span className="dot dot-orange"></span>
                      <span className="dot dot-blue"></span>
                      <span className="dot dot-pink"></span>
                    </div>
                  </div>
                  <h4>4-Dots Brand Mark</h4>
                  <p>The iconic 4-color motif for app icons and social avatars.</p>
                  <button type="button" className="btn-download" onClick={() => onShowToast('Downloaded Creatorly_Dots_Mark.zip')}>
                    <Download size={14} />
                    <span>Download Mark Kit</span>
                  </button>
                </div>

                <div className="asset-download-card">
                  <div className="asset-preview-box dark-box">
                    <span style={{ color: '#FFFFFF', fontWeight: 800 }}>creatorly.</span>
                  </div>
                  <h4>Dark Mode Vector Assets</h4>
                  <p>Inverted logos designed for dark backdrops and press articles.</p>
                  <button type="button" className="btn-download" onClick={() => onShowToast('Downloaded Creatorly_Dark_Kit.zip')}>
                    <Download size={14} />
                    <span>Download Dark Assets</span>
                  </button>
                </div>
              </div>

              {/* Press Releases */}
              <h3 className="section-subheading" style={{ marginTop: '48px' }}>Recent Press Releases</h3>
              <div className="press-releases-list">
                <div className="press-item">
                  <span className="press-date">October 2026</span>
                  <h4>Creatorly Surpasses ₹14 Cr in Escrow Milestone Payouts to Indian Storytellers</h4>
                  <p>Platform introduces direct Meta OAuth auditing to counter synthetic bot followers across tier-1 brand campaigns.</p>
                  <button type="button" className="btn-press-read" onClick={() => onShowToast('Reading press release: October 2026 Milestone Payouts')}>
                    <span>Read Release</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>

                <div className="press-item">
                  <span className="press-date">August 2026</span>
                  <h4>Creatorly Launches 12-Week Creator Fellowship with ₹5,00,000 Equity-Free Grants</h4>
                  <p>First cohort welcomes 12 rising creators across tech, design, and culinary storytelling.</p>
                  <button type="button" className="btn-press-read" onClick={() => onShowToast('Reading press release: Creator Fellowship Cohort 1')}>
                    <span>Read Release</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>

              {/* Media Contact Card */}
              <div className="media-contact-banner">
                <div>
                  <h4>Press & Media Inquiries</h4>
                  <p>Writing a story on creator economy fintech? Reach our communications team for comments and data.</p>
                  <span className="press-email">press@creatorly.com • Response within 4 hours</span>
                </div>
                <button type="button" className="btn-action-primary" onClick={() => onShowToast('Copied press@creatorly.com to clipboard!')}>
                  <span>Contact Communications</span>
                  <Send size={15} />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 6: Open Positions (3)                                */}
          {/* ========================================================= */}
          {currentSlug === 'open-positions' && (
            <div className="page-section-block">
              <div className="editorial-header">
                <span className="editorial-eyebrow">
                  <span className="eyebrow-bullet">•</span> CAREERS / WE'RE HIRING (3 OPEN ROLES)
                </span>
                <h1 className="editorial-title">
                  Build the calm, pro platform <span className="text-coral">creators deserve.</span>
                </h1>
                <p className="editorial-subtitle">
                  We are a small, high-caliber, remote-first team. We value craft, deep work, and clear writing over endless meetings.
                </p>
              </div>

              {/* 3 Job Openings */}
              <div className="jobs-list">
                {[
                  {
                    id: 'lead-designer',
                    title: 'Lead Product Designer (Design Systems & Editorial UI)',
                    dept: 'Design & UX',
                    loc: 'Remote (India / Global)',
                    comp: '₹28,00,000 – ₹38,00,000 + Equity',
                    desc: 'Define the next generation of gentle, restrained marketplace interfaces. Own our web design system and editorial typography.'
                  },
                  {
                    id: 'staff-fintech-eng',
                    title: 'Staff Escrow & FinTech Engineer (Distributed State Machines)',
                    dept: 'Engineering',
                    loc: 'Bengaluru / Remote',
                    comp: '₹36,00,000 – ₹48,00,000 + Equity',
                    desc: 'Architect bank-grade escrow settlement pipelines, webhook ingestion, and automated milestone payouts with zero data loss.'
                  },
                  {
                    id: 'creator-partnerships',
                    title: 'Creator Partnerships Director (Tech & Lifestyle)',
                    dept: 'Creator Operations',
                    loc: 'Mumbai / Remote',
                    comp: '₹24,00,000 – ₹32,00,000 + Bonus',
                    desc: 'Curate and onboard the top 1% of independent content creators. Guide creator rate cards and maintain quality standards.'
                  }
                ].map((job) => (
                  <div key={job.id} className="job-card">
                    <div className="job-card-main">
                      <div className="job-meta-pills">
                        <span className="job-pill-dept">{job.dept}</span>
                        <span className="job-pill-loc">{job.loc}</span>
                        <span className="job-pill-comp">{job.comp}</span>
                      </div>
                      <h3 className="job-title">{job.title}</h3>
                      <p className="job-desc">{job.desc}</p>
                    </div>
                    <div className="job-card-action">
                      <button
                        type="button"
                        className="btn-apply-job"
                        onClick={() => {
                          setSelectedJob(job.title);
                          setJobApplied(false);
                        }}
                      >
                        <span>Apply for Role</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Job Application Modal / Form */}
              {selectedJob && (
                <div className="job-apply-modal-box">
                  <div className="apply-box-header">
                    <h4>Apply for: {selectedJob}</h4>
                    <button type="button" className="btn-close-box" onClick={() => setSelectedJob(null)}>✕</button>
                  </div>
                  {jobApplied ? (
                    <div className="apply-success-state">
                      <div className="success-icon"><Check size={32} /></div>
                      <h4>Application Submitted!</h4>
                      <p>Thank you for your interest in Creatorly. Our hiring team reviews every application within 48 hours.</p>
                      <button type="button" className="btn-action-primary" onClick={() => setSelectedJob(null)}>
                        Done
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={(e) => { e.preventDefault(); setJobApplied(true); onShowToast('Application submitted successfully!'); }} className="apply-form-grid">
                      <div className="form-field">
                        <label>Your Full Name *</label>
                        <input type="text" required placeholder="Alex Sharma" />
                      </div>
                      <div className="form-field">
                        <label>Email Address *</label>
                        <input type="email" required placeholder="alex@gmail.com" />
                      </div>
                      <div className="form-field">
                        <label>Portfolio or GitHub Link *</label>
                        <input type="url" required placeholder="https://readcv.com/alex" />
                      </div>
                      <div className="form-field">
                        <label>Why Creatorly? (Brief note)</label>
                        <textarea rows={3} placeholder="Tell us why gentle, dignified creator commerce excites you..." />
                      </div>
                      <div className="apply-submit-row">
                        <button type="submit" className="btn-action-primary">
                          <span>Submit Application</span>
                          <Send size={15} />
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 7: Creator Fellowship                                */}
          {/* ========================================================= */}
          {currentSlug === 'creator-fellowship' && (
            <div className="page-section-block">
              <div className="editorial-header">
                <span className="editorial-eyebrow">
                  <span className="eyebrow-bullet">•</span> FELLOWSHIP / 12-WEEK INCUBATOR
                </span>
                <h1 className="editorial-title">
                  From promising storyteller to <span className="text-coral">independent media brand.</span>
                </h1>
                <p className="editorial-subtitle">
                  A 12-week intensive accelerator providing ₹5,00,000 equity-free grants, professional production gear, and 1-on-1 mentorship from India's top 1% creators.
                </p>
              </div>

              <div className="editorial-grid-2col">
                <div className="info-card">
                  <div className="info-card-icon"><Award size={24} className="text-coral" /></div>
                  <h3>₹5,00,000 Equity-Free Grant</h3>
                  <p>Direct non-dilutive capital to upgrade your studio lighting, camera lenses, and post-production editing machines.</p>
                </div>

                <div className="info-card">
                  <div className="info-card-icon"><Users size={24} className="text-teal" /></div>
                  <h3>1-on-1 Master Mentorship</h3>
                  <p>Weekly script reviews, pacing breakdowns, and thumbnail critique sessions with verified veteran creators.</p>
                </div>

                <div className="info-card">
                  <div className="info-card-icon"><Briefcase size={24} className="text-lime" /></div>
                  <h3>Guaranteed Brand Contracts</h3>
                  <p>Graduates are introduced directly to partner brands with pre-approved ₹10,00,000 in escrow collaboration commitments.</p>
                </div>

                <div className="info-card">
                  <div className="info-card-icon"><Sparkles size={24} className="text-coral" /></div>
                  <h3>Lifetime Creatorly Circle</h3>
                  <p>Exclusive access to our private creator mastermind, legal contract templates, and production studio discounts.</p>
                </div>
              </div>

              <div className="editorial-action-banner" style={{ marginTop: '36px' }}>
                <div>
                  <h3>Spring 2027 Cohort Applications Open</h3>
                  <p>12 fellows selected per cohort. Zero tuition fees, 100% creator equity retained.</p>
                </div>
                <button type="button" className="btn-action-primary" onClick={() => onNavigateToPage('apply-creator')}>
                  <span>Apply for Fellowship</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 8: Culture & Perks                                   */}
          {/* ========================================================= */}
          {currentSlug === 'culture-perks' && (
            <div className="page-section-block">
              <div className="editorial-header">
                <span className="editorial-eyebrow">
                  <span className="eyebrow-bullet">•</span> HOW WE WORK / CULTURE & PERKS
                </span>
                <h1 className="editorial-title">
                  Gentle by design. <span className="text-coral">Pro by execution.</span>
                </h1>
                <p className="editorial-subtitle">
                  We believe meaningful creative work happens in quiet, respectful environments. We respect your sleep, your weekends, and your craft.
                </p>
              </div>

              <div className="editorial-grid-3col">
                <div className="feature-block">
                  <Globe size={22} className="text-teal" />
                  <h4>100% Remote & Asynchronous</h4>
                  <p>Work from wherever you are happiest. We evaluate outcomes and clear writing, not hours seated in an office chair.</p>
                </div>

                <div className="feature-block">
                  <Laptop size={22} className="text-coral" />
                  <h4>₹1,50,000 Home Studio Stipend</h4>
                  <p>Every team member gets modern M-series MacBooks, 4K displays, Herman Miller seating, and acoustic gear.</p>
                </div>

                <div className="feature-block">
                  <HeartHandshake size={22} className="text-lime" />
                  <h4>Annual Team Summits</h4>
                  <p>Twice a year we gather for 5 days of thoughtful reflection, surfing, and great food (Goa, Bali, Lisbon).</p>
                </div>

                <div className="feature-block">
                  <ShieldCheck size={22} className="text-teal" />
                  <h4>Comprehensive Family Health</h4>
                  <p>100% premium coverage for you and your dependents, plus unlimited mental wellness counseling sessions.</p>
                </div>

                <div className="feature-block">
                  <Sparkles size={22} className="text-coral" />
                  <h4>Creator Sabbatical</h4>
                  <p>After 2 years with Creatorly, take a 1-month fully paid sabbatical to work on your own creative film or side project.</p>
                </div>

                <div className="feature-block">
                  <FileText size={22} className="text-lime" />
                  <h4>Transparent Salary Bands</h4>
                  <p>No awkward salary negotiations. Every level has published, market-top compensation bands and equity grants.</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 9: Engineering Blog                                  */}
          {/* ========================================================= */}
          {currentSlug === 'engineering-blog' && (
            <div className="page-section-block">
              <div className="editorial-header">
                <span className="editorial-eyebrow">
                  <span className="eyebrow-bullet">•</span> TECH & INFRASTRUCTURE / ENGINEERING BLOG
                </span>
                <h1 className="editorial-title">
                  Architecting trust <span className="text-coral">at scale.</span>
                </h1>
                <p className="editorial-subtitle">
                  Technical write-ups from our engineering team on distributed escrow state machines, sub-second social graph audits, and edge video performance.
                </p>
              </div>

              <div className="blog-posts-stack">
                <article className="blog-post-card">
                  <div className="blog-meta-row">
                    <span className="blog-tag">FinTech & Systems</span>
                    <span className="blog-date">October 14, 2026 • 8 min read</span>
                  </div>
                  <h2>Designing Zero-Fraud Escrow State Machines with Distributed Webhook Ingestion</h2>
                  <p>
                    When handling ₹14 Cr in multi-currency brand milestones, banking webhooks arrive out-of-order, duplicate, or delayed. Here is how we built idempotent transactional boundaries on top of Postgres advisory locks and banking trustee APIs.
                  </p>
                  <div className="code-snippet-box">
                    <pre>
                      <code>{`// Example: Milestone State Transition Guarantee
async function releaseMilestone(escrowId: string, stage: 'brief' | 'draft' | 'live') {
  return await db.transaction(async (tx) => {
    const escrow = await tx.escrow.findUniqueForUpdate({ where: { id: escrowId } });
    if (escrow.state !== 'FUNDED_LOCKED') throw new EscrowIllegalStateError();
    await trusteeBankApi.triggerPayout({ milestone: stage, amount: escrow.stageAllocations[stage] });
  });
}`}</code>
                    </pre>
                  </div>
                </article>

                <article className="blog-post-card">
                  <div className="blog-meta-row">
                    <span className="blog-tag">Forensics & Data</span>
                    <span className="blog-date">September 28, 2026 • 6 min read</span>
                  </div>
                  <h2>Auditing Ghost Followers: Identifying Sybil Bot Clusters via Meta Graph Edge Traversal</h2>
                  <p>
                    How our verification pipeline analyzes follower velocity gradients and comment entropy scores to reject synthetic engagement before brands spend a single rupee.
                  </p>
                </article>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 10: Brand Guidelines                                 */}
          {/* ========================================================= */}
          {currentSlug === 'brand-guidelines' && (
            <div className="page-section-block">
              <div className="editorial-header">
                <span className="editorial-eyebrow">
                  <span className="eyebrow-bullet">•</span> DESIGN SYSTEM / BRAND IDENTITY
                </span>
                <h1 className="editorial-title">
                  The Creatorly <span className="text-coral">visual language.</span>
                </h1>
                <p className="editorial-subtitle">
                  Warmth, restraint, and absolute precision. Guidelines on using our logo, typography, color tokens, and 4-dots motif.
                </p>
              </div>

              {/* Color Palette Swatches */}
              <h3 className="section-subheading">Color System (Click hex to copy)</h3>
              <div className="palette-grid">
                {[
                  { name: 'Warm Cream (Canvas)', hex: '#FAF8F5', textDark: true },
                  { name: 'Deep Charcoal (Ink)', hex: '#18191E', textDark: false },
                  { name: 'Accent Coral (Action)', hex: '#FF5B38', textDark: false },
                  { name: 'Accent Lime (Highlight)', hex: '#D4F754', textDark: true },
                  { name: 'Accent Teal (Verified)', hex: '#2DD4BF', textDark: true },
                  { name: 'Pure Snow (Surface)', hex: '#FFFFFF', textDark: true }
                ].map((color) => (
                  <div
                    key={color.hex}
                    className="color-swatch-box"
                    style={{ backgroundColor: color.hex, color: color.textDark ? '#18191E' : '#FFFFFF' }}
                    onClick={() => copyHex(color.hex)}
                  >
                    <span className="color-swatch-name">{color.name}</span>
                    <div className="color-hex-tag">
                      <span>{color.hex}</span>
                      <Copy size={13} />
                    </div>
                  </div>
                ))}
              </div>

              {/* 4-Dots Motif */}
              <div className="motif-guide-card">
                <div className="motif-display">
                  <div className="four-dots-large">
                    <span className="dot dot-green"></span>
                    <span className="dot dot-orange"></span>
                    <span className="dot dot-blue"></span>
                    <span className="dot dot-pink"></span>
                  </div>
                </div>
                <div className="motif-rules">
                  <h4>The 4-Dots Logo Motif</h4>
                  <p>
                    The four colored dots represent our four foundational disciplines: <strong>Green</strong> (Escrow Trust), <strong>Orange</strong> (Storytelling Impact), <strong>Blue</strong> (Verified Data), and <strong>Pink</strong> (Creative Autonomy).
                  </p>
                  <ul>
                    <li>Always maintain equal 3px spacing between dots.</li>
                    <li>Never skew, rotate, or alter the color order.</li>
                    <li>Always pair with our lowercase wordmark: <code>creatorly.</code></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 11: Contact Creator                                  */}
          {/* ========================================================= */}
          {currentSlug === 'contact-creator' && (
            <div className="page-section-block">
              <div className="editorial-header">
                <span className="editorial-eyebrow">
                  <span className="eyebrow-bullet">•</span> DIRECT OUTREACH / CREATOR INQUIRY
                </span>
                <h1 className="editorial-title">
                  Start a direct <span className="text-coral">creator conversation.</span>
                </h1>
                <p className="editorial-subtitle">
                  Send a verified brief to any creator on the platform. Your message lands directly in the creator's pipeline with guaranteed &lt; 2-hour response times.
                </p>
              </div>

              <div className="editorial-grid-2col">
                <div className="contact-form-container">
                  {contactSubmitted ? (
                    <div className="apply-success-state">
                      <div className="success-icon"><Check size={32} /></div>
                      <h4>Inquiry Dispatched!</h4>
                      <p>Your campaign brief has been routed directly to the creator's inbox. You will receive an email confirmation and tracker link within 2 hours.</p>
                      <button type="button" className="btn-action-primary" onClick={() => setContactSubmitted(false)}>
                        Send Another Inquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={(e) => { e.preventDefault(); setContactSubmitted(true); onShowToast('Inquiry sent directly to creator!'); }} className="apply-form-grid">
                      <div className="form-field">
                        <label>Select Creator *</label>
                        <select 
                          value={contactCreatorId} 
                          onChange={(e) => setContactCreatorId(e.target.value)}
                          className="form-select-creator"
                        >
                          {creators.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.fullName} — {c.primaryNiche} ({c.handle})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-field">
                        <label>Your Brand / Agency Name *</label>
                        <input type="text" required placeholder="Notion, Zepto, or Linear" />
                      </div>

                      <div className="form-field">
                        <label>Work Email Address *</label>
                        <input type="email" required placeholder="collaborations@brand.com" />
                      </div>

                      <div className="form-field">
                        <label>Campaign Objective & Deliverables *</label>
                        <textarea rows={4} required placeholder="We want to sponsor a 60s YouTube integration reviewing our new developer feature in mid-November..." />
                      </div>

                      <div className="form-field">
                        <label>Estimated Budget ({currentCurrency})</label>
                        <input type="number" placeholder="50000" defaultValue="50000" />
                      </div>

                      <button type="submit" className="btn-action-primary">
                        <span>Send Direct Brief</span>
                        <Send size={15} />
                      </button>
                    </form>
                  )}
                </div>

                <div className="contact-sidebar-guarantees">
                  <div className="info-card">
                    <h4>Direct Creator Response</h4>
                    <p>No intermediaries, talent agencies taking cuts, or ignored emails. Creators receive notification directly on their mobile device.</p>
                  </div>

                  <div className="info-card">
                    <h4>Protected Collaboration</h4>
                    <p>When you agree on deliverables, your project converts automatically into an escrow milestone contract with zero paperwork.</p>
                  </div>

                  <div className="info-card">
                    <h4>Need Multi-Creator Matching?</h4>
                    <p>Hiring for a launch involving 5+ creators? Use our dedicated campaign builder instead.</p>
                    <button type="button" className="btn-subtle-link" onClick={() => onNavigateToPage('hire-campaign')}>
                      <span>Open Multi-Creator Campaign Builder →</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 12: Hire for Campaign                                */}
          {/* ========================================================= */}
          {currentSlug === 'hire-campaign' && (
            <div className="page-section-block">
              <div className="editorial-header">
                <span className="editorial-eyebrow">
                  <span className="eyebrow-bullet">•</span> CAMPAIGN BUILDER / SMART MATCHING
                </span>
                <h1 className="editorial-title">
                  Hire verified creators for your <span className="text-coral">product launch.</span>
                </h1>
                <p className="editorial-subtitle">
                  Configure your target audience, deliverables, and timeline. Creatorly auto-matches you with vetted storytellers ready to start production.
                </p>
              </div>

              {/* Interactive Multi-Creator Matcher */}
              <div className="campaign-builder-box">
                <h3 className="section-subheading">1. Select Target Niche</h3>
                <div className="niche-selector-pills">
                  {['Tech & Dev Tools', 'AI & Automation', 'Design & Aesthetics', 'Fitness & Health', 'Food & Lifestyle', 'Finance & Investing'].map((niche, idx) => (
                    <button
                      key={niche}
                      type="button"
                      className={`niche-select-btn ${idx === 0 ? 'selected' : ''}`}
                    >
                      {niche}
                    </button>
                  ))}
                </div>

                <h3 className="section-subheading" style={{ marginTop: '28px' }}>2. Desired Deliverables</h3>
                <div className="deliverables-checklist-grid">
                  {[
                    { label: 'Dedicated 8-12 min Video Review', sub: 'In-depth workflow & product teardown' },
                    { label: '60s Integrated Sponsor Segment', sub: 'High retention hook in prime tutorial' },
                    { label: 'Instagram Reel / YouTube Short', sub: 'Vertical format for rapid discovery' },
                    { label: '90-Day Paid Ads Whitelisting', sub: 'Permission to run dark ads via creator handle' }
                  ].map((deliv, dIdx) => (
                    <label key={dIdx} className="deliverable-check-card">
                      <input type="checkbox" defaultChecked={dIdx === 1} />
                      <div>
                        <strong>{deliv.label}</strong>
                        <span>{deliv.sub}</span>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="campaign-submit-footer">
                  <div>
                    <h4>Estimated Budget: ₹75,000 – ₹1,50,000</h4>
                    <p>Includes bank-grade escrow protection and 2 guaranteed revision rounds.</p>
                  </div>
                  <button
                    type="button"
                    className="btn-action-primary"
                    onClick={() => {
                      onShowToast('Campaign draft saved! Connecting you to creators...');
                      onNavigateToPage('all-creators');
                    }}
                  >
                    <span>Match with Creators</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 13: Support & Help Desk                              */}
          {/* ========================================================= */}
          {currentSlug === 'support-help' && (
            <div className="page-section-block">
              <div className="editorial-header">
                <span className="editorial-eyebrow">
                  <span className="eyebrow-bullet">•</span> SUPPORT & HELP DESK / 24/7 ASSISTANCE
                </span>
                <h1 className="editorial-title">
                  How can our support team <span className="text-coral">assist you today?</span>
                </h1>
                <p className="editorial-subtitle">
                  Average ticket resolution time: 42 minutes. Dedicated escrow officers and creator relationship specialists standing by.
                </p>
              </div>

              {/* FAQ Search */}
              <div className="faq-search-box">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search FAQ: escrow refund, revision limits, GST invoices, API verification..."
                  value={supportFaqSearch}
                  onChange={(e) => setSupportFaqSearch(e.target.value)}
                />
              </div>

              {/* Accordion FAQs */}
              <div className="faq-accordion-list">
                {[
                  {
                    q: 'How does Creatorly milestone escrow guarantee payment security?',
                    a: 'Brands deposit funds into an ICICI/HDFC trustee escrow account before production starts. The creator knows the money is real and reserved. Funds only release to the creator when both parties approve the completed milestone.'
                  },
                  {
                    q: 'What happens if a creator misses a deadline or is unresponsive?',
                    a: 'If a creator fails to reply within the 48-hour SLA or misses an agreed milestone deadline, Creatorly escrow officers initiate a full refund back to the brand account with zero penalty fees.'
                  },
                  {
                    q: 'Can brands run paid ads with creator content (whitelisting)?',
                    a: 'Yes. Whitelisting / Spark Ads permission can be selected as a package deliverable. It grants the brand advertising rights to run Meta/YouTube ads through the creator\'s account for 30, 60, or 90 days.'
                  },
                  {
                    q: 'How does Creatorly verify that creator metrics are real?',
                    a: 'Creators authenticate directly using official Meta Graph and Google YouTube Analytics OAuth. We pull verified 30-day views, authentic human audience ratios, and engagement velocity directly from the source APIs.'
                  },
                  {
                    q: 'Does Creatorly handle GST invoices and TDS tax compliance?',
                    a: 'Yes. Automated GST-compliant invoices and formal TDS deduction certificates are generated for every completed milestone, ensuring smooth finance compliance for enterprise brands.'
                  }
                ]
                  .filter((item) => item.q.toLowerCase().includes(supportFaqSearch.toLowerCase()) || item.a.toLowerCase().includes(supportFaqSearch.toLowerCase()))
                  .map((faq, idx) => (
                    <div key={idx} className="faq-item-card">
                      <button
                        type="button"
                        className="faq-question-btn"
                        onClick={() => setExpandedFaqIndex(expandedFaqIndex === idx ? null : idx)}
                      >
                        <span>{faq.q}</span>
                        <ChevronRight size={18} className={`faq-chevron ${expandedFaqIndex === idx ? 'rotated' : ''}`} />
                      </button>
                      {expandedFaqIndex === idx && (
                        <div className="faq-answer-body">
                          <p>{faq.a}</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              {/* Submit Support Ticket Card */}
              <div className="support-ticket-card">
                <h3>Still need help? Open a direct support ticket</h3>
                <p>Our concierge response team responds in under an hour during business hours.</p>

                {supportTicketSubmitted ? (
                  <div className="apply-success-state">
                    <div className="success-icon"><Check size={28} /></div>
                    <h4>Support Ticket #CR-8491 Created</h4>
                    <p>A confirmation email has been dispatched. An escrow concierge is reviewing your request.</p>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setSupportTicketSubmitted(true); onShowToast('Support ticket #CR-8491 opened!'); }} className="apply-form-grid" style={{ marginTop: '20px' }}>
                    <div className="form-field">
                      <label>Your Name & Email *</label>
                      <input type="text" required placeholder="Priya Sharma (priya@brand.com)" />
                    </div>
                    <div className="form-field">
                      <label>Issue Topic</label>
                      <select>
                        <option>Escrow Payment & Milestone Release</option>
                        <option>Creator Communication / SLA</option>
                        <option>GST & Tax Invoice Inquiries</option>
                        <option>Account Verification</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label>Describe your question or deal reference</label>
                      <textarea rows={3} required placeholder="Referencing campaign #REF-2026..." />
                    </div>
                    <button type="submit" className="btn-action-primary">
                      <span>Submit Concierge Ticket</span>
                      <Send size={14} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 14: Agency Partnerships                              */}
          {/* ========================================================= */}
          {currentSlug === 'agency-partnerships' && (
            <div className="page-section-block">
              <div className="editorial-header">
                <span className="editorial-eyebrow">
                  <span className="eyebrow-bullet">•</span> ENTERPRISE & AGENTS / MULTI-CLIENT SUITE
                </span>
                <h1 className="editorial-title">
                  Scale creator campaigns for <span className="text-coral">all your clients.</span>
                </h1>
                <p className="editorial-subtitle">
                  Manage multiple brand accounts, execute bulk creator rosters with master billing, and get dedicated human escrow support.
                </p>
              </div>

              <div className="editorial-grid-3col">
                <div className="feature-block">
                  <Users size={22} className="text-coral" />
                  <h4>Master Escrow Account</h4>
                  <p>Fund multi-creator campaigns from a single centralized agency deposit, with itemized sub-client invoices.</p>
                </div>

                <div className="feature-block">
                  <FileText size={22} className="text-teal" />
                  <h4>White-Label Client Dashboards</h4>
                  <p>Send branded live links to your clients to approve scripts, view video cuts, and track ROI without mentioning Creatorly.</p>
                </div>

                <div className="feature-block">
                  <DollarSign size={22} className="text-lime" />
                  <h4>Volume Fee Discounts</h4>
                  <p>Tiered platform fees dropping from 5% to 1.5% for agencies executing over ₹25 Lakhs per quarter.</p>
                </div>
              </div>

              {/* Book Agency Consultation */}
              <div className="agency-booking-card">
                <div>
                  <h3>Schedule a 20-min Agency Suite Demo</h3>
                  <p>Learn how top agencies like Dentsu, Schbang, and Ogilvy streamline creator payments through Creatorly.</p>
                </div>
                {agencyDemoBooked ? (
                  <span className="badge-demo-booked">✓ Demo Request Received! We will email you invite links.</span>
                ) : (
                  <button type="button" className="btn-action-primary" onClick={() => { setAgencyDemoBooked(true); onShowToast('Agency demo booked! Check your calendar invite.'); }}>
                    <span>Book Agency Demo</span>
                    <ArrowRight size={15} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 15: Discord Community                                */}
          {/* ========================================================= */}
          {currentSlug === 'discord-community' && (
            <div className="page-section-block">
              <div className="editorial-header">
                <span className="editorial-eyebrow">
                  <span className="eyebrow-bullet">•</span> CREATORLY CIRCLE / 4,800+ MEMBERS
                </span>
                <h1 className="editorial-title">
                  The private sanctuary for <span className="text-coral">serious creators & marketers.</span>
                </h1>
                <p className="editorial-subtitle">
                  Share raw rate cards, get candid script feedback, discover confidential brand sponsorship leads, and talk shop with peers.
                </p>
              </div>

              {/* Channels Preview */}
              <div className="discord-preview-card">
                <div className="discord-header-row">
                  <div className="discord-server-badge">
                    <span className="server-icon">✦</span>
                    <div>
                      <h4>Creatorly Circle Discord</h4>
                      <span>4,824 Members • 642 Online Now</span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="btn-discord-join"
                    onClick={() => onShowToast('Opening Creatorly Discord Invite...')}
                  >
                    <span>Join Server</span>
                    <ExternalLink size={14} />
                  </button>
                </div>

                <div className="discord-channels-grid">
                  <div className="channel-box">
                    <span className="channel-name">#brand-leads</span>
                    <p>Verified brands post active briefs seeking creators with budgets attached.</p>
                  </div>
                  <div className="channel-box">
                    <span className="channel-name">#rate-card-transparency</span>
                    <p>Anonymous discussions on what to charge for tech reviews, reels, and whitelisting.</p>
                  </div>
                  <div className="channel-box">
                    <span className="channel-name">#script-and-hook-critique</span>
                    <p>Get constructive feedback on opening 5 seconds of your video before shooting.</p>
                  </div>
                  <div className="channel-box">
                    <span className="channel-name">#gear-and-studio-acoustics</span>
                    <p>Microphone recommendations, lighting hacks, and LUTs shared by veteran creators.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 16: All Creators Directory                           */}
          {/* ========================================================= */}
          {currentSlug === 'all-creators' && (
            <div className="page-section-block">
              <div className="editorial-header">
                <span className="editorial-eyebrow">
                  <span className="eyebrow-bullet">•</span> VERIFIED CREATOR ROSTER ({creators.length} CREATORS)
                </span>
                <h1 className="editorial-title">
                  Explore all verified <span className="text-coral">creator storefronts.</span>
                </h1>
                <p className="editorial-subtitle">
                  Every creator on this roster has verified Meta/YouTube API metrics, published milestone rate cards, and transparent deliverables.
                </p>
              </div>

              {/* Niche Filter Pills */}
              <div className="roster-filter-pills">
                {['All', 'Tech & AI', 'Fashion & Style', 'Fitness & Health', 'Food & Cooking', 'Travel & Lifestyle', 'Finance'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`filter-pill-btn ${creatorDirectoryCategory === cat ? 'active' : ''}`}
                    onClick={() => setCreatorDirectoryCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Creator Cards Grid */}
              <div className="roster-grid">
                {creators
                  .filter((c) => {
                    if (creatorDirectoryCategory === 'All') return true;
                    if (creatorDirectoryCategory === 'Tech & AI') return c.primaryNiche.toLowerCase().includes('tech') || c.primaryNiche.toLowerCase().includes('dev') || c.primaryNiche.toLowerCase().includes('edu');
                    if (creatorDirectoryCategory === 'Fashion & Style') return c.primaryNiche.toLowerCase().includes('fashion') || c.primaryNiche.toLowerCase().includes('style');
                    if (creatorDirectoryCategory === 'Fitness & Health') return c.primaryNiche.toLowerCase().includes('fit') || c.primaryNiche.toLowerCase().includes('health');
                    if (creatorDirectoryCategory === 'Food & Cooking') return c.primaryNiche.toLowerCase().includes('food') || c.primaryNiche.toLowerCase().includes('culinary');
                    if (creatorDirectoryCategory === 'Travel & Lifestyle') return c.primaryNiche.toLowerCase().includes('travel') || c.primaryNiche.toLowerCase().includes('documentary');
                    if (creatorDirectoryCategory === 'Finance') return c.primaryNiche.toLowerCase().includes('fin');
                    return true;
                  })
                  .map((creator) => (
                    <div 
                      key={creator.id} 
                      className="creator-roster-card"
                      onClick={() => {
                        onSelectCreator(creator);
                        onReturnToHome();
                        onShowToast(`Viewing ${creator.fullName}'s verified profile`);
                      }}
                    >
                      <div className="creator-card-img-wrap">
                        <img src={creator.profileImage} alt={creator.fullName} />
                        <span className="card-badge-verified">✓ Verified</span>
                      </div>
                      <div className="creator-card-info">
                        <div className="card-name-row">
                          <h4>{creator.fullName}</h4>
                          <ArrowUpRight size={16} />
                        </div>
                        <span className="card-handle">{creator.handle}</span>
                        <span className="card-niche-tag">{creator.primaryNiche}</span>
                        
                        <div className="card-metrics-row">
                          <div>
                            <span className="metric-title">Reach</span>
                            <strong>{creator.totalReach}</strong>
                          </div>
                          <div>
                            <span className="metric-title">Eng. Rate</span>
                            <strong className="text-teal">{creator.engagementRate}%</strong>
                          </div>
                          <div>
                            <span className="metric-title">Starting</span>
                            <strong>₹{creator.packages[0]?.priceINR ? (creator.packages[0].priceINR / 1000).toFixed(0) + 'k' : '3k'}</strong>
                          </div>
                        </div>

                        <button type="button" className="btn-card-book">
                          <span>View Profile & Rate Card</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 17: Technology & AI                                  */}
          {/* ========================================================= */}
          {currentSlug === 'tech-ai-creators' && (
            <div className="page-section-block">
              <div className="editorial-header">
                <span className="editorial-eyebrow">
                  <span className="eyebrow-bullet">•</span> CATEGORY FOCUS / TECHNOLOGY & AI
                </span>
                <h1 className="editorial-title">
                  Storytellers who make technology <span className="text-coral">feel effortless.</span>
                </h1>
                <p className="editorial-subtitle">
                  From deep-dive AI workflow breakdowns to hands-on developer benchmarks, reach tech leaders and builders through authentic voices.
                </p>
              </div>

              <div className="roster-grid">
                {creators
                  .filter((c) => c.primaryNiche.toLowerCase().includes('tech') || c.primaryNiche.toLowerCase().includes('edu') || c.id === 'cr_alex_sharma')
                  .map((creator) => (
                    <div 
                      key={creator.id} 
                      className="creator-roster-card"
                      onClick={() => {
                        onSelectCreator(creator);
                        onReturnToHome();
                        onShowToast(`Viewing ${creator.fullName}`);
                      }}
                    >
                      <div className="creator-card-img-wrap">
                        <img src={creator.profileImage} alt={creator.fullName} />
                        <span className="card-badge-verified">✓ Tech Verified</span>
                      </div>
                      <div className="creator-card-info">
                        <h4>{creator.fullName}</h4>
                        <span className="card-handle">{creator.handle}</span>
                        <p className="card-bio-short">{creator.bio}</p>
                        <button type="button" className="btn-card-book">
                          <span>View Tech Rate Card →</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 18: SaaS & Dev Tools                                 */}
          {/* ========================================================= */}
          {currentSlug === 'saas-devtools-creators' && (
            <div className="page-section-block">
              <div className="editorial-header">
                <span className="editorial-eyebrow">
                  <span className="eyebrow-bullet">•</span> B2B & SOFTWARE / SAAS & DEV TOOLS
                </span>
                <h1 className="editorial-title">
                  Reach real software engineers & <span className="text-coral">engineering decision makers.</span>
                </h1>
                <p className="editorial-subtitle">
                  Developers don't click enterprise banner ads. They watch trusted creators code in real IDEs, configure CLIs, and build real applications.
                </p>
              </div>

              <div className="editorial-grid-2col">
                <div className="info-card">
                  <Code2 size={24} className="text-teal" />
                  <h3>Hands-on Code Walkthroughs</h3>
                  <p>Creators build actual production samples integrating your API or SDK, demonstrating real developer velocity.</p>
                </div>
                <div className="info-card">
                  <Laptop size={24} className="text-coral" />
                  <h3>CLI & Terminal Tutorials</h3>
                  <p>Authentic screencasts showcasing tool installations, configuration flags, and performance benchmarks.</p>
                </div>
              </div>

              <div className="editorial-action-banner" style={{ marginTop: '36px' }}>
                <div>
                  <h3>Want to launch a DevTool campaign with 3+ creators?</h3>
                  <p>We match you with verified developer educators and manage escrow deliverables.</p>
                </div>
                <button type="button" className="btn-action-primary" onClick={() => onNavigateToPage('hire-campaign')}>
                  <span>Launch SaaS Campaign</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 19: Consumer Tech                                    */}
          {/* ========================================================= */}
          {currentSlug === 'consumer-tech-creators' && (
            <div className="page-section-block">
              <div className="editorial-header">
                <span className="editorial-eyebrow">
                  <span className="eyebrow-bullet">•</span> HARDWARE & GADGETS / CONSUMER TECH
                </span>
                <h1 className="editorial-title">
                  Cameras, mechanical keyboards & <span className="text-coral">desk setups.</span>
                </h1>
                <p className="editorial-subtitle">
                  Visual craft that stops scrolling thumbs. Unboxing reels, long-term durability assessments, and cinematic product b-roll.
                </p>
              </div>

              <div className="editorial-grid-3col">
                <div className="feature-block">
                  <Smartphone size={22} className="text-coral" />
                  <h4>Cinematic 4K B-Roll</h4>
                  <p>Immaculate macro product shots, motorized sliders, and studio lighting that elevates your industrial design.</p>
                </div>
                <div className="feature-block">
                  <Star size={22} className="text-lime" />
                  <h4>Honest 30-Day Testing</h4>
                  <p>Audiences trust these reviews because creators provide balanced, insightful perspectives on real day-to-day usability.</p>
                </div>
                <div className="feature-block">
                  <Award size={22} className="text-teal" />
                  <h4>Verified Purchase Intent</h4>
                  <p>Our consumer tech creators drive an average 4.8% direct link click-through rate to product landing pages.</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 20: Apply as a Creator                               */}
          {/* ========================================================= */}
          {currentSlug === 'apply-creator' && (
            <div className="page-section-block">
              <div className="editorial-header">
                <span className="editorial-eyebrow">
                  <span className="eyebrow-bullet">•</span> CREATOR ADMISSIONS / JOIN CREATORLY
                </span>
                <h1 className="editorial-title">
                  Monetize your craft with <span className="text-coral">dignity and protection.</span>
                </h1>
                <p className="editorial-subtitle">
                  Keep 100% of your rate card. Never chase another invoice. Join the hand-curated roster of creators backed by milestone escrow.
                </p>
              </div>

              <div className="creator-apply-container">
                {creatorApplicationSubmitted ? (
                  <div className="apply-success-state">
                    <div className="success-icon"><Check size={36} /></div>
                    <h3>Application Submitted!</h3>
                    <p>Our admissions committee reviews creator applications every Tuesday and Friday. We will review your channel and reach out via email.</p>
                    <button type="button" className="btn-action-primary" onClick={onReturnToHome}>
                      Return to Storefront
                    </button>
                  </div>
                ) : (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      setCreatorApplicationSubmitted(true);
                      onShowToast('Creator application submitted! Good luck!');
                    }} 
                    className="apply-form-grid"
                  >
                    <div className="form-field">
                      <label>Full Legal Name *</label>
                      <input type="text" required placeholder="Alex Sharma" />
                    </div>

                    <div className="form-field">
                      <label>Channel or Profile Handle *</label>
                      <input type="text" required placeholder="@alexbuilds (YouTube / Instagram)" />
                    </div>

                    <div className="form-field">
                      <label>Email Address *</label>
                      <input type="email" required placeholder="alex@gmail.com" />
                    </div>

                    <div className="form-field">
                      <label>Primary Content Category *</label>
                      <select required>
                        <option>Technology & AI</option>
                        <option>Developer Tools & SaaS</option>
                        <option>Consumer Tech & Gadgets</option>
                        <option>Fashion & Personal Style</option>
                        <option>Fitness & Health</option>
                        <option>Food & Culinary</option>
                        <option>Travel & Documentary</option>
                        <option>Finance & Investing</option>
                      </select>
                    </div>

                    <div className="form-field">
                      <label>Primary Channel URL *</label>
                      <input type="url" required placeholder="https://youtube.com/@alexbuilds" />
                    </div>

                    <div className="form-field">
                      <label>Approximate Average Views per Video</label>
                      <input type="text" placeholder="e.g. 45,000" />
                    </div>

                    <div className="form-field">
                      <label>Starting Sponsorship Fee Target ({currentCurrency})</label>
                      <input type="number" placeholder="25000" />
                    </div>

                    <div className="form-field">
                      <label>Briefly describe your editorial philosophy</label>
                      <textarea rows={3} placeholder="Tell us how you approach sponsorships and why your audience trusts you..." />
                    </div>

                    <button type="submit" className="btn-action-primary btn-block">
                      <span>Submit Creator Application</span>
                      <Send size={16} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          4. GLOBAL FOOTER (Present on all pages for seamless hopping)
      ────────────────────────────────────────────────────────────── */}
      <footer className="info-footer">
        <div className="fresh-content-container">
          <div className="info-footer-grid">
            {/* Brand Column */}
            <div className="footer-col-brand">
              <button 
                type="button" 
                className="footer-brand-btn"
                onClick={onReturnToHome}
              >
                <CreatorlyLogo width={28} height={22} />
                <span className="footer-brand-text">creatorly.</span>
              </button>
              <p className="footer-brand-tagline">
                The global marketplace connecting visionary brands with audited creators. Bank-grade milestone escrow.
              </p>
              <div className="footer-status-pill">
                <span className="live-status-dot"></span>
                <span>All Systems Operational</span>
              </div>
            </div>

            {/* About Column */}
            <div className="footer-nav-col">
              <h4>ABOUT</h4>
              <ul>
                {categoryLinks.about.map((link) => (
                  <li key={link.slug}>
                    <button 
                      type="button" 
                      className={currentSlug === link.slug ? 'active-link' : ''}
                      onClick={() => onNavigateToPage(link.slug)}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Careers Column */}
            <div className="footer-nav-col">
              <h4>
                CAREERS <span className="hiring-tag">We're hiring</span>
              </h4>
              <ul>
                {categoryLinks.careers.map((link) => (
                  <li key={link.slug}>
                    <button 
                      type="button" 
                      className={currentSlug === link.slug ? 'active-link' : ''}
                      onClick={() => onNavigateToPage(link.slug)}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect Column */}
            <div className="footer-nav-col">
              <h4>CONNECT</h4>
              <ul>
                {categoryLinks.connect.map((link) => (
                  <li key={link.slug}>
                    <button 
                      type="button" 
                      className={currentSlug === link.slug ? 'active-link' : ''}
                      onClick={() => onNavigateToPage(link.slug)}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Discover & Visit Column */}
            <div className="footer-nav-col">
              <h4>DISCOVER & VISIT</h4>
              <ul>
                {categoryLinks.discover.map((link) => (
                  <li key={link.slug}>
                    <button 
                      type="button" 
                      className={currentSlug === link.slug ? 'active-link' : ''}
                      onClick={() => onNavigateToPage(link.slug)}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="info-footer-bottom">
            <span>© 2026 Creatorly Technologies Inc. All rights reserved.</span>
            <div className="footer-bottom-links">
              <button type="button" onClick={() => onNavigateToPage('creator-standards')}>Terms of Service</button>
              <button type="button" onClick={() => onNavigateToPage('how-escrow-works')}>Privacy Policy</button>
              <button type="button" onClick={() => onNavigateToPage('verification-protocol')}>Security Protocol</button>
            </div>
          </div>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          5. EMBEDDED DESIGN SYSTEM STYLES (Matching First Page)
      ────────────────────────────────────────────────────────────── */}
      <style>{`
        .marketplace-info-page {
          background-color: #FAF8F5;
          color: #18191E;
          font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          min-height: 100vh;
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
          box-sizing: border-box;
        }

        .fresh-content-container {
          width: 100%;
          max-width: 1380px;
          margin: 0 auto;
          padding-left: clamp(20px, 3.5vw, 48px);
          padding-right: clamp(20px, 3.5vw, 48px);
          box-sizing: border-box;
        }

        /* Top Nav */
        .info-top-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #FAF8F5;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          backdrop-filter: blur(12px);
          padding: 14px 0;
        }

        .info-nav-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .info-nav-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-info-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .info-logo-text {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #18191E;
        }

        .info-nav-divider {
          color: #D1D5DB;
          font-weight: 300;
        }

        .info-breadcrumb-category {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #71717A;
        }

        .info-breadcrumb-current {
          font-size: 0.85rem;
          font-weight: 600;
          color: #18191E;
        }

        .info-nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-back-storefront {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #FFFFFF;
          border: 1px solid #E5E1D8;
          padding: 8px 16px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #3F3F46;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-back-storefront:hover {
          background: #F4EFE6;
          color: #18191E;
        }

        .btn-cta-nav {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #18191E;
          color: #FFFFFF;
          border: none;
          padding: 8px 18px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .btn-cta-nav:hover {
          background: #000000;
        }

        /* Subnav Section */
        .info-subnav-section {
          background: #F4EFE6;
          border-bottom: 1px solid #E5DEC9;
          padding: 12px 0;
        }

        .info-subnav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
        }

        .subnav-pill-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        .subnav-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #FFFFFF;
          border: 1px solid #E5E1D8;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #52525B;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .subnav-pill:hover {
          border-color: #18191E;
          color: #18191E;
        }

        .subnav-pill.active {
          background: #18191E;
          border-color: #18191E;
          color: #FFFFFF;
        }

        .subnav-badge {
          background: #FF5B38;
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 9999px;
          text-transform: uppercase;
        }

        .quick-category-links {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .quick-cat-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #71717A;
          text-transform: uppercase;
          margin-right: 4px;
        }

        .quick-cat-btn {
          background: none;
          border: none;
          font-size: 0.78rem;
          font-weight: 600;
          color: #71717A;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: all 0.15s ease;
        }

        .quick-cat-btn:hover {
          color: #18191E;
          background: rgba(0,0,0,0.04);
        }

        .quick-cat-btn.active {
          color: #18191E;
          font-weight: 800;
        }

        /* Main Editorial Content */
        .info-main-content {
          padding: 64px 0 96px;
        }

        .editorial-header {
          margin-bottom: 48px;
        }

        .editorial-eyebrow {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #5C616E;
          margin-bottom: 12px;
        }

        .eyebrow-bullet {
          color: #FF5B38;
          font-size: 1.2rem;
          margin-right: 4px;
        }

        .editorial-title {
          font-size: clamp(2.2rem, 4.5vw, 3.8rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1.08;
          color: #18191E;
          margin: 0 0 20px;
        }

        .editorial-subtitle {
          font-size: clamp(1.05rem, 1.4vw, 1.25rem);
          line-height: 1.6;
          color: #52525B;
          max-width: 820px;
          margin: 0;
        }

        .text-coral { color: #FF5B38; }
        .text-teal { color: #2DD4BF; }
        .text-lime { color: #84CC16; }

        /* Metrics Strip */
        .metrics-strip-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 48px;
        }

        @media (max-width: 900px) {
          .metrics-strip-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 500px) {
          .metrics-strip-grid {
            grid-template-columns: 1fr;
          }
        }

        .metric-box {
          background: #FFFFFF;
          border: 1px solid #EAE6DF;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }

        .metric-number {
          font-size: 2.2rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          color: #18191E;
        }

        .metric-label {
          font-size: 0.95rem;
          font-weight: 700;
          color: #18191E;
        }

        .metric-sub {
          font-size: 0.78rem;
          color: #71717A;
        }

        /* Editorial Grids */
        .editorial-grid-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 48px;
        }

        @media (max-width: 860px) {
          .editorial-grid-2col {
            grid-template-columns: 1fr;
          }
        }

        .editorial-grid-3col {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 48px;
        }

        @media (max-width: 960px) {
          .editorial-grid-3col {
            grid-template-columns: 1fr;
          }
        }

        .info-card {
          background: #FFFFFF;
          border: 1px solid #EAE6DF;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.03);
        }

        .info-card-icon {
          margin-bottom: 16px;
        }

        .info-card h3, .info-card h4 {
          font-size: 1.25rem;
          font-weight: 800;
          color: #18191E;
          margin: 0 0 10px;
          letter-spacing: -0.02em;
        }

        .info-card p {
          font-size: 0.95rem;
          color: #52525B;
          line-height: 1.6;
          margin: 0;
        }

        .feature-block {
          background: #FFFFFF;
          border: 1px solid #EAE6DF;
          border-radius: 16px;
          padding: 24px;
        }

        .feature-block h4 {
          font-size: 1.1rem;
          font-weight: 800;
          margin: 14px 0 8px;
          color: #18191E;
        }

        .feature-block p {
          font-size: 0.88rem;
          color: #64748B;
          line-height: 1.55;
          margin: 0;
        }

        .step-tag {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          color: #FF5B38;
          background: rgba(255, 91, 56, 0.08);
          padding: 2px 8px;
          border-radius: 6px;
        }

        /* Action Banner */
        .editorial-action-banner {
          background: #18191E;
          color: #FFFFFF;
          border-radius: 24px;
          padding: 40px clamp(24px, 4vw, 48px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
        }

        .editorial-action-banner h3 {
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0 0 6px;
          color: #FFFFFF;
        }

        .editorial-action-banner p {
          margin: 0;
          color: #94A3B8;
          font-size: 0.95rem;
        }

        .btn-action-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #FF5B38;
          color: #FFFFFF;
          border: none;
          padding: 14px 28px;
          border-radius: 12px;
          font-size: 0.92rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.15s ease;
        }

        .btn-action-primary:hover {
          background: #e04825;
          transform: translateY(-1px);
        }

        .btn-subtle-link {
          background: none;
          border: none;
          color: #FF5B38;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          padding: 8px 0 0;
          display: inline-block;
        }

        /* Escrow Simulator */
        .escrow-simulator-card {
          background: #FFFFFF;
          border: 1px solid #EAE6DF;
          border-radius: 24px;
          padding: 36px;
          margin-bottom: 48px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
        }

        .sim-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 24px;
        }

        .sim-header h4 {
          font-size: 1.35rem;
          font-weight: 800;
          margin: 0 0 4px;
        }

        .sim-header p {
          font-size: 0.9rem;
          color: #71717A;
          margin: 0;
        }

        .budget-preset-pills {
          display: flex;
          gap: 8px;
        }

        .preset-btn {
          background: #FAF8F5;
          border: 1px solid #E5E1D8;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #27272A;
          cursor: pointer;
        }

        .preset-btn.active {
          background: #18191E;
          color: #FFFFFF;
          border-color: #18191E;
        }

        .sim-slider-row {
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sim-slider-row label {
          font-size: 1.1rem;
          color: #18191E;
        }

        .budget-slider {
          width: 100%;
          accent-color: #FF5B38;
          cursor: pointer;
        }

        .milestone-stages-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        @media (max-width: 800px) {
          .milestone-stages-grid {
            grid-template-columns: 1fr;
          }
        }

        .stage-box {
          background: #FAF8F5;
          border: 1px solid #EAE6DF;
          border-radius: 16px;
          padding: 24px;
          position: relative;
        }

        .stage-num {
          font-size: 0.85rem;
          font-weight: 900;
          color: #A1A1AA;
          margin-bottom: 6px;
        }

        .stage-pct {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 800;
          color: #FF5B38;
          background: rgba(255, 91, 56, 0.08);
          padding: 2px 8px;
          border-radius: 6px;
          margin-bottom: 12px;
        }

        .stage-box h5 {
          font-size: 1.05rem;
          font-weight: 800;
          color: #18191E;
          margin: 0 0 6px;
        }

        .stage-box p {
          font-size: 0.85rem;
          color: #52525B;
          line-height: 1.5;
          margin: 0 0 16px;
        }

        .stage-amount {
          font-size: 1.4rem;
          font-weight: 900;
          color: #18191E;
        }

        /* Audit Inspector Card */
        .audit-inspector-card {
          background: #FFFFFF;
          border: 1px solid #EAE6DF;
          border-radius: 24px;
          padding: 32px;
          margin-bottom: 48px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
        }

        .inspector-top h4 {
          font-size: 1.35rem;
          font-weight: 800;
          margin: 0 0 4px;
        }

        .inspector-top p {
          font-size: 0.9rem;
          color: #71717A;
          margin: 0 0 16px;
        }

        .creator-select-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 24px;
        }

        .creator-tab-btn {
          background: #FAF8F5;
          border: 1px solid #E5E1D8;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #3F3F46;
          cursor: pointer;
        }

        .creator-tab-btn.active {
          background: #18191E;
          color: #FFFFFF;
          border-color: #18191E;
        }

        .audit-results-box {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 32px;
          background: #FAF8F5;
          border-radius: 16px;
          padding: 28px;
          border: 1px solid #EAE6DF;
        }

        @media (max-width: 768px) {
          .audit-results-box {
            grid-template-columns: 1fr;
          }
        }

        .audit-score-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          border-right: 1px solid #EAE6DF;
          padding-right: 24px;
        }

        @media (max-width: 768px) {
          .audit-score-col {
            border-right: none;
            border-bottom: 1px solid #EAE6DF;
            padding-bottom: 20px;
          }
        }

        .score-badge-circle {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 8px;
        }

        .score-val {
          font-size: 2.8rem;
          font-weight: 900;
          color: #18191E;
        }

        .score-scale {
          font-size: 1.1rem;
          color: #71717A;
        }

        .score-status {
          font-size: 0.78rem;
          font-weight: 800;
          color: #16A34A;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .score-note {
          font-size: 0.72rem;
          color: #94A3B8;
        }

        .audit-details-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
          justify-content: center;
        }

        .audit-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.9rem;
          border-bottom: 1px dashed rgba(0,0,0,0.06);
          padding-bottom: 8px;
        }

        .audit-label {
          color: #71717A;
          font-weight: 500;
        }

        .audit-val {
          font-weight: 700;
          color: #18191E;
        }

        /* Standards List */
        .standards-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .standard-item {
          background: #FFFFFF;
          border: 1px solid #EAE6DF;
          border-radius: 16px;
          padding: 28px;
          display: flex;
          align-items: flex-start;
          gap: 24px;
        }

        .std-number {
          font-size: 1.6rem;
          font-weight: 900;
          color: #FF5B38;
          min-width: 44px;
        }

        .std-content h4 {
          font-size: 1.2rem;
          font-weight: 800;
          margin: 0 0 6px;
          color: #18191E;
        }

        .std-content p {
          margin: 0;
          color: #52525B;
          line-height: 1.55;
          font-size: 0.95rem;
        }

        /* Asset Download Card */
        .asset-download-card {
          background: #FFFFFF;
          border: 1px solid #EAE6DF;
          border-radius: 18px;
          padding: 24px;
          display: flex;
          flex-direction: column;
        }

        .asset-preview-box {
          height: 120px;
          background: #FAF8F5;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }

        .asset-preview-box.dark-box {
          background: #18191E;
        }

        .four-dots-preview {
          display: grid;
          grid-template-columns: repeat(2, 10px);
          gap: 6px;
        }

        .four-dots-preview .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .dot-green { background-color: #54c463; }
        .dot-orange { background-color: #ed7d1b; }
        .dot-blue { background-color: #5184f5; }
        .dot-pink { background-color: #e356a7; }

        .btn-download {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: #FAF8F5;
          border: 1px solid #E2E8F0;
          padding: 10px 16px;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #18191E;
          cursor: pointer;
          margin-top: auto;
          transition: all 0.15s ease;
        }

        .btn-download:hover {
          background: #18191E;
          color: #FFFFFF;
          border-color: #18191E;
        }

        /* Press Releases */
        .press-releases-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 36px;
        }

        .press-item {
          background: #FFFFFF;
          border: 1px solid #EAE6DF;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .press-date {
          font-size: 0.78rem;
          font-weight: 800;
          color: #71717A;
          text-transform: uppercase;
        }

        .press-item h4 {
          font-size: 1.15rem;
          font-weight: 800;
          margin: 4px 0 6px;
          color: #18191E;
        }

        .press-item p {
          margin: 0;
          color: #52525B;
          font-size: 0.9rem;
        }

        .btn-press-read {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: 1px solid #E2E8F0;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          color: #18191E;
        }

        .media-contact-banner {
          background: #F4EFE6;
          border: 1px solid #E5DEC9;
          border-radius: 18px;
          padding: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
        }

        .media-contact-banner h4 {
          font-size: 1.2rem;
          font-weight: 800;
          margin: 0 0 4px;
        }

        .media-contact-banner p {
          margin: 0 0 6px;
          color: #52525B;
          font-size: 0.9rem;
        }

        .press-email {
          font-size: 0.85rem;
          font-weight: 700;
          color: #FF5B38;
        }

        /* Jobs list */
        .jobs-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 32px;
        }

        .job-card {
          background: #FFFFFF;
          border: 1px solid #EAE6DF;
          border-radius: 18px;
          padding: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }

        .job-card-main {
          max-width: 780px;
        }

        .job-meta-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 10px;
        }

        .job-pill-dept {
          background: #F4EFE6;
          color: #78350F;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 9999px;
        }

        .job-pill-loc, .job-pill-comp {
          background: #FAF8F5;
          color: #52525B;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 9999px;
          border: 1px solid #EAE6DF;
        }

        .job-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #18191E;
          margin: 0 0 8px;
        }

        .job-desc {
          font-size: 0.95rem;
          color: #52525B;
          margin: 0;
          line-height: 1.5;
        }

        .btn-apply-job {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #18191E;
          color: #FFFFFF;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-apply-job:hover {
          background: #FF5B38;
        }

        .job-apply-modal-box {
          background: #FFFFFF;
          border: 2px solid #18191E;
          border-radius: 20px;
          padding: 32px;
          margin-top: 24px;
        }

        .apply-box-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .btn-close-box {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: #71717A;
        }

        .apply-form-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-field label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #3F3F46;
        }

        .form-field input, .form-field select, .form-field textarea {
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 0.92rem;
          font-family: inherit;
          background: #FAF8F5;
        }

        .form-field input:focus, .form-field select:focus, .form-field textarea:focus {
          outline: none;
          border-color: #18191E;
          background: #FFFFFF;
        }

        .apply-success-state {
          text-align: center;
          padding: 32px;
        }

        .success-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #DCFCE7;
          color: #16A34A;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        /* Palette Swatches */
        .palette-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-bottom: 40px;
        }

        @media (max-width: 768px) {
          .palette-grid {
            grid-template-columns: 1fr;
          }
        }

        .color-swatch-box {
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 16px;
          padding: 28px;
          height: 140px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
          transition: transform 0.15s ease;
        }

        .color-swatch-box:hover {
          transform: translateY(-2px);
        }

        .color-swatch-name {
          font-size: 0.95rem;
          font-weight: 800;
        }

        .color-hex-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: monospace;
          font-size: 0.88rem;
          font-weight: 700;
        }

        .motif-guide-card {
          background: #FFFFFF;
          border: 1px solid #EAE6DF;
          border-radius: 20px;
          padding: 32px;
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 32px;
          align-items: center;
        }

        @media (max-width: 640px) {
          .motif-guide-card {
            grid-template-columns: 1fr;
          }
        }

        .four-dots-large {
          display: grid;
          grid-template-columns: repeat(2, 24px);
          gap: 12px;
          justify-content: center;
        }

        .four-dots-large .dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }

        .motif-rules h4 {
          font-size: 1.25rem;
          font-weight: 800;
          margin: 0 0 8px;
        }

        .motif-rules p {
          color: #52525B;
          line-height: 1.55;
          margin: 0 0 12px;
        }

        .motif-rules ul {
          margin: 0;
          padding-left: 20px;
          color: #52525B;
          font-size: 0.9rem;
          line-height: 1.6;
        }

        /* Blog Articles */
        .blog-posts-stack {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .blog-post-card {
          background: #FFFFFF;
          border: 1px solid #EAE6DF;
          border-radius: 20px;
          padding: 36px;
        }

        .blog-meta-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .blog-tag {
          font-size: 0.75rem;
          font-weight: 800;
          color: #FF5B38;
          text-transform: uppercase;
        }

        .blog-date {
          font-size: 0.8rem;
          color: #71717A;
        }

        .blog-post-card h2 {
          font-size: 1.6rem;
          font-weight: 800;
          color: #18191E;
          margin: 0 0 12px;
          line-height: 1.25;
        }

        .blog-post-card p {
          font-size: 1rem;
          color: #52525B;
          line-height: 1.6;
          margin: 0 0 20px;
        }

        .code-snippet-box {
          background: #0D111A;
          border-radius: 12px;
          padding: 20px;
          overflow-x: auto;
        }

        .code-snippet-box pre {
          margin: 0;
        }

        .code-snippet-box code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          color: #93C5FD;
          line-height: 1.5;
        }

        /* FAQ Accordion */
        .faq-search-box {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #FFFFFF;
          border: 1px solid #EAE6DF;
          border-radius: 14px;
          padding: 16px 20px;
          margin-bottom: 32px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }

        .faq-search-box input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 1rem;
          font-family: inherit;
          color: #18191E;
        }

        .faq-accordion-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 48px;
        }

        .faq-item-card {
          background: #FFFFFF;
          border: 1px solid #EAE6DF;
          border-radius: 14px;
          overflow: hidden;
        }

        .faq-question-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          background: none;
          border: none;
          text-align: left;
          font-size: 1.05rem;
          font-weight: 700;
          color: #18191E;
          cursor: pointer;
        }

        .faq-chevron {
          transition: transform 0.2s ease;
          color: #71717A;
        }

        .faq-chevron.rotated {
          transform: rotate(90deg);
        }

        .faq-answer-body {
          padding: 0 24px 20px;
        }

        .faq-answer-body p {
          margin: 0;
          font-size: 0.95rem;
          color: #52525B;
          line-height: 1.6;
        }

        .support-ticket-card {
          background: #FFFFFF;
          border: 1px solid #EAE6DF;
          border-radius: 20px;
          padding: 36px;
        }

        /* Discord Preview */
        .discord-preview-card {
          background: #18191E;
          border-radius: 24px;
          padding: 36px;
          color: #FFFFFF;
        }

        .discord-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 24px;
          margin-bottom: 24px;
        }

        .discord-server-badge {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .server-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #5865F2;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
        }

        .discord-server-badge h4 {
          font-size: 1.25rem;
          font-weight: 800;
          margin: 0;
        }

        .discord-server-badge span {
          font-size: 0.8rem;
          color: #94A3B8;
        }

        .btn-discord-join {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #5865F2;
          color: #FFFFFF;
          border: none;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
        }

        .discord-channels-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        @media (max-width: 640px) {
          .discord-channels-grid {
            grid-template-columns: 1fr;
          }
        }

        .channel-box {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 18px;
        }

        .channel-name {
          font-family: monospace;
          font-size: 0.95rem;
          font-weight: 700;
          color: #38BDF8;
          display: block;
          margin-bottom: 6px;
        }

        .channel-box p {
          margin: 0;
          font-size: 0.85rem;
          color: #CBD5E1;
          line-height: 1.5;
        }

        /* Roster Grid */
        .roster-filter-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 28px;
        }

        .filter-pill-btn {
          background: #FFFFFF;
          border: 1px solid #E5E1D8;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #52525B;
          cursor: pointer;
        }

        .filter-pill-btn.active {
          background: #18191E;
          color: #FFFFFF;
          border-color: #18191E;
        }

        .roster-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        @media (max-width: 960px) {
          .roster-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .roster-grid {
            grid-template-columns: 1fr;
          }
        }

        .creator-roster-card {
          background: #FFFFFF;
          border: 1px solid #EAE6DF;
          border-radius: 18px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .creator-roster-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(0,0,0,0.08);
        }

        .creator-card-img-wrap {
          position: relative;
          aspect-ratio: 1/1;
          width: 100%;
          overflow: hidden;
          background: #E2E8F0;
        }

        .creator-card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-badge-verified {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #18191E;
          color: #FFFFFF;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .creator-card-info {
          padding: 20px;
        }

        .card-name-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2px;
        }

        .card-name-row h4 {
          font-size: 1.15rem;
          font-weight: 800;
          margin: 0;
          color: #18191E;
        }

        .card-handle {
          font-size: 0.8rem;
          color: #71717A;
          display: block;
          margin-bottom: 8px;
        }

        .card-niche-tag {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 700;
          color: #FF5B38;
          background: rgba(255, 91, 56, 0.08);
          padding: 2px 8px;
          border-radius: 6px;
          margin-bottom: 14px;
        }

        .card-bio-short {
          font-size: 0.85rem;
          color: #52525B;
          line-height: 1.5;
          margin: 0 0 16px;
        }

        .card-metrics-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          background: #FAF8F5;
          border-radius: 10px;
          padding: 10px;
          margin-bottom: 16px;
        }

        .metric-title {
          font-size: 0.7rem;
          color: #71717A;
          display: block;
        }

        .btn-card-book {
          width: 100%;
          background: #FAF8F5;
          border: 1px solid #E2E8F0;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #18191E;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .creator-roster-card:hover .btn-card-book {
          background: #18191E;
          color: #FFFFFF;
          border-color: #18191E;
        }

        /* Apply Creator Container */
        .creator-apply-container {
          background: #FFFFFF;
          border: 1px solid #EAE6DF;
          border-radius: 24px;
          padding: 36px;
          max-width: 760px;
          margin: 0 auto;
          box-shadow: 0 4px 24px rgba(0,0,0,0.03);
        }

        /* Footer */
        .info-footer {
          background: #0D111A;
          color: #94A3B8;
          padding: 72px 0 36px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .info-footer-grid {
          display: grid;
          grid-template-columns: 2.2fr 1fr 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 48px;
        }

        @media (max-width: 1024px) {
          .info-footer-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .footer-col-brand {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 640px) {
          .info-footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }

        .footer-brand-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          margin-bottom: 16px;
        }

        .footer-brand-text {
          font-size: 1.25rem;
          font-weight: 800;
          color: #FFFFFF;
        }

        .footer-brand-tagline {
          font-size: 0.88rem;
          color: #94A3B8;
          line-height: 1.6;
          max-width: 320px;
          margin: 0 0 16px;
        }

        .footer-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 0.75rem;
          color: #E2E8F0;
        }

        .live-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22C55E;
          box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
        }

        .footer-nav-col h4 {
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: #FFFFFF;
          margin: 0 0 16px;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hiring-tag {
          background: #FF5B38;
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 9999px;
        }

        .footer-nav-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-nav-col button {
          background: none;
          border: none;
          padding: 0;
          font-size: 0.85rem;
          color: #94A3B8;
          cursor: pointer;
          text-align: left;
          transition: color 0.15s ease;
        }

        .footer-nav-col button:hover, .footer-nav-col button.active-link {
          color: #FFFFFF;
          font-weight: 600;
        }

        .info-footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 24px;
          font-size: 0.8rem;
          color: #64748B;
        }

        .footer-bottom-links {
          display: flex;
          gap: 16px;
        }

        .footer-bottom-links button {
          background: none;
          border: none;
          color: #64748B;
          font-size: 0.8rem;
          cursor: pointer;
        }

        .footer-bottom-links button:hover {
          color: #94A3B8;
        }
      `}</style>
    </div>
  );
};
