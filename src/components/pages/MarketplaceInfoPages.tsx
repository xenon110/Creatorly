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
  Briefcase,
  Star,
  X,
  ChevronDown
} from 'lucide-react';
import { CreatorlyLogo } from '../CreatorlyLogo';
import { saveAgencyLeadToSupabase, saveSupportTicketToSupabase } from '../../lib/supabaseClient';

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

interface CategoryLinkItem {
  slug: PageSlug;
  label: string;
  badge?: string;
}

interface MarketplaceInfoPagesProps {
  pageSlug: string;
  onNavigateToPage: (slug: string) => void;
  onReturnToHome: () => void;
  onSelectCreator: (creator: CreatorProfile) => void;
  creators: CreatorProfile[];
  currentCurrency: CurrencyCode;
  onShowToast: (msg: string) => void;
  onOpenBookingModal?: (creator: CreatorProfile) => void;
  onBookingSubmitted?: (booking: any, creator: CreatorProfile) => void;
  onCreatorCreated?: (creator: CreatorProfile) => void;
}

export const MarketplaceInfoPages: React.FC<MarketplaceInfoPagesProps> = ({
  pageSlug,
  onNavigateToPage,
  onReturnToHome,
  onSelectCreator,
  creators,
  currentCurrency,
  onShowToast,
  onOpenBookingModal,
  onBookingSubmitted,
  onCreatorCreated
}) => {
  const currentSlug = (pageSlug as PageSlug) || 'about-creatorly';

  // Navigation Links Definition
  const categoryLinks: Record<'about' | 'careers' | 'connect' | 'discover', CategoryLinkItem[]> = {
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

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const fullWin = document.getElementById('marketplace-info-fullwindow');
    if (fullWin) {
      fullWin.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentSlug]);

  // Escape key handler for full window close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onReturnToHome();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onReturnToHome]);

  // Interactive States
  const [escrowBudget, setEscrowBudget] = useState<number>(50000);
  const [auditCreatorIndex, setAuditCreatorIndex] = useState<number>(0);
  const [, setCopiedHex] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [creatorApplicationSubmitted, setCreatorApplicationSubmitted] = useState(false);
  const [supportFaqSearch, setSupportFaqSearch] = useState('');
  const [supportTicketSubmitted, setSupportTicketSubmitted] = useState(false);
  const [supportNameAndEmail, setSupportNameAndEmail] = useState('');
  const [supportTopic, setSupportTopic] = useState('Escrow Payment & Milestone Release');
  const [supportDescription, setSupportDescription] = useState('');
  const [supportTicketId, setSupportTicketId] = useState('CR-8491');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [contactCreatorId, setContactCreatorId] = useState<string>(creators[0]?.id || 'cr_alex_sharma');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [agencyDemoBooked, setAgencyDemoBooked] = useState(false);
  const [creatorDirectoryCategory, setCreatorDirectoryCategory] = useState<string>('All');
  const [sectionDropdownOpen, setSectionDropdownOpen] = useState(false);

  // Contact Creator Form Fields
  const [contactBrandName, setContactBrandName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactBrief, setContactBrief] = useState('');
  const [contactBudget, setContactBudget] = useState<number>(50000);
  const [contactRefId, setContactRefId] = useState<string>('');

  // Hire Campaign Selection
  const [selectedCampaignNiche, setSelectedCampaignNiche] = useState('Tech & Dev Tools');

  // Agency Demo States
  const [agencyName, setAgencyName] = useState('');
  const [agencyEmail, setAgencyEmail] = useState('');
  const [agencySpend, setAgencySpend] = useState('₹25 Lakhs - ₹50 Lakhs / Quarter');

  // Apply Creator States
  const [applyLegalName, setApplyLegalName] = useState('');
  const [applyHandle, setApplyHandle] = useState('');
  const [applyEmail, setApplyEmail] = useState('');
  const [applyNiche, setApplyNiche] = useState('Technology & AI');
  const [applyFeeTarget, setApplyFeeTarget] = useState<number>(25000);
  const [createdNewCreator, setCreatedNewCreator] = useState<CreatorProfile | null>(null);

  // Copy Hex Utility
  const copyHex = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    onShowToast(`Copied ${hex} to clipboard!`);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  // Category mapping
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

  // Hero Data for the Top Half Orange Section
  const getHeroData = (slug: PageSlug) => {
    switch (slug) {
      case 'about-creatorly':
        return {
          eyebrow: 'ABOUT CREATORLY / MANIFESTO',
          titleBefore: 'Where honesty meets ',
          titleHighlight: 'influence.',
          subtitle: "Tell us what you're dreaming up. Connect with verified creators. No opaque agency markups, just bank-grade escrow protection and verified metrics.",
          ctaText: 'Explore Creator Roster',
          ctaAction: () => onReturnToHome()
        };
      case 'how-escrow-works':
        return {
          eyebrow: 'ESCROW ARCHITECTURE / TRUST FIRST',
          titleBefore: 'Bank-grade milestone protection. ',
          titleHighlight: 'For both sides.',
          subtitle: 'Neither brands nor creators take unilateral risk. Funds remain vaulted by banking trustees and release in transparent stages as milestones get approved.',
          ctaText: 'Try Milestone Calculator',
          ctaAction: () => {
            const el = document.getElementById('escrow-calculator-anchor');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        };
      case 'verification-protocol':
        return {
          eyebrow: 'VERIFICATION PROTOCOL / AUDIT ENGINE',
          titleBefore: 'Zero bots. Zero fake metrics. ',
          titleHighlight: 'Real humans only.',
          subtitle: 'Direct token authentication with Meta Graph and YouTube Analytics APIs. We audit view velocities, follower curves, and comment sentiment.',
          ctaText: 'Inspect Live Audits',
          ctaAction: () => {
            const el = document.getElementById('audit-inspector-anchor');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        };
      case 'creator-standards':
        return {
          eyebrow: 'CODE OF CONDUCT / ETHICAL CREATIVE',
          titleBefore: 'High craft. Clear commitments. ',
          titleHighlight: 'Dignified execution.',
          subtitle: 'The foundational code of conduct that gives tier-1 brands the confidence to invest repeatedly with Creatorly creators.',
          ctaText: 'Read Standards',
          ctaAction: () => onShowToast('Reviewing 5 Creator Standards below')
        };
      case 'press-media-kit':
        return {
          eyebrow: 'PRESS ROOM & MEDIA KIT',
          titleBefore: 'Press releases, brand assets & ',
          titleHighlight: 'founder bio.',
          subtitle: 'Official news, high-resolution logos, brand identity guidelines, and media contact for journalists covering creator economy innovation.',
          ctaText: 'Download Vector Kit',
          ctaAction: () => onShowToast('Downloaded Creatorly_Wordmark.zip')
        };
      case 'open-positions':
        return {
          eyebrow: "CAREERS / WE'RE HIRING (3 OPEN ROLES)",
          titleBefore: 'Build the calm, pro platform ',
          titleHighlight: 'creators deserve.',
          subtitle: 'We are a small, high-caliber, remote-first team. We value craft, deep work, and clear writing over endless meetings.',
          ctaText: 'View 3 Open Roles',
          ctaAction: () => setSelectedJob('Lead Product Designer (Design Systems & Editorial UI)')
        };
      case 'creator-fellowship':
        return {
          eyebrow: 'FELLOWSHIP / 12-WEEK INCUBATOR',
          titleBefore: 'From promising storyteller to ',
          titleHighlight: 'independent media brand.',
          subtitle: "A 12-week intensive accelerator providing ₹5,00,000 equity-free grants, professional production gear, and 1-on-1 mentorship from India's top 1% creators.",
          ctaText: 'Apply for Fellowship',
          ctaAction: () => onNavigateToPage('apply-creator')
        };
      case 'culture-perks':
        return {
          eyebrow: 'HOW WE WORK / CULTURE & PERKS',
          titleBefore: 'Gentle by design. ',
          titleHighlight: 'Pro by execution.',
          subtitle: 'We believe meaningful creative work happens in quiet, respectful environments. We respect your sleep, your weekends, and your craft.',
          ctaText: 'Explore Perks',
          ctaAction: () => onShowToast('Explore our remote culture below')
        };
      case 'engineering-blog':
        return {
          eyebrow: 'TECH & INFRASTRUCTURE / ENGINEERING BLOG',
          titleBefore: 'Architecting trust ',
          titleHighlight: 'at scale.',
          subtitle: 'Technical write-ups from our engineering team on distributed escrow state machines, sub-second social graph audits, and edge video performance.',
          ctaText: 'Read Architecture Paper',
          ctaAction: () => onShowToast('Reading FinTech Escrow State Machine write-up')
        };
      case 'brand-guidelines':
        return {
          eyebrow: 'DESIGN SYSTEM / BRAND IDENTITY',
          titleBefore: 'The Creatorly ',
          titleHighlight: 'visual language.',
          subtitle: 'Precision, high contrast, and restraint. Guidelines on using our signature Half Orange, Half Black and Crisp White design language.',
          ctaText: 'Copy Brand Colors',
          ctaAction: () => copyHex('#FF5500')
        };
      case 'contact-creator':
        return {
          eyebrow: 'DIRECT OUTREACH / CREATOR INQUIRY',
          titleBefore: 'Start a direct ',
          titleHighlight: 'creator conversation.',
          subtitle: "Send a verified brief to any creator on the platform. Your message lands directly in the creator's pipeline with guaranteed < 2-hour response times.",
          ctaText: 'Send Direct Brief',
          ctaAction: () => {
            const el = document.getElementById('brief-form-anchor');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        };
      case 'hire-campaign':
        return {
          eyebrow: 'CAMPAIGN BUILDER / SMART MATCHING',
          titleBefore: 'Hire verified creators for your ',
          titleHighlight: 'product launch.',
          subtitle: 'Configure your target audience, deliverables, and timeline. Creatorly auto-matches you with vetted storytellers ready to start production.',
          ctaText: 'Configure Deliverables',
          ctaAction: () => {
            const el = document.getElementById('campaign-builder-anchor');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        };
      case 'support-help':
        return {
          eyebrow: 'SUPPORT & HELP DESK / 24/7 ASSISTANCE',
          titleBefore: 'How can our support team ',
          titleHighlight: 'assist you today?',
          subtitle: 'Average ticket resolution time: 42 minutes. Dedicated escrow officers and creator relationship specialists standing by.',
          ctaText: 'Search Help Desk',
          ctaAction: () => {
            const el = document.getElementById('faq-search-input');
            if (el) el.focus();
          }
        };
      case 'agency-partnerships':
        return {
          eyebrow: 'ENTERPRISE & AGENTS / MULTI-CLIENT SUITE',
          titleBefore: 'Scale creator campaigns for ',
          titleHighlight: 'all your clients.',
          subtitle: 'Manage multiple brand accounts, execute bulk creator rosters with master billing, and get dedicated human escrow support.',
          ctaText: 'Schedule Agency Demo',
          ctaAction: () => {
            setAgencyDemoBooked(true);
            onShowToast('Agency demo invite dispatched to your email.');
          }
        };
      case 'discord-community':
        return {
          eyebrow: 'CREATORLY CIRCLE / 4,800+ MEMBERS',
          titleBefore: 'The private sanctuary for ',
          titleHighlight: 'serious creators.',
          subtitle: 'Share raw rate cards, get candid script feedback, discover confidential brand sponsorship leads, and talk shop with peers.',
          ctaText: 'Join Discord Server',
          ctaAction: () => onShowToast('Opening Creatorly Discord Invite...')
        };
      case 'all-creators':
        return {
          eyebrow: `VERIFIED CREATOR ROSTER (${creators.length} CREATORS)`,
          titleBefore: 'Explore all verified ',
          titleHighlight: 'creator storefronts.',
          subtitle: 'Every creator on this roster has verified Meta/YouTube API metrics, published milestone rate cards, and transparent deliverables.',
          ctaText: 'Filter by Niche',
          ctaAction: () => onShowToast('Filter creators by category below')
        };
      case 'tech-ai-creators':
        return {
          eyebrow: 'CATEGORY FOCUS / TECHNOLOGY & AI',
          titleBefore: 'Storytellers who make technology ',
          titleHighlight: 'feel effortless.',
          subtitle: 'From deep-dive AI workflow breakdowns to hands-on developer benchmarks, reach tech leaders and builders through authentic voices.',
          ctaText: 'Browse Tech Roster',
          ctaAction: () => onShowToast('Browsing Tech & AI creators')
        };
      case 'saas-devtools-creators':
        return {
          eyebrow: 'B2B & SOFTWARE / SAAS & DEV TOOLS',
          titleBefore: 'Reach real software engineers & ',
          titleHighlight: 'decision makers.',
          subtitle: "Developers don't click enterprise banner ads. They watch trusted creators code in real IDEs, configure CLIs, and build real applications.",
          ctaText: 'Launch Dev Campaign',
          ctaAction: () => onNavigateToPage('hire-campaign')
        };
      case 'consumer-tech-creators':
        return {
          eyebrow: 'HARDWARE & GADGETS / CONSUMER TECH',
          titleBefore: 'Cameras, mechanical keyboards & ',
          titleHighlight: 'desk setups.',
          subtitle: 'Visual craft that stops scrolling thumbs. Unboxing reels, long-term durability assessments, and cinematic product b-roll.',
          ctaText: 'View Hardware Creators',
          ctaAction: () => onShowToast('Viewing Consumer Tech creators')
        };
      case 'apply-creator':
        return {
          eyebrow: 'CREATOR ADMISSIONS / JOIN CREATORLY',
          titleBefore: 'Monetize your craft with ',
          titleHighlight: 'dignity and protection.',
          subtitle: 'Keep 100% of your rate card. Never chase another invoice. Join the hand-curated roster of creators backed by milestone escrow.',
          ctaText: 'Start Application',
          ctaAction: () => {
            const el = document.getElementById('creator-apply-anchor');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        };
      default:
        return {
          eyebrow: 'CREATORLY MARKETPLACE',
          titleBefore: 'Where honesty meets ',
          titleHighlight: 'influence.',
          subtitle: "Connect with verified creators with bank-grade escrow protection.",
          ctaText: 'Explore Creators',
          ctaAction: () => onReturnToHome()
        };
    }
  };

  const hero = getHeroData(currentSlug);

  return (
    <div className="marketplace-info-page" id="marketplace-info-fullwindow">
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
              <span className="info-logo-text">creatorly<span className="logo-dot-orange">.</span></span>
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
            {/* Quick Section Switcher Dropdown */}
            <div className="quick-switch-dropdown-wrap">
              <button 
                type="button" 
                className="btn-dropdown-trigger"
                onClick={() => setSectionDropdownOpen(!sectionDropdownOpen)}
              >
                <span>Jump to Section</span>
                <ChevronDown size={14} className={sectionDropdownOpen ? 'rotated' : ''} />
              </button>

              {sectionDropdownOpen && (
                <div className="quick-switch-menu">
                  <div className="switch-menu-header">Quick Section Navigation</div>
                  {(['about', 'careers', 'connect', 'discover'] as const).map((cat) => (
                    <div key={cat} className="switch-cat-group">
                      <div className="switch-cat-title">{cat.toUpperCase()}</div>
                      {categoryLinks[cat].map((link) => (
                        <button
                          key={link.slug}
                          type="button"
                          className={`switch-item-btn ${currentSlug === link.slug ? 'active' : ''}`}
                          onClick={() => {
                            onNavigateToPage(link.slug);
                            setSectionDropdownOpen(false);
                          }}
                        >
                          <span>{link.label}</span>
                          {link.badge && <span className="switch-badge">{link.badge}</span>}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              className="btn-back-storefront"
              onClick={onReturnToHome}
              title="Return to storefront (Esc)"
            >
              <ArrowLeft size={15} />
              <span>Back to Storefront</span>
              <kbd className="esc-key-tag">ESC</kbd>
            </button>

            <button
              type="button"
              className="btn-cta-nav"
              onClick={() => onNavigateToPage('hire-campaign')}
            >
              <span>Work together</span>
              <ArrowUpRight size={14} />
            </button>

            <button 
              type="button" 
              className="btn-close-window" 
              onClick={onReturnToHome}
              title="Close window (Esc)"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          2. TOP HALF: SOLID VIBRANT ORANGE SHOWCASE (Matching User Screenshot)
      ────────────────────────────────────────────────────────────── */}
      <section className="duotone-top-orange-hero">
        <div className="fresh-content-container hero-orange-inner">
          <div className="hero-orange-content">
            <span className="hero-eyebrow-black">
              • {hero.eyebrow}
            </span>

            <h1 className="hero-orange-headline">
              {hero.titleBefore}
              <span className="text-white-glow">{hero.titleHighlight}</span>
            </h1>

            <p className="hero-orange-subtitle">
              {hero.subtitle}
            </p>

            <div className="hero-orange-action-row">
              <button 
                type="button" 
                className="btn-hero-black"
                onClick={hero.ctaAction}
              >
                <span>{hero.ctaText}</span>
                <ArrowUpRight size={16} />
              </button>
            </div>

            <span className="hero-orange-microcopy">
              Sample message only · not delivered
            </span>
          </div>

          {/* Floating Sparkle Icon in bottom right */}
          <div className="hero-star-bottom">
            <Sparkles size={36} className="text-yellow-sparkle" />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. SUB-NAVIGATION TABS (Black Bar with Orange & White Indicators)
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
          4. BOTTOM HALF: DEEP OBSIDIAN BLACK MAIN CONTENT SECTION
      ────────────────────────────────────────────────────────────── */}
      <main className="info-main-content">
        <div className="fresh-content-container">
          
          {/* ========================================================= */}
          {/* PAGE 1: About Creatorly                                   */}
          {/* ========================================================= */}
          {currentSlug === 'about-creatorly' && (
            <div className="page-section-block">
              {/* Stats Highlights: White & Orange on Black */}
              <div className="metrics-strip-grid">
                <div className="metric-box box-theme-black">
                  <span className="metric-number text-orange">₹14.8 Cr+</span>
                  <span className="metric-label">Escrow payouts settled</span>
                  <span className="metric-sub">Zero payment defaults recorded</span>
                </div>
                <div className="metric-box box-theme-orange">
                  <span className="metric-number text-black">500+</span>
                  <span className="metric-label text-black">Verified Creators</span>
                  <span className="metric-sub text-black-sub">Direct Meta & YouTube OAuth audit</span>
                </div>
                <div className="metric-box box-theme-black">
                  <span className="metric-number text-orange">0%</span>
                  <span className="metric-label">Fraud Incident Rate</span>
                  <span className="metric-sub">Tier-1 trustee escrow vaulting</span>
                </div>
                <div className="metric-box box-theme-orange">
                  <span className="metric-number text-black">&lt; 2 hrs</span>
                  <span className="metric-label text-black">Avg Creator SLA</span>
                  <span className="metric-sub text-black-sub">Prompt communication guaranteed</span>
                </div>
              </div>

              {/* 4 Pillars: Half Black, Half Orange Cards */}
              <div className="editorial-grid-2col" style={{ marginTop: '36px' }}>
                <div className="info-card card-theme-black">
                  <div className="info-card-icon"><ShieldCheck size={26} className="text-orange" /></div>
                  <h3>Milestone-Protected Escrow</h3>
                  <p>
                    Brands deposit campaign budgets safely into neutral escrow accounts before production starts. Funds are locked and only released upon verifiable milestone completion — scripts, rough cuts, and live post analytics.
                  </p>
                </div>

                <div className="info-card card-theme-orange">
                  <div className="info-card-icon"><Award size={26} className="text-black" /></div>
                  <h3 className="text-black">Direct API Verification</h3>
                  <p className="text-black-p">
                    We reject fake media kits and photoshopped screenshots. Every creator’s audience demographics, 30-day view velocity, and authentic engagement rates are queried directly from Meta Graph and Google APIs.
                  </p>
                </div>

                <div className="info-card card-theme-orange">
                  <div className="info-card-icon"><HeartHandshake size={26} className="text-black" /></div>
                  <h3 className="text-black">Creators Keep 100%</h3>
                  <p className="text-black-p">
                    Creators set their own rate cards and keep 100% of their published fees. We believe talented storytellers should be rewarded fully for their craft, not taxed with 30% agency cuts.
                  </p>
                </div>

                <div className="info-card card-theme-black">
                  <div className="info-card-icon"><Zap size={26} className="text-orange" /></div>
                  <h3>Gentle & Professional UX</h3>
                  <p>
                    A calm, distraction-free marketplace designed for clear decision-making. No aggressive spam, no fake urgency timers — just respectful partnerships built to last for quarters, not single posts.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 2: How Escrow Works                                  */}
          {/* ========================================================= */}
          {currentSlug === 'how-escrow-works' && (
            <div className="page-section-block" id="escrow-calculator-anchor">
              {/* Interactive Escrow Simulator: 50% Black Controls, 50% Orange Stages */}
              <div className="split-simulator-container">
                <div className="sim-black-panel">
                  <h4>Interactive Milestone Calculator</h4>
                  <p>Adjust campaign budget to see how Creatorly calculates automatic milestone disbursements:</p>
                  
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

                  <div className="sim-slider-row">
                    <label>Total Campaign Escrow: <strong className="text-orange">₹{escrowBudget.toLocaleString('en-IN')}</strong></label>
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
                </div>

                <div className="sim-orange-panel">
                  <div className="orange-panel-header">
                    <span className="orange-pill-tag">DISBURSEMENT SCHEDULE</span>
                    <h3>Automated 3-Stage Escrow Release</h3>
                  </div>

                  <div className="milestone-stages-grid-duo">
                    <div className="stage-box-duo">
                      <div className="stage-num-badge">STAGE 01 (30%)</div>
                      <h5>Creative Script & Outline</h5>
                      <p>Released upon brand approving video outline, hook script, and talking points.</p>
                      <div className="stage-amount-duo">₹{(escrowBudget * 0.3).toLocaleString('en-IN')}</div>
                    </div>

                    <div className="stage-box-duo">
                      <div className="stage-num-badge">STAGE 02 (40%)</div>
                      <h5>Rough Cut & Revisions</h5>
                      <p>Released upon video review, b-roll confirmation, and feedback integration.</p>
                      <div className="stage-amount-duo">₹{(escrowBudget * 0.4).toLocaleString('en-IN')}</div>
                    </div>

                    <div className="stage-box-duo">
                      <div className="stage-num-badge">STAGE 03 (30%)</div>
                      <h5>Live Post & 72h Verification</h5>
                      <p>Released once the sponsor post goes live with tracking link and reach verification.</p>
                      <div className="stage-amount-duo">₹{(escrowBudget * 0.3).toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Escrow Safety FAQ: 50% Black & 50% Orange */}
              <div className="editorial-grid-3col" style={{ marginTop: '36px' }}>
                <div className="feature-block card-theme-black">
                  <Lock size={24} className="text-orange" />
                  <h4>Trustee Escrow Accounts</h4>
                  <p>Funds never sit in proprietary operating accounts. They are held by registered banking trustees until verified milestone sign-off.</p>
                </div>
                <div className="feature-block card-theme-orange">
                  <Check size={24} className="text-black" />
                  <h4 className="text-black">No Payment Chasing</h4>
                  <p className="text-black-p">Creators work with full peace of mind knowing 100% of the funds are already funded and locked in escrow before they hit record.</p>
                </div>
                <div className="feature-block card-theme-black">
                  <ShieldCheck size={24} className="text-orange" />
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
            <div className="page-section-block" id="audit-inspector-anchor">
              {/* Live Verification Inspector: Half Black, Half Orange */}
              <div className="split-simulator-container">
                <div className="sim-black-panel">
                  <h4>Live Verification Audit Inspector</h4>
                  <p>Preview direct API verification metrics on vetted creators:</p>
                  <div className="creator-select-tabs">
                    {creators.slice(0, 4).map((c, idx) => (
                      <button
                        key={c.id}
                        type="button"
                        className={`creator-tab-btn ${auditCreatorIndex === idx ? 'active' : ''}`}
                        onClick={() => setAuditCreatorIndex(idx)}
                      >
                        {c.fullName}
                      </button>
                    ))}
                  </div>

                  <div className="audit-score-col-duo">
                    <div className="score-badge-circle">
                      <span className="score-val text-orange">98.4</span>
                      <span className="score-scale">/ 100</span>
                    </div>
                    <span className="score-status text-orange">✓ VERIFIED AUTHENTIC</span>
                    <span className="score-note">Last audited: Meta API 48h ago</span>
                  </div>
                </div>

                <div className="sim-orange-panel">
                  <h3 className="text-black" style={{ margin: '0 0 16px' }}>Direct API Query Results</h3>
                  {creators[auditCreatorIndex] && (
                    <div className="audit-details-orange-col">
                      <div className="audit-row-duo">
                        <span className="audit-label-duo">Direct API Connection:</span>
                        <span className="audit-val-duo">✓ Meta & YouTube OAuth Active</span>
                      </div>
                      <div className="audit-row-duo">
                        <span className="audit-label-duo">Audience Authenticity:</span>
                        <span className="audit-val-duo">97.2% Real Humans (No bot spikes)</span>
                      </div>
                      <div className="audit-row-duo">
                        <span className="audit-label-duo">Primary Geography:</span>
                        <span className="audit-val-duo">82% India (Mumbai, Bengaluru, Delhi)</span>
                      </div>
                      <div className="audit-row-duo">
                        <span className="audit-label-duo">Avg Engagement Rate:</span>
                        <span className="audit-val-duo">{creators[auditCreatorIndex].metrics?.engagementRate || 4.8}% (Top 5% in niche)</span>
                      </div>
                      <div className="audit-row-duo">
                        <span className="audit-label-duo">Sponsor Completion Rate:</span>
                        <span className="audit-val-duo">100% On-Time Deliveries</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 6 Step Cards: Half Black, Half Orange */}
              <div className="editorial-grid-3col" style={{ marginTop: '36px' }}>
                <div className="feature-block card-theme-black">
                  <div className="step-tag">Step 1</div>
                  <h4>OAuth Handshake</h4>
                  <p>Direct token authentication with Meta Graph API and Google YouTube Analytics API.</p>
                </div>
                <div className="feature-block card-theme-orange">
                  <div className="step-tag-black">Step 2</div>
                  <h4 className="text-black">Follower Velocity</h4>
                  <p className="text-black-p">Historical growth curve analysis to detect synthetic bulk purchases or sudden overnight spikes.</p>
                </div>
                <div className="feature-block card-theme-black">
                  <div className="step-tag">Step 3</div>
                  <h4>Comment Sentiment NLP</h4>
                  <p>Natural language parsing of comments to separate real discourse from emoji bot farms.</p>
                </div>
                <div className="feature-block card-theme-orange">
                  <div className="step-tag-black">Step 4</div>
                  <h4 className="text-black">Audience Demographics</h4>
                  <p className="text-black-p">Auditing age, gender, and geographical concentrations to match brand buyer personas.</p>
                </div>
                <div className="feature-block card-theme-black">
                  <div className="step-tag">Step 5</div>
                  <h4>Brand Reference Checks</h4>
                  <p>Direct outreach to past 3 sponsorship clients to verify professionalism and communication.</p>
                </div>
                <div className="feature-block card-theme-orange">
                  <div className="step-tag-black">Step 6</div>
                  <h4 className="text-black">Legal Identity & KYC</h4>
                  <p className="text-black-p">PAN, GST, and institutional bank account verification for clean, hassle-free tax invoicing.</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 4: Creator Standards                                 */}
          {/* ========================================================= */}
          {currentSlug === 'creator-standards' && (
            <div className="page-section-block">
              {/* Alternating Black and Orange Standards */}
              <div className="standards-list">
                <div className="standard-item card-theme-black">
                  <div className="std-number text-orange">01</div>
                  <div className="std-content">
                    <h4>The &lt; 2-Hour Communication SLA</h4>
                    <p>
                      Prompt communication builds great partnerships. Creators acknowledge brand inquiries and revision comments within 2 hours during normal business hours.
                    </p>
                  </div>
                </div>

                <div className="standard-item card-theme-orange">
                  <div className="std-number text-black">02</div>
                  <div className="std-content">
                    <h4 className="text-black">Two Revision Rounds Guaranteed</h4>
                    <p className="text-black-p">
                      Every package includes two thorough rounds of structured feedback. Brands provide consolidated notes, and creators implement adjustments within 48 hours without friction.
                    </p>
                  </div>
                </div>

                <div className="standard-item card-theme-black">
                  <div className="std-number text-orange">03</div>
                  <div className="std-content">
                    <h4>FTC & ASCI Transparent Disclosures</h4>
                    <p>
                      Every sponsored video, reel, and post features prominent disclosure (#ad / #partnership). We believe honesty with audiences builds long-term brand credibility.
                    </p>
                  </div>
                </div>

                <div className="standard-item card-theme-orange">
                  <div className="std-number text-black">04</div>
                  <div className="std-content">
                    <h4 className="text-black">Authentic Testing & Respectful Critique</h4>
                    <p className="text-black-p">
                      Creators test products for a minimum of 48 hours before speaking on them. If a creator discovers an issue, they notify the brand immediately before proceeding.
                    </p>
                  </div>
                </div>

                <div className="standard-item card-theme-black">
                  <div className="std-number text-orange">05</div>
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
              <h3 className="section-subheading">Official Brand Assets</h3>
              <div className="editorial-grid-3col">
                <div className="asset-download-card card-theme-black">
                  <div className="asset-preview-box">
                    <CreatorlyLogo width={52} height={42} />
                  </div>
                  <h4>Creatorly Primary Wordmark</h4>
                  <p>Vector SVG & high-res PNG with transparent background.</p>
                  <button type="button" className="btn-download-orange" onClick={() => onShowToast('Downloaded Creatorly_Wordmark.zip')}>
                    <Download size={14} />
                    <span>Download SVG + PNG</span>
                  </button>
                </div>

                <div className="asset-download-card card-theme-orange">
                  <div className="asset-preview-box-black">
                    <div className="orange-dots-preview">
                      <span className="dot dot-orange-1"></span>
                      <span className="dot dot-orange-2"></span>
                      <span className="dot dot-orange-3"></span>
                      <span className="dot dot-orange-4"></span>
                    </div>
                  </div>
                  <h4 className="text-black">Creatorly 4-Dots Mark Kit</h4>
                  <p className="text-black-p">The iconic brand motif for app icons, dark backdrops and social avatars.</p>
                  <button type="button" className="btn-download-black" onClick={() => onShowToast('Downloaded Creatorly_Mark_Kit.zip')}>
                    <Download size={14} />
                    <span>Download Mark Kit</span>
                  </button>
                </div>

                <div className="asset-download-card card-theme-black">
                  <div className="asset-preview-box">
                    <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '1.4rem' }}>creatorly<span className="text-orange">.</span></span>
                  </div>
                  <h4>Dark Mode Vector Assets</h4>
                  <p>Inverted logos designed for dark backdrops and press articles.</p>
                  <button type="button" className="btn-download-orange" onClick={() => onShowToast('Downloaded Creatorly_Dark_Kit.zip')}>
                    <Download size={14} />
                    <span>Download Dark Assets</span>
                  </button>
                </div>
              </div>

              {/* Press Releases */}
              <h3 className="section-subheading" style={{ marginTop: '48px' }}>Recent Press Releases</h3>
              <div className="press-releases-list">
                <div className="press-item card-theme-black">
                  <span className="press-date text-orange">October 2026</span>
                  <h4>Creatorly Surpasses ₹14 Cr in Escrow Milestone Payouts to Indian Storytellers</h4>
                  <p>Platform introduces direct Meta OAuth auditing to counter synthetic bot followers across tier-1 brand campaigns.</p>
                  <button type="button" className="btn-press-read-orange" onClick={() => onShowToast('Reading press release: October 2026 Milestone Payouts')}>
                    <span>Read Release</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>

                <div className="press-item card-theme-orange">
                  <span className="press-date text-black">August 2026</span>
                  <h4 className="text-black">Creatorly Launches 12-Week Creator Fellowship with ₹5,00,000 Equity-Free Grants</h4>
                  <p className="text-black-p">First cohort welcomes 12 rising creators across tech, design, and culinary storytelling.</p>
                  <button type="button" className="btn-press-read-black" onClick={() => onShowToast('Reading press release: Creator Fellowship Cohort 1')}>
                    <span>Read Release</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 6: Open Positions (3)                                */}
          {/* ========================================================= */}
          {currentSlug === 'open-positions' && (
            <div className="page-section-block">
              {/* 3 Job Openings: Alternating Black and Orange */}
              <div className="jobs-list">
                {[
                  {
                    id: 'lead-designer',
                    title: 'Lead Product Designer (Design Systems & Editorial UI)',
                    dept: 'Design & UX',
                    loc: 'Remote (India / Global)',
                    comp: '₹28,00,000 – ₹38,00,000 + Equity',
                    desc: 'Define the next generation of gentle, restrained marketplace interfaces. Own our web design system and editorial typography.',
                    isOrange: false
                  },
                  {
                    id: 'staff-fintech-eng',
                    title: 'Staff Escrow & FinTech Engineer (Distributed State Machines)',
                    dept: 'Engineering',
                    loc: 'Bengaluru / Remote',
                    comp: '₹36,00,000 – ₹48,00,000 + Equity',
                    desc: 'Architect bank-grade escrow settlement pipelines, webhook ingestion, and automated milestone payouts with zero data loss.',
                    isOrange: true
                  },
                  {
                    id: 'creator-partnerships',
                    title: 'Creator Partnerships Director (Tech & Lifestyle)',
                    dept: 'Creator Operations',
                    loc: 'Mumbai / Remote',
                    comp: '₹24,00,000 – ₹32,00,000 + Bonus',
                    desc: 'Curate and onboard the top 1% of independent content creators. Guide creator rate cards and maintain quality standards.',
                    isOrange: false
                  }
                ].map((job) => (
                  <div key={job.id} className={`job-card ${job.isOrange ? 'card-theme-orange' : 'card-theme-black'}`}>
                    <div className="job-card-main">
                      <div className="job-meta-pills">
                        <span className={job.isOrange ? 'job-pill-dept-black' : 'job-pill-dept'}>{job.dept}</span>
                        <span className={job.isOrange ? 'job-pill-loc-black' : 'job-pill-loc'}>{job.loc}</span>
                        <span className={job.isOrange ? 'job-pill-comp-black' : 'job-pill-comp'}>{job.comp}</span>
                      </div>
                      <h3 className={`job-title ${job.isOrange ? 'text-black' : ''}`}>{job.title}</h3>
                      <p className={`job-desc ${job.isOrange ? 'text-black-p' : ''}`}>{job.desc}</p>
                    </div>
                    <button
                      type="button"
                      className={job.isOrange ? 'btn-apply-job-black' : 'btn-apply-job-orange'}
                      onClick={() => setSelectedJob(job.title)}
                    >
                      <span>Apply Now</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Job Application Inline Drawer/Modal */}
              {selectedJob && (
                <div className="job-apply-modal-box">
                  <div className="apply-box-header">
                    <div>
                      <span className="text-orange" style={{ fontSize: '0.8rem', fontWeight: 800 }}>SUBMIT APPLICATION</span>
                      <h3>{selectedJob}</h3>
                    </div>
                    <button type="button" className="btn-close-box" onClick={() => setSelectedJob(null)}>
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); onShowToast(`Application received for ${selectedJob}! We will reach out.`); setSelectedJob(null); }} className="apply-form-grid">
                    <div className="form-field">
                      <label>Full Legal Name *</label>
                      <input type="text" required placeholder="Alex Sharma" />
                    </div>
                    <div className="form-field">
                      <label>Work Email Address *</label>
                      <input type="email" required placeholder="alex@gmail.com" />
                    </div>
                    <div className="form-field">
                      <label>Portfolio / GitHub / LinkedIn URL *</label>
                      <input type="url" required placeholder="https://linkedin.com/in/alexsharma" />
                    </div>
                    <div className="form-field">
                      <label>Why Creatorly? *</label>
                      <textarea rows={3} required placeholder="Tell us about the best design or engineering system you've shipped..." />
                    </div>
                    <button type="submit" className="btn-action-primary">
                      <span>Submit Application</span>
                      <Send size={15} />
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 7: Creator Fellowship                                */}
          {/* ========================================================= */}
          {currentSlug === 'creator-fellowship' && (
            <div className="page-section-block">
              <div className="editorial-grid-2col">
                <div className="info-card card-theme-black">
                  <div className="info-card-icon"><Award size={26} className="text-orange" /></div>
                  <h3>₹5,00,000 Equity-Free Grant</h3>
                  <p>Direct non-dilutive capital to upgrade your studio lighting, camera lenses, and post-production editing machines.</p>
                </div>

                <div className="info-card card-theme-orange">
                  <div className="info-card-icon"><Users size={26} className="text-black" /></div>
                  <h3 className="text-black">1-on-1 Master Mentorship</h3>
                  <p className="text-black-p">Weekly script reviews, pacing breakdowns, and thumbnail critique sessions with verified veteran creators.</p>
                </div>

                <div className="info-card card-theme-orange">
                  <div className="info-card-icon"><Briefcase size={26} className="text-black" /></div>
                  <h3 className="text-black">Guaranteed Brand Contracts</h3>
                  <p className="text-black-p">Graduates are introduced directly to partner brands with pre-approved ₹10,00,000 in escrow collaboration commitments.</p>
                </div>

                <div className="info-card card-theme-black">
                  <div className="info-card-icon"><Sparkles size={26} className="text-orange" /></div>
                  <h3>Lifetime Creatorly Circle</h3>
                  <p>Exclusive access to our private creator mastermind, legal contract templates, and production studio discounts.</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 8: Culture & Perks                                   */}
          {/* ========================================================= */}
          {currentSlug === 'culture-perks' && (
            <div className="page-section-block">
              <div className="editorial-grid-3col">
                <div className="feature-block card-theme-black">
                  <Globe size={24} className="text-orange" />
                  <h4>100% Remote & Async</h4>
                  <p>Work from wherever you are happiest. We evaluate outcomes and clear writing, not hours seated in an office chair.</p>
                </div>

                <div className="feature-block card-theme-orange">
                  <Laptop size={24} className="text-black" />
                  <h4 className="text-black">₹1,50,000 Studio Stipend</h4>
                  <p className="text-black-p">Every team member gets modern M-series MacBooks, 4K displays, Herman Miller seating, and acoustic gear.</p>
                </div>

                <div className="feature-block card-theme-black">
                  <HeartHandshake size={24} className="text-orange" />
                  <h4>Annual Team Summits</h4>
                  <p>Twice a year we gather for 5 days of thoughtful reflection, surfing, and great food (Goa, Bali, Lisbon).</p>
                </div>

                <div className="feature-block card-theme-orange">
                  <ShieldCheck size={24} className="text-black" />
                  <h4 className="text-black">Comprehensive Health</h4>
                  <p className="text-black-p">100% premium coverage for you and your dependents, plus unlimited mental wellness counseling sessions.</p>
                </div>

                <div className="feature-block card-theme-black">
                  <Sparkles size={24} className="text-orange" />
                  <h4>Creator Sabbatical</h4>
                  <p>After 2 years with Creatorly, take a 1-month fully paid sabbatical to work on your own creative film or side project.</p>
                </div>

                <div className="feature-block card-theme-orange">
                  <FileText size={24} className="text-black" />
                  <h4 className="text-black">Transparent Salary Bands</h4>
                  <p className="text-black-p">No awkward salary negotiations. Every level has published, market-top compensation bands and equity grants.</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 9: Engineering Blog                                  */}
          {/* ========================================================= */}
          {currentSlug === 'engineering-blog' && (
            <div className="page-section-block">
              <div className="blog-posts-stack">
                <article className="blog-post-card card-theme-black">
                  <div className="blog-meta-row">
                    <span className="blog-tag text-orange">FinTech & Systems</span>
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

                <article className="blog-post-card card-theme-orange">
                  <div className="blog-meta-row">
                    <span className="blog-tag text-black" style={{ fontWeight: 800 }}>Forensics & Data</span>
                    <span className="blog-date text-black-sub">September 28, 2026 • 6 min read</span>
                  </div>
                  <h2 className="text-black">Auditing Ghost Followers: Identifying Sybil Bot Clusters via Meta Graph Edge Traversal</h2>
                  <p className="text-black-p">
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
              <h3 className="section-subheading">Official Palette Swatches (Click to copy hex)</h3>
              <div className="palette-grid">
                {[
                  { name: 'Obsidian Black', hex: '#000000', textLight: true, border: true },
                  { name: 'Electric Orange', hex: '#FF5500', textLight: false },
                  { name: 'Pure Snow White', hex: '#FFFFFF', textLight: false },
                  { name: 'Deep Carbon', hex: '#0E0F14', textLight: true, border: true },
                  { name: 'Blaze Orange', hex: '#FF6600', textLight: false },
                  { name: 'Platinum Silver', hex: '#E4E4E7', textLight: false }
                ].map((color) => (
                  <div
                    key={color.hex}
                    className="color-swatch-box"
                    style={{ 
                      backgroundColor: color.hex, 
                      color: color.textLight ? '#FFFFFF' : '#000000',
                      border: color.border ? '1px solid rgba(255,255,255,0.15)' : 'none'
                    }}
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

              {/* Brand Geometry Guide */}
              <div className="split-simulator-container" style={{ marginTop: '36px' }}>
                <div className="sim-black-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="orange-dots-large">
                    <span className="dot dot-o1"></span>
                    <span className="dot dot-o2"></span>
                    <span className="dot dot-o3"></span>
                    <span className="dot dot-o4"></span>
                  </div>
                </div>

                <div className="sim-orange-panel">
                  <h4 className="text-black" style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 8px' }}>The 4-Dot Brand Geometry</h4>
                  <p className="text-black-p" style={{ margin: '0 0 16px' }}>
                    The 4 dots represent our 4 pillars: <strong>Escrow Trust</strong>, <strong>Storytelling Impact</strong>, <strong>Audited Analytics</strong>, and <strong>Creator Autonomy</strong>.
                  </p>
                  <ul className="text-black-p" style={{ paddingLeft: '20px', margin: 0, lineHeight: 1.6 }}>
                    <li>Maintain 50% Black and 50% Orange visual balance across interfaces.</li>
                    <li>Always use high-contrast White and Black typography.</li>
                    <li>Pair with our signature wordmark: <strong>creatorly.</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 11: Contact Creator                                  */}
          {/* ========================================================= */}
          {currentSlug === 'contact-creator' && (
            <div className="page-section-block" id="brief-form-anchor">
              <div className="split-simulator-container">
                <div className="sim-black-panel">
                  {contactSubmitted ? (
                    <div className="apply-success-state">
                      <div className="success-icon"><Check size={32} /></div>
                      <h4>Inquiry Dispatched!</h4>
                      <p>
                        Your campaign brief <strong className="text-orange">{contactRefId}</strong> has been routed directly to {creators.find(c => c.id === contactCreatorId)?.fullName || 'the creator'}&apos;s verified inbox.
                      </p>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
                        <button 
                          type="button" 
                          className="btn-action-primary" 
                          onClick={() => {
                            onReturnToHome();
                            onShowToast(`Tracking deal ${contactRefId} in Workflow Pipeline`);
                          }}
                        >
                          View in Pipeline →
                        </button>
                        <button 
                          type="button" 
                          className="btn-close-box"
                          style={{ padding: '8px 16px', border: '1px solid rgba(255,255,255,0.2)' }}
                          onClick={() => {
                            setContactSubmitted(false);
                            setContactBrief('');
                          }}
                        >
                          Send Another Inquiry
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const targetCreator = creators.find(c => c.id === contactCreatorId) || creators[0];
                        const ref = `CR-INQ-${Math.floor(10000 + Math.random() * 90000)}`;
                        setContactRefId(ref);

                        if (onBookingSubmitted && targetCreator) {
                          onBookingSubmitted({
                            packageId: targetCreator.packages[0]?.id || 'custom',
                            packageName: 'Direct Brief Collaboration',
                            basePriceINR: contactBudget,
                            selectedAddOns: [],
                            totalPriceINR: contactBudget,
                            brandName: contactBrandName || 'Partner Brand',
                            contactName: contactBrandName || 'Campaign Lead',
                            contactEmail: contactEmail || 'collab@brand.com',
                            companyWebsite: '',
                            campaignObjective: 'Direct Sponsorship Inquiry',
                            targetAudience: 'Target Audience in Niche',
                            preferredDate: 'Within 7 business days',
                            campaignBrief: contactBrief,
                            exclusivityRequested: false,
                            submittedAt: 'Just now',
                            referenceId: ref
                          }, targetCreator);
                        }

                        setContactSubmitted(true);
                        onShowToast(`Inquiry ${ref} sent directly to ${targetCreator?.fullName}!`);
                      }} 
                      className="apply-form-grid"
                    >
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
                        <input 
                          type="text" 
                          required 
                          placeholder="Notion, Zepto, or Linear"
                          value={contactBrandName}
                          onChange={(e) => setContactBrandName(e.target.value)}
                        />
                      </div>

                      <div className="form-field">
                        <label>Work Email Address *</label>
                        <input 
                          type="email" 
                          required 
                          placeholder="collaborations@brand.com"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                        />
                      </div>

                      <div className="form-field">
                        <label>Campaign Objective & Deliverables *</label>
                        <textarea 
                          rows={4} 
                          required 
                          placeholder="We want to sponsor a 60s YouTube integration reviewing our new developer feature in mid-November..."
                          value={contactBrief}
                          onChange={(e) => setContactBrief(e.target.value)}
                        />
                      </div>

                      <div className="form-field">
                        <label>Estimated Budget ({currentCurrency})</label>
                        <input 
                          type="number" 
                          placeholder="50000" 
                          value={contactBudget}
                          onChange={(e) => setContactBudget(Number(e.target.value))}
                        />
                      </div>

                      <button type="submit" className="btn-action-primary">
                        <span>Send Direct Brief</span>
                        <Send size={15} />
                      </button>
                    </form>
                  )}
                </div>

                <div className="sim-orange-panel">
                  <h3 className="text-black" style={{ margin: '0 0 16px' }}>Direct Creator Guarantees</h3>
                  <div className="orange-guarantee-stack">
                    <div className="orange-guarantee-item">
                      <h4 className="text-black">No Talent Agency Middlemen</h4>
                      <p className="text-black-p">Creators receive brief notifications directly on their mobile devices without agency markups.</p>
                    </div>

                    <div className="orange-guarantee-item">
                      <h4 className="text-black">Bank-Grade Escrow Vault</h4>
                      <p className="text-black-p">Funds release only as deliverables are approved by your team.</p>
                    </div>

                    <div className="orange-guarantee-item">
                      <h4 className="text-black">Need Multi-Creator Roster?</h4>
                      <p className="text-black-p">Executing a multi-creator launch? Use our campaign builder.</p>
                      <button type="button" className="btn-banner-black" style={{ marginTop: '10px' }} onClick={() => onNavigateToPage('hire-campaign')}>
                        <span>Open Campaign Builder →</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 12: Hire for Campaign                                */}
          {/* ========================================================= */}
          {currentSlug === 'hire-campaign' && (
            <div className="page-section-block" id="campaign-builder-anchor">
              <div className="split-simulator-container">
                <div className="sim-black-panel">
                  <h4>1. Select Target Niche</h4>
                  <div className="niche-selector-pills">
                    {['Tech & Dev Tools', 'AI & Automation', 'Design & Aesthetics', 'Fitness & Health', 'Food & Lifestyle', 'Finance & Investing'].map((niche) => (
                      <button
                        key={niche}
                        type="button"
                        className={`niche-select-btn ${selectedCampaignNiche === niche ? 'selected' : ''}`}
                        onClick={() => setSelectedCampaignNiche(niche)}
                      >
                        {niche}
                      </button>
                    ))}
                  </div>

                  <h4 style={{ marginTop: '28px' }}>2. Deliverable Selection</h4>
                  <div className="deliverables-checklist-grid" style={{ gridTemplateColumns: '1fr' }}>
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
                </div>

                <div className="sim-orange-panel">
                  <h3 className="text-black" style={{ margin: '0 0 16px' }}>Campaign Milestone Summary</h3>
                  <div className="orange-guarantee-stack">
                    <div className="orange-guarantee-item">
                      <span className="orange-pill-tag">ESTIMATED BUDGET</span>
                      <h2 className="text-black" style={{ fontSize: '2rem', fontWeight: 900, margin: '8px 0' }}>₹75,000 – ₹1,50,000</h2>
                      <p className="text-black-p">Includes 100% bank-grade escrow milestone protection and 2 guaranteed revision rounds.</p>
                    </div>

                    <div className="orange-guarantee-item">
                      <h4 className="text-black">What Happens Next:</h4>
                      <p className="text-black-p">1. Creatorly matches 3-5 vetted creators matching your niche.</p>
                      <p className="text-black-p">2. Review rate cards and approve scripts.</p>
                      <p className="text-black-p">3. Vault escrow funds safely before production starts.</p>
                    </div>

                    <button
                      type="button"
                      className="btn-banner-black"
                      style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
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
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 13: Support & Help Desk                              */}
          {/* ========================================================= */}
          {currentSlug === 'support-help' && (
            <div className="page-section-block">
              {/* FAQ Search */}
              <div className="faq-search-box">
                <Search size={18} className="text-orange" />
                <input
                  id="faq-search-input"
                  type="text"
                  placeholder="Search FAQ: escrow refund, revision limits, GST invoices, API verification..."
                  value={supportFaqSearch}
                  onChange={(e) => setSupportFaqSearch(e.target.value)}
                />
              </div>

              {/* Alternating Black and Orange FAQ Accordion */}
              <div className="faq-accordion-list">
                {[
                  {
                    q: 'How does Creatorly milestone escrow guarantee payment security?',
                    a: 'Brands deposit funds into an ICICI/HDFC trustee escrow account before production starts. The creator knows the money is real and reserved. Funds only release to the creator when both parties approve the completed milestone.',
                    isOrange: false
                  },
                  {
                    q: 'What happens if a creator misses a deadline or is unresponsive?',
                    a: 'If a creator fails to reply within the 48-hour SLA or misses an agreed milestone deadline, Creatorly escrow officers initiate a full refund back to the brand account with zero penalty fees.',
                    isOrange: true
                  },
                  {
                    q: 'Can brands run paid ads with creator content (whitelisting)?',
                    a: 'Yes. Whitelisting / Spark Ads permission can be selected as a package deliverable. It grants the brand advertising rights to run Meta/YouTube ads through the creator\'s account for 30, 60, or 90 days.',
                    isOrange: false
                  },
                  {
                    q: 'How does Creatorly verify that creator metrics are real?',
                    a: 'Creators authenticate directly using official Meta Graph and Google YouTube Analytics OAuth. We pull verified 30-day views, authentic human audience ratios, and engagement velocity directly from the source APIs.',
                    isOrange: true
                  },
                  {
                    q: 'Does Creatorly handle GST invoices and TDS tax compliance?',
                    a: 'Yes. Automated GST-compliant invoices and formal TDS deduction certificates are generated for every completed milestone, ensuring smooth finance compliance for enterprise brands.',
                    isOrange: false
                  }
                ]
                  .filter((item) => item.q.toLowerCase().includes(supportFaqSearch.toLowerCase()) || item.a.toLowerCase().includes(supportFaqSearch.toLowerCase()))
                  .map((faq, idx) => (
                    <div key={idx} className={`faq-item-card ${faq.isOrange ? 'card-theme-orange' : 'card-theme-black'}`}>
                      <button
                        type="button"
                        className="faq-question-btn"
                        onClick={() => setExpandedFaqIndex(expandedFaqIndex === idx ? null : idx)}
                      >
                        <span className={faq.isOrange ? 'text-black' : 'text-white'}>{faq.q}</span>
                        <ChevronRight size={18} className={`faq-chevron ${faq.isOrange ? 'text-black' : 'text-orange'} ${expandedFaqIndex === idx ? 'rotated' : ''}`} />
                      </button>
                      {expandedFaqIndex === idx && (
                        <div className="faq-answer-body">
                          <p className={faq.isOrange ? 'text-black-p' : ''}>{faq.a}</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              {/* Submit Support Ticket Card */}
              <div className="support-ticket-card card-theme-black" style={{ marginTop: '36px' }}>
                <h3>Still need help? Open a direct support ticket</h3>
                <p>Our concierge response team responds in under an hour during business hours.</p>

                {supportTicketSubmitted ? (
                  <div className="apply-success-state">
                    <div className="success-icon"><Check size={28} /></div>
                    <h4>Support Ticket #{supportTicketId} Created</h4>
                    <p>A confirmation email has been dispatched. An escrow concierge is reviewing your request.</p>
                  </div>
                ) : (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const newId = `CR-${Date.now().toString().slice(-4)}`;
                    setSupportTicketId(newId);
                    setSupportTicketSubmitted(true);
                    saveSupportTicketToSupabase({
                      ticketId: newId,
                      nameAndEmail: supportNameAndEmail || 'Anonymous Inquirer',
                      topic: supportTopic,
                      description: supportDescription
                    });
                    onShowToast(`Support ticket #${newId} submitted to escrow concierge!`);
                  }} className="apply-form-grid" style={{ marginTop: '20px' }}>
                    <div className="form-field">
                      <label>Your Name & Email *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Priya Sharma (priya@brand.com)"
                        value={supportNameAndEmail}
                        onChange={(e) => setSupportNameAndEmail(e.target.value)}
                      />
                    </div>
                    <div className="form-field">
                      <label>Issue Topic</label>
                      <select
                        value={supportTopic}
                        onChange={(e) => setSupportTopic(e.target.value)}
                      >
                        <option>Escrow Payment & Milestone Release</option>
                        <option>Creator Communication / SLA</option>
                        <option>GST & Tax Invoice Inquiries</option>
                        <option>Account Verification</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label>Describe your question or deal reference</label>
                      <textarea 
                        rows={3} 
                        required 
                        placeholder="Referencing campaign #REF-2026..."
                        value={supportDescription}
                        onChange={(e) => setSupportDescription(e.target.value)}
                      />
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
              <div className="editorial-grid-3col">
                <div className="feature-block card-theme-black">
                  <Users size={24} className="text-orange" />
                  <h4>Master Escrow Account</h4>
                  <p>Fund multi-creator campaigns from a single centralized agency deposit, with itemized sub-client invoices.</p>
                </div>

                <div className="feature-block card-theme-orange">
                  <FileText size={24} className="text-black" />
                  <h4 className="text-black">White-Label Dashboards</h4>
                  <p className="text-black-p">Send branded live links to your clients to approve scripts, view video cuts, and track ROI without mentioning Creatorly.</p>
                </div>

                <div className="feature-block card-theme-black">
                  <DollarSign size={24} className="text-orange" />
                  <h4>Volume Fee Discounts</h4>
                  <p>Tiered platform fees dropping from 5% to 1.5% for agencies executing over ₹25 Lakhs per quarter.</p>
                </div>
              </div>

              {/* Agency Consultation Booking Card */}
              <div className="split-simulator-container" style={{ marginTop: '30px' }}>
                <div className="sim-black-panel">
                  {agencyDemoBooked ? (
                    <div className="apply-success-state">
                      <div className="success-icon"><Check size={32} /></div>
                      <h4>Agency Onboarding Confirmed!</h4>
                      <p>
                        Reference ID: <strong className="text-orange">AGN-DEMO-9842</strong>. Our Enterprise Partnerships team will reach out to <strong>{agencyEmail || 'your agency'}</strong> within 4 business hours with custom master contracts and consolidated invoicing.
                      </p>
                      <button 
                        type="button" 
                        className="btn-action-primary"
                        style={{ marginTop: '14px' }}
                        onClick={() => setAgencyDemoBooked(false)}
                      >
                        Book Another Consultation
                      </button>
                    </div>
                  ) : (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        saveAgencyLeadToSupabase({
                          agencyName: agencyName || 'Enterprise Agency Partner',
                          agencyEmail: agencyEmail,
                          spendTarget: agencySpend
                        });
                        setAgencyDemoBooked(true);
                        onShowToast('Agency consultation confirmed! Reference #AGN-DEMO-9842');
                      }}
                      className="apply-form-grid"
                    >
                      <h4 style={{ margin: '0 0 4px', fontSize: '1.15rem' }}>Schedule Agency Partner Consultation</h4>
                      <p style={{ color: '#828E86', fontSize: '0.82rem', marginBottom: '14px' }}>
                        Get custom multi-creator escrow vaults, unified monthly GST tax invoicing, and dedicated talent management.
                      </p>

                      <div className="form-field">
                        <label>Agency / Holding Company Name *</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="Ogilvy, Schbang, or Dentsu"
                          value={agencyName}
                          onChange={(e) => setAgencyName(e.target.value)}
                        />
                      </div>

                      <div className="form-field">
                        <label>Agency Work Email *</label>
                        <input 
                          type="email" 
                          required 
                          placeholder="partnerships@agency.com"
                          value={agencyEmail}
                          onChange={(e) => setAgencyEmail(e.target.value)}
                        />
                      </div>

                      <div className="form-field">
                        <label>Quarterly Creator Volume Target</label>
                        <select 
                          value={agencySpend}
                          onChange={(e) => setAgencySpend(e.target.value)}
                        >
                          <option>₹10 Lakhs - ₹25 Lakhs / Quarter</option>
                          <option>₹25 Lakhs - ₹50 Lakhs / Quarter</option>
                          <option>₹50 Lakhs - ₹1 Crore / Quarter</option>
                          <option>₹1 Crore+ / Enterprise Volume</option>
                        </select>
                      </div>

                      <button type="submit" className="btn-action-primary">
                        <span>Schedule Onboarding Call</span>
                        <ArrowRight size={15} />
                      </button>
                    </form>
                  )}
                </div>

                <div className="sim-orange-panel">
                  <h3 className="text-black" style={{ margin: '0 0 16px' }}>Agency Master Benefits</h3>
                  <div className="orange-guarantee-stack">
                    <div className="orange-guarantee-item">
                      <h4 className="text-black">1 Consolidated Monthly Invoice</h4>
                      <p className="text-black-p">Manage 20+ creators under 1 single monthly vendor invoice with input GST tax credit compliance.</p>
                    </div>
                    <div className="orange-guarantee-item">
                      <h4 className="text-black">SLA Guarantee</h4>
                      <p className="text-black-p">100% refund guarantee if creator drops out or fails to deliver within the contract SLA window.</p>
                    </div>
                    <div className="orange-guarantee-item">
                      <h4 className="text-black">Need Quick Campaign Roster?</h4>
                      <p className="text-black-p">Explore our verified creators across all categories now.</p>
                      <button 
                        type="button" 
                        className="btn-banner-black"
                        style={{ marginTop: '8px' }}
                        onClick={() => onNavigateToPage('all-creators')}
                      >
                        Explore Creator Roster →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 15: Discord Community                                */}
          {/* ========================================================= */}
          {currentSlug === 'discord-community' && (
            <div className="page-section-block">
              {/* Channels Preview: Half Black, Half Orange */}
              <div className="discord-channels-grid">
                <div className="channel-box card-theme-black">
                  <span className="channel-name text-orange">#brand-leads</span>
                  <p>Verified brands post active briefs seeking creators with budgets attached.</p>
                </div>
                <div className="channel-box card-theme-orange">
                  <span className="channel-name text-black">#rate-card-transparency</span>
                  <p className="text-black-p">Anonymous discussions on what to charge for tech reviews, reels, and whitelisting.</p>
                </div>
                <div className="channel-box card-theme-orange">
                  <span className="channel-name text-black">#script-and-hook-critique</span>
                  <p className="text-black-p">Get constructive feedback on opening 5 seconds of your video before shooting.</p>
                </div>
                <div className="channel-box card-theme-black">
                  <span className="channel-name text-orange">#gear-and-acoustics</span>
                  <p>Microphone recommendations, lighting hacks, and LUTs shared by veteran creators.</p>
                </div>
              </div>

              {/* Direct Discord Community Join Banner */}
              <div style={{ marginTop: '28px', textAlign: 'center', padding: '32px 24px', background: '#0F172A', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ color: '#FFFFFF', marginBottom: '8px', fontSize: '1.35rem' }}>Join 4,200+ Creators & Brand Marketers on Discord</h3>
                <p style={{ color: '#94A3B8', maxWidth: '540px', margin: '0 auto 20px', fontSize: '0.88rem' }}>
                  Daily rate card discussions, instant brief alerts, constructive script critique clinics, and creator economy insights.
                </p>
                <div style={{ display: 'inline-flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button
                    type="button"
                    className="btn-action-primary"
                    style={{ background: '#5865F2', borderColor: '#5865F2', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => {
                      navigator.clipboard?.writeText('https://discord.gg/creatorly-hq');
                      onShowToast('Copied invite link: discord.gg/creatorly-hq! Opening Discord...');
                      window.open('https://discord.com', '_blank');
                    }}
                  >
                    <span>Join Creatorly Discord (discord.gg/creatorly-hq)</span>
                    <ArrowUpRight size={15} />
                  </button>
                  <button
                    type="button"
                    className="btn-close-box"
                    style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '10px 18px', color: '#E2E8F0' }}
                    onClick={() => onShowToast('Community Guidelines: Zero self-promo spam, respectful rate discussions only.')}
                  >
                    Community Guidelines
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 16: All Creators Directory                           */}
          {/* ========================================================= */}
          {currentSlug === 'all-creators' && (
            <div className="page-section-block">
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

              {/* Creator Cards Grid: Half Black Cards, Half Orange Cards */}
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
                  .map((creator, idx) => {
                    const isOrangeCard = idx % 2 === 1;
                    return (
                      <div 
                        key={creator.id} 
                        className={`creator-roster-card ${isOrangeCard ? 'card-theme-orange' : 'card-theme-black'}`}
                        onClick={() => {
                          onSelectCreator(creator);
                          onReturnToHome();
                          onShowToast(`Viewing ${creator.fullName}'s verified profile`);
                        }}
                      >
                        <div className="creator-card-img-wrap">
                          <img src={creator.avatarUrl} alt={creator.fullName} />
                          <span className={isOrangeCard ? 'card-badge-verified-black' : 'card-badge-verified'}>✓ Verified</span>
                        </div>
                        <div className="creator-card-info">
                          <div className="card-name-row">
                            <h4 className={isOrangeCard ? 'text-black' : ''}>{creator.fullName}</h4>
                            <ArrowUpRight size={16} className={isOrangeCard ? 'text-black' : 'text-orange'} />
                          </div>
                          <span className={`card-handle ${isOrangeCard ? 'text-black-sub' : ''}`}>{creator.handle}</span>
                          <span className={isOrangeCard ? 'card-niche-tag-black' : 'card-niche-tag'}>{creator.primaryNiche}</span>
                          
                          <div className={`card-metrics-row ${isOrangeCard ? 'metrics-row-orange' : ''}`}>
                            <div>
                              <span className={`metric-title ${isOrangeCard ? 'text-black-sub' : ''}`}>Audience</span>
                              <strong className={isOrangeCard ? 'text-black' : ''}>{creator.metrics?.totalAudience ? (creator.metrics.totalAudience / 1000).toFixed(0) + 'k' : '85k'}</strong>
                            </div>
                            <div>
                              <span className={`metric-title ${isOrangeCard ? 'text-black-sub' : ''}`}>Eng. Rate</span>
                              <strong className={isOrangeCard ? 'text-black' : 'text-orange'}>{creator.metrics?.engagementRate || 4.8}%</strong>
                            </div>
                            <div>
                              <span className={`metric-title ${isOrangeCard ? 'text-black-sub' : ''}`}>Starting</span>
                              <strong className={isOrangeCard ? 'text-black' : ''}>₹{creator.packages[0]?.priceInINR ? (creator.packages[0].priceInINR / 1000).toFixed(0) + 'k' : '3k'}</strong>
                            </div>
                          </div>

                          <button 
                            type="button" 
                            className={isOrangeCard ? 'btn-card-book-black' : 'btn-card-book'}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onOpenBookingModal) {
                                onOpenBookingModal(creator);
                              } else {
                                onSelectCreator(creator);
                                onReturnToHome();
                              }
                            }}
                          >
                            <span>View Profile & Rate Card</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 17: Technology & AI                                  */}
          {/* ========================================================= */}
          {currentSlug === 'tech-ai-creators' && (
            <div className="page-section-block">
              <div className="roster-grid">
                {creators
                  .filter((c) => c.primaryNiche.toLowerCase().includes('tech') || c.primaryNiche.toLowerCase().includes('edu') || c.id === 'cr_alex_sharma')
                  .map((creator, idx) => {
                    const isOrange = idx % 2 === 1;
                    return (
                      <div 
                        key={creator.id} 
                        className={`creator-roster-card ${isOrange ? 'card-theme-orange' : 'card-theme-black'}`}
                        onClick={() => {
                          onSelectCreator(creator);
                          onReturnToHome();
                          onShowToast(`Viewing ${creator.fullName}`);
                        }}
                      >
                        <div className="creator-card-img-wrap">
                          <img src={creator.avatarUrl} alt={creator.fullName} />
                          <span className={isOrange ? 'card-badge-verified-black' : 'card-badge-verified'}>✓ Tech Verified</span>
                        </div>
                        <div className="creator-card-info">
                          <h4 className={isOrange ? 'text-black' : ''}>{creator.fullName}</h4>
                          <span className={`card-handle ${isOrange ? 'text-black-sub' : ''}`}>{creator.handle}</span>
                          <p className={`card-bio-short ${isOrange ? 'text-black-p' : ''}`}>{creator.bio}</p>
                          <button type="button" className={isOrange ? 'btn-card-book-black' : 'btn-card-book'}>
                            <span>View Tech Rate Card →</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 18: SaaS & Dev Tools                                 */}
          {/* ========================================================= */}
          {currentSlug === 'saas-devtools-creators' && (
            <div className="page-section-block">
              <div className="editorial-grid-2col">
                <div className="info-card card-theme-black">
                  <Code2 size={26} className="text-orange" />
                  <h3>Hands-on Code Walkthroughs</h3>
                  <p>Creators build actual production samples integrating your API or SDK, demonstrating real developer velocity.</p>
                </div>
                <div className="info-card card-theme-orange">
                  <Laptop size={26} className="text-black" />
                  <h3 className="text-black">CLI & Terminal Tutorials</h3>
                  <p className="text-black-p">Authentic screencasts showcasing tool installations, configuration flags, and performance benchmarks.</p>
                </div>
              </div>

              {/* Verified SaaS & Developer Tool Creators Roster */}
              <div style={{ marginTop: '28px' }}>
                <h3 style={{ color: '#FFFFFF', marginBottom: '14px', fontSize: '1.25rem' }}>Verified SaaS & DevTool Creators</h3>
                <div className="roster-grid">
                  {creators
                    .filter((c) => c.primaryNiche.toLowerCase().includes('tech') || c.primaryNiche.toLowerCase().includes('ai') || c.subNiches.some(s => s.toLowerCase().includes('dev') || s.toLowerCase().includes('saas') || s.toLowerCase().includes('tool') || s.toLowerCase().includes('code')) || c.id === 'cr_alex_sharma')
                    .map((creator, idx) => {
                      const isOrange = idx % 2 === 1;
                      return (
                        <div 
                          key={creator.id} 
                          className={`creator-roster-card ${isOrange ? 'card-theme-orange' : 'card-theme-black'}`}
                          onClick={() => {
                            onSelectCreator(creator);
                            onReturnToHome();
                            onShowToast(`Viewing ${creator.fullName}`);
                          }}
                        >
                          <div className="creator-card-img-wrap">
                            <img src={creator.avatarUrl} alt={creator.fullName} />
                            <span className={isOrange ? 'card-badge-verified-black' : 'card-badge-verified'}>✓ SaaS Verified</span>
                          </div>
                          <div className="creator-card-info">
                            <h4 className={isOrange ? 'text-black' : ''}>{creator.fullName}</h4>
                            <span className={`card-handle ${isOrange ? 'text-black-sub' : ''}`}>{creator.handle}</span>
                            <p className={`card-bio-short ${isOrange ? 'text-black-p' : ''}`}>{creator.bio}</p>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                              <button 
                                type="button" 
                                className={isOrange ? 'btn-card-book-black' : 'btn-card-book'}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectCreator(creator);
                                  onReturnToHome();
                                }}
                              >
                                <span>View Rate Card →</span>
                              </button>
                              {onOpenBookingModal && (
                                <button 
                                  type="button" 
                                  className="btn-action-primary"
                                  style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenBookingModal(creator);
                                  }}
                                >
                                  Book Now
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 19: Consumer Tech                                    */}
          {/* ========================================================= */}
          {currentSlug === 'consumer-tech-creators' && (
            <div className="page-section-block">
              <div className="editorial-grid-3col">
                <div className="feature-block card-theme-black">
                  <Smartphone size={24} className="text-orange" />
                  <h4>Cinematic 4K B-Roll</h4>
                  <p>Immaculate macro product shots, motorized sliders, and studio lighting that elevates your industrial design.</p>
                </div>
                <div className="feature-block card-theme-orange">
                  <Star size={24} className="text-black" />
                  <h4 className="text-black">Honest 30-Day Testing</h4>
                  <p className="text-black-p">Audiences trust these reviews because creators provide balanced, insightful perspectives on real day-to-day usability.</p>
                </div>
                <div className="feature-block card-theme-black">
                  <Award size={24} className="text-orange" />
                  <h4>Verified Purchase Intent</h4>
                  <p>Our consumer tech creators drive an average 4.8% direct link click-through rate to product landing pages.</p>
                </div>
              </div>

              {/* Verified Consumer Tech Creators Roster */}
              <div style={{ marginTop: '28px' }}>
                <h3 style={{ color: '#FFFFFF', marginBottom: '14px', fontSize: '1.25rem' }}>Verified Consumer Electronics & Desk Setup Creators</h3>
                <div className="roster-grid">
                  {creators
                    .filter((c) => c.primaryNiche.toLowerCase().includes('tech') || c.primaryNiche.toLowerCase().includes('gadget') || c.primaryNiche.toLowerCase().includes('lifestyle') || c.id === 'cr_alex_sharma')
                    .map((creator, idx) => {
                      const isOrange = idx % 2 === 1;
                      return (
                        <div 
                          key={creator.id} 
                          className={`creator-roster-card ${isOrange ? 'card-theme-orange' : 'card-theme-black'}`}
                          onClick={() => {
                            onSelectCreator(creator);
                            onReturnToHome();
                            onShowToast(`Viewing ${creator.fullName}`);
                          }}
                        >
                          <div className="creator-card-img-wrap">
                            <img src={creator.avatarUrl} alt={creator.fullName} />
                            <span className={isOrange ? 'card-badge-verified-black' : 'card-badge-verified'}>✓ 4K Verified</span>
                          </div>
                          <div className="creator-card-info">
                            <h4 className={isOrange ? 'text-black' : ''}>{creator.fullName}</h4>
                            <span className={`card-handle ${isOrange ? 'text-black-sub' : ''}`}>{creator.handle}</span>
                            <p className={`card-bio-short ${isOrange ? 'text-black-p' : ''}`}>{creator.bio}</p>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                              <button 
                                type="button" 
                                className={isOrange ? 'btn-card-book-black' : 'btn-card-book'}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectCreator(creator);
                                  onReturnToHome();
                                }}
                              >
                                <span>View Rate Card →</span>
                              </button>
                              {onOpenBookingModal && (
                                <button 
                                  type="button" 
                                  className="btn-action-primary"
                                  style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenBookingModal(creator);
                                  }}
                                >
                                  Book Now
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 20: Apply as a Creator                               */}
          {/* ========================================================= */}
          {currentSlug === 'apply-creator' && (
            <div className="page-section-block" id="creator-apply-anchor">
              {/* 50% Black Admission Overview, 50% Orange Application Form */}
              <div className="split-simulator-container">
                <div className="sim-black-panel">
                  <h4>Creator Admission Requirements</h4>
                  <p>Creatorly maintains a 6% acceptance rate to protect brand trust and creator pricing power:</p>

                  <div className="orange-guarantee-stack" style={{ marginTop: '20px' }}>
                    <div className="feature-block card-theme-black" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                      <span className="text-orange" style={{ fontWeight: 800 }}>01. Direct API OAuth</span>
                      <p style={{ marginTop: '4px' }}>Must authenticate via Meta Graph or Google YouTube OAuth to verify genuine human metrics.</p>
                    </div>

                    <div className="feature-block card-theme-black" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                      <span className="text-orange" style={{ fontWeight: 800 }}>02. &lt; 2-Hour Response SLA</span>
                      <p style={{ marginTop: '4px' }}>Agreement to respond to active brand inquiries promptly during business hours.</p>
                    </div>

                    <div className="feature-block card-theme-black" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                      <span className="text-orange" style={{ fontWeight: 800 }}>03. Quality Craftsmanship</span>
                      <p style={{ marginTop: '4px' }}>Original production value, crisp audio mastering, and authentic audience engagement.</p>
                    </div>
                  </div>
                </div>

                <div className="sim-orange-panel">
                  {creatorApplicationSubmitted ? (
                    <div className="apply-success-state">
                      <div className="success-icon" style={{ background: '#000000', color: '#FF5500' }}><Check size={36} /></div>
                      <h3 className="text-black">Welcome to Creatorly, {applyLegalName || 'Creator'}!</h3>
                      <p className="text-black-p">
                        Your application has been fast-tracked. Your storefront for <strong>{applyHandle || '@creator'}</strong> is now officially provisioned in the directory.
                      </p>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '18px', flexWrap: 'wrap' }}>
                        <button 
                          type="button" 
                          className="btn-banner-black" 
                          onClick={() => {
                            if (createdNewCreator) {
                              onSelectCreator(createdNewCreator);
                            }
                            onReturnToHome();
                          }}
                        >
                          View My Live Storefront →
                        </button>
                        <button 
                          type="button" 
                          className="btn-action-primary"
                          style={{ padding: '8px 18px' }}
                          onClick={() => {
                            setCreatorApplicationSubmitted(false);
                            setApplyLegalName('');
                            setApplyHandle('');
                            setApplyEmail('');
                          }}
                        >
                          Submit Another Profile
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const newProfile: CreatorProfile = {
                          id: `creator-${Date.now()}`,
                          username: applyHandle.replace('@', '').toLowerCase() || 'newcreator',
                          fullName: applyLegalName || 'New Creator',
                          handle: applyHandle.startsWith('@') ? applyHandle : `@${applyHandle || 'creator'}`,
                          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
                          verifiedBadge: true,
                          verificationSource: 'Admissions Fast-Track',
                          reputationTier: 'emerging',
                          primaryNiche: applyNiche,
                          subNiches: [applyNiche, 'Creative Production', 'Sponsored Content'],
                          bio: `Independent creator specializing in ${applyNiche}. Verified Creatorly Storefront.`,
                          location: { city: 'Bengaluru', country: 'India', flagEmoji: '🇮🇳' },
                          languages: ['English', 'Hindi'],
                          socialLinks: [
                            { platform: 'youtube', name: 'YouTube', handle: applyHandle, url: `https://youtube.com/${applyHandle}`, followers: 85000, verified: true },
                            { platform: 'instagram', name: 'Instagram', handle: applyHandle, url: `https://instagram.com/${applyHandle.replace('@', '')}`, followers: 32000, verified: true }
                          ],
                          availability: {
                            status: 'available',
                            label: 'Open for Deals',
                            slotsRemaining: 4,
                            totalSlots: 5,
                            earliestDelivery: 'Within 5 business days',
                            responseTime: '< 3 hours'
                          },
                          metrics: {
                            totalAudience: 117000,
                            averageViews: 28000,
                            engagementRate: 4.6,
                            targetMarketPercentage: 78,
                            targetMarketCountry: 'India',
                            lastUpdatedDaysAgo: 1,
                            ageDistribution: [{ label: '18-24', percentage: 42 }, { label: '25-34', percentage: 48 }],
                            genderDistribution: [{ label: 'Male', percentage: 65 }, { label: 'Female', percentage: 35 }],
                            topGeographies: [{ country: 'India', code: 'IN', percentage: 80 }],
                            topCities: [{ city: 'Mumbai', percentage: 30 }, { city: 'Bengaluru', percentage: 35 }],
                            platformFollowers: { youtube: 85000, instagram: 32000, linkedin: 15000 }
                          },
                          portfolio: [
                            {
                              id: '01',
                              title: `${applyNiche} Flagship Sponsor Showcase`,
                              category: 'Sponsored Video',
                              format: 'YouTube Integration',
                              platform: 'youtube',
                              thumbnailUrl: '/images/work-flagship-clean.jpg',
                              publishedDate: 'October 2026',
                              views: 45000,
                              engagement: 5.2,
                              brandClient: 'Creatorly Partner Brand',
                              campaignObjective: 'Feature Walkthrough',
                              deliverableSummary: '60s Dedicated Sponsor Segment with tracking URL',
                              originalUrl: 'https://youtube.com',
                              verifiedMetrics: true
                            }
                          ],
                          packages: [
                            {
                              id: 'pkg-1',
                              title: 'Dedicated Sponsor Integration',
                              tagline: 'Prime 60-90s mid-roll spotlight',
                              priceInINR: applyFeeTarget || 25000,
                              platform: 'YouTube',
                              deliveryDays: 5,
                              includedRevisions: 2,
                              publishingIncluded: true,
                              organicUsageDays: 365,
                              paidUsageRightsIncluded: false,
                              deliverables: ['60-90s Integrated Segment', 'Pinned Comment with Link', 'Story Promotion'],
                              bestFor: 'Targeted niche brand conversions'
                            }
                          ],
                          addOns: [
                            { id: 'rush', name: '48h Rush Delivery', description: 'Priority filming and expedited turnaround', priceInINR: 3000, unit: 'per campaign' }
                          ],
                          reviews: [
                            {
                              id: 'rev-welcome',
                              brandName: 'Creatorly Admissions',
                              brandLogo: 'CR',
                              reviewerName: 'Platform Verification',
                              reviewerRole: 'Editorial Committee',
                              campaignType: 'Onboarding Audit',
                              rating: 5,
                              date: 'Today',
                              content: 'Creator application verified via direct API token handshake. Metrics, reach velocity, and rate card verified authentic.',
                              verifiedTransaction: true
                            }
                          ],
                          overallRating: 5.0,
                          totalReviews: 1,
                          faqs: [
                            { id: 'f-1', question: 'What is your turnaround time?', answer: 'Typical turnaround is 5 business days after script signoff.', category: 'deliverables' }
                          ],
                          collaborationTerms: {
                            paymentPolicy: '100% Milestone Escrow deposit before filming.',
                            revisionPolicy: 'Up to 2 revision rounds on script & video rough cut.',
                            cancellationPolicy: 'Full refund if canceled prior to script signoff.',
                            exclusivityNotice: 'Non-exclusive unless add-on is selected.'
                          }
                        };
                        setCreatedNewCreator(newProfile);
                        if (onCreatorCreated) {
                          onCreatorCreated(newProfile);
                        }
                        setCreatorApplicationSubmitted(true);
                        onShowToast(`Congratulations ${newProfile.fullName}! Your creator storefront is live.`);
                      }} 
                      className="apply-form-grid"
                    >
                      <h3 className="text-black" style={{ margin: '0 0 8px' }}>Creator Admission Application</h3>
                      
                      <div className="form-field">
                        <label className="text-black" style={{ fontWeight: 800 }}>Full Legal Name *</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="Alex Sharma" 
                          className="input-orange-theme"
                          value={applyLegalName}
                          onChange={(e) => setApplyLegalName(e.target.value)}
                        />
                      </div>

                      <div className="form-field">
                        <label className="text-black" style={{ fontWeight: 800 }}>Channel Handle / URL *</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="@alexbuilds (YouTube or Instagram)" 
                          className="input-orange-theme"
                          value={applyHandle}
                          onChange={(e) => setApplyHandle(e.target.value)}
                        />
                      </div>

                      <div className="form-field">
                        <label className="text-black" style={{ fontWeight: 800 }}>Email Address *</label>
                        <input 
                          type="email" 
                          required 
                          placeholder="alex@gmail.com" 
                          className="input-orange-theme"
                          value={applyEmail}
                          onChange={(e) => setApplyEmail(e.target.value)}
                        />
                      </div>

                      <div className="form-field">
                        <label className="text-black" style={{ fontWeight: 800 }}>Primary Content Niche *</label>
                        <select 
                          required 
                          className="input-orange-theme"
                          value={applyNiche}
                          onChange={(e) => setApplyNiche(e.target.value)}
                        >
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
                        <label className="text-black" style={{ fontWeight: 800 }}>Starting Sponsorship Fee Target ({currentCurrency})</label>
                        <input 
                          type="number" 
                          placeholder="25000" 
                          className="input-orange-theme"
                          value={applyFeeTarget}
                          onChange={(e) => setApplyFeeTarget(Number(e.target.value))}
                        />
                      </div>

                      <button type="submit" className="btn-banner-black" style={{ marginTop: '12px', justifyContent: 'center' }}>
                        <span>Submit Creator Application</span>
                        <Send size={15} />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          5. MINIMAL OBSIDIAN BLACK FOOTER (WITHOUT the 4-column options list)
      ────────────────────────────────────────────────────────────── */}
      <footer className="info-fullwin-footer">
        <div className="fresh-content-container fullwin-footer-inner">
          <div className="fullwin-brand-meta">
            <button 
              type="button" 
              className="footer-brand-btn"
              onClick={onReturnToHome}
            >
              <CreatorlyLogo width={24} height={20} />
              <span className="footer-brand-text">creatorly<span className="logo-dot-orange">.</span></span>
            </button>
            <p className="fullwin-brand-tagline">
              The global marketplace connecting visionary brands with audited creators. Bank-grade milestone escrow.
            </p>
            <div className="footer-trust-chips-row">
              <span className="footer-chip-badge">🛡️ Bank-Grade Escrow Vault</span>
              <span className="footer-chip-badge">🟢 All Systems Operational</span>
            </div>
          </div>

          <div className="fullwin-actions-meta">
            <span className="fullwin-copyright">© 2026 Creatorly Technologies Inc. All rights reserved.</span>
            <div className="fullwin-btn-row">
              <button 
                type="button" 
                className="btn-back-to-top"
                onClick={() => {
                  const el = document.getElementById('marketplace-info-fullwindow');
                  if (el) el.scrollTo({ top: 0, behavior: 'smooth' });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Back to Top ↑
              </button>
              <button 
                type="button" 
                className="btn-footer-return"
                onClick={onReturnToHome}
              >
                Back to Storefront
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          6. NOIR & ELECTRIC ORANGE DESIGN SYSTEM (Half Black & Half Orange)
      ────────────────────────────────────────────────────────────── */}
      <style>{`
        .marketplace-info-page {
          background-color: #070709;
          color: #EDEDED;
          font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          overflow-y: auto;
          overflow-x: hidden;
          z-index: 9999;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }

        .fresh-content-container {
          width: 100%;
          max-width: 1320px;
          margin: 0 auto;
          padding-left: clamp(20px, 4vw, 48px);
          padding-right: clamp(20px, 4vw, 48px);
          box-sizing: border-box;
        }

        /* Typography & Color Utility Classes */
        .text-orange { color: #FF5500 !important; }
        .text-black { color: #000000 !important; }
        .text-white { color: #FFFFFF !important; }
        .text-white-glow { 
          color: #FFFFFF !important; 
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.25); 
        }
        .text-black-p { color: rgba(0, 0, 0, 0.82) !important; line-height: 1.55; }
        .text-black-sub { color: rgba(0, 0, 0, 0.65) !important; font-size: 0.78rem; }
        .logo-dot-orange { color: #FF5500; font-weight: 900; }
        .text-yellow-sparkle { color: #FACC15; }

        /* ─────────────────────────────────────────────────────────────
           TOP HALF: SOLID VIBRANT ORANGE SHOWCASE (Matching User Screenshot)
        ────────────────────────────────────────────────────────────── */
        .duotone-top-orange-hero {
          background: #FF5B26;
          color: #000000;
          padding: clamp(60px, 9vh, 96px) 0 clamp(48px, 7vh, 72px);
          position: relative;
          border-bottom: 2px solid #000000;
        }

        .hero-orange-inner {
          position: relative;
        }

        .hero-orange-content {
          max-width: 860px;
          margin: 0 auto;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-eyebrow-black {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #000000;
          background: rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.18);
          padding: 4px 14px;
          border-radius: 9999px;
          margin-bottom: 20px;
        }

        .hero-orange-headline {
          font-size: clamp(2.4rem, 5.5vw, 4.4rem);
          font-weight: 950;
          line-height: 1.06;
          letter-spacing: -0.04em;
          color: #000000;
          margin: 0 0 18px;
        }

        .hero-orange-subtitle {
          font-size: clamp(1.05rem, 1.5vw, 1.25rem);
          line-height: 1.55;
          color: rgba(0, 0, 0, 0.82);
          max-width: 680px;
          margin: 0 0 28px;
          font-weight: 500;
        }

        .hero-orange-action-row {
          margin-bottom: 12px;
        }

        .btn-hero-black {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #18191E;
          color: #FFFFFF;
          border: 1px solid #18191E;
          padding: 14px 32px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.18s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
        }

        .btn-hero-black:hover {
          background: #000000;
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
        }

        .hero-orange-microcopy {
          font-size: 0.8rem;
          color: rgba(0, 0, 0, 0.55);
          font-weight: 500;
        }

        .hero-star-bottom {
          position: absolute;
          bottom: 0px;
          right: clamp(10px, 5vw, 40px);
          opacity: 0.9;
          animation: floatStar 3s ease-in-out infinite alternate;
        }

        @keyframes floatStar {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-8px) rotate(8deg); }
        }

        /* ─────────────────────────────────────────────────────────────
           BOTTOM HALF: DEEP OBSIDIAN BLACK CONTENT
        ────────────────────────────────────────────────────────────── */
        .info-main-content {
          flex: 1;
          background: #070709;
          padding: 48px 0 80px;
        }

        .info-subnav-section {
          background: #0B0E14;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 14px 0;
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
          background: #11141B;
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #A1A1AA;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .subnav-pill:hover {
          border-color: rgba(255, 85, 0, 0.3);
          color: #FFFFFF;
          background: #181C26;
        }

        .subnav-pill.active {
          background: #FF5500;
          border-color: #FF5500;
          color: #FFFFFF;
          font-weight: 800;
          box-shadow: 0 0 16px rgba(255, 85, 0, 0.35);
        }

        .subnav-badge {
          background: #000000;
          color: #FF5500;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 7px;
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
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.06);
        }

        .quick-cat-btn.active {
          color: #FF5500;
          font-weight: 800;
        }

        /* ─────────────────────────────────────────────────────────────
           GRIDS & THEME CARDS: Half Black / Half Orange Cards
        ────────────────────────────────────────────────────────────── */
        .metrics-strip-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
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
          border-radius: 18px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .box-theme-black {
          background: #0E1015;
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #FFFFFF;
        }

        .box-theme-orange {
          background: #FF5500;
          border: 1px solid rgba(0, 0, 0, 0.15);
          color: #000000;
        }

        .metric-number {
          font-size: 2.2rem;
          font-weight: 900;
          letter-spacing: -0.03em;
        }

        .metric-label {
          font-size: 0.95rem;
          font-weight: 700;
        }

        .metric-sub {
          font-size: 0.78rem;
          color: #71717A;
        }

        .editorial-grid-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
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
        }

        @media (max-width: 960px) {
          .editorial-grid-3col {
            grid-template-columns: 1fr;
          }
        }

        .info-card {
          border-radius: 20px;
          padding: 32px;
          transition: all 0.2s ease;
        }

        .card-theme-black {
          background: #0E1015 !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          color: #FFFFFF !important;
        }

        .card-theme-black:hover {
          border-color: rgba(255, 85, 0, 0.4) !important;
          box-shadow: 0 12px 32px rgba(255, 85, 0, 0.12) !important;
          transform: translateY(-2px);
        }

        .card-theme-orange {
          background: #FF5500 !important;
          border: 1px solid rgba(0, 0, 0, 0.15) !important;
          color: #000000 !important;
        }

        .card-theme-orange:hover {
          box-shadow: 0 12px 32px rgba(255, 85, 0, 0.45) !important;
          transform: translateY(-2px);
        }

        .info-card-icon {
          margin-bottom: 18px;
        }

        .info-card h3 {
          font-size: 1.25rem;
          font-weight: 800;
          margin: 0 0 10px;
          letter-spacing: -0.02em;
        }

        .info-card p {
          font-size: 0.95rem;
          color: #A1A1AA;
          line-height: 1.6;
          margin: 0;
        }

        .feature-block {
          border-radius: 16px;
          padding: 24px;
          transition: all 0.2s ease;
        }

        .feature-block h4 {
          font-size: 1.1rem;
          font-weight: 800;
          margin: 14px 0 8px;
          color: #FFFFFF;
        }

        .feature-block p {
          font-size: 0.88rem;
          color: #A1A1AA;
          line-height: 1.55;
          margin: 0;
        }

        /* ─────────────────────────────────────────────────────────────
           SPLIT DUAL-TONE SIMULATOR & PANELS (50% Black / 50% Orange)
        ────────────────────────────────────────────────────────────── */
        .split-simulator-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
        }

        @media (max-width: 900px) {
          .split-simulator-container {
            grid-template-columns: 1fr;
          }
        }

        .sim-black-panel {
          background: #0B0E14;
          padding: 36px;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .sim-black-panel h4 {
          font-size: 1.35rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 6px;
        }

        .sim-black-panel p {
          font-size: 0.9rem;
          color: #A1A1AA;
          margin: 0 0 20px;
        }

        .sim-orange-panel {
          background: #FF5500;
          padding: 36px;
          color: #000000;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .orange-panel-header h3 {
          font-size: 1.35rem;
          font-weight: 900;
          color: #000000;
          margin: 6px 0 20px;
        }

        .orange-pill-tag {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 800;
          background: #000000;
          color: #FFFFFF;
          padding: 2px 10px;
          border-radius: 9999px;
          letter-spacing: 0.06em;
        }

        .milestone-stages-grid-duo {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .stage-box-duo {
          background: rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.15);
          border-radius: 14px;
          padding: 16px 20px;
        }

        .stage-num-badge {
          font-size: 0.72rem;
          font-weight: 800;
          color: #000000;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .stage-box-duo h5 {
          font-size: 1.05rem;
          font-weight: 800;
          color: #000000;
          margin: 0 0 4px;
        }

        .stage-box-duo p {
          font-size: 0.82rem;
          color: rgba(0, 0, 0, 0.75);
          line-height: 1.45;
          margin: 0 0 8px;
        }

        .stage-amount-duo {
          font-size: 1.3rem;
          font-weight: 900;
          color: #FFFFFF;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .audit-score-col-duo {
          background: #11141B;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          padding: 24px;
          text-align: center;
          margin-top: 12px;
        }

        .audit-details-orange-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .audit-row-duo {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(0, 0, 0, 0.12);
          padding-bottom: 8px;
          font-size: 0.88rem;
        }

        .audit-label-duo {
          font-weight: 600;
          color: rgba(0, 0, 0, 0.7);
        }

        .audit-val-duo {
          font-weight: 800;
          color: #000000;
        }

        .orange-guarantee-stack {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .orange-guarantee-item {
          background: rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 14px;
          padding: 16px 20px;
        }

        /* ─────────────────────────────────────────────────────────────
           STANDARDS, JOBS & BUTTONS
        ────────────────────────────────────────────────────────────── */
        .standards-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .standard-item {
          border-radius: 16px;
          padding: 28px;
          display: flex;
          align-items: flex-start;
          gap: 24px;
          transition: all 0.15s ease;
        }

        .std-number {
          font-size: 1.6rem;
          font-weight: 900;
          min-width: 44px;
        }

        .std-content h4 {
          font-size: 1.2rem;
          font-weight: 800;
          margin: 0 0 6px;
          color: #FFFFFF;
        }

        .std-content p {
          margin: 0;
          color: #A1A1AA;
          line-height: 1.55;
          font-size: 0.95rem;
        }

        .jobs-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .job-card {
          border-radius: 18px;
          padding: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          transition: all 0.2s ease;
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
          background: rgba(255, 85, 0, 0.12);
          color: #FF5500;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 9999px;
        }

        .job-pill-loc, .job-pill-comp {
          background: #11141B;
          color: #A1A1AA;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .job-pill-dept-black {
          background: #000000;
          color: #FFFFFF;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 9999px;
        }

        .job-pill-loc-black, .job-pill-comp-black {
          background: rgba(0, 0, 0, 0.12);
          color: #000000;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 9999px;
        }

        .job-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 8px;
        }

        .job-desc {
          font-size: 0.95rem;
          color: #A1A1AA;
          margin: 0;
          line-height: 1.5;
        }

        .btn-apply-job-orange {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #FF5500;
          color: #FFFFFF;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 0 16px rgba(255, 85, 0, 0.3);
        }

        .btn-apply-job-black {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #000000;
          color: #FFFFFF;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }

        .btn-banner-black {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #000000;
          color: #FFFFFF;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 0.88rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        }

        .btn-banner-black:hover {
          background: #181920;
          transform: translateY(-2px);
        }

        .btn-download-orange {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: #FF5500;
          color: #FFFFFF;
          border: none;
          padding: 10px 16px;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          margin-top: auto;
          transition: all 0.15s ease;
        }

        .btn-download-black {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: #000000;
          color: #FFFFFF;
          border: none;
          padding: 10px 16px;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          margin-top: auto;
          transition: all 0.15s ease;
        }

        .btn-press-read-orange {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #FF5500;
          color: #FFFFFF;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-press-read-black {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #000000;
          color: #FFFFFF;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-action-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #FF5500;
          color: #FFFFFF;
          border: none;
          padding: 14px 28px;
          border-radius: 12px;
          font-size: 0.92rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 0 20px rgba(255, 85, 0, 0.35);
        }

        .btn-action-primary:hover {
          background: #FF6600;
          transform: translateY(-2px);
          box-shadow: 0 0 28px rgba(255, 85, 0, 0.55);
        }

        /* ─────────────────────────────────────────────────────────────
           ROSTER GRID: Alternating Black & Orange Cards
        ────────────────────────────────────────────────────────────── */
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
          border-radius: 18px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .creator-card-img-wrap {
          position: relative;
          aspect-ratio: 1/1;
          width: 100%;
          overflow: hidden;
          background: #11141B;
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
          background: #000000;
          color: #FF5500;
          border: 1px solid rgba(255, 85, 0, 0.3);
          font-size: 0.72rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .card-badge-verified-black {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #000000;
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
          color: #FFFFFF;
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
          color: #FF5500;
          background: rgba(255, 85, 0, 0.12);
          padding: 2px 8px;
          border-radius: 6px;
          margin-bottom: 14px;
        }

        .card-niche-tag-black {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 700;
          color: #000000;
          background: rgba(0, 0, 0, 0.12);
          padding: 2px 8px;
          border-radius: 6px;
          margin-bottom: 14px;
        }

        .card-bio-short {
          font-size: 0.85rem;
          color: #A1A1AA;
          line-height: 1.5;
          margin: 0 0 16px;
        }

        .card-metrics-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          background: #11141B;
          border-radius: 10px;
          padding: 10px;
          margin-bottom: 16px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .metrics-row-orange {
          background: rgba(0, 0, 0, 0.1) !important;
          border: 1px solid rgba(0, 0, 0, 0.12) !important;
        }

        .metric-title {
          font-size: 0.7rem;
          color: #71717A;
          display: block;
        }

        .btn-card-book {
          width: 100%;
          background: #11141B;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #FFFFFF;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .creator-roster-card:hover .btn-card-book {
          background: #FF5500;
          border-color: #FF5500;
          color: #FFFFFF;
        }

        .btn-card-book-black {
          width: 100%;
          background: #000000;
          border: none;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #FFFFFF;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-card-book-black:hover {
          background: #181C26;
        }

        /* ─────────────────────────────────────────────────────────────
           TOP NAV & GENERAL STYLES
        ────────────────────────────────────────────────────────────── */
        .info-top-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(7, 7, 9, 0.95);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(16px);
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
          color: #FFFFFF;
        }

        .info-nav-divider {
          color: rgba(255, 255, 255, 0.2);
          font-weight: 300;
        }

        .info-breadcrumb-category {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: #FF5500;
        }

        .info-breadcrumb-current {
          font-size: 0.85rem;
          font-weight: 600;
          color: #FFFFFF;
        }

        .info-nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .quick-switch-dropdown-wrap {
          position: relative;
        }

        .btn-dropdown-trigger {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #11141B;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #E4E4E7;
          font-size: 0.82rem;
          font-weight: 600;
          padding: 8px 14px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-dropdown-trigger:hover {
          border-color: #FF5500;
          color: #FFFFFF;
          background: #181C26;
        }

        .btn-dropdown-trigger svg.rotated {
          transform: rotate(180deg);
        }

        .quick-switch-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 320px;
          max-height: 480px;
          overflow-y: auto;
          background: #0E1015;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7);
          padding: 12px;
          z-index: 1000;
        }

        .switch-menu-header {
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #FF5500;
          padding: 6px 12px 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 8px;
        }

        .switch-cat-group {
          margin-bottom: 12px;
        }

        .switch-cat-title {
          font-size: 0.68rem;
          font-weight: 700;
          color: #71717A;
          padding: 4px 12px;
          letter-spacing: 0.05em;
        }

        .switch-item-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: none;
          border: none;
          padding: 8px 12px;
          border-radius: 8px;
          color: #D4D4D8;
          font-size: 0.82rem;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
          transition: all 0.12s ease;
        }

        .switch-item-btn:hover {
          background: rgba(255, 85, 0, 0.1);
          color: #FFFFFF;
        }

        .switch-item-btn.active {
          background: #FF5500;
          color: #FFFFFF;
          font-weight: 700;
        }

        .switch-badge {
          background: rgba(255, 255, 255, 0.2);
          font-size: 0.65rem;
          padding: 1px 6px;
          border-radius: 9999px;
        }

        .btn-back-storefront {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #11141B;
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 8px 16px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #E4E4E7;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-back-storefront:hover {
          background: #181C26;
          border-color: rgba(255, 255, 255, 0.3);
          color: #FFFFFF;
        }

        .esc-key-tag {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          color: #A1A1AA;
        }

        .btn-cta-nav {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #FF5500;
          color: #FFFFFF;
          border: none;
          padding: 8px 18px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-cta-nav:hover {
          background: #FF6600;
          box-shadow: 0 0 16px rgba(255, 85, 0, 0.4);
        }

        .btn-close-window {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #11141B;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #A1A1AA;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-close-window:hover {
          background: #FF5500;
          color: #FFFFFF;
          border-color: #FF5500;
        }

        /* ─────────────────────────────────────────────────────────────
           MINIMAL OBSIDIAN BLACK FOOTER (WITHOUT 4-column options)
        ────────────────────────────────────────────────────────────── */
        .info-fullwin-footer {
          background: #0B0E14;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding: 36px 0 40px;
          margin-top: auto;
        }

        .fullwin-footer-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
        }

        .fullwin-brand-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .footer-brand-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .footer-brand-text {
          font-size: 1.25rem;
          font-weight: 800;
          color: #FFFFFF;
        }

        .fullwin-brand-tagline {
          font-size: 0.85rem;
          color: #71717A;
          margin: 0;
          max-width: 480px;
        }

        .footer-trust-chips-row {
          display: flex;
          gap: 12px;
          margin-top: 4px;
        }

        .footer-chip-badge {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 0.72rem;
          color: #D4D4D8;
          font-weight: 600;
        }

        .fullwin-actions-meta {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .fullwin-copyright {
          font-size: 0.78rem;
          color: #71717A;
        }

        .fullwin-btn-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-back-to-top {
          background: #11141B;
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #D4D4D8;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-back-to-top:hover {
          background: #FF5500;
          border-color: #FF5500;
          color: #FFFFFF;
        }

        .btn-footer-return {
          background: #FF5500;
          border: 1px solid #FF5500;
          color: #FFFFFF;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 6px 16px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 0 12px rgba(255, 85, 0, 0.3);
        }

        .btn-footer-return:hover {
          background: #FF6600;
        }

        /* ─────────────────────────────────────────────────────────────
           FORMS, INPUTS & MODALS
        ────────────────────────────────────────────────────────────── */
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
          color: #D4D4D8;
        }

        .form-field input, .form-field select, .form-field textarea {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 0.92rem;
          font-family: inherit;
          background: #11141B;
          color: #FFFFFF;
          outline: none;
        }

        .form-field input:focus, .form-field select:focus, .form-field textarea:focus {
          border-color: #FF5500;
          background: #161A24;
        }

        .input-orange-theme {
          background: #FFFFFF !important;
          color: #000000 !important;
          border: 1px solid rgba(0, 0, 0, 0.2) !important;
        }

        .apply-success-state {
          text-align: center;
          padding: 32px;
        }

        .success-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(255, 85, 0, 0.15);
          color: #FF5500;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .budget-preset-pills {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }

        .preset-btn {
          background: #11141B;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #D4D4D8;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .preset-btn.active {
          background: #FF5500;
          color: #FFFFFF;
          border-color: #FF5500;
        }

        .sim-slider-row {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sim-slider-row label {
          font-size: 1.1rem;
          color: #FFFFFF;
        }

        .budget-slider {
          width: 100%;
          accent-color: #FF5500;
          cursor: pointer;
        }

        .creator-select-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }

        .creator-tab-btn {
          background: #11141B;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #D4D4D8;
          cursor: pointer;
        }

        .creator-tab-btn.active {
          background: #FF5500;
          color: #FFFFFF;
          border-color: #FF5500;
        }

        .score-badge-circle {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 4px;
          margin-bottom: 8px;
        }

        .score-val {
          font-size: 2.8rem;
          font-weight: 900;
        }

        .score-scale {
          font-size: 1.1rem;
          color: #71717A;
        }

        .score-status {
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
          display: block;
        }

        .score-note {
          font-size: 0.72rem;
          color: #71717A;
          display: block;
        }

        .asset-download-card {
          border-radius: 18px;
          padding: 24px;
          display: flex;
          flex-direction: column;
        }

        .asset-preview-box {
          height: 120px;
          background: #11141B;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .asset-preview-box-black {
          height: 120px;
          background: #000000;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }

        .orange-dots-preview {
          display: grid;
          grid-template-columns: repeat(2, 12px);
          gap: 8px;
        }

        .orange-dots-preview .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .dot-orange-1 { background-color: #FF5500; }
        .dot-orange-2 { background-color: #FFFFFF; }
        .dot-orange-3 { background-color: #FF7700; }
        .dot-orange-4 { background-color: #D4D4D8; }

        .press-releases-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .press-item {
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
          text-transform: uppercase;
        }

        .press-item h4 {
          font-size: 1.15rem;
          font-weight: 800;
          margin: 4px 0 6px;
          color: #FFFFFF;
        }

        .press-item p {
          margin: 0;
          color: #A1A1AA;
          font-size: 0.9rem;
        }

        .job-apply-modal-box {
          background: #0E1015;
          border: 1px solid #FF5500;
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

        .apply-box-header h3 {
          color: #FFFFFF;
          margin: 4px 0 0;
        }

        .btn-close-box {
          background: none;
          border: none;
          cursor: pointer;
          color: #71717A;
        }

        .palette-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        @media (max-width: 768px) {
          .palette-grid {
            grid-template-columns: 1fr;
          }
        }

        .color-swatch-box {
          border-radius: 16px;
          padding: 28px;
          height: 140px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          cursor: pointer;
          transition: transform 0.15s ease;
        }

        .color-swatch-box:hover {
          transform: translateY(-3px);
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

        .orange-dots-large {
          display: grid;
          grid-template-columns: repeat(2, 28px);
          gap: 14px;
          justify-content: center;
        }

        .orange-dots-large .dot {
          width: 28px;
          height: 28px;
          border-radius: 50%;
        }

        .dot-o1 { background-color: #FF5500; }
        .dot-o2 { background-color: #FFFFFF; }
        .dot-o3 { background-color: #FF7700; }
        .dot-o4 { background-color: #D4D4D8; }

        .blog-posts-stack {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .blog-post-card {
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
          text-transform: uppercase;
        }

        .blog-date {
          font-size: 0.8rem;
          color: #71717A;
        }

        .blog-post-card h2 {
          font-size: 1.6rem;
          font-weight: 800;
          margin: 0 0 12px;
          line-height: 1.25;
        }

        .blog-post-card p {
          font-size: 1rem;
          line-height: 1.6;
          margin: 0 0 20px;
        }

        .code-snippet-box {
          background: #000000;
          border: 1px solid rgba(255, 255, 255, 0.1);
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
          color: #FF7700;
          line-height: 1.5;
        }

        .faq-search-box {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #0E1015;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          padding: 16px 20px;
          margin-bottom: 32px;
        }

        .faq-search-box input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 1rem;
          font-family: inherit;
          color: #FFFFFF;
          background: transparent;
        }

        .faq-accordion-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .faq-item-card {
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
          cursor: pointer;
        }

        .faq-chevron {
          transition: transform 0.2s ease;
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
          color: #A1A1AA;
          line-height: 1.6;
        }

        .support-ticket-card {
          border-radius: 20px;
          padding: 36px;
        }

        .support-ticket-card h3 {
          color: #FFFFFF;
          margin: 0 0 6px;
        }

        .support-ticket-card p {
          color: #A1A1AA;
          margin: 0;
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
          border-radius: 14px;
          padding: 20px;
        }

        .channel-name {
          font-family: monospace;
          font-size: 0.95rem;
          font-weight: 700;
          display: block;
          margin-bottom: 6px;
        }

        .channel-box p {
          margin: 0;
          font-size: 0.85rem;
          line-height: 1.5;
        }

        .roster-filter-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 28px;
        }

        .filter-pill-btn {
          background: #11141B;
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #A1A1AA;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .filter-pill-btn.active {
          background: #FF5500;
          color: #FFFFFF;
          border-color: #FF5500;
          font-weight: 700;
        }

        .section-subheading {
          font-size: 1.1rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 16px;
        }

        .niche-selector-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .niche-select-btn {
          background: #11141B;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 8px 16px;
          border-radius: 9999px;
          color: #D4D4D8;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }

        .niche-select-btn.selected {
          background: #FF5500;
          color: #FFFFFF;
          border-color: #FF5500;
        }

        .deliverables-checklist-grid {
          display: grid;
          gap: 12px;
        }

        .deliverable-check-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: #11141B;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 14px 16px;
          cursor: pointer;
        }

        .deliverable-check-card input {
          accent-color: #FF5500;
          margin-top: 3px;
        }

        .deliverable-check-card strong {
          display: block;
          color: #FFFFFF;
          font-size: 0.9rem;
          margin-bottom: 2px;
        }

        .deliverable-check-card span {
          display: block;
          color: #71717A;
          font-size: 0.78rem;
        }

        .step-tag-black {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          color: #FFFFFF;
          background: #000000;
          padding: 3px 10px;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
};
