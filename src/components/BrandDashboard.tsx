import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { 
  CreatorProfile, 
  CurrencyCode, 
  AuthUser,
  CollaborationRequest
} from '../types/creator';
import { formatCurrency } from '../data/currencies';
import { CreatorlyLogo } from './CreatorlyLogo';
import { fetchCampaignsFromSupabase, saveCampaignToSupabase } from '../lib/supabaseClient';
import './BrandDashboard.css';
import {
  Compass,
  Heart,
  Bookmark,
  MessageSquare,
  Handshake,
  Megaphone,
  History,
  Settings,
  Sparkles,
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  X,
  Menu,
  ExternalLink,
  ShieldCheck,
  Check,
  Star,
  MapPin,
  Globe2,
  Lock,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  Building,
  CreditCard,
  LogOut,
  Send,
  Plus,
  Trash2,
  Paperclip,
  Share2,
  Users,
  CheckCircle2,
  Clock,
  Wallet,
  Edit2
} from 'lucide-react';

export type BrandDashboardTab = 
  | 'discover'
  | 'saved'
  | 'shortlists'
  | 'compare'
  | 'messages'
  | 'requests'
  | 'campaigns'
  | 'saved_searches'
  | 'settings';

interface BrandDashboardProps {
  creators: CreatorProfile[];
  currentCurrency: CurrencyCode;
  onSelectCreator: (creator: CreatorProfile) => void;
  onShowToast: (msg: string) => void;
  onNavigateToWorkspace: () => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  onReturnToHome?: () => void;
  collaborationRequests?: CollaborationRequest[];
  onBookingSubmitted?: (booking: any, creator: CreatorProfile) => void;
  onUpdateRequestStatus?: (requestId: string, newStatus: any, notes?: string, counterOffer?: number) => void;
}

// 12 Category Tiles definition matching reference screenshot
const BROWSE_CATEGORIES = [
  { id: 'Education', label: 'Education', icon: '🎓', className: 'cat-edu' },
  { id: 'Tech', label: 'Tech', icon: '💻', className: 'cat-tech' },
  { id: 'Food', label: 'Food', icon: '🍲', className: 'cat-food' },
  { id: 'Sports', label: 'Sports', icon: '⚽', className: 'cat-sports' },
  { id: 'Fashion', label: 'Fashion', icon: '👗', className: 'cat-fashion' },
  { id: 'Fitness', label: 'Health & Fitness', icon: '❤️', className: 'cat-fitness' },
  { id: 'Finance', label: 'Finance', icon: '🪙', className: 'cat-finance' },
  { id: 'Lifestyle', label: 'Lifestyle', icon: '✨', className: 'cat-lifestyle' },
  { id: 'Travel', label: 'Travel', icon: '✈️', className: 'cat-travel' },
  { id: 'Gaming', label: 'Gaming', icon: '🎮', className: 'cat-gaming' },
  { id: 'Comedy', label: 'Comedy', icon: '🎭', className: 'cat-comedy' },
  { id: 'Business', label: 'Business', icon: '💼', className: 'cat-business' },
];

export interface ChatMessage {
  id: string;
  sender: 'brand' | 'creator';
  text: string;
  timestamp: string;
  cardType?: 'brief' | 'offer' | 'draft';
  cardData?: any;
}

export interface BrandConversation {
  id: string;
  creatorId: string;
  creatorName: string;
  handle: string;
  avatar: string;
  niche: string;
  startingPrice: number;
  unread: boolean;
  messages: ChatMessage[];
  status: 'Active Negotiation' | 'Proposal Sent' | 'Contract Signed' | 'In Production';
}

export interface OutgoingCollabRequest {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  avatarUrl: string;
  campaignName: string;
  budgetINR: number;
  deadline: string;
  deliverables: string[];
  briefText: string;
  status: 'Pending' | 'In Discussion' | 'Accepted' | 'In Production' | 'Completed' | 'Declined';
  submittedAt: string;
  escrowFunded?: boolean;
}

export interface BrandCampaign {
  id: string;
  name: string;
  objective: string;
  status: 'Active' | 'In Planning' | 'Completed';
  startDate: string;
  endDate: string;
  totalBudgetINR: number;
  spentBudgetINR: number;
  creatorIds: string[];
  milestones: { id: string; label: string; completed: boolean }[];
  deliverablesCount: number;
  completedDeliverablesCount: number;
}

export interface BrandSavedSearch {
  id: string;
  title: string;
  query: string;
  category: string | null;
  platform: string;
  location: string;
  budget: string;
  alertFrequency: 'Instant' | 'Daily' | 'Weekly' | 'Off';
  matchedCount: number;
  savedAt: string;
}

export interface ShortlistItem {
  id: string;
  name: string;
  description: string;
  creatorIds: string[];
  notes?: Record<string, string>;
}

