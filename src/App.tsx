import React, { useState } from 'react';
import type {
  CreatorProfile,
  CurrencyCode,
  ServicePackage,
  CollaborationRequest,
  CollaborationRequestStatus,
  BookingSubmissionData,
  AuthUser,
  UserRole
} from './types/creator';
import { ALL_CREATORS, INITIAL_COLLABORATION_REQUESTS } from './data/mockCreatorsList';
import { GlobalNavbar } from './components/GlobalNavbar';
import { SmartMatchSection } from './components/SmartMatchSection';
import { DiscoverDirectory } from './components/DiscoverDirectory';
import { CreatorProfilePage } from './components/CreatorProfilePage';
import { CreatorInbox } from './components/CreatorInbox';
import { CompareModal } from './components/CompareModal';
import { CompareFloatingBar } from './components/CompareFloatingBar';
import { CreatorOnboardingModal } from './components/CreatorOnboardingModal';
import { CreatorWorkspace } from './components/CreatorWorkspace';
import { BrandDashboard } from './components/BrandDashboard';
import { AuthModal } from './components/AuthModal';
import { AuthPage } from './components/AuthPage';
import { BookingModal } from './components/BookingModal';
import { GlobalFooter } from './components/GlobalFooter';
import { NotificationToast } from './components/NotificationToast';
import SculptureHero from '@/components/ui/liquid-sculpture-hero';
import { MarketplaceInfoPages } from './components/pages/MarketplaceInfoPages';

