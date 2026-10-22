import React, { useState } from 'react';
import type { CreatorProfile } from '../types/creator';
import { X, Send, Clock, ShieldCheck, CheckCircle2, MessageSquare } from 'lucide-react';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: CreatorProfile;
  onShowToast: (msg: string) => void;
  onMessageSubmitted?: (data: {
    topic: string;
    brandName: string;
    contactEmail: string;
    message: string;
    referenceId: string;
    creator: CreatorProfile;
  }) => void;
}

export const MessageModal: React.FC<MessageModalProps> = ({
  isOpen,
  onClose,
  creator,
  onShowToast,
  onMessageSubmitted,
}) => {
  const [topic, setTopic] = useState('Custom Campaign Quote');
  const [brandName, setBrandName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inquiryRef, setInquiryRef] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!brandName.trim()) errs.brandName = 'Company / brand name is required';
    if (!contactEmail.trim()) {
      errs.contactEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      errs.contactEmail = 'Invalid email address';
    }
    if (!message.trim()) {
      errs.message = 'Please type your question or inquiry';
    } else if (message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const ref = `MSG-${Math.floor(1000 + Math.random() * 9000)}`;
      setInquiryRef(ref);
      setIsSubmitting(false);
      setSubmitted(true);
      onMessageSubmitted?.({
        topic,
        brandName,
        contactEmail,
        message,
        referenceId: ref,
        creator
      });
      onShowToast(`Message delivered to ${creator.fullName}! Inquiry ref: ${ref}`);
    }, 700);
  };

  const handleReset = () => {
    setBrandName('');
    setContactEmail('');
    setMessage('');
    setSubmitted(false);
    setErrors({});
    onClose();
  };

  return (
    <div className="cr-sayhello-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="cr-sayhello-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cr-sayhello-header">
          <div className="cr-sayhello-creator-meta">
            {creator.avatarUrl ? (
              <img src={creator.avatarUrl} alt={creator.fullName} className="cr-sayhello-avatar" />
            ) : (
              <div className="cr-sayhello-avatar-fallback">
                <MessageSquare size={18} />
              </div>
            )}
            <div className="cr-sayhello-title-wrap">
              <h3 className="cr-sayhello-title">Message {creator.fullName}</h3>
              <div className="cr-sayhello-response-pill">
                <span className="cr-sayhello-pulse-dot" />
                <Clock size={12} />
                <span>Typical response time: {creator.availability?.responseTime || '< 4 hours'}</span>
              </div>
            </div>
          </div>
          <button 
            type="button" 
            className="cr-sayhello-close" 
            onClick={onClose} 
            aria-label="Close message dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="cr-sayhello-body">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="cr-sayhello-form">
              {/* Inquiry Topic */}
              <div className="cr-sayhello-field">
                <label className="cr-sayhello-label">
                  <span>Inquiry Topic</span>
                  <span className="cr-sayhello-hint">Select category</span>
                </label>
                <select 
                  value={topic} 
                  onChange={(e) => setTopic(e.target.value)}
                  className="cr-sayhello-select"
                >
                  <option value="Custom Campaign Quote">Custom Campaign Quote / Multi-Video</option>
                  <option value="Package Question">Question About a Listed Package</option>
                  <option value="Timeline & Date Check">Timeline & Availability Check</option>
                  <option value="Brand Ambassadorship">Long-Term Brand Ambassadorship</option>
                  <option value="General Inquiry">General Question</option>
                </select>
              </div>

              {/* Brand Name & Contact Email (2 columns) */}
              <div className="cr-sayhello-row">
                <div className="cr-sayhello-field">
                  <label className="cr-sayhello-label">
                    <span>Brand / Agency Name <span className="cr-sayhello-req">*</span></span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vercel Marketing"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className={`cr-sayhello-input ${errors.brandName ? 'has-error' : ''}`}
                  />
                  {errors.brandName && (
                    <span className="cr-sayhello-error">{errors.brandName}</span>
                  )}
                </div>

                <div className="cr-sayhello-field">
                  <label className="cr-sayhello-label">
                    <span>Work Email Address <span className="cr-sayhello-req">*</span></span>
                  </label>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className={`cr-sayhello-input ${errors.contactEmail ? 'has-error' : ''}`}
                  />
                  {errors.contactEmail && (
                    <span className="cr-sayhello-error">{errors.contactEmail}</span>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="cr-sayhello-field">
                <label className="cr-sayhello-label">
                  <span>Your Message / Campaign Question <span className="cr-sayhello-req">*</span></span>
                </label>
                <textarea
                  rows={4}
                  placeholder={`Hi ${creator.fullName.split(' ')[0]}, our team is planning a campaign and we'd love to ask about deliverables, timeline, or custom concepts...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`cr-sayhello-textarea ${errors.message ? 'has-error' : ''}`}
                />
                {errors.message && (
                  <span className="cr-sayhello-error">{errors.message}</span>
                )}
              </div>

              {/* Security note */}
              <div className="cr-sayhello-security">
                <ShieldCheck size={15} className="cr-sayhello-sec-icon" />
                <span>Private & Secure. Your contact email is encrypted and never shared without consent.</span>
              </div>

              {/* Footer Actions */}
              <div className="cr-sayhello-actions">
                <button 
                  type="button" 
                  className="cr-sayhello-btn-cancel" 
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="cr-sayhello-btn-submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Sending inquiry...</span>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Send Direct Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="cr-sayhello-success">
              <div className="cr-sayhello-success-badge">
                <CheckCircle2 size={36} color="#10B981" />
              </div>
              <h3 className="cr-sayhello-success-title">Direct Inquiry Delivered!</h3>
              <p className="cr-sayhello-success-desc">
                Your message has been delivered to <strong>{creator.fullName}</strong>'s priority inbox. A confirmation receipt has been sent to <strong>{contactEmail}</strong>.
              </p>
              <div className="cr-sayhello-ref-box">
                <span className="cr-sayhello-ref-lbl">Inquiry Tracking Ref:</span>
                <span className="cr-sayhello-ref-code">#{inquiryRef}</span>
              </div>
              <div className="cr-sayhello-expected-box">
                <Clock size={14} color="#64748B" />
                <span>Expect a reply within <strong>{creator.availability?.responseTime || '< 4 hours'}</strong></span>
              </div>
              <button 
                type="button" 
                className="cr-sayhello-btn-done" 
                onClick={handleReset}
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .cr-sayhello-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 16px;
          animation: crFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cr-sayhello-card {
          background: #FFFFFF;
          border-radius: 20px;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.06);
          width: 100%;
          max-width: 540px;
          overflow: hidden;
          animation: crScaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid #E2E8F0;
        }

        @keyframes crFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes crScaleUp {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* Header */
        .cr-sayhello-header {
          padding: 22px 24px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #F1F5F9;
          background: #FFFFFF;
        }

        .cr-sayhello-creator-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cr-sayhello-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #F1F5F9;
          flex-shrink: 0;
        }

        .cr-sayhello-avatar-fallback {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #FFF1EE;
          color: #FF5B38;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .cr-sayhello-title-wrap {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .cr-sayhello-title {
          font-size: 1.12rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .cr-sayhello-response-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.74rem;
          font-weight: 600;
          color: #059669;
          background: #ECFDF5;
          padding: 2px 8px;
          border-radius: 12px;
          width: fit-content;
        }

        .cr-sayhello-pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10B981;
          display: inline-block;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.25);
        }

        .cr-sayhello-close {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid #E2E8F0;
          background: #F8FAFC;
          color: #64748B;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }

        .cr-sayhello-close:hover {
          background: #F1F5F9;
          color: #0F172A;
          border-color: #CBD5E1;
        }

        /* Body */
        .cr-sayhello-body {
          padding: 20px 24px 24px;
          background: #FFFFFF;
        }

        .cr-sayhello-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .cr-sayhello-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 100%;
        }

        .cr-sayhello-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 700;
          color: #1E293B;
          letter-spacing: -0.01em;
          margin: 0;
        }

        .cr-sayhello-req {
          color: #EF4444;
          font-weight: 800;
        }

        .cr-sayhello-hint {
          font-size: 0.72rem;
          font-weight: 500;
          color: #94A3B8;
        }

        .cr-sayhello-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          width: 100%;
        }

        @media (max-width: 520px) {
          .cr-sayhello-row {
            grid-template-columns: 1fr;
          }
        }

        /* Inputs, Select, Textarea */
        .cr-sayhello-input,
        .cr-sayhello-select,
        .cr-sayhello-textarea {
          width: 100% !important;
          box-sizing: border-box !important;
          display: block !important;
          padding: 10px 14px !important;
          background: #F8FAFC !important;
          border: 1.5px solid #E2E8F0 !important;
          border-radius: 10px !important;
          font-size: 0.86rem !important;
          font-family: inherit !important;
          color: #0F172A !important;
          outline: none !important;
          transition: all 0.18s ease !important;
        }

        .cr-sayhello-input::placeholder,
        .cr-sayhello-textarea::placeholder {
          color: #94A3B8 !important;
        }

        .cr-sayhello-input:focus,
        .cr-sayhello-select:focus,
        .cr-sayhello-textarea:focus {
          border-color: #FF5B38 !important;
          background: #FFFFFF !important;
          box-shadow: 0 0 0 3px rgba(255, 91, 56, 0.14) !important;
        }

        .cr-sayhello-input.has-error,
        .cr-sayhello-textarea.has-error {
          border-color: #EF4444 !important;
          background: #FEF2F2 !important;
        }

        .cr-sayhello-select {
          cursor: pointer;
        }

        .cr-sayhello-textarea {
          resize: vertical;
          min-height: 96px;
          line-height: 1.5;
        }

        .cr-sayhello-error {
          font-size: 0.72rem;
          font-weight: 600;
          color: #DC2626;
        }

        /* Security Note */
        .cr-sayhello-security {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 12px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          font-size: 0.74rem;
          color: #64748B;
          line-height: 1.35;
        }

        .cr-sayhello-sec-icon {
          color: #10B981;
          flex-shrink: 0;
        }

        /* Actions */
        .cr-sayhello-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 6px;
          padding-top: 14px;
          border-top: 1px solid #F1F5F9;
        }

        .cr-sayhello-btn-cancel {
          padding: 9px 18px;
          border-radius: 10px;
          border: 1.5px solid #E2E8F0;
          background: #FFFFFF;
          color: #475569;
          font-size: 0.84rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .cr-sayhello-btn-cancel:hover {
          background: #F1F5F9;
          color: #0F172A;
          border-color: #CBD5E1;
        }

        .cr-sayhello-btn-submit {
          padding: 9px 20px;
          border-radius: 10px;
          border: none;
          background: #18191E;
          color: #FFFFFF;
          font-size: 0.84rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .cr-sayhello-btn-submit:hover:not(:disabled) {
          background: #FF5B38;
          box-shadow: 0 4px 14px rgba(255, 91, 56, 0.35);
          transform: translateY(-1px);
        }

        .cr-sayhello-btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Success State */
        .cr-sayhello-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 16px 8px 8px;
          gap: 12px;
        }

        .cr-sayhello-success-badge {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #ECFDF5;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }

        .cr-sayhello-success-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .cr-sayhello-success-desc {
          font-size: 0.84rem;
          color: #64748B;
          line-height: 1.5;
          max-width: 420px;
          margin: 0;
        }

        .cr-sayhello-ref-box {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #F8FAFC;
          border: 1px dashed #CBD5E1;
          border-radius: 8px;
        }

        .cr-sayhello-ref-lbl {
          font-size: 0.76rem;
          color: #64748B;
          font-weight: 600;
        }

        .cr-sayhello-ref-code {
          font-size: 0.86rem;
          font-weight: 800;
          font-family: 'JetBrains Mono', monospace;
          color: #FF5B38;
        }

        .cr-sayhello-expected-box {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: #64748B;
          background: #F1F5F9;
          padding: 6px 12px;
          border-radius: 20px;
        }

        .cr-sayhello-btn-done {
          margin-top: 8px;
          padding: 9px 28px;
          background: #18191E;
          color: #FFFFFF;
          border: none;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .cr-sayhello-btn-done:hover {
          background: #FF5B38;
        }
      `}</style>
    </div>
  );
};
