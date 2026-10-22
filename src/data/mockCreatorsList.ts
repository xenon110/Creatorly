import type { CreatorProfile, CollaborationRequest } from '../types/creator';
import { ALEX_SHARMA_PROFILE } from './mockCreator';

export const PRIYA_PATEL_PROFILE: CreatorProfile = {
  id: 'creator-priya-patel',
  username: 'priya-patel',
  fullName: 'Priya Patel',
  handle: '@priyastyles',
  avatarUrl: '/images/priya-patel.jpg',
  coverPattern: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 50%, #FECDD3 100%)',
  verifiedBadge: true,
  verificationSource: 'Instagram Graph API + Bank KYC Verification',
  primaryNiche: 'Fashion & Styling',
  subNiches: ['Affordable Fashion', 'Everyday Styling', 'Sustainable Clothing', 'Ethnic & Fusion'],
  bio: 'Helping young professionals and college students style affordable, high-quality outfits without breaking the bank.',
  location: {
    city: 'New Delhi',
    country: 'India',
    flagEmoji: '🇮🇳'
  },
  languages: ['English', 'Hindi'],
  socialLinks: [
    {
      platform: 'instagram',
      name: 'Instagram',
      handle: '@priyastyles',
      url: 'https://instagram.com',
      followers: 112000,
      verified: true
    },
    {
      platform: 'youtube',
      name: 'YouTube Shorts',
      handle: 'PriyaPatelFashion',
      url: 'https://youtube.com',
      followers: 48000,
      verified: true
    }
  ],
  availability: {
    status: 'available',
    label: 'Available for Bookings',
    slotsRemaining: 4,
    totalSlots: 6,
    earliestDelivery: 'Within 5 business days',
    responseTime: '< 3 hours'
  },
  metrics: {
    totalAudience: 112000,
    averageViews: 34000,
    engagementRate: 5.4,
    targetMarketPercentage: 78,
    targetMarketCountry: 'India',
    lastUpdatedDaysAgo: 2,
    ageDistribution: [
      { label: '18-24', percentage: 48 },
      { label: '25-34', percentage: 38 },
      { label: '35-44', percentage: 11 },
      { label: '45+', percentage: 3 }
    ],
    genderDistribution: [
      { label: 'Female', percentage: 68 },
      { label: 'Male', percentage: 32 }
    ],
    topGeographies: [
      { country: 'India', code: 'IN', percentage: 78 },
      { country: 'United Arab Emirates', code: 'AE', percentage: 8 },
      { country: 'United States', code: 'US', percentage: 6 },
      { country: 'United Kingdom', code: 'GB', percentage: 4 },
      { country: 'Others', code: 'OTHER', percentage: 4 }
    ],
    topCities: [
      { city: 'Delhi NCR', percentage: 32 },
      { city: 'Mumbai', percentage: 24 },
      { city: 'Bengaluru', percentage: 16 },
      { city: 'Jaipur', percentage: 11 },
      { city: 'Pune', percentage: 9 }
    ],
    platformFollowers: {
      instagram: 112000,
      youtube: 48000,
      linkedin: 4200
    }
  },
  portfolio: [
    {
      id: 'work-priya-1',
      title: '5 Trendy College Outfits Under ₹1,500',
      category: 'Affordable Fashion',
      format: 'Sponsored Reel',
      platform: 'instagram',
      thumbnailUrl: '/images/work-ugc-demo.jpg',
      publishedDate: '12 Sep 2026',
      views: 52000,
      engagement: 6.8,
      brandClient: 'UrbanThreads Clothing',
      campaignObjective: 'Drive traffic to youth budget collection with trackable coupon code.',
      deliverableSummary: '1 styling reel + 2 story slides with direct sticker link.',
      clientQuote: 'Priya drove over 420 direct orders within 48 hours of posting. Exceptional return on ad spend.',
      clientAuthor: 'Kavita Menon, Marketing Lead',
      originalUrl: 'https://instagram.com',
      verifiedMetrics: true
    },
    {
      id: 'work-priya-2',
      title: 'Festive Season Capsule Wardrobe Guide',
      category: 'Ethnic & Fusion',
      format: 'Sponsored Reel',
      platform: 'instagram',
      thumbnailUrl: '/images/work-gadgets.jpg',
      publishedDate: '28 Aug 2026',
      views: 38000,
      engagement: 5.1,
      brandClient: 'Vanya Ethnic Wear',
      campaignObjective: 'Showcase 4 versatile festive looks from a single fusion kurti.',
      deliverableSummary: '1 high-retention reel with audio hook and look breakdown.',
      originalUrl: 'https://instagram.com',
      verifiedMetrics: true
    }
  ],
  packages: [
    {
      id: 'pkg-priya-reel',
      title: 'Instagram Sponsored Styling Reel',
      tagline: 'High-energy fashion reel showing your product naturally styled with clear shopping tag.',
      priceInINR: 4500,
      popular: true,
      platform: 'Instagram',
      deliveryDays: 5,
      includedRevisions: 1,
      publishingIncluded: true,
      publishingDestination: "Priya's Instagram Feed (@priyastyles)",
      organicUsageDays: 30,
      paidUsageRightsIncluded: false,
      paidUsageOptionDays: 60,
      deliverables: [
        'One 45-60 second 4K vertical styling reel',
        'Direct collaborator tag and brand mention in caption',
        'Pinned comment with promo discount code',
        'Two Instagram story frames with direct link sticker'
      ],
      notIncluded: [
        'Paid ad whitelisting (available as add-on)',
        'Competitor exclusivity over 14 days'
      ],
      bestFor: 'Clothing brands, footwear, accessories, and fashion e-commerce apps.'
    },
    {
      id: 'pkg-priya-lookbook',
      title: 'Seasonal Lookbook Integration',
      tagline: 'Multi-look showcase featuring 3-4 outfits with dedicated carousel breakdown.',
      priceInINR: 7500,
      platform: 'Instagram',
      deliveryDays: 7,
      includedRevisions: 2,
      publishingIncluded: true,
      publishingDestination: "Priya's Instagram Feed",
      organicUsageDays: 60,
      paidUsageRightsIncluded: false,
      deliverables: [
        'One 60-second transition styling reel',
        'One 6-slide carousel breakdown of fabric and sizing',
        'Three supporting story frames over 48 hours',
        '14-day link in bio feature'
      ],
      bestFor: 'New collection launches and festive fashion campaigns.'
    },
    {
      id: 'pkg-priya-ugc',
      title: 'UGC Ad Creative for Brand Channels',
      tagline: 'Authentic customer-style try-on video produced exclusively for your Meta & TikTok ad spend.',
      priceInINR: 3500,
      platform: 'Brand Ad Channels',
      deliveryDays: 4,
      includedRevisions: 1,
      publishingIncluded: false,
      organicUsageDays: 0,
      paidUsageRightsIncluded: true,
      paidUsageOptionDays: 90,
      deliverables: [
        'One 30-45 second edited vertical video file (MP4, 4K 60fps)',
        'Hooks A/B test (2 alternative first 3-second opening hooks)',
        '90-day full paid advertising usage rights license',
        'Raw audio and clean color-graded visual file delivery'
      ],
      notIncluded: [
        'Does NOT include posting on Priya\'s personal social channels'
      ],
      bestFor: 'Performance marketing agencies running Meta/Instagram ads.'
    }
  ],
  addOns: [
    {
      id: 'addon-priya-rush',
      name: '48-Hour Rush Delivery',
      description: 'First draft delivered within 48 hours of brief signoff.',
      priceInINR: 1500,
      unit: 'per campaign'
    },
    {
      id: 'addon-priya-paid-ads',
      name: '60-Day Paid Whitelist Rights',
      description: 'Run creator partnership ad from @priyastyles handle on Meta Ads.',
      priceInINR: 2000,
      unit: '60 days'
    }
  ],
  reviews: [
    {
      id: 'rev-priya-1',
      brandName: 'UrbanThreads Clothing',
      brandLogo: 'UT',
      reviewerName: 'Kavita Menon',
      reviewerRole: 'Growth Marketing Lead',
      campaignType: 'Sponsored Instagram Reel',
      rating: 5,
      date: 'September 2026',
      content: 'Priya understood our budget clothing positioning immediately. Her reel felt completely authentic to her followers, not like an aggressive sales pitch. We generated 420+ purchases with an ROI of 4.8x.',
      metricHighlight: '420+ direct orders with ₹1,200 AOV',
      verifiedTransaction: true
    },
    {
      id: 'rev-priya-2',
      brandName: 'SoleMate Footwear',
      brandLogo: 'SM',
      reviewerName: 'Deepak Joshi',
      reviewerRole: 'Founder',
      campaignType: 'UGC Ad Creative',
      rating: 5,
      date: 'August 2026',
      content: 'Delivered two hook variations that lowered our Cost Per Acquisition by 34% on Meta Ads. Highly recommended for UGC.',
      metricHighlight: '34% reduction in CAC on Meta ads',
      verifiedTransaction: true
    }
  ],
  overallRating: 5.0,
  totalReviews: 18,
  faqs: [
    {
      id: 'faq-priya-1',
      question: 'Do you keep the clothing samples after filming?',
      answer: 'Yes, physical clothing samples are used for filming, styling, and future organic re-wears. If expensive samples need return, return courier must be arranged.',
      category: 'deliverables'
    },
    {
      id: 'faq-priya-2',
      question: 'What is your revision turnaround time?',
      answer: 'Minor text or edit revisions are completed within 24 hours. Reshoots require 48 hours.',
      category: 'deliverables'
    }
  ],
  collaborationTerms: {
    paymentPolicy: '100% held securely in Creatorly Escrow until deliverable approval.',
    revisionPolicy: '1 conceptual change allowed during script phase; 1 visual pacing edit upon video draft.',
    cancellationPolicy: 'Full refund if cancelled before sample shipment. 50% refund once filming has commenced.',
    exclusivityNotice: 'Available for 14-day apparel exclusivity at ₹1,500 additional fee.'
  }
};

