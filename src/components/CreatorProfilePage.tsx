import React, { useState } from 'react';
import type { CreatorProfile, CurrencyCode, ServicePackage } from '../types/creator';
import { BookingModal } from './BookingModal';
import { MessageModal } from './MessageModal';
import { CollaborationProcess } from './CollaborationProcess';
import { CreatorlyLogo } from './CreatorlyLogo';
import { CreatorOnboardingModal } from './CreatorOnboardingModal';
import {
  Play,
  ArrowUpRight,
  ChevronDown,
  Check,
  Sparkles,
  Camera,
  MapPin,
  MessageCircle,
  ArrowDown,
  Zap,
  ShieldCheck,
  X,
  Star,
  Search,
  Compass,
  LayoutDashboard,
  Pause,
  LogIn,
  LogOut,
  Building2
} from 'lucide-react';

interface CreatorProfilePageProps {
  creator: CreatorProfile;
  currentCurrency: CurrencyCode;
  onShowToast: (msg: string) => void;
  onBackToMarketplace?: () => void;
  onNavigateToMarketplace?: () => void;
  onBookingSubmitted?: (booking: any, creator: CreatorProfile) => void;
  creators?: CreatorProfile[];
  onSelectCreator?: (creator: CreatorProfile) => void;
  onOpenPipeline?: (perspective?: any) => void;
  currentUser?: any;
  onLoginSuccess?: any;
  onLogout?: any;
  onOpenAuth?: any;
  onNavigateToWorkspace?: any;
  previousView?: string;
  onNavigateToPage?: (slug: string) => void;
  onMessageSubmitted?: (data: any) => void;
}

