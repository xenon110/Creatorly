import React, { useState } from 'react';
import type { FAQItem, CreatorProfile } from '../types/creator';
import { ChevronDown, FileText, ArrowRight } from 'lucide-react';

interface CollaborationFAQProps {
  faqs: FAQItem[];
  terms: CreatorProfile['collaborationTerms'];
  onOpenMessage: () => void;
}

export const CollaborationFAQ: React.FC<CollaborationFAQProps> = ({
  faqs,
  terms,
  onOpenMessage,
}) => {
  const [openIds, setOpenIds] = useState<string[]>([faqs[0]?.id || 'faq-1']);

  const toggleFAQ = (id: string) => {
    if (openIds.includes(id)) {
      setOpenIds(openIds.filter((item) => item !== id));
    } else {
      setOpenIds([...openIds, id]);
    }
  };

  return (
    <section className="faq-section" id="creator-faq">
      <div className="section-header">
        <div className="section-tag">Clarity & Terms</div>
        <h2 className="section-title">Collaboration Terms & FAQs</h2>
        <p className="section-desc">
          Everything you need to know about revisions, advertising usage rights, cancellations, and escrow security.
        </p>
      </div>

      <div className="faq-container-grid">
        {/* Left Side: Accordion list */}
        <div className="accordion-list">
          {faqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div key={faq.id} className={`faq-card card ${isOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggleFAQ(faq.id)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-question-text">{faq.question}</span>
                  <ChevronDown size={16} className={`chevron-icon ${isOpen ? 'rotate' : ''}`} />
                </button>

                {isOpen && (
                  <div className="faq-answer-body">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Side: Collaboration Terms Summary Card */}
        <div className="terms-summary-card card">
          <div className="terms-card-header">
            <FileText size={18} className="text-accent" />
            <div>
              <h3>Standard Collaboration Terms</h3>
              <p>Applicable to all bookings with Alex Sharma</p>
            </div>
          </div>

          <div className="terms-clause-item">
            <span className="clause-title">Escrow & Payment Terms</span>
            <p>{terms.paymentPolicy}</p>
          </div>

          <div className="terms-clause-item">
            <span className="clause-title">Revision Guidelines</span>
            <p>{terms.revisionPolicy}</p>
          </div>

          <div className="terms-clause-item">
            <span className="clause-title">Cancellation & Refund Policy</span>
            <p>{terms.cancellationPolicy}</p>
          </div>

          <div className="terms-clause-item">
            <span className="clause-title">Exclusivity Period</span>
            <p>{terms.exclusivityNotice}</p>
          </div>

          <div className="terms-action-box">
            <span>Have a specific legal agreement or custom NDA?</span>
            <button 
              type="button" 
              className="btn btn-outline-primary btn-sm btn-block"
              onClick={onOpenMessage}
            >
              <span>Message Alex to Discuss Custom Terms</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .faq-section {
          margin-bottom: 44px;
        }

        .faq-container-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 24px;
          margin-top: 20px;
        }

        @media (max-width: 900px) {
          .faq-container-grid {
            grid-template-columns: 1fr;
          }
        }

        .accordion-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .faq-card {
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          overflow: hidden;
          background-color: #FFFFFF;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .faq-card:hover {
          border-color: rgba(99, 102, 241, 0.35);
          box-shadow: 0 4px 14px -2px rgba(15, 23, 42, 0.05);
        }

        .faq-card.open {
          border-color: rgba(99, 102, 241, 0.5);
          box-shadow: 0 6px 20px -3px rgba(99, 102, 241, 0.12);
        }

        .faq-question-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 22px;
          text-align: left;
          background-color: #FFFFFF;
          gap: 16px;
          cursor: pointer;
          border: none;
        }

        .faq-question-text {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.4;
        }

        .faq-card.open .faq-question-text {
          color: var(--color-indigo);
        }

        .chevron-icon {
          color: var(--text-muted);
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s ease;
          flex-shrink: 0;
        }

        .chevron-icon.rotate {
          transform: rotate(180deg);
          color: var(--color-indigo);
        }

        .faq-answer-body {
          padding: 0 22px 20px;
          animation: fadeIn 0.2s ease-out;
        }

        .faq-answer-body p {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .terms-summary-card {
          padding: 26px;
          background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: var(--radius-xl);
          display: flex;
          flex-direction: column;
          gap: 18px;
          box-shadow: 0 6px 20px -4px rgba(15, 23, 42, 0.05);
          position: relative;
          overflow: hidden;
        }

        .terms-summary-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #059669;
        }

        .terms-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-light);
        }

        .terms-card-header .text-accent {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #ECFDF5;
          color: #059669;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .terms-card-header h3 {
          font-size: 1rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .terms-card-header p {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .terms-clause-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
          background: rgba(248, 250, 252, 0.8);
          padding: 10px 14px;
          border-radius: var(--radius-md);
          border-left: 3px solid #059669;
        }

        .clause-title {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #059669;
        }

        .terms-clause-item p {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        .terms-action-box {
          margin-top: 6px;
          padding: 16px;
          background-color: #FFFFFF;
          border: 1px solid #A7F3D0;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 0.8rem;
          color: var(--text-secondary);
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.08);
        }

        .terms-action-box .btn {
          background: #059669 !important;
          color: #FFFFFF !important;
          border: none !important;
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.25) !important;
          font-weight: 600 !important;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        .terms-action-box .btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4) !important;
        }

        .terms-action-box .btn:hover svg {
          transform: translateX(3px);
        }

        .terms-action-box .btn svg {
          transition: transform 0.2s ease;
        }
      `}</style>
    </section>
  );
};
