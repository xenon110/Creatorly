import React from 'react';
import type { CreatorProfile } from '../types/creator';
import { VerificationBadge } from './VerificationBadge';
import { YouTubeIcon, InstagramIcon, LinkedInIcon } from './SocialIcons';
import { 
  MapPin, 
  Languages, 
  ExternalLink, 
  ShieldCheck, 
  Award 
} from 'lucide-react';

interface CreatorHeaderProps {
  creator: CreatorProfile;
  onOpenVerificationModal: () => void;
  onShowToast: (msg: string) => void;
}

export const CreatorHeader: React.FC<CreatorHeaderProps> = ({
  creator,
  onOpenVerificationModal,
  onShowToast,
}) => {
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return <YouTubeIcon size={16} className="social-icon yt" />;
      case 'instagram':
        return <InstagramIcon size={16} className="social-icon ig" />;
      case 'linkedin':
        return <LinkedInIcon size={16} className="social-icon li" />;
      default:
        return <ExternalLink size={16} />;
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  return (
    <section className="creator-header-section" id="creator-header">
      <div className="header-identity-wrapper">
        {/* Creator Avatar & Visual Frame */}
        <div className="avatar-container">
          <img 
            src={creator.avatarUrl} 
            alt={`Profile photo of ${creator.fullName}`} 
            className="creator-avatar-img"
            loading="eager"
          />
          <div className="avatar-online-badge" title="Active on Creatorly today"></div>
          
          <button 
            type="button" 
            className="avatar-verification-pill"
            onClick={onOpenVerificationModal}
            title="Click to view verified identity & metrics"
          >
            <ShieldCheck size={13} />
            <span>ID Verified</span>
          </button>
        </div>

        {/* Creator Identity Details */}
        <div className="identity-details">
          {/* Top category & handles row */}
          <div className="identity-meta-top">
            <span className="niche-badge">{creator.primaryNiche}</span>
            <span className="meta-separator">•</span>
            <span className="creator-handle">{creator.handle}</span>
            <span className="meta-separator">•</span>
            <button 
              type="button" 
              className="verification-link-btn"
              onClick={onOpenVerificationModal}
            >
              <VerificationBadge level="verified" size="sm" />
            </button>
          </div>

          {/* Creator Name & Title */}
          <div className="name-row">
            <h1 className="creator-name">{creator.fullName}</h1>
            <div className="creator-pro-badge" title="Top Rated Technology Creator on Creatorly">
              <Award size={14} />
              <span>Top 5% Tech Creator</span>
            </div>
          </div>

          {/* Short Bio */}
          <p className="creator-bio">
            "{creator.bio}"
          </p>

          {/* Sub-niche chips */}
          <div className="sub-niches-list">
            {creator.subNiches.map((niche, idx) => (
              <span key={idx} className="sub-niche-pill">
                #{niche}
              </span>
            ))}
          </div>

          {/* Metadata Row: Location, Languages */}
          <div className="metadata-row">
            <div className="meta-item">
              <MapPin size={14} className="meta-icon" />
              <span>{creator.location.city}, {creator.location.country} {creator.location.flagEmoji}</span>
            </div>

            <div className="meta-item">
              <Languages size={14} className="meta-icon" />
              <span>{creator.languages.join(' & ')}</span>
            </div>
          </div>

          {/* Social Platforms Row */}
          <div className="social-platforms-section">
            <span className="socials-label">Connected Platforms:</span>
            <div className="social-links-grid">
              {creator.socialLinks.map((soc) => (
                <a
                  key={soc.platform}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-card"
                  title={`View ${soc.name} profile (${formatFollowers(soc.followers)} followers)`}
                  onClick={() => {
                    onShowToast(`Opening ${soc.name} profile: ${soc.handle}`);
                  }}
                >
                  <div className="social-card-left">
                    {getSocialIcon(soc.platform)}
                    <div className="social-text">
                      <span className="social-name">{soc.name}</span>
                      <span className="social-handle">{soc.handle}</span>
                    </div>
                  </div>
                  <div className="social-followers-pill">
                    <span className="count">{formatFollowers(soc.followers)}</span>
                    <span className="unit">audience</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .creator-header-section {
          padding-bottom: 24px;
          position: relative;
        }

        .header-identity-wrapper {
          display: flex;
          align-items: flex-start;
          gap: 32px;
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
          position: relative;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .header-identity-wrapper {
            flex-direction: column;
            gap: 20px;
            padding: 20px;
          }
        }

        .avatar-container {
          position: relative;
          flex-shrink: 0;
          padding: 0;
          border-radius: 20px;
        }

        .creator-avatar-img {
          width: 140px;
          height: 140px;
          border-radius: 20px;
          object-fit: cover;
          border: 1px solid rgba(0, 0, 0, 0.08);
          display: block;
        }

        @media (max-width: 768px) {
          .creator-avatar-img {
            width: 100px;
            height: 100px;
          }
        }

        .avatar-online-badge {
          display: none;
        }

        .avatar-verification-pill {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          border: 1px solid #A7F3D0;
          color: #FFFFFF;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 5px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .avatar-verification-pill:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          transform: translateX(-50%) translateY(-1px);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.45);
        }

        .identity-details {
          flex: 1;
        }

        .identity-meta-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }

        .niche-badge {
          font-size: 0.75rem;
          font-weight: 700;
          color: #059669;
          background: #ECFDF5;
          border: 1px solid #A7F3D0;
          padding: 4px 12px;
          border-radius: 9999px;
          letter-spacing: 0.01em;
        }

        .creator-handle {
          font-size: 0.85rem;
          color: #64748B;
          font-weight: 500;
          font-family: inherit;
          padding: 2px 6px;
        }

        .meta-separator {
          color: rgba(0, 0, 0, 0.15);
          font-size: 0.75rem;
        }

        .verification-link-btn {
          cursor: pointer;
          display: inline-flex;
          transition: opacity 0.15s ease;
        }

        .verification-link-btn:hover {
          opacity: 0.7;
        }

        .name-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }

        .creator-name {
          font-size: 2.2rem;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -0.03em;
        }

        .creator-pro-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #059669;
          background: #ECFDF5;
          border: 1px solid #A7F3D0;
          padding: 4px 12px;
          border-radius: 9999px;
        }

        .creator-bio {
          font-size: 0.95rem;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 14px;
          max-width: 680px;
        }

        .sub-niches-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 14px;
        }

        .sub-niche-pill {
          font-size: 0.75rem;
          font-weight: 500;
          color: #6E6E73;
          background-color: #F5F5F7;
          border: 1px solid rgba(0, 0, 0, 0.06);
          padding: 3px 10px;
          border-radius: 9999px;
          transition: all 0.15s ease;
        }

        .sub-niche-pill:hover {
          background-color: #E8E8ED;
          color: #1D1D1F;
        }

        .metadata-row {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .meta-icon {
          color: #1D1D1F;
        }

        .social-platforms-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .socials-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #86868B;
        }

        .social-links-grid {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .social-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 8px 14px;
          background: #F5F5F7;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 12px;
          text-decoration: none;
          box-shadow: none;
          transition: all 0.15s ease;
        }

        .social-card:hover {
          background: #E8E8ED;
          border-color: rgba(0, 0, 0, 0.12);
        }

        .social-card-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .social-icon.yt {
          color: #DC2626;
        }

        .social-icon.ig {
          color: #E1306C;
        }

        .social-icon.li {
          color: #0A66C2;
        }

        .social-text {
          display: flex;
          flex-direction: column;
        }

        .social-name {
          font-size: 0.825rem;
          font-weight: 600;
          color: #1D1D1F;
        }

        .social-handle {
          font-size: 0.7rem;
          color: #86868B;
        }

        .social-followers-pill {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          background: #FFFFFF;
          padding: 3px 8px;
          border-radius: 6px;
          border: 1px solid rgba(0, 0, 0, 0.06);
        }

        .social-followers-pill .count {
          font-size: 0.825rem;
          font-weight: 700;
          color: #1D1D1F;
        }

        .social-followers-pill .unit {
          font-size: 0.65rem;
          font-weight: 500;
          color: #86868B;
          text-transform: uppercase;
        }
      `}</style>
    </section>
  );
};
