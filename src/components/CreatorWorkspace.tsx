import React, { useState } from 'react';
import type { 
  CreatorProfile, 
  CurrencyCode, 
  ServicePackage, 
  CollaborationRequest, 
  PortfolioItem,
  AuthUser 
} from '../types/creator';
import { CURRENCIES } from '../data/currencies';
import { CreatorlyLogo } from './CreatorlyLogo';
import './CreatorWorkspace.css';
import {
  LayoutDashboard,
  User,
  Film,
  Tag,
  Briefcase,
  MessageSquare,
  Calendar,
  Wallet,
  BarChart3,
  Settings,
  ExternalLink,
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  AlertCircle,
  Copy,
  Plus,
  ArrowRight,
  MapPin,
  Globe2,
  Crown,
  Sprout,
  BookmarkCheck,
  X,
  Menu,
  Send,
  Eye,
  Check,
  DollarSign,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  CheckCircle,
  Users,
  Clock,
  Lightbulb,
  Play,
  Star,
  Compass
} from 'lucide-react';

interface CreatorWorkspaceProps {
  creator: CreatorProfile;
  currentCurrency: CurrencyCode;
  collaborationRequests: CollaborationRequest[];
  onViewPublicProfile: () => void;
  onSelectCreator?: (creator: CreatorProfile) => void;
  onUpdateRequests?: (updated: CollaborationRequest[]) => void;
  onShowToast: (msg: string) => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  onSwitchToMarketplace: () => void;
}

export type WorkspaceTab = 
  | 'home'
  | 'profile'
  | 'portfolio'
  | 'services'
  | 'requests'
  | 'messages'
  | 'calendar'
  | 'earnings'
  | 'performance'
  | 'settings';

