import { createClient } from '@supabase/supabase-js';
import type { CreatorProfile, CollaborationRequest, AuthUser } from '../types/creator';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fcglksvcqmymjyqoyrtw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjZ2xrc3ZjcW15bWp5cW95cnR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MDgyMjEsImV4cCI6MjEwMDI4NDIyMX0.aEMtyTayA3ePFRzeTjEK6a_JjRiE6LP1nu_ET1SPGuY';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.includes('supabase.co'));
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Fetch creators from the Supabase `creators` table.
 * If the table is empty or doesn't exist yet, returns null to allow fallback to local data.
 */
export async function fetchCreatorsFromSupabase(): Promise<CreatorProfile[] | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from('creators')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Could not fetch creators (tables may need to be initialized):', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    // Map database snake_case columns back to CreatorProfile interface
    return data.map((row: any): CreatorProfile => ({
      id: row.id,
      username: row.username || row.id,
      fullName: row.full_name || row.fullName || 'Creator',
      handle: row.handle,
      avatarUrl: row.avatar_url || row.avatarUrl || '/images/alex-sharma.jpg',
      coverPattern: row.cover_pattern || row.coverPattern || '',
      verifiedBadge: row.verified_badge ?? row.verifiedBadge ?? true,
      verificationSource: row.verification_source || row.verificationSource || 'Platform Verified',
      reputationTier: row.reputation_tier || row.reputationTier || 'elite',
      primaryNiche: row.primary_niche || row.primaryNiche || 'Tech & AI',
      subNiches: row.sub_niches || row.subNiches || [],
      bio: row.bio || '',
      location: row.location || { city: 'Mumbai', country: 'India', flagEmoji: '🇮🇳' },
      languages: row.languages || ['English', 'Hindi'],
      socialLinks: row.social_links || row.socialLinks || [],
      availability: row.availability || {
        status: 'available',
        label: 'Booking Available',
        slotsRemaining: 4,
        totalSlots: 6,
        earliestDelivery: 'Within 5 business days',
        responseTime: '< 3 hours'
      },
      metrics: row.metrics || {
        totalAudience: 100000,
        averageViews: 25000,
        engagementRate: 5.5,
        targetMarketPercentage: 80,
        targetMarketCountry: 'India',
        lastUpdatedDaysAgo: 1,
        ageDistribution: [],
        genderDistribution: [],
        topGeographies: [],
        topCities: [],
        platformFollowers: { youtube: 50000, instagram: 50000, linkedin: 5000 }
      },
      packages: row.packages || [],
      portfolio: row.portfolio || [],
      reviews: row.reviews || [],
      overallRating: Number(row.overall_rating ?? row.overallRating ?? 5.0),
      totalReviews: Number(row.total_reviews ?? row.totalReviews ?? 0),
      faqs: row.faq || row.faqs || [],
      addOns: row.add_ons || row.addOns || [],
      collaborationTerms: row.collaboration_terms || row.collaborationTerms || {
        paymentPolicy: '100% Milestone Escrow Protection',
        revisionPolicy: '2 free revision rounds included',
        cancellationPolicy: 'Full refund prior to script signoff',
        exclusivityNotice: 'Category exclusivity available upon request'
      }
    }));
  } catch (err) {
    console.warn('[Supabase] Network/fetch error on creators:', err);
    return null;
  }
}

/**
 * Save or update a CreatorProfile into the Supabase `creators` table.
 */
export async function saveCreatorToSupabase(creator: CreatorProfile): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const payload = {
      id: creator.id,
      username: creator.username || creator.id,
      full_name: creator.fullName,
      handle: creator.handle,
      avatar_url: creator.avatarUrl,
      cover_pattern: creator.coverPattern || '',
      bio: creator.bio,
      primary_niche: creator.primaryNiche,
      sub_niches: creator.subNiches,
      languages: creator.languages,
      location: creator.location,
      verified_badge: creator.verifiedBadge,
      verification_source: creator.verificationSource,
      reputation_tier: creator.reputationTier || 'elite',
      overall_rating: creator.overallRating,
      total_reviews: creator.totalReviews,
      metrics: creator.metrics,
      availability: creator.availability,
      packages: creator.packages,
      portfolio: creator.portfolio,
      reviews: creator.reviews,
      faq: creator.faqs,
      social_links: creator.socialLinks,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('creators')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('[Supabase] Error saving creator to database:', error.message);
      return false;
    }

    console.info(`[Supabase] Successfully saved creator "${creator.fullName}" to database.`);
    return true;
  } catch (err) {
    console.warn('[Supabase] Exception saving creator:', err);
    return false;
  }
}

