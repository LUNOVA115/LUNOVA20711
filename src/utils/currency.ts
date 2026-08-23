import { CurrencyCode, SUPPORTED_CURRENCIES } from '../types/currency';

/**
 * Format any numeric base price (in USD base) according to current active currency configuration.
 * Options allow hiding decimals, showing raw numbers, or passing custom exchange rate overrides.
 */
export function formatPrice(
  amountInUSD: number,
  currencyCode: CurrencyCode = 'USD',
  options?: {
    customRate?: number;
    showDecimals?: boolean;
    convertedDirectly?: boolean; // If true, amount is already in the target currency
  }
): string {
  const config = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.USD;
  const rate = options?.customRate !== undefined ? options.customRate : config.rateAgainstUSD;
  
  const converted = options?.convertedDirectly ? amountInUSD : amountInUSD * rate;
  const showDecimals = options?.showDecimals !== undefined ? options.showDecimals : config.decimals > 0;
  
  const formattedNumber = showDecimals
    ? converted.toLocaleString('en-US', {
        minimumFractionDigits: config.decimals,
        maximumFractionDigits: config.decimals,
      })
    : Math.round(converted).toLocaleString('en-US');

  switch (config.symbolPosition) {
    case 'prefix':
      return `${config.symbol}${formattedNumber}`;
    case 'prefix_space':
      return `${config.symbol} ${formattedNumber}`;
    case 'suffix':
      return `${formattedNumber}${config.symbol}`;
    case 'suffix_space':
      return `${formattedNumber} ${config.symbol}`;
    default:
      return `${config.symbol}${formattedNumber}`;
  }
}

/**
 * Helper to convert USD value into active currency numeric value
 */
export function convertFromUSD(amountInUSD: number, currencyCode: CurrencyCode = 'USD'): number {
  const config = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.USD;
  return amountInUSD * config.rateAgainstUSD;
}

/**
 * Helper to convert active currency numeric value back into USD value
 */
export function convertToUSD(amountInActive: number, currencyCode: CurrencyCode = 'USD'): number {
  const config = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.USD;
  return amountInActive / config.rateAgainstUSD;
}
