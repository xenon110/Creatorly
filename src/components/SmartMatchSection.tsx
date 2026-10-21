import React, { useState, useMemo } from 'react';
import type { CreatorProfile, CurrencyCode, ServicePackage } from '../types/creator';
import { formatCurrency } from '../data/currencies';
import { Check, ShieldCheck, SlidersHorizontal, Layers, Send, Eye, ThumbsUp, Users, ExternalLink } from 'lucide-react';
import { VerificationBadge } from './VerificationBadge';

interface SmartMatchProps {
  creators: CreatorProfile[];
  currentCurrency: CurrencyCode;
  onSelectCreator: (creator: CreatorProfile) => void;
  onInitiateBooking: (creator: CreatorProfile, packageItem?: ServicePackage) => void;
  onToggleCompare: (creator: CreatorProfile) => void;
  isCreatorInCompare: (creatorId: string) => boolean;
  onShowToast: (msg: string) => void;
}

interface PromptPreset {
  title: string;
  query: string;
  icon: string;
}

const PRESET_PROMPTS: PromptPreset[] = [
  {
    icon: '',
    title: 'Fashion & Apparel (Under ₹10k)',
    query: 'I own a small clothing brand. I need an Instagram creator in India who makes fashion reels, has an audience interested in affordable clothing, and charges less than ₹10,000 per campaign.'
  },
  {
    icon: '',
    title: 'Tech & Developer Tools (Under ₹12k)',
    query: 'I have a developer AI coding product. Looking for a credible tech YouTuber in India who does tutorials and brand integrations for software engineers under ₹12,000.'
  },
  {
    icon: '',
    title: 'Fitness & Gym UGC (Under ₹5k)',
    query: 'We need an athletic creator to produce a 30-45s vertical gym UGC ad video for our activewear brand with paid advertising rights under ₹5,000.'
  },
  {
    icon: '',
    title: 'Cafe & Culinary Spotlight (Under ₹8k)',
    query: 'Looking for a verified food creator in Mumbai for an aesthetic cafe launch reel with high local engagement under ₹8,000.'
  }
];

