import { createClient } from '@supabase/supabase-js';
import { ALL_CREATORS, INITIAL_COLLABORATION_REQUESTS } from '../src/data/mockCreatorsList.ts';

const supabaseUrl = 'https://fcglksvcqmymjyqoyrtw.supabase.co';
const supabaseServiceRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjZ2xrc3ZjcW15bWp5cW95cnR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDcwODIyMSwiZXhwIjoyMTAwMjg0MjIxfQ.dpywK-pVTlEmDLgCOGNY0lsjYOdAY6z0i31oD1qQgTw';

const supabase = createClient(supabaseUrl, supabaseServiceRole);

async function seed() {
  console.log('🌱 Starting automatic seed to live Supabase database...');

  // 1. Seed creators
  for (const c of ALL_CREATORS) {
    const payload = {
      id: c.id,
      username: c.username || c.id,
      full_name: c.fullName,
      handle: c.handle,
      avatar_url: c.avatarUrl,
      cover_pattern: c.coverPattern || '',
      verified_badge: c.verifiedBadge,
      verification_source: c.verificationSource || 'Platform Verified',
      reputation_tier: c.reputationTier || 'elite',
      primary_niche: c.primaryNiche,
      sub_niches: c.subNiches || [],
      bio: c.bio,
      location: c.location,
      languages: c.languages || ['English', 'Hindi'],
      social_links: c.socialLinks || [],
      availability: c.availability || {},
      metrics: c.metrics || {},
      packages: c.packages || [],
      portfolio: c.portfolio || [],
      reviews: c.reviews || [],
      faq: c.faqs || [],
      overall_rating: c.overallRating || 5.0,
      total_reviews: c.totalReviews || 24,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('creators').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.error(`❌ Failed seeding creator ${c.fullName}:`, error.message);
    } else {
      console.log(`✅ Seeded creator: ${c.fullName} (${c.primaryNiche})`);
    }
  }

  // 2. Seed collaboration requests
  for (const r of INITIAL_COLLABORATION_REQUESTS) {
    const payload = {
      id: r.id,
      creator_id: r.creatorId,
      creator_name: r.creatorName,
      creator_avatar: r.creatorAvatar,
      creator_handle: r.creatorHandle,
      brand_name: r.brandName,
      brand_contact_person: r.brandContactPerson,
      brand_email: r.brandEmail,
      company_website: r.companyWebsite || '',
      service_title: r.serviceTitle,
      package_id: r.packageId,
      budget_inr: r.budgetINR,
      proposed_deadline: r.proposedDeadline,
      campaign_objective: r.campaignObjective,
      campaign_brief: r.campaignBrief,
      deliverables: r.deliverables,
      status: r.status,
      pipeline_stage: r.pipelineStage,
      escrow_status: r.escrowStatus,
      escrow_amount_inr: r.escrowAmountINR,
      counter_offer_inr: r.counterOfferINR || null,
      counter_offer_notes: r.counterOfferNotes || null,
      creator_notes: r.creatorNotes || null,
      script_data: r.scriptOutline || null,
      draft_submission: r.videoDraft || null,
      live_link: r.publishedDeliverable?.liveUrl || null,
      brand_review: r.brandReview || null,
      timeline_events: r.timelineEvents || [],
      submitted_at: r.submittedAt || 'Just now',
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('collaboration_requests').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.error(`❌ Failed seeding deal ${r.id}:`, error.message);
    } else {
      console.log(`✅ Seeded deal: ${r.id} (${r.brandName} -> ${r.creatorName})`);
    }
  }

  // 3. Seed demo users
  const demoUsers = [
    {
      id: 'brand-razorpay',
      name: 'Razorpay Growth Team',
      email: 'marketing@razorpay.com',
      role: 'brand',
      company_name: 'Razorpay Technologies',
      avatar_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&auto=format&fit=crop&q=80',
      verified: true
    },
    {
      id: 'alex-sharma',
      name: 'Alex Sharma',
      email: 'alex@alexsharma.media',
      role: 'creator',
      handle: '@alexsharma',
      avatar_url: '/images/alex-sharma.jpg',
      niche: 'AI & Developer Tools',
      verified: true
    }
  ];

  for (const u of demoUsers) {
    const { error } = await supabase.from('users').upsert(u, { onConflict: 'id' });
    if (error) {
      console.error(`❌ Failed seeding user ${u.name}:`, error.message);
    } else {
      console.log(`✅ Seeded user: ${u.name} (${u.role})`);
    }
  }

  // 4. Seed initial campaigns
  const initialCampaigns = [
    {
      id: 'camp-1',
      name: 'Diwali Festive Push 2026',
      objective: 'Brand Awareness & Festive Sales Conversion',
      status: 'Active',
      start_date: '2026-10-15',
      end_date: '2026-11-15',
      total_budget_inr: 50000,
      spent_budget_inr: 32000,
      creator_ids: ['creator-food-rhea', 'creator-priya-patel', 'creator-travel-sanya'],
      deliverables_count: 6,
      completed_deliverables_count: 4,
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
      start_date: '2026-11-01',
      end_date: '2026-12-10',
      total_budget_inr: 85000,
      spent_budget_inr: 28000,
      creator_ids: ['creator-tech-arjun', 'creator-alex-sharma'],
      deliverables_count: 4,
      completed_deliverables_count: 1,
      milestones: [
        { id: 'ms-2-1', label: 'Technical API Sandbox Access Provided', completed: true },
        { id: 'ms-2-2', label: 'Code Review Script Approval', completed: false },
        { id: 'ms-2-3', label: 'YouTube Video Production', completed: false },
        { id: 'ms-2-4', label: 'Product Hunt & GitHub Links Synchronized', completed: false }
      ]
    }
  ];

  for (const camp of initialCampaigns) {
    const { error } = await supabase.from('campaigns').upsert(camp, { onConflict: 'id' });
    if (error) {
      console.error(`❌ Failed seeding campaign ${camp.name}:`, error.message);
    } else {
      console.log(`✅ Seeded campaign: ${camp.name}`);
    }
  }

  console.log('🎉 Direct database seeding complete!');
}

seed();
