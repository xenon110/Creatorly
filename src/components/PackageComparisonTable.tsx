import React from 'react';
import type { ServicePackage, CurrencyCode } from '../types/creator';
import { formatCurrency } from '../data/currencies';
import { Check, X as XIcon, ArrowRight } from 'lucide-react';

interface PackageComparisonTableProps {
  packages: ServicePackage[];
  currentCurrency: CurrencyCode;
  onSelectPackage: (pkg: ServicePackage) => void;
}

export const PackageComparisonTable: React.FC<PackageComparisonTableProps> = ({
  packages,
  currentCurrency,
  onSelectPackage,
}) => {
  return (
    <div className="card comparison-table-wrapper">
      <div className="table-responsive">
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="feature-col-header">Deliverable & Terms</th>
              {packages.map((pkg) => (
                <th key={pkg.id} className={`package-col-header ${pkg.popular ? 'highlight-th' : ''}`}>
                  <div className="th-content">
                    <span className="th-title">{pkg.title}</span>
                    <span className="th-price">{formatCurrency(pkg.priceInINR, currentCurrency)}</span>
                    <button 
                      type="button" 
                      className={`btn btn-sm ${pkg.popular ? 'btn-primary' : 'btn-secondary'} btn-block`}
                      onClick={() => onSelectPackage(pkg)}
                    >
                      <span>Select</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="feature-label">Platform Distribution</td>
              {packages.map((p) => (
                <td key={p.id} className="feature-value font-medium">{p.platform}</td>
              ))}
            </tr>
            <tr>
              <td className="feature-label">Turnaround Time</td>
              {packages.map((p) => (
                <td key={p.id} className="feature-value">{p.deliveryDays} Business Days</td>
              ))}
            </tr>
            <tr>
              <td className="feature-label">Included Revisions</td>
              {packages.map((p) => (
                <td key={p.id} className="feature-value">{p.includedRevisions} Round</td>
              ))}
            </tr>
            <tr>
              <td className="feature-label">Organic Creator Feed Posting</td>
              {packages.map((p) => (
                <td key={p.id} className="feature-value">
                  {p.publishingIncluded ? (
                    <span className="table-check"><Check size={16} /> Yes</span>
                  ) : (
                    <span className="table-cross"><XIcon size={16} /> No (UGC file only)</span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="feature-label">Organic Brand Usage Rights</td>
              {packages.map((p) => (
                <td key={p.id} className="feature-value">
                  {p.organicUsageDays > 0 ? `${p.organicUsageDays} Days` : 'Not Applicable'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="feature-label">Paid Ad Commercial License</td>
              {packages.map((p) => (
                <td key={p.id} className="feature-value">
                  {p.paidUsageRightsIncluded ? (
                    <span className="table-check"><Check size={16} /> 90 Days Included</span>
                  ) : (
                    <span className="table-optional">Available via Add-on</span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="feature-label">Permanent Hosting</td>
              {packages.map((p) => (
                <td key={p.id} className="feature-value">
                  {p.platform === 'YouTube' ? (
                    <span className="table-check"><Check size={16} /> Lifetime</span>
                  ) : (
                    <span>Standard feed</span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="feature-label">Category Exclusivity Window</td>
              {packages.map((p) => (
                <td key={p.id} className="feature-value">
                  {p.id === 'pkg-multi-spotlight' ? '30 Days Guaranteed' : '14 Days Standard'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <style>{`
        .comparison-table-wrapper {
          margin-top: 24px;
          overflow: hidden;
          background-color: var(--bg-primary);
        }

        .table-responsive {
          overflow-x: auto;
          width: 100%;
        }

        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.85rem;
        }

        .feature-col-header {
          width: 28%;
          padding: 20px 24px;
          background-color: var(--bg-secondary);
          border-bottom: 2px solid var(--border-light);
          font-weight: 700;
          color: var(--text-primary);
        }

        .package-col-header {
          padding: 20px 16px;
          border-bottom: 2px solid var(--border-light);
          border-left: 1px solid var(--border-light);
          background-color: var(--bg-primary);
          vertical-align: top;
          min-width: 180px;
          transition: all 0.2s ease;
        }

        .package-col-header.highlight-th {
          background: linear-gradient(180deg, rgba(79, 70, 229, 0.08) 0%, rgba(124, 58, 237, 0.04) 100%);
          border-top: 3px solid #7C3AED;
          border-left: 2px solid rgba(124, 58, 237, 0.3);
          border-right: 2px solid rgba(124, 58, 237, 0.3);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.08);
        }

        .th-content {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .th-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .th-price {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--color-indigo);
          letter-spacing: -0.01em;
        }

        .comparison-table tbody tr {
          border-bottom: 1px solid var(--border-light);
          transition: background-color 0.15s ease;
        }

        .comparison-table tbody tr:hover {
          background-color: rgba(99, 102, 241, 0.04);
        }

        .feature-label {
          padding: 14px 24px;
          font-weight: 600;
          color: var(--text-secondary);
          background-color: #F8FAFC;
        }

        .feature-value {
          padding: 14px 16px;
          border-left: 1px solid var(--border-light);
          color: var(--text-primary);
        }

        .font-medium {
          font-weight: 600;
        }

        .table-check {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #059669;
          font-weight: 600;
          background: rgba(16, 185, 129, 0.1);
          padding: 2px 8px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .table-cross {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: var(--text-muted);
          font-size: 0.775rem;
        }

        .table-optional {
          color: #7C3AED;
          background: rgba(124, 58, 237, 0.08);
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-block;
        }
      `}</style>
    </div>
  );
};
