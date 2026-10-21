import React, { useState } from 'react';
import type { CreatorProfile, CurrencyCode } from '../types/creator';
import { formatCurrency } from '../data/currencies';
import { X, Check, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';


interface CreatorOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatorCreated: (newCreator: CreatorProfile) => void;
  currentCurrency: CurrencyCode;
}

export const CreatorOnboardingModal: React.FC<CreatorOnboardingModalProps> = ({
  isOpen,
  onClose,
  onCreatorCreated,
  currentCurrency
}) => {
  const [step, setStep] = useState<number>(1);
  const [fullName, setFullName] = useState('');
  const [handle, setHandle] = useState('');
  const [primaryNiche, setPrimaryNiche] = useState('Fashion & Styling');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('/images/aarohi-mehta.jpg');
  const [followersCount, setFollowersCount] = useState<number>(25000);
  const [serviceTitle, setServiceTitle] = useState('Sponsored Instagram Reel');
  const [priceInINR, setPriceInINR] = useState<number>(4500);
  const [deliveryDays, setDeliveryDays] = useState<number>(5);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const username = (handle.replace('@', '') || fullName.toLowerCase().replace(/\s+/g, '-')).toLowerCase();

    const newCreator: CreatorProfile = {
      id: `creator-${Date.now()}`,
      username: username || 'new-creator',
      fullName: fullName || 'New Creator',
      handle: handle.startsWith('@') ? handle : `@${handle || 'creator'}`,
      avatarUrl: avatarUrl || '/images/aarohi-mehta.jpg',
      verifiedBadge: false,
      verificationSource: 'Self-Registered (KYC Verification in Progress)',
      primaryNiche: primaryNiche,
      subNiches: ['General Content', 'Brand Collaborations'],
      bio: bio || 'Professional creator crafting authentic content for high-growth brands.',
      location: {
        city: city || 'Mumbai',
        country: 'India',
        flagEmoji: '🇮🇳'
      },
      languages: ['English', 'Hindi'],
      socialLinks: [
        {
          platform: 'instagram',
          name: 'Instagram',
          handle: instagramHandle || handle,
          url: 'https://instagram.com',
          followers: followersCount,
          verified: false
        }
      ],
      availability: {
        status: 'available',
        label: 'Accepting New Campaigns',
        slotsRemaining: 5,
        totalSlots: 5,
        earliestDelivery: `Within ${deliveryDays} days`,
        responseTime: '< 4 hours'
      },
      metrics: {
        totalAudience: followersCount,
        averageViews: Math.round(followersCount * 0.28),
        engagementRate: 5.2,
        targetMarketPercentage: 76,
        targetMarketCountry: 'India',
        lastUpdatedDaysAgo: 1,
        ageDistribution: [
          { label: '18-24', percentage: 45 },
          { label: '25-34', percentage: 45 },
          { label: '35+', percentage: 10 }
        ],
        genderDistribution: [
          { label: 'Female', percentage: 55 },
          { label: 'Male', percentage: 45 }
        ],
        topGeographies: [
          { country: 'India', code: 'IN', percentage: 76 },
          { country: 'Others', code: 'OTHER', percentage: 24 }
        ],
        topCities: [
          { city: city || 'Mumbai', percentage: 40 },
          { city: 'Delhi NCR', percentage: 30 },
          { city: 'Bengaluru', percentage: 30 }
        ],
        platformFollowers: {
          instagram: followersCount,
          youtube: 0,
          linkedin: 0
        }
      },
      portfolio: [],
      packages: [
        {
          id: `pkg-${Date.now()}`,
          title: serviceTitle,
          tagline: 'Standard collaboration package with direct publication.',
          priceInINR: priceInINR,
          popular: true,
          platform: 'Instagram',
          deliveryDays: deliveryDays,
          includedRevisions: 1,
          publishingIncluded: true,
          publishingDestination: "Creator's Feed",
          organicUsageDays: 30,
          paidUsageRightsIncluded: false,
          deliverables: [
            '1 High-quality vertical video',
            'Brand tag and caption link',
            '1 round of revisions'
          ],
          bestFor: 'Brand awareness and social reach'
        }
      ],
      addOns: [],
      reviews: [],
      overallRating: 5.0,
      totalReviews: 0,
      faqs: [],
      collaborationTerms: {
        paymentPolicy: 'Creatorly Escrow milestone guarantee.',
        revisionPolicy: '1 revision included in standard turnaround.',
        cancellationPolicy: 'Creatorly flexible cancellation policy.',
        exclusivityNotice: 'Competitor exclusivity negotiated separately.'
      }
    };

    onCreatorCreated(newCreator);
    onClose();
  };

  return (
    <div className="onboard-overlay" onClick={onClose}>
      <div className="onboard-container" onClick={(e) => e.stopPropagation()}>
        <div className="onboard-header">
          <div>
            <h3>Join Creatorly as a Creator</h3>
            <p>Set up your professional storefront and receive vetted brand collaboration requests.</p>
          </div>
          <button type="button" className="btn-close-onboard" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="onboard-steps-bar">
          <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
            <span className="step-num">1</span>
            <span>Profile</span>
          </div>
          <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
            <span className="step-num">2</span>
            <span>Socials</span>
          </div>
          <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
            <span className="step-num">3</span>
            <span>Service & Pricing</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="onboard-form">
          {step === 1 && (
            <div className="step-pane">
              <div className="form-group">
                <label>Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sahil Khan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="onboard-input"
                />
              </div>

              {/* Avatar Picker */}
              <div className="form-group">
                <label>Choose Profile Portrait</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', overflowX: 'auto', padding: '6px 0' }}>
                  {[
                    { url: '/images/aarohi-mehta.jpg', name: 'Aarohi' },
                    { url: '/images/maya-james.jpg', name: 'Maya' },
                    { url: '/images/jun-park.jpg', name: 'Jun' },
                    { url: '/images/ananya-roy.jpg', name: 'Ananya' },
                    { url: '/images/priya-patel.jpg', name: 'Priya' },
                    { url: '/images/rohit-verma.jpg', name: 'Rohit' },
                    { url: '/images/alex-sharma.jpg', name: 'Alex' },
                  ].map((av) => (
                    <button
                      key={av.url}
                      type="button"
                      onClick={() => setAvatarUrl(av.url)}
                      style={{
                        border: avatarUrl === av.url ? '3px solid #059669' : '2px solid #E2E8F0',
                        borderRadius: '50%',
                        padding: '2px',
                        background: 'transparent',
                        cursor: 'pointer',
                        transform: avatarUrl === av.url ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.15s ease'
                      }}
                      title={av.name}
                    >
                      <img
                        src={av.url}
                        alt={av.name}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Handle / Public Username *</label>
                  <input
                    type="text"
                    required
                    placeholder="@sahilcreates"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="onboard-input"
                  />
                </div>

                <div className="form-group">
                  <label>City & Country *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai, India"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="onboard-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Primary Content Category *</label>
                <select
                  value={primaryNiche}
                  onChange={(e) => setPrimaryNiche(e.target.value)}
                  className="onboard-select"
                >
                  <option value="Fashion & Styling">Fashion & Styling</option>
                  <option value="Technology, Education & AI">Technology, Education & AI</option>
                  <option value="Fitness & Sports">Fitness & Sports</option>
                  <option value="Food & Travel">Food & Travel</option>
                  <option value="Personal Finance & Business">Personal Finance & Business</option>
                </select>
              </div>

              <div className="form-group">
                <label>Professional Biography</label>
                <textarea
                  rows={3}
                  placeholder="Tell brands what you create and what makes your audience unique..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="onboard-textarea"
                />
              </div>

              <div className="onboard-pane-actions">
                <button
                  type="button"
                  className="btn-next-step"
                  onClick={() => {
                    if (!fullName.trim() || !handle.trim()) {
                      alert('Please provide your name and handle.');
                      return;
                    }
                    setStep(2);
                  }}
                >
                  <span>Continue to Socials</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-pane">
              <div className="form-group">
                <label>Instagram Handle / Profile Link</label>
                <input
                  type="text"
                  placeholder="https://instagram.com/yourhandle"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  className="onboard-input"
                />
              </div>

              <div className="form-group">
                <label>Total Combined Followers</label>
                <input
                  type="number"
                  min={1000}
                  step={500}
                  value={followersCount}
                  onChange={(e) => setFollowersCount(Number(e.target.value))}
                  className="onboard-input"
                />
                <span className="field-hint">
                  Used to generate preliminary audience metrics before API verification handshake.
                </span>
              </div>

              <div className="verification-notice-box">
                <ShieldCheck size={16} />
                <p>
                  <strong>Verification Note:</strong> You can link your Instagram Graph API or YouTube Studio OAuth token after registration to earn the "Verified Metrics" badge.
                </p>
              </div>

              <div className="onboard-pane-actions split">
                <button
                  type="button"
                  className="btn-prev-step"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft size={15} />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  className="btn-next-step"
                  onClick={() => setStep(3)}
                >
                  <span>Set Up Pricing</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-pane">
              <div className="form-group">
                <label>First Service Package Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sponsored Instagram Reel"
                  value={serviceTitle}
                  onChange={(e) => setServiceTitle(e.target.value)}
                  className="onboard-input"
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Base Price (INR) *</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    step={500}
                    value={priceInINR}
                    onChange={(e) => setPriceInINR(Number(e.target.value))}
                    className="onboard-input"
                  />
                  <span className="field-hint">
                    Equivalent: {formatCurrency(priceInINR, currentCurrency)}
                  </span>
                </div>

                <div className="form-group">
                  <label>Delivery Turnaround (Days) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={30}
                    value={deliveryDays}
                    onChange={(e) => setDeliveryDays(Number(e.target.value))}
                    className="onboard-input"
                  />
                </div>
              </div>

              <div className="pricing-rule-box">
                <Check size={16} />
                <span>
                  Transparent pricing helps brands book faster. You can always add more packages or accept custom quotes later.
                </span>
              </div>

              <div className="onboard-pane-actions split">
                <button
                  type="button"
                  className="btn-prev-step"
                  onClick={() => setStep(2)}
                >
                  <ArrowLeft size={15} />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="btn-finish-onboard"
                >
                  <span>Publish My Storefront</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      <style>{`
        .onboard-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(15, 23, 42, 0.65);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(8px);
        }

        .onboard-container {
          background-color: #FFFFFF;
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 600px;
          box-shadow: 0 24px 48px -12px rgba(15, 23, 42, 0.25);
          overflow: hidden;
          border: 1px solid rgba(226, 232, 240, 0.9);
          animation: scaleUp 0.15s ease-out;
          position: relative;
        }

        .onboard-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #18181B;
        }

        .onboard-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 22px 26px;
          border-bottom: 1px solid var(--border-light);
          background: #F8FAFC;
        }

        .onboard-header h3 {
          font-size: 19px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 4px 0;
          letter-spacing: -0.02em;
        }

        .onboard-header p {
          font-size: 13.5px;
          color: var(--text-secondary);
          margin: 0;
        }

        .btn-close-onboard {
          background: rgba(15, 23, 42, 0.06);
          border: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-close-onboard:hover {
          background: rgba(15, 23, 42, 0.15);
          color: var(--text-primary);
        }

        .onboard-steps-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 26px;
          border-bottom: 1px solid var(--border-light);
          background-color: #FAFAFA;
        }

        .step-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--text-muted);
        }

        .step-item.active {
          color: #18181B;
          font-weight: 700;
        }

        .step-num {
          width: 22px;
          height: 22px;
          border-radius: var(--radius-full);
          background-color: #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
        }

        .step-item.active .step-num {
          background: #18181B;
          color: #ffffff;
          box-shadow: 0 2px 6px rgba(24, 24, 27, 0.25);
        }

        .onboard-form {
          padding: 26px;
        }

        .form-group {
          margin-bottom: 18px;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .onboard-input,
        .onboard-select,
        .onboard-textarea {
          width: 100%;
          padding: 11px 15px;
          border: 1.5px solid #CBD5E1;
          border-radius: var(--radius-md);
          font-size: 14px;
          font-family: inherit;
          color: var(--text-primary);
          background-color: #FFFFFF;
          outline: none;
          transition: all 0.2s ease;
        }

        .onboard-input:focus,
        .onboard-select:focus,
        .onboard-textarea:focus {
          border-color: #6366F1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }

        .field-hint {
          display: block;
          font-size: 11.5px;
          color: var(--text-muted);
          margin-top: 5px;
        }

        .verification-notice-box,
        .pricing-rule-box {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 18px;
          border-radius: var(--radius-lg);
          background: #F5F5F7;
          border: 1px solid rgba(0, 0, 0, 0.08);
          font-size: 13px;
          color: #1D1D1F;
          margin-bottom: 22px;
        }

        .onboard-pane-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 26px;
        }

        .onboard-pane-actions.split {
          justify-content: space-between;
        }

        .btn-prev-step {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.12);
          padding: 10px 20px;
          border-radius: var(--radius-full);
          font-size: 13.5px;
          font-weight: 600;
          color: #1D1D1F;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-prev-step:hover {
          background-color: #F5F5F7;
        }

        .btn-next-step,
        .btn-finish-onboard {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #18181B;
          color: #FFFFFF;
          border: none;
          padding: 10px 24px;
          border-radius: var(--radius-full);
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(24, 24, 27, 0.2);
        }

        .btn-next-step:hover,
        .btn-finish-onboard:hover {
          background: #09090B;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(24, 24, 27, 0.3);
        }
      `}</style>
    </div>
  );
};
