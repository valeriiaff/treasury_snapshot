import Papa from 'papaparse';
import { TreasuryAccount, CurrencySummary, BankSummary, FxRatesMap, TreasuryMetrics } from '../types';
import { getCurrencyInfo, CURRENCY_METADATA } from '../data/currencyMeta';

export interface ParseResult {
  accounts: TreasuryAccount[];
  currencies: string[];
  errors: string[];
  warning?: string;
}

export function parseTreasuryCsv(csvText: string): ParseResult {
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (header: string) => header.trim(),
  });

  const errors: string[] = [];
  const accounts: TreasuryAccount[] = [];
  const currenciesSet = new Set<string>();

  if (!result.data || result.data.length === 0) {
    return {
      accounts: [],
      currencies: [],
      errors: ['The CSV file is empty or could not be parsed.'],
    };
  }

  // Identify column headers flexibly
  const sampleRow = result.data[0] as Record<string, string>;
  const headers = Object.keys(sampleRow);

  const bankHeader = headers.find((h) =>
    /^(bank\s*name|bank|institution|financial\s*institution)$/i.test(h)
  ) || headers.find((h) => /bank/i.test(h)) || headers[0];

  const accountHeader = headers.find((h) =>
    /^(account\s*name|account|account\s*title|description|entity)$/i.test(h)
  ) || headers.find((h) => /account/i.test(h)) || headers[1];

  const currencyHeader = headers.find((h) =>
    /^(currency|ccy|curr|currency\s*code|iso)$/i.test(h)
  ) || headers.find((h) => /curr/i.test(h)) || headers[2];

  const balanceHeader = headers.find((h) =>
    /^(balance|amount|cash\s*balance|raw\s*balance|total)$/i.test(h)
  ) || headers.find((h) => /balance|amount/i.test(h)) || headers[3];

  if (!currencyHeader || !balanceHeader) {
    return {
      accounts: [],
      currencies: [],
      errors: [
        `Missing required columns. Expected "Bank Name", "Account Name", "Currency", and "Balance". Detected headers: ${headers.join(', ')}`,
      ],
    };
  }

  (result.data as Record<string, any>[]).forEach((row, index) => {
    const rawBank = String(row[bankHeader] || 'Unknown Bank').trim();
    const rawAccount = String(row[accountHeader] || `Account #${index + 1}`).trim();
    const rawCurrency = String(row[currencyHeader] || '').trim().toUpperCase();
    const rawBalanceStr = String(row[balanceHeader] || '').trim();

    if (!rawCurrency && !rawBalanceStr) {
      return; // Skip empty rows
    }

    // Clean balance string: remove currency symbols, spaces, commas
    let cleanBalanceStr = rawBalanceStr.replace(/[$€£¥₴zł,\s]/g, '');
    
    // Handle accounting parentheses: (1000) -> -1000
    if (cleanBalanceStr.startsWith('(') && cleanBalanceStr.endsWith(')')) {
      cleanBalanceStr = '-' + cleanBalanceStr.slice(1, -1);
    }

    const balanceNum = parseFloat(cleanBalanceStr);

    if (isNaN(balanceNum)) {
      errors.push(`Row ${index + 2}: Invalid balance value "${rawBalanceStr}" for account "${rawAccount}".`);
      return;
    }

    const currencyCode = rawCurrency || 'USD';
    currenciesSet.add(currencyCode);

    accounts.push({
      id: `acc-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 4)}`,
      bankName: rawBank,
      accountName: rawAccount,
      currency: currencyCode,
      rawBalance: balanceNum,
    });
  });

  return {
    accounts,
    currencies: Array.from(currenciesSet).sort(),
    errors,
  };
}

export function getDefaultFxRates(currencies: string[], baseCurrency: string = 'USD'): FxRatesMap {
  const rates: FxRatesMap = {};
  const baseUpper = baseCurrency.toUpperCase();
  const baseUsdRate = CURRENCY_METADATA[baseUpper]?.defaultFxRateToUsd || 1.0;

  currencies.forEach((curr) => {
    const currUpper = curr.toUpperCase();
    if (currUpper === baseUpper) {
      rates[currUpper] = 1.0;
    } else {
      const currUsdRate = CURRENCY_METADATA[currUpper]?.defaultFxRateToUsd || 1.0;
      // 1 unit of curr = (currUsdRate / baseUsdRate) units of baseCurrency
      const calculatedRate = currUsdRate / baseUsdRate;
      // Round to 6 decimal places for cleanliness
      rates[currUpper] = Math.round(calculatedRate * 1000000) / 1000000;
    }
  });

  // Ensure base currency is always 1.0
  rates[baseUpper] = 1.0;
  return rates;
}

