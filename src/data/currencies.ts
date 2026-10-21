import type { CurrencyCode, CurrencyConfig } from '../types/creator';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    rateAgainstINR: 1,
    locale: 'en-IN',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    rateAgainstINR: 0.012, // approx 1 INR = 0.012 USD (~83 INR/USD)
    locale: 'en-US',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    rateAgainstINR: 0.011, // approx 1 INR = 0.011 EUR
    locale: 'de-DE',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    rateAgainstINR: 0.0094,
    locale: 'en-GB',
  },
};

export function formatCurrency(amountInINR: number, currencyCode: CurrencyCode = 'INR'): string {
  const config = CURRENCIES[currencyCode] || CURRENCIES.INR;
  const converted = Math.round(amountInINR * config.rateAgainstINR);
  
  if (currencyCode === 'INR') {
    return `₹${amountInINR.toLocaleString('en-IN')}`;
  }
  
  return `${config.symbol}${converted.toLocaleString(config.locale)}`;
}

export function convertAmount(amountInINR: number, currencyCode: CurrencyCode = 'INR'): number {
  const config = CURRENCIES[currencyCode] || CURRENCIES.INR;
  return Math.round(amountInINR * config.rateAgainstINR);
}