export const ROHIT_VERMA_PROFILE: CreatorProfile = {
  id: 'creator-rohit-verma',
  username: 'rohit-verma',
  fullName: 'Rohit Verma',
  handle: '@rohitfit',
  avatarUrl: '/images/rohit-verma.jpg',
  coverPattern: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 50%, #BBF7D0 100%)',
  verifiedBadge: true,
  verificationSource: 'Meta Business Partner API Sync',
  primaryNiche: 'Fitness & Sports',
  subNiches: ['Strength Training', 'Sports Nutrition', 'Athletic Wear', 'Healthy Living'],
  bio: 'Certified strength trainer and sports nutritionist breaking down evidence-based training, clean nutrition, and workout gear.',
  location: {
    city: 'Bengaluru',
    country: 'India',
    flagEmoji: '🇮🇳'
  },
  languages: ['English', 'Hindi', 'Kannada'],
  socialLinks: [
    {
      platform: 'instagram',
      name: 'Instagram',
      handle: '@rohitfit',
      url: 'https://instagram.com',
      followers: 94000,
      verified: true
    },
    {
      platform: 'youtube',
      name: 'YouTube',
      handle: 'RohitVermaFitness',
      url: 'https://youtube.com',
      followers: 32000,
      verified: true
    }
  ],
  availability: {
    status: 'available',
    label: 'Available for Bookings',
    slotsRemaining: 2,
    totalSlots: 5,
    earliestDelivery: 'Within 6 business days',
    responseTime: '< 4 hours'
  },
  metrics: {
    totalAudience: 94000,
    averageViews: 28000,
    engagementRate: 6.1,
    targetMarketPercentage: 71,
    targetMarketCountry: 'India',
    lastUpdatedDaysAgo: 1,
    ageDistribution: [
      { label: '18-24', percentage: 34 },
      { label: '25-34', percentage: 52 },
      { label: '35-44', percentage: 11 },
      { label: '45+', percentage: 3 }
    ],
    genderDistribution: [
      { label: 'Male', percentage: 74 },
      { label: 'Female', percentage: 26 }
    ],
    topGeographies: [
      { country: 'India', code: 'IN', percentage: 71 },
      { country: 'United States', code: 'US', percentage: 12 },
      { country: 'United Kingdom', code: 'GB', percentage: 7 },
      { country: 'Singapore', code: 'SG', percentage: 5 },
      { country: 'Others', code: 'OTHER', percentage: 5 }
    ],
    topCities: [
      { city: 'Bengaluru', percentage: 35 },
      { city: 'Mumbai', percentage: 22 },
      { city: 'Delhi NCR', percentage: 18 },
      { city: 'Hyderabad', percentage: 14 },
      { city: 'Chennai', percentage: 11 }
    ],
    platformFollowers: {
      instagram: 94000,
      youtube: 32000,
      linkedin: 2800
    }
  },
  portfolio: [
    {
      id: 'work-rohit-1',
      title: 'Top 3 Clean Whey Proteins Tested & Reviewed',
      category: 'Sports Nutrition',
      format: 'Sponsored Reel',
      platform: 'instagram',
      thumbnailUrl: '/images/work-gadgets.jpg',
      publishedDate: '18 Sep 2026',
      views: 44000,
      engagement: 6.4,
      brandClient: 'Apex Nutrition',
      campaignObjective: 'Educate gym-goers on label transparency and certified lab tests.',
      deliverableSummary: '1 60s Reel with lab test comparison + 2 story slides.',
      clientQuote: 'Rohit provided real credibility because he actually tested the mixability on camera. Best influencer campaign we ran this quarter.',
      clientAuthor: 'Vikram Seth, Brand Director',
      originalUrl: 'https://instagram.com',
      verifiedMetrics: true
    }
  ],
  packages: [
    {
      id: 'pkg-rohit-ugc',
      title: 'Fitness & Athletic UGC Ad Video',
      tagline: 'High-energy gym workout footage showcasing your apparel or supplement in action.',
      priceInINR: 4000,
      popular: true,
      platform: 'Brand Ad Channels',
      deliveryDays: 5,
      includedRevisions: 1,
      publishingIncluded: false,
      organicUsageDays: 0,
      paidUsageRightsIncluded: true,
      paidUsageOptionDays: 90,
      deliverables: [
        'One 30-45 second edited high-definition vertical video',
        'Real gym setting with energetic athletic movement',
        'Product demonstration (wearing apparel or drinking supplement)',
        '90-day commercial paid ad usage rights'
      ],
      bestFor: 'Activewear brands, fitness apps, pre-workout and protein supplements.'
    },
    {
      id: 'pkg-rohit-reel',
      title: 'Sponsored Instagram Fitness Reel',
      tagline: 'Form tutorial or workout integration posted directly to Rohit\'s dedicated fitness audience.',
      priceInINR: 6000,
      platform: 'Instagram',
      deliveryDays: 6,
      includedRevisions: 1,
      publishingIncluded: true,
      publishingDestination: "Rohit's Instagram Feed (@rohitfit)",
      organicUsageDays: 30,
      paidUsageRightsIncluded: false,
      deliverables: [
        'One 60-second exercise tutorial with brand integration',
        'Caption mention with brand handle tag and promo code',
        'Pinned comment and 2 story frames'
      ],
      bestFor: 'Reaching dedicated gym enthusiasts and fitness buyers.'
    }
  ],
  addOns: [
    {
      id: 'addon-rohit-rush',
      name: '48-Hour Expedited Delivery',
      description: 'Draft ready within 48 hours.',
      priceInINR: 1800,
      unit: 'per campaign'
    }
  ],
  reviews: [
    {
      id: 'rev-rohit-1',
      brandName: 'Apex Nutrition',
      brandLogo: 'AN',
      reviewerName: 'Vikram Seth',
      reviewerRole: 'Brand Director',
      campaignType: 'Sponsored Instagram Reel',
      rating: 5,
      date: 'September 2026',
      content: 'Credible, athletic, and easy to work with. He clearly understands supplement regulations and formulated content that complied with standards.',
      metricHighlight: '44K verified views, 6.4% engagement',
      verifiedTransaction: true
    }
  ],
  overallRating: 4.9,
  totalReviews: 12,
  faqs: [
    {
      id: 'faq-rohit-1',
      question: 'Do you only review certified supplements?',
      answer: 'Yes, all ingestible supplements must have FSSAI approval and third-party lab verification.',
      category: 'terms'
    }
  ],
  collaborationTerms: {
    paymentPolicy: 'Creatorly milestone escrow. Released upon final video approval.',
    revisionPolicy: '1 revision included. Script confirmed before gym shoot.',
    cancellationPolicy: 'Standard Creatorly cancellation terms.',
    exclusivityNotice: '30-day nutrition brand exclusivity available for ₹3,000.'
  }
};

