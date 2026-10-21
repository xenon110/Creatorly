import React, { useState, useEffect } from 'react';
import type { 
  CreatorProfile, 
  ServicePackage, 
  CurrencyCode, 
  BookingSubmissionData 
} from '../types/creator';
import { formatCurrency } from '../data/currencies';
import { 
  X, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  Upload,
  Download
} from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: CreatorProfile;
  initialPackage?: ServicePackage | null;
  currentCurrency: CurrencyCode;
  onShowToast: (msg: string) => void;
  onBookingSubmitted?: (booking: BookingSubmissionData, creator: CreatorProfile) => void;
  onViewInPipeline?: (referenceId: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  creator,
  initialPackage,
  currentCurrency,
  onShowToast,
  onBookingSubmitted,
  onViewInPipeline,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage>(
    initialPackage || creator.packages[1] || creator.packages[0]
  );
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  
  // Form fields
  const [brandName, setBrandName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [campaignObjective, setCampaignObjective] = useState('Brand Awareness & Consideration');
  const [targetAudience] = useState('Tech Enthusiasts & Developers (India/Global)');
  const [preferredDate, setPreferredDate] = useState('');
  const [campaignBrief, setCampaignBrief] = useState('');
  const [exclusivityRequested, setExclusivityRequested] = useState(false);
  const [briefAttachmentName, setBriefAttachmentName] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<BookingSubmissionData | null>(null);

  // Sync initialPackage when prop changes
  useEffect(() => {
    if (initialPackage) {
      setSelectedPackage(initialPackage);
    }
  }, [initialPackage]);

  // Set default preferred date (+14 days)
  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    setPreferredDate(d.toISOString().split('T')[0]);
  }, []);

  if (!isOpen) return null;

  // Price calculations
  const calculateTotalINR = () => {
    let total = selectedPackage.priceInINR;
    selectedAddOnIds.forEach((addonId) => {
      const addon = creator.addOns.find((a) => a.id === addonId);
      if (addon) total += addon.priceInINR;
    });
    return total;
  };

  const toggleAddOn = (addonId: string) => {
    if (selectedAddOnIds.includes(addonId)) {
      setSelectedAddOnIds(selectedAddOnIds.filter((id) => id !== addonId));
    } else {
      setSelectedAddOnIds([...selectedAddOnIds, addonId]);
    }
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!brandName.trim()) errs.brandName = 'Company / Brand name is required';
    if (!contactName.trim()) errs.contactName = 'Contact person name is required';
    if (!contactEmail.trim()) {
      errs.contactEmail = 'Business email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      errs.contactEmail = 'Please provide a valid work email address';
    }
    if (!campaignBrief.trim()) {
      errs.campaignBrief = 'Please outline your campaign objective or deliverables';
    } else if (campaignBrief.trim().length < 20) {
      errs.campaignBrief = 'Brief should be at least 20 characters for the creator to evaluate';
    }
    if (!preferredDate) {
      errs.preferredDate = 'Target delivery date is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextToStep2 = () => {
    setStep(2);
  };

  const handleNextToStep3 = () => {
    if (validateStep2()) {
      setStep(3);
    }
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate backend processing
    setTimeout(() => {
      const generatedRef = `CR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      const submission: BookingSubmissionData = {
        packageId: selectedPackage.id,
        packageName: selectedPackage.title,
        basePriceINR: selectedPackage.priceInINR,
        selectedAddOns: selectedAddOnIds,
        totalPriceINR: calculateTotalINR(),
        brandName,
        contactName,
        contactEmail,
        companyWebsite,
        campaignObjective,
        targetAudience,
        preferredDate,
        campaignBrief,
        exclusivityRequested,
        submittedAt: new Date().toLocaleString(),
        referenceId: generatedRef,
      };

      setSubmittedData(submission);
      setIsSubmitting(false);
      setStep(4);
      onBookingSubmitted?.(submission, creator);
      onShowToast(`Booking request ${generatedRef} submitted successfully!`);
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBriefAttachmentName(e.target.files[0].name);
      onShowToast(`Attached brief: ${e.target.files[0].name}`);
    }
  };

  const resetModal = () => {
    setStep(1);
    setSelectedAddOnIds([]);
    setBrandName('');
    setContactName('');
    setContactEmail('');
    setCompanyWebsite('');
    setCampaignBrief('');
    setErrors({});
    setSubmittedData(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content booking-modal-window" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Header */}
        <div className="booking-modal-header">
          <div className="header-meta">
            <div className="creator-mini-id">
              <img src={creator.avatarUrl} alt={creator.fullName} className="creator-thumb" />
              <div>
                <span className="booking-title">Booking Request for {creator.fullName}</span>
                <span className="booking-handle">{creator.handle} • {creator.primaryNiche}</span>
              </div>
            </div>
          </div>

          <button className="close-btn" onClick={onClose} aria-label="Close booking modal">
            <X size={18} />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        {step < 4 && (
          <div className="wizard-stepper">
            <div className={`step-node ${step >= 1 ? 'active' : ''}`}>
              <span className="step-num">1</span>
              <span className="step-title">Package & Add-ons</span>
            </div>
            <div className="step-line"></div>
            <div className={`step-node ${step >= 2 ? 'active' : ''}`}>
              <span className="step-num">2</span>
              <span className="step-title">Campaign Brief</span>
            </div>
            <div className="step-line"></div>
            <div className={`step-node ${step >= 3 ? 'active' : ''}`}>
              <span className="step-num">3</span>
              <span className="step-title">Review & Submit</span>
            </div>
          </div>
        )}

        {/* Modal Body: Multi-Step Content */}
        <div className="booking-modal-body">
          {/* STEP 1: Package Selection & Add-Ons */}
          {step === 1 && (
            <div className="wizard-step-content">
              <div className="step-instruction">
                <h3>1. Select Service Package & Options</h3>
                <p>Customize deliverables and licensing rights for your campaign.</p>
              </div>

              {/* Package selector pills */}
              <div className="package-tabs-list">
                {creator.packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    className={`pkg-tab ${selectedPackage.id === pkg.id ? 'active' : ''}`}
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    <div className="tab-left">
                      <span className="tab-name">{pkg.title}</span>
                      <span className="tab-sub">{pkg.platform} • {pkg.deliveryDays}d delivery</span>
                    </div>
                    <span className="tab-price">{formatCurrency(pkg.priceInINR, currentCurrency)}</span>
                  </button>
                ))}
              </div>

              {/* Selected Package Details Card */}
              <div className="selected-pkg-summary card">
                <div className="pkg-summary-top">
                  <div>
                    <h4>{selectedPackage.title}</h4>
                    <p className="summary-desc">{selectedPackage.tagline}</p>
                  </div>
                  <div className="summary-price-badge">
                    <span>{formatCurrency(selectedPackage.priceInINR, currentCurrency)}</span>
                  </div>
                </div>

                <div className="summary-checklist">
                  {selectedPackage.deliverables.map((del, dIdx) => (
                    <div key={dIdx} className="check-row">
                      <Check size={14} className="text-success" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add-ons selection */}
              <div className="addons-selection-section">
                <h4>Optional Campaign Add-Ons</h4>
                <div className="addons-interactive-list">
                  {creator.addOns.map((addon) => {
                    const isChecked = selectedAddOnIds.includes(addon.id);
                    return (
                      <div 
                        key={addon.id} 
                        className={`interactive-addon-item ${isChecked ? 'selected' : ''}`}
                        onClick={() => toggleAddOn(addon.id)}
                      >
                        <div className="addon-checkbox">
                          {isChecked ? <Check size={13} className="text-white" /> : null}
                        </div>
                        <div className="addon-info">
                          <span className="addon-title">{addon.name}</span>
                          <span className="addon-explanation">{addon.description}</span>
                        </div>
                        <div className="addon-amount">
                          +{formatCurrency(addon.priceInINR, currentCurrency)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live Running Total */}
              <div className="order-total-bar">
                <div className="total-left">
                  <span className="total-label">Total Proposed Budget:</span>
                  <span className="total-note">Zero payment charged today • Escrow secured</span>
                </div>
                <div className="total-right">
                  <span className="total-number">{formatCurrency(calculateTotalINR(), currentCurrency)}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Campaign Brief Details */}
          {step === 2 && (
            <div className="wizard-step-content">
              <div className="step-instruction">
                <h3>2. Brand & Campaign Information</h3>
                <p>Provide details so {creator.fullName} can evaluate fit and timeline.</p>
              </div>

              <div className="form-fields-grid">
                <div className="form-group">
                  <label htmlFor="field-brand">Brand / Company Name <span className="req">*</span></label>
                  <input
                    id="field-brand"
                    type="text"
                    placeholder="e.g. Acme Tech Cloud"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className={errors.brandName ? 'input-error' : ''}
                  />
                  {errors.brandName && <span className="field-error-msg">{errors.brandName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="field-contact">Contact Person <span className="req">*</span></label>
                  <input
                    id="field-contact"
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className={errors.contactName ? 'input-error' : ''}
                  />
                  {errors.contactName && <span className="field-error-msg">{errors.contactName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="field-email">Business Work Email <span className="req">*</span></label>
                  <input
                    id="field-email"
                    type="email"
                    placeholder="priya@acmetech.io"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className={errors.contactEmail ? 'input-error' : ''}
                  />
                  {errors.contactEmail && <span className="field-error-msg">{errors.contactEmail}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="field-website">Company Website / App Link</label>
                  <input
                    id="field-website"
                    type="url"
                    placeholder="https://acmetech.io"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="field-objective">Campaign Objective</label>
                  <select
                    id="field-objective"
                    value={campaignObjective}
                    onChange={(e) => setCampaignObjective(e.target.value)}
                  >
                    <option value="Brand Awareness & Consideration">Brand Awareness & Consideration</option>
                    <option value="Product Launch & Feature Announcement">Product Launch & Feature Announcement</option>
                    <option value="Free Trial & Developer Signups">Free Trial & Developer Signups</option>
                    <option value="Mobile App Downloads">Mobile App Downloads</option>
                    <option value="Paid Ad Creative (UGC Hook)">Paid Ad Creative (UGC Hook)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="field-date">Target Delivery Date <span className="req">*</span></label>
                  <input
                    id="field-date"
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className={errors.preferredDate ? 'input-error' : ''}
                  />
                  {errors.preferredDate && <span className="field-error-msg">{errors.preferredDate}</span>}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="field-brief">Campaign Brief & Deliverable Requirements <span className="req">*</span></label>
                  <textarea
                    id="field-brief"
                    rows={4}
                    placeholder="Describe your product, key talking points, required call-to-action (CTA), and any specific guidelines..."
                    value={campaignBrief}
                    onChange={(e) => setCampaignBrief(e.target.value)}
                    className={errors.campaignBrief ? 'input-error' : ''}
                  ></textarea>
                  {errors.campaignBrief && <span className="field-error-msg">{errors.campaignBrief}</span>}
                </div>

                {/* Brief Attachment or Link */}
                <div className="form-group full-width">
                  <label>Attach Campaign Brief / Slide Deck (PDF/Doc)</label>
                  <div className="file-upload-box">
                    <input 
                      type="file" 
                      id="brief-file-input" 
                      className="hidden-file-input" 
                      onChange={handleFileUpload} 
                    />
                    <label htmlFor="brief-file-input" className="file-upload-label">
                      <Upload size={16} />
                      <span>{briefAttachmentName ? `Selected: ${briefAttachmentName}` : 'Choose PDF or Brief Document'}</span>
                    </label>
                  </div>
                </div>

                {/* Exclusivity Checkbox */}
                <div className="form-group full-width checkbox-row">
                  <input
                    id="field-exclusivity"
                    type="checkbox"
                    checked={exclusivityRequested}
                    onChange={(e) => setExclusivityRequested(e.target.checked)}
                  />
                  <label htmlFor="field-exclusivity">
                    Request 30-day competitor category exclusivity (creator will confirm in proposal)
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Terms */}
          {step === 3 && (
            <div className="wizard-step-content">
              <div className="step-instruction">
                <h3>3. Review Your Booking Request</h3>
                <p>Verify all details before transmitting the request to {creator.fullName}.</p>
              </div>

              <div className="review-summary-card card">
                <div className="review-section">
                  <span className="review-heading">Creator & Package</span>
                  <div className="review-row">
                    <span>Creator:</span>
                    <strong>{creator.fullName} ({creator.handle})</strong>
                  </div>
                  <div className="review-row">
                    <span>Service Package:</span>
                    <strong>{selectedPackage.title}</strong>
                  </div>
                  <div className="review-row">
                    <span>Estimated Turnaround:</span>
                    <span>{selectedPackage.deliveryDays} business days</span>
                  </div>
                  <div className="review-row">
                    <span>Publishing Channel:</span>
                    <span>{selectedPackage.publishingDestination}</span>
                  </div>
                </div>

                {selectedAddOnIds.length > 0 && (
                  <div className="review-section">
                    <span className="review-heading">Selected Add-Ons</span>
                    {selectedAddOnIds.map((aId) => {
                      const addon = creator.addOns.find((a) => a.id === aId);
                      if (!addon) return null;
                      return (
                        <div key={aId} className="review-row">
                          <span>{addon.name}:</span>
                          <span>+{formatCurrency(addon.priceInINR, currentCurrency)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="review-section">
                  <span className="review-heading">Brand & Campaign Brief</span>
                  <div className="review-row">
                    <span>Company:</span>
                    <strong>{brandName}</strong>
                  </div>
                  <div className="review-row">
                    <span>Contact:</span>
                    <span>{contactName} ({contactEmail})</span>
                  </div>
                  <div className="review-row">
                    <span>Target Delivery Date:</span>
                    <span>{preferredDate}</span>
                  </div>
                  <div className="review-row">
                    <span>Objective:</span>
                    <span>{campaignObjective}</span>
                  </div>
                  <div className="brief-preview-snippet">
                    <span>Brief:</span>
                    <p>"{campaignBrief}"</p>
                  </div>
                </div>

                <div className="review-total-row">
                  <span className="total-title">Total Collaboration Value:</span>
                  <span className="total-val">{formatCurrency(calculateTotalINR(), currentCurrency)}</span>
                </div>
              </div>

              {/* Escrow Terms Banner */}
              <div className="escrow-notice-box">
                <Lock size={16} className="text-accent" />
                <div className="escrow-notice-text">
                  <h5>Creatorly Escrow Protection</h5>
                  <p>
                    By submitting, your brief is transmitted to Alex Sharma. No funds are charged today. If accepted, you will receive a formal agreement and secure payment link.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Success Confirmation */}
          {step === 4 && submittedData && (
            <div className="submission-success-view">
              <div className="success-icon-badge">
                <CheckCircle2 size={42} className="text-success" />
              </div>

              <h2>Your Booking Request Has Been Sent!</h2>
              <p className="success-subtitle">
                Reference ID: <strong className="ref-tag">{submittedData.referenceId}</strong>
              </p>

              <div className="success-summary-box card">
                <div className="success-item">
                  <span className="label">Creator:</span>
                  <span className="val">{creator.fullName}</span>
                </div>
                <div className="success-item">
                  <span className="label">Selected Package:</span>
                  <span className="val">{submittedData.packageName}</span>
                </div>
                <div className="success-item">
                  <span className="label">Proposed Budget:</span>
                  <span className="val font-bold">{formatCurrency(submittedData.totalPriceINR, currentCurrency)}</span>
                </div>
                <div className="success-item">
                  <span className="label">Requested Delivery:</span>
                  <span className="val">{submittedData.preferredDate}</span>
                </div>
                <div className="success-item">
                  <span className="label">Confirmation Sent To:</span>
                  <span className="val">{submittedData.contactEmail}</span>
                </div>
              </div>

              <div className="next-steps-timeline">
                <h4>5-Stage Milestone Campaign Pipeline</h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '8px',
                  marginBottom: '18px',
                  padding: '12px',
                  background: '#F8FAFC',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.78rem'
                }}>
                  <div style={{ padding: '8px', background: '#ECFDF5', border: '1px solid #10B981', borderRadius: '8px', color: '#065F46', fontWeight: 600 }}>
                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#059669' }}>Step 1 • Active</div>
                    Brief Submitted
                  </div>
                  <div style={{ padding: '8px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#64748B' }}>
                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Step 2</div>
                    Escrow Funding
                  </div>
                  <div style={{ padding: '8px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#64748B' }}>
                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Step 3</div>
                    Script Signoff
                  </div>
                  <div style={{ padding: '8px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#64748B' }}>
                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Step 4</div>
                    Video Draft
                  </div>
                  <div style={{ padding: '8px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#64748B' }}>
                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Step 5</div>
                    Publish & Payout
                  </div>
                </div>

                <div className="timeline-item">
                  <span className="num">1</span>
                  <div>
                    <strong>Creator Review (Within 24–48 Hours)</strong>
                    <p>{creator.fullName} will review your brief requirements and confirm availability or propose a custom quote.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <span className="num">2</span>
                  <div>
                    <strong>Milestone Escrow Deposit</strong>
                    <p>Once accepted, lock the agreed funds into Creatorly Escrow Vault. Funds stay protected until you approve final video.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <span className="num">3</span>
                  <div>
                    <strong>Script Review & Production</strong>
                    <p>Review script outline concepts before filming begins, with 1 revision round included in standard turnaround.</p>
                  </div>
                </div>
              </div>

              <div className="success-actions" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {onViewInPipeline && (
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    style={{
                      background: '#059669',
                      borderColor: '#059669',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: 700
                    }}
                    onClick={() => {
                      const refId = submittedData.referenceId;
                      resetModal();
                      onViewInPipeline(refId);
                    }}
                  >
                    <span>Track in Workflow Pipeline</span>
                    <ArrowRight size={15} />
                  </button>
                )}

                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    const receipt = JSON.stringify(submittedData, null, 2);
                    const blob = new Blob([receipt], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `booking-${submittedData.referenceId}.json`;
                    a.click();
                    onShowToast(`Downloaded booking receipt: ${submittedData.referenceId}`);
                  }}
                >
                  <Download size={14} />
                  <span>Download Summary</span>
                </button>

                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={resetModal}
                >
                  <span>Return to Storefront</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Navigation Footer */}
        {step < 4 && (
          <div className="booking-modal-footer">
            {step > 1 ? (
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setStep((step - 1) as any)}
                disabled={isSubmitting}
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
            ) : (
              <div></div>
            )}

            {step === 1 && (
              <button 
                type="button" 
                className="btn btn-primary btn-lg"
                onClick={handleNextToStep2}
              >
                <span>Continue to Campaign Brief</span>
                <ArrowRight size={15} />
              </button>
            )}

            {step === 2 && (
              <button 
                type="button" 
                className="btn btn-primary btn-lg"
                onClick={handleNextToStep3}
              >
                <span>Review Request</span>
                <ArrowRight size={15} />
              </button>
            )}

            {step === 3 && (
              <button 
                type="button" 
                className="btn btn-primary btn-lg"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>Submitting Request...</span>
                ) : (
                  <>
                    <span>Submit Booking Request</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        .booking-modal-window {
          max-width: 720px;
          padding: 0;
          overflow: hidden;
          max-height: 92vh;
          display: flex;
          flex-direction: column;
        }

        .booking-modal-header {
          padding: 16px 24px;
          border-bottom: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(--bg-primary);
        }

        .creator-mini-id {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .creator-thumb {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          object-fit: cover;
        }

        .booking-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          display: block;
        }

        .booking-handle {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .wizard-stepper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 26px;
          background: linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%);
          border-bottom: 1px solid var(--border-light);
        }

        .step-node {
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0.6;
          transition: all 0.2s ease;
        }

        .step-node.active {
          opacity: 1;
        }

        .step-num {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: #CBD5E1;
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .step-node.active .step-num {
          background: #059669;
          box-shadow: 0 2px 8px rgba(5, 150, 105, 0.4);
        }

        .step-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .step-line {
          flex: 1;
          height: 2px;
          background-color: #E2E8F0;
          margin: 0 12px;
        }

        .booking-modal-body {
          padding: 26px;
          overflow-y: auto;
          flex: 1;
        }

        .step-instruction {
          margin-bottom: 22px;
        }

        .step-instruction h3 {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 4px;
          letter-spacing: -0.02em;
        }

        .step-instruction p {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .package-tabs-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 18px;
        }

        .pkg-tab {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          background-color: #FFFFFF;
          border: 1.5px solid rgba(226, 232, 240, 0.9);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          text-align: left;
        }

        .pkg-tab:hover {
          border-color: #059669;
          transform: translateY(-1px);
        }

        .pkg-tab.active {
          border-color: #059669;
          background: #ECFDF5;
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.15);
        }

        .tab-left {
          display: flex;
          flex-direction: column;
        }

        .tab-name {
          font-size: 0.925rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .tab-sub {
          font-size: 0.775rem;
          color: var(--text-muted);
        }

        .tab-price {
          font-size: 1.15rem;
          font-weight: 800;
          color: #1E1B4B;
        }

        .selected-pkg-summary {
          padding: 16px;
          background-color: var(--bg-secondary);
          margin-bottom: 20px;
        }

        .pkg-summary-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .pkg-summary-top h4 {
          font-size: 0.95rem;
          font-weight: 700;
        }

        .summary-desc {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .summary-price-badge {
          font-size: 1rem;
          font-weight: 800;
          color: var(--accent-primary);
        }

        .summary-checklist {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .check-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .addons-selection-section h4 {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .addons-interactive-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .interactive-addon-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          background-color: var(--bg-primary);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .interactive-addon-item:hover {
          border-color: var(--border-dark);
        }

        .interactive-addon-item.selected {
          border-color: var(--accent-primary);
          background-color: var(--accent-subtle);
        }

        .addon-checkbox {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          border: 1px solid var(--border-medium);
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: white;
          flex-shrink: 0;
        }

        .interactive-addon-item.selected .addon-checkbox {
          background-color: var(--accent-primary);
          border-color: var(--accent-primary);
        }

        .addon-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .addon-title {
          font-size: 0.825rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .addon-explanation {
          font-size: 0.725rem;
          color: var(--text-muted);
        }

        .addon-amount {
          font-size: 0.825rem;
          font-weight: 700;
          color: var(--accent-primary);
          white-space: nowrap;
        }

        .order-total-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          background-color: var(--bg-secondary);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-light);
        }

        .total-left {
          display: flex;
          flex-direction: column;
        }

        .total-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .total-note {
          font-size: 0.725rem;
          color: var(--text-muted);
        }

        .total-number {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--accent-primary);
        }

        .form-fields-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        @media (max-width: 600px) {
          .form-fields-grid {
            grid-template-columns: 1fr;
          }
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .req {
          color: var(--error);
        }

        .input-error {
          border-color: var(--error) !important;
          background-color: var(--error-bg);
        }

        .field-error-msg {
          font-size: 0.725rem;
          color: var(--error);
          margin-top: 2px;
          display: block;
        }

        .form-group select,
        .form-group textarea {
          padding: 10px 12px;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          color: var(--text-primary);
          background-color: var(--bg-primary);
          font-family: inherit;
        }

        .file-upload-box {
          position: relative;
        }

        .hidden-file-input {
          display: none;
        }

        .file-upload-label {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border: 1px dashed var(--border-medium);
          border-radius: var(--radius-md);
          background-color: var(--bg-secondary);
          font-size: 0.825rem;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .file-upload-label:hover {
          background-color: var(--bg-primary);
          border-color: var(--accent-primary);
        }

        .checkbox-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 10px;
        }

        .checkbox-row input {
          width: 16px;
          height: 16px;
        }

        .checkbox-row label {
          font-size: 0.825rem;
          color: var(--text-secondary);
          font-weight: 500;
          cursor: pointer;
        }

        .review-summary-card {
          padding: 20px;
          background-color: var(--bg-primary);
          margin-bottom: 20px;
        }

        .review-section {
          padding-bottom: 14px;
          margin-bottom: 14px;
          border-bottom: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .review-heading {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-muted);
          margin-bottom: 4px;
        }

        .review-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.825rem;
        }

        .review-row span {
          color: var(--text-muted);
        }

        .brief-preview-snippet {
          background-color: var(--bg-secondary);
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          margin-top: 6px;
        }

        .brief-preview-snippet p {
          font-style: italic;
          color: var(--text-secondary);
          margin-top: 2px;
        }

        .review-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 6px;
        }

        .total-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .total-val {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--accent-primary);
        }

        .escrow-notice-box {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
        }

        .escrow-notice-text h5 {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .escrow-notice-text p {
          font-size: 0.775rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        .submission-success-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 16px 0;
        }

        .success-icon-badge {
          margin-bottom: 12px;
        }

        .submission-success-view h2 {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .success-subtitle {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 20px;
        }

        .ref-tag {
          font-family: var(--font-mono);
          color: var(--accent-primary);
          background-color: var(--accent-subtle);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
        }

        .success-summary-box {
          width: 100%;
          padding: 16px;
          background-color: var(--bg-secondary);
          margin-bottom: 24px;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .success-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.825rem;
        }

        .success-item .label {
          color: var(--text-muted);
        }

        .next-steps-timeline {
          width: 100%;
          text-align: left;
          margin-bottom: 24px;
        }

        .next-steps-timeline h4 {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .timeline-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
        }

        .timeline-item .num {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background-color: var(--accent-primary);
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .timeline-item strong {
          font-size: 0.825rem;
          color: var(--text-primary);
          display: block;
        }

        .timeline-item p {
          font-size: 0.775rem;
          color: var(--text-muted);
        }

        .success-actions {
          display: flex;
          gap: 12px;
          width: 100%;
          justify-content: center;
        }

        .booking-modal-footer {
          padding: 16px 24px;
          background-color: var(--bg-primary);
          border-top: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      `}</style>
    </div>
  );
};