export const App: React.FC = () => {
  const [creators, setCreators] = useState<CreatorProfile[]>(ALL_CREATORS);
  const [activeView, setActiveView] = useState<'smartmatch' | 'discover' | 'creator-profile' | 'inbox' | 'kinetic-hero' | 'auth' | 'workspace' | 'info-page'>('creator-profile');
  const [activePageSlug, setActivePageSlug] = useState<string>('about-creatorly');
  const [previousView, setPreviousView] = useState<string>('creator-profile');
  const [selectedCreator, setSelectedCreator] = useState<CreatorProfile>(ALL_CREATORS[0]);
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>('INR');
  const [shortlistedCreatorIds, setShortlistedCreatorIds] = useState<string[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [onboardingModalOpen, setOnboardingModalOpen] = useState(false);
  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>(INITIAL_COLLABORATION_REQUESTS);
  const [targetPipelineRequestId, setTargetPipelineRequestId] = useState<string | null>(null);

  // User Authentication & Session State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('creatorly_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'signin' | 'signup'>('signin');
  const [authModalInitialRole, setAuthModalInitialRole] = useState<UserRole>('creator');
  const [authTargetDestination, setAuthTargetDestination] = useState<'workspace' | 'discover' | 'pipeline' | 'storefront'>('discover');
  const [pipelinePerspective, setPipelinePerspective] = useState<'creator' | 'brand'>('creator');

  // Quick booking modal (from SmartMatch, Discover, or Compare)
  const [quickBookingCreator, setQuickBookingCreator] = useState<CreatorProfile | null>(null);
  const [quickBookingPackage, setQuickBookingPackage] = useState<ServicePackage | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleOpenAuthWithDestination = (
    tab: 'signin' | 'signup' = 'signin',
    role: UserRole = 'creator',
    destination: 'workspace' | 'discover' | 'pipeline' | 'storefront' = (role === 'creator' ? 'workspace' : 'discover')
  ) => {
    if (activeView !== 'auth') {
      setPreviousView(activeView);
    }
    setAuthModalInitialTab(tab);
    setAuthModalInitialRole(role);
    setAuthTargetDestination(destination);
    setActiveView('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (user: AuthUser, destination?: 'pipeline' | 'storefront' | 'discover' | 'workspace') => {
    setCurrentUser(user);
    localStorage.setItem('creatorly_auth_user', JSON.stringify(user));
    setAuthModalOpen(false);
    if (user.role === 'creator') {
      setPipelinePerspective('creator');
    } else {
      setPipelinePerspective('brand');
    }

    const target = destination || authTargetDestination || (user.role === 'creator' ? 'workspace' : 'discover');

    if (target === 'workspace') {
      setActiveView('workspace');
    } else if (target === 'discover') {
      setActiveView('discover');
    } else if (target === 'pipeline') {
      setActiveView('inbox');
    } else if (target === 'storefront') {
      setActiveView('creator-profile');
    } else {
      setActiveView(user.role === 'creator' ? 'workspace' : 'discover');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Welcome, ${user.name}! Logged in as ${user.role === 'creator' ? 'Creator' : 'User (Brand)'}.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('creatorly_auth_user');
    setActiveView('creator-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('You have been logged out.');
  };

  const handleOpenAuth = (tab: 'signin' | 'signup' = 'signin', role: UserRole = 'creator') => {
    handleOpenAuthWithDestination(tab, role, role === 'creator' ? 'workspace' : 'discover');
  };

  // Toggle creator shortlist for comparison
  const handleToggleCompare = (creator: CreatorProfile) => {
    setShortlistedCreatorIds((prev) => {
      if (prev.includes(creator.id)) {
        showToast(`Removed ${creator.fullName} from comparison.`);
        return prev.filter((id) => id !== creator.id);
      } else {
        if (prev.length >= 4) {
          showToast('You can compare up to 4 creators side-by-side.');
          return prev;
        }
        showToast(`Added ${creator.fullName} to comparison.`);
        return [...prev, creator.id];
      }
    });
  };

  const isCreatorInCompare = (creatorId: string) => shortlistedCreatorIds.includes(creatorId);

  const shortlistedCreators = creators.filter((c) => shortlistedCreatorIds.includes(c.id));

  // Navigate to individual creator profile storefront
  const handleSelectCreator = (creator: CreatorProfile) => {
    setSelectedCreator(creator);
    setPreviousView(activeView);
    setActiveView('creator-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Viewing ${creator.fullName}'s verified profile`);
  };

  // Trigger quick booking
  const handleInitiateBooking = (creator: CreatorProfile, packageItem?: ServicePackage) => {
    setQuickBookingCreator(creator);
    setQuickBookingPackage(packageItem || creator.packages[0]);
  };

  // Submission handler for bookings -> updates Creator Inbox & Pipeline
  const handleBookingSubmitted = (booking: BookingSubmissionData, creator: CreatorProfile) => {
    const newRequest: CollaborationRequest = {
      id: booking.referenceId,
      creatorId: creator.id,
      creatorName: creator.fullName,
      creatorAvatar: creator.avatarUrl,
      creatorHandle: creator.handle,
      brandName: booking.brandName,
      brandContactPerson: booking.contactName,
      brandEmail: booking.contactEmail,
      companyWebsite: booking.companyWebsite,
      serviceTitle: booking.packageName,
      packageId: booking.packageId,
      budgetINR: booking.totalPriceINR,
      proposedDeadline: booking.preferredDate || 'Within 7 business days',
      campaignObjective: booking.campaignObjective,
      campaignBrief: booking.campaignBrief,
      deliverables: [
        booking.packageName,
        ...booking.selectedAddOns.map(a => `Add-on: ${a}`)
      ],
      status: 'new',
      submittedAt: 'Just now',
      pipelineStage: 'proposal',
      escrowStatus: 'unfunded',
      escrowAmountINR: booking.totalPriceINR,
      timelineEvents: [
        {
          id: `ev-${Date.now()}`,
          timestamp: 'Just now',
          actor: 'brand',
          action: 'Booking Request Submitted',
          details: `${booking.brandName} submitted brief for ${booking.packageName} (Budget: ₹${booking.totalPriceINR.toLocaleString('en-IN')}).`
        }
      ]
    };

    setCollaborationRequests((prev) => [newRequest, ...prev]);
    setTargetPipelineRequestId(booking.referenceId);
    showToast(`Campaign ${booking.referenceId} submitted to ${creator.fullName}! Trackable in Workflow Pipeline.`);
  };

  // Navigate directly to pipeline deal
  const handleViewInPipeline = (requestId: string) => {
    setTargetPipelineRequestId(requestId);
    setQuickBookingCreator(null);
    setQuickBookingPackage(null);
    setActiveView('inbox');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Tracking deal ${requestId} in Workflow Pipeline`);
  };

  // Update request status (Accept, Decline, Counter Quote) in Creator Inbox
  const handleUpdateRequestStatus = (
    requestId: string,
    newStatus: CollaborationRequestStatus,
    notes?: string,
    counterOffer?: number
  ) => {
    setCollaborationRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          return {
            ...req,
            status: newStatus,
            creatorNotes: notes || req.creatorNotes,
            counterOfferINR: counterOffer !== undefined ? counterOffer : req.counterOfferINR,
            counterOfferNotes: counterOffer !== undefined ? notes : req.counterOfferNotes
          };
        }
        return req;
      })
    );
  };

  // Full collaboration request updater (for pipeline stages, escrow, scripts, drafts)
  const handleUpdateCollaborationRequest = (updatedReq: CollaborationRequest, toastNotice?: string) => {
    setCollaborationRequests((prev) =>
      prev.map((r) => (r.id === updatedReq.id ? updatedReq : r))
    );
    if (toastNotice) showToast(toastNotice);
  };

  // Complete deal & publish verified review to creator's public profile
  const handleCompleteWithReview = (requestId: string, review: { rating: number; reviewText: string }) => {
    let targetCreatorId = '';
    let brandName = '';
    let serviceTitle = '';
    let reviewerName = '';

    setCollaborationRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          targetCreatorId = r.creatorId;
          brandName = r.brandName;
          serviceTitle = r.serviceTitle;
          reviewerName = r.brandContactPerson;

          const newEvents = [
            {
              id: `ev-${Date.now()}`,
              timestamp: 'Just now',
              actor: 'brand' as const,
              action: 'Escrow Payout Released & Verified Review Written',
              details: `₹${r.budgetINR.toLocaleString('en-IN')} released to creator. 5-star verified review posted.`
            },
            ...(r.timelineEvents || [])
          ];

          return {
            ...r,
            status: 'completed',
            pipelineStage: 'live_completed',
            escrowStatus: 'released',
            brandReview: {
              rating: review.rating,
              reviewText: review.reviewText,
              submittedAt: 'Today'
            },
            timelineEvents: newEvents
          };
        }
        return r;
      })
    );

    // Add review to creator profile
    if (targetCreatorId) {
      setCreators((prev) =>
        prev.map((c) => {
          if (c.id === targetCreatorId) {
            const newReview = {
              id: `rev-${Date.now()}`,
              brandName: brandName || 'Verified Brand',
              brandLogo: (brandName || 'VB').slice(0, 2).toUpperCase(),
              reviewerName: reviewerName || 'Marketing Lead',
              reviewerRole: 'Brand Partner',
              campaignType: serviceTitle || 'Collaboration Deliverable',
              rating: review.rating,
              date: 'October 2026',
              content: review.reviewText,
              metricHighlight: 'Verified Deal Fulfilled via Creatorly Escrow',
              verifiedTransaction: true
            };
            const updatedReviews = [newReview, ...(c.reviews || [])];
            const avgRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;

            return {
              ...c,
              reviews: updatedReviews,
              totalReviews: updatedReviews.length,
              overallRating: Math.round(avgRating * 10) / 10
            };
          }
          return c;
        })
      );
    }
  };

  // Creator registration onboarding
  const handleCreatorCreated = (newCreator: CreatorProfile) => {
    setCreators((prev) => [newCreator, ...prev]);
    setSelectedCreator(newCreator);
    setActiveView('creator-profile');
    showToast(`Congratulations ${newCreator.fullName}! Your creator storefront is live.`);
  };

  const handleGlobalRequestBooking = () => {
    if (activeView === 'creator-profile') {
      const bookingBtn = document.getElementById('btn-request-booking');
      if (bookingBtn) {
        bookingBtn.click();
        return;
      }
    }
    // Otherwise open booking for default creator or top match
    handleInitiateBooking(selectedCreator, selectedCreator.packages[0]);
  };

  const unreadInboxCount = collaborationRequests.filter(r => r.status === 'new').length;

  const handleNavigateToPage = (slug: string) => {
    setActivePageSlug(slug);
    setActiveView('info-page');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="creatorly-app">
      {/* Top Global Navigation Bar (shown when outside individual creator storefront, auth page, creator workspace, and info pages) */}
      {activeView !== 'creator-profile' && activeView !== 'auth' && activeView !== 'workspace' && activeView !== 'discover' && activeView !== 'info-page' && (
        <GlobalNavbar
          currentCurrency={currentCurrency}
          onCurrencyChange={(code) => setCurrentCurrency(code)}
          onRequestBooking={handleGlobalRequestBooking}
          onShowToast={showToast}
          activeView={activeView}
          onNavigate={(view) => {
            setActiveView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          compareCount={shortlistedCreatorIds.length}
          onOpenCompare={() => setCompareModalOpen(true)}
          onOpenOnboarding={() => handleOpenAuth('signup', 'creator')}
          unreadInboxCount={unreadInboxCount}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
        />
      )}

      {/* VIEW 1: SmartMatch Engine (Differentiating Feature) */}
      {activeView === 'smartmatch' && (
        <div className="view-wrapper">
          <SmartMatchSection
            creators={creators}
            currentCurrency={currentCurrency}
            onSelectCreator={handleSelectCreator}
            onInitiateBooking={handleInitiateBooking}
            onToggleCompare={handleToggleCompare}
            isCreatorInCompare={isCreatorInCompare}
            onShowToast={showToast}
          />
          {/* Also include Discover Directory below SmartMatch for full exploration */}
          <DiscoverDirectory
            creators={creators}
            currentCurrency={currentCurrency}
            onSelectCreator={handleSelectCreator}
            onInitiateBooking={handleInitiateBooking}
            onToggleCompare={handleToggleCompare}
            isCreatorInCompare={isCreatorInCompare}
            onShowToast={showToast}
            onOpenOnboarding={() => setOnboardingModalOpen(true)}
          />
        </div>
      )}

      {/* VIEW 2: Brand/Client Discovery Marketplace (Protected: Requires User / Brand Login) */}
      {activeView === 'discover' && (
        (!currentUser || currentUser.role !== 'brand') ? (
          <div className="view-wrapper auth-page-view">
            <AuthPage
              initialTab="signin"
              initialRole="brand"
              targetDestination="discover"
              onLoginSuccess={handleLoginSuccess}
              onBack={() => {
                setActiveView('creator-profile');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onShowToast={showToast}
            />
          </div>
        ) : (
          <BrandDashboard
            creators={creators}
            currentCurrency={currentCurrency}
            onSelectCreator={handleSelectCreator}
            onShowToast={showToast}
            onNavigateToWorkspace={() => {
              if (!currentUser || currentUser.role !== 'creator') {
                handleOpenAuthWithDestination('signin', 'creator', 'workspace');
              } else {
                setActiveView('workspace');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            currentUser={currentUser}
            onLogout={handleLogout}
            onReturnToHome={() => {
              setActiveView('creator-profile');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )
      )}

      {/* VIEW 3: Creator Public Profile Storefront (/creators/:username) */}
      {activeView === 'creator-profile' && (
        <div className="view-wrapper">
          <CreatorProfilePage
            creator={selectedCreator}
            creators={creators}
            onSelectCreator={handleSelectCreator}
            currentCurrency={currentCurrency}
            onShowToast={showToast}
            onBackToMarketplace={() => {
              if (!currentUser || currentUser.role !== 'brand') {
                handleOpenAuthWithDestination('signin', 'brand', 'discover');
              } else {
                setActiveView('discover');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            onNavigateToMarketplace={() => {
              if (!currentUser || currentUser.role !== 'brand') {
                handleOpenAuthWithDestination('signin', 'brand', 'discover');
              } else {
                setActiveView('discover');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            onBookingSubmitted={handleBookingSubmitted}
            onOpenPipeline={(perspective) => {
              if (perspective) setPipelinePerspective(perspective);
              setActiveView('inbox');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            currentUser={currentUser}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
            onOpenAuth={handleOpenAuth}
            onNavigateToWorkspace={() => {
              if (!currentUser || currentUser.role !== 'creator') {
                handleOpenAuthWithDestination('signin', 'creator', 'workspace');
              } else {
                setActiveView('workspace');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            previousView={previousView}
            onNavigateToPage={handleNavigateToPage}
          />
        </div>
      )}

      {/* VIEW: Dedicated Marketplace Info Pages (All 20 Footer Subpages) */}
      {activeView === 'info-page' && (
        <div className="view-wrapper">
          <MarketplaceInfoPages
            pageSlug={activePageSlug}
            onNavigateToPage={handleNavigateToPage}
            onReturnToHome={() => {
              setActiveView('creator-profile');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectCreator={handleSelectCreator}
            creators={creators}
            currentCurrency={currentCurrency}
            onShowToast={showToast}
            onOpenBookingModal={(creator) => {
              handleSelectCreator(creator);
              handleInitiateBooking(creator, creator.packages[0]);
            }}
          />
        </div>
      )}

      {/* VIEW 4: Creator Collaboration & Workflow Pipeline Hub */}
      {activeView === 'inbox' && (
        <div className="view-wrapper">
          <CreatorInbox
            requests={collaborationRequests}
            creators={creators}
            currentCurrency={currentCurrency}
            onUpdateRequestStatus={handleUpdateRequestStatus}
            onUpdateCollaborationRequest={handleUpdateCollaborationRequest}
            onCompleteWithReview={handleCompleteWithReview}
            targetRequestId={targetPipelineRequestId}
            onShowToast={showToast}
            onSelectCreator={handleSelectCreator}
            onInitiateBooking={handleInitiateBooking}
            initialPerspective={pipelinePerspective}
          />
        </div>
      )}

      {/* VIEW 5: Liquid Kinetic Sculpture Hero Showcase */}
      {activeView === 'kinetic-hero' && (
        <div className="view-wrapper kinetic-hero-view">
          <div className="kinetic-hero-top-bar">
            <button
              type="button"
              className="btn-back-marketplace"
              onClick={() => {
                setActiveView('discover');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              ← Back to Creator Marketplace
            </button>
            <span className="kinetic-hero-tip">
              Move cursor across the 3D sculpture to liquefy ~100k GPU simulated particles
            </span>
          </div>
          <SculptureHero
            brand="Creatorly®"
            headline="Influence that
moves culture."
            headlineAccent="moves culture."
            eyebrow="Verified Creators • Milestone Escrow"
            body="Discover and book vetted Indian creators with audited API metrics, transparent fixed pricing, and milestone-protected escrow payouts."
            primaryCta={{ label: "Explore Creators", href: "#" }}
            secondaryCta={{ label: "Campaign Studio", href: "#" }}
            backdropText="creatorly"
            background="#F8FAFC"
            darkBackground="#0F172A"
            accentColor="#059669"
            textColor="#0F172A"
            height="calc(100vh - 120px)"
            theme="light"
            themeToggle={true}
            showNav={false}
          />
        </div>
      )}

      {/* VIEW 6: Dedicated Full-Page Auth (Login / Sign In / Sign Up) */}
      {activeView === 'auth' && (
        <div className="view-wrapper auth-page-view">
          <AuthPage
            initialTab={authModalInitialTab}
            initialRole={authModalInitialRole}
            targetDestination={authTargetDestination}
            onLoginSuccess={handleLoginSuccess}
            onBack={() => {
              setActiveView((previousView as any) || 'creator-profile');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onShowToast={showToast}
          />
        </div>
      )}

      {/* VIEW 7: Dedicated Creator Workspace (Protected: Requires Creator Login) */}
      {activeView === 'workspace' && (
        (!currentUser || currentUser.role !== 'creator') ? (
          <div className="view-wrapper auth-page-view">
            <AuthPage
              initialTab="signin"
              initialRole="creator"
              targetDestination="workspace"
              onLoginSuccess={handleLoginSuccess}
              onBack={() => {
                setActiveView('creator-profile');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onShowToast={showToast}
            />
          </div>
        ) : (
          <div className="view-wrapper workspace-view">
            <CreatorWorkspace
              creator={selectedCreator}
              currentCurrency={currentCurrency}
              collaborationRequests={collaborationRequests}
              onViewPublicProfile={() => {
                setPreviousView('workspace');
                setActiveView('creator-profile');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectCreator={handleSelectCreator}
              onUpdateRequests={(updated) => setCollaborationRequests(updated)}
              onShowToast={showToast}
              currentUser={currentUser}
              onLogout={handleLogout}
              onSwitchToMarketplace={() => {
                if (!currentUser || currentUser.role !== 'brand') {
                  handleOpenAuthWithDestination('signin', 'brand', 'discover');
                } else {
                  setActiveView('discover');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            />
          </div>
        )
      )}

      {/* Sticky Bottom Floating Bar when creators are shortlisted */}
      {activeView !== 'auth' && activeView !== 'workspace' && (
        <CompareFloatingBar
          creators={shortlistedCreators}
          onOpenCompare={() => setCompareModalOpen(true)}
          onClearAll={() => {
            setShortlistedCreatorIds([]);
            showToast('Comparison cleared.');
          }}
          onRemoveCreator={(id) => {
            setShortlistedCreatorIds((prev) => prev.filter((cId) => cId !== id));
          }}
        />
      )}

      {/* Side-by-Side Comparison Modal */}
      <CompareModal
        creators={shortlistedCreators}
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        onRemoveCreator={(id) => {
          setShortlistedCreatorIds((prev) => prev.filter((cId) => cId !== id));
        }}
        onClearAll={() => {
          setShortlistedCreatorIds([]);
          setCompareModalOpen(false);
          showToast('Comparison cleared.');
        }}
        currentCurrency={currentCurrency}
        onSelectCreator={handleSelectCreator}
        onInitiateBooking={handleInitiateBooking}
      />

      {/* Creator Registration & Onboarding Modal */}
      <CreatorOnboardingModal
        isOpen={onboardingModalOpen}
        onClose={() => setOnboardingModalOpen(false)}
        onCreatorCreated={handleCreatorCreated}
        currentCurrency={currentCurrency}
      />

      {/* Unified Login, Sign In & Sign Up Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialTab={authModalInitialTab}
        initialRole={authModalInitialRole}
        onShowToast={showToast}
      />

      {/* Quick Booking Modal (when triggered from SmartMatch, Discover, or Compare) */}
      {quickBookingCreator && (
        <BookingModal
          isOpen={true}
          onClose={() => {
            setQuickBookingCreator(null);
            setQuickBookingPackage(null);
          }}
          creator={quickBookingCreator}
          initialPackage={quickBookingPackage}
          currentCurrency={currentCurrency}
          onShowToast={showToast}
          onBookingSubmitted={handleBookingSubmitted}
          onViewInPipeline={handleViewInPipeline}
        />
      )}

      {/* Global Marketplace Footer (shown on discovery and studio views) */}
      {activeView !== 'creator-profile' && activeView !== 'auth' && activeView !== 'workspace' && activeView !== 'discover' && (
        <GlobalFooter
          currentCurrency={currentCurrency}
          onCurrencyChange={(code) => setCurrentCurrency(code)}
          onShowToast={showToast}
        />
      )}

      {/* Interactive Action Toast */}
      <NotificationToast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />

      <style>{`
        .creatorly-app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-secondary);
          width: 100%;
          max-width: 100vw;
          overflow-x: hidden;
        }

        .creatorly-app:has(.bd-app-container) {
          height: 100vh;
          max-height: 100vh;
          overflow: hidden;
        }

        .view-wrapper {
          flex: 1;
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
        }

        .kinetic-hero-view {
          position: relative;
          background: #F8FAFC;
        }

        .kinetic-hero-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          background: #FFFFFF;
          border-bottom: 1px solid #E2E8F0;
          font-size: 0.85rem;
          flex-wrap: wrap;
          gap: 12px;
        }

        .btn-back-marketplace {
          background: #ECFDF5;
          border: 1px solid #A7F3D0;
          color: #059669;
          font-weight: 700;
          padding: 6px 16px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-back-marketplace:hover {
          background: #059669;
          color: #FFFFFF;
        }

        .kinetic-hero-tip {
          color: #64748B;
          font-size: 0.8rem;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default App;
