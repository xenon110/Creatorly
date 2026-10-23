export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateAgainstINR: number; // multiplier from base INR
  locale: string;
}

export type VerificationLevel = 'verified' | 'self_reported' | 'unavailable';

export interface SocialLink {
  platform: 'youtube' | 'instagram' | 'linkedin' | 'x' | 'github';
  name: string;
  handle: string;
  url: string;
  followers: number;
  verified: boolean;
}

export interface MetricItem {
  id: string;
  label: string;
  value: number | string;
  formattedValue: string;
  change?: string;
  verification: VerificationLevel;
  source?: string;
  benchmark?: string;
  description: string;
}

export interface DemographicSplit {
  label: string;
  percentage: number;
}

export interface GeographicSplit {
  country: string;
  code: string;
  percentage: number;
}

export interface CitySplit {
  city: string;
  percentage: number;
}

export interface AudienceMetrics {
  totalAudience: number;
  averageViews: number;
  engagementRate: number; // percentage
  targetMarketPercentage: number;
  targetMarketCountry: string;
  lastUpdatedDaysAgo: number;
  ageDistribution: DemographicSplit[];
  genderDistribution: DemographicSplit[];
  topGeographies: GeographicSplit[];
  topCities: CitySplit[];
  platformFollowers: {
    youtube: number;
    instagram: number;
    linkedin: number;
  };
}

export type ContentFormat = 'Sponsored Reel' | 'YouTube Integration' | 'UGC Ad Creative' | 'Dedicated Tech Review' | 'Tutorial Video';

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  format: ContentFormat;
  platform: 'youtube' | 'instagram' | 'linkedin';
  thumbnailUrl: string;
  publishedDate: string;
  views: number;
  engagement: number;
  brandClient: string;
  campaignObjective: string;
  deliverableSummary: string;
  clientQuote?: string;
  clientAuthor?: string;
  originalUrl: string;
  verifiedMetrics: boolean;
}

export interface ServiceAddOn {
  id: string;
  name: string;
  description: string;
  priceInINR: number;
  unit: string;
}

export interface ServicePackage {
  id: string;
  title: string;
  tagline: string;
  priceInINR: number;
  popular?: boolean;
  platform: 'Instagram' | 'YouTube' | 'Brand Ad Channels' | 'Multi-Platform';
  deliveryDays: number;
  includedRevisions: number;
  publishingIncluded: boolean;
  publishingDestination?: string;
  organicUsageDays: number;
  paidUsageRightsIncluded: boolean;
  paidUsageOptionDays?: number;
  deliverables: string[];
  notIncluded?: string[];
  bestFor: string;
}

export interface CreatorReview {
  id: string;
  brandName: string;
  brandLogo: string;
  reviewerName: string;
  reviewerRole: string;
  campaignType: string;
  rating: number; // 1-5
  date: string;
  content: string;
  metricHighlight?: string;
  verifiedTransaction: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'deliverables' | 'rights' | 'payment' | 'terms';
}

export type ReputationTier = 'emerging' | 'established' | 'elite';

export interface CreatorProfile {
  id: string;
  username: string;
  fullName: string;
  handle: string;
  avatarUrl: string;
  coverPattern?: string;
  verifiedBadge: boolean;
  verificationSource: string;
  reputationTier?: ReputationTier;
  primaryNiche: string;
  subNiches: string[];
  bio: string;
  location: {
    city: string;
    country: string;
    flagEmoji: string;
  };
  languages: string[];
  socialLinks: SocialLink[];
  availability: {
    status: 'available' | 'limited' | 'unavailable';
    label: string;
    slotsRemaining: number;
    totalSlots: number;
    earliestDelivery: string;
    responseTime: string;
  };
  metrics: AudienceMetrics;
  portfolio: PortfolioItem[];
  packages: ServicePackage[];
  addOns: ServiceAddOn[];
  reviews: CreatorReview[];
  overallRating: number;
  totalReviews: number;
  faqs: FAQItem[];
  collaborationTerms: {
    paymentPolicy: string;
    revisionPolicy: string;
    cancellationPolicy: string;
    exclusivityNotice: string;
  };
}

