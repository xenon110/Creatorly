import React, { useState, useMemo } from 'react';
import type { 
  CreatorProfile, 
  CurrencyCode, 
  AuthUser 
} from '../types/creator';
import { formatCurrency } from '../data/currencies';
import { CreatorlyLogo } from './CreatorlyLogo';
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
  Trash2
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

export const BrandDashboard: React.FC<BrandDashboardProps> = ({
  creators,
  currentCurrency,
  onSelectCreator,
  onShowToast,
  onNavigateToWorkspace,
  currentUser: _currentUser,
  onLogout,
  onReturnToHome
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

  // User Actions: Saved Creators & Shortlists
  const [savedCreatorIds, setSavedCreatorIds] = useState<string[]>(['creator-food-rhea', 'creator-tech-arjun']);
  const [comparedCreatorIds, setComparedCreatorIds] = useState<string[]>([]);
  const [shortlists, setShortlists] = useState<{ id: string; name: string; creatorIds: string[] }[]>([
    { id: 'sl-1', name: 'Q4 Festive Reels Push', creatorIds: ['creator-food-rhea', 'creator-priya-patel'] },
    { id: 'sl-2', name: 'Tech SaaS Launch', creatorIds: ['creator-tech-arjun', 'creator-alex-sharma'] }
  ]);
  const [selectedShortlistId, setSelectedShortlistId] = useState<string>('sl-1');
  const [newShortlistName, setNewShortlistName] = useState('');
  const [shortlistModalOpen, setShortlistModalOpen] = useState(false);
  const [creatorForShortlist, setCreatorForShortlist] = useState<CreatorProfile | null>(null);

  // SmartMatch Modal & Brief Builder State
  const [smartMatchOpen, setSmartMatchOpen] = useState(false);
  const [smartMatchObjective, setSmartMatchObjective] = useState('Product Awareness & Launch');
  const [smartMatchCategory, setSmartMatchCategory] = useState('Technology & AI');
  const [smartMatchPlatform, setSmartMatchPlatform] = useState('Instagram Reels');
  const [smartMatchBudgetINR, setSmartMatchBudgetINR] = useState(25000);
  const [smartMatchDeadline, setSmartMatchDeadline] = useState('Within 2 weeks');

  // Collaboration Request Modal
  const [collabModalOpen, setCollabModalOpen] = useState(false);
  const [collabTargetCreator, setCollabTargetCreator] = useState<CreatorProfile | null>(null);
  const [collabCampaignName, setCollabCampaignName] = useState('');
  const [collabDeliverables, setCollabDeliverables] = useState('1 Dedicated Video / Reel + 2 Stories');
  const [collabBudgetINR, setCollabBudgetINR] = useState(15000);
  const [collabDeadline, setCollabDeadline] = useState('2026-11-15');
  const [collabBrief, setCollabBrief] = useState('');
  const [outgoingRequests, setOutgoingRequests] = useState<{
    id: string;
    creatorName: string;
    creatorHandle: string;
    avatarUrl: string;
    campaignName: string;
    budgetINR: number;
    deadline: string;
    status: 'Pending' | 'Accepted' | 'In Discussion' | 'Declined';
    submittedAt: string;
  }[]>([
    {
      id: 'req-out-1',
      creatorName: 'Arjun Mehta',
      creatorHandle: '@techwitharjun',
      avatarUrl: '/images/creator-card-tech.jpg',
      campaignName: 'AI Coding Assistant Q4 Promo',
      budgetINR: 18000,
      deadline: '2026-11-05',
      status: 'Pending',
      submittedAt: 'Today, 2:15 PM'
    },
    {
      id: 'req-out-2',
      creatorName: 'Rhea Kapoor',
      creatorHandle: '@rheaeats',
      avatarUrl: '/images/creator-card-food.jpg',
      campaignName: 'Artisanal Cafe Review Series',
      budgetINR: 12000,
      deadline: '2026-10-31',
      status: 'In Discussion',
      submittedAt: 'Yesterday'
    },
    {
      id: 'req-out-3',
      creatorName: 'Neha Verma',
      creatorHandle: '@fitwithneha',
      avatarUrl: '/images/creator-card-fitness.jpg',
      campaignName: 'Electrolyte Hydration Drink Launch',
      budgetINR: 10000,
      deadline: '2026-11-12',
      status: 'Accepted',
      submittedAt: '3 days ago'
    },
    {
      id: 'req-out-4',
      creatorName: 'Sanya Iyer',
      creatorHandle: '@sanyatravels',
      avatarUrl: '/images/creator-card-travel.jpg',
      campaignName: 'Eco-Resort Staycation Feature',
      budgetINR: 22000,
      deadline: '2026-11-20',
      status: 'Pending',
      submittedAt: '4 days ago'
    },
    {
      id: 'req-out-5',
      creatorName: 'Karan Singh',
      creatorHandle: '@karanplays',
      avatarUrl: '/images/creator-card-gaming.jpg',
      campaignName: 'Wireless Gaming Mouse Showcase',
      budgetINR: 15000,
      deadline: '2026-11-08',
      status: 'Accepted',
      submittedAt: '5 days ago'
    }
  ]);

  // Brand Inbox Messages
  const [brandConversations] = useState([
    {
      id: 'b-conv-1',
      creatorName: 'Arjun Mehta',
      handle: '@techwitharjun',
      avatar: '/images/creator-card-tech.jpg',
      lastMessage: 'Hey Sarah! Loved the brief for the AI assistant. I can deliver the first draft by Tuesday.',
      timestamp: '25m ago',
      unread: true
    },
    {
      id: 'b-conv-2',
      creatorName: 'Rhea Kapoor',
      handle: '@rheaeats',
      avatar: '/images/creator-card-food.jpg',
      lastMessage: 'Could we schedule the cafe shoot for this Thursday morning for the best natural light?',
      timestamp: '2h ago',
      unread: true
    },
    {
      id: 'b-conv-3',
      creatorName: 'Neha Verma',
      handle: '@fitwithneha',
      avatar: '/images/creator-card-fitness.jpg',
      lastMessage: 'Received the sample product box! Taste test review is going to be fire.',
      timestamp: 'Yesterday',
      unread: true
    }
  ]);

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

    // 6 primary spotlight creators exactly matching screenshot
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
            title: 'Dedicated Tech Integration Reel',
            tagline: 'Deep dive tech product tutorial',
            bestFor: 'Software tools, gadgets, and developer platforms',
            priceInINR: 8000,
            platform: 'YouTube',
            deliveryDays: 5,
            includedRevisions: 2,
            publishingIncluded: true,
            organicUsageDays: 90,
            paidUsageRightsIncluded: true,
            deliverables: ['1 60-90s Deep Dive Reel', 'Link in Bio for 7 days', 'Trackable discount code']
          }
        ]
      },
      {
        ...defaultProfileBase,
        id: 'creator-fitness-neha',
        username: 'neha-verma',
        fullName: 'Neha Verma',
        handle: '@fitwithneha',
        avatarUrl: '/images/priya-patel.jpg',
        coverPattern: '/images/creator-card-fitness.jpg',
        verifiedBadge: true,
        verificationSource: 'Certified Strength Coach API Verification',
        primaryNiche: 'Health & Fitness',
        subNiches: ['Functional Training', 'Gym Routines', 'Clean Nutrition'],
        bio: 'Empowering everyday professionals to build sustainable strength, mobility, and healthy habits.',
        location: { city: 'Mumbai', country: 'India', flagEmoji: '🇮🇳' },
        languages: ['English', 'Hindi'],
        socialLinks: [
          { platform: 'instagram', name: 'Instagram', handle: '@fitwithneha', url: '#', followers: 176000, verified: true }
        ],
        availability: { status: 'available', label: 'Taking Oct Bookings', slotsRemaining: 4, totalSlots: 6, earliestDelivery: '4 days', responseTime: '< 4h' },
        metrics: {
          totalAudience: 176000,
          averageViews: 42000,
          engagementRate: 4.5,
          targetMarketPercentage: 86,
          targetMarketCountry: 'India',
          lastUpdatedDaysAgo: 2,
          ageDistribution: [], genderDistribution: [], topGeographies: [], topCities: [],
          platformFollowers: { youtube: 0, instagram: 176000, linkedin: 0 }
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
        primaryNiche: 'Finance & Economics',
        subNiches: ['Personal Finance', 'Stock Valuation', 'Tax Optimization'],
        bio: 'Demystifying personal investing, index funds, and financial freedom for young earners.',
        location: { city: 'Gurgaon', country: 'India', flagEmoji: '🇮🇳' },
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
          ageDistribution: [], genderDistribution: [], topGeographies: [], topCities: []
          , platformFollowers: { youtube: 320000, instagram: 0, linkedin: 0 }
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
          ageDistribution: [], genderDistribution: [], topGeographies: [], topCities: []
          , platformFollowers: { youtube: 0, instagram: 412000, linkedin: 0 }
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
          ageDistribution: [], genderDistribution: [], topGeographies: [], topCities: []
          , platformFollowers: { youtube: 634000, instagram: 0, linkedin: 0 }
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
  }, [enrichedCreators, searchQuery, selectedCategory, filterPlatform, filterLocation, filterBudget, filterLanguage, verifiedOnly, minEngagement, sortBy]);

  // Displayed items count based on "View All"
  const visibleCreators = useMemo(() => {
    if (viewAllActive || searchQuery.trim() || selectedCategory) {
      return filteredCreators;
    }
    return filteredCreators.slice(0, 6);
  }, [filteredCreators, viewAllActive, searchQuery, selectedCategory]);

  // Handlers
  const handleToggleSave = (creatorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedCreatorIds.includes(creatorId)) {
      setSavedCreatorIds(prev => prev.filter(id => id !== creatorId));
      onShowToast('Removed from Saved Creators.');
    } else {
      setSavedCreatorIds(prev => [...prev, creatorId]);
      onShowToast('Added to Saved Creators! Accessible in your left sidebar.');
    }
  };

  const handleToggleCompare = (creatorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (comparedCreatorIds.includes(creatorId)) {
      setComparedCreatorIds(prev => prev.filter(id => id !== creatorId));
      onShowToast('Removed from comparison list.');
    } else {
      if (comparedCreatorIds.length >= 4) {
        onShowToast('You can compare up to 4 creators at a time.');
        return;
      }
      setComparedCreatorIds(prev => [...prev, creatorId]);
      onShowToast('Added to Compare tray! Click Compare below to evaluate.');
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

    const newReq = {
      id: `req-out-${Date.now()}`,
      creatorName: collabTargetCreator.fullName,
      creatorHandle: collabTargetCreator.handle,
      avatarUrl: collabTargetCreator.avatarUrl,
      campaignName: collabCampaignName || `Campaign with ${collabTargetCreator.fullName}`,
      budgetINR: collabBudgetINR,
      deadline: collabDeadline,
      status: 'Pending' as const,
      submittedAt: 'Just now'
    };

    setOutgoingRequests(prev => [newReq, ...prev]);
    setCollabModalOpen(false);
    onShowToast(`Collaboration request sent to ${collabTargetCreator.fullName}! Escrow terms prepared.`);
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
              <span className="bd-nav-badge" style={{ background: 'rgba(255,255,255,0.15)' }}>
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
            <span className="bd-nav-badge" style={{ background: 'rgba(255,255,255,0.15)' }}>
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
            <span className="bd-nav-badge">3</span>
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
            <span className="bd-nav-badge">5</span>
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
      <div className="bd-main-wrapper">
        {/* Top Navigation Bar */}
        <header className="bd-top-nav">
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
                placeholder="Search for creators, niches, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                    Notifications
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
                  <span className="bd-user-name">Sarah Mitchell</span>
                  <span className="bd-user-role">Brand</span>
                </div>
                <ChevronDown size={14} color="#828E86" />
              </button>

              {userDropdownOpen && (
                <div className="bd-dropdown-menu">
                  <button 
                    type="button" 
                    className="bd-dropdown-item"
                    onClick={() => { setUserDropdownOpen(false); setActiveTab('settings'); }}
                  >
                    <Building size={15} />
                    <span>Company Profile</span>
                  </button>
                  <button 
                    type="button" 
                    className="bd-dropdown-item"
                    onClick={() => { setUserDropdownOpen(false); setActiveTab('settings'); }}
                  >
                    <CreditCard size={15} />
                    <span>Billing & Escrow</span>
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
          <main className="bd-center-col">
            {activeTab === 'discover' && (
              <>
                {/* Section A: Hero Banner ("Find the perfect creator for your brand") */}
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
                            onShowToast(`Searching for "${searchQuery}"...`);
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

                {/* Section B: Browse by Category (12 Selectable Circular Tiles) */}
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
                <section className="bd-filter-bar">
                  <div className="bd-filter-pills-row">
                    {/* Platform Filter */}
                    <button 
                      type="button" 
                      className={`bd-filter-btn ${filterPlatform !== 'All' ? 'active' : ''}`}
                      onClick={() => {
                        const next = filterPlatform === 'All' ? 'Instagram' : filterPlatform === 'Instagram' ? 'YouTube' : 'All';
                        setFilterPlatform(next);
                      }}
                    >
                      <span>Platform: {filterPlatform}</span>
                      <ChevronDown size={13} />
                    </button>

                    {/* Location Filter */}
                    <button 
                      type="button" 
                      className={`bd-filter-btn ${filterLocation !== 'All' ? 'active' : ''}`}
                      onClick={() => {
                        const next = filterLocation === 'All' ? 'Delhi' : filterLocation === 'Delhi' ? 'Mumbai' : filterLocation === 'Mumbai' ? 'Bengaluru' : 'All';
                        setFilterLocation(next);
                      }}
                    >
                      <span>Location: {filterLocation}</span>
                      <ChevronDown size={13} />
                    </button>

                    {/* Budget Filter */}
                    <button 
                      type="button" 
                      className={`bd-filter-btn ${filterBudget !== 'All' ? 'active' : ''}`}
                      onClick={() => {
                        const next = filterBudget === 'All' ? '<10k' : filterBudget === '<10k' ? '10k-25k' : 'All';
                        setFilterBudget(next);
                      }}
                    >
                      <span>Budget: {filterBudget}</span>
                      <ChevronDown size={13} />
                    </button>

                    {/* Followers Filter */}
                    <button 
                      type="button" 
                      className={`bd-filter-btn ${filterFollowers !== 'All' ? 'active' : ''}`}
                      onClick={() => {
                        const next = filterFollowers === 'All' ? '100k+' : 'All';
                        setFilterFollowers(next);
                      }}
                    >
                      <span>Followers: {filterFollowers}</span>
                      <ChevronDown size={13} />
                    </button>

                    {/* Language Filter */}
                    <button 
                      type="button" 
                      className={`bd-filter-btn ${filterLanguage !== 'All' ? 'active' : ''}`}
                      onClick={() => {
                        const next = filterLanguage === 'All' ? 'Hindi' : filterLanguage === 'Hindi' ? 'English' : 'All';
                        setFilterLanguage(next);
                      }}
                    >
                      <span>Language: {filterLanguage}</span>
                      <ChevronDown size={13} />
                    </button>

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
                                <Heart size={15} fill={isSaved ? '#DC2626' : 'none'} />
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

                              {/* 3 Metrics: Followers, Engagement, Collabs */}
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
                                  className={`bd-card-bookmark-btn ${isCompared ? 'shortlisted' : ''}`}
                                  onClick={(e) => handleToggleCompare(creator.id, e)}
                                  title={isCompared ? 'In Compare list' : 'Compare Creator'}
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

            {/* TAB: Saved Creators */}
            {activeTab === 'saved' && (
              <div style={{ background: '#FFFFFF', padding: 32, borderRadius: 16, border: '1px solid #E5E8E4' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <div>
                    <h2 className="bd-section-title" style={{ fontSize: '1.4rem' }}>Saved Creators ({savedCreatorIds.length})</h2>
                    <p style={{ fontSize: '0.86rem', color: '#59655E', margin: '4px 0 0 0' }}>Creators you have favorited for future campaigns.</p>
                  </div>
                  <button 
                    type="button" 
                    className="bd-hero-search-btn"
                    onClick={() => setActiveTab('discover')}
                  >
                    <span>Browse More Creators</span>
                  </button>
                </div>

                <div className="bd-creators-grid">
                  {enrichedCreators.filter(c => savedCreatorIds.includes(c.id)).map(creator => (
                    <div key={creator.id} className="bd-creator-card" onClick={() => onSelectCreator(creator)}>
                      <div className="bd-card-photo-area">
                        <img src={(creator as any).coverPattern || '/images/creator-card-tech.jpg'} alt={creator.fullName} className="bd-card-cover-img" />
                        <button type="button" className="bd-card-heart-btn saved" onClick={(e) => handleToggleSave(creator.id, e)}>
                          <Heart size={15} fill="#DC2626" />
                        </button>
                      </div>
                      <div className="bd-card-body">
                        <span className="bd-card-name">{creator.fullName}</span>
                        <span className="bd-card-handle">{creator.handle}</span>
                        <div style={{ margin: '14px 0' }}>
                          <button type="button" className="bd-card-view-btn" style={{ width: '100%' }}>View Profile</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: Compare Creators Side by Side */}
            {activeTab === 'compare' && (
              <div style={{ background: '#FFFFFF', padding: 32, borderRadius: 16, border: '1px solid #E5E8E4' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <div>
                    <h2 className="bd-section-title" style={{ fontSize: '1.4rem' }}>Compare Creators Side-by-Side</h2>
                    <p style={{ fontSize: '0.86rem', color: '#59655E', margin: '4px 0 0 0' }}>Evaluate niche fit, audience reach, engagement, pricing, and availability.</p>
                  </div>
                  <button 
                    type="button" 
                    className="bd-hero-search-btn"
                    onClick={() => setActiveTab('discover')}
                  >
                    <span>Browse Creators</span>
                  </button>
                </div>

                {comparedCreatorIds.length === 0 ? (
                  <div style={{ padding: 48, textAlign: 'center', background: '#FAF9F5', borderRadius: 12 }}>
                    <p style={{ fontSize: '1rem', fontWeight: 600, color: '#19201C' }}>No creators selected for comparison</p>
                    <p style={{ fontSize: '0.84rem', color: '#59655E', marginBottom: 16 }}>Click the compare slider icon on any creator card to add them here.</p>
                    <button type="button" className="bd-hero-search-btn" onClick={() => setActiveTab('discover')}>
                      Explore Discover
                    </button>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #E5E8E4' }}>
                          <th style={{ padding: '12px 14px', color: '#828E86', width: '22%' }}>Metric / Attribute</th>
                          {enrichedCreators.filter(c => comparedCreatorIds.includes(c.id)).map(c => (
                            <th key={c.id} style={{ padding: '12px 14px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <img src={c.avatarUrl} alt={c.fullName} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                                <div>
                                  <span style={{ display: 'block', fontWeight: 700, color: '#19201C' }}>{c.fullName}</span>
                                  <span style={{ fontSize: '0.74rem', color: '#828E86' }}>{c.handle}</span>
                                </div>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #E5E8E4' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 600, color: '#59655E' }}>Primary Niche</td>
                          {enrichedCreators.filter(c => comparedCreatorIds.includes(c.id)).map(c => (
                            <td key={c.id} style={{ padding: '12px 14px', fontWeight: 600 }}>{c.primaryNiche}</td>
                          ))}
                        </tr>
                        <tr style={{ borderBottom: '1px solid #E5E8E4' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 600, color: '#59655E' }}>Audience Reach</td>
                          {enrichedCreators.filter(c => comparedCreatorIds.includes(c.id)).map(c => (
                            <td key={c.id} style={{ padding: '12px 14px', fontWeight: 700 }}>{formatAudience(c.metrics.totalAudience)}</td>
                          ))}
                        </tr>
                        <tr style={{ borderBottom: '1px solid #E5E8E4' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 600, color: '#59655E' }}>Engagement Rate</td>
                          {enrichedCreators.filter(c => comparedCreatorIds.includes(c.id)).map(c => (
                            <td key={c.id} style={{ padding: '12px 14px', color: '#15803D', fontWeight: 700 }}>{c.metrics.engagementRate}%</td>
                          ))}
                        </tr>
                        <tr style={{ borderBottom: '1px solid #E5E8E4' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 600, color: '#59655E' }}>Starting Collab Rate</td>
                          {enrichedCreators.filter(c => comparedCreatorIds.includes(c.id)).map(c => (
                            <td key={c.id} style={{ padding: '12px 14px', fontWeight: 700 }}>{formatMoney(c.packages[0]?.priceInINR || 6000)}</td>
                          ))}
                        </tr>
                        <tr style={{ borderBottom: '1px solid #E5E8E4' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 600, color: '#59655E' }}>Location</td>
                          {enrichedCreators.filter(c => comparedCreatorIds.includes(c.id)).map(c => (
                            <td key={c.id} style={{ padding: '12px 14px' }}>{c.location.city}, {c.location.country}</td>
                          ))}
                        </tr>
                        <tr style={{ borderBottom: '1px solid #E5E8E4' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 600, color: '#59655E' }}>Action</td>
                          {enrichedCreators.filter(c => comparedCreatorIds.includes(c.id)).map(c => (
                            <td key={c.id} style={{ padding: '12px 14px' }}>
                              <button 
                                type="button" 
                                className="bd-hero-search-btn"
                                style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                                onClick={() => onSelectCreator(c)}
                              >
                                View Storefront
                              </button>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Collaboration Requests */}
            {activeTab === 'requests' && (
              <div style={{ background: '#FFFFFF', padding: 32, borderRadius: 16, border: '1px solid #E5E8E4' }}>
                <h2 className="bd-section-title" style={{ fontSize: '1.4rem', marginBottom: 8 }}>Outgoing Collaboration Requests</h2>
                <p style={{ fontSize: '0.86rem', color: '#59655E', marginBottom: 24 }}>Track the real-time status of collaboration offers sent to creators.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {outgoingRequests.map(req => (
                    <div 
                      key={req.id} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        borderRadius: 12,
                        background: '#FAF9F5',
                        border: '1px solid #E5E8E4'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <img src={req.avatarUrl} alt={req.creatorName} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                        <div>
                          <span style={{ fontSize: '0.96rem', fontWeight: 700, color: '#19201C', display: 'block' }}>{req.creatorName}</span>
                          <span style={{ fontSize: '0.82rem', color: '#59655E' }}>Campaign: {req.campaignName}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        <div>
                          <span style={{ fontSize: '0.72rem', color: '#828E86', display: 'block' }}>Budget:</span>
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#19201C' }}>{formatMoney(req.budgetINR)}</span>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.72rem', color: '#828E86', display: 'block' }}>Deadline:</span>
                          <span style={{ fontSize: '0.84rem', color: '#19201C' }}>{req.deadline}</span>
                        </div>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: 999,
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          background: req.status === 'Accepted' ? '#EDF5F0' : req.status === 'In Discussion' ? '#FEF3C7' : '#F1F5F9',
                          color: req.status === 'Accepted' ? '#15803D' : req.status === 'In Discussion' ? '#B45309' : '#19201C'
                        }}>
                          {req.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: Brand Messages */}
            {activeTab === 'messages' && (
              <div style={{ background: '#FFFFFF', padding: 32, borderRadius: 16, border: '1px solid #E5E8E4' }}>
                <h2 className="bd-section-title" style={{ fontSize: '1.4rem', marginBottom: 8 }}>Brand Direct Messages</h2>
                <p style={{ fontSize: '0.86rem', color: '#59655E', marginBottom: 24 }}>Direct communication channel with your prospective and booked creators.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {brandConversations.map(conv => (
                    <div 
                      key={conv.id}
                      style={{
                        padding: '16px 20px',
                        borderRadius: 12,
                        background: '#FAF9F5',
                        border: '1px solid #E5E8E4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                      onClick={() => onShowToast(`Opening message thread with ${conv.creatorName}`)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <img src={conv.avatar} alt={conv.creatorName} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: '0.94rem', fontWeight: 700, color: '#19201C' }}>{conv.creatorName}</span>
                            <span style={{ fontSize: '0.78rem', color: '#828E86' }}>{conv.handle}</span>
                          </div>
                          <p style={{ fontSize: '0.84rem', color: '#59655E', margin: '4px 0 0 0' }}>{conv.lastMessage}</p>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.74rem', color: '#828E86' }}>{conv.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: My Shortlists */}
            {activeTab === 'shortlists' && (
              <div style={{ background: '#FFFFFF', padding: 32, borderRadius: 16, border: '1px solid #E5E8E4' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <div>
                    <h2 className="bd-section-title" style={{ fontSize: '1.4rem' }}>Campaign Shortlists</h2>
                    <p style={{ fontSize: '0.86rem', color: '#59655E', margin: '4px 0 0 0' }}>Organize candidate creators by client campaign.</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input 
                      type="text" 
                      placeholder="New shortlist name..." 
                      value={newShortlistName}
                      onChange={(e) => setNewShortlistName(e.target.value)}
                      style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #E5E8E4', fontSize: '0.84rem' }}
                    />
                    <button 
                      type="button" 
                      className="bd-hero-search-btn"
                      onClick={() => {
                        if (!newShortlistName.trim()) return;
                        setShortlists(prev => [...prev, { id: `sl-${Date.now()}`, name: newShortlistName.trim(), creatorIds: [] }]);
                        setNewShortlistName('');
                        onShowToast('New shortlist created!');
                      }}
                    >
                      <Plus size={14} />
                      <span>Create</span>
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                  {shortlists.map(sl => (
                    <button 
                      key={sl.id}
                      type="button"
                      style={{
                        padding: '8px 16px',
                        borderRadius: 999,
                        background: selectedShortlistId === sl.id ? '#16281D' : '#FAF9F5',
                        color: selectedShortlistId === sl.id ? '#FFFFFF' : '#19201C',
                        border: '1px solid #E5E8E4',
                        fontWeight: 600,
                        fontSize: '0.84rem',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedShortlistId(sl.id)}
                    >
                      {sl.name} ({sl.creatorIds.length})
                    </button>
                  ))}
                </div>

                {/* Creators in selected shortlist */}
                <div className="bd-creators-grid">
                  {enrichedCreators.filter(c => {
                    const currentSl = shortlists.find(s => s.id === selectedShortlistId);
                    return currentSl?.creatorIds.includes(c.id);
                  }).map(creator => (
                    <div key={creator.id} className="bd-creator-card" onClick={() => onSelectCreator(creator)}>
                      <div className="bd-card-photo-area">
                        <img src={(creator as any).coverPattern || '/images/creator-card-tech.jpg'} alt={creator.fullName} className="bd-card-cover-img" />
                      </div>
                      <div className="bd-card-body">
                        <span className="bd-card-name">{creator.fullName}</span>
                        <span className="bd-card-handle">{creator.handle}</span>
                        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                          <button type="button" className="bd-card-view-btn" style={{ flex: 1 }}>View Profile</button>
                          <button 
                            type="button" 
                            className="bd-card-bookmark-btn"
                            style={{ color: '#DC2626' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setShortlists(prev => prev.map(s => s.id === selectedShortlistId ? { ...s, creatorIds: s.creatorIds.filter(id => id !== creator.id) } : s));
                              onShowToast(`Removed ${creator.fullName} from shortlist.`);
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
              </div>
            )}

            {/* TAB: Campaigns */}
            {activeTab === 'campaigns' && (
              <div style={{ background: '#FFFFFF', padding: 32, borderRadius: 16, border: '1px solid #E5E8E4' }}>
                <h2 className="bd-section-title" style={{ fontSize: '1.4rem', marginBottom: 8 }}>Brand Campaigns</h2>
                <p style={{ fontSize: '0.86rem', color: '#59655E', marginBottom: 24 }}>Manage your active multi-creator influencer campaigns and milestones.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                  <div style={{ padding: 20, borderRadius: 12, border: '1px solid #E5E8E4', background: '#FAF9F5' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#19201C' }}>Diwali Festive Push</span>
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: '#EDF5F0', color: '#15803D' }}>Active</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#59655E', margin: '0 0 12px 0' }}>Promoting festive fashion and lifestyle products across Delhi NCR and Mumbai.</p>
                    <div style={{ fontSize: '0.8rem', color: '#828E86' }}>Budget: <strong>₹50,000</strong> • 3 Creators Booked</div>
                  </div>

                  <div style={{ padding: 20, borderRadius: 12, border: '1px solid #E5E8E4', background: '#FAF9F5' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#19201C' }}>Developer Tools Q4 Sprint</span>
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: '#FEF3C7', color: '#B45309' }}>In Briefing</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#59655E', margin: '0 0 12px 0' }}>YouTube integrations demonstrating developer productivity benchmarks.</p>
                    <div style={{ fontSize: '0.8rem', color: '#828E86' }}>Budget: <strong>₹85,000</strong> • 2 Creators Booked</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Saved Searches */}
            {activeTab === 'saved_searches' && (
              <div style={{ background: '#FFFFFF', padding: 32, borderRadius: 16, border: '1px solid #E5E8E4' }}>
                <h2 className="bd-section-title" style={{ fontSize: '1.4rem', marginBottom: 8 }}>Saved Searches</h2>
                <p style={{ fontSize: '0.86rem', color: '#59655E', marginBottom: 24 }}>Quick access to your recurring talent search parameters.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button 
                    type="button" 
                    className="bd-popular-item" 
                    style={{ padding: 14, background: '#FAF9F5', borderRadius: 10, fontSize: '0.88rem', fontWeight: 600 }}
                    onClick={() => {
                      setFilterPlatform('Instagram');
                      setFilterBudget('<10k');
                      setActiveTab('discover');
                      onShowToast('Applied saved search: Instagram Reels under 10k');
                    }}
                  >
                    <span>⚡ Budget Reels Creators in India (&lt; ₹10,000)</span>
                  </button>
                  <button 
                    type="button" 
                    className="bd-popular-item" 
                    style={{ padding: 14, background: '#FAF9F5', borderRadius: 10, fontSize: '0.88rem', fontWeight: 600 }}
                    onClick={() => {
                      setSelectedCategory('Tech');
                      setFilterPlatform('YouTube');
                      setActiveTab('discover');
                      onShowToast('Applied saved search: Tech Influencers on YouTube');
                    }}
                  >
                    <span>💻 High-Impact Tech Reviewers on YouTube</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB: Settings */}
            {activeTab === 'settings' && (
              <div style={{ background: '#FFFFFF', padding: 32, borderRadius: 16, border: '1px solid #E5E8E4' }}>
                <h2 className="bd-section-title" style={{ fontSize: '1.4rem', marginBottom: 8 }}>Brand Account & Billing Settings</h2>
                <p style={{ fontSize: '0.86rem', color: '#59655E', marginBottom: 24 }}>Manage your brand verified badge, billing currency, and escrow payout methods.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 480 }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>Company / Brand Name</label>
                    <input type="text" defaultValue="Razorpay Growth Team" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>Primary Contact Email</label>
                    <input type="email" defaultValue="sarah.mitchell@razorpay.com" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#19201C', display: 'block', marginBottom: 6 }}>Default Billing Currency</label>
                    <select style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E8E4' }} defaultValue="INR">
                      <option value="INR">INR (₹) - Indian Rupee (Default)</option>
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                      <option value="GBP">GBP (£) - British Pound</option>
                    </select>
                  </div>
                  <button type="button" className="bd-hero-search-btn" onClick={() => onShowToast('Brand settings updated.')}>
                    Save Settings
                  </button>
                </div>
              </div>
            )}
          </main>

          {/* =================================================================
              RIGHT COLUMN: Supporting Panels (Why, SmartMatch, How, Popular)
              ================================================================= */}
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
                    <span className="bd-how-desc">The creator responds and you finalize the details safely.</span>
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
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────────
          4. Floating Compare Tray (Sticky Bottom)
          ─────────────────────────────────────────────────────────────────── */}
      {comparedCreatorIds.length > 0 && (
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
          8. Add to Shortlist Modal
          ─────────────────────────────────────────────────────────────────── */}
      {shortlistModalOpen && creatorForShortlist && (
        <div className="bd-modal-overlay" onClick={() => setShortlistModalOpen(false)}>
          <div className="bd-modal-card" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
            <div className="bd-modal-header">
              <h3 className="bd-modal-title">Save to Shortlist</h3>
              <button type="button" className="bd-modal-close-btn" onClick={() => setShortlistModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="bd-modal-body">
              <p style={{ fontSize: '0.84rem', color: '#59655E', margin: '0 0 12px 0' }}>
                Select a campaign shortlist for <strong>{creatorForShortlist.fullName}</strong>:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────
          9. Help & Guidance Modal
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
    </div>
  );
};