export const ANANYA_ROY_PROFILE: CreatorProfile = {
  id: 'creator-ananya-roy',
  username: 'ananya-roy',
  fullName: 'Ananya Roy',
  handle: '@ananyabites',
  avatarUrl: '/images/ananya-roy.jpg',
  coverPattern: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #FCD34D 100%)',
  verifiedBadge: true,
  verificationSource: 'Instagram Graph API + Food Blogger Association Verified',
  primaryNiche: 'Food & Travel',
  subNiches: ['Artisanal Cafes', 'Quick Recipes', 'Travel Guides', 'Kitchen Appliances'],
  bio: 'Exploring cozy cafes, uncovering hidden street gems, and crafting simple 15-minute comfort recipes.',
  location: {
    city: 'Mumbai',
    country: 'India',
    flagEmoji: '🇮🇳'
  },
  languages: ['English', 'Hindi', 'Bengali'],
  socialLinks: [
    {
      platform: 'instagram',
      name: 'Instagram',
      handle: '@ananyabites',
      url: 'https://instagram.com',
      followers: 76000,
      verified: true
    },
    {
      platform: 'youtube',
      name: 'YouTube',
      handle: 'AnanyaRoyKitchen',
      url: 'https://youtube.com',
      followers: 24000,
      verified: true
    }
  ],
  availability: {
    status: 'available',
    label: 'Available for Bookings',
    slotsRemaining: 3,
    totalSlots: 4,
    earliestDelivery: 'Within 5 business days',
    responseTime: '< 3 hours'
  },
  metrics: {
    totalAudience: 76000,
    averageViews: 19500,
    engagementRate: 4.9,
    targetMarketPercentage: 82,
    targetMarketCountry: 'India',
    lastUpdatedDaysAgo: 3,
    ageDistribution: [
      { label: '18-24', percentage: 28 },
      { label: '25-34', percentage: 54 },
      { label: '35-44', percentage: 14 },
      { label: '45+', percentage: 4 }
    ],
    genderDistribution: [
      { label: 'Female', percentage: 61 },
      { label: 'Male', percentage: 39 }
    ],
    topGeographies: [
      { country: 'India', code: 'IN', percentage: 82 },
      { country: 'United States', code: 'US', percentage: 8 },
      { country: 'United Kingdom', code: 'GB', percentage: 5 },
      { country: 'Others', code: 'OTHER', percentage: 5 }
    ],
    topCities: [
      { city: 'Mumbai', percentage: 44 },
      { city: 'Pune', percentage: 21 },
      { city: 'Delhi NCR', percentage: 16 },
      { city: 'Kolkata', percentage: 12 },
      { city: 'Goa', percentage: 7 }
    ],
    platformFollowers: {
      instagram: 76000,
      youtube: 24000,
      linkedin: 1800
    }
  },
  portfolio: [
    {
      id: 'work-ananya-1',
      title: 'Top 5 Hidden Breakfast Cafes in Bandra',
      category: 'Artisanal Cafes',
      format: 'Sponsored Reel',
      platform: 'instagram',
      thumbnailUrl: '/images/work-gadgets.jpg',
      publishedDate: '10 Sep 2026',
      views: 31000,
      engagement: 5.8,
      brandClient: 'The Roast Kitchen',
      campaignObjective: 'Drive foot traffic and weekend brunch table reservations for new cafe opening.',
      deliverableSummary: '1 60s Reel with location geo-tag + 3 story frames with Google Maps link.',
      clientQuote: 'Weekend brunch was completely sold out for 3 consecutive weeks after Ananya\'s reel dropped.',
      clientAuthor: 'Ayesha Merchant, Founder',
      originalUrl: 'https://instagram.com',
      verifiedMetrics: true
    }
  ],
  packages: [
    {
      id: 'pkg-ananya-ugc',
      title: 'Food / Beverage UGC Recipe Video',
      tagline: 'High-res close-up cooking or unboxing creative for brand ad campaigns.',
      priceInINR: 3800,
      platform: 'Brand Ad Channels',
      deliveryDays: 5,
      includedRevisions: 1,
      publishingIncluded: false,
      organicUsageDays: 0,
      paidUsageRightsIncluded: true,
      paidUsageOptionDays: 90,
      deliverables: [
        'One 30-45 second crisp 4K vertical recipe or product video',
        'Close-up culinary B-roll and tasting reactions',
        '90-day digital ad usage rights license'
      ],
      bestFor: 'FMCG packaged foods, coffee brands, cookware, and snack products.'
    },
    {
      id: 'pkg-ananya-reel',
      title: 'Instagram Cafe / Product Spotlight Reel',
      tagline: 'Aesthetic reel posted on Ananya\'s feed exploring your cafe, restaurant, or gourmet food product.',
      priceInINR: 5500,
      popular: true,
      platform: 'Instagram',
      deliveryDays: 6,
      includedRevisions: 1,
      publishingIncluded: true,
      publishingDestination: "Ananya's Instagram Feed (@ananyabites)",
      organicUsageDays: 30,
      paidUsageRightsIncluded: false,
      deliverables: [
        'One 60-second aesthetic reel with trending culinary audio',
        'Geotag, collaborator tag, and caption story',
        'Two Instagram story frames with reservation or purchase link'
      ],
      bestFor: 'Cafes, specialty dining, organic snacks, and kitchen appliances.'
    }
  ],
  addOns: [
    {
      id: 'addon-ananya-rush',
      name: '48-Hour Fast Delivery',
      description: 'Draft ready within 48 hours.',
      priceInINR: 1500,
      unit: 'per campaign'
    }
  ],
  reviews: [
    {
      id: 'rev-ananya-1',
      brandName: 'The Roast Kitchen',
      brandLogo: 'RK',
      reviewerName: 'Ayesha Merchant',
      reviewerRole: 'Founder & Head Chef',
      campaignType: 'Cafe Spotlight Reel',
      rating: 5,
      date: 'September 2026',
      content: 'Ananya took the time to understand our artisanal baking process and captured our sourdough in gorgeous natural lighting. Fantastic engagement from Mumbai foodies!',
      metricHighlight: '31K views, 240+ table bookings',
      verifiedTransaction: true
    }
  ],
  overallRating: 5.0,
  totalReviews: 14,
  faqs: [
    {
      id: 'faq-ananya-1',
      question: 'Do you travel outside Mumbai for shoots?',
      answer: 'Yes, for Delhi, Bengaluru, and Goa shoots, travel and stay expenses must be covered.',
      category: 'terms'
    }
  ],
  collaborationTerms: {
    paymentPolicy: 'Creatorly escrow deposit prior to shoot.',
    revisionPolicy: '1 pacing and caption edit included.',
    cancellationPolicy: 'Flexible cancellation up to 48 hours before scheduled shoot.',
    exclusivityNotice: '14-day cafe exclusivity available upon request.'
  }
};