export const CreatorWorkspace: React.FC<CreatorWorkspaceProps> = ({
  creator: initialCreator,
  currentCurrency,
  collaborationRequests: initialRequests,
  onViewPublicProfile,
  onShowToast,
  currentUser: _currentUser,
  onLogout,
  onSwitchToMarketplace
}) => {
  // Navigation & UI State
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('home');
  const [overviewSubTab, setOverviewSubTab] = useState<'overview' | 'content' | 'services' | 'reviews' | 'analytics' | 'settings'>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [tiersModalOpen, setTiersModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  // Creator Profile State (Editable)
  const [creator, setCreator] = useState<CreatorProfile>(initialCreator);
  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>(initialRequests);



  // Modals inside sub-views
  const [addPortfolioModalOpen, setAddPortfolioModalOpen] = useState(false);
  const [addServiceModalOpen, setAddServiceModalOpen] = useState(false);
  const [selectedRequestForDetail, setSelectedRequestForDetail] = useState<CollaborationRequest | null>(null);
  const [counterOfferModalOpen, setCounterOfferModalOpen] = useState(false);
  const [counterAmount, setCounterAmount] = useState<number>(12000);
  const [counterNote, setCounterNote] = useState('');
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('Schedule is currently at capacity.');

  // Message thread state
  const [activeConversationId, setActiveConversationId] = useState<string>('c-1');
  const [chatReplyText, setChatReplyText] = useState('');
  const [conversations, setConversations] = useState([
    {
      id: 'c-1',
      brandName: 'SuperAI Labs',
      brandAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      contactPerson: 'Vikram Mehta (Partnerships)',
      campaign: 'YouTube Brand Integration',
      unread: true,
      lastTimestamp: '12m ago',
      messages: [
        { sender: 'brand', text: 'Hey Alex! Loved your recent tutorial on AI code tools. We would love to feature our VS Code extension in your upcoming video.', time: 'Yesterday 4:30 PM' },
        { sender: 'creator', text: 'Hi Vikram! Thanks for reaching out. The developer tools series is performing great. When are you looking to go live?', time: 'Yesterday 5:15 PM' },
        { sender: 'brand', text: 'Ideally the first week of November for our Product Hunt sprint. Can we get the script outline by Friday?', time: 'Today 11:20 AM' },
      ]
    },
    {
      id: 'c-2',
      brandName: 'DevToolbox Cloud',
      brandAvatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120&auto=format&fit=crop&q=80',
      contactPerson: 'Siddharth Roy',
      campaign: 'Dedicated Tech Review',
      unread: false,
      lastTimestamp: '2h ago',
      messages: [
        { sender: 'brand', text: 'Hi Alex, we submitted a formal request for ₹12,000 for a dedicated deep dive. Looking forward to your thoughts!', time: 'Today 9:00 AM' },
        { sender: 'creator', text: 'Received Siddharth! Reviewing the SDK documentation now. Will accept by this evening.', time: 'Today 10:04 AM' }
      ]
    },
    {
      id: 'c-3',
      brandName: 'NextLearn AI',
      brandAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
      contactPerson: 'Neha Mehta',
      campaign: 'Sponsored Reel',
      unread: false,
      lastTimestamp: '1d ago',
      messages: [
        { sender: 'brand', text: 'The campaign metrics report is in — 48,200 views and over 340 qualified signups! Escrow funds have been released. Pleasure working with you!', time: 'Oct 17, 3:00 PM' },
        { sender: 'creator', text: 'Fantastic result Neha! Would love to collaborate again for your Q1 roadmap.', time: 'Oct 17, 4:20 PM' }
      ]
    }
  ]);

  // Currency helper
  const currencyConfig = CURRENCIES[currentCurrency] || CURRENCIES.INR;
  const formatMoney = (inr: number) => {
    const converted = Math.round(inr * currencyConfig.rateAgainstINR);
    return `${currencyConfig.symbol}${converted.toLocaleString(currencyConfig.locale)}`;
  };

  // Dynamic Profile Completion Calculation
  const calculateCompletion = () => {
    let score = 0;
    if (creator.fullName && creator.handle) score += 15;
    if (creator.bio && creator.bio.length > 20) score += 15;
    if (creator.primaryNiche && creator.subNiches.length > 0) score += 15;
    if (creator.socialLinks && creator.socialLinks.length >= 2) score += 20;
    if (creator.packages && creator.packages.length >= 2) score += 15;
    if (creator.portfolio && creator.portfolio.length >= 3) score += 10;
    if (creator.availability?.status) score += 10;
    return Math.min(score, 100);
  };
  const completionPercent = calculateCompletion();

  // Dynamic missing profile items (only populated if items are actually missing)
  const getMissingItems = () => {
    const items: { id: string; label: string; tab: WorkspaceTab }[] = [];
    if (!creator.bio || creator.bio.length <= 20) {
      items.push({ id: 'bio', label: 'Add detailed creator bio (minimum 20 characters)', tab: 'profile' });
    }
    if (!creator.socialLinks || creator.socialLinks.length < 2) {
      items.push({ id: 'socials', label: 'Connect at least 2 social channel accounts', tab: 'profile' });
    }
    if (!creator.packages || creator.packages.length < 2) {
      items.push({ id: 'packages', label: 'Publish at least 2 service collaboration packages', tab: 'services' });
    }
    if (!creator.portfolio || creator.portfolio.length < 3) {
      items.push({ id: 'portfolio', label: `Add verified portfolio deliverables (${creator.portfolio?.length || 0}/3 completed)`, tab: 'portfolio' });
    }
    if (!creator.availability?.status) {
      items.push({ id: 'availability', label: 'Set your collaboration availability status', tab: 'calendar' });
    }
    return items;
  };
  const missingItems = getMissingItems();

  // Requests counter
  const pendingRequestsCount = collaborationRequests.filter(r => r.status === 'new' || r.status === 'in_discussion').length;
  const unreadMessagesCount = conversations.filter(c => c.unread).length;



  // Copy Profile Link
  const handleCopyProfileLink = () => {
    const url = `${window.location.origin}/creators/${creator.username}`;
    navigator.clipboard?.writeText(url);
    onShowToast(`Public profile link copied: ${url}`);
  };

  // Accept Collaboration Request
  const handleAcceptRequest = (requestId: string) => {
    setCollaborationRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'accepted',
          escrowStatus: 'held',
          pipelineStage: 'script_signoff'
        };
      }
      return req;
    }));
    onShowToast('Request accepted! Campaign moved to Escrow & Script Signoff.');
    if (selectedRequestForDetail?.id === requestId) {
      setSelectedRequestForDetail(null);
    }
  };

  // Decline Request
  const handleConfirmDecline = () => {
    if (!selectedRequestForDetail) return;
    setCollaborationRequests(prev => prev.map(req => {
      if (req.id === selectedRequestForDetail.id) {
        return {
          ...req,
          status: 'declined',
          creatorNotes: declineReason
        };
      }
      return req;
    }));
    onShowToast(`Request from ${selectedRequestForDetail.brandName} declined.`);
    setDeclineModalOpen(false);
    setSelectedRequestForDetail(null);
  };

  // Submit Counteroffer
  const handleSubmitCounter = () => {
    if (!selectedRequestForDetail) return;
    setCollaborationRequests(prev => prev.map(req => {
      if (req.id === selectedRequestForDetail.id) {
        return {
          ...req,
          status: 'in_discussion',
          counterOfferINR: counterAmount,
          counterOfferNotes: counterNote
        };
      }
      return req;
    }));
    onShowToast(`Counteroffer of ${formatMoney(counterAmount)} sent to ${selectedRequestForDetail.brandName}.`);
    setCounterOfferModalOpen(false);
    setSelectedRequestForDetail(null);
  };

  // Send message in chat thread
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatReplyText.trim()) return;
    setConversations(prev => prev.map(conv => {
      if (conv.id === activeConversationId) {
        return {
          ...conv,
          unread: false,
          messages: [
            ...conv.messages,
            { sender: 'creator', text: chatReplyText.trim(), time: 'Just now' }
          ]
        };
      }
      return conv;
    }));
    setChatReplyText('');
    onShowToast('Message sent to brand partner.');
  };

  // Save profile edits
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast('Profile changes saved successfully!');
    setActiveTab('home');
  };

  return (
    <div className="creator-workspace-container">
      {/* ───────────────────────────────────────────────────────────────────
          1. Left Sidebar (Restrained Deep Forest Green #16281D)
          ─────────────────────────────────────────────────────────────────── */}
      <aside className={`cw-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="cw-sidebar-header">
          <button 
            type="button" 
            className="cw-logo-area"
            onClick={onViewPublicProfile}
            title="Return to Alex Sharma Storefront Homepage"
          >
            <CreatorlyLogo width={26} height={22} />
            <span className="cw-logo-text">Creatorly</span>
            <span className="cw-logo-badge">Workspace</span>
          </button>
          {mobileMenuOpen && (
            <button 
              type="button"
              className="cw-icon-btn" 
              style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.2)' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* User Summary Pill */}
        <div className="cw-sidebar-user-summary">
          <img 
            src={creator.avatarUrl} 
            alt={creator.fullName} 
            className="cw-sidebar-avatar" 
          />
          <div className="cw-sidebar-user-meta">
            <span className="cw-sidebar-user-name">{creator.fullName}</span>
            <button 
              type="button" 
              className="cw-sidebar-tier-pill"
              onClick={() => setTiersModalOpen(true)}
              title="Click to view Reputation Tier qualifications"
            >
              <Crown size={12} />
              <span>Elite Creator</span>
            </button>
          </div>
        </div>

        {/* Navigation Items (All 10 required items) */}
        <nav className="cw-sidebar-nav">
          <button
            type="button"
            className={`cw-nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
          >
            <div className="cw-nav-item-left">
              <LayoutDashboard size={17} />
              <span>Home</span>
            </div>
          </button>

          <button
            type="button"
            className={`cw-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }}
          >
            <div className="cw-nav-item-left">
              <User size={17} />
              <span>My Profile</span>
            </div>
          </button>

          <button
            type="button"
            className={`cw-nav-item ${activeTab === 'portfolio' ? 'active' : ''}`}
            onClick={() => { setActiveTab('portfolio'); setMobileMenuOpen(false); }}
          >
            <div className="cw-nav-item-left">
              <Film size={17} />
              <span>Content & Portfolio</span>
            </div>
            <span className="cw-nav-item-badge">{creator.portfolio.length}</span>
          </button>

          <button
            type="button"
            className={`cw-nav-item ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => { setActiveTab('services'); setMobileMenuOpen(false); }}
          >
            <div className="cw-nav-item-left">
              <Tag size={17} />
              <span>Services & Pricing</span>
            </div>
            <span className="cw-nav-item-badge">{creator.packages.length}</span>
          </button>

          <button
            type="button"
            className={`cw-nav-item ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => { setActiveTab('requests'); setMobileMenuOpen(false); }}
          >
            <div className="cw-nav-item-left">
              <Briefcase size={17} />
              <span>Collaboration Requests</span>
            </div>
            {pendingRequestsCount > 0 && (
              <span className="cw-nav-item-badge badge-urgent">{pendingRequestsCount}</span>
            )}
          </button>

          <button
            type="button"
            className={`cw-nav-item ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => { setActiveTab('messages'); setMobileMenuOpen(false); }}
          >
            <div className="cw-nav-item-left">
              <MessageSquare size={17} />
              <span>Messages & Chat</span>
            </div>
          </button>

          <button
            type="button"
            className={`cw-nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => { setActiveTab('calendar'); setMobileMenuOpen(false); }}
          >
            <div className="cw-nav-item-left">
              <Calendar size={17} />
              <span>Availability & Calendar</span>
            </div>
          </button>

          <button
            type="button"
            className={`cw-nav-item ${activeTab === 'earnings' ? 'active' : ''}`}
            onClick={() => { setActiveTab('earnings'); setMobileMenuOpen(false); }}
          >
            <div className="cw-nav-item-left">
              <Wallet size={17} />
              <span>Earnings</span>
            </div>
          </button>

          <button
            type="button"
            className={`cw-nav-item ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => { setActiveTab('performance'); setMobileMenuOpen(false); }}
          >
            <div className="cw-nav-item-left">
              <BarChart3 size={17} />
              <span>Performance</span>
            </div>
          </button>

          <button
            type="button"
            className={`cw-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
          >
            <div className="cw-nav-item-left">
              <Settings size={17} />
              <span>Settings</span>
            </div>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="cw-sidebar-footer">
          <button 
            type="button" 
            className="cw-sidebar-public-btn"
            onClick={onViewPublicProfile}
          >
            <span>Preview Public Storefront</span>
            <ExternalLink size={14} />
          </button>
        </div>
      </aside>

      {/* ───────────────────────────────────────────────────────────────────
          2. Main Layout (Top Navigation + Workspace Viewport)
          ─────────────────────────────────────────────────────────────────── */}
      <div className="cw-main-layout">
        {/* Compact Top Navigation Bar */}
        <header className="cw-top-nav">
          <div className="cw-top-left">
            <button 
              type="button" 
              className="cw-mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Toggle navigation menu"
            >
              <Menu size={20} />
            </button>
            <div className="cw-search-box">
              <Search size={15} color="#828E86" />
              <input 
                type="text" 
                placeholder="Search opportunities, brands, briefs..." 
                className="cw-search-input"
              />
            </div>
          </div>

          <div className="cw-top-right">
            {/* Live Availability Status */}
            <div className="cw-availability-pill">
              <span className={`cw-status-dot ${creator.availability.status === 'limited' ? 'dot-limited' : ''}`} />
              <span>Available for Collaborations</span>
            </div>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button 
                type="button" 
                className="cw-icon-btn"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="View notifications"
              >
                <Bell size={17} />
                <span className="cw-unread-dot" />
              </button>

              {notificationsOpen && (
                <div className="cw-dropdown-menu" style={{ width: 320, padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid #E5E8E4' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Notifications</span>
                    <span style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 600 }}>Mark all read</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ fontSize: '0.8rem', padding: '6px 8px', background: '#F8F7F2', borderRadius: 6 }}>
                      <strong>SuperAI Labs</strong> sent a revision inquiry for YouTube Integration.
                      <div style={{ fontSize: '0.7rem', color: '#828E86', marginTop: 2 }}>12m ago</div>
                    </div>
                    <div style={{ fontSize: '0.8rem', padding: '6px 8px', background: '#F8F7F2', borderRadius: 6 }}>
                      <strong>Escrow Payout</strong> of ₹8,500 has been released to your account.
                      <div style={{ fontSize: '0.7rem', color: '#828E86', marginTop: 2 }}>Yesterday</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Help & Guide */}
            <button 
              type="button" 
              className="cw-icon-btn"
              onClick={() => setHelpModalOpen(true)}
              aria-label="Help and documentation"
              title="Creatorly Creator Guide"
            >
              <HelpCircle size={17} />
            </button>

            {/* Quick Switch to Storefront */}
            <button 
              type="button" 
              className="cw-storefront-btn"
              onClick={onViewPublicProfile}
              title="Return to Alex Sharma Storefront"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#16281D',
                background: '#F1F5F9',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span>Storefront Home</span>
              <ExternalLink size={13} />
            </button>

            {/* Profile Avatar + User Dropdown */}
            <div className="cw-user-dropdown-container">
              <button 
                type="button" 
                className="cw-user-trigger-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <img 
                  src={creator.avatarUrl} 
                  alt={creator.fullName} 
                  className="cw-user-trigger-avatar" 
                />
                <span className="cw-user-trigger-name">{creator.fullName}</span>
                <ChevronDown size={14} color="#59655E" />
              </button>

              {userDropdownOpen && (
                <div className="cw-dropdown-menu">
                  <button 
                    type="button" 
                    className="cw-dropdown-item"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onViewPublicProfile();
                    }}
                  >
                    <ExternalLink size={15} />
                    <span>My Public Profile</span>
                  </button>
                  <button 
                    type="button" 
                    className="cw-dropdown-item"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setActiveTab('settings');
                    }}
                  >
                    <Settings size={15} />
                    <span>Account Settings</span>
                  </button>
                  <button 
                    type="button" 
                    className="cw-dropdown-item"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setTiersModalOpen(true);
                    }}
                  >
                    <Crown size={15} color="#C29C5B" />
                    <span>Reputation Tier: Elite</span>
                  </button>
                  <div className="cw-dropdown-divider" />
                  <button 
                    type="button" 
                    className="cw-dropdown-item"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onSwitchToMarketplace();
                    }}
                  >
                    <Globe2 size={15} />
                    <span>Switch to Marketplace</span>
                  </button>
                  <button 
                    type="button" 
                    className="cw-dropdown-item"
                    style={{ color: '#E11D48' }}
                    onClick={() => {
                      setUserDropdownOpen(false);
                      if (onLogout) onLogout();
                    }}
                  >
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ───────────────────────────────────────────────────────────────────
            3. Content Area: Route between Home and Workspace Sub-views
            ─────────────────────────────────────────────────────────────────── */}
        <main className="cw-content-area">
          {/* =================================================================
              HOME TAB (The First Screen after logging in as Creator)
              ================================================================= */}
          {activeTab === 'home' && (
            <div className="cw-home-view">
              {/* Personalized Welcome Banner */}
              <div className="cw-welcome-header">
                <div>
                  <h1 className="cw-welcome-greeting">Good afternoon, {creator.fullName.split(' ')[0]}.</h1>
                  <p className="cw-welcome-subtitle">
                    Your creator profile is taking shape. Complete a few details to help brands discover and book your work.
                  </p>
                </div>
                <div className="cw-welcome-actions">
                  <button 
                    type="button" 
                    className="cw-btn cw-btn-secondary"
                    onClick={handleCopyProfileLink}
                  >
                    <Copy size={14} />
                    <span>Copy Profile Link</span>
                  </button>
                  <button 
                    type="button" 
                    className="cw-btn cw-btn-primary"
                    onClick={onViewPublicProfile}
                  >
                    <span>Preview Public Profile</span>
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>

              {/* Section A: Dynamic Profile Completion Card — only visible when profile is incomplete (< 100%) */}
              {completionPercent < 100 && (
                <div className="cw-completion-card">
                  <div className="cw-completion-top">
                    <div className="cw-completion-title-group">
                      <ShieldCheck size={20} color="#16281D" />
                      <h2 className="cw-completion-title">Profile Setup Status</h2>
                    </div>
                    <span className="cw-completion-score">{completionPercent}% Complete</span>
                  </div>

                  <div className="cw-progress-track">
                    <div 
                      className="cw-progress-fill" 
                      style={{ width: `${completionPercent}%` }} 
                    />
                  </div>

                  {missingItems.length > 0 && (
                    <div className="cw-missing-items-list">
                      {missingItems.map(item => (
                        <div key={item.id} className="cw-missing-item">
                          <AlertCircle size={14} color="#C29C5B" />
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="cw-completion-footer">
                    <span style={{ fontSize: '0.82rem', color: '#59655E' }}>
                      Tip: Complete verified pricing and exclusivity to unlock higher discovery rank with enterprise brands.
                    </span>
                    <button 
                      type="button" 
                      className="cw-btn cw-btn-primary cw-btn-sm"
                      onClick={() => setActiveTab('profile')}
                    >
                      <span>Continue Profile Setup</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* 2-Column Section: Collaboration Requests (Left) + Public Creator Card Preview (Right) */}
              <div className="cw-home-columns">
                {/* Left Column: Collaboration Opportunities + Messages */}
                <div className="cw-home-left-col">
                  {/* Section C: Collaboration Opportunities */}
                  <div className="cw-opportunities-section">
                    <div className="cw-section-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <h2 className="cw-section-title">Collaboration Opportunities</h2>
                        <span className="cw-section-badge">{collaborationRequests.length} Active</span>
                      </div>
                      <button 
                        type="button" 
                        className="cw-btn cw-btn-secondary cw-btn-sm"
                        onClick={() => setActiveTab('requests')}
                      >
                        View All Deals
                      </button>
                    </div>

                    <div className="cw-requests-list">
                      {collaborationRequests.slice(0, 3).map(request => (
                        <div key={request.id} className="cw-request-card">
                          <div className="cw-request-top">
                            <div className="cw-brand-info">
                              <div className="cw-brand-logo">
                                {request.brandName.charAt(0)}
                              </div>
                              <div className="cw-brand-text">
                                <span className="cw-brand-name">{request.brandName}</span>
                                <span className="cw-request-campaign">{request.serviceTitle}</span>
                              </div>
                            </div>
                            <span className={`cw-request-status-badge ${
                              request.status === 'new' ? 'cw-status-new' :
                              request.status === 'in_discussion' ? 'cw-status-negotiating' : 'cw-status-accepted'
                            }`}>
                              {request.status.replace('_', ' ')}
                            </span>
                          </div>

                          <div className="cw-request-details-grid">
                            <div className="cw-req-detail-item">
                              <span className="cw-req-label">Proposed Budget</span>
                              <span className="cw-req-val">{formatMoney(request.budgetINR)}</span>
                            </div>
                            <div className="cw-req-detail-item">
                              <span className="cw-req-label">Target Delivery</span>
                              <span className="cw-req-val">{request.proposedDeadline}</span>
                            </div>
                            <div className="cw-req-detail-item">
                              <span className="cw-req-label">Received</span>
                              <span className="cw-req-val">{request.submittedAt}</span>
                            </div>
                            <div className="cw-req-detail-item">
                              <span className="cw-req-label">Escrow</span>
                              <span className="cw-req-val" style={{ color: '#166534' }}>
                                {request.escrowStatus === 'held' ? 'Held in Escrow' : 'Pending Signoff'}
                              </span>
                            </div>
                          </div>

                          <p className="cw-request-brief">{request.campaignBrief}</p>

                          <div className="cw-request-actions">
                            <button 
                              type="button" 
                              className="cw-btn cw-btn-counter cw-btn-sm"
                              onClick={() => {
                                setSelectedRequestForDetail(request);
                                setCounterAmount(request.budgetINR + 2000);
                                setCounterOfferModalOpen(true);
                              }}
                            >
                              Counteroffer
                            </button>
                            <button 
                              type="button" 
                              className="cw-btn cw-btn-decline cw-btn-sm"
                              onClick={() => {
                                setSelectedRequestForDetail(request);
                                setDeclineModalOpen(true);
                              }}
                            >
                              Decline
                            </button>
                            <button 
                              type="button" 
                              className="cw-btn cw-btn-accept cw-btn-sm"
                              onClick={() => handleAcceptRequest(request.id)}
                            >
                              <Check size={14} />
                              <span>Accept Request</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section D: Recent Messages */}
                  <div className="cw-card" style={{ marginBottom: 28 }}>
                    <div className="cw-section-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <h2 className="cw-section-title">Recent Brand Messages</h2>
                        {unreadMessagesCount > 0 && (
                          <span className="cw-section-badge">{unreadMessagesCount} Unread</span>
                        )}
                      </div>
                      <button 
                        type="button" 
                        className="cw-btn cw-btn-secondary cw-btn-sm"
                        onClick={() => setActiveTab('messages')}
                      >
                        Open Inbox
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {conversations.map(conv => {
                        const lastMsg = conv.messages[conv.messages.length - 1];
                        return (
                          <div 
                            key={conv.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '12px 14px',
                              borderRadius: 10,
                              background: '#FAF9F5',
                              border: '1px solid #E5E8E4',
                              cursor: 'pointer'
                            }}
                            onClick={() => {
                              setActiveConversationId(conv.id);
                              setActiveTab('messages');
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <img 
                                src={conv.brandAvatar} 
                                alt={conv.brandName} 
                                style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} 
                              />
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#19201C' }}>
                                    {conv.brandName}
                                  </span>
                                  {conv.unread && (
                                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#E11D48' }} />
                                  )}
                                </div>
                                <span style={{ fontSize: '0.8rem', color: '#59655E', display: 'block', maxWidth: 380, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {lastMsg.text}
                                </span>
                              </div>
                            </div>
                            <span style={{ fontSize: '0.72rem', color: '#828E86' }}>{conv.lastTimestamp}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Column: Section B - Public Creator Card Preview */}
                {/* Right Column: Section B - Public Creator Card Preview (Dashing & Smart First Impression) */}
                <div className="cw-home-right-col">
                  <div className="cw-creator-card-preview">
                    {/* Sleek Ambient Cover Banner */}
                    <div className="cw-card-banner">
                      <div className="cw-banner-badge-live">
                        <span className="cw-banner-pulse" />
                        <span>Live Storefront Preview</span>
                      </div>
                      <div className="cw-banner-badge-status">
                        <span className="cw-banner-status-dot" />
                        <span>3 Collab Slots Open</span>
                      </div>
                    </div>

                    <div className="cw-card-body">
                      {/* Avatar & Top Badges Row */}
                      <div className="cw-avatar-row">
                        <div className="cw-avatar-wrapper">
                          <img 
                            src={creator.avatarUrl} 
                            alt={creator.fullName} 
                            className="cw-creator-card-avatar" 
                          />
                          <div className="cw-avatar-verified-badge" title="Identity & Platform API Verified">
                            <ShieldCheck size={13} color="#FFFFFF" />
                          </div>
                        </div>

                        <div className="cw-avatar-badges-col">
                          <div 
                            className="cw-creator-tier-badge tier-elite"
                            onClick={() => setTiersModalOpen(true)}
                            title="Click to view Reputation Tiers"
                          >
                            <Crown size={12} color="#C29C5B" />
                            <span>Elite Creator · Top 1%</span>
                          </div>
                          <div className="cw-card-price-chip">
                            <span className="cw-price-chip-lbl">Starts at</span>
                            <span className="cw-price-chip-val">{formatMoney(8500)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Name & Handle */}
                      <div className="cw-creator-identity-block">
                        <div className="cw-creator-name-line">
                          <h3 className="cw-creator-card-name">{creator.fullName}</h3>
                          <span className="cw-verified-chip" title="Verified Creator">
                            <CheckCircle size={12} />
                            <span>Verified</span>
                          </span>
                        </div>
                        <span className="cw-creator-card-handle">{creator.handle}</span>
                      </div>

                      {/* Bio / Value Proposition */}
                      <p className="cw-creator-card-bio">
                        "{creator.bio}"
                      </p>

                      {/* Niche Pills (Rich filled dark colors) */}
                      <div className="cw-creator-card-niches">
                        <span className="cw-niche-tag primary">
                          <Sparkles size={11} color="#C29C5B" />
                          <span>{creator.primaryNiche}</span>
                        </span>
                        {creator.subNiches.slice(0, 3).map((niche, idx) => (
                          <span key={idx} className="cw-niche-tag">{niche}</span>
                        ))}
                      </div>

                      {/* Location & Language Strip */}
                      <div className="cw-creator-card-meta">
                        <div className="cw-meta-pill">
                          <MapPin size={12} />
                          <span>{creator.location.city}, {creator.location.country} {creator.location.flagEmoji}</span>
                        </div>
                        <div className="cw-meta-pill">
                          <Globe2 size={12} />
                          <span>{creator.languages.join(', ')}</span>
                        </div>
                      </div>

                      {/* Bento Stat Matrix 1: Trust & Performance */}
                      <div className="cw-creator-card-stats">
                        <div className="cw-stat-card">
                          <div className="cw-stat-val">4.9 ★</div>
                          <div className="cw-stat-lbl">18 Reviews</div>
                          <span className="cw-stat-sub">100% 5-Star</span>
                        </div>
                        <div className="cw-stat-card">
                          <div className="cw-stat-val">24</div>
                          <div className="cw-stat-lbl">Collabs Done</div>
                          <span className="cw-stat-sub">100% On-Time</span>
                        </div>
                        <div className="cw-stat-card">
                          <div className="cw-stat-val">4.8%</div>
                          <div className="cw-stat-lbl">Engagement</div>
                          <span className="cw-stat-sub" style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                            <TrendingUp size={10} />
                            <span>3.2x Top Avg</span>
                          </span>
                        </div>
                      </div>

                      {/* Bento Stat Matrix 2: Verified Platform Reach */}
                      <div className="cw-social-reach-box">
                        <div className="cw-reach-header">
                          <span className="cw-reach-title">Audited Social Reach</span>
                          <span className="cw-reach-total">85K+ Audience</span>
                        </div>
                        <div className="cw-creator-card-socials">
                          <div className="cw-social-item">
                            <span className="cw-social-num">52K</span>
                            <span className="cw-social-type">YouTube</span>
                          </div>
                          <div className="cw-social-divider" />
                          <div className="cw-social-item">
                            <span className="cw-social-num">28K</span>
                            <span className="cw-social-type">Instagram</span>
                          </div>
                          <div className="cw-social-divider" />
                          <div className="cw-social-item">
                            <span className="cw-social-num">5K</span>
                            <span className="cw-social-type">LinkedIn</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="cw-creator-card-actions">
                        <button 
                          type="button" 
                          className="cw-btn cw-btn-primary cw-btn-storefront-hero"
                          onClick={onViewPublicProfile}
                        >
                          <span>Preview Full Storefront</span>
                          <ExternalLink size={15} />
                        </button>
                        <button 
                          type="button" 
                          className="cw-btn cw-btn-secondary"
                          onClick={() => setActiveTab('profile')}
                        >
                          Edit Profile Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section E: Quick Actions Bar */}
              <div className="cw-quick-actions-section">
                <h2 className="cw-section-title" style={{ marginBottom: 16 }}>Quick Actions</h2>
                <div className="cw-quick-actions-grid">
                  <div 
                    className="cw-quick-action-card"
                    onClick={() => setActiveTab('profile')}
                  >
                    <div className="cw-quick-action-icon">
                      <User size={18} />
                    </div>
                    <h3 className="cw-quick-action-title">Edit Profile</h3>
                    <p className="cw-quick-action-desc">Update bio, primary niche, and social links.</p>
                  </div>

                  <div 
                    className="cw-quick-action-card"
                    onClick={() => {
                      setActiveTab('portfolio');
                      setAddPortfolioModalOpen(true);
                    }}
                  >
                    <div className="cw-quick-action-icon">
                      <Plus size={18} />
                    </div>
                    <h3 className="cw-quick-action-title">Add Portfolio Item</h3>
                    <p className="cw-quick-action-desc">Upload or link your best brand collaboration video.</p>
                  </div>

                  <div 
                    className="cw-quick-action-card"
                    onClick={() => {
                      setActiveTab('services');
                      setAddServiceModalOpen(true);
                    }}
                  >
                    <div className="cw-quick-action-icon">
                      <Tag size={18} />
                    </div>
                    <h3 className="cw-quick-action-title">Add a Service</h3>
                    <p className="cw-quick-action-desc">Define a new deliverable package with set pricing.</p>
                  </div>

                  <div 
                    className="cw-quick-action-card"
                    onClick={() => setActiveTab('services')}
                  >
                    <div className="cw-quick-action-icon">
                      <DollarSign size={18} />
                    </div>
                    <h3 className="cw-quick-action-title">Update Pricing</h3>
                    <p className="cw-quick-action-desc">Adjust delivery fees, rush rates, and usage rights.</p>
                  </div>

                  <div 
                    className="cw-quick-action-card"
                    onClick={() => setActiveTab('calendar')}
                  >
                    <div className="cw-quick-action-icon">
                      <Calendar size={18} />
                    </div>
                    <h3 className="cw-quick-action-title">Manage Availability</h3>
                    <p className="cw-quick-action-desc">Toggle slots, busy periods, and expected turnaround.</p>
                  </div>

                  <div 
                    className="cw-quick-action-card"
                    onClick={onViewPublicProfile}
                  >
                    <div className="cw-quick-action-icon">
                      <Eye size={18} />
                    </div>
                    <h3 className="cw-quick-action-title">View Public Profile</h3>
                    <p className="cw-quick-action-desc">See your live public storefront exactly as brands do.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              MY PROFILE TAB (Dedicated Profile Editor)
              ================================================================= */}
          {activeTab === 'profile' && (
            <div className="cw-subview">
              <div className="cw-section-header">
                <div>
                  <h1 className="cw-welcome-greeting" style={{ fontSize: '1.5rem' }}>Edit Creator Profile</h1>
                  <p className="cw-welcome-subtitle">
                    Keep your public identity, bio, niches, and connected social media profiles up to date.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button 
                    type="button" 
                    className="cw-btn cw-btn-secondary"
                    onClick={() => setActiveTab('home')}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="cw-btn cw-btn-primary"
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, marginTop: 20 }}>
                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                  {/* Personal & Public Identity */}
                  <div className="cw-card">
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 14 }}>Basic Identity</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#59655E', display: 'block', marginBottom: 6 }}>Full Name</label>
                        <input 
                          type="text" 
                          value={creator.fullName} 
                          onChange={(e) => setCreator({ ...creator, fullName: e.target.value })}
                          className="cw-search-box" 
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#59655E', display: 'block', marginBottom: 6 }}>Public Handle</label>
                        <input 
                          type="text" 
                          value={creator.handle} 
                          onChange={(e) => setCreator({ ...creator, handle: e.target.value })}
                          className="cw-search-box" 
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    <div style={{ marginTop: 14 }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#59655E', display: 'block', marginBottom: 6 }}>Short Bio</label>
                      <textarea 
                        rows={3} 
                        value={creator.bio}
                        onChange={(e) => setCreator({ ...creator, bio: e.target.value })}
                        className="cw-search-box" 
                        style={{ width: '100%', resize: 'vertical' }}
                      />
                    </div>
                  </div>

                  {/* Niches & Specialization */}
                  <div className="cw-card">
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 14 }}>Niches & Specialization</h3>
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#59655E', display: 'block', marginBottom: 6 }}>Primary Niche</label>
                      <input 
                        type="text" 
                        value={creator.primaryNiche} 
                        onChange={(e) => setCreator({ ...creator, primaryNiche: e.target.value })}
                        className="cw-search-box" 
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#59655E', display: 'block', marginBottom: 6 }}>Sub-Niches (Comma separated)</label>
                      <input 
                        type="text" 
                        value={creator.subNiches.join(', ')} 
                        onChange={(e) => setCreator({ ...creator, subNiches: e.target.value.split(',').map(s => s.trim()) })}
                        className="cw-search-box" 
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  {/* Location & Languages */}
                  <div className="cw-card">
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 14 }}>Location & Languages</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#59655E', display: 'block', marginBottom: 6 }}>City</label>
                        <input 
                          type="text" 
                          value={creator.location.city} 
                          onChange={(e) => setCreator({ ...creator, location: { ...creator.location, city: e.target.value } })}
                          className="cw-search-box" 
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#59655E', display: 'block', marginBottom: 6 }}>Country</label>
                        <input 
                          type="text" 
                          value={creator.location.country} 
                          onChange={(e) => setCreator({ ...creator, location: { ...creator.location, country: e.target.value } })}
                          className="cw-search-box" 
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#59655E', display: 'block', marginBottom: 6 }}>Languages</label>
                        <input 
                          type="text" 
                          value={creator.languages.join(', ')} 
                          onChange={(e) => setCreator({ ...creator, languages: e.target.value.split(',').map(s => s.trim()) })}
                          className="cw-search-box" 
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  </div>
                </form>

                {/* Right Column: Verification & Public Visibility */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div className="cw-card">
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Verification Status</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: '#16281D', border: '1px solid #16281D', borderRadius: 10, marginBottom: 12 }}>
                      <ShieldCheck size={20} color="#86EFAC" />
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#FFFFFF' }}>Identity & API Verified</div>
                        <div style={{ fontSize: '0.74rem', color: '#D1DDD6' }}>Government ID & Meta/Google API sync</div>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.76rem', color: '#59655E', lineHeight: 1.4 }}>
                      Verified badge signals 100% authenticity to brand media buyers and unlocks direct escrow bookings.
                    </p>
                  </div>

                  <div className="cw-card">
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Reputation Status</h3>
                    <div 
                      className="cw-tier-card tier-card-dark" 
                      style={{ padding: 16, cursor: 'pointer' }}
                      onClick={() => setTiersModalOpen(true)}
                    >
                      <div className="cw-tier-card-header">
                        <span className="cw-tier-name" style={{ fontSize: '0.98rem' }}>Elite Creator</span>
                        <Crown size={16} color="#C29C5B" />
                      </div>
                      <p className="cw-tier-desc" style={{ fontSize: '0.78rem', marginBottom: 10 }}>
                        Meets high standards for verified collaborations, client reviews, and reliable delivery.
                      </p>
                      <span style={{ fontSize: '0.72rem', color: '#C29C5B', fontWeight: 600 }}>
                        View tier details & criteria →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              CONTENT & PORTFOLIO TAB
              ================================================================= */}
          {activeTab === 'portfolio' && (
            <div className="cw-subview">
              <div className="cw-section-header">
                <div>
                  <h1 className="cw-welcome-greeting" style={{ fontSize: '1.5rem' }}>Content & Portfolio</h1>
                  <p className="cw-welcome-subtitle">
                    Showcase past brand integrations, UGC campaigns, and high-performing sponsored content.
                  </p>
                </div>
                <button 
                  type="button" 
                  className="cw-btn cw-btn-primary"
                  onClick={() => setAddPortfolioModalOpen(true)}
                >
                  <Plus size={15} />
                  <span>Add Portfolio Item</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20, marginTop: 24 }}>
                {creator.portfolio.map(item => (
                  <div key={item.id} className="cw-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: 180, position: 'relative', background: '#0F1D15' }}>
                      <img 
                        src={item.thumbnailUrl} 
                        alt={item.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                      <span style={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        background: 'rgba(22, 40, 29, 0.85)',
                        color: '#FFFFFF',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: 4
                      }}>
                        {item.format}
                      </span>
                    </div>

                    <div style={{ padding: 18, display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <span style={{ fontSize: '0.76rem', color: '#166534', fontWeight: 600 }}>
                          Client: {item.brandClient}
                        </span>
                        <span style={{ fontSize: '0.74rem', color: '#828E86' }}>{item.publishedDate}</span>
                      </div>

                      <h3 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#19201C', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                        {item.title}
                      </h3>

                      <p style={{ fontSize: '0.8rem', color: '#59655E', margin: '0 0 14px 0', lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.deliverableSummary}
                      </p>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        background: '#FAF9F5',
                        borderRadius: 6,
                        border: '1px solid #E5E8E4',
                        marginBottom: 14,
                        fontSize: '0.8rem'
                      }}>
                        <span><strong>{item.views.toLocaleString()}</strong> views</span>
                        <span><strong>{item.engagement}%</strong> engagement</span>
                        <span style={{ color: '#166534', fontWeight: 600 }}>Audited</span>
                      </div>

                      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <a 
                          href={item.originalUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          style={{ fontSize: '0.8rem', color: '#16281D', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          <span>View Original</span>
                          <ExternalLink size={12} />
                        </a>
                        <button 
                          type="button" 
                          className="cw-btn cw-btn-secondary cw-btn-sm"
                          onClick={() => {
                            setCreator({
                              ...creator,
                              portfolio: creator.portfolio.filter(p => p.id !== item.id)
                            });
                            onShowToast(`Removed portfolio item: "${item.title}"`);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              SERVICES & PRICING TAB
              ================================================================= */}
          {activeTab === 'services' && (
            <div className="cw-subview">
              <div className="cw-section-header">
                <div>
                  <h1 className="cw-welcome-greeting" style={{ fontSize: '1.5rem' }}>Services & Pricing</h1>
                  <p className="cw-welcome-subtitle">
                    Manage fixed packages, standard deliverables, rush fees, and commercial advertising licenses.
                  </p>
                </div>
                <button 
                  type="button" 
                  className="cw-btn cw-btn-primary"
                  onClick={() => setAddServiceModalOpen(true)}
                >
                  <Plus size={15} />
                  <span>Create New Service</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20, marginTop: 24 }}>
                {creator.packages.map(pkg => (
                  <div key={pkg.id} className="cw-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#828E86', fontWeight: 600 }}>
                          {pkg.platform}
                        </span>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '2px 0 0 0', color: '#19201C' }}>
                          {pkg.title}
                        </h3>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#16281D' }}>
                          {formatMoney(pkg.priceInINR)}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#828E86' }}>Fixed package</span>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.84rem', color: '#59655E', lineHeight: 1.4, margin: '0 0 16px 0' }}>
                      {pkg.tagline}
                    </p>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 10,
                      background: '#FAF9F5',
                      padding: 10,
                      borderRadius: 8,
                      border: '1px solid #E5E8E4',
                      fontSize: '0.78rem',
                      marginBottom: 16
                    }}>
                      <div>
                        <span style={{ color: '#828E86' }}>Turnaround: </span>
                        <strong>{pkg.deliveryDays} business days</strong>
                      </div>
                      <div>
                        <span style={{ color: '#828E86' }}>Revisions: </span>
                        <strong>{pkg.includedRevisions} round included</strong>
                      </div>
                      <div>
                        <span style={{ color: '#828E86' }}>Publishing: </span>
                        <strong>{pkg.publishingIncluded ? 'Included on channel' : 'Brand channels only'}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#828E86' }}>Organic Rights: </span>
                        <strong>{pkg.organicUsageDays} days</strong>
                      </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 600, textTransform: 'uppercase', color: '#828E86', display: 'block', marginBottom: 8 }}>
                        Deliverables Included:
                      </span>
                      <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.82rem', color: '#19201C', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {pkg.deliverables.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 14, borderTop: '1px solid #E5E8E4' }}>
                      <button 
                        type="button" 
                        className="cw-btn cw-btn-secondary cw-btn-sm"
                        onClick={() => onShowToast(`Duplicated package "${pkg.title}"`)}
                      >
                        Duplicate
                      </button>
                      <button 
                        type="button" 
                        className="cw-btn cw-btn-secondary cw-btn-sm"
                        onClick={() => onShowToast(`Editing "${pkg.title}"`)}
                      >
                        Edit Service
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              COLLABORATION REQUESTS TAB
              ================================================================= */}
          {activeTab === 'requests' && (
            <div className="cw-subview">
              <div className="cw-section-header">
                <div>
                  <h1 className="cw-welcome-greeting" style={{ fontSize: '1.5rem' }}>Collaboration Request Center</h1>
                  <p className="cw-welcome-subtitle">
                    Manage incoming brand proposals, counteroffers, milestones, and active escrow bookings.
                  </p>
                </div>
              </div>

              <div className="cw-requests-list" style={{ marginTop: 20 }}>
                {collaborationRequests.map(req => (
                  <div key={req.id} className="cw-request-card">
                    <div className="cw-request-top">
                      <div className="cw-brand-info">
                        <div className="cw-brand-logo">
                          {req.brandName.charAt(0)}
                        </div>
                        <div className="cw-brand-text">
                          <span className="cw-brand-name">{req.brandName}</span>
                          <span className="cw-request-campaign">{req.serviceTitle} • Contact: {req.brandContactPerson} ({req.brandEmail})</span>
                        </div>
                      </div>
                      <span className={`cw-request-status-badge ${
                        req.status === 'new' ? 'cw-status-new' :
                        req.status === 'in_discussion' ? 'cw-status-negotiating' : 'cw-status-accepted'
                      }`}>
                        {req.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="cw-request-details-grid">
                      <div className="cw-req-detail-item">
                        <span className="cw-req-label">Budget</span>
                        <span className="cw-req-val">{formatMoney(req.budgetINR)}</span>
                      </div>
                      <div className="cw-req-detail-item">
                        <span className="cw-req-label">Target Delivery</span>
                        <span className="cw-req-val">{req.proposedDeadline}</span>
                      </div>
                      <div className="cw-req-detail-item">
                        <span className="cw-req-label">Submitted</span>
                        <span className="cw-req-val">{req.submittedAt}</span>
                      </div>
                      <div className="cw-req-detail-item">
                        <span className="cw-req-label">Pipeline Stage</span>
                        <span className="cw-req-val" style={{ textTransform: 'capitalize' }}>
                          {req.pipelineStage?.replace('_', ' ') || 'Proposal Review'}
                        </span>
                      </div>
                    </div>

                    <div style={{ marginBottom: 14 }}>
                      <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#828E86', fontWeight: 600 }}>Campaign Brief:</span>
                      <p style={{ fontSize: '0.85rem', color: '#19201C', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                        {req.campaignBrief}
                      </p>
                    </div>

                    <div className="cw-request-actions">
                      <button 
                        type="button" 
                        className="cw-btn cw-btn-counter cw-btn-sm"
                        onClick={() => {
                          setSelectedRequestForDetail(req);
                          setCounterAmount(req.budgetINR + 2000);
                          setCounterOfferModalOpen(true);
                        }}
                      >
                        Counteroffer
                      </button>
                      <button 
                        type="button" 
                        className="cw-btn cw-btn-decline cw-btn-sm"
                        onClick={() => {
                          setSelectedRequestForDetail(req);
                          setDeclineModalOpen(true);
                        }}
                      >
                        Decline
                      </button>
                      <button 
                        type="button" 
                        className="cw-btn cw-btn-accept cw-btn-sm"
                        onClick={() => handleAcceptRequest(req.id)}
                      >
                        <Check size={14} />
                        <span>Accept Request</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              MESSAGES TAB
              ================================================================= */}
          {activeTab === 'messages' && (
            <div className="cw-subview">
              <div className="cw-section-header">
                <div>
                  <h1 className="cw-welcome-greeting" style={{ fontSize: '1.5rem' }}>Brand Direct Messages</h1>
                  <p className="cw-welcome-subtitle">
                    Coordinate campaign briefs, script signoffs, and draft reviews in real time.
                  </p>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '320px 1fr',
                gap: 20,
                marginTop: 20,
                background: '#FFFFFF',
                borderRadius: 14,
                border: '1px solid #E5E8E4',
                overflow: 'hidden',
                height: 'calc(100vh - 240px)',
                minHeight: 520
              }}>
                {/* Conversations list */}
                <div style={{ borderRight: '1px solid #E5E8E4', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #E5E8E4' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Active Conversations</span>
                  </div>
                  <div style={{ flex: 1, overflowY: 'auto' }}>
                    {conversations.map(conv => (
                      <div 
                        key={conv.id}
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid #E5E8E4',
                          cursor: 'pointer',
                          background: activeConversationId === conv.id ? '#FAF9F5' : '#FFFFFF',
                          borderLeft: activeConversationId === conv.id ? '3px solid #16281D' : '3px solid transparent'
                        }}
                        onClick={() => setActiveConversationId(conv.id)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <img 
                            src={conv.brandAvatar} 
                            alt={conv.brandName} 
                            style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} 
                          />
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#19201C' }}>{conv.brandName}</span>
                        </div>
                        <span style={{ fontSize: '0.74rem', color: '#828E86' }}>{conv.campaign}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat window */}
                {(() => {
                  const currentConv = conversations.find(c => c.id === activeConversationId) || conversations[0];
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <div style={{ padding: '14px 20px', borderBottom: '1px solid #E5E8E4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#19201C' }}>{currentConv.brandName}</div>
                          <span style={{ fontSize: '0.75rem', color: '#59655E' }}>{currentConv.contactPerson} • {currentConv.campaign}</span>
                        </div>
                        <span style={{ fontSize: '0.74rem', background: '#16281D', color: '#86EFAC', border: '1px solid #16281D', padding: '4px 10px', borderRadius: 999, fontWeight: 700 }}>
                          Escrow Protected
                        </span>
                      </div>

                      <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {currentConv.messages.map((msg, i) => (
                          <div 
                            key={i} 
                            style={{
                              alignSelf: msg.sender === 'creator' ? 'flex-end' : 'flex-start',
                              maxWidth: '75%',
                              background: msg.sender === 'creator' ? '#16281D' : '#FAF9F5',
                              color: msg.sender === 'creator' ? '#FFFFFF' : '#19201C',
                              padding: '10px 14px',
                              borderRadius: 12,
                              border: msg.sender === 'creator' ? 'none' : '1px solid #E5E8E4'
                            }}
                          >
                            <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.45 }}>{msg.text}</p>
                            <span style={{
                              fontSize: '0.68rem',
                              color: msg.sender === 'creator' ? '#C3CEC7' : '#828E86',
                              display: 'block',
                              marginTop: 4,
                              textAlign: 'right'
                            }}>
                              {msg.time}
                            </span>
                          </div>
                        ))}
                      </div>

                      <form 
                        onSubmit={handleSendMessage}
                        style={{ padding: '14px 20px', borderTop: '1px solid #E5E8E4', display: 'flex', gap: 10 }}
                      >
                        <input 
                          type="text" 
                          placeholder="Type your reply to brand partner..." 
                          value={chatReplyText}
                          onChange={(e) => setChatReplyText(e.target.value)}
                          className="cw-search-box"
                          style={{ flex: 1 }}
                        />
                        <button type="submit" className="cw-btn cw-btn-primary">
                          <Send size={15} />
                          <span>Send</span>
                        </button>
                      </form>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* =================================================================
              AVAILABILITY & CALENDAR TAB
              ================================================================= */}
          {activeTab === 'calendar' && (
            <div className="cw-subview">
              <div className="cw-section-header">
                <div>
                  <h1 className="cw-welcome-greeting" style={{ fontSize: '1.5rem' }}>Availability & Schedule</h1>
                  <p className="cw-welcome-subtitle">
                    Control booking slots, response time commitments, and upcoming campaign delivery deadlines.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, marginTop: 20 }}>
                <div className="cw-card">
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 14 }}>Campaign Delivery Calendar (October – November 2026)</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ padding: '14px 16px', borderRadius: 10, background: '#FFFFFF', border: '1.5px solid #16281D', boxShadow: '0 1px 3px rgba(22, 40, 29, 0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <strong style={{ fontSize: '0.88rem', color: '#16281D' }}>SuperAI Labs — YouTube Integration</strong>
                        <span style={{ fontSize: '0.78rem', color: '#16281D', fontWeight: 700 }}>Due Nov 05, 2026</span>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#59655E', fontWeight: 500 }}>Status: Script Outline drafting</span>
                    </div>

                    <div style={{ padding: '14px 16px', borderRadius: 10, background: '#FFFFFF', border: '1px solid #D0D6CF', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <strong style={{ fontSize: '0.88rem', color: '#19201C' }}>DevToolbox Cloud — Dedicated Review</strong>
                        <span style={{ fontSize: '0.78rem', color: '#59655E', fontWeight: 600 }}>Due Nov 14, 2026</span>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#828E86' }}>Status: Proposal accepted</span>
                    </div>

                    <div style={{ padding: '14px 16px', borderRadius: 10, background: '#FFFFFF', border: '1.5px solid #166534', boxShadow: '0 1px 3px rgba(22, 101, 52, 0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <strong style={{ fontSize: '0.88rem', color: '#166534' }}>NextLearn AI — Reel Integration</strong>
                        <span style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 700 }}>Completed Oct 16, 2026</span>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 500 }}>Status: Escrow released (₹8,500)</span>
                    </div>
                  </div>
                </div>

                <div className="cw-card">
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 14 }}>Availability Settings</h3>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#59655E', display: 'block', marginBottom: 6 }}>Status</label>
                    <select 
                      value={creator.availability.status}
                      onChange={(e) => setCreator({
                        ...creator,
                        availability: { ...creator.availability, status: e.target.value as any }
                      })}
                      className="cw-search-box"
                      style={{ width: '100%' }}
                    >
                      <option value="available">Available for new projects</option>
                      <option value="limited">Limited slots remaining</option>
                      <option value="unavailable">Currently unavailable</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#59655E', display: 'block', marginBottom: 6 }}>Expected Response Time</label>
                    <input 
                      type="text" 
                      value={creator.availability.responseTime}
                      onChange={(e) => setCreator({
                        ...creator,
                        availability: { ...creator.availability, responseTime: e.target.value }
                      })}
                      className="cw-search-box"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <button 
                    type="button" 
                    className="cw-btn cw-btn-primary" 
                    style={{ width: '100%', marginTop: 8 }}
                    onClick={() => onShowToast('Availability settings updated!')}
                  >
                    Save Availability
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              EARNINGS TAB
              ================================================================= */}
          {activeTab === 'earnings' && (
            <div className="cw-subview">
              <div className="cw-section-header">
                <div>
                  <h1 className="cw-welcome-greeting" style={{ fontSize: '1.5rem' }}>Earnings & Invoices</h1>
                  <p className="cw-welcome-subtitle">
                    Track completed campaigns, held escrow balances, and automated invoice records.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 20, marginBottom: 24 }}>
                <div className="cw-card">
                  <span style={{ fontSize: '0.78rem', color: '#828E86', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Lifetime Earned</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16281D', marginTop: 4 }}>
                    {formatMoney(142000)}
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#166534', marginTop: 4, display: 'block' }}>24 completed collaborations</span>
                </div>

                <div className="cw-card">
                  <span style={{ fontSize: '0.78rem', color: '#828E86', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Held in Creatorly Escrow</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#166534', marginTop: 4 }}>
                    {formatMoney(14500)}
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#59655E', marginTop: 4, display: 'block' }}>Releases upon brand signoff</span>
                </div>

                <div className="cw-card">
                  <span style={{ fontSize: '0.78rem', color: '#828E86', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Pending Proposals</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#C29C5B', marginTop: 4 }}>
                    {formatMoney(12000)}
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#59655E', marginTop: 4, display: 'block' }}>1 brand awaiting acceptance</span>
                </div>
              </div>

              <div className="cw-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 14 }}>Transaction & Invoice History</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#FAF9F5', borderRadius: 8, border: '1px solid #E5E8E4' }}>
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: '#19201C' }}>NextLearn AI (Sponsored Reel)</strong>
                      <span style={{ fontSize: '0.75rem', color: '#828E86', display: 'block' }}>Paid on Oct 17, 2026 • Ref: INV-2026-904</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#166534' }}>+{formatMoney(8500)}</span>
                      <button 
                        type="button" 
                        className="cw-btn cw-btn-secondary cw-btn-sm" 
                        style={{ marginLeft: 12 }}
                        onClick={() => onShowToast('Downloaded PDF Invoice for NextLearn AI')}
                      >
                        PDF
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#FAF9F5', borderRadius: 8, border: '1px solid #E5E8E4' }}>
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: '#19201C' }}>MinimalGear (UGC Ad Creative)</strong>
                      <span style={{ fontSize: '0.75rem', color: '#828E86', display: 'block' }}>Paid on Oct 04, 2026 • Ref: INV-2026-881</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#166534' }}>+{formatMoney(6000)}</span>
                      <button 
                        type="button" 
                        className="cw-btn cw-btn-secondary cw-btn-sm" 
                        style={{ marginLeft: 12 }}
                        onClick={() => onShowToast('Downloaded PDF Invoice for MinimalGear')}
                      >
                        PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              PERFORMANCE TAB
              ================================================================= */}
          {activeTab === 'performance' && (
            <div className="cw-subview">
              <div className="cw-section-header">
                <div>
                  <h1 className="cw-welcome-greeting" style={{ fontSize: '1.5rem' }}>Creator Performance & Audience</h1>
                  <p className="cw-welcome-subtitle">
                    Verified engagement statistics and collaboration conversion metrics.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 20, marginBottom: 24 }}>
                <div className="cw-card">
                  <span style={{ fontSize: '0.72rem', color: '#828E86', textTransform: 'uppercase' }}>Profile Views</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16281D', marginTop: 4 }}>1,420</div>
                  <span style={{ fontSize: '0.7rem', color: '#166534' }}>+18% this month</span>
                </div>
                <div className="cw-card">
                  <span style={{ fontSize: '0.72rem', color: '#828E86', textTransform: 'uppercase' }}>Conversion Rate</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16281D', marginTop: 4 }}>18.4%</div>
                  <span style={{ fontSize: '0.7rem', color: '#59655E' }}>Inquiries to bookings</span>
                </div>
                <div className="cw-card">
                  <span style={{ fontSize: '0.72rem', color: '#828E86', textTransform: 'uppercase' }}>Avg Delivery Time</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16281D', marginTop: 4 }}>4.8 Days</div>
                  <span style={{ fontSize: '0.7rem', color: '#166534' }}>100% on time</span>
                </div>
                <div className="cw-card">
                  <span style={{ fontSize: '0.72rem', color: '#828E86', textTransform: 'uppercase' }}>Audience Reach</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16281D', marginTop: 4 }}>85,000</div>
                  <span style={{ fontSize: '0.7rem', color: '#59655E' }}>YouTube & Instagram</span>
                </div>
              </div>

              <div className="cw-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 10 }}>Audited Metric Sources</h3>
                <p style={{ fontSize: '0.84rem', color: '#59655E', lineHeight: 1.5 }}>
                  Creatorly syncs follower counts, views, and engagement percentages directly via official YouTube Data API v3 and Meta Graph API OAuth. Metrics are verified every 24 hours to ensure transparency for brand sponsors.
                </p>
                <div style={{ fontSize: '0.75rem', color: '#828E86', marginTop: 8 }}>
                  Last API Sync: Today, 3 hours ago
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SETTINGS TAB
              ================================================================= */}
          {activeTab === 'settings' && (
            <div className="cw-subview">
              <div className="cw-section-header">
                <div>
                  <h1 className="cw-welcome-greeting" style={{ fontSize: '1.5rem' }}>Workspace Settings</h1>
                  <p className="cw-welcome-subtitle">
                    Manage security, notification alerts, payout accounts, and profile visibility.
                  </p>
                </div>
                <button 
                  type="button" 
                  className="cw-btn cw-btn-primary"
                  onClick={() => onShowToast('Workspace settings saved successfully!')}
                >
                  Save Settings
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 20, maxWidth: 680 }}>
                <div className="cw-card">
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Notification Preferences</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem' }}>
                      <input type="checkbox" defaultChecked />
                      <span>Email me immediately when a brand submits a collaboration request</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem' }}>
                      <input type="checkbox" defaultChecked />
                      <span>Notify me when Escrow funds are held or released</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem' }}>
                      <input type="checkbox" defaultChecked />
                      <span>Weekly performance summary digest</span>
                    </label>
                  </div>
                </div>

                <div className="cw-card">
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Bank Payout Details (Creatorly Escrow)</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#59655E', display: 'block', marginBottom: 4 }}>Account Holder Name</label>
                      <input type="text" defaultValue="Alex Sharma" className="cw-search-box" style={{ width: '100%' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#59655E', display: 'block', marginBottom: 4 }}>Bank Name & Branch</label>
                      <input type="text" defaultValue="HDFC Bank, Bandra West, Mumbai" className="cw-search-box" style={{ width: '100%' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#59655E', display: 'block', marginBottom: 4 }}>UPI ID (Optional fast payout)</label>
                      <input type="text" defaultValue="alexsharma@okaxis" className="cw-search-box" style={{ width: '100%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ───────────────────────────────────────────────────────────────────
          4. Reputation Tiers Modal (Exact Replica of User Reference Screenshot)
          ─────────────────────────────────────────────────────────────────── */}
      {tiersModalOpen && (
        <div className="cw-tiers-modal-overlay" onClick={() => setTiersModalOpen(false)}>
          <div className="cw-tiers-modal" onClick={e => e.stopPropagation()}>
            <div className="cw-tiers-modal-header">
              <div>
                <h2 className="cw-tiers-modal-title">Creator Reputation Tiers</h2>
                <p className="cw-tiers-modal-subtitle">
                  Eligibility-based tiers determined by verified collaborations, genuine reviews, and delivery reliability.
                </p>
              </div>
              <button 
                type="button" 
                className="cw-icon-btn"
                onClick={() => setTiersModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="cw-tiers-modal-body">
              {/* Tier 1: Emerging Creator */}
              <div className="cw-tier-card tier-card-light">
                <div className="cw-tier-card-header">
                  <h3 className="cw-tier-name">Emerging Creator</h3>
                  <span className="cw-tier-icon"><Sprout size={20} color="#335540" /></span>
                </div>
                <p className="cw-tier-desc">
                  For newer creators building a professional presence and collecting their first successful collaborations.
                </p>
                <div className="cw-tier-tags-row">
                  <span className="cw-tier-tag">Profile complete</span>
                  <span className="cw-tier-tag">Portfolio available</span>
                  <span className="cw-tier-tag">Growing reputation</span>
                </div>
              </div>

              {/* Tier 2: Established Creator */}
              <div className="cw-tier-card tier-card-light">
                <div className="cw-tier-card-header">
                  <h3 className="cw-tier-name">Established Creator</h3>
                  <span className="cw-tier-icon"><BookmarkCheck size={20} color="#335540" /></span>
                </div>
                <p className="cw-tier-desc">
                  For creators with a consistent body of work, meaningful collaboration history, and a demonstrated record of reliable delivery.
                </p>
                <div className="cw-tier-tags-row">
                  <span className="cw-tier-tag">Strong portfolio</span>
                  <span className="cw-tier-tag">Completed projects</span>
                  <span className="cw-tier-tag">Verified metrics where available</span>
                </div>
              </div>

              {/* Tier 3: Elite Creator (Dark forest green #16281D exactly like screenshot) */}
              <div className="cw-tier-card tier-card-dark">
                <span className="cw-tier-card-current-badge">Your Tier</span>
                <div className="cw-tier-card-header">
                  <h3 className="cw-tier-name">Elite Creator</h3>
                  <span className="cw-tier-icon"><Crown size={22} color="#C29C5B" /></span>
                </div>
                <p className="cw-tier-desc">
                  For high-performing creators who meet clear standards for collaboration history, client satisfaction, reliability, and verified performance.
                </p>
                <div className="cw-tier-tags-row">
                  <span className="cw-tier-tag tag-highlight">Quality record</span>
                  <span className="cw-tier-tag">Established reputation</span>
                  <span className="cw-tier-tag">Eligibility-based status</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Counteroffer Modal */}
      {counterOfferModalOpen && selectedRequestForDetail && (
        <div className="cw-tiers-modal-overlay" onClick={() => setCounterOfferModalOpen(false)}>
          <div className="cw-tiers-modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div className="cw-tiers-modal-header">
              <div>
                <h2 className="cw-tiers-modal-title">Propose Counteroffer</h2>
                <p className="cw-tiers-modal-subtitle">Brand: {selectedRequestForDetail.brandName}</p>
              </div>
              <button type="button" className="cw-icon-btn" onClick={() => setCounterOfferModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 6 }}>
                  Proposed Revised Budget (INR)
                </label>
                <input 
                  type="number" 
                  value={counterAmount}
                  onChange={(e) => setCounterAmount(Number(e.target.value))}
                  className="cw-search-box"
                  style={{ width: '100%', fontSize: '1rem', fontWeight: 700 }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 6 }}>
                  Reason / Deliverable Additions
                </label>
                <textarea 
                  rows={3}
                  placeholder="e.g. Can include 48-hour rush delivery and 2 additional story reshares..."
                  value={counterNote}
                  onChange={(e) => setCounterNote(e.target.value)}
                  className="cw-search-box"
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button type="button" className="cw-btn cw-btn-cancel" onClick={() => setCounterOfferModalOpen(false)}>
                  Cancel
                </button>
                <button type="button" className="cw-btn cw-btn-primary" onClick={handleSubmitCounter}>
                  Submit Counteroffer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {declineModalOpen && selectedRequestForDetail && (
        <div className="cw-tiers-modal-overlay" onClick={() => setDeclineModalOpen(false)}>
          <div className="cw-tiers-modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div className="cw-tiers-modal-header">
              <h2 className="cw-tiers-modal-title">Decline Collaboration Request</h2>
              <button type="button" className="cw-icon-btn" onClick={() => setDeclineModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: '0.85rem', color: '#59655E', margin: 0 }}>
                Are you sure you want to decline this request from <strong>{selectedRequestForDetail.brandName}</strong>?
              </p>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 6 }}>
                  Optional note to brand:
                </label>
                <select 
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="cw-search-box"
                  style={{ width: '100%' }}
                >
                  <option value="Schedule is currently at capacity.">Schedule is currently at capacity</option>
                  <option value="Not a fit for my current content calendar.">Not a fit for my current content calendar</option>
                  <option value="Proposed budget is below minimum rate.">Proposed budget is below minimum rate</option>
                  <option value="Competitor category exclusivity in effect.">Competitor category exclusivity in effect</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="cw-btn cw-btn-cancel" onClick={() => setDeclineModalOpen(false)}>
                  Cancel
                </button>
                <button type="button" className="cw-btn cw-btn-primary" style={{ background: '#E11D48' }} onClick={handleConfirmDecline}>
                  Decline Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Portfolio Modal */}
      {addPortfolioModalOpen && (
        <div className="cw-tiers-modal-overlay" onClick={() => setAddPortfolioModalOpen(false)}>
          <div className="cw-tiers-modal" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
            <div className="cw-tiers-modal-header">
              <h2 className="cw-tiers-modal-title">Add Portfolio Work</h2>
              <button type="button" className="cw-icon-btn" onClick={() => setAddPortfolioModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>Campaign Title</label>
                <input type="text" placeholder="e.g. Next-Gen Developer Terminal Setup" className="cw-search-box" style={{ width: '100%' }} id="new-port-title" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>Brand Client</label>
                  <input type="text" placeholder="e.g. Warp Terminal" className="cw-search-box" style={{ width: '100%' }} id="new-port-client" />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>Format</label>
                  <select className="cw-search-box" style={{ width: '100%' }} id="new-port-format">
                    <option value="YouTube Integration">YouTube Integration</option>
                    <option value="Sponsored Reel">Sponsored Reel</option>
                    <option value="Dedicated Tech Review">Dedicated Tech Review</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>Public Video Link</label>
                <input type="url" placeholder="https://youtube.com/watch?v=..." className="cw-search-box" style={{ width: '100%' }} id="new-port-url" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button type="button" className="cw-btn cw-btn-cancel" onClick={() => setAddPortfolioModalOpen(false)}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="cw-btn cw-btn-primary"
                  onClick={() => {
                    const titleInput = (document.getElementById('new-port-title') as HTMLInputElement)?.value;
                    const clientInput = (document.getElementById('new-port-client') as HTMLInputElement)?.value;
                    const formatInput = (document.getElementById('new-port-format') as HTMLSelectElement)?.value;
                    const urlInput = (document.getElementById('new-port-url') as HTMLInputElement)?.value;
                    
                    const newItem: PortfolioItem = {
                      id: `port-${Date.now()}`,
                      title: titleInput || 'Developer Workflow Showcase',
                      category: 'Tech & Developer Tools',
                      format: (formatInput as any) || 'YouTube Integration',
                      platform: 'youtube',
                      thumbnailUrl: '/images/work-ai-coding.jpg',
                      publishedDate: 'Just now',
                      views: 12400,
                      engagement: 6.8,
                      brandClient: clientInput || 'TechBrand',
                      campaignObjective: 'Drive organic developer adoptions',
                      deliverableSummary: '60-second integrated sponsorship segment with live code demo.',
                      originalUrl: urlInput || 'https://youtube.com',
                      verifiedMetrics: true
                    };
                    setCreator({
                      ...creator,
                      portfolio: [newItem, ...creator.portfolio]
                    });
                    onShowToast(`Added portfolio item: "${newItem.title}"`);
                    setAddPortfolioModalOpen(false);
                  }}
                >
                  Publish to Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      {addServiceModalOpen && (
        <div className="cw-tiers-modal-overlay" onClick={() => setAddServiceModalOpen(false)}>
          <div className="cw-tiers-modal" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
            <div className="cw-tiers-modal-header">
              <h2 className="cw-tiers-modal-title">Create New Service Package</h2>
              <button type="button" className="cw-icon-btn" onClick={() => setAddServiceModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>Package Title</label>
                <input type="text" placeholder="e.g. Dedicated Podcast Episode Sponsorship" className="cw-search-box" style={{ width: '100%' }} id="new-pkg-title" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>Price (INR)</label>
                  <input type="number" placeholder="15000" className="cw-search-box" style={{ width: '100%' }} id="new-pkg-price" />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>Delivery Days</label>
                  <input type="number" placeholder="7" className="cw-search-box" style={{ width: '100%' }} id="new-pkg-days" />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>Deliverable Description</label>
                <textarea rows={3} placeholder="What is included in this package..." className="cw-search-box" style={{ width: '100%', resize: 'vertical' }} id="new-pkg-desc" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="cw-btn cw-btn-cancel" onClick={() => setAddServiceModalOpen(false)}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="cw-btn cw-btn-primary"
                  onClick={() => {
                    const title = (document.getElementById('new-pkg-title') as HTMLInputElement)?.value;
                    const price = Number((document.getElementById('new-pkg-price') as HTMLInputElement)?.value) || 15000;
                    const days = Number((document.getElementById('new-pkg-days') as HTMLInputElement)?.value) || 7;
                    const desc = (document.getElementById('new-pkg-desc') as HTMLTextAreaElement)?.value || 'Tailored high-production deliverable';
                    
                    const newPkg: ServicePackage = {
                      id: `pkg-${Date.now()}`,
                      title: title || 'Custom Brand Showcase',
                      tagline: desc,
                      priceInINR: price,
                      platform: 'Multi-Platform',
                      deliveryDays: days,
                      includedRevisions: 1,
                      publishingIncluded: true,
                      organicUsageDays: 30,
                      paidUsageRightsIncluded: false,
                      deliverables: [
                        'Custom high-production showcase',
                        '1 round of script review + 1 draft edit',
                        'Pinned trackable link in description'
                      ],
                      bestFor: 'Brands wanting a focused product launch highlight'
                    };
                    setCreator({
                      ...creator,
                      packages: [...creator.packages, newPkg]
                    });
                    onShowToast(`Created service package: "${newPkg.title}"`);
                    setAddServiceModalOpen(false);
                  }}
                >
                  Publish Package
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help & Creator Guide Modal */}
      {helpModalOpen && (
        <div className="cw-tiers-modal-overlay" onClick={() => setHelpModalOpen(false)}>
          <div className="cw-tiers-modal" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
            <div className="cw-tiers-modal-header">
              <h2 className="cw-tiers-modal-title">Creatorly Workspace Guide</h2>
              <button type="button" className="cw-icon-btn" onClick={() => setHelpModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: 24, fontSize: '0.88rem', color: '#19201C', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p>
                <strong>Welcome to Creatorly!</strong> This workspace is purpose-built to help you build a trustworthy public identity, showcase audited metrics, and safely manage brand deals with milestone Escrow protection.
              </p>
              <div style={{ padding: 12, background: '#FAF9F5', borderRadius: 8, border: '1px solid #E5E8E4' }}>
                <strong style={{ color: '#16281D' }}>Milestone Escrow Security:</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#59655E' }}>
                  When you accept a brand collaboration, funds are placed into Creatorly Escrow before you film. Once your deliverables are approved, payments release directly to your account.
                </p>
              </div>
              <div style={{ padding: 12, background: '#FAF9F5', borderRadius: 8, border: '1px solid #E5E8E4' }}>
                <strong style={{ color: '#16281D' }}>Reputation Tiers:</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#59655E' }}>
                  Tiers (Emerging, Established, Elite) are calculated from authentic collaboration history and genuine client ratings, never follower counts alone.
                </p>
              </div>
              <button 
                type="button" 
                className="cw-btn cw-btn-primary" 
                style={{ marginTop: 8 }}
                onClick={() => setHelpModalOpen(false)}
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
