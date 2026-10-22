import React, { useState, useEffect, useMemo } from 'react';
import type {
  CollaborationRequest,
  CollaborationRequestStatus,
  PipelineStage,
  CurrencyCode,
  CreatorProfile,
  TimelineEvent
} from '../types/creator';
import { formatCurrency } from '../data/currencies';
import {
  Inbox,
  Check,
  Clock,
  XCircle,
  DollarSign,
  Building2,
  Send,
  ShieldCheck,
  Lock,
  FileText,
  Video,
  ExternalLink,
  Star,
  Sparkles,
  LayoutGrid,
  List,
  Search,
  ArrowRight,
  User,
  Zap,
  CheckCircle2,
  X
} from 'lucide-react';

interface CreatorInboxProps {
  requests: CollaborationRequest[];
  creators: CreatorProfile[];
  currentCurrency: CurrencyCode;
  onUpdateRequestStatus: (requestId: string, newStatus: CollaborationRequestStatus, notes?: string, counterOffer?: number) => void;
  onUpdateCollaborationRequest?: (updatedReq: CollaborationRequest, toastNotice?: string) => void;
  onCompleteWithReview?: (requestId: string, review: { rating: number; reviewText: string }) => void;
  targetRequestId?: string | null;
  onShowToast: (msg: string) => void;
  onSelectCreator?: (creator: CreatorProfile) => void;
  onInitiateBooking?: (creator: CreatorProfile, packageItem?: any) => void;
  initialPerspective?: 'creator' | 'brand';
}