export const AAROHI_MEHTA_PROFILE: CreatorProfile = {
  id: 'creator-aarohi-mehta',
  username: 'aarohi-mehta',
  fullName: 'Aarohi Mehta',
  handle: '@aarohimehta',
  avatarUrl: '/images/aarohi-mehta.jpg',
  coverPattern: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 50%, #FBCFE8 100%)',
  verifiedBadge: true,
  verificationSource: 'Instagram Graph API + Bank KYC Verification',
  primaryNiche: 'Food & City Finds',
  subNiches: ['Mumbai Hidden Gems', 'Street Food Culture', 'Cafe Reviews', 'Weekend Guides'],
  bio: 'Uncovering Mumbai\'s best secret cafes, legendary street corners, and heritage recipes. Honest culinary stories that make people hungry to explore.',
  location: {
    city: 'Mumbai',
    country: 'India',
    flagEmoji: '🇮🇳'
  },
  languages: ['English', 'Hindi', 'Gujarati'],
  socialLinks: [
    {
      platform: 'instagram',
      name: 'Instagram',
      handle: '@aarohimehta',
      url: 'https://instagram.com',
      followers: 142000,
      verified: true
    },
    {
      platform: 'youtube',
      name: 'YouTube',
      handle: 'AarohiMehtaVlogs',
      url: 'https://youtube.com',
      followers: 68000,
      verified: true
    }
  ],
  availability: {
    status: 'available',
    label: 'Available for Bookings',
    slotsRemaining: 2,
    totalSlots: 4,
    earliestDelivery: 'Within 5 business days',
    responseTime: '< 2 hours'
  },
  metrics: {
    totalAudience: 142000,
    averageViews: 48000,
    engagementRate: 6.2,
    targetMarketPercentage: 84,
    targetMarketCountry: 'India',
    lastUpdatedDaysAgo: 1,
    ageDistribution: [
      { label: '18-24', percentage: 42 },
      { label: '25-34', percentage: 44 },
      { label: '35-44', percentage: 11 },
      { label: '45+', percentage: 3 }
    ],
    genderDistribution: [
      { label: 'Female', percentage: 62 },
      { label: 'Male', percentage: 38 }
    ],
    topGeographies: [
      { country: 'India', code: 'IN', percentage: 84 },
      { country: 'United Arab Emirates', code: 'AE', percentage: 8 },
      { country: 'United Kingdom', code: 'GB', percentage: 4 },
      { country: 'Others', code: 'OTHER', percentage: 4 }
    ],
    topCities: [
      { city: 'Mumbai', percentage: 42 },
      { city: 'Delhi NCR', percentage: 24 },
      { city: 'Pune', percentage: 14 }
    ],
    platformFollowers: {
      instagram: 142000,
      youtube: 68000,
      linkedin: 2400
    }
  },
  portfolio: [],
  packages: [
    {
      id: 'pkg-aarohi-1',
      title: 'Cafe Spotlight Reel',
      tagline: 'Aesthetic 60s Reel with culinary audio & location pin.',
      priceInINR: 6000,
      popular: true,
      platform: 'Instagram',
      deliveryDays: 4,
      includedRevisions: 1,
      publishingIncluded: true,
      organicUsageDays: 30,
      paidUsageRightsIncluded: false,
      deliverables: ['1x 60s 4K Reel', 'Geo-tag & Collaborator tag', '2x Story frames'],
      bestFor: 'Cafes, bakeries, and dining spots'
    }
  ],
  addOns: [],
  reviews: [],
  overallRating: 5.0,
  totalReviews: 18,
  faqs: [],
  collaborationTerms: {
    paymentPolicy: 'Milestone escrow on Creatorly.',
    revisionPolicy: '1 round of editing included.',
    cancellationPolicy: 'Standard terms.',
    exclusivityNotice: '14-day exclusivity available.'
  }
};

export const MAYA_JAMES_PROFILE: CreatorProfile = {
  id: 'creator-maya-james',
  username: 'maya-james',
  fullName: 'Maya James',
  handle: '@mayajames',
  avatarUrl: '/images/maya-james.jpg',
  coverPattern: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FDE68A 100%)',
  verifiedBadge: true,
  verificationSource: 'Instagram Graph API + Bank KYC Verification',
  primaryNiche: 'Beauty & Personal Style',
  subNiches: ['Skincare Routine', 'Everyday Makeup', 'Texture & Haircare', 'London Style'],
  bio: 'Real skin, minimal routines, and elevated everyday beauty. Honest formulas tested across weeks, not minutes.',
  location: {
    city: 'London',
    country: 'United Kingdom',
    flagEmoji: '🇬🇧'
  },
  languages: ['English'],
  socialLinks: [
    {
      platform: 'instagram',
      name: 'Instagram',
      handle: '@mayajames',
      url: 'https://instagram.com',
      followers: 188000,
      verified: true
    },
    {
      platform: 'youtube',
      name: 'YouTube',
      handle: 'MayaJamesBeauty',
      url: 'https://youtube.com',
      followers: 94000,
      verified: true
    }
  ],
  availability: {
    status: 'available',
    label: 'Available for Bookings',
    slotsRemaining: 1,
    totalSlots: 3,
    earliestDelivery: 'Within 7 business days',
    responseTime: '< 3 hours'
  },
  metrics: {
    totalAudience: 188000,
    averageViews: 62000,
    engagementRate: 5.9,
    targetMarketPercentage: 68,
    targetMarketCountry: 'UK & India',
    lastUpdatedDaysAgo: 2,
    ageDistribution: [
      { label: '18-24', percentage: 38 },
      { label: '25-34', percentage: 48 },
      { label: '35-44', percentage: 11 },
      { label: '45+', percentage: 3 }
    ],
    genderDistribution: [
      { label: 'Female', percentage: 76 },
      { label: 'Male', percentage: 24 }
    ],
    topGeographies: [
      { country: 'United Kingdom', code: 'GB', percentage: 48 },
      { country: 'India', code: 'IN', percentage: 24 },
      { country: 'United States', code: 'US', percentage: 18 },
      { country: 'Others', code: 'OTHER', percentage: 10 }
    ],
    topCities: [
      { city: 'London', percentage: 38 },
      { city: 'Manchester', percentage: 14 },
      { city: 'Mumbai', percentage: 12 }
    ],
    platformFollowers: {
      instagram: 188000,
      youtube: 94000,
      linkedin: 3100
    }
  },
  portfolio: [],
  packages: [
    {
      id: 'pkg-maya-1',
      title: 'Skincare Routine Feature',
      tagline: 'High-production 4K routine integration with texture close-ups.',
      priceInINR: 9500,
      popular: true,
      platform: 'Instagram',
      deliveryDays: 5,
      includedRevisions: 1,
      publishingIncluded: true,
      organicUsageDays: 30,
      paidUsageRightsIncluded: false,
      deliverables: ['1x 60s High-Def Reel', 'Product close-ups', 'Promo discount code'],
      bestFor: 'Clean skincare, cosmetics, and self-care brands'
    }
  ],
  addOns: [],
  reviews: [],
  overallRating: 4.9,
  totalReviews: 24,
  faqs: [],
  collaborationTerms: {
    paymentPolicy: 'Creatorly escrow protection.',
    revisionPolicy: '1 round of brand feedback.',
    cancellationPolicy: 'Standard terms.',
    exclusivityNotice: '30-day beauty exclusivity available.'
  }
};