export const CreatorProfilePage: React.FC<CreatorProfilePageProps> = ({
  creator,
  currentCurrency,
  onShowToast,
  onBackToMarketplace: _onBackToMarketplace,
  onNavigateToMarketplace,
  onBookingSubmitted,
  creators = [],
  onSelectCreator,
  onOpenPipeline,
  currentUser,
  onLogout,
  onOpenAuth,
  onNavigateToWorkspace,
  previousView: _previousView = 'creator-profile',
  onNavigateToPage,
  onMessageSubmitted
}) => {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [onboardingModalOpen, setOnboardingModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [activeFooterModal, setActiveFooterModal] = useState<'about' | 'careers' | null>(null);
  const [preselectedPackage, setPreselectedPackage] = useState<ServicePackage | null>(null);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<{
    id: string;
    title: string;
    category: string;
    imageUrl: string;
    views: string;
    engagement: string;
    platform: string;
    duration: string;
    brandClient: string;
    deliverable: string;
    strategy: string;
    quote: string;
  } | null>(null);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Split creator full name for stylized typography
  const nameParts = creator.fullName.split(' ');
  const firstName = nameParts[0] || 'Alex';
  const isSpecificCreator = Boolean(creator && creator.id !== 'cr_alex_sharma' && creator.id !== 'alex-sharma' && creator.id !== 'default');

  // Collab Package Add-ons State
  const AVAILABLE_ADDONS = [
    { id: 'rush', label: 'Rush 48h Turnaround', price: 1500 },
    { id: 'ads', label: '90-Day Paid Ads Whitelisting', price: 2500 },
    { id: 'broll', label: 'Raw 4K Footage & B-Roll', price: 1000 },
  ];
  const [packageAddons, setPackageAddons] = useState<Record<number, string[]>>({});
  const toggleAddon = (pkgIdx: number, addonId: string) => {
    setPackageAddons((prev) => {
      const current = prev[pkgIdx] || [];
      const next = current.includes(addonId)
        ? current.filter((id) => id !== addonId)
        : [...current, addonId];
      return { ...prev, [pkgIdx]: next };
    });
  };

  const getPackagePrice = (pkg: any, idx: number) => {
    const basePrices = [5000, 8000, 3000];
    const base = basePrices[idx] || (typeof pkg?.price === 'number' ? pkg.price : 5000);
    const selected = packageAddons[idx] || [];
    const extra = selected.reduce((sum, id) => {
      const addon = AVAILABLE_ADDONS.find((a) => a.id === id);
      return sum + (addon ? addon.price : 0);
    }, 0);
    return base + extra;
  };

  const handleChoosePackage = (pkgIndex: number) => {
    const basePkg = creator.packages[pkgIndex] || creator.packages[0];
    const basePrices = [5000, 8000, 3000];
    const basePriceNum = basePrices[pkgIndex] || (typeof (basePkg as any).priceInINR === 'number' ? (basePkg as any).priceInINR : 5000);
    const selected = packageAddons[pkgIndex] || [];
    const extra = selected.reduce((sum, id) => {
      const addon = AVAILABLE_ADDONS.find((a) => a.id === id);
      return sum + (addon ? addon.price : 0);
    }, 0);
    const totalPrice = basePriceNum + extra;
    const addonNames = selected
      .map((id) => AVAILABLE_ADDONS.find((a) => a.id === id)?.label)
      .filter(Boolean);

    const customizedPkg: ServicePackage = {
      ...basePkg,
      priceInINR: totalPrice,
      deliverables: [
        ...basePkg.deliverables,
        ...addonNames.map((name) => `[Add-on] ${name}`)
      ]
    };

    setPreselectedPackage(customizedPkg);
    setBookingModalOpen(true);
    onShowToast(`Selected ${basePkg.title} with custom add-ons (₹${totalPrice.toLocaleString()})`);
  };

  // Section 2: Animated Stats on View
  const [animatedStats, setAnimatedStats] = useState({
    community: 0,
    views: 0,
    engagement: 0,
    targetMarket: 0,
  });

  React.useEffect(() => {
    const targetCommunity = isSpecificCreator ? Math.round((creator?.metrics?.totalAudience || 85000) / 1000) : 85;
    const targetViews = isSpecificCreator ? Math.round((creator?.metrics?.averageViews || 22000) / 1000) : 22;
    const targetEng = isSpecificCreator ? (creator?.metrics?.engagementRate || 4.8) : 4.8;
    const targetMarket = isSpecificCreator ? (creator?.metrics?.targetMarketPercentage || 62) : 62;

    let animFrameId: number;

    const startCounting = () => {
      let startTime: number | null = null;
      const duration = 1200; // ms

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing: easeOutCubic
        const ease = 1 - Math.pow(1 - progress, 3);

        setAnimatedStats({
          community: Math.round(targetCommunity * ease),
          views: Math.round(targetViews * ease),
          engagement: Math.round(targetEng * ease * 10) / 10,
          targetMarket: Math.round(targetMarket * ease),
        });

        if (progress < 1) {
          animFrameId = requestAnimationFrame(step);
        }
      };

      animFrameId = requestAnimationFrame(step);
    };

    const sectionEl = document.querySelector('.fresh-numbers-section');
    if (!sectionEl) {
      startCounting();
      return () => {
        if (animFrameId) cancelAnimationFrame(animFrameId);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startCounting();
        } else {
          // Reset numbers when scrolled out of view so it animates each time when scrolled into view
          setAnimatedStats({
            community: 0,
            views: 0,
            engagement: 0,
            targetMarket: 0,
          });
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(sectionEl);

    return () => {
      observer.disconnect();
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [isSpecificCreator, creator]);

  // Video Reel Simulator in Case Study Modal
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  const handleOpenBooking = () => {
    setPreselectedPackage(null);
    setBookingModalOpen(true);
  };

  const handleOpenMessage = () => {
    setMessageModalOpen(true);
  };

  // Filtered creators for the Search Influencers modal
  const allAvailableCreators = creators && creators.length > 0 ? creators : [creator];
  const filteredSearchCreators = allAvailableCreators.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      c.fullName.toLowerCase().includes(q) ||
      c.handle.toLowerCase().includes(q) ||
      c.primaryNiche.toLowerCase().includes(q) ||
      c.location.city.toLowerCase().includes(q) ||
      c.location.country.toLowerCase().includes(q);

    const matchesCategory =
      selectedCategoryFilter === 'All' ||
      c.primaryNiche.toLowerCase().includes(selectedCategoryFilter.toLowerCase());

    return matchesQuery && matchesCategory;
  });

  // Portfolio items (Section 7 of Creatorly Project Spec)
  const portfolioItems = [
    {
      id: '01',
      category: 'Educational Video · YouTube',
      title: 'Best AI Tools for Students & Developers',
      imageUrl: '/images/work-flagship-clean.jpg',
    },
    {
      id: '02',
      category: 'Sponsored Reel · Instagram',
      title: 'Three Tech Gadgets Worth Buying',
      imageUrl: '/images/work-settings-clean.jpg',
    },
    {
      id: '03',
      category: 'Educational Short · Instagram',
      title: 'Understanding AI in 60 Seconds',
      imageUrl: '/images/work-desk.jpg',
    },
  ];

  const caseStudiesData: Record<string, {
    views: string;
    engagement: string;
    platform: string;
    duration: string;
    brandClient: string;
    deliverable: string;
    strategy: string;
    quote: string;
  }> = {
    '01': {
      views: '48,200',
      engagement: '8.4%',
      platform: 'YouTube (52K Subscribers)',
      duration: '11m 40s',
      brandClient: 'NextLearn AI',
      deliverable: '60-second integrated sponsorship segment with live product demonstration and link in description',
      strategy: 'Demonstrate real-world workflow with student code examples instead of generic feature slides. Pinned comment with exclusive student discount.',
      quote: '"Alex delivered one of our highest-converting YouTube integrations of Q3. His audience genuinely trusted the workflow demo."'
    },
    '02': {
      views: '34,500',
      engagement: '5.2%',
      platform: 'Instagram (28K Followers)',
      duration: '58s',
      brandClient: 'MinimalGear',
      deliverable: 'High-aesthetic 4K reel with macro product b-roll, honest build review, and link in bio sticker',
      strategy: 'Showcase wireless mechanical keyboard & productivity accessories in real desk context. Fast cuts with clean audio.',
      quote: '"Aesthetic production quality was top tier. The reel reached 34K+ views organically and drove 310 product page visits."'
    },
    '03': {
      views: '85,000',
      engagement: '7.1%',
      platform: 'Instagram Reels & YouTube Shorts',
      duration: '60s',
      brandClient: 'DevToolbox Cloud',
      deliverable: 'Fast-paced educational short breaking down neural networks and API integration simplicity',
      strategy: 'Clear visual analogies and 3 practical takeaways. High retention rate with 92% average view duration.',
      quote: '"Alex has a rare ability to explain developer infrastructure without making it dry. Excellent technical depth."'
    }
  };

  // Collab Packages matching Section 8 of Creatorly Project Spec
  const collabPackages = [
    {
      number: '01',
      title: 'Instagram Sponsored Reel',
      desc: 'High-energy vertical video published directly to @alexbuilds',
      price: '₹5,000',
      bgColor: '#7DD3FC', // soft sky cyan
      textColor: '#0F172A',
      isPopular: false,
      items: [
        '1x sponsored reel (up to 60 sec)',
        '1 revision round included',
        'Delivery within 7 business days',
        'Published to @alexbuilds feed & Story',
      ],
    },
    {
      number: '02',
      title: 'YouTube Brand Integration',
      desc: 'In-depth 60–90 second brand segment inside an educational tutorial',
      price: '₹8,000',
      bgColor: '#D4F754', // vibrant lime
      textColor: '#0F172A',
      isPopular: true,
      items: [
        '60–90 sec brand integration segment',
        'Verbal call-to-action & pinned comment',
        '1 revision round before publishing',
        'Permanent hosting on YouTube',
      ],
    },
    {
      number: '03',
      title: 'UGC Video for Brand Ads',
      desc: 'Authentic ad creative for Meta, TikTok & YouTube ads (no handle post)',
      price: '₹3,000',
      bgColor: '#FF85B3', // sweet pink
      textColor: '#0F172A',
      isPopular: false,
      items: [
        '1x 30–45 sec 4K vertical ad creative',
        'Includes 2 hook variations',
        '90-day commercial paid ad rights',
        'Delivery of final master MP4 file',
      ],
    },
  ];

  // FAQ Items matching Section 13 of Creatorly Project Spec
  const faqItems = [
    {
      question: 'How long does delivery take?',
      answer:
        'Standard delivery is 7 business days for Instagram Reels and 10 business days for YouTube Integrations after the creative brief and product delivery are confirmed. Rush 72-hour delivery is available.',
    },
    {
      question: 'Are revisions included?',
      answer:
        'Yes. All packages include 1 complimentary revision round covering pacing, audio balance, CTA tweaks, and brand messaging before final publication.',
    },
    {
      question: 'Does the package include posting on the creator\'s account?',
      answer:
        'Instagram Reels and YouTube Integrations are published directly to Alex Sharma\'s verified accounts (@alexbuilds). UGC Video packages are delivered as raw and edited master files for the brand\'s own advertising channels without creator profile posting.',
    },
    {
      question: 'Can the brand use the content in paid advertising?',
      answer:
        'Yes. 90-day and 180-day paid advertising whitelisting rights (Meta Partnership Ads / TikTok Spark Ads) are available as a standardized add-on during milestone checkout.',
    },
    {
      question: 'Is competitor category exclusivity available?',
      answer:
        'Yes. 30-day competitor category exclusivity can be requested during booking or quoted via direct message for long-term campaigns.',
    },
    {
      question: 'How does milestone escrow payment work?',
      answer:
        'Your booking is submitted with zero upfront risk into bank-grade milestone escrow. The creator reviews your creative brief within 24 hours, and funds are only committed once both parties agree to terms.',
    },
    {
      question: 'Can the creator provide a custom quote?',
      answer:
        'Absolutely. You can request a custom multi-video campaign bundle, multi-platform synchronized drop, or event attendance by sending a custom brief directly.',
    },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="creator-profile-fresh">
      {/* ========================================================= */}
      {/* TOP NAVIGATION BAR                                        */}
      {/* ========================================================= */}
      <header className="fresh-navbar">
        <div className="fresh-nav-container">
          {/* Logo with user's exact 4-color dots SVG */}
          <div className="fresh-logo-wrap" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <CreatorlyLogo width={30} height={24} />
            <span className="logo-text">creatorly.</span>
          </div>

          {/* Center navigation links */}
          <nav className="fresh-nav-links">
            <button type="button" onClick={() => scrollToSection('the-creator')}>Overview</button>
            <button type="button" onClick={() => scrollToSection('the-work')}>Selected work</button>
            <button type="button" onClick={() => scrollToSection('collab-menu')}>Packages</button>
            <button type="button" onClick={() => scrollToSection('the-details')}>The details</button>
            <button type="button" onClick={() => scrollToSection('more-creators')}>More creators</button>
          </nav>

          {/* Right actions: Role Portals (Brand & Creator) + Login / Logout + Create Account + Work together */}
          <div className="fresh-nav-actions">
            {currentUser ? (
              <div className="nav-portal-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {currentUser.role === 'creator' ? (
                  <>
                    <div 
                      className="nav-user-chip" 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '7px', 
                        padding: '4px 10px', 
                        borderRadius: '9999px', 
                        background: 'rgba(22,40,29,0.06)', 
                        border: '1px solid rgba(22,40,29,0.15)' 
                      }}
                      title={`Logged in as ${currentUser.name}`}
                    >
                      <img 
                        src={currentUser.avatarUrl || '/images/alex-sharma.jpg'} 
                        alt={currentUser.name} 
                        style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }} 
                      />
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#16281D' }}>
                        {currentUser.name.split(' ')[0]}
                      </span>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '2px 5px', borderRadius: '4px', background: '#16281D', color: '#FFFFFF', textTransform: 'uppercase' }}>
                        Creator
                      </span>
                    </div>

                    <button
                      type="button"
                      className="nav-btn-portal nav-btn-creator"
                      onClick={() => {
                        if (onNavigateToWorkspace) onNavigateToWorkspace();
                      }}
                      title="Enter Creator Workspace"
                      aria-label="Creator Workspace"
                    >
                      <LayoutDashboard size={13} />
                      <span>Workspace</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div 
                      className="nav-user-chip" 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '7px', 
                        padding: '4px 10px', 
                        borderRadius: '9999px', 
                        background: 'rgba(30,58,138,0.06)', 
                        border: '1px solid rgba(30,58,138,0.15)' 
                      }}
                      title={`Logged in as ${currentUser.companyName || currentUser.name}`}
                    >
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E3A8A' }}>
                        {(currentUser.companyName || currentUser.name).split(' ')[0]}
                      </span>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '2px 5px', borderRadius: '4px', background: '#1E3A8A', color: '#FFFFFF', textTransform: 'uppercase' }}>
                        Brand
                      </span>
                    </div>

                    <button
                      type="button"
                      className="nav-btn-portal nav-btn-brand"
                      onClick={() => {
                        if (onNavigateToMarketplace) onNavigateToMarketplace();
                      }}
                      title="Enter Brand Marketplace"
                      aria-label="Brand Marketplace"
                    >
                      <Compass size={13} />
                      <span>Discover</span>
                    </button>
                  </>
                )}

                <button
                  type="button"
                  className="nav-say-hello"
                  onClick={() => onLogout && onLogout()}
                  title="Sign out of your session"
                  style={{ fontSize: '0.82rem', padding: '7px 14px' }}
                >
                  <LogOut size={13} />
                  <span>Log out</span>
                </button>
              </div>
            ) : (
              <div className="nav-portal-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  className="nav-btn-portal nav-btn-brand"
                  onClick={() => {
                    if (onNavigateToMarketplace) onNavigateToMarketplace();
                    else if (_onBackToMarketplace) _onBackToMarketplace();
                  }}
                  title="Explore creators, audience metrics & transparent rates"
                  aria-label="Find Creators & Rates"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 14px',
                    borderRadius: '9999px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    background: 'rgba(21, 128, 61, 0.08)',
                    color: '#15803D',
                    border: '1px solid rgba(21, 128, 61, 0.25)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Compass size={14} />
                  <span>Find Creators & Rates</span>
                </button>

                <button
                  type="button"
                  className="nav-btn-portal nav-btn-creator"
                  onClick={() => {
                    if (onNavigateToWorkspace) onNavigateToWorkspace();
                  }}
                  title="Register your details, connect socials & list rate cards"
                  aria-label="Join as Creator"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 14px',
                    borderRadius: '9999px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    background: '#16281D',
                    color: '#FFFFFF',
                    border: '1px solid #16281D',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Sparkles size={14} color="#4ADE80" />
                  <span>Join as Creator</span>
                </button>

                <button
                  type="button"
                  className="nav-say-hello"
                  onClick={() => onOpenAuth && onOpenAuth('signin', 'creator')}
                  title="Log in to your account"
                  style={{ fontSize: '0.82rem', padding: '7px 14px' }}
                >
                  <LogIn size={13} />
                  <span>Log in</span>
                </button>
              </div>
            )}

            <button
              type="button"
              className="nav-work-together"
              onClick={handleOpenBooking}
              aria-label="Work together with creator"
            >
              <span>Work together</span>
              <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Logged in User Status Banner (Reflects account across storefront) */}
      {currentUser && (
        <div className="fresh-content-container" style={{ paddingTop: '16px' }}>
          {currentUser.role === 'creator' ? (
            <div style={{
              background: 'linear-gradient(90deg, #16281D 0%, #1e3a29 100%)',
              color: '#FFFFFF',
              padding: '12px 20px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 14px rgba(22, 40, 29, 0.12)',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img 
                  src={currentUser.avatarUrl || '/images/alex-sharma.jpg'} 
                  alt={currentUser.name} 
                  style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #5EEAD4' }} 
                />
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Welcome back, {currentUser.name}!</span>
                    <span style={{ fontSize: '0.7rem', background: '#059669', padding: '1px 6px', borderRadius: '4px', color: '#FFF' }}>✓ Verified Creator</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#A7F3D0' }}>
                    Your creator account is live and saved in database. Direct deals & inquiries sync in real time.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToWorkspace && onNavigateToWorkspace()}
                style={{
                  background: '#FFFFFF',
                  color: '#16281D',
                  border: 'none',
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Creator Workspace</span>
                <ArrowUpRight size={14} />
              </button>
            </div>
          ) : (
            <div style={{
              background: 'linear-gradient(90deg, #1E3A8A 0%, #1e40af 100%)',
              color: '#FFFFFF',
              padding: '12px 20px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 14px rgba(30, 58, 138, 0.12)',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={18} color="#FFFFFF" />
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Welcome back, {currentUser.companyName || currentUser.name}!</span>
                    <span style={{ fontSize: '0.7rem', background: '#2563EB', padding: '1px 6px', borderRadius: '4px', color: '#FFF' }}>✓ Brand Partner</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#BFDBFE' }}>
                    Logged in as brand user. Direct booking briefs are pre-filled with milestone escrow protection.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToMarketplace && onNavigateToMarketplace()}
                style={{
                  background: '#FFFFFF',
                  color: '#1E3A8A',
                  border: 'none',
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Discover Creators</span>
                <ArrowUpRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 1: CREATOR HERO (Photo 1)                         */}
      {/* ========================================================= */}
      <section className="fresh-hero-section" id="the-creator">
        <div className="fresh-content-container hero-grid">
          {/* Left: Creator Portrait with Badges */}
          <div className="hero-portrait-col">
            <div className="portrait-frame">
              <img
                src={creator?.avatarUrl || '/images/alex-sharma.jpg'}
                alt={creator?.fullName || "Creatorly — Where Brands Meet Creators"}
                className="portrait-image"
              />

              {/* Green round badge top-left */}
              <div className="badge-making-tech">
                <Sparkles size={14} />
                <span>{((creator as any)?.tagline || creator?.primaryNiche || 'Where creativity meets impact.')}</span>
              </div>

              {/* Bottom pill overlay */}
              <div className="pill-open-projects">
                <span className="live-dot-green"></span>
                <span>Open to brand collaborations</span>
              </div>
            </div>
          </div>

          {/* Right: Creator Info & Headline */}
          <div className="hero-info-col">
            {/* Top row with Eyebrow */}
            <div className="hero-eyebrow-row">
              <span className="fresh-eyebrow">
                <span className="eyebrow-bullet">•</span> WHERE BRANDS MEET CREATORS / VERIFIED PLATFORM
              </span>
            </div>

            {/* Giant Title: Iconic Platform Motto */}
            <h1 className="hero-title">
              Where<br />
              Brands<span className="text-coral">.</span><br />
              <span className="text-coral">Meet Creators</span>
            </h1>

            {/* Handle & Verified Badges */}
            <div className="hero-badges-row">
              <span className="badge-handle">{creator?.handle || '@creatorly'}</span>
              <span className="badge-sample-profile">✓ VERIFIED PLATFORM</span>
            </div>

            {/* Bio paragraph / Slogan description */}
            <p className="hero-bio-text">
              The curated marketplace connecting high-growth brands with verified creators. Authentic storytelling, transparent deliverables, and milestone-protected escrow payouts.
            </p>

            {/* Senior UX / Relatable: Creator SLA & Escrow Strip */}
            <div className="hero-sla-strip">
              <div className="sla-item">
                <span className="sla-dot-pulse"></span>
                <span><strong>500+ creators</strong> actively open</span>
              </div>
              <div className="sla-divider">•</div>
              <div className="sla-item">
                <Zap size={13} className="sla-icon" />
                <span>Avg reply <strong>&lt; 2 hrs</strong></span>
              </div>
              <div className="sla-divider">•</div>
              <div className="sla-item">
                <ShieldCheck size={14} className="sla-icon" />
                <span><strong>Escrow</strong> milestone safe</span>
              </div>
            </div>

            {/* Location & Languages */}
            <div className="hero-meta-row">
              <div className="meta-item">
                <MapPin size={14} className="meta-icon" />
                <span>{isSpecificCreator ? `${creator?.location?.city || 'Mumbai'}, ${creator?.location?.country || 'India'}` : 'Mumbai, Delhi & Global'}</span>
              </div>
              <div className="meta-item">
                <span>{isSpecificCreator ? (creator?.languages?.join(' & ') || 'English & Hindi') : 'English, Hindi & 10+ Languages'}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="hero-socials-row">
              {(creator?.socialLinks || []).map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-text-link"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hero-cta-row">
              <button type="button" className="btn-make-something" onClick={handleOpenBooking}>
                <span>Let's make something</span>
                <ArrowUpRight size={16} />
              </button>
              <button
                type="button"
                className="btn-see-work"
                onClick={() => scrollToSection('the-work')}
              >
                <span>See selected work</span>
                <ArrowDown size={14} />
              </button>
            </div>

            {/* Quick Niche Discovery Filter Bar */}
            <div className="hero-niche-quickbar">
              <span className="niche-quickbar-label">Explore creators:</span>
              <div className="niche-quickbar-tags">
                {[
                  { label: 'All (11)', val: 'All' },
                  { label: 'Tech & AI', val: 'Tech' },
                  { label: 'Fashion & Style', val: 'Fashion' },
                  { label: 'Fitness & Health', val: 'Fitness' },
                  { label: 'Food & Cooking', val: 'Food' },
                  { label: 'Travel', val: 'Travel' },
                  { label: 'Finance', val: 'Finance' },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    className={`niche-tag-btn ${selectedCategoryFilter === item.val || (item.val === 'All' && selectedCategoryFilter === 'All') ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategoryFilter(item.val);
                      scrollToSection('more-creators');
                      onShowToast(`Filtering ${item.label} creators`);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Relatable: Recent Brand Collaborations Ribbon with Marquee */}
            <div className="hero-brands-ribbon">
              <span className="brands-ribbon-label">Recent brand stories:</span>
              <div className="brands-marquee-wrap">
                <div className="brands-marquee-track">
                  {[
                    '✦ Notion', '■ Keychron', '▲ Figma', '● Linear', '◆ Sony Alpha', '✦ Raycast',
                    '★ Spotify', '● Zepto', '◆ Zomato', '▲ Substack',
                    '✦ Notion', '■ Keychron', '▲ Figma', '● Linear', '◆ Sony Alpha', '✦ Raycast',
                    '★ Spotify', '● Zepto', '◆ Zomato', '▲ Substack'
                  ].map((brand, bIdx) => (
                    <span key={bIdx} className="brand-pill marquee-pill">{brand}</span>
                  ))}
                </div>
              </div>
            </div>

            <span className="hero-microcopy">No payment is required until collaboration terms are agreed.</span>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: NUMBERS AT A GLANCE (Dark Band) (Photo 2)       */}
      {/* ========================================================= */}
      <section className="fresh-numbers-section">
        <div className="fresh-content-container">
          <div className="numbers-header-row">
            <div>
              <span className="numbers-tag">THE NUMBERS, AT A GLANCE</span>
              <h2 className="numbers-title">
                Good reach.<br />
                <span className="text-teal">Real connection.</span>
              </h2>
            </div>
            <p className="numbers-subtext">
              Audience demographics and performance metrics verified via Creatorly platform integration. Last updated 3 days ago.
            </p>
          </div>

          <div className="numbers-divider"></div>

          {/* 4 Stats Grid with Live Animated Numbers */}
          <div className="numbers-stats-grid">
            <div className="num-stat-item">
              <div className="num-big-val">
                {animatedStats.community}k
              </div>
              <div className="num-label">Community</div>
              <div className="num-sample-note">✓ Verified channel data</div>
            </div>

            <div className="num-stat-item">
              <div className="num-big-val">
                {animatedStats.views}k
              </div>
              <div className="num-label">Avg. views</div>
              <div className="num-sample-note">✓ 30-day verified average</div>
            </div>

            <div className="num-stat-item">
              <div className="num-big-val text-lime">
                {animatedStats.engagement}%
              </div>
              <div className="num-label">Engagement</div>
              <div className="num-sample-note">✓ Top 10% in category</div>
            </div>

            <div className="num-stat-item">
              <div className="num-big-val text-lime">
                {animatedStats.targetMarket}%
              </div>
              <div className="num-label">Audience in India</div>
              <div className="num-sample-note">✓ Primary demographic</div>
            </div>
          </div>

          <div className="numbers-footer-notice">
            <span className="notice-dot-green"></span>
            <span>✓ Authenticated metrics updated 3 days ago · Creatorly Verification Protocol</span>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: THE WORK (Selected Portfolio) (Photo 3)        */}
      {/* ========================================================= */}
      <section className="fresh-work-section" id="the-work">
        <div className="fresh-content-container">
          <div className="section-header-split">
            <div>
              <span className="fresh-eyebrow">
                <span className="eyebrow-bullet">•</span> THE WORK
              </span>
              <h2 className="section-headline">
                Scroll stopping.<br />
                <span className="text-coral">Substance included.</span>
              </h2>
            </div>
            <p className="section-header-desc">
              {isSpecificCreator
                ? `Tech that sparks a 'wait, that's actually useful' moment. Here's a peek at the kind of stories ${firstName} makes.`
                : "Tech and creative stories that spark a 'wait, that's actually useful' moment. Here's a peek at the kind of high-impact campaigns our creators make."}
            </p>
          </div>

          {/* 3 Video Cards */}
          <div className="work-cards-grid">
            {portfolioItems.map((item) => (
              <div
                key={item.id}
                className="work-card-fresh"
                onClick={() => setSelectedCaseStudy({ ...item, ...caseStudiesData[item.id] })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedCaseStudy({ ...item, ...caseStudiesData[item.id] });
                  }
                }}
              >
                <div className="work-thumb-box">
                  <img src={item.imageUrl} alt={item.title} className="work-thumb-img" />
                  <span className="work-index-badge">{item.id}</span>
                  {item.id !== '03' && (
                    <div className="play-button-overlay">
                      <Play size={18} fill="#FFFFFF" color="#FFFFFF" />
                    </div>
                  )}
                  <span className="case-study-hover-badge">View Case Study</span>
                </div>

                <div className="work-card-info">
                  <div className="work-cat-row">
                    <span className="work-category">{item.category}</span>
                    <button type="button" className="btn-work-arrow" aria-label="View work link">
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                  <h3 className="work-card-title">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="work-bottom-notice">
            <Camera size={14} className="notice-cam-icon" />
            <span>Sample portfolio imagery; no third-party brand partnerships are implied</span>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: THE COLLAB MENU (Packages) (Photo 4)           */}
      {/* ========================================================= */}
      <section className="fresh-collab-section" id="collab-menu">
        <div className="fresh-content-container">
          <div className="section-header-split">
            <div>
              <span className="fresh-eyebrow">
                <span className="eyebrow-bullet">•</span> THE COLLAB MENU
              </span>
              <h2 className="section-headline">
                Good ideas,<br />
                <span className="text-coral">no guesswork.</span>
              </h2>
            </div>
            <p className="section-header-desc">
              Clear starting prices, clear deliverables. Final details can be agreed together before moving ahead.
            </p>
          </div>

          {/* 3 Colorful Package Cards */}
          <div className="collab-cards-grid">
            {collabPackages.map((pkg, idx) => (
              <div
                key={pkg.number}
                className={`collab-card-fresh ${pkg.isPopular ? 'popular-card' : ''}`}
                style={{ backgroundColor: pkg.bgColor }}
              >
                {/* Top header row inside card */}
                <div className="collab-card-header">
                  <span className="collab-num">{pkg.number}</span>
                  {pkg.isPopular && (
                    <span className="badge-fan-favorite">
                      <Sparkles size={12} />
                      FAN FAVORITE
                    </span>
                  )}
                </div>

                <h3 className="collab-title">{pkg.title}</h3>
                <p className="collab-desc">{pkg.desc}</p>

                <div className="collab-price-row">
                  <span className="price-from-label">Total</span>
                  <span className="price-amount">₹{getPackagePrice(pkg, idx).toLocaleString()}</span>
                </div>

                <div className="collab-mix-block">
                  <span className="mix-label">IN THE MIX</span>
                  <ul className="mix-list">
                    {pkg.items.map((it, iIdx) => (
                      <li key={iIdx} className="mix-item">
                        <Check size={14} className="mix-check" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Add-ons Deliverables Calculator */}
                <div className="collab-addons-block">
                  <span className="addons-title">CUSTOMIZE DELIVERABLES</span>
                  <div className="addons-list">
                    {AVAILABLE_ADDONS.map((addon) => {
                      const isChecked = (packageAddons[idx] || []).includes(addon.id);
                      return (
                        <label key={addon.id} className="addon-checkbox-label">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleAddon(idx, addon.id)}
                            className="addon-input"
                          />
                          <span className="addon-text">{addon.label}</span>
                          <span className="addon-price">+₹{addon.price.toLocaleString()}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="collab-escrow-badge">
                  <ShieldCheck size={13} className="escrow-badge-icon" />
                  <span>100% Escrow Protected • Funds released upon your approval</span>
                </div>

                <button
                  type="button"
                  className="btn-choose-package"
                  onClick={() => handleChoosePackage(idx)}
                >
                  <span>Choose this package (₹{getPackagePrice(pkg, idx).toLocaleString()})</span>
                  <span>→</span>
                </button>
              </div>
            ))}
          </div>

          <div className="collab-bottom-notice">
            Sample starting prices in INR. Timeline, posting, revisions, and usage rights are agreed in writing before a real collaboration.
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4.5: PRODUCTION WORKFLOW & ESCROW PIPELINE        */}
      {/* ========================================================= */}
      <section className="fresh-workflow-section" id="production-workflow" style={{ padding: '80px 0 72px', background: '#151922' }}>
        <div className="fresh-content-container">
          <CollaborationProcess
            creatorName={firstName}
            onStartCollab={handleOpenBooking}
            onOpenPipeline={onOpenPipeline}
          />
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 5: THE TRUST PART & FAQ (Photo 5)                 */}
      {/* ========================================================= */}
      <section className="fresh-trust-section" id="the-details">
        <div className="fresh-content-container">
          {/* Part 1: Trust Part */}
          <div className="trust-split-row">
            <div className="trust-left-col">
              <span className="fresh-eyebrow">
                <span className="eyebrow-bullet">•</span> THE TRUST PART
              </span>
              <h2 className="section-headline trust-headline-giant">
                Good work.<br />
                <span className="text-coral">Good people.</span>
              </h2>
              <p className="trust-subtext">
                {creator.reviews && creator.reviews.length > 0
                  ? `Authentic feedback from ${creator.reviews.length} verified brand collaborations fulfilled through Creatorly Escrow.`
                  : 'Only feedback tied to a completed collaboration belongs here. This sample profile has no verified reviews yet.'}
              </p>
            </div>

            <div className="trust-right-col">
              {creator.reviews && creator.reviews.length > 0 ? (
                <div className="reviews-cards-stack" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {creator.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="verified-review-card card"
                      style={{
                        padding: '20px 24px',
                        background: '#FFFFFF',
                        borderRadius: '20px',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            background: '#0F172A',
                            color: '#FFFFFF',
                            fontWeight: 800,
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {rev.brandLogo || rev.brandName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0F172A' }}>{rev.brandName}</strong>
                            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{rev.reviewerName} • {rev.reviewerRole}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ display: 'flex', color: '#F59E0B' }}>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={15}
                                fill={i < Math.round(rev.rating || 5) ? "#F59E0B" : "none"}
                                color="#F59E0B"
                              />
                            ))}
                          </div>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            background: '#ECFDF5',
                            color: '#059669',
                            borderRadius: '9999px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <ShieldCheck size={12} /> Verified Deal
                          </span>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.6, margin: '0 0 10px 0' }}>
                        "{rev.content}"
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94A3B8' }}>
                        <span>Service: <strong>{rev.campaignType}</strong></span>
                        {rev.metricHighlight && (
                          <span style={{ color: '#059669', fontWeight: 600 }}>✦ {rev.metricHighlight}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-reviews-box">
                  <div className="pink-msg-icon">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <span className="no-reviews-tag">NO VERIFIED REVIEWS YET</span>
                    <h4 className="no-reviews-title">Every good partnership starts somewhere.</h4>
                    <p className="no-reviews-desc">
                      When the creator completes a collaboration, their client can share a verified review here.
                    </p>
                    <button
                      type="button"
                      className="link-explore-packages"
                      onClick={() => scrollToSection('collab-menu')}
                    >
                      <span>Explore sample packages</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="section-hairline"></div>

          {/* Part 2: The Good-to-Knows (FAQ) */}
          <div className="faq-split-row">
            <div className="faq-left-col">
              <span className="fresh-eyebrow">
                <span className="eyebrow-bullet">•</span> BEFORE THE BIG IDEA
              </span>
              <h2 className="section-headline">
                The good-<br />
                to-knows.
              </h2>
              <p className="trust-subtext">
                Sample answers only. Confirm final deliverables and terms with your creator.
              </p>
            </div>

            <div className="faq-right-col">
              <div className="faq-accordion-list">
                {faqItems.map((item, fIdx) => {
                  const isOpen = openFaqIndex === fIdx;
                  return (
                    <div key={fIdx} className={`faq-item ${isOpen ? 'open' : ''}`}>
                      <button
                        type="button"
                        className="faq-question-btn"
                        onClick={() => toggleFaq(fIdx)}
                      >
                        <span>{item.question}</span>
                        <ChevronDown size={18} className={`faq-chevron ${isOpen ? 'rotate' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="faq-answer-pane">
                          <p>{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 6: MORE TALENT (Verified Creators Directory)       */}
      {/* ========================================================= */}
      <section className="fresh-talent-section" id="more-creators">
        <div className="fresh-content-container">
          <div className="section-header-split">
            <div>
              <span className="fresh-eyebrow">
                <span className="eyebrow-bullet">•</span> VERIFIED CREATOR ROSTER ({allAvailableCreators.length} CREATORS)
              </span>
              <h2 className="section-headline">
                More talent.<br />
                <span className="text-coral">More good ideas.</span>
              </h2>
            </div>
            <p className="section-header-desc">
              Browse vetted creators across technology, fashion, fitness, food, and lifestyle. Direct transparent pricing with milestone escrow protection.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="talent-filter-tabs">
            {[
              { id: 'All', label: `All Creators (${allAvailableCreators.length})` },
              { id: 'Tech', label: 'Tech & Dev' },
              { id: 'Fashion', label: 'Fashion & Style' },
              { id: 'Fitness', label: 'Fitness & Health' },
              { id: 'Food', label: 'Culinary & Baking' },
              { id: 'Travel', label: 'Travel & Lifestyle' },
              { id: 'Finance', label: 'Personal Finance' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`talent-tab-btn ${selectedCategoryFilter === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategoryFilter(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* 11 Creators Directory Grid */}
          <div className="talent-cards-grid">
            {allAvailableCreators
              .filter(
                (c) =>
                  selectedCategoryFilter === 'All' ||
                  c.primaryNiche.toLowerCase().includes(selectedCategoryFilter.toLowerCase())
              )
              .map((c, cIdx) => (
                <div
                  key={c.id}
                  className="talent-card-fresh"
                  onClick={() => {
                    if (onSelectCreator) {
                      onSelectCreator(c);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                    onShowToast(`Viewing ${c.fullName}'s verified profile`);
                  }}
                >
                  <div className="talent-photo-box">
                    <img src={c.avatarUrl} alt={c.fullName} className="talent-photo-img" />
                    <span className="talent-num-badge">
                      0{cIdx + 1}
                    </span>
                    <span className="talent-verified-tag">✓ Verified</span>
                  </div>

                  <div className="talent-info-block">
                    <div className="talent-name-row">
                      <h3 className="talent-name">{c.fullName}</h3>
                      <ArrowUpRight size={16} className="talent-arrow" />
                    </div>
                    <div className="talent-handle">{c.handle}</div>
                    <span className="talent-niche">{c.primaryNiche}</span>
                    <span className="talent-loc">{c.location.city}, {c.location.country}</span>

                    <div className="talent-stats-row">
                      <span className="talent-stat-reach">{Math.round(c.metrics.totalAudience / 1000)}k reach</span>
                      <span className="talent-stat-dot">•</span>
                      <span className="talent-stat-eng">{c.metrics.engagementRate}% ER</span>
                      <span className="talent-stat-price">From ₹{c.packages[0]?.priceInINR?.toLocaleString() || '3,000'}</span>
                    </div>

                    <div className="talent-card-actions">
                      <button
                        type="button"
                        className="btn-talent-book"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectCreator) onSelectCreator(c);
                          handleOpenBooking();
                        }}
                      >
                        Book Creator →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="talent-bottom-notice">
            ✓ 100% Verified Indian & Global Creators · Escrow protected milestones · Meta & Google API verified
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 7: BIG CORAL BANNER (Photo 7)                     */}
      {/* ========================================================= */}
      <section className="fresh-noise-banner">
        <div className="fresh-content-container noise-inner">
          {/* Fun floating 4-dot pattern on top-left */}
          <div className="banner-four-dots">
            <span className="bdot bdot-black"></span>
            <span className="bdot bdot-lime"></span>
            <span className="bdot bdot-pink"></span>
            <span className="bdot bdot-yellow"></span>
          </div>

          {/* Lime star icon */}
          <div className="banner-star-icon">
            <Sparkles size={22} />
          </div>

          <span className="banner-tag">GOT A GOOD FEELING?</span>

          {/* Giant Headline with Lime Period Dot */}
          <h2 className="banner-giant-title">
            Let's make<br />
            a little<br />
            noise<span className="lime-square-dot"></span>
          </h2>

          <p className="banner-subtext">
            {isSpecificCreator
              ? `Tell ${firstName} what you're dreaming up. No pressure, just a place to start the conversation.`
              : "Tell us what you're dreaming up. Connect with verified creators. No pressure, just a place to start the conversation."}
          </p>

          <button type="button" className="btn-banner-start" onClick={handleOpenMessage}>
            <span>Start a conversation</span>
            <ArrowUpRight size={16} />
          </button>

          <span className="banner-microcopy">Sample message only · not delivered</span>

          {/* Fun floating star in bottom right */}
          <div className="banner-star-bottom">
            <Sparkles size={28} />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 8: FULL MARKETPLACE FOOTER (ABOUT, CAREERS, CONNECT, DISCOVER) */}
      {/* ========================================================= */}
      <footer className="fresh-footer">
        <div className="fresh-content-container">
          {/* Top Multi-Column Grid */}
          <div className="footer-columns-grid">
            {/* Column 1: Brand Info & Trust */}
            <div className="footer-brand-column">
              <div className="footer-logo-row">
                <CreatorlyLogo width={28} height={22} />
                <span className="footer-wordmark">creatorly.</span>
              </div>
              <p className="footer-mission-text">
                The global marketplace connecting visionary brands with verified creators.
                Audited audience analytics, transparent upfront packages, and bank-grade milestone escrow.
              </p>
              <div className="footer-trust-chips">
                <div className="footer-chip">
                  <ShieldCheck size={13} className="text-lime" />
                  <span>Bank-Grade Escrow Vault</span>
                </div>
                <div className="footer-chip">
                  <span className="status-live-dot"></span>
                  <span>All Systems Operational</span>
                </div>
              </div>
            </div>

            {/* Column 2: About Creatorly */}
            <div className="footer-nav-col">
              <h4 className="footer-col-title">About</h4>
              <ul className="footer-links-list">
                <li>
                  <button type="button" onClick={() => onNavigateToPage ? onNavigateToPage('about-creatorly') : setActiveFooterModal('about')}>
                    About Creatorly
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigateToPage ? onNavigateToPage('how-escrow-works') : scrollToSection('production-workflow')}>
                    How Escrow Works
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigateToPage ? onNavigateToPage('verification-protocol') : onShowToast('Creatorly Verification Standards: Meta & Google API audits')}>
                    Verification Protocol
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigateToPage ? onNavigateToPage('creator-standards') : onShowToast('Creator Code of Conduct: Transparent disclosures & authentic reviews')}>
                    Creator Standards
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigateToPage ? onNavigateToPage('press-media-kit') : onShowToast('Press & Media Kit: Logos, screenshots, and founder bio')}>
                    Press & Media Kit
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Careers */}
            <div className="footer-nav-col">
              <h4 className="footer-col-title">
                Careers <span className="hiring-badge">We're hiring</span>
              </h4>
              <ul className="footer-links-list">
                <li>
                  <button type="button" onClick={() => onNavigateToPage ? onNavigateToPage('open-positions') : setActiveFooterModal('careers')}>
                    Open Positions (3)
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigateToPage ? onNavigateToPage('creator-fellowship') : setActiveFooterModal('careers')}>
                    Creator Fellowship
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigateToPage ? onNavigateToPage('culture-perks') : setActiveFooterModal('careers')}>
                    Culture & Perks
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigateToPage ? onNavigateToPage('engineering-blog') : onShowToast('Engineering Blog: Scaling zero-fraud creator escrow pipelines')}>
                    Engineering Blog
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigateToPage ? onNavigateToPage('brand-guidelines') : onShowToast('Brand Assets: Official logos, typography & color guidelines')}>
                    Brand Guidelines
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Connect & Support */}
            <div className="footer-nav-col">
              <h4 className="footer-col-title">Connect</h4>
              <ul className="footer-links-list">
                <li>
                  <button type="button" onClick={() => onNavigateToPage ? onNavigateToPage('contact-creator') : handleOpenMessage()}>
                    Contact Creator
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigateToPage ? onNavigateToPage('hire-campaign') : handleOpenBooking()}>
                    Hire for Campaign
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigateToPage ? onNavigateToPage('support-help') : onShowToast('Support Desk: support@creatorly.com (Avg response < 1 hr)')}>
                    Support & Help Desk
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigateToPage ? onNavigateToPage('agency-partnerships') : onShowToast('Agency Partner Program: Dedicated account management')}>
                    Agency Partnerships
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigateToPage ? onNavigateToPage('discord-community') : onShowToast('Creatorly Community Discord: 4,200+ creators & marketers')}>
                    Discord Community
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 5: Discover & Visit */}
            <div className="footer-nav-col">
              <h4 className="footer-col-title">Discover & Visit</h4>
              <ul className="footer-links-list">
                <li>
                  <button type="button" onClick={() => onNavigateToPage ? onNavigateToPage('all-creators') : scrollToSection('more-creators')}>
                    All Creators
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigateToPage ? onNavigateToPage('tech-ai-creators') : onShowToast('Browsing Technology & AI creators on Creatorly')}>
                    Technology & AI
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigateToPage ? onNavigateToPage('saas-devtools-creators') : onShowToast('Browsing SaaS & Developer Tool creators')}>
                    SaaS & Dev Tools
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigateToPage ? onNavigateToPage('consumer-tech-creators') : onShowToast('Browsing Consumer Electronics & Desk Setup creators')}>
                    Consumer Tech
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigateToPage ? onNavigateToPage('apply-creator') : setOnboardingModalOpen(true)}>
                    Apply as a Creator
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-hairline"></div>

          {/* Social Channels Row */}
          <div className="footer-social-row">
            <span className="social-row-label">Connect with Creatorly:</span>
            <div className="social-pill-buttons">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-pill-btn">
                <span>𝕏 Twitter</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-pill-btn">
                <span>LinkedIn</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-pill-btn">
                <span>Instagram</span>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-pill-btn">
                <span>YouTube</span>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-pill-btn">
                <span>GitHub</span>
              </a>
            </div>
          </div>

          <div className="footer-hairline"></div>

          {/* Bottom Bar: Copyright, Legal & Back to Top */}
          <div className="footer-bottom-bar">
            <div className="footer-legal-copy">
              <span>© {new Date().getFullYear()} Creatorly Technologies Inc. All rights reserved.</span>
              <span className="legal-dot">•</span>
              <button
                type="button"
                className="legal-link-btn"
                onClick={() => onNavigateToPage ? onNavigateToPage('about-creatorly') : onShowToast('Creatorly Privacy Policy: GDPR & SOC-2 compliant')}
              >
                Privacy Policy
              </button>
              <span className="legal-dot">•</span>
              <button
                type="button"
                className="legal-link-btn"
                onClick={() => onNavigateToPage ? onNavigateToPage('creator-standards') : onShowToast('Creatorly Terms of Service: Standard marketplace terms')}
              >
                Terms of Service
              </button>
              <span className="legal-dot">•</span>
              <button
                type="button"
                className="legal-link-btn"
                onClick={() => onNavigateToPage ? onNavigateToPage('how-escrow-works') : onShowToast('Creatorly Milestone Escrow Agreement: Bank-grade fund protection')}
              >
                Escrow Agreement
              </button>
              <span className="legal-dot">•</span>
              <button
                type="button"
                className="legal-link-btn"
                onClick={() => onShowToast('Cookie preferences saved: All analytical & functional cookies active')}
              >
                Cookie Preferences
              </button>
            </div>

            <button
              type="button"
              className="footer-back-top"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <span>Back to the top</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </footer>

      {/* Booking and Messaging Modals */}
      {bookingModalOpen && (
        <BookingModal
          isOpen={true}
          onClose={() => {
            setBookingModalOpen(false);
            setPreselectedPackage(null);
          }}
          creator={creator}
          initialPackage={preselectedPackage || creator.packages[0]}
          currentCurrency={currentCurrency}
          onShowToast={onShowToast}
          onBookingSubmitted={onBookingSubmitted}
          onViewInPipeline={() => {
            setBookingModalOpen(false);
            setPreselectedPackage(null);
            if (onOpenPipeline) onOpenPipeline();
          }}
          currentUser={currentUser}
        />
      )}

      {messageModalOpen && (
        <MessageModal
          isOpen={true}
          onClose={() => setMessageModalOpen(false)}
          creator={creator}
          onShowToast={onShowToast}
          onMessageSubmitted={onMessageSubmitted}
          currentUser={currentUser}
        />
      )}

      {/* Senior UX: Interactive Video Case Study Modal */}
      {selectedCaseStudy && (
        <div className="case-study-modal-backdrop" onClick={() => setSelectedCaseStudy(null)}>
          <div className="case-study-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="case-study-header">
              <div className="case-study-tags">
                <span className="case-tag-platform">{selectedCaseStudy.platform}</span>
                <span className="case-tag-cat">{selectedCaseStudy.category}</span>
              </div>
              <button
                type="button"
                className="btn-close-case-modal"
                onClick={() => setSelectedCaseStudy(null)}
                aria-label="Close case study"
              >
                <X size={20} />
              </button>
            </div>

            <div className="case-study-body">
              <div className="case-study-visual">
                <img
                  src={selectedCaseStudy.imageUrl}
                  alt={selectedCaseStudy.title}
                  className="case-study-img"
                />

                {/* Simulated Interactive Video Player Bar */}
                <div className="case-study-player-bar">
                  <button
                    type="button"
                    className="btn-player-playpause"
                    onClick={() => {
                      setIsPlayingVideo(!isPlayingVideo);
                      onShowToast(isPlayingVideo ? 'Preview paused' : 'Playing verified campaign reel preview (HD)');
                    }}
                  >
                    {isPlayingVideo ? <Pause size={14} /> : <Play size={14} fill="#FFFFFF" />}
                    <span>{isPlayingVideo ? 'Pause' : 'Play Reel'}</span>
                  </button>
                  <div className="player-timeline">
                    <div className="player-progress" style={{ width: isPlayingVideo ? '65%' : '35%' }} />
                  </div>
                  <span className="player-timestamp">{isPlayingVideo ? '0:39 / 0:60' : '0:21 / 0:60'}</span>
                  <span className="player-quality-tag">1080p 60fps</span>
                </div>

                <div className="case-study-metric-overlay">
                  <div className="cs-stat">
                    <span className="cs-val">{selectedCaseStudy.views}</span>
                    <span className="cs-lbl">Organic Views</span>
                  </div>
                  <div className="cs-stat">
                    <span className="cs-val text-lime">{selectedCaseStudy.engagement}</span>
                    <span className="cs-lbl">Engagement Rate</span>
                  </div>
                  <div className="cs-stat">
                    <span className="cs-val">{selectedCaseStudy.duration}</span>
                    <span className="cs-lbl">Duration</span>
                  </div>
                </div>
              </div>

              <div className="case-study-details">
                <h2 className="case-study-title">{selectedCaseStudy.title}</h2>
                <div className="case-client-badge">
                  <span>Brand Partner:</span> <strong>{selectedCaseStudy.brandClient}</strong>
                </div>

                <div className="case-block">
                  <span className="case-block-label">DELIVERABLES</span>
                  <p className="case-block-text">{selectedCaseStudy.deliverable}</p>
                </div>

                <div className="case-block">
                  <span className="case-block-label">CREATIVE STRATEGY</span>
                  <p className="case-block-text">{selectedCaseStudy.strategy}</p>
                </div>

                <div className="case-quote-box">
                  <div className="case-quote-stars">
                    <Star size={14} fill="#F59E0B" color="#F59E0B" />
                    <Star size={14} fill="#F59E0B" color="#F59E0B" />
                    <Star size={14} fill="#F59E0B" color="#F59E0B" />
                    <Star size={14} fill="#F59E0B" color="#F59E0B" />
                    <Star size={14} fill="#F59E0B" color="#F59E0B" />
                  </div>
                  <p className="case-quote-text">{selectedCaseStudy.quote}</p>
                  <span className="case-quote-author">— Brand Marketing Lead</span>
                </div>

                <div className="case-modal-actions">
                  <button
                    type="button"
                    className="btn-case-book"
                    onClick={() => {
                      setSelectedCaseStudy(null);
                      handleOpenBooking();
                    }}
                  >
                    <span>Book similar project</span>
                    <ArrowUpRight size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn-case-close"
                    onClick={() => setSelectedCaseStudy(null)}
                  >
                    Back to portfolio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Creatorly Modal */}
      {activeFooterModal === 'about' && (
        <div className="case-study-modal-backdrop" onClick={() => setActiveFooterModal(null)}>
          <div className="info-sheet-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="case-study-header">
              <div className="case-study-tags">
                <span className="case-tag-platform">About Creatorly</span>
                <span className="case-tag-cat">Platform Mission</span>
              </div>
              <button
                type="button"
                className="btn-close-case-modal"
                onClick={() => setActiveFooterModal(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="info-sheet-content">
              <div className="info-sheet-badge">
                <Sparkles size={16} className="text-coral" />
                <span>Empowering transparent creator commerce worldwide</span>
              </div>
              <h2 className="info-sheet-title">Where modern brands meet verified creators.</h2>
              <p className="info-sheet-lead">
                Creatorly was built to replace 35% agency markups and vague negotiation emails with professional, verified storefronts.
              </p>

              <div className="info-sheet-grid">
                <div className="info-sheet-item">
                  <div className="info-item-icon">✓</div>
                  <h4>1. Audited Metrics</h4>
                  <p>Every creator's follower counts, engagement rates, and geographic reach are authenticated directly through social platform APIs.</p>
                </div>
                <div className="info-sheet-item">
                  <div className="info-item-icon">₹</div>
                  <h4>2. Upfront Pricing</h4>
                  <p>Clear deliverable packages with defined revisions, turnaround timelines, and commercial usage rights. Zero guesswork.</p>
                </div>
                <div className="info-sheet-item">
                  <div className="info-item-icon">🔒</div>
                  <h4>3. Bank-Grade Escrow</h4>
                  <p>Funds are held securely in milestone escrow and only released to the creator once the brand reviews and approves the final deliverable.</p>
                </div>
              </div>

              <div className="info-sheet-actions">
                <button
                  type="button"
                  className="btn-info-primary"
                  onClick={() => {
                    setActiveFooterModal(null);
                    handleOpenBooking();
                  }}
                >
                  <span>Start a Collaboration</span>
                  <ArrowUpRight size={16} />
                </button>
                <button
                  type="button"
                  className="btn-info-secondary"
                  onClick={() => setActiveFooterModal(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Careers Modal */}
      {activeFooterModal === 'careers' && (
        <div className="case-study-modal-backdrop" onClick={() => setActiveFooterModal(null)}>
          <div className="info-sheet-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="case-study-header">
              <div className="case-study-tags">
                <span className="case-tag-platform">Careers at Creatorly</span>
                <span className="case-tag-cat">We're Hiring</span>
              </div>
              <button
                type="button"
                className="btn-close-case-modal"
                onClick={() => setActiveFooterModal(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="info-sheet-content">
              <div className="info-sheet-badge">
                <span className="status-live-dot"></span>
                <span>3 Open Roles across Engineering, Design & Partnerships</span>
              </div>
              <h2 className="info-sheet-title">Build the infrastructure for the creator economy.</h2>
              <p className="info-sheet-lead">
                Join a high-velocity, design-driven team building transparent tools for 50,000+ creators and global brands.
              </p>

              <div className="career-roles-list">
                <div className="career-role-card">
                  <div className="role-top-row">
                    <div>
                      <h4 className="role-title">Senior Frontend Engineer (React / TypeScript)</h4>
                      <span className="role-meta">Product Engineering • Remote (Global) • Full-Time</span>
                    </div>
                    <button
                      type="button"
                      className="btn-apply-role"
                      onClick={() => onShowToast('Application opened: Senior Frontend Engineer! Resume upload ready.')}
                    >
                      Apply Now →
                    </button>
                  </div>
                  <p className="role-desc">Own our creator storefronts, real-time collaboration pipeline, and interactive canvas components.</p>
                </div>

                <div className="career-role-card">
                  <div className="role-top-row">
                    <div>
                      <h4 className="role-title">Creator Partnerships Lead (Tech & AI)</h4>
                      <span className="role-meta">Creator Relations • Mumbai / Bengaluru / Remote • Full-Time</span>
                    </div>
                    <button
                      type="button"
                      className="btn-apply-role"
                      onClick={() => onShowToast('Application opened: Creator Partnerships Lead! Resume upload ready.')}
                    >
                      Apply Now →
                    </button>
                  </div>
                  <p className="role-desc">Source, verify, and onboard top 1% tech YouTubers, AI developers, and gadget reviewers onto Creatorly.</p>
                </div>

                <div className="career-role-card">
                  <div className="role-top-row">
                    <div>
                      <h4 className="role-title">Product Designer (Design Systems & Micro-Interactions)</h4>
                      <span className="role-meta">Design Team • Remote (Global) • Full-Time</span>
                    </div>
                    <button
                      type="button"
                      className="btn-apply-role"
                      onClick={() => onShowToast('Application opened: Product Designer! Portfolio link ready.')}
                    >
                      Apply Now →
                    </button>
                  </div>
                  <p className="role-desc">Design ultra-premium, intuitive marketplace experiences with high-density typography and fluid animations.</p>
                </div>
              </div>

              <div className="info-sheet-actions">
                <button
                  type="button"
                  className="btn-info-secondary"
                  onClick={() => setActiveFooterModal(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Discover Influencers Modal */}
      {searchModalOpen && (
        <div className="case-study-modal-backdrop" onClick={() => setSearchModalOpen(false)}>
          <div className="search-influencer-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="case-study-header">
              <div className="case-study-tags">
                <span className="case-tag-platform">Influencer Marketplace</span>
                <span className="case-tag-cat">Verified Directory</span>
              </div>
              <button
                type="button"
                className="btn-close-case-modal"
                onClick={() => setSearchModalOpen(false)}
                aria-label="Close search dialog"
              >
                <X size={20} />
              </button>
            </div>

            <div className="search-modal-body">
              <h2 className="search-modal-title">Search Influencers & Creators</h2>
              <p className="search-modal-subtitle">
                Discover verified creators by name, niche, platform, or audience location.
              </p>

              {/* Big Search Input */}
              <div className="search-input-wrapper">
                <Search size={18} className="search-box-icon" />
                <input
                  type="text"
                  placeholder="Search by creator name, niche, city, or handle (e.g. Alex, AI, Mumbai)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="search-field-main"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="btn-clear-query"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search input"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="search-category-pills">
                {['All', 'Tech & AI', 'Developer Tools', 'Productivity', 'Consumer Tech', 'Lifestyle', 'Food'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`cat-pill-btn ${selectedCategoryFilter === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategoryFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Results Grid */}
              <div className="search-results-container">
                {filteredSearchCreators.length > 0 ? (
                  <div className="search-cards-stack">
                    {filteredSearchCreators.map((c) => (
                      <div
                        key={c.id}
                        className="search-creator-row-card"
                        onClick={() => {
                          if (onSelectCreator) onSelectCreator(c);
                          setSearchModalOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="row-card-left">
                          <img src={c.avatarUrl} alt={c.fullName} className="search-row-avatar" />
                          <div>
                            <div className="search-row-name-line">
                              <strong>{c.fullName}</strong>
                              <span className="search-verified-pill">✓ Verified</span>
                            </div>
                            <span className="search-row-handle">{c.handle}</span>
                            <span className="search-row-niche">{c.primaryNiche} • {c.location.city}, {c.location.country}</span>
                          </div>
                        </div>

                        <div className="row-card-right">
                          <div className="row-stat-peek">
                            <span className="peek-val">{c.metrics.totalAudience >= 1000 ? `${Math.round(c.metrics.totalAudience / 1000)}k` : c.metrics.totalAudience}</span>
                            <span className="peek-lbl">Audience</span>
                          </div>
                          <div className="row-price-peek">
                            <span className="peek-val">₹{c.packages[0]?.priceInINR.toLocaleString('en-IN') || '5,000'}</span>
                            <span className="peek-lbl">From</span>
                          </div>
                          <button type="button" className="btn-select-storefront">
                            <span>Storefront</span>
                            <ArrowUpRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="search-empty-box">
                    <Search size={32} className="empty-icon" />
                    <h4>No creators matched "{searchQuery}"</h4>
                    <p>Try searching for a different keyword or reset filters.</p>
                    <button
                      type="button"
                      className="btn-reset-filters"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategoryFilter('All');
                      }}
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Search Modal Footer */}
              <div className="search-modal-bottom-bar">
                <span>Showing {filteredSearchCreators.length} verified creators</span>
                <button
                  type="button"
                  className="btn-open-full-directory"
                  onClick={() => {
                    setSearchModalOpen(false);
                    if (_onBackToMarketplace) _onBackToMarketplace();
                    else scrollToSection('more-creators');
                  }}
                >
                  <span>Browse Full Marketplace</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Register as Influencer Onboarding Modal */}
      {onboardingModalOpen && (
        <CreatorOnboardingModal
          isOpen={true}
          onClose={() => setOnboardingModalOpen(false)}
          onCreatorCreated={(newCreator) => {
            setOnboardingModalOpen(false);
            if (onSelectCreator) onSelectCreator(newCreator);
            onShowToast(`Welcome to Creatorly, ${newCreator.fullName}! Your storefront is now live.`);
          }}
          currentCurrency={currentCurrency}
        />
      )}

      {/* ========================================================= */}
      {/* COMPLETE STYLESYSTEM MATCHING THE 7 SCREENSHOTS           */}
      {/* ========================================================= */}
      <style>{`
        .creator-profile-fresh {
          background-color: #FAF8F5;
          color: #18191E;
          font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          min-height: 100vh;
          position: relative;
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
          box-sizing: border-box;
        }

        .creator-profile-fresh h1,
        .creator-profile-fresh h2,
        .creator-profile-fresh h3,
        .creator-profile-fresh h4,
        .creator-profile-fresh .hero-title,
        .creator-profile-fresh .section-headline,
        .creator-profile-fresh .banner-giant-title {
          font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }

        .fresh-content-container {
          width: 100%;
          max-width: 1380px;
          margin: 0 auto;
          padding-left: clamp(20px, 3.5vw, 48px);
          padding-right: clamp(20px, 3.5vw, 48px);
          box-sizing: border-box;
        }

        .text-coral {
          color: #FF5B38 !important;
        }

        .text-teal {
          color: #2DD4BF !important;
        }

        .text-lime {
          color: #D4F754 !important;
        }

        /* 4 Dots Logo Motif */
        .four-dots {
          display: grid;
          grid-template-columns: repeat(2, 6px);
          gap: 3px;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .dot-green { background-color: #54c463; }
        .dot-orange { background-color: #ed7d1b; }
        .dot-blue { background-color: #5184f5; }
        .dot-pink { background-color: #e356a7; }

        /* ========================================================= */
        /* NAVBAR & ACTIVE PROFILE SWITCH BAR                        */
        /* ========================================================= */
        .fresh-navbar {
          background: #FAF8F5;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(12px);
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        .fresh-nav-container {
          width: 100%;
          max-width: 1380px;
          margin: 0 auto;
          padding: 16px clamp(20px, 3.5vw, 48px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
        }

        .active-profile-switch-bar {
          background: #18191E;
          color: #FFFFFF;
          padding: 10px 0;
          font-size: 0.85rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }

        .active-profile-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .switch-banner-text {
          color: #E2E8F0;
        }

        .switch-banner-text strong {
          color: #D4F754;
        }

        .btn-switch-alex {
          background: rgba(255, 255, 255, 0.12);
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.24);
          padding: 5px 12px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-switch-alex:hover {
          background: #D4F754;
          color: #18191E;
          border-color: #D4F754;
        }

        .fresh-logo-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .logo-text {
          font-size: 1.25rem;
          font-weight: 800;
          color: #18191E;
          letter-spacing: -0.03em;
        }

        .fresh-nav-links {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        @media (max-width: 860px) {
          .fresh-nav-links {
            display: none;
          }
        }

        .fresh-nav-links button {
          background: none;
          border: none;
          font-size: 0.875rem;
          font-weight: 500;
          color: #5C616E;
          cursor: pointer;
          transition: color 0.15s ease;
        }

        .fresh-nav-links button:hover {
          color: #18191E;
        }

        .fresh-nav-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nav-portal-group {
          display: inline-flex;
          align-items: center;
          background: #F1F5F2;
          padding: 3px;
          border-radius: 9999px;
          border: 1px solid rgba(24, 25, 30, 0.08);
          gap: 2px;
        }

        .nav-btn-portal {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          font-size: 0.78rem;
          font-weight: 600;
          border: none;
          background: transparent;
          color: #334155;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .nav-btn-portal:hover {
          background: #FFFFFF;
          color: #16281D;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
        }

        .nav-btn-brand:hover {
          color: #15803D;
        }

        .nav-btn-creator:hover {
          color: #0F172A;
        }

        .nav-actions-divider {
          width: 1px;
          height: 22px;
          background: rgba(24, 25, 30, 0.12);
          margin: 0 2px;
        }

        .nav-say-hello {
          background: #FFFFFF;
          border: 1.5px solid rgba(24, 25, 30, 0.15);
          font-size: 0.84rem;
          font-weight: 600;
          color: #18191E;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          white-space: nowrap;
        }

        .nav-say-hello:hover {
          background: #FFF5F2;
          color: #FF5B38;
          border-color: #FF5B38;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(255, 91, 56, 0.18);
        }

        .nav-say-hello:active {
          transform: translateY(0);
        }

        .nav-work-together {
          background: #18191E;
          color: #FFFFFF;
          border: 1.5px solid #18191E;
          padding: 8px 18px;
          border-radius: 9999px;
          font-size: 0.84rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
          white-space: nowrap;
        }

        .nav-work-together:hover {
          background: #FF5B38;
          border-color: #FF5B38;
          color: #FFFFFF;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(255, 91, 56, 0.32);
        }

        .nav-work-together:active {
          transform: translateY(0);
        }

        .marketplace-back-strip {
          background: #F4F1EA;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          padding: 8px clamp(24px, 4.5vw, 64px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
        }

        .btn-back-market {
          background: none;
          border: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          color: #18191E;
          cursor: pointer;
        }

        .btn-back-market:hover {
          text-decoration: underline;
        }

        .back-strip-note {
          color: #71717A;
        }

        /* ========================================================= */
        /* HERO SECTION                                              */
        /* ========================================================= */
        .fresh-hero-section {
          padding: 36px 0 52px;
          width: 100%;
          max-width: 100%;
          overflow: hidden;
          box-sizing: border-box;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: minmax(360px, 520px) minmax(0, 1fr);
          gap: clamp(32px, 4.5vw, 68px);
          align-items: center;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        @media (min-width: 1280px) {
          .hero-grid {
            grid-template-columns: 530px minmax(0, 1fr);
            gap: 60px;
          }
        }

        .hero-info-col {
          min-width: 0;
          max-width: 100%;
          width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 990px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }
        }

        /* Left Portrait */
        .portrait-frame {
          position: relative;
          width: 100%;
          max-width: 530px;
          aspect-ratio: 1 / 1.05;
          border-radius: 26px;
          overflow: visible;
          margin: 0;
        }

        @media (max-width: 990px) {
          .portrait-frame {
            max-width: 440px;
            margin: 0 auto;
          }
        }

        .portrait-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 26px;
          box-shadow: 0 24px 56px -12px rgba(0, 0, 0, 0.16);
        }

        /* Overlapping Green Round Sticker */
        .badge-making-tech {
          position: absolute;
          top: -22px;
          left: -22px;
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background: #BEF264;
          color: #18191E;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-size: 0.7rem;
          font-weight: 700;
          line-height: 1.25;
          padding: 10px;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
          z-index: 5;
        }

        /* Bottom Pill Overlay */
        .pill-open-projects {
          position: absolute;
          bottom: 18px;
          right: 18px;
          background: #FFFFFF;
          border-radius: 9999px;
          padding: 7px 16px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #18191E;
          display: flex;
          align-items: center;
          gap: 7px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          z-index: 5;
        }

        .live-dot-green {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22C55E;
        }

        /* Right Hero Info */
        .hero-eyebrow-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .fresh-eyebrow {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #71717A;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .eyebrow-bullet {
          color: #FF5B38;
          font-size: 1rem;
        }

        /* Pink "ideas in motion" circle sticker */
        .sticker-ideas-motion {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: #F472B6;
          border: 1px solid #18191E;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          font-weight: 700;
          color: #18191E;
          text-align: center;
          line-height: 1.2;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
          transform: rotate(6deg);
        }

        .sticker-sparkle {
          margin-bottom: 2px;
        }

        .hero-title {
          font-size: clamp(3.5rem, 5.2vw, 5.4rem);
          font-weight: 900;
          line-height: 0.96;
          letter-spacing: -0.04em;
          color: #18191E;
          margin: 0 0 18px;
        }

        .hero-badges-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .badge-handle {
          background: #EDE8DE;
          color: #18191E;
          font-size: 0.775rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .badge-sample-profile {
          border: 1px solid #D4D4D8;
          color: #71717A;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          padding: 3px 8px;
          border-radius: 6px;
        }

        .hero-bio-text {
          font-size: 1.18rem;
          color: #3F3F46;
          line-height: 1.62;
          max-width: 800px;
          margin: 0 0 22px;
        }

        /* Senior UX: SLA strip */
        .hero-sla-strip {
          display: inline-flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
          background: #F4EFE6;
          border: 1px solid #E5DEC9;
          padding: 9px 18px;
          border-radius: 12px;
          font-size: 0.84rem;
          color: #374151;
          margin-bottom: 22px;
        }

        .sla-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .sla-dot-pulse {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #16A34A;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.2);
        }

        .sla-divider {
          color: #A3A3A3;
          font-size: 0.75rem;
        }

        .sla-icon {
          color: #FF5B38;
        }

        .hero-meta-row {
          display: flex;
          align-items: center;
          gap: 18px;
          font-size: 0.85rem;
          color: #71717A;
          margin-bottom: 16px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .meta-icon {
          color: #FF5B38;
        }

        .hero-socials-row {
          display: flex;
          gap: 16px;
          margin-bottom: 28px;
        }

        .social-text-link {
          font-size: 0.85rem;
          font-weight: 600;
          color: #18191E;
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        .hero-cta-row {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: 20px;
        }

        .btn-make-something {
          background: #18191E;
          color: #FFFFFF;
          border: none;
          padding: 14px 28px;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.15s ease;
        }

        .btn-make-something:hover {
          background: #000000;
          transform: translateY(-1px);
        }

        .btn-see-work {
          background: none;
          border: none;
          font-size: 0.875rem;
          font-weight: 600;
          color: #18191E;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        /* Quick Niche Discovery Filter Bar */
        .hero-niche-quickbar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;
          width: 100%;
          max-width: 820px;
        }

        .niche-quickbar-label {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #71717A;
          white-space: nowrap;
        }

        .niche-quickbar-tags {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .niche-tag-btn {
          background: #FFFFFF;
          border: 1px solid #E4E4E7;
          color: #3F3F46;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .niche-tag-btn:hover {
          border-color: #18191E;
          color: #18191E;
          background: #FAF9F6;
        }

        .niche-tag-btn.active {
          background: #18191E;
          color: #FFFFFF;
          border-color: #18191E;
        }

        /* Senior UX: Brand collaborations ribbon */
        .hero-brands-ribbon {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
          width: 100%;
          max-width: 820px;
          min-width: 0;
          overflow: hidden;
          box-sizing: border-box;
        }

        .brands-ribbon-label {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #71717A;
          white-space: nowrap;
        }

        .brands-marquee-wrap {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          position: relative;
          mask-image: linear-gradient(to right, transparent, black 16px, black calc(100% - 24px), transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 16px, black calc(100% - 24px), transparent);
        }

        .brands-marquee-track {
          display: flex;
          align-items: center;
          gap: 10px;
          width: max-content;
          animation: brandsMarquee 34s linear infinite;
        }

        .brands-marquee-track:hover {
          animation-play-state: paused;
        }

        @keyframes brandsMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .brand-pill.marquee-pill {
          white-space: nowrap;
          background: #FFFFFF;
          border: 1px solid #E5E1D8;
          border-radius: 6px;
          padding: 4px 10px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #27272A;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          display: inline-block;
        }

        .hero-microcopy {
          display: block;
          font-size: 0.725rem;
          color: #A1A1AA;
        }

        /* ========================================================= */
        /* NUMBERS AT A GLANCE (Dark Band)                           */
        /* ========================================================= */
        .fresh-numbers-section {
          background: #151922;
          color: #FFFFFF;
          padding: 72px 0 64px;
        }

        .numbers-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 32px;
          margin-bottom: 32px;
        }

        @media (max-width: 800px) {
          .numbers-header-row {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        .numbers-tag {
          font-size: 0.725rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #94A3B8;
          text-transform: uppercase;
          display: block;
          margin-bottom: 8px;
        }

        .numbers-title {
          color: #FFFFFF !important;
          font-size: clamp(2.4rem, 3.8vw, 3.6rem);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.035em;
          margin: 0;
        }

        .numbers-subtext {
          font-size: 0.85rem;
          color: #94A3B8;
          max-width: 380px;
          line-height: 1.5;
          margin: 0;
        }

        .numbers-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.12);
          margin-bottom: 40px;
        }

        .numbers-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-bottom: 44px;
        }

        @media (max-width: 800px) {
          .numbers-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .num-big-val {
          font-size: clamp(3.2rem, 4.5vw, 4.2rem);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.04em;
          margin-bottom: 10px;
          color: #FFFFFF;
        }

        .num-label {
          font-size: 0.95rem;
          font-weight: 700;
          color: #F8FAFC;
          margin-bottom: 4px;
        }

        .num-sample-note {
          font-size: 0.725rem;
          color: #64748B;
        }

        .numbers-footer-notice {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          color: #94A3B8;
        }

        .notice-dot-red {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #EF4444;
        }

        .notice-dot-green {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22C55E;
        }

        /* ========================================================= */
        /* SECTION 3: THE WORK                                       */
        /* ========================================================= */
        .fresh-work-section {
          padding: 84px 0 72px;
        }

        .section-header-split {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 32px;
          margin-bottom: 36px;
        }

        @media (max-width: 800px) {
          .section-header-split {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        .section-headline {
          font-size: clamp(2.4rem, 3.8vw, 3.6rem);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.035em;
          color: #18191E;
          margin: 10px 0 0;
        }

        .section-header-desc {
          font-size: 0.95rem;
          color: #5C616E;
          max-width: 420px;
          line-height: 1.55;
          margin: 0;
        }

        .work-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 24px;
        }

        @media (max-width: 860px) {
          .work-cards-grid {
            grid-template-columns: 1fr;
          }
        }

        .work-card-fresh {
          background: #FFFFFF;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #EAE6DF;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
          user-select: none;
        }

        .work-card-fresh:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.1);
        }

        .work-thumb-box {
          position: relative;
          aspect-ratio: 16/10;
          width: 100%;
          overflow: hidden;
          background: #E2E8F0;
        }

        .work-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s ease;
        }

        .work-card-fresh:hover .work-thumb-img {
          transform: scale(1.03);
        }

        .work-index-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #FFFFFF;
          color: #18191E;
          font-size: 0.725rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 4px;
          z-index: 2;
        }

        .case-study-hover-badge {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(24, 25, 30, 0.85);
          color: #FFFFFF;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
          backdrop-filter: blur(4px);
          opacity: 0;
          transform: translateY(4px);
          transition: all 0.2s ease;
          z-index: 2;
        }

        .work-card-fresh:hover .case-study-hover-badge {
          opacity: 1;
          transform: translateY(0);
        }

        .play-button-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(15, 23, 42, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(6px);
          transition: transform 0.2s ease, background 0.2s ease;
          z-index: 2;
        }

        .work-card-fresh:hover .play-button-overlay {
          transform: translate(-50%, -50%) scale(1.1);
          background: #FF5B38;
        }

        .work-card-info {
          padding: 18px 20px 22px;
        }

        .work-cat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .work-category {
          font-size: 0.75rem;
          font-weight: 600;
          color: #71717A;
        }

        .btn-work-arrow {
          background: none;
          border: none;
          color: #18191E;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .work-card-fresh:hover .btn-work-arrow {
          transform: translate(2px, -2px);
          color: #FF5B38;
        }

        .work-card-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #18191E;
          letter-spacing: -0.02em;
          margin: 0;
          line-height: 1.35;
        }

        .work-bottom-notice {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          color: #71717A;
        }

        .notice-cam-icon {
          color: #FF5B38;
        }

        /* Senior UX: Case Study Preview Modal */
        .case-study-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .case-study-modal-card {
          background: #FFFFFF;
          border-radius: 20px;
          max-width: 880px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.25);
          border: 1px solid #E2E8F0;
        }

        .case-study-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #F1F5F9;
        }

        .case-study-tags {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .case-tag-platform {
          background: #18191E;
          color: #FFFFFF;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .case-tag-cat {
          background: #F4F1EA;
          color: #475569;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .btn-close-case-modal {
          background: #F1F5F9;
          border: none;
          color: #64748B;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-close-case-modal:hover {
          background: #E2E8F0;
          color: #0F172A;
        }

        .case-study-body {
          padding: 24px;
        }

        .case-study-visual {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          aspect-ratio: 16/9;
          background: #0F172A;
          margin-bottom: 24px;
        }

        .case-study-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .case-study-metric-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.92) 100%);
          padding: 28px 24px 18px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .cs-stat {
          display: flex;
          flex-direction: column;
        }

        .cs-val {
          font-size: 1.45rem;
          font-weight: 900;
          color: #FFFFFF;
          line-height: 1.1;
        }

        .cs-lbl {
          font-size: 0.75rem;
          color: #94A3B8;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 2px;
        }

        .case-study-details {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .case-study-title {
          font-size: 1.65rem;
          font-weight: 900;
          color: #18191E;
          letter-spacing: -0.03em;
          margin: 0;
        }

        .case-client-badge {
          font-size: 0.9rem;
          color: #475569;
        }

        .case-client-badge strong {
          color: #18191E;
        }

        .case-block {
          background: #FAF8F5;
          border: 1px solid #ECE7DE;
          padding: 14px 18px;
          border-radius: 10px;
        }

        .case-block-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #71717A;
          margin-bottom: 4px;
        }

        .case-block-text {
          font-size: 0.92rem;
          color: #334155;
          line-height: 1.55;
          margin: 0;
        }

        .case-quote-box {
          background: #FEF3C7;
          border: 1px solid #FDE68A;
          padding: 16px 20px;
          border-radius: 12px;
        }

        .case-quote-stars {
          display: flex;
          gap: 4px;
          margin-bottom: 8px;
        }

        .case-quote-text {
          font-size: 0.95rem;
          font-style: italic;
          color: #78350F;
          line-height: 1.5;
          margin: 0 0 6px;
        }

        .case-quote-author {
          font-size: 0.8rem;
          font-weight: 700;
          color: #92400E;
        }

        .case-modal-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 8px;
        }

        .btn-case-book {
          background: #18191E;
          color: #FFFFFF;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .btn-case-book:hover {
          background: #000000;
        }

        .btn-case-close {
          background: #F1F5F9;
          color: #475569;
          border: none;
          padding: 12px 20px;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-case-close:hover {
          background: #E2E8F0;
        }

        /* ========================================================= */
        /* SECTION 4: THE COLLAB MENU                                */
        /* ========================================================= */
        .fresh-collab-section {
          padding: 84px 0 72px;
        }

        .collab-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 24px;
        }

        @media (max-width: 900px) {
          .collab-cards-grid {
            grid-template-columns: 1fr;
          }
        }

        .collab-card-fresh {
          border-radius: 16px;
          padding: 28px 24px 24px;
          display: flex;
          flex-direction: column;
          color: #0F172A;
          position: relative;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }

        .collab-card-fresh.popular-card {
          border: 2px solid #18191E;
          transform: translateY(-4px);
        }

        .collab-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .collab-num {
          font-size: 0.85rem;
          font-weight: 800;
        }

        .badge-fan-favorite {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #18191E;
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .collab-title {
          font-size: 1.5rem;
          font-weight: 900;
          letter-spacing: -0.025em;
          margin: 0 0 6px;
        }

        .collab-desc {
          font-size: 0.85rem;
          line-height: 1.45;
          color: rgba(15, 23, 42, 0.8);
          margin: 0 0 28px;
          min-height: 38px;
        }

        .collab-price-row {
          margin-bottom: 28px;
        }

        .price-from-label {
          display: block;
          font-size: 0.725rem;
          font-weight: 700;
          text-transform: uppercase;
          color: rgba(15, 23, 42, 0.65);
        }

        .price-amount {
          font-size: 2.2rem;
          font-weight: 900;
          letter-spacing: -0.03em;
        }

        .collab-mix-block {
          margin-bottom: 32px;
          flex: 1;
        }

        .mix-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: rgba(15, 23, 42, 0.75);
          margin-bottom: 12px;
        }

        .mix-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .mix-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.825rem;
          font-weight: 600;
          line-height: 1.4;
        }

        .mix-check {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .btn-choose-package {
          width: 100%;
          background: #18191E;
          color: #FFFFFF;
          border: none;
          padding: 13px 20px;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .btn-choose-package:hover {
          background: #000000;
        }

        .collab-bottom-notice {
          font-size: 0.75rem;
          color: #71717A;
        }

        /* ========================================================= */
        /* SECTION 5: THE TRUST PART & FAQ                           */
        /* ========================================================= */
        .fresh-trust-section {
          padding: 84px 0 80px;
        }

        .trust-split-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(32px, 5vw, 64px);
          align-items: center;
        }

        .faq-split-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(32px, 5vw, 64px);
          align-items: flex-start;
        }

        .trust-left-col {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .trust-headline-giant {
          font-family: var(--font-sans);
          font-size: clamp(3.6rem, 5.6vw, 5.8rem) !important;
          font-weight: 900 !important;
          line-height: 0.95 !important;
          letter-spacing: -0.045em !important;
          color: #18191E;
          margin: 16px 0 20px 0;
        }

        @media (max-width: 860px) {
          .trust-split-row,
          .faq-split-row {
            grid-template-columns: 1fr;
          }
        }

        .trust-subtext {
          font-size: 1.05rem;
          color: #5C616E;
          line-height: 1.6;
          margin: 0;
          max-width: 480px;
        }

        .no-reviews-box {
          background: #FFFFFF;
          border: 1px solid #EAE6DF;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
        }

        .pink-msg-icon {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: #FCE7F3;
          color: #EC4899;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .no-reviews-tag {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #71717A;
          display: block;
          margin-bottom: 4px;
        }

        .no-reviews-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #18191E;
          margin: 0 0 6px;
          letter-spacing: -0.02em;
        }

        .no-reviews-desc {
          font-size: 0.85rem;
          color: #5C616E;
          line-height: 1.5;
          margin: 0 0 16px;
        }

        .link-explore-packages {
          background: none;
          border: none;
          color: #FF5B38;
          font-size: 0.85rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          padding: 0;
        }

        .link-explore-packages:hover {
          text-decoration: underline;
        }

        .section-hairline {
          height: 1px;
          background: #EAE6DF;
          margin: 64px 0;
        }

        /* FAQ Accordion */
        .faq-accordion-list {
          display: flex;
          flex-direction: column;
          border-top: 1px solid #EAE6DF;
        }

        .faq-item {
          border-bottom: 1px solid #EAE6DF;
        }

        .faq-question-btn {
          width: 100%;
          background: none;
          border: none;
          padding: 20px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
          font-size: 1.05rem;
          font-weight: 800;
          color: #18191E;
          cursor: pointer;
        }

        .faq-chevron {
          color: #71717A;
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }

        .faq-chevron.rotate {
          transform: rotate(180deg);
        }

        .faq-answer-pane {
          padding-bottom: 20px;
          font-size: 0.9rem;
          color: #5C616E;
          line-height: 1.6;
        }

        .faq-answer-pane p {
          margin: 0;
        }

        /* ========================================================= */
        /* SECTION 6: MORE TALENT                                    */
        /* ========================================================= */
        .fresh-talent-section {
          padding: 84px 0 72px;
        }

        .talent-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 24px;
        }

        @media (max-width: 860px) {
          .talent-cards-grid {
            grid-template-columns: 1fr;
          }
        }

        .talent-card-fresh {
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .talent-card-fresh:hover {
          transform: translateY(-4px);
        }

        .talent-photo-box {
          position: relative;
          width: 100%;
          aspect-ratio: 1/1;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 14px;
          background: #E2E8F0;
        }

        .talent-photo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .talent-num-badge {
          position: absolute;
          bottom: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 800;
          color: #18191E;
        }

        .talent-name-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }

        .talent-name {
          font-size: 1.15rem;
          font-weight: 800;
          color: #18191E;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .talent-arrow {
          color: #FF5B38;
        }

        .talent-niche {
          display: block;
          font-size: 0.825rem;
          color: #5C616E;
          margin-bottom: 4px;
        }

        .talent-loc {
          display: block;
          font-size: 0.725rem;
          color: #71717A;
        }

        .talent-bottom-notice {
          font-size: 0.75rem;
          color: #71717A;
        }

        /* ========================================================= */
        /* SECTION 7: BIG CORAL BANNER                               */
        /* ========================================================= */
        .fresh-noise-banner {
          background-color: #FF5B38;
          color: #18191E;
          padding: 100px 0 90px;
          position: relative;
          overflow: hidden;
        }

        .noise-inner {
          position: relative;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .banner-four-dots {
          position: absolute;
          top: 0;
          left: 20px;
          display: grid;
          grid-template-columns: repeat(2, 7px);
          gap: 4px;
        }

        .bdot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .bdot-black { background: #18191E; }
        .bdot-lime { background: #D4F754; }
        .bdot-pink { background: #F472B6; }
        .bdot-yellow { background: #FDE047; }

        .banner-star-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #D4F754;
          color: #18191E;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .banner-tag {
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: #18191E;
          margin-bottom: 16px;
        }

        .banner-giant-title {
          font-size: clamp(3.8rem, 7vw, 6.4rem);
          font-weight: 900;
          line-height: 0.95;
          letter-spacing: -0.04em;
          color: #18191E;
          margin: 0 0 24px;
        }

        .lime-square-dot {
          display: inline-block;
          width: 18px;
          height: 18px;
          background: #D4F754;
          margin-left: 8px;
        }

        .banner-subtext {
          font-size: 1.15rem;
          font-weight: 500;
          color: rgba(24, 25, 30, 0.85);
          max-width: 580px;
          line-height: 1.5;
          margin: 0 0 32px;
        }

        .btn-banner-start {
          background: #18191E;
          color: #FFFFFF;
          border: none;
          padding: 14px 28px;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          margin-bottom: 14px;
          transition: transform 0.15s ease, background 0.15s ease;
        }

        .btn-banner-start:hover {
          background: #000000;
          transform: translateY(-2px);
        }

        .banner-microcopy {
          font-size: 0.75rem;
          color: rgba(24, 25, 30, 0.65);
        }

        .banner-star-bottom {
          position: absolute;
          bottom: 10px;
          right: 30px;
          color: #D4F754;
        }

        /* ========================================================= */
        /* SECTION 8: FULL MARKETPLACE FOOTER                        */
        /* ========================================================= */
        .fresh-footer {
          background: #0D111A;
          color: #94A3B8;
          padding: 72px 0 36px;
          font-size: 0.875rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .footer-columns-grid {
          display: grid;
          grid-template-columns: 2.2fr 1fr 1fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 48px;
        }

        .footer-brand-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .footer-logo-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .footer-wordmark {
          font-size: 1.25rem;
          font-weight: 800;
          color: #FFFFFF;
          letter-spacing: -0.03em;
        }

        .footer-mission-text {
          margin: 0;
          color: #94A3B8;
          font-size: 0.875rem;
          line-height: 1.6;
          max-width: 340px;
        }

        .footer-trust-chips {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 8px;
        }

        .footer-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.775rem;
          color: #CBD5E1;
          background: rgba(255, 255, 255, 0.05);
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          width: fit-content;
        }

        .status-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22C55E;
          box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
        }

        .footer-nav-col {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .footer-col-title {
          font-size: 0.85rem;
          font-weight: 800;
          color: #FFFFFF;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hiring-badge {
          background: #FF5B38;
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 9999px;
          text-transform: none;
          letter-spacing: normal;
        }

        .footer-links-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-links-list li button {
          background: none;
          border: none;
          padding: 0;
          color: #94A3B8;
          font-size: 0.85rem;
          cursor: pointer;
          text-align: left;
          transition: color 0.15s ease, transform 0.15s ease;
        }

        .footer-links-list li button:hover {
          color: #FFFFFF;
          transform: translateX(3px);
        }

        .footer-hairline {
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          margin: 28px 0;
        }

        .footer-social-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .social-row-label {
          color: #E2E8F0;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .social-pill-buttons {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .social-pill-btn {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #CBD5E1;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .social-pill-btn:hover {
          background: #D4F754;
          color: #0F172A;
          border-color: #D4F754;
          transform: translateY(-2px);
        }

        .footer-bottom-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 0.8rem;
          color: #64748B;
        }

        .footer-legal-copy {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .legal-dot {
          color: #475569;
        }

        .legal-link-btn {
          background: none;
          border: none;
          padding: 0;
          color: #64748B;
          font-size: 0.8rem;
          cursor: pointer;
          transition: color 0.15s ease;
        }

        .legal-link-btn:hover {
          color: #CBD5E1;
          text-decoration: underline;
        }

        .footer-back-top {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          color: #FFFFFF;
          font-weight: 600;
          font-size: 0.8rem;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .footer-back-top:hover {
          background: #FFFFFF;
          color: #0F172A;
        }

        /* Info Sheet Modals (About & Careers) */
        .info-sheet-modal-card {
          background: #FFFFFF;
          width: 90%;
          max-width: 760px;
          border-radius: 28px;
          padding: 32px 36px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
          position: relative;
          max-height: 85vh;
          overflow-y: auto;
        }

        .info-sheet-content {
          padding-top: 16px;
        }

        .info-sheet-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #F1F5F9;
          color: #334155;
          font-size: 0.775rem;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 9999px;
          margin-bottom: 16px;
        }

        .info-sheet-title {
          font-size: clamp(1.5rem, 2.5vw, 2rem);
          font-weight: 900;
          color: #0F172A;
          letter-spacing: -0.03em;
          line-height: 1.2;
          margin: 0 0 12px;
        }

        .info-sheet-lead {
          font-size: 1.05rem;
          color: #64748B;
          line-height: 1.6;
          margin: 0 0 28px;
        }

        .info-sheet-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-bottom: 32px;
        }

        .info-sheet-item {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 20px;
        }

        .info-item-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #0F172A;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.9rem;
          margin-bottom: 12px;
        }

        .info-sheet-item h4 {
          font-size: 0.95rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 6px;
        }

        .info-sheet-item p {
          font-size: 0.8rem;
          color: #64748B;
          line-height: 1.5;
          margin: 0;
        }

        .info-sheet-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-info-primary {
          background: #0F172A;
          color: #FFFFFF;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: background 0.15s ease;
        }

        .btn-info-primary:hover {
          background: #FF5B38;
        }

        .btn-info-secondary {
          background: #F1F5F9;
          color: #475569;
          border: none;
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .btn-info-secondary:hover {
          background: #E2E8F0;
        }

        /* Careers list styling */
        .career-roles-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 28px;
        }

        .career-role-card {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 20px 24px;
          transition: border-color 0.15s ease;
        }

        .career-role-card:hover {
          border-color: #CBD5E1;
        }

        .role-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 8px;
        }

        .role-title {
          font-size: 1rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 4px;
        }

        .role-meta {
          font-size: 0.775rem;
          color: #64748B;
          font-weight: 600;
        }

        .role-desc {
          font-size: 0.85rem;
          color: #475569;
          line-height: 1.5;
          margin: 0;
        }

        .btn-apply-role {
          background: #0F172A;
          color: #FFFFFF;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .btn-apply-role:hover {
          background: #FF5B38;
        }

        @media (max-width: 1024px) {
          .footer-columns-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .footer-brand-column {
            grid-column: 1 / -1;
          }
          .info-sheet-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .footer-columns-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .footer-bottom-bar {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        /* Search Influencers Discovery Modal */
        .search-influencer-modal-card {
          background: #FFFFFF;
          width: 92%;
          max-width: 820px;
          border-radius: 24px;
          padding: 0;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
          position: relative;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .search-modal-body {
          padding: 24px 28px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .search-modal-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #18191E;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .search-modal-subtitle {
          font-size: 0.88rem;
          color: #64748B;
          margin: 0 0 4px 0;
          line-height: 1.4;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .search-box-icon {
          position: absolute;
          left: 16px;
          color: #94A3B8;
          pointer-events: none;
        }

        .search-field-main {
          width: 100%;
          padding: 13px 44px 13px 46px;
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          font-size: 0.92rem;
          color: #18191E;
          outline: none;
          transition: all 0.15s ease;
          font-family: inherit;
        }

        .search-field-main:focus {
          border-color: #FF5B38;
          background: #FFFFFF;
          box-shadow: 0 0 0 4px rgba(255, 91, 56, 0.12);
        }

        .btn-clear-query {
          position: absolute;
          right: 14px;
          background: #E2E8F0;
          border: none;
          color: #64748B;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-clear-query:hover {
          background: #CBD5E1;
          color: #18191E;
        }

        .search-category-pills {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
          scrollbar-width: none;
        }

        .search-category-pills::-webkit-scrollbar {
          display: none;
        }

        .cat-pill-btn {
          background: #F1F5F9;
          color: #475569;
          border: 1px solid transparent;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 0.78rem;
          font-weight: 600;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .cat-pill-btn:hover {
          background: #E2E8F0;
          color: #18191E;
        }

        .cat-pill-btn.active {
          background: #18191E;
          color: #FFFFFF;
          border-color: #18191E;
        }

        .search-results-container {
          max-height: 380px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .search-cards-stack {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .search-creator-row-card {
          background: #F8FAFC;
          border: 1.5px solid #F1F5F9;
          border-radius: 14px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .search-creator-row-card:hover {
          background: #FFFFFF;
          border-color: #FF5B38;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
        }

        .row-card-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .search-row-avatar {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #FFFFFF;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        .search-row-name-line {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .search-row-name-line strong {
          font-size: 0.92rem;
          font-weight: 700;
          color: #18191E;
        }

        .search-verified-pill {
          background: #DCFCE7;
          color: #166534;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .search-row-handle {
          display: block;
          font-size: 0.78rem;
          color: #64748B;
          font-weight: 500;
        }

        .search-row-niche {
          display: block;
          font-size: 0.74rem;
          color: #94A3B8;
        }

        .row-card-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .row-stat-peek, .row-price-peek {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .peek-val {
          font-size: 0.88rem;
          font-weight: 700;
          color: #18191E;
        }

        .peek-lbl {
          font-size: 0.68rem;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .btn-select-storefront {
          background: #18191E;
          color: #FFFFFF;
          border: none;
          padding: 7px 12px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .search-creator-row-card:hover .btn-select-storefront {
          background: #FF5B38;
        }

        .search-empty-box {
          text-align: center;
          padding: 36px 16px;
          color: #64748B;
        }

        .empty-icon {
          color: #CBD5E1;
          margin-bottom: 12px;
        }

        .search-empty-box h4 {
          font-size: 1rem;
          font-weight: 700;
          color: #18191E;
          margin: 0 0 6px 0;
        }

        .search-empty-box p {
          font-size: 0.85rem;
          margin: 0 0 16px 0;
        }

        .btn-reset-filters {
          background: #F1F5F9;
          border: 1px solid #CBD5E1;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #18191E;
          cursor: pointer;
        }

        .search-modal-bottom-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 28px;
          background: #F8FAFC;
          border-top: 1px solid #F1F5F9;
          font-size: 0.82rem;
          color: #64748B;
        }

        .btn-open-full-directory {
          background: none;
          border: none;
          color: #FF5B38;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        }

        .btn-open-full-directory:hover {
          text-decoration: underline;
        }

        @media (max-width: 860px) {
          .fresh-nav-actions {
            gap: 6px;
          }
          .nav-say-hello,
          .nav-work-together {
            padding: 6px 12px;
            font-size: 0.78rem;
          }
        }

        @media (max-width: 640px) {
          .nav-say-hello span,
          .nav-work-together span {
            display: none;
          }
          .nav-say-hello,
          .nav-work-together {
            padding: 8px;
            border-radius: 50%;
          }
          .search-creator-row-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .row-card-right {
            width: 100%;
            justify-content: space-between;
          }
        }
        /* Newly Added Feature Styling: Clean, Normal, Cool & Plane */
        .hero-niche-quickbar {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 20px;
          margin-bottom: 8px;
        }

        .niche-quickbar-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .niche-quickbar-tags {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .niche-tag-btn {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          color: #334155;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .niche-tag-btn:hover {
          border-color: #18191E;
          color: #18191E;
          background: #F8FAFC;
        }

        .niche-tag-btn.active {
          background: #18191E;
          border-color: #18191E;
          color: #FFFFFF;
        }

        /* Brand Marquee */
        .brands-marquee-wrap {
          flex: 1;
          min-width: 0;
          width: 100%;
          max-width: 100%;
          overflow: hidden;
          position: relative;
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          box-sizing: border-box;
        }

        .brands-marquee-track {
          display: flex;
          align-items: center;
          gap: 12px;
          width: max-content;
          animation: marqueeScroll 28s linear infinite;
        }

        .brands-marquee-track:hover {
          animation-play-state: paused;
        }

        @keyframes marqueeScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marquee-pill {
          white-space: nowrap;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #334155;
        }

        /* Add-ons Deliverables Calculator */
        .collab-addons-block {
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 12px;
          padding: 12px 14px;
          margin: 16px 0 12px;
        }

        .addons-title {
          display: block;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #475569;
          margin-bottom: 8px;
        }

        .addons-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .addon-checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 0.82rem;
          color: #1E293B;
          user-select: none;
        }

        .addon-input {
          accent-color: #16281D;
          width: 15px;
          height: 15px;
          cursor: pointer;
        }

        .addon-text {
          flex: 1;
          font-weight: 500;
        }

        .addon-price {
          font-weight: 700;
          color: #0F766E;
          font-size: 0.78rem;
        }

        .collab-escrow-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: #065F46;
          background: #ECFDF5;
          padding: 6px 10px;
          border-radius: 8px;
          margin-bottom: 14px;
          font-weight: 600;
        }

        /* Talent Directory Category Tabs */
        .talent-filter-tabs {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin: 24px 0 32px;
        }

        .talent-tab-btn {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          color: #475569;
          padding: 8px 16px;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .talent-tab-btn:hover {
          border-color: #0F172A;
          color: #0F172A;
        }

        .talent-tab-btn.active {
          background: #0F172A;
          border-color: #0F172A;
          color: #FFFFFF;
        }

        .talent-verified-tag {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(4px);
          color: #FFFFFF;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 9999px;
        }

        .talent-handle {
          font-size: 0.8rem;
          color: #64748B;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .talent-stats-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
          font-size: 0.78rem;
          flex-wrap: wrap;
        }

        .talent-stat-reach {
          color: #0F172A;
          font-weight: 700;
        }

        .talent-stat-dot {
          color: #CBD5E1;
        }

        .talent-stat-eng {
          color: #059669;
          font-weight: 700;
        }

        .talent-stat-price {
          margin-left: auto;
          font-weight: 800;
          color: #FF5A36;
        }

        .talent-card-actions {
          margin-top: 12px;
        }

        .btn-talent-book {
          width: 100%;
          background: #F1F5F9;
          border: 1px solid #E2E8F0;
          color: #0F172A;
          font-size: 0.82rem;
          font-weight: 700;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-talent-book:hover {
          background: #0F172A;
          border-color: #0F172A;
          color: #FFFFFF;
        }

        /* Case Study Video Simulator */
        .case-study-player-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(8px);
          color: #FFFFFF;
          padding: 8px 14px;
          border-radius: 10px;
          margin: 10px 14px 0;
          position: absolute;
          bottom: 14px;
          left: 0;
          right: 0;
          z-index: 10;
        }

        .btn-player-playpause {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #FF5A36;
          border: none;
          color: #FFFFFF;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: opacity 0.15s ease;
        }

        .btn-player-playpause:hover {
          opacity: 0.9;
        }

        .player-timeline {
          flex: 1;
          height: 4px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 9999px;
          overflow: hidden;
        }

        .player-progress {
          height: 100%;
          background: #FF5A36;
          border-radius: 9999px;
          transition: width 0.3s ease;
        }

        .player-timestamp {
          font-size: 0.72rem;
          color: #CBD5E1;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
        }

        .player-quality-tag {
          font-size: 0.68rem;
          background: rgba(255, 255, 255, 0.15);
          padding: 2px 6px;
          border-radius: 4px;
          color: #E2E8F0;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};