/**
 * Fetch collaboration requests from the Supabase `collaboration_requests` table.
 */
export async function fetchCollaborationRequestsFromSupabase(): Promise<CollaborationRequest[] | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from('collaboration_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Could not fetch collaboration requests:', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    return data.map((row: any): CollaborationRequest => ({
      id: row.id,
      creatorId: row.creator_id || row.creatorId,
      creatorName: row.creator_name || row.creatorName,
      creatorAvatar: row.creator_avatar || row.creatorAvatar,
      creatorHandle: row.creator_handle || row.creatorHandle,
      brandName: row.brand_name || row.brandName,
      brandContactPerson: row.brand_contact_person || row.brandContactPerson,
      brandEmail: row.brand_email || row.brandEmail,
      companyWebsite: row.company_website || row.companyWebsite,
      serviceTitle: row.service_title || row.serviceTitle,
      packageId: row.package_id || row.packageId,
      budgetINR: Number(row.budget_inr ?? row.budgetINR ?? 0),
      proposedDeadline: row.proposed_deadline || row.proposedDeadline,
      campaignObjective: row.campaign_objective || row.campaignObjective,
      campaignBrief: row.campaign_brief || row.campaignBrief,
      deliverables: row.deliverables || [],
      status: row.status,
      submittedAt: row.submitted_at || row.submittedAt || 'Just now',
      pipelineStage: row.pipeline_stage || row.pipelineStage || 'proposal',
      escrowStatus: row.escrow_status || row.escrowStatus || 'unfunded',
      escrowAmountINR: Number(row.escrow_amount_inr ?? row.escrowAmountINR ?? 0),
      counterOfferINR: row.counter_offer_inr ?? row.counterOfferINR,
      counterOfferNotes: row.counter_offer_notes || row.counterOfferNotes,
      creatorNotes: row.creator_notes || row.creatorNotes,
      scriptOutline: row.script_data || row.scriptOutline,
      videoDraft: row.draft_submission || row.videoDraft,
      publishedDeliverable: row.live_link ? { liveUrl: row.live_link, platform: 'youtube', publishedAt: 'Recently' } : row.publishedDeliverable,
      brandReview: row.brand_review || row.brandReview,
      timelineEvents: row.timeline_events || row.timelineEvents || []
    }));
  } catch (err) {
    console.warn('[Supabase] Exception fetching requests:', err);
    return null;
  }
}

/**
 * Save or update a CollaborationRequest into the Supabase `collaboration_requests` table.
 */
export async function saveCollaborationRequestToSupabase(req: CollaborationRequest): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const payload = {
      id: req.id,
      creator_id: req.creatorId,
      creator_name: req.creatorName,
      creator_avatar: req.creatorAvatar,
      creator_handle: req.creatorHandle,
      brand_name: req.brandName,
      brand_contact_person: req.brandContactPerson,
      brand_email: req.brandEmail,
      company_website: req.companyWebsite,
      service_title: req.serviceTitle,
      package_id: req.packageId,
      budget_inr: req.budgetINR,
      proposed_deadline: req.proposedDeadline,
      campaign_objective: req.campaignObjective,
      campaign_brief: req.campaignBrief,
      deliverables: req.deliverables,
      status: req.status,
      pipeline_stage: req.pipelineStage,
      escrow_status: req.escrowStatus,
      escrow_amount_inr: req.escrowAmountINR,
      counter_offer_inr: req.counterOfferINR,
      counter_offer_notes: req.counterOfferNotes,
      creator_notes: req.creatorNotes,
      script_data: req.scriptOutline,
      draft_submission: req.videoDraft,
      live_link: req.publishedDeliverable?.liveUrl,
      brand_review: req.brandReview,
      timeline_events: req.timelineEvents,
      submitted_at: req.submittedAt,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('collaboration_requests')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('[Supabase] Error saving collaboration request:', error.message);
      return false;
    }

    console.info(`[Supabase] Successfully saved collaboration deal "${req.id}" to database.`);
    return true;
  } catch (err) {
    console.warn('[Supabase] Exception saving collaboration request:', err);
    return false;
  }
}

/**
 * Save or update an AuthUser into the Supabase `users` table.
 */