export const JUN_PARK_PROFILE: CreatorProfile = {
  id: 'creator-jun-park',
  username: 'jun-park',
  fullName: 'Jun Park',
  handle: '@junpark',
  avatarUrl: '/images/jun-park.jpg',
  coverPattern: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 50%, #A7F3D0 100%)',
  verifiedBadge: true,
  verificationSource: 'YouTube Partner API Verification',
  primaryNiche: 'Everyday Tech & Life',
  subNiches: ['Minimalist EDC', 'Productivity Systems', 'Camera Gear', 'Seoul Vlogs'],
  bio: 'Thoughtful tech reviews, deliberate minimalist EDC, and productivity rituals that help you do more of what matters.',
  location: {
    city: 'Seoul',
    country: 'South Korea',
    flagEmoji: '🇰🇷'
  },
  languages: ['English', 'Korean'],
  socialLinks: [
    {
      platform: 'youtube',
      name: 'YouTube',
      handle: 'JunParkTech',
      url: 'https://youtube.com',
      followers: 210000,
      verified: true
    },
    {
      platform: 'instagram',
      name: 'Instagram',
      handle: '@junpark',
      url: 'https://instagram.com',
      followers: 95000,
      verified: true
    }
  ],
  availability: {
    status: 'available',
    label: 'Available for Bookings',
    slotsRemaining: 3,
    totalSlots: 5,
    earliestDelivery: 'Within 6 business days',
    responseTime: '< 2 hours'
  },
  metrics: {
    totalAudience: 210000,
    averageViews: 74000,
    engagementRate: 5.1,
    targetMarketPercentage: 72,
    targetMarketCountry: 'Global',
    lastUpdatedDaysAgo: 1,
    ageDistribution: [
      { label: '18-24', percentage: 34 },
      { label: '25-34', percentage: 52 },
      { label: '35-44', percentage: 11 },
      { label: '45+', percentage: 3 }
    ],
    genderDistribution: [
      { label: 'Male', percentage: 72 },
      { label: 'Female', percentage: 28 }
    ],
    topGeographies: [
      { country: 'South Korea', code: 'KR', percentage: 42 },
      { country: 'United States', code: 'US', percentage: 28 },
      { country: 'India', code: 'IN', percentage: 16 },
      { country: 'Others', code: 'OTHER', percentage: 14 }
    ],
    topCities: [
      { city: 'Seoul', percentage: 40 },
      { city: 'Busan', percentage: 12 },
      { city: 'San Francisco', percentage: 8 }
    ],
    platformFollowers: {
      youtube: 210000,
      instagram: 95000,
      linkedin: 4200
    }
  },
  portfolio: [],
  packages: [
    {
      id: 'pkg-jun-1',
      title: 'Minimalist EDC Video Feature',
      tagline: 'Dedicated 4K camera gear or everyday tech showcase.',
      priceInINR: 11000,
      popular: true,
      platform: 'YouTube',
      deliveryDays: 6,
      includedRevisions: 1,
      publishingIncluded: true,
      organicUsageDays: 30,
      paidUsageRightsIncluded: false,
      deliverables: ['1x Dedicated YouTube integration', 'Pinned affiliate link', '1x Short cut-down'],
      bestFor: 'Camera accessories, bags, laptops, and hardware'
    }
  ],
  addOns: [],
  reviews: [],
  overallRating: 5.0,
  totalReviews: 29,
  faqs: [],
  collaborationTerms: {
    paymentPolicy: 'Creatorly escrow deposit prior to filming.',
    revisionPolicy: '1 round of factual and branding feedback.',
    cancellationPolicy: 'Standard terms.',
    exclusivityNotice: 'Category exclusivity on request.'
  }
};

export const VIKRAM_SEN_PROFILE: CreatorProfile = {
  id: 'creator-vikram-sen',
  username: 'vikram-sen',
  fullName: 'Prof. Vikram Sen',
  handle: '@vikramlearns',
  avatarUrl: '/images/vikram-sen.jpg',
  coverPattern: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #BFDBFE 100%)',
  verifiedBadge: true,
  verificationSource: 'Academic & YouTube Partner API Verified',
  primaryNiche: 'Education',
  subNiches: ['AI & Coding', 'Career Growth', 'STEM Education', 'Tech Tutorials'],
  bio: 'Simplifying computer science, AI, and modern career skills for 180k+ students and professionals across India.',
  location: {
    city: 'Hyderabad',
    country: 'India',
    flagEmoji: '🇮🇳'
  },
  languages: ['English', 'Hindi', 'Telugu'],
  socialLinks: [
    {
      platform: 'youtube',
      name: 'YouTube',
      handle: 'VikramSenEdu',
      url: 'https://youtube.com',
      followers: 184000,
      verified: true
    },
    {
      platform: 'linkedin',
      name: 'LinkedIn',
      handle: 'prof-vikram-sen',
      url: 'https://linkedin.com',
      followers: 45000,
      verified: true
    }
  ],
  availability: {
    status: 'available',
    label: 'Available for Sponsorships',
    slotsRemaining: 3,
    totalSlots: 5,
    earliestDelivery: 'Within 5 business days',
    responseTime: '< 2 hours'
  },
  metrics: {
    totalAudience: 184000,
    averageViews: 52000,
    engagementRate: 6.2,
    targetMarketPercentage: 84,
    targetMarketCountry: 'India',
    lastUpdatedDaysAgo: 1,
    ageDistribution: [
      { label: '18-24', percentage: 56 },
      { label: '25-34', percentage: 36 },
      { label: '35-44', percentage: 6 },
      { label: '45+', percentage: 2 }
    ],
    genderDistribution: [
      { label: 'Male', percentage: 65 },
      { label: 'Female', percentage: 35 }
    ],
    topGeographies: [
      { country: 'India', code: 'IN', percentage: 84 },
      { country: 'United States', code: 'US', percentage: 7 },
      { country: 'Others', code: 'OTHER', percentage: 9 }
    ],
    topCities: [
      { city: 'Bengaluru', percentage: 30 },
      { city: 'Hyderabad', percentage: 25 },
      { city: 'Delhi NCR', percentage: 20 },
      { city: 'Pune', percentage: 15 },
      { city: 'Chennai', percentage: 10 }
    ],
    platformFollowers: {
      youtube: 184000,
      instagram: 32000,
      linkedin: 45000
    }
  },
  portfolio: [],
  packages: [
    {
      id: 'pkg-vikram-1',
      title: 'Dedicated Course / EdTech Showcase',
      tagline: 'Deep-dive 8-12 min tutorial integrating your learning platform or software.',
      priceInINR: 9500,
      popular: true,
      platform: 'YouTube',
      deliveryDays: 7,
      includedRevisions: 2,
      publishingIncluded: true,
      organicUsageDays: 90,
      paidUsageRightsIncluded: false,
      deliverables: ['1x In-depth YouTube Video', 'Pinned Discount Link & Description Callout', 'Community Tab Post'],
      bestFor: 'EdTech platforms, coding bootcamps, and career tools'
    },
    {
      id: 'pkg-vikram-2',
      title: '60s Concept Short & Career Tip',
      tagline: 'High-retention bite-sized breakdown with brand mention.',
      priceInINR: 5000,
      platform: 'YouTube',
      deliveryDays: 4,
      includedRevisions: 1,
      publishingIncluded: true,
      organicUsageDays: 60,
      paidUsageRightsIncluded: false,
      deliverables: ['1x 60-second YouTube Short', 'Pinned Comment link'],
      bestFor: 'Student discount apps and productivity software'
    }
  ],
  addOns: [],
  reviews: [],
  overallRating: 5.0,
  totalReviews: 24,
  faqs: [],
  collaborationTerms: {
    paymentPolicy: 'Milestone escrow on Creatorly.',
    revisionPolicy: '1 round of script review, 1 round of video edit.',
    cancellationPolicy: 'Standard terms.',
    exclusivityNotice: 'Available upon request.'
  }
};

