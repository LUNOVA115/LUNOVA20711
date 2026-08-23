export type CurrencyCode = 'USD' | 'PKR' | 'EUR' | 'GBP' | 'CAD' | 'AED' | 'SAR' | 'JPY' | 'AUD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateAgainstUSD: number; // 1 USD = X Currency
  decimals: number;
  symbolPosition: 'prefix' | 'suffix' | 'prefix_space' | 'suffix_space';
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar (USD)',
    rateAgainstUSD: 1,
    decimals: 2,
    symbolPosition: 'prefix',
  },
  PKR: {
    code: 'PKR',
    symbol: 'Rs.',
    name: 'Pakistani Rupee (PKR)',
    rateAgainstUSD: 278.5,
    decimals: 0,
    symbolPosition: 'prefix_space',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro (EUR)',
    rateAgainstUSD: 0.92,
    decimals: 2,
    symbolPosition: 'prefix',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound (GBP)',
    rateAgainstUSD: 0.79,
    decimals: 2,
    symbolPosition: 'prefix',
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    name: 'Canadian Dollar (CAD)',
    rateAgainstUSD: 1.36,
    decimals: 2,
    symbolPosition: 'prefix',
  },
  AED: {
    code: 'AED',
    symbol: 'AED',
    name: 'UAE Dirham (AED)',
    rateAgainstUSD: 3.67,
    decimals: 2,
    symbolPosition: 'prefix_space',
  },
  SAR: {
    code: 'SAR',
    symbol: 'SAR',
    name: 'Saudi Riyal (SAR)',
    rateAgainstUSD: 3.75,
    decimals: 2,
    symbolPosition: 'prefix_space',
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen (JPY)',
    rateAgainstUSD: 155.0,
    decimals: 0,
    symbolPosition: 'prefix',
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar (AUD)',
    rateAgainstUSD: 1.52,
    decimals: 2,
    symbolPosition: 'prefix',
  },
};

export const DEFAULT_CURRENCY: CurrencyCode = 'PKR';