export const BrandDashboard: React.FC<BrandDashboardProps> = ({
  creators,
  currentCurrency,
  onSelectCreator,
  onShowToast,
  onNavigateToWorkspace,
  currentUser: _currentUser,
  onLogout,
  onReturnToHome,
  collaborationRequests,
  onBookingSubmitted,
  onUpdateRequestStatus: _onUpdateRequestStatus
}) => {
  // Navigation & Active View State
  const [activeTab, setActiveTab] = useState<BrandDashboardTab>('discover');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  // Search, Filters & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filterPlatform, setFilterPlatform] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterBudget, setFilterBudget] = useState('All');
  const [filterFollowers, setFilterFollowers] = useState('All');
  const [filterLanguage, setFilterLanguage] = useState('All');
  const [sortBy, setSortBy] = useState<'relevance' | 'followers' | 'engagement' | 'price_low' | 'price_high'>('relevance');
  const [moreFiltersModalOpen, setMoreFiltersModalOpen] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minEngagement, setMinEngagement] = useState<number>(0);
  const [viewAllActive, setViewAllActive] = useState(false);

  // Filter dropdown toggle state
  const [activeFilterDropdown, setActiveFilterDropdown] = useState<'platform' | 'location' | 'budget' | 'followers' | 'language' | null>(null);

  // User Actions: Saved Creators & Shortlists
  const [savedCreatorIds, setSavedCreatorIds] = useState<string[]>(['creator-food-rhea', 'creator-tech-arjun']);
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({
    'creator-food-rhea': 'Ideal for the Q4 Festive cafe review reel series.',
    'creator-tech-arjun': 'Top developer audience for the AI Coding Assistant launch.'
  });
  const [comparedCreatorIds, setComparedCreatorIds] = useState<string[]>([]);
  
  const [shortlists, setShortlists] = useState<ShortlistItem[]>([
    { 
      id: 'sl-1', 
      name: 'Q4 Festive Reels Push', 
      description: 'High-energy lifestyle and food influencers for Diwali holiday campaign.',
      creatorIds: ['creator-food-rhea', 'creator-priya-patel'] 
    },
    { 
      id: 'sl-2', 
      name: 'Tech SaaS Launch', 
      description: 'Developer advocates and tech reviewers for AI tools product launch.',
      creatorIds: ['creator-tech-arjun', 'creator-alex-sharma'] 
    }
  ]);
  const [selectedShortlistId, setSelectedShortlistId] = useState<string>('sl-1');
  const [shortlistModalOpen, setShortlistModalOpen] = useState(false);
  const [newShortlistName, setNewShortlistName] = useState('');
  const [newShortlistDesc, setNewShortlistDesc] = useState('');
  const [creatorForShortlist, setCreatorForShortlist] = useState<CreatorProfile | null>(null);

  // SmartMatch Modal & Brief Builder State
  const [smartMatchOpen, setSmartMatchOpen] = useState(false);
  const [smartMatchObjective, setSmartMatchObjective] = useState('Product Awareness & Launch');
  const [smartMatchCategory, setSmartMatchCategory] = useState('Technology & AI');
  const [smartMatchPlatform, setSmartMatchPlatform] = useState('Instagram Reels');
  const [smartMatchBudgetINR, setSmartMatchBudgetINR] = useState(25000);
  const [smartMatchDeadline, setSmartMatchDeadline] = useState('Within 2 weeks');

  // Collaboration Request Modal & Management
  const [collabModalOpen, setCollabModalOpen] = useState(false);
  const [collabTargetCreator, setCollabTargetCreator] = useState<CreatorProfile | null>(null);
  const [collabCampaignName, setCollabCampaignName] = useState('');
  const [collabDeliverables, setCollabDeliverables] = useState('1 Dedicated Video / Reel + 2 Stories');
  const [collabBudgetINR, setCollabBudgetINR] = useState(15000);
  const [collabDeadline, setCollabDeadline] = useState('2026-11-15');
  const [collabBrief, setCollabBrief] = useState('');
  const [selectedRequestForDrawer, setSelectedRequestForDrawer] = useState<OutgoingCollabRequest | null>(null);
  const [requestFilterStatus, setRequestFilterStatus] = useState<string>('All');
  const [requestSearchQuery, setRequestSearchQuery] = useState('');
  const [requestToFund, setRequestToFund] = useState<OutgoingCollabRequest | null>(null);

  const [outgoingRequests, setOutgoingRequests] = useState<OutgoingCollabRequest[]>([
    {
      id: 'REQ-2026-1042',
      creatorId: 'creator-tech-arjun',
      creatorName: 'Arjun Mehta',
      creatorHandle: '@techwitharjun',
      avatarUrl: '/images/alex-sharma.jpg',
      campaignName: 'AI Coding Assistant Q4 Promo',
      budgetINR: 18000,
      deadline: '2026-11-05',
      deliverables: ['1 Dedicated YouTube Review (8-10m)', 'Pinned sponsor link with promo discount'],
      briefText: 'Highlight AI autocomplete latency, accuracy on React & TypeScript, and team collaboration features.',
      status: 'Accepted',
      submittedAt: 'Today, 2:15 PM',
      escrowFunded: false
    },
    {
      id: 'REQ-2026-1038',
      creatorId: 'creator-food-rhea',
      creatorName: 'Rhea Kapoor',
      creatorHandle: '@rheaeats',
      avatarUrl: '/images/ananya-roy.jpg',
      campaignName: 'Artisanal Cafe Review Series',
      budgetINR: 12000,
      deadline: '2026-10-31',
      deliverables: ['1 High-energy Reel (60s)', '2 Instagram Stories with swipe-up/sticker link'],
      briefText: 'Capture authentic cafe atmosphere, signature dishes, and easy contactless ordering workflow.',
      status: 'In Discussion',
      submittedAt: 'Yesterday'
    },
    {
      id: 'REQ-2026-1025',
      creatorId: 'creator-fitness-neha',
      creatorName: 'Neha Verma',
      creatorHandle: '@fitwithneha',
      avatarUrl: '/images/neha-singhal.jpg',
      campaignName: 'Electrolyte Hydration Drink Launch',
      budgetINR: 10000,
      deadline: '2026-11-12',
      deliverables: ['1 Workout Integration Reel', 'Post-workout recovery endorsement'],
      briefText: 'Focus on zero sugar, natural electrolytes, and rapid muscle recovery during intense HIIT sessions.',
      status: 'In Production',
      submittedAt: '3 days ago',
      escrowFunded: true
    },
    {
      id: 'REQ-2026-1019',
      creatorId: 'creator-travel-sanya',
      creatorName: 'Sanya Iyer',
      creatorHandle: '@sanyatravels',
      avatarUrl: '/images/riya-kapoor.jpg',
      campaignName: 'Eco-Resort Staycation Feature',
      budgetINR: 22000,
      deadline: '2026-11-20',
      deliverables: ['1 Cinematic 4K Reel', '3 Story highlights', 'RAW Photo Pack'],
      briefText: 'Showcase solar-powered luxury villas, organic farm-to-table dining, and mountain wellness spa.',
      status: 'Pending',
      submittedAt: '4 days ago'
    },
    {
      id: 'REQ-2026-1011',
      creatorId: 'creator-gaming-karan',
      creatorName: 'Karan Singh',
      creatorHandle: '@karanplays',
      avatarUrl: '/images/jun-park.jpg',
      campaignName: 'Wireless Gaming Mouse Showcase',
      budgetINR: 15000,
      deadline: '2026-11-08',
      deliverables: ['Dedicated 2-hour stream banner overlay', '2 verbal shoutouts with QR code', 'Social cut clip'],
      briefText: 'Demonstrate ultra-low 1ms latency during competitive tournament gameplay.',
      status: 'Pending',
      submittedAt: '5 days ago'
    }
  ]);

  // Synchronize incoming collaboration requests from core pipeline
  useEffect(() => {
    if (collaborationRequests && collaborationRequests.length > 0) {
      setOutgoingRequests(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newFromPipeline: OutgoingCollabRequest[] = collaborationRequests
          .filter(r => !existingIds.has(r.id))
          .map(r => ({
            id: r.id,
            creatorId: r.creatorId,
            creatorName: r.creatorName,
            creatorHandle: r.creatorHandle,
            avatarUrl: r.creatorAvatar,
            campaignName: r.serviceTitle,
            budgetINR: r.budgetINR,
            deadline: r.proposedDeadline,
            deliverables: r.deliverables,
            briefText: r.campaignBrief,
            status: (r.status === 'in_progress' ? 'Accepted' : (r.status === 'completed' ? 'Completed' : (r.status === 'declined' ? 'Declined' : 'Pending'))) as any,
            submittedAt: r.submittedAt || 'Just now',
            escrowFunded: r.escrowStatus === 'held' || r.escrowStatus === 'released'
          }));
        if (newFromPipeline.length === 0) return prev;
        return [...newFromPipeline, ...prev];
      });
    }
  }, [collaborationRequests]);

  // Brand Direct Messages & Messenger State
  const [brandConversations, setBrandConversations] = useState<BrandConversation[]>([
    {
      id: 'b-conv-1',
      creatorId: 'creator-tech-arjun',
      creatorName: 'Arjun Mehta',
      handle: '@techwitharjun',
      avatar: '/images/alex-sharma.jpg',
      niche: 'Technology',
      startingPrice: 6000,
      unread: true,
      status: 'Active Negotiation',
      messages: [
        {
          id: 'm1',
          sender: 'brand',
          text: 'Hi Arjun! We love your in-depth developer tutorials. We are launching our AI Coding Assistant and would love to collaborate on a dedicated feature video.',
          timestamp: '10:30 AM'
        },
        {
          id: 'm2',
          sender: 'creator',
          text: 'Hey Sarah! Thanks for reaching out. The AI assistant looks super slick. I tested the beta and the code completion latency is genuinely impressive.',
          timestamp: '11:15 AM'
        },
        {
          id: 'm3',
          sender: 'brand',
          text: 'Awesome! We submitted an official collaboration proposal for ₹18,000 for a dedicated 8-10 min review. Does that timeline work for you?',
          timestamp: '11:45 AM',
          cardType: 'brief',
          cardData: { title: 'AI Coding Assistant Q4 Promo', budget: 18000, deadline: 'Nov 5, 2026' }
        },
        {
          id: 'm4',
          sender: 'creator',
          text: 'Hey Sarah! Loved the brief for the AI assistant. I can deliver the first draft by Tuesday. Ready to sign the agreement whenever you are!',
          timestamp: '25m ago'
        }
      ]
    },
    {
      id: 'b-conv-2',
      creatorId: 'creator-food-rhea',
      creatorName: 'Rhea Kapoor',
      handle: '@rheaeats',
      avatar: '/images/ananya-roy.jpg',
      niche: 'Food & Dining',
      startingPrice: 6000,
      unread: true,
      status: 'Proposal Sent',
      messages: [
        {
          id: 'm2-1',
          sender: 'brand',
          text: 'Hi Rhea! We are organizing the Artisanal Cafe Series in Delhi and would love to feature your culinary review.',
          timestamp: 'Yesterday'
        },
        {
          id: 'm2-2',
          sender: 'creator',
          text: 'Could we schedule the cafe shoot for this Thursday morning for the best natural light?',
          timestamp: '2h ago'
        }
      ]
    },
    {
      id: 'b-conv-3',
      creatorId: 'creator-fitness-neha',
      creatorName: 'Neha Verma',
      handle: '@fitwithneha',
      avatar: '/images/neha-singhal.jpg',
      niche: 'Fitness',
      startingPrice: 5000,
      unread: true,
      status: 'In Production',
      messages: [
        {
          id: 'm3-1',
          sender: 'brand',
          text: 'Hi Neha! Product package dispatched via BlueDart with sample flavors.',
          timestamp: '2 days ago'
        },
        {
          id: 'm3-2',
          sender: 'creator',
          text: 'Received the sample product box! Taste test review is going to be fire.',
          timestamp: 'Yesterday'
        }
      ]
    }
  ]);

  const [activeConversationId, setActiveConversationId] = useState<string>('b-conv-1');
  const [chatInputText, setChatInputText] = useState('');
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [chatFilter, setChatFilter] = useState<'All' | 'Unread' | 'Active'>('All');
  const [newChatModalOpen, setNewChatModalOpen] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // Campaigns Management State
  const [campaigns, setCampaigns] = useState<BrandCampaign[]>([
    {
      id: 'camp-1',
      name: 'Diwali Festive Push 2026',
      objective: 'Brand Awareness & Festive Sales Conversion',
      status: 'Active',
      startDate: '2026-10-15',
      endDate: '2026-11-15',
      totalBudgetINR: 50000,
      spentBudgetINR: 32000,
      creatorIds: ['creator-food-rhea', 'creator-priya-patel', 'creator-travel-sanya'],
      deliverablesCount: 6,
      completedDeliverablesCount: 4,
      milestones: [
        { id: 'ms-1', label: 'Creator Briefs Finalized & Approved', completed: true },
        { id: 'ms-2', label: 'Product Sample Boxes Delivered', completed: true },
        { id: 'ms-3', label: 'Reel First Drafts Reviewed', completed: true },
        { id: 'ms-4', label: 'Festive Go-Live Weekend (Phase 1)', completed: true },
        { id: 'ms-5', label: 'Phase 2 Follow-Up Retargeting Stories', completed: false }
      ]
    },
    {
      id: 'camp-2',
      name: 'Developer Tools Q4 Sprint',
      objective: 'SaaS App Signups & Benchmark Awareness',
      status: 'In Planning',
      startDate: '2026-11-01',
      endDate: '2026-12-10',
      totalBudgetINR: 85000,
      spentBudgetINR: 28000,
      creatorIds: ['creator-tech-arjun', 'creator-alex-sharma'],
      deliverablesCount: 4,
      completedDeliverablesCount: 1,
      milestones: [
        { id: 'ms-2-1', label: 'Technical API Sandbox Access Provided', completed: true },
        { id: 'ms-2-2', label: 'Code Review Script Approval', completed: false },
        { id: 'ms-2-3', label: 'YouTube Video Production', completed: false },
        { id: 'ms-2-4', label: 'Product Hunt & GitHub Links Synchronized', completed: false }
      ]
    }
  ]);
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignObjective, setNewCampaignObjective] = useState('Brand Awareness & Launch');
  const [newCampaignBudget, setNewCampaignBudget] = useState(40000);
  const [newCampaignStartDate, setNewCampaignStartDate] = useState('2026-11-01');
  const [newCampaignEndDate, setNewCampaignEndDate] = useState('2026-11-30');
  const [selectedCampaignForView, setSelectedCampaignForView] = useState<BrandCampaign | null>(null);

  // Saved Searches State
  const [savedSearches, setSavedSearches] = useState<BrandSavedSearch[]>([
    {
      id: 'ss-1',
      title: 'Budget Reels Creators in India (< ₹10,000)',
      query: '',
      category: null,
      platform: 'Instagram',
      location: 'Delhi',
      budget: '<10k',
      alertFrequency: 'Daily',
      matchedCount: 8,
      savedAt: '2 days ago'
    },
    {
      id: 'ss-2',
      title: 'High-Impact Tech Reviewers on YouTube',
      query: 'AI Productivity Tools',
      category: 'Tech',
      platform: 'YouTube',
      location: 'Bengaluru',
      budget: '10k-25k',
      alertFrequency: 'Weekly',
      matchedCount: 5,
      savedAt: '5 days ago'
    }
  ]);
  const [saveSearchModalOpen, setSaveSearchModalOpen] = useState(false);
  const [newSearchTitle, setNewSearchTitle] = useState('');

  // Brand Settings State
  const [settingsSubTab, setSettingsSubTab] = useState<'profile' | 'billing' | 'team' | 'notifications'>('profile');
  const [brandProfile, setBrandProfile] = useState({
    companyName: 'Razorpay Growth Team',
    website: 'https://razorpay.com',
    industry: 'Financial Technology',
    companySize: '1,000+ Employees',
    location: 'Bengaluru, India',
    bio: 'Powering seamless financial transactions, creator payroll, and digital business solutions across India.',
    contactEmail: 'sarah.mitchell@razorpay.com',
    billingCurrency: 'INR' as CurrencyCode
  });
  const [escrowWalletBalanceINR, setEscrowWalletBalanceINR] = useState(150000);
  const [addFundsModalOpen, setAddFundsModalOpen] = useState(false);
  const [fundAmountINR, setFundAmountINR] = useState(50000);

  const [teamMembers, setTeamMembers] = useState([
    { id: 'tm-1', name: 'Sarah Mitchell', email: 'sarah.mitchell@razorpay.com', role: 'Brand Admin (Owner)', status: 'Active' },
    { id: 'tm-2', name: 'Kabir Chawla', email: 'kabir.c@razorpay.com', role: 'Campaign Manager', status: 'Active' },
    { id: 'tm-3', name: 'Ananya Deshmukh', email: 'ananya.d@razorpay.com', role: 'Financial Reviewer', status: 'Active' }
  ]);
  const [inviteTeamModalOpen, setInviteTeamModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Campaign Manager');

  const [notificationSettings, setNotificationSettings] = useState({
    proposalUpdates: true,
    messageAlerts: true,
    draftDeliverables: true,
    escrowMilestones: true,
    weeklyTalentDigest: false
  });

  // Load from Supabase and fallback to localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem('creatorly_brand_state_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.savedCreatorIds) setSavedCreatorIds(parsed.savedCreatorIds);
        if (parsed.shortlists) setShortlists(parsed.shortlists);
        if (parsed.comparedCreatorIds) setComparedCreatorIds(parsed.comparedCreatorIds);
        if (parsed.outgoingRequests) setOutgoingRequests(parsed.outgoingRequests);
        if (parsed.campaigns) setCampaigns(parsed.campaigns);
        if (parsed.savedSearches) setSavedSearches(parsed.savedSearches);
        if (parsed.brandProfile) setBrandProfile(parsed.brandProfile);
        if (parsed.escrowWalletBalanceINR) setEscrowWalletBalanceINR(parsed.escrowWalletBalanceINR);
      }
    } catch {
      // ignore
    }

    fetchCampaignsFromSupabase().then((liveCamps) => {
      if (liveCamps && liveCamps.length > 0) {
        setCampaigns(liveCamps);
        console.info(`[Creatorly] Loaded ${liveCamps.length} campaigns from Supabase.`);
      }
    });
  }, []);

  // Save changes to localStorage
  const persistBrandState = () => {
    try {
      localStorage.setItem('creatorly_brand_state_v2', JSON.stringify({
        savedCreatorIds,
        shortlists,
        comparedCreatorIds,
        outgoingRequests,
        campaigns,
        savedSearches,
        brandProfile,
        escrowWalletBalanceINR
      }));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    persistBrandState();
  }, [savedCreatorIds, shortlists, comparedCreatorIds, outgoingRequests, campaigns, savedSearches, brandProfile, escrowWalletBalanceINR]);

  // Scroll chat to bottom when message arrives
  useEffect(() => {
    if (activeTab === 'messages') {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [brandConversations, activeConversationId, activeTab]);

  // Map enriched creator card covers and data matching the reference screenshot
  const enrichedCreators = useMemo(() => {
    const defaultProfileBase = {
      addOns: [],
      reviews: [
        {
          id: 'rev-1',
          brandName: 'Urban Company',
          brandLogo: '🏢',
          reviewerName: 'Priya Sharma',
          reviewerRole: 'Brand Lead',
          campaignType: 'Product Launch',
          rating: 5,
          date: 'Oct 2024',
          content: 'Incredible turnaround time and flawless communication. Exceeded our engagement targets by 40%!',
          verifiedTransaction: true
        }
      ],
      overallRating: 4.9,
      totalReviews: 24,
      faqs: [
        { id: 'faq-1', category: 'deliverables' as const, question: 'What is your turnaround time?', answer: 'Draft delivered within 3-5 business days of receiving product/brief.' },
        { id: 'faq-2', category: 'terms' as const, question: 'Are revisions included?', answer: 'Yes, 1-2 standard creative revisions are included with every package.' }
      ],
      collaborationTerms: {
        paymentPolicy: '50% escrow upon booking, 50% upon draft approval.',
        revisionPolicy: 'Up to 2 creative rounds included.',
        cancellationPolicy: 'Full refund if cancelled before draft production starts.',
        exclusivityNotice: 'Category exclusivity available upon request.'
      }
    };

    // Spotlight creators
    const spotlightCards: CreatorProfile[] = [
      {
        ...defaultProfileBase,
        id: 'creator-food-rhea',
        username: 'rhea-kapoor',
        fullName: 'Rhea Kapoor',
        handle: '@rheaeats',
        avatarUrl: '/images/ananya-roy.jpg',
        coverPattern: '/images/creator-card-food.jpg',
        verifiedBadge: true,
        verificationSource: 'Instagram Graph API + Food Hygiene Auditor',
        primaryNiche: 'Food & Dining',
        subNiches: ['Bistro Reviews', 'Artisanal Recipes', 'Street Gourmet'],
        bio: 'Exploring authentic regional eateries, gourmet cafes, and easy culinary hacks across India.',
        location: { city: 'Delhi', country: 'India', flagEmoji: '🇮🇳' },
        languages: ['English', 'Hindi'],
        socialLinks: [
          { platform: 'instagram', name: 'Instagram', handle: '@rheaeats', url: '#', followers: 248000, verified: true }
        ],
        availability: { status: 'available', label: 'Available for Bookings', slotsRemaining: 3, totalSlots: 5, earliestDelivery: '3 days', responseTime: '< 2h' },
        metrics: {
          totalAudience: 248000,
          averageViews: 68000,
          engagementRate: 4.7,
          targetMarketPercentage: 82,
          targetMarketCountry: 'India',
          lastUpdatedDaysAgo: 1,
          ageDistribution: [], genderDistribution: [], topGeographies: [], topCities: [],
          platformFollowers: { youtube: 0, instagram: 248000, linkedin: 0 }
        },
        portfolio: [],
        packages: [
          {
            id: 'pkg-rhea-1',
            title: '1 Cafe / Restaurant Review Reel',
            tagline: 'High engagement reel for food and dining',
            bestFor: 'Cafe promotions and food product launches',
            priceInINR: 6000,
            platform: 'Instagram',
            deliveryDays: 4,
            includedRevisions: 2,
            publishingIncluded: true,
            organicUsageDays: 90,
            paidUsageRightsIncluded: false,
            deliverables: ['1 60s Reel with voiceover', '2 Story slides with map sticker']
          }
        ]
      },
      {
        ...defaultProfileBase,
        id: 'creator-tech-arjun',
        username: 'arjun-mehta',
        fullName: 'Arjun Mehta',
        handle: '@techwitharjun',
        avatarUrl: '/images/alex-sharma.jpg',
        coverPattern: '/images/creator-card-tech.jpg',
        verifiedBadge: true,
        verificationSource: 'YouTube Creator Partner API + GitHub Verified',
        primaryNiche: 'Technology',
        subNiches: ['Developer Tools', 'AI Productivity', 'Hardware Reviews'],
        bio: 'Honest gadgets reviews, developer setups, and software product deep dives for tech enthusiasts.',
        location: { city: 'Bengaluru', country: 'India', flagEmoji: '🇮🇳' },
        languages: ['English', 'Hindi'],
        socialLinks: [
          { platform: 'youtube', name: 'YouTube', handle: 'TechWithArjun', url: '#', followers: 512000, verified: true }
        ],
        availability: { status: 'available', label: 'Available for Collabs', slotsRemaining: 2, totalSlots: 4, earliestDelivery: '5 days', responseTime: '< 3h' },
        metrics: {
          totalAudience: 512000,
          averageViews: 145000,
          engagementRate: 5.2,
          targetMarketPercentage: 74,
          targetMarketCountry: 'India',
          lastUpdatedDaysAgo: 2,
          ageDistribution: [], genderDistribution: [], topGeographies: [], topCities: [],
          platformFollowers: { youtube: 512000, instagram: 0, linkedin: 0 }
        },
        portfolio: [],
        packages: [
          {
            id: 'pkg-arjun-1',
            title: 'Dedicated YouTube Product Deep-Dive',
            tagline: 'In-depth 8-10 minute sponsored video showcase',
            bestFor: 'SaaS tools, developer hardware, and AI platforms',
            priceInINR: 18000,
            platform: 'YouTube',
            deliveryDays: 5,
            includedRevisions: 2,
            publishingIncluded: true,
            organicUsageDays: 180,
            paidUsageRightsIncluded: true,
            deliverables: ['1 Dedicated 8-10m YouTube video', 'Pinned comment link', 'Social mention clip']
          }
        ]
      },
      {
        ...defaultProfileBase,
        id: 'creator-fitness-neha',
        username: 'neha-verma',
        fullName: 'Neha Verma',
        handle: '@fitwithneha',
        avatarUrl: '/images/neha-singhal.jpg',
        coverPattern: '/images/creator-card-fitness.jpg',
        verifiedBadge: true,
        verificationSource: 'ACSM Certified Personal Trainer + Instagram Verified',
        primaryNiche: 'Health & Fitness',
        subNiches: ['HIIT Workouts', 'Nutrition Plans', 'Activewear Styling'],
        bio: 'Empowering everyday fitness, sustainable nutrition, and holistic strength routines.',
        location: { city: 'Mumbai', country: 'India', flagEmoji: '🇮🇳' },
        languages: ['English', 'Hindi'],
        socialLinks: [
          { platform: 'instagram', name: 'Instagram', handle: '@fitwithneha', url: '#', followers: 186000, verified: true }
        ],
        availability: { status: 'available', label: 'Taking Nov Brand Deals', slotsRemaining: 4, totalSlots: 6, earliestDelivery: '4 days', responseTime: '< 1h' },
        metrics: {
          totalAudience: 186000,
          averageViews: 52000,
          engagementRate: 5.8,
          targetMarketPercentage: 86,
          targetMarketCountry: 'India',
          lastUpdatedDaysAgo: 1,
          ageDistribution: [], genderDistribution: [], topGeographies: [], topCities: [],
          platformFollowers: { youtube: 0, instagram: 186000, linkedin: 0 }
        },
        portfolio: [],
        packages: [
          {
            id: 'pkg-neha-1',
            title: 'Gym Workout Integration Reel',
            tagline: 'Fitness lifestyle and workout promotion',
            bestFor: 'Activewear, gym equipment, and nutrition brands',
            priceInINR: 5000,
            platform: 'Instagram',
            deliveryDays: 4,
            includedRevisions: 1,
            publishingIncluded: true,
            organicUsageDays: 90,
            paidUsageRightsIncluded: false,
            deliverables: ['1 High-energy workout reel', 'Post workout product endorsement', 'Story sequence']
          }
        ]
      },
      {
        ...defaultProfileBase,
        id: 'creator-finance-rohit',
        username: 'rohit-khanna',
        fullName: 'Rohit Khanna',
        handle: '@rohitmoney',
        avatarUrl: '/images/kabir-varma.jpg',
        coverPattern: '/images/creator-card-finance.jpg',
        verifiedBadge: true,
        verificationSource: 'NISM Certified Investment Advisor + YouTube Partner',
        primaryNiche: 'Finance',
        subNiches: ['Personal Finance', 'Stock Valuation', 'Tax Optimization'],
        bio: 'Demystifying personal investing, index funds, and financial freedom for young earners.',
        location: { city: 'Delhi', country: 'India', flagEmoji: '🇮🇳' },
        languages: ['English', 'Hindi'],
        socialLinks: [
          { platform: 'youtube', name: 'YouTube', handle: 'RohitMoney', url: '#', followers: 320000, verified: true }
        ],
        availability: { status: 'available', label: '2 Open Collab Slots', slotsRemaining: 2, totalSlots: 3, earliestDelivery: '6 days', responseTime: '< 2h' },
        metrics: {
          totalAudience: 320000,
          averageViews: 98000,
          engagementRate: 5.0,
          targetMarketPercentage: 88,
          targetMarketCountry: 'India',
          lastUpdatedDaysAgo: 1,
          ageDistribution: [], genderDistribution: [], topGeographies: [], topCities: [],
          platformFollowers: { youtube: 320000, instagram: 0, linkedin: 0 }
        },
        portfolio: [],
        packages: [
          {
            id: 'pkg-rohit-1',
            title: 'Sponsored FinTech App Walkthrough',
            tagline: 'In-depth financial product review',
            bestFor: 'Fintech apps, investment platforms, and banking tools',
            priceInINR: 7000,
            platform: 'YouTube',
            deliveryDays: 6,
            includedRevisions: 2,
            publishingIncluded: true,
            organicUsageDays: 90,
            paidUsageRightsIncluded: true,
            deliverables: ['1 Educational integration segment', 'Screen recording tutorial', 'Pinned comment link']
          }
        ]
      },
      {
        ...defaultProfileBase,
        id: 'creator-travel-sanya',
        username: 'sanya-iyer',
        fullName: 'Sanya Iyer',
        handle: '@sanyatravels',
        avatarUrl: '/images/riya-kapoor.jpg',
        coverPattern: '/images/creator-card-travel.jpg',
        verifiedBadge: true,
        verificationSource: 'Tourism Board Certified + Meta Verified',
        primaryNiche: 'Travel',
        subNiches: ['Solo Backpacker', 'Hidden Getaways', 'Cultural Stories'],
        bio: 'Documenting off-the-beaten-path journeys, heritage stays, and mountain escapes across the globe.',
        location: { city: 'Bengaluru', country: 'India', flagEmoji: '🇮🇳' },
        languages: ['English'],
        socialLinks: [
          { platform: 'instagram', name: 'Instagram', handle: '@sanyatravels', url: '#', followers: 412000, verified: true }
        ],
        availability: { status: 'available', label: 'Booking for Nov/Dec', slotsRemaining: 3, totalSlots: 5, earliestDelivery: '7 days', responseTime: '< 5h' },
        metrics: {
          totalAudience: 412000,
          averageViews: 110000,
          engagementRate: 4.9,
          targetMarketPercentage: 72,
          targetMarketCountry: 'India',
          lastUpdatedDaysAgo: 3,
          ageDistribution: [], genderDistribution: [], topGeographies: [], topCities: [],
          platformFollowers: { youtube: 0, instagram: 412000, linkedin: 0 }
        },
        portfolio: [],
        packages: [
          {
            id: 'pkg-sanya-1',
            title: 'Destination & Resort Reel Showcase',
            tagline: 'Cinematic destination visual showcase',
            bestFor: 'Resorts, tourism boards, luggage, and adventure apparel',
            priceInINR: 9000,
            platform: 'Instagram',
            deliveryDays: 7,
            includedRevisions: 2,
            publishingIncluded: true,
            organicUsageDays: 90,
            paidUsageRightsIncluded: false,
            deliverables: ['1 Cinematic drone & 4K reel', '3 Story highlights', 'Full RAW photo pack']
          }
        ]
      },
      {
        ...defaultProfileBase,
        id: 'creator-gaming-karan',
        username: 'karan-singh',
        fullName: 'Karan Singh',
        handle: '@karanplays',
        avatarUrl: '/images/jun-park.jpg',
        coverPattern: '/images/creator-card-gaming.jpg',
        verifiedBadge: true,
        verificationSource: 'Twitch Partner + YouTube Gaming Verified',
        primaryNiche: 'Gaming',
        subNiches: ['Esports Tournaments', 'PC Gaming Gear', 'Stream Highlights'],
        bio: 'Competitive shooter streamer, gaming PC benchmark tester, and entertaining stream highlights.',
        location: { city: 'Pune', country: 'India', flagEmoji: '🇮🇳' },
        languages: ['English', 'Hindi'],
        socialLinks: [
          { platform: 'youtube', name: 'YouTube Gaming', handle: 'KaranPlays', url: '#', followers: 634000, verified: true }
        ],
        availability: { status: 'available', label: 'Open for Brands', slotsRemaining: 5, totalSlots: 8, earliestDelivery: '3 days', responseTime: '< 1h' },
        metrics: {
          totalAudience: 634000,
          averageViews: 195000,
          engagementRate: 4.6,
          targetMarketPercentage: 80,
          targetMarketCountry: 'India',
          lastUpdatedDaysAgo: 1,
          ageDistribution: [], genderDistribution: [], topGeographies: [], topCities: [],
          platformFollowers: { youtube: 634000, instagram: 0, linkedin: 0 }
        },
        portfolio: [],
        packages: [
          {
            id: 'pkg-karan-1',
            title: 'Livestream Brand Overlay + Mention',
            tagline: 'Esports livestream product placement',
            bestFor: 'Gaming accessories, PCs, beverage and snack brands',
            priceInINR: 10000,
            platform: 'YouTube',
            deliveryDays: 3,
            includedRevisions: 1,
            publishingIncluded: true,
            organicUsageDays: 90,
            paidUsageRightsIncluded: true,
            deliverables: ['Dedicated 2-hour stream banner overlay', '2 verbal shoutouts with QR code', 'Social cut clip']
          }
        ]
      }
    ];

    // Combine spotlight cards with the rest of the workspace creators
    const combined = [...spotlightCards];
    creators.forEach(c => {
      if (!combined.some(item => item.id === c.id || item.handle === c.handle)) {
        combined.push(c);
      }
    });

    return combined;
  }, [creators]);

  // Filtered & Sorted Creators List
  const filteredCreators = useMemo(() => {
    let result = enrichedCreators;

    // Search query filter (matches name, handle, niche, location, bio)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(c => 
        c.fullName.toLowerCase().includes(q) ||
        c.handle.toLowerCase().includes(q) ||
        c.primaryNiche.toLowerCase().includes(q) ||
        c.subNiches.some(s => s.toLowerCase().includes(q)) ||
        c.location.city.toLowerCase().includes(q) ||
        c.bio.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory) {
      const catLower = selectedCategory.toLowerCase();
      result = result.filter(c => {
        const nicheLower = c.primaryNiche.toLowerCase();
        const subs = c.subNiches.map(s => s.toLowerCase()).join(' ');
        if (catLower === 'fitness') return nicheLower.includes('fitness') || subs.includes('fitness') || subs.includes('gym') || subs.includes('strength');
        if (catLower === 'tech') return nicheLower.includes('tech') || nicheLower.includes('developer') || subs.includes('ai') || subs.includes('tools');
        if (catLower === 'food') return nicheLower.includes('food') || nicheLower.includes('culinary') || subs.includes('bistro') || subs.includes('recipe');
        return nicheLower.includes(catLower) || subs.includes(catLower);
      });
    }

    // Platform filter
    if (filterPlatform !== 'All') {
      const p = filterPlatform.toLowerCase();
      result = result.filter(c => c.socialLinks.some(s => s.platform.toLowerCase().includes(p)));
    }

    // Location filter
    if (filterLocation !== 'All') {
      result = result.filter(c => c.location.city.toLowerCase().includes(filterLocation.toLowerCase()));
    }

    // Language filter
    if (filterLanguage !== 'All') {
      result = result.filter(c => c.languages.some(l => l.toLowerCase().includes(filterLanguage.toLowerCase())));
    }

    // Budget filter
    if (filterBudget !== 'All') {
      result = result.filter(c => {
        const minPrice = c.packages[0]?.priceInINR || 6000;
        if (filterBudget === '<10k') return minPrice <= 10000;
        if (filterBudget === '10k-25k') return minPrice >= 10000 && minPrice <= 25000;
        if (filterBudget === '25k-50k') return minPrice >= 25000 && minPrice <= 50000;
        if (filterBudget === '50k+') return minPrice > 50000;
        return true;
      });
    }

    // Followers Tier filter
    if (filterFollowers !== 'All') {
      result = result.filter(c => {
        const aud = c.metrics.totalAudience;
        if (filterFollowers === 'Nano (<10k)') return aud < 10000;
        if (filterFollowers === 'Micro (10k-50k)') return aud >= 10000 && aud <= 50000;
        if (filterFollowers === 'Mid-Tier (50k-200k)') return aud >= 50000 && aud <= 200000;
        if (filterFollowers === 'Macro (200k-1M)') return aud >= 200000 && aud <= 1000000;
        if (filterFollowers === 'Mega (1M+)') return aud > 1000000;
        return true;
      });
    }

    // Verified only filter
    if (verifiedOnly) {
      result = result.filter(c => c.verifiedBadge);
    }

    // Min Engagement filter
    if (minEngagement > 0) {
      result = result.filter(c => c.metrics.engagementRate >= minEngagement);
    }

    // Sorting
    return [...result].sort((a, b) => {
      if (sortBy === 'followers') return b.metrics.totalAudience - a.metrics.totalAudience;
      if (sortBy === 'engagement') return b.metrics.engagementRate - a.metrics.engagementRate;
      if (sortBy === 'price_low') {
        const pA = a.packages[0]?.priceInINR || 6000;
        const pB = b.packages[0]?.priceInINR || 6000;
        return pA - pB;
      }
      if (sortBy === 'price_high') {
        const pA = a.packages[0]?.priceInINR || 6000;
        const pB = b.packages[0]?.priceInINR || 6000;
        return pB - pA;
      }
      return 0; // relevance
    });
  }, [enrichedCreators, searchQuery, selectedCategory, filterPlatform, filterLocation, filterBudget, filterFollowers, filterLanguage, verifiedOnly, minEngagement, sortBy]);

  // Displayed items count based on "View All"
  const visibleCreators = useMemo(() => {
    if (viewAllActive || searchQuery.trim() || selectedCategory || filterPlatform !== 'All' || filterBudget !== 'All') {
      return filteredCreators;
    }
    return filteredCreators.slice(0, 6);
  }, [filteredCreators, viewAllActive, searchQuery, selectedCategory, filterPlatform, filterBudget]);

  // Handlers
  const handleToggleSave = (creatorId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (savedCreatorIds.includes(creatorId)) {
      setSavedCreatorIds(prev => prev.filter(id => id !== creatorId));
      onShowToast('Removed from Saved Creators.');
    } else {
      setSavedCreatorIds(prev => [...prev, creatorId]);
      onShowToast('Added to Saved Creators! Sidebar updated.');
    }
  };

  const handleToggleCompare = (creatorId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (comparedCreatorIds.includes(creatorId)) {
      setComparedCreatorIds(prev => prev.filter(id => id !== creatorId));
      onShowToast('Removed from comparison list.');
    } else {
      if (comparedCreatorIds.length >= 4) {
        onShowToast('You can compare up to 4 creators side-by-side.');
        return;
      }
      setComparedCreatorIds(prev => [...prev, creatorId]);
      onShowToast('Added to Compare matrix! Check Compare Creators tab.');
    }
  };

  const handlePopularSearchClick = (term: string) => {
    setSearchQuery(term);
    setSelectedCategory(null);
    onShowToast(`Filtered creators for "${term}"`);
  };

  const handleRunSmartMatch = () => {
    setSmartMatchOpen(false);
    setSearchQuery(smartMatchCategory);
    onShowToast(`SmartMatch algorithm found 4 high-match creators for ${smartMatchObjective}!`);
  };

  const handleOpenCollabRequest = (creator: CreatorProfile, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCollabTargetCreator(creator);
    setCollabCampaignName(`Brand Collaboration with ${creator.fullName}`);
    setCollabBudgetINR(creator.packages[0]?.priceInINR || 12000);
    setCollabModalOpen(true);
  };

  const handleSubmitCollabRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collabTargetCreator) return;

    const newReq: OutgoingCollabRequest = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      creatorId: collabTargetCreator.id,
      creatorName: collabTargetCreator.fullName,
      creatorHandle: collabTargetCreator.handle,
      avatarUrl: collabTargetCreator.avatarUrl,
      campaignName: collabCampaignName || `Campaign with ${collabTargetCreator.fullName}`,
      budgetINR: collabBudgetINR,
      deadline: collabDeadline,
      deliverables: [collabDeliverables],
      briefText: collabBrief || 'Brief guidelines supplied in collaboration dashboard.',
      status: 'Pending',
      submittedAt: 'Just now',
      escrowFunded: false
    };

    setOutgoingRequests(prev => [newReq, ...prev]);
    if (onBookingSubmitted && collabTargetCreator) {
      onBookingSubmitted({
        packageId: collabTargetCreator.packages[0]?.id || 'pkg-collab',
        packageName: collabCampaignName || `Campaign with ${collabTargetCreator.fullName}`,
        basePriceINR: collabBudgetINR,
        selectedAddOns: [],
        totalPriceINR: collabBudgetINR,
        brandName: _currentUser?.companyName || _currentUser?.name || 'Verified Brand Partner',
        contactName: _currentUser?.name || 'Brand Lead',
        contactEmail: _currentUser?.email || 'brand@creatorly.com',
        companyWebsite: '',
        campaignObjective: 'Brand Growth & Product Awareness',
        targetAudience: 'Target Audience in Niche',
        preferredDate: collabDeadline,
        campaignBrief: collabBrief || 'Brief guidelines supplied in collaboration dashboard.',
        exclusivityRequested: false,
        submittedAt: 'Just now',
        referenceId: newReq.id
      }, collabTargetCreator);
    }
    setCollabModalOpen(false);
    onShowToast(`Collaboration request sent to ${collabTargetCreator.fullName}! View in Collaboration Requests tab.`);
  };

  // Helper formatting
  const formatMoney = (amountINR: number) => {
    return formatCurrency(amountINR, currentCurrency);
  };

  const formatAudience = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${Math.round(num / 1000)}K`;
    return `${num}`;
  };

  // Chat message send handler with realistic automated reply
  const handleSendMessage = () => {
    if (!chatInputText.trim()) return;
    const activeConv = brandConversations.find(c => c.id === activeConversationId);
    if (!activeConv) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'brand',
      text: chatInputText.trim(),
      timestamp: 'Just now'
    };

    const updatedConversations = brandConversations.map(conv => {
      if (conv.id === activeConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMsg],
          unread: false
        };
      }
      return conv;
    });

    setBrandConversations(updatedConversations);
    const sentText = chatInputText.trim();
    setChatInputText('');

    // Simulate creator reply after 1.4s
    setTimeout(() => {
      const creatorReply: ChatMessage = {
        id: `m-reply-${Date.now()}`,
        sender: 'creator',
        text: `Thanks for the details! I have noted "${sentText.slice(0, 30)}...". I will review our shooting schedule and confirm shortly! 🚀`,
        timestamp: 'Just now'
      };

      setBrandConversations(prev => prev.map(c => {
        if (c.id === activeConversationId) {
          return {
            ...c,
            messages: [...c.messages, creatorReply]
          };
        }
        return c;
      }));
      onShowToast(`New response received from ${activeConv.creatorName}!`);
    }, 1400);
  };

  // Quick reply chip click
  const handleQuickChipClick = (chipText: string) => {
    setChatInputText(chipText);
  };

  // Fund Escrow for an accepted request
  const handleFundEscrow = (req: OutgoingCollabRequest) => {
    if (escrowWalletBalanceINR < req.budgetINR) {
      onShowToast(`Insufficient escrow balance. Please add at least ${formatMoney(req.budgetINR)}.`);
      setRequestToFund(req);
      setAddFundsModalOpen(true);
      return;
    }

    setEscrowWalletBalanceINR(prev => prev - req.budgetINR);
    setOutgoingRequests(prev => prev.map(r => {
      if (r.id === req.id) {
        return {
          ...r,
          status: 'In Production',
          escrowFunded: true
        };
      }
      return r;
    }));

    onShowToast(`₹${req.budgetINR.toLocaleString('en-IN')} secured in Creatorly Escrow! ${req.creatorName} notified to begin production.`);
    if (selectedRequestForDrawer?.id === req.id) {
      setSelectedRequestForDrawer(prev => prev ? { ...prev, status: 'In Production', escrowFunded: true } : null);
    }
  };

  // Start new chat with any creator
  const handleStartChatWithCreator = (creator: CreatorProfile) => {
    const existing = brandConversations.find(c => c.creatorId === creator.id);
    if (existing) {
      setActiveConversationId(existing.id);
      setActiveTab('messages');
      return;
    }

    const newConv: BrandConversation = {
      id: `b-conv-${Date.now()}`,
      creatorId: creator.id,
      creatorName: creator.fullName,
      handle: creator.handle,
      avatar: creator.avatarUrl,
      niche: creator.primaryNiche,
      startingPrice: creator.packages[0]?.priceInINR || 6000,
      unread: false,
      status: 'Active Negotiation',
      messages: [
        {
          id: `m-init-${Date.now()}`,
          sender: 'brand',
          text: `Hi ${creator.fullName}! We are reaching out from ${brandProfile.companyName} regarding an upcoming sponsored campaign.`,
          timestamp: 'Just now'
        }
      ]
    };

    setBrandConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setActiveTab('messages');
    onShowToast(`Started chat thread with ${creator.fullName}.`);
  };

  // Convert Shortlist to Campaign
  const handleConvertShortlistToCampaign = (shortlist: ShortlistItem) => {
    const shortlistedCreatorsList = enrichedCreators.filter(c => shortlist.creatorIds.includes(c.id));
    const estimatedBudget = shortlistedCreatorsList.reduce((sum, c) => sum + (c.packages[0]?.priceInINR || 6000), 0);

    const newCamp: BrandCampaign = {
      id: `camp-${Date.now()}`,
      name: `${shortlist.name} Campaign`,
      objective: shortlist.description || 'Campaign created from shortlist',
      status: 'Active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalBudgetINR: estimatedBudget || 35000,
      spentBudgetINR: 0,
      creatorIds: shortlist.creatorIds,
      deliverablesCount: shortlist.creatorIds.length * 2,
      completedDeliverablesCount: 0,
      milestones: [
        { id: `ms-1-${Date.now()}`, label: 'Creator Shortlist Locked In', completed: true },
        { id: `ms-2-${Date.now()}`, label: 'Send Out Collaboration Briefs', completed: false },
        { id: `ms-3-${Date.now()}`, label: 'Review Initial Creative Drafts', completed: false },
        { id: `ms-4-${Date.now()}`, label: 'Deliverables Published & Verified', completed: false }
      ]
    };

    setCampaigns(prev => [newCamp, ...prev]);
    saveCampaignToSupabase(newCamp);
    setActiveTab('campaigns');
    onShowToast(`Converted "${shortlist.name}" into a live Campaign! Tracking started.`);
  };

  // Save current search to Saved Searches
  const handleSaveCurrentSearch = () => {
    const title = searchQuery 
      ? `Search: "${searchQuery}"`
      : selectedCategory 
        ? `${selectedCategory} Creators in ${filterLocation === 'All' ? 'India' : filterLocation}`
        : `Custom Filter: ${filterPlatform} (${filterBudget})`;

    const newSearch: BrandSavedSearch = {
      id: `ss-${Date.now()}`,
      title: newSearchTitle.trim() || title,
      query: searchQuery,
      category: selectedCategory,
      platform: filterPlatform,
      location: filterLocation,
      budget: filterBudget,
      alertFrequency: 'Daily',
      matchedCount: filteredCreators.length,
      savedAt: 'Just now'
    };

    setSavedSearches(prev => [newSearch, ...prev]);
    setSaveSearchModalOpen(false);
    setNewSearchTitle('');
    onShowToast('Search parameters saved! Easily access in Saved Searches.');
  };

  // Apply saved search parameters
  const handleApplySavedSearch = (ss: BrandSavedSearch) => {
    setSearchQuery(ss.query || '');
    setSelectedCategory(ss.category);
    setFilterPlatform(ss.platform || 'All');
    setFilterLocation(ss.location || 'All');
    setFilterBudget(ss.budget || 'All');
    setActiveTab('discover');
    onShowToast(`Applied saved search: "${ss.title}" (${ss.matchedCount} creators)`);
  };

  // Active unread count for sidebar badge
  const unreadMessagesCount = brandConversations.filter(c => c.unread).length;
  const activeRequestsCount = outgoingRequests.filter(r => r.status === 'Pending' || r.status === 'Accepted' || r.status === 'In Discussion').length;
  const activeCampaignsCount = campaigns.filter(c => c.status === 'Active').length;

  return (
    <div className="bd-app-container">
      {/* ───────────────────────────────────────────────────────────────────
          1. Left Sidebar Navigation (Deep Forest Green #16281D)
          ─────────────────────────────────────────────────────────────────── */}
      <aside className={`bd-sidebar ${mobileSidebarOpen ? 'open' : ''}`}>
        <div className="bd-sidebar-header">
          <button 
            type="button" 
            className="bd-logo-area"
            onClick={() => {
              if (onReturnToHome) onReturnToHome();
              else setActiveTab('discover');
            }}
            title="Return to Creatorly Storefront Homepage"
          >
            <CreatorlyLogo width={24} height={20} />
            <span className="bd-logo-text">Creatorly</span>
          </button>
          {mobileSidebarOpen && (
            <button 
              type="button" 
              className="bd-top-icon-btn" 
              style={{ color: '#FFFFFF' }}
              onClick={() => setMobileSidebarOpen(false)}
            >
              <X size={18} />
            </button>
          )}
        </div>

        <nav className="bd-sidebar-nav">
          <button
            type="button"
            className={`bd-nav-item ${activeTab === 'discover' ? 'active' : ''}`}
            onClick={() => { setActiveTab('discover'); setMobileSidebarOpen(false); }}
          >
            <div className="bd-nav-item-left">
              <Compass size={18} />
              <span>Discover Creators</span>
            </div>
          </button>

          <button
            type="button"
            className={`bd-nav-item ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => { setActiveTab('saved'); setMobileSidebarOpen(false); }}
          >
            <div className="bd-nav-item-left">
              <Heart size={18} />
              <span>Saved Creators</span>
            </div>
            {savedCreatorIds.length > 0 && (
              <span className="bd-nav-badge" style={{ background: 'rgba(255,255,255,0.18)' }}>
                {savedCreatorIds.length}
              </span>
            )}
          </button>

          <button
            type="button"
            className={`bd-nav-item ${activeTab === 'shortlists' ? 'active' : ''}`}
            onClick={() => { setActiveTab('shortlists'); setMobileSidebarOpen(false); }}
          >
            <div className="bd-nav-item-left">
              <Bookmark size={18} />
              <span>My Shortlists</span>
            </div>
            <span className="bd-nav-badge" style={{ background: 'rgba(255,255,255,0.18)' }}>
              {shortlists.length}
            </span>
          </button>

          <button
            type="button"
            className={`bd-nav-item ${activeTab === 'compare' ? 'active' : ''}`}
            onClick={() => { setActiveTab('compare'); setMobileSidebarOpen(false); }}
          >
            <div className="bd-nav-item-left">
              <SlidersHorizontal size={18} />
              <span>Compare Creators</span>
            </div>
            {comparedCreatorIds.length > 0 && (
              <span className="bd-nav-badge" style={{ background: 'var(--bd-forest-green)' }}>
                {comparedCreatorIds.length}
              </span>
            )}
          </button>

          <button
            type="button"
            className={`bd-nav-item ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => { setActiveTab('messages'); setMobileSidebarOpen(false); }}
          >
            <div className="bd-nav-item-left">
              <MessageSquare size={18} />
              <span>Messages</span>
            </div>
            {unreadMessagesCount > 0 && (
              <span className="bd-nav-badge">{unreadMessagesCount}</span>
            )}
          </button>

          <button
            type="button"
            className={`bd-nav-item ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => { setActiveTab('requests'); setMobileSidebarOpen(false); }}
          >
            <div className="bd-nav-item-left">
              <Handshake size={18} />
              <span>Collaboration Requests</span>
            </div>
            {activeRequestsCount > 0 && (
              <span className="bd-nav-badge">{activeRequestsCount}</span>
            )}
          </button>

          <button
            type="button"
            className={`bd-nav-item ${activeTab === 'campaigns' ? 'active' : ''}`}
            onClick={() => { setActiveTab('campaigns'); setMobileSidebarOpen(false); }}
          >
            <div className="bd-nav-item-left">
              <Megaphone size={18} />
              <span>Campaigns</span>
            </div>
            {activeCampaignsCount > 0 && (
              <span className="bd-nav-badge" style={{ background: 'rgba(255,255,255,0.15)' }}>
                {activeCampaignsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className={`bd-nav-item ${activeTab === 'saved_searches' ? 'active' : ''}`}
            onClick={() => { setActiveTab('saved_searches'); setMobileSidebarOpen(false); }}
          >
            <div className="bd-nav-item-left">
              <History size={18} />
              <span>Saved Searches</span>
            </div>
            {savedSearches.length > 0 && (
              <span className="bd-nav-badge" style={{ background: 'rgba(255,255,255,0.15)' }}>
                {savedSearches.length}
              </span>
            )}
          </button>

          <button
            type="button"
            className={`bd-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => { setActiveTab('settings'); setMobileSidebarOpen(false); }}
          >
            <div className="bd-nav-item-left">
              <Settings size={18} />
              <span>Settings</span>
            </div>
          </button>
        </nav>

        {/* Ambient Dark Bottom SmartMatch Promo Box in Sidebar */}
        <div className="bd-sidebar-bottom-box">
          <div className="bd-sidebar-box-icon">
            <Sparkles size={16} />
          </div>
          <div className="bd-sidebar-box-title">Need help finding the right creator?</div>
          <div className="bd-sidebar-box-desc">
            Tell us what you're looking for and we'll match you with the best creators.
          </div>
          <button 
            type="button" 
            className="bd-sidebar-box-btn"
            onClick={() => setSmartMatchOpen(true)}
          >
            <span>Try SmartMatch</span>
          </button>
        </div>
      </aside>

      {/* ───────────────────────────────────────────────────────────────────
          2. Main Layout (Top Navigation Bar + Split Content)
          ─────────────────────────────────────────────────────────────────── */}
      <div className="bd-main-wrapper" onClick={() => setActiveFilterDropdown(null)}>
        {/* Top Navigation Bar */}
        <header className="bd-top-nav" onClick={(e) => e.stopPropagation()}>
          <div className="bd-top-left">
            <button 
              type="button" 
              className="bd-mobile-toggle"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open Sidebar Menu"
            >
              <Menu size={20} />
            </button>

            {/* Global Creator Search Input */}
            <div className="bd-global-search">
              <Search size={16} color="#828E86" />
              <input 
                type="text" 
                className="bd-global-search-input"
                placeholder="Search for creators, niches, keywords, or locations..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'discover') setActiveTab('discover');
                }}
              />
              {searchQuery && (
                <button 
                  type="button" 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                  onClick={() => setSearchQuery('')}
                >
                  <X size={14} color="#828E86" />
                </button>
              )}
            </div>
          </div>

          <div className="bd-top-right">
            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button 
                type="button" 
                className="bd-top-icon-btn"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="bd-notif-dot">1</span>
              </button>

              {notifDropdownOpen && (
                <div className="bd-dropdown-menu" style={{ width: 280 }}>
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid #E5E8E4', fontSize: '0.82rem', fontWeight: 700 }}>
                    Brand Notifications
                  </div>
                  <div style={{ padding: '10px 12px', fontSize: '0.8rem', color: '#19201C', lineHeight: 1.4 }}>
                    <strong>Arjun Mehta</strong> accepted your proposal for the <em>AI Coding Assistant</em> campaign.
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#828E86', marginTop: 4 }}>15m ago</span>
                  </div>
                </div>
              )}
            </div>

            {/* Return to Creator Storefront */}
            {onReturnToHome && (
              <button 
                type="button" 
                className="bd-switch-creator-link"
                onClick={onReturnToHome}
                title="Return to Alex Sharma Storefront Homepage"
                style={{ background: '#F1F5F9', color: '#0F172A', borderColor: '#CBD5E1' }}
              >
                <span>Storefront Home</span>
                <ExternalLink size={13} />
              </button>
            )}

            {/* Switch to Creator Experience Link */}
            <button 
              type="button" 
              className="bd-switch-creator-link"
              onClick={onNavigateToWorkspace}
              title="Switch to Creator Workspace"
            >
              <span>For Creators</span>
              <ExternalLink size={13} />
            </button>

            {/* Help Button */}
            <button 
              type="button" 
              className="bd-top-icon-btn"
              onClick={() => setHelpModalOpen(true)}
              aria-label="Help and Documentation"
            >
              <HelpCircle size={18} />
            </button>

            {/* Brand Account User Pill */}
            <div style={{ position: 'relative' }}>
              <button 
                type="button" 
                className="bd-user-pill"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <img 
                  src="/images/talent-maya.jpg" 
                  alt="Sarah Mitchell" 
                  className="bd-user-avatar" 
                />
                <div className="bd-user-meta">
                  <span className="bd-user-name">{brandProfile.companyName.split(' ')[0]}</span>
                  <span className="bd-user-role">Brand Admin</span>
                </div>
                <ChevronDown size={14} color="#828E86" />
              </button>

              {userDropdownOpen && (
                <div className="bd-dropdown-menu">
                  <button 
                    type="button" 
                    className="bd-dropdown-item"
                    onClick={() => { setUserDropdownOpen(false); setActiveTab('settings'); setSettingsSubTab('profile'); }}
                  >
                    <Building size={15} />
                    <span>Company Profile</span>
                  </button>
                  <button 
                    type="button" 
                    className="bd-dropdown-item"
                    onClick={() => { setUserDropdownOpen(false); setActiveTab('settings'); setSettingsSubTab('billing'); }}
                  >
                    <CreditCard size={15} />
                    <span>Billing & Escrow ({formatMoney(escrowWalletBalanceINR)})</span>
                  </button>
                  <button 
                    type="button" 
                    className="bd-dropdown-item"
                    onClick={() => { setUserDropdownOpen(false); onNavigateToWorkspace(); }}
                  >
                    <ExternalLink size={15} />
                    <span>Switch to Creator Studio</span>
                  </button>
                  <div className="bd-dropdown-divider" />
                  <button 
                    type="button" 
                    className="bd-dropdown-item"
                    style={{ color: '#DC2626' }}
                    onClick={() => {
                      setUserDropdownOpen(false);
                      if (onLogout) onLogout();
                      else onShowToast('Logged out from brand account.');
                    }}
                  >
                    <LogOut size={15} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ───────────────────────────────────────────────────────────────────
            3. Split View: Center Content + Right Supporting Sidebar
            ─────────────────────────────────────────────────────────────────── */}
        <div className="bd-content-layout">
          {/* =================================================================
              CENTER COLUMN: Dynamic Tab Content
              ================================================================= */}
          <main className="bd-center-col" style={{ width: activeTab === 'discover' ? undefined : '100%' }}>
            {/* ═════════════════════════════════════════════════════════════════
                TAB 1: DISCOVER CREATORS
                ═════════════════════════════════════════════════════════════════ */}
            {activeTab === 'discover' && (
              <>
                {/* Section A: Hero Banner */}
                <section className="bd-hero-card">
                  <div className="bd-hero-left">
                    <h1 className="bd-hero-title">Find the perfect creator for your brand</h1>
                    <p className="bd-hero-subtext">
                      Discover, compare and collaborate with global creators across every niche. Transparent pricing. Real profiles. Direct connection.
                    </p>

                    <div className="bd-hero-search-box">
                      <input 
                        type="text" 
                        className="bd-hero-search-input"
                        placeholder="e.g. fitness creator in India, budget under 10k, Instagram reels..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            onShowToast(`Filtered creators for "${searchQuery}"`);
                          }
                        }}
                      />
                      <button 
                        type="button" 
                        className="bd-hero-search-btn"
                        onClick={() => onShowToast(`Filtered creators for "${searchQuery}"`)}
                      >
                        <Search size={15} />
                        <span>Search</span>
                      </button>
                    </div>
                  </div>

                  {/* Hero Right Visual Card with Overlaid Floating Pills */}
                  <div className="bd-hero-visual">
                    <div className="bd-hero-photo-wrap">
                      <img 
                        src="/images/brand-hero-travel.jpg" 
                        alt="Travel Creator Spotlight" 
                        className="bd-hero-photo"
                      />
                      <div className="bd-floating-tag bd-tag-travel">
                        <span>🌲</span>
                        <span>Travel</span>
                      </div>
                      <div className="bd-floating-tag bd-tag-lifestyle">
                        <span>🍃</span>
                        <span>Lifestyle</span>
                      </div>
                      <div className="bd-floating-tag bd-tag-instagram">
                        <span>📷</span>
                        <span>Instagram</span>
                      </div>

                      <div className="bd-floating-creator-chip">
                        <div className="bd-chip-profile">
                          <img 
                            src="/images/riya-kapoor.jpg" 
                            alt="Sara Travel" 
                            className="bd-chip-avatar" 
                          />
                          <span className="bd-chip-handle">@travelwithsara</span>
                        </div>
                        <div className="bd-chip-stats">
                          <span>246k followers</span>
                          <span>•</span>
                          <span style={{ color: '#B45309', fontWeight: 600 }}>4.8 ★</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section B: Browse by Category */}
                <section className="bd-categories-section">
                  <div className="bd-section-header-row">
                    <h2 className="bd-section-title">Browse by Category</h2>
                    {selectedCategory && (
                      <button 
                        type="button" 
                        className="bd-section-link"
                        onClick={() => setSelectedCategory(null)}
                      >
                        Clear category ({selectedCategory})
                      </button>
                    )}
                  </div>

                  <div className="bd-category-tiles-scroll">
                    {BROWSE_CATEGORIES.map(cat => {
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <div 
                          key={cat.id}
                          className={`bd-category-tile ${isSelected ? 'active' : ''}`}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedCategory(null);
                            } else {
                              setSelectedCategory(cat.id);
                              onShowToast(`Filtered by ${cat.label}`);
                            }
                          }}
                        >
                          <div className={`bd-category-icon-wrap ${cat.className}`}>
                            {cat.icon}
                          </div>
                          <span className="bd-category-label">{cat.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Section C: Filters & Sort Controls Bar */}
                <section className="bd-filter-bar" onClick={(e) => e.stopPropagation()}>
                  <div className="bd-filter-pills-row">
                    {/* Platform Filter Dropdown */}
                    <div className="bd-filter-wrapper">
                      <button 
                        type="button" 
                        className={`bd-filter-btn ${filterPlatform !== 'All' ? 'active' : ''}`}
                        onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'platform' ? null : 'platform')}
                      >
                        <span>Platform: {filterPlatform}</span>
                        <ChevronDown size={13} />
                      </button>
                      {activeFilterDropdown === 'platform' && (
                        <div className="bd-filter-dropdown-menu">
                          {['All', 'Instagram', 'YouTube', 'LinkedIn', 'TikTok'].map(p => (
                            <button
                              key={p}
                              type="button"
                              className={`bd-filter-dropdown-item ${filterPlatform === p ? 'selected' : ''}`}
                              onClick={() => { setFilterPlatform(p); setActiveFilterDropdown(null); }}
                            >
                              <span>{p}</span>
                              {filterPlatform === p && <Check size={14} color="#15803D" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Location Filter Dropdown */}
                    <div className="bd-filter-wrapper">
                      <button 
                        type="button" 
                        className={`bd-filter-btn ${filterLocation !== 'All' ? 'active' : ''}`}
                        onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'location' ? null : 'location')}
                      >
                        <span>Location: {filterLocation}</span>
                        <ChevronDown size={13} />
                      </button>
                      {activeFilterDropdown === 'location' && (
                        <div className="bd-filter-dropdown-menu">
                          {['All', 'Delhi', 'Mumbai', 'Bengaluru', 'Pune', 'Gurgaon'].map(loc => (
                            <button
                              key={loc}
                              type="button"
                              className={`bd-filter-dropdown-item ${filterLocation === loc ? 'selected' : ''}`}
                              onClick={() => { setFilterLocation(loc); setActiveFilterDropdown(null); }}
                            >
                              <span>{loc}</span>
                              {filterLocation === loc && <Check size={14} color="#15803D" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Budget Filter Dropdown */}
                    <div className="bd-filter-wrapper">
                      <button 
                        type="button" 
                        className={`bd-filter-btn ${filterBudget !== 'All' ? 'active' : ''}`}
                        onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'budget' ? null : 'budget')}
                      >
                        <span>Budget: {filterBudget}</span>
                        <ChevronDown size={13} />
                      </button>
                      {activeFilterDropdown === 'budget' && (
                        <div className="bd-filter-dropdown-menu">
                          {['All', '<10k', '10k-25k', '25k-50k', '50k+'].map(b => (
                            <button
                              key={b}
                              type="button"
                              className={`bd-filter-dropdown-item ${filterBudget === b ? 'selected' : ''}`}
                              onClick={() => { setFilterBudget(b); setActiveFilterDropdown(null); }}
                            >
                              <span>{b === '<10k' ? '< ₹10,000' : b === '10k-25k' ? '₹10k - ₹25k' : b === '25k-50k' ? '₹25k - ₹50k' : b === '50k+' ? '₹50,000+' : 'All Budgets'}</span>
                              {filterBudget === b && <Check size={14} color="#15803D" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Followers Filter Dropdown */}
                    <div className="bd-filter-wrapper">
                      <button 
                        type="button" 
                        className={`bd-filter-btn ${filterFollowers !== 'All' ? 'active' : ''}`}
                        onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'followers' ? null : 'followers')}
                      >
                        <span>Followers: {filterFollowers}</span>
                        <ChevronDown size={13} />
                      </button>
                      {activeFilterDropdown === 'followers' && (
                        <div className="bd-filter-dropdown-menu">
                          {['All', 'Nano (<10k)', 'Micro (10k-50k)', 'Mid-Tier (50k-200k)', 'Macro (200k-1M)', 'Mega (1M+)'].map(f => (
                            <button
                              key={f}
                              type="button"
                              className={`bd-filter-dropdown-item ${filterFollowers === f ? 'selected' : ''}`}
                              onClick={() => { setFilterFollowers(f); setActiveFilterDropdown(null); }}
                            >
                              <span>{f}</span>
                              {filterFollowers === f && <Check size={14} color="#15803D" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Language Filter Dropdown */}
                    <div className="bd-filter-wrapper">
                      <button 
                        type="button" 
                        className={`bd-filter-btn ${filterLanguage !== 'All' ? 'active' : ''}`}
                        onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'language' ? null : 'language')}
                      >
                        <span>Language: {filterLanguage}</span>
                        <ChevronDown size={13} />
                      </button>
                      {activeFilterDropdown === 'language' && (
                        <div className="bd-filter-dropdown-menu">
                          {['All', 'English', 'Hindi', 'Punjabi', 'Bengali', 'Tamil'].map(lang => (
                            <button
                              key={lang}
                              type="button"
                              className={`bd-filter-dropdown-item ${filterLanguage === lang ? 'selected' : ''}`}
                              onClick={() => { setFilterLanguage(lang); setActiveFilterDropdown(null); }}
                            >
                              <span>{lang}</span>
                              {filterLanguage === lang && <Check size={14} color="#15803D" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* More Filters Action */}
                    <button 
                      type="button" 
                      className={`bd-filter-btn ${verifiedOnly || minEngagement > 0 ? 'active' : ''}`}
                      onClick={() => setMoreFiltersModalOpen(true)}
                    >
                      <SlidersHorizontal size={13} />
                      <span>More Filters {verifiedOnly || minEngagement > 0 ? '(Active)' : ''}</span>
                    </button>
                  </div>

                  {/* Sort By Dropdown */}
                  <div className="bd-sort-select-wrap">
                    <span>Sort by:</span>
                    <select 
                      className="bd-sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                    >
                      <option value="relevance">Most Relevant</option>
                      <option value="followers">Highest Followers</option>
                      <option value="engagement">Best Engagement</option>
                      <option value="price_low">Lowest Price</option>
                      <option value="price_high">Highest Price</option>
                    </select>
                  </div>
                </section>

                {/* Active Filter Chips and Save Search Action Bar */}
                {(selectedCategory || filterPlatform !== 'All' || filterLocation !== 'All' || filterBudget !== 'All' || filterFollowers !== 'All' || filterLanguage !== 'All' || verifiedOnly || minEngagement > 0) && (
                  <div className="bd-active-tags-bar">
                    <span style={{ fontSize: '0.78rem', color: '#828E86', fontWeight: 600 }}>Active Filters:</span>
                    {selectedCategory && (
                      <span className="bd-active-tag-chip">
                        Category: {selectedCategory}
                        <button type="button" onClick={() => setSelectedCategory(null)}><X size={12} /></button>
                      </span>
                    )}
                    {filterPlatform !== 'All' && (
                      <span className="bd-active-tag-chip">
                        Platform: {filterPlatform}
                        <button type="button" onClick={() => setFilterPlatform('All')}><X size={12} /></button>
                      </span>
                    )}
                    {filterLocation !== 'All' && (
                      <span className="bd-active-tag-chip">
                        Location: {filterLocation}
                        <button type="button" onClick={() => setFilterLocation('All')}><X size={12} /></button>
                      </span>
                    )}
                    {filterBudget !== 'All' && (
                      <span className="bd-active-tag-chip">
                        Budget: {filterBudget}
                        <button type="button" onClick={() => setFilterBudget('All')}><X size={12} /></button>
                      </span>
                    )}
                    {filterFollowers !== 'All' && (
                      <span className="bd-active-tag-chip">
                        Followers: {filterFollowers}
                        <button type="button" onClick={() => setFilterFollowers('All')}><X size={12} /></button>
                      </span>
                    )}
                    {filterLanguage !== 'All' && (
                      <span className="bd-active-tag-chip">
                        Language: {filterLanguage}
                        <button type="button" onClick={() => setFilterLanguage('All')}><X size={12} /></button>
                      </span>
                    )}
                    {verifiedOnly && (
                      <span className="bd-active-tag-chip">
                        Verified Only
                        <button type="button" onClick={() => setVerifiedOnly(false)}><X size={12} /></button>
                      </span>
                    )}
                    {minEngagement > 0 && (
                      <span className="bd-active-tag-chip">
                        Engagement &gt; {minEngagement}%
                        <button type="button" onClick={() => setMinEngagement(0)}><X size={12} /></button>
                      </span>
                    )}
                    <button 
                      type="button" 
                      className="bd-save-search-action-btn"
                      onClick={() => setSaveSearchModalOpen(true)}
                    >
                      <Plus size={13} />
                      <span>Save This Search</span>
                    </button>
                    <button 
                      type="button" 
                      style={{ background: 'none', border: 'none', color: '#DC2626', fontSize: '0.78rem', cursor: 'pointer', marginLeft: 'auto', fontWeight: 600 }}
                      onClick={() => {
                        setSelectedCategory(null);
                        setFilterPlatform('All');
                        setFilterLocation('All');
                        setFilterBudget('All');
                        setFilterFollowers('All');
                        setFilterLanguage('All');
                        setVerifiedOnly(false);
                        setMinEngagement(0);
                      }}
                    >
                      Reset All
                    </button>
                  </div>
                )}

                {/* Section D: Top Creators For You Grid */}
                <section>
                  <div className="bd-section-header-row" style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <h2 className="bd-section-title">Top Creators for You</h2>
                      <span style={{ fontSize: '0.82rem', color: '#59655E' }}>({filteredCreators.length} Available)</span>
                    </div>
                    <button 
                      type="button" 
                      className="bd-section-link"
                      onClick={() => setViewAllActive(!viewAllActive)}
                    >
                      <span>{viewAllActive ? 'Show Less' : 'View All'}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  {visibleCreators.length === 0 ? (
                    <div style={{ padding: 48, textAlign: 'center', background: '#FFFFFF', borderRadius: 16, border: '1px solid #E5E8E4' }}>
                      <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#19201C' }}>No creators matched your criteria</p>
                      <p style={{ fontSize: '0.86rem', color: '#59655E', marginBottom: 16 }}>Try clearing your filters or search query to see all available creators.</p>
                      <button 
                        type="button" 
                        className="bd-hero-search-btn"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory(null);
                          setFilterPlatform('All');
                          setFilterLocation('All');
                          setFilterBudget('All');
                          setFilterFollowers('All');
                          setFilterLanguage('All');
                          setVerifiedOnly(false);
                          setMinEngagement(0);
                        }}
                      >
                        Reset All Filters
                      </button>
                    </div>
                  ) : (
                    <div className="bd-creators-grid">
                      {visibleCreators.map(creator => {
                        const isSaved = savedCreatorIds.includes(creator.id);
                        const isCompared = comparedCreatorIds.includes(creator.id);
                        const startingPrice = creator.packages[0]?.priceInINR || 6000;
                        const coverImg = (creator as any).coverPattern?.startsWith('/images') 
                          ? (creator as any).coverPattern 
                          : '/images/creator-card-tech.jpg';

                        return (
                          <div 
                            key={creator.id} 
                            className="bd-creator-card"
                            onClick={() => onSelectCreator(creator)}
                          >
                            {/* Card Photo Area */}
                            <div className="bd-card-photo-area">
                              <img 
                                src={coverImg} 
                                alt={creator.fullName} 
                                className="bd-card-cover-img" 
                              />
                              <div className="bd-card-niche-pill">
                                {creator.primaryNiche.split(' ')[0]}
                              </div>
                              <button 
                                type="button" 
                                className={`bd-card-heart-btn ${isSaved ? 'saved' : ''}`}
                                onClick={(e) => handleToggleSave(creator.id, e)}
                                title={isSaved ? 'Remove from Saved' : 'Save Creator'}
                              >
                                <Heart size={15} fill={isSaved ? '#DC2626' : 'none'} color={isSaved ? '#DC2626' : '#FFFFFF'} />
                              </button>
                              <div className="bd-card-verified-tag">
                                <Star size={10} fill="#FBBF24" color="#FBBF24" />
                                <span>Verified</span>
                              </div>
                            </div>

                            {/* Card Body */}
                            <div className="bd-card-body">
                              <div className="bd-card-creator-row">
                                <img 
                                  src={creator.avatarUrl} 
                                  alt={creator.fullName} 
                                  className="bd-card-avatar" 
                                />
                                <div className="bd-card-identity">
                                  <span className="bd-card-name">{creator.fullName}</span>
                                  <span className="bd-card-handle">{creator.handle}</span>
                                </div>
                              </div>

                              <div className="bd-card-location-row">
                                <div className="bd-card-location-item">
                                  <MapPin size={12} color="#828E86" />
                                  <span>{creator.location.city}, {creator.location.country}</span>
                                </div>
                                <span>•</span>
                                <div className="bd-card-location-item">
                                  <Globe2 size={12} color="#828E86" />
                                  <span>{creator.languages.join(', ')}</span>
                                </div>
                              </div>

                              {/* 3 Metrics */}
                              <div className="bd-card-metrics-grid">
                                <div>
                                  <div className="bd-metric-val">{formatAudience(creator.metrics.totalAudience)}</div>
                                  <div className="bd-metric-lbl">Followers</div>
                                </div>
                                <div>
                                  <div className="bd-metric-val">{creator.metrics.engagementRate}%</div>
                                  <div className="bd-metric-lbl">Engagement</div>
                                </div>
                                <div>
                                  <div className="bd-metric-val">
                                    {(creator as any).collabsCount || (creator.metrics.engagementRate > 5 ? 28 : 15)}
                                  </div>
                                  <div className="bd-metric-lbl">Collabs</div>
                                </div>
                              </div>

                              {/* Tier Badge & Starting Price */}
                              <div className="bd-card-tier-price-row">
                                <div className={`bd-card-tier-chip ${
                                  creator.metrics.totalAudience > 500000 ? 'tier-supreme' :
                                  creator.metrics.totalAudience > 300000 ? 'tier-elite' : 'tier-established'
                                }`}>
                                  <Star size={10} />
                                  <span>
                                    {creator.metrics.totalAudience > 500000 ? 'Supreme Creator' :
                                     creator.metrics.totalAudience > 300000 ? 'Elite Creator' : 'Established Creator'}
                                  </span>
                                </div>
                                <div className="bd-card-price-display">
                                  From <span className="bd-card-price-val">{formatMoney(startingPrice)}</span>
                                </div>
                              </div>

                              {/* Actions Footer */}
                              <div className="bd-card-actions-footer">
                                <button 
                                  type="button" 
                                  className="bd-card-view-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectCreator(creator);
                                  }}
                                >
                                  View Profile
                                </button>
                                <button 
                                  type="button" 
                                  className="bd-card-bookmark-btn"
                                  onClick={(e) => handleOpenCollabRequest(creator, e)}
                                  title="Send Collaboration Request"
                                  style={{ color: '#15803D' }}
                                >
                                  <Send size={14} />
                                </button>
                                <button 
                                  type="button" 
                                  className="bd-card-bookmark-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStartChatWithCreator(creator);
                                  }}
                                  title="Message Creator"
                                  style={{ color: '#2563EB' }}
                                >
                                  <MessageSquare size={14} />
                                </button>
                                <button 
                                  type="button" 
                                  className={`bd-card-bookmark-btn ${isCompared ? 'shortlisted' : ''}`}
                                  onClick={(e) => handleToggleCompare(creator.id, e)}
                                  title={isCompared ? 'In Compare matrix' : 'Compare Creator'}
                                >
                                  <SlidersHorizontal size={14} />
                                </button>
                                <button 
                                  type="button" 
                                  className="bd-card-bookmark-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCreatorForShortlist(creator);
                                    setShortlistModalOpen(true);
                                  }}
                                  title="Add to Shortlist"
                                >
                                  <Bookmark size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              </>
            )}

            {/* ═════════════════════════════════════════════════════════════════
                TAB 2: SAVED CREATORS
                ═════════════════════════════════════════════════════════════════ */}
            {activeTab === 'saved' && (
              <div style={{ background: '#FFFFFF', padding: 32, borderRadius: 16, border: '1px solid #E5E8E4' }}>
                <div className="bd-saved-page-header">
                  <div>
                    <h2 className="bd-section-title" style={{ fontSize: '1.45rem' }}>Saved Creators ({savedCreatorIds.length})</h2>
                    <p style={{ fontSize: '0.86rem', color: '#59655E', margin: '4px 0 0 0' }}>
                      Creators bookmarked for upcoming seasonal campaigns, client pitches, and quick bookings.
                    </p>
                  </div>
                  <div className="bd-stats-summary-bar">
                    <div className="bd-stat-block">
                      <span className="bd-stat-block-val">{savedCreatorIds.length}</span>
                      <span className="bd-stat-block-lbl">Saved</span>
                    </div>
                    <div className="bd-stat-block">
                      <span className="bd-stat-block-val">
                        {formatAudience(
                          enrichedCreators
                            .filter(c => savedCreatorIds.includes(c.id))
                            .reduce((sum, c) => sum + c.metrics.totalAudience, 0)
                        )}
                      </span>
                      <span className="bd-stat-block-lbl">Combined Reach</span>
                    </div>
                    <button 
                      type="button" 
                      className="bd-hero-search-btn"
                      onClick={() => setActiveTab('discover')}
                    >
                      <Plus size={14} />
                      <span>Browse More Creators</span>
                    </button>
                  </div>
                </div>

                {savedCreatorIds.length === 0 ? (
                  <div style={{ padding: 64, textAlign: 'center', background: '#FAF9F5', borderRadius: 16, border: '1px dashed #CBD5E1' }}>
                    <Heart size={36} color="#94A3B8" style={{ marginBottom: 12 }} />
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#19201C', margin: '0 0 6px 0' }}>No saved creators yet</h3>
                    <p style={{ fontSize: '0.88rem', color: '#59655E', maxWidth: 440, margin: '0 auto 20px auto' }}>
                      Click the heart icon on any creator card in Discover to save them here for quick collaboration.
                    </p>
                    <button type="button" className="bd-hero-search-btn" onClick={() => setActiveTab('discover')}>
                      Explore Discover Marketplace
                    </button>
                  </div>
                ) : (
                  <div className="bd-creators-grid">
                    {enrichedCreators.filter(c => savedCreatorIds.includes(c.id)).map(creator => {
                      const startingPrice = creator.packages[0]?.priceInINR || 6000;
                      return (
                        <div key={creator.id} className="bd-creator-card" onClick={() => onSelectCreator(creator)}>
                          <div className="bd-card-photo-area">
                            <img src={(creator as any).coverPattern || '/images/creator-card-tech.jpg'} alt={creator.fullName} className="bd-card-cover-img" />
                            <div className="bd-card-niche-pill">{creator.primaryNiche.split(' ')[0]}</div>
                            <button type="button" className="bd-card-heart-btn saved" onClick={(e) => handleToggleSave(creator.id, e)} title="Remove from Saved">
                              <Heart size={15} fill="#DC2626" color="#DC2626" />
                            </button>
                          </div>
                          <div className="bd-card-body">
                            <div className="bd-card-creator-row">
                              <img src={creator.avatarUrl} alt={creator.fullName} className="bd-card-avatar" />
                              <div className="bd-card-identity">
                                <span className="bd-card-name">{creator.fullName}</span>
                                <span className="bd-card-handle">{creator.handle}</span>
                              </div>
                            </div>

                            <div className="bd-card-metrics-grid" style={{ margin: '12px 0' }}>
                              <div>
                                <div className="bd-metric-val">{formatAudience(creator.metrics.totalAudience)}</div>
                                <div className="bd-metric-lbl">Followers</div>
                              </div>
                              <div>
                                <div className="bd-metric-val">{creator.metrics.engagementRate}%</div>
                                <div className="bd-metric-lbl">Engagement</div>
                              </div>
                              <div>
                                <div className="bd-metric-val">{formatMoney(startingPrice)}</div>
                                <div className="bd-metric-lbl">Starting Rate</div>
                              </div>
                            </div>

                            {/* Custom Note per Saved Creator */}
                            <div className="bd-saved-notes-area" onClick={(e) => e.stopPropagation()}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, color: '#828E86', fontSize: '0.72rem', fontWeight: 600 }}>
                                <Edit2 size={11} />
                                <span>Brand Notes:</span>
                              </div>
                              <input 
                                type="text"
                                className="bd-saved-notes-input"
                                placeholder="Add notes for this creator (e.g. Q4 festive target)..."
                                value={savedNotes[creator.id] || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setSavedNotes(prev => ({ ...prev, [creator.id]: val }));
                                }}
                              />
                            </div>

                            <div className="bd-card-actions-footer" style={{ marginTop: 14 }}>
                              <button type="button" className="bd-card-view-btn" onClick={() => onSelectCreator(creator)}>
                                View Profile
                              </button>
                              <button 
                                type="button" 
                                className="bd-card-bookmark-btn" 
                                style={{ color: '#15803D' }} 
                                onClick={(e) => handleOpenCollabRequest(creator, e)}
                                title="Send Collab Request"
                              >
                                <Send size={14} />
                              </button>
                              <button 
                                type="button" 
                                className="bd-card-bookmark-btn" 
                                style={{ color: '#2563EB' }} 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartChatWithCreator(creator);
                                }}
                                title="Message"
                              >
                                <MessageSquare size={14} />
                              </button>
                              <button 
                                type="button" 
                                className="bd-card-bookmark-btn" 
                                style={{ color: '#DC2626' }}
                                onClick={(e) => handleToggleSave(creator.id, e)}
                                title="Remove from Saved"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════
                TAB 3: MY SHORTLISTS
                ═════════════════════════════════════════════════════════════════ */}
            {activeTab === 'shortlists' && (
              <div style={{ background: '#FFFFFF', padding: 32, borderRadius: 16, border: '1px solid #E5E8E4' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <h2 className="bd-section-title" style={{ fontSize: '1.45rem' }}>Campaign Shortlists</h2>
                    <p style={{ fontSize: '0.86rem', color: '#59655E', margin: '4px 0 0 0' }}>
                      Organize creators into campaign bundles, evaluate total audience, and convert shortlists into live campaigns.
                    </p>
                  </div>
                  <button 
                    type="button" 
                    className="bd-hero-search-btn"
                    onClick={() => {
                      setNewShortlistName('');
                      setNewShortlistDesc('');
                      setShortlistModalOpen(true);
                    }}
                  >
                    <Plus size={14} />
                    <span>Create New Shortlist</span>
                  </button>
                </div>

                {/* Shortlists Navigation Tabs */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                  {shortlists.map(sl => (
                    <button 
                      key={sl.id}
                      type="button"
                      style={{
                        padding: '9px 18px',
                        borderRadius: 999,
                        background: selectedShortlistId === sl.id ? '#16281D' : '#FAF9F5',
                        color: selectedShortlistId === sl.id ? '#FFFFFF' : '#19201C',
                        border: '1px solid #E5E8E4',
                        fontWeight: 600,
                        fontSize: '0.86rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        transition: 'all 0.15s ease'
                      }}
                      onClick={() => setSelectedShortlistId(sl.id)}
                    >
                      <span>{sl.name}</span>
                      <span style={{ 
                        fontSize: '0.72rem', 
                        padding: '2px 7px', 
                        borderRadius: 999, 
                        background: selectedShortlistId === sl.id ? 'rgba(255,255,255,0.2)' : '#E2E8F0',
                        color: selectedShortlistId === sl.id ? '#FFFFFF' : '#475569'
                      }}>
                        {sl.creatorIds.length}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Active Shortlist Details & Actions Bar */}
                {(() => {
                  const currentSl = shortlists.find(s => s.id === selectedShortlistId);
                  if (!currentSl) return null;
                  const slCreators = enrichedCreators.filter(c => currentSl.creatorIds.includes(c.id));
                  const totalReach = slCreators.reduce((sum, c) => sum + c.metrics.totalAudience, 0);
                  const avgEng = slCreators.length > 0 ? (slCreators.reduce((sum, c) => sum + c.metrics.engagementRate, 0) / slCreators.length).toFixed(1) : 0;
                  const estBudget = slCreators.reduce((sum, c) => sum + (c.packages[0]?.priceInINR || 6000), 0);

                  return (
                    <div>
                      {/* Analytics Banner */}
                      <div className="bd-shortlist-analytics-banner">
                        <div className="bd-shortlist-analytics-card">
                          <span className="bd-stat-block-lbl">Shortlisted Creators</span>
                          <span className="bd-stat-block-val">{slCreators.length}</span>
                        </div>
                        <div className="bd-shortlist-analytics-card">
                          <span className="bd-stat-block-lbl">Combined Follower Reach</span>
                          <span className="bd-stat-block-val">{formatAudience(totalReach)}</span>
                        </div>
                        <div className="bd-shortlist-analytics-card">
                          <span className="bd-stat-block-lbl">Avg. Engagement</span>
                          <span className="bd-stat-block-val" style={{ color: '#15803D' }}>{avgEng}%</span>
                        </div>
                        <div className="bd-shortlist-analytics-card">
                          <span className="bd-stat-block-lbl">Estimated Total Budget</span>
                          <span className="bd-stat-block-val">{formatMoney(estBudget)}</span>
                        </div>
                      </div>

                      {/* Shortlist Action Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, padding: '12px 18px', background: '#FAF9F5', borderRadius: 12, border: '1px solid #E5E8E4' }}>
                        <div>
                          <strong style={{ fontSize: '0.96rem', color: '#19201C' }}>{currentSl.name}</strong>
                          <span style={{ display: 'block', fontSize: '0.8rem', color: '#59655E', marginTop: 2 }}>{currentSl.description}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button 
                            type="button" 
                            className="bd-hero-search-btn"
                            style={{ background: '#15803D', padding: '8px 16px', fontSize: '0.82rem' }}
                            onClick={() => handleConvertShortlistToCampaign(currentSl)}
                          >
                            <Megaphone size={14} />
                            <span>Convert to Live Campaign</span>
                          </button>
                          <button 
                            type="button" 
                            className="bd-save-search-action-btn"
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.href);
                              onShowToast('Shareable shortlist link copied to clipboard!');
                            }}
                          >
                            <Share2 size={13} />
                            <span>Share</span>
                          </button>
                          {shortlists.length > 1 && (
                            <button 
                              type="button" 
                              className="bd-save-search-action-btn"
                              style={{ color: '#DC2626' }}
                              onClick={() => {
                                setShortlists(prev => prev.filter(s => s.id !== currentSl.id));
                                setSelectedShortlistId(shortlists.find(s => s.id !== currentSl.id)?.id || '');
                                onShowToast(`Deleted shortlist "${currentSl.name}".`);
                              }}
                            >
                              <Trash2 size={13} />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Creators in Shortlist */}
                      {slCreators.length === 0 ? (
                        <div style={{ padding: 48, textAlign: 'center', background: '#FAF9F5', borderRadius: 12 }}>
                          <p style={{ fontSize: '0.96rem', fontWeight: 600, color: '#19201C' }}>No creators in this shortlist yet</p>
                          <p style={{ fontSize: '0.84rem', color: '#59655E', marginBottom: 16 }}>Browse Discover and click "Add to Shortlist" on any creator profile.</p>
                          <button type="button" className="bd-hero-search-btn" onClick={() => setActiveTab('discover')}>
                            Browse Discover
                          </button>
                        </div>
                      ) : (
                        <div className="bd-creators-grid">
                          {slCreators.map(creator => (
                            <div key={creator.id} className="bd-creator-card" onClick={() => onSelectCreator(creator)}>
                              <div className="bd-card-photo-area">
                                <img src={(creator as any).coverPattern || '/images/creator-card-tech.jpg'} alt={creator.fullName} className="bd-card-cover-img" />
                                <div className="bd-card-niche-pill">{creator.primaryNiche.split(' ')[0]}</div>
                              </div>
                              <div className="bd-card-body">
                                <div className="bd-card-creator-row">
                                  <img src={creator.avatarUrl} alt={creator.fullName} className="bd-card-avatar" />
                                  <div className="bd-card-identity">
                                    <span className="bd-card-name">{creator.fullName}</span>
                                    <span className="bd-card-handle">{creator.handle}</span>
                                  </div>
                                </div>
                                <div className="bd-card-metrics-grid" style={{ margin: '12px 0' }}>
                                  <div>
                                    <div className="bd-metric-val">{formatAudience(creator.metrics.totalAudience)}</div>
                                    <div className="bd-metric-lbl">Followers</div>
                                  </div>
                                  <div>
                                    <div className="bd-metric-val">{creator.metrics.engagementRate}%</div>
                                    <div className="bd-metric-lbl">Engagement</div>
                                  </div>
                                  <div>
                                    <div className="bd-metric-val">{formatMoney(creator.packages[0]?.priceInINR || 6000)}</div>
                                    <div className="bd-metric-lbl">Rate</div>
                                  </div>
                                </div>
                                <div className="bd-card-actions-footer">
                                  <button type="button" className="bd-card-view-btn" onClick={() => onSelectCreator(creator)}>
                                    View Storefront
                                  </button>
                                  <button 
                                    type="button" 
                                    className="bd-card-bookmark-btn"
                                    style={{ color: '#15803D' }}
                                    onClick={(e) => handleOpenCollabRequest(creator, e)}
                                    title="Send Offer"
                                  >
                                    <Send size={14} />
                                  </button>
                                  <button 
                                    type="button" 
                                    className="bd-card-bookmark-btn"
                                    style={{ color: '#DC2626' }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShortlists(prev => prev.map(s => s.id === currentSl.id ? { ...s, creatorIds: s.creatorIds.filter(id => id !== creator.id) } : s));
                                      onShowToast(`Removed ${creator.fullName} from "${currentSl.name}".`);
                                    }}
                                    title="Remove from shortlist"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════
                TAB 4: COMPARE CREATORS
                ═════════════════════════════════════════════════════════════════ */}
            {activeTab === 'compare' && (
              <div className="bd-compare-matrix-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <h2 className="bd-section-title" style={{ fontSize: '1.45rem' }}>Compare Creators Side-by-Side</h2>
                    <p style={{ fontSize: '0.86rem', color: '#59655E', margin: '4px 0 0 0' }}>
                      Evaluate reach, engagement, package pricing, verified KYC, and turnaround metrics.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {/* Add Creator to Compare Dropdown Picker */}
                    <div style={{ position: 'relative' }}>
                      <select 
                        style={{ padding: '8px 14px', borderRadius: 999, border: '1px solid #CBD5E1', fontSize: '0.82rem', background: '#FFFFFF', cursor: 'pointer' }}
                        onChange={(e) => {
                          if (e.target.value) {
                            handleToggleCompare(e.target.value);
                            e.target.value = '';
                          }
                        }}
                      >
                        <option value="">+ Add Creator to Compare...</option>
                        {enrichedCreators.filter(c => !comparedCreatorIds.includes(c.id)).map(c => (
                          <option key={c.id} value={c.id}>{c.fullName} ({c.primaryNiche})</option>
                        ))}
                      </select>
                    </div>

                    {comparedCreatorIds.length > 0 && (
                      <button 
                        type="button" 
                        className="bd-save-search-action-btn"
                        onClick={() => {
                          setComparedCreatorIds([]);
                          onShowToast('Cleared comparison list.');
                        }}
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>

                {comparedCreatorIds.length === 0 ? (
                  <div style={{ padding: 48, textAlign: 'center', background: '#FAF9F5', borderRadius: 12 }}>
                    <SlidersHorizontal size={36} color="#94A3B8" style={{ marginBottom: 12 }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#19201C', margin: '0 0 6px 0' }}>No creators selected for comparison</h3>
                    <p style={{ fontSize: '0.84rem', color: '#59655E', marginBottom: 20 }}>Select creators from Discover or click one of the quick starter sets below:</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <button 
                        type="button" 
                        className="bd-hero-search-btn" 
                        style={{ fontSize: '0.82rem', padding: '8px 16px' }}
                        onClick={() => {
                          setComparedCreatorIds(['creator-tech-arjun', 'creator-food-rhea', 'creator-fitness-neha']);
                          onShowToast('Loaded starter creators for comparison.');
                        }}
                      >
                        Compare Top Tech & Food Creators
                      </button>
                      <button 
                        type="button" 
                        className="bd-save-search-action-btn"
                        onClick={() => setActiveTab('discover')}
                      >
                        Browse Discover Marketplace
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    {(() => {
                      const compareList = enrichedCreators.filter(c => comparedCreatorIds.includes(c.id));
                      const maxAudience = Math.max(...compareList.map(c => c.metrics.totalAudience));
                      const maxEngagement = Math.max(...compareList.map(c => c.metrics.engagementRate));
                      const minPrice = Math.min(...compareList.map(c => c.packages[0]?.priceInINR || 6000));

                      return (
                        <table className="bd-compare-table">
                          <thead>
                            <tr>
                              <th>Metric / Attribute</th>
                              {compareList.map(c => (
                                <th key={c.id}>
                                  <div className="bd-compare-col-header">
                                    <button 
                                      type="button" 
                                      className="bd-compare-remove-btn"
                                      onClick={() => handleToggleCompare(c.id)}
                                      title="Remove from comparison"
                                    >
                                      <X size={12} />
                                    </button>
                                    <img src={c.avatarUrl} alt={c.fullName} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                                    <div>
                                      <span style={{ display: 'block', fontWeight: 700, color: '#19201C', fontSize: '0.94rem' }}>{c.fullName}</span>
                                      <span style={{ fontSize: '0.78rem', color: '#828E86' }}>{c.handle}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                                      {c.metrics.totalAudience === maxAudience && (
                                        <span className="bd-best-pill">🏆 Highest Reach</span>
                                      )}
                                      {c.metrics.engagementRate === maxEngagement && (
                                        <span className="bd-best-pill" style={{ background: '#EDF5F0', color: '#15803D' }}>⚡ Best Eng.</span>
                                      )}
                                      {(c.packages[0]?.priceInINR || 6000) === minPrice && (
                                        <span className="bd-best-pill" style={{ background: '#EFF6FF', color: '#2563EB' }}>💰 Best Price</span>
                                      )}
                                    </div>
                                  </div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Primary Niche</td>
                              {compareList.map(c => (
                                <td key={c.id} style={{ fontWeight: 600 }}>{c.primaryNiche}</td>
                              ))}
                            </tr>
                            <tr>
                              <td>Total Audience Reach</td>
                              {compareList.map(c => (
                                <td key={c.id} style={{ fontWeight: 700, fontSize: '0.94rem' }}>
                                  {formatAudience(c.metrics.totalAudience)}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td>Engagement Rate</td>
                              {compareList.map(c => (
                                <td key={c.id} style={{ color: '#15803D', fontWeight: 700 }}>
                                  {c.metrics.engagementRate}%
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td>Average Views / Post</td>
                              {compareList.map(c => (
                                <td key={c.id} style={{ fontWeight: 600 }}>
                                  {formatAudience(c.metrics.averageViews)}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td>Starting Collab Package</td>
                              {compareList.map(c => (
                                <td key={c.id}>
                                  <div style={{ fontWeight: 700, color: '#19201C', fontSize: '0.94rem' }}>
                                    {formatMoney(c.packages[0]?.priceInINR || 6000)}
                                  </div>
                                  <span style={{ fontSize: '0.74rem', color: '#828E86' }}>{c.packages[0]?.title || 'Featured Reel'}</span>
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td>Standard Turnaround</td>
                              {compareList.map(c => (
                                <td key={c.id}>{c.packages[0]?.deliveryDays || 5} Business Days</td>
                              ))}
                            </tr>
                            <tr>
                              <td>Location & Languages</td>
                              {compareList.map(c => (
                                <td key={c.id}>
                                  <div>{c.location.city}, {c.location.country}</div>
                                  <div style={{ fontSize: '0.74rem', color: '#828E86' }}>{c.languages.join(', ')}</div>
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td>Verified KYC Source</td>
                              {compareList.map(c => (
                                <td key={c.id}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <ShieldCheck size={14} color="#15803D" />
                                    <span style={{ fontSize: '0.76rem', color: '#15803D', fontWeight: 600 }}>
                                      {c.verificationSource || 'Meta Graph API Verified'}
                                    </span>
                                  </div>
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td>Brand Ratings</td>
                              {compareList.map(c => (
                                <td key={c.id}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Star size={13} fill="#FBBF24" color="#FBBF24" />
                                    <span style={{ fontWeight: 700 }}>{c.overallRating || 4.9}</span>
                                    <span style={{ fontSize: '0.74rem', color: '#828E86' }}>({c.totalReviews || 24} reviews)</span>
                                  </div>
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td>Actions</td>
                              {compareList.map(c => (
                                <td key={c.id}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <button 
                                      type="button" 
                                      className="bd-hero-search-btn"
                                      style={{ padding: '7px 12px', fontSize: '0.78rem', width: '100%' }}
                                      onClick={() => handleOpenCollabRequest(c)}
                                    >
                                      Send Collab Proposal
                                    </button>
                                    <button 
                                      type="button" 
                                      className="bd-save-search-action-btn"
                                      style={{ justifyContent: 'center' }}
                                      onClick={() => onSelectCreator(c)}
                                    >
                                      View Storefront
                                    </button>
                                  </div>
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════
                TAB 5: MESSAGES (FULL TWO-PANE CHAT)
                ═════════════════════════════════════════════════════════════════ */}
            {activeTab === 'messages' && (
              <div className="bd-chat-container">
                {/* Left Sidebar: Threads List */}
                <div className="bd-chat-sidebar">
                  <div className="bd-chat-sidebar-header">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#19201C' }}>Messages</h3>
                      <button 
                        type="button" 
                        className="bd-save-search-action-btn"
                        onClick={() => setNewChatModalOpen(true)}
                        title="Start new conversation"
                      >
                        <Plus size={13} />
                        <span>New</span>
                      </button>
                    </div>

                    <div className="bd-global-search" style={{ padding: '6px 12px', background: '#FFFFFF' }}>
                      <Search size={14} color="#828E86" />
                      <input 
                        type="text" 
                        placeholder="Search chats..."
                        className="bd-global-search-input"
                        value={chatSearchQuery}
                        onChange={(e) => setChatSearchQuery(e.target.value)}
                      />
                    </div>

                    {/* Filter Pills */}
                    <div style={{ display: 'flex', gap: 6 }}>
                      {(['All', 'Unread', 'Active'] as const).map(f => (
                        <button
                          key={f}
                          type="button"
                          style={{
                            padding: '4px 10px',
                            borderRadius: 999,
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            border: '1px solid #E2E8F0',
                            background: chatFilter === f ? '#16281D' : '#FFFFFF',
                            color: chatFilter === f ? '#FFFFFF' : '#64748B',
                            cursor: 'pointer'
                          }}
                          onClick={() => setChatFilter(f)}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bd-chat-threads-list">
                    {brandConversations
                      .filter(c => {
                        if (chatFilter === 'Unread' && !c.unread) return false;
                        if (chatSearchQuery.trim()) {
                          return c.creatorName.toLowerCase().includes(chatSearchQuery.toLowerCase()) || c.handle.toLowerCase().includes(chatSearchQuery.toLowerCase());
                        }
                        return true;
                      })
                      .map(conv => {
                        const lastMsg = conv.messages[conv.messages.length - 1];
                        const isActive = conv.id === activeConversationId;

                        return (
                          <div 
                            key={conv.id} 
                            className={`bd-chat-thread-item ${isActive ? 'active' : ''}`}
                            onClick={() => {
                              setActiveConversationId(conv.id);
                              // Mark as read
                              setBrandConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unread: false } : c));
                            }}
                          >
                            <div className="bd-chat-thread-avatar-wrap">
                              <img src={conv.avatar} alt={conv.creatorName} className="bd-chat-thread-avatar" />
                              <div className="bd-chat-online-dot" />
                            </div>
                            <div className="bd-chat-thread-meta">
                              <div className="bd-chat-thread-top">
                                <span className="bd-chat-thread-name">{conv.creatorName}</span>
                                <span className="bd-chat-thread-time">{lastMsg?.timestamp || 'Now'}</span>
                              </div>
                              <div className="bd-chat-thread-snippet">
                                {lastMsg ? (lastMsg.sender === 'brand' ? `You: ${lastMsg.text}` : lastMsg.text) : 'Conversation started'}
                              </div>
                            </div>
                            {conv.unread && (
                              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#DC2626', flexShrink: 0 }} />
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Right Chat Panel: Active Conversation */}
                {(() => {
                  const activeConv = brandConversations.find(c => c.id === activeConversationId);
                  if (!activeConv) {
                    return (
                      <div className="bd-chat-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <p style={{ color: '#828E86' }}>Select a conversation to start messaging</p>
                      </div>
                    );
                  }

                  return (
                    <div className="bd-chat-main">
                      {/* Chat Header */}
                      <div className="bd-chat-header">
                        <div className="bd-chat-header-creator">
                          <img src={activeConv.avatar} alt={activeConv.creatorName} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontSize: '0.98rem', fontWeight: 700, color: '#19201C' }}>{activeConv.creatorName}</span>
                              <ShieldCheck size={14} color="#15803D" />
                              <span style={{ fontSize: '0.72rem', background: '#EDF5F0', color: '#15803D', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>Verified</span>
                            </div>
                            <span style={{ fontSize: '0.78rem', color: '#828E86' }}>{activeConv.handle} • {activeConv.niche}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <button 
                            type="button" 
                            className="bd-save-search-action-btn"
                            onClick={() => {
                              const match = enrichedCreators.find(c => c.id === activeConv.creatorId || c.fullName === activeConv.creatorName);
                              if (match) onSelectCreator(match);
                              else onShowToast(`Viewing ${activeConv.creatorName}'s profile`);
                            }}
                          >
                            <ExternalLink size={13} />
                            <span>View Storefront</span>
                          </button>
                          <button 
                            type="button" 
                            className="bd-hero-search-btn"
                            style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                            onClick={() => {
                              const match = enrichedCreators.find(c => c.id === activeConv.creatorId);
                              if (match) handleOpenCollabRequest(match);
                            }}
                          >
                            <Send size={13} />
                            <span>Send Proposal</span>
                          </button>
                        </div>
                      </div>

                      {/* Messages Stream */}
                      <div className="bd-chat-messages-scroll">
                        <div style={{ textAlign: 'center', margin: '8px 0 16px' }}>
                          <span style={{ fontSize: '0.72rem', background: '#E2E8F0', padding: '4px 12px', borderRadius: 999, color: '#475569', fontWeight: 600 }}>
                            🔒 End-to-End Encrypted Brand Negotiation
                          </span>
                        </div>

                        {activeConv.messages.map(msg => (
                          <div key={msg.id} className={`bd-chat-bubble-row ${msg.sender === 'brand' ? 'outgoing' : 'incoming'}`}>
                            {msg.sender === 'creator' && (
                              <img src={activeConv.avatar} alt={activeConv.creatorName} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                            )}
                            <div className={`bd-chat-bubble ${msg.sender === 'brand' ? 'outgoing' : 'incoming'}`}>
                              <div>{msg.text}</div>
                              {/* Rich Attachment or Proposal Card */}
                              {msg.cardType === 'brief' && msg.cardData && (
                                <div className="bd-chat-card-attachment">
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <strong style={{ fontSize: '0.86rem', color: '#16281D' }}>📋 {msg.cardData.title}</strong>
                                    <span style={{ fontSize: '0.74rem', background: '#EDF5F0', color: '#15803D', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>Proposal Active</span>
                                  </div>
                                  <div style={{ fontSize: '0.78rem', color: '#59655E' }}>
                                    Budget: <strong>₹{msg.cardData.budget.toLocaleString('en-IN')}</strong> • Target: {msg.cardData.deadline}
                                  </div>
                                </div>
                              )}
                              <div className="bd-chat-bubble-time">{msg.timestamp}</div>
                            </div>
                          </div>
                        ))}
                        <div ref={chatMessagesEndRef} />
                      </div>

                      {/* Quick Suggestion Chips */}
                      <div className="bd-chat-chips-row">
                        <span style={{ fontSize: '0.74rem', color: '#828E86', fontWeight: 600, flexShrink: 0 }}>Suggestions:</span>
                        {[
                          'Can you deliver within 5 business days?',
                          'Could you share your recent reel analytics?',
                          'We love this! Ready to fund escrow and begin.',
                          'Please share sample product shipping address.'
                        ].map((chip, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="bd-chat-quick-chip"
                            onClick={() => handleQuickChipClick(chip)}
                          >
                            {chip}
                          </button>
                        ))}
                      </div>

                      {/* Chat Composer */}
                      <div className="bd-chat-composer">
                        <button 
                          type="button" 
                          className="bd-top-icon-btn" 
                          title="Attach Campaign Brief PDF or Guidelines"
                          onClick={() => onShowToast('Simulated attachment upload: Campaign Brief PDF added.')}
                        >
                          <Paperclip size={18} />
                        </button>
                        <input 
                          type="text" 
                          className="bd-chat-composer-input"
                          placeholder={`Message ${activeConv.creatorName}... (Press Enter to send)`}
                          value={chatInputText}
                          onChange={(e) => setChatInputText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendMessage();
                          }}
                        />
                        <button 
                          type="button" 
                          className="bd-hero-search-btn"
                          style={{ padding: '10px 18px' }}
                          onClick={handleSendMessage}
                          disabled={!chatInputText.trim()}
                        >
                          <Send size={14} />
                          <span>Send</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════
                TAB 6: COLLABORATION REQUESTS
                ═════════════════════════════════════════════════════════════════ */}
            {activeTab === 'requests' && (
              <div style={{ background: '#FFFFFF', padding: 32, borderRadius: 16, border: '1px solid #E5E8E4' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <h2 className="bd-section-title" style={{ fontSize: '1.45rem' }}>Collaboration Requests & Deals</h2>
                    <p style={{ fontSize: '0.86rem', color: '#59655E', margin: '4px 0 0 0' }}>
                      Track proposal negotiations, approve quotes, fund escrow milestones, and inspect draft deliverables.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <div className="bd-global-search" style={{ width: 240, padding: '6px 12px' }}>
                      <Search size={14} color="#828E86" />
                      <input 
                        type="text"
                        placeholder="Search requests..."
                        className="bd-global-search-input"
                        value={requestSearchQuery}
                        onChange={(e) => setRequestSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Status Filter Tabs */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                  {['All', 'Pending', 'In Discussion', 'Accepted', 'In Production', 'Completed'].map(st => {
                    const count = st === 'All' 
                      ? outgoingRequests.length 
                      : outgoingRequests.filter(r => r.status === st).length;

                    return (
                      <button
                        key={st}
                        type="button"
                        style={{
                          padding: '7px 14px',
                          borderRadius: 999,
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          background: requestFilterStatus === st ? '#16281D' : '#FAF9F5',
                          color: requestFilterStatus === st ? '#FFFFFF' : '#19201C',
                          border: '1px solid #E5E8E4',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                        onClick={() => setRequestFilterStatus(st)}
                      >
                        <span>{st}</span>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          padding: '1px 6px', 
                          borderRadius: 999,
                          background: requestFilterStatus === st ? 'rgba(255,255,255,0.2)' : '#E2E8F0',
                          color: requestFilterStatus === st ? '#FFFFFF' : '#64748B'
                        }}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Requests List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {outgoingRequests
                    .filter(r => {
                      if (requestFilterStatus !== 'All' && r.status !== requestFilterStatus) return false;
                      if (requestSearchQuery.trim()) {
                        const q = requestSearchQuery.toLowerCase();
                        return r.creatorName.toLowerCase().includes(q) || r.campaignName.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
                      }
                      return true;
                    })
                    .map(req => (
                      <div 
                        key={req.id} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          padding: '18px 22px',
                          borderRadius: 14,
                          background: '#FAF9F5',
                          border: '1px solid #E5E8E4',
                          transition: 'all 0.15s ease',
                          cursor: 'pointer'
                        }}
                        onClick={() => setSelectedRequestForDrawer(req)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <img src={req.avatarUrl} alt={req.creatorName} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: '0.98rem', fontWeight: 700, color: '#19201C' }}>{req.creatorName}</span>
                              <span style={{ fontSize: '0.78rem', color: '#828E86' }}>{req.creatorHandle}</span>
                              <span style={{ fontSize: '0.7rem', background: '#E2E8F0', padding: '1px 6px', borderRadius: 4, color: '#475569' }}>{req.id}</span>
                            </div>
                            <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#16281D', display: 'block', marginTop: 2 }}>
                              {req.campaignName}
                            </span>
                            <span style={{ fontSize: '0.78rem', color: '#59655E' }}>
                              Deliverables: {req.deliverables.join(' • ')}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                          <div>
                            <span style={{ fontSize: '0.7rem', color: '#828E86', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Budget</span>
                            <span style={{ fontSize: '0.96rem', fontWeight: 700, color: '#19201C' }}>{formatMoney(req.budgetINR)}</span>
                          </div>

                          <div>
                            <span style={{ fontSize: '0.7rem', color: '#828E86', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Target Delivery</span>
                            <span style={{ fontSize: '0.84rem', color: '#19201C' }}>{req.deadline}</span>
                          </div>

                          <span style={{
                            padding: '5px 14px',
                            borderRadius: 999,
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            background: req.status === 'Accepted' ? '#EDF5F0' : req.status === 'In Production' ? '#E0F2FE' : req.status === 'In Discussion' ? '#FEF3C7' : '#F1F5F9',
                            color: req.status === 'Accepted' ? '#15803D' : req.status === 'In Production' ? '#0369A1' : req.status === 'In Discussion' ? '#B45309' : '#19201C'
                          }}>
                            {req.status}
                          </span>

                          <div style={{ display: 'flex', gap: 6 }} onClick={(e) => e.stopPropagation()}>
                            {req.status === 'Accepted' && (
                              <button 
                                type="button" 
                                className="bd-hero-search-btn"
                                style={{ padding: '6px 14px', fontSize: '0.76rem', background: '#15803D' }}
                                onClick={() => handleFundEscrow(req)}
                              >
                                <Lock size={12} />
                                <span>Fund Escrow</span>
                              </button>
                            )}
                            <button 
                              type="button" 
                              className="bd-save-search-action-btn"
                              style={{ padding: '6px 12px', fontSize: '0.76rem' }}
                              onClick={() => {
                                const match = enrichedCreators.find(c => c.fullName === req.creatorName);
                                if (match) handleStartChatWithCreator(match);
                                else setActiveTab('messages');
                              }}
                            >
                              <MessageSquare size={12} />
                              <span>Chat</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════
                TAB 7: CAMPAIGNS
                ═════════════════════════════════════════════════════════════════ */}
            {activeTab === 'campaigns' && (
              <div style={{ background: '#FFFFFF', padding: 32, borderRadius: 16, border: '1px solid #E5E8E4' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <div>
                    <h2 className="bd-section-title" style={{ fontSize: '1.45rem' }}>Brand Campaigns</h2>
                    <p style={{ fontSize: '0.86rem', color: '#59655E', margin: '4px 0 0 0' }}>
                      Oversee multi-creator influencer activations, milestone deliverables, and budget allocation.
                    </p>
                  </div>
                  <button 
                    type="button" 
                    className="bd-hero-search-btn"
                    onClick={() => {
                      setNewCampaignName('');
                      setCampaignModalOpen(true);
                    }}
                  >
                    <Plus size={14} />
                    <span>Create New Campaign</span>
                  </button>
                </div>

                {/* KPI Overview Banner */}
                <div className="bd-campaigns-kpi-bar">
                  <div className="bd-campaign-kpi-card">
                    <div>
                      <span className="bd-stat-block-lbl">Active Campaigns</span>
                      <div className="bd-stat-block-val">{activeCampaignsCount}</div>
                    </div>
                    <Megaphone size={24} color="#15803D" />
                  </div>
                  <div className="bd-campaign-kpi-card">
                    <div>
                      <span className="bd-stat-block-lbl">Contracted Creators</span>
                      <div className="bd-stat-block-val">
                        {new Set(campaigns.flatMap(c => c.creatorIds)).size}
                      </div>
                    </div>
                    <Users size={24} color="#0369A1" />
                  </div>
                  <div className="bd-campaign-kpi-card">
                    <div>
                      <span className="bd-stat-block-lbl">Allocated Budget</span>
                      <div className="bd-stat-block-val">
                        {formatMoney(campaigns.reduce((sum, c) => sum + c.totalBudgetINR, 0))}
                      </div>
                    </div>
                    <Wallet size={24} color="#B45309" />
                  </div>
                  <div className="bd-campaign-kpi-card">
                    <div>
                      <span className="bd-stat-block-lbl">Deliverables Completed</span>
                      <div className="bd-stat-block-val">
                        {campaigns.reduce((sum, c) => sum + c.completedDeliverablesCount, 0)} / {campaigns.reduce((sum, c) => sum + c.deliverablesCount, 0)}
                      </div>
                    </div>
                    <CheckCircle2 size={24} color="#15803D" />
                  </div>
                </div>

                {/* Campaign Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))', gap: 20 }}>
                  {campaigns.map(camp => {
                    const percentComplete = Math.round((camp.completedDeliverablesCount / Math.max(camp.deliverablesCount, 1)) * 100);
                    const campCreators = enrichedCreators.filter(c => camp.creatorIds.includes(c.id));

                    return (
                      <div key={camp.id} className="bd-campaign-card-rich">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#19201C' }}>{camp.name}</h3>
                            <span style={{ fontSize: '0.82rem', color: '#59655E', display: 'block', marginTop: 4 }}>{camp.objective}</span>
                          </div>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: 999,
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            background: camp.status === 'Active' ? '#EDF5F0' : '#FEF3C7',
                            color: camp.status === 'Active' ? '#15803D' : '#B45309'
                          }}>
                            {camp.status}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#59655E', marginBottom: 6 }}>
                            <span>Deliverable Milestones ({camp.completedDeliverablesCount}/{camp.deliverablesCount})</span>
                            <span style={{ fontWeight: 700, color: '#16281D' }}>{percentComplete}%</span>
                          </div>
                          <div className="bd-progress-bar-track">
                            <div className="bd-progress-bar-fill" style={{ width: `${percentComplete}%` }} />
                          </div>
                        </div>

                        {/* Budget Info */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: '#FAF9F5', borderRadius: 8, fontSize: '0.82rem' }}>
                          <div>
                            <span style={{ color: '#828E86', display: 'block', fontSize: '0.7rem' }}>Allocated Budget:</span>
                            <strong style={{ color: '#19201C' }}>{formatMoney(camp.totalBudgetINR)}</strong>
                          </div>
                          <div>
                            <span style={{ color: '#828E86', display: 'block', fontSize: '0.7rem' }}>Disbursed in Escrow:</span>
                            <strong style={{ color: '#15803D' }}>{formatMoney(camp.spentBudgetINR)}</strong>
                          </div>
                          <div>
                            <span style={{ color: '#828E86', display: 'block', fontSize: '0.7rem' }}>Timeline:</span>
                            <span style={{ color: '#19201C' }}>{camp.startDate.slice(5)} to {camp.endDate.slice(5)}</span>
                          </div>
                        </div>

                        {/* Creators Roster Avatars */}
                        <div>
                          <span style={{ fontSize: '0.76rem', color: '#828E86', fontWeight: 600, display: 'block', marginBottom: 8 }}>
                            Assigned Creators ({campCreators.length}):
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {campCreators.map(c => (
                              <img 
                                key={c.id} 
                                src={c.avatarUrl} 
                                alt={c.fullName} 
                                title={`${c.fullName} (${c.primaryNiche})`}
                                style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid #FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', cursor: 'pointer' }}
                                onClick={() => onSelectCreator(c)}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Milestone checklist preview */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <span style={{ fontSize: '0.74rem', color: '#828E86', fontWeight: 600 }}>Workflow Milestones:</span>
                          {camp.milestones.slice(0, 3).map(ms => (
                            <label key={ms.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: ms.completed ? '#15803D' : '#19201C', cursor: 'pointer' }}>
                              <input 
                                type="checkbox"
                                checked={ms.completed}
                                onChange={(e) => {
                                  const updated = camp.milestones.map(m => m.id === ms.id ? { ...m, completed: e.target.checked } : m);
                                  const completedCount = updated.filter(m => m.completed).length;
                                  setCampaigns(prev => prev.map(c => c.id === camp.id ? { 
                                    ...c, 
                                    milestones: updated,
                                    completedDeliverablesCount: Math.min(completedCount, c.deliverablesCount)
                                  } : c));
                                  onShowToast(`Updated milestone: ${ms.label}`);
                                }}
                                style={{ accentColor: '#15803D' }}
                              />
                              <span style={{ textDecoration: ms.completed ? 'line-through' : 'none' }}>{ms.label}</span>
                            </label>
                          ))}
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 8 }}>
                          <button 
                            type="button" 
                            className="bd-hero-search-btn"
                            style={{ flex: 1, padding: '8px 14px', fontSize: '0.8rem' }}
                            onClick={() => {
                              setSelectedCampaignForView(camp);
                              onShowToast(`Viewing detailed dashboard for ${camp.name}`);
                            }}
                          >
                            Manage Campaign
                          </button>
                          <button 
                            type="button" 
                            className="bd-save-search-action-btn"
                            onClick={() => {
                              setActiveTab('shortlists');
                              onShowToast('Select a shortlist to convert or add to this campaign.');
                            }}
                          >
                            + Add Creators
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════
                TAB 8: SAVED SEARCHES
                ═════════════════════════════════════════════════════════════════ */}
            {activeTab === 'saved_searches' && (
              <div style={{ background: '#FFFFFF', padding: 32, borderRadius: 16, border: '1px solid #E5E8E4' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <div>
                    <h2 className="bd-section-title" style={{ fontSize: '1.45rem' }}>Saved Searches</h2>
                    <p style={{ fontSize: '0.86rem', color: '#59655E', margin: '4px 0 0 0' }}>
                      Quick access to your recurring talent search parameters with instant alert updates.
                    </p>
                  </div>
                  <button 
                    type="button" 
                    className="bd-hero-search-btn"
                    onClick={() => {
                      setNewSearchTitle('');
                      setSaveSearchModalOpen(true);
                    }}
                  >
                    <Plus size={14} />
                    <span>Create Custom Search</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {savedSearches.map(ss => (
                    <div 
                      key={ss.id} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '18px 24px',
                        borderRadius: 14,
                        background: '#FAF9F5',
                        border: '1px solid #E5E8E4',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: '1rem', fontWeight: 700, color: '#19201C' }}>{ss.title}</span>
                          <span style={{ fontSize: '0.72rem', background: '#E2E8F0', padding: '2px 8px', borderRadius: 999, color: '#475569' }}>
                            {ss.matchedCount} creators match
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                          {ss.platform !== 'All' && (
                            <span className="bd-active-tag-chip" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                              Platform: {ss.platform}
                            </span>
                          )}
                          {ss.category && (
                            <span className="bd-active-tag-chip" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                              Category: {ss.category}
                            </span>
                          )}
                          {ss.budget !== 'All' && (
                            <span className="bd-active-tag-chip" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                              Budget: {ss.budget}
                            </span>
                          )}
                          {ss.location !== 'All' && (
                            <span className="bd-active-tag-chip" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                              Location: {ss.location}
                            </span>
                          )}
                          <span style={{ fontSize: '0.74rem', color: '#828E86', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={12} />
                            Alert: {ss.alertFrequency}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button 
                          type="button" 
                          className="bd-hero-search-btn"
                          style={{ padding: '8px 18px', fontSize: '0.82rem' }}
                          onClick={() => handleApplySavedSearch(ss)}
                        >
                          <Compass size={13} />
                          <span>Run Search</span>
                        </button>
                        <button 
                          type="button" 
                          className="bd-save-search-action-btn"
                          style={{ color: '#DC2626' }}
                          onClick={() => {
                            setSavedSearches(prev => prev.filter(s => s.id !== ss.id));
                            onShowToast(`Removed saved search "${ss.title}".`);
                          }}
                          title="Delete saved search"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════
                TAB 9: SETTINGS HUB
                ═════════════════════════════════════════════════════════════════ */}
            {activeTab === 'settings' && (
              <div style={{ background: '#FFFFFF', padding: 32, borderRadius: 16, border: '1px solid #E5E8E4' }}>
                <div style={{ marginBottom: 24 }}>
                  <h2 className="bd-section-title" style={{ fontSize: '1.45rem' }}>Brand Account & Billing Settings</h2>
                  <p style={{ fontSize: '0.86rem', color: '#59655E', margin: '4px 0 0 0' }}>
                    Configure corporate identity, escrow wallet balances, team access permissions, and notification policies.
                  </p>
                </div>

                {/* Settings Sub-Navigation */}
                <div className="bd-settings-subnav">
                  <button 
                    type="button" 
                    className={`bd-settings-subnav-btn ${settingsSubTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setSettingsSubTab('profile')}
                  >
                    Company Profile
                  </button>
                  <button 
                    type="button" 
                    className={`bd-settings-subnav-btn ${settingsSubTab === 'billing' ? 'active' : ''}`}
                    onClick={() => setSettingsSubTab('billing')}
                  >
                    Billing & Escrow ({formatMoney(escrowWalletBalanceINR)})
                  </button>
                  <button 
                    type="button" 
                    className={`bd-settings-subnav-btn ${settingsSubTab === 'team' ? 'active' : ''}`}
                    onClick={() => setSettingsSubTab('team')}
                  >
                    Team Members ({teamMembers.length})
                  </button>
                  <button 
                    type="button" 
                    className={`bd-settings-subnav-btn ${settingsSubTab === 'notifications' ? 'active' : ''}`}
                    onClick={() => setSettingsSubTab('notifications')}
                  >
                    Notifications
                  </button>
                </div>

                {/* SubTab 1: Profile */}
                {settingsSubTab === 'profile' && (
                  <form onSubmit={(e) => { e.preventDefault(); onShowToast('Company profile details saved.'); }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 680 }}>
                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>Company / Brand Legal Name</label>
                        <input 
                          type="text" 
                          value={brandProfile.companyName}
                          onChange={(e) => setBrandProfile(prev => ({ ...prev, companyName: e.target.value }))}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4' }}
                          required
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>Company Website</label>
                        <input 
                          type="url" 
                          value={brandProfile.website}
                          onChange={(e) => setBrandProfile(prev => ({ ...prev, website: e.target.value }))}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>Industry Sector</label>
                        <input 
                          type="text" 
                          value={brandProfile.industry}
                          onChange={(e) => setBrandProfile(prev => ({ ...prev, industry: e.target.value }))}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>Primary Contact Email</label>
                        <input 
                          type="email" 
                          value={brandProfile.contactEmail}
                          onChange={(e) => setBrandProfile(prev => ({ ...prev, contactEmail: e.target.value }))}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4' }}
                          required
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>Company Headquarters</label>
                        <input 
                          type="text" 
                          value={brandProfile.location}
                          onChange={(e) => setBrandProfile(prev => ({ ...prev, location: e.target.value }))}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4' }}
                        />
                      </div>

                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>Brand Description & Campaign Focus</label>
                        <textarea 
                          rows={3}
                          value={brandProfile.bio}
                          onChange={(e) => setBrandProfile(prev => ({ ...prev, bio: e.target.value }))}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4', resize: 'vertical' }}
                        />
                      </div>
                    </div>

                    <div style={{ marginTop: 24 }}>
                      <button type="submit" className="bd-hero-search-btn">
                        Save Company Profile
                      </button>
                    </div>
                  </form>
                )}

                {/* SubTab 2: Billing & Escrow */}
                {settingsSubTab === 'billing' && (
                  <div style={{ maxWidth: 640 }}>
                    {/* Escrow Balance Card */}
                    <div style={{ padding: 24, borderRadius: 14, background: '#FAF9F5', border: '1px solid #E5E8E4', marginBottom: 24 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '0.78rem', color: '#828E86', textTransform: 'uppercase', fontWeight: 600 }}>Creatorly Escrow Wallet Balance</span>
                          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#15803D', marginTop: 4 }}>
                            {formatMoney(escrowWalletBalanceINR)}
                          </div>
                          <span style={{ fontSize: '0.8rem', color: '#59655E' }}>100% protected in Tier-1 institutional escrow until deliverables approved.</span>
                        </div>
                        <button 
                          type="button" 
                          className="bd-hero-search-btn"
                          style={{ background: '#15803D' }}
                          onClick={() => setAddFundsModalOpen(true)}
                        >
                          <Plus size={14} />
                          <span>Add Funds to Escrow</span>
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>Default Billing Currency</label>
                        <select 
                          value={brandProfile.billingCurrency} 
                          onChange={(e) => {
                            const code = e.target.value as CurrencyCode;
                            setBrandProfile(prev => ({ ...prev, billingCurrency: code }));
                            onShowToast(`Default currency set to ${code}.`);
                          }}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4' }}
                        >
                          <option value="INR">INR (₹) - Indian Rupee (Default)</option>
                          <option value="USD">USD ($) - US Dollar</option>
                          <option value="EUR">EUR (€) - Euro</option>
                          <option value="GBP">GBP (£) - British Pound</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>Corporate GSTIN / Tax Identification</label>
                        <input type="text" defaultValue="27AABCR1234F1Z5" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4' }} />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>Registered Invoicing Address</label>
                        <input type="text" defaultValue="Level 4, SJR Cyber, Hosur Road, Koramangala, Bengaluru 560095" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4' }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* SubTab 3: Team Members */}
                {settingsSubTab === 'team' && (
                  <div style={{ maxWidth: 680 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#19201C' }}>Brand Team Access</span>
                      <button 
                        type="button" 
                        className="bd-hero-search-btn"
                        style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                        onClick={() => {
                          setInviteEmail('');
                          setInviteTeamModalOpen(true);
                        }}
                      >
                        <Plus size={13} />
                        <span>Invite Member</span>
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {teamMembers.map(tm => (
                        <div key={tm.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: '#FAF9F5', borderRadius: 10, border: '1px solid #E5E8E4' }}>
                          <div>
                            <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#19201C', display: 'block' }}>{tm.name}</span>
                            <span style={{ fontSize: '0.78rem', color: '#828E86' }}>{tm.email}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontSize: '0.76rem', background: '#EDF5F0', color: '#15803D', padding: '3px 10px', borderRadius: 999, fontWeight: 600 }}>
                              {tm.role}
                            </span>
                            {tm.id !== 'tm-1' && (
                              <button 
                                type="button" 
                                style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: 4 }}
                                onClick={() => {
                                  setTeamMembers(prev => prev.filter(m => m.id !== tm.id));
                                  onShowToast(`Removed team member ${tm.name}.`);
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SubTab 4: Notifications */}
                {settingsSubTab === 'notifications' && (
                  <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #E5E8E4' }}>
                      <div>
                        <strong style={{ fontSize: '0.9rem', color: '#19201C', display: 'block' }}>Collaboration Proposal Updates</strong>
                        <span style={{ fontSize: '0.8rem', color: '#828E86' }}>Get notified instantly when creators accept, decline, or counter offer.</span>
                      </div>
                      <label className="bd-toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={notificationSettings.proposalUpdates}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, proposalUpdates: e.target.checked }))}
                        />
                        <span className="bd-toggle-slider" />
                      </label>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #E5E8E4' }}>
                      <div>
                        <strong style={{ fontSize: '0.9rem', color: '#19201C', display: 'block' }}>Creator Direct Messages</strong>
                        <span style={{ fontSize: '0.8rem', color: '#828E86' }}>Real-time alerts for incoming chat replies and question threads.</span>
                      </div>
                      <label className="bd-toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={notificationSettings.messageAlerts}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, messageAlerts: e.target.checked }))}
                        />
                        <span className="bd-toggle-slider" />
                      </label>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #E5E8E4' }}>
                      <div>
                        <strong style={{ fontSize: '0.9rem', color: '#19201C', display: 'block' }}>Draft Deliverables for Approval</strong>
                        <span style={{ fontSize: '0.8rem', color: '#828E86' }}>Alert when a creator submits video files or scripts for brand sign-off.</span>
                      </div>
                      <label className="bd-toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={notificationSettings.draftDeliverables}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, draftDeliverables: e.target.checked }))}
                        />
                        <span className="bd-toggle-slider" />
                      </label>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #E5E8E4' }}>
                      <div>
                        <strong style={{ fontSize: '0.9rem', color: '#19201C', display: 'block' }}>Escrow Payout Releases</strong>
                        <span style={{ fontSize: '0.8rem', color: '#828E86' }}>Confirmation when escrow disbursements are funded or released.</span>
                      </div>
                      <label className="bd-toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={notificationSettings.escrowMilestones}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, escrowMilestones: e.target.checked }))}
                        />
                        <span className="bd-toggle-slider" />
                      </label>
                    </div>

                    <button 
                      type="button" 
                      className="bd-hero-search-btn"
                      style={{ marginTop: 12, width: 'fit-content' }}
                      onClick={() => onShowToast('Notification preferences updated.')}
                    >
                      Save Notification Settings
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>

          {/* =================================================================
              RIGHT COLUMN: Supporting Panels (Shown only on Discover)
              ================================================================= */}
          {activeTab === 'discover' && (
            <aside className="bd-right-col">
              {/* Panel 1: Why Creatorly? */}
              <div className="bd-side-panel">
                <h3 className="bd-side-panel-title">Why Creatorly?</h3>
                <div className="bd-why-list">
                  <div className="bd-why-item">
                    <div className="bd-why-icon-wrap">
                      <ShieldCheck size={16} />
                    </div>
                    <div className="bd-why-text">
                      <span className="bd-why-title">Verified Creators</span>
                      <span className="bd-why-desc">Real audience & engagement data directly from platform APIs.</span>
                    </div>
                  </div>

                  <div className="bd-why-item">
                    <div className="bd-why-icon-wrap">
                      <TrendingUp size={16} />
                    </div>
                    <div className="bd-why-text">
                      <span className="bd-why-title">Transparent Pricing</span>
                      <span className="bd-why-desc">No hidden agency markups or surprises.</span>
                    </div>
                  </div>

                  <div className="bd-why-item">
                    <div className="bd-why-icon-wrap">
                      <Lock size={16} />
                    </div>
                    <div className="bd-why-text">
                      <span className="bd-why-title">Secure Collaboration</span>
                      <span className="bd-why-desc">Escrow funds protected until approved delivery.</span>
                    </div>
                  </div>

                  <div className="bd-why-item">
                    <div className="bd-why-icon-wrap">
                      <Globe2 size={16} />
                    </div>
                    <div className="bd-why-text">
                      <span className="bd-why-title">Global Talent</span>
                      <span className="bd-why-desc">Elite creators across 100+ categories.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Panel 2: SmartMatch Promo Card */}
              <div className="bd-smartmatch-promo-card">
                <div className="bd-smartmatch-promo-top">
                  <Star size={18} fill="#FBBF24" />
                  <h3 className="bd-smartmatch-promo-title">Need something specific?</h3>
                </div>
                <p className="bd-smartmatch-promo-text">
                  Use SmartMatch and tell us what you need. We'll find the best creators for your campaign.
                </p>
                <button 
                  type="button" 
                  className="bd-smartmatch-promo-btn"
                  onClick={() => setSmartMatchOpen(true)}
                >
                  <span>Try SmartMatch</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Panel 3: How It Works */}
              <div className="bd-side-panel">
                <h3 className="bd-side-panel-title">How It Works</h3>
                <div className="bd-how-list">
                  <div className="bd-how-step">
                    <div className="bd-how-num">1</div>
                    <div className="bd-how-content">
                      <span className="bd-how-title">Search or describe your needs</span>
                      <span className="bd-how-desc">Use filters or SmartMatch to discover creators.</span>
                    </div>
                  </div>

                  <div className="bd-how-step">
                    <div className="bd-how-num">2</div>
                    <div className="bd-how-content">
                      <span className="bd-how-title">Compare & shortlist</span>
                      <span className="bd-how-desc">View profiles, pricing, and genuine client reviews.</span>
                    </div>
                  </div>

                  <div className="bd-how-step">
                    <div className="bd-how-num">3</div>
                    <div className="bd-how-content">
                      <span className="bd-how-title">Send a collaboration request</span>
                      <span className="bd-how-desc">Share your campaign brief and proposed budget.</span>
                    </div>
                  </div>

                  <div className="bd-how-step">
                    <div className="bd-how-num">4</div>
                    <div className="bd-how-content">
                      <span className="bd-how-title">Get started</span>
                      <span className="bd-how-desc">The creator responds and you finalize details safely.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Panel 4: Popular Searches */}
              <div className="bd-side-panel">
                <h3 className="bd-side-panel-title">Popular Searches</h3>
                <div className="bd-popular-list">
                  <button 
                    type="button" 
                    className="bd-popular-item"
                    onClick={() => handlePopularSearchClick('Fitness creators in India')}
                  >
                    <Search size={13} />
                    <span>Fitness creators in India</span>
                  </button>
                  <button 
                    type="button" 
                    className="bd-popular-item"
                    onClick={() => handlePopularSearchClick('Tech influencers on YouTube')}
                  >
                    <Search size={13} />
                    <span>Tech influencers on YouTube</span>
                  </button>
                  <button 
                    type="button" 
                    className="bd-popular-item"
                    onClick={() => handlePopularSearchClick('Food bloggers in Delhi')}
                  >
                    <Search size={13} />
                    <span>Food bloggers in Delhi</span>
                  </button>
                  <button 
                    type="button" 
                    className="bd-popular-item"
                    onClick={() => handlePopularSearchClick('Travel creators in Europe')}
                  >
                    <Search size={13} />
                    <span>Travel creators in Europe</span>
                  </button>
                  <button 
                    type="button" 
                    className="bd-popular-item"
                    onClick={() => handlePopularSearchClick('Finance educators')}
                  >
                    <Search size={13} />
                    <span>Finance educators</span>
                  </button>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────────
          4. Floating Compare Tray (Sticky Bottom)
          ─────────────────────────────────────────────────────────────────── */}
      {comparedCreatorIds.length > 0 && activeTab !== 'compare' && (
        <div className="bd-floating-compare-bar">
          <div className="bd-compare-info">
            <SlidersHorizontal size={16} />
            <span>{comparedCreatorIds.length} Creators Selected for Comparison</span>
          </div>
          <button 
            type="button" 
            className="bd-compare-bar-btn"
            onClick={() => setActiveTab('compare')}
          >
            Compare Now
          </button>
          <button 
            type="button" 
            className="bd-compare-clear-btn"
            onClick={() => setComparedCreatorIds([])}
          >
            Clear
          </button>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────
          5. SmartMatch Brief Questionnaire Modal
          ─────────────────────────────────────────────────────────────────── */}
      {smartMatchOpen && (
        <div className="bd-modal-overlay" onClick={() => setSmartMatchOpen(false)}>
          <div className="bd-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="bd-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Sparkles size={18} color="#D97706" />
                <h3 className="bd-modal-title">SmartMatch Campaign Brief Builder</h3>
              </div>
              <button 
                type="button" 
                className="bd-modal-close-btn"
                onClick={() => setSmartMatchOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="bd-modal-body">
              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>
                  1. What is your primary campaign objective?
                </label>
                <select 
                  value={smartMatchObjective}
                  onChange={(e) => setSmartMatchObjective(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4' }}
                >
                  <option value="Product Awareness & Launch">Product Awareness & Launch</option>
                  <option value="App Downloads & Signups">App Downloads & Signups</option>
                  <option value="High-Converting Product Sales">High-Converting Product Sales</option>
                  <option value="Brand Credibility & Expert Review">Brand Credibility & Expert Review</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>
                  2. Product / Service Category
                </label>
                <select 
                  value={smartMatchCategory}
                  onChange={(e) => setSmartMatchCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4' }}
                >
                  <option value="Technology & AI">Technology & AI</option>
                  <option value="Food & Culinary">Food & Culinary</option>
                  <option value="Fitness & Health">Fitness & Health</option>
                  <option value="Finance & Investing">Finance & Investing</option>
                  <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
                  <option value="Travel & Hospitality">Travel & Hospitality</option>
                  <option value="Gaming & Esports">Gaming & Esports</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>
                    3. Preferred Platform
                  </label>
                  <select 
                    value={smartMatchPlatform}
                    onChange={(e) => setSmartMatchPlatform(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4' }}
                  >
                    <option value="Instagram Reels">Instagram Reels</option>
                    <option value="YouTube Longform Video">YouTube Longform Video</option>
                    <option value="YouTube Shorts">YouTube Shorts</option>
                    <option value="LinkedIn Thought Leadership">LinkedIn Thought Leadership</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>
                    4. Approximate Budget (INR)
                  </label>
                  <input 
                    type="number" 
                    value={smartMatchBudgetINR}
                    onChange={(e) => setSmartMatchBudgetINR(Number(e.target.value))}
                    step={1000}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>
                  5. Target Campaign Deadline
                </label>
                <select 
                  value={smartMatchDeadline}
                  onChange={(e) => setSmartMatchDeadline(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4' }}
                >
                  <option value="Urgent (Within 5 days)">Urgent (Within 5 days)</option>
                  <option value="Within 2 weeks">Within 2 weeks</option>
                  <option value="Next month">Next month</option>
                  <option value="Flexible timeline">Flexible timeline</option>
                </select>
              </div>
            </div>

            <div className="bd-modal-footer">
              <button 
                type="button" 
                className="bd-card-view-btn"
                onClick={() => setSmartMatchOpen(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="bd-hero-search-btn"
                onClick={handleRunSmartMatch}
              >
                <Sparkles size={14} />
                <span>Find Matching Creators</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────
          6. More Filters Modal
          ─────────────────────────────────────────────────────────────────── */}
      {moreFiltersModalOpen && (
        <div className="bd-modal-overlay" onClick={() => setMoreFiltersModalOpen(false)}>
          <div className="bd-modal-card" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <div className="bd-modal-header">
              <h3 className="bd-modal-title">More Discovery Filters</h3>
              <button type="button" className="bd-modal-close-btn" onClick={() => setMoreFiltersModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="bd-modal-body">
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}>
                  <input 
                    type="checkbox" 
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: '#16281D' }}
                  />
                  <span>Verified Creators Only (API and KYC Checked)</span>
                </label>
              </div>

              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>
                  Minimum Engagement Rate: {minEngagement > 0 ? `${minEngagement}%` : 'Any'}
                </label>
                <input 
                  type="range" 
                  min={0} 
                  max={8} 
                  step={0.5}
                  value={minEngagement}
                  onChange={(e) => setMinEngagement(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#16281D' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#828E86' }}>
                  <span>Any</span>
                  <span>4% (Good)</span>
                  <span>6%+ (Viral)</span>
                </div>
              </div>
            </div>
            <div className="bd-modal-footer">
              <button 
                type="button" 
                className="bd-card-view-btn"
                onClick={() => {
                  setVerifiedOnly(false);
                  setMinEngagement(0);
                  setMoreFiltersModalOpen(false);
                }}
              >
                Reset
              </button>
              <button 
                type="button" 
                className="bd-hero-search-btn"
                onClick={() => setMoreFiltersModalOpen(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────
          7. Collaboration Request Proposal Modal
          ─────────────────────────────────────────────────────────────────── */}
      {collabModalOpen && collabTargetCreator && (
        <div className="bd-modal-overlay" onClick={() => setCollabModalOpen(false)}>
          <div className="bd-modal-card" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSubmitCollabRequest}>
              <div className="bd-modal-header">
                <h3 className="bd-modal-title">Request Collaboration: {collabTargetCreator.fullName}</h3>
                <button type="button" className="bd-modal-close-btn" onClick={() => setCollabModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="bd-modal-body">
                <div>
                  <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>Campaign Title *</label>
                  <input 
                    type="text" 
                    value={collabCampaignName}
                    onChange={(e) => setCollabCampaignName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>Proposed Budget (INR) *</label>
                    <input 
                      type="number" 
                      value={collabBudgetINR}
                      onChange={(e) => setCollabBudgetINR(Number(e.target.value))}
                      required
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>Target Delivery Date *</label>
                    <input 
                      type="date" 
                      value={collabDeadline}
                      onChange={(e) => setCollabDeadline(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>Key Deliverables</label>
                  <input 
                    type="text" 
                    value={collabDeliverables}
                    onChange={(e) => setCollabDeliverables(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>Campaign Brief & Guidelines</label>
                  <textarea 
                    rows={4}
                    value={collabBrief}
                    onChange={(e) => setCollabBrief(e.target.value)}
                    placeholder="Provide details about product value props, talking points, hook ideas, and do's & don'ts..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4', resize: 'vertical' }}
                  />
                </div>
              </div>

              <div className="bd-modal-footer">
                <button type="button" className="bd-card-view-btn" onClick={() => setCollabModalOpen(false)}>Cancel</button>
                <button type="submit" className="bd-hero-search-btn">
                  <Send size={14} />
                  <span>Send Collaboration Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────
          8. Add to Shortlist / Create Shortlist Modal
          ─────────────────────────────────────────────────────────────────── */}
      {shortlistModalOpen && (
        <div className="bd-modal-overlay" onClick={() => setShortlistModalOpen(false)}>
          <div className="bd-modal-card" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
            <div className="bd-modal-header">
              <h3 className="bd-modal-title">
                {creatorForShortlist ? `Save ${creatorForShortlist.fullName} to Shortlist` : 'Create New Campaign Shortlist'}
              </h3>
              <button type="button" className="bd-modal-close-btn" onClick={() => setShortlistModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="bd-modal-body">
              {creatorForShortlist && (
                <>
                  <p style={{ fontSize: '0.84rem', color: '#59655E', margin: '0 0 12px 0' }}>
                    Choose an existing campaign shortlist:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                    {shortlists.map(sl => {
                      const alreadyIn = sl.creatorIds.includes(creatorForShortlist.id);
                      return (
                        <button
                          key={sl.id}
                          type="button"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 14px',
                            borderRadius: 10,
                            background: alreadyIn ? '#EDF5F0' : '#FAF9F5',
                            border: '1px solid #E5E8E4',
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            if (alreadyIn) {
                              setShortlists(prev => prev.map(s => s.id === sl.id ? { ...s, creatorIds: s.creatorIds.filter(id => id !== creatorForShortlist.id) } : s));
                              onShowToast(`Removed from "${sl.name}"`);
                            } else {
                              setShortlists(prev => prev.map(s => s.id === sl.id ? { ...s, creatorIds: [...s.creatorIds, creatorForShortlist.id] } : s));
                              onShowToast(`Added to "${sl.name}"!`);
                            }
                            setShortlistModalOpen(false);
                          }}
                        >
                          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#19201C' }}>{sl.name}</span>
                          {alreadyIn ? <Check size={16} color="#15803D" /> : <Plus size={16} color="#828E86" />}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#828E86', margin: '8px 0' }}>— OR CREATE NEW SHORTLIST —</div>
                </>
              )}

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>Shortlist Title *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Q1 Global Brand Awareness"
                  value={newShortlistName}
                  onChange={(e) => setNewShortlistName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4' }}
                />
              </div>

              <div style={{ marginTop: 12 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>Campaign Target Description</label>
                <input 
                  type="text" 
                  placeholder="Targeting key product launch deliverables..."
                  value={newShortlistDesc}
                  onChange={(e) => setNewShortlistDesc(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4' }}
                />
              </div>
            </div>

            <div className="bd-modal-footer">
              <button type="button" className="bd-card-view-btn" onClick={() => setShortlistModalOpen(false)}>Cancel</button>
              <button 
                type="button" 
                className="bd-hero-search-btn"
                onClick={() => {
                  if (!newShortlistName.trim()) return;
                  const newSl: ShortlistItem = {
                    id: `sl-${Date.now()}`,
                    name: newShortlistName.trim(),
                    description: newShortlistDesc.trim() || 'Custom campaign shortlist',
                    creatorIds: creatorForShortlist ? [creatorForShortlist.id] : []
                  };
                  setShortlists(prev => [...prev, newSl]);
                  setSelectedShortlistId(newSl.id);
                  setShortlistModalOpen(false);
                  onShowToast(`Created new shortlist "${newSl.name}"!`);
                }}
              >
                Create Shortlist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────
          9. Save Search Modal
          ─────────────────────────────────────────────────────────────────── */}
      {saveSearchModalOpen && (
        <div className="bd-modal-overlay" onClick={() => setSaveSearchModalOpen(false)}>
          <div className="bd-modal-card" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
            <div className="bd-modal-header">
              <h3 className="bd-modal-title">Save Search Parameters</h3>
              <button type="button" className="bd-modal-close-btn" onClick={() => setSaveSearchModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="bd-modal-body">
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>Search Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Verified Tech Creators in Bengaluru"
                  value={newSearchTitle}
                  onChange={(e) => setNewSearchTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4' }}
                />
              </div>
              <div style={{ marginTop: 12, padding: 12, background: '#FAF9F5', borderRadius: 8, fontSize: '0.8rem', color: '#59655E' }}>
                <strong>Saved Parameters:</strong>
                <div>Platform: {filterPlatform} • Location: {filterLocation} • Budget: {filterBudget}</div>
                <div>Category: {selectedCategory || 'All'} • Keywords: "{searchQuery || 'None'}"</div>
              </div>
            </div>
            <div className="bd-modal-footer">
              <button type="button" className="bd-card-view-btn" onClick={() => setSaveSearchModalOpen(false)}>Cancel</button>
              <button type="button" className="bd-hero-search-btn" onClick={handleSaveCurrentSearch}>
                Save Search
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────
          10. Add Funds to Escrow Modal
          ─────────────────────────────────────────────────────────────────── */}
      {addFundsModalOpen && (
        <div className="bd-modal-overlay" onClick={() => setAddFundsModalOpen(false)}>
          <div className="bd-modal-card" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
            <div className="bd-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Wallet size={18} color="#15803D" />
                <h3 className="bd-modal-title">Deposit to Escrow Wallet</h3>
              </div>
              <button type="button" className="bd-modal-close-btn" onClick={() => setAddFundsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="bd-modal-body">
              <p style={{ fontSize: '0.84rem', color: '#59655E', margin: '0 0 16px 0' }}>
                Creatorly Escrow protects your funds until you sign off on final deliverables.
              </p>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>Deposit Amount (INR)</label>
                <input 
                  type="number"
                  value={fundAmountINR}
                  onChange={(e) => setFundAmountINR(Number(e.target.value))}
                  step={5000}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4', fontSize: '1rem', fontWeight: 700 }}
                />
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                {[25000, 50000, 100000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    style={{ flex: 1, padding: '6px 8px', borderRadius: 6, border: '1px solid #E2E8F0', background: '#FAF9F5', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => setFundAmountINR(amt)}
                  >
                    +₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>

              <div style={{ marginTop: 16 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>Payment Method</label>
                <select style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4' }}>
                  <option>Corporate Card (Visa ending in 4242)</option>
                  <option>Razorpay Corporate Net Banking</option>
                  <option>Instant Corporate UPI Autopay</option>
                </select>
              </div>
            </div>
            <div className="bd-modal-footer">
              <button type="button" className="bd-card-view-btn" onClick={() => setAddFundsModalOpen(false)}>Cancel</button>
              <button 
                type="button" 
                className="bd-hero-search-btn"
                style={{ background: '#15803D' }}
                onClick={() => {
                  setEscrowWalletBalanceINR(prev => prev + fundAmountINR);
                  setAddFundsModalOpen(false);
                  onShowToast(`Successfully added ₹${fundAmountINR.toLocaleString('en-IN')} to Escrow Wallet!`);
                  if (requestToFund) {
                    handleFundEscrow(requestToFund);
                    setRequestToFund(null);
                  }
                }}
              >
                Confirm Deposit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────
          11. Request Proposal Drawer (Slide-Over)
          ─────────────────────────────────────────────────────────────────── */}
      {selectedRequestForDrawer && (
        <div className="bd-request-drawer-overlay" onClick={() => setSelectedRequestForDrawer(null)}>
          <div className="bd-request-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E8E4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#828E86' }}>Deal {selectedRequestForDrawer.id}</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '2px 0 0 0', color: '#19201C' }}>
                  {selectedRequestForDrawer.campaignName}
                </h3>
              </div>
              <button type="button" className="bd-top-icon-btn" onClick={() => setSelectedRequestForDrawer(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Creator Card */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, background: '#FAF9F5', borderRadius: 12, border: '1px solid #E5E8E4' }}>
                <img src={selectedRequestForDrawer.avatarUrl} alt={selectedRequestForDrawer.creatorName} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <strong style={{ fontSize: '1rem', color: '#19201C' }}>{selectedRequestForDrawer.creatorName}</strong>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: '#828E86' }}>{selectedRequestForDrawer.creatorHandle}</span>
                </div>
              </div>

              {/* Deal Status & Escrow */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ padding: 14, borderRadius: 10, background: '#FAF9F5', border: '1px solid #E5E8E4' }}>
                  <span style={{ fontSize: '0.72rem', color: '#828E86', display: 'block' }}>Status</span>
                  <span style={{ fontSize: '0.94rem', fontWeight: 700, color: '#15803D' }}>{selectedRequestForDrawer.status}</span>
                </div>
                <div style={{ padding: 14, borderRadius: 10, background: '#FAF9F5', border: '1px solid #E5E8E4' }}>
                  <span style={{ fontSize: '0.72rem', color: '#828E86', display: 'block' }}>Budget</span>
                  <span style={{ fontSize: '0.94rem', fontWeight: 700, color: '#19201C' }}>{formatMoney(selectedRequestForDrawer.budgetINR)}</span>
                </div>
              </div>

              {/* Deliverables */}
              <div>
                <strong style={{ fontSize: '0.88rem', color: '#19201C', display: 'block', marginBottom: 8 }}>Included Deliverables</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {selectedRequestForDrawer.deliverables.map((del, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#FFFFFF', border: '1px solid #E5E8E4', borderRadius: 8, fontSize: '0.84rem' }}>
                      <Check size={14} color="#15803D" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Campaign Brief */}
              <div>
                <strong style={{ fontSize: '0.88rem', color: '#19201C', display: 'block', marginBottom: 6 }}>Campaign Brief & Specifications</strong>
                <p style={{ fontSize: '0.84rem', color: '#59655E', lineHeight: 1.5, background: '#FAF9F5', padding: 14, borderRadius: 10, border: '1px solid #E5E8E4', margin: 0 }}>
                  {selectedRequestForDrawer.briefText}
                </p>
              </div>

              {/* Workflow Milestone Progression */}
              <div>
                <strong style={{ fontSize: '0.88rem', color: '#19201C', display: 'block', marginBottom: 12 }}>Deal Milestones</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Collab Request Submitted', done: true },
                    { label: 'Creator Accepted Proposal', done: selectedRequestForDrawer.status !== 'Pending' },
                    { label: 'Escrow Deposited (Safe Protection)', done: selectedRequestForDrawer.escrowFunded || selectedRequestForDrawer.status === 'In Production' },
                    { label: 'First Draft Submitted for Review', done: selectedRequestForDrawer.status === 'Completed' },
                    { label: 'Live Deliverable Approved & Escrow Released', done: selectedRequestForDrawer.status === 'Completed' }
                  ].map((st, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.82rem' }}>
                      <div style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: st.done ? '#15803D' : '#E2E8F0',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 700
                      }}>
                        {st.done ? '✓' : i + 1}
                      </div>
                      <span style={{ color: st.done ? '#16281D' : '#828E86', fontWeight: st.done ? 600 : 400 }}>
                        {st.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid #E5E8E4', display: 'flex', gap: 10 }}>
              {selectedRequestForDrawer.status === 'Accepted' && !selectedRequestForDrawer.escrowFunded && (
                <button 
                  type="button" 
                  className="bd-hero-search-btn"
                  style={{ flex: 1, background: '#15803D' }}
                  onClick={() => handleFundEscrow(selectedRequestForDrawer)}
                >
                  <Lock size={14} />
                  <span>Fund Escrow ({formatMoney(selectedRequestForDrawer.budgetINR)})</span>
                </button>
              )}
              <button 
                type="button" 
                className="bd-save-search-action-btn"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => {
                  const match = enrichedCreators.find(c => c.fullName === selectedRequestForDrawer.creatorName);
                  if (match) handleStartChatWithCreator(match);
                  setSelectedRequestForDrawer(null);
                }}
              >
                <MessageSquare size={14} />
                <span>Chat with Creator</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────
          12. Create Campaign Modal
          ─────────────────────────────────────────────────────────────────── */}
      {campaignModalOpen && (
        <div className="bd-modal-overlay" onClick={() => setCampaignModalOpen(false)}>
          <div className="bd-modal-card" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newCampaignName.trim()) return;
              const newC: BrandCampaign = {
                id: `camp-${Date.now()}`,
                name: newCampaignName.trim(),
                objective: newCampaignObjective,
                status: 'Active',
                startDate: newCampaignStartDate,
                endDate: newCampaignEndDate,
                totalBudgetINR: newCampaignBudget,
                spentBudgetINR: 0,
                creatorIds: ['creator-food-rhea', 'creator-tech-arjun'],
                deliverablesCount: 4,
                completedDeliverablesCount: 1,
                milestones: [
                  { id: `ms-1-${Date.now()}`, label: 'Briefs Distributed', completed: true },
                  { id: `ms-2-${Date.now()}`, label: 'Product Sample Dispatches', completed: false },
                  { id: `ms-3-${Date.now()}`, label: 'Draft Approvals', completed: false },
                  { id: `ms-4-${Date.now()}`, label: 'Live Publishing Day', completed: false }
                ]
              };
              setCampaigns(prev => [newC, ...prev]);
              saveCampaignToSupabase(newC);
              setCampaignModalOpen(false);
              onShowToast(`Created campaign "${newC.name}"!`);
            }}>
              <div className="bd-modal-header">
                <h3 className="bd-modal-title">Create New Influencer Campaign</h3>
                <button type="button" className="bd-modal-close-btn" onClick={() => setCampaignModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="bd-modal-body">
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>Campaign Title *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Winter Holiday Product Launch"
                    value={newCampaignName}
                    onChange={(e) => setNewCampaignName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>Campaign Goal / Objective</label>
                  <select 
                    value={newCampaignObjective}
                    onChange={(e) => setNewCampaignObjective(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4' }}
                  >
                    <option value="Brand Awareness & Launch">Brand Awareness & Launch</option>
                    <option value="Direct App Downloads & Signups">Direct App Downloads & Signups</option>
                    <option value="Product Reviews & Unboxing">Product Reviews & Unboxing</option>
                    <option value="Holiday Festive Sales Conversion">Holiday Festive Sales Conversion</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>Total Budget (INR) *</label>
                  <input 
                    type="number" 
                    value={newCampaignBudget}
                    onChange={(e) => setNewCampaignBudget(Number(e.target.value))}
                    step={5000}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>Campaign Start Date</label>
                    <input 
                      type="date" 
                      value={newCampaignStartDate}
                      onChange={(e) => setNewCampaignStartDate(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>Campaign End Date</label>
                    <input 
                      type="date" 
                      value={newCampaignEndDate}
                      onChange={(e) => setNewCampaignEndDate(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4' }}
                    />
                  </div>
                </div>
              </div>

              <div className="bd-modal-footer">
                <button type="button" className="bd-card-view-btn" onClick={() => setCampaignModalOpen(false)}>Cancel</button>
                <button type="submit" className="bd-hero-search-btn">
                  Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────
          13. New Chat Modal (Pick Creator to Message)
          ─────────────────────────────────────────────────────────────────── */}
      {newChatModalOpen && (
        <div className="bd-modal-overlay" onClick={() => setNewChatModalOpen(false)}>
          <div className="bd-modal-card" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
            <div className="bd-modal-header">
              <h3 className="bd-modal-title">Start Conversation with Creator</h3>
              <button type="button" className="bd-modal-close-btn" onClick={() => setNewChatModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="bd-modal-body">
              <p style={{ fontSize: '0.84rem', color: '#59655E', margin: '0 0 14px 0' }}>Select a verified creator to begin direct messaging:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 320, overflowY: 'auto' }}>
                {enrichedCreators.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: '#FAF9F5',
                      border: '1px solid #E5E8E4',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onClick={() => {
                      handleStartChatWithCreator(c);
                      setNewChatModalOpen(false);
                    }}
                  >
                    <img src={c.avatarUrl} alt={c.fullName} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#19201C', display: 'block' }}>{c.fullName}</span>
                      <span style={{ fontSize: '0.76rem', color: '#828E86' }}>{c.handle} • {c.primaryNiche}</span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#15803D', fontWeight: 600 }}>
                      {formatMoney(c.packages[0]?.priceInINR || 6000)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────
          14. Invite Team Member Modal
          ─────────────────────────────────────────────────────────────────── */}
      {inviteTeamModalOpen && (
        <div className="bd-modal-overlay" onClick={() => setInviteTeamModalOpen(false)}>
          <div className="bd-modal-card" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
            <div className="bd-modal-header">
              <h3 className="bd-modal-title">Invite Team Member</h3>
              <button type="button" className="bd-modal-close-btn" onClick={() => setInviteTeamModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!inviteEmail.trim()) {
                onShowToast('Please enter a valid work email.');
                return;
              }
              const newMember = {
                id: `tm-${Date.now()}`,
                name: inviteEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                email: inviteEmail.trim(),
                role: inviteRole,
                status: 'Active'
              };
              setTeamMembers(prev => [...prev, newMember]);
              onShowToast(`Invited ${inviteEmail.trim()} as ${inviteRole}!`);
              setInviteTeamModalOpen(false);
              setInviteEmail('');
            }}>
              <div className="bd-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <p style={{ fontSize: '0.84rem', color: '#59655E', margin: 0 }}>
                  Grant your internal colleagues or agency partners access to manage campaigns, inspect proposals, and review content deliverables.
                </p>
                <div>
                  <label className="bd-modal-field-label">Colleague Work Email *</label>
                  <input
                    type="email"
                    className="bd-modal-input"
                    placeholder="e.g. colleague@yourbrand.com"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    autoFocus
                  />
                </div>
                <div>
                  <label className="bd-modal-field-label">Access Role *</label>
                  <select
                    className="bd-modal-input"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                  >
                    <option value="Campaign Manager">Campaign Manager (Create briefs, approve drafts)</option>
                    <option value="Financial Reviewer">Financial Reviewer (Approve escrow payments)</option>
                    <option value="Audience Strategist">Audience Strategist (Discover & compare talent)</option>
                    <option value="Observer">Observer (Read-only access)</option>
                  </select>
                </div>
              </div>
              <div className="bd-modal-footer">
                <button type="button" className="bd-card-view-btn" onClick={() => setInviteTeamModalOpen(false)}>Cancel</button>
                <button type="submit" className="bd-hero-search-btn">Send Invitation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────
          15. Help & Guidance Modal
          ─────────────────────────────────────────────────────────────────── */}
      {helpModalOpen && (
        <div className="bd-modal-overlay" onClick={() => setHelpModalOpen(false)}>
          <div className="bd-modal-card" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <div className="bd-modal-header">
              <h3 className="bd-modal-title">Creatorly Brand Discovery Guide</h3>
              <button type="button" className="bd-modal-close-btn" onClick={() => setHelpModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="bd-modal-body" style={{ fontSize: '0.86rem', color: '#19201C', lineHeight: 1.6 }}>
              <p><strong>How to hire a creator on Creatorly:</strong></p>
              <ol style={{ paddingLeft: 20, margin: '8px 0 16px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li><strong>Search or Browse:</strong> Use categories, filters, or natural language prompts.</li>
                <li><strong>Review Profiles:</strong> Check authentic engagement, verified KYC status, and past collab ratings.</li>
                <li><strong>Send Request:</strong> Agree on budget, deliverables, and timeline. Funds enter escrow safely.</li>
                <li><strong>Escrow Protection:</strong> Payment is only disbursed once you sign off on final deliverables.</li>
              </ol>
              <div style={{ padding: 12, borderRadius: 8, background: '#EDF5F0', color: '#166534', fontSize: '0.8rem' }}>
                Need enterprise concierge matching? Contact our brand support team at <strong>brands@creatorly.com</strong>.
              </div>
            </div>
            <div className="bd-modal-footer">
              <button type="button" className="bd-hero-search-btn" onClick={() => setHelpModalOpen(false)}>Got It</button>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Details View Modal */}
      {selectedCampaignForView && (
        <div className="bd-modal-overlay" onClick={() => setSelectedCampaignForView(null)}>
          <div className="bd-modal-card" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <div className="bd-modal-header">
              <div>
                <span style={{ fontSize: '0.74rem', color: '#828E86' }}>Campaign #{selectedCampaignForView.id}</span>
                <h3 className="bd-modal-title">{selectedCampaignForView.name}</h3>
              </div>
              <button type="button" className="bd-modal-close-btn" onClick={() => setSelectedCampaignForView(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="bd-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div style={{ padding: 12, background: '#FAF9F5', borderRadius: 10 }}>
                  <span style={{ fontSize: '0.72rem', color: '#828E86', display: 'block' }}>Objective</span>
                  <strong style={{ fontSize: '0.88rem', color: '#19201C' }}>{selectedCampaignForView.objective}</strong>
                </div>
                <div style={{ padding: 12, background: '#FAF9F5', borderRadius: 10 }}>
                  <span style={{ fontSize: '0.72rem', color: '#828E86', display: 'block' }}>Total Budget</span>
                  <strong style={{ fontSize: '0.88rem', color: '#15803D' }}>{formatMoney(selectedCampaignForView.totalBudgetINR)}</strong>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 8 }}>
                  Milestones ({selectedCampaignForView.milestones.filter(m => m.completed).length}/{selectedCampaignForView.milestones.length} Completed)
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {selectedCampaignForView.milestones.map(ms => (
                    <div key={ms.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#FFFFFF', border: '1px solid #E5E8E4', borderRadius: 8, fontSize: '0.84rem' }}>
                      <Check size={14} color={ms.completed ? '#15803D' : '#94A3B8'} />
                      <span style={{ color: ms.completed ? '#15803D' : '#19201C' }}>{ms.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bd-modal-footer">
              <button type="button" className="bd-card-view-btn" onClick={() => setSelectedCampaignForView(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