export const NEHA_SINGHAL_PROFILE: CreatorProfile = {
  id: 'creator-neha-singhal',
  username: 'neha-singhal',
  fullName: 'Neha Singhal',
  handle: '@nehafinance',
  avatarUrl: '/images/neha-singhal.jpg',
  coverPattern: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 50%, #A7F3D0 100%)',
  verifiedBadge: true,
  verificationSource: 'SEBI Research Analyst & Platform API Verified',
  primaryNiche: 'Finance & Economics',
  subNiches: ['Personal Finance', 'Stock Market', 'Mutual Funds', 'Budgeting & Taxes'],
  bio: 'Demystifying personal finance, stock market, and macroeconomics into simple, jargon-free 60s actionable guides.',
  location: {
    city: 'Mumbai',
    country: 'India',
    flagEmoji: '🇮🇳'
  },
  languages: ['English', 'Hindi'],
  socialLinks: [
    {
      platform: 'instagram',
      name: 'Instagram',
      handle: '@nehafinance',
      url: 'https://instagram.com',
      followers: 165000,
      verified: true
    },
    {
      platform: 'youtube',
      name: 'YouTube',
      handle: 'NehaSinghalMoney',
      url: 'https://youtube.com',
      followers: 88000,
      verified: true
    }
  ],
  availability: {
    status: 'available',
    label: 'Available for Campaigns',
    slotsRemaining: 2,
    totalSlots: 4,
    earliestDelivery: 'Within 4 business days',
    responseTime: '< 3 hours'
  },
  metrics: {
    totalAudience: 165000,
    averageViews: 48000,
    engagementRate: 5.8,
    targetMarketPercentage: 88,
    targetMarketCountry: 'India',
    lastUpdatedDaysAgo: 1,
    ageDistribution: [
      { label: '18-24', percentage: 22 },
      { label: '25-34', percentage: 58 },
      { label: '35-44', percentage: 16 },
      { label: '45+', percentage: 4 }
    ],
    genderDistribution: [
      { label: 'Male', percentage: 54 },
      { label: 'Female', percentage: 46 }
    ],
    topGeographies: [
      { country: 'India', code: 'IN', percentage: 88 },
      { country: 'United Arab Emirates', code: 'AE', percentage: 6 },
      { country: 'Others', code: 'OTHER', percentage: 6 }
    ],
    topCities: [
      { city: 'Mumbai', percentage: 38 },
      { city: 'Delhi NCR', percentage: 26 },
      { city: 'Bengaluru', percentage: 20 },
      { city: 'Pune', percentage: 10 },
      { city: 'Ahmedabad', percentage: 6 }
    ],
    platformFollowers: {
      instagram: 165000,
      youtube: 88000,
      linkedin: 24000
    }
  },
  portfolio: [],
  packages: [
    {
      id: 'pkg-neha-1',
      title: 'Finance Breakdown Reel',
      tagline: 'High-impact 60s educational reel demystifying your financial product or app.',
      priceInINR: 8000,
      popular: true,
      platform: 'Instagram',
      deliveryDays: 5,
      includedRevisions: 2,
      publishingIncluded: true,
      organicUsageDays: 60,
      paidUsageRightsIncluded: false,
      deliverables: ['1x 60s 4K Instagram Reel', '2x Story frames with direct signup sticker', 'Link in bio for 7 days'],
      bestFor: 'Fintech apps, mutual fund platforms, and banking services'
    }
  ],
  addOns: [],
  reviews: [],
  overallRating: 5.0,
  totalReviews: 31,
  faqs: [],
  collaborationTerms: {
    paymentPolicy: 'Creatorly escrow deposit prior to filming.',
    revisionPolicy: '1 round of compliance checks and script signoff.',
    cancellationPolicy: 'Standard terms.',
    exclusivityNotice: 'Fintech category exclusivity available.'
  }
};

export const KABIR_VARMA_PROFILE: CreatorProfile = {
  id: 'creator-kabir-varma',
  username: 'kabir-varma',
  fullName: 'Kabir Varma',
  handle: '@kabirstories',
  avatarUrl: '/images/kabir-varma.jpg',
  coverPattern: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #F59E0B 100%)',
  verifiedBadge: true,
  verificationSource: 'National Film Board & YouTube Creator API Verified',
  primaryNiche: 'Documentary',
  subNiches: ['Cinematic Video Essays', 'Cultural Deep-Dives', 'Behind the Scenes', 'Mini Docs'],
  bio: 'Crafting high-retention cinematic mini-documentaries and human stories that move audiences.',
  location: {
    city: 'New Delhi',
    country: 'India',
    flagEmoji: '🇮🇳'
  },
  languages: ['English', 'Hindi'],
  socialLinks: [
    {
      platform: 'youtube',
      name: 'YouTube',
      handle: 'KabirVarmaFilms',
      url: 'https://youtube.com',
      followers: 240000,
      verified: true
    },
    {
      platform: 'instagram',
      name: 'Instagram',
      handle: '@kabirstories',
      url: 'https://instagram.com',
      followers: 82000,
      verified: true
    }
  ],
  availability: {
    status: 'available',
    label: 'Available for Brand Films',
    slotsRemaining: 1,
    totalSlots: 3,
    earliestDelivery: 'Within 10 business days',
    responseTime: '< 4 hours'
  },
  metrics: {
    totalAudience: 240000,
    averageViews: 110000,
    engagementRate: 7.4,
    targetMarketPercentage: 79,
    targetMarketCountry: 'India',
    lastUpdatedDaysAgo: 2,
    ageDistribution: [
      { label: '18-24', percentage: 30 },
      { label: '25-34', percentage: 50 },
      { label: '35-44', percentage: 15 },
      { label: '45+', percentage: 5 }
    ],
    genderDistribution: [
      { label: 'Male', percentage: 58 },
      { label: 'Female', percentage: 42 }
    ],
    topGeographies: [
      { country: 'India', code: 'IN', percentage: 79 },
      { country: 'United States', code: 'US', percentage: 10 },
      { country: 'United Kingdom', code: 'GB', percentage: 6 },
      { country: 'Others', code: 'OTHER', percentage: 5 }
    ],
    topCities: [
      { city: 'Delhi NCR', percentage: 34 },
      { city: 'Mumbai', percentage: 28 },
      { city: 'Bengaluru', percentage: 18 },
      { city: 'Kolkata', percentage: 12 },
      { city: 'Chandigarh', percentage: 8 }
    ],
    platformFollowers: {
      youtube: 240000,
      instagram: 82000,
      linkedin: 8500
    }
  },
  portfolio: [],
  packages: [
    {
      id: 'pkg-kabir-1',
      title: 'Cinematic Brand Mini-Doc',
      tagline: 'Story-driven 5-8 minute documentary film weaving your founder or brand journey.',
      priceInINR: 16000,
      popular: true,
      platform: 'YouTube',
      deliveryDays: 10,
      includedRevisions: 2,
      publishingIncluded: true,
      organicUsageDays: 365,
      paidUsageRightsIncluded: true,
      deliverables: ['1x 4K Cinema Documentary Video', 'Social cut-down for Reels/Shorts', 'Permanent YouTube placement'],
      bestFor: 'Heritage brands, startup founder stories, and premium tech'
    }
  ],
  addOns: [],
  reviews: [],
  overallRating: 5.0,
  totalReviews: 22,
  faqs: [],
  collaborationTerms: {
    paymentPolicy: 'Creatorly milestone escrow.',
    revisionPolicy: 'Concept signoff + 2 editorial passes.',
    cancellationPolicy: 'Standard terms.',
    exclusivityNotice: 'Full exclusivity available for campaign window.'
  }
};