export const CreatorInbox: React.FC<CreatorInboxProps> = ({
  requests,
  creators,
  currentCurrency,
  onUpdateRequestStatus,
  onUpdateCollaborationRequest,
  onCompleteWithReview,
  targetRequestId,
  onShowToast,
  onSelectCreator,
  onInitiateBooking,
  initialPerspective = 'creator'
}) => {
  // Perspective: 'creator' (manage incoming deals) vs 'brand' (seeker looking for creators)
  const [perspective, setPerspective] = useState<'creator' | 'brand'>(initialPerspective);

  // Main tab: 'deals' (work progress pipeline) vs 'creators' (find & hire creators)
  const [mainViewTab, setMainViewTab] = useState<'deals' | 'creators'>('deals');

  // Interactive status filter: 'all' | 'received' | 'requested' | 'undergoing' | 'completed'
  const [selectedMetricFilter, setSelectedMetricFilter] = useState<'all' | 'received' | 'requested' | 'undergoing' | 'completed'>('all');

  // Creator category & search (for seekers in 'creators' tab)
  const [creatorCategory, setCreatorCategory] = useState<string>('All Niches');
  const [creatorSearch, setCreatorSearch] = useState<string>('');

  useEffect(() => {
    if (initialPerspective) {
      setPerspective(initialPerspective);
    }
  }, [initialPerspective]);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>('all');
  const [selectedBrandName, setSelectedBrandName] = useState<string>('all');

  // View mode: 'kanban' (5-stage visual pipeline) vs 'list' (rich stack)
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');

  // Selected request for detail drawer
  const [selectedRequest, setSelectedRequest] = useState<CollaborationRequest | null>(null);

  // Modals state
  const [activeCounterModalReq, setActiveCounterModalReq] = useState<CollaborationRequest | null>(null);
  const [counterBudgetInput, setCounterBudgetInput] = useState<string>('');
  const [counterNotesInput, setCounterNotesInput] = useState<string>('');

  const [activeEscrowModalReq, setActiveEscrowModalReq] = useState<CollaborationRequest | null>(null);
  const [activeScriptModalReq, setActiveScriptModalReq] = useState<CollaborationRequest | null>(null);
  const [scriptHookInput, setScriptHookInput] = useState('');
  const [scriptPointsInput, setScriptPointsInput] = useState('');
  const [scriptCtaInput, setScriptCtaInput] = useState('');

  const [activeDraftModalReq, setActiveDraftModalReq] = useState<CollaborationRequest | null>(null);
  const [draftUrlInput, setDraftUrlInput] = useState('https://vimeo.com/unlisted/review-preview-4k');
  const [draftNotesInput, setDraftNotesInput] = useState('4K 60fps export with studio lighting and clean lavalier audio.');

  const [activeLiveModalReq, setActiveLiveModalReq] = useState<CollaborationRequest | null>(null);
  const [liveUrlInput, setLiveUrlInput] = useState('https://instagram.com/reel/C89xYzDemo');

  const [activeReviewModalReq, setActiveReviewModalReq] = useState<CollaborationRequest | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewTextInput, setReviewTextInput] = useState('');

  // Handle target request when navigated from Booking modal
  useEffect(() => {
    if (targetRequestId) {
      const match = requests.find(r => r.id === targetRequestId);
      if (match) {
        setSelectedRequest(match);
        // If brand matches, set perspective
        setPerspective('brand');
        setSelectedBrandName(match.brandName);
        onShowToast(`Opened campaign ${match.id} in Workflow Pipeline`);
      }
    }
  }, [targetRequestId, requests]);

  // Unique brands in requests
  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    requests.forEach(r => {
      if (r.brandName) set.add(r.brandName);
    });
    return Array.from(set);
  }, [requests]);

  // Helper to determine stage if missing on older requests
  const getEffectiveStage = (req: CollaborationRequest): PipelineStage => {
    if (req.pipelineStage) return req.pipelineStage;
    if (req.status === 'completed') return 'live_completed';
    if (req.status === 'in_progress') return 'draft_review';
    if (req.status === 'accepted') return req.escrowStatus === 'held' ? 'script_signoff' : 'escrow_funding';
    return 'proposal';
  };

  // Helper to append a timeline event
  const appendTimelineEvent = (req: CollaborationRequest, action: string, details?: string, actor: 'brand' | 'creator' | 'system' = 'system'): TimelineEvent[] => {
    const currentEvents = req.timelineEvents || [];
    const newEvent: TimelineEvent = {
      id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: 'Just now',
      actor,
      action,
      details
    };
    return [newEvent, ...currentEvents];
  };

  // Update a collaboration request with unified dispatcher
  const updateRequestHelper = (updated: CollaborationRequest, toastNotice?: string) => {
    if (onUpdateCollaborationRequest) {
      onUpdateCollaborationRequest(updated, toastNotice);
    } else {
      onUpdateRequestStatus(updated.id, updated.status, updated.creatorNotes, updated.counterOfferINR);
      if (toastNotice) onShowToast(toastNotice);
    }

    if (selectedRequest && selectedRequest.id === updated.id) {
      setSelectedRequest(updated);
    }
  };

  // -------------------------------------------------------------
  // STAGE TRANSITION ACTIONS
  // -------------------------------------------------------------

  // STAGE 1 -> Accept Request (Creator)
  const handleCreatorAccept = (req: CollaborationRequest) => {
    const updated: CollaborationRequest = {
      ...req,
      status: 'accepted',
      pipelineStage: 'escrow_funding',
      creatorNotes: 'Creator accepted terms. Awaiting brand escrow deposit to lock budget.',
      timelineEvents: appendTimelineEvent(
        req,
        'Terms Accepted by Creator',
        `${req.creatorName} accepted the campaign terms. Milestone escrow deposit required.`,
        'creator'
      )
    };
    updateRequestHelper(updated, `Accepted collaboration with ${req.brandName}! Moved to Escrow Funding.`);
  };

  // STAGE 1 -> Send Custom Counter-Quote (Creator)
  const handleSendCounterQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCounterModalReq) return;
    const num = parseInt(counterBudgetInput, 10);
    if (isNaN(num) || num <= 0) {
      onShowToast('Please enter a valid revised budget.');
      return;
    }
    const updated: CollaborationRequest = {
      ...activeCounterModalReq,
      status: 'in_discussion',
      pipelineStage: 'proposal',
      counterOfferINR: num,
      counterOfferNotes: counterNotesInput,
      timelineEvents: appendTimelineEvent(
        activeCounterModalReq,
        'Custom Counter-Quote Proposed',
        `Revised budget proposed: ₹${num.toLocaleString('en-IN')}. Note: ${counterNotesInput}`,
        'creator'
      )
    };
    updateRequestHelper(updated, `Revised quote of ${formatCurrency(num, currentCurrency)} sent to ${activeCounterModalReq.brandName}!`);
    setActiveCounterModalReq(null);
  };

  // STAGE 1 -> Brand Accepts Creator's Counter-Quote
  const handleBrandAcceptCounterQuote = (req: CollaborationRequest) => {
    const finalBudget = req.counterOfferINR || req.budgetINR;
    const updated: CollaborationRequest = {
      ...req,
      budgetINR: finalBudget,
      status: 'accepted',
      pipelineStage: 'escrow_funding',
      counterOfferINR: undefined,
      timelineEvents: appendTimelineEvent(
        req,
        'Brand Accepted Revised Terms',
        `${req.brandName} accepted the counter-quote for ₹${finalBudget.toLocaleString('en-IN')}. Ready for escrow funding.`,
        'brand'
      )
    };
    updateRequestHelper(updated, `Accepted revised terms of ${formatCurrency(finalBudget, currentCurrency)}. Ready for escrow funding.`);
  };

  // STAGE 1 -> Decline
  const handleDecline = (req: CollaborationRequest) => {
    const updated: CollaborationRequest = {
      ...req,
      status: 'declined',
      creatorNotes: 'Declined due to scheduling constraints.',
      timelineEvents: appendTimelineEvent(
        req,
        'Request Declined',
        'Collaboration closed.',
        'creator'
      )
    };
    updateRequestHelper(updated, `Declined collaboration request ${req.id}.`);
  };

  // STAGE 2 -> Deposit Escrow (Brand)
  const handleDepositEscrow = (req: CollaborationRequest) => {
    const updated: CollaborationRequest = {
      ...req,
      escrowStatus: 'held',
      escrowAmountINR: req.budgetINR,
      pipelineStage: 'script_signoff',
      status: 'accepted',
      timelineEvents: appendTimelineEvent(
        req,
        'Escrow Deposited & Locked',
        `₹${req.budgetINR.toLocaleString('en-IN')} deposited safely into Creatorly Escrow Vault. Zero risk for brand.`,
        'brand'
      )
    };
    updateRequestHelper(updated, `🛡️ ₹${req.budgetINR.toLocaleString('en-IN')} locked safely into Creatorly Escrow! Moved to Script Signoff.`);
    setActiveEscrowModalReq(null);
  };

  // STAGE 3 -> Submit Script Outline (Creator)
  const handleSubmitScriptOutline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeScriptModalReq) return;
    const points = scriptPointsInput.split('\n').filter(p => p.trim().length > 0);
    const updated: CollaborationRequest = {
      ...activeScriptModalReq,
      scriptOutline: {
        title: activeScriptModalReq.serviceTitle,
        hook: scriptHookInput || 'Stop scrolling: here is why this product changed our workflow.',
        talkingPoints: points.length > 0 ? points : ['Demonstrate real-world feature', 'Unboxing & build quality', 'Pricing & value comparison'],
        callToAction: scriptCtaInput || 'Check the link in bio for exclusive launch discount.',
        status: 'submitted'
      },
      timelineEvents: appendTimelineEvent(
        activeScriptModalReq,
        'Script Outline Delivered for Review',
        `Hook: "${scriptHookInput || 'Hook concept'}". Awaiting brand signoff.`,
        'creator'
      )
    };
    updateRequestHelper(updated, `Script outline submitted to ${activeScriptModalReq.brandName} for signoff!`);
    setActiveScriptModalReq(null);
  };

  // STAGE 3 -> Approve Script (Brand)
  const handleBrandApproveScript = (req: CollaborationRequest) => {
    const updated: CollaborationRequest = {
      ...req,
      pipelineStage: 'draft_review',
      status: 'in_progress',
      scriptOutline: req.scriptOutline ? {
        ...req.scriptOutline,
        status: 'approved',
        feedbackNotes: 'Outline signed off without changes. Filming cleared!'
      } : undefined,
      timelineEvents: appendTimelineEvent(
        req,
        'Script Outline Approved by Brand',
        'Brand verified messaging & claims. Production & studio filming commenced.',
        'brand'
      )
    };
    updateRequestHelper(updated, `Script signed off! 🎬 ${req.creatorName} is now filming in 4K studio.`);
  };

  // STAGE 3 -> Request Script Changes (Brand)
  const handleBrandRequestScriptChanges = (req: CollaborationRequest) => {
    const updated: CollaborationRequest = {
      ...req,
      scriptOutline: req.scriptOutline ? {
        ...req.scriptOutline,
        status: 'revision_requested',
        feedbackNotes: 'Please tighten the hook to mention our 14-day free trial within the first 3 seconds.'
      } : undefined,
      timelineEvents: appendTimelineEvent(
        req,
        'Script Revisions Requested',
        'Brand requested hook adjustment to feature 14-day free trial.',
        'brand'
      )
    };
    updateRequestHelper(updated, `Revision note sent to ${req.creatorName}.`);
  };

  // STAGE 4 -> Submit 4K Video Draft (Creator)
  const handleSubmitVideoDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDraftModalReq) return;
    const currentVersion = activeDraftModalReq.videoDraft?.version || 0;
    const updated: CollaborationRequest = {
      ...activeDraftModalReq,
      pipelineStage: 'draft_review',
      status: 'in_progress',
      videoDraft: {
        draftUrl: draftUrlInput,
        version: currentVersion + 1,
        status: 'submitted',
        revisionNotes: draftNotesInput,
        submittedAt: 'Just now'
      },
      timelineEvents: appendTimelineEvent(
        activeDraftModalReq,
        `4K Video Draft (v${currentVersion + 1}) Delivered`,
        `Review link submitted: ${draftUrlInput}. Notes: ${draftNotesInput}`,
        'creator'
      )
    };
    updateRequestHelper(updated, `Video draft v${currentVersion + 1} delivered to ${activeDraftModalReq.brandName} for review!`);
    setActiveDraftModalReq(null);
  };

  // STAGE 4 -> Approve Video Draft (Brand)
  const handleBrandApproveDraft = (req: CollaborationRequest) => {
    const updated: CollaborationRequest = {
      ...req,
      videoDraft: req.videoDraft ? {
        ...req.videoDraft,
        status: 'approved'
      } : undefined,
      timelineEvents: appendTimelineEvent(
        req,
        'Video Draft Approved by Brand',
        'Visuals and audio cleared for publishing. Ready for go-live scheduling.',
        'brand'
      )
    };
    updateRequestHelper(updated, `✨ Video draft approved! Ready for ${req.creatorName} to publish live.`);
  };

  // STAGE 4 -> Request Video Revisions (Brand)
  const handleBrandRequestVideoRevision = (req: CollaborationRequest) => {
    const updated: CollaborationRequest = {
      ...req,
      videoDraft: req.videoDraft ? {
        ...req.videoDraft,
        status: 'revision_requested',
        revisionNotes: 'Please boost voiceover volume by +2dB and add a subtitle callout on the CTA.'
      } : undefined,
      timelineEvents: appendTimelineEvent(
        req,
        'Video Edit Revisions Requested',
        'Brand requested audio mix adjustment and subtitle callout (1 included revision round used).',
        'brand'
      )
    };
    updateRequestHelper(updated, `Revision feedback transmitted to ${req.creatorName}.`);
  };

  // STAGE 5 -> Submit Live Publication URL (Creator)
  const handleSubmitLiveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLiveModalReq) return;
    const updated: CollaborationRequest = {
      ...activeLiveModalReq,
      pipelineStage: 'live_completed',
      publishedDeliverable: {
        liveUrl: liveUrlInput,
        platform: 'Instagram Reels',
        publishedAt: 'Today',
        views: 12400
      },
      timelineEvents: appendTimelineEvent(
        activeLiveModalReq,
        'Deliverable Published Live',
        `Content is live at: ${liveUrlInput}. Escrow payout ready for brand release signoff.`,
        'creator'
      )
    };
    updateRequestHelper(updated, `🎉 Live publication link submitted! ${activeLiveModalReq.brandName} can now verify and release escrow.`);
    setActiveLiveModalReq(null);
  };

  // STAGE 5 -> Release Escrow Payout & Submit Verified Review (Brand)
  const handleReleaseEscrowAndReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReviewModalReq) return;

    const reviewData = {
      rating: reviewRating,
      reviewText: reviewTextInput.trim() || `${activeReviewModalReq.creatorName} delivered exceptional work on schedule! Engagement surpassed our benchmarks.`
    };

    if (onCompleteWithReview) {
      onCompleteWithReview(activeReviewModalReq.id, reviewData);
    } else {
      const updated: CollaborationRequest = {
        ...activeReviewModalReq,
        status: 'completed',
        pipelineStage: 'live_completed',
        escrowStatus: 'released',
        brandReview: {
          rating: reviewData.rating,
          reviewText: reviewData.reviewText,
          submittedAt: 'Today'
        },
        timelineEvents: appendTimelineEvent(
          activeReviewModalReq,
          'Escrow Payout Released & 5-Star Review Written',
          `₹${activeReviewModalReq.budgetINR.toLocaleString('en-IN')} disbursed from escrow vault. Verified transaction review published on storefront profile.`,
          'brand'
        )
      };
      updateRequestHelper(updated);
    }

    onShowToast(`🎉 ₹${activeReviewModalReq.budgetINR.toLocaleString('en-IN')} escrow disbursed to ${activeReviewModalReq.creatorName}! Verified review published.`);
    setActiveReviewModalReq(null);
  };

  // Fast-forward demo helper (simulates next logical step)
  const handleFastForwardDemo = (req: CollaborationRequest) => {
    const stage = getEffectiveStage(req);
    if (stage === 'proposal') {
      handleCreatorAccept(req);
    } else if (stage === 'escrow_funding') {
      handleDepositEscrow(req);
    } else if (stage === 'script_signoff') {
      if (!req.scriptOutline || req.scriptOutline.status !== 'submitted') {
        const updated: CollaborationRequest = {
          ...req,
          scriptOutline: {
            title: req.serviceTitle,
            hook: 'Stop scrolling: here is why this product changed our workflow.',
            talkingPoints: ['Real-world test in Mumbai studio', 'Performance comparison', 'Exclusive discount link'],
            callToAction: 'Tap link in bio to claim launch discount.',
            status: 'submitted'
          },
          timelineEvents: appendTimelineEvent(req, 'Script Outline Delivered', 'Fast-forward demo outline generated.', 'creator')
        };
        updateRequestHelper(updated, `Script outline submitted for ${req.id}. Click Approve Script to film!`);
      } else {
        handleBrandApproveScript(req);
      }
    } else if (stage === 'draft_review') {
      if (!req.videoDraft || req.videoDraft.status !== 'submitted') {
        const updated: CollaborationRequest = {
          ...req,
          videoDraft: {
            draftUrl: 'https://vimeo.com/unlisted/review-preview-4k',
            version: 1,
            status: 'submitted',
            revisionNotes: '4K unlisted draft delivered with studio audio mix.',
            submittedAt: 'Just now'
          },
          timelineEvents: appendTimelineEvent(req, '4K Draft Video Delivered', 'Unlisted review preview uploaded.', 'creator')
        };
        updateRequestHelper(updated, `4K Video draft delivered for ${req.id}! Click Approve Draft to publish.`);
      } else {
        handleBrandApproveDraft(req);
      }
    } else if (stage === 'live_completed') {
      if (req.status !== 'completed') {
        setActiveReviewModalReq(req);
      } else {
        onShowToast(`Campaign ${req.id} is already completed and verified!`);
      }
    }
  };

  // -------------------------------------------------------------
  // OFFERS & WORK STATUS COUNTERS
  // -------------------------------------------------------------
  const summaryMetrics = useMemo(() => {
    let received = 0;
    let requested = 0;
    let undergoing = 0;
    let completed = 0;
    let totalBudget = 0;

    requests.forEach(r => {
      totalBudget += r.budgetINR;
      const eff = getEffectiveStage(r);

      if (eff === 'proposal') {
        if (perspective === 'creator') {
          received++;
        } else {
          if (r.counterOfferINR) received++;
          else requested++;
        }
      } else if (['escrow_funding', 'script_signoff', 'draft_review'].includes(eff)) {
        undergoing++;
      } else if (eff === 'live_completed' || r.status === 'completed') {
        completed++;
      }
    });

    return { received, requested, undergoing, completed, totalBudget };
  }, [requests, perspective]);

  // -------------------------------------------------------------
  // CREATOR CATEGORIES & FILTERING (FOR SEEKERS)
  // -------------------------------------------------------------
  const CREATOR_CATEGORIES = [
    { label: 'All Creators', key: 'All Niches', icon: '🌟' },
    { label: 'Education', key: 'Education', icon: '🎓' },
    { label: 'Lifestyle', key: 'Lifestyle', icon: '🌿' },
    { label: 'Economics & Finance', key: 'Finance', icon: '📈' },
    { label: 'Tech & AI', key: 'Tech', icon: '💻' },
    { label: 'Documentary', key: 'Documentary', icon: '🎬' },
    { label: 'Reels & Shorts', key: 'Reels', icon: '⚡' },
    { label: 'Fitness & Sports', key: 'Fitness', icon: '🏋️' },
    { label: 'Food & Travel', key: 'Food', icon: '🍕' },
    { label: 'Fashion & Styling', key: 'Fashion', icon: '👗' }
  ];

  const filteredCreators = useMemo(() => {
    return creators.filter(c => {
      if (creatorCategory !== 'All Niches') {
        const key = creatorCategory.toLowerCase();
        const niche = (c.primaryNiche || '').toLowerCase();
        const subs = (c.subNiches || []).map(s => s.toLowerCase()).join(' ');
        const bio = (c.bio || '').toLowerCase();
        let match = niche.includes(key) || subs.includes(key) || bio.includes(key);
        if (key === 'lifestyle' && (niche.includes('tech & life') || subs.includes('routine') || subs.includes('vlog'))) {
          match = true;
        }
        if (!match) return false;
      }
      if (creatorSearch.trim()) {
        const q = creatorSearch.toLowerCase();
        const match =
          c.fullName.toLowerCase().includes(q) ||
          c.handle.toLowerCase().includes(q) ||
          c.primaryNiche.toLowerCase().includes(q) ||
          c.bio.toLowerCase().includes(q) ||
          c.location.city.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [creators, creatorCategory, creatorSearch]);

  // -------------------------------------------------------------
  // DEALS FILTERING LOGIC
  // -------------------------------------------------------------
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Perspective filter
      if (perspective === 'creator' && selectedCreatorId !== 'all' && req.creatorId !== selectedCreatorId) {
        return false;
      }
      if (perspective === 'brand' && selectedBrandName !== 'all' && req.brandName !== selectedBrandName) {
        return false;
      }

      // Interactive Metric Filter (Received / Requested / Undergoing / Completed)
      if (selectedMetricFilter === 'received') {
        const isReceived = perspective === 'creator'
          ? getEffectiveStage(req) === 'proposal'
          : getEffectiveStage(req) === 'proposal' && !!req.counterOfferINR;
        if (!isReceived) return false;
      } else if (selectedMetricFilter === 'requested') {
        const isRequested = perspective === 'brand'
          ? getEffectiveStage(req) === 'proposal' && !req.counterOfferINR
          : getEffectiveStage(req) === 'proposal' && !!req.counterOfferINR;
        if (!isRequested) return false;
      } else if (selectedMetricFilter === 'undergoing') {
        const eff = getEffectiveStage(req);
        if (!['escrow_funding', 'script_signoff', 'draft_review'].includes(eff)) return false;
      } else if (selectedMetricFilter === 'completed') {
        const eff = getEffectiveStage(req);
        if (eff !== 'live_completed' && req.status !== 'completed') return false;
      }

      // Tab filter (for list view)
      if (activeTab === 'proposals' && getEffectiveStage(req) !== 'proposal') return false;
      if (activeTab === 'escrow' && getEffectiveStage(req) !== 'escrow_funding') return false;
      if (activeTab === 'script' && getEffectiveStage(req) !== 'script_signoff') return false;
      if (activeTab === 'production' && getEffectiveStage(req) !== 'draft_review') return false;
      if (activeTab === 'completed' && getEffectiveStage(req) !== 'live_completed' && req.status !== 'completed') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          req.id.toLowerCase().includes(q) ||
          req.brandName.toLowerCase().includes(q) ||
          req.creatorName.toLowerCase().includes(q) ||
          req.serviceTitle.toLowerCase().includes(q) ||
          req.campaignObjective.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [requests, perspective, selectedCreatorId, selectedBrandName, selectedMetricFilter, activeTab, searchQuery]);

  // Group by Pipeline Stage for Kanban Board (EASY NORMAL ENGLISH)
  const kanbanStages: { stage: PipelineStage; title: string; subtitle: string; icon: React.ReactNode; color: string }[] = [
    {
      stage: 'proposal',
      title: '1. New Offers',
      subtitle: 'Discuss terms & agree on price',
      icon: <FileText size={16} />,
      color: '#3B82F6'
    },
    {
      stage: 'escrow_funding',
      title: '2. Safe Money Advance',
      subtitle: 'Payment held safely before filming starts',
      icon: <Lock size={16} />,
      color: '#F59E0B'
    },
    {
      stage: 'script_signoff',
      title: '3. Plan & Script Review',
      subtitle: 'Review script outline & talking points',
      icon: <ShieldCheck size={16} />,
      color: '#8B5CF6'
    },
    {
      stage: 'draft_review',
      title: '4. Making Video & Preview',
      subtitle: 'Filming, editing & checking preview draft',
      icon: <Video size={16} />,
      color: '#06B6D4'
    },
    {
      stage: 'live_completed',
      title: '5. Published & Money Paid',
      subtitle: 'Video is live and money paid to creator',
      icon: <CheckCircle2 size={16} />,
      color: '#10B981'
    }
  ];

  return (
    <section className="inbox-section" id="workflow-pipeline">
      <div className="inbox-container">
        {/* Top Role & View Switcher Bar */}
        <div className="pipeline-top-nav-bar">
          <div className="nav-role-switcher">
            <span className="role-switcher-label">Acting as:</span>
            <button
              type="button"
              className={`role-tab-btn ${perspective === 'creator' ? 'active' : ''}`}
              onClick={() => {
                setPerspective('creator');
                onShowToast('Viewing as Content Creator');
              }}
            >
              <User size={14} />
              <span>Content Creator</span>
            </button>
            <button
              type="button"
              className={`role-tab-btn ${perspective === 'brand' ? 'active' : ''}`}
              onClick={() => {
                setPerspective('brand');
                onShowToast('Viewing as Seeker / Brand (Looking for Creators)');
              }}
            >
              <Building2 size={14} />
              <span>Seeker (Brand / Client)</span>
            </button>
          </div>

          <div className="main-view-switcher">
            <button
              type="button"
              className={`main-tab-pill ${mainViewTab === 'deals' ? 'active' : ''}`}
              onClick={() => setMainViewTab('deals')}
            >
              <LayoutGrid size={14} />
              <span>Deals & Work Tracker ({requests.length})</span>
            </button>
            <button
              type="button"
              className={`main-tab-pill ${mainViewTab === 'creators' ? 'active' : ''}`}
              onClick={() => setMainViewTab('creators')}
            >
              <Sparkles size={14} />
              <span>Find & Hire Creators ({creators.length})</span>
            </button>
          </div>
        </div>

        {/* Page Title & Explanation in Simple English */}
        <div className="pipeline-title-card">
          <div className="title-left">
            <div className="pipeline-eyebrow">
              <span className="eyebrow-dot"></span>
              <span>100% TRANSPARENT WORKFLOW</span>
            </div>
            <h2 className="pipeline-title">
              {mainViewTab === 'creators'
                ? 'Discover & Hire Verified Creators'
                : perspective === 'creator'
                  ? 'Your Offers, Work In Progress & Payments'
                  : 'Track Your Creator Offers & Video Campaigns'}
            </h2>
            <p className="pipeline-subtitle">
              {mainViewTab === 'creators'
                ? 'Browse vetted creators across Education, Lifestyle, Finance, Tech, Documentary, Reels, Shorts & more with transparent fixed pricing.'
                : 'See how many offers you have, check video progress in simple steps, and release payments safely when videos are approved.'}
            </p>
          </div>

          {mainViewTab === 'deals' && (
            <div className="pipeline-header-controls">
              {perspective === 'creator' ? (
                <div className="filter-pill-dropdown">
                  <label>Creator:</label>
                  <select
                    value={selectedCreatorId}
                    onChange={(e) => setSelectedCreatorId(e.target.value)}
                  >
                    <option value="all">All Creators ({creators.length})</option>
                    {creators.map(c => (
                      <option key={c.id} value={c.id}>{c.fullName}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="filter-pill-dropdown">
                  <label>Brand:</label>
                  <select
                    value={selectedBrandName}
                    onChange={(e) => setSelectedBrandName(e.target.value)}
                  >
                    <option value="all">All Brands ({availableBrands.length})</option>
                    {availableBrands.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="view-mode-toggle">
                <button
                  type="button"
                  className={`toggle-btn ${viewMode === 'kanban' ? 'active' : ''}`}
                  onClick={() => setViewMode('kanban')}
                  title="Kanban Board View"
                >
                  <LayoutGrid size={15} />
                  <span>Board</span>
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <List size={15} />
                  <span>List</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* INTERACTIVE WORK & OFFERS SUMMARY BAR (5 EASY CARDS)      */}
        {/* ========================================================= */}
        <div className="offers-summary-grid">
          {/* 1. Offers Received */}
          <div
            className={`summary-stat-card card-received ${selectedMetricFilter === 'received' ? 'selected' : ''}`}
            onClick={() => setSelectedMetricFilter(selectedMetricFilter === 'received' ? 'all' : 'received')}
            title="Click to view only received offers"
          >
            <div className="stat-card-top">
              <span className="stat-icon-circ blue">📥</span>
              <span className="stat-number">{summaryMetrics.received}</span>
            </div>
            <strong className="stat-label">Offers Received</strong>
            <span className="stat-desc">New offers waiting for your agreement</span>
          </div>

          {/* 2. Offers Requested */}
          <div
            className={`summary-stat-card card-requested ${selectedMetricFilter === 'requested' ? 'selected' : ''}`}
            onClick={() => setSelectedMetricFilter(selectedMetricFilter === 'requested' ? 'all' : 'requested')}
            title="Click to view only offers you sent or requested"
          >
            <div className="stat-card-top">
              <span className="stat-icon-circ amber">📤</span>
              <span className="stat-number">{summaryMetrics.requested}</span>
            </div>
            <strong className="stat-label">Offers Requested</strong>
            <span className="stat-desc">Proposals and custom quotes sent out</span>
          </div>

          {/* 3. Work Undergoing */}
          <div
            className={`summary-stat-card card-undergoing ${selectedMetricFilter === 'undergoing' ? 'selected' : ''}`}
            onClick={() => setSelectedMetricFilter(selectedMetricFilter === 'undergoing' ? 'all' : 'undergoing')}
            title="Click to view work currently being made"
          >
            <div className="stat-card-top">
              <span className="stat-icon-circ purple">⚙️</span>
              <span className="stat-number">{summaryMetrics.undergoing}</span>
            </div>
            <strong className="stat-label">Work Undergoing</strong>
            <span className="stat-desc">Scripts in review & videos being filmed</span>
          </div>

          {/* 4. Completed & Paid */}
          <div
            className={`summary-stat-card card-completed ${selectedMetricFilter === 'completed' ? 'selected' : ''}`}
            onClick={() => setSelectedMetricFilter(selectedMetricFilter === 'completed' ? 'all' : 'completed')}
            title="Click to view completed campaigns"
          >
            <div className="stat-card-top">
              <span className="stat-icon-circ green">✅</span>
              <span className="stat-number">{summaryMetrics.completed}</span>
            </div>
            <strong className="stat-label">Completed & Paid</strong>
            <span className="stat-desc">Videos live & payment released</span>
          </div>

          {/* 5. Total Deal Value */}
          <div className="summary-stat-card card-value">
            <div className="stat-card-top">
              <span className="stat-icon-circ emerald">💰</span>
              <span className="stat-number-currency">{formatCurrency(summaryMetrics.totalBudget, currentCurrency)}</span>
            </div>
            <strong className="stat-label">Total Campaign Money</strong>
            <span className="stat-desc">100% held safely in milestone escrow</span>
          </div>
        </div>

        {/* Active Filter Reminder Badge */}
        {selectedMetricFilter !== 'all' && (
          <div className="active-filter-alert-bar">
            <span>
              Showing only: <strong>{selectedMetricFilter.toUpperCase()}</strong> ({filteredRequests.length} campaigns found)
            </span>
            <button
              type="button"
              className="btn-clear-status-filter"
              onClick={() => setSelectedMetricFilter('all')}
            >
              <X size={13} />
              <span>Show All Deals</span>
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW A: FIND & HIRE CREATORS TAB (FOR SEEKERS)           */}
        {/* ========================================================= */}
        {mainViewTab === 'creators' && (
          <div className="seeker-creators-showcase">
            {/* Category Filter Pills */}
            <div className="creator-category-scroll-rail">
              {CREATOR_CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  type="button"
                  className={`category-pill-btn ${creatorCategory === cat.key ? 'active' : ''}`}
                  onClick={() => setCreatorCategory(cat.key)}
                >
                  <span className="cat-icon">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Search Bar for Creators */}
            <div className="creator-directory-search-bar">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search creators by name, topic (e.g. AI, investing, filmmaking, styling, fitness)..."
                value={creatorSearch}
                onChange={(e) => setCreatorSearch(e.target.value)}
              />
              {creatorSearch && (
                <button type="button" className="clear-search-btn" onClick={() => setCreatorSearch('')}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Creators Grid */}
            <div className="seeker-creators-grid">
              {filteredCreators.length === 0 ? (
                <div className="creators-empty-box">
                  <p>No creators found matching "{creatorSearch}". Try another category or keyword.</p>
                </div>
              ) : (
                filteredCreators.map(creator => (
                  <div key={creator.id} className="creator-directory-card">
                    <div className="creator-card-header">
                      <div className="creator-avatar-wrap">
                        <img src={creator.avatarUrl} alt={creator.fullName} className="creator-card-avatar" />
                        {creator.verifiedBadge && <span className="creator-verified-check">✓</span>}
                      </div>
                      <div className="creator-header-info">
                        <div className="creator-name-row">
                          <h3 className="creator-name-heading">{creator.fullName}</h3>
                          <span className="creator-handle-badge">{creator.handle}</span>
                        </div>
                        <span className="creator-location-text">📍 {creator.location.city}, {creator.location.country}</span>
                      </div>
                    </div>

                    <div className="creator-niche-pill-wrap">
                      <span className="creator-niche-pill">{creator.primaryNiche}</span>
                      {creator.subNiches && creator.subNiches[0] && (
                        <span className="creator-subniche-pill">{creator.subNiches[0]}</span>
                      )}
                    </div>

                    <p className="creator-bio-snippet">{creator.bio}</p>

                    {/* Simple Audience Numbers */}
                    <div className="creator-simple-metrics">
                      <div className="simple-metric-col">
                        <span className="metric-val">{(creator.metrics.totalAudience / 1000).toFixed(0)}K</span>
                        <span className="metric-lbl">Audience</span>
                      </div>
                      <div className="simple-metric-col">
                        <span className="metric-val">{(creator.metrics.averageViews / 1000).toFixed(0)}K</span>
                        <span className="metric-lbl">Avg Views</span>
                      </div>
                      <div className="simple-metric-col">
                        <span className="metric-val">{creator.metrics.engagementRate}%</span>
                        <span className="metric-lbl">Engagement</span>
                      </div>
                    </div>

                    <div className="creator-card-footer">
                      <div className="creator-price-tag">
                        <span className="price-prefix">From</span>
                        <strong>{formatCurrency(creator.packages[0]?.priceInINR || 5000, currentCurrency)}</strong>
                      </div>
                      <div className="creator-card-btns">
                        <button
                          type="button"
                          className="btn-hire-creator"
                          onClick={() => {
                            if (onInitiateBooking) {
                              onInitiateBooking(creator);
                            } else if (onSelectCreator) {
                              onSelectCreator(creator);
                            }
                          }}
                        >
                          <span>Send Offer / Book</span>
                          <ArrowRight size={13} />
                        </button>
                        <button
                          type="button"
                          className="btn-view-creator-profile"
                          onClick={() => {
                            if (onSelectCreator) onSelectCreator(creator);
                          }}
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW B: DEALS WORKFLOW (KANBAN / LIST VIEW)               */}
        {/* ========================================================= */}
        {mainViewTab === 'deals' && (
          <>
            {/* Search & Sub-filters bar */}
            <div className="pipeline-filter-toolbar">
              <div className="pipeline-search-box">
                <Search size={15} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search deals by brand, creator, campaign ID, or objective..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button type="button" className="clear-search-btn" onClick={() => setSearchQuery('')}>
                    <X size={14} />
                  </button>
                )}
              </div>

              {viewMode === 'list' && (
                <div className="pipeline-stage-tabs">
                  <button
                    type="button"
                    className={`stage-tab ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                  >
                    All ({filteredRequests.length})
                  </button>
                  <button
                    type="button"
                    className={`stage-tab ${activeTab === 'proposals' ? 'active' : ''}`}
                    onClick={() => setActiveTab('proposals')}
                  >
                    1. New Offers
                  </button>
                  <button
                    type="button"
                    className={`stage-tab ${activeTab === 'escrow' ? 'active' : ''}`}
                    onClick={() => setActiveTab('escrow')}
                  >
                    2. Safe Deposit
                  </button>
                  <button
                    type="button"
                    className={`stage-tab ${activeTab === 'script' ? 'active' : ''}`}
                    onClick={() => setActiveTab('script')}
                  >
                    3. Script Review
                  </button>
                  <button
                    type="button"
                    className={`stage-tab ${activeTab === 'production' ? 'active' : ''}`}
                    onClick={() => setActiveTab('production')}
                  >
                    4. Video Preview
                  </button>
                  <button
                    type="button"
                    className={`stage-tab ${activeTab === 'completed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('completed')}
                  >
                    5. Completed & Paid
                  </button>
                </div>
              )}
            </div>

            {/* ========================================================= */}
            {/* VIEW 1: KANBAN 5-STAGE PIPELINE BOARD                    */}
            {/* ========================================================= */}
            {viewMode === 'kanban' && (
              <div className="kanban-pipeline-grid">
                {kanbanStages.map((col) => {
                  const stageRequests = filteredRequests.filter(r => getEffectiveStage(r) === col.stage);
                  const stageTotalBudget = stageRequests.reduce((sum, r) => sum + r.budgetINR, 0);

                  return (
                    <div key={col.stage} className={`kanban-stage-col col-${col.stage}`}>
                      {/* Column Header */}
                      <div className="kanban-col-header">
                        <div className="col-header-top">
                          <div className="col-title-wrap" style={{ color: col.color }}>
                            {col.icon}
                            <h4>{col.title}</h4>
                          </div>
                          <span className="col-count-pill">{stageRequests.length}</span>
                        </div>
                        <div className="col-header-sub">
                          <span>{col.subtitle}</span>
                          <strong className="col-budget-val">{formatCurrency(stageTotalBudget, currentCurrency)}</strong>
                        </div>
                      </div>

                      {/* Column Deals Stack */}
                      <div className="kanban-cards-stack">
                        {stageRequests.length === 0 ? (
                          <div className="kanban-empty-drop">
                            <span>No deals in this stage</span>
                          </div>
                        ) : (
                          stageRequests.map((req) => {
                            const isSelected = selectedRequest?.id === req.id;
                            return (
                              <div
                                key={req.id}
                                className={`kanban-deal-card card ${isSelected ? 'selected' : ''}`}
                                onClick={() => setSelectedRequest(req)}
                              >
                                {/* Card Top: Ref ID & Escrow Pill */}
                                <div className="deal-card-top">
                                  <span className="deal-ref-id">{req.id}</span>
                                  {req.escrowStatus === 'held' && (
                                    <span className="escrow-status-pill locked" title="Funds deposited in vault">
                                      <Lock size={10} /> Escrow Locked
                                    </span>
                                  )}
                                  {req.escrowStatus === 'released' && (
                                    <span className="escrow-status-pill released" title="Payout released">
                                      <Check size={10} /> Escrow Released
                                    </span>
                                  )}
                                  {(!req.escrowStatus || req.escrowStatus === 'unfunded') && req.status === 'accepted' && (
                                    <span className="escrow-status-pill pending">
                                      Awaiting Deposit
                                    </span>
                                  )}
                                </div>

                                {/* Brand & Creator strip */}
                                <div className="deal-ident-row">
                                  <div className="deal-brand-meta">
                                    <span className="deal-brand-label">Brand:</span>
                                    <strong className="deal-brand-name">{req.brandName}</strong>
                                  </div>
                                  <div className="deal-creator-badge" onClick={(e) => {
                                    e.stopPropagation();
                                    if (onSelectCreator) {
                                      const c = creators.find(cr => cr.id === req.creatorId);
                                      if (c) onSelectCreator(c);
                                    }
                                  }}>
                                    <img src={req.creatorAvatar} alt={req.creatorName} className="creator-mini-avatar" />
                                    <span>{req.creatorName}</span>
                                  </div>
                                </div>

                                {/* Service title & Price */}
                                <div className="deal-service-box">
                                  <span className="service-title">{req.serviceTitle}</span>
                                  <strong className="service-price">{formatCurrency(req.budgetINR, currentCurrency)}</strong>
                                </div>

                                {/* Stage-specific micro status */}
                                {col.stage === 'proposal' && (
                                  <div className="stage-micro-status">
                                    {req.counterOfferINR ? (
                                      <span className="micro-tag alert">
                                        Counter Quote: {formatCurrency(req.counterOfferINR, currentCurrency)}
                                      </span>
                                    ) : (
                                      <span className="micro-tag">Awaiting Scope Review</span>
                                    )}
                                  </div>
                                )}

                                {col.stage === 'script_signoff' && req.scriptOutline && (
                                  <div className="stage-micro-status">
                                    <span className={`micro-tag ${req.scriptOutline.status === 'submitted' ? 'warning' : 'success'}`}>
                                      Script: {req.scriptOutline.status === 'submitted' ? 'Awaiting Signoff' : 'Approved'}
                                    </span>
                                  </div>
                                )}

                                {col.stage === 'draft_review' && req.videoDraft && (
                                  <div className="stage-micro-status">
                                    <span className={`micro-tag ${req.videoDraft.status === 'submitted' ? 'cyan' : 'success'}`}>
                                      Video v{req.videoDraft.version}: {req.videoDraft.status === 'submitted' ? 'Ready for Review' : 'Approved'}
                                    </span>
                                  </div>
                                )}

                                {col.stage === 'live_completed' && req.publishedDeliverable && (
                                  <div className="stage-micro-status">
                                    <a
                                      href={req.publishedDeliverable.liveUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="micro-link"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <span>View Live Link</span>
                                      <ExternalLink size={10} />
                                    </a>
                                  </div>
                                )}

                                {/* Card Footer: Fast Action Button */}
                                <div className="deal-card-footer" onClick={(e) => e.stopPropagation()}>
                                  {/* Perspective-based primary button */}
                                  {col.stage === 'proposal' && (
                                    perspective === 'creator' ? (
                                      <button
                                        type="button"
                                        className="btn-card-action primary"
                                        onClick={() => handleCreatorAccept(req)}
                                      >
                                        Accept Brief
                                      </button>
                                    ) : req.counterOfferINR ? (
                                      <button
                                        type="button"
                                        className="btn-card-action primary"
                                        onClick={() => handleBrandAcceptCounterQuote(req)}
                                      >
                                        Accept Quote ({formatCurrency(req.counterOfferINR, currentCurrency)})
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        className="btn-card-action secondary"
                                        onClick={() => setSelectedRequest(req)}
                                      >
                                        View Brief
                                      </button>
                                    )
                                  )}

                                  {col.stage === 'escrow_funding' && (
                                    perspective === 'brand' ? (
                                      <button
                                        type="button"
                                        className="btn-card-action deposit"
                                        onClick={() => setActiveEscrowModalReq(req)}
                                      >
                                        <Lock size={12} />
                                        <span>Fund Escrow ({formatCurrency(req.budgetINR, currentCurrency)})</span>
                                      </button>
                                    ) : (
                                      <span className="card-note-waiting">Awaiting Brand Escrow</span>
                                    )
                                  )}

                                  {col.stage === 'script_signoff' && (
                                    perspective === 'creator' ? (
                                      <button
                                        type="button"
                                        className="btn-card-action primary"
                                        onClick={() => {
                                          setActiveScriptModalReq(req);
                                          setScriptHookInput(req.scriptOutline?.hook || '');
                                          setScriptPointsInput(req.scriptOutline?.talkingPoints.join('\n') || '');
                                        }}
                                      >
                                        <FileText size={12} />
                                        <span>{req.scriptOutline ? 'Edit Script' : 'Submit Script'}</span>
                                      </button>
                                    ) : req.scriptOutline && req.scriptOutline.status === 'submitted' ? (
                                      <button
                                        type="button"
                                        className="btn-card-action approve"
                                        onClick={() => handleBrandApproveScript(req)}
                                      >
                                        <Check size={12} />
                                        <span>Approve Script</span>
                                      </button>
                                    ) : (
                                      <span className="card-note-waiting">Creator Drafting Concept</span>
                                    )
                                  )}

                                  {col.stage === 'draft_review' && (
                                    perspective === 'creator' ? (
                                      <button
                                        type="button"
                                        className="btn-card-action primary"
                                        onClick={() => {
                                          setActiveDraftModalReq(req);
                                        }}
                                      >
                                        <Video size={12} />
                                        <span>Upload 4K Draft</span>
                                      </button>
                                    ) : req.videoDraft && req.videoDraft.status === 'submitted' ? (
                                      <button
                                        type="button"
                                        className="btn-card-action approve"
                                        onClick={() => handleBrandApproveDraft(req)}
                                      >
                                        <Check size={12} />
                                        <span>Approve Draft Cut</span>
                                      </button>
                                    ) : (
                                      <span className="card-note-waiting">Creator in Studio</span>
                                    )
                                  )}

                                  {col.stage === 'live_completed' && (
                                    req.status === 'completed' ? (
                                      <span className="card-note-completed">
                                        <Check size={12} /> Completed & Reviewed
                                      </span>
                                    ) : perspective === 'creator' ? (
                                      <button
                                        type="button"
                                        className="btn-card-action primary"
                                        onClick={() => setActiveLiveModalReq(req)}
                                      >
                                        Submit Live URL
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        className="btn-card-action release"
                                        onClick={() => setActiveReviewModalReq(req)}
                                      >
                                        <Star size={12} />
                                        <span>Release & Review</span>
                                      </button>
                                    )
                                  )}

                                  {/* Simulate next step button */}
                                  <button
                                    type="button"
                                    className="btn-card-sim"
                                    title="Fast-forward test simulation"
                                    onClick={() => handleFastForwardDemo(req)}
                                  >
                                    <Zap size={12} />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ========================================================= */}
            {/* VIEW 2: LIST / STACK VIEW                                 */}
            {/* ========================================================= */}
            {viewMode === 'list' && (
              <div className="list-pipeline-stack">
                {filteredRequests.length === 0 ? (
                  <div className="inbox-empty-state">
                    <Inbox size={42} className="empty-inbox-icon" />
                    <h3>No requests found in this view</h3>
                    <p>Try switching perspectives or clearing search filters to see all collaboration deals.</p>
                  </div>
                ) : (
                  filteredRequests.map((req) => {
                    const stage = getEffectiveStage(req);
                    return (
                      <div key={req.id} className={`list-deal-card card stage-${stage}`}>
                        {/* Header line */}
                        <div className="list-card-header">
                          <div className="header-left">
                            <div className="brand-ident-pill">
                              <Building2 size={16} />
                              <strong>{req.brandName}</strong>
                            </div>
                            <span className="ref-tag">{req.id}</span>
                            <span className="time-tag">{req.submittedAt}</span>
                          </div>

                          <div className="header-right">
                            {/* Escrow badge */}
                            {req.escrowStatus === 'held' && (
                              <span className="escrow-pill locked">
                                <Lock size={12} />
                                <span>Escrow: {formatCurrency(req.budgetINR, currentCurrency)} Locked</span>
                              </span>
                            )}
                            {req.escrowStatus === 'released' && (
                              <span className="escrow-pill released">
                                <Check size={12} />
                                <span>Escrow Released</span>
                              </span>
                            )}
                            <span className="stage-badge-pill">{stage.replace('_', ' ').toUpperCase()}</span>
                          </div>
                        </div>

                        {/* Stepper on every list item */}
                        <div className="list-stepper-row">
                          <div className={`step-node ${stage === 'proposal' ? 'current' : 'done'}`}>
                            <span className="dot">1</span>
                            <span className="lbl">Brief & Scope</span>
                          </div>
                          <div className="line"></div>
                          <div className={`step-node ${stage === 'escrow_funding' ? 'current' : stage !== 'proposal' ? 'done' : ''}`}>
                            <span className="dot">2</span>
                            <span className="lbl">Escrow Funding</span>
                          </div>
                          <div className="line"></div>
                          <div className={`step-node ${stage === 'script_signoff' ? 'current' : (stage === 'draft_review' || stage === 'live_completed') ? 'done' : ''}`}>
                            <span className="dot">3</span>
                            <span className="lbl">Script Signoff</span>
                          </div>
                          <div className="line"></div>
                          <div className={`step-node ${stage === 'draft_review' ? 'current' : stage === 'live_completed' ? 'done' : ''}`}>
                            <span className="dot">4</span>
                            <span className="lbl">4K Production</span>
                          </div>
                          <div className="line"></div>
                          <div className={`step-node ${stage === 'live_completed' ? (req.status === 'completed' ? 'done' : 'current') : ''}`}>
                            <span className="dot">5</span>
                            <span className="lbl">Live & Released</span>
                          </div>
                        </div>

                        {/* Meta Row */}
                        <div className="list-meta-grid">
                          <div>
                            <span className="meta-lbl">Creator:</span>
                            <strong>{req.creatorName} ({req.creatorHandle})</strong>
                          </div>
                          <div>
                            <span className="meta-lbl">Service:</span>
                            <strong>{req.serviceTitle}</strong>
                          </div>
                          <div>
                            <span className="meta-lbl">Budget:</span>
                            <strong className="text-emerald-600">{formatCurrency(req.budgetINR, currentCurrency)}</strong>
                          </div>
                          <div>
                            <span className="meta-lbl">Target Delivery:</span>
                            <span>{req.proposedDeadline}</span>
                          </div>
                        </div>

                        {/* Brief snippet */}
                        <p className="list-brief-snippet">
                          <strong>Campaign Objective:</strong> {req.campaignObjective}
                        </p>

                        {/* Action controls */}
                        <div className="list-actions-footer">
                          <button
                            type="button"
                            className="btn-details-drawer"
                            onClick={() => setSelectedRequest(req)}
                          >
                            <span>Open Deal Workspace & Audit Log</span>
                            <ArrowRight size={14} />
                          </button>

                          <div className="quick-actions-cluster">
                            <button
                              type="button"
                              className="btn-fast-sim"
                              onClick={() => handleFastForwardDemo(req)}
                              title="Simulate Next Step"
                            >
                              <Zap size={13} />
                              <span>Simulate Next Step</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </>
        )}

        {/* ========================================================= */}
        {/* DEAL DETAIL SLIDE-OVER DRAWER                             */}
        {/* ========================================================= */}
        {selectedRequest && (
          <div className="drawer-overlay" onClick={() => setSelectedRequest(null)}>
            <div className="drawer-container" onClick={(e) => e.stopPropagation()}>
              {/* Drawer Top Header */}
              <div className="drawer-header">
                <div>
                  <div className="drawer-ref-row">
                    <span className="drawer-ref-pill">{selectedRequest.id}</span>
                    <span className="drawer-status-pill">{selectedRequest.status.replace('_', ' ').toUpperCase()}</span>
                  </div>
                  <h3 className="drawer-title">{selectedRequest.serviceTitle}</h3>
                  <span className="drawer-parties">
                    Brand: <strong>{selectedRequest.brandName}</strong> • Creator: <strong>{selectedRequest.creatorName}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-close-drawer"
                  onClick={() => setSelectedRequest(null)}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Scrollable Body */}
              <div className="drawer-body">
                {/* Visual 5-Stage Stepper Banner */}
                <div className="drawer-stepper-box">
                  <h4>Collaboration Workflow Milestone Progress</h4>
                  <div className="drawer-stepper-nodes">
                    {kanbanStages.map((stg, sIdx) => {
                      const effStage = getEffectiveStage(selectedRequest);
                      const isCurrent = effStage === stg.stage;
                      const sIdxCurrent = kanbanStages.findIndex(s => s.stage === effStage);
                      const isCompleted = sIdx < sIdxCurrent || (selectedRequest.status === 'completed' && sIdx === 4);

                      return (
                        <div key={stg.stage} className={`drawer-step-item ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                          <div className="step-circle">
                            {isCompleted ? <Check size={12} /> : sIdx + 1}
                          </div>
                          <span className="step-label">{stg.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Escrow Vault Card */}
                <div className={`drawer-escrow-card ${selectedRequest.escrowStatus === 'held' ? 'locked' : selectedRequest.escrowStatus === 'released' ? 'released' : 'pending'}`}>
                  <div className="escrow-icon-circ">
                    <ShieldCheck size={22} />
                  </div>
                  <div className="escrow-info-col">
                    <div className="escrow-badge-line">
                      <strong>Creatorly Milestone Escrow Vault</strong>
                      <span className="vault-status-tag">
                        {selectedRequest.escrowStatus === 'held' ? 'Funds Protected in Vault' : selectedRequest.escrowStatus === 'released' ? 'Payout Disbursed' : 'Awaiting Brand Deposit'}
                      </span>
                    </div>
                    <p className="escrow-desc">
                      {selectedRequest.escrowStatus === 'held'
                        ? `₹${selectedRequest.budgetINR.toLocaleString('en-IN')} is locked in escrow. Payout will be disbursed only when ${selectedRequest.brandName} verifies live publication.`
                        : selectedRequest.escrowStatus === 'released'
                          ? `₹${selectedRequest.budgetINR.toLocaleString('en-IN')} was securely released to ${selectedRequest.creatorName}. Deal completed with zero chargeback risk.`
                          : `Terms agreed at ${formatCurrency(selectedRequest.budgetINR, currentCurrency)}. Brand must deposit funds into escrow before filming starts.`}
                    </p>
                  </div>
                </div>

                {/* Fast Action Control Center based on Perspective */}
                <div className="drawer-action-center card">
                  <div className="action-center-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Zap size={16} className="text-amber-500" />
                      <h4>Next Action (Acting as {perspective === 'creator' ? selectedRequest.creatorName : selectedRequest.brandName})</h4>
                    </div>
                    <button
                      type="button"
                      className="btn-switch-perspective-inline"
                      onClick={() => setPerspective(perspective === 'creator' ? 'brand' : 'creator')}
                    >
                      Switch to {perspective === 'creator' ? 'Brand Perspective' : 'Creator Perspective'}
                    </button>
                  </div>

                  {/* Contextual Action Buttons */}
                  <div className="action-center-buttons">
                    {/* STAGE 1: PROPOSAL */}
                    {getEffectiveStage(selectedRequest) === 'proposal' && (
                      perspective === 'creator' ? (
                        <>
                          <button
                            type="button"
                            className="btn-action primary"
                            onClick={() => handleCreatorAccept(selectedRequest)}
                          >
                            <Check size={14} />
                            <span>Accept Campaign Brief</span>
                          </button>
                          <button
                            type="button"
                            className="btn-action secondary"
                            onClick={() => {
                              setActiveCounterModalReq(selectedRequest);
                              setCounterBudgetInput(selectedRequest.budgetINR.toString());
                            }}
                          >
                            <DollarSign size={14} />
                            <span>Propose Custom Quote</span>
                          </button>
                          <button
                            type="button"
                            className="btn-action danger"
                            onClick={() => handleDecline(selectedRequest)}
                          >
                            <XCircle size={14} />
                            <span>Decline</span>
                          </button>
                        </>
                      ) : selectedRequest.counterOfferINR ? (
                        <button
                          type="button"
                          className="btn-action primary"
                          onClick={() => handleBrandAcceptCounterQuote(selectedRequest)}
                        >
                          <Check size={14} />
                          <span>Accept Creator's Revised Quote ({formatCurrency(selectedRequest.counterOfferINR, currentCurrency)})</span>
                        </button>
                      ) : (
                        <span className="center-waiting-note">
                          Awaiting {selectedRequest.creatorName} to accept or negotiate the brief.
                        </span>
                      )
                    )}

                    {/* STAGE 2: ESCROW FUNDING */}
                    {getEffectiveStage(selectedRequest) === 'escrow_funding' && (
                      perspective === 'brand' ? (
                        <button
                          type="button"
                          className="btn-action deposit-lg"
                          onClick={() => setActiveEscrowModalReq(selectedRequest)}
                        >
                          <Lock size={15} />
                          <span>Deposit ₹{selectedRequest.budgetINR.toLocaleString('en-IN')} into Escrow Vault</span>
                        </button>
                      ) : (
                        <span className="center-waiting-note">
                          Campaign accepted! Awaiting {selectedRequest.brandName} to fund the milestone escrow deposit.
                        </span>
                      )
                    )}

                    {/* STAGE 3: SCRIPT SIGNOFF */}
                    {getEffectiveStage(selectedRequest) === 'script_signoff' && (
                      perspective === 'creator' ? (
                        <button
                          type="button"
                          className="btn-action primary"
                          onClick={() => {
                            setActiveScriptModalReq(selectedRequest);
                            setScriptHookInput(selectedRequest.scriptOutline?.hook || '');
                            setScriptPointsInput(selectedRequest.scriptOutline?.talkingPoints.join('\n') || '');
                          }}
                        >
                          <FileText size={15} />
                          <span>{selectedRequest.scriptOutline ? 'Edit Script Outline' : 'Deliver Script Outline for Signoff'}</span>
                        </button>
                      ) : selectedRequest.scriptOutline && selectedRequest.scriptOutline.status === 'submitted' ? (
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            type="button"
                            className="btn-action primary"
                            onClick={() => handleBrandApproveScript(selectedRequest)}
                          >
                            <Check size={15} />
                            <span>Approve Script Outline</span>
                          </button>
                          <button
                            type="button"
                            className="btn-action secondary"
                            onClick={() => handleBrandRequestScriptChanges(selectedRequest)}
                          >
                            <span>Request Hook Revision</span>
                          </button>
                        </div>
                      ) : (
                        <span className="center-waiting-note">
                          {selectedRequest.creatorName} is preparing script concepts. You will be notified for signoff.
                        </span>
                      )
                    )}

                    {/* STAGE 4: PRODUCTION & DRAFT REVIEW */}
                    {getEffectiveStage(selectedRequest) === 'draft_review' && (
                      perspective === 'creator' ? (
                        <button
                          type="button"
                          className="btn-action primary"
                          onClick={() => setActiveDraftModalReq(selectedRequest)}
                        >
                          <Video size={15} />
                          <span>Upload 4K Video Draft (v{(selectedRequest.videoDraft?.version || 0) + 1})</span>
                        </button>
                      ) : selectedRequest.videoDraft && selectedRequest.videoDraft.status === 'submitted' ? (
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            type="button"
                            className="btn-action primary"
                            onClick={() => handleBrandApproveDraft(selectedRequest)}
                          >
                            <Check size={15} />
                            <span>Approve Video Draft</span>
                          </button>
                          <button
                            type="button"
                            className="btn-action secondary"
                            onClick={() => handleBrandRequestVideoRevision(selectedRequest)}
                          >
                            <span>Request Edit Revision</span>
                          </button>
                        </div>
                      ) : (
                        <span className="center-waiting-note">
                          {selectedRequest.creatorName} is filming in 4K. Unlisted review preview link will appear here.
                        </span>
                      )
                    )}

                    {/* STAGE 5: LIVE & ESCROW RELEASED */}
                    {getEffectiveStage(selectedRequest) === 'live_completed' && (
                      selectedRequest.status === 'completed' ? (
                        <div className="completed-success-banner">
                          <CheckCircle2 size={18} className="text-emerald-500" />
                          <span>Collaboration fulfilled & Escrow released! Verified review published on storefront profile.</span>
                        </div>
                      ) : perspective === 'creator' ? (
                        <button
                          type="button"
                          className="btn-action primary"
                          onClick={() => setActiveLiveModalReq(selectedRequest)}
                        >
                          <ExternalLink size={15} />
                          <span>Submit Published Live URL</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn-action release-lg"
                          onClick={() => setActiveReviewModalReq(selectedRequest)}
                        >
                          <Star size={15} />
                          <span>Release Escrow Payout & Write Verified Review</span>
                        </button>
                      )
                    )}

                    {/* Fast-Forward Simulation Helper */}
                    <button
                      type="button"
                      className="btn-action-sim"
                      onClick={() => handleFastForwardDemo(selectedRequest)}
                      title="Simulate advance to next stage"
                    >
                      <Zap size={14} />
                      <span>Simulate Step</span>
                    </button>
                  </div>
                </div>

                {/* Script Outline Details if exists */}
                {selectedRequest.scriptOutline && (
                  <div className="drawer-section card">
                    <div className="drawer-section-title">
                      <FileText size={16} />
                      <h5>Script Outline & Content Concept</h5>
                      <span className={`status-badge-mini ${selectedRequest.scriptOutline.status}`}>
                        {selectedRequest.scriptOutline.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="script-outline-details">
                      <div className="script-row">
                        <span className="lbl">Opening Hook (First 3 sec):</span>
                        <p className="hook-quote">"{selectedRequest.scriptOutline.hook}"</p>
                      </div>

                      <div className="script-row">
                        <span className="lbl">Key Talking Points:</span>
                        <ul className="points-list">
                          {selectedRequest.scriptOutline.talkingPoints.map((pt, pIdx) => (
                            <li key={pIdx}>
                              <Check size={12} className="text-emerald-600" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {selectedRequest.scriptOutline.callToAction && (
                        <div className="script-row">
                          <span className="lbl">Call to Action (CTA):</span>
                          <p className="cta-text">{selectedRequest.scriptOutline.callToAction}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4K Video Draft Player Preview if exists */}
                {selectedRequest.videoDraft && (
                  <div className="drawer-section card">
                    <div className="drawer-section-title">
                      <Video size={16} />
                      <h5>4K Video Draft (v{selectedRequest.videoDraft.version})</h5>
                      <span className={`status-badge-mini ${selectedRequest.videoDraft.status}`}>
                        {selectedRequest.videoDraft.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="video-draft-player-box">
                      <div className="mock-player-frame">
                        <div className="play-pulse-circle">
                          <Check size={24} className="text-emerald-400" />
                        </div>
                        <span className="player-meta-tag">4K 60FPS • PRORES MASTER</span>
                        <span className="player-link-text">{selectedRequest.videoDraft.draftUrl}</span>
                      </div>
                      <p className="draft-notes-text">
                        <strong>Creator Notes:</strong> {selectedRequest.videoDraft.revisionNotes || '4K vertical video rendered and color graded.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Live Published Deliverable if exists */}
                {selectedRequest.publishedDeliverable && (
                  <div className="drawer-section card live-deliverable-card">
                    <div className="drawer-section-title">
                      <ExternalLink size={16} />
                      <h5>Live Published Deliverable</h5>
                      <span className="status-badge-mini success">VERIFIED LIVE</span>
                    </div>
                    <div className="live-link-box">
                      <a href={selectedRequest.publishedDeliverable.liveUrl} target="_blank" rel="noreferrer" className="live-url-btn">
                        <span>{selectedRequest.publishedDeliverable.liveUrl}</span>
                        <ExternalLink size={14} />
                      </a>
                      {selectedRequest.publishedDeliverable.views && (
                        <span className="views-pill">
                          🔥 {selectedRequest.publishedDeliverable.views.toLocaleString()} verified views
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Verified Brand Review if completed */}
                {selectedRequest.brandReview && (
                  <div className="drawer-section card review-box-card">
                    <div className="drawer-section-title">
                      <Star size={16} className="text-amber-500" />
                      <h5>Verified Client Review (Public on Storefront)</h5>
                      <div style={{ display: 'flex', color: '#F59E0B' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < Math.round(selectedRequest.brandReview?.rating || 5) ? "#F59E0B" : "none"}
                            color="#F59E0B"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="review-quote-text">"{selectedRequest.brandReview.reviewText}"</p>
                    <span className="review-author-line">
                      — {selectedRequest.brandContactPerson}, {selectedRequest.brandName} • Published {selectedRequest.brandReview.submittedAt}
                    </span>
                  </div>
                )}

                {/* Campaign Brief Details */}
                <div className="drawer-section card">
                  <div className="drawer-section-title">
                    <Building2 size={16} />
                    <h5>Campaign Brief & Deliverable Scope</h5>
                  </div>

                  <div className="drawer-brief-details">
                    <div className="brief-field">
                      <span className="lbl">Campaign Objective:</span>
                      <p>{selectedRequest.campaignObjective}</p>
                    </div>

                    <div className="brief-field">
                      <span className="lbl">Brief Requirements:</span>
                      <p className="brief-full-text">{selectedRequest.campaignBrief}</p>
                    </div>

                    <div className="brief-field">
                      <span className="lbl">Expected Deliverables:</span>
                      <ul className="deliverables-checklist">
                        {selectedRequest.deliverables.map((d, dIdx) => (
                          <li key={dIdx}>
                            <Check size={13} className="text-emerald-500" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="brief-field">
                      <span className="lbl">Brand Contact Person:</span>
                      <p>{selectedRequest.brandContactPerson} ({selectedRequest.brandEmail})</p>
                    </div>
                  </div>
                </div>

                {/* Real-Time Chronological Activity History / Audit Trail */}
                <div className="drawer-section card">
                  <div className="drawer-section-title">
                    <Clock size={16} />
                    <h5>Milestone Activity History & Audit Trail</h5>
                  </div>

                  <div className="timeline-events-list">
                    {(selectedRequest.timelineEvents || []).map((ev) => (
                      <div key={ev.id} className={`timeline-event-item actor-${ev.actor}`}>
                        <div className="event-actor-badge">
                          {ev.actor === 'brand' ? <Building2 size={12} /> : ev.actor === 'creator' ? <User size={12} /> : <Zap size={12} />}
                        </div>
                        <div className="event-content">
                          <div className="event-title-row">
                            <strong>{ev.action}</strong>
                            <span className="event-time">{ev.timestamp}</span>
                          </div>
                          {ev.details && <p className="event-details">{ev.details}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL 1: PROPOSE CUSTOM COUNTER-QUOTE                     */}
        {/* ========================================================= */}
        {activeCounterModalReq && (
          <div className="modal-overlay" onClick={() => setActiveCounterModalReq(null)}>
            <div className="modal-content modal-quote" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Propose Custom Quote / Scope Adjustment</h3>
                <button type="button" className="close-btn" onClick={() => setActiveCounterModalReq(null)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSendCounterQuote} className="modal-form-body">
                <p className="form-sub-desc">
                  Negotiate terms directly with <strong>{activeCounterModalReq.brandName}</strong>. Adjust your fee or explain any changes to turnaround and deliverables.
                </p>

                <div className="form-group">
                  <label>Original Brand Budget:</label>
                  <div className="readonly-budget-box">
                    {formatCurrency(activeCounterModalReq.budgetINR, currentCurrency)}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="counter-budget">Your Proposed Budget (INR):</label>
                  <input
                    id="counter-budget"
                    type="number"
                    value={counterBudgetInput}
                    onChange={(e) => setCounterBudgetInput(e.target.value)}
                    required
                    min={1000}
                    className="form-input"
                  />
                  <span className="form-hint">
                    Current equivalent: {formatCurrency(Number(counterBudgetInput) || 0, currentCurrency)}
                  </span>
                </div>

                <div className="form-group">
                  <label htmlFor="counter-notes">Explanation of Revised Scope or Turnaround:</label>
                  <textarea
                    id="counter-notes"
                    rows={4}
                    value={counterNotesInput}
                    onChange={(e) => setCounterNotesInput(e.target.value)}
                    required
                    className="form-textarea"
                    placeholder="e.g. Can deliver in 48 hours and include 2 extra hook variations for this adjusted fee..."
                  />
                </div>

                <div className="modal-actions-row">
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveCounterModalReq(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Send size={14} />
                    <span>Send Revised Quote</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL 2: ESCROW VAULT DEPOSIT (BRAND)                    */}
        {/* ========================================================= */}
        {activeEscrowModalReq && (
          <div className="modal-overlay" onClick={() => setActiveEscrowModalReq(null)}>
            <div className="modal-content modal-escrow" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={20} className="text-emerald-500" />
                  <h3>Deposit Funds to Creatorly Escrow Vault</h3>
                </div>
                <button type="button" className="close-btn" onClick={() => setActiveEscrowModalReq(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="modal-form-body">
                <p className="form-sub-desc">
                  Deposit agreed campaign funds safely into escrow for <strong>{activeEscrowModalReq.creatorName}</strong> ({activeEscrowModalReq.serviceTitle}).
                </p>

                <div className="escrow-deposit-highlight card">
                  <div className="highlight-row">
                    <span>Campaign Value:</span>
                    <strong className="text-xl font-bold">{formatCurrency(activeEscrowModalReq.budgetINR, currentCurrency)}</strong>
                  </div>
                  <div className="highlight-row">
                    <span>Vault Escrow Fee (0% Creatorly Demo):</span>
                    <span>₹0</span>
                  </div>
                  <div className="highlight-divider"></div>
                  <div className="highlight-row total">
                    <span>Total Deposit Required:</span>
                    <strong className="text-emerald-600">{formatCurrency(activeEscrowModalReq.budgetINR, currentCurrency)}</strong>
                  </div>
                </div>

                <div className="escrow-milestone-guarantee-box">
                  <Lock size={16} className="text-emerald-500" />
                  <div>
                    <strong>Milestone Escrow Guarantee:</strong>
                    <p>Funds remain 100% protected in the vault and are disbursed only after you verify the final video post. Zero risk of unfinished work or ghosting.</p>
                  </div>
                </div>

                <div className="modal-actions-row">
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveEscrowModalReq(null)}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ background: '#059669', borderColor: '#059669' }}
                    onClick={() => handleDepositEscrow(activeEscrowModalReq)}
                  >
                    <Lock size={14} />
                    <span>Confirm & Lock Escrow Deposit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL 3: SCRIPT OUTLINE (CREATOR)                        */}
        {/* ========================================================= */}
        {activeScriptModalReq && (
          <div className="modal-overlay" onClick={() => setActiveScriptModalReq(null)}>
            <div className="modal-content modal-script" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Submit Script Outline for Signoff</h3>
                <button type="button" className="close-btn" onClick={() => setActiveScriptModalReq(null)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmitScriptOutline} className="modal-form-body">
                <p className="form-sub-desc">
                  Deliver your content concepts and hook strategy to <strong>{activeScriptModalReq.brandName}</strong> before filming begins.
                </p>

                <div className="form-group">
                  <label htmlFor="script-hook">Opening Hook (First 3 Seconds) *</label>
                  <input
                    id="script-hook"
                    type="text"
                    required
                    placeholder="e.g. Stop scrolling: here is why this product changed our workflow."
                    value={scriptHookInput}
                    onChange={(e) => setScriptHookInput(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="script-points">Key Talking Points (One per line) *</label>
                  <textarea
                    id="script-points"
                    rows={4}
                    required
                    placeholder="1. Real-world before and after demonstration&#10;2. Clear breakdown of 3 top features&#10;3. Pricing and launch coupon callout"
                    value={scriptPointsInput}
                    onChange={(e) => setScriptPointsInput(e.target.value)}
                    className="form-textarea"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="script-cta">Call to Action (CTA) *</label>
                  <input
                    id="script-cta"
                    type="text"
                    required
                    placeholder="e.g. Tap link in bio to claim 20% off launch discount."
                    value={scriptCtaInput}
                    onChange={(e) => setScriptCtaInput(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="modal-actions-row">
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveScriptModalReq(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <FileText size={14} />
                    <span>Submit Script for Signoff</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL 4: UPLOAD 4K VIDEO DRAFT (CREATOR)                 */}
        {/* ========================================================= */}
        {activeDraftModalReq && (
          <div className="modal-overlay" onClick={() => setActiveDraftModalReq(null)}>
            <div className="modal-content modal-draft" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Deliver 4K Video Draft for Review</h3>
                <button type="button" className="close-btn" onClick={() => setActiveDraftModalReq(null)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmitVideoDraft} className="modal-form-body">
                <p className="form-sub-desc">
                  Provide an unlisted video review link (Vimeo, YouTube Unlisted, Frame.io) for <strong>{activeDraftModalReq.brandName}</strong>.
                </p>

                <div className="form-group">
                  <label htmlFor="draft-url">Unlisted Video Review URL *</label>
                  <input
                    id="draft-url"
                    type="url"
                    required
                    value={draftUrlInput}
                    onChange={(e) => setDraftUrlInput(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="draft-notes">Editor Notes / Change Summary</label>
                  <textarea
                    id="draft-notes"
                    rows={3}
                    value={draftNotesInput}
                    onChange={(e) => setDraftNotesInput(e.target.value)}
                    className="form-textarea"
                    placeholder="e.g. Mastered in 4K 60fps. Color graded with true brand color accuracy."
                  />
                </div>

                <div className="modal-actions-row">
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveDraftModalReq(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Video size={14} />
                    <span>Transmit Video Draft</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL 5: SUBMIT LIVE URL (CREATOR)                       */}
        {/* ========================================================= */}
        {activeLiveModalReq && (
          <div className="modal-overlay" onClick={() => setActiveLiveModalReq(null)}>
            <div className="modal-content modal-live" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Submit Live Publication Link</h3>
                <button type="button" className="close-btn" onClick={() => setActiveLiveModalReq(null)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmitLiveUrl} className="modal-form-body">
                <p className="form-sub-desc">
                  Enter the live URL where the deliverable has been published.
                </p>

                <div className="form-group">
                  <label htmlFor="live-url">Live Post URL (Instagram / YouTube) *</label>
                  <input
                    id="live-url"
                    type="url"
                    required
                    value={liveUrlInput}
                    onChange={(e) => setLiveUrlInput(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="modal-actions-row">
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveLiveModalReq(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Check size={14} />
                    <span>Confirm Live Publication</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL 6: RELEASE ESCROW & WRITE VERIFIED REVIEW (BRAND)   */}
        {/* ========================================================= */}
        {activeReviewModalReq && (
          <div className="modal-overlay" onClick={() => setActiveReviewModalReq(null)}>
            <div className="modal-content modal-review" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={20} className="text-amber-500" />
                  <h3>Release Escrow & Leave Verified Review</h3>
                </div>
                <button type="button" className="close-btn" onClick={() => setActiveReviewModalReq(null)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleReleaseEscrowAndReview} className="modal-form-body">
                <p className="form-sub-desc">
                  Releasing escrow authorizes payout of <strong>{formatCurrency(activeReviewModalReq.budgetINR, currentCurrency)}</strong> to <strong>{activeReviewModalReq.creatorName}</strong> and posts a Verified Deal review on their public profile.
                </p>

                {/* Rating Stars */}
                <div className="form-group text-center">
                  <label>Overall Experience Rating:</label>
                  <div className="stars-picker-row">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        key={starVal}
                        type="button"
                        className={`star-pick-btn ${reviewRating >= starVal ? 'filled' : ''}`}
                        onClick={() => setReviewRating(starVal)}
                      >
                        <Star size={28} fill={reviewRating >= starVal ? '#F59E0B' : 'none'} color="#F59E0B" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="review-feedback">Feedback & Results for Storefront *</label>
                  <textarea
                    id="review-feedback"
                    rows={4}
                    required
                    placeholder="Share how the collaboration performed (e.g. conversions, video quality, audience feedback)..."
                    value={reviewTextInput}
                    onChange={(e) => setReviewTextInput(e.target.value)}
                    className="form-textarea"
                  />
                </div>

                <div className="release-notice-box">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span>
                    Escrow funds will be immediately deposited into {activeReviewModalReq.creatorName}'s verified bank account.
                  </span>
                </div>

                <div className="modal-actions-row">
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveReviewModalReq(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ background: '#059669', borderColor: '#059669' }}>
                    <Sparkles size={14} />
                    <span>Disburse Payout & Publish Review</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .inbox-section {
          padding: 32px 0 80px 0;
          background-color: #F8FAFC;
          min-height: 85vh;
          font-family: inherit;
        }

        .inbox-container {
          max-width: 1360px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Top Role & View Switcher Bar */
        .pipeline-top-nav-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 12px 18px;
          margin-bottom: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
        }

        .nav-role-switcher {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .role-switcher-label {
          font-size: 12px;
          font-weight: 700;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-right: 4px;
        }

        .role-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 9999px;
          font-size: 12.5px;
          font-weight: 700;
          border: 1px solid #E2E8F0;
          background: #F8FAFC;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .role-tab-btn:hover {
          background: #F1F5F9;
          color: #0F172A;
        }

        .role-tab-btn.active {
          background: #0F172A;
          border-color: #0F172A;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
        }

        .main-view-switcher {
          display: flex;
          gap: 6px;
          background: #F1F5F9;
          padding: 4px;
          border-radius: 12px;
        }

        .main-tab-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 700;
          border: none;
          background: transparent;
          color: #64748B;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .main-tab-pill:hover {
          color: #0F172A;
        }

        .main-tab-pill.active {
          background: #FFFFFF;
          color: #0F172A;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        /* Title Card */
        .pipeline-title-card {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 18px;
          padding: 24px 28px;
          margin-bottom: 24px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
        }

        .pipeline-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #059669;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10B981;
        }

        .pipeline-title {
          font-size: 26px;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -0.02em;
          margin: 0 0 6px 0;
        }

        .pipeline-subtitle {
          font-size: 14px;
          color: #64748B;
          margin: 0;
          max-width: 680px;
          line-height: 1.5;
        }

        .pipeline-header-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .filter-pill-dropdown {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 6px 12px;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
        }

        .filter-pill-dropdown select {
          border: none;
          background: transparent;
          font-size: 13px;
          font-weight: 700;
          color: #0F172A;
          outline: none;
          cursor: pointer;
        }

        .view-mode-toggle {
          display: flex;
          background: #F1F5F9;
          border-radius: 12px;
          padding: 3px;
          gap: 3px;
        }

        .toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 9px;
          border: none;
          background: transparent;
          font-size: 12.5px;
          font-weight: 600;
          color: #64748B;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .toggle-btn.active {
          background: #FFFFFF;
          color: #0F172A;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        /* Offers Summary Grid (5 Easy Cards) */
        .offers-summary-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
          margin-bottom: 24px;
        }

        @media (max-width: 1100px) {
          .offers-summary-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .offers-summary-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .summary-stat-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 16px 18px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
          position: relative;
        }

        .summary-stat-card:hover {
          transform: translateY(-3px);
          border-color: #FF5B38;
          box-shadow: 0 10px 24px rgba(255, 91, 56, 0.14);
        }

        .summary-stat-card.selected {
          border-color: #FF5B38;
          background: #FFFBF9;
          box-shadow: 0 0 0 2px rgba(255, 91, 56, 0.25), 0 8px 20px rgba(255, 91, 56, 0.12);
        }

        .summary-stat-card.card-value {
          cursor: default;
        }

        .summary-stat-card.card-value:hover {
          border-color: #10B981;
          box-shadow: 0 10px 24px rgba(16, 185, 129, 0.12);
        }

        .stat-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .stat-icon-circ {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .stat-icon-circ.blue { background: #EFF6FF; }
        .stat-icon-circ.amber { background: #FFFBEB; }
        .stat-icon-circ.purple { background: #F5F3FF; }
        .stat-icon-circ.green { background: #ECFDF5; }
        .stat-icon-circ.emerald { background: #ECFDF5; }

        .stat-number {
          font-size: 24px;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -0.02em;
        }

        .stat-number-currency {
          font-size: 17px;
          font-weight: 800;
          color: #059669;
          letter-spacing: -0.01em;
        }

        .stat-label {
          display: block;
          font-size: 13.5px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 3px;
        }

        .stat-desc {
          display: block;
          font-size: 11.5px;
          color: #64748B;
          line-height: 1.4;
        }

        /* Active Filter Alert Bar */
        .active-filter-alert-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #FFF7ED;
          border: 1px solid #FFEDD5;
          padding: 10px 18px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-size: 13px;
          color: #9A3412;
        }

        .btn-clear-status-filter {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 8px;
          border: 1px solid #FED7AA;
          background: #FFFFFF;
          font-size: 12px;
          font-weight: 700;
          color: #C2410C;
          cursor: pointer;
        }

        /* Seeker Creator Showcase */
        .seeker-creators-showcase {
          margin-bottom: 40px;
        }

        .creator-category-scroll-rail {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }

        .category-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 9999px;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .category-pill-btn:hover {
          background: #F8FAFC;
          border-color: #CBD5E1;
          color: #0F172A;
        }

        .category-pill-btn.active {
          background: #FF5B38;
          border-color: #FF5B38;
          color: #FFFFFF;
          font-weight: 700;
          box-shadow: 0 4px 14px rgba(255, 91, 56, 0.25);
        }

        .creator-directory-search-bar {
          position: relative;
          margin-bottom: 24px;
        }

        .creator-directory-search-bar input {
          width: 100%;
          padding: 12px 40px 12px 42px;
          border-radius: 14px;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          font-size: 14px;
          color: #0F172A;
          outline: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
        }

        .creator-directory-search-bar .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94A3B8;
        }

        .seeker-creators-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .creators-empty-box {
          grid-column: 1 / -1;
          background: #FFFFFF;
          border: 1px dashed #CBD5E1;
          border-radius: 16px;
          padding: 40px 20px;
          text-align: center;
          color: #64748B;
        }

        .creator-directory-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 18px;
          padding: 20px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
        }

        .creator-directory-card:hover {
          transform: translateY(-4px);
          border-color: #FF5B38;
          box-shadow: 0 14px 30px rgba(255, 91, 56, 0.16), 0 2px 6px rgba(0, 0, 0, 0.04);
        }

        .creator-card-header {
          display: flex;
          gap: 14px;
          align-items: center;
          margin-bottom: 12px;
        }

        .creator-avatar-wrap {
          position: relative;
          width: 52px;
          height: 52px;
          flex-shrink: 0;
        }

        .creator-card-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #E2E8F0;
        }

        .creator-verified-check {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #10B981;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 900;
          border: 2px solid #FFFFFF;
        }

        .creator-header-info {
          flex: 1;
          min-width: 0;
        }

        .creator-name-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .creator-name-heading {
          font-size: 16px;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
        }

        .creator-handle-badge {
          font-size: 11.5px;
          font-weight: 600;
          color: #64748B;
          background: #F1F5F9;
          padding: 2px 7px;
          border-radius: 6px;
        }

        .creator-location-text {
          font-size: 12px;
          color: #64748B;
          margin-top: 2px;
          display: block;
        }

        .creator-niche-pill-wrap {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }

        .creator-niche-pill {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 9999px;
          background: #EFF6FF;
          color: #1D4ED8;
          border: 1px solid #BFDBFE;
        }

        .creator-subniche-pill {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 9999px;
          background: #F8FAFC;
          color: #64748B;
          border: 1px solid #E2E8F0;
        }

        .creator-bio-snippet {
          font-size: 13px;
          color: #475569;
          line-height: 1.5;
          margin: 0 0 14px 0;
          flex: 1;
        }

        .creator-simple-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          background: #F8FAFC;
          border: 1px solid #F1F5F9;
          border-radius: 12px;
          padding: 10px;
          margin-bottom: 16px;
          text-align: center;
        }

        .simple-metric-col .metric-val {
          display: block;
          font-size: 15px;
          font-weight: 800;
          color: #0F172A;
        }

        .simple-metric-col .metric-lbl {
          font-size: 10.5px;
          font-weight: 600;
          color: #64748B;
          text-transform: uppercase;
        }

        .creator-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid #F1F5F9;
        }

        .creator-price-tag .price-prefix {
          font-size: 11px;
          color: #94A3B8;
          display: block;
        }

        .creator-price-tag strong {
          font-size: 16px;
          font-weight: 800;
          color: #0F172A;
        }

        .creator-card-btns {
          display: flex;
          gap: 8px;
        }

        .btn-hire-creator {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 10px;
          background: #FF5B38;
          color: #FFFFFF;
          border: none;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-hire-creator:hover {
          background: #E04826;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255, 91, 56, 0.25);
        }

        .btn-view-creator-profile {
          padding: 8px 12px;
          border-radius: 10px;
          background: #F1F5F9;
          color: #334155;
          border: 1px solid #E2E8F0;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-view-creator-profile:hover {
          background: #E2E8F0;
          color: #0F172A;
        }

        /* Filter Toolbar */
        .pipeline-filter-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 24px;
        }

        .pipeline-search-box {
          position: relative;
          min-width: 300px;
          flex: 1;
          max-width: 480px;
        }

        .pipeline-search-box input {
          width: 100%;
          padding: 10px 36px 10px 38px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          font-size: 13.5px;
          color: #0F172A;
          outline: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
        }

        .pipeline-search-box .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94A3B8;
        }

        .clear-search-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          color: #94A3B8;
          cursor: pointer;
        }

        .pipeline-stage-tabs {
          display: flex;
          gap: 8px;
          overflow-x: auto;
        }

        .stage-tab {
          padding: 7px 14px;
          border-radius: 9999px;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          font-size: 12.5px;
          font-weight: 600;
          color: #64748B;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .stage-tab.active {
          background: #059669;
          border-color: #059669;
          color: #FFFFFF;
          font-weight: 700;
        }

        /* ========================================================= */
        /* KANBAN BOARD STYLES                                       */
        /* ========================================================= */
        .kanban-pipeline-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          overflow-x: auto;
          padding-bottom: 24px;
        }

        @media (max-width: 1200px) {
          .kanban-pipeline-grid {
            grid-template-columns: repeat(5, minmax(280px, 1fr));
          }
        }

        .kanban-stage-col {
          background: #F1F5F9;
          border-radius: 18px;
          border: 1px solid #E2E8F0;
          display: flex;
          flex-direction: column;
          min-height: 520px;
          overflow: hidden;
        }

        .kanban-col-header {
          padding: 14px 16px;
          background: #FFFFFF;
          border-bottom: 1px solid #E2E8F0;
        }

        .col-header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .col-title-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .col-title-wrap h4 {
          font-size: 13.5px;
          font-weight: 800;
          margin: 0;
          color: #0F172A;
          letter-spacing: -0.01em;
        }

        .col-count-pill {
          font-size: 11px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 9999px;
          background: #F1F5F9;
          color: #475569;
        }

        .col-header-sub {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11.5px;
          color: #64748B;
        }

        .col-budget-val {
          font-weight: 700;
          color: #0F172A;
        }

        .kanban-cards-stack {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }

        .kanban-empty-drop {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 120px;
          border: 2px dashed #CBD5E1;
          border-radius: 12px;
          color: #94A3B8;
          font-size: 12px;
          font-weight: 600;
        }

        /* Kanban Deal Card with Orange Glowing Hover */
        .kanban-deal-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
          position: relative;
        }

        .kanban-deal-card:hover {
          transform: translateY(-3px);
          border-color: #FF5B38;
          box-shadow: 0 12px 28px rgba(255, 91, 56, 0.16), 0 2px 6px rgba(0, 0, 0, 0.04);
        }

        .kanban-deal-card.selected {
          border-color: #FF5B38;
          box-shadow: 0 0 0 2px rgba(255, 91, 56, 0.25), 0 8px 20px rgba(15, 23, 42, 0.08);
        }

        .deal-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .deal-ref-id {
          font-size: 11px;
          font-weight: 800;
          color: #64748B;
          background: #F8FAFC;
          padding: 2px 6px;
          border-radius: 6px;
          border: 1px solid #E2E8F0;
        }

        .escrow-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 6px;
        }

        .escrow-status-pill.locked {
          background: #FEF3C7;
          color: #92400E;
          border: 1px solid #FDE68A;
        }

        .escrow-status-pill.released {
          background: #ECFDF5;
          color: #065F46;
          border: 1px solid #A7F3D0;
        }

        .escrow-status-pill.pending {
          background: #F1F5F9;
          color: #64748B;
        }

        .deal-ident-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
          margin-bottom: 10px;
        }

        .deal-brand-label {
          font-size: 11px;
          color: #94A3B8;
        }

        .deal-brand-name {
          font-size: 13px;
          color: #0F172A;
          display: block;
        }

        .deal-creator-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          padding: 3px 8px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 600;
          color: #334155;
        }

        .creator-mini-avatar {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          object-fit: cover;
        }

        .deal-service-box {
          background: #F8FAFC;
          border-radius: 8px;
          padding: 8px 10px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid #F1F5F9;
        }

        .service-title {
          font-size: 12px;
          color: #334155;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 140px;
        }

        .service-price {
          font-size: 13px;
          font-weight: 800;
          color: #059669;
        }

        .stage-micro-status {
          margin-bottom: 10px;
        }

        .micro-tag {
          display: inline-block;
          font-size: 10.5px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 6px;
          background: #F1F5F9;
          color: #475569;
        }

        .micro-tag.alert {
          background: #FEF2F2;
          color: #DC2626;
          border: 1px solid #FEE2E2;
        }

        .micro-tag.warning {
          background: #FEF3C7;
          color: #D97706;
          border: 1px solid #FDE68A;
        }

        .micro-tag.cyan {
          background: #ECFEFF;
          color: #0891B2;
          border: 1px solid #CFFAFE;
        }

        .micro-tag.success {
          background: #ECFDF5;
          color: #059669;
          border: 1px solid #A7F3D0;
        }

        .micro-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 700;
          color: #059669;
          text-decoration: underline;
        }

        .deal-card-footer {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn-card-action {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 7px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.15s ease;
        }

        .btn-card-action.primary {
          background: #0F172A;
          color: #FFFFFF;
        }

        .btn-card-action.primary:hover {
          background: #1E293B;
        }

        .btn-card-action.secondary {
          background: #F1F5F9;
          color: #475569;
          border-color: #E2E8F0;
        }

        .btn-card-action.secondary:hover {
          background: #E2E8F0;
          color: #0F172A;
        }

        .btn-card-action.deposit {
          background: #D97706;
          color: #FFFFFF;
        }

        .btn-card-action.deposit:hover {
          background: #B45309;
        }

        .btn-card-action.approve {
          background: #059669;
          color: #FFFFFF;
        }

        .btn-card-action.approve:hover {
          background: #047857;
        }

        .btn-card-action.release {
          background: #059669;
          color: #FFFFFF;
        }

        .btn-card-action.release:hover {
          background: #047857;
        }

        .card-note-waiting {
          font-size: 11px;
          font-weight: 600;
          color: #94A3B8;
          font-style: italic;
          flex: 1;
        }

        .card-note-completed {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 700;
          color: #059669;
          flex: 1;
        }

        .btn-card-sim {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          border: 1px solid #E2E8F0;
          background: #F8FAFC;
          color: #D97706;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-card-sim:hover {
          background: #FEF3C7;
          border-color: #FDE68A;
        }

        /* List View Stack */
        .list-pipeline-stack {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .list-deal-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
          transition: all 0.2s ease;
        }

        .list-deal-card:hover {
          transform: translateY(-2px);
          border-color: #FF5B38;
          box-shadow: 0 10px 24px rgba(255, 91, 56, 0.14);
        }

        .list-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .brand-ident-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #0F172A;
        }

        .ref-tag {
          font-size: 11px;
          font-weight: 700;
          color: #64748B;
          background: #F1F5F9;
          padding: 2px 6px;
          border-radius: 6px;
        }

        .list-card-body {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .list-service-name {
          font-size: 16px;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 6px 0;
        }

        .creator-avatar-bubble {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #475569;
        }

        .bubble-img {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          object-fit: cover;
        }

        .meta-lbl {
          font-size: 11px;
          color: #94A3B8;
          display: block;
        }

        .list-brief-snippet {
          font-size: 13px;
          color: #475569;
          line-height: 1.5;
          margin: 0 0 16px 0;
          background: #F8FAFC;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid #F1F5F9;
        }

        .list-actions-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .btn-details-drawer {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 10px;
          background: #0F172A;
          color: #FFFFFF;
          border: none;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-fast-sim {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 10px;
          background: #FFFBEB;
          border: 1px solid #FDE68A;
          color: #B45309;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
        }

        /* Detail Slide-Over Drawer */
        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
        }

        .drawer-container {
          width: 100%;
          max-width: 620px;
          background: #FFFFFF;
          height: 100%;
          overflow-y: auto;
          box-shadow: -8px 0 32px rgba(15, 23, 42, 0.15);
          display: flex;
          flex-direction: column;
        }

        .drawer-header {
          padding: 24px 28px;
          border-bottom: 1px solid #E2E8F0;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          background: #F8FAFC;
        }

        .drawer-ref-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .drawer-ref-pill {
          font-size: 11px;
          font-weight: 800;
          color: #64748B;
          background: #FFFFFF;
          padding: 2px 7px;
          border-radius: 6px;
          border: 1px solid #E2E8F0;
        }

        .drawer-status-pill {
          font-size: 11px;
          font-weight: 800;
          color: #059669;
          background: #ECFDF5;
          padding: 2px 7px;
          border-radius: 6px;
        }

        .drawer-title {
          font-size: 20px;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 6px 0;
        }

        .drawer-parties {
          font-size: 12.5px;
          color: #64748B;
        }

        .btn-close-drawer {
          border: none;
          background: transparent;
          color: #94A3B8;
          cursor: pointer;
          padding: 4px;
          border-radius: 8px;
        }

        .btn-close-drawer:hover {
          color: #0F172A;
          background: #E2E8F0;
        }

        .drawer-body {
          padding: 24px 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          flex: 1;
        }

        .drawer-stepper-box {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          padding: 16px;
        }

        .drawer-stepper-box h4 {
          font-size: 13px;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 12px 0;
        }

        .drawer-stepper-nodes {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
        }

        .drawer-step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          position: relative;
          z-index: 1;
          flex: 1;
          text-align: center;
        }

        .step-circle {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 2px solid #CBD5E1;
          color: #64748B;
          font-size: 11px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .drawer-step-item.active .step-circle {
          border-color: #FF5B38;
          color: #FF5B38;
          background: #FFF7ED;
        }

        .drawer-step-item.completed .step-circle {
          border-color: #10B981;
          background: #10B981;
          color: #FFFFFF;
        }

        .step-label {
          font-size: 10px;
          font-weight: 700;
          color: #64748B;
        }

        .drawer-step-item.active .step-label {
          color: #0F172A;
          font-weight: 800;
        }

        .drawer-escrow-card {
          display: flex;
          gap: 14px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          padding: 16px;
        }

        .drawer-escrow-card.locked {
          background: #FEF3C7;
          border-color: #FDE68A;
        }

        .drawer-escrow-card.released {
          background: #ECFDF5;
          border-color: #A7F3D0;
        }

        .escrow-icon-circ {
          color: #059669;
        }

        .drawer-escrow-card.locked .escrow-icon-circ {
          color: #D97706;
        }

        .escrow-badge-line {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .escrow-badge-line strong {
          font-size: 13.5px;
          color: #0F172A;
        }

        .vault-status-tag {
          font-size: 10.5px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          background: #FFFFFF;
          color: #475569;
        }

        .escrow-desc {
          font-size: 12.5px;
          color: #475569;
          line-height: 1.5;
          margin: 0;
        }

        .drawer-action-center {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          padding: 18px;
        }

        .action-center-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .action-center-header h4 {
          font-size: 13.5px;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
        }

        .btn-switch-perspective-inline {
          font-size: 11.5px;
          font-weight: 700;
          color: #059669;
          background: #FFFFFF;
          border: 1px solid #A7F3D0;
          padding: 4px 10px;
          border-radius: 6px;
          cursor: pointer;
        }

        .action-center-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn-action {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          border: 1px solid transparent;
        }

        .btn-action.primary {
          background: #0F172A;
          color: #FFFFFF;
        }

        .btn-action.secondary {
          background: #FFFFFF;
          border-color: #CBD5E1;
          color: #334155;
        }

        .btn-action.deposit {
          background: #D97706;
          color: #FFFFFF;
        }

        .btn-action.approve {
          background: #059669;
          color: #FFFFFF;
        }

        .btn-action.release {
          background: #059669;
          color: #FFFFFF;
        }

        .action-notice {
          font-size: 12.5px;
          color: #64748B;
          font-style: italic;
        }

        .drawer-section-block {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          padding: 18px;
        }

        .drawer-section-block h4 {
          font-size: 13.5px;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 12px 0;
        }

        .deliverables-checklist {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .deliverables-checklist li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #334155;
        }

        .deliverables-checklist li svg {
          color: #10B981;
          flex-shrink: 0;
        }

        .timeline-audit-log {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .timeline-event-item {
          display: flex;
          gap: 12px;
          position: relative;
        }

        .timeline-event-item:not(:last-child)::before {
          content: '';
          position: absolute;
          left: 5px;
          top: 18px;
          bottom: -10px;
          width: 2px;
          background: #E2E8F0;
        }

        .timeline-bullet {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #CBD5E1;
          margin-top: 4px;
          flex-shrink: 0;
        }

        .timeline-event-item.actor-creator .timeline-bullet {
          background: #3B82F6;
        }

        .timeline-event-item.actor-brand .timeline-bullet {
          background: #10B981;
        }

        .timeline-event-content {
          flex: 1;
        }

        .event-action-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2px;
        }

        .event-action-line strong {
          font-size: 12.5px;
          color: #0F172A;
        }

        .event-time {
          font-size: 11px;
          color: #94A3B8;
        }

        .event-details-text {
          font-size: 12px;
          color: #64748B;
          margin: 0;
          line-height: 1.4;
        }

        /* Modals Light Theme */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(4px);
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-content {
          background: #FFFFFF;
          border-radius: 18px;
          width: 100%;
          max-width: 520px;
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2);
          overflow: hidden;
          border: 1px solid #E2E8F0;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #E2E8F0;
          background: #F8FAFC;
        }

        .modal-header h3 {
          font-size: 17px;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
        }

        .close-btn {
          border: none;
          background: transparent;
          color: #94A3B8;
          cursor: pointer;
        }

        .close-btn:hover {
          color: #0F172A;
        }

        .modal-form-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-sub-desc {
          font-size: 13.5px;
          color: #64748B;
          margin: 0 0 8px 0;
          line-height: 1.5;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 700;
          color: #334155;
        }

        .form-group input,
        .form-group textarea {
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid #CBD5E1;
          font-size: 13.5px;
          color: #0F172A;
          background: #FFFFFF;
          outline: none;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          border-color: #FF5B38;
          box-shadow: 0 0 0 2px rgba(255, 91, 56, 0.2);
        }

        .modal-actions-row {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 10px;
        }

        .btn {
          padding: 9px 18px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          border: 1px solid transparent;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .btn-primary {
          background: #0F172A;
          color: #FFFFFF;
        }

        .btn-secondary {
          background: #F1F5F9;
          border-color: #E2E8F0;
          color: #475569;
        }

        .escrow-deposit-highlight {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 14px;
        }

        .highlight-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #475569;
          margin-bottom: 6px;
        }

        .highlight-divider {
          height: 1px;
          background: #E2E8F0;
          margin: 8px 0;
        }

        .highlight-row.total {
          font-size: 14.5px;
          font-weight: 800;
          color: #0F172A;
        }

        .escrow-milestone-guarantee-box {
          display: flex;
          gap: 10px;
          background: #ECFDF5;
          border: 1px solid #A7F3D0;
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 12px;
          color: #065F46;
        }

        .stars-picker-row {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin: 8px 0;
        }

        .star-pick-btn {
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 4px;
          transition: transform 0.1s ease;
        }

        .star-pick-btn:hover {
          transform: scale(1.15);
        }

        .release-notice-box {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #047857;
          background: #ECFDF5;
          border: 1px solid #A7F3D0;
          padding: 10px 14px;
          border-radius: 10px;
        }

      `}</style>
    </section>
  );
};

export default CreatorInbox;
