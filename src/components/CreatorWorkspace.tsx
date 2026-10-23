import React, { useState, useMemo, useEffect } from 'react';
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
import { uploadMediaFile, saveCreatorToSupabase } from '../lib/supabaseClient';
import { fetchYouTubeChannelStats } from '../lib/youtubeService';
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
  Crown,
  Sprout,
  BookmarkCheck,
  X,
  Menu,
  Send,
  Eye,
  Check,
  ShieldCheck,
  TrendingUp,
  Star,
  Trash2,
  Edit2,
  Download,
  RefreshCw,
  CheckCircle2,
  UploadCloud
} from 'lucide-react';

interface CreatorWorkspaceProps {
  creator: CreatorProfile;
  currentCurrency: CurrencyCode;
  collaborationRequests: CollaborationRequest[];
  onViewPublicProfile: () => void;
  onSelectCreator?: (creator: CreatorProfile) => void;
  onUpdateRequests?: (updated: CollaborationRequest[]) => void;
  onUpdateCreator?: (updatedCreator: CreatorProfile) => void;
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

interface CalendarEventItem {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  brand: string;
  type: 'shooting' | 'review' | 'publish' | 'deadline' | 'blackout';
  status: 'confirmed' | 'pending' | 'completed' | 'blocked';
}

interface PayoutTransaction {
  id: string;
  brandOrTarget: string;
  description: string;
  date: string;
  amountINR: number;
  type: 'escrow_received' | 'withdrawal' | 'bonus';
  status: 'Completed' | 'Processing' | 'Held in Escrow';
  invoiceRef?: string;
}

export const CreatorWorkspace: React.FC<CreatorWorkspaceProps> = ({
  creator: initialCreator,
  currentCurrency,
  collaborationRequests: initialRequests,
  onViewPublicProfile,
  onShowToast,
  currentUser: _currentUser,
  onLogout,
  onSwitchToMarketplace,
  onUpdateRequests,
  onUpdateCreator
}) => {
  // Navigation & UI State
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [tiersModalOpen, setTiersModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  // 1. Creator Profile State (Editable)
  const [creator, setCreator] = useState<CreatorProfile>(initialCreator);
  const [editAvatarUrl, setEditAvatarUrl] = useState(initialCreator.avatarUrl);
  const [newSubNicheInput, setNewSubNicheInput] = useState('');

  useEffect(() => {
    if (initialCreator) {
      setCreator(initialCreator);
      setEditAvatarUrl(initialCreator.avatarUrl);
    }
  }, [initialCreator]);

  useEffect(() => {
    if (_currentUser && _currentUser.role === 'creator') {
      setCreator((prev) => ({
        ...prev,
        fullName: _currentUser.name || prev.fullName,
        handle: _currentUser.handle || prev.handle,
        avatarUrl: _currentUser.avatarUrl || prev.avatarUrl,
        primaryNiche: _currentUser.niche || prev.primaryNiche,
      }));
      if (_currentUser.avatarUrl) {
        setEditAvatarUrl(_currentUser.avatarUrl);
      }
    }
  }, [_currentUser]);

  // 2. Collaboration Requests State
  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>(initialRequests);
  const [requestStatusFilter, setRequestStatusFilter] = useState<string>('all');
  const [requestSearchQuery, setRequestSearchQuery] = useState('');
  const [selectedRequestForDetail, setSelectedRequestForDetail] = useState<CollaborationRequest | null>(null);

  // Request Action Modals
  const [counterOfferModalOpen, setCounterOfferModalOpen] = useState(false);
  const [counterAmount, setCounterAmount] = useState<number>(12000);
  const [counterNote, setCounterNote] = useState('');
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('Schedule is currently at capacity.');
  const [submitDraftModalOpen, setSubmitDraftModalOpen] = useState(false);
  const [draftUrl, setDraftUrl] = useState('');
  const [draftNotes, setDraftNotes] = useState('');

  // 3. Content & Portfolio State
  const [portfolioFormatFilter, setPortfolioFormatFilter] = useState<string>('all');
  const [portfolioSearch, setPortfolioSearch] = useState('');
  const [addPortfolioModalOpen, setAddPortfolioModalOpen] = useState(false);
  const [newPortTitle, setNewPortTitle] = useState('');
  const [newPortClient, setNewPortClient] = useState('');
  const [newPortFormat, setNewPortFormat] = useState('YouTube Integration');
  const [newPortUrl, setNewPortUrl] = useState('');
  const [newPortViews, setNewPortViews] = useState(15400);
  const [newPortEngagement, setNewPortEngagement] = useState(6.2);
  const [newPortDeliverable, setNewPortDeliverable] = useState('');
  const [newPortThumb, setNewPortThumb] = useState('/images/work-ai-coding.jpg');

  // 4. Services & Pricing State
  const [servicePlatformFilter, setServicePlatformFilter] = useState<string>('all');
  const [addServiceModalOpen, setAddServiceModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(null);
  const [pkgTitle, setPkgTitle] = useState('');
  const [pkgPrice, setPkgPrice] = useState(15000);
  const [pkgDays, setPkgDays] = useState(5);
  const [pkgPlatform, setPkgPlatform] = useState('YouTube');
  const [pkgTagline, setPkgTagline] = useState('');
  const [pkgDeliverablesText, setPkgDeliverablesText] = useState('1 Dedicated high-energy video segment\n1 Round of script review\nPinned trackable discount link');

  // 5. Messages & Chat State
  const isDemoAlex = creator.id === 'cr_alex_sharma';
  const [activeConversationId, setActiveConversationId] = useState<string>(() => isDemoAlex ? 'c-1' : '');
  const [chatReplyText, setChatReplyText] = useState('');
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [conversations, setConversations] = useState(() => isDemoAlex ? [
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
  ] : []);

  // 6. Availability & Calendar State
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>('2026-10-28');
  const [calendarMonth, setCalendarMonth] = useState<'october' | 'november'>('october');
  const [addEventModalOpen, setAddEventModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventBrand, setNewEventBrand] = useState('');
  const [newEventDate, setNewEventDate] = useState('2026-10-29');
  const [newEventType, setNewEventType] = useState<'shooting' | 'review' | 'publish' | 'deadline' | 'blackout'>('shooting');
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventItem[]>(() => isDemoAlex ? [
    { id: 'ev-1', date: '2026-10-24', title: 'Script Outline Due', brand: 'SuperAI Labs', type: 'deadline', status: 'pending' },
    { id: 'ev-2', date: '2026-10-28', title: 'Film Studio Shoot', brand: 'UrbanThreads', type: 'shooting', status: 'confirmed' },
    { id: 'ev-3', date: '2026-11-05', title: 'YouTube Video Goes Live', brand: 'SuperAI Labs', type: 'publish', status: 'confirmed' },
    { id: 'ev-4', date: '2026-11-12', title: 'Warp Terminal Review Draft', brand: 'DevToolbox Cloud', type: 'review', status: 'pending' },
    { id: 'ev-5', date: '2026-11-15', title: 'Blocked for Tech Summit', brand: 'Personal', type: 'blackout', status: 'blocked' },
    { id: 'ev-6', date: '2026-10-16', title: 'Sponsored Reel Delivered', brand: 'NextLearn AI', type: 'publish', status: 'completed' }
  ] : []);

  // 7. Earnings & Payouts State
  const [lifetimeEarnedINR, setLifetimeEarnedINR] = useState(() => isDemoAlex ? 142000 : 0);
  const [availablePayoutINR, setAvailablePayoutINR] = useState(() => isDemoAlex ? 28500 : 0);
  const [escrowHeldINR, setEscrowHeldINR] = useState(() => isDemoAlex ? 14500 : 0);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(25000);
  const [payoutMethod, setPayoutMethod] = useState<'bank' | 'upi'>('bank');
  const [payoutTransactions, setPayoutTransactions] = useState<PayoutTransaction[]>(() => isDemoAlex ? [
    { id: 'tx-1', brandOrTarget: 'NextLearn AI', description: 'Sponsored Reel (Delivered & Approved)', date: 'Oct 17, 2026', amountINR: 8500, type: 'escrow_received', status: 'Completed', invoiceRef: 'INV-2026-904' },
    { id: 'tx-2', brandOrTarget: 'MinimalGear', description: 'UGC Ad Creative & Commercial Rights', date: 'Oct 04, 2026', amountINR: 6000, type: 'escrow_received', status: 'Completed', invoiceRef: 'INV-2026-881' },
    { id: 'tx-3', brandOrTarget: 'Bank Withdrawal (HDFC)', description: 'Direct bank payout to *******4920', date: 'Sep 28, 2026', amountINR: 40000, type: 'withdrawal', status: 'Completed', invoiceRef: 'PAY-2026-419' }
  ] : []);

  // 8. Performance & API Sync State
  const [apiSyncState, setApiSyncState] = useState({
    youtube: 'Synced via YouTube API',
    meta: 'Synced 3 hours ago',
    linkedin: 'Synced 1 day ago'
  });
  const [syncingApi, setSyncingApi] = useState<string | null>(null);

  // 9. Settings Sub-tabs State
  const [settingsSubTab, setSettingsSubTab] = useState<'account' | 'payout' | 'notifications' | 'tier'>('account');
  const [bankSettings, setBankSettings] = useState(() => isDemoAlex ? {
    accountName: 'Alex Sharma',
    bankName: 'HDFC Bank, Bandra West Branch, Mumbai',
    accountNumber: '50100482914920',
    ifsc: 'HDFC0000128',
    upiId: 'alexsharma@okaxis',
    pan: 'ABCPS1290K',
    gstin: '27ABCPS1290K1Z5'
  } : {
    accountName: creator.fullName || '',
    bankName: '',
    accountNumber: '',
    ifsc: '',
    upiId: '',
    pan: '',
    gstin: ''
  });
  const [notificationPreferences, setNotificationPreferences] = useState({
    proposalEmail: true,
    escrowAlerts: true,
    whatsappUrgent: true,
    weeklyDigest: false
  });
  const [twoFactorActive, setTwoFactorActive] = useState(true);

  // Currency helper
  const currencyConfig = CURRENCIES[currentCurrency] || CURRENCIES.INR;
  const formatMoney = (inr: number) => {
    const converted = Math.round(inr * currencyConfig.rateAgainstINR);
    return `${currencyConfig.symbol}${converted.toLocaleString(currencyConfig.locale)}`;
  };

  // Profile completion calculation
  const completionPercent = useMemo(() => {
    let score = 0;
    if (creator.fullName && creator.handle) score += 15;
    if (creator.bio && creator.bio.length > 20) score += 15;
    if (creator.primaryNiche && creator.subNiches.length > 0) score += 15;
    if (creator.socialLinks && creator.socialLinks.length >= 2) score += 20;
    if (creator.packages && creator.packages.length >= 2) score += 15;
    if (creator.portfolio && creator.portfolio.length >= 3) score += 10;
    if (creator.availability?.status) score += 10;
    return Math.min(score, 100);
  }, [creator]);

  const missingItems = useMemo(() => {
    const items = [];
    if (!creator.bio || creator.bio.length < 20) items.push({ id: 'bio', label: 'Add full biography' });
    if (creator.packages.length < 3) items.push({ id: 'packages', label: 'List at least 3 service packages' });
    if (creator.portfolio.length < 4) items.push({ id: 'portfolio', label: 'Upload past brand integration case studies' });
    return items;
  }, [creator]);

  // Navigation badge counts
  const pendingRequestsCount = useMemo(() => {
    return collaborationRequests.filter(r => r.status === 'new' || r.status === 'in_discussion').length;
  }, [collaborationRequests]);

  const unreadMessagesCount = useMemo(() => {
    return conversations.filter(c => c.unread).length;
  }, [conversations]);

  // Request Handlers
  const handleAcceptRequest = (requestId: string) => {
    const updated = collaborationRequests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'accepted' as any,
          escrowStatus: 'held' as any,
          pipelineStage: 'script_signoff' as any
        };
      }
      return req;
    });
    setCollaborationRequests(updated);
    onUpdateRequests?.(updated);
    setEscrowHeldINR(prev => prev + 10000);
    onShowToast('Request accepted! Escrow secured & moved to Script Signoff.');
    if (selectedRequestForDetail?.id === requestId) {
      setSelectedRequestForDetail(null);
    }
  };

  const handleConfirmDecline = () => {
    if (!selectedRequestForDetail) return;
    const updated = collaborationRequests.map(req => {
      if (req.id === selectedRequestForDetail.id) {
        return {
          ...req,
          status: 'declined' as any,
          creatorNotes: declineReason
        };
      }
      return req;
    });
    setCollaborationRequests(updated);
    onUpdateRequests?.(updated);
    onShowToast(`Request from ${selectedRequestForDetail.brandName} declined.`);
    setDeclineModalOpen(false);
    setSelectedRequestForDetail(null);
  };

  const handleSubmitCounter = () => {
    if (!selectedRequestForDetail) return;
    const updated = collaborationRequests.map(req => {
      if (req.id === selectedRequestForDetail.id) {
        return {
          ...req,
          status: 'in_discussion' as any,
          budgetINR: counterAmount,
          counterOfferINR: counterAmount,
          counterOfferNotes: counterNote
        };
      }
      return req;
    });
    setCollaborationRequests(updated);
    onUpdateRequests?.(updated);
    onShowToast(`Counteroffer of ${formatMoney(counterAmount)} sent to ${selectedRequestForDetail.brandName}.`);
    setCounterOfferModalOpen(false);
    setSelectedRequestForDetail(null);
  };

  const handleSubmitDraftDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestForDetail) return;
    const updated = collaborationRequests.map(req => {
      if (req.id === selectedRequestForDetail.id) {
        return {
          ...req,
          pipelineStage: 'draft_review' as any,
          status: 'in_discussion' as any,
          creatorNotes: `Draft URL submitted: ${draftUrl}`
        };
      }
      return req;
    });
    setCollaborationRequests(updated);
    onUpdateRequests?.(updated);
    onShowToast(`Deliverable draft submitted to ${selectedRequestForDetail.brandName} for review!`);
    setSubmitDraftModalOpen(false);
    setDraftUrl('');
    setDraftNotes('');
    setSelectedRequestForDetail(null);
  };

  const handleMarkDealComplete = (req: CollaborationRequest) => {
    const updated = collaborationRequests.map(r => {
      if (r.id === req.id) {
        return {
          ...r,
          status: 'completed' as any,
          pipelineStage: 'completed' as any,
          escrowStatus: 'released' as any
        };
      }
      return r;
    });
    setCollaborationRequests(updated);
    onUpdateRequests?.(updated);
    setAvailablePayoutINR(prev => prev + req.budgetINR);
    setLifetimeEarnedINR(prev => prev + req.budgetINR);
    setEscrowHeldINR(prev => Math.max(0, prev - req.budgetINR));
    
    // Add transaction
    const newTx: PayoutTransaction = {
      id: `tx-${Date.now()}`,
      brandOrTarget: req.brandName,
      description: `${req.serviceTitle} (Approved & Completed)`,
      date: 'Today',
      amountINR: req.budgetINR,
      type: 'escrow_received',
      status: 'Completed',
      invoiceRef: `INV-${Date.now().toString().slice(-4)}`
    };
    setPayoutTransactions(prev => [newTx, ...prev]);
    onShowToast(`Deal with ${req.brandName} completed! ${formatMoney(req.budgetINR)} released to your available payout balance.`);
    if (selectedRequestForDetail?.id === req.id) setSelectedRequestForDetail(null);
  };

  // Chat message send
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatReplyText.trim()) return;
    const sentText = chatReplyText.trim();
    setChatReplyText('');

    setConversations(prev => prev.map(conv => {
      if (conv.id === activeConversationId) {
        return {
          ...conv,
          unread: false,
          messages: [
            ...conv.messages,
            { sender: 'creator', text: sentText, time: 'Just now' }
          ]
        };
      }
      return conv;
    }));
    onShowToast('Message sent to brand partner.');

    // Simulated reply after 800ms
    setTimeout(() => {
      setConversations(prev => prev.map(conv => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            messages: [
              ...conv.messages,
              { sender: 'brand', text: `Thanks Alex! Received your update regarding "${sentText.slice(0, 30)}...". Checking this with our campaign manager!`, time: 'Just now' }
            ]
          };
        }
        return conv;
      }));
    }, 900);
  };

  // Withdraw payout
  const handleConfirmPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0 || withdrawAmount > availablePayoutINR) {
      onShowToast('Please enter a valid withdrawal amount.');
      return;
    }
    setAvailablePayoutINR(prev => prev - withdrawAmount);
    const newTx: PayoutTransaction = {
      id: `tx-${Date.now()}`,
      brandOrTarget: payoutMethod === 'bank' ? 'HDFC Bank (*4920)' : `UPI (${bankSettings.upiId})`,
      description: `Direct payout transfer via Creatorly Escrow`,
      date: 'Today',
      amountINR: withdrawAmount,
      type: 'withdrawal',
      status: 'Processing',
      invoiceRef: `PAY-2026-${Date.now().toString().slice(-4)}`
    };
    setPayoutTransactions(prev => [newTx, ...prev]);
    onShowToast(`Payout request for ${formatMoney(withdrawAmount)} initiated! Arriving in 2 hours.`);
    setPayoutModalOpen(false);
  };

  // API sync with real YouTube Data API v3 integration
  const handleSyncApi = async (platform: 'youtube' | 'meta' | 'linkedin') => {
    setSyncingApi(platform);
    if (platform === 'youtube') {
      const currentYt = creator.socialLinks.find(s => s.platform === 'youtube')?.url || creator.handle;
      const stats = await fetchYouTubeChannelStats(currentYt || 'Alex Sharma');
      if (stats) {
        const updatedSocialLinks = creator.socialLinks.map(s => {
          if (s.platform === 'youtube') {
            return {
              ...s,
              followers: stats.subscriberCount,
              verified: true,
              handle: stats.customUrl
            };
          }
          return s;
        });

        if (!updatedSocialLinks.some(s => s.platform === 'youtube')) {
          updatedSocialLinks.push({
            platform: 'youtube',
            name: 'YouTube',
            handle: stats.customUrl,
            url: `https://youtube.com/${stats.customUrl}`,
            followers: stats.subscriberCount,
            verified: true
          });
        }

        const updatedCreator: CreatorProfile = {
          ...creator,
          verifiedBadge: true,
          verificationSource: 'Official YouTube Data API v3',
          socialLinks: updatedSocialLinks,
          metrics: {
            ...creator.metrics,
            totalAudience: stats.subscriberCount + (creator.metrics.platformFollowers?.instagram || 0),
            averageViews: Math.round(stats.viewCount / Math.max(stats.videoCount, 1)),
            platformFollowers: {
              ...(creator.metrics.platformFollowers || { instagram: 0, linkedin: 0 }),
              youtube: stats.subscriberCount
            }
          }
        };

        setCreator(updatedCreator);
        onUpdateCreator?.(updatedCreator);
        saveCreatorToSupabase(updatedCreator);
        setSyncingApi(null);
        setApiSyncState(prev => ({
          ...prev,
          youtube: 'Synced via YouTube API'
        }));
        onShowToast(`🎉 Verified "${stats.title}"! ${stats.subscriberCount.toLocaleString('en-IN')} subscribers & ${stats.videoCount} videos verified via Google YouTube API!`);
        return;
      } else {
        setSyncingApi(null);
        onShowToast(`⚠️ Could not resolve channel for "${currentYt}". Try your channel handle (e.g. @handle or @MrBeast).`);
        return;
      }
    }

    setTimeout(() => {
      setSyncingApi(null);
      setApiSyncState(prev => ({
        ...prev,
        [platform]: 'Synced just now'
      }));
      onShowToast(`${platform.toUpperCase()} metrics synced! Live reach updated.`);
    }, 900);
  };

  // Profile save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCreator?.(creator);
    saveCreatorToSupabase(creator);
    onShowToast('Profile & Storefront changes saved to database! Public storefront updated.');
    setActiveTab('home');
  };

  const handleCopyProfileLink = () => {
    const url = `${window.location.origin}/creators/${creator.username}`;
    navigator.clipboard?.writeText(url);
    onShowToast(`Public profile link copied: ${url}`);
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
            <span className="cw-logo-badge">WORKSPACE</span>
          </button>
          {mobileMenuOpen && (
            <button 
              type="button" 
              className="cw-icon-btn"
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

        {/* Navigation Items (All 10 required items exactly matching reference) */}
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
            {unreadMessagesCount > 0 && (
              <span className="cw-nav-item-badge">{unreadMessagesCount}</span>
            )}
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

        {/* Sidebar Footer Link */}
        <div style={{ marginTop: 'auto', padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button 
            type="button" 
            className="cw-btn cw-btn-secondary" 
            style={{ width: '100%', fontSize: '0.8rem', justifyContent: 'center' }}
            onClick={onViewPublicProfile}
          >
            <Eye size={14} />
            <span>Preview Public Storefront</span>
          </button>
        </div>
      </aside>

      {/* ───────────────────────────────────────────────────────────────────
          2. Top Navigation Bar
          ─────────────────────────────────────────────────────────────────── */}
      <div className="cw-main-content">
        <header className="cw-top-nav">
          <div className="cw-top-nav-left">
            <button 
              type="button" 
              className="cw-mobile-menu-btn" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={20} />
            </button>
            <div className="cw-search-wrapper">
              <Search size={16} className="cw-search-icon" />
              <input 
                type="text" 
                placeholder="Search opportunities, brands, briefs..." 
                className="cw-search-box"
              />
            </div>
          </div>

          <div className="cw-top-nav-right">
            {/* Availability Quick Status Indicator */}
            <div 
              className="cw-availability-pill" 
              title="Click to toggle availability"
              onClick={() => setActiveTab('calendar')}
              style={{ cursor: 'pointer' }}
            >
              <span className="cw-availability-dot" />
              <span>Available for Collaborations</span>
            </div>

            {/* Notification Bell */}
            <button 
              type="button" 
              className="cw-top-icon-btn" 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              title="Notifications"
            >
              <Bell size={18} />
              {pendingRequestsCount > 0 && <span className="cw-notif-dot" />}
            </button>

            {/* Help / Guide button */}
            <button 
              type="button" 
              className="cw-top-icon-btn" 
              onClick={() => setHelpModalOpen(true)}
              title="Creator Guide"
            >
              <HelpCircle size={18} />
            </button>

            {/* Switch to Marketplace */}
            <button 
              type="button" 
              className="cw-btn cw-btn-secondary cw-btn-sm"
              onClick={onSwitchToMarketplace}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span>Discover Marketplace</span>
              <ExternalLink size={13} />
            </button>

            {/* User Dropdown */}
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
                <ChevronDown size={14} />
              </button>

              {userDropdownOpen && (
                <div className="cw-dropdown-menu">
                  <div className="cw-dropdown-header">
                    <strong>{creator.fullName}</strong>
                    <span>{creator.handle}</span>
                  </div>
                  <button type="button" className="cw-dropdown-item" onClick={() => { setActiveTab('profile'); setUserDropdownOpen(false); }}>
                    <User size={14} />
                    <span>My Profile</span>
                  </button>
                  <button type="button" className="cw-dropdown-item" onClick={() => { setActiveTab('settings'); setUserDropdownOpen(false); }}>
                    <Settings size={14} />
                    <span>Workspace Settings</span>
                  </button>
                  <button type="button" className="cw-dropdown-item" onClick={onViewPublicProfile}>
                    <ExternalLink size={14} />
                    <span>View Public Storefront</span>
                  </button>
                  <div className="cw-dropdown-divider" />
                  <button type="button" className="cw-dropdown-item text-danger" onClick={onLogout}>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ───────────────────────────────────────────────────────────────────
            3. Dynamic Views Router (All 10 Tabs)
            ─────────────────────────────────────────────────────────────────── */}
        <main className="cw-page-container">
          {/* =================================================================
              TAB 1: HOME
              ================================================================= */}
          {activeTab === 'home' && (
            <div className="cw-home-view">
              <div className="cw-welcome-header">
                <div>
                  <h1 className="cw-welcome-greeting">Good afternoon, {creator.fullName.split(' ')[0]}.</h1>
                  <p className="cw-welcome-subtitle">
                    Your creator profile is live and verified. Oversee incoming briefs, manage milestone escrow, and track payouts.
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

              {/* Top 4 KPI Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                <div className="cw-card" style={{ padding: 18, cursor: 'pointer' }} onClick={() => setActiveTab('earnings')}>
                  <span style={{ fontSize: '0.74rem', color: '#828E86', textTransform: 'uppercase', fontWeight: 600 }}>Lifetime Earned</span>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#16281D', marginTop: 4 }}>{formatMoney(lifetimeEarnedINR)}</div>
                  <span style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 600 }}>+14% this month</span>
                </div>

                <div className="cw-card" style={{ padding: 18, cursor: 'pointer' }} onClick={() => setActiveTab('earnings')}>
                  <span style={{ fontSize: '0.74rem', color: '#828E86', textTransform: 'uppercase', fontWeight: 600 }}>Secured in Escrow</span>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#166534', marginTop: 4 }}>{formatMoney(escrowHeldINR)}</div>
                  <span style={{ fontSize: '0.72rem', color: '#59655E' }}>2 active deals protected</span>
                </div>

                <div className="cw-card" style={{ padding: 18, cursor: 'pointer' }} onClick={() => setActiveTab('requests')}>
                  <span style={{ fontSize: '0.74rem', color: '#828E86', textTransform: 'uppercase', fontWeight: 600 }}>Pending Requests</span>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#C29C5B', marginTop: 4 }}>{pendingRequestsCount}</div>
                  <span style={{ fontSize: '0.72rem', color: '#C29C5B', fontWeight: 600 }}>Action needed</span>
                </div>

                <div className="cw-card" style={{ padding: 18, cursor: 'pointer' }} onClick={() => setActiveTab('performance')}>
                  <span style={{ fontSize: '0.74rem', color: '#828E86', textTransform: 'uppercase', fontWeight: 600 }}>Profile Views</span>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#16281D', marginTop: 4 }}>
                    {((creator.metrics?.totalAudience ? Math.max(Math.round(creator.metrics.totalAudience * 0.04), 120) : 0)).toLocaleString('en-IN')}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 600 }}>Verified reach tracking</span>
                </div>
              </div>

              {/* Dynamic Profile Completion Card */}
              {completionPercent < 100 && (
                <div className="cw-completion-card" style={{ marginBottom: 24 }}>
                  <div className="cw-completion-top">
                    <div className="cw-completion-title-group">
                      <ShieldCheck size={20} color="#16281D" />
                      <h2 className="cw-completion-title">Profile Setup Status</h2>
                    </div>
                    <span className="cw-completion-score">{completionPercent}% Complete</span>
                  </div>

                  <div className="cw-progress-track">
                    <div className="cw-progress-fill" style={{ width: `${completionPercent}%` }} />
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
                      Tip: Verified packages and audited case studies unlock higher discovery ranking with enterprise sponsors.
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
                <div className="cw-home-left-col">
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
                      {collaborationRequests.length === 0 ? (
                        <div style={{
                          background: '#FAF9F5',
                          border: '1.5px dashed #D1DDD6',
                          borderRadius: 14,
                          padding: '36px 20px',
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 10
                        }}>
                          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#EDF5F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldCheck size={22} color="#15803D" />
                          </div>
                          <h4 style={{ margin: 0, fontSize: '1rem', color: '#19201C', fontWeight: 700 }}>Ready for Brand Collaborations</h4>
                          <p style={{ margin: 0, fontSize: '0.82rem', color: '#59655E', maxWidth: 380, lineHeight: 1.5 }}>
                            Your storefront is verified and active. When sponsors send brief proposals or book services, they will appear here with milestone escrow protection.
                          </p>
                          <button 
                            type="button" 
                            className="cw-btn cw-btn-primary cw-btn-sm"
                            style={{ marginTop: 6 }}
                            onClick={onViewPublicProfile}
                          >
                            <ExternalLink size={13} />
                            <span>Preview Your Public Storefront</span>
                          </button>
                        </div>
                      ) : (
                        collaborationRequests.slice(0, 3).map(request => (
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
                              <span className="cw-req-val" style={{ color: request.escrowStatus === 'held' ? '#166534' : '#828E86' }}>
                                {request.escrowStatus === 'held' ? 'Escrow Secured' : 'Pending Signoff'}
                              </span>
                            </div>
                          </div>

                          <p style={{ fontSize: '0.82rem', color: '#59655E', lineHeight: 1.45, margin: '10px 0 14px' }}>
                            {request.campaignBrief}
                          </p>

                          <div className="cw-request-actions">
                            {request.status === 'new' && (
                              <>
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
                              </>
                            )}
                            {request.status === 'accepted' && (
                              <button 
                                type="button" 
                                className="cw-btn cw-btn-primary cw-btn-sm"
                                onClick={() => {
                                  setSelectedRequestForDetail(request);
                                  setSubmitDraftModalOpen(true);
                                }}
                              >
                                <UploadCloud size={14} />
                                <span>Submit Deliverable Draft</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Public Storefront Preview Card (Dashing & Smart) */}
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
                            <Crown size={12} color="#4ADE80" />
                            <span>Elite Creator · Top 1%</span>
                          </div>
                          <div className="cw-card-price-chip">
                            <span className="cw-price-chip-lbl">Starts at</span>
                            <span className="cw-price-chip-val">{formatMoney(8500)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Name, Verified Status & Handle */}
                      <div className="cw-creator-identity-block">
                        <div className="cw-creator-name-line">
                          <h3 className="cw-creator-card-name">{creator.fullName}</h3>
                          <span className="cw-verified-chip">
                            <Check size={11} />
                            <span>Verified</span>
                          </span>
                        </div>
                        <span className="cw-creator-card-handle">{creator.handle}</span>
                      </div>

                      {/* Bio Quote */}
                      <p className="cw-creator-card-bio">
                        "{creator.bio}"
                      </p>

                      {/* Niches Pills */}
                      <div className="cw-creator-card-niches">
                        <span className="cw-creator-niche-pill active-niche">{creator.primaryNiche}</span>
                        {creator.subNiches.slice(0, 3).map((niche, i) => (
                          <span key={i} className="cw-creator-niche-pill">{niche}</span>
                        ))}
                      </div>

                      {/* 3-Cell Verified Metrics Grid */}
                      <div className="cw-creator-metrics-3grid">
                        <div className="cw-creator-metric-cell">
                          <div className="cw-metric-val-row">
                            <strong>4.9</strong>
                            <Star size={12} color="#166534" fill="#166534" />
                          </div>
                          <span className="cw-metric-lbl">18 Reviews</span>
                          <span className="cw-metric-sub">100% 5-Star</span>
                        </div>
                        <div className="cw-creator-metric-cell">
                          <div className="cw-metric-val-row">
                            <strong>24</strong>
                          </div>
                          <span className="cw-metric-lbl">Collabs Done</span>
                          <span className="cw-metric-sub">100% On-Time</span>
                        </div>
                        <div className="cw-creator-metric-cell">
                          <div className="cw-metric-val-row">
                            <strong>4.8%</strong>
                          </div>
                          <span className="cw-metric-lbl">Engagement</span>
                          <span className="cw-metric-sub" style={{ color: '#15803D', fontWeight: 600 }}>↗ 3.2x Top Avg</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button 
                        type="button" 
                        className="cw-storefront-cta-btn"
                        onClick={onViewPublicProfile}
                      >
                        <span>Preview Full Storefront</span>
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 2: MY PROFILE
              ================================================================= */}
          {activeTab === 'profile' && (
            <div className="cw-subview">
              <div className="cw-section-header">
                <div>
                  <h1 className="cw-welcome-greeting" style={{ fontSize: '1.5rem' }}>Edit Creator Profile</h1>
                  <p className="cw-welcome-subtitle">
                    Keep your public identity, bio, niches, and verified social channels up to date.
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

              <div className="cw-profile-columns" style={{ marginTop: 24 }}>
                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Basic Identity */}
                  <div className="cw-card">
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 14, color: '#19201C' }}>Basic Identity & Avatar</h3>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 16, flexWrap: 'wrap' }}>
                      <img src={creator.avatarUrl} alt={creator.fullName} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid #16281D' }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E' }}>Creator Profile Photo</span>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                          <label 
                            className="cw-btn cw-btn-primary cw-btn-sm"
                            style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, margin: 0 }}
                          >
                            <UploadCloud size={14} />
                            <span>Upload from Device</span>
                            <input 
                              type="file" 
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const mediaUrl = await uploadMediaFile(file);
                                    setEditAvatarUrl(mediaUrl);
                                    setCreator(prev => ({ ...prev, avatarUrl: mediaUrl }));
                                    onShowToast('Avatar photo updated from your device!');
                                  } catch {
                                    onShowToast('Could not process image file.');
                                  }
                                }
                              }}
                            />
                          </label>
                          <input 
                            type="text" 
                            placeholder="Or paste image URL"
                            value={editAvatarUrl}
                            onChange={(e) => {
                              setEditAvatarUrl(e.target.value);
                              setCreator({ ...creator, avatarUrl: e.target.value });
                            }}
                            className="cw-search-box"
                            style={{ width: 240, fontSize: '0.82rem' }}
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 6 }}>Full Name</label>
                        <input 
                          type="text" 
                          value={creator.fullName} 
                          onChange={(e) => setCreator({ ...creator, fullName: e.target.value })}
                          className="cw-search-box" 
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 6 }}>Public Handle</label>
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
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 6 }}>Tagline / Value Proposition</label>
                      <input 
                        type="text" 
                        value={(creator as any).tagline || creator.primaryNiche} 
                        onChange={(e) => setCreator({ ...creator, primaryNiche: e.target.value })}
                        className="cw-search-box" 
                        style={{ width: '100%' }}
                      />
                    </div>

                    <div style={{ marginTop: 14 }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 6 }}>Short Biography</label>
                      <textarea 
                        rows={3} 
                        value={creator.bio}
                        onChange={(e) => setCreator({ ...creator, bio: e.target.value })}
                        className="cw-search-box" 
                        style={{ width: '100%', resize: 'vertical' }}
                      />
                    </div>
                  </div>

                  {/* Storefront Visual Appearance & Cover Theme */}
                  <div className="cw-card">
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 14, color: '#19201C' }}>Storefront Banner Theme</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
                      {[
                        { id: 'emerald-dark', label: 'Emerald Deep', bg: 'linear-gradient(135deg, #16281D 0%, #1e3a29 100%)' },
                        { id: 'minimal-slate', label: 'Studio Minimal', bg: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' },
                        { id: 'royal-blue', label: 'Royal Escrow', bg: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%)' },
                        { id: 'cyber-dark', label: 'Cyber Tech', bg: 'linear-gradient(135deg, #18191E 0%, #2A2B32 100%)' }
                      ].map(theme => (
                        <div 
                          key={theme.id}
                          onClick={() => {
                            setCreator({ ...creator, coverPattern: theme.id });
                            onShowToast(`Storefront theme set to ${theme.label}`);
                          }}
                          style={{
                            padding: '12px 10px',
                            borderRadius: 10,
                            background: theme.bg,
                            color: '#FFFFFF',
                            textAlign: 'center',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            border: creator.coverPattern === theme.id ? '2px solid #5EEAD4' : '2px solid transparent',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                          }}
                        >
                          {theme.label} {creator.coverPattern === theme.id && '✓'}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Connected Social Channels & Followers */}
                  <div className="cw-card">
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 14, color: '#19201C' }}>Social Channels & Audience</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E' }}>YouTube Channel URL / Handle</label>
                          <button
                            type="button"
                            onClick={() => handleSyncApi('youtube')}
                            disabled={syncingApi === 'youtube'}
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background: '#EF4444',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: 4,
                              padding: '2px 8px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                            title="Verify and fetch live subscriber count via Google YouTube Data API v3"
                          >
                            <RefreshCw size={10} className={syncingApi === 'youtube' ? 'spin' : ''} />
                            {syncingApi === 'youtube' ? 'Syncing...' : '🔴 Sync YouTube API'}
                          </button>
                        </div>
                        <input 
                          type="text" 
                          placeholder="https://youtube.com/@handle or @MrBeast"
                          value={creator.socialLinks.find(s => s.platform === 'youtube')?.url || ''}
                          onChange={(e) => {
                            const newLinks = [...creator.socialLinks];
                            const idx = newLinks.findIndex(s => s.platform === 'youtube');
                            if (idx >= 0) newLinks[idx].url = e.target.value;
                            else newLinks.push({ platform: 'youtube', name: 'YouTube', handle: e.target.value, url: e.target.value, followers: 45000, verified: true });
                            setCreator({ ...creator, socialLinks: newLinks });
                          }}
                          className="cw-search-box"
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>YouTube Subscribers</label>
                        <input 
                          type="number" 
                          value={creator.socialLinks.find(s => s.platform === 'youtube')?.followers || 45000}
                          onChange={(e) => {
                            const newLinks = [...creator.socialLinks];
                            const idx = newLinks.findIndex(s => s.platform === 'youtube');
                            if (idx >= 0) newLinks[idx].followers = Number(e.target.value);
                            setCreator({ ...creator, socialLinks: newLinks });
                          }}
                          className="cw-search-box"
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>Instagram Handle</label>
                        <input 
                          type="text" 
                          placeholder="@instagram_handle"
                          value={creator.socialLinks.find(s => s.platform === 'instagram')?.handle || ''}
                          onChange={(e) => {
                            const newLinks = [...creator.socialLinks];
                            const idx = newLinks.findIndex(s => s.platform === 'instagram');
                            if (idx >= 0) newLinks[idx].handle = e.target.value;
                            else newLinks.push({ platform: 'instagram', name: 'Instagram', handle: e.target.value, url: `https://instagram.com/${e.target.value}`, followers: 35000, verified: true });
                            setCreator({ ...creator, socialLinks: newLinks });
                          }}
                          className="cw-search-box"
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>Instagram Followers</label>
                        <input 
                          type="number" 
                          value={creator.socialLinks.find(s => s.platform === 'instagram')?.followers || 35000}
                          onChange={(e) => {
                            const newLinks = [...creator.socialLinks];
                            const idx = newLinks.findIndex(s => s.platform === 'instagram');
                            if (idx >= 0) newLinks[idx].followers = Number(e.target.value);
                            setCreator({ ...creator, socialLinks: newLinks });
                          }}
                          className="cw-search-box"
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Niches & Specializations */}
                  <div className="cw-card">
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 14, color: '#19201C' }}>Niches & Content Topics</h3>
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 6 }}>Primary Category Niche</label>
                      <select 
                        value={creator.primaryNiche}
                        onChange={(e) => setCreator({ ...creator, primaryNiche: e.target.value })}
                        className="cw-search-box"
                        style={{ width: '100%' }}
                      >
                        <option value="Tech & Developer Tools">Tech & Developer Tools</option>
                        <option value="AI Software & Productivity">AI Software & Productivity</option>
                        <option value="Consumer Tech & Desk Setup">Consumer Tech & Desk Setup</option>
                        <option value="Education & Online Learning">Education & Online Learning</option>
                        <option value="Finance & SaaS">Finance & SaaS</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 6 }}>Sub-Niche Tags</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                        {creator.subNiches.map((sn, idx) => (
                          <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FAF9F5', border: '1px solid #E5E8E4', padding: '4px 10px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 600, color: '#16281D' }}>
                            <span>{sn}</span>
                            <button 
                              type="button" 
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#828E86', padding: 0 }}
                              onClick={() => setCreator({ ...creator, subNiches: creator.subNiches.filter((_, i) => i !== idx) })}
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input 
                          type="text" 
                          placeholder="Add topic (e.g. Next.js, Cloud Dev)"
                          value={newSubNicheInput}
                          onChange={(e) => setNewSubNicheInput(e.target.value)}
                          className="cw-search-box"
                          style={{ flex: 1 }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (newSubNicheInput.trim()) {
                                setCreator({ ...creator, subNiches: [...creator.subNiches, newSubNicheInput.trim()] });
                                setNewSubNicheInput('');
                              }
                            }
                          }}
                        />
                        <button 
                          type="button" 
                          className="cw-btn cw-btn-secondary"
                          onClick={() => {
                            if (newSubNicheInput.trim()) {
                              setCreator({ ...creator, subNiches: [...creator.subNiches, newSubNicheInput.trim()] });
                              setNewSubNicheInput('');
                            }
                          }}
                        >
                          <Plus size={14} />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Storefront Custom FAQs Manager */}
                  <div className="cw-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#19201C' }}>Storefront FAQ Accordion</h3>
                      <button 
                        type="button" 
                        className="cw-btn cw-btn-secondary cw-btn-sm"
                        onClick={() => {
                          const newFaq = {
                            id: `faq-${Date.now()}`,
                            question: 'What is your standard review policy?',
                            answer: 'All projects include 2 complimentary revision rounds to ensure your brand requirements are fully satisfied.',
                            category: 'deliverables' as const
                          };
                          setCreator({ ...creator, faqs: [...creator.faqs, newFaq] });
                          onShowToast('Added new FAQ item to storefront.');
                        }}
                      >
                        <Plus size={13} />
                        <span>Add FAQ</span>
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {creator.faqs.map((faq, fIdx) => (
                        <div key={faq.id || fIdx} style={{ padding: 12, borderRadius: 8, background: '#FAF9F5', border: '1px solid #E5E8E4' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <input 
                              type="text" 
                              value={faq.question}
                              onChange={(e) => {
                                const updatedFaqs = [...creator.faqs];
                                updatedFaqs[fIdx].question = e.target.value;
                                setCreator({ ...creator, faqs: updatedFaqs });
                              }}
                              className="cw-search-box"
                              style={{ width: '85%', fontWeight: 700, fontSize: '0.85rem' }}
                            />
                            <button 
                              type="button" 
                              style={{ border: 'none', background: 'none', color: '#DC2626', cursor: 'pointer' }}
                              onClick={() => {
                                setCreator({ ...creator, faqs: creator.faqs.filter((_, i) => i !== fIdx) });
                              }}
                              title="Delete FAQ"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <textarea 
                            rows={2}
                            value={faq.answer}
                            onChange={(e) => {
                              const updatedFaqs = [...creator.faqs];
                              updatedFaqs[fIdx].answer = e.target.value;
                              setCreator({ ...creator, faqs: updatedFaqs });
                            }}
                            className="cw-search-box"
                            style={{ width: '100%', fontSize: '0.8rem', resize: 'vertical' }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Location & Languages */}
                  <div className="cw-card">
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 14, color: '#19201C' }}>Location & Language Demographics</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 6 }}>City</label>
                        <input 
                          type="text" 
                          value={creator.location.city} 
                          onChange={(e) => setCreator({ ...creator, location: { ...creator.location, city: e.target.value } })}
                          className="cw-search-box" 
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 6 }}>Country</label>
                        <input 
                          type="text" 
                          value={creator.location.country} 
                          onChange={(e) => setCreator({ ...creator, location: { ...creator.location, country: e.target.value } })}
                          className="cw-search-box" 
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 6 }}>Languages (comma-separated)</label>
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

                {/* Right Column: Verification & Tier Status */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div className="cw-card">
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12, color: '#19201C' }}>Verified Status</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: '#16281D', borderRadius: 10, marginBottom: 12 }}>
                      <ShieldCheck size={20} color="#86EFAC" />
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#FFFFFF' }}>Identity & API Verified</div>
                        <div style={{ fontSize: '0.74rem', color: '#D1DDD6' }}>Official YouTube & Meta Graph Sync</div>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#59655E', lineHeight: 1.45, margin: 0 }}>
                      Verified badge signals 100% authenticity to brand media buyers and unlocks direct escrow bookings.
                    </p>
                  </div>

                  <div className="cw-card">
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12, color: '#19201C' }}>Reputation Tier</h3>
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
                        Top 1% reputation score calculated from verified brand collaborations, client ratings, and on-time delivery.
                      </p>
                      <span style={{ fontSize: '0.74rem', color: '#C29C5B', fontWeight: 700 }}>
                        View tier criteria & perks →
                      </span>
                    </div>
                  </div>

                  {/* Live Storefront Preview Card (Real-Time Dynamic) */}
                  <div className="cw-creator-card-preview">
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
                            <Crown size={12} color="#4ADE80" />
                            <span>Elite Creator · Top 1%</span>
                          </div>
                          <div className="cw-card-price-chip">
                            <span className="cw-price-chip-lbl">Starts at</span>
                            <span className="cw-price-chip-val">{formatMoney(8500)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="cw-creator-identity-block">
                        <div className="cw-creator-name-line">
                          <h3 className="cw-creator-card-name">{creator.fullName}</h3>
                          <span className="cw-verified-chip">
                            <Check size={11} />
                            <span>Verified</span>
                          </span>
                        </div>
                        <span className="cw-creator-card-handle">{creator.handle}</span>
                      </div>

                      <p className="cw-creator-card-bio">"{creator.bio}"</p>

                      <div className="cw-card-tags-row">
                        {creator.subNiches.slice(0, 4).map((niche, i) => (
                          <span key={i} className="cw-card-niche-pill">{niche}</span>
                        ))}
                      </div>

                      <div className="cw-card-metrics-grid">
                        <div className="cw-card-metric-cell">
                          <div className="cw-metric-cell-top">
                            <Star size={12} color="#166534" fill="#166534" />
                            <span className="cw-metric-cell-val">{creator.overallRating || 4.9}</span>
                          </div>
                          <span className="cw-metric-cell-lbl">{creator.totalReviews || 24} Reviews</span>
                          <span className="cw-metric-cell-sub">100% 5-Star</span>
                        </div>

                        <div className="cw-card-metric-cell">
                          <div className="cw-metric-cell-top">
                            <CheckCircle2 size={12} color="#166534" />
                            <span className="cw-metric-cell-val">24</span>
                          </div>
                          <span className="cw-metric-cell-lbl">Collabs Done</span>
                          <span className="cw-metric-cell-sub">100% On-Time</span>
                        </div>

                        <div className="cw-card-metric-cell">
                          <div className="cw-metric-cell-top">
                            <TrendingUp size={12} color="#166534" />
                            <span className="cw-metric-cell-val">{creator.metrics.engagementRate}%</span>
                          </div>
                          <span className="cw-metric-cell-lbl">Engagement</span>
                          <span className="cw-metric-cell-sub">↗ 3.2x Top Avg</span>
                        </div>
                      </div>

                      <button 
                        type="button" 
                        className="cw-storefront-cta-btn"
                        onClick={onViewPublicProfile}
                      >
                        <span>Preview Full Storefront</span>
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 3: CONTENT & PORTFOLIO
              ================================================================= */}
          {activeTab === 'portfolio' && (
            <div className="cw-subview">
              <div className="cw-section-header">
                <div>
                  <h1 className="cw-welcome-greeting" style={{ fontSize: '1.5rem' }}>Content & Portfolio</h1>
                  <p className="cw-welcome-subtitle">
                    Showcase past brand integrations, UGC campaigns, and high-performing sponsored videos.
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

              {/* Format Filters & Search Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginTop: 20, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['all', 'YouTube Integration', 'Sponsored Reel', 'Dedicated Tech Review'].map(fmt => (
                    <button
                      key={fmt}
                      type="button"
                      className={`cw-btn cw-btn-sm ${portfolioFormatFilter === fmt ? 'cw-btn-primary' : 'cw-btn-secondary'}`}
                      onClick={() => setPortfolioFormatFilter(fmt)}
                    >
                      {fmt === 'all' ? 'All Formats' : fmt}
                    </button>
                  ))}
                </div>

                <div className="cw-search-wrapper" style={{ width: 280 }}>
                  <Search size={14} className="cw-search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search past campaigns..." 
                    value={portfolioSearch}
                    onChange={(e) => setPortfolioSearch(e.target.value)}
                    className="cw-search-box"
                    style={{ width: '100%', padding: '6px 12px 6px 32px', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              {/* Portfolio Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20, marginTop: 20 }}>
                {(() => {
                  const visiblePortfolio = (creator.portfolio || [])
                    .filter(item => portfolioFormatFilter === 'all' || item.format === portfolioFormatFilter)
                    .filter(item => !portfolioSearch || item.title.toLowerCase().includes(portfolioSearch.toLowerCase()) || item.brandClient.toLowerCase().includes(portfolioSearch.toLowerCase()));

                  if (visiblePortfolio.length === 0) {
                    return (
                      <div style={{
                        gridColumn: '1 / -1',
                        background: '#FAF9F5',
                        border: '1.5px dashed #D1DDD6',
                        borderRadius: 14,
                        padding: '48px 24px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 12
                      }}>
                        <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#EDF5F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Film size={24} color="#15803D" />
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#19201C' }}>No portfolio case studies added yet</h3>
                        <p style={{ fontSize: '0.85rem', color: '#59655E', maxWidth: 420, margin: 0, lineHeight: 1.5 }}>
                          Add your past brand integrations, sponsored videos, and UGC highlights to demonstrate conversion power to prospective sponsors.
                        </p>
                        <button 
                          type="button" 
                          className="cw-btn cw-btn-primary cw-btn-sm"
                          style={{ marginTop: 8 }}
                          onClick={() => setAddPortfolioModalOpen(true)}
                        >
                          <Plus size={14} />
                          <span>Add First Portfolio Item</span>
                        </button>
                      </div>
                    );
                  }

                  return visiblePortfolio.map(item => (
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
                          background: 'rgba(22, 40, 29, 0.9)',
                          color: '#FFFFFF',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 4
                        }}>
                          {item.format}
                        </span>
                      </div>

                      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                          <span style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 700 }}>
                            Client: {item.brandClient}
                          </span>
                          <span style={{ fontSize: '0.74rem', color: '#828E86' }}>{item.publishedDate}</span>
                        </div>

                        <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#19201C', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                          {item.title}
                        </h3>

                        <p style={{ fontSize: '0.82rem', color: '#59655E', margin: '0 0 14px 0', lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
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
                          <span style={{ color: '#166534', fontWeight: 700 }}>Audited</span>
                        </div>

                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <a 
                            href={item.originalUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{ fontSize: '0.8rem', color: '#16281D', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}
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
                            <Trash2 size={12} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 4: SERVICES & PRICING
              ================================================================= */}
          {activeTab === 'services' && (
            <div className="cw-subview">
              <div className="cw-section-header">
                <div>
                  <h1 className="cw-welcome-greeting" style={{ fontSize: '1.5rem' }}>Services & Pricing</h1>
                  <p className="cw-welcome-subtitle">
                    Manage fixed packages, standard deliverables, rush fees, and commercial advertising rights.
                  </p>
                </div>
                <button 
                  type="button" 
                  className="cw-btn cw-btn-primary"
                  onClick={() => {
                    setEditingPackage(null);
                    setPkgTitle('');
                    setPkgPrice(15000);
                    setPkgDays(5);
                    setPkgPlatform('YouTube');
                    setPkgTagline('');
                    setPkgDeliverablesText('1 Dedicated high-energy video segment\n1 Round of script review\nPinned trackable discount link');
                    setAddServiceModalOpen(true);
                  }}
                >
                  <Plus size={15} />
                  <span>Create New Service</span>
                </button>
              </div>

              {/* Platform Filter Pills */}
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                {['all', 'YouTube', 'Instagram', 'Multi-Platform'].map(plat => (
                  <button
                    key={plat}
                    type="button"
                    className={`cw-btn cw-btn-sm ${servicePlatformFilter === plat ? 'cw-btn-primary' : 'cw-btn-secondary'}`}
                    onClick={() => setServicePlatformFilter(plat)}
                  >
                    {plat === 'all' ? 'All Packages' : plat}
                  </button>
                ))}
              </div>

              {/* Packages Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20, marginTop: 20 }}>
                {(() => {
                  const visiblePackages = (creator.packages || [])
                    .filter(pkg => servicePlatformFilter === 'all' || pkg.platform.toLowerCase().includes(servicePlatformFilter.toLowerCase()));

                  if (visiblePackages.length === 0) {
                    return (
                      <div style={{
                        gridColumn: '1 / -1',
                        background: '#FAF9F5',
                        border: '1.5px dashed #D1DDD6',
                        borderRadius: 14,
                        padding: '48px 24px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 12
                      }}>
                        <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#EDF5F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Tag size={24} color="#15803D" />
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#19201C' }}>No packages published yet</h3>
                        <p style={{ fontSize: '0.85rem', color: '#59655E', maxWidth: 420, margin: 0, lineHeight: 1.5 }}>
                          Define fixed collaboration packages (pricing, turnaround time, revisions) to allow brands to book you instantly with milestone escrow.
                        </p>
                        <button 
                          type="button" 
                          className="cw-btn cw-btn-primary cw-btn-sm"
                          style={{ marginTop: 8 }}
                          onClick={() => {
                            setEditingPackage(null);
                            setPkgTitle('');
                            setPkgPrice(15000);
                            setPkgDays(5);
                            setPkgPlatform('YouTube');
                            setPkgTagline('');
                            setPkgDeliverablesText('1 Dedicated high-energy video segment\n1 Round of script review\nPinned trackable discount link');
                            setAddServiceModalOpen(true);
                          }}
                        >
                          <Plus size={14} />
                          <span>Create First Package</span>
                        </button>
                      </div>
                    );
                  }

                  return visiblePackages.map(pkg => (
                    <div key={pkg.id} className="cw-card" style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div>
                          <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#828E86', fontWeight: 700 }}>
                            {pkg.platform}
                          </span>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '2px 0 0 0', color: '#19201C' }}>
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

                      <p style={{ fontSize: '0.84rem', color: '#59655E', lineHeight: 1.45, margin: '0 0 16px 0' }}>
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
                        <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: '#828E86', display: 'block', marginBottom: 8 }}>
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
                          onClick={() => {
                            const copyPkg = { ...pkg, id: `pkg-${Date.now()}`, title: `${pkg.title} (Duplicate)` };
                            setCreator({ ...creator, packages: [...creator.packages, copyPkg] });
                            onShowToast(`Duplicated package "${pkg.title}"`);
                          }}
                        >
                          Duplicate
                        </button>
                        <button 
                          type="button" 
                          className="cw-btn cw-btn-secondary cw-btn-sm"
                          onClick={() => {
                            setEditingPackage(pkg);
                            setPkgTitle(pkg.title);
                            setPkgPrice(pkg.priceInINR);
                            setPkgDays(pkg.deliveryDays);
                            setPkgPlatform(pkg.platform);
                            setPkgTagline(pkg.tagline);
                            setPkgDeliverablesText(pkg.deliverables.join('\n'));
                            setAddServiceModalOpen(true);
                          }}
                        >
                          <Edit2 size={12} />
                          <span>Edit</span>
                        </button>
                        <button 
                          type="button" 
                          className="cw-btn cw-btn-secondary cw-btn-sm"
                          style={{ color: '#DC2626' }}
                          onClick={() => {
                            setCreator({
                              ...creator,
                              packages: creator.packages.filter(p => p.id !== pkg.id)
                            });
                            onShowToast(`Deleted package: "${pkg.title}"`);
                          }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 5: COLLABORATION REQUESTS
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

              {/* Status Filter Pills */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginTop: 20, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[
                    { id: 'all', label: `All (${collaborationRequests.length})` },
                    { id: 'new', label: `Pending (${collaborationRequests.filter(r => r.status === 'new').length})` },
                    { id: 'in_discussion', label: `In Discussion (${collaborationRequests.filter(r => r.status === 'in_discussion').length})` },
                    { id: 'accepted', label: `Accepted (${collaborationRequests.filter(r => r.status === 'accepted').length})` },
                    { id: 'completed', label: `Completed (${collaborationRequests.filter(r => r.status === 'completed').length})` },
                    { id: 'declined', label: `Declined (${collaborationRequests.filter(r => r.status === 'declined').length})` },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      className={`cw-btn cw-btn-sm ${requestStatusFilter === tab.id ? 'cw-btn-primary' : 'cw-btn-secondary'}`}
                      onClick={() => setRequestStatusFilter(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="cw-search-wrapper" style={{ width: 280 }}>
                  <Search size={14} className="cw-search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search by brand or brief..." 
                    value={requestSearchQuery}
                    onChange={(e) => setRequestSearchQuery(e.target.value)}
                    className="cw-search-box"
                    style={{ width: '100%', padding: '6px 12px 6px 32px', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              {/* Requests List */}
              <div className="cw-requests-list" style={{ marginTop: 20 }}>
                {(() => {
                  const visibleRequests = collaborationRequests
                    .filter(req => requestStatusFilter === 'all' || req.status === requestStatusFilter)
                    .filter(req => !requestSearchQuery || req.brandName.toLowerCase().includes(requestSearchQuery.toLowerCase()) || req.serviceTitle.toLowerCase().includes(requestSearchQuery.toLowerCase()));

                  if (visibleRequests.length === 0) {
                    return (
                      <div style={{
                        background: '#FAF9F5',
                        border: '1.5px dashed #D1DDD6',
                        borderRadius: 14,
                        padding: '48px 24px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 12
                      }}>
                        <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#EDF5F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Briefcase size={24} color="#15803D" />
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#19201C' }}>
                          {requestSearchQuery || requestStatusFilter !== 'all' ? 'No matching collaboration requests' : 'No collaboration requests yet'}
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: '#59655E', maxWidth: 420, margin: 0, lineHeight: 1.5 }}>
                          Share your profile link in your bio or with brand agencies. All incoming sponsorship offers are backed by guaranteed escrow protection.
                        </p>
                        <button 
                          type="button" 
                          className="cw-btn cw-btn-primary cw-btn-sm"
                          style={{ marginTop: 8 }}
                          onClick={handleCopyProfileLink}
                        >
                          <Copy size={13} />
                          <span>Copy Public Profile Link</span>
                        </button>
                      </div>
                    );
                  }

                  return visibleRequests.map(req => (
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
                          <span className="cw-req-label">Escrow Status</span>
                          <span className="cw-req-val" style={{ color: req.escrowStatus === 'held' ? '#166534' : '#828E86' }}>
                            {req.escrowStatus === 'held' ? 'Escrow Secured' : 'Pending Funding'}
                          </span>
                        </div>
                      </div>

                      <div style={{ marginBottom: 14 }}>
                        <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#828E86', fontWeight: 700 }}>Campaign Brief:</span>
                        <p style={{ fontSize: '0.85rem', color: '#19201C', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                          {req.campaignBrief}
                        </p>
                      </div>

                      <div className="cw-request-actions">
                        {req.status === 'new' && (
                          <>
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
                          </>
                        )}

                        {req.status === 'in_discussion' && (
                          <>
                            <button 
                              type="button" 
                              className="cw-btn cw-btn-secondary cw-btn-sm"
                              onClick={() => {
                                const match = conversations.find(c => c.brandName.toLowerCase().includes(req.brandName.toLowerCase()));
                                if (match) setActiveConversationId(match.id);
                                setActiveTab('messages');
                              }}
                            >
                              <MessageSquare size={13} />
                              <span>Open Discussion Chat</span>
                            </button>
                            <button 
                              type="button" 
                              className="cw-btn cw-btn-accept cw-btn-sm"
                              onClick={() => handleAcceptRequest(req.id)}
                            >
                              <Check size={14} />
                              <span>Accept Agreed Terms</span>
                            </button>
                          </>
                        )}

                        {req.status === 'accepted' && (
                          <>
                            <button 
                              type="button" 
                              className="cw-btn cw-btn-primary cw-btn-sm"
                              onClick={() => {
                                setSelectedRequestForDetail(req);
                                setSubmitDraftModalOpen(true);
                              }}
                            >
                              <UploadCloud size={14} />
                              <span>Submit Deliverable Draft</span>
                            </button>
                            <button 
                              type="button" 
                              className="cw-btn cw-btn-secondary cw-btn-sm"
                              style={{ background: '#EDF5F0', color: '#166534', borderColor: '#166534' }}
                              onClick={() => handleMarkDealComplete(req)}
                            >
                              <CheckCircle2 size={14} />
                              <span>Complete & Release Escrow</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 6: MESSAGES & CHAT
              ================================================================= */}
          {activeTab === 'messages' && (
            <div className="cw-subview">
              <div className="cw-section-header">
                <div>
                  <h1 className="cw-welcome-greeting" style={{ fontSize: '1.5rem' }}>Brand Direct Messages</h1>
                  <p className="cw-welcome-subtitle">
                    Coordinate campaign briefs, script signoffs, and draft reviews in real time with brand sponsors.
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
                  <div style={{ padding: '12px 14px', borderBottom: '1px solid #E5E8E4' }}>
                    <input 
                      type="text" 
                      placeholder="Search messages..." 
                      value={chatSearchQuery}
                      onChange={(e) => setChatSearchQuery(e.target.value)}
                      className="cw-search-box"
                      style={{ width: '100%', fontSize: '0.8rem', padding: '6px 10px' }}
                    />
                  </div>
                  <div style={{ flex: 1, overflowY: 'auto' }}>
                    {conversations.length === 0 ? (
                      <div style={{ padding: '36px 16px', textAlign: 'center', color: '#828E86', fontSize: '0.82rem' }}>
                        No active message threads yet
                      </div>
                    ) : (
                      conversations
                        .filter(conv => !chatSearchQuery || conv.brandName.toLowerCase().includes(chatSearchQuery.toLowerCase()))
                        .map(conv => (
                          <div 
                            key={conv.id}
                            style={{
                              padding: '12px 16px',
                              borderBottom: '1px solid #E5E8E4',
                              cursor: 'pointer',
                              background: activeConversationId === conv.id ? '#FAF9F5' : '#FFFFFF',
                              borderLeft: activeConversationId === conv.id ? '3px solid #16281D' : '3px solid transparent'
                            }}
                            onClick={() => {
                              setActiveConversationId(conv.id);
                              setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unread: false } : c));
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <img 
                                  src={conv.brandAvatar} 
                                  alt={conv.brandName} 
                                  style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} 
                                />
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#19201C' }}>{conv.brandName}</span>
                              </div>
                              {conv.unread && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} />}
                            </div>
                            <span style={{ fontSize: '0.74rem', color: '#828E86' }}>{conv.campaign}</span>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* Chat window */}
                {(() => {
                  const currentConv = conversations.find(c => c.id === activeConversationId) || conversations[0];
                  if (!currentConv) {
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, padding: 32 }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#FAF9F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <MessageSquare size={22} color="#828E86" />
                        </div>
                        <h4 style={{ margin: 0, fontSize: '1rem', color: '#19201C', fontWeight: 700 }}>No brand messages yet</h4>
                        <p style={{ margin: 0, fontSize: '0.82rem', color: '#828E86', maxWidth: 320, textAlign: 'center', lineHeight: 1.5 }}>
                          Direct communications, brief revisions, and sponsor inquiries will appear here in real time.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <div style={{ padding: '14px 20px', borderBottom: '1px solid #E5E8E4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#19201C' }}>{currentConv.brandName}</div>
                          <span style={{ fontSize: '0.75rem', color: '#59655E' }}>{currentConv.contactPerson} • {currentConv.campaign}</span>
                        </div>
                        <span style={{ fontSize: '0.74rem', background: '#16281D', color: '#86EFAC', padding: '4px 10px', borderRadius: 999, fontWeight: 700 }}>
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

                      {/* Quick Suggestion Chips */}
                      <div style={{ padding: '8px 20px', borderTop: '1px solid #E5E8E4', display: 'flex', gap: 8, overflowX: 'auto', background: '#FAF9F5' }}>
                        {[
                          'Here is the deliverable draft link for review 🎥',
                          'When should we schedule the live posting date?',
                          'Confirmed! Adding this to our shooting schedule.',
                          'Can you review the script outline?'
                        ].map((chip, i) => (
                          <button
                            key={i}
                            type="button"
                            style={{ whiteSpace: 'nowrap', fontSize: '0.75rem', padding: '4px 10px', borderRadius: 999, background: '#FFFFFF', border: '1px solid #E5E8E4', cursor: 'pointer', color: '#59655E' }}
                            onClick={() => setChatReplyText(chip)}
                          >
                            {chip}
                          </button>
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
              TAB 7: AVAILABILITY & CALENDAR
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
                <button 
                  type="button" 
                  className="cw-btn cw-btn-primary"
                  onClick={() => setAddEventModalOpen(true)}
                >
                  <Plus size={15} />
                  <span>Add Milestone / Event</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, marginTop: 20 }}>
                {/* Calendar View Card */}
                <div className="cw-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#19201C' }}>
                      {calendarMonth === 'october' ? 'October 2026' : 'November 2026'}
                    </h3>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button 
                        type="button" 
                        className={`cw-btn cw-btn-sm ${calendarMonth === 'october' ? 'cw-btn-primary' : 'cw-btn-secondary'}`}
                        onClick={() => setCalendarMonth('october')}
                      >
                        October
                      </button>
                      <button 
                        type="button" 
                        className={`cw-btn cw-btn-sm ${calendarMonth === 'november' ? 'cw-btn-primary' : 'cw-btn-secondary'}`}
                        onClick={() => setCalendarMonth('november')}
                      >
                        November
                      </button>
                    </div>
                  </div>

                  {/* 7-Day Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, textAlign: 'center', marginBottom: 8, fontSize: '0.75rem', fontWeight: 700, color: '#828E86' }}>
                    <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
                    {Array.from({ length: 31 }, (_, i) => {
                      const dayNum = i + 1;
                      const dateStr = `2026-${calendarMonth === 'october' ? '10' : '11'}-${dayNum < 10 ? '0' + dayNum : dayNum}`;
                      const eventsForDay = calendarEvents.filter(e => e.date === dateStr);
                      const isSelected = selectedCalendarDate === dateStr;

                      return (
                        <div 
                          key={dayNum}
                          onClick={() => setSelectedCalendarDate(dateStr)}
                          style={{
                            minHeight: 64,
                            padding: '6px 4px',
                            background: isSelected ? '#EDF5F0' : '#FFFFFF',
                            border: isSelected ? '2px solid #16281D' : '1px solid #E5E8E4',
                            borderRadius: 8,
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span style={{ fontSize: '0.8rem', fontWeight: isSelected ? 800 : 600, color: isSelected ? '#16281D' : '#59655E' }}>
                            {dayNum}
                          </span>
                          {eventsForDay.map(ev => (
                            <span 
                              key={ev.id} 
                              style={{
                                width: '90%',
                                fontSize: '0.65rem',
                                padding: '2px 4px',
                                borderRadius: 4,
                                marginTop: 4,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                background: ev.type === 'shooting' ? '#FEF3C7' : ev.type === 'publish' ? '#EDF5F0' : ev.type === 'blackout' ? '#FEE2E2' : '#E0F2FE',
                                color: ev.type === 'shooting' ? '#B45309' : ev.type === 'publish' ? '#15803D' : ev.type === 'blackout' ? '#B91C1C' : '#0369A1',
                                fontWeight: 700
                              }}
                              title={`${ev.title} (${ev.brand})`}
                            >
                              {ev.title}
                            </span>
                          ))}
                        </div>
                      );
                    })}
                  </div>

                  {/* Selected Day Schedule Details */}
                  <div style={{ marginTop: 20, padding: 14, background: '#FAF9F5', borderRadius: 10, border: '1px solid #E5E8E4' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#19201C', marginBottom: 8 }}>
                      Schedule for {selectedCalendarDate}:
                    </div>
                    {calendarEvents.filter(e => e.date === selectedCalendarDate).length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {calendarEvents.filter(e => e.date === selectedCalendarDate).map(ev => (
                          <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#FFFFFF', borderRadius: 8, border: '1px solid #E5E8E4' }}>
                            <div>
                              <strong style={{ fontSize: '0.86rem', color: '#19201C' }}>{ev.title}</strong>
                              <span style={{ fontSize: '0.76rem', color: '#828E86', display: 'block' }}>Brand: {ev.brand} • Type: {ev.type}</span>
                            </div>
                            <span style={{ fontSize: '0.74rem', background: '#EDF5F0', color: '#166534', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>
                              {ev.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.82rem', color: '#828E86' }}>No scheduled shoots or deadlines on this date. Open for bookings!</span>
                    )}
                  </div>
                </div>

                {/* Availability Settings Card */}
                <div className="cw-card">
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 14, color: '#19201C' }}>Availability Settings</h3>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 6 }}>Current Booking Status</label>
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
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 6 }}>Expected Response Time</label>
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

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 6 }}>Active Deals Capacity</label>
                    <input 
                      type="text" 
                      defaultValue="3 Concurrent Brand Deals"
                      className="cw-search-box"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <button 
                    type="button" 
                    className="cw-btn cw-btn-primary" 
                    style={{ width: '100%', marginTop: 8 }}
                    onClick={() => onShowToast('Availability & calendar settings saved successfully!')}
                  >
                    Save Availability Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 8: EARNINGS
              ================================================================= */}
          {activeTab === 'earnings' && (
            <div className="cw-subview">
              <div className="cw-section-header">
                <div>
                  <h1 className="cw-welcome-greeting" style={{ fontSize: '1.5rem' }}>Earnings & Payouts</h1>
                  <p className="cw-welcome-subtitle">
                    Track completed campaigns, held escrow balances, and instant withdrawal payouts.
                  </p>
                </div>
                <button 
                  type="button" 
                  className="cw-btn cw-btn-primary"
                  onClick={() => setPayoutModalOpen(true)}
                >
                  <Wallet size={15} />
                  <span>Request Payout / Withdraw</span>
                </button>
              </div>

              {/* Top Financial Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 20, marginBottom: 24 }}>
                <div className="cw-card">
                  <span style={{ fontSize: '0.74rem', color: '#828E86', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Lifetime Earned</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16281D', marginTop: 4 }}>
                    {formatMoney(lifetimeEarnedINR)}
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#166534', marginTop: 4, display: 'block', fontWeight: 600 }}>
                    {collaborationRequests.filter(r => r.status === 'completed').length} completed collaborations
                  </span>
                </div>

                <div className="cw-card" style={{ border: '1.5px solid #166534' }}>
                  <span style={{ fontSize: '0.74rem', color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>Available for Payout</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#166534', marginTop: 4 }}>
                    {formatMoney(availablePayoutINR)}
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#166534', marginTop: 4, display: 'block' }}>Instant transfer ready</span>
                </div>

                <div className="cw-card">
                  <span style={{ fontSize: '0.74rem', color: '#828E86', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Held in Escrow</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0369A1', marginTop: 4 }}>
                    {formatMoney(escrowHeldINR)}
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#59655E', marginTop: 4, display: 'block' }}>Releases upon brand signoff</span>
                </div>

                <div className="cw-card">
                  <span style={{ fontSize: '0.74rem', color: '#828E86', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Pending Proposals</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#C29C5B', marginTop: 4 }}>
                    {formatMoney(collaborationRequests.filter(r => r.status === 'new' || r.status === 'in_discussion').reduce((sum, r) => sum + (r.budgetINR || 0), 0))}
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#59655E', marginTop: 4, display: 'block' }}>
                    {collaborationRequests.filter(r => r.status === 'new').length} brand proposals pending
                  </span>
                </div>
              </div>

              {/* Transactions Table Card */}
              <div className="cw-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#19201C' }}>Transaction & Payout History</h3>
                  <button 
                    type="button" 
                    className="cw-btn cw-btn-secondary cw-btn-sm"
                    onClick={() => onShowToast('Exported annual tax summary CSV.')}
                  >
                    <Download size={13} />
                    <span>Export Tax Statement</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {payoutTransactions.length === 0 ? (
                    <div style={{ padding: '36px 16px', textAlign: 'center', color: '#828E86', fontSize: '0.85rem' }}>
                      <Wallet size={28} color="#D1DDD6" style={{ margin: '0 auto 8px', display: 'block' }} />
                      No payout transaction records yet. As deliverables get approved and escrow funds clear, your receipts will be tracked here.
                    </div>
                  ) : (
                    payoutTransactions.map(tx => (
                      <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#FAF9F5', borderRadius: 10, border: '1px solid #E5E8E4' }}>
                        <div>
                          <strong style={{ fontSize: '0.88rem', color: '#19201C' }}>{tx.brandOrTarget}</strong>
                          <span style={{ fontSize: '0.76rem', color: '#828E86', display: 'block' }}>{tx.description} • {tx.date} • Ref: {tx.invoiceRef}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <span style={{
                            fontSize: '0.98rem',
                            fontWeight: 800,
                            color: tx.type === 'withdrawal' ? '#DC2626' : '#166534'
                          }}>
                            {tx.type === 'withdrawal' ? '-' : '+'}{formatMoney(tx.amountINR)}
                          </span>
                          <span style={{ fontSize: '0.74rem', background: '#EDF5F0', color: '#166534', padding: '3px 10px', borderRadius: 999, fontWeight: 700 }}>
                            {tx.status}
                          </span>
                          <button 
                            type="button" 
                            className="cw-btn cw-btn-secondary cw-btn-sm"
                            onClick={() => onShowToast(`Downloaded PDF Receipt (${tx.invoiceRef})`)}
                          >
                            <Download size={12} />
                            <span>PDF</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 9: PERFORMANCE
              ================================================================= */}
          {activeTab === 'performance' && (
            <div className="cw-subview">
              <div className="cw-section-header">
                <div>
                  <h1 className="cw-welcome-greeting" style={{ fontSize: '1.5rem' }}>Creator Performance & Audience</h1>
                  <p className="cw-welcome-subtitle">
                    Verified engagement statistics and official API sync connections.
                  </p>
                </div>
              </div>

              {/* 4 Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 20, marginBottom: 24 }}>
                <div className="cw-card">
                  <span style={{ fontSize: '0.72rem', color: '#828E86', textTransform: 'uppercase', fontWeight: 600 }}>Profile Views</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16281D', marginTop: 4 }}>1,420</div>
                  <span style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 600 }}>+18% this month</span>
                </div>
                <div className="cw-card">
                  <span style={{ fontSize: '0.72rem', color: '#828E86', textTransform: 'uppercase', fontWeight: 600 }}>Conversion Rate</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16281D', marginTop: 4 }}>18.4%</div>
                  <span style={{ fontSize: '0.72rem', color: '#59655E' }}>Inquiries to bookings</span>
                </div>
                <div className="cw-card">
                  <span style={{ fontSize: '0.72rem', color: '#828E86', textTransform: 'uppercase', fontWeight: 600 }}>Avg Delivery Time</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16281D', marginTop: 4 }}>4.8 Days</div>
                  <span style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 600 }}>100% on time delivery</span>
                </div>
                <div className="cw-card">
                  <span style={{ fontSize: '0.72rem', color: '#828E86', textTransform: 'uppercase', fontWeight: 600 }}>Total Audience Reach</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16281D', marginTop: 4 }}>85,000</div>
                  <span style={{ fontSize: '0.72rem', color: '#59655E' }}>Audited Social Followers</span>
                </div>
              </div>

              {/* Platform Reach Cards & API Sync */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
                <div className="cw-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <strong style={{ fontSize: '1rem', color: '#19201C' }}>YouTube Channel</strong>
                    <span style={{ fontSize: '0.74rem', background: '#EDF5F0', color: '#166534', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>
                      {creator.verificationSource?.includes('YouTube') ? '✓ Live API Verified' : 'Connected'}
                    </span>
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#16281D' }}>
                    {(creator.socialLinks.find(s => s.platform === 'youtube')?.followers || creator.metrics.platformFollowers?.youtube || 52000).toLocaleString('en-IN')} Subs
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#59655E', display: 'block', marginTop: 2 }}>
                    Avg {(creator.metrics.averageViews ? (creator.metrics.averageViews > 1000 ? `${(creator.metrics.averageViews / 1000).toFixed(1)}K` : creator.metrics.averageViews) : '14.2K')} views • {creator.metrics.engagementRate || 5.2}% engagement
                  </span>
                  <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid #E5E8E4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.74rem', color: '#828E86' }}>{apiSyncState.youtube}</span>
                    <button 
                      type="button" 
                      className="cw-btn cw-btn-secondary cw-btn-sm"
                      onClick={() => handleSyncApi('youtube')}
                      disabled={syncingApi === 'youtube'}
                    >
                      <RefreshCw size={12} className={syncingApi === 'youtube' ? 'spin' : ''} />
                      <span>{syncingApi === 'youtube' ? 'Syncing...' : 'Sync Now'}</span>
                    </button>
                  </div>
                </div>

                <div className="cw-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <strong style={{ fontSize: '1rem', color: '#19201C' }}>Instagram Profile</strong>
                    <span style={{ fontSize: '0.74rem', background: '#EDF5F0', color: '#166534', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>Connected</span>
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#16281D' }}>28,000 Followers</div>
                  <span style={{ fontSize: '0.78rem', color: '#59655E', display: 'block', marginTop: 2 }}>Avg 38.5K views • 4.8% engagement</span>
                  <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid #E5E8E4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.74rem', color: '#828E86' }}>{apiSyncState.meta}</span>
                    <button 
                      type="button" 
                      className="cw-btn cw-btn-secondary cw-btn-sm"
                      onClick={() => handleSyncApi('meta')}
                      disabled={syncingApi === 'meta'}
                    >
                      <RefreshCw size={12} className={syncingApi === 'meta' ? 'spin' : ''} />
                      <span>{syncingApi === 'meta' ? 'Syncing...' : 'Sync Now'}</span>
                    </button>
                  </div>
                </div>

                <div className="cw-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <strong style={{ fontSize: '1rem', color: '#19201C' }}>LinkedIn Presence</strong>
                    <span style={{ fontSize: '0.74rem', background: '#EDF5F0', color: '#166534', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>Connected</span>
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#16281D' }}>5,000 Followers</div>
                  <span style={{ fontSize: '0.78rem', color: '#59655E', display: 'block', marginTop: 2 }}>High developer & founder demographic</span>
                  <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid #E5E8E4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.74rem', color: '#828E86' }}>{apiSyncState.linkedin}</span>
                    <button 
                      type="button" 
                      className="cw-btn cw-btn-secondary cw-btn-sm"
                      onClick={() => handleSyncApi('linkedin')}
                      disabled={syncingApi === 'linkedin'}
                    >
                      <RefreshCw size={12} className={syncingApi === 'linkedin' ? 'spin' : ''} />
                      <span>{syncingApi === 'linkedin' ? 'Syncing...' : 'Sync Now'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Demographics Visualization */}
              <div className="cw-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 14, color: '#19201C' }}>Audited Demographics (Developer & Tech Audience)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#59655E', display: 'block', marginBottom: 10 }}>Age Distribution</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[
                        { label: '25 – 34 years', pct: 46 },
                        { label: '18 – 24 years', pct: 38 },
                        { label: '35 – 44 years', pct: 12 },
                        { label: '45+ years', pct: 4 },
                      ].map(bar => (
                        <div key={bar.label}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: 3 }}>
                            <span>{bar.label}</span>
                            <strong>{bar.pct}%</strong>
                          </div>
                          <div style={{ width: '100%', height: 6, background: '#FAF9F5', borderRadius: 999, overflow: 'hidden', border: '1px solid #E5E8E4' }}>
                            <div style={{ width: `${bar.pct}%`, height: '100%', background: '#16281D', borderRadius: 999 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#59655E', display: 'block', marginBottom: 10 }}>Top Geographies</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[
                        { label: 'Bengaluru, India', pct: 32 },
                        { label: 'Mumbai, India', pct: 24 },
                        { label: 'Delhi NCR, India', pct: 18 },
                        { label: 'United States & Global', pct: 14 },
                        { label: 'Pune & Hyderabad', pct: 12 },
                      ].map(geo => (
                        <div key={geo.label}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: 3 }}>
                            <span>{geo.label}</span>
                            <strong>{geo.pct}%</strong>
                          </div>
                          <div style={{ width: '100%', height: 6, background: '#FAF9F5', borderRadius: 999, overflow: 'hidden', border: '1px solid #E5E8E4' }}>
                            <div style={{ width: `${geo.pct}%`, height: '100%', background: '#166534', borderRadius: 999 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 10: SETTINGS
              ================================================================= */}
          {activeTab === 'settings' && (
            <div className="cw-subview">
              <div className="cw-section-header">
                <div>
                  <h1 className="cw-welcome-greeting" style={{ fontSize: '1.5rem' }}>Workspace Settings</h1>
                  <p className="cw-welcome-subtitle">
                    Manage security, notification alerts, payout accounts, and reputation credentials.
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

              {/* Sub-tabs Switcher */}
              <div style={{ display: 'flex', gap: 8, marginTop: 20, borderBottom: '1px solid #E5E8E4', paddingBottom: 10 }}>
                {[
                  { id: 'account', label: 'Account & Security' },
                  { id: 'payout', label: 'Payout & Tax Details' },
                  { id: 'notifications', label: 'Notifications' },
                  { id: 'tier', label: 'Elite Tier Credentials' }
                ].map(sub => (
                  <button
                    key={sub.id}
                    type="button"
                    className={`cw-btn cw-btn-sm ${settingsSubTab === sub.id ? 'cw-btn-primary' : 'cw-btn-secondary'}`}
                    onClick={() => setSettingsSubTab(sub.id as any)}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              <div style={{ marginTop: 20, maxWidth: 680 }}>
                {settingsSubTab === 'account' && (
                  <div className="cw-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#19201C' }}>Creator Credentials</h3>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#59655E', display: 'block', marginBottom: 4 }}>Work Email</label>
                      <input type="email" defaultValue="alex@alexsharma.media" className="cw-search-box" style={{ width: '100%' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#59655E', display: 'block', marginBottom: 4 }}>Phone (SMS Deal Notifications)</label>
                      <input type="tel" defaultValue="+91 98201 49201" className="cw-search-box" style={{ width: '100%' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#FAF9F5', borderRadius: 8, border: '1px solid #E5E8E4' }}>
                      <div>
                        <strong style={{ fontSize: '0.88rem', color: '#19201C' }}>Two-Factor Authentication (2FA)</strong>
                        <span style={{ fontSize: '0.75rem', color: '#828E86', display: 'block' }}>Mandatory for direct escrow disbursements</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={twoFactorActive} 
                        onChange={(e) => {
                          setTwoFactorActive(e.target.checked);
                          onShowToast(`Two-factor authentication ${e.target.checked ? 'enabled' : 'disabled'}.`);
                        }} 
                      />
                    </div>
                  </div>
                )}

                {settingsSubTab === 'payout' && (
                  <div className="cw-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#19201C' }}>Bank Payout Details (Creatorly Escrow)</h3>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#59655E', display: 'block', marginBottom: 4 }}>Account Holder Name</label>
                      <input 
                        type="text" 
                        value={bankSettings.accountName} 
                        onChange={(e) => setBankSettings({ ...bankSettings, accountName: e.target.value })}
                        className="cw-search-box" 
                        style={{ width: '100%' }} 
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#59655E', display: 'block', marginBottom: 4 }}>Bank Name & Branch</label>
                      <input 
                        type="text" 
                        value={bankSettings.bankName} 
                        onChange={(e) => setBankSettings({ ...bankSettings, bankName: e.target.value })}
                        className="cw-search-box" 
                        style={{ width: '100%' }} 
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: '#59655E', display: 'block', marginBottom: 4 }}>Account Number</label>
                        <input 
                          type="text" 
                          value={bankSettings.accountNumber} 
                          onChange={(e) => setBankSettings({ ...bankSettings, accountNumber: e.target.value })}
                          className="cw-search-box" 
                          style={{ width: '100%' }} 
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: '#59655E', display: 'block', marginBottom: 4 }}>IFSC Code</label>
                        <input 
                          type="text" 
                          value={bankSettings.ifsc} 
                          onChange={(e) => setBankSettings({ ...bankSettings, ifsc: e.target.value })}
                          className="cw-search-box" 
                          style={{ width: '100%' }} 
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#59655E', display: 'block', marginBottom: 4 }}>UPI ID (Instant 2-hour payout)</label>
                      <input 
                        type="text" 
                        value={bankSettings.upiId} 
                        onChange={(e) => setBankSettings({ ...bankSettings, upiId: e.target.value })}
                        className="cw-search-box" 
                        style={{ width: '100%' }} 
                      />
                    </div>
                    <button 
                      type="button" 
                      className="cw-btn cw-btn-primary"
                      onClick={() => onShowToast('Bank details updated for escrow payouts!')}
                    >
                      Update Bank Account
                    </button>
                  </div>
                )}

                {settingsSubTab === 'notifications' && (
                  <div className="cw-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#19201C' }}>Notification Policies</h3>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.85rem' }}>
                      <input 
                        type="checkbox" 
                        checked={notificationPreferences.proposalEmail} 
                        onChange={(e) => setNotificationPreferences({ ...notificationPreferences, proposalEmail: e.target.checked })}
                      />
                      <span>Email me immediately when a brand submits a proposal or counteroffer</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.85rem' }}>
                      <input 
                        type="checkbox" 
                        checked={notificationPreferences.escrowAlerts} 
                        onChange={(e) => setNotificationPreferences({ ...notificationPreferences, escrowAlerts: e.target.checked })}
                      />
                      <span>Notify me when Escrow funds are held or released</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.85rem' }}>
                      <input 
                        type="checkbox" 
                        checked={notificationPreferences.whatsappUrgent} 
                        onChange={(e) => setNotificationPreferences({ ...notificationPreferences, whatsappUrgent: e.target.checked })}
                      />
                      <span>WhatsApp notifications for urgent brand deadline changes</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.85rem' }}>
                      <input 
                        type="checkbox" 
                        checked={notificationPreferences.weeklyDigest} 
                        onChange={(e) => setNotificationPreferences({ ...notificationPreferences, weeklyDigest: e.target.checked })}
                      />
                      <span>Weekly creator performance summary digest</span>
                    </label>
                  </div>
                )}

                {settingsSubTab === 'tier' && (
                  <div className="cw-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#19201C' }}>Current Tier: Elite Creator</h3>
                      <Crown size={20} color="#C29C5B" />
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#59655E', lineHeight: 1.5, margin: 0 }}>
                      You have unlocked Creatorly's highest creator tier based on your 100% on-time delivery record and 4.9★ rating.
                    </p>
                    <div style={{ padding: 12, background: '#FAF9F5', borderRadius: 8, border: '1px solid #E5E8E4', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div>✅ <strong>0% platform fees</strong> on your first 3 deals every month</div>
                      <div>✅ <strong>Top carousel placement</strong> in Brand Discover page</div>
                      <div>✅ <strong>Direct Dedicated WhatsApp manager</strong> for enterprise campaigns</div>
                    </div>
                    <button 
                      type="button" 
                      className="cw-btn cw-btn-secondary"
                      onClick={() => setTiersModalOpen(true)}
                    >
                      View All Reputation Tiers & Criteria
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ───────────────────────────────────────────────────────────────────
          MODALS & INTERACTIVE OVERLAYS
          ─────────────────────────────────────────────────────────────────── */}

      {/* 1. Request Counteroffer Modal */}
      {counterOfferModalOpen && selectedRequestForDetail && (
        <div className="cw-tiers-modal-overlay" onClick={() => setCounterOfferModalOpen(false)}>
          <div className="cw-tiers-modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div className="cw-tiers-modal-header">
              <h2 className="cw-tiers-modal-title">Counteroffer to {selectedRequestForDetail.brandName}</h2>
              <button type="button" className="cw-icon-btn" onClick={() => setCounterOfferModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>
                  Counter Budget (INR)
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
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>
                  Deliverable Scope Additions / Reason
                </label>
                <textarea 
                  rows={3}
                  placeholder="e.g. Can include 48-hour rush turnaround and 2 additional story reshares..."
                  value={counterNote}
                  onChange={(e) => setCounterNote(e.target.value)}
                  className="cw-search-box"
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
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

      {/* 2. Decline Modal */}
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
                  Reason to brand:
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

      {/* 3. Submit Deliverable Draft Modal */}
      {submitDraftModalOpen && selectedRequestForDetail && (
        <div className="cw-tiers-modal-overlay" onClick={() => setSubmitDraftModalOpen(false)}>
          <div className="cw-tiers-modal" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <div className="cw-tiers-modal-header">
              <h2 className="cw-tiers-modal-title">Submit Deliverable Draft</h2>
              <button type="button" className="cw-icon-btn" onClick={() => setSubmitDraftModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmitDraftDeliverable} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: '0.85rem', color: '#59655E', margin: 0 }}>
                Submitting review draft for <strong>{selectedRequestForDetail.brandName}</strong> ({selectedRequestForDetail.serviceTitle}).
              </p>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>
                  Video Preview URL (YouTube Unlisted / Frame.io / Google Drive) *
                </label>
                <input 
                  type="url" 
                  required
                  placeholder="https://youtu.be/... or https://drive.google.com/..."
                  value={draftUrl}
                  onChange={(e) => setDraftUrl(e.target.value)}
                  className="cw-search-box" 
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>
                  Notes for Brand Reviewer
                </label>
                <textarea 
                  rows={3}
                  placeholder="e.g. Added the sponsored CTA at 02:40, tracked coupon code displayed on screen."
                  value={draftNotes}
                  onChange={(e) => setDraftNotes(e.target.value)}
                  className="cw-search-box"
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="cw-btn cw-btn-cancel" onClick={() => setSubmitDraftModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="cw-btn cw-btn-primary">
                  Submit Draft for Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Add Portfolio Modal */}
      {addPortfolioModalOpen && (
        <div className="cw-tiers-modal-overlay" onClick={() => setAddPortfolioModalOpen(false)}>
          <div className="cw-tiers-modal" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
            <div className="cw-tiers-modal-header">
              <h2 className="cw-tiers-modal-title">Add Portfolio Work</h2>
              <button type="button" className="cw-icon-btn" onClick={() => setAddPortfolioModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const newItem: PortfolioItem = {
                id: `port-${Date.now()}`,
                title: newPortTitle || 'Developer Workflow Showcase',
                category: 'Tech & Developer Tools',
                format: newPortFormat as any,
                platform: 'youtube',
                thumbnailUrl: newPortThumb || '/images/work-ai-coding.jpg',
                publishedDate: 'Just now',
                views: Number(newPortViews) || 12000,
                engagement: Number(newPortEngagement) || 5.5,
                brandClient: newPortClient || 'TechBrand',
                campaignObjective: 'Drive organic developer adoptions',
                deliverableSummary: newPortDeliverable || '60-second integrated sponsorship segment with live code demo.',
                originalUrl: newPortUrl || 'https://youtube.com',
                verifiedMetrics: true
              };
              const updated = {
                ...creator,
                portfolio: [newItem, ...creator.portfolio]
              };
              setCreator(updated);
              onUpdateCreator?.(updated);
              onShowToast(`Added portfolio item: "${newItem.title}"`);
              setAddPortfolioModalOpen(false);
              setNewPortTitle('');
              setNewPortClient('');
              setNewPortUrl('');
              setNewPortDeliverable('');
            }} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>Campaign Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Next-Gen Developer Terminal Setup" 
                  value={newPortTitle}
                  onChange={(e) => setNewPortTitle(e.target.value)}
                  className="cw-search-box" 
                  style={{ width: '100%' }} 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>Brand Client *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Warp Terminal" 
                    value={newPortClient}
                    onChange={(e) => setNewPortClient(e.target.value)}
                    className="cw-search-box" 
                    style={{ width: '100%' }} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>Format</label>
                  <select 
                    value={newPortFormat}
                    onChange={(e) => setNewPortFormat(e.target.value)}
                    className="cw-search-box" 
                    style={{ width: '100%' }}
                  >
                    <option value="YouTube Integration">YouTube Integration</option>
                    <option value="Sponsored Reel">Sponsored Reel</option>
                    <option value="Dedicated Tech Review">Dedicated Tech Review</option>
                    <option value="Case Study">Case Study</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>Total Views</label>
                  <input 
                    type="number" 
                    value={newPortViews}
                    onChange={(e) => setNewPortViews(Number(e.target.value))}
                    className="cw-search-box" 
                    style={{ width: '100%' }} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>Engagement Rate (%)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={newPortEngagement}
                    onChange={(e) => setNewPortEngagement(Number(e.target.value))}
                    className="cw-search-box" 
                    style={{ width: '100%' }} 
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>Live Video / Post URL</label>
                <input 
                  type="url" 
                  placeholder="https://youtube.com/watch?v=..." 
                  value={newPortUrl}
                  onChange={(e) => setNewPortUrl(e.target.value)}
                  className="cw-search-box" 
                  style={{ width: '100%' }} 
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>Deliverable Summary</label>
                <textarea 
                  rows={2} 
                  placeholder="Brief description of the deliverables and client goals..." 
                  value={newPortDeliverable}
                  onChange={(e) => setNewPortDeliverable(e.target.value)}
                  className="cw-search-box" 
                  style={{ width: '100%', resize: 'vertical' }} 
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>Cover Thumbnail Image</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <label className="cw-btn cw-btn-secondary cw-btn-sm" style={{ cursor: 'pointer', margin: 0, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <UploadCloud size={14} />
                    <span>Upload Image from Device</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const url = await uploadMediaFile(file);
                            setNewPortThumb(url);
                            onShowToast('Portfolio thumbnail uploaded!');
                          } catch {
                            onShowToast('Could not process thumbnail image.');
                          }
                        }
                      }}
                    />
                  </label>
                  <span style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 600 }}>{newPortThumb ? '✓ Thumbnail loaded' : 'Using default'}</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button type="button" className="cw-btn cw-btn-cancel" onClick={() => setAddPortfolioModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="cw-btn cw-btn-primary">
                  Publish to Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Add / Edit Service Modal */}
      {addServiceModalOpen && (
        <div className="cw-tiers-modal-overlay" onClick={() => setAddServiceModalOpen(false)}>
          <div className="cw-tiers-modal" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
            <div className="cw-tiers-modal-header">
              <h2 className="cw-tiers-modal-title">{editingPackage ? 'Edit Service Package' : 'Create New Service Package'}</h2>
              <button type="button" className="cw-icon-btn" onClick={() => setAddServiceModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const deliverablesArray = pkgDeliverablesText
                .split('\n')
                .map(s => s.trim())
                .filter(Boolean);

              if (editingPackage) {
                // Update
                const updated = {
                  ...creator,
                  packages: creator.packages.map(p => {
                    if (p.id === editingPackage.id) {
                      return {
                        ...p,
                        title: pkgTitle,
                        priceInINR: pkgPrice,
                        deliveryDays: pkgDays,
                        platform: pkgPlatform as any,
                        tagline: pkgTagline,
                        deliverables: deliverablesArray.length > 0 ? deliverablesArray : p.deliverables
                      };
                    }
                    return p;
                  })
                };
                setCreator(updated);
                onUpdateCreator?.(updated);
                onShowToast(`Updated package: "${pkgTitle}"`);
              } else {
                // Create
                const newPkg: ServicePackage = {
                  id: `pkg-${Date.now()}`,
                  title: pkgTitle || 'Custom Sponsorship Package',
                  tagline: pkgTagline || 'High-production tailored integration',
                  priceInINR: pkgPrice,
                  platform: pkgPlatform as any,
                  deliveryDays: pkgDays,
                  includedRevisions: 1,
                  publishingIncluded: true,
                  organicUsageDays: 30,
                  paidUsageRightsIncluded: false,
                  deliverables: deliverablesArray.length > 0 ? deliverablesArray : ['Custom high-production showcase', '1 Round of script review'],
                  bestFor: 'Brands looking for maximum conversion'
                };
                const updated = {
                  ...creator,
                  packages: [...creator.packages, newPkg]
                };
                setCreator(updated);
                onUpdateCreator?.(updated);
                onShowToast(`Created service package: "${newPkg.title}"`);
              }
              setAddServiceModalOpen(false);
            }} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>Package Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Dedicated Podcast Episode Sponsorship" 
                  value={pkgTitle}
                  onChange={(e) => setPkgTitle(e.target.value)}
                  className="cw-search-box" 
                  style={{ width: '100%' }} 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>Price (INR) *</label>
                  <input 
                    type="number" 
                    required
                    value={pkgPrice}
                    onChange={(e) => setPkgPrice(Number(e.target.value))}
                    className="cw-search-box" 
                    style={{ width: '100%' }} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>Delivery Turnaround (Days)</label>
                  <input 
                    type="number" 
                    value={pkgDays}
                    onChange={(e) => setPkgDays(Number(e.target.value))}
                    className="cw-search-box" 
                    style={{ width: '100%' }} 
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>Platform</label>
                <select 
                  value={pkgPlatform}
                  onChange={(e) => setPkgPlatform(e.target.value)}
                  className="cw-search-box" 
                  style={{ width: '100%' }}
                >
                  <option value="YouTube">YouTube</option>
                  <option value="Instagram Reels">Instagram Reels</option>
                  <option value="Multi-Platform">Multi-Platform</option>
                  <option value="LinkedIn">LinkedIn</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>Short Tagline / Best For</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ideal for product launches and feature deep-dives" 
                  value={pkgTagline}
                  onChange={(e) => setPkgTagline(e.target.value)}
                  className="cw-search-box" 
                  style={{ width: '100%' }} 
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>Deliverables (1 item per line)</label>
                <textarea 
                  rows={3} 
                  value={pkgDeliverablesText}
                  onChange={(e) => setPkgDeliverablesText(e.target.value)}
                  className="cw-search-box" 
                  style={{ width: '100%', resize: 'vertical' }} 
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="cw-btn cw-btn-cancel" onClick={() => setAddServiceModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="cw-btn cw-btn-primary">
                  {editingPackage ? 'Save Package Changes' : 'Publish Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Request Payout Modal */}
      {payoutModalOpen && (
        <div className="cw-tiers-modal-overlay" onClick={() => setPayoutModalOpen(false)}>
          <div className="cw-tiers-modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div className="cw-tiers-modal-header">
              <h2 className="cw-tiers-modal-title">Withdraw Available Earnings</h2>
              <button type="button" className="cw-icon-btn" onClick={() => setPayoutModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleConfirmPayout} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ padding: 14, background: '#EDF5F0', borderRadius: 10, border: '1px solid #166534', color: '#166534' }}>
                <span style={{ fontSize: '0.78rem', display: 'block' }}>Available for Immediate Transfer:</span>
                <strong style={{ fontSize: '1.4rem' }}>{formatMoney(availablePayoutINR)}</strong>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E' }}>Withdrawal Amount (INR) *</label>
                  <button 
                    type="button" 
                    style={{ background: 'none', border: 'none', color: '#166534', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                    onClick={() => setWithdrawAmount(availablePayoutINR)}
                  >
                    Withdraw All ({formatMoney(availablePayoutINR)})
                  </button>
                </div>
                <input 
                  type="number" 
                  required
                  min={500}
                  max={availablePayoutINR}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="cw-search-box" 
                  style={{ width: '100%', fontSize: '1.1rem', fontWeight: 700 }} 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 6 }}>Payout Destination</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, border: payoutMethod === 'bank' ? '2px solid #16281D' : '1px solid #E5E8E4', background: payoutMethod === 'bank' ? '#FAF9F5' : '#FFFFFF', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="payout_dest" 
                      checked={payoutMethod === 'bank'} 
                      onChange={() => setPayoutMethod('bank')} 
                    />
                    <div>
                      <strong style={{ fontSize: '0.86rem', color: '#19201C', display: 'block' }}>HDFC Bank (*4920)</strong>
                      <span style={{ fontSize: '0.74rem', color: '#828E86' }}>IFSC: HDFC0000128 • Direct NEFT/IMPS</span>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, border: payoutMethod === 'upi' ? '2px solid #16281D' : '1px solid #E5E8E4', background: payoutMethod === 'upi' ? '#FAF9F5' : '#FFFFFF', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="payout_dest" 
                      checked={payoutMethod === 'upi'} 
                      onChange={() => setPayoutMethod('upi')} 
                    />
                    <div>
                      <strong style={{ fontSize: '0.86rem', color: '#19201C', display: 'block' }}>UPI Fast Payout ({bankSettings.upiId})</strong>
                      <span style={{ fontSize: '0.74rem', color: '#828E86' }}>Estimated arrival within 2 hours</span>
                    </div>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button type="button" className="cw-btn cw-btn-cancel" onClick={() => setPayoutModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="cw-btn cw-btn-primary">
                  Confirm Withdrawal ({formatMoney(withdrawAmount)})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Add Calendar Event Modal */}
      {addEventModalOpen && (
        <div className="cw-tiers-modal-overlay" onClick={() => setAddEventModalOpen(false)}>
          <div className="cw-tiers-modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div className="cw-tiers-modal-header">
              <h2 className="cw-tiers-modal-title">Schedule Calendar Milestone</h2>
              <button type="button" className="cw-icon-btn" onClick={() => setAddEventModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const newEv: CalendarEventItem = {
                id: `ev-${Date.now()}`,
                date: newEventDate,
                title: newEventTitle || 'Campaign Milestone',
                brand: newEventBrand || 'Partner Brand',
                type: newEventType,
                status: 'confirmed'
              };
              setCalendarEvents(prev => [...prev, newEv]);
              setSelectedCalendarDate(newEventDate);
              onShowToast(`Scheduled milestone: "${newEv.title}" on ${newEventDate}!`);
              setAddEventModalOpen(false);
              setNewEventTitle('');
              setNewEventBrand('');
            }} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>Milestone / Task Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Record B-Roll in Studio" 
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="cw-search-box" 
                  style={{ width: '100%' }} 
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>Brand Partner / Client</label>
                <input 
                  type="text" 
                  placeholder="e.g. SuperAI Labs" 
                  value={newEventBrand}
                  onChange={(e) => setNewEventBrand(e.target.value)}
                  className="cw-search-box" 
                  style={{ width: '100%' }} 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>Date *</label>
                  <input 
                    type="date" 
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="cw-search-box" 
                    style={{ width: '100%' }} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#59655E', display: 'block', marginBottom: 4 }}>Milestone Type</label>
                  <select 
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value as any)}
                    className="cw-search-box" 
                    style={{ width: '100%' }}
                  >
                    <option value="shooting">🎥 Filming / Shoot Day</option>
                    <option value="review">📝 Script / Draft Review</option>
                    <option value="publish">🚀 Live Publish Date</option>
                    <option value="deadline">⏰ Hard Deadline</option>
                    <option value="blackout">⛔ Blackout / Unavailable</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button type="button" className="cw-btn cw-btn-cancel" onClick={() => setAddEventModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="cw-btn cw-btn-primary">
                  Add to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Reputation Tiers Modal */}
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
                  <span className="cw-tier-tag">Verified social links</span>
                </div>
              </div>

              {/* Tier 2: Established Creator */}
              <div className="cw-tier-card tier-card-light">
                <div className="cw-tier-card-header">
                  <h3 className="cw-tier-name">Established Creator</h3>
                  <span className="cw-tier-icon"><BookmarkCheck size={20} color="#15803D" /></span>
                </div>
                <p className="cw-tier-desc">
                  Demonstrates consistent delivery, verified audience reach, and positive collaboration feedback.
                </p>
                <div className="cw-tier-tags-row">
                  <span className="cw-tier-tag">5+ completed collabs</span>
                  <span className="cw-tier-tag">Verified audience data</span>
                  <span className="cw-tier-tag">Above-average delivery rate</span>
                </div>
              </div>

              {/* Tier 3: Elite Creator */}
              <div className="cw-tier-card tier-card-dark">
                <div className="cw-tier-card-header">
                  <h3 className="cw-tier-name">Elite Creator</h3>
                  <span className="cw-tier-icon"><Crown size={20} color="#C29C5B" /></span>
                </div>
                <p className="cw-tier-desc">
                  Reserved for creators with exceptional track records, repeat brand partnerships, and outstanding reliability.
                </p>
                <div className="cw-tier-tags-row">
                  <span className="cw-tier-tag">15+ completed collabs</span>
                  <span className="cw-tier-tag">Top-tier client ratings</span>
                  <span className="cw-tier-tag">Escrow priority release</span>
                </div>
              </div>
            </div>

            <div className="cw-tiers-modal-footer">
              <span className="cw-tiers-footer-text">
                Your current tier is <strong>Elite Creator</strong> based on 24 completed deals and a 4.9★ rating.
              </span>
              <button 
                type="button" 
                className="cw-btn cw-btn-primary"
                onClick={() => setTiersModalOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Help & Creator Guide Modal */}
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