export const RIYA_KAPOOR_PROFILE: CreatorProfile = {
  id: 'creator-riya-kapoor',
  username: 'riya-kapoor',
  fullName: 'Riya Kapoor',
  handle: '@riyaviral',
  avatarUrl: '/images/riya-kapoor.jpg',
  coverPattern: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 50%, #FBCFE8 100%)',
  verifiedBadge: true,
  verificationSource: 'Instagram & Meta Graph API Verified',
  primaryNiche: 'Reels & Shorts',
  subNiches: ['Viral 60s Reels', 'Gen-Z Trends', 'Short-form UGC', 'High-Retention Audio'],
  bio: 'Specialist in vertical short-form content. 4.2M+ monthly views with high-retention visual hooks and fast pacing.',
  location: {
    city: 'Mumbai',
    country: 'India',
    flagEmoji: '🇮🇳'
  },
  languages: ['English', 'Hindi'],
  socialLinks: [
    {
      platform: 'instagram',
      name: 'Instagram',
      handle: '@riyaviral',
      url: 'https://instagram.com',
      followers: 245000,
      verified: true
    },
    {
      platform: 'youtube',
      name: 'YouTube Shorts',
      handle: 'RiyaViralShorts',
      url: 'https://youtube.com',
      followers: 120000,
      verified: true
    }
  ],
  availability: {
    status: 'available',
    label: 'Open for Viral Collaborations',
    slotsRemaining: 4,
    totalSlots: 6,
    earliestDelivery: 'Within 3 business days',
    responseTime: '< 1 hour'
  },
  metrics: {
    totalAudience: 365000,
    averageViews: 85000,
    engagementRate: 7.9,
    targetMarketPercentage: 86,
    targetMarketCountry: 'India',
    lastUpdatedDaysAgo: 1,
    ageDistribution: [
      { label: '18-24', percentage: 62 },
      { label: '25-34', percentage: 32 },
      { label: '35-44', percentage: 4 },
      { label: '45+', percentage: 2 }
    ],
    genderDistribution: [
      { label: 'Female', percentage: 56 },
      { label: 'Male', percentage: 44 }
    ],
    topGeographies: [
      { country: 'India', code: 'IN', percentage: 86 },
      { country: 'United Arab Emirates', code: 'AE', percentage: 5 },
      { country: 'Others', code: 'OTHER', percentage: 9 }
    ],
    topCities: [
      { city: 'Mumbai', percentage: 35 },
      { city: 'Delhi NCR', percentage: 28 },
      { city: 'Bengaluru', percentage: 18 },
      { city: 'Pune', percentage: 11 },
      { city: 'Jaipur', percentage: 8 }
    ],
    platformFollowers: {
      instagram: 245000,
      youtube: 120000,
      linkedin: 3200
    }
  },
  portfolio: [],
  packages: [
    {
      id: 'pkg-riya-1',
      title: 'Viral 60s Reel / Short',
      tagline: 'High-energy hook-driven vertical video engineered for maximum organic reach.',
      priceInINR: 6500,
      popular: true,
      platform: 'Instagram',
      deliveryDays: 3,
      includedRevisions: 2,
      publishingIncluded: true,
      organicUsageDays: 60,
      paidUsageRightsIncluded: false,
      deliverables: ['1x 60s High-Retention Vertical Reel', 'Trending Audio Integration', 'Story Share with Link Sticker'],
      bestFor: 'Direct-to-consumer brands, youth fashion, apps, and beverages'
    }
  ],
  addOns: [],
  reviews: [],
  overallRating: 5.0,
  totalReviews: 38,
  faqs: [],
  collaborationTerms: {
    paymentPolicy: 'Creatorly escrow deposit prior to filming.',
    revisionPolicy: '1 round of concept feedback, 1 round of edit tweaks.',
    cancellationPolicy: 'Standard terms.',
    exclusivityNotice: '7-day category exclusivity included.'
  }
};

export const ALL_CREATORS: CreatorProfile[] = [
  ALEX_SHARMA_PROFILE,
  VIKRAM_SEN_PROFILE,
  NEHA_SINGHAL_PROFILE,
  RIYA_KAPOOR_PROFILE,
  KABIR_VARMA_PROFILE,
  PRIYA_PATEL_PROFILE,
  ROHIT_VERMA_PROFILE,
  ANANYA_ROY_PROFILE,
  JUN_PARK_PROFILE,
  AAROHI_MEHTA_PROFILE,
  MAYA_JAMES_PROFILE
];

