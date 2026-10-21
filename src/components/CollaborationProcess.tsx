import React, { useState } from 'react';
import {
  Check,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  ArrowRight
} from 'lucide-react';

interface CollaborationProcessProps {
  creatorName?: string;
  onStartCollab?: () => void;
  onOpenPipeline?: () => void;
}

export const CollaborationProcess: React.FC<CollaborationProcessProps> = ({
  creatorName = 'Alex',
  onStartCollab,
  onOpenPipeline
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const steps = [
    {
      step: '01',
      title: 'Brief & Scope Review',
      timeline: '24–48 Hours',
      role: 'Brand + Creator',
      roleBg: '#EDE8DE',
      roleColor: '#18191E',
      cardBg: '#FFFFFF',
      desc: `Submit campaign objectives, talking points, and preferred drop dates. ${creatorName} confirms scope alignment within 24 hours.`,
      deliverable: 'Scope of Work & Fixed Price Agreement',
      brandDuty: 'Submit campaign brief, product value propositions, deliverable format, and target go-live dates.',
      creatorDuty: `${creatorName} reviews brand alignment, production feasibility, and locks in the production schedule.`,
      escrowStatus: 'Zero deposit required — payment is only funded once scope is mutually approved.',
      stageDeliverable: 'Signed Scope of Work'
    },
    {
      step: '02',
      title: 'Escrow Funding & Terms',
      timeline: 'Instant Deposit',
      role: 'Escrow Vault',
      roleBg: '#D1FAE5',
      roleColor: '#065F46',
      cardBg: '#FAFDF9',
      desc: 'Campaign budget is deposited into Creatorly Escrow. Funds are safely locked in the vault and are never paid upfront.',
      deliverable: '100% Escrow Vault Locked',
      brandDuty: 'Authorize budget into secure escrow. Funds remain 100% protected throughout the production cycle.',
      creatorDuty: `${creatorName} receives verified funding confirmation and immediately begins script pre-production.`,
      escrowStatus: '100% held in escrow — money-back guarantee if milestones or deadlines are breached.',
      stageDeliverable: 'Vault Deposit Locked'
    },
    {
      step: '03',
      title: 'Script Outline Signoff',
      timeline: 'Days 2–3',
      role: `${creatorName} Sharma`,
      roleBg: '#FEF3C7',
      roleColor: '#92400E',
      cardBg: '#FFFDF7',
      desc: `Before filming, ${creatorName} delivers bulleted talking points and hook variations (A/B) so your team can verify technical accuracy.`,
      deliverable: 'Hook Variations & Talking Points',
      brandDuty: 'Review script outline, verify product terminology, and approve hook direction with 1 revision round.',
      creatorDuty: `${creatorName} drafts authentic concept avoiding rigid ad jargon, incorporating agreed brand claims.`,
      escrowStatus: 'Vault locked — zero funds released until final unlisted video draft is approved.',
      stageDeliverable: 'Hook A/B + Talking Points'
    },
    {
      step: '04',
      title: '4K Production & Draft Review',
      timeline: 'Days 4–7',
      role: 'Studio Filming',
      roleBg: '#E0F2FE',
      roleColor: '#075985',
      cardBg: '#F8FCFF',
      desc: 'High-production 4K studio filming, custom B-roll, and crisp audio. You receive an unlisted review link with 1 revision round included.',
      deliverable: '4K 60fps Unlisted Video Draft',
      brandDuty: 'Watch unlisted 4K video draft, add timestamped comments if needed, and give final approval.',
      creatorDuty: `${creatorName} films in 4K studio, edits color/audio, and uploads private unlisted link for review.`,
      escrowStatus: 'Approval gate — escrow payout is authorized only upon explicit brand approval.',
      stageDeliverable: '4K Unlisted Video Link'
    },
    {
      step: '05',
      title: 'Go-Live & Escrow Payout',
      timeline: 'Scheduled Drop',
      role: 'Automated Release',
      roleBg: '#FCE7F3',
      roleColor: '#831843',
      cardBg: '#FFF8FA',
      desc: `Content goes live with pinned brand links. Escrow automatically releases payment to ${creatorName}, and your team unlocks verified review rights.`,
      deliverable: 'Live Content & Verified Review',
      brandDuty: 'Receives live URL and analytics access, and unlocks rights to post a verified storefront review.',
      creatorDuty: `${creatorName} publishes video, pins sponsor link in description, and receives instant payout.`,
      escrowStatus: 'Completed — escrow automatically disbursed to creator upon verified post publication.',
      stageDeliverable: 'Live Post + Payout Disbursed'
    },
  ];

  return (
    <div className="collaboration-pipeline-section">
      {/* 1. Editorial Section Header */}
      <div className="section-header-split">
        <div>
          <span className="fresh-eyebrow">
            <span className="eyebrow-bullet">•</span> HOW WE WORK TOGETHER
          </span>
          <h2 className="section-headline">
            Zero guesswork.<br />
            <span className="text-coral">100% escrow protected.</span>
          </h2>
        </div>
        <div className="pipeline-header-aside">
          <p className="section-header-desc">
            No chasing DMs, no awkward invoicing, no ghosting. Every collaboration runs on a verified 5-stage milestone protocol with guaranteed protection from brief to payout.
          </p>
          <div className="pipeline-trust-pills">
            <span className="trust-pill-tag">
              <ShieldCheck size={14} className="icon-emerald" />
              <span>Escrow Vault Locked</span>
            </span>
            <span className="trust-pill-tag">
              <Clock size={14} className="icon-coral" />
              <span>48h SLA Reviews</span>
            </span>
            <span className="trust-pill-tag">
              <Check size={14} className="icon-teal" />
              <span>Commercial IP Rights</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Milestone Stepper Rail */}
      <div className="stepper-rail-wrap">
        <div className="stepper-rail-track">
          <div
            className="stepper-rail-fill"
            style={{ width: `${(activeStepIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        <div className="stepper-stops-row">
          {steps.map((st, idx) => {
            const isCompleted = idx < activeStepIndex;
            const isActive = idx === activeStepIndex;
            return (
              <button
                key={st.step}
                type="button"
                className={`stepper-node-btn ${isActive ? 'node-active' : ''} ${isCompleted ? 'node-completed' : ''}`}
                onClick={() => setActiveStepIndex(idx)}
                aria-label={`Select Step ${st.step}: ${st.title}`}
              >
                <div className="node-circle">
                  {isCompleted ? (
                    <Check size={13} strokeWidth={3} />
                  ) : (
                    <span>{st.step}</span>
                  )}
                </div>
                <div className="node-label-wrap">
                  <span className="node-step-id">{st.step}</span>
                  <span className="node-step-title">{st.title.split(' ')[0]}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. 5 Milestone Cards */}
      <div className="milestone-cards-row">
        {steps.map((st, idx) => {
          const isActive = activeStepIndex === idx;
          return (
            <div
              key={st.step}
              className={`milestone-card ${isActive ? 'm-card-selected' : ''}`}
              style={{ backgroundColor: st.cardBg }}
              onClick={() => setActiveStepIndex(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveStepIndex(idx);
                }
              }}
            >
              <div className="m-card-header">
                <span className="m-card-role-chip">
                  {st.role}
                </span>
                <span className="m-card-num">{st.step}</span>
              </div>

              <h3 className="m-card-name">{st.title}</h3>
              <div className="m-card-sla">
                <Clock size={11} className="sla-clock-icon" />
                <span>{st.timeline}</span>
              </div>

              <p className="m-card-summary">{st.desc}</p>

              <div className="m-card-chip-container">
                <div className="m-deliverable-badge">
                  <Check size={11} className="text-emerald" />
                  <span>{st.deliverable}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Escrow Security Guarantee Banner */}
      <div className="dark-escrow-guarantee-card">
        <div className="deg-left">
          <div className="deg-icon-box">
            <ShieldCheck size={22} className="text-teal-light" />
          </div>
          <div className="deg-text-wrap">
            <span className="deg-tag">CREATORLY ESCROW VAULT GUARANTEE</span>
            <h4 className="deg-headline">
              Your budget stays 100% in escrow until you approve the draft.
            </h4>
            <p className="deg-desc">
              Every partnership agreement is backed by our milestone vault. If requirements aren't met or agreed deadlines are breached, your funds are refunded immediately.
            </p>
          </div>
        </div>

        <div className="deg-actions">
          {onStartCollab && (
            <button
              type="button"
              className="btn-deg-start"
              onClick={onStartCollab}
            >
              <span>Start Collaboration</span>
              <ArrowUpRight size={16} />
            </button>
          )}
          {onOpenPipeline && (
            <button
              type="button"
              className="btn-deg-pipeline"
              onClick={onOpenPipeline}
            >
              <span>View Active Pipeline</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>

      <style>{`
        /* ========================================================= */
        /* COLLABORATION PIPELINE SECTION                           */
        /* ========================================================= */
        .collaboration-pipeline-section {
          margin-bottom: 24px;
        }

        .pipeline-header-aside {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 480px;
        }

        .pipeline-trust-pills {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        .trust-pill-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #FFFFFF;
          border: 1px solid #EBE8E4;
          padding: 6px 12px;
          border-radius: 9999px;
          font-size: 0.775rem;
          font-weight: 700;
          color: #18191E;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .icon-emerald { color: #10B981; }
        .icon-coral { color: #FF5B38; }
        .icon-teal { color: #2DD4BF; }

        /* ========================================================= */
        /* STEPPER RAIL                                              */
        /* ========================================================= */
        .stepper-rail-wrap {
          position: relative;
          margin: 32px 0 28px;
          padding: 0 16px;
        }

        .stepper-rail-track {
          position: absolute;
          top: 20px;
          left: 48px;
          right: 48px;
          height: 3px;
          background: #E5E1D8;
          border-radius: 9999px;
          z-index: 1;
        }

        .stepper-rail-fill {
          height: 100%;
          background: #18191E;
          border-radius: 9999px;
          transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .stepper-stops-row {
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 2;
        }

        .stepper-node-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          transition: transform 0.15s ease;
        }

        .stepper-node-btn:hover {
          transform: translateY(-2px);
        }

        .node-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #FAF8F5;
          border: 2px solid #D5D0CA;
          color: #71717A;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 800;
          transition: all 0.2s ease;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
        }

        .stepper-node-btn.node-active .node-circle {
          background: #18191E;
          border-color: #18191E;
          color: #FFFFFF;
          box-shadow: 0 0 0 4px rgba(24, 25, 30, 0.15);
          transform: scale(1.12);
        }

        .stepper-node-btn.node-completed .node-circle {
          background: #BEF264;
          border-color: #BEF264;
          color: #18191E;
        }

        .node-label-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .node-step-id {
          font-size: 0.68rem;
          font-weight: 800;
          color: #A1A1AA;
          text-transform: uppercase;
        }

        .node-step-title {
          font-size: 0.78rem;
          font-weight: 700;
          color: #18191E;
        }

        @media (max-width: 768px) {
          .node-label-wrap {
            display: none;
          }
          .stepper-rail-track {
            left: 24px;
            right: 24px;
          }
        }

        /* ========================================================= */
        /* 5 MILESTONE CARDS                                         */
        /* ========================================================= */
        .milestone-cards-row {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        @media (max-width: 1180px) {
          .milestone-cards-row {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 740px) {
          .milestone-cards-row {
            grid-template-columns: 1fr;
          }
        }

        .milestone-card {
          padding: 22px 18px 18px;
          border-radius: 18px;
          border: 1px solid #EAE6DF;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          user-select: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
        }

        .milestone-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
          border-color: #D5D0CA;
        }

        .milestone-card.m-card-selected {
          border: 2px solid #18191E !important;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
          transform: translateY(-3px);
        }

        .m-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .m-card-role-chip {
          background-color: #18191E;
          color: #FFFFFF;
          font-size: 0.68rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 4px 9px;
          border-radius: 9999px;
          display: inline-block;
          transition: background-color 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s ease;
        }

        .m-card-role-chip:hover,
        .milestone-card:hover .m-card-role-chip {
          background-color: #FF5B38;
          color: #FFFFFF;
        }

        .m-card-num {
          font-size: 1.1rem;
          font-weight: 900;
          color: #A1A1AA;
        }

        .m-card-name {
          font-size: 1.025rem;
          font-weight: 800;
          color: #18191E;
          margin: 0 0 6px;
          line-height: 1.3;
        }

        .m-card-sla {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.725rem;
          font-weight: 700;
          color: #71717A;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
        }

        .sla-clock-icon {
          color: #FF5B38;
        }

        .m-card-summary {
          font-size: 0.8rem;
          color: #4B5563;
          line-height: 1.5;
          margin: 0 0 16px;
          flex: 1;
        }

        .m-card-chip-container {
          margin-top: auto;
        }

        .m-deliverable-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #FFFFFF;
          border: 1px solid #E5E1D8;
          border-radius: 8px;
          padding: 5px 9px;
          font-size: 0.72rem;
          font-weight: 700;
          color: #18191E;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
        }

        /* ========================================================= */
        /* ESCROW GUARANTEE BANNER                                   */
        /* ========================================================= */
        .dark-escrow-guarantee-card {
          background: #151922;
          color: #FFFFFF;
          border-radius: 20px;
          padding: 28px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.14);
        }

        .deg-left {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          flex: 1;
          min-width: 300px;
        }

        .deg-icon-box {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: rgba(45, 212, 191, 0.12);
          border: 1px solid rgba(45, 212, 191, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .deg-text-wrap {
          display: flex;
          flex-direction: column;
        }

        .deg-tag {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #2DD4BF;
          margin-bottom: 4px;
        }

        .deg-headline {
          font-size: 1.25rem;
          font-weight: 900;
          color: #FFFFFF;
          letter-spacing: -0.02em;
          margin: 0 0 6px;
        }

        .deg-desc {
          font-size: 0.85rem;
          color: #94A3B8;
          line-height: 1.5;
          margin: 0;
          max-width: 620px;
        }

        .deg-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .btn-deg-start {
          background: #FF5B38;
          color: #FFFFFF;
          border: none;
          padding: 13px 24px;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.15s ease;
          box-shadow: 0 4px 14px rgba(255, 91, 56, 0.35);
        }

        .btn-deg-start:hover {
          background: #E04826;
          transform: translateY(-1px);
        }

        .btn-deg-pipeline {
          background: rgba(255, 255, 255, 0.08);
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 13px 20px;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-deg-pipeline:hover {
          background: rgba(255, 255, 255, 0.14);
          border-color: #2DD4BF;
          color: #2DD4BF;
        }
      `}</style>
    </div>
  );
};
