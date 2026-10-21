import React from 'react';
import type { CreatorProfile } from '../types/creator';
import { ArrowRight, Flame } from 'lucide-react';

interface CreatorAvailabilityProps {
  availability: CreatorProfile['availability'];
  onRequestBooking: () => void;
}

export const CreatorAvailability: React.FC<CreatorAvailabilityProps> = ({
  availability,
  onRequestBooking,
}) => {
  const remaining = availability.slotsRemaining;
  const total = availability.totalSlots;
  const percentTaken = ((total - remaining) / total) * 100;

  return (
    <div className="card availability-banner-card">
      <div className="avail-left">
        <div className="avail-badge-row">
          <span className="avail-status-tag">
            <span className="pulse-dot"></span>
            <span>{availability.label}</span>
          </span>
          <span className="limited-slots-tag">
            <Flame size={13} className="text-orange" />
            <span>High Demand: Only {remaining} of {total} slots available for Q4</span>
          </span>
        </div>

        <h3 className="avail-heading">Next Production Window Opens {availability.earliestDelivery}</h3>
        <p className="avail-sub">
          Alex reserves a maximum of 5 brand partnerships each month to ensure dedicated script research and high organic audience retention.
        </p>

        {/* Visual Slots Progress Bar */}
        <div className="slots-meter-box">
          <div className="meter-labels">
            <span>Monthly Campaign Capacity:</span>
            <span className="bold">{total - remaining} Booked / {remaining} Remaining</span>
          </div>
          <div className="meter-track">
            <div className="meter-fill" style={{ width: `${percentTaken}%` }}></div>
          </div>
        </div>
      </div>

      <div className="avail-right">
        <button 
          type="button" 
          className="btn btn-primary btn-lg reserve-btn"
          onClick={onRequestBooking}
        >
          <span>Reserve a Production Slot</span>
          <ArrowRight size={15} />
        </button>
        <span className="avail-note">No upfront charge until brief confirmation</span>
      </div>

      <style>{`
        .availability-banner-card {
          padding: 28px 32px;
          margin-bottom: 40px;
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
        }

        @media (max-width: 860px) {
          .availability-banner-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .avail-right {
            width: 100%;
          }
          .reserve-btn {
            width: 100%;
          }
        }

        .avail-left {
          flex: 1;
        }

        .avail-badge-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .avail-status-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #1D1D1F;
          background: #F5F5F7;
          padding: 4px 12px;
          border-radius: 9999px;
          border: 1px solid rgba(0, 0, 0, 0.06);
        }

        .pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: #000000;
        }

        .limited-slots-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.75rem;
          font-weight: 500;
          color: #515154;
          background: #F5F5F7;
          padding: 4px 12px;
          border-radius: 9999px;
          border: 1px solid rgba(0, 0, 0, 0.06);
        }

        .text-orange {
          color: #1D1D1F;
        }

        .avail-heading {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1D1D1F;
          margin-bottom: 6px;
          letter-spacing: -0.01em;
        }

        .avail-sub {
          font-size: 0.85rem;
          color: #515154;
          line-height: 1.5;
          margin-bottom: 16px;
          max-width: 600px;
        }

        .slots-meter-box {
          max-width: 460px;
          background: #F5F5F7;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.06);
        }

        .meter-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #86868B;
          margin-bottom: 6px;
        }

        .meter-labels .bold {
          font-weight: 600;
          color: #1D1D1F;
        }

        .meter-track {
          width: 100%;
          height: 6px;
          background-color: #E5E5E7;
          border-radius: 9999px;
          overflow: hidden;
        }

        .meter-fill {
          height: 100%;
          background: #000000;
          border-radius: 9999px;
          transition: width 0.5s ease;
        }

        .avail-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .reserve-btn {
          background: #000000 !important;
          color: #FFFFFF !important;
          border: none !important;
          border-radius: 9999px !important;
          padding: 12px 24px !important;
          font-weight: 600 !important;
          transition: background 0.15s ease !important;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
        }

        .reserve-btn:hover {
          background: #2D2D2D !important;
        }

        .avail-note {
          font-size: 0.72rem;
          color: #86868B;
        }
      `}</style>
    </div>
  );
};