export async function saveUserToSupabase(user: AuthUser): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      company_name: user.companyName || null,
      handle: user.handle || null,
      niche: user.niche || null,
      avatar_url: user.avatarUrl || null,
      verified: Boolean(user.verified)
    };

    const { error } = await supabase
      .from('users')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('[Supabase] Error saving user to database:', error.message);
      return false;
    }

    console.info(`[Supabase] User "${user.name}" (${user.role}) synchronized to database.`);
    return true;
  } catch (err) {
    console.warn('[Supabase] Exception saving user:', err);
    return false;
  }
}

/**
 * Sign in user with Supabase (authenticates via Supabase Auth and fetches profile from public.users).
 */
export async function signInWithSupabase(
  email: string,
  password?: string,
  roleFallback: 'creator' | 'brand' = 'creator'
): Promise<{ user: AuthUser | null; error: string | null }> {
  const cleanEmail = email.trim().toLowerCase();

  if (!isSupabaseConfigured()) {
    const fallback: AuthUser = {
      id: `local-${Date.now()}`,
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      role: roleFallback,
      verified: true
    };
    return { user: fallback, error: null };
  }

  try {
    // 1. If password provided, execute Supabase Auth sign-in
    if (password) {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (!authError && authData?.user) {
        // Fetch custom profile from public.users table
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('email', cleanEmail)
          .maybeSingle();

        const authUser: AuthUser = {
          id: profile?.id || authData.user.id,
          name: profile?.name || authData.user.user_metadata?.name || cleanEmail.split('@')[0],
          email: profile?.email || authData.user.email || cleanEmail,
          role: (profile?.role || authData.user.user_metadata?.role || roleFallback) as any,
          companyName: profile?.company_name || authData.user.user_metadata?.companyName,
          handle: profile?.handle || authData.user.user_metadata?.handle,
          niche: profile?.niche || authData.user.user_metadata?.niche,
          avatarUrl: profile?.avatar_url || (roleFallback === 'creator' ? '/images/alex-sharma.jpg' : 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200'),
          verified: profile?.verified ?? true
        };

        return { user: authUser, error: null };
      }

      // Check if this is one of our seeded mock profiles (e.g. Alex Sharma or Razorpay Growth Team)
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (profile && (cleanEmail === 'alex@alexsharma.media' || cleanEmail === 'marketing@razorpay.com')) {
        const authUser: AuthUser = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          companyName: profile.company_name,
          handle: profile.handle,
          niche: profile.niche,
          avatarUrl: profile.avatar_url || (profile.role === 'creator' ? '/images/alex-sharma.jpg' : 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200'),
          verified: profile.verified
        };
        return { user: authUser, error: null };
      }

      // If credentials failed and not a demo account, return Supabase Auth's message
      if (authError) {
        return { user: null, error: authError.message || 'Invalid email or password.' };
      }
    }

    // 2. Check if user already exists in public.users table (for 1-click or quick testing)
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (profile) {
      const authUser: AuthUser = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        companyName: profile.company_name,
        handle: profile.handle,
        niche: profile.niche,
        avatarUrl: profile.avatar_url || (profile.role === 'creator' ? '/images/alex-sharma.jpg' : 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200'),
        verified: profile.verified
      };
      return { user: authUser, error: null };
    }

    // 3. Fallback for demo or rapid testing
    const fallbackUser: AuthUser = {
      id: `user-${Date.now()}`,
      name: cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      email: cleanEmail,
      role: roleFallback,
      companyName: roleFallback === 'brand' ? 'Brand Partner' : undefined,
      handle: roleFallback === 'creator' ? `@${cleanEmail.split('@')[0]}` : undefined,
      avatarUrl: roleFallback === 'creator' ? '/images/alex-sharma.jpg' : 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200',
      verified: true
    };
    await saveUserToSupabase(fallbackUser);
    return { user: fallbackUser, error: null };
  } catch (err: any) {
    return { user: null, error: err.message || 'Authentication error' };
  }
}

/**
 * Sign up a new user with Supabase Auth and save profile in public.users.
 */
export async function signUpWithSupabase(
  email: string,
  password: string,
  metadata: {
    name: string;
    role: 'creator' | 'brand';
    companyName?: string;
    handle?: string;
    niche?: string;
    avatarUrl?: string;
  }
): Promise<{ user: AuthUser | null; error: string | null }> {
  const cleanEmail = email.trim().toLowerCase();

  try {
    let userId = `user-${Date.now()}`;

    // Try Supabase Auth sign up
    if (isSupabaseConfigured() && password) {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name: metadata.name,
            role: metadata.role,
            companyName: metadata.companyName,
            handle: metadata.handle,
            niche: metadata.niche
          }
        }
      });

      if (authError) {
        console.warn('[Supabase] Auth signup error:', authError.message);
        return { user: null, error: authError.message };
      }

      if (authData?.user) {
        userId = authData.user.id;
      }
    }

    const newUser: AuthUser = {
      id: userId,
      name: metadata.name,
      email: cleanEmail,
      role: metadata.role,
      companyName: metadata.companyName,
      handle: metadata.handle,
      niche: metadata.niche,
      avatarUrl: metadata.avatarUrl || (metadata.role === 'creator' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80'),
      verified: true
    };

    await saveUserToSupabase(newUser);
    return { user: newUser, error: null };
  } catch (err: any) {
    return { user: null, error: err.message || 'Sign up error' };
  }
}