export function calculateTreasuryConsolidation(
  accounts: TreasuryAccount[],
  fxRates: FxRatesMap,
  baseCurrency: string
): {
  normalizedAccounts: TreasuryAccount[];
  currencySummaries: CurrencySummary[];
  bankSummaries: BankSummary[];
  metrics: TreasuryMetrics;
} {
  const baseUpper = baseCurrency.toUpperCase();
  let totalConsolidatedLiquidity = 0;

  // 1. Normalize individual accounts
  const normalizedAccounts: TreasuryAccount[] = accounts.map((acc) => {
    const rate = fxRates[acc.currency] ?? (acc.currency === baseUpper ? 1.0 : 1.0);
    const normalizedBalance = acc.rawBalance * rate;
    totalConsolidatedLiquidity += normalizedBalance;

    return {
      ...acc,
      normalizedBalance,
    };
  });

  // 2. Group by Currency
  const currencyMap = new Map<string, {
    totalRaw: number;
    normalized: number;
    accounts: TreasuryAccount[];
  }>();

  normalizedAccounts.forEach((acc) => {
    if (!currencyMap.has(acc.currency)) {
      currencyMap.set(acc.currency, {
        totalRaw: 0,
        normalized: 0,
        accounts: [],
      });
    }
    const group = currencyMap.get(acc.currency)!;
    group.totalRaw += acc.rawBalance;
    group.normalized += acc.normalizedBalance || 0;
    group.accounts.push(acc);
  });

  const currencySummaries: CurrencySummary[] = Array.from(currencyMap.entries())
    .map(([curr, data]) => {
      const info = getCurrencyInfo(curr);
      const rate = fxRates[curr] ?? (curr === baseUpper ? 1.0 : 1.0);
      const percentageShare = totalConsolidatedLiquidity > 0
        ? (data.normalized / totalConsolidatedLiquidity) * 100
        : 0;

      return {
        currency: curr,
        currencyName: info.name,
        flag: info.flag,
        accountCount: data.accounts.length,
        totalRawBalance: data.totalRaw,
        fxRate: rate,
        normalizedBalance: data.normalized,
        percentageShare,
        color: info.color,
        accounts: data.accounts,
      };
    })
    .sort((a, b) => b.normalizedBalance - a.normalizedBalance);

  // 3. Group by Bank
  const bankMap = new Map<string, {
    normalized: number;
    currencies: Set<string>;
    accounts: TreasuryAccount[];
  }>();

  normalizedAccounts.forEach((acc) => {
    if (!bankMap.has(acc.bankName)) {
      bankMap.set(acc.bankName, {
        normalized: 0,
        currencies: new Set<string>(),
        accounts: [],
      });
    }
    const group = bankMap.get(acc.bankName)!;
    group.normalized += acc.normalizedBalance || 0;
    group.currencies.add(acc.currency);
    group.accounts.push(acc);
  });

  const bankSummaries: BankSummary[] = Array.from(bankMap.entries())
    .map(([bankName, data]) => {
      const percentageShare = totalConsolidatedLiquidity > 0
        ? (data.normalized / totalConsolidatedLiquidity) * 100
        : 0;

      return {
        bankName,
        accountCount: data.accounts.length,
        normalizedBalance: data.normalized,
        percentageShare,
        currencies: Array.from(data.currencies),
        accounts: data.accounts,
      };
    })
    .sort((a, b) => b.normalizedBalance - a.normalizedBalance);

  // 4. Metrics & Risk
  const dominant = currencySummaries[0] || {
    currency: baseUpper,
    percentageShare: 0,
  };

  const nonBaseExposureValue = currencySummaries
    .filter((c) => c.currency !== baseUpper)
    .reduce((sum, c) => sum + c.normalizedBalance, 0);

  const nonBaseExposureShare = totalConsolidatedLiquidity > 0
    ? (nonBaseExposureValue / totalConsolidatedLiquidity) * 100
    : 0;

  const uniqueBanks = new Set(accounts.map((a) => a.bankName));

  const metrics: TreasuryMetrics = {
    totalConsolidatedLiquidity,
    baseCurrency: baseUpper,
    totalAccountsCount: accounts.length,
    totalBanksCount: uniqueBanks.size,
    dominantCurrency: dominant.currency,
    dominantCurrencyShare: dominant.percentageShare,
    nonBaseExposureValue,
    nonBaseExposureShare,
  };

  return {
    normalizedAccounts,
    currencySummaries,
    bankSummaries,
    metrics,
  };
}

export function formatCurrencyAmount(
  amount: number,
  currencyCode: string,
  options: { compact?: boolean; precision?: number } = {}
): string {
  const { compact = false, precision = 2 } = options;
  const curr = currencyCode.toUpperCase();
  const info = getCurrencyInfo(curr);

  if (compact) {
    if (Math.abs(amount) >= 1_000_000_000) {
      return `${(amount / 1_000_000_000).toFixed(2)}B ${curr}`;
    }
    if (Math.abs(amount) >= 1_000_000) {
      return `${(amount / 1_000_000).toFixed(2)}M ${curr}`;
    }
    if (Math.abs(amount) >= 1_000) {
      return `${(amount / 1_000).toFixed(1)}k ${curr}`;
    }
  }

  const formattedNum = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(amount);

  return `${info.symbol} ${formattedNum}`;
}