export const INITIAL_COLLABORATION_REQUESTS: CollaborationRequest[] = [
  {
    id: 'REQ-101',
    creatorId: 'creator-priya-patel',
    creatorName: 'Priya Patel',
    creatorAvatar: '/images/priya-patel.jpg',
    creatorHandle: '@priyastyles',
    brandName: 'UrbanThreads Clothing',
    brandContactPerson: 'Kavita Menon',
    brandEmail: 'kavita@urbanthreads.in',
    companyWebsite: 'https://urbanthreads.in',
    serviceTitle: 'Instagram Fashion Reel',
    packageId: 'pkg-priya-reel',
    budgetINR: 8500,
    proposedDeadline: '2026-10-28',
    campaignObjective: 'Promote our autumn affordable casual wear collection to college students and young professionals.',
    campaignBrief: 'We want 1 high-energy styling reel showing 3 everyday budget outfits (under ₹1,500 each) using our newly launched denim jackets and casual trousers. Include trackable coupon code "PRIYA20" in caption and pinned comment.',
    deliverables: [
      '1 45-60s 4K vertical styling reel',
      'Collaborator tag + pinned discount code',
      '2 Instagram stories with direct swipe/sticker link'
    ],
    status: 'new',
    submittedAt: 'Today, 2:15 PM',
    pipelineStage: 'proposal',
    escrowStatus: 'unfunded',
    escrowAmountINR: 8500,
    timelineEvents: [
      {
        id: 'ev-1',
        timestamp: 'Today, 2:15 PM',
        actor: 'brand',
        action: 'Booking Request Submitted',
        details: 'UrbanThreads submitted campaign brief for ₹8,500 with target delivery Oct 28.'
      }
    ]
  },
  {
    id: 'REQ-102',
    creatorId: 'cr_alex_sharma',
    creatorName: 'Alex Sharma',
    creatorAvatar: '/images/alex-sharma.jpg',
    creatorHandle: '@alexbuilds',
    brandName: 'SuperAI Labs',
    brandContactPerson: 'Vikram Mehta',
    brandEmail: 'partnerships@superailabs.io',
    companyWebsite: 'https://superailabs.io',
    serviceTitle: 'YouTube Brand Integration',
    packageId: 'pkg-yt-integration',
    budgetINR: 10000,
    proposedDeadline: '2026-11-05',
    campaignObjective: 'Feature our new developer AI coding assistant in an educational tutorial.',
    campaignBrief: 'Looking for a 60-90 second mid-roll segment demonstrating how our autocomplete tool speeds up TypeScript development. We need a trackable signup link in the description and pinned comment.',
    deliverables: [
      '60-90s dedicated integration in main YouTube video',
      'Pinned comment with trackable referral link',
      'Permanent hosting with lifetime link'
    ],
    status: 'in_discussion',
    submittedAt: 'Yesterday, 4:30 PM',
    counterOfferINR: 10500,
    counterOfferNotes: 'Happy to do this! Can include 48-hour rush delivery so your launch coincides with Product Hunt week.',
    pipelineStage: 'proposal',
    escrowStatus: 'unfunded',
    escrowAmountINR: 10500,
    timelineEvents: [
      {
        id: 'ev-2a',
        timestamp: 'Yesterday, 4:30 PM',
        actor: 'brand',
        action: 'Booking Request Submitted',
        details: 'Initial offer ₹10,000 for YouTube integration.'
      },
      {
        id: 'ev-2b',
        timestamp: 'Yesterday, 6:00 PM',
        actor: 'creator',
        action: 'Custom Counter-Quote Proposed',
        details: 'Alex proposed revised budget of ₹10,500 with 48-hour rush delivery guarantee.'
      }
    ]
  },
  {
    id: 'REQ-103',
    creatorId: 'creator-rohit-verma',
    creatorName: 'Rohit Verma',
    creatorAvatar: '/images/rohit-verma.jpg',
    creatorHandle: '@rohitfit',
    brandName: 'Apex Protein',
    brandContactPerson: 'Vikram Seth',
    brandEmail: 'marketing@apexprotein.com',
    companyWebsite: 'https://apexprotein.com',
    serviceTitle: 'Fitness & Athletic UGC Ad Video',
    packageId: 'pkg-rohit-ugc',
    budgetINR: 4000,
    proposedDeadline: '2026-10-31',
    campaignObjective: 'Create authentic gym-floor UGC ads for Meta ad campaigns.',
    campaignBrief: 'Need 1 30-45s vertical video showing Rohit drinking our Isolate Whey post-workout. Authentic gym footage with clean hook: "Stop drinking chalky protein".',
    deliverables: [
      '30-45s edited 4K vertical UGC video',
      '2 hook variations',
      '90-day paid ad usage license'
    ],
    status: 'accepted',
    submittedAt: '2 days ago',
    creatorNotes: 'Brief approved. Filming scheduled for Thursday at Bengaluru Fitness Hub.',
    pipelineStage: 'script_signoff',
    escrowStatus: 'held',
    escrowAmountINR: 4000,
    scriptOutline: {
      title: 'Stop Drinking Chalky Protein',
      hook: 'You work hard in the gym—why punish your tastebuds with clumpy protein powder?',
      talkingPoints: [
        'Demonstrate 5-second instant dissolve in cold water with clear shaker',
        'Highlight 26g pure isolate whey with zero stomach bloat',
        'Direct callout to fitness enthusiasts wanting clean macros'
      ],
      callToAction: 'Tap the link below to get 15% off + free shaker bottle using code ROHITFIT.',
      status: 'submitted'
    },
    timelineEvents: [
      {
        id: 'ev-3a',
        timestamp: '3 days ago',
        actor: 'brand',
        action: 'Booking Request Submitted',
        details: 'Brief submitted for UGC fitness ad creative.'
      },
      {
        id: 'ev-3b',
        timestamp: '2 days ago',
        actor: 'creator',
        action: 'Terms Accepted',
        details: 'Rohit confirmed production schedule and deliverables.'
      },
      {
        id: 'ev-3c',
        timestamp: '2 days ago',
        actor: 'brand',
        action: 'Escrow Deposited (₹4,000)',
        details: 'Apex Protein deposited ₹4,000 securely into Creatorly Escrow Vault.'
      },
      {
        id: 'ev-3d',
        timestamp: 'Yesterday, 11:30 AM',
        actor: 'creator',
        action: 'Script Outline Submitted',
        details: 'Rohit submitted concept outline and hook points for brand signoff.'
      }
    ]
  },
  {
    id: 'REQ-105',
    creatorId: 'cr_alex_sharma',
    creatorName: 'Alex Sharma',
    creatorAvatar: '/images/alex-sharma.jpg',
    creatorHandle: '@alexbuilds',
    brandName: 'CyberShield VPN',
    brandContactPerson: 'Daniel Craig',
    brandEmail: 'marketing@cybershield.io',
    companyWebsite: 'https://cybershield.io',
    serviceTitle: 'Dedicated Security Deep Dive',
    packageId: 'pkg-alex-deep-dive',
    budgetINR: 12000,
    proposedDeadline: '2026-10-30',
    campaignObjective: 'Sponsor an educational breakdown explaining DNS leaks and public WiFi vulnerabilities.',
    campaignBrief: 'Full 90-second integration testing public network vulnerabilities with our VPN active. Highlight WireGuard speed and zero-logging policy.',
    deliverables: [
      '90s Dedicated Mid-roll integration',
      'PIN link in YouTube comment',
      'Permanent description link + 60-day social repost rights'
    ],
    status: 'in_progress',
    submittedAt: '5 days ago',
    pipelineStage: 'draft_review',
    escrowStatus: 'held',
    escrowAmountINR: 12000,
    scriptOutline: {
      title: 'Testing Public WiFi in a Mumbai Cafe',
      hook: 'Here is what hackers actually see when you connect to airport or coffee shop WiFi without encryption.',
      talkingPoints: [
        'Live Packet capture demonstration showing unencrypted traffic',
        'One-click CyberShield connection with WireGuard benchmark',
        'Clean comparison showing zero speed loss on Indian ISPs'
      ],
      callToAction: 'Protect your laptop today with 70% off CyberShield using alexbuilds link.',
      status: 'approved',
      feedbackNotes: 'Outline looks razor sharp. Approved for filming!'
    },
    videoDraft: {
      draftUrl: 'https://vimeo.com/unlisted/cybershield-alex-draft-v1',
      version: 1,
      status: 'submitted',
      revisionNotes: '4K 60fps cut ready for brand compliance check. Screen recording shows WireGuard handshake in under 1.2s. Color graded and master audio normal.',
      submittedAt: 'Today, 9:00 AM'
    },
    timelineEvents: [
      {
        id: 'ev-5a',
        timestamp: '5 days ago',
        actor: 'brand',
        action: 'Campaign Booked',
        details: 'CyberShield booked Dedicated Security Integration.'
      },
      {
        id: 'ev-5b',
        timestamp: '4 days ago',
        actor: 'brand',
        action: 'Escrow Deposited (₹12,000)',
        details: 'Funds locked safely in Creatorly Escrow.'
      },
      {
        id: 'ev-5c',
        timestamp: '3 days ago',
        actor: 'brand',
        action: 'Script Outline Approved',
        details: 'CyberShield signed off on script. Filming commenced.'
      },
      {
        id: 'ev-5d',
        timestamp: 'Today, 9:00 AM',
        actor: 'creator',
        action: '4K Video Draft Uploaded (v1)',
        details: 'Alex uploaded unlisted draft link for brand final review.'
      }
    ]
  },
  {
    id: 'REQ-104',
    creatorId: 'creator-ananya-roy',
    creatorName: 'Ananya Roy',
    creatorAvatar: '/images/ananya-roy.jpg',
    creatorHandle: '@ananyabites',
    brandName: 'The Roast Kitchen',
    brandContactPerson: 'Ayesha Merchant',
    brandEmail: 'hello@theroastkitchen.in',
    companyWebsite: 'https://theroastkitchen.in',
    serviceTitle: 'Instagram Cafe Spotlight Reel',
    packageId: 'pkg-ananya-reel',
    budgetINR: 5500,
    proposedDeadline: '2026-10-15',
    campaignObjective: 'Weekend brunch launch announcement for Bandra cafe.',
    campaignBrief: 'Aesthetic walkthrough of sourdough bakery and artisanal coffee bar with reservation sticker.',
    deliverables: [
      '60s Reel with culinary audio',
      'Location tag & reservation sticker'
    ],
    status: 'completed',
    submittedAt: 'Last week',
    pipelineStage: 'live_completed',
    escrowStatus: 'released',
    escrowAmountINR: 5500,
    publishedDeliverable: {
      liveUrl: 'https://instagram.com/reel/C89xYzTheRoastKitchen',
      platform: 'Instagram Reels',
      publishedAt: 'Oct 14, 2026',
      views: 48200
    },
    brandReview: {
      rating: 5,
      reviewText: 'Ananya was exceptional to work with! The reel was beautifully edited, matched our vibe completely, and we drove over 320 direct table reservations on our opening weekend.',
      submittedAt: 'Oct 15, 2026'
    },
    timelineEvents: [
      {
        id: 'ev-4a',
        timestamp: 'Oct 8, 2026',
        actor: 'brand',
        action: 'Campaign Booked',
        details: 'Cafe Spotlight reel requested.'
      },
      {
        id: 'ev-4b',
        timestamp: 'Oct 9, 2026',
        actor: 'brand',
        action: 'Escrow Deposited (₹5,500)',
        details: 'Payment deposited into Creatorly Escrow.'
      },
      {
        id: 'ev-4c',
        timestamp: 'Oct 12, 2026',
        actor: 'brand',
        action: 'Video Draft Approved',
        details: 'Draft approved without revisions.'
      },
      {
        id: 'ev-4d',
        timestamp: 'Oct 14, 2026',
        actor: 'creator',
        action: 'Content Published Live',
        details: 'Reel went live on @ananyabites with location sticker.'
      },
      {
        id: 'ev-4e',
        timestamp: 'Oct 15, 2026',
        actor: 'brand',
        action: 'Escrow Released & 5-Star Review Written',
        details: '₹5,500 released from escrow to Ananya. 5-star verified review posted.'
      }
    ]
  }
];
