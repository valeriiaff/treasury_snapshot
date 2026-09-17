export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  defaultFxRateToUsd: number; // 1 unit in USD
  color: string;
}

export const CURRENCY_METADATA: Record<string, CurrencyInfo> = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', defaultFxRateToUsd: 1.0, color: '#10B981' },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', defaultFxRateToUsd: 1.08, color: '#3B82F6' },
  PLN: { code: 'PLN', name: 'Polish Złoty', symbol: 'zł', flag: '🇵🇱', defaultFxRateToUsd: 0.25, color: '#F59E0B' },
  UAH: { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴', flag: '🇺🇦', defaultFxRateToUsd: 0.024, color: '#06B6D4' },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', defaultFxRateToUsd: 1.28, color: '#8B5CF6' },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', defaultFxRateToUsd: 0.0067, color: '#EC4899' },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', defaultFxRateToUsd: 0.74, color: '#14B8A6' },
  CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭', defaultFxRateToUsd: 1.13, color: '#6366F1' },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', defaultFxRateToUsd: 0.65, color: '#EAB308' },
  SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', defaultFxRateToUsd: 0.75, color: '#A855F7' },
  SEK: { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪', defaultFxRateToUsd: 0.096, color: '#38BDF8' },
  NOK: { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴', defaultFxRateToUsd: 0.093, color: '#84CC16' },
  BRL: { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', defaultFxRateToUsd: 0.18, color: '#22C55E' },
  KRW: { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷', defaultFxRateToUsd: 0.00073, color: '#C084FC' },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', defaultFxRateToUsd: 0.012, color: '#FB923C' },
  CNY: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', defaultFxRateToUsd: 0.14, color: '#F43F5E' },
  AED: { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪', defaultFxRateToUsd: 0.272, color: '#D97706' },
};

export const COLOR_PALETTE = [
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#F59E0B', // Amber
  '#06B6D4', // Cyan
  '#8B5CF6', // Purple
  '#EC4899', // Pink / Rose
  '#14B8A6', // Teal
  '#6366F1', // Indigo
  '#EAB308', // Gold
  '#A855F7', // Violet
  '#F43F5E', // Rose
  '#84CC16', // Lime
];

export function getCurrencyInfo(code: string): CurrencyInfo {
  const upper = (code || 'USD').toUpperCase().trim();
  if (CURRENCY_METADATA[upper]) {
    return CURRENCY_METADATA[upper];
  }
  // Deterministic color assignment for custom currencies
  let hash = 0;
  for (let i = 0; i < upper.length; i++) {
    hash = upper.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % COLOR_PALETTE.length;

  return {
    code: upper,
    name: `${upper} Currency`,
    symbol: upper,
    flag: '🌐',
    defaultFxRateToUsd: 1.0,
    color: COLOR_PALETTE[colorIndex],
  };
}
