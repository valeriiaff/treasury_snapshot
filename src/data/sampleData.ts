import { TreasuryAccount } from '../types';

export interface DemoPreset {
  id: string;
  name: string;
  description: string;
  fileName: string;
  csvContent: string;
  baseCurrency: string;
}

export const SAMPLE_CSV_CONTENT = `Bank Name,Account Name,Currency,Balance
JPMorgan Chase,Steam Valve Primary Payout,USD,14500000.00
JPMorgan Chase,PlayStation Store Settlements,USD,8920000.50
Bank of America,Epic Games Royalty Payout,USD,3410500.00
BNP Paribas,EU Publishing & Regional HQ,EUR,7250000.00
Deutsche Bank,Berlin Core R&D Operations,EUR,2180000.00
PKO Bank Polski,Warsaw Engine & Rendering Lab,PLN,18450000.00
Santander Bank Polska,Kraków Art Studio Payroll,PLN,6320000.00
PrivatBank,Kyiv Animation & Rigging Hub,UAH,42800000.00
Barclays,London Audio & Orchestral Stage,GBP,1890000.00
Mitsubishi UFJ,Tokyo QA & Localization Center,JPY,485000000
Royal Bank of Canada,Montreal Motion Capture Facility,CAD,3240000.00
UBS Switzerland,Zurich IP & Franchise Holdings,CHF,4150000.00`;

export const CONCENTRATION_ALERT_CSV = `Bank Name,Account Name,Currency,Balance
JPMorgan Chase,Primary Master Operating & Treasury Pool,USD,48500000.00
BNP Paribas,European Operations Working Capital,EUR,4200000.00
Barclays,UK & Sterling Settlement Account,GBP,2100000.00
PKO Bank Polski,Central European Payroll & Tax,PLN,9500000.00
UBS Switzerland,Strategic Reserve Escrow,CHF,3200000.00`;

export const EUROPEAN_TECH_CSV = `Bank Name,Account Name,Currency,Balance
BNP Paribas,Paris Headquarters Operating,EUR,18400000.00
Deutsche Bank,Frankfurt Cloud Infrastructure,EUR,9600000.00
Barclays,London R&D Innovation Lab,GBP,6200000.00
UBS Switzerland,Zurich IP Escrow & Royalties,CHF,14500000.00
Silicon Valley Bank,US Commercial & Subscriptions,USD,8100000.00
Nordea Bank,Stockholm Engineering Center,SEK,45000000.00`;

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'nexus_studios',
    name: 'Global Enterprise (Nexus Studios)',
    description: '12 accounts across 8 currencies (USD, EUR, PLN, UAH, GBP, JPY, CAD, CHF)',
    fileName: 'nexus_studios_global_treasury.csv',
    csvContent: SAMPLE_CSV_CONTENT,
    baseCurrency: 'USD',
  },
  {
    id: 'concentration_alert',
    name: 'Liquidity Alert Scenario (>50% Threshold)',
    description: 'Triggers red highlight alert where JPMorgan holds >65% of consolidated funds',
    fileName: 'high_concentration_alert_scenario.csv',
    csvContent: CONCENTRATION_ALERT_CSV,
    baseCurrency: 'USD',
  },
  {
    id: 'european_tech',
    name: 'European Tech Group (EUR Base)',
    description: 'EUR-denominated multi-entity corporate structure with 6 counterparties',
    fileName: 'european_tech_group_treasury.csv',
    csvContent: EUROPEAN_TECH_CSV,
    baseCurrency: 'EUR',
  },
];

export const SAMPLE_ACCOUNTS: TreasuryAccount[] = [
  {
    id: 'acc-1',
    bankName: 'JPMorgan Chase',
    accountName: 'Steam Valve Primary Payout',
    currency: 'USD',
    rawBalance: 14500000.0,
  },
  {
    id: 'acc-2',
    bankName: 'JPMorgan Chase',
    accountName: 'PlayStation Store Settlements',
    currency: 'USD',
    rawBalance: 8920000.5,
  },
  {
    id: 'acc-3',
    bankName: 'Bank of America',
    accountName: 'Epic Games Royalty Payout',
    currency: 'USD',
    rawBalance: 3410500.0,
  },
  {
    id: 'acc-4',
    bankName: 'BNP Paribas',
    accountName: 'EU Publishing & Regional HQ',
    currency: 'EUR',
    rawBalance: 7250000.0,
  },
  {
    id: 'acc-5',
    bankName: 'Deutsche Bank',
    accountName: 'Berlin Core R&D Operations',
    currency: 'EUR',
    rawBalance: 2180000.0,
  },
  {
    id: 'acc-6',
    bankName: 'PKO Bank Polski',
    accountName: 'Warsaw Engine & Rendering Lab',
    currency: 'PLN',
    rawBalance: 18450000.0,
  },
  {
    id: 'acc-7',
    bankName: 'Santander Bank Polska',
    accountName: 'Kraków Art Studio Payroll',
    currency: 'PLN',
    rawBalance: 6320000.0,
  },
  {
    id: 'acc-8',
    bankName: 'PrivatBank',
    accountName: 'Kyiv Animation & Rigging Hub',
    currency: 'UAH',
    rawBalance: 42800000.0,
  },
  {
    id: 'acc-9',
    bankName: 'Barclays',
    accountName: 'London Audio & Orchestral Stage',
    currency: 'GBP',
    rawBalance: 1890000.0,
  },
  {
    id: 'acc-10',
    bankName: 'Mitsubishi UFJ',
    accountName: 'Tokyo QA & Localization Center',
    currency: 'JPY',
    rawBalance: 485000000.0,
  },
  {
    id: 'acc-11',
    bankName: 'Royal Bank of Canada',
    accountName: 'Montreal Motion Capture Facility',
    currency: 'CAD',
    rawBalance: 3240000.0,
  },
  {
    id: 'acc-12',
    bankName: 'UBS Switzerland',
    accountName: 'Zurich IP & Franchise Holdings',
    currency: 'CHF',
    rawBalance: 4150000.0,
  },
];