export const SmartMatchSection: React.FC<SmartMatchProps> = ({
  creators,
  currentCurrency,
  onSelectCreator,
  onInitiateBooking,
  onToggleCompare,
  isCreatorInCompare,
  onShowToast
}) => {
  const [searchPrompt, setSearchPrompt] = useState<string>(
    'I own a small clothing brand. I need an Instagram creator in India who makes fashion reels, has an audience interested in affordable clothing, and charges less than ₹10,000 per campaign.'
  );
  const [appliedPrompt, setAppliedPrompt] = useState<string>(searchPrompt);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterMaxBudget, setFilterMaxBudget] = useState<number>(15000);

  // Parse natural language requirements
  const parsedCriteria = useMemo(() => {
    const q = appliedPrompt.toLowerCase();

    // Budget extraction
    let budget = filterMaxBudget;
    const budgetMatch = q.match(/(?:under|less than|budget of|within|below)\s*(?:₹|inr|rs\.?)?\s*([0-9,]+)/i);
    if (budgetMatch && budgetMatch[1]) {
      const parsedNum = parseInt(budgetMatch[1].replace(/,/g, ''), 10);
      if (!isNaN(parsedNum) && parsedNum > 1000) {
        budget = parsedNum;
      }
    }

    // Platform detection
    let platform = filterPlatform;
    if (platform === 'all') {
      if (q.includes('youtube')) platform = 'youtube';
      else if (q.includes('instagram') || q.includes('reels') || q.includes('reel')) platform = 'instagram';
      else if (q.includes('linkedin')) platform = 'linkedin';
    }

    // Niche keywords
    const keywords: string[] = [];
    if (q.includes('fashion') || q.includes('clothing') || q.includes('apparel') || q.includes('styling') || q.includes('outfit')) {
      keywords.push('fashion', 'clothing', 'styling');
    }
    if (q.includes('tech') || q.includes('ai') || q.includes('software') || q.includes('coding') || q.includes('developer') || q.includes('gadget')) {
      keywords.push('tech', 'ai', 'software', 'technology');
    }
    if (q.includes('fitness') || q.includes('gym') || q.includes('workout') || q.includes('athletic') || q.includes('protein')) {
      keywords.push('fitness', 'sports', 'workout');
    }
    if (q.includes('food') || q.includes('cafe') || q.includes('culinary') || q.includes('dining') || q.includes('recipe')) {
      keywords.push('food', 'travel', 'cafe');
    }

    // Format detection
    let format = 'any';
    if (q.includes('reel') || q.includes('reels')) format = 'Reel';
    else if (q.includes('ugc')) format = 'UGC';
    else if (q.includes('youtube') || q.includes('integration') || q.includes('tutorial')) format = 'Integration';

    return {
      budget,
      platform,
      format,
      keywords,
      location: q.includes('mumbai') ? 'Mumbai' : q.includes('delhi') ? 'Delhi' : q.includes('bengaluru') ? 'Bengaluru' : 'India'
    };
  }, [appliedPrompt, filterPlatform, filterMaxBudget]);

  // Rank creators and synthesize match reasons
  const matchedCreators = useMemo(() => {
    return creators.map((creator) => {
      let score = 50; // base score
      const reasons: string[] = [];
      const lowestPrice = Math.min(...creator.packages.map(p => p.priceInINR));

      // 1. Budget fit
      if (lowestPrice <= parsedCriteria.budget) {
        score += 25;
        const diff = parsedCriteria.budget - lowestPrice;
        if (diff > 0) {
          reasons.push(`✓ Within budget: starts at ${formatCurrency(lowestPrice, currentCurrency)} (saves ${formatCurrency(diff, currentCurrency)} vs max limit)`);
        } else {
          reasons.push(`✓ Matches your exact budget of ${formatCurrency(parsedCriteria.budget, currentCurrency)}`);
        }
      } else {
        score -= 20;
        reasons.push(`⚠ Starting package (${formatCurrency(lowestPrice, currentCurrency)}) exceeds your target budget of ${formatCurrency(parsedCriteria.budget, currentCurrency)}`);
      }

      // 2. Niche relevance
      const creatorNiches = [creator.primaryNiche, ...creator.subNiches].join(' ').toLowerCase();
      const matchedKeywords = parsedCriteria.keywords.filter(k => creatorNiches.includes(k));
      if (matchedKeywords.length > 0) {
        score += 25;
        reasons.push(`✓ Niche match: ${creator.primaryNiche} (${creator.metrics.targetMarketPercentage}% target audience in ${creator.location.country})`);
      } else {
        score -= 10;
      }

      // 3. Platform & Format
      if (parsedCriteria.platform !== 'all') {
        const hasPlatform = creator.socialLinks.some(s => s.platform.toLowerCase() === parsedCriteria.platform);
        if (hasPlatform) {
          score += 15;
          reasons.push(`✓ Active on ${parsedCriteria.platform.toUpperCase()} with ${creator.metrics.platformFollowers[parsedCriteria.platform as keyof typeof creator.metrics.platformFollowers]?.toLocaleString() || 'verified'} followers`);
        }
      }

      // 4. Performance & Reliability
      if (creator.metrics.engagementRate >= 4.5) {
        score += 10;
        reasons.push(`✓ Strong verified engagement: ${creator.metrics.engagementRate}% (exceeds category benchmark)`);
      }

      // 5. Turnaround & Availability
      if (creator.availability.status === 'available') {
        score += 5;
        reasons.push(`✓ Available now: ${creator.availability.earliestDelivery} (avg reply ${creator.availability.responseTime})`);
      }

      // Find recommended package for user's intent
      let recPkg = creator.packages[0];
      if (parsedCriteria.format === 'UGC') {
        const ugc = creator.packages.find(p => p.title.toLowerCase().includes('ugc'));
        if (ugc) recPkg = ugc;
      } else if (parsedCriteria.format === 'Reel') {
        const reel = creator.packages.find(p => p.title.toLowerCase().includes('reel'));
        if (reel) recPkg = reel;
      } else if (parsedCriteria.format === 'Integration') {
        const yt = creator.packages.find(p => p.platform === 'YouTube' || p.title.toLowerCase().includes('integration'));
        if (yt) recPkg = yt;
      }

      const finalScore = Math.min(99, Math.max(35, score));

      return {
        creator,
        score: finalScore,
        reasons: reasons.slice(0, 4),
        recommendedPackage: recPkg,
        withinBudget: lowestPrice <= parsedCriteria.budget
      };
    }).sort((a, b) => b.score - a.score);
  }, [creators, parsedCriteria, currentCurrency]);

  const handleApplyPreset = (preset: PromptPreset) => {
    setSearchPrompt(preset.query);
    setAppliedPrompt(preset.query);
    onShowToast(`Applied SmartMatch preset: ${preset.title}`);
  };

  const handleRunMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPrompt.trim()) return;
    setAppliedPrompt(searchPrompt);
    onShowToast('SmartMatch analyzed your campaign brief!');
  };

  return (
    <section className="smartmatch-section" id="smartmatch">
      <div className="smartmatch-container">
        {/* Header with Differentiator Callout */}
        <div className="smartmatch-header">
          <div className="smartmatch-badge">
            <span>Campaign Matcher</span>
          </div>
          <h2 className="smartmatch-title">
            Find the right creator in seconds.
          </h2>
          <p className="smartmatch-subtitle">
            Describe your campaign goals, platform requirements, or budget in natural language. We filter verified creators, analyze real-time pricing, and explain exact compatibility.
          </p>
        </div>

        {/* Natural Language Search Input Box */}
        <div className="smartmatch-card">
          <form onSubmit={handleRunMatch} className="smartmatch-form">
            <div className="smartmatch-textarea-wrap">
              <label htmlFor="smartmatch-input" className="smartmatch-label">
                Describe your brand, campaign goals, target audience, and budget:
              </label>
              <textarea
                id="smartmatch-input"
                className="smartmatch-textarea"
                rows={3}
                value={searchPrompt}
                onChange={(e) => setSearchPrompt(e.target.value)}
                placeholder="e.g. I run a sustainable activewear startup. I need a verified fitness creator in India for a 30s UGC video under ₹6,000..."
              />
            </div>

            <div className="smartmatch-form-footer">
              <div className="smartmatch-filters-inline">
                <div className="filter-pill-select">
                  <SlidersHorizontal size={14} />
                  <span>Platform:</span>
                  <select
                    value={filterPlatform}
                    onChange={(e) => setFilterPlatform(e.target.value)}
                    className="inline-select"
                  >
                    <option value="all">Any Platform</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                  </select>
                </div>

                <div className="filter-pill-select">
                  <span>Max Budget:</span>
                  <select
                    value={filterMaxBudget}
                    onChange={(e) => setFilterMaxBudget(Number(e.target.value))}
                    className="inline-select"
                  >
                    <option value={5000}>Under ₹5,000</option>
                    <option value={10000}>Under ₹10,000</option>
                    <option value={15000}>Under ₹15,000</option>
                    <option value={25000}>Under ₹25,000</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-smartmatch-submit">
                <span>Search Creators</span>
              </button>
            </div>
          </form>

          {/* Quick Presets */}
          <div className="smartmatch-presets">
            <span className="presets-label">Popular campaign searches:</span>
            <div className="presets-list">
              {PRESET_PROMPTS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`preset-chip ${appliedPrompt === preset.query ? 'active' : ''}`}
                  onClick={() => handleApplyPreset(preset)}
                >
                  <span className="preset-icon">{preset.icon}</span>
                  <span className="preset-text">{preset.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Parsed Criteria Summary Bar */}
        <div className="criteria-summary-bar">
          <div className="criteria-left">
            <span className="criteria-count">
              <strong>{matchedCreators.length}</strong> Qualified Creators Analyzed
            </span>
            <div className="criteria-tags">
              <span className="criteria-tag">
                Budget: {formatCurrency(parsedCriteria.budget, currentCurrency)}
              </span>
              <span className="criteria-tag">
                Platform: {parsedCriteria.platform.toUpperCase()}
              </span>
              <span className="criteria-tag">
                Location: {parsedCriteria.location}
              </span>
              {parsedCriteria.format !== 'any' && (
                <span className="criteria-tag">Format: {parsedCriteria.format}</span>
              )}
            </div>
          </div>
          <span className="criteria-note">
            Ranked by authentic verified metrics, budget fit, and audience demographics.
          </span>
        </div>

        {/* Match Results Grid */}
        <div className="smartmatch-results-grid">
          {matchedCreators.map(({ creator, score, reasons, recommendedPackage }) => {
            const inCompare = isCreatorInCompare(creator.id);

            return (
              <div key={creator.id} className={`match-card ${score >= 90 ? 'top-match' : ''}`}>
                {score >= 90 && (
                  <div className="top-match-banner">
                    <span>Top Match • {score}% Compatibility</span>
                  </div>
                )}

                <div className="match-card-body">
                  {/* Creator Info Header */}
                  <div className="match-card-header">
                    <div className="creator-profile-snippet" onClick={() => onSelectCreator(creator)}>
                      <img
                        src={creator.avatarUrl}
                        alt={creator.fullName}
                        className="match-avatar"
                      />
                      <div className="snippet-info">
                        <div className="name-row">
                          <h4 className="match-name">{creator.fullName}</h4>
                          {creator.verifiedBadge && <VerificationBadge />}
                        </div>
                        <span className="match-handle">{creator.handle}</span>
                        <div className="match-location-niche">
                          <span className="match-niche">{creator.primaryNiche}</span>
                          <span className="bullet-sep">•</span>
                          <span className="match-city">{creator.location.city}, {creator.location.country}</span>
                        </div>
                      </div>
                    </div>

                    <div className="match-score-badge">
                      <span className="score-val">{score}%</span>
                      <span className="score-lbl">Match</span>
                    </div>
                  </div>

                  {/* Quick Verified Metrics Bar */}
                  <div className="match-metrics-row">
                    <div className="match-metric">
                      <Users size={14} className="metric-icon" />
                      <span className="metric-val">{creator.metrics.totalAudience.toLocaleString()}</span>
                      <span className="metric-lbl">Audience</span>
                    </div>
                    <div className="match-metric">
                      <Eye size={14} className="metric-icon" />
                      <span className="metric-val">{creator.metrics.averageViews.toLocaleString()}</span>
                      <span className="metric-lbl">Avg Views</span>
                    </div>
                    <div className="match-metric">
                      <ThumbsUp size={14} className="metric-icon" />
                      <span className="metric-val">{creator.metrics.engagementRate}%</span>
                      <span className="metric-lbl">Engagement</span>
                    </div>
                    <div className="match-metric">
                      <ShieldCheck size={14} className="metric-icon text-verified" />
                      <span className="metric-val">{creator.metrics.targetMarketPercentage}%</span>
                      <span className="metric-lbl">{creator.location.country} Fit</span>
                    </div>
                  </div>

                  {/* Why this creator matches (The Key Explanatory Differentiator) */}
                  <div className="match-reasons-box">
                    <div className="reasons-heading">
                      <Check size={14} className="text-verified" />
                      <span>Why SmartMatch Selected This Creator:</span>
                    </div>
                    <ul className="reasons-list">
                      {reasons.map((reason, rIdx) => (
                        <li key={rIdx} className="reason-item">
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommended Package Callout */}
                  <div className="recommended-package-preview">
                    <div className="rec-pkg-left">
                      <span className="rec-badge">Recommended Service:</span>
                      <h5 className="rec-pkg-title">{recommendedPackage.title}</h5>
                      <span className="rec-pkg-deliverables">
                        {recommendedPackage.deliveryDays}-day delivery • {recommendedPackage.includedRevisions} revision • {recommendedPackage.publishingIncluded ? 'Includes personal feed post' : 'Commercial UGC digital ads'}
                      </span>
                    </div>
                    <div className="rec-pkg-price">
                      <span className="rec-price-amount">
                        {formatCurrency(recommendedPackage.priceInINR, currentCurrency)}
                      </span>
                      <span className="rec-price-label">fixed package</span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="match-card-actions">
                    <button
                      type="button"
                      className="btn-quick-hire"
                      onClick={() => onInitiateBooking(creator, recommendedPackage)}
                    >
                      <Send size={15} />
                      <span>Request Collaboration</span>
                    </button>

                    <button
                      type="button"
                      className={`btn-compare-toggle ${inCompare ? 'active' : ''}`}
                      onClick={() => onToggleCompare(creator)}
                    >
                      <Layers size={15} />
                      <span>{inCompare ? 'Shortlisted' : 'Compare'}</span>
                    </button>

                    <button
                      type="button"
                      className="btn-view-storefront"
                      onClick={() => onSelectCreator(creator)}
                      title="Open dedicated public storefront"
                    >
                      <span>Storefront</span>
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .smartmatch-section {
          padding: 56px 0 72px 0;
          background: #F5F5F7;
          border-bottom: 1px solid #E5E5E7;
          position: relative;
        }

        .smartmatch-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .smartmatch-header {
          text-align: center;
          max-width: 760px;
          margin: 0 auto 36px auto;
        }

        .smartmatch-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 14px;
          background: #E8E8ED;
          color: #1D1D1F;
          border-radius: var(--radius-full);
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 16px;
          border: 1px solid #D2D2D7;
          letter-spacing: 0.02em;
        }

        .smartmatch-title {
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 700;
          letter-spacing: -0.03em;
          color: #1D1D1F;
          margin-bottom: 14px;
          line-height: 1.2;
        }

        .smartmatch-subtitle {
          font-size: 16px;
          color: #6E6E73;
          line-height: 1.6;
        }

        .smartmatch-card {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: var(--radius-xl);
          padding: 28px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
          margin-bottom: 32px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .smartmatch-card:focus-within {
          border-color: #1D1D1F;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }

        .smartmatch-form {
          margin-bottom: 20px;
        }

        .smartmatch-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 10px;
        }

        .smartmatch-textarea-wrap {
          margin-bottom: 16px;
        }

        .smartmatch-textarea {
          width: 100%;
          border: 1px solid #E5E5E7;
          border-radius: var(--radius-md);
          padding: 16px 18px;
          font-family: inherit;
          font-size: 15px;
          line-height: 1.6;
          color: var(--text-primary);
          background-color: #F5F5F7;
          resize: vertical;
          transition: all 0.2s ease;
        }

        .smartmatch-textarea:focus {
          outline: none;
          background-color: #ffffff;
          border-color: #1D1D1F;
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.06);
        }

        .smartmatch-form-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .smartmatch-filters-inline {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .filter-pill-select {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: #F5F5F7;
          border: 1px solid #E5E5E7;
          padding: 7px 14px;
          border-radius: var(--radius-full);
          font-size: 13px;
          color: var(--text-secondary);
          transition: all 0.15s ease;
        }

        .filter-pill-select:hover {
          border-color: #D2D2D7;
          background-color: #FFFFFF;
        }

        .inline-select {
          border: none;
          background: transparent;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          cursor: pointer;
          outline: none;
        }

        .btn-smartmatch-submit {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #059669;
          color: #ffffff;
          border: none;
          padding: 11px 26px;
          border-radius: var(--radius-full);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(5, 150, 105, 0.35);
          transition: all 0.2s ease;
        }

        .btn-smartmatch-submit:hover {
          background: #047857;
          transform: translateY(-1.5px);
          box-shadow: 0 8px 22px rgba(5, 150, 105, 0.45);
        }

        .smartmatch-presets {
          border-top: 1px solid #E5E5E7;
          padding-top: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .presets-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .presets-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .preset-chip {
          display: inline-flex;
          align-items: center;
          background-color: #F5F5F7;
          border: 1px solid transparent;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 12px;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .preset-chip:hover {
          background-color: #E8E8ED;
          color: var(--text-primary);
        }

        .preset-chip.active {
          background: #059669;
          color: #FFFFFF;
          box-shadow: 0 2px 8px rgba(5, 150, 105, 0.3);
        }

        .criteria-summary-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          padding: 14px 20px;
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: var(--radius-lg);
          margin-bottom: 28px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
        }

        .criteria-left {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .criteria-count {
          font-size: 14px;
          color: var(--text-primary);
        }

        .criteria-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .criteria-tag {
          font-size: 12px;
          background: #F5F5F7;
          border: 1px solid #E5E5E7;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          color: var(--text-secondary);
          font-weight: 500;
        }

        .criteria-note {
          font-size: 12px;
          color: var(--text-muted);
        }

        .smartmatch-results-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .match-card {
          background-color: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
          display: flex;
          flex-direction: column;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .match-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px -4px rgba(0, 0, 0, 0.08);
          border-color: rgba(0, 0, 0, 0.14);
        }

        .match-card.top-match {
          border-color: rgba(0, 0, 0, 0.16);
        }

        .top-match-banner {
          background: #059669;
          color: #FFFFFF;
          padding: 8px 18px;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          letter-spacing: 0.02em;
          box-shadow: 0 2px 8px rgba(5, 150, 105, 0.25);
        }

        .match-card-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .match-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
        }

        .creator-profile-snippet {
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
        }

        .match-avatar {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-full);
          object-fit: cover;
          border: 1px solid #E5E5E7;
        }

        .snippet-info {
          display: flex;
          flex-direction: column;
        }

        .name-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .match-name {
          font-size: 17px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .match-handle {
          font-size: 13px;
          color: var(--text-muted);
          font-family: var(--font-mono);
          font-weight: 500;
          margin-bottom: 4px;
        }

        .match-location-niche {
          font-size: 12px;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .bullet-sep {
          color: var(--text-muted);
        }

        .match-score-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #F5F5F7;
          border: 1px solid #E5E5E7;
          border-radius: var(--radius-md);
          padding: 6px 12px;
          min-width: 60px;
        }

        .score-val {
          font-size: 16px;
          font-weight: 700;
          color: #1D1D1F;
          line-height: 1;
        }

        .score-lbl {
          font-size: 10px;
          text-transform: uppercase;
          color: var(--text-muted);
          font-weight: 600;
          letter-spacing: 0.04em;
          margin-top: 3px;
        }

        .match-metrics-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          background: #F5F5F7;
          border: 1px solid #E5E5E7;
          border-radius: var(--radius-md);
          padding: 12px;
          margin-bottom: 16px;
        }

        .match-metric {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .metric-icon {
          color: var(--text-muted);
          margin-bottom: 3px;
        }

        .text-verified {
          color: var(--text-primary) !important;
        }

        .metric-val {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .metric-lbl {
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .match-reasons-box {
          background: #F5F5F7;
          border: 1px solid #E5E5E7;
          border-radius: var(--radius-md);
          padding: 14px 16px;
          margin-bottom: 16px;
        }

        .reasons-heading {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .reasons-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .reason-item {
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.45;
          font-weight: 500;
        }

        .recommended-package-preview {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 16px;
          background: #FFFFFF;
          border-radius: var(--radius-md);
          border: 1px solid #E5E5E7;
          border-left: 3px solid #1D1D1F;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
          margin-bottom: 18px;
          margin-top: auto;
        }

        .rec-badge {
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.04em;
        }

        .rec-pkg-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 2px 0;
        }

        .rec-pkg-deliverables {
          font-size: 11px;
          color: var(--text-muted);
        }

        .rec-pkg-price {
          text-align: right;
          white-space: nowrap;
        }

        .rec-price-amount {
          display: block;
          font-size: 17px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .rec-price-label {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 500;
        }

        .match-card-actions {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr;
          gap: 10px;
        }

        .btn-quick-hire {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: #059669;
          color: #ffffff;
          border: none;
          padding: 10px 16px;
          border-radius: var(--radius-full);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(5, 150, 105, 0.3);
          transition: all 0.2s ease;
        }

        .btn-quick-hire:hover {
          background: #047857;
          transform: translateY(-1.5px);
          box-shadow: 0 5px 14px rgba(5, 150, 105, 0.4);
        }

        .btn-compare-toggle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background-color: #FFFFFF;
          border: 1px solid #CBD5E1;
          color: #0F172A;
          padding: 9px 12px;
          border-radius: var(--radius-full);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-compare-toggle:hover {
          background-color: #ECFDF5;
          border-color: #A7F3D0;
          color: #059669;
        }

        .btn-compare-toggle.active {
          background: #ECFDF5;
          color: #059669;
          border-color: #059669;
          font-weight: 700;
        }

        .btn-view-storefront {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background-color: #F5F5F7;
          border: 1px solid #E5E5E7;
          color: var(--text-primary);
          padding: 9px 12px;
          border-radius: var(--radius-full);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-view-storefront:hover {
          background-color: #E8E8ED;
        }

        @media (max-width: 900px) {
          .smartmatch-results-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .match-metrics-row {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .match-card-actions {
            grid-template-columns: 1fr;
          }
          .criteria-summary-bar {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </section>
  );
};
