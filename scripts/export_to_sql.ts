import fs from 'fs';
import path from 'path';
import { ALL_CREATORS, INITIAL_COLLABORATION_REQUESTS } from '../src/data/mockCreatorsList.ts';

function escapeSqlString(val: string): string {
  if (val === null || val === undefined) return 'NULL';
  return "'" + val.replace(/'/g, "''") + "'";
}

function escapeJson(val: any): string {
  if (val === null || val === undefined) return "'{}'::jsonb";
  const str = JSON.stringify(val);
  return "'" + str.replace(/'/g, "''") + "'::jsonb";
}

let sql = `-- =========================================================================
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
`;

for (const c of ALL_CREATORS) {
  sql += `
INSERT INTO public.creators (
  id, username, full_name, handle, avatar_url, cover_pattern,
  verified_badge, verification_source, reputation_tier, primary_niche,
  sub_niches, bio, location, languages, social_links, availability,
  metrics, portfolio, packages, reviews, faq, overall_rating, total_reviews
) VALUES (
  ${escapeSqlString(c.id)},
  ${escapeSqlString(c.username || c.id)},
  ${escapeSqlString(c.fullName)},
  ${escapeSqlString(c.handle)},
  ${escapeSqlString(c.avatarUrl)},
  ${escapeSqlString(c.coverPattern || '')},
  ${c.verifiedBadge ? 'TRUE' : 'FALSE'},
  ${escapeSqlString(c.verificationSource || 'Verified Platform Partner')},
  ${escapeSqlString(c.reputationTier || 'elite')},
  ${escapeSqlString(c.primaryNiche)},
  ${escapeJson(c.subNiches || [])},
  ${escapeSqlString(c.bio || '')},
  ${escapeJson(c.location || {})},
  ${escapeJson(c.languages || [])},
  ${escapeJson(c.socialLinks || [])},
  ${escapeJson(c.availability || {})},
  ${escapeJson(c.metrics || {})},
  ${escapeJson(c.portfolio || [])},
  ${escapeJson(c.packages || [])},
  ${escapeJson(c.reviews || [])},
  ${escapeJson(c.faq || [])},
  ${c.overallRating || 4.9},
  ${c.totalReviews || 24}
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
`;
}

sql += `
-- =========================================================================
-- 10. SEED INITIAL COLLABORATION DEALS IN WORKFLOW PIPELINE
-- =========================================================================
`;

for (const r of INITIAL_COLLABORATION_REQUESTS) {
  sql += `
INSERT INTO public.collaboration_requests (
  id, creator_id, creator_name, creator_avatar, creator_handle,
  brand_name, brand_contact_person, brand_email, company_website,
  service_title, package_id, budget_inr, proposed_deadline,
  campaign_objective, campaign_brief, deliverables, status,
  pipeline_stage, escrow_status, escrow_amount_inr, counter_offer_inr,
  counter_offer_notes, creator_notes, script_data, draft_submission,
  live_link, brand_review, timeline_events, submitted_at
) VALUES (
  ${escapeSqlString(r.id)},
  ${escapeSqlString(r.creatorId)},
  ${escapeSqlString(r.creatorName)},
  ${escapeSqlString(r.creatorAvatar)},
  ${escapeSqlString(r.creatorHandle)},
  ${escapeSqlString(r.brandName)},
  ${escapeSqlString(r.brandContactPerson)},
  ${escapeSqlString(r.brandEmail)},
  ${escapeSqlString(r.companyWebsite || '')},
  ${escapeSqlString(r.serviceTitle)},
  ${escapeSqlString(r.packageId)},
  ${r.budgetINR || 0},
  ${escapeSqlString(r.proposedDeadline || '')},
  ${escapeSqlString(r.campaignObjective || '')},
  ${escapeSqlString(r.campaignBrief || '')},
  ${escapeJson(r.deliverables || [])},
  ${escapeSqlString(r.status)},
  ${escapeSqlString(r.pipelineStage || 'proposal')},
  ${escapeSqlString(r.escrowStatus || 'unfunded')},
  ${r.escrowAmountINR || 0},
  ${r.counterOfferINR !== undefined ? r.counterOfferINR : 'NULL'},
  ${escapeSqlString(r.counterOfferNotes || '')},
  ${escapeSqlString(r.creatorNotes || '')},
  ${escapeJson(r.scriptData)},
  ${escapeJson(r.draftSubmission)},
  ${escapeSqlString(r.liveLink || '')},
  ${escapeJson(r.brandReview)},
  ${escapeJson(r.timelineEvents || [])},
  ${escapeSqlString(r.submittedAt || 'Just now')}
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  pipeline_stage = EXCLUDED.pipeline_stage,
  escrow_status = EXCLUDED.escrow_status,
  updated_at = NOW();
`;
}

sql += `
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

`;

const outputPath = path.resolve('supabase_schema.sql');
fs.writeFileSync(outputPath, sql, 'utf8');
console.log(`Generated ${outputPath} successfully! Total creators: ${ALL_CREATORS.length}, Total requests: ${INITIAL_COLLABORATION_REQUESTS.length}`);