export interface BookingSubmissionData {
  packageId: string;
  packageName: string;
  basePriceINR: number;
  selectedAddOns: string[];
  totalPriceINR: number;
  brandName: string;
  contactName: string;
  contactEmail: string;
  companyWebsite: string;
  campaignObjective: string;
  targetAudience: string;
  preferredDate: string;
  campaignBrief: string;
  exclusivityRequested: boolean;
  submittedAt: string;
  referenceId: string;
}

export interface MessageSubmissionData {
  topic: string;
  brandName: string;
  contactEmail: string;
  message: string;
  referenceId: string;
  submittedAt: string;
}

export type CollaborationRequestStatus = 
  | 'new' 
  | 'in_discussion' 
  | 'accepted' 
  | 'in_progress' 
  | 'completed' 
  | 'declined';

export type PipelineStage = 
  | 'proposal'          // Step 1: Brief & Proposal Review
  | 'escrow_funding'    // Step 2: Escrow Funding Pending
  | 'script_signoff'    // Step 3: Script Outline Signoff
  | 'draft_review'      // Step 4: Video Draft & Revisions
  | 'live_completed';   // Step 5: Published & Escrow Released

export type EscrowStatus = 'unfunded' | 'held' | 'released' | 'refunded';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  actor: 'brand' | 'creator' | 'system';
  action: string;
  details?: string;
}

export interface ScriptOutlineData {
  title: string;
  hook: string;
  talkingPoints: string[];
  callToAction: string;
  status: 'drafting' | 'submitted' | 'approved' | 'revision_requested';
  feedbackNotes?: string;
}

export interface VideoDraftData {
  draftUrl: string;
  thumbnailUrl?: string;
  version: number;
  status: 'filming' | 'submitted' | 'approved' | 'revision_requested';
  revisionNotes?: string;
  submittedAt?: string;
}

export interface PublishedDeliverableData {
  liveUrl: string;
  platform: string;
  publishedAt: string;
  views?: number;
}

export interface BrandReviewData {
  rating: number;
  reviewText: string;
  submittedAt: string;
}

export interface DealChatMessage {
  id: string;
  senderRole: 'brand' | 'creator';
  senderName: string;
  senderAvatar?: string;
  message: string;
  timestamp: string;
  attachmentUrl?: string;
  attachmentName?: string;
}

export interface CollaborationRequest {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  creatorHandle: string;
  brandName: string;
  brandContactPerson: string;
  brandEmail: string;
  companyWebsite?: string;
  serviceTitle: string;
  packageId?: string;
  budgetINR: number;
  proposedDeadline: string;
  campaignObjective: string;
  campaignBrief: string;
  deliverables: string[];
  status: CollaborationRequestStatus;
  submittedAt: string;
  counterOfferINR?: number;
  counterOfferNotes?: string;
  creatorNotes?: string;
  // Pipeline & Workflow Fields
  pipelineStage?: PipelineStage;
  escrowStatus?: EscrowStatus;
  escrowAmountINR?: number;
  scriptOutline?: ScriptOutlineData;
  videoDraft?: VideoDraftData;
  publishedDeliverable?: PublishedDeliverableData;
  brandReview?: BrandReviewData;
  timelineEvents?: TimelineEvent[];
  // Digital Agreement & In-Deal Chat
  agreementSignedByCreator?: string;
  agreementSignedByBrand?: string;
  chatMessages?: DealChatMessage[];
}

export interface SmartMatchParsedQuery {
  niche?: string;
  platform?: string;
  location?: string;
  maxBudgetINR?: number;
  format?: string;
  audienceKeywords?: string[];
}

export interface SmartMatchResult {
  creator: CreatorProfile;
  matchScore: number; // 0 to 100
  matchReasons: string[];
  recommendedPackage: ServicePackage;
  withinBudget: boolean;
}

export type UserRole = 'creator' | 'brand';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  handle?: string;
  companyName?: string;
  niche?: string;
  verified?: boolean;
}