/**
 * Fetch active Supabase Auth session user and hydrate their profile.
 */
export async function getSupabaseSessionUser(): Promise<AuthUser | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session?.user) return null;

    const email = session.user.email;
    if (!email) return null;

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profile) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        companyName: profile.company_name,
        handle: profile.handle,
        niche: profile.niche,
        avatarUrl: profile.avatar_url || (profile.role === 'creator' ? '/images/alex-sharma.jpg' : 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200'),
        verified: profile.verified
      };
    }

    const meta = session.user.user_metadata || {};
    return {
      id: session.user.id,
      name: meta.name || email.split('@')[0],
      email,
      role: (meta.role || 'creator') as any,
      companyName: meta.companyName,
      handle: meta.handle,
      niche: meta.niche,
      avatarUrl: meta.avatarUrl || (meta.role === 'brand' ? 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200' : '/images/alex-sharma.jpg'),
      verified: true
    };
  } catch (err) {
    console.warn('[Supabase] Exception checking session:', err);
    return null;
  }
}

/**
 * Subscribe to Supabase Auth state changes across sessions.
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
  if (!isSupabaseConfigured()) return () => {};

  try {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        callback(null);
      } else if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
        const user = await getSupabaseSessionUser();
        if (user) {
          callback(user);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  } catch (err) {
    console.warn('[Supabase] Exception subscribing to auth state change:', err);
    return () => {};
  }
}

/**
 * Sign out from Supabase and clear local storage session.
 */
export async function signOutFromSupabase(): Promise<void> {
  try {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
  } catch (err) {
    console.warn('[Supabase] SignOut error:', err);
  } finally {
    localStorage.removeItem('creatorly_auth_user');
  }
}

/**
 * Fetch brand campaigns from Supabase `campaigns` table.
 */
export async function fetchCampaignsFromSupabase(): Promise<any[] | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Error fetching campaigns:', error.message);
      return null;
    }

    if (!data || data.length === 0) return null;

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      objective: row.objective || '',
      status: row.status || 'Active',
      startDate: row.start_date || '',
      endDate: row.end_date || '',
      totalBudgetINR: Number(row.total_budget_inr || 0),
      spentBudgetINR: Number(row.spent_budget_inr || 0),
      creatorIds: row.creator_ids || [],
      milestones: row.milestones || [],
      deliverablesCount: Number(row.deliverables_count || 0),
      completedDeliverablesCount: Number(row.completed_deliverables_count || 0)
    }));
  } catch (err) {
    console.warn('[Supabase] Exception fetching campaigns:', err);
    return null;
  }
}

/**
 * Save or update a Brand Campaign in Supabase `campaigns` table.
 */
export async function saveCampaignToSupabase(camp: any): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const payload = {
      id: camp.id,
      name: camp.name,
      objective: camp.objective,
      status: camp.status,
      start_date: camp.startDate,
      end_date: camp.endDate,
      total_budget_inr: camp.totalBudgetINR,
      spent_budget_inr: camp.spentBudgetINR,
      creator_ids: camp.creatorIds,
      milestones: camp.milestones,
      deliverables_count: camp.deliverablesCount,
      completed_deliverables_count: camp.completedDeliverablesCount,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('campaigns')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('[Supabase] Error saving campaign:', error.message);
      return false;
    }

    console.info(`[Supabase] Campaign "${camp.name}" saved to database.`);
    return true;
  } catch (err) {
    console.warn('[Supabase] Exception saving campaign:', err);
    return false;
  }
}

