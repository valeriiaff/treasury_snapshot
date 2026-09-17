export interface TreasuryAccount {
  id: string;
  bankName: string;
  accountName: string;
  currency: string;
  rawBalance: number;
  normalizedBalance?: number;
}

export interface CurrencySummary {
  currency: string;
  currencyName: string;
  flag: string;
  accountCount: number;
  totalRawBalance: number;
  fxRate: number; // 1 unit of Currency = fxRate units of Base Currency
  normalizedBalance: number;
  percentageShare: number;
  color: string;
  accounts: TreasuryAccount[];
}

export interface BankSummary {
  bankName: string;
  accountCount: number;
  normalizedBalance: number;
  percentageShare: number;
  currencies: string[];
  accounts: TreasuryAccount[];
}

export type FxRatesMap = Record<string, number>;

export interface TreasuryMetrics {
  totalConsolidatedLiquidity: number;
  baseCurrency: string;
  totalAccountsCount: number;
  totalBanksCount: number;
  dominantCurrency: string;
  dominantCurrencyShare: number;
  nonBaseExposureValue: number;
  nonBaseExposureShare: number;
}
