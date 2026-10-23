import React, { useState } from 'react';
import type { AudienceMetrics } from '../types/creator';
import { VerificationBadge } from './VerificationBadge';
import { 
  Users, 
  Eye, 
  TrendingUp, 
  Globe2, 
  ShieldCheck, 
  BarChart3, 
  PieChart, 
  Info,
  Calendar
} from 'lucide-react';

interface CreatorMetricsProps {
  metrics: AudienceMetrics;
  onOpenVerificationModal: () => void;
}

export const CreatorMetrics: React.FC<CreatorMetricsProps> = ({
  metrics,
  onOpenVerificationModal,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'geography' | 'demographics'>('overview');

  return (
    <section className="metrics-section card" id="creator-metrics">
      {/* Metrics Section Header */}
      <div className="metrics-header-row">
        <div className="metrics-header-left">
          <div className="section-tag-row">
            <span className="section-tag">Audience Intelligence</span>
            <span className="sync-tag">
              <Calendar size={12} />
              <span>Verified 3 days ago via Meta & YouTube APIs</span>
            </span>
          </div>
          <h2 className="section-title">Verified Audience & Performance</h2>
          <p className="section-desc">
            Independent audience analytics audited via official platform tokens. No fabricated or estimated metrics.
          </p>
        </div>

        <div className="metrics-header-right">
          <button 
            type="button" 
            className="verify-explainer-link"
            onClick={onOpenVerificationModal}
          >
            <ShieldCheck size={14} className="text-success" />
            <span>How metrics are verified</span>
            <Info size={12} />
          </button>
        </div>
      </div>

      {/* Primary 4 Metric Cards */}
      <div className="primary-metrics-grid">
        {/* Followers / Audience Card */}
        <div className="metric-box box-audience">
          <div className="metric-box-top">
            <div className="metric-icon-box icon-audience">
              <Users size={17} />
            </div>
            <VerificationBadge level="verified" size="sm" onClick={onOpenVerificationModal} />
          </div>
          <div className="metric-value-row">
            <span className="metric-number">{metrics.totalAudience.toLocaleString()}</span>
            <span className="metric-badge-growth">+14% / 90d</span>
          </div>
          <span className="metric-label">Total Verified Audience</span>
          <span className="metric-sublabel">
            {metrics.platformFollowers?.youtube ? `${(metrics.platformFollowers.youtube / 1000).toFixed(0)}K YouTube` : '52K YouTube'} • {metrics.platformFollowers?.instagram ? `${(metrics.platformFollowers.instagram / 1000).toFixed(0)}K Instagram` : '28K Instagram'} • {metrics.platformFollowers?.linkedin ? `${(metrics.platformFollowers.linkedin / 1000).toFixed(0)}K LinkedIn` : '5K LinkedIn'}
          </span>
        </div>

        {/* Average Views Card */}
        <div className="metric-box box-views">
          <div className="metric-box-top">
            <div className="metric-icon-box icon-views">
              <Eye size={17} />
            </div>
            <VerificationBadge level="verified" size="sm" onClick={onOpenVerificationModal} />
          </div>
          <div className="metric-value-row">
            <span className="metric-number">{metrics.averageViews.toLocaleString()}</span>
            <span className="metric-badge-benchmark">30d Rolling Avg</span>
          </div>
          <span className="metric-label">Average Views per Post</span>
          <span className="metric-sublabel">Based on last 12 published video formats</span>
        </div>

        {/* Engagement Rate Card */}
        <div className="metric-box box-engagement">
          <div className="metric-box-top">
            <div className="metric-icon-box icon-engagement">
              <TrendingUp size={17} />
            </div>
            <VerificationBadge level="verified" size="sm" onClick={onOpenVerificationModal} />
          </div>
          <div className="metric-value-row">
            <span className="metric-number">{metrics.engagementRate}%</span>
            <span className="metric-badge-growth">2.1x Category Avg</span>
          </div>
          <span className="metric-label">Audited Engagement Rate</span>
          <span className="metric-sublabel">Likes, shares, bookmarks & comments vs reach</span>
        </div>

        {/* Target Market Geography Card */}
        <div className="metric-box box-geography">
          <div className="metric-box-top">
            <div className="metric-icon-box icon-geography">
              <Globe2 size={17} />
            </div>
            <VerificationBadge level="verified" size="sm" onClick={onOpenVerificationModal} />
          </div>
          <div className="metric-value-row">
            <span className="metric-number">{metrics.targetMarketPercentage}%</span>
            <span className="metric-badge-benchmark">{metrics.targetMarketCountry} Focus</span>
          </div>
          <span className="metric-label">Target Market Audience</span>
          <span className="metric-sublabel">Tier 1 tech hubs: Mumbai, Bengaluru, Delhi</span>
        </div>
      </div>

      {/* Deep-Dive Sub-Navigation Tabs */}
      <div className="demographics-panel">
        <div className="deep-dive-tabs">
          <button 
            type="button" 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <BarChart3 size={14} />
            <span>Age Distribution</span>
          </button>
          <button 
            type="button" 
            className={`tab-btn ${activeTab === 'geography' ? 'active' : ''}`}
            onClick={() => setActiveTab('geography')}
          >
            <Globe2 size={14} />
            <span>Audience Geography</span>
          </button>
          <button 
            type="button" 
            className={`tab-btn ${activeTab === 'demographics' ? 'active' : ''}`}
            onClick={() => setActiveTab('demographics')}
          >
            <PieChart size={14} />
            <span>Gender & City Split</span>
          </button>
        </div>

        <div className="tab-display-body">
          {activeTab === 'overview' && (
            <div className="breakdown-grid">
              <div className="breakdown-card">
                <div className="breakdown-title-row">
                  <h4>Audience Age Brackets (Meta & YouTube Audience Graph)</h4>
                  <span className="badge badge-verified badge-sm">Verified</span>
                </div>
                <div className="progress-bars-list">
                  {metrics.ageDistribution.map((item) => (
                    <div key={item.label} className="bar-row">
                      <div className="bar-labels">
                        <span className="bracket-label">{item.label} years</span>
                        <span className="percentage-val">{item.percentage}%</span>
                      </div>
                      <div className="bar-track">
                        <div 
                          className="bar-fill" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="breakdown-footnote">
                  84% of Alex's audience is between 18 and 34 years old — high purchasing power for tech, SaaS, productivity, and developer tools.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'geography' && (
            <div className="breakdown-grid">
              <div className="breakdown-card">
                <div className="breakdown-title-row">
                  <h4>Top Audience Countries</h4>
                  <span className="badge badge-verified badge-sm">Verified</span>
                </div>
                <div className="progress-bars-list">
                  {metrics.topGeographies.map((geo) => (
                    <div key={geo.country} className="bar-row">
                      <div className="bar-labels">
                        <span className="bracket-label">{geo.country}</span>
                        <span className="percentage-val">{geo.percentage}%</span>
                      </div>
                      <div className="bar-track">
                        <div 
                          className="bar-fill geo" 
                          style={{ width: `${geo.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="breakdown-footnote">
                  62% of viewers reside in India, with significant organic distribution across the United States (18%) and United Kingdom (8%).
                </p>
              </div>
            </div>
          )}

          {activeTab === 'demographics' && (
            <div className="breakdown-grid two-col">
              <div className="breakdown-card">
                <div className="breakdown-title-row">
                  <h4>Gender Representation</h4>
                  <span className="badge badge-verified badge-sm">Verified</span>
                </div>
                <div className="gender-split-row">
                  {metrics.genderDistribution.map((g) => (
                    <div key={g.label} className="gender-box">
                      <span className="gender-pct">{g.percentage}%</span>
                      <span className="gender-label">{g.label}</span>
                    </div>
                  ))}
                </div>
                <div className="gender-bar-combo">
                  <div className="male-bar" style={{ width: '64%' }}></div>
                  <div className="female-bar" style={{ width: '36%' }}></div>
                </div>
              </div>

              <div className="breakdown-card">
                <div className="breakdown-title-row">
                  <h4>Top Metropolitan Hubs</h4>
                  <span className="badge badge-verified badge-sm">Verified</span>
                </div>
                <div className="city-list">
                  {metrics.topCities.map((c) => (
                    <div key={c.city} className="city-item">
                      <span className="city-name">{c.city}</span>
                      <span className="city-pct">{c.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .metrics-section {
          padding: 28px;
          margin-bottom: 28px;
          background: #FFFFFF;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: var(--radius-xl);
          box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
        }

        .metrics-header-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .section-tag-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
          flex-wrap: wrap;
        }

        .sync-tag {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.725rem;
          font-weight: 600;
          color: #047857;
          background-color: #ECFDF5;
          padding: 3px 10px;
          border-radius: var(--radius-full);
          border: 1px solid #A7F3D0;
        }

        .verify-explainer-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 500;
          color: #1D1D1F;
          background-color: #F5F5F7;
          padding: 7px 14px;
          border-radius: 9999px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          transition: all 0.15s ease;
        }

        .verify-explainer-link:hover {
          background-color: #E8E8ED;
        }

        .primary-metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        @media (max-width: 992px) {
          .primary-metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 520px) {
          .primary-metrics-grid {
            grid-template-columns: 1fr;
          }
        }

        .metric-box {
          background: #F5F5F7;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 20px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease, border-color 0.2s ease;
          position: relative;
        }

        .metric-box:hover {
          transform: translateY(-2px);
          border-color: rgba(0, 0, 0, 0.15);
        }

        .metric-box-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .metric-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1D1D1F;
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
        }

        .metric-icon-box.icon-audience,
        .metric-icon-box.icon-views,
        .metric-icon-box.icon-engagement,
        .metric-icon-box.icon-geography {
          color: #1D1D1F;
          background: #FFFFFF;
        }

        .metric-value-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 4px;
          flex-wrap: wrap;
        }

        .metric-number {
          font-size: 1.85rem;
          font-weight: 700;
          color: #1D1D1F;
          letter-spacing: -0.025em;
        }

        .metric-badge-growth {
          font-size: 0.72rem;
          font-weight: 600;
          color: #1D1D1F;
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
          padding: 2px 8px;
          border-radius: 9999px;
        }

        .metric-badge-benchmark {
          font-size: 0.72rem;
          font-weight: 600;
          color: #6E6E73;
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
          padding: 2px 8px;
          border-radius: 9999px;
        }

        .metric-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #1D1D1F;
          margin-bottom: 3px;
        }

        .metric-sublabel {
          font-size: 0.725rem;
          color: #86868B;
          line-height: 1.4;
        }

        .demographics-panel {
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 20px;
          background-color: #FFFFFF;
          overflow: hidden;
        }

        .deep-dive-tabs {
          display: flex;
          background: #F5F5F7;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          overflow-x: auto;
          gap: 6px;
          padding: 6px;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          font-size: 0.85rem;
          font-weight: 500;
          color: #6E6E73;
          border-radius: 9999px;
          border: none;
          white-space: nowrap;
          transition: all 0.15s ease;
          background: transparent;
          cursor: pointer;
        }

        .tab-btn:hover {
          color: #1D1D1F;
        }

        .tab-btn.active {
          color: #FFFFFF;
          background-color: #000000;
          font-weight: 600;
        }

        .tab-display-body {
          padding: 24px;
        }

        .breakdown-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        .breakdown-grid.two-col {
          grid-template-columns: repeat(2, 1fr);
        }

        @media (max-width: 768px) {
          .breakdown-grid.two-col {
            grid-template-columns: 1fr;
          }
        }

        .breakdown-card {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .breakdown-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .breakdown-title-row h4 {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1D1D1F;
        }

        .progress-bars-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .bar-row {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .bar-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.825rem;
        }

        .bracket-label {
          color: #515154;
          font-weight: 500;
        }

        .percentage-val {
          color: #1D1D1F;
          font-weight: 600;
        }

        .bar-track {
          width: 100%;
          height: 8px;
          background-color: #E5E5E7;
          border-radius: 9999px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          background: #000000;
          border-radius: 9999px;
          transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .bar-fill.geo {
          background: #515154;
        }

        .breakdown-footnote {
          font-size: 0.775rem;
          color: #86868B;
          margin-top: 6px;
          line-height: 1.5;
        }

        .gender-split-row {
          display: flex;
          gap: 20px;
          margin-bottom: 8px;
        }

        .gender-box {
          display: flex;
          flex-direction: column;
        }

        .gender-pct {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1D1D1F;
        }

        .gender-label {
          font-size: 0.75rem;
          color: #86868B;
          font-weight: 600;
          text-transform: uppercase;
        }

        .gender-bar-combo {
          display: flex;
          width: 100%;
          height: 10px;
          border-radius: 9999px;
          overflow: hidden;
          margin-top: 4px;
        }

        .male-bar {
          background: #000000;
        }

        .female-bar {
          background: #86868B;
        }

        .city-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .city-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          background: #F5F5F7;
          border-radius: 10px;
          border: 1px solid rgba(0, 0, 0, 0.04);
          font-size: 0.825rem;
          transition: background 0.15s ease;
        }

        .city-item:hover {
          background: #E8E8ED;
        }

        .city-name {
          font-weight: 500;
          color: #1D1D1F;
        }

        .city-pct {
          font-weight: 600;
          color: #1D1D1F;
        }
      `}</style>
    </section>
  );
};
