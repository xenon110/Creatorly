-- =========================================================================
-- CREATORLY SUPABASE FULL DYNAMIC DATABASE MIGRATION SCRIPT
-- Project: https://fcglksvcqmymjyqoyrtw.supabase.co
-- Generated automatically: Turnkey execution in Supabase SQL Editor
-- Instructions: Copy and run this entire file in Supabase SQL Editor
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. DROP EXISTING CONSTRAINTS / POLICIES IF RE-RUNNING
DROP TABLE IF EXISTS public.creators CASCADE;
DROP TABLE IF EXISTS public.collaboration_requests CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.campaigns CASCADE;
DROP TABLE IF EXISTS public.agency_leads CASCADE;
DROP TABLE IF EXISTS public.support_tickets CASCADE;

-- 2. CREATE CREATORS TABLE
CREATE TABLE public.creators (
  id TEXT PRIMARY KEY,
  username TEXT,
  full_name TEXT NOT NULL,
  handle TEXT NOT NULL,
  avatar_url TEXT,
  cover_pattern TEXT,
  verified_badge BOOLEAN DEFAULT TRUE,
  verification_source TEXT,
  reputation_tier TEXT DEFAULT 'verified',
  primary_niche TEXT NOT NULL,
  sub_niches JSONB DEFAULT '[]'::jsonb,
  bio TEXT,
  location JSONB DEFAULT '{"city": "Mumbai", "country": "India"}'::jsonb,
  languages JSONB DEFAULT '[]'::jsonb,
  social_links JSONB DEFAULT '[]'::jsonb,
  availability JSONB DEFAULT '{}'::jsonb,
  metrics JSONB DEFAULT '{}'::jsonb,
  portfolio JSONB DEFAULT '[]'::jsonb,
  packages JSONB DEFAULT '[]'::jsonb,
  reviews JSONB DEFAULT '[]'::jsonb,
  faq JSONB DEFAULT '[]'::jsonb,
  overall_rating NUMERIC DEFAULT 5.0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CREATE COLLABORATION REQUESTS TABLE (WORKFLOW PIPELINE)
CREATE TABLE public.collaboration_requests (
  id TEXT PRIMARY KEY,
  creator_id TEXT NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  creator_name TEXT,
  creator_avatar TEXT,
  creator_handle TEXT,
  brand_name TEXT NOT NULL,
  brand_contact_person TEXT,
  brand_email TEXT,
  company_website TEXT,
  service_title TEXT,
  package_id TEXT,
  budget_inr NUMERIC DEFAULT 0,
  proposed_deadline TEXT,
  campaign_objective TEXT,
  campaign_brief TEXT,
  deliverables JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'new',
  pipeline_stage TEXT DEFAULT 'proposal',
  escrow_status TEXT DEFAULT 'unfunded',
  escrow_amount_inr NUMERIC DEFAULT 0,
  counter_offer_inr NUMERIC,
  counter_offer_notes TEXT,
  creator_notes TEXT,
  script_data JSONB,
  draft_submission JSONB,
  live_link TEXT,
  brand_review JSONB,
  timeline_events JSONB DEFAULT '[]'::jsonb,
  submitted_at TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CREATE USERS TABLE
CREATE TABLE public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('creator', 'brand')),
  company_name TEXT,
  handle TEXT,
  niche TEXT,
  avatar_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CREATE CAMPAIGNS TABLE (FOR BRAND CAMPAIGN BUILDER)
CREATE TABLE public.campaigns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  objective TEXT,
  status TEXT DEFAULT 'Active',
  start_date TEXT,
  end_date TEXT,
  total_budget_inr NUMERIC DEFAULT 0,
  spent_budget_inr NUMERIC DEFAULT 0,
  creator_ids JSONB DEFAULT '[]'::jsonb,
  milestones JSONB DEFAULT '[]'::jsonb,
  deliverables_count INTEGER DEFAULT 0,
  completed_deliverables_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CREATE AGENCY LEADS TABLE
CREATE TABLE public.agency_leads (
  id TEXT PRIMARY KEY,
  agency_name TEXT NOT NULL,
  agency_email TEXT NOT NULL,
  spend_target TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CREATE SUPPORT TICKETS TABLE
CREATE TABLE public.support_tickets (
  id TEXT PRIMARY KEY,
  user_info TEXT NOT NULL,
  topic TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- 9. OPEN PERMISSIVE POLICIES FOR FRONTEND (ANON KEY ACCESS)
CREATE POLICY "Allow public read creators" ON public.creators FOR SELECT USING (true);
CREATE POLICY "Allow public insert creators" ON public.creators FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update creators" ON public.creators FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete creators" ON public.creators FOR DELETE USING (true);

CREATE POLICY "Allow public read collab_requests" ON public.collaboration_requests FOR SELECT USING (true);
CREATE POLICY "Allow public insert collab_requests" ON public.collaboration_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update collab_requests" ON public.collaboration_requests FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete collab_requests" ON public.collaboration_requests FOR DELETE USING (true);

CREATE POLICY "Allow public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public insert users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update users" ON public.users FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read campaigns" ON public.campaigns FOR SELECT USING (true);
CREATE POLICY "Allow public insert campaigns" ON public.campaigns FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update campaigns" ON public.campaigns FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete campaigns" ON public.campaigns FOR DELETE USING (true);

CREATE POLICY "Allow public read agency_leads" ON public.agency_leads FOR SELECT USING (true);
CREATE POLICY "Allow public insert agency_leads" ON public.agency_leads FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read support_tickets" ON public.support_tickets FOR SELECT USING (true);
CREATE POLICY "Allow public insert support_tickets" ON public.support_tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update support_tickets" ON public.support_tickets FOR UPDATE USING (true) WITH CHECK (true);

-- 10. REALTIME PUBLICATION CONFIGURATION
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'collaboration_requests'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.collaboration_requests;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'creators'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.creators;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;

-- 11. INDEXES FOR HIGH-CONCURRENCY LOOKUPS
CREATE INDEX idx_creators_niche ON public.creators(primary_niche);
CREATE INDEX idx_creators_handle ON public.creators(handle);
CREATE INDEX idx_collab_creator ON public.collaboration_requests(creator_id);
CREATE INDEX idx_collab_status ON public.collaboration_requests(status);
CREATE INDEX idx_collab_stage ON public.collaboration_requests(pipeline_stage);

-- =========================================================================
-- 9. SEED ALL 11 VERIFIED CREATORS
-- =========================================================================

INSERT INTO public.creators (
  id, username, full_name, handle, avatar_url, cover_pattern,
  verified_badge, verification_source, reputation_tier, primary_niche,
  sub_niches, bio, location, languages, social_links, availability,
  metrics, portfolio, packages, reviews, faq, overall_rating, total_reviews
) VALUES (
  'cr_alex_sharma',
  'alex-sharma',
  'Alex Sharma',
  '@alexbuilds',
  '/images/alex-sharma.jpg',
  '',
  TRUE,
  'Government ID & Platform OAuth (Meta & Google API sync)',
  'elite',
  'Tech & Education',
  '["AI Developer Tools","Productivity Software","Consumer Tech & Desk Setup","Tech Careers"]'::jsonb,
  'Making technology feel less like tech support. Honest reviews, useful tutorials, and big ideas made simple.',
  '{"city":"Mumbai","country":"India","flagEmoji":"🇮🇳"}'::jsonb,
  '["English","Hindi"]'::jsonb,
  '[{"platform":"instagram","name":"Instagram","handle":"@alex.builds","url":"https://instagram.com","followers":28000,"verified":true},{"platform":"youtube","name":"YouTube","handle":"@alexbuilds","url":"https://youtube.com","followers":52000,"verified":true},{"platform":"linkedin","name":"LinkedIn","handle":"alexsharma-tech","url":"https://linkedin.com","followers":5000,"verified":true}]'::jsonb,
  '{"status":"available","label":"Available for collaborations","slotsRemaining":3,"totalSlots":5,"earliestDelivery":"Oct 24, 2026","responseTime":"< 4 hours"}'::jsonb,
  '{"totalAudience":85000,"averageViews":22000,"engagementRate":4.8,"targetMarketPercentage":62,"targetMarketCountry":"India","lastUpdatedDaysAgo":3,"ageDistribution":[{"label":"18–24","percentage":38},{"label":"25–34","percentage":46},{"label":"35–44","percentage":12},{"label":"45+","percentage":4}],"genderDistribution":[{"label":"Male","percentage":64},{"label":"Female","percentage":36}],"topGeographies":[{"country":"India","code":"IN","percentage":62},{"country":"United States","code":"US","percentage":18},{"country":"United Kingdom","code":"GB","percentage":8},{"country":"Canada & Others","code":"CA","percentage":12}],"topCities":[{"city":"Mumbai","percentage":24},{"city":"Bengaluru","percentage":19},{"city":"Delhi NCR","percentage":15},{"city":"Pune","percentage":8},{"city":"Hyderabad","percentage":6}],"platformFollowers":{"youtube":52000,"instagram":28000,"linkedin":5000}}'::jsonb,
  '[{"id":"work-1","title":"Best AI Tools for Students & Developers (2026 Edition)","category":"Education & AI Tools","format":"YouTube Integration","platform":"youtube","thumbnailUrl":"/images/work-ai-tools.jpg","publishedDate":"Sep 28, 2026","views":48200,"engagement":8.4,"brandClient":"NextLearn AI","campaignObjective":"Drive qualified signups for AI code learning platform","deliverableSummary":"60-second integrated sponsorship segment with live product demonstration and dedicated discount code in description.","clientQuote":"Alex delivered one of our highest-converting YouTube integrations of Q3. His audience genuinely trusted the workflow demo.","clientAuthor":"Neha Mehta, Growth Lead at NextLearn","originalUrl":"https://youtube.com","verifiedMetrics":true},{"id":"work-2","title":"Three Minimal Tech Gadgets Actually Worth Buying","category":"Consumer Tech","format":"Sponsored Reel","platform":"instagram","thumbnailUrl":"/images/work-gadgets.jpg","publishedDate":"Oct 04, 2026","views":34500,"engagement":5.2,"brandClient":"MinimalGear","campaignObjective":"Showcase wireless mechanical keyboard & productivity accessories","deliverableSummary":"High-aesthetic 4K reel with macro product b-roll, honest build review, and link in bio sticker.","clientQuote":"Aesthetic production quality was top tier. The reel reached 34K+ views organically and drove 310 product page visits.","clientAuthor":"Rohan Sethi, Brand Marketing at MinimalGear","originalUrl":"https://instagram.com","verifiedMetrics":true},{"id":"work-3","title":"Building an AI Coding Assistant in 10 Minutes","category":"Tutorial & Dev Tools","format":"Dedicated Tech Review","platform":"youtube","thumbnailUrl":"/images/work-ai-coding.jpg","publishedDate":"Sep 12, 2026","views":29100,"engagement":7.1,"brandClient":"DevToolbox Cloud","campaignObjective":"Demonstrate developer SDK and API integration simplicity","deliverableSummary":"Full dedicated tutorial with code repository on GitHub, walkthrough of the API dashboard, and permanent pinned comment.","clientQuote":"Alex has a rare ability to explain developer infrastructure without making it dry. Excellent technical depth.","clientAuthor":"Vikram Joshi, Developer Relations at DevToolbox","originalUrl":"https://youtube.com","verifiedMetrics":true},{"id":"work-4","title":"FocusFlow App: Hands-on Mobile Productivity Walkthrough","category":"Software & Apps","format":"UGC Ad Creative","platform":"instagram","thumbnailUrl":"/images/work-ugc-demo.jpg","publishedDate":"Aug 22, 2026","views":85000,"engagement":4.1,"brandClient":"FocusFlow Systems","campaignObjective":"Create authentic creator UGC hook for Meta Paid Acquisition","deliverableSummary":"Two 30-second vertical creative hooks delivered in 4K format with captions and background audio split.","clientQuote":"His UGC creative dropped our Meta customer acquisition cost by 28% compared to standard agency video ads.","clientAuthor":"Kavita Rao, Head of Performance Marketing","originalUrl":"https://instagram.com","verifiedMetrics":true}]'::jsonb,
  '[{"id":"pkg-insta-reel","title":"Instagram Sponsored Reel","tagline":"High-energy vertical video published directly to @alexbuilds","priceInINR":5000,"platform":"Instagram","deliveryDays":7,"includedRevisions":1,"publishingIncluded":true,"publishingDestination":"Posted on @alexbuilds Instagram (28K followers)","organicUsageDays":30,"paidUsageRightsIncluded":false,"paidUsageOptionDays":30,"deliverables":["1x Sponsored 60-second 4K Instagram Reel","Publication on @alexbuilds main feed","1x Instagram Story repost with custom trackable link sticker","1 revision round included (script outline + edit)","30-day organic brand resharing rights on your official channels","Analytics performance screenshot shared at day 7 and day 30"],"notIncluded":["Paid advertising whitelist / Meta Spark code (available as add-on)","Uncut raw footage files (available as add-on)"],"bestFor":"Brand awareness, mobile app launches, and engaging student/developer tech audiences in India and Southeast Asia."},{"id":"pkg-yt-integration","title":"YouTube Brand Integration","tagline":"In-depth 60–90 second brand segment inside an educational long-form video","priceInINR":8000,"popular":true,"platform":"YouTube","deliveryDays":10,"includedRevisions":1,"publishingIncluded":true,"publishingDestination":"Integrated in long-form video on YouTube (52K subscribers)","organicUsageDays":365,"paidUsageRightsIncluded":false,"paidUsageOptionDays":90,"deliverables":["1x 60–90 second dedicated brand segment inside long-form video","Agreed clear Call-to-Action (CTA) with verbal mention","Permanent video hosting on YouTube (video remains forever)","Pinned comment with trackable referral link & coupon code","First link in YouTube description box above the fold","1 revision round before final YouTube upload","Complete YouTube Studio performance report at 14 days"],"notIncluded":["Full dedicated 10-minute branded video (contact for custom quote)","Competitor brand exclusivity beyond 30 days"],"bestFor":"SaaS products, AI developer tools, and higher-ticket tech products where detailed workflow proof drives conversions."},{"id":"pkg-ugc-video","title":"UGC Video for Brand Ads","tagline":"Authentic creator-style video creative crafted specifically for your paid ad campaigns","priceInINR":3000,"platform":"Brand Ad Channels","deliveryDays":5,"includedRevisions":1,"publishingIncluded":false,"publishingDestination":"Delivered directly to brand via Drive/Dropbox (Not posted on creator profile)","organicUsageDays":0,"paidUsageRightsIncluded":true,"paidUsageOptionDays":90,"deliverables":["1x 30–45 second vertical video ad (9:16 aspect ratio, 4K resolution)","Includes 2 hook variations (first 3 seconds test)","Optimized for Meta Ads, TikTok Ads, YouTube Shorts ads","Full 90-day paid advertising commercial license included","Dynamic on-screen captions & royalty-free audio mix","Delivery of final master MP4 file within 5 business days"],"notIncluded":["Publication on creator personal social handles (this is a UGC creative service)","Source project editing files (raw clips available as add-on)"],"bestFor":"Growth marketers and DTC tech brands seeking authentic ad creatives that look organic and achieve lower CPMs."},{"id":"pkg-multi-spotlight","title":"Multi-Platform Tech Spotlight","tagline":"Omnichannel campaign coverage across YouTube, Instagram, and LinkedIn","priceInINR":12000,"platform":"Multi-Platform","deliveryDays":12,"includedRevisions":2,"publishingIncluded":true,"publishingDestination":"Published across YouTube (52K), Instagram (28K), and LinkedIn (5K)","organicUsageDays":365,"paidUsageRightsIncluded":false,"paidUsageOptionDays":90,"deliverables":["1x Dedicated YouTube brand integration (60-90s) with pinned link","1x High-engagement Instagram Reel with brand tag & link sticker","1x LinkedIn thought-leadership post analyzing your product workflow","2 revision rounds included","Link in Alex bio for 14 calendar days","30-day competitor category exclusivity","Consolidated cross-platform campaign analytics dashboard"],"notIncluded":["In-person event appearances (contact for custom speaking quote)"],"bestFor":"Major product launches, Series A funding announcements, or brands entering the Indian developer and creator ecosystem."}]'::jsonb,
  '[{"id":"rev-1","brandName":"NextLearn AI","brandLogo":"NL","reviewerName":"Neha Mehta","reviewerRole":"Growth Marketing Lead","campaignType":"YouTube Brand Integration","rating":5,"date":"Sep 30, 2026","content":"Alex was exceptionally professional to work with. He thoroughly tested our AI platform before writing the script, which made his video feel genuine and informative rather than a generic sponsorship. Our referral link generated over 1,400 signups within 10 days.","metricHighlight":"1,400+ signups with 3.8% CTR","verifiedTransaction":true},{"id":"rev-2","brandName":"MinimalGear","brandLogo":"MG","reviewerName":"Rohan Sethi","reviewerRole":"Brand Marketing Manager","campaignType":"Instagram Sponsored Reel","rating":5,"date":"Oct 06, 2026","content":"The production quality on the reel was superb — crisp 4K macro shots of the keyboard and very clean audio. Alex delivered the draft 2 days before the deadline and accommodated our minor caption tweak immediately. Will definitely rebook for our next launch.","metricHighlight":"34.5K views & 310 website clicks","verifiedTransaction":true},{"id":"rev-3","brandName":"DevToolbox Cloud","brandLogo":"DT","reviewerName":"Vikram Joshi","reviewerRole":"Head of Developer Relations","campaignType":"Dedicated Tech Review","rating":5,"date":"Sep 15, 2026","content":"Finding creators who can actually write code and demonstrate APIs cleanly is rare. Alex built a live sample project that our developers still reference in community channels. Great communication throughout the escrow process on Creatorly.","metricHighlight":"29K+ targeted dev views","verifiedTransaction":true},{"id":"rev-4","brandName":"FocusFlow Systems","brandLogo":"FF","reviewerName":"Kavita Rao","reviewerRole":"Performance Marketing Director","campaignType":"UGC Video Ad Creative","rating":4.8,"date":"Aug 25, 2026","content":"We hired Alex for 2 UGC ad hooks to test on Meta. His natural delivery and authentic desk setting outperformed our studio-shot agency ads by almost 30%. Smooth delivery and clear licensing rights.","metricHighlight":"28% lower CAC on Meta Ads","verifiedTransaction":true}]'::jsonb,
  '[]'::jsonb,
  4.9,
  18
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  handle = EXCLUDED.handle,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  primary_niche = EXCLUDED.primary_niche,
  sub_niches = EXCLUDED.sub_niches,
  packages = EXCLUDED.packages,
  portfolio = EXCLUDED.portfolio,
  reviews = EXCLUDED.reviews,
  metrics = EXCLUDED.metrics,
  availability = EXCLUDED.availability,
  updated_at = NOW();

INSERT INTO public.creators (
  id, username, full_name, handle, avatar_url, cover_pattern,
  verified_badge, verification_source, reputation_tier, primary_niche,
  sub_niches, bio, location, languages, social_links, availability,
  metrics, portfolio, packages, reviews, faq, overall_rating, total_reviews
) VALUES (
  'creator-vikram-sen',
  'vikram-sen',
  'Prof. Vikram Sen',
  '@vikramlearns',
  '/images/vikram-sen.jpg',
  'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #BFDBFE 100%)',
  TRUE,
  'Academic & YouTube Partner API Verified',
  'elite',
  'Education',
  '["AI & Coding","Career Growth","STEM Education","Tech Tutorials"]'::jsonb,
  'Simplifying computer science, AI, and modern career skills for 180k+ students and professionals across India.',
  '{"city":"Hyderabad","country":"India","flagEmoji":"🇮🇳"}'::jsonb,
  '["English","Hindi","Telugu"]'::jsonb,
  '[{"platform":"youtube","name":"YouTube","handle":"VikramSenEdu","url":"https://youtube.com","followers":184000,"verified":true},{"platform":"linkedin","name":"LinkedIn","handle":"prof-vikram-sen","url":"https://linkedin.com","followers":45000,"verified":true}]'::jsonb,
  '{"status":"available","label":"Available for Sponsorships","slotsRemaining":3,"totalSlots":5,"earliestDelivery":"Within 5 business days","responseTime":"< 2 hours"}'::jsonb,
  '{"totalAudience":184000,"averageViews":52000,"engagementRate":6.2,"targetMarketPercentage":84,"targetMarketCountry":"India","lastUpdatedDaysAgo":1,"ageDistribution":[{"label":"18-24","percentage":56},{"label":"25-34","percentage":36},{"label":"35-44","percentage":6},{"label":"45+","percentage":2}],"genderDistribution":[{"label":"Male","percentage":65},{"label":"Female","percentage":35}],"topGeographies":[{"country":"India","code":"IN","percentage":84},{"country":"United States","code":"US","percentage":7},{"country":"Others","code":"OTHER","percentage":9}],"topCities":[{"city":"Bengaluru","percentage":30},{"city":"Hyderabad","percentage":25},{"city":"Delhi NCR","percentage":20},{"city":"Pune","percentage":15},{"city":"Chennai","percentage":10}],"platformFollowers":{"youtube":184000,"instagram":32000,"linkedin":45000}}'::jsonb,
  '[]'::jsonb,
  '[{"id":"pkg-vikram-1","title":"Dedicated Course / EdTech Showcase","tagline":"Deep-dive 8-12 min tutorial integrating your learning platform or software.","priceInINR":9500,"popular":true,"platform":"YouTube","deliveryDays":7,"includedRevisions":2,"publishingIncluded":true,"organicUsageDays":90,"paidUsageRightsIncluded":false,"deliverables":["1x In-depth YouTube Video","Pinned Discount Link & Description Callout","Community Tab Post"],"bestFor":"EdTech platforms, coding bootcamps, and career tools"},{"id":"pkg-vikram-2","title":"60s Concept Short & Career Tip","tagline":"High-retention bite-sized breakdown with brand mention.","priceInINR":5000,"platform":"YouTube","deliveryDays":4,"includedRevisions":1,"publishingIncluded":true,"organicUsageDays":60,"paidUsageRightsIncluded":false,"deliverables":["1x 60-second YouTube Short","Pinned Comment link"],"bestFor":"Student discount apps and productivity software"}]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  5,
  24
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  handle = EXCLUDED.handle,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  primary_niche = EXCLUDED.primary_niche,
  sub_niches = EXCLUDED.sub_niches,
  packages = EXCLUDED.packages,
  portfolio = EXCLUDED.portfolio,
  reviews = EXCLUDED.reviews,
  metrics = EXCLUDED.metrics,
  availability = EXCLUDED.availability,
  updated_at = NOW();

INSERT INTO public.creators (
  id, username, full_name, handle, avatar_url, cover_pattern,
  verified_badge, verification_source, reputation_tier, primary_niche,
  sub_niches, bio, location, languages, social_links, availability,
  metrics, portfolio, packages, reviews, faq, overall_rating, total_reviews
) VALUES (
  'creator-neha-singhal',
  'neha-singhal',
  'Neha Singhal',
  '@nehafinance',
  '/images/neha-singhal.jpg',
  'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 50%, #A7F3D0 100%)',
  TRUE,
  'SEBI Research Analyst & Platform API Verified',
  'elite',
  'Finance & Economics',
  '["Personal Finance","Stock Market","Mutual Funds","Budgeting & Taxes"]'::jsonb,
  'Demystifying personal finance, stock market, and macroeconomics into simple, jargon-free 60s actionable guides.',
  '{"city":"Mumbai","country":"India","flagEmoji":"🇮🇳"}'::jsonb,
  '["English","Hindi"]'::jsonb,
  '[{"platform":"instagram","name":"Instagram","handle":"@nehafinance","url":"https://instagram.com","followers":165000,"verified":true},{"platform":"youtube","name":"YouTube","handle":"NehaSinghalMoney","url":"https://youtube.com","followers":88000,"verified":true}]'::jsonb,
  '{"status":"available","label":"Available for Campaigns","slotsRemaining":2,"totalSlots":4,"earliestDelivery":"Within 4 business days","responseTime":"< 3 hours"}'::jsonb,
  '{"totalAudience":165000,"averageViews":48000,"engagementRate":5.8,"targetMarketPercentage":88,"targetMarketCountry":"India","lastUpdatedDaysAgo":1,"ageDistribution":[{"label":"18-24","percentage":22},{"label":"25-34","percentage":58},{"label":"35-44","percentage":16},{"label":"45+","percentage":4}],"genderDistribution":[{"label":"Male","percentage":54},{"label":"Female","percentage":46}],"topGeographies":[{"country":"India","code":"IN","percentage":88},{"country":"United Arab Emirates","code":"AE","percentage":6},{"country":"Others","code":"OTHER","percentage":6}],"topCities":[{"city":"Mumbai","percentage":38},{"city":"Delhi NCR","percentage":26},{"city":"Bengaluru","percentage":20},{"city":"Pune","percentage":10},{"city":"Ahmedabad","percentage":6}],"platformFollowers":{"instagram":165000,"youtube":88000,"linkedin":24000}}'::jsonb,
  '[]'::jsonb,
  '[{"id":"pkg-neha-1","title":"Finance Breakdown Reel","tagline":"High-impact 60s educational reel demystifying your financial product or app.","priceInINR":8000,"popular":true,"platform":"Instagram","deliveryDays":5,"includedRevisions":2,"publishingIncluded":true,"organicUsageDays":60,"paidUsageRightsIncluded":false,"deliverables":["1x 60s 4K Instagram Reel","2x Story frames with direct signup sticker","Link in bio for 7 days"],"bestFor":"Fintech apps, mutual fund platforms, and banking services"}]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  5,
  31
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  handle = EXCLUDED.handle,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  primary_niche = EXCLUDED.primary_niche,
  sub_niches = EXCLUDED.sub_niches,
  packages = EXCLUDED.packages,
  portfolio = EXCLUDED.portfolio,
  reviews = EXCLUDED.reviews,
  metrics = EXCLUDED.metrics,
  availability = EXCLUDED.availability,
  updated_at = NOW();

INSERT INTO public.creators (
  id, username, full_name, handle, avatar_url, cover_pattern,
  verified_badge, verification_source, reputation_tier, primary_niche,
  sub_niches, bio, location, languages, social_links, availability,
  metrics, portfolio, packages, reviews, faq, overall_rating, total_reviews
) VALUES (
  'creator-riya-kapoor',
  'riya-kapoor',
  'Riya Kapoor',
  '@riyaviral',
  '/images/riya-kapoor.jpg',
  'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 50%, #FBCFE8 100%)',
  TRUE,
  'Instagram & Meta Graph API Verified',
  'elite',
  'Reels & Shorts',
  '["Viral 60s Reels","Gen-Z Trends","Short-form UGC","High-Retention Audio"]'::jsonb,
  'Specialist in vertical short-form content. 4.2M+ monthly views with high-retention visual hooks and fast pacing.',
  '{"city":"Mumbai","country":"India","flagEmoji":"🇮🇳"}'::jsonb,
  '["English","Hindi"]'::jsonb,
  '[{"platform":"instagram","name":"Instagram","handle":"@riyaviral","url":"https://instagram.com","followers":245000,"verified":true},{"platform":"youtube","name":"YouTube Shorts","handle":"RiyaViralShorts","url":"https://youtube.com","followers":120000,"verified":true}]'::jsonb,
  '{"status":"available","label":"Open for Viral Collaborations","slotsRemaining":4,"totalSlots":6,"earliestDelivery":"Within 3 business days","responseTime":"< 1 hour"}'::jsonb,
  '{"totalAudience":365000,"averageViews":85000,"engagementRate":7.9,"targetMarketPercentage":86,"targetMarketCountry":"India","lastUpdatedDaysAgo":1,"ageDistribution":[{"label":"18-24","percentage":62},{"label":"25-34","percentage":32},{"label":"35-44","percentage":4},{"label":"45+","percentage":2}],"genderDistribution":[{"label":"Female","percentage":56},{"label":"Male","percentage":44}],"topGeographies":[{"country":"India","code":"IN","percentage":86},{"country":"United Arab Emirates","code":"AE","percentage":5},{"country":"Others","code":"OTHER","percentage":9}],"topCities":[{"city":"Mumbai","percentage":35},{"city":"Delhi NCR","percentage":28},{"city":"Bengaluru","percentage":18},{"city":"Pune","percentage":11},{"city":"Jaipur","percentage":8}],"platformFollowers":{"instagram":245000,"youtube":120000,"linkedin":3200}}'::jsonb,
  '[]'::jsonb,
  '[{"id":"pkg-riya-1","title":"Viral 60s Reel / Short","tagline":"High-energy hook-driven vertical video engineered for maximum organic reach.","priceInINR":6500,"popular":true,"platform":"Instagram","deliveryDays":3,"includedRevisions":2,"publishingIncluded":true,"organicUsageDays":60,"paidUsageRightsIncluded":false,"deliverables":["1x 60s High-Retention Vertical Reel","Trending Audio Integration","Story Share with Link Sticker"],"bestFor":"Direct-to-consumer brands, youth fashion, apps, and beverages"}]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  5,
  38
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  handle = EXCLUDED.handle,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  primary_niche = EXCLUDED.primary_niche,
  sub_niches = EXCLUDED.sub_niches,
  packages = EXCLUDED.packages,
  portfolio = EXCLUDED.portfolio,
  reviews = EXCLUDED.reviews,
  metrics = EXCLUDED.metrics,
  availability = EXCLUDED.availability,
  updated_at = NOW();

INSERT INTO public.creators (
  id, username, full_name, handle, avatar_url, cover_pattern,
  verified_badge, verification_source, reputation_tier, primary_niche,
  sub_niches, bio, location, languages, social_links, availability,
  metrics, portfolio, packages, reviews, faq, overall_rating, total_reviews
) VALUES (
  'creator-kabir-varma',
  'kabir-varma',
  'Kabir Varma',
  '@kabirstories',
  '/images/kabir-varma.jpg',
  'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #F59E0B 100%)',
  TRUE,
  'National Film Board & YouTube Creator API Verified',
  'elite',
  'Documentary',
  '["Cinematic Video Essays","Cultural Deep-Dives","Behind the Scenes","Mini Docs"]'::jsonb,
  'Crafting high-retention cinematic mini-documentaries and human stories that move audiences.',
  '{"city":"New Delhi","country":"India","flagEmoji":"🇮🇳"}'::jsonb,
  '["English","Hindi"]'::jsonb,
  '[{"platform":"youtube","name":"YouTube","handle":"KabirVarmaFilms","url":"https://youtube.com","followers":240000,"verified":true},{"platform":"instagram","name":"Instagram","handle":"@kabirstories","url":"https://instagram.com","followers":82000,"verified":true}]'::jsonb,
  '{"status":"available","label":"Available for Brand Films","slotsRemaining":1,"totalSlots":3,"earliestDelivery":"Within 10 business days","responseTime":"< 4 hours"}'::jsonb,
  '{"totalAudience":240000,"averageViews":110000,"engagementRate":7.4,"targetMarketPercentage":79,"targetMarketCountry":"India","lastUpdatedDaysAgo":2,"ageDistribution":[{"label":"18-24","percentage":30},{"label":"25-34","percentage":50},{"label":"35-44","percentage":15},{"label":"45+","percentage":5}],"genderDistribution":[{"label":"Male","percentage":58},{"label":"Female","percentage":42}],"topGeographies":[{"country":"India","code":"IN","percentage":79},{"country":"United States","code":"US","percentage":10},{"country":"United Kingdom","code":"GB","percentage":6},{"country":"Others","code":"OTHER","percentage":5}],"topCities":[{"city":"Delhi NCR","percentage":34},{"city":"Mumbai","percentage":28},{"city":"Bengaluru","percentage":18},{"city":"Kolkata","percentage":12},{"city":"Chandigarh","percentage":8}],"platformFollowers":{"youtube":240000,"instagram":82000,"linkedin":8500}}'::jsonb,
  '[]'::jsonb,
  '[{"id":"pkg-kabir-1","title":"Cinematic Brand Mini-Doc","tagline":"Story-driven 5-8 minute documentary film weaving your founder or brand journey.","priceInINR":16000,"popular":true,"platform":"YouTube","deliveryDays":10,"includedRevisions":2,"publishingIncluded":true,"organicUsageDays":365,"paidUsageRightsIncluded":true,"deliverables":["1x 4K Cinema Documentary Video","Social cut-down for Reels/Shorts","Permanent YouTube placement"],"bestFor":"Heritage brands, startup founder stories, and premium tech"}]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  5,
  22
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  handle = EXCLUDED.handle,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  primary_niche = EXCLUDED.primary_niche,
  sub_niches = EXCLUDED.sub_niches,
  packages = EXCLUDED.packages,
  portfolio = EXCLUDED.portfolio,
  reviews = EXCLUDED.reviews,
  metrics = EXCLUDED.metrics,
  availability = EXCLUDED.availability,
  updated_at = NOW();

INSERT INTO public.creators (
  id, username, full_name, handle, avatar_url, cover_pattern,
  verified_badge, verification_source, reputation_tier, primary_niche,
  sub_niches, bio, location, languages, social_links, availability,
  metrics, portfolio, packages, reviews, faq, overall_rating, total_reviews
) VALUES (
  'creator-priya-patel',
  'priya-patel',
  'Priya Patel',
  '@priyastyles',
  '/images/priya-patel.jpg',
  'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 50%, #FECDD3 100%)',
  TRUE,
  'Instagram Graph API + Bank KYC Verification',
  'elite',
  'Fashion & Styling',
  '["Affordable Fashion","Everyday Styling","Sustainable Clothing","Ethnic & Fusion"]'::jsonb,
  'Helping young professionals and college students style affordable, high-quality outfits without breaking the bank.',
  '{"city":"New Delhi","country":"India","flagEmoji":"🇮🇳"}'::jsonb,
  '["English","Hindi"]'::jsonb,
  '[{"platform":"instagram","name":"Instagram","handle":"@priyastyles","url":"https://instagram.com","followers":112000,"verified":true},{"platform":"youtube","name":"YouTube Shorts","handle":"PriyaPatelFashion","url":"https://youtube.com","followers":48000,"verified":true}]'::jsonb,
  '{"status":"available","label":"Available for Bookings","slotsRemaining":4,"totalSlots":6,"earliestDelivery":"Within 5 business days","responseTime":"< 3 hours"}'::jsonb,
  '{"totalAudience":112000,"averageViews":34000,"engagementRate":5.4,"targetMarketPercentage":78,"targetMarketCountry":"India","lastUpdatedDaysAgo":2,"ageDistribution":[{"label":"18-24","percentage":48},{"label":"25-34","percentage":38},{"label":"35-44","percentage":11},{"label":"45+","percentage":3}],"genderDistribution":[{"label":"Female","percentage":68},{"label":"Male","percentage":32}],"topGeographies":[{"country":"India","code":"IN","percentage":78},{"country":"United Arab Emirates","code":"AE","percentage":8},{"country":"United States","code":"US","percentage":6},{"country":"United Kingdom","code":"GB","percentage":4},{"country":"Others","code":"OTHER","percentage":4}],"topCities":[{"city":"Delhi NCR","percentage":32},{"city":"Mumbai","percentage":24},{"city":"Bengaluru","percentage":16},{"city":"Jaipur","percentage":11},{"city":"Pune","percentage":9}],"platformFollowers":{"instagram":112000,"youtube":48000,"linkedin":4200}}'::jsonb,
  '[{"id":"work-priya-1","title":"5 Trendy College Outfits Under ₹1,500","category":"Affordable Fashion","format":"Sponsored Reel","platform":"instagram","thumbnailUrl":"/images/work-ugc-demo.jpg","publishedDate":"12 Sep 2026","views":52000,"engagement":6.8,"brandClient":"UrbanThreads Clothing","campaignObjective":"Drive traffic to youth budget collection with trackable coupon code.","deliverableSummary":"1 styling reel + 2 story slides with direct sticker link.","clientQuote":"Priya drove over 420 direct orders within 48 hours of posting. Exceptional return on ad spend.","clientAuthor":"Kavita Menon, Marketing Lead","originalUrl":"https://instagram.com","verifiedMetrics":true},{"id":"work-priya-2","title":"Festive Season Capsule Wardrobe Guide","category":"Ethnic & Fusion","format":"Sponsored Reel","platform":"instagram","thumbnailUrl":"/images/work-gadgets.jpg","publishedDate":"28 Aug 2026","views":38000,"engagement":5.1,"brandClient":"Vanya Ethnic Wear","campaignObjective":"Showcase 4 versatile festive looks from a single fusion kurti.","deliverableSummary":"1 high-retention reel with audio hook and look breakdown.","originalUrl":"https://instagram.com","verifiedMetrics":true}]'::jsonb,
  '[{"id":"pkg-priya-reel","title":"Instagram Sponsored Styling Reel","tagline":"High-energy fashion reel showing your product naturally styled with clear shopping tag.","priceInINR":4500,"popular":true,"platform":"Instagram","deliveryDays":5,"includedRevisions":1,"publishingIncluded":true,"publishingDestination":"Priya''s Instagram Feed (@priyastyles)","organicUsageDays":30,"paidUsageRightsIncluded":false,"paidUsageOptionDays":60,"deliverables":["One 45-60 second 4K vertical styling reel","Direct collaborator tag and brand mention in caption","Pinned comment with promo discount code","Two Instagram story frames with direct link sticker"],"notIncluded":["Paid ad whitelisting (available as add-on)","Competitor exclusivity over 14 days"],"bestFor":"Clothing brands, footwear, accessories, and fashion e-commerce apps."},{"id":"pkg-priya-lookbook","title":"Seasonal Lookbook Integration","tagline":"Multi-look showcase featuring 3-4 outfits with dedicated carousel breakdown.","priceInINR":7500,"platform":"Instagram","deliveryDays":7,"includedRevisions":2,"publishingIncluded":true,"publishingDestination":"Priya''s Instagram Feed","organicUsageDays":60,"paidUsageRightsIncluded":false,"deliverables":["One 60-second transition styling reel","One 6-slide carousel breakdown of fabric and sizing","Three supporting story frames over 48 hours","14-day link in bio feature"],"bestFor":"New collection launches and festive fashion campaigns."},{"id":"pkg-priya-ugc","title":"UGC Ad Creative for Brand Channels","tagline":"Authentic customer-style try-on video produced exclusively for your Meta & TikTok ad spend.","priceInINR":3500,"platform":"Brand Ad Channels","deliveryDays":4,"includedRevisions":1,"publishingIncluded":false,"organicUsageDays":0,"paidUsageRightsIncluded":true,"paidUsageOptionDays":90,"deliverables":["One 30-45 second edited vertical video file (MP4, 4K 60fps)","Hooks A/B test (2 alternative first 3-second opening hooks)","90-day full paid advertising usage rights license","Raw audio and clean color-graded visual file delivery"],"notIncluded":["Does NOT include posting on Priya''s personal social channels"],"bestFor":"Performance marketing agencies running Meta/Instagram ads."}]'::jsonb,
  '[{"id":"rev-priya-1","brandName":"UrbanThreads Clothing","brandLogo":"UT","reviewerName":"Kavita Menon","reviewerRole":"Growth Marketing Lead","campaignType":"Sponsored Instagram Reel","rating":5,"date":"September 2026","content":"Priya understood our budget clothing positioning immediately. Her reel felt completely authentic to her followers, not like an aggressive sales pitch. We generated 420+ purchases with an ROI of 4.8x.","metricHighlight":"420+ direct orders with ₹1,200 AOV","verifiedTransaction":true},{"id":"rev-priya-2","brandName":"SoleMate Footwear","brandLogo":"SM","reviewerName":"Deepak Joshi","reviewerRole":"Founder","campaignType":"UGC Ad Creative","rating":5,"date":"August 2026","content":"Delivered two hook variations that lowered our Cost Per Acquisition by 34% on Meta Ads. Highly recommended for UGC.","metricHighlight":"34% reduction in CAC on Meta ads","verifiedTransaction":true}]'::jsonb,
  '[]'::jsonb,
  5,
  18
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  handle = EXCLUDED.handle,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  primary_niche = EXCLUDED.primary_niche,
  sub_niches = EXCLUDED.sub_niches,
  packages = EXCLUDED.packages,
  portfolio = EXCLUDED.portfolio,
  reviews = EXCLUDED.reviews,
  metrics = EXCLUDED.metrics,
  availability = EXCLUDED.availability,
  updated_at = NOW();

INSERT INTO public.creators (
  id, username, full_name, handle, avatar_url, cover_pattern,
  verified_badge, verification_source, reputation_tier, primary_niche,
  sub_niches, bio, location, languages, social_links, availability,
  metrics, portfolio, packages, reviews, faq, overall_rating, total_reviews
) VALUES (
  'creator-rohit-verma',
  'rohit-verma',
  'Rohit Verma',
  '@rohitfit',
  '/images/rohit-verma.jpg',
  'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 50%, #BBF7D0 100%)',
  TRUE,
  'Meta Business Partner API Sync',
  'elite',
  'Fitness & Sports',
  '["Strength Training","Sports Nutrition","Athletic Wear","Healthy Living"]'::jsonb,
  'Certified strength trainer and sports nutritionist breaking down evidence-based training, clean nutrition, and workout gear.',
  '{"city":"Bengaluru","country":"India","flagEmoji":"🇮🇳"}'::jsonb,
  '["English","Hindi","Kannada"]'::jsonb,
  '[{"platform":"instagram","name":"Instagram","handle":"@rohitfit","url":"https://instagram.com","followers":94000,"verified":true},{"platform":"youtube","name":"YouTube","handle":"RohitVermaFitness","url":"https://youtube.com","followers":32000,"verified":true}]'::jsonb,
  '{"status":"available","label":"Available for Bookings","slotsRemaining":2,"totalSlots":5,"earliestDelivery":"Within 6 business days","responseTime":"< 4 hours"}'::jsonb,
  '{"totalAudience":94000,"averageViews":28000,"engagementRate":6.1,"targetMarketPercentage":71,"targetMarketCountry":"India","lastUpdatedDaysAgo":1,"ageDistribution":[{"label":"18-24","percentage":34},{"label":"25-34","percentage":52},{"label":"35-44","percentage":11},{"label":"45+","percentage":3}],"genderDistribution":[{"label":"Male","percentage":74},{"label":"Female","percentage":26}],"topGeographies":[{"country":"India","code":"IN","percentage":71},{"country":"United States","code":"US","percentage":12},{"country":"United Kingdom","code":"GB","percentage":7},{"country":"Singapore","code":"SG","percentage":5},{"country":"Others","code":"OTHER","percentage":5}],"topCities":[{"city":"Bengaluru","percentage":35},{"city":"Mumbai","percentage":22},{"city":"Delhi NCR","percentage":18},{"city":"Hyderabad","percentage":14},{"city":"Chennai","percentage":11}],"platformFollowers":{"instagram":94000,"youtube":32000,"linkedin":2800}}'::jsonb,
  '[{"id":"work-rohit-1","title":"Top 3 Clean Whey Proteins Tested & Reviewed","category":"Sports Nutrition","format":"Sponsored Reel","platform":"instagram","thumbnailUrl":"/images/work-gadgets.jpg","publishedDate":"18 Sep 2026","views":44000,"engagement":6.4,"brandClient":"Apex Nutrition","campaignObjective":"Educate gym-goers on label transparency and certified lab tests.","deliverableSummary":"1 60s Reel with lab test comparison + 2 story slides.","clientQuote":"Rohit provided real credibility because he actually tested the mixability on camera. Best influencer campaign we ran this quarter.","clientAuthor":"Vikram Seth, Brand Director","originalUrl":"https://instagram.com","verifiedMetrics":true}]'::jsonb,
  '[{"id":"pkg-rohit-ugc","title":"Fitness & Athletic UGC Ad Video","tagline":"High-energy gym workout footage showcasing your apparel or supplement in action.","priceInINR":4000,"popular":true,"platform":"Brand Ad Channels","deliveryDays":5,"includedRevisions":1,"publishingIncluded":false,"organicUsageDays":0,"paidUsageRightsIncluded":true,"paidUsageOptionDays":90,"deliverables":["One 30-45 second edited high-definition vertical video","Real gym setting with energetic athletic movement","Product demonstration (wearing apparel or drinking supplement)","90-day commercial paid ad usage rights"],"bestFor":"Activewear brands, fitness apps, pre-workout and protein supplements."},{"id":"pkg-rohit-reel","title":"Sponsored Instagram Fitness Reel","tagline":"Form tutorial or workout integration posted directly to Rohit''s dedicated fitness audience.","priceInINR":6000,"platform":"Instagram","deliveryDays":6,"includedRevisions":1,"publishingIncluded":true,"publishingDestination":"Rohit''s Instagram Feed (@rohitfit)","organicUsageDays":30,"paidUsageRightsIncluded":false,"deliverables":["One 60-second exercise tutorial with brand integration","Caption mention with brand handle tag and promo code","Pinned comment and 2 story frames"],"bestFor":"Reaching dedicated gym enthusiasts and fitness buyers."}]'::jsonb,
  '[{"id":"rev-rohit-1","brandName":"Apex Nutrition","brandLogo":"AN","reviewerName":"Vikram Seth","reviewerRole":"Brand Director","campaignType":"Sponsored Instagram Reel","rating":5,"date":"September 2026","content":"Credible, athletic, and easy to work with. He clearly understands supplement regulations and formulated content that complied with standards.","metricHighlight":"44K verified views, 6.4% engagement","verifiedTransaction":true}]'::jsonb,
  '[]'::jsonb,
  4.9,
  12
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  handle = EXCLUDED.handle,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  primary_niche = EXCLUDED.primary_niche,
  sub_niches = EXCLUDED.sub_niches,
  packages = EXCLUDED.packages,
  portfolio = EXCLUDED.portfolio,
  reviews = EXCLUDED.reviews,
  metrics = EXCLUDED.metrics,
  availability = EXCLUDED.availability,
  updated_at = NOW();

INSERT INTO public.creators (
  id, username, full_name, handle, avatar_url, cover_pattern,
  verified_badge, verification_source, reputation_tier, primary_niche,
  sub_niches, bio, location, languages, social_links, availability,
  metrics, portfolio, packages, reviews, faq, overall_rating, total_reviews
) VALUES (
  'creator-ananya-roy',
  'ananya-roy',
  'Ananya Roy',
  '@ananyabites',
  '/images/ananya-roy.jpg',
  'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #FCD34D 100%)',
  TRUE,
  'Instagram Graph API + Food Blogger Association Verified',
  'elite',
  'Food & Travel',
  '["Artisanal Cafes","Quick Recipes","Travel Guides","Kitchen Appliances"]'::jsonb,
  'Exploring cozy cafes, uncovering hidden street gems, and crafting simple 15-minute comfort recipes.',
  '{"city":"Mumbai","country":"India","flagEmoji":"🇮🇳"}'::jsonb,
  '["English","Hindi","Bengali"]'::jsonb,
  '[{"platform":"instagram","name":"Instagram","handle":"@ananyabites","url":"https://instagram.com","followers":76000,"verified":true},{"platform":"youtube","name":"YouTube","handle":"AnanyaRoyKitchen","url":"https://youtube.com","followers":24000,"verified":true}]'::jsonb,
  '{"status":"available","label":"Available for Bookings","slotsRemaining":3,"totalSlots":4,"earliestDelivery":"Within 5 business days","responseTime":"< 3 hours"}'::jsonb,
  '{"totalAudience":76000,"averageViews":19500,"engagementRate":4.9,"targetMarketPercentage":82,"targetMarketCountry":"India","lastUpdatedDaysAgo":3,"ageDistribution":[{"label":"18-24","percentage":28},{"label":"25-34","percentage":54},{"label":"35-44","percentage":14},{"label":"45+","percentage":4}],"genderDistribution":[{"label":"Female","percentage":61},{"label":"Male","percentage":39}],"topGeographies":[{"country":"India","code":"IN","percentage":82},{"country":"United States","code":"US","percentage":8},{"country":"United Kingdom","code":"GB","percentage":5},{"country":"Others","code":"OTHER","percentage":5}],"topCities":[{"city":"Mumbai","percentage":44},{"city":"Pune","percentage":21},{"city":"Delhi NCR","percentage":16},{"city":"Kolkata","percentage":12},{"city":"Goa","percentage":7}],"platformFollowers":{"instagram":76000,"youtube":24000,"linkedin":1800}}'::jsonb,
  '[{"id":"work-ananya-1","title":"Top 5 Hidden Breakfast Cafes in Bandra","category":"Artisanal Cafes","format":"Sponsored Reel","platform":"instagram","thumbnailUrl":"/images/work-gadgets.jpg","publishedDate":"10 Sep 2026","views":31000,"engagement":5.8,"brandClient":"The Roast Kitchen","campaignObjective":"Drive foot traffic and weekend brunch table reservations for new cafe opening.","deliverableSummary":"1 60s Reel with location geo-tag + 3 story frames with Google Maps link.","clientQuote":"Weekend brunch was completely sold out for 3 consecutive weeks after Ananya''s reel dropped.","clientAuthor":"Ayesha Merchant, Founder","originalUrl":"https://instagram.com","verifiedMetrics":true}]'::jsonb,
  '[{"id":"pkg-ananya-ugc","title":"Food / Beverage UGC Recipe Video","tagline":"High-res close-up cooking or unboxing creative for brand ad campaigns.","priceInINR":3800,"platform":"Brand Ad Channels","deliveryDays":5,"includedRevisions":1,"publishingIncluded":false,"organicUsageDays":0,"paidUsageRightsIncluded":true,"paidUsageOptionDays":90,"deliverables":["One 30-45 second crisp 4K vertical recipe or product video","Close-up culinary B-roll and tasting reactions","90-day digital ad usage rights license"],"bestFor":"FMCG packaged foods, coffee brands, cookware, and snack products."},{"id":"pkg-ananya-reel","title":"Instagram Cafe / Product Spotlight Reel","tagline":"Aesthetic reel posted on Ananya''s feed exploring your cafe, restaurant, or gourmet food product.","priceInINR":5500,"popular":true,"platform":"Instagram","deliveryDays":6,"includedRevisions":1,"publishingIncluded":true,"publishingDestination":"Ananya''s Instagram Feed (@ananyabites)","organicUsageDays":30,"paidUsageRightsIncluded":false,"deliverables":["One 60-second aesthetic reel with trending culinary audio","Geotag, collaborator tag, and caption story","Two Instagram story frames with reservation or purchase link"],"bestFor":"Cafes, specialty dining, organic snacks, and kitchen appliances."}]'::jsonb,
  '[{"id":"rev-ananya-1","brandName":"The Roast Kitchen","brandLogo":"RK","reviewerName":"Ayesha Merchant","reviewerRole":"Founder & Head Chef","campaignType":"Cafe Spotlight Reel","rating":5,"date":"September 2026","content":"Ananya took the time to understand our artisanal baking process and captured our sourdough in gorgeous natural lighting. Fantastic engagement from Mumbai foodies!","metricHighlight":"31K views, 240+ table bookings","verifiedTransaction":true}]'::jsonb,
  '[]'::jsonb,
  5,
  14
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  handle = EXCLUDED.handle,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  primary_niche = EXCLUDED.primary_niche,
  sub_niches = EXCLUDED.sub_niches,
  packages = EXCLUDED.packages,
  portfolio = EXCLUDED.portfolio,
  reviews = EXCLUDED.reviews,
  metrics = EXCLUDED.metrics,
  availability = EXCLUDED.availability,
  updated_at = NOW();

INSERT INTO public.creators (
  id, username, full_name, handle, avatar_url, cover_pattern,
  verified_badge, verification_source, reputation_tier, primary_niche,
  sub_niches, bio, location, languages, social_links, availability,
  metrics, portfolio, packages, reviews, faq, overall_rating, total_reviews
) VALUES (
  'creator-jun-park',
  'jun-park',
  'Jun Park',
  '@junpark',
  '/images/jun-park.jpg',
  'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 50%, #A7F3D0 100%)',
  TRUE,
  'YouTube Partner API Verification',
  'elite',
  'Everyday Tech & Life',
  '["Minimalist EDC","Productivity Systems","Camera Gear","Seoul Vlogs"]'::jsonb,
  'Thoughtful tech reviews, deliberate minimalist EDC, and productivity rituals that help you do more of what matters.',
  '{"city":"Seoul","country":"South Korea","flagEmoji":"🇰🇷"}'::jsonb,
  '["English","Korean"]'::jsonb,
  '[{"platform":"youtube","name":"YouTube","handle":"JunParkTech","url":"https://youtube.com","followers":210000,"verified":true},{"platform":"instagram","name":"Instagram","handle":"@junpark","url":"https://instagram.com","followers":95000,"verified":true}]'::jsonb,
  '{"status":"available","label":"Available for Bookings","slotsRemaining":3,"totalSlots":5,"earliestDelivery":"Within 6 business days","responseTime":"< 2 hours"}'::jsonb,
  '{"totalAudience":210000,"averageViews":74000,"engagementRate":5.1,"targetMarketPercentage":72,"targetMarketCountry":"Global","lastUpdatedDaysAgo":1,"ageDistribution":[{"label":"18-24","percentage":34},{"label":"25-34","percentage":52},{"label":"35-44","percentage":11},{"label":"45+","percentage":3}],"genderDistribution":[{"label":"Male","percentage":72},{"label":"Female","percentage":28}],"topGeographies":[{"country":"South Korea","code":"KR","percentage":42},{"country":"United States","code":"US","percentage":28},{"country":"India","code":"IN","percentage":16},{"country":"Others","code":"OTHER","percentage":14}],"topCities":[{"city":"Seoul","percentage":40},{"city":"Busan","percentage":12},{"city":"San Francisco","percentage":8}],"platformFollowers":{"youtube":210000,"instagram":95000,"linkedin":4200}}'::jsonb,
  '[]'::jsonb,
  '[{"id":"pkg-jun-1","title":"Minimalist EDC Video Feature","tagline":"Dedicated 4K camera gear or everyday tech showcase.","priceInINR":11000,"popular":true,"platform":"YouTube","deliveryDays":6,"includedRevisions":1,"publishingIncluded":true,"organicUsageDays":30,"paidUsageRightsIncluded":false,"deliverables":["1x Dedicated YouTube integration","Pinned affiliate link","1x Short cut-down"],"bestFor":"Camera accessories, bags, laptops, and hardware"}]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  5,
  29
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  handle = EXCLUDED.handle,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  primary_niche = EXCLUDED.primary_niche,
  sub_niches = EXCLUDED.sub_niches,
  packages = EXCLUDED.packages,
  portfolio = EXCLUDED.portfolio,
  reviews = EXCLUDED.reviews,
  metrics = EXCLUDED.metrics,
  availability = EXCLUDED.availability,
  updated_at = NOW();

INSERT INTO public.creators (
  id, username, full_name, handle, avatar_url, cover_pattern,
  verified_badge, verification_source, reputation_tier, primary_niche,
  sub_niches, bio, location, languages, social_links, availability,
  metrics, portfolio, packages, reviews, faq, overall_rating, total_reviews
) VALUES (
  'creator-aarohi-mehta',
  'aarohi-mehta',
  'Aarohi Mehta',
  '@aarohimehta',
  '/images/aarohi-mehta.jpg',
  'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 50%, #FBCFE8 100%)',
  TRUE,
  'Instagram Graph API + Bank KYC Verification',
  'elite',
  'Food & City Finds',
  '["Mumbai Hidden Gems","Street Food Culture","Cafe Reviews","Weekend Guides"]'::jsonb,
  'Uncovering Mumbai''s best secret cafes, legendary street corners, and heritage recipes. Honest culinary stories that make people hungry to explore.',
  '{"city":"Mumbai","country":"India","flagEmoji":"🇮🇳"}'::jsonb,
  '["English","Hindi","Gujarati"]'::jsonb,
  '[{"platform":"instagram","name":"Instagram","handle":"@aarohimehta","url":"https://instagram.com","followers":142000,"verified":true},{"platform":"youtube","name":"YouTube","handle":"AarohiMehtaVlogs","url":"https://youtube.com","followers":68000,"verified":true}]'::jsonb,
  '{"status":"available","label":"Available for Bookings","slotsRemaining":2,"totalSlots":4,"earliestDelivery":"Within 5 business days","responseTime":"< 2 hours"}'::jsonb,
  '{"totalAudience":142000,"averageViews":48000,"engagementRate":6.2,"targetMarketPercentage":84,"targetMarketCountry":"India","lastUpdatedDaysAgo":1,"ageDistribution":[{"label":"18-24","percentage":42},{"label":"25-34","percentage":44},{"label":"35-44","percentage":11},{"label":"45+","percentage":3}],"genderDistribution":[{"label":"Female","percentage":62},{"label":"Male","percentage":38}],"topGeographies":[{"country":"India","code":"IN","percentage":84},{"country":"United Arab Emirates","code":"AE","percentage":8},{"country":"United Kingdom","code":"GB","percentage":4},{"country":"Others","code":"OTHER","percentage":4}],"topCities":[{"city":"Mumbai","percentage":42},{"city":"Delhi NCR","percentage":24},{"city":"Pune","percentage":14}],"platformFollowers":{"instagram":142000,"youtube":68000,"linkedin":2400}}'::jsonb,
  '[]'::jsonb,
  '[{"id":"pkg-aarohi-1","title":"Cafe Spotlight Reel","tagline":"Aesthetic 60s Reel with culinary audio & location pin.","priceInINR":6000,"popular":true,"platform":"Instagram","deliveryDays":4,"includedRevisions":1,"publishingIncluded":true,"organicUsageDays":30,"paidUsageRightsIncluded":false,"deliverables":["1x 60s 4K Reel","Geo-tag & Collaborator tag","2x Story frames"],"bestFor":"Cafes, bakeries, and dining spots"}]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  5,
  18
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  handle = EXCLUDED.handle,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  primary_niche = EXCLUDED.primary_niche,
  sub_niches = EXCLUDED.sub_niches,
  packages = EXCLUDED.packages,
  portfolio = EXCLUDED.portfolio,
  reviews = EXCLUDED.reviews,
  metrics = EXCLUDED.metrics,
  availability = EXCLUDED.availability,
  updated_at = NOW();

INSERT INTO public.creators (
  id, username, full_name, handle, avatar_url, cover_pattern,
  verified_badge, verification_source, reputation_tier, primary_niche,
  sub_niches, bio, location, languages, social_links, availability,
  metrics, portfolio, packages, reviews, faq, overall_rating, total_reviews
) VALUES (
  'creator-maya-james',
  'maya-james',
  'Maya James',
  '@mayajames',
  '/images/maya-james.jpg',
  'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FDE68A 100%)',
  TRUE,
  'Instagram Graph API + Bank KYC Verification',
  'elite',
  'Beauty & Personal Style',
  '["Skincare Routine","Everyday Makeup","Texture & Haircare","London Style"]'::jsonb,
  'Real skin, minimal routines, and elevated everyday beauty. Honest formulas tested across weeks, not minutes.',
  '{"city":"London","country":"United Kingdom","flagEmoji":"🇬🇧"}'::jsonb,
  '["English"]'::jsonb,
  '[{"platform":"instagram","name":"Instagram","handle":"@mayajames","url":"https://instagram.com","followers":188000,"verified":true},{"platform":"youtube","name":"YouTube","handle":"MayaJamesBeauty","url":"https://youtube.com","followers":94000,"verified":true}]'::jsonb,
  '{"status":"available","label":"Available for Bookings","slotsRemaining":1,"totalSlots":3,"earliestDelivery":"Within 7 business days","responseTime":"< 3 hours"}'::jsonb,
  '{"totalAudience":188000,"averageViews":62000,"engagementRate":5.9,"targetMarketPercentage":68,"targetMarketCountry":"UK & India","lastUpdatedDaysAgo":2,"ageDistribution":[{"label":"18-24","percentage":38},{"label":"25-34","percentage":48},{"label":"35-44","percentage":11},{"label":"45+","percentage":3}],"genderDistribution":[{"label":"Female","percentage":76},{"label":"Male","percentage":24}],"topGeographies":[{"country":"United Kingdom","code":"GB","percentage":48},{"country":"India","code":"IN","percentage":24},{"country":"United States","code":"US","percentage":18},{"country":"Others","code":"OTHER","percentage":10}],"topCities":[{"city":"London","percentage":38},{"city":"Manchester","percentage":14},{"city":"Mumbai","percentage":12}],"platformFollowers":{"instagram":188000,"youtube":94000,"linkedin":3100}}'::jsonb,
  '[]'::jsonb,
  '[{"id":"pkg-maya-1","title":"Skincare Routine Feature","tagline":"High-production 4K routine integration with texture close-ups.","priceInINR":9500,"popular":true,"platform":"Instagram","deliveryDays":5,"includedRevisions":1,"publishingIncluded":true,"organicUsageDays":30,"paidUsageRightsIncluded":false,"deliverables":["1x 60s High-Def Reel","Product close-ups","Promo discount code"],"bestFor":"Clean skincare, cosmetics, and self-care brands"}]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  4.9,
  24
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  handle = EXCLUDED.handle,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  primary_niche = EXCLUDED.primary_niche,
  sub_niches = EXCLUDED.sub_niches,
  packages = EXCLUDED.packages,
  portfolio = EXCLUDED.portfolio,
  reviews = EXCLUDED.reviews,
  metrics = EXCLUDED.metrics,
  availability = EXCLUDED.availability,
  updated_at = NOW();

-- =========================================================================
-- 10. SEED INITIAL COLLABORATION DEALS IN WORKFLOW PIPELINE
-- =========================================================================

INSERT INTO public.collaboration_requests (
  id, creator_id, creator_name, creator_avatar, creator_handle,
  brand_name, brand_contact_person, brand_email, company_website,
  service_title, package_id, budget_inr, proposed_deadline,
  campaign_objective, campaign_brief, deliverables, status,
  pipeline_stage, escrow_status, escrow_amount_inr, counter_offer_inr,
  counter_offer_notes, creator_notes, script_data, draft_submission,
  live_link, brand_review, timeline_events, submitted_at
) VALUES (
  'REQ-101',
  'creator-priya-patel',
  'Priya Patel',
  '/images/priya-patel.jpg',
  '@priyastyles',
  'UrbanThreads Clothing',
  'Kavita Menon',
  'kavita@urbanthreads.in',
  'https://urbanthreads.in',
  'Instagram Fashion Reel',
  'pkg-priya-reel',
  8500,
  '2026-10-28',
  'Promote our autumn affordable casual wear collection to college students and young professionals.',
  'We want 1 high-energy styling reel showing 3 everyday budget outfits (under ₹1,500 each) using our newly launched denim jackets and casual trousers. Include trackable coupon code "PRIYA20" in caption and pinned comment.',
  '["1 45-60s 4K vertical styling reel","Collaborator tag + pinned discount code","2 Instagram stories with direct swipe/sticker link"]'::jsonb,
  'new',
  'proposal',
  'unfunded',
  8500,
  NULL,
  '',
  '',
  '{}'::jsonb,
  '{}'::jsonb,
  '',
  '{}'::jsonb,
  '[{"id":"ev-1","timestamp":"Today, 2:15 PM","actor":"brand","action":"Booking Request Submitted","details":"UrbanThreads submitted campaign brief for ₹8,500 with target delivery Oct 28."}]'::jsonb,
  'Today, 2:15 PM'
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  pipeline_stage = EXCLUDED.pipeline_stage,
  escrow_status = EXCLUDED.escrow_status,
  updated_at = NOW();

INSERT INTO public.collaboration_requests (
  id, creator_id, creator_name, creator_avatar, creator_handle,
  brand_name, brand_contact_person, brand_email, company_website,
  service_title, package_id, budget_inr, proposed_deadline,
  campaign_objective, campaign_brief, deliverables, status,
  pipeline_stage, escrow_status, escrow_amount_inr, counter_offer_inr,
  counter_offer_notes, creator_notes, script_data, draft_submission,
  live_link, brand_review, timeline_events, submitted_at
) VALUES (
  'REQ-102',
  'cr_alex_sharma',
  'Alex Sharma',
  '/images/alex-sharma.jpg',
  '@alexbuilds',
  'SuperAI Labs',
  'Vikram Mehta',
  'partnerships@superailabs.io',
  'https://superailabs.io',
  'YouTube Brand Integration',
  'pkg-yt-integration',
  10000,
  '2026-11-05',
  'Feature our new developer AI coding assistant in an educational tutorial.',
  'Looking for a 60-90 second mid-roll segment demonstrating how our autocomplete tool speeds up TypeScript development. We need a trackable signup link in the description and pinned comment.',
  '["60-90s dedicated integration in main YouTube video","Pinned comment with trackable referral link","Permanent hosting with lifetime link"]'::jsonb,
  'in_discussion',
  'proposal',
  'unfunded',
  10500,
  10500,
  'Happy to do this! Can include 48-hour rush delivery so your launch coincides with Product Hunt week.',
  '',
  '{}'::jsonb,
  '{}'::jsonb,
  '',
  '{}'::jsonb,
  '[{"id":"ev-2a","timestamp":"Yesterday, 4:30 PM","actor":"brand","action":"Booking Request Submitted","details":"Initial offer ₹10,000 for YouTube integration."},{"id":"ev-2b","timestamp":"Yesterday, 6:00 PM","actor":"creator","action":"Custom Counter-Quote Proposed","details":"Alex proposed revised budget of ₹10,500 with 48-hour rush delivery guarantee."}]'::jsonb,
  'Yesterday, 4:30 PM'
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  pipeline_stage = EXCLUDED.pipeline_stage,
  escrow_status = EXCLUDED.escrow_status,
  updated_at = NOW();

INSERT INTO public.collaboration_requests (
  id, creator_id, creator_name, creator_avatar, creator_handle,
  brand_name, brand_contact_person, brand_email, company_website,
  service_title, package_id, budget_inr, proposed_deadline,
  campaign_objective, campaign_brief, deliverables, status,
  pipeline_stage, escrow_status, escrow_amount_inr, counter_offer_inr,
  counter_offer_notes, creator_notes, script_data, draft_submission,
  live_link, brand_review, timeline_events, submitted_at
) VALUES (
  'REQ-103',
  'creator-rohit-verma',
  'Rohit Verma',
  '/images/rohit-verma.jpg',
  '@rohitfit',
  'Apex Protein',
  'Vikram Seth',
  'marketing@apexprotein.com',
  'https://apexprotein.com',
  'Fitness & Athletic UGC Ad Video',
  'pkg-rohit-ugc',
  4000,
  '2026-10-31',
  'Create authentic gym-floor UGC ads for Meta ad campaigns.',
  'Need 1 30-45s vertical video showing Rohit drinking our Isolate Whey post-workout. Authentic gym footage with clean hook: "Stop drinking chalky protein".',
  '["30-45s edited 4K vertical UGC video","2 hook variations","90-day paid ad usage license"]'::jsonb,
  'accepted',
  'script_signoff',
  'held',
  4000,
  NULL,
  '',
  'Brief approved. Filming scheduled for Thursday at Bengaluru Fitness Hub.',
  '{}'::jsonb,
  '{}'::jsonb,
  '',
  '{}'::jsonb,
  '[{"id":"ev-3a","timestamp":"3 days ago","actor":"brand","action":"Booking Request Submitted","details":"Brief submitted for UGC fitness ad creative."},{"id":"ev-3b","timestamp":"2 days ago","actor":"creator","action":"Terms Accepted","details":"Rohit confirmed production schedule and deliverables."},{"id":"ev-3c","timestamp":"2 days ago","actor":"brand","action":"Escrow Deposited (₹4,000)","details":"Apex Protein deposited ₹4,000 securely into Creatorly Escrow Vault."},{"id":"ev-3d","timestamp":"Yesterday, 11:30 AM","actor":"creator","action":"Script Outline Submitted","details":"Rohit submitted concept outline and hook points for brand signoff."}]'::jsonb,
  '2 days ago'
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  pipeline_stage = EXCLUDED.pipeline_stage,
  escrow_status = EXCLUDED.escrow_status,
  updated_at = NOW();

INSERT INTO public.collaboration_requests (
  id, creator_id, creator_name, creator_avatar, creator_handle,
  brand_name, brand_contact_person, brand_email, company_website,
  service_title, package_id, budget_inr, proposed_deadline,
  campaign_objective, campaign_brief, deliverables, status,
  pipeline_stage, escrow_status, escrow_amount_inr, counter_offer_inr,
  counter_offer_notes, creator_notes, script_data, draft_submission,
  live_link, brand_review, timeline_events, submitted_at
) VALUES (
  'REQ-105',
  'cr_alex_sharma',
  'Alex Sharma',
  '/images/alex-sharma.jpg',
  '@alexbuilds',
  'CyberShield VPN',
  'Daniel Craig',
  'marketing@cybershield.io',
  'https://cybershield.io',
  'Dedicated Security Deep Dive',
  'pkg-alex-deep-dive',
  12000,
  '2026-10-30',
  'Sponsor an educational breakdown explaining DNS leaks and public WiFi vulnerabilities.',
  'Full 90-second integration testing public network vulnerabilities with our VPN active. Highlight WireGuard speed and zero-logging policy.',
  '["90s Dedicated Mid-roll integration","PIN link in YouTube comment","Permanent description link + 60-day social repost rights"]'::jsonb,
  'in_progress',
  'draft_review',
  'held',
  12000,
  NULL,
  '',
  '',
  '{}'::jsonb,
  '{}'::jsonb,
  '',
  '{}'::jsonb,
  '[{"id":"ev-5a","timestamp":"5 days ago","actor":"brand","action":"Campaign Booked","details":"CyberShield booked Dedicated Security Integration."},{"id":"ev-5b","timestamp":"4 days ago","actor":"brand","action":"Escrow Deposited (₹12,000)","details":"Funds locked safely in Creatorly Escrow."},{"id":"ev-5c","timestamp":"3 days ago","actor":"brand","action":"Script Outline Approved","details":"CyberShield signed off on script. Filming commenced."},{"id":"ev-5d","timestamp":"Today, 9:00 AM","actor":"creator","action":"4K Video Draft Uploaded (v1)","details":"Alex uploaded unlisted draft link for brand final review."}]'::jsonb,
  '5 days ago'
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  pipeline_stage = EXCLUDED.pipeline_stage,
  escrow_status = EXCLUDED.escrow_status,
  updated_at = NOW();

INSERT INTO public.collaboration_requests (
  id, creator_id, creator_name, creator_avatar, creator_handle,
  brand_name, brand_contact_person, brand_email, company_website,
  service_title, package_id, budget_inr, proposed_deadline,
  campaign_objective, campaign_brief, deliverables, status,
  pipeline_stage, escrow_status, escrow_amount_inr, counter_offer_inr,
  counter_offer_notes, creator_notes, script_data, draft_submission,
  live_link, brand_review, timeline_events, submitted_at
) VALUES (
  'REQ-104',
  'creator-ananya-roy',
  'Ananya Roy',
  '/images/ananya-roy.jpg',
  '@ananyabites',
  'The Roast Kitchen',
  'Ayesha Merchant',
  'hello@theroastkitchen.in',
  'https://theroastkitchen.in',
  'Instagram Cafe Spotlight Reel',
  'pkg-ananya-reel',
  5500,
  '2026-10-15',
  'Weekend brunch launch announcement for Bandra cafe.',
  'Aesthetic walkthrough of sourdough bakery and artisanal coffee bar with reservation sticker.',
  '["60s Reel with culinary audio","Location tag & reservation sticker"]'::jsonb,
  'completed',
  'live_completed',
  'released',
  5500,
  NULL,
  '',
  '',
  '{}'::jsonb,
  '{}'::jsonb,
  '',
  '{"rating":5,"reviewText":"Ananya was exceptional to work with! The reel was beautifully edited, matched our vibe completely, and we drove over 320 direct table reservations on our opening weekend.","submittedAt":"Oct 15, 2026"}'::jsonb,
  '[{"id":"ev-4a","timestamp":"Oct 8, 2026","actor":"brand","action":"Campaign Booked","details":"Cafe Spotlight reel requested."},{"id":"ev-4b","timestamp":"Oct 9, 2026","actor":"brand","action":"Escrow Deposited (₹5,500)","details":"Payment deposited into Creatorly Escrow."},{"id":"ev-4c","timestamp":"Oct 12, 2026","actor":"brand","action":"Video Draft Approved","details":"Draft approved without revisions."},{"id":"ev-4d","timestamp":"Oct 14, 2026","actor":"creator","action":"Content Published Live","details":"Reel went live on @ananyabites with location sticker."},{"id":"ev-4e","timestamp":"Oct 15, 2026","actor":"brand","action":"Escrow Released & 5-Star Review Written","details":"₹5,500 released from escrow to Ananya. 5-star verified review posted."}]'::jsonb,
  'Last week'
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  pipeline_stage = EXCLUDED.pipeline_stage,
  escrow_status = EXCLUDED.escrow_status,
  updated_at = NOW();

-- =========================================================================
-- =========================================================================
-- 11. SEED DEFAULT USERS (DEMO BRAND AND CREATORS)
-- =========================================================================
INSERT INTO public.users (id, name, email, role, company_name, handle, niche, avatar_url, verified)
VALUES
  ('user-brand-demo', 'Razorpay Growth Team', 'growth@razorpay.com', 'brand', 'Razorpay Technologies', NULL, NULL, 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200', TRUE),
  ('user-creator-demo', 'Alex Sharma', 'alex@creatorly.com', 'creator', NULL, '@alexbuilds', 'Tech & Education', '/images/alex-sharma.jpg', TRUE)
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- 12. SEED INITIAL BRAND CAMPAIGNS
-- =========================================================================
INSERT INTO public.campaigns (
  id, name, objective, status, start_date, end_date,
  total_budget_inr, spent_budget_inr, creator_ids, milestones,
  deliverables_count, completed_deliverables_count
) VALUES 
  (
    'camp-1', 
    'Diwali Festive Push 2026', 
    'Brand Awareness & Festive Sales Conversion', 
    'Active', 
    '2026-10-15', 
    '2026-11-15', 
    50000, 
    32000, 
    '["creator-food-rhea", "creator-priya-patel", "creator-travel-sanya"]'::jsonb, 
    '[{"id":"ms-1","label":"Creator Briefs Finalized & Approved","completed":true},{"id":"ms-2","label":"Product Sample Boxes Delivered","completed":true},{"id":"ms-3","label":"Reel First Drafts Reviewed","completed":true},{"id":"ms-4","label":"Festive Go-Live Weekend (Phase 1)","completed":true},{"id":"ms-5","label":"Phase 2 Follow-Up Retargeting Stories","completed":false}]'::jsonb, 
    6, 
    4
  ),
  (
    'camp-2', 
    'Developer Tools Q4 Sprint', 
    'SaaS App Signups & Benchmark Awareness', 
    'In Planning', 
    '2026-11-01', 
    '2026-12-10', 
    85000, 
    28000, 
    '["creator-tech-arjun", "creator-alex-sharma"]'::jsonb, 
    '[{"id":"ms-2-1","label":"Technical API Sandbox Access Provided","completed":true},{"id":"ms-2-2","label":"Code Review Script Approval","completed":false},{"id":"ms-2-3","label":"YouTube Video Production","completed":false},{"id":"ms-2-4","label":"Product Hunt & GitHub Links Synchronized","completed":false}]'::jsonb, 
    4, 
    1
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  objective = EXCLUDED.objective,
  total_budget_inr = EXCLUDED.total_budget_inr,
  updated_at = NOW();

-- Verification queries
SELECT 'Database setup complete!' as status, COUNT(*) as total_creators FROM public.creators;
SELECT COUNT(*) as total_deals FROM public.collaboration_requests;
SELECT COUNT(*) as total_campaigns FROM public.campaigns;
SELECT COUNT(*) as total_users FROM public.users;