/**
 * Save an Agency Lead consultation request to Supabase `agency_leads` table.
 */
export async function saveAgencyLeadToSupabase(lead: {
  agencyName: string;
  agencyEmail: string;
  spendTarget: string;
}): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const payload = {
      id: `AGN-${Date.now().toString().slice(-6)}`,
      agency_name: lead.agencyName,
      agency_email: lead.agencyEmail,
      spend_target: lead.spendTarget,
      created_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('agency_leads')
      .insert([payload]);

    if (error) {
      console.warn('[Supabase] Error saving agency lead:', error.message);
      return false;
    }

    console.info(`[Supabase] Agency lead for "${lead.agencyName}" saved to database.`);
    return true;
  } catch (err) {
    console.warn('[Supabase] Exception saving agency lead:', err);
    return false;
  }
}

/**
 * Save a Support Concierge ticket to Supabase `support_tickets` table.
 */
export async function saveSupportTicketToSupabase(ticket: {
  ticketId: string;
  nameAndEmail: string;
  topic: string;
  description: string;
}): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const payload = {
      id: ticket.ticketId,
      user_info: ticket.nameAndEmail,
      topic: ticket.topic,
      description: ticket.description,
      status: 'open',
      created_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('support_tickets')
      .insert([payload]);

    if (error) {
      console.warn('[Supabase] Error saving support ticket:', error.message);
      return false;
    }

    console.info(`[Supabase] Support ticket "${ticket.ticketId}" saved to database.`);
    return true;
  } catch (err) {
    console.warn('[Supabase] Exception saving support ticket:', err);
    return false;
  }
}

/**
 * Real-time PostgreSQL subscription for live deal updates across browsers.
 */
export function subscribeToCollaborationRequests(
  onInsertOrUpdate: (req: CollaborationRequest) => void
): () => void {
  if (!isSupabaseConfigured()) return () => {};

  try {
    const channel = supabase
      .channel('collab-requests-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'collaboration_requests' },
        (payload) => {
          if (payload.new) {
            const row: any = payload.new;
            const mapped: CollaborationRequest = {
              id: row.id,
              creatorId: row.creator_id || row.creatorId,
              creatorName: row.creator_name || row.creatorName,
              creatorAvatar: row.creator_avatar || row.creatorAvatar,
              creatorHandle: row.creator_handle || row.creatorHandle,
              brandName: row.brand_name || row.brandName,
              brandContactPerson: row.brand_contact_person || row.brandContactPerson,
              brandEmail: row.brand_email || row.brandEmail,
              companyWebsite: row.company_website || row.companyWebsite,
              serviceTitle: row.service_title || row.serviceTitle,
              packageId: row.package_id || row.packageId,
              budgetINR: Number(row.budget_inr ?? row.budgetINR ?? 0),
              proposedDeadline: row.proposed_deadline || row.proposedDeadline,
              campaignObjective: row.campaign_objective || row.campaignObjective,
              campaignBrief: row.campaign_brief || row.campaignBrief,
              deliverables: row.deliverables || [],
              status: row.status,
              submittedAt: row.submitted_at || row.submittedAt || 'Just now',
              pipelineStage: row.pipeline_stage || row.pipelineStage || 'proposal',
              escrowStatus: row.escrow_status || row.escrowStatus || 'unfunded',
              escrowAmountINR: Number(row.escrow_amount_inr ?? row.escrowAmountINR ?? 0),
              counterOfferINR: row.counter_offer_inr ?? row.counterOfferINR,
              counterOfferNotes: row.counter_offer_notes || row.counterOfferNotes,
              creatorNotes: row.creator_notes || row.creatorNotes,
              scriptOutline: row.script_data || row.scriptOutline,
              videoDraft: row.draft_submission || row.videoDraft,
              publishedDeliverable: row.live_link ? { liveUrl: row.live_link, platform: 'youtube', publishedAt: 'Recently' } : row.publishedDeliverable,
              brandReview: row.brand_review || row.brandReview,
              timelineEvents: row.timeline_events || row.timelineEvents || []
            };
            onInsertOrUpdate(mapped);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('[Supabase] Exception setting up realtime subscription:', err);
    return () => {};
  }
}

